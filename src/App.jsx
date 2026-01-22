import React, { useEffect } from "react";
import SideBar from "./components/SideBar/SideBar";
import Main from "./components/Main/Main";
import { useChatStore } from "./context/useChatStore";
import ContextProvider from './context/Context.jsx'

const App = () => {
  // const initVoiceRecognition = useChatStore(
  //   (state) => state.initVoiceRecognition
  // );

  // useEffect(() => {
  //   // 初始化语音识别服务
  //   initVoiceRecognition();
  // }, [initVoiceRecognition]);

  return (
    <>
      <ContextProvider>
        <SideBar />
        <Main />

      </ContextProvider>

    </>
  );
};

export default App;
