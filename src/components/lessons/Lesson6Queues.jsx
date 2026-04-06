"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ListOrdered,
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
    question: "What principle does a queue follow?",
    options: ["LIFO (Last In, First Out)", "FIFO (First In, First Out)", "Random access", "Priority-based"],
    correctIndex: 1,
    explanation:
      "A queue follows FIFO — the first element enqueued is the first one dequeued. Like a line at a grocery store: first person in line gets served first.",
  },
  {
    id: 2,
    question: "What is the time complexity of enqueue and dequeue on a standard queue?",
    options: ["O(n) for both", "O(1) for both", "O(1) enqueue, O(n) dequeue", "O(log n) for both"],
    correctIndex: 1,
    explanation:
      "Both enqueue (add to back) and dequeue (remove from front) are O(1). The queue only touches its front and back.",
  },
  {
    id: 3,
    question: "What graph algorithm uses a queue?",
    options: ["DFS (Depth-First Search)", "BFS (Breadth-First Search)", "Dijkstra's algorithm", "Topological sort"],
    correctIndex: 1,
    explanation:
      "BFS uses a queue to explore nodes level by level. DFS uses a stack (or recursion). Dijkstra's uses a priority queue. Topological sort can use either a queue (Kahn's) or DFS.",
  },
  {
    id: 4,
    question: "What is a deque (double-ended queue)?",
    options: [
      "A queue that can only hold two elements",
      "A data structure that supports insertion and removal at both front and back in O(1)",
      "Two separate queues combined",
      "A queue sorted in ascending order",
    ],
    correctIndex: 1,
    explanation:
      "A deque allows O(1) push/pop at BOTH the front and back. It combines the power of stacks (back operations) and queues (front operations) into one structure.",
  },
  {
    id: 5,
    question: "What does std::priority_queue in C++ implement by default?",
    options: ["Min-heap (smallest on top)", "Max-heap (largest on top)", "Sorted array", "Balanced BST"],
    correctIndex: 1,
    explanation:
      "std::priority_queue is a MAX-HEAP by default — the largest element is always on top. For a min-heap, use: priority_queue<int, vector<int>, greater<int>>.",
  },
  {
    id: 6,
    question: "What is the time complexity of push and pop on a priority queue (heap)?",
    options: ["O(1) for both", "O(n) for both", "O(log n) for both", "O(1) push, O(log n) pop"],
    correctIndex: 2,
    explanation:
      "Both push and pop on a heap are O(log n) because the heap must maintain its ordering property by 'bubbling up' (push) or 'bubbling down' (pop). Accessing the top is O(1).",
  },
  {
    id: 7,
    question: "What is a circular queue?",
    options: [
      "A queue arranged in a circle in memory",
      "A fixed-size queue where the back wraps around to the front using modular arithmetic",
      "A queue that sorts elements in a circle",
      "A doubly linked list",
    ],
    correctIndex: 1,
    explanation:
      "A circular queue uses a fixed-size array where indices wrap around: next = (current + 1) % capacity. This avoids wasting space when elements are dequeued from the front.",
  },
  {
    id: 8,
    question: "How do you create a min-heap priority_queue in C++?",
    options: [
      "priority_queue<int> pq;",
      "priority_queue<int, vector<int>, less<int>> pq;",
      "priority_queue<int, vector<int>, greater<int>> pq;",
      "min_priority_queue<int> pq;",
    ],
    correctIndex: 2,
    explanation:
      "Use greater<int> as the comparator: priority_queue<int, vector<int>, greater<int>>. The default (less<int>) gives a max-heap. greater<int> reverses the ordering to give a min-heap.",
  },
  {
    id: 9,
    question: "What is the 'Sliding Window Maximum' problem's optimal time complexity?",
    options: ["O(n²)", "O(n log n)", "O(n)", "O(n × k)"],
    correctIndex: 2,
    explanation:
      "Using a deque (monotonic deque), you can solve sliding window maximum in O(n). The deque maintains indices of elements in decreasing order. Each element is pushed/popped at most once.",
  },
  {
    id: 10,
    question: "Which STL container is used as the default backing for std::queue?",
    options: ["std::vector", "std::list", "std::deque", "std::array"],
    correctIndex: 2,
    explanation:
      "Like std::stack, std::queue uses std::deque as its default underlying container. Deque provides O(1) push_back and pop_front, which is exactly what a queue needs.",
  },
  {
    id: 11,
    question: "What problem does a priority queue efficiently solve?",
    options: [
      "Finding the median of a stream",
      "Sorting a fully sorted array",
      "Finding the k-th largest/smallest element",
      "Both finding the median and k-th largest/smallest",
    ],
    correctIndex: 3,
    explanation:
      "Priority queues efficiently solve: k-th largest (use min-heap of size k), k-th smallest (use max-heap of size k), and median of stream (use two heaps). All are classic interview problems.",
  },
  {
    id: 12,
    question: "What is the difference between std::queue and std::deque?",
    options: [
      "They are the same thing",
      "queue only allows push_back/pop_front; deque allows push/pop at both ends",
      "deque is slower than queue",
      "queue supports random access, deque doesn't",
    ],
    correctIndex: 1,
    explanation:
      "std::queue is a restricted adaptor: only push to back, pop from front (FIFO). std::deque is the full container: push/pop at both front and back, plus random access with operator[].",
  },
];

export default function Lesson6Queues({ onQuizComplete }) {
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
      {/* What is a Queue? */}
      <Section icon={BookOpen} title="What is a Queue?">
        <p className="text-foreground/80 leading-relaxed mb-4">
          A <strong>queue</strong> is a linear data structure that follows the <strong>FIFO</strong> (First In, First Out)
          principle. The first element added is the first one removed — like a line at a store.
        </p>

        <div className="bg-card rounded-xl border border-border p-5 my-4">
          <h4 className="font-semibold mb-3 text-accent-light">Visual: Queue Operations</h4>
          <div className="font-mono text-sm bg-code-bg rounded-lg p-4 overflow-x-auto">
            <p className="text-muted mb-2">{"// enqueue(10), enqueue(20), enqueue(30)"}</p>
            <p className="text-foreground/90">{"  front → [10] [20] [30] ← back"}</p>
            <p className="text-muted mt-2">{"// dequeue() → returns 10 (first in, first out)"}</p>
            <p className="text-foreground/90">{"  front → [20] [30] ← back"}</p>
            <p className="text-muted mt-2">{"// enqueue(40)"}</p>
            <p className="text-foreground/90">{"  front → [20] [30] [40] ← back"}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 my-4">
          <div className="p-4 bg-card rounded-xl border border-border text-center">
            <h4 className="font-semibold text-accent-light mb-1">Stack (LIFO)</h4>
            <p className="text-xs text-muted">Last in, first out</p>
            <p className="text-xs text-muted mt-1">Think: stack of plates</p>
          </div>
          <div className="p-4 bg-card rounded-xl border border-success/30 text-center">
            <h4 className="font-semibold text-success mb-1">Queue (FIFO)</h4>
            <p className="text-xs text-muted">First in, first out</p>
            <p className="text-xs text-muted mt-1">Think: line at a store</p>
          </div>
          <div className="p-4 bg-card rounded-xl border border-warning/30 text-center">
            <h4 className="font-semibold text-warning mb-1">Priority Queue</h4>
            <p className="text-xs text-muted">Highest priority first</p>
            <p className="text-xs text-muted mt-1">Think: ER triage</p>
          </div>
        </div>

        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-card">
                <th className="text-left p-3 border-b border-border font-semibold">Operation</th>
                <th className="text-left p-3 border-b border-border font-semibold">Queue</th>
                <th className="text-left p-3 border-b border-border font-semibold">Deque</th>
                <th className="text-left p-3 border-b border-border font-semibold">Priority Queue</th>
              </tr>
            </thead>
            <tbody>
              {[
                { op: "Insert", q: "O(1) back", dq: "O(1) front/back", pq: "O(log n)" },
                { op: "Remove", q: "O(1) front", dq: "O(1) front/back", pq: "O(log n)" },
                { op: "Peek", q: "O(1) front", dq: "O(1) front/back", pq: "O(1) top" },
                { op: "Search", q: "O(n)", dq: "O(n)", pq: "O(n)" },
                { op: "Access by index", q: "No", dq: "O(1)", pq: "No" },
              ].map((row) => (
                <tr key={row.op} className="border-b border-border/50 hover:bg-card/50">
                  <td className="p-3 font-semibold">{row.op}</td>
                  <td className="p-3 font-mono text-xs">{row.q}</td>
                  <td className="p-3 font-mono text-xs">{row.dq}</td>
                  <td className="p-3 font-mono text-xs">{row.pq}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* std::queue */}
      <Section icon={Code2} title="std::queue in C++">
        <CodeBlock
          title="Queue — Basic Usage"
          code={`#include <queue>
using namespace std;

queue<int> q;

q.push(10);     // Enqueue to back: [10]
q.push(20);     // [10, 20]
q.push(30);     // [10, 20, 30]

q.front();      // 10 (peek front)
q.back();       // 30 (peek back)
q.pop();        // Dequeue front. Now: [20, 30]
q.size();       // 2
q.empty();      // false

// WARNING: Like stack, pop() returns void!
// Always call front() before pop()
int val = q.front();
q.pop();`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">BFS — The Primary Use of Queues</h3>
        <p className="text-foreground/80 leading-relaxed mb-3">
          Queues are the backbone of <strong>Breadth-First Search (BFS)</strong>. BFS explores nodes level
          by level — the queue ensures we process nodes in the order we discover them.
        </p>
        <CodeBlock
          title="BFS on a Binary Tree — Level Order Traversal"
          code={`// Process tree level by level using a queue
vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> result;
    if (!root) return result;
    
    queue<TreeNode*> q;
    q.push(root);
    
    while (!q.empty()) {
        int levelSize = q.size();  // Nodes at current level
        vector<int> level;
        
        for (int i = 0; i < levelSize; i++) {
            TreeNode* node = q.front();
            q.pop();
            
            level.push_back(node->val);
            
            if (node->left)  q.push(node->left);
            if (node->right) q.push(node->right);
        }
        
        result.push_back(level);
    }
    
    return result;
}

// For tree:     1
//             /   \\
//            2     3
//           / \\
//          4   5
// Output: [[1], [2,3], [4,5]]
// Time: O(n), Space: O(n)`}
        />
        <KeyPoint>
          <strong>BFS pattern: </strong> push starting node → while queue not empty → pop front → process →
          push neighbors. The <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">levelSize</code> trick
          lets you process one level at a time. You&apos;ll use this extensively in the Graph lessons.
        </KeyPoint>
      </Section>

      {/* Deque */}
      <Section icon={Zap} title="std::deque — Double-Ended Queue">
        <p className="text-foreground/80 leading-relaxed mb-4">
          A <strong>deque</strong> (pronounced &quot;deck&quot;) supports O(1) insertion and removal at
          <strong> both ends</strong>. It also supports O(1) random access — making it incredibly versatile.
        </p>
        <CodeBlock
          title="std::deque — Complete Usage"
          code={`#include <deque>
using namespace std;

deque<int> dq;

// Push/pop at BOTH ends — all O(1)
dq.push_back(10);      // [10]
dq.push_back(20);      // [10, 20]
dq.push_front(5);      // [5, 10, 20]
dq.pop_front();         // [10, 20]
dq.pop_back();          // [10]

// Random access — O(1)
dq.push_back(20);
dq.push_back(30);       // [10, 20, 30]
dq[0];                  // 10
dq[2];                  // 30

// Front and back
dq.front();             // 10
dq.back();              // 30

// Size and empty
dq.size();              // 3
dq.empty();             // false

// Iterate
for (int x : dq) cout << x << " ";`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">Sliding Window Maximum — Monotonic Deque</h3>
        <p className="text-foreground/80 leading-relaxed mb-3">
          This is the classic deque problem and a Google favorite. Find the maximum element in every
          window of size k as it slides across the array.
        </p>
        <CodeBlock
          title="Sliding Window Maximum — O(n)"
          code={`// Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
// Output: [3,3,5,5,6,7]
// Window [1,3,-1] max=3, [3,-1,-3] max=3, [-1,-3,5] max=5, ...

vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq;  // Stores INDICES, maintains decreasing order of values
    vector<int> result;
    
    for (int i = 0; i < nums.size(); i++) {
        // Remove indices that are out of the current window
        while (!dq.empty() && dq.front() < i - k + 1) {
            dq.pop_front();
        }
        
        // Remove indices of elements SMALLER than current
        // (they can never be the max while current element exists)
        while (!dq.empty() && nums[dq.back()] < nums[i]) {
            dq.pop_back();
        }
        
        dq.push_back(i);
        
        // Window is fully formed after first k elements
        if (i >= k - 1) {
            result.push_back(nums[dq.front()]);  // Front is always the max
        }
    }
    
    return result;
}

// Why O(n)? Each element is pushed and popped from the deque AT MOST ONCE.
// Total operations: 2n = O(n)
// Space: O(k) for the deque`}
        />
        <KeyPoint>
          <strong>Monotonic deque pattern:</strong> maintain indices in decreasing order of values. The front
          is always the current maximum. Pop from front if out of window, pop from back if smaller than
          new element. This is the same idea as monotonic stack but with access to both ends.
        </KeyPoint>
      </Section>

      {/* Priority Queue */}
      <Section icon={Brain} title="Priority Queue (Heap)">
        <p className="text-foreground/80 leading-relaxed mb-4">
          A <strong>priority queue</strong> always gives you the highest (or lowest) priority element first.
          It&apos;s implemented as a <strong>heap</strong> — a complete binary tree where parent ≥ children (max-heap)
          or parent ≤ children (min-heap).
        </p>
        <CodeBlock
          title="std::priority_queue — Max-Heap and Min-Heap"
          code={`#include <queue>
using namespace std;

// === MAX-HEAP (default) — largest on top ===
priority_queue<int> maxPQ;
maxPQ.push(10);    // {10}
maxPQ.push(30);    // {30, 10}
maxPQ.push(20);    // {30, 20, 10}
maxPQ.top();       // 30 (largest)  — O(1)
maxPQ.pop();       // Removes 30    — O(log n)
maxPQ.size();      // 2
maxPQ.empty();     // false

// === MIN-HEAP — smallest on top ===
priority_queue<int, vector<int>, greater<int>> minPQ;
minPQ.push(10);    // {10}
minPQ.push(30);    // {10, 30}
minPQ.push(20);    // {10, 20, 30}
minPQ.top();       // 10 (smallest)  — O(1)
minPQ.pop();       // Removes 10     — O(log n)

// === Priority Queue of pairs ===
// Useful for Dijkstra's, k closest points, etc.
priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
pq.push({5, 0});   // {distance, node}
pq.push({2, 1});
pq.push({8, 2});
auto [dist, node] = pq.top();  // {2, 1} — smallest distance first`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">K-th Largest Element</h3>
        <CodeBlock
          title="Find K-th Largest — O(n log k)"
          code={`// Find the k-th largest element in an unsorted array
// Use a MIN-HEAP of size k

int findKthLargest(vector<int>& nums, int k) {
    // Min-heap: smallest of the k largest elements is on top
    priority_queue<int, vector<int>, greater<int>> minHeap;
    
    for (int num : nums) {
        minHeap.push(num);
        
        // Keep only k elements in heap
        if (minHeap.size() > k) {
            minHeap.pop();  // Remove smallest
        }
    }
    
    return minHeap.top();  // k-th largest
}

// Example: nums = [3,2,1,5,6,4], k = 2
// Process: push 3→{3}, push 2→{2,3}, push 1→{1,2,3}→pop 1→{2,3}
//          push 5→{2,3,5}→pop 2→{3,5}, push 6→{3,5,6}→pop 3→{5,6}
//          push 4→{4,5,6}→pop 4→{5,6}
// Answer: top() = 5 (2nd largest)

// Time: O(n log k) — n elements, each heap op is O(log k)
// Space: O(k) — heap holds at most k elements`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">Merge K Sorted Lists</h3>
        <CodeBlock
          title="Merge K Sorted Lists — O(n log k)"
          code={`// Merge k sorted linked lists into one sorted list
// Use a min-heap to always pick the smallest head

ListNode* mergeKLists(vector<ListNode*>& lists) {
    // Min-heap: compare by node value
    auto cmp = [](ListNode* a, ListNode* b) {
        return a->val > b->val;  // Min-heap
    };
    priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);
    
    // Push all list heads
    for (auto* list : lists) {
        if (list) pq.push(list);
    }
    
    ListNode dummy(0);
    ListNode* tail = &dummy;
    
    while (!pq.empty()) {
        ListNode* smallest = pq.top();
        pq.pop();
        
        tail->next = smallest;
        tail = tail->next;
        
        if (smallest->next) {
            pq.push(smallest->next);
        }
    }
    
    return dummy.next;
}

// Time: O(n log k) — n total nodes, heap of size k
// Space: O(k) — heap holds at most k nodes`}
        />

        <Warning>
          <strong>Priority queue ≠ sorted container.</strong> You can only access the top element. You cannot
          iterate in sorted order or access arbitrary elements. If you need sorted iteration, use a
          <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">set</code> or
          <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">multiset</code> instead.
        </Warning>
      </Section>

      {/* Circular Queue */}
      <Section icon={BookOpen} title="Circular Queue">
        <p className="text-foreground/80 leading-relaxed mb-4">
          A <strong>circular queue</strong> uses a fixed-size array where the indices wrap around.
          This avoids wasting space when elements are dequeued.
        </p>
        <CodeBlock
          title="Circular Queue Implementation"
          code={`class CircularQueue {
    vector<int> data;
    int front, rear, count, capacity;
    
public:
    CircularQueue(int k) : data(k), front(0), rear(-1), count(0), capacity(k) {}
    
    bool enqueue(int val) {
        if (isFull()) return false;
        rear = (rear + 1) % capacity;  // Wrap around!
        data[rear] = val;
        count++;
        return true;
    }
    
    bool dequeue() {
        if (isEmpty()) return false;
        front = (front + 1) % capacity;  // Wrap around!
        count--;
        return true;
    }
    
    int getFront() {
        if (isEmpty()) return -1;
        return data[front];
    }
    
    int getRear() {
        if (isEmpty()) return -1;
        return data[rear];
    }
    
    bool isEmpty() { return count == 0; }
    bool isFull()  { return count == capacity; }
};

// The key trick: (index + 1) % capacity
// When index reaches the end, it wraps to 0
// This creates a "circular" effect in a linear array`}
        />
      </Section>

      {/* C++ Syntax Reference */}
      <Section icon={Code2} title="C++ Syntax Reference">
        <CodeBlock
          title="Queue, Deque, Priority Queue — Complete Reference"
          code={`#include <queue>
#include <deque>
using namespace std;

// ========== std::queue ==========
queue<int> q;
q.push(x);          // Enqueue (add to back)
q.pop();             // Dequeue (remove front) — returns void!
q.front();           // Peek front
q.back();            // Peek back
q.size();            // Number of elements
q.empty();           // Is empty?

// Safe dequeue pattern:
if (!q.empty()) {
    int val = q.front();
    q.pop();
}

// ========== std::deque ==========
deque<int> dq;
dq.push_back(x);    // Add to back  — O(1)
dq.push_front(x);   // Add to front — O(1)
dq.pop_back();       // Remove back  — O(1)
dq.pop_front();      // Remove front — O(1)
dq.front();          // Peek front
dq.back();           // Peek back
dq[i];               // Random access — O(1)
dq.size();
dq.empty();

// ========== std::priority_queue ==========
// Max-heap (default)
priority_queue<int> maxPQ;
maxPQ.push(x);       // Insert — O(log n)
maxPQ.top();          // Get max — O(1)
maxPQ.pop();          // Remove max — O(log n)
maxPQ.size();
maxPQ.empty();

// Min-heap
priority_queue<int, vector<int>, greater<int>> minPQ;

// Custom comparator (for objects)
auto cmp = [](pair<int,int>& a, pair<int,int>& b) {
    return a.first > b.first;  // Min-heap by first element
};
priority_queue<pair<int,int>, vector<pair<int,int>>, decltype(cmp)> pq(cmp);

// Build heap from array — O(n)
vector<int> arr = {5, 3, 8, 1};
priority_queue<int> pq2(arr.begin(), arr.end());`}
        />
      </Section>

      {/* Coding Challenges */}
      <Section icon={Code2} title="Coding Challenges">
        <p className="text-foreground/80 leading-relaxed mb-4">
          Practice queue and heap problems.
        </p>

        <CodingChallenge
          title="Challenge 1: Implement a Queue Using Two Stacks"
          description="Implement a queue (FIFO) using only two stacks. Support push (enqueue), pop (dequeue), and peek (front)."
          starterCode={`class MyQueue {
    stack<int> pushStack;
    stack<int> popStack;
    
public:
    void push(int x) {
        // Always push to pushStack
    }
    
    int pop() {
        // If popStack empty, move all from pushStack
        // Then pop from popStack
    }
    
    int peek() {
        // Same logic as pop, but don't remove
    }
    
    bool empty() {
        
    }
};`}
          solution={`class MyQueue {
    stack<int> pushStack;
    stack<int> popStack;
    
    void transfer() {
        // Move all elements from pushStack to popStack
        // This reverses the order → FIFO!
        while (!pushStack.empty()) {
            popStack.push(pushStack.top());
            pushStack.pop();
        }
    }
    
public:
    void push(int x) {
        pushStack.push(x);
    }
    
    int pop() {
        if (popStack.empty()) transfer();
        int val = popStack.top();
        popStack.pop();
        return val;
    }
    
    int peek() {
        if (popStack.empty()) transfer();
        return popStack.top();
    }
    
    bool empty() {
        return pushStack.empty() && popStack.empty();
    }
};
// Amortized O(1) for all operations!
// Each element is moved at most once between stacks`}
          hints={[
            "Always push to pushStack.",
            "When popStack is empty and you need to pop/peek, transfer ALL elements from pushStack to popStack.",
            "Transferring reverses the order, giving you FIFO behavior.",
          ]}
          testDescription="Use two stacks: one for pushing, one for popping. Transfer between them when needed."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("pushstack") &&
              lower.includes("popstack") &&
              lower.includes("pushstack.top()") &&
              lower.includes("popstack.push")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 2: K-th Largest Element"
          description="Find the k-th largest element in an unsorted array using a min-heap of size k. Do NOT sort the array."
          starterCode={`int findKthLargest(vector<int>& nums, int k) {
    // Use a min-heap of size k
    // After processing all elements, top = k-th largest

}`}
          solution={`int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> minHeap;
    
    for (int num : nums) {
        minHeap.push(num);
        if (minHeap.size() > k) {
            minHeap.pop();  // Remove smallest
        }
    }
    
    return minHeap.top();  // k-th largest
}
// Time: O(n log k)
// Space: O(k)`}
          hints={[
            "Use a min-heap: priority_queue<int, vector<int>, greater<int>>.",
            "Push each element. If heap size exceeds k, pop the smallest.",
            "After processing all elements, the top of the min-heap is the k-th largest.",
          ]}
          testDescription="Maintain a min-heap of exactly k elements. The top is your answer."
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
          title="Challenge 3: BFS Level Order Traversal"
          description="Given a binary tree, return its level-order traversal as a 2D vector (each inner vector is one level). Use a queue."
          starterCode={`vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> result;
    // Use a queue for BFS
    // Process one level at a time using q.size()

    return result;
}`}
          solution={`vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> result;
    if (!root) return result;
    
    queue<TreeNode*> q;
    q.push(root);
    
    while (!q.empty()) {
        int levelSize = q.size();
        vector<int> level;
        
        for (int i = 0; i < levelSize; i++) {
            TreeNode* node = q.front();
            q.pop();
            level.push_back(node->val);
            
            if (node->left)  q.push(node->left);
            if (node->right) q.push(node->right);
        }
        
        result.push_back(level);
    }
    
    return result;
}
// Time: O(n), Space: O(n)`}
          hints={[
            "Push root to queue. While queue is not empty, process one level at a time.",
            "Use q.size() at the start of each iteration to know how many nodes are at the current level.",
            "For each node, push its left and right children (if they exist) to the queue.",
          ]}
          testDescription="Use BFS with the levelSize trick to separate nodes by level."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("queue") &&
              lower.includes("q.push") &&
              lower.includes("q.front()") &&
              lower.includes("q.pop()") &&
              (lower.includes("q.size()") || lower.includes("levelsize"))
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
              <span><strong>Queue = FIFO.</strong> Enqueue at back, dequeue from front. Both O(1). Used for BFS.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Deque = double-ended.</strong> O(1) push/pop at both ends + random access. Powers sliding window max.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Priority queue = heap.</strong> O(log n) push/pop, O(1) top. Default is max-heap in C++.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Min-heap syntax:</strong> <code className="px-1 py-0.5 bg-code-bg rounded text-accent-light text-xs">{"priority_queue<int, vector<int>, greater<int>>"}</code></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>K-th largest → min-heap of size k.</strong> K-th smallest → max-heap of size k. Classic pattern.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>BFS = queue + levelSize trick.</strong> You&apos;ll use this in every graph/tree BFS problem.</span>
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
