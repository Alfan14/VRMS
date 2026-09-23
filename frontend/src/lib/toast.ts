export type ToastVariant = 'success' | 'error' | 'warning' | 'info';
type ShowFn = (variant: ToastVariant, title: string, message: string) => void;

let _show: ShowFn | null = null;

export const toast = {
  register(fn: ShowFn) { _show = fn; },

  show(variant: ToastVariant, title: string, message: string) {
    _show?.(variant, title, message);
  },

  success(title: string, message: string) { this.show('success', title, message); },
  error(title: string, message: string)   { this.show('error',   title, message); },
  warning(title: string, message: string) { this.show('warning', title, message); },
  info(title: string, message: string)    { this.show('info',    title, message); },
};
