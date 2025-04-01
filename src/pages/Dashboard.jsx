import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Colors
} from 'chart.js';
import Navbar from './Navbar';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, Colors);

function Dashboard() {
    const navigate = useNavigate();
    const [studentCount, setStudentCount] = useState(0);
    const [courseCount, setCourseCount] = useState(0);
    const [studentTypes, setStudentTypes] = useState({
        cadet: 0,
        dayScholar: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch student types count
    

       

    // Fetch student count
    useEffect(() => {
        const fetchStudentCount = async () => {
            try {
                const response = await fetch('https://smsbackend-chi.vercel.app/dashboard/stcount');
                if (!response.ok) {
                    throw new Error('Failed to fetch student count');
                }
                const data = await response.json();
                setStudentCount(data.studentCount);
            } catch (error) {
                console.error('Error fetching student count:', error);
                setError('Failed to load student data');
            }
        };

        fetchStudentCount();
    }, []);

    // Fetch course count
    useEffect(() => {
        const fetchCourseCount = async () => {
            try {
                const response = await fetch('https://smsbackend-chi.vercel.app/dashboard/coursecount');
                if (!response.ok) {
                    throw new Error('Failed to fetch course count');
                }
                const data = await response.json();
                setCourseCount(data.courseCount);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching course count:', error);
                setError('Failed to load course data');
                setLoading(false);
            }
        };

        fetchCourseCount();
    }, []);
    

        
    return (
        <div className='relative'>
            <Navbar />
            <div className="container mx-auto px-4 py-6">
                <h1 className="text-3xl font-bold mb-6 flex justify-center">Dashboard</h1>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                
                {loading ? (
                    <div className="text-center py-4">Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-200 rounded-lg shadow-md p-6 ">
                            <h2 className="text-xl font-semibold mb-2 flex justify-center">Total Students</h2>
                            <p className="text-4xl font-bold text-blue-600 flex justify-center" >{studentCount}</p>
                            <button 
                                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
                                onClick={() => navigate('/students')}
                            >
                                View Students
                            </button>
                        </div>
                        
                        <div className="bg-gray-200 rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-2 flex justify-center">Total Courses</h2>
                            <p className="text-4xl font-bold text-green-600 flex justify-center">{courseCount}</p>
                            <button 
                                className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => navigate('/courses')}
                            >
                                View Courses
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;