# Contributing

## Ownership boundaries

| Feature | Template | JavaScript | CSS |
| --- | --- | --- | --- |
| NexLinq | `templates/sections/nexlinq.php` | `assets/js/nexlinq.js` | `assets/css/nexlinq.css` |
| Telemetry simulator | `templates/sections/telemetry-simulator.php` | `assets/js/telemetry-simulator.js` | `assets/css/telemetry-simulator.css` |

The plugin bootstrap, Vite preview, package manifests, and root documentation are shared integration files. Announce changes to these files before editing them.

Use the feature-specific local URLs while developing: `/?feature=nexlinq` or `/?feature=telemetry`. Check `/?feature=all` before requesting review.

## Git workflow

1. Keep `main` deployable and create one short-lived branch per change:
   - `feature/nexlinq-video-playback`
   - `feature/telemetry-live-data`
   - `fix/nexlinq-upload`
2. Sync before starting and before opening a pull request:

   ```bash
   git switch main
   git pull --ff-only
   git switch -c feature/<area>-<change>
   ```

3. Commit only one feature area at a time. Do not include generated `dist/`, `node_modules/`, `.DS_Store`, or plugin ZIP files.
4. Run `npm run check` before pushing.
5. Open a pull request into `main`. The developer who does not own the changed feature reviews it, with extra attention to shared integration files.
6. Prefer squash merging so each pull request becomes one clear commit on `main`.
7. After another pull request merges, rebase your branch before merging:

   ```bash
   git fetch origin
   git rebase origin/main
   ```

## Integration contract

- Both features initialize themselves and must safely exit when their root element is absent.
- Telemetry selectors must remain scoped below `[data-telemetry-simulator]` once that root is introduced.
- NexLinq selectors must remain scoped below `[data-ex6-page]` or a narrower NexLinq root.
- Do not query or mutate another feature's internal markup.
- New feature assets must be added to both the WordPress enqueue function and `index.html`.
- Bump `PHANTEKS_EX6_VERSION` only in an integration pull request or immediately before creating a release ZIP.

## Release ZIP

From the plugin root:

```bash
zip -r phanteks-ex6-page.zip phanteks-ex6-page.php templates assets README.md CONTRIBUTING.md -x "*.DS_Store"
```
