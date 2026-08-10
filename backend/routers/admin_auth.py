from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session

from database import get_db

from models.admin import Admin

from schemas.admin import (
    AdminRegister,
    AdminLogin,
    AdminResponse
)

from security.admin_auth import (
    hash_password,
    verify_password,
    create_admin_token
)


router = APIRouter(
    prefix="/api/admin",
    tags=["Admin Authentication"]
)


# ==========================================
# ADMIN REGISTER
# ==========================================

@router.post("/register")
def register_admin(
    data: AdminRegister,
    db: Session = Depends(get_db)
):

    # Check existing email

    existing_admin = db.query(Admin).filter(
        Admin.email == data.email
    ).first()

    if existing_admin:

        raise HTTPException(
            status_code=400,
            detail="Admin email already registered"
        )


    # Create admin

    admin = Admin(

        name=data.name,

        email=data.email,

        mobile=data.mobile,

        password=hash_password(
            data.password
        ),

        role="admin"

    )


    db.add(admin)

    db.commit()

    db.refresh(admin)


    return {

        "success": True,

        "message":
            "Admin Registered Successfully",

        "admin": {

            "id": admin.id,

            "name": admin.name,

            "email": admin.email,

            "role": admin.role

        }

    }


# ==========================================
# ADMIN LOGIN
# ==========================================

@router.post("/login")
def login_admin(
    data: AdminLogin,
    db: Session = Depends(get_db)
):

    admin = db.query(Admin).filter(
        Admin.email == data.email
    ).first()


    if not admin:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )


    if not verify_password(
        data.password,
        admin.password
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )


    token = create_admin_token(
        admin.id
    )


    return {

        "success": True,

        "access_token": token,

        "token_type": "bearer",

        "admin": {

            "id": admin.id,

            "name": admin.name,

            "email": admin.email,

            "mobile": admin.mobile,

            "role": admin.role

        }

    }