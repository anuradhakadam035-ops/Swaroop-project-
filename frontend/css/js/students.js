// ============================================================
// VISIONX ADMIN - STUDENT MANAGEMENT
// ============================================================

const API = "http://127.0.0.1:8000/api/admin";


// ============================================================
// ADMIN AUTHENTICATION
// ============================================================

function getAdminToken() {
    return localStorage.getItem("adminToken");
}


function requireAdminLogin() {

    const token = getAdminToken();

    if (!token) {

        console.warn("No admin token found.");

        window.location.replace("admin_log.html");

        return false;
    }

    return true;
}


if (!requireAdminLogin()) {
    throw new Error("Admin authentication required.");
}


// ============================================================
// VARIABLES
// ============================================================

let allStudents = [];
let originalStudents = [];

let currentPage = 1;

const rowsPerPage = 8;


// ============================================================
// PAGE LOAD
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("======================================");
    console.log("VISIONX ADMIN STUDENTS");
    console.log("Admin token exists:", !!getAdminToken());
    console.log("API:", API);
    console.log("======================================");

    loadStudents();

    setupSearch();

    setupPagination();

    setupAddStudent();

    setupEditForm();

    setupLogout();

});


// ============================================================
// AUTH HEADERS
// ============================================================

function getHeaders(includeJSON = false) {

    const token = getAdminToken();

    const headers = {

        "Accept": "application/json",

        "Authorization": `Bearer ${token}`

    };

    if (includeJSON) {

        headers["Content-Type"] =
            "application/json";

    }

    return headers;
}


// ============================================================
// HANDLE AUTH ERROR
// ============================================================

function handleAuthError(response) {

    if (response.status === 401) {

        console.error(
            "ADMIN TOKEN INVALID OR EXPIRED"
        );

        localStorage.removeItem("adminToken");

        localStorage.removeItem("admin");

        alert(
            "Your admin session has expired. Please login again."
        );

        window.location.replace(
            "admin_log.html"
        );

        return true;
    }

    return false;
}


// ============================================================
// SAFE JSON
// ============================================================

async function getResponseData(response) {

    const text = await response.text();

    if (!text) {
        return {};
    }

    try {

        return JSON.parse(text);

    } catch {

        return {
            detail: text
        };

    }
}


// ============================================================
// LOAD STUDENTS
// ============================================================

async function loadStudents() {

    const tbody =
        document.getElementById("studentTable");

    if (tbody) {

        tbody.innerHTML = `

            <tr>

                <td colspan="7"
                    style="
                        text-align:center;
                        padding:50px;
                    ">

                    <i
                        class="fa-solid fa-spinner fa-spin"
                        style="
                            font-size:28px;
                            color:#39c6ff;
                        ">
                    </i>

                    <br><br>

                    Loading students...

                </td>

            </tr>

        `;

    }


    try {

        const token = getAdminToken();

        if (!token) {

            requireAdminLogin();

            return;
        }


        console.log(
            "GET:",
            API + "/students"
        );


        const response = await fetch(

            API + "/students",

            {

                method: "GET",

                headers:
                    getHeaders(false)

            }

        );


        console.log(
            "Students API status:",
            response.status
        );


        // ====================================================
        // AUTH ERROR
        // ====================================================

        if (handleAuthError(response)) {
            return;
        }


        const data =
            await getResponseData(response);


        console.log(
            "Students API response:",
            data
        );


        // ====================================================
        // OTHER API ERROR
        // ====================================================

        if (!response.ok) {

            throw new Error(

                data.detail ||
                `Server returned ${response.status}`

            );

        }


        // ====================================================
        // SUPPORT RESPONSE FORMATS
        // ====================================================

        if (Array.isArray(data)) {

            allStudents = data;

        }

        else if (
            Array.isArray(data.students)
        ) {

            allStudents =
                data.students;

        }

        else if (
            Array.isArray(data.data)
        ) {

            allStudents =
                data.data;

        }

        else {

            console.error(
                "Unexpected students response:",
                data
            );

            allStudents = [];

        }


        // ====================================================
        // SAVE ORIGINAL DATA
        // ====================================================

        originalStudents =
            [...allStudents];

        currentPage = 1;


        // ====================================================
        // RENDER
        // ====================================================

        renderTable();


        console.log(
            `Loaded ${allStudents.length} students`
        );

    }


    catch (error) {

        console.error(
            "LOAD STUDENTS ERROR:",
            error
        );


        if (tbody) {

            tbody.innerHTML = `

                <tr>

                    <td colspan="7"
                        style="
                            text-align:center;
                            padding:50px;
                            color:#ff6b6b;
                        ">

                        <i
                            class="fa-solid fa-triangle-exclamation"
                            style="
                                font-size:35px;
                            ">
                        </i>

                        <br><br>

                        <strong>
                            Unable to load students
                        </strong>

                        <br>

                        <small>
                            ${escapeHTML(
                error.message
            )}
                        </small>

                    </td>

                </tr>

            `;

        }

    }

}


// ============================================================
// RENDER TABLE
// ============================================================

function renderTable() {

    const tbody =
        document.getElementById(
            "studentTable"
        );

    if (!tbody) return;


    tbody.innerHTML = "";


    // ========================================================
    // NO STUDENTS
    // ========================================================

    if (allStudents.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td colspan="7"
                    style="
                        text-align:center;
                        padding:60px;
                        color:#8fa3c7;
                    ">

                    <i
                        class="fa-solid fa-user-group"
                        style="
                            font-size:45px;
                            color:#39c6ff;
                        ">
                    </i>

                    <br><br>

                    <strong>
                        No students registered yet.
                    </strong>

                    <br>

                    <small>
                        Click "Add Student" to register a student.
                    </small>

                </td>

            </tr>

        `;

        updatePageInfo();

        return;

    }


    // ========================================================
    // PAGINATION
    // ========================================================

    const start =
        (currentPage - 1) *
        rowsPerPage;

    const end =
        start + rowsPerPage;


    const pageStudents =
        allStudents.slice(
            start,
            end
        );


    // ========================================================
    // CREATE ROWS
    // ========================================================

    pageStudents.forEach(student => {

        const row =
            document.createElement("tr");


        const avatar =
            `https://i.pravatar.cc/50?u=${student.id}`;


        row.innerHTML = `

            <td>
                ${student.id ?? "-"}
            </td>


            <td>

                <div class="student">

                    <img
                        src="${avatar}"
                        alt="Student"
                    >

                    <span>
                        ${escapeHTML(
            student.full_name ??
            student.name ??
            "-"
        )}
                    </span>

                </div>

            </td>


            <td>
                ${escapeHTML(
            student.email ?? "-"
        )}
            </td>


            <td>
                ${escapeHTML(
            student.branch ?? "-"
        )}
            </td>


            <td>
                ${escapeHTML(
            student.year ?? "-"
        )}
            </td>


            <td>
                ${escapeHTML(
            student.career ??
            student.career_match ??
            "-"
        )}
            </td>


            <td>

                <button
                    class="action-btn view"
                    onclick="viewStudent(${student.id})"
                    title="View">

                    <i class="fa-solid fa-eye"></i>

                </button>


                <button
                    class="action-btn edit"
                    onclick="editStudent(${student.id})"
                    title="Edit">

                    <i class="fa-solid fa-pen"></i>

                </button>


                <button
                    class="action-btn delete"
                    onclick="deleteStudent(${student.id})"
                    title="Delete">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        `;


        tbody.appendChild(row);

    });


    updatePageInfo();

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;

}


// ============================================================
// PAGE INFORMATION
// ============================================================

function updatePageInfo() {

    const totalPages =
        Math.max(

            1,

            Math.ceil(
                allStudents.length /
                rowsPerPage
            )

        );


    const pageInfo =
        document.getElementById(
            "pageInfo"
        );


    if (pageInfo) {

        pageInfo.textContent =
            `Page ${currentPage} of ${totalPages}`;

    }

}


// ============================================================
// SEARCH
// ============================================================

function setupSearch() {

    const searchBox =
        document.getElementById(
            "searchStudent"
        );


    if (!searchBox) return;


    searchBox.addEventListener(
        "input",
        function () {

            const keyword =
                this.value
                    .trim()
                    .toLowerCase();


            allStudents =
                originalStudents.filter(
                    student => {

                        const name =
                            String(
                                student.full_name ??
                                student.name ??
                                ""
                            ).toLowerCase();


                        const email =
                            String(
                                student.email ??
                                ""
                            ).toLowerCase();


                        const branch =
                            String(
                                student.branch ??
                                ""
                            ).toLowerCase();


                        const year =
                            String(
                                student.year ??
                                ""
                            ).toLowerCase();


                        return (

                            name.includes(
                                keyword
                            )

                            ||

                            email.includes(
                                keyword
                            )

                            ||

                            branch.includes(
                                keyword
                            )

                            ||

                            year.includes(
                                keyword
                            )

                        );

                    }

                );


            currentPage = 1;

            renderTable();

        }

    );

}


// ============================================================
// PAGINATION
// ============================================================

function setupPagination() {

    const nextBtn =
        document.getElementById(
            "nextBtn"
        );


    const prevBtn =
        document.getElementById(
            "prevBtn"
        );


    if (nextBtn) {

        nextBtn.addEventListener(
            "click",
            function () {

                const totalPages =
                    Math.ceil(
                        allStudents.length /
                        rowsPerPage
                    );


                if (
                    currentPage <
                    totalPages
                ) {

                    currentPage++;

                    renderTable();

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

                    renderTable();

                }

            }

        );

    }

}


// ============================================================
// ADD STUDENT
// ============================================================

function setupAddStudent() {

    const addBtn =
        document.querySelector(
            ".add-btn"
        );


    if (!addBtn) return;


    addBtn.addEventListener(
        "click",
        function () {

            clearStudentForm();

            addPasswordField();


            const modalElement =
                document.getElementById(
                    "studentModal"
                );


            if (!modalElement) {

                alert(
                    "Student modal not found in HTML."
                );

                return;

            }


            const modal =
                new bootstrap.Modal(
                    modalElement
                );


            modal.show();

        }

    );

}


// ============================================================
// ADD PASSWORD FIELD TO MODAL
// ============================================================

function addPasswordField() {

    let passwordInput =
        document.getElementById(
            "studentPassword"
        );


    // Already exists
    if (passwordInput) {
        passwordInput.value = "";
        return;
    }


    const form =
        document.getElementById(
            "editForm"
        );


    if (!form) return;


    const row =
        form.querySelector(".row");


    if (!row) return;


    const wrapper =
        document.createElement("div");


    wrapper.className =
        "col-md-6 mb-3";


    wrapper.id =
        "studentPasswordWrapper";


    wrapper.innerHTML = `

        <label>
            Password
        </label>

        <input
            type="password"
            class="form-control"
            id="studentPassword"
            placeholder="Enter student password"
        >

    `;


    // Insert before skills
    const skillsElement =
        document.getElementById(
            "skills"
        );


    if (
        skillsElement &&
        skillsElement.parentElement
    ) {

        const skillsColumn =
            skillsElement.parentElement;


        row.insertBefore(
            wrapper,
            skillsColumn
        );

    } else {

        row.insertBefore(
            wrapper,
            row.lastElementChild
        );

    }

}


// ============================================================
// REMOVE PASSWORD FIELD AFTER ADD
// ============================================================

function removePasswordField() {

    const wrapper =
        document.getElementById(
            "studentPasswordWrapper"
        );


    if (wrapper) {

        wrapper.remove();

    }

}


// ============================================================
// CLEAR FORM
// ============================================================

function clearStudentForm() {

    const ids = [

        "studentId",
        "fullName",
        "email",
        "mobile",
        "college",
        "branch",
        "year",
        "skills",
        "interests"

    ];


    ids.forEach(id => {

        const element =
            document.getElementById(id);


        if (element) {

            element.value = "";

        }

    });


    // Remove old password field
    removePasswordField();

}


// ============================================================
// VIEW STUDENT
// ============================================================

async function viewStudent(id) {

    try {

        const response =
            await fetch(

                `${API}/student/${id}`,

                {

                    method: "GET",

                    headers:
                        getHeaders(false)

                }

            );


        if (handleAuthError(response)) {
            return;
        }


        const student =
            await getResponseData(
                response
            );


        if (!response.ok) {

            throw new Error(

                student.detail ||
                "Unable to load student."

            );

        }


        console.log(
            "Student:",
            student
        );


        // Fill form
        fillStudentForm(student);


        // Don't require password when viewing
        removePasswordField();


        const modalElement =
            document.getElementById(
                "studentModal"
            );


        if (modalElement) {

            const modal =
                new bootstrap.Modal(
                    modalElement
                );

            modal.show();

        }

    }


    catch (error) {

        console.error(
            "VIEW STUDENT ERROR:",
            error
        );


        alert(
            "Unable to load student: " +
            error.message
        );

    }

}


// ============================================================
// EDIT STUDENT
// ============================================================

async function editStudent(id) {

    try {

        const response =
            await fetch(

                `${API}/student/${id}`,

                {

                    method: "GET",

                    headers:
                        getHeaders(false)

                }

            );


        if (handleAuthError(response)) {
            return;
        }


        const student =
            await getResponseData(
                response
            );


        if (!response.ok) {

            throw new Error(

                student.detail ||
                "Unable to load student."

            );

        }


        fillStudentForm(student);

        removePasswordField();


        const modalElement =
            document.getElementById(
                "studentModal"
            );


        if (modalElement) {

            const modal =
                new bootstrap.Modal(
                    modalElement
                );

            modal.show();

        }

    }


    catch (error) {

        console.error(
            "EDIT STUDENT ERROR:",
            error
        );


        alert(
            "Unable to load student: " +
            error.message
        );

    }

}


// ============================================================
// FILL STUDENT FORM
// ============================================================

function fillStudentForm(student) {

    const fields = {

        studentId:
            student.id,

        fullName:
            student.full_name ??
            student.name ??
            "",

        email:
            student.email ?? "",

        mobile:
            student.mobile ?? "",

        college:
            student.college ?? "",

        branch:
            student.branch ?? "",

        year:
            student.year ?? "",

        skills:
            student.skills ?? "",

        interests:
            student.interests ?? ""

    };


    Object.entries(fields).forEach(
        ([id, value]) => {

            const element =
                document.getElementById(id);


            if (element) {

                element.value =
                    value ?? "";

            }

        }
    );

}


// ============================================================
// SAVE / ADD / UPDATE
// ============================================================

function setupEditForm() {

    const form =
        document.getElementById(
            "editForm"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const id =
                document.getElementById(
                    "studentId"
                ).value;


            // =================================================
            // ADD NEW STUDENT
            // =================================================

            if (!id) {

                await addStudent();

                return;

            }


            // =================================================
            // UPDATE STUDENT
            // =================================================

            await updateStudent(id);

        }

    );

}


// ============================================================
// ADD STUDENT API
// ============================================================

async function addStudent() {

    const passwordElement =
        document.getElementById(
            "studentPassword"
        );


    const data = {

        full_name:
            getValue("fullName"),

        email:
            getValue("email"),

        mobile:
            getValue("mobile"),

        password:
            passwordElement
                ? passwordElement.value
                : "",

        college:
            getValue("college"),

        branch:
            getValue("branch"),

        year:
            getValue("year"),

        skills:
            getValue("skills"),

        interests:
            getValue("interests")

    };


    // ========================================================
    // VALIDATION
    // ========================================================

    if (!data.full_name) {

        alert(
            "Please enter student name."
        );

        return;

    }


    if (!data.email) {

        alert(
            "Please enter student email."
        );

        return;

    }


    if (!data.mobile) {

        alert(
            "Please enter mobile number."
        );

        return;

    }


    if (!data.password) {

        alert(
            "Please enter student password."
        );

        return;

    }


    try {

        console.log(
            "POST:",
            API + "/students"
        );


        console.log(
            "Student data:",
            {
                ...data,
                password: "***"
            }
        );


        const response =
            await fetch(

                API + "/students",

                {

                    method: "POST",

                    headers:
                        getHeaders(true),

                    body:
                        JSON.stringify(data)

                }

            );


        if (handleAuthError(response)) {
            return;
        }


        const result =
            await getResponseData(
                response
            );


        console.log(
            "ADD STUDENT RESPONSE:",
            result
        );


        if (!response.ok) {

            throw new Error(

                result.detail ||
                "Unable to create student."

            );

        }


        // ====================================================
        // SUCCESS
        // ====================================================

        alert(
            "Student registered successfully!"
        );


        // Close modal
        closeStudentModal();


        // Reload table
        await loadStudents();

    }


    catch (error) {

        console.error(
            "ADD STUDENT ERROR:",
            error
        );


        alert(
            "Unable to add student:\n" +
            error.message
        );

    }

}


// ============================================================
// UPDATE STUDENT API
// ============================================================

async function updateStudent(id) {

    const data = {

        full_name:
            getValue("fullName"),

        email:
            getValue("email"),

        mobile:
            getValue("mobile"),

        college:
            getValue("college"),

        branch:
            getValue("branch"),

        year:
            getValue("year"),

        skills:
            getValue("skills"),

        interests:
            getValue("interests")

    };


    try {

        console.log(
            "PUT:",
            `${API}/student/${id}`
        );


        const response =
            await fetch(

                `${API}/student/${id}`,

                {

                    method: "PUT",

                    headers:
                        getHeaders(true),

                    body:
                        JSON.stringify(data)

                }

            );


        if (handleAuthError(response)) {
            return;
        }


        const result =
            await getResponseData(
                response
            );


        if (!response.ok) {

            throw new Error(

                result.detail ||
                "Unable to update student."

            );

        }


        alert(
            result.message ||
            "Student updated successfully!"
        );


        closeStudentModal();


        await loadStudents();

    }


    catch (error) {

        console.error(
            "UPDATE STUDENT ERROR:",
            error
        );


        alert(
            "Unable to update student:\n" +
            error.message
        );

    }

}


// ============================================================
// GET INPUT VALUE
// ============================================================

function getValue(id) {

    const element =
        document.getElementById(id);


    if (!element) {
        return "";
    }


    return element.value.trim();

}


// ============================================================
// CLOSE MODAL
// ============================================================

function closeStudentModal() {

    const modalElement =
        document.getElementById(
            "studentModal"
        );


    if (!modalElement) return;


    const modal =
        bootstrap.Modal.getInstance(
            modalElement
        );


    if (modal) {

        modal.hide();

    }

}


// ============================================================
// DELETE STUDENT
// ============================================================

async function deleteStudent(id) {

    if (!confirm("Are you sure you want to delete this student?")) {
        return;
    }

    const token = localStorage.getItem("adminToken");

    if (!token) {

        alert("Admin session expired. Please login again.");

        window.location.href = "admin_log.html";

        return;
    }

    try {

        const response = await fetch(
            `${API}/student/${id}`,
            {
                method: "DELETE",

                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const text = await response.text();

        let data;

        try {
            data = JSON.parse(text);
        } catch {
            data = {
                detail: text
            };
        }

        console.log("DELETE STATUS:", response.status);
        console.log("DELETE RESPONSE:", data);

        if (!response.ok) {

            throw new Error(
                data.detail ||
                `Delete failed (${response.status})`
            );
        }

        alert(
            `✅ ${data.student_name || "Student"} deleted successfully`
        );

        await loadStudents();

    } catch (error) {

        console.error(
            "DELETE STUDENT ERROR:",
            error
        );

        alert(
            "Unable to delete student: " +
            error.message
        );
    }
}
// ============================================================
// LOGOUT
// ============================================================

function setupLogout() {

    const logoutElements =
        document.querySelectorAll(
            ".logout, [data-action='logout']"
        );


    logoutElements.forEach(
        element => {

            element.addEventListener(
                "click",
                function (e) {

                    e.preventDefault();

                    logoutAdmin();

                }
            );

        }
    );

}


function logoutAdmin() {

    localStorage.removeItem(
        "adminToken"
    );

    localStorage.removeItem(
        "admin"
    );


    window.location.replace(
        "admin_log.html"
    );

}


// ============================================================
// GLOBAL FUNCTIONS
// ============================================================

window.viewStudent =
    viewStudent;

window.editStudent =
    editStudent;

window.deleteStudent =
    deleteStudent;

window.logoutAdmin =
    logoutAdmin;