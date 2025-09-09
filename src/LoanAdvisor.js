import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Recommendations from './Recommendations';
import './LoanAdvisor.css';

function LoanAdvisor() {
  const [formData, setFormData] = useState({
    loanAmount: '',
    interestRate: '',
    loanTenure: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResults('');

    try {
      const response = await fetch('https://tax-chatbot-app.onrender.com/api/analyze-loan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData }),
      });

      if (!response.ok) {
        throw new Error('Failed to get an analysis from the AI server.');
      }
      
      const data = await response.json();
      setResults(data.plan);

    } catch (err) {
      setError('Sorry, something went wrong. Please check if the server is running and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container page-content">
      <Link to="/" className="back-button">← Back to Home</Link>
      <div className="advisor-header">
        <h2>AI Loan & Debt Advisor</h2>
        <p>Understand the true cost of a loan and get personalized advice.</p>
      </div>
      <form onSubmit={handleSubmit} className="advisor-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Loan Amount (in lakhs)</label>
            <input type="number" name="loanAmount" value={formData.loanAmount} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Annual Interest Rate (%)</label>
            <input type="number" step="0.01" name="interestRate" value={formData.interestRate} onChange={handleChange} required />
          </div>
          <div className="form-group full-width">
            <label>Loan Tenure (in years)</label>
            <input type="number" name="loanTenure" value={formData.loanTenure} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-group full-width">
          <label>Any specific questions or notes? (Optional)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="e.g., Is it better to take a 15-year loan instead of 20? Should I prepay my loan?"
          />
        </div>
        <button type="submit" className="advisor-button" disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Analyze My Loan'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {results && <Recommendations text={results} />}
    </div>
  );
}

export default LoanAdvisor;