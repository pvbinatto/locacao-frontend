import React from 'react';

interface StatusDialogProps {
  isOpen: boolean;
  type: 'success' | 'error' | 'warning';
  title: string;
  message: string;
  onClose: () => void;
  confirmText?: string;
}

const StatusDialog: React.FC<StatusDialogProps> = ({ 
  isOpen, 
  type, 
  title, 
  message, 
  onClose, 
  confirmText = 'Entendi' 
}) => {
  if (!isOpen) return null;

  const config = {
    success: {
      icon: 'check_circle',
      color: 'text-emerald-400',
      bgIcon: 'bg-emerald-400/10',
      border: 'border-emerald-400/20'
    },
    error: {
      icon: 'report',
      color: 'text-error',
      bgIcon: 'bg-error/10',
      border: 'border-error/20'
    },
    warning: {
      icon: 'warning',
      color: 'text-tertiary',
      bgIcon: 'bg-tertiary/10',
      border: 'border-tertiary/20'
    }
  };

  const { icon, color, bgIcon, border } = config[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
      
      <div className={`relative bg-surface-container-low w-full max-w-sm rounded-3xl p-8 border ${border} shadow-2xl shadow-black/50 animate-in zoom-in-95 duration-300 text-center`}>
        <div className={`w-20 h-20 rounded-full ${bgIcon} flex items-center justify-center mx-auto mb-6 scale-110`}>
          <span className={`material-symbols-outlined text-5xl ${color}`}>{icon}</span>
        </div>
        
        <h3 className="text-2xl font-black font-headline tracking-tight text-on-surface mb-2">
          {title}
        </h3>
        
        <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
          {message}
        </p>
        
        <button 
          onClick={onClose}
          className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 ${
            type === 'success' ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-emerald-500/20' : 
            type === 'error' ? 'bg-error text-on-error hover:opacity-90 shadow-error/20' : 
            'bg-tertiary text-on-tertiary hover:opacity-90 shadow-tertiary/20'
          } shadow-lg`}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
};

export default StatusDialog;
