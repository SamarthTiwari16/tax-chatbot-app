import React, { useState } from 'react';
import Recommendations from './Recommendations';
import './RetirementPlanner.css';
import { Link } from 'react-router-dom';

function RetirementPlanner() {
  const [formData, setFormData] = useState({
    age: '',
    retireAge: '',
    salary: '',
    savings: '',
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
      const response = await fetch('https://tax-chatbot-app.onrender.com/api/plan-retirement', {
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
      <div className="planner-header">
        <h2>AI Retirement Planner</h2>
        <p>Let's plan your journey to financial freedom.</p>
      </div>
      <form onSubmit={handleSubmit} className="planner-form">
        <div className="form-grid">
          <div className="form-group">
            <label>What is your current age?</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>What is your desired retirement age?</label>
            <input type="number" name="retireAge" value={formData.retireAge} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>What is your current annual salary (in lakhs)?</label>
            <input type="number" name="salary" value={formData.salary} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>What are your existing retirement savings (in lakhs)?</label>
            <input type="number" name="savings" value={formData.savings} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-group full-width">
          <label>Anything else to consider? (Optional)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="e.g., I have a high-risk appetite, I plan to have kids, I have a home loan..."
          />
        </div>
        <button type="submit" className="planner-button" disabled={isLoading}>
          {isLoading ? 'Generating Plan...' : 'Generate My Retirement Plan'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {results && <Recommendations text={results} />}
    </div>
  );
}

export default RetirementPlanner;