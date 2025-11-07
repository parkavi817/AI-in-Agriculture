// Mock AI Service - Replace with actual backend integration

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const huggingFaceService = {
  async generateResponse(messages: ChatMessage[]): Promise<string> {
    // TODO: Replace with actual backend AI API call
    // const response = await fetch('/api/ai/chat', { ... });
    
    const userMessage = messages[messages.length - 1]?.content || '';
    
    // Mock AI response with delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.generateFallbackResponse(userMessage));
      }, 1500);
    });
  },

  async isServiceAvailable(): Promise<boolean> {
    // TODO: Check actual AI service availability
    // const response = await fetch('/api/ai/status');
    return Promise.resolve(false);
  },

  generateFallbackResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    
    // Enhanced agriculture responses
    if (lowerMessage.includes('rice') || lowerMessage.includes('paddy')) {
      return 'For rice cultivation: Use certified seeds, maintain 2-3 cm water level, apply NPK fertilizers based on soil test, and watch for pests like stem borer. Plant during monsoon (June-July) for best results. Harvest when 80% grains turn golden yellow.';
    } else if (lowerMessage.includes('wheat')) {
      return 'Wheat cultivation tips: Plant in October-December, use 100 kg/ha seed rate, apply basal fertilizers before sowing, and provide irrigation at critical stages (crown root, tillering, flowering). Harvest when moisture content is 20-25%.';
    } else if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('climate')) {
      return 'Weather planning is crucial for farming success. Check our Weather section for accurate forecasts. Generally: avoid spraying during windy/rainy conditions, plan irrigation based on rainfall predictions, and protect crops during extreme weather events.';
    } else if (lowerMessage.includes('fertilizer') || lowerMessage.includes('nutrient')) {
      return 'Fertilizer application should be based on soil testing. General guidelines: apply organic manure before sowing, use balanced NPK ratios, split nitrogen application, and consider micronutrients like zinc and boron.';
    } else if (lowerMessage.includes('pest') || lowerMessage.includes('disease')) {
      return 'Integrated Pest Management (IPM) approach: 1) Regular field monitoring, 2) Use resistant varieties, 3) Biological control methods, 4) Chemical control as last resort. Identify pests correctly before treatment.';
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello! I\'m your AI agriculture assistant. I can help you with crop cultivation, pest management, fertilizer application, weather guidance, government schemes, and farming best practices. What specific farming question do you have?';
    } else {
      return 'I can help you with various farming topics including crop cultivation, pest management, fertilizer application, weather guidance, government schemes, and agricultural best practices. Could you please be more specific about what you\'d like to know?';
    }
  }
};