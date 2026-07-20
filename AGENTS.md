## VS Code Clickable File Links 

- Always output file references as Markdown links with an absolute filesystem path and optional line number using this format:
  - `[label](/<absolute-path>:line)`
- On Windows, use forward slashes and include the drive letter in the path, for example:
  - `[file.h](/c:/project/src/file.h:100)`
- Prefer this format for every file reference so links open directly in this VS Code chat environment.
- Do not use `vscode://` links for file references.

## Loot Item Design

- When discussing, designing, reviewing, or adding loot-table items, first consult `docs/loot-item-design.md`.
- Prefer concrete, usable Warcraft-flavored objects over vague symbolic items.
- For future loot-table expansions, favor armor/shields, profession tools, deployables/totems, travel/camp gear, social/intrigue items, and source packs tied to Azeroth factions, cultures, organizations, ancient peoples, regions, or monsters.
