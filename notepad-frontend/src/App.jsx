import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [note, setNote] = useState('');
  const [linkId, setLinkId] = useState('');
  const [expireIn, setExpireIn] = useState(120);
  const [message, setMessage] = useState('');

  const api = 'https://diplomatic-respect-production.up.railway.app/api/notes';

  const createNote = async () => {
    try {
      const res = await axios.post(api, {
        content: note,
        expireInMinutes: expireIn,
      });
      setLinkId(res.data.link);
      setMessage('Note created successfully!');
    } catch (err) {
      setMessage('Failed to create note.');
    }
  };

  const fetchNote = async () => {
    if (!linkId) return;
    try {
      const res = await axios.get(`${api}/${linkId}`);
      if (res.data.message === 'Note expired') {
        setMessage('Note expired');
        setNote('');
      } else {
        setNote(res.data.content);
        setMessage('Note fetched');
      }
    } catch {
      setMessage('Failed to fetch note');
    }
  };

  const updateNote = async () => {
    if (!linkId) return;
    try {
      await axios.put(`${api}/${linkId}`, {
        content: note,
        expireInMinutes: expireIn,
      });
      setMessage('Note updated successfully');
    } catch {
      setMessage('Failed to update note');
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Online Notepad</h1>

      <div className="mb-2">
        <label className="block font-medium">Note:</label>
        <textarea
          className="w-full p-2 border rounded"
          rows={8}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <div className="mb-2">
        <label className="block font-medium">Expires in (mins):</label>
        <input
          type="number"
          className="p-2 border rounded w-full"
          value={expireIn}
          onChange={(e) => setExpireIn(e.target.value)}
        />
      </div>

      <div className="flex space-x-2 mb-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={createNote}
        >
          Create New
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={fetchNote}
          disabled={!linkId}
        >
          Fetch Note
        </button>
        <button
          className="bg-yellow-600 text-white px-4 py-2 rounded"
          onClick={updateNote}
          disabled={!linkId}
        >
          Update Note
        </button>
      </div>

      {linkId && (
        <p className="mb-2">
          Your link: <code>{api}/{linkId}</code>
        </p>
      )}

      {message && <p className="text-sm text-gray-700">{message}</p>}
    </div>
  );
}

export default App;