import React, { useState } from 'react';
import {
  Sparkles,
  CloudRain,
  SunMedium,
  Clock,
  DollarSign,
  Compass,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Users,
  Copy,
  Printer,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import LeafletMap from './LeafletMap';

export default function SmartPlanView({ onGenerateSmartPlan, planData, isGenerating }) {
  const [budget, setBudget] = useState(1500);
  const [hours, setHours] = useState(6);
  const [selectedInterests, setSelectedInterests] = useState(['Culture', 'Foodie']);
  const [groupType, setGroupType] = useState('Friends');
  const [startingPoint, setStartingPoint] = useState('Connaught Place');
  const [activePlanTab, setActivePlanTab] = useState('primary'); // 'primary' or 'plan_b'
  const [copyFeedback, setCopyFeedback] = useState(false);

  const interestOptions = [
    'Culture',
    'Foodie',
    'Budget Explorer',
    'Chill & Nature',
    'Shopping',
    'Photography'
  ];

  const groupOptions = ['Solo Explorer', 'Couple', 'Friends', 'Family with Kids'];

  const handleInterestToggle = (interest) => {
    if (selectedInterests.includes(interest)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((i) => i !== interest));
      }
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerateSmartPlan({
      budget,
      hours,
      interests: selectedInterests,
      group_type: groupType,
      starting_point: startingPoint,
    });
  };

  const handleCopy = () => {
    if (!planData) return;
    const plan = activePlanTab === 'primary' ? planData.primary_plan : planData.plan_b_contingency;
    const text = `${plan.title}\nTheme: ${plan.theme}\nEstimated Cost: ₹${plan.estimated_total_cost} (Budget: ₹${plan.target_budget})\n\nStops:\n${plan.stops.map((s, idx) => `${idx + 1}. [${s.time_slot}] ${s.name} - ₹${s.estimated_cost}\n   Activity: ${s.activity}\n   Tip: ${s.local_tip}`).join('\n\n')}\n\nTransit Guidance: ${plan.travel_guidance}\nSafety: ${plan.safety_advisory}`;
    navigator.clipboard.writeText(text);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const currentPlan = planData
    ? activePlanTab === 'primary'
      ? planData.primary_plan
      : planData.plan_b_contingency
    : null;

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
          <span className="badge badge-primary">Unique Innovation</span>
          <span className="badge badge-warning">Simulated Urban Intelligence Engine</span>
        </div>
        <h1 style={{ fontSize: '2rem', letterSpacing: '-0.02em', color: '#0f172a' }}>
          SmartPlan + Plan B: Disruption-Proof City Outing
        </h1>
        <p style={{ color: '#475569', maxWidth: '840px', fontSize: '0.98rem' }}>
          Cities are unpredictable—sudden monsoon downpours, waterlogged underpasses, or extreme heat waves can derail any plan. SmartPlan crafts your ideal curated day out, and automatically generates an instant <strong>Plan B</strong> contingency with sheltered indoor heritage venues and rapid transit.
        </p>
        <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', marginTop: '4px' }}>
          ⚠️ Notice: Itineraries, timings, and prices are demo & simulated projections. Real-world transit and weather conditions may vary.
        </div>
      </div>

      {/* Input Form Card */}
      <div
        className="saathi-card"
        style={{
          padding: '1.75rem',
          marginBottom: '2rem',
          background: 'white',
        }}
      >
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="#4f46e5" />
          <span>Tailor Your Outing Preferences</span>
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Top Row: Budget, Available Time, Group Type, Starting Point */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem' }}>
            {/* Budget */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                Total Target Budget:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <input
                  type="range"
                  min={300}
                  max={6000}
                  step={100}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  style={{ flex: 1, accentColor: '#4f46e5' }}
                />
                <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', minWidth: '65px' }}>
                  ₹{budget}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>For meals, entry & local transit</div>
            </div>

            {/* Time */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                Available Window:
              </label>
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                {[2, 4, 6, 8].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setHours(h)}
                    className={`btn-sm ${hours === h ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1, padding: '8px 4px', fontWeight: 700 }}
                  >
                    {h}h
                  </button>
                ))}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                {hours <= 3 ? 'Quick Blitz (2 stops)' : hours <= 6 ? 'Half-Day Trail (3 stops)' : 'Full Day Odyssey (4 stops)'}
              </div>
            </div>

            {/* Group Type */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                Travel Dynamics:
              </label>
              <select
                value={groupType}
                onChange={(e) => setGroupType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  marginTop: '6px',
                  fontWeight: 600,
                }}
              >
                {groupOptions.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Starting Point */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                Starting Hub:
              </label>
              <input
                type="text"
                value={startingPoint}
                onChange={(e) => setStartingPoint(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  marginTop: '6px',
                  fontWeight: 600,
                }}
                placeholder="e.g. Connaught Place"
              />
            </div>
          </div>

          {/* Interests Pills */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
              Select Core Interests:
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {interestOptions.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ borderRadius: '999px', padding: '6px 14px' }}
                  >
                    {isSelected ? '✓ ' : '+ '} {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
            <button
              type="submit"
              disabled={isGenerating}
              className="btn-primary"
              style={{ padding: '0.75rem 2rem', fontWeight: 700, fontSize: '0.95rem' }}
            >
              {isGenerating ? 'Synthesizing Dual Plans...' : 'Generate SmartPlan + Plan B'}
            </button>
          </div>
        </form>
      </div>

      {/* Itinerary Results Section */}
      {planData && currentPlan && (
        <div style={{ marginBottom: '2.5rem' }}>
          {/* Plan Switcher Tabs (Primary vs Plan B) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setActivePlanTab('primary')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: activePlanTab === 'primary' ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                  background: activePlanTab === 'primary' ? '#eef2ff' : 'white',
                  color: activePlanTab === 'primary' ? '#4f46e5' : '#64748b',
                }}
              >
                <SunMedium size={18} color={activePlanTab === 'primary' ? '#4f46e5' : '#64748b'} />
                <span>Primary SmartPlan (Recommended)</span>
              </button>

              <button
                onClick={() => setActivePlanTab('plan_b')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: activePlanTab === 'plan_b' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                  background: activePlanTab === 'plan_b' ? '#f0f9ff' : 'white',
                  color: activePlanTab === 'plan_b' ? '#0284c7' : '#64748b',
                }}
              >
                <CloudRain size={18} color={activePlanTab === 'plan_b' ? '#0284c7' : '#64748b'} />
                <span>Plan B: Weather & Rain Contingency</span>
              </button>
            </div>

            {/* Quick Actions: Copy / Print */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleCopy}
                className="btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Copy size={14} />
                <span>{copyFeedback ? 'Copied to Clipboard!' : 'Copy Itinerary'}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Printer size={14} />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Contingency Notification Callout */}
          {activePlanTab === 'plan_b' && (
            <div
              style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '14px',
                padding: '1rem 1.25rem',
                marginBottom: '1.25rem',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
              }}
            >
              <CloudRain size={24} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#1e40af', fontSize: '0.95rem' }}>
                  Why Plan B is activated for disruptions:
                </strong>
                <p style={{ color: '#1e3a8a', fontSize: '0.88rem', margin: '4px 0 0', lineHeight: '1.5' }}>
                  {planData.contingency_reason}
                </p>
              </div>
            </div>
          )}

          {/* Plan Header Card */}
          <div
            className="saathi-card"
            style={{
              padding: '1.75rem',
              marginBottom: '1.5rem',
              background: 'white',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <span className={`badge ${activePlanTab === 'primary' ? 'badge-primary' : 'badge-info'}`}>
                  {activePlanTab === 'primary' ? 'Standard Urban Expedition' : 'Disruption Contingency Mode'}
                </span>
                <h2 style={{ fontSize: '1.5rem', margin: '6px 0 2px', color: '#0f172a' }}>
                  {currentPlan.title}
                </h2>
                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                  Theme: <strong>{currentPlan.theme}</strong>
                </div>
              </div>

              {/* Budget Badge */}
              <div style={{ textAlign: 'right', background: '#f8fafc', padding: '10px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Projected Outing Spend:</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669' }}>
                  ₹{currentPlan.estimated_total_cost}
                </div>
                <div style={{ fontSize: '11px', color: '#475569' }}>Target Budget: ₹{currentPlan.target_budget}</div>
              </div>
            </div>

            {/* Guidance Pills */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '1.25rem' }}>
              <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', color: '#334155', border: '1px solid #e2e8f0' }}>
                <strong>🚇 Transit Advisory:</strong> {currentPlan.travel_guidance}
              </div>
              <div style={{ background: '#f0fdf4', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', color: '#166534', border: '1px solid #bbf7d0' }}>
                <strong>🛡️ Safety Advice:</strong> {currentPlan.safety_advisory}
              </div>
            </div>
          </div>

          {/* Stops Timeline and Map in Split View */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.75rem' }}>
            {/* Timeline Stops */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} color="#4f46e5" />
                <span>Scheduled Sequence of Stops ({currentPlan.stops.length})</span>
              </h3>

              {currentPlan.stops.map((stop, idx) => (
                <div
                  key={idx}
                  className="saathi-card"
                  style={{
                    padding: '1.25rem',
                    borderLeft: `4px solid ${stop.is_indoor ? '#0ea5e9' : '#4f46e5'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: stop.is_indoor ? '#0ea5e9' : '#4f46e5',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 800,
                        }}
                      >
                        {idx + 1}
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4f46e5' }}>
                        {stop.time_slot}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {stop.is_indoor && (
                        <span className="badge badge-success" style={{ fontSize: '10px' }}>
                          🌧️ 100% Covered
                        </span>
                      )}
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                        ₹{stop.estimated_cost}
                      </span>
                    </div>
                  </div>

                  <h4 style={{ fontSize: '1.15rem', color: '#0f172a', margin: '2px 0' }}>
                    {stop.name}
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0 }}>
                    {stop.activity}
                  </p>

                  <div style={{ fontSize: '11px', color: '#0284c7', background: '#f0f9ff', padding: '6px 10px', borderRadius: '6px', marginTop: '4px' }}>
                    <strong>💡 Insider Tip:</strong> {stop.local_tip}
                  </div>
                </div>
              ))}
            </div>

            {/* Leaflet Map for Itinerary Route */}
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} color="#4f46e5" />
                <span>Itinerary Spatial Route</span>
              </h3>
              <LeafletMap itineraryStops={currentPlan.stops} height="480px" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
