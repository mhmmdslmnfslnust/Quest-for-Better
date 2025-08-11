import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('habitquest_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // If the response has the standard format with data property, extract it
    if (response.data && response.data.success && response.data.data !== undefined) {
      return response.data.data;
    }
    // Otherwise return the full response data
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('habitquest_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (email, password) => api.post('/auth/login', { email, password }),
  verifyToken: () => api.get('/auth/verify'),
  getProfile: () => api.get('/auth/profile'),
  updatePreferences: (preferences) => api.put('/auth/preferences', preferences),
  deleteAccount: (password) => api.delete('/auth/account', { data: { password } }),
};

// Habits API
export const habitsAPI = {
  getAll: () => api.get('/habits'),
  getById: (id) => api.get(`/habits/${id}`),
  create: (habitData) => api.post('/habits', habitData),
  update: (id, habitData) => api.put(`/habits/${id}`, habitData),
  delete: (id) => api.delete(`/habits/${id}`),
  getTodayStatus: () => api.get('/habits/today'),
  getTodayHabitsStatus: () => api.get('/habits/today-status'),
  logCompletion: (id, logData) => api.post(`/habits/${id}/log`, logData),
  getLogs: (id, startDate, endDate) => api.get(`/habits/${id}/logs`, {
    params: { start_date: startDate, end_date: endDate }
  }),
  getByCategory: (category) => api.get(`/habits/category/${category}`),
};

// Achievements API
export const achievementsAPI = {
  getAll: () => api.get('/achievements'),
  getUserAchievements: () => api.get('/achievements/user'),
  checkAchievements: () => api.post('/achievements/check'),
  getProgress: () => api.get('/achievements/progress'),
};

// Challenges API
export const challengesAPI = {
  getAll: () => api.get('/challenges'),
  getTrending: (limit = 5) => api.get(`/challenges/trending?limit=${limit}`),
  getUserChallenges: () => api.get('/challenges/user'),
  join: (id) => api.post(`/challenges/${id}/join`),
  updateProgress: (id) => api.post(`/challenges/${id}/progress`),
  leave: (id) => api.delete(`/challenges/${id}/leave`),
  getLeaderboard: (id, limit = 20) => api.get(`/challenges/${id}/leaderboard?limit=${limit}`),
  getStats: (id) => api.get(`/challenges/${id}/stats`),
  getUserRank: (id) => api.get(`/challenges/${id}/rank`),
};

// Stats API
export const statsAPI = {
  getDashboard: () => api.get('/stats/dashboard'),
  getHabits: (period = '30') => api.get('/stats/habits', { params: { period } }),
  getStreaks: () => api.get('/stats/streaks'),
  getLeaderboard: (type = 'points', period = 'all') => api.get('/stats/leaderboard', {
    params: { type, period }
  }),
};

// Utility functions
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString();
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  const now = new Date();
  const target = new Date(date);
  const diffMs = now - target;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

export const categoryIcons = {
  health: '🏥',
  fitness: '💪',
  nutrition: '🥗',
  productivity: '⚡',
  social: '👥',
  mindfulness: '🧘',
  learning: '📚',
  creativity: '🎨',
  other: '🎯'
};

export const categoryColors = {
  health: '#ef4444',
  fitness: '#f97316',
  nutrition: '#10b981',
  productivity: '#6366f1',
  social: '#8b5cf6',
  mindfulness: '#06b6d4',
  learning: '#3b82f6',
  creativity: '#ec4899',
  other: '#6b7280'
};

export default api;
