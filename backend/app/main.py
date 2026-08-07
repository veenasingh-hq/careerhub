from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from datetime import datetime
import uuid

from app.schemas import ApplicationCreate, ApplicationUpdate, ApplicationResponse
from app import storage

app = FastAPI(
    title="CareerHub API",
    description="Backend REST API for Job & Internship Application Tracker",
    version="1.0.0"
)

# CORS Config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to CareerHub API! Running on custom port. Visit /docs for Swagger UI."}


# --- 1. GET ALL APPLICATIONS ---
@app.get("/applications", response_model=List[ApplicationResponse])
def get_applications():
    return storage.load_applications()


# --- 2. GET DASHBOARD STATS ---
@app.get("/applications/stats")
def get_stats():
    apps = storage.load_applications()
    
    total = len(apps)
    applied = sum(1 for a in apps if a.get("status") == "Applied")
    interviews = sum(1 for a in apps if a.get("status") == "Interview Scheduled")
    selected = sum(1 for a in apps if a.get("status") == "Selected")
    rejected = sum(1 for a in apps if a.get("status") == "Rejected")
    offers = sum(1 for a in apps if a.get("status") == "Offer Received")
    
    return {
        "total": total,
        "applied": applied,
        "interviews": interviews,
        "selected": selected,
        "rejected": rejected,
        "offers": offers
    }


# --- 3. GET SINGLE APPLICATION ---
@app.get("/applications/{app_id}", response_model=ApplicationResponse)
def get_application(app_id: str):
    apps = storage.load_applications()
    app_item = next((a for a in apps if a["id"] == app_id), None)
    if not app_item:
        raise HTTPException(status_code=404, detail="Application not found")
    return app_item


# --- 4. CREATE APPLICATION ---
@app.post("/applications", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def create_application(app_data: ApplicationCreate):
    apps = storage.load_applications()
    now = datetime.utcnow().isoformat()

    new_app = {
        "id": str(uuid.uuid4()),
        "company_name": app_data.company_name.strip(),
        "role": app_data.role.strip(),
        "location": app_data.location.strip() if app_data.location else "Remote",
        "application_date": app_data.application_date if app_data.application_date else datetime.utcnow().strftime("%Y-%m-%d"),
        "status": app_data.status if app_data.status else "Applied",
        "resume_version": app_data.resume_version if app_data.resume_version else "v1.0",
        "notes": app_data.notes.strip() if app_data.notes else "",
        "created_at": now,
        "updated_at": now
    }

    apps.append(new_app)
    storage.save_applications(apps)
    return new_app


# --- 5. UPDATE APPLICATION ---
@app.put("/applications/{app_id}", response_model=ApplicationResponse)
def update_application(app_id: str, app_update: ApplicationUpdate):
    apps = storage.load_applications()
    app_item = next((a for a in apps if a["id"] == app_id), None)

    if not app_item:
        raise HTTPException(status_code=404, detail="Application not found")

    update_data = app_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if value is not None:
            app_item[key] = value

    app_item["updated_at"] = datetime.utcnow().isoformat()
    storage.save_applications(apps)
    return app_item


# --- 6. DELETE APPLICATION ---
@app.delete("/applications/{app_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(app_id: str):
    apps = storage.load_applications()
    initial_len = len(apps)
    apps = [a for a in apps if a["id"] != app_id]

    if len(apps) == initial_len:
        raise HTTPException(status_code=404, detail="Application not found")

    storage.save_applications(apps)
    return None