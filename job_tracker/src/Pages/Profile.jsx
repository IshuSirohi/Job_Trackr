import { RemoveFormatting } from "lucide-react";
import { useState, useEffect } from "react";

 function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("profile")) || {};
    setName(savedProfile.name || "");
    setEmail(savedProfile.email || "");
    setBio(savedProfile.bio || "");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saving profile");
    const profileData = { name, email, bio };
    localStorage.setItem("profile", JSON.stringify(profileData));
    setMessage("✅ Profile updated successfully!");

    setName("");
  setEmail("");
  setBio("");

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6  bg-gradient-to-r from-purple-700 via-indigo-900 to-black">
      <h2 className="text-3xl font-bold text-[rgb(244,243,243)] mb-6 ">👤 My Profile</h2>

      <form
        onSubmit={handleSubmit}
        className="p-8 rounded-xl shadow-lg w-full max-w-lg bg-white/20 backdrop-blur-lg border border-white/20  flex flex-col justify-between h-full
    transform transition duration-300 ease-in-out
    hover:shadow-[0_0_15px_5px_rgba(255,255,255,0.3)] hover:-translate-y-1"
  style={{ willChange: "transform, box-shadow" }}
      >
        {message && (
          <p className="mb-4 text-[#06ee30f2] font-medium text-center">{message}</p>
        )}

        <div className="mb-4">
          <label className="block text-white mb-2">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
            placeholder="Enter your full name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-500"
            placeholder="Write something about yourself"
            rows="4"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg shadow hover:bg-indigo-500 transition"
          
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
export default Profile;