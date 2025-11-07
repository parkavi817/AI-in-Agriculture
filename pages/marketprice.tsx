import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, MapPin, Calendar, Package, Search, Filter, RefreshCw, BarChart3, Activity } from 'lucide-react';

interface MarketRecord {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  arrival_date: string;
  min_price: string;
  max_price: string;
  modal_price: string;
}

const MarketPrice: React.FC = () => {
  const [records, setRecords] = useState<MarketRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MarketRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCommodity, setSelectedCommodity] = useState('');
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await api.market.getMarketData();
        setRecords(response.records);
        setFilteredRecords(response.records);
      } catch (err) {
        setError('Failed to fetch market data.');
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  useEffect(() => {
    let filtered = records;

    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.market.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.district.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedState) {
      filtered = filtered.filter(record => record.state === selectedState);
    }

    if (selectedCommodity) {
      filtered = filtered.filter(record => record.commodity === selectedCommodity);
    }

    setFilteredRecords(filtered);
  }, [searchTerm, selectedState, selectedCommodity, records]);

  const uniqueStates = [...new Set(records.map(record => record.state))].sort();
  const uniqueCommodities = [...new Set(records.map(record => record.commodity))].sort();

  const getPriceChange = (minPrice: string, maxPrice: string) => {
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    return ((max - min) / min * 100).toFixed(1);
  };

  const getAveragePrice = () => {
    if (filteredRecords.length === 0) return 0;
    const total = filteredRecords.reduce((sum, record) => sum + parseFloat(record.modal_price), 0);
    return (total / filteredRecords.length).toFixed(2);
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await api.market.getMarketData();
      setRecords(response.records);
      setFilteredRecords(response.records);
    } catch (err) {
      setError('Failed to refresh market data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex justify-center items-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400"></div>
            <BarChart3 className="absolute inset-0 m-auto h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-400">Loading market data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex justify-center items-center">
        <div className="text-center p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-red-200 dark:border-red-800">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingDown className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-red-800 dark:text-red-400 mb-2">Error Loading Data</h3>
          <p className="text-red-600 dark:text-red-500 mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-300 mx-auto"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-indigo-300/20 rounded-full blur-lg"></div>
          
          <div className="relative z-10 p-10 text-white">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <BarChart3 className="h-8 w-8" />
                  </div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    Market Prices
                  </h1>
                </div>
                <p className="text-xl text-blue-100 mb-6 max-w-2xl leading-relaxed">
                  Real-time agricultural commodity prices from markets across India. Track trends, compare prices, and make informed decisions.
                </p>
                <div className="flex items-center space-x-8">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-blue-200" />
                    <span className="text-blue-100">Live Updates</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-blue-200" />
                    <span className="text-blue-100">{uniqueStates.length} States</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-blue-200" />
                    <span className="text-blue-100">{uniqueCommodities.length} Commodities</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="w-40 h-40 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20">
                    <TrendingUp className="h-20 w-20 text-white drop-shadow-lg" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Records</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{filteredRecords.length}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Price</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{getAveragePrice()}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">States Covered</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{uniqueStates.length}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
                <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Commodities</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{uniqueCommodities.length}</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-xl">
                <Package className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters Section */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
              <Filter className="h-6 w-6 mr-3 text-indigo-600" />
              Filter & Search
            </h2>
            <button
              onClick={refreshData}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search commodities, markets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All States</option>
              {uniqueStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            
            <select
              value={selectedCommodity}
              onChange={(e) => setSelectedCommodity(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Commodities</option>
              {uniqueCommodities.map(commodity => (
                <option key={commodity} value={commodity}>{commodity}</option>
              ))}
            </select>
            
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedState('');
                setSelectedCommodity('');
              }}
              className="px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl font-medium transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Market Data Table */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
              <TrendingUp className="h-6 w-6 mr-3 text-green-600" />
              Live Market Data
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Showing {filteredRecords.length} of {records.length} records
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4" />
                      <span>Commodity</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>Location</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                    Min Price
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                    Max Price
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                    <div className="flex items-center justify-end space-x-2">
                      <DollarSign className="h-4 w-4" />
                      <span>Modal Price</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                    Price Range
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Date</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/50 dark:bg-gray-800/50 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRecords.map((record, index) => {
                  const priceChange = parseFloat(getPriceChange(record.min_price, record.max_price));
                  return (
                    <motion.tr
                      key={index}
                      className="hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-all duration-200"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.01 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg mr-3">
                            <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-gray-100">{record.commodity}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{record.variety}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg mr-3">
                            <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">{record.market}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{record.district}, {record.state}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{record.min_price}</span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{record.max_price}</span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end">
                          <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
                          <span className="font-bold text-lg text-green-600 dark:text-green-400">{record.modal_price}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          {priceChange > 0 ? (
                            <div className="flex items-center text-green-600 dark:text-green-400">
                              <TrendingUp className="h-4 w-4 mr-1" />
                              <span className="font-medium">+{priceChange}%</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-gray-500 dark:text-gray-400">
                              <span className="font-medium">0%</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{record.arrival_date}</span>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">No records found</p>
              <p className="text-gray-400 dark:text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketPrice;