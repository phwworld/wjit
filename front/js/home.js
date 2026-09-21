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
    speed: 5000,
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
