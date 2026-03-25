import { create } from "zustand";

export type ToastTone = "info" | "success" | "error";

export interface Toast {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
  duration: number;
}

interface ToastInput {
  title: string;
  description?: string;
  tone?: ToastTone;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  pushToast: (toast: ToastInput) => number;
  dismissToast: (id: number) => void;
}

let toastId = 0;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  pushToast: ({ title, description, tone = "info", duration = 4000 }) => {
    const id = ++toastId;

    set((state) => ({
      toasts: [...state.toasts, { id, title, description, tone, duration }],
    }));

    window.setTimeout(() => {
      get().dismissToast(id);
    }, duration);

    return id;
  },
  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));

export function showToast(toast: ToastInput) {
  return useToastStore.getState().pushToast(toast);
}
