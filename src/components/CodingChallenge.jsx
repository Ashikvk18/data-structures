"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Play, CheckCircle2, XCircle, RotateCcw, Eye, EyeOff, Lightbulb } from "lucide-react";

export default function CodingChallenge({
  title,
  description,
  starterCode,
  solution,
  hints,
  testDescription,
  validateAnswer,
}) {
  const [code, setCode] = useState(starterCode || "");
  const [result, setResult] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);

  const handleCheck = () => {
    if (validateAnswer) {
      const isCorrect = validateAnswer(code);
      setResult(isCorrect ? "correct" : "incorrect");
    }
  };

  const handleReset = () => {
    setCode(starterCode || "");
    setResult(null);
    setShowSolution(false);
    setShowHint(false);
    setCurrentHint(0);
  };

  const handleNextHint = () => {
    if (!showHint) {
      setShowHint(true);
    } else if (hints && currentHint < hints.length - 1) {
      setCurrentHint((prev) => prev + 1);
    }
  };

  return (
    <div className="my-6 rounded-xl border border-accent/30 bg-gradient-to-br from-accent/5 to-transparent overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 bg-accent/10 border-b border-accent/20">
        <Code2 className="w-5 h-5 text-accent-light" />
        <h4 className="font-semibold text-accent-light">{title}</h4>
      </div>

      {/* Description */}
      <div className="px-5 pt-4 pb-2">
        <p className="text-sm text-foreground/80 leading-relaxed">{description}</p>
        {testDescription && (
          <p className="text-xs text-muted mt-2 italic">{testDescription}</p>
        )}
      </div>

      {/* Code Editor */}
      <div className="px-5 py-3">
        <div className="rounded-lg overflow-hidden border border-border">
          <div className="flex items-center justify-between bg-card px-4 py-2 border-b border-border">
            <span className="text-xs font-medium text-muted">Your Solution (C++)</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted/50">Edit below</span>
            </div>
          </div>
          <textarea
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setResult(null);
            }}
            className="w-full bg-code-bg text-foreground/90 font-mono text-sm p-4 focus:outline-none resize-y"
            style={{
              minHeight: "160px",
              tabSize: 4,
              lineHeight: "1.7",
            }}
            spellCheck={false}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-5 pb-3 flex flex-wrap items-center gap-3">
        <button
          onClick={handleCheck}
          className="flex items-center gap-2 px-5 py-2 bg-success hover:bg-success/80 text-white rounded-lg transition-colors font-medium text-sm"
        >
          <Play className="w-4 h-4" />
          Check Answer
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-card hover:bg-card-hover border border-border rounded-lg transition-colors text-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
        {hints && hints.length > 0 && (
          <button
            onClick={handleNextHint}
            className="flex items-center gap-2 px-4 py-2 bg-warning/10 hover:bg-warning/20 border border-warning/30 text-warning rounded-lg transition-colors text-sm"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            {!showHint ? "Show Hint" : currentHint < hints.length - 1 ? "Next Hint" : "No More Hints"}
          </button>
        )}
        <button
          onClick={() => setShowSolution(!showSolution)}
          className="flex items-center gap-2 px-4 py-2 bg-card hover:bg-card-hover border border-border rounded-lg transition-colors text-sm ml-auto"
        >
          {showSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {showSolution ? "Hide Solution" : "Show Solution"}
        </button>
      </div>

      {/* Hints */}
      <AnimatePresence>
        {showHint && hints && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-5 pb-3"
          >
            <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
              <p className="text-xs text-warning font-medium mb-1">
                Hint {currentHint + 1} of {hints.length}:
              </p>
              <p className="text-sm text-foreground/80">{hints[currentHint]}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-5 pb-4"
          >
            <div
              className={`p-4 rounded-lg border ${
                result === "correct"
                  ? "bg-success/10 border-success/30"
                  : "bg-danger/10 border-danger/30"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {result === "correct" ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : (
                  <XCircle className="w-5 h-5 text-danger" />
                )}
                <span
                  className={`font-semibold text-sm ${
                    result === "correct" ? "text-success" : "text-danger"
                  }`}
                >
                  {result === "correct" ? "Correct!" : "Not quite right"}
                </span>
              </div>
              <p className="text-xs text-foreground/70">
                {result === "correct"
                  ? "Great job! Your solution looks correct. Move on to the next challenge!"
                  : "Check your logic and try again. Use hints or view the solution if you're stuck."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Solution */}
      <AnimatePresence>
        {showSolution && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-5 pb-4"
          >
            <div className="rounded-lg overflow-hidden border border-success/30">
              <div className="flex items-center gap-2 bg-success/10 px-4 py-2 border-b border-success/20">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span className="text-xs font-medium text-success">Solution</span>
              </div>
              <pre className="bg-code-bg p-4 overflow-x-auto">
                <code className="text-sm leading-relaxed text-foreground/90 font-mono whitespace-pre">
                  {solution}
                </code>
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
