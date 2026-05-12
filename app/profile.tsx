import { router } from 'expo-router';
import { ChevronLeft, LogOut } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

// Sahi 1-level-up paths as per your rule
import { useApp } from '../components/AppContext';
import { AppText } from '../components/AppText';

export default function Profile() {
  const { 
    user, 
    setUser, 
    setIsLoggedIn, 
    setCart, 
    isTtsEnabled, 
    setIsTtsEnabled, 
    language 
  } = useApp();

  const [orders, setOrders] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Naya IP (Check if this is still 10.140.207.162)
  const API_URL = 'http://10.140.207.162:5000/api';

  // 1. 🔥 THE MASTER LOGOUT FUNCTION
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Kya aap Krishi-Link se logout karna chahte hain?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Yes, Logout", 
          style: "destructive",
          onPress: () => {
            setUser(null);      // User data clear
            setCart({});       // Cart khali (Multi-user safety)
            setIsLoggedIn(false); // Status change
            router.replace('/'); // Redirect to Login
          } 
        }
      ]
    );
  };

  const fetchData = async () => {
    if (!user?.phone) return;
    setLoading(true);
    try {
      const oRes = await fetch(`${API_URL}/my-orders/${user.phone}`);
      setOrders(await oRes.json());
      const sRes = await fetch(`${API_URL}/my-sales/${user.phone}`);
      setSales(await sRes.json());
    } catch (e) { 
      console.log("Profile Fetch Error:", e); 
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft color="#111827" size={28} />
        </TouchableOpacity>
        <AppText style={styles.headerTitle}>My Account</AppText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
      >
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <AppText style={styles.avatarText}>{user?.phone ? 'S' : '?'}</AppText>
          </View>
          <View style={styles.userInfo}>
            <AppText style={styles.userName}>Satyam (Premium User)</AppText>
            <AppText style={styles.userPhone}>{user?.phone || 'Not Logged In'}</AppText>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>App Preferences</AppText>
          
          <View style={styles.settingItem}>
            <View style={{ flex: 1 }}>
              <AppText style={styles.settingLabel}>Audio/Voice Mode</AppText>
              <AppText style={styles.settingSub}>Tap any text to hear it</AppText>
            </View>
            <Switch
              value={isTtsEnabled}
              onValueChange={setIsTtsEnabled}
              trackColor={{ false: "#e2e8f0", true: "#fecaca" }}
              thumbColor={isTtsEnabled ? "#e23744" : "#9ca3af"}
            />
          </View>
        </View>

        {/* Order Stats Section */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <AppText style={styles.statNum}>{orders.length}</AppText>
            <AppText style={styles.statLabel}>Purchases</AppText>
          </View>
          <View style={styles.statBox}>
            <AppText style={styles.statNum}>{sales.length}</AppText>
            <AppText style={styles.statLabel}>Sales</AppText>
          </View>
        </View>

        {/* Logout Button */}
        <View style={{ padding: 20 }}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <LogOut color="#ef4444" size={20} />
            <AppText style={styles.logoutText}>Log Out</AppText>
          </TouchableOpacity>
          
          <AppText style={styles.versionText}>Krishi-Link v1.0.4 Build (Hackathon Edition)</AppText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingTop: 25 },
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#f1f5f9' },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 20, margin: 15, borderRadius: 20, elevation: 2 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#e23744', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  userInfo: { marginLeft: 15 },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  userPhone: { fontSize: 14, color: '#64748b', marginTop: 2 },
  section: { paddingHorizontal: 20, marginTop: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#111827', marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 },
  settingItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 10 },
  settingLabel: { fontSize: 16, fontWeight: 'bold', color: '#374151' },
  settingSub: { fontSize: 12, color: '#9ca3af' },
  statsRow: { flexDirection: 'row', padding: 15, justifyContent: 'space-between' },
  statBox: { flex: 1, backgroundColor: '#fff', padding: 15, borderRadius: 15, marginHorizontal: 5, alignItems: 'center', elevation: 1 },
  statNum: { fontSize: 20, fontWeight: 'bold', color: '#e23744' },
  statLabel: { fontSize: 12, color: '#64748b', marginTop: 4 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 18, borderRadius: 15, borderWidth: 1, borderColor: '#fecaca' },
  logoutText: { color: '#ef4444', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  versionText: { textAlign: 'center', marginTop: 20, color: '#cbd5e1', fontSize: 11 }
});
