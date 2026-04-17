import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../utils/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    const data = await loginUser(username, password);
    if (data.token) {
      login(data.token, data.userId);
      router.replace('/add-expense');
    } else {
      setError(data.error || 'Login failed');
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.card}>

        <View style={styles.icon}>
          <Text style={styles.iconText}>$</Text>
        </View>

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Don't have an account?{' '}
          <Link href="/register" style={styles.registerLink}>Register</Link>
        </Text>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#f0ede8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 40,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
  },
  icon: {
    width: 56,
    height: 56,
    backgroundColor: '#1e1e1e',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconText: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 28,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 13,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    height: 44,
    borderWidth: 1,
    borderColor: '#e0ddd8',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#1a1a1a',
    backgroundColor: '#fafaf8',
    marginBottom: 16,
    outlineStyle: 'none',
  },
  button: {
    width: '100%',
    height: 46,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    fontSize: 13,
    color: '#888',
  },
  registerLink: {
    color: '#1a1a1a',
    fontWeight: '700',
  },
  error: {
    color: 'red',
    fontSize: 13,
    marginBottom: 10,
  },
});