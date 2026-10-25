# Python Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **Python 3.12 and 3.13** and mentions newer features (3.13 free-threaded build and experimental JIT, 3.14 additions) as "verify in the official docs". Examples use the sample name **Ritesh Kumar**. FastAPI, Django-level web topics and ML libraries are in their own files; this file is about the language, the standard library, tooling, concurrency, performance and production practice.

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
- [Part 11: Complete Coverage (Language + Standard Library + Tooling + Mixed)](#-part-11-complete-coverage-language--standard-library--tooling--mixed)
- [Part 12: Python Internals](#-part-12-python-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is Python?
Python is a high-level, interpreted, dynamically typed, general-purpose language known for readable syntax. It supports procedural, object-oriented and functional styles, has a large standard library ("batteries included") and a huge ecosystem (web, data, AI, automation, DevOps).

### Q2. Is Python compiled or interpreted?
Both. CPython first compiles source code to **bytecode** (`.pyc` files in `__pycache__`), then the Python Virtual Machine executes that bytecode. Other implementations: PyPy (JIT), Jython, IronPython, MicroPython.

### Q3. What are Python's key features?
Readable syntax, dynamic typing, automatic memory management, rich built-in types, first-class functions, comprehensions, generators, decorators, context managers, extensive standard library, cross-platform, and a strong community.

### Q4. How do you run a Python program?
```bash
python hello.py            # run a script
python -m module_name      # run a module
python                     # interactive REPL
python -c "print('hi')"    # run a one-liner
```

### Q5. What are variables and how does typing work?
A variable is a **name bound to an object**. Types belong to objects, not names.
```python
x = 10        # int
x = "ten"     # now bound to a str (allowed: dynamic typing)
```
Python is **strongly typed**: `"5" + 5` raises `TypeError` instead of silently converting.

### Q6. What are the built-in data types?
Numbers (`int`, `float`, `complex`, `bool`), text (`str`), sequences (`list`, `tuple`, `range`), mapping (`dict`), sets (`set`, `frozenset`), binary (`bytes`, `bytearray`), and `NoneType`.

### Q7. Mutable vs immutable types *(Must-know)*
| Immutable | Mutable |
|---|---|
| `int`, `float`, `bool`, `str`, `tuple`, `frozenset`, `bytes` | `list`, `dict`, `set`, `bytearray`, most custom objects |

Immutable objects cannot change after creation; "changing" creates a new object. Only immutable (hashable) objects can be dict keys or set members.

### Q8. List vs tuple vs set vs dict
| Type | Ordered | Mutable | Duplicates | Syntax |
|---|---|---|---|---|
| list | Yes | Yes | Yes | `[1, 2]` |
| tuple | Yes | No | Yes | `(1, 2)` |
| set | No (arbitrary) | Yes | No | `{1, 2}` |
| dict | Insertion-ordered (3.7+) | Yes | Unique keys | `{"a": 1}` |

### Q9. What are `if`, `for`, `while`, `break`, `continue`, `pass`, and the loop `else`?
```python
for n in range(5):
    if n == 3:
        break
else:
    print("runs only if the loop did NOT break")
```
`pass` is a no-op placeholder. The `else` on a loop runs when the loop ends normally (no `break`).

### Q10. What is indentation and why does it matter?
Python uses indentation (4 spaces by convention, PEP 8) to define blocks. Inconsistent indentation causes `IndentationError`.

### Q11. How do you define and call a function?
```python
def greet(name: str, greeting: str = "Hello") -> str:
    return f"{greeting}, {name}"

greet("Ritesh Kumar")
greet(name="Ritesh Kumar", greeting="Hi")
```

### Q12. `*args` and `**kwargs`
`*args` collects extra positional arguments into a tuple; `**kwargs` collects extra keyword arguments into a dict.
```python
def f(*args, **kwargs):
    print(args, kwargs)
f(1, 2, a=3)       # (1, 2) {'a': 3}
```

### Q13. What is a lambda?
An anonymous single-expression function: `square = lambda x: x * x`. Use for short callbacks (`sorted(items, key=lambda p: p.age)`); use `def` for anything bigger.

### Q14. What are list comprehensions?
```python
squares = [x * x for x in range(10) if x % 2 == 0]
pairs = {k: v for k, v in zip("abc", range(3))}
unique = {len(w) for w in ["a", "bb", "cc"]}
```
They are concise and usually faster than equivalent loops. Avoid deeply nested ones.

### Q15. How do you work with strings?
```python
s = "Ritesh Kumar"
s.lower(); s.upper(); s.split(); s.strip(); s.replace("Kumar", "K")
s[0]; s[-1]; s[0:6]; s[::-1]
"-".join(["a", "b"])
f"Name: {s!r:>20}"           # f-strings (preferred)
```
Strings are immutable.

### Q16. How do you take input and print output?
`name = input("Name: ")` returns a `str`. `print("a", "b", sep="-", end="\n")` writes to stdout.

### Q17. How do you handle exceptions?
```python
try:
    value = int(text)
except ValueError as e:
    print("bad number", e)
else:
    print("no error")        # runs only if no exception
finally:
    print("always runs")     # cleanup
```

### Q18. What are common built-in exceptions?
`ValueError`, `TypeError`, `KeyError`, `IndexError`, `AttributeError`, `ZeroDivisionError`, `FileNotFoundError`, `ImportError`/`ModuleNotFoundError`, `StopIteration`, `RuntimeError`, `OSError`.

### Q19. How do you read and write files?
```python
with open("data.txt", "w", encoding="utf-8") as f:
    f.write("hello\n")
with open("data.txt", encoding="utf-8") as f:
    for line in f:
        print(line.rstrip())
```
Always use `with` so the file closes automatically, and pass `encoding` explicitly.

### Q20. What is a module and a package?
A module is a `.py` file. A package is a directory of modules (with `__init__.py`, optional for namespace packages). Import with `import math`, `from pathlib import Path`, `import numpy as np`.

### Q21. What is `pip`?
Python's package installer: `pip install requests`, `pip freeze`, `pip uninstall`. Use it inside a virtual environment.

### Q22. What is a virtual environment?
An isolated Python environment with its own packages.
```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```
Tools: `venv`, `virtualenv`, `uv`, `poetry`, `pipenv`, `conda`.

### Q23. What is `if __name__ == "__main__":`?
`__name__` is `"__main__"` when the file is run directly and the module name when imported. The guard prevents code from running on import.

### Q24. What is `None`?
The single object of type `NoneType`, representing "no value". Compare with `is None`, not `== None`.

### Q25. `==` vs `is`
`==` compares values (calls `__eq__`). `is` compares identity (same object in memory). Use `is` only for singletons like `None`, `True`, `False`.

### Q26. What are truthy and falsy values?
Falsy: `False`, `None`, `0`, `0.0`, `""`, `[]`, `()`, `{}`, `set()`, `range(0)`, objects whose `__bool__` returns `False` or `__len__` returns 0. Everything else is truthy.

### Q27. What is slicing?
`seq[start:stop:step]`, stop excluded, negative indexes count from the end. Slices create a shallow copy: `lst[:]`.

### Q28. How do you sort?
```python
sorted([3, 1, 2])                        # new list
lst.sort(reverse=True)                   # in place, returns None
sorted(people, key=lambda p: (p.age, p.name))
```
Sorting is stable (equal items keep their order).

### Q29. How do you iterate with index or two lists together?
```python
for i, v in enumerate(items, start=1): ...
for a, b in zip(list1, list2): ...        # stops at the shortest (use zip(..., strict=True) in 3.10+)
```

### Q30. What is a dictionary and how do you use it?
```python
user = {"name": "Ritesh Kumar", "age": 30}
user["city"] = "Delhi"
user.get("phone", "n/a")
for k, v in user.items(): ...
user.pop("age", None)
```
Missing key with `[]` raises `KeyError`; `.get()` returns a default.

### Q31. What is a set and when do you use it?
An unordered collection of unique hashable items: fast membership tests (O(1) average), removing duplicates, and set math (`|`, `&`, `-`, `^`).

### Q32. What is the difference between `append`, `extend` and `insert`?
`append(x)` adds one item at the end; `extend(iterable)` adds each element; `insert(i, x)` adds at a position (O(n)).

### Q33. What is the difference between `remove`, `pop` and `del`?
`remove(x)` deletes the first matching value; `pop(i)` removes and returns the item at index (default last); `del lst[i]` deletes by index or slice.

### Q34. What are Python's operators?
Arithmetic `+ - * / // % **`, comparison, logical `and or not`, bitwise `& | ^ ~ << >>`, membership `in`/`not in`, identity `is`, assignment `+=`, walrus `:=`. `/` is true division; `//` is floor division.

### Q35. What are docstrings and comments?
`#` makes a comment. A docstring is a string literal as the first statement of a module/class/function, accessible through `__doc__` and `help()`.

---

# 🔵 Part 2: Junior (1–3 years)

### Q36. How does Python manage memory? *(Must-know)*
CPython uses **reference counting** plus a **cyclic garbage collector** for reference cycles. Objects live on a private heap managed by the interpreter (pymalloc for small objects). When an object's reference count hits zero it is freed immediately. `gc` module controls the cycle collector.

### Q37. Shallow copy vs deep copy
```python
import copy
a = [[1, 2], [3]]
b = copy.copy(a)        # new outer list, same inner lists
c = copy.deepcopy(a)    # fully independent
a[0].append(99)         # b[0] changes too, c[0] does not
```

### Q38. Mutable default argument trap *(Must-know)*
```python
def add(x, items=[]):         # ❌ the list is created once
    items.append(x); return items
add(1); add(2)                # [1, 2]  (shared!)

def add(x, items=None):       # ✅
    items = [] if items is None else items
    items.append(x); return items
```

### Q39. What are decorators?
Functions that wrap another function to add behavior.
```python
import functools, time

def timed(fn):
    @functools.wraps(fn)                 # keep name and docstring
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        try:
            return fn(*args, **kwargs)
        finally:
            print(f"{fn.__name__} took {time.perf_counter() - start:.3f}s")
    return wrapper

@timed
def work(): ...
```

### Q40. Decorators with arguments
```python
def retry(times=3):
    def deco(fn):
        @functools.wraps(fn)
        def wrapper(*a, **kw):
            for attempt in range(times):
                try: return fn(*a, **kw)
                except Exception:
                    if attempt == times - 1: raise
        return wrapper
    return deco

@retry(times=5)
def call_api(): ...
```

### Q41. Iterators and iterables *(Must-know)*
An **iterable** has `__iter__` (returns an iterator). An **iterator** has `__next__` (returns the next item, raises `StopIteration` at the end) and `__iter__` (returns itself). `for` loops call `iter()` then `next()` repeatedly.

### Q42. Generators
Functions with `yield` produce values lazily, keeping local state between calls.
```python
def read_lines(path):
    with open(path, encoding="utf-8") as f:
        for line in f:
            yield line.rstrip()

total = sum(len(l) for l in read_lines("big.txt"))   # constant memory
```
Generator expressions: `(x * x for x in range(10**9))`. Use `yield from` to delegate to another generator.

### Q43. Context managers and `with`
```python
from contextlib import contextmanager

@contextmanager
def timer(label):
    start = time.perf_counter()
    try:
        yield
    finally:
        print(label, time.perf_counter() - start)

class Resource:
    def __enter__(self): return self
    def __exit__(self, exc_type, exc, tb): return False    # True would suppress the exception
```

### Q44. Classes and objects
```python
class User:
    species = "human"                      # class attribute
    def __init__(self, name: str):
        self.name = name                   # instance attribute
    def greet(self) -> str:
        return f"Hi, {self.name}"
u = User("Ritesh Kumar")
```
`self` is the instance passed automatically to instance methods.

### Q45. `@staticmethod`, `@classmethod`, instance methods
Instance methods get `self`. Class methods get `cls` (alternative constructors). Static methods get nothing (namespacing utility functions).
```python
class Date:
    def __init__(self, y, m, d): self.y, self.m, self.d = y, m, d
    @classmethod
    def from_string(cls, s): return cls(*map(int, s.split("-")))
    @staticmethod
    def is_leap(y): return y % 4 == 0 and (y % 100 != 0 or y % 400 == 0)
```

### Q46. Inheritance and `super()`
```python
class Animal:
    def speak(self): return "..."
class Dog(Animal):
    def speak(self): return super().speak() + " Woof"
```
Python supports multiple inheritance; the **MRO** (C3 linearization) defines lookup order: `Dog.__mro__`.

### Q47. Magic (dunder) methods
`__init__`, `__repr__`, `__str__`, `__eq__`, `__hash__`, `__lt__`, `__len__`, `__getitem__`, `__iter__`, `__contains__`, `__call__`, `__enter__/__exit__`, `__add__`, `__bool__`. They let objects work with built-in syntax.
```python
class Vec:
    def __init__(self, x, y): self.x, self.y = x, y
    def __add__(self, o): return Vec(self.x + o.x, self.y + o.y)
    def __repr__(self): return f"Vec({self.x}, {self.y})"
```

### Q48. `__str__` vs `__repr__`
`__repr__` is for developers (unambiguous, ideally `eval`-able); `__str__` is for users. `print()` uses `__str__`, falling back to `__repr__`. Always define `__repr__`.

### Q49. Properties
```python
class Account:
    def __init__(self): self._balance = 0
    @property
    def balance(self): return self._balance
    @balance.setter
    def balance(self, v):
        if v < 0: raise ValueError("negative")
        self._balance = v
```

### Q50. Dataclasses *(Must-know)*
```python
from dataclasses import dataclass, field

@dataclass(slots=True, frozen=True)
class Point:
    x: float
    y: float = 0.0
    tags: list[str] = field(default_factory=list)
```
Generates `__init__`, `__repr__`, `__eq__` (and ordering/hash if requested). Use `frozen=True` for immutability and `slots=True` to save memory.

### Q51. Type hints
```python
def total(prices: list[float], tax: float | None = None) -> float: ...
```
Hints are not enforced at runtime; use `mypy` or `pyright` to check. Common types: `list[int]`, `dict[str, int]`, `tuple[int, ...]`, `Optional[X]` = `X | None`, `Callable[[int], str]`, `TypedDict`, `Protocol`, `Literal`, `Final`.

### Q52. Exceptions: custom and chaining
```python
class AppError(Exception): ...
class NotFound(AppError): ...

try:
    load()
except KeyError as e:
    raise NotFound("user missing") from e      # keeps the original cause
```
Catch specific exceptions; never use a bare `except:`. Use `raise` alone to re-raise.

### Q53. `with open` vs `pathlib`
```python
from pathlib import Path
p = Path("data") / "users.json"
text = p.read_text(encoding="utf-8")
p.parent.mkdir(parents=True, exist_ok=True)
for f in Path(".").glob("**/*.py"): ...
```
Prefer `pathlib` over string path manipulation.

### Q54. JSON and CSV
```python
import json, csv
data = json.loads('{"a": 1}'); text = json.dumps(data, indent=2, ensure_ascii=False)
with open("f.csv", newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f): ...
```

### Q55. Regular expressions
```python
import re
m = re.search(r"(?P<user>\w+)@(?P<host>[\w.]+)", "mail ritesh@example.com")
m.group("user")
re.findall(r"\d+", "a1b22"); re.sub(r"\s+", " ", text)
pattern = re.compile(r"^\d{3}-\d{4}$")
```
Use raw strings (`r""`). Beware catastrophic backtracking on untrusted input.

### Q56. Logging instead of print
```python
import logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
log = logging.getLogger(__name__)
log.info("started user=%s", "Ritesh Kumar")       # lazy formatting
log.exception("failed")                           # includes traceback inside except
```

### Q57. `collections` module
`Counter`, `defaultdict`, `deque`, `namedtuple`, `OrderedDict`, `ChainMap`.
```python
from collections import Counter, defaultdict, deque
Counter("banana").most_common(2)
groups = defaultdict(list); groups["a"].append(1)
q = deque(maxlen=3); q.append(1)         # O(1) at both ends
```

### Q58. `itertools` and `functools`
`itertools`: `chain`, `islice`, `groupby`, `product`, `permutations`, `combinations`, `accumulate`, `zip_longest`, `batched` (3.12). `functools`: `lru_cache`, `cache`, `partial`, `reduce`, `wraps`, `cached_property`, `singledispatch`, `total_ordering`.

### Q59. `lru_cache` memoization
```python
from functools import lru_cache
@lru_cache(maxsize=None)
def fib(n): return n if n < 2 else fib(n - 1) + fib(n - 2)
```
Arguments must be hashable. Use `cache_clear()` when data changes.

### Q60. Unpacking and the walrus operator
```python
a, *rest, z = [1, 2, 3, 4]
first, (x, y) = 1, (2, 3)
merged = {**d1, **d2}; combined = [*list1, *list2]
if (n := len(items)) > 10: print(n)
```

### Q61. `match` statement (structural pattern matching, 3.10+)
```python
match command.split():
    case ["go", direction]: move(direction)
    case ["quit" | "exit"]: quit()
    case [_, *rest] if rest: ...
    case {"type": "user", "name": name}: ...
    case _: print("unknown")
```

### Q62. Common testing tools
`unittest` (built in), `pytest` (most popular: fixtures, parametrize, plugins), `doctest`, `tox`/`nox` for matrices, `coverage`, `hypothesis` for property-based tests.

---

# 🟡 Part 3: Mid (3–5 years)

### Q63. The GIL *(Must-know)*
The Global Interpreter Lock in CPython allows only **one thread to execute Python bytecode at a time**. It simplifies memory management (reference counts) but means CPU-bound pure-Python threads do not run in parallel. I/O releases the GIL, so threads help for I/O-bound work. For CPU-bound work use `multiprocessing`, native extensions (NumPy releases the GIL), or other runtimes. Python 3.13 offers an experimental **free-threaded** build (no GIL) and experimental JIT; verify status in the release notes before using them in production.

### Q64. Threading vs multiprocessing vs asyncio *(Must-know)*
| | Threads | Processes | asyncio |
|---|---|---|---|
| Best for | Blocking I/O (with libraries that are not async) | CPU-bound work | Massive concurrent I/O |
| Parallel CPU? | No (GIL) | Yes | No |
| Memory | Shared | Separate (IPC needed) | Shared, single thread |
| Overhead | Low | High | Very low |
| Pitfalls | Races, locks | Pickling, startup | Blocking calls freeze everything |

### Q65. asyncio basics
```python
import asyncio, httpx

async def fetch(client, url):
    r = await client.get(url, timeout=5)
    return r.status_code

async def main():
    async with httpx.AsyncClient() as client:
        results = await asyncio.gather(*(fetch(client, u) for u in urls))

asyncio.run(main())
```
`async def` creates a coroutine; `await` yields control to the event loop; `gather` runs coroutines concurrently. Never call blocking functions (`time.sleep`, `requests.get`) inside async code; use `await asyncio.sleep`, async libraries, or `asyncio.to_thread`.

### Q66. `TaskGroup` and cancellation (3.11+)
```python
async with asyncio.TaskGroup() as tg:
    t1 = tg.create_task(job(1))
    t2 = tg.create_task(job(2))
# if any task fails, the others are cancelled and an ExceptionGroup is raised
```
Use `asyncio.timeout(5)` as a context manager for deadlines. Handle `asyncio.CancelledError` by cleaning up and re-raising.

### Q67. `concurrent.futures`
```python
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor, as_completed
with ThreadPoolExecutor(max_workers=10) as pool:
    futures = [pool.submit(download, u) for u in urls]
    for f in as_completed(futures):
        print(f.result())
```
`ProcessPoolExecutor` for CPU-bound work (arguments and results must be picklable).

### Q68. `multiprocessing` basics
```python
from multiprocessing import Pool
if __name__ == "__main__":           # required on Windows/macOS (spawn)
    with Pool() as p:
        results = p.map(cpu_heavy, range(100))
```
Share data via queues, pipes, shared memory (`multiprocessing.shared_memory`), or avoid sharing.

### Q69. Thread safety and locks
```python
import threading
lock = threading.Lock()
counter = 0
def inc():
    global counter
    with lock:
        counter += 1
```
`counter += 1` is not atomic. Prefer queues (`queue.Queue`) for communication, and immutable data.

### Q70. Descriptors and `__getattr__`
A descriptor defines `__get__`, `__set__`, `__delete__`. Properties, methods and `classmethod` use them. `__getattr__` is called only when normal lookup fails; `__getattribute__` is called for every access.

### Q71. `__slots__`
Declares fixed attributes, removing the per-instance `__dict__`, saving memory and speeding access.
```python
class P:
    __slots__ = ("x", "y")
```
Trade-off: no dynamic attributes, careful with inheritance.

### Q72. Abstract base classes and protocols
```python
from abc import ABC, abstractmethod
class Repo(ABC):
    @abstractmethod
    def get(self, id: int): ...

from typing import Protocol
class SupportsClose(Protocol):
    def close(self) -> None: ...        # structural typing (duck typing with static checks)
```

### Q73. Composition over inheritance
Prefer holding collaborators (`self.repo`, `self.notifier`) instead of deep inheritance trees. Easier testing and fewer MRO surprises.

### Q74. Metaclasses (when and why)
Classes are objects created by `type`. A metaclass customizes class creation (`class M(type): def __new__(...)`). Used by ORMs/frameworks. Often replaceable by `__init_subclass__`, class decorators or dataclasses; use sparingly.

### Q75. Generators vs iterators vs coroutines
Generators are a convenient way to write iterators. Native coroutines (`async def`) are awaited by an event loop. Async generators (`async def` with `yield`) are consumed with `async for`.

### Q76. Packaging and dependency management *(Must-know)*
Use `pyproject.toml` (PEP 517/621) as the single config. Tools: `uv` (fast resolver/installer), `poetry`, `pip-tools`, `hatch`, `setuptools`. Pin versions with a lockfile (`uv.lock`, `poetry.lock`, `requirements.txt` with hashes). Separate dev dependencies. Build wheels (`python -m build`) and publish to PyPI or a private index.

### Q77. Project layout
```
project/
  pyproject.toml
  src/mypkg/__init__.py
  src/mypkg/core.py
  tests/test_core.py
  README.md
```
The `src/` layout prevents accidentally importing the local folder instead of the installed package.

### Q78. Linting, formatting and type checking
`ruff` (lint + format, replaces flake8/isort/black in many projects), `black`, `mypy`, `pyright`, `pre-commit` hooks, and CI gates. Consistent style removes review noise.

### Q79. pytest essentials
```python
import pytest

@pytest.fixture
def user(): return {"name": "Ritesh Kumar"}

@pytest.mark.parametrize("a,b,expected", [(1, 2, 3), (0, 0, 0)])
def test_add(a, b, expected): assert a + b == expected

def test_raises():
    with pytest.raises(ZeroDivisionError): 1 / 0
```
Use `monkeypatch`, `tmp_path`, `capsys`, markers, and `conftest.py` for shared fixtures. Mock with `unittest.mock.patch` where the name is *used*, not where it is defined.

### Q80. Environment configuration
Read settings from environment variables, validate with `pydantic-settings`, never commit secrets, and use `.env` only for local development.

### Q81. Pydantic for validation
```python
from pydantic import BaseModel, EmailStr, Field
class User(BaseModel):
    name: str = Field(min_length=2)
    email: EmailStr
u = User.model_validate({"name": "Ritesh Kumar", "email": "r@example.com"})
```
Runtime validation and serialization based on type hints (v2 is Rust-powered and much faster).

### Q82. Working with databases
`sqlite3` (built in), `psycopg` / `asyncpg` for PostgreSQL, SQLAlchemy 2.0 (ORM and Core), `alembic` for migrations. Always use parameterized queries:
```python
cur.execute("SELECT * FROM users WHERE email = %s", (email,))
```

### Q83. HTTP clients
`requests` (sync, simple), `httpx` (sync + async, HTTP/2), `aiohttp`. Always set **timeouts**; reuse sessions/clients for connection pooling; handle retries with backoff (`tenacity`).

### Q84. Performance basics: profile first
`cProfile`, `timeit`, `py-spy` (sampling profiler for running processes), `line_profiler`, `memory_profiler`/`tracemalloc`. Typical wins: better algorithms/data structures, avoiding repeated work, caching, generators, vectorization (NumPy), moving hot loops to C extensions (Cython, Rust via PyO3), and using `set`/`dict` for lookups.

### Q85. Common time complexities
| Operation | list | dict/set | deque |
|---|---|---|---|
| Index | O(1) | - | O(n) middle |
| Append | O(1) amortized | - | O(1) |
| Insert/pop at front | O(n) | - | O(1) |
| Membership `in` | O(n) | O(1) avg | O(n) |
| Sort | O(n log n) | - | - |

### Q86. String building efficiently
Repeated `s += x` in loops can be slow; collect parts and use `"".join(parts)`. CPython sometimes optimizes `+=` but do not rely on it.

### Q87. Date and time handling
```python
from datetime import datetime, timezone, timedelta
from zoneinfo import ZoneInfo
now = datetime.now(timezone.utc)
ist = now.astimezone(ZoneInfo("Asia/Kolkata"))
```
Store UTC, convert for display, avoid naive datetimes, and never use `datetime.utcnow()` (deprecated).

### Q88. Decimal and float
```python
0.1 + 0.2 == 0.3                    # False (binary floating point)
from decimal import Decimal
Decimal("0.1") + Decimal("0.2") == Decimal("0.3")     # True
```
Use `Decimal` (or integer cents) for money; `math.isclose` for float comparison.

### Q89. Security basics in Python
Never `eval`/`exec` untrusted input; avoid `pickle.loads` on untrusted data; use parameterized SQL; use `secrets` (not `random`) for tokens; use `subprocess.run([...])` without `shell=True`; hash passwords with `argon2`/`bcrypt`; pin and audit dependencies (`pip-audit`).

### Q90. `subprocess`
```python
import subprocess
r = subprocess.run(["git", "rev-parse", "HEAD"], capture_output=True, text=True, check=True, timeout=10)
print(r.stdout.strip())
```
`check=True` raises on non-zero exit; always set a timeout; pass a list, not a string.

### Q91. Command-line tools
`argparse` (built in), `click`, `typer` (type-hint based). Provide `--help`, exit codes, and entry points in `pyproject.toml` (`[project.scripts]`).

### Q92. Reading large files and data
Iterate lazily (`for line in f`), use generators, `csv`/`json` streaming (`ijson`), chunked `pandas.read_csv(chunksize=...)`, memory-mapped files (`mmap`), and avoid loading everything into lists.


---

# 🟠 Part 4: Senior (5–7 years)

### Q93. How do you design a Python service for production? *(Architecture)*
Typed code (`mypy`/`pyright` in CI), `pyproject.toml` with locked dependencies, configuration from the environment (validated by pydantic-settings), structured logging, health checks, graceful shutdown, timeouts on every I/O call, metrics and tracing (OpenTelemetry), tests (unit, integration with real DB containers), a slim non-root Docker image, and a CI/CD pipeline with security scans. Choose sync or async deliberately and keep business logic independent from the web framework.

### Q94. Sync vs async: how do you choose?
Async shines for many concurrent I/O-bound operations (web servers with lots of idle waiting, API fan-out). It adds complexity: every library in the hot path should be async, and one blocking call stalls the loop. For mostly CPU-bound or simple CRUD services with sync drivers, sync frameworks with several worker processes (Gunicorn/uWSGI, or Uvicorn workers) are simpler and perfectly fine. Never mix blindly: run blocking code with `asyncio.to_thread` or a thread pool.

### Q95. Deploying Python web apps
WSGI (sync: Gunicorn) vs ASGI (async: Uvicorn/Hypercorn). Run multiple worker processes to use all cores, put Nginx/ALB in front, set worker timeouts, `--max-requests` with jitter to mitigate slow leaks, and tune workers (`2 × cores + 1` is a rule of thumb for sync workers). In Kubernetes prefer one worker per small pod and scale pods.

### Q96. Memory profiling and leaks
Leaks in Python usually mean **lingering references**: caches without limits, global lists, closures, circular references with `__del__`, thread/async tasks never finished, or C extension leaks. Tools: `tracemalloc` (snapshots and diffs), `objgraph`, `gc.get_objects()`, `memray`, `pympler`. Fix by bounding caches (`lru_cache(maxsize)`, `cachetools.TTLCache`), using weak references (`weakref`), and closing resources.

### Q97. Garbage collector details
Reference counting frees most objects immediately. The generational cycle collector (generations 0, 1, 2) handles cycles. `gc.collect()`, `gc.freeze()` (useful before forking to reduce copy-on-write), and `gc.disable()` in latency-sensitive code with care. Note: copy-on-write is defeated by reference-count updates, so forked workers gradually duplicate memory.

### Q98. Performance optimization strategy
1. Measure with realistic data and profile (`py-spy`, `cProfile`).
2. Fix algorithmic issues (O(n²) → O(n log n)).
3. Use proper data structures (`set`, `dict`, `deque`, `heapq`, `bisect`).
4. Reduce Python-level loops: built-ins (`sum`, `any`, `map`), comprehensions, NumPy/pandas/Polars vectorization.
5. Cache results; batch I/O; connection pooling.
6. Use native code (Cython, Numba, Rust with PyO3, C extensions) for proven hot spots.
7. Consider PyPy for pure-Python long-running workloads (compatibility varies).

### Q99. Writing a C extension or binding: options
`ctypes`/`cffi` (call existing C libs), Cython (typed Python compiled to C), pybind11/nanobind (C++), PyO3 + maturin (Rust), and Numba (JIT for numeric code). Rust via PyO3 is a popular modern choice for safe, fast extensions.

### Q100. Python object model: how attribute lookup works
For `obj.attr`: data descriptors on the type, then instance `__dict__`, then non-data descriptors and class attributes along the MRO, then `__getattr__`. Methods are functions on the class that become bound methods through the descriptor protocol (`__get__`).

### Q101. Advanced typing
`TypeVar` and generics (`class Box[T]` in 3.12), `ParamSpec` for decorators, `Protocol`, `TypedDict`, `Literal`, `Annotated`, `Self`, `overload`, `TypeGuard`, `NewType`, `Final`. Gradual typing: add types to public APIs first. Use `typing.TYPE_CHECKING` to avoid circular imports.
```python
from typing import Callable, ParamSpec, TypeVar
P = ParamSpec("P"); R = TypeVar("R")
def logged(fn: Callable[P, R]) -> Callable[P, R]:
    def inner(*a: P.args, **kw: P.kwargs) -> R:
        print(fn.__name__); return fn(*a, **kw)
    return inner
```

### Q102. Dependency injection and testability
Pass collaborators in (constructor or function parameters), depend on protocols, and construct the object graph in one place (the composition root). Frameworks like FastAPI have `Depends`. This replaces global state and makes mocking trivial.

### Q103. Concurrency patterns
Producer/consumer with `queue.Queue` or `asyncio.Queue`, worker pools, semaphores to limit concurrency (`asyncio.Semaphore`), bounded queues for backpressure, `asyncio.gather(return_exceptions=True)`, graceful cancellation, and idempotent tasks. Never create unbounded tasks.
```python
sem = asyncio.Semaphore(10)
async def limited(coro_fn, *a):
    async with sem:
        return await coro_fn(*a)
```

### Q104. Task queues and background jobs
Celery (mature, broker: Redis/RabbitMQ), RQ, Dramatiq, Arq (async, Redis), Huey, cloud queues (SQS), and workflow engines (Temporal, Airflow, Prefect). Make tasks idempotent, set retries with backoff, use dead-letter queues, and keep payloads small (IDs, not objects).

### Q105. Logging and observability design
JSON logs (`structlog`, `python-json-logger`), correlation IDs via `contextvars`, metrics with `prometheus-client`, traces with OpenTelemetry, Sentry for errors. `contextvars` is the async-safe replacement for thread-locals.

### Q106. `contextvars`
```python
from contextvars import ContextVar
request_id: ContextVar[str] = ContextVar("request_id", default="-")
request_id.set("abc")      # each asyncio task has its own copy of the context
```

### Q107. Database patterns with SQLAlchemy 2.0
Use sessions per request/unit of work, `select()` statements, eager loading (`selectinload`) to avoid N+1, transactions with context managers, connection pooling settings (`pool_size`, `pool_pre_ping`), and Alembic migrations that are backward compatible for zero-downtime deploys.

### Q108. API design with FastAPI/Django/Flask: choosing
FastAPI: async, type-hint driven validation and OpenAPI docs (see file 015). Django: batteries-included (ORM, admin, auth) for full products. Flask: minimal and flexible. Choose by team skills, features needed and ecosystem.

### Q109. Packaging a library for others
Semantic versioning, `pyproject.toml` metadata, typed package (`py.typed`), wheels for each platform when native, changelog, documented public API (`__all__`), deprecation warnings (`warnings.warn(..., DeprecationWarning)`), CI matrix across Python versions (tox/nox), and trusted publishing to PyPI.

### Q110. Supply chain security
Lock and hash dependencies, `pip-audit`/Dependabot, avoid typosquatted names, review new packages, use private indexes, pin build tools, sign and verify artifacts, minimal base images, and SBOMs.

### Q111. Handling large data: pandas vs Polars vs DuckDB
Pandas is ubiquitous but memory-hungry and single-threaded in most operations. Polars is multi-threaded and lazy with a Rust core. DuckDB runs SQL on files (Parquet/CSV) efficiently. Choose by data size and team familiarity; read in chunks or push work to the database when data is big. (See file 055.)

### Q112. Debugging production Python
Use structured logs with request IDs, Sentry for exceptions, `py-spy dump` / `py-spy top` on running processes (no restart), `faulthandler` for hangs and crashes (`faulthandler.dump_traceback_later`), `tracemalloc` for memory, and reproduce with the same dependency versions. Mitigate first, then fix the root cause and add tests.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q113. Python vs Node vs Go vs Java: how do you decide? *(Decision)*
| | Python | Node.js | Go | Java |
|---|---|---|---|---|
| Strengths | Data/AI/ML, scripting, rapid development, huge libraries | Async I/O, full-stack JS/TS | Concurrency, small static binaries, simple deploys | Mature enterprise ecosystem, performance, tooling |
| Weaknesses | Slower raw CPU speed, GIL (changing), packaging complexity | CPU-bound on one thread | Smaller ecosystem, verbose error handling | Heavier, more boilerplate |
| Typical use | ML services, data pipelines, automation, APIs | Realtime APIs, BFFs | Infra, high-throughput services | Large business systems |
Decide by workload, team, ecosystem, latency targets and operational maturity. Often the right answer is polyglot: Python for ML/data, another language for latency-critical edge services.

### Q114. Standardizing Python across teams
One supported Python version policy, a service template (uv/poetry, ruff, mypy, pytest, Dockerfile, CI), shared libraries (logging, config, auth, HTTP client), dependency update automation, security scanning, coding guidelines, and ADRs for key choices.

### Q115. Monorepo vs polyrepo for Python
Monorepo (uv workspaces, Pants, Bazel) simplifies shared code and atomic changes but needs tooling for selective CI. Polyrepo gives independence but risks version drift. Choose by team size and release coupling.

### Q116. Python upgrade strategy
Track the support lifecycle (each version gets about 5 years), upgrade yearly, test against the next version in CI early, remove deprecated APIs gradually, use `python -W error` in tests to surface deprecations, and upgrade dependencies first.

### Q117. Typing adoption strategy
Start with new code and public interfaces, enable `mypy --strict` per package, use `# type: ignore[code]` sparingly with comments, add stubs for untyped libraries, and treat the type checker as part of CI. Typing improves refactoring safety and onboarding.

### Q118. Modular architecture
Domain layer (pure Python, no frameworks), application/services, adapters (DB, HTTP, queues). Enforce boundaries with import linters (`import-linter`). Keep side effects at the edges; pass dependencies explicitly.

### Q119. Reliability engineering
SLOs for latency and errors, timeouts/retries/circuit breakers (`tenacity`, `pybreaker`), idempotent operations, graceful shutdown, health probes, load tests (Locust, k6), chaos tests, runbooks, and blameless post-mortems.

### Q120. Data and ML platform considerations
Reproducible environments (lockfiles, containers), data versioning (DVC, lakehouse tables), experiment tracking (MLflow, W&B), feature stores, model registries, batch vs online inference, monitoring drift, and cost control (GPU scheduling). (See files 056 to 076.)

### Q121. Security program
Dependency scanning, secret scanning, SAST (bandit, semgrep), least-privilege credentials, input validation, secure deserialization policy (no pickle for untrusted data), audit logging, regular pen tests, and compliance needs.

### Q122. Cost and capacity
Right-size workers and pods, autoscale on latency or queue depth, cache and batch, choose efficient serialization, avoid over-provisioned GPU, schedule batch jobs on spot capacity, and track cost per request or per job.

### Q123. Hiring and mentoring
Interview for: data model fluency (mutability, hashing, iteration), concurrency model (GIL, async), testing habits, debugging approach, and design judgment. Mentor via code review on typing, error handling, resource cleanup and test quality.

### Q124. Technical debt and roadmap
Debt register: unsupported Python versions, unpinned dependencies, missing types/tests, blocking calls in async code, copy-pasted scripts, slow CI. Allocate regular capacity and review the roadmap (Python releases, free-threading readiness, framework upgrades) each quarter.

---

# 💻 Part 6: Coding / Machine-Coding Tasks

> Practice each task from memory. Mention complexity, edge cases, types and tests.

### C1. Reverse a string, check palindrome
```python
def is_palindrome(s: str) -> bool:
    cleaned = [c.lower() for c in s if c.isalnum()]
    return cleaned == cleaned[::-1]
```

### C2. Two sum (hash map, O(n))
```python
def two_sum(nums: list[int], target: int) -> tuple[int, int] | None:
    seen: dict[int, int] = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return seen[target - n], i
        seen[n] = i
    return None
```

### C3. Count word frequency
```python
from collections import Counter
import re
def top_words(text: str, n: int = 3):
    return Counter(re.findall(r"[a-z']+", text.lower())).most_common(n)
```

### C4. Group anagrams
```python
from collections import defaultdict
def group_anagrams(words):
    groups = defaultdict(list)
    for w in words:
        groups["".join(sorted(w))].append(w)
    return list(groups.values())
```

### C5. Flatten a nested list (recursive generator)
```python
def flatten(items):
    for x in items:
        if isinstance(x, (list, tuple)):
            yield from flatten(x)
        else:
            yield x
list(flatten([1, [2, [3, 4]], 5]))     # [1, 2, 3, 4, 5]
```

### C6. LRU cache from scratch
```python
from collections import OrderedDict
class LRUCache:
    def __init__(self, capacity: int):
        self.cap, self.data = capacity, OrderedDict()
    def get(self, key):
        if key not in self.data: return None
        self.data.move_to_end(key); return self.data[key]
    def put(self, key, value):
        self.data[key] = value; self.data.move_to_end(key)
        if len(self.data) > self.cap: self.data.popitem(last=False)
```

### C7. Retry decorator with exponential backoff
```python
import functools, random, time
def retry(times=3, base=0.2, exceptions=(Exception,)):
    def deco(fn):
        @functools.wraps(fn)
        def wrapper(*a, **kw):
            for attempt in range(times):
                try: return fn(*a, **kw)
                except exceptions:
                    if attempt == times - 1: raise
                    time.sleep(base * 2 ** attempt * (0.5 + random.random()))
        return wrapper
    return deco
```

### C8. Memoize decorator (hashable args)
```python
def memoize(fn):
    cache = {}
    @functools.wraps(fn)
    def wrapper(*args):
        if args not in cache: cache[args] = fn(*args)
        return cache[args]
    return wrapper
```

### C9. Read a huge file lazily and count matches
```python
def count_errors(path: str) -> int:
    with open(path, encoding="utf-8") as f:
        return sum(1 for line in f if "ERROR" in line)
```

### C10. Context manager for timing
See Q43. Also implement as a class with `__enter__`/`__exit__`.

### C11. Custom iterator (Fibonacci)
```python
class Fib:
    def __init__(self, limit): self.a, self.b, self.limit = 0, 1, limit
    def __iter__(self): return self
    def __next__(self):
        if self.a > self.limit: raise StopIteration
        value, self.a, self.b = self.a, self.b, self.a + self.b
        return value
```

### C12. Binary search
```python
def bsearch(arr, x):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == x: return mid
        lo, hi = (mid + 1, hi) if arr[mid] < x else (lo, mid - 1)
    return -1
```
(`bisect` in the standard library does this.)

### C13. Merge intervals
```python
def merge(intervals):
    out = []
    for s, e in sorted(intervals):
        if out and s <= out[-1][1]: out[-1][1] = max(out[-1][1], e)
        else: out.append([s, e])
    return out
```

### C14. Async fetch of many URLs with a concurrency limit
```python
import asyncio, httpx
async def fetch_all(urls, limit=10):
    sem = asyncio.Semaphore(limit)
    async with httpx.AsyncClient(timeout=5) as client:
        async def one(u):
            async with sem:
                r = await client.get(u); r.raise_for_status(); return r.json()
        return await asyncio.gather(*(one(u) for u in urls), return_exceptions=True)
```

### C15. Thread pool downloads with results in order
```python
from concurrent.futures import ThreadPoolExecutor
with ThreadPoolExecutor(8) as pool:
    results = list(pool.map(download, urls, timeout=30))
```

### C16. CPU-bound work with multiprocessing
```python
from concurrent.futures import ProcessPoolExecutor
def is_prime(n): ...
if __name__ == "__main__":
    with ProcessPoolExecutor() as pool:
        flags = list(pool.map(is_prime, range(10**6), chunksize=10_000))
```

### C17. Producer/consumer with `queue.Queue`
```python
import queue, threading
q: queue.Queue = queue.Queue(maxsize=100)
def producer():
    for i in range(1000): q.put(i)
    q.put(None)
def consumer():
    while (item := q.get()) is not None:
        process(item); q.task_done()
threading.Thread(target=producer).start(); consumer()
```

### C18. Singleton (module-level is simplest)
```python
# config.py  -> module is a singleton
settings = load_settings()
# or via __new__
class Singleton:
    _inst = None
    def __new__(cls):
        if cls._inst is None: cls._inst = super().__new__(cls)
        return cls._inst
```

### C19. Dataclass model with validation
```python
from dataclasses import dataclass
@dataclass(frozen=True, slots=True)
class Money:
    amount: int      # cents
    currency: str = "INR"
    def __post_init__(self):
        if self.amount < 0: raise ValueError("amount must be >= 0")
```

### C20. Parse and validate JSON with pydantic
See Q81. Return structured errors: `except ValidationError as e: e.errors()`.

### C21. Simple CLI with argparse
```python
import argparse
p = argparse.ArgumentParser(description="Greeter")
p.add_argument("name"); p.add_argument("--shout", action="store_true")
args = p.parse_args()
msg = f"Hello, {args.name}"
print(msg.upper() if args.shout else msg)
```

### C22. Unit tests with pytest and mocking
```python
from unittest.mock import patch
def test_fetch_user_handles_timeout():
    with patch("app.service.httpx.get", side_effect=TimeoutError):
        assert fetch_user(1) is None
```
Patch where the name is looked up (`app.service.httpx`), not at its origin.

### C23. Rate limiter (token bucket)
```python
import time
class TokenBucket:
    def __init__(self, rate: float, capacity: int):
        self.rate, self.cap, self.tokens, self.t = rate, capacity, capacity, time.monotonic()
    def allow(self) -> bool:
        now = time.monotonic()
        self.tokens = min(self.cap, self.tokens + (now - self.t) * self.rate); self.t = now
        if self.tokens >= 1: self.tokens -= 1; return True
        return False
```

### C24. Dockerfile for a Python service (uv)
```dockerfile
FROM python:3.12-slim
ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1
WORKDIR /app
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev
COPY src ./src
RUN useradd -m app && chown -R app /app
USER app
CMD ["uv", "run", "uvicorn", "mypkg.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### C25. Linked list reversal
```python
class Node:
    def __init__(self, val, nxt=None): self.val, self.next = val, nxt
def reverse(head):
    prev = None
    while head: head.next, prev, head = prev, head, head.next
    return prev
```

### C26. Validate balanced brackets
```python
def balanced(s):
    pairs, stack = {")": "(", "]": "[", "}": "{"}, []
    for c in s:
        if c in "([{": stack.append(c)
        elif c in pairs:
            if not stack or stack.pop() != pairs[c]: return False
    return not stack
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. `ModuleNotFoundError: No module named 'x'`
Wrong interpreter or virtual environment, package not installed, wrong package name (`pip install pillow` vs `import PIL`), or running a script from the wrong directory. Check `which python`, `python -m pip list`, and use `python -m pip install` to match the interpreter.

### D2. `ImportError: cannot import name ... (circular import)`
Two modules import each other at top level. Move the import inside the function, restructure shared code into a third module, or use `TYPE_CHECKING` for type-only imports.

### D3. `IndentationError` / `TabError`
Mixed tabs and spaces or inconsistent indentation. Configure the editor for 4 spaces and use `ruff format`.

### D4. `TypeError: unsupported operand type(s)` / `'NoneType' object is not subscriptable`
A function returned `None` (often a missing `return`, or an in-place method such as `list.sort()` whose result was assigned). Print types, add type hints and a type checker.

### D5. `KeyError` on a dict
Use `.get()`, `setdefault`, `defaultdict`, or validate input. For nested access, check each level or use a schema.

### D6. Mutable default argument bug
State leaks between calls (Q38). Use `None` and create inside the function.

### D7. Late binding closures in loops
```python
funcs = [lambda: i for i in range(3)]
[f() for f in funcs]          # [2, 2, 2]
funcs = [lambda i=i: i for i in range(3)]   # [0, 1, 2]
```

### D8. Modifying a list while iterating over it
Items get skipped. Iterate over a copy, build a new list with a comprehension, or collect indexes to delete.

### D9. `UnicodeDecodeError` / `UnicodeEncodeError`
Wrong encoding. Open files with `encoding="utf-8"`, decode bytes explicitly, use `errors="replace"` carefully, and check the Windows default code page.

### D10. `RecursionError: maximum recursion depth exceeded`
Missing base case or deep recursion (default limit about 1000). Fix the base case, convert to iteration, or use an explicit stack. Raising `sys.setrecursionlimit` is a last resort.

### D11. `RuntimeError: dictionary changed size during iteration`
You added or removed keys during iteration. Iterate over `list(d)` or build a new dict.

### D12. `RuntimeWarning: coroutine ... was never awaited`
Forgot `await`. The coroutine object was created but never run. Add `await` or schedule with `asyncio.create_task`. Keep references to tasks, otherwise they may be garbage collected.

### D13. Event loop blocked in async code
`time.sleep`, `requests.get`, heavy CPU or sync DB drivers inside `async def` freeze all tasks. Use async libraries, `asyncio.to_thread`, or a process pool. Enable debug mode (`PYTHONASYNCIODEBUG=1`) to see slow callbacks.

### D14. Deadlock with threads
Two threads wait on each other's locks. Always acquire locks in a consistent order, use timeouts, minimize lock scope, or switch to queues.

### D15. `multiprocessing` hangs or fails on Windows/macOS
Missing `if __name__ == "__main__":` guard (spawn start method re-imports the module), unpicklable arguments (lambdas, open files), or large objects being copied. Use top-level functions and pass small data.

### D16. Memory keeps growing
Unbounded caches or lists, reference cycles, `lru_cache` on instance methods holding `self`, large global state, or accumulating logs. Use `tracemalloc` snapshots and bound caches.

### D17. Slow script
Profile with `cProfile`/`py-spy`. Common causes: `in` checks on lists, repeated string concatenation, nested loops, repeated file or DB calls, N+1 queries, and pandas row-by-row operations.

### D18. `SSL: CERTIFICATE_VERIFY_FAILED`
Missing CA bundle (common on macOS python.org installs or corporate proxies). Install certificates, set `SSL_CERT_FILE` or `REQUESTS_CA_BUNDLE`, and never disable verification in production.

### D19. Dependency conflicts
Incompatible version ranges. Use a resolver (`uv pip compile`, `pip-tools`, poetry), pin, check `pip check`, and isolate environments per project.

### D20. Works locally but not in Docker/CI
Different Python version, missing system libraries (for wheels building from source), architecture differences (ARM vs x86), timezone/locale, file path case, and environment variables. Pin versions and test in the same image.

### D21. Floating point surprises
`0.1 + 0.2 != 0.3`. Use `Decimal` for money, `math.isclose` for comparisons.

### D22. Timezone bugs
Naive vs aware datetimes cannot be compared (`TypeError`). Use aware UTC datetimes everywhere internally.

### D23. `pickle` or serialization errors
Lambdas, local functions and open resources cannot be pickled. Use top-level functions, JSON-compatible data, or `cloudpickle` when appropriate. Never unpickle untrusted data.

### D24. Test isolation problems
Tests pass alone but fail together due to shared global state, leftover DB rows, or patches not cleaned up. Use fixtures with teardown, transaction rollbacks, `monkeypatch`, and random test ordering (`pytest-randomly`).

### D25. `SyntaxError` after upgrading Python
New keywords or removed features (`async` as a name, removed modules like `distutils` in 3.12, `imp`). Read the "What's New" notes and run with warnings enabled.

### D26. Debugging method (say this in interviews)
Reproduce with a minimal case → read the full traceback bottom-up → check inputs and types → use `pdb`/`breakpoint()` or logging → form a hypothesis → fix → add a regression test → note the root cause.


---

# 🧩 Part 8: Tricky Questions

### T1. Is Python call-by-value or call-by-reference?
Neither exactly: it is **call by object reference** (call by assignment). The function receives a reference to the same object. Mutating a mutable argument affects the caller; rebinding the parameter name does not.
```python
def f(lst): lst.append(1); lst = [99]
a = []; f(a); print(a)       # [1]
```

### T2. Why does `a = b = []` cause problems?
Both names refer to the **same** list. Use `a, b = [], []`.

### T3. `[[0] * 3] * 3` vs a comprehension
```python
grid = [[0] * 3] * 3          # three references to the same row
grid[0][0] = 1                # all rows change
grid = [[0] * 3 for _ in range(3)]    # independent rows
```

### T4. Small integer caching and `is`
```python
a = 256; b = 256; a is b          # True (cached small ints)
a = 1000; b = 1000; a is b        # may be False (implementation detail)
```
Never use `is` for value comparison.

### T5. String interning
Some strings (identifiers, short literals) are interned, so `is` may be `True` by accident. Use `==`.

### T6. Why is `tuple` with a list inside "mutable"?
`t = ([1], 2); t[0].append(3)` works because the tuple holds a reference to a mutable list. The tuple itself did not change identity of its items. Such a tuple is not hashable.

### T7. `+=` on a tuple element
```python
t = ([1], 2)
t[0] += [2]       # raises TypeError but the list IS modified
```
`+=` first mutates the list in place, then tries to assign back to the tuple slot and fails.

### T8. `__hash__` and `__eq__`
Defining `__eq__` without `__hash__` makes instances unhashable (Python sets `__hash__ = None`). Equal objects must have equal hashes. Mutable objects should not be hashable.

### T9. `dict` ordering and `set` ordering
Dicts preserve insertion order (guaranteed since 3.7). Sets have no meaningful order, and string hashes are randomized per process.

### T10. `sorted` vs `.sort()` return values
`.sort()` returns `None`. `x = lst.sort()` makes `x` `None`.

### T11. Floating point `round`
`round(2.5) == 2` and `round(3.5) == 4` (banker's rounding: ties go to even). Use `Decimal` with `ROUND_HALF_UP` if needed.

### T12. `//` and `%` with negatives
`-7 // 2 == -4` (floors toward negative infinity) and `-7 % 2 == 1`. The identity `a == (a // b) * b + a % b` holds.

### T13. `and`/`or` return values, not booleans
`"" or "default"` returns `"default"`; `0 and 5` returns `0`. This enables `name = user_name or "guest"` but be careful with legitimate falsy values (`0`, `""`).

### T14. Chained comparisons
`1 < x < 10` works as `1 < x and x < 10` (x evaluated once). `a == b == c` and even `a < b > c` are legal.

### T15. Scope rules: LEGB
Local, Enclosing, Global, Built-in. Assigning to a name inside a function makes it local for the whole function, so reading it before assignment raises `UnboundLocalError`. Use `global` / `nonlocal` deliberately.

### T16. Class attribute vs instance attribute
```python
class A: items = []
a, b = A(), A(); a.items.append(1); b.items     # [1] (shared)
a.count = 1                                       # creates instance attribute
```

### T17. Why `super()` is not "the parent"
It follows the **MRO**, so in multiple inheritance it may call a sibling class. That is why cooperative classes should call `super().__init__(*args, **kwargs)` consistently.

### T18. `del` vs garbage collection
`del x` removes the name binding; the object is freed only when its reference count reaches zero.

### T19. `__del__` is unreliable
Called at an unpredictable time (or not at all at interpreter exit). Use context managers or `weakref.finalize` for cleanup.

### T20. Generators are single-use
After exhaustion, iterating again yields nothing. Convert to a list if you need multiple passes, or create a new generator.

### T21. `zip` stops at the shortest
Silent data loss. Use `zip(a, b, strict=True)` (3.10+) or `itertools.zip_longest`.

### T22. `finally` overrides `return`
```python
def f():
    try: return 1
    finally: return 2
f()       # 2
```
Avoid `return` in `finally`; it can swallow exceptions.

### T23. Catching `Exception` vs `BaseException`
`except Exception` does not catch `KeyboardInterrupt`, `SystemExit`, `GeneratorExit`. A bare `except:` catches them all, which blocks Ctrl+C.

### T24. `async` functions are lazy
Calling `fetch()` returns a coroutine object; nothing runs until it is awaited or scheduled.

### T25. `asyncio.gather` and exceptions
By default, the first exception propagates, but other tasks continue running. Use `return_exceptions=True` or `TaskGroup` (cancels siblings).

### T26. Threads and the GIL: is `list.append` thread-safe?
Single operations like `append` are effectively atomic in CPython, but compound operations (`x += 1`, check-then-act) are not. Do not rely on the GIL for correctness; free-threaded builds make this more important.

### T27. Why is `import` side-effectful?
Importing executes module top-level code once and caches it in `sys.modules`. Heavy work at import time slows startup and complicates tests.

### T28. `is` with `NaN`
`float("nan") == float("nan")` is `False`. Use `math.isnan`. Also `nan in [nan]` can be `True` because containers check identity first.

### T29. Default `encoding`
`open()` without `encoding` uses the locale encoding, which differs by OS (Windows). Always pass `encoding="utf-8"`.

### T30. `copy` of dict with `dict(d)` is shallow
Nested mutable values are shared. Use `copy.deepcopy` when needed.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

| Question | Short answer |
|---|---|
| Who created Python? | Guido van Rossum |
| Typing discipline? | Dynamic and strong |
| Default implementation? | CPython |
| Compile output? | Bytecode (`.pyc`) |
| Style guide? | PEP 8 |
| Zen of Python? | `import this` |
| Immutable sequence? | `tuple` |
| Unique unordered items? | `set` |
| Key-value mapping? | `dict` |
| Ordered double-ended queue? | `collections.deque` |
| Count items easily? | `collections.Counter` |
| Missing-key defaults? | `defaultdict` |
| Lazy sequence producer? | generator (`yield`) |
| Resource cleanup? | `with` / context manager |
| Wrap function behavior? | decorator |
| Fixed attributes, less memory? | `__slots__` |
| Quick data class? | `@dataclass` |
| Runtime validation? | pydantic |
| Static type checker? | mypy / pyright |
| Formatter/linter? | ruff / black |
| Test framework? | pytest |
| Package installer? | pip / uv |
| Isolate dependencies? | virtual environment |
| Project config file? | `pyproject.toml` |
| Parallel CPU work? | `multiprocessing` / `ProcessPoolExecutor` |
| Concurrent I/O? | `asyncio` or threads |
| Run async code? | `asyncio.run(main())` |
| Concurrent coroutines? | `asyncio.gather` / `TaskGroup` |
| Memoize? | `functools.lru_cache` / `cache` |
| Path handling? | `pathlib.Path` |
| Secure random? | `secrets` |
| Time measurement? | `time.perf_counter()` |
| Profile CPU? | `cProfile`, `py-spy` |
| Profile memory? | `tracemalloc`, `memray` |
| Debugger? | `breakpoint()` / `pdb` |
| Format strings? | f-strings |
| Swap variables? | `a, b = b, a` |
| Check type? | `isinstance(x, T)` |
| Value vs identity? | `==` vs `is` |
| Entry guard? | `if __name__ == "__main__":` |
| What is `self`? | The instance passed to instance methods |
| What is MRO? | Method resolution order (C3) |
| What is GIL? | Lock allowing one thread to run bytecode at a time |

---

# 🎤 Part 10: Project / Behavioral Questions

> Use **S**ituation, **T**ask, **A**ction, **R**esult. Prepare real numbers.

### B1. Tell me about a performance problem you solved in Python.
**Sample (Ritesh Kumar):** *Situation:* A nightly report job took 6 hours. *Task:* Finish under 1 hour. *Action:* Profiled with `cProfile`, found a nested loop doing `in` checks on lists and row-by-row pandas updates. Replaced lists with sets, vectorized the transformations, and read data in chunks. *Result:* Runtime dropped to 28 minutes and memory use fell by 60%.

### B2. A production incident you handled.
Describe detection, mitigation (rollback/restart), root cause (e.g., blocking call inside async code froze the event loop), the fix (async client plus timeout), tests, alerts, and the post-mortem.

### B3. How do you ensure code quality in a Python team?
Ruff and mypy in CI, pytest with coverage targets, pre-commit hooks, code review checklists (typing, error handling, resource cleanup), dependency locking, and a service template.

### B4. A time you simplified a complex codebase.
Show how you added tests first, removed dead code, introduced clear module boundaries, and measured outcomes (build time, bug rate, onboarding time).

### B5. How do you choose between libraries/frameworks?
Evaluate maintenance, community, license, security history, performance, and fit; run a small spike; document the decision.

### B6. Mentoring juniors in Python.
Teach the data model (mutability, references), debugging with tracebacks and `pdb`, testing habits, and idiomatic Python (comprehensions, generators, context managers). Review code with kindness and specifics.

### B7. Upgrade/migration experience (Python 2→3, 3.8→3.12, sync→async).
Describe incremental steps, compatibility tooling, tests as a safety net, canary deploys, and measured results.

### B8. How do you stay current?
Release notes (What's New), PEPs, PyCon talks, package changelogs, and small experiments with new features (for example the `match` statement, `TaskGroup`, `uv`).

---

# 📚 Part 11: Complete Coverage (Language + Standard Library + Tooling + Mixed)

## Language features
Variables and types, operators, control flow, functions (positional-only `/`, keyword-only `*`), closures, decorators, generators, comprehensions, classes, inheritance, MRO, dunder methods, properties, descriptors, metaclasses, `__slots__`, dataclasses, enums, exceptions and exception groups, context managers, `match`, walrus operator, f-strings, type hints, async/await.

## Standard library (high-value modules)
`os`, `sys`, `pathlib`, `shutil`, `glob`, `io`, `json`, `csv`, `sqlite3`, `re`, `datetime`, `zoneinfo`, `time`, `math`, `statistics`, `decimal`, `fractions`, `random`, `secrets`, `hashlib`, `hmac`, `base64`, `uuid`, `collections`, `itertools`, `functools`, `operator`, `heapq`, `bisect`, `array`, `enum`, `dataclasses`, `typing`, `abc`, `contextlib`, `copy`, `pickle`, `logging`, `argparse`, `subprocess`, `threading`, `multiprocessing`, `concurrent.futures`, `asyncio`, `queue`, `socket`, `http.server`, `urllib`, `email`, `unittest`, `doctest`, `tempfile`, `zipfile`, `gzip`, `tomllib`, `warnings`, `weakref`, `gc`, `inspect`, `importlib`, `traceback`, `tracemalloc`, `timeit`, `cProfile`.

## Tooling and ecosystem
`pip`, `uv`, `poetry`, `pipenv`, `conda`, `venv`, `pyenv`, `ruff`, `black`, `mypy`, `pyright`, `pytest`, `tox`/`nox`, `coverage`, `pre-commit`, `sphinx`/`mkdocs`, `build`/`twine`, Docker, Jupyter, IDEs (PyCharm, VS Code).
- **Web:** Django, Flask, FastAPI, Starlette, aiohttp.
- **Data/AI:** NumPy, pandas, Polars, SciPy, scikit-learn, PyTorch, TensorFlow, Hugging Face.
- **DB:** SQLAlchemy, psycopg, asyncpg, pymongo, redis-py, Alembic.
- **Async/queues:** Celery, Dramatiq, Arq, aio-pika, kafka-python/confluent-kafka.
- **Validation:** pydantic, attrs, marshmallow.
- **HTTP:** requests, httpx, aiohttp, tenacity.

## Mixed topics
Algorithms and data structures, concurrency model, packaging, testing strategy, security, performance, deployment (Docker, Gunicorn/Uvicorn), observability, and data engineering basics.

---

# 🔬 Part 12: Python Internals

### I1. From source to execution
Source → tokenizer → parser (PEG parser since 3.9) → AST → compiler → bytecode (code objects) → evaluated by the CPython virtual machine's eval loop. Inspect with `dis.dis(func)`. Python 3.11+ has the **specializing adaptive interpreter**, which speeds hot bytecode.

### I2. Object model
Everything is an object: it has an identity (`id()`), a type, and a value. Objects are `PyObject` structs with a reference count and type pointer. Types are objects too (`type(int)` is `type`).

### I3. Reference counting and the cycle collector
Each assignment/argument increments the count; going out of scope decrements it. At zero, memory is freed. Cycles (objects referencing each other) are found by the generational GC. Weak references do not increase the count.

### I4. Memory allocator
Small objects (≤ 512 bytes) use `pymalloc` arenas/pools for speed; larger ones go to the system `malloc`. Free memory may not return to the OS immediately.

### I5. The GIL
A mutex protecting interpreter state. A thread holds it while running bytecode and releases it periodically (switch interval, default 5 ms) and around blocking I/O. C extensions can release it for long computations. Per-interpreter GILs (3.12) and the free-threaded build (3.13, experimental) are steps toward true parallel threads.

### I6. Name lookup and namespaces
Local variables are array slots in the frame (fast). Globals and builtins are dict lookups. Attribute access checks type dict and instance dict via the descriptor protocol. Caching in the specializing interpreter reduces lookup cost.

### I7. Import system
`import x` looks in `sys.modules`, then uses finders on `sys.meta_path` (path-based finder uses `sys.path`), loads the module, executes it, and stores it. Bytecode cache lives in `__pycache__`.

### I8. How `dict` works
An open-addressing hash table with insertion-ordered compact entries. Keys must be hashable. Average O(1) lookup; resizing when load grows. Key-sharing dictionaries save memory for instance `__dict__`s.

### I9. How `list` works
A dynamic array of pointers with over-allocation, giving amortized O(1) append. Insert/delete at the front is O(n).

### I10. Generators internally
A generator holds its own frame; `next()` resumes it until the next `yield`. Coroutines use the same mechanism, driven by the event loop.

### I11. Asyncio event loop
A selector-based loop (epoll/kqueue/IOCP) schedules callbacks and tasks. `await` suspends a coroutine until the awaited future completes; the loop runs other ready tasks meanwhile. `uvloop` can replace the default loop on Linux/macOS for more speed.

### I12. Exceptions
Zero-cost try blocks since 3.11 (no setup cost when no exception is raised). Tracebacks link frames; exception chaining uses `__cause__` and `__context__`.

---

# 📊 Part 13: Reference Tables

### Built-in type cheat table
| Type | Literal | Mutable | Hashable |
|---|---|---|---|
| int/float/bool/str | `1`, `1.5`, `True`, `"x"` | No | Yes |
| tuple | `(1, 2)` | No | If items are hashable |
| list | `[1, 2]` | Yes | No |
| dict | `{"a": 1}` | Yes | No |
| set | `{1, 2}` | Yes | No |
| frozenset | `frozenset({1})` | No | Yes |
| bytes | `b"x"` | No | Yes |

### Concurrency choice table
| Workload | Best tool |
|---|---|
| Many network calls | `asyncio` + async client, or threads |
| Blocking legacy library | `ThreadPoolExecutor` / `asyncio.to_thread` |
| CPU-heavy Python code | `ProcessPoolExecutor` |
| Numeric arrays | NumPy / Polars (native, vectorized) |
| Scheduled/background work | Celery / Arq / Dramatiq |

### Common exceptions and causes
| Exception | Typical cause |
|---|---|
| `TypeError` | Wrong type or argument count |
| `ValueError` | Right type, bad value |
| `KeyError` | Missing dict key |
| `IndexError` | Index out of range |
| `AttributeError` | Missing attribute / `None` object |
| `ImportError` | Cannot import name / circular import |
| `RecursionError` | Too deep recursion |
| `StopIteration` | Iterator exhausted |
| `UnboundLocalError` | Local used before assignment |
| `RuntimeError` | Generic runtime problem (e.g., dict changed size) |

### Packaging tools
| Tool | Purpose |
|---|---|
| `pip` | Install packages |
| `uv` | Very fast installer/resolver/project manager |
| `poetry` | Dependency management and packaging |
| `pip-tools` | Compile pinned requirements |
| `hatch`/`setuptools` | Build backends |
| `build` + `twine` | Build and upload distributions |

### Python version timeline (verify at python.org/downloads)
| Feature | Version |
|---|---|
| f-strings | 3.6 |
| Dicts ordered by guarantee | 3.7 |
| Walrus `:=`, positional-only params | 3.8 |
| Dict union operator, `zoneinfo` | 3.9 |
| `match`, new union type syntax | 3.10 |
| `TaskGroup`, `tomllib`, faster CPython, exception groups | 3.11 |
| New generics syntax `class Box[T]`, `type` statement, better error messages | 3.12 |
| Experimental free-threaded build and JIT, improved REPL | 3.13 |


---

# 🔮 Part 14: Output & Prediction Questions

### O1. Mutable default
```python
def add(x, items=[]):
    items.append(x); return items
print(add(1), add(2))
```
**Output:** `[1, 2] [1, 2]`. Both calls share the same list (and both prints show its final state since the same object is printed after both calls).

### O2. Late binding closures
```python
fs = [lambda: i for i in range(3)]
print([f() for f in fs])
```
**Output:** `[2, 2, 2]`.

### O3. List multiplication
```python
a = [[0] * 2] * 2
a[0][0] = 5
print(a)
```
**Output:** `[[5, 0], [5, 0]]`.

### O4. `is` and small ints
```python
a, b = 256, 256
c, d = 1000, 1000
print(a is b, c == d)
```
**Output:** `True True`. (`c is d` is implementation-dependent.)

### O5. Slicing
```python
s = "Python"
print(s[1:4], s[::-1], s[-2:], s[10:])
```
**Output:** `yth nohtyP on ` (last value is an empty string).

### O6. Dict ordering and update
```python
d = {"a": 1}; d["b"] = 2; d["a"] = 3
print(d)
```
**Output:** `{'a': 3, 'b': 2}`. Updating an existing key keeps its original position.

### O7. `sort` return value
```python
x = [3, 1, 2].sort()
print(x)
```
**Output:** `None`.

### O8. `finally` with return
```python
def f():
    try: return "try"
    finally: print("cleanup")
print(f())
```
**Output:** `cleanup` then `try`.

### O9. Generator exhaustion
```python
g = (x for x in range(3))
print(list(g), list(g))
```
**Output:** `[0, 1, 2] []`.

### O10. `and`/`or`
```python
print(0 or "default", "" and "x", [] or None)
```
**Output:** `default  None` (the middle value is an empty string).

### O11. Floating point
```python
print(0.1 + 0.2 == 0.3, round(2.5), round(3.5))
```
**Output:** `False 2 4`.

### O12. Integer division and modulo with negatives
```python
print(-7 // 2, -7 % 2, 7 // -2)
```
**Output:** `-4 1 -4`.

### O13. Scope
```python
x = 10
def f():
    print(x)
    x = 5
f()
```
**Output:** `UnboundLocalError`. Assigning `x` makes it local for the whole function.

### O14. Class attributes
```python
class A:
    items = []
a, b = A(), A()
a.items.append(1)
print(b.items)
```
**Output:** `[1]`.

### O15. `zip` lengths
```python
print(list(zip([1, 2, 3], "ab")))
```
**Output:** `[(1, 'a'), (2, 'b')]`.

### O16. Set operations
```python
print({1, 2, 3} & {2, 3, 4}, {1, 2} | {2, 5}, {1, 2, 3} - {2})
```
**Output:** `{2, 3} {1, 2, 5} {1, 3}`.

### O17. Copying
```python
import copy
a = [[1], [2]]
b = copy.copy(a); c = copy.deepcopy(a)
a[0].append(9)
print(b[0], c[0])
```
**Output:** `[1, 9] [1]`.

### O18. Async ordering
```python
import asyncio
async def job(n):
    await asyncio.sleep(0.1 * (3 - n)); print(n)
async def main():
    await asyncio.gather(job(1), job(2), job(3))
asyncio.run(main())
```
**Output:** `3, 2, 1`. Shorter sleeps finish first; the tasks run concurrently.

### O19. String immutability and `join`
```python
print("-".join(["a", "b", "c"]), "abc".replace("b", "X"))
```
**Output:** `a-b-c aXc`.

### O20. Truthiness
```python
print(bool([]), bool([0]), bool(None), bool("False"))
```
**Output:** `False True False True`.

---

# ✅ Part 15: MCQs

**1.** Which is immutable?
A) list B) dict C) tuple D) set

**2.** What does `//` do?
A) True division B) Floor division C) Modulo D) Power

**3.** Which keyword defines a generator function?
A) `return` B) `yield` C) `async` D) `lambda`

**4.** Output of `type(3 / 2)`?
A) int B) float C) decimal D) number

**5.** Which module is best for modern path handling?
A) `os.path` only B) `pathlib` C) `sys` D) `glob` only

**6.** What does `GIL` stand for?
A) General Interpreter Lock B) Global Interpreter Lock C) Generic Instance Lock D) Global Import Lock

**7.** Best choice for CPU-bound parallel work in CPython (traditional build)?
A) threading B) multiprocessing C) asyncio D) `time.sleep`

**8.** Which compares identity?
A) `==` B) `is` C) `in` D) `=`

**9.** What happens with `def f(x, items=[])`?
A) New list per call B) One shared list across calls C) Syntax error D) List is immutable

**10.** Which statement closes files automatically?
A) `try` B) `with` C) `for` D) `assert`

**11.** Which is the correct way to check for `None`?
A) `x == None` B) `x is None` C) `x = None` D) `not x` always

**12.** Which creates a virtual environment?
A) `pip venv` B) `python -m venv .venv` C) `python --env` D) `venv install`

**13.** `__init__` is:
A) Destructor B) Constructor/initializer C) Static method D) Iterator

**14.** Which decorator makes a method a class method?
A) `@static` B) `@classmethod` C) `@property` D) `@cached`

**15.** Which is an ordered mapping in modern Python?
A) set B) dict C) frozenset D) range

**16.** What does `*args` capture?
A) Keyword arguments B) Extra positional arguments C) Default values D) Return values

**17.** Which function returns an iterator of index-value pairs?
A) `zip` B) `enumerate` C) `range` D) `map`

**18.** Which tool is a fast linter/formatter?
A) ruff B) pip C) venv D) gunicorn

**19.** Which keyword awaits a coroutine?
A) `yield` B) `await` C) `wait` D) `async` only

**20.** Which is the right exception for a missing dict key?
A) IndexError B) KeyError C) ValueError D) NameError

**21.** What does `functools.wraps` do?
A) Adds caching B) Preserves wrapped function metadata C) Runs in parallel D) Types arguments

**22.** Which is safest for generating tokens?
A) `random` B) `secrets` C) `time` D) `uuid1` only

**23.** Output of `bool("")`?
A) True B) False C) Error D) None

**24.** Which store is best for money calculations?
A) float B) `Decimal` C) complex D) str

**25.** What is the MRO?
A) Memory release order B) Method resolution order C) Module run order D) Main runtime object

**26.** Which standard module provides `Counter`?
A) `itertools` B) `collections` C) `functools` D) `statistics`

**27.** Which runs an async entry point?
A) `await main()` at top-level script B) `asyncio.run(main())` C) `main().start()` D) `async main()`

**28.** What does `pip freeze` output?
A) Disk usage B) Installed packages with versions C) Python version only D) Test results

**29.** Which is the Python packaging configuration standard file?
A) `setup.cfg` only B) `pyproject.toml` C) `package.json` D) `Makefile`

**30.** What happens when you call `list.sort()`?
A) Returns a new sorted list B) Sorts in place and returns `None` C) Sorts a copy D) Raises an error

**31.** Which block runs only when no exception occurred?
A) `finally` B) `else` C) `except` D) `try`

**32.** Which of these is hashable?
A) list B) dict C) tuple of ints D) set

**33.** Which structure gives O(1) appends and pops at both ends?
A) list B) deque C) tuple D) set

**34.** What does `__slots__` reduce?
A) CPU cache B) Per-instance memory use C) Import time D) Disk size

**35.** Which library validates data using type hints at runtime?
A) pydantic B) pytest C) pip D) black

**36.** Which is not a built-in numeric type?
A) int B) float C) complex D) decimal (as a builtin)

**37.** `match` statement was added in:
A) 3.6 B) 3.8 C) 3.10 D) 3.12

**38.** Which approach fixes a blocked event loop caused by a sync function?
A) `asyncio.to_thread` B) Add more `print` C) `gc.collect()` D) Use `global`

**39.** Which command runs tests with pytest?
A) `python test` B) `pytest` C) `pip test` D) `unittest run`

**40.** Best practice for logging in libraries:
A) `print` B) `logging.getLogger(__name__)` C) Write to files directly D) Use `sys.exit`

### Answer key
1-C, 2-B, 3-B, 4-B, 5-B, 6-B, 7-B, 8-B, 9-B, 10-B, 11-B, 12-B, 13-B, 14-B, 15-B, 16-B, 17-B, 18-A, 19-B, 20-B, 21-B, 22-B, 23-B, 24-B, 25-B, 26-B, 27-B, 28-B, 29-B, 30-B, 31-B, 32-C, 33-B, 34-B, 35-A, 36-D, 37-C, 38-A, 39-B, 40-B

---

# ⚠️ Part 16: Common Mistakes

> Each mistake has four parts: ❌ wrong code, 🤔 why it is a problem, ✅ correct code, 💬 what to say in an interview.

### Mistake 1: Mutable default arguments
❌
```python
def add_tag(tag, tags=[]):
    tags.append(tag)
    return tags
```
🤔 The default list is created once and shared by every call, so data leaks between calls.
✅
```python
def add_tag(tag, tags=None):
    tags = [] if tags is None else tags
    tags.append(tag)
    return tags
```
💬 "Defaults are evaluated once at definition time, so I use `None` as a sentinel."

### Mistake 2: Bare `except:`
❌
```python
try:
    process()
except:
    pass
```
🤔 It hides every bug and even catches `KeyboardInterrupt`, so you cannot stop the program or see failures.
✅
```python
try:
    process()
except ValueError:
    log.warning("bad value", exc_info=True)
```
💬 "I catch specific exceptions, log them with the traceback, and re-raise what I cannot handle."

### Mistake 3: Using `==` with `None` or `is` with values
❌
```python
if x == None: ...
if name is "admin": ...
```
🤔 `==` can be overridden; `is` on strings and ints depends on interpreter details.
✅
```python
if x is None: ...
if name == "admin": ...
```
💬 "`is` for identity and singletons, `==` for values."

### Mistake 4: Modifying a list while iterating
❌
```python
for n in nums:
    if n % 2 == 0:
        nums.remove(n)
```
🤔 Indexes shift, so elements are skipped.
✅
```python
nums = [n for n in nums if n % 2 != 0]
```
💬 "I build a new collection instead of mutating the one I'm looping over."

### Mistake 5: Blocking calls inside async code
❌
```python
async def handler():
    data = requests.get(url).json()     # blocks the event loop
    time.sleep(1)
```
🤔 One blocking call freezes every other task on the loop.
✅
```python
async def handler():
    async with httpx.AsyncClient(timeout=5) as c:
        data = (await c.get(url)).json()
    await asyncio.sleep(1)
```
💬 "In async code I use async libraries or `to_thread` for blocking work."

### Mistake 6: Forgetting `await`
❌
```python
async def main():
    result = fetch_data()      # coroutine object, not data
```
🤔 The coroutine never runs; you get a warning and wrong results.
✅
```python
result = await fetch_data()
```
💬 "Calling an async function only creates a coroutine; it has to be awaited or scheduled."

### Mistake 7: Using threads for CPU-bound work
❌
```python
with ThreadPoolExecutor() as pool:
    list(pool.map(heavy_math, data))
```
🤔 The GIL means no speedup for pure-Python CPU work.
✅
```python
with ProcessPoolExecutor() as pool:
    list(pool.map(heavy_math, data, chunksize=1000))
```
💬 "Threads for I/O, processes for CPU, vectorized native code when possible."

### Mistake 8: Building SQL with f-strings
❌
```python
cur.execute(f"SELECT * FROM users WHERE email = '{email}'")
```
🤔 This allows SQL injection.
✅
```python
cur.execute("SELECT * FROM users WHERE email = %s", (email,))
```
💬 "Always parameterized queries."

### Mistake 9: Opening files without `with` or encoding
❌
```python
f = open("data.txt")
text = f.read()
```
🤔 The file may never close on errors, and the default encoding varies by OS.
✅
```python
with open("data.txt", encoding="utf-8") as f:
    text = f.read()
```
💬 "Context managers guarantee cleanup, and I always set the encoding."

### Mistake 10: Not using virtual environments or pinned dependencies
❌
```bash
pip install requests       # globally, unpinned
```
🤔 Projects conflict with each other and builds differ between machines.
✅
```bash
python -m venv .venv && source .venv/bin/activate
uv pip compile pyproject.toml -o requirements.txt && pip install -r requirements.txt
```
💬 "Isolated environments plus a lockfile give reproducible builds."

### Mistake 11: Using `print` instead of logging
❌
```python
print("user created", user_id)
```
🤔 No levels, timestamps, structure or routing in production.
✅
```python
log = logging.getLogger(__name__)
log.info("user created id=%s", user_id)
```
💬 "I use structured logging with levels and correlation IDs."

### Mistake 12: Naive datetimes
❌
```python
now = datetime.utcnow()
```
🤔 Naive timestamps cause timezone bugs and `utcnow` is deprecated.
✅
```python
now = datetime.now(timezone.utc)
```
💬 "Store aware UTC datetimes, convert only for display."

### Mistake 13: Floats for money
❌
```python
total = 0.1 + 0.2     # 0.30000000000000004
```
🤔 Binary floating point cannot represent many decimals exactly.
✅
```python
from decimal import Decimal
total = Decimal("0.1") + Decimal("0.2")
```
💬 "Money uses `Decimal` or integer cents."

### Mistake 14: Unbounded caches and global state
❌
```python
cache = {}
def get(k):
    cache[k] = load(k)
    return cache[k]
```
🤔 Memory grows forever, and global state complicates tests and concurrency.
✅
```python
from cachetools import TTLCache
cache = TTLCache(maxsize=10_000, ttl=300)
```
💬 "Every cache gets a size limit and an expiry."

### Mistake 15: No timeouts on network calls
❌
```python
requests.get(url)
```
🤔 `requests` has no default timeout, so a slow server can hang your program forever.
✅
```python
requests.get(url, timeout=(3.05, 10))
```
💬 "Every network call has an explicit timeout and a retry policy."

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

### Signal table 1: Answer quality
| Topic | Weak answer | Strong answer |
|---|---|---|
| "What is the GIL?" | "It makes Python slow." | "A lock so only one thread runs bytecode at a time; I/O releases it, so threads help I/O-bound work; for CPU work I use processes or native code; free-threaded builds are emerging." |
| "List vs tuple?" | "Tuple is immutable." | "Immutability enables hashing and safe sharing; tuples suit fixed records, lists suit growing collections; mutability inside a tuple can still bite." |
| "How do decorators work?" | "They add features." | "A decorator is a callable that takes a function and returns a replacement; `functools.wraps` keeps metadata; arguments need an extra nesting layer." |
| "sync vs async?" | "Async is faster." | "Async improves concurrency for I/O-bound work, not CPU speed; one blocking call stalls the loop; I choose based on workload and library support." |
| "How do you structure a project?" | "A few files." | "src layout, `pyproject.toml`, typed modules, tests, linting, lockfile, Docker, CI, and clear layers." |

### Signal table 2: Behaviors that stand out
| Weak behavior | Strong behavior |
|---|---|
| Writes scripts only | Writes tested, typed, packaged code |
| Guesses at slowness | Profiles with `py-spy` / `cProfile` first |
| Catches all exceptions | Catches specific ones, chains with `from`, logs context |
| Ignores dependencies | Pins, audits and updates them regularly |
| Uses libraries blindly | Knows the standard library and when it is enough |

### Signal table 3: Phrases that show depth
- "Python passes object references; mutability decides what the caller sees."
- "I profile before optimizing, and I check the algorithm before the code."
- "Threads for I/O, processes for CPU, vectorization for numbers."
- "Context managers and `finally` guarantee cleanup."
- "I add types at module boundaries and run mypy in CI."
- "Timeouts, retries with jitter and idempotency on every external call."

### Signal table 4: Questions to ask the interviewer
- Which Python versions and tools (uv, poetry, ruff, mypy) does the team standardize on?
- How do you deploy (containers, serverless) and observe services?
- How do you balance sync and async code, and how are background jobs handled?
- What are the testing and code review expectations?

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### 1. The 30-second explanation
Python is a dynamically but strongly typed, garbage-collected language that compiles to bytecode run by the CPython VM. Everything is an object; names are references. It is great for productivity, glue code, data and AI. Its weakness is CPU-bound performance and the GIL, which you work around with processes, native libraries and async I/O.

### 2. Data model essentials
- Names refer to objects; assignment never copies.
- Mutable: list, dict, set. Immutable: int, str, tuple, frozenset.
- Hashable objects can be dict keys and set members.
- `==` values, `is` identity.
- Copy: shallow `copy.copy`, deep `copy.deepcopy`.

### 3. Language toolbox
Comprehensions · generators · decorators · context managers · dataclasses · type hints · `match` · f-strings · `*args/**kwargs` · unpacking · walrus.

### 4. Concurrency cheat table
| Need | Use |
|---|---|
| Lots of network I/O | `asyncio` (or threads) |
| Blocking library | `ThreadPoolExecutor`, `asyncio.to_thread` |
| CPU-bound | `ProcessPoolExecutor`, NumPy, native code |
| Queue of jobs | Celery / Arq / Dramatiq |
| Limit concurrency | `Semaphore`, bounded queues |

### 5. Production checklist
- [ ] Supported Python version, locked dependencies
- [ ] `pyproject.toml`, `src/` layout
- [ ] ruff + mypy/pyright + pytest in CI
- [ ] Config from environment, validated (pydantic-settings)
- [ ] Structured logging with correlation IDs
- [ ] Timeouts, retries with backoff, circuit breakers
- [ ] No blocking calls in async code
- [ ] Parameterized SQL, no `eval`/`pickle` on untrusted data
- [ ] Health checks and graceful shutdown
- [ ] Metrics and tracing; Sentry for errors
- [ ] Slim, non-root Docker image
- [ ] Security scans (`pip-audit`, bandit) and dependency updates

### 6. Debug toolbox
| Symptom | Tool |
|---|---|
| Wrong behavior | `breakpoint()`, `pdb`, logging |
| Slow code | `cProfile`, `py-spy`, `line_profiler` |
| Memory growth | `tracemalloc`, `memray`, `objgraph` |
| Hang | `faulthandler`, `py-spy dump` |
| Async stalls | `PYTHONASYNCIODEBUG=1` |

### 7. Top 20 one-liners to memorize
1. Names are references; objects have types.
2. Mutable defaults are evaluated once.
3. `is` for `None`, `==` for values.
4. Use `with` for resources.
5. Specific `except`, never bare.
6. Generators save memory.
7. `functools.wraps` in every decorator.
8. The GIL limits CPU threads, not I/O threads.
9. Threads for I/O, processes for CPU.
10. Never block the event loop.
11. Type hints are checked by tools, not by Python.
12. `Decimal` for money.
13. Aware UTC datetimes.
14. `secrets` for tokens.
15. Parameterized queries.
16. Timeouts on every network call.
17. Virtual environment plus lockfile.
18. `pathlib` over string paths.
19. Profile before optimizing.
20. Tests with pytest, fixtures and parametrization.

### 8. The 60-second answer: "Why Python?"
"Python gives very high productivity, a huge ecosystem and readable code, which makes it the default for data, AI, automation and many backends. I use type hints, pytest, ruff and locked dependencies so it stays maintainable at scale. For CPU-heavy parts I rely on NumPy or native extensions, and for I/O concurrency I use asyncio or worker processes."

### 9. Final revision order
Data model (mutability, references) → functions and decorators → iterators and generators → OOP and dunder methods → exceptions and context managers → concurrency (GIL, asyncio) → packaging, typing and testing → performance and debugging stories.

