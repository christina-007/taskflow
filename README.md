# TaskFlow — Streamlined Task Management Dashboard

TaskFlow is a production-grade full-stack MERN (MongoDB, Express, React, Node.js) task management application. Designed with the restraint and usability of modern productivity tools (such as Linear and Notion), TaskFlow delivers a focused interface with a real working backend, secure authentication, user isolation, and persistent MongoDB Atlas storage.

---

## 🚀 Features

- **Authentication & User Isolation**:
  - Secure registration and login with bcrypt password hashing (10 salt rounds).
  - Signed JSON Web Tokens (JWT) with configurable expiration (`7d`).
  - Protected API routes via authorization middleware (`Bearer <token>`).
  - Strict user data isolation: each user only reads, creates, updates, and deletes their own tasks.
  - Transparent preservation of existing legacy tasks without destructive database migrations.
- **Full CRUD Operations**: Create, read, update, and delete tasks with real-time UI synchronization.
- **Task Attributes**:
  - `title` (Required, 1–140 characters, trimmed)
  - `description` (Optional contextual notes, up to 2000 characters)
  - `priority` (`Low`, `Medium`, `High`)
  - `status` (`Pending`, `In Progress`, `Completed`)
  - `dueDate` (Optional deadline with overdue detection)
  - `user` (Mongoose ObjectId referencing `User` model)
- **Live Dashboard Statistics**: Understated metric cards for Total Tasks, Pending, In Progress, Completed, High Priority, and Overdue items (calculated via high-performance MongoDB `$facet` aggregation).
- **Search & Multi-Filter Controls**:
  - Instant text search across titles and descriptions
  - Filter by status (`Pending`, `In Progress`, `Completed`)
  - Filter by priority (`Low`, `Medium`, `High`)
  - Sort by Newest, Oldest, Due Date (Soonest/Latest)
- **Restrained Linear-Inspired Aesthetics**:
  - Warm off-white background (`#F7F7F4`), crisp content surfaces (`#FFFFFF`), and charcoal typography (`#252620`).
  - Subtle neutral borders and muted sage brown accents (`#52584A`).
  - Terracotta (`#C87558`) reserved strictly for high-priority items and destructive actions.
  - No purple/neon gradients, glassmorphism, or heavy drop shadows.
- **Robust Backend Architecture**:
  - Server-side input validation with descriptive HTTP 400 Bad Request responses.
  - Centralized safe error middleware (handles Mongoose `CastError`, `ValidationError`, and JSON syntax issues).
  - Out-of-the-box support for both MongoDB Atlas and local embedded fallback.
  - Automatic public DNS fallback (`8.8.8.8`, `1.1.1.1`) to resolve Atlas SRV records on Windows networks.
  - CORS, Morgan request logging, and health probe (`/api/health`).
- **User Experience**:
  - Unified Sign In / Create Account modal dialog with tab switching and instant feedback.
  - Modal dialogs with keyboard shortcuts (`Esc` to dismiss, autofocus).
  - Destructive action confirmation dialogs.
  - Non-intrusive toast notifications for success and error feedback.
  - Responsive mobile drawer navigation.

---

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, Lucide Icons, Pure Modular CSS.
- **Backend**: Node.js (v24), Express 4, Mongoose 8, bcryptjs, jsonwebtoken.
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
│   │   ├── test-api.js      # Automated backend API CRUD test script
│   │   └── test-auth.js     # Automated authentication & user isolation test suite
│   └── src/
│       ├── config/
│       │   └── db.js        # Mongoose connection with Atlas support & DNS fallback
│       ├── controllers/
│       │   ├── authController.js # Register, login, and profile controllers
│       │   └── taskController.js # User-isolated CRUD & stats controllers
│       ├── middleware/
│       │   ├── authMiddleware.js # JWT verification & route protection
│       │   ├── errorHandler.js   # Centralized error handling & 404
│       │   └── validateTask.js   # Server-side schema validator
│       ├── models/
│       │   ├── Task.js           # Mongoose task schema with user reference
│       │   └── User.js           # Mongoose user schema with bcrypt hashing
│       ├── routes/
│       │   ├── authRoutes.js     # Express authentication endpoints
│       │   └── taskRoutes.js     # Protected Express task endpoints
│       ├── utils/
│       │   └── token.js          # JWT signing utility
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
        │   ├── authService.js    # Authentication API & localStorage client
        │   └── taskService.js    # Authenticated fetch client
        ├── components/
        │   ├── AuthModal.jsx          # Sign In / Create Account modal
        │   ├── DeleteConfirmModal.jsx # Accessible delete confirmation
        │   ├── EmptyState.jsx         # Empty, filtered & unauthenticated state view
        │   ├── FilterBar.jsx          # Search, status & priority filters
        │   ├── Header.jsx             # Top bar, User Avatar, Sign Out & New Task
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

---

### 3. Environment Configuration

#### Backend (`server/.env`)
Copy the example template:
```bash
cp server/.env.example server/.env
```
Configuration:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskflow?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
```

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

TaskFlow includes automated test suites for both general API operations and multi-user authentication isolation:

**1. Authentication & Multi-User Isolation Tests:**
```bash
npm run test:auth
```
*Verifies: unauthenticated route protection (401), registration, duplicate email rejection (400), invalid passwords (401), cross-user direct read isolation (404), cross-user update isolation (404), cross-user delete isolation (404), list scoping, and token expiration/tampering.*

**2. Full CRUD Lifecycle Tests:**
```bash
npm run test:api
```
*Verifies: health status check, authenticated task creation, schema validation failures, user task list querying, updates, status completion toggles, metric aggregations, and deletion.*

---

## 🔌 API Reference

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT |
| `GET` | `/api/auth/me` | Bearer Token | Fetch authenticated user profile |

### Task Endpoints (`/api/tasks`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/tasks/stats` | Bearer Token | User-scoped dashboard statistics |
| `GET` | `/api/tasks` | Bearer Token | User-scoped tasks (supports `search`, `status`, `priority`, `sort`) |
| `GET` | `/api/tasks/:id` | Bearer Token | User-scoped single task by ID |
| `POST` | `/api/tasks` | Bearer Token | Create task for current user |
| `PUT` | `/api/tasks/:id` | Bearer Token | Update user's task |
| `DELETE` | `/api/tasks/:id` | Bearer Token | Delete user's task |

---

## 🔒 Security & Git Hygiene

- `.env` files are strictly excluded via `.gitignore`.
- Passwords are encrypted using bcrypt salt rounds before persistence.
- JWT tokens expire automatically (`7d`).
- Production build outputs (`dist/`, `build/`) and `node_modules/` are excluded.
- All database operations are strictly scoped to `req.user._id` to prevent unauthorized cross-tenant access.
