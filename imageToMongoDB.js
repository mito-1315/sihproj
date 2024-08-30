/*const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');

// MongoDB connection URL and database name
const url = 'mongodb+srv://230701184:mithu133@monishdy.kafai.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'cropshop';

// Function to add an image as an attribute in a document
async function addImageToDocument(collectionName, documentId, imagePath) {
  const client = new MongoClient(url);

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log('Connected to MongoDB');

    // Access the specific database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Read the image file as a buffer
    const imageBuffer = fs.readFileSync(imagePath);

    // Update the document by adding the image buffer as an attribute
    const result = await collection.updateOne(
      { _id: new ObjectId(documentId) }, // Use 'new' to instantiate ObjectId
      { $set: { image: imageBuffer } } // Add the image as an attribute
    );

    if (result.matchedCount === 0) {
      console.log('No document found with the specified ID');
    } else {
      console.log('Image added to the document successfully');
    }
  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
}

// Example usage
// Replace 'collectionName' with your collection name
// Replace 'path/to/your/image.jpg' with the path to your image


addImageToDocument('users', '66d08c295680e6b597391dfb', 'C:/Users/MITHESH/Downloads/red1.png');*/
const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');

// MongoDB connection URL and database name
const url = 'mongodb+srv://230701184:mithu133@monishdy.kafai.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'cropshop';

// Image file path
const imagePath = 'public/assets/potato.png'; // Update with your image path

// Function to upload the image to MongoDB
async function uploadImageToMongoDB() {
  const client = new MongoClient(url);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');

    // Access the specific database and collection
    const db = client.db(dbName);
    const collection = db.collection('products');

    // Read the image file as a buffer
    const imageBuffer = fs.readFileSync(imagePath);

    // Create a new document with only necessary attributes (_id and image)
    const newDocument = {
      _id: new ObjectId(), // Generate a new ObjectId or use an existing one
      image: imageBuffer,  // Store the image as a binary buffer
    };

    // Insert the document into the collection
    const result = await collection.insertOne(newDocument);

    console.log('Image uploaded successfully:', result.insertedId);
  } catch (error) {
    console.error('Error uploading image to MongoDB:', error);
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
}

// Run the function to upload the image
uploadImageToMongoDB();
