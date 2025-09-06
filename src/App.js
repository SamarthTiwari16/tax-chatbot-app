import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import TaxCalculator from './TaxCalculator';
import RetirementPlanner from './RetirementPlanner';
import './App.css'; // Keep the main CSS import

function App() {
  return (
    <Router>
      {/* The Routes directly define what's rendered, no extra container here */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tax-calculator" element={<TaxCalculator />} />
        <Route path="/retirement-planner" element={<RetirementPlanner />} />
      </Routes>
    </Router>
  );
}

export default App;