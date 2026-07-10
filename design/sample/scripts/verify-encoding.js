/**
 * UTF-8 / 한글 깨짐 검사 (CI·수정 전 실행)
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const files = [
  path.join(ROOT, "index.html"),
  path.join(ROOT, "css", "site.css"),
  path.join(ROOT, "js", "site.js"),
].filter((f) => fs.existsSync(f));

let failed = false;

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const rel = path.relative(ROOT, file);

  if (text.includes("???")) {
    console.error(`FAIL ${rel}: contains "???" (likely encoding corruption)`);
    failed = true;
  }
  if (file.endsWith(".html") && !text.includes("엔터프라이즈 IT 파트너")) {
    console.error(`FAIL ${rel}: missing expected Korean title phrase`);
    failed = true;
  }
  if (file.endsWith(".css") && text.length > 100 && !text.includes("모바일")) {
    console.warn(`WARN ${rel}: expected Korean CSS comments may be missing`);
  }
  if (file.endsWith(".html") && !text.includes('charset="UTF-8"') && !text.includes("charset=UTF-8")) {
    console.warn(`WARN ${rel}: no UTF-8 charset meta`);
  }
}

if (failed) process.exit(1);
console.log("OK: encoding check passed (" + files.length + " files)");
