# Phanteks EX6 Max Ultra WordPress page starter

This plugin adds the shortcode `[ex6_max_ultra]`. Place it in a normal WordPress page to preserve the active theme's global header, footer, navigation, cookie banner, and tracking.

## Local preview

The Vite preview renders the WordPress template directly, so template changes appear without copying markup into a separate demo page.

```bash
npm install
npm run dev
```

Local tooling requires Node.js 20 or newer. The same npm commands work in macOS Terminal, Windows PowerShell,
Windows Terminal, and Git Bash. Windows developers can install Node.js from `nodejs.org` or use nvm-windows;
macOS developers can use the Node.js installer, Homebrew, or nvm.

Open the local URL printed by Vite. To verify the production preview:

- NexLinq workspace: `http://localhost:5173/?feature=nexlinq`
- Telemetry workspace: `http://localhost:5173/?feature=telemetry`
- Combined integration view: `http://localhost:5173/?feature=all`

To verify the production preview:

```bash
npm run build
npm run preview
```

Run the same validation expected before opening a pull request:

```bash
npm run check
```

Run the browser smoke test after installing Playwright's Chromium browser once:

```bash
npx playwright install chromium
npm run test:smoke
```

Playwright may request additional browser dependencies on first use. On both macOS and Windows, accept the
Chromium installation and rerun `npm run test:smoke`.

## Feature ownership

The project is divided so NexLinq and telemetry can be developed with minimal merge conflicts:

- **NexLinq:** `templates/sections/nexlinq.php`, `assets/js/nexlinq.js`, and `assets/css/nexlinq.css`.
- **Telemetry simulator:** `templates/sections/telemetry-simulator.php`, `assets/js/telemetry-simulator.js`, and `assets/css/telemetry-simulator.css`.
- **Shared integration:** `templates/ex6-max-ultra.php`, `phanteks-ex6-page.php`, `index.html`, `vite.config.js`, and package files. Coordinate before changing these files.

See `CONTRIBUTING.md` for the branch, commit, and pull-request workflow.

## Installation

Create a tested, upload-ready ZIP from the repository root:

```bash
npm run release:zip
```

ZIP creation is implemented in Node.js and works identically from PowerShell, Command Prompt, Git Bash, and macOS
Terminal. It does not require the system `zip` command.

Pull requests run the project checks on Windows, macOS, and Linux. The PHP and browser smoke tests run on Linux.

1. Upload `phanteks-ex6-page.zip` in **WordPress Admin → Plugins → Add New Plugin → Upload Plugin**.
2. Activate **Phanteks EX6 Max Ultra Page**.
3. Create a standard WordPress page named `EX6 Max Ultra`.
4. Set the page template to the theme's normal full-width template—not Canvas or Blank.
5. Add a Shortcode block containing `[ex6_max_ultra]`.
6. Publish or preview the page.

## Before production

- Test against the active theme on staging, particularly content-width and page-title wrappers.
- If the theme wraps page content in a narrow container, apply its full-width page template or add a theme-specific full-bleed rule.
