# Premium MERN Task Tracker

A beautiful, high-fidelity, responsive **Task Tracker Web Application** built using the MERN stack (MongoDB, Express, React, Node.js). It demonstrates modern full-stack development practices, RESTful API design, database management, and reactive UI development.

## 🚀 Features

### Core Capabilities
* **Full CRUD Operations**: Create, view, update, and delete tasks dynamically.
* **RESTful API**: Standardized backend endpoints with robust validation.
* **MongoDB Integration**: Schema-level validation and relational activity logging using Mongoose.
* **Responsive UI**: A fluid sidebar layout that collapses into a drawer on mobile screens.
* **Dynamic Live Updates**: State changes propagate instantly without full-page reloads.

### Premium Additions
* **Subtasks Checklist**: Add granular steps to tasks and track progress via an interactive card progress bar.
* **Color-Coded Tags**: Categorize tasks using custom tags.
* **Real-Time Analytics**: Dashboard panels showing completion rates, task counts, and priority distributions.
* **Activity Feed**: Live log of recent user actions (e.g., "Created task", "Marked as completed").
* **Theme Switcher**: Fully integrated Dark & Light modes with persistent state in `localStorage`.
* **Fuzzy Search & Filters**: Live search with status/priority filters and multiple sorting criteria.

---

## 🛠️ Tech Stack

* **Frontend**: React.js, Vite, Vanilla CSS (Custom variables, Glassmorphism, CSS Grid & Flexbox)
* **Backend**: Node.js, Express.js (ES Modules, Global Error Handling, CORS)
* **Database**: MongoDB, Mongoose
* **Icons**: Lucide React

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
   cd frontend
   # Installs React, Vite, and Lucide Icons
   npm install
   # Start the React client (runs on http://localhost:5173)
   npm run dev
   ```

4. Open your browser and navigate to **[http://localhost:5173](http://localhost:5173)**.

---

## 📋 API Reference

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/tasks` | Fetch all tasks (supports query filters `status`, `priority`, `sort`, `q`) |
| **GET** | `/api/tasks/stats` | Fetch real-time task statistics (completion rates, priorities) |
| **GET** | `/api/activities` | Fetch the 10 most recent activity logs |
| **POST** | `/api/tasks` | Create a new task |
| **PUT** | `/api/tasks/:id` | Update a task's details, status, or subtasks |
| **DELETE** | `/api/tasks/:id` | Delete a task |
