const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;

let scriptPromise: Promise<void> | null = null;

export const loadGoogleMapsScript = (): Promise<void> => {
  if (scriptPromise) {
    return scriptPromise;
  }

  if (!GOOGLE_MAPS_API_KEY) {
    console.error('REACT_APP_GOOGLE_MAPS_API_KEY is not set in environment variables.');
    scriptPromise = Promise.reject(new Error('Google Maps API Key is missing.'));
    return scriptPromise;
  }

  scriptPromise = new Promise((resolve, reject) => {
    if (document.getElementById('google-maps-script')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;

    (window as any).initMap = () => {
      resolve();
    };

    script.onerror = (error) => {
      console.error('Failed to load Google Maps script:', error);
      reject(new Error('Failed to load Google Maps script.'));
    };

    document.head.appendChild(script);
  });

  return scriptPromise;
};