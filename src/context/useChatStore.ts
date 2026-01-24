import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { StoreProps } from "../types";
import runChat from "../config/deepseek";
import { devtools } from 'zustand/middleware'
interface ApiResponse {
    id: string;
    content: string;
}

export const useChatStore = create<StoreProps>()(
    devtools(
        persist<StoreProps>(
            (set, get) => ({
                input: "",
                inchat: false,
                tempInput: "",
                recentPrompt: [],
                prevPrompt: [],
                showResult: false,
                loading: false,
                resultData: "",
                voiceSearch: false,
                recognition: null,
                recordingAnimation: false,

                setInput: (text) => set({ input: text }),

                newChat: () => {
                    const { recentPrompt, prevPrompt } = get();

                    // 如果当前有对话内容，将完整的对话保存到历史记录
                    if (recentPrompt.length > 0) {
                        const firstPrompt = recentPrompt[0].prompt;
                        const conversationTitle = firstPrompt.length > 18 ? firstPrompt.slice(0, 18) + "..." : firstPrompt;

                        // 创建新的对话历史对象
                        const newConversation = {
                            title: conversationTitle,
                            conversation: [...recentPrompt] // 保存完整的对话副本
                        };

                        // 检查是否已存在相同的对话（通过标题判断）
                        const existingIndex = prevPrompt.findIndex(item => item.title === conversationTitle);

                        if (existingIndex === -1) {
                            // 不存在，添加新对话
                            set({ prevPrompt: [newConversation, ...prevPrompt] });
                        } else {
                            // 已存在，更新对话内容
                            const updatedPrevPrompt = [...prevPrompt];
                            updatedPrevPrompt[existingIndex] = newConversation;
                            set({ prevPrompt: updatedPrevPrompt });
                        }
                    }

                    // 重置状态
                    set({
                        inchat: false,
                        loading: false,
                        showResult: false,
                        recentPrompt: [],
                        input: "",
                        tempInput: ""
                    });
                },

                //每次发送请求清空输入框和历史回复
                onSent: async (prompt) => {
                    const { input, prevPrompt, loading, inchat, recentPrompt } = get();

                    if (loading) {
                        alert("正在生成回答，请稍后再试");
                        return;
                    }

                    // 默认是直接使用输入框的文本，如果有语音输入即可替代
                    const currentPrompt = prompt !== undefined ? prompt : input;

                    // 如果没有内容，不执行
                    if (!currentPrompt.trim()) return;

                    // 设置加载状态
                    set({
                        tempInput: currentPrompt,
                        input: "",
                        loading: true,
                        showResult: true
                    });

                    try {
                        // 调用 API，传递对话历史
                        const apiResponse = await runChat(currentPrompt, recentPrompt);

                        // 处理 API 响应
                        if (typeof apiResponse === 'string') {
                            // 错误情况，返回的是错误字符串
                            set({
                                resultData: apiResponse,
                                loading: false
                            });
                        } else {
                            // 成功情况，返回的是对象 {id, content}
                            const responseObj = apiResponse as ApiResponse;
                            // 构建新的对话记录
                            const newMessage = {
                                id: responseObj.id || Date.now().toString(),
                                prompt: currentPrompt,
                                response: responseObj.content
                            };

                            // 更新结果
                            set({

                                recentPrompt: [...recentPrompt, newMessage],
                                resultData: responseObj.content,
                                loading: false
                            });
                        }

                    } catch (error) {
                        console.error("Chat Error:", error);
                        set({
                            resultData: "Error fetching response.",
                            loading: false
                        });
                    }
                },

                setRecentPrompt: (messages) => set({ recentPrompt: messages }),
                setPrevprompt: (conversations) => set({ prevPrompt: conversations }),
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
        }),
        { name: "LcPartner Store" }
    )
)