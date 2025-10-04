/**
 * Search Service - Handles all search-related API calls
 */

import SEARCH_CONFIG from '../config/searchConfig';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

class SearchService {
  // Get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  constructor() {
    this.baseURL = `${BACKEND_URL}/api`;
  }

  // Search polls/posts
  async searchPosts(query, limit = SEARCH_CONFIG.LIMITS.SEARCH_RESULTS, offset = 0) {
    try {
      const params = new URLSearchParams({
        query,
        limit: limit.toString(),
        offset: offset.toString()
      });

      const response = await fetch(`${this.baseURL}/search/posts?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Search posts error:', error);
      throw error;
    }
  }

  // Search users
  async searchUsers(query, limit = SEARCH_CONFIG.LIMITS.SEARCH_RESULTS, offset = 0) {
    try {
      const params = new URLSearchParams({
        query,
        limit: limit.toString(),
        offset: offset.toString()
      });

      const response = await fetch(`${this.baseURL}/search/users?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Search users error:', error);
      throw error;
    }
  }

  // Search audio/music
  async searchAudio(query, limit = SEARCH_CONFIG.LIMITS.SEARCH_RESULTS, offset = 0) {
    try {
      const params = new URLSearchParams({
        query,
        limit: limit.toString(),
        offset: offset.toString()
      });

      const response = await fetch(`${this.baseURL}/search/audio?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Search audio error:', error);
      throw error;
    }
  }

  // Get trending hashtags
  async getTrendingHashtags(limit = SEARCH_CONFIG.LIMITS.DISCOVERY_TRENDING) {
    try {
      const params = new URLSearchParams({
        limit: limit.toString()
      });

      const response = await fetch(`${this.baseURL}/search/trending-hashtags?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get trending hashtags error:', error);
      throw error;
    }
  }

  // Comprehensive search (all types)
  async searchAll(query, limit = SEARCH_CONFIG.LIMITS.SEARCH_RESULTS, offset = 0) {
    try {
      const params = new URLSearchParams({
        query,
        limit: limit.toString(),
        offset: offset.toString()
      });

      const response = await fetch(`${this.baseURL}/search/all?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Search all error:', error);
      throw error;
    }
  }

  // Universal search with filter support
  async universalSearch(
    query, 
    filter = SEARCH_CONFIG.FILTERS.DEFAULT, 
    sortBy = SEARCH_CONFIG.SORT_OPTIONS.DEFAULT, 
    limit = SEARCH_CONFIG.LIMITS.SEARCH_RESULTS, 
    offset = 0
  ) {
    try {
      const params = new URLSearchParams({
        q: query,  // Backend expects 'q' not 'query'
        filter_type: filter,  // Backend expects 'filter_type'
        sort_by: sortBy,
        limit: limit.toString(),
        offset: offset.toString()
      });

      const response = await fetch(`${this.baseURL}/search/universal?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Universal search error:', error);
      throw error;
    }
  }

  // Get autocomplete suggestions
  async getAutocomplete(query, limit = SEARCH_CONFIG.LIMITS.AUTOCOMPLETE_RESULTS) {
    try {
      const params = new URLSearchParams({
        q: query,  // Backend expects 'q' not 'query'
        limit: limit.toString()
      });

      const response = await fetch(`${this.baseURL}/search/autocomplete?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Autocomplete error:', error);
      throw error;
    }
  }

  // Get search suggestions for discovery
  async getSearchSuggestions() {
    try {
      const response = await fetch(`${this.baseURL}/search/suggestions`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Search suggestions error:', error);
      // Return mock data if service fails
      return {
        trending_posts: [],
        suggested_users: [],
        trending_hashtags: []
      };
    }
  }

  // Get recent searches for current user
  async getRecentSearches(limit = 10) {
    try {
      const response = await fetch(`${this.baseURL}/search/recent?limit=${limit}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Recent searches error:', error);
      return { recent_searches: [] };
    }
  }

  // Save search query to recent searches
  async saveRecentSearch(query, searchType = 'general') {
    try {
      const response = await fetch(`${this.baseURL}/search/recent`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ 
          query: query.trim(), 
          search_type: searchType 
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Save recent search error:', error);
      // Fail silently for recent searches
      return null;
    }
  }

  // Delete a specific recent search
  async deleteRecentSearch(searchId) {
    try {
      const response = await fetch(`${this.baseURL}/search/recent/${searchId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Delete recent search error:', error);
      throw error;
    }
  }

  // Get recommended content ("You may like")
  async getRecommendedContent(limit = 10) {
    try {
      const response = await fetch(`${this.baseURL}/feed/recommendations?limit=${limit}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Recommended content error:', error);
      return { recommendations: [] };
    }
  }

  // Get trending content
  async getTrendingContent(timeframe = '24h', limit = 20) {
    try {
      const params = new URLSearchParams({
        timeframe,
        limit: limit.toString()
      });

      const response = await fetch(`${this.baseURL}/trending?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Trending content error:', error);
      return { 
        trending_posts: [],
        trending_hashtags: [],
        trending_users: [],
        trending_sounds: []
      };
    }
  }

  // Get personalized recommendations based on user activity
  async getPersonalizedRecommendations(limit = 15) {
    try {
      const response = await fetch(`${this.baseURL}/recommendations/personalized?limit=${limit}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Personalized recommendations error:', error);
      return { recommendations: [] };
    }
  }

  // Enhanced search history with privacy controls
  async getSearchHistory(limit = 10, includePrivate = false) {
    try {
      // Try to get from backend first
      const params = new URLSearchParams({
        limit: limit.toString(),
        include_private: includePrivate.toString()
      });

      const response = await fetch(`${this.baseURL}/search/history?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        return data.search_history || [];
      }

      // Fallback to localStorage for privacy
      const localHistory = this.getLocalSearchHistory();
      return localHistory.slice(0, limit);
    } catch (error) {
      console.error('Search history error:', error);
      // Always fallback to local storage for privacy
      return this.getLocalSearchHistory().slice(0, limit);
    }
  }

  // Local search history management (privacy-focused)
  getLocalSearchHistory() {
    try {
      const history = localStorage.getItem('searchHistory');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error reading local search history:', error);
      return [];
    }
  }

  addToLocalSearchHistory(query, searchType = 'general', results = []) {
    try {
      const history = this.getLocalSearchHistory();
      const newEntry = {
        id: Date.now().toString(),
        query: query.trim(),
        search_type: searchType,
        timestamp: new Date().toISOString(),
        results_count: results.length,
        // Only store non-sensitive preview data
        preview: results.slice(0, 3).map(r => ({
          type: r.type,
          title: r.title || r.username || r.hashtag || '',
          id: r.id
        }))
      };

      // Remove duplicate queries
      const filteredHistory = history.filter(h => h.query.toLowerCase() !== query.toLowerCase());
      
      // Add new entry at the beginning and limit to 10 entries
      const updatedHistory = [newEntry, ...filteredHistory].slice(0, 10);
      
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      return newEntry;
    } catch (error) {
      console.error('Error saving to local search history:', error);
      return null;
    }
  }

  clearLocalSearchHistory() {
    try {
      localStorage.removeItem('searchHistory');
      return true;
    } catch (error) {
      console.error('Error clearing local search history:', error);
      return false;
    }
  }

  removeFromLocalSearchHistory(entryId) {
    try {
      const history = this.getLocalSearchHistory();
      const updatedHistory = history.filter(h => h.id !== entryId);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      return true;
    } catch (error) {
      console.error('Error removing from local search history:', error);
      return false;
    }
  }
}

export default new SearchService();