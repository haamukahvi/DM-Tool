# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Dungeon Masters and Game Masters use DM Tool during session preparation and live tabletop play. They need useful results quickly without slowing down the table.

## Product Purpose

DM Tool gathers common session tools in one low-friction web application that is also packaged as a Windows Electron app. It supports preparation, notes, audio, generators, rollers, and asset creation.

## Positioning

DM Tool is a personal, session-ready toolbox rather than a campaign-management suite. Its tools prioritize immediate use at the table. Warcraft-specific generators may use curated Azeroth data while the overall application remains a general DM/GM utility.

## Operating Context

- Used both before and during tabletop sessions.
- Runs directly in a browser or as a Windows Electron desktop application.
- Most tool state and preferences are stored locally.
- The NPC Generator is intended for situations such as needing a Warcraft NPC for a known role and faction on the spot.

## Capabilities and Constraints

- NPC generation is fully Warcraft-based.
- NPC generation uses curated, pre-authored local options and does not use Gemini or another generative service.
- The NPC Generator produces roleplay material, not mechanics or stat blocks.
- Users can select and lock known context such as faction and job, generate the remaining fields, reroll individual fields, and edit textual results.
- NPC age is expressed as a life-stage tier rather than a numerical age.
- Recent generated NPCs are retained locally as folded cards and can be copied in a compact text format.
- The app currently uses React and Tailwind through browser scripts in a largely single-file interface.

## Brand Commitments

- Product name: DM Tool.
- Use a flat charcoal background, neutral dark surfaces, readable system typography, and a muted teal accent for primary actions and selection. Buttons and labels are borderless; keyboard focus remains clearly outlined. Preserve functional colors such as loot rarity and error states.
- Functional color coding is essential: preserve category/tag hues, pink volume controls, cyan tuning controls, playback and lock states, and rarity/status colors. Simplifying visual decoration must not remove these cues or override control-specific colors with a global accent.
- New surfaces should feel like part of the existing sidebar and panel system.

## Evidence on Hand

- `README.md` describes the product goals, operating context, and supported platforms.
- `Index.html` contains the incumbent interface, navigation, reusable controls, and local-persistence patterns.
- `data/wow-character-options.js` contains 71 Warcraft races with race-specific name pools and coarse faction alignment, plus class and background data.
- No NPC-specific job, named-faction, personality, appearance, or mannerism catalog exists yet.

## Product Principles

- Stay fast enough for live play.
- Let the GM provide context and let the generator fill only the useful gaps.
- Prefer coherent weighted combinations over flat randomness.
- Preserve surprising possibilities without making implausible results commonplace.
- Keep generated material editable, reversible, and locally owned.
