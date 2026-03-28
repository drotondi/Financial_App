import hashlib
import os
import base64
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from .config import settings

_ITERATIONS = 600_000
_SEP = "$"


def get_password_hash(password: str) -> str:
    salt = os.urandom(32)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, _ITERATIONS)
    return base64.b64encode(salt).decode() + _SEP + base64.b64encode(dk).decode()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        salt_b64, hash_b64 = hashed_password.split(_SEP, 1)
        salt = base64.b64decode(salt_b64)
        dk = hashlib.pbkdf2_hmac("sha256", plain_password.encode(), salt, _ITERATIONS)
        return base64.b64encode(dk).decode() == hash_b64
    except Exception:
        return False


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None
