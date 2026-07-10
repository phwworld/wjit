const fs = require("fs");
const path = require("path");

const htmlPath = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(htmlPath, "utf8");
const before = html;

const copyBlock = `              <div id="hero-copy" class="hero-copy">
              <h1
                class="hero-main-headline mt-0 flex flex-col items-center gap-[9px] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 3xl:text-[4rem] 4xl:text-[5.4rem] font-semibold tracking-tight 3xl:tracking-[-0.02em] 4xl:tracking-[-0.018em] leading-[calc(1em+8px)] xl:leading-[calc(1em+9px)] 3xl:leading-[1.05] 4xl:leading-[1.055] 3xl:gap-2 4xl:gap-2.5"
                id="hero-headline"
              >
                <span class="hero-title-line block w-full">
                  <span class="hero-title-line__in block font-bold 3xl:whitespace-nowrap">클라우드에서 AI까지</span>
                </span>
                <span class="hero-title-line hero-title-line--delay block w-full">
                  <span
                    class="hero-title-line__in block font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-100 via-brand-400 to-white 3xl:whitespace-nowrap"
                    >기업의 내일을 설계하다</span
                  >
                </span>
              </h1>

              <p
                id="hero-subline"
                class="hero-copy-desc mt-5 max-w-2xl mx-auto text-base sm:text-lg xl:text-xl 3xl:text-2xl 4xl:text-[2.1rem] 4xl:leading-relaxed font-light leading-snug text-white xl:max-w-3xl 3xl:max-w-4xl 4xl:max-w-5xl 4xl:mt-8"
              >
                <span class="hero-subline-oneline">클라우드 전환 · 데이터/AI 플랫폼 · 보안 강화 · 운영 자동화까지</span>
                <span class="hero-subline-twoline"
                  >클라우드 전환 · 데이터/AI 플랫폼 ·<br />보안 강화 · 운영 자동화까지</span
                >
              </p>

              <div
                id="hero-cta-row"
                class="hero-cta-row mt-7 flex flex-col sm:flex-row gap-3 justify-center 3xl:mt-9 3xl:gap-4 4xl:mt-14 4xl:gap-5"
              >
                <a
                  href="#services"
                  class="hero-cta-primary focus-ring inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold bg-white text-ink-950 hover:bg-white/90 3xl:px-8 3xl:py-3.5 3xl:text-lg 4xl:px-10 4xl:py-4 4xl:text-[1.5rem] 4xl:gap-2.5"
                >
                  핵심 서비스 보기
                </a>
                <a
                  href="#cases"
                  class="hero-cta-cases focus-ring inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold bg-white/6 hover:bg-white/10 border border-white/10 3xl:px-8 3xl:py-3.5 3xl:text-lg 4xl:px-10 4xl:py-4 4xl:text-[1.5rem] 4xl:gap-2.5"
                >
                  고객성공사례
                </a>
              </div>
              </div>`;

const oldCopy = /              <h1\r?\n                class="hero-main-headline[\s\S]*?              <\/div>\r?\n              <\/div>\r?\n            <\/div>\r?\n          <\/div>\r?\n        <\/div>\r?\n      <\/section>/;

const navBlock = `        <nav
          id="hero-video-nav"
          class="hero-video-nav"
          aria-label="히어로 배너 진행"
        >
          <div class="hero-video-nav__segments" id="hero-video-nav-segments" role="tablist"></div>
        </nav>
      </section>`;

if (!oldCopy.test(html)) {
  console.error("FAIL: hero copy block not found");
  process.exit(1);
}

html = html.replace(oldCopy, `${copyBlock}
              </div>
            </div>
          </div>
        </div>
${navBlock}`);

if (html === before) {
  console.error("FAIL: no changes");
  process.exit(1);
}

fs.writeFileSync(htmlPath, html, "utf8");
console.log("OK: hero nav and copy wrapper added");
