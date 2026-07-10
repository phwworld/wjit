const fs = require("fs");
const path = require("path");

const jsPath = path.join(__dirname, "..", "js", "site.js");
let s = fs.readFileSync(jsPath, "utf8");

const globeStart =
  '      (function initFooterFamilyDropdown() {\n        const root = document.getElementById("cases-globe-root");';
const footerStart =
  '      (function initFooterFamilyDropdown() {\n        const wrap = document.getElementById("footer-family-wrap");';

const start = s.indexOf(globeStart);
const end = s.indexOf(footerStart);

if (start < 0) {
  if (!s.includes("cases-globe-root")) {
    console.log("SKIP: globe JS already removed");
    process.exit(0);
  }
  console.error("globe block start not found");
  process.exit(1);
}
if (end < 0 || end <= start) {
  console.error("footer block not found after globe", start, end);
  process.exit(1);
}

s = s.slice(0, start) + s.slice(end);
fs.writeFileSync(jsPath, s, "utf8");
console.log("OK: removed globe JS block");
