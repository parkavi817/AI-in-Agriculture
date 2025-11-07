import React, { useEffect, useRef } from 'react';
import { loadGoogleMapsScript } from '../utils/loadGoogleMapsScript';

interface GoogleStreetViewProps {
  lat: number;
  lng: number;
}

const GoogleStreetView: React.FC<GoogleStreetViewProps> = ({ lat, lng }) => {
  const panoramaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let panorama: google.maps.StreetViewPanorama | undefined;

    const initializeStreetView = async () => {
      try {
        await loadGoogleMapsScript();
        if (panoramaRef.current && window.google && window.google.maps) {
          panorama = new window.google.maps.StreetViewPanorama(
            panoramaRef.current,
            {
              position: { lat, lng },
              pov: { heading: 270, pitch: 0 }, // Default point of view
              zoom: 1,
              addressControl: false, // Hide address control
              fullscreenControl: false, // Hide fullscreen control
              motionTrackingControl: false, // Hide motion tracking control
              panControl: true, // Show pan control
              zoomControl: true, // Show zoom control
              linksControl: true, // Show links to other panoramas
            }
          );

          // Optional: Add a listener to update the map center if the user moves in Street View
          // panorama.addListener('position_changed', () => {
          //   const newPosition = panorama?.getPosition();
          //   if (newPosition) {
          //     console.log('Street View position changed:', newPosition.lat(), newPosition.lng());
          //   }
          // });
        }
      } catch (error) {
        console.error('Error loading Google Maps or initializing Street View:', error);
        // You might want to display an error message to the user
      }
    };

    initializeStreetView();

    // Cleanup function
    return () => {
      // No explicit destroy method for StreetViewPanorama,
      // but unmounting the component will remove the div.
      // If you need to explicitly clear, you might set its div to null or similar.
    };
  }, [lat, lng]); // Re-run effect if lat or lng changes

  return <div ref={panoramaRef} style={{ width: '100%', height: '100%' }} />;
};

export default GoogleStreetView;