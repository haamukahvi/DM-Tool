global.window = {};
require("../data/wow-character-options.js");

const names = require("../data/npc-name-pools.js");
const data = require("../data/npc-generator-data.js");
const engine = require("../data/npc-generator-engine.js");
const races = global.window.WOW_CHARACTER_OPTIONS.races;

const makeRng = (seed) => {
  let state = seed >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
};

const increment = (map, key) => map.set(key, (map.get(key) || 0) + 1);
const top = (map, count = 8) => [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, count);
const labelFor = (items, id) => items.find((item) => item.id === id)?.label || id;

const runScenario = (label, count, lockedValues = {}, locks = {}) => {
  const rng = makeRng(0xC0D3 + label.length);
  const results = { races: new Map(), factions: new Map(), jobs: new Map(), ages: new Map(), names: new Set() };
  let duplicateTraits = 0;
  let recentNames = [];
  for (let index = 0; index < count; index += 1) {
    const npc = engine.createNpc({ lockedValues, locks, data, names, races, rng, recentNames });
    increment(results.races, npc.raceId);
    increment(results.factions, npc.factionId);
    increment(results.jobs, npc.jobId);
    increment(results.ages, npc.ageTierId);
    results.names.add(npc.name);
    if (new Set(npc.traits).size !== npc.traits.length) duplicateTraits += 1;
    recentNames = [npc.name, ...recentNames].slice(0, 5);
  }
  console.log(`\n${label} (${count.toLocaleString()} rolls)`);
  console.log("Races:", top(results.races).map(([id, value]) => `${labelFor(races, id)} ${(value / count * 100).toFixed(1)}%`).join(" | "));
  console.log("Factions:", top(results.factions, 5).map(([id, value]) => `${labelFor(data.factions, id)} ${(value / count * 100).toFixed(1)}%`).join(" | "));
  console.log("Jobs:", top(results.jobs, 5).map(([id, value]) => `${labelFor(data.jobs, id)} ${(value / count * 100).toFixed(1)}%`).join(" | "));
  console.log(`Unique full names: ${results.names.size.toLocaleString()} | duplicate trait rolls: ${duplicateTraits}`);
  if (duplicateTraits) throw new Error(`${label} produced duplicate traits.`);
  return results;
};

const errors = engine.validateNpcData({ data, names, races });
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
  return;
}

console.log("NPC data validation passed.");
console.log(`${races.length} races; ${names.targetPerGender} male and ${names.targetPerGender} female given names per race.`);
console.log(`${data.factions.length} factions; ${data.jobs.length} jobs; ${data.traits.length} traits; ${data.appearances.length} appearances; ${data.mannerisms.length} mannerisms.`);

runScenario("Unrestricted", 50000);
const bootyBay = runScenario(
  "Blackwater shopkeeper",
  15000,
  { factionId: "blackwater-raiders", jobId: "shopkeeper" },
  { factionId: true, jobId: true }
);
const goblinShare = (bootyBay.races.get("goblin") || 0) / 15000;
if (goblinShare < 0.18) throw new Error(`Blackwater shopkeeper Goblin share too low: ${(goblinShare * 100).toFixed(1)}%`);

runScenario("Kirin Tor archivist", 10000, { factionId: "kirin-tor", jobId: "archivist" }, { factionId: true, jobId: true });
runScenario("Goblin locked", 10000, { raceId: "goblin" }, { raceId: true });

console.log("\nAll seeded generator simulations passed.");
