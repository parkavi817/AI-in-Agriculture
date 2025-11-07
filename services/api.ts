// src/services/api.ts

import API_BASE_URL from '../config/apiConfig';

// Util to get auth headers
function getAuthHeaders(): Headers {
  const token = localStorage.getItem('krishi-token');
  const headers = new Headers({ 'Content-Type': 'application/json' });
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  return headers;
}

// ----------------------------------------
// Weather API Service
// ----------------------------------------

export interface ForecastDay {
  date: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  precipitation: number;
}

export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  forecast: ForecastDay[];
}

export const weatherService = {
  async getCurrentWeather(city: string): Promise<WeatherData> {
    const response = await fetch(`${API_BASE_URL}/api/weather/current?city=${encodeURIComponent(city)}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch current weather');
    return response.json();
  },

  async getForecast(city: string): Promise<ForecastDay[]> {
    const response = await fetch(`${API_BASE_URL}/api/weather/forecast?city=${encodeURIComponent(city)}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch weather forecast');
    return response.json();
  },

  async getCurrentWeatherByCoords(lat: number, lng: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/weather/current-coords?lat=${lat}&lng=${lng}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch weather data');
    }
    return response.json();
  }
};

export const mapsService = {
  async geocodeAddress(address: string): Promise<{ lat: number; lng: number; formattedAddress: string }> {
    const response = await fetch(`${API_BASE_URL}/api/maps/geocode`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ address })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to geocode address');
    }
    return response.json();
  }
};



// ----------------------------------------
// Government Schemes API Service
// ----------------------------------------

export interface GovernmentScheme {
  id: string;
  name: string;
  description: string;
  eligibility: string[];
  benefits: string;
  deadline: string;
  category: string;
  amount: string;
  applicationLink: string;
  popularity: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  uniqueFeatures: string[];
}

export const governmentSchemesService = {
  async getSchemes(): Promise<GovernmentScheme[]> {
    const response = await fetch(`${API_BASE_URL}/api/schemes`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch government schemes');
    return response.json();
  },
  async getEligibleSchemes(): Promise<GovernmentScheme[]> {
    const response = await fetch(`${API_BASE_URL}/api/schemes/eligible`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch eligible government schemes');
    return response.json();
  }
};

// ----------------------------------------
// Translation Service
// ----------------------------------------

export const translationService = {
  async translateText(text: string, targetLanguage: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/api/translate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ text, targetLanguage })
    });
    if (!response.ok) throw new Error('Translation service failed');
    const data = await response.json();
    return data.translatedText;
  },

  async isServiceAvailable(): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/api/translate/status`);
    return response.ok;
  }
};

// ----------------------------------------
// Crop Data Service
// ----------------------------------------

export const cropDataService = {
  async getCropSuitability(soilType?: string, region?: string) {
    const params = new URLSearchParams();
    if (soilType) params.append('soilType', soilType);
    if (region) params.append('region', region);

    const response = await fetch(`${API_BASE_URL}/api/crops/suitable?${params.toString()}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch crop suitability data');
    return response.json();
  }
};

// ----------------------------------------
// User Settings Update Service
// ----------------------------------------

/**
 * Updates user profile & preferences.
 * Returns the full updated user object.
 */
export async function updateUserSettings(settings: any) {
  const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(settings)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update user settings');
  }

  return response.json(); // updated user
}

/**
 * Changes user password.
 */
export async function changePassword(currentPassword: string, newPassword: string) {
  const response = await fetch(`${API_BASE_URL}/api/user/change-password`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ currentPassword, newPassword })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to change password');
  }

  return response.json(); // Success message or confirmation
}

// ----------------------------------------
// Alerts API Service
// ----------------------------------------

export interface Alert {
  id: string;
  type: 'weather' | 'scheme' | 'pest' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const alertService = {
  async getAlerts(acknowledged?: boolean): Promise<Alert[]> {
    let url = `${API_BASE_URL}/api/alerts`;
    if (acknowledged !== undefined) {
      url += `?acknowledged=${acknowledged}`;
    }
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch alerts');
    }
    return response.json();
  },

  async acknowledgeAlert(alertId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/alerts/${alertId}/acknowledge`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to acknowledge alert');
    }
    return response.json();
  }
};

// Authentication Service
export const authService = {
  async register(name: string, email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Registration failed');
    }
    const data = await response.json();
    // Store token for future requests
    localStorage.setItem('krishi-token', data.token);
    localStorage.setItem('krishi-user', JSON.stringify(data.user));
    return data;
  },

  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Login failed');
    }
    const data = await response.json();
    localStorage.setItem('krishi-token', data.token);
    localStorage.setItem('krishi-user', JSON.stringify(data.user));
    return data;
  },

  logout() {
    localStorage.removeItem('krishi-token');
    localStorage.removeItem('krishi-user');
  }
};

// ----------------------------------------

export const marketService = {
  async getMarketData(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/market`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch market data');
    }
    return response.json();
  }
};

export default {
  weather: weatherService,
  governmentSchemes: governmentSchemesService,
  translation: translationService,
  cropData: cropDataService,
  updateUserSettings,
  changePassword,
  alertService,
  market: marketService,
};

// New service for user progress tracking
export const userProgressService = {
  trackCropView: async (cropId: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/user/track-crop-view`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ cropId })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to track crop view');
    }
    return response.json();
  },
  async getCropProgress(): Promise<{ viewedCropsCount: number; totalCrops: number; progressPercentage: number; viewedCropIds: string[] }> {
    const response = await fetch(`${API_BASE_URL}/api/user/crop-progress`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch crop progress');
    }
    return response.json();
  }
};


// ----------------------------------------
// Chat Service
// ----------------------------------------

export interface ChatMessage {
  id?: string; // Optional, as it might be generated by backend
  sender: 'user' | 'bot';
  text: string;
  timestamp: string; // ISO date string
}

export interface ChatHistoryResponse {
  messages: ChatMessage[];
}

export const chatService = {
  async sendMessage(prompt: string, sessionId: string, language: string = 'en'): Promise<{ reply: string }> {
    const response = await fetch(`${API_BASE_URL}/api/chat/query`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ prompt, sessionId, language })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get chatbot response');
    }
    return response.json();
  },

  async getChatHistory(sessionId: string): Promise<ChatHistoryResponse> {
    const response = await fetch(`${API_BASE_URL}/api/chat/history?sessionId=${encodeURIComponent(sessionId)}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch chat history');
    }
    return response.json();
  },

  async saveMessage(text: string, sender: 'user' | 'bot', sessionId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ text, sender, sessionId })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save message');
    }
    return response.json();
  },

  async deleteChatSession(sessionId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/chat/session/${encodeURIComponent(sessionId)}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete chat session');
    }
    return response.json();
  }
};

export const farmService = {
  async addFarm(farmData: { name: string; lat: number; lng: number; cropType: string; area: number; soilType: string }): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/farms`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(farmData)
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add farm');
    }
    return response.json();
  },

  async getFarms(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/farms`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch farms');
    }
    return response.json();
  },

  async updateFarm(farmId: string, updates: Partial<{ name: string; lat: number; lng: number; cropType: string; area: number; soilType: string; alertsEnabled: boolean }>): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/farms/${farmId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update farm');
    }
    
    return response.json();
  },

  async deleteFarm(farmId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/farms/${farmId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete farm');
    }
    // No content for successful delete, just check response.ok
  }
};