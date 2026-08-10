// ==========================================
// VisionX API Configuration
// ==========================================

const BASE_URL = "http://127.0.0.1:8000/api";

function getToken() {

    return localStorage.getItem("token");

}

async function apiGet(endpoint) {

    const response = await fetch(

        BASE_URL + endpoint,

        {

            headers: {

                "Authorization": "Bearer " + getToken()

            }

        }

    );

    if (!response.ok) {

        throw new Error("API Error");

    }

    return response.json();

}

async function apiPost(endpoint, data) {

    const response = await fetch(

        BASE_URL + endpoint,

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                "Authorization": "Bearer " + getToken()

            },

            body: JSON.stringify(data)

        }

    );

    if (!response.ok) {

        throw new Error("API Error");

    }

    return response.json();

}
async function apiUpload(endpoint, formData) {

    const response = await fetch(

        BASE_URL + endpoint,

        {

            method: "POST",

            headers: {

                "Authorization": "Bearer " + getToken()

            },

            body: formData

        }

    );

    if (!response.ok) {

        throw new Error("Upload Failed");

    }

    return await response.json();

}



function showLoader() {

    document.getElementById("loadingSection").style.display = "block";

}

function hideLoader() {

    document.getElementById("loadingSection").style.display = "none";

}