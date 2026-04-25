## VS Code Clickable File Links 

- Always output file references as Markdown links with an absolute filesystem path and optional line number using this format:
  - `[label](/<absolute-path>:line)`
- On Windows, use forward slashes and include the drive letter in the path, for example:
  - `[file.h](/c:/project/src/file.h:100)`
- Prefer this format for every file reference so links open directly in this VS Code chat environment.
- Do not use `vscode://` links for file references.
