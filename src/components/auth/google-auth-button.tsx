import { Button, type ButtonProps } from "../ui/button";

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M21.64 12.2c0-.64-.06-1.25-.16-1.84H12v3.48h5.41a4.63 4.63 0 0 1-2 3.04v2.52h3.24c1.9-1.75 2.99-4.33 2.99-7.2Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.61-2.44l-3.24-2.52c-.9.6-2.04.96-3.37.96-2.59 0-4.79-1.75-5.57-4.1H3.08v2.6A9.98 9.98 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC04"
        d="M6.43 13.9A5.98 5.98 0 0 1 6.12 12c0-.66.11-1.29.31-1.9V7.5H3.08a9.98 9.98 0 0 0 0 9l3.35-2.6Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.96c1.47 0 2.78.5 3.81 1.48l2.85-2.85C16.95 2.99 14.69 2 12 2a9.98 9.98 0 0 0-8.92 5.5l3.35 2.6c.78-2.35 2.98-4.14 5.57-4.14Z"
      />
    </svg>
  );
}

interface GoogleAuthButtonProps extends Omit<ButtonProps, "children"> {
  label: string;
}

export function GoogleAuthButton({ label, ...props }: GoogleAuthButtonProps) {
  return (
    <Button variant="outline" {...props}>
      <GoogleIcon />
      {label}
    </Button>
  );
}
