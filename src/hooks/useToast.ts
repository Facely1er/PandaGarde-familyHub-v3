import { useState, useCallback } from 'react';
import { ToastProps } from '../components/ui/Toast';

interface ToastOptions {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const removeToast = useCallback((id: string) => {

    setToasts((prev: ToastProps[]) => prev.filter((toast: ToastProps) => toast.id !== id));
 
    setToasts(prev => prev.filter(toast => toast.id !== id));
 
  }, []);

  const addToast = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastProps = {
      id,
      ...options,
      onClose: () => removeToast(id)
    };

    setToasts((prev: ToastProps[]) => [...prev, newToast]);
    return id;
  }, [removeToast]);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const success = useCallback((title: string, message?: string, options?: Partial<ToastOptions>) => {
    return addToast({
      type: 'success',
      title,
      ...(message && { message }),
      duration: 4000,
      ...options
    });
  }, [addToast]);

  const error = useCallback((title: string, message?: string, options?: Partial<ToastOptions>) => {
    return addToast({
      type: 'error',
      title,
      ...(message && { message }),
      duration: 6000,
      ...options
    });
  }, [addToast]);

  const warning = useCallback((title: string, message?: string, options?: Partial<ToastOptions>) => {
    return addToast({
      type: 'warning',
      title,
      ...(message && { message }),
      duration: 5000,
      ...options
    });
  }, [addToast]);

  const info = useCallback((title: string, message?: string, options?: Partial<ToastOptions>) => {
    return addToast({
      type: 'info',
      title,
      ...(message && { message }),
      duration: 4000,
      ...options
    });
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info
  };
};