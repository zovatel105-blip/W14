import AppConfig from '../config/config';

class SavedPollsService {
  constructor() {
    this.baseURL = AppConfig.BACKEND_URL;
  }

  async makeRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`SavedPolls API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  async savePoll(pollId) {
    return this.makeRequest(`/api/polls/${pollId}/save`, {
      method: 'POST'
    });
  }

  async unsavePoll(pollId) {
    return this.makeRequest(`/api/polls/${pollId}/save`, {
      method: 'DELETE'
    });
  }

  async getSavedPolls(userId, skip = 0, limit = 20) {
    return this.makeRequest(`/api/users/${userId}/saved-polls?skip=${skip}&limit=${limit}`, {
      method: 'GET'
    });
  }

  async getPollSaveStatus(pollId) {
    return this.makeRequest(`/api/polls/${pollId}/save-status`, {
      method: 'GET'
    });
  }

  // Toggle save/unsave
  async toggleSavePoll(pollId) {
    try {
      // First check current status
      const statusResponse = await this.getPollSaveStatus(pollId);
      const isCurrentlySaved = statusResponse.saved;

      // Toggle the status
      if (isCurrentlySaved) {
        const result = await this.unsavePoll(pollId);
        return { ...result, saved: false };
      } else {
        const result = await this.savePoll(pollId);
        return { ...result, saved: true };
      }
    } catch (error) {
      console.error('Error toggling save status:', error);
      throw error;
    }
  }
}

const savedPollsService = new SavedPollsService();
export default savedPollsService;