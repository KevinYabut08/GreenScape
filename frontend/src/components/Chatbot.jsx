import React, { useEffect, useRef, useState } from "react";
import "./clientCss/Chatbot.css";
import AxiosInstance from "./AxiosInstance";

const AIChatbot = () => {
  // Tracks whether the chatbot window is currently open or closed.
  const [isOpen, setIsOpen] = useState(false);

  // Stores the current text inside the textarea input.
  const [input, setInput] = useState("");

  // Controls whether the typing indicator should be shown while waiting for the backend.
  const [isTyping, setIsTyping] = useState(false);

  // Stores all chat messages shown in the conversation, starting with the bot greeting.
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hi, I’m Iri. I can help with Greenscape services, pricing, booking questions, and general support.",
      time: formatTime(),
    },
  ]);

  // Reference used to scroll to the bottom of the chat whenever a new message appears.
  const messagesEndRef = useRef(null);

  // Formats the current time into a user-friendly chat timestamp.
  function formatTime() {
    return new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  // Automatically scroll to the latest message whenever the message list changes
  // or whenever the typing indicator appears/disappears.
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Smoothly scroll the chat body to the bottom.
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Add a new message object to the end of the current chat history.
  const appendMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const handleSend = async () => {
    // Remove extra whitespace from the user's input before processing.
    const trimmed = input.trim();

    // Do nothing if the input is empty.
    if (!trimmed) return;

    // Immediately show the user's message in the chat window.
    appendMessage({
      id: Date.now(),
      sender: "user",
      text: trimmed,
      time: formatTime(),
    });

    // Clear the input box after sending.
    setInput("");

    // Show the typing animation while waiting for the backend reply.
    setIsTyping(true);

    
    try {
        // Debug logs to verify the Axios base URL and target endpoint.
        console.log("AXIOS BASE:", AxiosInstance.defaults.baseURL);
        console.log("POSTING TO:", `${AxiosInstance.defaults.baseURL}/chatbot/`);

      // Send the user's message to the Django chatbot endpoint.
      const response = await AxiosInstance.post("/chatbot/", {
        message: trimmed,
      });

      // Accept either data.reply or data.response depending on the backend shape.
      // If neither is present, use a generic fallback reply.
      const reply =
        response?.data?.reply && response.data.reply.trim()
            ? response.data.reply
            : response?.data?.response && response.data.response.trim()
            ? response.data.response
            : "I’m sorry, I couldn’t generate a response right now.";

      // Show the bot's reply in the chat window.
      appendMessage({
        id: Date.now() + 1,
        sender: "bot",
        text: reply,
        time: formatTime(),
      });
    } catch (error) {
      // Debug logs for frontend-side request or API failures.
      console.error("CHATBOT FRONTEND ERROR:", error);
      console.error("CHATBOT RESPONSE DATA:", error?.response?.data);

      // Show a softer fallback message bubble containing the most useful
      // available error text from the backend or request failure.
      appendMessage({
        id: Date.now() + 2,
        sender: "bot",
        text:
        error?.response?.data?.reply ||
        error?.response?.data?.error ||
        error?.message ||
        "Frontend request failed.",
        time: formatTime(),
        isSoftNotice: true,
      });
    } finally {
      // Hide the typing indicator whether the request succeeded or failed.
      setIsTyping(false);
    }
  };

  // Allow Enter to send the message, while Shift+Enter creates a new line.
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating launcher button that toggles the chatbot open and closed. */}
      <button
        className={`iri-launcher ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open AI chatbot"
      >
        <span className="iri-launcher__glow"></span>
        <span className="iri-launcher__icon">✦</span>
      </button>

      {/* Main chatbot panel; the "show" class controls visibility and animation. */}
      <div className={`iri-chatbot ${isOpen ? "show" : ""}`}>
        <div className="iri-chatbot__header">
          <div className="iri-bot-meta">
            <div className="iri-avatar">✦</div>
            <div>
              <h3>Iri</h3>
              <p>Greenscape Assistant</p>
            </div>
          </div>
          <button
            className="iri-close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Close chatbot"
          >
            ×
          </button>
        </div>

        {/* Scrollable body containing all conversation messages. */}
        <div className="iri-chatbot__body">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`iri-message-row ${
                msg.sender === "user" ? "user" : "bot"
              }`}
            >
              <div
                className={`iri-message ${
                  msg.sender === "user" ? "user" : "bot"
                } ${msg.isSoftNotice ? "soft-notice" : ""}`}
              >
                <p>{msg.text}</p>
                <span>{msg.time}</span>
              </div>
            </div>
          ))}

          {/* Temporary typing indicator shown while the backend is generating a reply. */}
          {isTyping && (
            <div className="iri-message-row bot">
              <div className="iri-message bot iri-typing">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef}></div>
        </div>

        {/* Footer containing the user input box and send button. */}
        <div className="iri-chatbot__footer">
          <textarea
            rows="1"
            placeholder="Ask Iri something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </>
  );
};

export default AIChatbot;