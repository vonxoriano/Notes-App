import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function useNotes() {
  const [notes, setNotes] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);

  const active = notes.find((n) => n.id === activeId);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notes:", error.message);
    } else {
      setNotes(data);
      if (data.length) setActiveId(data[0].id);
    }
    setLoading(false);
  };

  const addNote = async () => {
    const { data, error } = await supabase
      .from("notes")
      .insert([{ title: "", body: "" }])
      .select()
      .single();

    if (error) {
      console.error("Error adding note:", error.message);
      return;
    }
    setNotes([data, ...notes]);
    setActiveId(data.id);
  };

  const deleteNote = async () => {
    if (!activeId) return;
    const { error } = await supabase.from("notes").delete().eq("id", activeId);

    if (error) {
      console.error("Error deleting note:", error.message);
      return;
    }
    const remaining = notes.filter((n) => n.id !== activeId);
    setNotes(remaining);
    setActiveId(remaining.length ? remaining[0].id : null);
  };

  const updateNote = async (field, value) => {
    setNotes(notes.map((n) => (n.id === activeId ? { ...n, [field]: value } : n)));

    const { error } = await supabase
      .from("notes")
      .update({ [field]: value })
      .eq("id", activeId);

    if (error) console.error("Error updating note:", error.message);
  };

  return {
    notes,
    activeId,
    active,
    loading,
    setActiveId,
    addNote,
    deleteNote,
    updateNote,
  };
}