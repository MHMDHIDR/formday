"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Share, Plus } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { useState } from "react";

export function InstallPrompt() {
  const { canInstall, isIOS, isStandalone, install, dismiss, isDismissed } =
    usePWAInstall();
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  // Don't show if already installed or dismissed
  if (isStandalone || isDismissed) {
    return null;
  }

  // Show iOS instructions if on iOS and not installed
  if (isIOS && !isStandalone) {
    return (
      <AnimatePresence>
        {!showIOSInstructions ? (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-24 left-4 right-4 z-40"
          >
            <div className="bg-card rounded-2xl shadow-lg p-4 border border-border">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center shrink-0">
                    <Download className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Install Formday
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Add to home screen for the best experience
                    </p>
                  </div>
                </div>
                <button
                  onClick={dismiss}
                  className="p-1 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <motion.button
                onClick={() => setShowIOSInstructions(true)}
                className="mt-3 w-full p-3 rounded-xl bg-gradient-accent text-accent-foreground font-medium flex items-center justify-center gap-2"
                whileTap={{ scale: 0.98 }}
              >
                <Share className="w-4 h-4" />
                Show Instructions
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card rounded-2xl shadow-lg p-6 max-w-sm w-full border border-border"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">
                  Install on iOS
                </h3>
                <button
                  onClick={() => {
                    setShowIOSInstructions(false);
                    dismiss();
                  }}
                  className="p-1 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Tap the Share button
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      Look for <Share className="w-4 h-4 inline" /> at the
                      bottom of Safari
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Select "Add to Home Screen"
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      Scroll down and tap <Plus className="w-4 h-4 inline" />{" "}
                      Add to Home Screen
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Tap "Add"</p>
                    <p className="text-sm text-muted-foreground">
                      Confirm to add Formday to your home screen
                    </p>
                  </div>
                </li>
              </ol>

              <motion.button
                onClick={() => {
                  setShowIOSInstructions(false);
                  dismiss();
                }}
                className="mt-6 w-full p-3 rounded-xl bg-secondary text-secondary-foreground font-medium"
                whileTap={{ scale: 0.98 }}
              >
                Got it!
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Show install button for Android/Desktop if available
  if (!canInstall) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-24 left-4 right-4 z-40"
    >
      <div className="bg-card rounded-2xl shadow-lg p-4 border border-border">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center shrink-0">
              <Download className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Install Formday</h3>
              <p className="text-sm text-muted-foreground">
                Get quick access from your home screen
              </p>
            </div>
          </div>
          <button
            onClick={dismiss}
            className="p-1 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="mt-3 flex gap-2">
          <motion.button
            onClick={install}
            className="flex-1 p-3 rounded-xl bg-gradient-accent text-accent-foreground font-medium flex items-center justify-center gap-2"
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            Install
          </motion.button>
          <motion.button
            onClick={dismiss}
            className="px-4 p-3 rounded-xl bg-secondary text-secondary-foreground font-medium"
            whileTap={{ scale: 0.98 }}
          >
            Later
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
