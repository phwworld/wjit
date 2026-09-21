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

  const slideByNav = (direction) => {
    if (!isDesktop()) return;
    swiper.autoplay.stop();
    swiper.animating = false;
    swiper.params.speed = NAV_SPEED;
    if (direction === "next") swiper.slideNext();
    else swiper.slidePrev();
  };

  swiper.on("transitionEnd", () => {
    if (hovering || !isDesktop()) return;
    swiper.params.speed = TICKER_SPEED;
    if (!swiper.autoplay.running) swiper.autoplay.start();
  });

  prevEl?.addEventListener("click", () => slideByNav("prev"));
  nextEl?.addEventListener("click", () => slideByNav("next"));
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
