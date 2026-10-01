const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn, spawnSync } = require("child_process");

const AUDIO_EXTENSIONS = new Set([".mp3", ".ogg", ".wav", ".m4a", ".flac"]);
const MUSIC_FOLDER = "dnd music";
const AMBIENCE_FOLDER = path.join(MUSIC_FOLDER, "Ambience");
const SFX_FOLDER = "sfx";
const OUTPUT_FILE = path.join("data", "audio-manifest.js");
const JSON_OUTPUT_FILE = path.join("data", "audio-manifest.json");
const WAVEFORM_CACHE_FILE = path.join("data", "audio-waveforms.json");
const MUSIC_EXCLUDED_FOLDERS = new Set(["ambience", "_new"]);
const WAVEFORM_CACHE_VERSION = 1;
const WAVEFORM_PEAK_COUNT = 220;
const WAVEFORM_IMAGE_HEIGHT = 64;

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

function readWaveformCache(projectRoot) {
  const cachePath = path.join(projectRoot, WAVEFORM_CACHE_FILE);
  try {
    const parsed = JSON.parse(fs.readFileSync(cachePath, "utf8"));
    if (parsed?.version === WAVEFORM_CACHE_VERSION && parsed?.peakCount === WAVEFORM_PEAK_COUNT && parsed?.tracks) {
      return parsed;
    }
  } catch (err) {
    if (err?.code !== "ENOENT") {
      console.warn(`Ignoring invalid waveform cache at ${cachePath}: ${err.message}`);
    }
  }
  return {
    version: WAVEFORM_CACHE_VERSION,
    peakCount: WAVEFORM_PEAK_COUNT,
    tracks: {}
  };
}

function writeTextIfChanged(filePath, contents) {
  try {
    if (fs.readFileSync(filePath, "utf8") === contents) return false;
  } catch (err) {
    if (err?.code !== "ENOENT") throw err;
  }
  fs.writeFileSync(filePath, contents, "utf8");
  return true;
}

function writeWaveformCache(projectRoot, cache) {
  const cachePath = path.join(projectRoot, WAVEFORM_CACHE_FILE);
  fs.mkdirSync(path.dirname(cachePath), { recursive: true });
  writeTextIfChanged(cachePath, `${JSON.stringify(cache, null, 2)}\n`);
  return cachePath;
}

function getCachedWaveform(cache, webPath, stats) {
  const cached = cache?.tracks?.[webPath];
  if (!cached || cached.size !== stats.size || cached.modifiedAt !== Math.round(stats.mtimeMs)) {
    return "";
  }
  return typeof cached.peaks === "string" ? cached.peaks : "";
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
    const waveform = getCachedWaveform(options.waveformCache, item.file, stats);
    if (waveform) item.waveform = waveform;
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
  const waveformCache = readWaveformCache(projectRoot);

  const music = walkFiles(musicRoot, { excludedFolders: MUSIC_EXCLUDED_FOLDERS })
    .map((filePath) => buildItem(projectRoot, filePath, "music", { baseDir: musicRoot, waveformCache }))
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
  writeTextIfChanged(outputPath, `window.DM_AUDIO_MANIFEST = ${JSON.stringify(manifest, null, 2)};\n`);
  writeTextIfChanged(jsonOutputPath, `${JSON.stringify(manifest, null, 2)}\n`);

  return { outputPath, jsonOutputPath, ambienceCount: ambience.length, musicCount: music.length, sfxCount: sfx.length };
}

function waveformImageToBase64(buffer) {
  const expectedLength = WAVEFORM_PEAK_COUNT * WAVEFORM_IMAGE_HEIGHT;
  if (!Buffer.isBuffer(buffer) || buffer.length < expectedLength) {
    throw new Error(`ffmpeg returned ${buffer?.length || 0} waveform bytes; expected ${expectedLength}.`);
  }

  const amplitudes = Buffer.alloc(WAVEFORM_PEAK_COUNT);
  let maxAmplitude = 0;
  for (let x = 0; x < WAVEFORM_PEAK_COUNT; x++) {
    let top = WAVEFORM_IMAGE_HEIGHT;
    let bottom = -1;
    for (let y = 0; y < WAVEFORM_IMAGE_HEIGHT; y++) {
      if (buffer[y * WAVEFORM_PEAK_COUNT + x] > 8) {
        top = Math.min(top, y);
        bottom = Math.max(bottom, y);
      }
    }
    const amplitude = bottom >= top ? bottom - top + 1 : 0;
    amplitudes[x] = amplitude;
    maxAmplitude = Math.max(maxAmplitude, amplitude);
  }

  if (maxAmplitude > 0) {
    for (let index = 0; index < amplitudes.length; index++) {
      amplitudes[index] = Math.round((amplitudes[index] / maxAmplitude) * 255);
    }
  }
  return amplitudes.toString("base64");
}

function renderWaveform(ffmpegPath, filePath) {
  return new Promise((resolve, reject) => {
    const args = [
      "-v", "error",
      "-i", filePath,
      "-filter_complex", `aformat=channel_layouts=mono,showwavespic=s=${WAVEFORM_PEAK_COUNT}x${WAVEFORM_IMAGE_HEIGHT}:draw=full:colors=white`,
      "-frames:v", "1",
      "-f", "rawvideo",
      "-pix_fmt", "gray",
      "pipe:1"
    ];
    const child = spawn(ffmpegPath, args, { windowsHide: true });
    const stdout = [];
    const stderr = [];
    child.stdout.on("data", (chunk) => stdout.push(chunk));
    child.stderr.on("data", (chunk) => {
      if (stderr.reduce((total, item) => total + item.length, 0) < 8192) stderr.push(chunk);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      const output = Buffer.concat(stdout);
      if (code !== 0 || output.length < WAVEFORM_PEAK_COUNT * WAVEFORM_IMAGE_HEIGHT) {
        const detail = Buffer.concat(stderr).toString("utf8").trim();
        reject(new Error(detail || `ffmpeg exited with code ${code}.`));
        return;
      }
      try {
        resolve(waveformImageToBase64(output));
      } catch (err) {
        reject(err);
      }
    });
  });
}

async function generateAudioWaveforms(projectRoot = path.resolve(__dirname, "..")) {
  const musicRoot = path.join(projectRoot, MUSIC_FOLDER);
  const files = walkFiles(musicRoot, { excludedFolders: MUSIC_EXCLUDED_FOLDERS });
  const cache = readWaveformCache(projectRoot);
  const validPaths = new Set();
  const pending = [];

  files.forEach((filePath) => {
    const webPath = toWebPath(path.relative(projectRoot, filePath));
    const stats = fs.statSync(filePath);
    validPaths.add(webPath);
    if (!getCachedWaveform(cache, webPath, stats)) {
      pending.push({ filePath, webPath, size: stats.size, modifiedAt: Math.round(stats.mtimeMs) });
    }
  });

  Object.keys(cache.tracks).forEach((webPath) => {
    if (!validPaths.has(webPath)) delete cache.tracks[webPath];
  });

  if (pending.length === 0) {
    const cachePath = writeWaveformCache(projectRoot, cache);
    return { cachePath, generatedCount: 0, reusedCount: files.length, failedCount: 0 };
  }

  const ffmpegPath = process.env.DMTOOL_FFMPEG_PATH || "ffmpeg";
  const ffmpegCheck = spawnSync(ffmpegPath, ["-version"], { windowsHide: true, stdio: "ignore" });
  if (ffmpegCheck.error || ffmpegCheck.status !== 0) {
    throw new Error("ffmpeg was not found. Install ffmpeg or set DMTOOL_FFMPEG_PATH, then rerun npm run audio:waveforms.");
  }

  const requestedWorkers = Number.parseInt(process.env.DMTOOL_WAVEFORM_WORKERS || "", 10);
  const workerCount = Number.isFinite(requestedWorkers)
    ? Math.max(1, Math.min(8, requestedWorkers))
    : Math.max(1, Math.min(4, os.cpus().length - 1));
  let cursor = 0;
  let generatedCount = 0;
  let failedCount = 0;

  console.log(`Generating ${pending.length} missing waveforms with ${workerCount} workers...`);
  const workers = Array.from({ length: workerCount }, async () => {
    while (cursor < pending.length) {
      const index = cursor++;
      const item = pending[index];
      try {
        const peaks = await renderWaveform(ffmpegPath, item.filePath);
        cache.tracks[item.webPath] = {
          size: item.size,
          modifiedAt: item.modifiedAt,
          peaks
        };
        generatedCount += 1;
      } catch (err) {
        failedCount += 1;
        console.warn(`Waveform failed for ${path.relative(projectRoot, item.filePath)}: ${err.message}`);
      }

      const completedCount = generatedCount + failedCount;
      if (completedCount % 25 === 0 || completedCount === pending.length) {
        writeWaveformCache(projectRoot, cache);
        console.log(`Waveforms: ${completedCount}/${pending.length}`);
      }
    }
  });
  await Promise.all(workers);

  const cachePath = writeWaveformCache(projectRoot, cache);
  return { cachePath, generatedCount, reusedCount: files.length - pending.length, failedCount };
}

if (require.main === module) {
  (async () => {
    if (process.argv.includes("--waveforms")) {
      const waveformResult = await generateAudioWaveforms();
      console.log(`Waveform cache: ${waveformResult.generatedCount} generated, ${waveformResult.reusedCount} reused, ${waveformResult.failedCount} failed.`);
    }
    const result = generateAudioManifest();
    console.log(`Generated ${path.relative(process.cwd(), result.outputPath)} (${result.ambienceCount} ambience, ${result.musicCount} music, ${result.sfxCount} sfx).`);
  })().catch((err) => {
    console.error(err.message || err);
    process.exitCode = 1;
  });
}

module.exports = { generateAudioManifest, generateAudioWaveforms };
