from openai import OpenAI
from django.conf import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def adapt_content(text, mode="simplify"):
    """
    Sends learning material to OpenAI and returns an adapted version.
    mode can be 'simplify', 'chunk', 'summary', etc.
    """
    prompt_map = {
        "simplify": f"Rewrite the following text in simpler language, suitable for a student who struggles with dense text:\n\n{text}",
        "chunk": f"Break the following text into short numbered steps or sections:\n\n{text}",
        "summary": f"Summarize the key points of the following text in 3-5 bullet points:\n\n{text}",
    }

    prompt = prompt_map.get(mode, prompt_map["simplify"])

    response = client.chat.completions.create(
        model="gpt-4o",
        max_tokens=1000,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content