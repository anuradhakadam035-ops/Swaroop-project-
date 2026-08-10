import json
from core.gemini import model


# ==========================================
# Resume Analysis
# ==========================================

def generate_resume_analysis(text):

    prompt = f"""
You are an ATS Resume Analyzer.

Analyze the resume below.

Return ONLY valid JSON.

{{
    "resume_score": 0,
    "missing_skills": [],
    "projects": [],
    "courses": [],
    "summary": ""
}}

Resume:

{text}
"""

    response = model.generate_content(prompt)

    cleaned = (
        response.text
        .replace("```json", "")
        .replace("```", "")
        .strip()
    )

    return json.loads(cleaned)


# ==========================================
# Career Recommendation
# ==========================================
# ==========================================
# Career Recommendation
# ==========================================

def generate_career_recommendation(answers):

    prompt = f"""
You are an Expert AI Career Counselor for the VisionX AI Career Guidance System.

A student has completed a career assessment.

Assessment Data:
{answers}


==================================================
AVAILABLE CAREER OPTIONS
==================================================

You MUST recommend exactly ONE career from this list:

1. AI Engineer
2. Software Developer
3. Cyber Security Engineer
4. Network Engineer
5. Database Administrator
6. Data Scientist
7. Cloud Engineer
8. DevOps Engineer


==================================================
CAREER EVALUATION GUIDELINES
==================================================

AI Engineer:
- Artificial Intelligence
- Machine Learning
- Deep Learning
- Python
- Neural Networks
- Computer Vision
- Generative AI

Software Developer:
- Programming
- Python
- Java
- C/C++
- Data Structures
- Algorithms
- Software Development
- Web Development
- Backend Development

Cyber Security Engineer:
- Cyber Security
- Ethical Hacking
- Network Security
- Linux
- Cryptography
- Penetration Testing
- Digital Forensics

Network Engineer:
- Computer Networks
- TCP/IP
- Routing
- Switching
- Network Protocols
- Firewalls
- Network Administration

Database Administrator:
- DBMS
- SQL
- MySQL
- PostgreSQL
- Database Management
- Database Administration
- Database Security
- Backup and Recovery

Data Scientist:
- Data Analysis
- Statistics
- Python
- Machine Learning
- Data Visualization
- Pandas
- NumPy
- Predictive Analytics

Cloud Engineer:
- Cloud Computing
- AWS
- Azure
- Google Cloud
- Infrastructure
- Virtualization
- Cloud Networking

DevOps Engineer:
- Linux
- Git
- CI/CD
- Docker
- Kubernetes
- Automation
- Cloud
- Deployment
- Infrastructure


==================================================
IMPORTANT DECISION RULE
==================================================

Analyze the student's assessment answers carefully.

Consider:

- Correct and incorrect answers
- Question categories
- Technical strengths
- Knowledge demonstrated
- Overall assessment score
- Patterns across the answers

Do NOT recommend a career only because of the overall score.

A high score means the student has strong aptitude, but the actual career should be selected based on the SUBJECT AREAS and SKILLS demonstrated in the assessment.

Choose the career with the strongest overall match.

The career field MUST contain exactly one of the eight careers listed above.


==================================================
CAREER MATCH
==================================================

career_match must be an integer between 0 and 100.

It represents how strongly the student's assessment profile matches the recommended career.


==================================================
STRENGTHS
==================================================

Return 3 to 5 specific strengths demonstrated by the student.

Do NOT make generic statements such as:

"Good student"
"Hardworking"
"Smart"

Instead mention technical abilities demonstrated by the assessment.


==================================================
SKILL GAP
==================================================

Return 2 to 5 useful skills that the student should develop for the recommended career.

These should be practical technical skills.


==================================================
ROADMAP
==================================================

Create exactly 5 career roadmap steps.

The roadmap should progress from beginner/intermediate skills toward advanced career preparation.

Example structure:

Step 1: Strengthen fundamentals
Step 2: Learn core technologies
Step 3: Build practical projects
Step 4: Learn advanced technologies
Step 5: Build portfolio and prepare for interviews


==================================================
SUMMARY
==================================================

Write a short personalized explanation of why the student is suitable for the recommended career.


==================================================
OUTPUT FORMAT
==================================================

Return ONLY valid JSON.

Do NOT use markdown.

Do NOT use ```json.

Use exactly this structure:

{{
    "career": "AI Engineer",
    "career_match": 85,
    "strengths": [
        "Strength 1",
        "Strength 2",
        "Strength 3"
    ],
    "skill_gap": [
        "Skill 1",
        "Skill 2",
        "Skill 3"
    ],
    "roadmap": [
        "Step 1",
        "Step 2",
        "Step 3",
        "Step 4",
        "Step 5"
    ],
    "summary": "Personalized career recommendation summary."
}}
"""

    response = model.generate_content(prompt)

    cleaned = (
        response.text
        .replace("```json", "")
        .replace("```", "")
        .strip()
    )

    return json.loads(cleaned)
# ==========================================
# Interview Feedback
# ==========================================

def interview_feedback(answer):

    prompt = f"""
Evaluate the interview answer.

Answer:
{answer}

Return ONLY JSON.

{{
    "score":0,
    "feedback":""
}}
"""

    response = model.generate_content(prompt)

    cleaned = (
        response.text
        .replace("```json", "")
        .replace("```", "")
        .strip()
    )

    return json.loads(cleaned)


# ==========================================
# Career Chatbot
# ==========================================

# ==========================================
# Career Chatbot
# ==========================================

def chatbot_reply(message):

    prompt = f"""
You are VisionX AI Career Assistant.

Answer professionally and briefly.

Student Question:

{message}
"""

    response = model.generate_content(prompt)

    return {
        "reply": response.text
    }