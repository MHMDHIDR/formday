import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface NavCardProps extends Omit<HTMLMotionProps<"button">, "children"> {
  icon: LucideIcon;
  label: string;
  description?: string;
  variant?: "default" | "primary" | "accent";
}

const variantStyles = {
  default: "bg-card hover:bg-secondary/50",
  primary: "bg-primary text-primary-foreground",
  accent: "bg-accent text-accent-foreground",
};

export function NavCard({
  icon: Icon,
  label,
  description,
  variant = "default",
  className,
  ...props
}: NavCardProps) {
  return (
    <motion.button
      className={cn(
        "relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl",
        "card-interactive tap-target cursor-pointer",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variantStyles[variant],
        className,
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      <Icon className="w-8 h-8" strokeWidth={1.5} />
      <span className="text-sm font-semibold">{label}</span>
      {description && (
        <span className="text-xs text-muted-foreground text-center">
          {description}
        </span>
      )}
    </motion.button>
  );
}
