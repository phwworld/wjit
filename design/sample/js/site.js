const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

      /** preview.html iframe: dvh ≠ innerHeight 보정 — 풀스크린 스냅·스크롤 리빌 타이밍 동기화 */
      (function initPreviewIframeViewport() {
        if (window.parent === window) return;

        const root = document.documentElement;
        root.classList.add("is-preview-iframe");
        window.__isPreviewIframe = true;

        const sync = () => {
          root.style.setProperty("--preview-vh", window.innerHeight + "px");
          root.style.setProperty("--full-vh", window.innerHeight + "px");
        };

        sync();
        window.addEventListener("resize", sync, { passive: true });
        if (window.visualViewport) {
          window.visualViewport.addEventListener("resize", sync, { passive: true });
        }
        window.addEventListener("message", (e) => {
          if (!e.data || e.data.type !== "preview-viewport-resize") return;
          sync();
        });
      })();

      let closeHeaderSearchIfOpen = null;

      (function initMobileScrollTop() {
        const btn = document.getElementById("mobile-scroll-top");
        const hero = document.getElementById("hero") || document.querySelector(".sub-hero");
        const isSubPage = document.body.classList.contains("sub-page");
        const mqPad = window.matchMedia("(max-width: 719px), ((width: 768px) and (orientation: portrait)), ((width: 820px) and (orientation: portrait)), ((width: 1024px) and (orientation: portrait)), ((height: 768px) and (orientation: landscape)), ((height: 820px) and (orientation: landscape)), ((height: 1024px) and (orientation: landscape))");
        if (!btn) return;

        const reduceMotion =
          window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const pastHero = () => {
          if (!hero) return window.scrollY > window.innerHeight * 0.45;
          const top = hero.getBoundingClientRect().top + window.scrollY;
          const bottom = top + hero.offsetHeight;
          return window.scrollY >= bottom - 48;
        };

        const sync = () => {
          if (isSubPage) {
            const show = window.scrollY > 160;
            btn.classList.toggle("is-visible", show);
            btn.hidden = !show;
            return;
          }
          if (!mqPad.matches) {
            btn.classList.remove("is-visible");
            btn.hidden = true;
            return;
          }
          const show = pastHero();
          btn.classList.toggle("is-visible", show);
          btn.hidden = !show;
        };

        btn.addEventListener("click", () => {
          window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
        });

        window.addEventListener("scroll", sync, { passive: true });
        window.addEventListener("resize", sync);
        sync();
      })();



      /** href="#" 플레이스홀더: 포인터만 유지하고 이동·해시 스크롤 없음 */
      
      (function initAriaDisabledLinks() {
        document.querySelectorAll('a[aria-disabled="true"]').forEach((a) => {
          if (!a.hasAttribute("tabindex")) a.setAttribute("tabindex", "-1");
        });
      })();

      (function initEmptyPlaceholderLinks() {
        document.addEventListener(
          "click",
          (e) => {
            const a = e.target.closest && e.target.closest("a[data-empty-link]");
            if (!a) return;
            e.preventDefault();
          },
          true
        );
      })();

      /** 탑 GNB: 히어로 최상단에서는 투명 + 페이지 장식 BG 숨김 · 스크롤 시 화이트 바·장식 표시 */
      (function initHeaderSolidOnScroll() {
        const header = document.getElementById("site-header");
        const pageBg = document.getElementById("page-bg-decoration");
        if (!header || document.body.classList.contains("sub-page")) return;

        const THRESH = 16;

        const tick = () => {
          const y = window.scrollY || document.documentElement.scrollTop || 0;
          const solid = y > THRESH;
          header.classList.toggle("is-solid", solid);
          if (pageBg) pageBg.classList.toggle("is-dimmed-for-hero", !solid);
        };

        tick();
        window.addEventListener("scroll", tick, { passive: true });
        window.addEventListener("resize", tick);
      })();

      /** 탑 GNB: 검색 아이콘 → 풀오버 검색 */
      (function initHeaderSearchOverlay() {
        const button = document.getElementById("header-search-button");
        const overlay = document.getElementById("header-search-overlay");
        const header = document.getElementById("site-header");
        const input = document.getElementById("header-search-input");
        const form = overlay?.querySelector(".header-search__form");
        const searchIcon = button?.querySelector(".header-toolbar-icon");
        const mobileMenuBtn = document.getElementById("mobile-menu-button");
        if (!button || !overlay || !header) return;

        const panel = overlay.querySelector(".header-search-overlay__panel");

        const mqPadSearch = window.matchMedia(
          "((width: 768px) and (orientation: portrait)), ((width: 820px) and (orientation: portrait)), ((width: 1024px) and (orientation: portrait)), ((height: 768px) and (orientation: landscape)), ((height: 820px) and (orientation: landscape)), ((height: 1024px) and (orientation: landscape))"
        );

        const isPadSearchViewport = () => mqPadSearch.matches;

        const ensureSearchPadCloseBtn = () => {
          let closeBtn = overlay.querySelector(".header-search__pad-close");
          if (closeBtn) return closeBtn;
          closeBtn = document.createElement("button");
          closeBtn.type = "button";
          closeBtn.className = "header-search__pad-close focus-ring";
          closeBtn.setAttribute("aria-label", "검색 닫기");
          closeBtn.innerHTML =
            '<span class="header-search__pad-close-icon" aria-hidden="true"></span>';
          overlay.appendChild(closeBtn);

          const onClosePress = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(false);
          };

          let closeTouchHandled = false;
          closeBtn.addEventListener("touchend", (e) => {
            closeTouchHandled = true;
            onClosePress(e);
            window.setTimeout(() => {
              closeTouchHandled = false;
            }, 450);
          });
          closeBtn.addEventListener("click", (e) => {
            if (closeTouchHandled) return;
            onClosePress(e);
          });
          return closeBtn;
        };

        const syncSearchPadCloseBtn = () => {
          const closeBtn = overlay.querySelector(".header-search__pad-close");
          if (!closeBtn) return;
          if (!isPadSearchViewport() || !isOpen()) {
            closeBtn.classList.remove("is-visible");
            closeBtn.style.display = "none";
            return;
          }
          const panelEl = overlay.querySelector(".header-search-overlay__panel");
          if (!panelEl) return;
          const rect = panelEl.getBoundingClientRect();
          if (!rect.height) {
            closeBtn.classList.remove("is-visible");
            closeBtn.style.display = "none";
            return;
          }
          const bottomGap = 30;
          const btnH = closeBtn.offsetHeight || 36;
          closeBtn.style.display = "inline-flex";
          closeBtn.classList.add("is-visible");
          closeBtn.style.top = Math.round(rect.bottom - bottomGap - btnH) + "px";
          closeBtn.style.right = "1.25rem";
        };

        ensureSearchPadCloseBtn();

        const closeMobileMenuIfOpen = () => {
          if (mobileMenuBtn && mobileMenuBtn.getAttribute("aria-expanded") === "true") {
            mobileMenuBtn.click();
          }
        };

        const closePadGnbIfOpen = () => {
          const mega = document.getElementById("gnb-mega");
          if (
            !document.documentElement.classList.contains("is-gnb-mega-open") &&
            !header.classList.contains("is-gnb-mega-open") &&
            !mega?.querySelector(".gnb-mega__item.is-open")
          ) {
            return;
          }
          document.documentElement.classList.remove("is-gnb-mega-open");
          header.classList.remove("is-gnb-mega-open");
          if (!mega) return;
          mega.classList.remove("is-mega-live");
          mega.querySelectorAll(".gnb-mega__item.is-open").forEach((item) => {
            item.classList.remove("is-open");
            const trigger = item.querySelector(".gnb-mega__trigger");
            if (trigger) trigger.setAttribute("aria-expanded", "false");
          });
          const sheet = mega.querySelector(".gnb-mega__sheet");
          if (sheet) {
            sheet.style.removeProperty("height");
            sheet.style.removeProperty("min-height");
            sheet.style.removeProperty("max-height");
          }
          const closeBtn = mega.querySelector(".gnb-mega__pad-close");
          if (closeBtn) closeBtn.style.display = "none";
        };

        const getFocusables = () =>
          Array.from(
            overlay.querySelectorAll(
              'input:not([disabled]), button:not([disabled]), a[href]:not([aria-disabled="true"]), [tabindex]:not([tabindex="-1"])'
            )
          ).filter((el) => el.offsetParent !== null);

        const trapFocus = (e) => {
          if (e.key !== "Tab" || !isOpen()) return;
          const items = getFocusables();
          if (!items.length) return;
          const first = items[0];
          const last = items[items.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        };

        const setOpen = (open, options = {}) => {
          button.setAttribute("aria-expanded", String(open));
          button.setAttribute("aria-label", open ? "검색 닫기" : "검색 열기");
          overlay.classList.toggle("is-open", open);
          overlay.setAttribute("aria-hidden", open ? "false" : "true");
          if (open) overlay.removeAttribute("hidden");
          else overlay.setAttribute("hidden", "");
          header.classList.toggle("is-search-open", open);
          document.documentElement.classList.toggle("is-search-open", open);
          if (searchIcon) {
            searchIcon.setAttribute("icon", open ? "solar:close-circle-linear" : "solar:magnifer-linear");
          }
          if (open) {
            closeMobileMenuIfOpen();
            closePadGnbIfOpen();
            window.setTimeout(() => {
              input?.focus();
              syncSearchPadCloseBtn();
            }, 60);
          } else {
            syncSearchPadCloseBtn();
            if (!options.skipFocus) {
              button.focus();
            }
          }
        };

        closeHeaderSearchIfOpen = () => {
          if (isOpen()) setOpen(false, { skipFocus: true });
        };

        const isOpen = () => overlay.classList.contains("is-open");

        const toggleSearch = () => setOpen(!isOpen());

        let searchTouchHandled = false;
        button.addEventListener(
          "touchend",
          (e) => {
            if (!isPadSearchViewport()) return;
            e.preventDefault();
            searchTouchHandled = true;
            toggleSearch();
            window.setTimeout(() => {
              searchTouchHandled = false;
            }, 450);
          },
          { passive: false }
        );

        button.addEventListener("click", () => {
          if (searchTouchHandled) return;
          toggleSearch();
        });
        panel?.addEventListener("keydown", trapFocus);

        form?.addEventListener("submit", (e) => {
          e.preventDefault();
          if (input?.value.trim()) input.select();
        });

        overlay.querySelectorAll("[data-search-suggest]").forEach((tag) => {
          tag.addEventListener("click", (e) => {
            e.preventDefault();
            const term = tag.getAttribute("data-search-suggest") || tag.textContent.trim();
            if (input) input.value = term.replace(/^#/, "");
            input?.focus();
          });
        });

        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape" && isOpen()) {
            setOpen(false);
            button.focus();
          }
        });

        window.addEventListener("resize", syncSearchPadCloseBtn, { passive: true });
        if (typeof mqPadSearch.addEventListener === "function") {
          mqPadSearch.addEventListener("change", syncSearchPadCloseBtn);
        } else if (typeof mqPadSearch.addListener === "function") {
          mqPadSearch.addListener(syncSearchPadCloseBtn);
        }
      })();

      (function initFooterFamilyDropdown() {
        const wrap = document.getElementById("footer-family-wrap");
        const trigger = document.getElementById("footer-family-trigger");
        const panel = document.getElementById("footer-family-listbox");
        if (!wrap || !trigger || !panel) return;

        const PLACEMENT_GAP = 8;

        const getPanelHeight = () => {
          if (!panel.hasAttribute("hidden")) return panel.offsetHeight;
          panel.removeAttribute("hidden");
          panel.style.visibility = "hidden";
          const height = panel.offsetHeight;
          panel.style.visibility = "";
          panel.setAttribute("hidden", "");
          return height;
        };

        const updateDropup = () => {
          wrap.classList.remove("footer-family-dropdown--dropup");
          const panelHeight = getPanelHeight();
          const rect = trigger.getBoundingClientRect();
          const spaceBelow = window.innerHeight - rect.bottom;
          const spaceAbove = rect.top;
          if (spaceBelow < panelHeight + PLACEMENT_GAP && spaceAbove > spaceBelow) {
            wrap.classList.add("footer-family-dropdown--dropup");
          }
        };

        const setOpen = (open) => {
          trigger.setAttribute("aria-expanded", String(open));
          trigger.classList.toggle("footer-family-trigger--open", open);
          if (open) {
            updateDropup();
            panel.removeAttribute("hidden");
            panel.setAttribute("aria-hidden", "false");
          } else {
            wrap.classList.remove("footer-family-dropdown--dropup");
            panel.setAttribute("hidden", "");
            panel.setAttribute("aria-hidden", "true");
          }
        };

        const onViewportChange = () => {
          if (trigger.getAttribute("aria-expanded") === "true") updateDropup();
        };

        trigger.addEventListener("click", (e) => {
          e.stopPropagation();
          setOpen(trigger.getAttribute("aria-expanded") !== "true");
        });

        panel.querySelectorAll("button.footer-family-option").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            setOpen(false);
          });
        });

        document.addEventListener("click", (e) => {
          if (!wrap.contains(e.target)) setOpen(false);
        });

        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape") setOpen(false);
        });

        window.addEventListener("resize", onViewportChange, { passive: true });
        window.addEventListener("scroll", onViewportChange, { passive: true, capture: true });
      })();

      window.__handleContactSubmit = function (e) {
        e.preventDefault();
        const form = e.currentTarget;
        const data = Object.fromEntries(new FormData(form).entries());

        const toast = document.getElementById("contact-toast");
        toast.classList.remove("hidden");
        toast.textContent =
          "접수되었습니다. (시안) 실제 연동 시 메일/CRM 연동으로 대체됩니다. 개인정보는 문의 처리 목적으로만 사용됩니다.";

        // Minimal client-side validation feedback only
        if (!data.company || !data.name || !data.email || !data.message) return false;

        form.reset();
        return false;
      };

      /** 히어로: 접속 인트로 — 좌상단→우하단 마스크 리빌(1차 시안2 패턴) */
      (function heroIntro() {
        const section = document.getElementById("hero");
        const mediaClip = document.getElementById("hero-intro-clip");
        if (!section || !mediaClip) return;

        const HERO_COPY_MIN_DELAY_MS = 0;
        const MASK_FALLBACK_MS = 1400;
        const INTRO_WHITE_HOLD_MS = 320;

        const willAnimate = document.documentElement.classList.contains("hero-will-animate");
        if (!willAnimate) {
          document.documentElement.classList.add("hero-intro-header-visible");
          section.classList.add("is-hero-mask-open", "is-hero-content-ready");
          section.setAttribute("aria-busy", "false");
          return;
        }

        let contentReady = false;
        let maskOpenDone = false;
        let revealTimer = 0;
        let introT0 = 0;

        const applyContentReady = () => {
          if (contentReady) return;
          contentReady = true;
          clearTimeout(revealTimer);
          section.classList.add("is-hero-content-ready");
          section.setAttribute("aria-busy", "false");
          mediaClip.removeEventListener("transitionend", onClipDone);
          section.dispatchEvent(new CustomEvent("hero:intro-content-ready"));
        };

        const scheduleCopyWhenAllowed = () => {
          if (contentReady || !maskOpenDone) return;
          const elapsed = Date.now() - introT0;
          const wait = Math.max(0, HERO_COPY_MIN_DELAY_MS - elapsed);
          clearTimeout(revealTimer);
          revealTimer = window.setTimeout(applyContentReady, wait);
        };

        const onMaskOpenDone = () => {
          if (maskOpenDone) return;
          maskOpenDone = true;
          document.documentElement.classList.add("hero-intro-header-visible");
          scheduleCopyWhenAllowed();
        };

        const onClipDone = (ev) => {
          if (ev.target !== mediaClip) return;
          if (ev.propertyName !== "clip-path") return;
          onMaskOpenDone();
        };

        mediaClip.addEventListener("transitionend", onClipDone);

        const startMaskReveal = () => {
          introT0 = Date.now();
          document.documentElement.classList.add("hero-intro-mask-started");
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              section.classList.add("is-hero-mask-open");
              section.dispatchEvent(new CustomEvent("hero:intro-mask-open"));
              window.setTimeout(() => {
                if (!maskOpenDone) onMaskOpenDone();
              }, MASK_FALLBACK_MS);
            });
          });
        };

        const kick = () => {
          window.setTimeout(startMaskReveal, INTRO_WHITE_HOLD_MS);
        };

        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", kick);
        } else {
          kick();
        }
      })();

      /** 히어로: 영상 롤링 · 하단 네비 · 슬라이드별 카피 전환 */
      (function initHeroBackgroundVideo() {
        const heroMedia = document.querySelector("#hero .hero-media");
        const section = document.getElementById("hero");
        const heroCopy = document.getElementById("hero-copy");
        const heroHeadline = document.getElementById("hero-headline");
        const heroSubline = document.getElementById("hero-subline");
        const heroCtaRow = document.getElementById("hero-cta-row");
        const navSegments = document.getElementById("hero-video-nav-segments");
        const videos = [
          document.getElementById("hero-video-1"),
          document.getElementById("hero-video-2"),
          document.getElementById("hero-video-3"),
        ].filter(Boolean);
        if (!heroMedia || !section || videos.length < 3 || !heroCopy) return;

        const willAnimateIntro = () =>
          document.documentElement.classList.contains("hero-will-animate");
        const isMaskOpen = () =>
          !willAnimateIntro() || section.classList.contains("is-hero-mask-open");
        const isContentReady = () =>
          !willAnimateIntro() || section.classList.contains("is-hero-content-ready");
        const canPlayHeroVideo = () => visible && isMaskOpen();

        const HERO_CTA_DESK_HTML = `<a href="#services" class="hero-cta-ghost focus-ring" aria-label="우리가 하는 일">
          <span class="btn-label-stack">
            <span class="btn-label btn-label--default">What We Do</span>
            <span class="btn-label btn-label--hover" aria-hidden="true">우리가 하는 일</span>
          </span>
          <span class="btn-arrow" aria-hidden="true">&gt;</span>
        </a>`;

        const renderHeroMobCtas = (ctas) =>
          ctas
            .map((cta) => {
              const arrow = cta.arrow
                ? '<span class="hero-cta-mob__arrow" aria-hidden="true">&gt;</span>'
                : "";
              return `<a href="${cta.href}" class="hero-cta-mob focus-ring">${cta.label}${arrow}</a>`;
            })
            .join("");

        const HERO_SLIDES = [
          {
            title: [
              { text: "흐름을 리드하다" },
              { text: "혁신을 지속하다", highlights: ["혁신을 지속"] },
            ],
            subline: {
              oneline:
                "클라우드전환·ERP·데이터·AI 까지 스마트한 IT비즈니스를 설계합니다",
              twoline:
                "클라우드전환·ERP·데이터·AI 까지<br />스마트한 IT비즈니스를 설계합니다",
            },
            ctas: [{ href: "#services", label: "서비스 알아보기" }],
          },
          {
            title: [
              { text: "변화하는 세상의 속도에" },
              { text: "미래의 기술을 더하다", highlights: ["미래의 기술"] },
            ],
            subline: {
              oneline:
                "빠르게 변화하는 비즈니스 환경에 맞춰 AI·ERP·클라우드 기반의 디지털 전환을 지원합니다.",
              twoline:
                "변화하는 비즈니스 환경,<br />AI·ERP·클라우드로 앞서갑니다",
            },
            ctas: [{ href: "#services", label: "What We Do", arrow: true }],
          },
          {
            title: [
              { text: "클라우드에서 AI까지" },
              { text: "기업의 내일을 설계하다", highlights: ["기업의 내일"] },
            ],
            subline: {
              oneline:
                "AI·ERP·클라우드·솔루션 역량을 바탕으로 기업에 필요한 IT기반을 설계합니다.",
              twoline:
                "AI·ERP·클라우드·솔루션 역량을 바탕으로<br />기업에 필요한 IT기반을 설계합니다.",
            },
            ctas: [{ href: "#services", label: "서비스 알아보기" }],
          },
        ];

        const reduceMotion =
          window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const SLIDE_TURN_MS_BY_INDEX = [6000, 7000, 6000];
        const getSlideTurnMs = (idx) => SLIDE_TURN_MS_BY_INDEX[idx] ?? 6000;
        const CROSSFADE_MS = reduceMotion ? 500 : 1200;
        const CROSSFADE_LEAD_SEC = reduceMotion ? 0.55 : 1.2;
        const HEADLINE_EXIT_MS = 420;
        const HEADLINE_EXIT_STAGGER_MS = 150;
        const COPY_EXIT_MS = 280;

        const segmentEls = [];

        const buildNav = () => {
          if (!navSegments) return;
          const n = Math.min(videos.length, HERO_SLIDES.length);
          navSegments.innerHTML = "";
          segmentEls.length = 0;
          for (let i = 0; i < n; i++) {
            const seg = document.createElement("button");
            seg.type = "button";
            seg.className = "hero-video-nav__segment";
            seg.setAttribute("role", "tab");
            seg.setAttribute("aria-label", `배너 ${i + 1}`);
            seg.setAttribute("aria-selected", i === 0 ? "true" : "false");
            seg.dataset.slideIndex = String(i);
            seg.innerHTML = '<span class="hero-video-nav__segment-fill"></span>';
            seg.addEventListener("click", () => {
              const idx = Number(seg.dataset.slideIndex);
              if (!Number.isFinite(idx)) return;
              goToSlide(idx, true);
            });
            navSegments.appendChild(seg);
            segmentEls.push(seg);
          }
        };

        const updateNav = (idx, progressRatio) => {
          segmentEls.forEach((seg, i) => {
            const fill = seg.querySelector(".hero-video-nav__segment-fill");
            seg.classList.toggle("is-active", i === idx);
            seg.classList.toggle("is-complete", i < idx);
            seg.setAttribute("aria-selected", i === idx ? "true" : "false");
            if (!fill) return;
            if (i !== idx) fill.style.width = "0%";
            else fill.style.width = `${Math.min(100, Math.max(0, progressRatio * 100))}%`;
          });
        };

        const heroTitleMobMq = window.matchMedia("(max-width: 719px)");
        const heroTitlePadMq = window.matchMedia(
          "(max-width: 719px), (min-width: 720px) and (max-width: 1180px), ((width: 768px) and (orientation: portrait)), ((width: 820px) and (orientation: portrait)), ((width: 1024px) and (orientation: portrait)), ((height: 768px) and (orientation: landscape)), ((height: 820px) and (orientation: landscape)), ((height: 1024px) and (orientation: landscape))"
        );

        const getHeroTitleLines = (slide) => {
          if (slide.titleMob && heroTitleMobMq.matches) {
            return slide.titleMob;
          }
          if (slide.titlePad && heroTitlePadMq.matches) {
            return slide.titlePad;
          }
          return slide.title;
        };

        const escapeTitleHtml = (str) =>
          str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");

        const renderTitleText = (text, highlights) => {
          if (!highlights?.length) return escapeTitleHtml(text);
          let result = escapeTitleHtml(text);
          highlights
            .slice()
            .sort((a, b) => b.length - a.length)
            .forEach((term) => {
              const escaped = escapeTitleHtml(term);
              result = result.replace(
                new RegExp(escaped.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
                `<span class="hero-title-highlight">${escaped}</span>`
              );
            });
          return result;
        };

        const titleLineHTML = (line, index) => {
          const innerClass =
            "hero-title-line__in block font-extrabold text-white 3xl:whitespace-nowrap";
          const delayClass =
            index === 1
              ? " hero-title-line--delay hero-title-line--delay-1"
              : index >= 2
                ? ` hero-title-line--delay-${index}`
                : "";
          const innerHTML = renderTitleText(line.text, line.highlights);
          return `<span class="hero-title-line block w-full${delayClass}"><span class="${innerClass}">${innerHTML}</span></span>`;
        };

        const renderHeroCopy = (slideIndex) => {
          const slide = HERO_SLIDES[slideIndex];
          if (!slide || !heroHeadline || !heroSubline || !heroCtaRow) return;
          const titleLines = getHeroTitleLines(slide);
          heroHeadline.innerHTML = titleLines.map((line, i) => titleLineHTML(line, i)).join("");
          const subOneline = heroSubline.querySelector(".hero-subline-oneline");
          const subTwoline = heroSubline.querySelector(".hero-subline-twoline");
          if (subOneline) subOneline.innerHTML = slide.subline.oneline;
          if (subTwoline) subTwoline.innerHTML = slide.subline.twoline;
          heroSubline.classList.add("hero-copy-desc--subline-long");
          heroSubline.classList.toggle("hero-copy-desc--subline-mob-twoline", slideIndex === 0 || slideIndex === 1);
          heroCtaRow.innerHTML = `${HERO_CTA_DESK_HTML}<div class="hero-cta-row__mob">${renderHeroMobCtas(slide.ctas)}</div>`;
          section.classList.toggle("is-hero-slide-2", slideIndex === 0);
        };

        const revealHeroCopy = () => {
          heroCopy.classList.remove("is-copy-switching", "is-copy-exiting");
          void heroCopy.offsetHeight;
          heroCopy.classList.add("is-revealing");
        };

        const primeCopyForExit = () => {
          if (heroHeadline) {
            heroHeadline.querySelectorAll(".hero-title-line__in").forEach((el) => {
              el.style.animation = "none";
              el.style.transform = "translate3d(0, 0, 0)";
              el.style.opacity = "1";
            });
          }
          [heroSubline, heroCtaRow].forEach((el) => {
            if (!el) return;
            el.style.animation = "none";
            el.style.opacity = "1";
            el.style.transform = "translate3d(0, 0, 0)";
          });
        };

        const clearCopyInlineStyles = () => {
          if (heroHeadline) {
            heroHeadline.querySelectorAll(".hero-title-line__in").forEach((el) => {
              el.style.animation = "";
              el.style.transform = "";
              el.style.opacity = "";
            });
          }
          [heroSubline, heroCtaRow].forEach((el) => {
            if (!el) return;
            el.style.animation = "";
            el.style.opacity = "";
            el.style.transform = "";
          });
        };

        const getHeroCopyExitMs = () => {
          const lineCount = heroHeadline
            ? heroHeadline.querySelectorAll(".hero-title-line__in").length
            : 2;
          const headlineExit =
            HEADLINE_EXIT_MS + Math.max(0, lineCount - 1) * HEADLINE_EXIT_STAGGER_MS;
          return Math.max(headlineExit, COPY_EXIT_MS);
        };

        const swapHeroCopy = (slideIndex) => {
          if (reduceMotion) {
            renderHeroCopy(slideIndex);
            heroCopy.classList.add("is-revealing");
            return Promise.resolve();
          }
          heroCopy.classList.remove("is-revealing", "is-copy-switching", "is-copy-exiting");
          primeCopyForExit();
          void heroCopy.offsetHeight;
          clearCopyInlineStyles();
          heroCopy.classList.add("is-copy-exiting");
          return new Promise((resolve) => {
            window.setTimeout(() => {
              heroCopy.classList.remove("is-copy-exiting");
              renderHeroCopy(slideIndex);
              revealHeroCopy();
              resolve();
            }, getHeroCopyExitMs());
          });
        };

        videos.forEach((v) => {
          v.defaultMuted = true;
          v.muted = true;
          v.setAttribute("muted", "");
          v.setAttribute("playsinline", "");
          try {
            v.pause();
          } catch (_) {}
          try {
            v.load();
          } catch (_) {}
        });

        buildNav();

        const syncHeroBrightNav = () => {
          const header = document.getElementById("site-header");
          if (!header) return;
          const brightVid = videos[0];
          /* 1번 영상 화이트 오버레이(::after)와 동기 — 크로스페이드 퇴장 시 즉시 다크 전환 시작 */
          const bright =
            visible &&
            brightVid &&
            (brightVid.classList.contains("is-incoming") ||
              (brightVid.classList.contains("is-active") &&
                !heroMedia.classList.contains("is-crossfading")));
          header.classList.toggle("is-hero-bright-nav", bright);
          document.documentElement.classList.toggle("is-hero-bright-video", bright);
          window.dispatchEvent(new CustomEvent("hero:bright-nav-change"));
        };

        let activeIdx = 0;
        let visible = false;
        let transitioning = false;
        let swapTimer = 0;
        let progressTimer = 0;
        let slideStartedAt = 0;
        let endLeadTriggered = false;
        const getActive = () => videos[activeIdx];
        const getNext = () => videos[(activeIdx + 1) % videos.length];

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
          if (progressTimer) {
            clearInterval(progressTimer);
            progressTimer = 0;
          }
        };

        const syncNavProgress = () => {
          const elapsed = slideStartedAt ? Date.now() - slideStartedAt : 0;
          const ratio = Math.min(1, elapsed / getSlideTurnMs(activeIdx));
          updateNav(activeIdx, ratio);
        };

        const startSlideTimer = () => {
          slideStartedAt = Date.now();
          endLeadTriggered = false;
          if (progressTimer) clearInterval(progressTimer);
          progressTimer = window.setInterval(() => {
            if (!visible) return;
            syncNavProgress();
            const elapsed = Date.now() - slideStartedAt;
            if (
              !transitioning &&
              !endLeadTriggered &&
              elapsed >= getSlideTurnMs(activeIdx) - CROSSFADE_LEAD_SEC * 1000
            ) {
              endLeadTriggered = true;
              startCrossfade();
            }
          }, 50);
        };

        const finishTransition = (nextIdx) => {
          const prev = videos[activeIdx];
          const next = videos[nextIdx];
          /* 1) 퇴장 영상 class 해제(이미 opacity 0) → 2) crossfade 종료 → 3) 신규 is-active 부여 */
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
          syncHeroBrightNav();
          startSlideTimer();
        };

        const goToSlide = async (targetIdx, fromUser = false) => {
          if (!visible || transitioning || targetIdx === activeIdx) return;
          if (targetIdx < 0 || targetIdx >= videos.length) return;
          const active = getActive();
          const next = videos[targetIdx];
          transitioning = true;
          if (fromUser) endLeadTriggered = true;
          clearTransitionTimers();
          clearCrossfadeClass();
          swapHeroCopy(targetIdx);
          try {
            next.currentTime = 0;
          } catch (_) {}
          next.classList.add("is-incoming");
          syncHeroBrightNav();
          try {
            if (next.readyState < 2) next.load();
          } catch (_) {}
          await waitForCanPlay(next, 500);
          if (!visible) {
            transitioning = false;
            next.classList.remove("is-incoming");
            return;
          }
          safePlay(active);
          safePlay(next);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              heroMedia.classList.add("is-crossfading");
              syncHeroBrightNav();
            });
          });
          swapTimer = window.setTimeout(() => {
            finishTransition(targetIdx);
            safePause(active);
            safePlay(next);
            transitioning = false;
            if (!fromUser) endLeadTriggered = false;
          }, CROSSFADE_MS);
        };

        const startCrossfade = () => goToSlide((activeIdx + 1) % videos.length);

        videos.forEach((v) => {
          v.loop = true;
          v.addEventListener("canplay", () => {
            if (canPlayHeroVideo() && v === getActive() && v.paused && !transitioning) safePlay(v);
          });
          v.addEventListener("timeupdate", () => {
            if (!visible || v !== getActive()) return;
            const upcoming = getNext();
            const elapsed = slideStartedAt ? Date.now() - slideStartedAt : 0;
            if (elapsed >= getSlideTurnMs(activeIdx) - 3000) {
              try {
                if (upcoming.readyState < 2) upcoming.load();
              } catch (_) {}
            }
          });
        });

        const syncHeroVisibility = () => {
          if (!visible) {
            clearTransitionTimers();
            clearCrossfadeClass();
            transitioning = false;
            endLeadTriggered = false;
            heroCopy.classList.remove("is-revealing", "is-copy-switching", "is-copy-exiting");
            videos.forEach((v) => {
              v.classList.remove("is-incoming");
              safePause(v);
            });
            syncHeroBrightNav();
            section.classList.remove("is-hero-slide-2");
            return;
          }
          syncHeroBrightNav();
          if (isContentReady()) {
            section.classList.add("is-section-active");
            renderHeroCopy(activeIdx);
            revealHeroCopy();
          }
          syncNavProgress();
          const active = getActive();
          if (
            canPlayHeroVideo() &&
            active.paused &&
            !transitioning &&
            active.readyState >= 2
          ) {
            safePlay(active);
          }
          if (canPlayHeroVideo() && !progressTimer) startSlideTimer();
        };

        section.addEventListener("hero:intro-mask-open", () => {
          if (visible) syncHeroVisibility();
        });
        section.addEventListener("hero:intro-content-ready", () => {
          if (visible) syncHeroVisibility();
        });

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

        const onHeroTitleLayoutChange = () => {
          if (!visible) return;
          renderHeroCopy(activeIdx);
          revealHeroCopy();
        };
        [heroTitleMobMq, heroTitlePadMq].forEach((mq) => {
          if (typeof mq.addEventListener === "function") {
            mq.addEventListener("change", onHeroTitleLayoutChange);
          } else if (typeof mq.addListener === "function") {
            mq.addListener(onHeroTitleLayoutChange);
          }
        });
        /** 모바일·패드: 히어로 영역 가로 드래그로 배너 전환 */
        const mqHeroSwipe = window.matchMedia(
          "(max-width: 719px), ((width: 768px) and (orientation: portrait)), ((width: 820px) and (orientation: portrait)), ((width: 1024px) and (orientation: portrait))"
        );
        const HERO_SWIPE_THRESHOLD_PX = 44;
        const HERO_SWIPE_AXIS_RATIO = 1.35;
        let heroSwipeTracking = false;
        let heroSwipeStartX = 0;
        let heroSwipeStartY = 0;
        let heroSwipeLastX = 0;
        let heroSwipeLastY = 0;
        let heroSwipeMoved = false;

        const isHeroSwipeTarget = (target) => {
          if (!(target instanceof Element)) return false;
          if (target.closest("#hero-video-nav")) return false;
          if (target.closest("a, button, input, textarea, select, label")) return false;
          return true;
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
          goToSlide(nextIdx, true);
        };

        const onHeroSwipeDown = (e) => {
          if (!mqHeroSwipe.matches || !visible || e.button !== 0) return;
          if (!isHeroSwipeTarget(e.target)) return;
          heroSwipeTracking = true;
          heroSwipeMoved = false;
          heroSwipeStartX = e.clientX;
          heroSwipeStartY = e.clientY;
          heroSwipeLastX = e.clientX;
          heroSwipeLastY = e.clientY;
        };

        const onHeroSwipeMove = (e) => {
          if (!heroSwipeTracking) return;
          heroSwipeLastX = e.clientX;
          heroSwipeLastY = e.clientY;
          const dx = e.clientX - heroSwipeStartX;
          const dy = e.clientY - heroSwipeStartY;
          if (Math.abs(dx) > 8 || Math.abs(dy) > 8) heroSwipeMoved = true;
        };

        const onHeroSwipeEnd = (e) => {
          if (!heroSwipeTracking) return;
          heroSwipeTracking = false;
          if (!heroSwipeMoved) return;
          const endX = e.type === "pointercancel" ? heroSwipeLastX : e.clientX;
          const endY = e.type === "pointercancel" ? heroSwipeLastY : e.clientY;
          tryHeroSwipe(endX, endY);
        };

        const onHeroSwipeClick = (e) => {
          if (!heroSwipeMoved) return;
          if (!isHeroSwipeTarget(e.target)) return;
          e.preventDefault();
          e.stopPropagation();
          heroSwipeMoved = false;
        };

        section.addEventListener("pointerdown", onHeroSwipeDown, { passive: true });
        section.addEventListener("pointermove", onHeroSwipeMove, { passive: true });
        section.addEventListener("pointerup", onHeroSwipeEnd, { passive: true });
        section.addEventListener("pointercancel", onHeroSwipeEnd, { passive: true });
        section.addEventListener("click", onHeroSwipeClick, true);
      })();

      /** 섹션 대타이틀: 뷰포트 진입 시 라인 단위 등장 · snap-section에 is-section-active 토글 */
      (function initSectionDisplayTitleReveal() {
        const reduceMotion =
          window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const ids = ["services", "media", "cases", "growth", "contact-footer"];
        const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);

        sections.forEach((el) => {
          if (reduceMotion) {
            el.classList.add("is-section-active");
            return;
          }
          if (window.__isPreviewIframe) return;
          if (!("IntersectionObserver" in window)) {
            el.classList.add("is-section-active");
            return;
          }
          const io = new IntersectionObserver(
            (entries) => {
              const hit = entries.find((e) => e.target === el);
              if (!hit || !hit.isIntersecting || hit.intersectionRatio < 0.1) return;
              el.classList.add("is-section-active");
              io.unobserve(el);
            },
            { threshold: [0, 0.08, 0.1, 0.14], rootMargin: "0px 0px -18% 0px" }
          );
          io.observe(el);
        });
      })();

      (function initMediaBgVideo() {
        const video = document.getElementById("media-bg-video");
        const section = document.getElementById("media");
        if (!video || !section) return;

        video.playbackRate = 0.72;
        video.addEventListener("loadedmetadata", () => {
          video.playbackRate = 0.72;
        });

        const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) return;

        video.defaultMuted = true;
        video.muted = true;
        video.setAttribute("muted", "");
        video.setAttribute("playsinline", "");

        let visible = false;

        const safePlay = () => {
          if (!video.paused) return;
          video.playbackRate = 0.72;
          const p = video.play?.();
          if (p && typeof p.catch === "function") p.catch(() => {});
        };

        const safePause = () => {
          try {
            video.pause();
          } catch (_) {}
        };

        const tryPlayIfVisible = () => {
          if (!visible) return;
          safePlay();
        };

        safePause();

        const io = new IntersectionObserver(
          (entries) => {
            const hit = entries.find((e) => e.target === section);
            if (!hit) return;
            visible = hit.isIntersecting && hit.intersectionRatio > 0.03;
            if (!visible) {
              safePause();
              return;
            }
            tryPlayIfVisible();
          },
          { threshold: [0, 0.03, 0.08, 0.15, 0.35, 0.6, 1] }
        );
        io.observe(section);

        window.addEventListener("scroll", tryPlayIfVisible, { passive: true });

        video.addEventListener("canplay", tryPlayIfVisible);
        video.addEventListener("loadeddata", tryPlayIfVisible);
      })();

      (function initSectionScrollEasing() {
        const reduceMotion =
          window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) return;

        const mqMobileSnap = window.matchMedia("(max-width: 719px), ((width: 768px) and (orientation: portrait)), ((width: 820px) and (orientation: portrait)), ((width: 1024px) and (orientation: portrait))");
        const getScrollPad = () => {
          const nh =
            parseFloat(
              getComputedStyle(document.documentElement).getPropertyValue("--nav-height")
            ) || 90;
          return nh;
        };
        /** 모바일: 이전 섹션 1~20px 비침 방지 — 헤더 높이 기준 + 2px 스냅 보정 */
        const snapTargetY = (sectionTop) => {
          const y = sectionTop - getScrollPad();
          return mqMobileSnap.matches ? Math.round(y + 2) : Math.round(y);
        };
        const EDGE = 14;
        const sections = () => [...document.querySelectorAll(".snap-section")];

        const layouts = () =>
          sections().map((el) => {
            const top = el.getBoundingClientRect().top + window.scrollY;
            const height = el.offsetHeight;
            return { el, top, bottom: top + height, height };
          });

        const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

        /** 스크롤 이징: 거리 기반 duration + ease-out-quad */
        const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);

        const durationFor = (dist) =>
          clamp(Math.round(110 + Math.sqrt(Math.abs(dist)) * 0.48), 170, 360);

        let animating = false;
        let rafId = 0;

        window.__snapAnimating = () => animating;

        const animateTo = (targetY) => {
          const maxScroll = Math.max(
            0,
            document.documentElement.scrollHeight - window.innerHeight
          );
          const end = clamp(targetY, 0, maxScroll);
          const start = window.scrollY;
          const dist = end - start;
          if (Math.abs(dist) < 2) {
            window.dispatchEvent(new CustomEvent("snap-scroll-settled"));
            return;
          }

          animating = true;
          const dur = durationFor(dist);
          const t0 = performance.now();

          const tick = (now) => {
            const elapsed = now - t0;
            const p = clamp(elapsed / dur, 0, 1);
            const eased = easeOutQuad(p);
            window.scrollTo(0, start + dist * eased);
            if (typeof window.__syncSnapReveals === "function") window.__syncSnapReveals();
            if (p < 1) {
              rafId = window.requestAnimationFrame(tick);
            } else {
              animating = false;
              rafId = 0;
              window.scrollTo(0, end);
              window.dispatchEvent(new CustomEvent("snap-scroll-settled"));
            }
          };
          rafId = window.requestAnimationFrame(tick);
        };

        const indexFromScroll = (scrollY, vp) => {
          const anchor = scrollY + getScrollPad() + 1;
          const L = layouts();
          if (!L.length) return 0;
          for (let i = 0; i < L.length; i++) {
            if (anchor >= L[i].top && anchor < L[i].bottom) return i;
          }
          if (anchor < L[0].top) return 0;
          return L.length - 1;
        };

        window.addEventListener(
          "wheel",
          (e) => {
            if (e.target.closest && e.target.closest(".gnb-mega__panel")) return;
            // allow interrupt for trackpad/continuous scroll
            if (animating) {
              if (rafId) cancelAnimationFrame(rafId);
              rafId = 0;
              animating = false;
              if (typeof window.__syncSnapReveals === "function") window.__syncSnapReveals();
            }
            const L = layouts();
            if (L.length < 2) return;

            const scrollY = window.scrollY;
            const vp = window.innerHeight;
            const idx = indexFromScroll(scrollY, vp);
            const r = L[idx];
            const delta = e.deltaY;
            // ignore tiny deltas (trackpads)
            if (Math.abs(delta) < 8) return;

            const tall = r.height > vp + 24;
            const atBottom = scrollY + vp >= r.bottom - EDGE;
            const atTop = scrollY <= r.top - getScrollPad() + EDGE;

            if (delta > 0) {
              if (tall && !atBottom) return;
              if (idx >= L.length - 1) return;
              e.preventDefault();
              animateTo(snapTargetY(L[idx + 1].top));
              return;
            }

            if (delta < 0) {
              if (tall && !atTop) return;
              if (idx <= 0) return;
              e.preventDefault();
              animateTo(snapTargetY(L[idx - 1].top));
            }
          },
          { passive: false }
        );

        document.addEventListener(
          "click",
          (e) => {
            if (e.defaultPrevented) return;
            if (e.button !== 0) return;
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            const a = e.target.closest && e.target.closest('a[href^="#"]');
            if (!a) return;
            const raw = a.getAttribute("href");
            if (!raw || raw === "#") return;
            const targetEl = document.querySelector(raw);
            if (!targetEl) return;

            if (!sections().some((s) => s === targetEl || s.contains(targetEl))) return;

            e.preventDefault();
            const top = targetEl.getBoundingClientRect().top + window.scrollY;
            animateTo(snapTargetY(top));
          },
          true
        );

        window.addEventListener("keydown", (e) => {
          const el = e.target;
          if (
            el &&
            el.closest &&
            el.closest('input, textarea, select, [contenteditable="true"]')
          ) {
            return;
          }
          const isSpace = e.key === " " || e.code === "Space";
          /* 키보드: 스냅 섹션 간 이동(화살표/스페이스) 처리 */
          if (
            isSpace &&
            el &&
            el.closest &&
            el.closest('button, a[href], summary, [role="button"]')
          ) {
            return;
          }
          if (animating) {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = 0;
            animating = false;
            if (typeof window.__syncSnapReveals === "function") window.__syncSnapReveals();
          }
          const L = layouts();
          if (L.length < 2) return;
          const scrollY = window.scrollY;
          const vp = window.innerHeight;
          const idx = indexFromScroll(scrollY, vp);
          const r = L[idx];
          const tall = r.height > vp + 24;
          const atBottom = scrollY + vp >= r.bottom - EDGE;
          const atTop = scrollY <= r.top - getScrollPad() + EDGE;

          const wantDown =
            e.key === "PageDown" ||
            e.key === "ArrowDown" ||
            (isSpace && !e.shiftKey);
          const wantUp =
            e.key === "PageUp" ||
            e.key === "ArrowUp" ||
            (isSpace && e.shiftKey);

          if (wantDown) {
            if (tall && !atBottom) return;
            if (idx >= L.length - 1) return;
            e.preventDefault();
            animateTo(snapTargetY(L[idx + 1].top));
          } else if (wantUp) {
            if (tall && !atTop) return;
            if (idx <= 0) return;
            e.preventDefault();
            animateTo(snapTargetY(L[idx - 1].top));
          }
        });
      })();

      (function initSectionQuickNav() {
        const nav = document.getElementById("section-quick-nav");
        const scrollActions = document.getElementById("section-scroll-actions");
        const btnUp = document.getElementById("section-quick-nav-up");
        const btnDown = document.getElementById("section-quick-nav-down");
        if (!nav && !btnUp && !btnDown) return;

        const mqMobileSnap = window.matchMedia("(max-width: 719px), ((width: 768px) and (orientation: portrait)), ((width: 820px) and (orientation: portrait)), ((width: 1024px) and (orientation: portrait))");
        const mqDesktopQuickNav = window.matchMedia(
          "(min-width: 720px) and (not ((width: 768px) and (orientation: portrait))) and (not ((width: 820px) and (orientation: portrait))) and (not ((width: 1024px) and (orientation: portrait)))"
        );
        const isHeroBrightQuickNav = () =>
          mqDesktopQuickNav.matches &&
          document.documentElement.classList.contains("is-hero-bright-video");
        const getScrollPad = () => {
          const nh =
            parseFloat(
              getComputedStyle(document.documentElement).getPropertyValue("--nav-height")
            ) || 90;
          return nh;
        };
        const snapTargetY = (sectionTop) => {
          const y = sectionTop - getScrollPad();
          return mqMobileSnap.matches ? Math.round(y + 2) : Math.round(y);
        };
        const links = nav ? [...nav.querySelectorAll(".sq-nav-link")] : [];
        const btnUpIcon = btnUp && btnUp.querySelector("iconify-icon");
        const SQ_ICON_UP = "solar:alt-arrow-up-linear";
        const SQ_ICON_DOWN = "solar:alt-arrow-down-linear";
        const reduceMotion =
          window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        /** 퀵네비 라벨·도트 마스크: 섹션 배경 톤별 전환 */
        const QUICK_NAV_LIGHT_BG = new Set(["services", "cases"]);
        const QUICK_NAV_GRAY_BG = new Set(["media"]);

        const isContactFooterLightNav = () => {
          const contact = document.getElementById("contact");
          if (!contact) return true;
          const probeY = window.scrollY + window.innerHeight * 0.42;
          const contactBottom = contact.getBoundingClientRect().bottom + window.scrollY;
          return probeY <= contactBottom;
        };

        const getSnaps = () => [...document.querySelectorAll(".snap-section")];

        const getActiveIndex = () => {
          const snaps = getSnaps();
          if (!snaps.length) return { activeId: "", index: 0 };

          const anchor = window.scrollY + getScrollPad() + 2;
          let activeId = snaps[snaps.length - 1].id;
          let index = snaps.length - 1;

          for (let i = 0; i < snaps.length; i++) {
            const sec = snaps[i];
            const top = sec.getBoundingClientRect().top + window.scrollY;
            const bottom = top + sec.offsetHeight;
            if (anchor >= top && anchor < bottom) {
              activeId = sec.id;
              index = i;
              break;
            }
          }

          return { activeId, index };
        };

        const scrollToSnapIndex = (index) => {
          const snaps = getSnaps();
          if (index < 0 || index >= snaps.length) return;
          const top = snapTargetY(
            snaps[index].getBoundingClientRect().top + window.scrollY
          );
          window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? "auto" : "smooth" });
        };

        const setActive = (id) => {
          links.forEach((a) => {
            const hid =
              a.getAttribute("data-sq-section") || (a.getAttribute("href") || "").replace(/^#/, "");
            const on = hid === id;
            a.classList.toggle("is-active", on);
            if (on) a.setAttribute("aria-current", "location");
            else a.removeAttribute("aria-current");
          });
        };

        const scrollToPageTop = () => {
          window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
        };

        const updateScrollButtons = (activeId, index) => {
          const snaps = getSnaps();
          const atHero = activeId === "hero";
          const atEnd = index >= snaps.length - 1;

          if (btnUp) {
            btnUp.classList.remove("hidden");
            if (atHero) {
              if (btnUpIcon) btnUpIcon.setAttribute("icon", SQ_ICON_DOWN);
              btnUp.setAttribute("aria-label", "다음 섹션으로 이동");
            } else {
              if (btnUpIcon) btnUpIcon.setAttribute("icon", SQ_ICON_UP);
              btnUp.setAttribute("aria-label", "페이지 최상단으로 이동");
            }
          }
          if (btnDown) btnDown.classList.toggle("hidden", atEnd || atHero);
        };

        const updateActive = () => {
          const snaps = getSnaps();
          if (!snaps.length) return;

          const { activeId, index } = getActiveIndex();

          setActive(activeId);
          let isLight = QUICK_NAV_LIGHT_BG.has(activeId);
          if (activeId === "contact-footer") isLight = isContactFooterLightNav();
          if (activeId === "hero" && isHeroBrightQuickNav()) isLight = true;
          const isGray = QUICK_NAV_GRAY_BG.has(activeId);
          const isGrowth = activeId === "growth";
          if (nav) {
            nav.classList.toggle("sq-nav--light", isLight);
            nav.classList.toggle("sq-nav--gray", isGray);
            nav.classList.toggle("sq-nav--growth", isGrowth);
          }
          if (scrollActions) scrollActions.classList.toggle("sq-nav--light", isLight);
          updateScrollButtons(activeId, index);
        };

        if (btnUp) {
          btnUp.addEventListener("click", () => {
            const { activeId, index } = getActiveIndex();
            if (activeId === "hero") {
              const snaps = getSnaps();
              if (index < snaps.length - 1) scrollToSnapIndex(index + 1);
              return;
            }
            scrollToPageTop();
          });
        }
        if (btnDown) {
          btnDown.addEventListener("click", () => {
            const { index } = getActiveIndex();
            const snaps = getSnaps();
            if (index < snaps.length - 1) scrollToSnapIndex(index + 1);
          });
        }

        updateActive();
        window.addEventListener("scroll", updateActive, { passive: true });
        window.addEventListener("resize", updateActive);
        window.addEventListener("hero:bright-nav-change", updateActive);
        if (typeof mqDesktopQuickNav.addEventListener === "function") {
          mqDesktopQuickNav.addEventListener("change", updateActive);
        } else if (typeof mqDesktopQuickNav.addListener === "function") {
          mqDesktopQuickNav.addListener(updateActive);
        }
      })();

      (function initMobileMenu() {
        const button = document.getElementById("mobile-menu-button");
        const menu = document.getElementById("mobile-menu");
        const header = document.getElementById("site-header");
        const menuIcon = button && button.querySelector(".header-menu-icon");
        const mqMobile = window.matchMedia("(max-width: 719px), ((width: 768px) and (orientation: portrait)), ((width: 820px) and (orientation: portrait)), ((width: 1024px) and (orientation: portrait))");
        if (!button || !menu) return;

        const groups = menu.querySelectorAll("[data-mobile-nav-group]");

        const closeAllGroups = () => {
          groups.forEach((group) => {
            group.classList.remove("is-open");
            const toggle = group.querySelector("[data-mobile-nav-toggle]");
            const panel = group.querySelector(".mobile-nav__panel");
            if (toggle) toggle.setAttribute("aria-expanded", "false");
            if (panel) panel.hidden = true;
          });
        };

        groups.forEach((group) => {
          const toggle = group.querySelector("[data-mobile-nav-toggle]");
          const panel = group.querySelector(".mobile-nav__panel");
          if (!toggle || !panel) return;
          toggle.addEventListener("click", () => {
            const wasOpen = group.classList.contains("is-open");
            closeAllGroups();
            if (!wasOpen) {
              group.classList.add("is-open");
              toggle.setAttribute("aria-expanded", "true");
              panel.hidden = false;
              try {
                menu.scrollTo({ top: 0, behavior: "smooth" });
              } catch (_) {
                menu.scrollTop = 0;
              }
            }
          });
        });

        const getMenuFocusables = () =>
          Array.from(
            menu.querySelectorAll(
              'a[href]:not([aria-disabled="true"]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
          ).filter((el) => el.offsetParent !== null && !el.closest("[hidden]"));

        const trapMenuFocus = (e) => {
          if (e.key !== "Tab" || !isOpen()) return;
          const items = getMenuFocusables();
          if (!items.length) return;
          const first = items[0];
          const last = items[items.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        };
        menu.addEventListener("keydown", trapMenuFocus);

        const setOpen = (open) => {
          button.setAttribute("aria-expanded", String(open));
          button.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
          menu.classList.toggle("hidden", !open);
          menu.setAttribute("aria-hidden", open ? "false" : "true");
          if (menuIcon) {
            menuIcon.setAttribute("icon", open ? "solar:close-circle-linear" : "solar:hamburger-menu-linear");
          }
          if (!open) closeAllGroups();
          if (header && mqMobile.matches) {
            header.classList.toggle("is-mobile-menu-open", open);
          }
          document.documentElement.classList.toggle("is-mobile-menu-open", open && mqMobile.matches);
          if (open) {
            closeHeaderSearchIfOpen?.();
            const items = getMenuFocusables();
            if (items[0]) items[0].focus();
          } else {
            button.focus();
          }
        };

        const isOpen = () => button.getAttribute("aria-expanded") === "true";
        button.addEventListener("click", () => setOpen(!isOpen()));

        menu.querySelectorAll("[data-mobile-menu-link]").forEach((el) => {
          el.addEventListener("click", () => setOpen(false));
        });

        document.addEventListener("click", (e) => {
          if (!isOpen()) return;
          const t = e.target;
          if (button.contains(t) || menu.contains(t)) return;
          setOpen(false);
        });

        document.addEventListener("keydown", (e) => {
          if (e.key !== "Escape") return;
          if (!isOpen()) return;
          setOpen(false);
          button.focus();
        });

        window.addEventListener("resize", () => {
          if (!mqMobile.matches) {
            setOpen(false);
            if (header) header.classList.remove("is-mobile-menu-open");
            document.documentElement.classList.remove("is-mobile-menu-open");
          }
        });
      })();

      /** GNB 메가 — 패드 가로: gnb-pad.js에서 처리 */
      (function initGnbMegaClick() {
        if (document.documentElement.classList.contains("is-pad-gnb")) {
          return;
        }

        const mega = document.getElementById("gnb-mega");
        if (!mega) return;

        const mqPadLandscape = window.matchMedia(
          "((height: 768px) and (orientation: landscape)), ((height: 820px) and (orientation: landscape)), ((height: 1024px) and (orientation: landscape))"
        );

        const items = [...mega.querySelectorAll(".gnb-mega__item[data-mega-item]")];
        if (!items.length) return;

        const syncMega = () => mega.dispatchEvent(new CustomEvent("wj-gnb-mega-sync"));

        const closeAll = () => {
          items.forEach((item) => {
            item.classList.remove("is-open");
            const trigger = item.querySelector(".gnb-mega__trigger");
            if (trigger) trigger.setAttribute("aria-expanded", "false");
          });
          syncMega();
        };

        const openItem = (item) => {
          const trigger = item.querySelector(".gnb-mega__trigger");
          closeAll();
          item.classList.add("is-open");
          if (trigger) trigger.setAttribute("aria-expanded", "true");
          syncMega();
          if (item.hasAttribute("data-mega-simple")) {
            requestAnimationFrame(() => item.dispatchEvent(new Event("mouseenter")));
          }
        };

        items.forEach((item) => {
          const trigger = item.querySelector(".gnb-mega__trigger");
          if (!trigger) return;
          if (!trigger.hasAttribute("aria-expanded")) {
            trigger.setAttribute("aria-expanded", "false");
          }

          trigger.addEventListener("click", (e) => {
            if (!mqPadLandscape.matches) return;

            if (item.classList.contains("is-open")) {
              closeAll();
              return;
            }

            e.preventDefault();
            openItem(item);
          });
        });

        document.addEventListener("click", (e) => {
          if (!mqPadLandscape.matches) return;
          if (!items.some((item) => item.classList.contains("is-open"))) return;
          if (mega.contains(e.target)) return;
          closeAll();
        });

        document.addEventListener("keydown", (e) => {
          if (e.key !== "Escape") return;
          if (!items.some((item) => item.classList.contains("is-open"))) return;
          closeAll();
        });

        const applyMode = () => {
          if (!mqPadLandscape.matches) closeAll();
        };

        if (typeof mqPadLandscape.addEventListener === "function") {
          mqPadLandscape.addEventListener("change", applyMode);
        }
      })();

      (function initGnbMegaSheetHeightSync() {
        /* 패드 가로 — 시트 높이는 gnb-pad.js에서 단독 처리 */
        if (document.documentElement.classList.contains("is-pad-gnb")) {
          return;
        }

        const mega = document.getElementById("gnb-mega");
        if (!mega) return;
        const sheet = mega.querySelector(".gnb-mega__sheet");
        if (!sheet) return;

        let lastH = 0;

        const maxPanelPx = () => {
          const nh = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-height")) || 90;
          return Math.max(160, Math.round(window.innerHeight - nh - 20));
        };

        const activePanel = () => {
          const items = mega.querySelectorAll(".gnb-mega__item[data-mega-item]");
          for (const li of items) {
            if (
              li.matches(":hover") ||
              li.contains(document.activeElement) ||
              li.classList.contains("is-open")
            ) {
              return li.querySelector(".gnb-mega__panel");
            }
          }
          return null;
        };

        const sync = () => {
          const inMega =
            mega.matches(":hover") ||
            mega.contains(document.activeElement) ||
            mega.querySelector(".gnb-mega__item.is-open");
          if (!inMega) {
            sheet.style.height = "";
            sheet.style.minHeight = "";
            return;
          }
          const panel = activePanel();
          const cap = maxPanelPx();
          if (panel) {
            const h = Math.min(Math.max(Math.ceil(panel.offsetHeight || panel.getBoundingClientRect().height), 1), cap);
            lastH = h;
            sheet.style.height = h + "px";
            sheet.style.minHeight = h + "px";
            return;
          }
          if (lastH > 0) {
            sheet.style.height = lastH + "px";
            sheet.style.minHeight = lastH + "px";
          }
        };

        const raf2 = (fn) => requestAnimationFrame(() => requestAnimationFrame(fn));

        mega.addEventListener("pointerenter", () => raf2(sync), true);
        mega.addEventListener("pointerleave", () => raf2(sync));
        mega.addEventListener("mouseover", () => requestAnimationFrame(sync));
        mega.addEventListener("focusin", () => raf2(sync), true);
        mega.addEventListener("focusout", () => raf2(sync), true);
        window.addEventListener("resize", () => raf2(sync), { passive: true });

        if ("ResizeObserver" in window) {
          const ro = new ResizeObserver(() => raf2(sync));
          mega.querySelectorAll(".gnb-mega__panel-inner").forEach((el) => ro.observe(el));
        }

        window.addEventListener("load", () => raf2(sync), { once: true });
        mega.addEventListener("wj-gnb-mega-sync", () => raf2(sync));
      })();

      /** GNB: 자료실·미디어룸·회사소개 — 서브 블록을 해당 대메뉴 글자 아래로 가로 정렬 */
      (function initGnbMegaSimpleAlign() {
        const items = [...document.querySelectorAll(".gnb-mega__item[data-mega-simple]")];
        if (!items.length) return;

        const alignOne = (item) => {
          const trigger = item.querySelector(".gnb-mega__trigger");
          const inner = item.querySelector(".gnb-mega__panel-inner");
          const shift = item.querySelector(".gnb-mega__panel-shift");
          if (!trigger || !inner || !shift) return;
          const tr = trigger.getBoundingClientRect();
          const box = inner.getBoundingClientRect();
          const cs = window.getComputedStyle(inner);
          const padL = parseFloat(cs.paddingLeft) || 0;
          const padR = parseFloat(cs.paddingRight) || 0;
          const contentLeft = box.left + padL;
          let ml = Math.round(tr.left - contentLeft);
          const sw = shift.offsetWidth;
          const maxMl = Math.max(0, inner.clientWidth - padL - padR - sw - 10);
          if (ml < 0) ml = 0;
          if (ml > maxMl) ml = maxMl;
          shift.style.marginLeft = ml + "px";
          item.closest("#gnb-mega")?.dispatchEvent(new CustomEvent("wj-gnb-mega-sync"));
        };

        items.forEach((item) => {
          item.addEventListener("mouseenter", () => requestAnimationFrame(() => alignOne(item)));
          item.addEventListener("focusin", () => requestAnimationFrame(() => alignOne(item)), true);
        });
        window.addEventListener(
          "resize",
          () => requestAnimationFrame(() => items.forEach(alignOne)),
          { passive: true }
        );
      })();

      /** Services: text → cards(빠르게 순차) → CTA 버튼 */
      (function initServicesScrollReveal() {
        const section = document.getElementById("services");
        if (!section) return;

        const reduceMotion =
          window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const text = section.querySelector('[data-services-reveal="text"]');
        const cta = section.querySelector('[data-services-reveal="cta"]');
        const cards = [...section.querySelectorAll(".service-card.srvc-reveal")];

        const reveal = (el) => el && el.classList.add("is-revealed");

        let servicesRevealDone = false;
        const run = () => {
          if (servicesRevealDone) return;
          servicesRevealDone = true;
          reveal(text);

          const base = 220;
          const step = 110;

          cards.forEach((card, i) => {
            if (reduceMotion) return reveal(card);
            window.setTimeout(() => reveal(card), base + i * step);
          });

          if (reduceMotion) return reveal(cta);
          window.setTimeout(() => reveal(cta), base + cards.length * step + 260);
        };

        section.__snapReveal = run;

        if (reduceMotion || window.__isPreviewIframe || !("IntersectionObserver" in window)) {
          if (!window.__isPreviewIframe) run();
          return;
        }

        const io = new IntersectionObserver(
          (entries) => {
            if (!entries.some((e) => e.isIntersecting)) return;
            run();
            io.disconnect();
          },
          { threshold: 0.26, rootMargin: "0px 0px -24% 0px" }
        );
        io.observe(section);
      })();

      /** 공통: 스크롤 등장 — [data-reveal-seq] 섹션은 상→하 순차, 스태거 블록은 한 단계로 실행 후 카드 순차 */
      (function initGlobalScrollReveal() {
        const reduceMotion =
          window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const supportsIO = "IntersectionObserver" in window;

        const reveal = (el) => el && el.classList.add("is-revealed");

        const readAttrNum = (src, name, fallback) => {
          const raw = src.getAttribute(name);
          if (raw === null || raw === "") return fallback;
          const n = Number(raw);
          return Number.isFinite(n) ? n : fallback;
        };

        const mqGrowthStagger = window.matchMedia("(max-width: 719px), ((width: 768px) and (orientation: portrait)), ((width: 820px) and (orientation: portrait)), ((width: 1024px) and (orientation: portrait))");
        const readStaggerStep = (container) => {
          if (mqGrowthStagger.matches) {
            const m = readAttrNum(container, "data-reveal-stagger-step-m", NaN);
            if (Number.isFinite(m)) return m;
          }
          return readAttrNum(container, "data-reveal-stagger-step", 120);
        };

        function runStaggerContainer(container) {
          const children = [...container.querySelectorAll(".reveal-up")];
          const base = readAttrNum(container, "data-reveal-stagger-base", 90);
          const step = readStaggerStep(container);
          children.forEach((el, idx) => {
            if (reduceMotion) {
              reveal(el);
              return;
            }
            window.setTimeout(() => reveal(el), base + idx * step);
          });

          const owner = container.closest("[data-reveal-seq]");
          if (owner) {
            owner.dispatchEvent(
              new CustomEvent("reveal-seq-stagger", { bubbles: false, detail: { container } })
            );
          }
        }

        function staggerTailMs(container) {
          const n = container.querySelectorAll(".reveal-up").length;
          const base = readAttrNum(container, "data-reveal-stagger-base", 90);
          const step = readStaggerStep(container);
          return base + Math.max(0, n - 1) * step + 140;
        }

        function buildRevealSeqSteps(section) {
          const staggers = [...section.querySelectorAll("[data-reveal-stagger]")];
          const stSet = new Set(staggers);
          const nodes = [
            ...section.querySelectorAll("[data-reveal-stagger], .reveal-up:not([data-reveal-managed])"),
          ];
          const steps = [];
          for (const node of nodes) {
            if (node.matches("[data-reveal-stagger]")) {
              steps.push({ kind: "stagger", el: node });
              continue;
            }
            if (!node.matches(".reveal-up")) continue;
            if ([...stSet].some((st) => st !== node && st.contains(node))) continue;
            steps.push({ kind: "single", el: node });
          }
          return steps;
        }

        // 1) [data-reveal-stagger]: seq 섹션 안은 IO 생략(아래 섹션 순서에서 한 번에 실행)
        const staggerContainers = [...document.querySelectorAll("[data-reveal-stagger]")];
        staggerContainers.forEach((container) => {
          const children = [...container.querySelectorAll(".reveal-up")];
          children.forEach((c) => c.setAttribute("data-reveal-managed", "true"));

          const run = () => runStaggerContainer(container);

          if (reduceMotion || !supportsIO) {
            if (!container.closest("[data-reveal-seq]")) run();
            return;
          }
          if (container.closest("[data-reveal-seq]")) return;

          const io = new IntersectionObserver(
            (entries) => {
              if (!entries.some((e) => e.isIntersecting && e.intersectionRatio > 0.12)) return;
              run();
              io.disconnect();
            },
            { threshold: [0, 0.12, 0.18], rootMargin: "0px 0px -18% 0px" }
          );
          io.observe(container);
        });

        // 2) [data-reveal-seq]: 문서 순서대로 단일 reveal → 스태거 묶음 → …
        const seqRoots = [...document.querySelectorAll("[data-reveal-seq]")].filter(
          (section) => !section.closest(".sub-page")
        );
        seqRoots.forEach((section) => {
          const steps = buildRevealSeqSteps(section);
          if (!steps.length) return;

          const seqStep = readAttrNum(section, "data-reveal-seq-step", 140);
          const seqLead = readAttrNum(section, "data-reveal-seq-base", 60);

          let seqDone = false;
          const runSeq = () => {
            if (seqDone) return;
            seqDone = true;
            let t = seqLead;
            steps.forEach((step) => {
              if (step.kind === "single") {
                if (reduceMotion) reveal(step.el);
                else window.setTimeout(() => reveal(step.el), t);
                t += seqStep;
              } else {
                if (reduceMotion) runStaggerContainer(step.el);
                else window.setTimeout(() => runStaggerContainer(step.el), t);
                t += staggerTailMs(step.el);
              }
            });
          };

          if (section.id === "growth") {
            section.__growthRunSeq = runSeq;
            return;
          }

          section.__snapReveal = runSeq;

          if (reduceMotion || window.__isPreviewIframe || !supportsIO) {
            if (!window.__isPreviewIframe) runSeq();
            return;
          }

          const io = new IntersectionObserver(
            (entries) => {
              if (!entries.some((e) => e.isIntersecting && e.intersectionRatio > 0.1)) return;
              runSeq();
              io.disconnect();
            },
            { threshold: [0, 0.1, 0.16], rootMargin: "0px 0px -14% 0px" }
          );
          io.observe(section);
        });

        // 3) 개별 reveal-up (seq에 속하지 않은 요소만)
        const singles = [
          ...document.querySelectorAll(".reveal-up:not([data-reveal-managed])"),
        ].filter((el) => !el.closest("[data-reveal-seq]") && !el.closest(".sub-page"));

        if (reduceMotion || !supportsIO) {
          singles.forEach(reveal);
          return;
        }

        const ioSingle = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (!e.isIntersecting || e.intersectionRatio < 0.12) return;
              reveal(e.target);
              ioSingle.unobserve(e.target);
            });
          },
          { threshold: [0, 0.12, 0.18], rootMargin: "0px 0px -18% 0px" }
        );
        singles.forEach((el) => ioSingle.observe(el));
      })();

      /** 성장스토리: 화이트 → 좌→우 배경 마스크 리빌(히어로 패턴) → 상단 순차 등장 */
      (function initGrowthSectionEntry() {
        const section = document.getElementById("growth");
        const clip = document.getElementById("growth-bg-clip");
        const runSeq = section?.__growthRunSeq;
        if (!section || !clip || typeof runSeq !== "function") return;

        const reduceMotion =
          window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const MASK_FALLBACK_MS = 1400;

        let entryStarted = false;
        let maskDone = false;

        const finishMask = () => {
          if (maskDone) return;
          maskDone = true;
          clip.removeEventListener("transitionend", onClipDone);
          section.classList.add("is-growth-content-ready");
          runSeq();
        };

        const onClipDone = (ev) => {
          if (ev.target !== clip || ev.propertyName !== "clip-path") return;
          finishMask();
        };

        const startEntry = () => {
          if (entryStarted) return;
          entryStarted = true;

          if (reduceMotion) {
            section.classList.add("is-growth-bg-open", "is-growth-content-ready");
            runSeq();
            return;
          }

          clip.addEventListener("transitionend", onClipDone);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              section.classList.add("is-growth-bg-open");
              window.setTimeout(() => {
                if (!maskDone) finishMask();
              }, MASK_FALLBACK_MS);
            });
          });
        };

        section.__snapReveal = startEntry;
      })();

      /** Growth report: 카드 등장과 동일 지연(기본 1초 간격)으로 카운트업 */
      (function initGrowthReportCounters() {
        const section = document.getElementById("growth");
        if (!section) return;

        const reduceMotion =
          window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const nodes = [...section.querySelectorAll("[data-growth-count]")];
        if (!nodes.length) return;

        const staggerGrid = section.querySelector("[data-reveal-stagger]");
        const readNum = (name, fallback) => {
          if (!staggerGrid) return fallback;
          const raw = staggerGrid.getAttribute(name);
          if (raw === null || raw === "") return fallback;
          const n = Number(raw);
          return Number.isFinite(n) ? n : fallback;
        };
        const mqGrowthMobile = window.matchMedia(
          "(max-width: 719px), ((width: 768px) and (orientation: portrait)), ((width: 820px) and (orientation: portrait)), ((width: 1024px) and (orientation: portrait))"
        );

        const staggerBase = () => readNum("data-reveal-stagger-base", 0);
        const staggerStep = () => {
          if (mqGrowthMobile.matches && staggerGrid) {
            const m = staggerGrid.getAttribute("data-reveal-stagger-step-m");
            if (m !== null && m !== "") {
              const n = Number(m);
              if (Number.isFinite(n)) return n;
            }
          }
          return readNum("data-reveal-stagger-step", 650);
        };

        const fmt = (n, type) => {
          if (type === "revenue") return `${n.toLocaleString("ko-KR")}억+`;
          if (type === "clients") return `${n.toLocaleString("ko-KR")}+`;
          if (type === "professionals") return n.toLocaleString("en-US");
          if (type === "experience") return `${n}년+`;
          if (type === "won") return `${n.toLocaleString("ko-KR")}억`;
          if (type === "company") return `${n.toLocaleString("ko-KR")}`;
          if (type === "percent") return `${n.toLocaleString("ko-KR")}%`;
          if (type === "years") return `${n.toLocaleString("ko-KR")}년`;
          return n.toLocaleString("ko-KR");
        };

        const animateOne = (el) => {
          const target = Number(el.getAttribute("data-growth-count") || "0");
          const type = el.getAttribute("data-growth-format") || "";
          if (!Number.isFinite(target) || target <= 0) return;
          if (reduceMotion) {
            el.textContent = fmt(target, type);
            return;
          }

          const t0 = performance.now();
          const dur = 880;
          const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

          const tick = (now) => {
            const p = Math.min(1, (now - t0) / dur);
            const v = Math.round(target * easeOutCubic(p));
            el.textContent = fmt(v, type);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        };

        const runStaggered = () => {
          const base = staggerBase();
          const step = staggerStep();
          nodes.forEach((el, idx) => {
            if (reduceMotion) {
              animateOne(el);
              return;
            }
            window.setTimeout(() => animateOne(el), base + idx * step);
          });
        };

        const observeTarget = staggerGrid || section;

        if (!("IntersectionObserver" in window) || reduceMotion) {
          runStaggered();
          return;
        }

        if (section.matches("[data-reveal-seq]") && staggerGrid) {
          const onStagger = (ev) => {
            if (!ev.detail || ev.detail.container !== staggerGrid) return;
            runStaggered();
            section.removeEventListener("reveal-seq-stagger", onStagger);
          };
          section.addEventListener("reveal-seq-stagger", onStagger);
          return;
        }

        const io = new IntersectionObserver(
          (entries) => {
            if (!entries.some((e) => e.isIntersecting && e.intersectionRatio > 0.12)) return;
            runStaggered();
            io.disconnect();
          },
          { threshold: [0, 0.12, 0.18], rootMargin: "0px 0px -18% 0px" }
        );
        io.observe(observeTarget);
      })();

      /** 미디어룸: 무한 마퀴 롤링 — 시안2 방식 · 6카드 · 드래그/화살표 */
      (function initMediaCarousel() {
        const MEDIA_CARDS = [
          {
            image: "./assets/미디어룸1.png",
            title: "웅진, '2026 월드IT쇼' 참가… AI 에이전트 중심 업무 통합 솔루션 4종 선보여",
            desc: "차세대 업무 통합 운영 솔루션과 AI 에이전트 기반 서비스를 선보이며 디지털 전환 역량을 공유합니다.",
          },
          {
            image: "./assets/미디어룸2.png",
            title: "웅진그룹, CES 2026 참가… 교육·IT 아우르는 기술 경쟁력 뽐낸다",
            desc: "글로벌 무대에서 교육·IT·모빌리티 등 그룹의 통합 기술 경쟁력을 소개합니다.",
          },
          {
            image: "./assets/card_aws.jfif",
            title: "웅진IT, 2025 하반기 AWS 파트너리그 수상",
            desc: "AWS KPPL SAP 부문 2회 연속 수상, 클라우드·SAP 파트너십 역량을 다시 한번 입증했습니다.",
          },
          {
            image: "./assets/BLOG_IMG.png",
            title: '웅진 AICC "WAI-X" 변화에 대응하는 AI Ready Core전략',
            desc: '전자신문 | [인사이트]양은정 웅진 전무…"렌털ERP, 글로벌 SaaS 플랫폼으로"',
          },
          {
            image: "./assets/미디어룸3.jpg",
            title: "웅진, AWS와 사내 해커톤 진행…전사 AI 활용 역량 키운다",
            desc: "전사 AI 활용 역량 강화를 위한 사내 해커톤을 AWS와 함께 진행하며 혁신 문화를 확산합니다.",
          },
          {
            image: "./assets/미디어룸6.jpg",
            title: "웅진 IT, AI·클라우드 인사이트 데이 개최",
            desc: "AI·클라우드 최신 트렌드와 고객 인사이트를 공유하는 IT 인사이트 데이를 성황리에 개최했습니다.",
          },
        ];

        const carousel = document.getElementById("media-carousel");
        const track = document.getElementById("media-carousel-track");
        const viewport = document.getElementById("media-carousel-viewport");
        const prevBtn = document.getElementById("media-carousel-prev");
        const nextBtn = document.getElementById("media-carousel-next");
        if (!carousel || !track || !viewport) return;

        const reduceMotion =
          window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const mqMobileCarousel =
          window.matchMedia && window.matchMedia("(max-width: 1180px)");
        const readVisible = () => {
          const raw = parseInt(
            getComputedStyle(carousel).getPropertyValue("--media-carousel-visible"),
            10
          );
          return Number.isFinite(raw) && raw > 0 ? raw : 4;
        };
        let VISIBLE = readVisible();
        const MAX_INDEX = MEDIA_CARDS.length;
        const MARQUEE_LOOP_SEC = 96;
        const NUDGE_DUR = 650;
        const DRAG_THRESHOLD = 48;

        const cardHTML = (item) => `
          <a
            class="media-room-card group relative flex flex-col overflow-hidden rounded-3xl focus-ring outline-none"
            href="#"
            data-empty-link
            aria-disabled="true"
            tabindex="-1"
          >
            <div class="media-thumb-wrap">
              <img src="${item.image}" alt="" loading="lazy" decoding="async" />
            </div>
            <div class="flex flex-1 flex-col px-6 py-[2.75rem] sm:px-7 sm:py-[3rem] 3xl:px-8 3xl:py-[3.25rem]">
              <div class="media-card-title media-card-title--room text-base font-semibold leading-[1.2] text-[#111A33] sm:text-[1.2rem] xl:text-2xl 3xl:text-[1.8rem] 4xl:text-[2rem]">
                ${item.title}
              </div>
              <p class="media-card-desc mt-3 text-[13px] 3xl:text-sm text-[#111A33]/55">${item.desc}</p>
            </div>
          </a>
        `;

        const loopSet = [...MEDIA_CARDS, ...MEDIA_CARDS, ...MEDIA_CARDS];
        track.innerHTML = loopSet.map((item) => cardHTML(item)).join("");
        track.classList.add("is-marquee-running");

        let translateX = 0;
        let rollStarted = false;
        let isHovered = false;
        let dragging = false;
        let isNudging = false;
        let dragStartX = 0;
        let dragStartY = 0;
        let dragLastX = 0;
        let dragAxis = null;
        let rafId = null;
        let lastTs = 0;
        let nudgeRaf = null;

        const getGap = () => {
          const gap = parseFloat(getComputedStyle(carousel).getPropertyValue("--media-carousel-gap"));
          return Number.isFinite(gap) ? gap : 16;
        };

        const syncCardWidth = () => {
          const gap = getGap();
          const inner = viewport.clientWidth;
          let cardW;
          if (mqMobileCarousel && mqMobileCarousel.matches) {
            const peek = parseFloat(
              getComputedStyle(carousel).getPropertyValue("--media-card-peek-ratio")
            );
            const ratio = Number.isFinite(peek) && peek > 0 ? peek : 0.68;
            cardW = inner * ratio;
          } else {
            cardW = Math.max(0, (inner - gap * (VISIBLE - 1)) / VISIBLE);
          }
          carousel.style.setProperty("--media-card-w", `${cardW}px`);
          return cardW;
        };

        const getStepPx = () => {
          const cards = track.querySelectorAll(".media-room-card");
          if (!cards.length) return 0;
          return cards[0].offsetWidth + getGap();
        };

        const getLoopWidthPx = () => {
          const cards = track.querySelectorAll(".media-room-card");
          if (cards.length < MAX_INDEX) return 0;
          const first = cards[0];
          const last = cards[MAX_INDEX - 1];
          return last.offsetLeft + last.offsetWidth - first.offsetLeft;
        };

        const applyTransform = () => {
          track.style.transform = `translate3d(${translateX}px, 0, 0)`;
        };

        const normalizeTrackX = () => {
          const loopW = getLoopWidthPx();
          if (!loopW) return;
          while (translateX > 0) translateX -= loopW;
          while (translateX <= -loopW) translateX += loopW;
        };

        /** 긴 드래그 시에만 루프 재정렬 — 0 경계에서 점프하지 않도록 여유 구간 사용 */
        const recenterDragXIfNeeded = () => {
          const loopW = getLoopWidthPx();
          if (!loopW) return;
          if (translateX > loopW * 0.5) {
            translateX -= loopW;
          } else if (translateX < -loopW * 1.5) {
            translateX += loopW;
          }
        };

        const shouldMarquee = () =>
          rollStarted && !reduceMotion && !dragging && !isHovered && !isNudging;

        const tick = (ts) => {
          if (!lastTs) lastTs = ts;
          const dt = Math.min(ts - lastTs, 48);
          lastTs = ts;

          if (shouldMarquee()) {
            const loopW = getLoopWidthPx();
            if (loopW) {
              const speed = loopW / (MARQUEE_LOOP_SEC * 1000);
              translateX -= speed * dt;
              normalizeTrackX();
            }
          }

          applyTransform();
          rafId = requestAnimationFrame(tick);
        };

        const stopNudge = () => {
          if (nudgeRaf) cancelAnimationFrame(nudgeRaf);
          nudgeRaf = null;
          isNudging = false;
        };

        const nudgeSlide = (direction) => {
          const step = getStepPx();
          if (!step) return;
          stopNudge();
          isNudging = true;
          const from = translateX;
          const to = from + (direction < 0 ? -step : step);
          const start = performance.now();

          const runNudge = (now) => {
            const t = Math.min(1, (now - start) / NUDGE_DUR);
            const eased = 1 - Math.pow(1 - t, 2);
            translateX = from + (to - from) * eased;
            applyTransform();
            if (t < 1) {
              nudgeRaf = requestAnimationFrame(runNudge);
              return;
            }
            normalizeTrackX();
            applyTransform();
            stopNudge();
          };
          nudgeRaf = requestAnimationFrame(runNudge);
        };

        const startRoll = () => {
          if (rollStarted) return;
          rollStarted = true;
          syncCardWidth();
          const loopW = getLoopWidthPx();
          translateX = loopW ? -loopW : 0;
          applyTransform();
          if (!rafId) rafId = requestAnimationFrame(tick);
        };

        prevBtn?.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          nudgeSlide(1);
        });

        nextBtn?.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          nudgeSlide(-1);
        });

        viewport.addEventListener("mouseenter", () => {
          isHovered = true;
        });

        viewport.addEventListener("mouseleave", () => {
          isHovered = false;
        });

        viewport.addEventListener(
          "pointerdown",
          (e) => {
            if (e.button !== 0 || e.target.closest(".media-carousel__nav")) return;
            dragging = true;
            dragAxis = null;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            dragLastX = e.clientX;
            viewport.classList.add("is-dragging");
            viewport.setPointerCapture(e.pointerId);
            stopNudge();
          },
          true
        );

        viewport.addEventListener(
          "pointermove",
          (e) => {
            if (!dragging) return;
            const dx = e.clientX - dragStartX;
            const dy = e.clientY - dragStartY;
            if (dragAxis === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
              dragAxis = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
            }
            if (dragAxis !== "x") return;

            e.preventDefault();
            const delta = e.clientX - dragLastX;
            dragLastX = e.clientX;
            /* 손가락/포인터 이동 방향 = 카드 흐름 방향 (우→우, 좌→좌) */
            translateX += delta;
            recenterDragXIfNeeded();
            applyTransform();
          },
          { passive: false }
        );

        const endDrag = (e) => {
          if (!dragging) return;
          const wasHorizontal = dragAxis === "x";
          const dx = e.clientX - dragStartX;
          dragging = false;
          dragAxis = null;
          viewport.classList.remove("is-dragging");
          try {
            viewport.releasePointerCapture(e.pointerId);
          } catch (_) {}

          if (!wasHorizontal) return;

          normalizeTrackX();
          if (Math.abs(dx) >= DRAG_THRESHOLD) {
            /* flick 방향: 좌→좌(다음), 우→우(이전) */
            nudgeSlide(dx < 0 ? -1 : 1);
            return;
          }
          applyTransform();
        };

        viewport.addEventListener("pointerup", endDrag);
        viewport.addEventListener("pointercancel", endDrag);

        const onResize = () => {
          VISIBLE = readVisible();
          syncCardWidth();
          normalizeTrackX();
          applyTransform();
        };
        window.addEventListener("resize", onResize);
        if (mqMobileCarousel) {
          if (mqMobileCarousel.addEventListener) {
            mqMobileCarousel.addEventListener("change", onResize);
          } else if (mqMobileCarousel.addListener) {
            mqMobileCarousel.addListener(onResize);
          }
        }

        syncCardWidth();
        startRoll();
      })();

      /** 고객성공사례: 마스크 배너 · 순차 텍스트 · 리스트 롤링 (시안2 인터랙션) */
      (function initCasesBanner() {
        const CASE_SETS = [
          {
            featured: {
              image: "./assets/Reference_001.png",
              cat: "WDMS",
              client: "BMW Korea",
              project: "BMW Korea DMS NEXT(MyDMS) System 구축 프로젝트",
            },
            list: [
              { cat: "SAP S/4HANA", desc: "NPL 및 기업구조조정 투자 전문 / W사 전산시스템 구축" },
              { cat: "ERP", desc: "식자재 유통 및 푸드서비스 / C사 시스템 통합 프로젝트" },
              { cat: "SAP All-in-One", desc: "난방·온수기기제조 K사 EHP / 업그레이드 프로젝트" },
              { cat: "Data Analytics", desc: "자동차 유통 / 실시간 영업·서비스 데이터 통합 분석" },
            ],
          },
          {
            featured: {
              image: "./assets/Reference_002.png",
              cat: "SAP EWM",
              client: "에이프로젠바이오로직스",
              project: "물류관리시스템 EWM 구축 프로젝트",
            },
            list: [
              { cat: "Smart Factory", desc: "바이오 제약 제조 / GMP 기반 MES·ERP 통합 구축" },
              { cat: "SAP EWM", desc: "글로벌 물류 허브 / WMS·EWM 고도화 프로젝트" },
              { cat: "Cloud Platform", desc: "멀티 클라우드 전환 / Azure·AWS 하이브리드 아키텍처" },
              { cat: "MES Integration", desc: "바이오 제조 / 생산·품질·물류 통합 모니터링" },
            ],
          },
          {
            featured: {
              image: "./assets/success-story-03-erp.jpg",
              cat: "SAP S/4HANA",
              client: "국내 대형 제조기업",
              project: "글로벌 ERP 통합 및 스마트팩토리 기반 디지털 전환",
            },
            list: [
              { cat: "AICC", desc: "렌탈·모빌리티 / AI 고객상담 플랫폼 구축" },
              { cat: "Microsoft Dynamics 365", desc: "유통·리테일 / CRM·ERP 통합 운영 프로젝트" },
              { cat: "MANAGED SERVICE", desc: "엔터프라이즈 IT / 24×7 ITO·운영 고도화" },
              { cat: "Digital Twin", desc: "스마트팩토리 / 설비·공정 디지털 트윈 플랫폼" },
            ],
          },
        ];

        const slidesRoot = document.getElementById("cases-banner-slides");
        const banner = document.getElementById("cases-banner");
        const listRoot = document.getElementById("cases-list");
        const listPanel = document.getElementById("cases-list-panel");
        const dotsNav = document.getElementById("cases-dots-nav");
        const section = document.getElementById("cases");
        const casesContent = section?.querySelector(".cases-content");
        if (!slidesRoot || !listRoot || !listPanel || !section) return;

        const reduceMotion =
          window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const mqCasesMobile = window.matchMedia(
          "(max-width: 719px), ((width: 768px) and (orientation: portrait)), ((width: 820px) and (orientation: portrait)), ((width: 1024px) and (orientation: portrait))"
        );
        const mqCasesDesktop = window.matchMedia("(min-width: 1181px)");
        const mqCasesHiRes = window.matchMedia("(min-width: 2560px)");
        const isCasesMobile = () => mqCasesMobile.matches;
        const getListVisibleCount = () => (mqCasesHiRes.matches ? 4 : 3);
        const total = CASE_SETS.length;
        const EXPAND_DUR_MS = 970;
        const CLIP_START_SIZE = 0;
        const LIST_TOP_DELAY_MS = 620;
        const TITLE_SEQ_MS = 850;
        const LIST_AFTER_BANNER_MS = 230;

        const MO_DRAG_THRESHOLD = 48;
        const MO_SWIPE_DUR_MS = 400;

        let current = 0;
        let animating = false;
        let entered = false;
        let autoTimer = null;
        let topReadyTimer = null;
        let titleTimers = [];
        let bannerTimers = [];
        let moDragging = false;
        let moDragStartX = 0;
        let moDragStartY = 0;
        let moDragAxis = null;

        const roundStartPx = () => Math.max(window.innerWidth * 0.03, 14);

        const getClipCornerRound = (round) => {
          if (document.documentElement.classList.contains("card-sharp")) return 0;
          return Math.min(round, 6);
        };

        const clipStart = (round, clipEl) => {
          const box = clipEl || document.getElementById("cases-banner");
          const w = box?.offsetWidth || 800;
          const h = box?.offsetHeight || 520;
          const right = Math.max(0, w - CLIP_START_SIZE);
          const bottom = Math.max(0, h - CLIP_START_SIZE);
          const cornerRound = getClipCornerRound(round);
          return `inset(0px ${right}px ${bottom}px 0px round ${cornerRound}px)`;
        };

        const clearTitleTimers = () => {
          titleTimers.forEach((id) => window.clearTimeout(id));
          titleTimers = [];
        };

        const clearBannerTimers = () => {
          bannerTimers.forEach((id) => window.clearTimeout(id));
          bannerTimers = [];
        };

        const getSnapPad = () =>
          parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue("--nav-height")
          ) || 90;

        /** 스크롤 앵커가 #cases 구간 안인지 (데스크탑 스냅 진입 판별) */
        const isCasesActiveSnap = () => {
          const pad = getSnapPad();
          const anchor = window.scrollY + pad + 1;
          const top = section.getBoundingClientRect().top + window.scrollY;
          const bottom = top + section.offsetHeight;
          return anchor >= top && anchor < bottom;
        };

        /** 스크롤 앵커가 #cases에 있고, 헤더 스냅 라인에 정렬된 뒤에만 인트로 */
        const isCasesSectionVisible = () => {
          if (!isCasesActiveSnap()) return false;

          const pad = getSnapPad();
          const rect = section.getBoundingClientRect();
          const vh = window.innerHeight || document.documentElement.clientHeight;
          const snapTop = pad + (isCasesMobile() ? 2 : 0);

          if (Math.abs(rect.top - snapTop) > 52) return false;
          if (rect.bottom < vh * 0.55) return false;
          return true;
        };

        const clearTopReadyTimer = () => {
          if (topReadyTimer) {
            window.clearTimeout(topReadyTimer);
            topReadyTimer = null;
          }
        };

        const buildSlides = () => {
          slidesRoot.innerHTML = CASE_SETS.map(
            (set, i) => `
          <article class="cases-banner__slide${i === 0 ? " is-active" : ""}" data-index="${i}" aria-hidden="${i !== 0}">
            <div class="cases-banner__clip">
              <div class="cases-banner__inner">
                <img class="cases-banner__img" src="${set.featured.image}" alt="${set.featured.client} 성공사례" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='./assets/미디어룸1.png';" />
                <div class="cases-banner__shade" aria-hidden="true"></div>
              </div>
            </div>
            <div class="cases-banner__text">
              <span class="cases-banner__cat">${set.featured.cat}</span>
              <strong class="cases-banner__client">${set.featured.client}</strong>
              <span class="cases-banner__project">${set.featured.project}</span>
            </div>
          </article>
        `
          ).join("");
        };

        let syncBannerRaf = 0;
        const syncCasesBannerHeight = () => {
          if (!banner) return;
          if (!mqCasesDesktop.matches) {
            banner.style.height = "";
            return;
          }
          const listHeight = listRoot.offsetHeight;
          if (listHeight > 0) {
            banner.style.height = `${listHeight}px`;
          }
        };
        const scheduleSyncCasesBannerHeight = () => {
          if (syncBannerRaf) return;
          syncBannerRaf = requestAnimationFrame(() => {
            syncBannerRaf = 0;
            syncCasesBannerHeight();
          });
        };

        const renderList = (index) => {
          const items = CASE_SETS[index].list.slice(0, getListVisibleCount());
          listRoot.innerHTML = items
            .map(
              (item) => `
          <li class="cases-list__item">
            <div class="cases-list__body">
              <strong class="cases-list__cat">${item.cat}</strong>
              <p class="cases-list__desc">${item.desc}</p>
            </div>
            <span class="cases-list__arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
            </span>
          </li>
        `
            )
            .join("");
          scheduleSyncCasesBannerHeight();
        };

        let lineNavTrack = null;
        let lineNavDragging = false;
        let lineNavLastIndex = 0;

        const getLineNavIndexFromX = (clientX) => {
          const bar = dotsNav?.querySelector(".cases-line-nav__bar");
          if (!bar) return current;
          const rect = bar.getBoundingClientRect();
          if (!rect.width) return current;
          const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
          const segWidth = rect.width / total;
          return Math.max(0, Math.min(total - 1, Math.floor(x / segWidth)));
        };

        const goToFromLineNav = (index) => {
          const nextIndex = wrapIndex(index);
          updateLineNav(nextIndex);
          lineNavLastIndex = nextIndex;
          goTo(nextIndex, { userAction: true, fromNav: true });
        };

        const bindLineNavEvents = () => {
          if (!lineNavTrack) return;

          dotsNav.querySelectorAll(".cases-line-nav__seg").forEach((seg) => {
            seg.addEventListener("click", (e) => {
              e.stopPropagation();
              if (!entered) return;
              const index = Number(seg.dataset.index);
              if (!Number.isNaN(index)) goToFromLineNav(index);
            });
          });

          lineNavTrack.addEventListener("pointerdown", (e) => {
            if (!entered || e.button !== 0) return;
            lineNavDragging = true;
            lineNavTrack.classList.add("is-dragging");
            lineNavTrack.setPointerCapture(e.pointerId);
            stopAuto();
            goToFromLineNav(getLineNavIndexFromX(e.clientX));
            e.preventDefault();
          });

          lineNavTrack.addEventListener("pointermove", (e) => {
            if (!lineNavDragging) return;
            const index = getLineNavIndexFromX(e.clientX);
            if (index !== lineNavLastIndex) goToFromLineNav(index);
          });

          const endLineNavDrag = (e) => {
            if (!lineNavDragging) return;
            lineNavDragging = false;
            lineNavTrack.classList.remove("is-dragging");
            try {
              lineNavTrack.releasePointerCapture(e.pointerId);
            } catch (_) {}
            goToFromLineNav(getLineNavIndexFromX(e.clientX));
            startAuto();
          };

          lineNavTrack.addEventListener("pointerup", endLineNavDrag);
          lineNavTrack.addEventListener("pointercancel", endLineNavDrag);

          lineNavTrack.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight") goToFromLineNav(current + 1);
            if (e.key === "ArrowLeft") goToFromLineNav(current - 1);
          });
        };

        const buildLineNav = () => {
          if (!dotsNav) return;
          dotsNav.hidden = false;
          dotsNav.innerHTML = `
            <div class="cases-line-nav__track focus-ring" role="slider" tabindex="0"
              aria-valuemin="1" aria-valuemax="${total}" aria-valuenow="1" aria-label="성공사례 선택">
              <div class="cases-line-nav__bar" aria-hidden="true">
                ${CASE_SETS.map(
                  (_, i) =>
                    `<span class="cases-line-nav__seg${i === 0 ? " is-active" : ""}" data-index="${i}"></span>`
                ).join("")}
              </div>
            </div>`;
          lineNavTrack = dotsNav.querySelector(".cases-line-nav__track");
          lineNavLastIndex = 0;
          bindLineNavEvents();
        };

        const updateLineNav = (index) => {
          if (!dotsNav) return;
          dotsNav.querySelectorAll(".cases-line-nav__seg").forEach((seg, i) => {
            seg.classList.toggle("is-active", i === index);
          });
          if (lineNavTrack) {
            lineNavTrack.setAttribute("aria-valuenow", String(index + 1));
          }
        };

        const getActiveSlide = () => slidesRoot.querySelector(".cases-banner__slide.is-active");

        const syncMobileSlideWidths = () => {
          if (!isCasesMobile() || !banner) return;
          const w = banner.offsetWidth;
          if (!w) return;
          slidesRoot.querySelectorAll(".cases-banner__slide").forEach((slide) => {
            slide.style.flexBasis = `${w}px`;
            slide.style.width = `${w}px`;
          });
        };

        const setMobileSlideTransform = (offsetPx = 0, animate = false) => {
          if (!isCasesMobile() || !banner) return;
          const w = banner.offsetWidth;
          if (!w) return;
          slidesRoot.style.transition = animate
            ? `transform ${MO_SWIPE_DUR_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
            : "none";
          slidesRoot.style.transform = `translate3d(${-current * w + offsetPx}px, 0, 0)`;
        };

        const resetMobileSlideTrack = () => {
          slidesRoot.style.transform = "";
          slidesRoot.style.transition = "";
          slidesRoot.classList.remove("is-dragging");
          slidesRoot.querySelectorAll(".cases-banner__slide").forEach((slide) => {
            slide.style.flexBasis = "";
            slide.style.width = "";
          });
        };

        const setMobileActiveSlide = (index) => {
          slidesRoot.querySelectorAll(".cases-banner__slide").forEach((slide, i) => {
            const active = i === index;
            slide.classList.toggle("is-active", active);
            slide.setAttribute("aria-hidden", active ? "false" : "true");
            if (active) {
              slide.classList.add("is-ready", "is-text-ready");
            }
          });
        };

        const collapseClip = (clip, inner) => {
          if (!clip || !inner) return;
          clip.style.transition = "none";
          inner.style.transition = "none";
          clip.classList.remove("is-clip-expanded");
          inner.classList.remove("is-clip-expanded");
          clip.style.clipPath = clipStart(roundStartPx(), clip);
          inner.style.transform = "scale(1.12)";
          inner.style.transformOrigin = "top left";
          void clip.offsetWidth;
          clip.style.transition = "";
          inner.style.transition = "";
          clip.style.clipPath = "";
          inner.style.transform = "";
        };

        const expandClip = (clip, inner) => {
          if (!clip || !inner) return;
          collapseClip(clip, inner);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              clip.classList.add("is-clip-expanded");
              inner.classList.add("is-clip-expanded");
            });
          });
        };

        const resetSlideState = (slide) => {
          if (!slide) return;
          clearBannerTimers();
          slide.classList.remove("is-ready", "is-text-ready");
          const clip = slide.querySelector(".cases-banner__clip");
          const inner = slide.querySelector(".cases-banner__inner");
          if (clip && inner && !reduceMotion) {
            collapseClip(clip, inner);
          }
          clearTopReadyTimer();
          listPanel.classList.remove("is-visible", "is-top-ready");
        };

        const showListPanel = () => {
          listPanel.classList.add("is-visible");
          scheduleSyncCasesBannerHeight();
          clearTopReadyTimer();
          topReadyTimer = window.setTimeout(() => {
            listPanel.classList.add("is-top-ready");
            topReadyTimer = null;
            scheduleSyncCasesBannerHeight();
          }, LIST_TOP_DELAY_MS);
        };

        const playTitleSequence = (onComplete) => {
          section.classList.remove("cases-await-scroll");
          if (reduceMotion) {
            section.classList.add("is-cases-ready", "is-cases-content-ready", "is-cases-animating");
            onComplete?.();
            return;
          }
          clearTitleTimers();
          section.classList.add("is-cases-ready", "is-cases-animating");
          titleTimers.push(
            window.setTimeout(() => {
              section.classList.add("is-cases-content-ready");
              onComplete?.();
            }, TITLE_SEQ_MS)
          );
        };

        const playBannerSequence = (slide, onComplete) => {
          if (!slide) return;
          clearBannerTimers();
          resetSlideState(slide);
          const clip = slide.querySelector(".cases-banner__clip");
          const inner = slide.querySelector(".cases-banner__inner");

          if (reduceMotion) {
            clip?.classList.add("is-clip-expanded");
            inner?.classList.add("is-clip-expanded");
            slide.classList.add("is-ready", "is-text-ready");
            section.classList.add("mo-banner-ready");
            listPanel.classList.add("is-visible", "is-top-ready");
            onComplete?.();
            return;
          }

          if (isCasesMobile()) {
            section.classList.add("mo-banner-ready");
            slide.classList.add("is-ready", "is-text-ready");
            syncMobileSlideWidths();
            setMobileSlideTransform(0, false);
            bannerTimers.push(
              window.setTimeout(() => {
                listPanel.classList.add("is-top-ready");
                bannerTimers.push(
                  window.setTimeout(() => {
                    listPanel.classList.add("is-visible");
                    section.classList.remove("is-cases-animating");
                    onComplete?.();
                  }, 130)
                );
              }, 420)
            );
            return;
          }

          if (clip && inner) {
            expandClip(clip, inner);
          }

          bannerTimers.push(
            window.setTimeout(() => slide.classList.add("is-text-ready"), EXPAND_DUR_MS * 0.78)
          );
          bannerTimers.push(
            window.setTimeout(() => slide.classList.add("is-ready"), EXPAND_DUR_MS)
          );
          bannerTimers.push(
            window.setTimeout(() => showListPanel(), EXPAND_DUR_MS + LIST_AFTER_BANNER_MS)
          );
          bannerTimers.push(
            window.setTimeout(() => {
              section.classList.remove("is-cases-animating");
              onComplete?.();
            }, EXPAND_DUR_MS + LIST_AFTER_BANNER_MS + LIST_TOP_DELAY_MS + 450)
          );
        };

        const playIntroSequence = (onComplete) => {
          playTitleSequence(() => {
            playBannerSequence(getActiveSlide(), onComplete);
          });
        };

        const wrapIndex = (index) => ((index % total) + total) % total;

        const abortCasesTransition = () => {
          clearBannerTimers();
          clearTopReadyTimer();
          slidesRoot.querySelectorAll(".cases-banner__slide").forEach((slide) => {
            resetSlideState(slide);
            slide.classList.remove("is-active", "is-ready", "is-text-ready");
            slide.setAttribute("aria-hidden", "true");
          });
          section.classList.remove("is-cases-animating");
          animating = false;
        };

        const goTo = (index, { userAction = false, fromNav = false } = {}) => {
          index = wrapIndex(index);
          if (index === current) return;
          if (animating) {
            if (!fromNav) return;
            abortCasesTransition();
          }
          animating = true;
          if (userAction) stopAuto();

          if (isCasesMobile()) {
            current = index;
            setMobileActiveSlide(index);
            renderList(index);
            updateLineNav(index);
            listPanel.classList.add("is-visible", "is-top-ready");
            syncMobileSlideWidths();
            setMobileSlideTransform(0, !reduceMotion);
            const finish = () => {
              animating = false;
              if (userAction) startAuto();
            };
            if (reduceMotion) {
              finish();
            } else {
              window.setTimeout(finish, MO_SWIPE_DUR_MS);
            }
            return;
          }

          const prevSlide = getActiveSlide();
          const nextSlide = slidesRoot.querySelector(`.cases-banner__slide[data-index="${index}"]`);

          resetSlideState(prevSlide);
          prevSlide?.classList.remove("is-active");
          prevSlide?.setAttribute("aria-hidden", "true");
          nextSlide?.classList.add("is-active");
          nextSlide?.setAttribute("aria-hidden", "false");

          current = index;
          renderList(index);
          updateLineNav(index);

          if (fromNav && !reduceMotion) {
            const clip = nextSlide?.querySelector(".cases-banner__clip");
            const inner = nextSlide?.querySelector(".cases-banner__inner");
            if (clip && inner) {
              clip.classList.add("is-clip-expanded");
              inner.classList.add("is-clip-expanded");
            }
            nextSlide?.classList.add("is-ready", "is-text-ready");
            listPanel.classList.add("is-visible", "is-top-ready");
            animating = false;
            if (userAction && !lineNavDragging) startAuto();
            return;
          }

          playBannerSequence(nextSlide, () => {
            animating = false;
            if (userAction) startAuto();
          });
        };

        const stopAuto = () => {
          if (autoTimer) window.clearInterval(autoTimer);
          autoTimer = null;
        };

        const startAuto = () => {
          stopAuto();
          if (reduceMotion || total <= 1) return;
          autoTimer = window.setInterval(() => {
            if (animating) return;
            goTo(current + 1);
          }, 6000);
        };

        const triggerIntro = () => {
          if (entered) return;
          if (!reduceMotion && !window.__isPreviewIframe && !isCasesSectionVisible()) return;
          entered = true;
          if (reduceMotion) {
            section.classList.remove("cases-await-scroll");
            section.classList.add("is-cases-ready", "is-cases-content-ready", "mo-banner-ready");
            getActiveSlide()?.classList.add("is-ready", "is-text-ready");
            listPanel.classList.add("is-visible", "is-top-ready");
            syncMobileSlideWidths();
            setMobileSlideTransform(0, false);
            startAuto();
            return;
          }
          playIntroSequence(startAuto);
        };

        const tryTriggerIntro = () => {
          if (entered) return;
          if (!isCasesSectionVisible()) return;
          triggerIntro();
        };

        buildSlides();
        buildLineNav();
        renderList(0);
        updateLineNav(0);
        scheduleSyncCasesBannerHeight();

        const firstSlide = getActiveSlide();
        if (firstSlide && !reduceMotion) {
          const clip = firstSlide.querySelector(".cases-banner__clip");
          const inner = firstSlide.querySelector(".cases-banner__inner");
          collapseClip(clip, inner);
        }

        if (casesContent) {
          const endMoDrag = (e) => {
            if (!moDragging) return;
            const wasHorizontal = moDragAxis === "x";
            const dx = e.clientX - moDragStartX;
            moDragging = false;
            moDragAxis = null;
            casesContent.classList.remove("is-dragging");
            slidesRoot.classList.remove("is-dragging");
            try {
              casesContent.releasePointerCapture(e.pointerId);
            } catch (_) {}

            if (!isCasesMobile() || !entered) {
              setMobileSlideTransform(0, true);
              return;
            }

            if (!wasHorizontal) {
              setMobileSlideTransform(0, true);
              startAuto();
              return;
            }

            if (Math.abs(dx) >= MO_DRAG_THRESHOLD) {
              goTo(dx < 0 ? current + 1 : current - 1, { userAction: true });
              return;
            }
            setMobileSlideTransform(0, true);
            startAuto();
          };

          casesContent.addEventListener(
            "pointerdown",
            (e) => {
              if (!isCasesMobile() || !entered || animating || e.button !== 0) return;
              moDragging = true;
              moDragAxis = null;
              moDragStartX = e.clientX;
              moDragStartY = e.clientY;
              casesContent.classList.add("is-dragging");
              slidesRoot.classList.add("is-dragging");
              casesContent.setPointerCapture(e.pointerId);
              stopAuto();
            },
            true
          );

          casesContent.addEventListener(
            "pointermove",
            (e) => {
              if (!moDragging || !isCasesMobile() || !entered) return;
              const dx = e.clientX - moDragStartX;
              const dy = e.clientY - moDragStartY;
              if (moDragAxis === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
                moDragAxis = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
              }
              if (moDragAxis !== "x") return;
              e.preventDefault();
              setMobileSlideTransform(dx, false);
            },
            { passive: false }
          );

          casesContent.addEventListener("pointerup", endMoDrag);
          casesContent.addEventListener("pointercancel", endMoDrag);
        }

        mqCasesHiRes.addEventListener("change", () => {
          renderList(current);
        });
        mqCasesMobile.addEventListener("change", () => {
          if (isCasesMobile()) {
            syncMobileSlideWidths();
            setMobileSlideTransform(0, false);
            return;
          }
          resetMobileSlideTrack();
        });
        mqCasesDesktop.addEventListener("change", scheduleSyncCasesBannerHeight);
        window.addEventListener(
          "resize",
          () => {
            scheduleSyncCasesBannerHeight();
            if (isCasesMobile()) {
              syncMobileSlideWidths();
              setMobileSlideTransform(0, false);
            }
          },
          { passive: true }
        );
        if (document.fonts?.ready) {
          document.fonts.ready.then(scheduleSyncCasesBannerHeight);
        }
        section.addEventListener("mouseenter", stopAuto);
        section.addEventListener("mouseleave", startAuto);

        /* passed-section 일괄 리빌(__syncSnapReveals)에서 제외 — 정착 후에만 인트로 */
        section.__snapReveal = null;

        window.addEventListener(
          "snap-scroll-settled",
          () => {
            requestAnimationFrame(tryTriggerIntro);
          },
          { passive: true }
        );

        let casesScrollRaf = 0;
        window.addEventListener(
          "scroll",
          () => {
            if (entered || casesScrollRaf) return;
            if (window.__snapAnimating?.()) return;
            casesScrollRaf = requestAnimationFrame(() => {
              casesScrollRaf = 0;
              tryTriggerIntro();
            });
          },
          { passive: true }
        );

        if (reduceMotion) {
          section.classList.remove("cases-await-scroll");
          triggerIntro();
        } else {
          window.addEventListener(
            "load",
            () => {
              requestAnimationFrame(tryTriggerIntro);
            },
            { once: true }
          );
        }
      })();

      /** Customer cases (legacy marquee — disabled, replaced by initCasesBanner) */
      (function initCaseMarqueeLegacyDisabled() {
        return;
        const track = document.getElementById("case-track");
        const casesSection = document.getElementById("cases");
        const rail = track && track.closest(".case-rail");
        const mqMobile = window.matchMedia("(max-width: 719px), ((width: 768px) and (orientation: portrait)), ((width: 820px) and (orientation: portrait)), ((width: 1024px) and (orientation: portrait))");
        if (!track || !casesSection) return;

        const reduceMotion =
          window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const INTRO_CARD_MS = 1350;
        const INTRO_STAGGER_MS = 110;
        const MARQUEE_LOOP_SEC = 58;
        const MARQUEE_RAMP_FRAMES = 90;

        const isMobileMode = () => mqMobile.matches;

        const tuneCasesRevealTiming = () => {
          if (isMobileMode()) {
            casesSection.setAttribute("data-reveal-seq-base", "80");
            casesSection.setAttribute("data-reveal-seq-step", "150");
            return;
          }
          casesSection.setAttribute("data-reveal-seq-base", "90");
          casesSection.setAttribute("data-reveal-seq-step", "175");
        };
        tuneCasesRevealTiming();
        mqMobile.addEventListener("change", tuneCasesRevealTiming);

        let casesExperienceStarted = false;
        const CASES_DESKTOP_POST_TEXT_MS = 220;

        const CASES = [
          {
            id: "rental-1",
            title: "에너지 서비스 차세대 운영 플랫폼 구축",
            solution: "SAP Suite on HANA · CCS",
            period: "2025.09 – 2025.12",
            img: "./assets/case-rental-1.jpg",
            alt: "Analytics dashboard and data visualization on screen",
          },
          {
            id: "mobility-1",
            title: "글로벌 렌탈 영업 · 서비스 표준화",
            solution: "WRMS",
            period: "2025.04 – 2025.07",
            img: "./assets/case-mobility-1.jpg",
            alt: "Seoul cityscape at night — enterprise IT and urban infrastructure metaphor",
          },
          {
            id: "manufacturing-1",
            title: "제조 현장 관측(Observability) 체계 구축",
            solution: "WPMS · WSCM",
            period: "2024.11 – 2025.03",
            img: "./assets/case-manufacturing-1.jpg",
            alt: "최신식 설비와 로봇 자동화가 갖춰진 스마트 팩토리 생산 라인",
          },
          {
            id: "bio-1",
            title: "글로벌 바이오 법인 ERP 운영 표준화",
            solution: "SAP Business One",
            period: "2024.06 – 2024.10",
            img: "./assets/case-bio-1.jpg",
            alt: "Business professionals collaborating in a modern meeting space",
          },
          {
            id: "cpg-1",
            title: "소비재 수요예측·재고 최적화(데이터/AI)",
            solution: "SAP Business One · CCS",
            period: "2024.01 – 2024.04",
            img: "./assets/case-cpg-1.jpg",
            alt: "Abstract global network and technology connectivity concept",
          },
          {
            id: "logistics-1",
            title: "물류 운영 대시보드 및 SLA 자동 리포팅",
            solution: "SAP Suite on HANA · WRMS",
            period: "2025.01 – 2025.03",
            img: "./assets/case-logistics-1.jpg",
            alt: "Team collaboration scene",
          },
          {
            id: "semiconductor-1",
            title: "반도체 제조 운영 데이터 표준화",
            solution: "SAP Business One · WPMS · WSCM",
            period: "2025.02 – 2025.06",
            img: "./assets/case-semiconductor-1.jpg",
            alt: "방진복을 착용한 엔지니어가 첨단 공정 설비를 점검하는 반도체 제조 현장",
          },
        ];

        const shuffle = (arr) => {
          const a = [...arr];
          for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
          }
          return a;
        };

        const cardHTML = (c, ariaHidden, introIndex = 0) => `
          <a
            href="#"
            data-empty-link
            class="case-marquee-card group flex w-[min(340px,85vw)] flex-col sm:w-[380px] xl:w-[430px] 3xl:w-[480px] 4xl:w-[520px] shrink-0 overflow-hidden rounded-3xl border border-black/[0.07] bg-white focus-ring outline-none"
            style="--case-intro-i: ${introIndex}"
            ${
              ariaHidden
                ? 'aria-hidden="true" tabindex="-1"'
                : 'aria-disabled="true"'
            }
            data-case-id="${c.id}"
          >
            <div class="relative h-56 shrink-0 overflow-hidden sm:h-[13.5rem] lg:h-[14rem] xl:h-[15rem] 2xl:h-[16rem] 3xl:h-[17.5rem] 4xl:h-72">
              <img class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]" src="${c.img}" alt="${
          ariaHidden ? "" : c.alt
        }" loading="lazy" />
            </div>
            <div class="case-card-body flex flex-1 flex-col justify-center p-5 sm:p-6 xl:p-7 3xl:p-8 4xl:p-9 min-h-0">
              <div class="text-base font-semibold tracking-tight xl:text-lg 3xl:text-xl">${c.title}</div>
              <div class="case-card-solution mt-2 text-sm text-black/60 xl:text-base 3xl:mt-3 4xl:mt-3.5">${c.solution ?? `기간: ${c.period}`}</div>
            </div>
          </a>
        `;

        const getTitleInset = () => {
          const titleIn = casesSection.querySelector(".hero-title-line__in");
          if (!titleIn || !rail) return null;
          const pad = Math.round(titleIn.getBoundingClientRect().left - rail.getBoundingClientRect().left);
          return Math.max(16, pad);
        };

        const getFirstCardSet = () =>
          [...track.querySelectorAll(".case-marquee-card")].filter(
            (el) => el.getAttribute("aria-hidden") !== "true"
          );

        let desktopMarqueeRaf = null;
        let desktopMarqueeOffset = 0;
        let desktopMarqueeRamp = 0;
        let desktopMarqueePaused = false;

        const teardownDesktopMarquee = () => {
          if (desktopMarqueeRaf) cancelAnimationFrame(desktopMarqueeRaf);
          desktopMarqueeRaf = null;
          desktopMarqueeOffset = 0;
          desktopMarqueeRamp = 0;
          track.style.transform = "";
        };

        const prepareLoopCards = () => {
          track.classList.add("case-track--hold");
          [...track.querySelectorAll(".case-marquee-card")].forEach((el) => {
            el.classList.add("is-intro-in");
          });
        };

        const startDesktopMarquee = () => {
          if (reduceMotion || isMobileMode()) return;
          teardownDesktopMarquee();
          desktopMarqueeOffset = 0;
          desktopMarqueeRamp = 0;
          track.style.transform = "translate3d(0, 0, 0)";

          const loopWidth = () => track.scrollWidth / 2;
          const maxSpeed = () => {
            const w = loopWidth();
            if (!w) return 0.5;
            return w / (MARQUEE_LOOP_SEC * 60);
          };

          const tick = () => {
            if (!isMobileMode() && !reduceMotion) {
              if (!desktopMarqueePaused) {
                const ramp = Math.min(desktopMarqueeRamp / MARQUEE_RAMP_FRAMES, 1);
                if (desktopMarqueeRamp < MARQUEE_RAMP_FRAMES) desktopMarqueeRamp += 1;
                const lw = loopWidth();
                if (lw > 0) {
                  desktopMarqueeOffset += maxSpeed() * ramp;
                  if (desktopMarqueeOffset >= lw) desktopMarqueeOffset -= lw;
                  track.style.transform = `translate3d(${-desktopMarqueeOffset}px, 0, 0)`;
                }
              }
              desktopMarqueeRaf = requestAnimationFrame(tick);
            }
          };

          desktopMarqueeRaf = requestAnimationFrame(tick);
        };

        const startMarqueeRolling = () => {
          if (rail) {
            rail.classList.remove("case-rail--intro-pending", "case-rail--intro-active");
            rail.classList.add("case-rail--rolling");
          }
          track.classList.remove("case-track--intro", "case-track--hold");
          track.classList.add("case-track--rolling");
          track.style.animation = "none";
          startDesktopMarquee();
        };

        const getIntroDuration = (count) =>
          INTRO_CARD_MS + Math.max(0, count - 1) * INTRO_STAGGER_MS;

        const runIntroSequence = () =>
          new Promise((resolve) => {
            const cards = getFirstCardSet();
            if (!cards.length) {
              resolve();
              return;
            }

            if (rail) {
              rail.classList.remove("case-rail--rolling");
              rail.classList.add("case-rail--intro-pending");
            }
            track.classList.remove("case-track--rolling");
            track.classList.add("case-track--intro");
            track.style.animation = "none";

            const inset = getTitleInset();
            if (inset != null) track.style.setProperty("--case-intro-pad", `${inset}px`);

            cards.forEach((el) => el.classList.remove("is-intro-in"));

            if (reduceMotion) {
              if (rail) rail.classList.add("case-rail--intro-active");
              cards.forEach((el) => el.classList.add("is-intro-in"));
              window.setTimeout(resolve, 120);
              return;
            }

            window.requestAnimationFrame(() => {
              window.requestAnimationFrame(() => {
                if (rail) rail.classList.add("case-rail--intro-active");
                cards.forEach((el) => el.classList.add("is-intro-in"));
                window.setTimeout(resolve, getIntroDuration(cards.length));
              });
            });
          });

        let mobileAutoRaf = null;
        let mobileUserPause = false;
        let mobileOffscreen = false;
        let mobileTouchBound = false;
        let desktopHoverBound = false;
        let desktopDragBound = false;
        let desktopDragging = false;
        let desktopDragPointerId = null;
        let desktopDragStartX = 0;
        let desktopDragStartOffset = 0;
        let desktopDragMoved = false;
        const DESKTOP_DRAG_CLICK_PX = 6;

        const teardownMobileAutoScroll = () => {
          if (mobileAutoRaf) cancelAnimationFrame(mobileAutoRaf);
          mobileAutoRaf = null;
        };

        const setupMobileAutoScroll = () => {
          teardownMobileAutoScroll();
          if (!rail || !isMobileMode() || reduceMotion) return;

          const speed = 0.7;

          const tick = () => {
            if (!isMobileMode() || reduceMotion || !rail) {
              teardownMobileAutoScroll();
              return;
            }
            if (!mobileUserPause && !mobileOffscreen) {
              const loopWidth = track.scrollWidth / 2;
              if (loopWidth > 0) {
                rail.scrollLeft += speed;
                if (rail.scrollLeft >= loopWidth - 1) rail.scrollLeft -= loopWidth;
              }
            }
            mobileAutoRaf = requestAnimationFrame(tick);
          };

          if (!mobileTouchBound) {
            mobileTouchBound = true;
            rail.addEventListener("touchstart", () => {
              mobileUserPause = true;
            }, { passive: true });
            rail.addEventListener("touchend", () => {
              mobileUserPause = false;
            }, { passive: true });
            rail.addEventListener("touchcancel", () => {
              mobileUserPause = false;
            }, { passive: true });
            document.addEventListener("visibilitychange", () => {
              if (document.hidden) mobileOffscreen = true;
              else if (casesSection.getBoundingClientRect().bottom > 0 && casesSection.getBoundingClientRect().top < window.innerHeight) {
                mobileOffscreen = false;
              }
            });
          }

          if ("IntersectionObserver" in window) {
            const autoIo = new IntersectionObserver(
              (entries) => {
                mobileOffscreen = !entries.some((e) => e.isIntersecting && e.intersectionRatio > 0.04);
              },
              { threshold: [0, 0.04, 0.1] }
            );
            autoIo.observe(casesSection);
          }

          mobileAutoRaf = requestAnimationFrame(tick);
        };

        const bindDesktopHoverPause = () => {
          if (!rail || desktopHoverBound) return;
          desktopHoverBound = true;
          rail.addEventListener("mouseenter", () => {
            if (!desktopDragging) desktopMarqueePaused = true;
          });
          rail.addEventListener("mouseleave", () => {
            if (!desktopDragging) desktopMarqueePaused = false;
          });
        };

        const bindDesktopPointerDrag = () => {
          if (!rail || desktopDragBound) return;
          desktopDragBound = true;

          const loopWidth = () => {
            const w = track.scrollWidth / 2;
            return w > 0 ? w : 0;
          };

          const applyDragOffset = (raw) => {
            const lw = loopWidth();
            if (!lw) return;
            desktopMarqueeOffset = ((raw % lw) + lw) % lw;
            track.style.transform = `translate3d(${-desktopMarqueeOffset}px, 0, 0)`;
          };

          const endDesktopDrag = (e) => {
            if (!desktopDragging) return;
            if (e && e.pointerId !== desktopDragPointerId) return;
            desktopDragging = false;
            desktopDragPointerId = null;
            rail.classList.remove("case-rail--dragging");
            if (!rail.matches(":hover")) desktopMarqueePaused = false;
            try {
              if (e) rail.releasePointerCapture(e.pointerId);
            } catch (_) {}
          };

          rail.addEventListener(
            "pointerdown",
            (e) => {
              if (isMobileMode() || reduceMotion) return;
              if (!track.classList.contains("case-track--rolling")) return;
              if (e.button !== 0) return;

              desktopDragging = true;
              desktopDragMoved = false;
              desktopDragPointerId = e.pointerId;
              desktopDragStartX = e.clientX;
              desktopDragStartOffset = desktopMarqueeOffset;
              desktopMarqueePaused = true;
              rail.classList.add("case-rail--dragging");
              try {
                rail.setPointerCapture(e.pointerId);
              } catch (_) {}
            },
            { passive: true }
          );

          rail.addEventListener(
            "pointermove",
            (e) => {
              if (!desktopDragging || e.pointerId !== desktopDragPointerId) return;
              const dx = e.clientX - desktopDragStartX;
              if (Math.abs(dx) > DESKTOP_DRAG_CLICK_PX) desktopDragMoved = true;
              applyDragOffset(desktopDragStartOffset - dx);
            },
            { passive: true }
          );

          rail.addEventListener("pointerup", endDesktopDrag);
          rail.addEventListener("pointercancel", endDesktopDrag);

          rail.addEventListener(
            "click",
            (e) => {
              if (!desktopDragMoved) return;
              e.preventDefault();
              e.stopPropagation();
              desktopDragMoved = false;
            },
            true
          );
        };

        const applyRailMode = () => {
          const mobile = isMobileMode();
          track.classList.toggle("case-track--touch", mobile);
          if (rail) {
            rail.classList.toggle("case-rail--touch", mobile);
            rail.classList.remove("case-rail--rolling", "case-rail--intro-pending", "case-rail--intro-active");
          }
          track.classList.remove("case-track--rolling", "case-track--intro", "case-track--hold");
          track.style.transform = "";
          track.style.animation = "";
          teardownDesktopMarquee();
          desktopDragging = false;
          desktopDragMoved = false;
          if (rail) rail.classList.remove("case-rail--dragging");
          if (!mobile) {
            teardownMobileAutoScroll();
            bindDesktopHoverPause();
            bindDesktopPointerDrag();
          } else {
            teardownMobileAutoScroll();
          }
        };

        let casesCarouselDone = false;

        const run = async () => {
          if (casesCarouselDone) return;
          casesCarouselDone = true;
          const list = shuffle(CASES);
          applyRailMode();
          track.innerHTML =
            list.map((c, i) => cardHTML(c, false, i)).join("") +
            list.map((c, i) => cardHTML(c, true, i)).join("");

          if (isMobileMode()) {
            await runIntroSequence();
            prepareLoopCards();
            if (rail) {
              rail.classList.remove("case-rail--intro-pending", "case-rail--intro-active");
              rail.scrollLeft = 0;
            }
            track.classList.remove("case-track--intro", "case-track--hold");
            [...track.querySelectorAll(".case-marquee-card")].forEach((el) => {
              el.classList.add("is-intro-in");
            });
            setupMobileAutoScroll();
            return;
          }

          teardownMobileAutoScroll();
          await runIntroSequence();
          prepareLoopCards();
          startMarqueeRolling();
        };

        const prevSnapReveal = casesSection.__snapReveal;
        casesSection.__snapReveal = () => {
          if (typeof prevSnapReveal === "function") prevSnapReveal();
          run();
        };

        mqMobile.addEventListener("change", () => {
          if (track.innerHTML.trim()) run();
        });

        if (reduceMotion || window.__isPreviewIframe || !("IntersectionObserver" in window)) {
          if (!window.__isPreviewIframe) run();
          return;
        }

        const io = new IntersectionObserver(
          (entries) => {
            if (!entries.some((e) => e.isIntersecting && e.intersectionRatio > 0.06)) return;
            run();
            io.disconnect();
          },
          { threshold: [0, 0.06, 0.12] }
        );
        io.observe(casesSection);
      })();

      /** 스크롤 위치 기준 — 스냅 라인을 지난 섹션은 순서대로 리빌 (preview iframe 전용 보정) */
      (function initSnapSectionRevealSync() {
        const isPreview = !!window.__isPreviewIframe;

        const getScrollPad = () => {
          const nh =
            parseFloat(
              getComputedStyle(document.documentElement).getPropertyValue("--nav-height")
            ) || 90;
          return nh;
        };

        /** 섹션 top이 스냅 라인(헤더 아래)에 닿았으면 진입으로 간주 */
        const syncPassedSections = () => {
          const line = getScrollPad() + 12;
          const snaps = [...document.querySelectorAll(".snap-section")];

          for (let i = 0; i < snaps.length; i++) {
            const sec = snaps[i];
            if (sec.getBoundingClientRect().top > line) break;

            sec.classList.add("is-section-active");
            if (typeof sec.__snapReveal === "function") sec.__snapReveal();
          }
        };

        window.__syncSnapReveals = syncPassedSections;

        window.addEventListener("snap-scroll-settled", () => {
          requestAnimationFrame(syncPassedSections);
        });

        let scrollRaf = 0;
        window.addEventListener(
          "scroll",
          () => {
            if (scrollRaf) return;
            scrollRaf = requestAnimationFrame(() => {
              scrollRaf = 0;
              syncPassedSections();
            });
          },
          { passive: true }
        );

        if (isPreview) {
          window.addEventListener("message", (e) => {
            if (!e.data || e.data.type !== "preview-viewport-resize") return;
            requestAnimationFrame(syncPassedSections);
          });
        }

        requestAnimationFrame(syncPassedSections);
      })();

      /** preview.html iframe — 현재 페이지 경로를 부모 URL(src)에 동기화 */
      (function initPreviewIframeSrcSync() {
        if (window.parent === window) return;

        const getPreviewSrcPath = () => {
          const pathname = decodeURIComponent(location.pathname || "");
          const match = pathname.match(/(시안\d\/[^/?#]+)/);
          if (match) return match[1] + (location.search || "") + (location.hash || "");
          const parts = pathname.split(/[/\\]/).filter(Boolean);
          if (parts.length >= 2) {
            return parts.slice(-2).join("/") + (location.search || "") + (location.hash || "");
          }
          return (parts[parts.length - 1] || "index.html") + (location.search || "") + (location.hash || "");
        };

        const notifyParent = () => {
          try {
            window.parent.postMessage(
              { type: "preview-iframe-src", src: getPreviewSrcPath() },
              "*"
            );
          } catch (_) {}
        };

        notifyParent();
        window.addEventListener("hashchange", notifyParent);
        window.addEventListener("popstate", notifyParent);
      })();

