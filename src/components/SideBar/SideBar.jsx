import React, { useState, useRef } from "react";
import { assets } from "../../assets/assets";
import { useChatStore } from "../../context/useChatStore";
import { Dropdown, message, Space } from "antd";
import Draggable from 'react-draggable';

const SideBar = () => {
  const buttonRef = useRef(null);  // 添加 ref 引用
  const isDragging = useRef(false);  // 标记是否在拖拽
  const [extended, setExtended] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null); // 添加选中状态
  const { prevPrompt, setRecentPrompt, newChat, setPrevprompt, setShowResult, stopGeneration, colorTheme, setColorTheme, loading } =
    useChatStore();
  const loadConversation = async (conversationData, index) => {
    // 如果正在加载，取消正在进行的请求
    if (loading) {
      stopGeneration();
    }
    // 设置当前选中的索引
    setSelectedIndex(index);
    // 恢复完整的对话历史
    setRecentPrompt(conversationData.conversation);
    // 设置显示结果为 true，这样会显示对话内容
    setShowResult(true);
    // 移动端加载对话后自动关闭 sidebar
    if (window.innerWidth <= 600) {
      setExtended(false);
    }
  };

  const deleteConversation = (index) => {
    const updatedPrevPrompt = [...prevPrompt];
    updatedPrevPrompt.splice(index, 1);
    setPrevprompt(updatedPrevPrompt);
    if (selectedIndex === index) {
      setSelectedIndex(null);
      setRecentPrompt([]);
      setShowResult(false);
    }
  };

  let lastClickedTime = 0;

  const handleDoubleClick = (index) => {
    const currentTime = new Date().getTime();
    if (currentTime - lastClickedTime < 300) {
      deleteConversation(index);
    }
    lastClickedTime = currentTime;
  };
  const items = [
    {
      key: "ColorTheme",
      label: "切换明暗模式",
    },
  ];
  const handleSettingClick = (e) => {
    const { key } = e;
    switch (key) {
      case "ColorTheme":
        const html = document.documentElement;
        html.classList.toggle("dark");
        setColorTheme(colorTheme === "light" ? "dark" : "light");
        localStorage.setItem(
          "colorTheme",
          colorTheme === "light" ? "dark" : "light",
        );
        message.success(
          `切换为${colorTheme === "light" ? "暗色" : "亮色"}模式`,
        );
        break;
    }
  };

  return (
    <>
      {/* 移动端遮罩层 */}
      {extended && (
        <div
          className="fixed inset-0 bg-black/50 z-40 max-[600px]:block hidden transition-opacity duration-300"
          onClick={() => setExtended(false)}
        />
      )}
      {/* 移动端菜单按钮 - 当sidebar折叠时显示 */}
      {!extended && (
        <Draggable nodeRef={buttonRef} bounds="parent" onStart={() => { isDragging.current = false }} onDrag={() => { isDragging.current = true }} onStop={() => {
          if (!isDragging.current) {
            setExtended(true);
          }
        }}>
          <button
            ref={buttonRef}
            className="border border-white fixed left-4 top-4 z-50 w-10 h-10 bg-[#f0f4f9] dark:bg-black rounded-full shadow-lg flex items-center justify-center min-[601px]:hidden cursor-grab active:cursor-grabbing select-none"
          //onClick={() => setExtended(true)}
          >
            <img
              className="w-5 dark:brightness-0 dark:invert pointer-events-none"
              src={assets.menu_icon}
              alt="菜单"
            />
          </button>
        </Draggable>
      )}
      <div className={`dark:invert h-screen inline-flex flex-col justify-between bg-[#f0f4f9] py-[25px] px-[15px] overflow-y-auto transition-transform duration-300 ${extended
        ? "max-[600px]:fixed max-[600px]:left-0 max-[600px]:top-0 max-[600px]:z-50 max-[600px]:w-[300px] max-[600px]:shadow-2xl"
        : "max-[600px]:hidden"
        }`}>
        <div className="flex flex-col items-center">
          <img
            className={`${extended ? "w-7" : "w-5"} block cursor-pointer dark:brightness-0 `}
            src={assets.menu_icon}
            alt=""
            onClick={() => setExtended(!extended)}
          />
          <div
            onClick={() => newChat()}
            className={`mt-[50px] inline-flex items-center gap-[10px] py-[10px] px-[15px] bg-[#e6eaf1] rounded-[50px] text-sm text-gray-500 cursor-pointer`}
          >
            <img className={`${extended ? "w-4" : "w-3"}`} src={assets.plus_icon} alt="" />
            {extended ? <p>New Chat</p> : null}
          </div>
          {extended && (
            <div className="flex flex-col animate-[fadeIn_1.5s]">
              <p className="mt-[30px] mb-5">Recent</p>
              {prevPrompt.map((conversation, index) => (
                <div
                  key={index}
                  onClick={() => loadConversation(conversation, index)}
                  onDoubleClick={() => handleDoubleClick(index)}
                  className={`flex items-center mb-2 hover:bg-[#e2e6eb] hover:cursor-pointer rounded-lg p-2 justify-between ${selectedIndex === index ? "bg-[#e2e6eb]" : ""}`}
                >
                  <div className="flex items-center">
                    <img className="w-5" src={assets.message_icon} alt="" />
                    <p className="ml-1">{conversation.title}</p>
                  </div>
                  <img
                    className="w-5 hover:scale-110 transition-all duration-300 hover:bg-gray-400 rounded-lg cursor-pointer"
                    src={assets.trash}
                    onClick={(e) => {
                      e.stopPropagation(); // 阻止事件冒泡，防止触发 loadConversation
                      deleteConversation(index);
                    }}
                    alt=""
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex hover:cursor-pointer flex justify-center">
          <Dropdown
            placement="bottom"
            menu={{
              items,
              onClick: handleSettingClick,
            }}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                {extended ? "Settings" : ""}
                <img className="w-5" src={assets.setting_icon} alt="" />
              </Space>
            </a>
          </Dropdown>

        </div>

      </div>
    </>
  );
};

export default SideBar;
