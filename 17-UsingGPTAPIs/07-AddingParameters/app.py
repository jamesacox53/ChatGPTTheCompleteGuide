import openai
openai.api_key = "OPENAI_API_KEY"

user_input = input("Add your prompt: ")

completion = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role":"user", "content": user_input}
    ],
    temperature=0.2,
    max_tokens=100
)

print(completion.choices[0].message)