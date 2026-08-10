/* ==========================================
   AI Career Guidance
   Login Module
========================================== */

const API = "http://127.0.0.1:8000/api/auth";

// If already logged in
if (localStorage.getItem("token")) {

    window.location.href = "dashboard.html";

}

// Form Submit
document
    .getElementById("loginForm")
    .addEventListener("submit", login);


// ==========================================
// Login Function
// ==========================================

async function login(event) {

    event.preventDefault();

    const email = document
        .getElementById("email")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value
        .trim();

    const loginBtn = document
        .getElementById("loginBtn");

    if (email === "" || password === "") {

        alert("Please enter Email and Password.");

        return;

    }

    loginBtn.disabled = true;

    loginBtn.innerHTML = "Logging In...";

    try {

        const response = await fetch(

            API + "/login",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    email: email,

                    password: password

                })

            }

        );

        const data = await response.json();

        if (!response.ok) {

            loginBtn.disabled = false;

            loginBtn.innerHTML = "Login";

            alert(data.detail || "Login Failed");

            return;

        }

        // Save Token

        localStorage.setItem(

            "token",

            data.access_token

        );

        // Save User

        localStorage.setItem(

            "user",

            JSON.stringify(data.user)

        );

        loginBtn.innerHTML = "Login Successful";

        setTimeout(() => {

            window.location.href = "dashboard.html";

        }, 800);

    }

    catch (err) {

        console.error(err);

        loginBtn.disabled = false;

        loginBtn.innerHTML = "Login";

        alert("Unable to connect to server.");

    }

}