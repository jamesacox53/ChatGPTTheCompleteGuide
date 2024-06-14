import openai
openai.api_key = "OPENAI_API_KEY"

user_input = input("Add your prompt: ")

completion = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role":"user", "content": user_input}
    ]
)

print(completion.choices[0].message)