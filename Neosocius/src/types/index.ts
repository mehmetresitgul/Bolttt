export interface User {
  id: string;
  email: string;
  isAnonymous: boolean;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: number;
  userId: string;
}

export interface HeatmapPoint {
  latitude: number;
  longitude: number;
  intensity: number;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface MapState {
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;
  heatmapData: HeatmapPoint[];
  isLoading: boolean;
}

export type RootStackParamList = {
  Auth: undefined;
  Map: undefined;
};