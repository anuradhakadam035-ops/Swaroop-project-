// ==========================================
// VisionX Home Page
// ==========================================

// Counter Animation

function animateCounter(id, end, suffix = "") {

    const element = document.getElementById(id);

    let start = 0;

    const speed = Math.ceil(end / 100);

    const counter = setInterval(() => {

        start += speed;

        if (start >= end) {

            start = end;

            clearInterval(counter);

        }

        element.innerHTML = start + suffix;

    }, 20);

}

// Start Counters

window.addEventListener("load", () => {

    animateCounter("students", 500, "+");

    animateCounter("resume", 1500, "+");

    animateCounter("jobs", 300, "+");

    animateCounter("accuracy", 98, "%");

});

// ==========================================
// Navbar Background on Scroll
// ==========================================

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {

        navbar.style.background = "rgba(8,17,31,0.95)";

        navbar.style.boxShadow = "0 10px 30px rgba(0,0,0,.35)";

    }

    else {

        navbar.style.background = "rgba(255,255,255,.05)";

        navbar.style.boxShadow = "none";

    }

});

// ==========================================
// Scroll Reveal Animation
// ==========================================

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

}, {

    threshold: 0.2

});

document.querySelectorAll(

    ".feature-card,.counter,.hero"

).forEach(el => {

    el.classList.add("hidden");

    observer.observe(el);

});

// ==========================================
// Floating Hero Image
// ==========================================

const heroImage = document.querySelector(".hero-image");

window.addEventListener("mousemove", (e) => {

    if (!heroImage) return;

    const x = (window.innerWidth / 2 - e.pageX) / 40;

    const y = (window.innerHeight / 2 - e.pageY) / 40;

    heroImage.style.transform =
        `translate(${x}px,${y}px)`;

});

// ==========================================
// Feature Card Hover Glow
// ==========================================

document.querySelectorAll(".feature-card").forEach(card => {

    card.addEventListener("mousemove", e => {

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;

        const y = e.clientY - rect.top;

        card.style.background =
            `radial-gradient(circle at ${x}px ${y}px,
            rgba(66,182,255,.25),
            rgba(255,255,255,.08))`;

    });

    card.addEventListener("mouseleave", () => {

        card.style.background =
            "rgba(255,255,255,.08)";

    });

});

// ==========================================
// Smooth Scroll
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        e.preventDefault();

        const target = document.querySelector(

            this.getAttribute("href")

        );

        if (target) {

            target.scrollIntoView({

                behavior: "smooth"

            });

        }

    });

});

// ==========================================
// Button Ripple Effect
// ==========================================

document.querySelectorAll("button,.btn").forEach(btn => {

    btn.addEventListener("click", function (e) {

        const ripple = document.createElement("span");

        ripple.classList.add("ripple");

        const rect = this.getBoundingClientRect();

        ripple.style.left = (e.clientX - rect.left) + "px";

        ripple.style.top = (e.clientY - rect.top) + "px";

        this.appendChild(ripple);

        setTimeout(() => {

            ripple.remove();

        }, 600);

    });

});

console.log("🚀 VisionX Home Loaded Successfully");