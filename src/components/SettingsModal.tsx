import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Github, Shield, Info, ExternalLink } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-lofi-text/20 backdrop-blur-md dark:bg-black/60"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-lofi-surface rounded-[2.5rem] p-10 shadow-2xl border border-lofi-border overflow-hidden"
          >
            <div className="flex flex-col mb-8">
              <h2 className="text-2xl font-lofi font-semibold text-lofi-text mb-1">Settings</h2>
              <span className="text-[10px] text-lofi-muted uppercase tracking-[0.2em] font-bold">Preferences & Info</span>
            </div>

            <div className="space-y-6">
              {/* About Section */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-lofi-text">
                  <Info className="w-4 h-4" />
                  <h3 className="font-semibold text-sm">About Sound Archive</h3>
                </div>
                <p className="text-xs text-lofi-muted leading-relaxed">
                  A minimalist toolkit for curators of sound. Designed to capture and organize auditory fragments 
                  in a focused, lofi environment. Version 1.0.4.
                </p>
              </section>

              {/* GitHub Section */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-lofi-text">
                  <Github className="w-4 h-4" />
                  <h3 className="font-semibold text-sm">Open Source</h3>
                </div>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-lofi-bg rounded-2xl group hover:bg-pastel-blue transition-colors"
                >
                  <span className="text-xs font-medium">Contribute on GitHub</span>
                  <ExternalLink className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity" />
                </a>
              </section>

              {/* Privacy Section */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-lofi-text">
                  <Shield className="w-4 h-4" />
                  <h3 className="font-semibold text-sm">Privacy Policy</h3>
                </div>
                <p className="text-xs text-lofi-muted leading-relaxed">
                  Your data (audio files and names) is stored locally on your device using IndexedDB. 
                  No information is ever uploaded to a server or shared with third parties.
                </p>
              </section>
            </div>

            <div className="mt-10 pt-6 border-t border-lofi-border flex justify-end">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-lofi-text text-white rounded-2xl text-[10px] uppercase tracking-[0.2em] font-bold hover:opacity-90 active:scale-95 transition-all"
              >
                Close
              </button>
            </div>

            <button 
              onClick={onClose}
              className="absolute top-10 right-10 text-lofi-muted hover:text-lofi-text transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
