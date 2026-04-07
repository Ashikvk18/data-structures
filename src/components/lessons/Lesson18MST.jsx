"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Network,
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
    question: "What is a Minimum Spanning Tree (MST)?",
    options: [
      "The shortest path between two nodes",
      "A subset of edges that connects all vertices with minimum total weight and no cycles",
      "A balanced binary tree",
      "A tree with the fewest nodes",
    ],
    correctIndex: 1,
    explanation:
      "An MST is a spanning tree (connects all V vertices with exactly V-1 edges, no cycles) whose total edge weight is minimized. It's a subgraph of the original weighted, undirected graph.",
  },
  {
    id: 2,
    question: "How many edges does an MST of a graph with V vertices have?",
    options: ["V", "V - 1", "V + 1", "E"],
    correctIndex: 1,
    explanation:
      "Any tree with V vertices has exactly V-1 edges. An MST is a tree, so it always has V-1 edges. This is a useful sanity check — if your MST has more or fewer edges, something is wrong.",
  },
  {
    id: 3,
    question: "What is the main idea behind Kruskal's algorithm?",
    options: [
      "Start from a vertex and greedily add the cheapest edge to an unvisited neighbor",
      "Sort all edges by weight, then add edges that don't create a cycle (using Union-Find)",
      "Use BFS to find the MST",
      "Use dynamic programming on the adjacency matrix",
    ],
    correctIndex: 1,
    explanation:
      "Kruskal's: (1) Sort all edges by weight. (2) Iterate through edges, adding each one if it doesn't create a cycle. (3) Use Union-Find to efficiently check for cycles. Stop when you have V-1 edges.",
  },
  {
    id: 4,
    question: "What is the main idea behind Prim's algorithm?",
    options: [
      "Sort all edges globally",
      "Start from any vertex, greedily add the cheapest edge connecting the MST to a new vertex",
      "Remove the most expensive edges",
      "Use topological sort",
    ],
    correctIndex: 1,
    explanation:
      "Prim's grows the MST from a starting vertex. At each step, pick the cheapest edge that connects a vertex IN the MST to a vertex NOT in the MST. Uses a min-heap for efficiency. Similar to Dijkstra's structure.",
  },
  {
    id: 5,
    question: "What data structure does Kruskal's algorithm rely on?",
    options: [
      "Min-heap (priority queue)",
      "Union-Find (Disjoint Set Union)",
      "Stack",
      "Hash map",
    ],
    correctIndex: 1,
    explanation:
      "Kruskal's uses Union-Find to efficiently check if adding an edge creates a cycle. If two vertices are already in the same component (same root in Union-Find), adding an edge between them would create a cycle — skip it.",
  },
  {
    id: 6,
    question: "What data structure does Prim's algorithm use for efficiency?",
    options: [
      "Union-Find",
      "Min-heap (priority queue)",
      "Stack",
      "Balanced BST",
    ],
    correctIndex: 1,
    explanation:
      "Prim's uses a min-heap to always pick the cheapest edge connecting the MST to a new vertex. Structure is very similar to Dijkstra's — push {weight, vertex} pairs and use a visited/inMST array.",
  },
  {
    id: 7,
    question: "What is the time complexity of Kruskal's algorithm?",
    options: [
      "O(V + E)",
      "O(E log E) — dominated by sorting edges",
      "O(V²)",
      "O(V × E)",
    ],
    correctIndex: 1,
    explanation:
      "Kruskal's: sort edges O(E log E), then iterate with Union-Find operations O(E × α(V)) ≈ O(E). Total: O(E log E). Since E ≤ V², log E ≤ 2 log V, so O(E log E) = O(E log V).",
  },
  {
    id: 8,
    question: "What is the time complexity of Prim's algorithm with a min-heap?",
    options: [
      "O(V²)",
      "O(E log V)",
      "O(V × E)",
      "O(E log E)",
    ],
    correctIndex: 1,
    explanation:
      "Prim's with binary heap: each vertex extracted once O(V log V), each edge may cause a push O(E log V). Total: O(E log V). With a simple array instead of heap: O(V²), better for dense graphs.",
  },
  {
    id: 9,
    question: "When should you use Kruskal's vs Prim's?",
    options: [
      "Always use Kruskal's",
      "Kruskal's for sparse graphs (E close to V). Prim's for dense graphs (E close to V²).",
      "They are identical",
      "Prim's is always faster",
    ],
    correctIndex: 1,
    explanation:
      "Kruskal's O(E log E) is better for sparse graphs. Prim's O(V²) with array is better for dense graphs. In practice, Kruskal's is often preferred in interviews because it's simpler to implement with Union-Find.",
  },
  {
    id: 10,
    question: "Can an MST exist for a disconnected graph?",
    options: [
      "Yes, it spans all vertices",
      "No — MST requires the graph to be connected. For disconnected graphs, you get a Minimum Spanning Forest.",
      "Only if it has 2 components",
      "Yes, with extra edges",
    ],
    correctIndex: 1,
    explanation:
      "MST requires connectivity — a spanning tree must reach all vertices. If the graph is disconnected, you can find an MST for each connected component, forming a Minimum Spanning Forest.",
  },
  {
    id: 11,
    question: "What is the 'Connecting Cities with Minimum Cost' problem?",
    options: [
      "Shortest path between cities",
      "Find the MST of the city graph — minimum total cost to connect all cities",
      "Count connected components",
      "Topological sort of cities",
    ],
    correctIndex: 1,
    explanation:
      "This is a direct MST problem. Cities are vertices, connections are weighted edges. Find the MST to connect all cities with minimum total cost. If the graph is disconnected (can't connect all), return -1.",
  },
  {
    id: 12,
    question: "In Kruskal's, what happens if you encounter an edge where both vertices are already in the same component?",
    options: [
      "Add it anyway",
      "Skip it — adding it would create a cycle",
      "Remove the heaviest edge in the component",
      "Start over",
    ],
    correctIndex: 1,
    explanation:
      "If find(u) == find(v), both vertices are already connected in the current MST. Adding this edge would create a cycle, violating the tree property. Skip it and move to the next edge.",
  },
];

export default function Lesson18MST({ onQuizComplete }) {
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
      {/* What is MST? */}
      <Section icon={BookOpen} title="What is a Minimum Spanning Tree?">
        <p className="text-foreground/80 leading-relaxed mb-4">
          A <strong>Minimum Spanning Tree (MST)</strong> of a connected, undirected, weighted graph
          is a subset of edges that connects <strong>all vertices</strong> with the <strong>minimum total
          weight</strong> and <strong>no cycles</strong>. It&apos;s a tree with V-1 edges.
        </p>

        <div className="bg-card rounded-xl border border-border p-5 my-4">
          <h4 className="font-semibold mb-3 text-accent-light">MST Visualization</h4>
          <div className="font-mono text-sm bg-code-bg rounded-lg p-4 overflow-x-auto">
            <p className="text-muted">{"// Original Graph:            MST (bold edges):"}</p>
            <p className="text-muted">{"//   0 --4-- 1 --8-- 2        0 --4-- 1       2"}</p>
            <p className="text-muted">{"//   |      /|       |        |       |       |"}</p>
            <p className="text-muted">{"//   8    11 7       2        8       7       2"}</p>
            <p className="text-muted">{"//   |  /    |       |        |       |       |"}</p>
            <p className="text-muted">{"//   3 --1-- 4 --4-- 5        3 --1-- 4 --4-- 5"}</p>
            <p className="text-foreground/90 mt-2">{"Edges in MST: (3,4,1), (0,1,4), (1,4,7), (4,5,4), (2,5,2), (0,3,8)"}</p>
            <p className="text-success">{"Total weight: 1 + 4 + 7 + 4 + 2 + 8 = 26"}</p>
            <p className="text-muted">{"V = 6, MST edges = 5 = V-1 ✓"}</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 my-4">
          <div className="p-4 bg-card rounded-lg border border-border">
            <h4 className="font-semibold text-sm mb-2 text-accent-light">MST Properties</h4>
            <ul className="text-xs text-foreground/80 space-y-1">
              <li>- Exactly V-1 edges</li>
              <li>- No cycles (it&apos;s a tree)</li>
              <li>- Connects all vertices</li>
              <li>- Minimum total edge weight</li>
              <li>- May not be unique (ties in weight)</li>
            </ul>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border">
            <h4 className="font-semibold text-sm mb-2 text-accent-light">Real-World Uses</h4>
            <ul className="text-xs text-foreground/80 space-y-1">
              <li>- Network design (cables, pipes, roads)</li>
              <li>- Cluster analysis</li>
              <li>- Image segmentation</li>
              <li>- Approximation algorithms (TSP)</li>
              <li>- Circuit design</li>
            </ul>
          </div>
        </div>

        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-card">
                <th className="text-left p-3 border-b border-border font-semibold">Algorithm</th>
                <th className="text-left p-3 border-b border-border font-semibold">Approach</th>
                <th className="text-left p-3 border-b border-border font-semibold">Key Structure</th>
                <th className="text-left p-3 border-b border-border font-semibold">Time</th>
              </tr>
            </thead>
            <tbody>
              {[
                { algo: "Kruskal's", approach: "Sort edges, add if no cycle", key: "Union-Find", time: "O(E log E)" },
                { algo: "Prim's", approach: "Grow from vertex, pick cheapest", key: "Min-Heap", time: "O(E log V)" },
                { algo: "Prim's (array)", approach: "Same, without heap", key: "Array", time: "O(V²)" },
              ].map((row) => (
                <tr key={row.algo} className="border-b border-border/50 hover:bg-card/50">
                  <td className="p-3 font-semibold text-accent-light">{row.algo}</td>
                  <td className="p-3 text-xs">{row.approach}</td>
                  <td className="p-3 text-xs">{row.key}</td>
                  <td className="p-3 font-mono text-xs text-success">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Kruskal's Algorithm */}
      <Section icon={Zap} title="Kruskal's Algorithm">
        <p className="text-foreground/80 leading-relaxed mb-4">
          Kruskal&apos;s is a <strong>greedy, edge-based</strong> approach: sort all edges by weight,
          then add edges one by one if they don&apos;t create a cycle. Uses <strong>Union-Find</strong> for
          efficient cycle detection.
        </p>

        <div className="bg-card rounded-xl border border-border p-5 my-4">
          <h4 className="font-semibold mb-3 text-accent-light">Kruskal&apos;s Step-by-Step</h4>
          <div className="font-mono text-xs bg-code-bg rounded-lg p-4 overflow-x-auto">
            <p className="text-muted">{"// Sorted edges: (3,4,1) (2,5,2) (0,1,4) (4,5,4) (0,3,8) (1,4,7) ..."}</p>
            <p className="text-foreground/90 mt-1">{"Add (3,4,1): 3 and 4 in diff sets → ADD ✓  MST cost=1"}</p>
            <p className="text-foreground/90">{"Add (2,5,2): 2 and 5 in diff sets → ADD ✓  MST cost=3"}</p>
            <p className="text-foreground/90">{"Add (0,1,4): 0 and 1 in diff sets → ADD ✓  MST cost=7"}</p>
            <p className="text-foreground/90">{"Add (4,5,4): 4 and 5 in diff sets → ADD ✓  MST cost=11"}</p>
            <p className="text-foreground/90">{"Add (0,3,8): 0 and 3 in diff sets → ADD ✓  MST cost=19"}</p>
            <p className="text-success">{"5 edges = V-1 → DONE! Total MST cost = 19"}</p>
          </div>
        </div>

        <CodeBlock
          title="Union-Find (Needed for Kruskal's)"
          code={`class UnionFind {
public:
    vector<int> parent, rank;
    int components;
    
    UnionFind(int n) : parent(n), rank(n, 0), components(n) {
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    
    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]);  // Path compression
        return parent[x];
    }
    
    bool unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;  // Already connected → would create cycle
        
        // Union by rank
        if (rank[px] < rank[py]) swap(px, py);
        parent[py] = px;
        if (rank[px] == rank[py]) rank[px]++;
        components--;
        return true;  // Successfully merged
    }
    
    bool connected(int x, int y) {
        return find(x) == find(y);
    }
};`}
        />

        <CodeBlock
          title="Kruskal's Algorithm — Standard Template"
          code={`int kruskal(int n, vector<vector<int>>& edges) {
    // edges[i] = {u, v, weight}
    
    // Step 1: Sort edges by weight
    sort(edges.begin(), edges.end(), [](auto& a, auto& b) {
        return a[2] < b[2];
    });
    
    // Step 2: Initialize Union-Find
    UnionFind uf(n);
    int mstCost = 0;
    int edgesUsed = 0;
    
    // Step 3: Iterate edges, add if no cycle
    for (auto& e : edges) {
        int u = e[0], v = e[1], w = e[2];
        
        if (uf.unite(u, v)) {       // Different components → add edge
            mstCost += w;
            edgesUsed++;
            if (edgesUsed == n - 1) break;  // MST complete
        }
        // If unite returns false → same component → skip (would create cycle)
    }
    
    // Check if MST spans all vertices
    return edgesUsed == n - 1 ? mstCost : -1;  // -1 if disconnected
}
// Time: O(E log E) for sorting + O(E × α(V)) for Union-Find ≈ O(E log E)
// Space: O(V) for Union-Find`}
        />

        <CodeBlock
          title="Connecting Cities With Minimum Cost"
          code={`// n cities, connections[i] = [city1, city2, cost]
// Return minimum cost to connect all cities, or -1 if impossible

int minimumCost(int n, vector<vector<int>>& connections) {
    sort(connections.begin(), connections.end(), [](auto& a, auto& b) {
        return a[2] < b[2];
    });
    
    UnionFind uf(n + 1);  // 1-indexed cities
    int totalCost = 0, edges = 0;
    
    for (auto& c : connections) {
        if (uf.unite(c[0], c[1])) {
            totalCost += c[2];
            edges++;
            if (edges == n - 1) return totalCost;
        }
    }
    
    return -1;  // Can't connect all cities
}`}
        />

        <KeyPoint>
          <strong>Kruskal&apos;s = sort edges + Union-Find.</strong> Three steps: (1) Sort edges by weight.
          (2) For each edge, if union succeeds (different components), add to MST. (3) Stop at V-1 edges.
        </KeyPoint>
      </Section>

      {/* Prim's Algorithm */}
      <Section icon={Zap} title="Prim's Algorithm">
        <p className="text-foreground/80 leading-relaxed mb-4">
          Prim&apos;s is a <strong>greedy, vertex-based</strong> approach: start from any vertex and
          always add the <strong>cheapest edge</strong> connecting the current MST to a new vertex.
          Structure is very similar to Dijkstra&apos;s.
        </p>

        <div className="bg-card rounded-xl border border-border p-5 my-4">
          <h4 className="font-semibold mb-3 text-accent-light">Prim&apos;s Step-by-Step</h4>
          <div className="font-mono text-xs bg-code-bg rounded-lg p-4 overflow-x-auto">
            <p className="text-muted">{"// Start from node 0"}</p>
            <p className="text-foreground/90">{"MST = {0}. Cheapest edge to new vertex: (0,1,4) → add 1"}</p>
            <p className="text-foreground/90">{"MST = {0,1}. Cheapest: (1,4,7) → add 4"}</p>
            <p className="text-foreground/90">{"MST = {0,1,4}. Cheapest: (3,4,1)... wait, 3 not in MST → add 3"}</p>
            <p className="text-foreground/90">{"MST = {0,1,3,4}. Cheapest: (4,5,4) → add 5"}</p>
            <p className="text-foreground/90">{"MST = {0,1,3,4,5}. Cheapest: (2,5,2) → add 2"}</p>
            <p className="text-success">{"MST = {0,1,2,3,4,5} — all vertices included!"}</p>
          </div>
        </div>

        <CodeBlock
          title="Prim's Algorithm — Min-Heap Template"
          code={`int prim(int n, vector<vector<pair<int,int>>>& adj) {
    // adj[u] = {{v, weight}, ...}
    vector<bool> inMST(n, false);
    
    // Min-heap: {weight, vertex}
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    
    pq.push({0, 0});  // Start from node 0 with cost 0
    int mstCost = 0;
    int edgesUsed = 0;
    
    while (!pq.empty() && edgesUsed < n) {
        auto [weight, u] = pq.top();
        pq.pop();
        
        if (inMST[u]) continue;  // Already in MST
        
        inMST[u] = true;
        mstCost += weight;
        edgesUsed++;
        
        // Push all edges to non-MST neighbors
        for (auto& [v, w] : adj[u]) {
            if (!inMST[v]) {
                pq.push({w, v});
            }
        }
    }
    
    return edgesUsed == n ? mstCost : -1;  // -1 if disconnected
}
// Time: O(E log V), Space: O(V + E)
// Very similar to Dijkstra's! Key difference:
// Dijkstra pushes {total_distance, v}
// Prim's pushes {edge_weight, v}`}
        />

        <Warning>
          <strong>Prim&apos;s vs Dijkstra&apos;s — subtle difference!</strong> Dijkstra pushes
          <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">{"{dist[u] + w, v}"}</code> (total path cost).
          Prim&apos;s pushes <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">{"{w, v}"}</code> (just edge weight).
          Dijkstra finds shortest paths. Prim&apos;s finds minimum spanning tree.
        </Warning>
      </Section>

      {/* Kruskal vs Prim */}
      <Section icon={Brain} title="Kruskal's vs Prim's — When to Use Which">
        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-card">
                <th className="text-left p-3 border-b border-border font-semibold">Aspect</th>
                <th className="text-left p-3 border-b border-border font-semibold">Kruskal&apos;s</th>
                <th className="text-left p-3 border-b border-border font-semibold">Prim&apos;s</th>
              </tr>
            </thead>
            <tbody>
              {[
                { aspect: "Approach", k: "Edge-based (global)", p: "Vertex-based (local growth)" },
                { aspect: "Key structure", k: "Union-Find", p: "Min-Heap" },
                { aspect: "Time", k: "O(E log E)", p: "O(E log V) with heap" },
                { aspect: "Best for", k: "Sparse graphs", p: "Dense graphs" },
                { aspect: "Input format", k: "Edge list (natural)", p: "Adjacency list (natural)" },
                { aspect: "Disconnected?", k: "Gives MST forest naturally", p: "Needs extra handling" },
                { aspect: "Interview preference", k: "More common (simpler code)", p: "Good if graph is dense" },
                { aspect: "Similar to", k: "Sorting + greedy", p: "Dijkstra's algorithm" },
              ].map((row) => (
                <tr key={row.aspect} className="border-b border-border/50 hover:bg-card/50">
                  <td className="p-3 font-semibold">{row.aspect}</td>
                  <td className="p-3 text-xs">{row.k}</td>
                  <td className="p-3 text-xs">{row.p}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <KeyPoint>
          <strong>Interview tip:</strong> Kruskal&apos;s is usually easier to implement and more common
          in interviews. If you know Union-Find, Kruskal&apos;s is just sort + iterate + union. Prim&apos;s
          is best when you already have an adjacency list and the graph is dense.
        </KeyPoint>
      </Section>

      {/* Classic Problems */}
      <Section icon={Brain} title="Classic MST Interview Problems">
        <CodeBlock
          title="Min Cost to Connect All Points (Kruskal's)"
          code={`// Given points on a 2D plane, connect all with minimum total
// Manhattan distance. This is MST on a complete graph!

int minCostConnectPoints(vector<vector<int>>& points) {
    int n = points.size();
    vector<vector<int>> edges;
    
    // Build all edges (complete graph)
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            int dist = abs(points[i][0] - points[j][0])
                     + abs(points[i][1] - points[j][1]);
            edges.push_back({dist, i, j});
        }
    }
    
    // Kruskal's
    sort(edges.begin(), edges.end());
    UnionFind uf(n);
    int cost = 0, used = 0;
    
    for (auto& e : edges) {
        if (uf.unite(e[1], e[2])) {
            cost += e[0];
            if (++used == n - 1) break;
        }
    }
    
    return cost;
}
// Time: O(N² log N) — N² edges in complete graph
// Prim's is also good here since the graph is dense`}
        />

        <CodeBlock
          title="Min Cost to Connect All Points (Prim's — Better for Dense)"
          code={`int minCostConnectPoints(vector<vector<int>>& points) {
    int n = points.size();
    vector<bool> inMST(n, false);
    // Min-heap: {cost, point_index}
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    
    pq.push({0, 0});
    int totalCost = 0, used = 0;
    
    while (used < n) {
        auto [cost, u] = pq.top();
        pq.pop();
        
        if (inMST[u]) continue;
        inMST[u] = true;
        totalCost += cost;
        used++;
        
        // Add edges to all non-MST points
        for (int v = 0; v < n; v++) {
            if (!inMST[v]) {
                int dist = abs(points[u][0] - points[v][0])
                         + abs(points[u][1] - points[v][1]);
                pq.push({dist, v});
            }
        }
    }
    
    return totalCost;
}
// For dense graphs (complete graph), Prim's avoids storing all N² edges`}
        />

        <CodeBlock
          title="MST with Constraints — Critical & Pseudo-Critical Edges"
          code={`// Determine which edges are critical (must be in every MST)
// and pseudo-critical (in at least one MST but not all)

// Approach:
// 1. Find baseline MST cost
// 2. For each edge:
//    a. Remove it and find MST — if cost increases → critical
//    b. Force include it first, then find MST — if cost == baseline → pseudo-critical

// This is an advanced problem combining MST with edge analysis
// Shows deep understanding of MST properties

// Key insight: An edge is critical if removing it disconnects the graph
// or increases MST cost. Pseudo-critical if it can be in some MST.`}
        />
      </Section>

      {/* C++ Syntax Reference */}
      <Section icon={Code2} title="C++ Syntax Reference">
        <CodeBlock
          title="MST — Complete Reference"
          code={`#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

// ========== Union-Find for Kruskal's ==========
class UF {
public:
    vector<int> p, r;
    UF(int n) : p(n), r(n, 0) {
        iota(p.begin(), p.end(), 0);  // p[i] = i
    }
    int find(int x) {
        return p[x] == x ? x : p[x] = find(p[x]);
    }
    bool unite(int x, int y) {
        x = find(x); y = find(y);
        if (x == y) return false;
        if (r[x] < r[y]) swap(x, y);
        p[y] = x;
        if (r[x] == r[y]) r[x]++;
        return true;
    }
};

// ========== Kruskal's Template ==========
// Input: edges = {{u, v, w}, ...}
int kruskal(int n, vector<vector<int>>& edges) {
    sort(edges.begin(), edges.end(),
         [](auto& a, auto& b) { return a[2] < b[2]; });
    UF uf(n);
    int cost = 0, cnt = 0;
    for (auto& e : edges) {
        if (uf.unite(e[0], e[1])) {
            cost += e[2];
            if (++cnt == n - 1) break;
        }
    }
    return cnt == n - 1 ? cost : -1;
}

// ========== Prim's Template ==========
// Input: adj[u] = {{v, w}, ...}
int prim(int n, vector<vector<pair<int,int>>>& adj) {
    vector<bool> vis(n, false);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    pq.push({0, 0});
    int cost = 0, cnt = 0;
    while (!pq.empty() && cnt < n) {
        auto [w, u] = pq.top(); pq.pop();
        if (vis[u]) continue;
        vis[u] = true;
        cost += w; cnt++;
        for (auto& [v, wt] : adj[u])
            if (!vis[v]) pq.push({wt, v});
    }
    return cnt == n ? cost : -1;
}

// ========== iota (initialize parent array) ==========
#include <numeric>
iota(parent.begin(), parent.end(), 0);  // parent = {0,1,2,...}`}
        />
      </Section>

      {/* Coding Challenges */}
      <Section icon={Code2} title="Coding Challenges">
        <CodingChallenge
          title="Challenge 1: Kruskal's MST"
          description="Given n nodes and a list of weighted edges, find the MST cost using Kruskal's algorithm. Return -1 if the graph is disconnected."
          starterCode={`int kruskal(int n, vector<vector<int>>& edges) {
    // edges[i] = {u, v, weight}
    // Sort edges by weight
    // Use Union-Find: add edge if it connects two different components

}`}
          solution={`int kruskal(int n, vector<vector<int>>& edges) {
    sort(edges.begin(), edges.end(),
         [](auto& a, auto& b) { return a[2] < b[2]; });
    
    UnionFind uf(n);
    int cost = 0, used = 0;
    
    for (auto& e : edges) {
        if (uf.unite(e[0], e[1])) {
            cost += e[2];
            if (++used == n - 1) break;
        }
    }
    
    return used == n - 1 ? cost : -1;
}`}
          hints={[
            "Sort edges by weight ascending.",
            "For each edge, try to unite the two vertices. If unite succeeds → add to MST.",
            "Stop when you have V-1 edges. If you run out of edges before V-1 → disconnected.",
          ]}
          testDescription="Sort + Union-Find greedy: always pick cheapest non-cycle edge."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("sort(") &&
              lower.includes("unite(") || lower.includes("union(") &&
              lower.includes("n-1")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 2: Prim's MST"
          description="Given an adjacency list for a weighted graph, find the MST cost using Prim's algorithm starting from node 0."
          starterCode={`int prim(int n, vector<vector<pair<int,int>>>& adj) {
    // adj[u] = {{v, weight}, ...}
    // Min-heap: {weight, vertex}
    // Grow MST from node 0

}`}
          solution={`int prim(int n, vector<vector<pair<int,int>>>& adj) {
    vector<bool> inMST(n, false);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    
    pq.push({0, 0});
    int cost = 0, used = 0;
    
    while (!pq.empty() && used < n) {
        auto [w, u] = pq.top();
        pq.pop();
        
        if (inMST[u]) continue;
        inMST[u] = true;
        cost += w;
        used++;
        
        for (auto& [v, wt] : adj[u]) {
            if (!inMST[v]) pq.push({wt, v});
        }
    }
    
    return used == n ? cost : -1;
}`}
          hints={[
            "Push {0, startNode} to begin. The 0 cost means adding the start node is free.",
            "Pop minimum weight edge. If vertex already in MST, skip.",
            "Mark vertex in MST, add weight to cost, push all edges to non-MST neighbors.",
          ]}
          testDescription="Greedy vertex growth with min-heap. Almost identical to Dijkstra's structure."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("priority_queue") &&
              lower.includes("greater<>") &&
              lower.includes("inmst") || lower.includes("visited") &&
              lower.includes("cost+=w")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 3: Min Cost to Connect All Points"
          description="Given points on a 2D plane, return the minimum cost to connect all points using Manhattan distance. Every pair of points can be connected."
          starterCode={`int minCostConnectPoints(vector<vector<int>>& points) {
    int n = points.size();
    // Build edges with Manhattan distance
    // Use Kruskal's or Prim's

}`}
          solution={`int minCostConnectPoints(vector<vector<int>>& points) {
    int n = points.size();
    vector<vector<int>> edges;
    
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            int dist = abs(points[i][0] - points[j][0])
                     + abs(points[i][1] - points[j][1]);
            edges.push_back({dist, i, j});
        }
    }
    
    sort(edges.begin(), edges.end());
    UnionFind uf(n);
    int cost = 0, used = 0;
    
    for (auto& e : edges) {
        if (uf.unite(e[1], e[2])) {
            cost += e[0];
            if (++used == n - 1) break;
        }
    }
    
    return cost;
}`}
          hints={[
            "Build all N*(N-1)/2 edges with Manhattan distance |x1-x2| + |y1-y2|.",
            "This is a complete graph — every point connects to every other point.",
            "Apply Kruskal's (sort + Union-Find) or Prim's to find MST.",
          ]}
          testDescription="Complete graph MST. Build all edges, sort, run Kruskal's. Prim's also works well for dense graphs."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("abs(") &&
              lower.includes("sort(") &&
              lower.includes("unite(") || lower.includes("union(")
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
              <span><strong>MST = V-1 edges, connects all vertices, minimum total weight, no cycles.</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Kruskal&apos;s:</strong> sort edges + Union-Find. O(E log E). Best for sparse graphs. More common in interviews.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Prim&apos;s:</strong> min-heap, grow from vertex. O(E log V). Similar to Dijkstra. Best for dense graphs.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Kruskal&apos;s key check:</strong> unite(u,v) returns false → same component → skip (cycle).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Prim&apos;s vs Dijkstra:</strong> Prim pushes edge weight. Dijkstra pushes total distance. Don&apos;t mix them up!</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>MST requires connected graph.</strong> If disconnected, you get a minimum spanning forest or return -1.</span>
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
