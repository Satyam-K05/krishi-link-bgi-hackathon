import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ShieldCheck } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, ImageBackground, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

// Sahi 1-level-up paths
import { useApp } from '../components/AppContext';
import { AppText } from '../components/AppText';

const { height } = Dimensions.get('window');
const API_URL = 'http://10.140.207.162:5000/api';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser, setIsLoggedIn } = useApp();

    const handleAuth = async () => {
    setLoading(true);
    try {
      if (!showOtp) {
        if (phone.length !== 10) {
          Alert.alert("Invalid", "Enter 10-digit number");
          setLoading(false);
          return;
        }
        
        console.log("🚀 Request Bhej Raha Hoon Yahan:", `${API_URL}/send-otp`); // Ye terminal mein check karna
        
        const res = await fetch(`${API_URL}/send-otp`, { 
          method: 'POST', 
          headers: { 
            'Accept': 'application/json', // 🔥 YEH NAYA ADD KIYA HAI
            'Content-Type': 'application/json' 
          }, 
          body: JSON.stringify({ phone }) 
        });
        
        const data = await res.json();
        if (data.success) setShowOtp(true);
      } else {
        const res = await fetch(`${API_URL}/verify-otp`, { 
          method: 'POST', 
          headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json' 
          }, 
          body: JSON.stringify({ phone, otp }) 
        });
        
        const data = await res.json();
        if (data.success) { 
          setUser(data.user); 
          setIsLoggedIn(true); 
          router.replace('/(tabs)/market'); 
        } else {
          Alert.alert("Error", "Galat OTP");
        }
      }
    } catch (e) { 
      console.log("🔥 Asli Error Yeh Hai:", e); // 🔥 YEH TERMINAL MEIN DIKHEGA
      Alert.alert("Network Error", "Server se connect nahi ho paya."); 
    }
    setLoading(false);
  };


  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ImageBackground source={{ uri: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80' }} style={styles.bgImage}>
        <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']} style={styles.gradient} />
      </ImageBackground>

      <View style={styles.bottomSheet}>
        <View style={styles.dragHandle} />
        <View style={styles.header}>
          <AppText style={styles.title}>Krishi-Link</AppText>
        </View>
        <AppText style={styles.subTitle}>Direct from Farms. Delivered Fresh.</AppText>
        <AppText style={styles.label}>{showOtp ? "Enter OTP sent to your number" : "Log in or sign up"}</AppText>
        
        <View style={styles.inputContainer}>
          {!showOtp ? (
            <View style={styles.phoneBox}>
              <View style={styles.countryCode}>
                <AppText style={{fontWeight: 'bold', fontSize: 16}}>+91</AppText>
              </View>
              <TextInput 
                style={styles.input} 
                placeholder="Enter mobile number" 
                keyboardType="phone-pad" 
                maxLength={10} 
                value={phone} 
                onChangeText={setPhone} 
              />
            </View>
          ) : (
            <TextInput 
              style={styles.otpInput} 
              placeholder="• • • •" 
              keyboardType="number-pad" 
              maxLength={4} 
              value={otp} 
              onChangeText={setOtp} 
              textAlign="center" 
            />
          )}
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleAuth}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <AppText style={styles.buttonText}>{showOtp ? "Verify & Login" : "Continue"}</AppText>
          )}
        </TouchableOpacity>
        
        <View style={styles.safeAreaText}>
          <ShieldCheck color="#16a34a" size={16} style={{marginRight: 6}} />
          <AppText style={{color: '#64748b', fontSize: 12}}>100% Secure & Verified</AppText>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  bgImage: { width: '100%', height: height * 0.65, position: 'absolute', top: 0 },
  gradient: { flex: 1 },
  bottomSheet: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, paddingBottom: 40 },
  dragHandle: { width: 40, height: 5, backgroundColor: '#e2e8f0', borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '900', color: '#111827' },
  subTitle: { fontSize: 15, color: '#64748b', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 16 },
  inputContainer: { marginBottom: 20 },
  phoneBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, height: 56 },
  countryCode: { paddingHorizontal: 16, borderRightWidth: 1, borderRightColor: '#e2e8f0', backgroundColor: '#f8fafc', height: '100%', justifyContent: 'center' },
  input: { flex: 1, paddingHorizontal: 16, fontSize: 16 },
  otpInput: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, height: 60, fontSize: 32, fontWeight: 'bold', letterSpacing: 10, backgroundColor: '#f8fafc' },
  primaryButton: { backgroundColor: '#e23744', height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  safeAreaText: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24 }
});
