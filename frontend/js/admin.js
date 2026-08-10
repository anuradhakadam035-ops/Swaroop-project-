const API_BASE =
    "http://127.0.0.1:8000/api/admin/dashboard";


// =========================================================
// API HELPER
// =========================================================

async function fetchDashboardAPI(endpoint) {

    const token =
        localStorage.getItem("adminToken");


    if (!token) {

        window.location.href =
            "admin_login.html";

        return null;
    }


    const response = await fetch(
        `${API_BASE}/${endpoint}`,
        {
            method: "GET",

            headers: {
                "Authorization":
                    `Bearer ${token}`,

                "Accept":
                    "application/json"
            }
        }
    );


    if (!response.ok) {

        throw new Error(
            `${endpoint} failed: ${response.status}`
        );
    }


    return await response.json();
}


// =========================================================
// TOP CARDS
// =========================================================

async function loadStats() {

    const data =
        await fetchDashboardAPI("stats");


    if (!data) return;


    const students =
        document.getElementById(
            "totalStudents"
        );

    const assessments =
        document.getElementById(
            "totalAssessments"
        );

    const reports =
        document.getElementById(
            "totalReports"
        );

    const careerMatch =
        document.getElementById(
            "careerMatch"
        );


    if (students) {

        students.textContent =
            data.total_students;
    }


    if (assessments) {

        assessments.textContent =
            data.total_assessments;
    }


    if (reports) {

        reports.textContent =
            data.ai_reports;
    }


    if (careerMatch) {

        careerMatch.textContent =
            `${data.career_match}%`;
    }
}


// =========================================================
// CAREER DISTRIBUTION
// =========================================================

async function loadCareerDistribution() {

    try {

        const data =
            await fetchDashboardAPI(
                "career-distribution"
            );

        console.log(
            "CAREER DISTRIBUTION:",
            data
        );


        const canvas =
            document.getElementById(
                "careerDistributionChart"
            );


        if (!canvas) {

            console.error(
                "#careerDistributionChart not found"
            );

            return;
        }


        if (
            !data.labels ||
            data.labels.length === 0
        ) {

            const parent =
                canvas.parentElement;

            parent.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-chart-pie"></i>
                    <br><br>
                    No assessment data available
                </div>
            `;

            return;
        }


        new Chart(
            canvas,
            {
                type: "doughnut",

                data: {

                    labels: data.labels,

                    datasets: [{
                        data: data.values,

                        backgroundColor: [
                            "#38bdf8",
                            "#6366f1",
                            "#8b5cf6",
                            "#22c55e",
                            "#f59e0b",
                            "#ec4899",
                            "#06b6d4",
                            "#ef4444"
                        ],

                        borderWidth: 0
                    }]
                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            position: "bottom",

                            labels: {
                                color: "#cbd5e1",
                                usePointStyle: true
                            }
                        }
                    }
                }
            }
        );

    } catch (error) {

        console.error(
            "Career Distribution Error:",
            error
        );

    }
}
// =========================================================
// ASSESSMENT PROGRESS
// =========================================================

async function loadAssessmentProgress() {

    const data =
        await fetchDashboardAPI(
            "assessment-progress"
        );


    if (!data) return;


    const canvas =
        document.getElementById(
            "assessmentProgressChart"
        );


    if (!canvas) return;


    new Chart(
        canvas,
        {
            type: "line",

            data: {

                labels: data.labels,

                datasets: [
                    {
                        label:
                            "Assessments",

                        data:
                            data.values,

                        borderColor:
                            "#38bdf8",

                        backgroundColor:
                            "rgba(56,189,248,0.12)",

                        borderWidth: 3,

                        fill: true,

                        tension: 0.4,

                        pointBackgroundColor:
                            "#38bdf8",

                        pointBorderColor:
                            "#ffffff",

                        pointRadius: 5
                    }
                ]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                scales: {

                    x: {

                        ticks: {
                            color: "#94a3b8"
                        },

                        grid: {
                            color:
                                "rgba(255,255,255,0.05)"
                        }
                    },

                    y: {

                        beginAtZero: true,

                        ticks: {
                            color: "#94a3b8"
                        },

                        grid: {
                            color:
                                "rgba(255,255,255,0.05)"
                        }
                    }
                },

                plugins: {

                    legend: {

                        labels: {
                            color: "#cbd5e1"
                        }
                    }
                }
            }
        }
    );
}


// =========================================================
// TOP SKILLS
// =========================================================

async function loadTopSkills() {

    try {

        const data =
            await fetchDashboardAPI("top-skills");

        console.log(
            "TOP SKILLS DATA:",
            data
        );


        const container =
            document.getElementById("topSkills");


        if (!container) {

            console.error(
                "❌ Element #topSkills not found"
            );

            return;
        }


        container.innerHTML = "";


        if (
            !data ||
            !data.labels ||
            data.labels.length === 0
        ) {

            container.innerHTML = `
                <div class="empty-state">
                    No skills data available
                </div>
            `;

            return;
        }


        const max =
            Math.max(...data.values);


        data.labels.forEach(
            (skill, index) => {

                const count =
                    data.values[index];


                const percentage =
                    max > 0
                        ? (count / max) * 100
                        : 0;


                const item =
                    document.createElement("div");


                item.className =
                    "skill-item";


                item.innerHTML = `

                    <div class="skill-info">

                        <span>${skill}</span>

                        <strong>${count}</strong>

                    </div>

                    <div class="skill-bar">

                        <div
                            class="skill-fill"
                            style="width: ${percentage}%"
                        ></div>

                    </div>

                `;


                container.appendChild(item);

            }
        );

    } catch (error) {

        console.error(
            "❌ Top Skills Error:",
            error
        );

    }
}
// =========================================================
// RECENT STUDENTS
// =========================================================

async function loadRecentStudents() {

    const students =
        await fetchDashboardAPI(
            "recent-students"
        );


    if (!students) return;


    const tbody =
        document.getElementById(
            "recentStudents"
        );


    if (!tbody) return;


    tbody.innerHTML = "";


    if (students.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    style="text-align:center;"
                >
                    No students registered yet
                </td>

            </tr>

        `;

        return;
    }


    students.forEach(
        student => {

            const tr =
                document.createElement(
                    "tr"
                );


            const statusClass =
                student.status === "Assessed"
                    ? "status-active"
                    : "status-pending";


            tr.innerHTML = `

                <td>
                    ${student.name}
                </td>

                <td>
                    ${student.branch || "-"}
                </td>

                <td>
                    ${student.career || "-"}
                </td>

                <td>

                    <span
                        class="${statusClass}"
                    >
                        ${student.status}
                    </span>

                </td>

            `;


            tbody.appendChild(tr);

        }
    );
}


// =========================================================
// LOAD EVERYTHING
// =========================================================

async function loadDashboard() {

    try {

        await Promise.all([

            loadStats(),

            loadCareerDistribution(),

            loadAssessmentProgress(),

            loadTopSkills(),

            loadRecentStudents()

        ]);

        console.log(
            "✅ Dashboard data loaded successfully"
        );

    } catch (error) {

        console.error(
            "❌ Dashboard loading error:",
            error
        );
    }
}


document.addEventListener(
    "DOMContentLoaded",
    loadDashboard
);