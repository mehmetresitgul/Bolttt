import { HeatmapPoint } from '../types';
import { HEATMAP_COLORS } from '../constants';

// Generate a random anonymous ID
export const generateAnonymousId = (): string => {
  return 'anon_' + Math.random().toString(36).substr(2, 9);
};

// Calculate distance between two points
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Generate heatmap data from location points
export const generateHeatmapData = (
  locations: Array<{ latitude: number; longitude: number }>,
  radius: number = 0.01 // ~1km radius
): HeatmapPoint[] => {
  const heatmapPoints: HeatmapPoint[] = [];
  
  locations.forEach((location, index) => {
    // Add the main point
    heatmapPoints.push({
      latitude: location.latitude,
      longitude: location.longitude,
      intensity: 1,
    });
    
    // Add surrounding points for better heatmap visualization
    for (let i = 0; i < 3; i++) {
      const angle = (i * 120) * Math.PI / 180;
      const distance = radius * (0.3 + Math.random() * 0.7);
      
      heatmapPoints.push({
        latitude: location.latitude + distance * Math.cos(angle),
        longitude: location.longitude + distance * Math.sin(angle),
        intensity: 0.3 + Math.random() * 0.4,
      });
    }
  });
  
  return heatmapPoints;
};

// Get color based on intensity
export const getHeatmapColor = (intensity: number): string => {
  if (intensity < 0.25) return HEATMAP_COLORS.low;
  if (intensity < 0.5) return HEATMAP_COLORS.medium;
  if (intensity < 0.75) return HEATMAP_COLORS.high;
  return HEATMAP_COLORS.veryHigh;
};

// Format timestamp
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};