import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  // ⭐ Modal state
  const [selectedDoc, setSelectedDoc] = useState(null);

  // -------------------------------
  // DOCUMENT VIEW + DELETE
  // -------------------------------

  const openDoc = (doc) => {
    setSelectedDoc(doc);
  };

  const closeDoc = () => {
    setSelectedDoc(null);
  };

  const handleDeleteDocument = (docId) => {
    const updatedJob = {
      ...job,
      documents: job.documents.filter((d) => d.id !== docId),
    };

    setJob(updatedJob);

    const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    const newJobs = jobs.map((j) => (String(j.id) === id ? updatedJob : j));
    localStorage.setItem("jobs", JSON.stringify(newJobs));
  };

  // -------------------------------
  // LOAD JOB DETAILS
  // -------------------------------
  useEffect(() => {
    const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    const foundJob = jobs.find((j) => String(j.id) === id);

    if (!foundJob) {
      navigate("/dashboard");
    } else {
      setJob({
        ...foundJob,
        documents: foundJob.documents || [],
      });
    }
  }, [id, navigate]);

  if (!job) return null;

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gradient-to-r from-purple-700 via-indigo-900 to-black">
      <div
        className="p-8 rounded-xl shadow-lg w-full max-w-lg bg-white/20 
          backdrop-blur-lg border border-white/20 mt-[70px]
          transform transition duration-300 ease-in-out
          hover:shadow-[0_0_15px_5px_rgba(255,255,255,0.3)]
          hover:-translate-y-1"
      >
        <h2 className="text-2xl font-bold text-white mb-4">{job.position}</h2>

        <p className="text-white mb-2">
          🏢 <strong>Company:</strong> {job.company}
        </p>

        <p className="text-white mb-2">
          📅 <strong>Applied Date:</strong> {job.date || "N/A"}
        </p>

        <p className="text-white mb-4">
          📌 <strong>Status:</strong>{" "}
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
            {job.status}
          </span>
        </p>

        {/* -------------------------
            NOTES
        -------------------------- */}
        <div className="mt-6 mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">📝 Notes</h3>
          <p className="text-white leading-relaxed">
            {job.notes && job.notes.trim() !== ""
              ? job.notes
              : "No notes added"}
          </p>
        </div>

        {/* -------------------------
            DOCUMENTS SECTION
        -------------------------- */}
        <h3 className="text-xl font-bold text-white mt-6 mb-4">📁 Documents</h3>

        {job.documents.length > 0 ? (
          <ul className="space-y-3">
            {job.documents.map((doc) => (
              <li
                key={doc.id}
                className="flex justify-between items-center bg-white/10 p-3 rounded"
              >
                <span className="text-white cursor-pointer" onClick={() => openDoc(doc)}>
                  🔍 {doc.name}
                </span>

                <button
                      type="button"
                      onClick={() => removeDocument(doc.id)}
                      className="text-red-400 font-bold"
                    >
                      Delete
                    </button>

                
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white opacity-80">No documents uploaded</p>
        )}

        {/* -------------------------
            BACK BUTTON
        -------------------------- */}
        <Link
          to="/dashboard"
          className="inline-block mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-500 transition"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* -------------------------
          MODAL POPUP VIEWER
      -------------------------- */}
    {selectedDoc && (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl w-[90%] h-[90%] relative overflow-hidden">


            {/* Close button */}
            <button
              className="absolute top-2 right-3 text-2xl font-bold text-black"
              onClick={closeDoc}
            >
              ✖
            </button>

            <h3 className="text-xl font-semibold mb-4">{selectedDoc.name}</h3>

            {/* PDF or Image viewer */}
            {selectedDoc.type.includes("pdf") ? (
              <iframe
                src={selectedDoc.data}
                title="PDF Viewer"
                className="w-full h-[1000px] rounded"
              ></iframe>
            ) : (
              <img
                src={selectedDoc.data}
                alt="Document Preview"
                className="max-h-[1000px] w-full object-cover rounded"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default JobDetails;
