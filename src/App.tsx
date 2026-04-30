import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Plus, Coffee, Sparkles, Heart, Settings, Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { db } from './db';
import SoundCard from './components/SoundCard';
import AddSoundModal from './components/AddSoundModal';
import SettingsModal from './components/SettingsModal';
import { cn } from './lib/utils';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    }
    return 'light';
  });

  const soundbites = useLiveQuery(() => db.soundbites.orderBy('order').toArray());

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragCancel = () => setActiveId(null);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id || !soundbites) return;

    const oldIndex = soundbites.findIndex(s => s.id === active.id);
    const newIndex = soundbites.findIndex(s => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(soundbites, oldIndex, newIndex);
    await db.soundbites.bulkUpdate(
      reordered.map((s, i) => ({ key: s.id!, changes: { order: i } }))
    );
  };

  const activeSoundbite = activeId != null
    ? soundbites?.find(s => s.id === activeId) ?? null
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-lofi-bg relative overflow-hidden transition-colors duration-300">
      {/* Soft Background Accents */}
      <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,#fce4ec_0%,transparent_50%),radial-gradient(circle_at_80%_80%,#e3f2fd_0%,transparent_50%)] opacity-30 pointer-events-none dark:opacity-10" />

      {/* Header — draggable region for Electron's hidden title bar */}
      <header className="px-6 pt-16 pb-12 relative z-10 drag-region">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <div className="absolute top-8 right-6 flex gap-4">
            <button
              onClick={toggleTheme}
              className="no-drag p-3 bg-white dark:bg-lofi-surface rounded-full border border-lofi-border shadow-sm hover:scale-110 active:scale-95 transition-all text-lofi-text"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="no-drag p-3 bg-white dark:bg-lofi-surface rounded-full border border-lofi-border shadow-sm hover:scale-110 active:scale-95 transition-all text-lofi-text"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-white dark:bg-lofi-surface rounded-3xl flex items-center justify-center shadow-sm border border-lofi-border mb-6"
          >
            <Coffee className="w-8 h-8 text-lofi-muted" />
          </motion.div>
          <h1 className="text-4xl font-lofi font-semibold text-lofi-text mb-2 animate-in fade-in slide-in-from-top-4 duration-700">Soundbites</h1>
          <p className="text-lofi-muted text-sm font-medium tracking-wide">At your fingertips</p>
        </div>
      </header>

      {/* Controls Container */}
      <div className="max-w-4xl w-full mx-auto px-6 mb-12 flex justify-center sticky top-8 z-40">
        <button
          onClick={() => setIsModalOpen(true)}
          className="lofi-button flex items-center gap-2 bg-white/80 dark:bg-lofi-surface/80 backdrop-blur-xl shadow-lg border-white/50 dark:border-white/10 px-8 py-4"
        >
          <Plus className="w-4 h-4" />
          <span className="font-semibold">Add Recording</span>
        </button>
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 pb-24 relative z-10">
        {/* Intro Section */}
        {!soundbites?.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center opacity-40"
          >
            <Sparkles className="w-12 h-12 mb-4" />
            <p className="text-xl font-lofi">No sounds collected yet.</p>
          </motion.div>
        )}

        {/* Grid View */}
        {soundbites && soundbites.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext items={soundbites.map(s => s.id!)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {soundbites.map((sound) => (
                  <SoundCard key={sound.id} id={sound.id!} sound={sound} />
                ))}

                {/* Placeholder slots */}
                {Array.from({ length: Math.max(0, 3 - (soundbites.length % 3)) }).map((_, i) => (
                  soundbites.length % 3 !== 0 && (
                    <div
                      key={`empty-${i}`}
                      className="aspect-square rounded-2xl border border-lofi-border/40 bg-white/[0.2] dark:bg-white/[0.05] border-dashed"
                    />
                  )
                ))}
              </div>
            </SortableContext>
            <DragOverlay dropAnimation={null}>
              {activeSoundbite ? (
                <SoundCard id={activeSoundbite.id!} sound={activeSoundbite} isOverlay />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </main>

      {/* Footer */}
      <footer className="p-12 text-center relative z-10 border-t border-lofi-border/50 bg-white/20 dark:bg-black/20">
        <div className="flex flex-col items-center gap-4 text-lofi-muted text-xs font-medium uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Heart className="w-3 h-3 text-pastel-pink fill-pastel-pink dark:opacity-50" />
            <span>Library Status: {soundbites?.length || 0} tracks active</span>
          </div>
          <div className="flex gap-8 opacity-60">
            <span onClick={() => setIsSettingsOpen(true)} className="hover:text-lofi-text cursor-pointer transition-colors">Documentation</span>
            <span onClick={() => setIsSettingsOpen(true)} className="hover:text-lofi-text cursor-pointer transition-colors">Credits</span>
          </div>
        </div>
      </footer>

      {/* Add Sound Modal */}
      <AddSoundModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
