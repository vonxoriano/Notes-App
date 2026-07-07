import NoteList from "./NoteList";
import FolderList from "./FolderList";

export default function Sidebar({
  notes,
  folders,
  activeId,
  activeFolderId,
  onSelect,
  onAdd,
  onDeselect,
  onAddFolder,
  onDeleteFolder,
  onSelectFolder,
}) {
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

      <FolderList
        folders={folders}
        activeFolderId={activeFolderId}
        onSelectFolder={onSelectFolder}
        onAddFolder={onAddFolder}
        onDeleteFolder={onDeleteFolder}
      />

      <NoteList notes={notes} activeId={activeId} onSelect={onSelect} />

      {notes.length > 0 && (
        <div className="sidebar-footer">
          <button className="deselect-btn" onClick={onDeselect}>
            🐱 Cat Fact
          </button>
        </div>
      )}
    </div>
  );
}