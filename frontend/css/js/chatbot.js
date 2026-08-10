// ==========================================
// AI Career Chatbot
// ==========================================

const API = "http://127.0.0.1:8000/api/chatbot/ask";

const TOKEN = localStorage.getItem("token");

if (!TOKEN) {
    window.location.href = "login.html";
}

const chatBox = document.getElementById("chatBox");
const input = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");

// ==========================================
// Send Message
// ==========================================

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        sendMessage();

    }

});

// ==========================================
// Send
// ==========================================

async function sendMessage() {

    const message = input.value.trim();

    if (message === "") return;

    addUserMessage(message);

    input.value = "";

    const typing = showTyping();

    try {

        const response = await fetch(API, {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                "Authorization": "Bearer " + TOKEN

            },

            body: JSON.stringify({

                message: message

            })

        });

        const data = await response.json();

        typing.remove();

        addBotMessage(data.reply);

    }

    catch (err) {

        typing.remove();

        addBotMessage(

            "❌ Unable to connect to AI Assistant."

        );

    }

}

// ==========================================
// User Bubble
// ==========================================

function addUserMessage(text) {

    const div = document.createElement("div");

    div.className = "user-message";

    div.innerHTML = text;

    chatBox.appendChild(div);

    scrollBottom();

}

// ==========================================
// Bot Bubble
// ==========================================

function addBotMessage(text) {

    const div = document.createElement("div");

    div.className = "bot-message";

    typeWriter(div, text);

    chatBox.appendChild(div);

    scrollBottom();

}

// ==========================================
// Typing Animation
// ==========================================

function showTyping() {

    const typing = document.createElement("div");

    typing.className = "typing";

    typing.innerHTML = `

        <span></span>

        <span></span>

        <span></span>

    `;

    chatBox.appendChild(typing);

    scrollBottom();

    return typing;

}

// ==========================================
// Typewriter Effect
// ==========================================

function typeWriter(element, text) {

    let i = 0;

    const speed = 18;

    const timer = setInterval(() => {

        element.innerHTML += text.charAt(i);

        i++;

        scrollBottom();

        if (i >= text.length) {

            clearInterval(timer);

        }

    }, speed);

}

// ==========================================
// Scroll
// ==========================================

function scrollBottom() {

    chatBox.scrollTop = chatBox.scrollHeight;

}