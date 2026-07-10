/**
 * sub_2 — 타이틀밴드+탭 통합 마스크 리빌 · 탭바 · 모바일 탭 스크롤
 */
(function () {
  "use strict";

  if (!document.body.classList.contains("sub-page--v2-band")) return;

  var block = document.getElementById("sub-v2-hero-block");
  var clip = document.getElementById("sub-v2-hero-reveal");
  var zone = document.getElementById("sub-hero-zone");
  var nav = document.getElementById("sub-anchor-nav");
  var menu = document.getElementById("sub-section-select-menu");

  var MASK_FALLBACK_MS = 1400;

  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var mqCompact = window.matchMedia(
    "(max-width: 719px), ((width: 768px) and (orientation: portrait)), ((width: 820px) and (orientation: portrait)), ((width: 1024px) and (orientation: portrait)), ((height: 768px) and (orientation: landscape)), ((height: 820px) and (orientation: landscape)), ((height: 1024px) and (orientation: landscape))"
  );
  var DRAG_THRESHOLD = 6;

  function prepareTabBarLayout() {
    if (zone) {
      zone.classList.add("is-expanded", "is-v2-tab-ready");
    }
  }

  function activateTabBar() {
    prepareTabBarLayout();
    if (zone) {
      zone.classList.add("is-anchor-visible");
    }
  }

  function revealPageContent() {
    requestAnimationFrame(function () {
      document.body.classList.add("is-v2-content-ready");
    });
  }

  function finishIntro() {
    activateTabBar();
    revealPageContent();
  }

  /* 인트로 시작 전부터 실제 탭바를 플레이스홀더와 동일 좌표에 겹쳐 둠 — 마스크 종료 시 세로 튐 방지 */
  prepareTabBarLayout();

  function initMaskReveal() {
    if (!block || !clip) {
      finishIntro();
      return;
    }

    if (reduceMotion) {
      block.classList.add("is-v2-revealed");
      finishIntro();
      return;
    }

    var maskDone = false;

    function onMaskDone() {
      if (maskDone) return;
      maskDone = true;
      clip.removeEventListener("transitionend", onClipDone);
      block.classList.add("is-v2-revealed");
      finishIntro();
    }

    function onClipDone(ev) {
      if (ev.target !== clip || ev.propertyName !== "clip-path") return;
      onMaskDone();
    }

    clip.addEventListener("transitionend", onClipDone);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        block.classList.add("is-v2-revealed");
        window.setTimeout(function () {
          if (!maskDone) onMaskDone();
        }, MASK_FALLBACK_MS);
      });
    });
  }

  initMaskReveal();

  /* 타이틀밴드·탭바 BG 영상 — 패드·데스크탑만 1회 재생 후 마지막 프레임 정지 */
  (function initTitleBandVideo() {
    var videos = document.querySelectorAll("[data-sub-v2-band-vid]");
    if (!videos.length) return;

    var mqMobile = window.matchMedia("(max-width: 719px)");
    var mqReduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");

    videos.forEach(function (video) {
      video.loop = false;
      video.removeAttribute("loop");
      video.addEventListener("ended", function () {
        try {
          video.pause();
        } catch (err) {
          /* noop */
        }
      });
    });

    function syncPlayback() {
      var useVideo = !(mqMobile && mqMobile.matches) && !(mqReduce && mqReduce.matches);

      videos.forEach(function (video) {
        video.muted = true;
        video.defaultMuted = true;
        video.setAttribute("muted", "");
        video.playsInline = true;
        video.setAttribute("playsinline", "");

        if (!useVideo) {
          try {
            video.pause();
          } catch (err) {
            /* noop */
          }
          return;
        }

        if (video.ended) return;

        var p = video.play && video.play();
        if (p && typeof p.catch === "function") {
          p.catch(function () {
            /* autoplay policy */
          });
        }
      });
    }

    syncPlayback();
    videos.forEach(function (video) {
      video.addEventListener("loadeddata", syncPlayback, { once: true });
    });

    if (mqMobile && typeof mqMobile.addEventListener === "function") {
      mqMobile.addEventListener("change", syncPlayback);
    } else if (mqMobile && typeof mqMobile.addListener === "function") {
      mqMobile.addListener(syncPlayback);
    }

    if (mqReduce && typeof mqReduce.addEventListener === "function") {
      mqReduce.addEventListener("change", syncPlayback);
    } else if (mqReduce && typeof mqReduce.addListener === "function") {
      mqReduce.addListener(syncPlayback);
    }
  })();

  /* sub.js light 테마가 조기 is-anchor-visible → 탭 슬라이드 애니 재발 방지 */
  if (zone) {
    zone.classList.remove("is-anchor-visible");
  }

  /* 모바일·패드 컴팩트 — 탭바 가로 스크롤 · 드래그 · 활성 탭 보정 (5~6개 오버플로 대비) */
  (function initMobileTabBar() {
    if (!menu || !zone) return;

    var drag = null;
    var suppressClick = false;
    var SCROLL_EPS = 2;

    function isMobileViewport() {
      return mqCompact.matches;
    }

    function isTabBarInteractive() {
      return (
        document.body.classList.contains("is-v2-content-ready") &&
        zone.classList.contains("is-v2-tab-ready")
      );
    }

    function canUseMobileTabScroll() {
      return isMobileViewport() && isTabBarInteractive();
    }

    function isMenuOverflowing() {
      return menu.scrollWidth - menu.clientWidth > SCROLL_EPS;
    }

    function syncTabMenuScrollable() {
      if (!menu) return;
      if (!canUseMobileTabScroll()) {
        menu.classList.remove("is-tab-menu-scrollable", "is-tab-menu-dragging");
        menu.scrollLeft = 0;
        return;
      }
      menu.classList.toggle("is-tab-menu-scrollable", isMenuOverflowing());
    }

    function scrollActiveIntoView(activeLink) {
      if (!canUseMobileTabScroll() || !activeLink || !menu.classList.contains("is-tab-menu-scrollable")) return;

      if (typeof activeLink.scrollIntoView === "function") {
        try {
          activeLink.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        } catch (err) {
          activeLink.scrollIntoView(true);
        }
        return;
      }

      var menuRect = menu.getBoundingClientRect();
      var linkRect = activeLink.getBoundingClientRect();
      var pad = 12;
      if (linkRect.left < menuRect.left + pad) {
        menu.scrollLeft -= menuRect.left + pad - linkRect.left;
      } else if (linkRect.right > menuRect.right - pad) {
        menu.scrollLeft += linkRect.right - (menuRect.right - pad);
      }
    }

    function onActiveChange() {
      window.requestAnimationFrame(function () {
        syncTabMenuScrollable();
        scrollActiveIntoView(menu.querySelector(".sub-section-select__option.is-active"));
      });
    }

    function endDrag(pointerId) {
      if (!drag) return;
      if (pointerId != null && drag.pointerId !== pointerId) return;
      menu.classList.remove("is-tab-menu-dragging");
      if (drag.moved) suppressClick = true;
      drag = null;
    }

    menu.addEventListener(
      "click",
      function (e) {
        if (!suppressClick) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        suppressClick = false;
      },
      true
    );

    menu.addEventListener(
      "pointerdown",
      function (e) {
        if (!canUseMobileTabScroll() || !menu.classList.contains("is-tab-menu-scrollable")) return;
        if (e.pointerType === "mouse" && e.button !== 0) return;

        drag = {
          pointerId: e.pointerId,
          startX: e.clientX,
          startScrollLeft: menu.scrollLeft,
          moved: false,
        };

        if (typeof menu.setPointerCapture === "function") {
          try {
            menu.setPointerCapture(e.pointerId);
          } catch (err) {
            /* noop */
          }
        }
      },
      { passive: true }
    );

    menu.addEventListener(
      "pointermove",
      function (e) {
        if (!drag || drag.pointerId !== e.pointerId) return;

        var deltaX = e.clientX - drag.startX;
        if (!drag.moved && Math.abs(deltaX) < DRAG_THRESHOLD) return;

        drag.moved = true;
        menu.classList.add("is-tab-menu-dragging");
        menu.scrollLeft = drag.startScrollLeft - deltaX;

        if (e.cancelable) e.preventDefault();
      },
      { passive: false }
    );

    menu.addEventListener("pointerup", function (e) {
      endDrag(e.pointerId);
      if (typeof menu.releasePointerCapture === "function") {
        try {
          menu.releasePointerCapture(e.pointerId);
        } catch (err) {
          /* noop */
        }
      }
    });

    menu.addEventListener("pointercancel", function (e) {
      endDrag(e.pointerId);
    });

    menu.addEventListener(
      "scroll",
      function () {
        if (!menu.classList.contains("is-tab-menu-scrollable")) return;
        menu.classList.toggle("is-tab-menu-scrolled", menu.scrollLeft > SCROLL_EPS);
        menu.classList.toggle(
          "is-tab-menu-scroll-end",
          menu.scrollLeft + menu.clientWidth >= menu.scrollWidth - SCROLL_EPS
        );
      },
      { passive: true }
    );

    menu.querySelectorAll(".sub-section-select__option").forEach(function (link) {
      link.addEventListener("click", function () {
        window.setTimeout(onActiveChange, 80);
      });
    });

    document.addEventListener("sub-anchor-scroll-done", onActiveChange);

    window.addEventListener("scroll", onActiveChange, { passive: true });
    window.addEventListener("resize", onActiveChange, { passive: true });
    window.addEventListener("orientationchange", onActiveChange, { passive: true });

    if (typeof mqCompact.addEventListener === "function") {
      mqCompact.addEventListener("change", onActiveChange);
    } else if (typeof mqCompact.addListener === "function") {
      mqCompact.addListener(onActiveChange);
    }

    if (typeof ResizeObserver === "function") {
      var ro = new ResizeObserver(onActiveChange);
      ro.observe(menu);
      menu.querySelectorAll(".sub-section-select__option").forEach(function (link) {
        ro.observe(link);
      });
    }

    if (typeof MutationObserver === "function") {
      var menuMo = new MutationObserver(onActiveChange);
      menuMo.observe(menu, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });

      var bodyMo = new MutationObserver(function (records) {
        records.forEach(function (record) {
          if (record.attributeName === "class") onActiveChange();
        });
      });
      bodyMo.observe(document.body, { attributes: true, attributeFilter: ["class"] });

      var zoneMo = new MutationObserver(onActiveChange);
      zoneMo.observe(zone, { attributes: true, attributeFilter: ["class"] });
    }

    if (document.fonts && typeof document.fonts.ready === "object" && document.fonts.ready.then) {
      document.fonts.ready.then(onActiveChange);
    }

    onActiveChange();
  })();
})();
