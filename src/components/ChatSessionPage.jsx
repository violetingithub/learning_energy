import { useNavigate, useLocation } from 'react-router-dom'
import React, { useState, useEffect, useRef } from 'react'
import learningApi, { UserChatPrompt } from '../api/learningApi'

// 聊天会话页面组件
export function ChatSessionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const buddy = location.state?.buddy;
  
  const [messages, setMessages] = useState([]);
  
  // 初始化：发送第一条系统消息
  useEffect(() => {
    if (buddy && messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        type: 'system',
        content: `你好！我是${buddy.name}，很高兴认识你，有什么想聊的吗？`,
        avatar: buddy.avatar
      };
      setMessages([welcomeMessage]);
    }
  }, [buddy]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatContainerRef = useRef(null);

  // 自动滚动到底部
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // 处理发送消息
  const handleSendMessage = () => {
    if (!inputMessage.trim() || isSending) return;

    // 添加用户消息
    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim()
    };

    setMessages(prev => [...prev, newUserMessage]);
    const userInput = inputMessage.trim();
    setInputMessage('');

    // AI回复
    generateChat(userInput);
  };

  // 生成AI回复
  const generateChat = async (content) => {
    setIsSending(true);
    try {
      const apiResponse = await learningApi.generateAI({ prompt: UserChatPrompt.replace('${content}', content) });
      const data = apiResponse.data;
      if (!data.choices || data.choices.length === 0) {
        throw new Error('文心一言API调用结果为空');
      }

      const result = data.choices[0].message.content;
      console.log('生成结果:', result);

      // 解析JSON格式的结果
      let parsedResult;
      try {
        // 提取JSON部分
        const jsonMatch = result.match(/\{[^}]*\}/);
        if (jsonMatch) {
          parsedResult = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('无法从结果中提取JSON');
        }
      } catch (parseError) {
        console.error('JSON解析错误:', parseError);
      }

      console.log('解析后的数据:', parsedResult);

      // 检查是否获取到完整的数据
      if (!parsedResult.content) {
        throw new Error('数据不完整: ' + JSON.stringify(parsedResult));
      }
      const newSystemMessage = {
        id: Date.now() + 1,
        type: 'system',
        content: parsedResult.content,
        avatar: buddy?.avatar || '👋'
      };

      setMessages(prev => [...prev, newSystemMessage]);
    } catch (error) {
      console.error('生成文本过程中发生错误:', error);
      const newSystemMessage = {
        id: Date.now() + 1,
        type: 'system',
        content: '抱歉，我现在有点累了，稍后再聊吧~',
        avatar: buddy?.avatar || '👋'
      };
      setMessages(prev => [...prev, newSystemMessage]);
    } finally {
      setIsSending(false);
    }
  };

  // 处理按键事件
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 返回上一页
  const handleBack = () => {
    navigate('/study-buddy', { state: { returnFromChat: true } });
  };

  return (
    <div className="subpage question-page">
      <button className="back-button" onClick={handleBack}>← 返回</button>

      {/* 顶部标题 */}
      <div className="chat-header">
        <h1 className="chat-title">
          {buddy?.name || '学习伙伴'}
        </h1>
      </div>

      {/* 聊天内容区域 */}
      <div className="chat-container" ref={chatContainerRef}>
        {/* 消息列表 */}
        <div className="message-list">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}-message`}>
              <div className="message-content">{message.content}</div>
            </div>
          ))}

          {/* 发送中状态 */}
          {isSending && (
            <div className="message system-message">
              <div className="message-content sending">
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 底部输入区域 */}
      <div className="input-container">
        <div className="input-wrapper">
          <input
            type="text"
            className="message-input"
            placeholder="发消息..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isSending}
          />
          <button
            className="send-button"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isSending}
          >
            <span className="send-icon">↑</span>
          </button>
        </div>
      </div>
    </div>
  );
}