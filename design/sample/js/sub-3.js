/**
 * sub_3 — 화이트패턴 타이틀밴드 · 세그먼트 탭 · 스크롤 시 메가네비 숨김 + 탭 top:0
 * (신세계아이앤씨 scrollDown 패턴 참고 — 디자인 미적용)
 */
(function () {
  "use strict";

  if (!document.body.classList.contains("sub-page--v3-band")) return;

  var zone = document.getElementById("sub-hero-zone");
  var menu = document.getElementById("sub-section-select-menu");
  var heroBlock = document.getElementById("sub-v3-hero-block");
  var root = document.documentElement;
  var pageRoot = document.querySelector(".sub-page--v3-band") || document.body;

  var mqCompact = window.matchMedia(
    "(max-width: 719px), ((width: 768px) and (orientation: portrait)), ((width: 820px) and (orientation: portrait)), ((width: 1024px) and (orientation: portrait)), ((height: 768px) and (orientation: landscape)), ((height: 820px) and (orientation: landscape)), ((height: 1024px) and (orientation: landscape))"
  );
  var mqPhone = window.matchMedia("(max-width: 719px)");
  var DRAG_THRESHOLD = 6;
  var SCROLL_DIR_EPS = 2;

  function prepareTabBarLayout() {
    if (zone) {
      zone.classList.add("is-expanded", "is-v3-tab-ready");
    }
  }

  function activateTabBar() {
    prepareTabBarLayout();
    if (zone) {
      zone.classList.add("is-anchor-visible");
    }
  }

  prepareTabBarLayout();
  activateTabBar();

  if (menu) {
    menu.classList.remove(
      "is-tab-menu-scrollable",
      "is-tab-menu-dragging",
      "is-tab-menu-scrolled",
      "is-tab-menu-scroll-end"
    );
    menu.scrollLeft = 0;
  }

  function readNavH() {
    var header = document.getElementById("site-header");
    if (header) {
      var measured = header.getBoundingClientRect().height;
      if (measured > 0) return measured;
    }
    var raw = getComputedStyle(pageRoot).getPropertyValue("--sub-dock-top");
    var n = parseFloat(raw);
    return Number.isFinite(n) ? n : 90;
  }

  function readDockGap() {
    var raw = getComputedStyle(pageRoot).getPropertyValue("--sub-v3-tab-dock-gap");
    var n = parseFloat(raw);
    return Number.isFinite(n) ? n : 50;
  }

  function readDockTopWithHeader() {
    return readNavH() + readDockGap();
  }

  /* 스크롤 — 메가네비 숨김 + 탭 sticky · 신세계아이앤씨 sinc_ui.js 패턴 */
  (function initV3ScrollNav() {
    if (!zone || !heroBlock) return;

    var ticking = false;
    var hideHeader = false;
    var lastScrollY = window.scrollY;

    function setDockTopEffective(px) {
      pageRoot.style.setProperty("--sub-v3-tab-dock-top-effective", px + "px");
      pageRoot.style.setProperty("--sub-v2-tab-dock-top", px + "px");
    }

    function syncScrollNav() {
      ticking = false;
      if (!zone) return;

      var scrollY = window.scrollY;
      var dockWithHeader = readDockTopWithHeader();
      var rect = zone.getBoundingClientRect();
      var header = document.getElementById("site-header");
      var headerInteractive =
        header &&
        (header.classList.contains("is-search-open") || header.classList.contains("is-mobile-menu-open"));

      /* 타이틀밴드 통과 후 — 아래 스크롤: 메가네비 숨김 / 위 스크롤: 탭 위에 다시 노출 */
      var pastTitle = scrollY > 20 && rect.top <= dockWithHeader + 2;
      var scrollingDown = scrollY > lastScrollY + SCROLL_DIR_EPS;
      var scrollingUp = scrollY < lastScrollY - SCROLL_DIR_EPS;

      if (scrollY <= 12 || !pastTitle || headerInteractive) {
        hideHeader = false;
      } else if (scrollingUp) {
        hideHeader = false;
      } else if (scrollingDown || rect.top <= 4) {
        hideHeader = true;
      }

      var dockTop = hideHeader ? 0 : dockWithHeader;
      setDockTopEffective(dockTop);

      root.classList.toggle("is-v3-header-hidden", hideHeader);
      if (header) header.classList.toggle("is-hidden", hideHeader);

      var tabStuck = pastTitle;
      var tabAtTop = hideHeader && pastTitle;

      zone.classList.toggle("is-v3-tab-stuck", tabStuck);
      zone.classList.toggle("is-v3-tab-at-top", tabAtTop);

      lastScrollY = scrollY;
    }

    function onScrollOrResize() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(syncScrollNav);
    }

    setDockTopEffective(readDockTopWithHeader());
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    window.addEventListener("orientationchange", onScrollOrResize, { passive: true });
    document.addEventListener("sub-anchor-scroll-done", onScrollOrResize);
    document.addEventListener("sub-anchor-scroll-done", function () {
      if (!mqPhone.matches) return;
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          if (window.scrollY <= 20) return;
          hideHeader = true;
          lastScrollY = window.scrollY;
          syncScrollNav();
        });
      });
    });
    syncScrollNav();

    var mobileMenuBtn = document.getElementById("mobile-menu-button");
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener("click", function () {
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(syncScrollNav);
        });
      });
    }
  })();

  /* 모바일·패드 — 탭바 가로 스크롤 · 드래그 · 활성 탭 보정 */
  (function initMobileTabBar() {
    if (!menu || !zone) return;

    var drag = null;
    var suppressClick = false;
    var SCROLL_EPS = 2;

    function isMobileViewport() {
      return mqPhone.matches;
    }

    function isTabBarInteractive() {
      return zone.classList.contains("is-v3-tab-ready");
    }

    function canUseMobileTabScroll() {
      return false;
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

    if (typeof mqPhone.addEventListener === "function") {
      mqPhone.addEventListener("change", onActiveChange);
    } else if (typeof mqPhone.addListener === "function") {
      mqPhone.addListener(onActiveChange);
    }

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

      var zoneMo = new MutationObserver(onActiveChange);
      zoneMo.observe(zone, { attributes: true, attributeFilter: ["class"] });
    }

    if (document.fonts && typeof document.fonts.ready === "object" && document.fonts.ready.then) {
      document.fonts.ready.then(onActiveChange);
    }

    onActiveChange();
  })();
})();
