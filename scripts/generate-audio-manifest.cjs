const fs = require("fs");
const path = require("path");

const AUDIO_EXTENSIONS = new Set([".mp3", ".ogg", ".wav", ".m4a", ".flac"]);
const MUSIC_FOLDER = "dnd music";
const AMBIENCE_FOLDER = path.join(MUSIC_FOLDER, "Ambience");
const SFX_FOLDER = "sfx";
const OUTPUT_FILE = path.join("data", "audio-manifest.js");
const JSON_OUTPUT_FILE = path.join("data", "audio-manifest.json");
const MUSIC_EXCLUDED_FOLDERS = new Set(["ambience", "_new"]);

const MUSIC_CATEGORIES = [
  "Action",
  "Adventure",
  "Atmos",
  "Location",
  "Mystic",
  "Pre-Battle",
  "Battle",
  "Calm",
  "Death",
  "Inn",
  "Moment",
  "Sad",
  "Suspense",
  "Tension",
  "Town",
  "Neutral"
];

const MUSIC_TAG_ALIASES = [
  { tag: "Pre-Battle", words: ["prebattle", "pre-battle"] },
  { tag: "Battle", words: ["battle", "brawl", "fight"] },
  { tag: "Action", words: ["action", "ambush", "attack", "chase", "encounter", "event", "exciting", "scheme", "shouting"] },
  { tag: "Adventure", words: ["adventure"] },
  { tag: "Atmos", words: ["ambience", "atmos", "background"] },
  {
    tag: "Location",
    words: [
      "ashenvale",
      "arena",
      "azhara",
      "azshara",
      "azjolnerub",
      "azjol-nerub",
      "barrens",
      "beach",
      "blackrock",
      "bootybay",
      "booty bay",
      "burningsteppes",
      "burning steppes",
      "carriage",
      "cave",
      "corridor",
      "corridors",
      "darkmoonfaire",
      "darkmoon faire",
      "dungeon",
      "dustwallow",
      "everlook",
      "fjord",
      "forge",
      "furbolg",
      "gate",
      "graveyard",
      "hall",
      "hatchery",
      "hq",
      "island",
      "jungle",
      "marsh",
      "moonglade",
      "mudprocket",
      "mudsprocket",
      "murokellari",
      "orgrimmar",
      "pools",
      "prison",
      "ratchet",
      "relicroom",
      "relic room",
      "room",
      "slums",
      "town",
      "twilight",
      "valley",
      "vault",
      "winterspring",
      "twistingnether",
      "twisting nether",
      "zul"
    ]
  },
  { tag: "Mystic", words: ["arcane", "cult", "magic", "mystic", "ritual", "shaman", "temple", "void"] },
  { tag: "Calm", words: ["calm", "relaxing"] },
  { tag: "Death", words: ["death"] },
  { tag: "Inn", words: ["bar", "beerfest", "club", "drinking", "inn", "tavern"] },
  { tag: "Moment", words: ["moment"] },
  { tag: "Sad", words: ["sad", "somber"] },
  { tag: "Suspense", words: ["hallucination", "horror", "mystery", "nightmare", "susp", "suspense", "terror", "unnerving"] },
  { tag: "Tension", words: ["danger", "dangerous", "looming", "stealth", "tension"] },
  { tag: "Town", words: ["bootybay", "booty bay", "casino", "city", "everlook", "g mart", "gmart", "mudprocket", "mudsprocket", "orgrimmar", "ratchet", "town"] },
  { tag: "Neutral", words: ["neutral", "waiting"] }
];

const MUSIC_TITLE_PREFIX_ALIASES = new Set([
  "background",
  "chase",
  "encounter",
  "event",
  "prebattle",
  "pre-battle",
  "somber",
  "waiting"
]);

const AMBIENCE_CATEGORIES = [
  "Weather",
  "Nature",
  "Forest",
  "Cave",
  "Dungeon",
  "Inn",
  "Town",
  "Interior",
  "Travel",
  "Water",
  "Wind",
  "Fire",
  "Magic",
  "Dark",
  "Storm",
  "Mountain"
];

function walkFiles(rootDir, options = {}) {
  if (!fs.existsSync(rootDir)) {
    return [];
  }

  const results = [];
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  entries.forEach((entry) => {
    const fullPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      if (options.excludedFolders && options.excludedFolders.has(entry.name.toLowerCase())) {
        return;
      }
      results.push(...walkFiles(fullPath, options));
      return;
    }

    if (entry.isFile() && AUDIO_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      results.push(fullPath);
    }
  });
  return results;
}

function toWebPath(filePath) {
  return filePath.split(path.sep).map(encodeURIComponent).join("/");
}

function splitWords(value) {
  return value
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+\(\d+\)$/g, "")
    .replace(/\s+\d+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function parseMusicTags(fileName, folderPath = "") {
  const normalizedName = normalize(`${fileName} ${folderPath}`);
  const tags = MUSIC_TAG_ALIASES
    .filter(({ words }) => words.some((word) => normalizedName.includes(normalize(word))))
    .map(({ tag }) => tag)
    .filter((tag, index, tags) => tags.indexOf(tag) === index);
  return tags.includes("Pre-Battle") ? tags.filter((tag) => tag !== "Battle") : tags;
}

function stripLeadingTags(title, tags) {
  let nextTitle = title;
  const prefixes = [...tags];
  MUSIC_TAG_ALIASES.forEach(({ tag, words }) => {
    if (!tags.includes(tag)) {
      return;
    }
    words.forEach((word) => {
      if (MUSIC_TITLE_PREFIX_ALIASES.has(word)) {
        prefixes.push(word);
      }
    });
  });

  prefixes
    .sort((a, b) => normalize(b).length - normalize(a).length)
    .forEach((tag) => {
      const tagWordCount = splitWords(tag).split(" ").length;
      const words = nextTitle.split(" ");
      const leadingWords = words.slice(0, tagWordCount).join(" ");
      if (normalize(leadingWords) === normalize(tag)) {
        nextTitle = words.slice(tagWordCount).join(" ").trim();
      }
    });
  return nextTitle;
}

function parseAmbienceTags(fileName) {
  const normalizedName = normalize(fileName);
  const tags = [];
  const add = (tag) => {
    if (!tags.includes(tag)) tags.push(tag);
  };

  if (/rain|thunder|storm|snow|arctic|cold|frozen/.test(normalizedName)) add("Weather");
  if (/forest|jungle|swamp|field|savannah|grass/.test(normalizedName)) add("Nature");
  if (/forest/.test(normalizedName)) add("Forest");
  if (/cave|depths|spidercave/.test(normalizedName)) add("Cave");
  if (/dungeon/.test(normalizedName)) add("Dungeon");
  if (/inn|tavern/.test(normalizedName)) add("Inn");
  if (/town|bilgewater|bootybay|everlook|orgrimmar/.test(normalizedName)) add("Town");
  if (/interior|hall|stables/.test(normalizedName)) add("Interior");
  if (/carriage|horseback|ship/.test(normalizedName)) add("Travel");
  if (/water|lake|beach|coast|wet|nazjatar/.test(normalizedName)) add("Water");
  if (/wind|storm|rainstorm/.test(normalizedName)) add("Wind");
  if (/fire|burning/.test(normalizedName)) add("Fire");
  if (/magic|arcane|cult|void/.test(normalizedName)) add("Magic");
  if (/dark|gloom|horror|evil|void|death/.test(normalizedName)) add("Dark");
  if (/storm|thunder/.test(normalizedName)) add("Storm");
  if (/mountain/.test(normalizedName)) add("Mountain");

  return tags;
}

function toRelativeFolder(baseDir, filePath) {
  if (!baseDir) {
    return "";
  }

  const relativeDir = path.relative(baseDir, path.dirname(filePath));
  if (!relativeDir || relativeDir === ".") {
    return "";
  }
  return relativeDir.split(path.sep).join("/");
}

function buildItem(projectRoot, filePath, type, options = {}) {
  const relativePath = path.relative(projectRoot, filePath);
  const fileName = path.basename(filePath);
  const stats = fs.statSync(filePath);
  let title = splitWords(fileName).replace(/^Ambience\s+/i, "");
  const item = {
    title: title || fileName,
    file: toWebPath(relativePath),
    fileName,
    modifiedAt: stats.mtimeMs
  };

  if (type === "music") {
    const folderPath = toRelativeFolder(options.baseDir, filePath);
    const tags = parseMusicTags(fileName, folderPath);
    title = stripLeadingTags(title, tags);
    item.title = title || tags[0] || item.title;
    item.tags = tags;
    item.folderPath = folderPath;
  } else if (type === "ambience") {
    item.tags = parseAmbienceTags(fileName);
  }

  return item;
}

function generateAudioManifest(projectRoot = path.resolve(__dirname, "..")) {
  const musicRoot = path.join(projectRoot, MUSIC_FOLDER);
  const ambienceRoot = path.join(projectRoot, AMBIENCE_FOLDER);
  const sfxRoot = path.join(projectRoot, SFX_FOLDER);
  const outputPath = path.join(projectRoot, OUTPUT_FILE);
  const jsonOutputPath = path.join(projectRoot, JSON_OUTPUT_FILE);

  const music = walkFiles(musicRoot, { excludedFolders: MUSIC_EXCLUDED_FOLDERS })
    .map((filePath) => buildItem(projectRoot, filePath, "music", { baseDir: musicRoot }))
    .sort((a, b) => a.title.localeCompare(b.title));
  const ambience = walkFiles(ambienceRoot)
    .map((filePath) => buildItem(projectRoot, filePath, "ambience"))
    .sort((a, b) => a.title.localeCompare(b.title));
  const sfx = walkFiles(sfxRoot)
    .map((filePath) => buildItem(projectRoot, filePath, "sfx"))
    .sort((a, b) => a.title.localeCompare(b.title));

  const manifest = {
    musicCategories: MUSIC_CATEGORIES,
    ambienceCategories: AMBIENCE_CATEGORIES,
    ambience,
    music,
    sfx
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(
    outputPath,
    `window.DM_AUDIO_MANIFEST = ${JSON.stringify(manifest, null, 2)};\n`,
    "utf8"
  );
  fs.writeFileSync(jsonOutputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  return { outputPath, jsonOutputPath, ambienceCount: ambience.length, musicCount: music.length, sfxCount: sfx.length };
}

if (require.main === module) {
  const result = generateAudioManifest();
  console.log(`Generated ${path.relative(process.cwd(), result.outputPath)} (${result.ambienceCount} ambience, ${result.musicCount} music, ${result.sfxCount} sfx).`);
}

module.exports = { generateAudioManifest };
