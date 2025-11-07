import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleMap, MarkerF, useLoadScript, InfoWindowF, StreetViewPanorama } from '@react-google-maps/api';
import { 
  MapPin, 
  Navigation, 
  Filter, 
  Search, 
  Phone, 
  Clock, 
  Star, 
  Locate, 
  RefreshCw,
  Eye,
  AlertTriangle,
  Thermometer,
  CloudRain,
  Wind,
  Bell,
  Plus,
  Trash2,
  Target,
  Satellite,
  Camera,
  Monitor,
  Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { farmService, mapsService } from '../services/api';
import { weatherService, alertService } from '../services/api';

const libraries: (
  | "drawing"
  | "geometry"
  | "places"
  | "visualization"
)[] = ['places'];

interface AgriLocation {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type: 'mandis' | 'warehouse' | 'extension' | 'research';
  details: string;
  contact?: string;
  hours?: string;
  rating?: number;
  services?: string[];
}

interface FarmLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  cropType: string;
  area: number;
  soilType: string;
  alertsEnabled: boolean;
  lastWeatherCheck?: Date;
  currentWeather?: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    condition: string;
  };
}

interface WeatherAlert {
  id: string;
  farmId: string;
  type: 'extreme_heat' | 'heavy_rain' | 'strong_wind' | 'frost' | 'drought';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

const Maps: React.FC = () => {
  const { user } = useAuth();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDj7P_Q53q82AXt77oZsItKfZGEvT2dPck", // Your API key
    libraries,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [selectedType, setSelectedType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({ lat: 28.6139, lng: 77.2090 }); // Delhi
  const [mapZoom, setMapZoom] = useState(10);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [showStreetView, setShowStreetView] = useState(false);
  const [streetViewLocation, setStreetViewLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [isStreetViewAvailable, setIsStreetViewAvailable] = useState(false);
  const [farmLocations, setFarmLocations] = useState<FarmLocation[]>([]);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [showAddFarm, setShowAddFarm] = useState(false);
  const [newFarm, setNewFarm] = useState({
    name: '',
    cropType: '',
    area: '',
    soilType: '',
    address: '',
    lat: 0,
    lng: 0
  });
  const [geocodingStatus, setGeocodingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  const [loadingFarms, setLoadingFarms] = useState(true);
  const [errorFarms, setErrorFarms] = useState<string | null>(null);
  const [selectedFarm, setSelectedFarm] = useState<string | null>(null);
  const [selectedAgriLocation, setSelectedAgriLocation] = useState<AgriLocation | null>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(function callback() {
    mapRef.current = null;
  }, []);

  const agriLocations: AgriLocation[] = [
    { id: 1, name: 'Delhi Agricultural Marketing Board', lat: 28.6139, lng: 77.2090, type: 'mandis', details: 'Major wholesale market for agricultural produce', contact: '+91-11-2345-6789', hours: '6:00 AM - 6:00 PM', rating: 4.2, services: ['Wholesale Trading', 'Price Discovery', 'Storage'] },
    { id: 2, name: 'Punjab Agricultural University', lat: 30.9010, lng: 75.8573, type: 'research', details: 'Leading agricultural research institute', contact: '+91-161-2345-678', hours: '9:00 AM - 5:00 PM', rating: 4.8, services: ['Research', 'Training', 'Consultancy'] },
    { id: 3, name: 'Central Warehouse Corporation', lat: 28.5355, lng: 77.3910, type: 'warehouse', details: 'Government storage facility for food grains', contact: '+91-11-2876-5432', hours: '8:00 AM - 6:00 PM', rating: 4.0, services: ['Storage', 'Handling', 'Quality Testing'] },
    { id: 4, name: 'Krishi Vigyan Kendra', lat: 28.4595, lng: 77.0266, type: 'extension', details: 'Agricultural extension and training center', contact: '+91-11-2654-3210', hours: '9:00 AM - 5:00 PM', rating: 4.5, services: ['Training', 'Demonstrations', 'Advisory'] },
    { id: 5, name: 'IARI Regional Station', lat: 28.6358, lng: 77.1683, type: 'research', details: 'Indian Agricultural Research Institute branch', contact: '+91-11-2584-1234', hours: '9:00 AM - 5:00 PM', rating: 4.7, services: ['Research', 'Seed Production', 'Technology Transfer'] },
    { id: 6, name: 'Azadpur Mandi', lat: 28.7041, lng: 77.1025, type: 'mandis', details: 'Asia\'s largest wholesale fruit and vegetable market', contact: '+91-11-2765-4321', hours: '4:00 AM - 10:00 AM', rating: 4.3, services: ['Wholesale Trading', 'Auction', 'Cold Storage'] },
    { id: 7, name: 'Maharashtra Agri Extension Center', lat: 19.0760, lng: 72.8777, type: 'extension', details: 'State agricultural extension office', contact: '+91-22-2345-6789', hours: '9:00 AM - 5:00 PM', rating: 4.1, services: ['Extension Services', 'Farmer Training', 'Soil Testing'] },
    { id: 8, name: 'Karnataka Research Institute', lat: 12.9716, lng: 77.5946, type: 'research', details: 'Agricultural research and development center', contact: '+91-80-2345-6789', hours: '9:00 AM - 5:00 PM', rating: 4.6, services: ['Research', 'Variety Development', 'Training'] }
  ];

  const cropTypes = ['Rice', 'Wheat', 'Cotton', 'Maize', 'Sugarcane', 'Tomato', 'Potato', 'Onion', 'Soybean', 'Pulses'];
  const soilTypes = ['Clay', 'Loamy', 'Sandy', 'Sandy Loam', 'Black Cotton', 'Red'];

  useEffect(() => {
    const fetchFarmsAndWeather = async () => {
      if (user) {
        try {
          setLoadingFarms(true);
          const fetchedFarms = await farmService.getFarms();
          
          const farmsWithWeather = await Promise.all(fetchedFarms.map(async (farm: any) => {
            try {
              const weatherData = await weatherService.getCurrentWeatherByCoords(farm.lat, farm.lng);
              return {
                id: farm._id,
                name: farm.name,
                lat: farm.lat,
                lng: farm.lng,
                cropType: farm.cropType,
                area: farm.area,
                soilType: farm.soilType,
                alertsEnabled: farm.alertsEnabled,
                lastWeatherCheck: new Date(),
                currentWeather: {
                  temperature: weatherData.temperature,
                  humidity: weatherData.humidity,
                  windSpeed: weatherData.windSpeed * 3.6, // Convert m/s to km/h
                  condition: weatherData.condition,
                }
              };
            } catch (weatherErr) {
              console.warn(`Could not fetch weather for farm ${farm.name}:`, weatherErr);
              return {
                id: farm._id,
                name: farm.name,
                lat: farm.lat,
                lng: farm.lng,
                cropType: farm.cropType,
                area: farm.area,
                soilType: farm.soilType,
                alertsEnabled: farm.alertsEnabled,
                lastWeatherCheck: undefined,
                currentWeather: undefined
              };
            }
          }));
          setFarmLocations(farmsWithWeather);
          setErrorFarms(null);
        } catch (err: any) {
          console.error('Failed to fetch farms:', err);
          setErrorFarms(err.message || 'Failed to load farms.');
        } finally {
          setLoadingFarms(false);
        }
      }
    };
    fetchFarmsAndWeather();
  }, [user]);

  useEffect(() => {
    const fetchAlerts = async () => {
      if (user) {
        try {
          const fetchedAlerts = await alertService.getAlerts(false);
          setWeatherAlerts(fetchedAlerts.map((alert: any) => ({
            id: alert._id,
            farmId: alert.farmId,
            type: alert.type,
            severity: alert.severity,
            message: alert.message,
            timestamp: new Date(alert.timestamp),
            acknowledged: alert.acknowledged,
          })));
        } catch (err) {
          console.error('Failed to fetch alerts:', err);
        }
      }
    };

    fetchAlerts();
    const alertInterval = setInterval(fetchAlerts, 5 * 60 * 1000);

    return () => clearInterval(alertInterval);
  }, [user]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const getMarkerIcon = (type: string) => {
    const iconColors = {
      mandis: '22c55e',     // Green
      warehouse: '3b82f6',  // Blue
      extension: 'f59e0b',  // Orange
      research: '8b5cf6'    // Purple
    };
    const color = iconColors[type as keyof typeof iconColors] || 'gray';
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: `#${color}`,
      fillOpacity: 1,
      strokeWeight: 0,
      scale: 10,
    };
  };

  const getFarmMarkerIcon = (farm: FarmLocation) => {
    const hasAlerts = weatherAlerts.some(alert => alert.farmId === farm.id && !alert.acknowledged);
    const color = hasAlerts ? 'ef4444' : '10b981'; // Red if alerts, green if normal
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: `#${color}`,
      fillOpacity: 1,
      strokeWeight: 0,
      scale: 12,
    };
  };

  const getUserLocationIcon = () => {
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: '#ef4444',
      fillOpacity: 1,
      strokeWeight: 0,
      scale: 8,
    };
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      mandis: 'Mandis & Markets',
      warehouse: 'Storage Facilities',
      extension: 'Extension Centers',
      research: 'Research Institutes'
    };
    return labels[type as keyof typeof labels];
  };

  const getTypeColor = (type: string) => {
    const colors = {
      mandis: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      warehouse: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      extension: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      research: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
    };
    return colors[type as keyof typeof colors];
  };

  const getAlertSeverityColor = (severity: string) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };
    return colors[severity as keyof typeof colors];
  };

  const filteredLocations = agriLocations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || location.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation: google.maps.LatLngLiteral = { lat: latitude, lng: longitude };
          setUserLocation(newLocation);
          setMapCenter(newLocation);
          setMapZoom(12);
          setIsLocating(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please check your browser settings.');
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      setIsLocating(false);
    }
  };

  const openStreetView = (lat: number, lng: number) => {
    if (!isLoaded) {
      alert('Google Maps API is not fully loaded yet. Please try again in a moment.');
      return;
    }

    const service = new google.maps.StreetViewService();
    const panoramaOptions = {
      location: new google.maps.LatLng(lat, lng),
      radius: 50, // Search radius in meters
    };

    service.getPanorama(panoramaOptions, (data, status) => {
      if (status === google.maps.StreetViewStatus.OK && data && data.location && data.location.latLng) {
        setStreetViewLocation(data.location.latLng.toJSON());
        setIsStreetViewAvailable(true);
        setShowStreetView(true);
      } else {
        alert('Street View is not available for this location.');
        setShowStreetView(false);
        setIsStreetViewAvailable(false);
        setStreetViewLocation(null);
      }
    });
  };

  const handleGeocode = async () => {
    if (!newFarm.address) {
      setGeocodingError('Please enter an address.');
      return;
    }
    setGeocodingStatus('loading');
    setGeocodingError(null);
    try {
      const { lat, lng, formattedAddress } = await mapsService.geocodeAddress(newFarm.address);
      setNewFarm(prev => ({ ...prev, lat, lng, address: formattedAddress }));
      setGeocodingStatus('success');
      setMapCenter({ lat, lng });
      setMapZoom(15);
    } catch (error: any) {
      console.error('Geocoding error:', error);
      setGeocodingError(error.message || 'Failed to find location. Please try a more specific address.');
      setGeocodingStatus('error');
    }
  };

  const addFarmLocation = async () => {
    if (!newFarm.name || !newFarm.cropType || !newFarm.area || !newFarm.soilType || newFarm.lat === 0 || newFarm.lng === 0) {
      alert('Please fill all farm details and ensure a location is set (use "Find Location" or pan the map).');
      return;
    }

    try {
      const farmDataToSend = {
        name: newFarm.name,
        lat: newFarm.lat,
        lng: newFarm.lng,
        cropType: newFarm.cropType,
        area: parseFloat(newFarm.area),
        soilType: newFarm.soilType,
      };
      const addedFarm = await farmService.addFarm(farmDataToSend);
      
      const fetchUpdatedFarms = async () => {
        if (user) {
          try {
            setLoadingFarms(true);
            const fetchedFarms = await farmService.getFarms();
            const farmsWithWeather = await Promise.all(fetchedFarms.map(async (farm: any) => {
              try {
                const weatherData = await weatherService.getCurrentWeatherByCoords(farm.lat, farm.lng);
                return {
                  id: farm._id,
                  name: farm.name,
                  lat: farm.lat,
                  lng: farm.lng,
                  cropType: farm.cropType,
                  area: farm.area,
                  soilType: farm.soilType,
                  alertsEnabled: farm.alertsEnabled,
                  lastWeatherCheck: new Date(),
                  currentWeather: {
                    temperature: weatherData.temperature,
                    humidity: weatherData.humidity,
                    windSpeed: weatherData.windSpeed * 3.6, // Convert m/s to km/h
                    condition: weatherData.condition,
                  }
                };
              } catch (weatherErr) {
                console.warn(`Could not fetch weather for farm ${farm.name}:`, weatherErr);
                return {
                  id: farm._id,
                  name: farm.name,
                  lat: farm.lat,
                  lng: farm.lng,
                  cropType: farm.cropType,
                  area: farm.area,
                  soilType: farm.soilType,
                  alertsEnabled: farm.alertsEnabled,
                  lastWeatherCheck: undefined,
                  currentWeather: undefined
                };
              }
            }));
            setFarmLocations(farmsWithWeather);
          } catch (err) {
            console.error('Failed to re-fetch farms after add:', err);
          } finally {
            setLoadingFarms(false);
          }
        }
      };
      fetchUpdatedFarms();
      setShowAddFarm(false);
      setNewFarm({ name: '', cropType: '', area: '', soilType: '', address: '', lat: 0, lng: 0 });
      setGeocodingStatus('idle');
      setGeocodingError(null);
      alert('Farm added successfully!');
    } catch (error: any) {
      console.error('Error adding farm:', error);
      alert(`Failed to add farm: ${error.message}`);
    }
  };

  const deleteFarmLocation = (farmId: string) => {
    setFarmLocations(prev => prev.filter(farm => farm.id !== farmId));
    setWeatherAlerts(prev => prev.filter(alert => alert.farmId !== farmId));
  };

  const toggleFarmAlerts = async (farmId: string) => {
    const farmToUpdate = farmLocations.find(farm => farm.id === farmId);
    if (!farmToUpdate) return;

    const newAlertsEnabledStatus = !farmToUpdate.alertsEnabled;

    try {
      // Optimistically update UI
      setFarmLocations(prev => prev.map(farm =>
        farm.id === farmId ? { ...farm, alertsEnabled: newAlertsEnabledStatus } : farm
      ));

      // Call backend to persist the change
      await farmService.updateFarm(farmId, { alertsEnabled: newAlertsEnabledStatus });
      console.log(`Farm ${farmToUpdate.name} alerts enabled status updated to ${newAlertsEnabledStatus}`);
    } catch (error) {
      console.error(`Failed to update alertsEnabled for farm ${farmToUpdate.name}:`, error);
      // Revert UI if backend update fails
      setFarmLocations(prev => prev.map(farm =>
        farm.id === farmId ? { ...farm, alertsEnabled: !newAlertsEnabledStatus } : farm
      ));
      alert('Failed to update alert settings. Please try again.');
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      await alertService.acknowledgeAlert(alertId);
      setWeatherAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      ));
      console.log(`Alert ${alertId} acknowledged successfully.`);
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
      alert('Failed to acknowledge alert. Please try again.');
    }
  };

  const focusOnLocation = (location: AgriLocation) => {
    setMapCenter({ lat: location.lat, lng: location.lng });
    setMapZoom(15);
  };

  const focusOnFarm = (farm: FarmLocation) => {
    setMapCenter({ lat: farm.lat, lng: farm.lng });
    setMapZoom(16);
    setSelectedFarm(farm.id);
  };

  const resetMapView = () => {
    setMapCenter({ lat: 28.6139, lng: 77.2090 }); // Delhi
    setMapZoom(10);
    setUserLocation(null);
    setSelectedFarm(null);
  };



  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 dark:from-teal-700 dark:via-cyan-700 dark:to-blue-700 rounded-3xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-3">Smart Agricultural Maps 🗺️</h1>
              <p className="text-teal-100 text-lg max-w-3xl">
                Advanced mapping with street view, farm monitoring, climate alerts, and real-time weather tracking for precision agriculture.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Satellite className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Alerts Panel */}
      {weatherAlerts.filter(alert => !alert.acknowledged).length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-2 border-red-200 dark:border-red-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-500 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-red-800 dark:text-red-400">Active Weather Alerts</h3>
            </div>
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-red-500 animate-pulse" />
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                {weatherAlerts.filter(alert => !alert.acknowledged).length} unread
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
            {weatherAlerts.filter(alert => !alert.acknowledged).slice(0, 4).map(alert => {
              const farm = farmLocations.find(f => f.id === alert.farmId);
              return (
                <div key={alert.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-red-200 dark:border-red-800">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getAlertSeverityColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white mb-1">
                    {farm?.name || 'Unknown Farm'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{alert.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {alert.timestamp.toLocaleTimeString()}
                    </span>
                    {farm && (
                      <button
                        onClick={() => focusOnFarm(farm)}
                        className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                      >
                        View Farm
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Farm Management Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Monitor className="h-6 w-6 text-green-600 dark:text-green-400" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Farm Climate Monitoring</h2>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddFarm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
              <span>Add Farm</span>
            </button>

          </div>
        </div>

        {/* Farm Locations Grid */}
        {loadingFarms ? (
          <div className="text-center py-8">
            <RefreshCw className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">Loading your farm locations...</p>
          </div>
        ) : errorFarms ? (
          <div className="text-center py-8 text-red-500">
            <AlertTriangle className="h-16 w-16 mx-auto mb-4" />
            <p className="text-lg">Error loading farms: {errorFarms}</p>
            <p className="text-sm">Please try refreshing the page.</p>
          </div>
        ) : farmLocations.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">No farm locations added yet</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm">Add your farm locations to start monitoring weather conditions</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {farmLocations.map(farm => {
              const farmAlerts = weatherAlerts.filter(alert => alert.farmId === farm.id && !alert.acknowledged);
              return (
                <div key={farm.id} className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                  selectedFarm === farm.id 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : farmAlerts.length > 0
                    ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800 dark:text-white text-lg">{farm.name}</h3>
                    <div className="flex items-center space-x-2">
                      {farmAlerts.length > 0 && (
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      )}
                      <button
                        onClick={() => deleteFarmLocation(farm.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Crop:</span>
                      <span className="font-medium text-gray-800 dark:text-white">{farm.cropType}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Area:</span>
                      <span className="font-medium text-gray-800 dark:text-white">{farm.area} hectares</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Soil:</span>
                      <span className="font-medium text-gray-800 dark:text-white">{farm.soilType}</span>
                    </div>
                  </div>

                  {farm.currentWeather && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2 text-sm">Current Weather</h4>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <Thermometer className="h-4 w-4 mx-auto text-red-500 mb-1" />
                          <div className="font-medium">{farm.currentWeather.temperature}°C</div>
                        </div>
                        <div className="text-center">
                          <CloudRain className="h-4 w-4 mx-auto text-blue-500 mb-1" />
                          <div className="font-medium">{farm.currentWeather.humidity}%</div>
                        </div>
                        <div className="text-center">
                          <Wind className="h-4 w-4 mx-auto text-gray-500 mb-1" />
                          <div className="font-medium">{farm.currentWeather.windSpeed} km/h</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={farm.alertsEnabled}
                        onChange={() => toggleFarmAlerts(farm.id)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Alerts</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => focusOnFarm(farm)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openStreetView(farm.lat, farm.lng)}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Street View
                      </button>
                    </div>
                  </div>

                  {farmAlerts.length > 0 && (
                    <div className="mt-3 text-xs text-red-600 dark:text-red-400 font-medium">
                      {farmAlerts.length} active alert{farmAlerts.length > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Filter className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Search & Filter Locations</h2>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={getCurrentLocation}
              disabled={isLocating}
              className="flex items-center space-x-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white rounded-lg font-medium transition-colors duration-200"
            >
              {isLocating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Locate className="h-4 w-4" />
              )}
              <span>{isLocating ? 'Locating...' : 'My Location'}</span>
            </button>
            
            <button
              onClick={resetMapView}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reset View</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="relative group">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none transition-all duration-200"
            >
              <option value="">All Facility Types</option>
              <option value="mandis">Mandis & Markets</option>
              <option value="warehouse">Storage Facilities</option>
              <option value="extension">Extension Centers</option>
              <option value="research">Research Institutes</option>
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries({
            mandis: { label: 'Mandis & Markets', color: '#22c55e' },
            warehouse: { label: 'Storage Facilities', color: '#3b82f6' },
            extension: { label: 'Extension Centers', color: '#f59e0b' },
            research: { label: 'Research Institutes', color: '#8b5cf6' }
          }).map(([type, info]) => (
            <div key={type} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div 
                className="w-5 h-5 rounded-full border-2 border-white shadow-md"
                style={{ backgroundColor: info.color }}
              ></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{info.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
            <span className="text-sm font-medium text-green-700 dark:text-green-400">Your Farm Locations</span>
          </div>
          
          {userLocation && (
            <div className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-red-700 dark:text-red-400">Your current location</span>
            </div>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Navigation className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Interactive Map with Street View</h3>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`}>
              <div className={`w-2 h-2 rounded-full bg-green-500 animate-pulse`}></div>
              <span className="text-sm font-medium">Monitoring Active (Backend)</span>
            </div>
          </div>
        </div>
        
        <div className="h-96 rounded-2xl overflow-hidden shadow-lg">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={mapCenter}
              zoom={mapZoom}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={{
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: false,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: false,
              }}
            >
              {userLocation && (
                <MarkerF
                  position={userLocation}
                  icon={getUserLocationIcon()}
                  onClick={() => openStreetView(userLocation.lat, userLocation.lng)}
                >
                  <InfoWindowF position={userLocation}>
                    <div className="p-2">
                      <h3 className="font-bold text-red-600">Your Location</h3>
                      <p className="text-sm text-gray-600">Current position</p>
                      <button 
                        onClick={() => openStreetView(userLocation.lat, userLocation.lng)}
                        className="mt-2 bg-purple-500 hover:bg-purple-600 text-white py-1 px-2 rounded text-xs"
                      >
                        Street View
                      </button>
                    </div>
                  </InfoWindowF>
                </MarkerF>
              )}
              
              {farmLocations.map((farm) => (
                <MarkerF
                  key={farm.id}
                  position={{ lat: farm.lat, lng: farm.lng }}
                  icon={getFarmMarkerIcon(farm)}
                  onClick={() => setSelectedFarm(farm.id)}
                >
                  {selectedFarm === farm.id && (
                    <InfoWindowF
                      position={{ lat: farm.lat, lng: farm.lng }}
                      onCloseClick={() => setSelectedFarm(null)}
                    >
                      <div className="p-4 min-w-[280px]">
                        <h3 className="font-bold text-gray-800 mb-2 text-lg">{farm.name}</h3>
                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Crop:</span>
                            <span className="text-sm font-medium">{farm.cropType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Area:</span>
                            <span className="text-sm font-medium">{farm.area} hectares</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Soil:</span>
                            <span className="text-sm font-medium">{farm.soilType}</span>
                          </div>
                        </div>
                        
                        {farm.currentWeather && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <h4 className="font-semibold text-gray-800 mb-2 text-sm">Current Weather</h4>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="text-center">
                                <Thermometer className="h-4 w-4 mx-auto text-red-500 mb-1" />
                                <div>{farm.currentWeather.temperature}°C</div>
                              </div>
                              <div className="text-center">
                                <CloudRain className="h-4 w-4 mx-auto text-blue-500 mb-1" />
                                <div>{farm.currentWeather.humidity}%</div>
                              </div>
                              <div className="text-center">
                                <Wind className="h-4 w-4 mx-auto text-gray-500 mb-1" />
                                <div>{farm.currentWeather.windSpeed} km/h</div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => openStreetView(farm.lat, farm.lng)}
                            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 px-3 rounded text-sm font-medium"
                          >
                            <Eye className="h-4 w-4 inline mr-1" />
                            Street View
                          </button>
                          <button 
                            onClick={() => {
                              const url = `https://www.google.com/maps/dir/?api=1&destination=${farm.lat},${farm.lng}`;
                              window.open(url, '_blank');
                            }}
                            className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-2 px-3 rounded text-sm font-medium"
                          >
                            Directions
                          </button>
                        </div>
                      </div>
                    </InfoWindowF>
                  )}
                </MarkerF>
              ))}
              
              {filteredLocations.map((location) => (
                <MarkerF
                  key={location.id}
                  position={{ lat: location.lat, lng: location.lng }}
                  icon={getMarkerIcon(location.type)}
                  onClick={() => setSelectedAgriLocation(location)}
                >
                  {selectedAgriLocation?.id === location.id && (
                    <InfoWindowF
                      position={{ lat: location.lat, lng: location.lng }}
                      onCloseClick={() => setSelectedAgriLocation(null)}
                    >
                      <div className="p-4 min-w-[250px]">
                        <h3 className="font-bold text-gray-800 mb-2 text-lg">{location.name}</h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${getTypeColor(location.type)}`}>
                          {getTypeLabel(location.type)}
                        </span>
                        
                        {location.rating && (
                          <div className="flex items-center space-x-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${i < Math.floor(location.rating!) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-1">({location.rating})</span>
                          </div>
                        )}
                        
                        <p className="text-sm text-gray-600 mb-3">{location.details}</p>
                        
                        {location.contact && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                            <Phone className="h-3 w-3" />
                            <span>{location.contact}</span>
                          </div>
                        )}
                        
                        {location.hours && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                            <Clock className="h-3 w-3" />
                            <span>{location.hours}</span>
                          </div>
                        )}
                        
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => openStreetView(location.lat, location.lng)}
                            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 px-3 rounded text-sm font-medium"
                          >
                            <Eye className="h-4 w-4 inline mr-1" />
                            Street View
                          </button>
                          <button 
                            onClick={() => {
                              const url = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
                              window.open(url, '_blank');
                            }}
                            className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-2 px-3 rounded text-sm font-medium"
                          >
                            Directions
                          </button>
                        </div>
                      </div>
                    </InfoWindowF>
                  )}
                </MarkerF>
              ))}
            </GoogleMap>
          ) : (
            <div>Loading Map...</div>
          )}
        </div>
      </div>

      {/* Street View Modal */}
      {showStreetView && streetViewLocation && isStreetViewAvailable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Camera className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Street View</h3>
              </div>
              <button
                onClick={() => setShowStreetView(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="h-96 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={streetViewLocation}
                zoom={15} // A default zoom level for the Street View map context
                options={{
                  streetViewControl: false, // We are explicitly controlling Street View
                  mapTypeControl: false,
                  fullscreenControl: false,
                  zoomControl: false, // Zoom control for the map, not the panorama
                  panControl: false,
                }}
              >
                <StreetViewPanorama
                  visible={true}
                  onLoad={(panorama) => console.log('StreetViewPanorama loaded:', panorama)}
                  options={{
                    addressControl: false,
                    zoomControl: true, // Keep zoom control for the panorama itself
                    panControl: true,
                    enableCloseButton: false,
                  }}
                />
              </GoogleMap>
            </div>
            
            <div className="mt-4 flex justify-center items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Street View for: {streetViewLocation.lat.toFixed(6)}, {streetViewLocation.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Farm Modal */}
      {showAddFarm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Add Farm Location</h3>
              <button
                onClick={() => setShowAddFarm(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Farm Name</label>
                <input
                  type="text"
                  value={newFarm.name}
                  onChange={(e) => setNewFarm({ ...newFarm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Main Rice Field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Crop Type</label>
                <select
                  value={newFarm.cropType}
                  onChange={(e) => setNewFarm({ ...newFarm, cropType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select crop type</option>
                  {cropTypes.map(crop => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Area (hectares)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newFarm.area}
                  onChange={(e) => setNewFarm({ ...newFarm, area: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., 2.5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Soil Type</label>
                <select
                  value={newFarm.soilType}
                  onChange={(e) => setNewFarm({ ...newFarm, soilType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select soil type</option>
                  {soilTypes.map(soil => (
                    <option key={soil} value={soil}>{soil}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Farm Address</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newFarm.address}
                    onChange={(e) => setNewFarm({ ...newFarm, address: e.target.value })}
                    className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 123 Farm Road, Village, State"
                  />
                  <button
                    onClick={handleGeocode}
                    disabled={geocodingStatus === 'loading'}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium disabled:bg-blue-300"
                  >
                    {geocodingStatus === 'loading' ? 'Finding...' : 'Find Location'}
                  </button>
                </div>
                {geocodingError && (
                  <p className="text-red-500 text-xs mt-1">{geocodingError}</p>
                )}
                {geocodingStatus === 'success' && newFarm.lat !== 0 && newFarm.lng !== 0 && (
                  <p className="text-green-600 text-xs mt-1">Location found: {newFarm.lat.toFixed(4)}, {newFarm.lng.toFixed(4)}</p>
                )}
                {newFarm.lat === 0 && newFarm.lng === 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Enter an address and click "Find Location" to set the farm's coordinates.
                  </p>
                )}
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>Current coordinates for farm: {newFarm.lat.toFixed(4)}, {newFarm.lng.toFixed(4)}</p>
                <p className="mt-1">These coordinates will be used to place the farm on the map.</p>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddFarm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={addFarmLocation}
                className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
              >
                Add Farm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Location List */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <MapPin className="h-6 w-6 text-teal-600 dark:text-teal-400" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Agricultural Facilities</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLocations.map((location) => (
            <div key={location.id} className="group p-6 border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-gray-50/50 to-teal-50/50 dark:from-gray-800/50 dark:to-teal-900/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 dark:text-white text-lg group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {location.name}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(location.type)}`}>
                  {getTypeLabel(location.type)}
                </span>
              </div>
              
              {location.rating && (
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < Math.floor(location.rating!) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">({location.rating}/5)</span>
                </div>
              )}
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{location.details}</p>
              
              <div className="space-y-2 mb-4">
                {location.contact && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="h-4 w-4 text-teal-500" />
                    <span>{location.contact}</span>
                  </div>
                )}
                {location.hours && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 text-teal-500" />
                    <span>{location.hours}</span>
                  </div>
                )}
              </div>
              
              {location.services && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Services:</p>
                  <div className="flex flex-wrap gap-1">
                    {location.services.map((service, index) => (
                      <span key={index} className="px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-400 text-xs rounded-lg">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </p>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => focusOnLocation(location)}
                    className="bg-teal-500 hover:bg-teal-600 text-white py-1 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    View on Map
                  </button>
                  <button 
                    onClick={() => openStreetView(location.lat, location.lng)}
                    className="bg-purple-500 hover:bg-purple-600 text-white py-1 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    <Eye className="h-3 w-3 inline mr-1" />
                    Street View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredLocations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-12 w-12 text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No locations found matching your criteria.</p>
            <p className="text-gray-500 dark:text-gray-500 mt-2">Try adjusting your search or filter options.</p>
          </div>
        )}
      </div>

      {/* Quick Info */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-700 dark:from-teal-700 dark:to-cyan-800 rounded-3xl p-8 text-white shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-4">Smart Farm Monitoring 🌾</h3>
            <p className="text-teal-100 mb-6 text-lg">
              Add your farm locations to receive real-time weather alerts and climate monitoring. 
              Use street view to virtually inspect your fields and surrounding areas.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <Monitor className="h-5 w-5 text-teal-200" />
                <span><strong>Real-time Monitoring:</strong> Continuous weather tracking</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <Bell className="h-5 w-5 text-teal-200" />
                <span><strong>Instant Alerts:</strong> Extreme weather notifications</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <Camera className="h-5 w-5 text-teal-200" />
                <span><strong>Street View:</strong> Virtual field inspection</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <h4 className="text-xl font-bold mb-4">Alert Thresholds</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Extreme Heat:</span>
                <span className="font-bold">Above 40°C</span>
              </div>
              <div className="flex items-center justify-between">
                <span>High Humidity:</span>
                <span className="font-bold">Above 85%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Strong Wind:</span>
                <span className="font-bold">Above 25 km/h</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Frost Risk:</span>
                <span className="font-bold">Below 2°C</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maps;