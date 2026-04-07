"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Route,
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
    question: "What problem does Dijkstra's algorithm solve?",
    options: [
      "Finding all paths in a graph",
      "Single-source shortest path in a graph with non-negative edge weights",
      "Detecting cycles",
      "Topological sorting",
    ],
    correctIndex: 1,
    explanation:
      "Dijkstra finds the shortest path from a single source to ALL other vertices in a graph with non-negative weights. It's the most important shortest path algorithm for interviews.",
  },
  {
    id: 2,
    question: "What data structure does Dijkstra's algorithm use?",
    options: [
      "Stack",
      "Queue",
      "Min-heap (priority queue)",
      "Hash set",
    ],
    correctIndex: 2,
    explanation:
      "Dijkstra uses a min-heap (priority_queue with greater<>) to always process the vertex with the smallest known distance next. This greedy approach guarantees correctness with non-negative weights.",
  },
  {
    id: 3,
    question: "What is the time complexity of Dijkstra's with a min-heap?",
    options: [
      "O(V²)",
      "O(V + E)",
      "O((V + E) log V)",
      "O(V × E)",
    ],
    correctIndex: 2,
    explanation:
      "With a binary min-heap: each vertex is extracted once O(V log V), and each edge may cause a push O(E log V). Total: O((V + E) log V). With a simple array instead of heap: O(V²), which is better for dense graphs.",
  },
  {
    id: 4,
    question: "Why can't Dijkstra's handle negative edge weights?",
    options: [
      "It can — there's no issue",
      "Because it greedily finalizes distances; a later negative edge could provide a shorter path to an already-finalized node",
      "Because the priority queue can't store negative values",
      "Because graphs can't have negative weights",
    ],
    correctIndex: 1,
    explanation:
      "Dijkstra marks a node as 'done' once it's popped from the min-heap. With negative edges, a shorter path via a negative edge might be discovered later — but Dijkstra already finalized that node. Use Bellman-Ford for negative weights.",
  },
  {
    id: 5,
    question: "What problem does Bellman-Ford solve that Dijkstra can't?",
    options: [
      "Shortest path in unweighted graphs",
      "Shortest path with negative edge weights, and detecting negative cycles",
      "All-pairs shortest path",
      "Finding MST",
    ],
    correctIndex: 1,
    explanation:
      "Bellman-Ford handles negative edge weights AND can detect negative-weight cycles (where shortest path is -∞). It relaxes all edges V-1 times. If any edge can still be relaxed after V-1 iterations, a negative cycle exists.",
  },
  {
    id: 6,
    question: "What is the time complexity of Bellman-Ford?",
    options: [
      "O(V + E)",
      "O(V × E)",
      "O(V² log V)",
      "O(E log E)",
    ],
    correctIndex: 1,
    explanation:
      "Bellman-Ford runs V-1 iterations, each relaxing all E edges. Total: O(V × E). This is slower than Dijkstra's O((V+E) log V), so use Dijkstra when there are no negative edges.",
  },
  {
    id: 7,
    question: "What does 'relaxation' mean in shortest path algorithms?",
    options: [
      "Removing edges from the graph",
      "Updating a node's distance if a shorter path is found through a neighbor",
      "Balancing the graph",
      "Sorting the edges",
    ],
    correctIndex: 1,
    explanation:
      "Relaxation: if dist[u] + weight(u,v) < dist[v], update dist[v]. This means we found a shorter path to v through u. Both Dijkstra and Bellman-Ford are based on edge relaxation.",
  },
  {
    id: 8,
    question: "In Dijkstra's, what should you do when you pop a node that's already been processed?",
    options: [
      "Process it again",
      "Skip it (continue) — it already has its shortest distance",
      "Remove it from the graph",
      "Push it back with a lower priority",
    ],
    correctIndex: 1,
    explanation:
      "Since we use a lazy deletion approach (push duplicates into the heap), we may pop a node that was already finalized. Simply skip it with 'if (d > dist[node]) continue;'. This avoids reprocessing.",
  },
  {
    id: 9,
    question: "When should you use BFS instead of Dijkstra's?",
    options: [
      "Never — Dijkstra is always better",
      "When all edge weights are equal (unweighted graph) — BFS is O(V+E) vs Dijkstra's O((V+E) log V)",
      "When the graph has negative edges",
      "When the graph is disconnected",
    ],
    correctIndex: 1,
    explanation:
      "For unweighted graphs (all edges weight 1), BFS gives shortest path in O(V+E) — faster and simpler than Dijkstra. Only use Dijkstra when edges have different positive weights.",
  },
  {
    id: 10,
    question: "What is the 0-1 BFS technique?",
    options: [
      "BFS on binary trees",
      "BFS using a deque for graphs where edge weights are only 0 or 1",
      "BFS that runs in O(1)",
      "BFS with two queues",
    ],
    correctIndex: 1,
    explanation:
      "0-1 BFS: when edges have weights 0 or 1, use a deque. Push weight-0 edges to front, weight-1 edges to back. This gives O(V+E) shortest path — faster than Dijkstra for this special case.",
  },
  {
    id: 11,
    question: "How do you reconstruct the actual shortest path (not just the distance)?",
    options: [
      "Run BFS backwards",
      "Store a parent/predecessor array during relaxation, then trace back from destination to source",
      "Sort all paths",
      "Use DFS instead",
    ],
    correctIndex: 1,
    explanation:
      "During relaxation, when you update dist[v], also set parent[v] = u. After Dijkstra/BFS finishes, trace the path: dest → parent[dest] → parent[parent[dest]] → ... → source. Reverse this for the actual path.",
  },
  {
    id: 12,
    question: "What is the 'Network Delay Time' problem really asking?",
    options: [
      "Find the MST",
      "Run Dijkstra from source, return the maximum distance to any reachable node (or -1 if not all reachable)",
      "Count connected components",
      "Detect negative cycles",
    ],
    correctIndex: 1,
    explanation:
      "Network Delay Time: Dijkstra from the source. The answer is max(dist[i]) for all nodes — the time it takes for the signal to reach the farthest node. If any node is unreachable (dist = ∞), return -1.",
  },
];

export default function Lesson16ShortestPath({ onQuizComplete }) {
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
      {/* Overview */}
      <Section icon={BookOpen} title="Shortest Path — The Big Picture">
        <p className="text-foreground/80 leading-relaxed mb-4">
          Given a weighted graph, find the path with minimum total weight between two vertices.
          This is one of the most important graph problems — used in GPS navigation, network routing,
          game AI, and countless interview questions.
        </p>

        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-card">
                <th className="text-left p-3 border-b border-border font-semibold">Algorithm</th>
                <th className="text-left p-3 border-b border-border font-semibold">When to Use</th>
                <th className="text-left p-3 border-b border-border font-semibold">Time</th>
                <th className="text-left p-3 border-b border-border font-semibold">Neg. Weights?</th>
              </tr>
            </thead>
            <tbody>
              {[
                { algo: "BFS", when: "Unweighted graph", time: "O(V + E)", neg: "N/A" },
                { algo: "Dijkstra", when: "Non-negative weights", time: "O((V+E) log V)", neg: "No ✗" },
                { algo: "Bellman-Ford", when: "Negative weights, detect neg. cycles", time: "O(V × E)", neg: "Yes ✓" },
                { algo: "0-1 BFS", when: "Weights are only 0 or 1", time: "O(V + E)", neg: "No ✗" },
                { algo: "Floyd-Warshall", when: "All-pairs shortest path", time: "O(V³)", neg: "Yes ✓" },
              ].map((row) => (
                <tr key={row.algo} className="border-b border-border/50 hover:bg-card/50">
                  <td className="p-3 font-semibold text-accent-light">{row.algo}</td>
                  <td className="p-3 text-xs">{row.when}</td>
                  <td className="p-3 font-mono text-xs text-success">{row.time}</td>
                  <td className="p-3 text-xs">{row.neg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <KeyPoint>
          <strong>Decision tree:</strong> Unweighted? → BFS. Non-negative weights? → Dijkstra.
          Negative weights? → Bellman-Ford. Weights 0 or 1? → 0-1 BFS. All pairs? → Floyd-Warshall.
        </KeyPoint>
      </Section>

      {/* Dijkstra's Algorithm */}
      <Section icon={Zap} title="Dijkstra's Algorithm">
        <p className="text-foreground/80 leading-relaxed mb-4">
          Dijkstra&apos;s is a <strong>greedy algorithm</strong>: always process the unfinalized vertex
          with the smallest known distance. Uses a <strong>min-heap</strong> for efficiency.
        </p>

        <div className="bg-card rounded-xl border border-border p-5 my-4">
          <h4 className="font-semibold mb-3 text-accent-light">Dijkstra Step-by-Step</h4>
          <div className="font-mono text-xs bg-code-bg rounded-lg p-4 overflow-x-auto">
            <p className="text-muted">{"// Graph: 0 --5-- 1 --2-- 3"}</p>
            <p className="text-muted">{"//        |       |"}</p>
            <p className="text-muted">{"//        10      1"}</p>
            <p className="text-muted">{"//        |       |"}</p>
            <p className="text-muted">{"//        2 --3-- (1)"}</p>
            <p className="text-foreground/90 mt-2">{"Start from 0:"}</p>
            <p className="text-foreground/90">{"dist = [0, ∞, ∞, ∞]"}</p>
            <p className="text-foreground/90">{"Pop (0, node 0): relax → dist = [0, 5, 10, ∞]"}</p>
            <p className="text-foreground/90">{"Pop (5, node 1): relax → dist = [0, 5, 8, 7]"}</p>
            <p className="text-foreground/90">{"Pop (7, node 3): relax → nothing new"}</p>
            <p className="text-foreground/90">{"Pop (8, node 2): relax → nothing new"}</p>
            <p className="text-success mt-1">{"Final: dist = [0, 5, 8, 7]"}</p>
          </div>
        </div>

        <CodeBlock
          title="Dijkstra's Algorithm — Standard Template"
          code={`vector<int> dijkstra(vector<vector<pair<int,int>>>& adj, int src) {
    int n = adj.size();
    vector<int> dist(n, INT_MAX);
    
    // Min-heap: {distance, node}
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    
    dist[src] = 0;
    pq.push({0, src});
    
    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        
        // Skip if already processed with shorter distance
        if (d > dist[u]) continue;
        
        // Relax neighbors
        for (auto& [v, weight] : adj[u]) {
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
    
    return dist;  // dist[i] = shortest distance from src to i
}

// Usage:
int n = 4;
vector<vector<pair<int,int>>> adj(n);
adj[0].push_back({1, 5});
adj[0].push_back({2, 10});
adj[1].push_back({2, 3});
adj[1].push_back({3, 2});
// ... add reverse edges if undirected

vector<int> dist = dijkstra(adj, 0);
// dist[3] = shortest distance from 0 to 3`}
        />

        <CodeBlock
          title="Dijkstra with Path Reconstruction"
          code={`pair<vector<int>, vector<int>> dijkstraWithPath(
    vector<vector<pair<int,int>>>& adj, int src) {
    
    int n = adj.size();
    vector<int> dist(n, INT_MAX);
    vector<int> parent(n, -1);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    
    dist[src] = 0;
    pq.push({0, src});
    
    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        if (d > dist[u]) continue;
        
        for (auto& [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                parent[v] = u;          // Track predecessor
                pq.push({dist[v], v});
            }
        }
    }
    
    return {dist, parent};
}

// Reconstruct path from src to dest:
vector<int> getPath(vector<int>& parent, int dest) {
    vector<int> path;
    for (int v = dest; v != -1; v = parent[v]) {
        path.push_back(v);
    }
    reverse(path.begin(), path.end());
    return path;
}`}
        />

        <CodeBlock
          title="Network Delay Time — Classic Dijkstra Problem"
          code={`// N nodes, edges [u, v, time]. Signal starts at node k.
// Return time for all nodes to receive signal, or -1.

int networkDelayTime(vector<vector<int>>& times, int n, int k) {
    vector<vector<pair<int,int>>> adj(n + 1);  // 1-indexed
    for (auto& t : times) {
        adj[t[0]].push_back({t[1], t[2]});
    }
    
    vector<int> dist(n + 1, INT_MAX);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    
    dist[k] = 0;
    pq.push({0, k});
    
    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        if (d > dist[u]) continue;
        
        for (auto& [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    
    int maxDist = *max_element(dist.begin() + 1, dist.end());
    return maxDist == INT_MAX ? -1 : maxDist;
}
// Time: O((V + E) log V)`}
        />

        <Warning>
          <strong>Common Dijkstra bugs:</strong> (1) Forgetting the <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">if (d &gt; dist[u]) continue;</code> check
          — causes TLE. (2) Using max-heap instead of min-heap — use <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">greater&lt;&gt;</code>.
          (3) Not initializing dist to INT_MAX. (4) Using Dijkstra with negative weights — wrong answers!
        </Warning>
      </Section>

      {/* Bellman-Ford */}
      <Section icon={Brain} title="Bellman-Ford Algorithm">
        <p className="text-foreground/80 leading-relaxed mb-4">
          Bellman-Ford handles <strong>negative edge weights</strong> and can <strong>detect negative cycles</strong>.
          It relaxes all edges V-1 times. Simpler but slower than Dijkstra.
        </p>

        <CodeBlock
          title="Bellman-Ford — Standard Template"
          code={`vector<int> bellmanFord(int n, vector<vector<int>>& edges, int src) {
    // edges[i] = {u, v, weight}
    vector<int> dist(n, INT_MAX);
    dist[src] = 0;
    
    // Relax all edges V-1 times
    for (int i = 0; i < n - 1; i++) {
        for (auto& e : edges) {
            int u = e[0], v = e[1], w = e[2];
            if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }
    
    // V-th iteration: check for negative cycles
    for (auto& e : edges) {
        int u = e[0], v = e[1], w = e[2];
        if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
            // Negative cycle detected!
            return {};  // Or handle accordingly
        }
    }
    
    return dist;
}
// Time: O(V × E)
// Space: O(V)

// Why V-1 iterations?
// Shortest path has at most V-1 edges (no cycles).
// Each iteration guarantees one more edge of the shortest path is correct.
// After V-1 iterations, all shortest paths are found.`}
        />

        <CodeBlock
          title="Cheapest Flights Within K Stops — Modified Bellman-Ford"
          code={`// Find cheapest price from src to dst with at most k stops
// = shortest path with at most k+1 edges

int findCheapestPrice(int n, vector<vector<int>>& flights,
                       int src, int dst, int k) {
    vector<int> dist(n, INT_MAX);
    dist[src] = 0;
    
    // At most k+1 relaxation rounds (k stops = k+1 edges)
    for (int i = 0; i <= k; i++) {
        vector<int> temp = dist;  // Copy! Prevent chain relaxation
        
        for (auto& f : flights) {
            int u = f[0], v = f[1], w = f[2];
            if (dist[u] != INT_MAX && dist[u] + w < temp[v]) {
                temp[v] = dist[u] + w;
            }
        }
        dist = temp;
    }
    
    return dist[dst] == INT_MAX ? -1 : dist[dst];
}
// Key: use temp copy to prevent processing more than one edge per round
// This limits the path to at most k+1 edges`}
        />
      </Section>

      {/* 0-1 BFS */}
      <Section icon={Zap} title="0-1 BFS — Special Case Optimization">
        <CodeBlock
          title="0-1 BFS — Using Deque"
          code={`// When edge weights are only 0 or 1, use a deque for O(V + E)
// Push weight-0 edges to FRONT, weight-1 edges to BACK

vector<int> bfs01(vector<vector<pair<int,int>>>& adj, int src) {
    int n = adj.size();
    vector<int> dist(n, INT_MAX);
    deque<int> dq;
    
    dist[src] = 0;
    dq.push_front(src);
    
    while (!dq.empty()) {
        int u = dq.front();
        dq.pop_front();
        
        for (auto& [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                if (w == 0) dq.push_front(v);  // Weight 0 → front
                else dq.push_back(v);           // Weight 1 → back
            }
        }
    }
    
    return dist;
}
// Time: O(V + E) — same as BFS!
// Use when: edges are 0 or 1 (or can be modeled as such)
// Example: minimum flips in a grid, shortest path with obstacles`}
        />
      </Section>

      {/* Comparison */}
      <Section icon={Brain} title="Algorithm Comparison — Which to Use?">
        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-card">
                <th className="text-left p-3 border-b border-border font-semibold">Scenario</th>
                <th className="text-left p-3 border-b border-border font-semibold">Best Algorithm</th>
                <th className="text-left p-3 border-b border-border font-semibold">Why</th>
              </tr>
            </thead>
            <tbody>
              {[
                { s: "Unweighted graph", algo: "BFS", why: "O(V+E), simplest" },
                { s: "Positive weights", algo: "Dijkstra", why: "O((V+E) log V), fastest" },
                { s: "Negative weights", algo: "Bellman-Ford", why: "Handles negatives, O(V×E)" },
                { s: "Detect negative cycle", algo: "Bellman-Ford", why: "V-th iteration check" },
                { s: "Weights 0 or 1", algo: "0-1 BFS", why: "O(V+E) with deque" },
                { s: "At most K edges", algo: "Modified Bellman-Ford", why: "K+1 iterations with copy" },
                { s: "All pairs", algo: "Floyd-Warshall", why: "O(V³), simple 3 nested loops" },
                { s: "Dense graph, + weights", algo: "Dijkstra (array)", why: "O(V²) without heap" },
              ].map((row) => (
                <tr key={row.s} className="border-b border-border/50 hover:bg-card/50">
                  <td className="p-3 font-semibold">{row.s}</td>
                  <td className="p-3 text-accent-light font-semibold text-xs">{row.algo}</td>
                  <td className="p-3 text-xs text-muted">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* C++ Syntax Reference */}
      <Section icon={Code2} title="C++ Syntax Reference">
        <CodeBlock
          title="Shortest Path — Complete Reference"
          code={`#include <vector>
#include <queue>
#include <deque>
#include <climits>
using namespace std;

// ========== Dijkstra Template ==========
// Graph: vector<vector<pair<int,int>>> adj(n);  // {neighbor, weight}
// Min-heap: priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>>

vector<int> dijkstra(vector<vector<pair<int,int>>>& adj, int src) {
    int n = adj.size();
    vector<int> dist(n, INT_MAX);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    dist[src] = 0;
    pq.push({0, src});
    
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;           // Skip stale entries
        for (auto& [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});        // Lazy push (may have dupes)
            }
        }
    }
    return dist;
}

// ========== Bellman-Ford Template ==========
// Edges: vector<vector<int>> edges;  // {u, v, weight}
vector<int> bellmanFord(int n, vector<vector<int>>& edges, int src) {
    vector<int> dist(n, INT_MAX);
    dist[src] = 0;
    for (int i = 0; i < n - 1; i++) {
        for (auto& e : edges) {
            if (dist[e[0]] != INT_MAX && dist[e[0]] + e[2] < dist[e[1]])
                dist[e[1]] = dist[e[0]] + e[2];
        }
    }
    // Negative cycle check: one more iteration
    return dist;
}

// ========== 0-1 BFS Template ==========
// Deque: push_front for weight 0, push_back for weight 1
vector<int> bfs01(vector<vector<pair<int,int>>>& adj, int src) {
    int n = adj.size();
    vector<int> dist(n, INT_MAX);
    deque<int> dq;
    dist[src] = 0;
    dq.push_front(src);
    while (!dq.empty()) {
        int u = dq.front(); dq.pop_front();
        for (auto& [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                w == 0 ? dq.push_front(v) : dq.push_back(v);
            }
        }
    }
    return dist;
}

// ========== Path Reconstruction ==========
vector<int> parent(n, -1);
// During relaxation: parent[v] = u;
// Trace: for (int v = dest; v != -1; v = parent[v]) path.push_back(v);
// reverse(path.begin(), path.end());`}
        />
      </Section>

      {/* Coding Challenges */}
      <Section icon={Code2} title="Coding Challenges">
        <CodingChallenge
          title="Challenge 1: Dijkstra's Shortest Path"
          description="Implement Dijkstra's algorithm. Given a weighted adjacency list and a source, return shortest distances to all nodes."
          starterCode={`vector<int> dijkstra(vector<vector<pair<int,int>>>& adj, int src) {
    int n = adj.size();
    // Initialize dist array to INT_MAX
    // Use min-heap {distance, node}
    // Process: pop min, skip if stale, relax neighbors

}`}
          solution={`vector<int> dijkstra(vector<vector<pair<int,int>>>& adj, int src) {
    int n = adj.size();
    vector<int> dist(n, INT_MAX);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    
    dist[src] = 0;
    pq.push({0, src});
    
    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        if (d > dist[u]) continue;
        
        for (auto& [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`}
          hints={[
            "Use priority_queue with greater<> for min-heap.",
            "Always check if (d > dist[u]) continue; to skip stale entries.",
            "Relaxation: if dist[u] + w < dist[v], update and push.",
          ]}
          testDescription="Min-heap greedy approach: always process closest unfinalized node."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("priority_queue") &&
              lower.includes("greater<>") &&
              lower.includes("dist[u]+w<dist[v]") &&
              lower.includes("pq.push")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 2: Bellman-Ford with Negative Cycle Detection"
          description="Implement Bellman-Ford. Return shortest distances, or an empty vector if a negative cycle exists."
          starterCode={`vector<int> bellmanFord(int n, vector<vector<int>>& edges, int src) {
    // edges[i] = {u, v, weight}
    // V-1 relaxation rounds
    // V-th round: check for negative cycle

}`}
          solution={`vector<int> bellmanFord(int n, vector<vector<int>>& edges, int src) {
    vector<int> dist(n, INT_MAX);
    dist[src] = 0;
    
    for (int i = 0; i < n - 1; i++) {
        for (auto& e : edges) {
            int u = e[0], v = e[1], w = e[2];
            if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }
    
    for (auto& e : edges) {
        int u = e[0], v = e[1], w = e[2];
        if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
            return {};  // Negative cycle!
        }
    }
    
    return dist;
}`}
          hints={[
            "Outer loop: V-1 iterations. Inner loop: relax all edges.",
            "Check dist[u] != INT_MAX before relaxing to avoid overflow.",
            "After V-1 rounds, one more pass: if any edge can still relax → negative cycle.",
          ]}
          testDescription="V-1 rounds guarantee correctness. V-th round detects negative cycles."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("n-1") &&
              lower.includes("dist[u]+w<dist[v]") &&
              lower.includes("return{}")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 3: Shortest Path with At Most K Stops"
          description="Find the cheapest flight from src to dst with at most k stops. Use modified Bellman-Ford with a temp copy to limit edges."
          starterCode={`int findCheapestPrice(int n, vector<vector<int>>& flights,
                       int src, int dst, int k) {
    // k stops = k+1 edges
    // Bellman-Ford with temp copy to prevent chain relaxation

}`}
          solution={`int findCheapestPrice(int n, vector<vector<int>>& flights,
                       int src, int dst, int k) {
    vector<int> dist(n, INT_MAX);
    dist[src] = 0;
    
    for (int i = 0; i <= k; i++) {
        vector<int> temp = dist;
        for (auto& f : flights) {
            int u = f[0], v = f[1], w = f[2];
            if (dist[u] != INT_MAX && dist[u] + w < temp[v]) {
                temp[v] = dist[u] + w;
            }
        }
        dist = temp;
    }
    
    return dist[dst] == INT_MAX ? -1 : dist[dst];
}`}
          hints={[
            "Run k+1 iterations (k stops = k+1 edges max).",
            "Use a temp copy of dist each round to prevent relaxing more than one edge per iteration.",
            "Read from dist (previous round), write to temp (current round).",
          ]}
          testDescription="Temp copy prevents chain relaxation — each round adds at most one edge to the path."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("temp=dist") || lower.includes("temp(dist)") &&
              lower.includes("k+1") || lower.includes("<=k") &&
              lower.includes("dist[dst]")
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
              <span><strong>Dijkstra: greedy + min-heap.</strong> O((V+E) log V). Non-negative weights only. Most common in interviews.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Bellman-Ford: V-1 relaxation rounds.</strong> O(V×E). Handles negative weights. Detects negative cycles on V-th round.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>0-1 BFS: deque trick.</strong> O(V+E) when weights are only 0 or 1. Push 0-weight to front, 1-weight to back.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Path reconstruction:</strong> store parent[v] = u during relaxation. Trace back from destination.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Dijkstra skip check:</strong> <code className="px-1 bg-code-bg rounded text-xs">if (d &gt; dist[u]) continue;</code> — critical for correctness and performance.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>K-stop limit:</strong> modified Bellman-Ford with temp copy prevents chain relaxation.</span>
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
