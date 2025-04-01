import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

function Logs() {
  const [logdata, setlogdata] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const logsPerPage = 10; // Number of logs per page

  useEffect(() => {
    fetchlogs();
  }, []);

  const handleDownload = () => {
    window.location.href = "https://smsbackend-chi.vercel.app/logs/download";
  };

  const fetchlogs = async () => {
    try {
      const response = await fetch("https://smsbackend-chi.vercel.app/logs");
      if (!response.ok) {
        throw new Error("Failed to fetch logs");
      }
      const data = await response.json();
      setlogdata(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching logs:", error.message);
      alert("Error fetching logs: " + error.message);
    }
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(logdata.length / logsPerPage);

  // Get the logs for the current page
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logdata.slice(indexOfFirstLog, indexOfLastLog);

  // Handle page navigation
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
    <div>
      <Navbar />
      <div className="relative min-h-screen bg-gray-200 p-4">

        <div className="flex items-center space-x-4 mb-4 flex justify-end">
          <button
            onClick={handleDownload}
            className="text-white py-2 px-4 border-0 outline-none rounded transition-colors duration-200 ease-out bg-green-600 hover:bg-green-500 active:bg-green-700"
          >
            Download Logs
          </button>
        </div>

        {/* Table to Display Logs */}
        <div className="bg-white w-full max-h-full flex flex-col shadow-2xl">
          <div className="text-white bg-gray-800 p-4">
            <h2 className="m-0 p-0 font-bold text-center">Admin Logs & History</h2>
          </div>
          <div className="w-full h-full overflow-auto">
            <table className="bg-white text-base border-collapse w-full">
              <thead>
                <tr>
                  <th className="text-white font-normal bg-gray-500 border-b-2 border-gray-300 sticky top-0 text-left p-4 box-border">
                    Attempt
                  </th>
                  <th className="text-white font-normal bg-gray-500 border-b-2 border-gray-300 sticky top-0 text-left p-4 box-border">
                    Activity
                  </th>
                  <th className="text-white font-normal bg-gray-500 border-b-2 border-gray-300 sticky top-0 text-left p-4 box-border">
                    Date
                  </th>
                  <th className="text-white font-normal bg-gray-500 border-b-2 border-gray-300 sticky top-0 text-left p-4 box-border">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.length > 0 ? (
                  currentLogs.map((logdata, index) => (
                    <tr
                      key={indexOfFirstLog + index + 1}
                      className="transition-colors duration-150 ease-out even:bg-gray-50 hover:bg-gray-100"
                    >
                      <td className="border border-gray-300 border-l-0 border-r-0 whitespace-nowrap text-left p-4 box-border">
                        {logdata.attempt}
                      </td>
                      <td className="border border-gray-300 border-l-0 border-r-0 whitespace-nowrap text-left p-4 box-border">
                        {logdata.activity}
                      </td>
                      <td className="border border-gray-300 border-l-0 border-r-0 whitespace-nowrap text-left p-4 box-border">
                        {logdata.date}
                      </td>
                      <td className="border border-gray-300 border-l-0 border-r-0 whitespace-nowrap text-left p-4 box-border">
                        {logdata.time}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="transition-colors duration-150 ease-out">
                    <td
                      colSpan="4"
                      className="border border-gray-300 border-l-0 border-r-0 whitespace-nowrap text-left p-4 box-border"
                    >
                      No attempt found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {logdata.length > 0 && (
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
    </div>
  );
}

export default Logs;