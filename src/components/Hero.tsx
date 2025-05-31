
import React from 'react';
import { ArrowRight, MapPin, Phone, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import LiveFeed from './LiveFeed';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 right-0 h-full">
        <div className="absolute right-[10%] top-[20%] w-64 h-64 bg-gradient-radial from-resqlink-green/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute left-[15%] top-[35%] w-72 h-72 bg-gradient-radial from-resqlink-orange/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-16">
          {/* Left Column - Text Content */}
          <div className="md:w-1/2 md:max-w-lg space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-resqlink-green/10 text-resqlink-green text-sm font-medium mb-2">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-resqlink-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-resqlink-green"></span>
              </span>
              LIVE DISASTER INTELLIGENCE
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              Real-Time Disaster Intelligence for 
              <span className="text-resqlink-green"> Rapid Response</span>
            </h1>
            
            <p className="text-lg md:text-xl text-resqlink-darkGreen/80 text-balance">
              Automatically aggregating critical disaster data from multiple sources to provide emergency responders with actionable intelligence when every minute counts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                to="/Dashboard" 
                className="inline-flex items-center justify-center bg-resqlink-green hover:bg-resqlink-darkGreen text-white px-6 py-3 rounded-xl font-medium transition-all shadow-sm"
              >
                View Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              
              {/* <Link 
                to="/report" 
                className="inline-flex items-center justify-center bg-resqlink-orange hover:bg-resqlink-orange/90 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-sm"
              >
                Report an Incident
              </Link> */}
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <Link to="/emergency" className="glassmorphism rounded-xl p-4 card-highlight">
                <Phone className="h-6 w-6 text-resqlink-darkGreen mb-2" />
                <h3 className="font-medium">Emergency Contacts</h3>
                <p className="text-sm text-resqlink-darkGreen/70">Quick access to help lines</p>
              </Link>
              
              <a href="https://dis-lime.vercel.app/" className="glassmorphism rounded-xl p-4 card-highlight">
                <MapPin className="h-6 w-6 text-resqlink-darkGreen mb-2" />
                <h3 className="font-medium">Disaster Map</h3>
                <p className="text-sm text-resqlink-darkGreen/70">View affected locations</p>
              </a>
            </div>
          </div>
          
          {/* Right Column - Interactive Elements */}
          <div className="md:w-1/2 w-full space-y-8 opacity-0 animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
            {/* Search Bar */}
            <div className="glassmorphism rounded-xl overflow-hidden flex items-center p-1 shadow-sm">
              <input 
                type="text" 
                placeholder="Search by location, type or severity..." 
                className="flex-1 bg-transparent border-none px-4 py-3 focus:ring-0 placeholder:text-resqlink-darkGreen/40"
              />
              <button className="bg-resqlink-green hover:bg-resqlink-darkGreen text-white p-3 rounded-lg transition-colors">
                <Search className="h-5 w-5" />
              </button>
            </div>
            
            {/* Live Feed */}
            <div className="glassmorphism rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Live Disaster Updates</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-resqlink-orange/10 text-resqlink-orange">
                  LIVE
                </span>
              </div>

               <LiveFeed />
             
              
              <div className="mt-4 pt-4 border-t border-resqlink-darkGreen/10">
                <Link 
                  to="/dashboard" 
                  className="inline-flex items-center text-resqlink-green hover:text-resqlink-darkGreen font-medium"
                >
                  View all updates
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
