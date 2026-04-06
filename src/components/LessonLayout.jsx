"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, Zap, ArrowLeft } from "lucide-react";

export default function LessonLayout({
  lesson,
  progress,
  children,
  onBack,
  onComplete,
}) {
  const isCompleted = progress.completedLessons.includes(lesson.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Roadmap</span>
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Clock className="w-3.5 h-3.5" />
            ~15 min
          </div>
          <div className="flex items-center gap-1.5 text-xs text-warning">
            <Zap className="w-3.5 h-3.5" />
            +{lesson.xpReward} XP
          </div>
        </div>
      </div>

      {/* Lesson header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/20 text-accent-light">
            Phase {lesson.phase}: {lesson.phaseTitle}
          </span>
          <span className="text-xs text-muted">Lesson {lesson.id}</span>
        </div>
        <h1 className="text-3xl font-bold mb-3">{lesson.title}</h1>
        <p className="text-muted text-base">{lesson.description}</p>
      </div>

      {/* Lesson content */}
      <div className="prose-custom">{children}</div>

      {/* Complete button */}
      {!isCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <button
            onClick={onComplete}
            className="inline-flex items-center gap-2 px-8 py-3 bg-success hover:bg-success/80 text-white rounded-xl transition-colors font-semibold text-lg shadow-lg shadow-success/20"
          >
            <CheckCircle2 className="w-5 h-5" />
            Complete Lesson & Earn {lesson.xpReward} XP
          </button>
        </motion.div>
      )}
      {isCompleted && (
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-success/20 text-success rounded-xl font-medium">
            <CheckCircle2 className="w-5 h-5" />
            Lesson Completed!
          </div>
        </div>
      )}
    </motion.div>
  );
}
