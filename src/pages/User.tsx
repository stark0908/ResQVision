import React, { useState } from "react";
import Layout from "../components/Layout";
import SOSForm from "./Report";
import { Link, useNavigate } from 'react-router-dom';

function User() {
  const [agencyId, setAgencyId] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if both fields are filled
    if (!agencyId || !password) {
      alert("Both Agency ID and Password are required.");
      return;
    }

    // Handle login logic here
    console.log("Agency ID:", agencyId);
    console.log("Password:", password);
    // Add your login logic (e.g., API call) here
  };

  return (
    <Layout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* User report form */}
          <SOSForm />
          {/* Agency Login Form */}
          <div className="flex justify-center mt-3">
            <div className="mb-8 p-6 bg-white rounded-lg shadow-md max-w-max">
              <h1 className="text-4xl font-bold text-center mb-4">Disaster Response Portal</h1>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="agencyId" className="block text-sm font-medium text-gray-700 mb-1">
                    Agency ID
                  </label>
                  <input
                    type="text"
                    id="agencyId"
                    value={agencyId}
                    onChange={(e) => setAgencyId(e.target.value)}
                    placeholder="Enter your agency ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <Link to="/index">
                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Login
                </button>
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default User;