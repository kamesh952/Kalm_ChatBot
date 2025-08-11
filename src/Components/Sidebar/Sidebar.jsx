import React, { useState, useContext, useEffect } from "react";
import { assets } from "../../assets/assets";
import { Context } from "../../context/context";
import {
  TbLayoutSidebarRightExpand,
  TbLayoutSidebarLeftExpand,
} from "react-icons/tb";
import { FiChevronLeft } from "react-icons/fi"; // Added left arrow icon
import { HiChevronDoubleRight, HiChevronDoubleLeft } from "react-icons/hi2";
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [extended, setExtended] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  const {
    onSent,
    prevPrompts,
    setRecentPrompt,
    setInput,
    setResultData,
    setShowResult,
  } = useContext(Context);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 600;
      setIsMobile(mobile);
      if (!mobile && isOpen) {
        toggleSidebar();
      }
      if (!mobile) {
        setExtended(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, toggleSidebar]);

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    await onSent(prompt);
    if (isMobile) toggleSidebar();
  };

  const handleNewChat = () => {
    setRecentPrompt("");
    setInput("");
    setResultData("");
    setShowResult(false);
    if (isMobile) toggleSidebar();
  };

  return (
    <div
      className={`
        flex flex-col justify-between 
        min-h-screen bg-gray-900 p-4
        transition-all duration-300 ease-in-out
        ${
          isMobile
            ? "fixed top-0 left-0 z-50 w-64 h-full shadow-2xl"
            : "inline-flex"
        }
        ${isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"}
        ${!isMobile ? (extended ? "w-64" : "w-20") : ""}
      `}
    >
      <div className="top">
        {/* Mobile header with logo and close button */}
        {isMobile && (
          <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-4">
            <div className="flex items-center gap-2">
              <img src="logoc.png" alt="logo" className="h-7" />
              <span className="text-white font-medium">Kalm AI</span>
            </div>
            <button
              onClick={toggleSidebar}
              className="text-gray-400 hover:text-white"
            >
              <HiChevronDoubleLeft size={24} />
            </button>
          </div>
        )}

        {/* Desktop logo + toggle */}
        {!isMobile && (
          <div
            className={`
              flex items-center w-full p-2 mb-4
              ${extended ? "justify-between" : "justify-center"}
            `}
          >
            {extended && (
              <div className="flex items-center gap-2">
                <img src="logoc.png" alt="logo" className="h-7" />
                <span className="text-white font-medium">Kalm AI</span>
              </div>
            )}
            <button
              onClick={() => setExtended((prev) => !prev)}
              className="cursor-pointer flex items-center text-2xl text-gray-400 hover:text-white"
            >
              {extended ? (
                <TbLayoutSidebarRightExpand />
              ) : (
                <TbLayoutSidebarLeftExpand />
              )}
            </button>
          </div>
        )}

        {/* New chat */}
        <button
          className={`
            w-full flex items-center gap-3 
            px-4 py-3 mb-6 bg-gray-700 rounded-lg
            text-sm font-medium text-white cursor-pointer
            hover:bg-gray-600 transition-colors
            ${!extended && "justify-center"}
          `}
          onClick={handleNewChat}
        >
          <img
            src={assets.plus_icon}
            alt="plus"
            className="w-5 h-5 filter brightness-0 invert"
          />
          {extended && <span>New Chat</span>}
        </button>

        {/* Recent chats */}
        {extended && (
          <div className="animate-fadeIn">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
              Recent
            </p>
            <div className="space-y-1 max-h-[300px] overflow-y-auto">
              {prevPrompts.map((item, index) => (
                <button
                  key={index}
                  className={`
                    w-full flex items-start gap-3 p-2 px-3
                    rounded-lg text-sm text-gray-200 cursor-pointer
                    hover:bg-gray-700 transition-colors
                  `}
                  onClick={() => loadPrompt(item)}
                >
                  <img
                    src={assets.message_icon}
                    alt="msg"
                    className="w-4 h-4 mt-0.5 flex-shrink-0 filter brightness-0 invert opacity-70"
                  />
                  <span className="truncate">
                    {item.slice(0, 30)}
                    {item.length > 30 ? "..." : ""}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom menu */}
      <div className="flex flex-col space-y-2 pb-4">
        <button
          className={`
          flex items-center gap-3 p-2 px-3 rounded-lg
          cursor-pointer text-sm text-gray-300
          hover:bg-gray-700 transition-colors
          ${!extended && "justify-center"}
        `}
        >
          <img
            src={assets.question_icon}
            alt="help"
            className="w-5 h-5 filter brightness-0 invert opacity-70"
          />
          {extended && <span>Help</span>}
        </button>
        <button
          className={`
          flex items-center gap-3 p-2 px-3 rounded-lg
          cursor-pointer text-sm text-gray-300
          hover:bg-gray-700 transition-colors
          ${!extended && "justify-center"}
        `}
        >
          <img
            src={assets.history_icon}
            alt="activity"
            className="w-5 h-5 filter brightness-0 invert opacity-70"
          />
          {extended && <span>Activity</span>}
        </button>
        <button
          className={`
          flex items-center gap-3 p-2 px-3 rounded-lg
          cursor-pointer text-sm text-gray-300
          hover:bg-gray-700 transition-colors
          ${!extended && "justify-center"}
        `}
        >
          <img
            src={assets.setting_icon}
            alt="settings"
            className="w-5 h-5 filter brightness-0 invert opacity-70"
          />
          {extended && <span>Settings</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
