import { Link } from "react-router-dom";

function JobCard({ job, onDelete }) {
  const statusColors = {
    Applied: "bg-blue-100 text-black-900",
    Interview: "bg-yellow-100 text-yellow-800",
    Offer: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
    Accepted: "bg-green-200 text-green-900",
  };

  return (
    <div
      className="bg-white/20 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg p-6 flex flex-col justify-between h-full
      transform transition duration-300 ease-in-out
      hover:shadow-[0_0_15px_5px_rgba(255,255,255,0.3)] hover:-translate-y-1"
      style={{ willChange: "transform, box-shadow" }}
    >
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-[#0f0f0f]">{job.position}</h2>

          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              statusColors[job.status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {job.status}
          </span>
        </div>

        <p className="text-[#0f0f0f] font-medium">{job.company}</p>

        <p className="text-sm text-gray-950 mt-1">
          Applied on: {job.date || "N/A"}
        </p>

        {/* ⭐ NOTES SECTION */}
        <div className="mt-3">
          <p className="text-sm font-semibold text-black">Notes:</p>
          <p className="text-sm text-gray-800">
            {job.notes && job.notes.trim() !== ""
              ? job.notes.length > 80
                ? job.notes.substring(0, 80) + "..."
                : job.notes
              : "No notes added"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <Link
          to={`/job/${job.id}`}
          className="text-black bg-white px-2 py-1 rounded-sm hover:underline text-sm font-medium"
        >
          View
        </Link>

        <div className="flex gap-2">
          <Link
            to={`/edit-job/${job.id}`}
            className="px-3 py-1 text-sm bg-yellow-400 text-gray-900 rounded hover:bg-yellow-300"
          >
            Edit
          </Link>

          <button
            onClick={() => onDelete(job.id)}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-400"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobCard;
