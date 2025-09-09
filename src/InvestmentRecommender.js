import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Recommendations from './Recommendations';
import './InvestmentRecommender.css';

function InvestmentRecommender() {
  const [formData, setFormData] = useState({
    amount: '',
    duration: '',
    risk: 'moderate',
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
      // THIS IS THE CORRECTED PART:
      // It now makes a real request to your live server.
      const response = await fetch('https://tax-chatbot-app.onrender.com/api/recommend-investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData }),
      });

      if (!response.ok) {
        throw new Error('Failed to get a recommendation from the AI server.');
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
      <div className="recommender-header">
        <h2>AI Investment Recommender</h2>
        <p>Get a personalized investment portfolio based on your goals.</p>
      </div>
      <form onSubmit={handleSubmit} className="recommender-form">
        <div className="form-grid">
          <div className="form-group">
            <label>How much do you want to invest (in lakhs)?</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Investment duration (in years)?</label>
            <input type="number" name="duration" value={formData.duration} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-group full-width">
            <label>What is your risk tolerance?</label>
            <div className="radio-group">
                <label>
                    <input type="radio" name="risk" value="low" checked={formData.risk === 'low'} onChange={handleChange} />
                    Low (Capital preservation is most important)
                </label>
                <label>
                    <input type="radio" name="risk" value="moderate" checked={formData.risk === 'moderate'} onChange={handleChange} />
                    Moderate (Balanced growth and safety)
                </label>
                <label>
                    <input type="radio" name="risk" value="high" checked={formData.risk === 'high'} onChange={handleChange} />
                    High (Aggressive growth is the main goal)
                </label>
            </div>
        </div>
        <div className="form-group full-width">
          <label>Any specific goals or notes? (Optional)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="e.g., Saving for a house down payment, I prefer investing in Indian stocks..."
          />
        </div>
        <button type="submit" className="recommender-button" disabled={isLoading}>
          {isLoading ? 'Building Portfolio...' : 'Recommend Investments'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {results && <Recommendations text={results} />}
    </div>
  );
}

export default InvestmentRecommender;