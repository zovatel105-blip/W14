import { handleApiResponse } from '../utils/apiErrorHandler';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

class SearchService {
  constructor() {
    this.baseURL = `${BACKEND_URL}/api`;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async searchPosts(query, limit = 20, offset = 0) {
    try {
      const params = new URLSearchParams({
        q: query,
        limit: limit.toString(),
        offset: offset.toString()
      });

      const response = await fetch(`${this.baseURL}/search/posts?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  }

  async searchUsers(query, limit = 20, offset = 0) {
    try {
      const params = new URLSearchParams({
        q: query,
        limit: limit.toString(),
        offset: offset.toString()
      });

      const response = await fetch(`${this.baseURL}/search/users?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  async searchHashtags(query, limit = 20, offset = 0) {
    try {
      const params = new URLSearchParams({
        q: query,
        limit: limit.toString(),
        offset: offset.toString()
      });

      const response = await fetch(`${this.baseURL}/search/hashtags?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error searching hashtags:', error);
      throw error;
    }
  }

  async searchSounds(query, limit = 20, offset = 0) {
    try {
      const params = new URLSearchParams({
        q: query,
        limit: limit.toString(),
        offset: offset.toString()
      });

      const response = await fetch(`${this.baseURL}/search/sounds?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error searching sounds:', error);
      throw error;
    }
  }

  async universalSearch(query, filter = 'all', sortBy = 'relevance', limit = 20) {
    try {
      const params = new URLSearchParams({
        q: query,
        filter: filter,
        sort_by: sortBy,
        limit: limit.toString()
      });

      const response = await fetch(`${this.baseURL}/search?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error in universal search:', error);
      throw error;
    }
  }

  async getAutocomplete(query, limit = 10) {
    try {
      const params = new URLSearchParams({
        q: query,
        limit: limit.toString()
      });

      const response = await fetch(`${this.baseURL}/search/autocomplete?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error getting autocomplete:', error);
      throw error;
    }
  }

  async getRecentSearches(limit = 10) {
    try {
      const params = new URLSearchParams({
        limit: limit.toString()
      });

      const response = await fetch(`${this.baseURL}/search/recent?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error getting recent searches:', error);
      throw error;
    }
  }

  async saveRecentSearch(query, filter = 'all') {
    try {
      const response = await fetch(`${this.baseURL}/search/recent`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ query, filter })
      });

      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error saving recent search:', error);
      throw error;
    }
  }

  async getRecommendedContent(limit = 12) {
    try {
      const params = new URLSearchParams({
        limit: limit.toString()
      });

      const response = await fetch(`${this.baseURL}/search/recommendations?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error getting recommended content:', error);
      throw error;
    }
  }
}

export default new SearchService();
