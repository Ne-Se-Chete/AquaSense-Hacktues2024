import openai
from openai import OpenAI

with open("key.txt", "r") as file:
    key = file.read().strip()

client = OpenAI(api_key=key)


def generate_instructions(information, tokens):
    text = information
    print(tokens)
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": text}],
        max_tokens=tokens,
    )

    print(response.choices[0].message.content.strip())
    return response.choices[0].message.content.strip()



pH = 10
trash = "bottle"
oil = True

instruction = "Summorize in 2 sentences what meassuring {} ph in an ocean means".format(pH)
tokens = 60

if trash != "none":
    instruction += " what {} in the watter means".format(trash)
    tokens += 20

if oil:
    instruction += " and what oil in the watter means"
    tokens += 20


generate_instructions(instruction, tokens)
