const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Only load dotenv in a non-production environment
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
} // <<< THE FIX IS HERE: Added the missing closing brace

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "https://tax-chatbot-app.vercel.app/"] 
}));
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

const dataExtractionPrompt = `
You are an expert tax preparation assistant in India. Your task is to extract specific financial details from the user's text and return them as a structured JSON object. Extract: grossSalary, otherIncome, deduction80C, deduction80D, hraExemption, professionalTax. Rules: If a value is not mentioned, set it to 0. The final output MUST be only a valid JSON object.`;

const recommendationPrompt = `
You are a helpful and cautious financial assistant in India. Your goal is to provide actionable tax-saving recommendations based on the user's financial data.
- The user's data will be provided as a JSON object.
- Analyze the data, particularly their income and existing deductions under the Old Tax Regime.
- Identify areas where they could save more tax.
- Provide 2-3 clear, concise, and actionable recommendations.
- Frame your response in markdown format for easy display. Start with a main heading like "### 💡 AI-Powered Recommendations".
- CRUCIAL: Always include a disclaimer at the end: "**Disclaimer:** These are AI-generated suggestions and not professional financial advice. Please consult with a qualified financial advisor."
`;

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

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
