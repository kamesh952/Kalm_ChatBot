import React, { useContext, useState, useRef, useEffect } from "react";
import { assets } from "../../assets/assets";
import { Context } from "../../context/context";
import Sidebar from "../Sidebar/Sidebar";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaSquare } from "react-icons/fa";

const Main = () => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
    stopExecution,
    setResultData,
    setShowResult,
  } = useContext(Context);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const handleSquareClick = () => {
    setInput(recentPrompt);
    setResultData("");
    setShowResult(false);
  };

  const handleCardClick = (cardText) => {
    setInput(cardText);
    setShowResult(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        sidebarOpen
      ) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

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

  return (
    <div className="flex w-full relative min-h-screen bg-gray-50">
      {/* Sidebar */}
      {sidebarOpen && (
        <div ref={sidebarRef} className="fixed inset-0 z-20">
          <Sidebar toggleSidebar={toggleSidebar} isOpen={sidebarOpen} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen w-full">
        {/* Navbar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
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
        <div className="flex-1 pb-[100px] md:pb-[15vh] overflow-y-auto">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            {!showResult ? (
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
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {promptCards.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleCardClick(item.text)}
                      className="relative h-[190px] bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-blue-300 transition-all"
                    >
                      <p className="text-gray-500 text-lg font-medium line-clamp-4">
                        {item.text}
                      </p>
                      <img
                        className="w-10 p-2 absolute bg-gray-100 rounded-full bottom-5 right-5 shadow-sm border border-gray-200 hover:bg-gray-50"
                        src={item.icon}
                        alt="Icon"
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="px-0 md:px-4 max-h-[70vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">
                <div className="flex items-center gap-4 my-6">
                  <img
                    className="w-7 rounded-full border border-gray-200"
                    src={assets.user_icon}
                    alt="Prompt Icon"
                  />
                  <p className="text-gray-700 text-sm">{recentPrompt}</p>
                </div>
                <div className="flex items-start gap-4 mt-6">
                  <img
                    className="w-7 rounded-full border border-gray-200"
                    src={assets.gemini_icon}
                    alt="Gemini Icon"
                  />
                  {loading ? (
                    <div className="w-full flex flex-col gap-2">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="h-3 md:h-4 rounded bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 bg-[length:800px_50px] animate-loader"
                        ></div>
                      ))}
                    </div>
                  ) : (
                    <p
                      className="text-gray-700 text-sm font-light leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: resultData }}
                    ></p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Bottom Search Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 md:shadow-none md:relative md:bg-transparent md:border-t-0">
          <div className="max-w-[900px] mx-auto w-full px-4 py-3 md:py-0">
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
                {showResult && !loading ? (
                  <button
                    onClick={handleSquareClick}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    title="Edit this prompt"
                  >
                    <FaSquare className="w-4 h-4" />
                  </button>
                ) : input ? (
                  <img
                    onClick={() => input.trim() !== "" && onSent(input)}
                    className="w-5 cursor-pointer opacity-80 hover:opacity-100 hover:scale-110 transition-all"
                    src={assets.send_icon}
                    alt="Send Icon"
                  />
                ) : null}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 mb-1 md:my-3 text-center">
              Kalm AI may display inaccurate info, including about people, so
              double-check its response
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
