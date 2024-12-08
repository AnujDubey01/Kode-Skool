import React, { useRef, useState, useEffect } from 'react';
import './Chatbot.css';
import smLogo from '../Assets/Img/small-logo.png';

const user = {
  name: "Uday",
  suggestions: ["Write a program to check if a number is odd or even.", "Write a C program that sorts an array of integers using the Bubble Sort algorithm.", "Write a program to find the largest of three numbers."]
}

const demo = [
  {
    "query": "hello",
    "response": "Hi there! How can I assist you today?"
  },
  {
    "query": "how are you",
    "response": "I'm just a bot, but I'm here to help you! How can I assist?"
  },
  {
    "query": "what is your name",
    "response": "I'm your friendly chatbot, always ready to help!"
  },
  {
    "query": "what is the weather",
    "response": "The weather is sunny with a high of 25°C. How can I assist further?"
  },
  {
    "query": "tell me a joke",
    "response": "Why don't scientists trust atoms? Because they make up everything!"
  },
  {
    "query": "bye",
    "response": "Goodbye! Have a great day!"
  },
  {
    "query": "who created you",
    "response": "I was created by a team of skilled developers to assist you with your queries."
  },
  {
    "query": "what can you do",
    "response": "I can answer your questions, tell you jokes, provide weather updates, and much more!"
  }
]

function fetchResponse(userQuery) {
  const query = userQuery.trim().toLowerCase();
  const match = demo.find(q => q.query.toLowerCase() === query);
  return match ? match.response : "I'm sorry, I didn't understand that. Can you please rephrase?";
}



function Chatbot() {
  const [chatHistory, setChatHistory] = useState([]);
  const input = useRef(null)
  const chatInterface = useRef(null);

  function adjustHeight() {
    input.current.style.height = 'auto'; // Reset the height
    input.current.style.height = `${input.current.scrollHeight}px`; // Set to the current scroll height
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey && input.current.value.trim() !== "") {
      event.preventDefault();
      sendQuery();
    }
  };

  function sendQuery() {
    const query = input.current.value.trim();
    if (!query) return;

    // Add user query and bot response to chat history
    const response = fetchResponse(query);
    setChatHistory(prev => [
      ...prev,
      { type: "query", content: query },
      { type: "response", content: response }
    ]);

    input.current.value = ""; // Clear the input
    adjustHeight()
  }

  function hitSuggestion(query) {
    if (!query) return;

    // Add user query and bot response to chat history
    const response = fetchResponse(query);
    setChatHistory(prev => [
      ...prev,
      { type: "query", content: query },
      { type: "response", content: response }
    ]);
  }

  function renderChatItem(item, index) {
    if (item.type === "query") {
      return (
        <div key={index} className="querySection">
          <div className="queryBox"><pre>{item.content}</pre></div>
        </div>
      );
    }
    return (
      <div key={index} className="resSection">
        <div className="resLogo">
          <img src={smLogo} alt="KS" />
        </div>
        <div className="resBox"><pre>{item.content}</pre></div>
      </div>
    );
  }

  useEffect(() => {
    if (chatHistory.length) {
      chatInterface.current.lastChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [chatHistory])


  return (
    <>
      <div className="chatbotContainer">
        {chatHistory.length ?
          <div ref={chatInterface} className="chatInterface">
            {chatHistory.map(renderChatItem)}
          </div>
          :
          <div className="suggestInterface">
            <img src={smLogo} alt="KS" className='chatbox-logo' />
            <h2 className="welcome-chatbox">Hello, {user.name}</h2>
            <h2 className="how-can-help">How can I help you?</h2>
            <div className="chat-suggestions">
              {user.suggestions.map(que => {
                return <div className="suggested-que" onClick={() => hitSuggestion(que)}>{que}</div>
              })}
            </div>
          </div>
        }
        <div className="chatbar">
          <div className="chat-input">
            <textarea
              ref={input}
              name="prompt"
              id="prompt"
              placeholder="Enter a prompt here"
              rows="1"
              onInput={adjustHeight}
              onKeyDown={handleKeyDown}
            ></textarea>
            <div className="document"><i className="fa-solid fa-paperclip"></i></div>
            <div className="mic"><i className="fa-solid fa-microphone"></i></div>
          </div>
          <div className="send-prompt" onClick={sendQuery}>
            <i className="fa-regular fa-paper-plane"></i>
          </div>
        </div>
      </div>
    </>
  )
}

export default Chatbot