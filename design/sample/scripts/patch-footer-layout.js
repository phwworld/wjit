/**
 * 푸터 SNS·2560 레이아웃 — UTF-8 safe
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const INDEX = path.join(ROOT, "index.html");
const CSS = path.join(ROOT, "css", "site.css");

let html = fs.readFileSync(INDEX, "utf8");
let css = fs.readFileSync(CSS, "utf8");

const snsBlock = `              <nav class="footer-social" aria-label="소셜 미디어">
                <a
                  href="https://blog.naver.com/woongjinmkt"
                  class="footer-social__link focus-ring"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="네이버 블로그"
                >
                  <img src="./assets/sns_naver.png" alt="" width="36" height="36" loading="lazy" decoding="async" />
                </a>
                <a
                  href="https://www.facebook.com/woongjinmkt"
                  class="footer-social__link focus-ring"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="페이스북"
                >
                  <img src="./assets/sns_facebook.png" alt="" width="36" height="36" loading="lazy" decoding="async" />
                </a>
                <a
                  href="https://www.youtube.com/@woongjinmkt"
                  class="footer-social__link focus-ring"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="유튜브"
                >
                  <img src="./assets/sns_youtube.png" alt="" width="36" height="36" loading="lazy" decoding="async" />
                </a>
                <a
                  href="https://www.linkedin.com/company/woongjin-it"
                  class="footer-social__link focus-ring"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <img src="./assets/sns_in.png" alt="" width="36" height="36" loading="lazy" decoding="async" />
                </a>
              </nav>`;

const oldAside = `            <div class="flex w-full flex-col gap-4 lg:w-[11.5rem] lg:shrink-0">
              <div id="footer-family-wrap" class="footer-family-dropdown relative pointer-events-auto">`;

const newAside = `            <div class="footer-aside-col flex w-full flex-col lg:w-[11.5rem] lg:shrink-0">
              <div id="footer-family-wrap" class="footer-family-dropdown relative pointer-events-auto">`;

if (!html.includes("footer-social")) {
  if (!html.includes(oldAside)) {
    console.error("footer aside anchor not found");
    process.exit(1);
  }
  html = html.replace(oldAside, newAside);
  html = html.replace(
    `                </ul>
              </div>
            </div>
          </div>

          <div class="mt-12 border-t border-white/[0.08] pt-8">`,
    `                </ul>
              </div>
${snsBlock}
            </div>
          </div>

          <div class="mt-12 border-t border-white/[0.08] pt-8">`
  );
}

const css2560Old = `      /* 2560px+: 문의하기·푸터 한 화면 — 보내기 하단 50px에 푸터 */
      @media (min-width: 2560px) {
        #contact-footer {
          justify-content: flex-start;
        }
        #contact-footer #contact.snap-section-main {
          flex: 0 0 auto;
          padding-bottom: 0 !important;
        }
        #contact-footer .site-footer {
          margin-top: 50px !important;
          flex: 0 0 auto;
        }
      }`;

const css2560New = `      /* 2560px+: 문의하기·푸터 한 화면 — 푸터는 뷰포트 하단 고정 */
      @media (min-width: 2560px) {
        #contact-footer {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          min-height: 100dvh;
        }
        #contact-footer > #contact {
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }
        #contact-footer #contact.snap-section-main {
          flex: 1 1 auto;
          padding-bottom: 0 !important;
        }
        #contact-footer .site-footer {
          margin-top: auto !important;
          flex: 0 0 auto;
        }
      }`;

if (css.includes(css2560Old)) {
  css = css.replace(css2560Old, css2560New);
}

const footerSocialCss = `
      /* 푸터: 그룹사 셀렉트 + SNS (네이버·페이스북·유튜브·LinkedIn) */
      .footer-social {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-wrap: nowrap;
        gap: 0.625rem;
        margin-top: 10px;
        margin-left: auto;
        margin-right: 0;
        width: 100%;
        max-width: 14rem;
        box-sizing: border-box;
      }
      .footer-social__link {
        display: block;
        flex-shrink: 0;
        width: 2.25rem;
        height: 2.25rem;
        text-decoration: none;
        transition: opacity 0.15s ease;
      }
      .footer-social__link:hover,
      .footer-social__link:focus-visible {
        opacity: 0.85;
      }
      .footer-social__link:focus-visible {
        outline: 2px solid #0b6dff;
        outline-offset: 3px;
        border-radius: 2px;
      }
      .site-footer .footer-social__link img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: brightness(0) invert(1);
        opacity: 0.92;
      }
      .site-footer .footer-social__link:hover img,
      .site-footer .footer-social__link:focus-visible img {
        opacity: 1;
      }
      @media (max-width: 719px) {
        .site-footer .footer-aside-col {
          width: 100%;
          max-width: 100%;
          order: 3;
        }
        .site-footer .footer-family-dropdown {
          width: 100%;
          max-width: none;
        }
        .site-footer .footer-family-trigger {
          width: 100%;
        }
        .site-footer .footer-social {
          justify-content: center;
          margin-top: 10px;
          margin-left: auto;
          margin-right: auto;
          max-width: 100%;
          gap: 0.75rem;
        }
        .site-footer .footer-social__link {
          width: 2.5rem;
          height: 2.5rem;
        }
      }
      @media (min-width: 720px) {
        .site-footer .footer-aside-col {
          align-items: stretch;
        }
        .site-footer .footer-family-dropdown {
          margin-left: auto;
        }
        .site-footer .footer-social {
          justify-content: flex-end;
          margin-left: auto;
          margin-right: 0;
        }
      }
`;

if (!css.includes(".footer-social {")) {
  css = css.replace(
    "      .footer-family-option--muted:hover {\n        background: transparent;\n      }\n\n      /* GNB 메가 메뉴",
    `      .footer-family-option--muted:hover {\n        background: transparent;\n      }\n${footerSocialCss}\n      /* GNB 메가 메뉴`
  );
}

fs.writeFileSync(INDEX, html, "utf8");
fs.writeFileSync(CSS, css, "utf8");
console.log("OK: patch-footer-layout");
