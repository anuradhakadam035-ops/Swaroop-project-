// =========================================================
// VISIONX ADMIN LOGIN
// =========================================================

const API = "http://127.0.0.1:8000/api/admin";


// =========================================================
// ELEMENTS
// =========================================================

const loginForm = document.getElementById("adminLoginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const loginMessage = document.getElementById("loginMessage");
const passwordToggle = document.getElementById("passwordToggle");


// =========================================================
// PASSWORD SHOW / HIDE
// =========================================================

if (passwordToggle && passwordInput) {

    passwordToggle.addEventListener("click", function () {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            passwordToggle.innerHTML =
                '<i class="fa-solid fa-eye-slash"></i>';

            passwordToggle.setAttribute(
                "aria-label",
                "Hide password"
            );

        } else {

            passwordInput.type = "password";

            passwordToggle.innerHTML =
                '<i class="fa-solid fa-eye"></i>';

            passwordToggle.setAttribute(
                "aria-label",
                "Show password"
            );

        }

    });

}


// =========================================================
// SHOW MESSAGE
// =========================================================

function showMessage(message, type = "error") {

    if (!loginMessage) return;

    loginMessage.textContent = message;

    loginMessage.className =
        "login-message " + type;

}


// =========================================================
// LOGIN FORM
// =========================================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            // =================================================
            // GET VALUES
            // =================================================

            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;


            // =================================================
            // VALIDATION
            // =================================================

            if (!email) {

                showMessage(
                    "Please enter your admin email.",
                    "error"
                );

                emailInput.focus();

                return;
            }


            if (!password) {

                showMessage(
                    "Please enter your password.",
                    "error"
                );

                passwordInput.focus();

                return;
            }


            // =================================================
            // LOADING
            // =================================================

            loginBtn.disabled = true;

            loginBtn.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Logging in...
            `;

            loginMessage.className =
                "login-message";

            loginMessage.textContent = "";


            // =================================================
            // OAUTH2 FORM DATA
            // =================================================
            //
            // IMPORTANT:
            //
            // OAuth2PasswordRequestForm expects:
            //
            // username
            // password
            //
            // We use username = admin email.
            //
            // =================================================

            const formData =
                new URLSearchParams();

            formData.append(
                "username",
                email
            );

            formData.append(
                "password",
                password
            );


            // =================================================
            // API REQUEST
            // =================================================

            try {

                const response =
                    await fetch(

                        API + "/login",

                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/x-www-form-urlencoded",

                                "Accept":
                                    "application/json"

                            },

                            body:
                                formData.toString()

                        }

                    );


                // =================================================
                // READ RESPONSE
                // =================================================

                const data =
                    await response.json();


                console.log(
                    "================================"
                );

                console.log(
                    "ADMIN LOGIN RESPONSE"
                );

                console.log(
                    data
                );

                console.log(
                    "STATUS:",
                    response.status
                );

                console.log(
                    "================================"
                );


                // =================================================
                // LOGIN FAILED
                // =================================================

                if (!response.ok) {

                    showMessage(

                        data.detail ||
                        "Invalid admin email or password.",

                        "error"

                    );

                    return;
                }


                // =================================================
                // CHECK ACCESS TOKEN
                // =================================================

                if (!data.access_token) {

                    console.error(
                        "Access token missing:",
                        data
                    );

                    showMessage(

                        "Login failed: access token not received.",

                        "error"

                    );

                    return;
                }


                // =================================================
                // SAVE ADMIN JWT
                // =================================================

                localStorage.setItem(

                    "adminToken",

                    data.access_token

                );


                // =================================================
                // SAVE ADMIN DETAILS
                // =================================================

                if (data.admin) {

                    localStorage.setItem(

                        "admin",

                        JSON.stringify(
                            data.admin
                        )

                    );

                }


                // =================================================
                // OPTIONAL:
                // Remove old student login data
                // =================================================

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );


                // =================================================
                // VERIFY TOKEN WAS SAVED
                // =================================================

                const savedToken =
                    localStorage.getItem(
                        "adminToken"
                    );


                if (!savedToken) {

                    showMessage(

                        "Login failed: unable to save admin session.",

                        "error"

                    );

                    return;
                }


                console.log(
                    "ADMIN TOKEN SAVED SUCCESSFULLY"
                );


                // =================================================
                // SUCCESS MESSAGE
                // =================================================

                showMessage(

                    "Login successful! Redirecting...",

                    "success"

                );


                // =================================================
                // REDIRECT TO ADMIN DASHBOARD
                // =================================================

                setTimeout(
                    function () {

                        window.location.href =
                            "admin.html";

                    },
                    800
                );

            }


            // =================================================
            // NETWORK / SERVER ERROR
            // =================================================

            catch (error) {

                console.error(
                    "ADMIN LOGIN ERROR:",
                    error
                );


                showMessage(

                    "Unable to connect to the server. Please make sure the backend is running.",

                    "error"

                );

            }


            // =================================================
            // RESET LOGIN BUTTON
            // =================================================

            finally {

                loginBtn.disabled = false;

                loginBtn.innerHTML = `
                    <i class="fa-solid fa-right-to-bracket"></i>
                    Login
                `;

            }

        }
    );

}