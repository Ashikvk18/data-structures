"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutList,
  Lightbulb,
  AlertTriangle,
  BookOpen,
  Code2,
  Brain,
  Trophy,
  Zap,
} from "lucide-react";
import CodeBlock from "@/components/CodeBlock";
import Quiz from "@/components/Quiz";
import CodingChallenge from "@/components/CodingChallenge";

const quizQuestions = [
  {
    id: 1,
    question: "What is the time complexity of accessing an element in an array by index?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
    correctIndex: 2,
    explanation:
      "Arrays store elements in contiguous memory. The address of any element can be computed directly: base_address + index × element_size. This is a single arithmetic operation — O(1).",
  },
  {
    id: 2,
    question: "What happens when you push_back to a full std::vector?",
    options: [
      "It throws an error",
      "It doubles its capacity and copies all elements",
      "It adds the element at the front",
      "It overwrites the last element",
    ],
    correctIndex: 1,
    explanation:
      "When a vector is full, push_back triggers a reallocation: it allocates a new array (typically 2× the size), copies all existing elements, then adds the new one. This single operation is O(n), but amortized over many insertions it averages O(1).",
  },
  {
    id: 3,
    question: "What is the time complexity of inserting an element at the beginning of a std::vector?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctIndex: 2,
    explanation:
      "Inserting at the beginning requires shifting ALL existing elements one position to the right. If the vector has n elements, that's n shifts — O(n).",
  },
  {
    id: 4,
    question: "What does the two-pointer technique typically achieve?",
    options: [
      "It always makes algorithms O(1)",
      "It reduces O(n²) brute force to O(n) by using two indices",
      "It requires the array to be unsorted",
      "It only works with strings, not arrays",
    ],
    correctIndex: 1,
    explanation:
      "Two pointers (one from each end, or a slow/fast pair) let you avoid nested loops. Instead of checking all pairs O(n²), you traverse the array once with two pointers — O(n).",
  },
  {
    id: 5,
    question: "What is the difference between std::string and a C-style char array?",
    options: [
      "There is no difference",
      "std::string manages memory automatically and is resizable; char[] is fixed-size",
      "char[] is faster in all cases",
      "std::string cannot be modified after creation",
    ],
    correctIndex: 1,
    explanation:
      "std::string is a dynamic container that handles memory allocation, resizing, and deallocation automatically. A C-style char array (char[]) has a fixed size determined at compile time and requires manual memory management.",
  },
  {
    id: 6,
    question: "What is the time complexity of the sliding window technique for finding the maximum sum subarray of size k?",
    options: ["O(n²)", "O(n × k)", "O(n)", "O(k)"],
    correctIndex: 2,
    explanation:
      "Sliding window maintains a running sum. When the window slides one position, you add the new element and subtract the old one — O(1) per step, O(n) total for the entire array.",
  },
  {
    id: 7,
    question: "What does substr(pos, len) do on a std::string?",
    options: [
      "Deletes len characters starting at pos",
      "Returns a new string of length len starting at position pos",
      "Inserts len characters at position pos",
      "Reverses len characters starting at pos",
    ],
    correctIndex: 1,
    explanation:
      "substr(pos, len) creates and returns a new string containing len characters starting from index pos. It's O(len) because it copies those characters.",
  },
  {
    id: 8,
    question: "Given a sorted array, what's the best way to find if two elements sum to a target?",
    options: [
      "Nested loops — O(n²)",
      "Hash set — O(n) time, O(n) space",
      "Two pointers from both ends — O(n) time, O(1) space",
      "Binary search for each element — O(n log n)",
    ],
    correctIndex: 2,
    explanation:
      "Since the array is SORTED, two pointers is optimal: O(n) time with O(1) extra space. Start with left=0, right=n-1. If sum < target, move left++. If sum > target, move right--. Hash set also works but uses extra space.",
  },
  {
    id: 9,
    question: "What is the time complexity of std::string concatenation using += in a loop of n iterations?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
    correctIndex: 2,
    explanation:
      "Each += may reallocate and copy the entire string. If you append one character n times, total copies = 1+2+3+...+n = O(n²). Use string::reserve() or a stringstream for O(n) performance.",
  },
  {
    id: 10,
    question: "What does v.erase(v.begin() + i) do to a vector?",
    options: [
      "Removes the element at index i in O(1)",
      "Removes the element at index i and shifts all subsequent elements left — O(n)",
      "Swaps element i with the last element",
      "Marks element i as deleted without removing it",
    ],
    correctIndex: 1,
    explanation:
      "erase() removes the element and shifts all elements after it one position to the left to fill the gap. This takes O(n - i) time, which is O(n) in the worst case.",
  },
  {
    id: 11,
    question: "Which STL function reverses a range in-place?",
    options: [
      "std::sort(begin, end)",
      "std::reverse(begin, end)",
      "std::rotate(begin, mid, end)",
      "std::swap(begin, end)",
    ],
    correctIndex: 1,
    explanation:
      "std::reverse(begin, end) reverses elements in-place in O(n) time and O(1) space. It swaps elements from both ends moving inward.",
  },
  {
    id: 12,
    question: "What is the key difference between a static array int arr[100] and a std::vector<int>?",
    options: [
      "Static arrays are stored on the heap, vectors on the stack",
      "Vectors can grow dynamically; static arrays have a fixed size at compile time",
      "Static arrays are faster for all operations",
      "Vectors cannot be passed to functions",
    ],
    correctIndex: 1,
    explanation:
      "Static arrays have a fixed size determined at compile time and are typically on the stack. Vectors are dynamic — they manage heap memory and can grow/shrink at runtime using push_back/pop_back.",
  },
];

export default function Lesson2ArraysStrings({ onQuizComplete }) {
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
      {/* What are Arrays? */}
      <Section icon={BookOpen} title="What are Arrays?">
        <p className="text-foreground/80 leading-relaxed mb-4">
          An array is the <strong>most fundamental data structure</strong> in computer science.
          It&apos;s a contiguous block of memory that stores elements of the same type, one after another.
        </p>
        <p className="text-foreground/80 leading-relaxed mb-4">
          Think of an array like a row of numbered lockers. Each locker (element) has a fixed position (index),
          and you can instantly open any locker if you know its number. This is why array access is <strong>O(1)</strong>.
        </p>
        <div className="bg-card rounded-xl border border-border p-5 my-4">
          <h4 className="font-semibold mb-3 text-accent-light">Memory Layout</h4>
          <div className="font-mono text-sm bg-code-bg rounded-lg p-4 overflow-x-auto">
            <p className="text-muted mb-2">{"// int arr[5] = {10, 20, 30, 40, 50};"}</p>
            <p className="text-foreground/90">
              Address:&nbsp;&nbsp;[0x100] [0x104] [0x108] [0x10C] [0x110]
            </p>
            <p className="text-accent-light">
              Value:&nbsp;&nbsp;&nbsp;&nbsp;[ 10&nbsp;&nbsp;] [ 20&nbsp;&nbsp;] [ 30&nbsp;&nbsp;] [ 40&nbsp;&nbsp;] [ 50&nbsp;&nbsp;]
            </p>
            <p className="text-success">
              Index:&nbsp;&nbsp;&nbsp;&nbsp;[&nbsp;&nbsp;0&nbsp;&nbsp;] [&nbsp;&nbsp;1&nbsp;&nbsp;] [&nbsp;&nbsp;2&nbsp;&nbsp;] [&nbsp;&nbsp;3&nbsp;&nbsp;] [&nbsp;&nbsp;4&nbsp;&nbsp;]
            </p>
          </div>
          <p className="text-xs text-muted mt-3">
            Each int is 4 bytes. Element at index i lives at: base_address + i × 4. This direct calculation is why access is O(1).
          </p>
        </div>
        <KeyPoint>
          <strong>Arrays are the backbone of most data structures.</strong> Vectors, strings, heaps,
          hash tables, and even graphs (adjacency lists) are built on top of arrays. Understanding
          arrays deeply is essential.
        </KeyPoint>
      </Section>

      {/* Static vs Dynamic Arrays */}
      <Section icon={LayoutList} title="Static Arrays vs Dynamic Arrays (std::vector)">
        <p className="text-foreground/80 leading-relaxed mb-4">
          C++ gives you two flavors of arrays. Knowing when to use each is crucial:
        </p>

        <div className="grid gap-4 md:grid-cols-2 my-4">
          <div className="p-5 bg-card rounded-xl border border-border">
            <h4 className="font-semibold text-danger mb-3">Static Array (C-style)</h4>
            <CodeBlock
              title="Static Array"
              code={`// Fixed size — decided at compile time
int arr[5] = {10, 20, 30, 40, 50};

// Size CANNOT change after declaration
// Must know size beforehand
// Stored on the stack (fast, but limited)

int n = 1000;
int arr2[n]; // VLA — works in some compilers
             // but NOT standard C++!`}
            />
            <ul className="text-xs text-muted space-y-1 mt-3">
              <li>- Fixed size at compile time</li>
              <li>- No bounds checking</li>
              <li>- Stack allocation (fast)</li>
              <li>- No built-in size tracking</li>
            </ul>
          </div>
          <div className="p-5 bg-card rounded-xl border border-success/30">
            <h4 className="font-semibold text-success mb-3">Dynamic Array (std::vector)</h4>
            <CodeBlock
              title="std::vector"
              code={`#include <vector>
using namespace std;

// Size can grow and shrink
vector<int> v = {10, 20, 30, 40, 50};

v.push_back(60);  // Now has 6 elements
v.pop_back();     // Back to 5 elements

// Size is tracked automatically
cout << v.size(); // 5

// Can initialize with a size
vector<int> v2(100, 0); // 100 zeros`}
            />
            <ul className="text-xs text-muted space-y-1 mt-3">
              <li>- Dynamic size — grows as needed</li>
              <li>- Bounds checking with .at()</li>
              <li>- Heap allocation (flexible)</li>
              <li>- Tracks size and capacity</li>
            </ul>
          </div>
        </div>

        <Warning>
          <strong>In Google interviews, always use std::vector</strong> unless the problem specifically
          requires a fixed-size array. Vectors are safer, more flexible, and interviewers expect modern C++.
        </Warning>
      </Section>

      {/* Vector Operations & Complexity */}
      <Section icon={Zap} title="std::vector Operations & Their Complexities">
        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-card">
                <th className="text-left p-3 border-b border-border font-semibold">Operation</th>
                <th className="text-left p-3 border-b border-border font-semibold">Code</th>
                <th className="text-left p-3 border-b border-border font-semibold">Time</th>
                <th className="text-left p-3 border-b border-border font-semibold">Why</th>
              </tr>
            </thead>
            <tbody>
              {[
                { op: "Access by index", code: "v[i]", time: "O(1)", why: "Direct address calculation" },
                { op: "Push back", code: "v.push_back(x)", time: "O(1)*", why: "Amortized — occasional O(n) resize" },
                { op: "Pop back", code: "v.pop_back()", time: "O(1)", why: "Just decrements size" },
                { op: "Insert at front", code: "v.insert(v.begin(), x)", time: "O(n)", why: "Shifts all elements right" },
                { op: "Insert at middle", code: "v.insert(v.begin()+i, x)", time: "O(n)", why: "Shifts elements after i" },
                { op: "Erase at index", code: "v.erase(v.begin()+i)", time: "O(n)", why: "Shifts elements left" },
                { op: "Find element", code: "find(v.begin(), v.end(), x)", time: "O(n)", why: "Linear scan" },
                { op: "Sort", code: "sort(v.begin(), v.end())", time: "O(n log n)", why: "Introsort" },
                { op: "Size", code: "v.size()", time: "O(1)", why: "Stored as member variable" },
                { op: "Clear", code: "v.clear()", time: "O(n)", why: "Destroys all elements" },
              ].map((row) => (
                <tr key={row.op} className="border-b border-border/50 hover:bg-card/50">
                  <td className="p-3">{row.op}</td>
                  <td className="p-3 font-mono text-accent-light text-xs">{row.code}</td>
                  <td className="p-3 font-mono text-xs font-semibold">{row.time}</td>
                  <td className="p-3 text-xs text-muted">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-muted mt-2">* amortized O(1)</p>
        </div>
        <KeyPoint>
          <strong>The bottleneck of vectors is insertion/deletion in the middle.</strong> If you
          need frequent insertions at arbitrary positions, consider a linked list or deque instead.
        </KeyPoint>
      </Section>

      {/* Strings in C++ */}
      <Section icon={BookOpen} title="Strings in C++ (std::string)">
        <p className="text-foreground/80 leading-relaxed mb-4">
          In C++, <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">std::string</code> is
          essentially a <strong>dynamic array of characters</strong> with extra functionality. It&apos;s backed by a vector-like
          structure internally.
        </p>
        <CodeBlock
          title="String Basics"
          code={`#include <string>
using namespace std;

// Creating strings
string s1 = "hello";
string s2("world");
string s3(5, 'a');    // "aaaaa" — 5 copies of 'a'

// String length
s1.length();   // 5  (same as s1.size())

// Accessing characters
s1[0];         // 'h' — O(1)
s1.at(0);      // 'h' — O(1) with bounds checking
s1.front();    // 'h'
s1.back();     // 'o'

// Modifying
s1 += " world";        // "hello world" — may be O(n)
s1.push_back('!');      // "hello world!" — O(1) amortized
s1.pop_back();          // "hello world" — O(1)
s1.insert(5, " dear"); // "hello dear world" — O(n)

// Substrings
s1.substr(0, 5);       // "hello" — O(k) where k = length
s1.find("world");      // Returns index or string::npos — O(n×m)

// Comparing
s1 == s2;              // Lexicographic comparison — O(min(n,m))
s1 < s2;               // Also lexicographic`}
        />

        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-card">
                <th className="text-left p-3 border-b border-border font-semibold">Operation</th>
                <th className="text-left p-3 border-b border-border font-semibold">Time</th>
                <th className="text-left p-3 border-b border-border font-semibold">Note</th>
              </tr>
            </thead>
            <tbody>
              {[
                { op: "s[i] — access", time: "O(1)", note: "Direct index" },
                { op: "s += c — append char", time: "O(1)*", note: "Amortized" },
                { op: "s += str — append string", time: "O(m)", note: "m = str.length()" },
                { op: "s.substr(pos, len)", time: "O(len)", note: "Creates new string" },
                { op: "s.find(str)", time: "O(n×m)", note: "Naive search" },
                { op: "s.compare(str)", time: "O(min(n,m))", note: "Lexicographic" },
                { op: "s.insert(pos, str)", time: "O(n+m)", note: "Shifts characters" },
                { op: "s.erase(pos, len)", time: "O(n)", note: "Shifts characters" },
                { op: "reverse(s.begin(), s.end())", time: "O(n)", note: "In-place" },
                { op: "sort(s.begin(), s.end())", time: "O(n log n)", note: "Sorts characters" },
              ].map((row) => (
                <tr key={row.op} className="border-b border-border/50 hover:bg-card/50">
                  <td className="p-3 font-mono text-accent-light text-xs">{row.op}</td>
                  <td className="p-3 font-mono text-xs font-semibold">{row.time}</td>
                  <td className="p-3 text-xs text-muted">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Warning>
          <strong>String concatenation in a loop is O(n²)!</strong> Each <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">+=</code> may
          copy the entire string. If you need to build a string character by character, use{" "}
          <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">string::reserve()</code> first or
          use a <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">stringstream</code>.
        </Warning>
      </Section>

      {/* Common Patterns: Two Pointers */}
      <Section icon={Brain} title="Pattern 1: Two Pointers">
        <p className="text-foreground/80 leading-relaxed mb-4">
          The <strong>two-pointer technique</strong> is one of the most common interview patterns.
          It uses two indices to traverse an array/string, avoiding nested loops.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3 text-accent-light">Type A: Opposite Ends</h3>
        <p className="text-foreground/80 leading-relaxed mb-3">
          One pointer starts at the beginning, the other at the end. They move toward each other.
        </p>
        <CodeBlock
          title="Two Sum on Sorted Array — O(n)"
          code={`// Given a SORTED array, find two numbers that sum to target
// Brute force: O(n²) — check all pairs
// Two pointers: O(n) — much better!

bool twoSum(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    
    while (left < right) {
        int sum = arr[left] + arr[right];
        
        if (sum == target) {
            return true;     // Found it!
        } else if (sum < target) {
            left++;          // Need bigger sum → move left right
        } else {
            right--;         // Need smaller sum → move right left
        }
    }
    return false;
}
// Time: O(n) — each pointer moves at most n times
// Space: O(1) — just two variables`}
        />

        <CodeBlock
          title="Reverse a String In-Place — O(n)"
          code={`void reverseString(string& s) {
    int left = 0, right = s.length() - 1;
    
    while (left < right) {
        swap(s[left], s[right]);
        left++;
        right--;
    }
}
// Time: O(n/2) = O(n)
// Space: O(1) — in-place swap`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">Type B: Same Direction (Slow/Fast)</h3>
        <p className="text-foreground/80 leading-relaxed mb-3">
          Both pointers start at the beginning. One moves faster than the other. Great for
          removing duplicates, partitioning, or detecting cycles.
        </p>
        <CodeBlock
          title="Remove Duplicates from Sorted Array — O(n)"
          code={`// Remove duplicates in-place, return new length
// [1, 1, 2, 2, 3] → [1, 2, 3, _, _] → returns 3

int removeDuplicates(vector<int>& nums) {
    if (nums.empty()) return 0;
    
    int slow = 0;  // Points to last unique element
    
    for (int fast = 1; fast < nums.size(); fast++) {
        if (nums[fast] != nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
        }
    }
    
    return slow + 1;  // Length of unique portion
}
// Time: O(n) — single pass
// Space: O(1) — in-place`}
        />

        <KeyPoint>
          <strong>Two-pointer pattern works when:</strong> the array is sorted, or you need to
          find pairs/subarrays with a certain property. Ask yourself: &quot;Can I use two pointers
          instead of a nested loop?&quot;
        </KeyPoint>
      </Section>

      {/* Common Patterns: Sliding Window */}
      <Section icon={Brain} title="Pattern 2: Sliding Window">
        <p className="text-foreground/80 leading-relaxed mb-4">
          The <strong>sliding window</strong> technique processes a contiguous subarray (window) of
          the array. Instead of recalculating everything for each position, you &quot;slide&quot; the
          window by adding/removing one element at a time.
        </p>

        <CodeBlock
          title="Maximum Sum Subarray of Size K — O(n)"
          code={`// Find the maximum sum of any contiguous subarray of size k
// Brute force: O(n × k) — recalculate sum for every position
// Sliding window: O(n) — maintain running sum

int maxSumSubarray(vector<int>& arr, int k) {
    int n = arr.size();
    if (n < k) return -1;
    
    // Calculate sum of first window
    int windowSum = 0;
    for (int i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    
    int maxSum = windowSum;
    
    // Slide the window: add new element, remove old element
    for (int i = k; i < n; i++) {
        windowSum += arr[i];       // Add new element entering window
        windowSum -= arr[i - k];   // Remove element leaving window
        maxSum = max(maxSum, windowSum);
    }
    
    return maxSum;
}
// Time: O(n) — single pass after initial window
// Space: O(1)`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">Variable-Size Sliding Window</h3>
        <p className="text-foreground/80 leading-relaxed mb-3">
          Sometimes the window size isn&apos;t fixed. You expand the right side and shrink the left
          side based on a condition.
        </p>
        <CodeBlock
          title="Longest Substring Without Repeating Characters — O(n)"
          code={`#include <unordered_set>

int longestUniqueSubstring(string& s) {
    unordered_set<char> window;
    int left = 0, maxLen = 0;
    
    for (int right = 0; right < s.length(); right++) {
        // Shrink window until no duplicates
        while (window.count(s[right])) {
            window.erase(s[left]);
            left++;
        }
        
        window.insert(s[right]);
        maxLen = max(maxLen, right - left + 1);
    }
    
    return maxLen;
}
// Time: O(n) — each element is added/removed at most once
// Space: O(min(n, 26)) — at most 26 lowercase letters`}
        />

        <KeyPoint>
          <strong>Sliding window works when:</strong> the problem asks for a contiguous subarray/substring
          with some property (maximum sum, longest without repeats, minimum length with condition).
          The key insight is maintaining state as the window moves.
        </KeyPoint>
      </Section>

      {/* Common Patterns: Prefix Sum */}
      <Section icon={Brain} title="Pattern 3: Prefix Sum">
        <p className="text-foreground/80 leading-relaxed mb-4">
          A <strong>prefix sum array</strong> stores cumulative sums, letting you compute the sum
          of any subarray in O(1) after O(n) preprocessing.
        </p>
        <CodeBlock
          title="Prefix Sum — Range Sum Queries in O(1)"
          code={`// Problem: Given an array, answer multiple queries:
// "What is the sum of elements from index i to j?"

// Without prefix sum: O(n) per query
// With prefix sum: O(1) per query after O(n) setup!

vector<int> buildPrefixSum(vector<int>& arr) {
    int n = arr.size();
    vector<int> prefix(n + 1, 0);
    
    for (int i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + arr[i];
    }
    return prefix;
}

// Sum of arr[i..j] = prefix[j+1] - prefix[i]
int rangeSum(vector<int>& prefix, int i, int j) {
    return prefix[j + 1] - prefix[i];
}

// Example:
// arr    = [3, 1, 4, 1, 5, 9]
// prefix = [0, 3, 4, 8, 9, 14, 23]
// Sum of arr[1..3] = prefix[4] - prefix[1] = 9 - 3 = 6
// (1 + 4 + 1 = 6 ✓)`}
        />

        <KeyPoint>
          <strong>Prefix sum is a must-know pattern.</strong> It comes up in many problems:
          subarray sum equals K, number of subarrays with sum in range, 2D prefix sums for
          matrix queries. Google loves these.
        </KeyPoint>
      </Section>

      {/* C++ Syntax Reference */}
      <Section icon={Code2} title="C++ Syntax Reference">
        <p className="text-foreground/80 leading-relaxed mb-4">
          Essential C++ syntax for arrays and strings:
        </p>
        <CodeBlock
          title="Vector — Complete Syntax"
          code={`#include <vector>
#include <algorithm>  // sort, reverse, find, min_element, max_element
using namespace std;

// === Initialization ===
vector<int> v1;                    // Empty
vector<int> v2(10);                // 10 zeros
vector<int> v3(10, -1);           // 10 copies of -1
vector<int> v4 = {1, 2, 3, 4, 5}; // From initializer list
vector<int> v5(v4);                // Copy of v4
vector<int> v6(v4.begin(), v4.begin() + 3); // {1, 2, 3}

// === Adding/Removing ===
v1.push_back(42);                  // Add to end — O(1) amortized
v1.pop_back();                     // Remove from end — O(1)
v1.insert(v1.begin(), 99);        // Insert at front — O(n)
v1.insert(v1.begin() + 2, 99);   // Insert at index 2 — O(n)
v1.erase(v1.begin());             // Remove first — O(n)
v1.erase(v1.begin() + 2);        // Remove at index 2 — O(n)
v1.clear();                        // Remove all — O(n)

// === Accessing ===
v4[0];                             // First element — O(1), no bounds check
v4.at(0);                          // First element — O(1), throws if out of range
v4.front();                        // First element
v4.back();                         // Last element

// === Size & Capacity ===
v4.size();                         // Number of elements
v4.empty();                        // true if size == 0
v4.capacity();                     // Allocated space (>= size)
v4.reserve(1000);                  // Pre-allocate space (avoids reallocations)
v4.resize(10);                     // Change size (adds 0s or truncates)

// === Algorithms ===
sort(v4.begin(), v4.end());                    // Ascending sort
sort(v4.begin(), v4.end(), greater<int>());    // Descending sort
reverse(v4.begin(), v4.end());                 // Reverse
auto it = find(v4.begin(), v4.end(), 3);       // Find element
auto minIt = min_element(v4.begin(), v4.end()); // Min element
auto maxIt = max_element(v4.begin(), v4.end()); // Max element
int total = accumulate(v4.begin(), v4.end(), 0); // Sum (include <numeric>)

// === Iteration ===
for (int i = 0; i < v4.size(); i++) { /* v4[i] */ }  // Index-based
for (int x : v4) { /* x is a copy */ }                // Range-based
for (int& x : v4) { /* x is a reference — can modify */ }`}
        />
        <CodeBlock
          title="String — Complete Syntax"
          code={`#include <string>
#include <algorithm>
#include <sstream>   // for stringstream
using namespace std;

// === Initialization ===
string s1 = "hello";
string s2("world");
string s3(5, 'x');         // "xxxxx"
string s4 = s1 + " " + s2; // "hello world"

// === Accessing ===
s1[0];              // 'h' — O(1)
s1.at(0);           // 'h' — with bounds check
s1.front();         // 'h'
s1.back();          // 'o'

// === Modifying ===
s1 += "!";                    // Append — O(1) amortized
s1.push_back('?');            // Append char — O(1) amortized
s1.pop_back();                // Remove last char — O(1)
s1.insert(5, " dear");       // Insert at position — O(n)
s1.erase(5, 5);              // Erase 5 chars from pos 5 — O(n)
s1.replace(0, 5, "HI");      // Replace range — O(n)

// === Searching ===
s1.find("llo");              // Returns index (2) or string::npos
s1.rfind("l");               // Find from right
s1.find_first_of("aeiou");  // First vowel position
s1.find_last_of("aeiou");   // Last vowel position

// === Substrings & Comparison ===
s1.substr(0, 5);             // "hello" — O(k)
s1.compare(s2);              // 0 if equal, <0 or >0 otherwise
s1 == s2;                    // Equality check — O(n)

// === Conversion ===
int num = stoi("123");       // String to int
double d = stod("3.14");    // String to double
string ns = to_string(42);  // Int to string

// === Useful Tricks ===
// Check if character is digit/letter/lowercase/uppercase
isdigit('5');    // true
isalpha('a');    // true
islower('a');    // true
toupper('a');    // 'A'
tolower('A');    // 'a'

// Split string by delimiter (using stringstream)
string line = "one,two,three";
stringstream ss(line);
string token;
while (getline(ss, token, ',')) {
    // token = "one", "two", "three"
}`}
        />
      </Section>

      {/* Coding Challenges */}
      <Section icon={Code2} title="Coding Challenges">
        <p className="text-foreground/80 leading-relaxed mb-4">
          Write C++ code to solve these problems. Apply the patterns you learned.
        </p>

        <CodingChallenge
          title="Challenge 1: Reverse an Array In-Place"
          description="Write a function that reverses a vector of integers in-place (without creating a new array). Use the two-pointer technique."
          starterCode={`void reverseArray(vector<int>& arr) {
    // Use two pointers to reverse in-place
    // Time: O(n), Space: O(1)

}`}
          solution={`void reverseArray(vector<int>& arr) {
    int left = 0, right = arr.size() - 1;
    
    while (left < right) {
        swap(arr[left], arr[right]);
        left++;
        right--;
    }
}
// Time: O(n/2) = O(n)
// Space: O(1) — only two pointer variables`}
          hints={[
            "Start with two pointers: left = 0 and right = arr.size() - 1.",
            "Swap arr[left] and arr[right], then move both pointers inward.",
            "Stop when left >= right (they've met in the middle).",
          ]}
          testDescription="Your solution should use two pointers and swap elements. No extra array allowed."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("left") &&
              lower.includes("right") &&
              (lower.includes("swap") || (lower.includes("temp") || lower.includes("=arr["))) &&
              lower.includes("while")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 2: Maximum Sum Subarray of Size K"
          description="Write a function that finds the maximum sum of any contiguous subarray of size k. Use the sliding window technique — do NOT use nested loops."
          starterCode={`int maxSumOfK(vector<int>& arr, int k) {
    // Use sliding window
    // Time: O(n), Space: O(1)

}`}
          solution={`int maxSumOfK(vector<int>& arr, int k) {
    int n = arr.size();
    if (n < k) return -1;
    
    // Sum of first window
    int windowSum = 0;
    for (int i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    
    int maxSum = windowSum;
    
    // Slide the window
    for (int i = k; i < n; i++) {
        windowSum += arr[i];       // Add new element
        windowSum -= arr[i - k];   // Remove old element
        maxSum = max(maxSum, windowSum);
    }
    
    return maxSum;
}
// Time: O(n) — single pass
// Space: O(1) — just a few variables`}
          hints={[
            "First, calculate the sum of the first k elements.",
            "Then slide the window: add arr[i] and subtract arr[i-k] for each position.",
            "Track the maximum sum seen so far.",
          ]}
          testDescription="Your solution should process the array in a single pass after the initial window sum."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("windowsum") || lower.includes("window_sum") || lower.includes("sum") &&
              (lower.includes("arr[i-k]") || lower.includes("arr[i -k]") || lower.includes("-=")) &&
              lower.includes("max")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 3: Check if a String is a Palindrome"
          description="Write a function that checks if a string is a palindrome (reads the same forwards and backwards). Ignore non-alphanumeric characters and case. Use two pointers."
          starterCode={`bool isPalindrome(string s) {
    // Use two pointers
    // Skip non-alphanumeric, ignore case
    // Time: O(n), Space: O(1)

}`}
          solution={`bool isPalindrome(string s) {
    int left = 0, right = s.length() - 1;
    
    while (left < right) {
        // Skip non-alphanumeric from left
        while (left < right && !isalnum(s[left])) {
            left++;
        }
        // Skip non-alphanumeric from right
        while (left < right && !isalnum(s[right])) {
            right--;
        }
        
        // Compare (case-insensitive)
        if (tolower(s[left]) != tolower(s[right])) {
            return false;
        }
        
        left++;
        right--;
    }
    
    return true;
}
// Time: O(n) — each character visited at most twice
// Space: O(1) — only two pointer variables
// Example: "A man, a plan, a canal: Panama" → true`}
          hints={[
            "Use isalnum() to check if a character is a letter or digit.",
            "Use tolower() to compare characters case-insensitively.",
            "Skip non-alphanumeric characters by moving the pointers past them.",
          ]}
          testDescription="Your solution should handle mixed case and non-alphanumeric characters."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("left") &&
              lower.includes("right") &&
              (lower.includes("isalnum") || lower.includes("isalpha")) &&
              (lower.includes("tolower") || lower.includes("toupper"))
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
              <span><strong>Arrays give O(1) access</strong> because of contiguous memory. This is their superpower.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Use std::vector over C-arrays.</strong> Dynamic, safe, and what Google expects.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Two pointers</strong> turn O(n²) pair problems into O(n). Works on sorted arrays and strings.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Sliding window</strong> solves subarray/substring problems in O(n). Maintain state as the window moves.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Prefix sum</strong> gives O(1) range sum queries after O(n) preprocessing.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>String concatenation in a loop is O(n²).</strong> Use reserve() or stringstream.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Know your STL.</strong> sort, reverse, find, substr, push_back — and their complexities.</span>
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
