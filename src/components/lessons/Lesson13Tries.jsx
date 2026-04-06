"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
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
    question: "What is a Trie (prefix tree)?",
    options: [
      "A balanced binary tree",
      "A tree where each node represents a character, and paths from root to nodes form prefixes of stored words",
      "A hash table for strings",
      "A binary search tree for strings",
    ],
    correctIndex: 1,
    explanation:
      "A Trie is a tree-like data structure where each node represents one character. Paths from the root represent prefixes of stored strings. Shared prefixes share the same path, making prefix lookups extremely fast.",
  },
  {
    id: 2,
    question: "What is the time complexity of searching for a word of length m in a Trie?",
    options: ["O(n) where n = number of words", "O(n log n)", "O(m) where m = word length", "O(1)"],
    correctIndex: 2,
    explanation:
      "Trie search is O(m) — you traverse m nodes, one per character. This is independent of how many words are stored! Compare with hash table O(m) for hashing the string, and BST O(m log n) for string comparisons.",
  },
  {
    id: 3,
    question: "What is the main advantage of a Trie over a hash set for strings?",
    options: [
      "Tries use less memory",
      "Tries support prefix queries (autocomplete, startsWith) efficiently",
      "Tries are faster for exact lookups",
      "Tries are simpler to implement",
    ],
    correctIndex: 1,
    explanation:
      "Tries excel at prefix operations: 'find all words starting with pre' is O(prefix length + number of results). Hash sets can only do exact lookups. This makes tries ideal for autocomplete, spell checkers, and IP routing.",
  },
  {
    id: 4,
    question: "How many children can each node in a standard Trie have (for lowercase English)?",
    options: ["2", "26", "52", "128"],
    correctIndex: 1,
    explanation:
      "For lowercase English letters, each node can have up to 26 children (a-z). This is typically implemented as an array of 26 pointers or a hash map of children. For general ASCII, it would be 128.",
  },
  {
    id: 5,
    question: "What does the 'isEnd' (or 'isWord') flag in a Trie node indicate?",
    options: [
      "The node is a leaf",
      "The node has no children",
      "The path from root to this node forms a complete word that was inserted",
      "The trie is full",
    ],
    correctIndex: 2,
    explanation:
      "isEnd marks that the path from root to this node represents a complete word. For example, if you insert 'app' and 'apple', the node at 'p' (after a-p-p) has isEnd=true, and so does the node at 'e' (after a-p-p-l-e).",
  },
  {
    id: 6,
    question: "What is the space complexity of a Trie storing n words of average length m?",
    options: ["O(n)", "O(m)", "O(n × m × ALPHABET_SIZE) worst case", "O(log n)"],
    correctIndex: 2,
    explanation:
      "Worst case: every word has unique characters → n × m nodes, each with an array of ALPHABET_SIZE (26) pointers. In practice, shared prefixes reduce this significantly. Using hash maps instead of arrays also helps.",
  },
  {
    id: 7,
    question: "How do you implement autocomplete (find all words with a given prefix)?",
    options: [
      "Sort all words and binary search",
      "Navigate to the prefix node in the Trie, then DFS to collect all words below it",
      "Use a hash map",
      "Check every word one by one",
    ],
    correctIndex: 1,
    explanation:
      "Step 1: Traverse the Trie following the prefix characters — O(prefix length). Step 2: From that node, DFS to find all complete words (isEnd=true) below it. Total: O(prefix + number of results).",
  },
  {
    id: 8,
    question: "Can you delete a word from a Trie?",
    options: [
      "No, tries are insert-only",
      "Yes, but you have to rebuild the whole trie",
      "Yes, unmark isEnd and optionally remove nodes that are no longer needed",
      "Yes, just remove the root",
    ],
    correctIndex: 2,
    explanation:
      "To delete: navigate to the word's end node and set isEnd=false. Optionally, prune nodes bottom-up if they have no children and no other word passes through them. This keeps the Trie clean.",
  },
  {
    id: 9,
    question: "What is the 'Word Search II' problem's approach?",
    options: [
      "Sort the board",
      "Build a Trie from the word list, then DFS on the board using the Trie to prune invalid paths",
      "Use dynamic programming",
      "Binary search on the board",
    ],
    correctIndex: 1,
    explanation:
      "Insert all target words into a Trie. DFS from each cell on the board, following Trie edges. If the current path doesn't exist in the Trie, prune (stop exploring). This avoids checking each word separately — much faster than brute force.",
  },
  {
    id: 10,
    question: "When should you use a Trie instead of an unordered_set<string>?",
    options: [
      "Always",
      "When you need prefix matching, autocomplete, or word-by-word character processing",
      "When you have fewer than 10 words",
      "When words are very long",
    ],
    correctIndex: 1,
    explanation:
      "Use Trie when: prefix queries (startsWith), autocomplete, spell checking, wildcard matching, or problems where you build words character by character (like Word Search). Use hash set for simple exact-match lookups.",
  },
  {
    id: 11,
    question: "What is the difference between using an array vs hash map for Trie children?",
    options: [
      "Array is always better",
      "Array: O(1) access, fixed 26 pointers per node (wastes space). Hash map: dynamic, saves space but slightly slower.",
      "Hash map is always better",
      "There is no difference",
    ],
    correctIndex: 1,
    explanation:
      "Array children[26]: fast O(1) access, but every node allocates 26 pointers even if mostly unused. unordered_map<char, TrieNode*>: only allocates for existing children, saves memory for sparse tries, but has hash overhead.",
  },
  {
    id: 12,
    question: "How does a Trie help with the 'longest common prefix' problem?",
    options: [
      "It doesn't",
      "Insert all words, then traverse from root while each node has exactly one child — that path is the LCP",
      "Sort the words first",
      "Use binary search",
    ],
    correctIndex: 1,
    explanation:
      "Insert all words into a Trie. The longest common prefix is the path from root where every node has exactly one child (and isn't a word end with remaining words). Once a node has 2+ children, the prefix splits.",
  },
];

export default function Lesson13Tries({ onQuizComplete }) {
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
      {/* What is a Trie? */}
      <Section icon={BookOpen} title="What is a Trie (Prefix Tree)?">
        <p className="text-foreground/80 leading-relaxed mb-4">
          A <strong>Trie</strong> (pronounced &quot;try&quot;, from re<em>trie</em>val) is a tree where each node
          represents a <strong>single character</strong>. Paths from root to nodes spell out prefixes.
          Shared prefixes share the same path — making prefix lookups blazingly fast.
        </p>

        <div className="bg-card rounded-xl border border-border p-5 my-4">
          <h4 className="font-semibold mb-3 text-accent-light">Trie Storing: &quot;app&quot;, &quot;apple&quot;, &quot;ape&quot;, &quot;bat&quot;</h4>
          <div className="font-mono text-sm bg-code-bg rounded-lg p-4 overflow-x-auto">
            <p className="text-foreground/90">{"         (root)"}</p>
            <p className="text-foreground/90">{"        /      \\"}</p>
            <p className="text-foreground/90">{"       a        b"}</p>
            <p className="text-foreground/90">{"       |        |"}</p>
            <p className="text-foreground/90">{"       p        a"}</p>
            <p className="text-foreground/90">{"      / \\       |"}</p>
            <p className="text-foreground/90">{"     p   e*     t*"}</p>
            <p className="text-foreground/90">{"     |*"}</p>
            <p className="text-foreground/90">{"     l"}</p>
            <p className="text-foreground/90">{"     |"}</p>
            <p className="text-foreground/90">{"     e*"}</p>
            <p className="text-muted mt-2">{"* = isEnd (complete word ends here)"}</p>
            <p className="text-muted">{"'app' and 'apple' share the prefix 'app'"}</p>
          </div>
        </div>

        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-card">
                <th className="text-left p-3 border-b border-border font-semibold">Operation</th>
                <th className="text-left p-3 border-b border-border font-semibold">Trie</th>
                <th className="text-left p-3 border-b border-border font-semibold">Hash Set</th>
                <th className="text-left p-3 border-b border-border font-semibold">Sorted Array</th>
              </tr>
            </thead>
            <tbody>
              {[
                { op: "Insert word (len m)", trie: "O(m)", hash: "O(m)", arr: "O(m + n)" },
                { op: "Search exact word", trie: "O(m)", hash: "O(m)", arr: "O(m log n)" },
                { op: "startsWith prefix", trie: "O(p)", hash: "O(n × m)", arr: "O(m log n)" },
                { op: "Autocomplete", trie: "O(p + results)", hash: "O(n × m)", arr: "O(m log n + k)" },
                { op: "Delete word", trie: "O(m)", hash: "O(m)", arr: "O(m + n)" },
              ].map((row) => (
                <tr key={row.op} className="border-b border-border/50 hover:bg-card/50">
                  <td className="p-3 font-semibold">{row.op}</td>
                  <td className="p-3 font-mono text-xs text-success">{row.trie}</td>
                  <td className="p-3 font-mono text-xs">{row.hash}</td>
                  <td className="p-3 font-mono text-xs">{row.arr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <KeyPoint>
          <strong>Tries dominate when you need prefix operations.</strong> Hash sets can&apos;t do
          &quot;find all words starting with X&quot; efficiently. Tries do it in O(prefix length + results).
        </KeyPoint>
      </Section>

      {/* Trie Implementation */}
      <Section icon={Code2} title="Trie Implementation in C++">
        <CodeBlock
          title="Trie — Array-Based Children (Standard Interview Version)"
          code={`struct TrieNode {
    TrieNode* children[26];  // a-z
    bool isEnd;
    
    TrieNode() : isEnd(false) {
        memset(children, 0, sizeof(children));  // Initialize all to nullptr
    }
};

class Trie {
    TrieNode* root;
    
public:
    Trie() {
        root = new TrieNode();
    }
    
    // INSERT a word — O(m)
    void insert(const string& word) {
        TrieNode* node = root;
        for (char c : word) {
            int idx = c - 'a';
            if (!node->children[idx]) {
                node->children[idx] = new TrieNode();
            }
            node = node->children[idx];
        }
        node->isEnd = true;  // Mark end of word
    }
    
    // SEARCH for exact word — O(m)
    bool search(const string& word) {
        TrieNode* node = root;
        for (char c : word) {
            int idx = c - 'a';
            if (!node->children[idx]) return false;
            node = node->children[idx];
        }
        return node->isEnd;  // Must be a complete word!
    }
    
    // STARTS WITH prefix check — O(p)
    bool startsWith(const string& prefix) {
        TrieNode* node = root;
        for (char c : prefix) {
            int idx = c - 'a';
            if (!node->children[idx]) return false;
            node = node->children[idx];
        }
        return true;  // Don't need isEnd — any prefix counts
    }
};

// Usage:
Trie trie;
trie.insert("apple");
trie.search("apple");    // true
trie.search("app");      // false — "app" wasn't inserted
trie.startsWith("app");  // true — "apple" starts with "app"
trie.insert("app");
trie.search("app");      // true — now it's a complete word`}
        />

        <CodeBlock
          title="Trie — Hash Map Children (Space Efficient)"
          code={`struct TrieNode {
    unordered_map<char, TrieNode*> children;  // Dynamic — only stores existing chars
    bool isEnd = false;
};

class Trie {
    TrieNode* root = new TrieNode();
    
public:
    void insert(const string& word) {
        TrieNode* node = root;
        for (char c : word) {
            if (!node->children.count(c)) {
                node->children[c] = new TrieNode();
            }
            node = node->children[c];
        }
        node->isEnd = true;
    }
    
    bool search(const string& word) {
        TrieNode* node = root;
        for (char c : word) {
            if (!node->children.count(c)) return false;
            node = node->children[c];
        }
        return node->isEnd;
    }
    
    bool startsWith(const string& prefix) {
        TrieNode* node = root;
        for (char c : prefix) {
            if (!node->children.count(c)) return false;
            node = node->children[c];
        }
        return true;
    }
};

// Pros: saves memory for sparse tries (few children per node)
// Cons: slightly slower due to hash map overhead
// Use this when alphabet is large (Unicode, etc.)`}
        />

        <Warning>
          <strong>search() vs startsWith():</strong> The ONLY difference is the return at the end.
          search() returns <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">node-&gt;isEnd</code> (must
          be a complete word), startsWith() returns <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">true</code> (any
          prefix counts). Don&apos;t mix them up in interviews!
        </Warning>
      </Section>

      {/* Autocomplete */}
      <Section icon={Zap} title="Autocomplete — The Killer Feature">
        <CodeBlock
          title="Autocomplete: Find All Words with a Given Prefix"
          code={`class Trie {
    TrieNode* root = new TrieNode();
    
    // Helper: DFS to collect all words from a node
    void collectWords(TrieNode* node, string& current, vector<string>& results) {
        if (node->isEnd) {
            results.push_back(current);
        }
        
        for (int i = 0; i < 26; i++) {
            if (node->children[i]) {
                current.push_back('a' + i);
                collectWords(node->children[i], current, results);
                current.pop_back();  // Backtrack
            }
        }
    }
    
public:
    void insert(const string& word) { /* ... same as before ... */ }
    
    // Find all words starting with prefix
    vector<string> autocomplete(const string& prefix) {
        TrieNode* node = root;
        
        // Navigate to prefix node
        for (char c : prefix) {
            int idx = c - 'a';
            if (!node->children[idx]) return {};  // No words with this prefix
            node = node->children[idx];
        }
        
        // DFS to collect all words below this node
        vector<string> results;
        string current = prefix;
        collectWords(node, current, results);
        return results;
    }
};

// Usage:
Trie trie;
trie.insert("apple");
trie.insert("app");
trie.insert("application");
trie.insert("ape");
trie.insert("banana");

trie.autocomplete("app");
// Returns: ["app", "apple", "application"]
// Time: O(prefix_length + total_chars_in_results)`}
        />
      </Section>

      {/* Classic Trie Problems */}
      <Section icon={Brain} title="Classic Trie Interview Problems">
        <h3 className="text-lg font-semibold mt-2 mb-3 text-accent-light">1. Word Search II (Hard)</h3>
        <CodeBlock
          title="Word Search II — Trie + Board DFS"
          code={`// Given a board and a list of words, find all words on the board
// Words can be formed by adjacent cells (horizontally/vertically)

vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
    // Step 1: Build Trie from word list
    Trie trie;
    for (const string& word : words) {
        trie.insert(word);
    }
    
    // Step 2: DFS from each cell, guided by Trie
    vector<string> result;
    int rows = board.size(), cols = board[0].size();
    
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            string path = "";
            dfs(board, r, c, trie.root, path, result);
        }
    }
    return result;
}

void dfs(vector<vector<char>>& board, int r, int c,
         TrieNode* node, string& path, vector<string>& result) {
    // Bounds check
    if (r < 0 || r >= board.size() || c < 0 || c >= board[0].size())
        return;
    
    char ch = board[r][c];
    if (ch == '#' || !node->children[ch - 'a']) return;  // Visited or not in Trie
    
    node = node->children[ch - 'a'];
    path.push_back(ch);
    
    if (node->isEnd) {
        result.push_back(path);
        node->isEnd = false;  // Avoid duplicates
    }
    
    board[r][c] = '#';  // Mark visited
    dfs(board, r+1, c, node, path, result);
    dfs(board, r-1, c, node, path, result);
    dfs(board, r, c+1, node, path, result);
    dfs(board, r, c-1, node, path, result);
    board[r][c] = ch;   // Unmark
    path.pop_back();     // Backtrack
}

// Why Trie? Without it, you'd search for each word separately = O(words × cells × 4^len)
// With Trie: one DFS pass, prune invalid paths early = MUCH faster`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">2. Add & Search with Wildcards</h3>
        <CodeBlock
          title="Design Add and Search Words — Dot Wildcard"
          code={`// '.' matches any single character
// search("b.d") should match "bad", "bed", "bid", etc.

class WordDictionary {
    TrieNode* root = new TrieNode();
    
public:
    void addWord(const string& word) {
        TrieNode* node = root;
        for (char c : word) {
            int idx = c - 'a';
            if (!node->children[idx])
                node->children[idx] = new TrieNode();
            node = node->children[idx];
        }
        node->isEnd = true;
    }
    
    bool search(const string& word) {
        return dfs(word, 0, root);
    }
    
private:
    bool dfs(const string& word, int i, TrieNode* node) {
        if (i == word.size()) return node->isEnd;
        
        if (word[i] == '.') {
            // Wildcard: try ALL children
            for (int j = 0; j < 26; j++) {
                if (node->children[j] && dfs(word, i + 1, node->children[j]))
                    return true;
            }
            return false;
        } else {
            int idx = word[i] - 'a';
            if (!node->children[idx]) return false;
            return dfs(word, i + 1, node->children[idx]);
        }
    }
};

// addWord("bad"), addWord("dad"), addWord("mad")
// search("b.d") → true (matches "bad")
// search("...") → true (matches any 3-letter word)
// search(".a.") → true (matches "bad", "dad", "mad")`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">3. Longest Common Prefix</h3>
        <CodeBlock
          title="Longest Common Prefix — O(S) where S = total chars"
          code={`// Without Trie (simple approach):
string longestCommonPrefix(vector<string>& strs) {
    if (strs.empty()) return "";
    
    string prefix = strs[0];
    for (int i = 1; i < strs.size(); i++) {
        while (strs[i].find(prefix) != 0) {
            prefix = prefix.substr(0, prefix.size() - 1);
            if (prefix.empty()) return "";
        }
    }
    return prefix;
}

// With Trie (good for repeated queries):
string lcpWithTrie(vector<string>& strs) {
    Trie trie;
    for (const string& s : strs) trie.insert(s);
    
    string prefix = "";
    TrieNode* node = trie.root;
    
    while (true) {
        // Count non-null children
        int childCount = 0;
        int nextIdx = -1;
        for (int i = 0; i < 26; i++) {
            if (node->children[i]) {
                childCount++;
                nextIdx = i;
            }
        }
        
        // Stop if: multiple children (prefix splits), or word ends here
        if (childCount != 1 || node->isEnd) break;
        
        prefix += ('a' + nextIdx);
        node = node->children[nextIdx];
    }
    return prefix;
}`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">4. Count Words with Prefix</h3>
        <CodeBlock
          title="Count Words — Augmented Trie"
          code={`// Store counts in each node for O(prefix) counting

struct TrieNode {
    TrieNode* children[26] = {};
    int wordCount = 0;    // Words that end here
    int prefixCount = 0;  // Words that pass through here
};

class CountTrie {
    TrieNode* root = new TrieNode();
    
public:
    void insert(const string& word) {
        TrieNode* node = root;
        for (char c : word) {
            int idx = c - 'a';
            if (!node->children[idx])
                node->children[idx] = new TrieNode();
            node = node->children[idx];
            node->prefixCount++;  // Increment for every word passing through
        }
        node->wordCount++;
    }
    
    int countWordsEqualTo(const string& word) {
        TrieNode* node = root;
        for (char c : word) {
            int idx = c - 'a';
            if (!node->children[idx]) return 0;
            node = node->children[idx];
        }
        return node->wordCount;
    }
    
    int countWordsStartingWith(const string& prefix) {
        TrieNode* node = root;
        for (char c : prefix) {
            int idx = c - 'a';
            if (!node->children[idx]) return 0;
            node = node->children[idx];
        }
        return node->prefixCount;
    }
};

// insert("apple"), insert("app"), insert("application")
// countWordsStartingWith("app") → 3
// countWordsEqualTo("app") → 1`}
        />

        <KeyPoint>
          <strong>Augmenting the Trie with counts</strong> is a common interview extension. Store
          prefixCount (words passing through) and wordCount (words ending here) for instant counting
          queries without DFS.
        </KeyPoint>
      </Section>

      {/* When to Use a Trie */}
      <Section icon={BookOpen} title="When to Use a Trie">
        <div className="grid gap-3 md:grid-cols-2 my-4">
          <div className="p-4 bg-card rounded-lg border border-success/30">
            <h4 className="font-semibold text-success text-sm mb-2">Use a Trie When:</h4>
            <ul className="text-xs text-foreground/80 space-y-1">
              <li>- Prefix matching / autocomplete</li>
              <li>- Word search on a board</li>
              <li>- Wildcard pattern matching</li>
              <li>- Longest common prefix</li>
              <li>- Counting words with a prefix</li>
              <li>- IP routing (longest prefix match)</li>
              <li>- Spell checkers</li>
            </ul>
          </div>
          <div className="p-4 bg-card rounded-lg border border-warning/30">
            <h4 className="font-semibold text-warning text-sm mb-2">Use Hash Set When:</h4>
            <ul className="text-xs text-foreground/80 space-y-1">
              <li>- Only exact word lookups</li>
              <li>- No prefix queries needed</li>
              <li>- Memory is a concern</li>
              <li>- Simple membership testing</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* C++ Syntax Reference */}
      <Section icon={Code2} title="C++ Syntax Reference">
        <CodeBlock
          title="Trie — Complete Reference"
          code={`// ========== TrieNode ==========
struct TrieNode {
    TrieNode* children[26] = {};   // Array of 26 (a-z), all nullptr
    bool isEnd = false;
    // Optional: int prefixCount = 0, wordCount = 0;
};

// ========== Core Operations ==========
// Insert: traverse, create missing nodes, mark isEnd
void insert(string word) {
    TrieNode* node = root;
    for (char c : word) {
        if (!node->children[c - 'a'])
            node->children[c - 'a'] = new TrieNode();
        node = node->children[c - 'a'];
    }
    node->isEnd = true;
}

// Search: traverse, check isEnd at the end
bool search(string word) {
    TrieNode* node = root;
    for (char c : word) {
        if (!node->children[c - 'a']) return false;
        node = node->children[c - 'a'];
    }
    return node->isEnd;
}

// StartsWith: same as search but return true (no isEnd check)
bool startsWith(string prefix) {
    TrieNode* node = root;
    for (char c : prefix) {
        if (!node->children[c - 'a']) return false;
        node = node->children[c - 'a'];
    }
    return true;
}

// ========== Patterns ==========
// Autocomplete: navigate to prefix node, DFS to collect words
// Wildcard '.': DFS trying all 26 children
// Word Search II: build Trie from words, DFS on board with Trie pruning
// Count prefix: augment nodes with prefixCount++
// Delete: navigate to end, set isEnd=false, prune empty nodes`}
        />
      </Section>

      {/* Coding Challenges */}
      <Section icon={Code2} title="Coding Challenges">
        <CodingChallenge
          title="Challenge 1: Implement a Trie"
          description="Implement a Trie with insert, search, and startsWith methods. Use an array of 26 children per node."
          starterCode={`struct TrieNode {
    TrieNode* children[26];
    bool isEnd;
    TrieNode() : isEnd(false) {
        memset(children, 0, sizeof(children));
    }
};

class Trie {
    TrieNode* root;
public:
    Trie() { root = new TrieNode(); }
    
    void insert(string word) {
        // Navigate and create nodes
    }
    
    bool search(string word) {
        // Navigate and check isEnd
    }
    
    bool startsWith(string prefix) {
        // Navigate and return true
    }
};`}
          solution={`struct TrieNode {
    TrieNode* children[26];
    bool isEnd;
    TrieNode() : isEnd(false) {
        memset(children, 0, sizeof(children));
    }
};

class Trie {
    TrieNode* root;
public:
    Trie() { root = new TrieNode(); }
    
    void insert(string word) {
        TrieNode* node = root;
        for (char c : word) {
            int i = c - 'a';
            if (!node->children[i])
                node->children[i] = new TrieNode();
            node = node->children[i];
        }
        node->isEnd = true;
    }
    
    bool search(string word) {
        TrieNode* node = root;
        for (char c : word) {
            int i = c - 'a';
            if (!node->children[i]) return false;
            node = node->children[i];
        }
        return node->isEnd;
    }
    
    bool startsWith(string prefix) {
        TrieNode* node = root;
        for (char c : prefix) {
            int i = c - 'a';
            if (!node->children[i]) return false;
            node = node->children[i];
        }
        return true;
    }
};`}
          hints={[
            "For insert: iterate chars, create children[c-'a'] if null, advance node, mark isEnd at the end.",
            "For search: iterate chars, return false if child is null, check isEnd at the end.",
            "For startsWith: same as search but return true at the end (no isEnd check).",
          ]}
          testDescription="All three methods traverse the trie character by character. Only search checks isEnd."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("node->children[") &&
              lower.includes("node->isend=true") &&
              lower.includes("returnnode->isend") &&
              lower.includes("returntrue")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 2: Count Words with Prefix"
          description="Augment the Trie to count how many inserted words start with a given prefix. Add a prefixCount field that increments during insert."
          starterCode={`struct TrieNode {
    TrieNode* children[26] = {};
    int prefixCount = 0;
    int wordCount = 0;
};

class CountTrie {
    TrieNode* root = new TrieNode();
public:
    void insert(string word) {
        // Traverse and increment prefixCount at each node
    }
    
    int countStartsWith(string prefix) {
        // Navigate to prefix end, return prefixCount
    }
};`}
          solution={`struct TrieNode {
    TrieNode* children[26] = {};
    int prefixCount = 0;
    int wordCount = 0;
};

class CountTrie {
    TrieNode* root = new TrieNode();
public:
    void insert(string word) {
        TrieNode* node = root;
        for (char c : word) {
            int i = c - 'a';
            if (!node->children[i])
                node->children[i] = new TrieNode();
            node = node->children[i];
            node->prefixCount++;
        }
        node->wordCount++;
    }
    
    int countStartsWith(string prefix) {
        TrieNode* node = root;
        for (char c : prefix) {
            int i = c - 'a';
            if (!node->children[i]) return 0;
            node = node->children[i];
        }
        return node->prefixCount;
    }
};`}
          hints={[
            "In insert: increment prefixCount at every node you pass through.",
            "Increment wordCount only at the final node.",
            "In countStartsWith: navigate to the prefix end and return prefixCount.",
          ]}
          testDescription="prefixCount tracks how many words pass through each node."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("prefixcount++") &&
              lower.includes("wordcount++") &&
              lower.includes("returnnode->prefixcount") || lower.includes("return0")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 3: Search with Wildcard '.'"
          description="Implement search where '.' can match any single character. Use DFS to try all children when you encounter a dot."
          starterCode={`bool search(string word) {
    return dfs(word, 0, root);
}

bool dfs(string& word, int i, TrieNode* node) {
    // Base case: end of word
    // If '.', try all children
    // Otherwise, follow the specific child

}`}
          solution={`bool search(string word) {
    return dfs(word, 0, root);
}

bool dfs(string& word, int i, TrieNode* node) {
    if (i == word.size()) return node->isEnd;
    
    if (word[i] == '.') {
        for (int j = 0; j < 26; j++) {
            if (node->children[j] && dfs(word, i + 1, node->children[j]))
                return true;
        }
        return false;
    } else {
        int idx = word[i] - 'a';
        if (!node->children[idx]) return false;
        return dfs(word, i + 1, node->children[idx]);
    }
}`}
          hints={[
            "Base case: if i == word.size(), return node->isEnd.",
            "If word[i] is '.', loop through all 26 children and recurse on non-null ones.",
            "If any child path returns true, return true. If none do, return false.",
          ]}
          testDescription="DFS with branching on wildcard '.' — try all 26 possible characters."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("word[i]=='.'") &&
              lower.includes("for(intj=0;j<26;j++)") || lower.includes("for(intj=0;j<26;") &&
              lower.includes("dfs(word,i+1")
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
              <span><strong>Trie = prefix tree.</strong> Each node = one character. Paths spell prefixes. Shared prefixes share nodes.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Insert, search, startsWith are all O(word length)</strong> — independent of how many words are stored.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>search() checks isEnd, startsWith() doesn&apos;t.</strong> That&apos;s the only difference.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Autocomplete:</strong> navigate to prefix node, DFS to collect all words below.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Word Search II:</strong> build Trie from word list, DFS on board with Trie pruning. A Google favorite.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Wildcard &apos;.&apos;:</strong> DFS trying all 26 children. Augmented counts for O(1) prefix counting.</span>
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
