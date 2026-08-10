from core.gemini import model

response = model.generate_content(
    "Reply with only: Gemini Working"
)

print(response.text)