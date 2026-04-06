"use client";

import { motion } from "framer-motion";
import {
  Zap,
  BookOpen,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { lessons, phases } from "@/lib/lessons";

export default function HomePage({ progress, onSelectLesson }) {
  const isLessonUnlocked = (lessonId) => {
    if (lessonId === 1) return true;
    return progress.completedLessons.includes(lessonId - 1);
  };

  const nextLesson = lessons.find(
    (l) =>
      !progress.completedLessons.includes(l.id) && isLessonUnlocked(l.id)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-accent-light">DSA</span> Mastery
        </h1>
        <p className="text-muted text-lg max-w-xl mx-auto mb-8">
          Master every data structure in C++ you need to land a Google SWE role.
          Interactive lessons, quizzes, and gamified progress.
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <div className="text-center">
            <div className="flex items-center gap-1.5 justify-center text-accent-light">
              <BookOpen className="w-5 h-5" />
              <span className="text-2xl font-bold">{lessons.length}</span>
            </div>
            <p className="text-xs text-muted mt-1">Lessons</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1.5 justify-center text-success">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-2xl font-bold">
                {progress.completedLessons.length}
              </span>
            </div>
            <p className="text-xs text-muted mt-1">Completed</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1.5 justify-center text-warning">
              <Zap className="w-5 h-5" />
              <span className="text-2xl font-bold">{progress.xp}</span>
            </div>
            <p className="text-xs text-muted mt-1">Total XP</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1.5 justify-center text-warning">
              <Trophy className="w-5 h-5" />
              <span className="text-2xl font-bold">
                {progress.achievements.length}
              </span>
            </div>
            <p className="text-xs text-muted mt-1">Badges</p>
          </div>
        </div>

        {/* Continue button */}
        {nextLesson && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectLesson(nextLesson.id)}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent hover:bg-accent-light text-white rounded-xl transition-colors font-semibold text-lg shadow-lg shadow-accent/25"
          >
            {progress.completedLessons.length === 0
              ? "Start Learning"
              : "Continue Learning"}
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        )}
      </motion.div>

      {/* Roadmap */}
      <div className="space-y-8">
        {phases.map((phase, phaseIndex) => {
          const phaseLessons = lessons.filter((l) => l.phase === phase.id);
          const completedInPhase = phaseLessons.filter((l) =>
            progress.completedLessons.includes(l.id)
          ).length;

          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: phaseIndex * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: phase.color }}
                />
                <h2 className="text-xl font-bold" style={{ color: phase.color }}>
                  Phase {phase.id}: {phase.title}
                </h2>
                <span className="text-xs text-muted ml-auto">
                  {completedInPhase}/{phaseLessons.length} complete
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {phaseLessons.map((lesson) => {
                  const isCompleted = progress.completedLessons.includes(
                    lesson.id
                  );
                  const isUnlocked = isLessonUnlocked(lesson.id);
                  const isNext = nextLesson?.id === lesson.id;

                  return (
                    <motion.button
                      key={lesson.id}
                      whileHover={isUnlocked ? { scale: 1.02 } : {}}
                      whileTap={isUnlocked ? { scale: 0.98 } : {}}
                      onClick={() => isUnlocked && onSelectLesson(lesson.id)}
                      disabled={!isUnlocked}
                      className={`relative text-left p-5 rounded-xl border transition-all ${
                        isNext
                          ? "border-accent bg-accent/10 shadow-lg shadow-accent/10"
                          : isCompleted
                          ? "border-success/30 bg-success/5"
                          : isUnlocked
                          ? "border-border bg-card hover:bg-card-hover hover:border-accent/50"
                          : "border-border/50 bg-card/50 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      {isNext && (
                        <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-accent text-white text-xs font-bold rounded-full">
                          NEXT
                        </span>
                      )}
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs text-muted">
                          Lesson {lesson.id}
                        </span>
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        ) : !isUnlocked ? (
                          <Lock className="w-4 h-4 text-muted" />
                        ) : null}
                      </div>
                      <h3 className="font-semibold text-sm mb-1.5">
                        {lesson.title}
                      </h3>
                      <p className="text-xs text-muted leading-relaxed">
                        {lesson.description}
                      </p>
                      <div className="flex items-center gap-1.5 mt-3 text-xs text-warning">
                        <Zap className="w-3 h-3" />+{lesson.xpReward} XP
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
