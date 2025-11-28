import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

 function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "AddJob", path: "/addjob" },
    { name: "Analytics", path: "/analytics" },
    { name: "Reminders", path: "/reminders" },
    { name: "Documents", path: "/documents" },
    {name:"AICoverLetter", path:"/CoverLetter"},
    
    { name: "Setting", path: "/Setting" },
    
    
  ];

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-7">
        <div className="flex justify-between  items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">JobTrackr</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex  space-x-9">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  ` hover:text-yellow-300 transition ${
                    isActive ? "font-semibold underline" : ""
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            
          </div>

            {/* Logout */}
          {/* <button className="hidden md:inline bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-300 transition">
            Logout
          </button> */}
         

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-indigo-700">
          <div className="space-y-2 px-4 py-3">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md hover:bg-indigo-500 ${
                    isActive ? "bg-indigo-800 font-semibold" : ""
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </NavLink>
              
            ))}
             <button className="block w-full text-left px-3 py-2 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-300">
              Logout
            </button>
           
          </div>
        </div>
      )}
    </nav>
  );
}
export default Navbar;
