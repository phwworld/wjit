const fs = require("fs");
const path = require("path");

const htmlPath = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(htmlPath, "utf8");

const marker = `<source src="./assets/heor2.webm" type="video/webm" />
            </video>
          </div>`;

const insert = `<source src="./assets/heor2.webm" type="video/webm" />
            </video>
            <video
              id="hero-video-3"
              class="hero-video-layer h-full min-h-[100dvh] w-full object-cover opacity-55"
              data-hero-video="2"
              muted
              playsinline
              preload="auto"
              aria-hidden="true"
            >
              <source src="./assets/hero3.webm" type="video/webm" />
            </video>
          </div>`;

if (!html.includes(marker)) {
  console.error("FAIL: hero-video-2 end marker not found");
  process.exit(1);
}
if (html.includes('id="hero-video-3"')) {
  console.log("SKIP: hero-video-3 already present");
  process.exit(0);
}

html = html.replace(marker, insert);
fs.writeFileSync(htmlPath, html, "utf8");
console.log("OK: hero-video-3 added to index.html");
