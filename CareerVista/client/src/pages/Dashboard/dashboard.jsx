import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './dashboard.css';

const Dashboard = () => {
  // State for user data, recommendations, skills, etc.
  const [user, setUser] = useState({
    name: 'Rahul Sharma',
    completion: 75,
  });

  const [recommendations, setRecommendations] = useState([
    { id: 1, title: 'Data Scientist', match: 92, growth: '27%', salary: '₹12-18L', skills: ['Python', 'ML', 'Statistics'] },
    { id: 2, title: 'AI Engineer', match: 88, growth: '32%', salary: '₹10-16L', skills: ['Python', 'TensorFlow', 'Deep Learning'] },
    { id: 3, title: 'Product Manager', match: 79, growth: '22%', salary: '₹15-22L', skills: ['Strategy', 'UX', 'Analytics'] }
  ]);
  
  const [skillGaps, setSkillGaps] = useState([
    { skill: 'Machine Learning', level: 40, priority: 'High', resources: 12 },
    { skill: 'Cloud Computing', level: 30, priority: 'Medium', resources: 8 },
    { skill: 'Data Visualization', level: 60, priority: 'Medium', resources: 5 }
  ]);
  
  const [marketInsights, setMarketInsights] = useState([
    { trend: 'AI Jobs', change: '+27%', description: 'AI roles seeing massive growth' },
    { trend: 'Remote Work', change: '+18%', description: 'More companies offering remote options' },
    { trend: 'UX Design', change: '+15%', description: 'Increased demand for UX professionals' }
  ]);
  
  const [roadmapProgress, setRoadmapProgress] = useState([
    { week: 'Week 1-2', title: 'Python Fundamentals', progress: 100, status: 'completed' },
    { week: 'Week 3-4', title: 'Data Analysis with Pandas', progress: 80, status: 'in-progress' },
    { week: 'Week 5-6', title: 'Machine Learning Basics', progress: 20, status: 'not-started' }
  ]);

  // State for UI and Chatbot
  const [activeTab, setActiveTab] = useState('dashboard');
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Hi there! I'm your AI Career Mentor. How can I help you today?", sender: 'bot' }
  ]);
  const [messageInput, setMessageInput] = useState('');

  // Chatbot message handler
  const handleSendMessage = () => {
    if (messageInput.trim() === '') return;

    const newUserMessage = {
      id: chatMessages.length + 1,
      text: messageInput,
      sender: 'user'
    };

    setChatMessages([...chatMessages, newUserMessage]);
    setMessageInput('');

    setTimeout(() => {
      const botResponse = {
        id: chatMessages.length + 2,
        text: "Based on your profile, I recommend focusing on machine learning skills. Would you like me to suggest some resources?",
        sender: 'bot'
      };
      setChatMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>
            <span className="logo-icon">🧠</span>
            CareerVista
          </h2>
        </div>

        <div className="user-profile">
          <div className="avatar">{user.name.charAt(0)}</div>
          <h3>{user.name}</h3>
          <p>Profile {user.completion}% complete</p>
          <div className="completion-bar">
            <div
              className="completion-progress"
              style={{ width: `${user.completion}%` }}
            ></div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className={activeTab === 'dashboard' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('dashboard')}>
            <span className="nav-icon">📊</span> Dashboard
          </button>
          <button className={activeTab === 'career' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('career')}>
            <span className="nav-icon">🎯</span> Career Advisor
          </button>
          <button className={activeTab === 'roadmap' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('roadmap')}>
            <span className="nav-icon">🛣️</span> Roadmap Generator
          </button>
          <button className={activeTab === 'skills' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('skills')}>
            <span className="nav-icon">📚</span> Skill Upgradation
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="content-header">
          <div>
            <h1>Welcome back, {user.name.split(' ')[0]}!</h1>
            <p>Here’s your personalized career dashboard</p>
          </div>
        </header>

        {/* ============================================= */}
        {/* ======== MVP Entry Modules (HIGHLIGHTED) ======== */}
        {/* ============================================= */}
        <section className="modules-section">
          <h2 className="section-title">Start Your Journey</h2>
          <div className="modules-grid">
            <Link to="/career" className="module-card">
              <span className="module-icon">🎯</span>
              <h3>Career Advisor</h3>
              <p>Get personalized guidance and market-driven career paths.</p>
            </Link>

            <Link to="/roadmap" className="module-card">
              <span className="module-icon">🛣️</span>
              <h3>Roadmap Generator</h3>
              <p>Build a tailored learning and career progression roadmap.</p>
            </Link>

            <Link to="/skills" className="module-card">
              <span className="module-icon">📚</span>
              <h3>Skill Upgradation</h3>
              <p>Strengthen your skills and prepare for interviews.</p>
            </Link>
          </div>
        </section>

        {/* ============================================= */}
        {/* ======== Detailed Stats & Content ========= */}
        {/* ============================================= */}

        {/* Dashboard Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon career">🎯</div>
            <div className="stat-info">
              <h3>Career Matches</h3>
              <span className="stat-number">{recommendations.length}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon skills">📚</div>
            <div className="stat-info">
              <h3>Skills to Improve</h3>
              <span className="stat-number">{skillGaps.length}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon progress">📈</div>
            <div className="stat-info">
              <h3>Learning Progress</h3>
              <span className="stat-number">{roadmapProgress.filter(item => item.status === 'completed').length}/{roadmapProgress.length}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon market">🌐</div>
            <div className="stat-info">
              <h3>Market Trends</h3>
              <span className="stat-number">{marketInsights.length}</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="content-grid">
          {/* Career Recommendations */}
          <div className="content-card">
            <div className="card-header">
              <h2>Career Recommendations</h2>
              <button className="see-all">See all</button>
            </div>
            <div className="recommendations-list">
              {recommendations.map((job) => (
                <div key={job.id} className="recommendation-item">
                  <div className="job-info">
                    <h3>{job.title}</h3>
                    <div className="job-meta">
                      <span className="growth">Growth: {job.growth}</span>
                      <span className="salary">{job.salary}</span>
                    </div>
                  </div>
                  <div className="match-score">
                    <div className="score">{job.match}%</div>
                    <span>Match</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Gap Analysis */}
          <div className="content-card">
            <div className="card-header">
              <h2>Skill Gap Analysis</h2>
              <button className="see-all">See details</button>
            </div>
            <div className="skill-gaps">
              {skillGaps.map((skill, index) => (
                <div key={index} className="skill-item">
                  <div className="skill-header">
                    <h4>{skill.skill}</h4>
                    <span className={`priority-badge ${skill.priority.toLowerCase()}`}>{skill.priority}</span>
                  </div>
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${skill.level}%` }}></div>
                    </div>
                    <span className="progress-text">{skill.level}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* AI Career Mentor Chatbot */}
      <div className={`chatbot-container ${chatbotOpen ? 'open' : ''}`}>
        <div className="chatbot-header" onClick={() => setChatbotOpen(!chatbotOpen)}>
          <h3>AI Career Mentor</h3>
          <span className="toggle-icon">{chatbotOpen ? '▼' : '▲'}</span>
        </div>
        
        {chatbotOpen && (
          <div className="chatbot-content">
            <div className="chat-messages">
              {chatMessages.map(message => (
                <div key={message.id} className={`message ${message.sender}`}>
                  {message.text}
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                placeholder="Ask about careers..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>
                <span className="icon">📤</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;