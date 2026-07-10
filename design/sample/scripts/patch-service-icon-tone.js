/**
 * 서비스 카드 아이콘 — 브랜드 블루 원톤 그라데이션(전 해상도 공통)
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const INDEX = path.join(ROOT, "index.html");
const CSS = path.join(ROOT, "css", "site.css");

const SVG_DEFS = `    <svg class="sr-only" aria-hidden="true" width="0" height="0" focusable="false">
      <defs>
        <linearGradient id="service-icon-tone-grad" x1="22%" y1="6%" x2="78%" y2="94%">
          <stop offset="0%" stop-color="#9ec8ff" />
          <stop offset="46%" stop-color="#0b6dff" />
          <stop offset="100%" stop-color="#0744aa" />
        </linearGradient>
        <linearGradient id="service-icon-tone-grad-soft" x1="18%" y1="0%" x2="82%" y2="100%">
          <stop offset="0%" stop-color="#c5ddff" />
          <stop offset="55%" stop-color="#5a9eff" />
          <stop offset="100%" stop-color="#2a7ef0" />
        </linearGradient>
      </defs>
    </svg>

`;

const ICON_CSS = `      .service-card-icon {
        font-size: 54px;
      }
      /* 서비스 카드 아이콘 — 브랜드 블루 원톤(채도 차 그라데이션) · 전 해상도 공통 */
      #services .service-card-icon-wrap {
        --svc-icon-tone: #0b6dff;
        color: var(--svc-icon-tone);
        opacity: 0.94;
      }
      #services .service-card-icon {
        color: var(--svc-icon-tone);
      }
      #services iconify-icon.service-card-icon svg path {
        fill: url(#service-icon-tone-grad);
      }
      #services iconify-icon.service-card-icon svg path[opacity] {
        fill: url(#service-icon-tone-grad-soft);
        opacity: 1;
      }
      #services article.service-card .pointer-events-none.rounded-full.blur-3xl {
        background-color: rgba(11, 109, 255, 0.07) !important;
      }
`;

let html = fs.readFileSync(INDEX, "utf8");
let css = fs.readFileSync(CSS, "utf8");

if (!html.includes("service-icon-tone-grad")) {
  html = html.replace(
    /<a\s+href="#content"\s+class="sr-only/,
    `${SVG_DEFS}<a href="#content" class="sr-only`
  );
}

html = html.replace(
  /class="service-card-icon-wrap pointer-events-none absolute text-[\w-]+ opacity-\[0\.92\]"/g,
  'class="service-card-icon-wrap pointer-events-none absolute"'
);

html = html.replace(
  /class="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-(?:brand|amber|emerald|violet|slate)-[\w/.\[\]]+ blur-3xl"/g,
  'class="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-brand-500/[0.07] blur-3xl"'
);

if (!css.includes("service-icon-tone-grad")) {
  css = css.replace(/      \.service-card-icon \{\n        font-size: 54px;\n      \}/, ICON_CSS.trim());
} else {
  console.log("skip: icon tone css exists");
}

fs.writeFileSync(INDEX, html, "utf8");
fs.writeFileSync(CSS, css, "utf8");

if (!html.includes("service-icon-tone-grad") || !html.includes("엔터프라이즈 IT 파트너")) {
  console.error("FAIL: verify");
  process.exit(1);
}
console.log("OK: patch-service-icon-tone");
