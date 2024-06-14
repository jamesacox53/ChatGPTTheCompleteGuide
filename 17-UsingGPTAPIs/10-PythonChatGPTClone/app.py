import openai
openai.api_key = "OPENAI_API_KEY"

chat_messages = []

while True:
    user_message = input("You: ")

    chat_message = {"role": "user", "content": user_message}
    chat_messages.append(chat_message)

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=chat_messages,
        temperature=0
    )

    ai_response =  response.choices[0].message.content

    ai_message = {"role": "assistant", "content": ai_response}
    chat_messages.append(ai_message)

    print("AI: ", ai_response)