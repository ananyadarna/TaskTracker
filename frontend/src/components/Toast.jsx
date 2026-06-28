import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

const toastStyles = {
  position: 'fixed',
  bottom: '24px',
  right: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  zIndex: 9999,
  pointerEvents: 'none'
};

const toastItemStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 20px',
  minWidth: '280px',
  maxWidth: '400px',
  boxShadow: 'var(--shadow-lg)',
  borderRadius: 'var(--radius-sm)',
  pointerEvents: 'auto',
  overflow: 'hidden',
  position: 'relative'
};

const progressBarStyles = (type) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  height: '3px',
  width: '100%',
  backgroundColor: type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--accent-color)',
  animation: 'shrinkWidth 4s linear forwards'
});

export const ToastContainer = () => {
  const { toasts, removeToast } = useTasks();

  return (
    <div style={toastStyles}>
      {toasts.map((toast) => (
        <ToastNotification key={toast.id} toast={toast} onClose={removeToast} />
      ))}
      {/* Dynamic Keyframe Injection */}
      <style>{`
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

const ToastNotification = ({ toast, onClose }) => {
  const { id, message, type } = toast;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={20} color="var(--success)" />;
      case 'error':
        return <AlertCircle size={20} color="var(--danger)" />;
      default:
        return <Info size={20} color="var(--accent-color)" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'var(--bg-secondary)';
      case 'error':
        return 'var(--bg-secondary)';
      default:
        return 'var(--bg-secondary)';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'rgba(16, 185, 129, 0.2)';
      case 'error':
        return 'rgba(239, 68, 68, 0.2)';
      default:
        return 'var(--border-glass)';
    }
  };

  return (
    <div
      className="glass-panel animate-slide-in"
      style={{
        ...toastItemStyles,
        backgroundColor: getBgColor(),
        borderColor: getBorderColor()
      }}
    >
      <div style={{ display: 'flex', flexShrink: 0 }}>{getIcon()}</div>
      <div style={{ flex: 1, fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' }}>
        {message}
      </div>
      <button
        onClick={() => onClose(id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-tertiary)',
          display: 'flex',
          padding: '2px',
          borderRadius: '50%'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
      >
        <X size={16} />
      </button>
      <div style={progressBarStyles(type)} />
    </div>
  );
};
