"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Lock,
  Trophy,
  Flame,
  Star,
  Menu,
  X,
} from "lucide-react";
import { lessons, phases } from "@/lib/lessons";
import { getLevelInfo } from "@/lib/progress";

export default function Sidebar({
  progress,
  currentLessonId,
  onSelectLesson,
  onGoHome,
}) {
  const [expandedPhases, setExpandedPhases] = useState([1]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const levelInfo = getLevelInfo(progress.xp);

  const togglePhase = (phaseId) => {
    setExpandedPhases((prev) =>
      prev.includes(phaseId)
        ? prev.filter((p) => p !== phaseId)
        : [...prev, phaseId]
    );
  };

  const isLessonUnlocked = (lessonId) => {
    if (lessonId === 1) return true;
    return progress.completedLessons.includes(lessonId - 1);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="p-5 border-b border-border cursor-pointer"
        onClick={onGoHome}
      >
        <h1 className="text-xl font-bold text-accent-light tracking-tight">
          DSA Mastery
        </h1>
        <p className="text-xs text-muted mt-1">C++ · Google SWE Prep</p>
      </div>

      {/* XP & Level */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-warning" />
            <span className="text-sm font-semibold">
              Level {levelInfo.level}
            </span>
          </div>
          <span className="text-xs text-muted">{progress.xp} XP</span>
        </div>
        <div className="w-full h-2 bg-background rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${levelInfo.percentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-danger" />
            <span className="text-xs text-muted">
              {progress.streak} day streak
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-warning" />
            <span className="text-xs text-muted">
              {progress.achievements.length}
            </span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">Progress</span>
          <span className="text-xs font-medium text-accent-light">
            {progress.completedLessons.length}/{lessons.length}
          </span>
        </div>
        <div className="w-full h-1.5 bg-background rounded-full mt-2 overflow-hidden">
          <motion.div
            className="h-full bg-success rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${(progress.completedLessons.length / lessons.length) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Lesson Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {phases.map((phase) => {
          const phaseLessons = lessons.filter((l) => l.phase === phase.id);
          const completedInPhase = phaseLessons.filter((l) =>
            progress.completedLessons.includes(l.id)
          ).length;
          const isExpanded = expandedPhases.includes(phase.id);

          return (
            <div key={phase.id} className="mb-1">
              <button
                onClick={() => togglePhase(phase.id)}
                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-card transition-colors"
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-muted" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-muted" />
                  )}
                  <span
                    className="text-sm font-medium"
                    style={{ color: phase.color }}
                  >
                    {phase.title}
                  </span>
                </div>
                <span className="text-xs text-muted">
                  {completedInPhase}/{phaseLessons.length}
                </span>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    {phaseLessons.map((lesson) => {
                      const isCompleted = progress.completedLessons.includes(
                        lesson.id
                      );
                      const isUnlocked = isLessonUnlocked(lesson.id);
                      const isCurrent = currentLessonId === lesson.id;

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => isUnlocked && onSelectLesson(lesson.id)}
                          disabled={!isUnlocked}
                          className={`w-full flex items-center gap-3 pl-9 pr-4 py-2 text-left transition-all ${
                            isCurrent
                              ? "bg-accent/20 border-r-2 border-accent"
                              : isUnlocked
                              ? "hover:bg-card-hover"
                              : "opacity-40 cursor-not-allowed"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                          ) : isUnlocked ? (
                            <div className="w-4 h-4 rounded-full border-2 border-muted flex-shrink-0" />
                          ) : (
                            <Lock className="w-4 h-4 text-muted flex-shrink-0" />
                          )}
                          <span
                            className={`text-xs leading-tight ${
                              isCurrent
                                ? "text-accent-light font-medium"
                                : isCompleted
                                ? "text-success"
                                : "text-foreground/80"
                            }`}
                          >
                            {lesson.title}
                          </span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-card rounded-lg border border-border lg:hidden"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 bg-card border-r border-border">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-y-0 left-0 w-72 bg-card border-r border-border z-40 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
