import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';

import HomePage from './HomePage';
import TaxCalculator from './TaxCalculator';
import RetirementPlanner from './RetirementPlanner';
import InsuranceCalculator from './InsuranceCalculator';
import InvestmentRecommender from './InvestmentRecommender'; // 1. Import
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import LoanAdvisor from './LoanAdvisor';

import './App.css';

// ... (PrivateRoute function remains the same)
function PrivateRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/tax-calculator" element={<PrivateRoute><TaxCalculator /></PrivateRoute>} />
        <Route path="/retirement-planner" element={<PrivateRoute><RetirementPlanner /></PrivateRoute>} />
        <Route path="/insurance-calculator" element={<PrivateRoute><InsuranceCalculator /></PrivateRoute>} />
        <Route path="/investment-recommender" element={<PrivateRoute><InvestmentRecommender /></PrivateRoute>} />
        <Route path="/loan-advisor" element={<PrivateRoute><LoanAdvisor /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;