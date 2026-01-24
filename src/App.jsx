import React, { useEffect } from "react";
import SideBar from "./components/SideBar/SideBar";
import Main from "./components/Main/Main";
import { useChatStore } from "./context/useChatStore";

const App = () => {
  const initVoiceRecognition = useChatStore(
    (state) => state.initVoiceRecognition
  );
  const clearStorage = useChatStore(
    (state) => state.clearStorage
  );

  useEffect(() => {
    // 初始化语音识别服务
    initVoiceRecognition();
  }, [initVoiceRecognition]);

  // 开发模式下的快捷键监听
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl/Cmd + Shift + C 清除缓存
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'C') {
        event.preventDefault();
        clearStorage();
      }
      // Ctrl/Cmd + Shift + R 强制刷新（清除缓存并重载页面）
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'R') {
        event.preventDefault();
        clearStorage();
        window.location.reload();
      }
    };

    if (process.env.NODE_ENV === 'development') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [clearStorage]);

  return (
    <>
      <SideBar />
      <Main />

    </>
  );
};

export default App;
