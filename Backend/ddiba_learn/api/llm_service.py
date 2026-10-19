import json
import os

import requests
from dotenv import load_dotenv
from openai import OpenAI


load_dotenv(".env")


AI_PROVIDER = os.getenv(
    "AI_PROVIDER",
    "openai",
).lower()

OPENAI_API_KEY = os.getenv(
    "OPENAI_API_KEY"
)

OPENAI_MODEL = os.getenv(
    "OPENAI_MODEL",
    "gpt-5-mini",
)

OPENROUTER_API_KEY = os.getenv(
    "OPENROUTER_API_KEY"
)

OPENROUTER_MODEL = os.getenv(
    "OPENROUTER_MODEL"
)

OPENROUTER_URL = (
    "https://openrouter.ai/api/v1/chat/completions"
)
OPENAI_IMAGE_MODEL = os.getenv(
    "OPENAI_IMAGE_MODEL",
    "gpt-image-2",
)


class LLMServiceError(Exception):
    pass


def _call_openai(
    messages,
    temperature=0.3,
):
    if not OPENAI_API_KEY:
        raise LLMServiceError(
            "OPENAI_API_KEY is missing from the environment."
        )

    client = OpenAI(
        api_key=OPENAI_API_KEY
    )

    try:
        response = client.responses.create(
            model=OPENAI_MODEL,
            input=messages,
        )

    except Exception as exc:
        raise LLMServiceError(
            f"OpenAI request failed: {exc}"
        ) from exc

    try:
        return response.output_text

    except Exception as exc:
        raise LLMServiceError(
            "OpenAI returned an unexpected response."
        ) from exc


def _call_openrouter(
    messages,
    temperature=0.3,
):
    if not OPENROUTER_API_KEY:
        raise LLMServiceError(
            "OPENROUTER_API_KEY is missing from the environment."
        )

    if not OPENROUTER_MODEL:
        raise LLMServiceError(
            "OPENROUTER_MODEL is missing from the environment."
        )

    headers = {
        "Authorization":
            f"Bearer {OPENROUTER_API_KEY}",

        "Content-Type":
            "application/json",
    }

    payload = {
        "model":
            OPENROUTER_MODEL,

        "messages":
            messages,

        "temperature":
            temperature,
    }

    try:
        response = requests.post(
            OPENROUTER_URL,
            headers=headers,
            json=payload,
            timeout=60,
        )

    except requests.RequestException as exc:
        raise LLMServiceError(
            f"Could not connect to OpenRouter: {exc}"
        ) from exc

    if not response.ok:
        raise LLMServiceError(
            f"OpenRouter returned "
            f"{response.status_code}: "
            f"{response.text}"
        )

    try:
        data = response.json()

        return (
            data["choices"][0]
            ["message"]["content"]
        )

    except (
        ValueError,
        KeyError,
        IndexError,
        TypeError,
    ) as exc:
        raise LLMServiceError(
            "OpenRouter returned an unexpected response."
        ) from exc


def _call_llm(
    messages,
    temperature=0.3,
):
    if AI_PROVIDER == "openai":
        return _call_openai(
            messages,
            temperature,
        )

    if AI_PROVIDER == "openrouter":
        return _call_openrouter(
            messages,
            temperature,
        )

    raise LLMServiceError(
        f"Unsupported AI_PROVIDER: {AI_PROVIDER}"
    )


def adapt_lesson_with_ai(
    text,
    preferences,
):
    preference_lines = []

    if preferences.get(
        "short_explanations"
    ):
        preference_lines.append(
            "- Keep explanations short and focused."
        )

    if preferences.get(
        "step_by_step"
    ):
        preference_lines.append(
            "- Explain the lesson step by step."
        )

    if preferences.get(
        "examples"
    ):
        preference_lines.append(
            "- Include simple real-world examples."
        )

    pace = preferences.get(
        "pace",
        "gentle",
    )

    preference_text = "\n".join(
        preference_lines
    )

    prompt = f"""
You are Ddiba, an adaptive learning assistant.

Your job is to rewrite study material so that it is easier
for a learner to understand.

Learner preferences:
{preference_text}
- Learning pace: {pace}

Rules:
- Simplify difficult vocabulary.
- Shorten long sentences.
- Break dense content into small chunks.
- Explain difficult terms in plain language.
- Preserve the original meaning.
- Do not invent facts.
- Keep the tone supportive and calm.

Return ONLY valid JSON in this exact structure:

{{
  "simplified_text": "adapted lesson text",
  "key_points": [
    "key point 1",
    "key point 2",
    "key point 3"
  ]
}}

Lesson:
{text}
"""

    raw_response = _call_llm(
        [
            {
                "role": "system",
                "content": (
                    "You are Ddiba, a calm and accurate "
                    "adaptive learning assistant."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ]
    )

    try:
        result = json.loads(
            raw_response
        )

    except json.JSONDecodeError as exc:
        raise LLMServiceError(
            "The AI response was not valid JSON."
        ) from exc

    if (
        "simplified_text"
        not in result
        or "key_points"
        not in result
    ):
        raise LLMServiceError(
            "The AI response did not contain the expected fields."
        )

    return result


def generate_practice_questions_with_ai(
    adapted_text,
):
    prompt = f"""
You are Ddiba, an adaptive learning assistant.

Create practice questions from the lesson below.

Requirements:
- Create exactly 5 questions.
- Use a mix of multiple-choice and free-text questions.
- Keep the wording clear and supportive.
- Test understanding, not memorization only.
- For multiple-choice questions, provide exactly 4 options.
- Include the correct/reference answer for every question.
- Do not invent facts that are not supported by the lesson.

Return ONLY valid JSON in this exact structure:

{{
  "questions": [
    {{
      "question": "question text",
      "type": "multiple_choice",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "reference_answer": "correct answer"
    }},
    {{
      "question": "question text",
      "type": "free_text",
      "reference_answer": "expected answer"
    }}
  ]
}}

Lesson:
{adapted_text}
"""

    raw_response = _call_llm(
        [
            {
                "role": "system",
                "content": (
                    "You are Ddiba, a calm and accurate "
                    "adaptive learning assistant."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ]
    )

    try:
        result = json.loads(
            raw_response
        )

    except json.JSONDecodeError as exc:
        raise LLMServiceError(
            "The AI practice-question response "
            "was not valid JSON."
        ) from exc

    if "questions" not in result:
        raise LLMServiceError(
            "The AI response did not contain questions."
        )

    questions = result[
        "questions"
    ]

    if not isinstance(
        questions,
        list,
    ):
        raise LLMServiceError(
            "The questions field must be a list."
        )

    return result


def evaluate_answer_with_ai(
    question,
    student_answer,
    reference_answer,
):
    prompt = f"""
You are Ddiba, an adaptive learning assistant.

Evaluate the student's answer based on meaning,
not exact wording.

Question:
{question}

Reference answer:
{reference_answer}

Student answer:
{student_answer}

Rules:
- Decide whether the student's answer is semantically correct.
- Accept equivalent wording, paraphrases, and simpler language.
- Do not require an exact text match.
- If the answer is partially correct, mark correct as false but explain what is missing.
- Keep feedback supportive, short, and educational.
- Do not invent facts outside the question and reference answer.

Return ONLY valid JSON in this exact structure:

{{
  "correct": true,
  "feedback": "Short helpful feedback"
}}
"""

    raw_response = _call_llm(
        [
            {
                "role": "system",
                "content": (
                    "You are Ddiba, a calm and accurate "
                    "learning-feedback assistant."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ]
    )

    try:
        result = json.loads(
            raw_response
        )

    except json.JSONDecodeError as exc:
        raise LLMServiceError(
            "The AI answer-evaluation response "
            "was not valid JSON."
        ) from exc

    if (
        "correct" not in result
        or "feedback" not in result
    ):
        raise LLMServiceError(
            "The AI response did not contain "
            "the expected evaluation fields."
        )

    return result


def voice_chat_with_ai(
    message,
    preferences=None,
    conversation_history=None,
):
    """
    General conversational learning assistant.

    This is intentionally broader than adapt_lesson:
    the learner can ask general educational questions
    and follow-up questions.
    """

    preferences = (
        preferences or {}
    )

    conversation_history = (
        conversation_history or []
    )

    preference_lines = []

    if preferences.get(
        "short_explanations"
    ):
        preference_lines.append(
            "- Prefer short, focused explanations."
        )

    if preferences.get(
        "step_by_step"
    ):
        preference_lines.append(
            "- Use step-by-step explanations when useful."
        )

    if preferences.get(
        "examples"
    ):
        preference_lines.append(
            "- Use simple examples when helpful."
        )

    if preferences.get(
        "shorter_paragraphs"
    ):
        preference_lines.append(
            "- Keep paragraphs short."
        )

    pace = preferences.get(
        "pace",
        "gentle",
    )

    preference_lines.append(
        f"- Preferred learning pace: {pace}."
    )

    preference_text = "\n".join(
        preference_lines
    )

    system_message = f"""
You are Ddiba, a friendly adaptive learning companion.

The learner may speak to you naturally and ask general
learning questions. They are not limited to one subject.

Your goals:
- Answer the learner's question directly.
- Explain concepts accurately and clearly.
- Help with school subjects and general educational questions.
- Respond naturally to follow-up questions.
- If the learner says they do not understand, try another explanation.
- Ask a short clarifying question only when genuinely needed.
- Be supportive without being overly wordy.
- Never pretend the learner is correct when they are not.
- Do not invent facts.
- If a question is unrelated to learning, you may still answer
  ordinary harmless general questions naturally.

Learner preferences:
{preference_text}

Important:
Your answer will sometimes be read aloud, so write naturally
for spoken conversation. Avoid unnecessary markdown,
large headings, and complicated formatting.
"""

    messages = [
        {
            "role": "system",
            "content": system_message,
        }
    ]

    # Keep only a small recent conversation window.
    for item in conversation_history[-8:]:
        role = item.get("role")
        content = item.get(
            "content",
            "",
        )

        if (
            role in [
                "user",
                "assistant",
            ]
            and isinstance(
                content,
                str,
            )
            and content.strip()
        ):
            messages.append(
                {
                    "role": role,
                    "content":
                        content.strip(),
                }
            )

    messages.append(
        {
            "role": "user",
            "content": message,
        }
    )

    response = _call_llm(
        messages
    )

    if not response:
        raise LLMServiceError(
            "Ddiba returned an empty response."
        )

    return response.strip()

def generate_learning_visual_with_ai(
    request_text,
    conversation_history=None,
):
    if not OPENAI_API_KEY:
        raise LLMServiceError(
            "OPENAI_API_KEY is missing from the environment."
        )

    conversation_history = (
        conversation_history or []
    )

    context_parts = []

    for item in conversation_history[-6:]:
        role = item.get("role")
        content = item.get(
            "content",
            "",
        )

        if (
            role in ["user", "assistant"]
            and isinstance(content, str)
            and content.strip()
        ):
            context_parts.append(
                f"{role}: {content.strip()}"
            )

    context_text = "\n".join(
        context_parts
    )

    prompt = f"""
Create a clear educational visual for a learner.

The learner's request is:
{request_text}

Recent learning conversation:
{context_text}

Requirements:
- Make the image educational and easy to understand.
- Prefer a clean diagram, illustration, or visual explanation
  rather than decorative artwork.
- Use a simple composition.
- Make important parts visually distinct.
- Include short labels only when they genuinely help.
- Avoid long paragraphs of text inside the image.
- Make the visual suitable for a student.
- If the topic describes a process, show the stages clearly.
- If the topic describes anatomy or structure, show the major
  relevant parts clearly.
- If the request refers to the previous conversation, use that
  context to determine what should be visualized.
"""

    client = OpenAI(
        api_key=OPENAI_API_KEY
    )

    try:
        result = client.images.generate(
            model=OPENAI_IMAGE_MODEL,
            prompt=prompt,
            size="1024x1024",
        )

    except Exception as exc:
        raise LLMServiceError(
            f"Image generation failed: {exc}"
        ) from exc

    try:
        image_base64 = (
            result.data[0].b64_json
        )

    except (
        AttributeError,
        IndexError,
        TypeError,
    ) as exc:
        raise LLMServiceError(
            "OpenAI did not return a generated image."
        ) from exc

    if not image_base64:
        raise LLMServiceError(
            "OpenAI returned an empty image."
        )

    return image_base64