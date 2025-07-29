// TomTom API Configuration
export const TOMTOM_API_KEY = 'AjYSY8C3wy4MSQX12suCGK9UCmi6XcpB';
export const TOMTOM_BASE_URL = 'https://api.tomtom.com';

// App Configuration
export const APP_NAME = 'Neosocius';
export const APP_VERSION = '1.0.0';

// Map Configuration
export const DEFAULT_REGION = {
  latitude: 41.0082, // Istanbul coordinates
  longitude: 28.9784,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export const HEATMAP_COLORS = {
  low: '#0000FF',    // Blue for low density
  medium: '#00FF00', // Green for medium density
  high: '#FFFF00',   // Yellow for high density
  veryHigh: '#FF0000', // Red for very high density
};

// Location Update Configuration
export const LOCATION_UPDATE_INTERVAL = 30000; // 30 seconds
export const LOCATION_ACCURACY = 10; // meters

// Storage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_DATA: 'user_data',
  ANONYMOUS_ID: 'anonymous_id',
};

// API Endpoints (for future backend integration)
export const API_ENDPOINTS = {
  AUTH: '/auth',
  LOCATION: '/location',
  HEATMAP: '/heatmap',
};