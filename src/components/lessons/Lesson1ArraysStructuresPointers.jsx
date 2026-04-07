"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutList,
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
    question: "What is an array in C/C++?",
    options: [
      "A collection of elements of different types stored randomly in memory",
      "A collection of elements of the same type stored in contiguous memory locations",
      "A linked list of nodes",
      "A dynamic data structure that grows automatically",
    ],
    correctIndex: 1,
    explanation:
      "An array is a collection of elements of the same data type stored in contiguous (adjacent) memory locations. This contiguous layout allows O(1) access via index using pointer arithmetic: address = base + index × sizeof(type).",
  },
  {
    id: 2,
    question: "If int A[5] starts at address 200 and sizeof(int) = 4, what is the address of A[3]?",
    options: ["203", "206", "212", "208"],
    correctIndex: 2,
    explanation:
      "Address of A[i] = base + i × sizeof(type) = 200 + 3 × 4 = 212. This is why arrays offer O(1) random access — the compiler calculates the address directly using this formula.",
  },
  {
    id: 3,
    question: "What is a structure (struct) in C/C++?",
    options: [
      "A function that returns multiple values",
      "A user-defined data type that groups variables of different types under one name",
      "An array of pointers",
      "A class without methods",
    ],
    correctIndex: 1,
    explanation:
      "A struct groups related variables (members) of potentially different types into a single unit. For example, a 'Student' struct can hold name (string), age (int), and GPA (float) together. In C++, structs are similar to classes (default public access).",
  },
  {
    id: 4,
    question: "What does a pointer store?",
    options: [
      "The value of a variable",
      "The memory address of another variable",
      "The size of a variable",
      "The data type of a variable",
    ],
    correctIndex: 1,
    explanation:
      "A pointer is a variable that stores the memory address of another variable. Declared with *: int *p; If int x = 10; then p = &x; makes p store the address of x. Use *p to access the value at that address (dereferencing).",
  },
  {
    id: 5,
    question: "What is the output?\nint x = 10;\nint *p = &x;\nprintf(\"%d\", *p);",
    options: ["Address of x", "10", "Address of p", "Compilation error"],
    correctIndex: 1,
    explanation:
      "*p dereferences the pointer — it accesses the value stored at the address p points to. Since p = &x and x = 10, *p gives 10. The & operator gets the address, the * operator dereferences (follows the address).",
  },
  {
    id: 6,
    question: "How are arrays stored in memory?",
    options: [
      "Elements are scattered randomly",
      "Elements are stored in contiguous (adjacent) memory locations",
      "Each element points to the next",
      "In a tree structure",
    ],
    correctIndex: 1,
    explanation:
      "Arrays are stored in contiguous memory — elements sit next to each other with no gaps. This is what makes index-based access O(1). If A[0] is at address 100 with sizeof(int) = 4, then A[1] is at 104, A[2] at 108, etc.",
  },
  {
    id: 7,
    question: "What is the difference between declaring int A[5] and int *A = new int[5]?",
    options: [
      "No difference",
      "int A[5] is on stack (fixed size), new int[5] is on heap (dynamic)",
      "int A[5] is on heap, new int[5] is on stack",
      "int A[5] creates a linked list",
    ],
    correctIndex: 1,
    explanation:
      "int A[5] allocates 5 ints on the stack — size must be known at compile time and is fixed. int *A = new int[5] allocates on the heap — size can be determined at runtime and memory persists until you delete[] it. Stack allocation is faster but limited in size.",
  },
  {
    id: 8,
    question: "What does the -> operator do?",
    options: [
      "Assigns a value to a pointer",
      "Accesses a member of a structure through a pointer",
      "Creates a new pointer",
      "Compares two pointers",
    ],
    correctIndex: 1,
    explanation:
      "The arrow operator -> is shorthand for (*p).member. If p is a pointer to a struct, p->name is equivalent to (*p).name — it dereferences the pointer and accesses the member in one step.",
  },
  {
    id: 9,
    question: "What is the size of a pointer on a 64-bit system?",
    options: ["4 bytes", "8 bytes", "Depends on the data type it points to", "2 bytes"],
    correctIndex: 1,
    explanation:
      "On a 64-bit system, all pointers are 8 bytes (64 bits) regardless of the data type they point to. An int* and a double* are both 8 bytes — they both store a memory address, and 64-bit addresses need 8 bytes. On 32-bit systems, pointers are 4 bytes.",
  },
  {
    id: 10,
    question: "What happens if you access A[5] in an array declared as int A[5]?",
    options: [
      "Returns 0",
      "Returns the last element",
      "Undefined behavior — out-of-bounds access",
      "Compilation error",
    ],
    correctIndex: 2,
    explanation:
      "int A[5] has valid indices 0 to 4. Accessing A[5] goes out of bounds — this is undefined behavior in C/C++. It might crash, return garbage, or silently corrupt memory. C/C++ does NOT check array bounds at runtime for performance reasons.",
  },
  {
    id: 11,
    question: "What is printed?\nstruct Point { int x, y; };\nstruct Point p = {3, 7};\nprintf(\"%d\", p.y);",
    options: ["3", "7", "10", "Compilation error"],
    correctIndex: 1,
    explanation:
      "The struct Point is initialized with x=3, y=7 using aggregate initialization {3, 7}. p.y accesses the second member, which is 7. The dot operator (.) accesses struct members directly.",
  },
  {
    id: 12,
    question: "What is the relationship between an array name and a pointer?",
    options: [
      "They are completely unrelated",
      "The array name acts as a constant pointer to the first element (A is equivalent to &A[0])",
      "A pointer is a type of array",
      "An array name can be reassigned like a pointer",
    ],
    correctIndex: 1,
    explanation:
      "The array name A decays to a pointer to its first element — A is equivalent to &A[0]. So *A gives A[0], *(A+1) gives A[1], etc. However, unlike a pointer variable, you cannot reassign the array name (A = something is illegal).",
  },
];

export default function Lesson1ArraysStructuresPointers({ onQuizComplete }) {
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
      {/* ===== ARRAYS BASICS ===== */}
      <Section icon={BookOpen} title="Arrays — The Foundation">
        <p className="text-foreground/80 leading-relaxed mb-4">
          An <strong>array</strong> is the most fundamental data structure — a collection of elements
          of the <strong>same type</strong> stored in <strong>contiguous memory</strong>. Understanding
          arrays deeply is essential because almost every other data structure builds on top of them.
        </p>

        <div className="bg-card rounded-xl border border-border p-5 my-4">
          <h4 className="font-semibold mb-3 text-accent-light">Memory Layout of an Array</h4>
          <div className="font-mono text-sm bg-code-bg rounded-lg p-4 overflow-x-auto">
            <p className="text-muted">{"// int A[5] = {2, 4, 6, 8, 10};"}</p>
            <p className="text-muted">{"// Assume base address = 200, sizeof(int) = 4 bytes"}</p>
            <p className="text-foreground/90 mt-2">{"Index:    [0]    [1]    [2]    [3]    [4]"}</p>
            <p className="text-foreground/90">{"Value:     2      4      6      8     10"}</p>
            <p className="text-accent-light">{"Address: 200    204    208    212    216"}</p>
            <p className="text-success mt-2">{"Formula: Address(A[i]) = Base + i × sizeof(type)"}</p>
            <p className="text-success">{"         Address(A[3]) = 200  + 3 × 4 = 212"}</p>
          </div>
        </div>

        <CodeBlock
          title="Array Declaration & Initialization"
          code={`#include <stdio.h>

int main() {
    // Method 1: Declare and initialize
    int A[5] = {2, 4, 6, 8, 10};
    
    // Method 2: Declare with size, assign later
    int B[5];
    B[0] = 1;
    B[1] = 3;
    B[2] = 5;
    B[3] = 7;
    B[4] = 9;
    
    // Method 3: Partial initialization (rest become 0)
    int C[5] = {1, 2};  // C = {1, 2, 0, 0, 0}
    
    // Method 4: All zeros
    int D[5] = {0};     // D = {0, 0, 0, 0, 0}
    
    // Method 5: Size inferred from initializer
    int E[] = {10, 20, 30};  // Size is 3
    
    // Accessing elements
    printf("A[0] = %d\\n", A[0]);   // 2
    printf("A[4] = %d\\n", A[4]);   // 10
    
    // Traversing an array
    for (int i = 0; i < 5; i++) {
        printf("%d ", A[i]);
    }
    // Output: 2 4 6 8 10
    
    return 0;
}`}
        />

        <KeyPoint>
          <strong>Why contiguous memory matters:</strong> Because elements are adjacent, accessing any
          element is O(1) — the CPU just calculates: base + index × size. No need to traverse anything.
          This is the key advantage of arrays over linked lists.
        </KeyPoint>

        <h3 className="text-lg font-semibold mt-8 mb-3 text-accent-light">Static vs Dynamic Arrays</h3>

        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-card">
                <th className="text-left p-3 border-b border-border font-semibold">Aspect</th>
                <th className="text-left p-3 border-b border-border font-semibold">Static Array</th>
                <th className="text-left p-3 border-b border-border font-semibold">Dynamic Array</th>
              </tr>
            </thead>
            <tbody>
              {[
                { aspect: "Declaration", stat: "int A[5];", dyn: "int *A = new int[5];" },
                { aspect: "Memory", stat: "Stack", dyn: "Heap" },
                { aspect: "Size", stat: "Fixed at compile time", dyn: "Can be set at runtime" },
                { aspect: "Lifetime", stat: "Auto (scope ends → gone)", dyn: "Until delete[] is called" },
                { aspect: "Resize", stat: "Cannot resize", dyn: "Must create new, copy, delete old" },
                { aspect: "Speed", stat: "Faster (stack allocation)", dyn: "Slightly slower (heap)" },
                { aspect: "Risk", stat: "Stack overflow if too big", dyn: "Memory leak if not freed" },
              ].map((row) => (
                <tr key={row.aspect} className="border-b border-border/50 hover:bg-card/50">
                  <td className="p-3 font-semibold">{row.aspect}</td>
                  <td className="p-3 text-xs font-mono">{row.stat}</td>
                  <td className="p-3 text-xs font-mono">{row.dyn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CodeBlock
          title="Static vs Dynamic Arrays"
          code={`#include <iostream>
using namespace std;

int main() {
    // ===== STATIC ARRAY (Stack) =====
    int A[5] = {1, 2, 3, 4, 5};
    // Size fixed at compile time
    // Memory auto-freed when function returns
    
    // ===== DYNAMIC ARRAY (Heap) =====
    int n;
    cout << "Enter size: ";
    cin >> n;                          // Size determined at runtime!
    
    int *B = new int[n];              // Allocate on heap
    
    for (int i = 0; i < n; i++) {
        B[i] = i * 10;               // Can use [] just like static array
    }
    
    // Print
    for (int i = 0; i < n; i++) {
        cout << B[i] << " ";
    }
    
    delete[] B;                       // MUST free heap memory!
    B = nullptr;                      // Good practice: avoid dangling pointer
    
    return 0;
}

// In C (malloc/free instead of new/delete):
// int *B = (int *)malloc(n * sizeof(int));
// free(B);`}
        />

        <Warning>
          <strong>Memory leak!</strong> Every <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">new</code> must
          have a matching <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">delete</code> (or
          <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">new[]</code> with
          <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">delete[]</code>).
          Forgetting to free heap memory causes memory leaks — the memory stays allocated even after
          your program no longer needs it.
        </Warning>

        <CodeBlock
          title="How to Increase Array Size"
          code={`// You CANNOT resize a static array. But you can create a bigger dynamic one.

int *A = new int[5]{1, 2, 3, 4, 5};

// Need more space? Create bigger array, copy, delete old
int *B = new int[10];              // New bigger array

for (int i = 0; i < 5; i++) {
    B[i] = A[i];                   // Copy elements
}

delete[] A;                        // Free old memory
A = B;                             // Point A to new array
B = nullptr;

// Now A has size 10, first 5 elements are {1,2,3,4,5}
// This is exactly what std::vector does internally when it grows!`}
        />
      </Section>

      {/* ===== STRUCTURES ===== */}
      <Section icon={Zap} title="Structures (struct)">
        <p className="text-foreground/80 leading-relaxed mb-4">
          A <strong>structure</strong> groups related variables of <strong>different types</strong> under
          one name. Think of it as a blueprint for a custom data type. In C++, structs and classes are
          nearly identical (structs default to public, classes to private).
        </p>

        <CodeBlock
          title="Defining and Using Structures"
          code={`#include <stdio.h>

// Define a structure
struct Rectangle {
    int length;
    int breadth;
};

int main() {
    // Method 1: Declare and initialize
    struct Rectangle r1 = {10, 5};
    
    // Method 2: Declare then assign
    struct Rectangle r2;
    r2.length = 15;
    r2.breadth = 8;
    
    // Access members using dot operator
    printf("r1: length=%d, breadth=%d\\n", r1.length, r1.breadth);
    printf("Area of r1 = %d\\n", r1.length * r1.breadth);  // 50
    printf("Area of r2 = %d\\n", r2.length * r2.breadth);  // 120
    
    return 0;
}

// In C++, you can omit 'struct' keyword:
// Rectangle r1 = {10, 5};  // No need for 'struct' prefix`}
        />

        <CodeBlock
          title="Complex Structure Example"
          code={`#include <iostream>
#include <string>
using namespace std;

struct Student {
    string name;
    int rollNo;
    float grades[5];     // Array inside struct!
    float gpa;
};

int main() {
    Student s1;
    s1.name = "Alice";
    s1.rollNo = 101;
    s1.grades[0] = 85.5;
    s1.grades[1] = 92.0;
    s1.grades[2] = 78.3;
    s1.grades[3] = 95.0;
    s1.grades[4] = 88.7;
    
    // Calculate GPA
    float sum = 0;
    for (int i = 0; i < 5; i++) {
        sum += s1.grades[i];
    }
    s1.gpa = sum / 5.0;
    
    cout << s1.name << " (Roll: " << s1.rollNo << ")" << endl;
    cout << "GPA: " << s1.gpa << endl;  // 87.9
    
    // Array of structures
    Student class_[3];
    class_[0] = {"Bob", 102, {90,85,88,92,87}, 0};
    class_[1] = {"Carol", 103, {95,90,93,88,91}, 0};
    class_[2] = {"Dave", 104, {78,82,80,75,85}, 0};
    
    return 0;
}`}
        />

        <div className="bg-card rounded-xl border border-border p-5 my-4">
          <h4 className="font-semibold mb-3 text-accent-light">Memory Layout of a Structure</h4>
          <div className="font-mono text-sm bg-code-bg rounded-lg p-4 overflow-x-auto">
            <p className="text-muted">{"// struct Rectangle { int length; int breadth; };"}</p>
            <p className="text-muted">{"// struct Rectangle r = {10, 5};"}</p>
            <p className="text-muted">{"// sizeof(Rectangle) = 8 bytes (two ints)"}</p>
            <p className="text-foreground/90 mt-2">{"┌──────────┬──────────┐"}</p>
            <p className="text-foreground/90">{"│ length=10│breadth=5 │"}</p>
            <p className="text-foreground/90">{"│ (4 bytes)│(4 bytes) │"}</p>
            <p className="text-foreground/90">{"└──────────┴──────────┘"}</p>
            <p className="text-accent-light">{"Address: 200       204"}</p>
            <p className="text-muted mt-2">{"Members are laid out contiguously (with possible padding for alignment)"}</p>
          </div>
        </div>

        <KeyPoint>
          <strong>Structure padding:</strong> The compiler may add padding bytes between members for
          memory alignment. For example, a struct with a char and an int may be 8 bytes instead of 5.
          This is for CPU performance — aligned reads are faster.
        </KeyPoint>
      </Section>

      {/* ===== POINTERS ===== */}
      <Section icon={Zap} title="Pointers — The Core of C/C++">
        <p className="text-foreground/80 leading-relaxed mb-4">
          A <strong>pointer</strong> is a variable that stores the <strong>memory address</strong> of
          another variable. Pointers are the most powerful (and dangerous) feature of C/C++ — they
          enable dynamic memory, data structures, and efficient parameter passing.
        </p>

        <div className="bg-card rounded-xl border border-border p-5 my-4">
          <h4 className="font-semibold mb-3 text-accent-light">Pointer Visualization</h4>
          <div className="font-mono text-sm bg-code-bg rounded-lg p-4 overflow-x-auto">
            <p className="text-muted">{"// int x = 10;"}</p>
            <p className="text-muted">{"// int *p = &x;    // p stores address of x"}</p>
            <p className="text-foreground/90 mt-2">{"     p                    x"}</p>
            <p className="text-foreground/90">{"  ┌───────┐           ┌───────┐"}</p>
            <p className="text-foreground/90">{"  │  200  │ ────────> │  10   │"}</p>
            <p className="text-foreground/90">{"  └───────┘           └───────┘"}</p>
            <p className="text-accent-light">{"  addr: 300            addr: 200"}</p>
            <p className="text-success mt-2">{"  p  = 200      (address of x)"}</p>
            <p className="text-success">{"  *p = 10       (value at that address — dereferencing)"}</p>
            <p className="text-success">{"  &x = 200      (address-of operator)"}</p>
          </div>
        </div>

        <CodeBlock
          title="Pointer Basics — Declaration, Assignment, Dereferencing"
          code={`#include <stdio.h>

int main() {
    int x = 10;
    
    // Declare a pointer to int
    int *p;         // p can hold the address of an int
    
    // Assign address of x to p
    p = &x;         // & = "address-of" operator
    
    // Three key operations:
    printf("x  = %d\\n", x);     // 10        (value of x)
    printf("&x = %p\\n", &x);    // 0x200     (address of x)
    printf("p  = %p\\n", p);     // 0x200     (p stores address of x)
    printf("*p = %d\\n", *p);    // 10        (dereference: value AT the address)
    
    // Modify x through the pointer
    *p = 20;
    printf("x = %d\\n", x);      // 20! Changed via pointer
    
    // Pointer arithmetic
    int A[5] = {2, 4, 6, 8, 10};
    int *q = A;             // Array name = pointer to first element
    
    printf("*q     = %d\\n", *q);       // 2  (A[0])
    printf("*(q+1) = %d\\n", *(q+1));   // 4  (A[1])
    printf("*(q+2) = %d\\n", *(q+2));   // 6  (A[2])
    // q+i moves i × sizeof(int) bytes forward
    
    return 0;
}`}
        />

        <CodeBlock
          title="Dynamic Memory with Pointers"
          code={`#include <stdio.h>
#include <stdlib.h>

int main() {
    // ===== C style: malloc / free =====
    int *p = (int *)malloc(5 * sizeof(int));  // Allocate 5 ints on heap
    
    if (p == NULL) {
        printf("Memory allocation failed!\\n");
        return 1;
    }
    
    // Use it like an array
    for (int i = 0; i < 5; i++) {
        p[i] = (i + 1) * 10;    // p[i] is same as *(p + i)
    }
    
    for (int i = 0; i < 5; i++) {
        printf("%d ", p[i]);     // 10 20 30 40 50
    }
    
    free(p);                     // MUST free when done
    p = NULL;                    // Avoid dangling pointer
    
    return 0;
}

// ===== C++ style: new / delete =====
// int *p = new int[5];         // Allocate
// p[0] = 10; p[1] = 20; ...   // Use
// delete[] p;                   // Free
// p = nullptr;                  // Safe`}
        />

        <div className="grid gap-3 md:grid-cols-2 my-4">
          <div className="p-4 bg-card rounded-lg border border-border">
            <h4 className="font-semibold text-sm mb-2 text-accent-light">Key Pointer Operations</h4>
            <ul className="text-xs text-foreground/80 space-y-1">
              <li>- <strong>&x</strong> — address of x</li>
              <li>- <strong>*p</strong> — value at address p (dereference)</li>
              <li>- <strong>p++</strong> — move to next element</li>
              <li>- <strong>p + i</strong> — move i elements forward</li>
              <li>- <strong>p[i]</strong> — same as *(p + i)</li>
            </ul>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border">
            <h4 className="font-semibold text-sm mb-2 text-danger">Common Pointer Bugs</h4>
            <ul className="text-xs text-foreground/80 space-y-1">
              <li>- <strong>Dangling pointer</strong> — points to freed memory</li>
              <li>- <strong>Memory leak</strong> — malloc without free</li>
              <li>- <strong>Null dereference</strong> — *NULL crashes</li>
              <li>- <strong>Wild pointer</strong> — uninitialized pointer</li>
              <li>- <strong>Buffer overflow</strong> — writing past array end</li>
            </ul>
          </div>
        </div>

        <Warning>
          <strong>Never dereference a NULL or uninitialized pointer!</strong> Always check
          <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">if (p != NULL)</code> before
          using <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">*p</code>.
          Dereferencing NULL causes a segmentation fault (crash). In C++, use
          <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">nullptr</code> instead
          of <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">NULL</code>.
        </Warning>
      </Section>

      {/* ===== POINTER TO STRUCTURE ===== */}
      <Section icon={Code2} title="Pointer to Structure">
        <p className="text-foreground/80 leading-relaxed mb-4">
          When you have a pointer to a struct, you use the <strong>arrow operator
          <code className="px-1.5 py-0.5 bg-code-bg rounded text-accent-light text-xs">{"->"}</code></strong> to
          access members. This is essential for linked lists, trees, and all dynamic data structures.
        </p>

        <CodeBlock
          title="Pointer to Structure — Dot vs Arrow"
          code={`#include <stdio.h>
#include <stdlib.h>

struct Rectangle {
    int length;
    int breadth;
};

int main() {
    // ===== Stack allocation: use dot operator =====
    struct Rectangle r1 = {10, 5};
    printf("Area = %d\\n", r1.length * r1.breadth);   // 50
    
    // ===== Heap allocation: use arrow operator =====
    struct Rectangle *p = (struct Rectangle *)malloc(sizeof(struct Rectangle));
    
    // Access members through pointer:
    p->length = 15;        // Arrow operator (preferred)
    p->breadth = 8;
    // Same as: (*p).length = 15;  (*p).breadth = 8;
    
    printf("Area = %d\\n", p->length * p->breadth);    // 120
    
    free(p);
    
    // ===== Pointer to stack struct =====
    struct Rectangle r2 = {20, 10};
    struct Rectangle *q = &r2;    // q points to r2 on stack
    
    printf("Area = %d\\n", q->length * q->breadth);    // 200
    // q->length is same as (*q).length is same as r2.length
    
    return 0;
}

// RULE:
// Variable on STACK  → use dot:   r.length
// Pointer to struct  → use arrow: p->length`}
        />

        <div className="bg-card rounded-xl border border-border p-5 my-4">
          <h4 className="font-semibold mb-3 text-accent-light">Stack vs Heap Struct</h4>
          <div className="font-mono text-sm bg-code-bg rounded-lg p-4 overflow-x-auto">
            <p className="text-muted">{"// Stack:                    Heap:"}</p>
            <p className="text-muted">{"// struct Rect r = {10,5};   struct Rect *p = new Rect;"}</p>
            <p className="text-foreground/90 mt-1">{"                               p"}</p>
            <p className="text-foreground/90">{"     r                      ┌───────┐"}</p>
            <p className="text-foreground/90">{"  ┌────────┐               │  500  │──────┐"}</p>
            <p className="text-foreground/90">{"  │ len=10 │               └───────┘      │"}</p>
            <p className="text-foreground/90">{"  │ bre=5  │               (on stack)     ▼"}</p>
            <p className="text-foreground/90">{"  └────────┘                          ┌────────┐"}</p>
            <p className="text-foreground/90">{"  (on stack)                          │ len=?  │"}</p>
            <p className="text-foreground/90">{"                                      │ bre=?  │"}</p>
            <p className="text-foreground/90">{"  r.length = 10                       └────────┘"}</p>
            <p className="text-foreground/90">{"                                      (on heap)"}</p>
            <p className="text-accent-light">{"                           p->length = ?"}</p>
          </div>
        </div>

        <KeyPoint>
          <strong>This is the foundation of ALL dynamic data structures:</strong> Linked lists, trees,
          and graphs all use pointers to structs on the heap. A linked list node is just a struct with
          a data field and a pointer to the next node. Master this pattern and you master DSA in C/C++.
        </KeyPoint>
      </Section>

      {/* ===== ARRAYS AND POINTERS RELATIONSHIP ===== */}
      <Section icon={Brain} title="Arrays & Pointers — The Deep Connection">
        <CodeBlock
          title="Array Name = Pointer to First Element"
          code={`#include <stdio.h>

int main() {
    int A[5] = {2, 4, 6, 8, 10};
    
    // Array name 'A' is a pointer to A[0]
    printf("A    = %p\\n", A);      // Address of A[0]
    printf("&A[0]= %p\\n", &A[0]);  // Same address!
    
    // Pointer arithmetic = array indexing
    printf("*A       = %d\\n", *A);        // 2  (A[0])
    printf("*(A+1)   = %d\\n", *(A+1));    // 4  (A[1])
    printf("*(A+2)   = %d\\n", *(A+2));    // 6  (A[2])
    
    // These are ALL equivalent:
    // A[i]  ≡  *(A + i)  ≡  *(i + A)  ≡  i[A]
    printf("A[3]     = %d\\n", A[3]);      // 8
    printf("*(A+3)   = %d\\n", *(A+3));    // 8
    printf("3[A]     = %d\\n", 3[A]);      // 8  (weird but legal!)
    
    // Using a pointer to traverse
    int *p = A;
    for (int i = 0; i < 5; i++) {
        printf("%d ", *p);    // Print value
        p++;                  // Move to next element
    }
    // Output: 2 4 6 8 10
    
    // KEY DIFFERENCE:
    // int *p = A;  → p is a pointer VARIABLE (can be reassigned)
    // A itself is a CONSTANT pointer (cannot do A++)
    
    return 0;
}`}
        />
      </Section>

      {/* ===== C++ SYNTAX REFERENCE ===== */}
      <Section icon={Code2} title="C++ Syntax Reference">
        <CodeBlock
          title="Arrays, Structures & Pointers — Quick Reference"
          code={`#include <iostream>
using namespace std;

// ========== ARRAY ==========
int A[5] = {1, 2, 3, 4, 5};           // Static (stack)
int *B = new int[5]{10, 20, 30, 40, 50};  // Dynamic (heap)
int size = sizeof(A) / sizeof(A[0]);   // Get static array size: 5
delete[] B;                             // Free dynamic array

// ========== STRUCTURE ==========
struct Node {
    int data;
    Node *next;    // Pointer to another Node (linked list!)
};

Node n1 = {10, nullptr};    // Stack allocation
Node *p = new Node;         // Heap allocation
p->data = 20;
p->next = nullptr;
delete p;                   // Free heap struct

// ========== POINTER ==========
int x = 42;
int *ptr = &x;              // ptr stores address of x
cout << *ptr;               // 42 (dereference)
*ptr = 100;                 // x is now 100

// ========== POINTER ARITHMETIC ==========
int arr[3] = {10, 20, 30};
int *q = arr;               // q points to arr[0]
q++;                        // Now points to arr[1]
cout << *q;                 // 20

// ========== MEMORY ALLOCATION ==========
// C style:
// int *p = (int *)malloc(n * sizeof(int));
// free(p);

// C++ style:
// int *p = new int[n];
// delete[] p;

// ========== NULLPTR ==========
int *safe = nullptr;        // C++11: use nullptr, not NULL
if (safe != nullptr) {
    cout << *safe;           // Safe: only dereference if not null
}`}
        />
      </Section>

      {/* ===== CODING CHALLENGES ===== */}
      <Section icon={Code2} title="Coding Challenges">
        <CodingChallenge
          title="Challenge 1: Array Sum Using Pointer Arithmetic"
          description="Write a function that takes an array and its size, and returns the sum of all elements using pointer arithmetic (not index-based access)."
          starterCode={`int arraySum(int *arr, int n) {
    // Use pointer arithmetic (*arr, arr++) to traverse
    // Do NOT use arr[i] — use pointers only!
    
}`}
          solution={`int arraySum(int *arr, int n) {
    int sum = 0;
    for (int i = 0; i < n; i++) {
        sum += *arr;    // Dereference current pointer
        arr++;          // Move to next element
    }
    return sum;
    
    // Alternative one-liner loop:
    // for (int i = 0; i < n; i++) sum += *(arr + i);
}`}
          hints={[
            "*arr gives the value at the current pointer position.",
            "arr++ moves the pointer to the next element (moves by sizeof(int) bytes).",
            "Loop n times: add *arr to sum, then increment arr.",
          ]}
          testDescription="Use *arr to read value, arr++ to advance. Pointer arithmetic replaces indexing."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("*arr") &&
              (lower.includes("arr++") || lower.includes("*(arr+"))
            );
          }}
        />

        <CodingChallenge
          title="Challenge 2: Create a Dynamic Array of Structs"
          description="Define a struct 'Student' with name (string) and marks (int). Dynamically allocate an array of n students on the heap, fill them, and print them. Don't forget to free memory!"
          starterCode={`#include <iostream>
using namespace std;

struct Student {
    string name;
    int marks;
};

int main() {
    int n = 3;
    // Dynamically allocate array of n Students on heap
    // Fill with sample data
    // Print all students
    // Free memory
    
}`}
          solution={`#include <iostream>
using namespace std;

struct Student {
    string name;
    int marks;
};

int main() {
    int n = 3;
    Student *students = new Student[n];
    
    students[0] = {"Alice", 95};
    students[1] = {"Bob", 87};
    students[2] = {"Carol", 92};
    
    for (int i = 0; i < n; i++) {
        cout << students[i].name << ": " << students[i].marks << endl;
    }
    // Or using pointer: (students + i)->name
    
    delete[] students;
    students = nullptr;
    
    return 0;
}`}
          hints={[
            "Use Student *arr = new Student[n]; to allocate on heap.",
            "Access with arr[i].name or (arr + i)->name — both work.",
            "Always delete[] arr; when done to avoid memory leak.",
          ]}
          testDescription="new Student[n] allocates on heap. Access with dot (arr[i].field) or arrow ((arr+i)->field). delete[] to free."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("newstudent[") &&
              lower.includes("delete[]")
            );
          }}
        />

        <CodingChallenge
          title="Challenge 3: Swap Two Variables Using Pointers"
          description="Write a function that swaps two integers using pointers. The function should take two int pointers and swap the values they point to."
          starterCode={`void swap(int *a, int *b) {
    // Swap the values pointed to by a and b
    
}

// Test: int x=5, y=10; swap(&x, &y);
// After: x=10, y=5`}
          solution={`void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

// Test: int x=5, y=10; swap(&x, &y);
// After: x=10, y=5
// This is call by address — modifies original variables!`}
          hints={[
            "*a gives the value at address a. *b gives the value at address b.",
            "Store *a in a temp variable, then assign *b to *a, then temp to *b.",
            "This is 'call by address' — changes persist after function returns.",
          ]}
          testDescription="Classic pointer swap: temp = *a; *a = *b; *b = temp; — call by address modifies originals."
          validateAnswer={(code) => {
            const lower = code.toLowerCase().replace(/\s/g, "");
            return (
              lower.includes("temp") &&
              lower.includes("*a") &&
              lower.includes("*b")
            );
          }}
        />
      </Section>

      {/* ===== KEY TAKEAWAYS ===== */}
      <Section icon={Trophy} title="Key Takeaways">
        <div className="bg-gradient-to-br from-accent/10 to-accent-light/5 rounded-xl border border-accent/20 p-6">
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Arrays = contiguous memory.</strong> O(1) access via index. Address = base + i × sizeof(type).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Static arrays → stack (fixed size).</strong> Dynamic arrays → heap (runtime size, must free).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Structures group different types</strong> under one name. Foundation for nodes in linked lists, trees, graphs.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Pointers store addresses.</strong> & = address-of, * = dereference. Master these two operators.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Dot vs Arrow:</strong> stack struct → <code className="px-1 bg-code-bg rounded text-xs">r.field</code>. Pointer to struct → <code className="px-1 bg-code-bg rounded text-xs">{"p->field"}</code>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Array name ≈ pointer to first element.</strong> A[i] ≡ *(A+i). But array name is constant (can&apos;t reassign).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <span><strong>Every new needs a delete.</strong> Every malloc needs a free. No exceptions.</span>
            </li>
          </ul>
        </div>
      </Section>

      {/* ===== QUIZ ===== */}
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
