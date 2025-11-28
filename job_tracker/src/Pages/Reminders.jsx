import { useState, useEffect } from "react";

function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedReminders = JSON.parse(localStorage.getItem("reminders")) || [];
    setReminders(savedReminders);
  }, []);

  const addReminder = (e) => {
    e.preventDefault();

    // Clear previous errors
    setError("");

    // Validation 1: Required fields
    if (!jobTitle.trim()) {
      setError("⚠️ Job title is required.");
      return;
    }
    if (!date) {
      setError("⚠️ date is required.");
      return;
    }

    // Validation 2: Date cannot be in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time

    const selected = new Date(date);

    if (selected < today) {
      setError("❌  fill the valid date.");
      return;
    }

    // If all good → save reminder
    const newReminder = {
      id: Date.now(),
      jobTitle,
      date,
    };

    const updatedReminders = [...reminders, newReminder];
    setReminders(updatedReminders);
    localStorage.setItem("reminders", JSON.stringify(updatedReminders));

    setJobTitle("");
    setDate("");
  };

  const deleteReminder = (id) => {
    const updatedReminders = reminders.filter((r) => r.id !== id);
    setReminders(updatedReminders);
    localStorage.setItem("reminders", JSON.stringify(updatedReminders));
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gradient-to-r from-purple-700 via-indigo-900 to-black">
      <h2 className="text-3xl font-bold text-white mb-6">⏰ Job Follow-up Reminders</h2>

      {/* Form */}
      <form
        onSubmit={addReminder}
        className="p-8 rounded-xl shadow-lg w-full max-w-lg bg-white/20 backdrop-blur-lg border border-white/20 transform transition duration-300 hover:shadow-[0_0_15px_5px_rgba(255,255,255,0.3)] hover:-translate-y-1"
        style={{ willChange: "transform, box-shadow" }}
      >
        {/* Error Message */}
        {error && (
          <p className="mb-4 text-red-300 font-medium text-center">{error}</p>
        )}

        <div className="mb-4">
          <label className="block text-white mb-2">Job Title</label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
            placeholder="e.g., Frontend Developer at XYZ"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2">Reminder Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg shadow hover:bg-indigo-500 transition"
        >
          Add Reminder
        </button>
      </form>

      {/* Reminders List */}
      <div className="w-full max-w-lg bg-indigo-600 border p-6 mt-3 rounded-xl shadow-lg">
        {reminders.length === 0 ? (
          <p className="text-center text-white">No reminders yet</p>
        ) : (
          <ul className="space-y-4">
            {reminders.map((reminder) => (
              <li
                key={reminder.id}
                className="flex justify-between items-center p-4 border rounded-lg"
              >
                <div>
                  <p className="font-semibold text-white">{reminder.jobTitle}</p>
                  <p className="text-white">📅 {reminder.date}</p>
                </div>
                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Reminders;
