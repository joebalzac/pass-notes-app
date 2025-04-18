from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend to call backend from localhost:5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory notes store
notes_db = []

class NoteCreate(BaseModel):
    title: str
    content: str
    tags: Optional[List[str]] = []
    read: bool

class Note(NoteCreate):
    id: str
    read: bool
    created_at: datetime
    updated_at: datetime

@app.get("/notes", response_model=List[Note])
def get_notes():
    return notes_db

@app.post("/notes", response_model=Note)
def create_note(note: NoteCreate):
    new_note = Note(
        id=str(uuid4()),
        title=note.title,
        content=note.content,
        tags=note.tags or [],
        read=note.read,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    notes_db.append(new_note)
    return new_note

@app.get("/notes/{note_id}", response_model=Note)
def get_note(note_id: str):
    for note in notes_db:
        if note.id == note_id:
            return note
    return {"error": "Note not found"}

@app.put("/notes/{note_id}", response_model=Note)
def update_note(note_id: str, updated_note: NoteCreate):
    for index, note in enumerate(notes_db):
        if note.id == note_id:
            updated = note.copy(update={
                "title": updated_note.title,
                "content": updated_note.content,
                "tags": updated_note.tags or [],
                "read": updated_note.read,
                "updated_at": datetime.utcnow()
            })
            notes_db[index] = updated
            return updated
    return {"error": "Note not found"}

@app.delete("/notes/{note_id}")
def delete_note(note_id: str):
    global notes_db
    notes_db = [note for note in notes_db if note.id != note_id]
    return {"message": "Note deleted"}
