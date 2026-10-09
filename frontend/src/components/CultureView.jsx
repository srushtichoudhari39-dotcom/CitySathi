import React, { useState } from 'react';
import {
  Landmark,
  Volume2,
  VolumeX,
  Play,
  Pause,
  BookOpen,
  Compass,
  CheckCircle,
  AlertCircle,
  Clock,
  MapPin,
  Sparkles
} from 'lucide-react';
import LeafletMap from './LeafletMap';

export default function CultureView({ cultureItems }) {
  const [activeStory, setActiveStory] = useState(cultureItems[0] || null);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [audioProgress, setAudioProgress] = useState(35);

  const toggleAudio = (id) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
      setAudioProgress(15);
    }
  };

  const cultureMapPoints = cultureItems.map((item) => ({
    id: item.id,
    name: item.title,
    category: 'culture',
    sub_category: item.type,
    rating: 4.9,
    safety_score: 9.4,
    lat: item.coordinates.lat,
    lng: item.coordinates.lng,
    image: item.image,
    metro_station: 'Nearby Central Corridor'
  }));

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
          <span className="badge badge-primary">Pillar 2: History & Culture</span>
          <span className="badge badge-info">Living Heritage & Oral Traditions</span>
        </div>
        <h1 style={{ fontSize: '2rem', letterSpacing: '-0.02em', color: '#0f172a' }}>
          Echoes of Empires: Living Traditions & Heritage Lore
        </h1>
        <p style={{ color: '#475569', maxWidth: '800px', fontSize: '0.98rem' }}>
          Delhi is a palimpsest of seven imperial dynasties. Uncover the philosophical recipes of Mughal durbars, the 700-year mystical Sufi harmonies of Amir Khusrau, and regional cultural etiquette for respectful urban navigation.
        </p>
      </div>

      {/* Main Grid: Story Selector & Deep Dive Showcase */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '1.75rem', marginBottom: '2.5rem' }}>
        {/* Left Column: Heritage Chronicles List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={20} color="#4f46e5" />
            <span>Curated Heritage Chapters</span>
          </h3>

          {cultureItems.map((item) => {
            const isSelected = activeStory?.id === item.id;
            const isPlaying = playingAudioId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => setActiveStory(item)}
                className="saathi-card"
                style={{
                  padding: '1.25rem',
                  cursor: 'pointer',
                  borderColor: isSelected ? '#6366f1' : '#e2e8f0',
                  background: isSelected ? '#f8faff' : 'white',
                  borderWidth: isSelected ? '2px' : '1px',
                }}
              >
                <div style={{ display: 'flex', gap: '12px' }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '85px', height: '85px', borderRadius: '10px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span className="badge badge-primary" style={{ fontSize: '10px' }}>
                        {item.era}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAudio(item.id);
                        }}
                        style={{
                          background: isPlaying ? '#4f46e5' : '#f1f5f9',
                          color: isPlaying ? 'white' : '#4f46e5',
                          borderRadius: '50%',
                          width: '30px',
                          height: '30px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title={isPlaying ? 'Pause Audio Guide' : 'Play Audio Lore Snippet'}
                      >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                      </button>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', margin: '4px 0 2px', color: '#0f172a' }}>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.summary}
                    </p>
                  </div>
                </div>

                {/* Simulated Audio Waveform if playing */}
                {isPlaying && (
                  <div
                    style={{
                      marginTop: '0.85rem',
                      padding: '8px 12px',
                      background: '#eef2ff',
                      borderRadius: '8px',
                      border: '1px solid #c7d2fe',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#4338ca', fontWeight: 600, marginBottom: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Volume2 size={13} />
                        Playing: {item.audio_snippet_title}
                      </span>
                      <span>01:14 / 03:20</span>
                    </div>
                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: '4px', background: '#cbd5e1', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ width: `${audioProgress}%`, height: '100%', background: '#4f46e5', transition: 'width 0.3s' }} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Chronicle In-Depth Narrative */}
        {activeStory && (
          <div
            className="saathi-card"
            style={{
              padding: '2rem',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            <div style={{ position: 'relative', height: '240px', borderRadius: '14px', overflow: 'hidden' }}>
              <img
                src={activeStory.image}
                alt={activeStory.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 60%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '1.25rem',
                }}
              >
                <div>
                  <span className="badge badge-warning" style={{ marginBottom: '6px' }}>
                    {activeStory.type.toUpperCase()} • {activeStory.era}
                  </span>
                  <h2 style={{ color: 'white', fontSize: '1.5rem', margin: 0 }}>
                    {activeStory.title}
                  </h2>
                </div>
              </div>
            </div>

            {/* Audio Lore Player Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 18px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: '#4f46e5',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Volume2 size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                    {activeStory.audio_snippet_title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    Curated audio lore with ambient soundscapes (Demo Simulation)
                  </div>
                </div>
              </div>

              <button
                onClick={() => toggleAudio(activeStory.id)}
                className="btn-primary btn-sm"
              >
                {playingAudioId === activeStory.id ? (
                  <>
                    <Pause size={14} /> Pause Lore
                  </>
                ) : (
                  <>
                    <Play size={14} /> Listen Snippet
                  </>
                )}
              </button>
            </div>

            {/* Deep Narrative Text */}
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#1e293b' }}>
                The Historical Saga & Lore
              </h4>
              <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: '1.7' }}>
                {activeStory.story}
              </p>
            </div>

            {/* Key Archaeological & Cultural Highlights */}
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="#f59e0b" />
                <span>Distinct Cultural Pillars</span>
              </h4>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.88rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {activeStory.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>

            {/* Local Etiquette & Traditions Guide */}
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={16} color="#059669" />
                <span>Visitor Etiquette & Local Respect Norms</span>
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {activeStory.etiquette_tips.map((tip, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      color: '#166534',
                    }}
                  >
                    <span>✓</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Heritage Geography Map */}
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={20} color="#8b5cf6" />
          <span>Heritage Corridor Spatial Map</span>
        </h3>
        <LeafletMap places={cultureMapPoints} height="320px" />
      </div>
    </div>
  );
}
