import React, { useState, useEffect } from "react";
import {
  ExternalLink,
  MapPin,
  Calendar,
  AlertCircle,
  AlertTriangle,
  CloudRain,
  Flame,
  Building,
  RefreshCw,
} from "lucide-react";

export interface DisasterEvent {
  id: number;
  type: string;
  title: string;
  location: string;
  date: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  source: string;
  coordinates?: [number, number];
  detailsUrl?: string;
  rawDate: Date; // Added for filtering
}

interface DisasterCardProps {
  event: DisasterEvent;
  style?: React.CSSProperties;
}

const DisasterCard: React.FC<DisasterCardProps> = ({ event, style }) => {
  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "flood":
        return <CloudRain className="h-6 w-6" />;
      case "fire":
        return <Flame className="h-6 w-6" />;
      case "earthquake":
        return <Building className="h-6 w-6" />;
      default:
        return <AlertTriangle className="h-6 w-6" />;
    }
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-severity-low text-white";
      case "medium":
        return "bg-severity-medium text-resqlink-darkGreen";
      case "high":
        return "bg-severity-high text-white";
      case "critical":
        return "bg-severity-critical text-white";
      default:
        return "bg-severity-low text-white";
    }
  };

  return (
    <div
      className="disaster-card opacity-0 animate-fade-in p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
      style={{ ...style, animationFillMode: "forwards" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-resqlink-beige rounded-lg mr-3">
            {getIcon(event.type)}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-resqlink-darkGreen">
              {event.title}
            </h3>
            <p className="text-sm text-resqlink-darkGreen/70">{event.type}</p>
          </div>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${getSeverityClass(
            event.severity
          )}`}
        >
          {event.severity.charAt(0).toUpperCase() + event.severity.slice(1)}
        </span>
      </div>

      <p className="text-sm text-resqlink-darkGreen/80 mb-4">
        {event.description}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm">
          <MapPin className="h-4 w-4 mr-2 text-resqlink-darkGreen/70" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-resqlink-darkGreen/70" />
          <span>{event.date}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 mt-2 border-t border-resqlink-darkGreen/10">
        <div className="flex items-center text-xs text-resqlink-darkGreen/60">
          <AlertCircle className="h-3 w-3 mr-1" />
          <span>Source: {event.source}</span>
        </div>
        {event.detailsUrl && (
          <a
            href={event.detailsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-resqlink-green hover:text-resqlink-darkGreen text-sm font-medium inline-flex items-center"
          >
            View Details
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        )}
      </div>
    </div>
  );
};

const DisasterList = () => {
  const [disasters, setDisasters] = useState<DisasterEvent[]>([]);
  const [filteredDisasters, setFilteredDisasters] = useState<DisasterEvent[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [timeFilter, setTimeFilter] = useState<
    "1day" | "1week" | "1month" | "1year"
  >("1month");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const getSeverityFromAlert = (alertlevel: string) => {
    switch (alertlevel.toLowerCase()) {
      case "green":
        return "low";
      case "orange":
        return "medium";
      case "red":
        return "high";
      default:
        return "critical";
    }
  };

  const fetchDisasterData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH"
      );
      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

      const data = await response.json();

      // Use object to ensure uniqueness by eventid
      const uniqueDisasters: Record<number, DisasterEvent> = {};

      data.features.forEach((feature: any) => {
        const eventId = feature.properties.eventid;
        if (!uniqueDisasters[eventId]) {
          const eventDate = new Date(feature.properties.fromdate);
          uniqueDisasters[eventId] = {
            id: eventId,
            type:
              feature.properties.eventtype === "EQ"
                ? "Earthquake"
                : feature.properties.eventtype === "TC"
                ? "Cyclone"
                : feature.properties.eventtype === "FL"
                ? "Flood"
                : feature.properties.eventtype === "DR"
                ? "Drought"
                : feature.properties.eventtype === "VO"
                ? "Volcano"
                : "Disaster",
            title: feature.properties.name || feature.properties.description,
            location: feature.properties.country || "Unknown",
            date: eventDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            description: feature.properties.htmldescription.replace(
              /<[^>]+>/g,
              ""
            ),
            severity: getSeverityFromAlert(feature.properties.alertlevel),
            source: feature.properties.source || "GDACS",
            coordinates: feature.geometry?.coordinates,
            detailsUrl: feature.properties.url?.report,
            rawDate: eventDate,
          };
        }
      });

      setDisasters(Object.values(uniqueDisasters));
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisasterData();
  }, []);

  useEffect(() => {
    const now = new Date();
    let cutoffDate = new Date();

    switch (timeFilter) {
      case "1day":
        cutoffDate.setDate(now.getDate() - 1);
        break;
      case "1week":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "1month":
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case "1year":
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const filtered = disasters.filter((disaster) => {
      const typeMatch =
        typeFilter === "all" ||
        disaster.type.toLowerCase() === typeFilter.toLowerCase();
      const dateMatch = disaster.rawDate >= cutoffDate;
      return typeMatch && dateMatch;
    });

    setFilteredDisasters(filtered);
  }, [disasters, timeFilter, typeFilter]);

  if (loading && disasters.length === 0) {
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
          onClick={fetchDisasterData}
          className="mt-2 px-3 py-1 text-sm bg-resqlink-darkGreen text-white rounded hover:bg-resqlink-darkGreen/80 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const disasterTypes = [...new Set(disasters.map((d) => d.type))];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold text-resqlink-darkGreen">
          Recent Disasters
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as any)}
            className="px-3 py-1 border border-resqlink-darkGreen/20 rounded text-sm"
          >
            <option value="1day">Last 24 Hours</option>
            <option value="1week">Last 7 Days</option>
            <option value="1month">Last 30 Days</option>
            <option value="1year">Last Year</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1 border border-resqlink-darkGreen/20 rounded text-sm"
          >
            <option value="all">All Types</option>
            {disasterTypes.map((type) => (
              <option key={type} value={type.toLowerCase()}>
                {type}
              </option>
            ))}
          </select>

          <button
            onClick={fetchDisasterData}
            className="flex items-center text-resqlink-green hover:text-resqlink-darkGreen text-sm font-medium"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </button>
        </div>
      </div>

      <div className="text-xs text-resqlink-darkGreen/50 mb-2">
        Showing {filteredDisasters.length} disasters • Last updated:{" "}
        {lastUpdated.toLocaleTimeString()}
      </div>

      {filteredDisasters.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="h-8 w-8 mx-auto text-resqlink-darkGreen/50" />
          <p className="mt-2 text-resqlink-darkGreen/70">
            No disasters match your filters
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDisasters.map((disaster, index) => (
            <DisasterCard
              key={disaster.id}
              event={disaster}
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DisasterList;
