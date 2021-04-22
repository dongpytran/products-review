var btn = document.querySelector(".title button");
var edit = document.querySelectorAll("i.edit");

btn.addEventListener("click", () => {
    document.querySelector("#new-comment").classList.toggle("hide-addComment");
    document.querySelector("#new-comment").classList.toggle("border");
    btn.textContent = btn.textContent == "Để Lại Đánh Giá" ? "Ẩn" : "Để Lại Đánh Giá";
});

for (let i = 0; i < edit.length; i++) {
    edit[i].addEventListener("click", () => {
        document.querySelector(`form[data-cmtNo="${i}"]`).classList.toggle("hide-addComment");
    });
}