"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CircleDot,
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
    question: "What is the main difference between unordered_set and unordered_map?",
    options: [
      "unordered_set is faster",
      "unordered_set stores only keys (no values); unordered_map stores key-value pairs",
      "unordered_map cannot store strings",
      "They are the same thing",
    ],
    correctIndex: 1,
    explanation:
      "unordered_set stores unique keys with no associated value — it's a collection of unique elements. unordered_map stores key-value pairs. Use set when you just need to track membership, map when you need to associate data with keys.",
  },
  {
    id: 2,
    question: "What happens when you insert a duplicate element into an unordered_set?",
    options: [
      "It throws an error",
      "It replaces the existing element",
      "It's silently ignored — the set remains unchanged",
      "It creates a second copy",
    ],
    correctIndex: 2,
    explanation:
      "Sets enforce uniqueness. Inserting a duplicate is a no-op — the set doesn't change. insert() returns a pair<iterator, bool> where the bool is false if the element already existed.",
  },
  {
    id: 3,
    question: "What is the time complexity of checking if an element exists in an unordered_set?",
    options: ["O(n)", "O(log n)", "O(1) average", "O(n log n)"],
    correctIndex: 2,
    explanation:
      "Like unordered_map, unordered_set uses hashing. count(x) and find(x) are O(1) average, O(n) worst case. This makes it ideal for fast membership testing.",
  },
  {
    id: 4,
    question: "How do you find the intersection of two arrays using hash sets?",
    options: [
      "Sort both arrays and use two pointers",
      "Put one array in a set, iterate the other and check membership",
      "Use nested loops",
      "All of the above work, but hash set is O(n + m) average",
    ],
    correctIndex: 3,
    explanation:
      "All three work. Nested loops: O(n×m). Sorting + two pointers: O(n log n + m log m). Hash set: O(n + m) average. The hash set approach is typically the best for interviews.",
  },
  {
    id: 5,
    question: "What is the 'Contains Duplicate' problem's optimal solution?",
    options: [
      "Sort and check adjacent — O(n log n)",
      "Insert into unordered_set, check if size < array size — O(n)",
      "Use nested loops — O(n²)",
      "Both A and B are optimal, B is simpler",
    ],
    correctIndex: 3,
    explanation:
      "Sorting is O(n log n) time, O(1) space. Hash set is O(n) time, O(n) space. Both are good answers — hash set is faster but uses more memory. Mention the trade-off in interviews!",
  },
  {
    id: 6,
    question: "What does the 'Longest Consecutive Sequence' problem ask?",
    options: [
      "Find the longest sorted subarray",
      "Find the length of the longest sequence of consecutive integers (e.g., 1,2,3,4)",
      "Find the longest substring without repeating characters",
      "Sort the array and return its length",
    ],
    correctIndex: 1,
    explanation:
      "Given [100, 4, 200, 1, 3, 2], the longest consecutive sequence is [1, 2, 3, 4] → length 4. The key: use a hash set and only start counting from sequence beginnings (elements where num-1 is NOT in the set).",
  },
  {
    id: 7,
    question: "What is the difference between std::set and std::unordered_set?",
    options: [
      "They are identical",
      "set uses a BST (sorted, O(log n)); unordered_set uses hashing (unsorted, O(1) avg)",
      "unordered_set is always better",
      "set can hold duplicates, unordered_set cannot",
    ],
    correctIndex: 1,
    explanation:
      "std::set uses a Red-Black tree → elements are sorted, operations are O(log n). std::unordered_set uses hashing → elements are unsorted, operations are O(1) average. Neither allows duplicates.",
  },
  {
    id: 8,
    question: "How do you use a set for deduplication?",
    options: [
      "Insert all elements — duplicates are automatically rejected",
      "Sort the array first",
      "Use a loop to manually check each element",
      "Sets cannot deduplicate",
    ],
    correctIndex: 0,
    explanation:
      "Just insert all elements into a set. Since sets reject duplicates, the result is a collection of unique elements. unordered_set<int> s(arr.begin(), arr.end()) does it in one line.",
  },
  {
    id: 9,
    question: "What is std::multiset used for?",
    options: [
      "A set that stores key-value pairs",
      "A sorted container that ALLOWS duplicate elements",
      "A set with multiple hash functions",
      "A set that can hold different data types",
    ],
    correctIndex: 1,
    explanation:
      "multiset is like set (sorted, BST-based) but allows duplicates. count(x) can return values > 1. Useful when you need sorted order AND duplicate tracking, like a sliding window median.",
  },
  {
    id: 10,
    question: "What is the 'Happy Number' problem's key insight?",
    options: [
      "Use dynamic programming",
      "Use a set to detect cycles — if a number repeats, it's not happy",
      "Sort the digits",
      "Use binary search",
    ],
    correctIndex: 1,
    explanation:
      "Sum of squares of digits either reaches 1 (happy) or enters a cycle (not happy). Use a set to track seen numbers. If you see a number again → cycle → not happy. Alternatively, use Floyd's slow/fast pointer!",
  },
  {
    id: 11,
    question: "How do you check if two arrays have any common elements?",
    options: [
      "Sort both and use binary search — O(n log n + m log n)",
      "Put one in a set, iterate the other checking membership — O(n + m)",
      "Compare every pair — O(n × m)",
      "All work, but hash set is typically fastest",
    ],
    correctIndex: 3,
    explanation:
      "Hash set: O(n + m) average. Insert smaller array into set, iterate larger array checking count(). Sorting: O(n log n). Nested loops: O(n×m). Hash set wins for average case.",
  },
  {
    id: 12,
    question: "What is the space complexity of using a hash set to deduplicate an array of n elements?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctIndex: 2,
    explanation:
      "In the worst case (all elements unique), the hash set stores all n elements → O(n) space. If there are many duplicates, it uses less, but worst case is O(n).",
  },
];

export default function Lesson8HashSets({ onQuizComplete }) {
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
      {/* What is a Hash Set? */}
      <Section icon={BookOpen} title="What is a Hash Set?">
        <p className="text-foreground/80 leading-relaxed mb-4">
          A <strong>hash set</strong> is a collection of <strong>unique elements</strong> with O(1)
          average time for insert, delete, and lookup. It&apos;s like a hash map without values —
          you only care about whether an element <strong>exists</strong> or not.
        </p>

        <div className="bg-card rounded-xl border border-border p-5 my-4">
          <h4 className="font-semibold mb-3 text-accent-light">When to Use a Set vs Map</h4>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="bg-code-bg rounded-lg p-4">
              <p className="text-sm font-semibold text-accent-light mb-2">Use a Set when:</p>
              <ul className="text-xs text-foreground/80 space-y-1">
                <li>- You need to check if something exists</li>
                <li>- You need unique elements (deduplication)</li>
                <li>- You need set operations (intersection, union)</li>
                <li>- You just need membership testing</li>
              </ul>
            </div>
            <div className="bg-code-bg rounded-lg p-4">
              <p className="text-sm font-semibold text-warning mb-2">Use a Map when:</p>
              <ul className="text-xs text-foreground/80 space-y-1">
                <li>- You need to associate a key with a value</li>
                <li>- You need to count frequencies</li>
                <li>- You need to store indices or metadata</li>
                <li>- You need key-value lookups</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-card">
                <th className="text-left p-3 border-b border-border font-semibold">Operation</th>
                <th className="text-left p-3 border-b border-border font-semibold">unordered_set</th>
                <th className="text-left p-3 border-b border-border font-semibold">set</th>
                <th className="text-left p-3 border-b border-border font-semibold">multiset</th>
              </tr>
            </thead>
            <tbody>
              {[
                { op: "Insert", us: "O(1) avg", s: "O(log n)", ms: "O(log n)" },
                { op: "Find/Count", us: "O(1) avg", s: "O(log n)", ms: "O(log n)" },
                { op: "Erase", us: "O(1) avg", s: "O(log n)", ms: "O(log n)" },
                { op: "Duplicates?", us: "No", s: "No", ms: "Yes" },
                { op: "Sorted?", us: "No", s: "Yes", ms: "Yes" },
                { op: "lower_bound?", us: "No", s: "Yes", ms: "Yes" },
              ].map((row) => (
                <tr key={row.op} className="border-b border-border/50 hover:bg-card/50">
                  <td className="p-3 font-semibold">{row.op}</td>
                  <td className="p-3 font-mono text-xs">{row.us}</td>
                  <td className="p-3 font-mono text-xs">{row.s}</td>
                  <td className="p-3 font-mono text-xs">{row.ms}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Deduplication */}
      <Section icon={Zap} title="Pattern 1: Deduplication">
        <p className="text-foreground/80 leading-relaxed mb-4">
          The simplest use of a set: <strong>remove duplicates</strong>. Just insert everything — the
          set automatically rejects duplicates.
        </p>
        <CodeBlock
          title="Remove Duplicates — Multiple Approaches"
          code={`#include <unordered_set>
#include <vector>
#include <algorithm>
using namespace std;

// Approach 1: Hash set — O(n) time, O(n) space
vector<int> dedup(vector<int>& arr) {
    unordered_set<int> seen(arr.begin(), arr.end());
    return vector<int>(seen.begin(), seen.end());
    // Note: order is NOT preserved!
}

// Approach 2: Preserve order — O(n) time, O(n) space
vector<int> dedupOrdered(vector<int>& arr) {
    unordered_set<int> seen;
    vector<int> result;
    for (int x : arr) {
        if (!seen.count(x)) {
            seen.insert(x);
            result.push_back(x);
        }
    }
    return result;
}

// Approach 3: Sort + unique — O(n log n) time, O(1) space
void dedupInPlace(vector<int>& arr) {
    sort(arr.begin(), arr.end());
    arr.erase(unique(arr.begin(), arr.end()), arr.end());
}

// Check for duplicates:
bool containsDuplicate(vector<int>& nums) {
    unordered_set<int> seen;
    for (int x : nums) {
        if (seen.count(x)) return true;
        seen.insert(x);
    }
    return false;
    // Or one-liner: return unordered_set<int>(nums.begin(), nums.end()).size() < nums.size();
}`}
        />
      </Section>

      {/* Set Operations */}
      <Section icon={Brain} title="Pattern 2: Set Operations (Intersection, Union, Difference)">
        <CodeBlock
          title="Intersection — Elements in Both Sets"
          code={`// Find common elements between two arrays
// Input: [1,2,2,1], [2,2]  →  Output: [2]

vector<int> intersection(vector<int>& a, vector<int>& b) {
    unordered_set<int> setA(a.begin(), a.end());
    unordered_set<int> result;
    
    for (int x : b) {
        if (setA.count(x)) {
            result.insert(x);  // Deduplicated automatically
        }
    }
    
    return vector<int>(result.begin(), result.end());
}
// Time: O(n + m), Space: O(n)`}
        />
        <CodeBlock
          title="Union & Difference"
          code={`// Union — all unique elements from both
unordered_set<int> setUnion(vector<int>& a, vector<int>& b) {
    unordered_set<int> result(a.begin(), a.end());
    result.insert(b.begin(), b.end());
    return result;
}

// Difference — elements in A but not in B
unordered_set<int> setDifference(vector<int>& a, vector<int>& b) {
    unordered_set<int> setB(b.begin(), b.end());
    unordered_set<int> result;
    for (int x : a) {
        if (!setB.count(x)) result.insert(x);
    }
    return result;
}

// Symmetric Difference — elements in A or B but not both
unordered_set<int> symDifference(vector<int>& a, vector<int>& b) {
    unordered_set<int> setA(a.begin(), a.end());
    unordered_set<int> setB(b.begin(), b.end());
    unordered_set<int> result;
    for (int x : setA) if (!setB.count(x)) result.insert(x);
    for (int x : setB) if (!setA.count(x)) result.insert(x);
    return result;
}`}
        />
        <KeyPoint>
          <strong>Set operations are O(n + m) with hash sets</strong> vs O(n log n + m log m) with sorted
          arrays. In interviews, always mention both approaches and their trade-offs.
        </KeyPoint>
      </Section>

      {/* Membership Testing */}
      <Section icon={Brain} title="Pattern 3: Fast Membership Testing">
        <p className="text-foreground/80 leading-relaxed mb-4">
          Sets excel at answering &quot;is X in the collection?&quot; in O(1). This turns many O(n²)
          problems into O(n).
        </p>
        <CodeBlock
          title="Longest Consecutive Sequence — O(n)"
          code={`// Find the length of the longest consecutive element sequence
// Input: [100, 4, 200, 1, 3, 2]  →  Output: 4 (sequence: 1,2,3,4)
// Must be O(n) — cannot sort!

int longestConsecutive(vector<int>& nums) {
    unordered_set<int> numSet(nums.begin(), nums.end());
    int maxLen = 0;
    
    for (int num : numSet) {
        // Only start counting from the BEGINNING of a sequence
        // A number is a sequence start if (num - 1) is NOT in the set
        if (!numSet.count(num - 1)) {
            int current = num;
            int length = 1;
            
            // Count consecutive numbers
            while (numSet.count(current + 1)) {
                current++;
                length++;
            }
            
            maxLen = max(maxLen, length);
        }
    }
    
    return maxLen;
}

// Why O(n)?
// Each number is visited at most twice:
// once in the outer loop, once in the while loop
// The key trick: only start from sequence beginnings
// Time: O(n), Space: O(n)`}
        />

        <CodeBlock
          title="Happy Number — Cycle Detection with Set"
          code={`// A happy number: repeatedly sum the squares of its digits.
// If it reaches 1, it's happy. If it loops forever, it's not.
// 19 → 1²+9² = 82 → 8²+2² = 68 → ... → 1 ✓ (happy!)
// 2  → 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4 → ... (cycle!)

int digitSquareSum(int n) {
    int sum = 0;
    while (n > 0) {
        int d = n % 10;
        sum += d * d;
        n /= 10;
    }
    return sum;
}

bool isHappy(int n) {
    unordered_set<int> seen;
    
    while (n != 1) {
        if (seen.count(n)) return false;  // Cycle detected!
        seen.insert(n);
        n = digitSquareSum(n);
    }
    
    return true;
}
// Alternative: use Floyd's slow/fast pointer (no extra space!)
// Time: O(k) where k = steps to reach 1 or detect cycle
// Space: O(k) with set, O(1) with Floyd's`}
        />

        <CodeBlock
          title="Valid Sudoku — Set for Constraint Checking"
          code={`// Check if a 9×9 Sudoku board is valid
// Each row, column, and 3×3 box must contain digits 1-9 without repeats

bool isValidSudoku(vector<vector<char>>& board) {
    // Use sets to track what we've seen
    unordered_set<string> seen;
    
    for (int r = 0; r < 9; r++) {
        for (int c = 0; c < 9; c++) {
            char ch = board[r][c];
            if (ch == '.') continue;
            
            string row = string(1, ch) + " in row " + to_string(r);
            string col = string(1, ch) + " in col " + to_string(c);
            string box = string(1, ch) + " in box " + to_string(r/3) + "-" + to_string(c/3);
            
            if (seen.count(row) || seen.count(col) || seen.count(box)) {
                return false;
            }
            
            seen.insert(row);
            seen.insert(col);
            seen.insert(box);
        }
    }
    return true;
}
// Clever trick: encode constraints as strings in ONE set
// Time: O(81) = O(1), Space: O(81) = O(1)`}
        />
      </Section>

      {/* std::set and multiset */}
      <Section icon={BookOpen} title="std::set & std::multiset — When Order Matters">
        <p className="text-foreground/80 leading-relaxed mb-4">
          When you need elements sorted or need range queries, use <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">std::set</code> (BST-backed)
          instead of <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">unordered_set</code>.
        </p>
        <CodeBlock
          title="std::set — Sorted Unique Elements"
          code={`#include <set>
using namespace std;

set<int> s = {5, 3, 8, 1, 3};  // {1, 3, 5, 8} — sorted, no dupes

// Insert/find/erase — all O(log n)
s.insert(4);           // {1, 3, 4, 5, 8}
s.count(4);            // 1
s.erase(4);            // {1, 3, 5, 8}

// Sorted iteration
for (int x : s) cout << x << " ";  // 1 3 5 8

// Range queries — the killer feature!
auto it = s.lower_bound(4);   // First element >= 4 → points to 5
auto it2 = s.upper_bound(4);  // First element > 4  → points to 5
auto it3 = s.lower_bound(3);  // First element >= 3 → points to 3

// Min and max in O(1):
*s.begin();    // 1 (smallest)
*s.rbegin();   // 8 (largest)`}
        />
        <CodeBlock
          title="std::multiset — Sorted with Duplicates"
          code={`#include <set>
using namespace std;

multiset<int> ms = {5, 3, 8, 1, 3};  // {1, 3, 3, 5, 8} — sorted, dupes OK!

ms.count(3);        // 2 (unlike set, can be > 1)
ms.insert(3);       // {1, 3, 3, 3, 5, 8}

// CAREFUL with erase!
ms.erase(3);        // Removes ALL 3s! → {1, 5, 8}

// To erase just ONE occurrence:
auto it = ms.find(3);
if (it != ms.end()) ms.erase(it);  // Removes one 3

// Use case: Sliding Window Median
// Keep a multiset of window elements
// Median = middle element (use advance on iterator)
// Insert: O(log k), Erase: O(log k)`}
        />
        <Warning>
          <strong>multiset::erase(value) removes ALL occurrences!</strong> To remove just one,
          use <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">ms.erase(ms.find(value))</code> which
          erases only the element at the iterator. This is a very common interview trap.
        </Warning>
      </Section>

      {/* C++ Syntax Reference */}
      <Section icon={Code2} title="C++ Syntax Reference">
        <CodeBlock
          title="All Set Types — Complete Reference"
          code={`#include <unordered_set>
#include <set>
using namespace std;

// ========== unordered_set — O(1) avg, unsorted ==========
unordered_set<int> us;
us.insert(x);                              // Insert — O(1) avg
us.erase(x);                               // Erase — O(1) avg
us.count(x);                               // 0 or 1 — O(1) avg
us.find(x) != us.end();                    // Exists? — O(1) avg
us.size();                                  // Count elements
us.empty();                                 // Is empty?
us.clear();                                 // Remove all

// Initialize from vector
vector<int> v = {1, 2, 3, 2, 1};
unordered_set<int> us2(v.begin(), v.end()); // {1, 2, 3}

// Insert range
us.insert(v.begin(), v.end());

// ========== set — O(log n), sorted ==========
set<int> s;
s.insert(x);                               // Insert — O(log n)
s.erase(x);                                // Erase — O(log n)
s.count(x);                                // 0 or 1 — O(log n)
s.lower_bound(x);                          // First >= x — O(log n)
s.upper_bound(x);                          // First > x — O(log n)
*s.begin();                                 // Min element — O(1)
*s.rbegin();                                // Max element — O(1)

// ========== multiset — O(log n), sorted, duplicates ==========
multiset<int> ms;
ms.insert(x);                              // Insert (allows dupes)
ms.count(x);                               // Can be > 1!
ms.erase(x);                               // Erases ALL of x!
ms.erase(ms.find(x));                      // Erases ONE x

// ========== Common Patterns ==========
// Dedup: unordered_set<int> s(v.begin(), v.end());
// Membership: if (s.count(x)) { ... }
// Intersection: iterate one, check other
// Sorted min/max: *s.begin(), *s.rbegin()
// Range query: s.lower_bound(lo), s.upper_bound(hi)`}
        />
      </Section>

      {/* Coding Challenges */}
      <Section icon={Code2} title="Coding Challenges">
        <p className="text-foreground/80 leading-relaxed mb-4">
          Practice set-based patterns.
        </p>

        <CodingChallenge
          title="Challenge 1: Longest Consecutive Sequence"
          description="Given an unsorted array, find the length of the longest consecutive elements sequence. Must be O(n) — no sorting allowed. Use a hash set."
          starterCode={`int longestConsecutive(vector<int>& nums) {
    // Put all numbers in a set
    // For each number, check if it's a sequence start
    // (num-1 NOT in set)
    // Count consecutive numbers from there

}`}
          solution={`int longestConsecutive(vector<int>& nums) {
    unordered_set<int> numSet(nums.begin(), nums.end());
    int maxLen = 0;
    
    for (int num : numSet) {
        // Only start from beginning of a sequence
        if (!numSet.count(num - 1)) {
            int current = num;
            int length = 1;
            
            while (numSet.count(current + 1)) {
                current++;
                length++;
            }
            
            maxLen = max(maxLen, length);
        }
    }
    
    return maxLen;
}
// Time: O(n), Space: O(n)`}
          hints={[
            "Insert all numbers into an unordered_set.",
            "A number is a sequence START if (num - 1) is NOT in the set.",
            "From each start, count how many consecutive numbers exist using count(current + 1).",
          ]}
          testDescription="Only start counting from sequence beginnings to avoid redundant work."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("unordered_set") &&
              lower.includes("numset.count(num-1)") || lower.includes("!numset.count(num-1)") &&
              lower.includes("current+1") &&
              lower.includes("maxlen")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 2: Intersection of Two Arrays"
          description="Given two integer arrays, return their intersection (unique common elements). Use a hash set for O(n + m) time."
          starterCode={`vector<int> intersection(vector<int>& a, vector<int>& b) {
    // Put one array in a set
    // Iterate the other, check membership
    // Use another set to avoid duplicates in result

}`}
          solution={`vector<int> intersection(vector<int>& a, vector<int>& b) {
    unordered_set<int> setA(a.begin(), a.end());
    unordered_set<int> result;
    
    for (int x : b) {
        if (setA.count(x)) {
            result.insert(x);
        }
    }
    
    return vector<int>(result.begin(), result.end());
}
// Time: O(n + m), Space: O(n)`}
          hints={[
            "Insert the first array into an unordered_set.",
            "Iterate the second array and check if each element exists in the set.",
            "Use another set for the result to automatically handle duplicates.",
          ]}
          testDescription="One set for lookup, one set for deduplicated results."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("unordered_set") &&
              lower.includes("seta.count") || lower.includes("seta.find") &&
              lower.includes("result.insert")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 3: Happy Number"
          description="A happy number: repeatedly sum the squares of its digits. If it reaches 1, it's happy. If it enters a cycle, it's not. Use a set to detect cycles."
          starterCode={`bool isHappy(int n) {
    // Helper: sum of squares of digits
    // Use a set to track seen numbers
    // If you see a number again → cycle → not happy

}`}
          solution={`bool isHappy(int n) {
    unordered_set<int> seen;
    
    while (n != 1) {
        if (seen.count(n)) return false;
        seen.insert(n);
        
        int sum = 0;
        while (n > 0) {
            int d = n % 10;
            sum += d * d;
            n /= 10;
        }
        n = sum;
    }
    
    return true;
}
// Time: O(k), Space: O(k)
// k = number of steps until 1 or cycle`}
          hints={[
            "Track every number you've seen in an unordered_set.",
            "If you see a number again, you're in a cycle → return false.",
            "To get digits: n % 10 gives last digit, n /= 10 removes it.",
          ]}
          testDescription="Sum digit squares in a loop, use a set to detect if you've seen a number before."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("unordered_set") &&
              lower.includes("seen.count") || lower.includes("seen.find") &&
              lower.includes("n%10") &&
              lower.includes("d*d")
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
              <span><strong>Hash sets = unique elements + O(1) lookup.</strong> Use when you only need membership testing, not key-value pairs.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Deduplication is trivial with sets.</strong> Insert everything — duplicates are automatically rejected.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Set operations</strong> (intersection, union, difference) are O(n + m) with hash sets.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Longest Consecutive Sequence:</strong> put in set, only count from sequence starts. O(n).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Cycle detection with sets:</strong> track seen states. If you see a state again → cycle.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>std::set when you need sorted order</strong> or range queries (lower_bound/upper_bound). multiset allows duplicates.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>multiset trap:</strong> erase(value) removes ALL occurrences! Use erase(find(value)) for one.</span>
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
