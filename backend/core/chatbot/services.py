import os
from dotenv import load_dotenv
from openai import AzureOpenAI
from .prompts import SYSTEM_PROMPT, COMPANY_CONTEXT

# Load environment variables from the .env file so Azure credentials and
# deployment settings are available at runtime.
load_dotenv()

# Read Azure OpenAI configuration from environment variables.
API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_DEPLOYMENT")
API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION", "2024-12-01-preview")

# Debug prints used to verify that the correct Azure OpenAI settings are loaded.
print("ENDPOINT:", ENDPOINT)
print("DEPLOYMENT:", DEPLOYMENT_NAME)
print("API_VERSION:", API_VERSION)

# Create a reusable Azure OpenAI client instance for sending chatbot requests.
client = AzureOpenAI(
    api_version=API_VERSION,
    azure_endpoint=ENDPOINT,
    api_key=API_KEY,
)


def get_chatbot_reply(user_message: str) -> str:
    # Prevent empty or whitespace-only input from being sent to the model.
    if not user_message or not user_message.strip():
        return "Please enter a message."

    # Combine the chatbot behavior prompt and the company knowledge into one
    # full system prompt so the model stays limited to GreenScape content.
    full_system_prompt = f"""
{SYSTEM_PROMPT}

Company Knowledge:
{COMPANY_CONTEXT}

Important:
Use the company knowledge as the only source of truth.
Summarize and format answers for customers instead of copying large blocks verbatim.
""".strip()
    
    # Send the system prompt and user message to the Azure OpenAI chat
    # completions endpoint and request a response from the chosen deployment.
    response = client.chat.completions.create(
        model=DEPLOYMENT_NAME,
        messages=[
            {"role": "system", "content": full_system_prompt},
            {"role": "user", "content": user_message.strip()},
        ],
        max_completion_tokens=7000,
    )

    # Debug prints for inspecting the raw model response during development.
    print("RAW RESPONSE:", response)
    print("RAW CONTENT:", repr(response.choices[0].message.content))

    # Extract the message content from the first returned choice.
    content = response.choices[0].message.content

    # Return the generated text only if it is a non-empty string.
    if isinstance(content, str) and content.strip():
        return content.strip()

    # Fallback response when the API returns no usable content.
    return "I’m sorry, I couldn’t generate a response right now."