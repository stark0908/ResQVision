
import React, { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';

interface MapProps {
  className?: string;
  style?: React.CSSProperties;
}

const Map: React.FC<MapProps> = ({ className = "", style }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This is a placeholder for a real map integration
    // In a real implementation, you would initialize the map here
    console.log("Map would be initialized here with a real map library");
  }, []);

  return (
    <div className={`map-container ${className}`} style={style}>
      <div ref={mapRef} className="relative w-full h-full min-h-[300px] bg-gray-100 overflow-hidden rounded-2xl flex items-center justify-center">
        {/* This is a placeholder for the actual map */}
        <div className="text-center p-6">
          <AlertTriangle className="h-10 w-10 text-resqlink-orange mb-3 mx-auto" />
          <h3 className="text-lg font-medium text-resqlink-darkGreen mb-2">Interactive Map</h3>
          <p className="text-sm text-resqlink-darkGreen/70 max-w-xs mx-auto">
            In a real implementation, this would be an interactive map showing disaster locations with severity indicators.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Map;
