import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import WelcomeScreen from './WelcomeScreen';
import ProductAddPage from './ProductAddPage';
import ProductPage from './ProductPage'; // Ensure this import is correct

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Login' }} 
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUpScreen} 
          options={{ title: 'Sign Up' }} 
        />
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPasswordScreen} 
          options={{ title: 'Forgot Password' }} 
        />
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen} 
          options={{ title: 'Welcome' }} 
        />
        <Stack.Screen 
          name="ProductAddPage" 
          component={ProductAddPage} 
          options={{ title: 'Add Product' }} 
        />
        <Stack.Screen 
          name="ProductPage" 
          component={ProductPage} // Register ProductPage correctly
          options={{ title: 'Product Page' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
