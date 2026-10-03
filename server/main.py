"""Bayern Match API: a small FastAPI server around api/matches.json.

Start it from the project folder with:
    .venv/bin/fastapi dev server/main.py
Then open http://localhost:8000/docs
"""

import json
from datetime import datetime
from pathlib import Path
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

ROOT = Path(__file__).parent.parent
DATA_FILE = ROOT / "api" / "matches.json"

app = FastAPI(title="Bayern Match API")


# The data contract: what a match must look like.
# FastAPI rejects requests that don't follow it (HTTP 422).
class Score(BaseModel):
    bayern: int
    opponent: int


class MatchIn(BaseModel):
    date: datetime
    competition: str
    opponent: str
    venue: Literal["home", "away"]
    score: Score | None = None
    stadium: str | None = None


# Helpers to read and write the JSON file
def load_data():
    return json.loads(DATA_FILE.read_text(encoding="utf-8"))


def save_data(data):
    DATA_FILE.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def find_match(data, match_id):
    for match in data["matches"]:
        if match["id"] == match_id:
            return match
    raise HTTPException(status_code=404, detail=f"Match {match_id} not found")


# GET: read all matches
@app.get("/matches")
def get_matches():
    return load_data()["matches"]


# GET: read one match
@app.get("/matches/{match_id}")
def get_match(match_id: int):
    return find_match(load_data(), match_id)


# POST: add a new match (the server picks the next id)
@app.post("/matches", status_code=201)
def create_match(match: MatchIn):
    data = load_data()
    new_id = max((m["id"] for m in data["matches"]), default=0) + 1
    new_match = {"id": new_id, **match.model_dump(mode="json")}
    data["matches"].append(new_match)
    save_data(data)
    return new_match


# PUT: replace an existing match
@app.put("/matches/{match_id}")
def update_match(match_id: int, match: MatchIn):
    data = load_data()
    existing = find_match(data, match_id)
    existing.clear()
    existing.update({"id": match_id, **match.model_dump(mode="json")})
    save_data(data)
    return existing


# DELETE: remove a match
@app.delete("/matches/{match_id}", status_code=204)
def delete_match(match_id: int):
    data = load_data()
    data["matches"].remove(find_match(data, match_id))
    save_data(data)


# PATCH: change only the fields that are sent
class MatchPatch(BaseModel):
    date: datetime | None = None
    competition: str | None = None
    opponent: str | None = None
    venue: Literal["home", "away"] | None = None
    score: Score | None = None
    stadium: str | None = None


@app.patch("/matches/{match_id}")
def patch_match(match_id: int, changes: MatchPatch):
    data = load_data()
    existing = find_match(data, match_id)
    existing.update(changes.model_dump(mode="json", exclude_unset=True))
    save_data(data)
    return existing


# Also serve the website itself, so http://localhost:8000 shows the page.
# This must come last, after all the API routes.
app.mount("/", StaticFiles(directory=ROOT, html=True), name="site")
