import React, { useState } from "react";
import "./Chatbot.css";
import axios from "axios";
import { FaCommentDots, FaPaperPlane } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { Typography } from "@mui/material";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I am HireAI, your autonomous HR assistant. How can I help you with recruitment today? ",
    },
    {
      sender: "bot",
      text: "Feel free to ask me about job applications, resume parsing, candidate ranking, and more! ",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [chatVisible, setChatVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null); // State for session id

  // function to generate session id dynamically
  const generateSessionId = () => {
    return `session_${Date.now()}`;
  };

  // toggle chatbot visibility and generate session ID if user selects to try the chatbot
  const toggleChat = () => {
    if (!chatVisible && !sessionId) {
      const urlParams = new URLSearchParams(window.location.search);
      // get session id from url if available
      const urlSessionId = urlParams.get("sessionId");
      // use url session id or generate a new one
      setSessionId(urlSessionId || generateSessionId());
    }
    setChatVisible(!chatVisible);
  };

  // function to send message
  const sendMessage = async () => {
    if (inputText.trim() && sessionId) {
      const userMessage = { sender: "user", text: inputText };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInputText("");
      setLoading(true);

      try {
        console.log(`Sending request to: http://localhost:8000/chat/`);
        const response = await axios.post(`http://localhost:8000/chat/`, {
          question: inputText,
        });
        console.log("Response from server:", response.data);
        const botMessage = {
          sender: "bot",
          text: response.data.response || "Something went wrong!",
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error("Error fetching chatbot response:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: "Failed to connect to the chatbot backend." },
        ]);
      } finally {
        setLoading(false);
      }
    }
  };

  // handle enter key for input submission
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      sendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      <div
        className={`chat-icon ${chatVisible ? "hidden" : ""}`}
        onClick={toggleChat}
      >
        <FaCommentDots size={30} />
      </div>

      {chatVisible && (
        <div className="chatbox">
          <div className="chatbox-header">
            <div className="chatbox-title">
              <Typography>RecruitAI </Typography>
            </div>
            <div className="chatbox-close" onClick={toggleChat}></div>
          </div>
          <div className="messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.sender}`}>
                {msg.sender === "bot" ? (
                  <span className="emoji">
                    <SmartToyOutlinedIcon />
                  </span>
                ) : (
                  <span className="emoji">
                    <CommentOutlinedIcon fontSize="small" />
                  </span>
                )}
                <span>{<ReactMarkdown>{msg.text}</ReactMarkdown>}</span>
              </div>
            ))}
            {loading && (
              <div className="message bot">
                <span className="emoji">
                  <SmartToyOutlinedIcon />
                </span>
                <span>Loading...</span>
              </div>
            )}
          </div>

          <div className="input-area">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={handleKeyDown}
            />
            <button onClick={sendMessage} disabled={loading}>
              {loading ? "Sending..." : <FaPaperPlane size={18} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
