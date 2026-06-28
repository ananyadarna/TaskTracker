import React from 'react';
import { CheckCircle2, ListTodo, AlertTriangle, TrendingUp } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const AnalyticsPanel = () => {
  const { stats } = useTasks();

  const { totalTasks, statusBreakdown, priorityBreakdown, subtasks, completionRate } = stats;

  return (
    <div className="analytics-grid">
      {/* Total Tasks Card */}
      <div className="glass-panel stat-card">
        <div className="stat-icon-wrapper todo-icon">
          <ListTodo size={22} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Total Tasks</span>
          <h3 className="stat-value">{totalTasks}</h3>
          <span className="stat-desc">
            {statusBreakdown.pending} pending, {statusBreakdown['in-progress']} in progress
          </span>
        </div>
      </div>

      {/* Completion Rate Card */}
      <div className="glass-panel stat-card">
        <div className="stat-icon-wrapper success-icon">
          <CheckCircle2 size={22} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Completion Rate</span>
          <h3 className="stat-value">{completionRate}%</h3>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${completionRate}%` }} />
          </div>
          <span className="stat-desc">{statusBreakdown.completed} of {totalTasks} tasks completed</span>
        </div>
      </div>

      {/* Subtasks Progress Card */}
      <div className="glass-panel stat-card">
        <div className="stat-icon-wrapper trend-icon">
          <TrendingUp size={22} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Subtask Progress</span>
          <h3 className="stat-value">
            {subtasks.total > 0 ? Math.round((subtasks.completed / subtasks.total) * 100) : 0}%
          </h3>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill accent-fill"
              style={{
                width: `${subtasks.total > 0 ? (subtasks.completed / subtasks.total) * 100 : 0}%`
              }}
            />
          </div>
          <span className="stat-desc">
            {subtasks.completed} of {subtasks.total} subtasks done
          </span>
        </div>
      </div>

      {/* Priorities Card */}
      <div className="glass-panel stat-card">
        <div className="stat-icon-wrapper danger-icon">
          <AlertTriangle size={22} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Tasks by Priority</span>
          <div className="priority-breakdown">
            <div className="priority-item">
              <span className="priority-dot low-dot" />
              <span className="priority-label">Low</span>
              <span className="priority-count">{priorityBreakdown.low}</span>
            </div>
            <div className="priority-item">
              <span className="priority-dot medium-dot" />
              <span className="priority-label">Med</span>
              <span className="priority-count">{priorityBreakdown.medium}</span>
            </div>
            <div className="priority-item">
              <span className="priority-dot high-dot" />
              <span className="priority-label">High</span>
              <span className="priority-count">{priorityBreakdown.high}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Styles for AnalyticsPanel */}
      <style>{`
        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .stat-card {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .stat-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 12px;
        }

        .todo-icon {
          background-color: var(--accent-light);
          color: var(--accent-color);
        }

        .success-icon {
          background-color: var(--success-light);
          color: var(--success);
        }

        .trend-icon {
          background-color: rgba(99, 102, 241, 0.1);
          color: var(--accent-color);
        }

        .danger-icon {
          background-color: var(--danger-light);
          color: var(--danger);
        }

        .stat-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .stat-value {
          font-size: 1.6rem;
          font-weight: 700;
          margin: 0.2rem 0;
          line-height: 1;
        }

        .stat-desc {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          font-weight: 500;
        }

        .progress-bar-container {
          width: 100%;
          height: 6px;
          background-color: var(--bg-tertiary);
          border-radius: 3px;
          margin: 0.4rem 0;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background-color: var(--success);
          border-radius: 3px;
          transition: width var(--transition-slow);
        }

        .progress-bar-fill.accent-fill {
          background-color: var(--accent-color);
        }

        .priority-breakdown {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          margin-top: 0.35rem;
        }

        .priority-item {
          display: flex;
          align-items: center;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .priority-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          margin-right: 0.5rem;
        }

        .low-dot { background-color: var(--success); }
        .medium-dot { background-color: var(--warning); }
        .high-dot { background-color: var(--danger); }

        .priority-label {
          color: var(--text-secondary);
          flex: 1;
        }

        .priority-count {
          color: var(--text-primary);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};
