"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Scale,
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
    question: "Why do we need balanced BSTs?",
    options: [
      "Regular BSTs are always slow",
      "Inserting sorted data into a regular BST creates a skewed tree with O(n) operations",
      "Balanced BSTs use less memory",
      "Regular BSTs can't store strings",
    ],
    correctIndex: 1,
    explanation:
      "If you insert 1, 2, 3, 4, 5 into a regular BST, you get a linked list (right-skewed). All operations become O(n). Self-balancing BSTs guarantee O(log n) by rebalancing after every insert/delete.",
  },
  {
    id: 2,
    question: "What is the balance factor in an AVL tree?",
    options: [
      "The number of nodes in the tree",
      "height(left subtree) - height(right subtree) for each node",
      "The depth of the deepest leaf",
      "The number of rotations performed",
    ],
    correctIndex: 1,
    explanation:
      "Balance factor = height(left) - height(right). An AVL tree requires that every node has a balance factor of -1, 0, or 1. If any node violates this, rotations are performed to rebalance.",
  },
  {
    id: 3,
    question: "What are the four types of rotations in AVL trees?",
    options: [
      "Push, pop, shift, unshift",
      "Left-Left, Left-Right, Right-Right, Right-Left",
      "Clockwise and counter-clockwise only",
      "Single and double only",
    ],
    correctIndex: 1,
    explanation:
      "LL (single right rotation), RR (single left rotation), LR (left then right rotation), RL (right then left rotation). LL/RR need one rotation. LR/RL need two rotations (double rotation).",
  },
  {
    id: 4,
    question: "What is a right rotation on a node?",
    options: [
      "Move the node to the right",
      "The left child becomes the new root, the old root becomes the right child",
      "Swap left and right children",
      "Delete the right subtree",
    ],
    correctIndex: 1,
    explanation:
      "Right rotation on node X: X's left child (Y) becomes the new root. X becomes Y's right child. Y's old right child becomes X's left child. This fixes left-heavy imbalance.",
  },
  {
    id: 5,
    question: "What color properties must a Red-Black tree satisfy?",
    options: [
      "All nodes are red",
      "Root is black, red nodes can't have red children, all paths have equal black nodes",
      "Leaves alternate between red and black",
      "Red nodes must be on the left",
    ],
    correctIndex: 1,
    explanation:
      "Red-Black tree rules: (1) Every node is red or black. (2) Root is black. (3) No two consecutive red nodes (red node's children must be black). (4) Every path from root to null has the same number of black nodes.",
  },
  {
    id: 6,
    question: "What is the maximum height of an AVL tree with n nodes?",
    options: ["O(n)", "O(log n) — approximately 1.44 × log₂(n)", "O(√n)", "O(n log n)"],
    correctIndex: 1,
    explanation:
      "An AVL tree's height is at most ~1.44 × log₂(n). This is slightly worse than a perfect binary tree (log₂(n)) but still O(log n). It guarantees O(log n) for all operations.",
  },
  {
    id: 7,
    question: "What is the maximum height of a Red-Black tree with n nodes?",
    options: ["O(n)", "O(log n) — at most 2 × log₂(n+1)", "O(√n)", "O(n²)"],
    correctIndex: 1,
    explanation:
      "A Red-Black tree's height is at most 2 × log₂(n+1). It's less strictly balanced than AVL, so it can be slightly taller, but still O(log n). The looser constraint means fewer rotations on insert/delete.",
  },
  {
    id: 8,
    question: "Which is better for frequent insertions/deletions: AVL or Red-Black?",
    options: [
      "AVL — it's more balanced",
      "Red-Black — it requires fewer rotations on average",
      "They are identical in performance",
      "Neither — use a hash table",
    ],
    correctIndex: 1,
    explanation:
      "Red-Black trees need at most 2 rotations per insert and 3 per delete. AVL trees may need O(log n) rotations per operation. For insert/delete-heavy workloads, Red-Black trees are preferred. That's why std::map uses Red-Black.",
  },
  {
    id: 9,
    question: "Which is better for frequent lookups: AVL or Red-Black?",
    options: [
      "AVL — it's more strictly balanced, so lookups are faster",
      "Red-Black — it has fewer nodes",
      "They are identical",
      "Neither — use an array",
    ],
    correctIndex: 0,
    explanation:
      "AVL trees are more strictly balanced (height ≤ 1.44 log n vs 2 log n for Red-Black). This means slightly shorter paths → slightly faster lookups. For read-heavy workloads, AVL is better.",
  },
  {
    id: 10,
    question: "What does std::map use internally in C++?",
    options: ["AVL tree", "Red-Black tree", "Hash table", "B-tree"],
    correctIndex: 1,
    explanation:
      "std::map and std::set use a Red-Black tree. This gives O(log n) guaranteed for insert, find, and erase, with keys maintained in sorted order. The Red-Black tree is chosen over AVL because of fewer rotations on modification.",
  },
  {
    id: 11,
    question: "When should you use a balanced BST (set/map) over a hash table (unordered_map)?",
    options: [
      "Always — balanced BSTs are faster",
      "When you need sorted order, range queries (lower_bound), or guaranteed O(log n) worst case",
      "When you have fewer than 100 elements",
      "When keys are integers only",
    ],
    correctIndex: 1,
    explanation:
      "Balanced BSTs give: sorted iteration, range queries (lower_bound/upper_bound), guaranteed O(log n) worst case. Hash tables give O(1) average but O(n) worst case and no ordering. Choose based on your needs.",
  },
  {
    id: 12,
    question: "What is a rotation's time complexity?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
    correctIndex: 2,
    explanation:
      "A rotation is O(1) — it only involves reassigning a constant number of pointers (3-4 pointer changes). The rebalancing after insert/delete may require multiple rotations, but each individual rotation is O(1).",
  },
];

export default function Lesson11BalancedBST({ onQuizComplete }) {
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
      {/* Why Balanced BSTs? */}
      <Section icon={BookOpen} title="Why Do We Need Balanced BSTs?">
        <p className="text-foreground/80 leading-relaxed mb-4">
          A regular BST can degrade to a <strong>linked list</strong> if elements are inserted in sorted order.
          Self-balancing BSTs guarantee O(log n) height by <strong>automatically rebalancing</strong> after
          every insert and delete.
        </p>

        <div className="grid gap-4 md:grid-cols-2 my-4">
          <div className="p-5 bg-card rounded-xl border border-danger/30">
            <h4 className="font-semibold text-danger mb-2">Unbalanced BST (Worst Case)</h4>
            <div className="font-mono text-xs bg-code-bg rounded p-3">
              <p>{"Insert: 1, 2, 3, 4, 5"}</p>
              <p className="mt-1">{"1"}</p>
              <p>{" \\"}</p>
              <p>{"  2"}</p>
              <p>{"   \\"}</p>
              <p>{"    3"}</p>
              <p>{"     \\"}</p>
              <p>{"      4   ← linked list!"}</p>
              <p>{"       \\"}</p>
              <p>{"        5"}</p>
              <p className="text-danger mt-1">{"Height: O(n) → All ops O(n)"}</p>
            </div>
          </div>
          <div className="p-5 bg-card rounded-xl border border-success/30">
            <h4 className="font-semibold text-success mb-2">Balanced BST (Guaranteed)</h4>
            <div className="font-mono text-xs bg-code-bg rounded p-3">
              <p>{"Insert: 1, 2, 3, 4, 5"}</p>
              <p className="mt-1">{"      2"}</p>
              <p>{"     / \\"}</p>
              <p>{"    1   4"}</p>
              <p>{"       / \\"}</p>
              <p>{"      3   5"}</p>
              <p>&nbsp;</p>
              <p>&nbsp;</p>
              <p>&nbsp;</p>
              <p className="text-success mt-1">{"Height: O(log n) → All ops O(log n)"}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* AVL Trees */}
      <Section icon={Scale} title="AVL Trees — Strictly Balanced">
        <p className="text-foreground/80 leading-relaxed mb-4">
          An <strong>AVL tree</strong> (Adelson-Velsky and Landis, 1962) is a BST where for every node,
          the heights of left and right subtrees differ by <strong>at most 1</strong>. This is the
          strictest balance condition.
        </p>

        <div className="bg-card rounded-xl border border-border p-5 my-4">
          <h4 className="font-semibold mb-3 text-accent-light">Balance Factor</h4>
          <div className="font-mono text-sm bg-code-bg rounded-lg p-4">
            <p className="text-muted">{"// balance_factor(node) = height(left) - height(right)"}</p>
            <p className="text-muted">{"// Must be: -1, 0, or +1"}</p>
            <p className="text-foreground/90 mt-2">{"       10 (bf=0)"}</p>
            <p className="text-foreground/90">{"      /  \\"}</p>
            <p className="text-foreground/90">{"   5(+1) 15(0)"}</p>
            <p className="text-foreground/90">{"  /"}</p>
            <p className="text-foreground/90">{"3(0)     ← Valid AVL! All bf ∈ {-1,0,+1}"}</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-3 text-accent-light">Rotations — The Rebalancing Tool</h3>
        <p className="text-foreground/80 leading-relaxed mb-3">
          When an insertion or deletion causes a balance factor to become +2 or -2, we fix it with <strong>rotations</strong>.
          There are 4 cases:
        </p>

        <CodeBlock
          title="Right Rotation (fixes Left-Left imbalance)"
          code={`//  Before (bf=+2):     After right rotation:
//       30                  20
//      /                   /  \\
//    20          →       10    30
//   /
// 10

TreeNode* rightRotate(TreeNode* y) {
    TreeNode* x = y->left;
    TreeNode* T = x->right;
    
    // Rotate
    x->right = y;
    y->left = T;
    
    // Update heights
    y->height = 1 + max(getHeight(y->left), getHeight(y->right));
    x->height = 1 + max(getHeight(x->left), getHeight(x->right));
    
    return x;  // New root of subtree
}`}
        />

        <CodeBlock
          title="Left Rotation (fixes Right-Right imbalance)"
          code={`//  Before (bf=-2):     After left rotation:
//  10                      20
//    \\                    /  \\
//    20          →      10    30
//      \\
//      30

TreeNode* leftRotate(TreeNode* x) {
    TreeNode* y = x->right;
    TreeNode* T = y->left;
    
    // Rotate
    y->left = x;
    x->right = T;
    
    // Update heights
    x->height = 1 + max(getHeight(x->left), getHeight(x->right));
    y->height = 1 + max(getHeight(y->left), getHeight(y->right));
    
    return y;  // New root of subtree
}`}
        />

        <CodeBlock
          title="All Four Rotation Cases"
          code={`// In the AVL insert function, after normal BST insert:
int bf = getBalance(node);  // height(left) - height(right)

// Case 1: Left-Left (bf > 1, key < node->left->val)
if (bf > 1 && key < node->left->val)
    return rightRotate(node);

// Case 2: Right-Right (bf < -1, key > node->right->val)
if (bf < -1 && key > node->right->val)
    return leftRotate(node);

// Case 3: Left-Right (bf > 1, key > node->left->val)
if (bf > 1 && key > node->left->val) {
    node->left = leftRotate(node->left);   // First left rotate child
    return rightRotate(node);               // Then right rotate node
}

// Case 4: Right-Left (bf < -1, key < node->right->val)
if (bf < -1 && key < node->right->val) {
    node->right = rightRotate(node->right); // First right rotate child
    return leftRotate(node);                // Then left rotate node
}`}
        />

        <CodeBlock
          title="Complete AVL Insert"
          code={`struct AVLNode {
    int val, height;
    AVLNode* left;
    AVLNode* right;
    AVLNode(int v) : val(v), height(1), left(nullptr), right(nullptr) {}
};

int getHeight(AVLNode* n) { return n ? n->height : 0; }
int getBalance(AVLNode* n) { return n ? getHeight(n->left) - getHeight(n->right) : 0; }

AVLNode* insert(AVLNode* node, int key) {
    // 1. Normal BST insert
    if (!node) return new AVLNode(key);
    if (key < node->val) node->left = insert(node->left, key);
    else if (key > node->val) node->right = insert(node->right, key);
    else return node;  // No duplicates
    
    // 2. Update height
    node->height = 1 + max(getHeight(node->left), getHeight(node->right));
    
    // 3. Check balance and rotate if needed
    int bf = getBalance(node);
    
    if (bf > 1 && key < node->left->val) return rightRotate(node);        // LL
    if (bf < -1 && key > node->right->val) return leftRotate(node);       // RR
    if (bf > 1 && key > node->left->val) {                                // LR
        node->left = leftRotate(node->left);
        return rightRotate(node);
    }
    if (bf < -1 && key < node->right->val) {                              // RL
        node->right = rightRotate(node->right);
        return leftRotate(node);
    }
    
    return node;  // Already balanced
}
// Time: O(log n) — height is guaranteed O(log n)
// At most 2 rotations per insert`}
        />

        <KeyPoint>
          <strong>AVL trees guarantee height ≤ 1.44 × log₂(n).</strong> This makes them the most
          strictly balanced BST. Lookups are slightly faster than Red-Black trees, but
          insert/delete require more rotations.
        </KeyPoint>
      </Section>

      {/* Red-Black Trees */}
      <Section icon={Zap} title="Red-Black Trees — Practical Balance">
        <p className="text-foreground/80 leading-relaxed mb-4">
          A <strong>Red-Black tree</strong> is a BST where each node is colored red or black, with rules
          that ensure the tree stays approximately balanced. It&apos;s less strict than AVL but requires
          fewer rotations — making it the <strong>industry standard</strong>.
        </p>

        <div className="bg-card rounded-xl border border-border p-5 my-4">
          <h4 className="font-semibold mb-3 text-accent-light">Red-Black Tree Rules</h4>
          <ol className="space-y-2 text-sm text-foreground/80">
            <li className="flex items-start gap-2">
              <span className="font-bold text-accent-light min-w-[24px]">1.</span>
              <span>Every node is either <strong className="text-danger">RED</strong> or <strong>BLACK</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-accent-light min-w-[24px]">2.</span>
              <span>The <strong>root is always BLACK</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-accent-light min-w-[24px]">3.</span>
              <span>All null leaves (NIL) are considered BLACK.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-accent-light min-w-[24px]">4.</span>
              <span><strong className="text-danger">No two consecutive red nodes</strong> — a red node&apos;s children must be black.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-accent-light min-w-[24px]">5.</span>
              <span>Every path from root to null has the <strong>same number of black nodes</strong> (black-height).</span>
            </li>
          </ol>
        </div>

        <CodeBlock
          title="Red-Black Tree Visualization"
          code={`//         13(B)
//        /     \\
//      8(R)    17(R)
//     / \\     / \\
//   1(B) 11(B) 15(B) 25(B)
//    \\              /
//    6(R)         22(R)

// Black-height from root to any null = 3 ✓
// No two consecutive reds ✓
// Root is black ✓

// Properties this guarantees:
// Height ≤ 2 × log₂(n + 1)
// All operations: O(log n)`}
        />

        <CodeBlock
          title="Red-Black Insert — Conceptual"
          code={`// Red-Black insertion steps:
// 1. Insert as a RED node (like normal BST)
// 2. Fix violations:

// Case 1: Uncle is RED
//   → Recolor parent and uncle to BLACK, grandparent to RED
//   → Move up and fix grandparent if needed

// Case 2: Uncle is BLACK, node is "inner child" (zig-zag)
//   → Rotate node's parent to make it Case 3

// Case 3: Uncle is BLACK, node is "outer child" (straight line)
//   → Rotate grandparent, swap colors of parent and grandparent

// At most 2 rotations per insert!
// At most 3 rotations per delete!

// You DON'T need to implement RB-trees in interviews.
// Just know:
// - How they work conceptually
// - Why std::map uses them
// - Their O(log n) guarantees
// - AVL vs Red-Black trade-offs`}
        />

        <Warning>
          <strong>You will NOT be asked to implement a Red-Black tree in a Google interview.</strong> But
          you should know: what it is, why std::map uses it, the 5 properties, and how it compares
          to AVL trees. Focus on USING std::map/std::set effectively.
        </Warning>
      </Section>

      {/* AVL vs Red-Black */}
      <Section icon={Brain} title="AVL vs Red-Black — Comparison">
        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-card">
                <th className="text-left p-3 border-b border-border font-semibold">Aspect</th>
                <th className="text-left p-3 border-b border-border font-semibold">AVL Tree</th>
                <th className="text-left p-3 border-b border-border font-semibold">Red-Black Tree</th>
              </tr>
            </thead>
            <tbody>
              {[
                { aspect: "Balance strictness", avl: "Strict (|bf| ≤ 1)", rb: "Relaxed (black-height rule)" },
                { aspect: "Max height", avl: "~1.44 log n", rb: "~2 log n" },
                { aspect: "Lookup speed", avl: "Slightly faster (shorter)", rb: "Slightly slower" },
                { aspect: "Insert rotations", avl: "Up to O(log n)", rb: "At most 2" },
                { aspect: "Delete rotations", avl: "Up to O(log n)", rb: "At most 3" },
                { aspect: "Insert/delete speed", avl: "Slower (more rotations)", rb: "Faster (fewer rotations)" },
                { aspect: "Memory per node", avl: "Height field (int)", rb: "Color bit (1 bit)" },
                { aspect: "Best for", avl: "Read-heavy workloads", rb: "Write-heavy / general purpose" },
                { aspect: "Used by", avl: "Databases, some game engines", rb: "C++ std::map/set, Java TreeMap, Linux kernel" },
              ].map((row) => (
                <tr key={row.aspect} className="border-b border-border/50 hover:bg-card/50">
                  <td className="p-3 font-semibold">{row.aspect}</td>
                  <td className="p-3 text-xs">{row.avl}</td>
                  <td className="p-3 text-xs">{row.rb}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Using std::map and std::set */}
      <Section icon={Code2} title="Using Balanced BSTs in Practice — std::map & std::set">
        <p className="text-foreground/80 leading-relaxed mb-4">
          In interviews, you won&apos;t implement AVL/RB trees — you&apos;ll <strong>use</strong> them
          via <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">std::map</code> and
          <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">std::set</code>.
          Knowing their power is what matters.
        </p>

        <CodeBlock
          title="Problems That Need Balanced BSTs (Not Hash Tables)"
          code={`#include <set>
#include <map>
using namespace std;

// === 1. Finding the next larger/smaller element ===
set<int> s = {1, 5, 10, 15, 20};
auto it = s.lower_bound(7);   // First element >= 7 → points to 10
auto it2 = s.upper_bound(10); // First element > 10 → points to 15

// Predecessor (next smaller):
if (it != s.begin()) {
    --it;  // Now points to 5
}

// === 2. Sliding window with sorted access ===
multiset<int> window;
window.insert(5);
window.insert(3);
window.insert(8);
// Min: *window.begin() = 3
// Max: *window.rbegin() = 8
// Remove specific value: window.erase(window.find(5));

// === 3. Count elements in a range [lo, hi] ===
auto lo = s.lower_bound(5);
auto hi = s.upper_bound(15);
int count = distance(lo, hi);  // 3 elements: 5, 10, 15

// === 4. Ordered statistics ===
// Find k-th smallest: advance(s.begin(), k-1)
// Note: this is O(k), not O(log n)

// === 5. Floor and Ceiling ===
// Ceiling of x (smallest ≥ x): *s.lower_bound(x)
// Floor of x (largest ≤ x):
auto it3 = s.upper_bound(x);
if (it3 != s.begin()) --it3; // *it3 is floor`}
        />

        <CodeBlock
          title="Containment of Intervals — Using std::map"
          code={`// Classic problem: merge overlapping intervals, or
// check if a point is covered by any interval

// My Calendar problem: book intervals, no double-booking
class MyCalendar {
    map<int, int> bookings;  // start → end (sorted by start)
    
public:
    bool book(int start, int end) {
        auto it = bookings.lower_bound(start);
        
        // Check overlap with next booking
        if (it != bookings.end() && it->first < end)
            return false;
        
        // Check overlap with previous booking
        if (it != bookings.begin()) {
            --it;
            if (it->second > start) return false;
        }
        
        bookings[start] = end;
        return true;
    }
};
// O(log n) per booking — only possible with sorted map!`}
        />

        <CodeBlock
          title="Sliding Window Median — Using Two Multisets"
          code={`// Find the median of each sliding window of size k
// Two balanced BSTs: lower half and upper half

vector<double> medianSlidingWindow(vector<int>& nums, int k) {
    multiset<int> lo, hi;  // lo = lower half, hi = upper half
    vector<double> result;
    
    for (int i = 0; i < nums.size(); i++) {
        // Insert
        lo.insert(nums[i]);
        hi.insert(*lo.rbegin());  // Move max of lo to hi
        lo.erase(prev(lo.end()));
        
        if (hi.size() > lo.size()) {  // Balance
            lo.insert(*hi.begin());
            hi.erase(hi.begin());
        }
        
        // Remove element going out of window
        if (i >= k) {
            int out = nums[i - k];
            if (lo.count(out)) lo.erase(lo.find(out));
            else hi.erase(hi.find(out));
            // Rebalance...
        }
        
        // Get median
        if (i >= k - 1) {
            if (k % 2 == 1) result.push_back(*lo.rbegin());
            else result.push_back((*lo.rbegin() + *hi.begin()) / 2.0);
        }
    }
    return result;
}
// O(n log k) — balanced BST operations on each window slide`}
        />

        <KeyPoint>
          <strong>Use std::set/map when you need:</strong> sorted order, lower_bound/upper_bound (floor/ceiling),
          range counting, sliding window with sorted access, or guaranteed O(log n) worst case.
          These are the problems where hash tables fail.
        </KeyPoint>
      </Section>

      {/* C++ Syntax Reference */}
      <Section icon={Code2} title="C++ Syntax Reference">
        <CodeBlock
          title="Balanced BST via std::set and std::map"
          code={`#include <set>
#include <map>
using namespace std;

// ========== std::set (sorted unique elements) ==========
set<int> s;
s.insert(x);                    // O(log n)
s.erase(x);                     // O(log n)
s.count(x);                     // 0 or 1, O(log n)
s.find(x);                      // Iterator or s.end()
s.lower_bound(x);               // First >= x, O(log n)
s.upper_bound(x);               // First > x, O(log n)
*s.begin();                      // Min element, O(1)
*s.rbegin();                     // Max element, O(1)
s.size();
s.empty();

// ========== std::multiset (sorted, allows duplicates) ==========
multiset<int> ms;
ms.insert(x);                   // O(log n), allows dupes
ms.count(x);                    // Can be > 1
ms.erase(x);                    // Removes ALL of x!
ms.erase(ms.find(x));           // Removes ONE x

// ========== std::map (sorted key-value) ==========
map<int, string> m;
m[key] = value;                  // Insert/update
m.at(key);                       // Access (throws if missing)
m.erase(key);                    // Remove
m.lower_bound(key);              // First key >= key
m.upper_bound(key);              // First key > key
m.begin()->first;                // Smallest key
m.rbegin()->first;               // Largest key

// ========== Common Patterns ==========
// Floor (largest ≤ x):
auto it = s.upper_bound(x);
if (it != s.begin()) { --it; /* *it is floor */ }

// Ceiling (smallest ≥ x):
auto it2 = s.lower_bound(x);
if (it2 != s.end()) { /* *it2 is ceiling */ }

// Range [lo, hi]:
auto lo_it = s.lower_bound(lo);
auto hi_it = s.upper_bound(hi);
for (auto it = lo_it; it != hi_it; ++it) { /* elements in range */ }

// Predecessor/Successor:
auto it3 = s.find(x);
if (it3 != s.begin()) { --it3; /* predecessor */ }
++it3; // back to x
++it3; if (it3 != s.end()) { /* successor */ }`}
        />
      </Section>

      {/* Coding Challenges */}
      <Section icon={Code2} title="Coding Challenges">
        <CodingChallenge
          title="Challenge 1: Right Rotation"
          description="Implement a right rotation on a BST node. The left child becomes the new root, the old root becomes its right child."
          starterCode={`struct TreeNode {
    int val, height;
    TreeNode* left;
    TreeNode* right;
};

TreeNode* rightRotate(TreeNode* y) {
    // y's left child (x) becomes new root
    // x's right subtree becomes y's left subtree
    // Update heights

}`}
          solution={`TreeNode* rightRotate(TreeNode* y) {
    TreeNode* x = y->left;
    TreeNode* T = x->right;
    
    // Rotate
    x->right = y;
    y->left = T;
    
    // Update heights
    y->height = 1 + max(getHeight(y->left), getHeight(y->right));
    x->height = 1 + max(getHeight(x->left), getHeight(x->right));
    
    return x;  // New root
}
// O(1) — just pointer reassignment`}
          hints={[
            "Save y->left as x, and x->right as T.",
            "Set x->right = y (old root becomes right child of new root).",
            "Set y->left = T (x's old right subtree becomes y's new left subtree).",
          ]}
          testDescription="Reassign 3 pointers and update heights. Return x as the new root."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("x=y->left") &&
              lower.includes("x->right=y") &&
              lower.includes("y->left=t") &&
              lower.includes("returnx")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 2: Floor and Ceiling in a Set"
          description="Given a sorted set and a value x, find the floor (largest element ≤ x) and ceiling (smallest element ≥ x) using std::set."
          starterCode={`pair<int,int> floorCeiling(set<int>& s, int x) {
    int floor = -1, ceiling = -1;
    // Use lower_bound and upper_bound
    // Handle edge cases (x smaller than all, x larger than all)
    
    return {floor, ceiling};
}`}
          solution={`pair<int,int> floorCeiling(set<int>& s, int x) {
    int floor = -1, ceiling = -1;
    
    // Ceiling: smallest >= x
    auto it = s.lower_bound(x);
    if (it != s.end()) ceiling = *it;
    
    // Floor: largest <= x
    auto it2 = s.upper_bound(x);
    if (it2 != s.begin()) {
        --it2;
        floor = *it2;
    }
    
    return {floor, ceiling};
}
// O(log n) for both — balanced BST!`}
          hints={[
            "Ceiling: use lower_bound(x) — gives first element >= x.",
            "Floor: use upper_bound(x) which gives first element > x, then go back one step.",
            "Check for begin()/end() to handle cases where floor or ceiling doesn't exist.",
          ]}
          testDescription="lower_bound for ceiling, upper_bound minus one for floor."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("lower_bound") &&
              lower.includes("upper_bound") &&
              lower.includes("s.end()") &&
              lower.includes("s.begin()")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 3: Count Elements in Range"
          description="Given a sorted set of integers and a range [lo, hi], count how many elements fall within the range (inclusive). Use iterators for O(log n + k) where k is the count."
          starterCode={`int countInRange(set<int>& s, int lo, int hi) {
    // Use lower_bound and upper_bound to find range
    // Count elements between the two iterators

}`}
          solution={`int countInRange(set<int>& s, int lo, int hi) {
    auto start = s.lower_bound(lo);   // First >= lo
    auto end = s.upper_bound(hi);     // First > hi
    
    return distance(start, end);
}
// O(log n + k) where k = number of elements in range
// distance() on set iterators is O(k)`}
          hints={[
            "lower_bound(lo) gives the first element >= lo.",
            "upper_bound(hi) gives the first element > hi.",
            "distance(start, end) counts elements between the two iterators.",
          ]}
          testDescription="Two BST lookups to find the range boundaries, then count with distance()."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("lower_bound(lo)") &&
              lower.includes("upper_bound(hi)") &&
              lower.includes("distance")
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
              <span><strong>Self-balancing BSTs guarantee O(log n)</strong> for all operations, even with sorted input.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>AVL trees: stricter balance</strong> (height ≤ 1.44 log n), better for lookups, more rotations on writes.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Red-Black trees: relaxed balance</strong> (height ≤ 2 log n), fewer rotations, used by std::map/set.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Rotations are O(1)</strong> — just pointer reassignment. Know right rotation and left rotation.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>In interviews: USE std::set/map</strong>, don&apos;t implement RB trees. Know lower_bound, upper_bound, floor/ceiling patterns.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Use balanced BST over hash table when you need:</strong> sorted order, range queries, floor/ceiling, or guaranteed worst-case O(log n).</span>
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
