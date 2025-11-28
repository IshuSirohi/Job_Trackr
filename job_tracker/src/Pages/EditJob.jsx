import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadJobs, saveJobs } from "../utils/Storage";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jobData, setJobData] = useState({
    position: "",
    company: "",
    status: "Applied",
    date: "",
    notes: "", // ⭐ NEW FIELD
  });

  useEffect(() => {
    const storedJobs = loadJobs();
    const jobToEdit = storedJobs.find((job) => job.id === Number(id));
    if (jobToEdit) {
      setJobData({
        position: jobToEdit.position,
        company: jobToEdit.company,
        status: jobToEdit.status,
        date: jobToEdit.date,
        notes: jobToEdit.notes || "", // ⭐ LOAD NOTES
      });
    } else {
      alert("Job not found");
      navigate("/");
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedJobs = loadJobs();
    const updatedJobs = storedJobs.map((job) =>
      job.id === Number(id) ? { ...job, ...jobData } : job
    );
    saveJobs(updatedJobs);
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-2 bg-gradient-to-r from-purple-700 via-indigo-900 to-black">
      <div
        className="mx-auto mt-[70px] p-8 rounded-xl shadow-lg w-full max-w-lg bg-white/20 backdrop-blur-lg border border-white/20
        transform transition duration-300 ease-in-out
        hover:shadow-[0_0_15px_5px_rgba(255,255,255,0.3)] hover:-translate-y-1"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Edit Job</h2>

        <form onSubmit={handleSubmit} className="flex flex-col text-white gap-4">

          <label>
            Position:
            <input
              type="text"
              name="position"
              value={jobData.position}
              onChange={handleChange}
              required
              className="w-full border text-black p-2 rounded"
            />
          </label>

          <label>
            Company:
            <input
              type="text"
              name="company"
              value={jobData.company}
              onChange={handleChange}
              required
              className="w-full border text-black p-2 rounded"
            />
          </label>

          <label>
            Status:
            <select
              name="status"
              value={jobData.status}
              onChange={handleChange}
              className="w-full border text-black p-2 rounded"
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Rejected">Rejected</option>
              <option value="Accepted">Accepted</option>
            </select>
          </label>

          <label>
            Date Applied:
            <input
              type="date"
              name="date"
              value={jobData.date}
              onChange={handleChange}
              className="w-full border text-black p-2 rounded"
            />
          </label>

          {/* ⭐ NOTES */}
          <label>
            Notes:
            <textarea
              name="notes"
              value={jobData.notes}
              onChange={handleChange}
              maxLength={500}
              className="w-full h-28 border text-black p-2 rounded"
            ></textarea>

           <div className="text-right text-white text-sm mt-1">
  <span className={jobData.notes.length >= 500 ? "text-red-300" : "text-gray-200"}>
    {jobData.notes.length} / 500
  </span>
</div>

            
          </label>

          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-500 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditJob;
