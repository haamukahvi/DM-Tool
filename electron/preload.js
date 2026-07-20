const { contextBridge, ipcRenderer } = require("electron");

const pendingMusicCommands = [];
const musicCommandListeners = new Set();

ipcRenderer.on("dmtool:music-command", (_event, command) => {
  if (!command || typeof command !== "object") {
    return;
  }

  if (musicCommandListeners.size === 0) {
    pendingMusicCommands.push(command);
    return;
  }

  musicCommandListeners.forEach((listener) => listener(command));
});

contextBridge.exposeInMainWorld("dmDesktop", {
  isDesktop: true,
  platform: process.platform,
  assetBaseUrl: process.env.DMTOOL_ASSET_BASE_URL || "",
  geminiApiKey: {
    get: () => ipcRenderer.invoke("dmtool:gemini-api-key:get"),
    set: (value) => ipcRenderer.invoke("dmtool:gemini-api-key:set", value),
    clear: () => ipcRenderer.invoke("dmtool:gemini-api-key:clear")
  },
  lootTables: {
    get: () => ipcRenderer.invoke("dmtool:loot-tables:get")
  },
  backgroundImages: {
    saveGenerated: (payload) => ipcRenderer.invoke("dmtool:background-images:save-generated", payload)
  },
  onMusicCommand: (callback) => {
    if (typeof callback !== "function") {
      return () => {};
    }

    musicCommandListeners.add(callback);
    while (pendingMusicCommands.length > 0) {
      callback(pendingMusicCommands.shift());
    }

    return () => {
      musicCommandListeners.delete(callback);
    };
  }
});
