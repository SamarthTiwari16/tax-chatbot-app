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

// --- All AI Prompts ---
const dataExtractionPrompt = `
You are an expert tax preparation assistant in India. Your task is to extract specific financial details from the user's text.
CRUCIAL: Your entire response MUST be only a valid JSON object enclosed in markdown ```json ... ``` tags. Do not include any other text or explanations.
Extract: grossSalary, otherIncome, deduction80C, deduction80D, hraExemption, professionalTax.
If a value is not mentioned, set it to 0.`;

const recommendationPrompt = `You are a helpful and cautious financial assistant in India...`; // Kept short for brevity
const retirementPlannerPrompt = `You are an expert retirement planner for the Indian context...`; // Kept short for brevity
const insuranceCalculatorPrompt = `You are an expert financial advisor in India specializing in insurance...`; // Kept short for brevity
const investmentRecommenderPrompt = `You are an expert financial advisor in India. Your task is to generate a personalized investment portfolio...`; // Kept short for brevity
const loanAdvisorPrompt = `You are an expert financial advisor in India specializing in loans and debt...`; // Kept short for brevity


// --- All API Endpoints ---
app.post('/api/extract', async (req, res) => {
  const { text } = req.body;
  try {
    const result = await model.generateContent([dataExtractionPrompt, text]);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch || !jsonMatch[1]) {
      throw new Error("AI did not return a valid JSON block.");
    }
    const jsonString = jsonMatch[1];
    const jsonResponse = JSON.parse(jsonString);
    res.json(jsonResponse);
  } catch (error) {
    console.error("Error in /api/extract:", error, "Raw Response:", responseText);
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
