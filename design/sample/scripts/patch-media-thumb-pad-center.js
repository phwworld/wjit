/**
 * iPad Air/Pro 세로 — 미디어룸 가운데열(2·5번) 썸네일 마크업 클래스
 */
const fs = require("fs");
const path = require("path");

const index = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(index, "utf8");

const targets = ["./assets/미디어룸2.png", "./assets/미디어룸5.png"];
let n = 0;

for (const src of targets) {
  const re = new RegExp(
    `(class="media-thumb-wrap)( relative aspect-\\[16/10\\][^"]*">\\s*<img[^>]*src="${src.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}")`,
    "m"
  );
  const next = html.replace(re, '$1 media-thumb-wrap--pad-col-center$2');
  if (next === html) {
    console.error("FAIL: thumb wrap not found for", src);
    process.exit(1);
  }
  html = next;
  n++;
}

fs.writeFileSync(index, html, "utf8");
console.log("OK: added media-thumb-wrap--pad-col-center to", n, "cards");
