export const COLORS = {
  primary: '#1a1a2e',
  secondary: '#16213e',
  accent: '#0f3460',
  highlight: '#e94560',
  background: '#0f0f23',
  surface: '#1a1a2e',
  text: '#ffffff',
  textSecondary: '#b0b0b0',
  success: '#4CAF50',
  error: '#f44336',
  warning: '#ff9800',
  info: '#2196F3',
};

export const TOMTOM_API_KEY = 'AjYSY8C3wy4MSQX12suCGK9UCmi6XcpB';

export const MAP_CONFIG = {
  initialRegion: {
    latitude: 41.0082, // İstanbul
    longitude: 28.9784,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  heatmapRadius: 50,
  heatmapOpacity: 0.7,
  updateInterval: 30000, // 30 saniye
};

export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_DATA: 'user_data',
  LAST_LOCATION: 'last_location',
};

export const API_ENDPOINTS = {
  BASE_URL: 'https://api.neosocius.com', // Örnek API URL
  AUTH: '/auth',
  LOCATION: '/location',
  HEATMAP: '/heatmap',
};