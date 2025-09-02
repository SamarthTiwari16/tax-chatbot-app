const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

// --- AI Prompt for Data Extraction (No Changes Here) ---
const dataExtractionPrompt = `
You are an expert tax preparation assistant in India. Your task is to extract specific financial details from the user's text and return them as a structured JSON object. Extract: grossSalary, otherIncome, deduction80C, deduction80D, hraExemption, professionalTax. Rules: If a value is not mentioned, set it to 0. The final output MUST be only a valid JSON object.`;

// --- NEW: AI Prompt for Generating Recommendations ---
const recommendationPrompt = `
You are a helpful and cautious financial assistant in India. Your goal is to provide actionable tax-saving recommendations based on the user's financial data.

- The user's data will be provided as a JSON object.
- Analyze the data, particularly their income and existing deductions under the Old Tax Regime.
- Identify areas where they could save more tax.
- Provide 2-3 clear, concise, and actionable recommendations.
- Frame your response in markdown format for easy display. Start with a main heading like "### 💡 AI-Powered Recommendations".
- CRUCIAL: Always include a disclaimer at the end: "**Disclaimer:** These are AI-generated suggestions and not professional financial advice. Please consult with a qualified financial advisor."

Example Input Data:
{
  "grossSalary": 1200000,
  "deduction80C": 50000,
  "deduction80D": 0
}

Example Output:
### 💡 AI-Powered Recommendations

Here are a few suggestions based on your profile:

* **Maximize Section 80C:** You have invested ₹50,000 in 80C instruments, but the limit is ₹1,50,000. You could potentially invest another ₹1,00,000 in options like ELSS (Equity Linked Saving Scheme), PPF (Public Provident Fund), or a 5-Year FD to reduce your taxable income.

* **Consider Health Insurance (Section 80D):** You have not declared any health insurance premiums. Getting a policy for yourself and your family can provide financial security and also offer a tax deduction of up to ₹25,000 (or more for senior citizens).

**Disclaimer:** These are AI-generated suggestions and not professional financial advice. Please consult with a qualified financial advisor.
`;

// API endpoint for data extraction
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

// --- NEW: API endpoint for recommendations ---
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

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});