# TaskFlow: Modern MERN Task Manager

A feature-rich, high-fidelity **Task Management Web Application** built using the MERN stack (MongoDB, Express, React, Node.js). This project demonstrates professional full-stack engineering practices, robust RESTful API design, database modeling, and a polished, responsive user interface.

### 🔗 Live Links
* **Live Demo (Frontend)**: [https://task-tracker-iota-seven.vercel.app](https://task-tracker-iota-seven.vercel.app)
* **API Endpoint (Backend)**: [https://tasktracker-tyu0.onrender.com](https://tasktracker-tyu0.onrender.com)

---

## 🚀 Key Highlights & Engineering Decisions

* **Production-Ready Architecture**: Built as a clean monorepo separating `frontend` and `backend` services.
* **Database Aggregations**: Implemented MongoDB aggregation pipelines to calculate real-time task statistics (completion rates, priority counts, and subtask progress) in a single database query.
* **State Management & Dynamic UI**: Managed global application states using React Context. All CRUD operations, subtask toggling, and status updates propagate instantly across the UI without full-page reloads.
* **Performance & UX Optimization**: Implemented input debouncing (300ms) on the search bar to prevent excessive API requests while typing.
* **Robust Error Handling**: Created a centralized global error-handling middleware in Express to catch and format API errors consistently.
* **State Persistence**: Implemented animated Dark/Light modes with automatic system preference detection and persistence via `localStorage`.

---

## 🧠 Challenges Faced & Solutions

### 1. Real-Time State Synchronization (Snappy UI Experience)
* **The Challenge**: Toggling a subtask inside a task card needed to update the subtask's check status, the parent task's progress bar, the global task list, and the analytics panel simultaneously—all without triggering a jarring page refresh or lag.
* **The Solution**: Designed a centralized React Context (`TaskContext`) to serve as the single source of truth. State-altering actions perform immediate local state updates (optimistic UI) and dispatch background API requests. Upon success, they trigger asynchronous updates to the analytics and activity log states, ensuring the UI remains perfectly in sync.

### 2. Aggregation Efficiency & Database Load (N+1 Query Problem)
* **The Challenge**: Generating dashboard analytics (total tasks, completion percentage, subtask completion rates, and priority counts) could easily result in multiple database queries, causing significant latency as the database grows.
* **The Solution**: Leveraged MongoDB's powerful `$facet` aggregation stage in a single endpoint (`/api/tasks/stats`). This allows the database to run multiple parallel aggregation pipelines in a single query execution, returning all required metrics in a single network round-trip.

### 3. Preventing API Flooding on Live Search
* **The Challenge**: A live-search input that fires an HTTP request on every single keystroke creates unnecessary server load and can lead to out-of-order response bugs if slower requests resolve after faster ones.
* **The Solution**: Implemented a debouncing mechanism (300ms) in the `Sidebar` component using React's `useEffect`. By clearing the timeout on every keystroke, the API call is delayed until the user pauses typing, reducing API calls by up to 80% during active searching.

### 4. Transitioning to ES Modules in Node.js
* **The Challenge**: Configuring the Node/Express backend to use modern ES Module syntax (`import`/`export`) instead of CommonJS (`require`) while ensuring compatibility with development tools like `nodemon` and managing package configuration conflicts.
* **The Solution**: Standardized the project on `"type": "module"`, resolved JSON property conflicts in `package.json`, and structured the import paths with explicit file extensions (e.g., `.js`) to comply with Node's strict ESM loader rules.

---

## 🌐 Deployment

The application is deployed publicly using the following platforms:

* **Frontend**: Hosted on [Vercel](https://vercel.com/) (configured with Vite build presets and continuous deployment).
* **Backend**: Hosted on [Render](https://render.com/) (deployed as a Node.js Web Service).
* **Database**: Hosted on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free Tier M0 cluster with whitelisted access for public servers).

---

## 🛠️ Tech Stack & Tools

* **Frontend**: React.js, Vite, Vanilla CSS (CSS variables, Glassmorphism, CSS Grid & Flexbox)
* **Backend**: Node.js, Express.js (ES Modules, CORS, Dotenv)
* **Database**: MongoDB, Mongoose (validation schemas, nested subtask schemas)
* **Icons**: Lucide React

---

## 🌟 Core Features

* **Full CRUD Operations**: Create, view, edit, and delete tasks dynamically.
* **Subtask Checklist**: Add granular steps to tasks and track progress via an interactive progress bar.
* **Color-Coded Tags**: Categorize tasks using custom labels.
* **Analytics Dashboard**: Visual statistics panel showing task completion rates and priority breakdowns.
* **Activity Feed**: Real-time log of recent user actions (e.g., "Created task", "Marked as completed") fetched from the database.
* **Fuzzy Search & Filters**: Instant search across titles/descriptions with status/priority filters and sorting.

---

## 💻 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v16 or higher)
* [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally on port `27017` (or a MongoDB Atlas URI)

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd TaskTracker
   ```

2. **Set up the Backend**:
   ```bash
   cd backend
   # Installs Express, Mongoose, CORS, dotenv, and Nodemon
   npm install
   # Start the development server (runs on http://localhost:5000)
   npm run dev
   ```

3. **Set up the Frontend**:
   ```bash
   # Open a new terminal window
   cd ../frontend
   # Installs React, Vite, and Lucide Icons
   npm install
   # Start the React client (runs on http://localhost:5173)
   npm run dev
   ```

4. Open your browser and navigate to **[http://localhost:5173](http://localhost:5173)**.

---

## 📋 API Reference

All API endpoints are prefixed with `/api`.

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/tasks` | Fetch all tasks (supports query filters `status`, `priority`, `sort`, `q`) |
| **GET** | `/tasks/stats` | Fetch real-time task statistics (completion rates, priorities) |
| **GET** | `/activities` | Fetch the 10 most recent activity logs |
| **POST** | `/tasks` | Create a new task |
| **PUT** | `/api/tasks/:id` | Update a task's details, status, or subtasks |
| **DELETE** | `/api/tasks/:id` | Delete a task |
