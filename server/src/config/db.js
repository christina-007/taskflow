import dns from 'dns';
import mongoose from 'mongoose';

// Enable reliable SRV resolution on networks where ISP router DNS blocks SRV queries
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Use system default if restricted
}

let memoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI && process.env.MONGODB_URI.trim();

  if (uri && !uri.includes('<username>') && !uri.includes('<password>')) {
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const conn = await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 8000,
          maxPoolSize: 10,
        });
        console.log(`[TaskFlow DB] MongoDB Connected to host: ${conn.connection.host}`);
        return conn;
      } catch (err) {
        console.warn(`[TaskFlow DB] Attempt ${attempt}/${maxRetries} to connect to Atlas failed: ${err.message}`);
        if (attempt < maxRetries) {
          console.log(`[TaskFlow DB] Retrying Atlas connection in 1.2s...`);
          await new Promise((resolve) => setTimeout(resolve, 1200));
        } else {
          console.error(`[TaskFlow DB] All Atlas connection attempts failed. Falling back to local embedded database...`);
        }
      }
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
