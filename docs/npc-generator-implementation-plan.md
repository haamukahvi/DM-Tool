# NPC Generator implementation plan

## Status

This is the confirmed implementation plan for a Warcraft-only, offline NPC Generator. It is a new sidebar surface placed directly above Loot Roller. It generates compact roleplay material, not story hooks, mechanics, classes, or stat blocks.

## Product outcome

The GM should be able to enter with a partial situation such as “I need a shopkeeper associated with Booty Bay,” select and lock the relevant **Faction** and **Job**, press **GENERATE NPC**, and receive a coherent character that is ready to portray in a few seconds.

The generator deliberately leaves narrative space open. It provides identity, social context, and a few observable roleplay cues without deciding the NPC's secret, quest, relationship to the party, or complete history.

## Confirmed version-one fields

1. **Name** — editable text; generated from the selected race and gender name pools.
2. **Race** — searchable select using the existing 71-race Warcraft dataset.
3. **Gender** — select; version one supports Male, Female, Non-binary, and Unspecified. Non-binary and Unspecified use the combined available name pools unless a race later gains a curated neutral pool.
4. **Age tier** — select using Young, Adult, Mature, Old, and Ancient where the race profile permits them. Do not generate a numerical age.
5. **Faction** — searchable select containing named Warcraft organizations plus Alliance, Horde, and Unaffiliated umbrella options.
6. **Job** — searchable select of in-world civilian and social roles rather than character classes.
7. **Traits** — exactly three separate editable traits.
8. **Appearance** — one short, observable detail.
9. **Voice / mannerism** — one short, playable speech or behavior cue.

Every field has a dice control on its right side and a lock control. Race, gender, age, faction, and job are selects. Name, the three traits, appearance, and voice/mannerism remain editable text.

## Design direction

This is an **Operate** surface inside the established DM Tool visual world. It inherits the existing dark panels, Exo 2 typography, rounded controls, restrained borders, and pink–purple accent treatment. It does not establish a new visual identity.

The screen should use this hierarchy:

1. Existing page-menu control in the top bar.
2. A large **GENERATE NPC** button comparable in prominence to **ROLL FOR LOOT**.
3. A responsive work area:
   - **Context** first: Faction and Job. These are the most likely preselected and locked fields during live play.
   - **Identity** second: Race, Name, Gender, and Age tier.
   - **At the table** third: three Traits, Appearance, and Voice/Mannerism.
4. **Recent NPCs** as collapsed history cards. On wide screens history may occupy a narrower right column; on smaller screens it stacks below the generator.

Generation should feel immediate. Use a short dice turn and field-change highlight around 150–250 ms, not Loot Roller's long roulette animation. Respect `prefers-reduced-motion` and never delay access to the result for animation.

## Why the generator must be constraint-aware

Flat independent rolls would be easy but would frequently produce combinations that feel arbitrary. The implementation should use the same broad ideas as constraint-based procedural content generation: separate hard validity from soft preferences, then use weighted choice to shape frequency while preserving variety. The GM's locks make this a mixed-initiative generator: the human supplies constraints and the software fills the remaining gaps.

Relevant research:

- The [Procedural Content Generation in Games book](https://www.pcgbook.com/) describes constructive, constraint-based, and mixed-initiative generation approaches.
- Its [constraint chapter](https://www.pcgbook.com/chapter08.pdf) distinguishes hard requirements from softer quality preferences.
- Its [mixed-initiative chapter](https://www.pcgbook.com/chapter11.pdf) treats human configuration and algorithmic generation as collaborative authorship.
- Blizzard's [official race overview](https://worldofwarcraft.blizzard.com/en-gb/game/races) reinforces that race and faction allegiance are related, while allowing the project's broader NPC race list to remain the local source of truth.

The implementation does not need a general constraint solver. A small weighted dependency engine is sufficient and easier to tune.

## Generation model

### Hard rules

Hard rules prevent broken data, not unusual stories:

- Locked fields are never changed by **GENERATE NPC**.
- A roll must select an existing option with a positive final weight.
- A generated name must come from a pool available to the selected race.
- Age tier must be allowed by the race's explicit age profile.
- The three traits must be distinct.
- Trait pairs marked as direct semantic opposites cannot appear together.
- Missing or malformed pools must fall back safely rather than crashing the panel.

Manual selections are always allowed. The tool should not forbid an unusual race/faction/job combination chosen by the GM.

### Soft relationships

Soft weights make plausible results common without making exceptions impossible:

- **Faction ↔ Race:** core peoples are common, allied peoples plausible, outsiders unusual.
- **Faction ↔ Job:** a faction's culture and function affect which occupations appear often.
- **Race ↔ Job:** physical, cultural, and regional fit may adjust frequency, but should not become a stereotype or a hard ban.
- **Race → Name:** the strongest dependency.
- **Race → Age tier:** controls availability and relative frequency of life stages.
- **Job + Age tier → Appearance:** influences clothing, wear, tools, and presentation.
- **Job + Traits → Voice/Mannerism:** lightly biases observable behavior.
- **Race ↛ Personality:** race must not determine morality or temperament.

Use a shared affinity scale rather than arbitrary numbers scattered through the data:

| Affinity | Multiplier | Meaning |
| --- | ---: | --- |
| Excluded | 0 | Reserved for a true data impossibility |
| Very unlikely | 0.2 | Possible exception |
| Uncommon | 0.55 | Believable but not typical |
| Neutral | 1 | No preference |
| Common | 2 | Frequently expected |
| Signature | 4 | Strongly associated |

The final candidate weight is its base frequency multiplied by each applicable affinity. Normalize only when drawing. Avoid zero for lore preferences; unusual Warcraft characters should remain possible.

### Full-generation order

On **GENERATE NPC**, treat every unlocked field as empty. Locked fields seed the context from the beginning. Fill unlocked fields in this order:

1. Faction
2. Race
3. Job
4. Gender
5. Age tier
6. Name
7. Three traits
8. Appearance
9. Voice/Mannerism

When scoring an earlier field, include any relevant field that was already locked even if it normally appears later. For example, a locked Shopkeeper job affects the faction and race draws.

### Individual rerolls

An individual dice click rerolls only that field. All other current values become context for the draw. This preserves the user's sense of control and avoids surprising cascades.

- Rerolling Name uses the current Race and Gender.
- Rerolling Race uses the current Faction and Job.
- Rerolling Faction uses the current Race and Job.
- Rerolling Job uses the current Race, Faction, and Age tier.
- Rerolling a trait excludes the other two traits and their direct conflicts.
- Rerolling Appearance or Voice/Mannerism uses the complete current NPC as context.

A lock protects a field from full generation. Clicking that field's own dice is an explicit override and may still reroll it while leaving the lock engaged.

### Fallback ladder

Every draw uses a predictable fallback ladder:

1. Weighted candidates matching all available context.
2. Ignore soft affinities that reduced the pool to zero.
3. Use the full valid base pool for that field.
4. Keep the current value, or show a neutral built-in fallback if no current value exists.

Development builds should log which fallback was used. The production UI should remain calm unless the underlying dataset is genuinely unusable.

## Data architecture

Do not place the NPC catalogs or generator logic inside the already-large `Index.html` component body. Add three testable layers:

### `data/wow-character-options.js`

Keep this as the source for races and race-specific names. Add it to `Index.html` before the Babel application script; it is currently present in the repository but not loaded by the app.

Audit findings that affect implementation:

- It contains 71 races and generally useful male/female first-name pools.
- Name coverage varies from 1–40 entries per gender; many rare races have only four.
- Some races have family/group names and some do not.
- Its `faction` values are coarse leanings such as `Very Alliance`, `Horde-leaning`, and `Neutral`, not named organizations.
- Its lifespan information is inconsistent prose inside `dataChips`; do not parse it to derive age.
- Existing class data is mechanical, and existing backgrounds mix occupations with rules content. Neither should be exposed directly as the NPC Job list.

### `data/npc-generator-data.js`

Create a browser-global, CommonJS-compatible curated data pack:

```js
{
  schemaVersion: 1,
  ageProfiles: {},
  raceProfiles: {},
  factions: [],
  jobs: [],
  traits: [],
  appearances: [],
  mannerisms: [],
  affinities: {
    raceFaction: {},
    raceJob: {},
    factionJob: {}
  }
}
```

Use stable kebab-case IDs. Display strings must be separate from IDs so wording can change without breaking stored history.

Implemented authored coverage target:

- All 71 existing races receive `baseWeight` and `ageProfileId` metadata.
- Every race receives 180 committed male and 180 committed female given names generated at development time from culture-specific blueprints. Runtime generation never invents syllables.
- Recognizable Warcraft character and dynasty names are removed through a committed denylist, and validation fails if one leaks into a generated pool.
- 25–35 named factions across umbrella allegiances, city/racial groups, cross-faction orders, trade organizations, criminal/pirate groups, and hostile groups.
- 80–120 civilian jobs across trade, service, civic, religious, arcane, wilderness, maritime, criminal, military-support, labor, travel, and elite-social categories.
- 120–160 personality traits with `facet`, `tone`, and direct-conflict metadata.
- At least 100 appearance cues and 100 voice/mannerism cues, tagged for reuse across many contexts.

Booty Bay support should be explicit: its appropriate merchant/pirate faction records should strongly weight Goblin without excluding other port populations, strongly weight trade and maritime jobs, and expose coastal appearance/mannerism tags.

### `data/npc-generator-engine.js`

Create a pure, browser-global, CommonJS-compatible engine with no React or DOM dependency. Inject the random-number function so simulations can use a seeded generator.

Recommended public functions:

```js
createNpc({ lockedValues, data, races, rng })
rerollNpcField({ npc, field, data, races, rng })
getWeightedCandidates({ field, context, data, races })
formatNpcForClipboard(npc, data, races)
validateNpcData({ data, races })
```

Keep the affinity calculation in one function. Do not store reciprocal relationship values in multiple places; one race/faction matrix must support drawing in either direction.

## Trait selection

Three random adjectives are not automatically a useful personality. Trait metadata should include:

- `facet`: social style, temperament, principle, work style, confidence, emotional expression, or quirk.
- `tone`: strength, neutral texture, or complication.
- `conflicts`: only direct opposites or near-duplicate meanings.
- optional context tags for jobs or factions, used lightly.

Selection should prefer three different facets and a mix of tones. It should usually include at least one strength and one complication, while still allowing combinations such as **Shady + Kindhearted** because that tension is playable rather than logically impossible. Avoid three synonyms, three pure flaws, or three traits that say essentially nothing beyond the NPC's race or job.

## Age tiers

Create explicit profiles rather than deriving numbers from lifespan strings:

- `shortLived`
- `humanLike`
- `longLived`
- `ancientLived`
- `ageless`

Each profile defines allowed tier IDs and weights. **Ancient** should be uncommon and unavailable for ordinary short-lived peoples, but available for long-lived or ageless beings. The copied result contains only the tier label, not an implied numerical range.

## Names

Use the expanded committed race name pools without calling an external service.

- Male and Female use their corresponding 180-name race pool.
- Non-binary and Unspecified draw from the combined pools until curated neutral pools exist.
- Where `groupNames` exists, independently decide whether to append one according to race metadata.
- Do not require a surname for races without a group-name pool.
- Avoid returning the exact same complete name as the immediately previous NPC when another candidate exists.
- Exclude the five most recent complete names when alternatives exist.
- Regenerate the committed pools with `npm run npc:names`; never generate or splice syllables in the live app.

### Name source and build recipe

The name corpus is intentionally a project-owned style library, not a scrape of named Warcraft characters. Its base information comes from the existing race records in `data/wow-character-options.js`: race identity, the small male/female seed lists already authored for this project, and any culture-appropriate group-name list. The build script retains every safe authored seed first, then fills each pool from an explicit phonetic blueprint assigned to that race or its closest naming culture.

The build-time recipe is:

1. Select the race's naming profile, such as Orc, Goblin, Night Elf, Naga, Murloc, Harpy, Draenei, Pandaren, or Vrykul.
2. Combine that profile's authored starts and gendered endings with overlap-aware joining. Some distinct peoples have dedicated rather than shared recipes; Naga and Murloc do not share a generic aquatic recipe, for example.
3. Reject names outside 4–13 normalized characters, names with four-consonant accidental clusters, repeated terminal chunks, duplicates, and every exact entry in the famous-name/dynasty denylist.
4. Keep all non-denied local seed names, deterministically choose enough generated candidates to reach 180 per gender, then commit the result to `data/npc-name-pools.js`.
5. At runtime, choose only from that committed pool. Optionally append a race's curated group name, such as a Goblin trade surname or Naga surname. No live syllable generation occurs, so a tested build remains reproducible.

Representative recipe outputs include:

| Culture | Shape | Example pool results |
| --- | --- | --- |
| Warrior-clan Orc | compact hard stem + blunt ending | Kragdar, Hargor, Korena, Zuria |
| Naga | sibilant aristocratic stem + flowing or sharp ending | Shezril, Velrash, Nalirasa, Selirasha |
| Murloc | deliberately wet, broken Nerglish clusters | Brglmurk, Glrggl, Krugmurk, Gurglura |
| Night Elf | long vowel-led Elven stem + lyrical ending | Ilarenna, Rynethiel, Zynora |
| Goblin | clipped industrial/comic stem + brisk ending | Bova, Grezrik, Kiznixie, Ziktixa |
| Harpy | windlike, sharp feminine cadence | Fylmi, Serena, Keraissa, Veyrayna |
| Quilboar | rough guttural stem + tusk-clan cadence | Mogak, Gluronok, Murzkush, Rogmusk |

The denylist includes famous first names and famous dynasty/family names such as Vol'jin, Sylvanas, Arthas, Jaina, Windrunner, Hellscream, and Proudmoore. Validation fails if a normalized denylisted name appears. This makes the generator Warcraft-flavored without making the table repeatedly meet disguised headline characters.

The committed result is 71 races × 180 male + 180 female names: 25,560 given-name entries before optional group-name combinations.

### Trait recipe examples

Traits are not chosen as three independent adjectives. The engine draws from 126 authored traits, each tagged with a personality facet and tone. It prefers distinct facets, normally mixes at least one strength with one complication, excludes already selected traits, and blocks only direct contradictions or near-duplicates.

- **Kindhearted + Meticulous + Short-tempered** gives a decent person who takes the work seriously but is immediately playable under pressure.
- **Shady + Patient + Principled** is allowed: the tension may describe methods, presentation, and a personal line they will not cross. The generator does not resolve that into backstory.
- **Blunt + Superstitious + Nosy** gives three different handles—social delivery, worldview, and boundary behavior—rather than three synonyms.
- **Patient + Short-tempered** is rejected as a direct conflict; **Kindhearted + Shady** is retained because it is useful tension rather than a logical impossibility.

Race and faction do not set personality. Job/context tags can provide only a light preference, so a shopkeeper is not automatically Shady and a hostile-faction NPC is not automatically cruel.

## Factions and race weighting

Map the existing coarse race allegiance to base Alliance/Horde/Unaffiliated affinity, then add explicit overrides for named organizations. Named faction metadata should include:

```js
{
  id,
  label,
  side,            // alliance, horde, neutral, hostile, independent
  baseWeight,
  tags,
  raceAffinities,
  jobAffinities,
  appearanceTags,
  mannerismTags
}
```

Do not equate faction with morality. Hostile and criminal factions affect affiliation, occupational likelihood, clothing, and mannerisms—not automatic personality traits.

## History and copy behavior

Use versioned local storage:

- `dm_npc_generator_draft_v1`
- `dm_npc_generator_locks_v1`
- `dm_npc_generator_history_v1`

Behavior:

- A full generation creates one new history entry and makes it the current draft.
- Edits and individual rerolls update that same entry rather than creating history spam.
- The next full generation creates the next entry.
- Keep the 20 most recent NPCs.
- History cards are collapsed by default and summarize `Name · Race · Job`.
- Expanded cards show every generated field plus Copy and Remove actions.
- A Clear History action requires a confirmation step.
- Invalid or old stored records are migrated when possible and otherwise skipped safely.

Clipboard format:

```text
Rikka Brasspin — Goblin, Mature
Faction: Blackwater Raiders
Job: Shopkeeper
Traits: Shrewd, Kindhearted, Short-tempered
Appearance: Salt-stiffened cuffs and a heavy brass key ring.
Mannerism: Taps two coins together while considering an answer.
```

Use the app's existing clipboard helper and show brief inline “Copied” feedback.

## UI component plan

Add these components near the other shared controls in `Index.html`:

- `NpcGeneratorPanel`
- `NpcField`
- `NpcTextField`
- `NpcSelectField`
- `NpcTraitFields`
- `NpcHistoryCard`
- lock, unlock, and copy SVG icons matching the existing icon system

Reuse `PageTopBar`, `CustomSelect`, `Dice`, `History`, and `copyTextToClipboard`. Extend `CustomSelect` with optional filtering only if a long Race, Faction, or Job list is awkward in live use; do not change existing callers' behavior.

Interaction requirements:

- Add `{ id: "npc", label: "NPC Generator" }` immediately before Loot Roller in `NAV_ITEMS`.
- Preserve view selection through the existing `dm_dashboard_view` mechanism.
- Lock state must be visible by icon and label/title, not color alone.
- Dice buttons need field-specific accessible names such as “Reroll faction.”
- History folds use native buttons with `aria-expanded` and a persistent focus indicator.
- All controls remain keyboard usable.
- The layout must work at narrow Electron/browser widths without horizontal page scrolling.
- Empty state should say what to do: lock any known context, then generate the rest.
- If every field is locked, disable full generation and explain that at least one field must be unlocked.

## Simulation and validation plan

Add `scripts/simulate-npc-generator.cjs` and an `npm run npc:simulate` command. Use a fixed seed for repeatable regression output and a configurable run count.

### Data validation

Fail the script when:

- IDs are duplicated or references are missing.
- A race has no usable name path.
- A race lacks an age profile.
- A field pool is empty.
- Affinities are negative or not finite.
- Trait conflicts reference missing traits.
- An appearance or mannerism tag is unknown.

### Distribution simulations

Run at least 50,000 NPCs for the no-lock baseline and 10,000 for each targeted scenario:

1. No locks.
2. Alliance locked.
3. Horde locked.
4. A Booty Bay merchant/pirate faction locked.
5. Shopkeeper job plus that Booty Bay faction locked.
6. Goblin race locked.
7. A rare neutral race locked.
8. Each gender path for every race.
9. Every faction individually locked.
10. Every job individually locked.

Report:

- race, faction, job, gender, and age distributions;
- top conditional pairings;
- candidates that were never reached;
- fallback counts;
- duplicate-name rate overall and by race;
- duplicate or conflicting trait count;
- invalid age count;
- maximum share held by any one candidate.

### Target properties

- Zero invalid names, ages, references, duplicate traits, or direct trait conflicts.
- Zero fallback-to-neutral events in curated scenarios.
- Common Warcraft peoples dominate unrestricted rolls without eliminating rare peoples.
- Strongly linked faction/race pairs are visibly common but not absolute.
- Locked Shopkeeper + Booty Bay context produces mostly plausible merchant-port populations and cues.
- Every manually selectable option remains generatable when it is the locked context.
- No single generic appearance or mannerism dominates because it matches too many tags.

Store expected broad ranges in the simulation script rather than exact percentages so intentional content tuning does not create brittle tests.

## Implementation sequence

### Phase 1 — Data foundation

1. Add browser loading for the existing Warcraft options.
2. Create the NPC data schema and author the age/race/faction/job metadata.
3. Author and tag trait, appearance, and mannerism pools.
4. Run validation before building UI.

### Phase 2 — Pure generation engine

1. Implement seeded weighted selection and affinity scoring.
2. Implement full generation, individual rerolls, trait selection, and fallbacks.
3. Implement clipboard formatting.
4. Add the simulation script and tune weights against the target scenarios.

### Phase 3 — Generator surface

1. Add the sidebar route above Loot Roller.
2. Build the panel hierarchy and responsive field layout.
3. Add selection, editing, dice, locks, and short feedback motion.
4. Connect draft state to the pure engine.

### Phase 4 — History and resilience

1. Add versioned local persistence.
2. Add folded history cards, copy, remove, and clear actions.
3. Harden corrupted-storage, empty-pool, and all-locked states.

### Phase 5 — Verification

1. Run the full simulation suite.
2. Test keyboard operation and reduced-motion behavior.
3. Inspect wide desktop, narrow desktop, and mobile-width layouts.
4. Confirm the web and Electron paths both load the new data scripts.
5. Run the Impeccable mechanical detector once over the changed UI target after implementation is complete.

## Acceptance criteria

- NPC Generator appears directly above Loot Roller and restores as the active view.
- The full generator works without an API key or network access.
- The large button fills every unlocked field and preserves every locked field.
- Every field can be rerolled individually without changing other fields.
- Results use Warcraft race names, named factions, Warcraft-appropriate jobs, and tiered ages.
- Unrestricted generation favors common/lore-plausible combinations while retaining rare outcomes.
- Three traits are varied, non-duplicative, and free of direct contradictions.
- Appearance and mannerism remain concise and observable rather than inventing story fuel.
- Recent history survives reload, stays capped at 20, folds cleanly, and copies readable plain text.
- Invalid local-storage or data records cannot crash the app.
- Simulation reports satisfy the target properties before the feature is considered complete.

## Explicit non-goals

- Gemini or other AI-generated text
- Numerical ages
- Stats, challenge ratings, abilities, combat classes, or stat blocks
- Secrets, quests, motivations, relationships, or complete backstories
- Portrait generation
- Campaign-wide NPC library, search, folders, or cross-device sync
- Automatic lore updates from the internet

Those can be reconsidered later, but they should not complicate this fast live-play tool.
