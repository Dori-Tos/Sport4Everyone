import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: number | boolean;
}

export function Card({
  children,
  style,
  variant = 'elevated',
  padding = true,
  ...rest
}: CardProps) {
  const darkTheme = {
    primary: '#4a90e2',
    primaryContrast: '#ffffff',
    secondary: '#95a5a6',
    secondaryContrast: '#ffffff',
    background: '#121212',
    card: '#1e1e1e',
    cardAlt: '#2a2a2a',
    inputBackground: '#2a2a2a',
    text: '#e0e0e0',
    textSecondary: '#b0b0b0',
    textTitle: '#ffffff',
    textSubtitle: '#e0e0e0',
    border: '#333333',
    error: '#e74c3c',
    success: '#2ecc71',
    warning: '#f39c12',
    info: '#3498db',
    white: '#ffffff',
    black: '#000000',
  };
  const { colors, isDark } = { colors: darkTheme, isDark: true };

  const getCardStyle = () => {
    switch (variant) {
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'filled':
        return {
          backgroundColor: colors.cardAlt,
          borderWidth: 0,
        };
      case 'elevated':
      default:
        return {
          backgroundColor: colors.card,
          borderWidth: 0,
          shadowColor: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.2)',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 3,
        };
    }
  };

  const paddingValue = typeof padding === 'boolean' ? (padding ? 16 : 0) : padding;

  return (
    <View
      style={[
        styles.card,
        getCardStyle(),
        { padding: paddingValue, borderRadius: 8 },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});