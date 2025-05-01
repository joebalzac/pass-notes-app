import React, { useState } from "react";
import useData, { Note } from "../Hooks/useData";
import axios, { all } from "axios";

const NoteCardDemo = () => {
  const { notes, isLoading, error } = useData();

  const [allNotes, setAllNotes] = useState(notes);

  const [title, setTitle] = useState("");
  const [editingTitle, setEditingTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [content, setContent] = useState("");
  const [editingContent, setEditingContent] = useState("");

  const [tags, setTags] = useState("");
  const [editingTags, setEditingTags] = useState("");

  const handleAddNote = async () => {
    try {
      const res = await axios.post("http://localhost:8000/notes", {
        title,
        content,
        tags: tags.split(",").map((tag) => tag.trim()),
        read: false,
      });
      setAllNotes([...allNotes, res.data]);
      setTitle("");
      setContent("");
      setTags("");
    } catch (err) {
      if (err) {
        console.log("An unknown error has occurred");
      }
    }
  };

  const handleDeleteNote = async (notedId: string) => {
    await axios.delete(`http://localhost:8000/notes/${notedId}`);
    setAllNotes(allNotes.filter((note) => note.id !== notedId));
  };

  const handleEditNote = (note: Note) => {
    setEditingTitle(note.title);
    setEditingContent(note.content);
    setEditingTags(note.tags.join(","));
    setEditingId(note.id);
  };

  const handleSaveNote = async () => {
    if (!editingId) return;

    const currentNote = allNotes.find((n) => n.id === editingId);

    try {
      const res = await axios.put(`http://localhost:8000/notes/${editingId}`, {
        title: editingTitle,
        content: editingContent,
        tags: editingTags.split(",").map((tag) => tag.trim()),
        read: currentNote?.read,
        created_at: currentNote?.created_at,
        updated_at: currentNote?.updated_at,
      });
      setAllNotes((prev) =>
        prev.map((note) => (note.id === editingId ? res.data : note))
      );
      setEditingId("");
      setEditingContent("");
      setEditingTags("");
      setEditingId(null);
    } catch (err) {
      if (err) {
        console.log("Unable to edit");
      }
    }
  };

  return <div>NoteCardDemo</div>;
};

export default NoteCardDemo;
