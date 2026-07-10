/**
 * 문의하기·푸터 디자인 복원 (푸터 배경 #333 유지)
 * — 컴팩트 푸터 / contact-footer-screen 레이아웃 되돌림
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const REF_INDEX = path.join(ROOT, "..", "..", "1차시안", "시안1", "index.html");
const REF_SUB = path.join(ROOT, "..", "시안2", "sub.html");
const REF_FOOTER_CSS = path.join(ROOT, "..", "시안2", "css", "layout-nav-footer.css");

const INDEX = path.join(ROOT, "index.html");
const SUB = path.join(ROOT, "sub.html");
const CSS = path.join(ROOT, "css", "site.css");
const LAYOUT_CSS = path.join(ROOT, "css", "layout-nav-footer.css");

function restoreIndex() {
  let index = fs.readFileSync(INDEX, "utf8");
  const ref = fs.readFileSync(REF_INDEX, "utf8");

  const formMatch = index.match(
    /(<div class="contact-on-bg">[\s\S]*?<div id="contact-toast"[\s\S]*?<\/div>\s*<\/form>\s*<\/div>)/
  );
  if (!formMatch) {
    console.error("contact form block not found in index.html");
    process.exit(1);
  }
  const contactForm = formMatch[1];

  const footerMatch = ref.match(
    /      <footer[\s\S]*?      <\/footer>/
  );
  if (!footerMatch) {
    console.error("footer block not found in reference index");
    process.exit(1);
  }
  let footer = footerMatch[0]
    .replace('bg-[#050508]', 'bg-[#333]')
    .replace(
      /서울시 중구 청계천로 24 케이스퀘어시티 6~9, 16층[\s\S]*?대표전화[^\n]*/g,
      "서울시 중구 청계천로 24 케이스퀘어시티 6~9층, 16층"
    );

  const block = `      <section id="contact-footer" class="snap-section relative flex min-h-[100dvh] flex-col overflow-hidden bg-white" aria-label="문의 및 사이트 정보">

      <!-- Contact -->
      <section id="contact" class="relative z-10 flex flex-1 flex-col justify-start snap-section-main pb-[calc(3rem+30px)] sm:pb-[calc(4rem+30px)]">
        <div class="site-container w-full px-4 sm:px-6 lg:px-8 xl:px-10 3xl:px-12 reveal-up">
          ${contactForm}
        </div>
      </section>

${footer}
      </section>
    </main>`;

  if (!index.includes('id="contact-footer"')) {
    console.error("contact-footer anchor missing");
    process.exit(1);
  }
  index = index.replace(
    /      <section id="contact-footer"[\s\S]*?    <\/main>/,
    block
  );
  fs.writeFileSync(INDEX, index, "utf8");
  console.log("OK: index.html restored");
}

function restoreSub() {
  let sub = fs.readFileSync(SUB, "utf8");
  const ref = fs.readFileSync(REF_SUB, "utf8");

  const footerMatch = ref.match(
    /<footer id="site-footer"[\s\S]*?<\/footer>/
  );
  if (!footerMatch) {
    console.error("sub footer not found in reference");
    process.exit(1);
  }
  let footer = footerMatch[0];
  footer = footer.replace(
    `<p class="footer-tagline">
            비즈니스의 혁신을 이끄는<br />
            엔터프라이즈 IT 파트너
          </p>`,
    `<p class="footer-tagline">
            AI·ERP·클라우드·솔루션·글로벌로<br />
            비즈니스의 혁신을 이끄는<br />
            엔터프라이즈 IT 파트너
          </p>`
  );
  footer = footer.replace(
    /\(주\)웅진  서울시 중구 청계천로 24 케이스퀘어시티 6~9, 16층[\s\S]*?TEL[^\n]*/g,
    "(주)웅진  서울시 중구 청계천로 24 케이스퀘어시티 6~9, 16층"
  );

  sub = sub.replace(/<footer id="site-footer"[\s\S]*?<\/footer>/, footer);
  fs.writeFileSync(SUB, sub, "utf8");
  console.log("OK: sub.html restored");
}

function restoreLayoutFooterCss() {
  const layout = fs.readFileSync(LAYOUT_CSS, "utf8");
  const ref = fs.readFileSync(REF_FOOTER_CSS, "utf8");

  const start = ref.indexOf("    /* ============================================================\n       8. FOOTER");
  const end = ref.indexOf("    /* ============================================================\n       11. 모바일 메뉴");
  if (start < 0 || end < 0) {
    console.error("footer css section not found in reference");
    process.exit(1);
  }
  let footerCss = ref.slice(start, end).replace(
    "background: #060606;",
    "background: #333;"
  );

  const layoutStart = layout.indexOf("    /* ============================================================\n       8. FOOTER");
  const layoutEnd = layout.indexOf("    /* ============================================================\n       11. 모바일 메뉴");
  if (layoutStart < 0 || layoutEnd < 0) {
    console.error("footer css section not found in layout-nav-footer.css");
    process.exit(1);
  }

  const updated = layout.slice(0, layoutStart) + footerCss + layout.slice(layoutEnd);
  fs.writeFileSync(LAYOUT_CSS, updated, "utf8");
  console.log("OK: layout-nav-footer.css restored (#333)");
}

function restoreSiteCss() {
  let css = fs.readFileSync(CSS, "utf8");

  // contact-footer-screen 블록 제거
  css = css.replace(
    /\n      \/\* ── 문의하기\+푸터 한 화면[\s\S]*?#contact-footer \.contact-submit-row \{[\s\S]*?\}\n      \}\n$/,
    "\n"
  );

  // 컴팩트 푸터 CSS 블록 제거
  css = css.replace(
    /\n      \/\* 사이트 푸터 — 컴팩트 \(사이트맵 제거\) \*\/[\s\S]*?@media \(max-width: 480px\) \{\n        \.site-footer \.footer-quick-links \{[\s\S]*?\}\n      \}\n/,
    "\n"
  );

  // snap-section-main 복원
  if (!css.includes("#contact.snap-section-main {")) {
    css = css.replace(
      "      /* #contact: 구 snap-section-main 대체 — contact-footer-screen__form 에서 패딩 처리 */\n",
      `      #contact.snap-section-main {
        padding-top: calc(var(--section-title-offset) - 60px);
      }
`
    );
  }

  // 2560px contact-footer 블록 복원
  const block2560 = `      /* 2560px+: 문의하기·푸터 한 화면 — 푸터는 뷰포트 하단 고정 */
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
          width: 100%;
        }
      }
`;

  if (!css.includes("2560px+: 문의하기·푸터 한 화면")) {
    css = css.replace(
      /#cases \.case-rail\.case-rail-bleed \{[\s\S]*?\}\n      \}\n/,
      (m) => m + block2560
    );
  }

  // 모바일 contact 패딩 복원
  css = css.replace(
    "#contact-footer .contact-footer-screen__form {",
    "#contact.snap-section-main {"
  );
  css = css.replace(
    /#contact-footer \.contact-footer-screen__form \{\n            padding-top: max\(0\.35rem, calc\(var\(--section-title-offset\) - 84px\)\) !important;\n          \}/,
    `#contact.snap-section-main {
            padding-top: max(0.35rem, calc(var(--section-title-offset) - 84px)) !important;
          }`
  );

  // iPad portrait contact-footer 복원
  const ipadBlock = `        #contact-footer {
          overflow: visible !important;
          min-height: 100dvh;
        }
        #contact-footer > #contact {
          flex: 0 0 auto !important;
        }
        #contact-footer .site-footer {
          flex: 0 0 auto !important;
          margin-top: 0 !important;
          width: 100% !important;
        }
        #contact .site-container,
        .site-footer .site-container {`;

  css = css.replace(
    /        #contact \.site-container,\n        \.site-footer \.footer-inner \{/,
    ipadBlock
  );

  fs.writeFileSync(CSS, css, "utf8");
  console.log("OK: site.css restored");
}

restoreIndex();
restoreSub();
restoreLayoutFooterCss();
restoreSiteCss();
