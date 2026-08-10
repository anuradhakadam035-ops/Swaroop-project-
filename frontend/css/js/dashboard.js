/* ==========================================
   AI Career Guidance Dashboard
========================================== */

const API = "http://127.0.0.1:8000/api/dashboard";

const TOKEN = getToken();

if (!TOKEN) {
    window.location.href = "login.html";
}

/* ==========================================
   Load Dashboard
========================================== */

document.addEventListener("DOMContentLoaded", loadDashboard);

async function loadDashboard() {

    try {

        const data = await apiGet("/dashboard/");

        document.getElementById("studentName").innerText = data.name;

        document.getElementById("resumeScore").innerText = data.resume_score + "%";

        document.getElementById("assessmentScore").innerText = data.assessment_score + "%";

        document.getElementById("career").innerText = data.career;

        document.getElementById("progress").innerText = data.progress + "%";

        document.getElementById("skills").innerText = data.skills;

    }

    catch (error) {

        console.error(error);

    }

}/* ==========================================
   Logout
========================================== */

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "login.html";

}

/* ==========================================
   Load Automatically
========================================== */

window.onload = loadDashboard;

