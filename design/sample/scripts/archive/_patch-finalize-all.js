const fs = require("fs");
const path = require("path");
const newMenuHtml = require("./_mobile-menu-accordion-html.js");

const target = path.join(__dirname, "index.html");
let html = fs.readFileSync(target, "utf8");
let n = 0;

function apply(from, to, label) {
  if (html.includes(to)) return;
  if (!html.includes(from)) {
    console.error("missing:", label);
    process.exit(1);
  }
  html = html.replace(from, to);
  n++;
}

// --- 1) Mobile accordion menu HTML ---
if (!html.includes("data-mobile-nav-group")) {
  const menuStart = "        <!-- Mobile menu panel -->";
  const menuEnd = "    </header>";
  const startIdx = html.indexOf(menuStart);
  const endIdx = html.indexOf(menuEnd, startIdx);
  if (startIdx < 0 || endIdx < 0) {
    console.error("mobile menu block not found");
    process.exit(1);
  }
  html = html.slice(0, startIdx) + newMenuHtml + "\n" + html.slice(endIdx);
  n++;
}

// --- 2) Remove legacy flat mobile-menu CSS ---
const legacyMenuCss = `        /* 모바일 햄버거 메뉴: 화이트 패널 · 컴팩트 네비와 통일 */
        #site-header.is-mobile-menu-open {
          background-color: #ffffff !important;
          border-bottom-color: rgba(15, 23, 42, 0.08) !important;
          overflow: visible !important;
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
        #mobile-menu {
          border-top-color: rgba(15, 23, 42, 0.08);
          background-color: #ffffff;
        }
        #mobile-menu .mobile-menu-inner {
          margin-top: 0;
          border: none;
          border-radius: 0;
          background: transparent;
        }
        #mobile-menu .mobile-menu-links {
          color: rgba(17, 26, 51, 0.88);
        }
        #mobile-menu .mobile-menu-links a {
          padding: 0.625rem 0.75rem;
          min-height: 2.75rem;
          font-size: 0.9375rem;
          line-height: 1.35;
          color: inherit;
        }
        #mobile-menu .mobile-menu-links a:hover {
          background-color: rgba(15, 23, 42, 0.06);
          color: #0b6dff;
        }

        #site-header.is-mobile-menu-open #mobile-menu {
          background-color: #ffffff;
        }
        #mobile-menu:not(.hidden) {
          overflow: visible;
          padding-bottom: 1.25rem;
        }
        #mobile-menu .mobile-menu-inner {
          overflow: visible;
          max-height: none;
        }
        #mobile-menu .mobile-menu-links {
          padding: 0.35rem 0 0.85rem;
        }
        #mobile-menu .mobile-menu-links a {
          padding: 0.7rem 0.85rem;
          min-height: 2.85rem;
        }

`;
if (html.includes(legacyMenuCss)) {
  html = html.replace(legacyMenuCss, "");
  n++;
}

// --- 3) Mobile accordion CSS ---
const menuCssMarker = "/* 모바일 햄버거 메뉴: 풀화면 화이트 · 아코디언 */";
if (!html.includes(menuCssMarker)) {
  const cssAnchor = "      /* 모바일(≤719px): 컴팩트 탑네비 · 미디어룸 상단 여백 · 하단 고정 CTA */";
  const cssBlock = `
        /* 모바일 햄버거 메뉴: 풀화면 화이트 · 아코디언 */
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
        #mobile-menu {
          border-top-color: rgba(15, 23, 42, 0.08);
          background-color: #ffffff;
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
  if (!html.includes(cssAnchor)) {
    console.error("mobile css anchor not found");
    process.exit(1);
  }
  html = html.replace(cssAnchor, cssBlock + cssAnchor);
  n++;
}

// --- 4) html scroll lock ---
if (!html.includes("html.is-mobile-menu-open")) {
  const needle = `        .hero-subline-twoline {
          display: block;
        }

      }
      @media (min-width: 720px) {
        .mobile-bottom-dock {
          display: none !important;
        }`;
  const ins = `        .hero-subline-twoline {
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
        }`;
  if (!html.includes(needle)) {
    console.error("html lock anchor not found");
    process.exit(1);
  }
  html = html.replace(needle, ins);
  n++;
}

// --- 5) initMobileMenu accordion JS ---
if (!html.includes("closeAllGroups")) {
  const initIdx = html.indexOf("(function initMobileMenu() {");
  const endIife = html.indexOf("      })();", initIdx);
  if (initIdx < 0 || endIife < 0) {
    console.error("initMobileMenu not found");
    process.exit(1);
  }
  const newInit = `      (function initMobileMenu() {
        const button = document.getElementById("mobile-menu-button");
        const menu = document.getElementById("mobile-menu");
        const header = document.getElementById("site-header");
        const menuIcon = button && button.querySelector(".header-menu-icon");
        const mqMobile = window.matchMedia("(max-width: 719px)");
        if (!button || !menu) return;

        const groups = menu.querySelectorAll("[data-mobile-nav-group]");

        const closeAllGroups = () => {
          groups.forEach((group) => {
            group.classList.remove("is-open");
            const toggle = group.querySelector("[data-mobile-nav-toggle]");
            const panel = group.querySelector(".mobile-nav__panel");
            if (toggle) toggle.setAttribute("aria-expanded", "false");
            if (panel) panel.hidden = true;
          });
        };

        groups.forEach((group) => {
          const toggle = group.querySelector("[data-mobile-nav-toggle]");
          const panel = group.querySelector(".mobile-nav__panel");
          if (!toggle || !panel) return;
          toggle.addEventListener("click", () => {
            const wasOpen = group.classList.contains("is-open");
            closeAllGroups();
            if (!wasOpen) {
              group.classList.add("is-open");
              toggle.setAttribute("aria-expanded", "true");
              panel.hidden = false;
              try {
                menu.scrollTo({ top: 0, behavior: "smooth" });
              } catch (_) {
                menu.scrollTop = 0;
              }
            }
          });
        });

        const setOpen = (open) => {
          button.setAttribute("aria-expanded", String(open));
          button.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
          menu.classList.toggle("hidden", !open);
          menu.setAttribute("aria-hidden", open ? "false" : "true");
          if (menuIcon) {
            menuIcon.setAttribute("icon", open ? "solar:close-circle-linear" : "solar:hamburger-menu-linear");
          }
          if (!open) closeAllGroups();
          if (header && mqMobile.matches) {
            header.classList.toggle("is-mobile-menu-open", open);
          }
          document.documentElement.classList.toggle("is-mobile-menu-open", open && mqMobile.matches);
        };

        const isOpen = () => button.getAttribute("aria-expanded") === "true";
        button.addEventListener("click", () => setOpen(!isOpen()));

        menu.querySelectorAll("[data-mobile-menu-link]").forEach((el) => {
          el.addEventListener("click", () => setOpen(false));
        });

        document.addEventListener("click", (e) => {
          if (!isOpen()) return;
          const t = e.target;
          if (button.contains(t) || menu.contains(t)) return;
          setOpen(false);
        });

        document.addEventListener("keydown", (e) => {
          if (e.key !== "Escape") return;
          if (!isOpen()) return;
          setOpen(false);
          button.focus();
        });

        window.addEventListener("resize", () => {
          if (window.innerWidth >= 1024) setOpen(false);
          else if (!mqMobile.matches) {
            if (header) header.classList.remove("is-mobile-menu-open");
            document.documentElement.classList.remove("is-mobile-menu-open");
          }
        });
      })();`;
  html = html.slice(0, initIdx) + newInit + html.slice(endIife + "      })();".length);
  n++;
}

// --- 6) Services: keywords 200, Managed mobile, bottom padding ---
apply(
  `        /* 모바일: 서비스 카드 세부 서비스명(AICC·WIKL 등) 15px 레귤러 */
        #services .service-card-keywords {
          font-size: 15px !important;
          font-weight: 400 !important;
          line-height: 1.5;
        }
        #services .service-card-keywords > li {
          font-weight: 400;
        }`,
  `        /* 모바일: 서비스 카드 세부 서비스명(AICC·WIKL 등) 15px · 굵기 200 */
        #services .service-card-keywords {
          font-size: 15px !important;
          font-weight: 200 !important;
          line-height: 1.5;
        }
        #services .service-card-keywords > li {
          font-weight: 200 !important;
        }`,
  "services keywords"
);

if (!html.includes('hidden max-[719px]:inline">Managed</span>')) {
  apply(
    `                <div class="mt-3 text-3xl min-[1921px]:text-4xl 4xl:mt-2 4xl:text-[2.4375rem] 4xl:leading-[1.08] font-semibold tracking-tight 4xl:tracking-wide leading-snug text-black">Managed Services</div>`,
    `                <div class="mt-3 text-3xl min-[1921px]:text-4xl 4xl:mt-2 4xl:text-[2.4375rem] 4xl:leading-[1.08] font-semibold tracking-tight 4xl:tracking-wide leading-snug text-black"><span class="max-[719px]:hidden">Managed Services</span><span class="hidden max-[719px]:inline">Managed</span></div>`,
    "managed title"
  );
}

if (!html.includes("서비스 영역 하단 여백 +40px")) {
  const anchor = `        /* 모바일: 서비스소개 서브타이틀 — 다른 섹션 서브와 동일 16px */`;
  const block = `        /* 모바일: 서비스 영역 하단 여백 +40px (미디어룸 간격) */
        #services .snap-section-main {
          padding-bottom: calc(1.5rem + 40px) !important;
        }
`;
  if (!html.includes(anchor)) {
    console.error("services padding anchor");
    process.exit(1);
  }
  html = html.replace(anchor, block + anchor);
  n++;
}

// --- 7) Cases mobile ---
if (!html.includes("데이터가 성과가 되는순간, 비즈니스 혁신사례")) {
  apply(
    "                  데이터가 성과가 되는 순간, 숫자로 증명된 비즈니스 ROI 혁신 사례",
    '                  <span class="max-[719px]:hidden">데이터가 성과가 되는 순간, 숫자로 증명된 비즈니스 ROI 혁신 사례</span><span class="hidden max-[719px]:inline">데이터가 성과가 되는순간, 비즈니스 혁신사례</span>',
    "cases subtitle"
  );
}

if (!html.includes("해시태그 ↔ 롤링 카드 간격 -10")) {
  const anchor = `        /* 모바일: 고객성공사례 — 배경(globe-root) 제외 콘텐츠 20px 상향 */`;
  const block = `        /* 모바일: 고객성공사례 서브·태그·카드 간격 */
        #cases .snap-section-main {
          padding-top: calc(var(--section-title-offset) - 60px) !important;
        }
        #cases .reveal-up.mt-5:has(.case-tags) {
          margin-top: 0.5rem !important;
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

`;
  if (!html.includes(anchor)) {
    console.error("cases anchor");
    process.exit(1);
  }
  html = html.replace(anchor, block + anchor);
  n++;
}

// --- 8) Contact social hide mobile ---
if (!html.includes("문의하기 소셜 아이콘 숨김")) {
  const anchor = `        /* 모바일: 섹션 CTA 버튼 숨김 */`;
  const block = `        /* 모바일: 문의하기 소셜 아이콘 숨김 */
        #contact .contact-social-nav {
          display: none !important;
        }
`;
  if (!html.includes(anchor)) {
    console.error("contact social anchor");
    process.exit(1);
  }
  html = html.replace(anchor, block + anchor);
  n++;
}

// --- 9) Dock: both links black ---
if (html.includes(".mobile-bottom-dock__link:first-child {\n        color: #0b6dff;\n      }")) {
  html = html.replace(
    `      .mobile-bottom-dock__link:first-child {
        color: #0b6dff;
      }
      .mobile-bottom-dock__link + .mobile-bottom-dock__link {`,
    `      .mobile-bottom-dock__link + .mobile-bottom-dock__link {`
  );
  n++;
}

// --- 10) Contact-footer 2560+ ---
if (!html.includes("문의하기·푸터 한 화면")) {
  const anchor = `      #contact.snap-section-main {
        padding-top: calc(var(--section-title-offset) - 60px);
      }`;
  const block = `      #contact.snap-section-main {
        padding-top: calc(var(--section-title-offset) - 60px);
      }
      /* 2560px+: 문의하기·푸터 한 화면 — 보내기 하단 50px에 푸터 */
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
      }
`;
  if (!html.includes(anchor)) {
    console.error("contact-footer anchor");
    process.exit(1);
  }
  html = html.replace(anchor, block);
  n++;
}

// --- 11) Growth mobile typography ---
apply(
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

// --- 12) Growth web title +20% line-height 1.4 (re-apply if checkpoint reset) ---
const growthWebNeedle = `      #growth .growth-card-grid--4up .growth-card-title {
        font-size: clamp(1.125rem, 1.38vw, 1.35rem);
        line-height: 1.12;
        letter-spacing: -0.03em;
      }`;
const growthWebNew = `      #growth .growth-card-grid--4up .growth-card-title {
        /* 웹(720px+ 포함): 파란 서브 타이틀 약 20% 확대 */
        font-size: clamp(1.35rem, 1.656vw, 1.62rem);
        line-height: 1.4;
        letter-spacing: -0.03em;
      }`;
if (html.includes(growthWebNeedle)) {
  html = html.replace(growthWebNeedle, growthWebNew);
  n++;
}
const growthXlNeedle = `      @media (min-width: 1536px) {
        #growth .growth-card-grid--4up .growth-card-title {
          font-size: clamp(1.2rem, 1.26vw, 1.44rem);
        }
      }`;
const growthXlNew = `      @media (min-width: 1536px) {
        #growth .growth-card-grid--4up .growth-card-title {
          font-size: clamp(1.44rem, 1.512vw, 1.728rem);
          line-height: 1.4;
        }
      }`;
if (html.includes(growthXlNeedle)) {
  html = html.replace(growthXlNeedle, growthXlNew);
  n++;
}

if (!html.includes("엔터프라이즈 IT 파트너")) {
  console.error("UTF-8 corrupted");
  process.exit(1);
}

fs.writeFileSync(target, html, "utf8");
console.log(`OK: finalize-all (${n} changes)`);
