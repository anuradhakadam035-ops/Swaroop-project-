SKILLS = [

    "Python",
    "Java",
    "C",
    "C++",
    "SQL",
    "MySQL",
    "MongoDB",
    "React",
    "Node.js",
    "FastAPI",
    "Machine Learning",
    "Deep Learning",
    "TensorFlow",
    "PyTorch",
    "Docker",
    "AWS",
    "Git",
    "Linux",
    "JavaScript",
    "HTML",
    "CSS"

]

def extract_skills(text):

    detected = []

    lower = text.lower()

    for skill in SKILLS:

        if skill.lower() in lower:

            detected.append(skill)

    return detected