import React from 'react';
import { Tabs } from 'expo-router';
import { BarChart3, FileSpreadsheet, Info } from 'lucide-react-native';

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4f46e5', // indigo-600
        tabBarInactiveTintColor: '#737373', // neutral-500
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb', // neutral-200
          backgroundColor: '#ffffff',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#171717', // neutral-900
        },
        headerTintColor: '#4f46e5',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Single Analysis',
          tabBarIcon: ({ color, size }) => (
            <BarChart3 size={size} color={color} />
          ),
          headerTitle: 'Edlink Sentiment',
        }}
      />
      <Tabs.Screen
        name="batch"
        options={{
          title: 'Batch Analysis',
          tabBarIcon: ({ color, size }) => (
            <FileSpreadsheet size={size} color={color} />
          ),
          headerTitle: 'Batch CSV Analysis',
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'Tentang',
          tabBarIcon: ({ color, size }) => (
            <Info size={size} color={color} />
          ),
          headerTitle: 'Tentang Proyek',
        }}
      />
    </Tabs>
  );
}
