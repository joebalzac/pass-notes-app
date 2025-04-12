import { useState } from "react";
import useData from "../Hooks/useData";
import axios from "axios";

const NoteCard = () => {
  const { notes, isLoading, error } = useData();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [allNotes, setAllNotes] = useState(notes);
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

  const handleDeleteNote = async (noteId: number) => {
    try {
      await axios.delete(`http://localhost:8000/notes/${noteId}`);
      setAllNotes((prev) => prev.filter((note) => note.id !== noteId));
    } catch (err) {
      console.log("unable to delete note");
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
          <div key={note.id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button onClick={() => handleDeleteNote(note.id)}>
              Delete Note
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteCard;
