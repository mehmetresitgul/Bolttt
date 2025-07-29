import { User } from '../types';
import { storage } from '../utils/storage';

export const authService = {
  // Anonim giriş
  async signInAnonymously(): Promise<User> {
    try {
      // Simüle edilmiş anonim giriş
      const user: User = {
        id: `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: '',
        isAnonymous: true,
      };

      // Token oluştur (gerçek uygulamada backend'den gelecek)
      const token = `token_${user.id}_${Date.now()}`;

      // Verileri kaydet
      await storage.setUserToken(token);
      await storage.setUserData(user);

      return user;
    } catch (error) {
      console.error('Error signing in anonymously:', error);
      throw new Error('Anonim giriş başarısız');
    }
  },

  // Email ile giriş
  async signInWithEmail(email: string): Promise<User> {
    try {
      // Simüle edilmiş email girişi
      const user: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        isAnonymous: false,
      };

      // Token oluştur
      const token = `token_${user.id}_${Date.now()}`;

      // Verileri kaydet
      await storage.setUserToken(token);
      await storage.setUserData(user);

      return user;
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw new Error('Email ile giriş başarısız');
    }
  },

  // Çıkış yap
  async signOut(): Promise<void> {
    try {
      await storage.clearAll();
    } catch (error) {
      console.error('Error signing out:', error);
      throw new Error('Çıkış başarısız');
    }
  },

  // Mevcut kullanıcıyı kontrol et
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = await storage.getUserToken();
      if (!token) {
        return null;
      }

      const user = await storage.getUserData();
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Token'ı yenile
  async refreshToken(): Promise<string | null> {
    try {
      const user = await this.getCurrentUser();
      if (!user) {
        return null;
      }

      const newToken = `token_${user.id}_${Date.now()}`;
      await storage.setUserToken(newToken);
      return newToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  },

  // Kullanıcı oturum açmış mı kontrol et
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await storage.getUserToken();
      return !!token;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  },
};