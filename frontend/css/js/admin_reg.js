// =========================================================
// VISIONX ADMIN REGISTRATION
// =========================================================

const API = "http://127.0.0.1:8000/api/admin";

// =========================================================
// ELEMENTS
// =========================================================

const registerForm = document.getElementById("registerForm");

const nameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const mobileInput = document.getElementById("mobile");

const passwordInput = document.getElementById("password");
const confirmPasswordInput =
    document.getElementById("confirmPassword");

const messageBox =
    document.getElementById("registerMessage");

const registerBtn =
    document.getElementById("registerBtn");


// =========================================================
// SHOW MESSAGE
// =========================================================

function showMessage(message, type = "error") {

    if (!messageBox) return;

    messageBox.textContent = message;

    messageBox.className =
        "register-message " + type;
}


// =========================================================
// PASSWORD VIEW / HIDE
// =========================================================

function setupPasswordToggle(inputId, buttonId) {

    const input =
        document.getElementById(inputId);

    const button =
        document.getElementById(buttonId);

    if (!input || !button) {
        return;
    }


    button.addEventListener("click", function () {

        // Password currently hidden
        if (input.type === "password") {

            input.type = "text";

            button.innerHTML =
                '<i class="fa-solid fa-eye-slash"></i>';

            button.setAttribute(
                "aria-label",
                "Hide password"
            );

            button.setAttribute(
                "title",
                "Hide password"
            );

        }

        // Password currently visible
        else {

            input.type = "password";

            button.innerHTML =
                '<i class="fa-solid fa-eye"></i>';

            button.setAttribute(
                "aria-label",
                "Show password"
            );

            button.setAttribute(
                "title",
                "Show password"
            );
        }

    });

}


// =========================================================
// INITIALIZE BOTH EYE BUTTONS
// =========================================================

setupPasswordToggle(
    "password",
    "passwordToggle"
);

setupPasswordToggle(
    "confirmPassword",
    "confirmPasswordToggle"
);


// =========================================================
// MOBILE NUMBER
// =========================================================

if (mobileInput) {

    mobileInput.addEventListener(
        "input",
        function () {

            // Allow numbers only
            this.value =
                this.value
                    .replace(/\D/g, "")
                    .slice(0, 10);

        }
    );

}


// =========================================================
// REGISTER FORM
// =========================================================

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // =================================================
            // GET VALUES
            // =================================================

            const full_name =
                nameInput.value.trim();

            const email =
                emailInput.value.trim();

            const mobile =
                mobileInput.value.trim();

            const password =
                passwordInput.value;

            const confirmPassword =
                confirmPasswordInput.value;


            // =================================================
            // VALIDATION
            // =================================================

            if (!full_name) {

                showMessage(
                    "Please enter your full name.",
                    "error"
                );

                nameInput.focus();

                return;
            }


            if (!email) {

                showMessage(
                    "Please enter your email address.",
                    "error"
                );

                emailInput.focus();

                return;
            }


            // Email validation

            if (!/^\S+@\S+\.\S+$/.test(email)) {

                showMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                emailInput.focus();

                return;
            }


            // Mobile validation

            if (!/^\d{10}$/.test(mobile)) {

                showMessage(
                    "Please enter a valid 10-digit mobile number.",
                    "error"
                );

                mobileInput.focus();

                return;
            }


            // Password validation

            if (!password) {

                showMessage(
                    "Please enter a password.",
                    "error"
                );

                passwordInput.focus();

                return;
            }


            if (password.length < 6) {

                showMessage(
                    "Password must contain at least 6 characters.",
                    "error"
                );

                passwordInput.focus();

                return;
            }


            // Confirm password

            if (password !== confirmPassword) {

                showMessage(
                    "Passwords do not match.",
                    "error"
                );

                confirmPasswordInput.focus();

                return;
            }


            // =================================================
            // BUTTON LOADING
            // =================================================

            registerBtn.disabled = true;

            registerBtn.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Creating Account...
            `;


            messageBox.className =
                "register-message";

            messageBox.textContent = "";


            // =================================================
            // API REQUEST
            // =================================================

            try {

                const response =
                    await fetch(
                        API + "/register",
                        {
                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Accept":
                                    "application/json"

                            },

                            body: JSON.stringify({

                                full_name:
                                    full_name,

                                email:
                                    email,

                                mobile:
                                    mobile,

                                password:
                                    password

                            })

                        }
                    );


                // =================================================
                // READ RESPONSE
                // =================================================

                const contentType =
                    response.headers.get(
                        "content-type"
                    ) || "";


                let data;


                if (
                    contentType.includes(
                        "application/json"
                    )
                ) {

                    data =
                        await response.json();

                }

                else {

                    data = {

                        detail:
                            await response.text()

                    };

                }


                console.log(
                    "Admin Registration Response:",
                    data
                );


                // =================================================
                // REGISTRATION FAILED
                // =================================================

                if (!response.ok) {

                    let errorMessage =
                        "Registration failed.";


                    // FastAPI validation error

                    if (
                        Array.isArray(
                            data.detail
                        )
                    ) {

                        errorMessage =
                            data.detail
                                .map(
                                    item =>
                                        item.msg ||
                                        "Validation error"
                                )
                                .join(", ");

                    }

                    else if (
                        data.detail
                    ) {

                        errorMessage =
                            data.detail;

                    }

                    else if (
                        data.message
                    ) {

                        errorMessage =
                            data.message;

                    }


                    showMessage(
                        errorMessage,
                        "error"
                    );


                    return;
                }


                // =================================================
                // REGISTRATION SUCCESS
                // =================================================

                showMessage(
                    "✓ Registration successful! Redirecting to Admin Login...",
                    "success"
                );


                // Change button

                registerBtn.innerHTML = `
                    <i class="fa-solid fa-circle-check"></i>
                    Registration Successful
                `;


                // Disable button

                registerBtn.disabled = true;


                // Clear password fields

                passwordInput.value = "";

                confirmPasswordInput.value = "";


                // =================================================
                // REDIRECT TO ADMIN LOGIN
                // =================================================

                setTimeout(
                    function () {

                        window.location.href =
                            "admin_login.html";

                    },
                    1500
                );


            }

            // =================================================
            // SERVER CONNECTION ERROR
            // =================================================

            catch (error) {

                console.error(
                    "Admin Registration Error:",
                    error
                );


                showMessage(
                    "Unable to connect to the server. Please make sure the backend is running.",
                    "error"
                );


            }

            // =================================================
            // RESET BUTTON AFTER ERROR
            // =================================================

            finally {

                // Only reset if registration
                // was NOT successful

                if (
                    !messageBox.classList.contains(
                        "success"
                    )
                ) {

                    registerBtn.disabled =
                        false;

                    registerBtn.innerHTML = `
                        <i class="fa-solid fa-user-plus"></i>
                        Create Admin Account
                    `;

                }

            }

        }
    );

}