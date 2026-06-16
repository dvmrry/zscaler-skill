#!/usr/bin/env node
// capture.cjs — render automate.zscaler.com API-reference op pages headlessly and
// dump raw <article> text + first-class provenance. Capture only: no parsing, no
// LLM, no network beyond the page render. The deterministic parse + reconcile
// steps run downstream on the raw text (see parse_contract.py), so the browser
// never touches the auditable core.
//
// This is a MANUAL maintenance tool, not a CI fast check. Playwright is declared
// (and pinned) in this directory's package.json, isolated from the repo root —
// the repo has no root package.json and the stdlib-only Node fast checks never
// install or import this. Run it explicitly:
//
//   cd scripts/automate-capture
//   npm install                       # installs the pinned Playwright
//   npx playwright install chromium   # fetches the matching browser build
//   node capture.cjs <url-list> <out-dir>
//
// Escape hatch for a pre-existing browser (e.g. a shared cache): set
// PLAYWRIGHT_EXECUTABLE=/path/to/chrome-headless-shell. Optional CAPTURE_DELAY_MS
// (default 250) throttles between pages.
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch (e) {
  process.stderr.write(
    'Playwright not found. This is a manual capture tool with an isolated,\n' +
    'pinned dependency — install it before running:\n\n' +
    '  cd scripts/automate-capture\n' +
    '  npm install\n' +
    '  npx playwright install chromium\n\n' +
    'Then re-run:  node capture.cjs <url-list> <out-dir>\n');
  process.exit(2);
}

const urlList = process.argv[2];
const outDir = process.argv[3];
if (!urlList || !outDir) {
  process.stderr.write('usage: node capture.cjs <url-list-file> <out-dir>\n');
  process.exit(2);
}
const delayMs = parseInt(process.env.CAPTURE_DELAY_MS || '250', 10);

// .../api-reference/<product>/<group>/<operation>  ->  product/group/operation
function relPathFor(url) {
  const after = url.replace(/\/$/, '').split('/api-reference/')[1];
  if (!after) throw new Error(`URL has no /api-reference/ segment: ${url}`);
  return after.split('/').map((s) => s.replace(/[^a-zA-Z0-9_.-]/g, '-')).join('/');
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const urls = fs.readFileSync(urlList, 'utf8').split('\n')
    .map((s) => s.trim()).filter((s) => s && !s.startsWith('#'));
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.PLAYWRIGHT_EXECUTABLE || undefined,
  });
  const provenance = [];
  try {
    const page = await browser.newPage();
    for (const url of urls) {
      const rel = relPathFor(url);
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        // The per-op schema is JS-injected after load — wait for it to render
        // into <article> before reading.
        await page.waitForFunction(() => {
          const t = document.querySelector('article')?.innerText || '';
          return /BODY|PATH PARAMETERS|Possible values|api\.zsapi\.net/.test(t) || t.length > 2000;
        }, { timeout: 30000 }).catch(() => {});
        const text = await page.evaluate(
          () => document.querySelector('article')?.innerText || document.body.innerText);
        const sha = crypto.createHash('sha256').update(text).digest('hex');
        const method = (text.match(/\b(GET|POST|PUT|DELETE|PATCH)\b/) || [])[0] || null;
        const apiPath = (text.match(/https:\/\/api\.zsapi\.net\/\S+/) || [])[0] || null;
        const rawFile = rel + '.txt';
        const dest = path.join(outDir, rawFile);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, text);
        provenance.push({
          operation: rel, source_url: url, raw_file: rawFile,
          sha256: sha, length: text.length, method, path: apiPath,
          captured_at: new Date().toISOString(),
        });
        process.stdout.write(`OK  ${(method || '?').padEnd(6)} len=${String(text.length).padStart(5)}  ${rel}\n`);
      } catch (e) {
        provenance.push({ operation: rel, source_url: url, error: e.message,
          captured_at: new Date().toISOString() });
        process.stdout.write(`ERR ${rel}: ${e.message}\n`);
      }
      if (delayMs > 0) await sleep(delayMs);
    }
  } finally {
    await browser.close();
  }
  provenance.sort((a, b) => a.operation.localeCompare(b.operation));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'provenance.json'), JSON.stringify(provenance, null, 2) + '\n');
  const ok = provenance.filter((r) => !r.error).length;
  process.stdout.write(`\nCaptured ${ok}/${provenance.length} -> ${outDir}\n`);
  if (ok < provenance.length) process.exit(1);
})().catch((e) => { process.stderr.write(`FATAL ${e.message}\n`); process.exit(1); });
