/**
 * Upload Service - Handles all file upload operations
 */

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

class UploadService {
  constructor() {
    this.baseURL = `${BACKEND_URL}/api`;
  }

  // Get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Handle API errors
  async handleResponse(response) {
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { detail: errorText };
      }
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Upload file with progress tracking
  async uploadFile(file, uploadType = 'general', onProgress = null) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_type', uploadType);

      // Create XHR for progress tracking
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        // Progress tracking
        if (onProgress) {
          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              const progress = Math.round((e.loaded / e.total) * 100);
              onProgress(progress);
            }
          });
        }

        // Success handler
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (e) {
              reject(new Error('Invalid response format'));
            }
          } else {
            try {
              const errorResponse = JSON.parse(xhr.responseText);
              reject(new Error(errorResponse.detail || `Upload failed: ${xhr.status}`));
            } catch {
              reject(new Error(`Upload failed: ${xhr.status}`));
            }
          }
        });

        // Error handler
        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed due to network error'));
        });

        // Abort handler
        xhr.addEventListener('abort', () => {
          reject(new Error('Upload was cancelled'));
        });

        // Setup and send request
        xhr.open('POST', `${this.baseURL}/upload`);
        
        // Add auth header
        const authHeaders = this.getAuthHeaders();
        Object.entries(authHeaders).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });
        
        xhr.send(formData);
      });
      
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  // Get file info by ID
  async getFileInfo(fileId) {
    try {
      const response = await fetch(`${this.baseURL}/upload/${fileId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error getting file info:', error);
      throw error;
    }
  }

  // Delete uploaded file
  async deleteFile(fileId) {
    try {
      const response = await fetch(`${this.baseURL}/upload/${fileId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  // Get user's uploaded files
  async getUserFiles(uploadType = null, limit = 20, offset = 0) {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });

      if (uploadType) {
        params.append('upload_type', uploadType);
      }

      const response = await fetch(`${this.baseURL}/uploads/user?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error getting user files:', error);
      throw error;
    }
  }

  // Get public URL for file
  getPublicUrl(publicUrl) {
    // Always prepend BACKEND_URL to API paths
    if (publicUrl && publicUrl.startsWith('/api/uploads/')) {
      return `${BACKEND_URL}${publicUrl}`;
    }
    // Legacy support for old /uploads/ paths - convert to API format
    if (publicUrl && publicUrl.startsWith('/uploads/')) {
      return `${BACKEND_URL}/api${publicUrl}`;
    }
    // If already absolute, return as is
    if (publicUrl && publicUrl.startsWith('http')) {
      return publicUrl;
    }
    // Default fallback
    return publicUrl;
  }

  // Validate file before upload
  validateFile(file, options = {}) {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/mov'],
      allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'mov']
    } = options;

    const errors = [];

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size too large. Maximum: ${Math.round(maxSize / (1024 * 1024))}MB`);
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type not supported. Allowed: ${allowedTypes.join(', ')}`);
    }

    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !allowedExtensions.includes(extension)) {
      errors.push(`File extension not supported. Allowed: ${allowedExtensions.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get file type from file
  getFileType(file) {
    if (file.type.startsWith('image/')) {
      return 'image';
    } else if (file.type.startsWith('video/')) {
      return 'video';
    }
    return 'unknown';
  }

  // Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Export singleton instance
export const uploadService = new UploadService();
export default uploadService;