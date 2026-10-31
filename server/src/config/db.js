import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer = null;

export async function connectDB() {
  const mongoURI = process.env.MONGODB_URI;

  // 1. If a MongoDB URI is explicitly provided, try connecting to it first
  if (mongoURI && mongoURI.trim() !== '') {
    try {
      console.log(`[MongoDB] Attempting to connect to configured MONGODB_URI...`);
      const conn = await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 4000,
      });
      console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
      return conn;
    } catch (err) {
      console.warn(`[MongoDB] Could not connect to configured MONGODB_URI: ${err.message}`);
      console.log(`[MongoDB] Automatically switching to zero-config in-memory database...`);
    }
  }

  // 2. Fallback: Automatically start an in-memory MongoDB instance
  // This allows the app to run completely zero-setup on local machines and on Render/Railway!
  try {
    console.log(`[MongoDB] Starting Zero-Config In-Memory MongoDB Server...`);
    memoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'ai-mystery-room'
      }
    });

    const memUri = memoryServer.getUri();
    const conn = await mongoose.connect(memUri);
    console.log(`================================================================`);
    console.log(`🎉 [MongoDB] Connected to Zero-Config In-Memory Database!`);
    console.log(`💡 No MongoDB Atlas setup or connection string is required.`);
    console.log(`================================================================`);
    return conn;
  } catch (fallbackError) {
    console.error(`[MongoDB] Fatal error initializing in-memory fallback:`, fallbackError);
    throw fallbackError;
  }
}

// Graceful cleanup on server shutdown
process.on('SIGINT', async () => {
  if (memoryServer) {
    await memoryServer.stop();
  }
  process.exit(0);
});
