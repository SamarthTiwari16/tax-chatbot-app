const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();

// --- THIS IS THE PERMANENT FIX ---
// This whitelist tells your server which websites are allowed to talk to it.
const whitelist = [
    "http://localhost:3000",
    "http://localhost:5500", 
    "https://tax-chatbot-app.vercel.app",
    "https://tax-chatbot-7nv6ylazg-samarth-tiwari-s-projects.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
};

app.use(cors(corsOptions));
// --------------------------------

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('Server is alive and running!');
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

const dataExtractionPrompt = `You are an expert tax preparation assistant in India...`;
const recommendationPrompt = `You are a helpful and cautious financial assistant in India...`;
const retirementPlannerPrompt = `You are an expert retirement planner for the Indian context...`;
const insuranceCalculatorPrompt = `You are an expert financial advisor in India specializing in insurance...`;

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


const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});