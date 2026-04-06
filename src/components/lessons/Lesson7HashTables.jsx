"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Hash,
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
    question: "What is the average time complexity of insert, find, and erase on an unordered_map?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
    correctIndex: 2,
    explanation:
      "Hash tables use a hash function to compute the index directly. Average case for insert, find, and erase is O(1). Worst case is O(n) if all keys hash to the same bucket (rare with good hash functions).",
  },
  {
    id: 2,
    question: "What is a hash collision?",
    options: [
      "When the hash table runs out of memory",
      "When two different keys map to the same bucket/index",
      "When a key is inserted twice",
      "When the hash function returns a negative number",
    ],
    correctIndex: 1,
    explanation:
      "A collision occurs when two different keys produce the same hash value (same bucket). This is inevitable when the key space is larger than the number of buckets. Collision resolution is how we handle this.",
  },
  {
    id: 3,
    question: "What are the two main collision resolution strategies?",
    options: [
      "Sorting and searching",
      "Chaining (linked lists in buckets) and Open Addressing (probing)",
      "Doubling and halving",
      "Hashing and rehashing",
    ],
    correctIndex: 1,
    explanation:
      "Chaining: each bucket holds a linked list of entries that hash to the same index. Open addressing: if a bucket is occupied, probe (linear, quadratic, or double hashing) to find the next empty slot.",
  },
  {
    id: 4,
    question: "What is the difference between std::map and std::unordered_map?",
    options: [
      "They are the same",
      "map uses a BST (O(log n) ops, sorted keys); unordered_map uses hashing (O(1) avg ops, unsorted)",
      "unordered_map is always faster",
      "map cannot store strings as keys",
    ],
    correctIndex: 1,
    explanation:
      "std::map uses a Red-Black tree (balanced BST) → O(log n) operations but keys are sorted. std::unordered_map uses a hash table → O(1) average but keys are not ordered. Use map when you need sorted keys.",
  },
  {
    id: 5,
    question: "What is the 'Two Sum' problem's optimal solution?",
    options: [
      "Sort the array and use binary search — O(n log n)",
      "Use nested loops — O(n²)",
      "Use a hash map to store complement values — O(n)",
      "Use a stack — O(n)",
    ],
    correctIndex: 2,
    explanation:
      "For each number, check if (target - number) exists in the hash map. If yes, you found the pair. If not, store the current number. One pass through the array → O(n) time, O(n) space.",
  },
  {
    id: 6,
    question: "What is the load factor of a hash table?",
    options: [
      "The number of buckets",
      "The ratio of stored elements to total buckets (n / capacity)",
      "The maximum number of collisions",
      "The size of the hash function output",
    ],
    correctIndex: 1,
    explanation:
      "Load factor = number of elements / number of buckets. When it exceeds a threshold (typically 0.75), the hash table rehashes — doubles the bucket count and re-inserts all elements. This keeps operations fast.",
  },
  {
    id: 7,
    question: "What happens during rehashing?",
    options: [
      "All elements are deleted",
      "The hash table doubles its bucket count and re-inserts all elements",
      "Collisions are ignored",
      "The hash function changes permanently",
    ],
    correctIndex: 1,
    explanation:
      "Rehashing allocates a new, larger bucket array (typically 2× size), then re-inserts every element (because hash(key) % new_capacity gives different bucket positions). This is O(n) but happens rarely → amortized O(1).",
  },
  {
    id: 8,
    question: "How do you count the frequency of each element in an array?",
    options: [
      "Sort the array and count consecutive duplicates",
      "Use nested loops to count each element",
      "Use an unordered_map<element, count> — one pass O(n)",
      "Use a stack",
    ],
    correctIndex: 2,
    explanation:
      "Iterate through the array, incrementing map[element]++ for each element. One pass, O(n) time, O(n) space. This is the standard frequency counting pattern.",
  },
  {
    id: 9,
    question: "What does unordered_map::count(key) return?",
    options: [
      "The number of elements in the map",
      "0 if key doesn't exist, 1 if it does",
      "The hash value of the key",
      "The bucket number for the key",
    ],
    correctIndex: 1,
    explanation:
      "count(key) returns 0 or 1 for unordered_map (since keys are unique). It's a convenient way to check if a key exists. Alternatively, use find(key) != end() or contains(key) in C++20.",
  },
  {
    id: 10,
    question: "What is the 'Group Anagrams' problem's key insight?",
    options: [
      "Sort each string and use the sorted version as the hash map key",
      "Compare every pair of strings",
      "Use a trie",
      "Count vowels in each string",
    ],
    correctIndex: 0,
    explanation:
      "Two strings are anagrams if they have the same characters in different order. Sorting both gives the same result: 'eat' → 'aet', 'tea' → 'aet'. Use the sorted string as the key in an unordered_map to group anagrams.",
  },
  {
    id: 11,
    question: "What is the worst-case time complexity of hash table operations?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctIndex: 2,
    explanation:
      "Worst case: ALL keys hash to the same bucket → the bucket becomes a linked list of n elements → O(n) search. This rarely happens with good hash functions. C++ unordered_map degrades to O(n) worst case.",
  },
  {
    id: 12,
    question: "When should you use std::map instead of std::unordered_map?",
    options: [
      "Always — map is faster",
      "When you need keys in sorted order, or need lower_bound/upper_bound",
      "When you have fewer than 10 elements",
      "When keys are integers",
    ],
    correctIndex: 1,
    explanation:
      "Use std::map when you need: sorted iteration, lower_bound/upper_bound (range queries), or guaranteed O(log n) worst case. Use unordered_map when you only need fast lookups and don't care about order.",
  },
];

export default function Lesson7HashTables({ onQuizComplete }) {
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
      {/* What is a Hash Table? */}
      <Section icon={BookOpen} title="What is a Hash Table?">
        <p className="text-foreground/80 leading-relaxed mb-4">
          A <strong>hash table</strong> is a data structure that maps <strong>keys to values</strong> using
          a <strong>hash function</strong>. The hash function converts a key into an array index, giving you
          near-instant O(1) lookups.
        </p>

        <div className="bg-card rounded-xl border border-border p-5 my-4">
          <h4 className="font-semibold mb-3 text-accent-light">How Hashing Works</h4>
          <div className="font-mono text-sm bg-code-bg rounded-lg p-4 overflow-x-auto">
            <p className="text-muted mb-2">{"// Insert: map[\"alice\"] = 95"}</p>
            <p className="text-foreground/90">{"  \"alice\" → hash(\"alice\") → 742 → 742 % 8 = 6"}</p>
            <p className="text-accent-light">{"  Bucket 6: [\"alice\" → 95]"}</p>
            <p className="text-muted mt-3 mb-2">{"// Lookup: map[\"alice\"]"}</p>
            <p className="text-foreground/90">{"  \"alice\" → hash(\"alice\") → 742 → 742 % 8 = 6"}</p>
            <p className="text-success">{"  Go directly to bucket 6 → found! Return 95"}</p>
            <p className="text-muted mt-3">{"// That's why it's O(1) — no searching needed!"}</p>
          </div>
        </div>

        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-card">
                <th className="text-left p-3 border-b border-border font-semibold">Operation</th>
                <th className="text-left p-3 border-b border-border font-semibold">Average</th>
                <th className="text-left p-3 border-b border-border font-semibold">Worst</th>
                <th className="text-left p-3 border-b border-border font-semibold">Note</th>
              </tr>
            </thead>
            <tbody>
              {[
                { op: "Insert", avg: "O(1)", worst: "O(n)", note: "Amortized O(1) with rehashing" },
                { op: "Find/Lookup", avg: "O(1)", worst: "O(n)", note: "Worst case: all in one bucket" },
                { op: "Delete", avg: "O(1)", worst: "O(n)", note: "Same as find" },
                { op: "Iterate all", avg: "O(n)", worst: "O(n)", note: "Must visit every bucket" },
              ].map((row) => (
                <tr key={row.op} className="border-b border-border/50 hover:bg-card/50">
                  <td className="p-3 font-semibold">{row.op}</td>
                  <td className="p-3 font-mono text-xs text-success">{row.avg}</td>
                  <td className="p-3 font-mono text-xs text-danger">{row.worst}</td>
                  <td className="p-3 text-xs text-muted">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Collision Resolution */}
      <Section icon={Zap} title="Hash Collisions & Resolution">
        <p className="text-foreground/80 leading-relaxed mb-4">
          Two different keys can produce the same hash value — this is a <strong>collision</strong>.
          Since the key space (e.g., all possible strings) is much larger than the bucket array,
          collisions are inevitable. There are two main strategies:
        </p>

        <div className="grid gap-4 md:grid-cols-2 my-4">
          <div className="p-5 bg-card rounded-xl border border-accent/30">
            <h4 className="font-semibold text-accent-light mb-2">1. Chaining</h4>
            <p className="text-sm text-foreground/80 mb-3">
              Each bucket holds a linked list. Colliding keys are added to the same list.
            </p>
            <div className="font-mono text-xs bg-code-bg rounded p-3">
              <p>{"Bucket 0: → null"}</p>
              <p>{"Bucket 1: → [\"bob\":85] → null"}</p>
              <p>{"Bucket 2: → null"}</p>
              <p>{"Bucket 3: → [\"alice\":95] → [\"dave\":78] → null"}</p>
              <p className="text-muted mt-1">{"// alice and dave collided at bucket 3"}</p>
            </div>
            <p className="text-xs text-muted mt-2">Used by: C++ unordered_map, Java HashMap</p>
          </div>
          <div className="p-5 bg-card rounded-xl border border-success/30">
            <h4 className="font-semibold text-success mb-2">2. Open Addressing</h4>
            <p className="text-sm text-foreground/80 mb-3">
              If a bucket is occupied, probe for the next empty slot.
            </p>
            <div className="font-mono text-xs bg-code-bg rounded p-3">
              <p>{"// Linear probing: try index, index+1, index+2, ..."}</p>
              <p>{"Bucket 3: [\"alice\":95]  ← alice hashed here"}</p>
              <p>{"Bucket 4: [\"dave\":78]   ← dave collided, probed to 4"}</p>
              <p>{"Bucket 5: empty"}</p>
            </div>
            <p className="text-xs text-muted mt-2">Used by: Python dict, some custom implementations</p>
          </div>
        </div>

        <KeyPoint>
          <strong>You don&apos;t need to implement hash tables in interviews</strong> — just use unordered_map.
          But understanding HOW they work helps you explain O(1) average vs O(n) worst case, and why
          rehashing happens.
        </KeyPoint>
      </Section>

      {/* unordered_map & unordered_set */}
      <Section icon={Code2} title="std::unordered_map & std::unordered_set">
        <CodeBlock
          title="unordered_map — Key-Value Store"
          code={`#include <unordered_map>
using namespace std;

unordered_map<string, int> scores;

// === Insert ===
scores["alice"] = 95;                  // Bracket operator
scores["bob"] = 87;
scores.insert({"charlie", 92});        // insert()
scores.emplace("dave", 78);           // emplace() — more efficient

// === Access ===
scores["alice"];           // 95 — WARNING: creates key with 0 if not found!
scores.at("alice");        // 95 — throws if not found (safer)

// === Check existence ===
scores.count("alice");     // 1 (exists) or 0 (not found)
scores.find("alice");      // Iterator to element, or scores.end()
// C++20: scores.contains("alice")  // true/false

// === Delete ===
scores.erase("alice");    // Remove by key — O(1) avg

// === Size ===
scores.size();             // Number of key-value pairs
scores.empty();            // true if empty

// === Iterate ===
for (auto& [key, val] : scores) {
    cout << key << ": " << val << endl;
}
// WARNING: iteration order is NOT predictable!`}
        />

        <CodeBlock
          title="unordered_set — Unique Collection"
          code={`#include <unordered_set>
using namespace std;

unordered_set<int> seen;

// === Insert ===
seen.insert(10);
seen.insert(20);
seen.insert(10);    // Duplicate — ignored! Set stays {10, 20}

// === Check existence ===
seen.count(10);      // 1
seen.count(99);      // 0

// === Delete ===
seen.erase(10);

// === Common patterns ===

// Deduplicate an array:
vector<int> nums = {1, 2, 2, 3, 3, 3};
unordered_set<int> unique(nums.begin(), nums.end());
// unique = {1, 2, 3}

// Check for duplicates:
bool hasDuplicates(vector<int>& arr) {
    unordered_set<int> seen;
    for (int x : arr) {
        if (seen.count(x)) return true;
        seen.insert(x);
    }
    return false;
}

// Intersection of two sets:
unordered_set<int> intersection(unordered_set<int>& a, unordered_set<int>& b) {
    unordered_set<int> result;
    for (int x : a) {
        if (b.count(x)) result.insert(x);
    }
    return result;
}`}
        />

        <Warning>
          <strong>scores[&quot;key&quot;] creates the key if it doesn&apos;t exist!</strong> Using the bracket operator
          on a non-existent key will insert it with a default value (0 for int). Use{" "}
          <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">count()</code> or{" "}
          <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">find()</code> to check first.
        </Warning>
      </Section>

      {/* Classic Hash Table Problems */}
      <Section icon={Brain} title="Classic Hash Table Interview Problems">
        <h3 className="text-lg font-semibold mt-2 mb-3 text-accent-light">1. Two Sum (THE Classic)</h3>
        <CodeBlock
          title="Two Sum — O(n)"
          code={`// Given array and target, find two indices whose values sum to target
// Brute force: O(n²) — check all pairs
// Hash map: O(n) — one pass!

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;  // value → index
    
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        
        if (seen.count(complement)) {
            return {seen[complement], i};  // Found the pair!
        }
        
        seen[nums[i]] = i;  // Store value → index
    }
    
    return {};  // No solution
}

// Example: nums = [2,7,11,15], target = 9
// i=0: complement=7, not in map. Store 2→0
// i=1: complement=2, found in map! Return {0, 1}

// Time: O(n) — single pass
// Space: O(n) — hash map`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">2. Frequency Counting</h3>
        <CodeBlock
          title="Frequency Count — The Universal Pattern"
          code={`// Count occurrences of each element
unordered_map<int, int> frequency(vector<int>& arr) {
    unordered_map<int, int> freq;
    for (int x : arr) {
        freq[x]++;  // Increment count (auto-initializes to 0)
    }
    return freq;
}

// Find the most frequent element
int mostFrequent(vector<int>& arr) {
    unordered_map<int, int> freq;
    for (int x : arr) freq[x]++;
    
    int maxCount = 0, result = 0;
    for (auto& [val, count] : freq) {
        if (count > maxCount) {
            maxCount = count;
            result = val;
        }
    }
    return result;
}

// Check if two strings are anagrams
bool isAnagram(string s, string t) {
    if (s.length() != t.length()) return false;
    
    unordered_map<char, int> freq;
    for (char c : s) freq[c]++;
    for (char c : t) {
        freq[c]--;
        if (freq[c] < 0) return false;
    }
    return true;
}
// Time: O(n), Space: O(n)`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">3. Group Anagrams</h3>
        <CodeBlock
          title="Group Anagrams — O(n × k log k)"
          code={`// Group strings that are anagrams of each other
// Input: ["eat","tea","tan","ate","nat","bat"]
// Output: [["eat","tea","ate"], ["tan","nat"], ["bat"]]

vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string, vector<string>> groups;
    
    for (const string& s : strs) {
        string key = s;
        sort(key.begin(), key.end());  // "eat" → "aet", "tea" → "aet"
        groups[key].push_back(s);
    }
    
    vector<vector<string>> result;
    for (auto& [key, group] : groups) {
        result.push_back(group);
    }
    return result;
}

// Key insight: anagrams have the same sorted form
// "eat" → "aet", "tea" → "aet", "ate" → "aet" → same group!
// Time: O(n × k log k) where k = max string length
// Space: O(n × k)`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">4. Subarray Sum Equals K</h3>
        <CodeBlock
          title="Subarray Sum Equals K — Prefix Sum + Hash Map"
          code={`// Count subarrays whose sum equals k
// This combines prefix sums with hash maps!

int subarraySum(vector<int>& nums, int k) {
    unordered_map<int, int> prefixCount;
    prefixCount[0] = 1;  // Empty subarray has sum 0
    
    int sum = 0, count = 0;
    
    for (int num : nums) {
        sum += num;
        
        // If (sum - k) was a previous prefix sum,
        // then there's a subarray from that point to here with sum = k
        if (prefixCount.count(sum - k)) {
            count += prefixCount[sum - k];
        }
        
        prefixCount[sum]++;
    }
    
    return count;
}

// Why it works:
// If prefix[j] - prefix[i] = k, then subarray [i+1..j] has sum k
// We're checking: does (currentSum - k) exist as a previous prefix sum?
// Time: O(n), Space: O(n)`}
        />

        <KeyPoint>
          <strong>The &quot;complement&quot; pattern</strong> appears everywhere: Two Sum (target - num),
          Subarray Sum (sum - k), Two Sum with sorted array. Whenever you need to find a pair that
          satisfies a condition, think: &quot;can I store one value and look up the complement?&quot;
        </KeyPoint>
      </Section>

      {/* map vs unordered_map */}
      <Section icon={BookOpen} title="std::map vs std::unordered_map — When to Use Which">
        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-card">
                <th className="text-left p-3 border-b border-border font-semibold">Aspect</th>
                <th className="text-left p-3 border-b border-border font-semibold">unordered_map</th>
                <th className="text-left p-3 border-b border-border font-semibold">map</th>
              </tr>
            </thead>
            <tbody>
              {[
                { aspect: "Implementation", um: "Hash table", m: "Red-Black tree (BST)" },
                { aspect: "Insert/Find/Erase", um: "O(1) average", m: "O(log n) guaranteed" },
                { aspect: "Worst case", um: "O(n)", m: "O(log n)" },
                { aspect: "Key order", um: "Unordered", m: "Sorted (ascending)" },
                { aspect: "lower_bound/upper_bound", um: "Not available", m: "O(log n)" },
                { aspect: "Memory", um: "More (hash table overhead)", m: "Less" },
                { aspect: "Custom key type", um: "Needs hash function", m: "Needs operator<" },
                { aspect: "Best for", um: "Fast lookups, counting", m: "Sorted iteration, range queries" },
              ].map((row) => (
                <tr key={row.aspect} className="border-b border-border/50 hover:bg-card/50">
                  <td className="p-3 font-semibold">{row.aspect}</td>
                  <td className="p-3 text-xs">{row.um}</td>
                  <td className="p-3 text-xs">{row.m}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CodeBlock
          title="std::map — When You Need Sorted Keys"
          code={`#include <map>
using namespace std;

map<string, int> m;
m["banana"] = 3;
m["apple"] = 5;
m["cherry"] = 1;

// Iteration is SORTED by key:
for (auto& [key, val] : m) {
    cout << key << ": " << val << endl;
}
// apple: 5
// banana: 3
// cherry: 1

// Range queries with lower_bound / upper_bound:
auto it = m.lower_bound("b");     // First key >= "b" → "banana"
auto it2 = m.upper_bound("b");    // First key > "b" → "banana"

// Count elements in a range [lo, hi]:
auto lo = m.lower_bound("apple");
auto hi = m.upper_bound("cherry");
int count = distance(lo, hi);     // 3 elements`}
        />
      </Section>

      {/* C++ Syntax Reference */}
      <Section icon={Code2} title="C++ Syntax Reference">
        <CodeBlock
          title="Hash Table — Complete Reference"
          code={`#include <unordered_map>
#include <unordered_set>
#include <map>
#include <set>
using namespace std;

// ========== unordered_map ==========
unordered_map<string, int> um;

// Insert
um["key"] = value;                     // Bracket (creates if not found!)
um.insert({"key", value});             // Only inserts if key absent
um.emplace("key", value);              // More efficient insert
um[key]++;                             // Increment (auto-init to 0)

// Access
um["key"];                             // DANGER: creates if not found
um.at("key");                          // Throws if not found
auto it = um.find("key");             // Iterator or um.end()
if (it != um.end()) it->second;        // Access value via iterator

// Check existence
um.count("key");                       // 0 or 1
um.find("key") != um.end();           // true/false

// Delete
um.erase("key");                       // By key
um.erase(it);                          // By iterator
um.clear();                            // Remove all

// Iterate
for (auto& [key, val] : um) { }       // Structured binding (C++17)
for (auto it = um.begin(); it != um.end(); ++it) {
    it->first;   // key
    it->second;  // value
}

// Size
um.size();
um.empty();

// ========== unordered_set ==========
unordered_set<int> us;
us.insert(x);
us.count(x);        // 0 or 1
us.erase(x);
us.size();

// Initialize from vector
vector<int> v = {1,2,3};
unordered_set<int> s(v.begin(), v.end());

// ========== Common Interview Patterns ==========

// Pattern 1: Two Sum (complement lookup)
unordered_map<int, int> seen;  // value → index

// Pattern 2: Frequency counting
unordered_map<char, int> freq;
for (char c : str) freq[c]++;

// Pattern 3: Deduplication
unordered_set<int> unique;
for (int x : arr) unique.insert(x);

// Pattern 4: Group by key
unordered_map<string, vector<string>> groups;
groups[key].push_back(item);`}
        />
      </Section>

      {/* Coding Challenges */}
      <Section icon={Code2} title="Coding Challenges">
        <p className="text-foreground/80 leading-relaxed mb-4">
          Practice the hash map patterns that appear in every interview.
        </p>

        <CodingChallenge
          title="Challenge 1: Two Sum"
          description="Given an array of integers and a target, return the indices of two numbers that add up to target. Use a hash map for O(n) time."
          starterCode={`vector<int> twoSum(vector<int>& nums, int target) {
    // Use unordered_map<int, int> to store value → index
    // For each number, check if complement exists

}`}
          solution={`vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        
        if (seen.count(complement)) {
            return {seen[complement], i};
        }
        
        seen[nums[i]] = i;
    }
    
    return {};
}
// Time: O(n), Space: O(n)`}
          hints={[
            "For each number, the complement is target - nums[i].",
            "Check if the complement already exists in the hash map.",
            "If not, store the current number and its index in the map.",
          ]}
          testDescription="One pass through the array, storing values and checking complements."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("unordered_map") &&
              (lower.includes("complement") || lower.includes("target-nums")) &&
              lower.includes("seen.count") || lower.includes("seen.find")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 2: Check if Two Strings are Anagrams"
          description="Write a function that checks if two strings are anagrams (same characters, different order). Use frequency counting with a hash map."
          starterCode={`bool isAnagram(string s, string t) {
    // Count character frequencies
    // Compare frequencies

}`}
          solution={`bool isAnagram(string s, string t) {
    if (s.length() != t.length()) return false;
    
    unordered_map<char, int> freq;
    
    for (char c : s) freq[c]++;
    for (char c : t) freq[c]--;
    
    for (auto& [ch, count] : freq) {
        if (count != 0) return false;
    }
    
    return true;
}
// Time: O(n), Space: O(1) — at most 26 letters`}
          hints={[
            "First check if lengths are equal — different lengths can't be anagrams.",
            "Count frequencies of characters in s (increment) and t (decrement).",
            "If all counts are 0 at the end, they're anagrams.",
          ]}
          testDescription="Increment for one string, decrement for the other, check all counts are zero."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              (lower.includes("unordered_map") || lower.includes("map<char")) &&
              lower.includes("freq[c]++") &&
              lower.includes("freq[c]--")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 3: First Non-Repeating Character"
          description="Given a string, find the index of the first character that doesn't repeat. Return -1 if all characters repeat. Use a hash map for frequency counting."
          starterCode={`int firstUniqChar(string s) {
    // Step 1: Count frequency of each character
    // Step 2: Find first character with frequency 1

}`}
          solution={`int firstUniqChar(string s) {
    unordered_map<char, int> freq;
    
    // Count frequencies
    for (char c : s) {
        freq[c]++;
    }
    
    // Find first with count == 1
    for (int i = 0; i < s.length(); i++) {
        if (freq[s[i]] == 1) {
            return i;
        }
    }
    
    return -1;
}

// Example: "leetcode" → 'l' appears once → return 0
// Example: "aabb"     → all repeat → return -1
// Time: O(n) — two passes
// Space: O(1) — at most 26 letters`}
          hints={[
            "First pass: count frequency of every character using a hash map.",
            "Second pass: iterate the string again and return the index of the first character with count == 1.",
            "Two passes is fine — both are O(n), so total is still O(n).",
          ]}
          testDescription="Two passes: count frequencies, then find the first character with count 1."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              (lower.includes("unordered_map") || lower.includes("map<char")) &&
              lower.includes("freq[") &&
              lower.includes("==1") &&
              lower.includes("returni") || lower.includes("return i")
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
              <span><strong>Hash tables give O(1) average</strong> for insert, find, delete. The most used data structure in interviews.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>unordered_map for key-value, unordered_set for unique elements.</strong> Use map/set when you need sorted keys.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Two Sum pattern:</strong> store values, look up complements. Appears in dozens of problems.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Frequency counting</strong> with map[x]++ solves anagrams, duplicates, majority element, and more.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Prefix sum + hash map</strong> solves subarray sum problems in O(n). A must-know combo.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Watch out:</strong> um[&quot;key&quot;] creates the key if missing! Use count() or find() to check first.</span>
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
