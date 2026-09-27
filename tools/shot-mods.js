#!/usr/bin/env node
// One-off check of mods.html: it fetches data/modset.json, which a file://
// page is not allowed to do, so serve the repo over HTTP for the screenshot.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const types = { '.html': 'text/html; charset=utf-8', '.json': 'application/json', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  fs.readFile(p, (err, buf) => {
    if (err) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' });
    res.end(buf);
  });
});
server.listen(8123, '127.0.0.1', async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  page.on('pageerror', e => console.log('PAGE ERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') console.log('CONSOLE ERROR: ' + m.text()); });
  await page.goto('http://127.0.0.1:8123/mods.html');
  await page.waitForTimeout(1500);
  const info = await page.evaluate(() => ({
    groups: [...document.querySelectorAll('.group-title')].map(h => h.textContent.trim()),
    cards: document.querySelectorAll('.mod-card').length,
    nav: [...document.querySelectorAll('.kb-links a')].map(a => a.textContent).join(' | '),
    stamp: document.getElementById('stamp').textContent,
    first: document.querySelector('.mod-card') ? document.querySelector('.mod-card').innerText.replace(/\s+/g, ' ').slice(0, 160) : null,
  }));
  console.log(JSON.stringify(info, null, 2));
  await page.screenshot({ path: path.join(__dirname, 'output', 'mods.png') });
  await page.screenshot({ path: path.join(__dirname, 'output', 'mods-full.png'), fullPage: true });
  await browser.close();
  server.close();
});
