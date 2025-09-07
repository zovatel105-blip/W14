import { apiRequest } from './api';

export const searchService = {
  // Universal search with filters and sorting
  universalSearch: async (query, filterType = 'all', sortBy = 'relevance', limit = 20) => {
    try {
      const params = new URLSearchParams({
        q: query,
        filter_type: filterType,
        sort_by: sortBy,
        limit: limit.toString()
      });
      
      const response = await apiRequest(`/search/universal?${params}`, {
        method: 'GET'
      });
      
      return response;
    } catch (error) {
      console.error('Error in universal search:', error);
      throw error;
    }
  },

  // Real-time autocomplete suggestions
  getAutocomplete: async (query) => {
    try {
      if (!query || query.length < 2) {
        return { suggestions: [] };
      }
      
      const params = new URLSearchParams({ q: query });
      const response = await apiRequest(`/search/autocomplete?${params}`, {
        method: 'GET'
      });
      
      return response;
    } catch (error) {
      console.error('Error in autocomplete:', error);
      return { suggestions: [] };
    }
  },

  // Get search suggestions and trending content
  getSearchSuggestions: async () => {
    try {
      const response = await apiRequest('/search/suggestions', {
        method: 'GET'
      });
      
      return response;
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      return {
        recent_searches: [],
        popular_terms: [],
        trending_hashtags: [],
        suggested_users: []
      };
    }
  },

  // Basic user search (legacy endpoint)
  searchUsers: async (query) => {
    try {
      const params = new URLSearchParams({ q: query });
      const response = await apiRequest(`/users/search?${params}`, {
        method: 'GET'
      });
      
      return response;
    } catch (error) {
      console.error('Error in user search:', error);
      return [];
    }
  }
};

export default searchService;