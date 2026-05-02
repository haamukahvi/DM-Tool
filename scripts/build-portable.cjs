const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const builderCli = path.join(projectRoot, "node_modules", "electron-builder", "cli.js");
const portableBuilderConfig = path.join(projectRoot, "scripts", "electron-builder-portable.cjs");
const env = { ...process.env };

delete env.ELECTRON_RUN_AS_NODE;

const child = spawn(process.execPath, [builderCli, "--win", "portable", "--config", portableBuilderConfig], {
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

  if (code !== 0) {
    process.exit(code ?? 1);
    return;
  }

  const builtArtifact = path.join(projectRoot, "dist", "DM Tool-Portable.exe");
  const rootArtifact = path.join(projectRoot, "DM Tool Portable.exe");

  if (!fs.existsSync(builtArtifact)) {
    console.error(`Portable build completed but artifact was not found: ${builtArtifact}`);
    process.exit(1);
    return;
  }

  fs.copyFileSync(builtArtifact, rootArtifact);
  console.log(`Portable executable copied to ${rootArtifact}`);
});
