"""
=========================================
Security Utilities
AI Career Guidance System
=========================================
"""

from datetime import datetime
from datetime import timedelta
from datetime import timezone

from jose import jwt
from jose import JWTError

from passlib.context import CryptContext

from config import SECRET_KEY
from config import ALGORITHM
from config import ACCESS_TOKEN_EXPIRE_MINUTES

# ==========================================
# Password Hashing
# ==========================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str):

    """
    Convert plain password into hashed password
    """

    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
):

    """
    Verify entered password
    """

    return pwd_context.verify(
        plain_password,
        hashed_password
    )


# ==========================================
# JWT Token
# ==========================================

def create_access_token(data: dict):

    """
    Generate JWT Access Token
    """

    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update(
        {
            "exp": expire
        }
    )

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt


def verify_access_token(token: str):

    """
    Decode JWT Token
    """

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except JWTError:

        return None