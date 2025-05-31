import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import { ArrowRight, Clock, LineChart, MapPin, Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Map from '../components/Map';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Announcement {
  id: string;
  content: string;
  created_at: string;
  is_important?: boolean;
}

const Index: React.FC = () => {
  const [announcement, setAnnouncement] = useState("");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  // Fetch announcements on component mount
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/get_announcements`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validate and transform API response
        const validatedAnnouncements = Array.isArray(data) 
          ? data
              .filter((item: any) => item && (item.id || item._id)) // Ensure items have IDs
              .map((item: any) => ({
                id: item.id || item._id,
                content: item.content || item.message || '',
                created_at: item.created_at || item.timestamp || new Date().toISOString(),
                is_important: item.is_important || false
              }))
          : [];

        setAnnouncements(validatedAnnouncements);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load announcements. Please try again later.");
        setAnnouncements([]);
      }
    };
    
    fetchAnnouncements();
  }, []);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcement.trim()) {
      setError("Announcement cannot be empty");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_BASE_URL}/create_announcement`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: announcement.trim() }),
        credentials: "include"
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create announcement");
      }

      const data = await response.json();
      const newAnnouncement = {
        id: data.id || data._id || Date.now().toString(),
        content: data.content || announcement,
        created_at: data.created_at || new Date().toISOString(),
        is_important: data.is_important || false
      };

      setSuccess("Announcement created successfully!");
      setAnnouncement("");
      setAnnouncements(prev => [newAnnouncement, ...prev]);
    } catch (err) {
      console.error("Broadcast Error:", err);
      setError(err instanceof Error ? err.message : "Failed to send announcement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (ann: Announcement) => {
    setEditingId(ann.id);
    setEditContent(ann.content);
  };

  const handleUpdate = async (id: string) => {
    if (!editContent.trim()) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/update_announcement/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent.trim() }),
        credentials: "include"
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update announcement");
      }

      const data = await response.json();
      setAnnouncements(prev => 
        prev.map(ann => ann.id === id ? { ...ann, content: data.content } : ann)
      );
      setEditingId(null);
      setSuccess("Announcement updated successfully!");
    } catch (err) {
      console.error("Update Error:", err);
      setError(err instanceof Error ? err.message : "Failed to update announcement");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/delete_announcement/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete announcement");
      }

      setAnnouncements(prev => prev.filter(ann => ann.id !== id));
      setSuccess("Announcement deleted successfully!");
    } catch (err) {
      console.error("Delete Error:", err);
      setError(err instanceof Error ? err.message : "Failed to delete announcement");
    }
  };

  return (
  
      <Layout>
        <Hero />
  
        {/* Broadcast Announcement Section */}
        <section className="py-20 bg-gradient-to-br from-resqlink-green/10 to-resqlink-orange/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Broadcast Announcement</h2>
            
            {/* Error/Success messages */}
            {error && (
              <div className="mb-6 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md max-w-3xl mx-auto">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-3 bg-green-100 border border-green-200 text-green-700 rounded-md max-w-3xl mx-auto">
                {success}
              </div>
            )}
  
            {/* Broadcast Form */}
            <form onSubmit={handleBroadcast} className="max-w-3xl mx-auto">
              <textarea
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="Type your important announcement here..."
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 mb-4"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-sm ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send"
                )}
              </button>
            </form>
  
            {/* Announcements List */}
            <div className="mt-12 text-left max-w-3xl mx-auto">
              <h3 className="text-xl font-bold mb-4">Recent Announcements</h3>
              <div className="space-y-4">
                {announcements.length === 0 ? (
                  <div className="p-4 bg-white rounded-lg shadow border border-gray-200 text-center text-gray-500">
                    No announcements yet
                  </div>
                ) : (
                  announcements.map(ann => (
                    <div key={ann.id} className="p-4 bg-white rounded-lg shadow border border-gray-200">
                      {editingId === ann.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1 text-gray-600 hover:text-gray-800"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleUpdate(ann.id)}
                              className="px-3 py-1 bg-resqlink-green hover:bg-resqlink-darkGreen text-white rounded-md"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-800">{ann.content}</p>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-sm text-gray-500">
                              Posted: {new Date(ann.created_at).toLocaleString()}
                            </p>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(ann)}
                                className="text-resqlink-green hover:text-resqlink-darkGreen p-1"
                                title="Edit"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(ann.id)}
                                className="text-red-500 hover:text-red-700 p-1"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
  

      {/* Map & Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <Map className="opacity-0 animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }} />
            </div>
            
            <div className="order-1 md:order-2 space-y-8">
              <div className="opacity-0 animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Real-Time Disaster Tracking</h2>
                <p className="text-lg text-resqlink-darkGreen/80 mb-6">
                  Our platform collects and analyzes disaster data from multiple sources to provide you with up-to-date intelligence for better decision making.
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="glassmorphism rounded-xl p-5 card-highlight opacity-0 animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
                  <MapPin className="h-8 w-8 text-resqlink-green mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Precise Locations</h3>
                  <p className="text-sm text-resqlink-darkGreen/70">
                    Get exact coordinates of disaster events with our interactive mapping system.
                  </p>
                </div>
                
                <div className="glassmorphism rounded-xl p-5 card-highlight opacity-0 animate-fade-in" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
                  <LineChart className="h-8 w-8 text-resqlink-green mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Data Analytics</h3>
                  <p className="text-sm text-resqlink-darkGreen/70">
                    AI-powered insights to help predict and analyze disaster patterns.
                  </p>
                </div>
              </div>
              
              <div className="pt-4 opacity-0 animate-fade-in" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
                <Link 
                  to="/dashboard" 
                  className="inline-flex items-center justify-center bg-resqlink-green hover:bg-resqlink-darkGreen text-white px-6 py-3 rounded-xl font-medium transition-all shadow-sm"
                >
                  Explore the Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-resqlink-green/10 to-resqlink-orange/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
              Join the Network of Disaster Responders
            </h2>
            <p className="text-lg text-resqlink-darkGreen/80 mb-10 opacity-0 animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
              ResQLink connects emergency services, relief organizations, and volunteers to coordinate effective disaster response efforts.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
              <button className="bg-resqlink-green hover:bg-resqlink-darkGreen text-white px-8 py-3 rounded-xl font-medium transition-all shadow-sm">
                Register Your Agency
              </button>
              <button className="bg-white hover:bg-white/80 text-resqlink-darkGreen px-8 py-3 rounded-xl font-medium transition-all shadow-sm border border-resqlink-darkGreen/10">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;