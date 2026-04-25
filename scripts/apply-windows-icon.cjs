const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

exports.default = async function applyWindowsIcon(context) {
  if (context.electronPlatformName !== "win32") {
    return;
  }

  const projectRoot = context.packager.projectDir;
  const exePath = path.join(
    context.appOutDir,
    `${context.packager.appInfo.productFilename}.exe`
  );
  const iconPath = path.join(projectRoot, "build", "icon.ico");
  const rceditPath = path.join(
    projectRoot,
    "node_modules",
    "electron-winstaller",
    "vendor",
    "rcedit.exe"
  );

  for (const requiredPath of [exePath, iconPath, rceditPath]) {
    if (!fs.existsSync(requiredPath)) {
      throw new Error(`Windows icon step missing required file: ${requiredPath}`);
    }
  }

  execFileSync(rceditPath, [exePath, "--set-icon", iconPath], {
    stdio: "inherit"
  });
};
