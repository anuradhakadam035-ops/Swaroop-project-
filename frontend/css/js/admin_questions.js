// =========================================================
// VISIONX ADMIN QUESTION MANAGEMENT
// =========================================================

const API = "http://127.0.0.1:8000/api/admin";


// =========================================================
// AUTHENTICATION
// =========================================================

const adminToken =
    localStorage.getItem("adminToken");


if (!adminToken) {

    console.warn(
        "Admin token not found."
    );

}


// =========================================================
// DOM ELEMENTS
// =========================================================

const questionTable =
    document.getElementById("questionTable");

const questionForm =
    document.getElementById("questionForm");

const searchQuestion =
    document.getElementById("searchQuestion");

const categoryFilter =
    document.getElementById("categoryFilter");

const difficultyFilter =
    document.getElementById("difficultyFilter");

const pageInfo =
    document.getElementById("pageInfo");


// =========================================================
// DATA
// =========================================================

let allQuestions = [];

let filteredQuestions = [];

let currentPage = 1;

const rowsPerPage = 8;


// =========================================================
// AUTH HEADER
// =========================================================

function authHeaders() {

    return {

        "Content-Type":
            "application/json",

        "Accept":
            "application/json",

        "Authorization":
            "Bearer " + adminToken
    };
}


// =========================================================
// PAGE LOAD
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadQuestions();

    }
);


// =========================================================
// LOAD QUESTIONS
// =========================================================

async function loadQuestions() {

    try {

        showLoading();


        const response =
            await fetch(
                API + "/questions",
                {
                    method: "GET",

                    headers:
                        authHeaders()
                }
            );


        if (response.status === 401) {

            alert(
                "Admin session expired. Please login again."
            );

            localStorage.removeItem(
                "adminToken"
            );

            window.location.href =
                "admin_log.html";

            return;
        }


        if (!response.ok) {

            const error =
                await response.text();

            throw new Error(error);
        }


        allQuestions =
            await response.json();


        filteredQuestions =
            [...allQuestions];


        currentPage = 1;


        renderQuestions();


        updateStatistics();


        console.log(
            "Questions loaded:",
            allQuestions
        );


    }

    catch (error) {

        console.error(
            "LOAD QUESTIONS ERROR:",
            error
        );


        showEmpty(
            "Unable to load questions"
        );

    }

}


// =========================================================
// RENDER QUESTIONS
// =========================================================

function renderQuestions() {

    if (!questionTable)
        return;


    questionTable.innerHTML = "";


    const start =
        (currentPage - 1)
        * rowsPerPage;


    const end =
        start + rowsPerPage;


    const pageQuestions =
        filteredQuestions.slice(
            start,
            end
        );


    if (
        pageQuestions.length === 0
    ) {

        questionTable.innerHTML = `

            <tr>

                <td colspan="5">

                    <div class="empty-state">

                        <div class="empty-icon">

                            <i class="fa-solid fa-file-circle-question"></i>

                        </div>

                        <h3>
                            No Questions Found
                        </h3>

                        <p>
                            Add your first question using the Add Question button.
                        </p>

                    </div>

                </td>

            </tr>

        `;

    }


    pageQuestions.forEach(
        question => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    <strong>
                        #${question.id}
                    </strong>
                </td>


                <td>

                    <div class="question-text">

                        ${escapeHtml(
                question.question
            )}

                    </div>

                </td>


                <td>

                    <span class="category-badge">

                        ${escapeHtml(
                question.category
            )}

                    </span>

                </td>


                <td>

                    <span class="difficulty ${getDifficultyClass(question.difficulty)}">

                        ${escapeHtml(
                question.difficulty
            )}

                    </span>

                </td>


                <td>

                    <button
                        class="question-action"
                        onclick="editQuestion(${question.id})"
                        title="Edit">

                        <i class="fa-solid fa-pen"></i>

                    </button>


                    <button
                        class="question-action delete"
                        onclick="deleteQuestion(${question.id})"
                        title="Delete">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </td>

            `;


            questionTable.appendChild(
                row
            );

        }
    );


    updatePagination();

}


// =========================================================
// DIFFICULTY CLASS
// =========================================================

function getDifficultyClass(
    difficulty
) {

    if (!difficulty)
        return "";


    return difficulty
        .toLowerCase();

}


// =========================================================
// SEARCH + FILTER
// =========================================================

function applyFilters() {

    const keyword =
        searchQuestion
            ?.value
            .toLowerCase()
            .trim() || "";


    const category =
        categoryFilter
            ?.value || "";


    const difficulty =
        difficultyFilter
            ?.value || "";


    filteredQuestions =
        allQuestions.filter(
            question => {

                const matchesSearch =

                    question.question
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    question.category
                        .toLowerCase()
                        .includes(keyword);


                const matchesCategory =

                    !category ||

                    question.category
                    === category;


                const matchesDifficulty =

                    !difficulty ||

                    question.difficulty
                    === difficulty;


                return (

                    matchesSearch &&

                    matchesCategory &&

                    matchesDifficulty

                );

            }
        );


    currentPage = 1;

    renderQuestions();

}


if (searchQuestion) {

    searchQuestion.addEventListener(
        "input",
        applyFilters
    );

}


if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        applyFilters
    );

}


if (difficultyFilter) {

    difficultyFilter.addEventListener(
        "change",
        applyFilters
    );

}


// =========================================================
// PAGINATION
// =========================================================

function updatePagination() {

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredQuestions.length
                / rowsPerPage
            )
        );


    if (pageInfo) {

        pageInfo.textContent =
            `Page ${currentPage} of ${totalPages}`;

    }

}


// =========================================================
// PREVIOUS PAGE
// =========================================================

function previousPage() {

    if (currentPage > 1) {

        currentPage--;

        renderQuestions();

    }

}


// =========================================================
// NEXT PAGE
// =========================================================

function nextPage() {

    const totalPages =
        Math.ceil(
            filteredQuestions.length
            / rowsPerPage
        );


    if (
        currentPage < totalPages
    ) {

        currentPage++;

        renderQuestions();

    }

}


// =========================================================
// ADD QUESTION
// =========================================================

if (questionForm) {

    questionForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const questionId =
                document.getElementById(
                    "questionId"
                )?.value;


            const data = {

                question:
                    document.getElementById(
                        "question"
                    ).value.trim(),

                option_a:
                    document.getElementById(
                        "optionA"
                    ).value.trim(),

                option_b:
                    document.getElementById(
                        "optionB"
                    ).value.trim(),

                option_c:
                    document.getElementById(
                        "optionC"
                    ).value.trim(),

                option_d:
                    document.getElementById(
                        "optionD"
                    ).value.trim(),

                correct_answer:
                    document.getElementById(
                        "correctAnswer"
                    ).value,

                category:
                    document.getElementById(
                        "category"
                    ).value,

                difficulty:
                    document.getElementById(
                        "difficulty"
                    ).value

            };


            try {

                let response;


                // =================================================
                // EDIT
                // =================================================

                if (questionId) {

                    response =
                        await fetch(

                            API +
                            "/question/" +
                            questionId,

                            {

                                method:
                                    "PUT",

                                headers:
                                    authHeaders(),

                                body:
                                    JSON.stringify(
                                        data
                                    )
                            }

                        );

                }

                // =================================================
                // ADD
                // =================================================

                else {

                    response =
                        await fetch(

                            API +
                            "/question",

                            {

                                method:
                                    "POST",

                                headers:
                                    authHeaders(),

                                body:
                                    JSON.stringify(
                                        data
                                    )
                            }

                        );

                }


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(

                        result.detail ||

                        "Unable to save question"

                    );

                }


                alert(
                    result.message ||
                    "Question saved successfully"
                );


                questionForm.reset();


                document.getElementById(
                    "questionId"
                ).value = "";


                closeQuestionModal();


                await loadQuestions();


            }

            catch (error) {

                console.error(
                    "SAVE QUESTION ERROR:",
                    error
                );


                alert(
                    "Unable to save question: "
                    + error.message
                );

            }

        }
    );

}


// =========================================================
// EDIT QUESTION
// =========================================================

async function editQuestion(id) {

    try {

        const response =
            await fetch(

                API +
                "/question/" +
                id,

                {

                    method: "GET",

                    headers:
                        authHeaders()
                }

            );


        const question =
            await response.json();


        if (!response.ok) {

            throw new Error(
                question.detail
            );

        }


        document.getElementById(
            "questionId"
        ).value =
            question.id;


        document.getElementById(
            "question"
        ).value =
            question.question;


        document.getElementById(
            "optionA"
        ).value =
            question.option_a;


        document.getElementById(
            "optionB"
        ).value =
            question.option_b;


        document.getElementById(
            "optionC"
        ).value =
            question.option_c;


        document.getElementById(
            "optionD"
        ).value =
            question.option_d;


        document.getElementById(
            "correctAnswer"
        ).value =
            question.correct_answer;


        document.getElementById(
            "category"
        ).value =
            question.category;


        document.getElementById(
            "difficulty"
        ).value =
            question.difficulty;


        openQuestionModal();

    }

    catch (error) {

        console.error(
            "EDIT QUESTION ERROR:",
            error
        );

        alert(
            "Unable to load question."
        );

    }

}


// =========================================================
// DELETE QUESTION
// =========================================================

async function deleteQuestion(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this question?"
        );


    if (!confirmed)
        return;


    try {

        const response =
            await fetch(

                API +
                "/question/" +
                id,

                {

                    method: "DELETE",

                    headers:
                        authHeaders()
                }

            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.detail ||
                "Delete failed"
            );

        }


        alert(
            result.message
        );


        await loadQuestions();

    }

    catch (error) {

        console.error(
            "DELETE QUESTION ERROR:",
            error
        );


        alert(
            "Unable to delete question: "
            + error.message
        );

    }

}


// =========================================================
// MODAL
// =========================================================

function openQuestionModal() {

    const modalElement =
        document.getElementById(
            "questionModal"
        );


    if (!modalElement)
        return;


    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );


    modal.show();

}


function closeQuestionModal() {

    const modalElement =
        document.getElementById(
            "questionModal"
        );


    if (!modalElement)
        return;


    const modal =
        bootstrap.Modal.getInstance(
            modalElement
        );


    if (modal)
        modal.hide();

}


// =========================================================
// ADD BUTTON
// =========================================================

const addQuestionBtn =
    document.getElementById(
        "addQuestionBtn"
    );


if (addQuestionBtn) {

    addQuestionBtn.addEventListener(
        "click",
        function () {

            if (questionForm) {

                questionForm.reset();

            }


            const id =
                document.getElementById(
                    "questionId"
                );


            if (id)
                id.value = "";


            openQuestionModal();

        }
    );

}


// =========================================================
// STATISTICS
// =========================================================

function updateStatistics() {

    const total =
        allQuestions.length;


    const totalElement =
        document.getElementById(
            "totalQuestions"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    const software =
        allQuestions.filter(
            q =>
                q.category === "Software"
        ).length;


    const ai =
        allQuestions.filter(
            q =>
                q.category === "AI"
        ).length;


    const easy =
        allQuestions.filter(
            q =>
                q.difficulty === "Easy"
        ).length;


    const softwareElement =
        document.getElementById(
            "softwareCount"
        );


    const aiElement =
        document.getElementById(
            "aiCount"
        );


    const easyElement =
        document.getElementById(
            "easyCount"
        );


    if (softwareElement)
        softwareElement.textContent =
            software;


    if (aiElement)
        aiElement.textContent =
            ai;


    if (easyElement)
        easyElement.textContent =
            easy;

}


// =========================================================
// LOADING
// =========================================================

function showLoading() {

    if (!questionTable)
        return;


    questionTable.innerHTML = `

        <tr>

            <td colspan="5">

                <div class="loading-state">

                    <i class="fa-solid fa-spinner fa-spin"></i>

                    Loading questions...

                </div>

            </td>

        </tr>

    `;

}


// =========================================================
// EMPTY
// =========================================================

function showEmpty(message) {

    if (!questionTable)
        return;


    questionTable.innerHTML = `

        <tr>

            <td colspan="5">

                <div class="empty-state">

                    <div class="empty-icon">

                        <i class="fa-solid fa-triangle-exclamation"></i>

                    </div>

                    <h3>
                        ${message}
                    </h3>

                    <p>
                        Check the backend server and try again.
                    </p>

                </div>

            </td>

        </tr>

    `;

}


// =========================================================
// HTML ESCAPE
// =========================================================

function escapeHtml(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}