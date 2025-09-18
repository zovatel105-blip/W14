import AppConfig from '../config/config';

class SavedPollsService {
  constructor() {
    this.baseURL = AppConfig.BACKEND_URL;
  }

  async makeRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const url = `${this.baseURL}${endpoint}`;
    
    console.log('🔖 SavedPollsService: Making request:', {
      url,
      method: options.method || 'GET',
      hasToken: !!token,
      tokenLength: token ? token.length : 0,
      baseURL: this.baseURL
    });
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    };

    try {
      console.log('🚀 SavedPollsService: Sending request...');
      const response = await fetch(url, config);
      
      console.log('📡 SavedPollsService: Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ SavedPollsService: Error response:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { detail: errorText };
        }
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('✅ SavedPollsService: Success response:', responseData);
      return responseData;
    } catch (error) {
      console.error(`❌ SavedPollsService: Request failed [${endpoint}]:`, error);
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