import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';

import HomePage from './HomePage';
import TaxCalculator from './TaxCalculator';
import RetirementPlanner from './RetirementPlanner';
import InsuranceCalculator from './InsuranceCalculator'; // 1. Import the new component
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';

import './App.css';

// A special component to protect routes
function PrivateRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading-screen">Loading...</div>; // A simple loading message
  }

  return user ? children : <Navigate to="/login" />;
}


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/tax-calculator" element={<PrivateRoute><TaxCalculator /></PrivateRoute>} />
        <Route path="/retirement-planner" element={<PrivateRoute><RetirementPlanner /></PrivateRoute>} />
        {/* 2. Add the new protected route */}
        <Route path="/insurance-calculator" element={<PrivateRoute><InsuranceCalculator /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;