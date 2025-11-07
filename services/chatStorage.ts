// Mock Chat Storage Service - Replace with actual backend integration

export interface StoredMessage {
  id?: string;
  userId: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sessionId?: string;
}

export const chatStorageService = {
  async saveMessage(userId: string, text: string, sender: 'user' | 'bot', sessionId?: string): Promise<void> {
    // TODO: Replace with actual backend API call
    // await fetch('/api/chat/messages', { method: 'POST', ... });
    
    // Mock storage - save to localStorage for now
    const messages = JSON.parse(localStorage.getItem(`chat_${userId}`) || '[]');
    messages.push({
      id: Date.now().toString(),
      userId,
      text,
      sender,
      timestamp: new Date(),
      sessionId: sessionId || 'default'
    });
    localStorage.setItem(`chat_${userId}`, JSON.stringify(messages));
  },

  async getChatHistory(userId: string, sessionId?: string): Promise<StoredMessage[]> {
    // TODO: Replace with actual backend API call
    // const response = await fetch(`/api/chat/history/${userId}?sessionId=${sessionId}`);
    
    // Mock retrieval from localStorage
    const messages = JSON.parse(localStorage.getItem(`chat_${userId}`) || '[]');
    return messages.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
  },

  async getRecentSessions(userId: string, limit: number = 10): Promise<string[]> {
    // TODO: Replace with actual backend API call
    // const response = await fetch(`/api/chat/sessions/${userId}?limit=${limit}`);
    
    // Mock sessions
    return Promise.resolve(['default']);
  }
};