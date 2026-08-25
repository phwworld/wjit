// select email domain
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