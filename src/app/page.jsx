"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getProgress } from "@/lib/progress";

export default function Home() {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  if (!progress) {
    return (
      <div style={{ color: "white", padding: "40px" }}>
        <p>Loading progress...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ color: "white", padding: "40px", fontSize: "24px" }}
    >
      <h1>DSA Mastery - Test 3 (framer-motion)</h1>
      <p>Progress loaded! XP: {progress.xp}, Completed: {progress.completedLessons.length}</p>
    </motion.div>
  );
}
