"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Link,
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
    question: "What is Union-Find (Disjoint Set Union)?",
    options: [
      "A sorting algorithm",
      "A data structure that tracks elements partitioned into disjoint sets, supporting union and find operations",
      "A type of balanced tree",
      "A graph traversal algorithm",
    ],
    correctIndex: 1,
    explanation:
      "Union-Find (DSU) manages a collection of disjoint sets. It supports two operations: find(x) — which set does x belong to? union(x, y) — merge the sets containing x and y. Used for connectivity, cycle detection, and component tracking.",
  },
  {
    id: 2,
    question: "What does the find(x) operation return?",
    options: [
      "The value of x",
      "The representative (root) of the set containing x",
      "The size of x's set",
      "The parent of x",
    ],
    correctIndex: 1,
    explanation:
      "find(x) returns the root/representative of x's set. Two elements are in the same set if and only if find(a) == find(b). The root is the element whose parent is itself.",
  },
  {
    id: 3,
    question: "What is path compression?",
    options: [
      "Compressing the graph into fewer edges",
      "During find(x), make every node on the path point directly to the root",
      "Reducing the number of union operations",
      "Sorting the parent array",
    ],
    correctIndex: 1,
    explanation:
      "Path compression: when calling find(x), recursively find the root, then set parent[x] = root directly. This flattens the tree, making future find() calls nearly O(1). Implemented as: parent[x] = find(parent[x]).",
  },
  {
    id: 4,
    question: "What is union by rank?",
    options: [
      "Always merge the left set into the right",
      "Attach the shorter tree under the root of the taller tree to keep trees balanced",
      "Sort sets by size before merging",
      "Union in alphabetical order",
    ],
    correctIndex: 1,
    explanation:
      "Union by rank: keep track of tree height (rank). When merging, attach the shorter tree under the taller one. This prevents degenerate chains and keeps the tree balanced. Alternative: union by size (attach smaller set under larger).",
  },
  {
    id: 5,
    question: "What is the time complexity of find() and union() with path compression and union by rank?",
    options: [
      "O(log n)",
      "O(n)",
      "O(α(n)) — nearly O(1), where α is the inverse Ackermann function",
      "O(1) exactly",
    ],
    correctIndex: 2,
    explanation:
      "With both optimizations, each operation is O(α(n)) amortized, where α is the inverse Ackermann function. α(n) ≤ 4 for any practical n (up to 2^65536). For all intents and purposes, it's O(1) per operation.",
  },
  {
    id: 6,
    question: "How does Union-Find detect cycles in an undirected graph?",
    options: [
      "It uses DFS",
      "If find(u) == find(v) when processing edge (u,v), adding it would create a cycle",
      "It counts the number of edges",
      "It uses BFS coloring",
    ],
    correctIndex: 1,
    explanation:
      "Process edges one by one. For edge (u,v): if find(u) == find(v), both are already connected — adding this edge creates a cycle. If find(u) != find(v), union them. This is how Kruskal's avoids cycles in MST.",
  },
  {
    id: 7,
    question: "How do you count the number of connected components using Union-Find?",
    options: [
      "Count the number of edges",
      "Count the number of distinct roots (elements where parent[i] == i after all unions)",
      "Count the number of union operations",
      "It's always V - E",
    ],
    correctIndex: 1,
    explanation:
      "Initially, each element is its own component (V components). Each successful union decreases components by 1. You can track a 'components' counter, or count elements where find(i) == i after all operations.",
  },
  {
    id: 8,
    question: "What is the 'Number of Connected Components in Undirected Graph' approach with Union-Find?",
    options: [
      "BFS from every node",
      "Process all edges with union-find, then count remaining components",
      "Sort the adjacency list",
      "Use Dijkstra's algorithm",
    ],
    correctIndex: 1,
    explanation:
      "Start with n components. For each edge (u,v), call union(u,v). Each successful union reduces component count by 1. Final component count = answer. This is often simpler than BFS/DFS for this problem.",
  },
  {
    id: 9,
    question: "What is 'Redundant Connection' asking?",
    options: [
      "Find the shortest edge",
      "Find an edge that, if removed, keeps the graph connected — the edge that creates a cycle",
      "Find the MST",
      "Count connected components",
    ],
    correctIndex: 1,
    explanation:
      "A tree has V-1 edges. The input has V edges (one extra). The extra edge creates a cycle. Process edges in order with Union-Find. The first edge where find(u) == find(v) is the redundant one — it creates the cycle.",
  },
  {
    id: 10,
    question: "What is union by size?",
    options: [
      "Same as union by rank",
      "Track set sizes; attach the smaller set under the larger set's root",
      "Union the smallest elements first",
      "Limit the number of unions",
    ],
    correctIndex: 1,
    explanation:
      "Union by size: track the number of elements in each set. When merging, attach the smaller set under the larger one. Similar to union by rank but uses actual size instead of height. Both achieve O(α(n)).",
  },
  {
    id: 11,
    question: "How does Union-Find help solve 'Accounts Merge'?",
    options: [
      "Sort accounts alphabetically",
      "Union accounts that share any email, then group all emails by their root account",
      "Use BFS on accounts",
      "Hash all emails",
    ],
    correctIndex: 1,
    explanation:
      "Map each email to an account ID. If an email appears in multiple accounts, union those accounts. After processing, group all emails by their root (find). This merges accounts that share common emails, even transitively.",
  },
  {
    id: 12,
    question: "When should you use Union-Find vs BFS/DFS for connectivity?",
    options: [
      "Always use BFS/DFS",
      "Union-Find: dynamic edges (added over time), online queries. BFS/DFS: static graph, single traversal.",
      "They are identical",
      "Union-Find is always slower",
    ],
    correctIndex: 1,
    explanation:
      "Union-Find excels when edges arrive dynamically (one at a time) and you need to answer connectivity queries between additions. BFS/DFS is better for a static graph where you traverse once. Union-Find is also essential for Kruskal's MST.",
  },
];

export default function Lesson19UnionFind({ onQuizComplete }) {
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
      {/* What is Union-Find? */}
      <Section icon={BookOpen} title="What is Union-Find (Disjoint Set Union)?">
        <p className="text-foreground/80 leading-relaxed mb-4">
          <strong>Union-Find</strong> (also called DSU — Disjoint Set Union) is a data structure that
          manages a collection of <strong>non-overlapping sets</strong>. It supports two operations
          in nearly O(1) time: <strong>find</strong> (which set does an element belong to?) and
          <strong> union</strong> (merge two sets).
        </p>

        <div className="bg-card rounded-xl border border-border p-5 my-4">
          <h4 className="font-semibold mb-3 text-accent-light">Union-Find Visualization</h4>
          <div className="font-mono text-sm bg-code-bg rounded-lg p-4 overflow-x-auto">
            <p className="text-muted">{"// Initially: each element is its own set"}</p>
            <p className="text-foreground/90">{"{0} {1} {2} {3} {4}   — 5 sets"}</p>
            <p className="text-foreground/90 mt-1">{"union(0, 1)  → {0,1} {2} {3} {4}   — 4 sets"}</p>
            <p className="text-foreground/90">{"union(2, 3)  → {0,1} {2,3} {4}     — 3 sets"}</p>
            <p className="text-foreground/90">{"union(1, 3)  → {0,1,2,3} {4}       — 2 sets"}</p>
            <p className="text-success mt-1">{"find(0) == find(3)?  YES — same set!"}</p>
            <p className="text-warning">{"find(0) == find(4)?  NO — different sets"}</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 my-4">
          <div className="p-4 bg-card rounded-lg border border-border">
            <h4 className="font-semibold text-sm mb-2 text-accent-light">When to Use Union-Find</h4>
            <ul className="text-xs text-foreground/80 space-y-1">
              <li>- Dynamic connectivity queries</li>
              <li>- Kruskal&apos;s MST algorithm</li>
              <li>- Cycle detection in undirected graphs</li>
              <li>- Connected components (edges added over time)</li>
              <li>- Accounts merge / grouping problems</li>
              <li>- Redundant connection</li>
            </ul>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border">
            <h4 className="font-semibold text-sm mb-2 text-accent-light">Operations</h4>
            <ul className="text-xs text-foreground/80 space-y-1">
              <li>- <strong>find(x)</strong>: return root of x&apos;s set</li>
              <li>- <strong>union(x, y)</strong>: merge sets of x and y</li>
              <li>- <strong>connected(x, y)</strong>: find(x) == find(y)?</li>
              <li>- Time: O(α(n)) ≈ O(1) amortized</li>
              <li>- Space: O(n)</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Basic Implementation */}
      <Section icon={Code2} title="Building Union-Find from Scratch">
        <h3 className="text-lg font-semibold mt-2 mb-3 text-accent-light">Step 1: Naive Union-Find</h3>
        <CodeBlock
          title="Naive Implementation — O(n) find"
          code={`class NaiveUnionFind {
    vector<int> parent;
public:
    NaiveUnionFind(int n) : parent(n) {
        for (int i = 0; i < n; i++)
            parent[i] = i;  // Each element is its own root
    }
    
    int find(int x) {
        while (parent[x] != x)  // Walk up to root
            x = parent[x];
        return x;
    }
    
    void unite(int x, int y) {
        int rootX = find(x), rootY = find(y);
        if (rootX != rootY)
            parent[rootX] = rootY;  // Attach one root to the other
    }
};
// Problem: tree can become a long chain → find() is O(n)
// Example: union(0,1), union(1,2), union(2,3), ...
// Creates chain: 0→1→2→3→... → find(0) walks the entire chain`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">Step 2: Add Path Compression</h3>
        <CodeBlock
          title="Path Compression — Flatten During find()"
          code={`int find(int x) {
    if (parent[x] != x)
        parent[x] = find(parent[x]);  // Recursively find root AND flatten
    return parent[x];
}

// Before path compression:       After find(0):
//      4                              4
//     /                         / | \\ \\
//    3                         0  1  2  3
//   /
//  2
// /
// 1
// /
// 0
// find(0) walks 0→1→2→3→4      find(0) is now O(1)!
// And flattens: 0→4, 1→4, 2→4

// One line is all it takes:
// parent[x] = find(parent[x]);  ← the magic line`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">Step 3: Add Union by Rank</h3>
        <CodeBlock
          title="Union by Rank — Keep Trees Balanced"
          code={`bool unite(int x, int y) {
    int rootX = find(x), rootY = find(y);
    if (rootX == rootY) return false;  // Already in same set
    
    // Attach shorter tree under taller tree
    if (rank[rootX] < rank[rootY]) swap(rootX, rootY);
    parent[rootY] = rootX;
    if (rank[rootX] == rank[rootY]) rank[rootX]++;
    
    return true;  // Successfully merged
}

// Without union by rank:    With union by rank:
//     1                         2
//    / \\                     / | \\ \\
//   2   3                   1  3  5  4
//  / \\
// 4   5
// Degenerate → O(n)        Balanced → O(log n)

// Combined with path compression → O(α(n)) ≈ O(1)`}
        />

        <KeyPoint>
          <strong>The two optimizations together:</strong> (1) Path compression flattens trees during find().
          (2) Union by rank keeps trees balanced during union(). Together they achieve O(α(n)) ≈ O(1)
          amortized per operation. <strong>Always use both.</strong>
        </KeyPoint>
      </Section>

      {/* Complete Implementation */}
      <Section icon={Zap} title="Complete Union-Find Class">
        <CodeBlock
          title="Production-Ready Union-Find"
          code={`class UnionFind {
    vector<int> parent, rank_;
    int components;
    
public:
    UnionFind(int n) : parent(n), rank_(n, 0), components(n) {
        iota(parent.begin(), parent.end(), 0);  // parent[i] = i
    }
    
    // Find with path compression
    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]);
        return parent[x];
    }
    
    // Union by rank, returns true if merged
    bool unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;
        
        if (rank_[px] < rank_[py]) swap(px, py);
        parent[py] = px;
        if (rank_[px] == rank_[py]) rank_[px]++;
        components--;
        return true;
    }
    
    bool connected(int x, int y) {
        return find(x) == find(y);
    }
    
    int getComponents() { return components; }
};

// Usage:
UnionFind uf(10);          // 10 elements: 0-9
uf.unite(0, 1);            // Merge sets of 0 and 1
uf.unite(2, 3);            // Merge sets of 2 and 3
uf.connected(0, 1);        // true
uf.connected(0, 2);        // false
uf.unite(1, 3);            // Now {0,1,2,3} are one set
uf.connected(0, 2);        // true!
uf.getComponents();         // Returns number of disjoint sets`}
        />

        <CodeBlock
          title="Union by Size (Alternative to Rank)"
          code={`class UnionFindBySize {
    vector<int> parent, size_;
    
public:
    UnionFindBySize(int n) : parent(n), size_(n, 1) {
        iota(parent.begin(), parent.end(), 0);
    }
    
    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]);
        return parent[x];
    }
    
    bool unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;
        
        // Attach smaller to larger
        if (size_[px] < size_[py]) swap(px, py);
        parent[py] = px;
        size_[px] += size_[py];  // Update size (not rank)
        return true;
    }
    
    int getSize(int x) { return size_[find(x)]; }  // Size of x's set
};
// Union by size is useful when you need to know set sizes
// (e.g., "largest connected component")`}
        />
      </Section>

      {/* Classic Problems */}
      <Section icon={Brain} title="Classic Union-Find Interview Problems">
        <h3 className="text-lg font-semibold mt-2 mb-3 text-accent-light">1. Number of Connected Components</h3>
        <CodeBlock
          title="Connected Components — Union-Find Approach"
          code={`int countComponents(int n, vector<vector<int>>& edges) {
    UnionFind uf(n);
    
    for (auto& e : edges) {
        uf.unite(e[0], e[1]);
    }
    
    return uf.getComponents();
}
// Simpler than BFS/DFS when you just need the count!
// Time: O(E × α(V)) ≈ O(E)`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">2. Redundant Connection</h3>
        <CodeBlock
          title="Redundant Connection — Find the Cycle-Creating Edge"
          code={`// Tree with V vertices has V-1 edges.
// Given V edges → one extra edge creates a cycle.
// Find and return that edge.

vector<int> findRedundantConnection(vector<vector<int>>& edges) {
    int n = edges.size();
    UnionFind uf(n + 1);  // 1-indexed
    
    for (auto& e : edges) {
        if (!uf.unite(e[0], e[1])) {
            return e;  // This edge creates a cycle!
        }
    }
    
    return {};  // Should never reach here
}
// Key insight: process edges in order.
// The first edge where both endpoints are already connected → cycle.
// union returns false when find(u) == find(v) → that's our answer.`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">3. Number of Provinces (Friend Circles)</h3>
        <CodeBlock
          title="Number of Provinces"
          code={`// Given n×n adjacency matrix isConnected
// Find number of connected components (provinces)

int findCircleNum(vector<vector<int>>& isConnected) {
    int n = isConnected.size();
    UnionFind uf(n);
    
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (isConnected[i][j] == 1) {
                uf.unite(i, j);
            }
        }
    }
    
    return uf.getComponents();
}`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">4. Accounts Merge</h3>
        <CodeBlock
          title="Accounts Merge — Union Accounts by Shared Emails"
          code={`vector<vector<string>> accountsMerge(vector<vector<string>>& accounts) {
    int n = accounts.size();
    UnionFind uf(n);
    
    // Map each email to the first account that owns it
    unordered_map<string, int> emailToAccount;
    
    for (int i = 0; i < n; i++) {
        for (int j = 1; j < accounts[i].size(); j++) {
            string& email = accounts[i][j];
            if (emailToAccount.count(email)) {
                // Email seen before → union this account with the previous owner
                uf.unite(i, emailToAccount[email]);
            } else {
                emailToAccount[email] = i;
            }
        }
    }
    
    // Group emails by root account
    unordered_map<int, set<string>> rootToEmails;
    for (auto& [email, accId] : emailToAccount) {
        rootToEmails[uf.find(accId)].insert(email);
    }
    
    // Build result
    vector<vector<string>> result;
    for (auto& [root, emails] : rootToEmails) {
        vector<string> merged = {accounts[root][0]};  // Name
        merged.insert(merged.end(), emails.begin(), emails.end());
        result.push_back(merged);
    }
    
    return result;
}
// Union accounts that share emails (even transitively).
// Use set<string> to auto-sort emails.`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">5. Largest Component by Common Factor</h3>
        <CodeBlock
          title="Largest Component Size by Common Factor"
          code={`// Union numbers that share a common factor > 1
// Return size of largest connected component

int largestComponentSize(vector<int>& nums) {
    int n = nums.size();
    int maxVal = *max_element(nums.begin(), nums.end());
    UnionFind uf(maxVal + 1);
    
    // For each number, union it with all its prime factors
    for (int num : nums) {
        for (int f = 2; f * f <= num; f++) {
            if (num % f == 0) {
                uf.unite(num, f);
                uf.unite(num, num / f);
            }
        }
    }
    
    // Count elements per component
    unordered_map<int, int> count;
    int maxSize = 0;
    for (int num : nums) {
        maxSize = max(maxSize, ++count[uf.find(num)]);
    }
    
    return maxSize;
}`}
        />

        <Warning>
          <strong>Union-Find vs BFS/DFS:</strong> Use Union-Find when edges arrive dynamically or you
          need to answer multiple connectivity queries. Use BFS/DFS when you have a static graph and
          need to traverse it once. Union-Find is essential for Kruskal&apos;s MST.
        </Warning>
      </Section>

      {/* C++ Syntax Reference */}
      <Section icon={Code2} title="C++ Syntax Reference">
        <CodeBlock
          title="Union-Find — Complete Reference"
          code={`#include <vector>
#include <numeric>  // for iota
using namespace std;

// ========== Standard Union-Find (Rank) ==========
class UF {
public:
    vector<int> p, r;
    int comp;
    
    UF(int n) : p(n), r(n, 0), comp(n) {
        iota(p.begin(), p.end(), 0);
    }
    
    int find(int x) {
        return p[x] == x ? x : p[x] = find(p[x]);  // Path compression
    }
    
    bool unite(int x, int y) {
        x = find(x); y = find(y);
        if (x == y) return false;
        if (r[x] < r[y]) swap(x, y);     // Union by rank
        p[y] = x;
        if (r[x] == r[y]) r[x]++;
        comp--;
        return true;
    }
    
    bool connected(int x, int y) { return find(x) == find(y); }
    int components() { return comp; }
};

// ========== Union-Find (Size) ==========
class UFSize {
public:
    vector<int> p, sz;
    UFSize(int n) : p(n), sz(n, 1) { iota(p.begin(), p.end(), 0); }
    int find(int x) { return p[x] == x ? x : p[x] = find(p[x]); }
    bool unite(int x, int y) {
        x = find(x); y = find(y);
        if (x == y) return false;
        if (sz[x] < sz[y]) swap(x, y);
        p[y] = x;
        sz[x] += sz[y];
        return true;
    }
    int size(int x) { return sz[find(x)]; }
};

// ========== Common Patterns ==========
// Cycle detection:
if (!uf.unite(u, v)) { /* cycle! */ }

// Connected components count:
uf.components();

// Process edge list:
for (auto& e : edges) uf.unite(e[0], e[1]);

// Group elements by root:
unordered_map<int, vector<int>> groups;
for (int i = 0; i < n; i++) groups[uf.find(i)].push_back(i);

// iota: fills with 0, 1, 2, ...
#include <numeric>
iota(parent.begin(), parent.end(), 0);`}
        />
      </Section>

      {/* Coding Challenges */}
      <Section icon={Code2} title="Coding Challenges">
        <CodingChallenge
          title="Challenge 1: Implement Union-Find"
          description="Implement a Union-Find class with path compression and union by rank. Support find(), unite() (returns bool), and connected()."
          starterCode={`class UnionFind {
    vector<int> parent, rank_;
public:
    UnionFind(int n) {
        // Initialize parent[i] = i, rank[i] = 0
    }
    
    int find(int x) {
        // Path compression
    }
    
    bool unite(int x, int y) {
        // Union by rank, return false if already connected
    }
    
    bool connected(int x, int y) {
        // Check if same set
    }
};`}
          solution={`class UnionFind {
    vector<int> parent, rank_;
public:
    UnionFind(int n) : parent(n), rank_(n, 0) {
        iota(parent.begin(), parent.end(), 0);
    }
    
    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]);
        return parent[x];
    }
    
    bool unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;
        if (rank_[px] < rank_[py]) swap(px, py);
        parent[py] = px;
        if (rank_[px] == rank_[py]) rank_[px]++;
        return true;
    }
    
    bool connected(int x, int y) {
        return find(x) == find(y);
    }
};`}
          hints={[
            "Path compression: parent[x] = find(parent[x]) — one line!",
            "Union by rank: attach shorter tree under taller. Increment rank only when equal.",
            "Return false from unite if find(x) == find(y) already.",
          ]}
          testDescription="Path compression + union by rank = O(α(n)) ≈ O(1) per operation."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("parent[x]=find(parent[x])") &&
              lower.includes("rank") &&
              lower.includes("returnfalse")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 2: Redundant Connection"
          description="Given a graph that is a tree plus one extra edge, find and return the redundant edge (the one that creates a cycle)."
          starterCode={`vector<int> findRedundantConnection(vector<vector<int>>& edges) {
    // Process edges with Union-Find
    // The first edge where unite fails = cycle-creating edge

}`}
          solution={`vector<int> findRedundantConnection(vector<vector<int>>& edges) {
    int n = edges.size();
    UnionFind uf(n + 1);
    
    for (auto& e : edges) {
        if (!uf.unite(e[0], e[1])) {
            return e;
        }
    }
    
    return {};
}`}
          hints={[
            "Process edges in order. Try to unite each pair.",
            "If unite returns false → both endpoints already connected → this edge creates a cycle.",
            "Return that edge immediately — it's the redundant one.",
          ]}
          testDescription="First edge where both endpoints share a root = the cycle-creating edge."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("unite(") || lower.includes("union(") &&
              lower.includes("returne")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 3: Number of Connected Components"
          description="Given n nodes and an edge list, count the number of connected components using Union-Find."
          starterCode={`int countComponents(int n, vector<vector<int>>& edges) {
    // Create Union-Find with n elements
    // Unite all edges
    // Return component count

}`}
          solution={`int countComponents(int n, vector<vector<int>>& edges) {
    UnionFind uf(n);
    
    for (auto& e : edges) {
        uf.unite(e[0], e[1]);
    }
    
    return uf.getComponents();
    
    // Alternative without component counter:
    // int count = 0;
    // for (int i = 0; i < n; i++)
    //     if (uf.find(i) == i) count++;
    // return count;
}`}
          hints={[
            "Start with n components (each node is its own set).",
            "Each successful union merges two components → decrements count.",
            "Or count distinct roots at the end: nodes where find(i) == i.",
          ]}
          testDescription="Union all edges, count remaining components. Simpler than BFS/DFS for this use case."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("unite(") || lower.includes("union(") &&
              lower.includes("getcomponents") || lower.includes("find(i)==i")
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
              <span><strong>Union-Find = disjoint sets with find() and union().</strong> Tracks connectivity dynamically.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Path compression:</strong> <code className="px-1 bg-code-bg rounded text-xs">parent[x] = find(parent[x])</code> — one line that makes find() nearly O(1).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Union by rank/size:</strong> attach shorter/smaller tree under taller/larger. Prevents degenerate chains.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Both optimizations → O(α(n)) ≈ O(1)</strong> per operation. Always use both.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Cycle detection:</strong> if unite(u,v) fails → u and v already connected → cycle.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Use Union-Find for:</strong> dynamic connectivity, Kruskal&apos;s MST, redundant connection, accounts merge, component counting.</span>
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
