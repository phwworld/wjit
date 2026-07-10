/**
 * 패드 가로(768/820/1024 landscape) — GNB 클릭·터치 전용 · hover 미사용
 * index.html · sub_1.html 공통
 */
(function () {
  "use strict";

  var MQ_PAD_LANDSCAPE =
    "((height: 768px) and (orientation: landscape)), ((height: 820px) and (orientation: landscape)), ((height: 1024px) and (orientation: landscape))";

  var mqPad = window.matchMedia(MQ_PAD_LANDSCAPE);

  function syncPadClass() {
    document.documentElement.classList.toggle("is-pad-gnb", mqPad.matches);
    if (!mqPad.matches) resetPadGnbState();
  }

  function resetPadGnbState() {
    document.documentElement.classList.remove("is-gnb-mega-open");
    var header = document.getElementById("site-header");
    var mega = document.getElementById("gnb-mega");
    if (header) header.classList.remove("is-gnb-mega-open");
    if (mega) {
      mega.classList.remove("is-mega-live");
      mega.querySelectorAll(".gnb-mega__item.is-open").forEach(function (item) {
        item.classList.remove("is-open");
        var trigger = item.querySelector(".gnb-mega__trigger");
        if (trigger) trigger.setAttribute("aria-expanded", "false");
      });
      var sheet = mega.querySelector(".gnb-mega__sheet");
      if (sheet) {
        sheet.style.removeProperty("height");
        sheet.style.removeProperty("min-height");
        sheet.style.removeProperty("max-height");
      }
      var closeBtn = mega.querySelector(".gnb-mega__pad-close");
      if (closeBtn) closeBtn.style.display = "none";
    }
  }

  syncPadClass();

  function init() {
    if (!document.documentElement.classList.contains("is-pad-gnb")) return;

    var header = document.getElementById("site-header");
    var mega = document.getElementById("gnb-mega");
    if (!header || !mega) return;
    if (mega.getAttribute("data-pad-gnb-init") === "1") return;
    mega.setAttribute("data-pad-gnb-init", "1");

    var sheet = mega.querySelector(".gnb-mega__sheet");
    if (!sheet) return;

    var items = mega.querySelectorAll(".gnb-mega__item[data-mega-item]");
    if (!items.length) return;

    var lastSheetH = 0;
    var syncTimer = 0;

    function gnbVisible() {
      return window.getComputedStyle(mega).display !== "none";
    }

    function sheetPadBottom() {
      var root = document.querySelector(".sub-page--dissolve-tab");
      var raw = getComputedStyle(root || document.documentElement).getPropertyValue(
        "--gnb-pad-sheet-pad-bottom"
      );
      var n = parseFloat(raw);
      return Number.isFinite(n) ? n : 56;
    }

    function ensureCloseBtn() {
      var btn = mega.querySelector(".gnb-mega__pad-close");
      if (!btn) {
        btn = document.createElement("button");
        btn.type = "button";
        btn.className = "gnb-mega__pad-close focus-ring";
        btn.setAttribute("aria-label", "메뉴 닫기");
        btn.innerHTML =
          '<span class="gnb-mega__pad-close-icon" aria-hidden="true"></span>';
        mega.appendChild(btn);
      } else if (btn.parentElement !== mega) {
        btn.parentElement.removeChild(btn);
        mega.appendChild(btn);
      }

      if (btn.getAttribute("data-pad-close-bound") === "1") return;
      btn.setAttribute("data-pad-close-bound", "1");

      function onClosePress(e) {
        e.preventDefault();
        e.stopPropagation();
        closeAll();
      }

      btn.addEventListener("click", onClosePress);
      btn.addEventListener("touchend", onClosePress);
    }

    function syncCloseBtnPos() {
      var btn = mega.querySelector(".gnb-mega__pad-close");
      if (!btn) return;
      if (!openItemEl()) {
        btn.style.display = "none";
        return;
      }
      var rect = sheet.getBoundingClientRect();
      if (!rect.height) {
        btn.style.display = "none";
        return;
      }
      btn.style.display = "inline-flex";
      var bottomGap =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue("--gnb-pad-close-bottom")
        ) || 30;
      var btnH = btn.offsetHeight || 36;
      btn.style.top = Math.round(rect.bottom - bottomGap - btnH) + "px";
      btn.style.right = "1.25rem";
    }

    function openItemEl() {
      for (var i = 0; i < items.length; i++) {
        if (items[i].classList.contains("is-open")) return items[i];
      }
      return null;
    }

    function setMegaOpen(on) {
      document.documentElement.classList.toggle("is-gnb-mega-open", on);
      header.classList.toggle("is-gnb-mega-open", on);
      mega.classList.toggle("is-mega-live", on);
    }

    function clearSheetInline() {
      sheet.style.removeProperty("height");
      sheet.style.removeProperty("min-height");
      sheet.style.removeProperty("max-height");
      lastSheetH = 0;
    }

    function closeAll() {
      items.forEach(function (item) {
        item.classList.remove("is-open");
        var trigger = item.querySelector(".gnb-mega__trigger");
        if (trigger) trigger.setAttribute("aria-expanded", "false");
      });
      setMegaOpen(false);
      clearSheetInline();
      syncCloseBtnPos();
      mega.dispatchEvent(new CustomEvent("wj-gnb-mega-sync"));
    }

    function activateItem(item) {
      if (!item) return;
      items.forEach(function (li) {
        var on = li === item;
        li.classList.toggle("is-open", on);
        var trigger = li.querySelector(".gnb-mega__trigger");
        if (trigger) trigger.setAttribute("aria-expanded", on ? "true" : "false");
      });
      setMegaOpen(true);
      syncSheetNow();
      mega.dispatchEvent(new CustomEvent("wj-gnb-mega-sync"));
    }

    function activePanelEl() {
      var open = openItemEl();
      return open ? open.querySelector(".gnb-mega__panel") : null;
    }

    function syncSheetNow() {
      if (!openItemEl()) {
        clearSheetInline();
        return;
      }

      var panel = activePanelEl();
      if (!panel) {
        if (lastSheetH > 0) {
          sheet.style.height = lastSheetH + "px";
          sheet.style.minHeight = lastSheetH + "px";
        }
        syncCloseBtnPos();
        return;
      }

      var inner = panel.querySelector(".gnb-mega__panel-inner");
      if (!inner) return;

      var padBottom = sheetPadBottom();
      var innerRect = inner.getBoundingClientRect();
      var cols = inner.querySelector(".gnb-mega__cols");
      var links = inner.querySelector(".gnb-mega__links");
      var contentEl = cols || links;
      var dropH;

      if (contentEl) {
        var contentRect = contentEl.getBoundingClientRect();
        dropH = Math.ceil(contentRect.bottom - innerRect.top + padBottom);
      } else {
        dropH = Math.ceil(inner.offsetHeight + padBottom);
      }

      dropH = Math.max(dropH, Math.ceil(inner.offsetHeight), 1);
      lastSheetH = dropH;
      sheet.style.height = dropH + "px";
      sheet.style.minHeight = dropH + "px";
      sheet.style.removeProperty("max-height");
      syncCloseBtnPos();
    }

    function scheduleSync() {
      if (syncTimer) window.clearTimeout(syncTimer);
      syncTimer = window.setTimeout(function () {
        syncTimer = 0;
        requestAnimationFrame(syncSheetNow);
      }, 16);
    }

    function isHeaderZone(node) {
      if (!node || !node.closest) return false;
      return !!node.closest("#site-header");
    }

    ensureCloseBtn();

    items.forEach(function (item) {
      var trigger = item.querySelector(".gnb-mega__trigger");
      if (trigger && !trigger.hasAttribute("aria-expanded")) {
        trigger.setAttribute("aria-expanded", "false");
      }

      if (!trigger) return;

      trigger.addEventListener("click", function (e) {
        if (!gnbVisible() || !mqPad.matches) return;

        if (item.classList.contains("is-open")) {
          e.preventDefault();
          return;
        }

        e.preventDefault();
        activateItem(item);
      });
    });

    document.addEventListener("click", function (e) {
      if (!openItemEl() || !mqPad.matches) return;
      if (isHeaderZone(e.target)) return;
      closeAll();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" || !openItemEl()) return;
      closeAll();
    });

    mega.addEventListener("wj-gnb-mega-sync", scheduleSync);
    window.addEventListener("resize", scheduleSync, { passive: true });
    window.addEventListener("load", scheduleSync, { once: true });

    if (typeof ResizeObserver === "function") {
      var ro = new ResizeObserver(scheduleSync);
      mega.querySelectorAll(".gnb-mega__panel-inner").forEach(function (el) {
        ro.observe(el);
      });
    }

    if (typeof mqPad.addEventListener === "function") {
      mqPad.addEventListener("change", function () {
        if (!mqPad.matches) closeAll();
      });
    } else if (typeof mqPad.addListener === "function") {
      mqPad.addListener(function () {
        if (!mqPad.matches) closeAll();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  if (typeof mqPad.addEventListener === "function") {
    mqPad.addEventListener("change", function () {
      syncPadClass();
      if (mqPad.matches) init();
    });
  } else if (typeof mqPad.addListener === "function") {
    mqPad.addListener(function () {
      syncPadClass();
      if (mqPad.matches) init();
    });
  }
})();
