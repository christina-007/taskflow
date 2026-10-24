import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Task from '../src/models/Task.js';

const sampleTasks = [
  {
    title: 'Finalize semester capstone architecture diagram',
    description: 'Document MERN data flow, API route contracts, and database schema diagrams.',
    priority: 'High',
    status: 'In Progress',
    dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
  },
  {
    title: 'Audit MongoDB Atlas security settings',
    description: 'Verify network access whitelists, database user credentials, and encrypted connection strings.',
    priority: 'High',
    status: 'Pending',
    dueDate: new Date(Date.now() + 86400000 * 4), // 4 days from now
  },
  {
    title: 'Refactor Express error middleware and validation',
    description: 'Consolidate 400 bad request handling for missing task titles and invalid status enums.',
    priority: 'Medium',
    status: 'Completed',
    dueDate: new Date(Date.now() - 86400000 * 1), // yesterday
  },
  {
    title: 'Implement responsive sidebar navigation',
    description: 'Ensure clean collapsible layout on mobile viewports with accessible ARIA tags.',
    priority: 'Medium',
    status: 'In Progress',
    dueDate: new Date(Date.now() + 86400000 * 5),
  },
  {
    title: 'Write production README and setup guide',
    description: 'Detail local prerequisites, environment variable configuration, and deployment instructions.',
    priority: 'Low',
    status: 'Pending',
    dueDate: new Date(Date.now() + 86400000 * 7),
  },
];

const seedTasks = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:53662/';
  try {
    await mongoose.connect(uri);
    console.log('[Seed] Connected to database');

    const count = await Task.countDocuments();
    if (count === 0) {
      await Task.insertMany(sampleTasks);
      console.log(`[Seed] Seeded ${sampleTasks.length} realistic initial tasks into database.`);
    } else {
      console.log(`[Seed] Database already has ${count} tasks. Skipping seed.`);
    }

    await mongoose.disconnect();
    console.log('[Seed] Disconnected.');
  } catch (err) {
    console.error('[Seed] Error seeding tasks:', err.message);
  }
};

seedTasks();
