
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { 
  AlertTriangle, 
  Calendar, 
  Filter, 
  MapPin, 
  Search, 
  SlidersHorizontal,
  Flame,
  CloudRain,
  Building,
  Wind,
  Snowflake,
  Clock,
  ArrowUpRight,
  BarChart3,
  Users,
  Megaphone
} from 'lucide-react';
import DisasterCard, { DisasterEvent } from '../components/DisasterCard';
import Map from '../components/Map';
import { Badge } from '../components/ui/badge';


// Sample disaster events data
const disasterEvents: DisasterEvent[] = [
  {
    id: 6,
    type: 'Snow',
    title: 'Sierra Nevada Snowstorm',
    location: 'Sierra Nevada Mountains, CA',
    date: 'May 11, 2023 - 07:30',
    description: 'Unexpected late season snowstorm causing hazardous conditions. Multiple highways closed and stranded motorists reported.',
    severity: 'medium',
    source: 'Highway Patrol',
    coordinates: [38.9800, -120.4400],
    rawDate: new Date('2023-05-11T07:30:00') // Add the rawDate property
  },
];

// Disaster type filters
const disasterTypes = [
  { id: 'all', name: 'All Types', icon: AlertTriangle },
  { id: 'fire', name: 'Fire', icon: Flame },
  { id: 'flood', name: 'Flood', icon: CloudRain },
  { id: 'earthquake', name: 'Earthquake', icon: Building },
  { id: 'storm', name: 'Storm', icon: Wind },
  { id: 'snow', name: 'Snow', icon: Snowflake },
];

// Severity filters
const severityLevels = [
  { id: 'all', name: 'All Severities' },
  { id: 'low', name: 'Low' },
  { id: 'medium', name: 'Medium' },
  { id: 'high', name: 'High' },
  { id: 'critical', name: 'Critical' },
];

const Dashboard: React.FC = () => {
  const [activeTypeFilter, setActiveTypeFilter] = useState('all');
  const [activeSeverityFilter, setActiveSeverityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter disasters based on selected filters and search query
  const filteredEvents = disasterEvents.filter(event => {
    const matchesType = activeTypeFilter === 'all' || event.type.toLowerCase() === activeTypeFilter;
    const matchesSeverity = activeSeverityFilter === 'all' || event.severity === activeSeverityFilter;
    const matchesSearch = searchQuery === '' || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesSeverity && matchesSearch;
  });

  return (
    <Layout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Dashboard Header */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Disaster Intelligence Dashboard</h1>
            <p className="text-lg text-resqlink-darkGreen/70">
              Real-time monitoring and analysis of active disaster events
            </p>
          </div>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glassmorphism rounded-xl p-4 flex items-center opacity-0 animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
              <div className="p-3 mr-3 bg-resqlink-green/10 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-resqlink-green" />
              </div>
              <div>
                <p className="text-sm text-resqlink-darkGreen/70">Active Events</p>
                <h3 className="text-2xl font-bold">{disasterEvents.length}</h3>
              </div>
            </div>
            
            <div className="glassmorphism rounded-xl p-4 flex items-center opacity-0 animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
              <div className="p-3 mr-3 bg-resqlink-orange/10 rounded-lg">
                <Clock className="h-6 w-6 text-resqlink-orange" />
              </div>
              <div>
                <p className="text-sm text-resqlink-darkGreen/70">Recent (24h)</p>
                <h3 className="text-2xl font-bold">12</h3>
              </div>
            </div>
            
            <div className="glassmorphism rounded-xl p-4 flex items-center opacity-0 animate-fade-in" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
              <div className="p-3 mr-3 bg-resqlink-darkGreen/10 rounded-lg">
                <Users className="h-6 w-6 text-resqlink-darkGreen" />
              </div>
              <div>
                <p className="text-sm text-resqlink-darkGreen/70">Responders</p>
                <h3 className="text-2xl font-bold">347</h3>
              </div>
            </div>
            
            <div className="glassmorphism rounded-xl p-4 flex items-center opacity-0 animate-fade-in" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
              <div className="p-3 mr-3 bg-resqlink-darkGreen/10 rounded-lg">
                <Megaphone className="h-6 w-6 text-resqlink-darkGreen" />
              </div>
              <div>
                <p className="text-sm text-resqlink-darkGreen/70">Alerts Issued</p>
                <h3 className="text-2xl font-bold">28</h3>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-resqlink-darkGreen/40" />
              </div>
              <input
                type="text"
                placeholder="Search disasters by title, location..."
                className="pl-10 pr-4 py-2 w-full border border-resqlink-darkGreen/20 rounded-lg bg-white/70 focus:bg-white focus:border-resqlink-green focus:ring-1 focus:ring-resqlink-green transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Filter Buttons */}
            <div className="flex items-center space-x-2">
              <button className="flex items-center px-4 py-2 border border-resqlink-darkGreen/20 rounded-lg bg-white/70 hover:bg-white transition-colors">
                <Filter className="h-4 w-4 mr-2" />
                <span>Filters</span>
              </button>
              
              <button className="flex items-center px-4 py-2 border border-resqlink-darkGreen/20 rounded-lg bg-white/70 hover:bg-white transition-colors">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Date Range</span>
              </button>
              
              <button className="flex items-center px-4 py-2 border border-resqlink-darkGreen/20 rounded-lg bg-white/70 hover:bg-white transition-colors">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <span>More</span>
              </button>
            </div>
          </div>

          {/* Type Filters */}
          <div className="mb-6 overflow-x-auto pb-2 opacity-0 animate-fade-in" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
            <div className="flex space-x-2">
              {disasterTypes.map(type => {
                const isActive = activeTypeFilter === type.id;
                const IconComponent = type.icon;
                
                return (
                  <button
                    key={type.id}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                      isActive 
                        ? 'bg-resqlink-green text-white' 
                        : 'bg-white/70 hover:bg-white border border-resqlink-darkGreen/20'
                    }`}
                    onClick={() => setActiveTypeFilter(type.id)}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    <span>{type.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Severity Filters */}
          <div className="mb-8 overflow-x-auto pb-2 opacity-0 animate-fade-in" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
            <div className="flex space-x-2">
              {severityLevels.map(severity => {
                const isActive = activeSeverityFilter === severity.id;
                
                return (
                  <button
                    key={severity.id}
                    className={`px-4 py-1 rounded-full text-sm transition-colors ${
                      isActive 
                        ? severity.id === 'all'
                          ? 'bg-resqlink-darkGreen text-white' 
                          : `bg-severity-${severity.id} ${severity.id === 'medium' ? 'text-resqlink-darkGreen' : 'text-white'}`
                        : 'bg-white/70 hover:bg-white border border-resqlink-darkGreen/20'
                    }`}
                    onClick={() => setActiveSeverityFilter(severity.id)}
                  >
                    {severity.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Disaster Events List */}
            <div className="md:col-span-2">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Active Disaster Events</h2>
                <span className="text-sm text-resqlink-darkGreen/60">
                  Showing {filteredEvents.length} of {disasterEvents.length} events
                </span>
              </div>
              
              <div className="flex sm:grid-cols-2 gap-6 justify-start ">
                {filteredEvents.map((event, index) => (
                  <DisasterCard 
                    key={event.id} 
                 
                  />
                ))}
                
                {filteredEvents.length === 0 && (
                  <div className="col-span-2 text-center py-12">
                    <AlertTriangle className="h-12 w-12 text-resqlink-darkGreen/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No events found</h3>
                    <p className="text-resqlink-darkGreen/60">
                      Try adjusting your filters or search criteria
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Sidebar Content */}
            <div className="space-y-8">
              {/* Map */}
              <div className="glassmorphism rounded-2xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Disaster Map</h3>
                  <button className="text-sm text-resqlink-green hover:text-resqlink-darkGreen font-medium inline-flex items-center">
                    Expand
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </button>
                </div>
                
                <Map className="h-[300px]" />
                
                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="flex items-center text-xs">
                    <span className="severity-dot severity-low"></span>
                    <span>Low</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="severity-dot severity-medium"></span>
                    <span>Medium</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="severity-dot severity-high"></span>
                    <span>High</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="severity-dot severity-critical"></span>
                    <span>Critical</span>
                  </div>
                </div>
              </div>
              
              {/* Analytics Summary */}
              <div className="glassmorphism rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <BarChart3 className="h-5 w-5 text-resqlink-green mr-2" />
                  <h3 className="font-semibold">Analytics Summary</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span>Response Activity</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="w-full h-2 bg-resqlink-darkGreen/10 rounded-full overflow-hidden">
                      <div className="h-full bg-resqlink-green rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span>Resource Allocation</span>
                      <span className="font-medium">64%</span>
                    </div>
                    <div className="w-full h-2 bg-resqlink-darkGreen/10 rounded-full overflow-hidden">
                      <div className="h-full bg-resqlink-green rounded-full" style={{ width: '64%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span>Alert Distribution</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="w-full h-2 bg-resqlink-darkGreen/10 rounded-full overflow-hidden">
                      <div className="h-full bg-resqlink-green rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
                
                <button className="mt-6 w-full py-2 bg-white hover:bg-resqlink-beige text-resqlink-darkGreen border border-resqlink-darkGreen/20 rounded-lg transition-colors text-sm font-medium">
                  View Detailed Analytics
                </button>
              </div>
              
              {/* Recent Activity */}
              <div className="glassmorphism rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Recent Activity</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 mt-1 bg-resqlink-green/10 rounded-full flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-resqlink-green" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm">New evacuation center added in <strong>Riverside County</strong></p>
                      <span className="text-xs text-resqlink-darkGreen/60">12 minutes ago</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 mt-1 bg-resqlink-orange/10 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-resqlink-orange" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm">Alert level increased for <strong>Sonoma Valley Wildfire</strong></p>
                      <span className="text-xs text-resqlink-darkGreen/60">43 minutes ago</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 mt-1 bg-resqlink-darkGreen/10 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-resqlink-darkGreen" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm"><strong>Fire Department</strong> dispatched additional units to Sonoma</p>
                      <span className="text-xs text-resqlink-darkGreen/60">1 hour ago</span>
                    </div>
                  </div>
                </div>
                
                <button className="mt-4 text-sm text-resqlink-green hover:text-resqlink-darkGreen font-medium">
                  View all activity
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
