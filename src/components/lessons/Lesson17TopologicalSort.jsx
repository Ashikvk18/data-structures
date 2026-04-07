"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownUp,
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
    question: "What is a topological sort?",
    options: [
      "Sorting numbers in ascending order",
      "A linear ordering of vertices in a DAG such that for every edge u→v, u comes before v",
      "Sorting edges by weight",
      "A type of binary search",
    ],
    correctIndex: 1,
    explanation:
      "Topological sort produces a linear ordering of vertices where every directed edge u→v has u appearing before v. It's only possible on DAGs (Directed Acyclic Graphs) — a cycle means no valid ordering exists.",
  },
  {
    id: 2,
    question: "Can a graph with a cycle have a topological ordering?",
    options: [
      "Yes, always",
      "No — topological sort is only defined for DAGs (no cycles)",
      "Only if the cycle has 3 or fewer nodes",
      "Only for undirected graphs",
    ],
    correctIndex: 1,
    explanation:
      "If there's a cycle A→B→C→A, then A must come before B, B before C, and C before A — contradiction! Topological sort requires a DAG. If you can't produce a valid ordering, the graph has a cycle.",
  },
  {
    id: 3,
    question: "What is Kahn's algorithm?",
    options: [
      "A shortest path algorithm",
      "BFS-based topological sort using in-degree",
      "A sorting algorithm",
      "A cycle detection method for undirected graphs",
    ],
    correctIndex: 1,
    explanation:
      "Kahn's algorithm: (1) compute in-degree of all nodes, (2) push all nodes with in-degree 0 into a queue, (3) process each, decrement neighbors' in-degrees, (4) push new in-degree 0 nodes. BFS-based, iterative.",
  },
  {
    id: 4,
    question: "What is the DFS approach to topological sort?",
    options: [
      "Sort by DFS discovery time",
      "Post-order DFS: add node to result AFTER all descendants are processed, then reverse",
      "Pre-order DFS",
      "BFS from leaf nodes",
    ],
    correctIndex: 1,
    explanation:
      "DFS topo sort: recursively visit all neighbors first, then push the current node onto a stack (post-order). The stack (or reversed result) gives the topological order. A node is added only after all its dependencies are processed.",
  },
  {
    id: 5,
    question: "How does Kahn's algorithm detect cycles?",
    options: [
      "It can't detect cycles",
      "If the result contains fewer than V nodes, the graph has a cycle",
      "It uses DFS coloring",
      "It checks if any edge weight is negative",
    ],
    correctIndex: 1,
    explanation:
      "In Kahn's, nodes in a cycle never reach in-degree 0 (they depend on each other). So they're never added to the queue or result. If result.size() < V, some nodes were stuck in a cycle.",
  },
  {
    id: 6,
    question: "What is the time complexity of topological sort?",
    options: [
      "O(V log V)",
      "O(V + E)",
      "O(V²)",
      "O(V × E)",
    ],
    correctIndex: 1,
    explanation:
      "Both Kahn's (BFS) and DFS-based topological sort visit every vertex once and every edge once. Total: O(V + E). Same as BFS/DFS.",
  },
  {
    id: 7,
    question: "What is the 'Course Schedule' problem really asking?",
    options: [
      "Find the shortest path",
      "Can you topologically sort the course dependency graph? (i.e., is it a DAG?)",
      "Count connected components",
      "Find the MST",
    ],
    correctIndex: 1,
    explanation:
      "Course Schedule: courses are nodes, prerequisites are directed edges. 'Can you finish all courses?' = 'Is the dependency graph a DAG?' = 'Does a valid topological ordering exist?' Use Kahn's or DFS cycle detection.",
  },
  {
    id: 8,
    question: "What is 'Course Schedule II' asking?",
    options: [
      "Just detect if a cycle exists",
      "Return one valid ordering to take all courses (the actual topological sort)",
      "Return the shortest schedule",
      "Count the number of valid orderings",
    ],
    correctIndex: 1,
    explanation:
      "Course Schedule II: return the actual topological ordering. If a cycle exists, return empty. This is a direct application of Kahn's algorithm — the BFS processing order IS the topological order.",
  },
  {
    id: 9,
    question: "When should you use Kahn's (BFS) vs DFS topological sort?",
    options: [
      "Always use DFS",
      "Kahn's: when you need cycle detection + ordering. DFS: when you need post-order or SCC.",
      "They are identical",
      "Kahn's is always faster",
    ],
    correctIndex: 1,
    explanation:
      "Kahn's (BFS): intuitive, easy cycle detection (check result size), good for problems needing level-by-level processing. DFS: natural for post-order traversal, useful for SCCs (Kosaraju/Tarjan), works well with recursion.",
  },
  {
    id: 10,
    question: "What is in-degree?",
    options: [
      "The number of outgoing edges from a node",
      "The number of incoming edges to a node",
      "The total number of edges in the graph",
      "The depth of a node in BFS",
    ],
    correctIndex: 1,
    explanation:
      "In-degree = number of incoming edges. Out-degree = number of outgoing edges. In Kahn's algorithm, nodes with in-degree 0 have no dependencies and can be processed first.",
  },
  {
    id: 11,
    question: "What does 'Alien Dictionary' use?",
    options: [
      "Binary search",
      "Build a graph from character orderings, then topological sort",
      "Hash map only",
      "Trie",
    ],
    correctIndex: 1,
    explanation:
      "Alien Dictionary: compare adjacent words to extract character ordering rules (directed edges). Build a graph of characters, then topological sort to find the alien alphabet order. Classic topo sort application.",
  },
  {
    id: 12,
    question: "Can there be multiple valid topological orderings?",
    options: [
      "No — topological sort always gives a unique result",
      "Yes — if multiple nodes have in-degree 0 at the same time, any order among them is valid",
      "Only if the graph is disconnected",
      "Only for trees",
    ],
    correctIndex: 1,
    explanation:
      "Multiple valid orderings exist when there's flexibility in ordering (multiple nodes with in-degree 0 simultaneously). Example: A→C, B→C. Both [A,B,C] and [B,A,C] are valid. Unique ordering only when there's a single Hamiltonian path.",
  },
];

export default function Lesson17TopologicalSort({ onQuizComplete }) {
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
      {/* What is Topological Sort? */}
      <Section icon={BookOpen} title="What is Topological Sort?">
        <p className="text-foreground/80 leading-relaxed mb-4">
          A <strong>topological sort</strong> is a linear ordering of vertices in a <strong>DAG</strong> (Directed
          Acyclic Graph) such that for every directed edge u→v, vertex u comes before vertex v. Think of it as
          a valid execution order for tasks with dependencies.
        </p>

        <div className="bg-card rounded-xl border border-border p-5 my-4">
          <h4 className="font-semibold mb-3 text-accent-light">Topological Sort Visualization</h4>
          <div className="font-mono text-sm bg-code-bg rounded-lg p-4 overflow-x-auto">
            <p className="text-muted">{"// Course prerequisites:"}</p>
            <p className="text-muted">{"// Math → Physics → Quantum"}</p>
            <p className="text-muted">{"// Math → CS"}</p>
            <p className="text-muted">{"// CS → AI"}</p>
            <p className="text-muted">{"// Physics → AI"}</p>
            <p className="text-foreground/90 mt-2">{"DAG:"}</p>
            <p className="text-foreground/90">{"  Math → Physics → Quantum"}</p>
            <p className="text-foreground/90">{"    ↓       ↓"}</p>
            <p className="text-foreground/90">{"    CS  →   AI"}</p>
            <p className="text-success mt-2">{"Valid order: Math, Physics, CS, Quantum, AI"}</p>
            <p className="text-success">{"Also valid: Math, CS, Physics, AI, Quantum"}</p>
            <p className="text-warning mt-1">{"Invalid:    AI, Math, ... (AI depends on Physics & CS)"}</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 my-4">
          <div className="p-4 bg-card rounded-lg border border-border">
            <h4 className="font-semibold text-sm mb-2 text-accent-light">Real-World Uses</h4>
            <ul className="text-xs text-foreground/80 space-y-1">
              <li>- Course scheduling (prerequisites)</li>
              <li>- Build systems (compile order)</li>
              <li>- Package managers (dependency resolution)</li>
              <li>- Spreadsheet cell evaluation</li>
              <li>- Task scheduling with dependencies</li>
            </ul>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border">
            <h4 className="font-semibold text-sm mb-2 text-accent-light">Key Properties</h4>
            <ul className="text-xs text-foreground/80 space-y-1">
              <li>- Only works on DAGs (no cycles)</li>
              <li>- Multiple valid orderings may exist</li>
              <li>- Two approaches: BFS (Kahn&apos;s) and DFS</li>
              <li>- Time: O(V + E) for both approaches</li>
              <li>- Can detect cycles as a side effect</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Kahn's Algorithm (BFS) */}
      <Section icon={Zap} title="Kahn's Algorithm (BFS-Based)">
        <p className="text-foreground/80 leading-relaxed mb-4">
          Kahn&apos;s is the <strong>intuitive approach</strong>: repeatedly pick nodes with no incoming
          edges (in-degree 0), remove them, and update neighbors. Uses a queue — it&apos;s BFS!
        </p>

        <div className="bg-card rounded-xl border border-border p-5 my-4">
          <h4 className="font-semibold mb-3 text-accent-light">Kahn&apos;s Step-by-Step</h4>
          <div className="font-mono text-xs bg-code-bg rounded-lg p-4 overflow-x-auto">
            <p className="text-muted">{"// Graph: 0→1, 0→2, 1→3, 2→3"}</p>
            <p className="text-muted">{"// In-degrees: [0:0, 1:1, 2:1, 3:2]"}</p>
            <p className="text-foreground/90 mt-2">{"Step 1: Queue = [0]  (in-degree 0)"}</p>
            <p className="text-foreground/90">{"  Pop 0 → result=[0], decrement 1,2 → in-deg: [1:0, 2:0, 3:2]"}</p>
            <p className="text-foreground/90">{"Step 2: Queue = [1, 2]"}</p>
            <p className="text-foreground/90">{"  Pop 1 → result=[0,1], decrement 3 → in-deg: [2:0, 3:1]"}</p>
            <p className="text-foreground/90">{"  Pop 2 → result=[0,1,2], decrement 3 → in-deg: [3:0]"}</p>
            <p className="text-foreground/90">{"Step 3: Queue = [3]"}</p>
            <p className="text-foreground/90">{"  Pop 3 → result=[0,1,2,3]"}</p>
            <p className="text-success mt-1">{"Result: [0, 1, 2, 3] ✓ (4 nodes = V, no cycle)"}</p>
          </div>
        </div>

        <CodeBlock
          title="Kahn's Algorithm — Standard Template"
          code={`vector<int> topoSortKahn(int n, vector<vector<int>>& adj) {
    // Step 1: Compute in-degrees
    vector<int> indegree(n, 0);
    for (int u = 0; u < n; u++) {
        for (int v : adj[u]) {
            indegree[v]++;
        }
    }
    
    // Step 2: Push all nodes with in-degree 0
    queue<int> q;
    for (int i = 0; i < n; i++) {
        if (indegree[i] == 0) q.push(i);
    }
    
    // Step 3: BFS — process nodes, decrement neighbors
    vector<int> result;
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        result.push_back(node);
        
        for (int neighbor : adj[node]) {
            indegree[neighbor]--;
            if (indegree[neighbor] == 0) {
                q.push(neighbor);
            }
        }
    }
    
    // Step 4: Cycle check
    if (result.size() != n) {
        return {};  // Cycle detected! Not all nodes processed.
    }
    
    return result;
}
// Time: O(V + E), Space: O(V)`}
        />

        <CodeBlock
          title="Course Schedule — Can You Finish All Courses?"
          code={`// numCourses = n, prerequisites = [[1,0],[2,1]] meaning 0→1, 1→2
bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> adj(numCourses);
    vector<int> indegree(numCourses, 0);
    
    for (auto& p : prerequisites) {
        adj[p[1]].push_back(p[0]);  // prereq → course
        indegree[p[0]]++;
    }
    
    queue<int> q;
    for (int i = 0; i < numCourses; i++) {
        if (indegree[i] == 0) q.push(i);
    }
    
    int count = 0;
    while (!q.empty()) {
        int node = q.front(); q.pop();
        count++;
        
        for (int next : adj[node]) {
            if (--indegree[next] == 0) q.push(next);
        }
    }
    
    return count == numCourses;  // All processed → no cycle → can finish
}
// Course Schedule I:  return bool (can you finish?)
// Course Schedule II: return the actual order (topo sort result)`}
        />

        <CodeBlock
          title="Course Schedule II — Return the Order"
          code={`vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> adj(numCourses);
    vector<int> indegree(numCourses, 0);
    
    for (auto& p : prerequisites) {
        adj[p[1]].push_back(p[0]);
        indegree[p[0]]++;
    }
    
    queue<int> q;
    for (int i = 0; i < numCourses; i++) {
        if (indegree[i] == 0) q.push(i);
    }
    
    vector<int> order;
    while (!q.empty()) {
        int node = q.front(); q.pop();
        order.push_back(node);
        
        for (int next : adj[node]) {
            if (--indegree[next] == 0) q.push(next);
        }
    }
    
    return order.size() == numCourses ? order : vector<int>{};
}`}
        />

        <KeyPoint>
          <strong>Kahn&apos;s = in-degree + BFS.</strong> Three things to remember:
          (1) Compute in-degrees. (2) Start with in-degree 0 nodes. (3) Check result.size() == V for cycle detection.
        </KeyPoint>
      </Section>

      {/* DFS Topological Sort */}
      <Section icon={Zap} title="DFS-Based Topological Sort">
        <p className="text-foreground/80 leading-relaxed mb-4">
          The DFS approach uses <strong>post-order traversal</strong>: finish all descendants first, then
          add the current node. The reversed post-order gives the topological ordering.
        </p>

        <CodeBlock
          title="DFS Topological Sort — Post-Order"
          code={`vector<int> topoSortDFS(int n, vector<vector<int>>& adj) {
    vector<bool> visited(n, false);
    vector<bool> inStack(n, false);  // For cycle detection
    stack<int> st;
    bool hasCycle = false;
    
    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            dfs(adj, i, visited, inStack, st, hasCycle);
        }
    }
    
    if (hasCycle) return {};
    
    // Stack has reverse post-order = topological order
    vector<int> result;
    while (!st.empty()) {
        result.push_back(st.top());
        st.pop();
    }
    return result;
}

void dfs(vector<vector<int>>& adj, int node,
         vector<bool>& visited, vector<bool>& inStack,
         stack<int>& st, bool& hasCycle) {
    if (hasCycle) return;
    
    visited[node] = true;
    inStack[node] = true;  // Currently in DFS path
    
    for (int neighbor : adj[node]) {
        if (!visited[neighbor]) {
            dfs(adj, neighbor, visited, inStack, st, hasCycle);
        } else if (inStack[neighbor]) {
            hasCycle = true;  // Back edge → cycle!
            return;
        }
    }
    
    inStack[node] = false;  // Done with this path
    st.push(node);          // Post-order: push AFTER processing all neighbors
}`}
        />

        <Warning>
          <strong>DFS cycle detection in directed graphs</strong> requires tracking nodes in the current
          DFS path (inStack/gray nodes), NOT just visited. A visited node from a different branch is
          fine — only a node in the CURRENT path means a cycle (back edge).
        </Warning>

        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-card">
                <th className="text-left p-3 border-b border-border font-semibold">Aspect</th>
                <th className="text-left p-3 border-b border-border font-semibold">Kahn&apos;s (BFS)</th>
                <th className="text-left p-3 border-b border-border font-semibold">DFS Post-Order</th>
              </tr>
            </thead>
            <tbody>
              {[
                { aspect: "Approach", kahn: "BFS with in-degree", dfs: "DFS post-order + reverse" },
                { aspect: "Data structure", kahn: "Queue + indegree array", dfs: "Recursion stack + inStack array" },
                { aspect: "Cycle detection", kahn: "result.size() < V", dfs: "Back edge (inStack neighbor)" },
                { aspect: "Ease of use", kahn: "More intuitive", dfs: "More natural with recursion" },
                { aspect: "Time", kahn: "O(V + E)", dfs: "O(V + E)" },
                { aspect: "Best for", kahn: "Course Schedule, parallel tasks", dfs: "SCC, path problems" },
              ].map((row) => (
                <tr key={row.aspect} className="border-b border-border/50 hover:bg-card/50">
                  <td className="p-3 font-semibold">{row.aspect}</td>
                  <td className="p-3 text-xs">{row.kahn}</td>
                  <td className="p-3 text-xs">{row.dfs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Classic Problems */}
      <Section icon={Brain} title="Classic Topological Sort Problems">
        <h3 className="text-lg font-semibold mt-2 mb-3 text-accent-light">1. Alien Dictionary</h3>
        <CodeBlock
          title="Alien Dictionary — Build Graph + Topo Sort"
          code={`// Given sorted alien words, find the character order
// Compare adjacent words to extract ordering rules

string alienOrder(vector<string>& words) {
    // Step 1: Build graph
    unordered_map<char, unordered_set<char>> adj;
    unordered_map<char, int> indegree;
    
    // Initialize all characters
    for (auto& word : words) {
        for (char c : word) {
            indegree[c];  // Ensure exists with default 0
        }
    }
    
    // Compare adjacent words
    for (int i = 0; i < words.size() - 1; i++) {
        string& w1 = words[i];
        string& w2 = words[i + 1];
        int minLen = min(w1.size(), w2.size());
        
        // Edge case: "abc" before "ab" → invalid
        if (w1.size() > w2.size() && w1.substr(0, minLen) == w2.substr(0, minLen))
            return "";
        
        for (int j = 0; j < minLen; j++) {
            if (w1[j] != w2[j]) {
                if (!adj[w1[j]].count(w2[j])) {
                    adj[w1[j]].insert(w2[j]);
                    indegree[w2[j]]++;
                }
                break;  // Only first difference matters!
            }
        }
    }
    
    // Step 2: Kahn's topological sort
    queue<char> q;
    for (auto& [c, deg] : indegree) {
        if (deg == 0) q.push(c);
    }
    
    string result;
    while (!q.empty()) {
        char c = q.front(); q.pop();
        result += c;
        for (char next : adj[c]) {
            if (--indegree[next] == 0) q.push(next);
        }
    }
    
    return result.size() == indegree.size() ? result : "";
}`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">2. Parallel Course Scheduling</h3>
        <CodeBlock
          title="Minimum Semesters — BFS Level Count"
          code={`// How many semesters to complete all courses?
// = longest path in DAG = number of BFS levels

int minimumSemesters(int n, vector<vector<int>>& relations) {
    vector<vector<int>> adj(n + 1);
    vector<int> indegree(n + 1, 0);
    
    for (auto& r : relations) {
        adj[r[0]].push_back(r[1]);
        indegree[r[1]]++;
    }
    
    queue<int> q;
    for (int i = 1; i <= n; i++) {
        if (indegree[i] == 0) q.push(i);
    }
    
    int semesters = 0, count = 0;
    while (!q.empty()) {
        int size = q.size();  // All courses this semester
        semesters++;
        
        for (int i = 0; i < size; i++) {
            int course = q.front(); q.pop();
            count++;
            
            for (int next : adj[course]) {
                if (--indegree[next] == 0) q.push(next);
            }
        }
    }
    
    return count == n ? semesters : -1;  // -1 if cycle
}
// Key insight: BFS levels = parallel execution rounds
// All courses in the same level can be taken simultaneously`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">3. Build Order / Task Scheduling</h3>
        <CodeBlock
          title="Task Scheduling with Dependencies"
          code={`// Given tasks and dependencies, find valid execution order
// This is literally topological sort!

vector<int> findBuildOrder(int numTasks, vector<pair<int,int>>& deps) {
    // deps[i] = {dependency, task} meaning dependency must come first
    vector<vector<int>> adj(numTasks);
    vector<int> indegree(numTasks, 0);
    
    for (auto& [dep, task] : deps) {
        adj[dep].push_back(task);
        indegree[task]++;
    }
    
    // Kahn's algorithm
    queue<int> q;
    for (int i = 0; i < numTasks; i++) {
        if (indegree[i] == 0) q.push(i);
    }
    
    vector<int> order;
    while (!q.empty()) {
        int task = q.front(); q.pop();
        order.push_back(task);
        
        for (int next : adj[task]) {
            if (--indegree[next] == 0) q.push(next);
        }
    }
    
    if (order.size() != numTasks) {
        // Circular dependency detected!
        return {};
    }
    return order;
}`}
        />

        <KeyPoint>
          <strong>Topological sort interview patterns:</strong> (1) Can you complete all tasks? → check for cycle.
          (2) In what order? → return the topo sort. (3) Minimum rounds? → count BFS levels.
          (4) Character ordering? → build graph from comparisons, then topo sort.
        </KeyPoint>
      </Section>

      {/* C++ Syntax Reference */}
      <Section icon={Code2} title="C++ Syntax Reference">
        <CodeBlock
          title="Topological Sort — Complete Reference"
          code={`#include <vector>
#include <queue>
#include <stack>
using namespace std;

// ========== Kahn's Algorithm (BFS) ==========
vector<int> topoKahn(int n, vector<vector<int>>& adj) {
    vector<int> indeg(n, 0);
    for (int u = 0; u < n; u++)
        for (int v : adj[u]) indeg[v]++;
    
    queue<int> q;
    for (int i = 0; i < n; i++)
        if (indeg[i] == 0) q.push(i);
    
    vector<int> order;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : adj[u])
            if (--indeg[v] == 0) q.push(v);
    }
    // Cycle check: order.size() == n
    return order;
}

// ========== DFS Topological Sort ==========
void dfsTopo(int u, vector<vector<int>>& adj,
             vector<bool>& vis, vector<bool>& inStack,
             stack<int>& st, bool& cycle) {
    vis[u] = true;
    inStack[u] = true;
    for (int v : adj[u]) {
        if (!vis[v]) dfsTopo(v, adj, vis, inStack, st, cycle);
        else if (inStack[v]) { cycle = true; return; }
    }
    inStack[u] = false;
    st.push(u);
}

// ========== Cycle Detection (Directed) ==========
// Kahn's: order.size() < n → cycle
// DFS:    inStack[neighbor] == true → back edge → cycle

// ========== Build Graph from Prerequisites ==========
// prerequisites = [[course, prereq], ...]
for (auto& p : prereqs) {
    adj[p[1]].push_back(p[0]);  // prereq → course
    indeg[p[0]]++;
}

// ========== BFS Level Count (Parallel Tasks) ==========
int levels = 0;
while (!q.empty()) {
    int sz = q.size();
    levels++;
    for (int i = 0; i < sz; i++) { /* process level */ }
}`}
        />
      </Section>

      {/* Coding Challenges */}
      <Section icon={Code2} title="Coding Challenges">
        <CodingChallenge
          title="Challenge 1: Course Schedule (Cycle Detection)"
          description="Given numCourses and prerequisites [[course, prereq], ...], return true if you can finish all courses (no cycle in dependency graph)."
          starterCode={`bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    // Build adjacency list and in-degree array
    // Kahn's algorithm: BFS from in-degree 0 nodes
    // If processed count == numCourses → no cycle

}`}
          solution={`bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> adj(numCourses);
    vector<int> indegree(numCourses, 0);
    
    for (auto& p : prerequisites) {
        adj[p[1]].push_back(p[0]);
        indegree[p[0]]++;
    }
    
    queue<int> q;
    for (int i = 0; i < numCourses; i++) {
        if (indegree[i] == 0) q.push(i);
    }
    
    int count = 0;
    while (!q.empty()) {
        int node = q.front(); q.pop();
        count++;
        for (int next : adj[node]) {
            if (--indegree[next] == 0) q.push(next);
        }
    }
    
    return count == numCourses;
}`}
          hints={[
            "Build graph: adj[prereq].push_back(course) and indegree[course]++.",
            "Push all nodes with indegree 0 into the queue.",
            "BFS: pop, count++, decrement neighbors. If count == numCourses → no cycle.",
          ]}
          testDescription="Kahn's BFS: if all nodes are processed, the graph is a DAG."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("indegree") &&
              lower.includes("q.push") &&
              lower.includes("count==numcourses")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 2: Course Schedule II (Return Order)"
          description="Return a valid course ordering. If impossible (cycle), return empty vector."
          starterCode={`vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
    // Same as Kahn's, but collect the order
    // Return empty if cycle detected

}`}
          solution={`vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> adj(numCourses);
    vector<int> indegree(numCourses, 0);
    
    for (auto& p : prerequisites) {
        adj[p[1]].push_back(p[0]);
        indegree[p[0]]++;
    }
    
    queue<int> q;
    for (int i = 0; i < numCourses; i++) {
        if (indegree[i] == 0) q.push(i);
    }
    
    vector<int> order;
    while (!q.empty()) {
        int node = q.front(); q.pop();
        order.push_back(node);
        for (int next : adj[node]) {
            if (--indegree[next] == 0) q.push(next);
        }
    }
    
    return order.size() == numCourses ? order : vector<int>{};
}`}
          hints={[
            "Identical to Kahn's — the BFS processing order IS the topological order.",
            "Collect nodes into an order vector as you pop them.",
            "If order.size() != numCourses, there's a cycle — return empty.",
          ]}
          testDescription="The BFS processing order in Kahn's algorithm is a valid topological ordering."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("order.push_back") &&
              lower.includes("order.size()==numcourses")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 3: Minimum Semesters to Complete All Courses"
          description="Given n courses and prerequisite relations, find the minimum number of semesters needed (you can take multiple independent courses per semester). Return -1 if impossible."
          starterCode={`int minimumSemesters(int n, vector<vector<int>>& relations) {
    // Kahn's with level counting
    // Each BFS level = one semester

}`}
          solution={`int minimumSemesters(int n, vector<vector<int>>& relations) {
    vector<vector<int>> adj(n + 1);
    vector<int> indegree(n + 1, 0);
    
    for (auto& r : relations) {
        adj[r[0]].push_back(r[1]);
        indegree[r[1]]++;
    }
    
    queue<int> q;
    for (int i = 1; i <= n; i++) {
        if (indegree[i] == 0) q.push(i);
    }
    
    int semesters = 0, count = 0;
    while (!q.empty()) {
        int size = q.size();
        semesters++;
        for (int i = 0; i < size; i++) {
            int course = q.front(); q.pop();
            count++;
            for (int next : adj[course]) {
                if (--indegree[next] == 0) q.push(next);
            }
        }
    }
    
    return count == n ? semesters : -1;
}`}
          hints={[
            "Use Kahn's with the q.size() level trick (like BFS levels).",
            "Each level = one semester. All courses in the same level have no dependencies on each other.",
            "Count semesters (levels) and total processed nodes. If count != n → cycle → -1.",
          ]}
          testDescription="BFS levels = parallel rounds. Courses with same 'depth' in the DAG can be taken together."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("semesters++") &&
              lower.includes("q.size()") &&
              lower.includes("count==n")
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
              <span><strong>Topological sort = linear ordering of a DAG</strong> where u comes before v for every edge u→v.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Kahn&apos;s (BFS):</strong> in-degree + queue. Process in-degree 0 nodes first. Cycle check: result.size() == V.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>DFS approach:</strong> post-order + reverse. Cycle check: back edge (inStack neighbor). Push to stack after all descendants.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Course Schedule I:</strong> can you finish? = is it a DAG? <strong>Course Schedule II:</strong> return the order.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Minimum semesters / parallel rounds = BFS levels</strong> in topological sort.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Alien Dictionary:</strong> compare adjacent words → build char graph → topo sort.</span>
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
