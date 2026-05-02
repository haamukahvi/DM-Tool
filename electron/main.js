const { app, BrowserWindow, Menu, ipcMain, safeStorage, shell } = require("electron");
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const { generateAudioManifest } = require("../scripts/generate-audio-manifest.cjs");

let mainWindow = null;
let focusRefreshTimer = null;
let pendingMusicCommand = null;
const PROTOCOL = "dmtool";
const GEMINI_API_KEY_FILE = "gemini-api-key.bin";
const ASSET_BASE_URL_ENV = "DMTOOL_ASSET_BASE_URL";

function getAppIconPath() {
  return path.join(app.getAppPath(), "icon.png");
}

function getAudioManifestPath() {
  return path.join(app.getAppPath(), "data", "audio-manifest.js");
}

function getLootTablesPath() {
  return path.join(app.getAppPath(), "data", "loot-tables.json");
}

function getSecretsDirPath() {
  return path.join(app.getPath("userData"), "secrets");
}

function getGeminiApiKeyPath() {
  return path.join(getSecretsDirPath(), GEMINI_API_KEY_FILE);
}

function getPortableAssetBaseUrl() {
  if (!app.isPackaged || !process.env.PORTABLE_EXECUTABLE_DIR) {
    return "";
  }

  const portableDir = process.env.PORTABLE_EXECUTABLE_DIR;
  const portableRoot = portableDir.endsWith(path.sep) ? portableDir : `${portableDir}${path.sep}`;
  return pathToFileURL(portableRoot).href;
}

function configureAssetBaseUrl() {
  const assetBaseUrl = getPortableAssetBaseUrl();
  if (assetBaseUrl) {
    process.env[ASSET_BASE_URL_ENV] = assetBaseUrl;
  } else {
    delete process.env[ASSET_BASE_URL_ENV];
  }
}

function readAudioManifest() {
  try {
    return fs.readFileSync(getAudioManifestPath(), "utf8");
  } catch (err) {
    return "";
  }
}

async function readLootTables() {
  const text = await fs.promises.readFile(getLootTablesPath(), "utf8");
  return JSON.parse(text);
}

async function readGeminiApiKey() {
  try {
    const encrypted = await fs.promises.readFile(getGeminiApiKeyPath());
    return safeStorage.decryptString(encrypted);
  } catch (err) {
    if (err && err.code !== "ENOENT") {
      console.warn("Unable to read stored Gemini API key.", err);
    }
    return "";
  }
}

async function writeGeminiApiKey(value) {
  const apiKey = typeof value === "string" ? value.trim() : "";

  if (!apiKey) {
    await clearGeminiApiKey();
    return false;
  }

  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error("Secure OS credential storage is not available.");
  }

  await fs.promises.mkdir(getSecretsDirPath(), { recursive: true });
  const encrypted = safeStorage.encryptString(apiKey);
  await fs.promises.writeFile(getGeminiApiKeyPath(), encrypted, { mode: 0o600 });
  return true;
}

async function clearGeminiApiKey() {
  try {
    await fs.promises.rm(getGeminiApiKeyPath(), { force: true });
  } catch (err) {
    console.warn("Unable to clear stored Gemini API key.", err);
  }
}

function reloadMainWindow() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.reloadIgnoringCache();
  }
}

function refreshAudioManifestAndReloadIfChanged() {
  if (app.isPackaged) {
    return;
  }

  const before = readAudioManifest();
  generateAudioManifest(app.getAppPath());
  const after = readAudioManifest();

  if (before !== after) {
    reloadMainWindow();
  }
}

function scheduleFocusRefresh() {
  if (app.isPackaged) {
    return;
  }

  clearTimeout(focusRefreshTimer);
  focusRefreshTimer = setTimeout(() => {
    refreshAudioManifestAndReloadIfChanged();
  }, 250);
}

function registerProtocolClient() {
  if (process.defaultApp) {
    app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, [app.getAppPath()]);
    return;
  }

  app.setAsDefaultProtocolClient(PROTOCOL);
}

function parseDmToolUrl(value) {
  if (!value || typeof value !== "string" || !value.toLowerCase().startsWith(`${PROTOCOL}://`)) {
    return null;
  }

  let url;
  try {
    url = new URL(value);
  } catch (err) {
    return null;
  }

  const host = url.hostname.toLowerCase();
  const action = url.pathname.replace(/^\/+/, "").toLowerCase();
  if (host !== "music" || action !== "play") {
    return null;
  }

  const file = url.searchParams.get("file");
  if (!file) {
    return null;
  }

  return {
    type: "play",
    file,
    receivedAt: Date.now()
  };
}

function getProtocolCommandFromArgv(argv) {
  const urlArg = argv.find((arg) => typeof arg === "string" && arg.toLowerCase().startsWith(`${PROTOCOL}://`));
  return parseDmToolUrl(urlArg);
}

function sendMusicCommand(command) {
  if (!command) {
    return;
  }

  if (!mainWindow || mainWindow.isDestroyed() || mainWindow.webContents.isLoading()) {
    pendingMusicCommand = command;
    return;
  }

  mainWindow.show();
  mainWindow.focus();
  mainWindow.webContents.send("dmtool:music-command", command);
}

function flushPendingMusicCommand() {
  if (!pendingMusicCommand) {
    return;
  }

  const command = pendingMusicCommand;
  pendingMusicCommand = null;
  sendMusicCommand(command);
}

function toggleAlwaysOnTop() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }

  const nextValue = !mainWindow.isAlwaysOnTop();
  mainWindow.setAlwaysOnTop(nextValue, "screen-saver");
}

function createMenu() {
  const template = [
    {
      label: "File",
      submenu: [
        {
          role: "quit"
        }
      ]
    },
    {
      label: "Window",
      submenu: [
        {
          label: "Toggle Floating",
          accelerator: "Ctrl+Shift+P",
          click: () => toggleAlwaysOnTop()
        },
        {
          role: "minimize"
        },
        {
          role: "zoom"
        }
      ]
    },
    {
      label: "View",
      submenu: [
        {
          role: "reload"
        },
        {
          role: "forceReload"
        },
        {
          role: "toggleDevTools"
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function registerSecretHandlers() {
  ipcMain.handle("dmtool:gemini-api-key:get", () => readGeminiApiKey());
  ipcMain.handle("dmtool:gemini-api-key:set", (_event, value) => writeGeminiApiKey(value));
  ipcMain.handle("dmtool:gemini-api-key:clear", () => clearGeminiApiKey());
}

function registerLootTableHandlers() {
  ipcMain.handle("dmtool:loot-tables:get", () => readLootTables());
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1520,
    height: 960,
    minWidth: 420,
    minHeight: 520,
    autoHideMenuBar: true,
    title: "DM Tool",
    icon: getAppIconPath(),
    backgroundColor: "#0a0a0f",
    alwaysOnTop: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      backgroundThrottling: false
    }
  });

  mainWindow.loadFile(path.join(app.getAppPath(), "Index.html"));

  mainWindow.webContents.on("did-finish-load", () => {
    flushPendingMusicCommand();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.on("focus", () => {
    scheduleFocusRefresh();
  });
}

async function watchForDevReload() {
  if (app.isPackaged) {
    return;
  }

  let chokidar;
  try {
    ({ default: chokidar } = await import("chokidar"));
  } catch (err) {
    console.warn("Dev reload disabled: chokidar is not available.", err);
    return;
  }

  const watcher = chokidar.watch(
    [
      "Index.html",
      "Ambience.html",
      "ArcaneSurge.html",
      "Roller.html",
      "electron/**/*.js",
      "data/**/*",
      "dnd music/**/*",
      "img/**/*",
      "sfx/**/*",
      "tracks/**/*"
    ],
    {
      cwd: app.getAppPath(),
      ignored: ["node_modules/**", "dist/**"],
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 150,
        pollInterval: 50
      }
    }
  );

  let reloadTimer = null;
  watcher.on("all", (eventName, changedPath) => {
    clearTimeout(reloadTimer);
    reloadTimer = setTimeout(() => {
      const normalizedPath = changedPath ? changedPath.replace(/\\/g, "/") : "";
      if (/^dnd music\//.test(normalizedPath) || /^sfx\//.test(normalizedPath)) {
        refreshAudioManifestAndReloadIfChanged();
        return;
      }

      reloadMainWindow();
    }, 100);
  });

  app.on("before-quit", () => {
    watcher.close();
  });
}

const gotSingleInstanceLock = app.requestSingleInstanceLock();

if (!gotSingleInstanceLock) {
  app.quit();
} else {
  app.on("second-instance", (_event, argv) => {
    const command = getProtocolCommandFromArgv(argv);
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.show();
      mainWindow.focus();
    } else {
      createMainWindow();
    }
    sendMusicCommand(command);
  });

  app.on("open-url", (event, url) => {
    event.preventDefault();
    sendMusicCommand(parseDmToolUrl(url));
  });

  app.whenReady().then(() => {
    configureAssetBaseUrl();
    registerProtocolClient();
    registerSecretHandlers();
    registerLootTableHandlers();
    pendingMusicCommand = getProtocolCommandFromArgv(process.argv) || pendingMusicCommand;
    createMenu();
    createMainWindow();
    watchForDevReload();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
      }
    });
  });
}

app.on("window-all-closed", () => {
  app.quit();
});
