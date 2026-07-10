const fs = require("fs");
const path = require("path");

const base = path.join(__dirname, "..");
const index = fs.readFileSync(path.join(base, "index.html"), "utf8");
const subTargets = ["sub.html", "sub_1.html"];

const startMark = "    <!-- Top nav:";
const endMark = "    <!-- 섹션 퀵메뉴";
const startIdx = index.indexOf(startMark);
const endIdx = index.indexOf(endMark);
if (startIdx === -1 || endIdx === -1) {
  console.error("index markers not found", { startIdx, endIdx });
  process.exit(1);
}

let nav = index.slice(startIdx, endIdx).trimEnd();

const anchors = ["hero", "services", "cases", "contact", "capabilities", "media", "insights"];
for (const id of anchors) {
  nav = nav.split(`href="#${id}"`).join(`href="./index.html#${id}"`);
}

nav = nav.replace(
  /class="site-header fixed top-0 left-0 right-0 z-\[100\] w-full border-b border-transparent bg-transparent"/,
  'class="site-header is-solid fixed top-0 left-0 right-0 z-[100] w-full border-b border-transparent bg-transparent"'
);

nav = nav.replace(
  /href="#hero"/,
  'href="./index.html#hero"'
);

const subStartMark = "<header id=\"site-header\"";
const subEndMark = "  <main id=\"content\">";

for (const file of subTargets) {
  const subPath = path.join(base, file);
  let sub = fs.readFileSync(subPath, "utf8");
  const subStartIdx = sub.indexOf(subStartMark);
  const subEndIdx = sub.indexOf(subEndMark);
  if (subStartIdx === -1 || subEndIdx === -1) {
    console.error(`${file} markers not found`, { subStartIdx, subEndIdx });
    process.exit(1);
  }

  sub = sub.slice(0, subStartIdx) + nav + "\n\n" + sub.slice(subEndIdx);
  fs.writeFileSync(subPath, sub, "utf8");
  console.log(`synced ${file} header from index.html`);
}
