import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { getApplications, updateApplicationStatus } from '../services/api';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  MapPin,
  Calendar,
  IndianRupee,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  RotateCw
} from 'lucide-react';
import {
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert
} from '@mui/material';

const STATUS_STEPS = [
  { key: 'Submitted', label: 'Submitted', description: 'Application received & acknowledged' },
  { key: 'Under Review', label: 'Under Review', description: 'Partner verification & due diligence' },
  { key: 'Documents Required', label: 'Docs Required', description: 'Additional verification documents' },
  { key: 'Approved', label: 'Approved', description: 'Subsidy & credit sanctioned' },
  { key: 'Completed', label: 'Completed', description: 'Funds disbursed to citizen DBT account' }
];

export default function Applications() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { currentUser } = useUser();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeApp, setActiveApp] = useState(null);
  const [advancing, setAdvancing] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    loadUserApplications();
  }, [currentUser]);

  const loadUserApplications = async () => {
    setLoading(true);
    try {
      const data = await getApplications();
      if (data.applications) {
        setApplications(data.applications);
        if (!activeApp && data.applications.length > 0) {
          setActiveApp(data.applications[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Live status advancement for demo testing
  const handleAdvanceStatus = async (appId) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;

    const sequence = ['Submitted', 'Under Review', 'Documents Required', 'Approved', 'Completed'];
    const currentIndex = sequence.indexOf(app.status);
    const nextIndex = (currentIndex + 1) % sequence.length;
    const nextStatus = sequence[nextIndex];

    setAdvancing(true);
    try {
      const res = await updateApplicationStatus(appId, {
        status: nextStatus,
        notes: `Simulated status advance to ${nextStatus} by demo reviewer.`
      });
      if (res.success) {
        setToastMsg(`Application ${app.application_no} status advanced to "${nextStatus}"`);
        await loadUserApplications();
        if (activeApp && activeApp.id === appId) {
          setActiveApp(res.application);
        }
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setAdvancing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
      case 'Completed':
        return '#0f5132';
      case 'Under Review':
        return '#2563eb';
      case 'Documents Required':
        return '#d97706';
      case 'Rejected':
        return '#dc2626';
      default:
        return '#4b5563';
    }
  };

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
            <FileText size={18} />
            <span>DIRECT APPLICATION LIFECYCLE</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.1rem, 4vw, 2.85rem)',
            fontWeight: 800,
            color: '#0f3d24',
            letterSpacing: '-0.03em',
            marginBottom: '0.75rem'
          }}>
            My Scheme Applications & Tracking
          </h1>

          <p style={{
            fontSize: '1rem',
            color: '#4b5563',
            maxWidth: '650px',
            margin: '0 auto',
            lineHeight: 1.5
          }}>
            Track your welfare and loan applications through every verified milestone with recommended channel partners in Pune.
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
            <CircularProgress style={{ color: '#0f5132' }} />
          </div>
        ) : applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', backgroundColor: '#f8fafc', borderRadius: '24px' }}>
            <FileText size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
              No applications submitted yet
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>
              Discover eligible schemes and submit an application through an authorized channel partner.
            </p>
            <button
              onClick={() => navigate('/schemes')}
              style={{
                backgroundColor: '#0f5132',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.75rem 1.5rem',
                fontWeight: 600,
                fontSize: '0.92rem',
                cursor: 'pointer'
              }}
            >
              Explore Schemes Now
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 1fr) minmax(340px, 1.4fr)',
            gap: '2rem',
            alignItems: 'start'
          }}>
            
            {/* Left Column: Applications List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>
                Active Applications ({applications.length})
              </div>

              {applications.map((app) => {
                const isSelected = activeApp?.id === app.id;
                return (
                  <div
                    key={app.id}
                    onClick={() => setActiveApp(app)}
                    style={{
                      backgroundColor: '#ffffff',
                      border: isSelected ? '2px solid #0f5132' : '1px solid #e5e7eb',
                      borderRadius: '18px',
                      padding: '1.25rem',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 4px 14px rgba(15, 81, 50, 0.08)' : '0 2px 4px rgba(0,0,0,0.02)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>
                        {app.application_no}
                      </span>
                      <Chip
                        label={app.status}
                        size="small"
                        style={{
                          backgroundColor: getStatusColor(app.status),
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.75rem'
                        }}
                      />
                    </div>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f3d24', marginBottom: '0.35rem' }}>
                      {app.scheme_name}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                      <Building2 size={13} color="#94a3b8" />
                      <span>{app.partner_name}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                      <span style={{ color: '#64748b' }}>
                        Requested: <strong>₹{app.requested_amount.toLocaleString('en-IN')}</strong>
                      </span>
                      <span style={{ color: '#059669', fontWeight: 600 }}>
                        Subsidy: ₹{app.subsidy_amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Timeline & Detailed Progress Card */}
            {activeApp && (
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '24px',
                padding: '2rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
              }}>
                
                {/* Top Details & Advance Demo Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>
                      APPLICATION REFERENCE: {activeApp.application_no}
                    </span>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f3d24', margin: '4px 0 0 0' }}>
                      {activeApp.scheme_name}
                    </h2>
                    <div style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
                      Facilitating Partner: {activeApp.partner_name} ({activeApp.applicant_district})
                    </div>
                  </div>

                  {/* Advance Status Button for Demo Evaluation */}
                  <button
                    onClick={() => handleAdvanceStatus(activeApp.id)}
                    disabled={advancing}
                    title="Simulate workflow progression for reviewer evaluation"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      backgroundColor: '#f0fdf4',
                      color: '#0f5132',
                      border: '1.5px solid #bbf7d0',
                      borderRadius: '9999px',
                      padding: '0.5rem 1rem',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <RotateCw size={14} />
                    <span>Advance Status (Demo)</span>
                  </button>
                </div>

                {/* Visual Lifecycle Progress Bar */}
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'relative',
                    marginBottom: '1rem'
                  }}>
                    {STATUS_STEPS.map((step, idx) => {
                      const stepIndex = STATUS_STEPS.findIndex(s => s.key === activeApp.status);
                      const isCompleted = idx <= stepIndex;
                      const isCurrent = idx === stepIndex;

                      return (
                        <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                          <div style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            backgroundColor: isCurrent ? '#0f5132' : isCompleted ? '#16a34a' : '#f1f5f9',
                            color: isCompleted ? '#ffffff' : '#94a3b8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            border: isCurrent ? '3px solid #bbf7d0' : 'none',
                            boxShadow: isCurrent ? '0 0 0 3px rgba(15, 81, 50, 0.2)' : 'none'
                          }}>
                            {isCompleted && !isCurrent ? <CheckCircle2 size={18} /> : idx + 1}
                          </div>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: isCurrent ? 700 : 500,
                            color: isCurrent ? '#0f5132' : '#64748b',
                            marginTop: '0.35rem',
                            textAlign: 'center',
                            maxWidth: '70px'
                          }}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Timeline History Log */}
                <div style={{ marginBottom: '1.75rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>
                    Application Verification Log:
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {activeApp.timeline?.map((event, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          backgroundColor: '#f8fafc',
                          padding: '0.85rem 1rem',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0'
                        }}
                      >
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: '#f0fdf4',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <CheckCircle2 size={16} color="#0f5132" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ fontSize: '0.88rem', color: '#0f3d24' }}>{event.status}</strong>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                              {new Date(event.changed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.82rem', color: '#4b5563', marginTop: '2px' }}>
                            {event.notes}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Applicant Summary */}
                <div style={{
                  backgroundColor: '#f0fdf4',
                  borderRadius: '14px',
                  padding: '1rem 1.25rem',
                  fontSize: '0.84rem',
                  color: '#374151',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '0.75rem'
                }}>
                  <div>
                    <span style={{ color: '#64748b' }}>Applicant:</span><br />
                    <strong>{activeApp.applicant_name}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Occupation:</span><br />
                    <strong>{activeApp.applicant_occupation}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Sanction Amount:</span><br />
                    <strong>₹{activeApp.requested_amount.toLocaleString('en-IN')}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Govt Subsidy:</span><br />
                    <strong style={{ color: '#059669' }}>₹{activeApp.subsidy_amount.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </div>

      <Snackbar
        open={Boolean(toastMsg)}
        autoHideDuration={4000}
        onClose={() => setToastMsg('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={() => setToastMsg('')} style={{ borderRadius: '12px' }}>
          {toastMsg}
        </Alert>
      </Snackbar>

    </div>
  );
}
