import React, { useState } from 'react';
import {
  Radio,
  CloudRain,
  Wind,
  Thermometer,
  Gauge,
  AlertTriangle,
  CheckCircle,
  ThumbsUp,
  ShieldCheck,
  PlusCircle,
  MapPin,
  Car,
  Volume2,
  Clock,
  Eye,
  Filter
} from 'lucide-react';
import LeafletMap from './LeafletMap';
import ReportModal from './ReportModal';

export default function InsightsView({
  insightsData,
  reports,
  onUpvoteReport,
  onVerifyReport,
  onSubmitReport
}) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState(null);

  const weather = insightsData?.metrics?.weather;
  const traffic = insightsData?.metrics?.traffic;

  const filteredReports = reports.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const toggleVoiceNote = (id) => {
    if (playingVoiceId === id) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(id);
    }
  };

  return (
    <div>
      {/* Header Banner */}
      <div
        className="glass-banner"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-primary">Pillar 5: Smart City Insights</span>
          <span className="badge badge-warning">Simulated Urban Telemetry Stream</span>
        </div>
        <h1 style={{ fontSize: '2rem', letterSpacing: '-0.02em', color: '#0f172a' }}>
          Civic Pulse: Traffic, Atmospheric Alerts & Citizen Reports
        </h1>
        <p style={{ color: '#475569', maxWidth: '850px', fontSize: '0.98rem' }}>
          A crowd-powered civic radar for urban hazards. Monitor atmospheric quality indices, bottleneck choke-points, and citizen dispatches complete with photographic and voice note evidence.
        </p>
        <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>
          📡 Note: Sensor telemetries and incident dispatches represent demo & simulated streams calibrated for hackathon validation.
        </div>
      </div>

      {/* Weather & Traffic Telemetry Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Weather Card */}
        {weather && (
          <div
            className="saathi-card"
            style={{
              padding: '1.5rem',
              background: 'white',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
                  <CloudRain size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', margin: 0, color: '#0f172a' }}>Atmospheric Telemetry</h3>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{weather.data_source_label}</div>
                </div>
              </div>
              <span className="badge badge-info">{weather.city}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a' }}>
                {weather.temperature_celsius}°C
              </span>
              <span style={{ color: '#475569', fontSize: '0.95rem', fontWeight: 600 }}>
                {weather.condition}
              </span>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center', background: '#f8fafc', padding: '10px', borderRadius: '10px' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>AIR QUALITY (AQI)</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#d97706' }}>{weather.aqi}</div>
                <div style={{ fontSize: '9px', color: '#9a3412' }}>Moderate</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>RAIN CHANCE</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0284c7' }}>{weather.precipitation_probability}%</div>
                <div style={{ fontSize: '9px', color: '#0369a1' }}>Scattered</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>HUMIDITY</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#059669' }}>{weather.humidity_percent}%</div>
                <div style={{ fontSize: '9px', color: '#047857' }}>Wind: {weather.wind_kmh}km/h</div>
              </div>
            </div>

            {/* Weather Alert */}
            {weather.rain_alert && (
              <div
                style={{
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  color: '#92400e',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'flex-start',
                }}
              >
                <AlertTriangle size={16} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{weather.alert_message}</span>
              </div>
            )}
          </div>
        )}

        {/* Traffic Card */}
        {traffic && (
          <div
            className="saathi-card"
            style={{
              padding: '1.5rem',
              background: 'white',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
                  <Car size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', margin: 0, color: '#0f172a' }}>Mobility & Gridlock Index</h3>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{traffic.data_source_label}</div>
                </div>
              </div>
              <span className="badge badge-danger">{traffic.congestion_index}% Congestion</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#dc2626' }}>
                {traffic.status}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Avg Speed: <strong>{traffic.average_speed_kmh} km/h</strong>
              </span>
            </div>

            {/* Bottlenecks List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                Active Choke Points:
              </div>
              {traffic.bottlenecks.map((b, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#f8fafc',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <span style={{ fontWeight: 600, color: '#334155' }}>{b.road}</span>
                  <span style={{ color: '#dc2626', fontWeight: 800 }}>+{b.delay_mins}m</span>
                </div>
              ))}
            </div>

            {/* Metro Rail Status */}
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '8px 12px', borderRadius: '8px', fontSize: '0.82rem', color: '#065f46', fontWeight: 600 }}>
              🚆 {traffic.metro_status}
            </div>
          </div>
        )}
      </div>

      {/* Citizen Incident Reports Feed Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Radio size={22} color="#4f46e5" />
              <span>Community Hazard & Incident Dispatches</span>
              <span className="badge badge-primary">{filteredReports.length}</span>
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '2px 0 0' }}>
              Crowd-verified reports with review statuses: <strong>Pending Review</strong> vs <strong>Verified</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '10px' }}>
              {['all', 'Pending Review', 'Verified'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`btn-sm ${statusFilter.toLowerCase() === status.toLowerCase() ? 'btn-primary' : ''}`}
                  style={{ borderRadius: '8px', fontSize: '11px', padding: '4px 10px' }}
                >
                  {status === 'all' ? 'All' : status}
                </button>
              ))}
            </div>

            {/* File Report CTA Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary"
              style={{ padding: '0.55rem 1.1rem', fontSize: '0.88rem', fontWeight: 700 }}
            >
              <PlusCircle size={16} />
              <span>+ File Citizen Report</span>
            </button>
          </div>
        </div>

        {/* Reports Feed Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {filteredReports.map((report) => {
            const isVerified = report.status === 'Verified';
            const isVoicePlaying = playingVoiceId === report.id;

            return (
              <div
                key={report.id}
                className="saathi-card"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  borderTop: `4px solid ${isVerified ? '#10b981' : '#f59e0b'}`,
                }}
              >
                {/* Header: Category + Status Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="badge badge-primary" style={{ fontSize: '10px' }}>
                    {report.category}
                  </span>

                  <span
                    className={`badge ${isVerified ? 'badge-success' : 'badge-warning'}`}
                    style={{ fontSize: '11px', fontWeight: 800 }}
                  >
                    {isVerified ? '✓ Verified' : '⏳ Pending Review'}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.1rem', margin: 0, color: '#0f172a' }}>
                  {report.title}
                </h4>

                <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} color="#64748b" />
                  <span>{report.location_name}</span>
                  <span>•</span>
                  <span>{report.timestamp}</span>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: '1.5', margin: 0 }}>
                  {report.description}
                </p>

                {/* Photo preview if present */}
                {report.has_photo && report.photo_url && (
                  <div style={{ height: '140px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <img
                      src={report.photo_url}
                      alt={report.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Voice Note Player if present */}
                {report.has_voice_note && (
                  <div
                    style={{
                      background: '#f0f9ff',
                      border: '1px solid #bae6fd',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#0369a1', fontWeight: 600 }}>
                      <Volume2 size={15} />
                      <span>Citizen Audio Dispatch ({report.voice_note_duration || '0:18'})</span>
                    </div>
                    <button
                      onClick={() => toggleVoiceNote(report.id)}
                      className="btn-sm"
                      style={{
                        background: isVoicePlaying ? '#0284c7' : 'white',
                        color: isVoicePlaying ? 'white' : '#0284c7',
                        border: '1px solid #0284c7',
                        padding: '2px 8px',
                        fontSize: '11px',
                        fontWeight: 700,
                      }}
                    >
                      {isVoicePlaying ? 'Pause Audio' : 'Play Note'}
                    </button>
                  </div>
                )}

                {/* Verification badge info */}
                {isVerified && report.verified_by && (
                  <div style={{ fontSize: '11px', color: '#047857', background: '#ecfdf5', padding: '4px 8px', borderRadius: '6px' }}>
                    <strong>Verified by:</strong> {report.verified_by}
                  </div>
                )}

                {/* Action buttons: Upvote & Verify Marshall Toggle */}
                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <button
                    onClick={() => onUpvoteReport(report.id)}
                    className="btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    title="Confirm incident existence"
                  >
                    <ThumbsUp size={13} color="#059669" />
                    <span>Confirm / Upvote ({report.upvotes})</span>
                  </button>

                  {!isVerified && (
                    <button
                      onClick={() => onVerifyReport(report.id)}
                      className="btn-sm"
                      style={{
                        background: '#ecfdf5',
                        color: '#059669',
                        border: '1px solid #a7f3d0',
                        fontWeight: 700,
                        fontSize: '11px',
                        padding: '4px 10px',
                      }}
                      title="Simulate Community Safety Marshall verification"
                    >
                      Verify as Marshall
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Citizen Reports Leaflet Map */}
      <div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={20} color="#ea580c" />
          <span>Spatial Hazard Pins</span>
        </h3>
        <LeafletMap citizenReports={filteredReports} height="360px" />
      </div>

      {/* Submission Modal */}
      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitReport={onSubmitReport}
      />
    </div>
  );
}
