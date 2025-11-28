import { useState } from "react";

function ATS() {
  const [pdfFile, setPdfFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [ats, setAts] = useState(null);
  const [error, setError] = useState("");

  const handleFile = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const fileToBase64 = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(file);
    });

  const analyzeATS = async () => {
    setError("");
    setAts(null);

    if (!pdfFile) {
      setError("⚠️ Please upload your resume (PDF).");
      return;
    }

    setLoading(true);

    try {
      const base64 = await fileToBase64(pdfFile);

     const r = await fetch("http://localhost:5000/api/ats-score", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    pdfBase64: base64,
    jobDescription: jobDesc,
  }),
});


      const json = await response.json();

      if (json.error) {
        setError(json.error);
      } else {
        let parsed;
        try {
          parsed = typeof json.result === "string" ? JSON.parse(json.result) : json.result;
        } catch (e) {
          setError("❌ Could not parse ATS result. Response format invalid.");
          return;
        }
        setAts(parsed);
      }
    } catch (err) {
      setError("❌ Failed to process ATS request.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center bg-gradient-to-r from-purple-700 via-indigo-900 to-black">
      <h1 className="text-3xl font-bold text-white mb-6">📄 ATS Resume Scanner</h1>

      {/* ERROR UI */}
      {error && (
        <p className="text-red-300 bg-red-500/20 px-4 py-2 rounded-lg mb-4">
          {error}
        </p>
      )}

      {/* INPUT CARD */}
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl max-w-2xl w-full border border-white/20">
        <label className="block text-white font-medium mb-2">Upload Resume (PDF)</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFile}
          className="mb-4 text-white"
        />

        <label className="block text-white font-medium mb-2">
          Job Description (optional)
        </label>
        <textarea
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          placeholder="Paste job description to improve keyword matching..."
          className="w-full h-28 p-3 bg-white/5 text-white rounded-lg"
        />

        <button
          onClick={analyzeATS}
          disabled={loading}
          className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg shadow hover:bg-indigo-500 transition disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Check ATS Score"}
        </button>
      </div>

      {/* RESULT SECTION */}
      {ats && (
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl mt-6 max-w-2xl w-full border border-white/20 text-white">
          <h2 className="text-xl font-bold mb-2">
            ⭐ ATS Score: {ats.score}/100
          </h2>

          {/* Strengths */}
          <h3 className="mt-4 font-semibold text-green-300">✅ Strengths</h3>
          <ul className="ml-4 list-disc text-gray-200">
            {ats.strengths?.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          {/* Missing Keywords */}
          <h3 className="mt-4 font-semibold text-red-300">❌ Missing Keywords</h3>
          <ul className="ml-4 list-disc text-gray-200">
            {ats.missing_keywords?.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

          {/* Suggestions */}
          <h3 className="mt-4 font-semibold text-yellow-300">📌 Suggestions</h3>
          <ul className="ml-4 list-disc text-gray-200">
            {ats.suggestions?.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ATS;
