import React, { useEffect, useState } from "react";
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

interface DisasterUpdate {
  id: number;
  disaster_type: string;
  location: string;
  created_at: string;
  message: string;
  mobile_number?: string;
  status: string;
  source?: string;
}

const LiveFeed: React.FC<{ initialUpdates?: DisasterUpdate[] }> = ({
  initialUpdates = [],
}) => {
  const [updates, setUpdates] = useState<DisasterUpdate[]>(initialUpdates);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch disaster updates from API
  const fetchDisasterUpdates = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/get_sos_messages`);

      if (!response.ok) throw new Error("Failed to fetch disaster updates");

      const data = await response.json();

      const validatedData = data.map((update: any) => ({
        id: update.id || Date.now(),
        disaster_type: update.disaster_type || "unknown",
        location: update.location || "Unknown location",
        created_at: update.created_at || new Date().toISOString(),
        message: update.message || "No details provided",
        mobile_number: update.mobile_number,
        status: update.status || "under review",
        source: update.source,
      }));

      setUpdates(validatedData);
      setError(null);
    } catch (err) {
      console.error("Error fetching disaster updates:", err);
      setError("Failed to load updates. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Poll for updates every 30 seconds
  useEffect(() => {
    fetchDisasterUpdates();

    const intervalId = setInterval(fetchDisasterUpdates, 3000);
    return () => clearInterval(intervalId);
  }, []);

  // Map disaster types to icons
  const getDisasterIcon = (type: string | null | undefined) => {
    if (!type) return AlertCircle; // Handle null/undefined cases

    switch (type.toLowerCase()) {
      case "flood":
        return CloudRain;
      case "fire":
        return Flame;
      case "earthquake":
        return Building;
      case "tsunami":
        return Waves;
      case "hurricane":
      case "storm":
        return Wind;
      case "landslide":
        return Mountain;
      default:
        return AlertCircle;
    }
  };

  // Get severity class based on status
  const getSeverityClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "under review":
        return "severity-medium";
      case "verified":
        return "severity-high";
      case "critical":
        return "severity-critical";
      case "resolved":
        return "severity-low";
      default:
        return "severity-medium";
    }
  };

  // Format location string
  const formatLocation = (location: string) => {
    if (location.includes("Lat:") && location.includes("Lng:")) {
      const [latPart, lngPart] = location.split(",");
      const lat = parseFloat(latPart.replace("Lat:", "").trim()).toFixed(4);
      const lng = parseFloat(lngPart.replace("Lng:", "").trim()).toFixed(4);
      return `${lat}, ${lng}`;
    }
    return location;
  };

  // Parse message content
  const parseMessage = (message: string) => {
    if (message.includes("Disaster Type:") && message.includes("Details:")) {
      return message.split("Details:")[1].trim();
    }
    return message;
  };

  if (loading && updates.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-resqlink-darkGreen"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-50 border border-red-100 text-red-600">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <span>{error}</span>
        </div>
        <button
          onClick={fetchDisasterUpdates}
          className="mt-2 px-3 py-1 text-sm bg-resqlink-darkGreen text-white rounded hover:bg-resqlink-darkGreen/80 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="max-h-96 overflow-y-auto"> {/* Make the feed scrollable */}
        {updates.map((update, index) => {
          const IconComponent = getDisasterIcon(update.disaster_type);
          const formattedTime = new Date(update.created_at).toLocaleString();

          return (
            <div
              key={update.id}
              className=" m-3 p-3 rounded-lg bg-white/100 hover:bg-white/70 border border-white/40 transition-all duration-300 shadow-sm opacity-0 animate-fade-in"
              style={{
                animationDelay: `${index * 0.1 + 0.5}s`,
                animationFillMode: "forwards",
              }}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <IconComponent className="h-5 w-5 text-resqlink-darkGreen" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`severity-dot ${getSeverityClass(
                        update.status
                      )}`}
                    ></span>
                    <h4 className="font-medium text-resqlink-darkGreen capitalize">
                      {(update.disaster_type || "unknown").toLowerCase()}
                    </h4>
                    <span className="text-xs text-resqlink-darkGreen/50">•</span>
                    <span className="text-xs text-resqlink-darkGreen/60">
                      {formattedTime}
                    </span>
                  </div>

                  <p className="text-sm text-resqlink-darkGreen/80 mb-1">
                    {parseMessage(update.message)}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-resqlink-darkGreen/70">
                      {formatLocation(update.location)}
                    </span>
                    {update.mobile_number && (
                      <span className="text-xs text-resqlink-darkGreen/70">
                        Contact: {update.mobile_number}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveFeed;