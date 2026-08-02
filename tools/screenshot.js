#!/usr/bin/env node
// Local dev tool: screenshot a page in this repo for visual verification.
// Usage:
//   node .claude/tools/screenshot.js <page.html> <output.png> [options]
// Options:
//   --viewport=W,H     default 1400,900
//   --full-page        capture the full scrollable page, not just the viewport
//   --hover=<selector> hover this element before capturing (e.g. tooltip checks)
//   --focus=<selector> keyboard-focus this element before capturing (a11y checks)
//   --click=<selector> click an element before capturing; repeatable, clicks run
//                      in order (e.g. --click="#foo" --click="#bar" to test
//                      interactive filter/toggle state without a new script)
//   --print=<selector> print this element's textContent to stdout (repeatable)
//                      — for verifying exact state/counts, not just pixels
//   --wait=<ms>        extra wait after load before capturing (default 200)
//
// Output is written to .claude/tools/output/<name>.png (gitignored) unless
// an absolute path is given.

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

function parseArgs(argv) {
    const args = { viewport: '1400,900', fullPage: false, wait: 200, hover: null, focus: null, clicks: [], prints: [] };
    const positional = [];
    for (const a of argv) {
        if (a.startsWith('--viewport=')) args.viewport = a.slice('--viewport='.length);
        else if (a === '--full-page') args.fullPage = true;
        else if (a.startsWith('--wait=')) args.wait = parseInt(a.slice('--wait='.length), 10);
        else if (a.startsWith('--hover=')) args.hover = a.slice('--hover='.length);
        else if (a.startsWith('--focus=')) args.focus = a.slice('--focus='.length);
        else if (a.startsWith('--click=')) args.clicks.push(a.slice('--click='.length));
        else if (a.startsWith('--print=')) args.prints.push(a.slice('--print='.length));
        else positional.push(a);
    }
    args.page = positional[0];
    args.output = positional[1];
    return args;
}

(async () => {
    const args = parseArgs(process.argv.slice(2));
    if (!args.page || !args.output) {
        console.error('Usage: node screenshot.js <page.html> <output.png> [--viewport=W,H] [--full-page] [--hover=selector] [--focus=selector] [--wait=ms]');
        process.exit(1);
    }

    const repoRoot = path.resolve(__dirname, '..');
    const pagePath = path.isAbsolute(args.page) ? args.page : path.join(repoRoot, args.page);
    const outDir = path.join(__dirname, 'output');
    fs.mkdirSync(outDir, { recursive: true });
    const outputPath = path.isAbsolute(args.output) ? args.output : path.join(outDir, args.output);

    const [width, height] = args.viewport.split(',').map(Number);
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto('file:///' + pagePath.replace(/\\/g, '/'));
    await page.waitForTimeout(args.wait);

    for (const selector of args.clicks) {
        await page.click(selector);
        await page.waitForTimeout(100);
    }
    if (args.hover) {
        await page.hover(args.hover);
        await page.waitForTimeout(150);
    }
    if (args.focus) {
        await page.$eval(args.focus, el => el.focus());
        await page.waitForTimeout(150);
    }

    await page.screenshot({ path: outputPath, fullPage: args.fullPage });
    console.log('Saved:', outputPath);

    for (const selector of args.prints) {
        const texts = await page.$$eval(selector, els => els.map(el => el.textContent.trim()));
        console.log(`${selector} =>`, texts.length === 1 ? texts[0] : texts);
    }

    await browser.close();
})().catch(err => {
    console.error(err);
    process.exit(1);
});
