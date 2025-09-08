import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Recommendations from './Recommendations';
import './InsuranceCalculator.css';

function InsuranceCalculator() {
  const [formData, setFormData] = useState({
    age: '',
    annualIncome: '',
    dependents: '',
    liabilities: '',
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
      const response = await fetch('https://tax-chatbot-app.onrender.com/api/calculate-insurance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData }),
      });

      if (!response.ok) {
        throw new Error('Failed to get a plan from the AI server.');
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
      <div className="calculator-header">
        <h2>AI Insurance Advisor</h2>
        <p>Find out how much coverage you truly need to protect your family.</p>
      </div>
      <form onSubmit={handleSubmit} className="calculator-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Your Current Age</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Number of Financial Dependents</label>
            <input type="number" name="dependents" value={formData.dependents} onChange={handleChange} placeholder="e.g., spouse, children" required />
          </div>
          <div className="form-group">
            <label>Your Annual Income (in lakhs)</label>
            <input type="number" name="annualIncome" value={formData.annualIncome} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Total Outstanding Loans (in lakhs)</label>
            <input type="number" name="liabilities" value={formData.liabilities} onChange={handleChange} placeholder="e.g., home loan" required />
          </div>
        </div>
        <div className="form-group full-width">
          <label>Any specific goals or notes? (Optional)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="e.g., My children's higher education, a specific health condition..."
          />
        </div>
        <button type="submit" className="calculator-button" disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Calculate My Coverage'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {results && <Recommendations text={results} />}
    </div>
  );
}

export default InsuranceCalculator;