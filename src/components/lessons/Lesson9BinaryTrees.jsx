"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  GitBranch,
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
    question: "What is the maximum number of nodes at level k in a binary tree?",
    options: ["k", "2k", "2^k", "2^(k+1)"],
    correctIndex: 2,
    explanation:
      "Level 0 (root) has 1 node = 2⁰. Level 1 has 2 = 2¹. Level k has at most 2^k nodes. A complete binary tree achieves this maximum at every level.",
  },
  {
    id: 2,
    question: "What is the height of a balanced binary tree with n nodes?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctIndex: 1,
    explanation:
      "A balanced binary tree has roughly equal left and right subtrees at every node. This gives a height of O(log n). An unbalanced (skewed) tree can have height O(n) — essentially a linked list.",
  },
  {
    id: 3,
    question: "In which traversal order do you visit: left subtree → root → right subtree?",
    options: ["Preorder", "Inorder", "Postorder", "Level order"],
    correctIndex: 1,
    explanation:
      "Inorder: Left → Root → Right. Preorder: Root → Left → Right. Postorder: Left → Right → Root. For a BST, inorder traversal gives elements in sorted order!",
  },
  {
    id: 4,
    question: "What is the time complexity of DFS traversal (inorder/preorder/postorder) on a tree with n nodes?",
    options: ["O(log n)", "O(n)", "O(n log n)", "O(n²)"],
    correctIndex: 1,
    explanation:
      "Every node is visited exactly once → O(n) time. Space is O(h) where h = height of tree (due to recursion stack). For balanced trees, h = O(log n). For skewed, h = O(n).",
  },
  {
    id: 5,
    question: "What data structure does BFS (level-order traversal) use?",
    options: ["Stack", "Queue", "Hash map", "Priority queue"],
    correctIndex: 1,
    explanation:
      "BFS uses a queue to process nodes level by level. Push root → while queue not empty → pop front → push children. The queue ensures FIFO order = level-by-level processing.",
  },
  {
    id: 6,
    question: "What is a 'complete' binary tree?",
    options: [
      "Every node has exactly 2 children",
      "All levels are full except possibly the last, which is filled left to right",
      "The tree has the maximum possible number of nodes",
      "All leaves are at the same level",
    ],
    correctIndex: 1,
    explanation:
      "Complete: all levels full except the last, which fills left to right. Full: every node has 0 or 2 children. Perfect: all levels completely full. Heaps are complete binary trees.",
  },
  {
    id: 7,
    question: "How do you find the height/depth of a binary tree?",
    options: [
      "Count the number of nodes",
      "Use BFS and count levels",
      "Recursively: 1 + max(height(left), height(right))",
      "Both B and C work",
    ],
    correctIndex: 3,
    explanation:
      "Recursive DFS: height = 1 + max(left height, right height), base case: null → 0. BFS: count the number of levels. Both are O(n) time. The recursive approach is more common in interviews.",
  },
  {
    id: 8,
    question: "What does 'inverting a binary tree' mean?",
    options: [
      "Sorting the tree values",
      "Swapping left and right children at every node",
      "Reversing the inorder traversal",
      "Deleting all leaf nodes",
    ],
    correctIndex: 1,
    explanation:
      "Inverting = mirroring. At every node, swap its left and right children, then recursively invert the subtrees. This is the famous problem that sparked the 'Homebrew creator can't invert a binary tree' meme.",
  },
  {
    id: 9,
    question: "What is the diameter of a binary tree?",
    options: [
      "The number of nodes in the tree",
      "The height of the tree",
      "The length of the longest path between any two nodes",
      "The width of the widest level",
    ],
    correctIndex: 2,
    explanation:
      "Diameter = longest path between any two nodes (measured in edges). It may or may not pass through the root. At each node, the path through it = left height + right height. Track the global maximum.",
  },
  {
    id: 10,
    question: "How do you check if two binary trees are identical?",
    options: [
      "Compare their sizes",
      "Compare their heights",
      "Recursively check: same value AND left subtrees match AND right subtrees match",
      "Convert both to arrays and compare",
    ],
    correctIndex: 2,
    explanation:
      "Two trees are identical if: both null (base case), OR both non-null with same value AND isSameTree(left1, left2) AND isSameTree(right1, right2). O(n) time.",
  },
  {
    id: 11,
    question: "What is the Lowest Common Ancestor (LCA) of two nodes?",
    options: [
      "The root of the tree",
      "The deepest node that is an ancestor of both given nodes",
      "The parent of both nodes",
      "The node with the smallest value",
    ],
    correctIndex: 1,
    explanation:
      "LCA is the deepest (lowest) node that has both target nodes as descendants. If one target is in the left subtree and the other is in the right, the current node is the LCA.",
  },
  {
    id: 12,
    question: "What is the space complexity of recursive DFS on a skewed tree with n nodes?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctIndex: 2,
    explanation:
      "A skewed tree (every node has only one child) has height n. Recursive DFS uses O(height) stack space = O(n). For balanced trees, it's O(log n). Always state the worst case in interviews.",
  },
];

export default function Lesson9BinaryTrees({ onQuizComplete }) {
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
      {/* What is a Binary Tree? */}
      <Section icon={BookOpen} title="What is a Binary Tree?">
        <p className="text-foreground/80 leading-relaxed mb-4">
          A <strong>binary tree</strong> is a hierarchical data structure where each node has at most
          <strong> two children</strong> (left and right). Trees are everywhere in CS: file systems,
          HTML DOM, databases, compilers, and of course — interviews.
        </p>

        <div className="bg-card rounded-xl border border-border p-5 my-4">
          <h4 className="font-semibold mb-3 text-accent-light">Tree Terminology</h4>
          <div className="font-mono text-sm bg-code-bg rounded-lg p-4 overflow-x-auto">
            <p className="text-foreground/90">{"        1        ← root (level 0, depth 0)"}</p>
            <p className="text-foreground/90">{"       / \\"}</p>
            <p className="text-foreground/90">{"      2   3      ← level 1, depth 1"}</p>
            <p className="text-foreground/90">{"     / \\   \\"}</p>
            <p className="text-foreground/90">{"    4   5   6    ← level 2, depth 2 (leaves)"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-muted">
            <div><strong className="text-foreground">Root:</strong> Top node (1)</div>
            <div><strong className="text-foreground">Leaf:</strong> Node with no children (4, 5, 6)</div>
            <div><strong className="text-foreground">Height:</strong> Longest root-to-leaf path (2)</div>
            <div><strong className="text-foreground">Depth:</strong> Distance from root to a node</div>
            <div><strong className="text-foreground">Parent:</strong> 2 is parent of 4 and 5</div>
            <div><strong className="text-foreground">Sibling:</strong> 4 and 5 are siblings</div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3 my-4">
          <div className="p-4 bg-card rounded-lg border border-border">
            <h4 className="font-semibold text-sm mb-1 text-accent-light">Full Binary Tree</h4>
            <p className="text-xs text-muted">Every node has 0 or 2 children. No node has exactly 1 child.</p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border">
            <h4 className="font-semibold text-sm mb-1 text-success">Complete Binary Tree</h4>
            <p className="text-xs text-muted">All levels full except last, which fills left to right. Heaps use this.</p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border">
            <h4 className="font-semibold text-sm mb-1 text-warning">Perfect Binary Tree</h4>
            <p className="text-xs text-muted">All internal nodes have 2 children AND all leaves at same level. 2^(h+1) - 1 nodes.</p>
          </div>
        </div>

        <CodeBlock
          title="TreeNode Definition in C++"
          code={`struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* l, TreeNode* r) : val(x), left(l), right(r) {}
};

// Build a tree manually:
//       1
//      / \\
//     2   3
//    / \\
//   4   5
TreeNode* root = new TreeNode(1);
root->left = new TreeNode(2);
root->right = new TreeNode(3);
root->left->left = new TreeNode(4);
root->left->right = new TreeNode(5);`}
        />
      </Section>

      {/* Traversals */}
      <Section icon={Zap} title="Tree Traversals — The Foundation">
        <p className="text-foreground/80 leading-relaxed mb-4">
          There are four ways to visit every node in a tree. <strong>Mastering all four is non-negotiable</strong> for
          Google interviews.
        </p>

        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-card">
                <th className="text-left p-3 border-b border-border font-semibold">Traversal</th>
                <th className="text-left p-3 border-b border-border font-semibold">Order</th>
                <th className="text-left p-3 border-b border-border font-semibold">Use Case</th>
                <th className="text-left p-3 border-b border-border font-semibold">Method</th>
              </tr>
            </thead>
            <tbody>
              {[
                { t: "Inorder", order: "Left → Root → Right", use: "BST sorted order", method: "DFS (recursion/stack)" },
                { t: "Preorder", order: "Root → Left → Right", use: "Copy/serialize a tree", method: "DFS (recursion/stack)" },
                { t: "Postorder", order: "Left → Right → Root", use: "Delete tree, evaluate expressions", method: "DFS (recursion/stack)" },
                { t: "Level Order", order: "Level by level, left to right", use: "BFS, shortest path in tree", method: "BFS (queue)" },
              ].map((row) => (
                <tr key={row.t} className="border-b border-border/50 hover:bg-card/50">
                  <td className="p-3 font-semibold text-accent-light">{row.t}</td>
                  <td className="p-3 text-xs">{row.order}</td>
                  <td className="p-3 text-xs text-muted">{row.use}</td>
                  <td className="p-3 text-xs">{row.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CodeBlock
          title="All DFS Traversals — Recursive"
          code={`// INORDER: Left → Root → Right
void inorder(TreeNode* root) {
    if (!root) return;
    inorder(root->left);       // Visit left subtree
    cout << root->val << " ";  // Process root
    inorder(root->right);      // Visit right subtree
}
// For BST: gives sorted order!
// Tree: [1,2,3,4,5] → Inorder: 4 2 5 1 3

// PREORDER: Root → Left → Right
void preorder(TreeNode* root) {
    if (!root) return;
    cout << root->val << " ";  // Process root FIRST
    preorder(root->left);
    preorder(root->right);
}
// Preorder: 1 2 4 5 3

// POSTORDER: Left → Right → Root
void postorder(TreeNode* root) {
    if (!root) return;
    postorder(root->left);
    postorder(root->right);
    cout << root->val << " ";  // Process root LAST
}
// Postorder: 4 5 2 3 1`}
        />

        <CodeBlock
          title="Inorder Traversal — Iterative (Using Stack)"
          code={`// Important: interviewers sometimes ask for iterative traversal
vector<int> inorderIterative(TreeNode* root) {
    vector<int> result;
    stack<TreeNode*> st;
    TreeNode* curr = root;
    
    while (curr || !st.empty()) {
        // Go as far left as possible
        while (curr) {
            st.push(curr);
            curr = curr->left;
        }
        
        // Process the node
        curr = st.top();
        st.pop();
        result.push_back(curr->val);
        
        // Move to right subtree
        curr = curr->right;
    }
    
    return result;
}
// Time: O(n), Space: O(h)`}
        />

        <CodeBlock
          title="Level Order Traversal — BFS with Queue"
          code={`vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> result;
    if (!root) return result;
    
    queue<TreeNode*> q;
    q.push(root);
    
    while (!q.empty()) {
        int size = q.size();  // Nodes at current level
        vector<int> level;
        
        for (int i = 0; i < size; i++) {
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
// Time: O(n), Space: O(n) — queue holds at most one level`}
        />

        <KeyPoint>
          <strong>Memorize the recursive DFS template.</strong> It&apos;s 3 lines: base case (if !root return),
          recurse left, recurse right. The only difference between inorder/preorder/postorder is WHERE you
          process the root.
        </KeyPoint>
      </Section>

      {/* Classic Problems */}
      <Section icon={Brain} title="Classic Binary Tree Interview Problems">
        <h3 className="text-lg font-semibold mt-2 mb-3 text-accent-light">1. Maximum Depth / Height</h3>
        <CodeBlock
          title="Maximum Depth — O(n)"
          code={`int maxDepth(TreeNode* root) {
    if (!root) return 0;  // Base case: empty tree has depth 0
    
    int leftDepth = maxDepth(root->left);
    int rightDepth = maxDepth(root->right);
    
    return 1 + max(leftDepth, rightDepth);
}
// Time: O(n) — visit every node
// Space: O(h) — recursion stack`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">2. Invert Binary Tree</h3>
        <CodeBlock
          title="Invert/Mirror Binary Tree — O(n)"
          code={`TreeNode* invertTree(TreeNode* root) {
    if (!root) return nullptr;
    
    // Swap left and right children
    swap(root->left, root->right);
    
    // Recursively invert subtrees
    invertTree(root->left);
    invertTree(root->right);
    
    return root;
}

//   Before:      After:
//      1            1
//     / \\          / \\
//    2   3   →   3   2
//   / \\            / \\
//  4   5          5   4

// Time: O(n), Space: O(h)`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">3. Check if Symmetric</h3>
        <CodeBlock
          title="Symmetric Tree — O(n)"
          code={`bool isMirror(TreeNode* left, TreeNode* right) {
    if (!left && !right) return true;   // Both null
    if (!left || !right) return false;  // One null
    
    return left->val == right->val &&
           isMirror(left->left, right->right) &&
           isMirror(left->right, right->left);
}

bool isSymmetric(TreeNode* root) {
    if (!root) return true;
    return isMirror(root->left, root->right);
}
// Time: O(n), Space: O(h)`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">4. Diameter of Binary Tree</h3>
        <CodeBlock
          title="Diameter — Longest Path Between Any Two Nodes"
          code={`int diameter = 0;

int height(TreeNode* root) {
    if (!root) return 0;
    
    int leftH = height(root->left);
    int rightH = height(root->right);
    
    // Update diameter: path through this node = left + right
    diameter = max(diameter, leftH + rightH);
    
    return 1 + max(leftH, rightH);
}

int diameterOfBinaryTree(TreeNode* root) {
    diameter = 0;
    height(root);
    return diameter;
}

// Key insight: at each node, the longest path THROUGH it
// = left height + right height
// The diameter is the max of all such paths
// Time: O(n), Space: O(h)`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">5. Lowest Common Ancestor (LCA)</h3>
        <CodeBlock
          title="LCA of Two Nodes — O(n)"
          code={`TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    // Base cases
    if (!root) return nullptr;
    if (root == p || root == q) return root;
    
    // Search in left and right subtrees
    TreeNode* left = lowestCommonAncestor(root->left, p, q);
    TreeNode* right = lowestCommonAncestor(root->right, p, q);
    
    // If both sides found something → current node is LCA
    if (left && right) return root;
    
    // Otherwise, return whichever side found something
    return left ? left : right;
}

// How it works:
// - If p is in left subtree and q is in right → root is LCA
// - If both are in left subtree → LCA is in left subtree
// - If one of them IS the root → root is LCA
// Time: O(n), Space: O(h)`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">6. Path Sum</h3>
        <CodeBlock
          title="Has Path Sum — Root to Leaf"
          code={`// Does any root-to-leaf path sum to targetSum?
bool hasPathSum(TreeNode* root, int targetSum) {
    if (!root) return false;
    
    // Leaf node: check if remaining sum equals leaf value
    if (!root->left && !root->right) {
        return root->val == targetSum;
    }
    
    // Recurse: subtract current value from target
    return hasPathSum(root->left, targetSum - root->val) ||
           hasPathSum(root->right, targetSum - root->val);
}
// Time: O(n), Space: O(h)`}
        />
      </Section>

      {/* Thinking Recursively About Trees */}
      <Section icon={BookOpen} title="How to Think About Tree Problems">
        <div className="bg-card rounded-xl border border-border p-5 my-4">
          <h4 className="font-semibold mb-3 text-accent-light">The Recursive Template for Tree Problems</h4>
          <ol className="space-y-3 text-sm text-foreground/80">
            <li className="flex items-start gap-2">
              <span className="font-bold text-accent-light min-w-[24px]">1.</span>
              <span><strong>Base case:</strong> What happens with null/leaf? (usually return 0, true, nullptr)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-accent-light min-w-[24px]">2.</span>
              <span><strong>Recursive calls:</strong> Get answers from left and right subtrees</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-accent-light min-w-[24px]">3.</span>
              <span><strong>Combine:</strong> Use left/right answers + current node to compute the result</span>
            </li>
          </ol>
        </div>
        <Warning>
          <strong>Most tree problems follow this exact pattern.</strong> Height? max(left, right) + 1.
          Count? left + right + 1. Diameter? Track max(leftH + rightH). Always ask: &quot;What do I
          need from my left and right children?&quot;
        </Warning>
      </Section>

      {/* C++ Syntax Reference */}
      <Section icon={Code2} title="C++ Syntax Reference">
        <CodeBlock
          title="Binary Tree Essentials"
          code={`// === Node Definition ===
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

// === Recursive DFS Template ===
ReturnType solve(TreeNode* root) {
    if (!root) return baseCase;  // null check
    
    auto leftResult = solve(root->left);
    auto rightResult = solve(root->right);
    
    return combine(root->val, leftResult, rightResult);
}

// === BFS Template ===
void bfs(TreeNode* root) {
    if (!root) return;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* node = q.front(); q.pop();
        // process node
        if (node->left)  q.push(node->left);
        if (node->right) q.push(node->right);
    }
}

// === Common Operations ===
// Check if leaf: !node->left && !node->right
// Check if null: !root or root == nullptr
// Swap children: swap(root->left, root->right)

// === Build tree from vector (for testing) ===
// LeetCode-style: [1,2,3,null,5]
//       1
//      / \\
//     2   3
//      \\
//       5

// === Useful includes ===
#include <queue>      // For BFS
#include <stack>      // For iterative DFS
#include <algorithm>  // For max, min
#include <climits>    // For INT_MIN, INT_MAX`}
        />
      </Section>

      {/* Coding Challenges */}
      <Section icon={Code2} title="Coding Challenges">
        <p className="text-foreground/80 leading-relaxed mb-4">
          Practice thinking recursively about trees.
        </p>

        <CodingChallenge
          title="Challenge 1: Maximum Depth of Binary Tree"
          description="Write a recursive function that returns the maximum depth (height) of a binary tree. The depth of an empty tree is 0."
          starterCode={`int maxDepth(TreeNode* root) {
    // Base case: null tree
    // Recursive: 1 + max(left depth, right depth)

}`}
          solution={`int maxDepth(TreeNode* root) {
    if (!root) return 0;
    
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}
// Time: O(n), Space: O(h)
// One-liner! This is the power of recursive thinking.`}
          hints={[
            "Base case: if root is null, return 0.",
            "The depth of a tree = 1 (for the root) + the max depth of its subtrees.",
            "Recursively compute depth of left and right, take the max, add 1.",
          ]}
          testDescription="This can be written as a one-liner: base case + 1 + max of children."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("!root") &&
              lower.includes("return0") &&
              lower.includes("max(") &&
              lower.includes("maxdepth(root->left)")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 2: Invert Binary Tree"
          description="Write a function that inverts (mirrors) a binary tree. Swap left and right children at every node."
          starterCode={`TreeNode* invertTree(TreeNode* root) {
    // Base case: null
    // Swap left and right
    // Recursively invert subtrees

}`}
          solution={`TreeNode* invertTree(TreeNode* root) {
    if (!root) return nullptr;
    
    swap(root->left, root->right);
    
    invertTree(root->left);
    invertTree(root->right);
    
    return root;
}
// Time: O(n), Space: O(h)`}
          hints={[
            "Base case: if root is null, return nullptr.",
            "Swap root->left and root->right using swap().",
            "Then recursively invert both the (new) left and right subtrees.",
          ]}
          testDescription="Swap children at each node, then recurse on both subtrees."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("!root") &&
              lower.includes("swap") &&
              lower.includes("inverttree(root->left)") &&
              lower.includes("inverttree(root->right)")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 3: Check if Two Trees are Identical"
          description="Write a function that checks if two binary trees are structurally identical with the same node values."
          starterCode={`bool isSameTree(TreeNode* p, TreeNode* q) {
    // Base cases: both null? one null?
    // Check values match, then recurse on children

}`}
          solution={`bool isSameTree(TreeNode* p, TreeNode* q) {
    // Both null → same
    if (!p && !q) return true;
    
    // One null, other not → different
    if (!p || !q) return false;
    
    // Values must match, and both subtrees must match
    return p->val == q->val &&
           isSameTree(p->left, q->left) &&
           isSameTree(p->right, q->right);
}
// Time: O(min(n, m)), Space: O(min(h1, h2))`}
          hints={[
            "If both are null, they're the same → return true.",
            "If exactly one is null, they're different → return false.",
            "If both exist: check values match AND left subtrees match AND right subtrees match.",
          ]}
          testDescription="Three checks: both null → true, one null → false, then compare values and recurse."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("!p&&!q") &&
              lower.includes("!p||!q") &&
              lower.includes("p->val==q->val") &&
              lower.includes("issametree(p->left,q->left)")
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
              <span><strong>Binary trees = recursion.</strong> Base case (null) + recurse left + recurse right + combine. This template solves 90% of tree problems.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Know all 4 traversals:</strong> Inorder (L-Root-R), Preorder (Root-L-R), Postorder (L-R-Root), Level Order (BFS with queue).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Time is always O(n)</strong> for tree traversals. Space is O(h) — O(log n) balanced, O(n) skewed.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Must-know problems:</strong> max depth, invert tree, symmetric, diameter, LCA, path sum, same tree.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Ask yourself:</strong> &quot;What do I need from left and right subtrees?&quot; This is the key to solving any tree problem.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>BFS = queue, DFS = recursion/stack.</strong> BFS for level-order, DFS for everything else.</span>
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
