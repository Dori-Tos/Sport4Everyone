import React from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  TouchableOpacityProps, 
  ActivityIndicator 
} from 'react-native';
import { ThemedText } from './ThemedText';

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  style,
  loading = false,
  disabled = false,
  fullWidth = false,
  ...rest
}: ButtonProps) {
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
  
  // Determine button colors based on variant
  const getButtonColors = () => {
    const variants = {
      primary: {
        background: colors.primary,
        text: colors.primaryContrast,
      },
      secondary: {
        background: colors.secondary,
        text: colors.secondaryContrast,
      },
      danger: {
        background: colors.error,
        text: colors.white,
      },
      success: {
        background: colors.success,
        text: colors.white,
      },
    };
    return variants[variant];
  };

  const buttonColors = getButtonColors();

  // Size styles
  const sizeStyles = {
    small: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 4,
    },
    medium: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 6,
    },
    large: {
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 8,
    },
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: buttonColors.background },
        sizeStyles[size],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={buttonColors.text} />
      ) : (
        <ThemedText style={[styles.text, { color: buttonColors.text }]}>
          {children}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
});