import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useAuth } from "@/lib/auth";

// Add the props type definition
type LoginPopupProps = {
  onSwitchToSignUp?: () => void;
};

function LoginPopup({ onSwitchToSignUp }: LoginPopupProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setIsLoggingIn(true);
      setError(null);
      
      login({ 
        email, 
        password 
      }, {
        onSuccess: () => {},
        onError: (err) => {
          console.error("Login error:", err);
          setError("Login failed. Please check your credentials.");
        },
        onSettled: () => {
          setIsLoggingIn(false);
        }
      });
      
    } catch (error) {
      console.error("Login submission error", error);
      setError("Login failed. Please check your credentials.");
      setIsLoggingIn(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        editable={!isLoggingIn}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!isLoggingIn}
      />
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin}
        disabled={isLoggingIn}
      >
        {isLoggingIn ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      
      {/* Add a link to switch to signup */}
      {onSwitchToSignUp && (
        <TouchableOpacity style={styles.switchButton} onPress={onSwitchToSignUp}>
          <Text style={styles.switchText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchText: {
    color: '#0a7ea4',
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  }
})

export default LoginPopup;