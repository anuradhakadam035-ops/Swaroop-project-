/* ==========================================
   AI Career Guidance
   Career Dashboard
========================================== */

const USER = JSON.parse(

    localStorage.getItem("user")

);

if (!USER) {

    window.location.href = "login.html";

}

const USER_ID = USER.id;

const TOKEN = localStorage.getItem("token");

const API = "http://127.0.0.1:8000/api/recommendation";


/* ==========================================
   Load Recommendation
========================================== */

async function loadCareer() {

    try {

        const response = await fetch(
            API + "/" + USER_ID,
            {
                headers: {
                    "Authorization": "Bearer " + TOKEN
                }
            }
        );
        if (!response.ok) {

            throw new Error("Unable to load recommendation");

        }

        const data = await response.json();

        // ==========================
        // Top Cards
        // ==========================

        document.getElementById("careerName").innerHTML =
            data.career;

        document.getElementById("careerMatch").innerHTML =
            data.match + "%";

        document.getElementById("assessmentScore").innerHTML =
            data.assessment_score;

        document.getElementById("salary").innerHTML =
            data.salary;

        document.getElementById("growth").innerHTML =
            data.growth;

        document.getElementById("demand").innerHTML =
            "⭐".repeat(data.demand);

        // ==========================
        // Strengths
        // ==========================

        const strengthList =
            document.getElementById("strengthList");

        strengthList.innerHTML = "";

        data.strengths.forEach(skill => {

            strengthList.innerHTML +=

                `<li>✅ ${skill}</li>`;

        });

        // ==========================
        // Skill Gap
        // ==========================

        const gapList =
            document.getElementById("gapList");

        gapList.innerHTML = "";

        data.skill_gap.forEach(skill => {

            gapList.innerHTML +=

                `<li>❌ ${skill}</li>`;

        });

        // ==========================
        // Courses
        // ==========================

        const courseList =
            document.getElementById("courseList");

        courseList.innerHTML = "";

        data.courses.forEach(course => {

            courseList.innerHTML +=

                `<li>${course}</li>`;

        });

        // ==========================
        // Roadmap
        // ==========================

        const roadmap =
            document.getElementById("roadmapList");

        roadmap.innerHTML = "";

        data.roadmap.forEach(step => {

            roadmap.innerHTML +=

                `<li>${step}</li>`;

        });

        // ==========================
        // Career Comparison
        // ==========================

        const bars =
            document.getElementById("careerBars");

        bars.innerHTML = "";

        for (const career in data.all_scores) {

            bars.innerHTML += `

<div class="progress-item">

<label>

<span>${career}</span>

<span>${data.all_scores[career]}%</span>

</label>

<div class="progress">

<div
class="progress-bar"
style="width:${data.all_scores[career]}%">

</div>

</div>

</div>

`;

        }

    }

    catch (err) {

        console.error(err);

        alert("Unable to load career recommendation.");

    }

}

/* ==========================================
   Load
========================================== */

window.onload = loadCareer;