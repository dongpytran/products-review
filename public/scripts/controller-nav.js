var menu = document.querySelector(".expand"),
    nav  = document.querySelector(".collapse-links");

menu.addEventListener("click", () => {
    nav.classList.toggle("hide-nav");
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 800 && !nav.classList.contains("hide-nav")) {
        nav.classList.add("hide-nav");
    }
})