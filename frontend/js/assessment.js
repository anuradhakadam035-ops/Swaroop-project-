// =========================================================
// AI CAREER GUIDANCE SYSTEM
// ASSESSMENT MODULE
// =========================================================

const API = "http://127.0.0.1:8000/api/assessment";


// =========================================================
// AUTHENTICATION
// =========================================================

const TOKEN = localStorage.getItem("token");

const USER = JSON.parse(
    localStorage.getItem("user") || "null"
);


if (!TOKEN || !USER) {

    window.location.href = "login.html";

}


// =========================================================
// VARIABLES
// =========================================================

let questions = [];

let answers = [];

let currentQuestion = 0;


// =========================================================
// ELEMENTS
// =========================================================

const question =
    document.getElementById("question");

const options =
    document.getElementById("options");

const progressBar =
    document.getElementById("progressBar");

const prevBtn =
    document.getElementById("prevBtn");

const nextBtn =
    document.getElementById("nextBtn");

const submitBtn =
    document.getElementById("submitBtn");

const timer =
    document.getElementById("time");


// =========================================================
// LOAD QUESTIONS
// =========================================================

async function loadQuestions() {

    try {

        console.log(
            "Loading questions from:",
            API + "/questions"
        );


        const response = await fetch(
            API + "/questions"
        );


        const data =
            await response.json();


        console.log(
            "Questions API response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Unable to load questions"
            );

        }


        questions = data;


        if (!Array.isArray(questions)) {

            throw new Error(
                "Invalid questions response from server."
            );

        }


        if (questions.length === 0) {

            alert(
                "No Questions Found"
            );

            return;

        }


        // Create answer array

        answers = new Array(
            questions.length
        ).fill(null);


        console.log(
            "Total questions:",
            questions.length
        );


        loadQuestion();

    }

    catch (err) {

        console.error(
            "LOAD QUESTIONS ERROR:",
            err
        );


        alert(
            "Unable to load questions.\n\n" +
            err.message
        );

    }

}


// =========================================================
// LOAD SINGLE QUESTION
// =========================================================

function loadQuestion() {

    if (
        !questions ||
        questions.length === 0
    ) {

        return;

    }


    const q =
        questions[currentQuestion];


    console.log(
        "Current question:",
        q
    );


    question.innerHTML =
        escapeHtml(q.question);


    options.innerHTML = "";


    const optionList = [

        q.option_a,
        q.option_b,
        q.option_c,
        q.option_d

    ];


    optionList.forEach(
        (option, index) => {

            const div =
                document.createElement("div");


            div.className =
                "option";


            const radio =
                document.createElement("input");


            radio.type =
                "radio";


            radio.name =
                "assessmentOption";


            radio.value =
                index;


            radio.checked =
                answers[currentQuestion] === index;


            const label =
                document.createElement("span");


            label.textContent =
                option;


            div.appendChild(radio);

            div.appendChild(label);


            // =========================================
            // SELECT OPTION
            // =========================================

            div.addEventListener(
                "click",
                function () {

                    answers[currentQuestion] =
                        index;


                    document
                        .querySelectorAll(".option")
                        .forEach(
                            item => {

                                item.classList.remove(
                                    "selected"
                                );

                            }
                        );


                    div.classList.add(
                        "selected"
                    );


                    radio.checked =
                        true;

                }
            );


            if (
                answers[currentQuestion]
                === index
            ) {

                div.classList.add(
                    "selected"
                );

            }


            options.appendChild(
                div
            );

        }
    );


    updateProgress();

}


// =========================================================
// PROGRESS
// =========================================================

function updateProgress() {

    const percent =
        (
            (currentQuestion + 1)
            /
            questions.length
        ) * 100;


    progressBar.style.width =
        percent + "%";


    progressBar.innerHTML =
        `${currentQuestion + 1} / ${questions.length}`;


    prevBtn.disabled =
        currentQuestion === 0;


    nextBtn.disabled =
        currentQuestion ===
        questions.length - 1;

}


// =========================================================
// NEXT
// =========================================================

nextBtn.onclick = function () {

    if (
        currentQuestion <
        questions.length - 1
    ) {

        currentQuestion++;

        loadQuestion();

    }

};


// =========================================================
// PREVIOUS
// =========================================================

prevBtn.onclick = function () {

    if (
        currentQuestion > 0
    ) {

        currentQuestion--;

        loadQuestion();

    }

};


// =========================================================
// SUBMIT ASSESSMENT
// =========================================================

submitBtn.onclick =
    async function () {


        // =============================================
        // CHECK ALL QUESTIONS ANSWERED
        // =============================================

        const unanswered = [];


        answers.forEach(
            (answer, index) => {

                if (
                    answer === null ||
                    answer === undefined
                ) {

                    unanswered.push(
                        index + 1
                    );

                }

            }
        );


        if (
            unanswered.length > 0
        ) {

            alert(
                "Please answer all questions before submitting.\n\n" +
                "Unanswered question(s): " +
                unanswered.join(", ")
            );


            // Go to first unanswered

            currentQuestion =
                unanswered[0] - 1;


            loadQuestion();


            return;

        }


        // =============================================
        // CONFIRM
        // =============================================

        const confirmed =
            confirm(
                "Are you sure you want to submit the assessment?"
            );


        if (!confirmed) {

            return;

        }


        // =============================================
        // CREATE PAYLOAD
        // =============================================

        const payload = {

            answers:
                answers.map(
                    (answer, index) => ({

                        question_id:
                            questions[index].id,

                        selected_answer:
                            [
                                "A",
                                "B",
                                "C",
                                "D"
                            ][answer]

                    })
                )

        };


        // =============================================
        // DEBUG
        // =============================================

        console.log(
            "================================="
        );

        console.log(
            "ASSESSMENT SUBMIT PAYLOAD"
        );

        console.log(
            JSON.stringify(
                payload,
                null,
                2
            )
        );

        console.log(
            "================================="
        );


        try {

            submitBtn.disabled =
                true;


            submitBtn.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';


            const response =
                await fetch(

                    API + "/submit",

                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Accept":
                                "application/json",

                            "Authorization":
                                "Bearer " +
                                TOKEN

                        },

                        body:
                            JSON.stringify(
                                payload
                            )

                    }

                );


            // =========================================
            // GET RESPONSE
            // =========================================

            const result =
                await response.json();


            console.log(
                "Assessment submit status:",
                response.status
            );


            console.log(
                "Assessment submit response:",
                result
            );


            // =========================================
            // ERROR
            // =========================================

            if (!response.ok) {

                let errorMessage =
                    "Assessment submission failed.";


                if (
                    Array.isArray(
                        result.detail
                    )
                ) {

                    errorMessage =
                        result.detail
                            .map(
                                error => {

                                    if (
                                        typeof error
                                        === "object"
                                    ) {

                                        return (
                                            error.loc?.join(".")
                                            +
                                            " : "
                                            +
                                            error.msg
                                        );

                                    }

                                    return String(
                                        error
                                    );

                                }
                            )
                            .join("\n");

                }

                else if (
                    typeof result.detail
                    === "object"
                ) {

                    errorMessage =
                        JSON.stringify(
                            result.detail,
                            null,
                            2
                        );

                }

                else if (
                    result.detail
                ) {

                    errorMessage =
                        result.detail;

                }


                console.error(
                    "ASSESSMENT 422 ERROR:",
                    result
                );


                alert(
                    errorMessage
                );


                return;

            }


            // =========================================
            // SUCCESS
            // =========================================

            localStorage.setItem(

                "assessmentResult",

                JSON.stringify(
                    result
                )

            );


            alert("Assessment Submitted Successfully!");

            window.location.href = "recommendations.html";

        }

        catch (error) {

            console.error(
                "ASSESSMENT SUBMIT ERROR:",
                error
            );


            alert(
                "Unable to submit assessment.\n\n" +
                error.message
            );

        }

        finally {

            submitBtn.disabled =
                false;


            submitBtn.innerHTML =
                "Submit Test";

        }

    };


// =========================================================
// TIMER
// =========================================================

let minutes = 20;

let seconds = 0;


const countdown =
    setInterval(
        () => {

            if (
                seconds === 0
            ) {

                if (
                    minutes === 0
                ) {

                    clearInterval(
                        countdown
                    );


                    submitBtn.click();


                    return;

                }


                minutes--;

                seconds = 59;

            }

            else {

                seconds--;

            }


            timer.innerHTML =

                String(
                    minutes
                ).padStart(
                    2,
                    "0"
                )

                +

                ":"

                +

                String(
                    seconds
                ).padStart(
                    2,
                    "0"
                );

        },

        1000
    );


// =========================================================
// HTML ESCAPE
// =========================================================

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

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


// =========================================================
// START
// =========================================================

loadQuestions();