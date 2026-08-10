from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from database import get_db


router = APIRouter(
    prefix="/api/admin/dashboard",
    tags=["Admin Dashboard"]
)


# =========================================================
# DASHBOARD STATISTICS
# =========================================================

@router.get("/stats")
def dashboard_stats(
    db: Session = Depends(get_db)
):

    # Total students
    total_students = db.execute(
        text("""
            SELECT COUNT(*)
            FROM users
        """)
    ).scalar() or 0


    # Total assessments
    total_assessments = db.execute(
        text("""
            SELECT COUNT(*)
            FROM assessment_result
        """)
    ).scalar() or 0


    # Total AI reports
    total_reports = db.execute(
        text("""
            SELECT COUNT(*)
            FROM resumes
        """)
    ).scalar() or 0


    # Average career match
    career_match = db.execute(
        text("""
            SELECT AVG(
                CAST(
                    NULLIF(
                        REPLACE(career_match, '%', ''),
                        ''
                    )
                    AS DECIMAL(10,2)
                )
            )
            FROM assessment_result
        """)
    ).scalar()


    if career_match is None:
        career_match = 0


    return {
        "total_students": int(total_students),
        "total_assessments": int(total_assessments),
        "ai_reports": int(total_reports),
        "career_match": round(float(career_match), 2)
    }


# =========================================================
# CAREER DISTRIBUTION
# =========================================================

@router.get("/career-distribution")
def career_distribution(
    db: Session = Depends(get_db)
):

    rows = db.execute(
        text("""
            SELECT
                career,
                COUNT(*) AS total
            FROM assessment_result
            WHERE career IS NOT NULL
              AND TRIM(career) != ''
            GROUP BY career
            ORDER BY total DESC
        """)
    ).fetchall()


    return {
        "labels": [
            row.career
            for row in rows
        ],

        "values": [
            int(row.total)
            for row in rows
        ]
    }


# =========================================================
# ASSESSMENT PROGRESS
# =========================================================

@router.get("/assessment-progress")
def assessment_progress(
    db: Session = Depends(get_db)
):

    rows = db.execute(
        text("""
            SELECT
                MONTH(created_at) AS month_number,
                MONTHNAME(created_at) AS month_name,
                COUNT(*) AS total
            FROM assessment_result
            WHERE created_at IS NOT NULL
            GROUP BY
                MONTH(created_at),
                MONTHNAME(created_at)
            ORDER BY month_number
        """)
    ).fetchall()


    return {
        "labels": [
            row.month_name
            for row in rows
        ],

        "values": [
            int(row.total)
            for row in rows
        ]
    }


# =========================================================
# TOP SKILLS
# =========================================================
@router.get("/top-skills")
def top_skills(
    db: Session = Depends(get_db)
):

    rows = db.execute(
        text("""
            SELECT skills
            FROM users
            WHERE skills IS NOT NULL
              AND TRIM(skills) <> ''
        """)
    ).fetchall()

    skill_count = {}

    for row in rows:

        skills_text = row[0]

        if not skills_text:
            continue

        skills = skills_text.split(",")

        for skill in skills:

            skill = skill.strip()

            if not skill:
                continue

            key = skill.lower()

            if key not in skill_count:

                skill_count[key] = {
                    "name": skill,
                    "count": 0
                }

            skill_count[key]["count"] += 1


    sorted_skills = sorted(
        skill_count.values(),
        key=lambda x: x["count"],
        reverse=True
    )


    sorted_skills = sorted_skills[:8]


    return {
        "labels": [
            item["name"]
            for item in sorted_skills
        ],

        "values": [
            item["count"]
            for item in sorted_skills
        ]
    }
# =========================================================
# RECENT STUDENTS
# =========================================================

@router.get("/recent-students")
def recent_students(
    db: Session = Depends(get_db)
):

    rows = db.execute(
        text("""
            SELECT
                u.id,
                u.full_name,
                u.branch,

                (
                    SELECT ar.career
                    FROM assessment_result ar
                    WHERE ar.user_id = u.id
                    ORDER BY ar.created_at DESC
                    LIMIT 1
                ) AS career,

                (
                    SELECT ar.id
                    FROM assessment_result ar
                    WHERE ar.user_id = u.id
                    ORDER BY ar.created_at DESC
                    LIMIT 1
                ) AS assessment_id

            FROM users u

            ORDER BY u.created_at DESC

            LIMIT 5
        """)
    ).fetchall()


    students = []


    for row in rows:

        if row.assessment_id:

            status = "Assessed"

        else:

            status = "Not Assessed"


        students.append({

            "id": row.id,

            "name": row.full_name,

            "branch": row.branch,

            "career": row.career or "-",

            "status": status

        })


    return students