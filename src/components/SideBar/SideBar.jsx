import React, { useState } from 'react'
import './SideBard.css'
import { assets } from '../../assets/assets'
import { useChatStore } from '../../context/useChatStore';

const SideBar = () => {
    const [extended, setExtended] = useState(true);
    const { prevPrompt, setRecentPrompt, newChat, setPrevprompt, setShowResult } = useChatStore();

    const loadConversation = async (conversationData) => {
        // 恢复完整的对话历史
        setRecentPrompt(conversationData.conversation);
        // 设置显示结果为 true，这样会显示对话内容
        setShowResult(true);
    }

    const deleteConversation = (index) => {
        const updatedPrevPrompt = [...prevPrompt];
        updatedPrevPrompt.splice(index, 1);
        setPrevprompt(updatedPrevPrompt);
    }

    let lastClickedTime = 0;

    const handleDoubleClick = (index) => {
        const currentTime = new Date().getTime();
        if (currentTime - lastClickedTime < 300) {
            deleteConversation(index);
        }
        lastClickedTime = currentTime;
    }

    return (
        <div className='sidebar'>
            <div className="top">
                <img className='menu' src={assets.menu_icon} alt="" onClick={() => setExtended(!extended)} />
                <div onClick={() => newChat()} className="new-chat">
                    <img src={assets.plus_icon} alt="" />
                    {extended ? <p>New Chat</p> : null}
                </div>
                {extended &&
                    <div className="recent">
                        <p className='recent-title'>Recent</p>
                        {prevPrompt.map((conversation, index) => (
                            <div
                                key={index}
                                onClick={() => loadConversation(conversation)}
                                onDoubleClick={() => handleDoubleClick(index)}
                                className="flex items-center mb-2 hover:bg-gray-200 hover:cursor-pointer rounded-lg p-2 justify-between"
                            >
                                <div className="flex items-center">
                                    <img src={assets.message_icon} alt="" />
                                    <p className="ml-1">{conversation.title}</p>
                                </div>
                                <img className="hover:scale-110 transition-all duration-300 hover:bg-gray-400 rounded-lg cursor-pointer" src={assets.trash} onClick={() => deleteConversation(index)} alt="" />
                            </div>
                        ))}
                    </div>
                }
            </div>
            <div className="bottom">
                <div className="bottom-item recent-entry">
                    <img src={assets.question_icon} alt="" />
                    {extended ? <p>Help</p> : null}
                </div>
                <div className="bottom-item recent-entry">
                    <img src={assets.history_icon} alt="" />
                    {extended ? <p>Activity</p> : null}
                </div>
                <div className="bottom-item recent-entry">
                    <img src={assets.setting_icon} alt="" />
                    {extended ? <p>Setting</p> : null}
                </div>
            </div>
        </div>
    )
}

export default SideBar;
