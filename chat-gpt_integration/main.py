import openai
from openai import OpenAI

with open("key.txt", "r") as file:
    key = file.read().strip()

client = OpenAI(api_key=key)


def generate_instructions(user_text):

    content = (

    )

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": user_text}],
        max_tokens=50,
    )

    print(response.choices[0].message.content.strip())


generate_instructions("what d"
                      "oes a ph of 9 in a river mean pollution on a normal pH of 7")