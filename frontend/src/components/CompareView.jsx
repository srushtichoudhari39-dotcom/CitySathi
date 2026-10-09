import React, { useState } from 'react';
import {
  GitCompare,
  Trophy,
  ShieldCheck,
  Sparkles,
  DollarSign,
  Star,
  Train,
  CheckCircle,
  AlertCircle,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function CompareView({ places, presets, onCustomCompare, customComparisonResult }) {
  const [selectedPlace1Id, setSelectedPlace1Id] = useState(places[3]?.id || places[0]?.id || '');
  const [selectedPlace2Id, setSelectedPlace2Id] = useState(places[4]?.id || places[1]?.id || '');
  const [activePreset, setActivePreset] = useState(presets[0] || null);
  const [isComparing, setIsComparing] = useState(false);

  const handleRunComparison = async () => {
    if (!selectedPlace1Id || !selectedPlace2Id) return;
    setIsComparing(true);
    try {
      await onCustomCompare(selectedPlace1Id, selectedPlace2Id);
      setActivePreset(null); // Show custom result
    } finally {
      setIsComparing(false);
    }
  };

  // Determine which comparison to display (Custom result or selected preset)
  const displayComparison = customComparisonResult || activePreset;

  const p1 = displayComparison?.place1;
  const p2 = displayComparison?.place2;

  const renderScoreBar = (label, val1, val2, max = 10, unit = '') => {
    const isP1Better = val1 >= val2;
    return (
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
          <span style={{ color: isP1Better ? '#059669' : '#64748b' }}>
            {val1}{unit} {isP1Better ? '★' : ''}
          </span>
          <span style={{ color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
          <span style={{ color: !isP1Better ? '#059669' : '#64748b' }}>
            {!isP1Better ? '★' : ''} {val2}{unit}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {/* P1 bar (fills right to left) */}
          <div style={{ background: '#f1f5f9', height: '10px', borderRadius: '99px', overflow: 'hidden', display: 'flex', justifyContent: 'flex-end' }}>
            <div
              style={{
                width: `${(val1 / max) * 100}%`,
                background: isP1Better ? '#10b981' : '#94a3b8',
                borderRadius: '99px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
          {/* P2 bar (fills left to right) */}
          <div style={{ background: '#f1f5f9', height: '10px', borderRadius: '99px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${(val2 / max) * 100}%`,
                background: !isP1Better ? '#10b981' : '#94a3b8',
                borderRadius: '99px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>
      </div>
    );
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
          <span className="badge badge-primary">Pillar 4: Best vs. Worst Places</span>
          <span className="badge badge-warning">Side-by-Side Urban Matrix</span>
        </div>
        <h1 style={{ fontSize: '2rem', letterSpacing: '-0.02em', color: '#0f172a' }}>
          Head-to-Head: Safety, Cleanliness & Affordability
        </h1>
        <p style={{ color: '#475569', maxWidth: '800px', fontSize: '0.98rem' }}>
          Is the hype worth the chaos? Compare contrasting city hotspots across 5 authoritative dimensions: <strong>Safety</strong>, <strong>Cleanliness</strong>, <strong>Budget/Affordability</strong>, <strong>Public Ratings</strong>, and <strong>Transit Accessibility</strong>.
        </p>
      </div>

      {/* Preset Battle Cards Tabs */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.6rem', color: '#1e293b' }}>
          Signature Urban Matchups:
        </h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {presets.map((preset) => {
            const isSelected = activePreset?.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  setActivePreset(preset);
                  setSelectedPlace1Id(preset.place1_id);
                  setSelectedPlace2Id(preset.place2_id);
                }}
                className={`btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  padding: '0.6rem 1rem',
                  fontSize: '0.85rem',
                  borderRadius: '12px',
                }}
              >
                ⚔️ {preset.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Pair Selector Box */}
      <div
        className="saathi-card"
        style={{
          padding: '1.25rem 1.75rem',
          marginBottom: '2rem',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: 1, minWidth: '220px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            First Place:
          </label>
          <select
            value={selectedPlace1Id}
            onChange={(e) => setSelectedPlace1Id(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              marginTop: '4px',
              fontWeight: 600,
            }}
          >
            {places.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sub_category})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '16px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: '#4f46e5',
            }}
          >
            VS
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '220px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Second Place:
          </label>
          <select
            value={selectedPlace2Id}
            onChange={(e) => setSelectedPlace2Id(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              marginTop: '4px',
              fontWeight: 600,
            }}
          >
            {places.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sub_category})
              </option>
            ))}
          </select>
        </div>

        <div style={{ paddingTop: '16px' }}>
          <button
            onClick={handleRunComparison}
            disabled={isComparing || selectedPlace1Id === selectedPlace2Id}
            className="btn-primary"
            style={{ height: '42px', fontWeight: 700 }}
          >
            {isComparing ? 'Computing Matrix...' : 'Compare Places'}
          </button>
        </div>
      </div>

      {/* Comparison Scorecard Showdown */}
      {p1 && p2 && (
        <div
          className="saathi-card"
          style={{
            padding: '2rem',
            marginBottom: '2rem',
            background: 'white',
          }}
        >
          {/* Header Row: 2 Places Side-by-Side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem', alignItems: 'center' }}>
            {/* Place 1 Header */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <img
                src={p1.image}
                alt={p1.name}
                style={{ width: '90px', height: '90px', borderRadius: '12px', objectFit: 'cover' }}
              />
              <div>
                <span className="badge badge-primary">{p1.sub_category}</span>
                <h3 style={{ fontSize: '1.3rem', margin: '4px 0 2px', color: '#0f172a' }}>{p1.name}</h3>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Spend for two: ₹{p1.cost_for_two}</div>
              </div>
            </div>

            {/* Place 2 Header */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'flex-end', textAlign: 'right' }}>
              <div>
                <span className="badge badge-info">{p2.sub_category}</span>
                <h3 style={{ fontSize: '1.3rem', margin: '4px 0 2px', color: '#0f172a' }}>{p2.name}</h3>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Spend for two: ₹{p2.cost_for_two}</div>
              </div>
              <img
                src={p2.image}
                alt={p2.name}
                style={{ width: '90px', height: '90px', borderRadius: '12px', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* 5 Core Metric Comparison Bars */}
          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
            <h4 style={{ textAlign: 'center', fontSize: '0.95rem', color: '#0f172a', marginBottom: '1.25rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Five-Pillar Benchmark
            </h4>

            {renderScoreBar('1. Safety Index', p1.safety_score, p2.safety_score, 10, '/10')}
            {renderScoreBar('2. Civic Cleanliness', p1.cleanliness_score, p2.cleanliness_score, 10, '/10')}
            {renderScoreBar('3. Budget & Affordability', p1.affordability_score, p2.affordability_score, 10, '/10')}
            {renderScoreBar('4. Public Reviews', p1.rating, p2.rating, 5, '★')}
            {renderScoreBar('5. Metro Accessibility', p1.accessibility_score, p2.accessibility_score, 10, '/10')}
          </div>

          {/* Verdict Box */}
          <div
            style={{
              background: '#f0fdf4',
              border: '2px solid #86efac',
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: '#10b981',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Trophy size={22} />
            </div>

            <div>
              <h4 style={{ color: '#166534', fontSize: '1.15rem', marginBottom: '0.35rem' }}>
                Algorithmic Verdict & CitySaathi Recommendation
              </h4>
              <p style={{ color: '#15803d', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
                {displayComparison.overall_recommendation || displayComparison.verdict}
              </p>

              {/* Categorical Breakdown */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '8px',
                  marginTop: '1rem',
                  fontSize: '0.8rem',
                }}
              >
                <div style={{ background: 'white', padding: '6px 10px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                  <strong>🛡️ Safer:</strong> {displayComparison.winner_safety}
                </div>
                <div style={{ background: 'white', padding: '6px 10px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                  <strong>✨ Cleaner:</strong> {displayComparison.winner_cleanliness}
                </div>
                <div style={{ background: 'white', padding: '6px 10px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                  <strong>💰 More Affordable:</strong> {displayComparison.winner_affordability}
                </div>
                <div style={{ background: 'white', padding: '6px 10px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                  <strong>🚇 Better Transit:</strong> {displayComparison.winner_transit}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
