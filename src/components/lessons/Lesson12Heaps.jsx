"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Triangle,
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
    question: "What is a heap?",
    options: [
      "A sorted array",
      "A complete binary tree where parent is greater (max-heap) or smaller (min-heap) than children",
      "A balanced BST",
      "A hash table variant",
    ],
    correctIndex: 1,
    explanation:
      "A heap is a COMPLETE binary tree satisfying the heap property: in a max-heap, every parent ≥ children. In a min-heap, every parent ≤ children. The root is always the max (or min) element.",
  },
  {
    id: 2,
    question: "Why are heaps stored as arrays instead of node-based trees?",
    options: [
      "Arrays are faster to sort",
      "Because heaps are complete binary trees, the structure maps perfectly to array indices with no wasted space",
      "Node-based trees can't represent heaps",
      "Arrays use less memory for any tree",
    ],
    correctIndex: 1,
    explanation:
      "Complete binary trees have no gaps, so array indices map perfectly: parent of i = (i-1)/2, left child = 2i+1, right child = 2i+2. No pointers needed → better cache performance and less memory.",
  },
  {
    id: 3,
    question: "What is the time complexity of inserting into a heap?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctIndex: 1,
    explanation:
      "Insert at the end (O(1)), then 'bubble up' — swap with parent while heap property is violated. The node travels at most from bottom to root = O(log n) swaps.",
  },
  {
    id: 4,
    question: "What is the time complexity of extracting the max/min from a heap?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctIndex: 1,
    explanation:
      "Replace root with last element (O(1)), then 'bubble down' — swap with the larger (max-heap) or smaller (min-heap) child until the heap property is restored. At most O(log n) swaps.",
  },
  {
    id: 5,
    question: "What is the time complexity of building a heap from an unsorted array?",
    options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"],
    correctIndex: 1,
    explanation:
      "Surprisingly, building a heap is O(n) — NOT O(n log n)! Using 'heapify from bottom up', most nodes are near the bottom and bubble down very little. The math works out to O(n) total swaps.",
  },
  {
    id: 6,
    question: "What is heapsort's time and space complexity?",
    options: ["O(n log n) time, O(n) space", "O(n log n) time, O(1) space", "O(n²) time, O(1) space", "O(n) time, O(n) space"],
    correctIndex: 1,
    explanation:
      "Heapsort: build max-heap O(n), then extract max n times (each O(log n)) = O(n log n) total. It's in-place (O(1) extra space). However, it's not stable and has poor cache performance vs quicksort.",
  },
  {
    id: 7,
    question: "How do you find the median of a data stream efficiently?",
    options: [
      "Sort after each insertion",
      "Use two heaps: a max-heap for the lower half and a min-heap for the upper half",
      "Use a BST",
      "Use an array and binary search",
    ],
    correctIndex: 1,
    explanation:
      "Two heaps: max-heap stores the smaller half, min-heap stores the larger half. Keep them balanced (size differs by at most 1). Median = top of max-heap (odd count) or average of both tops (even count). O(log n) per insert, O(1) median.",
  },
  {
    id: 8,
    question: "For a max-heap stored in an array, what are the children of element at index i?",
    options: [
      "i+1 and i+2",
      "2i and 2i+1",
      "2i+1 and 2i+2",
      "i/2 and i/2+1",
    ],
    correctIndex: 2,
    explanation:
      "For 0-indexed arrays: left child = 2i + 1, right child = 2i + 2, parent = (i - 1) / 2. For 1-indexed: left = 2i, right = 2i + 1, parent = i / 2.",
  },
  {
    id: 9,
    question: "What problem does 'merge k sorted lists' solve with a heap?",
    options: [
      "Find the maximum across all lists",
      "Always pick the smallest current head among k lists using a min-heap of size k",
      "Sort each list individually",
      "Concatenate and sort",
    ],
    correctIndex: 1,
    explanation:
      "Push all k list heads into a min-heap. Pop the smallest, add it to the result, push that list's next element. Repeat. The heap always gives you the globally smallest element in O(log k). Total: O(n log k).",
  },
  {
    id: 10,
    question: "What is the 'Top K Frequent Elements' approach using a heap?",
    options: [
      "Sort by frequency",
      "Count frequencies with hash map, then use a min-heap of size k to keep the k most frequent",
      "Use a BST",
      "Use bucket sort only",
    ],
    correctIndex: 1,
    explanation:
      "Step 1: Count frequencies with unordered_map — O(n). Step 2: Push into min-heap of size k. If heap exceeds k, pop the smallest frequency. After all elements, the heap has the k most frequent. O(n log k).",
  },
  {
    id: 11,
    question: "What is the difference between a heap and a BST?",
    options: [
      "They are the same",
      "Heap: parent vs children relationship only, complete tree, O(1) find-max. BST: fully ordered, O(log n) search for any element.",
      "BST is always faster",
      "Heap can store key-value pairs, BST cannot",
    ],
    correctIndex: 1,
    explanation:
      "Heap: only guarantees parent ≥ children (max-heap). You can find max in O(1) but searching for arbitrary elements is O(n). BST: fully ordered (left < root < right), any search is O(log n) but finding max is O(log n) not O(1).",
  },
  {
    id: 12,
    question: "Can you efficiently delete an arbitrary element from a heap?",
    options: [
      "Yes, O(1)",
      "Yes, O(log n) if you know the index",
      "No, you can only remove the root",
      "Yes, but it takes O(n)",
    ],
    correctIndex: 1,
    explanation:
      "If you know the index: replace it with the last element, then bubble up or down to restore the heap property — O(log n). Finding the index is the hard part (O(n) without a hash map). With an index map, it's O(log n) total.",
  },
];

export default function Lesson12Heaps({ onQuizComplete }) {
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
      {/* What is a Heap? */}
      <Section icon={BookOpen} title="What is a Heap?">
        <p className="text-foreground/80 leading-relaxed mb-4">
          A <strong>heap</strong> is a <strong>complete binary tree</strong> that satisfies the
          <strong> heap property</strong>: in a max-heap, every parent is ≥ its children. In a min-heap,
          every parent is ≤ its children. The root is always the max (or min) element.
        </p>

        <div className="grid gap-4 md:grid-cols-2 my-4">
          <div className="p-5 bg-card rounded-xl border border-danger/30">
            <h4 className="font-semibold text-danger mb-2">Max-Heap</h4>
            <div className="font-mono text-xs bg-code-bg rounded p-3">
              <p>{"        90"}</p>
              <p>{"       /  \\"}</p>
              <p>{"     70    80"}</p>
              <p>{"    / \\   /"}</p>
              <p>{"  50  60 30"}</p>
            </div>
            <p className="text-xs text-muted mt-2">Parent ≥ children. Root = maximum.</p>
          </div>
          <div className="p-5 bg-card rounded-xl border border-success/30">
            <h4 className="font-semibold text-success mb-2">Min-Heap</h4>
            <div className="font-mono text-xs bg-code-bg rounded p-3">
              <p>{"        10"}</p>
              <p>{"       /  \\"}</p>
              <p>{"     30    20"}</p>
              <p>{"    / \\   /"}</p>
              <p>{"  50  40 60"}</p>
            </div>
            <p className="text-xs text-muted mt-2">Parent ≤ children. Root = minimum.</p>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 my-4">
          <h4 className="font-semibold mb-3 text-accent-light">Heap as an Array</h4>
          <div className="font-mono text-sm bg-code-bg rounded-lg p-4 overflow-x-auto">
            <p className="text-muted">{"// Max-heap [90, 70, 80, 50, 60, 30]"}</p>
            <p className="text-foreground/90">{"Index:  0   1   2   3   4   5"}</p>
            <p className="text-accent-light">{"Value: [90] [70] [80] [50] [60] [30]"}</p>
            <p className="text-muted mt-2">{"// Parent of i    = (i - 1) / 2"}</p>
            <p className="text-muted">{"// Left child of i  = 2 * i + 1"}</p>
            <p className="text-muted">{"// Right child of i = 2 * i + 2"}</p>
            <p className="text-success mt-2">{"// Example: parent of index 4 (60) = (4-1)/2 = 1 (70) ✓"}</p>
            <p className="text-success">{"// Left child of index 1 (70) = 2*1+1 = 3 (50) ✓"}</p>
          </div>
        </div>

        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-card">
                <th className="text-left p-3 border-b border-border font-semibold">Operation</th>
                <th className="text-left p-3 border-b border-border font-semibold">Time</th>
                <th className="text-left p-3 border-b border-border font-semibold">How</th>
              </tr>
            </thead>
            <tbody>
              {[
                { op: "Get max/min", time: "O(1)", how: "Return root (arr[0])" },
                { op: "Insert", time: "O(log n)", how: "Add at end, bubble up" },
                { op: "Extract max/min", time: "O(log n)", how: "Swap root with last, bubble down" },
                { op: "Build heap", time: "O(n)", how: "Heapify from bottom up" },
                { op: "Heapsort", time: "O(n log n)", how: "Build heap + n extractions" },
                { op: "Search", time: "O(n)", how: "No ordering → linear scan" },
              ].map((row) => (
                <tr key={row.op} className="border-b border-border/50 hover:bg-card/50">
                  <td className="p-3 font-semibold">{row.op}</td>
                  <td className="p-3 font-mono text-xs text-success">{row.time}</td>
                  <td className="p-3 text-xs text-muted">{row.how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Heap Operations */}
      <Section icon={Zap} title="Heap Operations — Build from Scratch">
        <CodeBlock
          title="Max-Heap Implementation"
          code={`class MaxHeap {
    vector<int> data;
    
    void bubbleUp(int i) {
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (data[i] > data[parent]) {
                swap(data[i], data[parent]);
                i = parent;
            } else break;
        }
    }
    
    void bubbleDown(int i) {
        int n = data.size();
        while (true) {
            int largest = i;
            int left = 2 * i + 1;
            int right = 2 * i + 2;
            
            if (left < n && data[left] > data[largest])
                largest = left;
            if (right < n && data[right] > data[largest])
                largest = right;
            
            if (largest != i) {
                swap(data[i], data[largest]);
                i = largest;
            } else break;
        }
    }
    
public:
    void push(int val) {
        data.push_back(val);       // Add at end
        bubbleUp(data.size() - 1); // Fix heap property upward
    }
    
    int top() {
        return data[0];  // Max is always at root
    }
    
    void pop() {
        data[0] = data.back();  // Replace root with last
        data.pop_back();
        if (!data.empty()) bubbleDown(0);  // Fix heap property downward
    }
    
    int size() { return data.size(); }
    bool empty() { return data.empty(); }
};`}
        />

        <CodeBlock
          title="Build Heap — O(n) Magic"
          code={`// Build a max-heap from an unsorted array
void buildHeap(vector<int>& arr) {
    int n = arr.size();
    
    // Start from the last non-leaf node, heapify each
    // Last non-leaf = parent of last element = (n-1-1)/2 = n/2 - 1
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
}

void heapify(vector<int>& arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    
    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;
    
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);  // Continue down
    }
}

// Why O(n) and not O(n log n)?
// Most nodes are near the bottom — they barely bubble down
// Level k has 2^k nodes, each bubbles down at most (h-k) levels
// Sum: Σ 2^k * (h-k) for k=0 to h = O(n)
// This is a key interview fact!`}
        />

        <CodeBlock
          title="Heapsort — O(n log n), In-Place"
          code={`void heapsort(vector<int>& arr) {
    int n = arr.size();
    
    // Step 1: Build max-heap — O(n)
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
    
    // Step 2: Extract max repeatedly — O(n log n)
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);    // Move max to end
        heapify(arr, i, 0);     // Heapify reduced heap
    }
}

// After heapsort, arr is sorted in ascending order
// Time: O(n log n), Space: O(1) — in-place!
// Not stable. Worse cache performance than quicksort.
// But guaranteed O(n log n) worst case (unlike quicksort).`}
        />

        <KeyPoint>
          <strong>Build heap is O(n), not O(n log n).</strong> This is a common interview question.
          Most candidates say O(n log n) — knowing the correct answer and WHY shows deep understanding.
        </KeyPoint>
      </Section>

      {/* Classic Heap Problems */}
      <Section icon={Brain} title="Classic Heap Interview Problems">
        <h3 className="text-lg font-semibold mt-2 mb-3 text-accent-light">1. Top K Frequent Elements</h3>
        <CodeBlock
          title="Top K Frequent — Hash Map + Min-Heap"
          code={`vector<int> topKFrequent(vector<int>& nums, int k) {
    // Step 1: Count frequencies — O(n)
    unordered_map<int, int> freq;
    for (int num : nums) freq[num]++;
    
    // Step 2: Min-heap of size k — O(n log k)
    // Pair: {frequency, value}
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> minHeap;
    
    for (auto& [val, count] : freq) {
        minHeap.push({count, val});
        if (minHeap.size() > k) {
            minHeap.pop();  // Remove least frequent
        }
    }
    
    // Step 3: Extract results
    vector<int> result;
    while (!minHeap.empty()) {
        result.push_back(minHeap.top().second);
        minHeap.pop();
    }
    
    return result;
}
// Time: O(n log k), Space: O(n)`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">2. Median of Data Stream</h3>
        <CodeBlock
          title="Find Median — Two Heaps Technique"
          code={`class MedianFinder {
    priority_queue<int> maxHeap;  // Lower half (max on top)
    priority_queue<int, vector<int>, greater<int>> minHeap;  // Upper half (min on top)
    
public:
    void addNum(int num) {
        // Always add to maxHeap first
        maxHeap.push(num);
        
        // Ensure maxHeap's top ≤ minHeap's top
        minHeap.push(maxHeap.top());
        maxHeap.pop();
        
        // Balance sizes: maxHeap can have at most 1 more
        if (minHeap.size() > maxHeap.size()) {
            maxHeap.push(minHeap.top());
            minHeap.pop();
        }
    }
    
    double findMedian() {
        if (maxHeap.size() > minHeap.size()) {
            return maxHeap.top();  // Odd count
        }
        return (maxHeap.top() + minHeap.top()) / 2.0;  // Even count
    }
};

// Example: add 1, 2, 3
// add(1): maxHeap=[1], minHeap=[]     → median=1
// add(2): maxHeap=[1], minHeap=[2]    → median=1.5
// add(3): maxHeap=[2,1], minHeap=[3]  → median=2

// addNum: O(log n), findMedian: O(1)
// This is a HARD-level Google problem. Know it!`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">3. K Closest Points to Origin</h3>
        <CodeBlock
          title="K Closest Points — Max-Heap of Size K"
          code={`vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
    // Max-heap: keep k closest, pop farthest when size > k
    // Pair: {distance², point_index}
    priority_queue<pair<int,int>> maxHeap;
    
    for (int i = 0; i < points.size(); i++) {
        int dist = points[i][0] * points[i][0] + points[i][1] * points[i][1];
        maxHeap.push({dist, i});
        
        if (maxHeap.size() > k) {
            maxHeap.pop();  // Remove farthest
        }
    }
    
    vector<vector<int>> result;
    while (!maxHeap.empty()) {
        result.push_back(points[maxHeap.top().second]);
        maxHeap.pop();
    }
    
    return result;
}
// Time: O(n log k), Space: O(k)
// No need for sqrt — comparing squared distances works!`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">4. Sort a Nearly Sorted Array</h3>
        <CodeBlock
          title="Sort K-Sorted Array — Min-Heap"
          code={`// Each element is at most k positions away from its sorted position
// Use a min-heap of size k+1

vector<int> sortNearlySorted(vector<int>& arr, int k) {
    priority_queue<int, vector<int>, greater<int>> minHeap;
    vector<int> result;
    
    for (int i = 0; i < arr.size(); i++) {
        minHeap.push(arr[i]);
        
        if (minHeap.size() > k + 1) {
            result.push_back(minHeap.top());
            minHeap.pop();
        }
    }
    
    while (!minHeap.empty()) {
        result.push_back(minHeap.top());
        minHeap.pop();
    }
    
    return result;
}
// Time: O(n log k), Space: O(k)
// Much better than O(n log n) full sort!`}
        />

        <Warning>
          <strong>Heap pattern for &quot;Top K&quot; problems:</strong> For K largest → use min-heap of size K.
          For K smallest → use max-heap of size K. This seems backwards but it works: the heap holds
          the K best, and when it overflows, the &quot;worst of the best&quot; is on top and gets popped.
        </Warning>
      </Section>

      {/* Heap vs BST vs Sorted Array */}
      <Section icon={BookOpen} title="Heap vs BST vs Sorted Array">
        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-card">
                <th className="text-left p-3 border-b border-border font-semibold">Operation</th>
                <th className="text-left p-3 border-b border-border font-semibold">Heap</th>
                <th className="text-left p-3 border-b border-border font-semibold">BST (balanced)</th>
                <th className="text-left p-3 border-b border-border font-semibold">Sorted Array</th>
              </tr>
            </thead>
            <tbody>
              {[
                { op: "Get min/max", h: "O(1)", b: "O(log n)", a: "O(1)" },
                { op: "Insert", h: "O(log n)", b: "O(log n)", a: "O(n)" },
                { op: "Delete min/max", h: "O(log n)", b: "O(log n)", a: "O(1) / O(n)" },
                { op: "Search any", h: "O(n)", b: "O(log n)", a: "O(log n)" },
                { op: "Build from array", h: "O(n)", b: "O(n log n)", a: "O(n log n)" },
                { op: "Sorted traversal", h: "O(n log n)", b: "O(n)", a: "O(n)" },
              ].map((row) => (
                <tr key={row.op} className="border-b border-border/50 hover:bg-card/50">
                  <td className="p-3 font-semibold">{row.op}</td>
                  <td className="p-3 font-mono text-xs">{row.h}</td>
                  <td className="p-3 font-mono text-xs">{row.b}</td>
                  <td className="p-3 font-mono text-xs">{row.a}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <KeyPoint>
          <strong>Use a heap when you only need the max/min.</strong> Use a BST (set/map) when you need
          to search for any element or iterate in sorted order. Use a sorted array when data is static.
        </KeyPoint>
      </Section>

      {/* C++ Syntax Reference */}
      <Section icon={Code2} title="C++ Syntax Reference">
        <CodeBlock
          title="priority_queue — Complete Heap Reference"
          code={`#include <queue>
#include <vector>
#include <algorithm>
using namespace std;

// ========== Max-Heap (default) ==========
priority_queue<int> maxPQ;
maxPQ.push(10);           // Insert — O(log n)
maxPQ.push(30);
maxPQ.push(20);
maxPQ.top();              // 30 (max) — O(1)
maxPQ.pop();              // Remove 30 — O(log n)
maxPQ.size();             // 2
maxPQ.empty();            // false

// ========== Min-Heap ==========
priority_queue<int, vector<int>, greater<int>> minPQ;
minPQ.push(10);
minPQ.push(30);
minPQ.push(20);
minPQ.top();              // 10 (min)

// ========== Custom Comparator ==========
// For structs/classes
auto cmp = [](const pair<int,int>& a, const pair<int,int>& b) {
    return a.first > b.first;  // Min-heap by first element
};
priority_queue<pair<int,int>, vector<pair<int,int>>, decltype(cmp)> pq(cmp);

// ========== Build Heap from Array — O(n) ==========
vector<int> arr = {5, 3, 8, 1, 2};
priority_queue<int> pq2(arr.begin(), arr.end());

// ========== STL Heap Functions (on vectors) ==========
vector<int> v = {5, 3, 8, 1, 2};
make_heap(v.begin(), v.end());        // Build max-heap — O(n)
// v is now: [8, 3, 5, 1, 2]

v.push_back(10);
push_heap(v.begin(), v.end());        // Bubble up last — O(log n)

pop_heap(v.begin(), v.end());         // Move max to end — O(log n)
v.pop_back();                          // Remove it

sort_heap(v.begin(), v.end());        // Heapsort — O(n log n)

is_heap(v.begin(), v.end());          // Check if valid heap`}
        />
      </Section>

      {/* Coding Challenges */}
      <Section icon={Code2} title="Coding Challenges">
        <CodingChallenge
          title="Challenge 1: K-th Largest Element"
          description="Find the k-th largest element in an unsorted array. Use a min-heap of size k. Don't sort the entire array."
          starterCode={`int findKthLargest(vector<int>& nums, int k) {
    // Use min-heap of size k
    // After processing all elements, top = k-th largest

}`}
          solution={`int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> minHeap;
    
    for (int num : nums) {
        minHeap.push(num);
        if (minHeap.size() > k) {
            minHeap.pop();
        }
    }
    
    return minHeap.top();
}
// Time: O(n log k), Space: O(k)`}
          hints={[
            "Use a min-heap (priority_queue with greater<int>).",
            "Push every element. If heap size exceeds k, pop the smallest.",
            "The top of the min-heap is the k-th largest after processing all elements.",
          ]}
          testDescription="Min-heap of size k holds the k largest. Top = smallest of those = k-th largest."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("priority_queue") &&
              lower.includes("greater<int>") &&
              lower.includes(".push(") &&
              lower.includes(".pop(") &&
              lower.includes(".top()")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 2: Merge K Sorted Arrays"
          description="Given k sorted arrays, merge them into one sorted array. Use a min-heap to always pick the smallest current element."
          starterCode={`vector<int> mergeKSorted(vector<vector<int>>& arrays) {
    // Min-heap of {value, array_index, element_index}
    // Pop smallest, push next from same array

}`}
          solution={`vector<int> mergeKSorted(vector<vector<int>>& arrays) {
    // {value, array_index, element_index}
    priority_queue<tuple<int,int,int>, vector<tuple<int,int,int>>,
                   greater<tuple<int,int,int>>> minHeap;
    
    // Push first element from each array
    for (int i = 0; i < arrays.size(); i++) {
        if (!arrays[i].empty()) {
            minHeap.push({arrays[i][0], i, 0});
        }
    }
    
    vector<int> result;
    while (!minHeap.empty()) {
        auto [val, arrIdx, elemIdx] = minHeap.top();
        minHeap.pop();
        result.push_back(val);
        
        // Push next element from same array
        if (elemIdx + 1 < arrays[arrIdx].size()) {
            minHeap.push({arrays[arrIdx][elemIdx + 1], arrIdx, elemIdx + 1});
        }
    }
    
    return result;
}
// Time: O(n log k), Space: O(k)`}
          hints={[
            "Push the first element from each array into a min-heap, along with array index and element index.",
            "Pop the smallest, add to result. Then push the next element from the same array.",
            "Repeat until the heap is empty.",
          ]}
          testDescription="Min-heap of size k gives you the global minimum in O(log k) each time."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("priority_queue") &&
              lower.includes("greater") &&
              lower.includes("minheap.push") &&
              lower.includes("minheap.pop") &&
              lower.includes("result.push_back")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 3: Last Stone Weight"
          description="You have a collection of stones with positive weights. Each turn, smash the two heaviest. If they're equal, both destroyed. If not, the remainder is the difference. Return the last stone's weight (or 0)."
          starterCode={`int lastStoneWeight(vector<int>& stones) {
    // Use a max-heap
    // Each turn: pop two largest, push difference if > 0

}`}
          solution={`int lastStoneWeight(vector<int>& stones) {
    priority_queue<int> maxHeap(stones.begin(), stones.end());
    
    while (maxHeap.size() > 1) {
        int first = maxHeap.top(); maxHeap.pop();
        int second = maxHeap.top(); maxHeap.pop();
        
        if (first != second) {
            maxHeap.push(first - second);
        }
    }
    
    return maxHeap.empty() ? 0 : maxHeap.top();
}
// Time: O(n log n), Space: O(n)`}
          hints={[
            "Use a max-heap to always get the two heaviest stones.",
            "Pop the two largest. If they differ, push the difference back.",
            "Continue until 0 or 1 stones remain.",
          ]}
          testDescription="Max-heap gives you the heaviest stones. Smash them and push the remainder."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("priority_queue") &&
              lower.includes("maxheap.top()") &&
              lower.includes("maxheap.pop()") &&
              lower.includes("first-second") || lower.includes("first!=second")
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
              <span><strong>Heap = complete binary tree + heap property.</strong> Stored as array. Parent at (i-1)/2, children at 2i+1, 2i+2.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Get max/min in O(1), insert/extract in O(log n).</strong> Build heap from array in O(n).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Top K pattern:</strong> K largest → min-heap of size K. K smallest → max-heap of size K.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Median of stream:</strong> two heaps (max-heap for lower half, min-heap for upper half). O(log n) insert, O(1) median.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Merge K sorted:</strong> min-heap of size K. Always pop smallest, push next from same source. O(n log k).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Heapsort is O(n log n) in-place</strong> but not stable. Good for guaranteed worst-case performance.</span>
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
