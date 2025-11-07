import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  User, 
  Mail, 
  MapPin, 
  Bell, 
  Globe, 
  Shield, 
  Smartphone,
  Save,
  Eye,
  EyeOff,
  Settings as SettingsIcon,
  Palette,
  Lock,
  CheckCircle
} from 'lucide-react';

const Settings: React.FC = () => {
  const { user, updateUserSettings, changePassword } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    farmLocation: user?.farmLocation || '',
    farmSize: user?.farmSize || '',
    cropTypes: user?.cropTypes || [],
    soilType: user?.soilType || ''
  });

  const [notifications, setNotifications] = useState({
    weather: user?.preferences?.notifications?.weather ?? true,
    schemes: user?.preferences?.notifications?.schemes ?? true,
    pestAlerts: user?.preferences?.notifications?.pestAlerts ?? true,
    priceUpdates: user?.preferences?.notifications?.priceUpdates ?? false,
    email: user?.preferences?.notifications?.email ?? true,
    sms: user?.preferences?.notifications?.sms ?? false
  });

  // Update local state when user data from AuthContext changes
  React.useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        farmLocation: user.farmLocation || '',
        farmSize: user.farmSize || '',
        cropTypes: user.cropTypes || [],
        soilType: user.soilType || ''
      });
      setNotifications({
        weather: user.preferences?.notifications?.weather ?? true,
        schemes: user.preferences?.notifications?.schemes ?? true,
        pestAlerts: user.preferences?.notifications?.pestAlerts ?? true,
        priceUpdates: user.preferences?.notifications?.priceUpdates ?? false,
        email: user.preferences?.notifications?.email ?? true,
        sms: user.preferences?.notifications?.sms ?? false
      });
    }
  }, [user]);

  const [privacy, setPrivacy] = useState({
    shareData: false,
    analyticsTracking: true,
    locationServices: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const languages = [
    { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'as', name: 'Assamese', native: 'অসমীয়া', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' }
  ];

  const cropOptions = ['Rice', 'Wheat', 'Cotton', 'Maize', 'Sugarcane', 'Pulses', 'Oilseeds'];
  const soilTypes = ['Clay', 'Loamy', 'Sandy', 'Sandy Loam', 'Black Cotton', 'Red'];

  const handleProfileUpdate = async () => {
    try {
      // Call updateUserSettings from AuthContext to update the profile on the server
      await updateUserSettings(profile);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.new !== passwordData.confirm) {
      alert('New passwords do not match!');
      return;
    }
    try {
      await changePassword(passwordData.current, passwordData.new);
      alert('Password changed successfully!');
      setPasswordData({ current: '', new: '', confirm: '' }); // Clear fields on success
    } catch (error: any) {
      console.error('Failed to change password:', error);
      alert(error.message || 'Failed to change password. Please check your current password.');
    }
  };

  const handleNotificationUpdate = async () => {
    try {
      // Call updateUserSettings from AuthContext to update notification preferences
      await updateUserSettings({ preferences: { notifications: notifications } });
      alert('Notification preferences updated!');
    } catch (error) {
      console.error('Failed to update notification preferences:', error);
      alert('Failed to update notification preferences. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 rounded-3xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-3 flex items-center">
                Settings & Preferences 
                <SettingsIcon className="h-8 w-8 ml-3 text-gray-300" />
              </h1>
              <p className="text-gray-200 text-lg max-w-3xl">
                Manage your account, preferences, and privacy settings to customize your farming experience.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <User className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-blue-500 rounded-xl">
            <User className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Profile Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Phone Number</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="+91 XXXXX XXXXX"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Farm Location</label>
            <input
              type="text"
              value={profile.farmLocation}
              onChange={(e) => setProfile({ ...profile, farmLocation: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Village, District, State"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Farm Size (in acres)</label>
            <input
              type="number"
              value={profile.farmSize}
              onChange={(e) => setProfile({ ...profile, farmSize: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter farm size"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Soil Type</label>
            <select
              value={profile.soilType}
              onChange={(e) => setProfile({ ...profile, soilType: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-all duration-200"
            >
              <option value="">Select soil type</option>
              {soilTypes.map(soil => (
                <option key={soil} value={soil}>{soil}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 space-y-3">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Crop Types (Select multiple)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {cropOptions.map(crop => (
                <label key={crop} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.cropTypes.includes(crop)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setProfile({ ...profile, cropTypes: [...profile.cropTypes, crop] });
                      } else {
                        setProfile({ 
                          ...profile, 
                          cropTypes: profile.cropTypes.filter(c => c !== crop) 
                        });
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{crop}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleProfileUpdate}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <Save className="h-4 w-4" />
          <span>Update Profile</span>
        </button>
      </div>

      {/* Theme & Language Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Theme Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-purple-500 rounded-xl">
              <Palette className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Theme Preferences</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">Dark Mode</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Switch between light and dark themes</p>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDarkMode ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Language Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-green-500 rounded-xl">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Language Preferences</h2>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {languages.map(lang => (
              <div
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  language === lang.code
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:bg-green-25'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <div>
                      <p className="font-semibold">{lang.name}</p>
                      <p className="text-sm opacity-75">{lang.native}</p>
                    </div>
                  </div>
                  {language === lang.code && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Password Change */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-red-500 rounded-xl">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Change Password</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordData.current}
                onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={passwordData.new}
              onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Confirm New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={passwordData.confirm}
              onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        <button
          onClick={handlePasswordChange}
          className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <Shield className="h-4 w-4" />
          <span>Change Password</span>
        </button>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-orange-500 rounded-xl">
            <Bell className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Notification Preferences</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-gray-800 dark:text-white mb-4 text-lg">Content Notifications</h3>
            <div className="space-y-4">
              {[
                { key: 'weather', label: 'Weather Alerts', desc: 'Get notified about weather changes' },
                { key: 'schemes', label: 'Government Schemes Updates', desc: 'New schemes and deadlines' },
                { key: 'pestAlerts', label: 'Pest & Disease Alerts', desc: 'Early warning for crop threats' },
                { key: 'priceUpdates', label: 'Market Price Updates', desc: 'Daily market price changes' }
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">{item.label}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications[item.key as keyof typeof notifications]}
                    onChange={(e) => setNotifications({ 
                      ...notifications, 
                      [item.key]: e.target.checked 
                    })}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 w-5 h-5"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 dark:text-white mb-4 text-lg">Delivery Methods</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">Email Notifications</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates via email</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 w-5 h-5"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">SMS Notifications</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates via SMS</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.sms}
                  onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 w-5 h-5"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleNotificationUpdate}
          className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <Bell className="h-4 w-4" />
          <span>Update Preferences</span>
        </button>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-indigo-500 rounded-xl">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Privacy & Data</h2>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div>
              <p className="font-semibold text-gray-800 dark:text-white text-lg">Share anonymized data for research</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Help improve farming practices through data analysis</p>
            </div>
            <input
              type="checkbox"
              checked={privacy.shareData}
              onChange={(e) => setPrivacy({ ...privacy, shareData: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-5 h-5"
            />
          </div>

          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <div>
              <p className="font-semibold text-gray-800 dark:text-white text-lg">Analytics tracking</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Allow usage analytics to improve app performance</p>
            </div>
            <input
              type="checkbox"
              checked={privacy.analyticsTracking}
              onChange={(e) => setPrivacy({ ...privacy, analyticsTracking: e.target.checked })}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500 w-5 h-5"
            />
          </div>

          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <div>
              <p className="font-semibold text-gray-800 dark:text-white text-lg">Location services</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Enable location-based weather and recommendations</p>
            </div>
            <input
              type="checkbox"
              checked={privacy.locationServices}
              onChange={(e) => setPrivacy({ ...privacy, locationServices: e.target.checked })}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-5 h-5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;