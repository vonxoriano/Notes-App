import { useState } from "react";
import "./App.css";

const initialNotes = [
  { id: 1, title: "Welcome to Notes", body: "A clean, minimal space to capture your thoughts.\n\nClick + to add a new note.", date: new Date().toLocaleDateString() },
];

export default function App() {
  const [notes, setNotes] = useState(initialNotes);
  const [activeId, setActiveId] = useState(1);
  const [nextId, setNextId] = useState(2);

  const active = notes.find((n) => n.id === activeId);

  const addNote = () => {
    const newNote = { id: nextId, title: "", body: "", date: new Date().toLocaleDateString() };
    setNotes([newNote, ...notes]);
    setActiveId(nextId);
    setNextId(nextId + 1);
  };

  const deleteNote = () => {
    const remaining = notes.filter((n) => n.id !== activeId);
    setNotes(remaining);
    setActiveId(remaining.length ? remaining[0].id : null);
  };

  const updateNote = (field, value) => {
    setNotes(notes.map((n) => (n.id === activeId ? { ...n, [field]: value } : n)));
  };

  return (
    <div className="App">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <span className="sidebar-title">
            Notes <span className="note-count">{notes.length}</span>
          </span>
          <button className="add-btn" onClick={addNote} aria-label="New note">＋</button>
        </div>
        <div className="note-list">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`note-item ${note.id === activeId ? "active" : ""}`}
              onClick={() => setActiveId(note.id)}
            >
              <div className="note-item-title">{note.title || "Untitled"}</div>
              <div className="note-item-preview">{note.body.split("\n")[0] || "No content"}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="editor">
        {active ? (
          <>
            <div className="editor-header">
              <input
                className="title-input"
                value={active.title}
                placeholder="Title"
                onChange={(e) => updateNote("title", e.target.value)}
                autoFocus
              />
              <button className="delete-btn" onClick={deleteNote} aria-label="Delete note">Delete</button>
            </div>
            <div className="note-meta">{active.date}</div>
            <textarea
              className="body-input"
              value={active.body}
              placeholder="Start writing…"
              onChange={(e) => updateNote("body", e.target.value)}
            />
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <p className="empty-text">No notes yet — click + to start</p>
          </div>
        )}
      </div>
    </div>
  );
}