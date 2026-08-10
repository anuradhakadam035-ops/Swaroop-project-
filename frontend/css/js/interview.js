const API = "http://127.0.0.1:8000/api/interview";

let questions = [];

let current = 0;

document
    .getElementById("startBtn")
    .addEventListener("click", startInterview);

async function startInterview() {

    const career =
        document.getElementById("career").value;

    const response =
        await fetch(API + "/" + encodeURIComponent(career));

    const data =
        await response.json();

    questions = data.questions;

    current = 0;

    document.getElementById("interviewSection").style.display = "block";

    showQuestion();

}

function showQuestion() {

    document.getElementById("resultCard").style.display = "none";

    document.getElementById("answer").value = "";

    document.getElementById("questionNumber").innerText = current + 1;

    document.getElementById("questionText").innerText = questions[current];

}

document
    .getElementById("submitBtn")
    .addEventListener("click", submitAnswer);

async function submitAnswer() {

    const career =
        document.getElementById("career").value;

    const answer =
        document.getElementById("answer").value;

    const response =
        await fetch(API + "/evaluate", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                career: career,

                question: questions[current],

                answer: answer

            })

        });

    const data =
        await response.json();

    document.getElementById("resultCard").style.display = "block";

    document.getElementById("score").innerText = data.score;

    const strengths =
        document.getElementById("strengths");

    strengths.innerHTML = "";

    data.strengths.forEach(s => {

        strengths.innerHTML += `<li>${s}</li>`;

    });

    const improvements =
        document.getElementById("improvements");

    improvements.innerHTML = "";

    data.improvements.forEach(i => {

        improvements.innerHTML += `<li>${i}</li>`;

    });

    document.getElementById("feedback").innerText = data.feedback;

}

document
    .getElementById("nextBtn")
    .addEventListener("click", () => {

        current++;

        if (current >= questions.length) {

            alert("Interview Completed!");

            location.reload();

            return;

        }

        showQuestion();

    });