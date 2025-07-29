import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '../constants';
import { User } from '../types';
import { generateAnonymousId } from '../utils';

class AuthService {
  private currentUser: User | null = null;

  // Initialize auth service
  async initialize(): Promise<User | null> {
    try {
      const userData = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);
      if (userData) {
        this.currentUser = JSON.parse(userData);
        return this.currentUser;
      }
    } catch (error) {
      console.error('Error initializing auth service:', error);
    }
    return null;
  }

  // Sign in anonymously
  async signInAnonymously(): Promise<User> {
    const anonymousId = generateAnonymousId();
    const user: User = {
      id: anonymousId,
      email: '',
      isAnonymous: true,
    };

    this.currentUser = user;
    await this.saveUserData(user);
    return user;
  }

  // Sign in with email (for future implementation)
  async signInWithEmail(email: string): Promise<User> {
    // In a real app, this would validate with a backend
    const user: User = {
      id: `user_${Date.now()}`,
      email,
      isAnonymous: false,
    };

    this.currentUser = user;
    await this.saveUserData(user);
    return user;
  }

  // Sign out
  async signOut(): Promise<void> {
    this.currentUser = null;
    await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_TOKEN);
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  // Save user data to secure storage
  private async saveUserData(user: User): Promise<void> {
    try {
      await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  // Get stored user data
  async getStoredUserData(): Promise<User | null> {
    try {
      const userData = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting stored user data:', error);
      return null;
    }
  }
}

export default new AuthService();