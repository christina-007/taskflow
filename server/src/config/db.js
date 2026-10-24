import mongoose from 'mongoose';

let memoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI && process.env.MONGODB_URI.trim();

  if (uri && !uri.includes('<username>') && !uri.includes('<password>')) {
    try {
      const conn = await mongoose.connect(uri);
      console.log(`[TaskFlow DB] MongoDB Connected to host: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.error(`[TaskFlow DB] Error connecting to MongoDB URI: ${err.message}`);
      console.log(`[TaskFlow DB] Falling back to local embedded database for testing...`);
    }
  }

  // Fallback to MongoDB Memory Server for instant local development/testing without external setup
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    const memoryUri = memoryServer.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`[TaskFlow DB] Connected to local in-memory MongoDB (${memoryUri}).`);
    console.log(`[TaskFlow DB] Tip: To connect to MongoDB Atlas, add your MONGODB_URI to server/.env`);
    return conn;
  } catch (error) {
    console.error(`[TaskFlow DB] Could not initialize fallback database: ${error.message}`);
    throw error;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
    }
  } catch (err) {
    console.error(`[TaskFlow DB] Error disconnecting: ${err.message}`);
  }
};
