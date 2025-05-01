import React, { useState } from "react";
import useData, { Note } from "../Hooks/useData";
import axios, { all } from "axios";

const NoteCardDemo = () => {
  const { notes, isLoading, error } = useData();

  const [allNotes, setAllNotes] = useState(notes);

  const [title, setTitle] = useState("");
  const [editingTitle, setEditingTitle] = useState("");
  const [editingId, setEditingId] = useState<string>();

  const [content, setContent] = useState("");
  const [editingContent, setEditingContent] = useState("");

  const [tags, setTags] = useState("");
  const [editingTags, setEditingTags] = useState<string[]>([]);

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
    setEditingTags(note.tags);
    setEditingId(note.id);
  };

  const handleSaveNote = async (noteId: string) => {
    if (!editingId) return;

    try {
      const res = await axios.put(`http://localhost:8000/notes/${noteId}`);
    } catch (err) {
      if (err) {
        console.log("Unable to edit");
      }
    }
  };

  return <div>NoteCardDemo</div>;
};

export default NoteCardDemo;
