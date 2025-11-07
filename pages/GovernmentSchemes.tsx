import React, { useState, useMemo } from 'react';
import { Search, Filter, Award, DollarSign, Users, Calendar, Link, Star, TrendingUp, Zap, Shield } from 'lucide-react';
import schemesData from '../data/governmentSchemes.json'; // Import the JSON data

interface Scheme {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  popularity: number; // 0-100
  amount: string;
  benefits: string;
  eligibility: string[];
  deadline: string;
  applicationLink: string;
}

const GovernmentSchemes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  const categories = useMemo(() => {
    const uniqueCategories = new Set(schemesData.map(scheme => scheme.category));
    return Array.from(uniqueCategories);
  }, []);

  const difficulties = ['Easy', 'Medium', 'Hard'];

  const filteredSchemes = useMemo(() => {
    return schemesData.filter(scheme => {
      const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            scheme.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            scheme.benefits.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            scheme.eligibility.some(e => e.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === '' || scheme.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === '' || scheme.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchTerm, selectedCategory, selectedDifficulty]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Income Support': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Insurance': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Soil Health': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Sustainability': return 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400';
      case 'Credit': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'General': return 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-500';
      case 'Medium': return 'text-yellow-500';
      case 'Hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-lime-600 to-green-600 dark:from-emerald-700 dark:via-lime-700 dark:to-green-700 rounded-3xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-3">Government Schemes for Farmers 🌾</h1>
              <p className="text-emerald-100 text-lg max-w-3xl">
                Discover and apply for various government schemes designed to support and empower farmers.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Award className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Filter className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Filter Schemes</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              placeholder="Search schemes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="relative group">
            <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none transition-all duration-200"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="relative group">
            <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none transition-all duration-200"
            >
              <option value="">All Difficulties</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Schemes List */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <Award className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Available Schemes ({filteredSchemes.length})</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.length > 0 ? (
            filteredSchemes.map((scheme) => (
              <div key={scheme.id} className="group p-6 border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-gray-50/50 to-emerald-50/50 dark:from-gray-800/50 dark:to-emerald-900/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 dark:text-white text-lg group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {scheme.name}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(scheme.category)}`}>
                    {scheme.category}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{scheme.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                    <span>Amount: <span className="font-medium text-gray-800 dark:text-white">{scheme.amount}</span></span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>Popularity: <span className="font-medium text-gray-800 dark:text-white">{scheme.popularity}%</span></span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Zap className="h-4 w-4" />
                    <span className={getDifficultyColor(scheme.difficulty)}>Difficulty: <span className="font-medium">{scheme.difficulty}</span></span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Award className="h-4 w-4 text-emerald-500 mt-0.5" />
                    <span>Benefits: <span className="font-medium text-gray-800 dark:text-white">{scheme.benefits}</span></span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="h-4 w-4 text-emerald-500 mt-0.5" />
                    <span>Eligibility:</span>
                    <ul className="list-disc list-inside ml-2">
                      {scheme.eligibility.map((item, index) => (
                        <li key={index} className="font-medium text-gray-800 dark:text-white">{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 text-emerald-500" />
                    <span>Deadline: <span className="font-medium text-gray-800 dark:text-white">{scheme.deadline}</span></span>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <a 
                    href={scheme.applicationLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    <Link className="h-4 w-4" />
                    <span>Apply Now</span>
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="md:col-span-3 text-center py-12">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No schemes found matching your criteria.</p>
              <p className="text-gray-500 dark:text-gray-500 mt-2">Try adjusting your search or filter options.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Info */}
      <div className="bg-gradient-to-r from-emerald-600 to-lime-700 dark:from-emerald-700 dark:to-lime-800 rounded-3xl p-8 text-white shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-4">Empowering Farmers Through Support 🤝</h3>
            <p className="text-emerald-100 mb-6 text-lg">
              Government schemes play a vital role in enhancing agricultural productivity, ensuring food security, and improving farmers' livelihoods.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <DollarSign className="h-5 w-5 text-emerald-200" />
                <span><strong>Financial Aid:</strong> Direct income support and subsidies.</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <Shield className="h-5 w-5 text-emerald-200" />
                <span><strong>Risk Mitigation:</strong> Crop insurance and disaster relief.</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <TrendingUp className="h-5 w-5 text-emerald-200" />
                <span><strong>Productivity Boost:</strong> Irrigation, soil health, and technology.</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <h4 className="text-xl font-bold mb-4">Key Focus Areas</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Income Support:</span>
                <span className="font-bold">PM-KISAN</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Crop Insurance:</span>
                <span className="font-bold">PMFBY</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Irrigation:</span>
                <span className="font-bold">PMKSY</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Soil Health:</span>
                <span className="font-bold">Soil Health Card</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernmentSchemes;