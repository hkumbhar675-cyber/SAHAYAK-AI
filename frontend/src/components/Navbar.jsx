import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import {
  Globe,
  User,
  CheckCircle,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Menu,
  MenuItem,
  Chip
} from '@mui/material';

export default function Navbar() {
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();
  const { currentUser, citizens, selectUser, isLoginModalOpen, setIsLoginModalOpen } = useUser();

  // Language Menu Anchor
  const [langAnchorEl, setLangAnchorEl] = useState(null);
  const isLangMenuOpen = Boolean(langAnchorEl);

  const handleLangClick = (event) => {
    setLangAnchorEl(event.currentTarget);
  };
  const handleLangSelect = (selectedLang) => {
    setLang(selectedLang);
    setLangAnchorEl(null);
  };

  const navLinks = [
    { label: t('nav_home'), path: '/' },
    { label: t('nav_finder'), path: '/schemes' },
    { label: t('nav_assistant'), path: '/assistant' },
    { label: t('nav_partners'), path: '/partners' },
    { label: t('nav_calculator'), path: '/calculator' },
    { label: t('nav_applications'), path: '/applications' }
  ];

  return (
    <>
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #f1f5f9',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          
          {/* Brand Logo & Title */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              backgroundColor: '#0f5132',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1.35rem',
              boxShadow: '0 2px 8px rgba(15, 81, 50, 0.25)'
            }}>
              S
            </div>
            <div>
              <div style={{
                fontWeight: 800,
                fontSize: '1.15rem',
                letterSpacing: '-0.02em',
                color: '#0f5132',
                lineHeight: 1.1
              }}>
                {t('brand_title')}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#64748b',
                fontWeight: 500,
                letterSpacing: '0.01em'
              }}>
                {t('brand_subtitle')}
              </div>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.75rem'
          }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#0f5132' : '#4b5563',
                    padding: '0.35rem 0',
                    borderBottom: isActive ? '2px solid #0f5132' : '2px solid transparent',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls: Language & Login */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            
            {/* Language Selector Pill */}
            <button
              onClick={handleLangClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '9999px',
                padding: '0.4rem 0.85rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#334155'
              }}
            >
              <Globe size={16} color="#0f5132" />
              <span>{lang.toUpperCase()}</span>
              <ChevronDown size={14} color="#64748b" />
            </button>

            <Menu
              anchorEl={langAnchorEl}
              open={isLangMenuOpen}
              onClose={() => setLangAnchorEl(null)}
              PaperProps={{
                elevation: 3,
                style: { borderRadius: '12px', minWidth: '130px', marginTop: '6px' }
              }}
            >
              <MenuItem onClick={() => handleLangSelect('en')} selected={lang === 'en'}>
                English (EN)
              </MenuItem>
              <MenuItem onClick={() => handleLangSelect('hi')} selected={lang === 'hi'}>
                हिन्दी (HI)
              </MenuItem>
              <MenuItem onClick={() => handleLangSelect('mr')} selected={lang === 'mr'}>
                मराठी (MR)
              </MenuItem>
            </Menu>

            {/* Login / Profile Switcher Button */}
            <button
              onClick={() => setIsLoginModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#0f5132',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.45rem 1.15rem',
                fontSize: '0.88rem',
                fontWeight: 600,
                boxShadow: '0 2px 6px rgba(15, 81, 50, 0.2)',
                transition: 'all 0.15s ease'
              }}
            >
              <User size={16} />
              <span>{currentUser ? currentUser.name.split(' ')[0] : t('login_btn')}</span>
            </button>

          </div>
        </div>
      </header>

      {/* Citizen Profile Switcher Modal */}
      <Dialog
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: { borderRadius: '20px', padding: '0.5rem' }
        }}
      >
        <DialogTitle style={{ fontWeight: 800, color: '#0f5132', fontSize: '1.25rem' }}>
          Select Citizen Demo Profile
        </DialogTitle>
        <DialogContent>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Switch between realistic citizen personas to evaluate rule-based eligibility for farmers, MSMEs, students, and women entrepreneurs.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {citizens.map((citizen) => {
              const isSelected = currentUser?.id === citizen.id;
              return (
                <div
                  key={citizen.id}
                  onClick={() => {
                    selectUser(citizen.id);
                    setIsLoginModalOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #0f5132' : '1px solid #e2e8f0',
                    backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <span style={{ fontSize: '1.75rem' }}>{citizen.avatar}</span>
                    <div>
                      <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>
                        {citizen.name}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '0.8rem' }}>
                        {citizen.occupation} • Age: {citizen.age} • Income: ₹{citizen.annual_income.toLocaleString('en-IN')}/yr
                      </div>
                      <div style={{ color: '#059669', fontSize: '0.75rem', fontWeight: 600, marginTop: '2px' }}>
                        {citizen.district}, {citizen.state} • Category: {citizen.category}
                        {citizen.landholding_acres > 0 ? ` • ${citizen.landholding_acres} Acres Land` : ''}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <Chip
                      label="Active"
                      size="small"
                      style={{ backgroundColor: '#0f5132', color: '#ffffff', fontWeight: 600 }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </DialogContent>
        <DialogActions style={{ padding: '1rem 1.5rem' }}>
          <Button
            onClick={() => setIsLoginModalOpen(false)}
            style={{ color: '#64748b', fontWeight: 600 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
