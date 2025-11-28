import { useState } from "react";

export default function CoverLetter() {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");
  const [extraBullets, setExtraBullets] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fullName, setFullName] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
const [location, setLocation] = useState("");
const [copied, setCopied] = useState(false);
const [isEditing, setIsEditing] = useState(false);
const [editedText, setEditedText] = useState("");

const [showModal, setShowModal] = useState(false);
const [zoom, setZoom] = useState(1); // default zoom


  const [savedCount, setSavedCount] = useState(
    JSON.parse(localStorage.getItem("savedCoverLetters") || "[]").length
  );

  const buildPrompt = () => {
  const bullets = extraBullets
    .split("\n")
    .map((b) => b.trim())
    .filter(Boolean);

 return `
You are an expert at writing internationally acceptable, ATS-friendly cover letters.  
Your task is to produce a clean, concise, professional cover letter following the exact format provided below.

IMPORTANT:
- NEVER invent fake details or achievements.
- ONLY use the information from the user input.
- If something is missing (e.g., job description), simply continue naturally.
- Output ONLY the final cover letter — no notes, no explanations, no analysis.

=====================================
CANDIDATE DETAILS
=====================================
Name: ${fullName || "Your Name"}
Email: ${email || "your@email.com"}
Phone: ${phone || "Your Phone Number"}
Location: ${location || "City, Country"}

Job Title: ${jobTitle}
Company: ${company}
Job Description Provided: ${jobDescription ? "Yes" : "No"}

Achievements / Notes:
${bullets.length ? bullets.map((b,i)=>`${i+1}. ${b}`).join("\n") : "(none)"}

Tone: ${tone}
Length: ${length}

=====================================
COVER LETTER FORMAT (FOLLOW EXACTLY)
=====================================

${(fullName || "Your Name").toUpperCase()}
${email || "your@email.com"}
${phone || "Your Phone Number"}
${location || "City, Country"}
[Today's Date]

Dear Hiring Manager,

INTRO PARAGRAPH  
– Introduce yourself by role/skills  
– Mention job title and company  
– Show interest professionally  
– STRICTLY 2–3 lines

MIDDLE PARAGRAPH(S) – SKILLS + RELEVANCE  
– Use the candidate's achievements (if provided)  
– Use job description keywords (if provided)  
– Focus on strengths, impact, and skills  
– STRICTLY MAX 4–5 lines

WHY I WANT TO JOIN YOUR COMPANY (USE EXACT TEXT BELOW)  
I’m particularly drawn to this opportunity because it allows me to grow in a dynamic 
environment while contributing to meaningful, user-focused products. I value clean
design, efficient code, and collaborative teamwork—qualities I aim to bring to your
organization.

CLOSING PARAGRAPH (USE EXACT TEXT BELOW)  
Thank you for considering my application. I am available to start immediately and
would be happy to provide further details about my projects or technical skills. I look
forward to the opportunity to contribute to your team.

Sincerely,  
${fullName || "Your Name"}

=====================================
STRICT RULES
=====================================
– DO NOT add extra paragraphs  
– DO NOT modify the predefined WHY I WANT TO JOIN or CLOSING PARAGRAPH  
– DO NOT add headers like “COVER LETTER”  
– NO flowery language  
– KEEP it clean, short, and ATS-friendly  
– NO hallucinated achievements  
=====================================

Now generate the final cover letter.
`;

};


  async function callApi(prompt) {
    try {
      setError("");
      setLoading(true);
      setResult("");

      const res = await fetch("http://localhost:5000/api/generate-cover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Server error");
      }

      setResult(json.text.trim());
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
      setError(err.message || "Failed to generate cover letter");
    }
  }

  const handleGenerate = () => {
    if (!jobTitle || !company || !fullName || !email || !phone || !location) {
      setError("Please enter the details");
      return;
    }
    callApi(buildPrompt());
  };

  const handleCopy = async () => {
  if (!result) return;
  await navigator.clipboard.writeText(result);
  setCopied(true);

  setTimeout(() => {
    setCopied(false);
  }, 2000); // hide in 2 seconds
};


  const handleSave = () => {
    if (!result) return;

    const saved = JSON.parse(localStorage.getItem("savedCoverLetters") || "[]");

    saved.unshift({
      id: Date.now(),
      jobTitle,
      company,
      tone,
      length,
      text: result,
      createdAt: new Date().toISOString(),
    });

    localStorage.setItem("savedCoverLetters", JSON.stringify(saved));
    setSavedCount(saved.length);

    alert("Saved!");
  };

  const handleDownload = () => {
    if (!result) return;

    const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `${jobTitle}-${company}-cover-letter.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-700 via-indigo-900 to-black p-6">
      <div className="max-w-3xl text-white mx-auto">
        <h1 className="text-2xl font-bold mb-4">🤖 AI Cover Letter Generator</h1>

        <div className="bg-white/10 p-6 rounded-lg mb-6">

  <h2 className="text-lg font-semibold mb-3">📌 Your Personal Details</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <input
      value={fullName}
      onChange={(e) => setFullName(e.target.value)}
      placeholder="Your Full Name"
      className="p-3 rounded text-white bg-white/5"
    />

    <input
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Your Email"
      className="p-3 rounded bg-white/5"
    />
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
    <input
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      placeholder="Your Phone Number"
      className="p-3 rounded bg-white/5"
    />

    <input
      value={location}
      onChange={(e) => setLocation(e.target.value)}
      placeholder="City, Country"
      className="p-3 rounded bg-white/5"
    />
  </div>
</div>


        {/* INPUT FORM */}
        <div className="bg-white/10 p-6 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Job title"
              className="p-3 rounded bg-white/5"
            />
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company"
              className="p-3 rounded bg-white/5"
            />
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste job description (optional)"
            className="w-full mt-4 p-3 rounded bg-white/5 h-28"
          />

          <div className="flex gap-4 mt-4 items-center">
            <div>
              <label className="block text-sm font-semibold mb-1">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="p-2 rounded bg-white/5"
              >
                <option>Professional</option>
                <option>Friendly</option>
                <option>Concise</option>
                <option>Enthusiastic</option>
              </select>
            </div>

            <div>
              <label className="block font-sembold text-sm mb-1">Length</label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="p-2 rounded bg-white/5"
              >
                <option>Short</option>
                <option>Medium</option>
                <option>Long</option>
              </select>
            </div>
          </div>

          <textarea
            value={extraBullets}
            onChange={(e) => setExtraBullets(e.target.value)}
            placeholder="Achievements or Projects"
            className="w-full mt-4 p-3 rounded bg-white/5 h-24"
          />

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 rounded text-white"
            >
              {loading ? "Generating..." : "Generate"}
            </button>
            <button
              onClick={() => {
                setJobTitle("");
                setCompany("");
                setJobDescription("");
                setExtraBullets("");
                setResult("");
                setError("");
              }}
              className="px-4 py-2 bg-gray-500 rounded text-white"
            >
              Reset
            </button>

            {/* <div className="ml-auto text-sm text-gray-300">
              Saved: {savedCount}
            </div> */}
          </div>

          {error && <p className="mt-2 text-red-400">{error}</p>}
        </div>

          {copied && (
  <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-fade-in-out z-50">
    ✓ Copied to clipboard
  </div>
)}


        {/* RESULT */}
        <div className="bg-white/5 p-6 rounded-lg">
          <div className="flex items-start justify-between">
  <h2 className="text-lg font-semibold">Generated Cover Letter</h2>

  <div className="flex gap-2">

    {/* Copy */}
    <button onClick={handleCopy} className="px-3 py-1 bg-white/10 rounded">
      Copy
    </button>

    {/* Save
    <button onClick={handleSave} className="px-3 py-1 bg-white/10 rounded">
      Save
    </button> */}

    {/* Download */}
    <button onClick={handleDownload} className="px-3 py-1 bg-white/10 rounded">
      Download
    </button>

    {/* EDIT button */}
    {!isEditing ? (
      <button
        onClick={() => {
          setIsEditing(true);
          setEditedText(result);
        }}
        className="px-3 py-1 bg-yellow-500 rounded text-black font-medium"
      >
        Edit
      </button>
    ) : (
      <button
        onClick={() => {
          setIsEditing(false);
          setResult(editedText);
        }}
        className="px-3 py-1 bg-green-600 rounded text-white font-medium"
      >
        Save Changes
      </button>
    )}
  </div>
</div>


      <div className="mt-4">
  {isEditing ? (
    <textarea
      value={editedText}
      onChange={(e) => setEditedText(e.target.value)}
      className="w-full h-72 p-3 bg-white border border-white/20 rounded text-black"
    />
  ) : (
    <div className="w-full h-72 p-3 bg-white rounded text-black overflow-y-auto whitespace-pre-line">
      {result}
    </div>
  )}
</div>

        </div>
        <button 
  onClick={() => setShowModal(true)} 
  className="px-3 py-1 bg-indigo-500 rounded text-white"
>
  Preview Letter
</button>

      </div>
      {showModal && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
    
    <div className=" rounded-lg shadow-xl w-full max-w-3xl h-[90vh] flex flex-col">
      
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b bg-gray-500  ">
        <h2 className="text-lg  font-semibold">Cover Letter Preview</h2>
        <button 
          onClick={() => setShowModal(false)} 
          className="text-xl font-bold"
        >
          ✖
        </button>
      </div>

      {/* Zoom Controls */}
      <div className="flex gap-3 justify-center p-3 border-b bg-gray-500 ">
        <button 
          onClick={() => setZoom(prev => Math.min(prev + 0.1, 2))}
          className="px-3 py-1 bg-indigo-500 text-white rounded"
        >
          ➕ Zoom In
        </button>

        <button 
          onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))}
          className="px-3 py-1 bg-indigo-500 text-white rounded"
        >
          ➖ Zoom Out
        </button>

        <button 
          onClick={() => setZoom(1)}
          className="px-3 py-1 bg-gray-700 text-white rounded"
        >
          🔄 Reset
        </button>
      </div>

      {/* Letter Content */}
      <div className="flex-1 bg-white overflow-auto p-6">
        <div 
          style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
          className="whitespace-pre-line leading-relaxed text-black"
        >
          {result}
        </div>
      </div>
    </div>

  </div>
)}

    </div>
  );
}
