import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Keep specific HomePage styles

function HomePage() {
  return (
    <div className="app-container home-page-layout"> {/* Added app-container here */}
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
        <div className="tool-card coming-soon">
          <h3>💡 More Tools Coming Soon...</h3>
          <p>Check back later for more AI-powered financial tools.</p>
        </div>
      </div>
       <footer className="app-footer">
        <p>© {new Date().getFullYear()} Samarth Tiwari. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;