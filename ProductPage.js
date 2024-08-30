import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Buffer } from 'buffer'; // Import the Buffer polyfill

const ProductPage = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const productId = '66d203d913da0f386e975eec'; // Replace with the actual product ID from MongoDB or fetch dynamically

  useEffect(() => {
    // Fetch the image from MongoDB via backend
    axios.get(`http://192.168.0.111:5000/api/products/${productId}/image`, { responseType: 'arraybuffer' })
      .then(response => {
        // Check the headers to confirm the content type
        const contentType = response.headers['content-type'] || 'image/png';
        const base64 = Buffer.from(response.data, 'binary').toString('base64');
        const imageBase64 = `data:${contentType};base64,${base64}`;
        setImageUrl(imageBase64);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching image:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Product Page</Text>

      {/* Product Images */}
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.productImage} />
        ) : (
          <Text>Image not available</Text>
        )}
      </View>

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>Potato</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Price:</Text>
          <Text style={styles.value}>85</Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Add</Text>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Expiry Date */}
        <View style={styles.row}>
          <Text style={styles.label}>Expire Date:</Text>
          <Text style={styles.value}>12/12/2024</Text>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            This is a detailed description of the product. It includes features, benefits, and other relevant information.
          </Text>
        </View>

        {/* Reviews */}
        <View style={styles.reviewsContainer}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          <TextInput
            style={styles.reviewInput}
            placeholder="Write your review..."
            multiline
          />
          <Button title="Submit Review" onPress={() => {}} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  productImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  detailsContainer: {
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  value: {
    fontSize: 18,
    flex: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    marginHorizontal: 5,
  },
  descriptionContainer: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#555',
  },
  reviewsContainer: {
    marginVertical: 15,
  },
  reviewInput: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    height: 100,
    textAlignVertical: 'top',
  },
});

export default ProductPage;
