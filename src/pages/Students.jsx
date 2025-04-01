import React, { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function Students() {
  const navigate = useNavigate();

  const [showaddform, setshowaddform] = useState(false);
  const [student_type, setstudent_type] = useState("");
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [address, setaddress] = useState("");
  const [dob, setdob] = useState(null);
  const [nic, setnic] = useState("");
  const [degree, setdegree] = useState("");
  const [currentyear, setcurrentyear] = useState("");
  const [semester, setsemester] = useState("");
  const [searchterm, setsearchterm] = useState("");
  const [students, setstudents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchstudents();
  }, []);

  const fetchstudents = async () => {
    try {
      const response = await fetch("https://smsbackend-chi.vercel.app/students");
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      const data = await response.json();
      setstudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      alert("Error fetching students: " + error.message);
    }
  };

  const toggleform = () => {
    if (showaddform) {
      setstudent_type("");
      setfirst_name("");
      setlast_name("");
      setaddress("");
      setdob(null);
      setnic("");
      setdegree("");
      setcurrentyear("");
      setsemester("");
      setIsEditing(false);
      setSelectedStudent(null);
    }
    setshowaddform(!showaddform);
  };

  const handleEdit = (student) => {
    setstudent_type(student.student_type);
    setfirst_name(student.first_name);
    setlast_name(student.last_name);
    setaddress(student.address);
    setdob(new Date(student.dob));
    setnic(student.nic);
    setdegree(student.degree);
    setcurrentyear(student.currentyear);
    setsemester(student.semester);
    setIsEditing(true);
    setSelectedStudent(student);
    setshowaddform(true);
  };

  const handleDelete = async (student_no) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const response = await fetch("https://smsbackend-chi.vercel.app/students", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student_no }),
        });
        if (!response.ok) {
          throw new Error("Failed to delete student");
        }
        const data = await response.json();
        console.log("Delete response:", data);
        alert("Student deleted successfully");
        fetchstudents();
      } catch (error) {
        console.error("Delete error:", error.message);
        alert("Error deleting student: " + error.message);
      }
    }
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    if (!student_type || !first_name || !last_name || !address || !dob || !nic || !degree || !currentyear || !semester) {
      alert("All fields are required");
      return;
    }
    try {
      const formattedDob = dob ? dob.toISOString().split("T")[0] : null;
      const body = {
        student_type,
        first_name,
        last_name,
        address,
        dob: formattedDob,
        nic,
        degree,
        currentyear,
        semester,
      };
      if (isEditing && selectedStudent) {
        body.student_no = selectedStudent.student_no;
      }
      const response = await fetch("https://smsbackend-chi.vercel.app/students" + (isEditing ? "" : "/addstudents"), {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      console.log("Response:", data);

      if (response.ok) {
        alert(isEditing ? "Student updated successfully" : "Student added successfully");
        toggleform();
        fetchstudents();
      } else {
        alert("Operation failed: " + (data.error || data));
      }
    } catch (error) {
      console.error(error.message);
      alert("Error: " + error.message);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    setIsLoading(true);
    setstudents([]); // Clear previous results

    try {
      const response = await fetch("https://smsbackend-chi.vercel.app/students/searchstudents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchterm }),
      });

      const data = await response.json();
      console.log("Search response:", data);

      if (response.ok) {
        setstudents(data.students);
        if (data.students.length === 0) {
          setMessage({ text: "No students found matching your search.", type: "info" });
        } else {
          setMessage({ text: `Found ${data.students.length} student(s).`, type: "success" });
        }
      } else {
        setMessage({ text: data.error || "Search failed. Please try again.", type: "error" });
      }
    } catch (error) {
      console.error("Error searching students:", error);
      setMessage({ text: "An unexpected error occurred while searching. Please try again.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='relative'>
    <Navbar />
    <div className=" min-h-screen bg-gray-200 p-4">
      

      <div className="flex justify-end items-center space-x-4 mb-4">
        <button
          onClick={toggleform}
          className="text-white py-2 px-4 border-0 outline-none rounded transition-colors duration-200 ease-out bg-blue-600 hover:bg-blue-500 active:bg-blue-700 "
        >
          {isEditing ? "Cancel Edit" : "Add Student"}
        </button>
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <input
            type="text"
            value={searchterm}
            placeholder="Enter a value to search"
            onChange={(e) => setsearchterm(e.target.value)}
            required
            className="border border-gray-300 rounded px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="text-white py-2 px-4 border-0 outline-none rounded transition-colors duration-200 ease-out bg-blue-600 hover:bg-blue-500 active:bg-blue-700"
          >
            Search
          </button>
        </form>
      </div>

      {/* Table to Display Students */}
      <div className="bg-white w-full max-h-full flex flex-col shadow-2xl">
        <div className="text-white bg-gray-800 p-4">
          <h2 className="m-0 p-0 font-bold text-center">Students</h2>
        </div>
        <div className="w-full h-full overflow-auto">
          <table className="bg-white text-base border-collapse w-full">
            <thead>
              <tr>
                <th className="text-white font-normal bg-gray-500 border-b-2 border-gray-300 sticky top-0 text-left p-4 box-border">
                  Student No
                </th>
                <th className="text-white font-normal bg-gray-500 border-b-2 border-gray-300 sticky top-0 text-left p-4 box-border">
                  Student Type
                </th>
                <th className="text-white font-normal bg-gray-500 border-b-2 border-gray-300 sticky top-0 text-left p-4 box-border">
                  First Name
                </th>
                <th className="text-white font-normal bg-gray-500 border-b-2 border-gray-300 sticky top-0 text-left p-4 box-border">
                  Last Name
                </th>
                <th className="text-white font-normal bg-gray-500 border-b-2 border-gray-300 sticky top-0 text-left p-4 box-border">
                  Address
                </th>
                <th className="text-white font-normal bg-gray-500 border-b-2 border-gray-300 sticky top-0 text-left p-4 box-border">
                  DOB
                </th>
                <th className="text-white font-normal bg-gray-500 border-b-2 border-gray-300 sticky top-0 text-left p-4 box-border">
                  NIC
                </th>
                <th className="text-white font-normal bg-gray-500 border-b-2 border-gray-300 sticky top-0 text-left p-4 box-border">
                  Degree
                </th>
                <th className="text-white font-normal bg-gray-500 border-b-2 border-gray-300 sticky top-0 text-left p-4 box-border">
                  Current Year
                </th>
                <th className="text-white font-normal bg-gray-500 border-b-2 border-gray-300 sticky top-0 text-left p-4 box-border">
                  Semester
                </th>
                <th className="text-white font-normal bg-gray-500 border-b-2 border-gray-300 sticky top-0 text-left p-4 box-border">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student, index) => (
                  <tr
                    key={index}
                    className="transition-colors duration-150 ease-out even:bg-gray-50 hover:bg-gray-100"
                  >
                    <td className="border border-gray-300 border-l-0 border-r-0 whitespace-nowrap text-left p-4 box-border">
                      {student.student_no}
                    </td>
                    <td className="border border-gray-300 border-l-0 border-r-0 whitespace-nowrap text-left p-4 box-border">
                      {student.student_type}
                    </td>
                    <td className="border border-gray-300 border-l-0 border-r-0 whitespace-nowrap text-left p-4 box-border">
                      {student.first_name}
                    </td>
                    <td className="border border-gray-300 border-l-0 border-r-0 whitespace-nowrap text-left p-4 box-border">
                      {student.last_name}
                    </td>
                    <td className="border border-gray-300 border-l-0 border-r-0 whitespace-nowrap text-left p-4 box-border">
                      {student.address}
                    </td>
                    <td className="border border-gray-300 border-l-0 border-r-0 whitespace-nowrap text-left p-4 box-border">
                      {student.dob}
                    </td>
                    <td className="border border-gray-300 border-l-0 border-r-0 whitespace-nowrap text-left p-4 box-border">
                      {student.nic}
                    </td>
                    <td className="border border-gray-300 border-l-0 border-r-0 whitespace-nowrap text-left p-4 box-border">
                      {student.degree}
                    </td>
                    <td className="border border-gray-300 border-l-0 border-r-0 whitespace-nowrap text-left p-4 box-border">
                      {student.currentyear}
                    </td>
                    <td className="border border-gray-300 border-l-0 border-r-0 whitespace-nowrap text-left p-4 box-border">
                      {student.semester}
                    </td>
                    <td className="border border-gray-300 border-l-0 border-r-0 whitespace-nowrap text-left p-4 box-border">
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-white py-2 px-4 border-0 m-0 outline-none rounded-none transition-colors duration-200 ease-out bg-blue-600 hover:bg-blue-500 active:bg-blue-700 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student.student_no)}
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
                    colSpan="11"
                    className="border border-gray-300 border-l-0 border-r-0 whitespace-nowrap text-left p-4 box-border"
                  >
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Form (Modal) */}
      {showaddform && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 "
            onClick={toggleform}
          ></div>

          {/* Form Container */}
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto relative z-50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {isEditing ? "Edit Student" : "Add Students"}
              </h2>
              <button
                type="button"
                onClick={toggleform}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handlesubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Student Type
                </label>
                <select
                  value={student_type}
                  onChange={(e) => setstudent_type(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select a value
                  </option>
                  <option value="Day Scholor">Day Scholar</option>
                  <option value="Cadet Officer">Cadet Officer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Enter first name"
                  value={first_name}
                  onChange={(e) => setfirst_name(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Enter the last name"
                  value={last_name}
                  onChange={(e) => setlast_name(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Enter the address"
                  value={address}
                  onChange={(e) => setaddress(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  DOB
                </label>
                <DatePicker
                  selected={dob}
                  onChange={(date) => setdob(date)}
                  dateFormat="yyyy-MM-dd"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={50}
                  placeholderText="Select a date"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  NIC
                </label>
                <input
                  type="text"
                  placeholder="National ID Number"
                  value={nic}
                  onChange={(e) => setnic(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Degree
                </label>
                <select
                  value={degree}
                  onChange={(e) => setdegree(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select a degree
                  </option>
                  <option value="Bsc.(Hons) Software Engineering">
                    Bsc.(Hons) Software Engineering
                  </option>
                  <option value="Bsc.(Hons) Computer Science">
                    Bsc.(Hons) Computer Science
                  </option>
                  <option value="Bsc.(Hons) Computer Engineering">
                    Bsc.(Hons) Computer Engineering
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Year
                </label>
                <select
                  value={currentyear}
                  onChange={(e) => setcurrentyear(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select the current year
                  </option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => setsemester(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select the current semester
                  </option>
                  <option value="1">1st Semester</option>
                  <option value="2">2nd Semester</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={toggleform}
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
    </div>
  );
}

export default Students;