/**
 * 문의 소셜 → 푸터 이동(iconify) · Managed · 키워드 굵기 — HTML + CSS 안전 패치
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const INDEX = path.join(ROOT, "index.html");
const CSS = path.join(ROOT, "css", "site.css");

let html = fs.readFileSync(INDEX, "utf8");
let css = fs.readFileSync(CSS, "utf8");

const socialNav = `              <nav class="contact-social-nav shrink-0" aria-label="웅진IT 채널 바로가기">
                <ul class="flex flex-wrap items-center gap-2.5 sm:justify-end">
                  <li>
                    <a
                      class="contact-social-btn focus-ring rounded-xl"
                      href="#"
                      data-empty-link
                      aria-disabled="true"
                      tabindex="-1"
                      aria-label="ChatBOT · 고객 문의"
                    >
                      <iconify-icon icon="solar:chat-round-dots-bold" aria-hidden="true"></iconify-icon>
                    </a>
                  </li>
                  <li>
                    <a
                      class="contact-social-btn focus-ring rounded-xl"
                      href="#"
                      data-empty-link
                      aria-disabled="true"
                      tabindex="-1"
                      aria-label="페이스북 · 웅진그룹"
                    >
                      <iconify-icon icon="mdi:facebook" aria-hidden="true"></iconify-icon>
                    </a>
                  </li>
                  <li>
                    <a
                      class="contact-social-btn focus-ring rounded-xl"
                      href="#"
                      data-empty-link
                      aria-disabled="true"
                      tabindex="-1"
                      aria-label="블로그"
                    >
                      <iconify-icon icon="solar:document-text-linear" aria-hidden="true"></iconify-icon>
                    </a>
                  </li>
                  <li>
                    <a
                      class="contact-social-btn focus-ring rounded-xl"
                      href="#"
                      data-empty-link
                      aria-disabled="true"
                      tabindex="-1"
                      aria-label="유튜브"
                    >
                      <iconify-icon icon="mdi:youtube" aria-hidden="true"></iconify-icon>
                    </a>
                  </li>
                </ul>
              </nav>`;

if (html.includes('aria-label="소셜 미디어"') || html.includes("footer-social")) {
  html = html.replace(/              <nav class="footer-social"[\s\S]*?              <\/nav>/, socialNav);
}

const contactSocialBlock =
  /              <nav class="contact-social-nav shrink-0" aria-label="웅진IT 채널 바로가기">[\s\S]*?              <\/nav>\s*\n            <\/div>\s*\n            <p class="mt-2 max-w-md/;
if (contactSocialBlock.test(html)) {
  html = html.replace(
    contactSocialBlock,
    `            </div>
            <p class="mt-2 max-w-md`
  );
}

html = html.replace(
  /<span class="max-\[719px\]:hidden">Managed Services<\/span><span class="hidden max-\[719px\]:inline">Managed<\/span>/g,
  "Managed"
);
html = html.replace(/>Managed Services<\/div>/g, ">Managed</div>");

const footerNavCss = `
      /* 푸터: 그룹사 셀렉트 + contact-social-nav (문의하기와 동일 스타일) */
      .site-footer .contact-social-nav {
        margin-top: 10px;
        width: 100%;
        max-width: 14rem;
        margin-left: auto;
      }
      .site-footer .contact-social-nav ul {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.625rem;
        margin: 0;
        padding: 0;
        list-style: none;
        justify-content: flex-end;
      }
      .site-footer .contact-social-nav li {
        margin: 0;
        padding: 0;
      }
      @media (max-width: 719px) {
        .site-footer .footer-main-row {
          gap: 2rem;
        }
        .site-footer .footer-aside-col {
          width: 100%;
          max-width: 100%;
          order: 3;
          margin-top: 0.25rem;
        }
        .site-footer .footer-family-dropdown {
          width: 100%;
          max-width: none;
        }
        .site-footer .footer-family-trigger {
          width: 100%;
        }
        .site-footer .contact-social-nav {
          max-width: 100%;
          margin-left: auto;
          margin-right: auto;
        }
        .site-footer .contact-social-nav ul {
          justify-content: center;
          gap: 0.75rem;
        }
      }
      @media (min-width: 720px) {
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
      }
`;

if (!css.includes(".site-footer .contact-social-nav {")) {
  css = css.replace(
    ".footer-family-option--muted:hover {\n        background: transparent;\n      }\n\n      /* GNB 메가 메뉴",
    `.footer-family-option--muted:hover {\n        background: transparent;\n      }\n${footerNavCss}\n      /* GNB 메가 메뉴`
  );
}

if (!css.includes("#services .service-card-keywords,\n      #services .service-card-keywords > li")) {
  css = css.replace(
    "      .service-card-keywords {\n        list-style: none;",
    `      #services .service-card-keywords,
      #services .service-card-keywords > li {
        font-weight: 100;
      }
      .service-card-keywords {
        list-style: none;`
  );
}

css = css.replace(/font-weight: 200 !important;/g, "font-weight: 100 !important;");
css = css.replace(
  /        \/\* 모바일: 문의하기 소셜 아이콘 숨김 \*\/\s*#contact \.contact-social-nav \{\s*display: none !important;\s*\}\s*/g,
  ""
);

fs.writeFileSync(INDEX, html, "utf8");
fs.writeFileSync(CSS, css, "utf8");

if (!html.includes("엔터프라이즈 IT 파트너")) {
  console.error("FAIL: korean");
  process.exit(1);
}
console.log("OK: patch-contact-social-move");
