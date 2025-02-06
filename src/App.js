// src/App.js
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('resume', file);

    const response = await axios.post('https://main.d1qchgijbj2p47.amplifyapp.com/generate-cover-letter', formData);
    setCoverLetter(response.data.coverLetter);
  };

  return (
    <div>
      <h1>Cover Letter Generator</h1>
      <form onSubmit={handleFileUpload}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Generate Cover Letter</button>
      </form>
      {coverLetter && <div>{coverLetter}</div>}
    </div>
  );
}

export default App;