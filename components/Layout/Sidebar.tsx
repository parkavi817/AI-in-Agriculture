import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  Home,
  Sprout,
  Cloud,
  FileText,
  BookOpen,
  Map,
  MessageCircle,
  Settings,
  Leaf,
  Camera
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { translate } = useLanguage();

  const navItems = [
    { path: '/', icon: Home, key: 'dashboard' },
    { path: '/crop-suitability', icon: Sprout, key: 'cropSuitability' },
    { path: '/weather', icon: Cloud, key: 'weather' },
    { path: '/schemes', icon: FileText, key: 'schemes' },
    { path: '/crop-knowledge', icon: BookOpen, key: 'cropKnowledge' },
    { path: '/maps', icon: Map, key: 'maps' },
    { path: '/chatbot', icon: MessageCircle, key: 'chatbot' },
    { path: '/market-price', icon: Leaf, key: 'marketPrice' },
    { path: '/agriscan', icon: Camera, key: 'agriscan' },
    { path: '/settings', icon: Settings, key: 'settings' }
  ];

  return (
    <div className="bg-gradient-to-b from-green-800 to-green-900 dark:from-gray-800 dark:to-gray-900 text-white w-64 flex-shrink-0 shadow-2xl transition-colors duration-300">
      <div className="p-6 border-b border-green-700 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Leaf className="h-8 w-8 text-green-300 dark:text-green-400" />
          <div>
             <h1 className="text-xl font-bold">Krishi Gyan</h1>
            <p className="text-green-300 dark:text-green-400 text-sm">Agriculture Platform</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-6 py-4 text-sm font-medium transition-all duration-200 hover:bg-green-700 dark:hover:bg-gray-700 hover:border-r-4 hover:border-green-300 dark:hover:border-green-400 ${
                  isActive
                    ? 'bg-green-700 dark:bg-gray-700 border-r-4 border-green-300 dark:border-green-400 text-green-100 dark:text-green-200'
                    : 'text-green-200 dark:text-gray-300'
                }`
              }
            >
              <IconComponent className="h-5 w-5" />
              <span>{translate(item.key)}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;