/**
 * patch-a11y 오적용으로 잘린 site.js 복구 (백업 HTML script 라인 추출)
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SITE_JS = path.join(ROOT, "js", "site.js");
const BACKUP = path.join(ROOT, "index.corrupted-backup.html");

const backupLines = fs.readFileSync(BACKUP, "utf8").split(/\r?\n/);
// 1-based line 3667..4343 inclusive
let middle = backupLines.slice(3666, 4343).join("\n");

middle = middle.replace(
  /toast\.textContent\s*=[\s\S]*?;/,
  `toast.textContent =
          "접수되었습니다. (시안) 실제 연동 시 메일/CRM 연동으로 대체됩니다. 개인정보는 문의 처리 목적으로만 사용됩니다.";`
);

const initMobileMenu = `      (function initMobileMenu() {
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

        const getMenuFocusables = () =>
          Array.from(
            menu.querySelectorAll(
              'a[href]:not([aria-disabled="true"]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
          ).filter((el) => el.offsetParent !== null && !el.closest("[hidden]"));

        const trapMenuFocus = (e) => {
          if (e.key !== "Tab" || !isOpen()) return;
          const items = getMenuFocusables();
          if (!items.length) return;
          const first = items[0];
          const last = items[items.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        };
        menu.addEventListener("keydown", trapMenuFocus);

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
          if (open) {
            const items = getMenuFocusables();
            if (items[0]) items[0].focus();
          } else {
            button.focus();
          }
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
      })();

`;

middle = middle.replace(
  /\(function initMobileMenu\(\) \{[\s\S]*?\}\)\(\);\s*/,
  initMobileMenu
);

const siteJs = fs.readFileSync(SITE_JS, "utf8");
const brokenStart = siteJs.indexOf("(function initFooterFamilyDropdown() {");
const gnbStart = siteJs.indexOf("(function initGnbMegaSheetHeightSync() {");
if (brokenStart < 0 || gnbStart < 0) {
  console.error("repair anchors missing in site.js");
  process.exit(1);
}

const fixed = siteJs.slice(0, brokenStart) + middle + "\n" + siteJs.slice(gnbStart);
fs.writeFileSync(SITE_JS, fixed, "utf8");

const checks = [
  "__handleContactSubmit",
  "initHeroBackgroundVideo",
  "initSectionQuickNav",
  "initMobileMenu",
  "closeAllGroups",
];
const missing = checks.filter((c) => !fixed.includes(c));
if (missing.length) {
  console.error("FAIL: still missing:", missing.join(", "));
  process.exit(1);
}
console.log("OK: repair-site-js (" + fixed.split("\n").length + " lines)");
