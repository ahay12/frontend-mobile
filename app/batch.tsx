import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { analyzeBatch, BatchAnalyzeResponse } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { DonutChart } from '@/components/ui/DonutChart';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  AlertCircle, 
  CheckCircle,
  BarChart, 
  PieChart as PieChartIcon, 
  Table as TableIcon
} from 'lucide-react-native';

export default function BatchAnalysisScreen() {
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BatchAnalyzeResponse | null>(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'text/comma-separated-values', 'application/csv'],
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const picked = result.assets[0];
        if (!picked.name.toLowerCase().endsWith('.csv')) {
          setError("Tolong upload file berformat CSV (.csv)");
          setFile(null);
          return;
        }
        setFile(picked);
        setError(null);
      }
    } catch (err) {
      console.error(err);
      setError("Gagal memilih file");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      // Check file size, warn if too big (optional, for safety)
      if (file.size && file.size > 5 * 1024 * 1024) {
        throw new Error("File terlalu besar (Maksimal 5MB)");
      }

      const data = await analyzeBatch(
        file.uri, 
        file.name, 
        file.mimeType || 'text/csv'
      );
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.detail || 
        err.message || 
        "Gagal memproses file batch CSV. Periksa format file Anda dan koneksi server."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatChartData = (summary: Record<string, number>) => {
    return Object.entries(summary).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
  };

  const COLORS = ["#10b981", "#ef4444"]; // Emerald for positive, Red for negative

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <FileSpreadsheet size={32} color="#4f46e5" />
          <Text style={styles.title}>Batch CSV Analysis</Text>
        </View>
        <Text style={styles.subtitle}>
          Upload file dataset Anda (CSV) yang memiliki header kolom "content" untuk melakukan prediksi masal secara cepat.
        </Text>
      </View>

      {/* Upload Box */}
      <Card style={[
        styles.uploadCard,
        file ? styles.uploadCardActive : styles.uploadCardInactive
      ]}>
        <CardContent style={styles.uploadContent}>
          {!file ? (
            <TouchableOpacity style={styles.uploadArea} onPress={pickDocument}>
              <View style={styles.iconCircle}>
                <UploadCloud size={32} color="#9ca3af" />
              </View>
              <Text style={styles.uploadMainText}>Klik untuk memilih file CSV</Text>
              <Text style={styles.uploadSubText}>Pastikan terdapat header "content"</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.fileSelectedArea}>
              <View style={styles.fileInfoBox}>
                <FileSpreadsheet size={20} color="#4f46e5" />
                <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
                  {file.name}
                </Text>
                {file.size && (
                  <Text style={styles.fileSize}>
                    ({(file.size / 1024).toFixed(1)} KB)
                  </Text>
                )}
                <TouchableOpacity 
                  onPress={() => { setFile(null); setResult(null); }}
                  style={styles.removeFileBtn}
                >
                  <Text style={styles.removeFileText}>Hapus</Text>
                </TouchableOpacity>
              </View>
              <Button 
                size="lg" 
                isLoading={isLoading} 
                onPress={handleUpload}
                style={styles.processBtn}
              >
                Mulai Batch Proses
              </Button>
            </View>
          )}
        </CardContent>
      </Card>

      {/* Error Box */}
      {error && (
        <View style={styles.errorBox}>
          <AlertCircle size={20} color="#dc2626" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Results */}
      {result && !isLoading && (
        <View style={styles.resultsContainer}>
          
          {/* Summary Stats Bar */}
          <View style={styles.statsGrid}>
            <Card style={styles.statBox}>
              <CardContent style={styles.statBoxContent}>
                <View style={[styles.statIconBg, { backgroundColor: '#eff6ff', borderColor: '#dbeafe' }]}>
                  <BarChart size={24} color="#2563eb" />
                </View>
                <View>
                  <Text style={styles.statLabel}>Total Baris Diproses</Text>
                  <Text style={styles.statValue}>{result.total}</Text>
                </View>
              </CardContent>
            </Card>

            {result.has_labels && result.accuracy && (
              <>
                <Card style={styles.statBox}>
                  <CardContent style={styles.statBoxContent}>
                    <View style={[styles.statIconBg, { backgroundColor: '#eef2ff', borderColor: '#e0e7ff' }]}>
                      <CheckCircle size={24} color="#4f46e5" />
                    </View>
                    <View>
                      <Text style={styles.statLabel}>Akurasi SVM</Text>
                      <Text style={styles.statValue}>{(result.accuracy.svm! * 100).toFixed(1)}%</Text>
                    </View>
                  </CardContent>
                </Card>

                <Card style={styles.statBox}>
                  <CardContent style={styles.statBoxContent}>
                    <View style={[styles.statIconBg, { backgroundColor: '#faf5ff', borderColor: '#f3e8ff' }]}>
                      <CheckCircle size={24} color="#9333ea" />
                    </View>
                    <View>
                      <Text style={styles.statLabel}>Akurasi IndoBERT</Text>
                      <Text style={styles.statValue}>{(result.accuracy.indobert! * 100).toFixed(1)}%</Text>
                    </View>
                  </CardContent>
                </Card>
              </>
            )}
          </View>

          {/* Donut Charts */}
          <Card style={styles.chartCard}>
            <CardHeader style={styles.chartHeader}>
              <PieChartIcon size={20} color="#4f46e5" />
              <CardTitle style={styles.chartTitle}>Distribusi Sentimen SVM</CardTitle>
            </CardHeader>
            <CardContent style={styles.chartContent}>
              <DonutChart 
                data={formatChartData(result.summary.svm)} 
                colors={COLORS} 
                size={220}
              />
            </CardContent>
          </Card>

          <Card style={styles.chartCard}>
            <CardHeader style={styles.chartHeader}>
              <PieChartIcon size={20} color="#4f46e5" />
              <CardTitle style={styles.chartTitle}>Distribusi Sentimen IndoBERT</CardTitle>
            </CardHeader>
            <CardContent style={styles.chartContent}>
              <DonutChart 
                data={formatChartData(result.summary.indobert)} 
                colors={COLORS} 
                size={220}
              />
            </CardContent>
          </Card>

          {/* Data List Preview */}
          <Card style={styles.tableCard}>
            <CardHeader style={styles.tableHeader}>
              <View style={styles.tableTitleRow}>
                <TableIcon size={20} color="#4f46e5" />
                <CardTitle style={styles.tableTitle}>Rincian Prediksi</CardTitle>
              </View>
              <Button 
                variant="outline" 
                size="sm" 
                onPress={() => Alert.alert('Fitur Export', 'Akan segera hadir.')}
              >
                <Text style={{ fontSize: 12 }}>Export CSV</Text>
              </Button>
            </CardHeader>
            <CardContent style={{ padding: 0 }}>
              {result.results.slice(0, 10).map((item, idx) => (
                <View key={idx} style={[
                  styles.tableRow,
                  idx !== result.results.slice(0, 10).length - 1 && styles.tableRowBorder
                ]}>
                  <Text style={styles.tableContent} numberOfLines={2}>{item.content}</Text>
                  
                  <View style={styles.tableLabelsRow}>
                    <View style={styles.badgeCol}>
                      <Text style={styles.badgeLabel}>SVM</Text>
                      <View style={[
                        styles.sentimentBadge,
                        item.svm.toLowerCase() === 'positif' ? styles.badgePos : styles.badgeNeg
                      ]}>
                        <Text style={[
                          styles.sentimentBadgeText,
                          item.svm.toLowerCase() === 'positif' ? styles.textPos : styles.textNeg
                        ]}>
                          {item.svm}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.badgeCol}>
                      <Text style={styles.badgeLabel}>IndoBERT</Text>
                      <View style={[
                        styles.sentimentBadge,
                        item.indobert.toLowerCase() === 'positif' ? styles.badgePos : styles.badgeNeg
                      ]}>
                        <Text style={[
                          styles.sentimentBadgeText,
                          item.indobert.toLowerCase() === 'positif' ? styles.textPos : styles.textNeg
                        ]}>
                          {item.indobert}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
              
              {result.results.length > 10 && (
                <View style={styles.tableFooter}>
                  <Text style={styles.tableFooterText}>
                    Menampilkan 10 baris pertama dari total {result.total} baris.
                  </Text>
                </View>
              )}
            </CardContent>
          </Card>

        </View>
      )}

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
  header: {
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#171717',
  },
  subtitle: {
    fontSize: 14,
    color: '#737373',
    lineHeight: 20,
  },
  uploadCard: {
    borderStyle: 'dashed',
    borderWidth: 2,
    marginBottom: 24,
  },
  uploadCardInactive: {
    borderColor: '#d4d4d4',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  uploadCardActive: {
    borderColor: '#818cf8', // indigo-400
    backgroundColor: 'rgba(238, 242, 255, 0.5)', // indigo-50
  },
  uploadContent: {
    padding: 24,
  },
  uploadArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  uploadMainText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#404040',
    marginBottom: 4,
  },
  uploadSubText: {
    fontSize: 12,
    color: '#a3a3a3',
  },
  fileSelectedArea: {
    paddingVertical: 8,
  },
  fileInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff', // indigo-100
    borderWidth: 1,
    borderColor: '#c7d2fe', // indigo-200
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4f46e5',
    marginLeft: 8,
    marginRight: 4,
    flex: 1,
  },
  fileSize: {
    fontSize: 12,
    color: '#6366f1',
    marginRight: 8,
  },
  removeFileBtn: {
    padding: 4,
  },
  removeFileText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: 'bold',
  },
  processBtn: {
    width: '100%',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  resultsContainer: {
    gap: 24,
  },
  statsGrid: {
    gap: 16,
  },
  statBox: {
    backgroundColor: '#ffffff',
  },
  statBoxContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  statIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#737373',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#171717',
  },
  chartCard: {},
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 0,
    gap: 8,
  },
  chartTitle: {
    fontSize: 16,
  },
  chartContent: {
    padding: 16,
    alignItems: 'center',
  },
  tableCard: {},
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    backgroundColor: '#fafafa',
  },
  tableTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tableTitle: {
    fontSize: 16,
  },
  tableRow: {
    padding: 16,
  },
  tableRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  tableContent: {
    fontSize: 14,
    color: '#404040',
    marginBottom: 12,
    fontWeight: '500',
  },
  tableLabelsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  badgeCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeLabel: {
    fontSize: 11,
    color: '#737373',
  },
  sentimentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgePos: {
    backgroundColor: '#d1fae5',
  },
  badgeNeg: {
    backgroundColor: '#fee2e2',
  },
  sentimentBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  textPos: {
    color: '#059669',
  },
  textNeg: {
    color: '#dc2626',
  },
  tableFooter: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  tableFooterText: {
    fontSize: 12,
    color: '#a3a3a3',
    fontStyle: 'italic',
  },
});
