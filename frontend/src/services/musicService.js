/**
 * Music Service - Handles real-time music search and static library
 * Integrates with iTunes API through backend for unlimited music search
 */

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

class MusicService {
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

  // Handle API errors
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Search music in real-time using iTunes API
  async searchMusicRealtime(query, limit = 20) {
    if (!query?.trim()) {
      return {
        success: false,
        message: 'Query is required',
        results: []
      };
    }

    try {
      const params = new URLSearchParams({
        query: query.trim(),
        limit: limit.toString()
      });

      const response = await fetch(`${this.baseURL}/music/search-realtime?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error searching music in real-time:', error);
      return {
        success: false,
        message: error.message || 'Failed to search music',
        results: []
      };
    }
  }

  // Get static music library (popular/recommended songs)
  async getStaticMusicLibrary(limit = 20) {
    try {
      const params = new URLSearchParams({
        limit: limit.toString()
      });

      const response = await fetch(`${this.baseURL}/music/library-with-previews?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await this.handleResponse(response);
      return {
        success: true,
        message: 'Static library loaded',
        results: result.music || [],
        total: result.total || 0,
        source: result.source || 'Static'
      };
    } catch (error) {
      console.error('Error fetching static music library:', error);
      return {
        success: false,
        message: error.message || 'Failed to load music library',
        results: []
      };
    }
  }

  // Get old static music library (fallback)
  async getOldStaticLibrary(category = null, search = null) {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);

      const response = await fetch(`${this.baseURL}/music/library?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await this.handleResponse(response);
      return {
        success: true,
        message: 'Library loaded',
        results: result.music || [],
        total: result.total || 0,
        source: 'Static Library'
      };
    } catch (error) {
      console.error('Error fetching old static library:', error);
      return {
        success: false,
        message: error.message || 'Failed to load music library',
        results: []
      };
    }
  }

  // Transform music item to consistent format
  transformMusicItem(item) {
    return {
      id: item.id,
      title: item.title,
      artist: item.artist,
      preview_url: item.preview_url || item.url,
      cover: item.cover,
      duration: item.duration || 30,
      category: item.category || 'Music',
      isOriginal: item.isOriginal || false,
      isTrending: item.isTrending || false,
      uses: item.uses || 0,
      waveform: item.waveform || Array(20).fill(0.5),
      source: item.source || 'Unknown',
      album: item.album || '',
      release_date: item.release_date || '',
      itunes_url: item.itunes_url || ''
    };
  }

  // Combined search function - searches both real-time and static
  async searchMusic(query, options = {}) {
    const { 
      includeStatic = true, 
      staticFirst = false, 
      limit = 20 
    } = options;

    if (!query?.trim()) {
      // If no query, return static popular music
      if (includeStatic) {
        const staticResult = await this.getStaticMusicLibrary(limit);
        return {
          success: staticResult.success,
          message: 'Popular music loaded',
          results: staticResult.results.map(item => this.transformMusicItem(item)),
          total: staticResult.results.length,
          sources: ['Static Library']
        };
      }
      return {
        success: false,
        message: 'Query is required',
        results: []
      };
    }

    try {
      let allResults = [];
      let sources = [];

      // Get static results first if requested
      if (includeStatic && staticFirst) {
        const staticResult = await this.getOldStaticLibrary(null, query);
        if (staticResult.success && staticResult.results.length > 0) {
          allResults.push(...staticResult.results.map(item => ({
            ...this.transformMusicItem(item),
            isPriority: true,
            source: 'Popular'
          })));
          sources.push('Popular');
        }
      }

      // Get real-time results
      const realtimeResult = await this.searchMusicRealtime(query, limit);
      if (realtimeResult.success && realtimeResult.results.length > 0) {
        allResults.push(...realtimeResult.results.map(item => this.transformMusicItem(item)));
        sources.push('iTunes Search');
      }

      // Get static results after if not already added
      if (includeStatic && !staticFirst) {
        const staticResult = await this.getOldStaticLibrary(null, query);
        if (staticResult.success && staticResult.results.length > 0) {
          // Add static results that don't duplicate real-time results
          const realtimeTitles = new Set(
            realtimeResult.results.map(r => `${r.artist} - ${r.title}`.toLowerCase())
          );
          
          const uniqueStatic = staticResult.results.filter(item => {
            const key = `${item.artist} - ${item.title}`.toLowerCase();
            return !realtimeTitles.has(key);
          });

          allResults.push(...uniqueStatic.map(item => ({
            ...this.transformMusicItem(item),
            isPriority: true,
            source: 'Popular'
          })));
          
          if (uniqueStatic.length > 0) {
            sources.push('Popular');
          }
        }
      }

      // Remove duplicates and limit results
      const uniqueResults = [];
      const seen = new Set();
      
      for (const result of allResults) {
        const key = `${result.artist} - ${result.title}`.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          uniqueResults.push(result);
          if (uniqueResults.length >= limit) break;
        }
      }

      return {
        success: true,
        message: `Found ${uniqueResults.length} songs for "${query}"`,
        results: uniqueResults,
        total: uniqueResults.length,
        sources: sources,
        query: query
      };

    } catch (error) {
      console.error('Error in combined music search:', error);
      return {
        success: false,
        message: error.message || 'Search failed',
        results: []
      };
    }
  }

  // Get popular/trending music (combines static and some real-time)
  async getPopularMusic(limit = 20) {
    try {
      // Get static popular music first
      const staticResult = await this.getStaticMusicLibrary(limit);
      
      let results = [];
      if (staticResult.success) {
        results = staticResult.results.map(item => ({
          ...this.transformMusicItem(item),
          isPriority: true,
          source: 'Popular'
        }));
      }

      // If we have fewer than requested, try to get some trending searches
      if (results.length < limit) {
        const trendingQueries = ['Bad Bunny', 'Karol G', 'Morad', 'Rosalía', 'Feid'];
        
        for (const query of trendingQueries) {
          if (results.length >= limit) break;
          
          const searchResult = await this.searchMusicRealtime(query, 2);
          if (searchResult.success && searchResult.results.length > 0) {
            // Add first result if not already present
            const firstResult = searchResult.results[0];
            const key = `${firstResult.artist} - ${firstResult.title}`.toLowerCase();
            const exists = results.some(r => 
              `${r.artist} - ${r.title}`.toLowerCase() === key
            );
            
            if (!exists) {
              results.push({
                ...this.transformMusicItem(firstResult),
                isTrending: true,
                source: 'Trending'
              });
            }
          }
        }
      }

      return {
        success: true,
        message: 'Popular music loaded',
        results: results.slice(0, limit),
        total: results.length,
        sources: ['Popular', 'Trending']
      };

    } catch (error) {
      console.error('Error getting popular music:', error);
      return {
        success: false,
        message: error.message || 'Failed to load popular music',
        results: []
      };
    }
  }
}

// Export singleton instance
export const musicService = new MusicService();
export default musicService;