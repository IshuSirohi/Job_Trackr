import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddJob() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: Date.now(),
    position: "",
    company: "",
    status: "Applied",
    date: "",
    notes: "",
    documents: [], // ⭐ ADDED
  });

  // Convert file → Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  };

  // Upload document handler
  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const base64 = await fileToBase64(file);

    const newDoc = {
      id: Date.now(),
      name: file.name,
      type: file.type,
      data: base64,
    };

    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, newDoc],
    }));
  };

  // Remove a selected document before saving
  const removeDocument = (id) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((doc) => doc.id !== id),
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    jobs.push(formData);
    localStorage.setItem("jobs", JSON.stringify(jobs));

    navigate("/dashboard");
  };

  return (
    <div className="flex justify-center bg-gradient-to-r from-purple-700 via-indigo-900 to-black items-center min-h-screen">
      <div
        className="p-8 rounded-xl shadow-lg w-full max-w-lg bg-white/20 backdrop-blur-lg border border-white/20
        transform transition duration-300 ease-in-out
        hover:shadow-[0_0_15px_5px_rgba(255,255,255,0.3)] hover:-translate-y-1"
        style={{ willChange: "transform, box-shadow" }}
      >
        <h2 className="text-2xl font-bold text-white mb-10">➕ Add New Job</h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Position */}
          <div>
            <label className="block text-white font-medium mb-2">Position</label>
            <input
              type="text"
              name="position"
              placeholder="Write your position"
              value={formData.position}
              onChange={handleChange}
              required
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-white font-medium mb-2">Company</label>
            <input
              type="text"
              name="company"
              placeholder="Write company name"
              value={formData.company}
              onChange={handleChange}
              required
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-white font-medium mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option>Applied</option>
              <option>Interview</option>
              <option>Rejected</option>
              <option>Accepted</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-white font-medium mb-2">Applied Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-white font-medium mb-2">Notes</label>
            <textarea
              name="notes"
              placeholder="Write interview notes, follow-ups, salary info..."
              value={formData.notes}
              onChange={handleChange}
              maxLength={500}
              className="w-full h-28 border-gray-300 rounded-lg p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>

            <div className="text-right text-white text-sm mt-1">
              <span className={formData.notes.length >= 500 ? "text-red-300" : "text-gray-200"}>
                {formData.notes.length} / 500
              </span>
            </div>
          </div>

          {/* ⭐ DOCUMENT UPLOAD */}
          <div>
            <label className="block text-white font-medium mb-2">Upload Documents</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleDocumentUpload}
              className="text-white"
            />

            {/* Show uploaded docs */}
            {formData.documents.length > 0 && (
              <ul className="mt-3 space-y-2">
                {formData.documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex justify-between bg-white/20 p-2 rounded"
                  >
                    <span className="text-white">{doc.name}</span>

                    <button
                      type="button"
                      onClick={() => removeDocument(doc.id)}
                      className="text-red-400 font-bold"
                    >
                      ✖
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-500 transition"
          >
            Save Job
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddJob;
