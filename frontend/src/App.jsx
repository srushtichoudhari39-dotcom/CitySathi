import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ExploreView from './components/ExploreView';
import CultureView from './components/CultureView';
import SafetyView from './components/SafetyView';
import CompareView from './components/CompareView';
import SmartPlanView from './components/SmartPlanView';
import InsightsView from './components/InsightsView';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('explore');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Core Data
  const [places, setPlaces] = useState([]);
  const [cultureItems, setCultureItems] = useState([]);
  const [safetyZones, setSafetyZones] = useState([]);
  const [presets, setPresets] = useState([]);
  const [insightsData, setInsightsData] = useState(null);
  const [reports, setReports] = useState([]);

  // Dynamic Flow Data
  const [customComparisonResult, setCustomComparisonResult] = useState(null);
  const [routeResult, setRouteResult] = useState(null);
  const [smartPlanData, setSmartPlanData] = useState(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // Initial load
  useEffect(() => {
    async function loadAllData() {
      try {
        setLoading(true);
        const [
          placesRes,
          cultureRes,
          zonesRes,
          presetsRes,
          insightsRes,
          reportsRes,
          initialPlanRes
        ] = await Promise.all([
          api.getPlaces(),
          api.getCultureItems(),
          api.getSafetyZones(),
          api.getPresetComparisons(),
          api.getInsights(),
          api.getReports(),
          api.generateSmartPlan({
            budget: 1500,
            hours: 6,
            interests: ['Culture', 'Foodie'],
            group_type: 'Friends',
            starting_point: 'Connaught Place'
          })
        ]);

        setPlaces(placesRes);
        setCultureItems(cultureRes);
        setSafetyZones(zonesRes);
        setPresets(presetsRes);
        setInsightsData(insightsRes);
        setReports(reportsRes);
        setSmartPlanData(initialPlanRes);

        // Pre-compute a default safe route for Hauz Khas to CP so the tab is immediately functional
        const defaultRoute = await api.computeSaferRoute({
          origin: 'Hauz Khas Village',
          destination: 'Rajiv Chowk / Connaught Place',
          time_of_travel: 'Night (10:00 PM)'
        });
        setRouteResult(defaultRoute);

      } catch (err) {
        console.error('Failed to load initial data:', err);
        setError('Could not connect to CitySaathi backend. Please verify that the FastAPI backend is running on port 8000.');
      } finally {
        setLoading(false);
      }
    }

    loadAllData();
  }, []);

  // Handlers
  const handleSelectForCompare = async (place) => {
    setActiveTab('compare');
    if (places.length > 1) {
      const otherPlace = places.find((p) => p.id !== place.id) || places[0];
      try {
        const res = await api.compareCustom(place.id, otherPlace.id);
        setCustomComparisonResult(res);
      } catch (err) {
        console.error('Compare failed:', err);
      }
    }
  };

  const handleCustomCompare = async (p1Id, p2Id) => {
    const res = await api.compareCustom(p1Id, p2Id);
    setCustomComparisonResult(res);
  };

  const handleComputeRoute = async (payload) => {
    const res = await api.computeSaferRoute(payload);
    setRouteResult(res);
  };

  const handleGenerateSmartPlan = async (payload) => {
    setIsGeneratingPlan(true);
    try {
      const res = await api.generateSmartPlan(payload);
      setSmartPlanData(res);
    } catch (err) {
      alert('Failed to generate SmartPlan: ' + err.message);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleUpvoteReport = async (reportId) => {
    try {
      const updated = await api.upvoteReport(reportId);
      setReports((prev) => prev.map((r) => (r.id === reportId ? updated : r)));
    } catch (err) {
      console.error('Upvote failed:', err);
    }
  };

  const handleVerifyReport = async (reportId) => {
    try {
      const updated = await api.verifyReport(reportId);
      setReports((prev) => prev.map((r) => (r.id === reportId ? updated : r)));
    } catch (err) {
      console.error('Verify failed:', err);
    }
  };

  const handleSubmitReport = async (payload) => {
    try {
      const newRep = await api.submitReport(payload);
      setReports((prev) => [newRep, ...prev]);
      // Update pending review count in insights data
      if (insightsData?.reports_summary) {
        setInsightsData({
          ...insightsData,
          reports_summary: {
            ...insightsData.reports_summary,
            total_reports: insightsData.reports_summary.total_reports + 1,
            pending_review: insightsData.reports_summary.pending_review + 1
          }
        });
      }
    } catch (err) {
      alert('Failed to submit report: ' + err.message);
    }
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        insightsData={insightsData}
      />

      {/* Main View Area */}
      <main className="main-content">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🧭</div>
            <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '0.5rem' }}>
              Initializing CitySaathi Urban Telemetry...
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Loading geo-referenced landmarks, safety polygons, and real-time routes...
            </p>
          </div>
        ) : error ? (
          <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ color: '#991b1b', marginBottom: '0.5rem' }}>Connection Notice</h3>
            <p style={{ color: '#b91c1c', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{error}</p>
            <button onClick={() => window.location.reload()} className="btn-primary">
              Retry Connection
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'explore' && (
              <ExploreView
                places={places}
                onSelectForCompare={handleSelectForCompare}
              />
            )}

            {activeTab === 'culture' && (
              <CultureView
                cultureItems={cultureItems}
              />
            )}

            {activeTab === 'safety' && (
              <SafetyView
                safetyZones={safetyZones}
                onComputeRoute={handleComputeRoute}
                routeResult={routeResult}
              />
            )}

            {activeTab === 'compare' && (
              <CompareView
                places={places}
                presets={presets}
                onCustomCompare={handleCustomCompare}
                customComparisonResult={customComparisonResult}
              />
            )}

            {activeTab === 'smartplan' && (
              <SmartPlanView
                onGenerateSmartPlan={handleGenerateSmartPlan}
                planData={smartPlanData}
                isGenerating={isGeneratingPlan}
              />
            )}

            {activeTab === 'insights' && (
              <InsightsView
                insightsData={insightsData}
                reports={reports}
                onUpvoteReport={handleUpvoteReport}
                onVerifyReport={handleVerifyReport}
                onSubmitReport={handleSubmitReport}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '1.5rem 2rem', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <strong>CitySaathi</strong> — Urban Exploration, Safety & Navigation Engine. Built for the Hackathon.
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '12px' }}>
            <span>✓ Exploration & Stays</span>
            <span>✓ History & Culture</span>
            <span>✓ Safety & SafePath</span>
            <span>✓ Best vs Worst Radar</span>
            <span>✓ SmartPlan + Plan B</span>
            <span>✓ Civic Dispatches</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
