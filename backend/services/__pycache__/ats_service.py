def calculate_ats(skills):

    total_skills = 18

    score = int(

        (len(skills) / total_skills) * 100

    )

    return min(score, 100)