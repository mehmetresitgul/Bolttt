import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MapView, { Region, Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import CustomButton from '../components/CustomButton';
import HeatmapOverlay from '../components/HeatmapOverlay';
import LocationService from '../services/LocationService';
import MapService from '../services/MapService';
import AuthService from '../services/AuthService';
import { DEFAULT_REGION, HEATMAP_COLORS } from '../constants';
import { HeatmapPoint, LocationData, User } from '../types';

interface MapScreenProps {
  navigation: any;
}

const MapScreen: React.FC<MapScreenProps> = ({ navigation }) => {
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTracking, setIsTracking] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setIsLoading(true);
      
      // Initialize services
      MapService.initialize();
      
      // Get current user
      const user = AuthService.getCurrentUser();
      setCurrentUser(user);
      
      // Request location permissions and get current location
      const hasPermission = await LocationService.requestPermissions();
      if (hasPermission) {
        const location = await LocationService.getCurrentLocation();
        if (location) {
          setUserLocation(location);
          const newRegion = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };
          setRegion(newRegion);
          
          // Add user location to map service
          const locationData: LocationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: location.timestamp,
            userId: user?.id || 'unknown',
          };
          MapService.addUserLocation(locationData);
        }
      }
      
      // Get heatmap data
      const heatmap = MapService.getHeatmapData();
      setHeatmapData(heatmap);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to initialize app');
    } finally {
      setIsLoading(false);
    }
  };

  const startLocationTracking = async () => {
    if (!currentUser) return;
    
    try {
      await LocationService.startLocationTracking(
        (locationData: LocationData) => {
          // Update user location
          setUserLocation({
            coords: {
              latitude: locationData.latitude,
              longitude: locationData.longitude,
              altitude: null,
              accuracy: 10,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
            },
            timestamp: locationData.timestamp,
          });
          
          // Add to map service
          MapService.addUserLocation(locationData);
          
          // Update heatmap
          const newHeatmap = MapService.getHeatmapData();
          setHeatmapData(newHeatmap);
        },
        currentUser.id
      );
      setIsTracking(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to start location tracking');
    }
  };

  const stopLocationTracking = () => {
    LocationService.stopLocationTracking();
    setIsTracking(false);
  };

  const handleSignOut = async () => {
    try {
      LocationService.stopLocationTracking();
      await AuthService.signOut();
      navigation.replace('Auth');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const centerOnUserLocation = () => {
    if (userLocation && mapRef.current) {
      const newRegion = {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      mapRef.current.animateToRegion(newRegion, 1000);
    }
  };

  const onRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onRegionChangeComplete={onRegionChangeComplete}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        mapType="standard"
      >
        <HeatmapOverlay points={heatmapData} mapRegion={region} />
        
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            }}
            title="Your Location"
            description="You are here"
            pinColor="#007AFF"
          />
        )}
      </MapView>

      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.4)']}
          style={styles.headerGradient}
        >
          <Text style={styles.headerTitle}>Neosocius</Text>
          <Text style={styles.headerSubtitle}>
            {isTracking ? 'Tracking active' : 'Tracking inactive'}
          </Text>
        </LinearGradient>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={centerOnUserLocation}
        >
          <Text style={styles.controlButtonText}>📍</Text>
        </TouchableOpacity>
        
        <CustomButton
          title={isTracking ? 'Stop Tracking' : 'Start Tracking'}
          onPress={isTracking ? stopLocationTracking : startLocationTracking}
          variant={isTracking ? 'secondary' : 'primary'}
          size="small"
          style={styles.trackingButton}
        />
        
        <CustomButton
          title="Sign Out"
          onPress={handleSignOut}
          variant="outline"
          size="small"
          style={styles.signOutButton}
        />
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.6)']}
          style={styles.legendGradient}
        >
          <Text style={styles.legendTitle}>Density Legend</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: HEATMAP_COLORS.low }]} />
              <Text style={styles.legendText}>Low</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: HEATMAP_COLORS.medium }]} />
              <Text style={styles.legendText}>Medium</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: HEATMAP_COLORS.high }]} />
              <Text style={styles.legendText}>High</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: HEATMAP_COLORS.veryHigh }]} />
              <Text style={styles.legendText}>Very High</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8E8E93',
  },
  map: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  controls: {
    position: 'absolute',
    top: 120,
    right: 20,
    alignItems: 'center',
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 12,
  },
  controlButtonText: {
    fontSize: 20,
  },
  trackingButton: {
    marginBottom: 8,
  },
  signOutButton: {
    marginBottom: 8,
  },
  legend: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  legendGradient: {
    borderRadius: 12,
    padding: 16,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendItem: {
    alignItems: 'center',
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
});

export default MapScreen;