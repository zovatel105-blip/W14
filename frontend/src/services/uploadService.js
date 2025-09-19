const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

class UploadService {
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

  // Get auth headers for FormData (no Content-Type needed)
  getAuthHeadersFormData() {
    const token = localStorage.getItem('token');
    return {
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async uploadFile(file, type = 'general') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_type', type);

      const response = await fetch(`${this.baseURL}/upload`, {
        method: 'POST',
        headers: this.getAuthHeadersFormData(),
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Upload failed with status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  async uploadAvatar(file) {
    return this.uploadFile(file, 'avatar');
  }

  async uploadPollOption(file) {
    return this.uploadFile(file, 'poll_option');
  }

  async uploadBackground(file) {
    return this.uploadFile(file, 'poll_background');
  }
}

export default new UploadService();