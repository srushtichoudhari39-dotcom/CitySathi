import React, { useState } from 'react';
import {
  Compass,
  Landmark,
  ShieldAlert,
  GitCompare,
  Sparkles,
  Radio,
  PhoneCall,
  AlertTriangle,
  X
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, insightsData }) {
  const [showSosModal, setShowSosModal] = useState(false);

  const tabs = [
    { id: 'explore', label: 'Explore & Stays', icon: Compass },
    { id: 'culture', label: 'History & Culture', icon: Landmark },
    { id: 'safety', label: 'Safety & Security', icon: ShieldAlert },
    { id: 'compare', label: 'Best vs Worst', icon: GitCompare },
    { id: 'smartplan', label: 'SmartPlan + Plan B', icon: Sparkles, highlight: true },
    { id: 'insights', label: 'City Insights', icon: Radio, hasBadge: true },
  ];

  const weather = insightsData?.metrics?.weather;

  return (
    <>
      <header className="nav-tabs-wrapper">
        <div className="nav-tabs-inner">
          {/* Brand */}
          <div className="brand-section" onClick={() => setActiveTab('explore')}>
            <div className="brand-logo-icon">
              <Compass size={24} />
            </div>
            <div>
              <div className="brand-title">CitySaathi</div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                Urban Explorer & Safety Navigator
              </div>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="nav-tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-btn ${isActive ? 'active' : ''}`}
                  style={
                    tab.highlight
                      ? {
                          background: isActive
                            ? 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)'
                            : 'rgba(79, 70, 229, 0.08)',
                          color: isActive ? '#ffffff' : '#4f46e5',
                          fontWeight: 700,
                          border: '1px solid rgba(79, 70, 229, 0.25)',
                        }
                      : {}
                  }
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                  {tab.hasBadge && (
                    <span className="tab-badge" title="Live Citizen Reports">
                      {insightsData?.reports_summary?.pending_review ?? 2} new
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: City Pill + SOS button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            {weather && (
              <div
                style={{
                  display: 'none',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  padding: '4px 10px',
                  borderRadius: '10px',
                  fontSize: '11px',
                }}
                className="desktop-weather-pill"
              >
                <span style={{ fontWeight: 700, color: '#0f172a' }}>
                  {weather.city} • {weather.temperature_celsius}°C
                </span>
                <span style={{ color: weather.rain_alert ? '#d97706' : '#059669', fontWeight: 600 }}>
                  {weather.rain_alert ? '🌧️ Rain Alert Active' : '☀️ Normal Conditions'}
                </span>
              </div>
            )}

            <button
              onClick={() => setShowSosModal(true)}
              className="btn-danger btn-sm"
              style={{ fontWeight: 700, letterSpacing: '0.02em', boxShadow: '0 3px 8px rgba(239, 68, 68, 0.3)' }}
            >
              <PhoneCall size={15} />
              <span>SOS Emergency</span>
            </button>
          </div>
        </div>
      </header>

      {/* Emergency SOS Modal */}
      {showSosModal && (
        <div className="modal-overlay" onClick={() => setShowSosModal(false)}>
          <div className="modal-card" style={{ maxWidth: '480px', padding: '1.5rem' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626' }}>
                <AlertTriangle size={24} />
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#dc2626' }}>Emergency Rapid Helplines</h3>
              </div>
              <button onClick={() => setShowSosModal(false)} style={{ color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '1.25rem' }}>
              Tap any emergency service below for instant assistance or dispatch within Delhi NCR:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <a
                href="tel:112"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: '#991b1b',
                  fontWeight: 700,
                }}
              >
                <span>🚔 National Emergency (Police / Fire / Health)</span>
                <span style={{ fontSize: '1.2rem', color: '#dc2626' }}>112</span>
              </a>

              <a
                href="tel:1091"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: '#fdf2f8',
                  border: '1px solid #fbcfe8',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: '#9d174d',
                  fontWeight: 700,
                }}
              >
                <span>🛡️ Women Safety & Pink Booth Helpline</span>
                <span style={{ fontSize: '1.2rem', color: '#db2777' }}>1091</span>
              </a>

              <a
                href="tel:108"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: '#065f46',
                  fontWeight: 700,
                }}
              >
                <span>🚑 Rapid Ambulance & Trauma Support</span>
                <span style={{ fontSize: '1.2rem', color: '#059669' }}>108</span>
              </a>

              <a
                href="tel:1095"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: '#1e40af',
                  fontWeight: 700,
                }}
              >
                <span>🚦 Traffic Helpline & Road Breakdown</span>
                <span style={{ fontSize: '1.2rem', color: '#2563eb' }}>1095</span>
              </a>
            </div>

            <div
              style={{
                fontSize: '11px',
                color: '#64748b',
                background: '#f8fafc',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              📍 <strong>Nearest 24/7 Monitored Safe Haven:</strong> Connaught Place Pink Booth & AIIMS Trauma Center.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
