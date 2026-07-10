const fs = require("fs");
const path = require("path");

const htmlPath = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(htmlPath, "utf8");

if (html.includes("growth-history")) {
  console.log("SKIP: growth-history already present");
  process.exit(0);
}

const block = `            <div class="growth-history reveal-up" aria-labelledby="growth-history-title">
              <div class="growth-history__head">
                <p id="growth-history-title" class="growth-history__subtitle">
                  WOONGJIN'S HISTORY
                </p>
              </div>
              <nav class="growth-history__list" aria-label="웅진 IT 연혁">
                <a href="#" class="growth-history__row focus-ring" data-empty-link aria-disabled="true" tabindex="-1">
                  <span class="growth-history__period">2023 ~ 현재</span>
                  <span class="growth-history__label">새로운 혁신과 성장</span>
                  <span class="growth-history__arrow" aria-hidden="true"
                    ><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
                      ><path
                        d="M7.5 4.5L12.5 10L7.5 15.5"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round" /></svg
                  ></span>
                </a>
                <a href="#" class="growth-history__row focus-ring" data-empty-link aria-disabled="true" tabindex="-1">
                  <span class="growth-history__period">2018 ~ 2022</span>
                  <span class="growth-history__label">솔루션 사업 시작</span>
                  <span class="growth-history__arrow" aria-hidden="true"
                    ><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
                      ><path
                        d="M7.5 4.5L12.5 10L7.5 15.5"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round" /></svg
                  ></span>
                </a>
                <a href="#" class="growth-history__row focus-ring" data-empty-link aria-disabled="true" tabindex="-1">
                  <span class="growth-history__period">2014 ~ 2017</span>
                  <span class="growth-history__label">디지털 전환과 클라우드</span>
                  <span class="growth-history__arrow" aria-hidden="true"
                    ><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
                      ><path
                        d="M7.5 4.5L12.5 10L7.5 15.5"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round" /></svg
                  ></span>
                </a>
                <a href="#" class="growth-history__row focus-ring" data-empty-link aria-disabled="true" tabindex="-1">
                  <span class="growth-history__period">2008 ~ 2013</span>
                  <span class="growth-history__label">대외 사업 진출</span>
                  <span class="growth-history__arrow" aria-hidden="true"
                    ><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
                      ><path
                        d="M7.5 4.5L12.5 10L7.5 15.5"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round" /></svg
                  ></span>
                </a>
                <a href="#" class="growth-history__row focus-ring" data-empty-link aria-disabled="true" tabindex="-1">
                  <span class="growth-history__period">2003 ~ 2007</span>
                  <span class="growth-history__label">IT전문 기업 초석 마련</span>
                  <span class="growth-history__arrow" aria-hidden="true"
                    ><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
                      ><path
                        d="M7.5 4.5L12.5 10L7.5 15.5"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round" /></svg
                  ></span>
                </a>
              </nav>
            </div>`;

const marker = `              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="contact-footer"`;

if (!html.includes(marker)) {
  console.error("FAIL: growth section end marker not found");
  process.exit(1);
}

html = html.replace(
  marker,
  `              </article>
            </div>
${block}
          </div>
        </div>
      </section>

      <section id="contact-footer"`
);

fs.writeFileSync(htmlPath, html, "utf8");
console.log("OK: growth-history block added");
