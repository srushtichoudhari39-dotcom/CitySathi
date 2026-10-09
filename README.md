# 🧭 CitySaathi — Urban Exploration, Safety & Smart Navigation

> **Problem Statement:** “City Life: Exploring, Experiencing & Navigating the Chaos We Call Home”  
> **Hackathon MVP:** Complete, Polished, Working Full-Stack Web Application  
> **Tech Stack:** React (Vite) + FastAPI (Python) + Leaflet (OpenStreetMap)

---

## 🌟 Overview & Core Pillars

**CitySaathi** is an intelligent urban companion that empowers citizens and travelers to embrace the vibrant chaos of city life without fear or confusion. It addresses all five core pillars of urban living plus a unique disruption-proof itinerary engine:

1. **Exploration & Hospitality:** Searchable & filterable database of iconic tourist landmarks, historic street food joints, budget stays/hostels, and boutique hotels with ratings, spend-for-two estimates, and nearest metro links.
2. **History & Culture:** Living heritage chapters spanning 700+ years of dynastic history, oral traditions, cultural etiquette guides, and simulated interactive audio guides (e.g. *Voices of Mehrauli*, *Hazrat Nizamuddin Sufi Qawwali*).
3. **Safety & Security:** Geo-fenced safety radar tracking Caution Zones, Accident Blackspots, and 24/7 Safe Havens (Pink Police Booths, CISF Metro hubs, trauma centers). Features **Saathi SafePath**, a route evaluation engine that compares fastest driving cuts against well-lit, CCTV-monitored arterial police corridors.
4. **Best vs. Worst Places (Urban Matrix):** Side-by-side place showdown comparing any two spots across **Safety**, **Cleanliness**, **Affordability**, **Public Ratings**, and **Metro Transit Accessibility** with balanced algorithmic verdicts.
5. **Smart City Insights:** Atmospheric telemetry (AQI, rain alerts, temperature), live urban gridlock indices, bottleneck delay tracking, and a citizen incident dispatch feed with **Pending Review** vs. **Verified** statuses, community upvotes, and photo/voice note evidence.

### 💡 Unique Innovation: “SmartPlan + Plan B”
Cities are unpredictable: sudden monsoon downpours, waterlogged underpasses, or extreme heat waves frequently disrupt outing plans.
- **SmartPlan:** Generates an optimal outing schedule tailored to budget (₹), available hours, interests, and group dynamics.
- **Plan B Contingency:** Automatically computes a parallel backup itinerary that swaps outdoor walking with 100% climate-controlled galleries, covered colonnades, and underground rapid transit corridors with zero waterlogging exposure.
- **Integrity Notice:** Clearly labeled simulated urban intelligence calibrated for demonstration.

---

## 🚀 Quick Start Guide (Windows PowerShell)

### Prerequisites
- Python 3.10+ (accessible via `py` or `python`)
- Node.js 18+ and npm (accessible via `npm.cmd` or `npm`)

### 1. Run the FastAPI Backend
Open a PowerShell terminal and run:
```powershell
cd "c:\Users\LENOVO\OneDrive\Desktop\Prompt War\backend"
py -m pip install -r requirements.txt
py run.py
```
*Backend runs at `http://127.0.0.1:8000`. Interactive OpenAPI documentation available at `http://127.0.0.1:8000/docs`.*

### 2. Run the React + Vite Frontend
Open a second PowerShell terminal and run:
```powershell
cd "c:\Users\LENOVO\OneDrive\Desktop\Prompt War\frontend"
npm.cmd install
npm.cmd run dev
```
*Frontend runs at `http://localhost:5173`. Requests to `/api` are automatically proxied to the FastAPI backend.*

---

## 📁 Project Architecture

```
Prompt War/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI application & REST endpoints
│   │   ├── models.py        # Pydantic schemas for places, routes, plans & reports
│   │   └── data.py          # Delhi NCR datasets (places, safety zones, presets, telemetry)
│   ├── requirements.txt     # Python backend dependencies
│   └── run.py               # Uvicorn launcher script
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Responsive navigation, live weather pill, SOS modal
│   │   │   ├── LeafletMap.jsx     # Leaflet OpenStreetMap wrapper (places, zones, routes)
│   │   │   ├── ExploreView.jsx    # Exploration & Hospitality (search, filter, cards)
│   │   │   ├── CultureView.jsx    # Heritage lore, audio player simulator, etiquette
│   │   │   ├── SafetyView.jsx     # Safety zones, accident spots, SafePath calculator
│   │   │   ├── CompareView.jsx    # 5-Pillar place showdown matrix & presets
│   │   │   ├── SmartPlanView.jsx  # SmartPlan + Plan B dual itinerary generator
│   │   │   ├── InsightsView.jsx   # Weather, traffic, citizen reports feed
│   │   │   └── ReportModal.jsx    # Citizen hazard report submission modal
│   │   ├── services/
│   │   │   └── api.js             # Client API service
│   │   ├── App.jsx                # Main unified dashboard application
│   │   └── index.css              # Modern design tokens, cards, and styles
│   ├── index.html                 # CDN typography & Leaflet mapping assets
│   ├── package.json               # Frontend dependencies & build scripts
│   └── vite.config.js             # Vite configuration with API proxy
├── .gitignore
└── README.md
```

---

## 🛠️ API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and database statistics |
| `GET` | `/api/places` | Filter places by category, search text, max budget, min rating, indoor-only |
| `GET` | `/api/culture` | Heritage stories, audio guide metadata, etiquette guides |
| `GET` | `/api/safety/zones` | Geo-fenced caution corridors, blackspots, and safe hubs |
| `POST` | `/api/safety/safer-route` | Compares Fastest Route vs Saathi SafePath with safety scoring |
| `GET` | `/api/compare/presets` | Pre-configured urban matchups (e.g. Hauz Khas vs Majnu Ka Tila) |
| `POST` | `/api/compare/custom` | Dynamic 5-pillar comparison between any two selected places |
| `POST` | `/api/smartplan` | Dual-plan engine: generates Primary Itinerary and Rain Plan B |
| `GET` | `/api/insights` | Real-time simulated weather, traffic index, and bottleneck delays |
| `GET` | `/api/insights/reports` | Citizen reports feed filtered by status or category |
| `POST` | `/api/insights/reports` | Submit a new citizen incident report (photo/voice note support) |
| `POST` | `/api/insights/reports/{id}/upvote` | Confirm incident and increment community upvotes |
| `POST` | `/api/insights/reports/{id}/verify` | Verify report status as Community Safety Marshall |

---

## 🚢 Deployment Guide

### GitHub Upload
```powershell
cd "c:\Users\LENOVO\OneDrive\Desktop\Prompt War"
git init
git add .
git commit -m "feat: CitySaathi hackathon MVP complete working release"
git branch -M main
git remote add origin https://github.com/<your-username>/citysaathi.git
git push -u origin main
```

### Full-Stack Cloud Deployment
1. **Frontend (Vercel / Netlify):**
   - Connect the GitHub repository.
   - Set Root Directory to `frontend`.
   - Build command: `npm run build`, Output directory: `dist`.
   - Add environment variable `VITE_API_URL` pointing to backend URL if hosting separately.
2. **Backend (Render / Railway / Koyeb):**
   - Create Web Service from the repository.
   - Set Root Directory to `backend`.
   - Build command: `pip install -r requirements.txt`.
   - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
