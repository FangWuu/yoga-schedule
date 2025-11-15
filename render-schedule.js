#!/usr/bin/env node
// Render a React JSX component (your YogaSchedule.jsx) to a fixed-size PNG via Puppeteer.
// Usage: node render-schedule.js src/YogaSchedule.jsx out.png 905 1280 [optional_local_bg_path]

const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

async function main() {
  const [, , jsxPathArg, outPathArg, wArg, hArg, bgArg] = process.argv;
  if (!jsxPathArg || !outPathArg || !wArg || !hArg) {
    console.error("Usage: node render-schedule.js src/YogaSchedule.jsx out.png 905 1280 [bg.jpg]");
    process.exit(1);
  }
  const jsxPath = path.resolve(jsxPathArg);
  const outPath = path.resolve(outPathArg);
  const WIDTH = parseInt(wArg, 10);
  const HEIGHT = parseInt(hArg, 10);
  const localBg = bgArg ? path.resolve(bgArg) : null;

  if (!fs.existsSync(jsxPath)) {
    console.error("Cannot find:", jsxPath);
    process.exit(1);
  }
  const raw = fs.readFileSync(jsxPath, "utf8");

  // --- make JSX browser-executable with Babel Standalone (no bundling) ---
  // 1) remove React import (we use UMD globals)
  // 2) drop "export default" to plain function
  let code = raw
    .replace(/^\s*import\s+React.*?;?\s*$/m, "")
    .replace(/export\s+default\s+function\s+YogaSchedule/, "function YogaSchedule");

  // Optional: override bg image with a local file if provided
  if (localBg) {
    const fileUrl = "file:///" + localBg.replace(/\\/g, "/");
    code = code.replace(/bg-\[url\(['"`].*?['"`]\)\]/g, `bg-[url('${fileUrl}')]`);
  }

  // Minimal HTML that mounts your component and lets Tailwind CDN style runtime DOM.
  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>YogaSchedule PNG</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    html, body { margin: 0; padding: 0; background: #0f172a; }
    /* Fixed artboard to your requested size */
    #frame { width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; position: relative; }
    /* Prevent scrollbars from Tailwind's min-h-screen */
    #root { width: 100%; height: 100%; }
  </style>
  <!-- Tailwind CDN (JIT scans runtime DOM so classes from React are styled) -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = { theme: { extend: {} } };
  </script>
  <!-- React 18 UMD -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <!-- Babel Standalone to compile your JSX in-page -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="frame"><div id="root"></div></div>

  <script type="text/babel" data-presets="react">
${code}

// Mount your component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(YogaSchedule));
  </script>
</body>
</html>`;

  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: { width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 }
  });
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 });

  // Load HTML as data URL so we don't need a local web server
  const dataUrl = "data:text/html;charset=utf-8," + encodeURIComponent(html);
  await page.goto(dataUrl, { waitUntil: "networkidle0" });

  // Ensure first paint is done
  await page.waitForSelector("#root :first-child", { timeout: 15000 });

  // Screenshot exactly the fixed artboard
  const frameBox = await page.$("#frame");
  await frameBox.screenshot({ path: outPath, type: "png" });

  await browser.close();
  console.log("Saved:", outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
