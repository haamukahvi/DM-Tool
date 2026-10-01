(function (root, factory) {
  const value = factory();
  if (typeof module === "object" && module.exports) module.exports = value;
  if (root) root.NPC_GENERATOR_ENGINE = value;
})(typeof window !== "undefined" ? window : globalThis, function () {
  const byId = (items, id) => items.find((item) => item.id === id);
  const sharedCount = (left = [], right = []) => {
    const wanted = new Set(left);
    return right.reduce((total, value) => total + (wanted.has(value) ? 1 : 0), 0);
  };
  const normalize = (value) => String(value || "").normalize("NFKD").replace(/[’']/g, "").replace(/[^a-z0-9]/gi, "").toLowerCase();

  const weightedPick = (items, weightFor, rng = Math.random, excluded = new Set()) => {
    const weighted = items
      .filter((item) => !excluded.has(item.id || item.text || item.label))
      .map((item) => ({ item, weight: Math.max(0, Number(weightFor(item)) || 0) }))
      .filter((entry) => entry.weight > 0);
    if (!weighted.length) return null;
    const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);
    let cursor = rng() * total;
    for (const entry of weighted) {
      cursor -= entry.weight;
      if (cursor <= 0) return entry.item;
    }
    return weighted[weighted.length - 1].item;
  };

  const sideAffinity = (race, faction) => {
    if (!race || !faction || faction.side === "neutral" || faction.side === "independent") return 1;
    const leaning = String(race.faction || "Neutral").toLowerCase();
    if (faction.side === "hostile") return 0.55;
    if (faction.side === "alliance") {
      if (leaning.includes("very alliance")) return 4;
      if (leaning === "alliance") return 2.8;
      if (leaning.includes("alliance")) return 2;
      if (leaning.includes("very horde")) return 0.2;
      if (leaning.includes("horde")) return 0.45;
      return 0.8;
    }
    if (faction.side === "horde") {
      if (leaning.includes("very horde")) return 4;
      if (leaning === "horde") return 2.8;
      if (leaning.includes("horde")) return 2;
      if (leaning.includes("very alliance")) return 0.2;
      if (leaning.includes("alliance")) return 0.45;
      return 0.8;
    }
    return 1;
  };

  const factionWeight = (faction, context, data, races) => {
    const race = byId(races, context.raceId);
    const job = byId(data.jobs, context.jobId);
    let weight = faction.baseWeight || 1;
    weight *= sideAffinity(race, faction);
    if (race && faction.raceBoosts?.includes(race.id)) weight *= data.affinityMultipliers.signature;
    if (job) weight *= 1 + sharedCount(faction.tags, job.tags) * 0.65;
    return weight;
  };

  const raceWeight = (race, context, data) => {
    const profile = data.raceProfiles[race.id] || { baseWeight: 0.4, tags: [] };
    const faction = byId(data.factions, context.factionId);
    const job = byId(data.jobs, context.jobId);
    let weight = profile.baseWeight || 0.4;
    weight *= sideAffinity(race, faction);
    if (faction?.raceBoosts?.includes(race.id)) weight *= data.affinityMultipliers.signature;
    if (job) weight *= 1 + sharedCount(profile.tags, job.tags) * 0.4;
    return weight;
  };

  const jobWeight = (job, context, data) => {
    const profile = data.raceProfiles[context.raceId] || { tags: [] };
    const faction = byId(data.factions, context.factionId);
    let weight = job.baseWeight || 1;
    if (faction) weight *= 1 + sharedCount(job.tags, faction.tags) * 0.75;
    weight *= 1 + sharedCount(job.tags, profile.tags) * 0.35;
    if (context.ageTierId === "young" && ["noble", "magistrate", "watch-captain", "chamberlain", "advisor"].includes(job.id)) weight *= 0.35;
    return weight;
  };

  const getPool = (names, raceId, genderId) => {
    const pool = names.pools[raceId];
    if (!pool) return [];
    if (genderId === "male") return pool.male;
    if (genderId === "female") return pool.female;
    return [...pool.male, ...pool.female];
  };

  const groupChance = (label, ageTierId) => {
    const normalized = String(label || "").toLowerCase();
    if (!normalized) return 0;
    if (normalized.includes("deed")) return ageTierId === "young" ? 0.18 : ageTierId === "adult" ? 0.42 : 0.62;
    if (normalized.includes("creator") || normalized.includes("foundr")) return 0.68;
    if (normalized.includes("clan") || normalized.includes("tribe") || normalized.includes("flight")) return 0.72;
    return 0.8;
  };

  const pickName = (context, names, rng, recentNames = []) => {
    const pool = names.pools[context.raceId];
    const givenPool = getPool(names, context.raceId, context.genderId);
    if (!pool || !givenPool.length) return "Unnamed";
    const recent = new Set(recentNames.map(normalize));
    for (let attempt = 0; attempt < 30; attempt += 1) {
      const given = givenPool[Math.floor(rng() * givenPool.length)];
      const addGroup = pool.groupNames.length && rng() < groupChance(pool.groupLabel, context.ageTierId);
      const group = addGroup ? pool.groupNames[Math.floor(rng() * pool.groupNames.length)] : "";
      const full = group ? `${given} ${group}` : given;
      if (!recent.has(normalize(full))) return full;
    }
    return givenPool[Math.floor(rng() * givenPool.length)];
  };

  const traitConflicts = (candidate, selected) => {
    const selectedIds = new Set(selected.map((entry) => entry.id));
    if (candidate.conflicts?.some((id) => selectedIds.has(id))) return true;
    return selected.some((entry) => entry.conflicts?.includes(candidate.id));
  };

  const traitPatterns = [
    { weight: 60, tones: ["strength", "complication", "texture"] },
    { weight: 20, tones: ["strength", "complication", "complication"] },
    { weight: 15, tones: ["strength", "strength", "complication"] },
    { weight: 5, tones: ["texture", "texture", "complication"] }
  ];

  const pickTraits = (data, rng, existingLabels = []) => {
    const pattern = weightedPick(traitPatterns, (entry) => entry.weight, rng).tones;
    const existing = data.traits.filter((entry) => existingLabels.includes(entry.label));
    const selected = existing.slice(0, 3);
    for (const tone of pattern) {
      if (selected.length >= 3) break;
      const candidate = weightedPick(
        data.traits.filter((entry) => entry.tone === tone && !selected.some((chosen) => chosen.facet === entry.facet) && !traitConflicts(entry, selected)),
        (entry) => entry.baseWeight || 1,
        rng,
        new Set(selected.map((entry) => entry.id))
      ) || weightedPick(data.traits.filter((entry) => !traitConflicts(entry, selected)), (entry) => entry.baseWeight || 1, rng, new Set(selected.map((entry) => entry.id)));
      if (candidate) selected.push(candidate);
    }
    while (selected.length < 3) {
      const candidate = weightedPick(data.traits.filter((entry) => !traitConflicts(entry, selected)), () => 1, rng, new Set(selected.map((entry) => entry.id)));
      if (!candidate) break;
      selected.push(candidate);
    }
    return selected.slice(0, 3).map((entry) => entry.label);
  };

  const cueContextTags = (context, data) => {
    const faction = byId(data.factions, context.factionId);
    const job = byId(data.jobs, context.jobId);
    const profile = data.raceProfiles[context.raceId];
    return [...(faction?.tags || []), ...(job?.tags || []), ...(profile?.tags || [])];
  };

  const pickCue = (items, context, data, rng, current) => {
    const contextTags = cueContextTags(context, data);
    return weightedPick(items, (entry) => {
      const matches = sharedCount(entry.tags, contextTags);
      return (entry.baseWeight || 1) * (entry.tags.includes("generic") ? 1.2 : 0.75 + matches * 1.35);
    }, rng, new Set(current ? [items.find((item) => item.text === current)?.id] : []) )?.text || current || "";
  };

  const createNpc = ({ lockedValues = {}, locks = {}, data, names, races, rng = Math.random, recentNames = [] }) => {
    const npc = {};
    Object.keys(locks).forEach((key) => { if (locks[key] && lockedValues[key] !== undefined) npc[key] = lockedValues[key]; });
    if (!locks.factionId) npc.factionId = weightedPick(data.factions, (entry) => factionWeight(entry, npc, data, races), rng)?.id || "unaffiliated";
    if (!locks.raceId) npc.raceId = weightedPick(races, (entry) => raceWeight(entry, npc, data), rng)?.id || races[0]?.id;
    if (!locks.jobId) npc.jobId = weightedPick(data.jobs, (entry) => jobWeight(entry, npc, data), rng)?.id || data.jobs[0]?.id;
    if (!locks.genderId) npc.genderId = weightedPick(data.genders, (entry) => entry.weight, rng)?.id || "unspecified";
    if (!locks.ageTierId) {
      const profile = data.ageProfiles[data.raceProfiles[npc.raceId]?.ageProfileId] || data.ageProfiles.humanLike;
      npc.ageTierId = weightedPick(profile, (entry) => entry.weight, rng)?.id || "adult";
    }
    if (!locks.name) npc.name = pickName(npc, names, rng, recentNames);
    const lockedTraitLabels = [0, 1, 2]
      .filter((index) => locks[`trait-${index}`] && lockedValues.traits?.[index])
      .map((index) => lockedValues.traits[index]);
    const generatedTraits = pickTraits(data, rng, lockedTraitLabels);
    const remainingTraits = generatedTraits.filter((label) => !lockedTraitLabels.includes(label));
    npc.traits = [0, 1, 2].map((index) => (
      locks[`trait-${index}`] && lockedValues.traits?.[index]
        ? lockedValues.traits[index]
        : remainingTraits.shift() || generatedTraits[index] || "Reserved"
    ));
    if (!locks.appearance) npc.appearance = pickCue(data.appearances, npc, data, rng, lockedValues.appearance);
    if (!locks.mannerism) npc.mannerism = pickCue(data.mannerisms, npc, data, rng, lockedValues.mannerism);
    return { ...lockedValues, ...npc, traits: npc.traits || lockedValues.traits || [] };
  };

  const rerollNpcField = ({ npc, field, data, names, races, rng = Math.random, recentNames = [] }) => {
    const next = { ...npc, traits: [...(npc.traits || [])] };
    if (field === "factionId") next.factionId = weightedPick(data.factions, (entry) => factionWeight(entry, next, data, races), rng, new Set([npc.factionId]))?.id || npc.factionId;
    if (field === "raceId") next.raceId = weightedPick(races, (entry) => raceWeight(entry, next, data), rng, new Set([npc.raceId]))?.id || npc.raceId;
    if (field === "jobId") next.jobId = weightedPick(data.jobs, (entry) => jobWeight(entry, next, data), rng, new Set([npc.jobId]))?.id || npc.jobId;
    if (field === "genderId") next.genderId = weightedPick(data.genders, (entry) => entry.weight, rng, new Set([npc.genderId]))?.id || npc.genderId;
    if (field === "ageTierId") {
      const profile = data.ageProfiles[data.raceProfiles[npc.raceId]?.ageProfileId] || data.ageProfiles.humanLike;
      next.ageTierId = weightedPick(profile, (entry) => entry.weight, rng, new Set([npc.ageTierId]))?.id || npc.ageTierId;
    }
    if (field === "name") next.name = pickName(next, names, rng, [npc.name, ...recentNames]);
    if (/^trait-\d$/.test(field)) {
      const index = Number(field.slice(-1));
      const kept = next.traits.filter((_, traitIndex) => traitIndex !== index);
      const replacement = pickTraits(data, rng, kept).find((label) => !kept.includes(label));
      if (replacement) next.traits[index] = replacement;
    }
    if (field === "appearance") next.appearance = pickCue(data.appearances, next, data, rng, npc.appearance);
    if (field === "mannerism") next.mannerism = pickCue(data.mannerisms, next, data, rng, npc.mannerism);
    return next;
  };

  const displayValue = (items, id) => {
    const item = byId(items, id);
    return item?.label || item?.name || id || "—";
  };
  const formatNpcForClipboard = (npc, data, races) => [
    `${npc.name || "Unnamed"} — ${displayValue(races, npc.raceId)}, ${displayValue(data.ageProfiles[data.raceProfiles[npc.raceId]?.ageProfileId] || [], npc.ageTierId)}`,
    `Gender: ${displayValue(data.genders, npc.genderId)}`,
    `Faction: ${displayValue(data.factions, npc.factionId)}`,
    `Job: ${displayValue(data.jobs, npc.jobId)}`,
    `Traits: ${(npc.traits || []).join(", ")}`,
    `Appearance: ${npc.appearance || "—"}`,
    `Mannerism: ${npc.mannerism || "—"}`
  ].join("\n");

  const validateNpcData = ({ data, names, races }) => {
    const errors = [];
    const reserved = new Set((names.reservedNames || []).map(normalize));
    const seenRaceIds = new Set();
    races.forEach((race) => {
      if (seenRaceIds.has(race.id)) errors.push(`Duplicate race id: ${race.id}`);
      seenRaceIds.add(race.id);
      const pool = names.pools[race.id];
      if (!pool) errors.push(`Missing name pool: ${race.id}`);
      if ((pool?.male?.length || 0) < names.targetPerGender) errors.push(`Small male pool: ${race.id}`);
      if ((pool?.female?.length || 0) < names.targetPerGender) errors.push(`Small female pool: ${race.id}`);
      [...(pool?.male || []), ...(pool?.female || []), ...(pool?.groupNames || [])].forEach((name) => {
        if (reserved.has(normalize(name))) errors.push(`Reserved name leaked into ${race.id}: ${name}`);
      });
      if (!data.raceProfiles[race.id]) errors.push(`Missing race profile: ${race.id}`);
      if (!data.ageProfiles[data.raceProfiles[race.id]?.ageProfileId]) errors.push(`Missing age profile: ${race.id}`);
    });
    ["factions", "jobs", "traits", "appearances", "mannerisms"].forEach((key) => {
      if (!data[key]?.length) errors.push(`Empty data pool: ${key}`);
      const ids = new Set();
      data[key]?.forEach((entry) => {
        if (ids.has(entry.id)) errors.push(`Duplicate ${key} id: ${entry.id}`);
        ids.add(entry.id);
      });
    });
    const traitIds = new Set(data.traits.map((entry) => entry.id));
    data.traits.forEach((entry) => entry.conflicts?.forEach((id) => {
      if (!traitIds.has(id)) errors.push(`Trait ${entry.id} references missing conflict ${id}`);
    }));
    return errors;
  };

  return { weightedPick, createNpc, rerollNpcField, formatNpcForClipboard, validateNpcData, displayValue };
});
