
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios'

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.0.111:5000/api/login', { username, password });
      setLoginMessage(response.data.message);
      if (response.data.message === 'Successfully logged in!') {
        navigation.navigate('Welcome', { username });
      }
    } catch (error) {
      setLoginMessage('Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Logo Area */}
      <View style={styles.logoContainer}>
        {/* Add an image here if needed */}
        <Image source={{ uri: 'https://your-image-url.com' }} style={styles.logo} />
      </View>
      <Text style={styles.title}>LOGIN</Text>

      {/* Username Input */}
      <TextInput
        style={styles.input1}
        placeholder="  Username"
        placeholderTextColor="#fff"
        value={username}
        onChangeText={setUsername}
      />

      {/* Password Input */}
      <TextInput
        style={styles.input2}
        placeholder="  Password"
        placeholderTextColor="#fff"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Decorative shape behind the buttons */}
      <View style={styles.decorativeShape}>
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.link}>Forgot Password?</Text>
      </TouchableOpacity>
        <TouchableOpacity style={styles.button1} onPress={handleLogin}>
          <Text style={styles.buttonText1}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.link1}>or</Text>
        <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.buttonText2}>Create an account</Text>
        </TouchableOpacity>
      </View>

      {loginMessage && <Text>{loginMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4C8479',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 35,
    marginBottom: 10,
    color: '#000000',
    fontWeight: 'Heavy',
    fontFamily:'Nexa'
  },
  input1: {
    width: '90%',
    height: 50,
    marginVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#4C8479',
    borderRadius: 23,
    color: '#000',
    fontSize: 16,
  },
  input2: {
    width: '90%',
    height: 50,
    marginBottom: 40,
    marginTop:10,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#4C8479',
    borderRadius: 23,
    color: '#000',
    fontSize: 16,
  },
  decorativeShape: {
    width: '115%',
    paddingTop:15,
    paddingBottom:100,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderRadius: 45,
    alignItems: 'center',
    marginBottom: -220,
  },
  button1: {
    width: '100%',
    padding: 15,
    backgroundColor: '#2F554F',
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 2,
    borderColor:'#fff',
            // Shadow properties for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    // Shadow property for Android
    elevation: 12,


  },
  button2: {
    width: '100%',
    padding: 15,
    backgroundColor: '#BED2D0',
    borderRadius: 25,
    borderColor:'#4C8479',
    alignItems: 'center',
    marginVertical: 10,
    opacity: 2,
    borderWidth: 2,
        // Shadow properties for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    // Shadow property for Android
    elevation: 12,
  },
  buttonText1: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'Heavy',
    fontFamily:'Nexa'
  },
  buttonText2: {
    color: '#2F554F',
    fontSize: 20,
    fontWeight: 'Heavy',
    fontFamily:'Nexa'

  },
  link: {
    color: '#2F554F',
    marginVertical: 5,
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'Heavy',
    fontFamily:'Nexa',
  },
  link1: {
    color: '#000000',
    marginVertical: 3,
    fontSize: 15,
  },
});