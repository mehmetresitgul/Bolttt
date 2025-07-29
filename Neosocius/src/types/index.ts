export interface User {
  id: string;
  email: string;
  isAnonymous: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface HeatmapPoint {
  latitude: number;
  longitude: number;
  intensity: number;
}

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface MapState {
  region: MapRegion;
  heatmapData: HeatmapPoint[];
  isLoading: boolean;
  error: string | null;
}