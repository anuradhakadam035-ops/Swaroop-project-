from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from fastapi import UploadFile, File
import os
import shutil
import uuid
from schemas.profile import (
    ProfileUpdate,
    ProfileResponse
)

from security.auth import get_current_user

router = APIRouter(
    prefix="/api/profile",
    tags=["Profile"]
)
@router.post("/upload-photo")
def upload_photo(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    os.makedirs("uploads/profile", exist_ok=True)

    extension = file.filename.split(".")[-1]

    filename = f"{uuid.uuid4()}.{extension}"

    filepath = f"uploads/profile/{filename}"

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    current_user.profile_photo = filepath

    db.commit()

    # IMPORTANT
    db.refresh(current_user)

    return {
        "success": True,
        "photo": f"http://127.0.0.1:8000/{filepath}"
    }

# ==========================================
# Get Profile
# ==========================================

@router.get(
    "/",
    response_model=ProfileResponse
)
def get_profile(

    current_user: User = Depends(get_current_user),

    db: Session = Depends(get_db)

):

    return {
    "id": current_user.id,
    "full_name": current_user.full_name,
    "email": current_user.email,
    "mobile": current_user.mobile,
    "college": current_user.college,
    "branch": current_user.branch,
    "year": current_user.year,
    "skills": current_user.skills,
    "interests": current_user.interests,
    "profile_photo": current_user.profile_photo
}


# ==========================================
# Update Profile
# ==========================================

@router.put("/")
def update_profile(

    profile: ProfileUpdate,

    current_user: User = Depends(get_current_user),

    db: Session = Depends(get_db)

):

    current_user.full_name = profile.full_name
    current_user.mobile = profile.mobile
    current_user.college = profile.college
    current_user.branch = profile.branch
    current_user.year = profile.year
    current_user.skills = profile.skills
    current_user.interests = profile.interests

    db.commit()

    return {

        "success": True,

        "message": "Profile Updated Successfully"

    }