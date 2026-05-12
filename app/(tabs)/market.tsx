import { router } from 'expo-router';
import { ChevronRight, Globe, MapPin, Mic, Minus, Plus, Search } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Image, RefreshControl, SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useApp } from '../../components/AppContext';
import { AppText } from '../../components/AppText';

export default function Market() {
  const [crops, setCrops] = useState([]);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { t, language, setLanguage, cart, setCart } = useApp();
  const API_URL = 'http://10.140.207.162:5000/api';

  const fetchCrops = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`${API_URL}/get-crops`);
      setCrops(await res.json());
    } catch (e) { console.log(e); }
    setRefreshing(false);
  };

  useEffect(() => { fetchCrops(); }, []);

  // 🔥 Search Filter Logic
  const filteredCrops = crops.filter((c: any) => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    (c.farmerName && c.farmerName.toLowerCase().includes(search.toLowerCase()))
  );

  const updateCart = (item: any, delta: number) => {
    setCart((prev: any) => {
      const newQty = (prev[item._id]?.quantity || 0) + delta;
      if (newQty <= 0) {
        const { [item._id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [item._id]: { ...item, quantity: newQty, sellerPhone: item.phone } };
    });
  };

  const totalItems = Object.values(cart).reduce((sum: any, item: any) => sum + item.quantity, 0);
  const totalPrice = Object.values(cart).reduce((sum: any, item: any) => sum + (item.price * item.quantity), 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <MapPin color="#e23744" size={24} />
          <View style={{flex: 1, marginLeft: 8}}>
            <AppText style={styles.locTitle}>Bhopal, MP ▾</AppText>
          </View>
          
          {/* 🔥 YEH RAHA TUMHARA LANGUAGE SWITCH (Jo mere se miss ho gaya tha) */}
          <TouchableOpacity onPress={() => setLanguage(language === 'English' ? 'हिंदी' : 'English')} style={styles.langBtn}>
            <Globe color="#16a34a" size={16} /><AppText style={styles.langText}>{language}</AppText>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => router.push('/profile')} style={styles.avatar}>
            <AppText style={{color: '#fff', fontWeight: 'bold'}}>S</AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Search color="#ef4444" size={20} />
          <TextInput 
            placeholder={t?.search || "Search crops..."} 
            style={styles.sInput} 
            value={search} 
            onChangeText={setSearch} 
          />
          <Mic color="#ef4444" size={20} />
        </View>
      </View>

      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchCrops} />}>
        <View style={styles.feed}>
          {filteredCrops.length === 0 && !refreshing && (
             <AppText style={{textAlign: 'center', marginTop: 20, color: 'gray'}}>
               Abhi koi fasal stock mein nahi hai. Sell tab se nayi fasal add karein!
             </AppText>
          )}

          {filteredCrops.map((item: any) => (
            <View key={item._id} style={styles.card}>
              <View style={styles.imgWrap}>
                <Image source={{ uri: item.image || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80" }} style={styles.cardImg} />
                {item.totalStock && item.totalStock < 5 && (
                  <View style={styles.lowStock}><AppText style={styles.lowStockText}>Only {item.totalStock}kg left!</AppText></View>
                )}
              </View>
              <View style={styles.details}>
                <View style={styles.r1}>
                  <AppText style={styles.cName}>{item.name}</AppText>
                  <AppText style={styles.price}>₹{item.price}/kg</AppText>
                </View>
                <AppText style={styles.fName}>👨‍🌾 {item.farmerName} • Stock: {item.totalStock || 'N/A'}kg</AppText>
                
                {/* 🔥 ZOMATO STYLE COUNTER */}
                <View style={styles.actionRow}>
                  {cart[item._id] ? (
                    <View style={styles.counter}>
                      <TouchableOpacity onPress={() => updateCart(item, -1)}><Minus color="#fff" size={20}/></TouchableOpacity>
                      <AppText style={styles.countText}>{cart[item._id].quantity}</AppText>
                      <TouchableOpacity onPress={() => {
                        if(!item.totalStock || cart[item._id].quantity < item.totalStock) updateCart(item, 1);
                        else Alert.alert("Limit Reached", "Farmer ke paas itna hi maal hai.");
                      }}><Plus color="#fff" size={20}/></TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.addBtn} onPress={() => updateCart(item, 1)}>
                      <AppText style={styles.addText}>ADD</AppText>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {totalItems > 0 && (
        <TouchableOpacity style={styles.cartBar} onPress={() => router.push('/checkout')}>
          <AppText style={styles.cPrice}>{totalItems} Items | ₹{totalPrice}</AppText>
          <View style={{flexDirection: 'row', alignItems: 'center'}}><AppText style={styles.checkText}>View Cart</AppText><ChevronRight color="#fff" size={18}/></View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 25 },
  header: { padding: 15, backgroundColor: '#fff', elevation: 4 },
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  locTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  langBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdf4', padding: 8, borderRadius: 20, marginRight: 10 },
  langText: { fontSize: 12, fontWeight: 'bold', color: '#16a34a', marginLeft: 4 },
  avatar: { width: 35, height: 35, borderRadius: 17.5, backgroundColor: '#e23744', justifyContent: 'center', alignItems: 'center' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f4f4f5', borderRadius: 12, paddingHorizontal: 12, height: 50 },
  sInput: { flex: 1, marginLeft: 8, fontSize: 15 },
  feed: { padding: 15 },
  card: { backgroundColor: '#fff', borderRadius: 20, marginBottom: 20, elevation: 5, overflow: 'hidden' },
  imgWrap: { width: '100%', height: 150 },
  cardImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  lowStock: { position: 'absolute', top: 10, right: 10, backgroundColor: '#ef4444', padding: 5, borderRadius: 5 },
  lowStockText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  details: { padding: 15 },
  r1: { flexDirection: 'row', justifyContent: 'space-between' },
  cName: { fontSize: 18, fontWeight: 'bold' },
  price: { fontSize: 18, fontWeight: 'bold', color: '#16a34a' },
  fName: { fontSize: 13, color: '#64748b', marginVertical: 5 },
  actionRow: { alignItems: 'flex-end', marginTop: 10 },
  addBtn: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#16a34a', paddingHorizontal: 25, paddingVertical: 6, borderRadius: 8 },
  addText: { color: '#16a34a', fontWeight: 'bold' },
  counter: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16a34a', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  countText: { color: '#fff', marginHorizontal: 15, fontWeight: 'bold', fontSize: 16 },
  cartBar: { position: 'absolute', bottom: 20, left: 15, right: 15, backgroundColor: '#16a34a', padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cPrice: { color: '#fff', fontWeight: 'bold' },
  checkText: { color: '#fff', fontWeight: 'bold', marginRight: 5 }
});
