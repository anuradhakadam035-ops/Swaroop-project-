from utils.security import hash_password
from utils.security import verify_password

password = "Admin123"

hashed = hash_password(password)

print("Original Password :", password)

print("Hashed Password :", hashed)

print(
    verify_password(
        password,
        hashed
    )
)