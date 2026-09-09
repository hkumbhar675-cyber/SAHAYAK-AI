// SAHAYAK AI – Financial Calculator Service
// Computes Loan Amount, Subsidy, Effective Borrower Liability, Interest, Tenure, and Monthly EMI.

function calculateAssistance({
  loanAmount = 100000,
  subsidyPct = 0,
  annualInterestRate = 8.5,
  tenureMonths = 36
}) {
  const principal = Math.max(1000, Number(loanAmount));
  const subPct = Math.max(0, Math.min(100, Number(subsidyPct)));
  const rate = Math.max(0, Number(annualInterestRate));
  const tenure = Math.max(1, Math.min(360, Number(tenureMonths)));

  // 1. Subsidy Amount
  const subsidyAmount = Math.round((principal * subPct) / 100);

  // 2. Effective Borrowing Amount (Net citizen loan after government subsidy)
  const effectiveBorrowerAmount = Math.max(0, principal - subsidyAmount);

  // 3. Monthly EMI Calculation
  let monthlyEmi = 0;
  let totalInterest = 0;

  if (effectiveBorrowerAmount === 0) {
    monthlyEmi = 0;
    totalInterest = 0;
  } else if (rate === 0) {
    monthlyEmi = Math.round((effectiveBorrowerAmount / tenure) * 100) / 100;
    totalInterest = 0;
  } else {
    const monthlyRate = rate / (12 * 100);
    const emiFactor = Math.pow(1 + monthlyRate, tenure);
    monthlyEmi = Math.round(
      ((effectiveBorrowerAmount * monthlyRate * emiFactor) / (emiFactor - 1)) * 100
    ) / 100;
    totalInterest = Math.round(monthlyEmi * tenure - effectiveBorrowerAmount);
  }

  const totalRepayment = Math.round(effectiveBorrowerAmount + totalInterest);

  // Interest saved because subsidy was deducted from principal
  let interestWithoutSubsidy = 0;
  if (rate > 0) {
    const monthlyRate = rate / (12 * 100);
    const factor = Math.pow(1 + monthlyRate, tenure);
    const emiWithoutSub = (principal * monthlyRate * factor) / (factor - 1);
    interestWithoutSubsidy = emiWithoutSub * tenure - principal;
  }
  const interestSaved = Math.max(0, Math.round(interestWithoutSubsidy - totalInterest));
  const totalSavings = subsidyAmount + interestSaved;

  return {
    loan_amount: principal,
    subsidy_percentage: subPct,
    subsidy_amount: subsidyAmount,
    effective_amount: effectiveBorrowerAmount,
    annual_interest_rate: rate,
    tenure_months: tenure,
    monthly_emi: monthlyEmi,
    total_interest: Math.max(0, totalInterest),
    total_repayment: totalRepayment,
    total_savings: totalSavings
  };
}

module.exports = {
  calculateAssistance
};
