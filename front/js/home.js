/**
 * 웅진IT 홈 — fullpage 스타일 섹션 스크롤
 */
(function () {
  const main = document.querySelector(".home-fullpage");
  if (!main) return;

  const sections = [...main.querySelectorAll(".home-section")];
  if (sections.length === 0) return;

  const pagination = document.querySelector(".home-pagination");
  const paginationButtons = pagination
    ? [...pagination.querySelectorAll("button[data-section]")]
    : [];

  const DURATION = 800;
  const WHEEL_THRESHOLD = 30;
  const WHEEL_GESTURE_END_DELAY = 160;
  const TOUCH_THRESHOLD = 50;
  const LIGHT_SECTION_INDEXES = new Set([2, 4]);

  let currentIndex = 0;
  let isScrolling = false;
  let wheelDelta = 0;
  let wheelDirection = 0;
  let isWheelGestureLocked = false;
  let wheelGestureTimer;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function getSectionSnapPoints(section) {
    const top = section.offsetTop;
    const vh = window.innerHeight;
    const maxScroll = top + section.offsetHeight - vh;

    if (section.offsetHeight <= vh) {
      return [top];
    }

    const points = [top];
    let scrollPos = top;

    while (scrollPos < maxScroll) {
      scrollPos = Math.min(scrollPos + vh, maxScroll);
      if (scrollPos > points[points.length - 1]) {
        points.push(scrollPos);
      }
    }

    return points;
  }

  function findNearestSnapPoint(points, scrollY) {
    let nearest = points[0];
    points.forEach((point) => {
      if (Math.abs(scrollY - point) < Math.abs(scrollY - nearest)) {
        nearest = point;
      }
    });
    return nearest;
  }

  function getNextScrollTarget(section, direction) {
    const points = getSectionSnapPoints(section);
    const scrollY = window.scrollY;
    const tolerance = 10;
    let snapIndex = 0;

    points.forEach((point, i) => {
      if (Math.abs(scrollY - point) <= tolerance) {
        snapIndex = i;
      }
    });

    if (Math.abs(scrollY - points[snapIndex]) > tolerance) {
      snapIndex = points.findIndex(
        (point, i) =>
          scrollY >= point - tolerance &&
          (i === points.length - 1 || scrollY < points[i + 1] - tolerance)
      );
      if (snapIndex === -1) {
        snapIndex = points.length - 1;
      }
    }

    if (direction > 0) {
      return snapIndex < points.length - 1 ? points[snapIndex + 1] : null;
    }

    return snapIndex > 0 ? points[snapIndex - 1] : null;
  }

  function getLastSection() {
    return sections[sections.length - 1];
  }

  function getLastSectionBottom() {
    const last = getLastSection();
    return last.offsetTop + last.offsetHeight;
  }

  function isInFooter() {
    return window.scrollY >= getLastSectionBottom() - 10;
  }

  function getSectionIndex() {
    const scrollY = window.scrollY;

    if (isInFooter()) {
      return sections.length - 1;
    }

    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;

      if (scrollY >= top - 10 && scrollY < bottom - 10) {
        return i;
      }
    }

    return 0;
  }

  function updateUI(index) {
    const safeIndex = Math.max(0, Math.min(index, sections.length - 1));
    const isLight = LIGHT_SECTION_INDEXES.has(safeIndex) && !isInFooter();
    const isOnSection1 = safeIndex === 0 && !isInFooter();

    sections.forEach((section, i) => {
      section.classList.toggle("is-active", i === safeIndex);
    });

    paginationButtons.forEach((button) => {
      const buttonIndex = Number(button.dataset.section);
      button.classList.toggle("is-active", buttonIndex === safeIndex);
    });

    if (pagination) {
      pagination.classList.toggle("is-light", isLight);
    }

    document.body.classList.toggle("is-on-section-1", isOnSection1);
  }

  function animateScrollTo(targetY, onComplete) {
    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();

    isScrolling = true;

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / DURATION, 1);
      const eased = easeInOutCubic(progress);

      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        isScrolling = false;
        currentIndex = getSectionIndex();
        updateUI(currentIndex);
        if (onComplete) onComplete();
      }
    }

    requestAnimationFrame(step);
  }

  function scrollToLastSection() {
    currentIndex = sections.length - 1;
    const points = getSectionSnapPoints(getLastSection());
    updateUI(currentIndex);
    animateScrollTo(points[0]);
  }

  function scrollToSection(index, fromDirection) {
    index = Math.max(0, Math.min(index, sections.length - 1));

    if (isScrolling && index === currentIndex) return;

    currentIndex = index;
    updateUI(currentIndex);

    const points = getSectionSnapPoints(sections[index]);
    const target =
      fromDirection === -1 ? points[points.length - 1] : points[0];
    animateScrollTo(target);
  }

  function scrollToFooter() {
    animateScrollTo(getLastSectionBottom(), () => {
      if (pagination) pagination.classList.add("is-light");
    });
  }

  function moveSection(direction) {
    if (isScrolling) return;

    currentIndex = getSectionIndex();

    if (isInFooter()) {
      if (direction > 0) return;
      scrollToLastSection();
      return;
    }

    const section = sections[currentIndex];
    const innerTarget = getNextScrollTarget(section, direction);

    if (innerTarget !== null) {
      animateScrollTo(innerTarget);
      return;
    }

    if (direction > 0) {
      if (currentIndex < sections.length - 1) {
        scrollToSection(currentIndex + 1);
      } else {
        scrollToFooter();
      }
    } else {
      scrollToSection(currentIndex - 1, -1);
    }
  }

  function normalizeWheelDelta(e) {
    if (e.deltaMode === WheelEvent.DOM_DELTA_LINE) {
      return e.deltaY * 16;
    }
    if (e.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
      return e.deltaY * window.innerHeight;
    }
    return e.deltaY;
  }

  function endWheelGesture() {
    wheelDelta = 0;
    wheelDirection = 0;
    isWheelGestureLocked = false;
  }

  function onWheel(e) {
    const deltaY = normalizeWheelDelta(e);
    if (deltaY === 0) return;

    if (isInFooter() && deltaY > 0) return;

    e.preventDefault();

    clearTimeout(wheelGestureTimer);
    wheelGestureTimer = setTimeout(endWheelGesture, WHEEL_GESTURE_END_DELAY);

    if (isInFooter() && deltaY < 0) {
      if (!isScrolling && !isWheelGestureLocked) {
        isWheelGestureLocked = true;
        scrollToLastSection();
      }
      return;
    }

    if (isScrolling || isWheelGestureLocked) return;

    const direction = deltaY > 0 ? 1 : -1;

    if (wheelDirection !== 0 && wheelDirection !== direction) {
      wheelDelta = 0;
    }

    wheelDirection = direction;
    wheelDelta += deltaY;

    if (Math.abs(wheelDelta) < WHEEL_THRESHOLD) return;

    isWheelGestureLocked = true;
    wheelDelta = 0;
    moveSection(direction);
  }

  function onKeydown(e) {
    const keyMap = {
      ArrowDown: 1,
      PageDown: 1,
      " ": 1,
      ArrowUp: -1,
      PageUp: -1,
    };

    if (e.key === "Home") {
      e.preventDefault();
      scrollToSection(0);
      return;
    }

    if (e.key === "End") {
      e.preventDefault();
      scrollToFooter();
      return;
    }

    if (!(e.key in keyMap)) return;
    if (isInFooter() && keyMap[e.key] > 0) return;

    e.preventDefault();
    moveSection(keyMap[e.key]);
  }

  let touchStartY = 0;

  function onTouchStart(e) {
    touchStartY = e.touches[0].clientY;
  }

  function onTouchEnd(e) {
    const diff = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(diff) < TOUCH_THRESHOLD) return;

    if (isInFooter() && diff < 0) {
      scrollToLastSection();
      return;
    }

    if (isInFooter() && diff > 0) return;

    moveSection(diff > 0 ? 1 : -1);
  }

  let snapTimer;
  let lastScrollY = window.scrollY;
  let scrollDirection = 0;

  function onScroll() {
    const scrollY = window.scrollY;

    if (scrollY > lastScrollY) scrollDirection = 1;
    else if (scrollY < lastScrollY) scrollDirection = -1;

    lastScrollY = scrollY;

    if (!isScrolling) {
      currentIndex = getSectionIndex();
      updateUI(currentIndex);
    }

    if (isScrolling) return;

    clearTimeout(snapTimer);
    snapTimer = setTimeout(() => {
      const footerTop = getLastSectionBottom();

      if (scrollY >= footerTop && scrollDirection < 0) {
        scrollToLastSection();
        return;
      }

      if (isInFooter()) return;

      const index = getSectionIndex();
      currentIndex = index;
      const points = getSectionSnapPoints(sections[index]);
      const nearest = findNearestSnapPoint(points, scrollY);

      if (Math.abs(scrollY - nearest) > 10) {
        animateScrollTo(nearest);
      }
    }, 100);
  }

  paginationButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const index = Number(button.dataset.section);
      if (Number.isNaN(index)) return;
      scrollToSection(index);
    });
  });

  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("keydown", onKeydown);
  document.addEventListener("touchstart", onTouchStart, { passive: true });
  document.addEventListener("touchend", onTouchEnd, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });

  window.addEventListener("resize", () => {
    const points = getSectionSnapPoints(sections[currentIndex]);
    window.scrollTo(0, findNearestSnapPoint(points, window.scrollY));
    updateUI(currentIndex);
  });

  currentIndex = getSectionIndex();
  updateUI(currentIndex);
})();

/**
 * section-1 히어로: 3개 영상 크로스페이드 루프 + 하단 세그먼트 네비 + 카피 전환
 * (wjit_design/sample 히어로 영상 롤링 참고)
 */
(function initHomeHeroVideos() {
  const section = document.getElementById("section-1");
  const heroMedia = section && section.querySelector(".home-hero-media");
  const navSegments = document.getElementById("home-hero-video-nav-segments");
  const videos = [
    document.getElementById("section-video-1"),
    document.getElementById("section-video-2"),
    document.getElementById("section-video-3"),
  ].filter(Boolean);
  const copies = section
    ? [...section.querySelectorAll(".home-hero-copy[data-hero-copy]")]
    : [];

  if (!section || !heroMedia || videos.length < 3) return;

  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const CROSSFADE_MS = reduceMotion ? 500 : 1200;
  const HEADLINE_EXIT_MS = 420;
  const HEADLINE_EXIT_STAGGER_MS = 150;
  const COPY_EXIT_MS = 280;

  const segmentEls = [];
  let activeIdx = 0;
  let visible = false;
  let transitioning = false;
  let swapTimer = 0;
  let copyTimer = 0;
  let hasRevealedOnce = false;

  const getActive = () => videos[activeIdx];
  const getCopy = (idx) =>
    copies.find((el) => Number(el.dataset.heroCopy) === idx) || copies[idx];

  const safePlay = (video) => {
    if (!video) return;
    const p = video.play?.();
    if (p && typeof p.catch === "function") p.catch(() => {});
  };

  const safePause = (video) => {
    if (!video) return;
    try {
      video.pause();
    } catch (_) {}
  };

  const clearCrossfadeClass = () => {
    heroMedia.classList.remove("is-crossfading");
  };

  const waitForCanPlay = (video, fallbackMs = 500) =>
    new Promise((resolve) => {
      if (!video) {
        resolve();
        return;
      }
      if (video.readyState >= 2) {
        resolve();
        return;
      }
      const done = () => resolve();
      video.addEventListener("canplay", done, { once: true });
      window.setTimeout(done, fallbackMs);
    });

  const clearTransitionTimers = () => {
    if (swapTimer) {
      clearTimeout(swapTimer);
      swapTimer = 0;
    }
    if (copyTimer) {
      clearTimeout(copyTimer);
      copyTimer = 0;
    }
  };

  const updateNav = (idx, progressRatio) => {
    segmentEls.forEach((seg, i) => {
      const fill = seg.querySelector(".home-hero-video-nav__segment-fill");
      seg.classList.toggle("is-active", i === idx);
      seg.classList.toggle("is-complete", i < idx);
      seg.setAttribute("aria-selected", i === idx ? "true" : "false");
      if (!fill) return;
      if (i !== idx) fill.style.width = "0%";
      else fill.style.width = `${Math.min(100, Math.max(0, progressRatio * 100))}%`;
    });
  };

  const getVideoProgress = (video) => {
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) {
      return 0;
    }
    return Math.min(1, Math.max(0, video.currentTime / video.duration));
  };

  const syncNavProgress = () => {
    updateNav(activeIdx, getVideoProgress(getActive()));
  };

  const buildNav = () => {
    if (!navSegments) return;
    navSegments.innerHTML = "";
    segmentEls.length = 0;
    for (let i = 0; i < videos.length; i += 1) {
      const seg = document.createElement("button");
      seg.type = "button";
      seg.className = "home-hero-video-nav__segment";
      seg.setAttribute("role", "tab");
      seg.setAttribute("aria-label", `배너 ${i + 1}`);
      seg.setAttribute("aria-selected", i === 0 ? "true" : "false");
      seg.dataset.slideIndex = String(i);
      seg.innerHTML = '<span class="home-hero-video-nav__segment-fill"></span>';
      seg.addEventListener("click", () => {
        const idx = Number(seg.dataset.slideIndex);
        if (!Number.isFinite(idx)) return;
        goToSlide(idx);
      });
      navSegments.appendChild(seg);
      segmentEls.push(seg);
    }
  };

  const getCopyExitMs = (copyEl) => {
    const lineCount = copyEl
      ? copyEl.querySelectorAll(".home-hero-title__line-in").length
      : 2;
    const headlineExit =
      HEADLINE_EXIT_MS + Math.max(0, lineCount - 1) * HEADLINE_EXIT_STAGGER_MS;
    return Math.max(headlineExit, COPY_EXIT_MS);
  };

  const resetCopyInline = (copyEl) => {
    if (!copyEl) return;
    copyEl.querySelectorAll(".home-hero-title__line-in").forEach((el) => {
      el.style.animation = "";
      el.style.transform = "";
      el.style.opacity = "";
    });
    [".home-hero-desc", ".home-hero-cta"].forEach((sel) => {
      const el = copyEl.querySelector(sel);
      if (!el) return;
      el.style.animation = "";
      el.style.transform = "";
      el.style.opacity = "";
    });
  };

  const revealCopy = (idx) => {
    const copyEl = getCopy(idx);
    if (!copyEl) return;

    copies.forEach((el) => {
      const isTarget = Number(el.dataset.heroCopy) === idx;
      el.classList.remove("is-active", "is-revealing", "is-exiting");
      el.setAttribute("aria-hidden", isTarget ? "false" : "true");
      if (!isTarget) resetCopyInline(el);
    });

    copyEl.classList.add("is-active");
    resetCopyInline(copyEl);
    void copyEl.offsetHeight;
    copyEl.classList.add("is-revealing");
  };

  const swapCopy = (targetIdx) => {
    const current = getCopy(activeIdx);
    const next = getCopy(targetIdx);
    if (!next) return Promise.resolve();

    if (reduceMotion || !current || current === next) {
      revealCopy(targetIdx);
      return Promise.resolve();
    }

    current.classList.remove("is-revealing");
    current.classList.add("is-exiting");

    return new Promise((resolve) => {
      copyTimer = window.setTimeout(() => {
        current.classList.remove("is-active", "is-exiting");
        current.setAttribute("aria-hidden", "true");
        resetCopyInline(current);
        revealCopy(targetIdx);
        resolve();
      }, getCopyExitMs(current));
    });
  };

  const finishTransition = (nextIdx) => {
    const prev = videos[activeIdx];
    const next = videos[nextIdx];
    prev.classList.remove("is-active", "is-incoming");
    clearCrossfadeClass();
    next.classList.remove("is-incoming");
    next.classList.add("is-active");
    safePause(prev);
    try {
      prev.currentTime = 0;
    } catch (_) {}
    activeIdx = nextIdx;
    syncNavProgress();
  };

  const goToSlide = async (targetIdx) => {
    if (!visible || transitioning || targetIdx === activeIdx) return;
    if (targetIdx < 0 || targetIdx >= videos.length) return;

    const active = getActive();
    const next = videos[targetIdx];
    transitioning = true;
    clearTransitionTimers();
    clearCrossfadeClass();

    swapCopy(targetIdx);

    try {
      next.currentTime = 0;
    } catch (_) {}
    next.classList.add("is-incoming");
    try {
      if (next.readyState < 2) next.load();
    } catch (_) {}

    await waitForCanPlay(next, 500);
    if (!visible) {
      transitioning = false;
      next.classList.remove("is-incoming");
      return;
    }

    safePlay(next);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        heroMedia.classList.add("is-crossfading");
      });
    });

    swapTimer = window.setTimeout(() => {
      finishTransition(targetIdx);
      safePause(active);
      safePlay(next);
      transitioning = false;
    }, CROSSFADE_MS);
  };

  const goToNext = () => goToSlide((activeIdx + 1) % videos.length);

  videos.forEach((v) => {
    v.defaultMuted = true;
    v.muted = true;
    v.loop = false;
    v.removeAttribute("loop");
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    try {
      v.pause();
    } catch (_) {}
    try {
      v.load();
    } catch (_) {}

    v.addEventListener("canplay", () => {
      if (visible && v === getActive() && v.paused && !transitioning) {
        safePlay(v);
      }
    });

    v.addEventListener("timeupdate", () => {
      if (!visible || v !== getActive()) return;
      syncNavProgress();

      if (!Number.isFinite(v.duration) || v.duration <= 0) return;
      const remaining = v.duration - v.currentTime;
      if (remaining > 3) return;
      const upcoming = videos[(activeIdx + 1) % videos.length];
      try {
        if (upcoming.readyState < 2) upcoming.load();
      } catch (_) {}
    });

    v.addEventListener("ended", () => {
      if (!visible || v !== getActive() || transitioning) return;
      goToNext();
    });
  });

  buildNav();

  const syncHeroVisibility = () => {
    if (!visible) {
      clearTransitionTimers();
      clearCrossfadeClass();
      transitioning = false;
      videos.forEach((v) => {
        v.classList.remove("is-incoming");
        safePause(v);
      });
      copies.forEach((el) => {
        el.classList.remove("is-revealing", "is-exiting");
      });
      return;
    }

    syncNavProgress();
    const active = getActive();
    if (active.paused && !transitioning && active.readyState >= 2) {
      safePlay(active);
    }

    if (!hasRevealedOnce) {
      hasRevealedOnce = true;
      revealCopy(activeIdx);
    } else {
      const current = getCopy(activeIdx);
      if (current && !current.classList.contains("is-revealing")) {
        current.classList.add("is-active", "is-revealing");
      }
    }
  };

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.target === section);
        if (!hit) return;
        visible = hit.isIntersecting && hit.intersectionRatio > 0.08;
        syncHeroVisibility();
      },
      { threshold: [0, 0.06, 0.08, 0.12, 0.2] }
    );
    io.observe(section);
  } else {
    visible = true;
    syncHeroVisibility();
    safePlay(getActive());
  }

  /* 모바일·패드: 가로 스와이프로 배너 전환 */
  const mqHeroSwipe = window.matchMedia(
    "(max-width: 719px), ((width: 768px) and (orientation: portrait)), ((width: 820px) and (orientation: portrait)), ((width: 1024px) and (orientation: portrait))"
  );
  const HERO_SWIPE_THRESHOLD_PX = 44;
  const HERO_SWIPE_AXIS_RATIO = 1.35;
  let heroSwipeTracking = false;
  let heroSwipeStartX = 0;
  let heroSwipeStartY = 0;

  const isHeroSwipeTarget = (target) => {
    if (!(target instanceof Element)) return false;
    if (target.closest(".home-hero-video-nav")) return false;
    if (target.closest("a, button, input, textarea, select, label")) return false;
    return Boolean(target.closest("#section-1"));
  };

  const tryHeroSwipe = (endX, endY) => {
    if (!mqHeroSwipe.matches || !visible || transitioning) return;
    const dx = endX - heroSwipeStartX;
    const dy = endY - heroSwipeStartY;
    if (Math.abs(dx) < HERO_SWIPE_THRESHOLD_PX) return;
    if (Math.abs(dx) < Math.abs(dy) * HERO_SWIPE_AXIS_RATIO) return;
    const nextIdx =
      dx < 0
        ? (activeIdx + 1) % videos.length
        : (activeIdx - 1 + videos.length) % videos.length;
    goToSlide(nextIdx);
  };

  section.addEventListener("pointerdown", (e) => {
    if (!mqHeroSwipe.matches || !visible || e.button !== 0) return;
    if (!isHeroSwipeTarget(e.target)) return;
    heroSwipeTracking = true;
    heroSwipeStartX = e.clientX;
    heroSwipeStartY = e.clientY;
  });

  section.addEventListener("pointerup", (e) => {
    if (!heroSwipeTracking) return;
    heroSwipeTracking = false;
    tryHeroSwipe(e.clientX, e.clientY);
  });

  section.addEventListener("pointercancel", () => {
    heroSwipeTracking = false;
  });
})();
