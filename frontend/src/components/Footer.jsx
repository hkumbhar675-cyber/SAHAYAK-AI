import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Shield, ExternalLink, Heart } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer style={{
      backgroundColor: '#0a2318',
      color: '#e2e8f0',
      paddingTop: '3rem',
      paddingBottom: '2rem',
      borderTop: '4px solid #10b981',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 1.5rem'
      }}>
        {/* Top Tier */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem',
          marginBottom: '2.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                backgroundColor: '#10b981',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1.2rem'
              }}>
                S
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#ffffff' }}>
                  {t('brand_title')}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {t('brand_subtitle')}
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6 }}>
              An intelligent, transparent citizen benefits platform connecting individuals with welfare schemes through deterministic rules and verified channel partners.
            </p>
          </div>

          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff', marginBottom: '1rem' }}>
              Citizen Services
            </div>
            <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>• PM-Kisan & Agricultural Mechanization</li>
              <li>• PMEGP & Mudra Enterprise Loans</li>
              <li>• Stand-Up India for Women & SC/ST</li>
              <li>• PM SVANidhi Street Vendor Credit</li>
              <li>• Baliraja Jal Sanjivani Micro-irrigation</li>
            </ul>
          </div>

          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff', marginBottom: '1rem' }}>
              Verified Channel Partners (Pune)
            </div>
            <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>• District Finance Facilitation Centre (Camp)</li>
              <li>• Bank of Maharashtra Lead Office (Deccan)</li>
              <li>• NSFDC Channel Partner (Shivajinagar)</li>
              <li>• SBI SME Center (Hadapsar)</li>
              <li>• MAVIM Women Development Agency (FC Road)</li>
            </ul>
          </div>

          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff', marginBottom: '1rem' }}>
              Compliance & Assistance
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              <Shield size={16} />
              <span>Verifiable Rule-based Decisions</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Toll-Free Helpline: <strong>1800-11-2026</strong><br />
              Email: <code>support@sahayak.gov.in (Demo)</code><br />
              Location: Pune, Maharashtra
            </p>
          </div>
        </div>

        {/* Bottom Tier & Disclaimer */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.8rem',
          color: '#94a3b8'
        }}>
          <div>
            © 2026 SAHAYAK AI – Citizen Benefits Platform. All Rights Reserved.
          </div>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '0.35rem 0.85rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            color: '#cbd5e1'
          }}>
            ℹ️ Demo Prototype • Financial channel partner data marked as sample information for prototype review
          </div>
        </div>
      </div>
    </footer>
  );
}
