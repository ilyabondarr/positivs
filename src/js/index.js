import '../assets/style/style.scss';


document.addEventListener("DOMContentLoaded", function() {
    //header
    const burgerBtn = document.querySelector("#burger-checkbox");
    const navMenu = document.querySelector(".header__nav");
    const body = document.querySelector("body");
    
    burgerBtn.addEventListener("click", () => {
        navMenu.classList.toggle("header__nav-active")
        if(navMenu.classList.contains("header__nav-active")){
            body.style.overflow = "hidden";
        } else{
            body.style.overflow = "auto";
        }
    })
})