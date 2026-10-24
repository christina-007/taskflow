import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`[TaskFlow Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`[TaskFlow Server] API Health: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error(`[TaskFlow Server] Failed to start:`, error.message);
    process.exit(1);
  }
};

const handleShutdown = async (signal) => {
  console.log(`\n[TaskFlow Server] Received ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      await disconnectDB();
      console.log('[TaskFlow Server] Server and DB connections closed.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

startServer();
