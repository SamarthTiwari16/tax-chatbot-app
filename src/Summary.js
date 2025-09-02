import React from 'react';
import './Summary.css';

// NEW: Accept 'isBest' as a prop
function Summary({ data, isBest }) { 
  if (!data) return null;

  const handleDownload = () => {
    const summaryText = `
TAX CALULATION SUMMARY (FY 2024-25)
--------------------------------------
Tax Regime: ${data.regime.charAt(0).toUpperCase() + data.regime.slice(1)} ${isBest ? '(Best Option)' : ''}

INCOME
+ Gross Total Income:   ₹ ${data.grossTotalIncome.toLocaleString('en-IN')}

DEDUCTIONS
- Total Deductions:     ₹ ${data.totalDeductions.toLocaleString('en-IN')}

TAXABLE INCOME
= Net Taxable Income:   ₹ ${data.taxableIncome.toLocaleString('en-IN')}

CALCULATION
  Income Tax:           ₹ ${data.taxBeforeCess.toLocaleString('en-IN')}
+ Health & Edu Cess (4%): ₹ ${data.cess.toLocaleString('en-IN')}
--------------------------------------
= TOTAL TAX PAYABLE:    ₹ ${data.totalTaxPayable.toLocaleString('en-IN')}
--------------------------------------

Disclaimer: This is an estimate. Please consult a professional.
    `;

    const blob = new Blob([summaryText.trim()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Tax_Summary_${data.regime}_Regime.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Add a class if this card is the best option
  const cardClasses = `summary-card ${isBest ? 'best-option' : ''}`;

  return (
    <div className={cardClasses}>
      {/* NEW: Conditionally render the "Best Option" badge */}
      {isBest && <div className="best-option-badge">⭐ Best Option</div>}
      
      <div className="summary-header">
        <h3>{data.regime === 'new' ? 'New Regime' : 'Old Regime'}</h3>
        <button onClick={handleDownload} className="download-button">Download .txt</button>
      </div>
      
      {data.totalTaxPayable === 0 && <p className="rebate">Congrats! Your total tax is zero due to the tax rebate.</p>}
      
      <div className="summary-item"><span>Gross Total Income:</span> <span>₹{data.grossTotalIncome.toLocaleString('en-IN')}</span></div>
      <div className="summary-item"><span>Total Deductions:</span> <span>- ₹{data.totalDeductions.toLocaleString('en-IN')}</span></div>
      <div className="summary-item total"><span>Net Taxable Income:</span> <span>₹{data.taxableIncome.toLocaleString('en-IN')}</span></div>
      <hr />
      <div className="summary-item"><span>Income Tax:</span> <span>₹{data.taxBeforeCess.toLocaleString('en-IN')}</span></div>
      <div className="summary-item"><span>Health & Edu Cess (4%):</span> <span>+ ₹{data.cess.toLocaleString('en-IN')}</span></div>
      <div className="summary-item total final-tax"><span>Total Tax Payable:</span> <span>₹{data.totalTaxPayable.toLocaleString('en-IN')}</span></div>
      <p className="disclaimer">This is an estimate. Please consult a professional.</p>
    </div>
  );
}

export default Summary;