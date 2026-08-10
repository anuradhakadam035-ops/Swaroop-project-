// ==========================================
// AI Career Guidance System
// Course Recommendation
// ==========================================

const API = "http://127.0.0.1:8000/api/courses";

const TOKEN = localStorage.getItem("token");
const USER = JSON.parse(localStorage.getItem("user"));

if (!TOKEN || !USER) {

    window.location.href = "login.html";

}

// ==========================================
// LOAD COURSES
// ==========================================

loadCourses();

async function loadCourses() {

    try {

        // Later replace with career from Report API
        const career = "AI Engineer";

        const response = await fetch(

            API + "/" + encodeURIComponent(career),

            {

                method: "GET",

                headers: {

                    Authorization:
                        "Bearer " + TOKEN

                }

            }

        );

        if (!response.ok) {

            throw new Error("Unable to fetch courses.");

        }

        const courses = await response.json();

        console.log(courses);

        document.getElementById("courseCount").innerHTML =
            courses.length;

        displayCourses(courses);

        setupSearch(courses);

    }

    catch (err) {

        console.error(err);

        document.getElementById("courses").innerHTML = `

        <div class="col-12">

            <div class="alert alert-danger">

                Unable to load courses.

            </div>

        </div>

        `;

    }

}

// ==========================================
// DISPLAY COURSES
// ==========================================

function displayCourses(courses) {

    let html = "";

    courses.forEach(course => {

        let skills = "";

        course.skills.forEach(skill => {

            skills += `

            <span>

                ${skill}

            </span>

            `;

        });

        html += `

        <div class="col-lg-6 col-xl-4 mb-4">

            <div class="course-card">

                <div class="featured">

                    AI PICK

                </div>

                <div class="shine"></div>

                <div class="provider">

                    <div class="provider-info">

                        <div class="provider-logo">

                            <i class="fas fa-graduation-cap"></i>

                        </div>

                        <div>

                            <div class="provider-name">

                                ${course.provider}

                            </div>

                            <div class="course-title">

                                ${course.title}

                            </div>

                        </div>

                    </div>

                    <div class="rating">

                        ⭐ ${course.rating}

                    </div>

                </div>

                <div class="course-details">

                    <div class="detail">

                        <i class="fas fa-clock"></i>

                        <span class="duration">

                            ${course.duration}

                        </span>

                    </div>

                    <div class="detail">

                        <i class="fas fa-layer-group"></i>

                        <span class="level">

                            ${course.level}

                        </span>

                    </div>

                    <div class="detail">

                        <i class="fas fa-award"></i>

                        <span>

                            Certificate

                        </span>

                    </div>

                    <div class="detail">

                        <i class="fas fa-globe"></i>

                        <span>

                            Online

                        </span>

                    </div>

                </div>

                <div class="chips">

                    ${skills}

                </div>

                <div class="ai-box">

                    <h6>

                        🤖 AI Recommendation

                    </h6>

                    <p>

                        Recommended because it helps improve your
                        ${course.skills[0]} skills and prepares you
                        for an ${course.title} career path.

                    </p>

                </div>

                <div class="course-level">

                    ⭐ ${course.level}

                </div>

                <div class="course-actions">

                    <a

                        href="${course.link}"

                        target="_blank"

                        class="learn-btn"

                    >

                        <i class="fas fa-play-circle"></i>

                        Start Learning

                    </a>

                    <button

                        class="save-btn"

                        onclick="saveCourse('${course.title}')"

                    >

                        <i class="far fa-heart"></i>

                    </button>

                </div>

            </div>

        </div>

        `;

    });

    document.getElementById("courses").innerHTML = html;

}

// ==========================================
// SEARCH
// ==========================================

function setupSearch(courses) {

    const search = document.getElementById("searchCourse");

    if (!search) return;

    search.addEventListener("keyup", () => {

        const keyword =
            search.value.toLowerCase();

        const filtered = courses.filter(course =>

            course.title.toLowerCase().includes(keyword) ||

            course.provider.toLowerCase().includes(keyword) ||

            course.level.toLowerCase().includes(keyword)

        );

        displayCourses(filtered);

    });

}

// ==========================================
// SAVE COURSE
// ==========================================

function saveCourse(title) {

    alert(title + " saved successfully!");

}

// ==========================================
// FUTURE
// ==========================================

// Later:
//
// Save bookmarks in MySQL
//
// Fetch personalized career from Report API
//
// Use Gemini AI recommendation