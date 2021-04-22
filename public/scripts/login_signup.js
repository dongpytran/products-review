var loginBtn = document.querySelector("#login--btn");
var signupBtn = document.querySelector("#signup--btn");

loginBtn.addEventListener("click", () => {
    document.querySelector("#signup").classList.add("hide");
    signupBtn.classList.remove("selected");

    loginBtn.classList.add("selected");
    document.querySelector("#login").classList.remove("hide");
});

signupBtn.addEventListener("click", () => {
    document.querySelector("#login").classList.add("hide");
    loginBtn.classList.remove("selected");

    signupBtn.classList.add("selected");
    document.querySelector("#signup").classList.remove("hide");
});