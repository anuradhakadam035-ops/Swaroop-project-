/* ==========================================
   AI Career Guidance
   Question Management
========================================== */
const USER = JSON.parse(

    localStorage.getItem("user")

);

if (!USER) {

    window.location.href = "login.html";

}

const USER_ID = USER.id;

const TOKEN = localStorage.getItem("token");
const API = "http://127.0.0.1:8000/api/assessment";

let allQuestions = [];
let filteredQuestions = [];

let currentPage = 1;
const rowsPerPage = 8;

let questionModal = null;

document.addEventListener("DOMContentLoaded", () => {

    questionModal = new bootstrap.Modal(
        document.getElementById("questionModal")
    );

    loadQuestions();

    initializeEvents();

});

/* ==========================================
   Load Questions
========================================== */

async function loadQuestions() {

    try {

        const response = await fetch(API + "/questions");

        if (!response.ok)
            throw new Error("Unable to load questions");

        const data = await response.json();

        allQuestions = data;
        filteredQuestions = [...data];

        currentPage = 1;

        renderTable();

    }

    catch (err) {

        console.error(err);

        alert("Unable to load questions.");

    }

}

/* ==========================================
   Render Table
========================================== */

function renderTable() {

    const tbody = document.getElementById("questionTable");

    tbody.innerHTML = "";

    const start = (currentPage - 1) * rowsPerPage;

    const end = start + rowsPerPage;

    const questions = filteredQuestions.slice(start, end);

    questions.forEach(q => {

        tbody.innerHTML += `

<tr>

<td>${q.id}</td>

<td>${q.question}</td>

<td>${q.category}</td>

<td>${q.difficulty}</td>

<td>

<button
class="action-btn edit"
onclick="editQuestion(${q.id})">

<i class="fa fa-pen"></i>

</button>

<button
class="action-btn delete"
onclick="deleteQuestion(${q.id})">

<i class="fa fa-trash"></i>

</button>

</td>

</tr>

`;

    });

    const pageInfo = document.getElementById("pageInfo");

    if (pageInfo) {

        pageInfo.innerHTML =

            `Page ${currentPage} of ${Math.max(1, Math.ceil(filteredQuestions.length / rowsPerPage))}`;

    }

}

/* ==========================================
   Search
========================================== */

function initializeEvents() {

    document.getElementById("searchQuestion")
        .addEventListener("keyup", filterQuestions);

    document.getElementById("categoryFilter")
        .addEventListener("change", filterQuestions);

    document.getElementById("difficultyFilter")
        .addEventListener("change", filterQuestions);

    document.getElementById("questionForm")
        .addEventListener("submit", saveQuestion);

}

function filterQuestions() {

    const keyword =
        document.getElementById("searchQuestion")
            .value
            .toLowerCase();

    const category =
        document.getElementById("categoryFilter")
            .value;

    const difficulty =
        document.getElementById("difficultyFilter")
            .value;

    filteredQuestions = allQuestions.filter(q => {

        const matchSearch =
            q.question.toLowerCase().includes(keyword);

        const matchCategory =
            category === "" ||
            q.category === category;

        const matchDifficulty =
            difficulty === "" ||
            q.difficulty === difficulty;

        return (
            matchSearch &&
            matchCategory &&
            matchDifficulty
        );

    });

    currentPage = 1;

    renderTable();

}
/* ==========================================
   Edit Question
========================================== */

async function editQuestion(id) {

    try {

        const response = await fetch(

            API + "/question/" + id

        );

        if (!response.ok)
            throw new Error("Question not found");

        const q = await response.json();

        document.getElementById("questionId").value = q.id;

        document.getElementById("question").value = q.question;

        document.getElementById("optionA").value = q.option_a;

        document.getElementById("optionB").value = q.option_b;

        document.getElementById("optionC").value = q.option_c;

        document.getElementById("optionD").value = q.option_d;

        document.getElementById("correctAnswer").value = q.correct_answer;

        document.getElementById("category").value = q.category;

        document.getElementById("difficulty").value = q.difficulty;

        questionModal.show();

    }

    catch (err) {

        console.error(err);

        alert("Unable to load question.");

    }

}

/* ==========================================
   Save Question
========================================== */

async function saveQuestion(e) {

    e.preventDefault();

    const id = document.getElementById("questionId").value;

    const data = {

        question: document.getElementById("question").value.trim(),

        option_a: document.getElementById("optionA").value.trim(),

        option_b: document.getElementById("optionB").value.trim(),

        option_c: document.getElementById("optionC").value.trim(),

        option_d: document.getElementById("optionD").value.trim(),

        correct_answer: document.getElementById("correctAnswer").value,

        category: document.getElementById("category").value,

        difficulty: document.getElementById("difficulty").value

    };

    if (

        data.question === "" ||

        data.option_a === "" ||

        data.option_b === "" ||

        data.option_c === "" ||

        data.option_d === ""

    ) {

        alert("Please fill all fields.");

        return;

    }

    let url = API + "/add-question";

    let method = "POST";

    if (id !== "") {

        url = API + "/question/" + id;

        method = "PUT";

    }

    try {

        const response = await fetch(

            url,

            {

                method: method,

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(data)

            }

        );

        const result = await response.json();

        if (!response.ok) {

            alert(result.detail || "Unable to save.");

            return;

        }

        alert(result.message);

        questionModal.hide();

        clearForm();

        loadQuestions();

    }

    catch (err) {

        console.error(err);

        alert("Server Error");

    }

}

/* ==========================================
   Clear Form
========================================== */

function clearForm() {

    document.getElementById("questionId").value = "";

    document.getElementById("questionForm").reset();

}

/* ==========================================
   Reset Modal
========================================== */

document.getElementById("questionModal")

    .addEventListener(

        "hidden.bs.modal",

        () => {

            clearForm();

        }

    );

/* ==========================================
Delete Question
========================================== */

async function deleteQuestion(id) {

    const ok = confirm("Are you sure you want to delete this question?");

    if (!ok) return;

    try {

        const response = await fetch(

            API + "/delete/" + id,

            {

                method: "DELETE"

            }

        );

        const result = await response.json();

        if (!response.ok) {

            alert(result.detail || "Unable to delete question.");

            return;

        }

        showToast("Question deleted successfully.");

        loadQuestions();

    }

    catch (err) {

        console.error(err);

        alert("Server Error");

    }

}

/* ==========================================
   Pagination
========================================== */

function nextPage() {

    const totalPages = Math.ceil(

        filteredQuestions.length / rowsPerPage

    );

    if (currentPage < totalPages) {

        currentPage++;

        renderTable();

    }

}

function previousPage() {

    if (currentPage > 1) {

        currentPage--;

        renderTable();

    }

}

/* ==========================================
   Toast Notification
========================================== */

function showToast(message) {

    const toast = document.createElement("div");

    toast.className = "dashboard-toast";

    toast.innerHTML = message;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("show");

    }, 100);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 400);

    }, 2500);

}