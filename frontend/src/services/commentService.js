/**
 * Comment Service - Handles all comment-related API calls
 * Connects with real backend instead of mock data
 */

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

class CommentService {
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

  // Get comments for a poll
  async getComments(pollId, limit = 20, offset = 0) {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });

      const response = await fetch(`${this.baseURL}/polls/${pollId}/comments?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  // Add a new comment
  async addComment(pollId, content, parentId = null) {
    try {
      const commentData = {
        content,
        ...(parentId && { parent_id: parentId })
      };

      const response = await fetch(`${this.baseURL}/polls/${pollId}/comments`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(commentData),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  // Update a comment
  async updateComment(commentId, content) {
    try {
      const response = await fetch(`${this.baseURL}/comments/${commentId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ content }),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  }

  // Delete a comment
  async deleteComment(commentId) {
    try {
      const response = await fetch(`${this.baseURL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }

  // Toggle like on a comment
  async toggleCommentLike(commentId) {
    try {
      const response = await fetch(`${this.baseURL}/comments/${commentId}/like`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error toggling comment like:', error);
      throw error;
    }
  }

  // Transform backend comment data to frontend format
  transformCommentData(backendComment) {
    return {
      id: backendComment.id,
      content: backendComment.content,
      author: {
        id: backendComment.author.id,
        username: backendComment.author.username,
        displayName: backendComment.author.display_name,
        avatar: backendComment.author.avatar_url,
        verified: backendComment.author.is_verified
      },
      timeAgo: backendComment.time_ago,
      likes: backendComment.likes,
      userLiked: backendComment.user_liked,
      replies: backendComment.replies ? backendComment.replies.map(reply => this.transformCommentData(reply)) : [],
      parentId: backendComment.parent_id,
      createdAt: backendComment.created_at,
      updatedAt: backendComment.updated_at
    };
  }

  // Get comments in the format expected by the frontend components
  async getCommentsForFrontend(pollId, limit = 20, offset = 0) {
    try {
      const backendComments = await this.getComments(pollId, limit, offset);
      return backendComments.map(comment => this.transformCommentData(comment));
    } catch (error) {
      console.error('Error fetching comments for frontend:', error);
      // Return empty array on error to prevent app crashes
      return [];
    }
  }

  // Add comment and return in frontend format
  async addCommentForFrontend(pollId, content, parentId = null) {
    try {
      const backendComment = await this.addComment(pollId, content, parentId);
      return this.transformCommentData(backendComment);
    } catch (error) {
      console.error('Error adding comment for frontend:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const commentService = new CommentService();
export default commentService;