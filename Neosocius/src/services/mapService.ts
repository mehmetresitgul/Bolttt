import { HeatmapPoint, Location } from '../types';
import { TOMTOM_API_KEY, API_ENDPOINTS } from '../constants';
import { locationUtils } from '../utils/location';

export const mapService = {
  // Heatmap verilerini al (simüle edilmiş)
  async getHeatmapData(region: any): Promise<HeatmapPoint[]> {
    try {
      // Gerçek uygulamada bu veriler backend'den gelecek
      // Şimdilik simüle edilmiş veriler döndürüyoruz
      const centerLat = region.latitude;
      const centerLon = region.longitude;
      
      return locationUtils.generateHeatmapData(centerLat, centerLon, 5);
    } catch (error) {
      console.error('Error getting heatmap data:', error);
      return [];
    }
  },

  // Kullanıcı konumunu gönder
  async sendUserLocation(location: Location, userId: string): Promise<boolean> {
    try {
      // Gerçek uygulamada bu veriler backend'e gönderilecek
      console.log('Sending user location:', { location, userId });
      
      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return true;
    } catch (error) {
      console.error('Error sending user location:', error);
      return false;
    }
  },

  // TomTom Maps API ile geocoding
  async geocodeAddress(address: string): Promise<{ lat: number; lon: number } | null> {
    try {
      const response = await fetch(
        `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(address)}.json?key=${TOMTOM_API_KEY}&limit=1`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding failed');
      }

      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return {
          lat: result.position.lat,
          lon: result.position.lon,
        };
      }

      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  },

  // Reverse geocoding
  async reverseGeocode(lat: number, lon: number): Promise<string | null> {
    try {
      const response = await fetch(
        `https://api.tomtom.com/search/2/reverseGeocode/${lat},${lon}.json?key=${TOMTOM_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Reverse geocoding failed');
      }

      const data = await response.json();
      
      if (data.addresses && data.addresses.length > 0) {
        const address = data.addresses[0];
        return address.address.freeformAddress || null;
      }

      return null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  },

  // Yakındaki popüler yerleri al
  async getNearbyPlaces(lat: number, lon: number, radius: number = 5000): Promise<any[]> {
    try {
      const response = await fetch(
        `https://api.tomtom.com/search/2/nearbySearch/.json?key=${TOMTOM_API_KEY}&lat=${lat}&lon=${lon}&radius=${radius}&limit=20`
      );
      
      if (!response.ok) {
        throw new Error('Nearby search failed');
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error getting nearby places:', error);
      return [];
    }
  },

  // Harita stilini al
  getMapStyle(): string {
    // TomTom Maps için özel stil
    return 'https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.15.0/maps/maps-sdk-maps.css';
  },

  // Heatmap renklerini al
  getHeatmapColors(): string[] {
    return [
      'rgba(0, 0, 255, 0.3)',   // Mavi (düşük yoğunluk)
      'rgba(0, 255, 0, 0.5)',   // Yeşil
      'rgba(255, 255, 0, 0.7)', // Sarı
      'rgba(255, 165, 0, 0.8)', // Turuncu
      'rgba(255, 0, 0, 0.9)',   // Kırmızı (yüksek yoğunluk)
    ];
  },
};