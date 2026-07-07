import "./App.css";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import useNotes from "./hooks/useNotes";

export default function App() {
  const { notes, activeId, active, setActiveId, addNote, deleteNote, updateNote } = useNotes();

  return (
    <div className="App">
      <Sidebar
        notes={notes}
        activeId={activeId}
        onSelect={setActiveId}
        onAdd={addNote}
        onDeselect={() => setActiveId(null)}
      />
      <Editor note={active} onDelete={deleteNote} onChange={updateNote} />
    </div>
  );
}