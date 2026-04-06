"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Layers,
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
    question: "What principle does a stack follow?",
    options: ["FIFO (First In, First Out)", "LIFO (Last In, First Out)", "Random access", "Priority-based"],
    correctIndex: 1,
    explanation:
      "A stack follows LIFO — the last element pushed is the first one popped. Think of a stack of plates: you always take the top plate first.",
  },
  {
    id: 2,
    question: "What is the time complexity of push, pop, and top on a stack?",
    options: ["O(n) for all", "O(1) for all", "O(log n) for all", "O(1) for push, O(n) for pop"],
    correctIndex: 1,
    explanation:
      "All three core stack operations — push (add to top), pop (remove from top), and top (peek at top) — are O(1). The stack only ever touches the top element.",
  },
  {
    id: 3,
    question: "Which of the following is NOT a valid use case for a stack?",
    options: [
      "Matching parentheses",
      "Undo/redo functionality",
      "BFS (Breadth-First Search)",
      "Function call management",
    ],
    correctIndex: 2,
    explanation:
      "BFS uses a QUEUE (FIFO), not a stack. DFS (Depth-First Search) uses a stack. Stacks are used for parentheses matching, undo/redo, function calls, expression evaluation, and more.",
  },
  {
    id: 4,
    question: "What does the 'Valid Parentheses' problem check?",
    options: [
      "If a string has equal opening and closing brackets",
      "If every opening bracket has a matching closing bracket in the correct order",
      "If brackets are sorted alphabetically",
      "If the string contains only brackets",
    ],
    correctIndex: 1,
    explanation:
      "Valid parentheses requires: every opening bracket has a corresponding closing bracket, AND they are properly nested. '([)]' has equal counts but is INVALID. '([])' is valid.",
  },
  {
    id: 5,
    question: "In the 'Next Greater Element' problem, what data structure gives an O(n) solution?",
    options: ["Queue", "Hash map", "Monotonic stack", "Binary search tree"],
    correctIndex: 2,
    explanation:
      "A monotonic stack (a stack that maintains elements in sorted order) solves next greater element in O(n). For each element, pop smaller elements (they found their answer), then push the current element.",
  },
  {
    id: 6,
    question: "What is a monotonic stack?",
    options: [
      "A stack that only holds one element",
      "A stack where elements are maintained in increasing or decreasing order",
      "A stack implemented with a linked list",
      "A stack with a maximum size limit",
    ],
    correctIndex: 1,
    explanation:
      "A monotonic stack maintains elements in a specific order (all increasing or all decreasing from bottom to top). When pushing a new element, you pop all elements that violate the ordering.",
  },
  {
    id: 7,
    question: "How would you implement a stack using two queues?",
    options: [
      "It's impossible",
      "Push is O(1), pop requires moving n-1 elements to the other queue",
      "Both push and pop are O(1)",
      "Use one queue for push, one for pop",
    ],
    correctIndex: 1,
    explanation:
      "To pop from a 'stack' made of queues: move all elements except the last from queue1 to queue2. The last element is the 'top'. Then swap the queues. Push is O(1), pop is O(n).",
  },
  {
    id: 8,
    question: "What does std::stack in C++ use as its default underlying container?",
    options: ["std::vector", "std::list", "std::deque", "std::array"],
    correctIndex: 2,
    explanation:
      "std::stack is a container adaptor that uses std::deque by default. You can also specify vector or list: stack<int, vector<int>> or stack<int, list<int>>.",
  },
  {
    id: 9,
    question: "In evaluating a postfix expression '3 4 + 2 *', what is the result?",
    options: ["14", "10", "24", "9"],
    correctIndex: 0,
    explanation:
      "Process with a stack: push 3, push 4, see '+' → pop 4 and 3, compute 3+4=7, push 7. Push 2. See '*' → pop 2 and 7, compute 7*2=14, push 14. Result: 14.",
  },
  {
    id: 10,
    question: "What is the 'Min Stack' problem asking you to do?",
    options: [
      "Sort the stack in ascending order",
      "Design a stack that supports push, pop, top, and getMin — all in O(1)",
      "Find the minimum element using binary search",
      "Remove the minimum element from a regular stack",
    ],
    correctIndex: 1,
    explanation:
      "Min Stack requires O(1) for ALL operations including getMin. The trick: maintain a second stack that tracks the minimum at each level. When you push, also push the current min onto the min stack.",
  },
  {
    id: 11,
    question: "What is the time complexity of the 'Largest Rectangle in Histogram' problem using a stack?",
    options: ["O(n²)", "O(n log n)", "O(n)", "O(n³)"],
    correctIndex: 2,
    explanation:
      "Using a monotonic stack, each bar is pushed and popped at most once → O(n) total. The brute force approach is O(n²). This is a classic Google interview problem.",
  },
  {
    id: 12,
    question: "How is the function call stack related to actual stacks?",
    options: [
      "They are unrelated",
      "Function calls use a stack — each call pushes a frame, each return pops a frame",
      "Function calls use a queue",
      "The call stack is only used for recursion, not regular functions",
    ],
    correctIndex: 1,
    explanation:
      "Every function call pushes a 'stack frame' (local variables, return address) onto the call stack. When the function returns, its frame is popped. This is why recursion can cause stack overflow — too many frames.",
  },
];

export default function Lesson5Stacks({ onQuizComplete }) {
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
      {/* What is a Stack? */}
      <Section icon={BookOpen} title="What is a Stack?">
        <p className="text-foreground/80 leading-relaxed mb-4">
          A <strong>stack</strong> is a linear data structure that follows the <strong>LIFO</strong> (Last In, First Out)
          principle. The last element added is the first one removed — like a stack of plates.
        </p>

        <div className="bg-card rounded-xl border border-border p-5 my-4">
          <h4 className="font-semibold mb-3 text-accent-light">Visual: Stack Operations</h4>
          <div className="font-mono text-sm bg-code-bg rounded-lg p-4 overflow-x-auto">
            <p className="text-muted mb-2">{"// push(10), push(20), push(30)"}</p>
            <p className="text-foreground/90">{"    |  30  |  ← top (most recent)"}</p>
            <p className="text-foreground/90">{"    |  20  |"}</p>
            <p className="text-foreground/90">{"    |  10  |  ← bottom (oldest)"}</p>
            <p className="text-foreground/90">{"    +------+"}</p>
            <p className="text-muted mt-2">{"// pop() → returns 30 (last in, first out)"}</p>
            <p className="text-muted">{"// top() → returns 20 (new top after pop)"}</p>
          </div>
        </div>

        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-card">
                <th className="text-left p-3 border-b border-border font-semibold">Operation</th>
                <th className="text-left p-3 border-b border-border font-semibold">What it does</th>
                <th className="text-left p-3 border-b border-border font-semibold">Time</th>
              </tr>
            </thead>
            <tbody>
              {[
                { op: "push(x)", desc: "Add element x to the top", time: "O(1)" },
                { op: "pop()", desc: "Remove and return the top element", time: "O(1)" },
                { op: "top() / peek()", desc: "View the top element without removing", time: "O(1)" },
                { op: "empty()", desc: "Check if stack is empty", time: "O(1)" },
                { op: "size()", desc: "Return number of elements", time: "O(1)" },
              ].map((row) => (
                <tr key={row.op} className="border-b border-border/50 hover:bg-card/50">
                  <td className="p-3 font-mono text-accent-light text-xs">{row.op}</td>
                  <td className="p-3 text-xs">{row.desc}</td>
                  <td className="p-3 font-mono text-xs font-semibold text-success">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <KeyPoint>
          <strong>All stack operations are O(1).</strong> This makes stacks extremely efficient.
          The constraint is you can only access the top element — no random access like arrays.
        </KeyPoint>
      </Section>

      {/* Implementation */}
      <Section icon={Code2} title="Implementing a Stack in C++">
        <CodeBlock
          title="Using std::stack (Recommended)"
          code={`#include <stack>
using namespace std;

stack<int> s;

s.push(10);    // Stack: [10]
s.push(20);    // Stack: [10, 20]
s.push(30);    // Stack: [10, 20, 30]

s.top();       // 30 (peek at top, don't remove)
s.pop();       // Removes 30. Stack: [10, 20]
s.size();      // 2
s.empty();     // false

// WARNING: pop() returns void in C++!
// To get the value, call top() BEFORE pop()
int val = s.top();  // Get value first
s.pop();            // Then remove`}
        />

        <CodeBlock
          title="Implementing a Stack from Scratch (using vector)"
          code={`class Stack {
private:
    vector<int> data;
    
public:
    void push(int val) {
        data.push_back(val);     // O(1) amortized
    }
    
    void pop() {
        if (data.empty()) throw runtime_error("Stack underflow");
        data.pop_back();         // O(1)
    }
    
    int top() {
        if (data.empty()) throw runtime_error("Stack is empty");
        return data.back();      // O(1)
    }
    
    bool empty() {
        return data.empty();     // O(1)
    }
    
    int size() {
        return data.size();      // O(1)
    }
};`}
        />

        <Warning>
          <strong>C++ std::stack::pop() returns void!</strong> This is a common mistake. Unlike other
          languages, you must call <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">top()</code> to
          get the value before calling <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">pop()</code>.
          Also, always check <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">empty()</code> before popping.
        </Warning>
      </Section>

      {/* Valid Parentheses */}
      <Section icon={Brain} title="Classic Problem 1: Valid Parentheses">
        <p className="text-foreground/80 leading-relaxed mb-4">
          This is the <strong>most common stack interview question</strong>. Given a string containing
          only brackets, determine if the input is valid.
        </p>
        <CodeBlock
          title="Valid Parentheses — O(n)"
          code={`bool isValid(string s) {
    stack<char> st;
    
    for (char c : s) {
        // Push opening brackets
        if (c == '(' || c == '[' || c == '{') {
            st.push(c);
        } else {
            // Closing bracket — must match top of stack
            if (st.empty()) return false;  // Nothing to match
            
            char top = st.top();
            st.pop();
            
            if (c == ')' && top != '(') return false;
            if (c == ']' && top != '[') return false;
            if (c == '}' && top != '{') return false;
        }
    }
    
    return st.empty();  // Valid only if all brackets matched
}

// Examples:
// "([])" → true   — properly nested
// "([)]" → false  — wrong nesting order
// "{}"   → true
// "("    → false  — unmatched opening bracket

// Time: O(n) — single pass
// Space: O(n) — stack holds at most n/2 brackets`}
        />
        <KeyPoint>
          <strong>Why a stack works:</strong> The most recent opening bracket must be closed first (LIFO!).
          When you see a closing bracket, it must match the most recently pushed opening bracket.
          This is exactly what a stack gives you.
        </KeyPoint>
      </Section>

      {/* Min Stack */}
      <Section icon={Brain} title="Classic Problem 2: Min Stack">
        <p className="text-foreground/80 leading-relaxed mb-4">
          Design a stack that supports <strong>push, pop, top, and getMin — all in O(1)</strong>.
          The challenge is tracking the minimum efficiently as elements are pushed and popped.
        </p>
        <CodeBlock
          title="Min Stack — O(1) All Operations"
          code={`class MinStack {
    stack<int> mainStack;
    stack<int> minStack;   // Tracks minimum at each level
    
public:
    void push(int val) {
        mainStack.push(val);
        // Push to minStack: either the new value or current min (whichever is smaller)
        if (minStack.empty() || val <= minStack.top()) {
            minStack.push(val);
        } else {
            minStack.push(minStack.top());  // Carry forward current min
        }
    }
    
    void pop() {
        mainStack.pop();
        minStack.pop();   // Both stacks stay in sync
    }
    
    int top() {
        return mainStack.top();
    }
    
    int getMin() {
        return minStack.top();  // O(1)!
    }
};

// Example:
// push(5): main=[5],     min=[5]       → getMin()=5
// push(3): main=[5,3],   min=[5,3]     → getMin()=3
// push(7): main=[5,3,7], min=[5,3,3]   → getMin()=3
// pop():   main=[5,3],   min=[5,3]     → getMin()=3
// pop():   main=[5],     min=[5]       → getMin()=5`}
        />
      </Section>

      {/* Monotonic Stack */}
      <Section icon={Zap} title="Monotonic Stack — The Power Pattern">
        <p className="text-foreground/80 leading-relaxed mb-4">
          A <strong>monotonic stack</strong> maintains elements in sorted order (either increasing or decreasing).
          It&apos;s the key to solving &quot;next greater/smaller element&quot; problems in O(n).
        </p>

        <CodeBlock
          title="Next Greater Element — O(n)"
          code={`// For each element, find the next element that is GREATER than it.
// Input:  [4, 5, 2, 10, 8]
// Output: [5, 10, 10, -1, -1]
// 4's next greater = 5, 5's next greater = 10, etc.

vector<int> nextGreaterElement(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, -1);     // Default: no greater element
    stack<int> st;                  // Stack of INDICES
    
    for (int i = 0; i < n; i++) {
        // Pop all elements that are SMALLER than current
        // (they just found their "next greater element"!)
        while (!st.empty() && nums[st.top()] < nums[i]) {
            result[st.top()] = nums[i];
            st.pop();
        }
        st.push(i);  // Push current index
    }
    
    return result;
}

// Walk through [4, 5, 2, 10, 8]:
// i=0: push 0.         Stack: [0(4)]
// i=1: 5>4 → result[0]=5, pop. Push 1.  Stack: [1(5)]
// i=2: 2<5 → push 2.   Stack: [1(5), 2(2)]
// i=3: 10>2 → result[2]=10, pop.
//       10>5 → result[1]=10, pop. Push 3. Stack: [3(10)]
// i=4: 8<10 → push 4.  Stack: [3(10), 4(8)]
// Remaining: result[3]=-1, result[4]=-1

// Time: O(n) — each element pushed and popped at most once
// Space: O(n) — stack`}
        />

        <CodeBlock
          title="Daily Temperatures — Classic Monotonic Stack Problem"
          code={`// Given daily temperatures, find how many days you need to wait
// for a warmer temperature. 
// Input:  [73, 74, 75, 71, 69, 72, 76, 73]
// Output: [1,  1,  4,  2,  1,  1,  0,  0]

vector<int> dailyTemperatures(vector<int>& temps) {
    int n = temps.size();
    vector<int> result(n, 0);
    stack<int> st;  // Stack of indices (decreasing temperatures)
    
    for (int i = 0; i < n; i++) {
        while (!st.empty() && temps[i] > temps[st.top()]) {
            int prevDay = st.top();
            st.pop();
            result[prevDay] = i - prevDay;  // Days to wait
        }
        st.push(i);
    }
    
    return result;
}
// Time: O(n), Space: O(n)`}
        />

        <KeyPoint>
          <strong>When to use a monotonic stack:</strong> Any problem asking for &quot;next greater&quot;,
          &quot;next smaller&quot;, &quot;previous greater&quot;, or &quot;previous smaller&quot; element.
          Also: largest rectangle in histogram, trapping rain water, stock span.
        </KeyPoint>
      </Section>

      {/* Expression Evaluation */}
      <Section icon={Brain} title="Stacks for Expression Evaluation">
        <p className="text-foreground/80 leading-relaxed mb-4">
          Stacks are used to evaluate mathematical expressions. Understanding postfix (Reverse Polish Notation)
          is key for interview problems.
        </p>
        <CodeBlock
          title="Evaluate Postfix Expression"
          code={`// Postfix: operators come AFTER operands
// "3 4 + 2 *" means (3 + 4) * 2 = 14
// No need for parentheses!

int evalPostfix(vector<string>& tokens) {
    stack<int> st;
    
    for (const string& token : tokens) {
        if (token == "+" || token == "-" || 
            token == "*" || token == "/") {
            int b = st.top(); st.pop();  // Second operand
            int a = st.top(); st.pop();  // First operand
            
            if (token == "+") st.push(a + b);
            else if (token == "-") st.push(a - b);
            else if (token == "*") st.push(a * b);
            else st.push(a / b);
        } else {
            st.push(stoi(token));  // Push number
        }
    }
    
    return st.top();  // Final result
}

// Example: ["3", "4", "+", "2", "*"]
// Push 3, push 4
// See "+": pop 4, pop 3, push 7
// Push 2
// See "*": pop 2, pop 7, push 14
// Result: 14`}
        />
      </Section>

      {/* Real World Applications */}
      <Section icon={BookOpen} title="Real-World Applications of Stacks">
        <div className="grid gap-3 md:grid-cols-2 my-4">
          {[
            { title: "Function Call Stack", desc: "Every function call pushes a frame. Every return pops it. Recursion = deep stack." },
            { title: "Undo/Redo", desc: "Text editors use two stacks: undo stack and redo stack. Each action pushes to undo." },
            { title: "Browser History", desc: "Back button = pop from history stack. Forward = pop from forward stack." },
            { title: "Expression Parsing", desc: "Compilers use stacks to parse and evaluate expressions, handle operator precedence." },
            { title: "DFS (Depth-First Search)", desc: "DFS uses a stack (explicitly or via recursion) to explore graphs/trees." },
            { title: "Syntax Checking", desc: "IDEs use stacks to match brackets, XML tags, and other nested structures." },
          ].map((item) => (
            <div key={item.title} className="p-4 bg-card rounded-lg border border-border">
              <h4 className="font-semibold text-sm mb-1 text-accent-light">{item.title}</h4>
              <p className="text-xs text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* C++ Syntax Reference */}
      <Section icon={Code2} title="C++ Syntax Reference">
        <CodeBlock
          title="std::stack — Complete Reference"
          code={`#include <stack>
#include <vector>
#include <string>
using namespace std;

// === Basic Usage ===
stack<int> s;
s.push(10);            // Add to top
s.push(20);
s.top();               // 20 (peek, doesn't remove)
s.pop();               // Remove top (returns void!)
s.empty();             // false
s.size();              // 1

// === Safe Pop Pattern (always use this!) ===
if (!s.empty()) {
    int val = s.top();
    s.pop();
    // use val...
}

// === Stack with Different Container ===
stack<int, vector<int>> sv;    // Backed by vector
stack<int, list<int>> sl;      // Backed by list

// === Using vector as a stack (common in interviews) ===
vector<int> st;
st.push_back(10);      // push
st.push_back(20);
st.back();             // top/peek → 20
st.pop_back();         // pop
st.empty();            // empty check
st.size();             // size

// === Stack of pairs (useful for tracking index + value) ===
stack<pair<int, int>> sp;
sp.push({value, index});
auto [val, idx] = sp.top();  // Structured binding (C++17)

// === Stack of strings ===
stack<string> ss;
ss.push("hello");
string word = ss.top();

// === Clearing a stack (no clear() method!) ===
while (!s.empty()) s.pop();
// Or: s = stack<int>();  // Replace with empty stack`}
        />
      </Section>

      {/* Coding Challenges */}
      <Section icon={Code2} title="Coding Challenges">
        <p className="text-foreground/80 leading-relaxed mb-4">
          Practice stack problems — these are interview favorites.
        </p>

        <CodingChallenge
          title="Challenge 1: Valid Parentheses"
          description="Write a function that checks if a string of brackets is valid. Valid means every opening bracket has a matching closing bracket in the correct order. Handle '()', '[]', and '{}'."
          starterCode={`bool isValid(string s) {
    // Use a stack
    // Push opening brackets
    // For closing brackets, check if top matches
    // Return true if stack is empty at end

}`}
          solution={`bool isValid(string s) {
    stack<char> st;
    
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            st.push(c);
        } else {
            if (st.empty()) return false;
            char top = st.top();
            st.pop();
            if (c == ')' && top != '(') return false;
            if (c == ']' && top != '[') return false;
            if (c == '}' && top != '{') return false;
        }
    }
    
    return st.empty();
}
// Time: O(n), Space: O(n)`}
          hints={[
            "Push every opening bracket onto the stack.",
            "When you see a closing bracket, check if the stack top has the matching opening bracket.",
            "If the stack is empty when you see a closing bracket, it's invalid. If the stack is non-empty at the end, it's invalid.",
          ]}
          testDescription="Handle all three bracket types and check proper nesting order."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("stack") &&
              lower.includes("push") &&
              lower.includes("pop") &&
              lower.includes("st.empty()")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 2: Next Greater Element"
          description="Given an array of integers, find the next greater element for each element. If no greater element exists to the right, output -1. Use a monotonic stack for O(n) time."
          starterCode={`vector<int> nextGreater(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, -1);
    // Use a stack of indices
    // Maintain decreasing order in stack

}`}
          solution={`vector<int> nextGreater(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, -1);
    stack<int> st;  // Stack of indices
    
    for (int i = 0; i < n; i++) {
        while (!st.empty() && nums[st.top()] < nums[i]) {
            result[st.top()] = nums[i];
            st.pop();
        }
        st.push(i);
    }
    
    return result;
}
// Time: O(n) — each element pushed/popped at most once
// Space: O(n)`}
          hints={[
            "Use a stack to store INDICES, not values.",
            "For each new element, pop all stack elements that are SMALLER than it — those elements just found their next greater.",
            "Push the current index onto the stack after processing.",
          ]}
          testDescription="Store indices in the stack. Pop smaller elements when you find a greater one."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("stack") &&
              lower.includes("st.top()") &&
              lower.includes("nums[i]") &&
              lower.includes("st.push(i)")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 3: Min Stack"
          description="Design a stack class that supports push, pop, top, and getMin — all in O(1) time. Use an auxiliary stack to track the minimum."
          starterCode={`class MinStack {
    // Hint: use two stacks
    // mainStack for values, minStack for tracking minimum

public:
    void push(int val) {
        
    }
    
    void pop() {
        
    }
    
    int top() {
        
    }
    
    int getMin() {
        
    }
};`}
          solution={`class MinStack {
    stack<int> mainStack;
    stack<int> minStack;
    
public:
    void push(int val) {
        mainStack.push(val);
        if (minStack.empty() || val <= minStack.top()) {
            minStack.push(val);
        } else {
            minStack.push(minStack.top());
        }
    }
    
    void pop() {
        mainStack.pop();
        minStack.pop();
    }
    
    int top() {
        return mainStack.top();
    }
    
    int getMin() {
        return minStack.top();
    }
};
// All operations O(1)!`}
          hints={[
            "Keep a second stack (minStack) that always has the current minimum on top.",
            "When pushing: push the value to mainStack. Push min(val, current min) to minStack.",
            "When popping: pop from both stacks to keep them in sync.",
          ]}
          testDescription="Maintain two stacks in sync. minStack always has the current minimum on top."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("mainstack") &&
              lower.includes("minstack") &&
              lower.includes("mainstack.push") &&
              lower.includes("minstack.push") &&
              lower.includes("minstack.top()")
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
              <span><strong>Stacks follow LIFO</strong> — all operations (push, pop, top) are O(1).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Valid Parentheses</strong> is THE classic stack problem. Push opening, match closing with top.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Monotonic stacks</strong> solve &quot;next greater/smaller element&quot; in O(n). Google loves these.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Min Stack</strong> uses an auxiliary stack to track minimums in O(1).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>C++ std::stack::pop() returns void!</strong> Always call top() first, then pop().</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Think &quot;stack&quot; when you see:</strong> matching pairs, nesting, most recent first, undo, DFS, expression evaluation.</span>
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
