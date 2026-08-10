import json
import google.generativeai as genai

from config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


def evaluate_answer(career, question, answer):

    prompt = f"""
You are an experienced technical interviewer.

Career:
{career}

Interview Question:
{question}

Candidate Answer:
{answer}

Evaluate the answer.

Return ONLY JSON.

{{
"score":8,
"strengths":[
""
],
"improvements":[
""
],
"feedback":""
}}
"""

    response = model.generate_content(prompt)

    text = response.text.strip()

    text = text.replace("```json", "")
    text = text.replace("```", "")
    text = text.strip()

    return json.loads(text)