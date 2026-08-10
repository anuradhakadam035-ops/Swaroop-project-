const API = "http://127.0.0.1:8000/api/roadmap";

const TOKEN = localStorage.getItem("token");

const USER = JSON.parse(localStorage.getItem("user"));

loadRoadmap();

async function loadRoadmap() {

    const response = await fetch(

        API + "/" + USER.id,

        {

            headers: {

                Authorization:

                    "Bearer " + TOKEN

            }

        }

    );

    const data = await response.json();

    console.log(data);

    document.getElementById("careerName").innerHTML = data.career;

    animateProgress(data.overall_progress);

    let html = "";

    data.roadmap.forEach(item => {

        let resources = "";

        item.resources.forEach(r => {

            resources += `

            <span class="resource">

            ${r}

            </span>

            `;

        });

        html += `

        <div class="timeline-item ${item.status}">

            <h5>

            ${item.month}

            </h5>

            <h3>

            ${item.title}

            </h3>

            <p>

            ${item.description}

            </p>

            <div class="resources">

            ${resources}

            </div>

            <div class="status">

            ${item.status.toUpperCase()}

            </div>

        </div>

        `;

    });

    document.getElementById("timeline").innerHTML = html;

}

function animateProgress(value) {

    let current = 0;

    const progress = document.getElementById("progressBar");

    const text = document.getElementById("overallProgress");

    const timer = setInterval(() => {

        current++;

        progress.style.width = current + "%";

        text.innerHTML = current + "%";

        if (current >= value) {

            clearInterval(timer);

        }

    }, 20);

}

document.getElementById("downloadBtn")

    .addEventListener("click", () => {

        html2pdf()

            .from(document.body)

            .save("AI_Career_Roadmap.pdf");

    });