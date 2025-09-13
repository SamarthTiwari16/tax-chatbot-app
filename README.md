# Apex Finance

[![VERCEL LINK](https://img.shields.io/badge/VERCEL%20LINK-grey?style=for-the-badge&logo=vercel&logoColor=white&labelColor=555&color=007AFF)](https://tax-chatbot-app.vercel.app)

## What is the Project About? (The Big Picture)

This project is a sophisticated, multi-tool web application designed to simplify complex personal finance decisions for users in India. The core idea is to replace the confusion and intimidation of traditional financial forms and calculations with a smart, conversational, and user-friendly experience.

It's a "financial co-pilot" that helps users with four key areas: Taxes, Retirement, Insurance, and Loans. The application is secured with a complete user login system, ensuring all interactions are private and personalized.

## What Real-World Problem Does It Solve?

Financial planning is often a major source of stress. People struggle with questions like:

* "Am I paying too much in taxes?"
* "Am I saving enough for retirement?"
* "How much insurance do I actually need?"
* "What is the real cost of this loan?"

This application solves these problems by providing instant, AI-powered clarity. It automates complex calculations, explains financial concepts in simple terms, and offers personalized advice, empowering users to make better financial decisions with confidence.

## Detailed Breakdown of Features

We have successfully built a full-stack application with a central home page that routes to four distinct, fully functional AI-powered tools.

### 1. The AI Tax Calculator

* **How it Works:** Instead of a form, the user describes their financial situation in plain English (e.g., "My salary is 15 lakhs and I invested 1.5 lakhs in PPF").
* **AI Integration (Natural Language Understanding):** The app uses the Google Gemini API to read this sentence and intelligently extract the structured financial data (gross salary, 80C deductions, etc.).
* **Core Functionality:** It automatically calculates the user's income tax under both the Old and New Indian tax regimes.
* **Output:** It presents a clear, side-by-side comparison, highlights the regime that saves the most money, and shows the exact amount of savings. It also makes a second AI call to generate personalized tips on how the user could save more tax in the future.

### 2. The AI Retirement Planner

* **How it Works:** The user fills out a simple form with their current age, desired retirement age, annual salary, and existing savings.
* **AI Integration (Generative AI):** The form data is sent to the Gemini API.
* **Core Functionality:** The AI generates a personalized retirement plan. It projects a target retirement corpus, calculates the future value of current savings, and determines the monthly investment (SIP) needed to reach the goal.
* **Output:** It provides a comprehensive plan that includes a sample investment portfolio (e.g., a mix of equity and debt funds) and a crucial "realism check" that warns the user if the required investment is a high percentage of their income.

### 3. The AI Insurance Advisor

* **How it Works:** A form-based tool where the user inputs their age, income, number of dependents, and outstanding loans.
* **AI Integration (Generative AI):** The data is sent to a specialized AI prompt.
* **Core Functionality:** The AI calculates the optimal amount of Term Life Insurance needed to protect the user's family and recommends a suitable Health Insurance plan.
* **Output:** It presents a clear recommendation for both types of insurance, explaining the rationale behind the suggested coverage amounts in simple terms.

### 4. The AI Loan & Debt Advisor

* **How it Works:** The user enters the details of a loan they are considering: amount, interest rate, and tenure.
* **AI Integration (Generative AI):** The loan details are sent to the Gemini API.
* **Core Functionality:** The AI calculates the EMI (Equated Monthly Instalment), the total interest that will be paid over the loan's lifetime, and the total repayment amount.
* **Output:** It provides a detailed loan analysis and offers actionable advice, such as explaining the financial impact of prepaying the loan or choosing a shorter tenure.

### 5. Secure User Authentication

* **Functionality:** A complete user registration (sign-up) and login system to protect user privacy.
* **Technology:** Integrated with Google Firebase Authentication, an industry-standard, secure service. All the financial tools are protected routes, meaning they can only be accessed by logged-in users.

## The Technology We Used (The Tech Stack)

* **Frontend:** A dynamic and responsive user interface built with React.js. We used `react-router-dom` for multi-page navigation.
* **Backend:** A secure server built with Node.js and Express.js. Its main job is to handle API requests from the frontend and securely manage the secret Google Gemini API key.
* **AI Engine:** The Google Gemini API (specifically the `gemini-1.5-flash` model) is the "brain" behind all the tools, performing both language understanding and content generation.
* **Authentication:** Google Firebase Authentication handles all user sign-up, login, and session management.
* **Deployment:** The project is deployed using a professional, dual-platform strategy:
    * The React frontend is live on Vercel.
    * The Node.js backend is live on Render.
* **Version Control & CI/CD:** The entire codebase is managed on GitHub. Pushing code to the main branch automatically triggers new deployments on both Vercel and Render, creating a seamless Continuous Integration/Continuous Deployment (CI/CD) pipeline.
* **Uptime Monitoring:** We've set up a cron job to ping the backend server every 14 minutes, which prevents it from "sleeping" due to inactivity on Render's free tier, ensuring the app is always responsive.

## Getting Started (Local Setup)

To run this project on your local machine, follow these steps:

### Prerequisites

* Node.js (v18 or higher recommended)
* npm (usually comes with Node.js)
* Git
* A Google Gemini API Key
* A Firebase Project with Authentication enabled (for `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`)

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/SamarthTiwari16/tax-chatbot-app.git](https://github.com/SamarthTiwari16/tax-chatbot-app.git)
    cd tax-chatbot-app
    ```
2.  **Navigate to the backend directory:**
    ```bash
    cd server
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Create a `.env` file:** In the `server` directory, create a file named `.env` and add your Gemini API key:
    ```
    GEMINI_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY
    ```
5.  **Start the backend server:**
    ```bash
    node index.js
    ```
    The server should start on `http://localhost:5001`.

### Frontend Setup

1.  **Navigate back to the project root and then into the frontend (React) directory:**
    ```bash
    cd ..
    # Assuming your React app is in the root or a 'client' folder. Adjust if necessary.
    # If your React app is in the root, stay there.
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Update Firebase Configuration:** Open `src/firebase.js` and replace the placeholder values in `firebaseConfig` with your actual Firebase project details.
    ```javascript
    const firebaseConfig = {
      apiKey: "YOUR_FIREBASE_API_KEY",
      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT_ID.appspot.com",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };
    ```
4.  **Start the frontend development server:**
    ```bash
    npm start
    ```
    The frontend should open in your browser at `http://localhost:3000`.

## Live Deployment

Experience the AI-Powered Financial Suite live:

* **Frontend (Vercel):** [https://tax-chatbot-app.vercel.app](https://tax-chatbot-app.vercel.app)
* **Backend (Render):** [https://tax-chatbot-app.onrender.com](https://tax-chatbot-app.onrender.com) (This is the API endpoint, not a browsable website)

## Author

* **Samarth Tiwari**
    * GitHub: [https://github.com/SamarthTiwari16](https://github.com/SamarthTiwari16)
    * Email - [samarthtiwarij16@gmail.com](samarthtiwarij16@gmail.com)
    * Project link - [https://tax-chatbot-app.vercel.app](https://tax-chatbot-app.vercel.app)
