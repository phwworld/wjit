const fs = require("fs");
const path = require("path");

const htmlPath = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(htmlPath, "utf8");

const rootBlock = `        <div id="cases-globe-root" class="cases-globe-root" aria-hidden="true">
          <div id="cases-globe-network-wrap" class="cases-globe-wrap cases-globe-wrap--lg">
            <canvas id="cases-globe-network-canvas" width="1536" height="1280"></canvas>
          </div>
        </div>
        `;

const smBlock = `          <!-- 소형(②): site-container와 동일 z-2·DOM상 뒤에 두어 타이틀 위에 보임(안에 z0이면 글자에 전부 가려짐). 카드 레일 z3보다 아래. -->
          <div
            id="cases-globe-network-wrap-sm"
            class="cases-globe-network-wrap-sm cases-globe-wrap cases-globe-wrap--sm pointer-events-none z-[2]"
            aria-hidden="true"
          >
            <canvas id="cases-globe-network-canvas-sm" width="780" height="720"></canvas>
          </div>

          `;

if (!html.includes("cases-globe-root")) {
  console.log("SKIP: cases globe already removed");
  process.exit(0);
}

html = html.replace(rootBlock, "");
html = html.replace(smBlock, "");

fs.writeFileSync(htmlPath, html, "utf8");
console.log("OK: cases globe HTML removed");
