import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import AddJob from "./Pages/AddJob";
import JobDetails from "./Pages/JobDetails";
import Register from "./Pages/Register";
import Analytics from "./Pages/Analytics";
import Reminders from "./Pages/Reminders";
import Navbar from "./components/Navbar";
import EditJob from "./Pages/EditJob";
import Setting from "./Pages/Setting";
import Documents from "./Pages/Documents";
import CoverLetter from "./Pages/CoverLetter";
import { Import } from "lucide-react";
import ATS from "./Pages/ATS";
function AppContent() {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <>
    
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-job" element={<AddJob />} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/Setting" element={<Setting />} />
        <Route path="/edit-job/:id" element={<EditJob />} />
        <Route path="/documents" element={<Documents />} />
        
        <Route path="/CoverLetter" element={<CoverLetter />} />


      </Routes>
     
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}




