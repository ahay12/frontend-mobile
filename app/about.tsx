import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TextInput,
  Alert
} from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { setApiBaseUrl, getApiBaseUrl } from '@/lib/api';
import { 
  BookOpen, 
  BrainCircuit, 
  Cpu, 
  GraduationCap, 
  Settings,
  Save
} from 'lucide-react-native';

export default function AboutScreen() {
  const [apiUrl, setApiUrl] = useState(getApiBaseUrl());
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveApi = () => {
    if (!apiUrl.trim().startsWith('http')) {
      Alert.alert('URL Tidak Valid', 'Pastikan URL dimulai dengan http:// atau https://');
      return;
    }
    setApiBaseUrl(apiUrl.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Settings Section */}
      <Card style={styles.settingsCard}>
        <CardHeader style={styles.settingsHeader}>
          <Settings size={20} color="#4f46e5" />
          <CardTitle style={styles.settingsTitle}>Pengaturan API</CardTitle>
        </CardHeader>
        <CardContent>
          <Text style={styles.settingsDesc}>
            Ubah Base URL jika Anda menjalankan backend FastAPI di perangkat (misal: komputer) lain pada jaringan yang sama.
          </Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={apiUrl}
              onChangeText={setApiUrl}
              placeholder="http://192.168.1.x:8000"
              autoCapitalize="none"
              keyboardType="url"
            />
            <Button size="sm" onPress={handleSaveApi} style={styles.saveBtn}>
              <Save size={16} color="#fff" />
              <Text style={styles.saveBtnText}>{isSaved ? 'Tersimpan' : 'Simpan'}</Text>
            </Button>
          </View>
        </CardContent>
      </Card>

      {/* Hero Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Tentang Proyek</Text>
        <Text style={styles.subtitle}>
          Aplikasi analisis sentimen ini dikembangkan untuk memenuhi kebutuhan penelitian Tugas Akhir (Skripsi) terkait komparasi metode klasifikasi teks.
        </Text>
      </View>

      {/* Background Card */}
      <Card style={[styles.card, styles.bgCard]}>
        <CardHeader style={styles.bgCardHeader}>
          <BookOpen size={24} color="#4f46e5" />
          <CardTitle style={styles.cardTitle}>Latar Belakang</CardTitle>
        </CardHeader>
        <CardContent>
          <Text style={styles.paragraph}>
            Edlink merupakan platform pendukung pembelajaran daring yang digunakan secara masif. Banyaknya ulasan pada platform seperti Google Play Store menghasilkan data teks yang melimpah namun sulit dianalisis secara manual.
          </Text>
          <Text style={styles.paragraph}>
            Penelitian ini dibangun untuk menggali informasi emosional (positif atau negatif) dari ulasan tersebut menggunakan dua pendekatan yang berbeda: algoritma klasik statistika dan deep learning transformatif.
          </Text>
        </CardContent>
      </Card>

      {/* Models Explanation */}
      <View style={styles.grid}>
        
        {/* SVM Card */}
        <Card style={styles.card}>
          <CardHeader style={styles.cardHeaderRow}>
            <Cpu size={20} color="#3b82f6" />
            <CardTitle style={styles.modelTitle}>Support Vector Machine</CardTitle>
          </CardHeader>
          <CardContent>
            <Text style={styles.paragraph}>
              SVM (dengan kernel Linear) dikombinasikan dengan pembobotan kata <Text style={{fontWeight:'bold'}}>TF-IDF</Text>.
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• Pendekatan statistik klasik</Text>
              <Text style={styles.bulletItem}>• Melalui tahap stopword removal</Text>
              <Text style={styles.bulletItem}>• Ringan, sangat cepat, & efisien memory</Text>
              <Text style={styles.bulletItem}>• Bagus untuk kata kunci diskrit</Text>
            </View>
          </CardContent>
        </Card>

        {/* IndoBERT Card */}
        <Card style={[styles.card, { borderColor: '#f3e8ff' }]}>
          <CardHeader style={styles.cardHeaderRow}>
            <BrainCircuit size={20} color="#a855f7" />
            <CardTitle style={styles.modelTitle}>IndoBERT</CardTitle>
          </CardHeader>
          <CardContent>
            <Text style={styles.paragraph}>
              Model Deep Learning transformer yang telah di-fine-tuning untuk dataset bahasa Indonesia.
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• Pendekatan Context-Aware Semantic</Text>
              <Text style={styles.bulletItem}>• Memproses kalimat natural</Text>
              <Text style={styles.bulletItem}>• Sangat akurat menangkap nuansa</Text>
              <Text style={styles.bulletItem}>• Memahami makna ganda berdasarkan konteks</Text>
            </View>
          </CardContent>
        </Card>

      </View>

      {/* Author Footer */}
      <View style={styles.footer}>
        <View style={styles.avatarBg}>
          <GraduationCap size={40} color="#52525b" />
        </View>
        <Text style={styles.authorTag}>MAHASISWA PENELITI</Text>
        <Text style={styles.authorName}>Ando</Text>
        <Text style={styles.copyright}>© 2026 Skripsi Ando — Analisis Sentimen</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    backgroundColor: '#fafafa',
    flexGrow: 1,
  },
  settingsCard: {
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#e0e7ff',
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 8,
  },
  settingsTitle: {
    fontSize: 16,
  },
  settingsDesc: {
    fontSize: 12,
    color: '#737373',
    marginBottom: 12,
    lineHeight: 18,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#d4d4d4',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#171717',
    backgroundColor: '#fff',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#171717',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#737373',
    textAlign: 'center',
    lineHeight: 22,
  },
  grid: {
    gap: 16,
    marginBottom: 32,
  },
  card: {
    marginBottom: 16,
  },
  bgCard: {
    borderColor: '#e0e7ff', // indigo-100
  },
  bgCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#eef2ff', // indigo-50
    padding: 16,
    paddingBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    color: '#171717',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 8,
  },
  modelTitle: {
    fontSize: 16,
  },
  paragraph: {
    fontSize: 14,
    color: '#52525b',
    lineHeight: 22,
    marginBottom: 12,
  },
  bulletList: {
    marginTop: 4,
  },
  bulletItem: {
    fontSize: 13,
    color: '#52525b',
    marginBottom: 6,
    paddingLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  avatarBg: {
    padding: 16,
    backgroundColor: '#f4f4f5',
    borderRadius: 40,
    marginBottom: 16,
  },
  authorTag: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#737373',
    letterSpacing: 1.5,
  },
  authorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#171717',
    marginTop: 4,
  },
  copyright: {
    fontSize: 12,
    color: '#a3a3a3',
    marginTop: 8,
  },
});
