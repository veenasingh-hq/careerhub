from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="CareerHub API",
    description="Backend REST API for Job & Internship Application Tracker",
    version="1.0.0"
)

# CORS Enablement for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to CareerHub API! Visit /docs for Swagger UI."}