import React from 'react';
import { View, Text, StyleSheet, ViewProps, TextProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export const Card = ({ children, style, ...props }: CardProps) => {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
};

export const CardHeader = ({ children, style, ...props }: CardProps) => {
  return (
    <View style={[styles.header, style]} {...props}>
      {children}
    </View>
  );
};

export const CardTitle = ({ children, style, ...props }: TextProps) => {
  return (
    <Text style={[styles.title, style]} {...props}>
      {children}
    </Text>
  );
};

export const CardContent = ({ children, style, ...props }: CardProps) => {
  return (
    <View style={[styles.content, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    flexDirection: 'column',
    gap: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0a0a0a',
    letterSpacing: -0.5,
  },
  content: {
    padding: 24,
    paddingTop: 0,
  },
});
