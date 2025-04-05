import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { Notification } from '@/types';

interface NotificationsProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export default function Notifications({ notifications, onDismiss }: NotificationsProps) {
  useEffect(() => {
    // Set up auto-dismissal for notifications with autoClose flag
    notifications.forEach(notification => {
      if (notification.autoClose) {
        const timer = setTimeout(() => {
          onDismiss(notification.id);
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    });
  }, [notifications, onDismiss]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-4">
      {notifications.map((notification) => (
        <div 
          key={notification.id}
          className={`notification glass-effect backdrop-blur-md rounded-lg shadow-lg p-5 w-80 flex items-start border ${
            notification.type === 'success' 
              ? 'border-green-200 bg-green-50/80' 
              : 'border-red-200 bg-red-50/80'
          } transform transition-all duration-500 animate-in slide-in-from-right`}
        >
          <div className={`rounded-full p-2 ${
            notification.type === 'success' 
              ? 'bg-green-100 text-green-500' 
              : 'bg-red-100 text-red-500'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
          </div>
          <div className="flex-1 ml-3">
            <h4 className="font-semibold text-neutral-800">{notification.title}</h4>
            <p className="text-sm text-neutral-600 mt-1">{notification.message}</p>
          </div>
          <button
            className={`rounded-full w-6 h-6 flex items-center justify-center transition-colors ${
              notification.type === 'success' 
                ? 'text-green-400 hover:bg-green-100' 
                : 'text-red-400 hover:bg-red-100'
            }`}
            onClick={() => onDismiss(notification.id)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
