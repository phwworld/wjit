/**
 * iPad Mini 세로 768px · iPad Air 세로 820px 만 모바일(≤719) 레이아웃 동일
 */
const fs = require("fs");
const path = require("path");
const { MQ_MOBILE, MQ_MOBILE_AT, MQ_DESKTOP_720_AT } = require("./breakpoints");

const ROOT = path.join(__dirname, "..");
const CSS = path.join(ROOT, "css", "site.css");
const JS = path.join(ROOT, "js", "site.js");

const MQ_OLD_MOBILE =
  /@media \(max-width: 719px\), \(\(min-width: 720px\) and \(max-width: 820px\) and \(orientation: portrait\)\)/g;
const MQ_OLD_DESKTOP =
  /@media \(min-width: 720px\) and \(not \(\(max-width: 820px\) and \(orientation: portrait\)\)\)/g;

const MQ_OLD_JS =
  /\(max-width: 719px\), \(\(min-width: 720px\) and \(max-width: 820px\) and \(orientation: portrait\)\)/g;

let css = fs.readFileSync(CSS, "utf8");
let js = fs.readFileSync(JS, "utf8");

css = css.replace(MQ_OLD_MOBILE, MQ_MOBILE_AT);
css = css.replace(MQ_OLD_DESKTOP, MQ_DESKTOP_720_AT);

js = js.replace(MQ_OLD_JS, MQ_MOBILE);

css = css.replace(
  /\/\* iPad Air 세로\(820\): md\(768\+\) 전용 UI → 모바일과 동일 \*\//,
  "/* iPad Mini·Air 세로(768/820px만): md(768+) 전용 UI → 모바일과 동일 */"
);

if (!css.includes("width: 768px") || !js.includes("width: 768px")) {
  console.error("FAIL: exact ipad widths not applied");
  process.exit(1);
}

fs.writeFileSync(CSS, css, "utf8");
fs.writeFileSync(JS, js, "utf8");
console.log("OK: patch-ipad-portrait-mobile (768 + 820 only)");
