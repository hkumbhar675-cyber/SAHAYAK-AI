import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { calculateAssistance, getSchemes } from '../services/api';
import {
  Calculator as CalcIcon,
  Coins,
  Percent,
  Calendar,
  IndianRupee,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  TrendingDown
} from 'lucide-react';
import {
  Slider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from '@mui/material';

export default function Calculator() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [schemes, setSchemes] = useState([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState(location.state?.schemeId || '');

  // Inputs
  const [loanAmount, setLoanAmount] = useState(location.state?.loanAmount || 300000);
  const [subsidyPct, setSubsidyPct] = useState(location.state?.subsidyPct !== undefined ? location.state.subsidyPct : 35);
  const [annualInterestRate, setAnnualInterestRate] = useState(8.5);
  const [tenureMonths, setTenureMonths] = useState(36);

  // Computed Outputs
  const [calculation, setCalculation] = useState({
    loan_amount: 300000,
    subsidy_percentage: 35,
    subsidy_amount: 105000,
    effective_amount: 195000,
    annual_interest_rate: 8.5,
    tenure_months: 36,
    monthly_emi: 6150.85,
    total_interest: 26430,
    total_repayment: 221430,
    total_savings: 120500
  });

  useEffect(() => {
    loadSchemes();
  }, []);

  useEffect(() => {
    computeFinancials();
  }, [loanAmount, subsidyPct, annualInterestRate, tenureMonths]);

  const loadSchemes = async () => {
    try {
      const data = await getSchemes();
      if (data.schemes) {
        setSchemes(data.schemes);
        if (location.state?.schemeId) {
          const matched = data.schemes.find(s => s.id === location.state.schemeId);
          if (matched) {
            setSubsidyPct(matched.subsidy_pct);
            setAnnualInterestRate(matched.interest_rate);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching schemes:', err);
    }
  };

  const computeFinancials = async () => {
    try {
      const res = await calculateAssistance({
        loanAmount: Number(loanAmount),
        subsidyPct: Number(subsidyPct),
        annualInterestRate: Number(annualInterestRate),
        tenureMonths: Number(tenureMonths)
      });
      if (res.calculation) {
        setCalculation(res.calculation);
      }
    } catch (err) {
      console.error('Error calculating financials:', err);
    }
  };

  const handleSchemeSelect = (schemeId) => {
    setSelectedSchemeId(schemeId);
    const scheme = schemes.find(s => s.id === Number(schemeId));
    if (scheme) {
      setSubsidyPct(scheme.subsidy_pct);
      setAnnualInterestRate(scheme.interest_rate);
      if (scheme.max_benefit > 0) {
        setLoanAmount(scheme.max_benefit);
      }
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: 'calc(100vh - 70px)', padding: '2.5rem 1.5rem 4rem 1.5rem' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: '#0f5132',
            fontSize: '0.85rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            marginBottom: '0.65rem'
          }}>
            <CalcIcon size={18} />
            <span>FINANCIAL ASSISTANCE & EMI ENGINE</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.1rem, 4vw, 2.85rem)',
            fontWeight: 800,
            color: '#0f3d24',
            letterSpacing: '-0.03em',
            marginBottom: '0.75rem'
          }}>
            Citizen Financial Calculator
          </h1>

          <p style={{
            fontSize: '1rem',
            color: '#4b5563',
            maxWidth: '650px',
            margin: '0 auto',
            lineHeight: 1.5
          }}>
            Calculate the exact government subsidy, net borrowing liability, monthly EMI, and total interest savings for central and Maharashtra schemes.
          </p>
        </div>

        {/* 2-Column Calculator Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.15fr) minmax(320px, 1fr)',
          gap: '2.5rem',
          alignItems: 'start'
        }}>
          
          {/* Left Column: Sliders & Controls */}
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '24px',
            padding: '2rem',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
          }}>
            
            {/* Quick Scheme Pre-set selector */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem' }}>
                Load Pre-set Scheme Rules:
              </label>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedSchemeId}
                  onChange={(e) => handleSchemeSelect(e.target.value)}
                  displayEmpty
                  style={{ backgroundColor: '#ffffff', borderRadius: '10px' }}
                >
                  <MenuItem value="">Custom Parameters</MenuItem>
                  {schemes.map(s => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.name} ({s.subsidy_pct}% Subsidy • {s.interest_rate}% Interest)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Slider 1: Total Loan / Project Cost */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>
                  Total Project / Loan Amount
                </span>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f5132' }}>
                  ₹{Number(loanAmount).toLocaleString('en-IN')}
                </span>
              </div>
              <Slider
                value={Number(loanAmount)}
                min={20000}
                max={2500000}
                step={10000}
                onChange={(e, val) => setLoanAmount(val)}
                style={{ color: '#0f5132' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
                <span>₹20,000</span>
                <span>₹10,00,000</span>
                <span>₹25,00,000</span>
              </div>
            </div>

            {/* Slider 2: Government Subsidy % */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>
                  Government Subsidy Rate
                </span>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669' }}>
                  {subsidyPct}%
                </span>
              </div>
              <Slider
                value={Number(subsidyPct)}
                min={0}
                max={80}
                step={5}
                onChange={(e, val) => setSubsidyPct(val)}
                style={{ color: '#059669' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
                <span>0% (Mudra)</span>
                <span>35% (PMEGP)</span>
                <span>50% (Machinery)</span>
                <span>80% (Irrigation)</span>
              </div>
            </div>

            {/* Slider 3: Annual Interest Rate % */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>
                  Annual Interest Rate
                </span>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f5132' }}>
                  {annualInterestRate}%
                </span>
              </div>
              <Slider
                value={Number(annualInterestRate)}
                min={0}
                max={14}
                step={0.25}
                onChange={(e, val) => setAnnualInterestRate(val)}
                style={{ color: '#0f5132' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
                <span>0% (Full Subsidy)</span>
                <span>7.5% (Concessional)</span>
                <span>14% (Commercial)</span>
              </div>
            </div>

            {/* Slider 4: Tenure in Months */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>
                  Loan Tenure (Months)
                </span>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f5132' }}>
                  {tenureMonths} Months ({(tenureMonths / 12).toFixed(1)} yrs)
                </span>
              </div>
              <Slider
                value={Number(tenureMonths)}
                min={6}
                max={84}
                step={6}
                onChange={(e, val) => setTenureMonths(val)}
                style={{ color: '#0f5132' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
                <span>6 Months</span>
                <span>36 Months (3 Yrs)</span>
                <span>60 Months (5 Yrs)</span>
                <span>84 Months (7 Yrs)</span>
              </div>
            </div>

          </div>

          {/* Right Column: Output Breakdown Card */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '2px solid #bbf7d0',
            borderRadius: '24px',
            padding: '2.25rem',
            boxShadow: '0 12px 30px rgba(15, 81, 50, 0.08)'
          }}>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#059669',
              fontWeight: 700,
              fontSize: '0.85rem',
              marginBottom: '0.5rem'
            }}>
              <Sparkles size={16} />
              <span>ESTIMATED CITIZEN OUTCOME</span>
            </div>

            <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.75rem' }}>
              Monthly repayment liability after factoring in direct government capital subsidy.
            </div>

            {/* Big Monthly EMI Output */}
            <div style={{
              backgroundColor: '#f0fdf4',
              borderRadius: '16px',
              padding: '1.5rem',
              textAlign: 'center',
              border: '1px solid #bbf7d0',
              marginBottom: '1.75rem'
            }}>
              <div style={{ fontSize: '0.85rem', color: '#047857', fontWeight: 700, textTransform: 'uppercase' }}>
                Monthly Repayment (EMI)
              </div>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: '#0f5132', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '6px 0' }}>
                ₹{calculation.monthly_emi.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#4b5563' }}>
                Payable across {calculation.tenure_months} monthly installments
              </div>
            </div>

            {/* Financial Component Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem' }}>
                <span style={{ color: '#64748b' }}>Total Project / Loan:</span>
                <strong style={{ color: '#111827' }}>₹{calculation.loan_amount.toLocaleString('en-IN')}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem' }}>
                <span style={{ color: '#059669', fontWeight: 600 }}>Government Subsidy ({calculation.subsidy_percentage}%):</span>
                <strong style={{ color: '#059669' }}>- ₹{calculation.subsidy_amount.toLocaleString('en-IN')}</strong>
              </div>

              <div style={{ height: '1px', backgroundColor: '#e2e8f0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ fontWeight: 700, color: '#111827' }}>Effective Citizen Liability:</span>
                <strong style={{ color: '#0f5132', fontSize: '1.1rem' }}>₹{calculation.effective_amount.toLocaleString('en-IN')}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem' }}>
                <span style={{ color: '#64748b' }}>Total Interest Payable:</span>
                <strong style={{ color: '#111827' }}>₹{calculation.total_interest.toLocaleString('en-IN')}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem' }}>
                <span style={{ color: '#64748b' }}>Total Net Savings for Citizen:</span>
                <strong style={{ color: '#16a34a' }}>₹{calculation.total_savings.toLocaleString('en-IN')}</strong>
              </div>

            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => navigate('/partners', { state: { selectedSchemeId, requestedAmount: calculation.effective_amount } })}
                style={{
                  width: '100%',
                  backgroundColor: '#0f5132',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '0.85rem 1.5rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(15, 81, 50, 0.25)'
                }}
              >
                <span>Find Eligible Partner for this Loan</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => navigate('/schemes')}
                style={{
                  width: '100%',
                  backgroundColor: '#ffffff',
                  color: '#0f5132',
                  border: '1.5px solid #0f5132',
                  borderRadius: '9999px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Verify Scheme Eligibility
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
