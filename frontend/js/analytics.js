const API = "http://127.0.0.1:8000/api/analytics";

loadAnalytics();

async function loadAnalytics() {

    try {

        const response = await fetch(API + "/");

        const data = await response.json();

        // Dashboard Cards
        document.getElementById("resumeScore").innerText = data.resume_score + "%";
        document.getElementById("atsScore").innerText = data.ats_score + "%";
        document.getElementById("interviewScore").innerText = data.interview_score + "%";
        document.getElementById("careerMatch").innerText = data.career_match + "%";

        // Charts
        createSkillChart(data.skills);
        createProgressChart(data);
        createCareerChart(data);

    } catch (err) {

        console.error(err);

        alert("Unable to load analytics.");

    }

}
window.onload = () => {

    document.getElementById("loader").style.display = "none";

}

// =======================================
// Skill Radar Chart
// =======================================

function createSkillChart(skills) {

    new Chart(

        document.getElementById("skillChart"),

        {

            type: "radar",

            data: {

                labels: Object.keys(skills),

                datasets: [

                    {

                        label: "Skills",

                        data: Object.values(skills),

                        backgroundColor: "rgba(37,99,235,.2)",

                        borderColor: "#38BDF8",

                        pointBackgroundColor: "#38BDF8",

                        borderWidth: 3

                    }

                ]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        labels: {

                            color: "white"

                        }

                    }

                },

                scales: {

                    r: {

                        ticks: {

                            color: "white"

                        },

                        pointLabels: {

                            color: "white"

                        },

                        grid: {

                            color: "#334155"

                        }

                    }

                }

            }

        }

    );

}

// =======================================
// Progress Chart
// =======================================

function createProgressChart(data) {

    new Chart(

        document.getElementById("progressChart"),

        {

            type: "bar",

            data: {

                labels: [

                    "Resume",

                    "ATS",

                    "Interview"

                ],

                datasets: [

                    {

                        data: [

                            data.resume_score,

                            data.ats_score,

                            data.interview_score

                        ],

                        backgroundColor: [

                            "#2563EB",

                            "#06B6D4",

                            "#10B981"

                        ]

                    }

                ]

            },

            options: {

                plugins: {

                    legend: {

                        display: false

                    }

                },

                scales: {

                    y: {

                        beginAtZero: true,

                        max: 100,

                        ticks: {

                            color: "white"

                        },

                        grid: {

                            color: "#334155"

                        }

                    },

                    x: {

                        ticks: {

                            color: "white"

                        }

                    }

                }

            }

        }

    );

}
function animateValue(id, start, end, duration) {

    let current = start;

    const increment = end > start ? 1 : -1;

    const stepTime = Math.abs(Math.floor(duration / (end - start)));

    const obj = document.getElementById(id);

    const timer = setInterval(() => {

        current += increment;

        obj.innerHTML = current + "%";

        if (current == end) {

            clearInterval(timer);

        }

    }, stepTime);

}

// =======================================
// Career Match Doughnut
// =======================================

function createCareerChart(data) {

    new Chart(

        document.getElementById("careerChart"),

        {

            type: "doughnut",

            data: {

                labels: [

                    "Career Match",

                    "Remaining"

                ],

                datasets: [

                    {

                        data: [

                            data.career_match,

                            100 - data.career_match

                        ],

                        backgroundColor: [

                            "#38BDF8",

                            "#1E293B"

                        ]

                    }

                ]

            },

            options: {

                plugins: {

                    legend: {

                        labels: {

                            color: "white"

                        }

                    }

                }

            }

        }

    );

}