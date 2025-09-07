const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();

// --- THIS IS THE PERMANENT FIX ---
// Using your final, official Vercel URL as the allowed origin
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "https://tax-chatbot-app.vercel.app"
  ] 
}));
// --------------------------------

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
- Assume an average annual annualised return of 10% on investments and an inflation rate of 6%.
- Project the future value of their current savings.
- Calculate the estimated corpus they will need at retirement. A reasonable target is to aim for a corpus that can generate an inflation-adjusted income equivalent to 25 times their final annual salary.
- Calculate the monthly investment (SIP) required to reach that goal.
- **CRUCIAL REALISM CHECK:** If the calculated monthly SIP is more than 30% of their monthly income (salary / 12), explicitly state that this target SIP might be challenging given their current income. Suggest that they might need to consider:
    a) Revising their retirement corpus expectations.
    b) Extending their working years beyond the desired retirement age.
    c) Significantly increasing their income or savings rate.
- Suggest a sample investment allocation (e.g., 70% Equity Mutual Funds, 20% Debt, 10% Gold) based on their age and any notes they provided about risk appetite.
- Frame the response in clear markdown format. Start with a main heading.
- CRUCIAL: Always include a detailed disclaimer at the end.

Example Input Data:
{
  "age": 30,
  "retireAge": 60,
  "salary": 20,
  "savings": 10,
  "notes": "I have a moderate risk appetite."
}

Example Output Structure:
### 📈 Your Personalized Retirement Plan

Hello! Based on the information you provided, here is a simple projection for your retirement journey.

**1. Your Retirement Goal**
To maintain your current lifestyle, you'll need an estimated corpus of **₹X Crore** at age YY.

**2. Where You Are Today**
Your current savings of **₹Z lakhs**, if left to grow at 10% annually, could be worth approximately **₹A Crore** by the time you retire. This is a fantastic start!

**3. The Path Forward**
To bridge the remaining gap, you would need to start a monthly investment (SIP) of approximately **₹B,000**.
*(If applicable: Please note that a monthly SIP of ₹B,000 represents XX% of your current monthly income, which might be a challenging target. You may need to consider revising your corpus expectations, extending your working years, or finding ways to significantly increase your savings rate.)*

**4. Sample Investment Strategy**
Given your age and moderate risk appetite, a balanced allocation could be:
* **70% in Equity Mutual Funds (Index Funds)** for long-term growth.
* **20% in Debt Instruments (PPF, Debt Funds)** for stability.
* **10% in Gold/International Equity** for diversification.

**5. Actionable Steps:**
1. Start Investing Immediately...
2. Diversify Your Investments...
3. Review and Adjust...
4. Increase Savings...
5. Tax Planning...

**Disclaimer:** This is a simplified, AI-generated projection based on the information provided and certain assumptions. Market returns are not guaranteed, and inflation can fluctuate. It does not account for specific tax situations, future income changes, or major life events. Please consult with a qualified financial advisor to create a detailed and personalized financial plan tailored to your specific circumstances and risk tolerance. This information should not be considered as a substitute for professional financial advice.
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