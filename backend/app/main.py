import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .models import (
    Place, CultureItem, SafetyZone,
    SaferRouteRequest, SaferRouteResponse, RoutePlan, RouteLeg,
    SmartPlanRequest, SmartPlanResponse, Itinerary, ItineraryStop,
    CitizenReport, CitizenReportCreate
)
from .data import (
    PLACES_DATA, CULTURE_DATA, SAFETY_ZONES_DATA,
    PRESET_COMPARISONS, CITIZEN_REPORTS_DATA, SMART_CITY_METRICS
)

app = FastAPI(
    title="CitySaathi API",
    description="Backend engine for exploring, experiencing, and navigating urban chaos.",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mutable in-memory stores for runtime additions (e.g. citizen reports, reviews)
reports_db: List[dict] = list(CITIZEN_REPORTS_DATA)

@app.get("/api/health")
def get_health():
    return {
        "status": "healthy",
        "app": "CitySaathi",
        "city": "Delhi NCR",
        "version": "1.0.0",
        "places_indexed": len(PLACES_DATA),
        "safety_zones_monitored": len(SAFETY_ZONES_DATA),
        "active_citizen_reports": len(reports_db)
    }

@app.get("/api/places")
def get_places(
    category: Optional[str] = Query(None, description="sight, food, hotel, budget, culture"),
    query: Optional[str] = Query(None, description="Search term in name or tags"),
    max_budget: Optional[int] = Query(None, description="Max cost for two"),
    min_rating: Optional[float] = Query(None, description="Minimum rating"),
    indoor_only: Optional[bool] = Query(None, description="Filter for indoor rain-friendly spots")
):
    results = PLACES_DATA
    if category and category.lower() != "all":
        results = [p for p in results if p["category"].lower() == category.lower()]
    
    if query:
        q = query.lower()
        results = [
            p for p in results
            if q in p["name"].lower()
            or q in p["description"].lower()
            or any(q in t.lower() for t in p["tags"])
            or q in p["sub_category"].lower()
        ]
        
    if max_budget is not None:
        results = [p for p in results if p["cost_for_two"] <= max_budget]
        
    if min_rating is not None:
        results = [p for p in results if p["rating"] >= min_rating]
        
    if indoor_only is True:
        results = [p for p in results if p.get("indoor_friendly") is True]

    return results

@app.get("/api/places/{place_id}")
def get_place(place_id: str):
    for p in PLACES_DATA:
        if p["id"] == place_id:
            return p
    raise HTTPException(status_code=404, detail="Place not found")

@app.get("/api/culture")
def get_culture_items():
    return CULTURE_DATA

@app.get("/api/culture/{culture_id}")
def get_culture_item(culture_id: str):
    for item in CULTURE_DATA:
        if item["id"] == culture_id:
            return item
    raise HTTPException(status_code=404, detail="Culture item not found")

@app.get("/api/safety/zones")
def get_safety_zones(zone_type: Optional[str] = None):
    if zone_type:
        return [z for z in SAFETY_ZONES_DATA if z["type"] == zone_type]
    return SAFETY_ZONES_DATA

@app.post("/api/safety/safer-route", response_model=SaferRouteResponse)
def compute_safer_route(req: SaferRouteRequest):
    # Dynamic computation simulating risk evaluation vs well-monitored routes
    origin = req.origin.strip() or "Hauz Khas Village"
    destination = req.destination.strip() or "Rajiv Chowk / CP"

    fastest_legs = [
        RouteLeg(step=1, instruction=f"Depart {origin} via narrow rear boundary road", distance="1.2 km", safety_factor="Low (Dim streetlights)", lighting="30% lit"),
        RouteLeg(step=2, instruction="Take unmonitored flyover underpass connecting to arterial loop", distance="3.8 km", safety_factor="Caution (Isolated stretch)", lighting="45% lit"),
        RouteLeg(step=3, instruction=f"Merge onto Outer Ring Road toward {destination}", distance="4.1 km", safety_factor="Moderate (Fast heavy traffic)", lighting="70% lit")
    ]
    
    safer_legs = [
        RouteLeg(step=1, instruction=f"Depart {origin} via main commercial boulevard toward Metro Station", distance="1.4 km", safety_factor="High (Active shop fronts & Pink Police Post)", lighting="95% lit"),
        RouteLeg(step=2, instruction="Take fully monitored Metro transit or CCTV-monitored 6-lane Sri Aurobindo Marg", distance="5.2 km", safety_factor="Very High (24/7 CCTV & PCR van surveillance)", lighting="100% lit"),
        RouteLeg(step=3, instruction=f"Arrive safely at illuminated Central Promenade of {destination}", distance="3.5 km", safety_factor="High (Gated security & round-the-clock patrol)", lighting="95% lit")
    ]

    fastest = RoutePlan(
        route_name="Fastest Short-Cut Route (Higher Risk)",
        distance_km=9.1,
        estimated_mins=22,
        safety_score=6.2,
        lighting_coverage="48% illuminated",
        cctv_coverage="25% covered",
        police_patrol_density="Low / Irregular",
        risk_level="Caution Advised",
        caution_points=[
            "Poorly lit underpass stretch between km 2 and 4",
            "Lack of open commercial shops or pedestrian traffic after 9:30 PM",
            "Blind spot near heavy truck junction"
        ],
        safety_perks=["Slightly faster arrival by ~6-8 minutes"],
        legs=fastest_legs
    )

    safer = RoutePlan(
        route_name="Saathi SafePath (Well-Lit & Monitored Corridor)",
        distance_km=10.1,
        estimated_mins=28,
        safety_score=9.6,
        lighting_coverage="96% high-lumens illumination",
        cctv_coverage="92% civic camera coverage",
        police_patrol_density="Continuous PCR & Pink Booth presence",
        risk_level="Safe Haven Priority",
        caution_points=["Adds approx 6 minutes of travel time"],
        safety_perks=[
            "100% signalized pedestrian crossings with audio beacons",
            "Direct proximity to 3 operational 24/7 Metro security desks",
            "Constant commercial activity & well-lit family corridors"
        ],
        legs=safer_legs
    )

    return SaferRouteResponse(
        origin=origin,
        destination=destination,
        time_of_travel=req.time_of_travel or "Night (10:00 PM)",
        fastest_route=fastest,
        safer_route=safer,
        recommendation="CitySaathi recommends 'Saathi SafePath' after 8:00 PM: adds only 6 minutes but provides a 9.6/10 safety score with continuous CCTV and active patrol checkpoints."
    )

@app.get("/api/compare/presets")
def get_preset_comparisons():
    # Enrich presets with full place objects
    enriched = []
    place_map = {p["id"]: p for p in PLACES_DATA}
    for comp in PRESET_COMPARISONS:
        p1 = place_map.get(comp["place1_id"])
        p2 = place_map.get(comp["place2_id"])
        if p1 and p2:
            enriched.append({
                **comp,
                "place1": p1,
                "place2": p2
            })
    return enriched

class CustomCompareRequest(BaseModel):
    place1_id: str
    place2_id: str

@app.post("/api/compare/custom")
def compare_places(req: CustomCompareRequest):
    place_map = {p["id"]: p for p in PLACES_DATA}
    p1 = place_map.get(req.place1_id)
    p2 = place_map.get(req.place2_id)
    if not p1 or not p2:
        raise HTTPException(status_code=404, detail="One or both places not found")

    winner_safety = p1["name"] if p1["safety_score"] >= p2["safety_score"] else p2["name"]
    winner_cleanliness = p1["name"] if p1["cleanliness_score"] >= p2["cleanliness_score"] else p2["name"]
    winner_affordability = p1["name"] if p1["affordability_score"] >= p2["affordability_score"] else p2["name"]
    winner_ratings = p1["name"] if p1["rating"] >= p2["rating"] else p2["name"]
    winner_transit = p1["name"] if p1["accessibility_score"] >= p2["accessibility_score"] else p2["name"]

    # Calculate balanced overall index
    score1 = (p1["safety_score"] * 0.3) + (p1["cleanliness_score"] * 0.2) + (p1["affordability_score"] * 0.2) + (p1["rating"] * 2.0 * 0.15) + (p1["accessibility_score"] * 0.15)
    score2 = (p2["safety_score"] * 0.3) + (p2["cleanliness_score"] * 0.2) + (p2["affordability_score"] * 0.2) + (p2["rating"] * 2.0 * 0.15) + (p2["accessibility_score"] * 0.15)

    if score1 > score2:
        rec = f"Overall Recommendation: {p1['name']} edges out with stronger balanced hygiene, safety, and visitor comfort (Index: {score1:.1f}/10 vs {score2:.1f}/10)."
    else:
        rec = f"Overall Recommendation: {p2['name']} leads with superior balance across safety, connectivity, and value (Index: {score2:.1f}/10 vs {score1:.1f}/10)."

    return {
        "place1": p1,
        "place2": p2,
        "score1": round(score1, 1),
        "score2": round(score2, 1),
        "winner_safety": winner_safety,
        "winner_cleanliness": winner_cleanliness,
        "winner_affordability": winner_affordability,
        "winner_ratings": winner_ratings,
        "winner_transit": winner_transit,
        "overall_recommendation": rec
    }

@app.post("/api/smartplan", response_model=SmartPlanResponse)
def generate_smartplan(req: SmartPlanRequest):
    budget = req.budget
    hours = req.hours
    interests_lower = [i.lower() for i in req.interests]

    # Select primary stops matching interests & hours
    # If hours <= 3: 2 stops; hours 4-6: 3 stops; hours > 6: 4 stops
    stop_count = 2 if hours <= 3 else (3 if hours <= 6 else 4)

    # Filter candidates
    outdoor_candidates = [p for p in PLACES_DATA if not p.get("indoor_friendly")]
    indoor_candidates = [p for p in PLACES_DATA if p.get("indoor_friendly")]

    # Build primary plan
    primary_stops = []
    times = ["10:30 AM - 12:30 PM", "01:00 PM - 03:00 PM", "03:30 PM - 05:30 PM", "06:00 PM - 08:30 PM"]

    # Curate primary stops (e.g. mix of culture/sight + food + budget/shopping)
    # Default selection order
    p_pool = [
        PLACES_DATA[0], # Qutub Minar
        PLACES_DATA[1], # Chandni Chowk Food
        PLACES_DATA[2], # Humayun's Tomb
        PLACES_DATA[5]  # Connaught Place
    ]
    if any("food" in i for i in interests_lower):
        p_pool[0] = PLACES_DATA[1] # Chandni Chowk
        p_pool[1] = PLACES_DATA[11] # Karim's
    if any("budget" in i for i in interests_lower):
        p_pool[2] = PLACES_DATA[4] # Majnu Ka Tila
        p_pool[3] = PLACES_DATA[7] # Dilli Haat INA

    chosen_primary = p_pool[:stop_count]
    cost_accumulator = 0
    for idx, p in enumerate(chosen_primary):
        stop_cost = min(p["cost_for_two"] // 2, budget // (stop_count or 1))
        cost_accumulator += stop_cost
        primary_stops.append(ItineraryStop(
            time_slot=times[idx],
            place_id=p["id"],
            name=p["name"],
            category=p["category"],
            estimated_cost=stop_cost,
            activity=f"Explore highlights and experience authentic {p['tags'][0]}",
            local_tip=p["highlights"][0],
            is_indoor=p.get("indoor_friendly", False),
            lat=p["lat"],
            lng=p["lng"]
        ))

    primary_itinerary = Itinerary(
        title=f"SmartPlan: The {req.group_type} Urban Explorer Journey ({hours}h)",
        theme="Open-Air Monuments, Historic Alleys & City Flavors",
        target_budget=budget,
        estimated_total_cost=cost_accumulator,
        duration_hours=hours,
        stops=primary_stops,
        travel_guidance="Use Delhi Metro Yellow Line for fast transit between stops; avoid surface autos during peak 5 PM - 7 PM commute.",
        safety_advisory="High daytime pedestrian safety. Keep bags zipped in crowded market alleys."
    )

    # Build Plan B: Contingency Itinerary for Rain, Extreme Weather or Gridlock Disruptions!
    # All indoor, sheltered, museum & covered arcade spots with transit direct access
    plan_b_pool = [
        PLACES_DATA[6],  # National Museum (Fully air-conditioned indoor)
        PLACES_DATA[5],  # Connaught Place (Sheltered Georgian Colonnades & underground Palika)
        PLACES_DATA[4],  # Majnu Ka Tila Indoor Cafes
        PLACES_DATA[8]   # The Imperial Heritage Atrium / High Tea
    ]
    chosen_b = plan_b_pool[:stop_count]
    b_cost_accumulator = 0
    plan_b_stops = []
    for idx, p in enumerate(chosen_b):
        stop_cost = min(p["cost_for_two"] // 2, budget // (stop_count or 1))
        b_cost_accumulator += stop_cost
        plan_b_stops.append(ItineraryStop(
            time_slot=times[idx],
            place_id=p["id"],
            name=p["name"],
            category=p["category"],
            estimated_cost=stop_cost,
            activity=f"Sheltered indoor exploration: {p['sub_category']}",
            local_tip=f"Rain-Safe Hub: Direct covered entry & zero waterlogging exposure.",
            is_indoor=True,
            lat=p["lat"],
            lng=p["lng"]
        ))

    plan_b_itinerary = Itinerary(
        title=f"Plan B (Monsoon / Extreme Heat / Transit Disruption Backup)",
        theme="100% Climate-Controlled Galleries, Sheltered Colonnades & Safe Transit Hubs",
        target_budget=budget,
        estimated_total_cost=b_cost_accumulator,
        duration_hours=hours,
        stops=plan_b_stops,
        travel_guidance="Plan B connects via underground metro concourses with zero road waterlogging risk. Step directly into covered arcades.",
        safety_advisory="Avoid road underpasses (like Minto Bridge). Stay within well-lit underground metro corridors and covered museum pavilions."
    )

    return SmartPlanResponse(
        request_params=req,
        primary_plan=primary_itinerary,
        plan_b_contingency=plan_b_itinerary,
        contingency_reason="Weather forecast indicates scattered monsoon showers (65% chance) or urban congestion hotspots. Plan B seamlessly swaps exposed walking routes with covered cultural institutions and sheltered arcades.",
        disclaimer="Note: CitySaathi SmartPlan engine generates simulated itineraries based on live urban rulesets and sample data. Actual prices and timings may vary."
    )

@app.get("/api/insights")
def get_city_insights():
    # Return weather, traffic, and summary counts
    unverified_count = len([r for r in reports_db if r["status"] == "Pending Review"])
    verified_count = len([r for r in reports_db if r["status"] == "Verified"])
    
    return {
        "metrics": SMART_CITY_METRICS,
        "reports_summary": {
            "total_reports": len(reports_db),
            "pending_review": unverified_count,
            "verified": verified_count
        }
    }

@app.get("/api/insights/reports")
def get_citizen_reports(status: Optional[str] = None, category: Optional[str] = None):
    results = reports_db
    if status:
        results = [r for r in results if r["status"].lower() == status.lower()]
    if category:
        results = [r for r in results if r["category"].lower() == category.lower()]
    return results

@app.post("/api/insights/reports")
def create_citizen_report(req: CitizenReportCreate):
    new_id = f"rep-{len(reports_db) + 101}"
    new_report = {
        "id": new_id,
        "title": req.title,
        "category": req.category,
        "severity": req.severity,
        "description": req.description,
        "location_name": req.location_name,
        "lat": req.lat,
        "lng": req.lng,
        "timestamp": "Just now",
        "status": "Pending Review",
        "upvotes": 1,
        "has_photo": bool(req.photo_url),
        "photo_url": req.photo_url or "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
        "has_voice_note": req.has_voice_note,
        "voice_note_duration": req.voice_note_duration or ("0:15" if req.has_voice_note else None),
        "verified_by": None
    }
    reports_db.insert(0, new_report)
    return new_report

@app.post("/api/insights/reports/{report_id}/upvote")
def upvote_report(report_id: str):
    for r in reports_db:
        if r["id"] == report_id:
            r["upvotes"] += 1
            # Auto-verify if community upvotes reach a threshold
            if r["upvotes"] >= 5 and r["status"] == "Pending Review":
                r["status"] = "Verified"
                r["verified_by"] = "Community Consensus (5+ Upvotes)"
            return r
    raise HTTPException(status_code=404, detail="Report not found")

@app.post("/api/insights/reports/{report_id}/verify")
def verify_report(report_id: str):
    for r in reports_db:
        if r["id"] == report_id:
            r["status"] = "Verified"
            r["verified_by"] = "Saathi Safety Marshall Team"
            return r
    raise HTTPException(status_code=404, detail="Report not found")
