import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from './firebase';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // Redirect to login page after logout
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  return (
    <div className="app-container home-page-layout">
      <button onClick={handleLogout} className="logout-button">Logout</button>

      <div className="home-header">
        <h1>Welcome to Your Financial AI</h1>
        <p>A suite of AI-powered tools to help you navigate your finances with confidence.</p>
      </div>
      <div className="tool-cards">
        <Link to="/tax-calculator" className="tool-card">
          <h3>🧮 AI Tax Calculator</h3>
          <p>Describe your finances in plain English and get an instant tax summary and savings advice.</p>
        </Link>
        <Link to="/retirement-planner" className="tool-card">
          <h3>📈 AI Retirement Planner</h3>
          <p>Answer a few questions to generate a personalized retirement plan and investment suggestions.</p>
        </Link>
        <Link to="/insurance-calculator" className="tool-card">
          <h3>🛡️ AI Insurance Advisor</h3>
          <p>Calculate the optimal life and health insurance coverage you need to protect your family.</p>
        </Link>
        {/* --- NEW: Card for the Investment Recommender --- */}
        <Link to="/investment-recommender" className="tool-card">
            <h3>💰 AI Investment Recommender</h3>
            <p>Get a personalized investment portfolio based on your financial goals and risk tolerance.</p>
        </Link>
        <Link to="/loan-advisor" className="tool-card">
            <h3>🏦 AI Loan & Debt Advisor</h3>
            <p>Analyze loan costs, understand your EMI, and get advice on debt management strategies.</p>
        </Link>
        <div className="tool-card coming-soon">
            <h3>💡 More Tools Coming Soon...</h3>
        </div>
      </div>
       <footer className="app-footer">
        <p>© {new Date().getFullYear()} Samarth Tiwari. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;