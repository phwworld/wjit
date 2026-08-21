// layer popup open
const openLayer = (popup) => {
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
