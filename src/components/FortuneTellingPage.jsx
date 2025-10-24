import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import learningApi, { ChouQianPrompt } from '../api/learningApi'
import iconCqBg from '../assets/icon_cq_bg.png'

// 学习能量盲盒页面（二级页面）
export function FortuneTellingPage() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false) // 添加loading状态
  const [isShaking, setIsShaking] = useState(false) // 添加摇晃状态

  const generateFortune = async () => {
    setIsLoading(true) // 设置loading为true
    setIsShaking(true) // 开始摇晃动画
    
    try {
      const apiResponse = await learningApi.generateAI({prompt: ChouQianPrompt})

      console.log('文心一言API调用成功:', apiResponse.status === 200)
      console.log('API响应:', apiResponse.data)

      if (!apiResponse.data) {
        throw new Error('文心一言API调用失败: ' + JSON.stringify(apiResponse.data))
      }

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

      // 跳转到结果页面并传递数据
      navigate('/fortune-result', {
        state: {
          fortune: {
            type: parsedResult.type,
            content: parsedResult.content
          }
        }
      });

    } catch (error) {
      console.error('生成文本过程中发生错误:', error)
      // 如果出错，使用默认文本
      navigate('/fortune-result', {
        state: {
          fortune: {
            type: '宜学习',
            content: '今天的勤奋耕耘是明日硕果的根基，坚持让知识照亮前行的道路，你将遇见更好的自己，未来必定光芒万丈。'
          }
        }
      });
    } finally {
      setIsLoading(false) // 设置loading为false
      setIsShaking(false) // 停止摇晃动画
    }
  }

  // 返回首页
  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="fortune-page">
      <button className="back-button" onClick={handleBackToHome}>← 返回首页</button>
      <div className="home-container">
        <div className="fortune-telling-container">
          {/* <div className="tag-label">宜学习</div> */}
          <h1 className="main-title">学习能量盲盒</h1>
          <p className="fortune-text">
            今天的勤奋耕耘是明日硕果的根基，坚持让知识照亮前行的道路，你将遇见更好的自己，未来必定光芒万丈。
          </p>
          <div className="fortune-sticks-container">
            <img 
              src={iconCqBg} 
              alt="签筒" 
              className={`fortune-image ${isShaking ? 'shaking' : ''}`}
            />
          </div>
          <button className="draw-button" onClick={generateFortune} disabled={isLoading}>
            {isLoading ? '求签中...' : '开始求签'}
          </button>
        </div>
      </div>
    </div>
  );
}

// 抽签结果页面（二级页面）
export function FortuneResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [fortune, setFortune] = useState(() => {
    // 从路由状态中获取抽签结果
    if (location.state && location.state.fortune) {
      return location.state.fortune;
    }
    // 如果没有参数，使用默认内容
    return {
      type: '宜学习',
      content: '今天的勤奋耕耘是明日硕果的根基，坚持让知识照亮前行的道路，你将遇见更好的自己，未来必定光芒万丈。'
    };
  });

  // 处理再抽一次按钮点击事件
  const handleDrawAgain = () => {
    navigate('/fortune-telling');
  };

  // 返回首页
  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="result-page">
      <button className="back-button" onClick={handleBackToHome}>← 返回首页</button>
      <div className="result-container">
        <div className="result-card">
          <div className="tag-label">{fortune.type}</div>
          <h1 className="result-title">你的学习能量</h1>
          <div className="quote-box">
            <p className="result-quote">{fortune.content}</p>
          </div>
          <button className="draw-again-button" onClick={handleDrawAgain}>
            再抽一次
          </button>
        </div>
      </div>
    </div>
  );
}