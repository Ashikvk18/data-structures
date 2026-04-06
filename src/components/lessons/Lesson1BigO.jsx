"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Timer,
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  BookOpen,
  Code2,
  Brain,
  Trophy,
} from "lucide-react";
import CodeBlock from "@/components/CodeBlock";
import Quiz from "@/components/Quiz";

const quizQuestions = [
  {
    id: 1,
    question: "What does Big-O notation describe?",
    options: [
      "The exact running time of an algorithm in milliseconds",
      "The upper bound of an algorithm's growth rate as input grows",
      "The minimum amount of memory an algorithm uses",
      "The number of lines of code in an algorithm",
    ],
    correctIndex: 1,
    explanation:
      "Big-O notation describes the upper bound (worst case) of how an algorithm's time or space requirements grow relative to the input size. It ignores constants and lower-order terms to focus on the dominant growth rate.",
  },
  {
    id: 2,
    question: "What is the time complexity of this code?\n\nfor (int i = 0; i < n; i++)\n    for (int j = 0; j < n; j++)\n        cout << i + j;",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(2n)"],
    correctIndex: 2,
    explanation:
      "The outer loop runs n times, and for each iteration of the outer loop, the inner loop also runs n times. Total operations = n × n = n². This is O(n²) — quadratic time complexity.",
  },
  {
    id: 3,
    question:
      "Which of the following is the correct order from fastest to slowest growth rate?",
    options: [
      "O(n) < O(1) < O(n²) < O(log n)",
      "O(1) < O(log n) < O(n) < O(n²)",
      "O(log n) < O(1) < O(n) < O(n²)",
      "O(1) < O(n) < O(log n) < O(n²)",
    ],
    correctIndex: 1,
    explanation:
      "O(1) is constant — doesn't grow at all. O(log n) grows very slowly (e.g., binary search). O(n) grows linearly. O(n²) grows quadratically. So the order from fastest to slowest is: O(1) < O(log n) < O(n) < O(n²).",
  },
  {
    id: 4,
    question:
      "What is the space complexity of a function that creates a new array of size n?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctIndex: 2,
    explanation:
      "Creating a new array of size n requires n units of memory. This means the space complexity is O(n) — it grows linearly with the input size.",
  },
  {
    id: 5,
    question:
      'What is the time complexity of binary search on a sorted array of size n?',
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctIndex: 1,
    explanation:
      "Binary search halves the search space with each step. Starting from n elements: n → n/2 → n/4 → ... → 1. The number of halvings to reach 1 is log₂(n). So binary search is O(log n).",
  },
];

export default function Lesson1BigO({ onQuizComplete }) {
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
      {/* What is Big-O? */}
      <Section icon={BookOpen} title="What is Big-O Notation?">
        <p className="text-foreground/80 leading-relaxed mb-4">
          Imagine you&apos;re comparing two sorting algorithms. One takes 3 seconds on your
          machine, the other takes 5 seconds. Does that mean the first one is better?{" "}
          <strong>Not necessarily.</strong> The speed depends on your hardware, the
          programming language, the input size, and many other factors.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          <strong>Big-O notation</strong> gives us a way to talk about algorithm
          efficiency that&apos;s <em>independent</em> of all those factors. It describes how
          the running time or memory usage of an algorithm <strong>grows</strong> as the
          input size grows.
        </p>
        <KeyPoint>
          <strong>Big-O answers the question:</strong> &quot;If I double my input size, how
          much longer will this algorithm take?&quot; It describes the{" "}
          <strong>growth rate</strong>, not the exact time.
        </KeyPoint>

        <p className="text-foreground/80 leading-relaxed mb-4">
          Formally, we say an algorithm is <strong>O(f(n))</strong> if, for large enough
          inputs, its running time is <em>at most</em> proportional to f(n). The &quot;n&quot;
          represents the input size.
        </p>

        <div className="bg-card rounded-xl border border-border p-5 my-4">
          <h4 className="font-semibold mb-3 text-accent-light">Three Key Rules of Big-O:</h4>
          <ol className="space-y-2 text-sm text-foreground/80">
            <li className="flex items-start gap-2">
              <span className="font-bold text-accent-light min-w-[24px]">1.</span>
              <span>
                <strong>Drop constants:</strong> O(2n) simplifies to O(n). We don&apos;t care
                about the constant multiplier.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-accent-light min-w-[24px]">2.</span>
              <span>
                <strong>Drop lower-order terms:</strong> O(n² + n) simplifies to O(n²).
                As n gets very large, n² dominates completely.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-accent-light min-w-[24px]">3.</span>
              <span>
                <strong>Worst case by default:</strong> Unless stated otherwise, Big-O
                describes the worst-case scenario.
              </span>
            </li>
          </ol>
        </div>
      </Section>

      {/* Why it matters */}
      <Section icon={Brain} title="Why Does This Matter for Google Interviews?">
        <p className="text-foreground/80 leading-relaxed mb-4">
          At Google, every coding interview expects you to analyze the time and space
          complexity of your solution. Here&apos;s the typical flow:
        </p>
        <div className="grid gap-3 md:grid-cols-3 my-4">
          {[
            {
              step: "1",
              title: "Brute Force",
              desc: "Start with the simplest O(n²) or O(n³) solution",
            },
            {
              step: "2",
              title: "Optimize",
              desc: "Can you reduce to O(n log n) or O(n) using the right data structure?",
            },
            {
              step: "3",
              title: "Analyze",
              desc: "State time & space complexity clearly. This is EXPECTED.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-4 bg-card rounded-lg border border-border"
            >
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent-light font-bold text-sm mb-2">
                {item.step}
              </div>
              <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
              <p className="text-xs text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
        <Warning>
          <strong>Google interviewers WILL ask</strong> &quot;What&apos;s the time complexity of
          your solution?&quot; If you can&apos;t answer confidently, it&apos;s a red flag. This
          lesson is the foundation of everything.
        </Warning>
      </Section>

      {/* The Complexity Classes */}
      <Section icon={TrendingUp} title="The Common Complexity Classes">
        <p className="text-foreground/80 leading-relaxed mb-4">
          Here are all the major complexity classes you&apos;ll encounter, ordered from
          fastest to slowest. Think of this as a &quot;speed tier list&quot;:
        </p>

        {/* Complexity Table */}
        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-card">
                <th className="text-left p-3 border-b border-border font-semibold">Big-O</th>
                <th className="text-left p-3 border-b border-border font-semibold">Name</th>
                <th className="text-left p-3 border-b border-border font-semibold">n=1,000</th>
                <th className="text-left p-3 border-b border-border font-semibold">Example</th>
                <th className="text-left p-3 border-b border-border font-semibold">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {[
                { big: "O(1)", name: "Constant", ops: "1", example: "Array access by index", verdict: "🟢 Instant" },
                { big: "O(log n)", name: "Logarithmic", ops: "~10", example: "Binary search", verdict: "🟢 Very fast" },
                { big: "O(n)", name: "Linear", ops: "1,000", example: "Single loop through array", verdict: "🟢 Fast" },
                { big: "O(n log n)", name: "Linearithmic", ops: "~10,000", example: "Merge sort, std::sort", verdict: "🟡 Good" },
                { big: "O(n²)", name: "Quadratic", ops: "1,000,000", example: "Nested loops (bubble sort)", verdict: "🟠 Slow" },
                { big: "O(n³)", name: "Cubic", ops: "1,000,000,000", example: "Triple nested loops", verdict: "🔴 Very slow" },
                { big: "O(2ⁿ)", name: "Exponential", ops: "~10³⁰⁰", example: "Brute-force subsets", verdict: "🔴 Unusable" },
                { big: "O(n!)", name: "Factorial", ops: "~10²⁵⁶⁷", example: "Brute-force permutations", verdict: "🔴 Unusable" },
              ].map((row) => (
                <tr key={row.big} className="border-b border-border/50 hover:bg-card/50">
                  <td className="p-3 font-mono text-accent-light font-semibold">{row.big}</td>
                  <td className="p-3">{row.name}</td>
                  <td className="p-3 font-mono text-xs">{row.ops}</td>
                  <td className="p-3 text-muted">{row.example}</td>
                  <td className="p-3 text-xs">{row.verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <KeyPoint>
          <strong>Rule of thumb for interviews:</strong> Modern computers can do about{" "}
          <strong>10⁸ operations per second</strong>. If n = 10⁶, an O(n²) solution
          would take ~10¹² operations = ~16 minutes. An O(n log n) solution would take
          ~2×10⁷ operations = ~0.2 seconds. That&apos;s the difference a better algorithm
          makes.
        </KeyPoint>
      </Section>

      {/* Visual Growth Comparison */}
      <Section icon={TrendingUp} title="Visualizing Growth Rates">
        <p className="text-foreground/80 leading-relaxed mb-4">
          Let&apos;s see how each complexity class grows as n increases:
        </p>
        <div className="bg-card rounded-xl border border-border p-5 my-4 overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-2 text-muted">n</th>
                <th className="text-left p-2 text-green-400">O(1)</th>
                <th className="text-left p-2 text-green-400">O(log n)</th>
                <th className="text-left p-2 text-green-400">O(n)</th>
                <th className="text-left p-2 text-yellow-400">O(n log n)</th>
                <th className="text-left p-2 text-orange-400">O(n²)</th>
                <th className="text-left p-2 text-red-400">O(2ⁿ)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { n: "10", c: "1", log: "3", lin: "10", nlog: "33", sq: "100", exp: "1,024" },
                { n: "100", c: "1", log: "7", lin: "100", nlog: "664", sq: "10,000", exp: "1.27×10³⁰" },
                { n: "1,000", c: "1", log: "10", lin: "1,000", nlog: "9,966", sq: "1,000,000", exp: "∞" },
                { n: "10,000", c: "1", log: "13", lin: "10,000", nlog: "132,877", sq: "100,000,000", exp: "∞" },
                { n: "100,000", c: "1", log: "17", lin: "100,000", nlog: "1,660,964", sq: "10,000,000,000", exp: "∞" },
              ].map((row) => (
                <tr key={row.n} className="border-b border-border/30">
                  <td className="p-2 font-semibold text-foreground">{row.n}</td>
                  <td className="p-2 text-green-400">{row.c}</td>
                  <td className="p-2 text-green-400">{row.log}</td>
                  <td className="p-2 text-green-400">{row.lin}</td>
                  <td className="p-2 text-yellow-400">{row.nlog}</td>
                  <td className="p-2 text-orange-400">{row.sq}</td>
                  <td className="p-2 text-red-400">{row.exp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted">
          Notice how O(2ⁿ) becomes impossibly large even at n=100. This is why choosing
          the right algorithm and data structure matters so much.
        </p>
      </Section>

      {/* Time Complexity in C++ */}
      <Section icon={Code2} title="Analyzing Time Complexity — C++ Examples">
        <p className="text-foreground/80 leading-relaxed mb-4">
          Let&apos;s learn to analyze actual C++ code. This is the skill you&apos;ll use in
          every single interview.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 text-green-400">O(1) — Constant Time</h3>
        <p className="text-foreground/80 leading-relaxed mb-3">
          The running time does <strong>not</strong> depend on the input size. No matter
          if the array has 10 elements or 10 million, it takes the same time.
        </p>
        <CodeBlock
          title="O(1) — Constant Time Example"
          code={`// Accessing an array element by index
int getFirst(int arr[], int n) {
    return arr[0];  // Always 1 operation, regardless of n
}

// Pushing to the back of a vector (amortized)
vector<int> v;
v.push_back(42);  // O(1) amortized

// Checking if a number is even
bool isEven(int x) {
    return x % 2 == 0;  // O(1) — single operation
}`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-green-400">O(log n) — Logarithmic Time</h3>
        <p className="text-foreground/80 leading-relaxed mb-3">
          The algorithm <strong>halves</strong> the problem size at each step. This is
          incredibly efficient — searching through 1 billion elements takes only ~30 steps!
        </p>
        <CodeBlock
          title="O(log n) — Binary Search"
          code={`// Binary search on a sorted array
// Key insight: we eliminate HALF the remaining elements each step
int binarySearch(int arr[], int n, int target) {
    int left = 0, right = n - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;  // Avoid overflow
        
        if (arr[mid] == target) return mid;       // Found it!
        else if (arr[mid] < target) left = mid + 1;  // Search right half
        else right = mid - 1;                         // Search left half
    }
    
    return -1;  // Not found
}

// How many times can you halve n before reaching 1?
// n → n/2 → n/4 → ... → 1
// Answer: log₂(n) times. That's why it's O(log n).`}
        />
        <KeyPoint>
          <strong>When you see &quot;halving&quot;, think O(log n).</strong> Binary search,
          balanced BST operations, and certain divide-and-conquer algorithms all have this pattern.
        </KeyPoint>

        <h3 className="text-lg font-semibold mt-8 mb-3 text-green-400">O(n) — Linear Time</h3>
        <p className="text-foreground/80 leading-relaxed mb-3">
          You visit each element <strong>once</strong> (or a constant number of times).
          A single pass through an array is O(n).
        </p>
        <CodeBlock
          title="O(n) — Linear Time Examples"
          code={`// Finding the maximum element
int findMax(int arr[], int n) {
    int maxVal = arr[0];
    for (int i = 1; i < n; i++) {    // Loop runs n-1 times
        if (arr[i] > maxVal) {
            maxVal = arr[i];
        }
    }
    return maxVal;  // Total: O(n)
}

// Sum of all elements
int sum(int arr[], int n) {
    int total = 0;
    for (int i = 0; i < n; i++) {    // n iterations
        total += arr[i];              // O(1) work per iteration
    }
    return total;  // Total: n × O(1) = O(n)
}

// Two separate loops are still O(n)!
void twoLoops(int arr[], int n) {
    for (int i = 0; i < n; i++) { /* ... */ }  // O(n)
    for (int i = 0; i < n; i++) { /* ... */ }  // O(n)
    // Total: O(n) + O(n) = O(2n) = O(n)  ← drop the constant!
}`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-orange-400">O(n²) — Quadratic Time</h3>
        <p className="text-foreground/80 leading-relaxed mb-3">
          Nested loops where both depend on n. For each element, you do work proportional
          to n. This is common in brute-force solutions.
        </p>
        <CodeBlock
          title="O(n²) — Quadratic Time Examples"
          code={`// Bubble Sort — classic O(n²) algorithm
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {         // Outer: n times
        for (int j = 0; j < n - i - 1; j++) { // Inner: ~n times
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
    // Total: n × n = O(n²)
}

// Checking all pairs in an array
void allPairs(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            cout << arr[i] << ", " << arr[j] << endl;
        }
    }
    // Even though j starts at i+1, total pairs = n(n-1)/2 = O(n²)
}`}
        />
        <Warning>
          <strong>O(n²) is often the &quot;brute force&quot; answer in interviews.</strong>{" "}
          The interviewer wants to see if you can optimize it to O(n log n) or O(n)
          using the right data structure (hash map, sorting, two pointers, etc.).
        </Warning>

        <h3 className="text-lg font-semibold mt-8 mb-3 text-yellow-400">O(n log n) — Linearithmic Time</h3>
        <p className="text-foreground/80 leading-relaxed mb-3">
          This is the sweet spot for sorting. Merge sort, quicksort (average case), and
          C++&apos;s <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">std::sort</code>{" "}
          all run in O(n log n).
        </p>
        <CodeBlock
          title="O(n log n) — Merge Sort Concept"
          code={`// Merge sort divides the array in half (log n levels)
// and does O(n) work at each level to merge
void mergeSort(int arr[], int left, int right) {
    if (left >= right) return;
    
    int mid = (left + right) / 2;
    mergeSort(arr, left, mid);      // Sort left half
    mergeSort(arr, mid + 1, right); // Sort right half
    merge(arr, left, mid, right);   // Merge: O(n) work
}

// Using C++ STL sort (Introsort: O(n log n) guaranteed)
#include <algorithm>
vector<int> v = {5, 2, 8, 1, 9};
sort(v.begin(), v.end());  // O(n log n)`}
        />
      </Section>

      {/* Space Complexity */}
      <Section icon={Timer} title="Space Complexity">
        <p className="text-foreground/80 leading-relaxed mb-4">
          Space complexity measures how much <strong>extra memory</strong> your algorithm
          uses (beyond the input). Google interviews ask about this too!
        </p>
        <CodeBlock
          title="Space Complexity Examples"
          code={`// O(1) space — constant extra memory
int findMax(int arr[], int n) {
    int maxVal = arr[0];  // Just one extra variable
    for (int i = 1; i < n; i++) {
        maxVal = max(maxVal, arr[i]);
    }
    return maxVal;
    // Space: O(1) — only 'maxVal' and 'i' (constant)
}

// O(n) space — extra array proportional to input
vector<int> duplicate(vector<int>& arr) {
    vector<int> copy(arr.size());  // New array of size n
    for (int i = 0; i < arr.size(); i++) {
        copy[i] = arr[i];
    }
    return copy;
    // Space: O(n) — we created a new array of size n
}

// O(n) space — recursive call stack
int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
    // Space: O(n) — the call stack goes n levels deep
    // Each call waits for the next, stacking up in memory
}`}
        />
        <KeyPoint>
          <strong>Don&apos;t forget recursion uses stack space!</strong> A recursive function
          that calls itself n times uses O(n) space for the call stack, even if it
          doesn&apos;t create any arrays. This is a common interview gotcha.
        </KeyPoint>
      </Section>

      {/* Amortized Analysis */}
      <Section icon={Brain} title="Amortized Analysis — The Tricky One">
        <p className="text-foreground/80 leading-relaxed mb-4">
          Some operations are <em>usually</em> fast but <em>occasionally</em> slow.
          <strong> Amortized analysis</strong> averages the cost over a sequence of operations.
        </p>
        <CodeBlock
          title="Amortized O(1) — Dynamic Array (vector)"
          code={`// std::vector push_back is amortized O(1)
vector<int> v;

// When the vector is full, it doubles its capacity
// Doubling requires copying all n elements: O(n)
// But this only happens after n insertions!
// Cost: (n cheap inserts + 1 expensive copy) / n ≈ O(1) per insert

for (int i = 0; i < 1000000; i++) {
    v.push_back(i);  // Each push_back is amortized O(1)
}

// Think of it like this:
// Insert 1, 2, 3, 4 (resize! copy 4 elements), 5, 6, 7, 8 (resize! copy 8)
// Total copies: 4 + 8 + 16 + ... ≈ 2n
// Average per operation: 2n / n = O(1)`}
        />
      </Section>

      {/* How to Analyze — Step by Step */}
      <Section icon={Lightbulb} title="How to Analyze Any Code — Step by Step">
        <div className="bg-card rounded-xl border border-border p-5 my-4">
          <ol className="space-y-4 text-sm">
            {[
              { n: "1", text: <><strong>Identify loops and recursion.</strong> Each loop that depends on n multiplies the complexity. Nested loops = multiply their iteration counts.</> },
              { n: "2", text: <><strong>Count operations inside loops.</strong> If the inner work is O(1), the loop is O(n). If the inner work is O(n), the total is O(n²).</> },
              { n: "3", text: <><strong>Sequential blocks? Add them.</strong> If you have an O(n) loop followed by an O(n²) loop, the total is O(n + n²) = O(n²).</> },
              { n: "4", text: <><strong>Look for &quot;halving&quot; patterns.</strong> If the loop variable doubles (i *= 2) or the problem halves each step, think O(log n).</> },
              { n: "5", text: <><strong>Drop constants and lower terms.</strong> O(3n + 5) = O(n). O(n² + n) = O(n²).</> },
            ].map((item) => (
              <li key={item.n} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent-light font-bold text-xs">
                  {item.n}
                </span>
                <div>{item.text}</div>
              </li>
            ))}
          </ol>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-3">Practice: Analyze This Code</h3>
        <CodeBlock
          title="What's the time complexity?"
          code={`void mystery(int n) {
    // Part 1
    for (int i = 0; i < n; i++) {          // O(n)
        cout << i << endl;
    }
    
    // Part 2
    for (int i = 0; i < n; i++) {          // Outer: O(n)
        for (int j = 0; j < n; j++) {      // Inner: O(n)
            cout << i + j << endl;
        }
    }
    
    // Part 3
    for (int i = 1; i < n; i *= 2) {       // O(log n) — i doubles!
        cout << i << endl;
    }
}
// Answer: O(n) + O(n²) + O(log n) = O(n²)
// The n² term dominates everything else.`}
        />
      </Section>

      {/* C++ STL Complexity Cheat Sheet */}
      <Section icon={Code2} title="C++ STL Complexity Cheat Sheet">
        <p className="text-foreground/80 leading-relaxed mb-4">
          Knowing the complexity of standard library operations is crucial. Interviewers
          expect you to know these:
        </p>
        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-card">
                <th className="text-left p-3 border-b border-border font-semibold">Data Structure</th>
                <th className="text-left p-3 border-b border-border font-semibold">Access</th>
                <th className="text-left p-3 border-b border-border font-semibold">Search</th>
                <th className="text-left p-3 border-b border-border font-semibold">Insert</th>
                <th className="text-left p-3 border-b border-border font-semibold">Delete</th>
              </tr>
            </thead>
            <tbody>
              {[
                { ds: "vector", access: "O(1)", search: "O(n)", insert: "O(1)*", del: "O(n)" },
                { ds: "list", access: "O(n)", search: "O(n)", insert: "O(1)", del: "O(1)" },
                { ds: "unordered_map", access: "O(1)", search: "O(1)", insert: "O(1)", del: "O(1)" },
                { ds: "map", access: "O(log n)", search: "O(log n)", insert: "O(log n)", del: "O(log n)" },
                { ds: "unordered_set", access: "—", search: "O(1)", insert: "O(1)", del: "O(1)" },
                { ds: "set", access: "—", search: "O(log n)", insert: "O(log n)", del: "O(log n)" },
                { ds: "priority_queue", access: "O(1)†", search: "O(n)", insert: "O(log n)", del: "O(log n)" },
                { ds: "stack", access: "O(1)‡", search: "O(n)", insert: "O(1)", del: "O(1)" },
                { ds: "queue", access: "O(1)‡", search: "O(n)", insert: "O(1)", del: "O(1)" },
              ].map((row) => (
                <tr key={row.ds} className="border-b border-border/50 hover:bg-card/50">
                  <td className="p-3 font-mono text-accent-light text-xs">{row.ds}</td>
                  <td className="p-3 font-mono text-xs">{row.access}</td>
                  <td className="p-3 font-mono text-xs">{row.search}</td>
                  <td className="p-3 font-mono text-xs">{row.insert}</td>
                  <td className="p-3 font-mono text-xs">{row.del}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-muted mt-2">
            * amortized &nbsp; † top element only &nbsp; ‡ top/front element only
          </p>
        </div>
        <KeyPoint>
          <strong>This table is gold.</strong> Memorize it. When an interviewer asks
          &quot;Can we do better?&quot;, check if switching to a different data structure
          (e.g., from vector to unordered_map) improves the bottleneck operation.
        </KeyPoint>
      </Section>

      {/* Best, Average, Worst Case */}
      <Section icon={BookOpen} title="Best Case, Average Case, Worst Case">
        <p className="text-foreground/80 leading-relaxed mb-4">
          Every algorithm has three scenarios. Big-O typically describes the <strong>worst case</strong>,
          but you should understand all three:
        </p>
        <div className="grid gap-3 md:grid-cols-3 my-4">
          <div className="p-4 bg-card rounded-lg border border-success/30">
            <h4 className="font-semibold text-success text-sm mb-2">Best Case (Ω)</h4>
            <p className="text-xs text-muted">
              The minimum time. E.g., linear search finds the target at index 0 → O(1).
            </p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-warning/30">
            <h4 className="font-semibold text-warning text-sm mb-2">Average Case (Θ)</h4>
            <p className="text-xs text-muted">
              Expected time over random inputs. Linear search on average checks n/2 elements → O(n).
            </p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-danger/30">
            <h4 className="font-semibold text-danger text-sm mb-2">Worst Case (O)</h4>
            <p className="text-xs text-muted">
              The maximum time. Linear search checks all n elements → O(n). This is what Big-O describes.
            </p>
          </div>
        </div>
        <Warning>
          In interviews, when you say &quot;my solution is O(n)&quot;, you&apos;re implying worst case.
          If your algorithm has a better average case (like quicksort: O(n log n) average but O(n²) worst),
          mention both.
        </Warning>
      </Section>

      {/* Summary */}
      <Section icon={Trophy} title="Key Takeaways">
        <div className="bg-gradient-to-br from-accent/10 to-accent-light/5 rounded-xl border border-accent/20 p-6">
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Big-O measures growth rate</strong>, not exact time. Drop constants and lower-order terms.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>O(1) &lt; O(log n) &lt; O(n) &lt; O(n log n) &lt; O(n²) &lt; O(2ⁿ) &lt; O(n!)</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Count loops and how they relate to n.</strong> Nested loops = multiply. Sequential = add (keep the largest).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Space complexity includes the call stack.</strong> Recursion depth of n = O(n) space.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Know your STL complexities.</strong> The right data structure can turn O(n²) into O(n).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Google expects you to state complexity</strong> for every solution you write.</span>
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
              Start Quiz (5 Questions)
            </button>
          </motion.div>
        ) : (
          <Quiz questions={quizQuestions} onComplete={onQuizComplete} />
        )}
      </div>
    </div>
  );
}
