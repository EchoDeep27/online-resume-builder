import openai

openai.api_key = 'pk-vQEMqIpMZJBPgCbGcDVYzgNakKdxQAPdsLfoolWqoUCfTAls'
openai.base_url = "http://localhost:3040/v1/"


completion = openai.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "user", "content": "Can you generate 10 list of skill that a full-stack developer should have"},
    ],
)

print(completion.choices[0].message.content)