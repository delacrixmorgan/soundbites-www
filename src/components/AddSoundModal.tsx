import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Music, Dice5 } from 'lucide-react';
import { db } from '../db';
import { cn } from '../lib/utils';

interface AddSoundModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMOJIS = ['🌸', '🍃', '☁️', '🌙', '🧸', '🍵', '🎨', '📚', '🧺', '🪴', '🌤️', '🫧', '🐚', '🍄', '🥞', '🧶'];

export default function AddSoundModal({ isOpen, onClose }: AddSoundModalProps) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !file) return;

    setIsUploading(true);
    try {
      await db.soundbites.add({
        name,
        emoji,
        audioBlob: file,
        createdAt: Date.now(),
      });
      setName('');
      setFile(null);
      setEmoji(EMOJIS[0]);
      onClose();
    } catch (error) {
      console.error('Failed to add soundbite:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-lofi-text/10 backdrop-blur-md dark:bg-black/60"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-lofi-surface rounded-[2.5rem] p-10 shadow-2xl border border-lofi-border"
          >
            {/* Header */}
            <div className="flex flex-col mb-10">
              <h2 className="text-2xl font-lofi font-semibold text-lofi-text mb-1">New Tape</h2>
              <span className="text-[10px] text-lofi-muted uppercase tracking-[0.2em] font-bold">Sound Capture Protocol</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] text-lofi-muted uppercase tracking-[0.2em] font-bold pl-1 italic">Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Designation..."
                  className="w-full bg-lofi-bg border-none rounded-2xl px-5 py-4 focus:ring-2 ring-lofi-border transition-all font-medium text-lofi-text placeholder:text-lofi-muted/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-lofi-muted uppercase tracking-[0.2em] font-bold pl-1 italic">Identifier</label>
                <div className="grid grid-cols-4 gap-2 p-3 bg-lofi-bg rounded-2xl">
                  {EMOJIS.slice(0, 8).map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setEmoji(e)}
                      className={cn(
                        "w-12 h-12 flex items-center justify-center text-2xl rounded-xl transition-all",
                        emoji === e ? "bg-white dark:bg-lofi-muted/20 shadow-sm scale-110" : "hover:bg-white/40"
                      )}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-lofi-muted uppercase tracking-[0.2em] font-bold pl-1 italic">Source</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center gap-2 transition-all cursor-pointer group",
                    file ? "border-lofi-text bg-lofi-text/5" : "border-lofi-border hover:border-lofi-muted"
                  )}
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/*" className="hidden" />
                  {file ? (
                    <>
                      <Music className="w-6 h-6 text-lofi-text" />
                      <span className="text-xs font-medium text-lofi-text truncate max-w-full italic px-4">{file.name}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-lofi-muted group-hover:text-lofi-text transition-colors" />
                      <span className="text-xs font-medium text-lofi-muted group-hover:text-lofi-text transition-colors">Import Binary Data</span>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 text-[10px] text-lofi-muted uppercase tracking-[0.2em] font-bold hover:text-lofi-text transition-colors"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !file || !name}
                  className="flex-[2] bg-lofi-text text-white py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] font-bold shadow-lg shadow-lofi-text/20 hover:shadow-xl active:scale-95 transition-all disabled:opacity-20"
                >
                  {isUploading ? "Syncing..." : "Commit Tape"}
                </button>
              </div>
            </form>

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
