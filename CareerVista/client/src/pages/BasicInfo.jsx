// src/pages/BasicInfo.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function BasicInfo() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    education: '',
    interests: '',
    skills: '',
    careerGoals: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save basic info and redirect to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo">
            <span className="logo-icon">🧠</span>
            <span className="logo-text">CareerVista</span>
          </div>
          <h2 className="auth-title">Tell us about yourself</h2>
          <p className="auth-subtitle">Help us personalize your career journey</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="education">Education Level</label>
            <select 
              id="education" 
              name="education" 
              value={formData.education}
              onChange={handleChange}
              required
            >
              <option value="">Select your education</option>
              <option value="highschool">High School</option>
              <option value="bachelor">Bachelor's Degree</option>
              <option value="master">Master's Degree</option>
              <option value="phd">PhD</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="interests">Career Interests</label>
            <input
              id="interests"
              type="text"
              name="interests"
              placeholder="e.g. Technology, Business, Healthcare"
              value={formData.interests}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="skills">Current Skills</label>
            <input
              id="skills"
              type="text"
              name="skills"
              placeholder="e.g. Python, Design, Marketing"
              value={formData.skills}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="careerGoals">Career Goals</label>
            <textarea
              id="careerGoals"
              name="careerGoals"
              placeholder="Where do you see yourself in 5 years?"
              value={formData.careerGoals}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <button type="submit" className="btn-primary full-width">
            Continue to Dashboard
          </button>
        </form>
      </div>
      
      <div className="auth-background">
        <div className="background-content">
          <h2>Personalized Career Guidance</h2>
          <p>The more we know about you, the better we can match you with career paths that align with your skills, interests, and goals.</p>
          <div className="benefit-list">
            <div className="benefit-item">
              <span className="benefit-icon">🎯</span>
              <span>Better career recommendations</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🛣️</span>
              <span>Customized learning paths</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">📊</span>
              <span>Personalized skill development</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BasicInfo;