import "./App.css";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import useNotes from "./hooks/useNotes";

export default function App() {
  const {
    filteredNotes,
    folders,
    activeId,
    activeFolderId,
    active,
    setActiveId,
    setActiveFolderId,
    addNote,
    deleteNote,
    updateNote,
    addFolder,
    deleteFolder,
    toggleNoteFolder,
  } = useNotes();

  return (
    <div className="App">
      <Sidebar
        notes={filteredNotes || []}
        folders={folders || []}
        activeId={activeId}
        activeFolderId={activeFolderId}
        onSelect={setActiveId}
        onAdd={addNote}
        onDeselect={() => setActiveId(null)}
        onAddFolder={addFolder}
        onDeleteFolder={deleteFolder}
        onSelectFolder={setActiveFolderId}
      />
      <Editor
        note={active}
        folders={folders || []}
        onDelete={deleteNote}
        onChange={updateNote}
        onToggleFolder={toggleNoteFolder}
      />
    </div>
  );
}