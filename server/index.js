const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5500",
    "https://tax-chatbot-app.vercel.app",
    "https://tax-chatbot-7nv6ylazg-samarth-tiwari-s-projects.vercel.app"
  ]
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('Server is alive and running!');
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

// --- Existing AI Prompts (No Changes) ---
const dataExtractionPrompt = `You are an expert tax preparation assistant in India...`;
const recommendationPrompt = `You are a helpful and cautious financial assistant in India...`;
const retirementPlannerPrompt = `You are an expert retirement planner for the Indian context...`;
const insuranceCalculatorPrompt = `You are an expert financial advisor in India specializing in insurance...`;

// --- NEW: AI Prompt for Investment Recommendations ---
const investmentRecommenderPrompt = `
You are an expert financial advisor in India. Your task is to generate a personalized investment portfolio recommendation based on user data.

- The user's data will be provided as a JSON object: { amount (in lakhs), duration (in years), risk ('low', 'moderate', 'high'), notes }.
- Create a diversified portfolio allocation based on their risk tolerance and duration.
- For **Low Risk**, focus on capital preservation: suggest a mix of Fixed Deposits (FDs), Public Provident Fund (PPF), and Debt Mutual Funds.
- For **Moderate Risk**, suggest a balanced portfolio: a mix of Index Mutual Funds (Nifty 50), Blue-chip stocks, and some Debt Funds.
- For **High Risk**, suggest an aggressive portfolio: focus on Small-cap/Mid-cap Mutual Funds, growth stocks, and a small allocation to international equity.
- **Explain the "Why":** Briefly explain why you're recommending each asset class.
- **Structure:** Frame the response in clear markdown. Start with a main heading "### 💰 Your Personalized Investment Plan".
- **Disclaimer:** Always include a strong disclaimer.

Example Input Data:
{
  "amount": 10,
  "duration": 7,
  "risk": "moderate",
  "notes": "Saving for my child's education."
}

Example Output:
### 💰 Your Personalized Investment Plan

Based on your goal of investing **₹10 Lakhs** for **7 years** with a **moderate** risk tolerance, here is a sample diversified portfolio:

**1. Portfolio Allocation**
* **60% - Equity Mutual Funds (₹6 Lakhs):** Focus on Nifty 50 Index Funds. This will be the primary driver of growth over your 7-year horizon.
* **30% - Debt Instruments (₹3 Lakhs):** Consider high-quality Corporate Bond Funds or PPF. This provides stability and predictability to your portfolio.
* **10% - Gold (₹1 Lakh):** Investing in Gold ETFs or Sovereign Gold Bonds can act as a hedge against inflation and market volatility.

**2. Rationale**
This balanced approach aims to capture market growth through equities while the debt portion protects your capital from significant downturns, making it suitable for a medium-term goal like education funding.

**Disclaimer:** This is an AI-generated portfolio suggestion and not professional investment advice. All investments are subject to market risks. Please consult with a SEBI-registered investment advisor before making any investment decisions.
`;
// All your app.post endpoints remain here...
app.post('/api/extract', async (req, res) => {
  const { text } = req.body;
  try {
    const result = await model.generateContent([dataExtractionPrompt, text]);
    const responseText = result.response.text();
    const jsonResponse = JSON.parse(responseText.replace(/```json|```/g, '').trim());
    res.json(jsonResponse);
  } catch (error) {
    console.error("Error in /api/extract:", error);
    res.status(500).json({ error: "Failed to process text with AI." });
  }
});

app.post('/api/recommend', async (req, res) => {
  const { userData } = req.body;
    try {
      const result = await model.generateContent([recommendationPrompt, JSON.stringify(userData)]);
      const recommendations = result.response.text();
      res.json({ recommendations });
    } catch (error) {
      console.error("Error in /api/recommend:", error);
      res.status(500).json({ error: "Failed to generate recommendations." });
    }
});

app.post('/api/plan-retirement', async (req, res) => {
  const { formData } = req.body;
  try {
    const result = await model.generateContent([retirementPlannerPrompt, JSON.stringify(formData)]);
    const plan = result.response.text();
    res.json({ plan });
  } catch (error) {
    console.error("Error in /api/plan-retirement:", error);
    res.status(500).json({ error: "Failed to generate retirement plan." });
  }
});

app.post('/api/calculate-insurance', async (req, res) => {
  const { formData } = req.body;
  try {
    const result = await model.generateContent([insuranceCalculatorPrompt, JSON.stringify(formData)]);
    const plan = result.response.text();
    res.json({ plan });
  } catch (error) {
    console.error("Error in /api/calculate-insurance:", error);
    res.status(500).json({ error: "Failed to generate insurance plan." });
  }
});

app.post('/api/recommend-investments', async (req, res) => {
  const { formData } = req.body;
  try {
    const result = await model.generateContent([investmentRecommenderPrompt, JSON.stringify(formData)]);
    const plan = result.response.text();
    res.json({ plan });
  } catch (error) {
    console.error("Error in /api/recommend-investments:", error);
    res.status(500).json({ error: "Failed to generate investment plan." });
  }
});


const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});