import React, { useContext, useRef, useEffect } from "react";
import { assets } from "../../assets/assets";
import { Context } from "../../context/context";
import { GiHamburgerMenu } from "react-icons/gi";

const Main = ({ sidebarExtended, isMobile, toggleSidebar }) => {
  const {
    onSent,
    loading,
    setInput,
    input,
    stopExecution,
    conversationHistory,
    currentChatId,
  } = useContext(Context);

  const messagesEndRef = useRef(null);

  const handleStopResponse = () => {
    stopExecution();
  };

  const handleCardClick = (cardText) => {
    setInput(cardText);
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getCurrentConversation = () => {
    return (
      conversationHistory.find((chat) => chat.id === currentChatId) || {
        messages: [],
      }
    );
  };

  const promptCards = [
    {
      text: "Suggest beautiful places to see on an upcoming road trip",
      icon: assets.compass_icon,
    },
    {
      text: "Briefly summarise this concept: urban planning",
      icon: assets.bulb_icon,
    },
    {
      text: "Brainstorm team bonding activities for our work retreat",
      icon: assets.message_icon,
    },
    {
      text: "Improve the readability of the following code",
      icon: assets.code_icon,
    },
  ];

  const getLeftMargin = () => {
    if (isMobile) return "0";
    return sidebarExtended ? "16rem" : "5rem";
  };

  return (
    <div
      className="min-h-screen bg-gray-50 transition-all duration-300"
      style={{ marginLeft: getLeftMargin() }}
    >
      {/* Navbar */}
      <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200 w-full">
        <div className="flex items-center justify-between py-4 px-6 text-gray-700">
          <div className="flex items-center space-x-4">
            <div className="md:hidden cursor-pointer" onClick={toggleSidebar}>
              <GiHamburgerMenu className="text-xl text-gray-500 hover:text-gray-700" />
            </div>
            <div className="flex items-center">
              <span className="bg-gradient-to-r font-medium text-3xl from-blue-950 to-blue-800 bg-clip-text text-transparent">
                Kalm AI
              </span>
            </div>
          </div>
          <img
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-200 hover:border-blue-400 transition-colors"
            src={assets.user_icon}
            alt="user"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="pb-[120px] min-h-[calc(100vh-80px)] overflow-y-auto pt-9">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6">
          {getCurrentConversation().messages.length === 0 ? (
            <>
              <div className="my-8 md:my-14 text-center md:text-left">
                <p className="text-3xl md:text-4xl text-gray-800 font-medium">
                  <span className="bg-gradient-to-r from-blue-950 to-blue-800 bg-clip-text text-transparent">
                    Hello, Dev
                  </span>
                </p>
                <p className="text-xl md:text-2xl text-gray-500 mt-3">
                  How can I help you today?
                </p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {promptCards.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleCardClick(item.text)}
                    className="relative h-[170px] bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-blue-300 transition-all"
                  >
                    <p className="text-gray-500 text-sm sm:text-lg font-medium line-clamp-4">
                      {item.text}
                    </p>
                    <img
                      className="w-8 sm:w-10 p-2 absolute bg-gray-100 rounded-full bottom-4 sm:bottom-5 right-4 sm:right-5 shadow-sm border border-gray-200 hover:bg-gray-50"
                      src={item.icon}
                      alt="Icon"
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="px-0 md:px-4 max-h-[70vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">
              {getCurrentConversation().messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-6 ${
                    message.role === "user"
                      ? "flex justify-end"
                      : "flex justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start gap-3 max-w-[90%] md:max-w-[80%] ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <img
                      className="w-7 h-7 rounded-full border border-gray-200 mt-1 flex-shrink-0"
                      src={
                        message.role === "user" ? assets.user_icon : "logoc.png"
                      }
                      alt={message.role === "user" ? "User Icon" : "AI Icon"}
                    />
                    {message.role === "user" ? (
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                        <p className="text-gray-700 text-sm">
                          {message.content}
                        </p>
                      </div>
                    ) : (
                      <div className="flex-1 bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
                        {message.isLoading ? (
                          <div className="flex space-x-2 py-2">
                            <div className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs text-gray-400">
                                Kalm AI
                              </span>
                            </div>
                            <div
                              className="text-gray-700 text-sm font-light leading-relaxed prose max-w-full overflow-x-auto"
                              dangerouslySetInnerHTML={{
                                __html: message.content,
                              }}
                            ></div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Bar */}
      <div
        className="fixed bottom-0 right-0 bg-white shadow-lg border-t border-gray-200 z-40 transition-all duration-300"
        style={{
          left: isMobile ? "0" : getLeftMargin(),
        }}
      >
        <div className="max-w-[900px] mx-auto w-full px-4 py-3">
          <div className="flex items-center justify-between gap-2 bg-white p-2 rounded-full border border-gray-300 shadow-sm hover:shadow-md hover:border-blue-400 transition-all">
            <input
              type="text"
              onChange={(e) => setInput(e.target.value)}
              value={input}
              placeholder="Enter a prompt here"
              className="flex-1 bg-transparent border-none outline-none py-1 px-3 text-sm text-gray-700 placeholder-gray-400"
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim() !== "") {
                  onSent(input);
                }
              }}
            />
            {/* Input Bar */}
<div className="flex items-center gap-2">
  <img
    className="w-5 cursor-pointer opacity-80 hover:opacity-100 hover:scale-110 transition-all"
    src={assets.gallery_icon}
    alt="Gallery Icon"
  />
  <img
    className="w-5 cursor-pointer opacity-80 hover:opacity-100 hover:scale-110 transition-all"
    src={assets.mic_icon}
    alt="Mic Icon"
  />
  {loading && getCurrentConversation().messages.slice(-1)[0]?.isLoading ? (
    <button
      onClick={handleStopResponse}
      className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
      title="Stop response"
    >
      <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
    </button>
  ) : (
    <button
      onClick={() => input.trim() !== "" && onSent(input)}
      disabled={input.trim() === ""}
      className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
        input.trim() !== ""
          ? "bg-blue-500 hover:bg-blue-600"
          : "bg-gray-200 cursor-not-allowed"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        className="w-4 h-4"
      >
        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
      </svg>
    </button>
  )}
</div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Kalm AI may display inaccurate info, including about people, so
            double-check its response
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;