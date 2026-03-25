import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { useToastStore, type Toast } from "../../store/toast-store";

function getToastTone(toast: Toast) {
  if (toast.tone === "success") {
    return {
      icon: CheckCircle2,
      className: "border-success/20 bg-success/10 text-success",
    };
  }

  if (toast.tone === "error") {
    return {
      icon: TriangleAlert,
      className: "border-danger/20 bg-danger/10 text-danger",
    };
  }

  return {
    icon: Info,
    className: "border-primary/20 bg-primary/10 text-primary",
  };
}

export function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] mx-auto flex w-full max-w-md flex-col gap-3 px-4">
      {toasts.map((toast) => {
        const tone = getToastTone(toast);
        const Icon = tone.icon;

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border shadow-soft backdrop-blur ${tone.className}`}
          >
            <div className="flex items-start gap-3 px-4 py-3">
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.description && (
                  <p className="mt-1 text-sm text-foreground/80">{toast.description}</p>
                )}
              </div>
              <button
                type="button"
                className="rounded-full p-1 text-foreground/60 transition hover:bg-black/5 hover:text-foreground"
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
