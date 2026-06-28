import React, { useState, useEffect } from 'react';
import { Plus, Search, CheckSquare, Sun, Moon, Clock, ArrowUpDown } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';

export const Sidebar = ({ onOpenForm }) => {
  const { fetchTasks, activities } = useTasks();
  const { theme, toggleTheme } = useTheme();

  // Filter state
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    q: '',
    sort: 'createdAt:desc'
  });

  // Fetch tasks whenever filters change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchTasks(filters);
    }, 300); // 300ms debounce for search query

    return () => clearTimeout(delayDebounce);
  }, [filters, fetchTasks]);

  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <aside className="glass-panel sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand">
          <CheckSquare size={26} color="var(--accent-color)" />
          <h2>TaskFlow</h2>
        </div>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Action Button */}
      <button className="btn btn-primary create-task-btn" onClick={() => onOpenForm(null)}>
        <Plus size={18} />
        <span>Create Task</span>
      </button>

      {/* Filters Section */}
      <div className="sidebar-section">
        <h3>Search & Filters</h3>
        
        {/* Search */}
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.q}
            onChange={(e) => handleChange('q', e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="filter-group">
          <label>Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="filter-group">
          <label>Priority</label>
          <select
            value={filters.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Sort */}
        <div className="filter-group">
          <label>Sort By</label>
          <div className="sort-select-wrapper">
            <ArrowUpDown size={14} className="sort-icon" />
            <select
              value={filters.sort}
              onChange={(e) => handleChange('sort', e.target.value)}
            >
              <option value="createdAt:desc">Newest First</option>
              <option value="createdAt:asc">Oldest First</option>
              <option value="dueDate:asc">Due Date: Soonest</option>
              <option value="dueDate:desc">Due Date: Latest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="sidebar-section activity-section">
        <h3>Activity Log</h3>
        <div className="activity-list">
          {activities.length === 0 ? (
            <div className="empty-activities">No recent activity</div>
          ) : (
            activities.map((act) => (
              <div key={act._id} className="activity-item">
                <Clock size={12} className="activity-clock-icon" />
                <div className="activity-details">
                  <span className="activity-action">{act.action}</span>{' '}
                  <span className="activity-title" title={act.taskTitle}>
                    "{act.taskTitle}"
                  </span>
                  <span className="activity-time">{formatTime(act.timestamp)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Styles for Sidebar */}
      <style>{`
        .sidebar {
          width: var(--sidebar-width);
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          border-radius: 0;
          border-left: none;
          border-top: none;
          border-bottom: none;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          z-index: 100;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .brand h2 {
          font-size: 1.4rem;
          font-weight: 700;
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .theme-toggle {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-glass);
          color: var(--text-secondary);
          padding: 0.5rem;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .theme-toggle:hover {
          color: var(--text-primary);
          background: var(--border-glass);
        }

        .create-task-btn {
          width: 100%;
          padding: 0.85rem;
          font-weight: 600;
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.15);
        }

        .sidebar-section h3 {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-tertiary);
          margin-bottom: 0.85rem;
          font-weight: 700;
        }

        .search-box {
          position: relative;
          width: 100%;
          margin-bottom: 1rem;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-tertiary);
          pointer-events: none;
        }

        .search-box input {
          width: 100%;
          padding: 0.65rem 0.75rem 0.65rem 2.25rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-glass);
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-size: 0.9rem;
          outline: none;
          transition: border-color var(--transition-fast);
        }

        .search-box input:focus {
          border-color: var(--accent-color);
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-bottom: 1rem;
        }

        .filter-group label {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .filter-group select {
          width: 100%;
          padding: 0.6rem 0.75rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-glass);
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-size: 0.9rem;
          outline: none;
          cursor: pointer;
        }

        .sort-select-wrapper {
          position: relative;
        }

        .sort-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-tertiary);
          pointer-events: none;
        }

        .sort-select-wrapper select {
          padding-right: 2rem;
          appearance: none;
        }

        .activity-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0; /* Important for scroll */
        }

        .activity-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding-right: 4px;
        }

        .empty-activities {
          font-size: 0.85rem;
          color: var(--text-tertiary);
          text-align: center;
          padding: 1rem 0;
        }

        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.8rem;
          line-height: 1.3;
        }

        .activity-clock-icon {
          margin-top: 2px;
          color: var(--text-tertiary);
          flex-shrink: 0;
        }

        .activity-details {
          display: flex;
          flex-direction: column;
        }

        .activity-action {
          color: var(--text-primary);
          font-weight: 500;
        }

        .activity-title {
          color: var(--accent-color);
          font-weight: 500;
          word-break: break-all;
        }

        .activity-time {
          font-size: 0.7rem;
          color: var(--text-tertiary);
          margin-top: 2px;
        }

        @media (max-width: 1024px) {
          .sidebar {
            width: 100%;
            height: auto;
            position: fixed;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding: 0.85rem 1.5rem;
            border-bottom: 1px solid var(--border-glass);
            border-right: none;
          }

          .create-task-btn,
          .sidebar-section {
            display: none; /* Let's hide filters or put them in a dropdown on mobile */
          }
        }
      `}</style>
    </aside>
  );
};
