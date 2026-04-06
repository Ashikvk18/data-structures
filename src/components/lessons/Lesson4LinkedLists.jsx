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
  ArrowRight,
} from "lucide-react";
import CodeBlock from "@/components/CodeBlock";
import Quiz from "@/components/Quiz";
import CodingChallenge from "@/components/CodingChallenge";

const quizQuestions = [
  {
    id: 1,
    question: "What is the time complexity of accessing the k-th element in a singly linked list?",
    options: ["O(1)", "O(log n)", "O(k)", "O(n)"],
    correctIndex: 2,
    explanation:
      "Unlike arrays, linked lists don't have direct index access. You must traverse from the head, following k pointers. In the worst case (k = n), this is O(n). More precisely, it's O(k).",
  },
  {
    id: 2,
    question: "What is the time complexity of inserting a node at the BEGINNING of a singly linked list?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctIndex: 0,
    explanation:
      "Insert at head: create new node, point it to current head, update head pointer. Just 3 operations regardless of list size — O(1). This is linked list's advantage over arrays.",
  },
  {
    id: 3,
    question: "What is the main advantage of a linked list over an array?",
    options: [
      "Faster element access",
      "O(1) insertion and deletion at any known position",
      "Uses less memory",
      "Better cache performance",
    ],
    correctIndex: 1,
    explanation:
      "If you already have a pointer to the position, inserting/deleting is O(1) — just rewire pointers. Arrays require O(n) shifting. However, finding that position is O(n) in a linked list.",
  },
  {
    id: 4,
    question: "In Floyd's cycle detection algorithm, what do the slow and fast pointers do?",
    options: [
      "Both move one step at a time",
      "Slow moves 1 step, fast moves 2 steps per iteration",
      "Slow stays still, fast moves forward",
      "Both move at random speeds",
    ],
    correctIndex: 1,
    explanation:
      "Floyd's algorithm uses a slow pointer (moves 1 node) and a fast pointer (moves 2 nodes). If there's a cycle, the fast pointer will eventually 'lap' the slow pointer and they'll meet inside the cycle.",
  },
  {
    id: 5,
    question: "What extra feature does a doubly linked list have over a singly linked list?",
    options: [
      "Faster access by index",
      "Each node has a pointer to both the next AND previous node",
      "It uses less memory",
      "It can store more data types",
    ],
    correctIndex: 1,
    explanation:
      "A doubly linked list has both 'next' and 'prev' pointers per node, allowing traversal in both directions. This costs extra memory (one more pointer per node) but enables O(1) deletion when you have a pointer to the node.",
  },
  {
    id: 6,
    question: "How do you reverse a singly linked list in O(n) time and O(1) space?",
    options: [
      "Copy to an array, reverse, copy back",
      "Use recursion",
      "Use three pointers (prev, curr, next) and rewire links iteratively",
      "Swap values of first and last nodes repeatedly",
    ],
    correctIndex: 2,
    explanation:
      "The iterative reversal uses prev=null, curr=head. For each node: save next, point curr->next to prev, advance prev and curr. After the loop, prev is the new head. O(n) time, O(1) space.",
  },
  {
    id: 7,
    question: "What is a sentinel/dummy node, and why is it useful?",
    options: [
      "A node that stores the list's size",
      "A fake head node that simplifies edge cases (empty list, insert at head)",
      "A node that marks the end of the list",
      "A node that speeds up search",
    ],
    correctIndex: 1,
    explanation:
      "A dummy/sentinel node is a fake node placed before the real head. It eliminates edge cases like 'what if the list is empty?' or 'what if we need to delete the head?'. You return dummy->next as the real head.",
  },
  {
    id: 8,
    question: "What is the space complexity of reversing a linked list recursively?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctIndex: 2,
    explanation:
      "Recursive reversal makes n recursive calls before hitting the base case. Each call sits on the call stack → O(n) space. The iterative approach uses O(1) space and is preferred in interviews.",
  },
  {
    id: 9,
    question: "How do you find the middle node of a linked list in one pass?",
    options: [
      "Count all nodes first, then traverse to n/2",
      "Use slow (1 step) and fast (2 steps) pointers — when fast reaches end, slow is at middle",
      "Use binary search",
      "It's impossible in one pass",
    ],
    correctIndex: 1,
    explanation:
      "The slow/fast pointer technique: slow moves 1 step, fast moves 2 steps. When fast reaches the end, slow has moved exactly half the distance → it's at the middle. O(n) time, O(1) space, one pass.",
  },
  {
    id: 10,
    question: "What happens when you delete a node from the MIDDLE of a singly linked list (given pointer to previous node)?",
    options: [
      "All subsequent nodes shift left like an array",
      "You set prev->next = curr->next, then delete curr",
      "You swap it with the last node",
      "You mark it as deleted but leave it in place",
    ],
    correctIndex: 1,
    explanation:
      "To delete a node: point the previous node's 'next' to the deleted node's 'next' (bypassing it), then free the deleted node's memory. No shifting needed — O(1) if you have the previous node.",
  },
  {
    id: 11,
    question: "When merging two sorted linked lists, what is the time and space complexity?",
    options: ["O(n + m) time, O(1) space", "O(n × m) time, O(1) space", "O(n + m) time, O(n + m) space", "O(n log n) time, O(1) space"],
    correctIndex: 0,
    explanation:
      "Merging two sorted lists: compare heads, take the smaller one, advance that pointer. Repeat until both are empty. Each node is visited once → O(n + m) time. We rewire existing nodes → O(1) extra space.",
  },
  {
    id: 12,
    question: "What is a circular linked list?",
    options: [
      "A list where all nodes point to the head",
      "A list where the last node points back to the first node (instead of null)",
      "A list arranged in a circle shape in memory",
      "A doubly linked list with extra pointers",
    ],
    correctIndex: 1,
    explanation:
      "In a circular linked list, the last node's 'next' pointer points back to the head instead of null. This creates a loop. Useful for round-robin scheduling, circular buffers, and the Josephus problem.",
  },
];

export default function Lesson4LinkedLists({ onQuizComplete }) {
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
      {/* What is a Linked List? */}
      <Section icon={BookOpen} title="What is a Linked List?">
        <p className="text-foreground/80 leading-relaxed mb-4">
          A <strong>linked list</strong> is a chain of nodes where each node stores a value and a pointer
          to the next node. Unlike arrays, the nodes are <strong>not contiguous in memory</strong> — they
          can live anywhere, connected only by pointers.
        </p>

        <div className="bg-card rounded-xl border border-border p-5 my-4">
          <h4 className="font-semibold mb-3 text-accent-light">Visual: Singly Linked List</h4>
          <div className="font-mono text-sm bg-code-bg rounded-lg p-4 overflow-x-auto">
            <p className="text-foreground/90">
              {"head → [10|•]→ [20|•]→ [30|•]→ [40|•]→ null"}
            </p>
            <p className="text-muted mt-2">
              {"Each node: [data | next pointer]"}
            </p>
            <p className="text-muted">
              {"The last node's next = null (end of list)"}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-card">
                <th className="text-left p-3 border-b border-border font-semibold">Operation</th>
                <th className="text-left p-3 border-b border-border font-semibold">Array</th>
                <th className="text-left p-3 border-b border-border font-semibold">Linked List</th>
                <th className="text-left p-3 border-b border-border font-semibold">Winner</th>
              </tr>
            </thead>
            <tbody>
              {[
                { op: "Access by index", arr: "O(1)", ll: "O(n)", winner: "Array" },
                { op: "Insert at beginning", arr: "O(n)", ll: "O(1)", winner: "Linked List" },
                { op: "Insert at end", arr: "O(1)*", ll: "O(1)†", winner: "Tie" },
                { op: "Insert at middle", arr: "O(n)", ll: "O(1)‡", winner: "Linked List" },
                { op: "Delete at beginning", arr: "O(n)", ll: "O(1)", winner: "Linked List" },
                { op: "Delete at middle", arr: "O(n)", ll: "O(1)‡", winner: "Linked List" },
                { op: "Search", arr: "O(n)", ll: "O(n)", winner: "Tie" },
                { op: "Memory usage", arr: "Compact", ll: "Extra pointer per node", winner: "Array" },
                { op: "Cache performance", arr: "Excellent", ll: "Poor", winner: "Array" },
              ].map((row) => (
                <tr key={row.op} className="border-b border-border/50 hover:bg-card/50">
                  <td className="p-3">{row.op}</td>
                  <td className="p-3 font-mono text-xs">{row.arr}</td>
                  <td className="p-3 font-mono text-xs">{row.ll}</td>
                  <td className="p-3 text-xs font-semibold">{row.winner}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-muted mt-2">
            * amortized &nbsp; † with tail pointer &nbsp; ‡ if you already have a pointer to the position
          </p>
        </div>

        <KeyPoint>
          <strong>Linked lists shine when you need frequent insertions/deletions</strong> at known positions.
          Arrays shine for random access and cache-friendly traversal. In interviews, explain why you chose one over the other.
        </KeyPoint>
      </Section>

      {/* Node Structure */}
      <Section icon={Code2} title="Building a Linked List in C++">
        <CodeBlock
          title="Node Definition — Singly Linked List"
          code={`// The building block of a linked list
struct ListNode {
    int val;           // Data stored in this node
    ListNode* next;    // Pointer to the next node
    
    // Constructor
    ListNode(int x) : val(x), next(nullptr) {}
};

// Creating nodes and linking them manually:
ListNode* head = new ListNode(10);
head->next = new ListNode(20);
head->next->next = new ListNode(30);
// Result: 10 → 20 → 30 → null`}
        />

        <CodeBlock
          title="Basic Operations"
          code={`// === Traversal — O(n) ===
void printList(ListNode* head) {
    ListNode* curr = head;
    while (curr != nullptr) {
        cout << curr->val << " → ";
        curr = curr->next;
    }
    cout << "null" << endl;
}

// === Insert at Head — O(1) ===
ListNode* insertAtHead(ListNode* head, int val) {
    ListNode* newNode = new ListNode(val);
    newNode->next = head;   // Point new node to old head
    return newNode;         // New node IS the new head
}

// === Insert at Tail — O(n) without tail pointer ===
ListNode* insertAtTail(ListNode* head, int val) {
    ListNode* newNode = new ListNode(val);
    if (!head) return newNode;  // Empty list
    
    ListNode* curr = head;
    while (curr->next) {        // Find the last node
        curr = curr->next;
    }
    curr->next = newNode;
    return head;
}

// === Delete a Node — O(1) if you have previous node ===
ListNode* deleteNode(ListNode* head, int val) {
    // Use a dummy node to handle edge cases!
    ListNode dummy(0);
    dummy.next = head;
    
    ListNode* prev = &dummy;
    ListNode* curr = head;
    
    while (curr) {
        if (curr->val == val) {
            prev->next = curr->next;  // Bypass curr
            delete curr;              // Free memory
            break;
        }
        prev = curr;
        curr = curr->next;
    }
    
    return dummy.next;  // Return real head
}

// === Search — O(n) ===
bool search(ListNode* head, int target) {
    ListNode* curr = head;
    while (curr) {
        if (curr->val == target) return true;
        curr = curr->next;
    }
    return false;
}`}
        />
        <KeyPoint>
          <strong>The dummy node trick</strong> is essential for linked list problems. By creating a fake
          node before the head, you avoid special-casing &quot;what if we delete the head?&quot; or &quot;what
          if the list is empty?&quot;. Return <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">dummy.next</code> as the real head.
        </KeyPoint>
      </Section>

      {/* Reverse a Linked List */}
      <Section icon={Zap} title="Reverse a Linked List — The #1 Interview Problem">
        <p className="text-foreground/80 leading-relaxed mb-4">
          Reversing a linked list is the <strong>most commonly asked</strong> linked list question in interviews.
          You must know both iterative and recursive approaches.
        </p>

        <CodeBlock
          title="Iterative Reversal — O(n) time, O(1) space"
          code={`ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    
    while (curr) {
        ListNode* next = curr->next;  // Save next
        curr->next = prev;            // Reverse the link
        prev = curr;                  // Advance prev
        curr = next;                  // Advance curr
    }
    
    return prev;  // prev is the new head
}

// Step by step for 1 → 2 → 3 → null:
// 
// Start: prev=null, curr=1
// Step 1: next=2, 1→null,     prev=1, curr=2
// Step 2: next=3, 2→1→null,   prev=2, curr=3
// Step 3: next=null, 3→2→1→null, prev=3, curr=null
// Done! Return prev (3) → new head`}
        />

        <CodeBlock
          title="Recursive Reversal — O(n) time, O(n) space"
          code={`ListNode* reverseListRecursive(ListNode* head) {
    // Base case: empty or single node
    if (!head || !head->next) return head;
    
    // Recurse: reverse everything after head
    ListNode* newHead = reverseListRecursive(head->next);
    
    // head->next is now the LAST node of the reversed sublist
    // Make it point back to head
    head->next->next = head;
    head->next = nullptr;  // head is now the tail
    
    return newHead;
}

// Note: O(n) space due to recursion stack
// Prefer iterative in interviews unless asked for recursive`}
        />

        <Warning>
          <strong>Practice drawing this on paper.</strong> Pointer manipulation is easy to mess up.
          In interviews, draw boxes and arrows as you code. Interviewers love seeing your thought process.
        </Warning>
      </Section>

      {/* Classic Problems */}
      <Section icon={Brain} title="Classic Linked List Interview Problems">
        <h3 className="text-lg font-semibold mt-2 mb-3 text-accent-light">1. Detect a Cycle (Floyd&apos;s Algorithm)</h3>
        <CodeBlock
          title="Floyd's Cycle Detection — O(n) time, O(1) space"
          code={`bool hasCycle(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    
    while (fast && fast->next) {
        slow = slow->next;          // 1 step
        fast = fast->next->next;    // 2 steps
        
        if (slow == fast) return true;  // They met → cycle!
    }
    
    return false;  // fast reached end → no cycle
}

// Why does this work?
// If there's a cycle, fast enters it first.
// slow enters later. fast "chases" slow inside the cycle.
// Since fast moves 1 step faster, the gap shrinks by 1 each iteration.
// They MUST meet eventually.

// Find where the cycle STARTS:
ListNode* detectCycleStart(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        
        if (slow == fast) {
            // Reset slow to head, keep fast at meeting point
            slow = head;
            while (slow != fast) {
                slow = slow->next;
                fast = fast->next;  // Both move 1 step now
            }
            return slow;  // They meet at cycle start!
        }
    }
    return nullptr;
}`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">2. Find the Middle Node</h3>
        <CodeBlock
          title="Find Middle — Slow/Fast Pointer"
          code={`ListNode* findMiddle(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    
    return slow;  // slow is at the middle
}

// For 1→2→3→4→5: slow stops at 3 (middle)
// For 1→2→3→4:   slow stops at 3 (second middle)
// Time: O(n), Space: O(1), Single pass!`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">3. Merge Two Sorted Lists</h3>
        <CodeBlock
          title="Merge Two Sorted Lists — O(n + m)"
          code={`ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
    ListNode dummy(0);         // Dummy node avoids edge cases
    ListNode* tail = &dummy;
    
    while (l1 && l2) {
        if (l1->val <= l2->val) {
            tail->next = l1;
            l1 = l1->next;
        } else {
            tail->next = l2;
            l2 = l2->next;
        }
        tail = tail->next;
    }
    
    // Attach remaining nodes
    tail->next = l1 ? l1 : l2;
    
    return dummy.next;
}

// Time: O(n + m) — visit each node once
// Space: O(1) — rewire existing nodes`}
        />

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">4. Remove N-th Node From End</h3>
        <CodeBlock
          title="Remove N-th From End — Two Pointers"
          code={`ListNode* removeNthFromEnd(ListNode* head, int n) {
    ListNode dummy(0);
    dummy.next = head;
    
    ListNode* fast = &dummy;
    ListNode* slow = &dummy;
    
    // Move fast n+1 steps ahead
    for (int i = 0; i <= n; i++) {
        fast = fast->next;
    }
    
    // Move both until fast reaches end
    while (fast) {
        slow = slow->next;
        fast = fast->next;
    }
    
    // slow is now BEFORE the node to delete
    ListNode* toDelete = slow->next;
    slow->next = slow->next->next;
    delete toDelete;
    
    return dummy.next;
}

// Key insight: fast is n+1 ahead of slow
// When fast = null, slow is right before the target
// Time: O(n), Space: O(1), Single pass!`}
        />
      </Section>

      {/* Doubly Linked Lists */}
      <Section icon={Link} title="Doubly Linked Lists">
        <p className="text-foreground/80 leading-relaxed mb-4">
          A <strong>doubly linked list</strong> adds a <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">prev</code> pointer
          to each node, allowing traversal in both directions.
        </p>
        <CodeBlock
          title="Doubly Linked List Node"
          code={`struct DListNode {
    int val;
    DListNode* prev;
    DListNode* next;
    
    DListNode(int x) : val(x), prev(nullptr), next(nullptr) {}
};

// Visual:
// null ← [10] ⇄ [20] ⇄ [30] ⇄ [40] → null

// Insert after a given node — O(1)
void insertAfter(DListNode* node, int val) {
    DListNode* newNode = new DListNode(val);
    newNode->next = node->next;
    newNode->prev = node;
    if (node->next) node->next->prev = newNode;
    node->next = newNode;
}

// Delete a node (given pointer to it) — O(1)!
void deleteNode(DListNode* node) {
    if (node->prev) node->prev->next = node->next;
    if (node->next) node->next->prev = node->prev;
    delete node;
}
// This is why doubly linked lists are used in LRU Cache!`}
        />
        <KeyPoint>
          <strong>Doubly linked lists power the LRU Cache</strong> — a Google favorite interview problem.
          They allow O(1) deletion of any node when combined with a hash map. You&apos;ll see this
          in the Hashing phase.
        </KeyPoint>
      </Section>

      {/* C++ Syntax Reference */}
      <Section icon={Code2} title="C++ Syntax Reference">
        <CodeBlock
          title="Linked List Essentials in C++"
          code={`// === Node Definition ===
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* n) : val(x), next(n) {}
};

// === Creating Nodes ===
ListNode* node = new ListNode(42);    // Heap allocation
ListNode node2(42);                   // Stack allocation

// === Pointer Operations ===
node->val;         // Access value (arrow for pointers)
node->next;        // Access next pointer
node->next->val;   // Access next node's value

// === Null Checks (ALWAYS do these!) ===
if (node == nullptr) { /* empty */ }
if (!node) { /* same as above, shorthand */ }
if (node && node->next) { /* safe to access next */ }

// === Dummy Node Pattern ===
ListNode dummy(0);
dummy.next = head;
// ... operate on list ...
return dummy.next;  // Real head

// === Memory Management ===
delete node;        // Free heap-allocated node
// In interviews, mention you'd free memory
// but don't spend time implementing destructors

// === std::list (STL doubly linked list) ===
#include <list>
list<int> lst = {1, 2, 3, 4, 5};
lst.push_front(0);     // O(1) insert at front
lst.push_back(6);      // O(1) insert at back
lst.pop_front();       // O(1) remove from front
lst.pop_back();        // O(1) remove from back
lst.front();           // First element
lst.back();            // Last element
lst.size();            // Number of elements

// Iterate
for (int x : lst) cout << x << " ";

// Insert/erase at iterator position — O(1)
auto it = lst.begin();
advance(it, 2);        // Move iterator 2 positions
lst.insert(it, 99);    // Insert before iterator
lst.erase(it);         // Erase at iterator`}
        />
      </Section>

      {/* Coding Challenges */}
      <Section icon={Code2} title="Coding Challenges">
        <p className="text-foreground/80 leading-relaxed mb-4">
          Practice pointer manipulation with these classic problems.
        </p>

        <CodingChallenge
          title="Challenge 1: Reverse a Linked List"
          description="Write an iterative function that reverses a singly linked list. Use three pointers: prev, curr, and next."
          starterCode={`ListNode* reverseList(ListNode* head) {
    // Use prev, curr, next pointers
    // Time: O(n), Space: O(1)

}`}
          solution={`ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    
    while (curr) {
        ListNode* next = curr->next;  // Save next
        curr->next = prev;            // Reverse link
        prev = curr;                  // Move prev forward
        curr = next;                  // Move curr forward
    }
    
    return prev;  // New head
}
// Time: O(n) — single pass
// Space: O(1) — just three pointers`}
          hints={[
            "Initialize prev = nullptr, curr = head.",
            "In each iteration: save curr->next, then point curr->next to prev.",
            "Advance both prev and curr, then repeat until curr is null.",
          ]}
          testDescription="Use three pointers to reverse links one by one. Return prev as the new head."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("prev") &&
              lower.includes("curr") &&
              lower.includes("curr->next=prev") &&
              lower.includes("returnprev")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 2: Detect a Cycle"
          description="Write a function using Floyd's algorithm (slow/fast pointers) to detect if a linked list has a cycle."
          starterCode={`bool hasCycle(ListNode* head) {
    // Use slow and fast pointers
    // slow moves 1 step, fast moves 2 steps
    // If they meet → cycle exists

}`}
          solution={`bool hasCycle(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    
    while (fast && fast->next) {
        slow = slow->next;          // 1 step
        fast = fast->next->next;    // 2 steps
        
        if (slow == fast) {
            return true;  // Met → cycle exists
        }
    }
    
    return false;  // fast reached end → no cycle
}
// Time: O(n)
// Space: O(1)`}
          hints={[
            "Initialize both slow and fast to head.",
            "Loop while fast and fast->next are not null.",
            "Move slow by 1, fast by 2. If they ever equal each other → cycle.",
          ]}
          testDescription="Both pointers start at head. Fast moves twice as fast. If they meet, there's a cycle."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("slow") &&
              lower.includes("fast") &&
              lower.includes("fast->next->next") &&
              lower.includes("slow==fast")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 3: Merge Two Sorted Lists"
          description="Write a function that merges two sorted linked lists into one sorted list. Use a dummy node to simplify the logic."
          starterCode={`ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
    // Use a dummy node and a tail pointer
    // Compare heads, take the smaller one
    // Time: O(n + m), Space: O(1)

}`}
          solution={`ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
    ListNode dummy(0);
    ListNode* tail = &dummy;
    
    while (l1 && l2) {
        if (l1->val <= l2->val) {
            tail->next = l1;
            l1 = l1->next;
        } else {
            tail->next = l2;
            l2 = l2->next;
        }
        tail = tail->next;
    }
    
    tail->next = l1 ? l1 : l2;
    
    return dummy.next;
}
// Time: O(n + m)
// Space: O(1) — rewiring existing nodes`}
          hints={[
            "Create a dummy node and a tail pointer starting at dummy.",
            "While both lists have nodes, compare l1->val and l2->val. Attach the smaller to tail->next.",
            "After the loop, attach whichever list still has nodes remaining.",
          ]}
          testDescription="Use a dummy node, compare values, and attach the smaller node each time."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("dummy") &&
              lower.includes("tail") &&
              lower.includes("l1->val") &&
              lower.includes("l2->val") &&
              lower.includes("dummy.next")
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
              <span><strong>Linked lists trade access speed for insertion speed.</strong> O(n) access but O(1) insert/delete at known positions.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Always use a dummy node</strong> to simplify edge cases. Return dummy.next as the head.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Reverse a linked list</strong> iteratively with prev/curr/next — the most asked linked list question.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Slow/fast pointers</strong> solve cycle detection, find middle, and remove n-th from end — all in one pass.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Doubly linked lists</strong> enable O(1) deletion of any node. Key for LRU Cache.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Draw diagrams!</strong> Pointer manipulation is error-prone. Boxes and arrows will save you in interviews.</span>
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
