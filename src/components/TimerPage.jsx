import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import learningApi, { TimerPrompt } from '../api/learningApi'

// 学习计时页面组件
export function TimerPage() {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [encouragement, setEncouragement] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef(null);

  // 鼓励话术数组
  const encouragementQuotes = [
    "太棒了！你刚刚专注学习了一段时间，继续保持这种状态！",
    "专注是成功的关键，你已经做得很好了，再接再厉！",
    "每一次专注的学习都是向成功迈进的一步，为你点赞！",
    "学习需要坚持和专注，你已经展示了惊人的毅力，继续加油！",
    "效率来自专注，你刚刚的表现非常出色，保持下去！",
    "专注学习的时光最宝贵，你正在创造属于自己的未来！"
  ];

  const generateQuotes = async () => {
    setIsLoading(true);
    try {
      const apiResponse = await learningApi.generateAI({ prompt: TimerPrompt.replace('${time}', elapsedTime) })
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

      setEncouragement(parsedResult.content)

    } catch (error) {
      console.error('生成文本过程中发生错误:', error)
      // 如果出错，使用默认文本
      setEncouragement(encouragementQuotes[0])
    } finally {
      setIsLoading(false);
    }
  }

  // 格式化时间
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 开始计时
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      const startTime = Date.now() - elapsedTime * 1000;

      timerRef.current = setInterval(() => {
        const currentTime = Math.floor((Date.now() - startTime) / 1000);
        setElapsedTime(currentTime);
      }, 1000);
    }
  };

  // 结束计时
  const stopTimer = () => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setShowEncouragement(true);
    generateQuotes();
  };

  // 重置计时器
  const resetTimer = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setShowEncouragement(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // 返回首页
  const handleBackToHome = () => {
    resetTimer();
    navigate('/');
  };

  // 粒子背景效果
  useEffect(() => {
    const particlesContainer = document.querySelector('.particles-container');
    if (!particlesContainer) return;

    // 清空容器
    particlesContainer.innerHTML = '';

    // 创建粒子
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';

      // 随机位置
      const x = Math.random() * 100;
      const y = Math.random() * 100;

      // 随机动画持续时间
      const duration = 10 + Math.random() * 30;

      // 随机大小
      const size = 2 + Math.random() * 8;

      // 随机动画延迟
      const delay = Math.random() * 5;

      // 设置样式
      particle.style.cssText = `
        position: absolute;
        left: ${x}%;
        top: ${y}%;
        width: ${size}px;
        height: ${size}px;
        background: rgba(0, 180, 216, 0.5);
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(0, 180, 216, 0.7);
        animation: float ${duration}s linear infinite ${delay}s;
        z-index: 0;
      `;

      particlesContainer.appendChild(particle);
    }

    // 定义浮动动画
    if (!document.getElementById('particle-animation')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'particle-animation';
      styleSheet.textContent = `
        @keyframes float {
          0% {
            transform: translate(0, 0);
            opacity: 0.5;
          }
          25% {
            transform: translate(20px, -20px);
            opacity: 0.8;
          }
          50% {
            transform: translate(0, -40px);
            opacity: 0.6;
          }
          75% {
            transform: translate(-20px, -20px);
            opacity: 0.9;
          }
          100% {
            transform: translate(0, 0);
            opacity: 0.5;
          }
        }
      `;
      document.head.appendChild(styleSheet);
    }

    // 清除定时器
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="timer-page">
      {/* 粒子背景容器 */}
      <div className="particles-container">
        {/* 粒子将通过JS动态生成 */}
      </div>

      <button className="back-button" onClick={handleBackToHome}>← 返回首页</button>

      <div className="timer-content">
        <h1 className="timer-title">注意力不集中，效率低？</h1>
        <h2 className="timer-subtitle">试试专注学习计时</h2>

        {/* 计时器显示 */}
        <div className="timer-display">
          {/* 表盘刻度 */}
          {[...Array(12)].map((_, index) => (
            <div key={index} className="timer-tick"></div>
          ))}
          <div className="timer-clock">{formatTime(elapsedTime)}</div>
        </div>

        {/* 控制按钮 */}
        <div className="timer-controls">
          {!isRunning ? (
            <button className="timer-button start-button" onClick={startTimer}>
              开始计时
            </button>
          ) : (
            <button className="timer-button stop-button" onClick={stopTimer} disabled={isLoading}>
              {isLoading ? '生成鼓励话术中...' : '结束计时'}
            </button>
          )}
          <button
            className="timer-button reset-button"
            onClick={resetTimer}
            disabled={isRunning}
          >
            重置
          </button>
        </div>

        {/* 鼓励话术 */}
        {showEncouragement && (
          <div className="encouragement-box">
            {isLoading ? (
              <p className="loading-text">正在生成学习激励...</p>
            ) : (
              <p className="encouragement-text">{encouragement}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}