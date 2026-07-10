/**
 * site.css 복구: 체크포인트 CSS 추출 + 누락 패치 재적용
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const CSS_OUT = path.join(ROOT, "css", "site.css");
const CHECKPOINT = path.join(
  process.env.APPDATA,
  "Cursor",
  "User",
  "globalStorage",
  "anysphere.cursor-commits",
  "checkpoints",
  "cac6fb83-86a4-4e83-9523-837b6620e2a9",
  "files",
  "8b6f7403-dcd8-4aa3-a308-25ce17dabec6"
);

function extractCssFromHtml(html) {
  const a = html.indexOf("<style>") + "<style>".length;
  const b = html.indexOf("</style>");
  return html.slice(a, b).trim() + "\n";
}

let css = "";
if (fs.existsSync(CHECKPOINT)) {
  css = extractCssFromHtml(fs.readFileSync(CHECKPOINT, "utf8"));
  console.log("base: checkpoint (" + css.split("\n").length + " lines)");
} else {
  const backup = path.join(ROOT, "index.corrupted-backup.html");
  css = extractCssFromHtml(fs.readFileSync(backup, "utf8"));
  console.log("base: backup (" + css.split("\n").length + " lines)");
}

function rep(from, to, label) {
  if (css.includes(to)) return;
  if (!css.includes(from)) {
    console.warn("skip (anchor missing):", label);
    return;
  }
  css = css.replace(from, to);
}

// --- Mobile accordion menu CSS ---
const menuAnchor = "      /* 모바일(≤719px): 컴팩트 탑네비 · 미디어룸 상단 여백 · 하단 고정 CTA */";
const menuCss = `        /* 모바일 햄버거 메뉴: 풀화면 화이트 · 아코디언 */
        #site-header.is-mobile-menu-open {
          background-color: transparent !important;
          border-bottom-color: transparent !important;
          overflow: visible !important;
        }
        #site-header.is-mobile-menu-open > .site-container {
          position: relative;
          z-index: 101;
          background-color: #ffffff;
        }
        #site-header.is-mobile-menu-open .header-logo-img--mono {
          opacity: 0;
          pointer-events: none;
        }
        #site-header.is-mobile-menu-open .header-logo-img--color {
          opacity: 1;
          pointer-events: auto;
        }
        #site-header.is-mobile-menu-open .header-menu-icon,
        #site-header.is-mobile-menu-open .header-toolbar-icon {
          color: rgba(17, 26, 51, 0.92);
        }
        #site-header.is-mobile-menu-open .justify-self-end button.focus-ring:hover {
          background-color: rgba(15, 23, 42, 0.06);
        }
        #mobile-menu:not(.hidden) {
          position: fixed;
          top: var(--nav-height);
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 100;
          display: block !important;
          overflow-x: hidden;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          background-color: #ffffff !important;
          border-top: 1px solid rgba(15, 23, 42, 0.08);
          padding-bottom: calc(1.75rem + env(safe-area-inset-bottom, 0px));
        }
        #mobile-menu:not(.hidden) .site-container,
        #mobile-menu:not(.hidden) .mobile-menu-inner,
        #mobile-menu:not(.hidden) .mobile-nav {
          background-color: #ffffff;
        }
        #mobile-menu .mobile-menu-inner {
          margin-top: 0;
          border: none;
          border-radius: 0;
          background: #ffffff;
          overflow: visible;
          max-height: none;
        }
        .mobile-nav { padding: 0.15rem 0 0.5rem; }
        .mobile-nav__group { border-bottom: 0; }
        .mobile-nav__lv1 {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          min-height: 3.25rem;
          padding: 0.85rem 0.25rem;
          border: 0;
          background: #ffffff;
          text-align: left;
          font-size: 1.0625rem;
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1.3;
          color: rgba(17, 26, 51, 0.88);
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .mobile-nav__lv1-label {
          position: relative;
          display: inline-block;
          padding-bottom: 0.3rem;
        }
        .mobile-nav__group.is-open .mobile-nav__lv1-label::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 2px;
          background: #0b6dff;
          border-radius: 9999px;
        }
        .mobile-nav__group.is-open .mobile-nav__lv1 { color: #0b6dff; }
        .mobile-nav__chevron {
          flex-shrink: 0;
          width: 1.125rem;
          height: 1.125rem;
          color: rgba(17, 26, 51, 0.28);
          transition: transform 0.22s ease, color 0.2s ease;
        }
        .mobile-nav__group.is-open .mobile-nav__chevron {
          transform: rotate(180deg);
          color: #0b6dff;
        }
        .mobile-nav__panel { padding: 0 0 0.65rem; background: #ffffff; }
        .mobile-nav__panel--flat { padding-top: 0.15rem; }
        .mobile-nav__section { padding: 0.35rem 0 0.15rem; }
        .mobile-nav__section + .mobile-nav__section { margin-top: 0.35rem; padding-top: 0.55rem; border-top: 0; }
        .mobile-nav__lv2 {
          padding: 0.35rem 0.25rem 0.45rem;
          font-size: 0.8125rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          line-height: 1.3;
          color: #0b6dff;
        }
        .mobile-nav__lv3 { margin: 0; padding: 0; list-style: none; }
        .mobile-nav__lv3 li { border-top: 0; }
        .mobile-nav__lv3 a {
          display: block;
          padding: 0.72rem 0.25rem;
          font-size: 0.875rem;
          font-weight: 400;
          line-height: 1.45;
          letter-spacing: -0.02em;
          color: rgba(17, 26, 51, 0.72);
          text-decoration: none;
        }
        .mobile-nav__lv3 a:active,
        .mobile-nav__lv3 a:focus-visible { color: #0b6dff; }
        .mobile-nav__sep { margin: 0 0.35rem; color: rgba(17, 26, 51, 0.22); font-weight: 300; }

`;
if (css.includes(menuAnchor) && !css.includes("mobile-nav__group")) {
  css = css.replace(menuAnchor, menuCss + menuAnchor);
}

// html scroll lock
if (!css.includes("html.is-mobile-menu-open")) {
  rep(
    `        .hero-subline-twoline {
          display: block;
        }

      }
      @media (min-width: 720px) {
        .mobile-bottom-dock {
          display: none !important;
        }`,
    `        .hero-subline-twoline {
          display: block;
        }

      }
      html.is-mobile-menu-open {
        overflow: hidden;
      }
      @media (min-width: 720px) {
        html.is-mobile-menu-open {
          overflow: auto;
        }
        .mobile-bottom-dock {
          display: none !important;
        }`,
    "html lock"
  );
}

// Growth web title +20%
rep(
  `      #growth .growth-card-grid--4up .growth-card-title {
        font-size: clamp(1.125rem, 1.38vw, 1.35rem);
        line-height: 1.12;
        letter-spacing: -0.03em;
      }`,
  `      #growth .growth-card-grid--4up .growth-card-title {
        font-size: clamp(1.35rem, 1.656vw, 1.62rem);
        line-height: 1.4;
        letter-spacing: -0.03em;
      }`,
  "growth web title"
);
rep(
  `      @media (min-width: 1536px) {
        #growth .growth-card-grid--4up .growth-card-title {
          font-size: clamp(1.2rem, 1.26vw, 1.44rem);
        }
      }`,
  `      @media (min-width: 1536px) {
        #growth .growth-card-grid--4up .growth-card-title {
          font-size: clamp(1.44rem, 1.512vw, 1.728rem);
          line-height: 1.4;
        }
      }`,
  "growth xl"
);

// 2560 contact-footer bottom stick
rep(
  `      /* 2560px+: 문의하기·푸터 한 화면 — 보내기 하단 50px에 푸터 */
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
      }`,
  `      /* 2560px+: 문의하기·푸터 한 화면 — 푸터는 뷰포트 하단 고정 */
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
      }`,
  "2560 contact-footer"
);

// Services keywords thinner (100)
rep(
  `        /* 모바일: 서비스 카드 세부 서비스명(AICC·WIKL 등) 15px 레귤러 */
        #services .service-card-keywords {
          font-size: 15px !important;
          font-weight: 400 !important;
          line-height: 1.5;
        }
        #services .service-card-keywords > li {
          font-weight: 400;
        }`,
  `        /* 모바일: 서비스 카드 세부 서비스명 — 15px · 굵기 100 */
        #services .service-card-keywords {
          font-size: 15px !important;
          font-weight: 100 !important;
          line-height: 1.5;
        }
        #services .service-card-keywords > li {
          font-weight: 100 !important;
        }`,
  "services keywords mobile"
);

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
  css = css.replace(
    `        font-weight: 400;
      }
      #cases .snap-section-main {`,
    `        font-weight: 100;
      }
      #cases .snap-section-main {`
  );
}

// Growth mobile top padding half
if (!css.includes("성장보고서 상단 세로 여백 50%")) {
  const gAnchor = `        /* Growth report: 모바일 가로형 카드`;
  const gBlock = `        /* 모바일: 성장보고서 상단 세로 여백 50% 축소 */
        #growth .snap-section-main {
          padding-top: calc(var(--section-title-offset) / 2) !important;
        }

        /* Growth report: 모바일 가로형 카드`;
  if (css.includes(gAnchor)) {
    css = css.replace(gAnchor, gBlock);
  }
}

// Growth mobile typo 22/38
rep(
  `        #growth .growth-card-grid--4up .growth-card-title {
          text-align: left;
          width: 100%;
          font-size: 1.625rem;
          letter-spacing: -0.03em;
          line-height: 1.15;
        }
        #growth .growth-card-grid--4up .growth-metric-num {
          text-align: left;
          width: 100%;
          font-size: clamp(2.7rem, 10.4vw, 3.3rem);
          margin-top: 0.35rem;
          line-height: 1.05;
        }`,
  `        #growth .growth-card-grid--4up .growth-card-title {
          text-align: left;
          width: 100%;
          font-size: 22px;
          letter-spacing: -0.03em;
          line-height: 1.15;
        }
        #growth .growth-card-grid--4up .growth-metric-num {
          text-align: left;
          width: 100%;
          font-size: 38px;
          margin-top: 0.35rem;
          line-height: 1.05;
        }`,
  "growth mobile typo"
);

// Cases mobile block
if (!css.includes("데이터가 성과가 되는순간")) {
  rep(
    `        /* 모바일: 고객성공사례 콘텐츠 20px 상향 */
        #cases .snap-section-main > .site-container,
        #cases .snap-section-main > .case-rail {
          transform: translateY(-20px);
        }`,
    `        /* 모바일: 고객성공사례 서브·태그·카드 간격 */
        #cases .snap-section-main {
          padding-top: calc(var(--section-title-offset) - 60px) !important;
        }
        #cases .reveal-up.mt-3.text-black\\/60 {
          margin-bottom: 20px !important;
        }
        #cases .reveal-up.mt-5:has(.case-tags) {
          margin-top: 0 !important;
        }
        #cases .case-tags {
          gap: 6px 10px !important;
        }
        #cases .case-tag {
          padding: 8px 12px !important;
        }
        #cases .case-rail.case-rail-bleed {
          margin-top: -10px !important;
          padding-top: 0 !important;
        }

        /* 모바일: 고객성공사례 콘텐츠 20px 상향 */
        #cases .snap-section-main > .site-container,
        #cases .snap-section-main > .case-rail {
          transform: translateY(-20px);
        }`,
    "cases mobile"
  );
}

// Services bottom padding +40
if (!css.includes("서비스 영역 하단 여백 +40px")) {
  rep(
    `        /* 모바일: 서비스소개 서브타이틀 — 다른 섹션 서브와 동일 16px */`,
    `        /* 모바일: 서비스 영역 하단 여백 +40px (미디어룸 간격) */
        #services .snap-section-main {
          padding-bottom: calc(1.5rem + 40px) !important;
        }
        /* 모바일: 서비스소개 서브타이틀 — 다른 섹션 서브와 동일 16px */`,
    "services pb"
  );
}

// Remove contact header social hide (icons moved to footer)
css = css.replace(
  /        \/\* 모바일: 문의하기 소셜 아이콘 숨김 \*\/\s*#contact \.contact-social-nav \{\s*display: none !important;\s*\}\s*/g,
  ""
);

// Footer contact-social-nav (iconify buttons, same as 문의하기)
const footerSocialCss = `
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
  if (css.includes(".footer-family-option--muted:hover")) {
    css = css.replace(
      ".footer-family-option--muted:hover {\n        background: transparent;\n      }\n\n      /* GNB 메가 메뉴",
      `.footer-family-option--muted:hover {\n        background: transparent;\n      }\n${footerSocialCss}\n      /* GNB 메가 메뉴`
    );
  }
}

// Remove old footer-social img rules if present
css = css.replace(/      \/\* 푸터: 그룹사 셀렉트 \+ SNS[\s\S]*?@media \(min-width: 720px\) \{\s*\.site-footer \.footer-social[\s\S]*?\}\s*\}\s*/g, "");

// Dock black links
css = css.replace(
  /      \.mobile-bottom-dock__link:first-child \{\s*color: #0b6dff;\s*\}\s*/g,
  ""
);

fs.writeFileSync(CSS_OUT, css, "utf8");
console.log("OK: rebuild-site-css (" + css.split("\n").length + " lines)");
