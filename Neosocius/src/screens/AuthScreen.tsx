import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import AuthService from '../services/AuthService';
import { isValidEmail } from '../utils';

interface AuthScreenProps {
  navigation: any;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (isSignUp && !email.trim()) {
      newErrors.email = 'Email is required';
    } else if (isSignUp && !isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (isSignUp && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAnonymousSignIn = async () => {
    try {
      setLoading(true);
      const user = await AuthService.signInAnonymously();
      navigation.replace('Map');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in anonymously');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const user = await AuthService.signInWithEmail(email);
      navigation.replace('Map');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Neosocius</Text>
            <Text style={styles.subtitle}>
              Discover real-time social density
            </Text>
          </View>

          <View style={styles.form}>
            {isSignUp && (
              <>
                <CustomInput
                  label="Email"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                />
                <CustomInput
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  error={errors.password}
                />
              </>
            )}

            <CustomButton
              title={isSignUp ? 'Sign Up' : 'Continue with Email'}
              onPress={isSignUp ? handleEmailSignIn : () => setIsSignUp(true)}
              loading={loading}
              style={styles.button}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <CustomButton
              title="Continue Anonymously"
              onPress={handleAnonymousSignIn}
              variant="outline"
              loading={loading}
              style={styles.button}
            />

            {isSignUp && (
              <CustomButton
                title="Back to Sign In"
                onPress={() => setIsSignUp(false)}
                variant="secondary"
                size="small"
                style={styles.backButton}
              />
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
  },
  form: {
    marginBottom: 32,
  },
  button: {
    marginBottom: 16,
  },
  backButton: {
    marginTop: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#FFFFFF',
    opacity: 0.3,
  },
  dividerText: {
    color: '#FFFFFF',
    marginHorizontal: 16,
    fontSize: 16,
    opacity: 0.8,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: '#FFFFFF',
    opacity: 0.6,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default AuthScreen;