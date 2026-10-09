from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class Place(BaseModel):
    id: str
    name: str
    category: str  # sight, food, hotel, budget, culture
    sub_category: str
    rating: float
    review_count: int
    cost_for_two: int
    price_level: str  # ₹, ₹₹, ₹₹₹, ₹₹₹₹
    address: str
    lat: float
    lng: float
    image: str
    tags: List[str]
    description: str
    highlights: List[str]
    metro_station: str
    safety_score: float  # 1 to 10
    cleanliness_score: float  # 1 to 10
    affordability_score: float  # 1 to 10
    accessibility_score: float  # 1 to 10
    best_time: str
    open_hours: str
    indoor_friendly: bool = False

class CultureItem(BaseModel):
    id: str
    title: str
    type: str  # monument, heritage_walk, culinary_tradition, folk_craft, sacred_site
    era: str
    summary: str
    story: str
    etiquette_tips: List[str]
    coordinates: Dict[str, float]
    image: str
    highlights: List[str]
    audio_snippet_title: str

class SafetyZone(BaseModel):
    id: str
    name: str
    type: str  # caution_zone, accident_blackspot, safe_hub
    severity: str  # High, Moderate, Low, Safe Haven
    lat: float
    lng: float
    radius_meters: int
    description: str
    advisory: str
    reported_concerns: List[str]
    emergency_contact: Optional[str] = None

class RouteLeg(BaseModel):
    step: int
    instruction: str
    distance: str
    safety_factor: str
    lighting: str

class RoutePlan(BaseModel):
    route_name: str
    distance_km: float
    estimated_mins: int
    safety_score: float
    lighting_coverage: str
    cctv_coverage: str
    police_patrol_density: str
    risk_level: str
    caution_points: List[str]
    safety_perks: List[str]
    legs: List[RouteLeg]

class SaferRouteRequest(BaseModel):
    origin: str
    destination: str
    time_of_travel: Optional[str] = "Night (10:00 PM)"

class SaferRouteResponse(BaseModel):
    origin: str
    destination: str
    time_of_travel: str
    fastest_route: RoutePlan
    safer_route: RoutePlan
    recommendation: str

class ItineraryStop(BaseModel):
    time_slot: str
    place_id: str
    name: str
    category: str
    estimated_cost: int
    activity: str
    local_tip: str
    is_indoor: bool
    lat: float
    lng: float

class Itinerary(BaseModel):
    title: str
    theme: str
    target_budget: int
    estimated_total_cost: int
    duration_hours: int
    stops: List[ItineraryStop]
    travel_guidance: str
    safety_advisory: str

class SmartPlanRequest(BaseModel):
    budget: int = 1500
    hours: int = 6
    interests: List[str] = ["Culture", "Foodie"]
    group_type: str = "Friends"  # Solo, Couple, Friends, Family
    starting_point: str = "Connaught Place"

class SmartPlanResponse(BaseModel):
    request_params: SmartPlanRequest
    primary_plan: Itinerary
    plan_b_contingency: Itinerary
    contingency_reason: str
    disclaimer: str

class CitizenReport(BaseModel):
    id: str
    title: str
    category: str  # Poor Lighting, Pothole/Road Hazard, Eve Teasing / Harassment, Waterlogging, Traffic Jam, General Caution
    severity: str  # Low, Medium, High
    description: str
    location_name: str
    lat: float
    lng: float
    timestamp: str
    status: str  # Pending Review, Verified
    upvotes: int
    has_photo: bool
    photo_url: Optional[str] = None
    has_voice_note: bool
    voice_note_duration: Optional[str] = None
    verified_by: Optional[str] = None

class CitizenReportCreate(BaseModel):
    title: str
    category: str
    severity: str = "Medium"
    description: str
    location_name: str
    lat: float = 28.6139
    lng: float = 77.2090
    photo_url: Optional[str] = None
    has_voice_note: bool = False
    voice_note_duration: Optional[str] = None

class PlaceComparison(BaseModel):
    place1: Place
    place2: Place
    winner_safety: str
    winner_cleanliness: str
    winner_affordability: str
    winner_ratings: str
    winner_transit: str
    overall_recommendation: str
