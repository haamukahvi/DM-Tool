# Loot Item Design Notes

This document captures the preferred direction for expanding the DM Tool loot tables. Use it when ideating, reviewing, or adding items to `data/loot-tables.json`.

## Design Taste

- Prefer concrete, usable objects over abstract tokens or vague charms.
- Favor items that imply a scene: something carried by a faction, used in a camp, sold in a market, found in a ruin, worn by a guard, or deployed in a fight.
- Warcraft flavor should come from function and material, not only names. A goblin item should feel risky, noisy, commercial, or over-engineered; a Kirin Tor item should feel regulated, precise, arcane, and civic.
- Avoid overusing "charm", "idol", "trinket", "pendant", and "token" unless the object is truly that. Prefer masks, seals, writs, tools, permits, pouches, clasps, bracers, goggles, kits, stakes, lanterns, route markers, ledgers, keys, and field gear.
- Meaningful faction items should do something concrete: open access, mark authority, create a complication, guide travel, stabilize a relic, expose a lie, get someone past guards, or change how an NPC reacts.
- Good loot is not always combat power. Social access, travel safety, camp comfort, information, crafting leverage, and environmental advantage are valuable.

## Power Bands

Use the app's available rarities unless explicitly expanding the system:

- `uncommon`: small utility, one-use consumables, low-risk once-per-day effects, minor travel/camp/social advantages.
- `rare`: reliable tactical tools, strong utility, faction access with real leverage, reaction defenses, condition removal, limited teleport or flight.
- `very rare`: encounter-shaping tools, stronger environmental engines, major defensive gear, powerful faction relics, or high-impact limited-use effects.

Avoid making every item a permanent passive stat increase. Prefer charges, once-per-day use, location-limited strength, consumable use, or a tradeoff.

## Effect Families To Expand

These are especially good gaps for future loot:

- Once-per-day spell or emergency utility.
- Flying, hovering, gliding, or controlled falling.
- Water breathing, swimming, underwater stealth, and aquatic travel.
- Teleport, recall, escape movement, or object recall.
- Healing, recovery, rest support, and temporary hit points.
- Damage reduction, absorption, shielding, and reflection.
- Bonus action attacks or quick-draw effects.
- Critical-hit riders.
- Inflicting or cleansing conditions.
- Environmental bonuses, especially biome or location-sensitive powers.
- Cosmetic utility and flavorful cantrip items.

## Priority Categories

### Armor And Shields

The table is light on armor compared to weapons and wondrous items. Add more:

- Shields with ally protection, reaction defenses, or environmental identity.
- Helmets, masks, veils, boots, gloves, belts, bracers, pauldrons, robes, and cloaks.
- Defensive gear tied to factions or terrain.
- Armor that reduces forced movement, resists specific threats, or protects from smoke, plague, weather, undead, demons, or magic.

Good examples:

- Goblin Blast Apron.
- Ratchet Welder's Mask.
- Dwarven Lockplate Harness.
- Stormwind Guard Tower Shield.
- Orgrimmar Ironhide Pauldrons.
- Forsaken Plagueproof Coat.
- Cenarion Barkweave Vest.
- Naga Scale Mantle.
- Scarlet Confessor's Mail.
- Night Elf Mooncloth Veil.
- Dark Iron Heatshield.
- Zandalari Loa-hide Buckler.
- Tauren Ancestral Hideguard.
- Kirin Tor Wardcloak.
- Defias Leather Jerkin.

### Profession Tools

Profession gear is strongly Warcraft-flavored and underrepresented. It should be useful outside combat.

Good examples:

- Goblin Sapper's Kit.
- Gnomish Calibration Tools.
- Dwarven Forge Tongs.
- Enchanter's Silver Rod.
- Inscription Quill of Violet Ink.
- Alchemist's Field Burner.
- Cenarion Herbalist Pouch.
- Forsaken Distillation Rack.
- Shaman's Totem Carving Knife.
- Jewelcrafter's Lens.
- Leatherworker's Awl of Mending.
- Blacksmith's Rune Hammer.
- Cook's Everwarm Pan.
- Fisherman's Lucky Lure.
- Cartographer's Brass Divider.
- Archaeologist's Dust Brush.
- Locksmith's Tension Key.
- Smuggler's Hollow Needle.
- Auctioneer's Appraisal Slate.
- Miner's Resonance Pick.

### Deployables, Traps, And Totems

These add tactical choices without permanently raising character power. They are excellent loot from camps, workshops, shamans, military posts, criminals, ruins, and dungeons.

Good examples:

- Goblin Pop-Up Turret.
- Sapper Mine Plate.
- Smoke Canister Tripwire.
- Defias Caltrop Roll.
- Arcane Alarm Spike.
- Kirin Tor Ward Pylon.
- Argent Consecration Stake.
- Forsaken Plague Censer.
- Cenarion Root Snare.
- Hunter's Beast Lure.
- Dwarven Bulwark Plate.
- Gnomish Flash Beacon.
- Naga Tide Fetish.
- Zandalari Loa Banner.
- Tauren Earthbind Totem.
- Tauren Ancestral Ward Totem.
- Shaman Grounding Totem.
- Shaman Searing Totem.
- Shaman Cleansing Totem.
- Dark Iron Magma Pot.

### Travel And Camp Gear

These make exploration loot feel real and help the roller support more than combat rewards.

Good examples:

- Everwarm Bedroll.
- Cenarion Living Tent.
- Goblin Inflatable Raft.
- Tuskarr Ice Sled Harness.
- Dwarven Stonebite Pitons.
- Sandwalker Waterwrap.
- Stormproof Camp Lantern.
- Argent Wayfarer's Candle.
- Forsaken Mosquito Net.
- Night Elf Silent Trail Boots.
- Horde Warcamp Stove.
- Alliance Field Cot.
- Mage's Folded Shelter.
- Goblin Camp Alarm Bell.
- Traveler's Self-Inking Map.
- Campfire Ember Box.
- Pack Kodo Saddle Bags.
- Gryphon Rider's Weather Goggles.
- Naga Oilskin Pack.
- Innkeeper's Road Kettle.

### Social And Intrigue Items

This category should be varied: credentials, invitations, bribes, blackmail, permits, codes, safehouse keys, faction markers, legal claims, and dangerous evidence.

Good examples:

- Forged Stormwind Travel Papers.
- Orgrimmar Warband Token.
- Defias Recognition Coin.
- Ravenholdt Contract Needle.
- Black Market Auction Paddle.
- Goblin Debt Ledger.
- Noble House Signet Ring.
- Scarlet Crusade Confession Seal.
- Argent Letter of Passage.
- Kirin Tor Library Permit.
- Dalaran Portal Ticket Stub.
- SI:7 Cipher Strip.
- Horde Scout's Bone Whistle.
- Blood Elf Court Perfume.
- Forsaken Apothecary License.
- Zandalari Loa Offering Token.
- Tauren Clan Bead Strand.
- Earthen Ring Totem Warrant.
- Cenarion Grove Invitation Leaf.
- Steamwheedle Trade Stamp.
- Pirate Parley Coin.
- Naga Royal Scale Token.
- Dark Iron Forge Writ.
- Night Elf Moonwell Access Cord.
- Gnomeregan Patent Scroll.
- Mechagnome Identity Cog.
- Auction House Reserve Tag.
- Smuggler's False-Bottom Case.
- Blackmail Packet.
- Sealed Duel Challenge.
- Diplomatic Dinner Invitation.
- Anonymous Bounty Slip.
- Coded Tavern Coaster.
- Whisper Ink Letter.
- Memory-Wax Seal.
- Truthmark Ribbon.
- Counterfeit Noble Brooch.
- Servant's Master Key.
- Guard Rotation Slate.
- Bribe Purse With Hidden Compartment.
- Tavern Rumor Deck.
- Guild Favor Token.
- Prisoner Transfer Order.
- Merchant Consortium Badge.
- Funeral Mourner's Pin.
- Masquerade Mask of Proper Etiquette.
- Spyglass With Etched Meeting Coordinates.
- Ledger Page Naming a Buyer.
- Dead Drop Chalk.
- False Holy Relic.

## Broader Azeroth Themes

Do not over-focus on goblin, gnome, naga, tauren, Defias, and Forsaken themes. They are useful, but Azeroth has many strong item sources.

### Organizations

- Kirin Tor: permits, sigils, portal tools, library keys, spell calibration gear.
- Argent Crusade / Silver Hand: reliquaries, field chapels, undead wards, oath-bound arms.
- Cenarion Circle: seeds, living tents, grove maps, ritual pruning tools, dream herbs.
- Earthen Ring: totems, storm bowls, grounding rods, elemental pacts.
- Explorer's League: survey kits, fossil brushes, rune rubbings, relic cases.
- Reliquary: blood elf archaeology gear, arcane lockbreakers, relic claim tags.
- SI:7: cipher strips, quiet boots, identity papers, poison rings, dead-drop kits.
- Ravenholdt: contract needles, marked coins, assassin ledgers, safehouse keys.
- Steamwheedle Cartel: trade stamps, debt ledgers, explosive licenses, auction paddles.
- Bilgewater Cartel: unstable tech, fake permits, hazard gear, profit-sharing bombs.
- Darkmoon Faire: tickets, rigged prize tokens, cursed games, weird trinkets.
- Scarlet Crusade: confession seals, false purity badges, zealot banners, dangerous holy relics.
- Ebon Blade: runeblade fragments, deathcharger tack, bone writs, anti-undead tools.
- Wardens: prison keys, moonlit shackles, pursuit lanterns, anti-demon restraints.

### Ancient And Lost Peoples

- Titan-forged: rune plates, keeper keys, reorigination shards, vault lenses.
- Highborne: cracked mana jewelry, palace keys, fading illusions, noble arcana.
- Nerubian: chitin tools, web grenades, underground maps, silence silk.
- Tol'vir: sunstone tablets, desert wards, obsidian masks, tomb keys.
- Mogu: spirit-binding tablets, stoneflesh armor, imperial seals, anima jars.
- Vrykul: runed drinking horns, ancestor blades, storm burial goods.
- Drust: wicker fetishes, bone tools, thorn masks, death-forest gear.
- Aqir / Qiraji: chitin blades, resin seals, whispering idols, scarab mechanisms.
- Mantid: amber weapons, pheromone jars, swarm-control tools.
- Arakkoa: sun lenses, cursed feathers, sky maps, talon rings.
- Pandaren / Shado-Pan: tea kits, discipline bells, smoke beads, traveling shrines.

### Regional And Cultural Themes

- Tuskarr: sled harnesses, fishing tools, whale-bone gear, warm camp equipment.
- Tortollan: scroll shells, story maps, waterproof archives, slow-but-safe travel gear.
- Jinyu / Waterspeakers: river stones, water bowls, tide readings, jade blades.
- Hozen: chaotic thrown tools, stolen packs, jungle prank traps.
- Vulpera: desert packs, portable shade, trade trinkets, clever survival gear.
- Sethrak: lightning coils, serpent masks, sun-baked relics.
- Kul Tiran: sailor gear, storm coats, ship tools, monster-hunting harpoons.
- Drustvar witches: hex bundles, creepy household items, cursed sewing kits.
- Zandalari: loa offerings, golden ritual masks, dinosaur tack, royal writs.
- Blood Trolls: blood jars, bone hooks, swamp fetishes.
- Nightborne: arcwine decanters, illusion fans, mana-silk clothing.
- Void Elves: voidglass lenses, spatial folding tools, risky shadow trinkets.
- Mechagnomes: replaceable modules, diagnostic cogs, compact gadgets.
- Dark Iron: forge brands, mole machine tokens, heatproof gear.
- Wildhammer: gryphon gear, storm hammers, feather standards.
- Bronzebeard: archaeology gear, mountain kits, explorer tools.
- Worgen / Gilneas: silvered hunting gear, noble mourning items, rain-soaked city tools.

### Enemy And Monster Themes

- Burning Legion: fel cores, demon shackles, infernal slag, warlock reagents.
- Scourge: plague jars, bone keys, frost runes, necrotic lanterns.
- Old Gods / Twilight's Hammer: voidglass, madness masks, ritual stones, coded sermons.
- Naga: tide pearls, coral blades, pressure masks, sea witch tools.
- Murlocs: shell horns, net traps, pearl hoards, ridiculous but useful water junk.
- Kobolds: candle helmets, tunnel maps, wax idols, trap candles.
- Gnolls: scavenged armor, bone saws, hyena-hide packs.
- Quillboar: thorn shields, bramble fetishes, bloodstone shards.
- Harpies: feather cloaks, shriek whistles, cliff-nest loot.
- Satyrs: corrupted flutes, nightmare perfumes, felwood masks.
- Centaur: war standards, horsehair ropes, steppe bows, clan brands.
- Ogres: crude clubs, cooking cauldrons, oversized lock keys.
- Dragonflights: scale cloaks, oath rings, hoard tags, flight-specific relics.
- Elementals: firestones, storm jars, frost prisms, earth cores.

## Better Concrete Faction Items

These are the right direction for "meaningful" faction gear: specific object, clear use, and story leverage.

- Kirin Tor Violet Seal: grants access to mage-controlled spaces; once per day casts `detect magic` or unlocks a minor arcane ward.
- Goblin Liability Waiver: lets the bearer enter goblin labs, auctions, or dangerous demonstrations; may reduce one repair or service fee after a mishap.
- Explorer's League Claim Tag: legally claims one relic from a dig site; can identify age or origin of stonework once per day.
- SI:7 Burn Notice: supports one false identity through a guard inspection, then becomes dangerous evidence.
- Ravenholdt Safehouse Key: opens one hidden safehouse door in a major city, or marks the bearer as known to assassins.
- Steamwheedle Debt Ledger Page: can be traded for a favor, discount, or blackmail.
- Darkmoon Prize Ticket: redeemable for a random minor magic item, but the Faire decides what "minor" means.
- Scarlet Confession Seal: forces a captured zealot or common criminal to answer one question, but makes Scarlet enemies hostile if seen.
- Ebon Blade Bone Writ: grants safe passage through one undead-held checkpoint unless the commander questions the bearer's authority.
- Cenarion Grove Map: reveals hidden paths, moonwells, safe camps, and corrupted groves in one region.
- Earthen Ring Storm Bowl: predicts weather and elemental disturbances; stronger near coasts and mountains.
- Reliquary Relic Clamp: opens or stabilizes one unstable ancient relic without triggering its first trap.
- Warden Moonlit Shackle: restrains demons or shapeshifters better than normal manacles.
- Tuskarr Whale-Bone Route Marker: placed at camp, helps the party avoid getting lost in snow, fog, or sea ice.
- Tortollan Story Shell: stores one spoken eyewitness account and repeats it later exactly.
- Nightborne Arcwine Passport: grants entry to elite social spaces, but marks the holder as politically interesting.

## Next Expansion Packs

When adding more concrete loot, prefer source packs over isolated one-offs. Each pack can include armor/shield, profession tool, deployable, travel/camp item, social item, and one strange treasure.

High-value packs:

- Explorer's League pack.
- Darkmoon Faire pack.
- Tuskarr travel pack.
- Nerubian underground pack.
- Scarlet dangerous holy pack.
- Kirin Tor civic arcana pack.
- Steamwheedle / Bilgewater commerce pack.
- Cenarion wilderness pack.
- Earthen Ring shamanic totem pack.
- Drustvar witchcraft pack.
