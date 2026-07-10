(function initSubPage() {
  /** 새로고침 시 서브 최상단 유지(메인 해시·스크롤 복원 방지) */
  (function initSubPageEntry() {
    if (!document.body.classList.contains("sub-page")) return;
    const MAIN_ONLY_HASH =
      /^(?:hero|services|cases|contact|capabilities|media|insights|success-story|hero-section|content)$/;
    const hash = location.hash.replace(/^#/, "");
    const hashTarget = hash && document.getElementById(hash);
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (hash && (!hashTarget || MAIN_ONLY_HASH.test(hash))) {
      history.replaceState(null, "", location.pathname + location.search);
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } else if (!hashTarget) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
    window.addEventListener(
      "pageshow",
      (e) => {
        const id = location.hash.replace(/^#/, "");
        const target = id && document.getElementById(id);
        if (id && (!target || MAIN_ONLY_HASH.test(id))) {
          history.replaceState(null, "", location.pathname + location.search);
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
          return;
        }
        if (!e.persisted) return;
        if (!id || !target) {
          history.replaceState(null, "", location.pathname + location.search);
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        }
      },
      { passive: true }
    );
    window.addEventListener("hashchange", () => {
      const id = location.hash.replace(/^#/, "");
      if (id && MAIN_ONLY_HASH.test(id)) {
        history.replaceState(null, "", location.pathname + location.search);
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    });
  })();

  const reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MQ_SUB_HERO_COMPACT =
    "(max-width: 719px), ((width: 768px) and (orientation: portrait)), ((width: 820px) and (orientation: portrait)), ((width: 1024px) and (orientation: portrait)), ((height: 768px) and (orientation: landscape)), ((height: 820px) and (orientation: landscape)), ((height: 1024px) and (orientation: landscape))";
  const mqSubHeroMobile =
    window.matchMedia && window.matchMedia(MQ_SUB_HERO_COMPACT);

  /** 히어로 → 탭 → 본문 순서용 타이밍 (initSubHeroSequence와 동기) */
  const SUB_HERO_TIMING = {
    START_DELAY: 120,
    TEXT_DELAY: 520,
    STEP_GAP: 360,
    ITEM_DURATION: 1080,
    DESC_LINE2_DELAY: 360,
    ANCHOR_BUFFER: 140,
    CONTENT_AFTER_ANCHOR: 380,
  };

  const HERO_REVEAL_STEPS = [
    "is-hero-show-breadcrumb",
    "is-hero-show-eyebrow",
    "is-hero-show-title",
    "is-hero-show-desc",
  ];

  const HERO_REVEAL_TARGETS = [
    ".sub-hero__breadcrumb",
    ".sub-hero__eyebrow",
    ".sub-hero__title",
    ".sub-hero__desc",
  ];

  /** 히어로 축소 — pin 레이아웃 고정 + shrink-range(280px) 1:1 스크롤 보간 */
  const SUB_HERO_COLLAPSE = {
    COLLAPSED_EPS: 0.999,
  };

  const getHeroShrinkRange = () => {
    const root = document.querySelector(".sub-page");
    if (!root) return 280;
    const cs = getComputedStyle(root);
    const expanded = parseFloat(cs.getPropertyValue("--sub-hero-height")) || 580;
    const collapsed = parseFloat(cs.getPropertyValue("--sub-hero-height-collapsed")) || 300;
    return Math.max(1, expanded - collapsed);
  };

  /** 스크롤 reveal — 상단이 뷰포트 중앙(50%)에 닿을 때 시작 */
  const SUB_VIEWPORT_REVEAL = {
    rootMargin: "0px 0px -50% 0px",
    threshold: 0,
  };

  const ensureRevealSentinel = (root) => {
    let sentinel = root.querySelector(".sub-reveal-sentinel");
    if (sentinel) return sentinel;
    sentinel = document.createElement("span");
    sentinel.className = "sub-reveal-sentinel";
    sentinel.setAttribute("aria-hidden", "true");
    root.prepend(sentinel);
    return sentinel;
  };

  const getRevealObserveTarget = (root) => {
    if (root.matches?.(".sub-section[data-reveal-seq]") || root.id === "sub-bridge") {
      return ensureRevealSentinel(root);
    }
    return root;
  };

  const getRevealLineY = () => window.innerHeight * 0.5;

  const isAtRevealLine = (root) => {
    const target = getRevealObserveTarget(root);
    return target.getBoundingClientRect().top <= getRevealLineY();
  };

  const getRevealRoot = (node) =>
    node.closest(".sub-section[data-reveal-seq]") || node.closest("#sub-bridge");

  const revealHeroBlock = (hero, selector) => {
    hero.querySelector(selector)?.classList.add("is-sub-hero-revealed");
  };

  const revealAllHeroSteps = (hero) => {
    if (!hero) return;
    hero.classList.add("is-text-visible", ...HERO_REVEAL_STEPS);
    HERO_REVEAL_TARGETS.forEach((selector) => revealHeroBlock(hero, selector));
  };

  const subHeroIntroEndMs = () => {
    if (reduceMotion) return 0;
    if (mqSubHeroMobile && mqSubHeroMobile.matches) return 480;
    const t = SUB_HERO_TIMING;
    return (
      t.START_DELAY +
      t.TEXT_DELAY +
      t.STEP_GAP * 3 +
      t.DESC_LINE2_DELAY +
      t.ITEM_DURATION +
      t.ANCHOR_BUFFER +
      t.CONTENT_AFTER_ANCHOR
    );
  };

  const reveal = (el) => el && el.classList.add("is-revealed");

  /** 서브페이지: 헤더 항상 솔리드(화이트) */
  (function initSubHeaderSolid() {
    const header = document.getElementById("site-header");
    const pageBg = document.getElementById("page-bg-decoration");
    if (!header || !document.body.classList.contains("sub-page")) return;
    const forceSolid = () => {
      header.classList.add(document.body.classList.contains("sub-page--v3") ? "is-light" : "is-solid");
      if (pageBg) pageBg.classList.remove("is-dimmed-for-hero");
    };
    forceSolid();
    window.addEventListener("scroll", forceSolid, { passive: true });
    window.addEventListener("resize", forceSolid);
  })();

  /** 히어로 BG 영상 — 1회 재생 후 정지 */
  (function initSubHeroVideo() {
    const hero = document.querySelector(".sub-hero");
    const video = document.getElementById("sub-hero-video");
    if (!hero || !video) return;

    const reduceMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    video.loop = false;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("disablePictureInPicture", "");
    video.controls = false;

    const markReady = () => video.classList.add("is-ready");

    const playOnce = () => {
      if (reduceMotion || video.dataset.played === "true") return;
      video.currentTime = 0;
      const p = video.play();
      if (p && typeof p.then === "function") {
        p.then(() => {
          video.dataset.played = "true";
          hero.classList.add("is-playing");
        }).catch(() => {});
      }
    };

    video.addEventListener("loadeddata", markReady);
    video.addEventListener("canplay", markReady, { once: true });

    video.addEventListener("play", () => hero.classList.add("is-playing"));
    video.addEventListener("ended", () => {
      video.pause();
      video.classList.add("is-ended");
      hero.classList.remove("is-playing");
    });

    if (reduceMotion) {
      markReady();
      video.pause();
      try {
        video.currentTime = 0;
      } catch (_) {}
      return;
    }

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting && e.intersectionRatio > 0.2)) return;
          playOnce();
          io.disconnect();
        },
        { threshold: [0, 0.2, 0.35] }
      );
      io.observe(hero);
    } else {
      playOnce();
    }
  })();

  /** 히어로 — 마스크 리빌 → 1브레드크럼→2아이브로→3타이틀→4설명→5탭 순차 등장 */
  (function initSubHeroSequence() {
    const hero = document.querySelector(".sub-hero");
    const zone = document.getElementById("sub-hero-zone");
    if (!hero || !zone) return;

    // light 테마: mask 애니메이션 없이 즉시 전부 노출 (v2-band는 sub-2.js 인트로 후 처리)
    if (document.body.classList.contains("sub-page--light")) {
      hero.dataset.revealed = "true";
      hero.classList.add("is-expanded");
      zone.classList.add("is-expanded");
      if (
        !document.body.classList.contains("sub-page--v2-band") &&
        !document.body.classList.contains("sub-page--v3-band")
      ) {
        zone.classList.add("is-anchor-visible");
      }
      revealAllHeroSteps(hero);
      return;
    }

    const { START_DELAY, TEXT_DELAY, STEP_GAP, ITEM_DURATION, DESC_LINE2_DELAY, ANCHOR_BUFFER } =
      SUB_HERO_TIMING;

    const revealAnchor = () => {
      zone.classList.add("is-anchor-visible");
    };

    const run = () => {
      if (hero.dataset.revealed === "true") return;
      hero.dataset.revealed = "true";
      hero.classList.add("is-expanded");
      zone.classList.add("is-expanded");

      HERO_REVEAL_STEPS.forEach((stepClass, index) => {
        window.setTimeout(
          () => {
            hero.classList.add(stepClass);
            revealHeroBlock(hero, HERO_REVEAL_TARGETS[index]);
          },
          reduceMotion ? 0 : TEXT_DELAY + STEP_GAP * index
        );
      });

      window.setTimeout(
        revealAnchor,
        reduceMotion
          ? 0
          : TEXT_DELAY + STEP_GAP * 3 + DESC_LINE2_DELAY + ITEM_DURATION + ANCHOR_BUFFER
      );
    };

    const runCompact = () => {
      hero.dataset.revealed = "true";
      hero.classList.add("is-expanded");
      zone.classList.add("is-expanded");
      revealAllHeroSteps(hero);
      zone.classList.add("is-anchor-visible");
    };

    if (reduceMotion || (mqSubHeroMobile && mqSubHeroMobile.matches)) {
      runCompact();
      return;
    }

    window.requestAnimationFrame(() => {
      window.setTimeout(run, START_DELAY);
    });
  })();

  /** 히어로 축소 — 탭 바로가기(initSubAnchorNav)와 상태 공유 */
  let heroCollapseCtl = null;

  /** 히어로 — pin 고정 + sticky zone 시각적 축소 (레이아웃 떨림 없음) */
  (function initSubHeroCollapse() {
    const pin = document.getElementById("sub-hero-pin");
    const zone = document.getElementById("sub-hero-zone");
    const hero = zone?.querySelector(".sub-hero");
    if (!zone || !hero) return;

    const { COLLAPSED_EPS } = SUB_HERO_COLLAPSE;
    let ticking = false;
    let collapsed = zone.classList.contains("is-collapsed");

    const isAnchorCompactNav = () => zone.dataset.anchorScrollCompact === "true";

    const getProgress = (y) => {
      const range = getHeroShrinkRange();
      if (reduceMotion) return y >= range * 0.5 ? 1 : 0;
      return Math.min(1, Math.max(0, y / range));
    };

    const setProgress = (progress) => {
      zone.style.setProperty("--sub-hero-scroll-progress", String(progress));
    };

    const syncPinSpacer = (progress) => {
      if (!pin) return;
      pin.style.height = `${progress * getHeroShrinkRange()}px`;
    };

    const syncCollapsedClass = (progress) => {
      const next = progress >= COLLAPSED_EPS;
      if (next === collapsed) return;
      zone.classList.toggle("is-collapsed", next);
      collapsed = next;
    };

    const applyScrollDrivenMode = () => {
      zone.classList.add("is-hero-scroll-driven");
      pin?.classList.add("is-hero-scroll-driven");
    };

    /** sub_1·sub_2·sub_3 — 타이틀밴드 + 탭 sticky 레이아웃 */
    const usesTitleBandLayout = () =>
      document.documentElement.classList.contains("is-sub-title-band") &&
      (document.body.classList.contains("sub-page--dissolve-tab") ||
        document.body.classList.contains("sub-page--v2-band") ||
        document.body.classList.contains("sub-page--v3-band"));

    const applyMobileMode = () => {
      if (mqSubHeroMobile && mqSubHeroMobile.matches) {
        /* compact(title band) — 탭바만 고정, 히어로 스크롤 축소 없음 */
        if (usesTitleBandLayout()) {
          zone.classList.add("is-collapsed");
          zone.classList.remove("is-hero-scroll-driven");
          pin?.classList.remove("is-hero-scroll-driven");
          zone.style.removeProperty("--sub-hero-scroll-progress");
          if (pin) pin.style.height = "0px";
          collapsed = true;
          return true;
        }
        /* 상단(개요) 정지 — 탭(2번째+) 이동 중에는 scroll-driven 유지 */
        if (window.scrollY <= 1 && !isAnchorCompactNav()) {
          zone.classList.add("is-collapsed");
          zone.classList.remove("is-hero-scroll-driven");
          pin?.classList.remove("is-hero-scroll-driven");
          zone.style.removeProperty("--sub-hero-scroll-progress");
          if (pin) pin.style.height = "0px";
          collapsed = true;
          return true;
        }
        applyScrollDrivenMode();
        zone.classList.remove("is-collapsed");
        collapsed = false;
        return false;
      }
      /* 데스크톱 title-band(sub_1·sub_2) — 모바일·패드와 동일, 히어로 축소 없음 */
      if (usesTitleBandLayout()) {
        zone.classList.add("is-collapsed");
        zone.classList.remove("is-hero-scroll-driven");
        pin?.classList.remove("is-hero-scroll-driven");
        zone.style.removeProperty("--sub-hero-scroll-progress");
        if (pin) pin.style.height = "0px";
        collapsed = true;
        return true;
      }
      applyScrollDrivenMode();
      return false;
    };

    const applyProgress = (y) => {
      const progress = getProgress(y);
      setProgress(progress);
      syncPinSpacer(progress);
      syncCollapsedClass(progress);
      return progress;
    };

    const sync = () => {
      ticking = false;
      if (applyMobileMode()) return;
      applyProgress(window.scrollY);
    };

    /** 개요(0) 제외 — 탭 이동 시 상단도 스크롤 축소와 동일하게 연동 */
    const prepareForAnchorScroll = (sectionIndex) => {
      const toCompact = sectionIndex > 0;
      zone.dataset.anchorScrollCompact = toCompact ? "true" : "false";
      if (!toCompact) return;
      if (usesTitleBandLayout()) return;

      applyScrollDrivenMode();
      const isWebLayout = !(mqSubHeroMobile && mqSubHeroMobile.matches);
      /* 웹: pin 스페이서·축소 높이를 먼저 확정 — 스크롤 중 레이아웃 밀림으로 앵커·탭 ON이 어긋나는 것 방지 */
      if (reduceMotion || isWebLayout) {
        setProgress(1);
        syncPinSpacer(1);
        syncCollapsedClass(1);
      } else {
        applyProgress(window.scrollY);
      }
      void zone.offsetHeight;
    };

    const finishAnchorScroll = () => {
      delete zone.dataset.anchorScrollCompact;
      sync();
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(sync);
    };

    heroCollapseCtl = { sync, prepareForAnchorScroll, finishAnchorScroll };

    if (mqSubHeroMobile && typeof mqSubHeroMobile.addEventListener === "function") {
      mqSubHeroMobile.addEventListener("change", sync);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    sync();
  })();

  /** 서브 전용 스크롤 reveal — 히어로·탭 인트로 종료 후 01~ 본문 순차 등장 */
  (function initSubScrollReveal() {
    if (!document.body.classList.contains("sub-page")) return;

    const zone = document.getElementById("sub-hero-zone");
    const sections = [...document.querySelectorAll(".sub-section[data-reveal-seq]")];
    if (!sections.length) return;

    let contentRevealReady = false;
    const pendingSections = new Set();

    const readSeqTiming = (section) => {
      const read = (name, fallback) => {
        const raw = section.getAttribute(name);
        const n = Number(raw);
        return Number.isFinite(n) ? n : fallback;
      };
      return {
        lead: read("data-reveal-seq-base", 60),
        step: read("data-reveal-seq-step", 120),
      };
    };

    const buildSeqSteps = (section) => {
      const staggers = [...section.querySelectorAll("[data-reveal-stagger]")];
      const stSet = new Set(staggers);
      const nodes = [
        ...section.querySelectorAll(
          "[data-reveal-stagger], .reveal-up:not([data-reveal-managed])"
        ),
      ];
      const steps = [];
      for (const node of nodes) {
        if (node.matches("[data-reveal-stagger]")) {
          steps.push({ kind: "stagger", el: node });
          continue;
        }
        if (!node.matches(".reveal-up")) continue;
        if ([...stSet].some((st) => st !== node && st.contains(node))) continue;
        steps.push({ kind: "single", el: node });
      }
      return steps;
    };

    const runStagger = (container) => {
      const read = (name, fallback) => {
        const raw = container.getAttribute(name);
        const n = Number(raw);
        return Number.isFinite(n) ? n : fallback;
      };
      const children = [...container.querySelectorAll(".reveal-up")];
      const base = read("data-reveal-stagger-base", 90);
      const step = read("data-reveal-stagger-step", 120);
      children.forEach((el, idx) => {
        if (reduceMotion) reveal(el);
        else window.setTimeout(() => reveal(el), base + idx * step);
      });
    };

    const staggerTailMs = (container) => {
      const read = (name, fallback) => {
        const raw = container.getAttribute(name);
        const n = Number(raw);
        return Number.isFinite(n) ? n : fallback;
      };
      const n = container.querySelectorAll(".reveal-up").length;
      const base = read("data-reveal-stagger-base", 90);
      const step = read("data-reveal-stagger-step", 120);
      return base + Math.max(0, n - 1) * step + 140;
    };

    const getRevealedStepCount = (section) => {
      const raw = section.dataset.subRevealedStep;
      const n = Number(raw);
      return Number.isFinite(n) ? n : 0;
    };

    const markSectionRevealed = (section, revealedCount, totalSteps) => {
      section.dataset.subRevealedStep = String(revealedCount);
      if (revealedCount >= totalSteps) section.dataset.subRevealed = "true";
    };

    const revealSection = (section, { endStep } = {}) => {
      if (section.dataset.subRevealed === "true") return;

      const steps = buildSeqSteps(section);
      const startIdx = getRevealedStepCount(section);
      const endIdx = endStep !== undefined ? Math.min(endStep, steps.length) : steps.length;

      if (startIdx >= endIdx || !steps.length) {
        if (startIdx >= steps.length) section.dataset.subRevealed = "true";
        return;
      }

      const stepsToRun = steps.slice(startIdx, endIdx);
      const { lead, step } = readSeqTiming(section);

      if (reduceMotion) {
        stepsToRun.forEach((s) => {
          if (s.kind === "single") reveal(s.el);
          else runStagger(s.el);
        });
        markSectionRevealed(section, endIdx, steps.length);
        return;
      }

      let t = startIdx === 0 ? lead : 0;
      stepsToRun.forEach((s) => {
        if (s.kind === "single") {
          window.setTimeout(() => reveal(s.el), t);
          t += step;
        } else {
          window.setTimeout(() => runStagger(s.el), t);
          t += staggerTailMs(s.el);
        }
      });
      markSectionRevealed(section, endIdx, steps.length);
    };

    const revealHeroIntroSteps = () => {
      sections.forEach((section) => {
        const introCount = Number(section.getAttribute("data-reveal-hero-intro"));
        if (!Number.isFinite(introCount) || introCount <= 0) return;
        revealSection(section, { endStep: introCount });
      });
    };

    const tryRevealSection = (section) => {
      if (section.dataset.subRevealed === "true") return;
      if (!contentRevealReady) {
        pendingSections.add(section);
        return;
      }
      revealSection(section);
    };

    let io;

    const flushPending = () => {
      contentRevealReady = true;
      revealHeroIntroSteps();
      pendingSections.forEach((section) => {
        if (!isAtRevealLine(section)) return;
        revealSection(section);
        if (section.dataset.subRevealed === "true" && io) {
          io.unobserve(getRevealObserveTarget(section));
        }
      });
      pendingSections.clear();
    };

    const waitForHeroIntro = (cb) => {
      const fallbackMs = subHeroIntroEndMs() + 500;
      if (reduceMotion || !zone) {
        cb();
        return;
      }
      if (mqSubHeroMobile && mqSubHeroMobile.matches) {
        window.setTimeout(cb, subHeroIntroEndMs());
        return;
      }

      let settled = false;
      let mo;
      const finish = () => {
        if (settled) return;
        settled = true;
        if (mo) mo.disconnect();
        window.setTimeout(cb, SUB_HERO_TIMING.CONTENT_AFTER_ANCHOR);
      };

      if (zone.classList.contains("is-anchor-visible")) {
        finish();
        return;
      }

      mo = new MutationObserver(() => {
        if (!zone.classList.contains("is-anchor-visible")) return;
        finish();
      });
      mo.observe(zone, { attributes: true, attributeFilter: ["class"] });
      window.setTimeout(finish, fallbackMs);
    };

    const syncRevealedSections = () => {
      if (!contentRevealReady) return;
      sections.forEach((section) => {
        if (section.dataset.subRevealed === "true") return;
        if (!isAtRevealLine(section)) return;
        tryRevealSection(section);
        if (section.dataset.subRevealed === "true" && io) {
          io.unobserve(getRevealObserveTarget(section));
        }
      });
    };

    let scrollRaf = 0;
    const scheduleScrollSync = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        syncRevealedSections();
      });
    };

    const runSafetyNet = () => {
      if (!contentRevealReady) flushPending();
      syncRevealedSections();
    };

    if (!("IntersectionObserver" in window) || reduceMotion) {
      waitForHeroIntro(() => {
        revealHeroIntroSteps();
        sections.forEach(revealSection);
      });
      return;
    }

    /* preview.html iframe: 합성 wheel·IO 루트 불안정 — 스크롤 위치로 리빌 (site.js 스냅 보정과 동일) */
    if (window.__isPreviewIframe) {
      waitForHeroIntro(flushPending);

      window.addEventListener("scroll", scheduleScrollSync, { passive: true });
      window.addEventListener("message", (e) => {
        if (!e.data || e.data.type !== "preview-viewport-resize") return;
        requestAnimationFrame(syncRevealedSections);
      });
      document.addEventListener("sub-anchor-scroll-done", syncRevealedSections);
      window.setTimeout(runSafetyNet, subHeroIntroEndMs() + 2400);
      requestAnimationFrame(syncRevealedSections);
      return;
    }

    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const section = getRevealRoot(entry.target);
          if (!section?.matches(".sub-section[data-reveal-seq]") || !isAtRevealLine(section)) {
            return;
          }
          tryRevealSection(section);
          if (contentRevealReady && section.dataset.subRevealed === "true") {
            io.unobserve(entry.target);
          }
        });
      },
      SUB_VIEWPORT_REVEAL
    );

    sections.forEach((section) => io.observe(getRevealObserveTarget(section)));

    waitForHeroIntro(flushPending);

    document.addEventListener("sub-anchor-scroll-done", syncRevealedSections);

    /* 안전망 — 중앙선까지 올라온 섹션만 처리 (화면 밖 일괄 reveal 방지) */
    window.setTimeout(runSafetyNet, subHeroIntroEndMs() + 2400);
  })();

  /** 핵심 ↔ 차별점 브릿지 — 마스크 리빌 + 텍스트 등장 */
  (function initSubBridge() {
    const bridge = document.getElementById("sub-bridge");
    if (!bridge) return;

    const run = () => {
      if (bridge.dataset.revealed === "true") return;
      bridge.dataset.revealed = "true";
      bridge.classList.add("is-expanded");
      window.setTimeout(
        () => bridge.classList.add("is-text-visible"),
        reduceMotion ? 0 : 1180
      );
    };

    if (reduceMotion || !("IntersectionObserver" in window)) {
      bridge.classList.add("is-expanded", "is-text-visible");
      return;
    }

    if (window.__isPreviewIframe) {
      let scrollRaf = 0;
      const sync = () => {
        if (bridge.dataset.revealed === "true") return;
        if (!isAtRevealLine(bridge)) return;
        run();
      };
      const schedule = () => {
        if (scrollRaf) return;
        scrollRaf = requestAnimationFrame(() => {
          scrollRaf = 0;
          sync();
        });
      };
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("message", (e) => {
        if (!e.data || e.data.type !== "preview-viewport-resize") return;
        requestAnimationFrame(sync);
      });
      document.addEventListener("sub-anchor-scroll-done", sync);
      requestAnimationFrame(sync);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        if (!isAtRevealLine(bridge)) return;
        run();
        io.disconnect();
      },
      SUB_VIEWPORT_REVEAL
    );
    io.observe(getRevealObserveTarget(bridge));
  })();

  /** 섹션 셀렉트 — 스크롤 스파이 + 드롭다운 + 부드러운 이동 */
  (function initSubAnchorNav() {
    const nav = document.getElementById("sub-anchor-nav");
    const box = nav?.querySelector(".sub-section-select__box");
    const trigger = document.getElementById("sub-section-select-trigger");
    const triggerLabel = document.getElementById("sub-section-select-label");
    const menu = document.getElementById("sub-section-select-menu");
    if (!nav || !box || !menu) return;

    const options = [...menu.querySelectorAll(".sub-section-select__option")];
    const sections = options
      .map((link) => {
        const id = link.getAttribute("href")?.replace("#", "");
        return id ? document.getElementById(id) : null;
      })
      .filter(Boolean);

    if (!sections.length) return;

    const header = document.getElementById("site-header");
    const zone = document.getElementById("sub-hero-zone");

    /** sub_1·sub_2·sub_3 — 타이틀밴드 + 탭 sticky 레이아웃 */
    const usesTitleBandLayout = () =>
      document.documentElement.classList.contains("is-sub-title-band") &&
      (document.body.classList.contains("sub-page--dissolve-tab") ||
        document.body.classList.contains("sub-page--v2-band") ||
        document.body.classList.contains("sub-page--v3-band"));

    const getScrollAnchor = (section) =>
      section?.querySelector(".sub-section__head") || section;

    const readCssPx = (props, fallback = 0) => {
      const root = document.querySelector(".sub-page") || document.body;
      const cs = getComputedStyle(root);
      for (const prop of props) {
        const n = parseFloat(cs.getPropertyValue(prop));
        if (Number.isFinite(n) && n > 0) return n;
      }
      return fallback;
    };

    const getAnchorHeadGap = () => {
      const root = document.querySelector(".sub-page");
      const cs = root ? getComputedStyle(root) : null;
      const raw = cs?.getPropertyValue("--sub-anchor-head-gap");
      const n = parseFloat(raw);
      return Number.isFinite(n) ? n : 40;
    };

    /** sticky(히어로+탭+하단 60px) + 소타이틀 위 여유(40px) 아래에 본문이 보이도록 */
    const scrollOffset = () => {
      /* 타이틀밴드 — zone.bottom은 스크롤 전·후로 크게 달라져 앵커 목표가 어긋남 → CSS 고정값 사용 */
      if (zone && usesTitleBandLayout()) {
        const isV3HeaderHidden =
          document.body.classList.contains("sub-page--v3-band") &&
          document.documentElement.classList.contains("is-v3-header-hidden");
        const dockTop = isV3HeaderHidden
          ? 0
          : readCssPx(
              ["--sub-v3-tab-dock-top-effective", "--sub-v3-tab-dock-top", "--sub-v2-tab-dock-top", "--sub-dock-top"],
              header ? header.offsetHeight : 90
            );
        const tabHeight = readCssPx(
          ["--sub-v3-tab-height", "--sub-v2-tab-height", "--sub-tab-bar-height", "--sub-anchor-height"],
          zone.offsetHeight || 57
        );
        const tabBottomMask = readCssPx(["--sub-v3-tab-bottom-mask"], 0);
        return dockTop + tabHeight + tabBottomMask;
      }
      if (zone) {
        return zone.getBoundingClientRect().bottom;
      }
      const navH = header ? header.offsetHeight : 90;
      const selectH = 88;
      const root = document.querySelector(".sub-page");
      const cs = root ? getComputedStyle(root) : null;
      const heroH = parseFloat(cs?.getPropertyValue("--sub-hero-height-collapsed")) || 300;
      return navH + heroH + selectH;
    };

    const anchorContentLine = () => scrollOffset() + getAnchorHeadGap();

    const getSectionIndex = (id) => sections.findIndex((section) => section.id === id);

    const prepareAnchorScroll = (sectionIndex) => {
      heroCollapseCtl?.prepareForAnchorScroll(sectionIndex);
    };

    const closeMenu = () => {
      box.classList.remove("is-open");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    };

    const openMenu = () => {
      box.classList.add("is-open");
      if (trigger) trigger.setAttribute("aria-expanded", "true");
    };

    if (trigger) {
      trigger.addEventListener("click", () => {
        if (box.classList.contains("is-open")) closeMenu();
        else openMenu();
      });
    }

    document.addEventListener("click", (e) => {
      if (!box.contains(e.target)) closeMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    const setActive = (id) => {
      options.forEach((link) => {
        const match = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("is-active", match);
        link.setAttribute("aria-selected", match ? "true" : "false");
        if (match) {
          link.setAttribute("aria-current", "true");
          if (triggerLabel) {
            triggerLabel.textContent =
              link.dataset.label || link.querySelector(".sub-section-select__option-label")?.textContent?.trim() || "";
          }
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    const resolveAnchorScrollTop = (anchorEl) => {
      const raw = anchorEl.getBoundingClientRect().top + window.scrollY - anchorContentLine();
      return Math.max(0, raw);
    };

    let anchorTargetId = null;
    let anchorScrollRaf = 0;

    const clampScroll = (v, min, max) => Math.max(min, Math.min(max, v));

    /** 탭 이동 — ease-out-cubic · 거리 기반 480~680ms */
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const anchorScrollDuration = (dist) =>
      clampScroll(Math.round(420 + Math.abs(dist) * 0.12), 480, 680);

    const cancelAnchorScrollAnim = () => {
      if (!anchorScrollRaf) return;
      cancelAnimationFrame(anchorScrollRaf);
      anchorScrollRaf = 0;
    };

    const animateAnchorScrollTo = (targetY, onDone) => {
      cancelAnchorScrollAnim();

      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const end = clampScroll(targetY, 0, maxScroll);
      const start = window.scrollY;
      const dist = end - start;

      if (Math.abs(dist) < 2) {
        window.scrollTo(0, end);
        onDone?.();
        return;
      }

      const duration = anchorScrollDuration(dist);
      const t0 = performance.now();

      const tick = (now) => {
        const p = clampScroll((now - t0) / duration, 0, 1);
        window.scrollTo(0, start + dist * easeOutCubic(p));
        if (p < 1) {
          anchorScrollRaf = requestAnimationFrame(tick);
          return;
        }
        anchorScrollRaf = 0;
        window.scrollTo(0, end);
        onDone?.();
      };

      anchorScrollRaf = requestAnimationFrame(tick);
    };

    const settleAnchorScroll = (id) => {
      if (!id) {
        anchorTargetId = null;
        sync();
        return;
      }

      const target = document.getElementById(id);
      if (!target) {
        anchorTargetId = null;
        sync();
        return;
      }

      const anchor = getScrollAnchor(target);
      const top = resolveAnchorScrollTop(anchor);
      if (Math.abs(window.scrollY - top) > 3) {
        window.scrollTo(0, top);
      }

      anchorTargetId = id;
      setActive(id);
      sync();
      anchorTargetId = null;
    };

    const releaseAnchorScroll = (id) => {
      if (zone?.dataset.anchorScrolling !== "true") return;

      delete zone.dataset.anchorScrollTarget;
      delete zone.dataset.anchorScrolling;
      document.dispatchEvent(new CustomEvent("sub-anchor-scroll-done"));
      heroCollapseCtl?.finishAnchorScroll();

      /* sticky 전환·레이아웃 안정 후 목표 위치 재보정 — 탭 ON이 개요로 되돌아가는 현상 방지 */
      requestAnimationFrame(() => {
        requestAnimationFrame(() => settleAnchorScroll(id));
      });
    };

    const scrollToSection = (id, { behavior, updateHash = true } = {}) => {
      const target = document.getElementById(id);
      if (!target || !zone) return false;

      const sectionIndex = getSectionIndex(id);
      const useInstant = behavior === "auto" || reduceMotion;

      cancelAnchorScrollAnim();
      anchorTargetId = id;
      zone.dataset.anchorScrolling = "true";
      setActive(id);

      const runScroll = () => {
        prepareAnchorScroll(sectionIndex >= 0 ? sectionIndex : 0);
        const anchor = getScrollAnchor(target);
        const top = resolveAnchorScrollTop(anchor);
        zone.dataset.anchorScrollTarget = String(top);
        if (updateHash) {
          history.replaceState(null, "", `${location.pathname}${location.search}#${id}`);
        }

        if (useInstant) {
          window.scrollTo({ top, behavior: "auto" });
          releaseAnchorScroll(id);
          return;
        }

        animateAnchorScrollTo(top, () => releaseAnchorScroll(id));
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(runScroll);
      });
      return true;
    };

    const primeHeroForDeepLink = () => {
      const hero = zone?.querySelector(".sub-hero");
      if (hero) {
        hero.dataset.revealed = "true";
        hero.classList.add("is-expanded");
        revealAllHeroSteps(hero);
        zone.classList.add("is-expanded");
      }
      zone?.classList.add("is-anchor-visible");
      const hashId = location.hash.replace(/^#/, "");
      const hashIndex = hashId ? getSectionIndex(hashId) : 0;
      prepareAnchorScroll(hashIndex >= 0 ? hashIndex : 0);
    };

    options.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href || !href.startsWith("#")) return;
        const id = href.slice(1);
        if (!document.getElementById(id) || !zone) return;
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
        setActive(id);
        scrollToSection(id);
      });
    });

    const initialId = location.hash.replace(/^#/, "");
    const hasInitialHash = Boolean(initialId && document.getElementById(initialId));

    if (hasInitialHash) {
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      primeHeroForDeepLink();
      const html = document.documentElement;
      const prevScrollBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToSection(initialId, { behavior: "auto", updateHash: false });
          html.style.scrollBehavior = prevScrollBehavior;
        });
      });
    }

    window.addEventListener("hashchange", () => {
      const id = location.hash.replace(/^#/, "");
      if (id && document.getElementById(id)) scrollToSection(id, { updateHash: false });
    });

    const sync = () => {
      if (zone?.dataset.anchorScrolling === "true") return;
      if (anchorTargetId) {
        setActive(anchorTargetId);
        return;
      }
      const contentLine = anchorContentLine();
      let current = sections[0].id;

      if (usesTitleBandLayout()) {
        /* 타이틀밴드 — contentLine을 넘긴 마지막 섹션을 활성(가장 가까운 거리 방식은 경계에서 되돌림 유발) */
        for (const section of sections) {
          const head = getScrollAnchor(section);
          const top = head.getBoundingClientRect().top;
          if (top - contentLine <= 48) current = section.id;
        }
      } else {
        let bestDist = Infinity;
        for (const section of sections) {
          const head = getScrollAnchor(section);
          const top = head.getBoundingClientRect().top;
          if (top > contentLine + 48) continue;
          const dist = Math.abs(top - contentLine);
          if (dist < bestDist) {
            bestDist = dist;
            current = section.id;
          }
        }
      }

      setActive(current);
    };

    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    if (!hasInitialHash) sync();

    /** 위로가기 — 앵커 스크롤 취소 · 해시 제거 · 타이틀밴드 최상단(0)으로 이동 */
    const scrollToPageTop = () => {
      closeMenu();
      cancelAnchorScrollAnim();
      anchorTargetId = null;
      if (zone) {
        delete zone.dataset.anchorScrolling;
        delete zone.dataset.anchorScrollTarget;
        delete zone.dataset.anchorScrollCompact;
      }
      history.replaceState(null, "", `${location.pathname}${location.search}`);
      const firstId = sections[0]?.id || "overview";
      setActive(firstId);
      prepareAnchorScroll(0);

      const done = () => {
        heroCollapseCtl?.finishAnchorScroll();
        document.dispatchEvent(new CustomEvent("sub-anchor-scroll-done"));
      };

      if (reduceMotion) {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        done();
        return;
      }

      animateAnchorScrollTo(0, done);
    };

    window.__subScrollToPageTop = scrollToPageTop;
  })();

  /** FAQ 아코디언 — 단일 열림, 접근성 속성 동기화 */
  (function initSubFaq() {
    const root = document.querySelector("[data-sub-faq]");
    if (!root) return;

    const items = [...root.querySelectorAll(".sub-faq__item")];
    if (!items.length) return;

    const setItemOpen = (item, open) => {
      const trigger = item.querySelector(".sub-faq__trigger");
      const panel = item.querySelector(".sub-faq__panel");
      if (!trigger || !panel) return;

      item.classList.toggle("is-open", open);
      trigger.setAttribute("aria-expanded", String(open));
      panel.setAttribute("aria-hidden", String(!open));

      if (open) {
        panel.style.maxHeight = "none";
        const fullHeight = panel.scrollHeight;
        panel.style.maxHeight = "0";
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            panel.style.maxHeight = `${fullHeight}px`;
          });
        });
        const onTransitionEnd = (event) => {
          if (event.propertyName !== "max-height") return;
          panel.removeEventListener("transitionend", onTransitionEnd);
          if (item.classList.contains("is-open")) {
            panel.style.maxHeight = "none";
          }
        };
        panel.addEventListener("transitionend", onTransitionEnd);
      } else {
        panel.style.maxHeight = `${panel.scrollHeight}px`;
        requestAnimationFrame(() => {
          panel.style.maxHeight = "0";
        });
      }
    };

    const syncOpenPanelHeights = () => {
      items.forEach((item) => {
        if (!item.classList.contains("is-open")) return;
        const panel = item.querySelector(".sub-faq__panel");
        if (!panel) return;
        panel.style.maxHeight = "none";
        panel.style.maxHeight = `${panel.scrollHeight}px`;
        requestAnimationFrame(() => {
          if (item.classList.contains("is-open")) {
            panel.style.maxHeight = "none";
          }
        });
      });
    };

    const closeAll = (except) => {
      items.forEach((item) => {
        if (item !== except) setItemOpen(item, false);
      });
    };

    items.forEach((item) => {
      const trigger = item.querySelector(".sub-faq__trigger");
      if (!trigger) return;

      setItemOpen(item, false);

      trigger.addEventListener("click", () => {
        const willOpen = !item.classList.contains("is-open");
        if (willOpen) closeAll(item);
        setItemOpen(item, willOpen);
      });
    });

    window.addEventListener("resize", syncOpenPanelHeights);
  })();

  /** 기존 사이트 FAQ 아코디언 (레거시 본문) */
  (function initLegacyFaq() {
    const root = document.querySelector("[data-legacy-faq]");
    if (!root) return;

    const items = [...root.querySelectorAll(".accordion-list > li")];
    if (!items.length) return;

    const setOpen = (item, open) => {
      item.classList.toggle("on", open);
      const btn = item.querySelector(".btn-toggle-self");
      if (btn) btn.setAttribute("aria-expanded", String(open));
    };

    const closeAll = (except) => {
      items.forEach((item) => {
        if (item !== except) setOpen(item, false);
      });
    };

    items.forEach((item) => {
      const btn = item.querySelector(".btn-toggle-self");
      const tit = item.querySelector(".accordion-tit");
      if (!btn) return;

      setOpen(item, false);
      btn.setAttribute("aria-expanded", "false");

      const toggle = () => {
        const willOpen = !item.classList.contains("on");
        if (willOpen) closeAll(item);
        setOpen(item, willOpen);
      };

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      });

      if (tit) {
        tit.addEventListener("click", (e) => {
          if (e.target === btn || btn.contains(e.target)) return;
          toggle();
        });
      }
    });
  })();
})();
