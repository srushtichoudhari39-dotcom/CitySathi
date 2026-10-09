import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Navigation,
  CheckCircle2,
  PhoneCall,
  Clock,
  Compass,
  ArrowRight,
  MapPin,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import LeafletMap from './LeafletMap';

export default function SafetyView({ safetyZones, onComputeRoute, routeResult }) {
  const [zoneFilter, setZoneFilter] = useState('all');
  const [origin, setOrigin] = useState('Hauz Khas Village');
  const [destination, setDestination] = useState('Rajiv Chowk / Connaught Place');
  const [timeOfTravel, setTimeOfTravel] = useState('Night (10:00 PM)');
  const [isCalculating, setIsCalculating] = useState(false);

  const filteredZones = safetyZones.filter((z) => {
    if (zoneFilter === 'all') return true;
    return z.type === zoneFilter;
  });

  const handleRouteSearch = async (e) => {
    e.preventDefault();
    setIsCalculating(true);
    try {
      await onComputeRoute({ origin, destination, time_of_travel: timeOfTravel });
    } finally {
      setIsCalculating(false);
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
          <span className="badge badge-danger">Pillar 3: Safety & Security</span>
          <span className="badge badge-success">AI Safer-Route & Safe Haven Radar</span>
        </div>
        <h1 style={{ fontSize: '2rem', letterSpacing: '-0.02em', color: '#0f172a' }}>
          Real-Time Risk Zones, Accident Blackspots & SafePath
        </h1>
        <p style={{ color: '#475569', maxWidth: '800px', fontSize: '0.98rem' }}>
          Navigate high-density urban chaos without fear. Explore geo-fenced caution corridors, blackspots verified by traffic authorities, 24/7 monitored safe hubs, and our proprietary <strong>Saathi SafePath</strong> engine for after-dark transit.
        </p>
      </div>

      {/* Two Column Layout: Safer Route Finder (Left) & Risk Zone Feed (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.75rem', marginBottom: '2.5rem' }}>
        {/* Safer-Route Finder Card */}
        <div
          className="saathi-card"
          style={{
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
              <Navigation size={20} color="#4f46e5" />
              <span>Saathi SafePath Route Evaluator</span>
            </h3>
            <span className="badge badge-primary">Night Transit Shield</span>
          </div>

          <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
            Compare standard shortest driving cuts against well-lit, CCTV-covered arterial police corridors.
          </p>

          <form onSubmit={handleRouteSearch} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                Origin Starting Point:
              </label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  marginTop: '4px',
                  fontWeight: 600,
                }}
                placeholder="e.g. Hauz Khas Village"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                Destination:
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  marginTop: '4px',
                  fontWeight: 600,
                }}
                placeholder="e.g. Rajiv Chowk / Connaught Place"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  Departure Window:
                </label>
                <select
                  value={timeOfTravel}
                  onChange={(e) => setTimeOfTravel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    marginTop: '4px',
                    fontWeight: 600,
                  }}
                >
                  <option value="Night (10:00 PM)">Night (10:00 PM - 02:00 AM)</option>
                  <option value="Late Evening (08:00 PM)">Evening (08:00 PM)</option>
                  <option value="Daytime (02:00 PM)">Daytime (02:00 PM)</option>
                  <option value="Early Morning (05:00 AM)">Early Dawn (05:00 AM)</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  type="submit"
                  disabled={isCalculating}
                  className="btn-primary"
                  style={{ width: '100%', height: '44px', fontWeight: 700 }}
                >
                  {isCalculating ? 'Auditing Corridors...' : 'Compare Safe Routes'}
                </button>
              </div>
            </div>
          </form>

          {/* Route Comparison Output */}
          {routeResult && (
            <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #86efac',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  color: '#15803d',
                }}
              >
                💡 <strong>Safety Advisory:</strong> {routeResult.recommendation}
              </div>

              {/* Side by side route plans */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {/* Fastest Route Card */}
                <div
                  style={{
                    border: '1px solid #fed7aa',
                    background: '#fffaf0',
                    borderRadius: '12px',
                    padding: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#c2410c' }}>FASTEST ROUTE</span>
                    <span style={{ fontSize: '11px', background: '#fed7aa', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, color: '#9a3412' }}>
                      Safety: {routeResult.fastest_route.safety_score}/10
                    </span>
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                    {routeResult.fastest_route.estimated_mins} mins • {routeResult.fastest_route.distance_km} km
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                    CCTV: {routeResult.fastest_route.cctv_coverage} | Lit: {routeResult.fastest_route.lighting_coverage}
                  </div>

                  <div style={{ marginTop: '8px', borderTop: '1px dashed #fed7aa', paddingTop: '8px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#991b1b', marginBottom: '4px' }}>
                      ⚠️ Caution Flags:
                    </div>
                    <ul style={{ paddingLeft: '14px', fontSize: '10px', color: '#7c2d12', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {routeResult.fastest_route.caution_points.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Saathi SafePath Card */}
                <div
                  style={{
                    border: '2px solid #10b981',
                    background: '#ecfdf5',
                    borderRadius: '12px',
                    padding: '1rem',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#047857' }}>RECOMMENDED SAFEPATH</span>
                    <span style={{ fontSize: '11px', background: '#10b981', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                      Safety: {routeResult.safer_route.safety_score}/10
                    </span>
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#064e3b' }}>
                    {routeResult.safer_route.estimated_mins} mins • {routeResult.safer_route.distance_km} km
                  </div>
                  <div style={{ fontSize: '11px', color: '#047857', marginTop: '4px' }}>
                    CCTV: {routeResult.safer_route.cctv_coverage} | Lit: {routeResult.safer_route.lighting_coverage}
                  </div>

                  <div style={{ marginTop: '8px', borderTop: '1px dashed #a7f3d0', paddingTop: '8px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#065f46', marginBottom: '4px' }}>
                      🛡️ Safety Perks:
                    </div>
                    <ul style={{ paddingLeft: '14px', fontSize: '10px', color: '#047857', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {routeResult.safer_route.safety_perks.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Geo-Fenced Zones & Safe Hubs List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={20} color="#ea580c" />
              <span>Monitored Safety Zones ({filteredZones.length})</span>
            </h3>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Zones' },
              { id: 'caution_zone', label: '🚨 Caution Areas' },
              { id: 'accident_blackspot', label: '⚠️ Accident Blackspots' },
              { id: 'safe_hub', label: '🛡️ Safe Havens' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setZoneFilter(f.id)}
                className={`btn-sm ${zoneFilter === f.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: '999px', fontSize: '11px' }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '520px', overflowY: 'auto' }}>
            {filteredZones.map((z) => {
              const isSafe = z.type === 'safe_hub';
              const isBlackspot = z.type === 'accident_blackspot';
              const cardBg = isSafe ? '#f0fdf4' : isBlackspot ? '#fef2f2' : '#fff7ed';
              const borderColor = isSafe ? '#bbf7d0' : isBlackspot ? '#fecaca' : '#fed7aa';

              return (
                <div
                  key={z.id}
                  style={{
                    background: cardBg,
                    border: `1px solid ${borderColor}`,
                    borderRadius: '12px',
                    padding: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: '2px 8px',
                        borderRadius: '99px',
                        background: isSafe ? '#10b981' : isBlackspot ? '#dc2626' : '#ea580c',
                        color: 'white',
                      }}
                    >
                      {z.severity}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      Radius: {z.radius_meters}m
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1rem', margin: '4px 0', color: '#0f172a' }}>
                    {z.name}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '6px' }}>
                    {z.description}
                  </p>

                  <div style={{ fontSize: '11px', color: isSafe ? '#065f46' : '#991b1b', background: 'rgba(255,255,255,0.7)', padding: '6px 8px', borderRadius: '6px', marginBottom: '6px' }}>
                    <strong>Advisory:</strong> {z.advisory}
                  </div>

                  {z.emergency_contact && (
                    <div style={{ fontSize: '11px', color: '#b91c1c', fontWeight: 600 }}>
                      📞 {z.emergency_contact}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Safety Map with Zones & Route */}
      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={20} color="#dc2626" />
            <span>Live Spatial Safety Radar</span>
          </h3>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Translucent circles indicate caution buffers; Green circles represent round-the-clock safe havens.
          </span>
        </div>
        <LeafletMap safetyZones={filteredZones} routeData={routeResult} height="420px" />
      </div>
    </div>
  );
}
