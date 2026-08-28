// 이메일 도메인 선택
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