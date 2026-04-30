import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music } from 'lucide-react';
import { type Soundbite } from '../db';
import { cn } from '../lib/utils';

interface CompactCardProps {
  sound: Soundbite;
}

const PASTELS = [
  'bg-pastel-pink',
  'bg-pastel-blue',
  'bg-pastel-green',
  'bg-pastel-yellow',
  'bg-pastel-purple',
];

export default function CompactCard({ sound }: CompactCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const colorClass = PASTELS[(sound.id || 0) % PASTELS.length];

  const playSound = () => {
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

  return (
    <motion.div
      onClick={playSound}
      whileTap={{ scale: 0.93 }}
      className="group cursor-pointer no-drag"
    >
      <div
        className={cn(
          'w-full aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 relative transition-transform duration-200 group-hover:scale-105',
          colorClass,
          isPlaying && 'ring-2 ring-lofi-text/20'
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
              <Music className="w-5 h-5 text-lofi-text" />
            </motion.div>
          ) : (
            <span key="static" className="text-2xl">{sound.emoji}</span>
          )}
        </AnimatePresence>

        <span className="text-[8px] text-lofi-text/60 truncate w-full text-center px-1 leading-tight">
          {sound.name}
        </span>

        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-1 flex gap-0.5"
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
      </div>
    </motion.div>
  );
}
