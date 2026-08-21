// layer popup open
const openLayer = (popup) => {
    let target = document.querySelector("." + popup);
    target.classList.add("act");
}

// layer popup close
const closeLayer = (e) => {
    let target = e.closest(".layer-pop");
    target.classList.remove("act");
}