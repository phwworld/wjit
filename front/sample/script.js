(function () {
  const main = document.querySelector('main');
  if (!main) return;

  const sections = [...main.querySelectorAll('section')];
  if (sections.length === 0) return;

  const DURATION = 800;
  const WHEEL_THRESHOLD = 30;
  const TOUCH_THRESHOLD = 50;

  let currentIndex = 0;
  let isScrolling = false;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function getSectionIndex() {
    const scrollY = window.scrollY;
    let index = 0;

    sections.forEach((section, i) => {
      const top = section.offsetTop;
      const middle = top + section.offsetHeight / 2;
      if (scrollY >= middle - window.innerHeight / 2) {
        index = i;
      }
    });

    return index;
  }

  function getLastSection() {
    return sections[sections.length - 1];
  }

  function getLastSectionTop() {
    return getLastSection().offsetTop;
  }

  function getLastSectionBottom() {
    const last = getLastSection();
    return last.offsetTop + last.offsetHeight;
  }

  function isInFooter() {
    return window.scrollY >= getLastSectionBottom() - 10;
  }

  function isInTransitionZone() {
    const scrollY = window.scrollY;
    return scrollY > getLastSectionTop() + 10 && scrollY < getLastSectionBottom() + 10;
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
        if (onComplete) onComplete();
      }
    }

    requestAnimationFrame(step);
  }

  function scrollToLastSection() {
    currentIndex = sections.length - 1;
    animateScrollTo(getLastSectionTop());
  }

  function scrollToSection(index) {
    index = Math.max(0, Math.min(index, sections.length - 1));

    if (isScrolling && index === currentIndex) return;

    currentIndex = index;
    animateScrollTo(sections[index].offsetTop);
  }

  function scrollToFooter() {
    animateScrollTo(getLastSectionBottom());
  }

  function moveSection(direction) {
    if (isScrolling) return;

    currentIndex = getSectionIndex();

    if (direction > 0) {
      if (currentIndex < sections.length - 1) {
        scrollToSection(currentIndex + 1);
      } else if (!isInFooter()) {
        scrollToFooter();
      }
    } else {
      if (isInFooter() || isInTransitionZone()) {
        scrollToLastSection();
      } else {
        scrollToSection(currentIndex - 1);
      }
    }
  }

  function onWheel(e) {
    if (isInFooter() && e.deltaY > 0) return;

    if (isInFooter() && e.deltaY < 0) {
      e.preventDefault();
      if (!isScrolling) scrollToLastSection();
      return;
    }

    if (isScrolling) {
      e.preventDefault();
      return;
    }

    if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;

    e.preventDefault();
    moveSection(e.deltaY > 0 ? 1 : -1);
  }

  function onKeydown(e) {
    const keyMap = {
      ArrowDown: 1,
      PageDown: 1,
      ' ': 1,
      ArrowUp: -1,
      PageUp: -1,
    };

    if (e.key === 'Home') {
      e.preventDefault();
      scrollToSection(0);
      return;
    }

    if (e.key === 'End') {
      e.preventDefault();
      if (isInFooter()) {
        animateScrollTo(getLastSectionBottom());
      } else {
        scrollToSection(sections.length - 1);
      }
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

    if (isScrolling) return;

    clearTimeout(snapTimer);
    snapTimer = setTimeout(() => {
      const lastTop = getLastSectionTop();
      const footerTop = getLastSectionBottom();

      if (scrollY >= footerTop && scrollDirection < 0) {
        scrollToLastSection();
        return;
      }

      if (scrollY > lastTop && scrollY < footerTop) {
        if (scrollDirection < 0) {
          scrollToLastSection();
        } else if (scrollDirection > 0) {
          animateScrollTo(footerTop);
        }
        return;
      }

      if (isInFooter()) return;

      const index = getSectionIndex();
      if (index !== currentIndex) {
        scrollToSection(index);
      }
    }, 100);
  }

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKeydown);
  document.addEventListener('touchstart', onTouchStart, { passive: true });
  document.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });

  window.addEventListener('resize', () => {
    window.scrollTo(0, sections[currentIndex].offsetTop);
  });
})();
