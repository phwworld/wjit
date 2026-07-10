/**
 * Family Site 라벨 · 푸터 셀렉트/소셜 레이아웃 · 모바일 성장 카드 세로 축소
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const INDEX = path.join(ROOT, "index.html");
const CSS = path.join(ROOT, "css", "site.css");

let html = fs.readFileSync(INDEX, "utf8");
let css = fs.readFileSync(CSS, "utf8");

html = html.replace(
  /<label class="sr-only" for="footer-family-trigger">그룹사 바로가기<\/label>/,
  '<label class="sr-only" for="footer-family-trigger">Family Site</label>'
);
html = html.replace(
  /<span id="footer-family-trigger-label">그룹사 바로가기<\/span>/,
  '<span id="footer-family-trigger-label">Family Site</span>'
);
html = html.replace(
  /<span class="footer-family-option footer-family-option--muted pointer-events-none" tabindex="-1">그룹사 바로가기<\/span>/,
  '<span class="footer-family-option footer-family-option--muted pointer-events-none" tabindex="-1">Family Site</span>'
);

const growthAspectOld = `        #growth .growth-card-grid--4up article.growth-card {
          aspect-ratio: 2.35 / 1;
          width: 100%;
          min-height: 0;
        }`;
const growthAspectNew = `        #growth .growth-card-grid--4up article.growth-card {
          /* 카드 박스 세로만 약 3/4 (내용 크기 유지) */
          aspect-ratio: 2.35 / 0.75;
          width: 100%;
          min-height: 0;
        }`;

if (css.includes(growthAspectOld)) {
  css = css.replace(growthAspectOld, growthAspectNew);
} else if (!css.includes("aspect-ratio: 2.35 / 0.75")) {
  console.error("growth mobile aspect block not found");
  process.exit(1);
}

const familyRadiusPatch = `      .footer-family-trigger {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        appearance: none;
        background-color: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 0;
        color: rgba(255, 255, 255, 0.85);
        font-size: 12px;
        padding: 0.5rem 0.65rem 0.5rem 0.75rem;
        text-align: left;
        cursor: pointer;
        transition:
          border-color 0.2s ease,
          background-color 0.2s ease;
      }`;

if (css.includes("border-radius: 0.75rem;\n        color: rgba(255, 255, 255, 0.85);\n        font-size: 12px;\n        padding: 0.5rem")) {
  css = css.replace(
    /      \.footer-family-trigger \{[\s\S]*?background-color 0\.2s ease;\n      \}/,
    familyRadiusPatch
  );
}

css = css.replace(
  /      \.footer-family-trigger--open \{\n        border-radius: 0\.75rem 0\.75rem 0 0;\n/,
  "      .footer-family-trigger--open {\n        border-radius: 0;\n"
);
css = css.replace(
  /        border-radius: 0 0 0\.75rem 0\.75rem;\n        box-shadow: 0 12px 40px/,
  "        border-radius: 0;\n        box-shadow: 0 12px 40px"
);

const footerFamilyBase = `      .footer-family-dropdown {
        width: 100%;
        max-width: 14rem;
      }`;
const footerFamilyBaseNew = `      .footer-family-dropdown {
        width: 100%;
        max-width: 14rem;
      }
      @media (min-width: 720px) {
        .site-footer .footer-family-dropdown,
        .site-footer .contact-social-nav {
          max-width: 21rem;
        }
        .site-footer .contact-social-nav ul {
          flex-wrap: nowrap;
          justify-content: space-between;
          width: 100%;
          gap: 0.5rem;
        }
        .site-footer .contact-social-nav li {
          flex: 1 1 0;
          min-width: 0;
          display: flex;
          justify-content: stretch;
        }
        .site-footer .contact-social-nav .contact-social-btn {
          width: 100%;
          max-width: none;
        }
      }`;

if (css.includes(footerFamilyBase) && !css.includes("max-width: 21rem")) {
  css = css.replace(footerFamilyBase, footerFamilyBaseNew);
}

const web720Block = `      @media (min-width: 720px) {
        .site-footer .footer-aside-col {
          align-items: stretch;
        }
        .site-footer .footer-family-dropdown {
          margin-left: auto;
        }
        .site-footer .contact-social-nav {
          margin-left: auto;
          margin-right: 0;
        }
        .site-footer .contact-social-nav ul {
          justify-content: flex-end;
        }
      }`;

const web720BlockNew = `      @media (min-width: 720px) {
        .site-footer .footer-aside-col {
          align-items: stretch;
        }
        .site-footer .footer-family-dropdown {
          margin-left: auto;
          width: 100%;
        }
        .site-footer .footer-family-trigger {
          width: 100%;
        }
        .site-footer .contact-social-nav {
          margin-left: auto;
          margin-right: 0;
          width: 100%;
        }
      }`;

if (css.includes(web720Block)) {
  css = css.replace(web720Block, web720BlockNew);
}

fs.writeFileSync(INDEX, html, "utf8");
fs.writeFileSync(CSS, css, "utf8");

if (!html.includes("Family Site") || !html.includes("엔터프라이즈 IT 파트너")) {
  console.error("FAIL: html verify");
  process.exit(1);
}
console.log("OK: patch-footer-family-growth");
