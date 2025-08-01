// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const api = 'https://diplomatic-respect-production.up.railway.app/api/notes';

function Home() {
  const [note, setNote] = useState('');
  const [expireIn, setExpireIn] = useState(120);
  const navigate = useNavigate();

  const createNote = async () => {
    try {
      const res = await axios.post(api, {
        content: note,
        expireInMinutes: expireIn,
      });
      navigate(`/note/${res.data.link}`);
    } catch (err) {
      alert('Failed to create note');
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">New Note</h1>

      <textarea
        className="w-full p-2 border rounded mb-2"
        rows={8}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <input
        type="number"
        className="p-2 border rounded mb-2 w-full"
        value={expireIn}
        onChange={(e) => setExpireIn(e.target.value)}
        placeholder="Expires in minutes"
      />

      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={createNote}
      >
        Create & Get Link
      </button>
    </div>
  );
}

function NoteEditor() {
  const { linkId } = useParams();
  const [note, setNote] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    axios
      .get(`${api}/${linkId}`)
      .then((res) => {
        if (res.data.message === 'Note expired') {
          setNote('Note expired');
        } else {
          setNote(res.data.content);
        }
        setLoaded(true);
      })
      .catch(() => {
        setNote('Note not found');
        setLoaded(true);
      });
  }, [linkId]);

  const saveNote = async () => {
    try {
      await axios.put(`${api}/${linkId}`, {
        content: note,
      });
      alert('Saved!');
    } catch {
      alert('Failed to save');
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Note</h1>
      {loaded ? (
        <>
          <textarea
            className="w-full p-2 border rounded mb-2"
            rows={10}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={saveNote}
          >
            Save
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/note/:linkId" element={<NoteEditor />} />
      </Routes>
    </Router>
  );
}
