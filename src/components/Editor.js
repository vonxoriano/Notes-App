import EmptyState from "./EmptyState";

function wordCount(text) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export default function Editor({ note, onDelete, onChange }) {
  if (!note) return <div className="editor"><EmptyState /></div>;

  return (
    <div className="editor">
      <div className="editor-header">
        <input
          className="title-input"
          value={note.title}
          placeholder="Title"
          onChange={(e) => onChange("title", e.target.value)}
          autoFocus
        />
        <button className="delete-btn" onClick={onDelete} aria-label="Delete note">
          Delete
        </button>
      </div>
      <div className="note-meta">
        <span>{new Date(note.created_at).toLocaleDateString()}</span>
        <span>{wordCount(note.body)} words</span>
      </div>
      <textarea
        className="body-input"
        value={note.body}
        placeholder="Start writing…"
        onChange={(e) => onChange("body", e.target.value)}
      />
    </div>
  );
}