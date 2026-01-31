import React, { useEffect } from "react";
import SideBar from "./components/SideBar/SideBar";
import Main from "./components/Main/Main";
import { useChatStore } from "./context/useChatStore";
import { ConfigProvider, theme } from "antd";
import "./App.css"

const App = () => {
  const colorTheme = useChatStore((state) => state.colorTheme);
  const initVoiceRecognition = useChatStore(
    (state) => state.initVoiceRecognition,
  );

  useEffect(() => {
    // 初始化语音识别服务
    initVoiceRecognition();
    if (colorTheme === "dark") document.documentElement.classList.add("dark")
  }, [initVoiceRecognition]);

  // 开发模式下的快捷键监听

  const { defaultAlgorithm, darkAlgorithm } = theme;
  return (
    <ConfigProvider theme={{ algorithm: colorTheme === "dark" ? darkAlgorithm : defaultAlgorithm }}>
      <SideBar />
      <Main />

    </ConfigProvider>
  );
};

export default App;
