const { spawn } = require("child_process");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const electronBinary = require("electron");
const { generateAudioManifest } = require("./generate-audio-manifest.cjs");
const env = { ...process.env };

delete env.ELECTRON_RUN_AS_NODE;

generateAudioManifest(projectRoot);

const child = spawn(electronBinary, [".", ...process.argv.slice(2)], {
  cwd: projectRoot,
  env,
  stdio: "inherit",
  windowsHide: false
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
