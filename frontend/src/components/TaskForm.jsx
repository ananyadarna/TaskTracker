import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const TaskForm = ({ task, onClose }) => {
  const { addTask, updateTask } = useTasks();

  const isEdit = !!task;

  // Form Fields State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('medium');
  const [tagInput, setTagInput] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  // Subtasks in-form state
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskText, setNewSubtaskText] = useState('');

  // Validation Errors
  const [errors, setErrors] = useState({});

  // Populate form if editing
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'pending');
      setPriority(task.priority || 'medium');
      setTagInput(task.tags ? task.tags.join(', ') : '');
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
      setSubtasks(task.subtasks || []);
    } else {
      // Clear form
      setTitle('');
      setDescription('');
      setStatus('pending');
      setPriority('medium');
      setTagInput('');
      // Set default due date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDueDate(tomorrow.toISOString().split('T')[0]);
      setSubtasks([]);
    }
    setErrors({});
  }, [task]);

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;

    setSubtasks((prev) => [
      ...prev,
      { _id: `temp-${Date.now()}`, text: newSubtaskText.trim(), isCompleted: false }
    ]);
    setNewSubtaskText('');
  };

  const handleRemoveSubtask = (id) => {
    setSubtasks((prev) => prev.filter((s) => s._id !== id));
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!title.trim()) {
      tempErrors.title = 'Task title is required';
    } else if (title.length > 100) {
      tempErrors.title = 'Title cannot exceed 100 characters';
    }

    if (!dueDate) {
      tempErrors.dueDate = 'Due date is required';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Process tags (split by comma and trim)
    const processedTags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    // Prepare subtasks (remove temp IDs if creating new)
    const processedSubtasks = subtasks.map((s) => {
      if (s._id.toString().startsWith('temp-')) {
        const { _id, ...rest } = s;
        return rest;
      }
      return s;
    });

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      tags: processedTags,
      subtasks: processedSubtasks,
      dueDate
    };

    try {
      if (isEdit) {
        await updateTask(task._id, taskData);
      } else {
        await addTask(taskData);
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="glass-panel modal-content animate-fade-scale">
        {/* Modal Header */}
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Task' : 'Create New Task'}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="task-title">Title *</label>
            <input
              id="task-title"
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={errors.title ? 'input-error' : ''}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              rows={3}
              placeholder="Add some details about this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-row">
            {/* Due Date */}
            <div className="form-group">
              <label htmlFor="task-date">Due Date *</label>
              <input
                id="task-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={errors.dueDate ? 'input-error' : ''}
              />
              {errors.dueDate && <span className="error-text">{errors.dueDate}</span>}
            </div>

            {/* Priority */}
            <div className="form-group">
              <label htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            {/* Status */}
            <div className="form-group">
              <label htmlFor="task-status">Status</label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Tags */}
            <div className="form-group">
              <label htmlFor="task-tags">Tags (comma separated)</label>
              <input
                id="task-tags"
                type="text"
                placeholder="e.g., Work, Coding, Personal"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
              />
            </div>
          </div>

          {/* Subtasks Builder */}
          <div className="form-group subtasks-builder">
            <label>Subtasks / Checklist</label>
            <div className="subtask-input-wrapper">
              <input
                type="text"
                placeholder="Add a step to this task..."
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask(e);
                  }
                }}
              />
              <button type="button" className="btn btn-secondary btn-icon" onClick={handleAddSubtask}>
                <Plus size={16} />
              </button>
            </div>

            {subtasks.length > 0 && (
              <div className="builder-subtask-list">
                {subtasks.map((sub) => (
                  <div key={sub._id} className="builder-subtask-item">
                    <span className="builder-subtask-text">{sub.text}</span>
                    <button
                      type="button"
                      className="builder-subtask-delete"
                      onClick={() => handleRemoveSubtask(sub._id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>

      {/* Styles for TaskForm Modal */}
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          width: 100%;
          max-width: 540px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 2rem;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-glass);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-glass);
        }

        .modal-header h2 {
          font-size: 1.35rem;
          font-weight: 700;
        }

        .close-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          display: flex;
          transition: all var(--transition-fast);
        }

        .close-btn:hover {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .form-group label {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .form-group input[type="text"],
        .form-group input[type="date"],
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.7rem 0.85rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-glass);
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-size: 0.92rem;
          outline: none;
          transition: border-color var(--transition-fast);
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: var(--accent-color);
        }

        .form-group .input-error {
          border-color: var(--danger);
        }

        .error-text {
          font-size: 0.75rem;
          color: var(--danger);
          font-weight: 500;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        @media (max-width: 480px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }

        .subtask-input-wrapper {
          display: flex;
          gap: 0.5rem;
        }

        .builder-subtask-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-top: 0.6rem;
          max-height: 120px;
          overflow-y: auto;
          background-color: var(--bg-primary);
          padding: 0.5rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-glass);
        }

        .builder-subtask-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.35rem 0.5rem;
          background-color: var(--bg-secondary);
          border-radius: 6px;
          border: 1px solid var(--border-glass);
        }

        .builder-subtask-text {
          font-size: 0.82rem;
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 85%;
        }

        .builder-subtask-delete {
          background: none;
          border: none;
          color: var(--text-tertiary);
          cursor: pointer;
          padding: 2px;
          border-radius: 4px;
          display: flex;
          transition: all var(--transition-fast);
        }

        .builder-subtask-delete:hover {
          color: var(--danger);
          background-color: var(--danger-light);
        }

        .form-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 1rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--border-glass);
        }
      `}</style>
    </div>
  );
};
