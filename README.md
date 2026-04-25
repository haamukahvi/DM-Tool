# DM Tool

DM Tool is a web app and Windows Electron desktop app for Dungeon Masters and Game Masters.

The goal of the project is to be a general-purpose helper for running Dungeons & Dragons and other tabletop roleplaying games. It is meant to collect useful session tools in one place, with a focus on ease of access and low-friction use.

DM Tool is designed for both prep and live play. During session preparation, it can help organize notes, roll or generate content, prepare ambience, and create useful game assets. During the game, it is meant to stay quick, readable, and hassle-free so the DM can use it without slowing down the table.

The app can be used directly as a web app from the HTML files, or packaged as an Electron app for Windows.

## Project Goals

- Provide a universal DM / GM helper tool.
- Keep common session tools easy to reach.
- Support both game preparation and live session use.
- Prioritize simple, fast, hassle-free workflows.
- Work as both a browser-based app and a Windows desktop app.

## Running

Start the Windows Electron app:

```bash
npm start
```

Run the web version locally:

```bash
npm run web:dev
```

Build a portable Windows app:

```bash
npm run dist:portable
```

## Audio Files

Ambience files are loaded from `dnd music/Ambience/`. Music files are loaded from `dnd music/`, excluding `Ambience/` and `_New/`. Sound effects are loaded from `sfx/`.

The app uses generated audio manifests at `data/audio-manifest.js` and `data/audio-manifest.json`. The JavaScript file is loaded by DM Tool. The JSON file is for other tools, such as an Obsidian campaign planning app, to read track names, tags, folders, and file paths.

You can also regenerate it manually:

```bash
npm run audio:manifest
```

## Obsidian Music Links

The Electron app registers the `dmtool://` URL scheme. Other apps can link to a music file with:

```md
[Play music](dmtool://music/play?file=dnd%20music%2FBattle_Boss_Tribal.mp3)
```

If DM Tool is open, the link switches to the music tab and starts that track. If DM Tool is closed, Windows can launch it through the registered protocol and the track plays after startup.

Use the `file` value from `data/audio-manifest.json`. The app also accepts decoded paths such as `dnd music/Battle_Boss_Tribal.mp3`, but URL-encoding the value is safer in Markdown links.

## Backlog

- Explore optional bulk music analysis for suggested tags/moods. Keep filename tags as the source of truth for now, but later a script could use local audio analysis tools such as Essentia or musicnn to suggest tags into a reviewable sidecar file.
