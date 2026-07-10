const fs = require("fs");
const path = require("path");
const newMenuHtml = require("./_mobile-menu-accordion-html.js");

const target = path.join(__dirname, "index.html");
let html = fs.readFileSync(target, "utf8");

// 1) Replace mobile menu block in header
const menuStart = "        <!-- Mobile menu panel -->";
const menuEnd = "    </header>";
const startIdx = html.indexOf(menuStart);
const endIdx = html.indexOf(menuEnd, startIdx);
if (startIdx < 0 || endIdx < 0) {
  console.error("mobile menu block not found");
  process.exit(1);
}
html = html.slice(0, startIdx) + newMenuHtml + "\n" + html.slice(endIdx);

// 2) Ensure mobile menu full panel base CSS exists (white, fixed)
const cssMarker = "/* 모바일 햄버거 메뉴: 풀화면 화이트 · 아코디언 */";
if (!html.includes(cssMarker)) {
  const cssAnchor = "      /* 모바일(≤719px): 컴팩트 탑네비 · 미디어룸 상단 여백 · 하단 고정 CTA */";
  if (!html.includes(cssAnchor)) {
    console.error("mobile css anchor not found");
    process.exit(1);
  }
  const cssBlock = `\n\n        ${cssMarker}\n        #site-header.is-mobile-menu-open {\n          background-color: transparent !important;\n          border-bottom-color: transparent !important;\n          overflow: visible !important;\n        }\n        #site-header.is-mobile-menu-open > .site-container {\n          position: relative;\n          z-index: 101;\n          background-color: #ffffff;\n        }\n        #site-header.is-mobile-menu-open .header-logo-img--mono {\n          opacity: 0;\n          pointer-events: none;\n        }\n        #site-header.is-mobile-menu-open .header-logo-img--color {\n          opacity: 1;\n          pointer-events: auto;\n        }\n        #site-header.is-mobile-menu-open .header-menu-icon,\n        #site-header.is-mobile-menu-open .header-toolbar-icon {\n          color: rgba(17, 26, 51, 0.92);\n        }\n        #mobile-menu {\n          border-top-color: rgba(15, 23, 42, 0.08);\n          background-color: #ffffff;\n        }\n        #mobile-menu:not(.hidden) {\n          position: fixed;\n          top: var(--nav-height);\n          left: 0;\n          right: 0;\n          bottom: 0;\n          z-index: 100;\n          display: block !important;\n          overflow-x: hidden;\n          overflow-y: auto;\n          -webkit-overflow-scrolling: touch;\n          background-color: #ffffff !important;\n          border-top: 1px solid rgba(15, 23, 42, 0.08);\n          padding-bottom: calc(1.75rem + env(safe-area-inset-bottom, 0px));\n        }\n        #mobile-menu:not(.hidden) .site-container,\n        #mobile-menu:not(.hidden) .mobile-menu-inner,\n        #mobile-menu:not(.hidden) .mobile-nav {\n          background-color: #ffffff;\n        }\n        #mobile-menu .mobile-menu-inner {\n          margin-top: 0;\n          border: none;\n          border-radius: 0;\n          background: #ffffff;\n          overflow: visible;\n          max-height: none;\n        }\n        .mobile-nav { padding: 0.15rem 0 0.5rem; }\n        .mobile-nav__group { border-bottom: 0; }\n        .mobile-nav__lv1 {\n          display: flex;\n          width: 100%;\n          align-items: center;\n          justify-content: space-between;\n          gap: 0.75rem;\n          min-height: 3.25rem;\n          padding: 0.85rem 0.25rem;\n          border: 0;\n          background: #ffffff;\n          text-align: left;\n          font-size: 1.0625rem;\n          font-weight: 600;\n          letter-spacing: -0.02em;\n          line-height: 1.3;\n          color: rgba(17, 26, 51, 0.88);\n          cursor: pointer;\n          -webkit-tap-highlight-color: transparent;\n        }\n        .mobile-nav__lv1-label {\n          position: relative;\n          display: inline-block;\n          padding-bottom: 0.3rem;\n        }\n        .mobile-nav__group.is-open .mobile-nav__lv1-label::after {\n          content: \"\";\n          position: absolute;\n          left: 0;\n          right: 0;\n          bottom: 0;\n          height: 2px;\n          background: #0b6dff;\n          border-radius: 9999px;\n        }\n        .mobile-nav__group.is-open .mobile-nav__lv1 { color: #0b6dff; }\n        .mobile-nav__chevron {\n          flex-shrink: 0;\n          width: 1.125rem;\n          height: 1.125rem;\n          color: rgba(17, 26, 51, 0.28);\n          transition: transform 0.22s ease, color 0.2s ease;\n        }\n        .mobile-nav__group.is-open .mobile-nav__chevron {\n          transform: rotate(180deg);\n          color: #0b6dff;\n        }\n        .mobile-nav__panel { padding: 0 0 0.65rem; background: #ffffff; }\n        .mobile-nav__section { padding: 0.35rem 0 0.15rem; }\n        .mobile-nav__section + .mobile-nav__section { margin-top: 0.35rem; padding-top: 0.55rem; border-top: 0; }\n        .mobile-nav__lv2 {\n          padding: 0.35rem 0.25rem 0.45rem;\n          font-size: 0.8125rem;\n          font-weight: 600;\n          letter-spacing: 0.04em;\n          line-height: 1.3;\n          color: #0b6dff;\n        }\n        .mobile-nav__lv3 { margin: 0; padding: 0; list-style: none; }\n        .mobile-nav__lv3 li { border-top: 0; }\n        .mobile-nav__lv3 a {\n          display: block;\n          padding: 0.72rem 0.25rem;\n          font-size: 0.875rem;\n          font-weight: 400;\n          line-height: 1.45;\n          letter-spacing: -0.02em;\n          color: rgba(17, 26, 51, 0.72);\n          text-decoration: none;\n        }\n        .mobile-nav__sep { margin: 0 0.35rem; color: rgba(17, 26, 51, 0.22); font-weight: 300; }\n`;
  html = html.replace(cssAnchor, cssBlock + cssAnchor);
}

// 3) Patch initMobileMenu to accordion behavior + scroll reset to top on open group
const initNeedle = "(function initMobileMenu() {";
const initIdx = html.indexOf(initNeedle);
if (initIdx < 0) {
  console.error("initMobileMenu not found");
  process.exit(1);
}

if (!html.includes("closeAllGroups") || !html.includes("data-mobile-nav-group")) {
  // Replace the whole initMobileMenu IIFE block by locating ending '})();' after it
  const endIife = html.indexOf("      })();", initIdx);
  if (endIife < 0) {
    console.error("initMobileMenu end not found");
    process.exit(1);
  }
  const before = html.slice(0, initIdx);
  const after = html.slice(endIife + "      })();".length);
  const newInit = `      (function initMobileMenu() {\n        const button = document.getElementById(\"mobile-menu-button\");\n        const menu = document.getElementById(\"mobile-menu\");\n        const header = document.getElementById(\"site-header\");\n        const menuIcon = button && button.querySelector(\".header-menu-icon\");\n        const mqMobile = window.matchMedia(\"(max-width: 719px)\");\n        if (!button || !menu) return;\n\n        const groups = menu.querySelectorAll(\"[data-mobile-nav-group]\");\n\n        const closeAllGroups = () => {\n          groups.forEach((group) => {\n            group.classList.remove(\"is-open\");\n            const toggle = group.querySelector(\"[data-mobile-nav-toggle]\");\n            const panel = group.querySelector(\".mobile-nav__panel\");\n            if (toggle) toggle.setAttribute(\"aria-expanded\", \"false\");\n            if (panel) panel.hidden = true;\n          });\n        };\n\n        groups.forEach((group) => {\n          const toggle = group.querySelector(\"[data-mobile-nav-toggle]\");\n          const panel = group.querySelector(\".mobile-nav__panel\");\n          if (!toggle || !panel) return;\n          toggle.addEventListener(\"click\", () => {\n            const wasOpen = group.classList.contains(\"is-open\");\n            closeAllGroups();\n            if (!wasOpen) {\n              group.classList.add(\"is-open\");\n              toggle.setAttribute(\"aria-expanded\", \"true\");\n              panel.hidden = false;\n              try {\n                menu.scrollTo({ top: 0, behavior: \"smooth\" });\n              } catch (_) {\n                menu.scrollTop = 0;\n              }\n            }\n          });\n        });\n\n        const setOpen = (open) => {\n          button.setAttribute(\"aria-expanded\", String(open));\n          button.setAttribute(\"aria-label\", open ? \"메뉴 닫기\" : \"메뉴 열기\");\n          menu.classList.toggle(\"hidden\", !open);\n          menu.setAttribute(\"aria-hidden\", open ? \"false\" : \"true\");\n          if (menuIcon) {\n            menuIcon.setAttribute(\"icon\", open ? \"solar:close-circle-linear\" : \"solar:hamburger-menu-linear\");\n          }\n          if (!open) closeAllGroups();\n          if (header && mqMobile.matches) {\n            header.classList.toggle(\"is-mobile-menu-open\", open);\n          }\n          document.documentElement.classList.toggle(\"is-mobile-menu-open\", open && mqMobile.matches);\n        };\n\n        const isOpen = () => button.getAttribute(\"aria-expanded\") === \"true\";\n        button.addEventListener(\"click\", () => setOpen(!isOpen()));\n\n        menu.querySelectorAll(\"[data-mobile-menu-link]\").forEach((el) => {\n          el.addEventListener(\"click\", () => setOpen(false));\n        });\n\n        document.addEventListener(\"click\", (e) => {\n          if (!isOpen()) return;\n          const t = e.target;\n          if (button.contains(t) || menu.contains(t)) return;\n          setOpen(false);\n        });\n\n        document.addEventListener(\"keydown\", (e) => {\n          if (e.key !== \"Escape\") return;\n          if (!isOpen()) return;\n          setOpen(false);\n          button.focus();\n        });\n\n        window.addEventListener(\"resize\", () => {\n          if (window.innerWidth >= 1024) setOpen(false);\n          else if (!mqMobile.matches) {\n            if (header) header.classList.remove(\"is-mobile-menu-open\");\n            document.documentElement.classList.remove(\"is-mobile-menu-open\");\n          }\n        });\n      })();\n`;
  html = before + newInit + after;
}

if (!html.includes("엔터프라이즈 IT 파트너")) {
  console.error("UTF-8 corrupted");
  process.exit(1);
}

fs.writeFileSync(target, html, "utf8");
console.log("OK: mobile menu rebuilt (accordion + underline)");

