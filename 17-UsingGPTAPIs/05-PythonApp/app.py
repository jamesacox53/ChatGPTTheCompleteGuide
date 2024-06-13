import openai
openai.api_key = "OPENAI_API_KEY"

completion = openai.ChatCompletion.create(
    model="gpt-3.5-turbo"
    messages=[
        {"role":"user", "content":"Hello!"}
    ]
)

print(completion.choices[0].message)