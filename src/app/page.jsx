"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import HomePage from "@/components/HomePage";
import LessonLayout from "@/components/LessonLayout";
import Lesson1BigO from "@/components/lessons/Lesson1BigO";
import Lesson2ArraysStrings from "@/components/lessons/Lesson2ArraysStrings";
import Lesson3Recursion from "@/components/lessons/Lesson3Recursion";
import Lesson4LinkedLists from "@/components/lessons/Lesson4LinkedLists";
import Lesson5Stacks from "@/components/lessons/Lesson5Stacks";
import Lesson6Queues from "@/components/lessons/Lesson6Queues";
import Lesson7HashTables from "@/components/lessons/Lesson7HashTables";
import Lesson8HashSets from "@/components/lessons/Lesson8HashSets";
import Lesson9BinaryTrees from "@/components/lessons/Lesson9BinaryTrees";
import Lesson10BST from "@/components/lessons/Lesson10BST";
import Lesson11Heaps from "@/components/lessons/Lesson11Heaps";
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

  if (!progress) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
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
      case 2:
        return <Lesson2ArraysStrings onQuizComplete={handleQuizComplete} />;
      case 3:
        return <Lesson3Recursion onQuizComplete={handleQuizComplete} />;
      case 4:
        return <Lesson4LinkedLists onQuizComplete={handleQuizComplete} />;
      case 5:
        return <Lesson5Stacks onQuizComplete={handleQuizComplete} />;
      case 6:
        return <Lesson6Queues onQuizComplete={handleQuizComplete} />;
      case 7:
        return <Lesson7HashTables onQuizComplete={handleQuizComplete} />;
      case 8:
        return <Lesson8HashSets onQuizComplete={handleQuizComplete} />;
      case 9:
        return <Lesson9BinaryTrees onQuizComplete={handleQuizComplete} />;
      case 10:
        return <Lesson10BST onQuizComplete={handleQuizComplete} />;
      case 11:
        return <Lesson11Heaps onQuizComplete={handleQuizComplete} />;
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
