"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import HomePage from "@/components/HomePage";
import LessonLayout from "@/components/LessonLayout";
import Lesson1BigO from "@/components/lessons/Lesson1BigO";
import { lessons } from "@/lib/lessons";
import {
  getProgress,
  completeLesson,
  saveQuizScore,
} from "@/lib/progress";

export default function Home() {
  const [progress, setProgress] = useState(null);
  const [currentLessonId, setCurrentLessonId] = useState(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const handleSelectLesson = useCallback((id) => {
    setCurrentLessonId(id);
    window.scrollTo(0, 0);
  }, []);

  const handleGoHome = useCallback(() => {
    setCurrentLessonId(null);
    window.scrollTo(0, 0);
  }, []);

  const handleCompleteLesson = useCallback(() => {
    if (currentLessonId === null) return;
    const lesson = lessons.find((l) => l.id === currentLessonId);
    if (!lesson) return;
    const updated = completeLesson(lesson.id, lesson.xpReward);
    setProgress({ ...updated });
  }, [currentLessonId]);

  const handleQuizComplete = useCallback(
    (score) => {
      if (currentLessonId === null) return;
      const updated = saveQuizScore(currentLessonId, score);
      setProgress({ ...updated });
    },
    [currentLessonId]
  );

  // Show nothing until client-side hydration completes
  if (!progress) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const currentLesson = currentLessonId
    ? lessons.find((l) => l.id === currentLessonId)
    : null;

  const renderLesson = () => {
    switch (currentLessonId) {
      case 1:
        return <Lesson1BigO onQuizComplete={handleQuizComplete} />;
      default:
        return (
          <div className="text-center py-16">
            <p className="text-muted text-lg">
              This lesson is coming soon! Complete the previous lessons first.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        progress={progress}
        currentLessonId={currentLessonId}
        onSelectLesson={handleSelectLesson}
        onGoHome={handleGoHome}
      />

      <main className="lg:pl-72">
        <AnimatePresence mode="wait">
          {currentLesson ? (
            <LessonLayout
              key={currentLesson.id}
              lesson={currentLesson}
              progress={progress}
              onBack={handleGoHome}
              onComplete={handleCompleteLesson}
            >
              {renderLesson()}
            </LessonLayout>
          ) : (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HomePage
                progress={progress}
                onSelectLesson={handleSelectLesson}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
