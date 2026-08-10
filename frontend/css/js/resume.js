// ==========================================
// AI Resume Analyzer
// ==========================================

const API = "http://127.0.0.1:8000/api/resume";

const TOKEN = localStorage.getItem("token");

if (!TOKEN) {
    window.location.href = "login.html";
}

// =============================
// Elements
// =============================

const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("resumeFile");

const loadingSection = document.getElementById("loadingSection");
const resultSection = document.getElementById("resultSection");

// =============================
// Upload
// =============================

uploadBtn.addEventListener("click", uploadResume);

async function uploadResume() {

    const file = fileInput.files[0];

    if (!file) {

        alert("Please select a Resume.");

        return;

    }

    const formData = new FormData();

    formData.append("file", file);

    loadingSection.style.display = "block";

    resultSection.style.display = "none";

    uploadBtn.disabled = true;

    uploadBtn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';

    try {

        const response = await fetch(API + "/upload", {

            method: "POST",

            headers: {

                Authorization: "Bearer " + TOKEN

            },

            body: formData

        });

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.detail || "Upload Failed");

        }

        loadingSection.style.display = "none";

        resultSection.style.display = "block";

        displayAnalysis(data.analysis);

    }

    catch (err) {

        loadingSection.style.display = "none";

        alert(err.message);

    }

    finally {

        uploadBtn.disabled = false;

        uploadBtn.innerHTML =
            '<i class="fa-solid fa-wand-magic-sparkles"></i> Analyze Resume';

    }

}

// =============================
// Display Result
// =============================

function displayAnalysis(analysis) {

    animateScore(
        "resumeScore",
        analysis.resume_score
    );

    animateScore(
        "atsScore",
        analysis.ats_score
    );

    createChips(
        "skills",
        analysis.skills || []
    );

    createChips(
        "missingSkills",
        analysis.missing_skills || []
    );

    createList(
        "projects",
        analysis.projects || []
    );

    createList(
        "courses",
        analysis.courses || []
    );

    document.getElementById("summary").innerHTML =
        analysis.summary;
    let grade = "F";

    if (analysis.resume_score >= 90)
        grade = "A+";

    else if (analysis.resume_score >= 80)
        grade = "A";

    else if (analysis.resume_score >= 70)
        grade = "B";

    else if (analysis.resume_score >= 60)
        grade = "C";

    document.getElementById("resumeGrade").innerHTML = grade;

}

// =============================
// Animated Score
// =============================

function animateScore(id, value) {

    let current = 0;

    const element = document.getElementById(id);

    const timer = setInterval(() => {

        current++;

        element.innerHTML = current + "%";

        if (current >= value) {

            clearInterval(timer);

        }

    }, 15);

}

// =============================
// Chips
// =============================

function createChips(id, items) {

    const container = document.getElementById(id);

    container.innerHTML = "";

    items.forEach(item => {

        const span = document.createElement("span");

        span.innerHTML = item;

        container.appendChild(span);

    });

}

// =============================
// List
// =============================

function createList(id, items) {

    const container = document.getElementById(id);

    container.innerHTML = "";

    items.forEach(item => {

        const li = document.createElement("li");

        li.innerHTML =
            `<i class="fa-solid fa-circle-check text-success"></i> ${item}`;

        container.appendChild(li);

    });

}

// =============================
// Drag & Drop
// =============================

fileInput.addEventListener("dragover", e => {

    e.preventDefault();

});

fileInput.addEventListener("drop", e => {

    e.preventDefault();

    fileInput.files = e.dataTransfer.files;

});