export default function NoteItem({ note, isActive, onSelect }) {
  const initial = (note.title || "U").trim().charAt(0).toUpperCase();

  return (
    <div
      className={`note-item ${isActive ? "active" : ""}`}
      onClick={() => onSelect(note.id)}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect(note.id)}
    >
      <div className="note-avatar">{initial}</div>
      <div className="note-item-text">
        <div className="note-item-title">{note.title || "Untitled"}</div>
        <div className="note-item-preview">{note.body.split("\n")[0] || "No content"}</div>
      </div>
    </div>
  );
}