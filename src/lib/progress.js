"use client";

const STORAGE_KEY = "dsa-mastery-progress";

const defaultProgress = {
  completedLessons: [],
  xp: 0,
  level: 1,
  streak: 0,
  lastActiveDate: "",
  quizScores: {},
  achievements: [],
};

export function getProgress() {
  if (typeof window === "undefined") return defaultProgress;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return defaultProgress;
  try {
    return JSON.parse(stored);
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function completeLesson(lessonId, xpReward) {
  const progress = getProgress();
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
    progress.xp += xpReward;
    progress.level = Math.floor(progress.xp / 300) + 1;
  }
  // Update streak
  const today = new Date().toISOString().split("T")[0];
  if (progress.lastActiveDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    if (progress.lastActiveDate === yesterday) {
      progress.streak += 1;
    } else if (progress.lastActiveDate !== today) {
      progress.streak = 1;
    }
    progress.lastActiveDate = today;
  }
  // Check achievements
  if (progress.completedLessons.length === 1 && !progress.achievements.includes("first-step")) {
    progress.achievements.push("first-step");
  }
  if (progress.completedLessons.length >= 5 && !progress.achievements.includes("getting-warmed-up")) {
    progress.achievements.push("getting-warmed-up");
  }
  if (progress.completedLessons.length >= 10 && !progress.achievements.includes("halfway-hero")) {
    progress.achievements.push("halfway-hero");
  }
  if (progress.streak >= 7 && !progress.achievements.includes("week-warrior")) {
    progress.achievements.push("week-warrior");
  }
  saveProgress(progress);
  return progress;
}

export function saveQuizScore(lessonId, score) {
  const progress = getProgress();
  const existing = progress.quizScores[lessonId] || 0;
  if (score > existing) {
    progress.quizScores[lessonId] = score;
  }
  if (score === 100 && !progress.achievements.includes(`perfect-${lessonId}`)) {
    progress.achievements.push(`perfect-${lessonId}`);
    progress.xp += 50;
    progress.level = Math.floor(progress.xp / 300) + 1;
  }
  saveProgress(progress);
  return progress;
}

export function getLevelInfo(xp) {
  const level = Math.floor(xp / 300) + 1;
  const currentXp = xp % 300;
  const xpForNext = 300;
  const percentage = (currentXp / xpForNext) * 100;
  return { level, currentXp, xpForNext, percentage };
}
