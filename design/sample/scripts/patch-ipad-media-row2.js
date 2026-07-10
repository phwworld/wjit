/**
 * iPad 768/820 세로: 좌우 패딩 40px · 미디어룸 2행 카드 이미지(5~7) 교체
 */
const fs = require("fs");
const path = require("path");
const { MQ_PAD_PORTRAIT } = require("./breakpoints");

const ROOT = path.join(__dirname, "..");
const INDEX = path.join(ROOT, "index.html");
const CSS = path.join(ROOT, "css", "site.css");

const MQ_PAD = MQ_PAD_PORTRAIT;

let html = fs.readFileSync(INDEX, "utf8");
let css = fs.readFileSync(CSS, "utf8");

const imgPad = `      /* iPad Mini·Air 세로(768/820): 좌우 패딩 40px */
      @media ${MQ_PAD} {
        :root {
          --mobile-content-gutter: 40px;
        }
      }

      html.is-mobile-menu-open {`;

if (!css.includes("--mobile-content-gutter: 40px")) {
  css = css.replace(
    "      html.is-mobile-menu-open {\n        overflow: hidden;\n      }\n      @media (min-width: 720px) and (not ((width: 768px)",
    `${imgPad}\n      @media (min-width: 720px) and (not ((width: 768px)`
  );
}

html = html.replace(
  /(class="media-room-card media-room-card--pad-row2[\s\S]*?src=")\.\/assets\/미디어룸1\.png(")/,
  "$1./assets/미디어룸6.jpg$2"
);
html = html.replace(
  /(class="media-room-card media-room-card--pad-row2[\s\S]*?src=")\.\/assets\/미디어룸2\.png(")/,
  "$1./assets/미디어룸5.png$2"
);
html = html.replace(
  /(class="media-room-card media-room-card--pad-row2[\s\S]*?src=")\.\/assets\/미디어룸3\.jpg(")/,
  "$1./assets/미디어룸7.jpg$2"
);

if (!html.includes("./assets/미디어룸6.jpg") || !html.includes("./assets/미디어룸7.jpg")) {
  console.error("FAIL: pad-row2 images");
  process.exit(1);
}

fs.writeFileSync(INDEX, html, "utf8");
fs.writeFileSync(CSS, css, "utf8");

if (!html.includes("엔터프라이즈 IT 파트너")) {
  console.error("FAIL: encoding");
  process.exit(1);
}
console.log("OK: patch-ipad-media-row2");
