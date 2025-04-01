import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from './Navbar';

function Course() {
  const [coursenno, setCoursenno] = useState("");
  const [courseid, setCourseid] = useState("");
  const [coursename, setCoursename] = useState("");
  const [showcourseform, setShowcourseform] = useState(false);
  const [courses, setCourses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 10;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch("http://localhost:5000/course");
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDownload = async () => {
    try {
      window.location.href = "http://localhost:5000/course/download";
    } catch (error) {
      console.log(error.message);
    }
  };

  const toggleCourseForm = () => {
    if (showcourseform) {
      setCoursenno("");
      setCourseid("");
      setCoursename("");
      setIsEditing(false);
      setSelectedCourse(null);
    }
    setShowcourseform(!showcourseform);
  };

  const handleCourseForm = async (e) => {
    e.preventDefault();
    if (!courseid || !coursename || (isEditing && !coursenno)) {
      console.error("All fields are required");
      alert("All fields are required");
      return;
    }

    try {
      let url = "http://localhost:5000/course";
      let method = "POST";
      let body = { courseid, coursename };

      if (isEditing && selectedCourse) {
        method = "PUT";
        body = {
          coursenno,
          courseid, // Still sent, but backend will ignore it
          coursename,
        };
      }

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (response.ok) {
        alert(isEditing ? "Course updated successfully" : "Course added successfully");
        fetchCourses();
        toggleCourseForm();
        setCurrentPage(1);
      } else {
        alert("Operation failed: " + (data.error || data));
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert("Error: " + error.message);
    }
  };

  const handleEdit = (course) => {
    setCoursenno(course.coursenno);
    setCourseid(course.courseid);
    setCoursename(course.coursename);
    setIsEditing(true);
    setSelectedCourse(course);
    setShowcourseform(true);
  };

  const handleDelete = async (courseid) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const response = await fetch("http://localhost:5000/course", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseid }),
        });

        const data = await response.json();
        console.log("Delete response:", data);

        if (response.ok) {
          alert("Course deleted successfully");
          fetchCourses();
          if (currentPage > Math.ceil((courses.length - 1) / coursesPerPage)) {
            setCurrentPage(Math.max(1, currentPage - 1));
          }
        } else {
          alert("Delete failed: " + (data.error || data));
        }
      } catch (error) {
        console.error("Delete error:", error.message);
        alert("Error deleting course: " + error.message);
      }
    }
  };

  const totalPages = Math.ceil(courses.length / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="relative">
      <Navbar />
      <div className="min-h-screen bg-gray-200 p-4">
        <div className="flex items-center space-x-4 mb-4 flex justify-end">
          <button
            onClick={toggleCourseForm}
            className="text-white py-2 px-4 border-0 outline-none rounded transition-colors duration-200 ease-out bg-blue-600 hover:bg-blue-500 active:bg-blue-700"
          >
            {isEditing ? "Cancel Edit" : "Add Course"}
          </button>
          <button
            onClick={handleDownload}
            className="text-white py-2 px-4 border-0 outline-none rounded transition-colors duration-200 ease-out bg-green-600 hover:bg-green-500 active:bg-green-700 "
          >
            Download
          </button>
        </div>

        {/* Table to Display Courses */}
        <div className="bg-white w-full max-h-full flex flex-col shadow-2xl">
          <div className="text-white bg-gray-800 p-4">
            <h2 className="m-0 p-0 font-bold text-center">Course List</h2>
          </div>
          <div className="w-full h-full overflow-auto">
            <table className="bg-white text-base border-collapse w-full">
              <thead>
                <tr>
                  <th className="text-white font-normal bg-gray-500 border-b-2 border-gray-300 sticky top-0 text-left p-4 box-border">
                    Course Number
                  </th>
                  <th className="text-white font-normal bg-gray-500 border-b-2 border-gray-300 sticky top-0 text-left p-4 box-border">
                    Course ID
                  </th>
                  <th className="text-white font-normal bg-gray-500 border-b-2 border-gray-300 sticky top-0 text-left p-4 box-border">
                    Course Name
                  </th>
                  <th className="text-white font-normal bg-gray-500 border-b-2 border-gray-300 sticky top-0 text-left p-4 box-border">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentCourses.length > 0 ? (
                  currentCourses.map((course, index) => (
                    <tr
                      key={indexOfFirstCourse + index}
                      className="transition-colors duration-150 ease-out even:bg-gray-50 hover:bg-gray-100"
                    >
                      <td className="border border-gray-300 border-l-0 border-r-0 whitespace-nowrap text-left p-4 box-border">
                        {course.coursenno}
                      </td>
                      <td className="border border-gray-300 border-l-0 border-r-0 whitespace-nowrap text-left p-4 box-border">
                        {course.courseid}
                      </td>
                      <td className="border border-gray-300 border-l-0 border-r-0 whitespace-nowrap text-left p-4 box-border">
                        {course.coursename}
                      </td>
                      <td className="border border-gray-300 border-l-0 border-r-0 whitespace-nowrap text-left p-4 box-border">
                        <button
                          onClick={() => handleEdit(course)}
                          className="text-white py-2 px-4 border-0 m-0 outline-none rounded-none transition-colors duration-200 ease-out bg-blue-600 hover:bg-blue-500 active:bg-blue-700 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(course.courseid)}
                          className="text-white py-2 px-4 border-0 m-0 outline-none rounded-none transition-colors duration-200 ease-out bg-red-600 hover:bg-red-500 active:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="transition-colors duration-150 ease-out">
                    <td
                      colSpan="4"
                      className="border border-gray-300 border-l-0 border-r-0 whitespace-nowrap text-left p-4 box-border"
                    >
                      No courses found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {courses.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-gray-100 border-t border-gray-300">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`text-white py-2 px-4 border-0 outline-none rounded transition-colors duration-200 ease-out ${
                  currentPage === 1
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500 active:bg-blue-700"
                }`}
              >
                Previous
              </button>

              <div className="flex items-center space-x-2">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageClick(pageNumber)}
                    className={`py-1 px-3 rounded transition-colors duration-200 ease-out ${
                      currentPage === pageNumber
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`text-white py-2 px-4 border-0 outline-none rounded transition-colors duration-200 ease-out ${
                  currentPage === totalPages
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500 active:bg-blue-700"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Form (Modal) */}
      {showcourseform && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={toggleCourseForm}
          ></div>

          {/* Form Container */}
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto relative z-50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {isEditing ? "Edit Course" : "Add Course"}
              </h2>
              <button
                type="button"
                onClick={toggleCourseForm}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCourseForm} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Course Number
                </label>
                <input
                  type="text"
                  placeholder="Enter Course Number"
                  value={coursenno}
                  onChange={(e) => setCoursenno(e.target.value)}
                  required={!isEditing}
                  readOnly={isEditing}
                  className={`mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Course ID
                </label>
                <input
                  type="text"
                  placeholder="Enter Course ID"
                  value={courseid}
                  onChange={(e) => setCourseid(e.target.value)}
                  required
                  readOnly={isEditing} // Make courseid read-only during editing
                  className={`mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                />
                {isEditing && (
                  <p className="text-sm text-gray-500 mt-1">
                    Course ID cannot be changed due to database constraints.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Course Name
                </label>
                <input
                  type="text"
                  placeholder="Enter the course name"
                  value={coursename}
                  onChange={(e) => setCoursename(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={toggleCourseForm}
                  className="text-white py-2 px-4 border-0 outline-none rounded transition-colors duration-200 ease-out bg-gray-600 hover:bg-gray-500 active:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-white py-2 px-4 border-0 outline-none rounded transition-colors duration-200 ease-out bg-blue-600 hover:bg-blue-500 active:bg-blue-700"
                >
                  {isEditing ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Course;