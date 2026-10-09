import React, { useEffect, useRef } from 'react';

export default function LeafletMap({
  center = [28.6139, 77.2090], // Delhi NCR center
  zoom = 12,
  places = [],
  safetyZones = [],
  citizenReports = [],
  itineraryStops = [],
  routeData = null,
  onSelectPlace,
  height = '420px',
  interactive = true
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  useEffect(() => {
    // Check if Leaflet is available in window
    if (!window.L || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map
      const map = window.L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: interactive,
        dragging: interactive,
        scrollWheelZoom: interactive,
      });

      // CartoDB Positron / OSM clean tile layer
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      layerGroupRef.current = window.L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // Map cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update layers whenever props change
  useEffect(() => {
    const L = window.L;
    if (!L || !mapInstanceRef.current || !layerGroupRef.current) return;

    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    const bounds = [];

    // 1. Render Places
    places.forEach((p) => {
      if (!p.lat || !p.lng) return;
      bounds.push([p.lat, p.lng]);

      const categoryColors = {
        sight: '#4f46e5',
        food: '#f59e0b',
        hotel: '#0284c7',
        budget: '#10b981',
        culture: '#8b5cf6'
      };
      const color = categoryColors[p.category] || '#6366f1';

      const icon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 13px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2.5px solid white;">
            ★
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      });

      const marker = L.marker([p.lat, p.lng], { icon });
      marker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; max-width: 220px; padding: 4px;">
          <img src="${p.image}" style="width: 100%; height: 90px; object-fit: cover; border-radius: 6px; margin-bottom: 6px;" />
          <h4 style="margin: 0 0 4px; font-size: 14px; font-weight: 700; color: #0f172a;">${p.name}</h4>
          <p style="margin: 0 0 6px; font-size: 12px; color: #64748b;">${p.sub_category}</p>
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 6px;">
            <span style="font-weight: 700; color: #f59e0b;">★ ${p.rating}</span>
            <span style="color: #059669; font-weight: 600;">Safety: ${p.safety_score}/10</span>
          </div>
          <div style="font-size: 11px; color: #334155;"><strong>Metro:</strong> ${p.metro_station}</div>
        </div>
      `);
      marker.on('click', () => {
        if (onSelectPlace) onSelectPlace(p);
      });
      layerGroup.addLayer(marker);
    });

    // 2. Render Safety Zones (Circles & Warning Markers)
    safetyZones.forEach((z) => {
      if (!z.lat || !z.lng) return;
      bounds.push([z.lat, z.lng]);

      const isSafe = z.type === 'safe_hub';
      const isBlackspot = z.type === 'accident_blackspot';
      const circleColor = isSafe ? '#10b981' : isBlackspot ? '#dc2626' : '#ea580c';
      const circleFill = isSafe ? '#a7f3d0' : isBlackspot ? '#fecaca' : '#fed7aa';

      const circle = L.circle([z.lat, z.lng], {
        color: circleColor,
        fillColor: circleFill,
        fillOpacity: 0.35,
        radius: z.radius_meters || 300,
        weight: 2
      });

      const symbol = isSafe ? '🛡️' : isBlackspot ? '⚠️' : '🚨';
      const icon = L.divIcon({
        className: 'custom-safety-marker',
        html: `
          <div style="background-color: ${circleColor}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; box-shadow: 0 3px 8px rgba(0,0,0,0.3); border: 2px solid white;">
            ${symbol}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const centerMarker = L.marker([z.lat, z.lng], { icon });
      centerMarker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; max-width: 240px; padding: 4px;">
          <span style="display: inline-block; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 99px; background: ${circleFill}; color: ${circleColor}; margin-bottom: 4px;">
            ${z.severity.toUpperCase()}
          </span>
          <h4 style="margin: 0 0 4px; font-size: 13px; font-weight: 700;">${z.name}</h4>
          <p style="margin: 0 0 6px; font-size: 11px; color: #475569;">${z.description}</p>
          <div style="font-size: 11px; color: #0284c7; background: #f0f9ff; padding: 4px 6px; border-radius: 4px;">
            <strong>Advisory:</strong> ${z.advisory}
          </div>
          ${z.emergency_contact ? `<div style="font-size: 10px; color: #b91c1c; margin-top: 5px;"><strong>Helpline:</strong> ${z.emergency_contact}</div>` : ''}
        </div>
      `);

      layerGroup.addLayer(circle);
      layerGroup.addLayer(centerMarker);
    });

    // 3. Render Citizen Reports
    citizenReports.forEach((r) => {
      if (!r.lat || !r.lng) return;
      bounds.push([r.lat, r.lng]);

      const isVerified = r.status === 'Verified';
      const badgeBg = isVerified ? '#059669' : '#d97706';

      const icon = L.divIcon({
        className: 'custom-report-marker',
        html: `
          <div style="background-color: ${badgeBg}; width: 26px; height: 26px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: white; box-shadow: 0 3px 8px rgba(0,0,0,0.3); border: 2px solid white;">
            📢
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const reportMarker = L.marker([r.lat, r.lng], { icon });
      reportMarker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; max-width: 220px; padding: 4px;">
          <span style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 99px; background: ${isVerified ? '#d1fae5' : '#fef3c7'}; color: ${badgeBg};">
            ${r.status}
          </span>
          <h4 style="margin: 4px 0 2px; font-size: 13px; font-weight: 700;">${r.title}</h4>
          <p style="margin: 0 0 4px; font-size: 11px; color: #64748b;">${r.category} • ${r.location_name}</p>
          <p style="margin: 0 0 6px; font-size: 11px; color: #334155;">${r.description}</p>
          <div style="font-size: 10px; color: #059669;"><strong>${r.upvotes}</strong> community confirmations</div>
        </div>
      `);
      layerGroup.addLayer(reportMarker);
    });

    // 4. Render SmartPlan Itinerary Stops
    if (itineraryStops && itineraryStops.length > 0) {
      const stopCoords = [];
      itineraryStops.forEach((stop, idx) => {
        if (!stop.lat || !stop.lng) return;
        bounds.push([stop.lat, stop.lng]);
        stopCoords.push([stop.lat, stop.lng]);

        const icon = L.divIcon({
          className: 'custom-stop-marker',
          html: `
            <div style="background: linear-gradient(135deg, #4f46e5, #06b6d4); width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 15px; box-shadow: 0 4px 12px rgba(79,70,229,0.4); border: 2.5px solid white;">
              ${idx + 1}
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });

        const stopMarker = L.marker([stop.lat, stop.lng], { icon });
        stopMarker.bindPopup(`
          <div style="font-family: system-ui, sans-serif; max-width: 220px; padding: 4px;">
            <div style="font-size: 11px; color: #4f46e5; font-weight: 700; margin-bottom: 2px;">Stop ${idx + 1}: ${stop.time_slot}</div>
            <h4 style="margin: 0 0 4px; font-size: 14px; font-weight: 700;">${stop.name}</h4>
            <p style="margin: 0 0 4px; font-size: 11px; color: #334155;">${stop.activity}</p>
            <div style="font-size: 11px; color: #059669; font-weight: 600;">Est. Cost: ₹${stop.estimated_cost}</div>
          </div>
        `);
        layerGroup.addLayer(stopMarker);
      });

      // Connect stops with itinerary route polyline
      if (stopCoords.length > 1) {
        const polyline = L.polyline(stopCoords, {
          color: '#4f46e5',
          weight: 4,
          opacity: 0.8,
          dashArray: '8, 8'
        });
        layerGroup.addLayer(polyline);
      }
    }

    // 5. Render SafeRoute comparison polylines if provided
    if (routeData) {
      // Hauz Khas to CP simulation coords
      const safePathCoords = [
        [28.5534, 77.1945], // Hauz Khas Village
        [28.5670, 77.2050], // AIIMS Safe Corridor
        [28.5900, 77.2150], // Safdarjung / Jor Bagh
        [28.6139, 77.2180], // Rajpath / Janpath
        [28.6315, 77.2167]  // Connaught Place Inner Circle
      ];

      const fastestCoords = [
        [28.5534, 77.1945], // HKV
        [28.5620, 77.1850], // Dark inner underpass
        [28.6010, 77.1900], // Chanakyapuri backstretch
        [28.6315, 77.2167]  // CP
      ];

      safePathCoords.forEach(c => bounds.push(c));
      fastestCoords.forEach(c => bounds.push(c));

      // Draw safe path (solid emerald green)
      const safeLine = L.polyline(safePathCoords, {
        color: '#10b981',
        weight: 6,
        opacity: 0.9
      }).bindPopup('<strong>Saathi SafePath</strong>: 9.6/10 Safety Score, 100% CCTV & lit corridors');

      // Draw fastest path (dashed amber)
      const fastLine = L.polyline(fastestCoords, {
        color: '#f59e0b',
        weight: 4,
        opacity: 0.7,
        dashArray: '6, 8'
      }).bindPopup('<strong>Fastest Route</strong>: 6.2/10 Safety Score, unlit underpass caution');

      layerGroup.addLayer(safeLine);
      layerGroup.addLayer(fastLine);
    }

    // Fit map bounds if there are markers and it's not a single point
    if (bounds.length > 1) {
      try {
        mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      } catch (err) {
        console.error('Fit bounds error:', err);
      }
    }
  }, [places, safetyZones, citizenReports, itineraryStops, routeData]);

  return (
    <div
      style={{
        width: '100%',
        height: height,
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        position: 'relative',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
      }}
    >
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      
      {/* Map Legend Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          zIndex: 999,
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(6px)',
          padding: '6px 12px',
          borderRadius: '10px',
          fontSize: '11px',
          fontWeight: 600,
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          border: '1px solid #cbd5e1',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4f46e5', display: 'inline-block' }}></span> Sight/Place
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#059669', display: 'inline-block' }}></span> Safe Hub
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#dc2626', display: 'inline-block' }}></span> Accident Blackspot
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ea580c', display: 'inline-block' }}></span> Caution Zone
        </span>
      </div>
    </div>
  );
}
