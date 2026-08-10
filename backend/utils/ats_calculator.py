def calculate_ats(skills):

    total = 20

    score = int((len(skills) / total) * 100)

    if score > 100:

        score = 100

    return score