import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const TaskContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    statusBreakdown: { pending: 0, 'in-progress': 0, completed: 0 },
    priorityBreakdown: { low: 0, medium: 0, high: 0 },
    subtasks: { total: 0, completed: 0 },
    completionRate: 0
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Toast Helpers
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/tasks/stats`);
      if (!res.ok) throw new Error('Failed to fetch statistics');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err.message);
    }
  }, []);

  // Fetch Activities
  const fetchActivities = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/activities`);
      if (!res.ok) throw new Error('Failed to fetch activities');
      const data = await res.json();
      setActivities(data);
    } catch (err) {
      console.error('Error fetching activities:', err.message);
    }
  }, []);

  // Fetch Tasks with filters
  const fetchTasks = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.priority && filters.priority !== 'all') params.append('priority', filters.priority);
      if (filters.q) params.append('q', filters.q);
      if (filters.sort) params.append('sort', filters.sort);

      const res = await fetch(`${API_URL}/tasks?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // Add Task
  const addTask = async (taskData) => {
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to create task');
      }
      const newTask = await res.json();
      
      // Update state immediately
      setTasks((prev) => [newTask, ...prev]);
      addToast('Task created successfully!', 'success');
      
      // Refresh analytics and activities
      fetchStats();
      fetchActivities();
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    }
  };

  // Update Task
  const updateTask = async (id, taskData) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to update task');
      }
      const updatedTask = await res.json();

      // Update state immediately
      setTasks((prev) => prev.map((t) => (t._id === id ? updatedTask : t)));
      addToast('Task updated successfully!', 'success');

      // Refresh analytics and activities
      fetchStats();
      fetchActivities();
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to delete task');
      }
      
      // Update state immediately
      setTasks((prev) => prev.filter((t) => t._id !== id));
      addToast('Task deleted successfully!', 'success');

      // Refresh analytics and activities
      fetchStats();
      fetchActivities();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Initial load of stats and activities
  useEffect(() => {
    fetchStats();
    fetchActivities();
  }, [fetchStats, fetchActivities]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        stats,
        activities,
        loading,
        error,
        toasts,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        addToast,
        removeToast,
        fetchStats,
        fetchActivities
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
