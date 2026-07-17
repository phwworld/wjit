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
    const points = getSectionSnapPoints(getLastSection());
    animateScrollTo(points[points.length - 1]);
  }

  function scrollToSection(index, fromDirection) {
    index = Math.max(0, Math.min(index, sections.length - 1));

    if (isScrolling && index === currentIndex) return;

    currentIndex = index;
    const points = getSectionSnapPoints(sections[index]);
    const target =
      fromDirection === -1 ? points[points.length - 1] : points[0];
    animateScrollTo(target);
  }

  function scrollToFooter() {
    animateScrollTo(getLastSectionBottom());
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

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKeydown);
  document.addEventListener('touchstart', onTouchStart, { passive: true });
  document.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });

  window.addEventListener('resize', () => {
    const points = getSectionSnapPoints(sections[currentIndex]);
    window.scrollTo(0, findNearestSnapPoint(points, window.scrollY));
  });
})();
