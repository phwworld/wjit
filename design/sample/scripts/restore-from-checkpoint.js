const fs = require("fs");
const path = require("path");

// Cursor checkpoint restore (UTF-8 safe)
const checkpoint = path.join(
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

const target = path.join(__dirname, "..", "index.html");

if (!fs.existsSync(checkpoint)) {
  throw new Error("checkpoint missing: " + checkpoint);
}

const html = fs.readFileSync(checkpoint, "utf8");
if (!html.includes("엔터프라이즈 IT 파트너")) {
  throw new Error("checkpoint korean invalid");
}

fs.writeFileSync(target, html, "utf8");
console.log("restored from cac6fb83 checkpoint");
