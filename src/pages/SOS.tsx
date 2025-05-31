import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from "../components/Layout";
import  { useEffect} from "react";
import {
  AlertTriangle,
  Flame,
  CloudRain,
  Building,
  Waves,
  Wind,
  AlertCircle,
  Mountain,
} from "lucide-react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;



function SOS() {
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const navigate = useNavigate();

  

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Broadcasting message:', broadcastMessage);
    setBroadcastMessage('');
    alert('Emergency announcement sent successfully!');
  };

  // Mock data - replace with actual API calls
  const pendingRequests = [
    { id: 1, type: 'Flood', location: 'Downtown District', time: '10:30 AM' },
    { id: 2, type: 'Fire', location: 'Industrial Zone', time: '11:45 AM' }
  ];

  const underReviewRequests = [
    { id: 3, type: 'Earthquake', location: 'Northern Suburbs', time: '9:15 AM' }
  ];

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <Layout>
          {/* Response Team Dashboard Content */}
          <div className="max-w-6xl mx-auto font-sans">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-resq-darkGreen">Response Team Dashboard</h1>
              
            </div>

            {/* SOS Columns */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              {/* Pending SOS Column */}
              <div className="flex-1 bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-resq-darkGreen p-4">
                  <h3 className="text-xl font-semibold text-resq-darkGreen">Pending SOS Requests</h3>
                </div>
                <div className="p-4 space-y-4">
                  {pendingRequests.map(request => (
                    <div key={request.id} className="border border-resq-lightGreen rounded-lg p-4 hover:bg-resq-lightGreen/10 transition-colors">
                       
                       
                      </div>
                    
                  ))}
                </div>
              </div>

              {/* Under Review Column */}
              <div className="flex-1 bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-resq-blue p-4">
                  <h3 className="text-xl font-semibold  text-resq-darkGreen">Under Review SOS Requests</h3>
                </div>
                <div className="p-4 space-y-4">
                  {underReviewRequests.map(request => (
                    <div key={request.id} className="border border-resq-lightBlue rounded-lg p-4 hover:bg-resq-lightBlue/10 transition-colors">
                      <div className="flex justify-between items-start">
                        
                         
                      </div>
                       
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Broadcast Section */}
             
          </div>
        </Layout>
      </div>
    </div>
  );
}

export default SOS;
