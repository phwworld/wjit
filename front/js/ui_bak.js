// mobile gnb layer toggle
const moGnbBtn = document.querySelector(".mo-menu");
const moGnb = document.querySelector(".mo-gnb");
const header = document.querySelector("header");

const resetMoGnb = () => {
    if (!moGnb) return;
    const activeLinks = moGnb.querySelectorAll("a.act");
    activeLinks.forEach((a) => a.classList.remove("act"));

    const subUls = moGnb.querySelectorAll("ul ul");
    subUls.forEach((ul) => {
        ul.style.display = "none";
        ul.style.height = "";
        ul.style.overflow = "";
        ul.style.transition = "";
    });
    moGnb.scrollTop = 0;
};

if (moGnbBtn && moGnb) {
    moGnbBtn.addEventListener("click", () => {
        const isOpening = !moGnbBtn.classList.contains("act");
        moGnbBtn.classList.toggle("act", isOpening);
        moGnb.classList.toggle("act", isOpening);
        if (header) header.classList.toggle("act", isOpening);

        if (!isOpening) {
            resetMoGnb();
        }
    });
}

// mobile gnb accordion menu toggle
const moGnbMenuNav = document.querySelector(".mo-gnb");
if (moGnbMenuNav) {
    const slideDuration = 300;

    const slideDown = (target) => {
        target.style.display = "block";
        target.style.overflow = "hidden";
        target.style.height = "0";
        const height = target.scrollHeight;
        target.style.transition = `height ${slideDuration}ms ease-in-out`;
        target.offsetHeight;
        target.style.height = height + "px";

        setTimeout(() => {
            target.style.height = "";
            target.style.overflow = "";
            target.style.transition = "";
        }, slideDuration);
    };

    const slideUp = (target) => {
        target.style.overflow = "hidden";
        target.style.height = target.scrollHeight + "px";
        target.style.transition = `height ${slideDuration}ms ease-in-out`;
        target.offsetHeight;
        target.style.height = "0";

        setTimeout(() => {
            target.style.display = "none";
            target.style.height = "";
            target.style.overflow = "";
            target.style.transition = "";
        }, slideDuration);
    };

    const closeSubMenu = (li) => {
        const activeLinks = li.querySelectorAll("a.act");
        activeLinks.forEach((a) => a.classList.remove("act"));

        const openUls = li.querySelectorAll("ul");
        openUls.forEach((ul) => {
            if (window.getComputedStyle(ul).display !== "none") {
                slideUp(ul);
            }
        });
    };

    const moGnbLinks = moGnbMenuNav.querySelectorAll("a");
    moGnbLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            const subMenu = link.nextElementSibling;
            if (subMenu && subMenu.tagName === "UL") {
                e.preventDefault();
                const parentLi = link.closest("li");
                const isOpening = !link.classList.contains("act");

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
                    slideDown(subMenu);
                } else {
                    link.classList.remove("act");
                    slideUp(subMenu);

                    const childActiveLinks = subMenu.querySelectorAll("a.act");
                    childActiveLinks.forEach((a) => a.classList.remove("act"));
                    const childUls = subMenu.querySelectorAll("ul");
                    childUls.forEach((ul) => {
                        ul.style.display = "none";
                        ul.style.height = "";
                    });
                }
            }
        });
    });
}

// pc gnb
const pcGnbList = document.querySelectorAll(".pc-gnb > ul > li");
if (pcGnbList.length) {
    const isGnbActive = (item) => item.matches(":hover") || item.contains(document.activeElement);

    const openGnbSub = (gnbSub) => {
        gnbSub.style.visibility = "visible";
        gnbSub.style.height = gnbSub.scrollHeight + "px";
    };

    const closeGnbSub = (item, gnbSub) => {
        if (isGnbActive(item)) return;
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
}

// email domain select
const domainSelect = document.querySelector("#email-domain");
const domainInput = document.querySelector("input[name='email-domain']");
if (domainSelect && domainInput) {
    domainSelect.addEventListener("change", function () {
        if (this.value === "직접입력") {
            domainInput.value = "";
            domainInput.readOnly = false;
            domainInput.focus();
        } else {
            domainInput.value = this.value;
            domainInput.readOnly = true;
        }
    });
}

// 문의하시 유입경로 기타
const inflowSelect = document.querySelector("#inflow");
const inflowOtherInput = document.querySelector("#inflowOther");
if (inflowSelect && inflowOtherInput) {
    inflowSelect.addEventListener("change", function () {
        if (this.value === "17") {
            inflowOtherInput.classList.add("show");
            inflowOtherInput.focus();
        } else {
            inflowOtherInput.classList.remove("show");
        }
    });
}

// 문의구분: IT솔루션 / 웅진그룹 상호 배타 선택
const itCategoryPanel = document.querySelector('.inquiry-form .category-panel[data-panel="it"]');
const groupCategoryPanel = document.querySelector('.inquiry-form .category-panel[data-panel="group"]');
if (itCategoryPanel && groupCategoryPanel) {
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
}

// family site toggle
const familySite = document.querySelector(".family-site");
if (familySite) {
    const familySiteBtn = familySite.querySelector("button");

    const closeFamilySite = () => {
        familySite.classList.remove("is-open");
        familySiteBtn.setAttribute("aria-expanded", "false");
    };

    familySiteBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        const isOpen = familySite.classList.toggle("is-open");
        familySiteBtn.setAttribute("aria-expanded", isOpen);
    });

    familySite.querySelectorAll("ul a").forEach((link) => {
        link.addEventListener("click", closeFamilySite);
    });

    document.addEventListener("click", (event) => {
        if (!familySite.contains(event.target)) {
            closeFamilySite();
        }
    });
}

// layer popup open
const openLayer = (popup, event) => {
    if (popup === "terms1" || popup === "terms2") {
        event.preventDefault();
        event.stopPropagation();
    }

    const target = document.querySelector(".layer-pop." + popup);
    if (!target) return;
    target.classList.add("act");
}

// layer popup close
const closeLayer = (el) => {
    const target = el.closest(".layer-pop");
    if (!target) return;
    target.classList.remove("act");
}