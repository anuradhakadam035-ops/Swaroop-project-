"""
=========================================
AI Recommendation Engine
=========================================
"""

def recommend(skills, interests, score):

    skills = [s.lower() for s in skills]

    interests = interests.lower()

    careers = {

        "AI Engineer":0,

        "Data Scientist":0,

        "Backend Developer":0,

        "Cyber Security Analyst":0,

        "Cloud Engineer":0

    }

    # -------------------------
    # AI Engineer
    # -------------------------

    ai_skills = [

        "python",

        "machine learning",

        "deep learning",

        "tensorflow",

        "pytorch"

    ]

    for s in ai_skills:

        if s in skills:

            careers["AI Engineer"] += 15

    # -------------------------
    # Backend
    # -------------------------

    backend = [

        "java",

        "sql",

        "spring",

        "mysql",

        "api"

    ]

    for s in backend:

        if s in skills:

            careers["Backend Developer"] += 15

    # -------------------------
    # Cyber
    # -------------------------

    cyber = [

        "linux",

        "networking",

        "ethical hacking",

        "kali",

        "security"

    ]

    for s in cyber:

        if s in skills:

            careers["Cyber Security Analyst"] += 15

    # -------------------------
    # Cloud
    # -------------------------

    cloud = [

        "aws",

        "azure",

        "docker",

        "kubernetes"

    ]

    for s in cloud:

        if s in skills:

            careers["Cloud Engineer"] += 15

    # -------------------------
    # Data Science
    # -------------------------

    data = [

        "python",

        "numpy",

        "pandas",

        "statistics"

    ]

    for s in data:

        if s in skills:

            careers["Data Scientist"] += 15

    # Interest Bonus

    if "ai" in interests:

        careers["AI Engineer"] += 20

    if "cloud" in interests:

        careers["Cloud Engineer"] += 20

    if "cyber" in interests:

        careers["Cyber Security Analyst"] += 20

    if "backend" in interests:

        careers["Backend Developer"] += 20

    if "data" in interests:

        careers["Data Scientist"] += 20

    # Assessment Score Bonus

    if score >= 8:

        for c in careers:

            careers[c] += 10

    best = max(careers, key=careers.get)

    return {

        "career": best,

        "match": careers[best],

        "all_scores": careers

    }