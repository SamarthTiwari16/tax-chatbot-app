// Flow for the default New Tax Regime
export const newRegimeConversationFlow = {
  START: {
    text: "You've selected the New Tax Regime. Let's start. What is your total gross annual salary?",
    key: 'grossSalary',
    next: 'OTHER_INCOME',
  },
  OTHER_INCOME: {
    text: "Do you have any other income to declare, like interest from savings accounts? (Enter amount or 0)",
    key: 'otherIncome',
    next: 'PROFESSIONAL_TAX',
  },
  PROFESSIONAL_TAX: {
    text: "Did you pay any Professional Tax? (This is one of the few deductions allowed in the new regime. Enter amount or 0)",
    key: 'professionalTax',
  },
  END: {
    text: "Great! Calculating your tax summary based on the New Regime...",
  },
};

// Flow for the Old Tax Regime
export const oldRegimeConversationFlow = {
  START: {
    text: "You've selected the Old Tax Regime. Let's start. What is your total gross annual salary?",
    key: 'grossSalary',
    next: 'DEDUCTION_80C',
  },
  DEDUCTION_80C: {
    text: "What is your total investment under Section 80C? (e.g., PPF, ELSS, LIC premium). The maximum is ₹1,50,000.",
    key: 'deduction80C',
    next: 'DEDUCTION_80D',
  },
  DEDUCTION_80D: {
    text: "How much did you pay for health insurance premiums (Section 80D)?",
    key: 'deduction80D',
    next: 'HRA_EXEMPTION',
  },
  HRA_EXEMPTION: {
      text: "What is your total exempted House Rent Allowance (HRA)? If you're not sure, you can enter 0 for now.",
      key: 'hraExemption',
  },
  END: {
    text: "Perfect! Calculating your tax summary based on the Old Regime...",
  },
};

