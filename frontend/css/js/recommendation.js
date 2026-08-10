// =========================================================
// AI CAREER GUIDANCE
// DYNAMIC CAREER RECOMMENDATION
// =========================================================

const API = "http://127.0.0.1:8000/api/assessment";

const TOKEN = localStorage.getItem("token");


// =========================================================
// AUTHENTICATION
// =========================================================

if (!TOKEN) {
    window.location.href = "login.html";
}


// =========================================================
// CAREER INFORMATION
// =========================================================

const careerData = {

    "AI Engineer": {

        salary: "₹6–18 LPA",

        growth: "Very High",

        courses: [
            "Python for AI",
            "Machine Learning",
            "Deep Learning",
            "TensorFlow / PyTorch",
            "Generative AI",
            "Computer Vision"
        ]

    },


    "Software Developer": {

        salary: "₹4–15 LPA",

        growth: "Very High",

        courses: [
            "Programming Fundamentals",
            "Data Structures & Algorithms",
            "Java / Python",
            "Web Development",
            "REST APIs",
            "Git & GitHub"
        ]

    },


    "Cyber Security Engineer": {

        salary: "₹5–16 LPA",

        growth: "Very High",

        courses: [
            "Network Security",
            "Ethical Hacking",
            "Linux",
            "Web Application Security",
            "Digital Forensics",
            "Penetration Testing"
        ]

    },


    "Network Engineer": {

        salary: "₹4–12 LPA",

        growth: "High",

        courses: [
            "Computer Networks",
            "CCNA",
            "Routing & Switching",
            "Network Security",
            "Firewalls",
            "Cloud Networking"
        ]

    },


    "Database Administrator": {

        salary: "₹4–14 LPA",

        growth: "High",

        courses: [
            "SQL",
            "MySQL",
            "PostgreSQL",
            "Database Administration",
            "Database Security",
            "Backup & Recovery"
        ]

    },


    "Data Scientist": {

        salary: "₹6–20 LPA",

        growth: "Very High",

        courses: [
            "Python",
            "Statistics",
            "Machine Learning",
            "Data Visualization",
            "Pandas & NumPy",
            "Deep Learning"
        ]

    },


    "Cloud Engineer": {

        salary: "₹5–18 LPA",

        growth: "Very High",

        courses: [
            "Cloud Computing",
            "AWS",
            "Microsoft Azure",
            "Google Cloud",
            "Docker",
            "Kubernetes"
        ]

    },


    "DevOps Engineer": {

        salary: "₹5–18 LPA",

        growth: "Very High",

        courses: [
            "Linux",
            "Git & GitHub",
            "Docker",
            "Kubernetes",
            "CI/CD",
            "AWS / Azure"
        ]

    }

};


// =========================================================
// NORMALIZE CAREER NAME
// =========================================================

function normalizeCareer(career) {

    if (!career) {
        return "Software Developer";
    }

    const value =
        career.toLowerCase().trim();


    if (
        value.includes("ai") ||
        value.includes("artificial intelligence") ||
        value.includes("machine learning")
    ) {

        return "AI Engineer";

    }


    if (
        value.includes("cyber") ||
        value.includes("security") ||
        value.includes("ethical hacking")
    ) {

        return "Cyber Security Engineer";

    }


    if (
        value.includes("network")
    ) {

        return "Network Engineer";

    }


    if (
        value.includes("database") ||
        value.includes("dba")
    ) {

        return "Database Administrator";

    }


    if (
        value.includes("data scientist") ||
        value.includes("data science")
    ) {

        return "Data Scientist";

    }


    if (
        value.includes("cloud")
    ) {

        return "Cloud Engineer";

    }


    if (
        value.includes("devops")
    ) {

        return "DevOps Engineer";

    }


    if (
        value.includes("software") ||
        value.includes("developer") ||
        value.includes("programming")
    ) {

        return "Software Developer";

    }


    return career;

}


// =========================================================
// LOAD RECOMMENDATION
// =========================================================

async function loadRecommendation() {

    try {

        console.log(
            "Loading latest assessment result..."
        );


        const response =
            await fetch(

                API + "/result",

                {

                    method: "GET",

                    headers: {

                        "Accept":
                            "application/json",

                        "Authorization":
                            "Bearer " + TOKEN

                    }

                }

            );


        const data =
            await response.json();


        console.log(
            "Assessment Result:",
            data
        );


        // =================================================
        // ERROR
        // =================================================

        if (!response.ok) {

            if (
                response.status === 404
            ) {

                showNoAssessment();

                return;

            }


            throw new Error(
                data.detail ||
                "Unable to load assessment result."
            );

        }


        // =================================================
        // CAREER
        // =================================================

        const career =
            normalizeCareer(
                data.career
            );


        const careerInfo =
            careerData[career];


        // =================================================
        // DISPLAY CAREER
        // =================================================

        document.getElementById(
            "career"
        ).innerText =
            career;


        // =================================================
        // MATCH
        // =================================================

        const match =
            data.career_match ??
            data.score ??
            0;


        document.getElementById(
            "match"
        ).innerText =
            match + "%";


        // =================================================
        // SALARY
        // =================================================

        document.getElementById(
            "salary"
        ).innerText =

            careerInfo
                ? careerInfo.salary
                : "-";


        // =================================================
        // GROWTH
        // =================================================

        document.getElementById(
            "growth"
        ).innerText =

            careerInfo
                ? careerInfo.growth
                : "-";


        // =================================================
        // STRENGTHS
        // =================================================

        renderList(
            "strengths",
            data.strengths || [],
            "badge-item"
        );


        // =================================================
        // SKILL GAP
        // =================================================

        renderList(
            "skillGap",
            data.skill_gap || [],
            "badge-item badge-danger"
        );


        // =================================================
        // COURSES
        // =================================================

        const courses =
            careerInfo
                ? careerInfo.courses
                : [];


        renderList(
            "courses",
            courses,
            "badge-item badge-course"
        );


        // =================================================
        // ROADMAP
        // =================================================

        renderRoadmap(
            data.roadmap || []
        );


        console.log(
            "Career recommendation loaded:",
            career
        );

    }

    catch (error) {

        console.error(
            "Recommendation Error:",
            error
        );


        alert(
            "Unable to load career recommendation.\n\n" +
            error.message
        );

    }

}


// =========================================================
// RENDER LIST
// =========================================================

function renderList(
    elementId,
    items,
    className
) {

    const container =
        document.getElementById(
            elementId
        );


    container.innerHTML = "";


    if (
        !items ||
        items.length === 0
    ) {

        container.innerHTML =

            `<span class="${className}">
                No information available
            </span>`;

        return;

    }


    items.forEach(
        item => {

            const span =
                document.createElement(
                    "span"
                );


            span.className =
                className;


            span.textContent =
                item;


            container.appendChild(
                span
            );

        }
    );

}


// =========================================================
// ROADMAP
// =========================================================

function renderRoadmap(
    roadmap
) {

    const container =
        document.getElementById(
            "roadmap"
        );


    container.innerHTML = "";


    if (
        !roadmap ||
        roadmap.length === 0
    ) {

        const li =
            document.createElement(
                "li"
            );


        li.textContent =
            "Complete your assessment to generate your career roadmap.";


        container.appendChild(
            li
        );


        return;

    }


    roadmap.forEach(
        step => {

            const li =
                document.createElement(
                    "li"
                );


            li.textContent =
                step;


            container.appendChild(
                li
            );

        }
    );

}


// =========================================================
// NO ASSESSMENT
// =========================================================

function showNoAssessment() {

    document.getElementById(
        "career"
    ).innerText =
        "Not Available";


    document.getElementById(
        "match"
    ).innerText =
        "0%";


    document.getElementById(
        "salary"
    ).innerText =
        "-";


    document.getElementById(
        "growth"
    ).innerText =
        "-";


    document.getElementById(
        "strengths"
    ).innerHTML =

        `<span class="badge-item">
            Complete your assessment first
        </span>`;


    document.getElementById(
        "skillGap"
    ).innerHTML = "";


    document.getElementById(
        "courses"
    ).innerHTML = "";


    document.getElementById(
        "roadmap"
    ).innerHTML =

        `<li>
            Your personalized roadmap will appear here after completing the assessment.
        </li>`;

}


// =========================================================
// START
// =========================================================

window.addEventListener(
    "DOMContentLoaded",
    loadRecommendation
);