(function () {
  const heroItems = Array.from(document.querySelectorAll(".home-visual-item"));
  const navItems = Array.from(document.querySelectorAll(".home-visual-nav-item"));
  if (heroItems.length < 2) return;

  const ROTATE_MS = 6000;

  let heroIndex = heroItems.findIndex((item) => item.classList.contains("is-active"));
  if (heroIndex < 0) heroIndex = 0;
  let startTime = performance.now();

  const setFill = (index, ratio) => {
    const fill = navItems[index]?.querySelector(".home-visual-nav-fill");
    if (fill) fill.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
  };

  const render = () => {
    heroItems.forEach((item, i) => item.classList.toggle("is-active", i === heroIndex));
    navItems.forEach((navItem, i) => {
      navItem.classList.toggle("is-active", i === heroIndex);
      setFill(i, 0);
    });
  };

  const goTo = (index) => {
    heroIndex = ((index % heroItems.length) + heroItems.length) % heroItems.length;
    startTime = performance.now();
    render();
  };

  const tick = (now) => {
    const ratio = (now - startTime) / ROTATE_MS;
    setFill(heroIndex, ratio);
    if (ratio >= 1) {
      goTo(heroIndex + 1);
    }
    requestAnimationFrame(tick);
  };

  render();
  requestAnimationFrame(tick);

  navItems.forEach((navItem, i) => {
    navItem.addEventListener("click", () => goTo(i));
  });
})();

(function () {
  const main = document.querySelector("main.home");
  if (!main) return;

  const sections = Array.from(main.querySelectorAll(":scope > section"));
  const total = sections.length;
  if (!total) return;

  const header = document.querySelector("header");
  const TRANSPARENT_HEADER_SECTIONS = ["home-sec1"];

  const quickNavLinks = Array.from(document.querySelectorAll(".home-quick-nav [data-index]"));

  const ANIM_MS = 700;
  const EDGE = 14; // 섹션 경계 판정 여유값(px)

  let current = 0;
  let animating = false;
  let freeScroll = false; // true while scrolling naturally past the last section into the footer
  let touchStartY = 0;

  // 섹션별 실제 렌더 높이를 매번 측정 — 콘텐츠가 100vh를 넘는 섹션(예: 카드가 많은 home-sec2)도 대응
  const layouts = () =>
    sections.map((el) => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const height = el.offsetHeight;
      return { top, bottom: top + height, height };
    });

  const indexFromScroll = (L, scrollY) => {
    const anchor = scrollY + 1;
    for (let i = 0; i < L.length; i++) {
      if (anchor >= L[i].top && anchor < L[i].bottom) return i;
    }
    return anchor < L[0].top ? 0 : L.length - 1;
  };

  const renderQuickNav = () => {
    quickNavLinks.forEach((link) => {
      link.classList.toggle("is-active", Number(link.dataset.index) === current);
    });
  };

  const updateHeaderTransparency = () => {
    if (!header) return;
    const activeSection = sections[current];
    const isTransparent = TRANSPARENT_HEADER_SECTIONS.some((cls) => activeSection?.classList.contains(cls));
    header.classList.toggle("transparent", isTransparent);
  };

  const setCurrent = (index) => {
    if (index === current) return;
    current = index;
    renderQuickNav();
    updateHeaderTransparency();
  };

  const scrollToIndex = (index, smooth = true) => {
    if (index < 0 || index >= total) return;
    const top = layouts()[index].top;
    animating = true;
    setCurrent(index);
    window.scrollTo({
      top,
      behavior: smooth ? "smooth" : "auto",
    });
    window.clearTimeout(scrollToIndex._t);
    scrollToIndex._t = window.setTimeout(() => {
      animating = false;
    }, ANIM_MS);
  };

  const onWheel = (e) => {
    if (animating) {
      e.preventDefault();
      return;
    }

    const L = layouts();
    const scrollY = window.scrollY || window.pageYOffset;
    const vp = window.innerHeight;
    const idx = indexFromScroll(L, scrollY);
    const r = L[idx];
    const tall = r.height > vp + EDGE;
    const atBottom = scrollY + vp >= r.bottom - EDGE;
    const atTop = scrollY <= r.top + EDGE;

    if (e.deltaY > 0) {
      if (freeScroll) return; // 푸터 영역에서는 기본 스크롤 유지
      if (tall && !atBottom) {
        setCurrent(idx); // 섹션이 화면보다 길면 끝까지는 자연스럽게 스크롤
        return;
      }
      if (idx >= total - 1) {
        freeScroll = true; // 마지막 섹션 이후는 자연스러운 스크롤로 푸터까지 이동
        return;
      }
      e.preventDefault();
      scrollToIndex(idx + 1);
      return;
    }

    if (e.deltaY < 0) {
      if (freeScroll) {
        if (scrollY <= L[total - 1].top) {
          freeScroll = false;
          scrollToIndex(total - 1);
          e.preventDefault();
        }
        return;
      }
      if (tall && !atTop) {
        setCurrent(idx);
        return;
      }
      if (idx <= 0) return;
      e.preventDefault();
      scrollToIndex(idx - 1);
    }
  };

  const onTouchStart = (e) => {
    touchStartY = e.touches[0].clientY;
  };

  const onTouchMove = (e) => {
    if (animating) {
      e.preventDefault();
      return;
    }

    const currentY = e.touches[0].clientY;
    const deltaY = touchStartY - currentY;
    const THRESHOLD = 40;
    if (Math.abs(deltaY) < THRESHOLD) return;

    const L = layouts();
    const scrollY = window.scrollY || window.pageYOffset;
    const vp = window.innerHeight;
    const idx = indexFromScroll(L, scrollY);
    const r = L[idx];
    const tall = r.height > vp + EDGE;
    const atBottom = scrollY + vp >= r.bottom - EDGE;
    const atTop = scrollY <= r.top + EDGE;

    if (deltaY > 0) {
      if (freeScroll) return;
      if (tall && !atBottom) {
        setCurrent(idx);
        return;
      }
      if (idx >= total - 1) {
        freeScroll = true;
        return;
      }
      e.preventDefault();
      scrollToIndex(idx + 1);
      touchStartY = currentY;
    } else {
      if (freeScroll) {
        if (scrollY <= L[total - 1].top) {
          freeScroll = false;
          scrollToIndex(total - 1);
          e.preventDefault();
        }
        return;
      }
      if (tall && !atTop) {
        setCurrent(idx);
        return;
      }
      if (idx <= 0) return;
      e.preventDefault();
      scrollToIndex(idx - 1);
      touchStartY = currentY;
    }
  };

  const onScroll = () => {
    if (animating) return;
    const idx = indexFromScroll(layouts(), window.scrollY || window.pageYOffset);
    setCurrent(idx);
  };

  const onResize = () => {
    if (!freeScroll) {
      scrollToIndex(current, false);
    }
  };

  const onQuickNavClick = (e) => {
    const link = e.currentTarget;
    freeScroll = false;
    scrollToIndex(Number(link.dataset.index));
  };

  renderQuickNav();
  updateHeaderTransparency();

  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  quickNavLinks.forEach((link) => link.addEventListener("click", onQuickNavClick));
})();