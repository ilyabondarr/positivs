import "../assets/style/style.scss";
import Swiper from "swiper";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/autoplay";
import gsap from "gsap";

document.addEventListener("DOMContentLoaded", function () {
  //header
  const burgerBtn = document.querySelector("#burger-checkbox");
  const navMenu = document.querySelector(".header__nav");
  const body = document.querySelector("body");

  burgerBtn.addEventListener("click", () => {
    navMenu.classList.toggle("header__nav-active");
    if (navMenu.classList.contains("header__nav-active")) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }
  });

  const swiperHero = new Swiper(".heroSwiper", {
    modules: [FreeMode, Autoplay],
    slidesPerView: 4,
    spaceBetween: 20,
    freeMode: {
      enabled: true
    },
    autoplay: {
      enabled: true,
      delay: 1
    },
    breakpoints: {
      320: {
         slidesPerView: 3,
      },
      767: {
        slidesPerView: 4,
      },
      1091: {
        slidesPerView: 6,
      }
    },
    speed: 8000,
    loop: true
  });
  const swiperMobileHero = new Swiper(".heroMobileSwiper", {
    modules: [FreeMode, Autoplay],
    slidesPerView: 4,
    spaceBetween: 20,
    freeMode: {
      enabled: true
    },
    autoplay: {
      enabled: true,
      delay: 1,
      reverseDirection: true,
    },
     breakpoints: {
      320: {
         slidesPerView: 3,
      }
    },
    speed: 8000,
    loop: true
  });

  if (window.innerWidth  <= 767) {
    swiperMobileHero.init();
  } else {
    swiperMobileHero.destroy(true, true);
  }
  
});