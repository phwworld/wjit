/**
 * iPad Mini/Air 세로(768·820): 미디어룸 3열×2행(6카드)
 */
const fs = require("fs");
const path = require("path");
const { MQ_PAD_PORTRAIT } = require("./breakpoints");

const ROOT = path.join(__dirname, "..");
const INDEX = path.join(ROOT, "index.html");
const CSS = path.join(ROOT, "css", "site.css");

const MQ_PAD = MQ_PAD_PORTRAIT;

let html = fs.readFileSync(INDEX, "utf8");
let css = fs.readFileSync(CSS, "utf8");

html = html.replace(
  'class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3 xl:gap-6 3xl:gap-7"',
  'class="media-room-grid mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3 xl:gap-6 3xl:gap-7"'
);

const extraCards = `
            <a
              class="media-room-card media-room-card--pad-row2 reveal-up group relative flex flex-col overflow-hidden rounded-3xl focus-ring outline-none"
              href="#"
              data-empty-link
              aria-disabled="true" tabindex="-1"
              aria-label="이벤트: 웅진 IT 인사이트 데이"
            >
              <div class="media-thumb-wrap relative aspect-[16/10] w-full min-h-[10rem] shrink-0 overflow-hidden bg-neutral-200">
                <img
                  class="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                  src="./assets/미디어룸1.png"
                  alt=""
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-b from-black/15 via-black/20 to-black/70"></div>
                <div class="absolute left-4 top-4">
                  <span class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs text-white/90">
                    <span class="h-1.5 w-1.5 rounded-full bg-brand-300"></span>이벤트
                  </span>
                </div>
              </div>
              <div class="flex flex-1 flex-col px-6 py-[2.75rem] sm:px-7 sm:py-[3rem] 3xl:px-8 3xl:py-[3.25rem]">
                <div
                  class="media-card-title media-card-title--room text-base font-semibold leading-snug 4xl:leading-[1.46] text-[#111A33] sm:text-[1.2rem] xl:text-2xl 3xl:text-[1.8rem] 4xl:text-[2rem]"
                >
                  웅진 IT, AI·클라우드 인사이트 데이 개최
                </div>
                <div class="mt-3 text-[13px] 3xl:text-sm text-[#111A33]/55">2026.03.12</div>
              </div>
            </a>

            <a
              class="media-room-card media-room-card--pad-row2 reveal-up group relative flex flex-col overflow-hidden rounded-3xl focus-ring outline-none"
              href="#"
              data-empty-link
              aria-disabled="true" tabindex="-1"
              aria-label="공지: 웅진 IT 고객 포털 오픈"
            >
              <div class="media-thumb-wrap relative aspect-[16/10] w-full min-h-[10rem] shrink-0 overflow-hidden bg-neutral-200">
                <img
                  class="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                  src="./assets/미디어룸2.png"
                  alt=""
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-b from-black/15 via-black/20 to-black/70"></div>
                <div class="absolute left-4 top-4">
                  <span class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs text-white/90">
                    <span class="h-1.5 w-1.5 rounded-full bg-brand-300"></span>공지
                  </span>
                </div>
              </div>
              <div class="flex flex-1 flex-col px-6 py-[2.75rem] sm:px-7 sm:py-[3rem] 3xl:px-8 3xl:py-[3.25rem]">
                <div
                  class="media-card-title media-card-title--room text-base font-semibold leading-snug 4xl:leading-[1.46] text-[#111A33] sm:text-[1.2rem] xl:text-2xl 3xl:text-[1.8rem] 4xl:text-[2rem]"
                >
                  웅진 IT 고객 포털 정식 오픈 안내
                </div>
                <div class="mt-3 text-[13px] 3xl:text-sm text-[#111A33]/55">2026.03.05</div>
              </div>
            </a>

            <a
              class="media-room-card media-room-card--pad-row2 reveal-up group relative flex flex-col overflow-hidden rounded-3xl focus-ring outline-none"
              href="#"
              data-empty-link
              aria-disabled="true" tabindex="-1"
              aria-label="블로그: 엔터프라이즈 AI 도입 가이드"
            >
              <div class="media-thumb-wrap relative aspect-[16/10] w-full min-h-[10rem] shrink-0 overflow-hidden bg-neutral-200">
                <img
                  class="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                  src="./assets/미디어룸3.jpg"
                  alt=""
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-b from-black/15 via-black/20 to-black/70"></div>
                <div class="absolute left-4 top-4">
                  <span class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs text-white/90">
                    <span class="h-1.5 w-1.5 rounded-full bg-brand-300"></span>블로그
                  </span>
                </div>
              </div>
              <div class="flex flex-1 flex-col px-6 py-[2.75rem] sm:px-7 sm:py-[3rem] 3xl:px-8 3xl:py-[3.25rem]">
                <div
                  class="media-card-title media-card-title--room text-base font-semibold leading-snug 4xl:leading-[1.46] text-[#111A33] sm:text-[1.2rem] xl:text-2xl 3xl:text-[1.8rem] 4xl:text-[2rem]"
                >
                  엔터프라이즈 AI 도입, 어디서부터 시작할까
                </div>
                <div class="mt-3 text-[13px] 3xl:text-sm text-[#111A33]/55">2026.02.18</div>
              </div>
            </a>
`;

const insertBefore = `          </div>
        </div>
        </div>
      </section>

      <!-- Customer cases -->`;

if (!html.includes("media-room-card--pad-row2")) {
  if (!html.includes(insertBefore)) {
    console.error("FAIL: insert anchor");
    process.exit(1);
  }
  html = html.replace(insertBefore, `${extraCards}${insertBefore}`);
}

const padCss = `
      /* iPad Mini·Air 세로(768/820): 미디어룸 3열×2행(6카드) */
      #media .media-room-card--pad-row2 {
        display: none !important;
      }
      @media ${MQ_PAD} {
        #media .media-room-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          gap: 0.65rem 0.6rem !important;
        }
        #media .media-room-card--pad-row2 {
          display: flex !important;
        }
        #media .media-room-card {
          border-radius: 0.75rem;
        }
        #media .media-room-card .flex.flex-1.flex-col {
          padding-top: 1rem !important;
          padding-bottom: 1rem !important;
          padding-left: 0.85rem !important;
          padding-right: 0.85rem !important;
        }
        #media .media-card-title.media-card-title--room {
          font-size: 0.8125rem !important;
          line-height: 1.35 !important;
          -webkit-line-clamp: 2;
          line-clamp: 2;
        }
        #media .media-room-card .media-thumb-wrap {
          min-height: 5.5rem;
        }
        #media .media-room-card > .flex.flex-1.flex-col > div.mt-3 {
          margin-top: 0.35rem !important;
          font-size: 11px !important;
        }
      }

      /* GNB 메가 메뉴`;

if (!css.includes("media-room-card--pad-row2")) {
  if (!css.includes("/* GNB 메가 메뉴")) {
    console.error("FAIL: css anchor");
    process.exit(1);
  }
  css = css.replace("      /* GNB 메가 메뉴", padCss);
}

fs.writeFileSync(INDEX, html, "utf8");
fs.writeFileSync(CSS, css, "utf8");

if (!html.includes("엔터프라이즈 IT 파트너") || html.split("media-room-card").length < 7) {
  console.error("FAIL: verify html");
  process.exit(1);
}
console.log("OK: patch-media-room-ipad-6grid");
