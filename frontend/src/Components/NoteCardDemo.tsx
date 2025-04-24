import { useEffect, useState } from "react";
import useData from "../Hooks/useData";
import axios from "axios";

const NoteCardDemo = () => {
  const { notes, isLoading, error } = useData();
  const [allNotes, setAllNotes] = useState(notes);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const [editingTitle, setEditingTitle] = useState("");
  const [editingContent, setEditingContent] = useState("");
  const [editingTags, setEditingTags] = useState("");
  const [editingId, setEditingId] = useState("");

  useEffect(() => {
    setAllNotes(notes);
  });

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
      console.log("Failed to add note");
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await axios.delete(`http://localhost:8000/notes/${noteId}`);
      setAllNotes((prev) => prev.filter((note) => note.id !== noteId));
    } catch (err) {
      console.log("Unable to delete note");
    }
  };

  if (isLoading) {
    <div>Loading....</div>;
  }

  if (error) {
    <div>An unknown error has ocurred</div>;
  }

  return <div>NoteCardDemo</div>;
};

export default NoteCardDemo;
