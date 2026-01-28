import React, { useRef, useEffect } from "react";
import { assets } from "@/assets/assets";
import { useChatStore } from "@/context/useChatStore";

const TextInput = () => {
  const {
    recognition,
    input,
    setInput,
    handleKeyPress,
    onSent,
    voiceSearch,
    openVoiceSearch,
  } = useChatStore();

  const textareaRef = useRef(null);

  // 自动调整高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);
  const hasInput = input.trim() !== "";
  return (
    <>
      <div className="relative flex items-center bg-[#f0f4f9] rounded-3xl px-4 py-3">
        <textarea
          ref={textareaRef}
          className="
          w-full
          max-h-[150px]
          bg-transparent
          border-none
          outline-none
          text-[18px]
          resize-none
          overflow-hidden
          overflow-y-auto
          font-inherit
          py-1
          px-2
          mb-6
        "

          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSent();
            }
          }}
          rows={1}
          placeholder="在这里输入提示..."
        />

        <div className="absolute right-4 bottom-3 flex gap-3 items-center">
          <img src={assets.gallery_icon} className="w-6 cursor-pointer" />
          {!hasInput && (
            <img
              src={assets.mic_icon}
              onClick={openVoiceSearch}
              className={`w-6 cursor-pointer ${voiceSearch ? "recording" : ""}`}
            />
          )}
          {hasInput && (
            <img
              src={assets.send_icon}
              onClick={() => onSent()}
              className="w-6 cursor-pointer"
            />
          )}
        </div>
      </div>
    </>


  );
};

export default TextInput;
