import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase'; // Import storage from your firebase.js file
import { v4 as uuidv4 } from 'uuid';

const ProductAddPage = ({ navigation, route }) => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const { userId } = route.params; // Get userId from route parameters

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    } else {
      setImage(null);
    }
  };

  const handleAddProduct = async () => {
    if (!productName || !price || !expiryDate || !description || !image) {
      Alert.alert('Error', 'Please fill all fields and select an image.');
      return;
    }

    try {
      // Upload image to Firebase Storage
      const response = await fetch(image);
      const blob = await response.blob();
      const storageRef = ref(storage, `products/${uuidv4()}.jpg`);
      await uploadBytes(storageRef, blob);
      const imageUrl = await getDownloadURL(storageRef);

      // Send product data to the backend
      const formData = {
        productName,
        price,
        expiryDate,
        description,
        userId,
        imageUrl, // Send the URL of the uploaded image
      };

      await axios.post('http://192.168.0.111:5000/api/products/add', formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      Alert.alert(
        'Success',
        'Product added successfully! Do you want to add another product?',
        [
          {
            text: 'No',
            onPress: () => navigation.navigate('Welcome'),
          },
          {
            text: 'Yes',
            onPress: () => resetForm(),
          },
        ]
      );
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Error', 'Error adding product. Please try again.');
    }
  };

  // Function to reset the form fields
  const resetForm = () => {
    setProductName('');
    setPrice('');
    setExpiryDate('');
    setDescription('');
    setImage(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Product</Text>

      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={productName}
        onChangeText={setProductName}
      />

      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Expiry Date (YYYY-MM-DD)"
        value={expiryDate}
        onChangeText={setExpiryDate}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <Text style={styles.imagePickerText}>Pick an Image</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

      <Button title="Add Product" onPress={handleAddProduct} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  imagePicker: {
    backgroundColor: '#007bff',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginVertical: 10,
  },
});

export default ProductAddPage;
