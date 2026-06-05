import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "amber";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-navy-900 text-white hover:bg-navy-800 focus-visible:outline-navy-900 disabled:bg-navy-300",
  secondary:
    "border border-navy-300 bg-white text-navy-900 hover:border-navy-500 hover:bg-navy-50 focus-visible:outline-navy-900 disabled:text-navy-300",
  ghost:
    "text-navy-700 hover:bg-navy-50 focus-visible:outline-navy-900 disabled:text-navy-300",
  danger:
    "border border-red-200 bg-white text-red-700 hover:border-red-400 hover:bg-red-50 focus-visible:outline-red-700 disabled:text-red-300",
  amber:
    "bg-accent-500 text-navy-950 hover:bg-accent-400 focus-visible:outline-accent-700 disabled:bg-accent-300/60",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
};

export function Button({
  variant = "primary",
  loading = false,
  disabled,
  children,
  className = "",
  ...rest
}: Props) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex h-11 items-center justify-center gap-2 px-5 text-sm font-semibold tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  );
}
