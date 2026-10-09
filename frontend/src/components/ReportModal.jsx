import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Camera,
  Mic,
  MapPin,
  CheckCircle,
  Upload
} from 'lucide-react';

export default function ReportModal({ isOpen, onClose, onSubmitReport }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Poor Lighting');
  const [severity, setSeverity] = useState('Medium');
  const [locationName, setLocationName] = useState('');
  const [description, setDescription] = useState('');
  const [hasPhoto, setHasPhoto] = useState(true);
  const [hasVoiceNote, setHasVoiceNote] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceDuration, setVoiceDuration] = useState('0:18');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const categories = [
    'Poor Lighting',
    'Pothole/Road Hazard',
    'Eve Teasing / Harassment',
    'Waterlogging',
    'Traffic Jam',
    'General Caution'
  ];

  const handleSimulateRecord = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setHasVoiceNote(true);
      setVoiceDuration('0:22');
    }, 1200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !locationName.trim() || !description.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitReport({
        title,
        category,
        severity,
        location_name: locationName,
        description,
        lat: 28.6139 + (Math.random() - 0.5) * 0.08,
        lng: 77.2090 + (Math.random() - 0.5) * 0.08,
        photo_url: hasPhoto ? 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80' : null,
        has_voice_note: hasVoiceNote,
        voice_note_duration: hasVoiceNote ? voiceDuration : null,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '560px', padding: '1.75rem' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
              <AlertTriangle size={18} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>File Citizen Civic / Safety Report</h3>
          </div>
          <button onClick={onClose} style={{ color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '1.25rem' }}>
          Your report will be pinned on the city map as <strong>Pending Review</strong> and verified by Community Marshalls or police PCR patrols.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Title */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
              Report Headline: *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Non-functional streetlight outside metro exit"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px' }}
            />
          </div>

          {/* Category & Severity */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                Incident Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px' }}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                Urgency Severity:
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px' }}
              >
                <option value="Low">Low (Informational)</option>
                <option value="Medium">Medium (Caution Needed)</option>
                <option value="High">High (Immediate Danger)</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
              Specific Location / Landmark: *
            </label>
            <div style={{ position: 'relative', marginTop: '4px' }}>
              <input
                type="text"
                required
                placeholder="e.g. Near Gate 3, Rajiv Chowk Metro or Outer Ring Road loop"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
              <MapPin size={16} color="#64748b" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Detailed Description */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
              Incident Description: *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe the hazard, time noticed, or safety recommendations..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px' }}
            />
          </div>

          {/* Media Attachments: Photo Simulator & Voice Note */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {/* Photo Attachment toggle */}
            <div
              style={{
                border: '1px dashed #cbd5e1',
                padding: '10px',
                borderRadius: '8px',
                textAlign: 'center',
                background: hasPhoto ? '#f0fdf4' : '#f8fafc',
              }}
            >
              <Camera size={20} color={hasPhoto ? '#16a34a' : '#64748b'} style={{ marginBottom: '4px' }} />
              <div style={{ fontSize: '11px', fontWeight: 600 }}>
                {hasPhoto ? 'Photo Attached (Demo)' : 'No Photo'}
              </div>
              <button
                type="button"
                onClick={() => setHasPhoto(!hasPhoto)}
                className="btn-sm"
                style={{ fontSize: '10px', marginTop: '4px', textDecoration: 'underline', color: '#4f46e5' }}
              >
                {hasPhoto ? 'Remove photo' : '+ Attach demo snapshot'}
              </button>
            </div>

            {/* Voice Note Recorder Simulator */}
            <div
              style={{
                border: '1px dashed #cbd5e1',
                padding: '10px',
                borderRadius: '8px',
                textAlign: 'center',
                background: hasVoiceNote ? '#eff6ff' : '#f8fafc',
              }}
            >
              <Mic size={20} color={hasVoiceNote ? '#2563eb' : isRecording ? '#dc2626' : '#64748b'} style={{ marginBottom: '4px' }} />
              <div style={{ fontSize: '11px', fontWeight: 600 }}>
                {isRecording ? 'Recording Voice...' : hasVoiceNote ? `Audio Recorded (${voiceDuration})` : 'Voice Dispatch'}
              </div>
              <button
                type="button"
                onClick={handleSimulateRecord}
                className="btn-sm"
                disabled={isRecording}
                style={{ fontSize: '10px', marginTop: '4px', textDecoration: 'underline', color: '#2563eb' }}
              >
                {hasVoiceNote ? 'Re-record note' : isRecording ? 'Hold on...' : '+ Record Voice Note'}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ fontWeight: 700 }}>
              {isSubmitting ? 'Transmitting Report...' : 'Broadcast to CitySaathi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
