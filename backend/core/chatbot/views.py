import re

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from .services import get_chatbot_reply

# Standardized reply for unsafe, harmful, sexual, hateful, or toxic messages.
# This keeps the chatbot from continuing unsafe conversations while still
# returning a calm and supportive response.
UNSAFE_REPLY = (
    "I’m here to help with Greenscape’s services like irrigation, pricing, and bookings. "
    "I can’t assist with that request. If you’re feeling this way, please reach out to a trusted "
    "person or contact emergency services immediately. You’re not alone, and there are people "
    "who want to support you."
)

# Standardized reply for messages that are not related to GreenScape services.
OUT_OF_SCOPE_REPLY = (
    "I’m here to help with Greenscape’s services like irrigation, pricing, and bookings. "
    "I can’t assist with that request."
)

# Regex patterns used to detect unsafe messages before they are sent to the AI.
# This acts as a first layer of protection at the backend level.
UNSAFE_PATTERNS = [
    r"\bkill myself\b",
    r"\bkys\b",
    r"\bwant to die\b",
    r"\bend my life\b",
    r"\bsuicide\b",
    r"\bsuicidal\b",
    r"\bhurt myself\b",
    r"\bself[\s-]?harm\b",
    r"\bdon['’]t want to live\b",
    r"\bdo not want to live\b",
    r"\bkill you\b",
    r"\bwant to kill\b",
    r"\bhow to kill\b",
    r"\bhurt you\b",
    r"\bstab\b",
    r"\bshoot\b",
    r"\bmurder\b",
    r"\bpoison\b",
    r"\babuse\b",
    r"\bsex\b",
    r"\bsexual\b",
    r"\bnude\b",
    r"\bnaked\b",
    r"\bporn\b",
    r"\brape\b",
    r"\bmolest\b",
    r"\bracist\b",
    r"\bslur\b",
    r"\bnigger\b",
    r"\bfaggot\b",
    r"\bretard\b",
    r"\bbitch\b",
    r"\bwhore\b",
]

# Keywords used to determine whether the user message is related to the
# GreenScape business domain. This is a lightweight out-of-scope filter.
GREENCAPE_KEYWORDS = [
    "greenscape",
    "irrigation",
    "sprinkler",
    "watering",
    "service",
    "services",
    "booking",
    "book",
    "quote",
    "pricing",
    "price",
    "cost",
    "maintenance",
    "winterization",
    "winterizing",
    "startup",
    "spring startup",
    "backflow",
    "fertigation",
    "landscape lighting",
    "rainwater",
    "stormwater",
    "consultation",
    "installation",
    "repair",
]

def is_allowed_chatbot_question(text: str) -> bool:
    normalized = (text or "").lower().strip()

    allowed_phrases = [
        "who are you",
        "what are you",
        "what is your name",
        "what's your name",
        "what can you do",
        "how can you help",
        "help me",
        "are you a bot",
        "are you ai",
        "are you an ai",
        "introduce yourself",
        "tell me about yourself",
    ]

    return any(phrase in normalized for phrase in allowed_phrases)

def is_unsafe_message(text: str) -> bool:
    # Normalize the message to lowercase and remove outer whitespace so pattern
    # matching is more consistent.
    normalized = (text or "").lower().strip()

    # Return True if any unsafe regex pattern matches the user's message.
    return any(re.search(pattern, normalized) for pattern in UNSAFE_PATTERNS)

def is_greenscape_related(text: str) -> bool:
    # Normalize the message to lowercase and remove outer whitespace so keyword
    # checks are more consistent.
    normalized = (text or "").lower().strip()

    # Return True if at least one GreenScape-related keyword appears in the text.
    return any(keyword in normalized for keyword in GREENCAPE_KEYWORDS)

@api_view(["POST"])
@permission_classes([AllowAny])
def chatbot_view(request):
    # Read the incoming chat message from the request body.
    message = request.data.get("message", "").strip()

    # Debug print so developers can inspect what message reached the backend.
    print("CHATBOT REQUEST:", message)

    # Reject empty requests early with a 400 Bad Request response.
    if not message:
        return Response(
            {"reply": "Please enter a message first."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # If the message is unsafe, return the predefined safety response without
    # sending anything to the AI model.
    if is_unsafe_message(message):
        return Response(
            {"reply": UNSAFE_REPLY, "isSafetyResponse": True},
            status=status.HTTP_200_OK,
        )

    # If the message is outside the GreenScape domain, return the out-of-scope
    # response instead of querying the model.
    if not is_greenscape_related(message) and not is_allowed_chatbot_question(message):
        return Response(
            {"reply": OUT_OF_SCOPE_REPLY, "isSafetyResponse": False},
            status=status.HTTP_200_OK,
        )

    try:
        # Generate a chatbot reply through the Azure OpenAI service.
        reply = get_chatbot_reply(message)

        # Debug print so successful model replies can be inspected in logs.
        print("CHATBOT SUCCESS:", repr(reply))

        # Return the final chatbot response to the frontend.
        return Response(
            {"reply": reply, "isSafetyResponse": False},
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        # Log the backend exception for debugging.
        print("CHATBOT ERROR:", repr(e))
        error_text = str(e).lower()

        # If Azure content filtering blocks the message, convert the failure into
        # the same safe user-facing reply used by the manual unsafe filter.
        if "content_filter" in error_text or "responsibleaipolicyviolation" in error_text:
            return Response(
                {"reply": UNSAFE_REPLY, "isSafetyResponse": True},
                status=status.HTTP_200_OK,
            )

        # For all other unexpected errors, return a generic failure message and
        # include the error string for debugging.
        return Response(
            {
                "reply": "I’m sorry, I couldn’t generate a response right now.",
                "error": str(e),
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )