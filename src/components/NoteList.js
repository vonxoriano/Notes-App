import NoteItem from "./NoteItem";

export default function NoteList({ notes, activeId, onSelect }) {
  return (
    <div className="note-list">
      {notes.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          isActive={note.id === activeId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
