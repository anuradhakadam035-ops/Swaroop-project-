// =========================================================
// VISIONX ADMIN COURSES
// =========================================================

const API = "http://127.0.0.1:8000/api/admin";
const COURSE_API = API + "/courses";

// =========================================================
// ADMIN AUTH
// =========================================================

const ADMIN_TOKEN = localStorage.getItem("adminToken");

const ADMIN_DATA = JSON.parse(
    localStorage.getItem("admin") || "null"
);


// =========================================================
// AUTH CHECK
// =========================================================

if (!ADMIN_TOKEN) {

    window.location.href = "admin_log.html";

}


// =========================================================
// STATE
// =========================================================

let allCourses = [];
let filteredCourses = [];

let currentPage = 1;

const rowsPerPage = 8;


// =========================================================
// ELEMENTS
// =========================================================

const courseTable =
    document.getElementById("courseTable");

const searchCourse =
    document.getElementById("searchCourse");

const courseCount =
    document.getElementById("courseCount");

const courseLinkCount =
    document.getElementById("courseLinkCount");

const pageInfo =
    document.getElementById("pageInfo");

const prevBtn =
    document.getElementById("prevBtn");

const nextBtn =
    document.getElementById("nextBtn");

const courseForm =
    document.getElementById("courseForm");

const addCourseBtn =
    document.getElementById("addCourseBtn");

const saveCourseBtn =
    document.getElementById("saveCourseBtn");


// =========================================================
// DOM READY
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadAdminDetails();

        loadCourses();

        setupSearch();

        setupPagination();

        setupCourseForm();

        setupAddCourse();

        setupLogout();

    }
);


// =========================================================
// AUTH HEADERS
// =========================================================

function getAuthHeaders() {

    return {

        "Accept": "application/json",

        "Content-Type": "application/json",

        "Authorization":
            "Bearer " + ADMIN_TOKEN

    };

}


// =========================================================
// LOAD ADMIN DETAILS
// =========================================================

function loadAdminDetails() {

    if (!ADMIN_DATA) {
        return;
    }

    const adminName =
        document.getElementById("adminName");

    const adminEmail =
        document.getElementById("adminEmail");


    if (adminName) {

        adminName.textContent =
            ADMIN_DATA.full_name ||
            "Administrator";

    }


    if (adminEmail) {

        adminEmail.textContent =
            ADMIN_DATA.email ||
            "Super Admin";

    }

}


// =========================================================
// LOAD COURSES
// =========================================================

async function loadCourses() {

    showLoading();

    try {

        const response =
            await fetch(
                COURSE_API,
                {
                    method: "GET",

                    headers: {
                        "Accept":
                            "application/json",

                        "Authorization":
                            "Bearer " + ADMIN_TOKEN
                    }
                }
            );


        // =================================================
        // AUTH ERROR
        // =================================================

        if (response.status === 401) {

            logoutAdmin();

            return;

        }


        if (!response.ok) {

            const error =
                await getApiError(response);

            throw new Error(error);

        }


        const data =
            await response.json();


        console.log(
            "COURSES FROM API:",
            data
        );


        // =================================================
        // SUPPORT API ARRAY
        // =================================================

        if (Array.isArray(data)) {

            allCourses = data;

        }

        else if (
            Array.isArray(data.courses)
        ) {

            allCourses =
                data.courses;

        }

        else {

            allCourses = [];

        }


        filteredCourses =
            [...allCourses];


        currentPage = 1;


        updateStatistics();

        renderCourses();

    }

    catch (error) {

        console.error(
            "LOAD COURSES ERROR:",
            error
        );


        showError(
            "Unable to load courses: " +
            error.message
        );

    }

}


// =========================================================
// STATISTICS
// =========================================================

function updateStatistics() {

    // Total courses

    if (courseCount) {

        courseCount.textContent =
            allCourses.length;

    }


    // Courses having links

    if (courseLinkCount) {

        const links =
            allCourses.filter(
                course => {

                    return (
                        course.course_link &&
                        course.course_link.trim() !== ""
                    );

                }
            );


        courseLinkCount.textContent =
            links.length;

    }

}


// =========================================================
// RENDER COURSES
// =========================================================

function renderCourses() {

    if (!courseTable) {
        return;
    }


    courseTable.innerHTML = "";


    // =====================================================
    // NO COURSES
    // =====================================================

    if (
        filteredCourses.length === 0
    ) {

        courseTable.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="empty-state"
                >

                    <i
                        class="fa-solid fa-book-open"
                    ></i>

                    <h3>
                        No Courses Found
                    </h3>

                    <p>
                        Add your first course using
                        the Add Course button.
                    </p>

                </td>

            </tr>

        `;


        updatePagination();

        return;

    }


    const totalPages =
        Math.ceil(
            filteredCourses.length /
            rowsPerPage
        );


    if (
        currentPage > totalPages
    ) {

        currentPage =
            totalPages;

    }


    const start =
        (currentPage - 1) *
        rowsPerPage;


    const end =
        start + rowsPerPage;


    const courses =
        filteredCourses.slice(
            start,
            end
        );


    courses.forEach(
        course => {

            const row =
                createCourseRow(course);

            courseTable.appendChild(row);

        }
    );


    updatePagination();

}


// =========================================================
// CREATE COURSE ROW
// =========================================================

function createCourseRow(course) {

    const tr =
        document.createElement("tr");


    const id =
        course.id ?? "-";


    const title =
        course.title ??
        "Untitled Course";


    const category =
        course.category ??
        "-";


    const level =
        course.level ??
        "Beginner";


    const duration =
        course.duration ??
        "-";


    const rating =
        course.rating ??
        "-";


    const courseLink =
        course.course_link ??
        "";


    tr.innerHTML = `

        <!-- ID -->

        <td>
            #${escapeHTML(id)}
        </td>


        <!-- COURSE -->

        <td>

            <div class="course-name">

                <div class="course-icon">

                    <i
                        class="fa-solid fa-book-open"
                    ></i>

                </div>

                <span>
                    ${escapeHTML(title)}
                </span>

            </div>

        </td>


        <!-- CATEGORY -->

        <td>

            <span class="badge-custom">

                ${escapeHTML(category)}

            </span>

        </td>


        <!-- LEVEL -->

        <td>

            ${getLevelBadge(level)}

        </td>


        <!-- DURATION -->

        <td>

            ${escapeHTML(duration)}

        </td>


        <!-- RATING -->

        <td>

            ⭐ ${escapeHTML(rating)}

        </td>


        <!-- COURSE LINK -->

        <td>

            ${courseLink
            ?

            `

                <a
                    href="${escapeAttribute(courseLink)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="course-link-btn"
                    title="${escapeAttribute(courseLink)}"
                >

                    <i
                        class="fa-solid fa-arrow-up-right-from-square"
                    ></i>

                    Open

                </a>

                `

            :

            `

                <span class="no-course-link">

                    No link

                </span>

                `
        }

        </td>


        <!-- ACTIONS -->

        <td>

            <button
                class="action-btn action-view"
                title="View Course"
                onclick="viewCourse(${id})"
            >

                <i
                    class="fa-solid fa-eye"
                ></i>

            </button>


            <button
                class="action-btn action-edit"
                title="Edit Course"
                onclick="editCourse(${id})"
            >

                <i
                    class="fa-solid fa-pen"
                ></i>

            </button>


            <button
                class="action-btn action-delete"
                title="Delete Course"
                onclick="deleteCourse(${id})"
            >

                <i
                    class="fa-solid fa-trash"
                ></i>

            </button>

        </td>

    `;


    return tr;

}


// =========================================================
// LEVEL BADGE
// =========================================================

function getLevelBadge(level) {

    const value =
        String(level).toLowerCase();


    let className =
        "level-beginner";


    if (
        value.includes("advanced")
    ) {

        className =
            "level-advanced";

    }

    else if (
        value.includes("intermediate")
    ) {

        className =
            "level-intermediate";

    }


    return `

        <span
            class="level-badge ${className}"
        >

            ${escapeHTML(level)}

        </span>

    `;

}


// =========================================================
// SEARCH
// =========================================================

function setupSearch() {

    if (!searchCourse) {
        return;
    }


    searchCourse.addEventListener(
        "input",
        function () {

            const keyword =
                this.value
                    .trim()
                    .toLowerCase();


            filteredCourses =
                allCourses.filter(
                    course => {

                        const title =
                            String(
                                course.title || ""
                            ).toLowerCase();


                        const category =
                            String(
                                course.category || ""
                            ).toLowerCase();


                        const level =
                            String(
                                course.level || ""
                            ).toLowerCase();


                        const link =
                            String(
                                course.course_link || ""
                            ).toLowerCase();


                        return (

                            title.includes(
                                keyword
                            )

                            ||

                            category.includes(
                                keyword
                            )

                            ||

                            level.includes(
                                keyword
                            )

                            ||

                            link.includes(
                                keyword
                            )

                        );

                    }
                );


            currentPage = 1;

            renderCourses();

        }
    );

}


// =========================================================
// PAGINATION
// =========================================================

function setupPagination() {

    if (nextBtn) {

        nextBtn.addEventListener(
            "click",
            function () {

                const totalPages =
                    Math.ceil(
                        filteredCourses.length /
                        rowsPerPage
                    );


                if (
                    currentPage <
                    totalPages
                ) {

                    currentPage++;

                    renderCourses();

                }

            }
        );

    }


    if (prevBtn) {

        prevBtn.addEventListener(
            "click",
            function () {

                if (
                    currentPage > 1
                ) {

                    currentPage--;

                    renderCourses();

                }

            }
        );

    }

}


// =========================================================
// UPDATE PAGINATION
// =========================================================

function updatePagination() {

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredCourses.length /
                rowsPerPage
            )
        );


    if (pageInfo) {

        pageInfo.textContent =
            `Page ${currentPage} of ${totalPages}`;

    }


    if (prevBtn) {

        prevBtn.disabled =
            currentPage <= 1;

    }


    if (nextBtn) {

        nextBtn.disabled =
            currentPage >= totalPages;

    }

}


// =========================================================
// ADD COURSE BUTTON
// =========================================================

function setupAddCourse() {

    if (!addCourseBtn) {
        return;
    }


    addCourseBtn.addEventListener(
        "click",
        function () {

            openCourseModal(
                null,
                "add"
            );

        }
    );

}


// =========================================================
// OPEN ADD / EDIT MODAL
// =========================================================

function openCourseModal(
    course = null,
    mode = "add"
) {

    const modalElement =
        document.getElementById(
            "courseModal"
        );


    if (!modalElement) {

        console.error(
            "courseModal not found"
        );

        return;

    }


    const modal =
        bootstrap.Modal
            .getOrCreateInstance(
                modalElement
            );


    // =====================================================
    // RESET FORM
    // =====================================================

    if (courseForm) {

        courseForm.reset();

    }


    setInput(
        "courseId",
        course?.id || ""
    );


    setInput(
        "courseTitle",
        course?.title || ""
    );


    setInput(
        "courseCategory",
        course?.category || ""
    );


    setInput(
        "courseLevel",
        course?.level || "Beginner"
    );


    setInput(
        "courseDuration",
        course?.duration || ""
    );


    setInput(
        "courseRating",
        course?.rating ?? ""
    );


    setInput(
        "courseInstructor",
        course?.instructor || ""
    );


    // =====================================================
    // COURSE LINK
    // =====================================================

    setInput(
        "courseLink",
        course?.course_link || ""
    );


    setInput(
        "courseDescription",
        course?.description || ""
    );


    // =====================================================
    // TITLE
    // =====================================================

    const modalTitle =
        document.getElementById(
            "courseModalTitle"
        );


    if (modalTitle) {

        if (mode === "add") {

            modalTitle.innerHTML = `

                <i
                    class="fa-solid fa-plus"
                ></i>

                Add New Course

            `;

        }

        else if (
            mode === "edit"
        ) {

            modalTitle.innerHTML = `

                <i
                    class="fa-solid fa-pen"
                ></i>

                Edit Course

            `;

        }

        else {

            modalTitle.innerHTML = `

                <i
                    class="fa-solid fa-eye"
                ></i>

                Course Details

            `;

        }

    }


    // =====================================================
    // VIEW MODE
    // =====================================================

    const inputs =
        courseForm
            ?
            courseForm.querySelectorAll(
                "input, textarea, select"
            )
            :
            [];


    inputs.forEach(
        input => {

            input.disabled =
                mode === "view";

        }
    );


    if (saveCourseBtn) {

        saveCourseBtn.style.display =
            mode === "view"
                ? "none"
                : "flex";

    }


    modal.show();

}


// =========================================================
// FORM SUBMIT
// =========================================================

function setupCourseForm() {

    if (!courseForm) {
        return;
    }


    courseForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const id =
                document.getElementById(
                    "courseId"
                ).value;


            const title =
                getInput(
                    "courseTitle"
                );


            const category =
                getInput(
                    "courseCategory"
                );


            const level =
                getInput(
                    "courseLevel"
                );


            const duration =
                getInput(
                    "courseDuration"
                );


            const ratingValue =
                getInput(
                    "courseRating"
                );


            const instructor =
                getInput(
                    "courseInstructor"
                );


            const courseLink =
                getInput(
                    "courseLink"
                );


            const description =
                getInput(
                    "courseDescription"
                );


            // =================================================
            // VALIDATION
            // =================================================

            if (!title) {

                showNotification(
                    "Please enter course name.",
                    "error"
                );

                return;

            }


            // =================================================
            // URL VALIDATION
            // =================================================

            if (courseLink) {

                try {

                    new URL(courseLink);

                }

                catch {

                    showNotification(
                        "Please enter a valid course link.",
                        "error"
                    );

                    return;

                }

            }


            // =================================================
            // RATING
            // =================================================

            let rating = null;


            if (ratingValue) {

                rating =
                    Number(
                        ratingValue
                    );


                if (
                    Number.isNaN(
                        rating
                    )
                    ||
                    rating < 0
                    ||
                    rating > 5
                ) {

                    showNotification(
                        "Rating must be between 0 and 5.",
                        "error"
                    );

                    return;

                }

            }


            // =================================================
            // REQUEST DATA
            // =================================================

            const courseData = {

                title:
                    title,

                category:
                    category || null,

                level:
                    level || null,

                duration:
                    duration || null,

                rating:
                    rating,

                instructor:
                    instructor || null,

                course_link:
                    courseLink || null,

                description:
                    description || null

            };


            console.log(
                "COURSE DATA:",
                courseData
            );


            // =================================================
            // LOADING
            // =================================================

            if (saveCourseBtn) {

                saveCourseBtn.disabled =
                    true;

                saveCourseBtn.innerHTML = `

                    <i
                        class="fa-solid fa-spinner fa-spin"
                    ></i>

                    Saving...

                `;

            }


            try {

                let url =
                    COURSE_API;

                let method =
                    "POST";


                // =================================================
                // EDIT
                // =================================================

                if (id) {

                    url =
                        COURSE_API +
                        "/" +
                        id;

                    method =
                        "PUT";

                }


                const response =
                    await fetch(
                        url,
                        {

                            method:
                                method,

                            headers:
                                getAuthHeaders(),

                            body:
                                JSON.stringify(
                                    courseData
                                )

                        }
                    );


                // =================================================
                // AUTH
                // =================================================

                if (
                    response.status === 401
                ) {

                    logoutAdmin();

                    return;

                }


                if (!response.ok) {

                    const error =
                        await getApiError(
                            response
                        );

                    throw new Error(
                        error
                    );

                }


                const savedCourse =
                    await response.json();


                console.log(
                    "COURSE SAVED:",
                    savedCourse
                );


                // =================================================
                // SUCCESS
                // =================================================

                showNotification(

                    id
                        ?
                        "Course updated successfully!"
                        :
                        "Course added successfully!",

                    "success"

                );


                // =================================================
                // CLOSE MODAL
                // =================================================

                const modalElement =
                    document.getElementById(
                        "courseModal"
                    );


                if (modalElement) {

                    const modal =
                        bootstrap.Modal
                            .getInstance(
                                modalElement
                            );


                    if (modal) {

                        modal.hide();

                    }

                }


                // =================================================
                // RELOAD
                // =================================================

                await loadCourses();

            }

            catch (error) {

                console.error(
                    "SAVE COURSE ERROR:",
                    error
                );


                showNotification(
                    error.message,
                    "error"
                );

            }

            finally {

                if (saveCourseBtn) {

                    saveCourseBtn.disabled =
                        false;

                    saveCourseBtn.innerHTML = `

                        <i
                            class="fa-solid fa-floppy-disk"
                        ></i>

                        Save Course

                    `;

                }

            }

        }
    );

}


// =========================================================
// VIEW COURSE
// =========================================================

async function viewCourse(id) {

    try {

        const course =
            await getCourse(id);


        openCourseModal(
            course,
            "view"
        );

    }

    catch (error) {

        console.error(
            error
        );


        showNotification(
            error.message,
            "error"
        );

    }

}


// =========================================================
// GET ONE COURSE
// =========================================================

async function getCourse(id) {

    const response =
        await fetch(
            COURSE_API +
            "/" +
            id,
            {

                method: "GET",

                headers: {

                    "Accept":
                        "application/json",

                    "Authorization":
                        "Bearer " +
                        ADMIN_TOKEN

                }

            }
        );


    if (
        response.status === 401
    ) {

        logoutAdmin();

        throw new Error(
            "Admin session expired."
        );

    }


    if (!response.ok) {

        const error =
            await getApiError(
                response
            );

        throw new Error(
            error
        );

    }


    return await response.json();

}


// =========================================================
// EDIT COURSE
// =========================================================

async function editCourse(id) {

    try {

        const course =
            await getCourse(id);


        openCourseModal(
            course,
            "edit"
        );

    }

    catch (error) {

        console.error(
            error
        );


        showNotification(
            error.message,
            "error"
        );

    }

}


// =========================================================
// DELETE COURSE
// =========================================================

async function deleteCourse(id) {

    const course =
        allCourses.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    const courseName =
        course?.title ||
        "this course";


    const confirmed =
        confirm(
            `Are you sure you want to delete "${courseName}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                COURSE_API +
                "/" +
                id,
                {

                    method: "DELETE",

                    headers: {

                        "Accept":
                            "application/json",

                        "Authorization":
                            "Bearer " +
                            ADMIN_TOKEN

                    }

                }
            );


        if (
            response.status === 401
        ) {

            logoutAdmin();

            return;

        }


        if (!response.ok) {

            const error =
                await getApiError(
                    response
                );

            throw new Error(
                error
            );

        }


        const result =
            await response.json();


        console.log(
            "DELETE RESULT:",
            result
        );


        showNotification(
            "Course deleted successfully!",
            "success"
        );


        await loadCourses();

    }

    catch (error) {

        console.error(
            "DELETE COURSE ERROR:",
            error
        );


        showNotification(
            error.message,
            "error"
        );

    }

}


// =========================================================
// INPUT HELPERS
// =========================================================

function setInput(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.value =
            value ?? "";

    }

}


function getInput(id) {

    const element =
        document.getElementById(id);


    if (!element) {
        return "";
    }


    return element.value.trim();

}


// =========================================================
// ESCAPE HTML
// =========================================================

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(value ?? "");


    return div.innerHTML;

}


// =========================================================
// ESCAPE ATTRIBUTE
// =========================================================

function escapeAttribute(value) {

    return String(value ?? "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        );

}


// =========================================================
// LOADING
// =========================================================

function showLoading() {

    if (!courseTable) {
        return;
    }


    courseTable.innerHTML = `

        <tr>

            <td
                colspan="8"
                class="loading-row"
            >

                <i
                    class="fa-solid fa-spinner fa-spin"
                ></i>

                Loading courses...

            </td>

        </tr>

    `;

}


// =========================================================
// API ERROR
// =========================================================

async function getApiError(
    response
) {

    try {

        const data =
            await response.json();


        if (
            Array.isArray(
                data.detail
            )
        ) {

            return data.detail
                .map(
                    item =>
                        item.msg
                )
                .join(", ");

        }


        return (
            data.detail ||
            data.message ||
            `Server error: ${response.status}`
        );

    }

    catch {

        return (
            `Server error: ${response.status}`
        );

    }

}


// =========================================================
// NOTIFICATION
// =========================================================

function showNotification(
    message,
    type = "success"
) {

    const old =
        document.getElementById(
            "courseNotification"
        );


    if (old) {
        old.remove();
    }


    const notification =
        document.createElement(
            "div"
        );


    notification.id =
        "courseNotification";


    notification.innerHTML = `

        <span class="notification-icon">

            ${type === "success"
            ?
            `<i class="fa-solid fa-circle-check"></i>`
            :
            `<i class="fa-solid fa-circle-exclamation"></i>`
        }

        </span>

        <span>
            ${escapeHTML(message)}
        </span>

    `;


    notification.style.position =
        "fixed";

    notification.style.top =
        "25px";

    notification.style.right =
        "25px";

    notification.style.zIndex =
        "999999";

    notification.style.minWidth =
        "300px";

    notification.style.maxWidth =
        "450px";

    notification.style.display =
        "flex";

    notification.style.alignItems =
        "center";

    notification.style.gap =
        "10px";

    notification.style.padding =
        "15px 20px";

    notification.style.borderRadius =
        "15px";

    notification.style.fontFamily =
        "Poppins, sans-serif";

    notification.style.fontSize =
        "11px";

    notification.style.fontWeight =
        "600";

    notification.style.backdropFilter =
        "blur(20px)";


    if (
        type === "success"
    ) {

        notification.style.color =
            "#4ade80";

        notification.style.background =
            "rgba(7,35,25,.96)";

        notification.style.border =
            "1px solid rgba(74,222,128,.25)";

        notification.style.boxShadow =
            "0 15px 40px rgba(0,0,0,.4), 0 0 25px rgba(74,222,128,.08)";

    }

    else {

        notification.style.color =
            "#fb7185";

        notification.style.background =
            "rgba(45,10,20,.96)";

        notification.style.border =
            "1px solid rgba(251,113,133,.25)";

        notification.style.boxShadow =
            "0 15px 40px rgba(0,0,0,.4), 0 0 25px rgba(251,113,133,.08)";

    }


    document.body.appendChild(
        notification
    );


    setTimeout(
        function () {

            notification.style.opacity =
                "0";

            notification.style.transform =
                "translateX(30px)";

            notification.style.transition =
                ".3s";


            setTimeout(
                function () {

                    notification.remove();

                },
                300
            );

        },
        3500
    );

}


// =========================================================
// ERROR NOTIFICATION
// =========================================================

function showError(message) {

    showNotification(
        message,
        "error"
    );

}


// =========================================================
// LOGOUT
// =========================================================

// =========================================================
// ADMIN LOGOUT
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    const logoutBtn = document.getElementById("logoutBtn");

    if (!logoutBtn) {
        console.warn("Logout button not found.");
        return;
    }

    logoutBtn.addEventListener("click", () => {

        // Confirm logout
        const confirmLogout = confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmLogout) {
            return;
        }

        // Remove admin authentication
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        // Remove any old normal-user authentication
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Redirect to ADMIN LOGIN
        window.location.href = "admin_login.html";

    });

});


function logoutAdmin() {

    localStorage.removeItem(
        "adminToken"
    );

    localStorage.removeItem(
        "admin"
    );


    window.location.href =
        "admin_log.html";

}