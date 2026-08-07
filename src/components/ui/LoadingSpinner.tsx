import clsx from "clsx";
import type { HTMLAttributes } from "react";

type LoadingSpinnerProps = HTMLAttributes<HTMLDivElement> & {
  label?: string;
};

const LoadingSpinner = ({
  label = "Loading your SkillForge experience...",
  className = "",
  ...props
}: LoadingSpinnerProps) => {
  return (
    <div
      className={clsx("relative flex min-h-screen w-full flex-col items-center justify-center gap-5 overflow-hidden bg-background px-6 text-center text-foreground", className)}
      {...props}
      role="status"
      aria-live="polite"
    >
      <div
        className="pointer-events-none absolute size-72 rounded-full bg-soft-primary opacity-40 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative size-16" aria-hidden="true">
        <div className="absolute inset-1 rounded-full border border-primary/20" />
        <div className="absolute inset-1 animate-spin rounded-full border-2 border-transparent border-t-primary border-r-accent" />
        <div className="absolute inset-3 animate-[spin_1.8s_linear_infinite_reverse] rounded-full border border-secondary border-b-accent" />
        <div className="absolute inset-5 rounded-full bg-soft-primary shadow-[0_0_0_5px_var(--soft-primary)]">
          <div className="absolute inset-1 animate-pulse rounded-full bg-primary" />
        </div>
        <span className="absolute left-1/2 top-0 size-1.5 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
      </div>
      <span className="relative max-w-sm text-sm font-medium tracking-wide text-muted-foreground">
        {label}
      </span>
    </div>
  );
};

export default LoadingSpinner;
