(function (root, factory) {
  const value = factory();
  if (typeof module === "object" && module.exports) module.exports = value;
  if (root) root.NPC_GENERATOR_DATA = value;
})(typeof window !== "undefined" ? window : globalThis, function () {
  const slug = (value) => value.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const list = (text) => text.split("|").map((value) => value.trim()).filter(Boolean);
  const tagged = (category, tags, text, baseWeight = 1) => list(text).map((label) => ({
    id: slug(label), label, category, tags: tags.split(" ").filter(Boolean), baseWeight
  }));

  const ageProfiles = {
    shortLived: [
      { id: "young", label: "Young", weight: 1.3 }, { id: "adult", label: "Adult", weight: 4.5 },
      { id: "mature", label: "Mature", weight: 2.4 }, { id: "old", label: "Old", weight: 0.7 }
    ],
    humanLike: [
      { id: "young", label: "Young", weight: 1.1 }, { id: "adult", label: "Adult", weight: 4.6 },
      { id: "mature", label: "Mature", weight: 2.7 }, { id: "old", label: "Old", weight: 0.9 }
    ],
    longLived: [
      { id: "young", label: "Young", weight: 1 }, { id: "adult", label: "Adult", weight: 4 },
      { id: "mature", label: "Mature", weight: 3 }, { id: "old", label: "Old", weight: 1.4 },
      { id: "ancient", label: "Ancient", weight: 0.25 }
    ],
    ancientLived: [
      { id: "young", label: "Young", weight: 0.8 }, { id: "adult", label: "Adult", weight: 3.4 },
      { id: "mature", label: "Mature", weight: 3.2 }, { id: "old", label: "Old", weight: 1.8 },
      { id: "ancient", label: "Ancient", weight: 0.7 }
    ],
    ageless: [
      { id: "young", label: "Young", weight: 0.7 }, { id: "adult", label: "Established", weight: 3.8 },
      { id: "mature", label: "Weathered", weight: 2.8 }, { id: "old", label: "Old", weight: 1.4 },
      { id: "ancient", label: "Ancient", weight: 0.8 }
    ]
  };

  const raceProfiles = {};
  const addRaceGroup = (ids, ageProfileId, baseWeight, tags) => ids.forEach((id) => {
    raceProfiles[id] = { ageProfileId, baseWeight, tags: tags.split(" ").filter(Boolean) };
  });

  addRaceGroup(list("human|dwarf-ironforge|gnome-gnomeregan|orc-warrior-clan|tauren-mulgore|troll-jungle|elf-blood|goblin|worgen|pandaren"), "humanLike", 4, "common");
  addRaceGroup(list("dwarf-wildhammer|dwarf-dark-iron|gnome-mechagnome|draenei-exodar|draenei-lightforged|tauren-highmountain|tauren-taunka|elf-night|elf-nightborne|forsaken-human|vulpera|troll-forest|troll-zandalari|half-orc"), "longLived", 2, "uncommon");
  addRaceGroup(list("hozen|kobold|murloc|quilboar|gnoll|harpy"), "shortLived", 0.8, "rare");
  addRaceGroup(list("elf-void|draenei-broken|forsaken-elf|orc-hunter-clan|orc-mystic-clan|troll-ice|troll-sand|arakkoa-high|arakkoa-cursed|centaur|furbolg|leper-gnome|hobgoblin|elf-half|vrykul|jinyu|jinyu-ankoan|mogu|naga|ogre|saberon|saurok|sethrak|tauren-yaungol|tortollan|tolvir|blood-troll|tuskarr|satyr|elf-felblood|elf-nightfallen|elf-wretched|elf-high|drakonid"), "longLived", 0.55, "rare");
  addRaceGroup(list("golem-arcane|golem-stone|ethereal|mantid|nerubian|elf-san-layn|keeper-dryad"), "ageless", 0.28, "rare ageless");

  const addTags = (ids, tags) => ids.forEach((id) => {
    if (!raceProfiles[id]) raceProfiles[id] = { ageProfileId: "humanLike", baseWeight: 0.5, tags: [] };
    raceProfiles[id].tags.push(...tags.split(" "));
  });
  addTags(list("gnome-gnomeregan|gnome-mechagnome|leper-gnome|goblin|hobgoblin|golem-arcane|golem-stone"), "engineering trade arcane");
  addTags(list("naga|murloc|jinyu|jinyu-ankoan|tuskarr|tortollan|goblin"), "maritime coastal");
  addTags(list("elf-night|keeper-dryad|furbolg|tauren-mulgore|tauren-highmountain|tauren-taunka|tauren-yaungol|vulpera"), "nature wilderness");
  addTags(list("elf-blood|elf-high|elf-void|elf-nightborne|elf-nightfallen|elf-wretched|draenei-exodar|draenei-lightforged|ethereal|golem-arcane"), "arcane scholarly");
  addTags(list("orc-warrior-clan|orc-hunter-clan|half-orc|tauren-mulgore|troll-jungle|dwarf-ironforge|human|worgen"), "military labor");
  addTags(list("forsaken-human|forsaken-elf|elf-san-layn"), "undead shadow");
  addTags(list("arakkoa-high|arakkoa-cursed|harpy"), "avian wilderness");
  addTags(list("saurok|sethrak|drakonid|naga"), "scaled");
  addTags(list("vulpera|gnoll|saberon|worgen|furbolg"), "furred");
  addTags(list("tauren-mulgore|tauren-highmountain|tauren-taunka|tauren-yaungol|centaur"), "horned");

  const factions = [
    { id: "unaffiliated", label: "Unaffiliated", side: "neutral", baseWeight: 5, tags: ["civilian", "local"] },
    { id: "alliance", label: "Alliance", side: "alliance", baseWeight: 3.5, tags: ["civic", "military", "trade"] },
    { id: "horde", label: "Horde", side: "horde", baseWeight: 3.5, tags: ["civic", "military", "trade"] },
    { id: "stormwind", label: "Kingdom of Stormwind", side: "alliance", baseWeight: 1.6, tags: ["civic", "trade", "noble", "military"], raceBoosts: ["human", "worgen", "dwarf-ironforge"] },
    { id: "ironforge", label: "Kingdom of Ironforge", side: "alliance", baseWeight: 1.2, tags: ["craft", "trade", "military"], raceBoosts: ["dwarf-ironforge", "gnome-gnomeregan"] },
    { id: "gnomeregan", label: "Gnomeregan", side: "alliance", baseWeight: 0.9, tags: ["engineering", "craft", "scholarly"], raceBoosts: ["gnome-gnomeregan", "gnome-mechagnome"] },
    { id: "gilneas", label: "Gilneas", side: "alliance", baseWeight: 0.8, tags: ["civic", "noble", "military"], raceBoosts: ["worgen", "human"] },
    { id: "exodar", label: "The Exodar", side: "alliance", baseWeight: 0.8, tags: ["holy", "arcane", "scholarly"], raceBoosts: ["draenei-exodar", "draenei-lightforged", "draenei-broken"] },
    { id: "orgrimmar", label: "Orgrimmar", side: "horde", baseWeight: 1.7, tags: ["civic", "military", "trade"], raceBoosts: ["orc-warrior-clan", "orc-hunter-clan", "troll-jungle", "goblin"] },
    { id: "darkspear", label: "Darkspear Tribe", side: "horde", baseWeight: 0.9, tags: ["nature", "military", "spiritual"], raceBoosts: ["troll-jungle"] },
    { id: "thunder-bluff", label: "Thunder Bluff", side: "horde", baseWeight: 0.9, tags: ["nature", "spiritual", "trade"], raceBoosts: ["tauren-mulgore", "tauren-highmountain"] },
    { id: "silvermoon", label: "Silvermoon", side: "horde", baseWeight: 1, tags: ["arcane", "noble", "trade"], raceBoosts: ["elf-blood", "elf-nightborne"] },
    { id: "forsaken", label: "The Forsaken", side: "horde", baseWeight: 0.9, tags: ["civic", "alchemy", "shadow"], raceBoosts: ["forsaken-human", "forsaken-elf"] },
    { id: "bilgewater", label: "Bilgewater Cartel", side: "horde", baseWeight: 1, tags: ["trade", "engineering", "criminal"], raceBoosts: ["goblin", "hobgoblin"] },
    { id: "steamwheedle", label: "Steamwheedle Cartel", side: "neutral", baseWeight: 1.2, tags: ["trade", "engineering", "maritime"], raceBoosts: ["goblin", "hobgoblin"] },
    { id: "blackwater-raiders", label: "Blackwater Raiders", side: "neutral", baseWeight: 0.9, tags: ["trade", "maritime", "criminal", "coastal"], raceBoosts: ["goblin"] },
    { id: "venture-company", label: "Venture Company", side: "hostile", baseWeight: 0.6, tags: ["trade", "engineering", "criminal", "labor"], raceBoosts: ["goblin", "hobgoblin"] },
    { id: "kirin-tor", label: "Kirin Tor", side: "neutral", baseWeight: 1, tags: ["arcane", "scholarly", "civic"], raceBoosts: ["human", "elf-high", "elf-blood", "gnome-gnomeregan"] },
    { id: "argent-crusade", label: "Argent Crusade", side: "neutral", baseWeight: 0.8, tags: ["holy", "military", "service"] },
    { id: "cenarion-circle", label: "Cenarion Circle", side: "neutral", baseWeight: 0.8, tags: ["nature", "wilderness", "service"], raceBoosts: ["elf-night", "tauren-mulgore", "keeper-dryad"] },
    { id: "earthen-ring", label: "Earthen Ring", side: "neutral", baseWeight: 0.7, tags: ["spiritual", "nature", "service"], raceBoosts: ["orc-mystic-clan", "tauren-mulgore", "troll-jungle"] },
    { id: "ebon-blade", label: "Knights of the Ebon Blade", side: "neutral", baseWeight: 0.45, tags: ["military", "shadow", "service"], raceBoosts: ["forsaken-human", "forsaken-elf"] },
    { id: "illidari", label: "Illidari", side: "neutral", baseWeight: 0.35, tags: ["military", "shadow", "arcane"], raceBoosts: ["elf-night", "elf-blood"] },
    { id: "explorers-league", label: "Explorer's League", side: "alliance", baseWeight: 0.65, tags: ["scholarly", "wilderness", "travel"], raceBoosts: ["dwarf-ironforge", "gnome-gnomeregan", "human"] },
    { id: "reliquary", label: "The Reliquary", side: "horde", baseWeight: 0.65, tags: ["scholarly", "arcane", "travel"], raceBoosts: ["elf-blood", "elf-nightborne"] },
    { id: "si7", label: "SI:7", side: "alliance", baseWeight: 0.45, tags: ["civic", "criminal", "military"], raceBoosts: ["human", "worgen"] },
    { id: "shattered-hand", label: "Shattered Hand", side: "horde", baseWeight: 0.4, tags: ["criminal", "military"], raceBoosts: ["orc-warrior-clan", "troll-jungle"] },
    { id: "defias", label: "Defias Brotherhood", side: "hostile", baseWeight: 0.5, tags: ["criminal", "labor", "coastal"], raceBoosts: ["human"] },
    { id: "bloodsail", label: "Bloodsail Buccaneers", side: "hostile", baseWeight: 0.55, tags: ["criminal", "maritime", "coastal"], raceBoosts: ["human", "goblin", "troll-jungle"] },
    { id: "scarlet-crusade", label: "Scarlet Crusade", side: "hostile", baseWeight: 0.35, tags: ["holy", "military"], raceBoosts: ["human"] },
    { id: "zandalari", label: "Zandalari Empire", side: "horde", baseWeight: 0.7, tags: ["noble", "spiritual", "military"], raceBoosts: ["troll-zandalari"] },
    { id: "shaldorei", label: "Shal'dorei", side: "horde", baseWeight: 0.65, tags: ["arcane", "noble", "civic"], raceBoosts: ["elf-nightborne", "elf-nightfallen"] }
  ];

  const jobs = [
    ...tagged("trade", "trade service", "Shopkeeper|Innkeeper|Tavernkeeper|Bartender|Cook|Baker|Butcher|Fishmonger|Spice Merchant|Clothier|Jeweler|Auctioneer|Trader|Pawnbroker|Street Vendor"),
    ...tagged("craft", "craft labor", "Blacksmith|Armorsmith|Weaponsmith|Leatherworker|Tailor|Enchanter|Alchemist|Apothecary|Engineer|Tinker|Scribe|Potter|Carpenter|Shipwright|Stonemason|Glassblower|Brewer|Tanner|Clockmaker"),
    ...tagged("civic", "civic service", "Guard|Watch Captain|Tax Collector|Magistrate|Clerk|Courier|Stablemaster|Dockmaster|Harbormaster|Lamplighter|Gravedigger|Groundskeeper|Jailer|Town Crier|Interpreter"),
    ...tagged("maritime", "maritime coastal travel labor", "Sailor|Fisher|Navigator|Cartographer|Deckhand|Ship's Cook|Smuggler|Dockworker|Pearl Diver|Lighthouse Keeper|Ferryman|Sailmaker|Wharf Porter"),
    ...tagged("spiritual", "spiritual holy service", "Priest|Acolyte|Shrine Keeper|Healer|Herbalist|Spirit Guide|Undertaker|Pilgrim Guide|Temple Attendant"),
    ...tagged("arcane", "arcane scholarly service", "Mage|Portal Attendant|Archivist|Librarian|Researcher|Ley Surveyor|Ritualist|Fortune Teller|Magical Appraiser|Runecarver|Relic Keeper|Laboratory Assistant"),
    ...tagged("wilderness", "wilderness nature travel labor", "Hunter|Trapper|Guide|Scout|Caravan Driver|Animal Handler|Farmer|Rancher|Miner|Lumberjack|Forager|Messenger|Falconer|Mushroom Gatherer|Beekeeper"),
    ...tagged("underworld", "criminal service", "Thief|Pickpocket|Burglar|Con Artist|Fence|Debt Collector|Bounty Hunter|Bodyguard|Mercenary|Gambler|Lookout|Safecracker|Counterfeiter|Information Broker"),
    ...tagged("entertainment", "service performance", "Performer|Musician|Storyteller|Dancer|Gladiator|Puppeteer|Stagehand|Poet|Fortune Reader"),
    ...tagged("elite", "noble civic scholarly", "Noble|Diplomat|Envoy|Steward|Chamberlain|Advisor|Tutor|Scholar|Household Secretary|Estate Manager")
  ];

  const trait = (tone, facet, text) => list(text).map((label) => ({ id: slug(label), label, tone, facet, baseWeight: 1 }));
  const traits = [
    ...trait("strength", "social", "Kindhearted|Hospitable|Diplomatic|Tactful|Gracious|Empathetic|Sincere"),
    ...trait("strength", "temperament", "Patient|Calm|Composed|Resilient|Forgiving|Cheerful|Steady"),
    ...trait("strength", "principle", "Loyal|Honest|Principled|Fair-minded|Protective|Dutiful|Generous"),
    ...trait("strength", "work", "Resourceful|Meticulous|Dependable|Disciplined|Practical|Industrious|Attentive"),
    ...trait("strength", "confidence", "Courageous|Decisive|Self-assured|Persistent|Adaptable|Inventive|Bold"),
    ...trait("strength", "expression", "Witty|Observant|Curious|Open-minded|Humble|Thoughtful|Discreet"),
    ...trait("complication", "social", "Shady|Suspicious|Aloof|Blunt|Nosy|Judgmental|Controlling"),
    ...trait("complication", "temperament", "Short-tempered|Impatient|Anxious|Touchy|Spiteful|Resentful|Easily flustered"),
    ...trait("complication", "principle", "Greedy|Vain|Jealous|Vindictive|Opportunistic|Miserly|Dishonest"),
    ...trait("complication", "work", "Forgetful|Unreliable|Fussy|Distractible|Rigid|Indecisive|Careless"),
    ...trait("complication", "confidence", "Cowardly|Arrogant|Reckless|Overconfident|Gullible|Pessimistic|Paranoid"),
    ...trait("complication", "expression", "Secretive|Boastful|Cynical|Melodramatic|Superstitious|Impulsive|Evasive"),
    ...trait("texture", "social", "Formal|Flamboyant|Chatty|Laconic|Deferential|Commanding|Nurturing"),
    ...trait("texture", "temperament", "Excitable|Dreamy|Solemn|Restless|Stoic|Playful|Intense"),
    ...trait("texture", "principle", "Sentimental|Ritualistic|Nostalgic|Reverent|Competitive|Worldly|Provincial"),
    ...trait("texture", "work", "Fastidious|Bookish|Pragmatic|Old-fashioned|Fashionable|Literal-minded|Methodical"),
    ...trait("texture", "confidence", "Theatrical|Earnest|Relaxed|Quirky|Mischievous|Philosophical|Conspiratorial"),
    ...trait("texture", "expression", "Soft-spoken|Loud|Deadpan|Sardonic|Breathless|Measured|Absent-minded")
  ];

  const conflicts = {
    patient: ["impatient"], calm: ["short-tempered"], composed: ["easily-flustered"], loyal: ["unreliable"],
    honest: ["dishonest", "shady"], generous: ["greedy", "miserly"], humble: ["arrogant", "vain"],
    courageous: ["cowardly"], decisive: ["indecisive"], dependable: ["unreliable"], disciplined: ["impulsive", "careless"],
    forgiving: ["vindictive", "resentful"], cheerful: ["pessimistic"], chatty: ["laconic"], "soft-spoken": ["loud"]
  };
  traits.forEach((entry) => { entry.conflicts = conflicts[entry.id] || []; });

  const cue = (type, tags, text) => list(text).map((value, index) => ({ id: `${type}-${slug(value)}-${index}`, text: value, tags: tags.split(" ").filter(Boolean), baseWeight: 1 }));
  const appearances = [
    ...cue("appearance", "generic", "A carefully repaired coat with mismatched stitching.|A cluster of old keys hanging from a worn belt.|Ink stains worked deep into the fingertips.|A faded scarf wrapped twice around the neck.|One immaculate glove and one visibly patched glove.|A practical satchel bulging with folded papers.|Boots polished everywhere except at the toes.|A small collection of pins from distant towns.|Spectacles held together by a neat wire repair.|A weathered hat with a freshly replaced band.|A belt crowded with labeled little pouches.|A coat that was expensive several owners ago.|A sharply pressed collar above travel-worn clothes.|A visible old burn across one sleeve.|Bright thread used to mend otherwise plain clothing.|A heavy signet ring worn on a cord instead of a finger.|An apron covered in old stains but newly washed.|A lucky charm tied where it can be touched quickly.|A walking stick cut with tiny tally marks.|A tidy braid threaded with plain metal beads."),
    ...cue("appearance", "trade service", "A brass key ring heavy enough to pull the belt sideways.|A measuring cord wrapped around one wrist.|Chalk prices written along the edge of one cuff.|A coin scale tucked into a padded leather case.|Sleeves rolled with practiced, symmetrical folds.|A ledger chain disappearing into an inner pocket.|Several sample swatches pinned beneath the collar.|A thumb darkened from counting old copper coins.|A narrow tool for opening crates tucked behind one ear.|A merchant's apron with hidden reinforced pockets."),
    ...cue("appearance", "maritime coastal", "Salt-stiffened cuffs and wind-cracked boots.|A tarred rain cape smelling faintly of rope.|A coil of thin line worn like a sash.|Sea-glass beads braided into the hair.|A tide chart folded into a waterproof case.|Old rope burns crossing both palms.|A coat fastened with mismatched shipboard buttons.|A tiny brass compass hanging at the throat.|Sun-bleached fabric beneath a dark storm cloak.|A shell token drilled and tied to the belt."),
    ...cue("appearance", "arcane scholarly", "Faintly luminous ink caught beneath the nails.|A sleeve singed in several precise little arcs.|Copper-rimmed lenses tinted against magical glare.|A bundle of quills sorted by color and length.|Protective runes sewn discreetly inside the cuffs.|A crystal focus wrapped in layers of soft cloth.|Several bookmarks protruding from every pocket.|A thin dusting of violet residue across one shoulder.|Notes written densely along a leather wrist guard.|A robe hem repaired with entirely mundane thread."),
    ...cue("appearance", "military civic", "A uniform altered for comfort rather than parade.|A dented badge polished brighter than the rest.|An old shield strap repurposed as a belt.|Boots showing the square wear of long guard shifts.|A whistle hanging beside a small first-aid pouch.|A cloak clasp bearing scratches from removed insignia.|A neatly wrapped wrist beneath a stiff uniform cuff.|Armor maintained carefully despite many old dents.|A regulation haircut beginning to grow out.|A duty roster folded into the crown of a helmet."),
    ...cue("appearance", "criminal", "A reversible coat with two very different linings.|Gloves thin enough to feel a coin's edge.|A harmless-looking cane weighted at the handle.|Several pockets closed with silent cloth ties.|A hood cut to leave peripheral vision unobstructed.|A plain ring bearing fresh tool marks.|Shoes resoled with unusually quiet leather.|A belt buckle designed to release in one motion.|A scarf positioned to cover the face quickly.|A small mirror sewn inside one cuff."),
    ...cue("appearance", "wilderness nature", "Burrs and dry grass caught in the lower hems.|A bundle of fresh herbs tied beside older dried ones.|Mud stained into boots that were once finely made.|A cloak clasp carved from shed horn.|Several feathers tucked into a map case.|A waterskin repaired with careful waxed stitching.|A knife sheath darkened by years of plant sap.|Seeds collected in tiny folded paper packets.|A sun-faded hood lined with soft moss-colored cloth.|A walking staff marked with regional trail signs."),
    ...cue("appearance", "engineering craft", "Fine metal filings glittering in the sleeve seams.|A magnifying lens mounted on a folding armature.|Three different hammers hanging in exact size order.|Protective goggles pushed permanently onto the forehead.|A burn-proof apron patched with ordinary cloth.|A pencil worn down to a stub behind one ear.|Calipers tucked into a custom belt loop.|A row of tiny screwdrivers in a rigid wrist case.|One boot capped with a replacement plate of bright metal.|A mechanical timer that ticks slightly too fast."),
    ...cue("appearance", "furred horned scaled undead ageless", "One distinctive marking carefully framed by clothing.|A small crack, scar, or notch repaired with visible care.|Decorative rings arranged in a deliberately uneven pattern.|A weathered surface polished smooth where hands often rest.|A ceremonial cord contrasting with practical everyday gear.|Old damage incorporated into a newer personal ornament.|A protective wrap placed over the most vulnerable feature.|A single bright accent against otherwise muted clothing.|A practical harness adjusted many times over the years.|A family token fitted to anatomy it was not made for.")
  ];

  const mannerisms = [
    ...cue("mannerism", "generic", "Pauses for one deliberate breath before answering.|Repeats the final word of an important sentence quietly.|Looks toward the nearest exit whenever voices rise.|Uses people's full names after hearing them once.|Smooths the same fold of clothing while thinking.|Counts silently on the fingers below the table.|Tilts the head as if listening to a distant sound.|Answers questions in the order they were asked.|Keeps eye contact a moment longer than expected.|Nods once before disagreeing with someone.|Lowers the voice instead of raising it when annoyed.|Fills brief silences with a soft, tuneless hum.|Touches a lucky charm before making a promise.|Corrects small factual errors even when it is unhelpful.|Laughs once, sharply, at their own bad jokes.|Leaves a careful pause before saying any number.|Gestures with an open palm when asking for trust.|Squints at people as if reading very small writing.|Taps two fingers together while weighing an answer.|Apologizes to objects after bumping into them."),
    ...cue("mannerism", "trade service", "Taps two coins together while considering an offer.|Restates every agreement as a neat list of terms.|Mentally calculates while the other person is still speaking.|Calls everyone 'friend' until money changes hands.|Checks the condition of anything placed on the counter.|Writes down promises immediately and dates them.|Offers one conspicuously free sample before negotiating.|Keeps a thumb pressed between the current ledger pages.|Names three prices before settling on the real one.|Wraps even worthless objects with professional care."),
    ...cue("mannerism", "maritime coastal", "Measures time in tides rather than hours.|Leans subtly as though compensating for a rolling deck.|Knocks twice on nearby wood after mentioning luck.|Uses sailing directions for places nowhere near water.|Tests the air before predicting trouble.|Coils any loose cord within reach while speaking.|Calls unfamiliar streets port and starboard.|Stops speaking whenever a bell sounds in the distance.|Drums a slow harbor rhythm with one heel.|Spits over one shoulder before accepting a wager."),
    ...cue("mannerism", "arcane scholarly", "Defines an obscure term immediately after using it.|Traces tiny diagrams in the air while explaining.|Loses volume whenever the subject becomes interesting.|Quotes sources but forgets ordinary names.|Rearranges nearby objects into symmetrical groups.|Checks a note, then checks the note's footnote.|Pronounces magical words with exaggerated precision.|Finishes other people's technical sentences.|Uses page numbers as though everyone knows the book.|Whispers corrections to remembered lectures."),
    ...cue("mannerism", "military civic", "Scans hands before faces when meeting someone.|Gives directions in exact distances and landmarks.|Stands whenever someone senior enters the room.|Keeps sentences short when under pressure.|Uses old rank titles without noticing.|Checks windows and doors during every pause.|Moves obstacles out of walking paths automatically.|Answers requests with 'understood' before considering them.|Keeps the dominant hand free in crowded places.|Ends conversations with a small formal nod."),
    ...cue("mannerism", "criminal", "Never reaches directly for an offered object.|Watches reflections instead of turning around.|Changes one minor detail each time a story is repeated.|Asks harmless questions while examining valuables.|Keeps both hands visible when trying to appear trustworthy.|Uses a different nickname with every new group.|Smiles only after the other person looks away.|Tests locked drawers absent-mindedly while passing.|Positions chairs so no one can stand behind them.|Leaves sentences unfinished when names would be involved."),
    ...cue("mannerism", "wilderness nature", "Identifies distant animals by sound mid-conversation.|Tests the wind before choosing where to stand.|Collects useful scraps of cord without thinking.|Uses trail signs as metaphors for social situations.|Checks the sky whenever plans are discussed.|Notices fresh tracks before obvious decorations.|Breaks food into equal pieces before eating.|Avoids stepping on roots even indoors.|Speaks more comfortably while walking than sitting.|Marks directions with tiny arrangements of pebbles."),
    ...cue("mannerism", "engineering craft", "Turns small objects over to inspect how they were made.|Measures gaps with a fingertip while listening.|Makes tiny tightening motions when impatient.|Describes emotions using mechanical failures.|Collects loose screws and nails into separate pockets.|Stops to fix crooked fixtures without asking.|Taps materials to judge them by sound.|Counts tool teeth or stitches during awkward silences.|Sketches improvements on any available scrap.|Tests hinges twice after closing them."),
    ...cue("mannerism", "formal flamboyant chatty laconic loud soft-spoken", "Begins every introduction with an unnecessary flourish.|Whispers gossip with theatrical seriousness.|Uses the fewest possible words, then adds one more.|Turns ordinary anecdotes into miniature performances.|Addresses strangers as though receiving them at court.|Drops the voice dramatically before mundane details.|Punctuates stories with precise hand gestures.|Waits for an audience before delivering a punchline.|Practices difficult phrases under the breath.|Bows differently according to perceived status.")
  ];

  return {
    schemaVersion: 1,
    ageProfiles,
    raceProfiles,
    genders: [
      { id: "male", label: "Male", weight: 45 }, { id: "female", label: "Female", weight: 45 },
      { id: "nonbinary", label: "Non-binary", weight: 7 }, { id: "unspecified", label: "Unspecified", weight: 3 }
    ],
    factions,
    jobs,
    traits,
    appearances,
    mannerisms,
    affinityMultipliers: { excluded: 0, veryUnlikely: 0.2, uncommon: 0.55, neutral: 1, common: 2, signature: 4 }
  };
});
