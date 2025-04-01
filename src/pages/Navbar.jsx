import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/Kotelawala_Defence_University_crest.png";

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const logoutHandler = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      navigate("/");
    }
  };

  return (
    <div className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/dashboard">
              <img
                alt="KDU Student Management System"
                src={logo}
                className="h-12 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 h-20">
            <button
              className="px-3 py-2 rounded-md hover:bg-gray-300 transition-colors duration-300 text-gray-700 font-medium"
              onClick={() => navigate("/students")}
            >
              Students
            </button>
            <button
              className="px-3 py-2 rounded-md hover:bg-gray-300 transition-colors duration-300 text-gray-700 font-medium"
              onClick={() => navigate("/courses")}
            >
              Courses
            </button>
            <button
              className="px-3 py-2 rounded-md hover:bg-gray-300 transition-colors duration-300 text-gray-700 font-medium"
              onClick={() => navigate("/logs")}
            >
              Logs & History
            </button>
            <button
              className="px-3 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors duration-300 font-medium"
              onClick={logoutHandler}
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-200 focus:outline-none"
              onClick={toggleMenu}
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-300 transition-colors duration-300 text-gray-700 font-medium"
              onClick={() => {
                navigate("/students");
                setIsMenuOpen(false);
              }}
            >
              Students
            </button>
            <button
              className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-300 transition-colors duration-300 text-gray-700 font-medium"
              onClick={() => {
                navigate("/courses");
                setIsMenuOpen(false);
              }}
            >
              Courses
            </button>
            <button
              className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-300 transition-colors duration-300 text-gray-700 font-medium"
              onClick={() => {
                navigate("/logs");
                setIsMenuOpen(false);
              }}
            >
              Logs
            </button>
            <button
              className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-300 transition-colors duration-300 text-gray-700 font-medium"
              onClick={logoutHandler}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
