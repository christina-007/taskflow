import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middleware
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl/Postman) or matching origin
      if (!origin || origin === allowedOrigin || origin.startsWith('http://localhost')) {
        callback(null, true);
      } else {
        callback(null, true); // Dev-friendly fallback
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check & DB connection probe
app.get('/api/health', (req, res) => {
  const connectionStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  const readyState = mongoose.connection.readyState;
  const rawHost = mongoose.connection.host || '';
  const isAtlas = rawHost.includes('mongodb.net');
  const isLocalMemory = rawHost.includes('127.0.0.1') || rawHost.includes('localhost');

  res.status(200).json({
    status: 'ok',
    database: {
      state: connectionStateMap[readyState] || 'unknown',
      readyState,
      isAtlas,
      isLocalMemory,
      provider: isAtlas ? 'MongoDB Atlas' : (isLocalMemory ? 'In-Memory Fallback' : 'Custom Server'),
      host: isAtlas ? rawHost : (isLocalMemory ? '127.0.0.1' : rawHost),
      name: mongoose.connection.name || 'default',
    },
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
