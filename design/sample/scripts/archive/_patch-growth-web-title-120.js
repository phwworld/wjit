const fs = require("fs");
const path = require("path");

const target = path.join(__dirname, "index.html");
let html = fs.readFileSync(target, "utf8");

const baseNeedle = `      #growth .growth-card-grid--4up .growth-card-title {\n        font-size: clamp(1.125rem, 1.38vw, 1.35rem);\n        line-height: 1.12;\n        letter-spacing: -0.03em;\n      }`;

const baseReplacement = `      #growth .growth-card-grid--4up .growth-card-title {\n        /* 웹(720px+ 포함): 파란 서브 타이틀 약 20% 확대 */\n        font-size: clamp(1.35rem, 1.656vw, 1.62rem);\n        line-height: 1.4;\n        letter-spacing: -0.03em;\n      }`;

const xlNeedle = `      @media (min-width: 1536px) {\n        #growth .growth-card-grid--4up .growth-card-title {\n          font-size: clamp(1.2rem, 1.26vw, 1.44rem);\n        }\n      }`;

const xlReplacement = `      @media (min-width: 1536px) {\n        #growth .growth-card-grid--4up .growth-card-title {\n          font-size: clamp(1.44rem, 1.512vw, 1.728rem);\n          line-height: 1.4;\n        }\n      }`;

let changed = 0;

if (html.includes(baseNeedle)) {
  html = html.replace(baseNeedle, baseReplacement);
  changed++;
} else if (!html.includes("파란 서브 타이틀 약 20% 확대")) {
  console.error("base growth-card-title block not found");
  process.exit(1);
}

if (html.includes(xlNeedle)) {
  html = html.replace(xlNeedle, xlReplacement);
  changed++;
}

if (!html.includes("엔터프라이즈 IT 파트너")) {
  console.error("UTF-8 corrupted");
  process.exit(1);
}

fs.writeFileSync(target, html, "utf8");
console.log(`OK: growth web title +20% (${changed} blocks)`);
