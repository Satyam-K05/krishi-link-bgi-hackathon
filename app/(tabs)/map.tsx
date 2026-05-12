import { MapPin, Truck } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { useApp } from '../../components/AppContext';
import { AppText } from '../../components/AppText';

export default function LogisticsRadar() {
  const { user } = useApp();
  const [latestOrder, setLatestOrder] = useState<any>(null);
  const API_URL = 'http://10.140.207.162:5000/api';

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_URL}/my-orders/${user?.phone}`);
        const data = await res.json();
        if (data.length > 0) setLatestOrder(data[0]);
      } catch (e) { console.log(e); }
    };
    fetchOrder();
    const interval = setInterval(fetchOrder, 5000); // Har 5 sec mein update
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText style={styles.title}>Delivery Status: <AppText style={{color: '#e23744'}}>{latestOrder?.status || "No Active Order"}</AppText></AppText>
        <AppText style={styles.sub}>{latestOrder ? `Tracking: ${latestOrder.cropName}` : "Find fresh harvest in Market"}</AppText>
      </View>

      <MapView style={styles.map} initialRegion={{ latitude: 23.2599, longitude: 77.4126, latitudeDelta: 0.05, longitudeDelta: 0.05 }}>
        <Marker coordinate={{ latitude: 23.2599, longitude: 77.4126 }} title="Buyer Home">
          <View style={styles.userMarker}><MapPin color="#fff" size={15} /></View>
        </Marker>

        {/* Truck tabhi dikhega jab status "On Way" hoga */}
        {(latestOrder?.status === 'On Way' || latestOrder?.status === 'Delivered') && (
          <Marker coordinate={{ latitude: 23.2650, longitude: 77.4200 }} title="Delivery Truck">
            <View style={styles.truckMarker}><Truck color="#fff" size={15} /></View>
          </Marker>
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { position: 'absolute', top: 50, left: 20, right: 20, zIndex: 10, backgroundColor: '#fff', padding: 20, borderRadius: 15, elevation: 10 },
  title: { fontSize: 18, fontWeight: 'bold' },
  sub: { fontSize: 13, color: '#64748b', marginTop: 4 },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
  userMarker: { backgroundColor: '#e23744', padding: 8, borderRadius: 20 },
  truckMarker: { backgroundColor: '#16a34a', padding: 8, borderRadius: 20 }
});
