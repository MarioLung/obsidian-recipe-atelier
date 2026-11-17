# Contributing to Recipe Atelier

Thanks for your interest! Bug reports, ideas and pull requests are welcome.

## Reporting a bug or requesting a feature

Open an [issue](https://github.com/MarioLung/obsidian-recipe-atelier/issues) and include:

- Obsidian version and platform (Windows, macOS, Linux, iOS, iPadOS, Android)
- Plugin version (Settings → Community plugins → Recipe Atelier)
- What you did, what you expected, what happened (screenshots help)
- If possible, a minimal recipe note that shows the problem (you can remove private data)

Please do not post private data from your vault.

## Project layout

The plugin is plain JavaScript without a build step:

| File | Purpose |
|---|---|
| `main.js` | The whole plugin (calculation logic, views, modals, settings) |
| `styles.css` | Styles (uses Obsidian CSS variables, no `!important`) |
| `manifest.json` | Plugin id, name, version, minimum Obsidian version |
| `versions.json` | Plugin version → minimum Obsidian version |
| `.github/workflows/release.yml` | Creates the GitHub release with build attestations when a tag is pushed |

## Running it locally

1. Clone the repository.
2. Copy `main.js`, `manifest.json` and `styles.css` into
   `<your test vault>/.obsidian/plugins/recipe-atelier/`.
3. Enable the plugin in Obsidian and reload it after each change
   (command palette → “Reload app without saving”).

Test with a throw-away vault, not with your real recipes.

## Guidelines

- Follow the [Obsidian plugin guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines): no `innerHTML`, no network requests, no inline styles (use CSS classes), only the Obsidian API (the plugin must work on mobile).
- Keep the **data format stable**: recipes are notes with the properties `rm-type`, `category`, `tags` and a fenced ` ```recipe-manager ` block containing JSON. Existing vaults must keep working; new fields need defaults.
- Calculations (percent / amount mode, scaling, alternatives, linked parts) should be checked against a few real recipes before and after a change.
- Keep the interface working in **English and German** (see below).
- Keep changes focused: one topic per pull request.

## Translations

German texts are the translation keys. They are wrapped in `tx("…")` in `main.js`. English texts live in the `EN` object at the top of the file. A new user-visible text needs:

1. the German text in the code as `tx("Deutscher Text")`
2. the English translation in the `EN` object

Texts without an entry in `EN` are shown as written (German).

## Pull requests

1. Fork the repository and create a branch.
2. Make your change and test it on desktop and, if it touches the layout, on a phone-sized window.
3. Describe what changed and why. Add a line to `CHANGELOG.md`.
4. Open the pull request against `main`.

## Releases (maintainer)

1. Increase `version` in `manifest.json` and add the version to `versions.json`.
2. Update `CHANGELOG.md`, commit and push to `main`.
3. Create a tag that exactly matches the version (for example `1.0.3`) and push it:
   `git tag 1.0.3 && git push origin 1.0.3`.
4. The workflow checks that tag and manifest version match, attests `main.js`, `manifest.json` and `styles.css`, and publishes the release.

## License

By contributing you agree that your contribution is licensed under the [MIT License](LICENSE).
