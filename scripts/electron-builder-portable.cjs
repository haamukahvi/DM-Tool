const packageJson = require("../package.json");

const externalAudioPatterns = new Set([
  "dnd music/**/*",
  "sfx/**/*"
]);

module.exports = {
  ...packageJson.build,
  win: {
    ...packageJson.build.win,
    target: ["portable"]
  },
  files: packageJson.build.files.filter((pattern) => !externalAudioPatterns.has(pattern))
};
