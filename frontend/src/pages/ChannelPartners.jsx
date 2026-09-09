import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { rankPartners, getSchemes, submitApplication } from '../services/api';
import {
  MapPin,
  Users,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Info,
  TrendingDown,
  Coins,
  BadgeCheck,
  Building,
  Check,
  SlidersHorizontal,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  TextField
} from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet Default Icon issue in React Vite
const defaultGreenIcon = L.divIcon({
  className: 'custom-partner-marker',
  html: `<div style="background-color: #0f5132; width: 28px; height: 28px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 13px;">P</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14]
});

const userPinIcon = L.divIcon({
  className: 'custom-user-marker',
  html: `<div style="background-color: #2563eb; width: 26px; height: 26px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 0 0 4px rgba(37,99,235,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 11px;">You</div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
  popupAnchor: [0, -13]
});

// Component to dynamically re-center map
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 12, { duration: 1.2 });
  }, [center, map]);
  return null;
}

export default function ChannelPartners() {
  const { t } = useLanguage();
  const { currentUser } = useUser();

  const [partners, setPartners] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState('');
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState({ latitude: 18.5204, longitude: 73.8567 }); // Central Pune
  const [activePartnerDetail, setActivePartnerDetail] = useState(null);
  
  // Application Modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyingPartner, setApplyingPartner] = useState(null);
  const [applyForm, setApplyForm] = useState({
    requested_amount: 150000,
    tenure_months: 36,
    remarks: ''
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedAppNo, setSubmittedAppNo] = useState('');

  // Fetch initial schemes and ranked partners
  useEffect(() => {
    loadSchemes();
    fetchRankedPartners();
  }, []);

  useEffect(() => {
    fetchRankedPartners();
  }, [selectedSchemeId, userLocation]);

  const loadSchemes = async () => {
    try {
      const data = await getSchemes();
      if (data.schemes) {
        setSchemes(data.schemes);
      }
    } catch (err) {
      console.error('Error fetching schemes:', err);
    }
  };

  const fetchRankedPartners = async () => {
    setLoading(true);
    try {
      const data = await rankPartners({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        scheme_id: selectedSchemeId || null
      });
      if (data.partners) {
        setPartners(data.partners);
      }
    } catch (err) {
      console.error('Error ranking partners:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          });
        },
        (err) => {
          // Default to central Pune District
          setUserLocation({ latitude: 18.5204, longitude: 73.8567 });
        }
      );
    }
  };

  const handleOpenApply = (partner) => {
    setApplyingPartner(partner);
    setApplyModalOpen(true);
  };

  const handleSubmitApplication = async () => {
    if (!applyingPartner) return;
    setSubmitting(true);
    try {
      const selectedScheme = schemes.find(s => s.id === Number(selectedSchemeId)) || schemes[0];
      const payload = {
        user_id: currentUser?.id || 1,
        scheme_id: selectedScheme?.id || 1,
        partner_id: applyingPartner.partner_id,
        applicant_name: currentUser?.name || 'Citizen Ramesh Patil',
        applicant_phone: currentUser?.phone || '+91 98220 12345',
        applicant_district: currentUser?.district || 'Pune',
        applicant_occupation: currentUser?.occupation || 'Farmer',
        requested_amount: Number(applyForm.requested_amount),
        subsidy_amount: Math.round(Number(applyForm.requested_amount) * (selectedScheme?.subsidy_pct || 0) / 100),
        tenure_months: Number(applyForm.tenure_months),
        remarks: applyForm.remarks || 'Application routed via SAHAYAK AI Partner Locator'
      };

      const res = await submitApplication(payload);
      if (res.success) {
        setSubmittedAppNo(res.application?.application_no || 'SHK-2026-9012');
        setSubmitSuccess(true);
        setApplyModalOpen(false);
      }
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: 'calc(100vh - 70px)', padding: '2.5rem 1.5rem 4rem 1.5rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Top Header Matching Screenshot 2 */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: 800,
            color: '#0f3d24',
            letterSpacing: '-0.03em',
            marginBottom: '0.85rem'
          }}>
            {t('partners_title')}
          </h1>
          <p style={{
            fontSize: '1rem',
            color: '#4b5563',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: 1.5
          }}>
            {t('partners_desc')}
          </p>
        </div>

        {/* Filter Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem',
          backgroundColor: '#f8fafc',
          padding: '0.85rem 1.25rem',
          borderRadius: '16px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#374151' }}>
              Filter by Scheme:
            </span>
            <FormControl size="small" style={{ minWidth: 260 }}>
              <Select
                value={selectedSchemeId}
                onChange={(e) => setSelectedSchemeId(e.target.value)}
                displayEmpty
                style={{ backgroundColor: '#ffffff', borderRadius: '8px', fontSize: '0.88rem' }}
              >
                <MenuItem value="">All Facilitated Schemes</MenuItem>
                {schemes.map(s => (
                  <MenuItem key={s.id} value={s.id}>{s.name} ({s.code})</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <BadgeCheck size={16} />
            <span>6-Factor Scorer Active (Compatibility 20%, Proximity 20%, Liquidity 20%, NPA 15%, Overdue 15%, Auth 10%)</span>
          </div>
        </div>

        {/* Main Grid: Left Map + Right Eligible Partners List (EXACT MATCH TO SCREENSHOT 2) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.15fr) minmax(320px, 1fr)',
          gap: '2rem',
          alignItems: 'start'
        }}>
          
          {/* Left Column: Interactive Map with Floating Location Card */}
          <div style={{
            position: 'relative',
            height: '620px',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e2e8f0'
          }}>
            <MapContainer
              center={[userLocation.latitude, userLocation.longitude]}
              zoom={12}
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapUpdater center={[userLocation.latitude, userLocation.longitude]} />

              {/* User Current Location Marker */}
              <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userPinIcon}>
                <Popup>
                  <div style={{ padding: '4px', fontSize: '0.85rem' }}>
                    <strong>Your Location</strong><br />
                    Pune, Maharashtra
                  </div>
                </Popup>
              </Marker>

              {/* Partner Markers */}
              {partners.map((partner) => (
                <Marker
                  key={partner.partner_id}
                  position={[partner.latitude, partner.longitude]}
                  icon={defaultGreenIcon}
                  eventHandlers={{
                    click: () => setActivePartnerDetail(partner)
                  }}
                >
                  <Popup>
                    <div style={{ minWidth: '180px', padding: '4px' }}>
                      <strong style={{ color: '#0f5132' }}>{partner.name}</strong>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                        {partner.address}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.8rem' }}>
                        <span>Distance: {partner.distance_km} km</span>
                        <strong style={{ color: '#059669' }}>Score: {partner.total_score}/100</strong>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Floating Card on bottom-left of Map (EXACT REPLICA OF SCREENSHOT 2) */}
            <div style={{
              position: 'absolute',
              bottom: '24px',
              left: '24px',
              zIndex: 1000,
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '1.25rem 1.5rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)',
              maxWidth: '260px',
              border: '1px solid rgba(0,0,0,0.06)'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#f0fdf4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.75rem'
              }}>
                <MapPin size={20} color="#0f5132" />
              </div>

              <div style={{ fontWeight: 700, fontSize: '0.98rem', color: '#111827', marginBottom: '0.25rem' }}>
                {t('map_card_title')}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem' }}>
                {t('map_card_subtitle')}
              </div>

              <button
                onClick={handleUseMyLocation}
                style={{
                  width: '100%',
                  backgroundColor: '#0f5132',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '0.6rem 1rem',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 2px 6px rgba(15, 81, 50, 0.25)'
                }}
              >
                <Navigation size={14} />
                <span>{t('btn_use_location')}</span>
              </button>
            </div>

          </div>

          {/* Right Column: List of Eligible Partners (EXACT REPLICA OF SCREENSHOT 2) */}
          <div>
            
            {/* Header: Eligible partners + 3 Found badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.35rem'
            }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827' }}>
                {t('eligible_partners_heading')}
              </h2>
              <span style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#0f5132',
                backgroundColor: '#f0fdf4',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px'
              }}>
                {partners.length} Found
              </span>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>
              {t('based_on_profile')}
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
                <CircularProgress style={{ color: '#0f5132' }} />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {partners.map((partner) => (
                  <div
                    key={partner.partner_id}
                    onClick={() => setActivePartnerDetail(partner)}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e5e7eb',
                      padding: '1.25rem 1.35rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = '#0f5132';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    
                    {/* Left Icon: Two user silhouette inside green-tinted square (as in Screenshot 2) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem' }}>
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        backgroundColor: '#f0fdf4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Users size={24} color="#0f5132" />
                      </div>

                      {/* Center Information */}
                      <div>
                        <div style={{
                          fontWeight: 700,
                          fontSize: '1rem',
                          color: '#111827',
                          marginBottom: '0.25rem'
                        }}>
                          {partner.name}
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          color: '#64748b',
                          fontSize: '0.82rem',
                          marginBottom: '0.2rem'
                        }}>
                          <MapPin size={13} color="#94a3b8" />
                          <span>{partner.district} District</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          {partner.distance_km} km
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Eligible Badge + Chevron > (as in Screenshot 2) */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                      <div style={{ color: '#94a3b8' }}>
                        <ChevronRight size={20} />
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: partner.is_eligible ? '#0f5132' : '#dc2626'
                      }}>
                        {partner.is_eligible ? (
                          <>
                            <CheckCircle2 size={16} color="#0f5132" strokeWidth={2.5} />
                            <span>{t('tag_eligible')}</span>
                          </>
                        ) : (
                          <>
                            <Info size={16} color="#dc2626" />
                            <span>{t('tag_not_eligible')}</span>
                          </>
                        )}
                      </div>

                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#047857',
                        backgroundColor: '#ecfdf5',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px'
                      }}>
                        Score: {partner.total_score}/100
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Partner 6-Factor Score Breakdown & Application Drawer/Modal */}
      <Dialog
        open={Boolean(activePartnerDetail)}
        onClose={() => setActivePartnerDetail(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: { borderRadius: '24px', padding: '1rem' }
        }}
      >
        {activePartnerDetail && (
          <>
            <DialogTitle style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700, textTransform: 'uppercase' }}>
                  {activePartnerDetail.type} • {activePartnerDetail.district}
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f3d24', margin: '4px 0 0 0' }}>
                  {activePartnerDetail.name}
                </h3>
              </div>
              <button
                onClick={() => setActivePartnerDetail(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} color="#64748b" />
              </button>
            </DialogTitle>

            <DialogContent>
              {/* Composite Score Card */}
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 600 }}>
                    {t('partner_score_label')} (Multi-criteria Decision)
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f5132' }}>
                    {activePartnerDetail.total_score} <span style={{ fontSize: '1rem', color: '#64748b' }}>/ 100</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#374151', marginTop: '2px' }}>
                    {activePartnerDetail.why_recommended}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <Chip
                    label={activePartnerDetail.is_eligible ? "✓ Verified & Eligible" : "Scheme Mismatch"}
                    style={{
                      backgroundColor: activePartnerDetail.is_eligible ? '#0f5132' : '#dc2626',
                      color: '#ffffff',
                      fontWeight: 700
                    }}
                  />
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                    {activePartnerDetail.distance_km} km away
                  </div>
                </div>
              </div>

              {/* 6-Factor Breakdown Grid */}
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>
                Algorithmic 6-Factor Scoring Breakdown:
              </h4>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '0.85rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Scheme Compatibility (20%)</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f5132' }}>
                    {activePartnerDetail.score_breakdown.scheme_compatibility.score} / 20 pts
                  </div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Location Proximity (20%)</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f5132' }}>
                    {activePartnerDetail.score_breakdown.location_proximity.score} / 20 pts
                  </div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Fund Liquidity (20%)</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f5132' }}>
                    {activePartnerDetail.score_breakdown.fund_availability.score} / 20 pts (₹{activePartnerDetail.metrics.fund_available_cr} Cr)
                  </div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>NPA Ratio Health (15%)</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f5132' }}>
                    {activePartnerDetail.score_breakdown.npa_health.score} / 15 pts ({activePartnerDetail.metrics.npa_percentage}%)
                  </div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Overdue Recovery Rate (15%)</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f5132' }}>
                    {activePartnerDetail.score_breakdown.overdue_rate.score} / 15 pts ({activePartnerDetail.metrics.overdue_rate}%)
                  </div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Empanelled Authorization (10%)</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f5132' }}>
                    {activePartnerDetail.score_breakdown.authorization.score} / 10 pts
                  </div>
                </div>
              </div>

              {/* Reasons list */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
                  Explainable Evaluation Factors:
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.84rem', color: '#4b5563' }}>
                  {activePartnerDetail.reasons.map((r, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={14} color="#059669" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Branch Contact Details */}
              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', fontSize: '0.85rem', color: '#64748b' }}>
                <div><strong>Address:</strong> {activePartnerDetail.address}</div>
                <div><strong>Phone:</strong> {activePartnerDetail.contact_phone}</div>
                <div><strong>Official Contact:</strong> {activePartnerDetail.contact_email}</div>
              </div>
            </DialogContent>

            <DialogActions style={{ padding: '1rem 1.5rem' }}>
              <Button onClick={() => setActivePartnerDetail(null)} style={{ color: '#64748b', fontWeight: 600 }}>
                Close
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  const p = activePartnerDetail;
                  setActivePartnerDetail(null);
                  handleOpenApply(p);
                }}
                style={{
                  backgroundColor: '#0f5132',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  padding: '0.55rem 1.5rem',
                  textTransform: 'none'
                }}
              >
                Apply via this Partner
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Direct Citizen Application Modal */}
      <Dialog
        open={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: { borderRadius: '24px', padding: '1rem' }
        }}
      >
        <DialogTitle style={{ fontWeight: 800, color: '#0f3d24', fontSize: '1.25rem' }}>
          Submit Citizen Benefits Application
        </DialogTitle>
        <DialogContent>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
            Submit your application directly to <strong>{applyingPartner?.name}</strong>.
            Your profile details will be verified by the partner branch.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <TextField
              label="Citizen Applicant Name"
              value={currentUser?.name || ''}
              fullWidth
              size="small"
              disabled
            />

            <TextField
              label="Occupation & District"
              value={`${currentUser?.occupation} • ${currentUser?.district}, ${currentUser?.state}`}
              fullWidth
              size="small"
              disabled
            />

            <FormControl fullWidth size="small">
              <InputLabel>Selected Government Scheme</InputLabel>
              <Select
                value={selectedSchemeId || (schemes[0] ? schemes[0].id : '')}
                onChange={(e) => setSelectedSchemeId(e.target.value)}
                label="Selected Government Scheme"
              >
                {schemes.map(s => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name} ({s.code}) - {s.subsidy_pct}% Subsidy
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Requested Financial Amount (₹)"
              type="number"
              value={applyForm.requested_amount}
              onChange={(e) => setApplyForm({ ...applyForm, requested_amount: e.target.value })}
              fullWidth
              size="small"
            />

            <TextField
              label="Repayment Tenure (Months)"
              type="number"
              value={applyForm.tenure_months}
              onChange={(e) => setApplyForm({ ...applyForm, tenure_months: e.target.value })}
              fullWidth
              size="small"
            />

            <TextField
              label="Applicant Remarks / Specific Equipment Needed"
              placeholder="e.g. Purchase of 45HP tractor and rotavator machinery"
              multiline
              rows={2}
              value={applyForm.remarks}
              onChange={(e) => setApplyForm({ ...applyForm, remarks: e.target.value })}
              fullWidth
              size="small"
            />
          </div>
        </DialogContent>
        <DialogActions style={{ padding: '1rem 1.5rem' }}>
          <Button onClick={() => setApplyModalOpen(false)} style={{ color: '#64748b', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={submitting}
            onClick={handleSubmitApplication}
            style={{
              backgroundColor: '#0f5132',
              borderRadius: '9999px',
              fontWeight: 700,
              padding: '0.6rem 1.75rem',
              textTransform: 'none'
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
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
          Application submitted successfully! Tracking Reference: <strong>{submittedAppNo}</strong>. Track in "My Applications".
        </Alert>
      </Snackbar>

    </div>
  );
}
