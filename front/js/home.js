// 히어로 인트로: 좌상단 모서리를 기준으로 clip-path 사각형이 커지며 열리는 리빌 (로드 시 1회)
(function () {
  const hero = document.querySelector(".home-sec1");
  if (!hero) return;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      hero.classList.add("is-intro-revealed");
    });
  });
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

  new Swiper(swiperEl, {
    slidesPerView: "auto",
    spaceBetween: 16,
    centeredSlides: true,
    loop: true,
    speed: 10000,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    watchOverflow: true,
    navigation: {
      prevEl: newsListWrap.querySelector(".news-list-prev"),
      nextEl: newsListWrap.querySelector(".news-list-next"),
    },
    breakpoints: {
      1025: {
        spaceBetween: 24,
        centeredSlides: true,
      },
    },
  });
})();

// sec4 case list swiper
(function () {
  if (typeof Swiper === "undefined") return;

  const caseList = document.querySelector(".case-list");
  if (!caseList) return;

  const swiperEl = caseList.querySelector(".swiper");
  if (!swiperEl) return;

  new Swiper(swiperEl, {
    slidesPerView: 1,
    spaceBetween: 10,
    loop: true,
    speed: 600,
    watchOverflow: true,
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

  const scrollToSection = (index) => {
    if (index < 0 || index >= sections.length) return;

    syncQuickNav(index);

    const targetY = getTargetY(index);
    const startY = window.scrollY;
    const distance = targetY - startY;
    if (Math.abs(distance) < 1) {
      window.scrollTo(0, targetY);
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
    syncQuickNav(getActiveIndex());
  };

  quickNavLinks.forEach((link) => {
    link.addEventListener("click", () => scrollToSection(Number(link.dataset.index)));
  });

  window.addEventListener("wheel", handleWheel, { passive: false });
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("scroll", handleScroll, { passive: true });

  syncQuickNav(getActiveIndex());
})();
