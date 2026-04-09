import { useUI } from '../context/UIContext.jsx';
import { useEffect } from 'react';

export default function Toast() {
  const { toast } = useUI();
  if (!toast) return null;

  const colors = {
    success: 'bg-green-500/20 border-green-500/50 text-green-300',
    error: 'bg-red-500/20 border-red-500/50 text-red-300',
    info: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
    warning: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300',
  };

  return (
    <div className={`fixed bottom-24 right-4 z-50 px-4 py-3 rounded-xl border ${colors[toast.type] || colors.info} backdrop-blur-md shadow-xl animate-fade-in flex items-center gap-2 max-w-sm`}>
      {toast.type === 'success' && (
        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
        </svg>
      )}
      {toast.type === 'error' && (
        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      )}
      <span className="text-sm font-medium">{toast.message}</span>
    </div>
  );
}
