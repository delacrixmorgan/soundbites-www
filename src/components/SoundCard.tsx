import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Music } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { db, type Soundbite } from '../db';
import { cn } from '../lib/utils';

interface SoundCardProps {
  id: number;
  sound: Soundbite;
  isOverlay?: boolean;
}

const PASTELS = [
  'bg-pastel-pink',
  'bg-pastel-blue',
  'bg-pastel-green',
  'bg-pastel-yellow',
  'bg-pastel-purple'
];

export default function SoundCard({ id, sound, isOverlay = false }: SoundCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const colorClass = PASTELS[(sound.id || 0) % PASTELS.length];

  const playSound = () => {
    if (isDragging) return;
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }

    const url = URL.createObjectURL(sound.audioBlob);
    const audio = new Audio(url);
    audioRef.current = audio;

    audio.onplay = () => setIsPlaying(true);
    audio.onended = () => {
      setIsPlaying(false);
      URL.revokeObjectURL(url);
      audioRef.current = null;
    };
    audio.onerror = () => {
      setIsPlaying(false);
      URL.revokeObjectURL(url);
      audioRef.current = null;
    };

    audio.play();
  };

  const deleteSound = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Remove "${sound.name}"?`)) {
      await db.soundbites.delete(sound.id!);
    }
  };

  return (
    <motion.div
      ref={setNodeRef}
      layout
      onClick={playSound}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      className={cn(
        "lofi-card aspect-square group p-8 relative flex flex-col items-center justify-center transition-all duration-300",
        isPlaying && "ring-2 ring-lofi-text/10"
      )}
      whileHover={isDragging ? undefined : { y: -6 }}
      whileTap={isDragging ? undefined : { scale: 0.98 }}
    >
      {/* Drag handle — emoji block */}
      <div
        {...attributes}
        {...listeners}
        className={cn(
          "w-20 h-20 rounded-[2.5rem] flex items-center justify-center text-4xl mb-6 transition-transform duration-500 group-hover:scale-110 cursor-grab active:cursor-grabbing",
          colorClass
        )}
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
            >
              <Music className="w-8 h-8 text-lofi-text" />
            </motion.div>
          ) : (
            <span key="static" className="group-hover:rotate-6 transition-transform drop-shadow-sm">
              {sound.emoji}
            </span>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div className="text-center space-y-1 overflow-hidden w-full">
        <h3 className="font-lofi font-semibold text-lofi-text text-lg truncate px-2">{sound.name}</h3>
        <p className="text-[10px] text-lofi-muted uppercase tracking-[0.2em] font-bold p-1">
          REC-{(sound.id || 0).toString().padStart(3, '0')}
        </p>
      </div>

      {/* Delete Action */}
      <button
        onClick={deleteSound}
        className="absolute top-4 right-4 p-2 text-lofi-muted opacity-0 group-hover:opacity-100 transition-all hover:text-red-400 active:scale-90"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Play Progress Dot */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-4 flex gap-1.5"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                className="w-1 h-1 rounded-full bg-lofi-text/40"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
