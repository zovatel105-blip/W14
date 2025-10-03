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

  // Generate video thumbnail
  generateVideoThumbnail(videoFile, timeOffset = 1) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      video.onloadedmetadata = () => {
        // Set canvas size to match video aspect ratio
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Seek to specified time
        video.currentTime = Math.min(timeOffset, video.duration);
      };
      
      video.onseeked = () => {
        try {
          // Draw video frame to canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convert to blob
          canvas.toBlob((blob) => {
            if (blob) {
              resolve({
                blob,
                url: canvas.toDataURL('image/jpeg', 0.8),
                width: canvas.width,
                height: canvas.height
              });
            } else {
              reject(new Error('Failed to generate thumbnail'));
            }
          }, 'image/jpeg', 0.8);
        } catch (error) {
          reject(error);
        }
      };
      
      video.onerror = () => {
        reject(new Error('Failed to load video'));
      };
      
      // Load video
      video.src = URL.createObjectURL(videoFile);
      video.load();
    });
  }

  // Validate file with better video/image detection
  validateFile(file, options = {}) {
    const {
      maxSize = 50 * 1024 * 1024, // 50MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'],
      maxDuration = 60, // seconds for videos
    } = options;

    const errors = [];

    // Check file size
    if (file.size > maxSize) {
      errors.push(`El archivo es demasiado grande (máximo ${Math.round(maxSize / 1024 / 1024)}MB)`);
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push('Tipo de archivo no permitido');
    }

    // For videos, we'll validate duration after upload
    const isVideo = file.type.startsWith('video/');
    
    return {
      isValid: errors.length === 0,
      errors,
      isVideo,
      isImage: file.type.startsWith('image/')
    };
  }

  // Get optimized public URL with transformations
  getPublicUrl(path, options = {}) {
    if (!path) return null;
    
    const {
      width,
      height,
      quality = 80,
      format = 'auto'
    } = options;
    
    // If it's already a full URL, return as-is
    if (path.startsWith('http')) {
      return path;
    }
    
    // Build transformation parameters
    const params = new URLSearchParams();
    if (width) params.set('w', width);
    if (height) params.set('h', height);
    if (quality !== 80) params.set('q', quality);
    if (format !== 'auto') params.set('f', format);
    
    const queryString = params.toString();
    const separator = queryString ? '?' : '';
    
    return `${BACKEND_URL}${path}${separator}${queryString}`;
  }
}

export default new UploadService();