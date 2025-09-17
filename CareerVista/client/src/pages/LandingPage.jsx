import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

const LandingPage = () => {
  return (
    <div className="landing">
      {/* Navigation */}
      <header className="navbar">
        <div className="nav-container">
          <h1 className="logo">
            <span className="logo-icon">🧠</span>CareerVista
          </h1>
          <nav className="nav-menu">
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/features" className="nav-link">Features</Link>
            <Link to="/pricing" className="nav-link">Pricing</Link>
            <Link to="/login" className="btn btn-outline">Sign In</Link>
            <Link to="/signup" className="btn btn-primary">Start My Journey</Link>
          </nav>
          <button className="mobile-menu-btn">☰</button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero">
        <div className="hero-container">
          <div className="hero-text">
            <div className="badge">
              <span className="badge-text">Neuroscience-Inspired AI</span>
            </div>
            <h1>
              Architect Your Future with <span className="highlight">Personalized Career Guidance</span>
            </h1>
            <p>
              DishaGen+ goes beyond generic advice to craft your unique destiny. Our neuroscience-inspired AI maps your neural blueprint to create hyper-personalized career pathways that align with your strengths and aspirations.
            </p>
            <div className="cta-buttons">
              <Link to="/signup" className="btn btn-primary btn-large">Start My Journey</Link>
              <Link to="/assessments" className="btn btn-secondary btn-large">Take Free Assessment</Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">50,000+</span>
                <span className="stat-label">Career Paths Mapped</span>
              </div>
              <div className="stat">
                <span className="stat-number">97%</span>
                <span className="stat-label">User Satisfaction</span>
              </div>
              <div className="stat">
                <span className="stat-number">300+</span>
                <span className="stat-label">Career Fields</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="floating-cards">
              <div className="card card-1">
                <div className="card-header">
                  <span className="card-icon">💻</span>
                  <h3>Data Scientist</h3>
                </div>
                <div className="card-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '85%'}}></div>
                  </div>
                  <span>85% Match</span>
                </div>
              </div>
              <div className="card card-2">
                <div className="card-header">
                  <span className="card-icon">🎨</span>
                  <h3>UX Designer</h3>
                </div>
                <div className="card-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '78%'}}></div>
                  </div>
                  <span>78% Match</span>
                </div>
              </div>
              <div className="card card-3">
                <div className="card-header">
                  <span className="card-icon">📊</span>
                  <h3>Business Analyst</h3>
                </div>
                <div className="card-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '92%'}}></div>
                  </div>
                  <span>92% Match</span>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <img src="/hero-visual.svg" alt="Career Path Visualization" />
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>How DishaGen+ Transforms Career Guidance</h2>
            <p>Our neuroscience-inspired approach creates personalized pathways to success</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🧬</div>
              <h3>Neural Blueprint Mapping</h3>
              <p>Discover your unique cognitive patterns and learning preferences through our gamified assessments.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>AI-Powered Matching</h3>
              <p>Our advanced algorithm matches your profile with ideal career paths using real-time market data.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛣️</div>
              <h3>Personalized Roadmaps</h3>
              <p>Receive tailored learning paths with resources that match your preferred learning style.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔮</div>
              <h3>What-If Scenarios</h3>
              <p>Test different career decisions and see potential outcomes before committing to a path.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Architect Your Future?</h2>
            <p>Join thousands of students who have discovered their ideal career path with DishaGen+</p>
            <Link to="/signup" className="btn btn-primary btn-large">Get Started Now</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3 className="logo">
                <span className="logo-icon">🧠</span>CareerVista
              </h3>
              <p>Neuroscience-inspired AI career guidance for India's youth</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#">Features</a>
                <a href="#">Pricing</a>
                <a href="#">Case Studies</a>
              </div>
              <div className="footer-column">
                <h4>Resources</h4>
                <a href="#">Blog</a>
                <a href="#">Career Guides</a>
                <a href="#">Webinars</a>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#">About Us</a>
                <a href="#">Contact</a>
                <a href="#">Privacy Policy</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2023 DishaGen+. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;