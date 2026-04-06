"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Share2,
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
    question: "What is a graph?",
    options: [
      "A type of chart for data visualization",
      "A collection of nodes (vertices) connected by edges",
      "A sorted data structure",
      "A type of binary tree",
    ],
    correctIndex: 1,
    explanation:
      "A graph G = (V, E) consists of vertices (nodes) and edges (connections between nodes). Unlike trees, graphs can have cycles, multiple paths between nodes, and nodes with any number of connections.",
  },
  {
    id: 2,
    question: "What is the difference between directed and undirected graphs?",
    options: [
      "Directed graphs have more nodes",
      "In directed graphs, edges have a direction (A→B ≠ B→A). In undirected, edges go both ways.",
      "Undirected graphs cannot have cycles",
      "Directed graphs are always trees",
    ],
    correctIndex: 1,
    explanation:
      "Directed: edge A→B means you can go from A to B but not necessarily B to A (like one-way streets). Undirected: edge {A,B} means you can go both ways (like two-way streets). Twitter follows = directed, Facebook friends = undirected.",
  },
  {
    id: 3,
    question: "What is the difference between an adjacency list and an adjacency matrix?",
    options: [
      "They represent different types of graphs",
      "Adjacency list: each node stores its neighbors. Matrix: 2D grid where matrix[i][j]=1 if edge exists.",
      "Adjacency matrix is always faster",
      "Adjacency list can't represent weighted graphs",
    ],
    correctIndex: 1,
    explanation:
      "Adjacency list: vector<vector<int>> — each node has a list of neighbors. Space: O(V + E). Adjacency matrix: 2D array — matrix[i][j] = 1 if edge exists. Space: O(V²). List is better for sparse graphs, matrix for dense.",
  },
  {
    id: 4,
    question: "What is a weighted graph?",
    options: [
      "A graph where all nodes have the same number of edges",
      "A graph where edges have associated costs/distances",
      "A graph with more than 100 nodes",
      "A graph stored as a matrix",
    ],
    correctIndex: 1,
    explanation:
      "In a weighted graph, each edge has a numeric weight (cost, distance, time, etc.). Example: road network where edges = roads and weights = distances. Unweighted graphs treat all edges as having weight 1.",
  },
  {
    id: 5,
    question: "What is the degree of a vertex?",
    options: [
      "The number of paths to the root",
      "The number of edges connected to it",
      "The distance to the farthest node",
      "The vertex's value",
    ],
    correctIndex: 1,
    explanation:
      "Degree = number of edges connected to a vertex. In directed graphs: in-degree = incoming edges, out-degree = outgoing edges. The sum of all degrees = 2 × |E| (each edge contributes to two vertices' degrees).",
  },
  {
    id: 6,
    question: "What is a cycle in a graph?",
    options: [
      "A node with no edges",
      "A path that starts and ends at the same vertex without repeating edges",
      "An edge that connects a node to itself",
      "A graph with an even number of nodes",
    ],
    correctIndex: 1,
    explanation:
      "A cycle is a path where you start at a vertex and can follow edges back to the same vertex. A self-loop (edge from a node to itself) is the simplest cycle. Trees are acyclic graphs (no cycles).",
  },
  {
    id: 7,
    question: "What is a connected graph?",
    options: [
      "A graph where every node has at least one edge",
      "A graph where there is a path between every pair of vertices",
      "A graph with no cycles",
      "A graph stored as an adjacency list",
    ],
    correctIndex: 1,
    explanation:
      "Connected (undirected): there exists a path between every pair of vertices. If not connected, it has multiple 'connected components'. For directed graphs, 'strongly connected' means every vertex can reach every other vertex.",
  },
  {
    id: 8,
    question: "When should you use an adjacency list over an adjacency matrix?",
    options: [
      "Always",
      "When the graph is sparse (few edges relative to vertices)",
      "When you need O(1) edge lookup",
      "When the graph is complete",
    ],
    correctIndex: 1,
    explanation:
      "Adjacency list: O(V + E) space. Best for sparse graphs where E << V². Most real-world graphs are sparse. Adjacency matrix: O(V²) space. Best for dense graphs or when you need O(1) edge existence checks.",
  },
  {
    id: 9,
    question: "What is a DAG?",
    options: [
      "A Directed Acyclic Graph — directed graph with no cycles",
      "A Dynamic Array Graph",
      "A Double Adjacency Graph",
      "A Dense Adjacency Grid",
    ],
    correctIndex: 0,
    explanation:
      "DAG = Directed Acyclic Graph. It has directed edges but no cycles. DAGs are crucial for: topological sorting, scheduling, dependency resolution (build systems, course prerequisites), and dynamic programming on graphs.",
  },
  {
    id: 10,
    question: "How do you represent a weighted graph using an adjacency list?",
    options: [
      "Store only node IDs",
      "Store pairs of (neighbor, weight) for each node",
      "Use a separate weight array",
      "Weighted graphs can only use matrices",
    ],
    correctIndex: 1,
    explanation:
      "Use vector<vector<pair<int,int>>> where each entry is {neighbor, weight}. For node u, adj[u] contains pairs like {v, w} meaning there's an edge from u to v with weight w.",
  },
  {
    id: 11,
    question: "What is the time complexity of checking if an edge exists between u and v?",
    options: [
      "Adjacency list: O(degree(u)), Matrix: O(1)",
      "Both O(1)",
      "Both O(V)",
      "List: O(1), Matrix: O(V)",
    ],
    correctIndex: 0,
    explanation:
      "Adjacency matrix: matrix[u][v] — direct array access = O(1). Adjacency list: search through u's neighbor list = O(degree(u)). This is the main trade-off. For sparse graphs, the list's space savings usually win.",
  },
  {
    id: 12,
    question: "What is a bipartite graph?",
    options: [
      "A graph with exactly two nodes",
      "A graph whose vertices can be divided into two sets where every edge connects vertices from different sets",
      "A graph with two connected components",
      "A graph with even number of edges",
    ],
    correctIndex: 1,
    explanation:
      "Bipartite: vertices split into two groups, edges only between groups (never within). Think: students and courses, workers and jobs. You can check bipartiteness with BFS/DFS coloring — if you can 2-color the graph, it's bipartite.",
  },
];

export default function Lesson14GraphFundamentals({ onQuizComplete }) {
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
      {/* What is a Graph? */}
      <Section icon={BookOpen} title="What is a Graph?">
        <p className="text-foreground/80 leading-relaxed mb-4">
          A <strong>graph</strong> G = (V, E) is a collection of <strong>vertices</strong> (nodes) and
          <strong> edges</strong> (connections). Graphs model relationships: social networks, maps, web pages,
          dependencies, and countless interview problems.
        </p>

        <div className="bg-card rounded-xl border border-border p-5 my-4">
          <h4 className="font-semibold mb-3 text-accent-light">Graph Visualization</h4>
          <div className="font-mono text-sm bg-code-bg rounded-lg p-4 overflow-x-auto">
            <p className="text-muted">{"// Undirected Graph:"}</p>
            <p className="text-foreground/90">{"  0 --- 1"}</p>
            <p className="text-foreground/90">{"  |   / |"}</p>
            <p className="text-foreground/90">{"  |  /  |"}</p>
            <p className="text-foreground/90">{"  | /   |"}</p>
            <p className="text-foreground/90">{"  2 --- 3"}</p>
            <p className="text-muted mt-2">{"V = {0, 1, 2, 3}"}</p>
            <p className="text-muted">{"E = {(0,1), (0,2), (1,2), (1,3), (2,3)}"}</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 my-4">
          <div className="p-4 bg-card rounded-lg border border-border">
            <h4 className="font-semibold text-sm mb-2 text-accent-light">Directed Graph</h4>
            <div className="font-mono text-xs bg-code-bg rounded p-3">
              <p>{"A → B → C"}</p>
              <p>{"↓       ↑"}</p>
              <p>{"D ------+"}</p>
            </div>
            <p className="text-xs text-muted mt-2">Edges have direction. A→B doesn&apos;t mean B→A.</p>
            <p className="text-xs text-muted">Examples: Twitter follows, web links, dependencies.</p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border">
            <h4 className="font-semibold text-sm mb-2 text-success">Undirected Graph</h4>
            <div className="font-mono text-xs bg-code-bg rounded p-3">
              <p>{"A --- B --- C"}</p>
              <p>{"|         |"}</p>
              <p>{"D --------+"}</p>
            </div>
            <p className="text-xs text-muted mt-2">Edges go both ways. A—B means B—A too.</p>
            <p className="text-xs text-muted">Examples: Facebook friends, roads, LAN connections.</p>
          </div>
        </div>

        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-card">
                <th className="text-left p-3 border-b border-border font-semibold">Term</th>
                <th className="text-left p-3 border-b border-border font-semibold">Definition</th>
              </tr>
            </thead>
            <tbody>
              {[
                { term: "Vertex (Node)", def: "A point in the graph" },
                { term: "Edge", def: "A connection between two vertices" },
                { term: "Degree", def: "Number of edges connected to a vertex" },
                { term: "Path", def: "Sequence of vertices connected by edges" },
                { term: "Cycle", def: "Path that starts and ends at the same vertex" },
                { term: "Connected", def: "Path exists between every pair of vertices" },
                { term: "DAG", def: "Directed Acyclic Graph — directed, no cycles" },
                { term: "Weighted", def: "Edges have associated costs/distances" },
                { term: "Sparse", def: "Few edges: E << V². Use adjacency list." },
                { term: "Dense", def: "Many edges: E ≈ V². Use adjacency matrix." },
              ].map((row) => (
                <tr key={row.term} className="border-b border-border/50 hover:bg-card/50">
                  <td className="p-3 font-semibold text-accent-light">{row.term}</td>
                  <td className="p-3 text-xs">{row.def}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Graph Representations */}
      <Section icon={Code2} title="Graph Representations">
        <h3 className="text-lg font-semibold mt-2 mb-3 text-accent-light">1. Adjacency List (Most Common)</h3>
        <CodeBlock
          title="Adjacency List — O(V + E) Space"
          code={`// Unweighted, undirected graph
//  0 --- 1
//  |   / |
//  2 --- 3

// Method 1: vector<vector<int>> — most common
int n = 4;
vector<vector<int>> adj(n);

// Add edges (undirected = add both directions)
adj[0].push_back(1);  adj[1].push_back(0);
adj[0].push_back(2);  adj[2].push_back(0);
adj[1].push_back(2);  adj[2].push_back(1);
adj[1].push_back(3);  adj[3].push_back(1);
adj[2].push_back(3);  adj[3].push_back(2);

// adj[0] = {1, 2}     — node 0's neighbors
// adj[1] = {0, 2, 3}  — node 1's neighbors
// adj[2] = {0, 1, 3}
// adj[3] = {1, 2}

// Method 2: unordered_map<int, vector<int>> — for non-contiguous IDs
unordered_map<int, vector<int>> graph;
graph[100].push_back(200);
graph[200].push_back(100);`}
        />

        <CodeBlock
          title="Adjacency List — Weighted Graph"
          code={`// Weighted graph: store {neighbor, weight}
vector<vector<pair<int,int>>> adj(n);

// Edge from 0 to 1 with weight 5
adj[0].push_back({1, 5});
adj[1].push_back({0, 5});  // Undirected

// Edge from 1 to 3 with weight 2
adj[1].push_back({3, 2});
adj[3].push_back({1, 2});

// Iterate neighbors of node 0:
for (auto& [neighbor, weight] : adj[0]) {
    cout << "Edge to " << neighbor << " with weight " << weight << endl;
}

// For directed graphs: only add one direction
// adj[u].push_back({v, w}); — edge from u to v`}
        />

        <CodeBlock
          title="Building Graph from Edge List (Common in Problems)"
          code={`// Many problems give edges as: [[0,1], [1,2], [2,3]]
// Convert to adjacency list:

vector<vector<int>> buildGraph(int n, vector<vector<int>>& edges) {
    vector<vector<int>> adj(n);
    for (auto& edge : edges) {
        adj[edge[0]].push_back(edge[1]);
        adj[edge[1]].push_back(edge[0]);  // Remove for directed
    }
    return adj;
}

// Weighted edges: [[u, v, w], ...]
vector<vector<pair<int,int>>> buildWeightedGraph(int n, vector<vector<int>>& edges) {
    vector<vector<pair<int,int>>> adj(n);
    for (auto& e : edges) {
        adj[e[0]].push_back({e[1], e[2]});
        adj[e[1]].push_back({e[0], e[2]});  // Remove for directed
    }
    return adj;
}`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">2. Adjacency Matrix</h3>
        <CodeBlock
          title="Adjacency Matrix — O(V²) Space"
          code={`// matrix[i][j] = 1 if edge between i and j, else 0
// For weighted: matrix[i][j] = weight

int n = 4;
vector<vector<int>> matrix(n, vector<int>(n, 0));

// Add edges (undirected)
matrix[0][1] = 1;  matrix[1][0] = 1;
matrix[0][2] = 1;  matrix[2][0] = 1;
matrix[1][2] = 1;  matrix[2][1] = 1;
matrix[1][3] = 1;  matrix[3][1] = 1;
matrix[2][3] = 1;  matrix[3][2] = 1;

// Result:
//     0  1  2  3
// 0 [ 0  1  1  0 ]
// 1 [ 1  0  1  1 ]
// 2 [ 1  1  0  1 ]
// 3 [ 0  1  1  0 ]

// Check if edge exists: O(1)
if (matrix[0][3]) cout << "Edge exists!";

// Get all neighbors of node 1: O(V)
for (int j = 0; j < n; j++) {
    if (matrix[1][j]) cout << j << " ";  // Output: 0 2 3
}`}
        />

        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-card">
                <th className="text-left p-3 border-b border-border font-semibold">Operation</th>
                <th className="text-left p-3 border-b border-border font-semibold">Adjacency List</th>
                <th className="text-left p-3 border-b border-border font-semibold">Adjacency Matrix</th>
              </tr>
            </thead>
            <tbody>
              {[
                { op: "Space", list: "O(V + E)", matrix: "O(V²)" },
                { op: "Add edge", list: "O(1)", matrix: "O(1)" },
                { op: "Check edge exists", list: "O(degree(u))", matrix: "O(1)" },
                { op: "Get all neighbors", list: "O(degree(u))", matrix: "O(V)" },
                { op: "Iterate all edges", list: "O(V + E)", matrix: "O(V²)" },
                { op: "Best for", list: "Sparse graphs (most problems)", matrix: "Dense graphs, O(1) edge check" },
              ].map((row) => (
                <tr key={row.op} className="border-b border-border/50 hover:bg-card/50">
                  <td className="p-3 font-semibold">{row.op}</td>
                  <td className="p-3 font-mono text-xs text-success">{row.list}</td>
                  <td className="p-3 font-mono text-xs">{row.matrix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <KeyPoint>
          <strong>Use adjacency list for 99% of interview problems.</strong> Most graphs are sparse.
          Adjacency matrix is only better when you need O(1) edge existence checks or the graph is dense (E ≈ V²).
        </KeyPoint>
      </Section>

      {/* Graph Types */}
      <Section icon={Zap} title="Important Graph Types">
        <div className="grid gap-3 md:grid-cols-2 my-4">
          <div className="p-4 bg-card rounded-lg border border-border">
            <h4 className="font-semibold text-sm mb-2 text-accent-light">Tree</h4>
            <p className="text-xs text-muted">Connected, undirected, acyclic. V-1 edges. Unique path between any two nodes.</p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border">
            <h4 className="font-semibold text-sm mb-2 text-accent-light">DAG (Directed Acyclic Graph)</h4>
            <p className="text-xs text-muted">Directed, no cycles. Topological sort possible. Dependencies, scheduling.</p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border">
            <h4 className="font-semibold text-sm mb-2 text-accent-light">Bipartite Graph</h4>
            <p className="text-xs text-muted">Vertices split into two groups, edges only between groups. 2-colorable.</p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border">
            <h4 className="font-semibold text-sm mb-2 text-accent-light">Complete Graph</h4>
            <p className="text-xs text-muted">Every pair of vertices has an edge. V(V-1)/2 edges. Dense.</p>
          </div>
        </div>

        <CodeBlock
          title="Implicit Graphs — Grids as Graphs"
          code={`// Many problems use a 2D grid as an implicit graph
// Each cell is a vertex, adjacent cells (4 or 8 directions) are edges

// 4-directional movement:
int dx[] = {0, 0, 1, -1};
int dy[] = {1, -1, 0, 0};

// For each cell (r, c), its neighbors are:
for (int d = 0; d < 4; d++) {
    int nr = r + dx[d];
    int nc = c + dy[d];
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        // (nr, nc) is a valid neighbor
    }
}

// 8-directional (including diagonals):
int dx8[] = {0, 0, 1, -1, 1, 1, -1, -1};
int dy8[] = {1, -1, 0, 0, 1, -1, 1, -1};

// Grid problems that are secretly graph problems:
// - Number of islands (connected components)
// - Shortest path in maze (BFS)
// - Flood fill (DFS/BFS)
// - Rotting oranges (multi-source BFS)`}
        />

        <Warning>
          <strong>Grids ARE graphs.</strong> Many interview problems give you a 2D grid — that&apos;s
          an implicit graph where cells are vertices and adjacent cells are edges. You don&apos;t need
          to build an adjacency list; just use the dx/dy direction arrays.
        </Warning>
      </Section>

      {/* Common Graph Input Patterns */}
      <Section icon={Brain} title="Reading Graph Input — Interview Patterns">
        <CodeBlock
          title="Common Input Formats"
          code={`// Pattern 1: Edge list → adjacency list
// Input: n=4, edges=[[0,1],[1,2],[2,3]]
vector<vector<int>> adj(n);
for (auto& e : edges) {
    adj[e[0]].push_back(e[1]);
    adj[e[1]].push_back(e[0]);
}

// Pattern 2: Prerequisites (directed)
// Input: numCourses=4, prerequisites=[[1,0],[2,1],[3,2]]
// Meaning: to take course 1, you need course 0 first
vector<vector<int>> adj(numCourses);
for (auto& p : prerequisites) {
    adj[p[1]].push_back(p[0]);  // p[1] → p[0] (prereq → course)
}

// Pattern 3: Grid (implicit graph)
// Input: grid = [['1','0','1'],['1','1','0'],['0','0','1']]
// No adjacency list needed — use dx/dy arrays

// Pattern 4: Node-based (like linked list)
// Input: Node* with neighbors vector
// Already an adjacency list!

// Pattern 5: Adjacency map (string nodes)
// Input: {"JFK": ["SFO","ATL"], "SFO": ["ATL"]}
unordered_map<string, vector<string>> adj;`}
        />
      </Section>

      {/* C++ Syntax Reference */}
      <Section icon={Code2} title="C++ Syntax Reference">
        <CodeBlock
          title="Graph Representation — Complete Reference"
          code={`#include <vector>
#include <unordered_map>
#include <queue>
#include <stack>
using namespace std;

// ========== Adjacency List (Unweighted) ==========
vector<vector<int>> adj(n);
adj[u].push_back(v);                 // Add edge u → v
// Undirected: also adj[v].push_back(u);

// ========== Adjacency List (Weighted) ==========
vector<vector<pair<int,int>>> adj(n);
adj[u].push_back({v, weight});

// ========== Adjacency Matrix ==========
vector<vector<int>> mat(n, vector<int>(n, 0));
mat[u][v] = 1;  // or = weight

// ========== Hash Map (Non-Integer Nodes) ==========
unordered_map<string, vector<string>> adj;
adj["NYC"].push_back("LAX");

// ========== Build from Edge List ==========
for (auto& e : edges) {
    adj[e[0]].push_back(e[1]);
    adj[e[1]].push_back(e[0]);  // Undirected
}

// ========== Grid Directions ==========
int dx[] = {0, 0, 1, -1};
int dy[] = {1, -1, 0, 0};

// Check bounds:
bool inBounds(int r, int c, int rows, int cols) {
    return r >= 0 && r < rows && c >= 0 && c < cols;
}

// ========== Visited Array ==========
vector<bool> visited(n, false);
// For grids: vector<vector<bool>> visited(rows, vector<bool>(cols, false));

// ========== In-degree (for directed) ==========
vector<int> indegree(n, 0);
for (int u = 0; u < n; u++) {
    for (int v : adj[u]) {
        indegree[v]++;
    }
}`}
        />
      </Section>

      {/* Coding Challenges */}
      <Section icon={Code2} title="Coding Challenges">
        <CodingChallenge
          title="Challenge 1: Build an Adjacency List"
          description="Given n nodes (0 to n-1) and an edge list for an undirected graph, build and return the adjacency list."
          starterCode={`vector<vector<int>> buildGraph(int n, vector<vector<int>>& edges) {
    // Create adjacency list with n empty vectors
    // For each edge, add both directions

}`}
          solution={`vector<vector<int>> buildGraph(int n, vector<vector<int>>& edges) {
    vector<vector<int>> adj(n);
    
    for (auto& edge : edges) {
        adj[edge[0]].push_back(edge[1]);
        adj[edge[1]].push_back(edge[0]);
    }
    
    return adj;
}
// Time: O(E), Space: O(V + E)`}
          hints={[
            "Create a vector<vector<int>> of size n.",
            "For each edge [u, v], add v to adj[u] AND u to adj[v] (undirected).",
            "Return the adjacency list.",
          ]}
          testDescription="Iterate edges, push both directions for undirected graph."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("vector<vector<int>>adj(n)") &&
              lower.includes("adj[edge[0]].push_back(edge[1])") &&
              lower.includes("adj[edge[1]].push_back(edge[0])")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 2: Count the Degree of Each Vertex"
          description="Given an adjacency list, return a vector where result[i] is the degree (number of edges) of vertex i."
          starterCode={`vector<int> countDegrees(vector<vector<int>>& adj) {
    // The degree of each vertex = size of its neighbor list

}`}
          solution={`vector<int> countDegrees(vector<vector<int>>& adj) {
    int n = adj.size();
    vector<int> degrees(n);
    
    for (int i = 0; i < n; i++) {
        degrees[i] = adj[i].size();
    }
    
    return degrees;
}
// Time: O(V), Space: O(V)
// Note: for directed graphs, this gives out-degree.
// In-degree requires counting how many lists contain each node.`}
          hints={[
            "The degree of vertex i is simply adj[i].size().",
            "Create a result vector and fill it with each node's neighbor count.",
            "For directed graphs, adj[i].size() gives out-degree, not total degree.",
          ]}
          testDescription="Degree = number of neighbors = adj[i].size()."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("adj[i].size()") || lower.includes("adj[i].size()")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 3: Check if Edge Exists (Adjacency List)"
          description="Given an adjacency list and two nodes u and v, check if an edge exists between them."
          starterCode={`bool hasEdge(vector<vector<int>>& adj, int u, int v) {
    // Search through u's neighbor list for v

}`}
          solution={`bool hasEdge(vector<vector<int>>& adj, int u, int v) {
    for (int neighbor : adj[u]) {
        if (neighbor == v) return true;
    }
    return false;
}
// Time: O(degree(u))
// With adjacency matrix: O(1) — just matrix[u][v]
// With unordered_set neighbors: O(1) average`}
          hints={[
            "Iterate through adj[u] (u's neighbor list).",
            "If you find v, return true.",
            "If you exhaust the list without finding v, return false.",
          ]}
          testDescription="Linear search through u's neighbors. O(degree) for list, O(1) for matrix."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("adj[u]") &&
              lower.includes("neighbor==v") || lower.includes("==v") &&
              lower.includes("returntrue") &&
              lower.includes("returnfalse")
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
              <span><strong>Graph = vertices + edges.</strong> Directed or undirected, weighted or unweighted.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Adjacency list for 99% of problems.</strong> O(V+E) space, efficient for sparse graphs. Use vector&lt;vector&lt;int&gt;&gt;.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Adjacency matrix for dense graphs</strong> or when you need O(1) edge checks. O(V²) space.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Grids ARE graphs.</strong> Use dx/dy arrays for neighbors. No adjacency list needed.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Know key terms:</strong> degree, cycle, connected, DAG, bipartite, sparse vs dense.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Build graph from edge list</strong> is step 1 of almost every graph problem. Master this conversion.</span>
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
