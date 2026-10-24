# TaskFlow — Streamlined Task Management Dashboard

TaskFlow is a production-grade full-stack MERN (MongoDB, Express, React, Node.js) task management application. Designed with the restraint and usability of modern productivity tools (such as Linear and Notion), TaskFlow delivers a focused interface with a real working backend and persistent database storage.

---

## 🚀 Features

- **Full CRUD Operations**: Create, read, update, and delete tasks with real-time UI synchronization.
- **Task Attributes**:
  - `title` (Required, 1–140 characters, trimmed)
  - `description` (Optional contextual notes, up to 2000 characters)
  - `priority` (`Low`, `Medium`, `High`)
  - `status` (`Pending`, `In Progress`, `Completed`)
  - `dueDate` (Optional deadline with overdue detection)
- **Live Dashboard Statistics**: Understated metric cards for Total Tasks, Pending, In Progress, Completed, High Priority, and Overdue items.
- **Search & Multi-Filter Controls**:
  - Instant text search across titles and descriptions
  - Filter by status (`Pending`, `In Progress`, `Completed`)
  - Filter by priority (`Low`, `Medium`, `High`)
  - Sort by Newest, Oldest, Due Date (Soonest/Latest)
- **Restrained Linear-Inspired Aesthetics**:
  - Warm off-white background (`#F7F7F4`), crisp content surfaces (`#FFFFFF`), and charcoal typography (`#252620`).
  - Subtle neutral borders and muted sage brown accents.
  - Terracotta (`#C87558`) reserved strictly for high-priority items and destructive actions.
  - No purple/neon gradients, glassmorphism, or heavy drop shadows.
- **Robust Backend Architecture**:
  - Server-side input validation with descriptive HTTP 400 Bad Request responses.
  - Centralized safe error middleware (handles Mongoose `CastError`, `ValidationError`, and JSON syntax issues).
  - Out-of-the-box support for both MongoDB Atlas and local embedded fallback.
  - CORS, Morgan request logging, and health probe (`/api/health`).
- **User Experience**:
  - Modal dialogs with keyboard shortcuts (`Esc` to dismiss, autofocus).
  - Destructive action confirmation dialogs.
  - Non-intrusive toast notifications for success and error feedback.
  - Responsive mobile drawer navigation.

---

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, Lucide Icons, Pure Modular CSS.
- **Backend**: Node.js (v24), Express 4, Mongoose 8.
- **Database**: MongoDB Atlas (with automatic zero-config fallback for instant evaluation).
- **Environment & Config**: Dotenv, CORS, Morgan.

---

## 📁 Repository Structure

```text
capstone/
├── .gitignore               # Excludes .env, node_modules, build outputs
├── package.json             # Root workspace orchestration scripts
├── README.md                # Project documentation and setup guide
├── server/
│   ├── .env.example         # Template for backend environment variables
│   ├── .env                 # Local environment file (ignored by git)
│   ├── package.json         # Backend dependencies & scripts
│   ├── scripts/
│   │   ├── seed.js          # Database seeder script
│   │   └── test-api.js      # Automated backend API verification script
│   └── src/
│       ├── config/
│       │   └── db.js        # Mongoose connection with Atlas support
│       ├── controllers/
│       │   └── taskController.js # CRUD & dashboard stats controllers
│       ├── middleware/
│       │   ├── errorHandler.js   # Centralized error handling & 404
│       │   └── validateTask.js   # Server-side schema validator
│       ├── models/
│       │   └── Task.js           # Mongoose task schema & indexes
│       ├── routes/
│       │   └── taskRoutes.js     # Express REST endpoints
│       ├── app.js               # Express application configuration
│       └── server.js            # Server entry point & graceful shutdown
└── client/
    ├── .env.example         # Template for client environment variables
    ├── .env                 # Local client environment file (ignored by git)
    ├── index.html           # HTML shell with Inter font
    ├── package.json         # Frontend dependencies & scripts
    ├── vite.config.js       # Vite configuration
    └── src/
        ├── api/
        │   └── taskService.js    # Fetch-based API client
        ├── components/
        │   ├── DeleteConfirmModal.jsx # Accessible delete confirmation
        │   ├── EmptyState.jsx         # Empty & filtered state view
        │   ├── FilterBar.jsx          # Search, status & priority filters
        │   ├── Header.jsx             # Top bar & New Task action
        │   ├── Sidebar.jsx            # Monochrome navigation & storage status
        │   ├── StatsOverview.jsx      # Understated dashboard metrics
        │   ├── TaskModal.jsx          # Add / Edit task modal dialog
        │   ├── TaskRow.jsx            # Individual task item with badges
        │   ├── TaskTable.jsx          # Task list table container
        │   └── Toast.jsx              # Non-intrusive notification banner
        ├── App.jsx          # Main application coordinator
        ├── index.css        # Restrained design system & typography
        └── main.jsx         # React application entry point
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js** v18+ (tested on v24.13)
- **npm** v9+

### 2. Installation
Install dependencies for both client and server from the root directory:
```bash
npm run install:all
```
*(Or navigate into `server` and `client` individually and run `npm install`)*

---

### 3. Environment Configuration

#### Backend (`server/.env`)
Copy the example template:
```bash
cp server/.env.example server/.env
```
Default configuration:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskflow?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
> **Note on MongoDB**: If `MONGODB_URI` is left blank, TaskFlow automatically starts an embedded in-memory MongoDB instance so you can test the application immediately without waiting for cluster provisioning. Once you have your MongoDB Atlas URI, simply paste it into `server/.env` and restart the backend.

#### Frontend (`client/.env`)
Copy the client template:
```bash
cp client/.env.example client/.env
```
Configuration:
```env
VITE_API_URL=http://localhost:5000/api
```

---

### 4. Running the Application

You can start both services independently:

**Start Backend (Port 5000):**
```bash
npm run dev:server
```

**Start Frontend (Port 5173):**
```bash
npm run dev:client
```

Open your browser at `http://localhost:5173` to access TaskFlow.

---

## 🧪 Testing & Verification

TaskFlow includes an automated integration test script that verifies all REST endpoints, validation errors, metric aggregations, and CRUD flows against the active database:

```bash
npm run test:api
```

**Sample Output:**
```text
Testing TaskFlow API at http://localhost:5000/api...
1. Health check: PASSED
2. Create task: PASSED 6adc2d3daef57d972ba94bbd
3. Validation check (400 expected): PASSED
4. Get all tasks: PASSED Count: 6
5. Update task to Completed: PASSED
6. Get stats: PASSED { total: 6, completed: 2, pending: 2, inProgress: 2, highPriority: 2, overdue: 0 }
7. Delete task: PASSED
Backend API verification completed successfully.
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status check |
| `GET` | `/api/tasks/stats` | Dashboard statistics (total, completed, pending, inProgress, highPriority, overdue) |
| `GET` | `/api/tasks` | Get all tasks (supports query params: `search`, `status`, `priority`, `sort`) |
| `GET` | `/api/tasks/:id` | Get single task by ID |
| `POST` | `/api/tasks` | Create task (`title` required; validates `status`, `priority`, `dueDate`) |
| `PUT` | `/api/tasks/:id` | Update task by ID |
| `DELETE` | `/api/tasks/:id` | Delete task by ID |

---

## 🔒 Security & Git Hygiene

- `.env` files are strictly excluded via `.gitignore`.
- Production build outputs (`dist/`, `build/`) and `node_modules/` are excluded.
- Inputs are trimmed and validated on both client and server to prevent malformed or oversized payloads.
- Safe error handling prevents leaking internal stack traces in production mode.
