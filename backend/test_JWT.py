from utils.security import create_access_token

token = create_access_token(
    {
        "sub": "sushil@gmail.com"
    }
)

print(token)