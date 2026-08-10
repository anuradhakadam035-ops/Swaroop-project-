from pydantic import BaseModel

class ProfileUpdate(BaseModel):

    full_name: str
    mobile: str
    college: str
    branch: str
    year: str
    skills: str
    interests: str


class ProfileResponse(BaseModel):

    id: int
    full_name: str
    email: str
    mobile: str
    college: str
    branch: str
    year: str
    skills: str |None = None
    interests: str |None = None
    profile_photo :str |None  = None

    class Config:
        from_attributes = True