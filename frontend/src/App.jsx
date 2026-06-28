import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { TaskCard } from './components/TaskCard';
import { TaskForm } from './components/TaskForm';
import { ToastContainer } from './components/Toast';
import { TaskProvider, useTasks } from './context/TaskContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Plus, Menu, X, ClipboardList, Sun, Moon } from 'lucide-react';

const MainApp = () => {
  const { tasks, loading } = useTasks();
  const { theme, toggleTheme } = useTheme();
  
  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Mobile Sidebar State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleOpenForm = (task = null) => {
    setEditingTask(task);
    setIsFormOpen(true);
    setIsMobileSidebarOpen(false); // Close mobile sidebar if open
  };

  const handleCloseForm = () => {
    setEditingTask(null);
    setIsFormOpen(false);
  };

  const getFormattedDate = () => {
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    return new Date().toLocaleDateString(undefined, options);
  };

  return (
    <div className="app-container">
      {/* Mobile Top Header */}
      <header className="mobile-header glass-panel">
        <button className="mobile-menu-btn" onClick={() => setIsMobileSidebarOpen(true)}>
          <Menu size={22} />
        </button>
        <div className="mobile-brand">
          <ClipboardList size={22} color="var(--accent-color)" />
          <span>TaskFlow</span>
        </div>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      {/* Sidebar - Desktop and Mobile (Drawer) */}
      <div className={`sidebar-wrapper ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-backdrop" onClick={() => setIsMobileSidebarOpen(false)} />
        <div className="sidebar-drawer">
          <button className="mobile-sidebar-close" onClick={() => setIsMobileSidebarOpen(false)}>
            <X size={20} />
          </button>
          <Sidebar onOpenForm={handleOpenForm} />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Workspace Header */}
        <header className="content-header">
          <div className="header-title-wrapper">
            <h1>My Workspace</h1>
            <p className="current-date">{getFormattedDate()}</p>
          </div>
          <button className="btn btn-primary header-action-btn" onClick={() => handleOpenForm(null)}>
            <Plus size={16} />
            <span>New Task</span>
          </button>
        </header>

        {/* Analytics Section */}
        <AnalyticsPanel />

        {/* Task Grid Section */}
        <section className="task-section">
          <h2 className="section-title">Tasks</h2>
          
          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Loading your tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="glass-panel empty-state">
              <ClipboardList size={48} className="empty-icon" />
              <h3>No tasks found</h3>
              <p>Get started by creating your very first task!</p>
              <button className="btn btn-primary" onClick={() => handleOpenForm(null)}>
                <Plus size={16} />
                <span>Add Task</span>
              </button>
            </div>
          ) : (
            <div className="task-grid">
              {tasks.map((task) => (
                <TaskCard key={task._id} task={task} onEdit={handleOpenForm} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Task Form Modal */}
      {isFormOpen && <TaskForm task={editingTask} onClose={handleCloseForm} />}

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Local App-Specific Styles */}
      <style>{`
        /* Mobile Header */
        .mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          border-radius: 0;
          border-top: none;
          border-left: none;
          border-right: none;
          padding: 0 1.5rem;
          align-items: center;
          justify-content: space-between;
          z-index: 90;
        }

        .mobile-menu-btn {
          background: none;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          display: flex;
        }

        .mobile-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          font-size: 1.15rem;
        }

        /* Sidebar Wrapper & Drawer for Mobile */
        .sidebar-wrapper {
          position: relative;
        }

        .sidebar-drawer {
          height: 100%;
        }

        .mobile-sidebar-close {
          display: none;
        }

        /* Content Header */
        .content-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
        }

        .content-header h1 {
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .current-date {
          font-size: 0.95rem;
          color: var(--text-secondary);
          font-weight: 500;
          margin-top: 0.15rem;
        }

        /* Task Grid */
        .task-section {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .section-title {
          font-size: 1.3rem;
          font-weight: 700;
          letter-spacing: -0.3px;
          color: var(--text-primary);
        }

        .task-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        /* States */
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 5rem 0;
          gap: 1rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--bg-tertiary);
          border-top-color: var(--accent-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
          gap: 0.75rem;
        }

        .empty-icon {
          color: var(--text-tertiary);
          margin-bottom: 0.5rem;
        }

        .empty-state h3 {
          font-size: 1.3rem;
          font-weight: 700;
        }

        .empty-state p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          max-width: 300px;
          margin-bottom: 0.75rem;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .mobile-header {
            display: flex;
          }

          .sidebar-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1100;
            pointer-events: none;
            visibility: hidden;
            transition: visibility var(--transition-fast);
          }

          .sidebar-wrapper.mobile-open {
            pointer-events: auto;
            visibility: visible;
          }

          .sidebar-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(4px);
            opacity: 0;
            transition: opacity var(--transition-normal);
          }

          .sidebar-wrapper.mobile-open .sidebar-backdrop {
            opacity: 1;
          }

          .sidebar-drawer {
            position: absolute;
            top: 0;
            left: 0;
            width: 290px;
            height: 100%;
            transform: translateX(-100%);
            transition: transform var(--transition-normal);
            box-shadow: var(--shadow-lg);
          }

          .sidebar-wrapper.mobile-open .sidebar-drawer {
            transform: translateX(0);
          }

          .mobile-sidebar-close {
            display: flex;
            position: absolute;
            right: 12px;
            top: 18px;
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            z-index: 120;
          }

          /* Force Sidebar inside Drawer to be 100% and visible */
          .sidebar-drawer .sidebar {
            display: flex !important;
            width: 100% !important;
            height: 100% !important;
            position: relative !important;
            box-shadow: none !important;
          }

          .sidebar-drawer .create-task-btn,
          .sidebar-drawer .sidebar-section {
            display: flex !important;
          }

          .header-action-btn {
            display: none; /* Hide top right action button on tablet/mobile, use sidebar or mobile layout */
          }
        }
      `}</style>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <MainApp />
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;
