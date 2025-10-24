import React, { useState, useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import icon_timer from './assets/icon_timer.png';
import icon_pet from './assets/icon_pet.png';
import icon_chouqian from './assets/icon_chouqian.png';
import icon_chat from './assets/icon_chat.png';
import icon_buddy from './assets/icon_study.png';

// 导入拆分出去的页面组件
import { FortuneTellingPage, FortuneResultPage } from './components/FortuneTellingPage';
import { QuestionPage } from './components/QuestionPage';
import { TimerPage } from './components/TimerPage';
import { PetPage } from './components/PetPage';
import StudyBuddyPage from './components/StudyBuddyPage';
import { ChatSessionPage } from './components/ChatSessionPage';

// 暗风格首页组件
function DarkHomePage() {
  const navigate = useNavigate();

  // 处理分类点击事件
  const handleCategoryClick = (category) => {
    switch(category) {
      case 'fortune':
        navigate('/fortune-telling');
        break;
      case 'question':
        navigate('/ask-question');
        break;
      case 'timer':
        navigate('/study-timer');
        break;
      case 'pet':
        navigate('/pet-training');
        break;
      case 'buddy':
        navigate('/study-buddy');
        break;
      default:
        break;
    }
  };

  // 处理关于我们点击事件 - 修改为滚动到页面底部的关于我们部分
  const handleAboutUsClick = () => {
    document.getElementById('about-us-section').scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <div className="dark-homepage">
      {/* 顶部导航栏 */}
      <header className="dark-header">
        <div className="header-left">
          <img src="/logo.svg" alt="Logo" className="app-logo" />
          <h1 className="app-title">学习能量站</h1>
        </div>
        <nav className="main-nav">
          <button className="nav-button" onClick={handleAboutUsClick}>关于我们</button>
        </nav>
      </header>

      {/* 主要内容区域 */}
      <main className="dark-content">
        <h2 className="welcome-title">欢迎来到学习能量站</h2>
        <p className="welcome-subtitle">选择您想要的功能开始学习之旅</p>

        {/* 分类卡片网格 */}
        <div className="categories-grid">
          <CategoryCard
            title="能量启程"
            description="一签一心境，解锁专属学习能量"
            icon={icon_chouqian}
            onClick={() => handleCategoryClick('fortune')}
          />
          
          <CategoryCard
            title="伴学树洞​​"
            description="学途漫漫，做你最忠实的倾听者"
            icon={icon_chat}
            onClick={() => handleCategoryClick('question')}
          />
          
          <CategoryCard
            title="沉静时空"
            description="开启专注结界，开始高效沉浸时光"
            icon={icon_timer}
            onClick={() => handleCategoryClick('timer')}
          />
          
          <CategoryCard
            title="灵犀伙伴"
            description="领养专属伙伴，用专注见证彼此成长"
            icon={icon_pet}
            onClick={() => handleCategoryClick('pet')}
          />
          
          <CategoryCard
            title="学海知己"
            description="学习不孤单，发现同样在努力的TA"
            icon={icon_buddy}
            onClick={() => handleCategoryClick('buddy')}
          />
        </div>
      </main>

      {/* 关于我们部分 - 添加到首页底部 */}
      <section id="about-us-section" className="about-us-section">
        <div className="subpage-content">
          <h1>关于我们</h1>
          <p>学习能量站致力于为学习者提供有趣、激励的学习体验，帮助大家更高效地学习和成长。</p>
          <p>我们的使命是让学习变得更有趣，更有动力！</p>
          <p>团队成员：孙世玉、朱文英、王子君</p>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="dark-footer">
        <p className="footer-text">学习能量站 © 2025 | 让学习更有趣</p>
      </footer>
    </div>
  );
}

// 分类卡片组件
function CategoryCard({ title, description, icon, onClick }) {
  return (
    <div className="category-card" onClick={onClick}>
      <div className="category-icon">
        <img src={icon} alt={title} className="category-icon-image" />
      </div>
      <h3 className="category-title">{title}</h3>
      <p className="category-description">{description}</p>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* 首页路由 */}
      <Route path="/" element={<DarkHomePage />} />
      
      {/* 四个分类的二级页面路由 */}
      <Route path="/fortune-telling" element={<FortuneTellingPage />} />
      <Route path="/fortune-result" element={<FortuneResultPage />} />
      <Route path="/ask-question" element={<QuestionPage />} />
      <Route path="/study-timer" element={<TimerPage />} />
      <Route path="/pet-training" element={<PetPage />} />
      <Route path="/study-buddy" element={<StudyBuddyPage />} />
      <Route path="/chat-session" element={<ChatSessionPage />} />
    </Routes>
  );
}

export default App;
