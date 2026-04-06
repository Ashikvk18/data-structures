"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, RotateCcw, Trophy } from "lucide-react";

export default function Quiz({ questions, onComplete }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[currentQ];

  const handleSelect = (index) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);
    if (index === question.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      const trueScore = Math.round((correctCount / questions.length) * 100);
      setFinished(true);
      onComplete(trueScore);
    }
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setSelected(null);
    setShowResult(false);
    setCorrectCount(0);
    setFinished(false);
  };

  if (finished) {
    const score = Math.round((correctCount / questions.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-xl border border-border p-8 text-center"
      >
        <Trophy
          className={`w-16 h-16 mx-auto mb-4 ${
            score >= 80 ? "text-warning" : score >= 50 ? "text-accent-light" : "text-muted"
          }`}
        />
        <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
        <p className="text-4xl font-bold mb-2">
          <span
            className={
              score >= 80
                ? "text-success"
                : score >= 50
                ? "text-warning"
                : "text-danger"
            }
          >
            {score}%
          </span>
        </p>
        <p className="text-muted mb-6">
          {correctCount} out of {questions.length} correct
        </p>
        {score >= 80 ? (
          <p className="text-success text-sm mb-6">
            Excellent! You&apos;ve mastered this topic!
          </p>
        ) : (
          <p className="text-warning text-sm mb-6">
            Review the lesson and try again to improve your score.
          </p>
        )}
        <button
          onClick={handleRetry}
          className="flex items-center gap-2 mx-auto px-6 py-2.5 bg-accent hover:bg-accent-light text-white rounded-lg transition-colors font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          Retry Quiz
        </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted">
          Question {currentQ + 1} of {questions.length}
        </span>
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i < currentQ
                  ? "bg-success"
                  : i === currentQ
                  ? "bg-accent"
                  : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <h4 className="text-lg font-semibold mb-5">{question.question}</h4>

          <div className="space-y-3">
            {question.options.map((option, i) => {
              const isCorrect = i === question.correctIndex;
              const isSelected = i === selected;

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={showResult}
                  className={`quiz-option w-full text-left p-4 rounded-lg border transition-all ${
                    showResult
                      ? isCorrect
                        ? "border-success bg-success/10"
                        : isSelected
                        ? "border-danger bg-danger/10"
                        : "border-border opacity-50"
                      : "border-border hover:border-accent hover:bg-accent/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border ${
                        showResult && isCorrect
                          ? "bg-success text-white border-success"
                          : showResult && isSelected
                          ? "bg-danger text-white border-danger"
                          : "border-muted text-muted"
                      }`}
                    >
                      {showResult && isCorrect ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : showResult && isSelected ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        String.fromCharCode(65 + i)
                      )}
                    </span>
                    <span className="text-sm">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 rounded-lg bg-accent/10 border border-accent/30"
              >
                <p className="text-sm text-foreground/80">
                  <span className="font-semibold text-accent-light">
                    Explanation:{" "}
                  </span>
                  {question.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next button */}
          {showResult && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleNext}
              className="mt-5 px-6 py-2.5 bg-accent hover:bg-accent-light text-white rounded-lg transition-colors font-medium"
            >
              {currentQ < questions.length - 1 ? "Next Question" : "See Results"}
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
