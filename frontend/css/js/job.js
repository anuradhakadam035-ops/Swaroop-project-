// ==========================================
// AI Career Guidance System
// Job Recommendation
// ==========================================

const API = "http://127.0.0.1:8000/api/jobs";

const TOKEN = localStorage.getItem("token");
const USER = JSON.parse(localStorage.getItem("user"));

if (!TOKEN || !USER) {
    window.location.href = "login.html";
}

// Load Jobs
loadJobs();

// ==========================================
// Load Jobs
// ==========================================

async function loadJobs() {

    try {

        // You can replace this with career from report API later
        const career = "AI Engineer";

        const response = await fetch(

            API + "/" + encodeURIComponent(career),

            {

                method: "GET",

                headers: {

                    Authorization: "Bearer " + TOKEN

                }

            }

        );

        if (!response.ok) {

            throw new Error("Unable to fetch jobs");

        }

        const jobs = await response.json();

        console.log(jobs);

        displayJobs(jobs);

        // Search Function
        const search = document.getElementById("searchJob");

        if (search) {

            search.addEventListener("keyup", function () {

                const keyword = this.value.toLowerCase();

                const filtered = jobs.filter(job =>

                    job.title.toLowerCase().includes(keyword) ||

                    job.company.toLowerCase().includes(keyword) ||

                    job.location.toLowerCase().includes(keyword)

                );

                displayJobs(filtered);

            });

        }

    }

    catch (err) {

        console.error(err);

        document.getElementById("jobs").innerHTML = `

        <div class="col-12">

            <div class="alert alert-danger">

                Unable to load job recommendations.

            </div>

        </div>

        `;

    }

}

// ==========================================
// Display Jobs
// ==========================================

function displayJobs(jobs) {

    let html = "";

    jobs.forEach(job => {

        let skills = "";

        job.skills.forEach(skill => {

            skills += `<span>${skill}</span>`;

        });

        html += `

        <div class="col-lg-6 col-xl-4 mb-4">

            <div class="job-card">

                <div class="featured">

                    AI MATCH

                </div>

                <div class="shine"></div>

                <div class="company">

                    <div class="company-info">

                        <div class="company-logo">

                            <i class="fas fa-building"></i>

                        </div>

                        <div>

                            <div class="company-name">

                                ${job.company}

                            </div>

                            <div class="job-role">

                                ${job.title}

                            </div>

                        </div>

                    </div>

                    <div class="rating">

                        ⭐ 4.9

                    </div>

                </div>

                <div class="job-details">

                    <div class="detail">

                        <i class="fas fa-location-dot"></i>

                        <span>${job.location}</span>

                    </div>

                    <div class="detail">

                        <i class="fas fa-briefcase"></i>

                        <span class="experience">

                            ${job.experience}

                        </span>

                    </div>

                    <div class="detail">

                        <i class="fas fa-money-bill-wave"></i>

                        <span class="salary">

                            ${job.salary}

                        </span>

                    </div>

                    <div class="detail">

                        <i class="fas fa-laptop-code"></i>

                        <span>

                            Hybrid

                        </span>

                    </div>

                </div>

                <div class="job-divider"></div>

                <div class="chips">

                    ${skills}

                </div>

                <div class="job-type">

                    Full Time

                </div>

                <div class="job-actions">

                    <a

                        href="${job.link}"

                        target="_blank"

                        class="apply-btn"

                    >

                        <i class="fas fa-paper-plane"></i>

                        Apply Now

                    </a>

                    <button

                        class="save-btn"

                        onclick="saveJob('${job.title}')"

                    >

                        <i class="far fa-heart"></i>

                    </button>

                </div>

            </div>

        </div>

        `;

    });

    document.getElementById("jobs").innerHTML = html;

}

// ==========================================
// Save Job
// ==========================================

function saveJob(title) {

    alert(title + " saved successfully!");

}

// ==========================================
// Future Feature
// ==========================================

// Later you can replace

// const career = "AI Engineer";

// with

// const report = await fetch("/api/report/" + USER.id)

// const career = report.recommendation.career;s