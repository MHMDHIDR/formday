import { useState } from "react";
import { motion } from "framer-motion";
import { useFitnessData } from "@/hooks/useFitnessData";
import { BottomNav } from "@/components/BottomNav";
import { User, Mail, Save, Check } from "lucide-react";

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
            <User className="size-6 text-accent" />
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
                  <Check className="w-5 h-5" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
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
