import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import {
  ShieldCheck,
  Sparkles,
  Bot,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Building2,
  Calculator,
  Compass,
  FileCheck2,
  TrendingUp,
  Landmark
} from 'lucide-react';
import { Button } from '@mui/material';

export default function Home() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { currentUser, citizens, selectUser } = useUser();

  return (
    <div style={{ backgroundColor: '#ffffff', overflowX: 'hidden' }}>
      
      {/* HERO SECTION (EXACT MATCH TO SCREENSHOT 1) */}
      <section style={{
        position: 'relative',
        padding: '4.5rem 1.5rem 6rem 1.5rem',
        background: 'radial-gradient(circle at 85% 30%, rgba(240, 253, 244, 0.8) 0%, rgba(255, 255, 255, 1) 60%)'
      }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '4rem',
          alignItems: 'center'
        }}>
          
          {/* Left Column: Headline, Subtitle, Dual Buttons, Feature Checks */}
          <div>
            
            {/* Shield Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#0f5132',
              fontSize: '0.88rem',
              fontWeight: 600,
              marginBottom: '1.75rem',
              letterSpacing: '0.01em'
            }}>
              <ShieldCheck size={18} color="#0f5132" strokeWidth={2.2} />
              <span>{t('badge_hero')}</span>
            </div>

            {/* Giant Title */}
            <h1 style={{
              fontSize: 'clamp(2.75rem, 5.5vw, 4.25rem)',
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-0.035em',
              color: '#0f3d24',
              marginBottom: '1.75rem'
            }}>
              {t('hero_title_1')}<br />
              {t('hero_title_2')}<br />
              {t('hero_title_3')}
            </h1>

            {/* Hero Subtitle */}
            <p style={{
              fontSize: '1.08rem',
              lineHeight: 1.6,
              color: '#4b5563',
              maxWidth: '520px',
              marginBottom: '2.5rem'
            }}>
              {t('hero_desc')}
            </p>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.25rem',
              marginBottom: '2.5rem'
            }}>
              
              {/* Primary Button: Find My Scheme > */}
              <button
                onClick={() => navigate('/schemes')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  backgroundColor: '#0f5132',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '0.95rem 1.85rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(15, 81, 50, 0.25)',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease, background-color 0.15s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0a3622'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0f5132'}
              >
                <Sparkles size={18} />
                <span>{t('btn_find_scheme')}</span>
                <ChevronRight size={18} />
              </button>

              {/* Secondary Button: Ask AI Assistant */}
              <button
                onClick={() => navigate('/assistant')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  backgroundColor: '#ffffff',
                  color: '#0f5132',
                  border: '1.5px solid #0f5132',
                  borderRadius: '9999px',
                  padding: '0.9rem 1.85rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0fdf4'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
              >
                <Bot size={18} />
                <span>{t('btn_ask_ai')}</span>
              </button>

              {/* Marginalized Entrepreneurs Schemes Direct Button */}
              <button
                onClick={() => navigate('/schemes?marginalized=true')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  border: '1.5px solid #fde68a',
                  borderRadius: '9999px',
                  padding: '0.85rem 1.5rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fde68a'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fef3c7'}
              >
                <Sparkles size={17} color="#d97706" />
                <span>{t('filter_marginalized_only')}</span>
                <ChevronRight size={17} color="#d97706" />
              </button>

            </div>

            {/* 3 Verification Checks */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
              fontSize: '0.88rem',
              color: '#374151',
              fontWeight: 500
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="#0f5132" strokeWidth={2.5} />
                <span>{t('check_explainable')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="#0f5132" strokeWidth={2.5} />
                <span>{t('check_rule_based')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="#0f5132" strokeWidth={2.5} />
                <span>{t('check_multilingual')}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Benefits Card (EXACT REPLICA OF SCREENSHOT 1) */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '2.5rem 2.25rem',
              width: '100%',
              maxWidth: '430px',
              boxShadow: '0 20px 40px -10px rgba(15, 81, 50, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
              border: '1px solid #f1f5f9',
              position: 'relative'
            }}>
              
              {/* Top Row: YOUR BENEFITS + Sparkles */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.75rem'
              }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#94a3b8',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}>
                  {t('card_your_benefits')}
                </span>
                <Sparkles size={20} color="#0f5132" />
              </div>

              {/* Personalized for you */}
              <div style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#111827',
                marginBottom: '1.75rem'
              }}>
                {t('card_personalized')}
              </div>

              {/* Big 100+ Counter */}
              <div style={{
                fontSize: '4.25rem',
                fontWeight: 800,
                color: '#0f5132',
                lineHeight: 1,
                letterSpacing: '-0.04em',
                marginBottom: '0.5rem'
              }}>
                {t('card_count')}
              </div>

              {/* Sub-label */}
              <div style={{
                fontSize: '0.95rem',
                color: '#6b7280',
                marginBottom: '2rem'
              }}>
                {t('card_count_label')}
              </div>

              {/* Horizontal Divider */}
              <div style={{ height: '1px', backgroundColor: '#f1f5f9', marginBottom: '1.5rem' }} />

              {/* Row 1: AI Matching */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0',
                fontSize: '0.95rem'
              }}>
                <span style={{ fontWeight: 700, color: '#111827' }}>
                  {t('card_ai_matching')}
                </span>
                <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                  {t('card_ai_matching_val')}
                </span>
              </div>

              {/* Row 2: Nearby Partners */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0',
                fontSize: '0.95rem'
              }}>
                <span style={{ fontWeight: 700, color: '#111827' }}>
                  {t('card_nearby_partners')}
                </span>
                <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                  {t('card_nearby_partners_val')}
                </span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ONE PLATFORM SECTION */}
      <section style={{
        padding: '4rem 1.5rem',
        backgroundColor: '#f8fafc',
        borderTop: '1px solid #f1f5f9'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', textAlign: 'center' }}>
          
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            color: '#0f5132',
            letterSpacing: '0.15em',
            marginBottom: '0.75rem',
            textTransform: 'uppercase'
          }}>
            {t('one_platform')}
          </div>

          <h2 style={{
            fontSize: '2.2rem',
            fontWeight: 800,
            color: '#0f3d24',
            marginBottom: '1rem'
          }}>
            {t('platform_tagline')}
          </h2>

          <p style={{
            maxWidth: '650px',
            margin: '0 auto 3rem auto',
            color: '#64748b',
            fontSize: '1rem',
            lineHeight: 1.6
          }}>
            Every recommendation is calculated using strict, deterministic central and Maharashtra state guidelines. 
            AI understands citizen natural queries, but deterministic eligibility rules govern sanctions.
          </p>

          {/* 4 Interactive Feature Pillars */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.75rem',
            textAlign: 'left'
          }}>
            
            <div
              onClick={() => navigate('/schemes')}
              style={{
                backgroundColor: '#ffffff',
                padding: '2rem',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                width: '44px',
                height: '44px',
                backgroundColor: '#f0fdf4',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <FileCheck2 size={24} color="#0f5132" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f3d24', marginBottom: '0.5rem' }}>
                Deterministic Rules
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1rem' }}>
                Verified criteria across income, age, landholding, category, and occupation. Zero hallucinated eligibility.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0f5132', fontWeight: 600, fontSize: '0.85rem' }}>
                <span>Explore Rules</span>
                <ArrowRight size={14} />
              </div>
            </div>

            <div
              onClick={() => navigate('/partners')}
              style={{
                backgroundColor: '#ffffff',
                padding: '2rem',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                width: '44px',
                height: '44px',
                backgroundColor: '#f0fdf4',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Landmark size={24} color="#0f5132" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f3d24', marginBottom: '0.5rem' }}>
                6-Factor Partner Scorer
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1rem' }}>
                Ranks partners by scheme compatibility, proximity, fund liquidity, NPA track record, and official authorization.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0f5132', fontWeight: 600, fontSize: '0.85rem' }}>
                <span>Locate Partners</span>
                <ArrowRight size={14} />
              </div>
            </div>

            <div
              onClick={() => navigate('/calculator')}
              style={{
                backgroundColor: '#ffffff',
                padding: '2rem',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                width: '44px',
                height: '44px',
                backgroundColor: '#f0fdf4',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Calculator size={24} color="#0f5132" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f3d24', marginBottom: '0.5rem' }}>
                Financial Calculator
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1rem' }}>
                Calculates loan amount, government subsidy percentage, effective borrower liability, and monthly EMI.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0f5132', fontWeight: 600, fontSize: '0.85rem' }}>
                <span>Compute EMI</span>
                <ArrowRight size={14} />
              </div>
            </div>

            <div
              onClick={() => navigate('/assistant')}
              style={{
                backgroundColor: '#ffffff',
                padding: '2rem',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                width: '44px',
                height: '44px',
                backgroundColor: '#f0fdf4',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Compass size={24} color="#0f5132" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f3d24', marginBottom: '0.5rem' }}>
                Multilingual Voice AI
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1rem' }}>
                Speech recognition and intent parsing in English, Hindi, and Marathi with Bhashini-ready architecture.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0f5132', fontWeight: 600, fontSize: '0.85rem' }}>
                <span>Try Voice AI</span>
                <ArrowRight size={14} />
              </div>
            </div>

          </div>

          {/* Quick Citizen Persona Selector for Demo Review */}
          <div style={{
            marginTop: '3.5rem',
            backgroundColor: '#ffffff',
            padding: '2rem',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f3d24' }}>
                  Demo Citizen Personas (Instant Switch)
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
                  Select an active persona to see real-time rule changes and partner matching in Pune:
                </p>
              </div>
              <span style={{ fontSize: '0.85rem', color: '#0f5132', fontWeight: 600 }}>
                Active: <strong>{currentUser?.name}</strong> ({currentUser?.badge})
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              {citizens.map((c) => {
                const isActive = currentUser?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => selectUser(c.id)}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      border: isActive ? '2px solid #0f5132' : '1px solid #e2e8f0',
                      backgroundColor: isActive ? '#f0fdf4' : '#ffffff',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontSize: '1.4rem', marginBottom: '0.35rem' }}>{c.avatar}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>{c.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{c.badge}</div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
