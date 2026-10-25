# Data Structures & Algorithms Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Language note:** Code examples use **Python 3.10+** because it is short and readable. The ideas are language-independent. Where JavaScript or Java behave differently in a way that matters in interviews, it is marked. Examples use the sample name **Ritesh Kumar**.
> This file covers complexity analysis, core data structures, sorting and searching, recursion, trees, graphs, heaps, hashing, dynamic programming, greedy, backtracking, advanced structures, problem-solving patterns, and how DSA connects to real production systems.

## 📑 Index
- [Part 1: Fresher (0–1 year)](#-part-1-fresher-01-year)
- [Part 2: Junior (1–3 years)](#-part-2-junior-13-years)
- [Part 3: Mid (3–5 years)](#-part-3-mid-35-years)
- [Part 4: Senior (5–7 years)](#-part-4-senior-57-years)
- [Part 5: Lead / Architect (7+ years)](#-part-5-lead--architect-7-years)
- [Part 6: Coding / Machine-Coding Tasks](#-part-6-coding--machine-coding-tasks)
- [Part 7: Debugging Scenarios](#-part-7-debugging-scenarios)
- [Part 8: Tricky Questions](#-part-8-tricky-questions)
- [Part 9: Rapid Fire](#-part-9-rapid-fire-one-liners)
- [Part 10: Project / Behavioral](#-part-10-project--behavioral-questions)
- [Part 11: Complete Coverage (Topics + Patterns + Mixed)](#-part-11-complete-coverage-topics--patterns--mixed)
- [Part 12: Internals (How Structures Really Work)](#-part-12-internals-how-structures-really-work)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is a data structure? What is an algorithm?
A **data structure** is a way to organize and store data so that operations (insert, search, delete, iterate) are efficient. An **algorithm** is a step-by-step procedure to solve a problem. Good programs pick the right structure and the right algorithm together.

### Q2. What is time complexity and space complexity? *(Must-know)*
- **Time complexity**: how the number of operations grows with input size `n`.
- **Space complexity**: how extra memory grows with `n` (usually excluding the input itself, called *auxiliary space*).
We describe growth, not exact seconds. We drop constants and lower terms: `3n² + 5n + 2` becomes `O(n²)`.

### Q3. Explain Big-O, Big-Omega and Big-Theta
- **O (upper bound)**: grows no faster than. Usually used for worst case.
- **Ω (lower bound)**: grows at least as fast as.
- **Θ (tight bound)**: both O and Ω.
In interviews "O(n)" is used loosely to mean the tight worst-case bound. Best, average and worst case are different *scenarios*, not the same thing as O, Ω, Θ.

### Q4. Common complexity classes (slow to fast growth)
`O(1)` constant, `O(log n)` logarithmic, `O(n)` linear, `O(n log n)` linearithmic, `O(n²)` quadratic, `O(n³)` cubic, `O(2ⁿ)` exponential, `O(n!)` factorial.
Rough limits for 1 second (about 10⁸ simple operations): `n ≤ 10⁸` for O(n), `10⁶` for O(n log n), `10⁴` for O(n²), `~25` for O(2ⁿ), `~10` for O(n!).

### Q5. How do you calculate the complexity of code?
Count how many times the innermost statements run.
```python
def a(n):
    for i in range(n):          # n times
        for j in range(n):      # n times each
            pass                # O(n^2)

def b(n):
    i = 1
    while i < n:
        i *= 2                  # doubles each time: O(log n)

def c(n):
    for i in range(n):          # O(n)
        pass
    for j in range(n):          # O(n)
        pass                    # total O(n + n) = O(n)
```
Sequential blocks add. Nested blocks multiply. Halving or doubling gives `log n`.

### Q6. What is an array? Complexity of operations
Contiguous memory with index access.
| Operation | Time |
|---|---|
| Access by index | O(1) |
| Search (unsorted) | O(n) |
| Insert / delete at end | O(1) (amortized for dynamic arrays) |
| Insert / delete at start or middle | O(n) (shift elements) |

### Q7. Static array vs dynamic array
A static array has a fixed size. A **dynamic array** (Python `list`, Java `ArrayList`, JS `Array`, C++ `vector`) resizes by allocating a bigger block (usually 1.5× to 2×) and copying. Appends are **amortized O(1)** even though one resize costs O(n).

### Q8. What is amortized analysis? *(Must-know)*
The average cost per operation over a long sequence, even if a single operation is sometimes expensive. For doubling arrays: n appends cost about `n + (1 + 2 + 4 + ... + n) ≈ 3n`, so each append is O(1) amortized. It is different from average-case: amortized gives a *guarantee* over the sequence, with no randomness.

### Q9. Linked list: types and operations
Nodes holding a value and pointer(s). Types: singly, doubly, circular.
```python
class Node:
    def __init__(self, val, nxt=None):
        self.val, self.next = val, nxt
```
| Operation | Singly linked list |
|---|---|
| Access by index | O(n) |
| Insert/delete at head | O(1) |
| Insert/delete at tail | O(n) (O(1) with a tail pointer for insert) |
| Delete a known node | O(1) if doubly linked; O(n) to find the previous node if singly |

### Q10. Array vs linked list: when to use which?
Arrays: fast random access, cache-friendly, low memory overhead. Linked lists: O(1) insert/delete when you already hold the node, no resizing. In practice, arrays beat linked lists in most real workloads because of CPU cache locality.

### Q11. Reverse a linked list
```python
def reverse(head):
    prev, cur = None, head
    while cur:
        cur.next, prev, cur = prev, cur, cur.next
    return prev
```
O(n) time, O(1) space.

### Q12. Detect a cycle in a linked list (Floyd's tortoise and hare) *(Must-know)*
```python
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow is fast:
            return True
    return False
```
O(n) time, O(1) space. To find the cycle start: after meeting, move one pointer to head and advance both by one step; they meet at the start.

### Q13. Stack
LIFO (last in, first out). Operations `push`, `pop`, `peek` are O(1). Uses: function call stack, undo, expression evaluation, bracket matching, DFS, browser back button.
```python
stack = []
stack.append(1); stack.append(2)
stack.pop()        # 2
```

### Q14. Queue and deque
Queue is FIFO. Uses: BFS, task scheduling, buffering. Do **not** use `list.pop(0)` in Python (O(n)); use `collections.deque` (O(1) at both ends).
```python
from collections import deque
q = deque()
q.append(1); q.append(2)
q.popleft()        # 1
```
In JavaScript `array.shift()` is O(n) in the worst case, so use an index pointer or a linked queue for large queues.

### Q15. Hash table (hash map) *(Must-know)*
Stores key-value pairs. A **hash function** turns a key into an array index. Average O(1) for insert, lookup, delete. Worst case O(n) if many keys collide. Python `dict`, JS `Map`/`Object`, Java `HashMap`.

### Q16. Collision handling
- **Chaining**: each bucket holds a list (or tree) of entries. Java `HashMap` turns long chains into red-black trees (since Java 8).
- **Open addressing**: probe for another slot (linear, quadratic, double hashing). Python `dict` uses open addressing with a perturbed probe.
The **load factor** (entries / buckets) triggers a resize (rehash) when too high.

### Q17. Set
A hash-based collection of unique elements with O(1) average membership tests. Use it to remove duplicates and to check "have I seen this?".
```python
seen = set()
for x in [1, 2, 2, 3]:
    if x in seen: print("dup", x)
    seen.add(x)
```

### Q18. Linear search vs binary search *(Must-know)*
Linear: O(n), works on anything. Binary search: O(log n), needs **sorted** data and random access.
```python
def binary_search(a, t):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2      # avoids overflow in fixed-width languages
        if a[mid] == t: return mid
        if a[mid] < t: lo = mid + 1
        else: hi = mid - 1
    return -1
```

### Q19. Recursion
A function calling itself on a smaller problem. Needs a **base case** and progress toward it. Each call uses stack space, so deep recursion can overflow (Python default limit is about 1000).
```python
def fact(n):
    return 1 if n <= 1 else n * fact(n - 1)    # O(n) time, O(n) stack
```

### Q20. Fibonacci: naive vs memoized
```python
def fib(n):                      # O(2^n)
    return n if n < 2 else fib(n-1) + fib(n-2)

from functools import lru_cache
@lru_cache(None)
def fib_memo(n):                 # O(n) time and space
    return n if n < 2 else fib_memo(n-1) + fib_memo(n-2)

def fib_iter(n):                 # O(n) time, O(1) space
    a, b = 0, 1
    for _ in range(n): a, b = b, a + b
    return a
```

### Q21. Bubble, selection and insertion sort
All O(n²) in the worst case, O(1) space.
- **Bubble**: swap adjacent out-of-order pairs repeatedly. Best case O(n) with an early-exit flag.
- **Selection**: select the minimum and put it in place. Always O(n²). Few swaps.
- **Insertion**: insert each element into the sorted prefix. O(n) on nearly sorted data. Good for small arrays and is used inside hybrid sorts.
```python
def insertion_sort(a):
    for i in range(1, len(a)):
        key, j = a[i], i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]; j -= 1
        a[j + 1] = key
```

### Q22. Merge sort *(Must-know)*
Divide and conquer. Split in halves, sort each, merge. O(n log n) always, O(n) extra space, **stable**.
```python
def merge_sort(a):
    if len(a) <= 1: return a
    m = len(a) // 2
    l, r = merge_sort(a[:m]), merge_sort(a[m:])
    out, i, j = [], 0, 0
    while i < len(l) and j < len(r):
        if l[i] <= r[j]: out.append(l[i]); i += 1
        else: out.append(r[j]); j += 1
    return out + l[i:] + r[j:]
```

### Q23. Quick sort *(Must-know)*
Pick a pivot, partition into smaller and larger parts, recurse. Average O(n log n), worst O(n²) (bad pivots, e.g. already sorted with first-element pivot). In-place (O(log n) stack), **not stable**. Use a random or median-of-three pivot.
```python
def quick_sort(a):
    if len(a) <= 1: return a
    p = a[len(a) // 2]
    return (quick_sort([x for x in a if x < p]) +
            [x for x in a if x == p] +
            quick_sort([x for x in a if x > p]))
```

### Q24. What is a stable sort? Which sorts are stable?
Equal elements keep their original relative order. Stable: merge, insertion, bubble, counting, radix, Timsort. Not stable: quick, heap, selection (usually). Stability matters when sorting by multiple keys.

### Q25. What sort do languages use?
Python and Java (for objects): **Timsort** (merge + insertion hybrid, stable, O(n log n) worst, O(n) on sorted runs). JavaScript `Array.prototype.sort`: stable since ES2019 (V8 uses Timsort). C++ `std::sort`: introsort (quick + heap + insertion). Remember JS default sort compares as **strings**: `[10, 2, 1].sort()` gives `[1, 10, 2]`. Use `(a, b) => a - b`.

### Q26. Tree basics
A hierarchical structure of nodes. Terms: root, parent, child, leaf, depth (distance from root), height (longest path to a leaf), subtree, level.

### Q27. Binary tree traversals *(Must-know)*
```python
class T:
    def __init__(self, v, l=None, r=None): self.v, self.l, self.r = v, l, r

def inorder(n):   return inorder(n.l) + [n.v] + inorder(n.r) if n else []
def preorder(n):  return [n.v] + preorder(n.l) + preorder(n.r) if n else []
def postorder(n): return postorder(n.l) + postorder(n.r) + [n.v] if n else []

from collections import deque
def level_order(root):
    out, q = [], deque([root] if root else [])
    while q:
        level = []
        for _ in range(len(q)):
            n = q.popleft(); level.append(n.v)
            if n.l: q.append(n.l)
            if n.r: q.append(n.r)
        out.append(level)
    return out
```
Inorder of a BST gives sorted order.

### Q28. Binary Search Tree (BST)
For every node: left subtree values < node < right subtree values. Search, insert, delete average O(log n), worst O(n) if the tree degenerates into a line (e.g. inserting sorted data). Balanced variants (AVL, red-black) guarantee O(log n).

### Q29. Height of a binary tree
```python
def height(n): return 0 if not n else 1 + max(height(n.l), height(n.r))
```
O(n) time, O(h) stack.

### Q30. Graph basics
A set of vertices and edges. Directed or undirected, weighted or unweighted, cyclic or acyclic. Representations:
- **Adjacency list**: `dict[node] -> list[neighbors]`. Space O(V + E). Best for sparse graphs. Default choice.
- **Adjacency matrix**: V×V grid. Space O(V²). O(1) edge check. Good for dense graphs.

### Q31. BFS and DFS *(Must-know)*
```python
from collections import deque
def bfs(g, s):
    seen, q, order = {s}, deque([s]), []
    while q:
        u = q.popleft(); order.append(u)
        for v in g[u]:
            if v not in seen: seen.add(v); q.append(v)
    return order

def dfs(g, u, seen=None):
    seen = seen if seen is not None else set()
    seen.add(u)
    for v in g[u]:
        if v not in seen: dfs(g, v, seen)
    return seen
```
Both O(V + E). BFS finds the **shortest path in an unweighted graph**. DFS is used for cycle detection, topological sort, connected components, and backtracking.

### Q32. Heap and priority queue
A complete binary tree where each parent is ≤ (min-heap) or ≥ (max-heap) its children. Push and pop are O(log n), peek is O(1), build-heap is O(n).
```python
import heapq
h = []
heapq.heappush(h, 5); heapq.heappush(h, 1)
heapq.heappop(h)                # 1  (min-heap)
heapq.heappush(h, -7)           # trick for max-heap: store negatives
```

### Q33. Two-pointer technique
Use two indices moving through the data. Typical for sorted arrays and in-place edits.
```python
def two_sum_sorted(a, t):
    l, r = 0, len(a) - 1
    while l < r:
        s = a[l] + a[r]
        if s == t: return (l, r)
        if s < t: l += 1
        else: r -= 1
```
O(n) time, O(1) space.

### Q34. Two Sum with a hash map
```python
def two_sum(nums, t):
    seen = {}
    for i, n in enumerate(nums):
        if t - n in seen: return (seen[t - n], i)
        seen[n] = i
```
O(n) time, O(n) space.

### Q35. String basics: palindrome, anagram, reverse
```python
def is_palindrome(s):
    s = [c.lower() for c in s if c.isalnum()]
    return s == s[::-1]

from collections import Counter
def is_anagram(a, b): return Counter(a) == Counter(b)   # O(n)
```
Strings are **immutable** in Python, Java and JS. Repeated `s += x` in a loop can be O(n²); use a list and `''.join(...)`.

### Q36. Bit manipulation basics
`&` and, `|` or, `^` xor, `~` not, `<<` left shift, `>>` right shift.
```python
n & 1            # odd check
n & (n - 1)      # clears lowest set bit; ==0 means power of two (for n > 0)
a ^ a == 0       # xor of equal numbers is 0; used to find the single non-duplicate
x >> 1           # divide by 2
1 << k           # 2**k
```

### Q37. Sorting vs searching complexity summary
| Algorithm | Best | Average | Worst | Space | Stable |
|---|---|---|---|---|---|
| Bubble | O(n) | O(n²) | O(n²) | O(1) | yes |
| Selection | O(n²) | O(n²) | O(n²) | O(1) | no |
| Insertion | O(n) | O(n²) | O(n²) | O(1) | yes |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | yes |
| Quick | O(n log n) | O(n log n) | O(n²) | O(log n) | no |
| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) | no |
| Counting | O(n + k) | O(n + k) | O(n + k) | O(k) | yes |

### Q38. What is the lower bound for comparison sorting?
Any comparison-based sort needs Ω(n log n) comparisons in the worst case (decision tree argument: n! outcomes need at least log₂(n!) ≈ n log n levels). Non-comparison sorts (counting, radix, bucket) can beat this under constraints on the keys.

### Q39. Choose the right structure: quick guide
- Need fast lookup by key: hash map.
- Need uniqueness / membership: hash set.
- Need ordering by priority: heap.
- Need sorted order and range queries: balanced BST / sorted container.
- Need LIFO / FIFO: stack / queue.
- Need relationships: graph.
- Need prefix search: trie.

### Q40. What is a Big-O of common Python/JS operations?
Python `list`: `append` O(1) amortized, `pop()` O(1), `pop(0)` O(n), `insert(0, x)` O(n), `x in list` O(n), slicing O(k). `dict`/`set`: get/set/in O(1) average. `sorted` O(n log n). JS: `push/pop` O(1), `shift/unshift` O(n), `includes/indexOf` O(n), `Map`/`Set` O(1) average, `slice` O(k).

---

# 🔵 Part 2: Junior (1–3 years)

### Q41. Sliding window *(Must-know)*
Maintain a window `[l, r]` over a sequence and update an aggregate as it moves, instead of recomputing. Fixed-size and variable-size versions.
```python
# Longest substring without repeating characters, O(n)
def longest_unique(s):
    last, l, best = {}, 0, 0
    for r, c in enumerate(s):
        if c in last and last[c] >= l:
            l = last[c] + 1
        last[c] = r
        best = max(best, r - l + 1)
    return best
```

### Q42. Prefix sums
Precompute `P[i] = a[0] + ... + a[i-1]`. Range sum `sum(a[l..r]) = P[r+1] - P[l]` in O(1).
```python
from itertools import accumulate
P = [0] + list(accumulate(a))
```
**Subarray sum equals K** (works with negatives) using a hash map of prefix counts:
```python
def subarray_sum(a, k):
    cnt, s, res = {0: 1}, 0, 0
    for x in a:
        s += x
        res += cnt.get(s - k, 0)
        cnt[s] = cnt.get(s, 0) + 1
    return res
```

### Q43. Kadane's algorithm: maximum subarray
```python
def max_subarray(a):
    best = cur = a[0]
    for x in a[1:]:
        cur = max(x, cur + x)
        best = max(best, cur)
    return best
```
O(n) time, O(1) space. This is the simplest example of dynamic programming.

### Q44. Fast and slow pointers on lists
Find the middle: `slow` moves 1, `fast` moves 2; when `fast` ends, `slow` is at the middle. Find the k-th node from the end: advance one pointer k steps first, then move both.

### Q45. Merge two sorted linked lists
```python
def merge2(a, b):
    dummy = tail = Node(0)
    while a and b:
        if a.val <= b.val: tail.next, a = a, a.next
        else: tail.next, b = b, b.next
        tail = tail.next
    tail.next = a or b
    return dummy.next
```
A **dummy head** removes edge cases for the head node.

### Q46. Remove duplicates from a sorted array (in place)
```python
def dedupe(a):
    if not a: return 0
    w = 1
    for r in range(1, len(a)):
        if a[r] != a[w - 1]:
            a[w] = a[r]; w += 1
    return w
```

### Q47. Valid parentheses (stack)
```python
def valid(s):
    pairs, st = {')': '(', ']': '[', '}': '{'}, []
    for c in s:
        if c in pairs:
            if not st or st.pop() != pairs[c]: return False
        else: st.append(c)
    return not st
```

### Q48. Monotonic stack: next greater element *(Must-know)*
Keep a stack in decreasing order. Each element is pushed and popped at most once, so O(n).
```python
def next_greater(a):
    res, st = [-1] * len(a), []
    for i, x in enumerate(a):
        while st and a[st[-1]] < x:
            res[st.pop()] = x
        st.append(i)
    return res
```
Used for: daily temperatures, largest rectangle in histogram, stock span.

### Q49. Min stack (O(1) min)
```python
class MinStack:
    def __init__(self): self.s = []                # (value, current_min)
    def push(self, x): self.s.append((x, min(x, self.s[-1][1] if self.s else x)))
    def pop(self): return self.s.pop()[0]
    def get_min(self): return self.s[-1][1]
```

### Q50. Implement a queue using two stacks
Push to `in_stack`. On pop, if `out_stack` is empty, move everything from `in_stack` to `out_stack`. Amortized O(1) per operation.

### Q51. Binary search on the answer *(Must-know)*
When the answer lies in a range and a check `ok(x)` is monotonic (false...false, true...true), binary search the range.
```python
# Minimum speed to finish all piles in h hours (Koko eating bananas)
import math
def min_speed(piles, h):
    lo, hi = 1, max(piles)
    while lo < hi:
        mid = (lo + hi) // 2
        if sum(math.ceil(p / mid) for p in piles) <= h: hi = mid
        else: lo = mid + 1
    return lo
```
Python also has `bisect_left` and `bisect_right`.

### Q52. Search in a rotated sorted array
```python
def search_rotated(a, t):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if a[mid] == t: return mid
        if a[lo] <= a[mid]:                       # left half sorted
            if a[lo] <= t < a[mid]: hi = mid - 1
            else: lo = mid + 1
        else:                                     # right half sorted
            if a[mid] < t <= a[hi]: lo = mid + 1
            else: hi = mid - 1
    return -1
```
O(log n). With duplicates, worst case degrades to O(n).

### Q53. Validate a BST
Pass allowed bounds down. Checking only a node against its direct children is **wrong**.
```python
def is_bst(n, lo=float('-inf'), hi=float('inf')):
    if not n: return True
    if not (lo < n.v < hi): return False
    return is_bst(n.l, lo, n.v) and is_bst(n.r, n.v, hi)
```

### Q54. Lowest common ancestor (LCA)
Binary tree:
```python
def lca(root, p, q):
    if not root or root is p or root is q: return root
    l, r = lca(root.l, p, q), lca(root.r, p, q)
    return root if l and r else l or r
```
In a BST, walk down: if both values are smaller go left, if both larger go right, else the current node is the LCA (O(h)).

### Q55. Tree diameter and balanced check
Compute heights bottom-up and update a global best.
```python
def diameter(root):
    best = 0
    def h(n):
        nonlocal best
        if not n: return 0
        l, r = h(n.l), h(n.r)
        best = max(best, l + r)
        return 1 + max(l, r)
    h(root)
    return best
```

### Q56. Iterative tree traversal (avoid recursion limits)
```python
def inorder_iter(root):
    out, st, cur = [], [], root
    while cur or st:
        while cur: st.append(cur); cur = cur.l
        cur = st.pop(); out.append(cur.v); cur = cur.r
    return out
```
Morris traversal does it in O(1) extra space by temporarily threading the tree.

### Q57. Number of islands (grid DFS/BFS)
```python
def islands(g):
    R, C, n = len(g), len(g[0]), 0
    def sink(r, c):
        if 0 <= r < R and 0 <= c < C and g[r][c] == '1':
            g[r][c] = '0'
            for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)): sink(r+dr, c+dc)
    for r in range(R):
        for c in range(C):
            if g[r][c] == '1': n += 1; sink(r, c)
    return n
```
O(R·C). Use an explicit stack for very large grids to avoid recursion limits. Mutating the input may not be allowed; use a `visited` set.

### Q58. Shortest path in an unweighted graph/grid (BFS)
BFS by levels; the level number when you first reach a node is its shortest distance. Store `dist` or `parent` for path reconstruction.

### Q59. Cycle detection
- **Undirected graph**: DFS with parent tracking, or union-find.
- **Directed graph**: DFS with three colors (unvisited, in-stack, done), or Kahn's algorithm (if topological sort cannot include all nodes, there is a cycle).

### Q60. Topological sort (Kahn's algorithm)
```python
from collections import deque
def topo(n, edges):
    g = [[] for _ in range(n)]; indeg = [0] * n
    for u, v in edges: g[u].append(v); indeg[v] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)
    order = []
    while q:
        u = q.popleft(); order.append(u)
        for v in g[u]:
            indeg[v] -= 1
            if indeg[v] == 0: q.append(v)
    return order if len(order) == n else []     # [] means cycle
```
Use for course schedules, build order, dependency resolution (npm, Maven).

### Q61. Heap patterns: top-K
```python
import heapq
def top_k(nums, k):                    # k largest, O(n log k)
    h = []
    for x in nums:
        heapq.heappush(h, x)
        if len(h) > k: heapq.heappop(h)
    return sorted(h, reverse=True)
# heapq.nlargest(k, nums) does the same
```
Keep a **min-heap of size k** to find the k largest. Quickselect finds the k-th element in O(n) average.

### Q62. Merge k sorted lists
Push the head of each list in a min-heap with `(value, list_index)`; pop the smallest, push its next. O(N log k) for N total elements.

### Q63. Find the median from a data stream
Two heaps: a max-heap for the lower half and a min-heap for the upper half, kept balanced (sizes differ by at most 1). Add is O(log n), median is O(1).

### Q64. Anagram grouping, frequency maps
```python
from collections import defaultdict
def group_anagrams(words):
    g = defaultdict(list)
    for w in words: g["".join(sorted(w))].append(w)    # O(n k log k)
    return list(g.values())
```
A tuple of 26 letter counts as key gives O(n·k).

### Q65. Intervals: merge overlapping
```python
def merge_intervals(iv):
    iv.sort()
    out = [iv[0]]
    for s, e in iv[1:]:
        if s <= out[-1][1]: out[-1][1] = max(out[-1][1], e)
        else: out.append([s, e])
    return out
```
Sort first, then one pass. O(n log n). Variants: insert interval, meeting rooms (heap of end times), minimum arrows.

### Q66. Matrix problems: rotate, spiral, search
Rotate 90° clockwise = transpose, then reverse each row (in place O(1) space). Search a row-and-column sorted matrix: start at the top-right corner and move left or down, O(m + n).

### Q67. Counting sort, radix sort, bucket sort
Non-comparison sorts. Counting sort: O(n + k) for integers in range `k`. Radix: sort digit by digit with a stable sort, O(d·(n + b)). Bucket: distribute into buckets, good for uniformly distributed floats.

### Q68. Quickselect
Find the k-th smallest element by partitioning like quick sort but recursing into only one side. Average O(n), worst O(n²) (median-of-medians gives worst-case O(n) but is rarely worth the constant).

### Q69. Hashing pitfalls
Only **immutable/hashable** keys. Python: lists cannot be dict keys, tuples can. JS: `Map` keys use identity for objects. In JS plain objects, keys become strings, so `obj[1]` and `obj["1"]` are the same key. Equal objects must have equal hashes (contract of `__eq__`/`__hash__`, `equals`/`hashCode`).

### Q70. Two-sum variants and 3Sum
3Sum: sort, fix one number, run two pointers on the rest, skip duplicates. O(n²).
```python
def three_sum(a):
    a.sort(); res = []
    for i in range(len(a) - 2):
        if i and a[i] == a[i-1]: continue
        l, r = i + 1, len(a) - 1
        while l < r:
            s = a[i] + a[l] + a[r]
            if s < 0: l += 1
            elif s > 0: r -= 1
            else:
                res.append([a[i], a[l], a[r]]); l += 1
                while l < r and a[l] == a[l-1]: l += 1
    return res
```

---

# 🟡 Part 3: Mid (3–5 years)

### Q71. Dynamic programming: how to recognize and solve *(Must-know)*
DP applies when a problem has **overlapping subproblems** and **optimal substructure**. Steps:
1. Define the state (what does `dp[i]` mean?).
2. Write the recurrence.
3. Set base cases.
4. Choose order: top-down (memoization) or bottom-up (tabulation).
5. Optimize space if only the last few states are needed.
Typical signals: "count the ways", "minimum/maximum cost", "is it possible", choices at each step.

### Q72. Climbing stairs / House robber (1D DP)
```python
def climb(n):                      # ways to climb n stairs with steps 1 or 2
    a, b = 1, 1
    for _ in range(n - 1): a, b = b, a + b
    return b

def rob(nums):                     # no two adjacent houses
    take, skip = 0, 0
    for x in nums: take, skip = skip + x, max(take, skip)
    return max(take, skip)
```

### Q73. Coin change *(Must-know)*
Minimum coins for an amount (unbounded knapsack).
```python
def coin_change(coins, amount):
    INF = float('inf')
    dp = [0] + [INF] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a: dp[a] = min(dp[a], dp[a - c] + 1)
    return -1 if dp[amount] == INF else dp[amount]
```
O(amount · len(coins)). Greedy fails for coin sets like {1, 3, 4} with amount 6 (greedy gives 4+1+1, optimal is 3+3).

### Q74. 0/1 Knapsack
```python
def knapsack(wt, val, W):
    dp = [0] * (W + 1)
    for w, v in zip(wt, val):
        for cap in range(W, w - 1, -1):      # reverse loop: each item used once
            dp[cap] = max(dp[cap], dp[cap - w] + v)
    return dp[W]
```
O(n·W) time, O(W) space. Looping forward instead would allow reusing items (unbounded). Note: O(n·W) is *pseudo-polynomial* (W is a value, not input size).

### Q75. Longest Common Subsequence (2D DP)
```python
def lcs(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            dp[i][j] = dp[i-1][j-1] + 1 if a[i-1] == b[j-1] else max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]
```
O(mn). Related: edit distance, longest common substring, shortest common supersequence.

### Q76. Edit distance (Levenshtein)
```python
def edit_distance(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1): dp[i][0] = i
    for j in range(n + 1): dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i-1] == b[j-1]: dp[i][j] = dp[i-1][j-1]
            else: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])   # delete, insert, replace
    return dp[m][n]
```
Used for spell check, fuzzy search, diffs.

### Q77. Longest Increasing Subsequence (LIS)
O(n²) DP, or O(n log n) with patience sorting:
```python
import bisect
def lis(a):
    tails = []
    for x in a:
        i = bisect.bisect_left(tails, x)
        if i == len(tails): tails.append(x)
        else: tails[i] = x
    return len(tails)         # length only; tails is not the actual subsequence
```

### Q78. Memoization vs tabulation
| | Top-down (memo) | Bottom-up (table) |
|---|---|---|
| Style | recursion + cache | loops |
| Computes | only needed states | all states |
| Risk | recursion depth | none, but may compute unused states |
| Space optimization | harder | easy (rolling array) |

### Q79. Grid DP: unique paths, minimum path sum
```python
def min_path(g):
    R, C = len(g), len(g[0])
    for r in range(R):
        for c in range(C):
            if r == c == 0: continue
            up = g[r-1][c] if r else float('inf')
            left = g[r][c-1] if c else float('inf')
            g[r][c] += min(up, left)
    return g[-1][-1]
```

### Q80. Word break / partition-type DP
```python
def word_break(s, words):
    w, dp = set(words), [True] + [False] * len(s)
    for i in range(1, len(s) + 1):
        dp[i] = any(dp[j] and s[j:i] in w for j in range(i))
    return dp[-1]
```

### Q81. Greedy algorithms *(Must-know)*
Make the locally best choice at each step and never reconsider. Works only if the **greedy-choice property** and optimal substructure hold. Prove it with an exchange argument. Classic: interval scheduling (sort by end time), activity selection, Huffman coding, Dijkstra, Kruskal/Prim, fractional knapsack, jump game, gas station.
```python
def can_jump(a):
    reach = 0
    for i, x in enumerate(a):
        if i > reach: return False
        reach = max(reach, i + x)
    return True
```

### Q82. Greedy vs DP
Greedy: one pass, no table, needs proof of correctness, fast. DP: explores all choices through stored subresults, always correct if modeled right, more memory. If greedy fails on a small counterexample (like coin change {1,3,4}), use DP.

### Q83. Backtracking template *(Must-know)*
Build a candidate step by step, undo (backtrack) when it cannot lead to a solution.
```python
def subsets(nums):
    res, path = [], []
    def go(i):
        if i == len(nums): res.append(path[:]); return
        go(i + 1)                       # skip
        path.append(nums[i]); go(i + 1) # take
        path.pop()                      # undo
    go(0)
    return res

def permutations(nums):
    res, used, path = [], [False] * len(nums), []
    def go():
        if len(path) == len(nums): res.append(path[:]); return
        for i, x in enumerate(nums):
            if used[i]: continue
            used[i] = True; path.append(x); go(); path.pop(); used[i] = False
    go()
    return res
```
Copy the path (`path[:]`) when saving. To avoid duplicates with repeated values, sort and skip equal siblings.

### Q84. N-Queens
Place one queen per row; track used columns and both diagonals (`r - c`, `r + c`) in sets. Prune early. Time roughly O(n!) but pruning cuts it a lot.

### Q85. Combination sum, palindrome partitioning, word search
All use the same backtracking skeleton: choose, explore, un-choose, with pruning conditions (remaining sum < 0, visited cell, invalid prefix).

### Q86. Trie (prefix tree) *(Must-know)*
Each node represents a character. Insert/search/prefix in O(L), where L is the word length.
```python
class Trie:
    def __init__(self): self.root = {}
    def insert(self, w):
        n = self.root
        for c in w: n = n.setdefault(c, {})
        n['#'] = True
    def _find(self, p):
        n = self.root
        for c in p:
            if c not in n: return None
            n = n[c]
        return n
    def search(self, w): n = self._find(w); return bool(n and '#' in n)
    def starts_with(self, p): return self._find(p) is not None
```
Uses: autocomplete, spell check, IP routing (radix trie), word games. Memory heavy; compress with a radix tree.

### Q87. Union-Find (Disjoint Set Union) *(Must-know)*
Tracks connected components with near-O(1) operations (inverse Ackermann) using **path compression** and **union by rank/size**.
```python
class DSU:
    def __init__(self, n): self.p = list(range(n)); self.sz = [1] * n
    def find(self, x):
        while self.p[x] != x:
            self.p[x] = self.p[self.p[x]]       # path halving
            x = self.p[x]
        return x
    def union(self, a, b):
        a, b = self.find(a), self.find(b)
        if a == b: return False
        if self.sz[a] < self.sz[b]: a, b = b, a
        self.p[b] = a; self.sz[a] += self.sz[b]
        return True
```
Uses: Kruskal MST, cycle detection in undirected graphs, number of provinces, accounts merge.

### Q88. Dijkstra's shortest path *(Must-know)*
Single-source shortest paths on graphs with **non-negative** weights using a min-heap. O((V + E) log V).
```python
import heapq
def dijkstra(g, src):                  # g[u] = [(v, w), ...]
    dist = {src: 0}; h = [(0, src)]
    while h:
        d, u = heapq.heappop(h)
        if d > dist.get(u, float('inf')): continue      # stale entry
        for v, w in g[u]:
            nd = d + w
            if nd < dist.get(v, float('inf')):
                dist[v] = nd; heapq.heappush(h, (nd, v))
    return dist
```
Fails with negative edges. Use Bellman-Ford for that.

### Q89. Bellman-Ford and Floyd-Warshall
- **Bellman-Ford**: relax all edges V−1 times. O(V·E). Handles negative edges and detects negative cycles (one more pass still relaxes).
- **Floyd-Warshall**: all-pairs shortest paths, O(V³), three nested loops with `k` outermost.
```python
for k in range(n):
    for i in range(n):
        for j in range(n):
            d[i][j] = min(d[i][j], d[i][k] + d[k][j])
```

### Q90. Minimum spanning tree: Kruskal and Prim
- **Kruskal**: sort edges by weight, add an edge if it does not form a cycle (Union-Find). O(E log E).
- **Prim**: grow the tree from a start node with a min-heap of crossing edges. O(E log V).
An MST connects all vertices with minimum total weight and V−1 edges.

### Q91. Strongly connected components and bridges (awareness)
Tarjan's or Kosaraju's algorithm finds SCCs in O(V + E). Tarjan-style low-link finds bridges and articulation points (critical connections in a network). Know the idea; implementation is rarely required below senior level.

### Q92. A* and heuristic search (awareness)
Dijkstra with a heuristic `h(n)` estimating remaining cost: priority = `g(n) + h(n)`. Optimal if `h` is admissible (never overestimates). Used in pathfinding in games and maps.

### Q93. Balanced BSTs: AVL and Red-Black
Self-balancing BSTs that keep height O(log n) with rotations.
- **AVL**: stricter balance (height difference ≤ 1), faster lookups, more rotations on insert/delete.
- **Red-Black**: looser balance, fewer rotations, used in `std::map`, Java `TreeMap`, Linux scheduler.
You are rarely asked to implement them; know the rotations and the guarantees.

### Q94. B-Tree and B+ Tree (why databases use them)
Multi-way balanced trees where each node holds many keys and has many children, sized to a disk page. Few levels means few disk reads. B+ trees store all values in linked leaves, which is great for range scans. Used by MySQL InnoDB, PostgreSQL indexes, file systems.

### Q95. Segment tree
Supports range queries (sum/min/max) and point or range updates in O(log n). Build O(n). Array-based, size about 4n.
```python
class SegTree:
    def __init__(self, a):
        self.n = len(a); self.t = [0] * (2 * self.n)
        self.t[self.n:] = a
        for i in range(self.n - 1, 0, -1): self.t[i] = self.t[2*i] + self.t[2*i+1]
    def update(self, i, v):
        i += self.n; self.t[i] = v
        while i > 1: i //= 2; self.t[i] = self.t[2*i] + self.t[2*i+1]
    def query(self, l, r):                 # sum over [l, r)
        res, l, r = 0, l + self.n, r + self.n
        while l < r:
            if l & 1: res += self.t[l]; l += 1
            if r & 1: r -= 1; res += self.t[r]
            l //= 2; r //= 2
        return res
```

### Q96. Fenwick tree (Binary Indexed Tree)
Prefix sums with point updates in O(log n) using less memory and code than a segment tree.
```python
class BIT:
    def __init__(self, n): self.n, self.t = n, [0] * (n + 1)
    def add(self, i, d):
        i += 1
        while i <= self.n: self.t[i] += d; i += i & -i
    def prefix(self, i):                   # sum of a[0..i]
        i += 1; s = 0
        while i > 0: s += self.t[i]; i -= i & -i
        return s
```

### Q97. String algorithms: KMP and Rabin-Karp
- **KMP**: builds a prefix-function (failure) table so the pattern search never goes backward in the text. O(n + m).
- **Rabin-Karp**: rolling hash compares window hashes, then verifies. Average O(n + m). Good for multi-pattern search.
Naive search is O(n·m). Python's `in` and `str.find` use optimized hybrids.
```python
def prefix_function(p):
    pi = [0] * len(p)
    for i in range(1, len(p)):
        k = pi[i - 1]
        while k and p[i] != p[k]: k = pi[k - 1]
        if p[i] == p[k]: k += 1
        pi[i] = k
    return pi
```

### Q98. Bit manipulation problems
Single number (XOR all), count set bits (`n &= n - 1` loop, Brian Kernighan), power of two, subsets via bitmask `for mask in range(1 << n)`, swap without temp (`a ^= b; b ^= a; a ^= b`, a trivia answer, not good practice).

### Q99. Complexity of recursion: Master Theorem (quick form)
For `T(n) = a·T(n/b) + O(n^d)`:
- if `a < b^d`: `O(n^d)`
- if `a = b^d`: `O(n^d log n)`
- if `a > b^d`: `O(n^(log_b a))`
Merge sort: a=2, b=2, d=1 → O(n log n). Binary search: a=1, b=2, d=0 → O(log n).

### Q100. Space complexity of recursion
The call stack counts. DFS on a tree uses O(h). Naive Fibonacci uses O(n) stack even though it takes O(2ⁿ) time. Tail recursion is not optimized in Python or Java; convert to iteration for deep inputs.

### Q101. In-place algorithms and stability concerns
In-place means O(1) (or O(log n)) extra space. Examples: two-pointer partition, Dutch national flag (sort 0/1/2 in one pass), reversing arrays, quicksort partition.
```python
def sort_colors(a):                  # Dutch flag, O(n), O(1)
    lo, mid, hi = 0, 0, len(a) - 1
    while mid <= hi:
        if a[mid] == 0: a[lo], a[mid] = a[mid], a[lo]; lo += 1; mid += 1
        elif a[mid] == 1: mid += 1
        else: a[mid], a[hi] = a[hi], a[mid]; hi -= 1
```

### Q102. LRU cache design *(Must-know)*
Hash map + doubly linked list gives O(1) `get` and `put`. Python shortcut: `OrderedDict`.
```python
from collections import OrderedDict
class LRU:
    def __init__(self, cap): self.cap, self.d = cap, OrderedDict()
    def get(self, k):
        if k not in self.d: return -1
        self.d.move_to_end(k); return self.d[k]
    def put(self, k, v):
        self.d[k] = v; self.d.move_to_end(k)
        if len(self.d) > self.cap: self.d.popitem(last=False)
```
Variants: LFU (frequency lists), TTL cache.

### Q103. Design a hash map from scratch
Array of buckets, `hash(key) % size`, chaining, resize when load factor > 0.75 by doubling and rehashing all keys. Mention collision handling, equals/hash contract, and resize cost (amortized O(1)).

### Q104. Sorting objects by multiple keys
```python
people.sort(key=lambda p: (-p.score, p.name))   # score desc, then name asc
```
Python's sort is stable, so you can also sort twice (least significant key first).

### Q105. Matrix / graph as implicit graph
Many problems are graphs in disguise: word ladder (words are nodes, one-letter changes are edges), sliding puzzle (board states), lock combinations. Use BFS with a `visited` set of states.

### Q106. Bidirectional BFS
Search from both start and end and stop when they meet. Cuts the explored states from `b^d` to about `2·b^(d/2)`. Useful in word ladder.

### Q107. Cycle in a directed graph (course schedule)
Count nodes processed by Kahn's algorithm. If count < V, a cycle exists, so not all courses can be completed.

### Q108. Reconstructing the answer in DP and graphs
Store a `parent`/`choice` array alongside values, or walk backward through the table. Interviewers often ask for the actual path/sequence, not only its length.

### Q109. Reservoir sampling
Pick k random items from a stream of unknown length in one pass with O(k) memory. For k=1: keep item `i` with probability `1/i`.
```python
import random
def sample_one(stream):
    pick = None
    for i, x in enumerate(stream, 1):
        if random.randrange(i) == 0: pick = x
    return pick
```

### Q110. Randomized and probabilistic structures (awareness)
Skip list (probabilistic balanced list, used in Redis sorted sets), Bloom filter (membership with false positives, no false negatives), Count-Min Sketch (approximate counts), HyperLogLog (approximate distinct count). Used when exactness is too expensive.

---

# 🟠 Part 4: Senior (5–7 years)

### Q111. Bitmask DP
State is a subset represented by an integer. Typical for TSP-like problems with n ≤ 20: O(2ⁿ·n²).
```python
def tsp(dist):
    n = len(dist); INF = float('inf')
    dp = [[INF] * n for _ in range(1 << n)]
    dp[1][0] = 0
    for mask in range(1 << n):
        for u in range(n):
            if dp[mask][u] == INF: continue
            for v in range(n):
                if not mask & (1 << v):
                    nm = mask | (1 << v)
                    dp[nm][v] = min(dp[nm][v], dp[mask][u] + dist[u][v])
    return min(dp[(1 << n) - 1][u] + dist[u][0] for u in range(1, n))
```

### Q112. Interval DP and tree DP
Interval DP: `dp[l][r]` over substrings/ranges (burst balloons, matrix chain multiplication, palindrome partitioning), O(n³). Tree DP: compute per-node results from children (house robber III, max path sum, rerooting for sums of distances).

### Q113. DP on strings and optimization techniques
Space optimization with rolling rows (O(min(m, n))). Knuth optimization and divide-and-conquer optimization reduce some O(n²) / O(n³) recurrences. Know that they exist; apply only when asked.

### Q114. Monotonic deque: sliding window maximum
```python
from collections import deque
def max_sliding(a, k):
    dq, res = deque(), []                       # dq holds indices, values decreasing
    for i, x in enumerate(a):
        while dq and a[dq[-1]] <= x: dq.pop()
        dq.append(i)
        if dq[0] <= i - k: dq.popleft()
        if i >= k - 1: res.append(a[dq[0]])
    return res
```
O(n).

### Q115. Largest rectangle in histogram
```python
def largest_rect(h):
    st, best = [], 0
    for i, x in enumerate(h + [0]):
        while st and h[st[-1]] >= x:
            height = h[st.pop()]
            width = i if not st else i - st[-1] - 1
            best = max(best, height * width)
        st.append(i)
    return best
```
O(n). Basis for "maximal rectangle in a binary matrix".

### Q116. Lazy propagation in segment trees
Delay range updates by storing pending tags on nodes and pushing them down only when needed. Range update and range query both O(log n).

### Q117. Heavy techniques for range queries
Sparse table (static range min in O(1) after O(n log n) build), sqrt decomposition (blocks of √n), Mo's algorithm (offline queries), binary lifting (LCA and k-th ancestor in O(log n)), Euler tour + RMQ.

### Q118. Graph algorithms at scale
Parallel BFS, Pregel/Giraph-style vertex-centric processing, PageRank (iterative power method), community detection. In production, graph data often lives in a graph database (Neo4j) or is processed in batches (Spark GraphX).

### Q119. Max flow and bipartite matching (awareness)
Ford-Fulkerson / Edmonds-Karp / Dinic compute max flow. Bipartite matching (Hopcroft-Karp) is a special case. Applications: job assignment, network capacity, image segmentation. Max-flow min-cut theorem links flow and cuts.

### Q120. Topological sort variants and DAG DP
Longest path in a DAG, number of paths, and critical path (project scheduling) are DP over a topological order in O(V + E). Detect multiple valid orders when the queue holds more than one node at once.

### Q121. 2-SAT, and NP-hard recognition (awareness)
Recognize NP-hard problems (TSP, subset sum in general, graph coloring, vertex cover, SAT, Hamiltonian path). For them, answer with: exact exponential (bitmask DP, branch and bound), approximation (e.g. 2-approx vertex cover, MST-based TSP heuristic), or heuristics (greedy, simulated annealing, genetic). Saying "this is NP-hard, so here is a practical approach" is a strong signal.

### Q122. P, NP, NP-complete in one paragraph
**P**: solvable in polynomial time. **NP**: a proposed solution is verifiable in polynomial time. **NP-complete**: in NP and every NP problem reduces to it. Whether P = NP is open. Practical meaning: no known fast exact algorithm for NP-complete problems on large inputs.

### Q123. Amortized analysis techniques
Aggregate method (total cost / n), accounting method (charge credit on cheap operations), potential method. Examples: dynamic array, stack with multipop, Union-Find, splay trees, monotonic stack.

### Q124. Cache-aware thinking
Arrays beat pointer-based structures for iteration because of CPU cache lines (64 bytes). Row-major traversal of a 2D array is faster than column-major. B-trees and blocked algorithms (blocked matrix multiply) exploit locality. Big-O ignores this, but real performance does not.

### Q125. Hash table in depth: resizing, load factor, adversarial inputs
Hash flooding: an attacker sends many keys with colliding hashes, making operations O(n) and causing DoS. Defenses: randomized hash seeds (Python, Rust SipHash), tree buckets (Java 8), rate limiting. Never use a predictable hash on untrusted keys.

### Q126. Consistent hashing
Maps keys and nodes onto a ring; each key belongs to the next node clockwise. Adding or removing a node moves only about `K/N` keys instead of reshuffling all. Use **virtual nodes** to balance load. Used in DynamoDB, Cassandra, CDNs, memcached clients.

### Q127. Bloom filter
A bit array plus `k` hash functions. `add` sets `k` bits; `contains` checks them. False positives possible, false negatives impossible, no deletes (counting Bloom filters allow them). Size: `m = -n ln p / (ln 2)²`, `k = (m/n) ln 2`. Uses: avoid disk reads for missing keys (LSM trees, Cassandra), safe-browsing checks, dedupe.

### Q128. Skip list
Layered linked lists with random promotion; expected O(log n) search, insert, delete. Simpler to make concurrent than balanced trees. Used by Redis sorted sets and LevelDB memtables.

### Q129. LSM tree vs B-tree
- **B-tree**: update in place, good reads and range scans, write amplification from page splits.
- **LSM tree**: buffer writes in memory (memtable), flush sorted immutable files (SSTables), merge in background (compaction). Great write throughput, reads may check several levels (Bloom filters help). Used by RocksDB, Cassandra, LevelDB.

### Q130. External sorting
When data does not fit in memory: sort chunks that fit, write them to disk as runs, then do a k-way merge with a min-heap. Complexity is dominated by I/O passes.

### Q131. Heap variants
Binary heap (array-based), d-ary heap (fewer levels), Fibonacci heap (amortized O(1) decrease-key; rarely used in practice), pairing heap (simple, fast in practice). `heapq` has no decrease-key, so use the "lazy deletion" trick (push duplicates and ignore stale pops).

### Q132. Sorting in practice: how to pick
- Small n: insertion sort is fastest in practice (used inside hybrid sorts).
- General: library sort.
- Integers in a small range: counting/radix.
- Nearly sorted: Timsort.
- Memory constrained: heap sort (in place, guaranteed O(n log n)).
- Need stability: merge/Timsort.
- Linked lists: merge sort.
- Huge data: external merge sort.

### Q133. Complexity of common database-like operations
Index lookup O(log n) with B-tree, hash index O(1), full scan O(n), sort-merge join O(n log n), hash join O(n + m), nested loop join O(n·m). Understanding these explains query plans.

### Q134. Online vs offline algorithms
Online algorithms process input as it arrives without knowing the future (LRU caching, streaming median, reservoir sampling). Offline algorithms see all input first (sorting then answering queries, Mo's algorithm). Interviewers care when a problem says "stream".

### Q135. Probabilistic and approximate counting in interviews
"Count distinct users per day over billions of events": HyperLogLog (about 12 KB per counter, ~1% error). "Top K frequent items in a stream": Count-Min Sketch + heap, or Misra-Gries. "Is this URL seen before": Bloom filter. State the accuracy-memory trade-off.

### Q136. Geometric and spatial structures (awareness)
Quadtree, k-d tree, R-tree, geohash. Used for nearest-neighbor, map tiles, and spatial indexing (PostGIS uses R-tree-like GiST). For high-dimensional vectors (embeddings), approximate nearest neighbor structures like HNSW and IVF are used.

### Q137. Immutable and persistent data structures
Persistent structures keep old versions via **structural sharing** (only the changed path is copied). Used in Redux-like state, Clojure, Immutable.js, git objects, functional languages. Updates are O(log n) with tries (e.g. HAMT) instead of O(n) copying.

### Q138. Concurrent data structures
Thread-safe queue (locks or lock-free with compare-and-swap), concurrent hash map (lock striping, per-bucket locks), ring buffer (SPSC lock-free), read-copy-update. Problems: ABA, false sharing, memory ordering. In interviews, mention using the language's concurrent collections rather than rolling your own.

### Q139. Time complexity of string building and common traps
Repeated string concatenation in a loop: O(n²) in languages with immutable strings (CPython often optimizes `+=` in place, but do not rely on it). Slicing `a[1:]` in recursion copies O(n) each call, making a recursive algorithm O(n²). Pass indices instead.

### Q140. Reading constraints to choose the algorithm
| Constraint on n | Likely target |
|---|---|
| ≤ 10 | O(n!) permutations / brute force |
| ≤ 20 | O(2ⁿ) bitmask / subsets |
| ≤ 500 | O(n³) |
| ≤ 5,000 | O(n²) DP |
| ≤ 10⁵ | O(n log n) |
| ≤ 10⁶–10⁷ | O(n) |
| ≤ 10⁹ or more | O(log n) or math formula |

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q141. How do DSA concepts show up in real systems?
- Hash maps: caches, sessions, deduplication, routing tables.
- Heaps: schedulers, timers, rate limiters, top-K dashboards.
- Trees: database indexes (B+), file systems, DOM, routing (trie), syntax trees.
- Graphs: dependency resolution, social networks, recommendation, network routing, CI pipelines (DAGs).
- Queues: message brokers (Kafka, SQS), task workers, backpressure.
- Tries and automata: autocomplete, URL routers, regex engines.
- Bloom filters: cache and storage lookups.

### Q142. How do you decide between a database index and an in-memory structure?
Consider data size, durability, access pattern (point lookup vs range vs full text), consistency, concurrency, and cost. In-memory structures are fastest but volatile and bound by RAM. Use a database/Redis when you need persistence, sharing between services, or large data. Cache with a clear invalidation strategy.

### Q143. Design a rate limiter and pick the structure
- **Fixed window counter**: hash map `user -> (window, count)`. Simple, bursty at boundaries.
- **Sliding window log**: queue/sorted set of timestamps. Accurate, memory heavy.
- **Sliding window counter**: weighted combination of two windows. Good balance.
- **Token bucket / leaky bucket**: two numbers per user. Allows bursts, constant memory.
Distributed: Redis with Lua scripts for atomicity.

### Q144. Design autocomplete / typeahead
Trie (or radix tree) with top-K suggestions cached at each node, updated from query logs offline. For scale: shard by prefix, serve from memory, cache hot prefixes at the edge, add personalization as a re-ranking step.

### Q145. Design a leaderboard
Redis sorted set (skip list + hash): `ZADD`, `ZREVRANK`, `ZREVRANGE` in O(log n). For huge scale, shard by user or bucket scores; use approximate rank for far-from-top players.

### Q146. Design a scheduler / delayed jobs
Min-heap (or hashed timing wheel) keyed by run time. Timing wheel gives O(1) insert for many timers (used in Netty, Kafka). Persist jobs in a database/queue for durability and use leases for workers.

### Q147. Design a news feed / timeline
Fan-out on write (push to followers' lists) vs fan-out on read (pull and merge with a heap of k sorted lists). Hybrid: push for normal users, pull for celebrities. Data structures: per-user capped lists (Redis), k-way merge, ranking features.

### Q148. Design URL shortener: key generation
Options: auto-increment ID encoded in base62, random 7-char string with collision check (62⁷ ≈ 3.5 trillion), hash prefix with retry, or pre-generated key ranges per server. Store in a key-value store. Mention hot keys and caching.

### Q149. Search engine basics
**Inverted index**: map from term to a sorted posting list of document IDs. Boolean queries are merges/intersections of sorted lists (two pointers or skip pointers). Ranking with TF-IDF/BM25. Compress postings with delta encoding. Elasticsearch/Lucene are built on this.

### Q150. Choosing a database by data-structure model
B-tree (PostgreSQL, MySQL) for balanced workloads; LSM (Cassandra, RocksDB) for heavy writes; hash index for exact lookups; skip list/sorted set (Redis); graph (Neo4j) for relationship traversals; columnar for analytics. Match the access pattern.

### Q151. Complexity thinking in code reviews
Look for: nested loops over collections that can grow (accidental O(n²)), repeated `list.includes` inside loops (use a Set), N+1 database queries (an O(n) round-trip problem), sorting inside loops, recomputing in recursion without memoization, and unbounded in-memory collections.

### Q152. How do you teach DSA to a team?
Tie it to their domain: use a real slow endpoint as a case study, show profiling before and after a data-structure change, keep a short pattern list (two pointers, sliding window, BFS/DFS, DP, heap, union-find), and run weekly problem-solving sessions focused on explaining trade-offs.

### Q153. When NOT to optimize the data structure
When n is small, the code runs rarely, or the bottleneck is I/O. Measure first. A linear scan over 50 items in an array often beats a hash lookup because of constants and cache locality. Readability and correctness come first.

### Q154. Trade-off vocabulary leaders should use
Time vs space, read vs write optimization, consistency vs availability, latency vs throughput, exact vs approximate, simplicity vs worst-case guarantees, amortized vs worst-case latency (a resize spike can hurt tail latency; incremental rehashing as in Redis avoids it).

### Q155. How to approach an unfamiliar algorithm problem in an interview
1. Clarify input size, constraints, edge cases, duplicates, negatives.
2. State a brute force and its complexity.
3. Find the bottleneck and match a pattern.
4. Explain the optimized approach before coding.
5. Code cleanly with good names.
6. Test with a small example and edge cases.
7. State final time and space complexity.
Thinking aloud matters as much as the final answer.

---

# 💻 Part 6: Coding / Machine-Coding Tasks

### C1. FizzBuzz
```python
for i in range(1, 16):
    print("FizzBuzz" if i % 15 == 0 else "Fizz" if i % 3 == 0 else "Buzz" if i % 5 == 0 else i)
```

### C2. Check prime (O(√n))
```python
def is_prime(n):
    if n < 2: return False
    i = 2
    while i * i <= n:
        if n % i == 0: return False
        i += 1
    return True
```
Sieve of Eratosthenes for all primes up to n in O(n log log n):
```python
def sieve(n):
    p = [True] * (n + 1); p[0:2] = [False, False]
    for i in range(2, int(n ** 0.5) + 1):
        if p[i]: p[i*i::i] = [False] * len(p[i*i::i])
    return [i for i, v in enumerate(p) if v]
```

### C3. GCD and LCM
```python
def gcd(a, b): return a if b == 0 else gcd(b, a % b)     # Euclid, O(log min(a,b))
def lcm(a, b): return a // gcd(a, b) * b
```

### C4. Move zeroes to the end (in place, stable)
```python
def move_zeroes(a):
    w = 0
    for x in a:
        if x != 0: a[w] = x; w += 1
    for i in range(w, len(a)): a[i] = 0
```

### C5. Rotate array by k
```python
def rotate(a, k):
    n = len(a); k %= n
    a.reverse(); a[:k] = reversed(a[:k]); a[k:] = reversed(a[k:])
```
O(n) time, O(1) extra space with the three-reversal trick.

### C6. Product of array except self (no division)
```python
def product_except_self(a):
    n, res = len(a), [1] * len(a)
    p = 1
    for i in range(n): res[i] = p; p *= a[i]
    p = 1
    for i in range(n - 1, -1, -1): res[i] *= p; p *= a[i]
    return res
```

### C7. Longest common prefix
```python
def lcp(strs):
    if not strs: return ""
    s = min(strs); e = max(strs)           # lexicographic extremes
    i = 0
    while i < len(s) and s[i] == e[i]: i += 1
    return s[:i]
```

### C8. First non-repeating character
```python
from collections import Counter
def first_unique(s):
    c = Counter(s)
    for i, ch in enumerate(s):
        if c[ch] == 1: return i
    return -1
```

### C9. Container with most water (two pointers)
```python
def max_area(h):
    l, r, best = 0, len(h) - 1, 0
    while l < r:
        best = max(best, min(h[l], h[r]) * (r - l))
        if h[l] < h[r]: l += 1
        else: r -= 1
    return best
```

### C10. Trapping rain water
```python
def trap(h):
    l, r, lm, rm, total = 0, len(h) - 1, 0, 0, 0
    while l < r:
        if h[l] < h[r]:
            lm = max(lm, h[l]); total += lm - h[l]; l += 1
        else:
            rm = max(rm, h[r]); total += rm - h[r]; r -= 1
    return total
```
O(n) time, O(1) space.

### C11. Best time to buy and sell stock (one transaction)
```python
def max_profit(p):
    lo, best = float('inf'), 0
    for x in p:
        lo = min(lo, x); best = max(best, x - lo)
    return best
```

### C12. Majority element (Boyer-Moore voting)
```python
def majority(a):
    cand, cnt = None, 0
    for x in a:
        if cnt == 0: cand = x
        cnt += 1 if x == cand else -1
    return cand        # valid if a majority is guaranteed to exist
```

### C13. Find the duplicate / missing number
```python
def missing(a):                      # numbers 0..n with one missing
    return len(a) * (len(a) + 1) // 2 - sum(a)       # or XOR all indexes and values
def find_dup(a):                     # Floyd's cycle method on values, O(n), O(1)
    s = f = a[0]
    while True:
        s, f = a[s], a[a[f]]
        if s == f: break
    s = a[0]
    while s != f: s, f = a[s], a[f]
    return s
```

### C14. Longest palindromic substring (expand around center)
```python
def longest_pal(s):
    best = ""
    for c in range(len(s)):
        for l, r in ((c, c), (c, c + 1)):
            while l >= 0 and r < len(s) and s[l] == s[r]: l -= 1; r += 1
            if r - l - 1 > len(best): best = s[l+1:r]
    return best
```
O(n²). Manacher's algorithm achieves O(n).

### C15. Minimum window substring
```python
from collections import Counter
def min_window(s, t):
    need, missing = Counter(t), len(t)
    l = 0; best = (float('inf'), 0, 0)
    for r, c in enumerate(s):
        if need[c] > 0: missing -= 1
        need[c] -= 1
        if missing == 0:
            while need[s[l]] < 0: need[s[l]] += 1; l += 1
            if r - l + 1 < best[0]: best = (r - l + 1, l, r + 1)
            need[s[l]] += 1; missing += 1; l += 1
    return "" if best[0] == float('inf') else s[best[1]:best[2]]
```

### C16. Serialize and deserialize a binary tree
```python
def serialize(root):
    out = []
    def go(n):
        if not n: out.append('#'); return
        out.append(str(n.v)); go(n.l); go(n.r)
    go(root); return ','.join(out)

def deserialize(s):
    it = iter(s.split(','))
    def go():
        v = next(it)
        if v == '#': return None
        n = T(int(v)); n.l = go(); n.r = go(); return n
    return go()
```

### C17. Invert a binary tree / check symmetric
```python
def invert(n):
    if n: n.l, n.r = invert(n.r), invert(n.l)
    return n
def symmetric(a, b):
    if not a and not b: return True
    return bool(a and b and a.v == b.v and symmetric(a.l, b.r) and symmetric(a.r, b.l))
```

### C18. Path sum and maximum path sum
```python
def max_path_sum(root):
    best = float('-inf')
    def gain(n):
        nonlocal best
        if not n: return 0
        l, r = max(gain(n.l), 0), max(gain(n.r), 0)
        best = max(best, n.v + l + r)
        return n.v + max(l, r)
    gain(root); return best
```

### C19. Course schedule (can finish all courses?)
Use the Kahn's algorithm code from Q60 and return `len(order) == n`.

### C20. Clone a graph
```python
def clone(node, seen=None):
    seen = seen if seen is not None else {}
    if not node: return None
    if node in seen: return seen[node]
    c = Node(node.val); seen[node] = c
    c.neighbors = [clone(nb, seen) for nb in node.neighbors]
    return c
```

### C21. Word ladder (BFS on implicit graph)
```python
from collections import deque
def ladder(begin, end, words):
    words = set(words)
    q, seen = deque([(begin, 1)]), {begin}
    while q:
        w, d = q.popleft()
        if w == end: return d
        for i in range(len(w)):
            for ch in 'abcdefghijklmnopqrstuvwxyz':
                nw = w[:i] + ch + w[i+1:]
                if nw in words and nw not in seen: seen.add(nw); q.append((nw, d + 1))
    return 0
```

### C22. Implement `Queue` with a circular buffer
```python
class RingQueue:
    def __init__(self, cap): self.a, self.h, self.n = [None] * cap, 0, 0
    def enqueue(self, x):
        if self.n == len(self.a): raise OverflowError
        self.a[(self.h + self.n) % len(self.a)] = x; self.n += 1
    def dequeue(self):
        if not self.n: raise IndexError
        x = self.a[self.h]; self.h = (self.h + 1) % len(self.a); self.n -= 1; return x
```

### C23. Implement a min-heap from scratch
```python
class MinHeap:
    def __init__(self): self.h = []
    def push(self, x):
        h = self.h; h.append(x); i = len(h) - 1
        while i and h[(i - 1) // 2] > h[i]:
            h[(i - 1) // 2], h[i] = h[i], h[(i - 1) // 2]; i = (i - 1) // 2
    def pop(self):
        h = self.h; top = h[0]; last = h.pop()
        if h:
            h[0] = last; i = 0
            while True:
                l, r, m = 2 * i + 1, 2 * i + 2, i
                if l < len(h) and h[l] < h[m]: m = l
                if r < len(h) and h[r] < h[m]: m = r
                if m == i: break
                h[i], h[m] = h[m], h[i]; i = m
        return top
```

### C24. Design Twitter-like feed (merge k sorted lists with a heap)
Each user has a list of `(time, tweet_id)`. To get the latest 10 from followees, push the latest tweet of each followee into a max-heap (by negative time) and pop 10 times, pushing the previous tweet of the popped user. O(k + 10 log k).

### C25. Implement `debounce`-like data structure: time-based key-value store
Store `key -> list of (timestamp, value)` (timestamps increase). `get(key, t)` uses `bisect_right` to find the latest entry with timestamp ≤ t. O(log n) per get.

### C26. JavaScript versions of three classics
```js
// Two Sum
const twoSum = (nums, t) => {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    if (seen.has(t - nums[i])) return [seen.get(t - nums[i]), i];
    seen.set(nums[i], i);
  }
};

// Debounce (not DSA, but common)
const debounce = (fn, ms) => { let id; return (...a) => { clearTimeout(id); id = setTimeout(() => fn(...a), ms); }; };

// Group by (using Map)
const groupBy = (arr, key) => {
  const m = new Map();
  for (const x of arr) {
    if (!m.has(x[key])) m.set(x[key], []);
    m.get(x[key]).push(x);
  }
  return m;
};
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. Binary search infinite loop
```python
while lo < hi:
    mid = (lo + hi) // 2
    if a[mid] < t: lo = mid          # BUG: lo may never advance
    else: hi = mid
```
**Fix:** `lo = mid + 1`. Always check that each branch shrinks the range. Use a consistent invariant (`[lo, hi)` or `[lo, hi]`).

### D2. Off-by-one in sliding window
Window length is `r - l + 1`, not `r - l`. Check with a one-element input and with `k` equal to the array length.

### D3. Mutating a list while iterating
```python
for x in lst:
    if x % 2 == 0: lst.remove(x)     # skips elements
```
**Fix:** build a new list (`[x for x in lst if x % 2]`) or iterate over a copy or backwards.

### D4. Shared reference in 2D arrays
```python
grid = [[0] * 3] * 3       # BUG: three references to the same row
grid[0][0] = 1             # changes all rows
```
**Fix:** `[[0] * 3 for _ in range(3)]`.

### D5. Backtracking returns the same list repeated
```python
res.append(path)           # BUG: stores a reference, later mutated
```
**Fix:** `res.append(path[:])` or `list(path)`.

### D6. Recursion limit / stack overflow
Deep DFS on a 10⁵-node chain crashes. **Fix:** iterative DFS with an explicit stack, increase `sys.setrecursionlimit` carefully, or restructure. Java: `StackOverflowError`. JS: `RangeError: Maximum call stack size exceeded`.

### D7. Timeout on a "correct" solution
Likely hidden O(n²): `x in list` inside a loop, `list.pop(0)`, string concatenation in a loop, slicing in recursion, `sorted()` inside a loop. **Fix:** use a set/dict/deque, pass indices, build once.

### D8. Wrong answer with negative numbers
Sliding window for "subarray sum = K" fails when values can be negative because shrinking the window does not always reduce the sum. **Fix:** prefix sums with a hash map (Q42).

### D9. Dijkstra gives wrong results
Edges have negative weights, or you did not skip stale heap entries, or you marked nodes visited when pushed rather than when popped. **Fix:** Bellman-Ford for negative edges; check `d > dist[u]` after popping.

### D10. Integer overflow in `mid = (lo + hi) / 2`
In Java/C++ with 32-bit ints, the sum can overflow. **Fix:** `lo + (hi - lo) / 2`. (Python has big ints; JS uses doubles, safe up to 2⁵³.)

### D11. HashMap with mutable keys
Mutating an object after using it as a key changes its hash and the entry becomes unreachable. **Fix:** use immutable keys.

### D12. Graph traversal visits nodes repeatedly (never ends)
Missing `visited` set, or marking visited too late in BFS (mark when enqueuing, not when dequeuing, to avoid duplicates in the queue).

### D13. Sorting gives odd order in JavaScript
```js
[10, 9, 1].sort()                 // [1, 10, 9]  (string comparison)
```
**Fix:** `.sort((a, b) => a - b)`.

### D14. Floating point comparison in algorithms
`0.1 + 0.2 == 0.3` is False. Use integers where possible (cents), or compare with a tolerance (`math.isclose`).

### D15. LRU cache evicts the wrong item
`get` forgot to mark the item as recently used, or `put` of an existing key did not move it to the front. Add tests for update-existing-key and capacity 1.

---

# 🧩 Part 8: Tricky Questions

### T1. Is `O(2n)` the same as `O(n)`?
Yes. Constants are dropped. Also `O(n + m)` is **not** `O(n)` when `m` is an independent input.

### T2. Is a hash map lookup really O(1)?
Average O(1), assuming a good hash function and bounded load factor. Worst case O(n) (all keys collide; tree buckets make it O(log n) in Java). Also hashing a string key costs O(length of key).

### T3. Why is building a heap O(n), not O(n log n)?
Sift-down cost depends on node height. Most nodes are near the bottom with tiny heights: the sum `Σ (n / 2^(h+1)) · h` converges to O(n).

### T4. Why is `list.insert(0, x)` slow but `append` fast?
Inserting at the front shifts all elements right (O(n)). Append writes at the end (O(1) amortized).

### T5. Can binary search work on a linked list?
It runs in O(n) because reaching the middle takes O(n) steps. It needs random access to be O(log n).

### T6. Recursion and iteration: are they equivalent in power?
Yes. Any recursion can be converted to iteration with an explicit stack. Recursion is clearer for trees and backtracking, iteration avoids stack limits.

### T7. DFS vs BFS: which uses more memory?
BFS keeps a whole frontier (up to O(width) nodes, wide trees can be big). DFS keeps O(depth). On a very deep, narrow graph BFS is cheaper; on a wide shallow one DFS is cheaper.

### T8. Does BFS give the shortest path in a weighted graph?
No, only when all edges have equal weight. Use Dijkstra (non-negative) or Bellman-Ford. With weights 0 or 1, use 0-1 BFS with a deque.

### T9. Why does Kadane's algorithm work with all-negative arrays?
Because it starts with `best = cur = a[0]` rather than 0, and `cur = max(x, cur + x)`. If you initialize `best = 0` you wrongly return 0.

### T10. What is the complexity of `sorted(set(a))`?
`set(a)` is O(n), sorting `k` unique elements is O(k log k). So O(n + k log k).

### T11. Two stacks vs one queue: amortized or worst-case O(1)?
Queue via two stacks is amortized O(1) per operation, but a single `pop` can take O(n) when it triggers the transfer.

### T12. Why not always choose merge sort over quicksort?
Quicksort is in place, cache-friendly and faster in practice for arrays; merge sort needs O(n) extra space. Merge sort wins for linked lists, stability, and guaranteed worst case.

### T13. Is Dijkstra greedy or DP?
Both viewpoints exist: it is greedy (always finalize the closest unsettled node), and it relies on optimal substructure of shortest paths.

### T14. Difference between a subarray, a subsequence and a subset?
Subarray/substring: contiguous. Subsequence: keeps order but may skip elements. Subset: any selection, order ignored. Counts for length n: subarrays n(n+1)/2, subsequences and subsets 2ⁿ.

### T15. What does "in-place" really mean?
O(1) extra space (some accept O(log n) for recursion). The input is modified. It does not mean zero extra variables.

### T16. Are Python dicts ordered?
Insertion-ordered since Python 3.7 (language guarantee). `set` is not ordered. JS `Map` preserves insertion order; plain object integer-like keys are ordered numerically first.

### T17. Tree height for n nodes?
Balanced: O(log n). Skewed: n. A random BST has expected height O(log n).

### T18. Why do DP solutions often start loops from 1 and use `n + 1` size?
Index 0 represents the empty prefix or base case, which removes special cases in recurrences.

### T19. Can greedy ever be used on the 0/1 knapsack?
No: sorting by value/weight ratio gives the optimal answer only for the **fractional** knapsack. 0/1 needs DP.

### T20. Difference between memoization and caching?
Memoization is function-level caching of results by arguments, a technique inside the algorithm. Caching is broader (HTTP, CDN, DB) and involves invalidation and eviction.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- **Array access?** O(1). **Search unsorted?** O(n).
- **Binary search needs?** Sorted data + random access.
- **Stack order?** LIFO. **Queue?** FIFO.
- **Hash map average lookup?** O(1).
- **BST average search?** O(log n); worst O(n).
- **Heap peek / push / pop?** O(1) / O(log n) / O(log n).
- **Build heap?** O(n).
- **Merge sort time / space?** O(n log n) / O(n).
- **Quick sort worst case?** O(n²).
- **Heap sort space?** O(1).
- **Stable sorts?** Merge, insertion, bubble, counting, Timsort.
- **BFS uses?** Queue. **DFS uses?** Stack or recursion.
- **BFS finds?** Shortest path in unweighted graphs.
- **Dijkstra requires?** Non-negative weights.
- **Negative edges?** Bellman-Ford.
- **All-pairs shortest path?** Floyd-Warshall O(V³).
- **MST algorithms?** Kruskal, Prim.
- **Topological sort works on?** DAGs.
- **Cycle in linked list?** Floyd's tortoise and hare.
- **Union-Find complexity?** Nearly O(1) amortized.
- **Trie operation cost?** O(length of word).
- **DP needs?** Overlapping subproblems + optimal substructure.
- **Greedy needs?** Greedy-choice property.
- **Backtracking?** Choose, explore, un-choose.
- **Top K elements?** Heap of size K, O(n log k).
- **Median of stream?** Two heaps.
- **LRU cache?** Hash map + doubly linked list.
- **Membership with tiny memory?** Bloom filter.
- **Distinct count approx?** HyperLogLog.
- **Range sum with updates?** Fenwick or segment tree.
- **Substring search?** KMP O(n + m).
- **Power of two check?** `n & (n - 1) == 0` (for n > 0).
- **XOR trick?** `a ^ a = 0`; finds the unpaired number.
- **Sieve complexity?** O(n log log n).
- **Euclid GCD?** O(log min(a, b)).
- **Recursion needs?** A base case.
- **Amortized?** Average cost over a sequence of operations.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about a time you improved performance with a better data structure.
Use STAR. Example: "A report endpoint took 12 seconds because it called `list.includes` inside a loop over 50,000 records. I replaced the list with a Set (O(1) lookups) and moved filtering to the database. It dropped to 400 ms. I added a benchmark to prevent regressions."

### P2. How do you approach a problem you have never seen?
Clarify, brute force first, find the bottleneck, map to a pattern (two pointers, sliding window, graph, DP), test small examples, then optimize. Show the process, not only the answer.

### P3. Describe a time DSA knowledge helped in production.
Examples: fixed an N+1 query pattern, used a min-heap for a job scheduler, used a trie for route matching, a Bloom filter to cut cache misses, or a topological sort for dependency ordering in a build tool.

### P4. How do you balance readability and performance?
Write the clear solution first, measure, optimize hot paths only, comment on why a non-obvious structure was chosen, and keep complexity notes near tricky code.

### P5. How do you prepare for coding interviews?
Pattern-based practice (arrays/hashing, two pointers, sliding window, stack, binary search, linked list, trees, heaps, backtracking, graphs, DP), timed sessions, writing code without an IDE, then reviewing mistakes in a log.

### P6. How do you test algorithmic code?
Unit tests with small hand-checked cases, edge cases (empty, one element, duplicates, negatives, max sizes), randomized tests against a brute-force reference, and property checks (e.g. sorted output is a permutation of input).

### P7. What would you do if your solution is too slow?
Profile or reason about the complexity, remove repeated work (memoize, precompute), swap data structures, reduce constants, consider approximation or batching, and check I/O or database as the true bottleneck.

### P8. Tell me about a mistake you made with complexity.
Be honest: e.g. a nested loop that was fine with 100 items but failed with 100,000 in production. Explain detection (monitoring, profiling), fix, and the guard you added (load tests, complexity comments in review).

---

# 📚 Part 11: Complete Coverage (Topics + Patterns + Mixed)

## Topics
- **Analysis:** Big-O/Ω/Θ, best/avg/worst, amortized, space, recurrences, Master Theorem.
- **Linear structures:** arrays, dynamic arrays, strings, linked lists (singly, doubly, circular), stacks, queues, deques, circular buffers.
- **Hashing:** hash maps, sets, collision handling, load factor, rolling hash, consistent hashing, Bloom filter.
- **Trees:** binary tree, BST, AVL, red-black, B/B+ tree, heap, trie, segment tree, Fenwick tree, k-d tree, quadtree.
- **Graphs:** representations, BFS, DFS, topological sort, shortest paths (Dijkstra, Bellman-Ford, Floyd-Warshall, A*), MST (Kruskal, Prim), SCC, bridges, flow, matching, Union-Find.
- **Sorting and searching:** all comparison and non-comparison sorts, binary search variants, quickselect, external sort.
- **Paradigms:** brute force, recursion, divide and conquer, greedy, DP (1D, 2D, knapsack, LIS/LCS, bitmask, interval, tree, digit), backtracking, branch and bound, two pointers, sliding window, prefix sums, monotonic stack/queue.
- **Strings:** palindromes, anagrams, KMP, Rabin-Karp, Z-algorithm, Manacher, suffix array/tree (awareness), edit distance.
- **Math and bits:** primes, sieve, GCD, modular arithmetic, fast exponentiation, combinatorics, bit tricks.
- **Advanced/awareness:** skip list, LSM tree, HyperLogLog, Count-Min Sketch, persistent structures, NP-completeness, approximation.

## Patterns cheat list (what to try first)
| If you see... | Try... |
|---|---|
| Sorted array, pair/triple sum | Two pointers |
| Contiguous subarray/substring with a condition | Sliding window |
| "Count/exists subarray with sum" | Prefix sum + hash map |
| Next greater/smaller | Monotonic stack |
| "Top K", "k-th", merge k lists | Heap / quickselect |
| Shortest path, levels | BFS |
| All combinations/permutations | Backtracking |
| Min/max/count ways with choices | DP |
| Intervals | Sort + sweep |
| Connectivity, groups | Union-Find / DFS |
| Dependencies/order | Topological sort |
| Prefix queries on words | Trie |
| Search on answer range | Binary search on answer |
| Cycle in list or sequence | Fast/slow pointers |

## Mixed topics
- DSA + databases: indexes (B+ tree), joins (hash/sort-merge), query planning.
- DSA + OS: schedulers (heap, multilevel queues), page replacement (LRU, Clock), memory allocation (buddy system, free lists).
- DSA + networking: routing tables (trie, longest-prefix match), shortest path routing (Dijkstra, Bellman-Ford), rate limiting.
- DSA + frontend: virtual DOM diffing (tree diff), event loop queues, memoization, virtualized lists, debouncing.
- DSA + backend: caching (LRU/LFU), message queues, scheduling, sharding (consistent hashing).
- DSA + AI/ML: nearest neighbors (k-d tree, HNSW), beam search (heap), tokenizers (trie, BPE), graph neural networks.

---

# 🔬 Part 12: Internals (How Structures Really Work)

### I1. Python `list`
A dynamic array of pointers to objects. Over-allocates on growth (roughly 1.125× plus a constant), so append is amortized O(1). `pop(0)` and `insert(0, x)` shift memory: O(n). Elements are references, so a list of ints holds pointers, not raw ints (use `array` or NumPy for compact numeric data).

### I2. Python `dict`
Open-addressing hash table with a compact layout: a sparse index table pointing into a dense, insertion-ordered entries array. Keys must be hashable. Resizes when about 2/3 full. String hashes are randomized per process.

### I3. JavaScript engines (V8)
Arrays have "elements kinds" (packed SMI, doubles, generic) and can be dense or in dictionary mode (sparse). Holey arrays and mixed types are slower. `Map` and `Set` are hash tables keeping insertion order. Objects use hidden classes (shapes) for fast property access; adding properties in different orders creates different shapes.

### I4. Java `HashMap`
Array of buckets, default capacity 16, load factor 0.75, doubles on resize. Chains turn into red-black trees at length 8 (when the table has at least 64 buckets). `ConcurrentHashMap` uses CAS and per-bin locking. `ArrayList` is a growing array (1.5×). `LinkedList` is rarely better than `ArrayList`. `PriorityQueue` is a binary heap.

### I5. Heap in an array
Node `i` has children `2i + 1`, `2i + 2` and parent `(i - 1) // 2`. A complete binary tree maps perfectly to an array with no pointers, which is cache-friendly.

### I6. Memory layout and Big-O reality
A linked list node costs a pointer (8 bytes) plus object header, and nodes may be scattered in memory. An array of 1 million ints is contiguous. Iterating the array can be 10–100× faster than the list although both are O(n).

### I7. Recursion and the call stack
Each call pushes a frame (arguments, locals, return address). Python frames are heap objects with a configurable limit; Java/C++/JS use fixed-size thread stacks (typically 512 KB–8 MB). Tail call optimization exists in some languages (Scheme, Scala for self calls) but not in Python or standard JS engines.

### I8. Timsort in a nutshell
Finds natural runs (already ascending or descending), extends short runs with insertion sort to a minimum size (32–64), then merges runs using a stack with invariants, with "galloping" mode to speed up merging when one run dominates. Best case O(n), worst O(n log n), stable.

### I9. How a B+ tree stays balanced
Nodes hold between `m/2` and `m` keys. A full node splits in two on insert and pushes a key up. An underfull node borrows from a sibling or merges on delete. All leaves are at the same depth, and leaves are linked for range scans.

### I10. Garbage collection and data structure shape
Graph-like structures with many small objects increase GC work (tracing cost). Flat arrays and object pools reduce pressure. In reference-counted systems (CPython), reference cycles need the cyclic GC.

---

# 📊 Part 13: Reference Tables

### Data structure operations (average / worst where different)
| Structure | Access | Search | Insert | Delete | Space |
|---|---|---|---|---|---|
| Array | O(1) | O(n) | O(n) | O(n) | O(n) |
| Dynamic array (end) | O(1) | O(n) | O(1) amortized | O(1) | O(n) |
| Singly linked list | O(n) | O(n) | O(1) at head | O(1) at head | O(n) |
| Stack / Queue | O(n) | O(n) | O(1) | O(1) | O(n) |
| Hash table | n/a | O(1) / O(n) | O(1) / O(n) | O(1) / O(n) | O(n) |
| BST (balanced) | O(log n) | O(log n) | O(log n) | O(log n) | O(n) |
| BST (skewed) | O(n) | O(n) | O(n) | O(n) | O(n) |
| Binary heap | n/a | O(n) | O(log n) | O(log n) top | O(n) |
| Trie | n/a | O(L) | O(L) | O(L) | O(total chars) |
| Segment / Fenwick tree | n/a | O(log n) query | O(log n) update | n/a | O(n) |

### Sorting algorithms
(See the table in Part 1, Q37.) Extra: Shell sort is about O(n^1.3) in practice; Tim sort O(n) best; Bucket sort O(n + k) average.

### Graph algorithms
| Problem | Algorithm | Time |
|---|---|---|
| Traversal | BFS, DFS | O(V + E) |
| Shortest path, unweighted | BFS | O(V + E) |
| Shortest path, non-negative | Dijkstra (heap) | O((V + E) log V) |
| Shortest path, negative edges | Bellman-Ford | O(V·E) |
| All pairs | Floyd-Warshall | O(V³) |
| MST | Kruskal / Prim | O(E log E) / O(E log V) |
| Topological order | Kahn / DFS | O(V + E) |
| SCC | Tarjan / Kosaraju | O(V + E) |
| Max flow | Dinic | O(V²E) worst |

### Paradigm decision table
| Paradigm | Use when | Example |
|---|---|---|
| Brute force | tiny n | permutations n ≤ 8 |
| Divide & conquer | independent halves | merge sort, quickselect |
| Greedy | local choice is globally optimal | interval scheduling |
| DP | overlapping subproblems | knapsack, LCS |
| Backtracking | enumerate with pruning | N-Queens, sudoku |
| Binary search | monotonic predicate | min speed, sqrt |
| Two pointers | sorted / paired scan | 3Sum |
| Sliding window | contiguous range | longest unique substring |

### Space for common recursion patterns
| Pattern | Time | Stack space |
|---|---|---|
| Linear recursion (factorial) | O(n) | O(n) |
| Binary recursion (naive fib) | O(2ⁿ) | O(n) |
| Divide & conquer halves | O(n log n) | O(log n) |
| DFS on tree | O(n) | O(h) |
| Backtracking subsets | O(2ⁿ · n) | O(n) |

### Language collections (Python / JavaScript / Java)
| Need | Python | JavaScript | Java |
|---|---|---|---|
| Dynamic array | `list` | `Array` | `ArrayList` |
| Hash map | `dict` | `Map` / `Object` | `HashMap` |
| Hash set | `set` | `Set` | `HashSet` |
| Deque / queue | `collections.deque` | array (careful with `shift`) | `ArrayDeque` |
| Min-heap | `heapq` | no built-in | `PriorityQueue` |
| Sorted map | `sortedcontainers` (3rd party) | no built-in | `TreeMap` |
| Counter | `collections.Counter` | `Map` | `HashMap<K,Integer>` |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
```python
a = [1, 2, 3]
b = a
b.append(4)
print(a)
```
**Output:** `[1, 2, 3, 4]`. `b` references the same list.

### O2.
```python
a = [[0] * 2] * 2
a[0][0] = 5
print(a)
```
**Output:** `[[5, 0], [5, 0]]`. Both rows are the same object.

### O3.
```python
def f(x, acc=[]):
    acc.append(x)
    return acc
print(f(1), f(2))
```
**Output:** `[1, 2] [1, 2]`. The default list is created once and shared. Both prints show the same final list because it is printed after both calls.

### O4.
```python
print(sorted([3, 1, 2], reverse=True), [3, 1, 2][::-1])
```
**Output:** `[3, 2, 1] [2, 1, 3]`. Sorting descending vs reversing the existing order.

### O5.
```python
print(7 // 2, -7 // 2, 7 % -3)
```
**Output:** `3 -4 -2`. Floor division rounds toward negative infinity and the modulo sign follows the divisor.

### O6.
```js
console.log([10, 9, 1].sort());
console.log([10, 9, 1].sort((a, b) => a - b));
```
**Output:** `[1, 10, 9]` then `[1, 9, 10]`.

### O7.
```python
from collections import deque
d = deque([1, 2, 3])
d.rotate(1)
print(d)
```
**Output:** `deque([3, 1, 2])`.

### O8. Complexity prediction
```python
def f(n):
    c = 0
    for i in range(n):
        j = 1
        while j < n:
            j *= 2
            c += 1
    return c
```
**Answer:** `O(n log n)`. The outer loop runs n times and the inner loop runs about log₂ n times.

### O9. Complexity prediction
```python
def g(n):
    i = n
    while i > 0:
        for j in range(i):
            pass
        i //= 2
```
**Answer:** `O(n)`. Work is n + n/2 + n/4 + ... = 2n.

### O10. Complexity prediction
```python
def h(a):
    for i in range(len(a)):
        for j in range(i, len(a)):
            pass
```
**Answer:** `O(n²)`. About n(n+1)/2 iterations.

### O11.
```python
import heapq
h = [5, 1, 3]
heapq.heapify(h)
print(heapq.heappop(h), heapq.heappop(h))
```
**Output:** `1 3`.

### O12.
```python
s = {1, 2, 3}
t = {3, 4}
print(s & t, s | t, s - t, s ^ t)
```
**Output:** `{3} {1, 2, 3, 4} {1, 2} {1, 2, 4}`.

### O13.
```python
print(bin(10 & 6), bin(10 | 6), bin(10 ^ 6), 1 << 4, 20 >> 2)
```
**Output:** `0b10 0b1110 0b1100 16 5`.

### O14.
```python
a = "Ritesh Kumar"
print(a[::-1][:5], a.split()[1][::-1])
```
**Output:** `ramuK ramuK`. The reversed string is `ramuK hsetiR`; its first five characters are `ramuK`, and the second word reversed is also `ramuK`.

### O15. Recursion trace
```python
def f(n):
    if n == 0: return 0
    return n + f(n - 1)
print(f(4))
```
**Output:** `10` (4 + 3 + 2 + 1 + 0).

---

# ✅ Part 15: MCQs

**1. Time complexity of binary search?**
A) O(n)  B) O(log n)  C) O(n log n)  D) O(1)
**Answer: B**

**2. Which data structure uses LIFO?**
A) Queue  B) Stack  C) Heap  D) Trie
**Answer: B**

**3. Worst-case time of quick sort?**
A) O(n log n)  B) O(n)  C) O(n²)  D) O(log n)
**Answer: C**

**4. Which traversal of a BST yields sorted order?**
A) Preorder  B) Inorder  C) Postorder  D) Level order
**Answer: B**

**5. Which finds shortest paths with non-negative weights?**
A) DFS  B) Dijkstra  C) Kruskal  D) Topological sort
**Answer: B**

**6. Build-heap complexity?**
A) O(n log n)  B) O(n)  C) O(log n)  D) O(n²)
**Answer: B**

**7. Which is NOT stable by default?**
A) Merge sort  B) Insertion sort  C) Quick sort  D) Timsort
**Answer: C**

**8. Best structure for "have I seen this value?" checks?**
A) List  B) Hash set  C) Stack  D) Linked list
**Answer: B**

**9. Which needs a DAG?**
A) BFS  B) Topological sort  C) Dijkstra  D) Union-Find
**Answer: B**

**10. Amortized cost of dynamic array append?**
A) O(n)  B) O(log n)  C) O(1)  D) O(n²)
**Answer: C**

**11. Which algorithm detects a cycle in a linked list using O(1) space?**
A) BFS  B) Floyd's tortoise and hare  C) Dijkstra  D) Kruskal
**Answer: B**

**12. In 0/1 knapsack with a 1D dp array, the capacity loop must go:**
A) forward  B) backward  C) random  D) either way
**Answer: B**

**13. Which structure gives O(log n) range-sum queries with updates?**
A) Prefix array  B) Fenwick/Segment tree  C) Stack  D) Hash map
**Answer: B**

**14. Which has false positives but no false negatives?**
A) Hash set  B) Bloom filter  C) Trie  D) Heap
**Answer: B**

**15. BFS on an unweighted graph gives:**
A) minimum spanning tree  B) shortest path (by edges)  C) topological order  D) longest path
**Answer: B**

**16. Master theorem for T(n) = 2T(n/2) + O(n):**
A) O(n)  B) O(n log n)  C) O(n²)  D) O(log n)
**Answer: B**

**17. A greedy algorithm is guaranteed correct for:**
A) any optimization problem  B) problems with greedy-choice property  C) only sorting  D) only graphs
**Answer: B**

**18. Which data structure is used for LRU in O(1)?**
A) Array only  B) Hash map + doubly linked list  C) Stack  D) BST
**Answer: B**

**19. Time to find the k largest of n items with a size-k min-heap?**
A) O(n)  B) O(n log k)  C) O(k log n)  D) O(n²)
**Answer: B**

**20. Which sort is best for nearly sorted data?**
A) Selection  B) Insertion/Timsort  C) Heap  D) Quick with first pivot
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

1. **Jumping to code without clarifying constraints.** Ask about size, duplicates, negatives, empty input, and sorted-ness.
2. **Ignoring edge cases.** Empty, single element, all equal, very large, negative numbers.
3. **Off-by-one errors in loops and binary search.** Define the interval invariant first.
4. **Using `list.pop(0)` or `shift()` for queues.** Use a deque or an index.
5. **Membership tests on lists inside loops.** Convert to a set.
6. **Not copying the path in backtracking.** Append `path[:]`.
7. **Forgetting the visited set** in graph traversals.
8. **Marking visited on dequeue in BFS.** Mark on enqueue.
9. **Using Dijkstra with negative weights.**
10. **Recursive solutions on huge inputs** without considering stack depth.
11. **Slicing in recursion** (hidden O(n) copies). Pass indices.
12. **Wrong initialization** (`best = 0` for all-negative arrays, `INF` too small, `dp` size off by one).
13. **Shallow copies of 2D structures.** Build rows separately.
14. **Not stating complexity** or stating the wrong one (forgetting hidden costs such as sorting or string building).
15. **Over-engineering.** Using a segment tree when a prefix sum is enough.
16. **Silent assumptions about integer overflow** in Java/C++.
17. **Comparing floats with `==`.**
18. **Not testing the code** with a small example before declaring it finished.
19. **Memorizing solutions without understanding patterns.** Interviewers change a detail to check this.
20. **Going silent.** Explain your thinking while coding.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You state a brute force first, give its complexity, and **derive** the optimization from its bottleneck.
- You ask about constraints and use them to choose the algorithm (Q140).
- You describe both time **and** space, plus hidden costs (hashing long strings, sorting, recursion stack).
- You know the difference between average, worst-case and amortized, and when each matters (tail latency, adversarial input).
- You can name the pattern quickly (sliding window, monotonic stack, union-find, topological sort) and recognize a graph hidden in a story problem.
- You test with edge cases before being asked.
- You link algorithms to systems: B+ trees in databases, heaps in schedulers, tries in routers, consistent hashing in caches, LSM trees in write-heavy stores.
- You know when **not** to optimize and you measure first.
- You mention cache locality and constant factors, not just Big-O.
- You can say "this is NP-hard, so I would use a heuristic or approximation" instead of searching for a perfect fast solution.
- You write small helper functions, clear names, and no clever one-liners that hide logic.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Complexity ladder
`1 < log n < √n < n < n log n < n² < n³ < 2ⁿ < n!`

### Patterns in one line each
- **Two pointers:** sorted array, pairs, in-place edits.
- **Sliding window:** contiguous range with a condition.
- **Prefix sum + hash map:** subarray sum queries.
- **Monotonic stack/deque:** next greater, window max.
- **Binary search:** sorted data or monotonic answer.
- **BFS:** shortest path in unweighted graph, level order.
- **DFS/backtracking:** enumerate, components, cycles.
- **Heap:** top K, k-way merge, scheduling, Dijkstra.
- **Union-Find:** dynamic connectivity, Kruskal.
- **Topological sort:** dependencies.
- **DP:** state, recurrence, base, order, optimize space.
- **Greedy:** sort and pick, prove with exchange argument.
- **Trie:** prefix queries.
- **Bit tricks:** XOR for singles, masks for subsets.

### DP recipe
1. What does `dp[...]` mean? 2. Recurrence. 3. Base case. 4. Fill order. 5. Answer cell. 6. Space optimization.

### Graph recipe
Build adjacency list → choose BFS (shortest, levels) or DFS (explore, order) → track visited → handle disconnected components → if weighted pick Dijkstra / Bellman-Ford.

### Interview script
1. Restate the problem and ask clarifying questions.
2. Give an example and edge cases.
3. Brute force + complexity.
4. Optimize + justify.
5. Code carefully.
6. Dry run on an example.
7. State final time/space complexity and possible follow-ups.

### Final checklist before the interview
- [ ] Can write binary search, BFS, DFS, merge sort, quicksort partition, heap push/pop from memory.
- [ ] Can explain hash table collisions and resizing.
- [ ] Can solve a sliding window, a two-pointer, a DP and a graph problem under time pressure.
- [ ] Can design an LRU cache and explain why the structure is chosen.
- [ ] Can compute complexity of nested loops and recursion (Master Theorem).
- [ ] Know language collection costs (list vs deque, dict, heapq, sort) for your interview language.
- [ ] Prepared two stories about performance wins using data structures.

