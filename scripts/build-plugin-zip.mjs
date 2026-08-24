import { createWriteStream } from 'node:fs';
import { cp, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ZipArchive } from 'archiver';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const archivePath = join(projectRoot, 'phanteks-ex6-page.zip');
const stagingRoot = await mkdtemp(join(tmpdir(), 'phanteks-ex6-release-'));
const pluginRoot = join(stagingRoot, 'phanteks-ex6-page');
const releaseEntries = ['phanteks-ex6-page.php', 'README.md', 'templates', 'assets'];

const excludeSystemFiles = (source) => !source.endsWith('.DS_Store') && !source.endsWith('Thumbs.db');

try {
  await mkdir(pluginRoot, { recursive: true });

  for (const entry of releaseEntries) {
    await cp(join(projectRoot, entry), join(pluginRoot, entry), {
      recursive: true,
      filter: excludeSystemFiles,
    });
  }

  await rm(archivePath, { force: true });

  await new Promise((resolve, reject) => {
    const output = createWriteStream(archivePath);
    const zip = new ZipArchive({ zlib: { level: 9 } });

    output.on('close', resolve);
    output.on('error', reject);
    zip.on('error', reject);
    zip.pipe(output);
    zip.directory(pluginRoot, 'phanteks-ex6-page');
    void zip.finalize();
  });

  console.log(`Created ${archivePath}`);
} finally {
  await rm(stagingRoot, { recursive: true, force: true });
}
