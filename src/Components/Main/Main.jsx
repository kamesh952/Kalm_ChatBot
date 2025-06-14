// Main.js
import React, { useContext, useState } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/context";
import Sidebar from "../Sidebar/Sidebar";
import { FaBars } from "react-icons/fa";

const Main = () => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
  } = useContext(Context);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="main-wrapper">
      {/* Only render sidebar when sidebarOpen is true */}
      {sidebarOpen && <Sidebar toggleSidebar={toggleSidebar} />}

      <div className="main">
        {/* Navigation */}
        <div className="nav">
          <div className="mobile-menu-icon" onClick={toggleSidebar}>
            <FaBars />
          </div>
          <p className="title">Kalm ChatBot</p>
          <img className="user-icon" src={assets.user_icon} alt="user" />
        </div>

        {/* Main Content */}
        <div className="main-container">
          {!showResult ? (
            <>
              <div className="greet">
                <p>
                  <span>Hello, Dev</span>
                </p>
                <p>How can I help you today?</p>
              </div>
              <div className="cards">
                <div className="card">
                  <p>
                    Suggest beautiful places to see on an upcoming road trip
                  </p>
                  <img src={assets.compass_icon} alt="Compass Icon" />
                </div>
                <div className="card">
                  <p>Briefly summarise this concept: urban planning</p>
                  <img src={assets.bulb_icon} alt="Bulb Icon" />
                </div>
                <div className="card">
                  <p>Brainstorm team bonding activities for our work retreat</p>
                  <img src={assets.message_icon} alt="Message Icon" />
                </div>
                <div className="card">
                  <p>Improve the readability of the following code</p>
                  <img src={assets.code_icon} alt="Code Icon" />
                </div>
              </div>
            </>
          ) : (
            <div className="result">
              <div className="result-title">
                <img src={assets.user_icon} alt="Prompt Icon" />
                <p>{recentPrompt}</p>
              </div>
              <div className="result-data">
                <img src={assets.gemini_icon} alt="Gemini Icon" />
                {loading ? (
                  <div className="loader">
                    <hr />
                    <hr />
                    <hr />
                  </div>
                ) : (
                  <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                )}
              </div>
            </div>
          )}

          <div className="main-bottom">
            <div className="search-box">
              <input
                type="text"
                onChange={(e) => setInput(e.target.value)}
                value={input}
                placeholder="Enter a prompt here"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && input.trim() !== "") {
                    onSent(input);
                  }
                }}
              />
              <div>
                <img src={assets.gallery_icon} alt="Gallery Icon" />
                <img src={assets.mic_icon} alt="Mic Icon" />
                {input && (
                  <img
                    onClick={() => input.trim() !== "" && onSent(input)}
                    src={assets.send_icon}
                    alt="Send Icon"
                  />
                )}
              </div>
            </div>
            <p className="bottom-info">
              Gemini may display inaccurate info, including about people, so
              double-check its your response and KALM AI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
