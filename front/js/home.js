// 히어로 인트로: 좌상단 모서리를 기준으로 clip-path 사각형이 커지며 열리는 리빌 (로드 시 1회)
// 헤더·퀵네비·스크롤 버튼은 리빌이 시작되기 전까지 숨기고, is-intro-revealed 2초 뒤 노출
(function () {
  const hero = document.querySelector(".home-sec1");
  if (!hero) return;

  const chrome = [
    document.querySelector("header"),
    document.querySelector(".home-quick-nav"),
    document.querySelector(".scroll-action-home"),
  ].filter(Boolean);

  chrome.forEach((el) => {
    el.style.opacity = "0";
  });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      hero.classList.add("is-intro-revealed");
      window.setTimeout(() => {
        chrome.forEach((el) => {
          el.style.opacity = "1";
        });
      }, 1000);
    });
  });
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

// 히어로 배경 영상 롤링: 영상 재생이 끝나면 다음 슬라이드로 크로스페이드 전환 + 하단 네비(활성 상태·진행률) 동기화
(function () {
  const items = Array.from(document.querySelectorAll(".home-visual-item"));
  const navItems = Array.from(document.querySelectorAll(".home-visual-nav-item"));
  if (items.length < 2) return;

  const videos = items.map((item) => item.querySelector(".home-visual-video"));

  let activeIndex = items.findIndex((item) => item.classList.contains("is-active"));
  if (activeIndex < 0) activeIndex = 0;

  const setNavFill = (index, ratio) => {
    const fill = navItems[index] && navItems[index].querySelector(".home-visual-nav-fill");
    if (fill) fill.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
  };

  const activate = (index) => {
    const prevIndex = activeIndex;
    if (prevIndex === index) return;
    activeIndex = index;

    items.forEach((item, i) => item.classList.toggle("is-active", i === index));
    navItems.forEach((navItem, i) => {
      navItem.classList.toggle("is-active", i === index);
      if (i !== index) setNavFill(i, 0);
    });

    const prevVideo = videos[prevIndex];
    if (prevVideo) {
      prevVideo.pause();
      prevVideo.currentTime = 0;
    }

    const nextVideo = videos[index];
    if (nextVideo) {
      nextVideo.currentTime = 0;
      const playPromise = nextVideo.play();
      if (playPromise && playPromise.catch) playPromise.catch(() => {});
    }
  };

  const goToNext = () => activate((activeIndex + 1) % items.length);

  videos.forEach((video, i) => {
    if (!video) return;

    video.addEventListener("ended", () => {
      if (i === activeIndex) goToNext();
    });

    video.addEventListener("timeupdate", () => {
      if (i !== activeIndex || !video.duration) return;
      setNavFill(i, video.currentTime / video.duration);
    });
  });

  navItems.forEach((navItem, i) => {
    navItem.addEventListener("click", () => activate(i));
  });
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
  const TICKER_SPEED = 5000;
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

  const pauseTicker = () => {
    swiper.autoplay.stop();
    freezeTranslate();
  };

  const resumeTicker = () => {
    swiper.params.speed = TICKER_SPEED;
    swiper.autoplay.start();
  };

  newsListWrap.addEventListener("mouseenter", () => {
    if (!isDesktop()) return;
    hovering = true;
    pauseTicker();
  });

  newsListWrap.addEventListener("mouseleave", () => {
    if (!isDesktop()) return;
    hovering = false;
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
// - 배너 인트로: 클립 마스크 리빌(좌상단 기준) + 이미지 줌아웃 + 텍스트/리스트 순차 등장
//   섹션에 스크롤로 진입하기 전까지는 재생하지 않고, 진입한 뒤에는 자동 롤링으로 슬라이드가
//   바뀔 때마다(loop 클론 포함) 새로 활성화된 슬라이드에 매번 다시 재생한다
// - 하단 리스트 자동 롤링: Swiper autoplay
(function () {
  if (typeof Swiper === "undefined") return;

  const caseList = document.querySelector(".case-list");
  if (!caseList) return;

  const swiperEl = caseList.querySelector(".swiper");
  if (!swiperEl) return;

  const swiper = new Swiper(swiperEl, {
    slidesPerView: 1,
    spaceBetween: 10,
    loop: true,
    speed: 600,
    // 좌우로 밀려 들어오는 기본 슬라이드 전환은 clip-path 마스크 리빌과 동시에 돌면
    // 두 애니메이션이 겹쳐 보여서, 밀기 없이 크로스페이드만 쓰고 마스크 리빌이 전환 효과를 전담하게 함
    effect: "fade",
    fadeEffect: { crossFade: true },
    watchOverflow: true,
    // autoplay: {
    //   delay: 5000,
    //   disableOnInteraction: false,
    // },
    pagination: {
      el: caseList.querySelector(".case-list-pagination"),
      clickable: true,
    },
    breakpoints: {
      1025: {
        spaceBetween: 0,
      },
    },
  });

  const section = document.querySelector(".home-sec4");
  if (!section || !("IntersectionObserver" in window)) return;

  const revealActiveSlide = () => {
    const activeSlide = swiperEl.querySelector(".swiper-slide-active");
    if (!activeSlide) return;
    const banner = activeSlide.querySelector(".case-banner");
    const items = activeSlide.querySelector(".case-items");
    if (banner) banner.classList.add("is-revealed");
    if (items) items.classList.add("is-revealed");
  };

  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      revealActiveSlide();
      // 진입 이후엔 자동 롤링으로 슬라이드가 바뀔 때마다 새 활성 슬라이드를 매번 리빌
      swiper.on("slideChangeTransitionStart", revealActiveSlide);
      io.disconnect();
    },
    { threshold: 0.2 }
  );

  io.observe(section);
})();

// main.home 섹션 풀스크린 스냅 스크롤 + 퀵네비 연동 (PC 전용: 휠/키보드)
// - 섹션이 뷰포트 높이 이내면 휠/키보드 1회당 한 화면씩 다음/이전 섹션으로 이동(ease-out-quad 이징)
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

  const easeOutQuad = (t) => t * (2 - t);
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
      window.scrollTo(0, startY + distance * easeOutQuad(progress));

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
