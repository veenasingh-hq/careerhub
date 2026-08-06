from pydantic import BaseModel
from typing import Optional

class ApplicationBase(BaseModel):
    company_name: str
    role: str
    location: Optional[str] = "Remote"
    application_date: Optional[str] = ""
    status: Optional[str] = "Applied"  # Applied, Interview Scheduled, Selected, Rejected, Offer Received
    resume_version: Optional[str] = "v1.0"
    notes: Optional[str] = ""

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(BaseModel):
    company_name: Optional[str] = None
    role: Optional[str] = None
    location: Optional[str] = None
    application_date: Optional[str] = None
    status: Optional[str] = None
    resume_version: Optional[str] = None
    notes: Optional[str] = None

class ApplicationResponse(ApplicationBase):
    id: str
    created_at: str
    updated_at: str