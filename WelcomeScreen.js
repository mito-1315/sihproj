import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WelcomeScreen({ route }) {
  const { username = 'User' } = route.params || {}; // Add default value for username

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.text}>Hello, {username}!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  text: {
    fontSize: 18,
    marginVertical: 10,
  },
});
