import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import {
  FileText,
  Scissors,
  Filter,
  BarChart2,
  Cpu,
  BrainCircuit,
  CheckCircle2,
  Loader2,
} from 'lucide-react-native';

interface PipelineStep {
  id: number;
  icon: any;
  label: string;
  sublabel: string;
  color: string;
  bgColor: string;
  borderColor: string;
  duration: number;
}

const STEPS: PipelineStep[] = [
  {
    id: 0,
    icon: FileText,
    label: "Menerima Input",
    sublabel: "Teks ulasan diterima sistem",
    color: "#4f46e5", // indigo-600
    bgColor: "#eef2ff", // indigo-50
    borderColor: "#a5b4fc", // indigo-300
    duration: 800,
  },
  {
    id: 1,
    icon: Scissors,
    label: "Text Cleaning",
    sublabel: "Lowercase · hapus simbol & URL",
    color: "#7c3aed", // violet-600
    bgColor: "#f5f3ff", // violet-50
    borderColor: "#c4b5fd", // violet-300
    duration: 900,
  },
  {
    id: 2,
    icon: Filter,
    label: "Stopword Removal",
    sublabel: "Menghapus kata umum (Bahasa Indonesia)",
    color: "#0284c7", // sky-600
    bgColor: "#f0f9ff", // sky-50
    borderColor: "#7dd3fc", // sky-300
    duration: 900,
  },
  {
    id: 3,
    icon: BarChart2,
    label: "TF-IDF Vectorization",
    sublabel: "Konversi teks → vektor numerik",
    color: "#d97706", // amber-600
    bgColor: "#fffbeb", // amber-50
    borderColor: "#fcd34d", // amber-300
    duration: 1000,
  },
  {
    id: 4,
    icon: Cpu,
    label: "SVM Inference",
    sublabel: "Support Vector Machine · Classic ML",
    color: "#2563eb", // blue-600
    bgColor: "#eff6ff", // blue-50
    borderColor: "#93c5fd", // blue-300
    duration: 1100,
  },
  {
    id: 5,
    icon: BrainCircuit,
    label: "IndoBERT Inference",
    sublabel: "Transformer · Deep Learning",
    color: "#9333ea", // purple-600
    bgColor: "#faf5ff", // purple-50
    borderColor: "#d8b4fe", // purple-300
    duration: 1200,
  },
];

export const MLPipeline = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // Animation for the rotating loader
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const advance = (stepIndex: number) => {
      if (stepIndex >= STEPS.length) return;

      setActiveStep(stepIndex);

      timeout = setTimeout(() => {
        setCompletedSteps((prev) => [...prev, stepIndex]);
        advance(stepIndex + 1);
      }, STEPS[stepIndex].duration);
    };

    advance(0);

    return () => clearTimeout(timeout);
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressPct = (completedSteps.length / STEPS.length) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.loaderContainer}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Loader2 size={24} color="#4f46e5" />
          </Animated.View>
        </View>
        <Text style={styles.headerTitle}>Memproses Analisis Sentimen</Text>
        <Text style={styles.headerSubtitle}>Pipeline ML sedang berjalan secara real-time</Text>
      </View>

      {/* Steps */}
      <View style={styles.stepsContainer}>
        {STEPS.map((step, idx) => {
          const isCompleted = completedSteps.includes(idx);
          const isActive = activeStep === idx && !isCompleted;
          const isPending = !isActive && !isCompleted;
          const Icon = step.icon;

          return (
            <View key={step.id} style={styles.stepWrapper}>
              {/* Connector Line */}
              {idx < STEPS.length - 1 && (
                <View style={styles.connectorLineContainer}>
                  <View style={[styles.connectorLine, isCompleted ? styles.connectorLineDone : null]} />
                </View>
              )}

              <View style={[
                styles.stepCard,
                isActive && { backgroundColor: step.bgColor, borderColor: step.borderColor, borderWidth: 2 },
                isCompleted && styles.stepCardDone,
                isPending && styles.stepCardPending
              ]}>
                
                {/* Step Icon */}
                <View style={[
                  styles.iconContainer,
                  isActive && { backgroundColor: step.bgColor },
                  isCompleted && styles.iconContainerDone,
                  isPending && styles.iconContainerPending
                ]}>
                  {isCompleted ? (
                    <CheckCircle2 size={20} color="#10b981" />
                  ) : isActive ? (
                    <Icon size={20} color={step.color} />
                  ) : (
                    <Icon size={20} color="#a3a3a3" />
                  )}
                </View>

                {/* Labels */}
                <View style={styles.labelsContainer}>
                  <Text style={[
                    styles.stepLabel,
                    isCompleted ? styles.stepLabelDone : isActive ? { color: step.color } : styles.stepLabelPending
                  ]}>
                    {step.label}
                  </Text>
                  <Text style={[
                    styles.stepSublabel,
                    (isActive || isCompleted) ? styles.stepSublabelActive : styles.stepSublabelPending
                  ]}>
                    {step.sublabel}
                  </Text>
                </View>

                {/* Status Badge */}
                <View style={styles.badgeContainer}>
                  {isActive && (
                    <View style={[styles.badge, { backgroundColor: step.bgColor, borderColor: step.borderColor }]}>
                      <Text style={[styles.badgeText, { color: step.color }]}>Proses...</Text>
                    </View>
                  )}
                  {isCompleted && (
                    <View style={[styles.badge, styles.badgeDone]}>
                      <Text style={[styles.badgeText, styles.badgeTextDone]}>Selesai</Text>
                    </View>
                  )}
                  {isPending && (
                    <View style={[styles.badge, styles.badgePending]}>
                      <Text style={[styles.badgeText, styles.badgeTextPending]}>Menunggu</Text>
                    </View>
                  )}
                </View>

              </View>
            </View>
          );
        })}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>Progress Pipeline</Text>
          <Text style={styles.progressText}>{Math.round(progressPct)}%</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: `${progressPct}%` }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  loaderContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0e7ff', // indigo-100
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#262626',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#737373',
    marginTop: 4,
  },
  stepsContainer: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  stepWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  connectorLineContainer: {
    position: 'absolute',
    left: 22, // roughly middle of the icon container
    top: 50,
    width: 2,
    height: 30, // to reach the next step
    backgroundColor: '#e5e7eb',
    zIndex: 0,
  },
  connectorLine: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e5e7eb',
  },
  connectorLineDone: {
    backgroundColor: '#4f46e5',
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#ffffff',
  },
  stepCardDone: {
    backgroundColor: '#ecfdf5', // emerald-50
    borderColor: '#6ee7b7', // emerald-300
  },
  stepCardPending: {
    borderColor: '#e5e7eb', // neutral-200
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    zIndex: 1, // Stay above connector
  },
  iconContainerDone: {
    backgroundColor: '#d1fae5', // emerald-100
  },
  iconContainerPending: {
    backgroundColor: '#f5f5f5', // neutral-100
  },
  labelsContainer: {
    flex: 1,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  stepLabelDone: {
    color: '#047857', // emerald-700
  },
  stepLabelPending: {
    color: '#a3a3a3', // neutral-400
  },
  stepSublabel: {
    fontSize: 12,
    marginTop: 2,
  },
  stepSublabelActive: {
    color: '#737373', // neutral-500
  },
  stepSublabelPending: {
    color: '#d4d4d4', // neutral-300
  },
  badgeContainer: {
    marginLeft: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  badgeDone: {
    backgroundColor: '#d1fae5',
    borderColor: '#a7f3d0',
  },
  badgeTextDone: {
    color: '#047857',
  },
  badgePending: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e5e7eb',
  },
  badgeTextPending: {
    color: '#a3a3a3',
  },
  progressSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    color: '#737373',
  },
  progressBarContainer: {
    height: 8,
    width: '100%',
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4f46e5',
    borderRadius: 4,
  },
});
