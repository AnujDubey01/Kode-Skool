import React, { useRef, useState, useEffect } from 'react';
import smLogo from '../assets/img/small-logo.png';
import chatService from '../services/chatService';

const defaultSuggestions = [
  "Explain what a variable is in C programming.",
  "Write a Python program that checks if a number is prime.",
  "What is the difference between SQL INNER JOIN and LEFT JOIN?",
  "How does recursion work in programming with an example?"
];

function Chatbot(props) {
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const input = useRef(null);
  const chatInterface = useRef(null);

  function adjustHeight() {
    if (input.current) {
      input.current.style.height = 'auto';
      input.current.style.height = `${input.current.scrollHeight}px`;
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey && input.current?.value.trim() !== "" && !loading) {
      event.preventDefault();
      sendQuery();
    }
  };

  async function processMessage(promptText) {
    const text = promptText ? promptText.trim() : "";
    if (!text || loading) return;

    if (input.current) {
      input.current.value = "";
      adjustHeight();
    }

    setChatHistory(prev => [
      ...prev,
      { type: "query", content: text },
      { type: "loading", content: "AI is thinking..." }
    ]);

    setLoading(true);

    try {
      const data = await chatService.sendChatMessage(text);
      const aiResponse = data?.data?.aiResponse || data?.message || "I couldn't generate a response. Please try again.";

      setChatHistory(prev => {
        const updated = [...prev];
        if (updated.length && updated[updated.length - 1].type === "loading") {
          updated[updated.length - 1] = { type: "response", content: aiResponse };
        } else {
          updated.push({ type: "response", content: aiResponse });
        }
        return updated;
      });
    } catch (err) {
      console.error("Chatbot API error:", err);
      const errorMsg = err.response?.data?.message || "Sorry, I am having trouble connecting to the AI tutor right now. Please ensure your backend is running.";

      setChatHistory(prev => {
        const updated = [...prev];
        if (updated.length && updated[updated.length - 1].type === "loading") {
          updated[updated.length - 1] = { type: "response", content: errorMsg };
        } else {
          updated.push({ type: "response", content: errorMsg });
        }
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  function sendQuery() {
    const query = input.current?.value;
    if (query) {
      processMessage(query);
    }
  }

  function hitSuggestion(query) {
    if (query && !loading) {
      processMessage(query);
    }
  }

  function renderChatItem(item, index) {
    if (item.type === "query") {
      return (
        <div key={index} className="w-full py-1.5 flex justify-end">
          <div className="max-w-[85%] sm:max-w-[70%] bg-gradient-to-r from-[#414D8E] to-[#5D74BD] text-white rounded-2xl rounded-tr-none px-4 py-2.5 shadow-sm break-words">
            <pre className="text-xs sm:text-sm font-poppins text-left whitespace-pre-wrap font-sans">
              {item.content}
            </pre>
          </div>
        </div>
      );
    }

    if (item.type === "loading") {
      return (
        <div key={index} className="w-full py-2 flex flex-row items-start gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center shrink-0 border border-gray-100 dark:border-zinc-700 overflow-hidden">
            <img src={smLogo} alt="KS" className="w-full h-full object-cover" />
          </div>
          <div className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700/60 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#5D74BD] animate-typingBounce" style={{ animationDelay: '-0.32s' }}></span>
            <span className="w-2 h-2 rounded-full bg-[#5D74BD] animate-typingBounce" style={{ animationDelay: '-0.16s' }}></span>
            <span className="w-2 h-2 rounded-full bg-[#5D74BD] animate-typingBounce"></span>
          </div>
        </div>
      );
    }

    return (
      <div key={index} className="w-full py-2 flex flex-row items-start gap-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center shrink-0 border border-gray-100 dark:border-zinc-700 overflow-hidden">
          <img src={smLogo} alt="KS" className="w-full h-full object-cover" />
        </div>
        <div className="flex-grow text-left bg-white dark:bg-zinc-800/90 border border-gray-100 dark:border-zinc-700/60 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
          <pre className="text-xs sm:text-sm leading-relaxed font-poppins text-gray-800 dark:text-gray-100 whitespace-pre-wrap font-sans">
            {item.content}
          </pre>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (chatHistory.length && chatInterface.current?.lastChild) {
      chatInterface.current.lastChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [chatHistory]);

  const welcome = useRef(null);
  const search = useRef(null);

  const handleClickOutside = (event) => {
    if (search.current?.parentElement && !search.current.parentElement.contains(event.target)) {
      welcome.current?.classList.remove('openSearch');
      search.current?.classList.remove('openSearch');
      document.removeEventListener('mousedown', handleClickOutside);
    }
  };

  const openSearchOpt = () => {
    welcome.current?.classList.add('openSearch');
    search.current?.classList.add('openSearch');
    document.addEventListener('mousedown', handleClickOutside);
  };

  const userName = props.user?.name || localStorage.getItem('user_name') || "Student";

  return (
    <div className="relative w-full h-[95vh] md:h-screen p-3 md:p-6 flex flex-col justify-between overflow-hidden">
      {window.innerWidth < 866 ? (
        <div className="flex flex-row justify-between items-center w-full mb-3 shrink-0">
          <div className="flex flex-row items-center gap-3">
            <div className="cursor-pointer text-xl text-gray-700 dark:text-gray-200" onClick={props.controlNav}>
              <i className="fa-solid fa-list-ul"></i>
            </div>
            <div ref={welcome} className="flex flex-col">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Welcome {userName}!</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Let's crack the code</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center px-3 py-1 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-800 text-xs`}>
              <i className="fa-solid fa-magnifying-glass text-gray-400 mr-2" onClick={openSearchOpt}></i>
              <input ref={search} type="text" name="search" id="search" className="bg-transparent outline-none w-20 md:w-32 text-xs text-gray-800 dark:text-gray-100" placeholder="Search" />
            </div>
            <div className="relative cursor-pointer text-gray-600 dark:text-gray-300 text-base">
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">5</span>
              <ion-icon name="notifications"></ion-icon>
            </div>
          </div>
        </div>
      ) : null}

      {/* Main Chat / Suggestions Area */}
      {chatHistory.length ? (
        <div ref={chatInterface} className="flex flex-col mx-auto w-full md:w-[75%] lg:w-[70%] h-[75%] md:h-[78%] pt-2 md:pt-6 overflow-y-auto no-scrollbar space-y-3 px-2 pb-28 sm:pb-36">
          {chatHistory.map(renderChatItem)}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto w-full md:w-[80%] lg:w-[70%] my-auto text-center px-2 pb-12 sm:pb-16">
          <img src={smLogo} alt="KS" className="w-12 h-12 rounded-full mb-3 shadow-sm" />
          <h2 className="text-3xl md:text-5xl font-medium bg-gradient-to-r from-[#414D8E] via-[#5D74BD] to-[#169BDF] bg-clip-text text-transparent font-poppins m-0">
            Hello, {userName}
          </h2>
          <h2 className="text-xl md:text-3xl text-gray-900 dark:text-gray-100 font-normal mt-1 mb-6 font-poppins">
            How can I help you?
          </h2>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 w-full max-w-4xl">
            {defaultSuggestions.map((que, i) => (
              <div
                key={i}
                onClick={() => hitSuggestion(que)}
                className="p-3.5 md:p-4 border border-gray-200 dark:border-zinc-700/80 rounded-xl bg-white dark:bg-zinc-800/80 hover:border-brand-sky hover:shadow-md text-gray-800 dark:text-gray-200 text-xs md:text-sm text-center cursor-pointer transition-all duration-200 w-full sm:w-[48%] lg:w-[23%]"
              >
                {que}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar with generous bottom padding */}
      <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 w-[95%] sm:w-[85%] md:w-[75%] lg:w-[70%] flex items-end gap-2 md:gap-3 z-20">
        <div className="flex items-end flex-grow bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-2xl px-3 py-2 md:px-4 md:py-2.5 shadow-md hover:shadow-lg focus-within:border-brand-sky focus-within:ring-2 focus-within:ring-brand-sky/20 transition-all">
          <textarea
            ref={input}
            name="prompt"
            id="prompt"
            placeholder="Ask anything about coding (C, Python, Java, SQL, etc.)..."
            rows="1"
            disabled={loading}
            onInput={adjustHeight}
            onKeyDown={handleKeyDown}
            className="flex-grow resize-none border-none outline-none text-xs md:text-sm leading-relaxed max-h-24 overflow-y-auto bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 py-1"
          />
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 pl-2 shrink-0">
            <button type="button" className="hover:text-brand-blue transition-colors p-1" title="Attach file">
              <i className="fa-solid fa-paperclip text-sm md:text-base"></i>
            </button>
            <button type="button" className="hover:text-brand-blue transition-colors p-1" title="Voice input">
              <i className="fa-solid fa-microphone text-sm md:text-base"></i>
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={sendQuery}
          disabled={loading}
          className={`h-[44px] md:h-[48px] px-4 md:px-5 rounded-2xl flex items-center justify-center text-white bg-gradient-to-r from-[#414D8E] via-[#5D74BD] to-[#169BDF] hover:opacity-95 active:scale-95 transition-all shadow-md shrink-0 ${
            loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
          }`}
          title={loading ? 'Thinking...' : 'Send Prompt'}
        >
          {loading ? (
            <i className="fa-solid fa-spinner fa-spin text-base"></i>
          ) : (
            <i className="fa-regular fa-paper-plane text-base"></i>
          )}
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
