SKILLS = [

    "Python",

    "Java",

    "C",

    "C++",

    "Machine Learning",

    "Deep Learning",

    "TensorFlow",

    "PyTorch",

    "Docker",

    "AWS",

    "Git",

    "Linux",

    "FastAPI",

    "React",

    "Node.js",

    "SQL",

    "MySQL",

    "MongoDB"

]


def detect_skills(text):

    found = []

    text = text.lower()

    for skill in SKILLS:

        if skill.lower() in text:

            found.append(skill)

    return found