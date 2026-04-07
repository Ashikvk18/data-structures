"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Compass,
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
    question: "What data structure does BFS use?",
    options: ["Stack", "Queue", "Heap", "Hash map"],
    correctIndex: 1,
    explanation:
      "BFS uses a queue (FIFO). It processes nodes level by level — first all neighbors of the start, then all neighbors of those neighbors, etc. This guarantees shortest path in unweighted graphs.",
  },
  {
    id: 2,
    question: "What data structure does DFS use?",
    options: ["Queue", "Stack (or recursion call stack)", "Heap", "Deque"],
    correctIndex: 1,
    explanation:
      "DFS uses a stack — either explicitly or via the recursion call stack. It goes as deep as possible along one path before backtracking. Recursive DFS is the most common in interviews.",
  },
  {
    id: 3,
    question: "Which traversal guarantees the shortest path in an unweighted graph?",
    options: ["DFS", "BFS", "Both", "Neither"],
    correctIndex: 1,
    explanation:
      "BFS explores level by level, so the first time it reaches a node is via the shortest path (fewest edges). DFS might find a longer path first. For weighted graphs, you need Dijkstra's algorithm instead.",
  },
  {
    id: 4,
    question: "What is the time complexity of BFS and DFS on a graph?",
    options: ["O(V)", "O(E)", "O(V + E)", "O(V × E)"],
    correctIndex: 2,
    explanation:
      "Both BFS and DFS visit every vertex once O(V) and examine every edge once O(E). Total: O(V + E). This applies to adjacency list representation. With adjacency matrix, it's O(V²).",
  },
  {
    id: 5,
    question: "How do you find the number of connected components in an undirected graph?",
    options: [
      "Count the number of edges",
      "Run BFS/DFS from each unvisited node — each run discovers one component",
      "Use a hash map",
      "Sort the adjacency list",
    ],
    correctIndex: 1,
    explanation:
      "Loop through all vertices. For each unvisited vertex, start a BFS/DFS — it will visit all nodes in that component. Increment a counter each time you start a new BFS/DFS. That counter = number of connected components.",
  },
  {
    id: 6,
    question: "How do you detect a cycle in an undirected graph using DFS?",
    options: [
      "Check if any node has degree > 2",
      "If DFS visits a node that is already visited and is NOT the parent, there's a cycle",
      "Count edges — if E >= V, there's a cycle",
      "Use BFS instead",
    ],
    correctIndex: 1,
    explanation:
      "During DFS, if you encounter a visited neighbor that isn't the parent of the current node, you've found a cycle (a back edge). For directed graphs, you need to track nodes in the current DFS path (gray/white/black coloring).",
  },
  {
    id: 7,
    question: "What is 'Number of Islands' really asking?",
    options: [
      "Count the nodes",
      "Count connected components of '1' cells in a grid",
      "Find the shortest path",
      "Sort the grid",
    ],
    correctIndex: 1,
    explanation:
      "Number of Islands = count connected components where cells with '1' are vertices and adjacent '1' cells are edges. BFS or DFS from each unvisited '1' cell, mark all connected '1' cells as visited. Count how many times you start a new search.",
  },
  {
    id: 8,
    question: "What is multi-source BFS?",
    options: [
      "Running BFS on multiple graphs",
      "Starting BFS from multiple sources simultaneously by adding all sources to the queue initially",
      "Running BFS multiple times",
      "A faster version of DFS",
    ],
    correctIndex: 1,
    explanation:
      "Multi-source BFS: push ALL starting nodes into the queue at the beginning, then run normal BFS. This computes the shortest distance from ANY source to every other node simultaneously. Used in: Rotting Oranges, Walls & Gates, 01-Matrix.",
  },
  {
    id: 9,
    question: "When should you use BFS over DFS?",
    options: [
      "Always",
      "When you need shortest path in unweighted graphs, or level-order processing",
      "When the graph has cycles",
      "When using recursion",
    ],
    correctIndex: 1,
    explanation:
      "Use BFS when: (1) shortest path in unweighted graph, (2) level-by-level processing, (3) multi-source shortest distance. Use DFS when: (1) exploring all paths, (2) detecting cycles, (3) topological sort, (4) backtracking problems.",
  },
  {
    id: 10,
    question: "How do you check if a graph is bipartite?",
    options: [
      "Check if it's connected",
      "BFS/DFS with 2-coloring — try to color neighbors with opposite colors; if conflict, not bipartite",
      "Check if all degrees are even",
      "Sort the adjacency list",
    ],
    correctIndex: 1,
    explanation:
      "Assign colors (0 and 1). BFS/DFS from any node, coloring each neighbor the opposite color. If you find a neighbor that's already colored the SAME as the current node, the graph is NOT bipartite. If no conflicts, it IS bipartite.",
  },
  {
    id: 11,
    question: "What does 'Rotting Oranges' use?",
    options: [
      "DFS with backtracking",
      "Multi-source BFS — start from all rotten oranges simultaneously",
      "Dijkstra's algorithm",
      "Dynamic programming",
    ],
    correctIndex: 1,
    explanation:
      "Rotting Oranges: push all initially rotten oranges into the queue. BFS level by level — each level = 1 minute. Track the number of levels (minutes). If any fresh orange remains unvisited, return -1. Classic multi-source BFS.",
  },
  {
    id: 12,
    question: "What is the space complexity of BFS on a graph?",
    options: ["O(1)", "O(V)", "O(E)", "O(V + E)"],
    correctIndex: 1,
    explanation:
      "BFS uses a queue that can hold up to O(V) nodes and a visited array of size V. Total space: O(V). DFS uses O(V) for the recursion stack (worst case: a straight-line graph) plus O(V) for visited. Both: O(V) space.",
  },
];

export default function Lesson15BfsDfs({ onQuizComplete }) {
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
      {/* BFS Overview */}
      <Section icon={BookOpen} title="BFS — Breadth-First Search">
        <p className="text-foreground/80 leading-relaxed mb-4">
          BFS explores a graph <strong>level by level</strong> using a <strong>queue</strong>. It visits
          all neighbors of the current node before moving to the next level. This guarantees the
          <strong> shortest path</strong> in unweighted graphs.
        </p>

        <div className="bg-card rounded-xl border border-border p-5 my-4">
          <h4 className="font-semibold mb-3 text-accent-light">BFS Level-by-Level Visualization</h4>
          <div className="font-mono text-sm bg-code-bg rounded-lg p-4 overflow-x-auto">
            <p className="text-muted">{"// Graph:     0 --- 1 --- 4"}</p>
            <p className="text-muted">{"//            |     |"}</p>
            <p className="text-muted">{"//            2 --- 3"}</p>
            <p className="text-foreground/90 mt-2">{"BFS from 0:"}</p>
            <p className="text-foreground/90">{"Level 0: [0]              ← start"}</p>
            <p className="text-foreground/90">{"Level 1: [1, 2]          ← neighbors of 0"}</p>
            <p className="text-foreground/90">{"Level 2: [3, 4]          ← neighbors of 1,2"}</p>
            <p className="text-success mt-1">{"Shortest distances: 0→0, 1→1, 2→1, 3→2, 4→2"}</p>
          </div>
        </div>

        <CodeBlock
          title="BFS on a Graph — Standard Template"
          code={`void bfs(vector<vector<int>>& adj, int start) {
    int n = adj.size();
    vector<bool> visited(n, false);
    queue<int> q;
    
    visited[start] = true;
    q.push(start);
    
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        
        cout << node << " ";  // Process node
        
        for (int neighbor : adj[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
}
// Time: O(V + E), Space: O(V)`}
        />

        <CodeBlock
          title="BFS Shortest Path — Track Distance"
          code={`vector<int> bfsShortestPath(vector<vector<int>>& adj, int start) {
    int n = adj.size();
    vector<int> dist(n, -1);  // -1 = not visited
    queue<int> q;
    
    dist[start] = 0;
    q.push(start);
    
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        
        for (int neighbor : adj[node]) {
            if (dist[neighbor] == -1) {  // Not visited
                dist[neighbor] = dist[node] + 1;
                q.push(neighbor);
            }
        }
    }
    
    return dist;  // dist[i] = shortest distance from start to i
}

// To reconstruct the path, also store parent:
vector<int> parent(n, -1);
// In the loop: parent[neighbor] = node;
// Then trace back: node → parent[node] → parent[parent[node]] → ... → start`}
        />

        <CodeBlock
          title="BFS with Level Tracking"
          code={`// Process nodes level by level (useful for many problems)
void bfsLevels(vector<vector<int>>& adj, int start) {
    int n = adj.size();
    vector<bool> visited(n, false);
    queue<int> q;
    
    visited[start] = true;
    q.push(start);
    int level = 0;
    
    while (!q.empty()) {
        int size = q.size();  // Nodes in current level
        
        cout << "Level " << level << ": ";
        for (int i = 0; i < size; i++) {
            int node = q.front();
            q.pop();
            cout << node << " ";
            
            for (int neighbor : adj[node]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    q.push(neighbor);
                }
            }
        }
        cout << endl;
        level++;
    }
}
// Key trick: snapshot q.size() at each level
// This lets you process one complete level at a time`}
        />

        <KeyPoint>
          <strong>BFS = queue + visited + level-by-level.</strong> The key pattern is:
          (1) mark visited WHEN PUSHING (not when popping), (2) use q.size() to process one level
          at a time when needed.
        </KeyPoint>
      </Section>

      {/* DFS Overview */}
      <Section icon={Zap} title="DFS — Depth-First Search">
        <p className="text-foreground/80 leading-relaxed mb-4">
          DFS explores a graph by going <strong>as deep as possible</strong> along each path before
          backtracking. It uses a <strong>stack</strong> (or recursion). DFS is the backbone of
          cycle detection, topological sort, and path-finding problems.
        </p>

        <div className="bg-card rounded-xl border border-border p-5 my-4">
          <h4 className="font-semibold mb-3 text-accent-light">DFS Traversal Visualization</h4>
          <div className="font-mono text-sm bg-code-bg rounded-lg p-4 overflow-x-auto">
            <p className="text-muted">{"// Graph:     0 --- 1 --- 4"}</p>
            <p className="text-muted">{"//            |     |"}</p>
            <p className="text-muted">{"//            2 --- 3"}</p>
            <p className="text-foreground/90 mt-2">{"DFS from 0: (recursive)"}</p>
            <p className="text-foreground/90">{"  Visit 0 → Visit 1 → Visit 3 → Visit 2 (backtrack)"}</p>
            <p className="text-foreground/90">{"  → Visit 4 (backtrack to 1, then 0)"}</p>
            <p className="text-foreground/90">{"  Order: 0, 1, 3, 2, 4"}</p>
            <p className="text-warning mt-1">{"Note: DFS order depends on neighbor order — NOT shortest path!"}</p>
          </div>
        </div>

        <CodeBlock
          title="DFS — Recursive (Most Common in Interviews)"
          code={`void dfs(vector<vector<int>>& adj, int node, vector<bool>& visited) {
    visited[node] = true;
    cout << node << " ";  // Process node
    
    for (int neighbor : adj[node]) {
        if (!visited[neighbor]) {
            dfs(adj, neighbor, visited);
        }
    }
}

// Call:
vector<bool> visited(n, false);
dfs(adj, 0, visited);  // Start from node 0

// Time: O(V + E), Space: O(V) for recursion stack + visited`}
        />

        <CodeBlock
          title="DFS — Iterative (Using Explicit Stack)"
          code={`void dfsIterative(vector<vector<int>>& adj, int start) {
    int n = adj.size();
    vector<bool> visited(n, false);
    stack<int> st;
    
    st.push(start);
    
    while (!st.empty()) {
        int node = st.top();
        st.pop();
        
        if (visited[node]) continue;  // Already processed
        visited[node] = true;
        cout << node << " ";
        
        // Push neighbors in reverse order for same order as recursive
        for (int i = adj[node].size() - 1; i >= 0; i--) {
            if (!visited[adj[node][i]]) {
                st.push(adj[node][i]);
            }
        }
    }
}
// Note: iterative DFS marks visited on POP, not push
// This is different from BFS which marks on push`}
        />

        <Warning>
          <strong>BFS marks visited when PUSHING. DFS (iterative) marks visited when POPPING.</strong> This
          is a common source of bugs. With recursive DFS, you mark visited at the start of the function
          (equivalent to when entering/popping).
        </Warning>
      </Section>

      {/* BFS vs DFS */}
      <Section icon={Brain} title="BFS vs DFS — When to Use Which">
        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-card">
                <th className="text-left p-3 border-b border-border font-semibold">Aspect</th>
                <th className="text-left p-3 border-b border-border font-semibold">BFS</th>
                <th className="text-left p-3 border-b border-border font-semibold">DFS</th>
              </tr>
            </thead>
            <tbody>
              {[
                { aspect: "Data structure", bfs: "Queue", dfs: "Stack / Recursion" },
                { aspect: "Order", bfs: "Level by level", dfs: "As deep as possible" },
                { aspect: "Shortest path (unweighted)", bfs: "Yes ✓", dfs: "No ✗" },
                { aspect: "Space (worst)", bfs: "O(V) — wide levels", dfs: "O(V) — deep paths" },
                { aspect: "Cycle detection", bfs: "Possible but awkward", dfs: "Natural and clean" },
                { aspect: "Topological sort", bfs: "Kahn's algorithm", dfs: "Post-order + reverse" },
                { aspect: "Connected components", bfs: "Yes", dfs: "Yes" },
                { aspect: "Backtracking", bfs: "No", dfs: "Yes — natural fit" },
              ].map((row) => (
                <tr key={row.aspect} className="border-b border-border/50 hover:bg-card/50">
                  <td className="p-3 font-semibold">{row.aspect}</td>
                  <td className="p-3 text-xs">{row.bfs}</td>
                  <td className="p-3 text-xs">{row.dfs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 md:grid-cols-2 my-4">
          <div className="p-4 bg-card rounded-lg border border-success/30">
            <h4 className="font-semibold text-success text-sm mb-2">Use BFS When:</h4>
            <ul className="text-xs text-foreground/80 space-y-1">
              <li>- Shortest path in unweighted graph</li>
              <li>- Level-order processing</li>
              <li>- Multi-source shortest distance</li>
              <li>- Rotting oranges, walls &amp; gates, 01-matrix</li>
              <li>- Shortest maze path</li>
            </ul>
          </div>
          <div className="p-4 bg-card rounded-lg border border-accent/30">
            <h4 className="font-semibold text-accent-light text-sm mb-2">Use DFS When:</h4>
            <ul className="text-xs text-foreground/80 space-y-1">
              <li>- Explore all paths / all solutions</li>
              <li>- Cycle detection</li>
              <li>- Topological sort</li>
              <li>- Connected components / islands</li>
              <li>- Backtracking problems</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Classic Problems */}
      <Section icon={Brain} title="Classic BFS/DFS Interview Problems">
        <h3 className="text-lg font-semibold mt-2 mb-3 text-accent-light">1. Number of Islands</h3>
        <CodeBlock
          title="Number of Islands — DFS on Grid"
          code={`int numIslands(vector<vector<char>>& grid) {
    int rows = grid.size(), cols = grid[0].size();
    int count = 0;
    
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == '1') {
                count++;              // Found new island
                dfs(grid, r, c);      // Sink the entire island
            }
        }
    }
    return count;
}

void dfs(vector<vector<char>>& grid, int r, int c) {
    if (r < 0 || r >= grid.size() || c < 0 || c >= grid[0].size())
        return;
    if (grid[r][c] != '1') return;
    
    grid[r][c] = '0';  // Mark visited (sink)
    
    dfs(grid, r + 1, c);
    dfs(grid, r - 1, c);
    dfs(grid, r, c + 1);
    dfs(grid, r, c - 1);
}
// Time: O(rows × cols), Space: O(rows × cols) recursion stack
// Each cell visited exactly once`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">2. Rotting Oranges (Multi-Source BFS)</h3>
        <CodeBlock
          title="Rotting Oranges — Multi-Source BFS"
          code={`int orangesRotting(vector<vector<int>>& grid) {
    int rows = grid.size(), cols = grid[0].size();
    queue<pair<int,int>> q;
    int fresh = 0;
    
    // Step 1: Find all rotten oranges and count fresh
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == 2) q.push({r, c});      // Rotten → queue
            else if (grid[r][c] == 1) fresh++;          // Count fresh
        }
    }
    
    if (fresh == 0) return 0;  // No fresh oranges
    
    int dx[] = {0, 0, 1, -1};
    int dy[] = {1, -1, 0, 0};
    int minutes = 0;
    
    // Step 2: BFS — each level = 1 minute
    while (!q.empty()) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            auto [r, c] = q.front();
            q.pop();
            
            for (int d = 0; d < 4; d++) {
                int nr = r + dx[d], nc = c + dy[d];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                    && grid[nr][nc] == 1) {
                    grid[nr][nc] = 2;  // Rot it
                    fresh--;
                    q.push({nr, nc});
                }
            }
        }
        minutes++;
    }
    
    return fresh == 0 ? minutes - 1 : -1;
}
// Key insight: ALL rotten oranges start in queue simultaneously
// BFS levels = time steps. Classic multi-source BFS.`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">3. Clone Graph (DFS + Hash Map)</h3>
        <CodeBlock
          title="Clone Graph — DFS with Hash Map"
          code={`// Deep copy a graph. Each node has val and vector<Node*> neighbors.
class Solution {
    unordered_map<Node*, Node*> cloned;  // old → new
    
public:
    Node* cloneGraph(Node* node) {
        if (!node) return nullptr;
        
        // Already cloned?
        if (cloned.count(node)) return cloned[node];
        
        // Create clone
        Node* copy = new Node(node->val);
        cloned[node] = copy;
        
        // Recursively clone neighbors
        for (Node* neighbor : node->neighbors) {
            copy->neighbors.push_back(cloneGraph(neighbor));
        }
        
        return copy;
    }
};
// Time: O(V + E), Space: O(V) for hash map
// The hash map prevents infinite loops on cycles`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">4. Detect Cycle (Undirected)</h3>
        <CodeBlock
          title="Cycle Detection — DFS with Parent Tracking"
          code={`bool hasCycle(vector<vector<int>>& adj, int n) {
    vector<bool> visited(n, false);
    
    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            if (dfsCycle(adj, i, -1, visited)) return true;
        }
    }
    return false;
}

bool dfsCycle(vector<vector<int>>& adj, int node, int parent,
              vector<bool>& visited) {
    visited[node] = true;
    
    for (int neighbor : adj[node]) {
        if (!visited[neighbor]) {
            if (dfsCycle(adj, neighbor, node, visited)) return true;
        } else if (neighbor != parent) {
            return true;  // Visited neighbor that isn't parent → CYCLE!
        }
    }
    return false;
}
// Key: if we see a visited neighbor that isn't our parent,
// we've found a back edge → cycle exists`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">5. Bipartite Check (BFS 2-Coloring)</h3>
        <CodeBlock
          title="Is Graph Bipartite? — BFS Coloring"
          code={`bool isBipartite(vector<vector<int>>& adj) {
    int n = adj.size();
    vector<int> color(n, -1);  // -1 = uncolored
    
    for (int i = 0; i < n; i++) {
        if (color[i] != -1) continue;  // Already colored
        
        // BFS from this node
        queue<int> q;
        q.push(i);
        color[i] = 0;
        
        while (!q.empty()) {
            int node = q.front();
            q.pop();
            
            for (int neighbor : adj[node]) {
                if (color[neighbor] == -1) {
                    color[neighbor] = 1 - color[node];  // Opposite color
                    q.push(neighbor);
                } else if (color[neighbor] == color[node]) {
                    return false;  // Same color → NOT bipartite
                }
            }
        }
    }
    return true;
}
// Try to 2-color the graph. If any adjacent nodes get same color → fail.`}
        />

        <KeyPoint>
          <strong>Pattern recognition is key.</strong> Number of Islands = connected components (DFS).
          Rotting Oranges = multi-source BFS. Clone Graph = DFS + memo. Cycle detection = DFS + parent.
          Bipartite = BFS + 2-coloring.
        </KeyPoint>
      </Section>

      {/* BFS/DFS on Grids */}
      <Section icon={Code2} title="BFS/DFS on Grids — The Template">
        <CodeBlock
          title="Grid BFS Template (Shortest Path in Maze)"
          code={`int shortestPath(vector<vector<int>>& grid, pair<int,int> start, pair<int,int> end) {
    int rows = grid.size(), cols = grid[0].size();
    int dx[] = {0, 0, 1, -1};
    int dy[] = {1, -1, 0, 0};
    
    vector<vector<bool>> visited(rows, vector<bool>(cols, false));
    queue<pair<int,int>> q;
    
    q.push(start);
    visited[start.first][start.second] = true;
    int dist = 0;
    
    while (!q.empty()) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            auto [r, c] = q.front();
            q.pop();
            
            if (r == end.first && c == end.second) return dist;
            
            for (int d = 0; d < 4; d++) {
                int nr = r + dx[d], nc = c + dy[d];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                    && !visited[nr][nc] && grid[nr][nc] == 0) {
                    visited[nr][nc] = true;
                    q.push({nr, nc});
                }
            }
        }
        dist++;
    }
    return -1;  // No path found
}`}
        />

        <CodeBlock
          title="Grid DFS Template (Flood Fill / Islands)"
          code={`void dfs(vector<vector<int>>& grid, int r, int c, int target) {
    // Bounds check
    if (r < 0 || r >= grid.size() || c < 0 || c >= grid[0].size())
        return;
    // Value check
    if (grid[r][c] != target) return;
    
    grid[r][c] = -1;  // Mark visited (or change value)
    
    dfs(grid, r + 1, c, target);  // Down
    dfs(grid, r - 1, c, target);  // Up
    dfs(grid, r, c + 1, target);  // Right
    dfs(grid, r, c - 1, target);  // Left
}

// Usage for Number of Islands:
int count = 0;
for (int r = 0; r < rows; r++) {
    for (int c = 0; c < cols; c++) {
        if (grid[r][c] == 1) {
            count++;
            dfs(grid, r, c, 1);
        }
    }
}`}
        />
      </Section>

      {/* C++ Syntax Reference */}
      <Section icon={Code2} title="C++ Syntax Reference">
        <CodeBlock
          title="BFS & DFS — Complete Reference"
          code={`#include <vector>
#include <queue>
#include <stack>
using namespace std;

// ========== BFS Template ==========
void bfs(vector<vector<int>>& adj, int start) {
    vector<bool> visited(adj.size(), false);
    queue<int> q;
    visited[start] = true;
    q.push(start);
    
    while (!q.empty()) {
        int node = q.front(); q.pop();
        // Process node
        for (int nb : adj[node]) {
            if (!visited[nb]) {
                visited[nb] = true;  // Mark on PUSH
                q.push(nb);
            }
        }
    }
}

// ========== DFS Template (Recursive) ==========
void dfs(vector<vector<int>>& adj, int node, vector<bool>& vis) {
    vis[node] = true;
    // Process node
    for (int nb : adj[node]) {
        if (!vis[nb]) dfs(adj, nb, vis);
    }
}

// ========== Connected Components ==========
int components = 0;
vector<bool> vis(n, false);
for (int i = 0; i < n; i++) {
    if (!vis[i]) {
        components++;
        dfs(adj, i, vis);  // or bfs
    }
}

// ========== BFS Shortest Distance ==========
vector<int> dist(n, -1);
dist[start] = 0;
queue<int> q; q.push(start);
while (!q.empty()) {
    int u = q.front(); q.pop();
    for (int v : adj[u]) {
        if (dist[v] == -1) {
            dist[v] = dist[u] + 1;
            q.push(v);
        }
    }
}

// ========== Grid Directions ==========
int dx[] = {0, 0, 1, -1};
int dy[] = {1, -1, 0, 0};

// ========== Multi-Source BFS ==========
queue<pair<int,int>> q;
for (/* all sources */) q.push(source);
// Then normal BFS — distances from nearest source`}
        />
      </Section>

      {/* Coding Challenges */}
      <Section icon={Code2} title="Coding Challenges">
        <CodingChallenge
          title="Challenge 1: Number of Connected Components"
          description="Given an undirected graph with n nodes (0 to n-1) and an adjacency list, count the number of connected components using DFS."
          starterCode={`int countComponents(int n, vector<vector<int>>& adj) {
    // Use a visited array
    // Loop through all nodes, DFS from each unvisited one
    // Each DFS = one component

}`}
          solution={`int countComponents(int n, vector<vector<int>>& adj) {
    vector<bool> visited(n, false);
    int count = 0;
    
    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            count++;
            dfs(adj, i, visited);
        }
    }
    return count;
}

void dfs(vector<vector<int>>& adj, int node, vector<bool>& visited) {
    visited[node] = true;
    for (int nb : adj[node]) {
        if (!visited[nb]) dfs(adj, nb, visited);
    }
}`}
          hints={[
            "Create a visited array of size n, all false.",
            "Loop i from 0 to n-1. If !visited[i], increment count and DFS from i.",
            "DFS marks all reachable nodes as visited — that's one component.",
          ]}
          testDescription="Each DFS from an unvisited node discovers one connected component."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("visited") &&
              lower.includes("count++") &&
              lower.includes("dfs(")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 2: BFS Shortest Path"
          description="Given an unweighted graph and a start node, return a vector of shortest distances from start to every other node. Use -1 for unreachable nodes."
          starterCode={`vector<int> shortestDistances(vector<vector<int>>& adj, int start) {
    int n = adj.size();
    // BFS from start, track distances

}`}
          solution={`vector<int> shortestDistances(vector<vector<int>>& adj, int start) {
    int n = adj.size();
    vector<int> dist(n, -1);
    queue<int> q;
    
    dist[start] = 0;
    q.push(start);
    
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        
        for (int nb : adj[node]) {
            if (dist[nb] == -1) {
                dist[nb] = dist[node] + 1;
                q.push(nb);
            }
        }
    }
    
    return dist;
}`}
          hints={[
            "Initialize dist[start] = 0, all others = -1.",
            "BFS: for each neighbor, if dist == -1, set dist = dist[node] + 1.",
            "dist[i] == -1 at the end means node i is unreachable.",
          ]}
          testDescription="BFS guarantees shortest distances in unweighted graphs. dist acts as both distance tracker and visited array."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("dist[start]=0") &&
              lower.includes("dist[nb]==-1") || lower.includes("dist[neighbor]==-1") &&
              lower.includes("dist[n") &&
              lower.includes("q.push")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 3: Detect Cycle in Undirected Graph"
          description="Given an undirected graph as an adjacency list, return true if the graph contains a cycle. Use DFS with parent tracking."
          starterCode={`bool hasCycle(vector<vector<int>>& adj, int n) {
    // Loop through all nodes
    // DFS with parent tracking
    // If visited neighbor != parent → cycle

}`}
          solution={`bool hasCycle(vector<vector<int>>& adj, int n) {
    vector<bool> visited(n, false);
    
    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            if (dfsCycle(adj, i, -1, visited))
                return true;
        }
    }
    return false;
}

bool dfsCycle(vector<vector<int>>& adj, int node, int parent,
              vector<bool>& visited) {
    visited[node] = true;
    
    for (int nb : adj[node]) {
        if (!visited[nb]) {
            if (dfsCycle(adj, nb, node, visited))
                return true;
        } else if (nb != parent) {
            return true;  // Cycle!
        }
    }
    return false;
}`}
          hints={[
            "Pass the parent node to DFS to distinguish back edges from tree edges.",
            "If a neighbor is visited AND not the parent → cycle found (back edge).",
            "Check all components — a cycle could be in any one.",
          ]}
          testDescription="DFS with parent: visited neighbor ≠ parent means we found a back edge → cycle."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("parent") &&
              lower.includes("!=parent") &&
              lower.includes("returntrue")
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
              <span><strong>BFS = queue, level-by-level, shortest path.</strong> Mark visited on push. O(V+E).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>DFS = stack/recursion, go deep, backtrack.</strong> Mark visited at start. O(V+E).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>BFS for shortest path</strong> in unweighted graphs. DFS for cycle detection, topological sort, backtracking.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Connected components:</strong> loop all nodes, BFS/DFS from each unvisited. Count = components.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Multi-source BFS:</strong> push all sources first, then BFS. Gives shortest distance from ANY source.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Grids use dx/dy arrays.</strong> Number of Islands = DFS components. Rotting Oranges = multi-source BFS.</span>
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
