/**
 * 미디어룸 카드 썸네일 상단 카테고리 뱃지(뉴스/이벤트 등) 제거
 */
const fs = require("fs");
const path = require("path");

const index = path.join(__dirname, "..", "index.html");
const css = path.join(__dirname, "..", "css", "site.css");

let html = fs.readFileSync(index, "utf8");

const badgeRe =
  /\s*<div class="absolute left-4 top-4">\s*<span class="inline-flex items-center gap-2 rounded-full border border-white\/15 bg-black\/35 px-3 py-1 text-xs text-white\/90">\s*<span class="h-1\.5 w-1\.5 rounded-full bg-brand-300"><\/span>[^<]*<\/span>\s*<\/div>/g;

const next = html.replace(badgeRe, "");
if (next === html) {
  console.error("FAIL: category badge blocks not found");
  process.exit(1);
}

fs.writeFileSync(index, next, "utf8");

let siteCss = fs.readFileSync(css, "utf8");
siteCss = siteCss.replace(
  /\s*#media \.media-room-card \.absolute\.left-4\.top-4 span \{[^}]+\}\n/g,
  ""
);

fs.writeFileSync(css, siteCss, "utf8");
console.log("OK: media-room category badges removed");
