// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "./auth.css"; // Fixed import path

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    
    if (!formData.termsAccepted) {
      setError("You must agree to the Terms of Service and Privacy Policy");
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await setDoc(doc(db, "users", userCredential.user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        createdAt: new Date(),
      });

      navigate("/basic-info");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user is new
      const isNewUser = result._tokenResponse.isNewUser;
      
      if (isNewUser) {
        await setDoc(doc(db, "users", result.user.uid), {
          fullName: result.user.displayName,
          email: result.user.email,
          createdAt: new Date(),
        });
        navigate("/basic-info");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Google signup error:", err);
      setError("Failed to sign up with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo">
            <span className="logo-icon">🧠</span>
            <span className="logo-text">CareerVista</span>
          </div>
          <h2 className="auth-title">Start your career journey</h2>
          <p className="auth-subtitle">Create an account to discover your perfect career path</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="signup-password">Password</label>
            <div className="password-wrapper">
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </label>
          </div>

          <button 
            type="submit" 
            className="btn-primary full-width"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Begin My Journey"}
          </button>
        </form>

        <div className="divider">
          <span>Or sign up with</span>
        </div>

        <button 
          className="btn-google full-width"
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          type="button"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M16.5 9.20455C16.5 8.56636 16.4455 7.95273 16.3455 7.36364H9V10.845H13.2955C13.1155 11.97 12.495 12.9232 11.5418 13.5614V15.3191H14.0682C15.585 13.8932 16.5 11.8136 16.5 9.20455Z" fill="#4285F4"/>
            <path d="M9 17C11.19 17 13.0455 16.2836 14.0682 15.3191L11.5418 13.5614C10.8368 14.0414 9.93682 14.3386 9 14.3386C6.91364 14.3386 5.15455 12.9568 4.51364 11.07H1.89545V12.8882C2.92273 14.9318 4.78182 16.5 9 16.5Z" fill="#34A853"/>
            <path d="M4.51364 11.07C4.31364 10.49 4.20455 9.86591 4.20455 9.22727C4.20455 8.58864 4.31364 7.96455 4.51364 7.38455V5.56636H1.89545C1.23682 6.87727 0.863636 8.36091 0.863636 9.22727C0.863636 10.0936 1.23682 11.5773 1.89545 12.8882L4.51364 11.07Z" fill="#FBBC05"/>
            <path d="M9 4.11364C10.3318 4.11364 11.5136 4.53409 12.45 5.36364L14.1136 3.7C12.9227 2.60909 11.1864 2 9 2C4.78182 2 2.92273 4.52273 1.89545 5.56636L4.51364 7.38455C5.15455 5.49773 6.91364 4.11364 9 4.11364Z" fill="#EA4335"/>
          </svg>
          Sign up with Google
        </button>

        <div className="auth-footer">
          <p>Already have an account? <a href="/login">Sign in</a></p>
        </div>
      </div>
      
      <div className="auth-background">
        <div className="background-content">
          <h2>Discover Your Perfect Career Path</h2>
          <p>Take AI-powered assessments to understand your strengths, explore career options, and create a personalized roadmap to success.</p>
          <div className="benefit-list">
            <div className="benefit-item">
              <span className="benefit-icon">✅</span>
              <span>Neuroscience-inspired career matching</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">✅</span>
              <span>Personalized learning roadmaps</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">✅</span>
              <span>Skill gap analysis and development</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">✅</span>
              <span>Real-time market insights</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;