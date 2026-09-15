/**
 * 웅진IT 메인 홈 (home_2)
 */

document.addEventListener("DOMContentLoaded", () => {
  initHomeHeaderTone();
  initHomeHero();
  initHomeMediaCarousel();
  initHomeCases();
  initHomeGrowthCounters();
  initHomeSectionSnap();
  initHomeSectionNav();
});

const HOME_SECTIONS = ["hero", "services", "media", "cases", "growth"];
const HOME_LIGHT_SECTIONS = new Set(["services", "cases"]);

let homeSnapAnimating = false;
let homeSnapRaf = 0;

function homeSnapTargets() {
  const sections = HOME_SECTIONS.map((id) => document.getElementById(id)).filter(Boolean);
  const footer = document.querySelector("body.home-page > footer");
  if (footer) sections.push(footer);
  return sections;
}

function homeSnapMaxY() {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
}

function homeSnapToY(targetY) {
  const end = Math.max(0, Math.min(homeSnapMaxY(), Math.round(targetY)));
  const start = window.scrollY;
  const dist = end - start;
  if (Math.abs(dist) < 2) return;

  const scroller = document.scrollingElement || document.documentElement;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    scroller.scrollTop = end;
    return;
  }

  if (homeSnapRaf) cancelAnimationFrame(homeSnapRaf);

  homeSnapAnimating = true;
  const dur = Math.max(700, Math.min(1000, Math.round(620 + Math.abs(dist) * 0.18)));
  const t0 = performance.now();
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  const tick = (now) => {
    const p = Math.min(1, (now - t0) / dur);
    scroller.scrollTop = start + dist * ease(p);
    if (p < 1) {
      homeSnapRaf = requestAnimationFrame(tick);
    } else {
      scroller.scrollTop = end;
      homeSnapRaf = 0;
      homeSnapAnimating = false;
    }
  };
  homeSnapRaf = requestAnimationFrame(tick);
}

function homeSnapToEl(el) {
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY;
  homeSnapToY(el.id === "hero" ? 0 : Math.max(0, top));
}

function headerHeight() {
  const header = document.querySelector("header");
  return header ? header.offsetHeight : 56;
}

function initHomeHeaderTone() {
  const header = document.querySelector("header");
  if (!header) return;

  document.querySelectorAll(".pc-gnb > ul > li").forEach((li) => {
    li.addEventListener("mouseenter", () => header.classList.add("is-gnb-open"));
    li.addEventListener("mouseleave", () => header.classList.remove("is-gnb-open"));
  });
}

function initHomeHero() {
  const section = document.getElementById("hero");
  const titleEl = document.getElementById("home-hero-title");
  const descEl = document.getElementById("home-hero-desc");
  const ctaEl = document.getElementById("home-hero-cta");
  const navEl = document.getElementById("home-hero-nav");
  const videos = [...document.querySelectorAll("[data-hero-video]")];
  if (!section || videos.length < 2 || !titleEl || !navEl) return;

  const slides = [
    {
      title: ["흐름을 리드하다", "<em>혁신을 지속</em>하다"],
      descPc: "클라우드전환·ERP·데이터·AI 까지 스마트한 IT비즈니스를 설계합니다",
      descMo: "클라우드전환·ERP·데이터·AI 까지<br>스마트한 IT비즈니스를 설계합니다",
      ctaMo: "서비스 알아보기",
    },
    {
      title: ["변화하는 세상의 속도에", "<em>미래의 기술</em>을 더하다"],
      descPc: "빠르게 변화하는 비즈니스 환경에 맞춰 AI·ERP·클라우드 기반의 디지털 전환을 지원합니다.",
      descMo: "변화하는 비즈니스 환경,<br>AI·ERP·클라우드로 앞서갑니다",
      ctaMo: "What We Do",
    },
    {
      title: ["클라우드에서 AI까지", "<em>기업의 내일</em>을 설계하다"],
      descPc: "AI·ERP·클라우드·솔루션 역량을 바탕으로 기업에 필요한 IT기반을 설계합니다.",
      descMo: "AI·ERP·클라우드·솔루션 역량을 바탕으로<br>기업에 필요한 IT기반을 설계합니다.",
      ctaMo: "서비스 알아보기",
    },
  ];
  const durations = [6000, 7000, 6000];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let index = 0;
  let startedAt = performance.now();
  let timer = 0;
  let raf = 0;
  const fills = [];

  navEl.innerHTML = slides
    .map(
      (_, i) =>
        `<button type="button" aria-label="배너 ${i + 1}"${i === 0 ? ' class="is-active"' : ""}><span></span></button>`
    )
    .join("");
  navEl.querySelectorAll("button").forEach((btn, i) => {
    fills.push(btn.querySelector("span"));
    btn.addEventListener("click", () => goTo(i, true));
  });

  const renderCopy = (i) => {
    const slide = slides[i];
    titleEl.innerHTML = slide.title
      .map((line) => `<span class="home-hero__line"><span>${line}</span></span>`)
      .join("");
    const pc = descEl.querySelector(".home-hero__desc-pc");
    const mo = descEl.querySelector(".home-hero__desc-mo");
    if (pc) pc.innerHTML = slide.descPc;
    if (mo) innerHTMLSafe(mo, slide.descMo);
    const ctaMo = ctaEl.querySelector(".home-hero__cta-mo");
    if (ctaMo) ctaMo.textContent = slide.ctaMo;
  };

  function innerHTMLSafe(el, html) {
    el.innerHTML = html;
  }

  const syncVideos = (i) => {
    videos.forEach((video, idx) => {
      const active = idx === i;
      video.muted = true;
      video.playsInline = true;
      video.classList.toggle("is-active", active);
      if (active) {
        const play = video.play();
        if (play && play.catch) play.catch(() => {});
      } else {
        video.pause();
      }
    });
  };

  const goTo = (i, user) => {
    index = (i + slides.length) % slides.length;
    startedAt = performance.now();
    renderCopy(index);
    syncVideos(index);
    navEl.querySelectorAll("button").forEach((btn, idx) => {
      btn.classList.toggle("is-active", idx === index);
      if (fills[idx]) fills[idx].style.width = idx < index ? "100%" : "0%";
    });
    if (user) restartTimer();
  };

  const tickNav = (now) => {
    const ratio = Math.min(1, (now - startedAt) / durations[index]);
    if (fills[index]) fills[index].style.width = `${ratio * 100}%`;
    raf = requestAnimationFrame(tickNav);
  };

  const restartTimer = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => goTo(index + 1), durations[index]);
  };

  renderCopy(0);
  syncVideos(0);
  if (!reduceMotion) {
    restartTimer();
    raf = requestAnimationFrame(tickNav);
  } else {
    fills.forEach((el) => {
      if (el) el.style.width = "0%";
    });
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    } else if (!reduceMotion) {
      startedAt = performance.now();
      restartTimer();
      raf = requestAnimationFrame(tickNav);
    }
  });
}

function initHomeMediaCarousel() {
  const el = document.querySelector(".home-media__swiper");
  if (!el || typeof Swiper === "undefined") return;

  new Swiper(el, {
    slidesPerView: "auto",
    spaceBetween: 16,
    loop: true,
    speed: 650,
    watchOverflow: true,
    autoplay: {
      delay: 4200,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".home-media__next",
      prevEl: ".home-media__prev",
    },
    breakpoints: {
      1025: { spaceBetween: 20 },
      1440: { spaceBetween: 24 },
    },
  });
}

function initHomeCases() {
  const banner = document.getElementById("home-cases-banner");
  const lists = [...document.querySelectorAll(".home-cases__list")];
  const dotsWrap = document.getElementById("home-cases-dots");
  if (!banner || !lists.length) return;

  const slides = [...banner.querySelectorAll("article")];
  const total = Math.min(slides.length, lists.length);
  let current = 0;
  let timer = 0;

  if (dotsWrap) {
    dotsWrap.innerHTML = Array.from({ length: total }, (_, i) => {
      return `<button type="button" aria-label="사례 ${i + 1}"${i === 0 ? ' class="is-active"' : ""}></button>`;
    }).join("");
    dotsWrap.querySelectorAll("button").forEach((btn, i) => {
      btn.addEventListener("click", () => goTo(i, true));
    });
  }

  const goTo = (i, user) => {
    current = (i + total) % total;
    slides.forEach((slide, idx) => slide.classList.toggle("is-active", idx === current));
    lists.forEach((list, idx) => {
      const on = idx === current;
      list.classList.toggle("is-active", on);
      list.hidden = !on;
    });
    if (dotsWrap) {
      dotsWrap.querySelectorAll("button").forEach((btn, idx) => {
        btn.classList.toggle("is-active", idx === current);
      });
    }
    if (user) start();
  };

  const start = () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => goTo(current + 1), 5200);
  };

  start();
}

function initHomeGrowthCounters() {
  const section = document.getElementById("growth");
  if (!section) return;
  const nodes = [...section.querySelectorAll("[data-growth-count]")];
  if (!nodes.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const format = (n, type) => {
    if (type === "revenue") return `${n.toLocaleString("ko-KR")}억+`;
    if (type === "clients") return `${n.toLocaleString("ko-KR")}+`;
    if (type === "professionals") return n.toLocaleString("en-US");
    if (type === "experience") return `${n}년+`;
    return n.toLocaleString("ko-KR");
  };

  const animate = (el) => {
    const target = Number(el.getAttribute("data-growth-count") || "0");
    const type = el.getAttribute("data-growth-format") || "";
    if (!Number.isFinite(target) || target <= 0) return;
    if (reduceMotion) {
      el.textContent = format(target, type);
      return;
    }
    const t0 = performance.now();
    const dur = 900;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(Math.round(target * eased), type);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const run = () => {
    nodes.forEach((el, i) => {
      window.setTimeout(() => animate(el), i * 180);
    });
  };

  if (!("IntersectionObserver" in window)) {
    run();
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      run();
      io.disconnect();
    },
    { threshold: 0.25 }
  );
  io.observe(section);
}

function initHomeSectionNav() {
  const nav = document.getElementById("home-quick-nav");
  const actions = document.querySelector(".home-scroll-actions");
  const btnUp = document.querySelector(".home-scroll-up");
  const btnDown = document.querySelector(".home-scroll-down");
  const links = nav ? [...nav.querySelectorAll("a[data-section]")] : [];
  const sections = HOME_SECTIONS.map((id) => document.getElementById(id)).filter(Boolean);
  if (!sections.length) return;

  const getActiveIndex = () => {
    const anchor = window.scrollY + headerHeight() + 8;
    let index = 0;
    sections.forEach((sec, i) => {
      const top = sec.getBoundingClientRect().top + window.scrollY;
      if (anchor >= top) index = i;
    });
    return index;
  };

  const sync = () => {
    const index = getActiveIndex();
    const id = sections[index] ? sections[index].id : "hero";
    links.forEach((link) => {
      link.classList.toggle("is-active", link.dataset.section === id);
    });
    const light = HOME_LIGHT_SECTIONS.has(id);
    if (nav) nav.classList.toggle("is-light", light);
    if (actions) actions.classList.toggle("is-light", light);
  };

  if (btnUp) {
    btnUp.addEventListener("click", () => {
      homeSnapToY(0);
    });
  }
  if (btnDown) {
    btnDown.addEventListener("click", () => {
      const targets = homeSnapTargets();
      const next = Math.min(targets.length - 1, getActiveIndex() + 1);
      homeSnapToEl(targets[next]);
    });
  }

  window.addEventListener("scroll", sync, { passive: true });
  window.addEventListener("resize", sync);
  sync();
}

function initHomeSectionSnap() {
  const EDGE = 16;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const raw = link.getAttribute("href");
    if (!raw || raw === "#" || raw === "#none") return;
    let target = null;
    try {
      target = document.querySelector(raw);
    } catch (err) {
      return;
    }
    if (!target) return;
    const snapEl = target.closest("main.home > section") || target;
    if (!homeSnapTargets().includes(snapEl) && snapEl !== target) return;
    e.preventDefault();
    homeSnapToEl(snapEl);
  });

  if (reduceMotion) return;

  const layouts = () =>
    homeSnapTargets().map((el) => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const height = el.offsetHeight;
      return { el, top, bottom: top + height, height };
    });

  const indexFromScroll = () => {
    const L = layouts();
    if (!L.length) return 0;
    const anchor = window.scrollY + 1;
    for (let i = 0; i < L.length; i++) {
      if (anchor >= L[i].top && anchor < L[i].bottom - 1) return i;
    }
    if (anchor < L[0].top) return 0;
    return L.length - 1;
  };

  const move = (dir, e) => {
    if (document.body.classList.contains("no-scroll")) return false;
    if (homeSnapAnimating) {
      if (e) e.preventDefault();
      return true;
    }
    const L = layouts();
    if (L.length < 2) return false;
    const idx = indexFromScroll();
    const r = L[idx];
    const vp = window.innerHeight;
    const scrollY = window.scrollY;
    const tall = r.height > vp + 24;
    const atBottom = scrollY + vp >= r.bottom - EDGE;
    const atTop = scrollY <= r.top + EDGE;

    if (dir > 0) {
      if (tall && !atBottom) return false;
      if (idx >= L.length - 1) return false;
      if (e) e.preventDefault();
      homeSnapToEl(L[idx + 1].el);
      return true;
    }
    if (tall && !atTop) return false;
    if (idx <= 0) return false;
    if (e) e.preventDefault();
    homeSnapToEl(L[idx - 1].el);
    return true;
  };

  window.addEventListener(
    "wheel",
    (e) => {
      if (e.target.closest && e.target.closest(".pc-gnb .gnb-sub, .search-layer, input, textarea, select")) {
        return;
      }
      if (Math.abs(e.deltaY) < 8) return;
      move(e.deltaY > 0 ? 1 : -1, e);
    },
    { passive: false }
  );

  window.addEventListener("keydown", (e) => {
    const el = e.target;
    if (el && el.closest && el.closest("input, textarea, select, [contenteditable='true']")) return;
    const isSpace = e.key === " " || e.code === "Space";
    if (isSpace && el && el.closest && el.closest("button, a[href], summary, [role='button']")) return;

    const wantDown = e.key === "PageDown" || e.key === "ArrowDown" || (isSpace && !e.shiftKey);
    const wantUp = e.key === "PageUp" || e.key === "ArrowUp" || (isSpace && e.shiftKey);
    if (!wantDown && !wantUp) return;
    move(wantDown ? 1 : -1, e);
  });
}
