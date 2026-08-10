// ============================================
// AI Career Guidance System
// Authentication
// ============================================

// Backend URL
const TOKEN = getToken();
//const TOKEN = localStorage.getItem("token");
console.log("auth.js loaded");

const API_URL = "http://127.0.0.1:8000/api/auth";


// ============================================
// REGISTER
// ============================================

const registerForm = document.querySelector("#registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const data = {

            full_name: document.querySelector("#fullName").value,

            email: document.querySelector("#email").value,

            mobile: document.querySelector("#mobile").value,

            college: document.querySelector("#college").value,

            branch: document.querySelector("#branch").value,

            year: document.querySelector("#year").value,

            skills: document.querySelector("#skills").value,

            interests: document.querySelector("#interests").value,

            password: document.querySelector("#password").value

        };

        try {

            const response = await fetch(

                API_URL + "/register",

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify(data)

                }

            );

            const result = await response.json();

            if (response.ok) {

                alert("Registration Successful!");

                window.location.href = "login.html";

            }

            else {

                alert(result.detail);

            }

        }

        catch (err) {

            alert("Server Error");

            console.log(err);

        }

    });

}

const API = "http://127.0.0.1:8000/api/auth";

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("email").value.trim();

        const password = document.getElementById("loginPassword").value.trim();

        try {

            const response = await fetch(API + "/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })

            });

            const data = await response.json();

            console.log(data);

            if (!response.ok) {

                alert(data.detail);

                return;

            }

            localStorage.setItem("token", data.access_token);

            localStorage.setItem("user", JSON.stringify(data.user));

            console.log("TOKEN SAVED:", localStorage.getItem("token"));

            window.location.href = "dashboard.html";

        }

        catch (err) {

            console.error(err);

            alert("Server Error");

        }

    });

}
// ============================
// Authentication
// ============================

function getToken() {

    return localStorage.getItem("token");

}

function getUser() {

    return JSON.parse(

        localStorage.getItem("user")

    );

}

function requireLogin() {

    if (!getToken()) {

        window.location.href = "login.html";

    }

}
