import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { StoreProps } from "../types";
import runChat from "../config/deepseek";

export const useChatStore = create<StoreProps>()(
    persist<StoreProps>(
        (set, get) => ({
            input: "",

            recentPrompt: [],
            prevPrompt: [],
            showResult: false,
            loading: false,
            resultData: "",
            voiceSearch: false,
            recognition: null,
            recordingAnimation: false,


            setInput: (text) => set({ input: text }),
            newChat: () => { set({ loading: false, showResult: false }) }
            ,
            //每次发送请求清空输入框和历史回复
            onSent: async (prompt) => {
                //prompt主要承载语音输入
                const { input, prevPrompt, loading } = get();

                //FIXME:后续添加携带历史会话功能
                if (loading) return;

                // 默认是直接使用输入框的文本，如果有语音输入即可替代
                const currentPrompt = prompt !== undefined ? prompt : input;

                // 如果没有内容，不执行
                if (!currentPrompt) return;

                // 设置加载状态和 UI
                set({
                    prevPrompt: prompt === undefined ? [...prevPrompt, input] : prevPrompt,
                    recentPrompt: currentPrompt,
                    loading: true,
                    showResult: true,
                    resultData: "", // 清空上一次的答案
                    input: "" // 清空输入框
                });

                try {
                    // 调用 API
                    const response = await runChat(currentPrompt);

                    // 更新结果并关闭 loading
                    set({
                        resultData: response,
                        loading: false
                    });

                } catch (error) {
                    console.error("Chat Error:", error);
                    set({
                        resultData: "Error fetching response.",
                        loading: false
                    });
                }
            },

            setRecentPrompt: (text) => set({ recentPrompt: text }),
            setPrevprompt: (text) => set({ prevPrompt: text }),
            setShowResult: (text) => set({ showResult: text }),
            setLoading: (text) => set({ loading: text }),
            setResultData: (text) => set({ resultData: text }),
            setVoiceSearch: (text) => set({ voiceSearch: text }),
            setRecognition: (text) => set({ recognition: text }),
            setRecordingAnimation: (text) => set({ recordingAnimation: text }),

            // 初始化语音识别服务
            initVoiceRecognition: () => {
                if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
                    const recognition = new (window as any).webkitSpeechRecognition();
                    const { setRecognition, onSent, setInput, setVoiceSearch, setRecordingAnimation } = get();

                    recognition.onresult = (event) => {
                        const transcript = event.results[0][0].transcript;
                        setVoiceSearch(false);
                        setInput(transcript);
                        onSent(transcript); // 使用语音输入调用 onSent
                        setInput("");
                        setRecordingAnimation(false);
                    };

                    recognition.onend = () => {
                        setVoiceSearch(false);
                        setRecordingAnimation(false);
                    };

                    setRecognition(recognition);
                } else {
                    console.warn("浏览器不支持语音识别功能");
                }
            },

            // 打开语音搜索
            openVoiceSearch: () => {
                const { recognition, voiceSearch, setVoiceSearch, setRecordingAnimation } = get();
                if (!voiceSearch && recognition) {
                    recognition.start();
                    setVoiceSearch(true);
                    setRecordingAnimation(true);
                }
            },

            handleKeyPress: (e) => {
                if (e.key === "Enter") {
                    const { onSent } = get();
                    onSent();
                }
            }


        }), {
        name: "LcPartner-storage",
        storage: createJSONStorage(() => localStorage),
    }))