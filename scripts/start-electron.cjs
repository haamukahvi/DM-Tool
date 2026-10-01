const { spawn } = require("child_process");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const electronBinary = require("electron");
const { generateAudioManifest, generateAudioWaveforms } = require("./generate-audio-manifest.cjs");
const env = { ...process.env };

delete env.ELECTRON_RUN_AS_NODE;

async function start() {
  try {
    const waveformResult = await generateAudioWaveforms(projectRoot);
    if (waveformResult.generatedCount > 0 || waveformResult.failedCount > 0) {
      console.log(`Waveforms: ${waveformResult.generatedCount} generated, ${waveformResult.reusedCount} reused, ${waveformResult.failedCount} failed.`);
    }
  } catch (err) {
    console.warn(`Automatic waveform generation skipped: ${err.message || err}`);
  }

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
}

start().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
