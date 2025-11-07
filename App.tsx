import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import CropSuitability from './pages/CropSuitability';
import Weather from './pages/Weather';
import GovernmentSchemes from './pages/GovernmentSchemes';
import CropKnowledge from './pages/CropKnowledge';
import Maps from './pages/Maps';
import Chatbot from './pages/Chatbot';
import Settings from './pages/Settings';
import Login from './pages/Login';
import MarketPrice from './pages/marketprice';
import AgriScan from './pages/AgriScan';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Layout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="crop-suitability" element={<CropSuitability />} />
                  <Route path="weather" element={<Weather />} />
                  <Route path="schemes" element={<GovernmentSchemes />} />
                  <Route path="crop-knowledge" element={<CropKnowledge />} />
                  <Route path="maps" element={<Maps />} />
                  <Route path="chatbot" element={<Chatbot />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="market-price" element={<MarketPrice />} />
                  <Route path="agriscan" element={<AgriScan />} />
                </Route>
              </Routes>
            </div>
          </Router>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
