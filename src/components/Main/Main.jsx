import React, { useContext } from "react";
import "./Main.css";
import { assets } from "@/assets/assets";
import { Context } from "@/context/Context.jsx";
import MarkdownRenderer from "@/components/MarkdownRender/MarkdownRender.jsx";
const Main = () => {
  const {
    recognition,
    onSent,
    recentPrompt,
    showResult,
    loading,
    tempInput,
    resultData,
    setInput,
    input,
    handleKeyPress,
    openVoiceSearch,
    voiceSearch,
  } = useContext(Context);

  return (
    <div className="main">
      <div className="flex justify-between items-center !mt-2">
        <p className="text-2xl font-bold !pl-2">LcPartner</p>
        <img className="w-10 h-10 rounded-full" src={assets.user_icon} alt="" />
      </div>
      <div className="main-container">
        {!showResult ? (
          <div className="flex flex-col justify-center">
            <div className="text-6xl font-bold text-gray-500 mb-10">
              <p className="mb-3 bg-gradient-to-r from-blue-400 to-red-500 text-transparent bg-clip-text">
                hi,I'm LcPartner
              </p>
              <p className="text-5xl">How can I help you?</p>
            </div>
            <div className="cards">
              <div className="card-container">
                <p className="card-text">
                  建议一些即将自驾游时可以去的美丽景点
                </p>
                <img className="card-icon" src={assets.compass_icon} alt="" />
              </div>
              <div className="card-container">
                <p className="card-text">简要总结一下“城市规划”这个概念</p>
                <img className="card-icon" src={assets.bulb_icon} alt="" />
              </div>
              <div className="card-container">
                <p className="card-text">为我们的团队拓展活动集思广益</p>
                <img className="card-icon" src={assets.message_icon} alt="" />
              </div>
              <div className="card-container">
                <p className="card-text">提升以下代码的可读性</p>
                <img className="card-icon" src={assets.code_icon} alt="" />
              </div>
            </div>
          </div>
        ) : (
          //回答页面
          <>
            {recentPrompt.map((item) => {
              return (
                <div
                  key={item.id || Math.random()}
                  className="flex flex-col mb-7"
                >
                  {/* 用户输入:recentPrompt */}
                  <div className="flex flex-row-reverse gap-5 mb-4">
                    <img
                      className="w-7 h-7 rounded-md"
                      src={assets.user_icon}
                      alt=""
                    />
                    <p className="bg-gray-100 px-3 py-2 rounded-xl">
                      {item.prompt}
                    </p>
                  </div>
                  <div className="flex flex-row ">
                    <div
                      // 设置flex-shrink-0
                      className={`relative mr-3 w-8 h-8 flex-shrink-0 ${loading && !item.response
                        ? "after:content-[''] after:absolute after:top-0 after:right-0 after:w-[5px] after:h-[5px] after:bg-sky-600 after:rounded-full after:animate-ping"
                        : ""
                        }`}
                    >
                      <img
                        className="w-8 h-8 rounded-md"
                        src={assets.gemini_icon}
                        alt=""
                      />
                    </div>
                    <div className="markdown-content w-full overflow-hidden">
                      {/* 如果数据还没流式传输完，可能需要处理 loading 状态，这里假设 item.response 是完整文本 */}
                      <MarkdownRenderer content={item.response || ""} />
                    </div>
                  </div>
                </div>
              );
            })}
            {loading ? (
              <div className="flex flex-col mb-7">
                <div className="flex flex-row-reverse gap-5 mb-4">
                  <img
                    className="w-7 h-7 rounded-md"
                    src={assets.user_icon}
                    alt=""
                  />
                  <p className="bg-gray-100 px-3 py-2 rounded-xl">{tempInput}</p>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <img
                    className="w-8 h-8 rounded-md"
                    src={assets.gemini_icon}
                    alt=""
                  />
                  <span className="w-2 h-2 bg-gray-700 rounded-full animate-pulse"></span>
                  <span className="w-2 h-2 bg-gray-700 rounded-full animate-pulse [animation-delay:.2s]"></span>
                  <span className="w-2 h-2 bg-gray-700 rounded-full animate-pulse [animation-delay:.4s]"></span>
                </div>
              </div>
            ) : null}
          </>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              className="text-gray-800"
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              onKeyDown={handleKeyPress}
              placeholder="在这里输入提示"
            />
            {/* 语音输入： */}
            <div className="flex gap-5">
              <img src={assets.gallery_icon} alt="" />
              <img
                src={assets.mic_icon}
                alt="麦克风图标"
                onClick={() => {
                  openVoiceSearch();
                  if (voiceSearch) {
                    recognition.stop();
                  }
                }}
                className={`mic-icon ${voiceSearch ? "active recording" : ""}`}
              />
              {input ? (
                <img onClick={() => onSent()} src={assets.send_icon} alt="" />
              ) : null}
            </div>
          </div>
          <p className="bottom-info">
            LcPartner可能会显示不准确的信息，请仔细检查其回复。
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
