import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import TaxCalculator from './TaxCalculator';
import RetirementPlanner from './RetirementPlanner';
import './App.css'; // Keep the main CSS import

function App() {
<<<<<<< HEAD
  return (
    <Router>
      {/* The Routes directly define what's rendered, no extra container here */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tax-calculator" element={<TaxCalculator />} />
        <Route path="/retirement-planner" element={<RetirementPlanner />} />
      </Routes>
    </Router>
=======
  const [inputText, setInputText] = useState('');
  const [regimeSummaries, setRegimeSummaries] = useState(null); 
  const [comparison, setComparison] = useState(null);
  const [recommendations, setRecommendations] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { ref: resultsRef, inView: resultsAreVisible } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (regimeSummaries) {
        try {
          const userData = regimeSummaries.oldRegime;
          const response = await fetch('https://tax-chatbot-app.onrender.com/api/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userData }),
          });
          const data = await response.json();
          setRecommendations(data.recommendations);
        } catch (err) {
          console.error("Failed to fetch recommendations:", err);
        }
      }
    };

    fetchRecommendations();
  }, [regimeSummaries]);

  const handleProcessText = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setError('');
    setRegimeSummaries(null);
    setComparison(null);
    setRecommendations('');

    try {
      const response = await fetch('https://tax-chatbot-app.onrender.com/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) throw new Error('Failed to get data from AI server.');
      
      const userData = await response.json();
      const newRegimeSummary = calculateTax(userData, 'new');
      const oldRegimeSummary = calculateTax(userData, 'old');

      setRegimeSummaries({ newRegime: newRegimeSummary, oldRegime: oldRegimeSummary });

      const isNewRegimeBetter = newRegimeSummary.totalTaxPayable <= oldRegimeSummary.totalTaxPayable;
      const savings = Math.abs(newRegimeSummary.totalTaxPayable - oldRegimeSummary.totalTaxPayable);
      setComparison({ best: isNewRegimeBetter ? 'new' : 'old', savings: savings });

    } catch (err) {
      setError('Sorry, something went wrong. Please check if the server is running and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setInputText('');
    setRegimeSummaries(null);
    setComparison(null);
    setRecommendations('');
    setError('');
  }

  return (
    <div className="landing-container">
      <div className="landing-header">
        <h1 className="landing-title">AI Tax Preparation Assistant </h1>
        <p className="landing-subtitle">Describe your finances. Get your tax summary & advice.</p>
      </div>
      <p className="landing-description">
        Simply describe your annual income and major deductions in the box below. For example: "My salary is 10 lakhs and I invested 1 lakh in PPF."
      </p>
      <textarea
        className="ai-input-box"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="e.g., My salary is 15 lakhs per year, I paid 50k for health insurance, and my 80C investment is maxed out at 1.5 lakhs."
        disabled={isLoading}
      />
      <div className="ai-buttons">
        <button onClick={handleProcessText} disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Calculate & Advise'}
        </button>
        <button onClick={handleReset} className="reset-button-ai">Reset</button>
      </div>
      
      {error && <p className="error-message">{error}</p>}

      {regimeSummaries && comparison && (
        <div ref={resultsRef} className={`results-area ${resultsAreVisible ? 'animate-fade-in' : ''}`}>
          <div className="savings-info">
            <h2>Comparison Result</h2>
            <p>
              The <strong>{comparison.best === 'new' ? 'New' : 'Old'} Regime</strong> is the better option for you.
              You could save approximately <strong>₹{comparison.savings.toLocaleString('en-IN')}</strong>.
            </p>
          </div>
          <div className="summary-comparison">
            <Summary data={regimeSummaries.newRegime} isBest={comparison.best === 'new'} />
            <Summary data={regimeSummaries.oldRegime} isBest={comparison.best === 'old'} />
          </div>
          <Recommendations text={recommendations} />
        </div>
      )}

      {/* --- Copyright Footer --- */}
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Samarth Tiwari. All Rights Reserved.</p>
      </footer>
      {/* ----------------------- */}

    </div>
>>>>>>> 33309a7c390b82a770675d2b3b0623daf22cb4a8
  );
}

export default App;
