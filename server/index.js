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

// --- All Existing AI Prompts ---
const dataExtractionPrompt = `You are an expert tax preparation assistant in India...`;
const recommendationPrompt = `You are a helpful and cautious financial assistant in India...`;
const retirementPlannerPrompt = `You are an expert retirement planner for the Indian context...`;
const insuranceCalculatorPrompt = `You are an expert financial advisor in India specializing in insurance...`;
const investmentRecommenderPrompt = `You are an expert financial advisor in India. Your task is to generate a personalized investment portfolio...`;

// --- NEW: AI Prompt for Loan Analysis ---
const loanAdvisorPrompt = `
You are an expert financial advisor in India specializing in loans and debt. Your task is to provide a detailed analysis of a loan.

- The user's data will be provided as a JSON object: { loanAmount (in lakhs), interestRate (%), loanTenure (in years), notes }.
- **Calculate the EMI (Equated Monthly Instalment).** Use the formula: EMI = [P x R x (1+R)^N] / [(1+R)^N-1], where P is Principal Loan Amount, R is monthly interest rate (annual rate / 12 / 100), and N is number of months (tenure in years * 12).
- **Calculate the Total Interest Paid** and the **Total Amount Paid** (Principal + Interest).
- **Provide Actionable Advice:** Based on the user's notes, offer 1-2 clear tips. For example, if they ask about prepayment, explain how it works. If they ask about a shorter tenure, show the impact on EMI and total interest.
- **Structure:** Frame the response in clear markdown. Start with a main heading "### 🏦 Your Loan Analysis".
- **Disclaimer:** Always include a strong disclaimer.

Example Input Data:
{
  "loanAmount": 50,
  "interestRate": 8.5,
  "loanTenure": 20
}

Example Output:
### 🏦 Your Loan Analysis

Based on a loan of **₹50 Lakhs** at an interest rate of **8.5%** for **20 years**, here is your detailed breakdown:

**1. Key Loan Metrics**
* **Equated Monthly Instalment (EMI):** Your estimated monthly payment will be **₹43,391**.
* **Total Interest Payable:** Over 20 years, you will pay approximately **₹54.14 Lakhs** in interest.
* **Total Amount Paid:** The total repayment (principal + interest) will be around **₹1.04 Crore**.

**2. Actionable Advice**
* **The Impact of Prepayment:** Even a small prepayment, like paying one extra EMI per year, could help you close the loan 3-4 years earlier and save several lakhs in interest.
* **Consider a Shorter Tenure:** If your budget allows for a higher EMI, reducing the tenure to 15 years would increase your EMI to approximately ₹50,000 but could save you over ₹15 Lakhs in total interest paid.

**Disclaimer:** This is an AI-generated estimate and not a formal loan offer. Actual EMI and interest figures may vary based on the lender's policies. Please consult with a loan specialist before making any financial decisions.
`;

// --- All API Endpoints ---
app.post('/api/extract', async (req, res) => { /* ... endpoint logic ... */ });
app.post('/api/recommend', async (req, res) => { /* ... endpoint logic ... */ });
app.post('/api/plan-retirement', async (req, res) => { /* ... endpoint logic ... */ });
app.post('/api/calculate-insurance', async (req, res) => { /* ... endpoint logic ... */ });
app.post('/api/recommend-investments', async (req, res) => { /* ... endpoint logic ... */ });

// --- NEW: API endpoint for the Loan Advisor ---
app.post('/api/analyze-loan', async (req, res) => {
  const { formData } = req.body;
  try {
    const result = await model.generateContent([loanAdvisorPrompt, JSON.stringify(formData)]);
    const plan = result.response.text();
    res.json({ plan });
  } catch (error) {
    console.error("Error in /api/analyze-loan:", error);
    res.status(500).json({ error: "Failed to generate loan analysis." });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});