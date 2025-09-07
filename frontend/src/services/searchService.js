const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

class SearchService {
  constructor() {
    this.baseURL = `${BACKEND_URL}/api`;
  }

  // Get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Handle API response
  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }
    return await response.json();
  }

  // Universal search with filters and sorting
  async universalSearch(query, filterType = 'all', sortBy = 'relevance', limit = 20) {
    try {
      const params = new URLSearchParams({
        q: query,
        filter_type: filterType,
        sort_by: sortBy,
        limit: limit.toString()
      });
      
      const response = await fetch(`${this.baseURL}/search/universal?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error in universal search:', error);
      throw error;
    }
  }

  // Real-time autocomplete suggestions
  async getAutocomplete(query) {
    try {
      if (!query || query.length < 2) {
        return { suggestions: [] };
      }
      
      const params = new URLSearchParams({ q: query });
      const response = await fetch(`${this.baseURL}/search/autocomplete?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error in autocomplete:', error);
      return { suggestions: [] };
    }
  }

  // Get search suggestions and trending content
  async getSearchSuggestions() {
    try {
      const response = await fetch(`${this.baseURL}/search/suggestions`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      return {
        recent_searches: [],
        popular_terms: [],
        trending_hashtags: [],
        suggested_users: []
      };
    }
  }

  // Basic user search (legacy endpoint)
  async searchUsers(query) {
    try {
      const params = new URLSearchParams({ q: query });
      const response = await fetch(`${this.baseURL}/users/search?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error in user search:', error);
      return [];
    }
  }
}

// Create and export a singleton instance
const searchService = new SearchService();

export default searchService;