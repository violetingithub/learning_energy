import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect, useRef } from 'react'
import learningApi, { AIChatPrompt } from '../api/learningApi'

// 我要提问页面组件 - 聊天界面风格
export function QuestionPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    // 系统消息 - 欢迎语
    {
      id: 1,
      type: 'system',
      content: '心情如何？我能给你满满的情绪价值哦。',
      avatar: '❤️'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showGuideQuestions, setShowGuideQuestions] = useState(true);
  const chatContainerRef = useRef(null);

  // 引导问题数组
  const guideQuestions = [
    '今天学习遇到什么困难了吗？',
    '有什么想和我聊聊的吗？'
  ];

  // 自动滚动到底部
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // 处理发送消息
  const handleSendMessage = () => {
    if (!inputMessage.trim() || isSending) return;

    // 隐藏引导问题
    setShowGuideQuestions(false);

    // 添加用户消息
    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');

    // AI回复
    generateChat(inputMessage);
  };

  // 处理引导问题点击
  const handleGuideQuestionClick = (question) => {
    // 隐藏引导问题
    setShowGuideQuestions(false);

    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      content: question
    };

    setMessages(prev => [...prev, newUserMessage]);
    // AI回复
    generateChat(question);
  };

  // 处理回车发送
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 返回首页
  const handleBackToHome = () => {
    navigate('/');
  };

  const generateChat = async (content) => {
    setIsSending(true);
    try {
      const apiResponse = await learningApi.generateAI({ prompt: AIChatPrompt.replace('${content}', content) })
      const data = apiResponse.data
      if (!data.choices || data.choices.length === 0) {
        throw new Error('文心一言API调用结果为空')
      }

      const result = data.choices[0].message.content
      console.log('生成结果:', result)

      // 解析JSON格式的结果
      let parsedResult
      try {
        // 提取JSON部分
        const jsonMatch = result.match(/\{[^}]*\}/)
        if (jsonMatch) {
          parsedResult = JSON.parse(jsonMatch[0])
        } else {
          throw new Error('无法从结果中提取JSON')
        }
      } catch (parseError) {
        console.error('JSON解析错误:', parseError)
      }

      console.log('解析后的春联数据:', parsedResult)

      // 检查是否获取到完整的数据
      if (!parsedResult.content) {
        throw new Error('数据不完整: ' + JSON.stringify(parsedResult))
      }
      const newSystemMessage = {
        id: Date.now() + 1,
        type: 'system',
        content: parsedResult.content,
        avatar: '❤️'
      };

      setMessages(prev => [...prev, newSystemMessage]);
    } catch (error) {
      console.error('生成文本过程中发生错误:', error)
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      const newSystemMessage = {
        id: Date.now() + 1,
        type: 'system',
        content: randomReply,
        avatar: '❤️'
      };
      setMessages(prev => [...prev, newSystemMessage]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="subpage question-page">
      <button className="back-button" onClick={handleBackToHome}>← 返回首页</button>

      {/* 顶部标题 */}
      <div className="chat-header">
        <h1 className="chat-title">伴学树洞</h1>
      </div>

      {/* 聊天内容区域 */}
      <div className="chat-container" ref={chatContainerRef}>
        {/* 消息列表 */}
        <div className="message-list">
          {/* 渲染消息列表 */}
          {messages.map((message, index) => {
            // 检查是否是第一条消息
            const isFirstMessage = index === 0;

            return (
              <React.Fragment key={message.id}>
                <div className={`message ${message.type}-message`}>
                  {message.type === 'system' && message.avatar && (
                    <div className="message-avatar">{message.avatar}</div>
                  )}
                  <div className="message-content">{message.content}</div>
                </div>

                {/* 第一条消息下面显示引导问题 */}
                {isFirstMessage && showGuideQuestions && (
                  <div className="guide-questions-wrapper">
                    {guideQuestions.map((question, qIndex) => (
                      <div
                        key={qIndex}
                        className="guide-question"
                        onClick={() => handleGuideQuestionClick(question)}
                      >
                        {question}
                      </div>
                    ))}
                  </div>
                )}
              </React.Fragment>
            );
          })}

          {/* 发送中状态 */}
          {isSending && (
            <div className="message system-message">
              <div className="message-avatar">❤️</div>
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