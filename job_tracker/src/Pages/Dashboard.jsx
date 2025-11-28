import { useState, useEffect } from "react";
import JobCard from "../components/JobCard";
import { Link } from "react-router-dom";
import { loadJobs, saveJobs } from "../utils/Storage";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    // Load jobs and ensure each job has a documents array
    const storedJobs = (loadJobs() || []).map(job => ({
      ...job,
      documents: job.documents || []   // ensure this field exists
    }));

    setJobs(storedJobs);

    // Save updated structure back to localStorage
    saveJobs(storedJobs);
  }, []);

  const handleDelete = (id) => {
    const filteredJobs = jobs.filter((job) => job && job.id !== id);
    setJobs(filteredJobs);
    saveJobs(filteredJobs);
  };

  // ---------------------------------------
  //  SAFE SEARCH + FILTER LOGIC
  // ---------------------------------------
  const filteredJobs = jobs.filter((job) => {
    if (!job) return false;

    const title = String(job.position || job.jobTitle || "").toLowerCase();
    const company = String(job.company || job.companyName || "").toLowerCase();
    const status = String(job.status || "").toLowerCase();
    const searchText = search.toLowerCase();

    const matchesSearch =
      title.includes(searchText) || company.includes(searchText);

    const matchesFilter =
      filter === "All" || status === filter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-purple-700 via-indigo-900 to-black">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">📋 My Applications</h1>

        <Link
          to="/add-job"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-500 transition"
        >
          ➕ Add Job
        </Link>
      </div>

      {/* SEARCH BAR */}
      <div className="max-w-lg mb-6">
        <input
          type="text"
          placeholder="Search by job title or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border focus:ring focus:border-indigo-500"
        />
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex flex-wrap gap-3 mb-6">
        {["All", "Applied", "Interview", "Rejected", "Accepted"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg shadow 
              ${
                filter === status
                  ? "bg-indigo-600 text-white"
                  : "bg-white/20 text-white hover:bg-white/30"
              }
            `}
          >
            {status}
          </button>
        ))}
      </div>

      {/* JOB LIST */}
      {filteredJobs.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-white text-lg">No matching jobs found.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onDelete={() => handleDelete(job.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
