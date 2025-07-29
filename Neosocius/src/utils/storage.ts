import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';
import { User, Location } from '../types';

export const storage = {
  // User token işlemleri
  async setUserToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
    } catch (error) {
      console.error('Error saving user token:', error);
    }
  },

  async getUserToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
    } catch (error) {
      console.error('Error getting user token:', error);
      return null;
    }
  },

  async removeUserToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
    } catch (error) {
      console.error('Error removing user token:', error);
    }
  },

  // User data işlemleri
  async setUserData(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  },

  async getUserData(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  async removeUserData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Error removing user data:', error);
    }
  },

  // Location işlemleri
  async setLastLocation(location: Location): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_LOCATION, JSON.stringify(location));
    } catch (error) {
      console.error('Error saving last location:', error);
    }
  },

  async getLastLocation(): Promise<Location | null> {
    try {
      const locationData = await AsyncStorage.getItem(STORAGE_KEYS.LAST_LOCATION);
      return locationData ? JSON.parse(locationData) : null;
    } catch (error) {
      console.error('Error getting last location:', error);
      return null;
    }
  },

  // Tüm verileri temizle
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_TOKEN,
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.LAST_LOCATION,
      ]);
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  },
};