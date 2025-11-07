import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import api, { alertService, cropDataService, governmentSchemesService, userProgressService } from '../services/api';
import {
  Sprout,
  Cloud,
  FileText,
  BookOpen,
  Map,
  MessageCircle,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Users,
  Award,
  Target
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { translate } = useLanguage();

  const [alerts, setAlerts] = useState<any[]>([]);
  const [suitableCrops, setSuitableCrops] = useState<string[]>([]);
  const [eligibleSchemes, setEligibleSchemes] = useState<any[]>([]);
  const [knowledgeProgress, setKnowledgeProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch Alerts
        const alertsResponse = await alertService.getAlerts();
        setAlerts(alertsResponse);

        // Fetch Suitable Crops
        if (user?.soilType) {
          const cropsResponse = await cropDataService.getCropSuitability(user.soilType);
          setSuitableCrops(cropsResponse.suitableCrops);
        } else {
          // If no soil type, fetch general crops or show a message
          const cropsResponse = await cropDataService.getCropSuitability(); // Fetch with no soilType for default
          setSuitableCrops(cropsResponse.suitableCrops);
        }

        // Fetch Eligible Schemes
        const schemesResponse = await governmentSchemesService.getEligibleSchemes();
        setEligibleSchemes(schemesResponse);

        // Fetch Crop Knowledge Progress
        const progressResponse = await userProgressService.getCropProgress();
        setKnowledgeProgress(progressResponse.progressPercentage);

      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.soilType]); // Re-fetch if user's soil type changes

  // Transform fetched alerts into recentActivities format
  const recentActivities = alerts.map(alert => ({
    icon: alert.type === 'weather' ? Cloud : alert.type === 'scheme' ? FileText : AlertTriangle,
    title: alert.title,
    description: alert.message,
    time: new Date(alert.timestamp).toLocaleString(), // Format timestamp
    color: alert.type === 'weather' ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' :
           alert.type === 'scheme' ? 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' :
           'text-orange-600 bg-orange-100 dark:bg-orange-900/30'
  }));

  // Update quickStats based on fetched data
  const quickStats = [
    { 
      label: 'Weather Alerts', 
      value: `${alerts.filter(a => a.type === 'weather').length} Active`, 
      icon: AlertTriangle, 
      color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400',
      trend: '', // No trend from mock data
      description: 'Critical weather updates'
    },
    { 
      label: 'Suitable Crops', 
      value: `${suitableCrops.length} Available`, 
      icon: Sprout, 
      color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400',
      trend: '', // No trend from mock data
      description: `For your ${user?.soilType || 'unknown'} soil type`
    },
    { 
      label: 'Eligible Schemes', 
      value: `${eligibleSchemes.length} Eligible`, 
      icon: FileText, 
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
      trend: '', // No trend from mock data
      description: 'Government programs'
    },
    { 
      label: 'Knowledge Articles', 
      value: '40+ Topics', 
      icon: BookOpen, 
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400',
      trend: '+25%',
      description: 'Expert guidance'
    }
  ];

  const quickActions = [
    { 
      title: 'Check Crop Suitability', 
      path: '/crop-suitability', 
      icon: Sprout, 
      color: 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      description: 'Find the best crops for your soil'
    },
    { 
      title: 'Weather Forecast', 
      path: '/weather', 
      icon: Cloud, 
      color: 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      description: 'Plan with accurate weather data'
    },
    { 
      title: 'Government Schemes', 
      path: '/schemes', 
      icon: FileText, 
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700',
      description: 'Explore available subsidies'
    },
    { 
      title: 'Ask AI Assistant', 
      path: '/chatbot', 
      icon: MessageCircle, 
      color: 'bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      description: 'Get instant farming advice'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 dark:from-green-700 dark:via-green-600 dark:to-emerald-700 rounded-3xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-3">Welcome back, {user?.name}! 🌱</h1>
              <p className="text-green-100 text-lg mb-4 max-w-2xl">
                Your comprehensive agriculture knowledge platform is ready to help you make informed farming decisions.
              </p>
              {user?.farmLocation && (
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 w-fit">
                  <Map className="h-5 w-5" />
                  <span className="font-medium">Farm Location: {user.farmLocation}</span>
                </div>
              )}
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Sprout className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <div key={index} className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                  {stat.trend}
                </span>
              </div>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white mb-1">{stat.value}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Quick Actions</h2>
            <p className="text-gray-600 dark:text-gray-400">Get started with these essential farming tools</p>
          </div>
          <div className="hidden md:flex items-center space-x-2 text-gray-400">
            <Target className="h-5 w-5" />
            <span className="text-sm">Choose your next step</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-transparent transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2"
            >
              <div className="p-6 bg-white dark:bg-gray-800 group-hover:bg-gray-50 dark:group-hover:bg-gray-700 transition-colors duration-300">
                <div className={`inline-flex p-4 rounded-xl ${action.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300 mb-2">
                  {action.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{action.description}</p>
                <div className="flex items-center text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                  <span className="text-sm font-medium">Get started</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Recent Activity</h2>
            <div className="flex items-center space-x-2 text-gray-400">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm">Live updates</span>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center text-gray-500 dark:text-gray-400">Loading alerts...</div>
          ) : error ? (
            <div className="text-center text-red-500 dark:text-red-400">{error}</div>
          ) : alerts.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">No recent alerts.</div>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="group flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                  <div className={`p-2 rounded-lg ${activity.color} group-hover:scale-110 transition-transform duration-200`}>
                    <activity.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 dark:text-white group-hover:text-gray-900 dark:group-hover:text-gray-100">
                      {activity.title}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{activity.description}</p>
                    <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats Summary */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 shadow-xl border border-blue-200 dark:border-gray-700">
          <div className="text-center mb-6">
            <div className="inline-flex p-4 bg-blue-500 dark:bg-blue-600 rounded-full mb-4">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Your Progress</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Track your farming journey</p>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Knowledge Progress</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{knowledgeProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${knowledgeProgress}%` }}></div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;