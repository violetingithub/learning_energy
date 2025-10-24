import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import petCatIcon from '../assets/icon_pet_cat.png'

// 宠物养成页面组件
export function PetPage() {
  const navigate = useNavigate();
  const [pet, setPet] = useState({
    name: "学习小猫",
    energy: 80,
    happiness: 75,
    level: 1,
    experience: 0,
    nextLevel: 100,
    status: "happy",
    message: "今天也要好好学习哦！"
  });
  const [isFeeding, setIsFeeding] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [activities, setActivities] = useState([
    { id: 1, name: "完成学习计时", completed: false },
    { id: 2, name: "连续学习7天", completed: false },
    { id: 3, name: "累计学习10小时", completed: false }
  ]);
  
  // 学习能量气泡状态
  const [energyBubbles, setEnergyBubbles] = useState([]);
  
  // 生成随机位置的气泡
  const generateBubbles = () => {
    const bubbles = [];
    for (let i = 0; i < 4; i++) {
      // 生成1-20的随机值
      const value = Math.floor(Math.random() * 20) + 1;
      // 生成随机角度（限制在上半部分：90-270度）
      const angle = Math.PI/2 + Math.random() * Math.PI;
      // 距离中心的距离（更近的范围）
      const distance = 120 + Math.random() * 60;
      // 计算x和y坐标
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      
      bubbles.push({
        id: Date.now() + i,
        value,
        x,
        y,
        animationDelay: Math.random() * 2 // 随机动画延迟
      });
    }
    setEnergyBubbles(bubbles);
  };
  
  // 处理气泡点击
  const handleBubbleClick = (id, value) => {
    // 移除点击的气泡
    setEnergyBubbles(prev => prev.filter(bubble => bubble.id !== id));
    
    // 增加能量值
    setPet(prev => ({
      ...prev,
      energy: Math.min(prev.energy + value, 100),
      message: `获得了${value}点学习能量！`
    }));
    
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };
  
  // 初始化生成气泡
  useEffect(() => {
    generateBubbles();
  }, []);

  // 处理任务选中状态切换
  const handleActivityToggle = (id) => {
    setActivities(prev => prev.map(activity => 
      activity.id === id ? { ...activity, completed: !activity.completed } : activity
    ));
  };

  // 处理返回首页
  const handleBackToHome = () => {
    navigate('/');
  };

  // 喂食功能
  const handleFeed = () => {
    if (isFeeding) return;
    
    setIsFeeding(true);
    
    setPet(prev => ({
      ...prev,
      energy: Math.min(prev.energy + 20, 100),
      happiness: Math.min(prev.happiness + 5, 100),
      message: "谢谢你的食物！好好吃～"
    }));
    
    setShowMessage(true);
    
    setTimeout(() => {
      setIsFeeding(false);
      setTimeout(() => setShowMessage(false), 3000);
    }, 1500);
  };

  // 玩耍功能
  const handlePlay = () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    
    setPet(prev => ({
      ...prev,
      energy: Math.max(prev.energy - 10, 0),
      happiness: Math.min(prev.happiness + 15, 100),
      message: "太好玩了！谢谢你陪我～"
    }));
    
    setShowMessage(true);
    
    setTimeout(() => {
      setIsPlaying(false);
      setTimeout(() => setShowMessage(false), 3000);
    }, 1500);
  };

  // 学习功能
  const handleStudy = () => {
    setPet(prev => ({
      ...prev,
      energy: Math.max(prev.energy - 15, 0),
      happiness: Math.max(prev.happiness - 5, 0),
      experience: Math.min(prev.experience + 25, prev.nextLevel),
      message: "一起学习真开心！加油！"
    }));
    
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  // 随时间自然消耗能量
  useEffect(() => {
    const interval = setInterval(() => {
      setPet(prev => {
        const newEnergy = Math.max(prev.energy - 1, 0);
        const newHappiness = newEnergy < 20 ? Math.max(prev.happiness - 2, 0) : prev.happiness;
        
        let newStatus = prev.status;
        if (newEnergy < 20) newStatus = "tired";
        else if (newHappiness < 30) newStatus = "sad";
        else newStatus = "happy";
        
        return {
          ...prev,
          energy: newEnergy,
          happiness: newHappiness,
          status: newStatus
        };
      });
    }, 30000); // 每30秒减少一点能量

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pet-page">
      <button className="back-button" onClick={handleBackToHome}>← 返回首页</button>
      
      {/* 顶部标题区域 */}
      <div className="pet-header">
        <h1 className="pet-title">灵犀伙伴</h1>
        <p className="pet-subtitle">陪伴学习，共同成长</p>
      </div>
      
      {/* 宠物展示区域 */}
      <div className="pet-container">
        {/* 学习能量气泡 */}
        {energyBubbles.map(bubble => (
          <div 
            key={bubble.id} 
            className="energy-bubble" 
            style={{
              left: `calc(50% + ${bubble.x}px)`,
              top: `calc(50% + ${bubble.y}px)`,
              animationDelay: `${bubble.animationDelay}s`
            }}
            onClick={() => handleBubbleClick(bubble.id, bubble.value)}
          >
            <div className="bubble-content">
              <span className="bubble-value">{bubble.value}</span>
              <span className="bubble-label">学习能量值</span>
            </div>
          </div>
        ))}
        
        <div className="pet-circle">
          <div className={`pet-image pet-${pet.status} ${isFeeding ? 'feeding' : ''} ${isPlaying ? 'playing' : ''}`}>
            <img src={petCatIcon} alt="宠物猫" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
          </div>
          
          {/* 宠物名称 */}
          <div className="pet-name">{pet.name}</div>
          
          {/* 宠物消息 */}
          {showMessage && (
            <div className="pet-message">
              <div className="message-bubble">{pet.message}</div>
            </div>
          )}
          
          {/* 宠物等级 */}
          <div className="pet-level">
            Lv.{pet.level}
          </div>
        </div>
      </div>
      
      {/* 宠物状态区域 */}
      <div className="pet-stats">
        <div className="stat-item">
          <div className="stat-icon">⚡</div>
          <div className="stat-name">能量值</div>
          <div className="stat-value">{pet.energy}/100</div>
          <div className="stat-bar">
            <div 
              className="stat-fill energy-fill" 
              style={{ width: `${pet.energy}%` }}
            ></div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">😊</div>
          <div className="stat-name">心情值</div>
          <div className="stat-value">{pet.happiness}/100</div>
          <div className="stat-bar">
            <div 
              className="stat-fill happiness-fill" 
              style={{ width: `${pet.happiness}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* 互动按钮区域 */}
      <div className="pet-actions">
        <button 
          className={`action-button feed-button ${isFeeding ? 'disabled' : ''}`}
          onClick={handleFeed}
          disabled={isFeeding}
        >
          <span className="action-icon">🍗</span>
          <span className="action-text">喂食</span>
        </button>
        <button 
          className={`action-button play-button ${isPlaying ? 'disabled' : ''}`}
          onClick={handlePlay}
          disabled={isPlaying}
        >
          <span className="action-icon">🎮</span>
          <span className="action-text">玩耍</span>
        </button>
        <button 
          className="action-button study-button"
          onClick={handleStudy}
          disabled={pet.energy < 15}
        >
          <span className="action-icon">📚</span>
          <span className="action-text">学习</span>
        </button>
      </div>
      
      {/* 任务列表 */}
      <div className="activities-section">
        <h3 className="activities-title">今日任务</h3>
        <div className="activities-list">
          {activities.map(activity => (
            <div 
              key={activity.id} 
              className="activity-item"
              onClick={() => handleActivityToggle(activity.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="activity-check">
                {activity.completed ? '✓' : '○'}
              </div>
              <div className="activity-name">{activity.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}