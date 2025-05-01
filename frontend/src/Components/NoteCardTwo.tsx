import { useEffect, useState } from "react";
import useData, { Note } from "../Hooks/useData";
import axios from "axios";
import { FaPencil, FaTrashCan } from "react-icons/fa6";

const NoteCardTwo = () => {
  const { notes, isLoading, error } = useData();

  useEffect(() => {
    if (error) {
      const savedNotes = localStorage.getItem("passnotes");
      if (savedNotes) {
        setAllNotes(JSON.parse(savedNotes));
      }
    }
  });

  const [allNotes, setAllNotes] = useState(notes);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  
  const [editingTitle, setEditingTitle] = useState("");
  const [editingContent, setEditingContent] = useState("");
  const [editingTags, setEditingTags] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [sortNewestFirst, setNewestFirst] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchNote, setSearchNote] = useState<string>("");
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);
 

  useEffect(() => {
    setAllNotes(notes);

    if (notes.length) {
      localStorage.setItem("passnotes", JSON.stringify(notes));
    }
  }, [notes]);

  if (isLoading)
    return <div className="text-center text-gray-400">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-red-400">Something went wrong.</div>
    );

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

  const handleEditNote = (note: Note) => {
    setEditingTitle(note.title);
    setEditingContent(note.content);
    setEditingTags(note.tags.join(", "));
    setEditingId(note.id);
  };

  const handleSaveNote = async () => {
    if (!editingId) return;

    const currentNote = allNotes.find((n) => n.id === editingId);
    if (!currentNote) return;

    try {
      const res = await axios.put(`http://localhost:8000/notes/${editingId}`, {
        title: editingTitle,
        content: editingContent,
        tags: editingTags.split(",").map((tag) => tag.trim()),
        read: currentNote.read,
        created_at: currentNote.created_at,
        updated_at: currentNote.updated_at,
      });

      setAllNotes((prev) =>
        prev.map((note) => (note.id === editingId ? res.data : note))
      );

      setEditingTitle("");
      setEditingContent("");
      setEditingTags("");
      setEditingId(null);
    } catch (err) {
      console.log("Unable to edit note", err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    setSelectedNoteIds(
      e.target.checked
        ? [...selectedNoteIds, id]
        : selectedNoteIds.filter((noteId) => noteId !== id)
    );
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setAllNotes(
      allNotes.map((n) => (n.id === note.id ? { ...n, read: true } : n))
    );
  };

  const toggleReadStatus = () => {
    setAllNotes((prev) =>
      prev.map((note) =>
        selectedNoteIds.includes(note.id) ? { ...note, read: !note.read } : note
      )
    );
    setSelectedNoteIds([]);
  };

  const uniqueTags = Array.from(
    new Set(allNotes.flatMap((note) => note.tags.map((tag) => tag.trim())))
  );

  const filteredNotes = allNotes.filter((note) => {
    const matchesTag = activeTag ? note.tags.includes(activeTag) : true;
    const matchesSearch = searchNote
      ? note.title.toLowerCase().includes(searchNote.toLocaleLowerCase()) ||
        note.content.toLowerCase().includes(searchNote.toLowerCase())
      : true;
    return matchesTag && matchesSearch;
  });

  const sortedFilteredNotes = filteredNotes.sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortNewestFirst ? dateA - dateB : dateB - dateA;
  });

  const formatDateTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <div>
        <h1>PassNotes</h1>
        <p>A clean space to leave daily notes 💬</p>
      </div>

      <div>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Write a note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <button onClick={handleAddNote}>Share Note</button>
      </div>

      <div>
        <input
          type="text"
          value={searchNote}
          onChange={(e) => setSearchNote(e.target.value)}
          placeholder="Search notes..."
        />

        <div>
          {uniqueTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            >
              {tag}
            </button>
          ))}

          <button onClick={() => setNewestFirst((prev) => !prev)}>
            Sort: {sortNewestFirst ? "Newest → Oldest" : "Oldest → Newest"}
          </button>

          <button
            onClick={toggleReadStatus}
            disabled={selectedNoteIds.length === 0}
          >
            Toggle Read Status
          </button>
        </div>
      </div>

      <div>
        <div>
          {sortedFilteredNotes.map((note) => (
            <div key={note.id} onClick={() => handleSelectNote(note)}>
              {editingId === note.id ? (
                <div>
                  <input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                  />
                  <input
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                  />
                  <input
                    value={editingTags}
                    onChange={(e) => setEditingTags(e.target.value)}
                  />
                  <button onClick={handleSaveNote}>Save</button>
                </div>
              ) : (
                <>
                  <div>
                    <input
                      type="checkbox"
                      checked={selectedNoteIds.includes(note.id)}
                      onChange={(e) => handleInputChange(e, note.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <h3>{note.title}</h3>
                    <div>{note.tags.join(", ")}</div>
                  </div>
                  <div>
                    <span>
                      Updated: {formatDateTime(String(note.updated_at))}
                    </span>
                    <button onClick={() => handleDeleteNote(note.id)}>
                      Delete
                    </button>
                    <button onClick={() => handleEditNote(note)}>Edit</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div>
          {selectedNote && (
            <div>
              <h3>{selectedNote.title}</h3>
              <p>{selectedNote.content}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteCardTwo;
