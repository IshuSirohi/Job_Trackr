import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import "dotenv/config";
import * as pdfParse from "pdf-parse";
const pdf = pdfParse.default || pdfParse;

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

/* ---------------------------
   COVER LETTER GENERATOR
--------------------------- */
app.post("/api/generate-cover", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 700,
      }),
    });

    const json = await r.json();
    if (json.error) return res.status(500).json({ error: json.error.message });

    const text = json?.choices?.[0]?.message?.content || "";
    res.json({ text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------------------
        ATS SCORE API
--------------------------- */
app.post("/api/ats-score", async (req, res) => {
  try {
    const { pdfBase64, jobDescription = "" } = req.body;

    if (!pdfBase64)
      return res.status(400).json({ error: "Resume PDF is required." });

    // Decode PDF
    const pdfBuffer = Buffer.from(pdfBase64, "base64");
    const pdfData = await pdf(pdfBuffer);
    const resumeText = pdfData.text || "(no text extracted)";

    const prompt = `
Return ONLY JSON:

{
  "score": number,
  "strengths": ["text"],
  "missing_keywords": ["text"],
  "suggestions": ["text"]
}

Resume:
${resumeText}

Job Description:
${jobDescription || "(none provided)"}
`;

    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
      }),
    });

    const json = await r.json();
    if (json.error) return res.status(500).json({ error: json.error.message });

    const output = json.choices[0].message.content.trim();
    res.json({ result: output });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------------------
        START SERVER
--------------------------- */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
