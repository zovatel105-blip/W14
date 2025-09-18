import AppConfig from '../config/config';

class FeedMenuService {
  constructor() {
    this.baseURL = AppConfig.BACKEND_URL;
  }

  async makeRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const url = `${this.baseURL}${endpoint}`;
    
    console.log('🌐 FeedMenuService: Making request:', {
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
      console.log('🚀 FeedMenuService: Sending fetch request...');
      const response = await fetch(url, config);
      
      console.log('📡 FeedMenuService: Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ FeedMenuService: Error response body:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { detail: errorText };
        }
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('✅ FeedMenuService: Success response:', responseData);
      return responseData;
    } catch (error) {
      console.error(`❌ FeedMenuService: Request failed [${endpoint}]:`, error);
      console.error('❌ FeedMenuService: Error details:', {
        message: error.message,
        stack: error.stack,
        url,
        hasToken: !!token
      });
      throw error;
    }
  }

  async markNotInterested(pollId) {
    return this.makeRequest(`/api/feed/not-interested?poll_id=${encodeURIComponent(pollId)}`, {
      method: 'POST'
    });
  }

  async hideUser(authorId) {
    return this.makeRequest(`/api/feed/hide-user?author_id=${encodeURIComponent(authorId)}`, {
      method: 'POST'
    });
  }

  async toggleNotifications(authorId) {
    return this.makeRequest(`/api/feed/toggle-notifications?author_id=${encodeURIComponent(authorId)}`, {
      method: 'POST'
    });
  }

  async reportContent(pollId, reportData) {
    return this.makeRequest('/api/feed/report', {
      method: 'POST',
      body: JSON.stringify({
        poll_id: pollId,
        category: reportData.category,
        comment: reportData.comment,
        reportedBy: reportData.reportedBy,
        pollAuthor: reportData.pollAuthor,
        timestamp: reportData.timestamp
      })
    });
  }

  async getUserPreferences() {
    return this.makeRequest('/api/feed/user-preferences', {
      method: 'GET'
    });
  }
}

const feedMenuService = new FeedMenuService();
export default feedMenuService;