import React, { useRef, useEffect } from "react";
import "./Main.css";
import { assets } from "@/assets/assets";
import { useChatStore } from "@/context/useChatStore";
import MarkdownRenderer from "@/components/MarkdownRender/MarkdownRender.jsx";
import TextInput from "@/components/TextInput/TextInput.jsx";
import { Card, Button } from "antd";
import { useVirtualizer } from "@tanstack/react-virtual";

// 生成模拟的1000条对话历史（一个对话会话中包含1000轮对话）
const generateMockConversationHistory = (count = 1000) => {
  const questions = [
    "什么是人工智能？",
    "机器学习和深度学习有什么区别？",
    "神经网络是如何工作的？",
    "什么是自然语言处理？",
    "计算机视觉的应用场景有哪些？",
    "强化学习的基本原理是什么？",
    "如何开始学习AI？",
    "AI的发展趋势是什么？",
    "什么是大语言模型？",
    "Transformer架构有什么优势？"
  ];

  const answers = [
    "人工智能（AI）是计算机科学的一个分支，致力于创建能够模拟人类智能行为的系统。这些系统可以学习、推理、解决问题、理解自然语言、感知环境等。AI的核心目标是让机器能够像人类一样思考和决策。",
    "机器学习是AI的一个子领域，它使计算机能够从数据中学习而无需明确编程。深度学习是机器学习的一个特殊分支，使用多层神经网络来学习数据的复杂模式。简单来说，深度学习是机器学习的一种特殊方法。",
    "神经网络是一种受人类大脑结构启发的计算模型。它由许多相互连接的节点（神经元）组成，这些节点按层组织。数据通过输入层进入，经过隐藏层的处理和变换，最后在输出层产生结果。训练过程就是调整连接权重的过程。",
    "自然语言处理（NLP）是AI的一个重要领域，专注于让计算机理解、解释和生成人类语言。NLP的应用包括机器翻译、情感分析、文本摘要、问答系统、语音识别等。近年来，大语言模型的发展大大提升了NLP的能力。",
    "计算机视觉（CV）使计算机能够从图像和视频中获取理解和洞察。主要应用包括：人脸识别、物体检测、自动驾驶、医疗影像分析、安防监控、工业质检、增强现实等。随着深度学习的发展，CV的准确率大幅提升。",
    "强化学习是一种机器学习方法，智能体通过与环境互动来学习最佳行为策略。智能体获得环境状态的奖励或惩罚信号，通过试错来最大化累积奖励。著名的应用包括AlphaGo、游戏AI、机器人控制等。",
    "学习AI的建议路径：1）打好数学基础（线性代数、概率统计、微积分）；2）学习Python编程；3）掌握机器学习基础；4）学习深度学习框架（如PyTorch、TensorFlow）；5）动手做项目；6）持续阅读论文和跟进最新进展。",
    "AI的发展趋势包括：大语言模型的能力持续提升、多模态AI的兴起（文本、图像、视频融合）、AI Agent的广泛应用、边缘AI和端侧部署、AI安全和对齐研究的深入、AI与各行各业的深度融合等。",
    "大语言模型（LLM）是一种基于深度学习的语言模型，它在海量文本数据上进行训练，能够生成和理解自然语言。典型代表包括GPT系列、Claude、Llama等。LLM可以完成写作、翻译、问答、代码生成等多种任务。",
    "Transformer架构于2017年提出，革新了NLP领域。其核心是自注意力机制，能够并行处理序列数据，捕捉长距离依赖关系。相比RNN，Transformer训练更快、更容易并行化，成为现代LLM的基础架构。"
  ];

  const conversation = [];
  for (let i = 0; i < count; i++) {
    const qIndex = i % questions.length;
    conversation.push({
      id: `msg-${i + 1}`,
      prompt: questions[qIndex],
      response: answers[qIndex]
    });
  }
  return conversation;
};

const Main = () => {
  const { onSent, recentPrompt, showResult, loading, tempInput, newChat, setRecentPrompt, setPrevprompt, setShowResult } =
    useChatStore();
  // 创建滚动容器的 ref
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: recentPrompt.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // 给一个预估高度，这里不需要非常精确
    overscan: 5, // 预加载可视区域外的数量，防止滚动太快出现白屏
  });
  // 测试用：加载一个包含1000条对话历史的会话
  const handleLoadMockHistory = () => {
    const conversation = generateMockConversationHistory(10000);
    const mockPrevPrompt = [{
      title: "关于AI技术的深度讨论",
      conversation: conversation
    }];
    setPrevprompt(mockPrevPrompt);
    setRecentPrompt(conversation);
    setShowResult(true);
  };

  // 自动滚动到底部逻辑 (当有新消息或loading状态变化时)
  useEffect(() => {
    if (showResult && parentRef.current) {
      // 这里的逻辑可以根据需求调整，比如只有当用户接近底部时才自动滚动
      // 简单粗暴的方式：
      const timeout = setTimeout(() => {
        rowVirtualizer.scrollToIndex(recentPrompt.length - 1, { align: 'end' }, { behavior: 'smooth' });
      }, 100); // 稍微延迟等待渲染
      return () => clearTimeout(timeout);
    }
  }, [recentPrompt.length, loading, showResult, rowVirtualizer]);

  return (
    <div className="flex-1 h-screen relative pb-[15vh] dark:bg-black">
      <div className="flex justify-between items-center mt-2">
        <p className="dark:text-white text-2xl font-bold pl-2">LcPartner</p>
        <img className="w-10 h-10 rounded-full my-1 mx-3" src={assets.user_icon} alt="" />
      </div>
      <div className="max-w-[900px] mx-auto h-full overflow-y-auto pb-5">
        {/* 测试按钮：加载1000条对话历史 */}
        {!showResult && (
          <div className="mb-4">
            <Button
              type="primary"
              onClick={handleLoadMockHistory}
              className="bg-blue-500"
            >
              测试：加载1000条对话历史的会话
            </Button>
          </div>
        )}
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
            <div ref={parentRef} className=" overflow-y-auto h-full pt-2 pb-[140px]">
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {/* 遍历虚拟项 */}
                {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                  const item = recentPrompt[virtualItem.index];

                  return (
                    <div
                      key={virtualItem.key}
                      // 关键点：ref={rowVirtualizer.measureElement}
                      // 这允许 virtualizer 测量渲染后的真实高度
                      ref={rowVirtualizer.measureElement}
                      data-index={virtualItem.index}
                      className="absolute top-0 left-0 w-full px-2"
                      style={{
                        // 使用 transform 进行定位
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      {/* 单条消息内容 */}
                      <div className="flex flex-col mb-7">
                        {/* 用户输入 */}
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

                        {/* AI 回复 */}
                        <div className="flex flex-row">
                          <div
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
                    </div>
                  );
                })}
              </div>
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