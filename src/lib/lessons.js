export const lessons = [
  // ========== Phase 1: C++ Essentials ==========
  {
    id: 1,
    slug: "arrays-structures-pointers",
    title: "Arrays, Structures & Pointers",
    phase: 1,
    phaseTitle: "C++ Essentials",
    description:
      "Array basics, struct definitions, pointer mechanics, and memory layout in C/C++.",
    xpReward: 100,
    icon: "LayoutList",
  },
  {
    id: 2,
    slug: "references-functions",
    title: "References, Functions & Parameter Passing",
    phase: 1,
    phaseTitle: "C++ Essentials",
    description:
      "C++ references, pointer to structure, functions, and parameter passing methods (value, address, reference).",
    xpReward: 110,
    icon: "ArrowRightLeft",
  },
  {
    id: 3,
    slug: "oop-classes-templates",
    title: "OOP: Classes, Constructors & Templates",
    phase: 1,
    phaseTitle: "C++ Essentials",
    description:
      "Converting C to C++ classes, constructors, template classes, and modular program design.",
    xpReward: 120,
    icon: "Boxes",
  },

  // ========== Phase 2: Recursion ==========
  {
    id: 4,
    slug: "how-recursion-works",
    title: "How Recursion Works",
    phase: 2,
    phaseTitle: "Recursion",
    description:
      "Tracing recursion, how recursion uses the stack, recurrence relations, and time complexity of recursion.",
    xpReward: 130,
    icon: "Repeat",
  },
  {
    id: 5,
    slug: "types-of-recursion",
    title: "Types of Recursion",
    phase: 2,
    phaseTitle: "Recursion",
    description:
      "Tail, head, tree, indirect, and nested recursion with tracing and analysis.",
    xpReward: 130,
    icon: "GitBranch",
  },
  {
    id: 6,
    slug: "recursion-problems",
    title: "Recursion Problems",
    phase: 2,
    phaseTitle: "Recursion",
    description:
      "Sum, factorial, power, Taylor series, Fibonacci with memoization, nCr, and Tower of Hanoi.",
    xpReward: 150,
    icon: "Brain",
  },

  // ========== Phase 3: Arrays ==========
  {
    id: 7,
    slug: "array-fundamentals",
    title: "Array Fundamentals & Memory",
    phase: 3,
    phaseTitle: "Arrays",
    description:
      "Declarations, static vs dynamic arrays, 2D arrays, row-major & column-major mapping, and nD formulas.",
    xpReward: 130,
    icon: "Grid3x3",
  },
  {
    id: 8,
    slug: "array-adt-searching",
    title: "Array ADT & Searching",
    phase: 3,
    phaseTitle: "Arrays",
    description:
      "Array ADT, insert, delete, linear search (with improvements), binary search, and analysis.",
    xpReward: 140,
    icon: "Search",
  },
  {
    id: 9,
    slug: "array-operations",
    title: "Array Operations",
    phase: 3,
    phaseTitle: "Arrays",
    description:
      "Get, set, max, min, reverse, shift, check sorted, merge arrays, and set operations (union, intersection, difference).",
    xpReward: 140,
    icon: "Settings",
  },
  {
    id: 10,
    slug: "array-challenges",
    title: "Array Challenges",
    phase: 3,
    phaseTitle: "Arrays",
    description:
      "Finding missing elements, duplicates (sorted & unsorted, hashing), pair with sum K, and max/min in single scan.",
    xpReward: 160,
    icon: "Trophy",
  },

  // ========== Phase 4: Strings ==========
  {
    id: 11,
    slug: "string-operations",
    title: "String Operations & Problems",
    phase: 4,
    phaseTitle: "Strings",
    description:
      "Length, case change, counting, validation, reverse, palindrome, duplicates (bitwise), anagram, and permutations.",
    xpReward: 160,
    icon: "Type",
  },

  // ========== Phase 5: Matrices ==========
  {
    id: 12,
    slug: "special-matrices",
    title: "Special Matrices",
    phase: 5,
    phaseTitle: "Matrices",
    description:
      "Diagonal, lower/upper triangular (row & column major), symmetric, tri-diagonal, and Toeplitz matrices.",
    xpReward: 150,
    icon: "Grid3x3",
  },
  {
    id: 13,
    slug: "sparse-matrix-polynomials",
    title: "Sparse Matrix & Polynomials",
    phase: 5,
    phaseTitle: "Matrices",
    description:
      "Sparse matrix representation & addition, polynomial representation, evaluation, and addition.",
    xpReward: 150,
    icon: "BarChart3",
  },

  // ========== Phase 6: Linked Lists ==========
  {
    id: 14,
    slug: "singly-linked-list",
    title: "Singly Linked List",
    phase: 6,
    phaseTitle: "Linked Lists",
    description:
      "Create, display, count, search, insert, delete, reverse, check sorted, remove duplicates, merge, and loop detection.",
    xpReward: 160,
    icon: "Link",
  },
  {
    id: 15,
    slug: "circular-doubly-linked-list",
    title: "Circular & Doubly Linked Lists",
    phase: 6,
    phaseTitle: "Linked Lists",
    description:
      "Circular linked list, doubly linked list, circular doubly, comparisons, and challenges (middle element, intersection).",
    xpReward: 160,
    icon: "RefreshCw",
  },

  // ========== Phase 7: Stack ==========
  {
    id: 16,
    slug: "stack-implementation",
    title: "Stack Implementation",
    phase: 7,
    phaseTitle: "Stack",
    description:
      "Stack using array, stack using linked list, push, pop, peek, isEmpty, and C++ class implementation.",
    xpReward: 140,
    icon: "Layers",
  },
  {
    id: 17,
    slug: "stack-applications",
    title: "Stack Applications",
    phase: 7,
    phaseTitle: "Stack",
    description:
      "Parenthesis matching, infix to postfix conversion (with associativity), and postfix expression evaluation.",
    xpReward: 160,
    icon: "Zap",
  },

  // ========== Phase 8: Queue ==========
  {
    id: 18,
    slug: "queue-all-types",
    title: "Queue, Circular Queue, Deque & Priority Queue",
    phase: 8,
    phaseTitle: "Queue",
    description:
      "Queue using array & linked list, circular queue, double-ended queue, priority queues, and queue using 2 stacks.",
    xpReward: 160,
    icon: "ListOrdered",
  },

  // ========== Phase 9: Trees ==========
  {
    id: 19,
    slug: "binary-tree-basics",
    title: "Binary Tree Basics & Creation",
    phase: 9,
    phaseTitle: "Trees",
    description:
      "Terminology, types (strict, complete, full), height vs nodes, representations, and creating a binary tree.",
    xpReward: 150,
    icon: "GitBranch",
  },
  {
    id: 20,
    slug: "binary-tree-traversals",
    title: "Binary Tree Traversals & Construction",
    phase: 9,
    phaseTitle: "Trees",
    description:
      "Preorder, inorder, postorder (recursive & iterative), level order, generating tree from traversals, height & count.",
    xpReward: 170,
    icon: "Compass",
  },
  {
    id: 21,
    slug: "binary-search-trees",
    title: "Binary Search Trees",
    phase: 9,
    phaseTitle: "Trees",
    description:
      "BST search, insert (iterative & recursive), delete, create, generate from preorder, and drawbacks.",
    xpReward: 160,
    icon: "Search",
  },
  {
    id: 22,
    slug: "avl-trees",
    title: "AVL Trees",
    phase: 9,
    phaseTitle: "Trees",
    description:
      "Balance factor, LL/RR/LR/RL rotations, insertion, deletion, generation, and height analysis.",
    xpReward: 180,
    icon: "Scale",
  },
  {
    id: 23,
    slug: "red-black-multiway-trees",
    title: "Red-Black Trees & Multi-way Trees",
    phase: 9,
    phaseTitle: "Trees",
    description:
      "2-3 trees, 2-3-4 trees, Red-Black tree properties, creation, deletion, and relationship to 2-3-4 trees.",
    xpReward: 190,
    icon: "Network",
  },

  // ========== Phase 10: Heap ==========
  {
    id: 24,
    slug: "heaps-heapsort",
    title: "Heaps, Heap Sort & Priority Queue",
    phase: 10,
    phaseTitle: "Heap",
    description:
      "Heap insert, create, delete, heap sort, heapify (O(n) method), and heap as priority queue.",
    xpReward: 170,
    icon: "Triangle",
  },

  // ========== Phase 11: Sorting ==========
  {
    id: 25,
    slug: "comparison-sorts",
    title: "Comparison Sorts",
    phase: 11,
    phaseTitle: "Sorting",
    description:
      "Bubble sort, insertion sort, selection sort, quick sort — analysis, comparison, and implementation.",
    xpReward: 170,
    icon: "ArrowUpDown",
  },
  {
    id: 26,
    slug: "advanced-sorts",
    title: "Advanced Sorting Algorithms",
    phase: 11,
    phaseTitle: "Sorting",
    description:
      "Merge sort (iterative & recursive), count sort, bin/bucket sort, radix sort, and shell sort.",
    xpReward: 180,
    icon: "ArrowDownUp",
  },

  // ========== Phase 12: Hashing ==========
  {
    id: 27,
    slug: "hashing",
    title: "Hashing & Collision Resolution",
    phase: 12,
    phaseTitle: "Hashing",
    description:
      "Hash functions, chaining, linear probing, quadratic probing, double hashing, and hash function design.",
    xpReward: 170,
    icon: "Hash",
  },

  // ========== Phase 13: Graphs ==========
  {
    id: 28,
    slug: "graphs-bfs-dfs",
    title: "Graphs: Representations, BFS & DFS",
    phase: 13,
    phaseTitle: "Graphs",
    description:
      "Undirected & directed graph representations, BFS, DFS, and disjoint subsets.",
    xpReward: 180,
    icon: "Share2",
  },

  // ========== Phase 14: Algorithm Analysis ==========
  {
    id: 29,
    slug: "recurrence-asymptotic",
    title: "Recurrence Relations & Asymptotic Notations",
    phase: 14,
    phaseTitle: "Algorithm Analysis",
    description:
      "Decreasing & dividing recurrences, Master theorem, Big-O/Omega/Theta, best & worst case analysis.",
    xpReward: 180,
    icon: "Timer",
  },

  // ========== Phase 15: Algorithm Strategies ==========
  {
    id: 30,
    slug: "divide-and-conquer",
    title: "Divide & Conquer",
    phase: 15,
    phaseTitle: "Algorithm Strategies",
    description:
      "Binary search, merge sort, k-way merging, and Strassen's matrix multiplication.",
    xpReward: 170,
    icon: "Scissors",
  },
  {
    id: 31,
    slug: "greedy-algorithms",
    title: "Greedy Algorithms",
    phase: 15,
    phaseTitle: "Algorithm Strategies",
    description:
      "Fractional knapsack, Kruskal's MST, Prim's MST, Dijkstra's shortest path, and optimal merge pattern.",
    xpReward: 180,
    icon: "Zap",
  },
  {
    id: 32,
    slug: "dynamic-programming",
    title: "Dynamic Programming",
    phase: 15,
    phaseTitle: "Algorithm Strategies",
    description:
      "0/1 knapsack (recursion, memoization, tabulation), matrix chain multiplication, LCS, and Kadane's max subarray.",
    xpReward: 200,
    icon: "Brain",
  },
  {
    id: 33,
    slug: "backtracking",
    title: "Backtracking",
    phase: 15,
    phaseTitle: "Algorithm Strategies",
    description:
      "N-Queens, permutations, rat in a maze, and sudoku solver — brute force vs backtracking.",
    xpReward: 190,
    icon: "Undo2",
  },
  {
    id: 34,
    slug: "google-interview-patterns",
    title: "Google-Style Interview Patterns",
    phase: 15,
    phaseTitle: "Algorithm Strategies",
    description:
      "Common DS+algorithm combinations, pattern recognition, and system design implications.",
    xpReward: 200,
    icon: "Trophy",
  },
];

export const phases = [
  { id: 1, title: "C++ Essentials", color: "#6366f1" },
  { id: 2, title: "Recursion", color: "#8b5cf6" },
  { id: 3, title: "Arrays", color: "#a855f7" },
  { id: 4, title: "Strings", color: "#ec4899" },
  { id: 5, title: "Matrices", color: "#f43f5e" },
  { id: 6, title: "Linked Lists", color: "#06b6d4" },
  { id: 7, title: "Stack", color: "#14b8a6" },
  { id: 8, title: "Queue", color: "#22c55e" },
  { id: 9, title: "Trees", color: "#84cc16" },
  { id: 10, title: "Heap", color: "#eab308" },
  { id: 11, title: "Sorting", color: "#f59e0b" },
  { id: 12, title: "Hashing", color: "#f97316" },
  { id: 13, title: "Graphs", color: "#3b82f6" },
  { id: 14, title: "Algorithm Analysis", color: "#ef4444" },
  { id: 15, title: "Algorithm Strategies", color: "#e11d48" },
];
