import { motion } from "framer-motion";

export default function ActionButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <motion.button
      className="w-full cursor-pointer p-3 rounded-xl border-2 border-dashed border-muted-foreground/30 text-muted-foreground flex items-center justify-center gap-2 hover:border-purple-600 hover:text-purple-600 transition-colors"
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
