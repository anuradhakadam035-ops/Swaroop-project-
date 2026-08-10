import google.generativeai as genai

from config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


def ask_ai(message):

    prompt = f"""
You are CareerBot.

You help students with

Career Guidance

Resume

Interview

Learning Roadmap

Courses

Internships

Programming

Answer professionally.

Question:

{message}
"""

    response = model.generate_content(prompt)

    return response.text