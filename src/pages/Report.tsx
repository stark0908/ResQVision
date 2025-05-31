import { useState, useEffect } from "react";
import Layout from "../components/Layout";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


type DisasterType =
  | "None"
  | "Earthquake"
  | "Flood"
  | "Wildfire"
  | "Hurricane"
  | "Tornado"
  | "Tsunami"
  | "Landslide"
  | "Drought"
  | "Volcanic Eruption"
  | "Other";

interface SOSFormData {
  mobileNumber: string;
  disasterType: DisasterType;
  details: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

interface Announcement {
  id: string;
  content: string;
  created_at: string;
}

export default function SOSForm() {
  const [formData, setFormData] = useState<SOSFormData>({
    mobileNumber: "",
    disasterType: "None",
    details: "",
  });
  const [errors, setErrors] = useState<{ disasterType?: string }>({});
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState(false);
const [announcementsError, setAnnouncementsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setIsLoadingAnnouncements(true);
      setAnnouncementsError(null);
      
      try {
        const response = await fetch(`${API_BASE_URL}/get_announcements`);
        if (!response.ok) {
          throw new Error('Failed to load announcements');
        }
        const data = await response.json();
        setAnnouncements(data);
      } catch (error) {
        console.error("Error loading announcements:", error);
        setAnnouncementsError(error instanceof Error ? error.message : 'Failed to load announcements');
      } finally {
        setIsLoadingAnnouncements(false);
      }
    };
  
    fetchAnnouncements();
  }, []);

  // Show location permission modal on component mount
  useEffect(() => {
    setShowLocationModal(true);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getLocation = () => {
    setIsLocationLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        }));
        setIsLocationLoading(false);
        setShowLocationModal(false);
      },
      (error) => {
        setLocationError("Unable to retrieve your location: " + error.message);
        setIsLocationLoading(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    // Validate all fields
    if (formData.disasterType === "None") {
      setErrors({ disasterType: "Please select a valid disaster type" });
      setIsSubmitting(false);
      return;
    }
  
    if (!formData.location) {
      setLocationError("Location is required");
      setIsSubmitting(false);
      return;
    }
  
    try {
      const payload = {
        // Adjust these fields to match your API spec
        mobileNumber: formData.mobileNumber,
        disasterType: formData.disasterType,
        details: formData.details,
        location: {
          latitude: formData.location.latitude,
          longitude: formData.location.longitude
        },
        reportedAt: new Date().toISOString()
      };
  
      console.log("Sending payload:", payload); // Debug log
  
      const response = await fetch(`${API_BASE_URL}/api/v1/sos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      });
  
      const responseData = await response.json();
      console.log("Full response:", response); // Debug log
  
      if (!response.ok) {
        // Enhanced error details
        throw new Error(
          responseData.message || 
          responseData.error || 
          `Server responded with ${response.status}: ${response.statusText}`
        );
      }
  
      // Success handling...
      
    } catch (error) {
      console.error('Full error:', error);
      alert(`Submission failed: ${error.message}\n\nPlease check your input and try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="pt-24 pb-16 bg-[#f5f9f5]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
            {/* Main Form Section */}
            <div className="flex-1 p-6 bg-white rounded-lg shadow-lg border border-[#e0e8e0]">
              {/* Location Permission Modal */}
              {showLocationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg max-w-sm mx-4 border border-[#41644a]">
                    <h3 className="text-lg font-bold text-[#41644a] mb-3">
                      Emergency Location Access
                    </h3>
                    <p className="mb-4">
                      For faster emergency response, sharing your location is
                      required.
                    </p>
                    {locationError && (
                      <p className="text-[#41644a] text-sm mb-4">
                        {locationError}
                      </p>
                    )}
                    <div className="flex space-x-3">
                      <button
                        onClick={getLocation}
                        disabled={isLocationLoading}
                        className="flex-1 bg-[#41644a] hover:bg-[#345239] text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a8a62] disabled:opacity-50 transition-colors"
                      >
                        {isLocationLoading ? "Detecting..." : "Share Location"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <h2 className="text-2xl font-bold text-[#41644a] text-center mb-4">
                Emergency Report Form
              </h2>
              <p className="text-gray-600 text-sm text-center mb-6">
                Use this form to report emergencies. Your information will be sent
                to disaster response teams.
              </p>

              {formData.location && (
                <div className="mb-4 p-3 bg-[#e8f2e9] border border-[#c8d9ca] rounded-md">
                  <p className="text-[#2d4a32] text-sm">
                    ✅ Location shared: {formData.location.latitude.toFixed(4)},{" "}
                    {formData.location.longitude.toFixed(4)}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="mobileNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mobile Number (optional)
                  </label>
                  <input
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="Enter mobile number if available"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5a8a62] focus:border-[#5a8a62]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="disasterType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Type of Disaster <span className="text-[#41644a]">*</span>
                  </label>
                  <select
                    id="disasterType"
                    name="disasterType"
                    value={formData.disasterType}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 border ${
                      errors.disasterType
                        ? "border-[#41644a]"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5a8a62] focus:border-[#5a8a62]`}
                  >
                    <option value="None">None</option>
                    <option value="Earthquake">Earthquake</option>
                    <option value="Flood">Flood</option>
                    <option value="Wildfire">Wildfire</option>
                    <option value="Hurricane">Hurricane</option>
                    <option value="Tornado">Tornado</option>
                    <option value="Tsunami">Tsunami</option>
                    <option value="Landslide">Landslide</option>
                    <option value="Drought">Drought</option>
                    <option value="Volcanic Eruption">Volcanic Eruption</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.disasterType && (
                    <p className="mt-1 text-sm text-[#41644a]">
                      {errors.disasterType}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="details"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Additional Details (optional)
                  </label>
                  <textarea
                    id="details"
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    placeholder="Provide any additional information about the situation"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5a8a62] focus:border-[#5a8a62]"
                  />
                </div>

                <button
  type="submit"
  disabled={isSubmitting}
  className={`w-full ${
    isSubmitting ? 'bg-[#345239]' : 'bg-[#41644a] hover:bg-[#345239]'
  } text-white font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5a8a62] transition-colors flex justify-center items-center`}
>
  {isSubmitting ? (
    <>
      <svg
        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      Sending...
    </>
  ) : (
    'Send Emergency Report'
  )}
</button>

              </form>
            </div>

            {/* Broadcast Guidelines Section */}
            <div className="flex-1 p-6 bg-white rounded-lg shadow-lg border border-[#e0e8e0]">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-2xl font-bold text-[#41644a]">
      Broadcast Guidelines
    </h2>
    <button
      onClick={() => setShowGuidelines(!showGuidelines)}
      className="text-[#41644a] hover:text-[#345239] transition-colors"
    >
      {showGuidelines ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  </div>

  {/* Guidelines Section (keep your existing guidelines code) */}
  {showGuidelines && (
    <div className="space-y-4">
      {/* Your existing guidelines content */}
    </div>
  )}

  {/* Announcements Section */}
  <div className="mt-8">
    <h3 className="text-lg font-semibold text-[#41644a] mb-3">
      Latest Announcements
    </h3>
    
    {isLoadingAnnouncements ? (
      <div className="flex justify-center items-center py-4">
        <svg className="animate-spin h-5 w-5 text-[#41644a]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    ) : announcementsError ? (
      <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-md">
        {announcementsError}
      </div>
    ) : announcements.length > 0 ? (
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="p-4 bg-[#f0f7f1] rounded-md border border-[#d0e0d2]">
            <p className="text-gray-700">{announcement.content}</p>
            <small className="text-gray-500">
              Posted: {new Date(announcement.created_at).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    ) : (
      <div className="p-3 bg-[#e8f2e9] border border-[#c8d9ca] rounded-md">
        <p className="text-[#2d4a32]">No current announcements</p>
      </div>
    )}
  </div>
</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}