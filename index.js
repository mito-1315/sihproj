// simple-backend/index.js

import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId, GridFSBucket } from 'mongodb';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase functions correctly
import { storage } from './config/firebase.js'; // Correct import for Firebase storage

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// MongoDB setup
const url = 'mongodb+srv://230701184:mithu133@monishdy.kafai.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'cropshop';
let db;
let gfs;
let storageGridFs;
let upload;

async function initializeMongoDB() {
  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    db = client.db(dbName);
    gfs = new GridFSBucket(db, { bucketName: 'images' });
    console.log(`Connected to database: ${dbName}`);

    // Set up Multer GridFS storage after DB connection is established
    storageGridFs = new GridFsStorage({
      db, // Use the MongoDB client database object
      file: (req, file) => {
        return {
          filename: `${Date.now()}-${file.originalname}`,
          bucketName: 'images', // Bucket name where files will be stored
        };
      },
    });

    // Initialize Multer upload middleware
    upload = multer({ storage: storageGridFs });

    // Start server after initialization is complete
    startServer();
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1); // Exit the process with an error code
  }
}

initializeMongoDB();

function startServer() {
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// API endpoint to handle sign-up
app.post('/api/signup', async (req, res) => {
  const { username, newPassword, confirmPassword, email, phone, role } = req.body;
  if (newPassword === confirmPassword) {
    try {
      const collection = db.collection('users');
      const result = await collection.insertOne({ username, password: newPassword, email, phone, role });
      res.json({ message: 'Sign-up successful!', userId: result.insertedId });
    } catch (error) {
      console.error('Error inserting user data:', error);
      res.status(500).json({ message: 'Error signing up', error: error.message });
    }
  } else {
    res.status(400).json({ message: 'Passwords do not match' });
  }
});

// API endpoint to handle login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const collection = db.collection('users');
    const user = await collection.findOne({ username, password });
    if (user) {
      res.json({ message: 'Successfully logged in!', username: user.username });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// API endpoint to handle forgot password
app.post('/api/forgotpassword', async (req, res) => {
  const { username, email, newPassword } = req.body;

  try {
    const collection = db.collection('users');
    const user = await collection.findOne({ username, email });
    if (user) {
      await collection.updateOne({ username, email }, { $set: { password: newPassword } });
      res.json({ message: 'Password reset successful!' });
    } else {
      res.status(401).json({ message: 'Invalid username or email' });
    }
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
});

// API endpoint to add a product by a farmer
app.post('/api/products/add', upload.single('image'), async (req, res) => {
  const { productName, price, expiryDate, description, userId } = req.body;
  const file = req.file;

  try {
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload image to Firebase Storage
    const storageRef = ref(storage, `products/${uuidv4()}-${file.originalname}`);
    await uploadBytes(storageRef, file.buffer);
    const imageUrl = await getDownloadURL(storageRef);

    // Store product details in MongoDB
    const newProduct = {
      productName,
      price: parseFloat(price),
      expiryDate: new Date(expiryDate),
      description,
      imageUrl, // Store image URL from Firebase
      farmerId: new ObjectId(userId), // Link product to the farmer's user ID
    };

    const result = await db.collection('products').insertOne(newProduct);
    res.json({ message: 'Product added successfully!', productId: result.insertedId });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
});

// API endpoint to fetch the image directly
app.get('/api/products/:id/image', async (req, res) => {
  const { id } = req.params;

  try {
    const product = await db.collection('products').findOne({ _id: new ObjectId(id) });

    if (product && product.imageUrl) {
      res.json({ imageUrl: product.imageUrl });
    } else {
      res.status(404).json({ message: 'Image not found for this product' });
    }
  } catch (error) {
    console.error('Error fetching image from MongoDB:', error);
    res.status(500).json({ message: 'Error fetching image', error: error.message });
  }
});
