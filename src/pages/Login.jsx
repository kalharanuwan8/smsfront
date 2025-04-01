import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import logo from '../assets/Kotelawala_Defence_University_crest.png';

function Login() {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const handlesubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    try {
      const body = { email, password };
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log("Login Response:", data);

      if (response.ok) {
        console.log("Email received:", body.email);
        // Store user data in localStorage
        setMessage({ text: "Login successful! Redirecting...", type: "success" });
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        console.error("Login failed:", data.error);
        setMessage({ text: data.error || "Login failed. Please try again.", type: "error" });
      }
    } catch (err) {
      console.error("Error during login:", err.message);
      setMessage({ text: "Error during login: " + err.message, type: "error" });
    }
  };


  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="KDU Student Management System" src={logo} className="mx-auto h-20 w-auto" />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>

        {message.text && (
          <div
            className={`mt-4 p-3 rounded text-center ${
              message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handlesubmit}>
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Email
              </label>
              <div>
                <input
                  type="email"
                  placeholder="e-mail"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mt-2">
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                Password
              </label>
              <div>
                <input
                  type="password"
                  placeholder="password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="text-sm mt-1">
              <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-1"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;