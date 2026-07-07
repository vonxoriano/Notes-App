import { useState } from "react";

export default function FolderList({
  folders,
  activeFolderId,
  onSelectFolder,
  onAddFolder,
  onDeleteFolder,
}) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");

  const handleAdd = () => {
    if (newName.trim()) {
      onAddFolder(newName.trim());
      setNewName("");
      setAdding(false);
    }
  };

  return (
    <div className="folder-section">
      <div className="folder-header">
        <span className="folder-label">Folders</span>
        <button className="folder-add-btn" onClick={() => setAdding(!adding)}>
          ＋
        </button>
      </div>

      {adding && (
        <div className="folder-input-row">
          <input
            className="folder-input"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Folder name"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            autoFocus
          />
          <button className="folder-confirm-btn" onClick={handleAdd}>Add</button>
        </div>
      )}

      <div
        className={`folder-item ${activeFolderId === null ? "active" : ""}`}
        onClick={() => onSelectFolder(null)}
      >
        📋 All Notes
      </div>

      {folders.map((folder) => (
        <div
          key={folder.id}
          className={`folder-item ${activeFolderId === folder.id ? "active" : ""}`}
          onClick={() => onSelectFolder(folder.id)}
        >
          <span>📁 {folder.name}</span>
          <button
            className="folder-delete-btn"
            onClick={(e) => { e.stopPropagation(); onDeleteFolder(folder.id); }}
            aria-label="Delete folder"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}