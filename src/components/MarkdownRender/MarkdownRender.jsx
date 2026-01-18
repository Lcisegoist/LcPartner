import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism"; // 这里选择了类似 VSCode 的深色主题
import remarkGfm from "remark-gfm";
import "./MarkdownRender.css"
const MarkdownRenderer = ({ content }) => {
  return (
    <div className="prose max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 自定义代码块渲染逻辑
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";

            // 如果是行内代码 (如 `const a = 1`)
            if (inline) {
              return (
                <code className="bg-gray-200 text-red-500 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                  {children}
                </code>
              );
            }

            // 如果是代码块 (```javascript ... ```)
            return (
              <div className="relative my-4 rounded-lg overflow-hidden bg-[#1e1e1e]">
                {/* 代码块顶部栏：显示语言和复制按钮 */}
                <div className="flex justify-between items-center px-4 py-2 bg-[#2d2d2d] text-gray-300 text-xs select-none">
                  <span className="font-bold font-mono lowercase">
                    {language || "code"}
                  </span>
                  <CopyButton code={String(children).replace(/\n$/, "")} />
                </div>

                {/* 代码高亮区域 */}
                <SyntaxHighlighter
                  {...props}
                  style={oneDark} // 使用类似 Gemini/VSCode 的深色主题
                  language={language}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    padding: "1.5rem",
                    backgroundColor: "transparent", // 背景色由外层 div 控制
                    fontSize: "0.9rem",
                    lineHeight: "1.5",
                  }}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

// 独立的复制按钮组件
const CopyButton = ({ code }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // 2秒后恢复图标
    } catch (err) {
      console.error("复制失败", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
    >
      {isCopied ? (
        <>
          {/* 这里可以换成你的 assets.tick_icon 或者 SVG */}
          <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>已复制</span>
        </>
      ) : (
        <>
          {/* 这里可以换成你的 assets.copy_icon 或者 SVG */}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>复制</span>
        </>
      )}
    </button>
  );
};

export default MarkdownRenderer;