const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();

// --- THIS IS THE FIX ---
// Added your live Vercel URL to the list of allowed origins
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "https://tax-chatbot-7nv6ylazg-samarth-tiwari-s-projects.vercel.app"
  ] 
}));
// --------------------

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('Server is alive and running!');
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

const dataExtractionPrompt = `
You are an expert tax preparation assistant in India. Your task is to extract specific financial details from the user's text and return them as a structured JSON object. Extract: grossSalary, otherIncome, deduction80C, deduction80D, hraExemption, professionalTax. Rules: If a value is not mentioned, set it to 0. The final output MUST be only a valid JSON object.`;

const recommendationPrompt = `
You are a helpful and cautious financial assistant in India. Your goal is to provide actionable tax-saving recommendations based on the user's financial data. Provide 2-3 clear, concise, and actionable recommendations in markdown format. Always include a disclaimer at the end: "**Disclaimer:** These are AI-generated suggestions and not professional financial advice. Please consult with a qualified financial advisor."`;

const retirementPlannerPrompt = `
You are an expert retirement planner for the Indian context. Your task is to generate a personalized, encouraging, and actionable retirement plan based on the user's data.
- The user's data will be provided as a JSON object containing their current age, desired retirement age, annual salary (in lakhs), current savings (in lakhs), and optional notes.
- Assume an average annual return of 10% on investments and an inflation rate of 6%.
- Project the future value of their current savings.
- Calculate the estimated corpus they will need at retirement (a simple rule is 25 times their last annual salary).
- Calculate the monthly investment (SIP) required to reach that goal.
- Suggest a sample investment allocation (e.g., 70% Equity Mutual Funds, 20% Debt, 10% Gold) based on their age and any notes they provided about risk appetite.
- Frame the response in clear markdown format. Start with a main heading.
- CRUCIAL: Always include a disclaimer at the end.
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

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
