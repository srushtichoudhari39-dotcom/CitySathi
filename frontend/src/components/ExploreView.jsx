import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Star,
  MapPin,
  ShieldCheck,
  Sparkles,
  Train,
  Clock,
  X,
  ExternalLink,
  DollarSign,
  Info
} from 'lucide-react';
import LeafletMap from './LeafletMap';

export default function ExploreView({ places, onSelectForCompare, onOpenSmartPlanWithPlace }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxBudget, setMaxBudget] = useState(20000);
  const [minRating, setMinRating] = useState(0);
  const [onlyIndoor, setOnlyIndoor] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const categories = [
    { id: 'all', label: 'All Highlights' },
    { id: 'sight', label: 'Monuments & Sights' },
    { id: 'food', label: 'Street Food & Dining' },
    { id: 'hotel', label: 'Hotels & Backpacker Stays' },
    { id: 'budget', label: 'Budget Gems & Bazaars' },
    { id: 'culture', label: 'Art & Museums' },
  ];

  const filteredPlaces = useMemo(() => {
    return places.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchTag = p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchTag) return false;
      }
      // Budget filter
      if (p.cost_for_two > maxBudget) return false;
      // Rating filter
      if (p.rating < minRating) return false;
      // Indoor filter
      if (onlyIndoor && !p.indoor_friendly) return false;

      return true;
    });
  }, [places, selectedCategory, searchQuery, maxBudget, minRating, onlyIndoor]);

  return (
    <div>
      {/* Hero Banner */}
      <div
        className="glass-banner"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-primary">Pillar 1: Exploration & Hospitality</span>
          <span className="badge badge-success">Delhi NCR Edition</span>
        </div>
        <h1 style={{ fontSize: '2rem', letterSpacing: '-0.02em', color: '#0f172a' }}>
          Discover Monuments, Street Flavors & Stays
        </h1>
        <p style={{ color: '#475569', maxWidth: '800px', fontSize: '0.98rem' }}>
          Search vetted historic landmarks, century-old culinary alleys, secure boutique hotels, and budget-friendly cultural sanctuaries. Each spot is tagged with safety ratings and nearest metro links.
        </p>

        {/* Search & Filter Controls */}
        <div
          style={{
            marginTop: '1rem',
            background: 'white',
            borderRadius: '16px',
            padding: '1.25rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {/* Search Input Row */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div
              style={{
                flex: 1,
                minWidth: '260px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '0.6rem 1rem',
              }}
            >
              <Search size={18} color="#64748b" />
              <input
                type="text"
                placeholder="Search by name, street food, monument or tags (e.g. Biryani, Paranthas, UNESCO)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  width: '100%',
                  fontSize: '0.95rem',
                }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ color: '#94a3b8' }}>
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Price Filter */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '0.6rem 1rem',
                fontSize: '0.9rem',
              }}
            >
              <span style={{ color: '#64748b', fontWeight: 600 }}>Max Spend (2 people):</span>
              <select
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                style={{ border: 'none', background: 'transparent', fontWeight: 700, outline: 'none' }}
              >
                <option value={20000}>Any Budget</option>
                <option value={500}>Under ₹500 (Budget)</option>
                <option value={1500}>Under ₹1,500 (Mid-Range)</option>
                <option value={5000}>Under ₹5,000 (Premium)</option>
                <option value={20000}>Under ₹20,000 (Luxury)</option>
              </select>
            </div>

            {/* Min Rating */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '0.6rem 1rem',
                fontSize: '0.9rem',
              }}
            >
              <Star size={16} color="#f59e0b" />
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                style={{ border: 'none', background: 'transparent', fontWeight: 700, outline: 'none' }}
              >
                <option value={0}>All Ratings</option>
                <option value={4.0}>4.0+ Stars</option>
                <option value={4.5}>4.5+ Stars Top Rated</option>
              </select>
            </div>

            {/* Indoor Only Toggle (Rain Safe) */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: onlyIndoor ? '#4f46e5' : '#475569',
                background: onlyIndoor ? '#eef2ff' : '#f8fafc',
                border: `1px solid ${onlyIndoor ? '#818cf8' : '#cbd5e1'}`,
                padding: '0.6rem 1rem',
                borderRadius: '10px',
              }}
            >
              <input
                type="checkbox"
                checked={onlyIndoor}
                onChange={(e) => setOnlyIndoor(e.target.checked)}
                style={{ accentColor: '#4f46e5' }}
              />
              <span>🌧️ Indoor / Rain-Safe Only</span>
            </label>
          </div>

          {/* Category Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Categories:
            </span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`btn-sm ${selectedCategory === cat.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: '999px', fontSize: '0.85rem' }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={20} color="#4f46e5" />
            <span>Interactive City Geography Map</span>
            <span className="badge badge-info">{filteredPlaces.length} places pinned</span>
          </h3>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Click any pin to inspect ratings & metro links
          </span>
        </div>
        <LeafletMap places={filteredPlaces} onSelectPlace={(place) => setSelectedPlace(place)} height="380px" />
      </div>

      {/* Places Cards Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>
            Curated Experiences ({filteredPlaces.length})
          </h2>
          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Showing verified points of interest in Delhi NCR
          </span>
        </div>

        {filteredPlaces.length === 0 ? (
          <div
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              background: 'white',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
            }}
          >
            <Info size={40} color="#94a3b8" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '0.5rem' }}>
              No places matched your filter
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Try broadening your budget range, rating threshold, or clear the search query.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setMaxBudget(20000);
                setMinRating(0);
                setOnlyIndoor(false);
              }}
              className="btn-primary btn-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid-cards">
            {filteredPlaces.map((place) => (
              <div
                key={place.id}
                className="saathi-card"
                style={{
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedPlace(place)}
              >
                {/* Image & Badges */}
                <div style={{ position: 'relative', height: '190px' }}>
                  <img
                    src={place.image}
                    alt={place.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      display: 'flex',
                      gap: '6px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span className="badge badge-primary">{place.sub_category}</span>
                    {place.indoor_friendly && (
                      <span className="badge badge-success">🌧️ Rain Safe</span>
                    )}
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(15, 23, 42, 0.8)',
                      backdropFilter: 'blur(4px)',
                      color: 'white',
                      padding: '3px 8px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Star size={13} color="#f59e0b" fill="#f59e0b" />
                    <span>{place.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', color: '#0f172a' }}>
                    {place.name}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: '#64748b',
                      marginBottom: '0.75rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {place.description}
                  </p>

                  {/* Highlights tag */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '0.9rem' }}>
                    {place.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '11px',
                          background: '#f1f5f9',
                          color: '#475569',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontWeight: 600,
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats Bar */}
                  <div
                    style={{
                      marginTop: 'auto',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid #f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.82rem',
                    }}
                  >
                    <div>
                      <span style={{ color: '#64748b' }}>For two: </span>
                      <strong style={{ color: '#0f172a' }}>₹{place.cost_for_two}</strong>
                      <span style={{ color: '#059669', fontWeight: 700, marginLeft: '4px' }}>
                        ({place.price_level})
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: place.safety_score >= 8.5 ? '#059669' : '#d97706',
                        fontWeight: 700,
                      }}
                    >
                      <ShieldCheck size={14} />
                      <span>Safety: {place.safety_score}/10</span>
                    </div>
                  </div>

                  {/* Metro link */}
                  <div
                    style={{
                      marginTop: '0.5rem',
                      fontSize: '0.78rem',
                      color: '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Train size={13} color="#4f46e5" />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {place.metro_station}
                    </span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlace(place);
                      }}
                      className="btn-secondary btn-sm"
                      style={{ flex: 1 }}
                    >
                      Inspect Details
                    </button>
                    {onSelectForCompare && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectForCompare(place);
                        }}
                        className="btn-primary btn-sm"
                        title="Send to Place Comparison"
                        style={{ padding: '0.35rem 0.6rem' }}
                      >
                        Compare
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Place Details Modal */}
      {selectedPlace && (
        <div className="modal-overlay" onClick={() => setSelectedPlace(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ position: 'relative', height: '260px' }}>
              <img
                src={selectedPlace.image}
                alt={selectedPlace.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                onClick={() => setSelectedPlace(null)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={18} />
              </button>
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '16px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(6px)',
                  padding: '4px 12px',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                ★ {selectedPlace.rating} ({selectedPlace.review_count.toLocaleString()} Google Reviews)
              </div>
            </div>

            <div style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                <span className="badge badge-primary">{selectedPlace.category.toUpperCase()}</span>
                <span className="badge badge-info">{selectedPlace.sub_category}</span>
                {selectedPlace.indoor_friendly && (
                  <span className="badge badge-success">🌧️ Rain Safe Indoors</span>
                )}
              </div>

              <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', color: '#0f172a' }}>
                {selectedPlace.name}
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={16} color="#64748b" />
                {selectedPlace.address}
              </p>

              <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                {selectedPlace.description}
              </p>

              {/* 4 Score Metrics */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px',
                  background: '#f8fafc',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '1.25rem',
                  textAlign: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Safety</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669' }}>
                    {selectedPlace.safety_score}/10
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Cleanliness</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0284c7' }}>
                    {selectedPlace.cleanliness_score}/10
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Affordability</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#d97706' }}>
                    {selectedPlace.affordability_score}/10
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Transit</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#4f46e5' }}>
                    {selectedPlace.accessibility_score}/10
                  </div>
                </div>
              </div>

              {/* Key Highlights */}
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: '#1e293b' }}>
                  Curator Highlights & Secrets
                </h4>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.88rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {selectedPlace.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>

              {/* Practical Guidance */}
              <div
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  color: '#166534',
                  marginBottom: '1.5rem',
                }}
              >
                <div><strong>🕒 Timings:</strong> {selectedPlace.open_hours}</div>
                <div><strong>💡 Best Time:</strong> {selectedPlace.best_time}</div>
                <div><strong>🚇 Nearest Metro:</strong> {selectedPlace.metro_station}</div>
              </div>

              {/* Bottom Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                {onSelectForCompare && (
                  <button
                    onClick={() => {
                      onSelectForCompare(selectedPlace);
                      setSelectedPlace(null);
                    }}
                    className="btn-primary"
                    style={{ flex: 1 }}
                  >
                    Compare with Another Spot
                  </button>
                )}
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
