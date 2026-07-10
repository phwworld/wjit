/**
 * 웹접근성(KWCAG/WCAG 2.2) 보완 — UTF-8 safe patches (HTML only; JS는 repair-site-js)
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const INDEX = path.join(ROOT, "index.html");

let html = fs.readFileSync(INDEX, "utf8");
let n = 0;

if (!html.includes('aria-disabled="true" tabindex="-1"')) {
  html = html.replace(/aria-disabled="true"/g, 'aria-disabled="true" tabindex="-1"');
  n++;
}

if (!html.includes("mobile-nav-panel-0")) {
  let panelIdx = 0;
  html = html.replace(
    /(<button type="button" class="mobile-nav__lv1[^"]*" data-mobile-nav-toggle) aria-expanded="false">/g,
    (_, pre) => {
      const tid = `mobile-nav-toggle-${panelIdx}`;
      const pid = `mobile-nav-panel-${panelIdx}`;
      panelIdx++;
      return `${pre} id="${tid}" aria-controls="${pid}" aria-expanded="false">`;
    }
  );
  panelIdx = 0;
  html = html.replace(/<div class="mobile-nav__panel" hidden>/g, () => {
    const tid = `mobile-nav-toggle-${panelIdx}`;
    const pid = `mobile-nav-panel-${panelIdx}`;
    panelIdx++;
    return `<div id="${pid}" class="mobile-nav__panel" role="region" aria-labelledby="${tid}" hidden>`;
  });
  n++;
}

if (html.includes('id="contact-footer"') && html.includes('role="region"')) {
  html = html.replace(
    '<div id="contact-footer" class="snap-section relative flex min-h-[100dvh] flex-col overflow-hidden bg-black" role="region" aria-label="문의 및 사이트 정보">',
    '<section id="contact-footer" class="snap-section relative flex min-h-[100dvh] flex-col overflow-hidden bg-black" aria-label="문의 및 사이트 정보">'
  );
  const closeNeedle = "      </footer>\n      </div>\n    </main>";
  const closeRepl = "      </footer>\n      </section>\n    </main>";
  if (html.includes(closeNeedle)) {
    html = html.replace(closeNeedle, closeRepl);
    n++;
  }
}

if (!html.includes('aria-labelledby="contact-form-title"')) {
  html = html.replace(
    '<form class="mt-6 space-y-7" method="post" action="#" onsubmit="return window.__handleContactSubmit(event)">',
    '<form class="mt-6 space-y-7" method="post" action="#" onsubmit="return window.__handleContactSubmit(event)" aria-labelledby="contact-form-title" novalidate>'
  );
  html = html.replace(
    '<span class="hero-title-line__in block type-section-display text-white">문의하기</span>',
    '<span id="contact-form-title" class="hero-title-line__in block type-section-display text-white">문의하기</span>'
  );
  n++;
}

fs.writeFileSync(INDEX, html, "utf8");
console.log("OK: patch-a11y (" + n + " change groups)");
