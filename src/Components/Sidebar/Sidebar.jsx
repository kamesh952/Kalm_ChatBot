import React, { useState, useContext, useEffect } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/context";
import { IoMdClose } from "react-icons/io"; // Close icon


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

  // Detect screen size and update isMobile and extended accordingly
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 600;
      setIsMobile(mobile);
      if (mobile) {
        setExtended(true); // Always extended on mobile
      } else {
        setExtended(false); // Collapse by default on desktop
      }
    };

    handleResize(); // Run on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    await onSent(prompt);
    if (isMobile) toggleSidebar(); // Only toggle sidebar on mobile
  };

  const handleNewChat = () => {
    setRecentPrompt("");
    setInput("");
    setResultData("");
    setShowResult(false);
    if (isMobile) toggleSidebar(); // Only toggle sidebar on mobile
  };

  return (
    <div className={`sidebar ${isMobile && isOpen ? "open" : ""}`}>
      <div className="top">
        {/* Desktop toggle button for expanding sidebar */}
        {!isMobile && (
          <img
            onClick={() => setExtended((prev) => !prev)}
            className="menu"
            src={assets.menu_icon}
            alt="menu"
          />
        )}

        {/* Home icon for mobile to close sidebar */}
        {isMobile && (
  <div className="mobile-home-icon" onClick={toggleSidebar}>
    <IoMdClose size={24} style={{ cursor: "pointer", marginLeft: 10 }} />
  </div>
)}


        <div className="new-chat" onClick={handleNewChat}>
          <img src={assets.plus_icon} alt="plus" />
          {extended && <p>New Chat</p>}
        </div>

        {extended && (
          <div className="recent">
            <p className="recent-title">Recent</p>
            {prevPrompts.map((item, index) => (
              <div
                key={index}
                className="recent-entry"
                onClick={() => loadPrompt(item)}
              >
                <img src={assets.message_icon} alt="msg" />
                <p>{item.slice(0, 18)}...</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img src={assets.question_icon} alt="help" />
          {extended && <p>Help</p>}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt="activity" />
          {extended && <p>Activity</p>}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="settings" />
          {extended && <p>Settings</p>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
