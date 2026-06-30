import NoteList from "./NoteList";

export default function Sidebar({ notes, activeId, onSelect, onAdd }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">
          Notes <span className="note-count">{notes.length}</span>
        </span>
        <button className="add-btn" onClick={onAdd} aria-label="New note">
          ＋
        </button>
      </div>
      <NoteList notes={notes} activeId={activeId} onSelect={onSelect} />
    </div>
  );
}
