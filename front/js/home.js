// 히어로 인트로: 좌상단 모서리를 기준으로 clip-path 사각형이 커지며 열리는 리빌 (로드 시 1회)
// 헤더·퀵네비·스크롤 버튼은 리빌이 시작되기 전까지 숨기고, is-intro-revealed 뒤 노출
// 영상은 is-active를 유지해 좌상단 clip-path로 열리고,
// 카피는 숨김 자세로 고정했다가 마스크가 완전히 열린 뒤(샘플과 동일) 아래→위 등장을 재생
(function () {
  const hero = document.querySelector(".home-sec1");
  if (!hero) return;

  const chrome = [
    document.querySelector("header"),
    document.querySelector(".home-quick-nav"),
    document.querySelector(".scroll-action-home"),
  ].filter(Boolean);
  const activeItem = hero.querySelector(".home-visual-item.is-active");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  chrome.forEach((el) => {
    el.style.opacity = "0";
  });

  if (activeItem && !reduceMotion) {
    activeItem.classList.add("is-copy-reset");
  }

  // is-copy-reset 해제 시 is-active 상태의 transition으로 등장 재생
  let copyRevealed = false;
  const revealCopy = () => {
    if (copyRevealed || !activeItem) return;
    copyRevealed = true;
    activeItem.classList.remove("is-copy-reset");
  };

  hero.addEventListener("transitionend", (e) => {
    if (e.target === hero && e.propertyName === "clip-path") revealCopy();
  });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      hero.classList.add("is-intro-revealed");
      if (activeItem && !reduceMotion) {
        // transitionend 누락 대비
        window.setTimeout(revealCopy, 1400);
      }
      window.setTimeout(() => {
        chrome.forEach((el) => {
          el.style.opacity = "1";
        });
      }, 1000);
    });
  });
})();

// 헤더 하단 보더: home-sec1이 헤더 아래로 완전히 지나가면 is-past-hero 부여
(function () {
  const hero = document.querySelector(".home-sec1");
  const header = document.querySelector("header");
  if (!hero || !header) return;

  const update = () => {
    const past = hero.getBoundingClientRect().bottom <= header.offsetHeight;
    header.classList.toggle("is-past-hero", past);
  };

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
})();

// home-sec2: 스크롤 진입 시 1회 — 타이틀/설명 등장 후 카드 순차 리빌
// 모바일·태블릿: 페이드 + 상승 + 블러 / 데스크톱(1440+): 카드 좌→우 clip-path 와이프
(function () {
  const section = document.querySelector(".home-sec2");
  if (!section) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const textEls = [
    section.querySelector(".home-sec-title"),
    section.querySelector(".home-sec-info"),
  ];
  const cards = Array.from(section.querySelectorAll(".business-item"));
  const reveal = (el) => el && el.classList.add("is-revealed");

  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    textEls.forEach(reveal);

    const base = 220;
    const step = 110;
    cards.forEach((card, i) => {
      if (reduceMotion) {
        reveal(card);
        return;
      }
      window.setTimeout(() => reveal(card), base + i * step);
    });
  };

  if (reduceMotion || !("IntersectionObserver" in window)) {
    run();
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      run();
      io.disconnect();
    },
    { threshold: 0.26, rootMargin: "0px 0px -24% 0px" }
  );
  io.observe(section);
})();

// 성장스토리(home-sec5): 스크롤 진입 시 1회 — 화이트 배경 → 좌→우 clip-path 마스크 리빌 → 상단 문구 등장
// → 카드가 마스크 완료 시점부터 하나씩 순차 등장(그와 동시에 카운트업) → 카드 등장이 끝나면 연혁 리스트 노출
(function () {
  const section = document.querySelector(".home-sec5");
  if (!section) return;

  const clip = section.querySelector(".home-sec5-bg-clip");
  const cards = Array.from(section.querySelectorAll(".home-growth-card"));
  const historyList = section.querySelector(".home-history-list");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mqNarrow = window.matchMedia("(max-width: 1024px)");

  const formatCount = (n, type) => {
    if (type === "revenue") return `${n.toLocaleString("ko-KR")}억+`;
    if (type === "clients") return `${n.toLocaleString("ko-KR")}+`;
    if (type === "professionals") return n.toLocaleString("en-US");
    if (type === "experience") return `${n}년+`;
    // number: 접미사는 HTML에 두고 숫자만 올린다 (영문 B+ / + Years)
    if (type === "number") return String(n);
    return n.toLocaleString("ko-KR");
  };

  const animateCounter = (el) => {
    const target = Number(el.dataset.growthCount || "0");
    const type = el.dataset.growthFormat || "";
    if (!Number.isFinite(target) || target <= 0) return;

    if (reduceMotion) {
      el.textContent = formatCount(target, type);
      return;
    }

    const duration = 880;
    const startTime = performance.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      el.textContent = formatCount(Math.round(target * easeOutCubic(progress)), type);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const revealCards = () => {
    const step = mqNarrow.matches ? 300 : 520;

    cards.forEach((card, i) => {
      const counterEl = card.querySelector("[data-growth-count]");
      const run = () => {
        card.classList.add("is-revealed");
        if (counterEl) animateCounter(counterEl);
      };
      if (reduceMotion) {
        run();
        return;
      }
      window.setTimeout(run, i * step);
    });

    if (!historyList) return;
    if (reduceMotion) {
      historyList.classList.add("is-revealed");
      return;
    }
    // 카드가 순차적으로 다 등장을 "시작"한 직후(마지막 카드 스태거 + 여유)에 연혁 리스트 노출
    window.setTimeout(() => historyList.classList.add("is-revealed"), (cards.length - 1) * step + 140);
  };

  const startEntry = () => {
    if (reduceMotion || !clip) {
      section.classList.add("is-growth-bg-open", "is-content-ready");
      revealCards();
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        section.classList.add("is-growth-bg-open");
      });
    });

    let maskDone = false;
    const finishMask = () => {
      if (maskDone) return;
      maskDone = true;
      section.classList.add("is-content-ready");
      revealCards();
    };

    clip.addEventListener(
      "transitionend",
      (e) => {
        if (e.propertyName === "clip-path") finishMask();
      },
      { once: true }
    );

    window.setTimeout(finishMask, 1400);
  };

  if (!("IntersectionObserver" in window)) {
    startEntry();
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      startEntry();
      io.disconnect();
    },
    { threshold: 0.2 }
  );

  io.observe(section);
})();

// 히어로 배경 영상 롤링: 5초마다 다음 슬라이드로 전환 + 하단 네비(활성 상태·진행률) 동기화
// - 퇴장 슬라이드는 is-leaving으로 불투명하게 아래에 두고 신규 슬라이드만 위에서 페이드 인(흰 배경 노출 방지)
// - 카피는 샘플과 동일하게 기존 카피가 위로 빠진 뒤(COPY_EXIT_MS) 신규 카피 등장
(function () {
  const hero = document.querySelector(".home-sec1");
  const items = Array.from(document.querySelectorAll(".home-visual-item"));
  const navItems = Array.from(document.querySelectorAll(".home-visual-nav-item"));
  if (items.length < 2) return;

  const SLIDE_DURATION = 5000;
  const FADE_MS = 1000;
  // 제목 퇴장 0.42s + 2번째 줄 스태거 0.15s
  const COPY_EXIT_MS = 570;
  const mqDesktop = window.matchMedia("(min-width: 1025px)");
  const visibleVideo = (item) => {
    if (!item) return null;
    return item.querySelector(mqDesktop.matches ? ".home-visual-video.pc" : ".home-visual-video.mo");
  };
  const stopVideo = (video) => {
    if (!video) return;
    video.pause();
    if (video.readyState > 0) video.currentTime = 0;
  };
  // display 전환·autoplay로 숨은 영상이 다시 재생되면 즉시 멈춘다
  items.forEach((item) => {
    item.querySelectorAll(".home-visual-video").forEach((video) => {
      video.addEventListener("play", () => {
        const wanted = video === visibleVideo(item) && item.classList.contains("is-active");
        if (!wanted) video.pause();
      });
    });
  });
  const playVisible = (item) => {
    const video = visibleVideo(item);
    if (!video) return;
    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise && playPromise.catch) playPromise.catch(() => {});
  };
  // 뷰포트에 맞는 영상만 재생하고, 반대 사이즈 영상은 멈춘다
  const syncVisibleVideos = () => {
    items.forEach((item, i) => {
      item.querySelectorAll(".home-visual-video").forEach((video) => {
        const show =
          (mqDesktop.matches && video.classList.contains("pc")) ||
          (!mqDesktop.matches && video.classList.contains("mo"));
        if (!show || i !== activeIndex) stopVideo(video);
      });
      if (i === activeIndex) playVisible(item);
    });
  };
  let leaveTimerId = null;

  let activeIndex = items.findIndex((item) => item.classList.contains("is-active"));
  if (activeIndex < 0) activeIndex = 0;

  let slideStartedAt = 0;
  let slideRafId = null;
  let slideTimerId = null;

  const setNavFill = (index, ratio) => {
    const fill = navItems[index] && navItems[index].querySelector(".home-visual-nav-fill");
    if (fill) fill.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
  };

  const stopSlideTimer = () => {
    if (slideRafId) {
      cancelAnimationFrame(slideRafId);
      slideRafId = null;
    }
    if (slideTimerId) {
      clearTimeout(slideTimerId);
      slideTimerId = null;
    }
  };

  const tickNavFill = () => {
    const elapsed = performance.now() - slideStartedAt;
    setNavFill(activeIndex, elapsed / SLIDE_DURATION);
    if (elapsed < SLIDE_DURATION) {
      slideRafId = requestAnimationFrame(tickNavFill);
    }
  };

  const startSlideTimer = () => {
    stopSlideTimer();
    slideStartedAt = performance.now();
    setNavFill(activeIndex, 0);
    slideRafId = requestAnimationFrame(tickNavFill);
    slideTimerId = window.setTimeout(() => {
      activate((activeIndex + 1) % items.length);
    }, SLIDE_DURATION);
  };

  const activate = (index) => {
    const prevIndex = activeIndex;
    if (prevIndex === index) {
      startSlideTimer();
      return;
    }
    activeIndex = index;

    // 이전 전환이 끝나기 전에 다시 전환되면 남아 있던 퇴장 슬라이드를 즉시 정리
    if (leaveTimerId) {
      clearTimeout(leaveTimerId);
      leaveTimerId = null;
    }
    if (hero) hero.style.setProperty("--copy-in-base", `${COPY_EXIT_MS}ms`);

    items.forEach((item, i) => {
      item.classList.remove("is-copy-reset");
      item.classList.toggle("is-leaving", i === prevIndex);
      item.classList.toggle("is-active", i === index);
    });
    navItems.forEach((navItem, i) => {
      navItem.classList.toggle("is-active", i === index);
      if (i !== index) setNavFill(i, 0);
    });

    const prevItem = items[prevIndex];
    leaveTimerId = window.setTimeout(() => {
      leaveTimerId = null;
      prevItem.classList.remove("is-leaving");
      prevItem.querySelectorAll(".home-visual-video").forEach(stopVideo);
    }, FADE_MS);

    playVisible(items[index]);

    startSlideTimer();
  };

  navItems.forEach((navItem, i) => {
    navItem.addEventListener("click", () => activate(i));
  });

  // 모바일/태블릿 좌우 스와이프: 놓는 순간 이전/다음 배너로 전환(전환 연출은 기존 페이드 그대로)
  // - PC 폭에서도 터치 입력(가로 모드 태블릿)은 허용, 마우스 드래그는 1024px 이하에서만
  // - 세로 이동은 페이지 스크롤에 맡기고(touch-action: pan-y), 가로로 판정된 경우만 처리
  const SWIPE_THRESHOLD = 48;
  let swipe = null;
  let suppressClick = false;
  if (hero) {
    hero.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      if (mqDesktop.matches && e.pointerType !== "touch") return;
      if (e.target.closest(".home-visual-nav")) return;
      swipe = { x: e.clientX, y: e.clientY, axis: null, pid: e.pointerId };
    });
    hero.addEventListener(
      "pointermove",
      (e) => {
        if (!swipe || e.pointerId !== swipe.pid) return;
        const dx = e.clientX - swipe.x;
        const dy = e.clientY - swipe.y;
        if (!swipe.axis && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
          swipe.axis = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
          if (swipe.axis === "x") {
            try {
              hero.setPointerCapture(e.pointerId);
            } catch (err) {
              /* capture unsupported */
            }
          }
        }
        if (swipe.axis === "x") e.preventDefault();
      },
      { passive: false }
    );
    const endSwipe = (e) => {
      if (!swipe || e.pointerId !== swipe.pid) return;
      const dx = e.clientX - swipe.x;
      const axis = swipe.axis;
      swipe = null;
      if (axis !== "x") return;
      // 스와이프 직후 따라오는 click(버튼)만 막고 바로 해제
      suppressClick = true;
      window.setTimeout(() => {
        suppressClick = false;
      }, 0);
      if (e.type === "pointercancel" || Math.abs(dx) < SWIPE_THRESHOLD) return;
      const len = items.length;
      activate(dx < 0 ? (activeIndex + 1) % len : (activeIndex - 1 + len) % len);
    };
    hero.addEventListener("pointerup", endSwipe);
    hero.addEventListener("pointercancel", endSwipe);
    hero.addEventListener(
      "click",
      (e) => {
        if (!suppressClick) return;
        e.preventDefault();
        e.stopPropagation();
        suppressClick = false;
      },
      true
    );
  }

  if (mqDesktop.addEventListener) mqDesktop.addEventListener("change", syncVisibleVideos);
  else mqDesktop.addListener(syncVisibleVideos);

  syncVisibleVideos();
  startSlideTimer();
})();

// sec3 news list swiper
(function () {
  if (typeof Swiper === "undefined") return;

  const newsListWrap = document.querySelector(".news-list-wrap");
  if (!newsListWrap) return;

  const swiperEl = newsListWrap.querySelector(".swiper");
  if (!swiperEl) return;

  const prevEl = newsListWrap.querySelector(".news-list-prev");
  const nextEl = newsListWrap.querySelector(".news-list-next");
  const TICKER_SPEED = 15000;
  const NAV_SPEED = 500;
  const isDesktop = () => window.matchMedia("(min-width: 1025px)").matches;

  let hovering = false;

  const swiper = new Swiper(swiperEl, {
    slidesPerView: "auto",
    spaceBetween: 16,
    centeredSlides: true,
    loop: true,
    speed: TICKER_SPEED,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    allowTouchMove: true,
    watchOverflow: false,
    loopPreventsSliding: false,
    breakpoints: {
      1025: {
        spaceBetween: 24,
        centeredSlides: true,
      },
    },
  });

  const freezeTranslate = () => {
    const current = swiper.getTranslate();
    swiper.setTransition(0);
    swiper.setTranslate(current);
    swiper.animating = false;
  };

  // 재개용 이어가기 애니메이션 식별자 (도중에 다시 정지·네비 이동하면 이전 콜백 무효화)
  let resumeToken = 0;

  const pauseTicker = () => {
    resumeToken += 1;
    swiper.autoplay.stop();
    freezeTranslate();
  };

  // 멈춘 위치에서 바로 autoplay를 시작하면 "남은 거리 + 다음 한 칸"을 TICKER_SPEED 안에 가버려
  // 순간적으로 빨라지므로, 현재 목표 snap까지 남은 거리를 원래 티커 속도로 먼저 이어간 뒤 autoplay 재개
  const resumeTicker = () => {
    swiper.params.speed = TICKER_SPEED;

    const current = swiper.getTranslate();
    const target = -swiper.snapGrid[swiper.snapIndex];
    const step = (swiper.slidesSizesGrid[0] || 0) + (Number(swiper.params.spaceBetween) || 0);
    const remaining = current - target;

    if (!step || !Number.isFinite(target) || remaining <= 1) {
      swiper.autoplay.start();
      return;
    }

    const token = ++resumeToken;
    const duration = (TICKER_SPEED * remaining) / step;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      swiper.wrapperEl.removeEventListener("transitionend", onEnd);
      if (token !== resumeToken || hovering || navBusy || pendingDelta !== 0) return;
      if (!swiper.autoplay.running) swiper.autoplay.start();
    };
    const onEnd = (e) => {
      if (e.target === swiper.wrapperEl) finish();
    };

    swiper.wrapperEl.addEventListener("transitionend", onEnd);
    swiper.setTransition(duration);
    swiper.setTranslate(target);
    window.setTimeout(finish, duration + 80);
  };

  // 카드(a.news-card)에 마우스가 올라가 있는 동안 티커 일시 정지, 카드 밖으로 나가면 재개
  swiperEl.addEventListener("mouseover", (e) => {
    if (!isDesktop() || hovering) return;
    if (!e.target.closest(".news-card")) return;
    hovering = true;
    pauseTicker();
  });

  swiperEl.addEventListener("mouseout", (e) => {
    if (!isDesktop() || !hovering) return;
    if (e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(".news-card")) return;
    hovering = false;
    if (navBusy || pendingDelta !== 0) return;
    resumeTicker();
  });

  // 연속 티커 도중 네비 클릭 시 translate/index가 어긋날 수 있어
  // 가장 가까운 snap에 맞춘 뒤 slidePrev/Next(루프 정상 처리)로 한 칸씩 이동.
  // 연타 시에는 애니메이션을 끊지 않고 큐에 쌓아 순차 처리한다.
  // (slideTo로 인덱스 wrap 하면 전체 트랙을 가로지르는 오동작이 난다)
  let pendingDelta = 0;
  let navBusy = false;

  const snapToClosest = () => {
    const current = swiper.getTranslate();
    swiper.setTransition(0);
    swiper.setTranslate(current);
    swiper.animating = false;

    let closest = 0;
    let minDist = Infinity;
    swiper.snapGrid.forEach((snap, i) => {
      const dist = Math.abs(current + snap);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    swiper.slideTo(closest, 0);
  };

  const resumeTickerIfNeeded = () => {
    if (hovering || !isDesktop()) return;
    swiper.params.speed = TICKER_SPEED;
    if (!swiper.autoplay.running) swiper.autoplay.start();
  };

  const runNav = () => {
    if (navBusy || pendingDelta === 0) return;

    swiper.autoplay.stop();

    // 티커/호버 정지 직후 첫 스텝만 snap 보정. 큐 이어서 갈 때는 이미 snap 위에 있다.
    if (swiper.params.speed !== NAV_SPEED) snapToClosest();

    const step = pendingDelta > 0 ? 1 : -1;
    pendingDelta -= step;
    navBusy = true;
    swiper.params.speed = NAV_SPEED;

    let settled = false;
    const settle = () => {
      if (settled) return;
      settled = true;
      swiper.off("transitionEnd", settle);
      navBusy = false;

      if (pendingDelta !== 0) {
        runNav();
        return;
      }
      resumeTickerIfNeeded();
    };

    swiper.on("transitionEnd", settle);
    if (step > 0) swiper.slideNext(NAV_SPEED);
    else swiper.slidePrev(NAV_SPEED);

    // transition이 스킵되는 경우 대비
    window.setTimeout(settle, NAV_SPEED + 80);
  };

  const slideByNav = (direction) => {
    if (!isDesktop()) return;
    pendingDelta += direction === "next" ? 1 : -1;
    pendingDelta = Math.max(-8, Math.min(8, pendingDelta));
    runNav();
  };

  swiper.on("transitionEnd", () => {
    if (navBusy || pendingDelta !== 0) return;
    resumeTickerIfNeeded();
  });

  prevEl?.addEventListener("click", () => slideByNav("prev"));
  nextEl?.addEventListener("click", () => slideByNav("next"));
})();

// sec4 case list swiper + 고객성공사례 배너 인트로
// - 첫 진입: 좌상단 clip 마스크 + 줌아웃 → 문구 순차 → 리스트 순차
// - PC/태블릿 자동 롤링(6초): 마스크와 리스트를 매번 다시 재생, 섹션 호버 시 일시정지
// - PC/태블릿 라인 네비(클릭·드래그·방향키): 첫 진입과 같이 마스크·문구·리스트를 다시 재생
// - 모바일: 같은 첫 진입, 이후에는 배너·리스트 영역 좌우 터치 스와이프로 이동(리스트는 제자리에서 내용만 교체)
(function () {
  if (typeof Swiper === "undefined") return;

  const caseList = document.querySelector(".case-list");
  if (!caseList) return;

  const swiperEl = caseList.querySelector(".swiper");
  const paginationEl = caseList.querySelector(".case-list-pagination");
  if (!swiperEl) return;

  const section = document.querySelector(".home-sec4");
  const mqDesktop = window.matchMedia("(min-width: 1025px)");

  // 모바일: 배너만 좌우로 밀고, 리스트는 슬라이드 밖 고정 영역에서 내용만 교체한다(샘플 동일).
  const staticItems = document.createElement("ul");
  staticItems.className = "case-items case-items-static";
  caseList.appendChild(staticItems);
  const SWIPE_THRESHOLD = 48;
  const SWIPE_SPEED = 400;

  let swiper = null;
  let entered = false;
  let hovering = false;
  let suppressClick = false;
  let lastRealIndex = 0;
  const replayIds = new WeakMap();

  const activeSlide = () => swiper && swiper.slides[swiper.activeIndex];

  const syncAutoplay = () => {
    if (!swiper || !swiper.autoplay || !entered) return;
    if (hovering && mqDesktop.matches) swiper.autoplay.stop();
    else swiper.autoplay.start();
  };

  const showInstant = (slide) => {
    if (!slide) return;
    replayIds.set(slide, (replayIds.get(slide) || 0) + 1);
    const banner = slide.querySelector(".case-banner");
    const items = slide.querySelector(".case-items");
    banner?.classList.add("is-instant", "is-revealed");
    items?.classList.add("is-instant", "is-revealed");
  };

  const replay = (slide) => {
    if (!slide) return;
    const token = (replayIds.get(slide) || 0) + 1;
    replayIds.set(slide, token);
    const banner = slide.querySelector(".case-banner");
    const items = slide.querySelector(".case-items");
    if (!banner) return;

    const animated = slide.querySelectorAll(
      ".case-banner-clip, .thumb, .cate, .tit, .desc, .case-item"
    );
    banner.classList.remove("is-revealed", "is-instant");
    items?.classList.remove("is-revealed", "is-instant");
    animated.forEach((el) => {
      el.style.transition = "none";
    });
    void banner.offsetWidth;
    animated.forEach((el) => {
      el.style.transition = "";
    });

    window.requestAnimationFrame(() => {
      if (replayIds.get(slide) !== token) return;
      banner.classList.add("is-revealed");
      items?.classList.add("is-revealed");
    });
  };

  // mode: "hidden"(인트로 대기) | "replay"(첫 진입 순차 등장) | "instant"(즉시 교체)
  const renderStaticItems = (mode) => {
    if (mqDesktop.matches) return;
    const source = activeSlide()?.querySelector(".case-items");
    staticItems.innerHTML = source ? source.innerHTML : "";
    staticItems.classList.remove("is-revealed", "is-instant");
    if (mode === "instant") {
      staticItems.classList.add("is-instant", "is-revealed");
    } else if (mode === "replay") {
      void staticItems.offsetWidth;
      window.requestAnimationFrame(() => staticItems.classList.add("is-revealed"));
    }
  };

  const onSlideChange = () => {
    if (!entered || !swiper) return;
    const real = swiper.realIndex;
    if (real === lastRealIndex) return;
    lastRealIndex = real;
    const slide = activeSlide();
    if (mqDesktop.matches) {
      replay(slide);
    } else {
      showInstant(slide);
      renderStaticItems("instant");
    }
  };

  const createSwiper = (index) => {
    if (swiper) swiper.destroy(true, true);

    const desktop = mqDesktop.matches;
    swiper = new Swiper(swiperEl, {
      slidesPerView: 1,
      spaceBetween: desktop ? 0 : 10,
      // 모바일 loop는 복제 슬라이드 보정 때문에 첫 진입 인덱스가 밀린다.
      // rewind로 끝에서 처음으로 순환하고, PC/태블릿은 페이드 loop를 유지한다.
      loop: desktop,
      rewind: !desktop,
      // PC/태블릿 페이드 시간을 두면 이전 배너가 새 마스크 뒤에 남는다. 전환은 즉시 하고 마스크가 연출을 맡는다.
      speed: desktop ? 0 : SWIPE_SPEED,
      // PC/태블릿은 밀기 없이 크로스페이드. 마스크 리빌이 전환을 맡는다.
      // 모바일은 배너·리스트 스와이프에 맞춰 좌우로 이동한다.
      effect: desktop ? "fade" : "slide",
      fadeEffect: { crossFade: true },
      allowTouchMove: false,
      watchOverflow: true,
      autoplay: {
        delay: 6000,
        disableOnInteraction: false,
      },
      pagination: paginationEl
        ? {
            el: paginationEl,
            clickable: true,
          }
        : undefined,
    });

    swiper.on("slideChangeTransitionStart", onSlideChange);
    swiper.autoplay?.stop();

    const startIndex = Number.isFinite(index) ? index : 0;
    if (startIndex) {
      if (desktop) swiper.slideToLoop(startIndex, 0);
      else swiper.slideTo(startIndex, 0);
    }
    lastRealIndex = swiper.realIndex;
    renderStaticItems(entered ? "instant" : "hidden");

    if (!entered) return;

    if (desktop) showInstant(activeSlide());
    else swiper.slides.forEach((slide) => showInstant(slide));
    syncAutoplay();
  };

  const enterSection = () => {
    if (entered) return;
    entered = true;
    lastRealIndex = swiper.realIndex;
    swiper.slides.forEach((slide, i) => {
      const attr = slide.getAttribute("data-swiper-slide-index");
      const real = attr == null || attr === "" ? i : Number(attr);
      if (real === swiper.realIndex) replay(slide);
      else if (!mqDesktop.matches) showInstant(slide);
    });
    renderStaticItems("replay");
    hovering = !!section?.matches(":hover");
    syncAutoplay();
  };

  createSwiper(0);

  const onModeChange = () => {
    const index = swiper ? swiper.realIndex : 0;
    createSwiper(index);
  };
  if (mqDesktop.addEventListener) mqDesktop.addEventListener("change", onModeChange);
  else mqDesktop.addListener(onModeChange);

  if (section) {
    section.addEventListener("mouseenter", () => {
      hovering = true;
      syncAutoplay();
    });
    section.addEventListener("mouseleave", () => {
      hovering = false;
      syncAutoplay();
    });
  }

  if (paginationEl) {
    paginationEl.tabIndex = 0;

    const indexFromX = (clientX) => {
      const rect = paginationEl.getBoundingClientRect();
      const count = paginationEl.querySelectorAll(".swiper-pagination-bullet").length || 1;
      if (!rect.width) return swiper ? swiper.realIndex : 0;
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      return Math.max(0, Math.min(count - 1, Math.floor((x / rect.width) * count)));
    };

    const goToNav = (index) => {
      if (!swiper || !mqDesktop.matches || !entered) return;
      if (index === swiper.realIndex) return;
      swiper.slideToLoop(index);
    };

    let navDrag = null;
    paginationEl.addEventListener("pointerdown", (e) => {
      if (!mqDesktop.matches || !entered || e.button !== 0) return;
      navDrag = { last: indexFromX(e.clientX) };
      paginationEl.classList.add("is-dragging");
      paginationEl.setPointerCapture(e.pointerId);
      goToNav(navDrag.last);
      e.preventDefault();
    });
    paginationEl.addEventListener("pointermove", (e) => {
      if (!navDrag) return;
      const index = indexFromX(e.clientX);
      if (index === navDrag.last) return;
      navDrag.last = index;
      goToNav(index);
    });
    const endNavDrag = (e) => {
      if (!navDrag) return;
      navDrag = null;
      paginationEl.classList.remove("is-dragging");
      try {
        paginationEl.releasePointerCapture(e.pointerId);
      } catch (err) {
        /* already released */
      }
      syncAutoplay();
    };
    paginationEl.addEventListener("pointerup", endNavDrag);
    paginationEl.addEventListener("pointercancel", endNavDrag);
    paginationEl.addEventListener("keydown", (e) => {
      if (!mqDesktop.matches || !swiper || !entered) return;
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      if (e.key === "ArrowRight") swiper.slideNext();
      else swiper.slidePrev();
    });
  }

  // 모바일 터치/마우스 스와이프: 배너와 고정 리스트 어디서든 좌우로 넘길 수 있다.
  // 세로 이동은 페이지 스크롤에 맡기고(touch-action: pan-y), 가로로 판정된 뒤에만 배너를 끈다.
  const SWIPE_AREA = ".case-banner, .case-items-static";
  let clipDrag = null;
  caseList.addEventListener(
    "pointerdown",
    (e) => {
      if (mqDesktop.matches || !swiper || !entered || e.button !== 0) return;
      if (!e.target.closest(SWIPE_AREA)) return;
      clipDrag = {
        x: e.clientX,
        y: e.clientY,
        axis: null,
        base: swiper.getTranslate(),
        pid: e.pointerId,
      };
    },
    true
  );
  caseList.addEventListener(
    "pointermove",
    (e) => {
      if (!clipDrag || e.pointerId !== clipDrag.pid || !swiper) return;
      const dx = e.clientX - clipDrag.x;
      const dy = e.clientY - clipDrag.y;
      if (!clipDrag.axis && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
        clipDrag.axis = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
        if (clipDrag.axis === "x") {
          caseList.classList.add("is-dragging");
          try {
            caseList.setPointerCapture(e.pointerId);
          } catch (err) {
            /* capture unsupported */
          }
          swiper.autoplay?.stop();
        }
      }
      if (clipDrag.axis !== "x") return;
      e.preventDefault();
      swiper.setTransition(0);
      swiper.setTranslate(clipDrag.base + dx);
    },
    { passive: false }
  );
  const endClipDrag = (e) => {
    if (!clipDrag || e.pointerId !== clipDrag.pid || !swiper) return;
    const dx = e.clientX - clipDrag.x;
    const axis = clipDrag.axis;
    const base = clipDrag.base;
    clipDrag = null;
    caseList.classList.remove("is-dragging");
    if (axis !== "x") return;

    // 드래그 직후 따라오는 click(링크 이동)만 막고, 다음 탭은 정상 동작하도록 바로 해제
    suppressClick = true;
    window.setTimeout(() => {
      suppressClick = false;
    }, 0);
    // pointercancel은 좌표를 믿을 수 없으므로 제자리로 복귀
    if (e.type !== "pointercancel" && Math.abs(dx) >= SWIPE_THRESHOLD) {
      // 드래그로 translate가 스냅 지점을 벗어나면 slidePrev가 엉뚱한 슬라이드를 고르므로 목표를 직접 계산(끝↔처음 순환)
      const last = swiper.slides.length - 1;
      const idx = swiper.activeIndex;
      const target = dx < 0 ? (idx >= last ? 0 : idx + 1) : idx <= 0 ? last : idx - 1;
      swiper.slideTo(target, SWIPE_SPEED);
    } else {
      swiper.setTransition(300);
      swiper.setTranslate(base);
    }
    syncAutoplay();
  };
  caseList.addEventListener("pointerup", endClipDrag);
  caseList.addEventListener("pointercancel", endClipDrag);
  caseList.addEventListener(
    "click",
    (e) => {
      if (!suppressClick) return;
      if (!e.target.closest(SWIPE_AREA)) return;
      e.preventDefault();
      e.stopPropagation();
      suppressClick = false;
    },
    true
  );

  if (!section || !("IntersectionObserver" in window)) {
    enterSection();
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      enterSection();
      io.disconnect();
    },
    { threshold: 0.2 }
  );
  io.observe(section);
})();

// main.home 섹션 풀스크린 스냅 스크롤 + 퀵네비 연동 (PC 전용: 휠/키보드)
// - 섹션이 뷰포트 높이 이내면 휠/키보드 1회당 한 화면씩 다음/이전 섹션으로 이동(CSS ease-out 이징)
// - 섹션이 뷰포트보다 크면 내부는 기본 스크롤을 허용하고, 섹션 상/하단 끝에서만 다음 화면으로 전환
// - 마지막 섹션 이후 푸터 영역에서 위로 스크롤하면 스크롤 다운과 동일하게 한 화면씩 마지막 섹션으로 복귀
// - 모바일 터치는 가로채지 않고 완전한 자연 스크롤로 둔다(참고한 샘플 페이지도 동일한 방식:
//   site.css에서 scroll-snap-type을 꺼두고 site.js도 wheel/keydown만 처리, 터치 핸들러 없음)
// - 우측 퀵네비: 로드 시 및 스크롤 시 활성 항목 동기화, 섹션 톤(data-tone="dark")에 따라 색상 전환
// - 좁은 화면(<=1024px)에서는 서브픽셀 반올림으로 이전 섹션이 살짝 비치지 않도록 보정값을 더 둠
(function () {
  const main = document.querySelector("main.home");
  if (!main) return;

  const sections = Array.from(main.querySelectorAll(":scope > section"));
  if (sections.length < 2) return;

  const lastIndex = sections.length - 1;

  const quickNav = document.querySelector(".home-quick-nav");
  const quickNavLinks = quickNav ? Array.from(quickNav.querySelectorAll("a[data-index]")) : [];
  const scrollAction = document.querySelector(".scroll-action-home");
  const btnTop = scrollAction && scrollAction.querySelector(".scroll-top");
  const btnBtm = scrollAction && scrollAction.querySelector(".scroll-btm");

  const mqNarrow = window.matchMedia("(max-width: 1024px)");

  let isAnimating = false;
  let rafId = null;

  // CSS ease-out과 동일한 cubic-bezier(0, 0, 0.58, 1): 진행률 t에 해당하는 곡선 값을 뉴턴법으로 계산
  const cubicBezier = (x1, y1, x2, y2) => {
    const bx = (u) => 3 * x1 * u * (1 - u) * (1 - u) + 3 * x2 * u * u * (1 - u) + u * u * u;
    const by = (u) => 3 * y1 * u * (1 - u) * (1 - u) + 3 * y2 * u * u * (1 - u) + u * u * u;
    const dbx = (u) => 3 * x1 * (1 - u) * (1 - u) + 6 * (x2 - x1) * u * (1 - u) + 3 * (1 - x2) * u * u;
    return (t) => {
      if (t <= 0) return 0;
      if (t >= 1) return 1;
      let u = t;
      for (let i = 0; i < 8; i++) {
        const d = dbx(u);
        if (Math.abs(d) < 1e-6) break;
        u -= (bx(u) - t) / d;
        u = Math.min(1, Math.max(0, u));
      }
      return by(u);
    };
  };
  const easeOut = cubicBezier(0, 0, 0.58, 1);
  const getEdge = () => (mqNarrow.matches ? 3 : 1);

  // 좁은 화면 보정: 반올림 오차로 이전 섹션이 1~2px 비치는 것을 막기 위해 진행 방향으로 살짝 더 이동
  const getTargetY = (index) => {
    const raw = sections[index].offsetTop;
    return mqNarrow.matches ? Math.round(raw) + 2 : Math.round(raw);
  };

  const getActiveIndex = () => {
    const scrollTop = window.scrollY;
    const edge = getEdge();
    let index = 0;
    sections.forEach((section, i) => {
      if (scrollTop + edge >= section.offsetTop) index = i;
    });
    return index;
  };

  const isAtBottomEdge = (section) => section.getBoundingClientRect().bottom <= window.innerHeight + getEdge();
  const isAtTopEdge = (section) => section.getBoundingClientRect().top >= -getEdge();

  // 마지막 섹션의 하단이 뷰포트 하단보다 위로 올라가 푸터가 보이기 시작한 상태
  const isInFooterZone = () => sections[lastIndex].getBoundingClientRect().bottom < window.innerHeight - getEdge();

  const syncQuickNav = (index) => {
    if (!quickNav) return;
    quickNavLinks.forEach((link) => {
      link.classList.toggle("is-active", Number(link.dataset.index) === index);
    });
    quickNav.classList.toggle("is-dark", sections[index]?.dataset.tone === "dark");
  };

  // PC: 히어로=아래만, 중간=위+아래, 푸터=위만
  // 모바일: 샘플 #mobile-scroll-top과 같이 히어로를 지난 뒤에만 위로가기 노출
  const syncScrollAction = (index) => {
    if (!scrollAction) return;

    if (mqNarrow.matches) {
      const hero = sections[0];
      const pastHero = hero
        ? window.scrollY >= hero.offsetTop + hero.offsetHeight - 48
        : window.scrollY > window.innerHeight * 0.45;
      scrollAction.classList.toggle("is-mobile-top-visible", pastHero);
      scrollAction.classList.remove("is-at-hero", "is-at-end");
      return;
    }

    scrollAction.classList.remove("is-mobile-top-visible");
    const atHero = index === 0;
    const atEnd = !atHero && isInFooterZone();
    scrollAction.classList.toggle("is-at-hero", atHero);
    scrollAction.classList.toggle("is-at-end", atEnd);
    if (btnTop) {
      btnTop.setAttribute("aria-label", atEnd ? "페이지 최상단으로 이동" : "이전 섹션으로 이동");
    }
  };

  const syncChrome = (index) => {
    syncQuickNav(index);
    syncScrollAction(index);
  };

  const scrollToSection = (index) => {
    if (index < 0 || index >= sections.length) return;

    syncChrome(index);

    const targetY = getTargetY(index);
    const startY = window.scrollY;
    const distance = targetY - startY;
    if (Math.abs(distance) < 1) {
      window.scrollTo(0, targetY);
      syncChrome(getActiveIndex());
      return;
    }

    const html = document.documentElement;
    const prevScrollBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    const duration = Math.min(900, Math.max(400, Math.abs(distance) * 0.5));
    const startTime = performance.now();
    isAnimating = true;
    if (rafId) cancelAnimationFrame(rafId);

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      window.scrollTo(0, startY + distance * easeOut(progress));

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        isAnimating = false;
        rafId = null;
        html.style.scrollBehavior = prevScrollBehavior;
        syncChrome(getActiveIndex());
      }
    };

    rafId = requestAnimationFrame(tick);
  };

  // 휠/키보드가 공유하는 판단 로직. 섹션 전환을 실행했으면 true(입력 이벤트를 preventDefault 해야 함)를 반환
  const tryNavigate = (goingDown) => {
    if (isAnimating) return true;

    if (!goingDown && isInFooterZone()) {
      scrollToSection(lastIndex);
      return true;
    }

    const activeIndex = getActiveIndex();
    const activeSection = sections[activeIndex];

    if (goingDown) {
      if (activeIndex >= lastIndex || !isAtBottomEdge(activeSection)) return false;
      scrollToSection(activeIndex + 1);
      return true;
    }

    if (activeIndex <= 0 || !isAtTopEdge(activeSection)) return false;
    scrollToSection(activeIndex - 1);
    return true;
  };

  const handleWheel = (e) => {
    if (e.deltaY === 0) return;
    if (tryNavigate(e.deltaY > 0)) e.preventDefault();
  };

  const isFormFocused = () => {
    const el = document.activeElement;
    if (!el) return false;
    return el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable;
  };

  const handleKeydown = (e) => {
    if (isFormFocused()) return;

    const key = e.key;
    const isDownKey = key === "ArrowDown" || key === "PageDown" || key === " ";
    const isUpKey = key === "ArrowUp" || key === "PageUp";
    if (!isDownKey && !isUpKey) return;

    // 스페이스바는 포커스된 버튼/링크의 기본 클릭 동작과 겹치므로 그 경우엔 건드리지 않음
    const activeTag = document.activeElement && document.activeElement.tagName;
    if (key === " " && (activeTag === "A" || activeTag === "BUTTON")) return;

    if (tryNavigate(isDownKey)) e.preventDefault();
  };

  const handleScroll = () => {
    if (isAnimating) return;
    syncChrome(getActiveIndex());
  };

  quickNavLinks.forEach((link) => {
    link.addEventListener("click", () => scrollToSection(Number(link.dataset.index)));
  });

  if (btnTop) {
    btnTop.addEventListener("click", () => {
      if (mqNarrow.matches || isInFooterZone()) {
        scrollToSection(0);
        return;
      }
      const index = getActiveIndex();
      if (index > 0) scrollToSection(index - 1);
    });
  }

  if (btnBtm) {
    btnBtm.addEventListener("click", () => {
      const index = getActiveIndex();
      if (index < lastIndex) {
        scrollToSection(index + 1);
        return;
      }
      const footer = document.querySelector("footer");
      if (footer) window.scrollTo({ top: footer.offsetTop, behavior: "smooth" });
    });
  }

  window.addEventListener("wheel", handleWheel, { passive: false });
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", () => syncChrome(getActiveIndex()), { passive: true });

  syncChrome(getActiveIndex());
})();
