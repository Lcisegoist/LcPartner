import React, { useRef, useEffect } from "react";
import "./Main.css";
import { assets } from "@/assets/assets";
import { useChatStore } from "@/context/useChatStore";
import MarkdownRenderer from "@/components/MarkdownRender/MarkdownRender.jsx";
import TextInput from "@/components/TextInput/TextInput.jsx";
import { Card } from "antd";

const Main = () => {
  const { onSent, recentPrompt, showResult, loading, tempInput, newChat } =
    useChatStore();

  return (
    <div className="flex-1 h-screen relative pb-[15vh] dark:bg-black">
      <div className="flex justify-between items-center mt-2">
        <p className="dark:text-white text-2xl font-bold pl-2">LcPartner</p>
        <img className="w-10 h-10 rounded-full my-1 mx-3" src={assets.user_icon} alt="" />
      </div>
      <div className="max-w-[900px] mx-auto h-full overflow-y-auto pb-5">
        {!showResult ? (
          <div className="flex flex-col justify-center">
            <div className="text-6xl font-bold text-gray-500 mb-10">
              <p className="mb-3 bg-linear-to-r from-blue-400 to-red-500 text-transparent bg-clip-text">
                hi,I'm LcPartner
              </p>
              <p className="text-5xl">How can I help you?</p>
            </div>
            <div className="flex flex-row gap-5 mt-7 dark:invert">
              <div
                className="card-container cursor-pointer hover:bg-gray-100 transition-all"
                onClick={() => {
                  newChat();
                  onSent("建议一些即将自驾游时可以去的美丽景点");
                }}
              >
                <p className="card-text">
                  建议一些即将自驾游时可以去的美丽景点
                </p>
                <img className="card-icon" src={assets.compass_icon} alt="" />
              </div>
              <div
                className="card-container cursor-pointer hover:bg-gray-100 transition-all"
                onClick={() => {
                  newChat();
                  onSent("简要总结一下“城市规划”这个概念");
                }}
              >
                <p className="card-text">简要总结一下“城市规划”这个概念</p>
                <img className="card-icon" src={assets.bulb_icon} alt="" />
              </div>
              <div
                className="card-container cursor-pointer hover:bg-gray-100 transition-all"
                onClick={() => {
                  newChat();
                  onSent("为我们的团队拓展活动集思广益");
                }}
              >
                <p className="card-text">为我们的团队拓展活动集思广益</p>
                <img className="card-icon" src={assets.message_icon} alt="" />
              </div>
              <div
                className="card-container cursor-pointer hover:bg-gray-100 transition-all"
                onClick={() => {
                  newChat();
                  onSent("提升以下代码的可读性");
                }}
              >
                <p className="card-text">提升以下代码的可读性</p>
                <img className="card-icon" src={assets.code_icon} alt="" />
              </div>
            </div>
          </div>
        ) : (
          //回答页面
          <div className="relative overflow-hidden h-[76vh]">
            <div className="blur-mask top-0"></div>
            <div className="overflow-y-auto h-full pt-2 pb-[140px]">
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
                      <Card size="small" className="p-0 max-w-[80%] w-auto">
                        <div className="whitespace-pre-wrap break-all leading-6">
                          {item.prompt}
                        </div>
                      </Card>
                    </div>
                    <div className="flex flex-row ">
                      <div
                        // 设置flex-shrink-0
                        className={`relative mr-3 w-8 h-8 shrink-0 ${loading && !item.response
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
                      <Card size="small" className="max-w-[80%] border-none">
                        <div className="markdown-content">
                          <MarkdownRenderer content={item.response || ""} />
                        </div>
                      </Card>
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
                    <Card className="!p-0 max-w-[80%] w-auto">
                      <div className="whitespace-pre-wrap wrap-break-word leading-6">
                        {tempInput}
                      </div>
                    </Card>
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
            </div>
            <div className="blur-mask bottom-0 rotate-180"></div>
          </div>
        )}

        <div className="main-bottom dark:invert">
          <TextInput />
          <p className="bottom-info">
            LcPartner可能会显示不准确的信息，请仔细检查其回复。
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
