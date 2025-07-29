# Neosocius - Şehir Sosyal Yoğunluk Haritası

Neosocius, kullanıcıların şehirdeki anlık sosyal yoğunluğu görmelerini sağlayan yenilikçi bir mobil uygulamadır. Facebook'un dijital sosyal ağ yaklaşımından farklı olarak, gerçek dünyadaki sosyal yoğunlukları anonim ve pasif konum verileriyle görselleştirir.

## 🎯 Özellikler

### MVP Özellikleri
- **Basit Kimlik Doğrulama**: Anonim giriş veya email ile kayıt
- **Canlı Isı Haritası**: Aktif kullanıcıların konumlarına göre otomatik yoğunluk haritası
- **Anonim Veri**: Kullanıcı gizliliği korunarak sadece yoğunluk verisi paylaşımı
- **Gerçek Zamanlı Güncelleme**: 30 saniyede bir otomatik veri yenileme

### Teknik Özellikler
- **TomTom Maps API**: Yüksek kaliteli harita servisleri
- **React Native + Expo**: Cross-platform mobil geliştirme
- **TypeScript**: Tip güvenli kod yazımı
- **Modern UI/UX**: Gradient tasarım ve kullanıcı dostu arayüz

## 🚀 Kurulum

### Gereksinimler
- Node.js (v16 veya üzeri)
- npm veya yarn
- Expo CLI
- Android Studio (Android geliştirme için)
- Xcode (iOS geliştirme için, sadece macOS)

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone <repository-url>
cd Neosocius
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Expo CLI'yi yükleyin (eğer yüklü değilse)**
```bash
npm install -g @expo/cli
```

4. **Uygulamayı başlatın**
```bash
npm start
```

### Platform Seçenekleri

- **Android**: `npm run android`
- **iOS**: `npm run ios` (sadece macOS)
- **Web**: `npm run web`

## 📱 Kullanım

### Giriş
1. Uygulamayı açın
2. Email adresinizi girin (opsiyonel) veya "Anonim Olarak Başla" butonuna tıklayın
3. Konum izinlerini verin

### Harita Kullanımı
- **Isı Haritası**: Kırmızı alanlar yoğun, mavi alanlar sakin bölgeleri gösterir
- **Konum Butonu**: 📍 butonuna tıklayarak konumunuza dönün
- **Çıkış**: Sağ üst köşedeki "Çıkış" butonu ile oturumu kapatın

## 🏗️ Proje Yapısı

```
Neosocius/
├── src/
│   ├── components/          # Yeniden kullanılabilir bileşenler
│   ├── screens/            # Ekran bileşenleri
│   │   ├── LoginScreen.tsx
│   │   └── MapScreen.tsx
│   ├── services/           # API ve servis fonksiyonları
│   │   ├── authService.ts
│   │   └── mapService.ts
│   ├── types/              # TypeScript tip tanımları
│   │   └── index.ts
│   ├── utils/              # Yardımcı fonksiyonlar
│   │   ├── storage.ts
│   │   └── location.ts
│   └── constants/          # Sabit değerler
│       └── index.ts
├── assets/                 # Resimler ve ikonlar
├── App.tsx                 # Ana uygulama bileşeni
└── package.json
```

## 🔧 Konfigürasyon

### TomTom API Key
`src/constants/index.ts` dosyasında API anahtarınızı güncelleyin:

```typescript
export const TOMTOM_API_KEY = 'YOUR_API_KEY_HERE';
```

### Harita Ayarları
`src/constants/index.ts` dosyasında harita konfigürasyonunu özelleştirin:

```typescript
export const MAP_CONFIG = {
  initialRegion: {
    latitude: 41.0082, // Varsayılan konum (İstanbul)
    longitude: 28.9784,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  heatmapRadius: 50,
  heatmapOpacity: 0.7,
  updateInterval: 30000, // 30 saniye
};
```

## 🎨 Tasarım Sistemi

### Renkler
```typescript
export const COLORS = {
  primary: '#1a1a2e',      // Ana renk
  secondary: '#16213e',    // İkincil renk
  accent: '#0f3460',       // Vurgu rengi
  highlight: '#e94560',    // Vurgu rengi
  background: '#0f0f23',   // Arka plan
  text: '#ffffff',         // Metin rengi
  textSecondary: '#b0b0b0' // İkincil metin
};
```

### Isı Haritası Renkleri
- 🔵 **Mavi**: Düşük yoğunluk (sakin)
- 🟢 **Yeşil**: Normal yoğunluk
- 🟡 **Sarı**: Yüksek yoğunluk
- 🟠 **Turuncu**: Çok yüksek yoğunluk
- 🔴 **Kırmızı**: Maksimum yoğunluk

## 🔒 Gizlilik ve Güvenlik

- **Anonim Veri**: Kullanıcı kimlik bilgileri paylaşılmaz
- **Konum Gizliliği**: Sadece yoğunluk verisi toplanır
- **Yerel Depolama**: Hassas veriler cihazda şifrelenmiş olarak saklanır
- **İzin Yönetimi**: Sadece gerekli konum izinleri istenir

## 🚧 Geliştirme Notları

### Backend Entegrasyonu
Mevcut MVP'de simüle edilmiş veriler kullanılmaktadır. Gerçek uygulama için:

1. Backend API'si oluşturun
2. `src/services/mapService.ts` dosyasındaki API endpoint'lerini güncelleyin
3. Gerçek zamanlı veri akışı için WebSocket entegrasyonu ekleyin

### Performans Optimizasyonu
- Heatmap verilerini önbelleğe alma
- Konum güncelleme sıklığını optimize etme
- Harita bölgesi değişikliklerinde veri yükleme stratejisi

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

Proje hakkında sorularınız için:
- Email: [your-email@example.com]
- GitHub Issues: [repository-issues-url]

---

**Neosocius** - Şehrin canlı noktalarını keşfet! 🗺️✨