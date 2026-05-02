const packageJson = require("../package.json");

const externalAudioPatterns = new Set([
  "dnd music/**/*",
  "sfx/**/*"
]);

module.exports = {
  ...packageJson.build,
  files: packageJson.build.files.filter((pattern) => !externalAudioPatterns.has(pattern))
};
