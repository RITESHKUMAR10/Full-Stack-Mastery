# Java Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **Java 17, 21 and 25 (LTS releases)**. Modern features (records, sealed classes, pattern matching, switch expressions, text blocks, virtual threads, generational ZGC) are marked with the version where they became final. Preview features and anything newer than Java 21 are marked "verify in the official docs (openjdk.org / docs.oracle.com)". Sample name in examples: **Ritesh Kumar**.
> Spring Boot, Hibernate-level topics and microservices are in file 017. This file covers the language, JVM, collections, concurrency, I/O, tooling, performance and production practice.

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
- [Part 11: Complete Coverage (Language + Libraries + Tooling + Mixed)](#-part-11-complete-coverage-language--libraries--tooling--mixed)
- [Part 12: JVM Internals](#-part-12-jvm-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is Java?
A general-purpose, object-oriented, statically typed, class-based language that compiles to **bytecode** and runs on the **Java Virtual Machine (JVM)**. Its slogan is "write once, run anywhere": the same bytecode runs on any OS with a JVM. It has automatic memory management (garbage collection) and a huge ecosystem.

### Q2. JDK vs JRE vs JVM *(Must-know)*
| | What it is |
|---|---|
| **JVM** | Virtual machine that loads bytecode, verifies it, and executes it (interpreter + JIT) |
| **JRE** | JVM + core class libraries (needed to run programs) |
| **JDK** | JRE + development tools (`javac`, `jar`, `jshell`, `jcmd`, ...) |

Modern distributions ship only the JDK (OpenJDK builds: Temurin, Corretto, Zulu, Oracle JDK).

### Q3. How does a Java program run?
`Hello.java` → `javac` → `Hello.class` (bytecode) → JVM: class loader → bytecode verifier → interpreter and JIT compiler → machine code. Since Java 11 you can run a single file directly: `java Hello.java`.
```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, Ritesh Kumar");
    }
}
```

### Q4. What are the primitive types?
`byte` (8 bit), `short` (16), `int` (32), `long` (64), `float` (32), `double` (64), `char` (16, UTF-16 unit), `boolean`. Defaults: numbers `0`, `boolean` `false`, `char` `'\u0000'`, references `null`. Each has a wrapper class (`Integer`, `Long`, `Double`, `Boolean`, ...).

### Q5. Primitive vs wrapper types
Primitives hold values directly (fast, no `null`). Wrappers are objects (can be `null`, used in generics and collections). **Autoboxing** converts automatically (`int` ↔ `Integer`), which can hide performance cost and `NullPointerException` on unboxing.

### Q6. What is `String` and why is it immutable?
`String` objects cannot change after creation. Benefits: thread safety, safe as hash keys (hash cached), string pool sharing, security (class names, paths). Modifications create new objects.
```java
String s = "Ritesh";
s = s.concat(" Kumar");   // new object; old one unchanged
```

### Q7. `String` vs `StringBuilder` vs `StringBuffer`
| | Mutable | Thread-safe | Use |
|---|---|---|---|
| String | No | Yes (immutable) | Constants, keys |
| StringBuilder | Yes | No | Building strings in loops (default choice) |
| StringBuffer | Yes | Yes (synchronized) | Legacy; rarely needed |

### Q8. String pool, `==` vs `equals`
```java
String a = "java";
String b = "java";
String c = new String("java");
a == b;          // true  (same pooled object)
a == c;          // false (different objects)
a.equals(c);     // true  (same content)
```
Use `equals` for content. `intern()` returns the pooled instance.

### Q9. What are classes and objects?
A class is a blueprint; an object is an instance with state (fields) and behavior (methods). Created with `new`.
```java
class User {
    private final String name;
    User(String name) { this.name = name; }
    String getName() { return name; }
}
User u = new User("Ritesh Kumar");
```

### Q10. The four OOP pillars *(Must-know)*
- **Encapsulation:** hide state behind methods (`private` fields + getters).
- **Inheritance:** a class reuses another (`extends`).
- **Polymorphism:** one interface, many behaviors (overloading at compile time, overriding at runtime).
- **Abstraction:** expose what, hide how (abstract classes, interfaces).

### Q11. Overloading vs overriding
Overloading: same method name, different parameters, resolved at compile time. Overriding: subclass redefines a superclass method with the same signature, resolved at runtime (dynamic dispatch). Use `@Override` to catch mistakes.

### Q12. Constructors
Special methods that initialize objects; same name as the class, no return type. If you define none, the compiler adds a no-arg default constructor. `this(...)` calls another constructor in the same class; `super(...)` calls the parent constructor (must be the first statement, with flexible rules in newer previews).

### Q13. `static`, `final`, `finally`, `finalize` *(Must-know)*
- `static`: belongs to the class, not an instance.
- `final`: variable cannot be reassigned; method cannot be overridden; class cannot be extended.
- `finally`: block that runs after `try/catch` for cleanup.
- `finalize()`: deprecated for removal; do not use (use try-with-resources or `Cleaner`).

### Q14. Access modifiers
| Modifier | Class | Package | Subclass | World |
|---|---|---|---|---|
| `public` | ✓ | ✓ | ✓ | ✓ |
| `protected` | ✓ | ✓ | ✓ | ✗ |
| (default) | ✓ | ✓ | ✗ | ✗ |
| `private` | ✓ | ✗ | ✗ | ✗ |

### Q15. Abstract class vs interface *(Must-know)*
| | Abstract class | Interface |
|---|---|---|
| State (fields) | Yes | Only constants (`public static final`) |
| Constructors | Yes | No |
| Inheritance | Single | Multiple |
| Methods | Abstract + concrete | Abstract + `default` + `static` + `private` |
| Use | Shared base with state | Capability / contract |

### Q16. Arrays
Fixed-size, zero-indexed, hold same type. `int[] a = new int[5]; int[][] grid = new int[3][4];` `a.length` is a field. Use `Arrays.toString`, `Arrays.sort`, `Arrays.copyOf`, `Arrays.asList`.

### Q17. Control flow
`if/else`, `switch` (modern: arrow form and expressions), `for`, enhanced `for`, `while`, `do-while`, `break`, `continue`, labeled break.
```java
String size = switch (n) {
    case 1, 2 -> "small";
    case 3 -> "medium";
    default -> "large";
};
```

### Q18. Exceptions: checked vs unchecked *(Must-know)*
`Throwable` → `Error` (JVM problems like `OutOfMemoryError`) and `Exception`. **Checked** exceptions (subclasses of `Exception` except `RuntimeException`, e.g., `IOException`) must be caught or declared with `throws`. **Unchecked** (`RuntimeException`, e.g., `NullPointerException`, `IllegalArgumentException`) need not be.

### Q19. try-catch-finally and try-with-resources
```java
try (BufferedReader br = Files.newBufferedReader(Path.of("a.txt"))) {
    String line = br.readLine();
} catch (IOException e) {
    log.error("read failed", e);
}
```
Resources implementing `AutoCloseable` are closed automatically, even on exceptions, in reverse order.

### Q20. `throw` vs `throws`
`throw` raises an exception object now. `throws` declares in a method signature that it may propagate a checked exception.

### Q21. What is the Collections Framework?
Interfaces and implementations for data structures: `List`, `Set`, `Map`, `Queue`, `Deque`.
| Interface | Common implementations |
|---|---|
| List | `ArrayList`, `LinkedList` |
| Set | `HashSet`, `LinkedHashSet`, `TreeSet` |
| Map | `HashMap`, `LinkedHashMap`, `TreeMap`, `ConcurrentHashMap` |
| Queue/Deque | `ArrayDeque`, `PriorityQueue`, `LinkedList` |

### Q22. `ArrayList` vs `LinkedList`
`ArrayList`: dynamic array, O(1) random access, amortized O(1) append, O(n) insert in middle; cache-friendly. `LinkedList`: doubly linked, O(1) insert/remove at known node, O(n) access; high memory overhead. In practice `ArrayList` (or `ArrayDeque` for queues) is almost always better.

### Q23. `HashMap` basics
Stores key-value pairs; average O(1) `get/put`. Uses `hashCode()` to find a bucket and `equals()` to find the key. Allows one `null` key. Not thread-safe.

### Q24. `HashSet`, `LinkedHashSet`, `TreeSet`
`HashSet`: unordered, O(1). `LinkedHashSet`: insertion order. `TreeSet`: sorted (red-black tree), O(log n), needs `Comparable` or a `Comparator`.

### Q25. `Comparable` vs `Comparator`
`Comparable<T>` defines the natural order inside the class (`compareTo`). `Comparator<T>` defines external orders.
```java
people.sort(Comparator.comparing(Person::age).thenComparing(Person::name));
```

### Q26. `equals()` and `hashCode()` contract *(Must-know)*
If `a.equals(b)` then `a.hashCode() == b.hashCode()`. Override both together, use the same fields, and make `equals` reflexive, symmetric, transitive and consistent. Violations break `HashMap`/`HashSet`.

### Q27. What is a wrapper class cache gotcha?
`Integer a = 127, b = 127; a == b` is `true` (cached −128..127) but `Integer a = 1000, b = 1000; a == b` is `false`. Always use `equals` for wrapper objects.

### Q28. Packages and imports
Packages group classes and avoid name clashes (`com.example.app`). `import java.util.List;` or static imports. Directory layout mirrors package names.

### Q29. `this` and `super`
`this` refers to the current object; `super` refers to the parent's members or constructor.

### Q30. What is `var` (Java 10+)?
Local variable type inference: `var list = new ArrayList<String>();`. Still statically typed. Only for local variables, not fields or parameters.

### Q31. `Object` class methods
`toString`, `equals`, `hashCode`, `getClass`, `clone`, `wait`, `notify`, `notifyAll`, `finalize` (deprecated). Every class inherits from `Object`.

### Q32. Enums
```java
enum Role { ADMIN, USER, GUEST }
enum Planet {
    EARTH(5.97e24);
    private final double mass;
    Planet(double mass) { this.mass = mass; }
}
```
Type-safe constants; can have fields, methods, and implement interfaces. Use `EnumMap`/`EnumSet` for efficient collections.

### Q33. `static` nested, inner, local and anonymous classes
Static nested class: no outer instance. Inner class: holds a reference to the outer instance (can cause memory leaks). Local class: inside a method. Anonymous class: unnamed one-off implementation (lambdas replace most uses).

### Q34. Lambda expressions and functional interfaces
```java
Runnable r = () -> System.out.println("hi");
Function<Integer, Integer> square = x -> x * x;
Predicate<String> empty = String::isEmpty;
```
A functional interface has exactly one abstract method (`@FunctionalInterface`). Core ones: `Function`, `Predicate`, `Consumer`, `Supplier`, `BiFunction`, `UnaryOperator`.

### Q35. Basic Stream pipeline
```java
List<String> names = users.stream()
    .filter(u -> u.age() >= 18)
    .map(User::name)
    .sorted()
    .toList();            // Java 16+
```
Streams are lazy: nothing runs until a terminal operation (`collect`, `toList`, `forEach`, `reduce`, `count`).

---

# 🔵 Part 2: Junior (1–3 years)

### Q36. Records (Java 16+) *(Must-know)*
```java
public record User(String name, int age) {
    public User {                              // compact constructor with validation
        if (age < 0) throw new IllegalArgumentException("age");
    }
}
```
Immutable data carriers with generated constructor, accessors (`name()`), `equals`, `hashCode`, `toString`. Cannot extend classes (but can implement interfaces).

### Q37. Sealed classes and interfaces (Java 17)
```java
public sealed interface Shape permits Circle, Square {}
public record Circle(double r) implements Shape {}
public record Square(double side) implements Shape {}
```
Restrict which classes can extend or implement. Pairs with pattern matching `switch` for exhaustive handling without a `default`.

### Q38. Pattern matching (21 final for `switch`)
```java
double area(Shape s) {
    return switch (s) {
        case Circle c -> Math.PI * c.r() * c.r();
        case Square q -> q.side() * q.side();
    };
}
if (obj instanceof String str && !str.isBlank()) { ... }       // instanceof pattern (Java 16)
if (o instanceof Point(int x, int y)) { ... }                    // record patterns (Java 21)
```

### Q39. Text blocks (Java 15)
```java
String json = """
    { "name": "Ritesh Kumar" }
    """;
```

### Q40. `Optional` *(Must-know)*
Represents a value that may be absent; use as a **return type**, not for fields or parameters.
```java
Optional<User> findById(long id);
String name = findById(1).map(User::name).orElse("unknown");
findById(1).ifPresentOrElse(u -> ..., () -> ...);
```
Avoid `Optional.get()` without checking; prefer `orElseThrow()`.

### Q41. Stream operations in depth
Intermediate: `filter`, `map`, `flatMap`, `distinct`, `sorted`, `limit`, `skip`, `peek`. Terminal: `collect`, `forEach`, `reduce`, `count`, `anyMatch`, `findFirst`, `min`, `max`, `toList`.
```java
Map<String, List<User>> byCity = users.stream().collect(Collectors.groupingBy(User::city));
Map<String, Long> counts = words.stream().collect(Collectors.groupingBy(w -> w, Collectors.counting()));
int sum = IntStream.rangeClosed(1, 10).sum();
```
Use primitive streams (`IntStream`) to avoid boxing. Do not mutate external state inside stream lambdas.

### Q42. Parallel streams: when and when not
`parallelStream()` splits work across the common ForkJoinPool. Good for CPU-bound, large, independent, stateless operations on easily splittable sources (`ArrayList`, arrays). Bad for I/O, small data, ordered/stateful operations, or inside server request threads (shares the common pool).

### Q43. Generics *(Must-know)*
```java
class Box<T extends Comparable<T>> {
    private T value;
    T max(T other) { return value.compareTo(other) >= 0 ? value : other; }
}
static <T> void printAll(List<? extends T> items) { ... }
```
Wildcards: `? extends T` (producer, read-only), `? super T` (consumer, write). Mnemonic **PECS**: Producer Extends, Consumer Super. **Type erasure**: generic type info is removed at runtime, so no `new T()`, no `instanceof List<String>`, no generic arrays.

### Q44. Exceptions: best practices
Catch specific exceptions; never swallow silently; wrap with cause (`throw new ServiceException("msg", e)`); do not use exceptions for control flow; use custom exceptions meaningfully; clean up with try-with-resources; log once at the boundary, not at every layer.

### Q45. `try-with-resources` and suppressed exceptions
If both the body and `close()` throw, the body exception is primary and the `close()` exceptions are attached via `getSuppressed()`.

### Q46. Immutability
Make classes `final`, fields `private final`, no setters, defensive copies of mutable inputs/outputs, or use records. Immutable objects are thread-safe and easier to reason about. Use `List.of(...)`, `Map.of(...)`, `Set.of(...)` for immutable collections (they reject nulls and throw on modification).

### Q47. `HashMap` internals *(Must-know)*
Array of buckets; index = `(n - 1) & hash(key)`. Collisions use a linked list, converted to a **red-black tree** when a bucket exceeds 8 entries and the table has at least 64 buckets (Java 8+). Default capacity 16, load factor 0.75; when size exceeds capacity × load factor the table doubles and entries are rehashed. Keys must have stable `hashCode` (do not mutate keys).

### Q48. `ConcurrentHashMap` vs `Collections.synchronizedMap` vs `Hashtable`
`Hashtable`/`synchronizedMap` lock the whole map. `ConcurrentHashMap` uses fine-grained locking/CAS per bin, non-blocking reads, atomic methods (`putIfAbsent`, `computeIfAbsent`, `merge`). It forbids `null` keys and values. Iterators are weakly consistent.

### Q49. Fail-fast vs fail-safe iterators
Fail-fast (`ArrayList`, `HashMap`) throw `ConcurrentModificationException` if modified during iteration (except via the iterator's `remove`). Fail-safe/weakly consistent (`CopyOnWriteArrayList`, `ConcurrentHashMap`) do not throw but may not reflect recent changes.

### Q50. Inheritance vs composition
Prefer composition ("has-a") over inheritance ("is-a") to avoid fragile base classes and tight coupling. Inherit only for true subtype relationships, and design/document for extension or make classes `final`.

### Q51. SOLID principles (with Java examples)
- **S**ingle Responsibility: one reason to change.
- **O**pen/Closed: extend behavior via new classes/interfaces, not edits.
- **L**iskov Substitution: subtypes must be usable where the parent is expected.
- **I**nterface Segregation: small, focused interfaces.
- **D**ependency Inversion: depend on abstractions; inject dependencies.

### Q52. Common design patterns
Singleton (enum singleton is safest), Factory/Abstract Factory, Builder, Strategy, Observer, Decorator, Adapter, Template Method, Proxy. In modern Java, lambdas simplify Strategy/Command; records and sealed types simplify data modeling.
```java
public enum Registry { INSTANCE; public void register(String s) { ... } }   // thread-safe singleton
```

### Q53. Builder pattern
```java
User u = User.builder().name("Ritesh Kumar").age(30).build();     // Lombok or hand-written
```
Useful for many optional parameters and immutable objects.

### Q54. Dependency injection (concept)
Pass dependencies via constructors instead of creating them inside classes (`new Repo()`); easier testing and swapping. Frameworks (Spring, Guice, CDI) automate wiring (see file 017).

### Q55. Date and time API (`java.time`) *(Must-know)*
`LocalDate`, `LocalDateTime`, `Instant`, `ZonedDateTime`, `Duration`, `Period`, `DateTimeFormatter`. Immutable and thread-safe. Store timestamps as `Instant` (UTC); avoid legacy `Date`, `Calendar`, `SimpleDateFormat` (not thread-safe).
```java
Instant now = Instant.now();
ZonedDateTime ist = now.atZone(ZoneId.of("Asia/Kolkata"));
```

### Q56. File I/O with NIO.2
```java
Path p = Path.of("data", "users.txt");
List<String> lines = Files.readAllLines(p);                 // small files
try (Stream<String> s = Files.lines(p)) { s.forEach(System.out::println); }   // large files
Files.writeString(p, "hello", StandardCharsets.UTF_8);
```
Always specify charset (UTF-8 is the default since Java 18).

### Q57. Serialization
`Serializable` (Java built-in) is fragile and a security risk (deserialization vulnerabilities); avoid it for external data. Prefer JSON (Jackson), Protobuf or Avro. If unavoidable, set `serialVersionUID` and use deserialization filters.

### Q58. Reflection and annotations
Reflection inspects/modifies classes at runtime (`Class.forName`, `getDeclaredMethods`). Annotations add metadata (`@Override`, `@Deprecated`, custom). Frameworks use them for DI, ORM, validation. Reflection is slower and breaks encapsulation; modules restrict deep reflection.

### Q59. JUnit 5 and Mockito basics
```java
@Test
void addsNumbers() { assertEquals(5, calc.add(2, 3)); }

@ExtendWith(MockitoExtension.class)
class ServiceTest {
    @Mock Repo repo; @InjectMocks Service service;
    @Test void finds() {
        when(repo.find(1L)).thenReturn(Optional.of(new User("Ritesh Kumar")));
        assertEquals("Ritesh Kumar", service.name(1L));
    }
}
```
Also: `@ParameterizedTest`, `assertThrows`, AssertJ for fluent assertions, Testcontainers for real databases.

### Q60. Build tools
Maven (`pom.xml`, convention over configuration, lifecycle: `clean validate compile test package verify install deploy`) and Gradle (Groovy/Kotlin DSL, faster incremental builds, flexible). Dependency scopes: `compile`, `provided`, `runtime`, `test`. Use BOMs for version alignment.

### Q61. Logging
Use SLF4J as the API with Logback or Log4j2 as implementation. Never `System.out.println` in services. Parameterized logging: `log.info("user {} logged in", id)`. Don't log secrets or PII.

### Q62. JDBC basics
```java
try (Connection c = ds.getConnection();
     PreparedStatement ps = c.prepareStatement("SELECT * FROM users WHERE email = ?")) {
    ps.setString(1, email);
    try (ResultSet rs = ps.executeQuery()) { while (rs.next()) { ... } }
}
```
Always use `PreparedStatement` (prevents SQL injection), connection pools (HikariCP), and close resources.

---

# 🟡 Part 3: Mid (3–5 years)

### Q63. Java Memory Model basics: heap, stack, metaspace *(Must-know)*
- **Heap:** objects, shared across threads, managed by GC (young: Eden + Survivor; old generation).
- **Stack:** per thread; frames with local variables and references.
- **Metaspace:** class metadata (native memory, replaced PermGen in Java 8).
- **Code cache:** JIT-compiled code. **Direct buffers:** off-heap.

### Q64. Garbage collection overview *(Must-know)*
Objects unreachable from GC roots (thread stacks, static fields, JNI refs) are collected. Generational hypothesis: most objects die young. Collectors:
| GC | Notes |
|---|---|
| Serial | Single thread; tiny apps |
| Parallel | Throughput-oriented |
| **G1** (default since 9) | Region-based, balanced pause/throughput |
| **ZGC** | Ultra-low pause (sub-millisecond target), large heaps; generational mode default in newer releases (verify) |
| Shenandoah | Low-pause, concurrent compaction (some vendors) |

### Q65. GC tuning basics
Set heap (`-Xms`, `-Xmx`, usually equal), pick a collector, set pause goals (`-XX:MaxGCPauseMillis`), enable GC logs (`-Xlog:gc*`), analyze with GCViewer/GCeasy, and fix allocation rates or leaks before tuning flags. In containers use `-XX:MaxRAMPercentage=75`.

### Q66. Memory leaks in Java
Objects remain reachable but unused: static collections that grow, listeners/callbacks never removed, unbounded caches, `ThreadLocal` in thread pools without `remove()`, inner classes holding outer references, unclosed resources, classloader leaks. Diagnose with heap dumps (`jcmd GC.heap_dump`) and Eclipse MAT / VisualVM, look at dominator tree and GC roots.

### Q67. Threads and the thread lifecycle
States: `NEW`, `RUNNABLE`, `BLOCKED`, `WAITING`, `TIMED_WAITING`, `TERMINATED`. Create via `Thread`, `Runnable`, or (preferably) executors.
```java
ExecutorService pool = Executors.newFixedThreadPool(8);
Future<Integer> f = pool.submit(() -> compute());
pool.shutdown();
```

### Q68. `synchronized`, `volatile`, and atomics *(Must-know)*
- `synchronized`: mutual exclusion plus visibility (monitor lock) on a method or block.
- `volatile`: guarantees visibility and ordering of a single variable, **not atomicity** (`count++` is still unsafe).
- `AtomicInteger`/`AtomicReference`/`LongAdder`: lock-free atomic operations using CAS.
```java
private final AtomicLong counter = new AtomicLong();
counter.incrementAndGet();
```

### Q69. `happens-before`
The JMM rule that defines visibility: unlock happens-before subsequent lock of the same monitor; a `volatile` write happens-before subsequent reads; `Thread.start()` happens-before actions in that thread; thread completion happens-before `join()` returns. Without it, threads may see stale values.

### Q70. `java.util.concurrent` toolkit
`ExecutorService`, `ScheduledExecutorService`, `CompletableFuture`, `ConcurrentHashMap`, `CopyOnWriteArrayList`, `BlockingQueue` (`ArrayBlockingQueue`, `LinkedBlockingQueue`), `CountDownLatch`, `CyclicBarrier`, `Semaphore`, `Phaser`, `ReentrantLock`, `ReadWriteLock`, `StampedLock`, `ForkJoinPool`.

### Q71. `ReentrantLock` vs `synchronized`
`ReentrantLock` adds `tryLock` (with timeout), interruptible locking, fairness option, multiple `Condition`s. Always unlock in `finally`. `synchronized` is simpler and automatically released; prefer it unless you need the extras.
```java
lock.lock();
try { ... } finally { lock.unlock(); }
```

### Q72. Deadlock, livelock, starvation
Deadlock: threads wait for each other's locks forever (four conditions: mutual exclusion, hold and wait, no preemption, circular wait). Prevent by consistent lock ordering, `tryLock` with timeouts, fewer locks, and immutable data. Detect with `jstack`/`jcmd Thread.print` (reports deadlocks).

### Q73. `wait`/`notify` vs `BlockingQueue`
Low-level `wait/notify` requires holding the monitor and a loop checking the condition. Prefer `BlockingQueue` for producer/consumer and higher-level utilities.

### Q74. `CompletableFuture` *(Must-know)*
```java
CompletableFuture<User> user = CompletableFuture.supplyAsync(() -> loadUser(id), executor);
CompletableFuture<Orders> orders = CompletableFuture.supplyAsync(() -> loadOrders(id), executor);
user.thenCombine(orders, Profile::new)
    .exceptionally(ex -> Profile.empty())
    .orTimeout(2, TimeUnit.SECONDS)
    .thenAccept(this::render);
```
Pass an explicit executor (the default is the common ForkJoinPool). Use `allOf`/`anyOf`, handle exceptions, and avoid blocking `join()` inside async chains.

### Q75. Thread pools: sizing and rejection
CPU-bound: threads ≈ cores (+1). I/O-bound: threads ≈ cores × (1 + wait/compute). Prefer bounded queues with a rejection policy (`CallerRunsPolicy`) over unbounded ones (`newCachedThreadPool` can create unbounded threads; `newFixedThreadPool` has an unbounded queue). Build `ThreadPoolExecutor` explicitly in production and name threads.

### Q76. Virtual threads (Java 21, final) *(Must-know)*
Lightweight threads managed by the JVM, mounted on a small pool of carrier (platform) threads. Blocking I/O unmounts the virtual thread, so you can write simple blocking code and handle huge concurrency.
```java
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 10_000).forEach(i -> executor.submit(() -> fetch(i)));
}
```
Guidance: do not pool them (create per task), avoid long `synchronized` blocks around blocking calls (pinning; improved in newer releases, verify), limit concurrency to downstream resources with semaphores, and avoid `ThreadLocal` abuse. Not a speedup for CPU-bound work.

### Q77. Structured concurrency and scoped values
Previewed/evolving APIs (`StructuredTaskScope`, `ScopedValue`) treat concurrent subtasks as a unit with shared lifetime and cancellation. Check the current JDK release notes for finalization status before using them in production.

### Q78. Java Streams performance and pitfalls
Streams add overhead for tiny collections and hot loops; boxing is costly. Avoid side effects, avoid reusing streams (they are single-use), and prefer simple loops in performance-critical code after measuring.

### Q79. Collections performance table
| Operation | ArrayList | LinkedList | HashMap | TreeMap | ArrayDeque |
|---|---|---|---|---|---|
| get by index/key | O(1) | O(n) | O(1) avg | O(log n) | n/a |
| add at end | O(1) amortized | O(1) | O(1) avg | O(log n) | O(1) |
| insert middle | O(n) | O(1) at node | n/a | n/a | n/a |
| contains | O(n) | O(n) | O(1) avg | O(log n) | O(n) |

### Q80. Choosing the right collection
Need order + index: `ArrayList`. Unique + fast lookup: `HashSet`. Sorted: `TreeSet/TreeMap`. Insertion-ordered map: `LinkedHashMap` (also LRU via `removeEldestEntry`). Queue/stack: `ArrayDeque`. Priority: `PriorityQueue`. Concurrent: `ConcurrentHashMap`, `ConcurrentLinkedQueue`, `BlockingQueue`. Enum keys: `EnumMap`.

### Q81. LRU cache with `LinkedHashMap`
```java
class Lru<K, V> extends LinkedHashMap<K, V> {
    private final int cap;
    Lru(int cap) { super(16, 0.75f, true); this.cap = cap; }
    @Override protected boolean removeEldestEntry(Map.Entry<K, V> e) { return size() > cap; }
}
```
Not thread-safe; wrap or use Caffeine in production.

### Q82. Exceptions in concurrent code
Uncaught exceptions in pool threads are lost unless you get the `Future` or set an `UncaughtExceptionHandler`. `submit()` captures exceptions in the `Future`; `execute()` lets them propagate to the thread's handler. Always handle or log.

### Q83. JDBC, HikariCP and connection pooling
Pool size is small (about `cores × 2 + disk spindles`, often 10–20); more connections do not mean more throughput. Set timeouts (`connectionTimeout`, `maxLifetime`), leak detection (`leakDetectionThreshold`), and keep transactions short.

### Q84. Transactions and isolation levels
ACID. Isolation levels: READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE. Anomalies: dirty read, non-repeatable read, phantom read. Know your database's defaults (PostgreSQL READ COMMITTED, MySQL InnoDB REPEATABLE READ) and use optimistic locking (`@Version`) or `SELECT ... FOR UPDATE` where needed.

### Q85. JSON handling with Jackson
```java
ObjectMapper mapper = new ObjectMapper().registerModule(new JavaTimeModule());
String json = mapper.writeValueAsString(user);
User u = mapper.readValue(json, User.class);
```
Reuse `ObjectMapper` (thread-safe once configured), disable unknown-property failures only deliberately, and avoid deserializing untrusted polymorphic types (security).

### Q86. HTTP clients
`java.net.http.HttpClient` (Java 11+, HTTP/2, async). Also OkHttp, Apache HttpClient, Spring `RestClient`/`WebClient`. Always set connect/read timeouts and reuse client instances.
```java
HttpClient client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(3)).build();
HttpRequest req = HttpRequest.newBuilder(URI.create(url)).timeout(Duration.ofSeconds(5)).GET().build();
HttpResponse<String> res = client.send(req, HttpResponse.BodyHandlers.ofString());
```

### Q87. Modules (JPMS, Java 9+)
`module-info.java` declares what a module `requires` and `exports`, giving strong encapsulation and reliable configuration. Many applications still use the classpath; modules matter mostly for libraries and `jlink` custom runtimes.

### Q88. Annotation processing and Lombok
Annotation processors generate code at compile time (Lombok, MapStruct, Dagger). Lombok reduces boilerplate (`@Getter`, `@Builder`, `@Slf4j`) but hides generated code; prefer records for data classes in modern Java.

### Q89. Security basics in Java
Parameterized queries, input validation, avoid Java deserialization of untrusted data, keep dependencies patched (OWASP Dependency-Check, Snyk), use `SecureRandom` for tokens, hash passwords with bcrypt/Argon2 (not `MessageDigest` alone), TLS with proper certificate validation, least-privilege file/network access, and secrets outside code.

### Q90. Cryptography basics
Use well-vetted libraries and APIs: `SecureRandom`, `MessageDigest` (SHA-256) for integrity, `Mac` (HMAC), AES-GCM for encryption (unique IV per message), RSA/ECDSA for signatures. Do not invent algorithms or use ECB mode/MD5/SHA-1 for security.

### Q91. Testing strategy
Unit tests (JUnit 5 + Mockito), integration tests with real dependencies (Testcontainers), contract tests, mutation testing (PIT), code coverage (JaCoCo) as a guide not a goal. Make time and randomness injectable (`Clock`).

### Q92. Code quality tooling
Checkstyle/Spotless for style, SpotBugs/Error Prone for bugs, SonarQube for quality gates, Dependabot/Renovate for updates, JaCoCo for coverage, and CI enforcement.


---

# 🟠 Part 4: Senior (5–7 years)

### Q93. Designing a high-throughput Java service *(Architecture)*
Stateless instances behind a load balancer; bounded thread pools or virtual threads with concurrency limits; non-blocking or well-pooled I/O; connection pools sized to DB capacity; caching (Caffeine local, Redis shared); batching and async messaging for slow work; timeouts, retries with jitter and circuit breakers (Resilience4j); backpressure; observability (Micrometer, OpenTelemetry); and capacity tests (Gatling, JMeter, k6). Profile before optimizing.

### Q94. JIT compilation: C1, C2 and tiered compilation
The JVM starts by interpreting, profiles hot methods, compiles them with C1 (fast, light optimizations) and then C2 (heavy optimizations: inlining, escape analysis, loop unrolling) in tiered mode. Warm-up is why microbenchmarks need JMH. Deoptimization happens when assumptions break. GraalVM native image and CRaC trade peak performance or flexibility for faster startup (verify current support).

### Q95. Escape analysis and allocation
If an object does not escape a method, C2 can allocate it on the stack (scalar replacement) and remove allocation and synchronization. Short-lived allocations are cheap in the young generation; the real cost is promotion to old gen and GC frequency.

### Q96. Microbenchmarking with JMH
Naive `System.nanoTime()` loops lie because of JIT warm-up, dead-code elimination and constant folding. JMH handles warm-up, forks, and blackholes.
```java
@Benchmark
public int sumList(Blackhole bh) { return list.stream().mapToInt(i -> i).sum(); }
```

### Q97. Diagnosing production issues: toolbox *(Must-know)*
| Symptom | Tool |
|---|---|
| High CPU | `top -H` + `jstack`/`jcmd Thread.print`, async-profiler, JFR |
| Memory growth | `jcmd GC.heap_info`, heap dump + Eclipse MAT, JFR allocation profiling |
| Long pauses | GC logs (`-Xlog:gc*`), JFR |
| Deadlock/hang | Thread dumps (take 3 a few seconds apart) |
| Slow requests | Traces (OpenTelemetry), JFR, async-profiler wall-clock mode |
| Native memory | `-XX:NativeMemoryTracking=summary`, `jcmd VM.native_memory` |

### Q98. Java Flight Recorder (JFR)
Low-overhead event recorder built into the JVM: CPU samples, allocations, locks, GC, I/O. Start with `-XX:StartFlightRecording` or `jcmd JFR.start`, analyze in JDK Mission Control. Safe for production.

### Q99. Reading a thread dump
Look for threads in `BLOCKED` (waiting for a monitor), many threads `WAITING` on the same lock or pool, `RUNNABLE` threads in the same hot method, and the "Found one Java-level deadlock" section. Compare multiple dumps to see which threads are stuck.

### Q100. OutOfMemoryError types
`Java heap space` (heap too small or leak), `GC overhead limit exceeded` (GC thrashing), `Metaspace` (classloader leaks or many generated classes), `unable to create native thread` (thread/OS limits), `Direct buffer memory` (off-heap). Enable `-XX:+HeapDumpOnOutOfMemoryError` and `-XX:HeapDumpPath`. In containers, also watch for the OOM killer (exit code 137) when total memory (heap + metaspace + threads + direct) exceeds the limit.

### Q101. Containers and the JVM
Modern JVMs are container-aware. Use `-XX:MaxRAMPercentage=70..75`, keep a margin for non-heap memory, set CPU limits knowingly (affects `availableProcessors`, GC and pool sizing), use layered jars or jlink/jib for small images, a non-root user, and a health check. Avoid very small CPU limits with G1 (consider Serial/ZGC choices).

### Q102. Class loading
Bootstrap → Platform → Application class loaders (parent delegation). Frameworks use custom class loaders (web containers, OSGi, plugins). Leaks occur when a long-lived object references a class from a discarded loader (redeploys). `ClassNotFoundException` vs `NoClassDefFoundError`: the first is a failed dynamic load, the second a class that was present at compile time but missing or failed to initialize at runtime.

### Q103. Memory model: false sharing and cache effects
Threads writing to different variables on the same cache line slow each other (false sharing). `@Contended` (internal) or padding addresses it; `LongAdder` stripes counters to reduce contention. Data layout (arrays of primitives vs objects) matters for cache locality.

### Q104. Lock-free and wait-free patterns
CAS loops in `Atomic*`, `ConcurrentLinkedQueue`, `LongAdder`, `VarHandle` for fine-grained control. They avoid blocking but can livelock under heavy contention and are harder to reason about; use proven library classes instead of custom ones.

### Q105. Reactive vs virtual threads vs blocking
Reactive (Project Reactor, RxJava, WebFlux) gives high concurrency with few threads using non-blocking pipelines but complicates debugging and stack traces. Virtual threads give similar scalability with simple blocking code. Choose reactive when you need streaming/backpressure semantics or already have a reactive stack; choose virtual threads (Java 21+) for straightforward request/response services.

### Q106. Resilience patterns with Resilience4j
Circuit breaker, retry (idempotent calls, backoff + jitter), rate limiter, bulkhead (limit concurrency per dependency), time limiter, and cache. Combine in a sensible order (time limiter → retry → circuit breaker → bulkhead) and expose metrics.

### Q107. Serialization performance and formats
JSON (Jackson) is flexible; Protobuf/Avro are compact and schema-based; consider schema evolution rules (add optional fields, never reuse tags). Avoid serializing large object graphs; stream where possible.

### Q108. Database access patterns at scale
Batch inserts (`addBatch`, JDBC `reWriteBatchedInserts` for PostgreSQL), keyset pagination instead of large offsets, read replicas for heavy reads, avoiding N+1 with fetch joins/entity graphs, indexing based on query plans, and optimistic locking for concurrent updates.

### Q109. Idempotency and exactly-once myths
Networks retry. Make operations idempotent with unique request IDs/keys, upserts, and unique constraints; use the transactional outbox pattern with idempotent consumers rather than relying on "exactly once" claims.

### Q110. Observability
Logs (structured JSON, correlation IDs via MDC), metrics (Micrometer: RED and JVM metrics: heap, GC pause, threads, pool saturation), traces (OpenTelemetry Java agent), and dashboards/alerts tied to SLOs. Avoid high-cardinality labels.

### Q111. Upgrading Java versions safely
Move LTS to LTS (8 → 11 → 17 → 21 → 25). Steps: compile with the new JDK using `--release`, fix removed APIs (`javax.xml.bind`, Nashorn, `Thread.stop`), handle strong encapsulation (`--add-opens` as a stopgap), update libraries/frameworks, run full tests, test GC/performance behavior, and roll out by canary.

### Q112. Native image and startup time
GraalVM Native Image compiles ahead of time for fast startup and low memory, but needs reachability metadata (reflection, proxies), has longer builds and slightly different peak performance. Good for serverless/CLI; evaluate carefully for large services. Alternatives: CDS/AppCDS, CRaC, jlink.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q113. Java vs Kotlin vs Go vs Node vs C#: how do you decide? *(Decision)*
| | Java | Kotlin | Go | Node.js | C# (.NET) |
|---|---|---|---|---|---|
| Strengths | Mature ecosystem, tooling, performance, huge talent pool | Concise, null-safety, Java interop, coroutines | Simple, fast startup, easy concurrency | Full-stack JS, async I/O | Similar to Java, great tooling, strong on Windows/Azure |
| Weaknesses | Verbose (improving), heavier startup | Smaller community, build times | Less expressive, smaller enterprise libs | CPU-bound on one thread | Ecosystem differences |
| Fit | Large enterprise systems, finance, Android backends | Android, modern JVM services | Infra, network services | BFFs, real-time | Enterprise, Azure-heavy shops |
Decide on team skills, existing platform, ecosystem, latency/throughput, hiring, and operations. Polyglot is fine with clear boundaries.

### Q114. Standardizing Java across teams
LTS policy (for example latest LTS only), parent BOM/POM or Gradle convention plugins, shared libraries (logging, security, HTTP clients), code style and static analysis, service templates, container base images, vulnerability scanning, and an upgrade cadence with automation (OpenRewrite recipes).

### Q115. Monolith, modular monolith, microservices
Start with a modular monolith with enforced boundaries (ArchUnit, JPMS or build modules). Split when scale, team autonomy or deployment cadence demand it. Account for distributed system costs: network failure, data consistency (sagas, outbox), observability, versioning.

### Q116. Domain-driven design essentials
Bounded contexts, ubiquitous language, aggregates (consistency boundaries), entities vs value objects (records are natural value objects), domain events, anti-corruption layers. Keep domain logic free of framework code.

### Q117. Architecture styles
Layered, hexagonal (ports and adapters), clean architecture, CQRS, event sourcing. Choose the least complex style that fits; enforce dependency direction with tests (ArchUnit).

### Q118. API design and evolution
REST conventions, OpenAPI as contract, consistent errors (problem+json), pagination/filtering standards, versioning strategy, backward-compatible changes, deprecation policy, consumer-driven contract tests (Pact/Spring Cloud Contract), and gRPC/Protobuf for internal high-performance calls.

### Q119. Data consistency in distributed systems
Avoid distributed transactions (2PC). Use sagas with compensations, outbox + CDC (Debezium), idempotent consumers, optimistic concurrency, eventual consistency in read models, and clear ownership of each dataset.

### Q120. Performance engineering program
SLOs, load testing in CI/staging, continuous profiling (JFR, async-profiler, Pyroscope), performance budgets, capacity planning, GC and pool dashboards, and regression tracking across releases.

### Q121. Security program
Threat modeling, SAST/DAST/SCA in CI, secret scanning, SBOMs, dependency policies, least privilege, secure defaults, audit logging, pen tests, patching SLAs (Log4Shell-style response plans), and developer training.

### Q122. Cost and sustainability
Right-size heap and pods, use autoscaling on meaningful signals, reduce idle capacity, choose efficient serialization, cache wisely, consider native image or lighter runtimes for bursty workloads, and track cost per request.

### Q123. Hiring and mentoring (Java depth)
Interview for: JVM memory/GC understanding, concurrency correctness, collections internals, API design, testing habits, debugging with thread/heap dumps, and trade-off thinking. Mentor through code reviews on equality/hash contracts, thread safety, resource handling and exception design.

### Q124. Technical debt and roadmap
Debt register: outdated JDK/framework versions, unmaintained libraries, large classes, missing tests, flaky tests, module cycles, hand-rolled concurrency. Reserve capacity each quarter, track upgrades (JDK LTS cadence), and automate migrations (OpenRewrite).

---

# 💻 Part 6: Coding / Machine-Coding Tasks

> Practice from memory. State complexity, edge cases and thread-safety.

### C1. Reverse a string and check a palindrome
```java
static boolean isPalindrome(String s) {
    int i = 0, j = s.length() - 1;
    while (i < j) {
        while (i < j && !Character.isLetterOrDigit(s.charAt(i))) i++;
        while (i < j && !Character.isLetterOrDigit(s.charAt(j))) j--;
        if (Character.toLowerCase(s.charAt(i++)) != Character.toLowerCase(s.charAt(j--))) return false;
    }
    return true;
}
```

### C2. Two sum with a hash map (O(n))
```java
static int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        Integer j = seen.get(target - nums[i]);
        if (j != null) return new int[]{j, i};
        seen.put(nums[i], i);
    }
    return new int[0];
}
```

### C3. Word frequency with streams
```java
Map<String, Long> freq = Arrays.stream(text.toLowerCase().split("\\W+"))
    .filter(w -> !w.isBlank())
    .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));
```

### C4. Group anagrams
```java
Map<String, List<String>> groups = words.stream().collect(Collectors.groupingBy(w -> {
    char[] c = w.toCharArray(); Arrays.sort(c); return new String(c);
}));
```

### C5. Immutable class with proper `equals`/`hashCode` (or a record)
```java
public final class Money {
    private final long cents; private final String currency;
    public Money(long cents, String currency) { this.cents = cents; this.currency = Objects.requireNonNull(currency); }
    @Override public boolean equals(Object o) {
        return this == o || (o instanceof Money m && cents == m.cents && currency.equals(m.currency));
    }
    @Override public int hashCode() { return Objects.hash(cents, currency); }
}
// or simply: public record Money(long cents, String currency) {}
```

### C6. Thread-safe singleton (enum or holder)
```java
public enum Config { INSTANCE; private final Properties props = load(); }
class Holder { private static class H { static final Holder I = new Holder(); } static Holder get() { return H.I; } }
```

### C7. Producer–consumer with `BlockingQueue`
```java
BlockingQueue<Integer> q = new ArrayBlockingQueue<>(100);
Thread producer = new Thread(() -> { try { for (int i = 0; i < 1000; i++) q.put(i); q.put(-1); } catch (InterruptedException e) { Thread.currentThread().interrupt(); } });
Thread consumer = new Thread(() -> { try { int v; while ((v = q.take()) != -1) process(v); } catch (InterruptedException e) { Thread.currentThread().interrupt(); } });
producer.start(); consumer.start();
```
Always restore the interrupt flag.

### C8. Parallel tasks with `CompletableFuture`
```java
List<CompletableFuture<String>> futures = urls.stream()
    .map(u -> CompletableFuture.supplyAsync(() -> fetch(u), executor).orTimeout(3, TimeUnit.SECONDS)
        .exceptionally(ex -> "error"))
    .toList();
List<String> results = futures.stream().map(CompletableFuture::join).toList();
```

### C9. Virtual thread fan-out with a concurrency limit
```java
Semaphore limit = new Semaphore(50);
try (var exec = Executors.newVirtualThreadPerTaskExecutor()) {
    List<Future<String>> fs = urls.stream().map(u -> exec.submit(() -> {
        limit.acquire();
        try { return fetch(u); } finally { limit.release(); }
    })).toList();
    for (var f : fs) results.add(f.get());
}
```

### C10. LRU cache
See Q81 (`LinkedHashMap`). For thread safety use Caffeine:
```java
Cache<String, User> cache = Caffeine.newBuilder().maximumSize(10_000).expireAfterWrite(Duration.ofMinutes(5)).build();
```

### C11. Rate limiter (token bucket)
```java
final class TokenBucket {
    private final long capacity; private final double refillPerNano; private double tokens; private long last = System.nanoTime();
    TokenBucket(long capacity, double perSecond) { this.capacity = capacity; this.refillPerNano = perSecond / 1e9; this.tokens = capacity; }
    synchronized boolean tryAcquire() {
        long now = System.nanoTime();
        tokens = Math.min(capacity, tokens + (now - last) * refillPerNano); last = now;
        if (tokens >= 1) { tokens -= 1; return true; }
        return false;
    }
}
```

### C12. Binary search
```java
static int search(int[] a, int x) {
    int lo = 0, hi = a.length - 1;
    while (lo <= hi) {
        int mid = (lo + hi) >>> 1;          // avoids overflow
        if (a[mid] == x) return mid;
        if (a[mid] < x) lo = mid + 1; else hi = mid - 1;
    }
    return -1;
}
```

### C13. Merge intervals
```java
static int[][] merge(int[][] in) {
    Arrays.sort(in, Comparator.comparingInt(a -> a[0]));
    List<int[]> out = new ArrayList<>();
    for (int[] cur : in) {
        if (out.isEmpty() || out.get(out.size() - 1)[1] < cur[0]) out.add(cur);
        else out.get(out.size() - 1)[1] = Math.max(out.get(out.size() - 1)[1], cur[1]);
    }
    return out.toArray(new int[0][]);
}
```

### C14. Reverse a linked list
```java
static Node reverse(Node head) {
    Node prev = null;
    while (head != null) { Node next = head.next; head.next = prev; prev = head; head = next; }
    return prev;
}
```

### C15. Balanced parentheses
```java
static boolean balanced(String s) {
    Deque<Character> st = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        switch (c) {
            case '(', '[', '{' -> st.push(c);
            case ')' -> { if (st.isEmpty() || st.pop() != '(') return false; }
            case ']' -> { if (st.isEmpty() || st.pop() != '[') return false; }
            case '}' -> { if (st.isEmpty() || st.pop() != '{') return false; }
            default -> {}
        }
    }
    return st.isEmpty();
}
```

### C16. Top K frequent elements
```java
static List<Integer> topK(int[] nums, int k) {
    Map<Integer, Integer> cnt = new HashMap<>();
    for (int n : nums) cnt.merge(n, 1, Integer::sum);
    PriorityQueue<Map.Entry<Integer, Integer>> pq = new PriorityQueue<>(Map.Entry.comparingByValue());
    for (var e : cnt.entrySet()) { pq.offer(e); if (pq.size() > k) pq.poll(); }
    return pq.stream().map(Map.Entry::getKey).toList();
}
```

### C17. Custom exception hierarchy and usage
```java
public class AppException extends RuntimeException {
    private final int status;
    public AppException(int status, String msg, Throwable cause) { super(msg, cause); this.status = status; }
}
public final class NotFoundException extends AppException {
    public NotFoundException(String what) { super(404, what + " not found", null); }
}
```

### C18. Retry with exponential backoff
```java
static <T> T retry(Callable<T> task, int attempts, long baseMs) throws Exception {
    for (int i = 0; ; i++) {
        try { return task.call(); }
        catch (Exception e) {
            if (i >= attempts - 1) throw e;
            Thread.sleep((long) (baseMs * Math.pow(2, i) * (0.5 + Math.random())));
        }
    }
}
```

### C19. Read a large file lazily
```java
try (Stream<String> lines = Files.lines(Path.of("big.log"))) {
    long errors = lines.filter(l -> l.contains("ERROR")).count();
}
```

### C20. JUnit 5 test with parameterization
```java
@ParameterizedTest
@CsvSource({"abba,true", "abc,false", "'',true"})
void palindrome(String in, boolean expected) { assertEquals(expected, isPalindrome(in)); }
```

### C21. Sealed hierarchy with exhaustive switch
See Q37 and Q38.

### C22. Simple REST call with the JDK HttpClient
See Q86.

### C23. Dockerfile for a Spring/Java service (layered jar)
```dockerfile
FROM eclipse-temurin:21-jre
WORKDIR /app
RUN useradd -r app
COPY target/app.jar app.jar
USER app
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. `NullPointerException`
A reference is `null`. Read the stack trace (helpful NPE messages name the null expression in modern JDKs), trace where the value should be set, validate inputs (`Objects.requireNonNull`), use `Optional` for return values, and avoid returning `null` collections (return empty ones).

### D2. `ClassCastException` / `ArrayStoreException`
Wrong runtime type, often from raw types or unchecked casts. Use generics, avoid raw types, and prefer pattern matching `instanceof`.

### D3. `ConcurrentModificationException`
Collection modified during iteration. Use `Iterator.remove()`, `removeIf`, build a new list, or use concurrent collections.

### D4. `StackOverflowError`
Infinite or very deep recursion (also cyclic `toString/equals/hashCode`, bidirectional JPA relations in JSON). Fix the base case, convert to iteration, break cycles. Raising `-Xss` is a last resort.

### D5. `OutOfMemoryError: Java heap space`
Take a heap dump, open it in MAT, find the dominator objects and GC roots. Typical: unbounded caches, large result sets loaded into memory, leaked sessions. Fix the leak or stream the data; then size the heap.

### D6. Application freezes but CPU is low
Possible deadlock or thread pool exhaustion. Take thread dumps with `jcmd <pid> Thread.print`, look for `BLOCKED` threads and "Found one Java-level deadlock", check pool queues and DB pool wait.

### D7. High CPU
`top -H -p <pid>` to find the hot thread ID, convert to hex, match with `nid` in the thread dump; or use async-profiler/JFR. Typical causes: infinite loops, regex backtracking, JSON serialization of huge objects, busy-wait polling, excessive GC.

### D8. Long GC pauses
Enable GC logs, check allocation rate, humongous allocations in G1, heap sizing, promotion failure, and finalizers. Consider ZGC or tuning pause goals only after reducing allocation.

### D9. Connection pool exhausted (`HikariPool ... Connection is not available`)
Connections leaked (not closed), long transactions, slow queries, or too many concurrent requests. Use try-with-resources, set `leakDetectionThreshold`, shorten transactions, and size the pool properly.

### D10. `NoSuchMethodError` / `NoClassDefFoundError` / `ClassNotFoundException`
Dependency version conflicts (two versions of a library) or packaging issues. Inspect with `mvn dependency:tree` / `gradle dependencies`, align versions with a BOM, exclude duplicates, and check shading.

### D11. `LazyInitializationException` (Hibernate)
Lazy association accessed outside a session/transaction. Fetch what you need (join fetch, entity graph, DTO projection) inside the transaction.

### D12. `UnsupportedOperationException` on a list
Immutable list (`List.of`, `Arrays.asList` fixed-size, `Collections.unmodifiableList`). Copy into `new ArrayList<>(...)` if you need modification.

### D13. Wrong results from `HashMap`/`HashSet`
`equals`/`hashCode` missing or inconsistent, or key mutated after insertion. Make keys immutable and implement both methods.

### D14. Time zone and date bugs
Using `Date`/`SimpleDateFormat` or `LocalDateTime` where an instant was needed. Store `Instant` (UTC), format with `DateTimeFormatter`, and convert to zones only for display. Run servers with UTC.

### D15. Encoding problems (garbled text)
Platform default charset differences (before Java 18) or missing charset in I/O. Always specify UTF-8 in file, network and database settings.

### D16. Thread-safety bugs (race conditions)
Symptoms are intermittent wrong values. Look for shared mutable state, non-atomic check-then-act, unsafe publication, `HashMap` in multiple threads, `SimpleDateFormat` shared. Fix with immutability, concurrent collections, atomics, or proper locking; test with stress tests and tools like jcstress.

### D17. `InterruptedException` swallowed
Catching it and doing nothing breaks cancellation. Either propagate it or call `Thread.currentThread().interrupt()`.

### D18. Slow startup
Heavy classpath scanning, reflection, many beans, large static initializers, and remote calls at startup. Use lazy initialization, AOT/CDS, remove unused starters, and measure with startup logs/JFR.

### D19. Container killed with exit code 137
OOM-killed by the kernel: heap + metaspace + threads + direct memory exceeded the limit. Reduce `-Xmx` / use `MaxRAMPercentage`, cap thread counts and direct memory, and monitor RSS.

### D20. Memory leak with `ThreadLocal`
Values stay referenced by pooled threads. Always call `remove()` in `finally`, or avoid ThreadLocal (use explicit parameters or scoped values).

### D21. Build works locally but fails in CI
Different JDK version, missing environment variables, locale/timezone differences, cached stale dependencies, or tests depending on order/time. Pin the JDK (toolchains), use clean builds, and make tests deterministic.

### D22. Debugging method (say this in interviews)
Reproduce → collect evidence (logs, thread dump, heap dump, JFR, metrics) → form a hypothesis → verify with a minimal test → fix the root cause → add a regression test and monitoring.


---

# 🧩 Part 8: Tricky Questions

### T1. Is Java pass-by-value or pass-by-reference?
Always **pass-by-value**. For objects, the value passed is a copy of the reference. The method can mutate the object but cannot make the caller's variable point somewhere else.
```java
void change(StringBuilder sb) { sb.append("x"); sb = new StringBuilder("new"); }
```
The caller sees the appended `x`, but not the reassignment.

### T2. Why is `String` a bad choice for storing passwords in memory?
Strings are immutable and pooled, so they stay in memory until GC and cannot be wiped. `char[]` can be zeroed after use. (In web apps, the bigger concerns are hashing and not logging.)

### T3. `==` vs `equals` on `Integer`
`Integer` values between −128 and 127 are cached, so `==` can be true. Outside that range `==` compares references and usually fails. Use `equals`.

### T4. What does this print? `System.out.println(0.1 + 0.2 == 0.3);`
`false`. Floating-point cannot represent these exactly. Use `BigDecimal` (constructed from strings) for money, and compare doubles with a tolerance.

### T5. `BigDecimal` pitfalls
`new BigDecimal(0.1)` carries the binary error; use `new BigDecimal("0.1")` or `BigDecimal.valueOf(0.1)`. `equals` compares scale (`2.0` vs `2.00` are not equal); use `compareTo`. Division needs a scale and `RoundingMode`.

### T6. Can a `static` method be overridden?
No. It can be **hidden**. Static methods are resolved at compile time by the reference type.

### T7. Can the constructor be `final`, `static` or `abstract`?
No for all three. Constructors are not inherited, so those modifiers make no sense. They can be `private` (singletons, factories).

### T8. What happens if `finally` returns?
A `return` in `finally` overrides the return value or exception from `try/catch`, silently swallowing exceptions. Avoid it.

### T9. `try { return 1; } finally { x = 2; }`: what is returned?
The return value is computed first (`1`) and kept; the `finally` block runs, then the method returns `1` (for primitives; for objects the reference is fixed but the object can be mutated).

### T10. `hashCode` of mutable keys
If a key's fields change after insertion, its hash changes and the map cannot find the entry (a memory leak and "lost" values). Use immutable keys.

### T11. Why can't you create a generic array `new T[10]`?
Because of type erasure and array covariance, which would allow heap pollution. Use `(T[]) new Object[10]` with caution or `List<T>`.

### T12. `List<Object>` vs `List<?>` vs raw `List`
`List<Object>` is not a supertype of `List<String>` (generics are invariant). `List<?>` accepts any list but you can only read `Object`. Raw `List` disables type checking; avoid.

### T13. What is heap pollution?
When a variable of a parameterized type refers to an object of a different type (through raw types or unchecked casts), causing `ClassCastException` later.

### T14. Why is `HashMap` not safe in concurrent code?
Concurrent resizing can lose entries or corrupt structures (infinite loops in older versions). Use `ConcurrentHashMap`.

### T15. `ConcurrentHashMap.get()` then `put()` is it atomic?
No. Check-then-act is a race. Use `computeIfAbsent`, `putIfAbsent`, or `merge` for atomic updates.

### T16. `volatile` and `i++`
`volatile` ensures visibility, not atomicity. Two threads can read the same value and both write `i+1`. Use `AtomicInteger` or `synchronized`.

### T17. Double-checked locking
Correct only if the field is `volatile`. Otherwise another thread may see a partially constructed object. Prefer the holder idiom or an enum.

### T18. `Thread.sleep()` vs `Object.wait()`
`sleep` pauses the current thread and keeps its locks. `wait` releases the monitor and waits for `notify`; it must be called while holding the monitor, inside a loop.

### T19. `start()` vs `run()`
`start()` creates a new thread that calls `run()`. Calling `run()` directly executes in the current thread.

### T20. Can you restart a thread after it finishes?
No. `IllegalThreadStateException`. Create a new `Thread` or use an executor.

### T21. `synchronized` on `this` vs a private lock object
Synchronizing on `this` exposes your lock to outside code (any caller can lock it). A `private final Object lock` is safer.

### T22. What is the difference between `Error` and `Exception`?
`Error`s represent serious JVM problems (OOM, StackOverflow) that applications generally should not catch. `Exception`s are conditions applications may handle.

### T23. Why are `switch` on strings OK now but `==` on strings not?
`switch` uses `equals` (and `hashCode`) internally. `==` compares references.

### T24. `Arrays.asList` returns a fixed-size list
You can `set` but not `add`/`remove`; it is backed by the array. Changes write through. Primitive arrays become a one-element list of the array.

### T25. `List.remove(int)` vs `remove(Object)`
`list.remove(1)` removes index 1; `list.remove(Integer.valueOf(1))` removes the value 1.

### T26. `char` arithmetic
`char c = 'a'; c + 1` is an `int` (98); `(char)(c + 1)` is `'b'`. `c += 1` compiles because compound assignment includes an implicit cast.

### T27. Integer overflow
`Integer.MAX_VALUE + 1` becomes `Integer.MIN_VALUE` silently. Use `Math.addExact`, `long`, or `BigInteger`. `(lo + hi) / 2` can overflow; use `(lo + hi) >>> 1`.

### T28. What is the output of `"abc".substring(1, 1)`?
An empty string. `substring(begin, end)` has end exclusive.

### T29. Lambda captured variables must be effectively final
Because local variables live on the stack and lambdas may run later or on other threads. Use an `AtomicInteger` or restructure.

### T30. Why can `Optional` as a field or parameter be a code smell?
It is not serializable by default, adds allocation, and callers can still pass `null`. Use it for return values only.

### T31. Records and inheritance
Records are implicitly final, cannot extend a class, but can implement interfaces. Components are final; arrays/collections inside are still mutable unless defensively copied.

### T32. Is `ThreadLocal` safe with virtual threads?
It works, but millions of virtual threads each holding large thread-local values waste memory. Prefer scoped values or explicit parameters.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

| Question | Short answer |
|---|---|
| Compiled to? | Bytecode (`.class`) |
| Runs on? | JVM |
| Entry point? | `public static void main(String[] args)` |
| Default `int` value in a field? | `0` |
| Immutable text class? | `String` |
| Fast string building? | `StringBuilder` |
| Root of all classes? | `Object` |
| Multiple inheritance of type? | Via interfaces |
| Unique elements collection? | `Set` |
| Key-value collection? | `Map` |
| Sorted map? | `TreeMap` |
| Insertion-order map? | `LinkedHashMap` |
| Thread-safe map? | `ConcurrentHashMap` |
| Best queue/stack? | `ArrayDeque` |
| Contract for map keys? | `equals` + `hashCode` |
| Natural ordering interface? | `Comparable` |
| Custom ordering? | `Comparator` |
| Auto-close resources? | try-with-resources |
| Checked exception base? | `Exception` (not `RuntimeException`) |
| Immutable data class? | `record` |
| Restrict subclasses? | `sealed` |
| Type inference for locals? | `var` |
| Multi-line strings? | Text blocks `"""` |
| Functional interface? | Single abstract method |
| Lazy pipeline API? | Streams |
| Absent value return type? | `Optional` |
| Async composition? | `CompletableFuture` |
| Cheap threads (21)? | Virtual threads |
| Atomic counter? | `AtomicLong` / `LongAdder` |
| Visibility keyword? | `volatile` |
| Mutual exclusion keyword? | `synchronized` |
| Default GC? | G1 |
| Low-pause GC? | ZGC |
| Heap dump command? | `jcmd <pid> GC.heap_dump` |
| Thread dump command? | `jcmd <pid> Thread.print` / `jstack` |
| Profiler built into JVM? | Java Flight Recorder |
| Build tools? | Maven, Gradle |
| Logging API? | SLF4J |
| Date/time API? | `java.time` |
| Benchmark tool? | JMH |
| LTS versions? | 8, 11, 17, 21, 25 |

---

# 🎤 Part 10: Project / Behavioral Questions

> Use **S**ituation, **T**ask, **A**ction, **R**esult. Prepare real numbers.

### B1. Describe a performance problem you solved on the JVM.
**Sample (Ritesh Kumar):** *Situation:* Order service showed 4-second p99 pauses every few minutes. *Task:* Bring p99 under 500 ms. *Action:* Enabled GC logs, found large humongous allocations from loading big result sets into memory. Switched to streaming with pagination, reduced object churn, and tuned G1 region size. *Result:* p99 pause fell to 120 ms, heap usage dropped 40%, and no more OOM alerts.

### B2. A production incident (deadlock, leak, or outage).
Walk through detection (alerts), mitigation (restart/scale/rollback), diagnosis (thread dump showing two locks acquired in different order), fix (consistent lock ordering and timeouts), tests, and prevention (runbook, alerting).

### B3. How do you ensure code quality?
Code reviews with checklists, static analysis (SpotBugs, Sonar), unit and integration tests (JUnit, Testcontainers), CI gates, dependency scanning, and architecture tests (ArchUnit).

### B4. A migration you led (Java 8 → 17/21, monolith split).
Describe planning, automation (OpenRewrite), dependency upgrades, test coverage, canary rollout, and measured improvements (startup time, GC pauses, cost).

### B5. How do you mentor juniors in Java?
Pair on debugging with thread/heap dumps, explain equals/hashCode and immutability through real bugs, review for resource handling and exceptions, and share a learning path (collections → concurrency → JVM).

### B6. How do you handle disagreements on design?
Prototype and measure, document the decision (ADR), consider operational impact, and commit to the outcome.

### B7. How do you stay current?
Follow OpenJDK release notes and JEPs, conference talks, library changelogs, and run small experiments (for example virtual threads on a staging service).

---

# 📚 Part 11: Complete Coverage (Language + Libraries + Tooling + Mixed)

## Language
Primitives and wrappers, operators, control flow, methods and overloading, classes, constructors, static/final, inheritance, interfaces (default/static/private methods), abstract classes, inner/nested classes, generics, enums, annotations, exceptions, lambdas, method references, streams, records, sealed types, pattern matching, text blocks, `var`, modules, reflection.

## Standard library (high value)
`java.lang` (String, Math, Thread, Record), `java.util` (collections, Optional, Objects, Random), `java.util.concurrent`, `java.util.stream`, `java.time`, `java.io` and `java.nio.file`, `java.net.http`, `java.sql`, `java.text`, `java.security`, `javax.crypto`, `java.lang.invoke` (VarHandle, MethodHandle), `java.util.logging` (rarely used directly).

## Tooling and ecosystem
- **Build:** Maven, Gradle, Bazel.
- **Testing:** JUnit 5, Mockito, AssertJ, Testcontainers, WireMock, Cucumber, JMH, PIT, JaCoCo.
- **Frameworks:** Spring Boot, Quarkus, Micronaut, Jakarta EE, Vert.x, Helidon.
- **Persistence:** JDBC, JPA/Hibernate, jOOQ, MyBatis, Flyway, Liquibase, HikariCP.
- **Messaging:** Kafka clients, RabbitMQ, ActiveMQ, Pulsar.
- **Serialization:** Jackson, Gson, Protobuf, Avro.
- **Resilience/observability:** Resilience4j, Micrometer, OpenTelemetry, Logback, SLF4J.
- **Quality/security:** Checkstyle, SpotBugs, Error Prone, SonarQube, OWASP Dependency-Check, Snyk.
- **JVM diagnostics:** jcmd, jstack, jmap, jstat, JFR, JMC, async-profiler, MAT, VisualVM.
- **Distributions:** Temurin, Corretto, Zulu, Oracle JDK, GraalVM.

## Mixed topics
OOP and design principles, concurrency, JVM memory/GC, performance, testing, security, API design, distributed systems basics, containers and cloud deployment.

---

# 🔬 Part 12: JVM Internals

### I1. JVM architecture
Class loader subsystem → runtime data areas (heap, metaspace, thread stacks, PC registers, native method stacks, code cache) → execution engine (interpreter, JIT compilers, GC) → native interface (JNI).

### I2. Class loading, linking, initialization
Loading (find bytes, define class) → Linking (verification, preparation of static fields with defaults, resolution) → Initialization (run static initializers, once, thread-safe). Classes initialize lazily at first active use.

### I3. Bytecode and the operand stack
Java compiles to stack-based bytecode. Inspect with `javap -c -p MyClass`. Key instructions: `invokevirtual`, `invokeinterface`, `invokestatic`, `invokespecial`, `invokedynamic` (lambdas, string concatenation).

### I4. Object layout
An object has a header (mark word with hash, GC age, lock bits; class pointer; compressed oops by default on heaps below ~32 GB), then fields, with alignment padding to 8 bytes. Header overhead matters for millions of tiny objects.

### I5. Heap structure in G1
The heap is split into equal-sized regions assigned as Eden, Survivor, Old or Humongous (objects larger than half a region). G1 collects young regions, then mixed collections with the most garbage-rich old regions, aiming at a pause goal.

### I6. ZGC
Concurrent, region-based, colored pointers and load barriers allow compaction while the application runs; pause times are very short and independent of heap size. Generational ZGC (default mode in newer releases; verify) improves throughput.

### I7. Safepoints
Points where all Java threads stop for GC, deoptimization, biased lock revocation (removed), thread dumps. Long time-to-safepoint (for example counted loops without safepoint polls, or JNI) shows up as pauses in logs.

### I8. Monitors and locks
Objects have monitors for `synchronized`. Locking is optimized: thin (CAS on mark word) locks under low contention and inflated monitors under contention. Biased locking was removed in modern JDKs. Virtual threads may pin to carrier threads inside `synchronized` in older releases (verify the current state).

### I9. The Java Memory Model
Defines which writes are visible to which reads across threads via happens-before. Without synchronization, the compiler/CPU may reorder operations and caches may hide updates. `final` fields have special initialization-safety guarantees if `this` does not escape the constructor.

### I10. JIT optimizations
Inlining, escape analysis, scalar replacement, loop unrolling, null-check elimination, bounds-check elimination, devirtualization with class hierarchy analysis and inline caches. Tiered compilation levels 0 (interpreter) to 4 (C2).

### I11. String internals
Since Java 9, strings use compact strings (Latin-1 `byte[]` or UTF-16). The string pool lives on the heap. `String.hashCode` is cached. `+` concatenation compiles to `invokedynamic` (`StringConcatFactory`).

### I12. Lambdas internals
Lambdas compile to `invokedynamic` call sites bootstrapped by `LambdaMetafactory`, which spins a lightweight class at first use; non-capturing lambdas are singletons. This is why lambdas are not anonymous inner classes.

---

# 📊 Part 13: Reference Tables

### Collections cheat table
| Need | Choose |
|---|---|
| Ordered, index access | `ArrayList` |
| Fast unique lookup | `HashSet` / `HashMap` |
| Sorted order | `TreeSet` / `TreeMap` |
| Insertion order | `LinkedHashSet` / `LinkedHashMap` |
| Stack / queue | `ArrayDeque` |
| Priority | `PriorityQueue` |
| Thread-safe map | `ConcurrentHashMap` |
| Thread-safe list (read-heavy) | `CopyOnWriteArrayList` |
| Blocking queue | `ArrayBlockingQueue` / `LinkedBlockingQueue` |
| Enum keys | `EnumMap` |

### Functional interfaces
| Interface | Signature | Example |
|---|---|---|
| `Function<T,R>` | `R apply(T)` | `String::length` |
| `Predicate<T>` | `boolean test(T)` | `String::isBlank` |
| `Consumer<T>` | `void accept(T)` | `System.out::println` |
| `Supplier<T>` | `T get()` | `ArrayList::new` |
| `BiFunction<T,U,R>` | `R apply(T,U)` | `Integer::sum` |
| `UnaryOperator<T>` | `T apply(T)` | `String::trim` |
| `Runnable` / `Callable<V>` | `void run()` / `V call()` | tasks |

### Java versions (verify in official release notes)
| Version | Highlights |
|---|---|
| 8 (LTS) | Lambdas, streams, `Optional`, `java.time` |
| 9 | Modules, `List.of`, JShell |
| 10 / 11 (LTS) | `var`; HTTP client, `String` helpers |
| 14–16 | Switch expressions, text blocks, records, `instanceof` patterns |
| 17 (LTS) | Sealed classes, strong encapsulation |
| 21 (LTS) | Virtual threads, record patterns, pattern `switch`, sequenced collections |
| 22–24 | Incremental finalizations and previews (for example unnamed variables, stream gatherers, structured concurrency previews: verify) |
| 25 (LTS) | Next LTS; check release notes for finalized features |

### GC selection
| Goal | Choice |
|---|---|
| General purpose | G1 (default) |
| Lowest pauses, large heaps | ZGC |
| Max throughput batch | Parallel |
| Tiny containers / single CPU | Serial |

### Common JVM flags
| Flag | Purpose |
|---|---|
| `-Xms` / `-Xmx` | Initial / max heap |
| `-XX:MaxRAMPercentage` | Heap as % of container memory |
| `-XX:+UseG1GC` / `-XX:+UseZGC` | Choose collector |
| `-Xlog:gc*` | GC logging |
| `-XX:+HeapDumpOnOutOfMemoryError` | Dump on OOM |
| `-XX:StartFlightRecording` | Start JFR |
| `-Xss` | Thread stack size |
| `-XX:NativeMemoryTracking=summary` | Native memory tracking |


---

# 🔮 Part 14: Output & Prediction Questions

### O1. String pool
```java
String a = "hi"; String b = "hi"; String c = new String("hi");
System.out.println((a == b) + " " + (a == c) + " " + a.equals(c) + " " + (a == c.intern()));
```
**Output:** `true false true true`.

### O2. Integer cache
```java
Integer x = 127, y = 127, p = 128, q = 128;
System.out.println((x == y) + " " + (p == q));
```
**Output:** `true false`.

### O3. Floating point
```java
System.out.println(0.1 + 0.2);
System.out.println((float) 0.1 == 0.1);
```
**Output:** `0.30000000000000004` then `false`.

### O4. `finally` and return
```java
static int f() { try { return 1; } finally { System.out.print("F "); } }
System.out.println(f());
```
**Output:** `F 1`.

### O5. Static method hiding
```java
class A { static String who() { return "A"; } }
class B extends A { static String who() { return "B"; } }
A obj = new B();
System.out.println(obj.who());
```
**Output:** `A`. Static methods use the reference type.

### O6. Field hiding vs method overriding
```java
class P { String name = "P"; String get() { return "P"; } }
class C extends P { String name = "C"; String get() { return "C"; } }
P o = new C();
System.out.println(o.name + o.get());
```
**Output:** `PC`. Fields are not polymorphic; methods are.

### O7. Overload resolution
```java
static void m(Object o) { System.out.print("O"); }
static void m(String s) { System.out.print("S"); }
m(null);
```
**Output:** `S`. The most specific applicable overload is chosen.

### O8. Char arithmetic
```java
char c = 'a'; c++; System.out.println(c + " " + (c + 1) + " " + (char)(c + 1));
```
**Output:** `b 99 c`.

### O9. Integer overflow
```java
System.out.println(Integer.MAX_VALUE + 1);
```
**Output:** `-2147483648`.

### O10. Division and modulo
```java
System.out.println(7 / 2 + " " + (-7 / 2) + " " + (-7 % 3) + " " + 7 / 2.0);
```
**Output:** `3 -3 -1 3.5`.

### O11. `Arrays.asList` write-through
```java
Integer[] arr = {1, 2, 3};
List<Integer> l = Arrays.asList(arr);
l.set(0, 9);
System.out.println(arr[0]);
```
**Output:** `9`.

### O12. List removal ambiguity
```java
List<Integer> list = new ArrayList<>(List.of(10, 20, 30, 1));
list.remove(1);
list.remove(Integer.valueOf(1));
System.out.println(list);
```
**Output:** `[10, 30]`.

### O13. Stream laziness
```java
Stream.of(1, 2, 3).peek(x -> System.out.print("p" + x + " ")).filter(x -> x > 1).findFirst();
```
**Output:** `p1 p2 `. Processing stops after the first match.

### O14. Static initialization order
```java
class T {
    static { System.out.print("S "); }
    { System.out.print("I "); }
    T() { System.out.print("C "); }
}
new T(); new T();
```
**Output:** `S I C I C `.

### O15. Exception in static init
```java
class X { static int v = 1 / 0; }
try { new X(); } catch (Throwable t) { System.out.println(t.getClass().getSimpleName()); }
```
**Output:** `ExceptionInInitializerError` (later uses give `NoClassDefFoundError`).

### O16. Ternary unboxing NPE
```java
Integer a = null;
boolean flag = true;
int r = flag ? a : 0;
```
**Result:** `NullPointerException` (unboxing `null`).

### O17. String switch and `equals`
```java
String s = new String("a");
switch (s) { case "a" -> System.out.println("match"); default -> System.out.println("no"); }
```
**Output:** `match`.

### O18. `HashSet` with a mutable key
```java
Set<List<Integer>> set = new HashSet<>();
List<Integer> k = new ArrayList<>(List.of(1)); set.add(k); k.add(2);
System.out.println(set.contains(k));
```
**Output:** `false` (the hash changed after insertion).

### O19. Pattern matching switch
```java
Object o = 42;
String r = switch (o) { case Integer i when i > 40 -> "big"; case Integer i -> "int"; default -> "other"; };
```
**Output:** `big`.

### O20. Record equality
```java
record P(int x, int y) {}
System.out.println(new P(1, 2).equals(new P(1, 2)) + " " + new P(1, 2));
```
**Output:** `true P[x=1, y=2]`.

---

# ✅ Part 15: MCQs

**1.** Java source is compiled into:
A) Machine code B) Bytecode C) Assembly D) Interpreted text

**2.** Which is not a primitive?
A) int B) boolean C) String D) double

**3.** Which keyword prevents method overriding?
A) static B) final C) abstract D) private only

**4.** Which collection keeps insertion order and unique elements?
A) HashSet B) LinkedHashSet C) TreeSet D) ArrayList

**5.** What is the default GC in modern JDKs?
A) Serial B) Parallel C) G1 D) CMS

**6.** Which statement about `String` is true?
A) Mutable B) Immutable C) Always interned D) Thread-unsafe

**7.** `HashMap` allows:
A) No nulls B) One null key C) Many null keys D) No null values

**8.** Which handles resources automatically?
A) try-finally only B) try-with-resources C) `System.gc()` D) `finalize()`

**9.** What does `volatile` guarantee?
A) Atomicity of `i++` B) Visibility of writes across threads C) Mutual exclusion D) Faster code

**10.** Which is a checked exception?
A) `NullPointerException` B) `IOException` C) `IllegalArgumentException` D) `ArithmeticException`

**11.** Which interface represents a task returning a value?
A) `Runnable` B) `Callable` C) `Comparable` D) `Iterator`

**12.** `Optional` should primarily be used for:
A) Fields B) Method parameters C) Return values D) Serialization

**13.** Which feature was finalized in Java 21?
A) Lambdas B) Virtual threads C) Generics D) Modules

**14.** Which tool takes a thread dump?
A) `jstack` / `jcmd Thread.print` B) `javac` C) `javadoc` D) `jar`

**15.** Records provide automatically:
A) Setters B) `equals`, `hashCode`, `toString` C) Inheritance D) Mutable fields

**16.** Which statement about `ConcurrentHashMap` is true?
A) Allows null keys B) Disallows null keys and values C) Locks the entire map D) Is not thread-safe

**17.** Which of these causes `ConcurrentModificationException`?
A) Removing items in a `for-each` over an `ArrayList` B) Using `Iterator.remove()` C) Using a `CopyOnWriteArrayList` D) Using streams

**18.** `static` members belong to:
A) Instances B) The class C) Threads D) Packages only

**19.** Which keyword is used to inherit from a class?
A) implements B) extends C) inherits D) uses

**20.** The `hashCode` contract: equal objects must have:
A) Different hashes B) Equal hashes C) Hashes in order D) No hashes

**21.** Which pool type can create unbounded threads?
A) `newFixedThreadPool` B) `newCachedThreadPool` C) `newSingleThreadExecutor` D) `ScheduledThreadPool` with fixed size

**22.** What is the result of `Integer.MAX_VALUE + 1`?
A) Exception B) Overflow to a negative number C) 2147483648 D) 0

**23.** Which API is best for dates and times?
A) `java.util.Date` B) `java.time` C) `Calendar` D) `SimpleDateFormat`

**24.** Which is not a GC root?
A) Static field B) Thread stack local variable C) Unreachable object D) JNI reference

**25.** Which Maven phase runs tests?
A) compile B) test C) package D) install

**26.** Which pattern best describes `Comparator` injection?
A) Singleton B) Strategy C) Observer D) Proxy

**27.** What does `PECS` stand for?
A) Producer Extends, Consumer Super B) Public Extends Class Super C) Primitive Enum Class Set D) Pointer Entry Cache Set

**28.** Which JVM flag sets the maximum heap?
A) `-Xms` B) `-Xmx` C) `-Xss` D) `-XX:+Heap`

**29.** Which of these can be a `switch` expression selector in modern Java?
A) `String` B) `enum` C) `int` D) All of these

**30.** Virtual threads are best for:
A) CPU-bound loops B) Blocking I/O with many concurrent tasks C) Replacing GC D) Native code

**31.** A deadlock requires which condition?
A) Circular wait B) No threads C) Single lock only D) Atomic variables

**32.** Which collection is best for a FIFO queue without synchronization?
A) `Stack` B) `ArrayDeque` C) `Vector` D) `Hashtable`

**33.** What is type erasure?
A) Removing unused types B) Generic type info removed at runtime C) Erasing a class D) Garbage collection

**34.** Which interface allows `try-with-resources`?
A) `Closeable`/`AutoCloseable` B) `Serializable` C) `Cloneable` D) `Runnable`

**35.** Which approach prevents SQL injection?
A) String concatenation B) `PreparedStatement` C) `Statement` with escaping only D) Logging queries

**36.** Which Java feature restricts which classes can extend a type?
A) `final` only B) `sealed` C) `static` D) `transient`

**37.** `Thread.interrupt()` does what?
A) Kills the thread B) Sets the interrupt flag and wakes blocking calls C) Pauses it forever D) Throws `Error`

**38.** `BigDecimal` should be created from:
A) A `double` literal B) A `String` C) A `float` D) A `char`

**39.** Which tool profiles production with low overhead?
A) Java Flight Recorder B) `System.out` C) Debugger breakpoints D) `printStackTrace`

**40.** Which statement is true for `HashMap` since Java 8?
A) Buckets can become red-black trees B) Always uses linked lists C) It is synchronized D) Keeps sorted order

### Answer key
1-B, 2-C, 3-B, 4-B, 5-C, 6-B, 7-B, 8-B, 9-B, 10-B, 11-B, 12-C, 13-B, 14-A, 15-B, 16-B, 17-A, 18-B, 19-B, 20-B, 21-B, 22-B, 23-B, 24-C, 25-B, 26-B, 27-A, 28-B, 29-D, 30-B, 31-A, 32-B, 33-B, 34-A, 35-B, 36-B, 37-B, 38-B, 39-A, 40-A

---

# ⚠️ Part 16: Common Mistakes

> Each mistake has four parts: ❌ wrong code, 🤔 why it is a problem, ✅ correct code, 💬 what to say in an interview.

### Mistake 1: Comparing strings with `==`
❌
```java
if (role == "ADMIN") { ... }
```
🤔 `==` compares references, so it may fail when the string comes from input or a database.
✅
```java
if ("ADMIN".equals(role)) { ... }
```
💬 "`equals` for content; putting the constant first also avoids NPEs."

### Mistake 2: Overriding `equals` without `hashCode`
❌
```java
class User { String email; @Override public boolean equals(Object o) { ... } }
```
🤔 Hash-based collections break: equal objects land in different buckets.
✅
```java
@Override public int hashCode() { return Objects.hash(email); }
// or use a record
```
💬 "Equal objects must have equal hash codes; I implement both or use a record."

### Mistake 3: Swallowing exceptions
❌
```java
try { save(); } catch (Exception e) { }
```
🤔 Failures disappear and bugs become impossible to trace.
✅
```java
try { save(); } catch (IOException e) { throw new StorageException("save failed", e); }
```
💬 "Catch specific exceptions, wrap with the cause, and log once at the boundary."

### Mistake 4: Not closing resources
❌
```java
Connection c = ds.getConnection();
ResultSet rs = c.createStatement().executeQuery(sql);
```
🤔 Connections leak and the pool runs dry.
✅
```java
try (Connection c = ds.getConnection(); PreparedStatement ps = c.prepareStatement(sql); ResultSet rs = ps.executeQuery()) { ... }
```
💬 "try-with-resources closes everything, even on errors."

### Mistake 5: Using `double` for money
❌
```java
double total = 0.1 + 0.2;
```
🤔 Binary floating point cannot represent decimals exactly.
✅
```java
BigDecimal total = new BigDecimal("0.10").add(new BigDecimal("0.20"));
```
💬 "Money uses `BigDecimal` from strings, or integer minor units."

### Mistake 6: Unsafe shared mutable state
❌
```java
private int count;
public void inc() { count++; }          // from many threads
```
🤔 `count++` is read-modify-write and loses updates.
✅
```java
private final AtomicInteger count = new AtomicInteger();
public void inc() { count.incrementAndGet(); }
```
💬 "I prefer immutability, then atomics or concurrent collections, then locks."

### Mistake 7: Using non-thread-safe classes concurrently
❌
```java
private static final SimpleDateFormat FMT = new SimpleDateFormat("yyyy-MM-dd");
```
🤔 `SimpleDateFormat` is not thread-safe and produces corrupted dates.
✅
```java
private static final DateTimeFormatter FMT = DateTimeFormatter.ISO_LOCAL_DATE;
```
💬 "`java.time` classes are immutable and thread-safe."

### Mistake 8: Unbounded thread pools or caches
❌
```java
ExecutorService ex = Executors.newCachedThreadPool();
Map<String, Object> cache = new HashMap<>();   // grows forever
```
🤔 Traffic spikes create thousands of threads; caches cause OOM.
✅
```java
new ThreadPoolExecutor(8, 8, 0, TimeUnit.SECONDS, new ArrayBlockingQueue<>(200), new ThreadPoolExecutor.CallerRunsPolicy());
Caffeine.newBuilder().maximumSize(10_000).expireAfterWrite(Duration.ofMinutes(5)).build();
```
💬 "Everything is bounded: threads, queues, caches."

### Mistake 9: Modifying a collection while iterating
❌
```java
for (String s : list) if (s.isEmpty()) list.remove(s);
```
🤔 Throws `ConcurrentModificationException`.
✅
```java
list.removeIf(String::isEmpty);
```
💬 "`removeIf` or the iterator's `remove`."

### Mistake 10: Ignoring `InterruptedException`
❌
```java
try { Thread.sleep(1000); } catch (InterruptedException e) { }
```
🤔 Cancellation signals are lost.
✅
```java
try { Thread.sleep(1000); } catch (InterruptedException e) { Thread.currentThread().interrupt(); throw new IllegalStateException(e); }
```
💬 "Restore the interrupt flag or propagate."

### Mistake 11: Returning `null` for collections and overusing `Optional.get()`
❌
```java
List<User> find() { return null; }
user.get().name();
```
🤔 Callers must remember null checks; `get()` throws if empty.
✅
```java
List<User> find() { return List.of(); }
repo.find(id).map(User::name).orElseThrow(() -> new NotFoundException("user"));
```
💬 "Return empty collections; use `Optional` as a return type and handle absence explicitly."

### Mistake 12: String concatenation in loops
❌
```java
String s = ""; for (String x : items) s += x;
```
🤔 Creates many intermediate strings (O(n²)).
✅
```java
StringBuilder sb = new StringBuilder(); for (String x : items) sb.append(x);
```
💬 "`StringBuilder` or `String.join`/`Collectors.joining`."

### Mistake 13: Catching `Throwable`/`Exception` too broadly and logging with `printStackTrace`
❌
```java
catch (Exception e) { e.printStackTrace(); }
```
🤔 Goes to stderr, no context, no log levels.
✅
```java
catch (SQLException e) { log.error("query failed id={}", id, e); throw new DataAccessException(e); }
```
💬 "Structured logging with context, specific exception types."

### Mistake 14: Not setting timeouts on network calls
❌
```java
HttpClient.newHttpClient().send(req, handler);
```
🤔 Calls can hang forever.
✅
```java
HttpClient c = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(3)).build();
req = HttpRequest.newBuilder(uri).timeout(Duration.ofSeconds(5)).build();
```
💬 "Every remote call has connect and read timeouts."

### Mistake 15: Leaking `ThreadLocal` values in thread pools
❌
```java
static final ThreadLocal<User> CURRENT = new ThreadLocal<>();
CURRENT.set(user);        // never removed
```
🤔 Pooled threads keep stale data and memory.
✅
```java
try { CURRENT.set(user); handle(); } finally { CURRENT.remove(); }
```
💬 "Always remove in `finally`, or avoid ThreadLocal."

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

### Signal table 1: Answer quality
| Topic | Weak answer | Strong answer |
|---|---|---|
| "How does HashMap work?" | "Key-value storage." | "Buckets by hash, `equals` for matches, treeification at 8 entries, resize at 0.75 load, keys must be immutable, not thread-safe." |
| "volatile vs synchronized?" | "Both are for threads." | "`volatile` gives visibility/ordering for one variable; `synchronized` gives mutual exclusion plus visibility; `i++` needs atomics or locks." |
| "How do you debug a hang?" | "Restart it." | "Take several thread dumps, look for BLOCKED/WAITING patterns and deadlocks, check pools and DB connections, then fix lock order or add timeouts." |
| "GC tuning?" | "Increase heap." | "Read GC logs, find allocation rate and pause causes, pick G1/ZGC by goal, fix leaks first, size containers with MaxRAMPercentage." |
| "Virtual threads?" | "Faster threads." | "Cheap threads for blocking I/O concurrency; no speedup for CPU work; limit concurrency to dependencies; watch pinning and ThreadLocal use." |

### Signal table 2: Behaviors that stand out
| Weak behavior | Strong behavior |
|---|---|
| Memorizes APIs | Explains trade-offs and failure modes |
| Optimizes by guessing | Measures with JMH, JFR and profilers |
| Uses mutable shared state | Prefers immutability and bounded concurrency |
| Ignores operations | Thinks about GC logs, thread dumps, containers and observability |
| Over-engineers | Chooses the simplest design that meets the requirements |

### Signal table 3: Phrases that show depth
- "Java is pass-by-value; for objects the value is the reference."
- "Equal objects need equal hash codes, and keys must be immutable."
- "Everything is bounded: threads, queues, caches, connections."
- "I take thread dumps three times, seconds apart, to see what is stuck."
- "Measure with JMH or JFR; the JIT makes naive benchmarks lie."
- "Move LTS to LTS and automate migrations with OpenRewrite."

### Signal table 4: Questions to ask the interviewer
- Which JDK version and GC do you run in production?
- How do you monitor JVM health (GC, threads, pools)?
- How are dependencies upgraded and vulnerabilities handled?
- What is the testing and release process?

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### 1. The 30-second explanation
Java compiles to bytecode that the JVM runs with a JIT compiler and a garbage collector. It is statically typed and object-oriented, with a huge ecosystem and strong tooling. Modern Java adds records, sealed types, pattern matching, and virtual threads, making code shorter and concurrency simpler.

### 2. Core mental models
- Pass-by-value (references are values).
- Objects on the heap, locals on the stack.
- `equals` + `hashCode` define identity in collections.
- Visibility needs happens-before (`volatile`, `synchronized`, atomics, concurrent classes).
- GC frees unreachable objects; leaks are reachable-but-unused objects.

### 3. Concurrency choice table
| Need | Tool |
|---|---|
| Simple tasks | `ExecutorService` |
| Composing async results | `CompletableFuture` |
| Many blocking I/O tasks (21+) | Virtual threads |
| Counters | `AtomicLong` / `LongAdder` |
| Shared map | `ConcurrentHashMap` |
| Producer/consumer | `BlockingQueue` |
| Limit concurrency | `Semaphore` |

### 4. Production checklist
- [ ] Supported LTS JDK, container-aware flags (`MaxRAMPercentage`)
- [ ] GC logs and JFR enabled or available on demand
- [ ] Bounded thread pools, queues, caches, DB pools
- [ ] Timeouts, retries with jitter, circuit breakers
- [ ] Structured logs with correlation IDs; metrics and traces
- [ ] Parameterized queries; no unsafe deserialization
- [ ] Heap dump on OOM; thread dump procedure documented
- [ ] Graceful shutdown; health and readiness checks
- [ ] Dependency scanning and update automation
- [ ] Tests: unit, integration (Testcontainers), load

### 5. Debug toolbox
| Symptom | Tool |
|---|---|
| Hang | `jcmd Thread.print` (repeat 3x) |
| High CPU | async-profiler / JFR / `top -H` |
| Memory growth | Heap dump + MAT |
| GC pauses | `-Xlog:gc*` |
| Slow code | JFR + JMH |
| Native memory | NMT |

### 6. Top 20 one-liners to memorize
1. Java is pass-by-value.
2. `equals` and `hashCode` go together.
3. Strings are immutable; use `StringBuilder` in loops.
4. Prefer composition over inheritance.
5. try-with-resources for every closeable.
6. Checked exceptions: handle or declare; wrap with cause.
7. `volatile` is visibility, not atomicity.
8. `ConcurrentHashMap` needs atomic methods for check-then-act.
9. Bound your pools and caches.
10. `Optional` is for return values.
11. Records for data carriers; sealed + pattern `switch` for variants.
12. `BigDecimal` from strings for money.
13. `java.time`, never `Date`/`SimpleDateFormat`.
14. G1 default, ZGC for low latency.
15. Virtual threads help blocking I/O, not CPU.
16. Thread dumps and heap dumps are your best friends.
17. Measure with JMH; never trust naive benchmarks.
18. Always restore the interrupt flag.
19. Use LTS releases and upgrade regularly.
20. Timeouts on every remote call.

### 7. The 60-second answer: "Why Java?"
"Java offers a mature, fast, strongly typed platform with excellent tooling, observability and a huge library ecosystem. Modern releases removed much boilerplate with records, pattern matching and virtual threads, and the JVM gives predictable performance with great diagnostics. It's a safe choice for large, long-lived systems, especially when paired with Spring Boot and solid operational practices."

### 8. Final revision order
OOP and language basics → collections and equals/hashCode → exceptions and resources → generics and streams → concurrency and the memory model → JVM memory, GC and diagnostics → modern Java features → design, testing and production practice.

