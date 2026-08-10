"""
=========================================
Assessment Router
AI Career Guidance System
=========================================
"""
from security.auth import get_current_user
from models.user import User
from services.ai_service import generate_career_recommendation
from schemas.assessment import AssessmentSubmit
from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status
from models.student_answer import StudentAnswer
#from schemas.student_answer import AssessmentSubmit
from sqlalchemy.orm import Session

from database import get_db
from models.assessment_question import AssessmentQuestion
from models.assessment_result import Assessment

from schemas.assessment import (
    AssessmentQuestionCreate,
    AssessmentQuestionResponse
)

router = APIRouter(
    prefix="/api/assessment",
    tags=["Assessment"]
)

@router.post("/add-question", status_code=201)
def add_question(
    question: AssessmentQuestionCreate,
    db: Session = Depends(get_db)
):
    try:
        new_question = AssessmentQuestion(
            question=question.question,
            option_a=question.option_a,
            option_b=question.option_b,
            option_c=question.option_c,
            option_d=question.option_d,
            correct_answer=question.correct_answer,
            category=question.category,
            difficulty=question.difficulty
        )

        db.add(new_question)
        db.commit()
        db.refresh(new_question)

        return {
            "success": True,
            "message": "Question Added Successfully",
            "id": new_question.id
        }

    except Exception as e:
        db.rollback()
        print("ERROR:", e)
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

# ==========================================
# Get All Questions
# ==========================================

@router.get(
    "/questions",
    response_model=list[AssessmentQuestionResponse]
)
def get_questions(
    db: Session = Depends(get_db)
):

    questions = db.query(
        AssessmentQuestion
    ).all()

    return questions


# ==========================================
# Get Single Question
# ==========================================

@router.get(
    "/question/{question_id}",
    response_model=AssessmentQuestionResponse
)
def get_question(
    question_id: int,
    db: Session = Depends(get_db)
):

    question = db.query(
        AssessmentQuestion
    ).filter(
        AssessmentQuestion.id == question_id
    ).first()

    if not question:

        raise HTTPException(

            status_code=404,

            detail="Question Not Found"

        )

    return question


# ==========================================
# Delete Question
# ==========================================

@router.delete("/delete/{question_id}")
def delete_question(
    question_id: int,
    db: Session = Depends(get_db)
):

    question = db.query(
        AssessmentQuestion
    ).filter(
        AssessmentQuestion.id == question_id
    ).first()

    if not question:

        raise HTTPException(
            status_code=404,
            detail="Question Not Found"
        )

    db.delete(question)

    db.commit()

    return {

        "success": True,

        "message": "Question Deleted"

    }

    # ==========================================
# Update Question
# ==========================================

@router.put("/question/{question_id}")
def update_question(
    question_id: int,
    question: AssessmentQuestionCreate,
    db: Session = Depends(get_db)
):

    db_question = db.query(
        AssessmentQuestion
    ).filter(
        AssessmentQuestion.id == question_id
    ).first()

    if not db_question:

        raise HTTPException(
            status_code=404,
            detail="Question Not Found"
        )

    db_question.question = question.question
    db_question.option_a = question.option_a
    db_question.option_b = question.option_b
    db_question.option_c = question.option_c
    db_question.option_d = question.option_d
    db_question.correct_answer = question.correct_answer
    db_question.category = question.category
    db_question.difficulty = question.difficulty

    db.commit()
    db.refresh(db_question)

    return {

        "success": True,

        "message": "Question Updated Successfully"

    }
    # ==========================================
# Submit Assessment
# ==========================================

@router.post("/submit")
def submit_assessment(
    data: AssessmentSubmit,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        print("\n===================================")
        print("ASSESSMENT SUBMISSION")
        print("===================================")

        print(
            "USER ID:",
            current_user.id
        )

        print(
            "ANSWERS:",
            data.answers
        )


        # ==========================================
        # VALIDATE ANSWERS
        # ==========================================

        if not data.answers:

            raise HTTPException(
                status_code=400,
                detail="No answers submitted"
            )


        score = 0

        total_questions = len(
            data.answers
        )


        # ==========================================
        # CHECK ANSWERS
        # ==========================================

        assessment_answers = []


        for answer in data.answers:

            print(
                "Checking question:",
                answer.question_id
            )


            question = db.query(
                AssessmentQuestion
            ).filter(
                AssessmentQuestion.id ==
                answer.question_id
            ).first()


            if not question:

                raise HTTPException(
                    status_code=404,
                    detail=
                    f"Question {answer.question_id} not found"
                )


            if (
                question.correct_answer
                .strip()
                .upper()
                ==
                answer.selected_answer
                .strip()
                .upper()
            ):

                score += 1


            assessment_answers.append({

                "question":
                    question.question,

                "selected_answer":
                    answer.selected_answer,

                "correct_answer":
                    question.correct_answer,

                "category":
                    question.category

            })


        # ==========================================
        # CALCULATE SCORE
        # ==========================================

        percentage = (

            int(
                (score / total_questions)
                * 100
            )

            if total_questions

            else 0

        )


        print(
            "SCORE:",
            score,
            "/",
            total_questions
        )

        print(
            "PERCENTAGE:",
            percentage
        )


        # ==========================================
        # AI RECOMMENDATION
        # ==========================================

        print(
            "Generating AI recommendation..."
        )


        ai_result =generate_career_recommendation({

                "score":
                    percentage,

                "answers":
                    assessment_answers

            })


        print(
            "AI RESULT:",
            ai_result
        )


        if not ai_result:

            raise HTTPException(
                status_code=500,
                detail=
                "AI recommendation service returned no result"
            )


        # ==========================================
        # CREATE ASSESSMENT
        # ==========================================

        assessment = Assessment(

            user_id=
                current_user.id,

            score=
                percentage,

            career=
                ai_result.get(
                    "career",
                    "Not Available"
                ),

            career_match=
                ai_result.get(
                    "career_match",
                    ""
                ),

            strengths=
                ",".join(
                    ai_result.get(
                        "strengths",
                        []
                    )
                ),

            skill_gap=
                ",".join(
                    ai_result.get(
                        "skill_gap",
                        []
                    )
                ),

            #roadmap=
                #",".join(
                    #ai_result.get(
                     #   "roadmap",
                    #    []
                    #)
               # ),

            summary=
                ai_result.get(
                    "summary",
                    ""
                )

        )


        db.add(assessment)

        db.commit()

        db.refresh(assessment)


        print(
            "ASSESSMENT SAVED:",
            assessment.id
        )


        print(
            "===================================\n"
        )


        return {

            "success":
                True,

            "score":
                percentage,

            "career":
                ai_result.get(
                    "career"
                ),

            "career_match":
                ai_result.get(
                    "career_match"
                ),

            "strengths":
                ai_result.get(
                    "strengths",
                    []
                ),

            "skill_gap":
                ai_result.get(
                    "skill_gap",
                    []
                ),

            "roadmap":
                ai_result.get(
                    "roadmap",
                    []
                ),

            "summary":
                ai_result.get(
                    "summary",
                    ""
                )

        }


    except HTTPException:

        raise


    except Exception as e:

        db.rollback()

        import traceback

        print("\n===================================")
        print("ASSESSMENT SUBMIT ERROR")
        print("===================================")

        traceback.print_exc()

        print(
            "ERROR TYPE:",
            type(e).__name__
        )

        print(
            "ERROR:",
            str(e)
        )

        print(
            "===================================\n"
        )


        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
        # Get My Assessment
# ==========================================

@router.get("/result")
def get_my_result(

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    result = db.query(Assessment).filter(

        Assessment.user_id == current_user.id

    ).order_by(

        Assessment.id.desc()

    ).first()

    if not result:

        raise HTTPException(

            status_code=404,

            detail="Assessment not found"

        )

    return {

    "score": result.score,

    "career": result.career,

    "career_match": result.career_match,

    "strengths":
        result.strengths.split(",")
        if result.strengths
        else [],

    "skill_gap":
        result.skill_gap.split(",")
        if result.skill_gap
        else [],

    "roadmap":
        result.roadmap.split("|")
        if result.roadmap
        else [],

    "summary":
        result.summary

}