"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Repeat,
  Lightbulb,
  AlertTriangle,
  BookOpen,
  Code2,
  Brain,
  Trophy,
  Zap,
  GitBranch,
} from "lucide-react";
import CodeBlock from "@/components/CodeBlock";
import Quiz from "@/components/Quiz";
import CodingChallenge from "@/components/CodingChallenge";

const quizQuestions = [
  {
    id: 1,
    question: "What are the two essential parts of every recursive function?",
    options: [
      "A loop and a return statement",
      "A base case and a recursive case",
      "A class and a method",
      "An input and an output",
    ],
    correctIndex: 1,
    explanation:
      "Every recursive function needs a BASE CASE (when to stop) and a RECURSIVE CASE (the function calling itself with a smaller/simpler input). Without a base case, you get infinite recursion → stack overflow.",
  },
  {
    id: 2,
    question: "What is the space complexity of a recursive function that calls itself n times?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctIndex: 2,
    explanation:
      "Each recursive call adds a frame to the call stack. If the function calls itself n times before hitting the base case, n frames are stacked up simultaneously → O(n) space.",
  },
  {
    id: 3,
    question: "What is the time complexity of the naive recursive Fibonacci: fib(n) = fib(n-1) + fib(n-2)?",
    options: ["O(n)", "O(n log n)", "O(2ⁿ)", "O(n²)"],
    correctIndex: 2,
    explanation:
      "Each call branches into TWO more calls. The recursion tree has ~2ⁿ nodes. This is extremely inefficient — fib(50) would take years! Memoization or DP reduces this to O(n).",
  },
  {
    id: 4,
    question: "What happens when a recursive function has no base case?",
    options: [
      "It returns 0",
      "It runs forever and causes a stack overflow",
      "The compiler automatically adds one",
      "It returns null",
    ],
    correctIndex: 1,
    explanation:
      "Without a base case, the function calls itself infinitely. Each call uses stack memory, so eventually the call stack overflows and the program crashes with a 'stack overflow' error.",
  },
  {
    id: 5,
    question: "In backtracking, what do you do after exploring a path that doesn't lead to a solution?",
    options: [
      "Return immediately without changing anything",
      "Undo the last choice (backtrack) and try the next option",
      "Start over from the beginning",
      "Throw an exception",
    ],
    correctIndex: 1,
    explanation:
      "Backtracking follows: CHOOSE → EXPLORE → UNCHOOSE. After exploring a dead-end path, you undo (unchoose) the last decision and try the next alternative. This is the 'backtrack' step.",
  },
  {
    id: 6,
    question: "What is the time complexity of generating all subsets of a set with n elements?",
    options: ["O(n)", "O(n²)", "O(2ⁿ)", "O(n!)"],
    correctIndex: 2,
    explanation:
      "Each element has two choices: include it or exclude it. With n elements, that's 2 × 2 × ... × 2 (n times) = 2ⁿ subsets. So generating all subsets is O(2ⁿ).",
  },
  {
    id: 7,
    question: "What is the time complexity of generating all permutations of n elements?",
    options: ["O(n)", "O(2ⁿ)", "O(n!)", "O(n²)"],
    correctIndex: 2,
    explanation:
      "For the first position, there are n choices. For the second, n-1. And so on. Total = n × (n-1) × ... × 1 = n! permutations.",
  },
  {
    id: 8,
    question: "What is 'tail recursion'?",
    options: [
      "Recursion that uses a tail pointer",
      "When the recursive call is the very last operation in the function",
      "Recursion that runs backwards",
      "A recursive function with two base cases",
    ],
    correctIndex: 1,
    explanation:
      "Tail recursion is when the recursive call is the LAST thing the function does — no computation after it. Some compilers can optimize tail recursion to use O(1) space by reusing the same stack frame.",
  },
  {
    id: 9,
    question: "How does memoization improve recursive Fibonacci from O(2ⁿ) to O(n)?",
    options: [
      "By using a loop instead",
      "By caching results of already-computed subproblems",
      "By using less memory",
      "By sorting the input first",
    ],
    correctIndex: 1,
    explanation:
      "Memoization stores the result of fib(k) the first time it's computed. On subsequent calls with the same k, it returns the cached result in O(1) instead of recomputing. Each subproblem is solved only once → O(n) total.",
  },
  {
    id: 10,
    question: "In the N-Queens problem, what constraint must be checked when placing a queen?",
    options: [
      "No two queens on the same row only",
      "No two queens on the same row, column, or diagonal",
      "No two queens adjacent to each other",
      "Queens must be placed in alphabetical order",
    ],
    correctIndex: 1,
    explanation:
      "Queens attack along rows, columns, and both diagonals. When placing a new queen, you must check that no existing queen shares the same row, column, or diagonal.",
  },
  {
    id: 11,
    question: "What is the difference between recursion and iteration?",
    options: [
      "Recursion is always faster",
      "Iteration cannot solve the same problems as recursion",
      "Recursion uses the call stack; iteration uses loops. Both can solve the same problems.",
      "They are exactly the same thing",
    ],
    correctIndex: 2,
    explanation:
      "Any recursive solution can be converted to an iterative one (and vice versa). Recursion uses the call stack implicitly; iteration uses explicit loops. Recursion is often more elegant for tree/graph problems, but iteration is more memory-efficient.",
  },
  {
    id: 12,
    question: "What is the maximum recursion depth in most C++ compilers by default?",
    options: [
      "100",
      "1,000",
      "Around 10,000 - 100,000 (depends on stack size)",
      "Unlimited",
    ],
    correctIndex: 2,
    explanation:
      "The default stack size is typically 1-8 MB. Each stack frame uses some memory (varies by function), so you can usually recurse 10,000-100,000 levels deep. Beyond that → stack overflow. For deeper recursion, use iteration with an explicit stack.",
  },
];

export default function Lesson3Recursion({ onQuizComplete }) {
  const [showQuiz, setShowQuiz] = useState(false);

  const Section = ({ icon: Icon, title, children }) => (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="mb-10"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-accent/10">
          <Icon className="w-5 h-5 text-accent-light" />
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      {children}
    </motion.section>
  );

  const KeyPoint = ({ children }) => (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/5 border border-accent/20 my-3">
      <Lightbulb className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );

  const Warning = ({ children }) => (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-danger/5 border border-danger/20 my-3">
      <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );

  return (
    <div>
      {/* What is Recursion? */}
      <Section icon={BookOpen} title="What is Recursion?">
        <p className="text-foreground/80 leading-relaxed mb-4">
          <strong>Recursion</strong> is when a function calls itself to solve a smaller version of the same
          problem. It&apos;s like Russian nesting dolls — each doll contains a smaller version of itself,
          until you reach the tiniest one (the base case).
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Every recursive function has exactly <strong>two parts</strong>:
        </p>
        <div className="grid gap-4 md:grid-cols-2 my-4">
          <div className="p-5 bg-card rounded-xl border border-success/30">
            <h4 className="font-semibold text-success mb-2">1. Base Case</h4>
            <p className="text-sm text-foreground/80">
              The simplest version of the problem that can be solved directly, <strong>without</strong> recursion.
              This is your &quot;stop condition&quot;. Without it, recursion goes forever → stack overflow.
            </p>
          </div>
          <div className="p-5 bg-card rounded-xl border border-accent/30">
            <h4 className="font-semibold text-accent-light mb-2">2. Recursive Case</h4>
            <p className="text-sm text-foreground/80">
              The function calls itself with a <strong>smaller/simpler input</strong>, moving closer to the
              base case with each call.
            </p>
          </div>
        </div>

        <CodeBlock
          title="The Simplest Recursive Function — Countdown"
          code={`void countdown(int n) {
    // Base case: stop when n reaches 0
    if (n <= 0) {
        cout << "Done!" << endl;
        return;
    }
    
    // Recursive case: print n, then count down from n-1
    cout << n << " ";
    countdown(n - 1);  // Calls itself with a SMALLER input
}

// countdown(5) prints: 5 4 3 2 1 Done!

// What happens step by step:
// countdown(5) → prints 5, calls countdown(4)
//   countdown(4) → prints 4, calls countdown(3)
//     countdown(3) → prints 3, calls countdown(2)
//       countdown(2) → prints 2, calls countdown(1)
//         countdown(1) → prints 1, calls countdown(0)
//           countdown(0) → prints "Done!", returns
//         returns to countdown(1)
//       returns to countdown(2)
//     returns to countdown(3)
//   returns to countdown(4)
// returns to countdown(5)`}
        />
        <KeyPoint>
          <strong>The golden rule of recursion:</strong> Every recursive call must make progress toward
          the base case. If it doesn&apos;t, you&apos;ll get infinite recursion.
        </KeyPoint>
      </Section>

      {/* The Call Stack */}
      <Section icon={Zap} title="The Call Stack — How Recursion Actually Works">
        <p className="text-foreground/80 leading-relaxed mb-4">
          When a function calls itself, the computer doesn&apos;t &quot;restart&quot; the function. Instead, it
          <strong> pushes a new frame onto the call stack</strong>. Each frame stores the function&apos;s
          local variables and where to return when done.
        </p>

        <div className="bg-card rounded-xl border border-border p-5 my-4">
          <h4 className="font-semibold mb-3 text-accent-light">Call Stack for factorial(4)</h4>
          <div className="font-mono text-xs space-y-1">
            <p className="text-muted">{"// factorial(4) = 4 * factorial(3)"}</p>
            <p className="text-muted">{"//              = 4 * 3 * factorial(2)"}</p>
            <p className="text-muted">{"//              = 4 * 3 * 2 * factorial(1)"}</p>
            <p className="text-muted">{"//              = 4 * 3 * 2 * 1  ← base case!"}</p>
            <div className="mt-4 space-y-1">
              <p className="text-foreground/60">{"Stack growing ↓"}</p>
              <div className="border border-border rounded p-2 bg-code-bg">
                <p className="text-danger">{"[4] factorial(4) — waiting for factorial(3)"}</p>
              </div>
              <div className="border border-border rounded p-2 bg-code-bg ml-4">
                <p className="text-warning">{"[3] factorial(3) — waiting for factorial(2)"}</p>
              </div>
              <div className="border border-border rounded p-2 bg-code-bg ml-8">
                <p className="text-accent-light">{"[2] factorial(2) — waiting for factorial(1)"}</p>
              </div>
              <div className="border border-border rounded p-2 bg-code-bg ml-12">
                <p className="text-success">{"[1] factorial(1) — BASE CASE! returns 1"}</p>
              </div>
              <p className="text-foreground/60 mt-2">{"Stack unwinding ↑ (returns multiply back up)"}</p>
            </div>
          </div>
        </div>

        <CodeBlock
          title="Factorial — Classic Recursion"
          code={`int factorial(int n) {
    // Base case
    if (n <= 1) return 1;
    
    // Recursive case
    return n * factorial(n - 1);
}

// Time: O(n) — n recursive calls
// Space: O(n) — n frames on the call stack

// factorial(5) = 5 * 4 * 3 * 2 * 1 = 120`}
        />

        <Warning>
          <strong>Space complexity of recursion = O(max depth of call stack).</strong> This is the most
          common mistake in interviews. A function that recurses n levels deep uses O(n) space even if
          it doesn&apos;t create any arrays. Always mention this!
        </Warning>
      </Section>

      {/* Classic Recursive Problems */}
      <Section icon={Brain} title="Classic Recursive Problems">
        <h3 className="text-lg font-semibold mt-2 mb-3 text-accent-light">1. Fibonacci Numbers</h3>
        <p className="text-foreground/80 leading-relaxed mb-3">
          The Fibonacci sequence (0, 1, 1, 2, 3, 5, 8, 13, ...) is defined as: F(n) = F(n-1) + F(n-2).
          This is a classic example where naive recursion is terrible but demonstrates an important lesson.
        </p>
        <CodeBlock
          title="Fibonacci — Naive vs Memoized"
          code={`// NAIVE: O(2ⁿ) time — DO NOT USE IN INTERVIEWS!
int fibNaive(int n) {
    if (n <= 1) return n;
    return fibNaive(n - 1) + fibNaive(n - 2);
    // Each call branches into TWO calls
    // fib(5) calls fib(4) + fib(3)
    //   fib(4) calls fib(3) + fib(2)  ← fib(3) computed TWICE!
}

// MEMOIZED: O(n) time, O(n) space — MUCH better!
#include <unordered_map>
unordered_map<int, int> memo;

int fibMemo(int n) {
    if (n <= 1) return n;
    if (memo.count(n)) return memo[n];  // Already computed? Return it!
    
    memo[n] = fibMemo(n - 1) + fibMemo(n - 2);
    return memo[n];
}

// ITERATIVE: O(n) time, O(1) space — BEST!
int fibIter(int n) {
    if (n <= 1) return n;
    int prev2 = 0, prev1 = 1;
    for (int i = 2; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}`}
        />
        <KeyPoint>
          <strong>When to memoize:</strong> If the same recursive call happens multiple times with
          the same arguments (overlapping subproblems), memoization turns exponential time into polynomial.
          This is the core idea behind Dynamic Programming (Phase 6).
        </KeyPoint>

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">2. Power Function</h3>
        <CodeBlock
          title="Power — O(log n) with Recursion"
          code={`// Naive: O(n) — multiply n times
double powerNaive(double base, int n) {
    if (n == 0) return 1;
    return base * powerNaive(base, n - 1);
}

// Fast Power: O(log n) — divide exponent in half each time!
double fastPower(double base, int n) {
    if (n == 0) return 1;
    if (n < 0) return 1.0 / fastPower(base, -n);
    
    double half = fastPower(base, n / 2);
    
    if (n % 2 == 0) {
        return half * half;           // Even: x^n = (x^(n/2))²
    } else {
        return half * half * base;    // Odd: x^n = (x^(n/2))² × x
    }
}

// Why O(log n)? We halve n each time:
// power(2, 16) → power(2, 8) → power(2, 4) → power(2, 2) → power(2, 1) → power(2, 0)
// Only 5 calls for n=16! (log₂(16) = 4, plus base case)`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">3. Binary Search (Recursive)</h3>
        <CodeBlock
          title="Binary Search — Recursive Implementation"
          code={`int binarySearch(vector<int>& arr, int target, int left, int right) {
    // Base case: element not found
    if (left > right) return -1;
    
    int mid = left + (right - left) / 2;
    
    if (arr[mid] == target) return mid;           // Found it!
    else if (arr[mid] < target)
        return binarySearch(arr, target, mid + 1, right);  // Search right
    else
        return binarySearch(arr, target, left, mid - 1);   // Search left
}

// Time: O(log n) — halves search space each call
// Space: O(log n) — log n recursive calls on stack
// Note: Iterative version has O(1) space — prefer in interviews!`}
        />
      </Section>

      {/* Backtracking */}
      <Section icon={GitBranch} title="Backtracking — Systematic Trial and Error">
        <p className="text-foreground/80 leading-relaxed mb-4">
          <strong>Backtracking</strong> is a refined recursion technique for exploring all possible solutions.
          It builds candidates one step at a time and <strong>abandons</strong> a candidate as soon as
          it determines the candidate cannot lead to a valid solution.
        </p>
        <div className="bg-card rounded-xl border border-border p-5 my-4">
          <h4 className="font-semibold mb-3 text-accent-light">The Backtracking Template</h4>
          <p className="text-sm text-foreground/80 mb-3">
            Almost every backtracking problem follows this exact pattern:
          </p>
          <ol className="space-y-2 text-sm text-foreground/80">
            <li className="flex items-start gap-2">
              <span className="font-bold text-accent-light min-w-[24px]">1.</span>
              <span><strong>CHOOSE:</strong> Make a choice (add an element, place a queen, pick a path).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-accent-light min-w-[24px]">2.</span>
              <span><strong>EXPLORE:</strong> Recursively explore what happens with that choice.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-accent-light min-w-[24px]">3.</span>
              <span><strong>UNCHOOSE:</strong> Undo the choice (backtrack) and try the next option.</span>
            </li>
          </ol>
        </div>

        <CodeBlock
          title="Backtracking Template in C++"
          code={`void backtrack(/* state, choices, result */) {
    // Base case: found a valid solution
    if (/* goal reached */) {
        result.push_back(/* current solution */);
        return;
    }
    
    for (/* each choice in available choices */) {
        // 1. CHOOSE
        // Make the choice (modify state)
        
        // 2. EXPLORE
        backtrack(/* updated state */);
        
        // 3. UNCHOOSE
        // Undo the choice (restore state)
    }
}`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">Example: Generate All Subsets</h3>
        <p className="text-foreground/80 leading-relaxed mb-3">
          Given a set of distinct integers, generate all possible subsets (the power set).
          For each element, we have two choices: include it or skip it.
        </p>
        <CodeBlock
          title="All Subsets — O(2ⁿ)"
          code={`void generateSubsets(vector<int>& nums, int index,
                     vector<int>& current, vector<vector<int>>& result) {
    // Base case: processed all elements
    if (index == nums.size()) {
        result.push_back(current);  // Save this subset
        return;
    }
    
    // Choice 1: INCLUDE nums[index]
    current.push_back(nums[index]);        // CHOOSE
    generateSubsets(nums, index + 1, current, result);  // EXPLORE
    current.pop_back();                    // UNCHOOSE (backtrack!)
    
    // Choice 2: SKIP nums[index]
    generateSubsets(nums, index + 1, current, result);
}

// Usage:
// vector<int> nums = {1, 2, 3};
// vector<vector<int>> result;
// vector<int> current;
// generateSubsets(nums, 0, current, result);
// Result: [], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]

// Time: O(2ⁿ) — 2 choices per element
// Space: O(n) — recursion depth + current subset`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">Example: Generate All Permutations</h3>
        <CodeBlock
          title="All Permutations — O(n!)"
          code={`void permute(vector<int>& nums, int start,
             vector<vector<int>>& result) {
    // Base case: all positions filled
    if (start == nums.size()) {
        result.push_back(nums);
        return;
    }
    
    for (int i = start; i < nums.size(); i++) {
        swap(nums[start], nums[i]);         // CHOOSE: place nums[i] at position 'start'
        permute(nums, start + 1, result);   // EXPLORE: fill remaining positions
        swap(nums[start], nums[i]);         // UNCHOOSE: swap back (backtrack!)
    }
}

// Usage:
// vector<int> nums = {1, 2, 3};
// vector<vector<int>> result;
// permute(nums, 0, result);
// Result: [1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,2,1], [3,1,2]

// Time: O(n!) — n choices for first, n-1 for second, ...
// Space: O(n) — recursion depth`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">Example: N-Queens Problem</h3>
        <p className="text-foreground/80 leading-relaxed mb-3">
          Place n queens on an n×n chessboard so that no two queens threaten each other.
          This is the classic backtracking problem — try placing a queen, check if it&apos;s safe, recurse or backtrack.
        </p>
        <CodeBlock
          title="N-Queens — Backtracking"
          code={`bool isSafe(vector<string>& board, int row, int col, int n) {
    // Check column above
    for (int i = 0; i < row; i++)
        if (board[i][col] == 'Q') return false;
    
    // Check upper-left diagonal
    for (int i = row-1, j = col-1; i >= 0 && j >= 0; i--, j--)
        if (board[i][j] == 'Q') return false;
    
    // Check upper-right diagonal
    for (int i = row-1, j = col+1; i >= 0 && j < n; i--, j++)
        if (board[i][j] == 'Q') return false;
    
    return true;
}

void solveNQueens(vector<string>& board, int row, int n,
                  vector<vector<string>>& results) {
    // Base case: all queens placed successfully
    if (row == n) {
        results.push_back(board);
        return;
    }
    
    for (int col = 0; col < n; col++) {
        if (isSafe(board, row, col, n)) {
            board[row][col] = 'Q';                    // CHOOSE
            solveNQueens(board, row + 1, n, results); // EXPLORE
            board[row][col] = '.';                    // UNCHOOSE
        }
    }
}

// Time: O(n!) roughly — pruning makes it much better in practice
// Space: O(n²) for the board + O(n) recursion depth`}
        />

        <KeyPoint>
          <strong>Backtracking is just DFS on a decision tree.</strong> At each node, you make a choice.
          If it leads to a dead end, you backtrack to the parent and try the next choice.
          Google loves backtracking problems — subsets, permutations, N-Queens, Sudoku solver, word search.
        </KeyPoint>
      </Section>

      {/* Recursion vs Iteration */}
      <Section icon={Repeat} title="Recursion vs Iteration — When to Use Which">
        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-card">
                <th className="text-left p-3 border-b border-border font-semibold">Aspect</th>
                <th className="text-left p-3 border-b border-border font-semibold">Recursion</th>
                <th className="text-left p-3 border-b border-border font-semibold">Iteration</th>
              </tr>
            </thead>
            <tbody>
              {[
                { aspect: "Space", rec: "O(n) call stack", iter: "O(1) typically" },
                { aspect: "Speed", rec: "Function call overhead", iter: "Slightly faster" },
                { aspect: "Readability", rec: "Elegant for trees/graphs", iter: "Better for simple loops" },
                { aspect: "Stack overflow risk", rec: "Yes, for deep recursion", iter: "No" },
                { aspect: "Best for", rec: "Trees, graphs, backtracking, divide & conquer", iter: "Arrays, simple counting, DP tabulation" },
                { aspect: "Convertible?", rec: "Always → iteration (use explicit stack)", iter: "Always → recursion" },
              ].map((row) => (
                <tr key={row.aspect} className="border-b border-border/50 hover:bg-card/50">
                  <td className="p-3 font-semibold text-foreground">{row.aspect}</td>
                  <td className="p-3 text-xs text-accent-light">{row.rec}</td>
                  <td className="p-3 text-xs text-success">{row.iter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Warning>
          <strong>In interviews, mention trade-offs.</strong> If you use recursion, say: &quot;This uses O(n) space
          due to the call stack. I could convert it to iteration with an explicit stack for O(1) space if needed.&quot;
          Interviewers love hearing you think about trade-offs.
        </Warning>
      </Section>

      {/* C++ Syntax Reference */}
      <Section icon={Code2} title="C++ Syntax Reference">
        <p className="text-foreground/80 leading-relaxed mb-4">
          Key C++ syntax for recursion and backtracking:
        </p>
        <CodeBlock
          title="Recursion Patterns"
          code={`// === Basic Recursion ===
int solve(int n) {
    if (n <= 0) return 0;        // Base case — ALWAYS first!
    return n + solve(n - 1);     // Recursive case
}

// === Recursion with Return Value ===
int sumArray(vector<int>& arr, int index) {
    if (index == arr.size()) return 0;
    return arr[index] + sumArray(arr, index + 1);
}

// === Recursion with Reference (modifying state) ===
void reverseStr(string& s, int left, int right) {
    if (left >= right) return;
    swap(s[left], s[right]);
    reverseStr(s, left + 1, right - 1);
}

// === Recursion with Multiple Branches ===
int treeHeight(TreeNode* root) {
    if (!root) return 0;  // Base case: empty tree
    return 1 + max(treeHeight(root->left), treeHeight(root->right));
}

// === Helper Function Pattern (common in interviews!) ===
class Solution {
public:
    vector<vector<int>> result;
    
    vector<vector<int>> subsets(vector<int>& nums) {
        vector<int> current;
        helper(nums, 0, current);
        return result;
    }
    
private:
    void helper(vector<int>& nums, int start, vector<int>& current) {
        result.push_back(current);
        for (int i = start; i < nums.size(); i++) {
            current.push_back(nums[i]);
            helper(nums, i + 1, current);
            current.pop_back();  // Backtrack
        }
    }
};`}
        />
        <CodeBlock
          title="Backtracking Utilities"
          code={`// === Swap (for permutations) ===
swap(a, b);             // Built-in, O(1)

// === Vector as stack (for building solutions) ===
vector<int> path;
path.push_back(x);      // Add choice
path.pop_back();         // Undo choice (backtrack)

// === Visited array (for graph/grid backtracking) ===
vector<vector<bool>> visited(rows, vector<bool>(cols, false));
visited[r][c] = true;    // Mark visited
// ... recurse ...
visited[r][c] = false;   // Unmark (backtrack!)

// === String building for backtracking ===
string current = "";
current += ch;           // Add character
current.pop_back();      // Remove last character (backtrack)

// === Memoization with unordered_map ===
#include <unordered_map>
unordered_map<int, int> memo;
if (memo.count(key)) return memo[key];  // Check cache
memo[key] = result;                     // Store result`}
        />
      </Section>

      {/* Coding Challenges */}
      <Section icon={Code2} title="Coding Challenges">
        <p className="text-foreground/80 leading-relaxed mb-4">
          Practice recursive thinking with these challenges.
        </p>

        <CodingChallenge
          title="Challenge 1: Sum of Digits"
          description="Write a recursive function that returns the sum of digits of a positive integer. For example, sumDigits(1234) should return 10 (1+2+3+4)."
          starterCode={`int sumDigits(int n) {
    // Write your recursive solution
    // Base case: single digit number
    // Recursive case: last digit + sumDigits(remaining digits)

}`}
          solution={`int sumDigits(int n) {
    // Base case: single digit
    if (n < 10) return n;
    
    // Recursive case:
    // n % 10 gives the last digit
    // n / 10 removes the last digit
    return (n % 10) + sumDigits(n / 10);
}

// sumDigits(1234):
//   4 + sumDigits(123)
//   4 + 3 + sumDigits(12)
//   4 + 3 + 2 + sumDigits(1)
//   4 + 3 + 2 + 1 = 10
// Time: O(d) where d = number of digits
// Space: O(d) call stack`}
          hints={[
            "n % 10 gives you the last digit of n.",
            "n / 10 removes the last digit (integer division).",
            "Base case: when n is a single digit (n < 10), just return n.",
          ]}
          testDescription="Use n % 10 to get the last digit and n / 10 to recurse on the rest."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("n%10") &&
              lower.includes("n/10") &&
              lower.includes("sumdigits") &&
              (lower.includes("if(n<10)") || lower.includes("if(n<=9)") || lower.includes("if(n==0)"))
            );
          }}
        />

        <CodingChallenge
          title="Challenge 2: Generate All Subsets"
          description="Write a backtracking function that generates all subsets of a given vector. Use the CHOOSE → EXPLORE → UNCHOOSE pattern."
          starterCode={`void subsets(vector<int>& nums, int index,
            vector<int>& current,
            vector<vector<int>>& result) {
    // Base case: processed all elements
    
    // Include nums[index] (choose, explore, unchoose)
    
    // Exclude nums[index]

}`}
          solution={`void subsets(vector<int>& nums, int index,
            vector<int>& current,
            vector<vector<int>>& result) {
    // Base case: processed all elements
    if (index == nums.size()) {
        result.push_back(current);
        return;
    }
    
    // Include nums[index]
    current.push_back(nums[index]);          // CHOOSE
    subsets(nums, index + 1, current, result); // EXPLORE
    current.pop_back();                       // UNCHOOSE
    
    // Exclude nums[index]
    subsets(nums, index + 1, current, result);
}

// Time: O(2ⁿ) — two choices per element
// Space: O(n) — recursion depth`}
          hints={[
            "Base case: when index reaches nums.size(), add current to result.",
            "For 'include': push_back the element, recurse with index+1, then pop_back to backtrack.",
            "For 'exclude': just recurse with index+1 without adding anything.",
          ]}
          testDescription="Follow the choose/explore/unchoose pattern with push_back and pop_back."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("push_back") &&
              lower.includes("pop_back") &&
              lower.includes("index+1") &&
              (lower.includes("result.push_back") || lower.includes("result.emplace_back"))
            );
          }}
        />

        <CodingChallenge
          title="Challenge 3: Power Function (Fast)"
          description="Implement the fast power function that computes base^exponent in O(log n) time using recursion. Hint: x^n = (x^(n/2))² for even n."
          starterCode={`double fastPow(double base, int n) {
    // Base case: n == 0
    // Handle negative exponent
    // Recursive case: split into half
    // Even: (base^(n/2))²
    // Odd: (base^(n/2))² * base

}`}
          solution={`double fastPow(double base, int n) {
    // Base case
    if (n == 0) return 1.0;
    
    // Handle negative exponent
    if (n < 0) return 1.0 / fastPow(base, -n);
    
    // Recurse on half
    double half = fastPow(base, n / 2);
    
    if (n % 2 == 0) {
        return half * half;          // Even: x^n = (x^(n/2))²
    } else {
        return half * half * base;   // Odd: x^n = (x^(n/2))² × x
    }
}

// Time: O(log n) — halving n each time
// Space: O(log n) — recursion depth`}
          hints={[
            "Base case: anything raised to power 0 is 1.",
            "For negative n, compute 1.0 / fastPow(base, -n).",
            "Compute half = fastPow(base, n/2), then return half*half (even) or half*half*base (odd).",
          ]}
          testDescription="Your solution should halve the exponent each recursive call for O(log n) performance."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("n/2") &&
              lower.includes("half*half") &&
              (lower.includes("n%2") || lower.includes("n&1")) &&
              lower.includes("n==0")
            );
          }}
        />
      </Section>

      {/* Summary */}
      <Section icon={Trophy} title="Key Takeaways">
        <div className="bg-gradient-to-br from-accent/10 to-accent-light/5 rounded-xl border border-accent/20 p-6">
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Every recursion needs a base case</strong> (stop condition) and a recursive case (smaller subproblem).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Recursion uses O(depth) space</strong> on the call stack. Always mention this in interviews.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Naive recursive Fibonacci is O(2ⁿ).</strong> Use memoization to make it O(n). This leads to Dynamic Programming.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Backtracking = CHOOSE → EXPLORE → UNCHOOSE.</strong> Use it for subsets (O(2ⁿ)), permutations (O(n!)), and constraint problems.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Fast power uses O(log n)</strong> by halving the exponent. A common interview trick.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Know when to recurse vs iterate.</strong> Trees and backtracking → recursion. Simple array processing → iteration.</span>
            </li>
          </ul>
        </div>
      </Section>

      {/* Quiz Section */}
      <div className="mt-12 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-warning/10">
            <Brain className="w-5 h-5 text-warning" />
          </div>
          <h2 className="text-xl font-bold">Test Your Knowledge</h2>
        </div>

        {!showQuiz ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <p className="text-muted mb-4">
              Ready to test what you&apos;ve learned? Take the quiz!
            </p>
            <button
              onClick={() => setShowQuiz(true)}
              className="px-8 py-3 bg-warning hover:bg-warning/80 text-black rounded-xl font-semibold transition-colors"
            >
              Start Quiz (12 Questions)
            </button>
          </motion.div>
        ) : (
          <Quiz questions={quizQuestions} onComplete={onQuizComplete} />
        )}
      </div>
    </div>
  );
}
