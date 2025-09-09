const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();

const whitelist = [
    "http://localhost:3000",
    "http://localhost:5500", 
    "https://tax-chatbot-app.vercel.app",
    "https://tax-chatbot-7nv6ylazg-samarth-tiwari-s-projects.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (whitelist.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
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
// --- All AI Prompts ---
const dataExtractionPrompt = `
You are an expert tax preparation assistant in India. Your task is to extract specific financial details from the user's text.
CRUCIAL: Your entire response MUST be only a valid JSON object enclosed in markdown \`\`\`json ... \`\`\` tags. Do not include any other text or explanations.
Extract: grossSalary, otherIncome, deduction80C, deduction80D, hraExemption, professionalTax.
If a value is not mentioned, set it to 0.`;

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
const retirementPlannerPrompt = `
You are an expert retirement planner for the Indian context. Your task is to generate a personalized, encouraging, and actionable retirement plan based on the user's data.

- The user's data will be provided as a JSON object containing their current age, desired retirement age, annual salary (in lakhs), current savings (in lakhs), and optional notes.
- Assume an average annual return of 10% on investments and an inflation rate of 6%.
- Project the future value of their current savings.
- Calculate the estimated corpus they will need at retirement (a simple rule is 25 times their last annual salary).
- Calculate the monthly investment (SIP) required to reach that goal.
- **CRUCIAL REALISM CHECK:** If the calculated monthly SIP is more than 30% of their monthly income (salary / 12), explicitly state that this target might be challenging and suggest alternative strategies (e.g., revising goals, extending working years).
- Suggest a sample investment allocation (e.g., 70% Equity Mutual Funds, 20% Debt, 10% Gold) based on their age and any notes they provided about risk appetite.
- Frame the response in clear markdown format. Start with a main heading.
- CRUCIAL: Always include a detailed disclaimer at the end.
`;
const insuranceCalculatorPrompt = `
You are an expert financial advisor in India specializing in insurance. Your task is to generate a personalized insurance coverage recommendation.

- The user's data will be provided as a JSON object: { age, annualIncome (in lakhs), dependents, liabilities (in lakhs), notes }.
- **Term Life Insurance:** Calculate the ideal coverage. A standard rule is 15-20 times the annual income, plus any outstanding liabilities.
- **Health Insurance:** Recommend a family floater plan. Suggest a base coverage amount (e.g., ₹10-15 lakhs for a metro city) and explain the concept of a super top-up plan for higher coverage at a lower cost.
- **Structure:** Frame the response in clear markdown. Start with a main heading. Use bullet points for clarity.
- **Tone:** Be encouraging and emphasize that insurance is for protection, not investment.
- **Disclaimer:** Always include a strong disclaimer at the end.
`;
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
`;
const loanAdvisorPrompt = `
You are an expert financial advisor in India specializing in loans and debt. Your task is to provide a detailed analysis of a loan.

- The user's data will be provided as a JSON object: { loanAmount (in lakhs), interestRate (%), loanTenure (in years), notes }.
- **Calculate the EMI (Equated Monthly Instalment).** Use the formula: EMI = [P x R x (1+R)^N] / [(1+R)^N-1], where P is Principal Loan Amount, R is monthly interest rate (annual rate / 12 / 100), and N is number of months (tenure in years * 12).
- **Calculate the Total Interest Paid** and the **Total Amount Paid** (Principal + Interest).
- **Provide Actionable Advice:** Based on the user's notes, offer 1-2 clear tips. For example, if they ask about prepayment, explain how it works. If they ask about a shorter tenure, show the impact on EMI and total interest.
- **Structure:** Frame the response in clear markdown. Start with a main heading "### 🏦 Your Loan Analysis".
- **Disclaimer:** Always include a strong disclaimer.
`;


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
