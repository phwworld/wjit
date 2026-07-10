/**
 * 모바일 풀오버: 2뎁스 div → 터치 가능한 a 링크
 */
const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(file, "utf8");

const re = /<div class="mobile-nav__lv2">([\s\S]*?)<\/div>/g;
const next = html.replace(
  re,
  '<a class="mobile-nav__lv2 focus-ring" href="#" data-empty-link data-mobile-menu-link aria-disabled="true" tabindex="-1">$1</a>'
);

if (next === html) {
  console.error("FAIL: no mobile-nav__lv2 div found");
  process.exit(1);
}

fs.writeFileSync(file, next, "utf8");
console.log("OK: mobile-nav__lv2 → link");
