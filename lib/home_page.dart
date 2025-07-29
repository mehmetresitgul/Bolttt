import 'dart:async';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_map_heatmap/flutter_map_heatmap.dart';
import 'package:latlong2/latlong.dart';
import 'package:firebase_auth/firebase_auth.dart';

import 'services/location_service.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  static const tomTomApiKey = 'AjYSY8C3wy4MSQX12suCGK9UCmi6XcpB';
  final MapController _mapController = MapController();
  StreamSubscription<QuerySnapshot>? _locSub;
  final List<WeightedLatLng> _heatPoints = [];

  @override
  void initState() {
    super.initState();
    _initHeatStream();
    LocationService.instance.start();
  }

  void _initHeatStream() {
    final fiveMinutesAgo = Timestamp.fromMillisecondsSinceEpoch(
        DateTime.now().subtract(const Duration(minutes: 5)).millisecondsSinceEpoch);

    _locSub = FirebaseFirestore.instance
        .collection('locations')
        .where('timestamp', isGreaterThan: fiveMinutesAgo)
        .snapshots()
        .listen((snap) {
      final pts = snap.docs.map((doc) {
        final geo = doc['geo'] as GeoPoint;
        return WeightedLatLng(point: LatLng(geo.latitude, geo.longitude), intensity: 1);
      }).toList();
      setState(() {
        _heatPoints..clear()..addAll(pts);
      });
    });
  }

  @override
  void dispose() {
    _locSub?.cancel();
    LocationService.instance.stop();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Neosocius'),
        actions: [
          IconButton(
              onPressed: () => FirebaseAuth.instance.signOut(),
              icon: const Icon(Icons.logout)),
        ],
      ),
      body: FlutterMap(
        mapController: _mapController,
        options: MapOptions(
          center: LatLng(41.015137, 28.97953), // Istanbul default
          zoom: 11,
          interactiveFlags: InteractiveFlag.pinchZoom | InteractiveFlag.drag,
        ),
        children: [
          TileLayer(
            urlTemplate:
                'https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?tileSize=512&key=$tomTomApiKey',
            userAgentPackageName: 'com.neosocius.app',
            tileProvider: NetworkTileProvider(),
          ),
          if (_heatPoints.isNotEmpty)
            HeatMapLayer(
              heatMapDataSource: InMemoryHeatMapDataSource(_heatPoints),
              heatMapOptions: const HeatMapOptions(
                radius: 25,
                blur: 15,
                gradient: {
                  0.0: Color(0xFF0000FF),
                  0.5: Color(0xFF00FFFF),
                  0.7: Color(0xFFFFFF00),
                  1.0: Color(0xFFFF0000),
                },
              ),
            ),
        ],
      ),
    );
  }
}