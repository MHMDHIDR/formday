import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps extends Omit<HTMLMotionProps<"div">, "children"> {
  value: number;
  label?: string;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "workout" | "meal";
}

const sizeClasses = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

const variantClasses = {
  default: "progress-gradient",
  success: "bg-success",
  workout: "bg-workout",
  meal: "bg-accent",
};

export function ProgressBar({
  value,
  label,
  showPercentage = true,
  size = "md",
  variant = "default",
  className,
  ...props
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-sm font-medium text-foreground">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-semibold text-muted-foreground">
              {clampedValue}%
            </span>
          )}
        </div>
      )}
      <div className="relative w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className={cn(
            "h-full rounded-full",
            sizeClasses[size],
            variantClasses[variant],
          )}
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          {...props}
        />
      </div>
    </div>
  );
}
