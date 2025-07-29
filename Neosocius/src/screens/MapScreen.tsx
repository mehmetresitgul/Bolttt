import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import MapView, { Region, Marker, Circle } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, MAP_CONFIG } from '../constants';
import { locationUtils } from '../utils/location';
import { mapService } from '../services/mapService';
import { authService } from '../services/authService';
import { User, Location, HeatmapPoint, MapRegion } from '../types';

interface MapScreenProps {
  user: User;
  onLogout: () => void;
}

const { width, height } = Dimensions.get('window');

export const MapScreen: React.FC<MapScreenProps> = ({ user, onLogout }) => {
  const [region, setRegion] = useState<MapRegion>(MAP_CONFIG.initialRegion);
  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([]);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTracking, setIsTracking] = useState(false);
  const mapRef = useRef<MapView>(null);
  const locationSubscriptionRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    initializeMap();
    return () => {
      if (locationSubscriptionRef.current) {
        locationSubscriptionRef.current();
      }
    };
  }, []);

  const initializeMap = async () => {
    try {
      setIsLoading(true);
      
      // Kullanıcının konumunu al
      const currentLocation = await locationUtils.getCurrentLocation();
      if (currentLocation) {
        setUserLocation(currentLocation);
        
        // Harita bölgesini güncelle
        const newRegion = {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(newRegion);
        
        // Heatmap verilerini al
        await loadHeatmapData(newRegion);
        
        // Konum takibini başlat
        startLocationTracking();
      } else {
        // Konum alınamadıysa varsayılan bölgeyi kullan
        await loadHeatmapData(region);
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      Alert.alert('Hata', 'Harita yüklenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadHeatmapData = async (mapRegion: MapRegion) => {
    try {
      const data = await mapService.getHeatmapData(mapRegion);
      setHeatmapData(data);
    } catch (error) {
      console.error('Error loading heatmap data:', error);
    }
  };

  const startLocationTracking = async () => {
    try {
      const unsubscribe = await locationUtils.startLocationTracking(
        async (newLocation) => {
          setUserLocation(newLocation);
          
          // Kullanıcı konumunu backend'e gönder
          if (user.id) {
            await mapService.sendUserLocation(newLocation, user.id);
          }
          
          // Harita bölgesini güncelle
          const newRegion = {
            ...region,
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
          };
          setRegion(newRegion);
          
          // Heatmap verilerini güncelle
          await loadHeatmapData(newRegion);
        }
      );
      
      locationSubscriptionRef.current = unsubscribe;
      setIsTracking(true);
    } catch (error) {
      console.error('Error starting location tracking:', error);
    }
  };

  const handleRegionChange = async (newRegion: Region) => {
    setRegion(newRegion);
    await loadHeatmapData(newRegion);
  };

  const handleMyLocationPress = async () => {
    try {
      const currentLocation = await locationUtils.getCurrentLocation();
      if (currentLocation && mapRef.current) {
        const newRegion = {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        
        mapRef.current.animateToRegion(newRegion, 1000);
        setRegion(newRegion);
        await loadHeatmapData(newRegion);
      }
    } catch (error) {
      console.error('Error moving to my location:', error);
      Alert.alert('Hata', 'Konumunuza gidilemedi.');
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      onLogout();
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu.');
    }
  };

  const getHeatmapColor = (intensity: number): string => {
    if (intensity < 0.3) return 'rgba(0, 0, 255, 0.3)'; // Mavi
    if (intensity < 0.5) return 'rgba(0, 255, 0, 0.5)'; // Yeşil
    if (intensity < 0.7) return 'rgba(255, 255, 0, 0.7)'; // Sarı
    if (intensity < 0.9) return 'rgba(255, 165, 0, 0.8)'; // Turuncu
    return 'rgba(255, 0, 0, 0.9)'; // Kırmızı
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.highlight} />
        <Text style={styles.loadingText}>Harita yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onRegionChangeComplete={handleRegionChange}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        mapType="standard"
      >
        {/* Heatmap noktaları */}
        {heatmapData.map((point, index) => (
          <Circle
            key={`heatmap-${index}`}
            center={{
              latitude: point.latitude,
              longitude: point.longitude,
            }}
            radius={MAP_CONFIG.heatmapRadius}
            fillColor={getHeatmapColor(point.intensity)}
            strokeColor="transparent"
            strokeWidth={0}
          />
        ))}
      </MapView>

      {/* Üst bilgi çubuğu */}
      <LinearGradient
        colors={['rgba(26, 26, 46, 0.9)', 'rgba(26, 26, 46, 0.7)']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>Neosocius</Text>
          <Text style={styles.subtitle}>
            {isTracking ? 'Canlı yoğunluk' : 'Yoğunluk haritası'}
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Çıkış</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Konum butonu */}
      <TouchableOpacity style={styles.locationButton} onPress={handleMyLocationPress}>
        <Text style={styles.locationButtonText}>📍</Text>
      </TouchableOpacity>

      {/* Bilgi paneli */}
      <View style={styles.infoPanel}>
        <Text style={styles.infoTitle}>Yoğunluk Seviyeleri</Text>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'rgba(0, 0, 255, 0.3)' }]} />
            <Text style={styles.legendText}>Sakin</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'rgba(0, 255, 0, 0.5)' }]} />
            <Text style={styles.legendText}>Normal</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'rgba(255, 255, 0, 0.7)' }]} />
            <Text style={styles.legendText}>Yoğun</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'rgba(255, 0, 0, 0.9)' }]} />
            <Text style={styles.legendText}>Çok Yoğun</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    color: COLORS.text,
    fontSize: 16,
    marginTop: 10,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  locationButton: {
    position: 'absolute',
    bottom: 200,
    right: 20,
    backgroundColor: COLORS.highlight,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  locationButtonText: {
    fontSize: 20,
  },
  infoPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    alignItems: 'center',
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 5,
  },
  legendText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
});