from pydantic import BaseModel, EmailStr


# =========================================================
# ADMIN REGISTER
# =========================================================

class AdminCreate(BaseModel):

    full_name: str

    email: EmailStr

    mobile: str | None = None

    password: str


# =========================================================
# ADMIN LOGIN
# =========================================================

class AdminLogin(BaseModel):

    email: EmailStr

    password: str