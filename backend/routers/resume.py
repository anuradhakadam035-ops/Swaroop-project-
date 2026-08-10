from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
import os
import uuid
import shutil

from database import get_db
from security.auth import get_current_user

from models.user import User
from models.resume import Resume

from services.pdf_service import extract_text
from services.skill_service import detect_skills
from services.ats_service import calculate_ats
from services.ai_service import generate_resume_analysis

router = APIRouter(
    prefix="/api/resume",
    tags=["Resume"]
)

UPLOAD_FOLDER = "uploads/resumes"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ==========================================
# Upload Resume
# ==========================================

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    extension = file.filename.split(".")[-1].lower()

    if extension not in ["pdf", "docx"]:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are allowed."
        )

    filename = f"{uuid.uuid4()}.{extension}"

    filepath = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # =====================================
    # Extract Resume Text
    # =====================================

    resume_text = extract_text(filepath)

    # =====================================
    # Detect Skills
    # =====================================

    skills = detect_skills(resume_text)

    # =====================================
    # ATS Score
    # =====================================

    ats_score = calculate_ats(skills)

    # =====================================
    # AI Analysis
    # =====================================

    analysis = generate_resume_analysis(resume_text)

    analysis["ats_score"] = ats_score

    # =====================================
    # Save Resume
    # =====================================

    resume = Resume(

        user_id=current_user.id,

        file_path=filepath,

        resume_score=analysis["resume_score"],

        ats_score=ats_score,

        detected_skills=",".join(skills),

        missing_skills=",".join(
            analysis["missing_skills"]
        ),

        projects=",".join(
            analysis["projects"]
        ),

        courses=",".join(
            analysis["courses"]
        ),

        summary=analysis["summary"]

    )

    db.add(resume)

    db.commit()

    db.refresh(resume)

    return {

        "success": True,

        "analysis": {

            "resume_score": resume.resume_score,

            "ats_score": resume.ats_score,

            "skills": skills,

            "missing_skills": analysis["missing_skills"],

            "projects": analysis["projects"],

            "courses": analysis["courses"],

            "summary": analysis["summary"]

        }

    }


# ==========================================
# Get Resume Report
# ==========================================

@router.get("/report")
def get_resume_report(

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    resume = db.query(Resume).filter(

        Resume.user_id == current_user.id

    ).order_by(

        Resume.id.desc()

    ).first()

    if not resume:

        raise HTTPException(

            status_code=404,

            detail="Resume not found."

        )

    return {

        "resume_score": resume.resume_score,

        "ats_score": resume.ats_score,

        "skills": resume.detected_skills.split(","),

        "missing_skills": resume.missing_skills.split(","),

        "projects": resume.projects.split(","),

        "courses": resume.courses.split(","),

        "summary": resume.summary

    }


# ==========================================
# Delete Resume
# ==========================================

@router.delete("/delete")
def delete_resume(

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    resume = db.query(Resume).filter(

        Resume.user_id == current_user.id

    ).first()

    if not resume:

        raise HTTPException(

            status_code=404,

            detail="Resume not found."

        )

    if os.path.exists(resume.file_path):

        os.remove(resume.file_path)

    db.delete(resume)

    db.commit()

    return {

        "success": True,

        "message": "Resume deleted successfully."

    }