import axios from "axios";
import { useEffect, useState } from "react";

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  read: boolean;
}

const useData = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:8000/notes");
      const data = response.data;
      setNotes(data);
    } catch (error) {
      setError("An unknown error has occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  console.log("big data", notes);

  return { notes, error, isLoading };
};

export default useData;
