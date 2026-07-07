import { useState } from "react";
import emailjs from "@emailjs/browser";
import EmptyState from "./EmptyState";

function wordCount(text) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export default function Editor({ note, folders, onDelete, onChange, onToggleFolder }) {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);
  const [showFolders, setShowFolders] = useState(false);

  if (!note) return <div className="editor"><EmptyState /></div>;

  const handleEmail = async () => {
    if (!note.title && !note.body) return;
    setSending(true);
    setStatus(null);
    try {
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        {
          title: note.title || "Untitled",
          body: note.body || "No content.",
          to_email: process.env.REACT_APP_MY_EMAIL,
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );
      setStatus("sent");
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
    } finally {
      setSending(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

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
        <div className="editor-actions">
          <div className="folder-tag-wrapper">
            <button
              className="folder-tag-btn"
              onClick={() => setShowFolders(!showFolders)}
            >
              📁 Folders
            </button>
            {showFolders && (
              <div className="folder-dropdown">
                {folders.length === 0 && (
                  <p className="folder-dropdown-empty">No folders yet</p>
                )}
                {folders.map((folder) => (
                  <label key={folder.id} className="folder-dropdown-item">
                    <input
                      type="checkbox"
                      checked={note.folder_ids?.includes(folder.id) || false}
                      onChange={() => onToggleFolder(note.id, folder.id)}
                    />
                    {folder.name}
                  </label>
                ))}
              </div>
            )}
          </div>
          <button
            className="email-btn"
            onClick={handleEmail}
            disabled={sending}
          >
            {sending ? "Sending…" : status === "sent" ? "✓ Sent!" : status === "error" ? "Failed" : "Send Email"}
          </button>
          <button className="delete-btn" onClick={onDelete}>
            Delete
          </button>
        </div>
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