import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HeatmapPoint } from '../types';
import { getHeatmapColor } from '../utils';

interface HeatmapOverlayProps {
  points: HeatmapPoint[];
  mapRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

const HeatmapOverlay: React.FC<HeatmapOverlayProps> = ({ points, mapRegion }) => {
  const getPointStyle = (point: HeatmapPoint) => {
    const size = Math.max(8, point.intensity * 20);
    const opacity = Math.max(0.3, point.intensity);
    
    return {
      position: 'absolute' as const,
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: getHeatmapColor(point.intensity),
      opacity,
      transform: [
        {
          translateX: ((point.longitude - mapRegion.longitude) / mapRegion.longitudeDelta) * 100,
        },
        {
          translateY: ((point.latitude - mapRegion.latitude) / mapRegion.latitudeDelta) * 100,
        },
      ],
    };
  };

  return (
    <View style={styles.container} pointerEvents="none">
      {points.map((point, index) => (
        <View key={index} style={getPointStyle(point)} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default HeatmapOverlay;