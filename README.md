# 📝 PassNotes

A sleek, modern note-taking app built with **React**, **TypeScript**, and **Tailwind CSS**, powered by a **FastAPI** backend.

PassNotes is a minimalist dark-mode note app for creating, organizing, and managing thoughts. Add tags, search through your notes, and toggle their read status with ease — all in a beautifully responsive UI.

---

## 📸 Preview

![PassNotes screenshot](screenshot.png)

> _Screenshot of the app UI – dark mode note cards with filters and tags._

---

## 🚀 Features

- ✅ **Create, edit, and delete** notes with title, content, and tags
- 🔎 **Search and filter** by title, content, and tag
- 🏷️ **Tag UI** with click-to-toggle filtering
- 📚 **Multi-select + toggle read/unread**
- 📅 **Readable timestamps** (e.g., "Sep 18, 2025, 2:45 PM")
- 📱 **Mobile-friendly** layout with Tailwind CSS
- 💨 **FastAPI backend** with UUID-based notes and timestamp tracking

---

## 🛠️ Tech Stack

| Layer     | Stack                        |
|-----------|------------------------------|
| Frontend  | React, TypeScript, Tailwind CSS |
| Backend   | FastAPI (Python)             |
| Styling   | Tailwind CSS                 |
| Icons     | react-icons                  |
| State     | useState + custom hook (`useData`) |

---

## 🧪 Getting Started

### 📦 Frontend

```bash
cd frontend
npm install
npm run dev
