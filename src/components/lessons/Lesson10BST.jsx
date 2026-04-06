"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
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
    question: "What property defines a Binary Search Tree (BST)?",
    options: [
      "All left children are greater than the root",
      "For every node: all values in left subtree < node < all values in right subtree",
      "The tree is always balanced",
      "Every node has exactly two children",
    ],
    correctIndex: 1,
    explanation:
      "The BST property: for every node, ALL values in its left subtree are less than the node's value, and ALL values in its right subtree are greater. This isn't just about direct children — it applies to the entire subtree.",
  },
  {
    id: 2,
    question: "What is the time complexity of search in a balanced BST?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctIndex: 1,
    explanation:
      "In a balanced BST, each comparison eliminates half the remaining nodes (like binary search on an array). Height = O(log n) → search = O(log n). In a skewed BST, it degrades to O(n).",
  },
  {
    id: 3,
    question: "What traversal of a BST gives elements in sorted (ascending) order?",
    options: ["Preorder", "Inorder", "Postorder", "Level order"],
    correctIndex: 1,
    explanation:
      "Inorder traversal (Left → Root → Right) on a BST visits nodes in ascending sorted order. This is because all left subtree values < root < all right subtree values, applied recursively.",
  },
  {
    id: 4,
    question: "What is the inorder successor of a node in a BST?",
    options: [
      "The parent node",
      "The right child",
      "The node with the next larger value (leftmost node in right subtree)",
      "The left child",
    ],
    correctIndex: 2,
    explanation:
      "The inorder successor is the next node in inorder traversal — the smallest node that is larger than the current node. If the node has a right subtree, it's the leftmost node in that subtree.",
  },
  {
    id: 5,
    question: "When deleting a node with TWO children from a BST, what do you replace it with?",
    options: [
      "The left child",
      "The right child",
      "The inorder successor (or predecessor) — then delete that node",
      "null",
    ],
    correctIndex: 2,
    explanation:
      "Replace the node with its inorder successor (smallest in right subtree) or inorder predecessor (largest in left subtree). Then delete the successor/predecessor from its original position. This maintains the BST property.",
  },
  {
    id: 6,
    question: "What is the worst-case height of an unbalanced BST with n nodes?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctIndex: 2,
    explanation:
      "If you insert sorted elements (1, 2, 3, 4, 5...) into a BST, each new node becomes the right child → a linked list of height n. All operations become O(n). This is why balanced BSTs (AVL, Red-Black) exist.",
  },
  {
    id: 7,
    question: "How do you validate if a binary tree is a valid BST?",
    options: [
      "Check if root->left < root && root->right > root",
      "Pass min/max bounds recursively — each node must be within (min, max)",
      "Do a level-order traversal",
      "Check if it's balanced",
    ],
    correctIndex: 1,
    explanation:
      "Just checking direct children is NOT enough (a grandchild could violate the BST property). You must pass valid ranges: validate(node, min, max) — the node's value must be in (min, max), then recurse with updated bounds.",
  },
  {
    id: 8,
    question: "What does std::map in C++ use internally?",
    options: [
      "Hash table",
      "Red-Black tree (a self-balancing BST)",
      "AVL tree",
      "Array",
    ],
    correctIndex: 1,
    explanation:
      "std::map and std::set use a Red-Black tree, which is a type of self-balancing BST. This guarantees O(log n) for all operations and keeps elements in sorted order.",
  },
  {
    id: 9,
    question: "What is the time complexity of finding the k-th smallest element in a BST?",
    options: ["O(1)", "O(k)", "O(log n)", "O(n)"],
    correctIndex: 3,
    explanation:
      "Do an inorder traversal and stop at the k-th element. Worst case you traverse O(n) nodes. With an augmented BST (storing subtree sizes), you can do it in O(h) = O(log n) for balanced trees.",
  },
  {
    id: 10,
    question: "How do you find the Lowest Common Ancestor (LCA) in a BST (not just any binary tree)?",
    options: [
      "Same algorithm as general binary tree LCA",
      "Use the BST property: if both values < node, go left. If both > node, go right. Otherwise, node is LCA.",
      "Always return the root",
      "Use BFS",
    ],
    correctIndex: 1,
    explanation:
      "BST LCA is simpler than general tree LCA! If both target values are less than current node → LCA is in left subtree. If both greater → right subtree. Otherwise (one on each side, or one equals current) → current node is LCA. O(h) time.",
  },
  {
    id: 11,
    question: "How do you convert a sorted array into a balanced BST?",
    options: [
      "Insert elements one by one",
      "Pick the middle element as root, recursively build left and right from subarrays",
      "Use a heap",
      "Reverse the array first",
    ],
    correctIndex: 1,
    explanation:
      "Pick the middle element → it becomes the root (ensures balance). Recursively do the same for left half (left subtree) and right half (right subtree). This gives a height-balanced BST. O(n) time.",
  },
  {
    id: 12,
    question: "What is the relationship between BST and binary search?",
    options: [
      "They are unrelated",
      "A BST is a tree representation of binary search — searching follows the same halving logic",
      "Binary search is faster than BST",
      "BST only works on arrays",
    ],
    correctIndex: 1,
    explanation:
      "A BST is essentially binary search in tree form. At each node, you decide to go left or right — just like binary search narrows the range. A balanced BST gives the same O(log n) as binary search on a sorted array.",
  },
];

export default function Lesson10BST({ onQuizComplete }) {
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
      {/* What is a BST? */}
      <Section icon={BookOpen} title="What is a Binary Search Tree?">
        <p className="text-foreground/80 leading-relaxed mb-4">
          A <strong>Binary Search Tree (BST)</strong> is a binary tree with one crucial rule: for every node,
          <strong> all values in the left subtree are less</strong>, and <strong>all values in the right subtree are greater</strong>.
          This ordering makes search, insert, and delete efficient — O(log n) in a balanced tree.
        </p>

        <div className="bg-card rounded-xl border border-border p-5 my-4">
          <h4 className="font-semibold mb-3 text-accent-light">BST Property Visualized</h4>
          <div className="font-mono text-sm bg-code-bg rounded-lg p-4 overflow-x-auto">
            <p className="text-foreground/90">{"        8        ← root"}</p>
            <p className="text-foreground/90">{"       / \\"}</p>
            <p className="text-foreground/90">{"      3   10     ← 3 < 8, 10 > 8 ✓"}</p>
            <p className="text-foreground/90">{"     / \\    \\"}</p>
            <p className="text-foreground/90">{"    1   6   14   ← 1 < 3, 6 > 3, 14 > 10 ✓"}</p>
            <p className="text-foreground/90">{"       / \\  /"}</p>
            <p className="text-foreground/90">{"      4   7 13   ← all maintain BST property"}</p>
            <p className="text-muted mt-2">{"Inorder traversal: 1 3 4 6 7 8 10 13 14 ← SORTED!"}</p>
          </div>
        </div>

        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-card">
                <th className="text-left p-3 border-b border-border font-semibold">Operation</th>
                <th className="text-left p-3 border-b border-border font-semibold">Balanced BST</th>
                <th className="text-left p-3 border-b border-border font-semibold">Skewed BST</th>
                <th className="text-left p-3 border-b border-border font-semibold">Sorted Array</th>
              </tr>
            </thead>
            <tbody>
              {[
                { op: "Search", bal: "O(log n)", skew: "O(n)", arr: "O(log n)" },
                { op: "Insert", bal: "O(log n)", skew: "O(n)", arr: "O(n)" },
                { op: "Delete", bal: "O(log n)", skew: "O(n)", arr: "O(n)" },
                { op: "Min / Max", bal: "O(log n)", skew: "O(n)", arr: "O(1)" },
                { op: "Sorted traversal", bal: "O(n)", skew: "O(n)", arr: "O(n)" },
              ].map((row) => (
                <tr key={row.op} className="border-b border-border/50 hover:bg-card/50">
                  <td className="p-3 font-semibold">{row.op}</td>
                  <td className="p-3 font-mono text-xs text-success">{row.bal}</td>
                  <td className="p-3 font-mono text-xs text-danger">{row.skew}</td>
                  <td className="p-3 font-mono text-xs">{row.arr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <KeyPoint>
          <strong>BSTs give O(log n) search, insert, AND delete</strong> — arrays can only give you
          two of three. But only if the BST is balanced! Skewed BSTs degrade to O(n) linked lists.
        </KeyPoint>
      </Section>

      {/* Core Operations */}
      <Section icon={Zap} title="Core BST Operations">
        <h3 className="text-lg font-semibold mt-2 mb-3 text-accent-light">1. Search</h3>
        <CodeBlock
          title="BST Search — O(h)"
          code={`TreeNode* search(TreeNode* root, int target) {
    if (!root) return nullptr;            // Not found
    
    if (target == root->val) return root;  // Found!
    else if (target < root->val)
        return search(root->left, target);  // Go left
    else
        return search(root->right, target); // Go right
}

// Iterative version (saves stack space):
TreeNode* searchIterative(TreeNode* root, int target) {
    while (root && root->val != target) {
        root = (target < root->val) ? root->left : root->right;
    }
    return root;
}
// Time: O(h) — h = log n balanced, n skewed
// Space: O(1) iterative, O(h) recursive`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">2. Insert</h3>
        <CodeBlock
          title="BST Insert — O(h)"
          code={`TreeNode* insert(TreeNode* root, int val) {
    // Found the right spot — create new node
    if (!root) return new TreeNode(val);
    
    if (val < root->val)
        root->left = insert(root->left, val);    // Go left
    else if (val > root->val)
        root->right = insert(root->right, val);  // Go right
    // If val == root->val, duplicate — skip (or handle as needed)
    
    return root;
}

// How it works:
// insert(root, 5) on tree [8, 3, 10, 1, 6]
// 5 < 8 → go left
// 5 > 3 → go right
// 5 < 6 → go left
// null → create node(5) here!
// Result: 5 is left child of 6

// Time: O(h), Space: O(h) recursive`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">3. Delete (The Hard One)</h3>
        <p className="text-foreground/80 leading-relaxed mb-3">
          Deletion has <strong>three cases</strong>. The tricky one is deleting a node with two children.
        </p>
        <CodeBlock
          title="BST Delete — Three Cases"
          code={`TreeNode* findMin(TreeNode* root) {
    while (root->left) root = root->left;
    return root;
}

TreeNode* deleteNode(TreeNode* root, int key) {
    if (!root) return nullptr;
    
    // Search for the node
    if (key < root->val) {
        root->left = deleteNode(root->left, key);
    } else if (key > root->val) {
        root->right = deleteNode(root->right, key);
    } else {
        // FOUND the node to delete!
        
        // Case 1: Leaf node (no children) — just remove
        if (!root->left && !root->right) {
            delete root;
            return nullptr;
        }
        
        // Case 2: One child — replace with that child
        if (!root->left) {
            TreeNode* temp = root->right;
            delete root;
            return temp;
        }
        if (!root->right) {
            TreeNode* temp = root->left;
            delete root;
            return temp;
        }
        
        // Case 3: Two children — replace with inorder successor
        TreeNode* successor = findMin(root->right);
        root->val = successor->val;  // Copy successor's value
        root->right = deleteNode(root->right, successor->val);  // Delete successor
    }
    
    return root;
}
// Time: O(h), Space: O(h)`}
        />

        <Warning>
          <strong>BST deletion with two children is a Google favorite.</strong> Know it cold:
          find the inorder successor (leftmost in right subtree), copy its value to the node,
          then delete the successor from the right subtree.
        </Warning>
      </Section>

      {/* Validate BST */}
      <Section icon={Brain} title="Classic BST Interview Problems">
        <h3 className="text-lg font-semibold mt-2 mb-3 text-accent-light">1. Validate BST</h3>
        <CodeBlock
          title="Validate BST — Range-Based Approach"
          code={`bool isValidBST(TreeNode* root, long minVal = LONG_MIN, long maxVal = LONG_MAX) {
    if (!root) return true;
    
    // Current node must be within (minVal, maxVal)
    if (root->val <= minVal || root->val >= maxVal) return false;
    
    // Left subtree: all values must be < root->val
    // Right subtree: all values must be > root->val
    return isValidBST(root->left, minVal, root->val) &&
           isValidBST(root->right, root->val, maxVal);
}

// Why not just check root->left < root && root->right > root?
//       5
//      / \\
//     1   6
//        / \\
//       3   7    ← 3 < 6 ✓ but 3 < 5 ✗ (violates BST!)
// Direct child check would miss this. Range check catches it.
// Time: O(n), Space: O(h)`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">2. LCA in BST</h3>
        <CodeBlock
          title="LCA in BST — O(h) Using BST Property"
          code={`// Simpler than general binary tree LCA!
TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root) return nullptr;
    
    // Both values smaller → LCA is in left subtree
    if (p->val < root->val && q->val < root->val)
        return lowestCommonAncestor(root->left, p, q);
    
    // Both values larger → LCA is in right subtree
    if (p->val > root->val && q->val > root->val)
        return lowestCommonAncestor(root->right, p, q);
    
    // Split point: one on each side (or one equals root)
    return root;  // This is the LCA!
}
// Time: O(h) — not O(n)! Much faster than general LCA`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">3. K-th Smallest Element</h3>
        <CodeBlock
          title="K-th Smallest — Inorder Traversal"
          code={`int kthSmallest(TreeNode* root, int k) {
    stack<TreeNode*> st;
    TreeNode* curr = root;
    int count = 0;
    
    while (curr || !st.empty()) {
        while (curr) {
            st.push(curr);
            curr = curr->left;
        }
        
        curr = st.top();
        st.pop();
        count++;
        
        if (count == k) return curr->val;  // Found k-th smallest!
        
        curr = curr->right;
    }
    
    return -1;  // k > number of nodes
}
// Inorder = sorted order for BST
// Stop at the k-th element — no need to traverse everything
// Time: O(h + k), Space: O(h)`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">4. Sorted Array to Balanced BST</h3>
        <CodeBlock
          title="Convert Sorted Array to BST — O(n)"
          code={`TreeNode* sortedArrayToBST(vector<int>& nums, int left, int right) {
    if (left > right) return nullptr;
    
    int mid = left + (right - left) / 2;
    
    TreeNode* root = new TreeNode(nums[mid]);
    root->left = sortedArrayToBST(nums, left, mid - 1);
    root->right = sortedArrayToBST(nums, mid + 1, right);
    
    return root;
}

// Usage:
// vector<int> nums = {1, 2, 3, 4, 5, 6, 7};
// TreeNode* root = sortedArrayToBST(nums, 0, nums.size() - 1);
// Result:       4
//              / \\
//             2   6
//            / \\ / \\
//           1  3 5  7  ← perfectly balanced!

// Time: O(n) — visit each element once
// Space: O(log n) — recursion depth of balanced tree`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">5. BST Iterator</h3>
        <CodeBlock
          title="BST Iterator — Controlled Inorder Traversal"
          code={`// Design an iterator that returns elements in sorted order
class BSTIterator {
    stack<TreeNode*> st;
    
    void pushLeft(TreeNode* node) {
        while (node) {
            st.push(node);
            node = node->left;
        }
    }
    
public:
    BSTIterator(TreeNode* root) {
        pushLeft(root);
    }
    
    int next() {
        TreeNode* node = st.top();
        st.pop();
        pushLeft(node->right);  // Process right subtree
        return node->val;
    }
    
    bool hasNext() {
        return !st.empty();
    }
};

// next() and hasNext() are O(1) amortized
// Space: O(h) — stack holds at most h nodes`}
        />
      </Section>

      {/* C++ Syntax Reference */}
      <Section icon={Code2} title="C++ Syntax Reference">
        <CodeBlock
          title="BST Operations & STL Equivalents"
          code={`// === BST Node ===
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

// === BST Search Pattern ===
// Go left if target < node, right if target > node
while (root) {
    if (target == root->val) return root;
    root = (target < root->val) ? root->left : root->right;
}

// === Find Min/Max in BST ===
TreeNode* findMin(TreeNode* root) {
    while (root->left) root = root->left;   // Keep going left
    return root;
}
TreeNode* findMax(TreeNode* root) {
    while (root->right) root = root->right; // Keep going right
    return root;
}

// === Inorder Successor ===
// If node has right subtree: leftmost node in right subtree
// Otherwise: nearest ancestor where node is in left subtree

// === STL BST Containers (Red-Black Tree) ===
#include <set>
#include <map>

// set<int> behaves like a BST of unique elements
set<int> bst = {8, 3, 10, 1, 6, 14};
bst.insert(5);              // O(log n)
bst.count(5);               // O(log n) — 0 or 1
bst.erase(5);               // O(log n)
*bst.begin();               // Min element — O(1)
*bst.rbegin();              // Max element — O(1)
auto it = bst.lower_bound(5); // First >= 5 — O(log n)
auto it2 = bst.upper_bound(5); // First > 5 — O(log n)

// Inorder traversal (sorted):
for (int x : bst) cout << x << " ";  // 1 3 6 8 10 14

// map<K,V> = BST with key-value pairs
map<int, string> m;
m[3] = "three";
m.lower_bound(2);  // Iterator to first key >= 2`}
        />
      </Section>

      {/* Coding Challenges */}
      <Section icon={Code2} title="Coding Challenges">
        <CodingChallenge
          title="Challenge 1: Validate a BST"
          description="Write a function that checks if a binary tree is a valid BST. Use the range-based approach: each node must be within (min, max) bounds."
          starterCode={`bool isValidBST(TreeNode* root, long minVal = LONG_MIN, long maxVal = LONG_MAX) {
    // Base case: null is valid
    // Check if current node is within bounds
    // Recurse: left with updated max, right with updated min

}`}
          solution={`bool isValidBST(TreeNode* root, long minVal = LONG_MIN, long maxVal = LONG_MAX) {
    if (!root) return true;
    
    if (root->val <= minVal || root->val >= maxVal)
        return false;
    
    return isValidBST(root->left, minVal, root->val) &&
           isValidBST(root->right, root->val, maxVal);
}
// Time: O(n), Space: O(h)`}
          hints={[
            "Base case: null node is always valid → return true.",
            "Check if root->val is strictly within (minVal, maxVal).",
            "For left child: max becomes root->val. For right child: min becomes root->val.",
          ]}
          testDescription="Pass min/max bounds down the tree. Left subtree gets tighter max, right gets tighter min."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("!root") &&
              lower.includes("minval") &&
              lower.includes("maxval") &&
              lower.includes("isvalidbst(root->left") &&
              lower.includes("isvalidbst(root->right")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 2: Insert into a BST"
          description="Write a recursive function that inserts a value into a BST and returns the root. New nodes are always inserted as leaves."
          starterCode={`TreeNode* insertIntoBST(TreeNode* root, int val) {
    // Base case: null → create new node
    // If val < root, insert into left subtree
    // If val > root, insert into right subtree

}`}
          solution={`TreeNode* insertIntoBST(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    
    if (val < root->val)
        root->left = insertIntoBST(root->left, val);
    else if (val > root->val)
        root->right = insertIntoBST(root->right, val);
    
    return root;
}
// Time: O(h), Space: O(h)`}
          hints={[
            "Base case: if root is null, create and return a new TreeNode(val).",
            "If val < root->val, recurse left: root->left = insert(root->left, val).",
            "If val > root->val, recurse right. Always return root at the end.",
          ]}
          testDescription="Walk down the tree following BST property. Insert at the null position you reach."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("!root") &&
              lower.includes("newtreenode(val)") &&
              lower.includes("root->left=insert") &&
              lower.includes("root->right=insert") &&
              lower.includes("returnroot")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 3: Sorted Array to Balanced BST"
          description="Given a sorted array, convert it to a height-balanced BST. Pick the middle element as root, then recursively build left and right subtrees."
          starterCode={`TreeNode* sortedArrayToBST(vector<int>& nums, int left, int right) {
    // Base case: left > right
    // Pick middle as root
    // Recursively build left and right subtrees

}`}
          solution={`TreeNode* sortedArrayToBST(vector<int>& nums, int left, int right) {
    if (left > right) return nullptr;
    
    int mid = left + (right - left) / 2;
    
    TreeNode* root = new TreeNode(nums[mid]);
    root->left = sortedArrayToBST(nums, left, mid - 1);
    root->right = sortedArrayToBST(nums, mid + 1, right);
    
    return root;
}
// Time: O(n), Space: O(log n)`}
          hints={[
            "Base case: if left > right, return nullptr.",
            "Middle element = left + (right - left) / 2. This becomes the root.",
            "Left subtree from [left, mid-1]. Right subtree from [mid+1, right].",
          ]}
          testDescription="Binary search style: middle becomes root, recurse on both halves."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("left>right") &&
              lower.includes("mid") &&
              lower.includes("newtreenode(nums[mid])") &&
              lower.includes("mid-1") &&
              lower.includes("mid+1")
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
              <span><strong>BST property:</strong> left subtree &lt; node &lt; right subtree. Inorder = sorted order.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Search, insert, delete are all O(h).</strong> Balanced = O(log n). Skewed = O(n).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Delete with two children:</strong> replace with inorder successor, then delete successor. Know this cold.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Validate BST with ranges</strong>, not just direct children. Pass (min, max) bounds recursively.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>BST LCA is O(h)</strong> — use the BST property to decide left or right. Simpler than general LCA.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>std::set and std::map</strong> are balanced BSTs (Red-Black trees). Use them when you need sorted order + O(log n) operations.</span>
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
