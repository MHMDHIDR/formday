import { motion } from "framer-motion";
import { WifiOff, RefreshCw, Home } from "lucide-react";
import { Link } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full text-center space-y-6"
      >
        {/* Icon */}
        <motion.div
          variants={itemVariants}
          className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center"
        >
          <WifiOff className="w-12 h-12 text-muted-foreground" />
        </motion.div>

        {/* Title */}
        <motion.div variants={itemVariants} className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">You're Offline</h1>
          <p className="text-muted-foreground">
            Don't worry! Your data is saved locally. You can still access your
            fitness data and make changes - they'll sync when you're back
            online.
          </p>
        </motion.div>

        {/* Features available offline */}
        <motion.div
          variants={itemVariants}
          className="p-4 rounded-2xl bg-card shadow-card text-left"
        >
          <h3 className="font-semibold text-foreground mb-3">
            Available Offline:
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-success" />
              View and edit workouts
            </li>
            <li className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-success" />
              Track your meals
            </li>
            <li className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-success" />
              Check your progress
            </li>
            <li className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-success" />
              View analytics
            </li>
          </ul>
        </motion.div>

        {/* Actions */}
        <motion.div variants={itemVariants} className="space-y-3">
          <motion.button
            onClick={handleRetry}
            className="w-full p-4 rounded-2xl bg-gradient-accent text-accent-foreground font-semibold flex items-center justify-center gap-2 shadow-card"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className="size-5" />
            Try Again
          </motion.button>

          <Link to="/" className="block w-full">
            <motion.button
              className="w-full p-4 rounded-2xl bg-secondary text-secondary-foreground font-semibold flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Home className="size-5" />
              Go to Home
            </motion.button>
          </Link>
        </motion.div>

        {/* Info */}
        <motion.p
          variants={itemVariants}
          className="text-xs text-muted-foreground"
        >
          All your data is stored locally on your device and will persist even
          when offline.
        </motion.p>
      </motion.div>
    </div>
  );
}
