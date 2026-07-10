/**
 * 시안3 서브페이지 — 콘텐츠·푸터·스크롤탑 (탑네비는 site.js)
 */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  /* 히어로·본문 — 초기 노출 보장 (sub.js 애니메이션과 병행) */
  (function initSubContentVisible() {
    var hero = document.querySelector(".sub-hero");
    if (hero) {
      hero.classList.add("is-text-visible");
      ["sub-hero__breadcrumb", "sub-hero__eyebrow", "sub-hero__title", "sub-hero__desc"].forEach(
        function (sel) {
          var el = hero.querySelector("." + sel);
          if (el) el.classList.add("is-sub-hero-revealed");
        }
      );
    }
    document.querySelectorAll(".sub-page--v3 .reveal-up").forEach(function (el) {
      el.classList.add("is-revealed");
    });
  })();

  /* 서브: 항상 솔리드(라이트) 헤더 */
  (function initSubHeaderSolid() {
    var header = document.getElementById("site-header");
    if (!header) return;
    header.classList.add("is-solid");
    header.classList.remove("is-hidden");
  })();

  (function initScrollTop() {
    var btn = document.getElementById("scroll-top");
    if (!btn) return;
    var threshold = 48;
    var ticking = false;

    function sync() {
      ticking = false;
      var show = window.scrollY > threshold;
      btn.classList.toggle("is-visible", show);
      btn.hidden = !show;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(sync);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    sync();

    btn.addEventListener("click", function () {
      var mobileMenuBtn = document.getElementById("mobile-menu-button");
      if (mobileMenuBtn && mobileMenuBtn.getAttribute("aria-expanded") === "true") {
        mobileMenuBtn.click();
      }
      if (typeof window.__subScrollToPageTop === "function") {
        window.__subScrollToPageTop();
        return;
      }
      history.replaceState(null, "", location.pathname + location.search);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  })();

})();
