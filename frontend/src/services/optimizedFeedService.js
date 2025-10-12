import { handleApiResponse } from '../utils/apiErrorHandler';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

class OptimizedFeedService {
  constructor() {
    this.baseURL = `${BACKEND_URL}/api`;
  }

  // Get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Handle API responses
  async handleResponse(response) {
    return handleApiResponse(response);
  }

  // 🚀 FAST INITIAL LOAD - Lightweight data only
  async getFastFeed(options = {}) {
    const { 
      limit = 10, 
      offset = 0, 
      lightweight = true 
    } = options;

    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      lightweight: lightweight.toString()
    });

    try {
      const response = await fetch(`${this.baseURL}/polls/fast?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching fast feed:', error);
      throw error;
    }
  }

  // 📊 GET FULL POLL DETAILS - Called after user interacts
  async getFullPollDetails(pollId) {
    try {
      const response = await fetch(`${this.baseURL}/polls/${pollId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching full poll details:', error);
      throw error;
    }
  }

  // 🔁 LOAD MORE POLLS - Pagination
  async loadMorePolls(offset = 0, limit = 10) {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    try {
      const response = await fetch(`${this.baseURL}/polls?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error loading more polls:', error);
      throw error;
    }
  }
}

export default new OptimizedFeedService();
