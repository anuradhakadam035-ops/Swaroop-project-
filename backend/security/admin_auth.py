from datetime import datetime, timedelta

from jose import JWTError, jwt
from passlib.context import CryptContext

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

from sqlalchemy.orm import Session

from database import get_db
from models.admin import Admin


# =========================================================
# PASSWORD HASHING
# =========================================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str):

    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
):

    return pwd_context.verify(
        plain_password,
        hashed_password
    )


# =========================================================
# JWT CONFIGURATION
# =========================================================

SECRET_KEY = "AI_CAREER_GUIDANCE_ADMIN_SECRET_KEY"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_HOURS = 480


# =========================================================
# ADMIN OAUTH2
# =========================================================

admin_oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/admin/login"
)


# =========================================================
# CREATE ADMIN TOKEN
# =========================================================

def create_admin_token(admin_id: int):

    payload = {

        "sub": str(admin_id),

        "role": "admin",

        "exp": datetime.utcnow()
        + timedelta(
            hours=ACCESS_TOKEN_EXPIRE_HOURS
        )

    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


# =========================================================
# GET CURRENT ADMIN
# =========================================================

def get_current_admin(

    token: str = Depends(
        admin_oauth2_scheme
    ),

    db: Session = Depends(get_db)

):

    credentials_exception = HTTPException(

        status_code=401,

        detail="Invalid admin authentication credentials",

        headers={
            "WWW-Authenticate": "Bearer"
        }

    )


    # =====================================================
    # DECODE TOKEN
    # =====================================================

    try:

        payload = jwt.decode(

            token,

            SECRET_KEY,

            algorithms=[ALGORITHM]

        )


        admin_id = payload.get("sub")

        role = payload.get("role")


        if admin_id is None:

            raise credentials_exception


        if role != "admin":

            raise credentials_exception


        admin_id = int(admin_id)


    except (
        JWTError,
        ValueError,
        TypeError
    ):

        raise credentials_exception


    # =====================================================
    # FIND ADMIN
    # =====================================================

    admin = db.query(Admin).filter(

        Admin.id == admin_id

    ).first()


    if admin is None:

        raise credentials_exception


    return admin