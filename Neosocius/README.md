# Neosocius - Real-Time Social Density App

Neosocius is a next-generation mobile application that shows users real-time social density in their city. Unlike Facebook's digital social network revolution, Neosocius focuses on showing people where the real-world social activity is happening right now.

## 🎯 Vision

"Where is it lively, where is it quiet in the city right now?" - Neosocius answers this question by providing users with an anonymous, passive location-based heatmap that shows social density in real-time.

## ✨ Features

### MVP Features
- **Anonymous Authentication**: Simple sign-in/registration with email or anonymous access
- **Real-Time Heatmap**: Interactive map showing social density with color-coded intensity
- **Location Tracking**: Optional location sharing to contribute to the heatmap
- **Modern UI**: Beautiful, intuitive interface with gradient designs

### Technical Features
- **TomTom Maps Integration**: High-quality mapping with your API key
- **Real-Time Updates**: Live location tracking and heatmap updates
- **Cross-Platform**: Works on both iOS and Android
- **TypeScript**: Full type safety and better development experience
- **Secure Storage**: Encrypted local storage for user data

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Neosocius
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure TomTom API**
   - The app is already configured with the provided TomTom API key: `AjYSY8C3wy4MSQX12suCGK9UCmi6XcpB`
   - To use your own key, update `src/constants/index.ts`

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   ```bash
   # For iOS
   npm run ios
   
   # For Android
   npm run android
   
   # For web
   npm run web
   ```

## 📱 App Structure

```
Neosocius/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── CustomButton.tsx
│   │   ├── CustomInput.tsx
│   │   └── HeatmapOverlay.tsx
│   ├── screens/            # App screens
│   │   ├── AuthScreen.tsx
│   │   └── MapScreen.tsx
│   ├── services/           # Business logic services
│   │   ├── AuthService.ts
│   │   ├── LocationService.ts
│   │   └── MapService.ts
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── constants/          # App constants and configuration
├── assets/                 # Images and static assets
├── App.tsx                 # Main app component
└── package.json           # Dependencies and scripts
```

## 🎨 Design Philosophy

### User Experience
- **Minimalist**: No social features, profiles, or messaging
- **Anonymous**: Users contribute data without revealing identity
- **Real-time**: Live updates show current social density
- **Intuitive**: Simple, clean interface focused on the map

### Visual Design
- **Gradient Backgrounds**: Modern gradient designs for visual appeal
- **Color-Coded Heatmap**: Blue (low) to Red (high) density visualization
- **Responsive Layout**: Adapts to different screen sizes
- **Smooth Animations**: Fluid transitions and interactions

## 🔧 Technical Implementation

### Core Technologies
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe JavaScript
- **TomTom Maps**: High-quality mapping service
- **Expo Location**: Location services and permissions

### Key Features Implementation

#### Heatmap Generation
```typescript
// Generate heatmap data from location points
export const generateHeatmapData = (
  locations: Array<{ latitude: number; longitude: number }>,
  radius: number = 0.01
): HeatmapPoint[] => {
  // Creates intensity-based heatmap points
  // Adds surrounding points for better visualization
}
```

#### Location Tracking
```typescript
// Start location tracking with real-time updates
await LocationService.startLocationTracking(
  (locationData: LocationData) => {
    // Update user location
    // Add to map service
    // Update heatmap visualization
  },
  currentUser.id
);
```

#### Anonymous Authentication
```typescript
// Generate anonymous user ID
export const generateAnonymousId = (): string => {
  return 'anon_' + Math.random().toString(36).substr(2, 9);
};
```

## 📊 Data Flow

1. **User Authentication**: Anonymous or email-based sign-in
2. **Location Permission**: Request and handle location access
3. **Location Tracking**: Continuous location updates (optional)
4. **Heatmap Generation**: Process location data into visual heatmap
5. **Real-Time Updates**: Live map updates as users move

## 🔒 Privacy & Security

- **Anonymous Data**: No personal information collected
- **Local Storage**: User preferences stored securely on device
- **Optional Tracking**: Users can choose to contribute location data
- **No Social Features**: No profiles, friends, or messaging

## 🚀 Future Enhancements

### Planned Features
- **Backend Integration**: Real-time data synchronization
- **Advanced Analytics**: Historical density patterns
- **Custom Filters**: Filter by time, day, or activity type
- **Push Notifications**: Density alerts for favorite areas
- **Offline Support**: Cached map data for offline viewing

### Technical Improvements
- **Performance Optimization**: Efficient heatmap rendering
- **Battery Optimization**: Smart location tracking intervals
- **Caching Strategy**: Intelligent data caching
- **Error Handling**: Robust error recovery

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TomTom**: For providing excellent mapping services
- **Expo**: For the amazing development platform
- **React Native Community**: For the robust ecosystem

## 📞 Support

For support, email support@neosocius.com or create an issue in the repository.

---

**Neosocius** - Discover real-time social density in your city! 🌍📍