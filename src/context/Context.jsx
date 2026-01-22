import { createContext, useState, useEffect } from "react";
import runChat from "@/config/deepseek";

export const Context = createContext();

const ContextProvider = (props) => {
  const [inchat, setInchat] = useState(false);
  const [historyResponse, setHistoryResponse] = useState([]); //存储一个对话的历史回复，在新建对话时清空
  const [input, setInput] = useState(""); //用户输入
  const [tempInput, setTempInput] = useState("") //最近的一次输入，用于发送请求到接收res扩充recentPrompt之间空窗期
  const [recentPrompt, setRecentPrompt] = useState([]); //存储最近一次对话的内容，在navibar显示历史对话
  const [prevPrompt, setPrevprompt] = useState([]); //存储历史提问列表
  const [showResult, setShowResult] = useState(false); //控制主界面的视图切换
  const [loading, setLoading] = useState(false); //控制加载动画的显示
  const [voiceSearch, setVoiceSearch] = useState(false); //控制语音输入状态和动画
  const [recognition, setRecognition] = useState(null); //控制语音输入的识别

  // const deplayPara = (index, nextWord) => {
  //   setTimeout(function () {
  //     setResultData((prev) => prev + nextWord);
  //   }, 75 * index);
  // };
  useEffect(() => {
    const recognition = new window.webkitSpeechRecognition();

    // 收到识别结果时触发（可能多次触发，每次识别到新内容）
    recognition.onresult = (event) => {
      console.log(event);
      const transcript = event.results[0][0].transcript;
      setHistoryResponse((prev) => [...prev, transcript]);
      setVoiceSearch(false);
      setInput(transcript);
      onSent(transcript); // Call onSent function with the voice input
    };

    // 识别服务结束时触发（无论是否有结果，可能是超时、用户停止、或识别完成）
    recognition.onend = () => {
      // 确保状态被重置（作为兜底，防止 onresult 未触发的情况）
      setVoiceSearch(false);
    };

    setRecognition(recognition);
  }, []);

  const openVoiceSearch = () => {
    if (!loading) {
      recognition.start();
      setVoiceSearch(true);
    } else {
      console.error("语言识别模块出现问题，请稍后再试");
      alert("正在生成回答，请稍后再试");
    }
  };
  //新建对话
  const newChat = () => {
    // 如果当前有对话内容，将第一个消息添加到历史记录
    if (recentPrompt.length > 0) {
      const firstPrompt = recentPrompt[0].prompt;
      setPrevprompt((prev) => {
        // 避免重复添加相同的提示
        if (!prev.includes(firstPrompt)) {
          return [...prev, firstPrompt];
        }
        return prev;
      });
    }

    setInchat(false); // 重置为 false，让下一次发送消息不会新建prevprompt
    setLoading(false);
    setShowResult(false);
    setHistoryResponse([]);
    setRecentPrompt([]);
  };
  //发送请求：
  const onSent = async (prompt) => {
    if (loading) {
      alert("正在生成回答，请稍后再试");
      return;
    } // Prevent multiple calls if already loading
    setInput("")
    setLoading(true);
    setShowResult(true);

    //发送请求立马清空输入框
    let response;
    //TODO:发送请求携带该对话历史信息
    console.log("tytytyty", prompt)

    // 第一次发送消息时，将其添加到历史记录
    if (!inchat && recentPrompt.length === 0) {
      const currentPrompt = prompt !== undefined ? prompt : input;
      setPrevprompt((prev) => [...prev, currentPrompt]);
      setInchat(true);
    }

    if (prompt !== undefined) {
      //语音输入
      setTempInput(prompt)
      response = await runChat(prompt, recentPrompt);
    } else {
      setTempInput(input)
      response = await runChat(input, recentPrompt);
    }
    let inputPrompt = prompt !== undefined ? prompt : input;
    setRecentPrompt((prev) => [
      ...prev,
      { id: response.id, prompt: inputPrompt, response: response.content },
    ]);

    setLoading(false);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSent();
    }
  };

  const contextValue = {
    recognition,
    tempInput,
    prevPrompt,
    setPrevprompt,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    input,
    setInput,
    newChat,
    handleKeyPress,
    voiceSearch,
    openVoiceSearch,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
