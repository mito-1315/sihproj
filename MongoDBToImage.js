const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');

// MongoDB connection URL and database name
const url = 'mongodb+srv://230701184:mithu133@monishdy.kafai.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'cropshop';

// Function to read and save the image from a document
async function readAndSaveImage(collectionName, documentId, outputPath) {
  const client = new MongoClient(url);

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log('Connected to MongoDB');

    // Access the specific database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Retrieve the document containing the image
    const document = await collection.findOne({ _id: new ObjectId(documentId) });

    if (!document || !document.image) {
      console.log('No image found in the specified document');
      return;
    }

    // Convert the Binary data to a Buffer
    const imageBuffer = Buffer.from(document.image.buffer);

    // Save the image buffer to a file
    fs.writeFileSync(outputPath, imageBuffer);
    console.log(`Image saved to ${outputPath}`);
  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
}
// Example usage
// Replace 'collectionName' with your collection name
// Replace 'documentId' with the _id of the document containing the image
// Replace 'output/path/image.jpg' with the desired output path and file name
readAndSaveImage('users', '66d08c295680e6b597391dfb', 'output/image.png');
