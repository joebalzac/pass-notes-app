import { useEffect, useState } from "react";
import useData, { Note } from "../Hooks/useData";
import axios from "axios";
import { FaPencil, FaTrashCan } from "react-icons/fa6";

const NoteCard = () => {
  const { notes, isLoading, error } = useData();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [allNotes, setAllNotes] = useState(notes);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingContent, setEditingContent] = useState("");
  const [editingTags, setEditingTags] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sortNewestFirst, setNewestFirst] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchNote, setSearchNote] = useState<string>("");
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [tags, setTags] = useState("");

  useEffect(() => {
    setAllNotes(notes);
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

  // const allSelectedRead = selectedNoteIds.every(
  //   (id) => allNotes.find((note) => note.id === id)?.read === true
  // );

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
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 px-6 py-12 font-sans transition-all">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-semibold tracking-tight mb-2 font-mono text-white">
          PassNotes
        </h1>
        <p className="text-gray-500 text-sm">
          A clean space to leave daily notes 💬
        </p>
      </div>

      {/* Create Note Section */}
      <div className="max-w-xl mx-auto mb-10 space-y-4">
        <input
          className="w-full bg-[#1a1a1a] text-white placeholder-gray-500 rounded-md p-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#f3f97a] transition"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full bg-[#1a1a1a] text-white placeholder-gray-500 rounded-md p-3 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-[#f3f97a] transition"
          placeholder="Write a note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          className="w-full bg-[#1a1a1a] text-white placeholder-gray-500 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#f3f97a] transition"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <button
          className="bg-[#f3f97a] hover:bg-[#e5f370] transition px-5 py-2 rounded-md text-black font-medium cursor-pointer"
          onClick={handleAddNote}
        >
          Share Note
        </button>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        {/* Search Input */}
        <input
          type="text"
          value={searchNote}
          onChange={(e) => setSearchNote(e.target.value)}
          placeholder="Search notes..."
          className="flex-1 bg-[#1a1a1a] text-white placeholder-gray-500 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#f3f97a] transition"
        />

        {/* Tag Filters */}
        <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
          {uniqueTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition hover:scale-105 ${
                activeTag === tag
                  ? "bg-[#f3f97a] text-black shadow"
                  : "bg-[#1a1a1a] text-white border-[#333] hover:bg-[#2a2a2a]"
              }`}
            >
              {tag}
            </button>
          ))}

          {/* Toggle Sort button */}
          <button
            onClick={() => setNewestFirst((prev) => !prev)}
            className="text-xs sm:text-sm bg-[#2a2a2a] text-white px-4 py-2 rounded-md hover:bg-[#3a3a3a] transition cursor-pointer"
          >
            Sort: {sortNewestFirst ? "Newest → Oldest" : "Oldest → Newest"}
          </button>
        </div>

        {/* Mark as Read Button */}
        <button
          onClick={toggleReadStatus}
          disabled={selectedNoteIds.length === 0}
          className={`rounded-md transition px-4 py-2 text-xs sm:text-sm font-medium ${
            selectedNoteIds.length
              ? "bg-pink-400 hover:bg-pink-300 text-black"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          Toggle Read Status
        </button>
      </div>

      {/* Notes Section  */}
      <div className="grid grid-cols-2 w-full">
        <div>
          {sortedFilteredNotes.map((note) => (
            <div
              className={`border rounded-lg px-4 py-3 shadow-sm hover:shadow-md bg-gradient-to-br cursor-pointer ${
                note.read
                  ? "from-[#1a1a1a] via-[#121212] to-[#1f1f1f] border-[#2a2a2a]"
                  : "from-[#1a1a1a] via-[#161616] to-[#222] border-pink-400"
              } space-y-2 max-w-2xl mx-auto my-4`}
              onClick={() => handleSelectNote(note)}
            >
              {editingId === note.id ? (
                <div className="space-y-3">
                  <input
                    className="w-full bg-[#101010] text-white placeholder-gray-500 border border-[#2a2a2a] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#f3f97a] transition"
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                  />
                  <input
                    className="w-full bg-[#101010] text-white placeholder-gray-500 border border-[#2a2a2a] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#f3f97a] transition"
                    type="text"
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                  />
                  <input
                    className="w-full bg-[#101010] text-white placeholder-gray-500 border border-[#2a2a2a] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#f3f97a] transition"
                    type="text"
                    value={editingTags}
                    onChange={(e) => setEditingTags(e.target.value)}
                  />
                  <button
                    className="bg-[#b0fdb6] hover:bg-[#a1f2aa] text-black px-4 py-2 rounded-md transition font-medium cursor-pointer"
                    onClick={handleSaveNote}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedNoteIds.includes(note.id)}
                        onChange={(e) => handleInputChange(e, note.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="accent-[#f3f97a] cursor-pointer"
                      />
                      <h3 className="text-sm sm:text-base font-semibold text-white truncate max-w-[12rem] sm:max-w-xs">
                        {note.title}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-[#1e1e1e] text-[#f3f97a] text-[10px] px-2 py-[2px] rounded-full border border-[#2a2a2a]"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                    <span>
                      Updated: {formatDateTime(String(note.updated_at))}
                    </span>
                    <div className="flex gap-3 text-gray-400">
                      <button
                        className="hover:text-red-400 transition"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        <FaTrashCan />
                      </button>
                      <button
                        className="hover:text-yellow-300 transition"
                        onClick={() => handleEditNote(note)}
                      >
                        <FaPencil />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div>
          {selectedNote && (
            <div className="border rounded-lg px-4 py-3 sm:px-5 sm:py-4 transition-all shadow-sm hover:shadow-md bg-gradient-to-br from-[#1a1a1a] via-[#121212] to-[#1f1f1f] border-[#2a2a2a] cursor-pointer">
              <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight leading-tight">
                {selectedNote.title}
              </h3>

              <p className="text-sm text-gray-400 leading-normal mt-1">
                {selectedNote.content}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
