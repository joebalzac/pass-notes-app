import { useState } from "react";
import useData, { Note } from "../Hooks/useData";
import axios from "axios";

const NoteCard = () => {
  const { notes, isLoading, error } = useData();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [allNotes, setAllNotes] = useState(notes);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingContent, setEditingContent] = useState("");
  const [editingTags, setEditingTags] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [tags, setTags] = useState("");

  if (isLoading) {
    return <div>Loading....</div>;
  }

  if (error) {
    return <div>An unknown error has ocurred</div>;
  }

  const handleAddNote = async () => {
    try {
      const res = await axios.post("http://localhost:8000/notes", {
        title,
        content,
        tags: tags.split(",").map((tag) => tag.trim()),
      });
      setAllNotes([...allNotes, res.data]);
      setTitle("");
      setContent("");
      setTags("");
    } catch (err) {
      console.log("Failed to add an input ");
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await axios.delete(`http://localhost:8000/notes/${noteId}`);
      setAllNotes((prev) => prev.filter((note) => note.id !== noteId));
    } catch (err) {
      console.log("unable to delete note");
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingTitle(note.title);
    setEditingContent(note.content);
    setEditingTags(note.tags.join(", "));
    setEditingId(note.id);
  };

  const handleSaveNote = async () => {
    if (!editingId) return;

    try {
      const res = await axios.put(`http://localhost:8000/notes/${editingId}`, {
        title: editingTitle,
        content: editingContent,
        tags: editingTags,
      });

      setAllNotes((prev) =>
        prev.map((note) => (note.id === editingId ? res.data : note))
      );

      setEditingTitle("");
      setEditingContent("");
      setEditingTags("");
      setEditingId(null);
    } catch (err) {
      console.log("unable to edit note", err);
    }
  };

  return (
    <div>
      <input
        placeholder="Title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        placeholder="Tags"
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <button onClick={handleAddNote}>Add Note</button>

      <div>
        {allNotes.map((note) => (
          <div>
            {editingId === note.id ? (
              <div>
                <input
                  type="text"
                  onChange={(e) => setEditingTitle(e.target.value)}
                />
                <input
                  type="text"
                  onChange={(e) => setEditingContent(e.target.value)}
                />
                <input
                  type="text"
                  onChange={(e) => setEditingTags(e.target.value)}
                />
                <button onClick={handleSaveNote}>Save</button>
              </div>
            ) : (
              <div>
                <div key={note.id}>
                  <h3>{note.title}</h3>
                  <p>{note.content}</p>
                  <p>{note.tags}</p>
                  <button onClick={() => handleDeleteNote(note.id)}>
                    Delete Note
                  </button>
                  <button onClick={() => handleEditNote(note)}>
                    Edit Note
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteCard;
