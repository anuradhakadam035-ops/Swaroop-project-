// =======================================
// AI Career Guidance System
// main.js
// =======================================
const USER = JSON.parse(

    localStorage.getItem("user")

);

if (!USER) {

    window.location.href = "login.html";

}

const USER_ID = USER.id;

const TOKEN = localStorage.getItem("token");
// Wait until page is fully loaded
document.addEventListener("DOMContentLoaded", () => {

    // ==========================
    // Navbar Shadow on Scroll
    // ==========================
    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 50) {

            navbar.style.background = "rgba(7,11,29,0.85)";
            navbar.style.backdropFilter = "blur(20px)";
            navbar.style.boxShadow = "0 10px 30px rgba(0,0,0,.35)";

        } else {

            navbar.style.background = "rgba(255,255,255,.05)";
            navbar.style.boxShadow = "none";

        }

    });

    // ==========================
    // Button Ripple Animation
    // ==========================
    document.querySelectorAll("button").forEach(button => {

        button.addEventListener("click", function (e) {

            const circle = document.createElement("span");

            const diameter = Math.max(this.clientWidth, this.clientHeight);

            const radius = diameter / 2;

            circle.style.width = circle.style.height = `${diameter}px`;

            circle.style.left = `${e.clientX - this.offsetLeft - radius}px`;

            circle.style.top = `${e.clientY - this.offsetTop - radius}px`;

            circle.classList.add("ripple");

            const ripple = this.getElementsByClassName("ripple")[0];

            if (ripple) {
                ripple.remove();
            }

            this.appendChild(circle);

        });

    });

    // ==========================
    // Hero Fade Animation
    // ==========================
    const heroLeft = document.querySelector(".hero-left");
    const heroRight = document.querySelector(".hero-right");

    heroLeft.style.opacity = "0";
    heroRight.style.opacity = "0";

    heroLeft.style.transform = "translateX(-50px)";
    heroRight.style.transform = "translateX(50px)";

    setTimeout(() => {

        heroLeft.style.transition = "all 1s ease";
        heroRight.style.transition = "all 1s ease";

        heroLeft.style.opacity = "1";
        heroRight.style.opacity = "1";

        heroLeft.style.transform = "translateX(0)";
        heroRight.style.transform = "translateX(0)";

    }, 300);

    // ==========================
    // Hero Button Click
    // ==========================
    const startBtn = document.querySelector(".start-btn");

    startBtn.addEventListener("click", () => {

        alert("Assessment Module Coming Soon!");

    });

});