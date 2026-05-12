import { router } from 'expo-router';
import { ChevronLeft, ShieldCheck } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useApp } from '../components/AppContext';
import { AppText } from '../components/AppText';

export default function Checkout() {
  const { cart, setCart, user } = useApp();
  const [loading, setLoading] = useState(false);
  const items = Object.values(cart);
  const total = items.reduce((sum: any, item: any) => sum + (item.price * item.quantity), 0);
  const API_URL = 'http://10.140.207.162:5000/api';

  const placeOrder = async () => {
    setLoading(true);
    for (const item of items) {
      await fetch(`${API_URL}/place-order`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerPhone: user.phone,
          sellerPhone: item.sellerPhone, // Linked directly to the farmer
          cropName: item.name,
          totalAmount: item.price * item.quantity
        })
      });
    }
    setLoading(false);
    Alert.alert("Success", "Orders Placed to Farmers!");
    setCart({});
    router.replace('/(tabs)/map');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><ChevronLeft color="#111827" size={28} /></TouchableOpacity>
        <AppText style={styles.hTitle}>Order Summary</AppText>
      </View>
      <ScrollView style={{padding: 20}}>
        {items.map((item: any, i) => (
          <View key={i} style={styles.row}>
            <AppText style={styles.iName}>{item.name} x {item.quantity}</AppText>
            <AppText style={styles.iPrice}>₹{item.price * item.quantity}</AppText>
          </View>
        ))}
        <View style={styles.line} />
        <View style={styles.row}><AppText style={styles.totalL}>To Pay</AppText><AppText style={styles.totalP}>₹{total + 25}</AppText></View>
        <View style={styles.safety}><ShieldCheck color="#16a34a" size={20}/><AppText style={styles.sText}>Farmers get 100% of this payment.</AppText></View>
      </ScrollView>
      <TouchableOpacity style={styles.payBtn} onPress={placeOrder} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <AppText style={styles.payText}>Place Order</AppText>}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 30 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  hTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  iName: { fontSize: 16, color: '#111827' },
  iPrice: { fontSize: 16, fontWeight: 'bold' },
  line: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 10 },
  totalL: { fontSize: 20, fontWeight: '900' },
  totalP: { fontSize: 20, fontWeight: '900', color: '#16a34a' },
  safety: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdf4', padding: 15, borderRadius: 12, marginTop: 30 },
  sText: { color: '#16a34a', fontSize: 12, fontWeight: 'bold', marginLeft: 10 },
  payBtn: { backgroundColor: '#16a34a', margin: 20, height: 60, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  payText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
