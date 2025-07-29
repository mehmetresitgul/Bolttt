import * as Location from 'expo-location';
import { Location as LocationType, HeatmapPoint } from '../types';
import { MAP_CONFIG } from '../constants';

export const locationUtils = {
  // Konum izni iste
  async requestLocationPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  },

  // Mevcut konumu al
  async getCurrentLocation(): Promise<LocationType | null> {
    try {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        throw new Error('Location permission denied');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: location.timestamp,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  },

  // Konum takibi başlat
  async startLocationTracking(
    onLocationUpdate: (location: LocationType) => void
  ): Promise<() => void> {
    try {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        throw new Error('Location permission denied');
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: MAP_CONFIG.updateInterval,
          distanceInterval: 10,
        },
        (location) => {
          const locationData: LocationType = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: location.timestamp,
          };
          onLocationUpdate(locationData);
        }
      );

      return () => {
        subscription.remove();
      };
    } catch (error) {
      console.error('Error starting location tracking:', error);
      return () => {};
    }
  },

  // İki nokta arasındaki mesafeyi hesapla (Haversine formülü)
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Dünya'nın yarıçapı (km)
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // km cinsinden
    return distance;
  },

  // Dereceyi radyana çevir
  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  },

  // Heatmap verilerini oluştur (simüle edilmiş)
  generateHeatmapData(
    centerLat: number,
    centerLon: number,
    radius: number = 5
  ): HeatmapPoint[] {
    const points: HeatmapPoint[] = [];
    const numPoints = Math.floor(Math.random() * 50) + 20; // 20-70 arası rastgele nokta

    for (let i = 0; i < numPoints; i++) {
      // Rastgele konum oluştur
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * radius;
      
      const lat = centerLat + (distance * Math.cos(angle)) / 111; // 1 derece ≈ 111 km
      const lon = centerLon + (distance * Math.sin(angle)) / (111 * Math.cos(centerLat * Math.PI / 180));
      
      // Yoğunluk değeri (0-1 arası)
      const intensity = Math.random() * 0.8 + 0.2;

      points.push({
        latitude: lat,
        longitude: lon,
        intensity,
      });
    }

    return points;
  },

  // Bölgeyi güncelle
  updateRegion(
    currentRegion: any,
    newLat: number,
    newLon: number
  ): any {
    return {
      latitude: newLat,
      longitude: newLon,
      latitudeDelta: currentRegion.latitudeDelta,
      longitudeDelta: currentRegion.longitudeDelta,
    };
  },
};