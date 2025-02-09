import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Import CSS file for styling

function App() {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resumePdf, setResumePdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeFeature, setActiveFeature] = useState("home");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleResumeTextChange = (event) => {
    setResumeText(event.target.value);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please upload a PDF resume.");
      return;
    }

    setLoading(true);
    setError("");
    setCoverLetter("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/generate-cover-letter",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setCoverLetter(response.data);
    } catch (err) {
      setError("Error generating cover letter. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateResume = async () => {
    if (!resumeText.trim()) {
      setError("Please enter resume details.");
      return;
    }

    setLoading(true);
    setError("");
    setResumePdf(null);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/generate-resume",
        resumeText,
        { headers: { "Content-Type": "text/plain" }, responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      setResumePdf(URL.createObjectURL(blob));
    } catch (err) {
      setError("Error generating resume. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>AI Resume Builder</h2>
        <ul>
          <li onClick={() => setActiveFeature("coverLetter")}>Generate Cover Letter</li>
          <li onClick={() => setActiveFeature("resume")}>Generate Resume</li>
        </ul>
      </aside>

      <main className="main-content">
        {activeFeature === "home" && (
          <div className="home">
            <h1>Welcome to AI Resume Builder</h1>
            <p>Generate professional cover letters and resumes in seconds.</p>
            <ul>
              <li>📄 Upload your resume PDF and get a customized cover letter.</li>
              <li>📝 Enter your resume details to generate a professional PDF.</li>
            </ul>
            <p>Select an option from the sidebar to get started!</p>
          </div>
        )}

        {activeFeature === "coverLetter" && (
          <div className="feature-section">
            <h2>Generate Cover Letter</h2>
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={loading}>
              {loading ? "Generating..." : "Generate Cover Letter"}
            </button>

            {coverLetter && (
              <div className="output">
                <h3>Generated Cover Letter:</h3>
                {coverLetter.split("\n\n").map((para, index) => (
                  <p key={index}>{para}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {activeFeature === "resume" && (
          <div className="feature-section">
            <h2>Generate Resume</h2>
            <textarea
              rows="6"
              cols="50"
              value={resumeText}
              onChange={handleResumeTextChange}
              placeholder="Enter your resume details here..."
            />
            <br />
            <button onClick={handleGenerateResume} disabled={loading}>
              {loading ? "Generating..." : "Generate Resume PDF"}
            </button>

            {resumePdf && (
              <div className="output">
                <h3>Download AI-Generated Resume:</h3>
                <a href={resumePdf} download="resume.pdf">
                  <button className="download-btn">Download Resume</button>
                </a>
              </div>
            )}
          </div>
        )}

        {error && <p className="error">{error}</p>}
      </main>
    </div>
  );
}

export default App;
