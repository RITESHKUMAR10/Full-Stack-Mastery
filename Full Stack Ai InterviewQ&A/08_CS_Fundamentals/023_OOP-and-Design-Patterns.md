# OOP & Design Patterns Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Language note:** Code examples use **TypeScript** (matches the full-stack path in this repo). Where Java, Python or C# differ in a way that matters in interviews, it is marked. TypeScript has structural typing and no true runtime interfaces, so some answers mention that. Examples use the sample name **Ritesh Kumar**.
> This file covers the four pillars, classes and objects, SOLID, composition vs inheritance, UML basics, all GoF design patterns (creational, structural, behavioral), enterprise and architectural patterns, anti-patterns, low-level design (LLD) problems, testing OOP code, and how OOP compares with functional style.

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
- [Part 11: Complete Coverage (Concepts + Patterns + Mixed)](#-part-11-complete-coverage-concepts--patterns--mixed)
- [Part 12: Internals (How OOP Works Under the Hood)](#-part-12-internals-how-oop-works-under-the-hood)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is Object-Oriented Programming (OOP)?
A programming style that models software as **objects**: units that bundle **data (state)** and **behavior (methods)**. Programs are built by objects collaborating through messages (method calls). Goals: reuse, maintainability, modeling real-world concepts, and managing complexity.

### Q2. What are a class and an object?
A **class** is a blueprint (type definition). An **object** (instance) is a concrete thing created from it, with its own state.
```ts
class User {
  constructor(public name: string, private age: number) {}
  greet(): string { return `Hi, ${this.name}`; }
}
const u = new User("Ritesh Kumar", 28);   // object
```

### Q3. What are the four pillars of OOP? *(Must-know)*
1. **Encapsulation**: hide internal state, expose a controlled interface.
2. **Abstraction**: expose *what* it does, hide *how*.
3. **Inheritance**: a class acquires fields and methods of another (is-a).
4. **Polymorphism**: one interface, many implementations; the right method runs at runtime.

### Q4. What is encapsulation? How do you achieve it?
Bundling data with the methods that operate on it, and restricting direct access. Use access modifiers and getters/setters (or methods that enforce rules).
```ts
class Account {
  private balance = 0;
  deposit(x: number) { if (x <= 0) throw new Error("invalid"); this.balance += x; }
  getBalance() { return this.balance; }
}
```
Benefit: invariants (e.g. balance never negative) are protected in one place.

### Q5. Access modifiers
| Modifier | Meaning |
|---|---|
| `public` | accessible everywhere (default in TS/Python by convention) |
| `protected` | the class and its subclasses |
| `private` | only inside the class (TS compile-time; `#field` is truly private at runtime) |
| package-private (Java default) | same package |
Python uses naming conventions (`_x`, `__x` name mangling), not enforcement.

### Q6. What is abstraction? Abstract class vs interface *(Must-know)*
Abstraction hides complexity behind a simple contract.
- **Abstract class**: can hold state and concrete methods plus abstract methods; single inheritance (in Java/C#/TS); use for shared base behavior ("is-a").
- **Interface**: a pure contract of capabilities ("can-do"); a class can implement many. Modern Java/C# interfaces allow default methods.
```ts
interface Payable { pay(amount: number): void; }
abstract class Employee {
  constructor(protected name: string) {}
  abstract salary(): number;
  describe() { return `${this.name}: ${this.salary()}`; }
}
```

### Q7. What is inheritance? Types
Child class reuses and extends a parent class. Types: single, multilevel, hierarchical (multiple children), multiple (a class with several parents: C++, Python; not allowed for classes in Java/C#/TS), hybrid.
```ts
class Animal { speak() { return "..."; } }
class Dog extends Animal { speak() { return "Woof"; } }
```

### Q8. What is polymorphism? Compile-time vs runtime
- **Compile-time (static)**: method **overloading**, operator overloading. Decided by the compiler from argument types.
- **Runtime (dynamic)**: method **overriding**. The actual object's method runs, decided at call time.
```ts
const a: Animal = new Dog();
a.speak();        // "Woof": runtime dispatch
```
JavaScript has no true overloading; TypeScript supports overload *signatures* with a single implementation.

### Q9. Overloading vs overriding
Overloading: same name, different parameters, same class. Overriding: subclass redefines a parent's method with the same signature. Overriding enables runtime polymorphism.

### Q10. What is a constructor? Types
Special method that initializes a new object. Types: default (no args), parameterized, copy constructor (C++, Java by convention). JS/TS allow one `constructor` per class; use static factory methods for alternatives. Python uses `__init__`.

### Q11. What is `this` (or `self`)?
A reference to the current object. In JavaScript, `this` depends on **how the function is called**, not where it is defined (arrow functions capture `this` lexically). Python uses explicit `self`.

### Q12. What are static members?
Belong to the class, not instances. Shared state or utility functions.
```ts
class Counter { static count = 0; constructor() { Counter.count++; } }
```
Overusing static makes code hard to test (global state).

### Q13. Method vs function
A method is a function attached to an object or class and operates on its state (implicit `this`).

### Q14. Getters and setters
Controlled access to fields; allow validation, computed values and lazy loading.
```ts
class Temp {
  private _c = 0;
  get fahrenheit() { return this._c * 9 / 5 + 32; }
  set celsius(v: number) { if (v < -273.15) throw new Error("bad"); this._c = v; }
}
```

### Q15. Constructors and inheritance: `super`
`super(...)` calls the parent constructor (must be called before using `this` in a derived constructor in JS/TS). `super.method()` calls the parent's version of a method.

### Q16. What is an interface in TypeScript? (structural typing)
TypeScript checks **shape**, not declared names (structural typing). An object matches an interface if it has the needed members, even without `implements`. Interfaces vanish at runtime.
```ts
interface Named { name: string }
const x: Named = { name: "Ritesh Kumar", extra: 1 } as Named;
```

### Q17. Association, aggregation, composition
- **Association**: objects know each other (Teacher–Student).
- **Aggregation**: "has-a", weak ownership; parts can exist without the whole (Team–Player).
- **Composition**: "has-a", strong ownership; parts die with the whole (House–Room).

### Q18. "Is-a" vs "has-a"
Inheritance models is-a (Dog is an Animal). Composition models has-a (Car has an Engine). Prefer composition when the is-a relationship is not strictly true for all behavior.

### Q19. Object lifecycle: creation, use, destruction
Creation via constructor; used through methods; destroyed by garbage collection (Java, JS, Python, C#) or manually/RAII (C++ destructors). Do not rely on finalizers for resource cleanup; use `try/finally`, `using`, `with`, or `close()`.

### Q20. What is an abstract method / virtual method?
Abstract: declared without a body; subclasses must implement it. Virtual (C++/C#): can be overridden; calls resolve at runtime. In Java all non-final, non-static, non-private instance methods are virtual by default.

### Q21. `final` / `sealed` / `readonly`
- Java `final` class: cannot be extended; `final` method: cannot be overridden; `final` variable: cannot be reassigned.
- C# `sealed`, Kotlin classes are final by default.
- TS `readonly` property: assignable only at declaration/constructor.

### Q22. Method chaining (fluent interface)
Methods return `this` so calls chain.
```ts
class Query {
  private parts: string[] = [];
  select(f: string) { this.parts.push(`SELECT ${f}`); return this; }
  from(t: string) { this.parts.push(`FROM ${t}`); return this; }
  build() { return this.parts.join(" "); }
}
new Query().select("*").from("users").build();
```

### Q23. Immutability and value objects
An immutable object never changes after creation; "changes" create a new object. Benefits: thread safety, easier reasoning, safe as map keys. Value objects (Money, Email, DateRange) are compared by value, not identity.
```ts
class Money {
  constructor(readonly amount: number, readonly currency: string) {}
  add(o: Money) { return new Money(this.amount + o.amount, this.currency); }
}
```

### Q24. Equality: identity vs value
`===` / `==` on objects compares references (identity). Define `equals` (Java), `__eq__` (Python), or compare fields yourself for value equality. In Java, overriding `equals` requires overriding `hashCode`.

### Q25. What are exceptions in OOP code?
Objects that signal errors. Create custom exception classes for domain errors (`InsufficientFundsError extends Error`), catch specific types, do not swallow errors, and clean up with `finally`.

### Q26. What is the difference between a struct and a class?
C#/C++: struct is a value type (copied on assignment, C# stack/inline) with limited inheritance; class is a reference type. In C++ the only difference is default access (struct public, class private). TypeScript/Java have no struct.

### Q27. Enums
A fixed set of named constants. In Java, enums are full classes with fields and methods (great for strategy-like behavior). In TS, prefer string-literal unions for most cases.
```ts
type Role = "admin" | "editor" | "viewer";
```

### Q28. Generics
Write classes and functions that work with many types while staying type-safe.
```ts
class Box<T> { constructor(private v: T) {} get(): T { return this.v; } }
```

### Q29. What are design patterns? Why use them?
Reusable, named solutions to recurring design problems (Gang of Four book, 1994, 23 patterns). They give a shared vocabulary ("use a Strategy here"), proven structure, and faster design discussions. They are not code to copy; they are ideas to adapt.

### Q30. Three categories of GoF patterns
- **Creational**: how objects are created (Singleton, Factory Method, Abstract Factory, Builder, Prototype).
- **Structural**: how objects are composed (Adapter, Decorator, Facade, Proxy, Composite, Bridge, Flyweight).
- **Behavioral**: how objects interact (Strategy, Observer, Command, State, Template Method, Iterator, Chain of Responsibility, Mediator, Memento, Visitor, Interpreter).

### Q31. Singleton *(Must-know)*
Exactly one instance with a global access point.
```ts
class Config {
  private static instance?: Config;
  private constructor(public readonly env: string) {}
  static get(): Config { return (Config.instance ??= new Config("prod")); }
}
```
Problems: hidden global state, hard to test, concurrency (needs thread-safe init in Java/C#). Alternatives: dependency injection with a singleton **scope**, or a module-level instance (in JS modules are singletons already).

### Q32. Factory Method
Define an interface for creating an object, let subclasses or a function decide which class to instantiate.
```ts
interface Notifier { send(msg: string): void }
class Email implements Notifier { send(m: string) { console.log("email", m); } }
class Sms implements Notifier { send(m: string) { console.log("sms", m); } }
function createNotifier(kind: "email" | "sms"): Notifier {
  return kind === "email" ? new Email() : new Sms();
}
```

### Q33. Observer *(Must-know)*
One-to-many dependency: when the subject changes, all observers are notified. Used in event emitters, UI frameworks, pub/sub.
```ts
class Subject<T> {
  private subs = new Set<(v: T) => void>();
  subscribe(fn: (v: T) => void) { this.subs.add(fn); return () => this.subs.delete(fn); }
  emit(v: T) { this.subs.forEach(fn => fn(v)); }
}
```
Watch for memory leaks (forgotten unsubscribe) and notification order.

### Q34. Strategy *(Must-know)*
Encapsulate interchangeable algorithms behind one interface; choose at runtime. Replaces big `if/else` or `switch` chains.
```ts
interface Discount { apply(price: number): number }
const tenPercent: Discount = { apply: p => p * 0.9 };
const flat50: Discount = { apply: p => Math.max(0, p - 50) };
class Cart { constructor(private d: Discount) {} total(p: number) { return this.d.apply(p); } }
```
In languages with first-class functions the strategy can simply be a function.

### Q35. Decorator pattern (not the TS `@decorator` syntax)
Wrap an object to add behavior dynamically while keeping the same interface. Alternative to subclass explosion.
```ts
interface Coffee { cost(): number }
class Plain implements Coffee { cost() { return 50; } }
class Milk implements Coffee { constructor(private c: Coffee) {} cost() { return this.c.cost() + 10; } }
new Milk(new Milk(new Plain())).cost();   // 70
```
Java I/O streams (`BufferedReader(new FileReader(...))`) and Express middleware are well-known examples.

### Q36. Adapter
Converts one interface into another that clients expect.
```ts
class LegacyPay { makePayment(cents: number) { /* ... */ } }
interface Pay { pay(dollars: number): void }
class PayAdapter implements Pay {
  constructor(private l: LegacyPay) {}
  pay(d: number) { this.l.makePayment(d * 100); }
}
```

### Q37. Facade
A simple interface in front of a complex subsystem.
```ts
class OrderFacade {
  constructor(private inv: Inventory, private pay: Payments, private ship: Shipping) {}
  place(o: Order) { this.inv.reserve(o); this.pay.charge(o); this.ship.schedule(o); }
}
```

### Q38. Builder
Construct complex objects step by step; avoids telescoping constructors.
```ts
class RequestBuilder {
  private r: any = { method: "GET", headers: {} };
  url(u: string) { this.r.url = u; return this; }
  method(m: string) { this.r.method = m; return this; }
  header(k: string, v: string) { this.r.headers[k] = v; return this; }
  build() { return Object.freeze({ ...this.r }); }
}
```
In TS/JS an options object often replaces a builder.

### Q39. Template Method
Base class defines the skeleton of an algorithm; subclasses fill in steps.
```ts
abstract class Report {
  generate() { return this.header() + this.body() + this.footer(); }
  protected header() { return "== Report ==\n"; }
  protected abstract body(): string;
  protected footer() { return "\n== End =="; }
}
```

### Q40. Iterator
Access elements of a collection sequentially without exposing its internals. Built into languages: JS `Symbol.iterator`, Java `Iterable`, Python `__iter__`.
```ts
class Range implements Iterable<number> {
  constructor(private a: number, private b: number) {}
  *[Symbol.iterator]() { for (let i = this.a; i < this.b; i++) yield i; }
}
```

---

# 🔵 Part 2: Junior (1–3 years)

### Q41. SOLID principles *(Must-know)*
- **S**: Single Responsibility: a class has one reason to change.
- **O**: Open/Closed: open for extension, closed for modification.
- **L**: Liskov Substitution: subtypes must be usable wherever the base type is expected without breaking behavior.
- **I**: Interface Segregation: many small interfaces beat one fat interface.
- **D**: Dependency Inversion: depend on abstractions, not concretions; high-level modules should not depend on low-level ones.

### Q42. Single Responsibility Principle: example
Bad: `Invoice` calculates totals, formats PDF, and saves to the database. Good:
```ts
class Invoice { constructor(readonly items: Item[]) {} total() { /* ... */ return 0; } }
class InvoicePrinter { print(i: Invoice) { /* format */ } }
class InvoiceRepository { save(i: Invoice) { /* persist */ } }
```
"Reason to change" means one actor/stakeholder (accounting, design, DBA).

### Q43. Open/Closed Principle: example
Instead of adding another `if (type === ...)` each time, add a new class.
```ts
interface Shape { area(): number }
class Circle implements Shape { constructor(private r: number) {} area() { return Math.PI * this.r ** 2; } }
class Square implements Shape { constructor(private s: number) {} area() { return this.s ** 2; } }
const totalArea = (shapes: Shape[]) => shapes.reduce((s, x) => s + x.area(), 0);   // never changes
```

### Q44. Liskov Substitution Principle: classic violation *(Must-know)*
`Square extends Rectangle`: setting width also sets height, which breaks code that expects width and height to be independent.
```ts
function resize(r: Rectangle) { r.setWidth(5); r.setHeight(4); return r.area(); } // expects 20
// with Square (setWidth sets both), result is 16: contract broken
```
Rules: subclass must not strengthen preconditions, must not weaken postconditions, must preserve invariants, and must not throw unexpected exceptions. Fix: do not inherit; model both as `Shape`, or make them immutable.

### Q45. Interface Segregation: example
Bad: `interface Worker { work(); eat(); }` forces `Robot` to implement `eat`. Good: `Workable` and `Eatable` separately.

### Q46. Dependency Inversion vs Dependency Injection vs IoC
- **DIP** (principle): depend on abstractions.
- **DI** (technique): pass dependencies in (constructor, setter, parameter) rather than creating them inside.
- **IoC** (idea): a framework or container controls object creation and wiring (Spring, NestJS, Angular).
```ts
class OrderService {
  constructor(private repo: OrderRepo, private mailer: Mailer) {}   // injected abstractions
}
```
DI makes unit tests easy: pass fakes.

### Q47. Composition over inheritance *(Must-know)*
Inheritance couples a subclass to its parent's implementation (fragile base class problem) and creates deep hierarchies. Composition combines small behaviors by holding references, which is more flexible and testable.
```ts
class Engine { start() {} }
class Car { constructor(private engine: Engine) {} drive() { this.engine.start(); } }
```
Use inheritance only for true, stable is-a relationships and shallow hierarchies.

### Q48. Coupling and cohesion
- **Coupling**: how much modules depend on each other. Aim for **low**.
- **Cohesion**: how closely a module's parts belong together. Aim for **high**.

### Q49. Law of Demeter (principle of least knowledge)
A method should talk only to: itself, its parameters, objects it creates, and its direct components. Avoid train wrecks like `order.getCustomer().getAddress().getCity()`. Add a method (`order.shippingCity()`) instead.

### Q50. Tell, Don't Ask
Tell objects what to do instead of pulling their data out and deciding for them. Keeps logic with the data it belongs to.

### Q51. DRY, KISS, YAGNI
- **DRY**: don't repeat knowledge (not just code). Beware wrong abstractions made from accidental similarity.
- **KISS**: keep it simple.
- **YAGNI**: don't build what you do not need yet.

### Q52. Abstract Factory
Creates **families** of related objects without specifying concrete classes.
```ts
interface Button { render(): string }
interface Checkbox { render(): string }
interface UIFactory { button(): Button; checkbox(): Checkbox }
class DarkFactory implements UIFactory {
  button() { return { render: () => "dark button" }; }
  checkbox() { return { render: () => "dark checkbox" }; }
}
```
Use when products must match (all dark, or all light).

### Q53. Prototype
Create new objects by cloning an existing one. Useful when construction is expensive. JS has `structuredClone`, `Object.create`, and prototypal inheritance built in. Java: `Cloneable` is considered flawed; prefer copy constructors. Beware shallow vs deep copy.

### Q54. Proxy
A stand-in controlling access to another object: lazy loading (virtual proxy), access control (protection proxy), caching, logging, remote proxy (RPC stubs). JS has a built-in `Proxy` object.
```ts
class CachedApi implements Api {
  private cache = new Map<string, string>();
  constructor(private real: Api) {}
  get(k: string) { return this.cache.get(k) ?? (this.cache.set(k, this.real.get(k)), this.cache.get(k)!); }
}
```

### Q55. Composite
Treat individual objects and groups uniformly (tree structure). File systems, UI component trees, org charts.
```ts
interface FsNode { size(): number }
class File implements FsNode { constructor(private s: number) {} size() { return this.s; } }
class Dir implements FsNode {
  private children: FsNode[] = [];
  add(n: FsNode) { this.children.push(n); return this; }
  size() { return this.children.reduce((s, c) => s + c.size(), 0); }
}
```

### Q56. Command
Encapsulate a request as an object: supports undo/redo, queues, logging, macros.
```ts
interface Command { execute(): void; undo(): void }
class AddText implements Command {
  constructor(private doc: { text: string }, private t: string) {}
  execute() { this.doc.text += this.t; }
  undo() { this.doc.text = this.doc.text.slice(0, -this.t.length); }
}
```

### Q57. State
Object changes behavior when its internal state changes; each state is a class. Replaces large state `switch` statements (vending machine, order status, media player).
```ts
interface State { next(o: Order): void }
class Pending implements State { next(o: Order) { o.state = new Paid(); } }
class Paid implements State { next(o: Order) { o.state = new Shipped(); } }
class Shipped implements State { next(_: Order) { throw new Error("final"); } }
class Order { state: State = new Pending(); advance() { this.state.next(this); } }
```
State vs Strategy: State transitions itself; Strategy is chosen by the client and stays.

### Q58. Chain of Responsibility
Pass a request along a chain of handlers until one handles it. Express/Koa middleware, logging levels, approval workflows.
```ts
type Handler = (req: Req, next: () => void) => void;
function run(handlers: Handler[], req: Req) {
  let i = 0;
  const next = () => { const h = handlers[i++]; if (h) h(req, next); };
  next();
}
```

### Q59. Mediator
Centralizes communication between objects so they do not reference each other (chat room, air traffic control, UI dialogs). Reduces many-to-many coupling to many-to-one. Risk: the mediator becomes a "god object".

### Q60. Memento
Capture and restore an object's internal state without breaking encapsulation (undo, snapshots, save games).

### Q61. Visitor
Add operations to a class hierarchy without modifying it, using double dispatch (`accept(visitor)` calls `visitor.visitX(this)`). Good for stable hierarchies and changing operations (AST processing, compilers). Hard when new element types are added often.

### Q62. Bridge
Separate an abstraction from its implementation so both vary independently (e.g. `Shape` × `Renderer`: avoids `CircleSVG`, `CircleCanvas`, `SquareSVG`... explosion).

### Q63. Flyweight
Share common immutable state across many objects to save memory (characters in a text editor, tiles in a game, interned strings).

### Q64. Interpreter
Define a grammar and an evaluator for a small language (regex, expression evaluators, query DSLs). Rare in everyday work.

### Q65. Pattern vs principle vs idiom
Principle (SOLID): guidance. Pattern (Strategy): reusable structure. Idiom: language-specific habit (JS module pattern, Python context manager).

### Q66. Dependency injection styles
Constructor injection (preferred: makes dependencies explicit and objects always valid), setter/property injection (optional dependencies), method injection (per-call). Avoid the **service locator** (hidden dependencies, global registry) for business classes.

### Q67. Repository pattern
A collection-like interface for domain objects, hiding persistence details.
```ts
interface UserRepo {
  findById(id: string): Promise<User | null>;
  save(u: User): Promise<void>;
}
```
Business code depends on the interface; the implementation uses SQL, Mongo or memory (tests).

### Q68. Service layer, DTO, and entity
- **Entity**: domain object with identity and rules.
- **DTO**: plain data carrier across boundaries (API, layers). No behavior.
- **Service**: orchestrates use cases, transactions, and calls repositories.
Keep controllers thin: validate input, call a service, map output.

### Q69. MVC, MVP, MVVM (architectural patterns)
- **MVC**: Model (data/rules), View (UI), Controller (input handling). Web frameworks (Spring MVC, Rails, Express + templates).
- **MVP**: Presenter mediates; View is passive.
- **MVVM**: ViewModel exposes bindable state; the view updates automatically (Angular, WPF, SwiftUI-like).

### Q70. UML basics
Class diagram (classes, attributes, methods, relationships), sequence diagram (messages over time), use case, activity, state diagrams. Relationships: association (line), aggregation (hollow diamond), composition (filled diamond), inheritance (hollow triangle), realization (dashed with hollow triangle), dependency (dashed arrow).

---

# 🟡 Part 3: Mid (3–5 years)

### Q71. Fragile base class problem
Changing a parent class (even internally) can silently break subclasses that depend on its implementation details. Example: a parent `addAll()` that calls `add()` internally; a subclass overriding `add()` to count items now double counts. Mitigate: prefer composition, make classes `final`/sealed by default, document extension points, use Template Method with explicit hooks.

### Q72. Diamond problem and multiple inheritance
Class D inherits B and C, which both inherit A. Which version of A's method does D get? C++ uses virtual inheritance; Python uses **MRO (C3 linearization)**: `D.__mro__`. Java/C#/TS avoid it by allowing single class inheritance plus multiple interfaces. Java default methods with conflicts must be resolved explicitly (`B.super.m()`).

### Q73. Mixins and traits
Reusable behavior bundles added to a class without a deep hierarchy.
```ts
type Ctor<T = {}> = new (...a: any[]) => T;
function Timestamped<B extends Ctor>(Base: B) {
  return class extends Base { createdAt = new Date(); };
}
class User { constructor(public name: string) {} }
const TimedUser = Timestamped(User);
```
Rust/Scala have traits; Python has multiple inheritance mixins; Java uses default methods.

### Q74. Polymorphism without inheritance
Duck typing (Python, JS), structural typing (TS, Go interfaces), parametric polymorphism (generics), and function polymorphism (higher-order functions). "If it has the method, it works."

### Q75. Dynamic dispatch and double dispatch
Single dispatch chooses a method by the **receiver's** runtime type only. Double dispatch chooses by two runtime types (Visitor simulates it). Overloads in Java/C# are resolved at **compile time** by static type of arguments, a common trick question.

### Q76. Overriding rules (Java-style)
Same name and parameter types; return type may be covariant (a subtype); access cannot be narrower; cannot throw broader checked exceptions; `static` and `private` methods are hidden, not overridden; annotate with `@Override` (TS: `override` keyword with `noImplicitOverride`).

### Q77. Constructors and polymorphism trap
Calling an overridable method from a constructor runs the subclass's version **before** the subclass fields are initialized (Java, C#, TS fields initialized after `super()`).
```ts
class A { constructor() { this.init(); } init() {} }
class B extends A { x = 5; init() { console.log(this.x); } }   // prints undefined
new B();
```
Avoid calling overridable methods in constructors.

### Q78. Deep vs shallow copy
Shallow copy copies references; deep copy copies the whole graph. JS: spread/`Object.assign` shallow, `structuredClone` deep (no functions/class prototypes). Python: `copy.copy` vs `copy.deepcopy`. Java: copy constructors or serialization.

### Q79. Object equality contract (Java)
`equals` must be reflexive, symmetric, transitive, consistent, and `x.equals(null)` false. If `a.equals(b)` then `a.hashCode() == b.hashCode()`. Breaking this corrupts `HashMap`/`HashSet`. Records/data classes generate these correctly.

### Q80. Immutability in practice
Final fields, no setters, defensive copies of mutable inputs/outputs, `Object.freeze` (shallow) in JS, Java records, Kotlin `data class` + `val`, Python `@dataclass(frozen=True)`. Update by creating modified copies (`with` methods or spread).

### Q81. Domain-Driven Design (DDD) building blocks
- **Entity**: identity matters.
- **Value object**: compared by value, immutable.
- **Aggregate**: cluster of entities and values with one **aggregate root** that enforces invariants; modify only through the root.
- **Repository**: loads/saves aggregates.
- **Domain service**: logic that does not belong to one entity.
- **Domain event**: something that happened (`OrderPlaced`).
- **Bounded context**: a boundary where a model and its language are consistent.
Avoids the **anemic domain model** (classes with only getters/setters and all logic in services).

### Q82. Anemic vs rich domain model
Anemic: entities are data bags, services hold logic (procedural style). Rich: entities guard their invariants and expose behavior (`order.addItem()`, `account.withdraw()`). Rich models keep rules in one place; anemic can be fine for simple CRUD.

### Q83. Unit of Work and Identity Map
Unit of Work tracks changes to objects during a business transaction and commits them together (Hibernate session, EF Core `DbContext`). Identity Map ensures one in-memory object per database row within a unit.

### Q84. Active Record vs Data Mapper
- **Active Record**: the object knows how to save itself (Rails, Laravel Eloquent, Django ORM). Simple, couples domain to the database.
- **Data Mapper**: a separate mapper moves data between objects and the database (Hibernate, TypeORM data-mapper mode, SQLAlchemy). More decoupled.

### Q85. ORM impedance mismatch
Objects (graphs, inheritance, identity) vs tables (rows, joins, keys). Issues: inheritance mapping strategies (single table, class table, concrete table), lazy loading, the **N+1 query problem**, cascading, and equality. Know when to bypass the ORM with SQL.

### Q86. Dependency injection containers
Register abstractions → implementations with lifetimes: **transient** (new each time), **scoped** (per request), **singleton** (one for app lifetime). Pitfalls: captive dependency (singleton holding a scoped service), circular dependencies, service locator anti-pattern. Examples: Spring, NestJS, ASP.NET Core DI, Angular injectors, InversifyJS.

### Q87. Circular dependency between classes
A needs B and B needs A. Fixes: extract a third class with the shared logic, depend on an interface, use events/mediator, or inject lazily. Circularity often signals wrong boundaries.

### Q88. Event-driven design inside an application
Publish domain events (`UserRegistered`) and let handlers react (send email, update stats). Decouples producers from consumers. Cost: harder to trace flow, ordering and error handling issues. In-process first; message brokers when crossing services.

### Q89. Null Object pattern
Replace `null` checks with an object that does nothing.
```ts
interface Logger { log(m: string): void }
const noopLogger: Logger = { log() {} };
```
Related: `Optional`/`Option` types, TS `strictNullChecks`, safe navigation `?.`.

### Q90. Specification pattern
Encapsulate business rules as combinable objects.
```ts
type Spec<T> = (x: T) => boolean;
const and = <T>(...s: Spec<T>[]): Spec<T> => x => s.every(f => f(x));
const isAdult: Spec<User> = u => u.age >= 18;
const isActive: Spec<User> = u => u.active;
const eligible = and(isAdult, isActive);
```

### Q91. Object pool
Reuse expensive objects (DB connections, threads, buffers) instead of recreating. Must reset state on return and bound the pool size. Connection pools (HikariCP, `pg-pool`) are the everyday example.

### Q92. Lazy initialization and Registry
Create an object only when first needed (virtual proxy, `lazy` properties, `Lazy<T>` in C#). A **registry** maps names to objects (plugin registries, DI containers). Beware hidden global state.

### Q93. Dependency direction in layered architecture
Presentation → Application/Service → Domain ← Infrastructure (via interfaces). The domain must not depend on frameworks, databases or HTTP. This is Clean/Hexagonal architecture's main rule.

### Q94. Hexagonal architecture (Ports and Adapters)
The core domain exposes **ports** (interfaces); **adapters** implement them for the outside world (REST controller, DB repository, message consumer, email service). Swap adapters without touching the core. Testing the core needs no infrastructure.

### Q95. Clean Architecture in short
Concentric circles: Entities → Use Cases → Interface Adapters → Frameworks and Drivers. Dependencies point inward only. Same family as Hexagonal and Onion.

### Q96. CQRS in short
Separate **commands** (change state) from **queries** (read state), possibly with different models or stores. Pairs well with event sourcing but does not require it. Adds complexity; use where read and write needs differ greatly.

### Q97. Event sourcing in short
Store state changes as a sequence of immutable events; rebuild current state by replaying. Benefits: audit log, time travel, new projections. Costs: schema evolution, eventual consistency in projections, complexity.

### Q98. Saga pattern (awareness)
Manage a distributed business transaction as a sequence of local transactions with **compensating actions**. Orchestration (central coordinator) vs choreography (events). Used in microservices where two-phase commit is impractical.

### Q99. Circuit Breaker, Retry, Bulkhead, Timeout (resilience patterns)
Circuit breaker: stop calling a failing dependency for a while (closed → open → half-open). Retry with exponential backoff and jitter (only idempotent calls). Bulkhead: isolate resources so one failure does not take down everything. Timeout: never wait forever. Libraries: Resilience4j, Polly, `opossum`.

### Q100. Idempotency and the Outbox pattern (awareness)
Idempotent handlers can run twice safely (use idempotency keys). Transactional **outbox**: write the event to an outbox table in the same DB transaction as the state change, and a relay publishes it. Avoids dual-write bugs.

### Q101. Fluent API vs builder vs options object
Options object (TS/JS): simplest for config. Builder: when construction has steps or validation. Fluent interface: readability for DSLs. Prefer the simplest that stays clear.

### Q102. Static factory methods vs constructors
Named factories (`Money.fromCents(500)`, `User.guest()`) clarify intent, can return cached/sub-type instances, and can validate before creation. Make the constructor private when needed.

### Q103. Type-safe state machines in OOP
Use discriminated unions or State pattern so illegal transitions do not compile.
```ts
type Order =
  | { kind: "pending" }
  | { kind: "paid"; paidAt: Date }
  | { kind: "shipped"; paidAt: Date; trackingId: string };
```

### Q104. Law of least astonishment and API design
Names say what methods do; avoid boolean parameters (`render(true, false)`); prefer small interfaces; fail fast with clear errors; keep side effects obvious; follow language conventions.

### Q105. Defensive programming vs Design by Contract
Defensive: validate everything everywhere. Contract: define preconditions, postconditions and invariants; callers must respect preconditions. In practice validate at boundaries (API input) and trust internals, with assertions to catch bugs.

### Q106. Testing OOP code: test doubles
**Dummy** (placeholder), **Stub** (canned answers), **Spy** (records calls), **Mock** (verifies expected interactions), **Fake** (working lightweight implementation, e.g. in-memory repo). Prefer fakes and state-based assertions over heavy mock verification, which couples tests to implementation.

### Q107. What makes code testable?
Dependencies injected, small focused classes, no hidden globals/singletons, pure logic separated from I/O, deterministic time/random via injected clocks and generators, seams at boundaries.

### Q108. Refactoring: common smells and moves
Smells: long method, large class, long parameter list, feature envy, shotgun surgery, divergent change, primitive obsession, data clumps, switch statements on type, speculative generality. Moves: extract method/class, move method, replace conditional with polymorphism, introduce parameter object, replace inheritance with delegation.

### Q109. Replace conditional with polymorphism
```ts
// Before
function pay(e: { type: string; base: number }) {
  if (e.type === "manager") return e.base * 1.5;
  if (e.type === "engineer") return e.base * 1.2;
  return e.base;
}
// After
interface Employee { pay(): number }
class Manager implements Employee { constructor(private b: number) {} pay() { return this.b * 1.5; } }
class Engineer implements Employee { constructor(private b: number) {} pay() { return this.b * 1.2; } }
```
Do not over-apply: a small stable `switch` is fine.

### Q110. Primitive obsession
Using raw strings/numbers for domain ideas (email, money, id). Wrap in value objects with validation. Branded types in TS:
```ts
type UserId = string & { readonly __brand: "UserId" };
```

---

# 🟠 Part 4: Senior (5–7 years)

### Q111. When is inheritance the right tool?
Stable, genuine is-a relationships; framework extension points designed for it (e.g. `Exception`, UI base classes, abstract test fixtures); when subclasses truly honor the base contract (LSP); and when hierarchy depth stays at 2–3 levels. Otherwise delegate.

### Q112. Designing for extension: hooks, plugins, strategies
Choose by who extends and how: Strategy (swap an algorithm), Template Method (fixed skeleton, custom steps), plugin registry (third-party additions), events (loose reactions), middleware chain (cross-cutting). Document the extension contract and keep it small, because every extension point is a long-term promise.

### Q113. The expression problem
Adding a new **type** is easy in OOP (new subclass), adding a new **operation** is hard (touch all classes). Functional style with pattern matching is the opposite. Visitor helps operations; sum types help closed sets. Choose based on which axis changes more.

### Q114. Class design heuristics
One clear purpose, small public surface, stable abstractions, invariants enforced in the constructor, no public mutable fields, meaningful names, minimal dependencies (≤ ~4 constructor params is a hint), and cohesive methods that use most of the fields.

### Q115. Package/module design principles
- **REP/CRP/CCP**: reuse/release, common reuse, common closure (group things that change together).
- **ADP**: no cycles in the dependency graph.
- **SDP/SAP**: depend in the direction of stability; stable packages should be abstract.
Tools: dependency-cruiser, ArchUnit, madge, import-linter to enforce rules.

### Q116. Evolving APIs without breaking clients
Add, do not change; deprecate with a timeline; version (URL, header, package); use adapters for old shapes; tolerant reader (ignore unknown fields); keep behavior backward compatible (Hyrum's law: any observable behavior will be depended on).

### Q117. Concurrency and OOP design
Shared mutable state needs synchronization. Prefer immutable objects, confinement (one thread owns the object), message passing (actors), and thread-safe collections. Document thread-safety of each class. Singletons holding mutable state are a frequent source of races.

### Q118. Thread-safe Singleton (Java/C#) and its variants
Options: eager static init, `enum` singleton (Java, serialization-safe), holder idiom (lazy, no locking), double-checked locking with `volatile`. In Node (single-threaded event loop) a module-level instance is enough. In Python, module-level instances; or `__new__` plus a lock.

### Q119. Anti-patterns to name in interviews
God Object, Spaghetti code, Lava flow (dead code), Golden hammer, Copy-paste programming, Magic numbers, Singleton abuse, Service Locator, Anemic domain, Inheritance abuse (deep trees), Premature optimization, Big ball of mud, Cargo cult patterns, Over-engineering ("pattern fever").

### Q120. Pattern selection by problem
| Problem | Pattern |
|---|---|
| Many algorithm variants | Strategy |
| Object creation varies | Factory / Abstract Factory |
| Many constructor options | Builder |
| Add behavior dynamically | Decorator |
| Incompatible interfaces | Adapter |
| Simplify subsystem | Facade |
| Notify many listeners | Observer |
| Undo/redo, queueing | Command |
| Behavior depends on state | State |
| Same flow, different steps | Template Method |
| Tree structure, uniform handling | Composite |
| Control access / caching | Proxy |
| Chain of handlers | Chain of Responsibility |
| Operations on stable hierarchy | Visitor |
| Decouple many-to-many talk | Mediator |

### Q121. Pattern vs framework features
Many patterns are built into modern tooling: Observer (RxJS, events), Iterator (generators), Strategy/Command (first-class functions), Singleton (DI scopes, ES modules), Proxy (JS `Proxy`, AOP), Decorator (middleware, TS/Python decorators), Factory (DI). Knowing the pattern helps you recognize and name them.

### Q122. Aspect-Oriented Programming (AOP)
Separate cross-cutting concerns (logging, transactions, security, caching) from business logic via interception (Spring AOP/AspectJ, Python decorators, NestJS interceptors/guards, TS decorators). Trade-offs: "magic" control flow, harder debugging.

### Q123. Reflection and metaprogramming
Inspect and modify types at runtime (Java reflection, JS `Reflect`/`Proxy`, Python `getattr`/metaclasses). Powers DI containers, ORMs, serializers, test frameworks. Costs: slower, bypasses type safety, hard to refactor. Use at framework boundaries, not in business code.

### Q124. Serialization and OOP
Objects with behavior do not serialize cleanly. Use DTOs for wire formats; preserve invariants when deserializing (validate); version payloads; avoid serializing internal classes (Java native serialization is an attack surface).

### Q125. Memory and performance aspects of OOP
Object headers and pointers add overhead; many small objects hurt cache locality and GC. Data-oriented design (struct of arrays) beats object graphs in hot loops (games, numeric code). Virtual calls prevent inlining; JIT often devirtualizes monomorphic call sites. Don't micro-optimize before profiling.

### Q126. Hiding vs exposing collections
Never return the internal mutable list. Return an immutable view or a copy.
```ts
class Cart {
  private items: Item[] = [];
  get list(): readonly Item[] { return this.items; }
  add(i: Item) { this.items.push(i); }
}
```

### Q127. Optional dependencies and feature flags in OOP
Inject strategies/no-op implementations selected by configuration; avoid `if (flag)` scattered through domain code. Remove flags after rollout.

### Q128. Handling errors in object design
Use exceptions for exceptional cases, result types (`Result<T, E>`) for expected failures, domain-specific error classes, and avoid leaking low-level exceptions across layers (wrap with context). Keep invariants intact when an operation fails halfway (strong exception safety: roll back).

### Q129. Contract testing and interface stability
When multiple implementations of an interface exist, write one **contract test suite** that every implementation must pass (in-memory and SQL repositories pass the same tests). It enforces LSP in practice.

### Q130. Mapping inheritance to relational tables
Single-table (fast, sparse columns), table-per-class (joins, normalized), table-per-concrete-class (no joins on a leaf, duplicated columns). Often better to avoid mapping deep hierarchies and use composition or a type column plus JSON.

### Q131. When to use abstract classes in 2020s code
For shared protected state or a template skeleton with a few abstract steps. For pure capability contracts use interfaces. In TS, also consider function types and composition for lightweight cases.

### Q132. Delegation and forwarding
An object hands work to another (the delegate). Used instead of inheritance to reuse behavior (Kotlin `by`, composition + forwarding methods). Decorator and Proxy are delegation with a twist.

### Q133. Generics, variance, and bounded types
Covariance (`List<Dog>` as `List<Animal>` for read-only), contravariance (consumers), invariance (mutable containers). Java uses wildcards (`? extends`, `? super`, PECS: producer extends, consumer super). TS arrays are covariant (unsound but allowed); `in`/`out` variance annotations exist (TS 4.7+). Bounded generics: `<T extends Comparable<T>>`.

### Q134. Code review checklist for OOP
Single responsibility? Dependencies injected? Invariants protected? No leaking mutable state? Inheritance justified (LSP)? Names express intent? Tests cover behavior, not implementation? Public API minimal and documented? Thread-safety stated?

### Q135. Measuring design quality
Cyclomatic complexity, cohesion (LCOM), coupling (afferent/efferent), depth of inheritance, change frequency (hotspots from git history), test coverage and mutation score. Use as signals, not goals.

### Q136. Modular monolith
One deployable, strict module boundaries (public API per module, no cross-module DB access, enforced with tooling). Gets many microservice benefits (clear ownership, replaceable modules) without network complexity.

### Q137. Package-by-feature vs package-by-layer
By layer: `controllers/`, `services/`, `repositories/` (easy to start, scatters a feature). By feature: `orders/`, `billing/` each with its own layers (higher cohesion, easier to extract, matches teams). Prefer by-feature for non-trivial apps.

### Q138. Plugin architecture
Define a stable interface and lifecycle (`init`, `register`, `dispose`); discover plugins through configuration or registry; sandbox and version them; provide a testing kit. Examples: VS Code extensions, webpack/Vite plugins, ESLint rules.

### Q139. OOP in functional and mixed languages
Kotlin, Scala, Swift, TS, Rust (traits, no inheritance) and Go (interfaces, embedding, no inheritance) show that **polymorphism, encapsulation and composition** matter more than class hierarchies. Interviewers value knowing the ideas, not only the keywords.

### Q140. Common interview trap: "Is JavaScript object-oriented?"
Yes, but **prototype-based**. Objects inherit directly from other objects through the prototype chain. `class` syntax (ES2015) is syntactic sugar over prototypes. There are no true classes at runtime, and private fields (`#x`) are real runtime privacy.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q141. How do you decide the level of design for a feature?
Match design effort to change likelihood and risk. For a one-off script use simple functions. For core domain logic that changes often, invest in clear abstractions and tests. Introduce a pattern when you feel the second or third variation, not before ("rule of three").

### Q142. How do you prevent pattern overuse in a team?
Ask "what problem does this solve today?" in reviews, favor simple code, document decisions (ADRs), show real examples of before/after, and delete unused abstractions. Patterns are tools, not goals.

### Q143. Designing a domain model for a new product
Run event storming or workshops with domain experts, identify bounded contexts and the ubiquitous language, model aggregates around invariants and transactional boundaries, start with the core domain, keep supporting domains simple (CRUD), and revisit boundaries as understanding grows.

### Q144. Aggregate design rules
Keep aggregates small; reference other aggregates by ID, not by object; one transaction per aggregate; use eventual consistency (domain events) across aggregates; the root enforces invariants.

### Q145. Managing technical debt in object-oriented systems
Track hotspots (high change × high complexity), write characterization tests before refactoring legacy code, use strangler fig for gradual replacement, apply boy-scout rule, schedule refactoring with feature work, and make debt visible to product owners with business impact.

### Q146. Legacy code strategies (Feathers)
Find **seams** (places to alter behavior without editing code): extract interface, subclass and override, parameterize constructor, wrap method. Add characterization tests, then refactor in small safe steps.

### Q147. Microservices vs modular monolith: OOP view
Microservices apply encapsulation at the network level: a service owns its data and exposes a contract. The same principles apply (cohesion, coupling, contracts). Distributed systems add latency, consistency and operational costs, so earn them with real scale or team-independence needs.

### Q148. API/contract-first design
Define the interface (OpenAPI, protobuf, GraphQL schema, TS types) before implementations, generate clients/servers, run contract tests, and version carefully. It parallels "program to an interface".

### Q149. Architecture decision records (ADRs)
Short documents: context, options considered, decision, consequences. Prevent repeated debates and help new joiners understand why design choices exist.

### Q150. Mentoring on design thinking
Teach by questions: "What changes? What stays? Who depends on this? How will you test it?" Use code katas (Gilded Rose, Bowling), pair programming, and design reviews. Encourage small steps and TDD.

### Q151. Handling a disagreement on design
Clarify goals and constraints, compare options against them (cost of change, risk, timeline), prototype or spike if needed, decide with an ADR, and commit. Revisit when facts change.

### Q152. Balancing abstraction and delivery
Abstract at points of **likely change** and at boundaries you do not control (third-party APIs, payment providers). Do not wrap everything. Keep an escape hatch and measure whether abstractions are actually used.

### Q153. Observability in OOP services
Inject a logger and metrics interface; structured logs with correlation IDs; trace spans at boundaries (controllers, repositories, outbound clients); avoid logging inside domain entities (pass context in or emit domain events).

### Q154. Security by design
Encapsulate validation and authorization in domain/application layers (not only controllers), least privilege, immutable value objects for sensitive data, avoid exposing internal state via serialization, validate on deserialization, secure defaults, no secrets in code.

### Q155. Evaluating a framework's design
Look at extension points, testability, coupling of business code to the framework, upgrade path, community, and escape hatches. Keep business logic framework-agnostic when feasible (Clean Architecture).

---

# 💻 Part 6: Coding / Machine-Coding Tasks

### C1. Parking lot (LLD)
Requirements: multiple floors, vehicle types, spot types, ticket on entry, fee on exit.
```ts
type VehicleType = "bike" | "car" | "truck";
class Vehicle { constructor(readonly plate: string, readonly type: VehicleType) {} }

class Spot {
  private vehicle?: Vehicle;
  constructor(readonly id: string, readonly type: VehicleType) {}
  get free() { return !this.vehicle; }
  fits(v: Vehicle) { return this.free && this.type === v.type; }
  park(v: Vehicle) { this.vehicle = v; }
  leave() { this.vehicle = undefined; }
}

class Ticket { constructor(readonly id: number, readonly spot: Spot, readonly vehicle: Vehicle, readonly inAt = Date.now()) {} }

interface FeePolicy { fee(hours: number, t: VehicleType): number }
class HourlyFee implements FeePolicy {
  private rate = { bike: 10, car: 20, truck: 40 };
  fee(h: number, t: VehicleType) { return Math.max(1, Math.ceil(h)) * this.rate[t]; }
}

class ParkingLot {
  private nextId = 1;
  private active = new Map<number, Ticket>();
  constructor(private spots: Spot[], private policy: FeePolicy) {}
  enter(v: Vehicle): Ticket {
    const s = this.spots.find(x => x.fits(v));
    if (!s) throw new Error("Lot full");
    s.park(v);
    const t = new Ticket(this.nextId++, s, v);
    this.active.set(t.id, t);
    return t;
  }
  exit(id: number): number {
    const t = this.active.get(id);
    if (!t) throw new Error("Invalid ticket");
    const hours = (Date.now() - t.inAt) / 3_600_000;
    t.spot.leave(); this.active.delete(id);
    return this.policy.fee(hours, t.vehicle.type);
  }
}
```
Patterns used: Strategy (fee policy), encapsulation (spot state). Extensions: nearest-spot strategy, payment, multiple entrances (concurrency: lock per spot).

### C2. Library management (entities and rules)
```ts
class Book { constructor(readonly isbn: string, readonly title: string) {} }
class Copy { available = true; constructor(readonly id: string, readonly book: Book) {} }
class Member { loans: Loan[] = []; constructor(readonly id: string, readonly name: string) {} }
class Loan { constructor(readonly copy: Copy, readonly member: Member, readonly due: Date) {} }

class Library {
  private static MAX_LOANS = 3;
  checkout(m: Member, c: Copy, days = 14): Loan {
    if (!c.available) throw new Error("Copy not available");
    if (m.loans.length >= Library.MAX_LOANS) throw new Error("Loan limit");
    c.available = false;
    const loan = new Loan(c, m, new Date(Date.now() + days * 86_400_000));
    m.loans.push(loan);
    return loan;
  }
  giveBack(m: Member, c: Copy) {
    m.loans = m.loans.filter(l => l.copy !== c);
    c.available = true;
  }
}
```

### C3. Elevator system (State + Strategy)
Elements: `Elevator` (state: idle, moving up/down, door open), `Request` (floor, direction), `Dispatcher` strategy (nearest car, SCAN algorithm). Keep each elevator's request queue sorted for its direction; the dispatcher picks the best car by cost. Mention concurrency (request thread vs movement loop).

### C4. Vending machine (State pattern)
```ts
interface VState { insert(m: Machine, coin: number): void; select(m: Machine, code: string): void }
class Idle implements VState {
  insert(m: Machine, c: number) { m.balance += c; m.state = new HasMoney(); }
  select() { throw new Error("Insert money first"); }
}
class HasMoney implements VState {
  insert(m: Machine, c: number) { m.balance += c; }
  select(m: Machine, code: string) {
    const price = m.price(code);
    if (m.balance < price) throw new Error("Insufficient");
    m.balance -= price; m.dispense(code); m.state = m.balance > 0 ? new HasMoney() : new Idle();
  }
}
class Machine {
  state: VState = new Idle(); balance = 0;
  price(_: string) { return 25; } dispense(code: string) { console.log("dispense", code); }
  insert(c: number) { this.state.insert(this, c); }
  select(code: string) { this.state.select(this, code); }
}
```

### C5. Tic-Tac-Toe
```ts
class Board {
  private g: (string | null)[][] = Array.from({ length: 3 }, () => Array(3).fill(null));
  place(r: number, c: number, p: string) {
    if (this.g[r][c]) throw new Error("Taken");
    this.g[r][c] = p;
  }
  winner(): string | null {
    const lines = [
      ...this.g, ...[0, 1, 2].map(c => this.g.map(r => r[c])),
      [0, 1, 2].map(i => this.g[i][i]), [0, 1, 2].map(i => this.g[i][2 - i]),
    ];
    for (const l of lines) if (l[0] && l.every(x => x === l[0])) return l[0];
    return null;
  }
}
```
Extension: N×N board with O(1) win checks using row/column counters.

### C6. Logger framework (Singleton + Chain + Strategy)
```ts
enum Level { DEBUG, INFO, ERROR }
interface Appender { write(level: Level, msg: string): void }
class ConsoleAppender implements Appender { write(l: Level, m: string) { console.log(Level[l], m); } }

class Logger {
  private appenders: Appender[] = [];
  constructor(private min: Level) {}
  add(a: Appender) { this.appenders.push(a); return this; }
  log(l: Level, m: string) { if (l >= this.min) this.appenders.forEach(a => a.write(l, m)); }
}
```

### C7. Notification service (Strategy + Factory + Observer)
Channels (`Email`, `Sms`, `Push`) implement `Notifier`. A factory returns notifiers per user preference. Events (`OrderShipped`) are published; a `NotificationHandler` subscribes and sends. Add retries and a template engine behind interfaces.

### C8. Rate limiter class (token bucket)
```ts
class TokenBucket {
  private tokens: number; private last = Date.now();
  constructor(private cap: number, private perSec: number) { this.tokens = cap; }
  allow(now = Date.now()): boolean {
    this.tokens = Math.min(this.cap, this.tokens + ((now - this.last) / 1000) * this.perSec);
    this.last = now;
    if (this.tokens >= 1) { this.tokens -= 1; return true; }
    return false;
  }
}
```
Injecting `now` makes it testable.

### C9. Event emitter (Observer) with `once` and `off`
```ts
type Fn = (...a: any[]) => void;
class Emitter {
  private m = new Map<string, Set<Fn>>();
  on(e: string, f: Fn) { (this.m.get(e) ?? this.m.set(e, new Set()).get(e)!).add(f); return () => this.off(e, f); }
  off(e: string, f: Fn) { this.m.get(e)?.delete(f); }
  once(e: string, f: Fn) { const w: Fn = (...a) => { this.off(e, w); f(...a); }; this.on(e, w); }
  emit(e: string, ...a: any[]) { [...(this.m.get(e) ?? [])].forEach(f => f(...a)); }
}
```
Copy the set before iterating so handlers can unsubscribe during emit.

### C10. Undo/redo text editor (Command)
```ts
class Editor {
  text = "";
  private undoS: Command[] = []; private redoS: Command[] = [];
  run(c: Command) { c.execute(); this.undoS.push(c); this.redoS = []; }
  undo() { const c = this.undoS.pop(); if (c) { c.undo(); this.redoS.push(c); } }
  redo() { const c = this.redoS.pop(); if (c) { c.execute(); this.undoS.push(c); } }
}
```
Running a new command clears the redo stack.

### C11. Shopping cart with discounts (Decorator/Strategy)
`Cart` holds `LineItem`s. `PricingRule` interface (`apply(total, cart)`). Compose rules in a pipeline: percentage off, buy-X-get-Y, coupon cap. Use integers (cents) for money to avoid float errors.

### C12. Chess pieces (polymorphism)
```ts
abstract class Piece {
  constructor(readonly white: boolean) {}
  abstract moves(from: [number, number], board: Board): [number, number][];
}
class Knight extends Piece {
  moves([r, c]: [number, number]) {
    return ([[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]] as [number, number][])
      .map(([dr, dc]): [number, number] => [r + dr, c + dc])
      .filter(([a, b]) => a >= 0 && a < 8 && b >= 0 && b < 8);
  }
}
```
Each piece knows its movement; the board validates blocking and check.

### C13. Bank account with transfer (consistency)
```ts
class Account {
  private bal = 0;
  constructor(readonly id: string) {}
  deposit(x: number) { if (x <= 0) throw new Error("bad"); this.bal += x; }
  withdraw(x: number) { if (x > this.bal) throw new Error("Insufficient"); this.bal -= x; }
  get balance() { return this.bal; }
}
function transfer(a: Account, b: Account, x: number) {
  a.withdraw(x);
  try { b.deposit(x); } catch (e) { a.deposit(x); throw e; }   // compensate on failure
}
```
In a real system this is a database transaction. Mention locking order to avoid deadlocks (always lock the lower account ID first).

### C14. Plugin registry with Factory
```ts
const registry = new Map<string, () => Exporter>();
export const register = (k: string, f: () => Exporter) => registry.set(k, f);
export const create = (k: string) => {
  const f = registry.get(k); if (!f) throw new Error(`Unknown exporter: ${k}`); return f();
};
register("csv", () => new CsvExporter());
```
New exporters are added without modifying `create` (Open/Closed).

### C15. Python versions of core ideas
```python
from abc import ABC, abstractmethod
from dataclasses import dataclass

class Shape(ABC):
    @abstractmethod
    def area(self) -> float: ...

@dataclass(frozen=True)
class Circle(Shape):
    r: float
    def area(self) -> float: return 3.14159 * self.r ** 2

class Singleton:
    _inst = None
    def __new__(cls):
        if cls._inst is None: cls._inst = super().__new__(cls)
        return cls._inst
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. `this` is undefined inside a callback
```ts
class Btn { label = "OK"; click() { console.log(this.label); } }
const b = new Btn();
setTimeout(b.click, 0);          // TypeError / undefined: lost `this`
```
**Fix:** `setTimeout(() => b.click(), 0)`, `b.click.bind(b)`, or define `click = () => {...}` as an arrow property.

### D2. Subclass field is `undefined` in the base constructor
See Q77. **Fix:** do not call overridable methods in constructors; use an explicit `init()` after construction or a factory.

### D3. Shared mutable default / static state leaks between tests
A singleton or static array keeps state across tests, making tests order-dependent. **Fix:** inject dependencies, reset in `beforeEach`, avoid static mutable state.

### D4. `instanceof` fails after bundling or across realms
Duplicate copies of a package create two different classes with the same name. **Fix:** dedupe dependencies, use discriminant fields (`kind`) or `Symbol.hasInstance`, or duck typing.

### D5. Custom error class loses its type in older targets
Extending `Error` while compiling to ES5 breaks `instanceof`. **Fix:** `Object.setPrototypeOf(this, MyError.prototype)` in the constructor or target ES2015+.

### D6. Equality bug in `Set`/`Map` with objects
`new Set([{id:1}, {id:1}]).size` is 2 (reference equality). **Fix:** use primitive keys (`id`), or a canonical string key, or a value-object wrapper with a custom keying function.

### D7. Memory leak from observers
Listeners hold references to components that should be garbage collected. **Fix:** return and call the unsubscribe function, use `AbortController` signals, `WeakRef` registries, or lifecycle hooks (`ngOnDestroy`, `useEffect` cleanup).

### D8. Circular dependency at startup (`undefined` import or DI error)
Module A imports B which imports A, so one value is `undefined` at load time (or the DI container throws). **Fix:** extract shared code, depend on interfaces, use lazy imports/injection (`forwardRef` in Nest).

### D9. Liskov violation in production
A `ReadOnlyRepo extends Repo` throws on `save()`, crashing code that expects all repos to save. **Fix:** split interfaces (`Reader`, `Writer`), do not extend where behavior is removed.

### D10. Mutating a returned collection changes internal state
`getItems()` returned the internal array and a caller pushed into it. **Fix:** return a copy or `readonly` view; expose intention-revealing methods.

### D11. Overloaded method calls the wrong version (Java)
```java
void f(Object o) {...}  void f(String s) {...}
Object x = "hi"; f(x);   // calls f(Object): overloads use the static type
```
**Fix:** use overriding (runtime dispatch) or a visitor, or cast deliberately.

### D12. Singleton created twice
Multiple class loaders, module duplicates, or non-thread-safe lazy init created more than one instance. **Fix:** proper thread-safe pattern or DI singleton scope; verify with a test.

### D13. Deep inheritance makes a bug impossible to trace
The behavior is spread across five classes with `super` calls. **Fix:** flatten with composition, make flow explicit, add logging at extension points.

### D14. `equals` without `hashCode`
Objects disappear from `HashSet` lookups. **Fix:** implement both from the same fields (or use records).

### D15. Tests break after every refactor
Tests are coupled to implementation through heavy mocking. **Fix:** test behavior through the public API, use fakes, assert outcomes not call sequences.

---

# 🧩 Part 8: Tricky Questions

### T1. Can an interface have a constructor?
No. Interfaces define contracts, not construction. Use factories or constructor type signatures (`new (...) => T` in TS).

### T2. Can we override a private or static method?
No. Private methods are not visible to subclasses; static methods are **hidden** (resolved by class, not instance). A subclass can declare a method with the same name, but it is not polymorphic.

### T3. Is multiple inheritance bad?
Not inherently. It can cause ambiguity (diamond) and complex state. Interfaces/traits/mixins give the benefits with fewer problems. Python's MRO and C++ virtual bases handle it with explicit rules.

### T4. Abstract class with no abstract methods. Valid?
Yes. It only prevents direct instantiation (useful as a base or marker).

### T5. Can a constructor be private? Why?
Yes: Singleton, static factories, utility classes (prevent instantiation), builders.

### T6. Difference between composition and aggregation, in code?
Composition: the whole creates and owns the part (`this.engine = new Engine()`); lifetimes are tied. Aggregation: the part is passed in and may outlive the whole (`constructor(engine)`). In garbage-collected languages, the distinction is conceptual.

### T7. What is the difference between a decorator and an inheritance-based extension?
Decorator adds behavior at **runtime** by wrapping and can be stacked in any order; inheritance fixes behavior at **compile time** and creates many subclasses for combinations.

### T8. Strategy vs State vs Template Method
Strategy: client chooses an algorithm; strategies are independent. State: object switches its own behavior as state changes. Template Method: inheritance-based skeleton with overridable steps (compile-time), while Strategy is composition-based (runtime).

### T9. Adapter vs Facade vs Proxy vs Decorator
Adapter changes an interface; Facade simplifies many interfaces; Proxy keeps the same interface and controls access; Decorator keeps the same interface and adds behavior.

### T10. Factory Method vs Abstract Factory vs Builder
Factory Method: one product, subclass/function decides which. Abstract Factory: families of related products. Builder: one complex product assembled step by step.

### T11. Is Singleton an anti-pattern?
Often misused as a global variable. It is acceptable for truly single resources when managed by DI (singleton scope) so classes still receive it through constructors and stay testable.

### T12. Does OOP require classes?
No. Alan Kay's idea centers on objects and messaging. JS uses prototypes; Self has no classes; Go uses structs plus interfaces; closures can implement objects.

### T13. What is the difference between `protected` in Java and C++?
Java `protected` also grants **package** access. C++ `protected` is only for derived classes (and friends).

### T14. Why prefer interfaces for parameter types?
You accept any implementation (flexibility, easier testing) and reduce coupling. Return concrete or specific types when callers need them.

### T15. Can polymorphism work with fields?
Methods are polymorphic; **fields are not** (in Java, field access uses the static type, so fields are hidden, not overridden).

### T16. What does "program to an interface, not an implementation" mean?
Depend on the contract (`List`, `Repository`) rather than a concrete class (`ArrayList`, `MySqlRepository`) so implementations can change without affecting callers.

### T17. Can you instantiate an abstract class?
No directly. In Java you can create an anonymous subclass that implements the abstract methods inline.

### T18. Value vs reference semantics
Value types copy on assignment (C# struct, Rust `Copy` types). Reference types share (objects in JS/Java/Python). Be explicit about mutability and aliasing to avoid surprise bugs.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- **Four pillars?** Encapsulation, abstraction, inheritance, polymorphism.
- **SOLID?** SRP, OCP, LSP, ISP, DIP.
- **Overloading vs overriding?** Compile-time same-class vs runtime subclass redefinition.
- **Abstract class vs interface?** Shared base with state vs pure contract.
- **Composition vs inheritance?** Has-a (prefer) vs is-a.
- **Coupling / cohesion target?** Low / high.
- **GoF count?** 23 patterns, 3 categories.
- **Creational examples?** Singleton, Factory, Abstract Factory, Builder, Prototype.
- **Structural examples?** Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy.
- **Behavioral examples?** Strategy, Observer, Command, State, Template, Iterator, Chain, Mediator, Memento, Visitor, Interpreter.
- **Pattern for undo?** Command (+ Memento).
- **Pattern for events?** Observer / pub-sub.
- **Pattern for swapping algorithms?** Strategy.
- **Pattern for wrapping legacy API?** Adapter.
- **Pattern to simplify a subsystem?** Facade.
- **Pattern to add behavior dynamically?** Decorator.
- **Pattern for tree structures?** Composite.
- **Pattern for lazy/remote/guarded access?** Proxy.
- **Pattern for state machines?** State.
- **Pattern for middleware?** Chain of Responsibility.
- **DIP vs DI vs IoC?** Principle vs technique vs control inversion.
- **Law of Demeter?** Talk to friends, not strangers.
- **LSP in one line?** Subtypes must be substitutable.
- **Anemic model?** Data-only entities with logic in services.
- **Immutable benefits?** Thread-safe, predictable.
- **DRY?** Don't repeat knowledge.
- **YAGNI?** Don't build it until needed.
- **God object?** One class that does everything.
- **JS inheritance model?** Prototype-based.
- **Python multiple-inheritance order?** MRO (C3).
- **UML composition symbol?** Filled diamond.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about a design decision you are proud of.
STAR example: "Our checkout had a 400-line `if/else` for discount types. I introduced a Strategy interface and a small registry, added tests per strategy, and new promotions went from a two-day change in a risky file to a one-hour change in a new file. Defects in promotions dropped."

### P2. Describe a time you refactored a messy class.
Show the process: characterization tests first, small safe steps (extract method/class), keep behavior unchanged, review with the team, and show measurable results (fewer bugs, easier onboarding).

### P3. Have you over-engineered something? What did you learn?
Be honest: e.g. an abstract factory for two implementations that never grew. Lesson: apply the rule of three and wait for real variation; deleting the abstraction improved clarity.

### P4. How do you explain design patterns to a junior?
Start with the problem, show ugly code, introduce the pattern as a fix, show how tests become simpler, and warn about misuse. Use real examples from the codebase.

### P5. How do you keep a codebase maintainable as the team grows?
Clear module boundaries, coding standards and linters, architecture tests, ADRs, small PRs, strong test suites, and regular refactoring time.

### P6. How do you review a pull request with design issues?
Be specific and kind: name the principle or smell, show an alternative, discuss trade-offs, separate blocking issues from suggestions, and offer to pair on non-trivial redesigns.

### P7. Tell me about a bug caused by poor encapsulation.
Example: shared mutable list returned from a getter, modified by a caller. Fix: defensive copy/immutable view; add a test; audit similar getters.

### P8. How do you choose between OOP and functional style?
Use OOP for modeling entities with identity, lifecycle, and encapsulated state, and functional style for data transformations, pipelines and pure business rules. Most real systems mix both.

---

# 📚 Part 11: Complete Coverage (Concepts + Patterns + Mixed)

## Concepts
- **Pillars:** encapsulation, abstraction, inheritance, polymorphism.
- **Class features:** constructors, static, getters/setters, access modifiers, inner/nested classes, abstract classes, interfaces, enums, generics, records/data classes, sealed types.
- **Relationships:** association, aggregation, composition, dependency, inheritance, realization.
- **Principles:** SOLID, DRY, KISS, YAGNI, Law of Demeter, Tell Don't Ask, composition over inheritance, separation of concerns, high cohesion/low coupling, principle of least astonishment, design by contract.
- **Object concepts:** identity vs equality, mutability, value objects, copying, lifecycle, null handling.
- **Language models:** class-based (Java, C#, C++), prototype-based (JS), duck-typed (Python), structural (TS, Go), trait-based (Rust, Scala).

## GoF patterns
- **Creational (5):** Singleton, Factory Method, Abstract Factory, Builder, Prototype.
- **Structural (7):** Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy.
- **Behavioral (11):** Chain of Responsibility, Command, Interpreter, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method, Visitor.

## Enterprise, architecture and resilience patterns
Repository, Unit of Work, Data Mapper, Active Record, DTO, Service Layer, Dependency Injection, MVC/MVP/MVVM, Hexagonal, Clean, Onion, CQRS, Event Sourcing, Saga, Outbox, Circuit Breaker, Retry, Bulkhead, Specification, Null Object, Object Pool, Registry, Plugin, Pipes and Filters, Publish/Subscribe, Strangler Fig, Anti-Corruption Layer.

## Mixed topics
- OOP + databases: ORM, inheritance mapping, N+1, transactions, aggregates.
- OOP + concurrency: thread safety, immutability, actors, locks per object.
- OOP + testing: DI, fakes, mocks, TDD, contract tests.
- OOP + frontend: component classes, composition in React (hooks and composition over inheritance), Angular services + DI, Web Components.
- OOP + APIs: DTOs, versioning, hypermedia, SDK design.
- OOP + AI apps: tool/agent abstractions, strategy for model providers, adapter around LLM SDKs, retry/circuit breaker around calls.

---

# 🔬 Part 12: Internals (How OOP Works Under the Hood)

### I1. Objects in memory
An object is a block of memory with a header (type pointer, GC/lock bits) plus its fields. Methods are stored once per class, not per instance.

### I2. Virtual table (vtable) dispatch
Each class with virtual methods has a vtable of function pointers. Each object has a pointer to its class's vtable. A virtual call loads the pointer, indexes the table, and jumps. This is how overriding resolves at runtime (C++, and conceptually Java/C#).

### I3. JavaScript prototype chain
Every object has an internal `[[Prototype]]`. Property lookup walks up the chain until found or `null`. `class B extends A` sets `B.prototype.__proto__ = A.prototype`. Methods defined in a class live on `Class.prototype`, shared by instances. `Object.getPrototypeOf(x)` reads the link.
```js
class A { hi() { return "A"; } }
class B extends A {}
new B().hi();                       // found via B.prototype -> A.prototype
Object.getPrototypeOf(B.prototype) === A.prototype;   // true
```

### I4. JS private fields vs TS `private`
`#x` is enforced at runtime by the engine. TS `private` is only a compile-time check; the field is a normal property after compilation.

### I5. Python object model
Everything is an object. Attribute lookup uses `__getattribute__`, instance `__dict__`, class `__dict__`, and MRO. Methods are functions that become bound methods through the **descriptor protocol**. `__slots__` removes the per-instance dict to save memory. Metaclasses are classes of classes.

### I6. Java: classes, JIT, and devirtualization
`invokevirtual` uses a vtable-like mechanism; `invokeinterface` searches itables. The JIT inlines monomorphic or bimorphic call sites with guards, so well-structured polymorphism is cheap. `final` classes help but are not required for optimization.

### I7. Garbage collection and object graphs
Reachability from roots decides liveness. Cycles are collected by tracing GCs; reference-counting (CPython, Swift ARC) needs cycle breakers (`weakref`, `weak`). Finalizers are unreliable for cleanup.

### I8. Method binding and closures
Methods can be bound to instances (Python bound methods, JS `bind`, Java method references). Closures capture variables, enabling lightweight objects (a function returning functions over private state).
```js
function counter() { let n = 0; return { inc: () => ++n, get: () => n }; }
```

### I9. Why interfaces cost nothing at runtime in TypeScript
They are erased during compilation. At runtime, only JavaScript objects exist. For runtime checks you need discriminants or validation libraries (zod, io-ts).

---

# 📊 Part 13: Reference Tables

### SOLID summary
| Letter | Principle | Smell it fixes | Typical fix |
|---|---|---|---|
| S | Single Responsibility | God class | Extract classes |
| O | Open/Closed | Edit `if/else` per new type | Polymorphism/Strategy |
| L | Liskov Substitution | Subclass throws/ignores base contract | Composition / split interface |
| I | Interface Segregation | Fat interface, empty methods | Small role interfaces |
| D | Dependency Inversion | `new` of concrete deps inside | Inject abstractions |

### GoF patterns at a glance
| Pattern | Category | Intent in one line |
|---|---|---|
| Singleton | Creational | One instance, global access |
| Factory Method | Creational | Delegate creation to a method/subclass |
| Abstract Factory | Creational | Create families of related objects |
| Builder | Creational | Build complex objects stepwise |
| Prototype | Creational | Clone existing objects |
| Adapter | Structural | Convert interface |
| Bridge | Structural | Decouple abstraction from implementation |
| Composite | Structural | Tree of uniform objects |
| Decorator | Structural | Add behavior by wrapping |
| Facade | Structural | Simple front for complex system |
| Flyweight | Structural | Share state to save memory |
| Proxy | Structural | Control access to an object |
| Chain of Responsibility | Behavioral | Pass request along handlers |
| Command | Behavioral | Request as object (undo/queue) |
| Interpreter | Behavioral | Evaluate a grammar |
| Iterator | Behavioral | Sequential access |
| Mediator | Behavioral | Central coordination |
| Memento | Behavioral | Save/restore state |
| Observer | Behavioral | Notify dependents |
| State | Behavioral | Behavior varies with state |
| Strategy | Behavioral | Interchangeable algorithms |
| Template Method | Behavioral | Skeleton with overridable steps |
| Visitor | Behavioral | New operations without changing classes |

### Abstract class vs interface
| | Abstract class | Interface |
|---|---|---|
| State (fields) | yes | no (constants only) |
| Constructors | yes | no |
| Multiple inheritance | no (single) | yes |
| Default behavior | yes | default methods (Java 8+, C# 8+) |
| Use for | shared base implementation | capability contract |

### Relationship symbols (UML)
| Relationship | Meaning | Lifetime |
|---|---|---|
| Association | knows | independent |
| Aggregation | has-a (weak) | independent |
| Composition | has-a (strong) | tied |
| Inheritance | is-a | n/a |
| Dependency | uses temporarily | n/a |

### Test doubles
| Type | Purpose |
|---|---|
| Dummy | fills a parameter |
| Stub | returns canned data |
| Spy | records calls |
| Mock | asserts interactions |
| Fake | simplified working implementation |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
```ts
class A { hi() { return "A"; } }
class B extends A { hi() { return "B"; } }
const x: A = new B();
console.log(x.hi());
```
**Output:** `B`. Runtime polymorphism.

### O2.
```ts
class P { constructor() { console.log("P"); } }
class C extends P { constructor() { super(); console.log("C"); } }
new C();
```
**Output:** `P` then `C`. The parent constructor runs first.

### O3.
```js
class Counter { static n = 0; constructor() { Counter.n++; } }
new Counter(); new Counter();
console.log(Counter.n);
```
**Output:** `2`.

### O4.
```js
const o = { name: "Ritesh Kumar", hi() { return this.name; } };
const f = o.hi;
console.log(f());
```
**Output:** `undefined` in sloppy mode (global `this.name`), or `TypeError` in strict mode/modules/classes. The method lost its `this`.

### O5.
```js
class A { x = 1; }
class B extends A { x = 2; }
console.log(new B().x);
```
**Output:** `2`. The subclass field initializer runs after `super()` and overwrites.

### O6.
```js
function Person(n) { this.n = n; }
Person.prototype.hi = function () { return "Hi " + this.n; };
const p = new Person("Ritesh Kumar");
console.log(p.hi(), p.hasOwnProperty("hi"));
```
**Output:** `Hi Ritesh Kumar false`. `hi` lives on the prototype, not on the instance.

### O7.
```python
class A:
    def f(self): return "A"
class B(A):
    def f(self): return "B" + super().f()
print(B().f())
```
**Output:** `BA`.

### O8.
```python
class A: pass
class B(A): pass
class C(A): pass
class D(B, C): pass
print([k.__name__ for k in D.__mro__])
```
**Output:** `['D', 'B', 'C', 'A', 'object']`.

### O9.
```java
class A { static String who() { return "A"; } }
class B extends A { static String who() { return "B"; } }
A a = new B();
System.out.println(a.who());
```
**Output:** `A`. Static methods are resolved by the declared (static) type.

### O10.
```ts
const a = Object.freeze({ items: [1] });
a.items.push(2);
console.log(a.items);
```
**Output:** `[1, 2]`. `freeze` is shallow.

### O11.
```js
class T { #secret = 42; reveal() { return this.#secret; } }
const t = new T();
console.log(t.reveal(), t.secret);
```
**Output:** `42 undefined`. `t.#secret` outside the class is a syntax error.

### O12.
```js
console.log(typeof class {}, class {} instanceof Function);
```
**Output:** `function true`. Classes are special functions.

---

# ✅ Part 15: MCQs

**1. Which pillar hides internal state behind methods?**
A) Inheritance  B) Encapsulation  C) Polymorphism  D) Recursion
**Answer: B**

**2. Method overriding is an example of:**
A) Compile-time polymorphism  B) Runtime polymorphism  C) Encapsulation  D) Composition
**Answer: B**

**3. "A class should have only one reason to change" is:**
A) OCP  B) LSP  C) SRP  D) ISP
**Answer: C**

**4. Which pattern wraps an object to add behavior without changing its interface?**
A) Adapter  B) Decorator  C) Facade  D) Builder
**Answer: B**

**5. Which pattern converts one interface into another?**
A) Adapter  B) Proxy  C) Observer  D) Singleton
**Answer: A**

**6. Square extending Rectangle violates:**
A) SRP  B) LSP  C) DIP  D) ISP
**Answer: B**

**7. Which pattern fits undo/redo?**
A) Command  B) Singleton  C) Flyweight  D) Interpreter
**Answer: A**

**8. Dependency Injection primarily improves:**
A) Speed  B) Testability and decoupling  C) Memory use  D) Inheritance depth
**Answer: B**

**9. Which is a creational pattern?**
A) Strategy  B) Builder  C) Adapter  D) Mediator
**Answer: B**

**10. Composition models:**
A) is-a  B) has-a  C) uses-a only  D) none
**Answer: B**

**11. The pattern behind event listeners is:**
A) Observer  B) Visitor  C) Bridge  D) Prototype
**Answer: A**

**12. Which pattern provides a simplified interface to a complex subsystem?**
A) Facade  B) Decorator  C) State  D) Template Method
**Answer: A**

**13. JavaScript inheritance is based on:**
A) Classes only  B) Prototypes  C) Interfaces  D) Templates
**Answer: B**

**14. An abstract class can:**
A) be instantiated  B) contain both abstract and concrete methods  C) not have fields  D) not have constructors
**Answer: B**

**15. Which principle says depend on abstractions, not concretions?**
A) OCP  B) DIP  C) SRP  D) YAGNI
**Answer: B**

**16. A God Object is:**
A) A well-designed facade  B) A class that knows/does too much  C) An immutable object  D) A singleton
**Answer: B**

**17. Which pattern replaces large `switch` on state with classes?**
A) State  B) Flyweight  C) Memento  D) Prototype
**Answer: A**

**18. Which pattern fits Express/Koa middleware?**
A) Chain of Responsibility  B) Singleton  C) Prototype  D) Memento
**Answer: A**

**19. Which statement about Singleton is most accurate?**
A) Always best practice  B) Easy to test  C) Often hides global state  D) Impossible in JS
**Answer: C**

**20. In UML, a filled diamond means:**
A) Aggregation  B) Composition  C) Inheritance  D) Dependency
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

1. **Deep inheritance hierarchies** for code reuse. Prefer composition.
2. **Using inheritance when "is-a" is false** (Stack extends ArrayList).
3. **God classes** that mix responsibilities.
4. **Singleton as a global variable**, making tests order-dependent.
5. **Exposing mutable internals** (public fields, returning internal lists).
6. **Anemic domain models** where all behavior lives in services.
7. **Creating dependencies with `new` inside classes**, blocking tests.
8. **Over-mocking**, which makes tests fragile.
9. **Pattern fever**: adding patterns without real variation.
10. **Premature abstraction** from accidental duplication (wrong DRY).
11. **Calling overridable methods in constructors.**
12. **Violating LSP** by throwing "not supported" in overrides.
13. **Fat interfaces** forcing empty implementations.
14. **Boolean flag parameters** (`doThing(true, false)`) instead of separate methods or options.
15. **Ignoring `equals`/`hashCode` contract.**
16. **Using exceptions for normal control flow.**
17. **Leaking infrastructure types** (ORM entities, HTTP objects) into the domain.
18. **Not documenting thread-safety.**
19. **Primitive obsession** instead of value objects.
20. **Memorizing pattern definitions** without recognizing them in real code.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You explain patterns by the **problem** they solve and the **trade-off** they bring, and you say when not to use them.
- You default to composition and small interfaces, and can justify the rare inheritance.
- You can show an LSP violation and fix it, not just recite the definition.
- You inject dependencies and know the difference between DIP, DI and IoC containers.
- You model with value objects, aggregates and invariants instead of getters and setters on data bags.
- You recognize patterns hidden inside frameworks (middleware, DI, ORM unit of work, event emitters).
- You name smells and apply targeted refactorings safely under tests.
- You apply the rule of three and delete unused abstractions.
- You reason about concurrency, immutability and identity vs equality.
- You design package/module boundaries and enforce them with tooling.
- You can talk about functional alternatives and mix styles sensibly.
- You use real incidents or refactors from your own work as examples.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Pillars in one line each
- **Encapsulation:** hide state, protect invariants.
- **Abstraction:** expose what, hide how.
- **Inheritance:** reuse via is-a (use sparingly).
- **Polymorphism:** same call, different behavior.

### SOLID in one line each
- SRP: one reason to change. OCP: extend, don't edit. LSP: subtypes substitutable. ISP: small interfaces. DIP: depend on abstractions.

### Pick a pattern fast
- Many variants of an algorithm → **Strategy**.
- Creation is complicated → **Factory / Builder**.
- Add features by wrapping → **Decorator**.
- Legacy or third-party interface → **Adapter**.
- Simplify a subsystem → **Facade**.
- Notify listeners → **Observer**.
- Undo / queue actions → **Command**.
- Behavior depends on state → **State**.
- Tree of parts → **Composite**.
- Control access or cache → **Proxy**.
- Middleware → **Chain of Responsibility**.

### LLD interview steps
1. Clarify requirements and scope (actors, use cases, constraints).
2. List entities and relationships (nouns → classes, verbs → methods).
3. Define interfaces and responsibilities (SRP).
4. Pick patterns where variation exists (Strategy, State, Observer).
5. Sketch classes and key flows (class + sequence diagram).
6. Code the core flow cleanly.
7. Discuss extensibility, concurrency, persistence, and testing.

### Design review questions
What changes most? Who depends on this? Can I test it without a database? Is state protected? Is there a simpler way?

### Final checklist before the interview
- [ ] Explain the four pillars with one code example each.
- [ ] Recite SOLID with an LSP violation example.
- [ ] Describe 8–10 patterns with a real use case each.
- [ ] Explain composition vs inheritance and DI vs DIP vs IoC.
- [ ] Be ready to design Parking Lot, Elevator, Vending Machine or Library in 30 minutes.
- [ ] Prepare two stories: a refactor you led and an over-engineering lesson.

