/**
 * 웅진IT 퍼블리싱 UI 공통 스크립트
 */

document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    initMobileGnb();
    initPcGnb();
    initSearchLayer();
    initFamilySite();
    initEmailDomain();
    initInflowSelect();
    initCategoryPanels();
    initTabMenu();
    initFaqAccordion();
    initLayerPopupEvents();
});

/* ==========================================================================
   1. 헤더 스크롤 감지 (Header Scroll Effect)
   ========================================================================== */
function initHeader() {
    const header = document.querySelector("header");
    if (!header) return;

    const handleScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        if (scrollTop > 10) {
            header.classList.add("is-scrolled");
        } else {
            header.classList.remove("is-scrolled");
        }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
}

/* ==========================================================================
   2. 모바일 GNB & 아코디언 메뉴 (Mobile GNB & Accordion)
   ========================================================================== */
function initMobileGnb() {
    const moGnbBtn = document.querySelector(".mo-menu");
    const moGnb = document.querySelector(".mo-gnb");
    const header = document.querySelector("header");
    if (!moGnbBtn || !moGnb) return;

    const slideDuration = 300;

    // 슬라이드 다운 애니메이션
    const slideDown = (target) => {
        if (!target) return;
        target.style.removeProperty("display");
        let display = window.getComputedStyle(target).display;
        if (display === "none") display = "block";
        target.style.display = display;

        const height = target.scrollHeight;
        target.style.overflow = "hidden";
        target.style.height = "0px";
        target.style.transition = `height ${slideDuration}ms ease-in-out`;

        target.offsetHeight; // Reflow 강제 실행

        target.style.height = height + "px";

        const onTransitionEnd = () => {
            target.style.removeProperty("height");
            target.style.removeProperty("overflow");
            target.style.removeProperty("transition");
            target.removeEventListener("transitionend", onTransitionEnd);
        };
        target.addEventListener("transitionend", onTransitionEnd);
    };

    // 슬라이드 업 애니메이션
    const slideUp = (target) => {
        if (!target) return;
        target.style.overflow = "hidden";
        target.style.height = target.scrollHeight + "px";
        target.style.transition = `height ${slideDuration}ms ease-in-out`;

        target.offsetHeight; // Reflow 강제 실행

        target.style.height = "0px";

        const onTransitionEnd = () => {
            target.style.display = "none";
            target.style.removeProperty("height");
            target.style.removeProperty("overflow");
            target.style.removeProperty("transition");
            target.removeEventListener("transitionend", onTransitionEnd);
        };
        target.addEventListener("transitionend", onTransitionEnd);
    };

    // 하위 서브메뉴 모두 닫기
    const closeSubMenu = (li) => {
        const activeLinks = li.querySelectorAll("a.act");
        activeLinks.forEach((a) => {
            a.classList.remove("act");
            a.setAttribute("aria-expanded", "false");
        });

        const openUls = li.querySelectorAll("ul");
        openUls.forEach((ul) => {
            if (window.getComputedStyle(ul).display !== "none") {
                slideUp(ul);
            }
        });
    };

    // 모바일 GNB 상태 초기화
    const resetMoGnb = () => {
        const activeLinks = moGnb.querySelectorAll("a.act");
        activeLinks.forEach((a) => {
            a.classList.remove("act");
            a.setAttribute("aria-expanded", "false");
        });

        const subUls = moGnb.querySelectorAll("ul ul");
        subUls.forEach((ul) => {
            ul.style.display = "none";
            ul.style.removeProperty("height");
            ul.style.removeProperty("overflow");
            ul.style.removeProperty("transition");
        });
        moGnb.scrollTop = 0;
    };

    // 모바일 메뉴 열기/닫기 토글
    moGnbBtn.addEventListener("click", () => {
        const isOpening = !moGnbBtn.classList.contains("act");
        moGnbBtn.classList.toggle("act", isOpening);
        moGnbBtn.setAttribute("aria-expanded", isOpening ? "true" : "false");
        moGnb.classList.toggle("act", isOpening);
        if (header) header.classList.toggle("act", isOpening);

        // 검색 레이어가 열려 있다면 닫기
        const searchLayer = document.querySelector(".search-layer");
        const searchBtn = document.querySelector(".function-menu .search");
        if (searchLayer && searchLayer.classList.contains("act")) {
            searchLayer.classList.remove("act");
            if (searchBtn) searchBtn.classList.remove("act");
        }

        // 바디 스크롤 락
        document.body.classList.toggle("no-scroll", isOpening);

        if (!isOpening) {
            resetMoGnb();
        }
    });

    // 모바일 아코디언 메뉴 클릭 이벤트
    const moGnbLinks = moGnb.querySelectorAll("a");
    moGnbLinks.forEach((link) => {
        const subMenu = link.nextElementSibling;
        if (subMenu && subMenu.tagName === "UL") {
            link.setAttribute("role", "button");
            link.setAttribute("aria-expanded", "false");

            link.addEventListener("click", (e) => {
                e.preventDefault();
                const parentLi = link.closest("li");
                const isOpening = !link.classList.contains("act");

                // 형제 서브메뉴 닫기 (아코디언 형태)
                if (parentLi && parentLi.parentElement) {
                    const siblingLis = Array.from(parentLi.parentElement.children).filter(
                        (child) => child !== parentLi && child.tagName === "LI"
                    );
                    siblingLis.forEach((siblingLi) => {
                        closeSubMenu(siblingLi);
                    });
                }

                if (isOpening) {
                    link.classList.add("act");
                    link.setAttribute("aria-expanded", "true");
                    slideDown(subMenu);
                } else {
                    link.classList.remove("act");
                    link.setAttribute("aria-expanded", "false");
                    slideUp(subMenu);

                    const childActiveLinks = subMenu.querySelectorAll("a.act");
                    childActiveLinks.forEach((a) => {
                        a.classList.remove("act");
                        a.setAttribute("aria-expanded", "false");
                    });

                    const childUls = subMenu.querySelectorAll("ul");
                    childUls.forEach((ul) => {
                        ul.style.display = "none";
                        ul.style.removeProperty("height");
                        ul.style.removeProperty("overflow");
                        ul.style.removeProperty("transition");
                    });
                }
            });
        }
    });

    // PC 해상도로 리사이즈 시 모바일 메뉴 초기화 및 닫기
    window.addEventListener("resize", () => {
        if (window.innerWidth > 1024) {
            if (moGnbBtn.classList.contains("act")) {
                moGnbBtn.classList.remove("act");
                moGnbBtn.setAttribute("aria-expanded", "false");
                moGnb.classList.remove("act");
                if (header) header.classList.remove("act");
                document.body.classList.remove("no-scroll");
                resetMoGnb();
            }
        }
    });
}

/* ==========================================================================
   3. PC GNB 네비게이션 (PC GNB Hover & Focus)
   ========================================================================== */
function initPcGnb() {
    const pcGnbList = document.querySelectorAll(".pc-gnb > ul > li");
    if (!pcGnbList.length) return;

    const isGnbActive = (item) => item.matches(":hover") || item.contains(document.activeElement);

    const openGnbSub = (gnbSub) => {
        if (!gnbSub) return;
        gnbSub.style.visibility = "visible";
        gnbSub.style.height = gnbSub.scrollHeight + "px";
    };

    const closeGnbSub = (item, gnbSub) => {
        if (!gnbSub || isGnbActive(item)) return;
        gnbSub.style.height = "0";
        gnbSub.style.visibility = "hidden";
    };

    pcGnbList.forEach((item) => {
        const gnbSub = item.querySelector(".gnb-sub");
        if (!gnbSub) return;

        item.addEventListener("mouseenter", () => openGnbSub(gnbSub));
        item.addEventListener("mouseleave", () => closeGnbSub(item, gnbSub));
        item.addEventListener("focusin", () => openGnbSub(gnbSub));
        item.addEventListener("focusout", (event) => {
            if (!item.contains(event.relatedTarget)) {
                closeGnbSub(item, gnbSub);
            }
        });
    });

    // ESC 키 입력 시 열려있는 PC GNB 서브메뉴 닫기
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            pcGnbList.forEach((item) => {
                const gnbSub = item.querySelector(".gnb-sub");
                if (gnbSub) {
                    gnbSub.style.height = "0";
                    gnbSub.style.visibility = "hidden";
                }
            });
        }
    });
}

/* ==========================================================================
   4. 헤더 검색 레이어 토글 (Header Search Layer)
   ========================================================================== */
function initSearchLayer() {
    const searchBtn = document.querySelector(".function-menu .search");
    const searchLayer = document.querySelector(".search-layer");
    if (!searchBtn || !searchLayer) return;

    const searchInput = searchLayer.querySelector(".search-input input[type='text'], input[type='search']");
    const closeBtn = searchLayer.querySelector(".close, .search-close, .btn-close");
    const recommendBtns = searchLayer.querySelectorAll(".recommend-list button");

    const closeSearchLayer = () => {
        searchBtn.classList.remove("act");
        searchBtn.setAttribute("aria-expanded", "false");
        searchLayer.classList.remove("act");
        document.body.classList.remove("no-scroll");
        searchBtn.focus();
    };

    const openSearchLayer = () => {
        searchBtn.classList.add("act");
        searchBtn.setAttribute("aria-expanded", "true");
        searchLayer.classList.add("act");
        document.body.classList.add("no-scroll");

        // 검색창 내부 input 자동 포커스
        if (searchInput) {
            setTimeout(() => searchInput.focus(), 100);
        }

        // 모바일 메뉴가 열려 있다면 닫기
        const moGnbBtn = document.querySelector(".mo-menu");
        const moGnb = document.querySelector(".mo-gnb");
        const header = document.querySelector("header");
        if (moGnbBtn && moGnbBtn.classList.contains("act")) {
            moGnbBtn.classList.remove("act");
            moGnbBtn.setAttribute("aria-expanded", "false");
            moGnb.classList.remove("act");
            if (header) header.classList.remove("act");
        }
    };

    searchBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = searchLayer.classList.contains("act");
        if (isOpen) {
            closeSearchLayer();
        } else {
            openSearchLayer();
        }
    });

    // 닫기 버튼 클릭 이벤트
    if (closeBtn) {
        closeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            closeSearchLayer();
        });
    }

    // 추천 검색어 버튼 클릭 시 검색창에 텍스트 입력 및 포커스
    if (recommendBtns.length && searchInput) {
        recommendBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                searchInput.value = btn.textContent.trim();
                searchInput.focus();
            });
        });
    }

    // ESC 키로 검색 레이어 닫기
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && searchLayer.classList.contains("act")) {
            closeSearchLayer();
        }
    });
}

/* ==========================================================================
   5. 패밀리 사이트 드롭다운 (Family Site Dropdown)
   ========================================================================== */
function initFamilySite() {
    const familySite = document.querySelector(".family-site");
    if (!familySite) return;

    const familySiteBtn = familySite.querySelector("button");
    if (!familySiteBtn) return;

    const closeFamilySite = () => {
        familySite.classList.remove("is-open");
        familySiteBtn.setAttribute("aria-expanded", "false");
    };

    familySiteBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        const isOpen = familySite.classList.toggle("is-open");
        familySiteBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    familySite.querySelectorAll("ul a").forEach((link) => {
        link.addEventListener("click", closeFamilySite);
    });

    document.addEventListener("click", (event) => {
        if (!familySite.contains(event.target)) {
            closeFamilySite();
        }
    });

    // 포커스 벗어남 및 ESC 키 처리
    familySite.addEventListener("focusout", (event) => {
        if (!familySite.contains(event.relatedTarget)) {
            closeFamilySite();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && familySite.classList.contains("is-open")) {
            closeFamilySite();
            familySiteBtn.focus();
        }
    });
}

/* ==========================================================================
   6. 이메일 도메인 선택 (Email Domain Select - 다중 폼 지원)
   ========================================================================== */
function initEmailDomain() {
    const emailContainers = document.querySelectorAll(".email, .form-item.email, .forms-cont");
    if (!emailContainers.length) return;

    emailContainers.forEach((container) => {
        const domainSelect = container.querySelector("select[name='email-domain'], select[name='email-domain-select'], select#email-domain");
        const domainInput = container.querySelector("input[name='email-domain'], input[name='email2']");

        if (domainSelect && domainInput) {
            domainSelect.addEventListener("change", function () {
                if (this.value === "직접입력" || this.value === "") {
                    domainInput.value = "";
                    domainInput.readOnly = false;
                    domainInput.focus();
                } else {
                    domainInput.value = this.value;
                    domainInput.readOnly = true;
                }
            });
        }
    });
}

/* ==========================================================================
   7. 문의하기 유입경로 '기타' 선택 시 추가 인풋 노출 (Inflow Other Input)
   ========================================================================== */
function initInflowSelect() {
    const inflowSelect = document.querySelector("#inflow");
    const inflowOtherInput = document.querySelector("#inflowOther");
    if (!inflowSelect || !inflowOtherInput) return;

    const updateInflowOther = () => {
        if (inflowSelect.value === "17" || inflowSelect.value === "기타") {
            inflowOtherInput.classList.add("show");
            inflowOtherInput.focus();
        } else {
            inflowOtherInput.classList.remove("show");
            inflowOtherInput.value = "";
        }
    };

    inflowSelect.addEventListener("change", updateInflowOther);
}

/* ==========================================================================
   8. 문의구분: IT솔루션 / 웅진그룹 상호 배타 선택 (Inquiry Category Panels)
   ========================================================================== */
function initCategoryPanels() {
    const itCategoryPanel = document.querySelector('.inquiry-form .category-panel[data-panel="it"]');
    const groupCategoryPanel = document.querySelector('.inquiry-form .category-panel[data-panel="group"]');
    if (!itCategoryPanel || !groupCategoryPanel) return;

    const getCategoryChecks = (panel) => panel.querySelectorAll('input[name="category"]');
    const hasCheckedCategory = (panel) => [...getCategoryChecks(panel)].some((input) => input.checked);

    const setCategoryChecksDisabled = (panel, disabled) => {
        getCategoryChecks(panel).forEach((input) => {
            if (disabled) input.checked = false;
            input.disabled = disabled;
        });
    };

    const syncCategoryPanels = () => {
        const itChecked = hasCheckedCategory(itCategoryPanel);
        const groupChecked = hasCheckedCategory(groupCategoryPanel);

        setCategoryChecksDisabled(groupCategoryPanel, itChecked);
        setCategoryChecksDisabled(itCategoryPanel, groupChecked);
    };

    [itCategoryPanel, groupCategoryPanel].forEach((panel) => {
        getCategoryChecks(panel).forEach((input) => {
            input.addEventListener("change", syncCategoryPanels);
        });
    });

    // 초기 로딩 시 상태 동기화
    syncCategoryPanels();
}

/* ==========================================================================
   9. 탭 메뉴 & 카테고리 탭 (Tab Menu & Category Tabs)
   ========================================================================== */
function initTabMenu() {
    // 1) 카테고리 리스트 (category-list, category-list2) 단순 활성화 토글
    const categoryContainers = document.querySelectorAll(".category-list, .category-list2");
    categoryContainers.forEach((container) => {
        const buttons = container.querySelectorAll("button");
        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                buttons.forEach((btn) => btn.classList.remove("act"));
                button.classList.add("act");
            });
        });
    });

    // 2) 탭 메뉴 (tab-list) - data-target ↔ tab-cont id 매칭으로 스크롤 이동 및 ScrollSpy
    const tabContainers = document.querySelectorAll(".tab-list");
    tabContainers.forEach((tabContainer) => {
        const tabButtons = Array.from(tabContainer.querySelectorAll("button"));
        if (!tabButtons.length) return;

        const parentSection = tabContainer.closest(".inner-cont, .content, main") || document;
        const fallbackContents = Array.from(parentSection.querySelectorAll(".tab-cont"));

        const getTargetCont = (button, index) => {
            const targetId = (button.getAttribute("data-target") || "").replace(/^#/, "");
            if (targetId) {
                const byId = document.getElementById(targetId);
                if (byId) return byId;
            }
            return fallbackContents[index] || null;
        };

        const tabTargets = tabButtons
            .map((button, index) => ({ button, cont: getTargetCont(button, index) }))
            .filter((item) => item.cont);

        let isClickScrolling = false;
        let scrollTimeout = null;

        const getScrollOffset = (targetCont) => {
            const header = document.querySelector("header");
            const headerHeight = header ? header.offsetHeight : 0;
            const tabHeight = tabContainer.offsetHeight || 0;

            let contMarginTop = 0;
            const contElement = targetCont || (tabTargets[0] && tabTargets[0].cont);
            if (contElement) {
                const marginTopVal = parseFloat(window.getComputedStyle(contElement).marginTop);
                if (!isNaN(marginTopVal)) {
                    contMarginTop = marginTopVal;
                }
            }

            return headerHeight + tabHeight - contMarginTop;
        };

        const setActiveTab = (activeButton) => {
            tabButtons.forEach((btn) => {
                btn.classList.toggle("act", btn === activeButton);
            });
        };

        tabButtons.forEach((button, index) => {
            button.addEventListener("click", () => {
                setActiveTab(button);

                const targetCont = getTargetCont(button, index);
                if (!targetCont) return;

                const offset = getScrollOffset(targetCont);
                const targetTop = targetCont.getBoundingClientRect().top + window.pageYOffset - offset;

                isClickScrolling = true;
                if (scrollTimeout) clearTimeout(scrollTimeout);

                window.scrollTo({
                    top: Math.max(0, targetTop),
                    behavior: "smooth"
                });

                scrollTimeout = setTimeout(() => {
                    isClickScrolling = false;
                }, 800);
            });
        });

        // 페이지 스크롤 시 현재 보고 있는 tab-cont 섹션에 맞춰 tab 버튼 활성화 (ScrollSpy)
        if (tabTargets.length > 0) {
            const onScroll = () => {
                if (isClickScrolling) return;

                const scrollPos = window.pageYOffset;
                let activeButton = tabTargets[0].button;

                tabTargets.forEach(({ button, cont }) => {
                    const offset = getScrollOffset(cont) + 30;
                    const contTop = cont.getBoundingClientRect().top + window.pageYOffset;
                    if (scrollPos + offset >= contTop) {
                        activeButton = button;
                    }
                });

                setActiveTab(activeButton);
            };

            window.addEventListener("scroll", onScroll, { passive: true });
        }
    });
}

/* ==========================================================================
   10. FAQ 아코디언 (FAQ Accordion)
   ========================================================================== */
function initFaqAccordion() {
    const faqLists = document.querySelectorAll(".faq .faq-list");
    if (!faqLists.length) return;

    faqLists.forEach((list) => {
        const items = list.querySelectorAll(".faq-item");

        items.forEach((item) => {
            const head = item.querySelector(".item-head");
            const cont = item.querySelector(".item-cont");
            if (!head || !cont) return;

            const isOpen = head.classList.contains("act") || cont.classList.contains("act");
            head.classList.toggle("act", isOpen);
            cont.classList.toggle("act", isOpen);
            head.setAttribute("aria-expanded", isOpen ? "true" : "false");

            head.addEventListener("click", (e) => {
                e.preventDefault();
                const willOpen = !head.classList.contains("act");

                items.forEach((other) => {
                    if (other === item) return;
                    const otherHead = other.querySelector(".item-head");
                    const otherCont = other.querySelector(".item-cont");
                    // if (otherHead) {
                    //     otherHead.classList.remove("act");
                    //     otherHead.setAttribute("aria-expanded", "false");
                    // }
                    // if (otherCont) otherCont.classList.remove("act");
                });

                head.classList.toggle("act", willOpen);
                cont.classList.toggle("act", willOpen);
                head.setAttribute("aria-expanded", willOpen ? "true" : "false");
            });
        });
    });
}

/* ==========================================================================
   11. 레이어 팝업 열기 / 닫기 (Layer Popup - Global Functions)
   ========================================================================== */
function syncBodyScrollForPopups() {
    const hasActivePopup = document.querySelector(".layer-pop.act");
    if (hasActivePopup) {
        document.body.classList.add("no-scroll");
    } else {
        document.body.classList.remove("no-scroll");
    }
}

/**
 * 레이어 팝업 열기
 * @param {string} popup - 열고자 하는 레이어 팝업 클래스명 (예: 'download', 'terms1')
 * @param {Event} [event] - 클릭 이벤트 객체 (선택)
 */
const openLayer = (popup, event) => {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    const target = document.querySelector(".layer-pop." + popup);
    if (!target) return;

    target.classList.add("act");
    syncBodyScrollForPopups();

    // 접근성: 팝업 내부 첫 포커스 가능한 요소로 포커스 이동
    const focusable = target.querySelector("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
    if (focusable) {
        setTimeout(() => focusable.focus(), 100);
    }
};

/**
 * 레이어 팝업 닫기
 * @param {HTMLElement|string} el - 닫기 버튼 엘리먼트 또는 팝업 선택자
 */
const closeLayer = (el) => {
    let target;
    if (typeof el === "string") {
        target = document.querySelector(".layer-pop." + el);
    } else if (el instanceof HTMLElement) {
        target = el.closest(".layer-pop");
    }

    if (!target) return;

    target.classList.remove("act");
    syncBodyScrollForPopups();
};

// 인라인 onclick 등 전역 호출을 위해 window 객체에 등록
window.openLayer = openLayer;
window.closeLayer = closeLayer;

/* ==========================================================================
   12. 레이어 팝업 이벤트 바인딩 (배경 클릭, 취소 버튼, ESC 키)
   ========================================================================== */
function initLayerPopupEvents() {
    const popups = document.querySelectorAll(".layer-pop");
    popups.forEach((pop) => {
        // 팝업 배경(딤드 영역) 클릭 시 닫기
        pop.addEventListener("click", (e) => {
            if (e.target === pop) {
                closeLayer(pop);
            }
        });

        // 팝업 내부 취소 버튼 클릭 시 닫기
        const cancelBtn = pop.querySelector(".pop-foot .btn-outline-default");
        if (cancelBtn) {
            cancelBtn.addEventListener("click", () => {
                closeLayer(pop);
            });
        }
    });

    // ESC 키로 활성화된 최상단 레이어 팝업 닫기
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            const activePopups = document.querySelectorAll(".layer-pop.act");
            if (activePopups.length > 0) {
                const topPopup = activePopups[activePopups.length - 1];
                closeLayer(topPopup);
            }
        }
    });
}
