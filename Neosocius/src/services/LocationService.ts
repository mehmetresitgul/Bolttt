import * as Location from 'expo-location';
import { LOCATION_UPDATE_INTERVAL, LOCATION_ACCURACY } from '../constants';
import { LocationData } from '../types';

class LocationService {
  private locationSubscription: Location.LocationSubscription | null = null;
  private isTracking = false;

  // Request location permissions
  async requestPermissions(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  }

  // Get current location
  async getCurrentLocation(): Promise<Location.LocationObject | null> {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      return location;
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  // Start location tracking
  async startLocationTracking(
    onLocationUpdate: (location: LocationData) => void,
    userId: string
  ): Promise<void> {
    if (this.isTracking) {
      return;
    }

    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error('Location permission denied');
    }

    this.isTracking = true;

    this.locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: LOCATION_UPDATE_INTERVAL,
        distanceInterval: LOCATION_ACCURACY,
      },
      (location) => {
        const locationData: LocationData = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          timestamp: location.timestamp,
          userId,
        };
        onLocationUpdate(locationData);
      }
    );
  }

  // Stop location tracking
  stopLocationTracking(): void {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }
    this.isTracking = false;
  }

  // Check if location tracking is active
  isLocationTracking(): boolean {
    return this.isTracking;
  }
}

export default new LocationService();