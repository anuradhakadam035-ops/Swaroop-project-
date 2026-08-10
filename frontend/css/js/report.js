const API = "http://127.0.0.1:8000/api/report";

const TOKEN = localStorage.getItem("token");

const USER = JSON.parse(localStorage.getItem("user"));

if (!TOKEN || !USER) {

    window.location.href = "login.html";

}

loadReport();

async function loadReport() {

    try {

        const response = await fetch(

            API + "/" + USER.id,

            {

                headers: {

                    Authorization: "Bearer " + TOKEN

                }

            }

        );

        const data = await response.json();

        console.log(data);

        // ======================
        // Profile
        // ======================

        document.getElementById("studentName").innerHTML =
            data.student.full_name;

        document.getElementById("studentCareer").innerHTML =
            data.recommendation.career;

        if (data.student.profile_photo) {

            document.getElementById("profilePhoto").src =
                "http://127.0.0.1:8000/" + data.student.profile_photo;

        }

        // ======================
        // Scores
        // ======================

        animateScore("overallScore", data.analytics.overall_score);

        animateScore("resumeScore", data.resume.resume_score);

        animateScore("atsScore", data.resume.ats_score);

        animateScore("interviewScore", data.interview.score);

        animateScore("careerScore", data.recommendation.match_percentage);

        // ======================
        // Recommendation
        // ======================

        document.getElementById("careerName").innerHTML =
            data.recommendation.career;

        document.getElementById("careerReason").innerHTML =
            data.recommendation.reason;

        // ======================
        // Skills
        // ======================

        let skills = "";

        data.resume.skills.forEach(skill => {

            skills += `<span>${skill}</span>`;

        });

        document.getElementById("skills").innerHTML = skills;

        // ======================
        // Missing Skills
        // ======================

        let missing = "";

        data.resume.missing_skills.forEach(skill => {

            missing += `<span>${skill}</span>`;

        });

        document.getElementById("missingSkills").innerHTML = missing;

        // ======================
        // Interview
        // ======================

        document.getElementById("interviewFeedback").innerHTML =
            data.interview.feedback;

        // ======================
        // Roadmap
        // ======================

        let roadmap = "";

        data.roadmap.forEach(item => {

            roadmap += `

            <div class="timeline-item">

                <h5>${item.month}</h5>

                <p>${item.topic}</p>

            </div>

            `;

        });

        document.getElementById("roadmap").innerHTML = roadmap;

    }

    catch (err) {

        console.log(err);

        alert("Unable to load report.");

    }

}

// ======================
// Animated Counter
// ======================

function animateScore(id, value) {

    let start = 0;

    const obj = document.getElementById(id);

    const timer = setInterval(() => {

        start++;

        obj.innerHTML = start + "%";

        if (start >= value) {

            clearInterval(timer);

        }

    }, 15);

}

// ======================
// Download PDF
// ======================

document

    .getElementById("downloadBtn")

    .addEventListener("click", () => {

        const report = document.getElementById("report");

        html2pdf()

            .set({

                margin: 0.5,

                filename: "AI_Career_Report.pdf",

                image: { type: "jpeg", quality: .98 },

                html2canvas: { scale: 2 },

                jsPDF: { unit: "in", format: "a4" }

            })

            .from(report)

            .save();

    });