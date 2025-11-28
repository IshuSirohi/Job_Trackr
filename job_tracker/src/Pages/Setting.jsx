import { useState,useEffect } from "react";
import "../index.css";



function Setting() {
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  





  const clearData = () => {
    localStorage.removeItem("jobs");
    localStorage.removeItem("reminders"); // ✅ remove reminders too

    setMessage("🗑️ All data cleared!");
    setShowModal(false);

    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gradient-to-r from-purple-700 via-indigo-900 to-black">
      <h2 className="text-3xl font-bold text-white mb-6">⚙️ Settings</h2>

      <div
        className="p-8 rounded-xl shadow-lg w-full max-w-lg bg-white/20 backdrop-blur-lg border border-white/20 
        transform transition duration-300 ease-in-out
        hover:shadow-[0_0_15px_5px_rgba(255,255,255,0.3)] hover:-translate-y-1"
      >
        {/* Message */}
        {message && (
          <p className="mb-4 text-[#06ee30f2] font-medium text-center">
            {message}
          </p>
        )}

        {/* Clear Data */}
        <div className="mb-6">
          <h3 className="text-xl text-white font-semibold mb-2">Data</h3>
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-red-600 text-white py-2 rounded-lg shadow hover:bg-red-500 transition"
          >
            Clear All Job Data
          </button>
        </div>

     


        {/* About App */}
        <div className="mb-6">
          <h3 className="text-xl text-white font-semibold mb-2">About App</h3>
          <p className="text-gray-200 text-sm leading-relaxed">
            This Job Tracker App helps you manage job applications easily.
            Keep track of your applications, interviews, and statuses all in
            one place!
          </p>
        </div>

        {/* Contact Developer */}
        <div className="mb-6">
          <h3 className="text-xl text-white font-semibold mb-2">Contact Developer</h3>
          <a
            href="https://x.com/mystery__lord"
            target="_blank"
            className="text-indigo-300 font-semibold underline hover:text-indigo-400"
          >
            🔗 Twitter: @mysterious_lord
          </a>
        </div>

        {/* App Version */}
       <div className="mt-6 text-center">
  <span className="px-4 py-1 bg-white/20 backdrop-blur-md rounded-lg text-gray-200 text-sm">
    © 2025 — Created by <span className="text-white font-semibold">Mysterious Lord</span>
  </span>
</div>

      </div>

      {/* Custom Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center backdrop-blur-sm">
          <div className="bg-white/20 border border-white/30 backdrop-blur-xl rounded-xl p-6 max-w-sm w-full text-white">
            <h3 className="text-xl font-semibold mb-4">Are you sure?</h3>
            <p className="mb-6 text-gray-200">
              This will permanently delete all job data.
            </p>

            <div className="flex gap-3">
              <button
                onClick={clearData}
                className="flex-1 bg-red-600 py-2 rounded-lg hover:bg-red-500 transition"
              >
                Yes, Clear
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-500 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Setting;
