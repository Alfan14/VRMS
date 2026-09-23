import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Alert from '@/components/ui/alert/Alert';
import { toast, type ToastVariant } from '@/lib/toast';

interface ToastState {
  id: number;
  variant: ToastVariant;
  title: string;
  message: string;
}

export default function ToastProvider() {
  const [current, setCurrent] = useState<ToastState | null>(null);

  useEffect(() => {
    toast.register((variant, title, message) => {
      setCurrent({ id: Date.now(), variant, title, message });
    });
    return () => toast.register(() => {});
  }, []);

  useEffect(() => {
    if (!current) return;
    const timer = setTimeout(() => setCurrent(null), 5000);
    return () => clearTimeout(timer);
  }, [current]);

  if (!current) return null;

  return createPortal(
    <div
      key={current.id}
      className="fixed top-6 right-6 z-[999999] w-full max-w-sm drop-shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-top-5"
    >
      <Alert variant={current.variant} title={current.title} message={current.message} />
    </div>,
    document.body
  );
}
