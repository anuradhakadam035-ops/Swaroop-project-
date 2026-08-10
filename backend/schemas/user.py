"""
=========================================
User Schemas
AI Career Guidance System
=========================================
"""

from pydantic import BaseModel
from pydantic import EmailStr
from typing import Optional


# =====================================
# Register Schema
# =====================================

class UserRegister(BaseModel):

    full_name: str

    email: EmailStr

    mobile: str

    college: str

    branch: str

    year: str

    skills: Optional[str] = None

    interests: Optional[str] = None

    password: str


# =====================================
# Login Schema
# =====================================

class UserLogin(BaseModel):

    email: EmailStr

    password: str


# =====================================
# Response Schema
# =====================================

class UserResponse(BaseModel):

    id: int

    full_name: str

    email: EmailStr

    mobile: str

    college: str

    branch: str

    year: str

    skills: Optional[str]

    interests: Optional[str]

    career_match: Optional[str]

    profile_photo: Optional[str]

    class Config:

        from_attributes = True