import React, { useState } from 'react';
import { Calendar, CheckSquare, Edit3, Trash2, ChevronDown, ChevronUp, Tag } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const TaskCard = ({ task, onEdit }) => {
  const { updateTask, deleteTask } = useTasks();
  const [showSubtasks, setShowSubtasks] = useState(false);

  const { _id, title, description, status, priority, tags, subtasks, dueDate } = task;

  // Calculate subtask completion
  const totalSubtasks = subtasks?.length || 0;
  const completedSubtasks = subtasks?.filter((s) => s.isCompleted).length || 0;
  const subtaskProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Check if task is overdue
  const isOverdue = new Date(dueDate) < new Date() && status !== 'completed';
  const isToday = new Date(dueDate).toDateString() === new Date().toDateString() && status !== 'completed';

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleStatusChange = (newStatus) => {
    updateTask(_id, { ...task, status: newStatus });
  };

  const handleSubtaskToggle = (subtaskId) => {
    const updatedSubtasks = subtasks.map((sub) =>
      sub._id === subtaskId ? { ...sub, isCompleted: !sub.isCompleted } : sub
    );
    updateTask(_id, { ...task, subtasks: updatedSubtasks });
  };

  return (
    <div className={`glass-panel task-card status-${status} ${isOverdue ? 'overdue' : ''}`}>
      {/* Task Header */}
      <div className="task-header">
        <span className={`badge badge-${priority} priority-badge`}>{priority} Priority</span>
        <div className="task-actions">
          <button className="action-btn edit-btn" onClick={() => onEdit(task)} title="Edit Task">
            <Edit3 size={15} />
          </button>
          <button className="action-btn delete-btn" onClick={() => deleteTask(_id)} title="Delete Task">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Task Title & Description */}
      <div className="task-body">
        <h4 className="task-title">{title}</h4>
        {description && <p className="task-desc">{description}</p>}
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="task-tags">
          <Tag size={12} className="tag-icon" />
          {tags.map((tag, idx) => (
            <span key={idx} className="task-tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Subtasks Section */}
      {totalSubtasks > 0 && (
        <div className="task-subtasks-container">
          <div className="subtasks-header" onClick={() => setShowSubtasks(!showSubtasks)}>
            <div className="subtasks-progress-wrapper">
              <CheckSquare size={13} className="subtask-progress-icon" />
              <span className="subtasks-progress-text">
                Checklist ({completedSubtasks}/{totalSubtasks})
              </span>
            </div>
            <div className="progress-bar-container card-progress">
              <div className="progress-bar-fill accent-fill" style={{ width: `${subtaskProgress}%` }} />
            </div>
            <button className="subtask-toggle-btn">
              {showSubtasks ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {showSubtasks && (
            <div className="subtask-list animate-fade-in">
              {subtasks.map((sub) => (
                <label key={sub._id} className="subtask-item">
                  <input
                    type="checkbox"
                    checked={sub.isCompleted}
                    onChange={() => handleSubtaskToggle(sub._id)}
                  />
                  <span className={`subtask-text ${sub.isCompleted ? 'completed' : ''}`}>
                    {sub.text}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Task Footer */}
      <div className="task-footer">
        {/* Due Date */}
        <div className={`due-date-badge ${isOverdue ? 'date-overdue' : isToday ? 'date-today' : ''}`}>
          <Calendar size={13} />
          <span>{formatDate(dueDate)}</span>
        </div>

        {/* Status Dropdown */}
        <div className="status-select-wrapper">
          <select value={status} onChange={(e) => handleStatusChange(e.target.value)}>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Styles for TaskCard */}
      <style>{`
        .task-card {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast);
          position: relative;
          overflow: hidden;
        }

        .task-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background-color: var(--text-tertiary);
        }

        .task-card.status-pending::before { background-color: var(--text-tertiary); }
        .task-card.status-in-progress::before { background-color: var(--accent-color); }
        .task-card.status-completed::before { background-color: var(--success); }

        .task-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-lg);
          border-color: rgba(99, 102, 241, 0.2);
        }

        .task-card.overdue {
          border-color: rgba(239, 68, 68, 0.3);
        }

        .task-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .task-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          background: none;
          border: none;
          color: var(--text-tertiary);
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .action-btn:hover {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .delete-btn:hover {
          color: var(--danger);
          background-color: var(--danger-light);
        }

        .task-title {
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.3;
          margin-bottom: 0.35rem;
        }

        .task-card.status-completed .task-title {
          text-decoration: line-through;
          color: var(--text-tertiary);
        }

        .task-desc {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .task-tags {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.4rem;
        }

        .tag-icon {
          color: var(--text-tertiary);
          margin-right: 2px;
        }

        .task-tag {
          font-size: 0.75rem;
          font-weight: 500;
          padding: 2px 8px;
          background-color: var(--bg-tertiary);
          color: var(--text-secondary);
          border-radius: 10px;
          border: 1px solid var(--border-glass);
        }

        .task-subtasks-container {
          background-color: var(--bg-tertiary);
          border-radius: var(--radius-sm);
          padding: 0.75rem;
          border: 1px solid var(--border-glass);
        }

        .subtasks-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          gap: 0.75rem;
        }

        .subtasks-progress-wrapper {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        .subtask-progress-icon {
          color: var(--text-secondary);
        }

        .subtasks-progress-text {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .card-progress {
          margin: 0;
          flex: 1;
        }

        .subtask-toggle-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          padding: 2px;
        }

        .subtask-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-glass);
        }

        .subtask-item {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 0.8rem;
        }

        .subtask-item input[type="checkbox"] {
          accent-color: var(--accent-color);
          width: 14px;
          height: 14px;
          cursor: pointer;
        }

        .subtask-text.completed {
          text-decoration: line-through;
          color: var(--text-tertiary);
        }

        .task-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 0.5rem;
          border-top: 1px solid var(--border-glass);
        }

        .due-date-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .date-overdue {
          color: var(--danger);
          font-weight: 600;
        }

        .date-today {
          color: var(--warning);
          font-weight: 600;
        }

        .status-select-wrapper select {
          padding: 4px 8px;
          border-radius: 8px;
          border: 1px solid var(--border-glass);
          background-color: var(--bg-secondary);
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-size: 0.8rem;
          font-weight: 500;
          outline: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};
