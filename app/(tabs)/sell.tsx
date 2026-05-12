import * as ImagePicker from 'expo-image-picker';
import { Camera, Edit3, Mic, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, RefreshControl, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useApp } from '../../components/AppContext';
import { AppText } from '../../components/AppText';

export default function Sell() {
  const { user } = useApp();
  const [editingId, setEditingId] = useState<string|null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  const [myListings, setMyListings] = useState([]);
  const [incomingOrders, setIncomingOrders] = useState([]);

  const API_URL = 'http://10.140.207.162:5000/api';

  const fetchData = async () => {
    try {
      const lRes = await fetch(`${API_URL}/my-listings/${user?.phone}`);
      setMyListings(await lRes.json());
      const oRes = await fetch(`${API_URL}/farmer-orders/${user?.phone}`);
      setIncomingOrders(await oRes.json());
    } catch (e) { console.log(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleVoice = () => {
    Alert.alert("Listening...", "Boliye fasal ka naam", [{ text: "Done", onPress: () => setName("Fresh Wheat") }]);
  };

  const listCrop = async () => {
    if(!name || !price || !stock) return Alert.alert("Error", "Sari details bhariye");
    setLoading(true);
    await fetch(`${API_URL}/add-crop`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingId, name, price, totalStock: stock, description: desc, farmerName: "Kisan Satyam", phone: user?.phone, location: "Bhopal", image })
    });
    setLoading(false);
    Alert.alert("Success", editingId ? "Fasal Update ho gayi!" : "Fasal List ho gayi!");
    resetForm(); fetchData();
  };

  const resetForm = () => {
    setEditingId(null); setName(''); setPrice(''); setStock(''); setImage(null); setDesc('');
  };

  const deleteCrop = (id: string) => {
    Alert.alert("Confirm", "Kya aap is fasal ko hatana chahte hain?", [
      { text: "No" },
      { text: "Yes", onPress: async () => {
          await fetch(`${API_URL}/delete-crop/${id}`, { method: 'DELETE' });
          fetchData();
      }}
    ]);
  };

  const startEdit = (item: any) => {
    setEditingId(item._id); setName(item.name); setPrice(item.price.toString());
    setStock(item.totalStock.toString()); setDesc(item.description); setImage(item.image);
    // Scroll to top automatically
  };

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}>
      <View style={styles.formCard}>
        <AppText style={styles.title}>{editingId ? "Edit Listing 📝" : "List New Crop 📸"}</AppText>
        <TouchableOpacity onPress={async () => {
          let res = await ImagePicker.launchCameraAsync({ quality: 0.5 });
          if (!res.canceled) setImage(res.assets[0].uri);
        }} style={styles.cameraBox}>
          {image ? <Image source={{ uri: image }} style={styles.preview} /> : <Camera color="#16a34a" size={40} />}
        </TouchableOpacity>
        
        <View style={styles.voiceRow}>
          <TextInput placeholder="Crop Name" value={name} onChangeText={setName} style={styles.input} />
          <TouchableOpacity onPress={handleVoice} style={styles.micBtn}><Mic color="#fff" size={20} /></TouchableOpacity>
        </View>
        
        <View style={{flexDirection: 'row'}}>
          <TextInput placeholder="Price/kg" keyboardType="numeric" value={price} onChangeText={setPrice} style={[styles.input, {flex: 1, marginRight: 10}]} />
          <TextInput placeholder="Total Stock (kg)" keyboardType="numeric" value={stock} onChangeText={setStock} style={[styles.input, {flex: 1}]} />
        </View>
        
        <TouchableOpacity onPress={listCrop} style={styles.publishBtn}>
          {loading ? <ActivityIndicator color="#fff" /> : <AppText style={styles.publishText}>{editingId ? "Update Now" : "Publish Live"}</AppText>}
        </TouchableOpacity>
        {editingId && <TouchableOpacity onPress={resetForm}><AppText style={{color: 'red', textAlign: 'center', marginTop: 10}}>Cancel Edit</AppText></TouchableOpacity>}
      </View>

      {/* MY LISTINGS (Edit/Delete) */}
      <View style={styles.section}>
        <AppText style={styles.title}>My Marketplace 🏪</AppText>
        {myListings.map((item: any) => (
          <View key={item._id} style={styles.itemCard}>
            <Image source={{ uri: item.image }} style={styles.miniImg} />
            <View style={{flex: 1, marginLeft: 10}}>
              <AppText style={styles.itemMain}>{item.name}</AppText>
              <AppText style={styles.itemSub}>Stock: {item.totalStock}kg | ₹{item.price}</AppText>
            </View>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={() => startEdit(item)} style={styles.iconBtn}><Edit3 color="#16a34a" size={20}/></TouchableOpacity>
              <TouchableOpacity onPress={() => deleteCrop(item._id)} style={styles.iconBtn}><Trash2 color="#ef4444" size={20}/></TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      <View style={{height: 100}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingTop: 50 },
  formCard: { padding: 20, backgroundColor: '#fff', margin: 15, borderRadius: 20, elevation: 3 },
  section: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  cameraBox: { height: 150, backgroundColor: '#f0fdf4', borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#16a34a', borderStyle: 'dashed', overflow: 'hidden' },
  preview: { width: '100%', height: '100%' },
  voiceRow: { flexDirection: 'row', alignItems: 'center' },
  input: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 12 },
  micBtn: { backgroundColor: '#16a34a', padding: 12, borderRadius: 10, marginLeft: 10, marginBottom: 12 },
  publishBtn: { backgroundColor: '#16a34a', padding: 15, borderRadius: 10, alignItems: 'center' },
  publishText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  itemCard: { backgroundColor: '#fff', padding: 10, borderRadius: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  miniImg: { width: 50, height: 50, borderRadius: 8 },
  itemMain: { fontWeight: 'bold', fontSize: 15 },
  itemSub: { fontSize: 12, color: '#64748b' },
  iconBtn: { padding: 10 }
});
