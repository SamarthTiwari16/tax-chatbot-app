// Slabs for the New Regime (FY 2024-25)
const newRegimeSlabs = [
  { limit: 300000, rate: 0 }, { limit: 600000, rate: 0.05 },
  { limit: 900000, rate: 0.10 }, { limit: 1200000, rate: 0.15 },
  { limit: 1500000, rate: 0.20 }, { limit: Infinity, rate: 0.30 },
];

// --- NEW: Slabs for the Old Regime (FY 2024-25) ---
const oldRegimeSlabs = [
    { limit: 250000, rate: 0 }, { limit: 500000, rate: 0.05 },
    { limit: 1000000, rate: 0.20 }, { limit: Infinity, rate: 0.30 },
];


export const calculateTax = (data, regime) => {
  let { grossSalary, otherIncome = 0 } = data;
  const grossTotalIncome = grossSalary + (otherIncome || 0);
  let totalDeductions = 0;
  let taxableIncome = 0;
  let tax = 0;
  
  // --- LOGIC FOR OLD REGIME ---
  if (regime === 'old') {
    const { deduction80C = 0, deduction80D = 0, hraExemption = 0 } = data;
    const standardDeduction = 50000;
    
    // Cap 80C at its max limit
    const capped80C = Math.min(deduction80C, 150000);

    totalDeductions = standardDeduction + capped80C + deduction80D + hraExemption;
    taxableIncome = grossTotalIncome - totalDeductions;
    if (taxableIncome < 0) taxableIncome = 0;

    let remainingIncome = taxableIncome;
    let lastLimit = 0;
    for (const slab of oldRegimeSlabs) {
      if (remainingIncome <= 0) break;
      const taxableInSlab = Math.min(remainingIncome, slab.limit - lastLimit);
      tax += taxableInSlab * slab.rate;
      remainingIncome -= taxableInSlab;
      lastLimit = slab.limit;
    }
    
    // Rebate under 87A if taxable income <= 5 Lakhs for Old Regime
    if (taxableIncome <= 500000) {
      tax = 0;
    }

  // --- LOGIC FOR NEW REGIME ---
  } else { 
    const { professionalTax = 0 } = data;
    const standardDeduction = 50000;
    totalDeductions = standardDeduction + professionalTax;
    taxableIncome = grossTotalIncome - totalDeductions;
    if (taxableIncome < 0) taxableIncome = 0;

    let remainingIncome = taxableIncome;
    let lastLimit = 0;
    for (const slab of newRegimeSlabs) {
      if (remainingIncome <= 0) break;
      const taxableInSlab = Math.min(remainingIncome, slab.limit - lastLimit);
      tax += taxableInSlab * slab.rate;
      remainingIncome -= taxableInSlab;
      lastLimit = slab.limit;
    }

    // Rebate under 87A if taxable income <= 7 Lakhs for New Regime
    if (taxableIncome <= 700000) {
      tax = 0;
    }
  }

  const cess = tax * 0.04;
  const totalTaxPayable = Math.round(tax + cess);

  return {
    grossTotalIncome,
    totalDeductions,
    taxableIncome,
    taxBeforeCess: Math.round(tax),
    cess: Math.round(cess),
    totalTaxPayable,
    regime,
  };
};