/**
 * iPad Pro 세로 1024px → Mini/Air와 동일 모바일 레이아웃
 */
const fs = require("fs");
const path = require("path");
const {
  MQ_MOBILE,
  MQ_PAD_PORTRAIT,
  MQ_IPAD_PRO_PORTRAIT,
  MQ_DESKTOP_720_EXCL_PAD,
} = require("./breakpoints");

const ROOT = path.join(__dirname, "..");
const CSS = path.join(ROOT, "css", "site.css");
const JS = path.join(ROOT, "js", "site.js");

const PAD_TAIL =
  "((width: 768px) and (orientation: portrait)), ((width: 820px) and (orientation: portrait))";
const PAD_TAIL_NEW = MQ_PAD_PORTRAIT; /* already includes (( )) per width */

const DESKTOP_EXCL_OLD =
  "and (not ((width: 768px) and (orientation: portrait))) and (not ((width: 820px) and (orientation: portrait)))";
const DESKTOP_EXCL_NEW = DESKTOP_EXCL_OLD.replace(
  /and \(not \(\(width: 820px\) and \(orientation: portrait\)\)\)$/,
  `and (not ((width: 820px) and (orientation: portrait))) and (not (${MQ_IPAD_PRO_PORTRAIT}))`
);

const MQ_JS_OLD =
  "(max-width: 719px), ((width: 768px) and (orientation: portrait)), ((width: 820px) and (orientation: portrait))";

let css = fs.readFileSync(CSS, "utf8");
let js = fs.readFileSync(JS, "utf8");

if (!css.includes(PAD_TAIL) && css.includes(PAD_TAIL_NEW)) {
  console.log("OK: site.css already has iPad Pro portrait MQ");
} else if (css.includes(PAD_TAIL)) {
  css = css.split(PAD_TAIL).join(PAD_TAIL_NEW);
} else {
  console.error("FAIL: pad portrait MQ anchor not found in site.css");
  process.exit(1);
}

if (css.includes(DESKTOP_EXCL_OLD) && !css.includes(MQ_IPAD_PRO_PORTRAIT)) {
  css = css.split(DESKTOP_EXCL_OLD).join(DESKTOP_EXCL_NEW);
}

const hero820 = `        ((width: 820px) and (orientation: portrait)) {`;
const hero820New = `        ((width: 820px) and (orientation: portrait)),
        ((width: 1024px) and (orientation: portrait)) {`;
if (css.includes(hero820) && !css.includes(hero820New)) {
  css = css.replace(hero820, hero820New);
}

const headerMqOld = `@media (max-width: 1023px) {
        #site-header .site-container > .grid > .justify-self-end {`;
const headerMqNew = `@media (max-width: 1023px),
        ((width: 1024px) and (orientation: portrait)) {
        #site-header .site-container > .grid > .justify-self-end {`;
if (css.includes(headerMqOld) && !css.includes(headerMqNew)) {
  css = css.replace(headerMqOld, headerMqNew);
}

const proLgBlock = `      /* iPad Pro 세로 1024: lg(1024+) 무력화 — GNB 숨김 · 햄버거 표시 */
      @media ${MQ_IPAD_PRO_PORTRAIT} {
        #site-header .gnb-mega {
          display: none !important;
        }
        #site-header #mobile-menu-button {
          display: inline-flex !important;
        }
        #mobile-menu:not(.hidden) {
          display: block !important;
        }
      }

`;

if (!css.includes("iPad Pro 세로 1024: lg")) {
  css = css.replace(
    "      /* lg 미만: GNB display:none 시 툴바가 2열에 배치되어 빈 3열+grid gap으로 우측 여백 발생 */",
    proLgBlock + "      /* lg 미만: GNB display:none 시 툴바가 2열에 배치되어 빈 3열+grid gap으로 우측 여백 발생 */"
  );
}

css = css.replace(/iPad Mini 세로 768px · iPad Air 세로 820px/g, "iPad Mini/Air/Pro 세로 768·820·1024px");
css = css.replace(/iPad Mini·Air 세로/g, "iPad Mini/Air/Pro 세로");

js = js.split(MQ_JS_OLD).join(MQ_MOBILE);

if (!js.includes(MQ_IPAD_PRO_PORTRAIT)) {
  console.error("FAIL: site.js MQ not updated");
  process.exit(1);
}

fs.writeFileSync(CSS, css, "utf8");
fs.writeFileSync(JS, js, "utf8");
console.log("OK: patch-ipad-pro-portrait (768 + 820 + 1024)");
