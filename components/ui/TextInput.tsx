import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
  TouchableOpacity,
} from 'react-native';
import { ThemedText } from './ThemedText';
import { Ionicons } from '@expo/vector-icons';

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  secureTextEntry?: boolean;
  containerStyle?: any;
}

export function TextInput({
  label,
  error,
  value,
  secureTextEntry,
  leftIcon,
  rightIcon,
  style,
  containerStyle,
  ...rest
}: TextInputProps) {
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
  
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const getBorderColor = () => {
    if (error) return colors.error;
    if (isFocused) return colors.primary;
    return colors.border;
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Determine if we should show the password toggle
  const shouldShowPasswordToggle = secureTextEntry !== undefined;

  const passwordIcon = isPasswordVisible ? (
    <Ionicons name="eye-off" size={20} color={colors.text} />
  ) : (
    <Ionicons name="eye" size={20} color={colors.text} />
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <ThemedText style={styles.label}>
          {label}
        </ThemedText>
      )}
      
      <View style={[
        styles.inputContainer,
        {
          borderColor: getBorderColor(),
          backgroundColor: colors.inputBackground,
        },
      ]}>
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        
        <RNTextInput
          style={[
            styles.input,
            {
              color: colors.text,
              flex: 1,
              paddingLeft: leftIcon ? 0 : 10,
              paddingRight: rightIcon || shouldShowPasswordToggle ? 0 : 10,
            },
            style,
          ]}
          placeholderTextColor={colors.textSecondary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...rest}
        />
        
        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
        
        {shouldShowPasswordToggle && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={togglePasswordVisibility}
          >
            {passwordIcon}
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <ThemedText style={[styles.errorText, { color: colors.error }]}>
          {error}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    width: '100%',
  },
  label: {
    marginBottom: 6,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  input: {
    paddingVertical: 10,
    fontSize: 16,
  },
  iconContainer: {
    paddingHorizontal: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});