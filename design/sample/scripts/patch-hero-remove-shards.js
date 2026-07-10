const fs = require("fs");
const path = require("path");

const htmlPath = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(htmlPath, "utf8");
const before = html;

html = html.replace(
  /(<source src="\.\/assets\/heor2\.webm" type="video\/webm" \/>\s*<\/video>)[\s\S]*?(\n\s*<div\s*\n\s*class="hero-media-radial)/,
  "$1\n          </div>$2"
);

if (html === before) {
  console.error("FAIL: hero shard block not found");
  process.exit(1);
}

if (/hero-shard/.test(html)) {
  console.error("FAIL: hero-shard markup still present");
  process.exit(1);
}

fs.writeFileSync(htmlPath, html, "utf8");
console.log("OK: hero shard markup removed");
