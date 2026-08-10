from pydantic import BaseModel


from pydantic import BaseModel

class RegisterSchema(BaseModel):

    full_name: str
    email: str
    mobile: str
    college: str
    branch: str
    year: str
    skills: str
    interests: str
    password: str


class LoginSchema(BaseModel):

    email: str
    password: str