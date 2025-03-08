import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text, TextInput, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {supabase} from "@/services/supabase";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/App";

export const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleAuth = async () => {
    setError('');
    setLoading(true);
    try {
      const {error} = isLogin
        ? await supabase.auth.signInWithPassword({email, password})
        : await supabase.auth.signUp({email, password});
      if (error) throw error;
    } catch (err: Error | any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text variant="headlineMedium" style={styles.title}>
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={styles.input}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        mode="contained"
        onPress={handleAuth}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        {isLogin ? 'Sign In' : 'Sign Up'}
      </Button>

      <View style={styles.switchContainer}>
        <Text>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
        </Text>
        <Button
          mode="text"
          onPress={() => setIsLogin(!isLogin)}
          compact
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  forgotPassword: {
    alignSelf: 'center',
    marginTop: 10,
  },
});
