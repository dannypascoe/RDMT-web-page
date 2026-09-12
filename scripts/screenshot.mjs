import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'temporary-screenshots');

const [, , url, label, widthArg, heightArg] = process.argv;

if (!url) {
  console.error('Usage: node scripts/screenshot.mjs <url> [label] [width] [height]');
  process.exit(1);
}

const width = widthArg ? parseInt(widthArg, 10) : 1440;
const height = heightArg ? parseInt(heightArg, 10) : 900;

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// Auto-increment based on existing screenshot-N files, so nothing gets overwritten
const existing = fs.readdirSync(OUT_DIR)
  .map((f) => f.match(/^screenshot-(\d+)/))
  .filter(Boolean)
  .map((m) => parseInt(m[1], 10));
const next = existing.length ? Math.max(...existing) + 1 : 1;
const filename = label ? `screenshot-${next}-${label}.png` : `screenshot-${next}.png`;
const outPath = path.join(OUT_DIR, filename);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });
await page.goto(url, { waitUntil: 'networkidle' });
await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(`Saved: ${outPath}`);
