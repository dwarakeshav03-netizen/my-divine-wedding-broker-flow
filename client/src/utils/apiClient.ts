// API Client Service for Divine Matrimony Backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.accessToken = localStorage.getItem('mdm_accessToken');
    this.refreshToken = localStorage.getItem('mdm_refreshToken');
  }

  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('mdm_accessToken', accessToken);
    localStorage.setItem('mdm_refreshToken', refreshToken);
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('mdm_accessToken');
    localStorage.removeItem('mdm_refreshToken');
    localStorage.removeItem('mdm_userId');
    localStorage.removeItem('mdm_userRole');
  }

  async request(method, endpoint, data = null, customHeaders = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const options = {
      method,
      headers
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);

      // Handle token expiration
      if (response.status === 403) {
        const errorData = await response.json();
        if (errorData.message.includes('expired')) {
          await this.refreshAccessToken();
          // Retry request with new token
          return this.request(method, endpoint, data, customHeaders);
        }
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error);
      throw error;
    }
  }

  async refreshAccessToken() {
    try {
      const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken })
      });

      if (!response.ok) {
        this.clearTokens();
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }

      const data = await response.json();
      this.accessToken = data.data.accessToken;
      localStorage.setItem('mdm_accessToken', this.accessToken);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
      return false;
    }
  }

  // ============ AUTH ENDPOINTS ============

  register(userData) {
    return this.request('POST', '/auth/register', userData);
  }

  login(email, password) {
    return this.request('POST', '/auth/login', { email, password });
  }

  logout() {
    const data = { refreshToken: this.refreshToken };
    this.clearTokens();
    return this.request('POST', '/auth/logout', data);
  }

  getCurrentUser() {
    return this.request('GET', '/auth/me');
  }

  // ============ PROFILE ENDPOINTS ============

  createProfile(profileData) {
    return this.request('POST', '/profiles', profileData);
  }

  updateProfile(profileData) {
    return this.request('PUT', '/profiles', profileData);
  }

  getMyProfile() {
    return this.request('GET', '/profiles/me');
  }

  getProfileById(profileId) {
    return this.request('GET', `/profiles/${profileId}`);
  }

  searchProfiles(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request('GET', `/profiles/search?${queryParams}`);
  }

  // ============ CONNECTION ENDPOINTS ============

  getConnections(status = 'pending') {
    return this.request('GET', `/connections?status=${status}`);
  }

  sendConnectionRequest(receiverId) {
    return this.request('POST', '/connections/send', { receiverId });
  }

  acceptConnection(connectionId) {
    return this.request('PUT', `/connections/${connectionId}/accept`);
  }

  rejectConnection(connectionId) {
    return this.request('PUT', `/connections/${connectionId}/reject`);
  }
}

export default new APIClient();
