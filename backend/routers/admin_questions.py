from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from database import get_db

from models.assessment_question import AssessmentQuestion

from schemas.admin_questions import (
    QuestionCreate,
    QuestionUpdate
)

from security.admin_auth import get_current_admin


router = APIRouter(
    prefix="/api/admin",
    tags=["Admin Questions"]
)


# =========================================================
# GET ALL QUESTIONS
# =========================================================

@router.get("/questions")
def get_questions(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):

    questions = db.query(
        AssessmentQuestion
    ).order_by(
        AssessmentQuestion.id.desc()
    ).all()

    return [
        {
            "id": q.id,
            "question": q.question,

            "option_a": q.option_a,
            "option_b": q.option_b,
            "option_c": q.option_c,
            "option_d": q.option_d,

            "correct_answer": q.correct_answer,

            "category": q.category,
            "difficulty": q.difficulty
        }

        for q in questions
    ]


# =========================================================
# GET SINGLE QUESTION
# =========================================================

@router.get("/question/{question_id}")
def get_question(
    question_id: int,

    db: Session = Depends(get_db),

    current_admin=Depends(get_current_admin)
):

    question = db.query(
        AssessmentQuestion
    ).filter(
        AssessmentQuestion.id == question_id
    ).first()

    if not question:

        raise HTTPException(
            status_code=404,
            detail="Question not found"
        )

    return {

        "id": question.id,

        "question": question.question,

        "option_a": question.option_a,
        "option_b": question.option_b,
        "option_c": question.option_c,
        "option_d": question.option_d,

        "correct_answer": question.correct_answer,

        "category": question.category,

        "difficulty": question.difficulty
    }


# =========================================================
# ADD QUESTION
# =========================================================

@router.post("/question")
def create_question(

    data: QuestionCreate,

    db: Session = Depends(get_db),

    current_admin=Depends(get_current_admin)
):

    try:

        new_question = AssessmentQuestion(

            question=data.question,

            option_a=data.option_a,
            option_b=data.option_b,
            option_c=data.option_c,
            option_d=data.option_d,

            correct_answer=data.correct_answer,

            category=data.category,

            difficulty=data.difficulty
        )

        db.add(new_question)

        db.commit()

        db.refresh(new_question)

        return {

            "message":
                "Question added successfully",

            "question": {

                "id":
                    new_question.id,

                "question":
                    new_question.question,

                "option_a":
                    new_question.option_a,

                "option_b":
                    new_question.option_b,

                "option_c":
                    new_question.option_c,

                "option_d":
                    new_question.option_d,

                "correct_answer":
                    new_question.correct_answer,

                "category":
                    new_question.category,

                "difficulty":
                    new_question.difficulty
            }
        }

    except Exception as e:

        db.rollback()

        print(
            "ADD QUESTION ERROR:",
            str(e)
        )

        raise HTTPException(

            status_code=500,

            detail=str(e)
        )


# =========================================================
# UPDATE QUESTION
# =========================================================

@router.put("/question/{question_id}")
def update_question(

    question_id: int,

    data: QuestionUpdate,

    db: Session = Depends(get_db),

    current_admin=Depends(get_current_admin)
):

    question = db.query(
        AssessmentQuestion
    ).filter(
        AssessmentQuestion.id == question_id
    ).first()

    if not question:

        raise HTTPException(

            status_code=404,

            detail="Question not found"
        )


    update_data = data.model_dump(
        exclude_unset=True
    )


    for key, value in update_data.items():

        setattr(
            question,
            key,
            value
        )


    db.commit()

    db.refresh(question)


    return {

        "message":
            "Question updated successfully",

        "question": {

            "id":
                question.id,

            "question":
                question.question,

            "option_a":
                question.option_a,

            "option_b":
                question.option_b,

            "option_c":
                question.option_c,

            "option_d":
                question.option_d,

            "correct_answer":
                question.correct_answer,

            "category":
                question.category,

            "difficulty":
                question.difficulty
        }
    }


# =========================================================
# DELETE QUESTION
# =========================================================

@router.delete("/question/{question_id}")
def delete_question(

    question_id: int,

    db: Session = Depends(get_db),

    current_admin=Depends(get_current_admin)
):

    try:

        question = db.query(
            AssessmentQuestion
        ).filter(
            AssessmentQuestion.id == question_id
        ).first()


        if not question:

            raise HTTPException(

                status_code=404,

                detail="Question not found"
            )


        db.delete(question)

        db.commit()


        return {

            "message":
                "Question deleted successfully",

            "question_id":
                question_id
        }


    except HTTPException:

        raise


    except Exception as e:

        db.rollback()

        import traceback

        print(
            "DELETE QUESTION ERROR"
        )

        traceback.print_exc()


        raise HTTPException(

            status_code=500,

            detail=str(e)
        )