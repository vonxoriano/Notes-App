import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

function createLocalNote() {
  return {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: "",
    body: "",
    created_at: new Date().toISOString(),
    folder_ids: [],
  };
}

export default function useNotes() {
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [activeFolderId, setActiveFolderId] = useState(null);
  const [loading, setLoading] = useState(true);

  const active = notes.find((n) => n.id === activeId);

  const filteredNotes = activeFolderId
    ? notes.filter((n) =>
        n.folder_ids && n.folder_ids.includes(activeFolderId)
      )
    : notes;

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    fetchFolders();
    fetchNotes();
  }, []);

  const fetchFolders = async () => {
    if (!supabase) {
      setFolders([]);
      return;
    }

    const { data, error } = await supabase
      .from("folders")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) console.error("Error fetching folders:", error.message);
    else setFolders(data);
  };

  const fetchNotes = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("notes")
      .select("*, note_folders(folder_id)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notes:", error.message);
    } else {
      const notesWithFolders = data.map((n) => ({
        ...n,
        folder_ids: n.note_folders.map((nf) => nf.folder_id),
      }));
      setNotes(notesWithFolders);
      if (notesWithFolders.length) setActiveId(notesWithFolders[0].id);
    }
    setLoading(false);
  };

  const addNote = async () => {
    if (!supabase) {
      const newNote = createLocalNote();
      setNotes((prev) => [newNote, ...prev]);
      setActiveId(newNote.id);
      return;
    }

    const { data, error } = await supabase
      .from("notes")
      .insert([{ title: "", body: "" }])
      .select("*, note_folders(folder_id)")
      .single();

    if (error) { console.error("Error adding note:", error.message); return; }
    const newNote = { ...data, folder_ids: [] };
    setNotes((prev) => [newNote, ...prev]);
    setActiveId(newNote.id);
  };

  const deleteNote = async () => {
    if (!activeId) return;

    if (!supabase) {
      const remaining = notes.filter((n) => n.id !== activeId);
      setNotes(remaining);
      setActiveId(remaining.length ? remaining[0].id : null);
      return;
    }

    const { error } = await supabase.from("notes").delete().eq("id", activeId);
    if (error) { console.error("Error deleting note:", error.message); return; }
    const remaining = notes.filter((n) => n.id !== activeId);
    setNotes(remaining);
    setActiveId(remaining.length ? remaining[0].id : null);
  };

  const updateNote = async (field, value) => {
    setNotes((prev) => prev.map((n) => (n.id === activeId ? { ...n, [field]: value } : n)));

    if (!supabase || !activeId) return;

    const { error } = await supabase
      .from("notes")
      .update({ [field]: value })
      .eq("id", activeId);
    if (error) console.error("Error updating note:", error.message);
  };

  const addFolder = async (name) => {
    if (!supabase) {
      const newFolder = { id: `local-folder-${Date.now()}`, name };
      setFolders((prev) => [...prev, newFolder]);
      return;
    }

    const { data, error } = await supabase
      .from("folders")
      .insert([{ name }])
      .select()
      .single();
    if (error) { console.error("Error adding folder:", error.message); return; }
    setFolders((prev) => [...prev, data]);
  };

  const deleteFolder = async (folderId) => {
    if (!supabase) {
      setFolders((prev) => prev.filter((f) => f.id !== folderId));
      setNotes((prev) => prev.map((n) => ({
        ...n,
        folder_ids: n.folder_ids.filter((id) => id !== folderId),
      })));
      if (activeFolderId === folderId) setActiveFolderId(null);
      return;
    }

    const { error } = await supabase.from("folders").delete().eq("id", folderId);
    if (error) { console.error("Error deleting folder:", error.message); return; }
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
    setNotes((prev) => prev.map((n) => ({
      ...n,
      folder_ids: n.folder_ids.filter((id) => id !== folderId),
    })));
    if (activeFolderId === folderId) setActiveFolderId(null);
  };

  const toggleNoteFolder = async (noteId, folderId) => {
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;

    const hasFolder = note.folder_ids.includes(folderId);

    if (!supabase) {
      setNotes((prev) => prev.map((n) =>
        n.id === noteId
          ? {
              ...n,
              folder_ids: hasFolder
                ? n.folder_ids.filter((id) => id !== folderId)
                : [...n.folder_ids, folderId],
            }
          : n
      ));
      return;
    }

    if (hasFolder) {
      await supabase.from("note_folders")
        .delete()
        .eq("note_id", noteId)
        .eq("folder_id", folderId);
    } else {
      await supabase.from("note_folders")
        .insert([{ note_id: noteId, folder_id: folderId }]);
    }

    setNotes((prev) => prev.map((n) =>
      n.id === noteId
        ? {
            ...n,
            folder_ids: hasFolder
              ? n.folder_ids.filter((id) => id !== folderId)
              : [...n.folder_ids, folderId],
          }
        : n
    ));
  };

  return {
    notes,
    filteredNotes,
    folders,
    activeId,
    activeFolderId,
    active,
    loading,
    setActiveId,
    setActiveFolderId,
    addNote,
    deleteNote,
    updateNote,
    addFolder,
    deleteFolder,
    toggleNoteFolder,
  };
}