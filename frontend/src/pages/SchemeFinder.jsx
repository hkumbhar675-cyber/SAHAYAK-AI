import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { checkEligibility, parseCitizenIntent, getSchemeById, submitApplication } from '../services/api';
import {
  Sparkles,
  Search,
  Mic,
  MicOff,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Calculator,
  MapPin,
  FileText,
  Building2,
  ShieldCheck,
  Send,
  Info,
  Check
} from 'lucide-react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  LinearProgress,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Snackbar,
  Alert
} from '@mui/material';

export default function SchemeFinder() {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { currentUser, updateUser } = useUser();

  // Natural query & voice state
  const [naturalQuery, setNaturalQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [parsingIntent, setParsingIntent] = useState(false);

  // Active Citizen Profile used for Deterministic Rule Engine
  const [profile, setProfile] = useState({
    age: currentUser?.age || 38,
    annual_income: currentUser?.annual_income || 220000,
    occupation: currentUser?.occupation || 'Farmer',
    district: currentUser?.district || 'Pune',
    state: currentUser?.state || 'Maharashtra',
    category: currentUser?.category || 'OBC',
    gender: currentUser?.gender || 'Male',
    landholding_acres: currentUser?.landholding_acres || 3.5,
    requirement: ''
  });

  // Keep synced with currentUser if profile switches
  useEffect(() => {
    if (currentUser) {
      setProfile(prev => ({
        ...prev,
        age: currentUser.age,
        annual_income: currentUser.annual_income,
        occupation: currentUser.occupation,
        district: currentUser.district,
        state: currentUser.state,
        category: currentUser.category,
        gender: currentUser.gender,
        landholding_acres: currentUser.landholding_acres
      }));
    }
  }, [currentUser]);

  // Eligibility Evaluation State
  const [results, setResults] = useState([]);
  const [evaluating, setEvaluating] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expandedSchemeId, setExpandedSchemeId] = useState(null);

  // Scheme Detail Modal
  const [selectedSchemeDetail, setSelectedSchemeDetail] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Application Modal
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyScheme, setApplyScheme] = useState(null);
  const [applyAmount, setApplyAmount] = useState(200000);
  const [submittingApp, setSubmittingApp] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedAppNo, setSubmittedAppNo] = useState('');

  // Initial Evaluation on mount
  useEffect(() => {
    runEligibilityEvaluation(profile);
  }, []);

  const runEligibilityEvaluation = async (citizenData) => {
    setEvaluating(true);
    try {
      const data = await checkEligibility({ citizen: citizenData });
      if (data.recommendations) {
        setResults(data.recommendations);
        // Expand first eligible scheme
        const firstEligible = data.recommendations.find(r => r.status === 'ELIGIBLE');
        if (firstEligible) {
          setExpandedSchemeId(firstEligible.scheme_id);
        }
      }
    } catch (err) {
      console.error('Eligibility evaluation error:', err);
    } finally {
      setEvaluating(false);
    }
  };

  // Voice Input handler
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported on this browser. Please type your query.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (e) => {
        const text = e.results[0][0].transcript;
        setNaturalQuery(text);
        setIsListening(false);
        handleParseIntent(text);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  // Natural text to structured citizen profile (FastAPI)
  const handleParseIntent = async (textToParse = null) => {
    const text = (textToParse || naturalQuery).trim();
    if (!text) return;

    setParsingIntent(true);
    try {
      const res = await parseCitizenIntent(text, lang);
      if (res.structured_profile) {
        const updated = {
          ...profile,
          ...res.structured_profile,
          requirement: text
        };
        setProfile(updated);
        updateUser(updated);
        // Immediately run deterministic rule evaluation with new structured profile
        await runEligibilityEvaluation(updated);
      }
    } catch (err) {
      console.error('Error parsing intent:', err);
    } finally {
      setParsingIntent(false);
    }
  };

  const handleOpenDetailModal = async (schemeId) => {
    try {
      const data = await getSchemeById(schemeId);
      if (data.scheme) {
        setSelectedSchemeDetail(data.scheme);
        setDetailModalOpen(true);
      }
    } catch (err) {
      console.error('Error fetching scheme details:', err);
    }
  };

  const handleOpenApplyModal = (scheme) => {
    setApplyScheme(scheme);
    setApplyAmount(scheme.max_benefit > 0 ? Math.min(scheme.max_benefit, 250000) : 100000);
    setApplyModalOpen(true);
  };

  const handleSubmitApplication = async () => {
    if (!applyScheme) return;
    setSubmittingApp(true);
    try {
      const payload = {
        user_id: currentUser?.id || 1,
        scheme_id: applyScheme.scheme_id,
        partner_id: 1, // Default to top Facilitation Centre
        applicant_name: currentUser?.name || 'Citizen Ramesh Patil',
        applicant_phone: currentUser?.phone || '+91 98220 12345',
        applicant_district: profile.district,
        applicant_occupation: profile.occupation,
        requested_amount: Number(applyAmount),
        subsidy_amount: Math.round(Number(applyAmount) * (applyScheme.subsidy_pct || 0) / 100),
        tenure_months: 36,
        remarks: `Applied via Scheme Finder for ${applyScheme.scheme_name}`
      };

      const res = await submitApplication(payload);
      if (res.success) {
        setSubmittedAppNo(res.application?.application_no || 'SHK-2026-9911');
        setSubmitSuccess(true);
        setApplyModalOpen(false);
      }
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setSubmittingApp(false);
    }
  };

  // Filtered results
  const filteredResults = results.filter(r => {
    if (statusFilter === 'ALL') return true;
    return r.status === statusFilter;
  });

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: 'calc(100vh - 70px)', padding: '2.5rem 1.5rem 4rem 1.5rem' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
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
            <ShieldCheck size={18} />
            <span>EXPLAINABLE RULE ENGINE + AI INTENT</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.1rem, 4vw, 2.9rem)',
            fontWeight: 800,
            color: '#0f3d24',
            letterSpacing: '-0.03em',
            marginBottom: '0.75rem'
          }}>
            {t('finder_title')}
          </h1>

          <p style={{
            fontSize: '1.02rem',
            color: '#4b5563',
            maxWidth: '720px',
            margin: '0 auto',
            lineHeight: 1.5
          }}>
            {t('finder_subtitle')}
          </p>
        </div>

        {/* Section 1: Natural Language / Voice Requirement Input */}
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '24px',
          padding: '1.75rem 2rem',
          marginBottom: '2.5rem',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontWeight: 700, fontSize: '0.98rem', color: '#111827', marginBottom: '0.65rem' }}>
            Enter your requirement in natural language or speak:
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleParseIntent();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '9999px',
              padding: '0.4rem 0.5rem 0.4rem 1.25rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              marginBottom: '1.25rem'
            }}
          >
            <Search size={20} color="#94a3b8" style={{ marginRight: '0.75rem' }} />
            <input
              type="text"
              value={naturalQuery}
              onChange={(e) => setNaturalQuery(e.target.value)}
              placeholder="e.g. I am a 38 yr old farmer in Pune earning 2.2 Lakhs needing a tractor subsidy"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '0.95rem',
                color: '#111827'
              }}
            />

            <button
              type="button"
              onClick={handleVoiceInput}
              title="Voice Speech Input"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                color: isListening ? '#dc2626' : '#64748b',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {isListening ? <MicOff size={20} color="#dc2626" /> : <Mic size={20} />}
            </button>

            <button
              type="submit"
              disabled={parsingIntent}
              style={{
                backgroundColor: '#0f5132',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.65rem 1.4rem',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              {parsingIntent ? (
                <>
                  <CircularProgress size={16} color="inherit" />
                  <span>AI Parsing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Extract Profile & Match</span>
                </>
              )}
            </button>
          </form>

          {/* Citizen Demographic Filters Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid #e2e8f0'
          }}>
            <FormControl size="small" fullWidth>
              <InputLabel>Occupation</InputLabel>
              <Select
                value={profile.occupation}
                label="Occupation"
                onChange={(e) => {
                  const updated = { ...profile, occupation: e.target.value };
                  setProfile(updated);
                  runEligibilityEvaluation(updated);
                }}
              >
                <MenuItem value="Farmer">Farmer / Cultivator</MenuItem>
                <MenuItem value="Small Business">Small Business / Retail</MenuItem>
                <MenuItem value="Student / Graduate">Student / Graduate</MenuItem>
                <MenuItem value="Artisan / Weaver">Artisan / Weaver</MenuItem>
                <MenuItem value="Street Vendor">Street Vendor</MenuItem>
                <MenuItem value="Unemployed Youth">Unemployed Youth</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel>Social Category</InputLabel>
              <Select
                value={profile.category}
                label="Social Category"
                onChange={(e) => {
                  const updated = { ...profile, category: e.target.value };
                  setProfile(updated);
                  runEligibilityEvaluation(updated);
                }}
              >
                <MenuItem value="General">General</MenuItem>
                <MenuItem value="OBC">OBC</MenuItem>
                <MenuItem value="SC">SC</MenuItem>
                <MenuItem value="ST">ST</MenuItem>
                <MenuItem value="Women">Women</MenuItem>
              </Select>
            </FormControl>

            <TextField
              size="small"
              label="Citizen Age"
              type="number"
              value={profile.age}
              onChange={(e) => {
                const updated = { ...profile, age: Number(e.target.value) };
                setProfile(updated);
                runEligibilityEvaluation(updated);
              }}
            />

            <TextField
              size="small"
              label="Annual Income (₹)"
              type="number"
              value={profile.annual_income}
              onChange={(e) => {
                const updated = { ...profile, annual_income: Number(e.target.value) };
                setProfile(updated);
                runEligibilityEvaluation(updated);
              }}
            />

            <TextField
              size="small"
              label="Landholding (Acres)"
              type="number"
              value={profile.landholding_acres}
              onChange={(e) => {
                const updated = { ...profile, landholding_acres: Number(e.target.value) };
                setProfile(updated);
                runEligibilityEvaluation(updated);
              }}
            />
          </div>
        </div>

        {/* Section 2: Rule Engine Evaluation Results */}
        <div>
          {/* Status Tabs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.5rem',
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '0.85rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setStatusFilter('ALL')}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  backgroundColor: statusFilter === 'ALL' ? '#0f5132' : '#f1f5f9',
                  color: statusFilter === 'ALL' ? '#ffffff' : '#475569',
                  cursor: 'pointer'
                }}
              >
                All Schemes ({results.length})
              </button>

              <button
                onClick={() => setStatusFilter('ELIGIBLE')}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  backgroundColor: statusFilter === 'ELIGIBLE' ? '#15803d' : '#f0fdf4',
                  color: statusFilter === 'ELIGIBLE' ? '#ffffff' : '#15803d',
                  cursor: 'pointer'
                }}
              >
                ✓ Eligible ({results.filter(r => r.status === 'ELIGIBLE').length})
              </button>

              <button
                onClick={() => setStatusFilter('MORE INFORMATION REQUIRED')}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  backgroundColor: statusFilter === 'MORE INFORMATION REQUIRED' ? '#d97706' : '#fffbeb',
                  color: statusFilter === 'MORE INFORMATION REQUIRED' ? '#ffffff' : '#b45309',
                  cursor: 'pointer'
                }}
              >
                ? More Info Needed ({results.filter(r => r.status === 'MORE INFORMATION REQUIRED').length})
              </button>

              <button
                onClick={() => setStatusFilter('NOT ELIGIBLE')}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  backgroundColor: statusFilter === 'NOT ELIGIBLE' ? '#dc2626' : '#fef2f2',
                  color: statusFilter === 'NOT ELIGIBLE' ? '#ffffff' : '#b91c1c',
                  cursor: 'pointer'
                }}
              >
                ✗ Ineligible ({results.filter(r => r.status === 'NOT ELIGIBLE').length})
              </button>
            </div>

            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Deterministic Rule Engine v1.0 • Evaluated against Maharashtra criteria
            </span>
          </div>

          {/* Scheme Recommendation Cards */}
          {evaluating ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <CircularProgress style={{ color: '#0f5132' }} />
              <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '1rem' }}>
                Evaluating income, age, landholding, and category conditions...
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {filteredResults.map((scheme) => {
                const isExpanded = expandedSchemeId === scheme.scheme_id;
                const isEligible = scheme.status === 'ELIGIBLE';
                const isMoreInfo = scheme.status === 'MORE INFORMATION REQUIRED';

                return (
                  <div
                    key={scheme.scheme_id}
                    style={{
                      backgroundColor: '#ffffff',
                      border: isEligible ? '1.5px solid #86efac' : isMoreInfo ? '1.5px solid #fde68a' : '1px solid #e5e7eb',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {/* Top Main Bar */}
                    <div style={{ padding: '1.5rem 1.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                        
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                            <span style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              backgroundColor: '#f1f5f9',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '4px',
                              color: '#475569'
                            }}>
                              {scheme.scheme_code}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
                              {scheme.category} • {scheme.department}
                            </span>
                          </div>

                          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f3d24', marginBottom: '0.35rem' }}>
                            {lang === 'hi' && scheme.scheme_name_hi ? scheme.scheme_name_hi : lang === 'mr' && scheme.scheme_name_mr ? scheme.scheme_name_mr : scheme.scheme_name}
                          </h3>

                          <p style={{ fontSize: '0.9rem', color: '#4b5563', lineHeight: 1.5, maxWidth: '780px' }}>
                            {scheme.description}
                          </p>
                        </div>

                        {/* Status & Match Score Badge */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.45rem' }}>
                          <Chip
                            label={t(`status_${scheme.status.toLowerCase().replace(/ /g, '_')}`) || scheme.status}
                            style={{
                              backgroundColor: isEligible ? '#0f5132' : isMoreInfo ? '#d97706' : '#dc2626',
                              color: '#ffffff',
                              fontWeight: 800,
                              fontSize: '0.82rem',
                              padding: '0.3rem 0.5rem'
                            }}
                          />

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{t('match_score')}:</span>
                            <strong style={{ fontSize: '1.2rem', color: '#0f5132' }}>{scheme.match_score}%</strong>
                          </div>
                        </div>

                      </div>

                      {/* Benefit and Financial Snapshot */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1.5rem',
                        marginTop: '1.25rem',
                        padding: '0.85rem 1.25rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        fontSize: '0.85rem'
                      }}>
                        <div>
                          <span style={{ color: '#64748b' }}>Max Benefit: </span>
                          <strong style={{ color: '#111827' }}>
                            ₹{scheme.max_benefit ? scheme.max_benefit.toLocaleString('en-IN') : 'As per Project'}
                          </strong>
                        </div>

                        <div>
                          <span style={{ color: '#64748b' }}>Govt Subsidy: </span>
                          <strong style={{ color: '#059669' }}>{scheme.subsidy_pct}%</strong>
                        </div>

                        <div>
                          <span style={{ color: '#64748b' }}>Interest Rate: </span>
                          <strong style={{ color: '#111827' }}>
                            {scheme.interest_rate === 0 ? '0% (Direct Subsidy)' : `${scheme.interest_rate}% Concessional`}
                          </strong>
                        </div>

                        <button
                          onClick={() => setExpandedSchemeId(isExpanded ? null : scheme.scheme_id)}
                          style={{
                            marginLeft: 'auto',
                            background: 'none',
                            border: 'none',
                            color: '#0f5132',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            cursor: 'pointer'
                          }}
                        >
                          <span>{isExpanded ? 'Hide Rule Breakdown' : 'Explainable Rule Breakdown'}</span>
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Explainability Accordion (Section 4 Requirement) */}
                    {isExpanded && (
                      <div style={{
                        padding: '1.5rem 1.75rem',
                        borderTop: '1px solid #f1f5f9',
                        backgroundColor: '#fafbfc'
                      }}>
                        
                        {/* Plain Language WHY summary */}
                        <div style={{
                          backgroundColor: isEligible ? '#f0fdf4' : isMoreInfo ? '#fffbeb' : '#fef2f2',
                          border: isEligible ? '1px solid #bbf7d0' : isMoreInfo ? '1px solid #fde68a' : '1px solid #fecaca',
                          borderRadius: '12px',
                          padding: '1rem 1.25rem',
                          marginBottom: '1.25rem'
                        }}>
                          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: isEligible ? '#0f5132' : isMoreInfo ? '#b45309' : '#b91c1c', marginBottom: '0.25rem' }}>
                            {t('why_eligible_label')}:
                          </div>
                          <div style={{ fontSize: '0.9rem', color: '#374151', lineHeight: 1.5 }}>
                            {scheme.why_explanation}
                          </div>
                        </div>

                        {/* Rules Satisfied (✓) and Rules Failed (✗) */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                          
                          {/* Satisfied Rules */}
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.9rem', color: '#15803d', marginBottom: '0.5rem' }}>
                              <CheckCircle2 size={16} />
                              <span>{t('rules_satisfied')} ({scheme.satisfied_rules.length})</span>
                            </div>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                              {scheme.satisfied_rules.map((rule, idx) => (
                                <li key={idx} style={{ fontSize: '0.85rem', color: '#374151', backgroundColor: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                  <strong>{rule.description}</strong>
                                  <div style={{ fontSize: '0.78rem', color: '#16a34a', marginTop: '2px' }}>
                                    ✓ Verified: {rule.details}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Failed Rules */}
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.9rem', color: '#dc2626', marginBottom: '0.5rem' }}>
                              <XCircle size={16} />
                              <span>{t('rules_failed')} ({scheme.failed_rules.length})</span>
                            </div>
                            {scheme.failed_rules.length === 0 ? (
                              <div style={{ fontSize: '0.85rem', color: '#16a34a', fontStyle: 'italic', padding: '0.5rem' }}>
                                No mandatory rules violated.
                              </div>
                            ) : (
                              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                {scheme.failed_rules.map((rule, idx) => (
                                  <li key={idx} style={{ fontSize: '0.85rem', color: '#374151', backgroundColor: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #fecaca' }}>
                                    <strong style={{ color: '#dc2626' }}>{rule.description}</strong>
                                    <div style={{ fontSize: '0.78rem', color: '#b91c1c', marginTop: '2px' }}>
                                      ✗ {rule.reason}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>

                        </div>

                        {/* Missing Information Required */}
                        {scheme.missing_info && scheme.missing_info.length > 0 && (
                          <div style={{ marginBottom: '1.5rem', backgroundColor: '#fffbeb', padding: '0.85rem 1.25rem', borderRadius: '12px', border: '1px solid #fde68a' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.88rem', color: '#b45309', marginBottom: '0.35rem' }}>
                              <AlertCircle size={16} />
                              <span>{t('missing_info_label')}:</span>
                            </div>
                            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#78350f' }}>
                              {scheme.missing_info.map((m, idx) => (
                                <li key={idx}><strong>{m.label}</strong>: {m.prompt}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Action Buttons (Requirement 5) */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '0.75rem',
                          paddingTop: '1rem',
                          borderTop: '1px solid #e2e8f0'
                        }}>
                          <button
                            onClick={() => handleOpenDetailModal(scheme.scheme_id)}
                            style={{
                              backgroundColor: '#ffffff',
                              border: '1px solid #cbd5e1',
                              borderRadius: '9999px',
                              padding: '0.5rem 1.15rem',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              color: '#334155',
                              cursor: 'pointer'
                            }}
                          >
                            Scheme Details & Documents
                          </button>

                          <button
                            onClick={() => navigate('/calculator', { state: { schemeId: scheme.scheme_id, subsidyPct: scheme.subsidy_pct, loanAmount: scheme.max_benefit } })}
                            style={{
                              backgroundColor: '#ffffff',
                              border: '1px solid #cbd5e1',
                              borderRadius: '9999px',
                              padding: '0.5rem 1.15rem',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              color: '#0f5132',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              cursor: 'pointer'
                            }}
                          >
                            <Calculator size={14} />
                            <span>{t('btn_calculate')}</span>
                          </button>

                          <button
                            onClick={() => navigate('/partners', { state: { selectedSchemeId: scheme.scheme_id } })}
                            style={{
                              backgroundColor: '#ffffff',
                              border: '1.5px solid #0f5132',
                              borderRadius: '9999px',
                              padding: '0.5rem 1.15rem',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              color: '#0f5132',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              cursor: 'pointer'
                            }}
                          >
                            <MapPin size={14} />
                            <span>{t('btn_find_partners')}</span>
                          </button>

                          {isEligible && (
                            <button
                              onClick={() => handleOpenApplyModal(scheme)}
                              style={{
                                marginLeft: 'auto',
                                backgroundColor: '#0f5132',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '9999px',
                                padding: '0.55rem 1.4rem',
                                fontSize: '0.88rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                boxShadow: '0 2px 6px rgba(15, 81, 50, 0.25)'
                              }}
                            >
                              <span>{t('btn_apply_now')}</span>
                              <ArrowRight size={15} />
                            </button>
                          )}
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

      {/* Scheme Details Full Modal */}
      <Dialog
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ style: { borderRadius: '24px', padding: '1rem' } }}
      >
        {selectedSchemeDetail && (
          <>
            <DialogTitle>
              <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700 }}>
                {selectedSchemeDetail.department}
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f3d24', margin: '4px 0 0 0' }}>
                {selectedSchemeDetail.name} ({selectedSchemeDetail.code})
              </h2>
            </DialogTitle>
            <DialogContent>
              <p style={{ color: '#4b5563', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {selectedSchemeDetail.description}
              </p>

              <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827', marginBottom: '0.5rem' }}>
                Required Verification Documents:
              </h4>
              <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.25rem', color: '#374151', fontSize: '0.88rem' }}>
                {selectedSchemeDetail.required_documents?.map((doc, i) => (
                  <li key={i} style={{ marginBottom: '0.35rem' }}>{doc}</li>
                ))}
              </ul>

              <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827', marginBottom: '0.5rem' }}>
                Application Procedure:
              </h4>
              <ol style={{ paddingLeft: '1.25rem', color: '#374151', fontSize: '0.88rem' }}>
                {selectedSchemeDetail.application_process?.map((step, i) => (
                  <li key={i} style={{ marginBottom: '0.35rem' }}>{step}</li>
                ))}
              </ol>
            </DialogContent>
            <DialogActions style={{ padding: '1rem 1.5rem' }}>
              <Button onClick={() => setDetailModalOpen(false)} style={{ color: '#64748b' }}>
                Close
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setDetailModalOpen(false);
                  navigate('/partners', { state: { selectedSchemeId: selectedSchemeDetail.id } });
                }}
                style={{ backgroundColor: '#0f5132', borderRadius: '9999px', textTransform: 'none', fontWeight: 700 }}
              >
                Find Facilitation Partner
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* 1-Click Apply Modal */}
      <Dialog
        open={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ style: { borderRadius: '24px', padding: '1rem' } }}
      >
        <DialogTitle style={{ fontWeight: 800, color: '#0f3d24' }}>
          Apply for {applyScheme?.scheme_name}
        </DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            <TextField label="Applicant Name" value={currentUser?.name} fullWidth size="small" disabled />
            <TextField label="District & State" value={`${profile.district}, ${profile.state}`} fullWidth size="small" disabled />
            <TextField
              label="Requested Financial Amount (₹)"
              type="number"
              value={applyAmount}
              onChange={(e) => setApplyAmount(e.target.value)}
              fullWidth
              size="small"
            />
            <div style={{ backgroundColor: '#f0fdf4', padding: '0.85rem', borderRadius: '8px', fontSize: '0.82rem', color: '#0f5132' }}>
              Expected Capital Subsidy: <strong>{applyScheme?.subsidy_pct}%</strong> (₹{Math.round(Number(applyAmount) * (applyScheme?.subsidy_pct || 0) / 100).toLocaleString('en-IN')})
            </div>
          </div>
        </DialogContent>
        <DialogActions style={{ padding: '1rem 1.5rem' }}>
          <Button onClick={() => setApplyModalOpen(false)} style={{ color: '#64748b' }}>Cancel</Button>
          <Button
            variant="contained"
            disabled={submittingApp}
            onClick={handleSubmitApplication}
            style={{ backgroundColor: '#0f5132', borderRadius: '9999px', fontWeight: 700, textTransform: 'none' }}
          >
            {submittingApp ? 'Submitting...' : 'Confirm Application'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Notification */}
      <Snackbar
        open={submitSuccess}
        autoHideDuration={6000}
        onClose={() => setSubmitSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSubmitSuccess(false)} style={{ borderRadius: '12px' }}>
          Application submitted! Reference: <strong>{submittedAppNo}</strong>. Track in "My Applications".
        </Alert>
      </Snackbar>

    </div>
  );
}
