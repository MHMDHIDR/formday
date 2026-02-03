import { useState } from "react";
import { motion } from "framer-motion";
import { useFitnessData } from "@/hooks/useFitnessData";
import { BottomNav } from "@/components/BottomNav";
import { User, Mail, Save, Check, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

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

const ProfilePage = () => {
  const { profile, setProfile } = useFitnessData();
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setProfile({ name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto py-4 px-2">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <User className="size-6 text-primary" />
            Profile
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your personal settings
          </p>
        </div>
      </header>

      <main className="container pt-6 pb-10 mx-auto px-2">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Avatar */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-accent flex items-center justify-center shadow-lg">
              <User className="w-12 h-12 text-accent-foreground" />
            </div>
          </motion.div>

          {/* Form */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="p-4 rounded-2xl bg-card shadow-card space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <User className="size-4" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground border-none outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Enter your name"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Mail className="size-4" />
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground border-none outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Enter your email"
                />
              </div>

              {/* Theme Toggle */}
              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-secondary text-foreground">
                    {theme === "dark" ? (
                      <Moon className="size-5" />
                    ) : (
                      <Sun className="size-5" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      Appearance
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {theme === "dark" ? "Dark mode" : "Light mode"}
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={`w-14 h-8 rounded-full flex items-center p-1 cursor-pointer transition-colors duration-300 ${
                    theme === "dark" ? "bg-primary" : "bg-secondary"
                  }`}
                >
                  <motion.div
                    className="w-6 h-6 bg-white rounded-full shadow-md"
                    layout
                    transition={{ type: "spring", stiffness: 700, damping: 30 }}
                    animate={{
                      x: theme === "dark" ? 24 : 0,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <motion.button
              className="w-full p-4 rounded-2xl bg-gradient-accent text-accent-foreground font-semibold flex items-center justify-center gap-2 shadow-card"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
            >
              {saved ? (
                <>
                  <Check className="size-5" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="size-5" />
                  Save Changes
                </>
              )}
            </motion.button>
          </motion.div>

          {/* App Info */}
          <motion.div variants={itemVariants}>
            <div className="p-4 rounded-2xl bg-card shadow-card text-center">
              <h3 className="font-bold text-lg text-foreground">Formday</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Progress, not perfection.
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                Version 1.0.0 • Made with 💪
              </p>
            </div>
          </motion.div>

          {/* Note about data */}
          <motion.div variants={itemVariants}>
            <p className="text-sm text-muted-foreground text-center px-4">
              All your data is stored locally on your device. No account needed,
              no data leaves your phone.
            </p>
          </motion.div>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
