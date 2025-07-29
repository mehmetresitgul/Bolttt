Neosocius
==========

Next-generation mobile social density app powered by TomTom Maps.

Features
--------
1. Email/Password authentication (Firebase Auth).
2. Real-time social density heat-map built from anonymous user positions.
3. Cross-platform – Android & iOS (single Flutter code-base).

Screens
-------
1. **Login / Sign-up** – minimal, clean.
2. **HeatMap** – full-screen map, red ↔ blue gradient representing crowd density.

Stack
-----
* **Flutter 3.22**
* **TomTom Maps Raster Tile API** – `https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?tileSize=512&key=AjYSY8C3wy4MSQX12suCGK9UCmi6XcpB`
* **Firebase** – Auth + Cloud Firestore.
* **Geolocator** – device location.
* **flutter_map** – map rendering.
* **flutter_heatmap** – smooth density layer.

Getting Started
---------------
1. `flutter pub get`
2. Create a Firebase project ➜ add Android & iOS apps ➜ download the generated configuration files:  
   * `android/app/google-services.json`  
   * `ios/Runner/GoogleService-Info.plist`
3. Enable **Email/Password** sign-in method in Firebase → Authentication.
4. Run: `flutter run`.

Architecture
------------
* **AuthStateStream** – global `StreamProvider<User?>` for auth.
* **LocationService**
  * requests location permissions.
  * streams current position.
  * periodically pushes location to Firestore collection `locations` with TTL via Cloud Function (optional) or client-side pruning.
* **HeatMapLayer**
  * subscribes to `locations` snapshots filtered to last 5 minutes.
  * converts GeoPoints ↦ LatLng.
  * feeds into `HeatMap` widget overlay on `FlutterMap`.

Security / Privacy
------------------
* No user profile data is stored besides UID → positions are anonymised.
* Positions older than 5 minutes are automatically deleted on the backend.

Future Work
-----------
* JWT session revalidation.
* Battery/foreground service optimisation.
* Push-based geo-queries (GeoFire).
* Custom map style in TomTom Map Maker.