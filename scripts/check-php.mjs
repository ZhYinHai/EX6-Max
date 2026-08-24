import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const ignoredDirectories = new Set(['.git', 'dist', 'node_modules', 'playwright-report', 'test-results']);

async function findPhpFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory() && !ignoredDirectories.has(entry.name)) {
      files.push(...(await findPhpFiles(join(directory, entry.name))));
    } else if (entry.isFile() && extname(entry.name).toLowerCase() === '.php') {
      files.push(join(directory, entry.name));
    }
  }

  return files;
}

const phpVersion = spawnSync('php', ['--version'], { encoding: 'utf8' });
if (phpVersion.error?.code === 'ENOENT') {
  console.error('PHP is required to validate and package this WordPress plugin, but `php` was not found on PATH.');
  process.exit(1);
}
if (phpVersion.status !== 0) {
  process.stderr.write(phpVersion.stderr || 'Unable to run PHP.\n');
  process.exit(phpVersion.status ?? 1);
}

const phpFiles = (await findPhpFiles(projectRoot)).sort();
let failed = false;

for (const file of phpFiles) {
  const result = spawnSync('php', ['-l', file], { encoding: 'utf8' });
  const displayPath = relative(projectRoot, file);

  if (result.status === 0) {
    console.log(`PHP syntax OK: ${displayPath}`);
  } else {
    failed = true;
    console.error(`PHP syntax failed: ${displayPath}`);
    process.stderr.write(result.stderr || result.stdout || 'Unknown PHP syntax error.\n');
  }
}

if (failed) process.exit(1);
console.log(`Validated ${phpFiles.length} PHP file${phpFiles.length === 1 ? '' : 's'}.`);
