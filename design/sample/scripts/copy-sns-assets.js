/**
 * 시안2 → 시안1 SNS 아이콘 PNG 복사
 */
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "..", "시안2", "assets");
const DST = path.join(__dirname, "..", "assets");
const files = ["sns_naver.png", "sns_facebook.png", "sns_youtube.png", "sns_in.png"];

fs.mkdirSync(DST, { recursive: true });
for (const f of files) {
  const from = path.join(SRC, f);
  if (!fs.existsSync(from)) {
    console.error("missing:", from);
    process.exit(1);
  }
  fs.copyFileSync(from, path.join(DST, f));
}
console.log("OK: copy-sns-assets (" + files.length + " files)");
