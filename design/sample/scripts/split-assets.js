/**
 * index.html 인라인 CSS/JS → css/site.css, js/site.js 분리
 * 한글 깨짐 방지: UTF-8 read/write only
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const INDEX = path.join(ROOT, "index.html");
const CSS_OUT = path.join(ROOT, "css", "site.css");
const JS_OUT = path.join(ROOT, "js", "site.js");

const html = fs.readFileSync(INDEX, "utf8");

const styleOpen = html.indexOf("<style>");
const styleClose = html.indexOf("</style>");
const scriptOpen = html.lastIndexOf("<script>");
const scriptClose = html.lastIndexOf("</script>");

if (styleOpen < 0 || styleClose < 0 || scriptOpen < 0 || scriptClose < 0) {
  console.error("Could not find <style> or bottom <script> blocks");
  process.exit(1);
}

const css = html.slice(styleOpen + "<style>".length, styleClose).trim();
const js = html.slice(scriptOpen + "<script>".length, scriptClose).trim();

fs.mkdirSync(path.dirname(CSS_OUT), { recursive: true });
fs.mkdirSync(path.dirname(JS_OUT), { recursive: true });
fs.writeFileSync(CSS_OUT, css + "\n", "utf8");
fs.writeFileSync(JS_OUT, js + "\n", "utf8");

const beforeStyle = html.slice(0, styleOpen);
const afterStyle = html.slice(styleClose + "</style>".length);
const scriptBlock = afterStyle.slice(afterStyle.lastIndexOf("<script>"));
const beforeScript = afterStyle.slice(0, afterStyle.lastIndexOf("<script>"));

const newHtml =
  beforeStyle +
  '    <link rel="stylesheet" href="./css/site.css" />\n' +
  beforeScript +
  '    <script src="./js/site.js" defer></script>\n' +
  afterStyle.slice(scriptClose + "</script>".length);

fs.writeFileSync(INDEX, newHtml, "utf8");

console.log("OK: split-assets");
console.log("  css/site.css:", css.split("\n").length, "lines");
console.log("  js/site.js:", js.split("\n").length, "lines");
console.log("  index.html:", newHtml.split("\n").length, "lines");
