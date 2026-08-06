import json
import os

FILE_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "applications.json")

def load_applications():
    if not os.path.exists(FILE_PATH):
        return []
    try:
        with open(FILE_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []

def save_applications(apps):
    with open(FILE_PATH, "w", encoding="utf-8") as f:
        json.dump(apps, f, indent=2)