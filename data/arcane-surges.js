(function (root, factory) {
  const table = factory();
  if (typeof module === "object" && module.exports) module.exports = table;
  if (root) root.ARCANE_SURGES = table;
})(typeof window !== "undefined" ? window : globalThis, function () {
  // Preserve all 60 original normal results and all 19 former critical results.
  const normalEffects = [
      "CRUSHING FORCE DAMAGES YOU EQUAL TO 1D4 X SPELL LEVEL",
      "YOU GROW DEMONIC FOR 1 MIN; ADVANTAGE ON INTIMIDATION, DISADVANTAGE ON PERSUASION",
      "A RANDOM ELEMENTAL SURGE BURSTS WITHIN 10 FEET",
      "YOU AND A CLOSEST CREATURE BLINK OUT OF EXISTENCE FOR 1D4 ROUNDS",
      "MANA WRAITH APPEARS AND ATTACKS YOU",
      "YOUR NEXT SPELL IS CAST 1 LEVEL HIGHER BUT DEALS SPELL LEVEL DAMAGE TO YOU",
      "VOID TAINT: SMALL CREATURES ARE FRIGHTENED BY YOU FOR 24 HOURS",
      "ARCANE EXPLOSION: 10 FEET, DEX SAVE OR TAKE FORCE DAMAGE = CASTER LEVEL",
      "FRIENDLY WISP GRANTS ADVANTAGE ON YOUR NEXT SAVING THROW",
      "LEY LINE BURNOUT: YOU CAN'T CAST SPELLS UNTIL LONG REST",
      "YOU AND ONE RANDOM ENEMY SWITCH PLACES INSTANTLY",
      "MAGICAL FEEDBACK: TAKE 1D6 FORCE DAMAGE PER SPELL LEVEL CAST",
      "SPEAK IN TONGUES; NO ONE UNDERSTANDS YOU FOR 1D4 HOURS",
      "A RANDOM MAGIC ITEM IN YOUR POSSESSION IS TEMPORARILY SILENCED",
      "RANDOM WEAPON NEARBY GLOWS BRIGHTLY FOR 1 MINUTE",
      "SPELL MISFIRES INTO A RANDOM SCHOOL OF MAGIC",
      "YOU SHRIEK A PIERCING TONE; ALL WITHIN 20 FT MAKE A CON SAVE OR BE DEAFENED 1 MIN",
      "TELEPORT 10 FEET IN A RANDOM DIRECTION",
      "YOU GAIN DARKVISION 60 FT FOR 1 HOUR",
      "CONJURE A MINOR ILLUSION THAT FOLLOWS YOU FOR 1 HOUR",
      "YOU BECOME SILENT; YOU CANNOT SPEAK FOR 1D4 ROUNDS",
      "FORCEDLY SPEAK THOUGHTS OUT FOR 1 HOUR",
      "TREMOR SHAKES GROUND; CREATURES WITHIN 30 FT DEX SAVE OR FALL PRONE",
      "MIRROR IMAGE APPEARS AND MIMICS YOU FOR 1 MINUTE",
      "MOUTH BURNS IN FEL FLAMES FOR 1 MINUTE; 1D4 DMG EACH ROUND",
      "RECOVER 1D8 MANA IMMEDIATELY",
      "AGE OR DE-AGE 1D10 YEARS (50/50 CHANCE)",
      "NEXT ATTACK OR SPELL ATTACK AUTOMATICALLY MISSES",
      "YOU BECOME EXTREMELY HUNGRY; MUST EAT WITHIN 1 HOUR OR TAKE EXHAUSTION",
      "GLIMPSE TWISTING NETHER; STUNNED FOR 1 ROUND",
      "SHADOW DETACHES AND DANCES FOR 1 MINUTE",
      "PULLED 30 FEET IN A RANDOM DIRECTION",
      "ALLERGIC TO MAGIC: DISADVANTAGE ON SPELL SAVES FOR 1D4 ROUNDS",
      "MINOR LEY LINE AWAKENS: ALL CASTERS REGAIN 1D8 MANA",
      "EXPLODE WITH LIGHT; HEAL ALL WITHIN 30 FEET FOR 10 HP",
      "YOUR SPOKEN WORD BECOMES GHOSTLY AND UNINTELLIGIBLE FOR 1 HOUR",
      "YOU VOMIT VIOLENTLY, BECOMING PRONE AND INCAPACITATED FOR 1 ROUND",
      "ARCANE MISSILES LAUNCH AT EVERY CREATURE WITHIN 30 FEET (1D8 DAMAGE EACH)",
      "YOU BECOME MAGICALLY BLINDED FOR 1D4 ROUNDS",
      "YOUR HANDS GROW MASSIVE AND FOR 1 MIN (DISADVANTAGE WITH HAND PRECISION)",
      "YOU SHRINK TO 1/4 SIZE FOR 1D6 MINUTES",
      "ITEM IN HAND EXPLODES IN A PUFF OF PURPLE SMOKE (NO DAMAGE, JUST GONE)",
      "YOU BEGIN FLOATING UPSIDE DOWN 3 FEET ABOVE THE GROUND FOR 1 MINUTE",
      "YOUR NEXT SPELL IS REVERSED IN EFFECT (GM DETERMINES OUTCOME)",
      "A SMALL PORTAL OPENS AND A RANDOM PIECE OF FURNITURE FALLS ON YOU (1D6 DAMAGE)",
      "YOU BECOME A RANDOM ANIMAL FOR 1D4 MINUTES",
      "ALL TEXT AND SYMBOLS AROUND YOU REARRANGE INTO NONSENSE FOR 10 MINUTES",
      "A MYSTERIOUS ARCANE HAND SLAPS YOU (1D4 DAMAGE, NO SAVE)",
      "YOU RANDOMLY SWAP BODIES WITH AN ALLY FOR 1D4 ROUNDS (MENTAL STATS STAY, PHYSICAL CHANGE)",
      "A RANDOM WILD BEAST (CR 4) IS SUMMONED NEAR YOU AND STARTLES EVERYONE",
      "YOU BECOME ETHEREAL FOR 1 ROUND, UNABLE TO TOUCH OR BE TOUCHED",
      "YOU CHANT THE NAME OF YOUR DEITY LOUDLY AND INCOHERENTLY FOR 1D4 ROUNDS",
      "YOUR ARMOR OR CLOTHES SEPARATE AND BEGIN DANCING FOR 1 MINUTE",
      "YOUR BODY CHANGES GENDER FOR 24 HOURS",
      "EVERYTHING YOU TOUCH FEELS EXTREMELY SLIPPERY FOR 10 MINUTES",
      "TRAPPED IN A MAGICAL BUBBLE; FLOAT 10 FEET UP FOR 1 MINUTE",
      "A SPECTER OF YOUR FAMILY MEMBER APPEARS AND REACTS TO YOUR NEXT ACTION",
      "YOUR FEET LIGHT ON FIRE, CAUSING YOU TO RUN RANDOMLY FOR 1 ROUND (NO DAMAGE)",
      "SPELL WILDLY SUCCESSFUL: DOUBLE RANGE, DURATION, OR POWER (YOUR CHOICE)",
      "YOU DISINTEGRATE INTO PURE ARCANE ENERGY UNTIL SOMEONE CASTS A SPELL",
      "ALL CREATURES WITHIN 120 FEET ARE TELEPORTED RANDOMLY UP TO 1 MILE AWAY",
      "TIME WARPS: EVERY CREATURE IN 30 FEET TAKES 1 EXTRA TURN IMMEDIATELY",
      "A BLACK HOLE FORMS, GROWING 10 FEET EACH TURN FOR 1 HOUR",
      "ALL MAGICAL EFFECTS IN 1000 FEET ARE IMMEDIATELY DISPELLED",
      "YOUR MIND BRIEFLY TOUCHES THE VOID: YOU GAIN A MADNESS EFFECT",
      "YOU GAIN A SINGLE USE OF WISH, FOR A PRICE",
      "YOU FLOOD WITH RAW MAGIC: ARCANE SURGE EVERY ROUND FOR 1D6 ROUNDS",
      "A COLLAPSE IN REALITY ERASES 30 FT OF TERRAIN INTO NOTHINGNESS",
      "YOU ARE GRANTED POWERS OF A DEMIGOD FOR 1 MINUTE (ALL ABILITY SCORES SET TO 24)",
      "TIME FREEZES FOR ALL CREATURES EXCEPT YOU FOR 1 ROUND",
      "A RANDOM ALLY WITHIN 60 FEET IS TURNED TO STONE FOR 1D6 ROUNDS (NO SAVE)",
      "YOU BECOME A LIVING ARCANE STORM; 3D10 LIGHTNING DAMAGE TO ALL CREATURES WITHIN 30 FEET EACH ROUND FOR 1 MIN",
      "YOU ARE FULLY HEALED AND REGAIN ALL MANA - IMMEDIATELY SUFFER 1D4 LEVEL OF EXHAUSTION",
      "PLANES COLLIDE: 10D10 PLANAR RIFTS APPEAR",
      "THE NEXT SPELL YOU CAST INSTANTLY MAXIMIZES DAMAGE, RANGE, AND DURATION - BUT YOU TAKE HALF THE DAMAGE YOURSELF",
      "A MASSIVE EARTHQUAKE ERUPTS CENTERED ON YOU (DMG EARTHQUAKE SPELL EFFECTS)",
      "YOU LOSE ALL SENSE OF SELF: CONTROL OF YOUR CHARACTER PASSES TO THE GM FOR 1D4 ROUNDS",
      "TWISTING NETHER APPEARS IN THE SKY FOR 1D6 HOURS, CAUSING MASSIVE ENVIRONMENTAL CHAOS",
      "THE BARRIER BETWEEN LIFE AND DEATH WEAKENS: 1D100 DEAD CREATURES WITHIN 1 KM RISE AS UNDEAD FOR 24 HOURS"
  ];

  // Locked v4, 2026-09-24. Keep 25 major outcomes; Warcraft powers, beings, and mysteries.
  // These are authored tabletop outcomes, not generated or automatically rebalanced.
  const desperateEffects = [
    {
      id: "become-the-spell",
      title: "You become the spell",
      text: "Maximize the triggering spell's damage and healing. Become a towering arcane entity for 1 minute: regain all mana, gain a 60-foot flying speed, and double spell damage. At each turn's end, everything else within 30 feet takes 3d10 force damage, including allies and structures.\nAfterward, reform unconscious inside a crystal (AC 15, 40 HP). Only breaking it from outside awakens you; damage to it cannot harm you."
    },
    {
      id: "star-inside-you",
      title: "A star ignites inside you",
      text: "Your spell resolves; a miniature sun burns through your chest. At your next turn's end, it explodes within 60 feet for 12d10 force damage. Other creatures make a DEX save for half; you and unattended nonmagical objects and structures take full damage.\nUntil then, you can move, act, and be moved normally. Unconsciousness cannot stop the visible countdown.",
      usesSave: true
    },
    {
      id: "battlefield-in-the-nether",
      title: "The battlefield falls into the Twisting Nether",
      text: "You, all creatures within 120 feet, and the terrain fall into the Twisting Nether. One 20-foot-wide passage home remains at the center, closing at the end of your third turn after this one.\nA colossal predator arrives as it closes; the DM chooses its form and statistics. Anything left behind must find another way home. The original site is a crater."
    },
    {
      id: "death-loses-its-hold",
      title: "Death loses its hold",
      text: "All creatures within 120 feet that died in the last minute return at full health. For 1 minute, nobody in this fixed area can die: even at 0 HP, they remain conscious and can act.\nLeaving restores normal mortality. When the minute ends, anyone still at 0 HP falls unconscious and begins dying normally. Revived creatures stay alive."
    },
    {
      id: "the-dead-answer",
      title: "The dead answer your call",
      text: "Every corpse within 1 mile rises as undead, obeying your spoken commands for 1 minute regardless of distance. Use skeleton or zombie statistics for ordinary remains; the DM chooses suitable undead for exceptional corpses.\nYour control then ends. The dead remain awake, pursuing their strongest desires in life. Every nearby grave lies empty."
    },
    {
      id: "devour-the-ley-line",
      title: "You devour the local ley line",
      text: "End all ongoing spells within 300 feet and regain all health and mana. For 1 minute, cast known spells without mana, within your usual spell levels; actions and material components still apply.\nThen that fixed 300-foot radius becomes a dead magic zone: spells and magic items stop working until a major ritual or quest repairs the ley line."
    },
    {
      id: "something-offers",
      title: "Something offers to end this",
      text: "Time stops. An entity offers to destroy the attackers, restore the slain, or carry everyone to safety. The DM names an exact price: free a named prisoner, surrender a protected place, or permanently lose spellcasting.\nYou understand and choose freely. Accept for immediate deliverance; refuse, and time resumes with your spell resolving normally. The entity remembers you."
    },
    {
      id: "reality-tears-open",
      title: "Reality tears open",
      text: "Choose a point within 120 feet: a 60-foot-wide bottomless breach opens. Creatures there make a DEX save to reach the nearest edge or fall into the Nether. Buildings and unattended objects fall too.\nIts radius grows 10 feet at each of your turn starts. Three creatures can seal it using actions at separate rim points in the same round. Sealing it returns nothing lost.",
      usesSave: true
    },
    {
      id: "last-minute-again",
      title: "The last minute happens again",
      text: "Reset the scene to 1 minute ago: positions, wounds, deaths, objects, and spent resources. Everyone remembers the erased minute; this surge does not repeat.\nEach creature that died leaves a hostile arcane duplicate where it fell, using its statistics and full HP. Duplicates attack their living originals first and remain until destroyed. Players keep control of their characters."
    },
    {
      id: "every-hidden-thing",
      title: "Every hidden thing is revealed",
      text: "Magical disguises and illusions within 1 mile collapse. Every creature within 120 feet projects a memory it desperately wants concealed. Players choose their characters' memories; the DM chooses NPCs'.\nThe visions remain above the site until next dawn, visible and audible to anyone approaching. Their owners cannot dismiss them."
    },
    {
      id: "torn-from-the-world",
      title: "You and your enemy are torn from the world",
      text: "You and a visible enemy vanish into sealed, broken reality; both regain full health. With no enemy present, the DM chooses someone opposing your current goal.\nEscape requires one of you to die or both willingly surrendering something the other demands. Teleportation and planar travel fail. However long this takes, survivors return after only 1 round outside."
    },
    {
      id: "ground-takes-flight",
      title: "The ground takes flight",
      text: "A 120-foot-radius island, including buildings and creatures, rises 300 feet over 3 rounds. Destroy its three rim anchors (each AC 15, 30 HP) to settle it safely.\nOtherwise, it crashes 1 minute after the surge. Creatures aboard take 12d6 bludgeoning damage, DEX save for half. Structures shatter; the land remains scarred.",
      usesSave: true
    },
    {
      "id": "elemental-storm",
      "title": "Elemental storm stirs",
      "usesSave": true,
      "variants": [
        {
          "id": "wind",
          "label": "Wind",
          "text": "A windstorm fills a 120-foot radius around you for 1 minute. Other creatures starting turns inside make a STR save: 8d10 bludgeoning damage, hurled 60 feet outward, and prone; half damage only on success.\nYou are unharmed. Roofs and unsecured cover tear away. At each of your turn starts, you may move its center up to 60 feet; otherwise it stays."
        },
        {
          "id": "fire",
          "label": "Fire",
          "text": "A firestorm fills a 120-foot radius around you for 1 minute. Other creatures starting turns inside take 10d10 fire damage, DEX save for half. Unattended flammables ignite; wooden structures start collapsing after 3 rounds.\nYou are unharmed. At each of your turn starts, you may move its center up to 60 feet. Ordinary fires and scorched ground remain afterward."
        },
        {
          "id": "ice",
          "label": "Ice",
          "text": "A blizzard fills a 120-foot radius around you for 1 minute. Other creatures starting turns inside make a CON save: 8d10 cold damage and speed 0 until their next turn; half damage only on success.\nYou are unharmed. At each of your turn starts, you may move its center up to 60 feet. Water freezes; ice blocks roads and doors until melted."
        },
        {
          "id": "sand",
          "label": "Sand",
          "text": "A sandstorm fills a 120-foot radius around you for 1 minute. Other creatures starting turns inside take 8d10 slashing damage, CON save for half. The sand blinds occupants and blocks sight through it.\nYou are unharmed and can see through it. At each of your turn starts, you may move its center up to 60 feet. It leaves 10-foot dunes across its final area, burying doors and fallen objects."
        }
      ]
    },
    {
      "id": "azeroth-flows-through-you",
      "title": "Azeroth flows through you",
      "text": "Blue and gold light fills your veins. Regain all health and mana. For 1 minute, maximize damage and healing rolls; spells cost no mana. Normal casting times, components, and spell-level limits apply.\nOnce during this minute, use an action to end all curses, possessions, and hostile magic on chosen creatures within 120 feet. Luminous crystals bloom. As power fades, Azeroth asks for help at a DM-named place."
    },
    {
      "id": "local-loa",
      "title": "You shapeshift into a local loa",
      "text": "The DM chooses a local loa, or one from the nearest troll shrine. Become its towering likeness for 1 minute: 200 temporary HP, doubled damage rolls and movement speeds, and appropriate flight or swimming. Keep control and spellcasting.\nThe loa and its worshippers notice. Revert when the minute or temporary HP run out; excess damage carries over and unused temporary HP vanish."
    },
    {
      "id": "titans-know-your-name",
      "title": "The Titans know your name",
      "text": "Constellations appear, even underground. A vast voice speaks your full name. Golden geometries shield you and up to six chosen creatures within 120 feet from all damage and hostile spells for 1 minute.\n'Continue.' The stars vanish. Nearby titan machinery wakes and acknowledges you. Who spoke, why you were recognized, and what they expect remain unknown."
    },
    {
      "id": "dragon-aspect-power",
      "title": "You wield a Dragon Aspect's power",
      "variants": [
        {
          "id": "red",
          "label": "Life",
          "usesSave": true,
          "text": "Red wings unfold for 1 minute. At each of your turn starts, chosen creatures within 120 feet heal 30 HP. As an action, breathe a 60-foot cone: chosen creatures heal 8d10 HP; others take 8d10 fire damage, DEX save for half.\nOnce before it fades, touch someone dead for at most 1 minute to revive them at full health. Crimson flowers bloom in their spilled blood."
        },
        {
          "id": "blue",
          "label": "Magic",
          "text": "Your eyes become blue stars. For 1 minute, known spells cost no mana and maximize damage and healing. Normal casting times, components, and spell-level limits apply. As a reaction, cancel a spell you see cast within 120 feet without a check.\nRunes blaze; wards bend toward you. Afterward, lose all remaining mana. The blue dragonflight senses your intrusion."
        },
        {
          "id": "green",
          "label": "Dream",
          "usesSave": true,
          "text": "Emerald wings unfold for 1 minute. You and chosen companions within 60 feet move through objects and creatures as mist. Ending a turn inside solid matter pushes you to the nearest open space.\nAs an action, chosen creatures within 120 feet make a WIS save or sleep until the power ends. Damage or another creature's action wakes them. Sleepers see a great green dragon; their bodies remain here."
        },
        {
          "id": "bronze",
          "label": "Time",
          "text": "Golden sand hangs motionless. You and up to three chosen allies immediately take three extra turns each, one turn apiece across three passes. Everyone else freezes: no movement, actions, or reactions, but damage and saves still apply.\nTime then resumes. Enemies experience all those movements, wounds, and spells at once."
        },
        {
          "id": "black",
          "label": "Earth",
          "usesSave": true,
          "text": "Obsidian plates grant 200 temporary HP for 1 minute. Once on your turn, as an action, raise or lower up to three 30-foot cubes of earth or stone within 120 feet by up to 60 feet. Partly supported structures break; others move.\nCreatures on moving ground make a DEX save or take 8d10 bludgeoning damage and fall prone; successes travel unharmed. Terrain stays reshaped; armor and unused temporary HP fade."
        }
      ]
    },
    {
      id: "sanctuary-becomes-a-gate",
      title: "Your sanctuary becomes a gate",
      text: "A 60-foot-wide, two-way portal opens to your home, or your last refuge if you have no home. It stays open for 1 minute, then reopens at every dawn for 1 minute.\nOnly destroying both thresholds in the same round ends the connection (each AC 15, 60 HP). Your refuge now has a permanent entrance here."
    },
    {
      "id": "old-god-waking",
      "title": "You hear an Old God waking",
      "usesSave": true,
      "text": "A heartbeat rises from beneath the world. A vast voice forces everyone within 120 feet to make a WIS save: 8d10 psychic damage and frightened for 1 minute; half damage only on success. Repeat saves at each turn's end.\nStone opens onto a chanting passage marked with Black Empire symbols. The DM chooses a fitting voice: waking god, servant, or ancient echo remains uncertain."
    },
    {
      "id": "emerald-dream-spills",
      "title": "The Emerald Dream spills into the world",
      "usesSave": true,
      "text": "An ancient forest erupts across a 120-foot radius, breaking masonry and roofs. Chosen allies gain 100 temporary HP for 1 minute. Others make a STR save or become restrained, taking 6d10 piercing damage at turn starts; repeat saves at turn ends.\nAfter 1 minute, roots release and unused temporary HP fade. The forest stays, along with a DM-chosen Nightmare creature that crossed with it."
    },
    {
      id: "war-machine-awakens",
      title: "An ancient war machine awakens",
      text: "A titan-forged colossus erupts beneath the battlefield. At each of your turn ends, it destroys a 30-foot cube of structures within 120 feet; creatures there take 10d10 force damage, DEX save for half.\nSpend actions at all three exposed control pillars in one round to direct its destruction for 1 minute before shutdown. Otherwise, after 3 rounds it marches toward the nearest settlement, firing every round.",
      usesSave: true
    },
    {
      "id": "legion-answers-your-spell",
      "title": "The Burning Legion answers your spell",
      "text": "Open a 60-foot-wide fel gateway within 120 feet. An infernal and 2d6 felguards emerge, obeying one spoken command for 3 rounds; the DM chooses suitable statistics. Then obedience ends.\nThe gate lasts 1 minute, adding 1d6 felguards each round. Destroy its anchor (AC 18, 100 HP) to close it early; existing demons remain. Green fire marks the site for days."
    },
    {
      id: "sky-passes-judgment",
      title: "The sky passes judgment",
      text: "Mark three visible points within 300 feet with 30-foot-radius sigils, visible through cover. At your next turn's end, each takes a meteor: 20d6 fire damage, DEX save for half. Overlapping blasts hit only once; unattended nonmagical structures are destroyed.\nThe craters burn for 7 days. Entering one or starting a turn there deals 4d6 fire damage, at most once per turn.",
      usesSave: true
    },
    {
      "id": "naaru-descends",
      "title": "A naaru descends",
      "text": "A singing, crystalline naaru appears above you, visible for miles. Chosen creatures within 120 feet regain full health and lose the blinded, frightened, paralyzed, poisoned, and stunned conditions. For 1 minute, they heal another 20 HP at each of your turn starts.\nDemons and undead starting turns within 60 feet of it take 8d10 radiant damage. Afterward, the ground stays consecrated for 24 hours: no raising corpses or summoning demons."
    },
    {
      id: "speak-a-new-law",
      title: "You speak a new law of reality",
      text: "Speak one prohibition on movement, magic, harm, or death: 'No one can die,' 'No metal can move,' or 'No spell can be cast.' For 24 hours, it becomes literal law within a fixed 300-foot radius.\nIt binds everyone, including you. No exceptions, forced allegiance, or commanded deaths. The DM interprets it literally; you cannot change or dismiss it."
    }
  ];

  const NORMAL_SURGES = Object.freeze(normalEffects.map((text, index) => Object.freeze({ id: `normal-${index + 1}`, text })));
  const DESPERATE_SURGES = Object.freeze(desperateEffects.map((effect) => Object.freeze(
    effect.variants ? { ...effect, variants: Object.freeze(effect.variants.map((variant) => Object.freeze(variant))) } : effect
  )));
  const DESPERATE_CHANCE = 0.1;

  function rollArcaneSurge({ desperate = false, random = Math.random } = {}) {
    const isDesperate = desperate || random() < DESPERATE_CHANCE;
    const pool = isDesperate ? DESPERATE_SURGES : NORMAL_SURGES;
    const kind = isDesperate ? "desperate" : "normal";
    const effect = pool[Math.floor(random() * pool.length)];
    if (!effect.variants) return { kind, effect };
    // Resolve the secondary roll once so skipping the reveal cannot change it.
    const variant = effect.variants[Math.floor(random() * effect.variants.length)];
    return { kind, effect: Object.freeze({
      id: effect.id,
      variantId: variant.id,
      title: effect.title + ": " + variant.label,
      text: variant.text,
      usesSave: variant.usesSave ?? effect.usesSave ?? false
    }) };
  }

  return Object.freeze({ version: 4, lockedOn: "2026-09-24", NORMAL_SURGES, DESPERATE_SURGES, DESPERATE_CHANCE, rollArcaneSurge });
});
