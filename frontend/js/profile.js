const API = "http://127.0.0.1:8000/api/profile";

const TOKEN = localStorage.getItem("token");

if (!TOKEN) {

    window.location.href = "login.html";

}

// ==============================
// Load Profile
// ==============================

async function loadProfile() {

    try {

        const response = await fetch(

            API + "/",

            {

                headers: {

                    Authorization:

                        "Bearer " + TOKEN

                }

            }

        );

        const data = await response.json();

        console.log(data);

        document.getElementById("fullName").value =
            data.full_name;

        document.getElementById("email").value =
            data.email;

        document.getElementById("mobile").value =
            data.mobile;

        document.getElementById("college").value =
            data.college;

        document.getElementById("branch").value =
            data.branch;

        document.getElementById("year").value =
            data.year;

        document.getElementById("skills").value =
            data.skills || "";

        document.getElementById("interests").value =
            data.interests || "";

        if (data.profile_photo) {

            document

                .getElementById("profilePhoto")

                .src = "http://127.0.0.1:8000/" + data.profile_photo;

        }

    }

    catch (err) {

        console.error(err);

        alert("Unable to load profile");

    }

}

// ==============================
// Save
// ==============================

document
    .getElementById("saveBtn")
    .addEventListener("click", updateProfile);

async function updateProfile() {

    const profile = {

        full_name:
            document.getElementById("fullName").value,

        mobile:
            document.getElementById("mobile").value,

        college:
            document.getElementById("college").value,

        branch:
            document.getElementById("branch").value,

        year:
            document.getElementById("year").value,

        skills:
            document.getElementById("skills").value,

        interests:
            document.getElementById("interests").value

    };

    const response = await fetch(

        API + "/",

        {

            method: "PUT",

            headers: {

                "Content-Type":
                    "application/json",

                Authorization:
                    "Bearer " + TOKEN

            },

            body: JSON.stringify(profile)

        }

    );

    const result = await response.json();

    alert(result.message);

}

loadProfile();

document

    .getElementById("photoInput")

    .addEventListener(

        "change",

        uploadPhoto

    );

async function uploadPhoto() {

    const file =

        document

            .getElementById("photoInput")

            .files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(

        API + "/upload-photo",

        {

            method: "POST",

            headers: {

                Authorization:

                    "Bearer " + TOKEN

            },

            body: formData

        }

    );

    const data = await response.json();

    if (data.success) {

        document

            .getElementById("profilePhoto")

            .src = data.photo;

        alert("Photo Uploaded Successfully");

    }

}