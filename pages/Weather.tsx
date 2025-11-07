import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Eye, Gauge, MapPin, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { weatherService, WeatherData, ForecastDay } from '../services/api';

const Weather: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cities = [
    'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
    'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Bhopal'
  ];

  useEffect(() => {
    fetchWeatherData();
  }, [selectedCity]);

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [currentWeather, forecast] = await Promise.all([
        weatherService.getCurrentWeather(selectedCity),
        weatherService.getForecast(selectedCity)
      ]);
      
      setWeatherData({
        ...currentWeather,
        forecast
      });
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
      case 'sunny': 
        return <Sun className="h-16 w-16 text-yellow-500 drop-shadow-lg" />;
      case 'clouds':
      case 'cloudy': 
        return <Cloud className="h-16 w-16 text-gray-500 drop-shadow-lg" />;
      case 'rain':
      case 'drizzle':
      case 'thunderstorm': 
        return <CloudRain className="h-16 w-16 text-blue-500 drop-shadow-lg" />;
      default: 
        return <Cloud className="h-16 w-16 text-gray-500 drop-shadow-lg" />;
    }
  };

  const getSmallWeatherIcon = (iconType: string) => {
    switch (iconType) {
      case 'sun': return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'cloud': return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'rain': return <CloudRain className="h-8 w-8 text-blue-500" />;
      default: return <Cloud className="h-8 w-8 text-gray-500" />;
    }
  };

  const getWeatherRecommendations = (weather: WeatherData) => {
    const recommendations = [];
    const alerts = [];

    // Generate recommendations based on weather conditions
    if (weather.temperature > 25 && weather.temperature < 35) {
      recommendations.push('Perfect weather for field preparation');
      recommendations.push('Good conditions for planting summer crops');
    }

    if (weather.humidity > 60) {
      alerts.push('High humidity may increase disease risk');
      alerts.push('Monitor crops for fungal infections');
    }

    if (weather.windSpeed > 15) {
      alerts.push('Avoid spraying during windy conditions');
    }

    // Check forecast for rain
    const rainInForecast = weather.forecast.some(day => day.precipitation > 50);
    if (rainInForecast) {
      alerts.push('Rain expected in coming days - plan accordingly');
    }

    recommendations.push('Ideal time for irrigation scheduling');
    recommendations.push('Favorable for pesticide application');

    return { recommendations, alerts };
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 dark:from-blue-700 dark:via-blue-600 dark:to-cyan-700 rounded-3xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-3">Weather Forecast ⛅</h1>
              <p className="text-blue-100 text-lg max-w-3xl">
                Get accurate weather information to plan your farming activities effectively with real-time updates from OpenWeatherMap.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Cloud className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* City Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Select Location</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative group max-w-md">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
            >
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={fetchWeatherData}
            disabled={loading}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-xl font-medium transition-colors duration-200"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">Loading weather data...</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Fetching latest information for {selectedCity}</p>
        </div>
      ) : weatherData ? (
        <>
          {/* Current Weather */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 dark:from-blue-600 dark:via-blue-700 dark:to-indigo-700 rounded-3xl p-8 text-white shadow-2xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
            
            <div className="relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <MapPin className="h-6 w-6 text-blue-200" />
                    <h2 className="text-3xl font-bold">{weatherData.city}</h2>
                  </div>
                  
                  <div className="flex items-center space-x-6 mb-4">
                    <span className="text-6xl font-bold">{weatherData.temperature}°C</span>
                    {getWeatherIcon(weatherData.condition)}
                  </div>
                  
                  <p className="text-blue-100 text-xl mb-2">{weatherData.condition}</p>
                  <div className="flex items-center space-x-2 text-blue-200">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
                
                <div className="hidden lg:block">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Today's Highlights</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-200">Feels like</span>
                        <span className="font-semibold">{weatherData.temperature + 2}°C</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-200">UV Index</span>
                        <span className="font-semibold">Moderate</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-200">Air Quality</span>
                        <span className="font-semibold">Good</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Droplets, label: 'Humidity', value: `${weatherData.humidity}%`, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' },
              { icon: Wind, label: 'Wind Speed', value: `${weatherData.windSpeed} km/h`, color: 'text-gray-500 bg-gray-100 dark:bg-gray-900/30' },
              { icon: Gauge, label: 'Pressure', value: `${weatherData.pressure} hPa`, color: 'text-green-500 bg-green-100 dark:bg-green-900/30' },
              { icon: Eye, label: 'Visibility', value: `${weatherData.visibility} km`, color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30' }
            ].map((item, index) => (
              <div key={index} className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{item.label}</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{item.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 5-Day Forecast */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">5-Day Forecast</h3>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Updated every hour</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {weatherData.forecast.map((day, index) => (
                <div key={index} className="group text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                  <p className="font-bold text-gray-800 dark:text-white mb-3 text-lg">{day.date}</p>
                  <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    {getSmallWeatherIcon(day.icon)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">{day.condition}</p>
                  <div className="flex justify-center space-x-3 mb-3">
                    <span className="font-bold text-gray-800 dark:text-white text-lg">{day.high}°</span>
                    <span className="text-gray-500 dark:text-gray-400 text-lg">{day.low}°</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1 text-xs text-blue-600 dark:text-blue-400">
                    <Droplets className="h-3 w-3" />
                    <span>{day.precipitation}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Farming Recommendations */}
          {(() => {
            const { recommendations, alerts } = getWeatherRecommendations(weatherData);
            return (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl p-8 shadow-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-green-500 rounded-xl">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Recommended Activities</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {recommendations.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">{activity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-3xl p-8 shadow-xl border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-yellow-500 rounded-xl">
                      <AlertCircle className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Weather Alerts</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {alerts.map((alert, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">{alert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </>
      ) : null}
    </div>
  );
};

export default Weather;