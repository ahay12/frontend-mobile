import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { analyzeSingle, AnalyzeResponse } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { MLPipeline } from '@/components/ui/MLPipeline';
import { 
  MessageSquareText, 
  AlertCircle, 
  Send, 
  Sparkles, 
  RotateCcw,
  Smile,
  Frown,
  BrainCircuit,
  Cpu,
  ArrowRight,
  CheckCircle2
} from 'lucide-react-native';

export default function SingleAnalysisScreen() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setHasSubmitted(true);

    try {
      const data = await analyzeSingle(inputText);
      // Adding a small delay just to let the pipeline animation play a bit
      setTimeout(() => {
        setResult(data);
        setIsLoading(false);
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.detail ||
          "Gagal menghubungi server. Pastikan API backend sudah berjalan dan URL sudah benar di pengaturan."
      );
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setInputText("");
    setResult(null);
    setError(null);
    setHasSubmitted(false);
  };

  const charCount = inputText.length;

  const renderResultCard = (title: string, type: 'svm' | 'indobert', modelResult: any) => {
    const isPositive = modelResult.label === "positif";
    const pct = Math.min(Math.max(modelResult.confidence * 100, 0), 100).toFixed(1);
    const Icon = type === 'indobert' ? BrainCircuit : Cpu;
    
    return (
      <Card style={[
        styles.resultCard,
        isPositive ? styles.resultCardPos : styles.resultCardNeg
      ]}>
        <CardContent style={styles.resultCardContent}>
          <View style={styles.resultHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={[
                styles.resultIconBg,
                type === 'indobert' ? styles.resultIconBgIndo : styles.resultIconBgSvm
              ]}>
                <Icon size={20} color={type === 'indobert' ? '#9333ea' : '#2563eb'} />
              </View>
              <Text style={styles.resultTitle}>{title}</Text>
            </View>
            <View style={[
              styles.badgeSmall,
              type === 'indobert' ? styles.badgeIndo : styles.badgeSvm
            ]}>
              <Text style={[
                styles.badgeTextSmall,
                type === 'indobert' ? styles.badgeTextIndo : styles.badgeTextSvm
              ]}>
                {type === 'indobert' ? 'Transformer' : 'Classic ML'}
              </Text>
            </View>
          </View>

          <View style={styles.resultCenter}>
            <View style={[
              styles.emojiContainer,
              isPositive ? styles.emojiPos : styles.emojiNeg
            ]}>
              {isPositive ? <Smile size={48} color="#059669" /> : <Frown size={48} color="#dc2626" />}
            </View>
            <Text style={[
              styles.resultLabel,
              isPositive ? styles.textPos : styles.textNeg
            ]}>
              {modelResult.label}
            </Text>
            <Text style={styles.resultSubLabel}>Hasil Prediksi</Text>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Confidence Level</Text>
              <Text style={[styles.progressValue, isPositive ? styles.textPos : styles.textNeg]}>
                {pct}%
              </Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[
                styles.progressBarFill,
                isPositive ? styles.bgPos : styles.bgNeg,
                { width: `${pct}%` }
              ]} />
            </View>
          </View>
        </CardContent>
      </Card>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        
        {/* Header Title */}
        <View style={styles.headerTitleContainer}>
          <View style={styles.tagBadge}>
            <Sparkles size={14} color="#4f46e5" style={{ marginRight: 4 }} />
            <Text style={styles.tagBadgeText}>SISTEM ANALISIS SENTIMEN</Text>
          </View>
          <Text style={styles.mainTitle}>Analisis Review</Text>
          <Text style={styles.mainTitleGradient}>Edlink Secara Real-Time</Text>
          <Text style={styles.subtitle}>
            Masukkan ulasan teks di bawah ini untuk melihat perbandingan prediksi sentimen.
          </Text>
        </View>

        {/* Input Form */}
        {!hasSubmitted ? (
          <Card style={styles.inputCard}>
            <CardContent>
              <View style={styles.inputHeader}>
                <MessageSquareText size={18} color="#4f46e5" style={{ marginRight: 8 }} />
                <Text style={styles.inputHeaderText}>Ketik ulasan Anda (Maksimal 512 Karakter)</Text>
              </View>
              
              <View style={styles.textAreaContainer}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Contoh: Aplikasi ini sangat membantu..."
                  placeholderTextColor="#a3a3a3"
                  multiline
                  value={inputText}
                  onChangeText={(text) => setInputText(text.slice(0, 512))}
                  textAlignVertical="top"
                />
                <Text style={[
                  styles.charCount,
                  charCount > 500 ? { color: '#ef4444' } : null
                ]}>
                  {charCount}/512
                </Text>
              </View>

              {error && (
                <View style={styles.errorBox}>
                  <AlertCircle size={18} color="#dc2626" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <Button
                size="lg"
                onPress={handleAnalyze}
                disabled={!inputText.trim()}
                style={styles.submitBtn}
              >
                <Send size={18} color="#fff" style={{ marginRight: 8 }} />
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Mulai Analisis</Text>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card style={styles.echoCard}>
            <CardContent style={styles.echoContent}>
              <MessageSquareText size={18} color="#4f46e5" style={{ marginTop: 2 }} />
              <Text style={styles.echoText} numberOfLines={3}>"{inputText}"</Text>
              {!isLoading && (
                <Button variant="ghost" size="sm" onPress={handleReset} style={styles.resetBtn}>
                  <RotateCcw size={14} color="#737373" />
                  <Text style={styles.resetBtnText}>Ulang</Text>
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Pipeline Animation */}
        {isLoading && (
          <View style={styles.pipelineContainer}>
            <MLPipeline />
          </View>
        )}

        {/* Results */}
        {result && !isLoading && (
          <View style={styles.resultsContainer}>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>HASIL ANALISIS</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Preprocessing Steps */}
            <View style={styles.sectionHeader}>
              <View style={styles.sectionNumberBadge}><Text style={styles.sectionNumberText}>1</Text></View>
              <Text style={styles.sectionTitle}>Langkah Preprocessing</Text>
            </View>

            <View style={styles.preprocessingGrid}>
              {[
                { title: "Original Teks", value: result.preprocessing.original, desc: "Input ulasan asli user" },
                { title: "Setelah Cleaning", value: result.preprocessing.after_cleaning, desc: "Lowercase, hapus simbol & angka" },
                { title: "Setelah Stopword", value: result.preprocessing.after_stopword, desc: "Menghapus kata umum bahasa" },
              ].map((item, idx) => (
                <Card key={idx} style={styles.prepCard}>
                  <CardContent style={styles.prepCardContent}>
                    <View style={styles.prepHeader}>
                      <Text style={styles.prepTitle}>{item.title}</Text>
                      {idx < 2 && <ArrowRight size={16} color="#d4d4d4" />}
                    </View>
                    <View style={styles.prepValueBox}>
                      <Text style={styles.prepValueText}>"{item.value || '(kosong)'}"</Text>
                    </View>
                    <View style={styles.prepDescBox}>
                      <CheckCircle2 size={12} color="#10b981" />
                      <Text style={styles.prepDescText}>{item.desc}</Text>
                    </View>
                  </CardContent>
                </Card>
              ))}
            </View>

            {/* Prediction Comparison */}
            <View style={[styles.sectionHeader, { marginTop: 32 }]}>
              <View style={styles.sectionNumberBadge}><Text style={styles.sectionNumberText}>2</Text></View>
              <Text style={styles.sectionTitle}>Komparasi Model Prediksi</Text>
            </View>

            <View style={styles.comparisonGrid}>
              {renderResultCard("Support Vector Machine", "svm", result.svm)}
              {renderResultCard("IndoBERT", "indobert", result.indobert)}
            </View>

          </View>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    backgroundColor: '#fafafa',
    flexGrow: 1,
  },
  headerTitleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#c7d2fe',
    marginBottom: 16,
  },
  tagBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4f46e5',
    letterSpacing: 0.5,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#171717',
    textAlign: 'center',
  },
  mainTitleGradient: {
    fontSize: 32,
    fontWeight: '900',
    color: '#4f46e5',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#737373',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  inputCard: {
    marginBottom: 24,
    backgroundColor: '#ffffff',
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 16,
  },
  inputHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#52525b',
  },
  textAreaContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  textArea: {
    height: 120,
    backgroundColor: '#fafafa',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#171717',
  },
  charCount: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    fontSize: 12,
    color: '#a3a3a3',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  submitBtn: {
    paddingVertical: 14,
  },
  echoCard: {
    marginBottom: 24,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  echoContent: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  echoText: {
    flex: 1,
    fontSize: 14,
    color: '#404040',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    height: 'auto',
  },
  resetBtnText: {
    fontSize: 12,
    color: '#737373',
    marginLeft: 4,
  },
  pipelineContainer: {
    marginTop: 16,
  },
  resultsContainer: {
    marginTop: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#a3a3a3',
    letterSpacing: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  sectionNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4f46e5',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#262626',
  },
  preprocessingGrid: {
    gap: 12,
  },
  prepCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6',
  },
  prepCardContent: {
    padding: 16,
  },
  prepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  prepTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6366f1',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  prepValueBox: {
    backgroundColor: '#fafafa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f5f5f5',
    minHeight: 60,
  },
  prepValueText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#404040',
  },
  prepDescBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  prepDescText: {
    fontSize: 11,
    color: '#737373',
  },
  comparisonGrid: {
    gap: 16,
  },
  resultCard: {
    borderWidth: 2,
  },
  resultCardPos: {
    borderColor: 'rgba(16, 185, 129, 0.3)',
    backgroundColor: 'rgba(236, 253, 245, 0.5)',
  },
  resultCardNeg: {
    borderColor: 'rgba(239, 68, 68, 0.3)',
    backgroundColor: 'rgba(254, 242, 242, 0.5)',
  },
  resultCardContent: {
    padding: 20,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  resultIconBg: {
    padding: 8,
    borderRadius: 8,
  },
  resultIconBgSvm: {
    backgroundColor: '#dbeafe',
  },
  resultIconBgIndo: {
    backgroundColor: '#f3e8ff',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#262626',
  },
  badgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeSvm: {
    backgroundColor: '#dbeafe',
  },
  badgeIndo: {
    backgroundColor: '#f3e8ff',
  },
  badgeTextSmall: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  badgeTextSvm: {
    color: '#1d4ed8',
  },
  badgeTextIndo: {
    color: '#7e22ce',
  },
  resultCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  emojiContainer: {
    padding: 16,
    borderRadius: 40,
    marginBottom: 12,
  },
  emojiPos: {
    backgroundColor: '#d1fae5',
  },
  emojiNeg: {
    backgroundColor: '#fee2e2',
  },
  resultLabel: {
    fontSize: 28,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  resultSubLabel: {
    fontSize: 12,
    color: '#737373',
    marginTop: 4,
  },
  textPos: {
    color: '#059669',
  },
  textNeg: {
    color: '#dc2626',
  },
  progressSection: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#52525b',
  },
  progressValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  bgPos: {
    backgroundColor: '#10b981',
  },
  bgNeg: {
    backgroundColor: '#ef4444',
  },
});
