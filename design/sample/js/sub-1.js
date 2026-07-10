/**
 * sub_1 — 탭이 탑네비에 붙는 순간(is-collapsed) 블루 포인트바 디졸브
 */
(function () {
  "use strict";

  if (!document.body.classList.contains("sub-page--dissolve-tab")) return;

  var zone = document.getElementById("sub-hero-zone");
  var nav = document.getElementById("sub-anchor-nav");
  var menu = document.getElementById("sub-section-select-menu");
  if (!zone || !nav) return;

  var DOCK_ANIM_MS = 560;
  var mqCompact = window.matchMedia(
    "(max-width: 719px), ((width: 768px) and (orientation: portrait)), ((width: 820px) and (orientation: portrait)), ((width: 1024px) and (orientation: portrait)), ((height: 768px) and (orientation: landscape)), ((height: 820px) and (orientation: landscape)), ((height: 1024px) and (orientation: landscape))"
  );
  var DRAG_THRESHOLD = 6;

  var dockActive = false;
  var settleTimer = 0;

  function isCollapsed() {
    return zone.classList.contains("is-collapsed");
  }

  function isDockSettled() {
    return zone.classList.contains("is-tab-dock-settled");
  }

  function clearSettleTimer() {
    if (settleTimer) {
      window.clearTimeout(settleTimer);
      settleTimer = 0;
    }
  }

  function activateDock() {
    if (dockActive) return;
    dockActive = true;
    zone.classList.add("is-tab-dock-active");
    clearSettleTimer();
    settleTimer = window.setTimeout(function () {
      zone.classList.add("is-tab-dock-settled");
      document.dispatchEvent(new CustomEvent("sub-tab-dock-settled"));
    }, DOCK_ANIM_MS);
  }

  function deactivateDock() {
    if (!dockActive) return;
    dockActive = false;
    clearSettleTimer();
    zone.classList.remove("is-tab-dock-active", "is-tab-dock-settled");
  }

  function syncDockState() {
    if (isCollapsed()) activateDock();
    else deactivateDock();
  }

  /* sub.js is-collapsed 토글과 동기 */
  var mo = new MutationObserver(syncDockState);
  mo.observe(zone, { attributes: true, attributeFilter: ["class"] });

  window.addEventListener("scroll", syncDockState, { passive: true });
  window.addEventListener("resize", syncDockState, { passive: true });
  syncDockState();

  /* 모바일 — 접착 탭바 가로 스크롤 · 드래그 · 활성 탭 보정 */
  (function initMobileTabBar() {
    if (!menu) return;

    var drag = null;
    var suppressClick = false;

    function canUseMobileTabScroll() {
      return (
        document.documentElement.classList.contains("is-sub-title-band") &&
        (isDockSettled() || zone.classList.contains("is-collapsed"))
      );
    }

    function syncTabMenuScrollable() {
      if (!menu) return;
      if (!canUseMobileTabScroll()) {
        menu.classList.remove("is-tab-menu-scrollable");
        return;
      }
      var scrollable = menu.scrollWidth - menu.clientWidth > 2;
      menu.classList.toggle("is-tab-menu-scrollable", scrollable);
    }

    function scrollActiveIntoView(activeLink) {
      if (!canUseMobileTabScroll() || !activeLink) return;

      if (typeof activeLink.scrollIntoView === "function") {
        activeLink.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
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
          menu.setPointerCapture(e.pointerId);
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
    });

    menu.addEventListener("pointercancel", function (e) {
      endDrag(e.pointerId);
    });

    menu.querySelectorAll(".sub-section-select__option").forEach(function (link) {
      link.addEventListener("click", function () {
        window.setTimeout(onActiveChange, 80);
      });
    });

    document.addEventListener("sub-anchor-scroll-done", onActiveChange);
    document.addEventListener("sub-tab-dock-settled", onActiveChange);

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
    }

    if (document.fonts && typeof document.fonts.ready === "object" && document.fonts.ready.then) {
      document.fonts.ready.then(onActiveChange);
    }

    onActiveChange();
  })();

  /* 데스크톱 타이틀 밴드 — 배경 영상 재생(패드·모바일은 이미지) */
  (function initTitleBandVideo() {
    var video = document.getElementById("sub-title-band-video");
    if (!video) return;

    var mqDesktopVideo = window.matchMedia(
      "(min-width: 720px) and (not ((width: 768px) and (orientation: portrait))) and (not ((width: 820px) and (orientation: portrait))) and (not ((width: 1024px) and (orientation: portrait))) and (not ((height: 768px) and (orientation: landscape))) and (not ((height: 820px) and (orientation: landscape))) and (not ((height: 1024px) and (orientation: landscape)))"
    );

    function syncVideo() {
      if (!mqDesktopVideo.matches) {
        video.pause();
        return;
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
      }
    }

    syncVideo();
    if (typeof mqDesktopVideo.addEventListener === "function") {
      mqDesktopVideo.addEventListener("change", syncVideo);
    } else if (typeof mqDesktopVideo.addListener === "function") {
      mqDesktopVideo.addListener(syncVideo);
    }
  })();
})();
