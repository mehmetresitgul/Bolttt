import 'dart:async';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:geolocator/geolocator.dart';
import 'package:permission_handler/permission_handler.dart';

class LocationService {
  LocationService._();
  static final instance = LocationService._();

  StreamSubscription<Position>? _posSub;

  Future<void> start() async {
    if (await Permission.location.request().isDenied) return;

    _posSub?.cancel();
    _posSub = Geolocator.getPositionStream().listen((pos) async {
      final uid = FirebaseAuth.instance.currentUser?.uid;
      if (uid == null) return;
      await FirebaseFirestore.instance.collection('locations').doc(uid).set({
        'geo': GeoPoint(pos.latitude, pos.longitude),
        'timestamp': FieldValue.serverTimestamp(),
      });
    });
  }

  Future<void> stop() async {
    await _posSub?.cancel();
  }
}