# Contributing

## Ownership boundaries

| Feature             | Template                                     | JavaScript                         | CSS                                  |
| ------------------- | -------------------------------------------- | ---------------------------------- | ------------------------------------ |
| NexLinq             | `templates/sections/nexlinq.php`             | `assets/js/nexlinq.js`             | `assets/css/nexlinq.css`             |
| Telemetry simulator | `templates/sections/telemetry-simulator.php` | `assets/js/telemetry-simulator.js` | `assets/css/telemetry-simulator.css` |

The plugin bootstrap, Vite preview, package manifests, and root documentation are shared integration files. Announce changes to these files before editing them.

Use the feature-specific local URLs while developing: `/?feature=nexlinq` or `/?feature=telemetry`. Check `/?feature=all` before requesting review.

## Riley's GitHub instructions

Riley currently works only on the telemetry simulator. Dennis owns `main`, reviews every pull request, and is the only person who merges changes into `main`.

### First-time setup

```bash
git clone https://github.com/ZhYinHai/EX6-Max.git
cd EX6-Max
git switch feature/telemetry
npm ci
npx playwright install chromium
```

If `feature/telemetry` does not exist yet, create and publish it:

```bash
git switch -c feature/telemetry
git push -u origin feature/telemetry
```

### Start each work session

```bash
git switch feature/telemetry
git fetch origin
git merge origin/main
```

### Files Riley may edit

```text
templates/sections/telemetry-simulator.php
assets/js/telemetry-simulator.js
assets/css/telemetry-simulator.css
```

Do not edit NexLinq or shared integration files without consultation.

### Check, commit, and push work

```bash
npm run check
git status
git diff

git add templates/sections/telemetry-simulator.php assets/js/telemetry-simulator.js assets/css/telemetry-simulator.css

git commit -m "feat(telemetry): describe the change"
git push
```

Then open GitHub and create a pull request with:

```text
base: main
compare: feature/telemetry
```

Send the pull-request link to Dennis. Dennis reviews and merges it with `main`.

### If Riley accidentally works on `main`

Do not push. Preserve the work on a new branch immediately:

```bash
git switch -c recovery/telemetry-work
git push -u origin recovery/telemetry-work
```

### Commands Riley should not use

```text
git push origin main
git push --force
git reset --hard
git branch -D
```

## Git workflow

All commands in this guide are single-line, cross-platform commands. They work in macOS Terminal, Windows
PowerShell, Windows Terminal, and Git Bash. Node.js 20 or newer is required.

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
4. Run `npm run check` and `npm run test:smoke` before pushing.
5. Open a pull request into `main`. Dennis reviews and merges every pull request, with extra attention to shared integration files.
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

After approved changes are merged into `main`, run this from the plugin root on macOS or Windows:

```bash
npm ci
npm run release:zip
```

The command validates the project and creates `phanteks-ex6-page.zip`. Do not manually assemble the archive.
