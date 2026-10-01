const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SOURCE_PATH = path.join(ROOT, "data", "wow-character-options.js");
const OUTPUT_PATH = path.join(ROOT, "data", "npc-name-pools.js");
const TARGET_PER_GENDER = 180;

global.window = {};
require(SOURCE_PATH);

const races = global.window.WOW_CHARACTER_OPTIONS?.races || [];

const RESERVED_NAMES = [
  "Aegwynn", "Akama", "Alexandros", "Alexstrasza", "Alleria", "Anduin", "Arthas", "Azshara",
  "Baine", "Blackhand", "Bolvar", "Broxigar", "Cairne", "Calia", "Cenarius", "Chen", "Chromie",
  "Darion", "Deathwing", "Draka", "Drekthar", "Durotan", "Elisande", "Falstad", "Garona", "Garrosh",
  "Gazlowe", "Genn", "Grom", "Grommash", "Guldan", "Halduron", "Hamuul", "Illidan", "Jaina",
  "Kaelthas", "Kalecgos", "Kargath", "Khadgar", "Kiljaeden", "Kilrogg", "Lana'thel", "Li Li",
  "Liadrin", "Lilian", "Lorthemar", "Maiev", "Magni", "Malfurion", "Malygos", "Maraad", "Mathias",
  "Medivh", "Mekkatorque", "Moira", "Muradin", "Nathanos", "Nefarian", "Neltharion", "Nozdormu",
  "Oculeth", "Onyxia", "Orgrim", "Proudmoore", "Ragnaros", "Rastakhan", "Rexxar", "Rokhan",
  "Rommath", "Sally Whitemane", "Saurfang", "Shandris", "Sylvanas", "Talanji", "Thalyssra", "Thrall",
  "Tirion", "Turalyon", "Tyrande", "Uther", "Valeera", "Varian", "Velen", "Vereesa", "Vol", "Voljin",
  "Wrathion", "Yrel", "Ysera", "Zuljin", "Bronzebeard", "Doomhammer", "Fordragon", "Greymane",
  "Hellscream", "Menethil", "Mograine", "Shadowsong", "Stormrage", "Windrunner", "Whisperwind",
  "Aragorn", "Gandalf", "Gimli", "Legolas", "Thorin"
];

const normalize = (value) => String(value || "")
  .normalize("NFKD")
  .replace(/[’']/g, "")
  .replace(/[^a-z0-9]/gi, "")
  .toLowerCase();

const reservedSet = new Set(RESERVED_NAMES.map(normalize));
const isReserved = (value) => reservedSet.has(normalize(value));
const cleanName = (value) => String(value || "").trim().replace(/\s+/g, " ");
const titleName = (value) => value
  .split(/([-' ])/)
  .map((part) => /[a-z]/i.test(part) ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : part)
  .join("");

const BLUEPRINTS = {
  human: {
    starts: "Ald Ber Cal Cor Dar Ed El Fen Gar Hal Is Jor Kel Lor Mar Nor Os Perr Quin Ren Ser Tav Val Wes Yar".split(" "),
    male: "an ar den dric en ian ic is on or ren ric us yn".split(" "),
    female: "a ara elle ena ia ina ine ira isse ora ryn sa ya".split(" ")
  },
  gnome: {
    starts: "Bim Bin Coggle Dap Fizz Frix Gim Glim Jib Kex Lix Mep Nib Pex Quib Rix Tink Vex Wib Zib".split(" "),
    male: "bin bit bo dink fizz gear ik ip nix o rik sprocket tik wick zip".split(" "),
    female: "a bi bitsi ella etta fi fizzi ika ina ixie li nixie sa zi".split(" ")
  },
  construct: {
    starts: "Axiom Bastion Cipher Conduit Echo Facet Glyph Halo Lattice Lumen Matrix Nexus Prism Relay Sigil Vector Ward Zenith".split(" "),
    male: "-3 -7 -9 -11 Core Prime Axis Unit Mark Array Node Lens Frame".split(" "),
    female: "-2 -6 -8 -12 Core Prime Arc Unit Mark Array Node Lens Frame".split(" "),
    joiners: [" "]
  },
  elf: {
    starts: "Ael Alar Anar Aran Bel Cael Dae Elen Faer Ilar Kael Laer Mael Nael Orel Ryn Sael Thael Vael Yll Zyn".split(" "),
    male: "adir ael anor arion ath enil eris iel ion ir lor oryn rath thas".split(" "),
    female: "aela aria elia enna essia ethiel iana ielle ira issa ora riel thia".split(" ")
  },
  pandaren: {
    starts: "Bao Bo Cha Dao Fen Han Jian Jin Kai Ko Lan Lei Lian Mei Nao Qiao Ren Shan Tao Wei Xian Yan Zhen".split(" "),
    male: "bo chan dao feng han jin kai li min po ren shan tao wen zhi".split(" "),
    female: "ai an hua lan lei li mei na qin ru shan xia yan yin zhen".split(" ")
  },
  dwarf: {
    starts: "Bal Bar Bel Bor Bran Dain Dor Dur Far Gar Gim Grim Har Hel Kaz Khor Mor Nor Orin Rag Sten Thar Tor".split(" "),
    male: "ar din dok gan gar grim in kar mar mond rik run sten var".split(" "),
    female: "a da dis dra hild ia lin ma na ra ris runa ya".split(" ")
  },
  draenei: {
    starts: "Aak Akh Ara Ata Bel Dra Esh Haa Iri Ish Kaa Mal Naa Oru Pha Raa Sha Taa Ura Vaa Yrel Zha".split(" "),
    male: "ad an ar ek em ir om on or os uun vak vel zar".split(" "),
    female: "a ah ari ena ia ila ira ish na ora ra sha ya zel".split(" ")
  },
  tauren: {
    starts: "Aka Aro Balo Ceta Daro Eru Hama Hota Iko Koro Maka Nalo Ota Paku Rono Seka Talo Ura Waka Yaro Zuni".split(" "),
    male: "an ar ko mah n ok on rak ro sh ta to u uk".split(" "),
    female: "a ama ana ara ena ia ka ma na ra sa ta ya".split(" ")
  },
  goblin: {
    starts: "Bax Bix Blaz Crik Daz Fex Fizz Gaz Gix Grez Jax Kiz Klax Nix Piz Quix Razz Snix Taz Vex Wix Zik".split(" "),
    male: "bin bolt dax fiz gix ik ix lo nix oz rik tok vex zik".split(" "),
    female: "a bixi ella etta fexa izzi la nixie ova razzi sa tixa zi".split(" ")
  },
  orc: {
    starts: "Borg Brak Darg Drak Gar Ghor Grak Harg Karg Krag Lok Mak Morg Nar Ruk Shak Thok Urg Var Zog".split(" "),
    femaleStarts: "Ag Brak Dar Drag Gar Ghor Grim Har Igr Karg Kor Lorg Mak Morg Nar Rek Ruk Shar Sher Thur Urg Var Zur".split(" "),
    male: "an ash dar gar gash gor mak og or rak rom ug uk ush".split(" "),
    female: "a aya ena ia ila ina ora sha tha uka ura".split(" ")
  },
  vulpera: {
    starts: "Aki Biri Cafa Deki Fara Hiri Jali Kavi Liri Maki Nari Piri Qira Rafi Savi Tali Viri Yari Zefi".split(" "),
    male: "an aro en i ko li mir no ri ro tan vi ya zan".split(" "),
    female: "a ara eli ena ia iri la mi na ri sa tia ya".split(" ")
  },
  troll: {
    starts: "Aka Bao Daz Eko Gah Hek Iza Jek Kaz Loa Maz Nek Oza Paz Ruk Sen Taz Uko Vaz Yek Zol".split(" "),
    male: "'jin 'ko 'rak 'zan da jo ka mo ran ro sen tik vo zul".split(" "),
    female: "'ja 'li 'ra 'shi a ia ka la na ra sa ya za".split(" ")
  },
  avian: {
    starts: "Ari Ash Beak Caw Cloud Crest Eri Feather Gale Hush Kesh Quill Rook Sair Shade Skyr Talon Vek Wing Zeph".split(" "),
    male: "ak ar ash ek ir isk or rek rik tal th vek yr".split(" "),
    female: "a ara ashka eli ena ia iri ka ra sa sha ya".split(" ")
  },
  vrykul: {
    starts: "Agn Bjarn Dag Eir Fen Geir Hald Ing Jor Ket Leif Njord Ragn Sig Skald Sten Tor Ulf Var Yng".split(" "),
    male: "ar bjorn dan eir fast gar grim jolf mund rik sten vald var".split(" "),
    female: "a dis dr hild ia lif rid runa ska veig ya".split(" ")
  },
  aquatic: {
    starts: "Aqi Brin Cala Dori Eel Fath Gill Hali Iri Kelp Luma Mari Neri Pearl Qori Reef Sali Tide Umi Vela Wave".split(" "),
    male: "an ar ek fin ion is kor mar os rik ul vor".split(" "),
    female: "a ara eel ena ia ina ira issa ola sa ya".split(" ")
  },
  naga: {
    starts: "Azh Cresh Draz Essar Hissar Ishkar Kesh Lazh Malis Nazh Qir Rash Sakr Sereth Shezr Ssil Thes Valr Velr Vesh Xir Zar Zeth".split(" "),
    male: "as ath ek il ir is or rash ril sath thir us vash ziss".split(" "),
    femaleStarts: "Asha Aspra Cerys Charis Essara Halira Ishara Kessira Lethira Lissara Malara Nalira Qirasha Rashira Seshra Scilla Selira Ssilara Thalira Ursala Vashara Velira Xashara Yessira Zashara Zethira".split(" "),
    female: "a ara ena ia ira issa ithra ora sa sha yssa".split(" ")
  },
  murloc: {
    starts: "Blub Brgl Brul Flrg Glim Glr Glub Gorl Grem Grib Grul Gurg Krl Krug Lur Mrr Mur Murl Rul Skum Slur Vur".split(" "),
    male: "blub gar gill glar glim gluk gruk gul luk murk murl nog ruk".split(" "),
    female: "gilla glia glin glee gulla lilla lura mella mura rila ula urggly".split(" ")
  },
  insectoid: {
    starts: "Aq Chit Drax Ek Khet Kri Mantis Ner Qir Reth Skit Tch Vak Vek Xal Xir Zek Zik".split(" "),
    male: "ak ax ek ik is kith or rak rex tik ul zix".split(" "),
    female: "a ara ekka ia ika ira ix sa sha tis za".split(" ")
  },
  reptilian: {
    starts: "Ash Dra Ess Ghar Hiss Kesh Keth Kraz Nesh Qal Qesh Rass Saz Seth Ssil Thaz Vash Xesh Zeth Zhar".split(" "),
    male: "ak ar ash ek ik ir is or rak rex ul ush".split(" "),
    female: "a ara ess ia ika ira issa sa sha ya za".split(" ")
  },
  ancient: {
    starts: "Amun Ank Aru Djesh Heka Iset Khem Meru Nef Oru Ptah Qet Rah Sabu Senet Tef Ura Wesir Zek".split(" "),
    male: "ak ar em esh et hot ir ka mon rah tep us".split(" "),
    female: "a ara emet esha ia ira ka ra set ta ya".split(" ")
  },
  beast: {
    starts: "Bram Bristle Crag Dusk Fang Garr Grizz Hark Korr Murr Rusk Scar Snarl Thorn Tusk Varr Wold".split(" "),
    femaleStarts: "Bera Brisa Craga Duska Fara Garra Griza Harka Kora Mura Ruska Scara Shara Thora Tuska Vara Wolda Yara Zura Kella".split(" "),
    male: "ak an ar ash gar grim ik or rak uk ur us".split(" "),
    female: "a ara ena ia ika na ra sha ta ya za".split(" ")
  },
  quilboar: {
    starts: "Bog Borg Brag Bruk Gash Ghak Glur Grak Gul Hagg Kreg Kur Lok Mog Mur Nak Rag Rog Snok Thuk Urg".split(" "),
    male: "ak arg dug gak gug kreg nak og ok rok rug snak ug uk".split(" "),
    femaleStarts: "Boga Bruga Gasha Ghara Glura Graka Gula Hagra Krega Kura Moga Mura Naka Raga Roga Snoka Thura Urga Vorga Zura".split(" "),
    female: "ga gash guk na nak nash oga oka uka ura ush za".split(" ")
  },
  harpy: {
    starts: "Ala Ari Cery Dela Ery Fyl Grela Ily Kera Lyra Myra Nyssa Oria Rava Sera Syla Tery Vela Veyra Zera".split(" "),
    male: "an ar ek en ir on or os tal thyr var vek".split(" "),
    femaleStarts: "Ala Ana Ari Cerya Dela Erya Fylmi Grela Ilya Kera Lyra Myra Nyssa Oria Rava Serena Syla Terya Vela Veyra Zera".split(" "),
    female: "a ena ia ina ira issa mi na ra sa ya yna".split(" ")
  },
  satyr: {
    starts: "Aza Bel Caz Dae Eri Fae Glo Iri Jax Kae Laz Mav Nyr Oza Pha Rix Saz Vae Xyr Zae".split(" "),
    male: "ar as ian ik ion is or rix thos us yr".split(" "),
    female: "a ara elia ena ia ira issa ora rix sa ya".split(" ")
  }
};

const PROFILE_BY_RACE = {
  "gnome-gnomeregan": "gnome", "gnome-mechagnome": "gnome", "leper-gnome": "gnome",
  "golem-arcane": "construct", "golem-stone": "construct",
  worgen: "human", human: "human", "forsaken-human": "human", "elf-half": "human",
  "elf-void": "elf", "elf-night": "elf", "elf-blood": "elf", "forsaken-elf": "elf",
  "elf-nightborne": "elf", "elf-felblood": "elf", "elf-nightfallen": "elf", "elf-wretched": "elf",
  "elf-san-layn": "elf", "elf-high": "elf", "keeper-dryad": "elf",
  pandaren: "pandaren", hozen: "pandaren", jinyu: "pandaren", "jinyu-ankoan": "pandaren", mogu: "ancient",
  "dwarf-ironforge": "dwarf", "dwarf-wildhammer": "dwarf", "dwarf-dark-iron": "dwarf", vrykul: "vrykul",
  "draenei-broken": "draenei", "draenei-exodar": "draenei", "draenei-lightforged": "draenei", ethereal: "draenei",
  "tauren-highmountain": "tauren", "tauren-mulgore": "tauren", "tauren-taunka": "tauren",
  "tauren-yaungol": "tauren", centaur: "tauren", furbolg: "tauren",
  goblin: "goblin", hobgoblin: "goblin", kobold: "goblin",
  "orc-hunter-clan": "orc", "orc-mystic-clan": "orc", "orc-warrior-clan": "orc", "half-orc": "orc", ogre: "orc",
  vulpera: "vulpera", gnoll: "vulpera", sabreon: "vulpera", sabreon_unused: "vulpera", sabreon2: "vulpera", sabreon3: "vulpera", saberon: "vulpera",
  "troll-forest": "troll", "troll-ice": "troll", "troll-jungle": "troll", "troll-zandalari": "troll",
  "troll-sand": "troll", "blood-troll": "troll",
  "arakkoa-high": "avian", "arakkoa-cursed": "avian", harpy: "harpy",
  naga: "naga", murloc: "murloc", tuskarr: "aquatic", tortollan: "ancient", tolvir: "ancient",
  mantid: "insectoid", nerubian: "insectoid",
  saurok: "reptilian", sethrak: "reptilian", drakonid: "reptilian",
  quilboar: "quilboar", satyr: "satyr"
};

const hash = (value) => {
  let result = 2166136261;
  for (const char of String(value)) {
    result ^= char.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
};

const uniqueValid = (values) => {
  const seen = new Set();
  return values
    .map(cleanName)
    .filter((value) => {
      const key = normalize(value);
      if (!key || key.length < 3 || isReserved(value) || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

const mergeFragments = (start, ending, joiner) => {
  if (joiner) {
    const spacer = joiner === " " && /^[-\d]/.test(ending) ? "" : joiner;
    return `${start}${spacer}${ending}`;
  }
  const left = start.toLowerCase();
  const right = ending.toLowerCase();
  let overlap = 0;
  for (let size = Math.min(3, left.length, right.length); size > 0; size -= 1) {
    if (left.slice(-size) === right.slice(0, size)) {
      overlap = size;
      break;
    }
  }
  return `${start}${ending.slice(overlap)}`;
};

const generatedCandidates = (blueprint, gender) => {
  const endings = blueprint[gender];
  const starts = blueprint[`${gender}Starts`] || blueprint.starts;
  const joiners = blueprint.joiners || [""];
  const result = [];
  starts.forEach((start) => {
    endings.forEach((ending) => {
      joiners.forEach((joiner) => {
        result.push(titleName(mergeFragments(start, ending, joiner)));
      });
    });
  });
  return result;
};

const buildPool = (race, gender, blueprint) => {
  const source = uniqueValid(race.names?.[gender] || []);
  const generated = generatedCandidates(blueprint, gender).filter((name) => {
    const key = normalize(name);
    if (key.length < 4 || key.length > 13) return false;
    if (/(..).*\1$/i.test(key)) return false;
    if (/[^aeiouy]{4,}/i.test(key)) return false;
    return true;
  });
  const sourceKeys = new Set(source.map(normalize));
  const generatedFill = uniqueValid(generated)
    .filter((name) => !sourceKeys.has(normalize(name)))
    .sort((a, b) => hash(`${race.id}:${gender}:${a}`) - hash(`${race.id}:${gender}:${b}`));
  const candidates = [...source, ...generatedFill];
  if (candidates.length < TARGET_PER_GENDER) {
    throw new Error(`${race.id}/${gender} only produced ${candidates.length} valid names.`);
  }
  return candidates.slice(0, TARGET_PER_GENDER).sort((a, b) => a.localeCompare(b));
};

const pools = {};
for (const race of races) {
  const profileId = PROFILE_BY_RACE[race.id];
  const blueprint = BLUEPRINTS[profileId];
  if (!blueprint) throw new Error(`Missing name blueprint for ${race.id}.`);
  const groupNames = uniqueValid(race.names?.groupNames || []);
  pools[race.id] = {
    profileId,
    male: buildPool(race, "male", blueprint),
    female: buildPool(race, "female", blueprint),
    groupLabel: cleanName(race.names?.groupLabel || ""),
    groupNames
  };
}

const payload = {
  schemaVersion: 1,
  generatedAt: "committed-build-artifact",
  targetPerGender: TARGET_PER_GENDER,
  reservedNames: RESERVED_NAMES.slice().sort((a, b) => a.localeCompare(b)),
  pools
};

const contents = `/* Generated by scripts/generate-npc-name-pools.cjs. Do not edit by hand. */\n` +
`(function (root, factory) {\n` +
`  const value = factory();\n` +
`  if (typeof module === "object" && module.exports) module.exports = value;\n` +
`  if (root) root.NPC_NAME_POOLS = value;\n` +
`})(typeof window !== "undefined" ? window : globalThis, function () {\n` +
`  return ${JSON.stringify(payload, null, 2)};\n` +
`});\n`;

fs.writeFileSync(OUTPUT_PATH, contents, "utf8");
console.log(`Wrote ${races.length} race pools to ${path.relative(ROOT, OUTPUT_PATH)}.`);
console.log(`${TARGET_PER_GENDER} male + ${TARGET_PER_GENDER} female given names per race.`);
