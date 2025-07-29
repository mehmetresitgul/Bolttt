import { TOMTOM_API_KEY, TOMTOM_BASE_URL } from '../constants';
import { HeatmapPoint, LocationData } from '../types';
import { generateHeatmapData } from '../utils';

class MapService {
  private mockLocations: LocationData[] = [];
  private isInitialized = false;

  // Initialize map service with mock data
  initialize(): void {
    if (this.isInitialized) return;

    // Generate mock location data for demonstration
    this.generateMockData();
    this.isInitialized = true;
  }

  // Generate mock location data
  private generateMockData(): void {
    const baseLat = 41.0082; // Istanbul
    const baseLon = 28.9784;
    
    // Generate random locations around Istanbul
    for (let i = 0; i < 50; i++) {
      const lat = baseLat + (Math.random() - 0.5) * 0.1;
      const lon = baseLon + (Math.random() - 0.5) * 0.1;
      
      this.mockLocations.push({
        latitude: lat,
        longitude: lon,
        timestamp: Date.now() - Math.random() * 3600000, // Random time in last hour
        userId: `mock_user_${i}`,
      });
    }
  }

  // Get heatmap data
  getHeatmapData(): HeatmapPoint[] {
    const locations = this.mockLocations.map(loc => ({
      latitude: loc.latitude,
      longitude: loc.longitude,
    }));
    
    return generateHeatmapData(locations);
  }

  // Add user location to the map
  addUserLocation(location: LocationData): void {
    this.mockLocations.push(location);
    
    // Keep only recent locations (last 24 hours)
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    this.mockLocations = this.mockLocations.filter(
      loc => loc.timestamp > oneDayAgo
    );
  }

  // Get nearby locations
  getNearbyLocations(
    latitude: number,
    longitude: number,
    radiusKm: number = 5
  ): LocationData[] {
    return this.mockLocations.filter(location => {
      const distance = this.calculateDistance(
        latitude,
        longitude,
        location.latitude,
        location.longitude
      );
      return distance <= radiusKm;
    });
  }

  // Calculate distance between two points
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Get TomTom map URL with API key
  getTomTomMapUrl(latitude: number, longitude: number, zoom: number = 12): string {
    return `${TOMTOM_BASE_URL}/map/1/staticimage?layer=basic&style=main&format=png&zoom=${zoom}&center=${longitude},${latitude}&width=512&height=512&key=${TOMTOM_API_KEY}`;
  }

  // Get traffic data (for future implementation)
  async getTrafficData(latitude: number, longitude: number): Promise<any> {
    try {
      const response = await fetch(
        `${TOMTOM_BASE_URL}/traffic/services/4/flowSegmentData/absolute/10/json?point=${latitude},${longitude}&unit=KMPH&key=${TOMTOM_API_KEY}`
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching traffic data:', error);
      return null;
    }
  }

  // Get POI data (for future implementation)
  async getPOIData(latitude: number, longitude: number, radius: number = 1000): Promise<any> {
    try {
      const response = await fetch(
        `${TOMTOM_BASE_URL}/search/2/nearbySearch/.json?key=${TOMTOM_API_KEY}&lat=${latitude}&lon=${longitude}&radius=${radius}&limit=50`
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching POI data:', error);
      return null;
    }
  }
}

export default new MapService();