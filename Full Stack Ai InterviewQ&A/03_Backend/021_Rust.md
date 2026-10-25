# Rust Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **Rust 2021 edition, stable 1.75 to 1.85**. Features that matter for interviews are marked with the version: `async fn` in traits and return-position `impl Trait` in traits (1.75), `let ... else` (1.65), GATs (1.65), `std::sync::LazyLock` and `OnceLock` (1.80 / 1.70), let chains (Rust 2024 edition), `async` closures (1.85). Newer details are marked "verify in the official docs (doc.rust-lang.org)". Examples use the sample name **Ritesh Kumar**.
> Rust is a systems language with memory safety **without** a garbage collector. This file covers ownership, borrowing, lifetimes, traits, generics, error handling, concurrency, async, unsafe, macros, Cargo, performance and production practice.

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
- [Part 12: Rust Compiler and Runtime Internals](#-part-12-rust-compiler-and-runtime-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is Rust?
A statically typed, compiled systems language that gives memory safety and thread safety **at compile time** without a garbage collector. It started at Mozilla (Graydon Hoare) and is now run by the Rust Foundation. Main ideas: ownership, borrowing, lifetimes, zero-cost abstractions, and fearless concurrency.
```rust
fn main() {
    println!("Hello, Ritesh Kumar");
}
```

### Q2. Why use Rust? Typical use cases
Performance close to C and C++, but with no use-after-free, no double free, no data races in safe code. Used for: command-line tools (ripgrep, fd), web services (Axum, Actix), WebAssembly, embedded systems, operating system parts (Linux kernel drivers, Windows components), databases (TiKV, SurrealDB), browsers (Servo, parts of Firefox), and cloud infrastructure (Firecracker, parts of AWS).

### Q3. What are Cargo and rustup?
- **rustup**: installs and manages Rust toolchains (stable, beta, nightly) and targets.
- **Cargo**: the build tool and package manager. It builds, runs tests, manages dependencies from crates.io, and publishes crates.
```bash
cargo new hello          # new binary project
cargo build              # debug build
cargo build --release    # optimized build
cargo run                # build and run
cargo test               # run tests
cargo check              # type-check only (fast)
cargo fmt                # format code
cargo clippy             # lints
cargo doc --open         # build docs
```

### Q4. What is `Cargo.toml` and `Cargo.lock`?
`Cargo.toml` is the manifest: name, version, edition, dependencies, features. `Cargo.lock` records the exact resolved versions. Commit `Cargo.lock` for binaries and applications. For libraries it is optional.
```toml
[package]
name = "hello"
version = "0.1.0"
edition = "2021"

[dependencies]
serde = { version = "1", features = ["derive"] }
```

### Q5. Scalar and compound types
- Integers: `i8 i16 i32 i64 i128 isize` and `u8 ... usize`. Default integer is `i32`.
- Floats: `f32`, `f64` (default).
- `bool`, `char` (4 bytes, a Unicode scalar value).
- Tuples: `(i32, f64, &str)`. Arrays: `[i32; 3]` (fixed size, on the stack).
- Unit type `()` means "no value".

### Q6. Variables, mutability and shadowing
Variables are **immutable by default**. Use `mut` to allow change. Shadowing creates a new variable with the same name (it can even change the type).
```rust
let x = 5;
// x = 6;            // error: cannot assign twice
let mut y = 5;
y += 1;
let x = x * 2;       // shadowing: new variable
let spaces = "   ";
let spaces = spaces.len(); // type changes: &str -> usize
```

### Q7. `const` vs `static` vs `let`
- `let`: runtime binding, immutable by default.
- `const`: compile-time constant, inlined at each use, must have an explicit type.
- `static`: one fixed memory address for the whole program (`'static` lifetime). `static mut` needs `unsafe` to use.
```rust
const MAX_USERS: u32 = 1_000;
static GREETING: &str = "Hello";
```

### Q8. Functions and expressions
Rust is expression-based. The last expression without a semicolon is the return value. A semicolon turns an expression into a statement that returns `()`.
```rust
fn add(a: i32, b: i32) -> i32 {
    a + b            // no semicolon: returned
}
```

### Q9. Control flow
`if` is an expression. Loops: `loop` (can return a value with `break value`), `while`, `for`. Labels allow breaking outer loops.
```rust
let n = if score > 50 { "pass" } else { "fail" };
let mut i = 0;
let result = loop {
    i += 1;
    if i == 10 { break i * 2; }
};
for x in 0..5 { println!("{x}"); }      // 0..4
for x in 0..=5 { println!("{x}"); }     // 0..5
'outer: for a in 0..3 {
    for b in 0..3 {
        if b == 2 { continue 'outer; }
    }
}
```

### Q10. What is ownership? *(Must-know)*
Three rules:
1. Each value has exactly one **owner**.
2. There can be only one owner at a time.
3. When the owner goes out of scope, the value is **dropped** (memory freed).
```rust
let s1 = String::from("Ritesh");
let s2 = s1;            // ownership MOVES to s2
// println!("{s1}");    // error: borrow of moved value
println!("{s2}");
```
This removes whole classes of bugs: use-after-free and double free cannot happen in safe code.

### Q11. Move vs Copy vs Clone *(Must-know)*
- **Move**: default for types that own heap data (`String`, `Vec`, `Box`). The old binding becomes unusable.
- **Copy**: cheap bitwise copy, implicit. Only for types that own no heap resources and implement `Copy` (integers, floats, `bool`, `char`, tuples/arrays of Copy types, shared references `&T`).
- **Clone**: explicit, possibly expensive deep copy via `.clone()`.
```rust
let a = 5;
let b = a;            // Copy: both usable
let s = String::from("hi");
let t = s.clone();    // explicit deep copy: both usable
```

### Q12. What is borrowing? References `&` and `&mut` *(Must-know)*
A reference lets you use a value without taking ownership. Rules:
- Any number of shared references `&T`, **or** exactly one mutable reference `&mut T`, at a time (not both).
- References must always be valid (no dangling references).
```rust
fn len(s: &String) -> usize { s.len() }
fn push(s: &mut String) { s.push_str("!"); }

let mut name = String::from("Ritesh");
let n = len(&name);       // shared borrow
push(&mut name);          // mutable borrow
```
This rule prevents data races at compile time.

### Q13. What is the borrow checker?
A compiler phase that checks ownership, borrowing and lifetime rules. Since Rust 2018 it uses **non-lexical lifetimes (NLL)**: a borrow ends at its **last use**, not at the end of the scope.
```rust
let mut v = vec![1, 2, 3];
let first = &v[0];
println!("{first}");     // last use of `first`
v.push(4);               // OK with NLL
```

### Q14. `String` vs `&str`
- `String`: owned, growable, heap-allocated UTF-8 text.
- `&str`: a borrowed view (pointer + length) into UTF-8 data. String literals are `&'static str`.
Prefer `&str` for function parameters because it accepts both `&String` (via deref coercion) and literals.
```rust
fn greet(name: &str) { println!("Hi {name}"); }
greet("Ritesh Kumar");
greet(&String::from("Ritesh Kumar"));
```

### Q15. Why can you not index a `String` with `s[0]`?
Strings are UTF-8, so one character can use 1 to 4 bytes. Indexing by integer would be ambiguous (byte or char?) and could cut a character in half. Use slices by byte range (panics if not on a boundary), `.chars()`, or `.bytes()`.
```rust
let s = "नमस्ते";
println!("{}", s.len());               // 18 bytes
println!("{}", s.chars().count());     // 6 chars
let first: Option<char> = s.chars().next();
```

### Q16. Structs
```rust
struct User { name: String, age: u32 }

impl User {
    fn new(name: &str, age: u32) -> Self {       // associated function
        Self { name: name.to_string(), age }     // field init shorthand
    }
    fn greet(&self) -> String {                  // method
        format!("Hi, {}", self.name)
    }
}
let u = User::new("Ritesh Kumar", 28);
```
Also: tuple structs `struct Point(i32, i32);` and unit structs `struct Marker;`.

### Q17. Enums and `Option`
Rust enums are **sum types**: each variant can hold different data.
```rust
enum Shape {
    Circle(f64),
    Rect { w: f64, h: f64 },
    Unit,
}
```
`Option<T>` replaces null: `Some(T)` or `None`. There is no null in safe Rust.

### Q18. Pattern matching with `match` *(Must-know)*
`match` must be **exhaustive**: the compiler errors if you forget a case.
```rust
fn area(s: &Shape) -> f64 {
    match s {
        Shape::Circle(r) => std::f64::consts::PI * r * r,
        Shape::Rect { w, h } => w * h,
        Shape::Unit => 0.0,
    }
}
```
Other forms: `if let`, `while let`, `let else`, `matches!` macro, guards (`x if x > 5`), bindings (`n @ 1..=9`), and `_` as a wildcard.

### Q19. `if let` and `let else`
```rust
if let Some(v) = map.get("k") { println!("{v}"); }

let Some(v) = map.get("k") else {
    return;                // must diverge
};
```

### Q20. `Result` and error handling basics *(Must-know)*
`Result<T, E>` is `Ok(T)` or `Err(E)`. Errors are values. There are no exceptions. Use `match`, `?`, `unwrap_or`, `map_err`.
```rust
use std::fs;
use std::io;

fn read_name(path: &str) -> Result<String, io::Error> {
    let text = fs::read_to_string(path)?;   // ? returns Err early
    Ok(text.trim().to_string())
}
```

### Q21. `unwrap`, `expect` and `?`
- `unwrap()`: returns the value or **panics**. Fine in tests and quick scripts.
- `expect("msg")`: like `unwrap` with a message. Use it only for broken invariants ("this cannot fail").
- `?`: propagates the error (and converts it with `From`). Use this in library and application code.

### Q22. `panic!` vs returning `Result`
`panic!` means a bug or an unrecoverable state (index out of bounds, failed assertion). It unwinds the thread (or aborts, depending on `panic = "abort"` in the profile). Use `Result` for expected failures like missing file, bad input, or network error.

### Q23. Vectors, `Vec<T>`
Growable heap array.
```rust
let mut v = vec![1, 2, 3];
v.push(4);
let x = v[1];                 // panics if out of range
let y = v.get(10);            // Option<&i32> -> None
for n in &v { println!("{n}"); }
for n in &mut v { *n *= 2; }
```

### Q24. `HashMap`
```rust
use std::collections::HashMap;
let mut scores: HashMap<String, u32> = HashMap::new();
scores.insert("Ritesh Kumar".into(), 90);
*scores.entry("Ritesh Kumar".into()).or_insert(0) += 5;
if let Some(s) = scores.get("Ritesh Kumar") { println!("{s}"); }
```
Default hasher is SipHash (DoS resistant, not the fastest). Iteration order is **random**. Use `BTreeMap` for sorted order.

### Q25. Slices
A slice `&[T]` is a borrowed view (pointer + length) of contiguous data.
```rust
let a = [1, 2, 3, 4, 5];
let s: &[i32] = &a[1..4];     // [2, 3, 4]
```

### Q26. Iterators and closures basics
Iterators are lazy. Adapters (`map`, `filter`, `take`) build a pipeline. Consumers (`collect`, `sum`, `for`) run it.
```rust
let total: i32 = (1..=10).filter(|n| n % 2 == 0).map(|n| n * n).sum();
let names: Vec<String> = vec!["a", "b"].into_iter().map(String::from).collect();
```

### Q27. Modules and visibility
Everything is **private by default**. Use `pub` to export. `mod` declares a module, `use` brings names into scope.
```rust
mod billing {
    pub struct Invoice { pub id: u32, amount: f64 }   // `amount` is private
    pub fn total() -> f64 { 0.0 }
}
use billing::Invoice;
```
Variants: `pub(crate)`, `pub(super)`, `pub(in path)`.

### Q28. What are crates and packages?
- **Crate**: a compilation unit (binary or library).
- **Package**: one or more crates described by one `Cargo.toml` (at most one library crate, any number of binaries).
- **Workspace**: several packages sharing one `Cargo.lock` and `target` directory.

### Q29. Traits, the basics *(Must-know)*
A trait defines shared behavior (like an interface), with optional default methods.
```rust
trait Speak {
    fn name(&self) -> String;
    fn speak(&self) -> String { format!("{} speaks", self.name()) }
}
struct Dog;
impl Speak for Dog { fn name(&self) -> String { "Dog".into() } }
```

### Q30. Generics and trait bounds
```rust
fn largest<T: PartialOrd + Copy>(items: &[T]) -> T {
    let mut m = items[0];
    for &i in items { if i > m { m = i; } }
    m
}
// where clause for readability
fn show<T>(x: T) where T: std::fmt::Display { println!("{x}"); }
```
Generics are **monomorphized**: the compiler generates a separate copy for each concrete type (fast, but can grow binary size).

### Q31. `derive` and common traits
```rust
#[derive(Debug, Clone, PartialEq, Eq, Hash, Default)]
struct Point { x: i32, y: i32 }
println!("{:?}", Point::default());
println!("{:#?}", Point { x: 1, y: 2 });   // pretty debug
```
Common: `Debug`, `Clone`, `Copy`, `PartialEq`, `Eq`, `PartialOrd`, `Ord`, `Hash`, `Default`.

### Q32. `Display` vs `Debug`
`Debug` (`{:?}`) is for programmers and is usually derived. `Display` (`{}`) is for users and must be implemented by hand.
```rust
use std::fmt;
impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}
```
Implementing `Display` gives you `.to_string()` for free.

### Q33. Lifetimes, the basics
A lifetime is the region of code where a reference is valid. Annotations (`'a`) do not change how long values live. They tell the compiler how the lifetimes of inputs and outputs relate.
```rust
fn longest<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() >= b.len() { a } else { b }
}
```
The result cannot outlive the shorter of the two inputs.

### Q34. Testing basics
```rust
pub fn add(a: i32, b: i32) -> i32 { a + b }

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn adds() { assert_eq!(add(2, 3), 5); }

    #[test]
    #[should_panic(expected = "boom")]
    fn panics() { panic!("boom"); }
}
```
Run with `cargo test`. Integration tests go in the `tests/` directory. Doc tests run code in `///` comments.

### Q35. Printing and formatting
```rust
let name = "Ritesh Kumar";
println!("{name}");              // inline args
println!("{:>10}", name);        // right-align width 10
println!("{:.2}", 3.14159);      // 3.14
println!("{:08.3}", 3.14159);    // 0003.142
println!("{:?}", Some(3));
eprintln!("to stderr");
let s = format!("{}-{}", 1, 2);  // returns String
```

---

# 🔵 Part 2: Junior (1–3 years)

### Q36. Stack vs heap in Rust
Fixed-size values (integers, arrays, structs of those) live on the stack. Dynamically sized or long-lived data lives on the heap, usually behind an owning pointer: `Box<T>`, `Vec<T>`, `String`. The pointer (and length, capacity) is on the stack. Dropping the owner frees the heap memory automatically (RAII).

### Q37. `Box<T>` and when to use it
A single-owner heap pointer. Use it for: recursive types (size must be known), moving big values cheaply, and trait objects (`Box<dyn Trait>`).
```rust
enum List { Cons(i32, Box<List>), Nil }
```

### Q38. `Rc<T>` and `Arc<T>` *(Must-know)*
Reference-counted shared ownership.
- `Rc<T>`: single-threaded, cheap, non-atomic counts. **Not** `Send`.
- `Arc<T>`: atomic counts, safe across threads, slightly slower.
```rust
use std::rc::Rc;
let a = Rc::new(String::from("shared"));
let b = Rc::clone(&a);               // increments count, no deep copy
println!("{}", Rc::strong_count(&a)); // 2
```
Cycles with `Rc` leak memory. Break them with `Weak<T>`.

### Q39. Interior mutability: `Cell`, `RefCell`, `Mutex` *(Must-know)*
Lets you mutate through a shared reference, with the borrow rules checked at **runtime** (or by a lock) instead of compile time.
- `Cell<T>`: for `Copy` types, get/set by value.
- `RefCell<T>`: dynamic borrow checking, panics on violation. Single thread.
- `Mutex<T>` / `RwLock<T>`: thread-safe equivalents.
```rust
use std::{cell::RefCell, rc::Rc};
let shared = Rc::new(RefCell::new(vec![1]));
shared.borrow_mut().push(2);
```
Common combos: `Rc<RefCell<T>>` (single thread), `Arc<Mutex<T>>` (multi thread).

### Q40. Lifetime elision rules
The compiler adds lifetimes for you in common cases:
1. Each reference parameter gets its own lifetime.
2. If there is exactly one input lifetime, it is given to all outputs.
3. If one input is `&self` or `&mut self`, its lifetime is given to all outputs.
That is why `fn first(s: &str) -> &str` compiles without annotations.

### Q41. Structs holding references
```rust
struct Parser<'a> { input: &'a str }
impl<'a> Parser<'a> {
    fn first_word(&self) -> &'a str {
        self.input.split_whitespace().next().unwrap_or("")
    }
}
```
The struct cannot outlive the data it borrows.

### Q42. `'static` lifetime
Means the reference **can** live for the whole program. String literals are `&'static str`. A bound `T: 'static` means `T` holds no non-static borrows (it may still be an owned `String`). This is required by `thread::spawn` and `tokio::spawn`. It does **not** mean "leak the value".

### Q43. Error handling with custom error types *(Must-know)*
```rust
use std::fmt;

#[derive(Debug)]
enum AppError {
    Io(std::io::Error),
    Parse(std::num::ParseIntError),
}
impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            AppError::Io(e) => write!(f, "io: {e}"),
            AppError::Parse(e) => write!(f, "parse: {e}"),
        }
    }
}
impl std::error::Error for AppError {}
impl From<std::io::Error> for AppError { fn from(e: std::io::Error) -> Self { AppError::Io(e) } }
impl From<std::num::ParseIntError> for AppError { fn from(e: std::num::ParseIntError) -> Self { AppError::Parse(e) } }

fn read_num(p: &str) -> Result<i32, AppError> {
    let s = std::fs::read_to_string(p)?;   // io::Error -> AppError
    Ok(s.trim().parse()?)                  // ParseIntError -> AppError
}
```

### Q44. `thiserror` vs `anyhow`
- **`thiserror`**: derive macro to define typed error enums. Use in **libraries** so callers can match on variants.
- **`anyhow`**: `anyhow::Result<T>` with a type-erased error and `.context("...")`. Use in **applications** where you only report errors.
```rust
#[derive(thiserror::Error, Debug)]
enum DbError {
    #[error("not found: {0}")] NotFound(String),
    #[error(transparent)] Io(#[from] std::io::Error),
}
use anyhow::{Context, Result};
fn run() -> Result<()> {
    std::fs::read_to_string("cfg.toml").context("reading config")?;
    Ok(())
}
```

### Q45. `Option` combinators
```rust
let name: Option<&str> = Some("Ritesh");
name.map(|n| n.len());                 // Option<usize>
name.and_then(|n| n.chars().next());   // Option<char>
name.unwrap_or("guest");
name.ok_or("missing")?;                // Option -> Result
name.filter(|n| n.len() > 3);
name.is_some_and(|n| n.starts_with('R'));
```

### Q46. Iterator traits: `Iterator`, `IntoIterator`
`Iterator` needs `fn next(&mut self) -> Option<Self::Item>`. `for` loops call `IntoIterator::into_iter`. Three forms:
- `iter()` yields `&T`.
- `iter_mut()` yields `&mut T`.
- `into_iter()` yields `T` (consumes the collection).
```rust
struct Counter(u32);
impl Iterator for Counter {
    type Item = u32;
    fn next(&mut self) -> Option<u32> {
        if self.0 < 5 { self.0 += 1; Some(self.0) } else { None }
    }
}
```

### Q47. Closures and `Fn`, `FnMut`, `FnOnce` *(Must-know)*
A closure captures variables by reference, mutable reference, or by move, depending on use.
- `Fn`: only reads captured data; callable many times.
- `FnMut`: mutates captured data; callable many times.
- `FnOnce`: consumes captured data; callable once.
Every `Fn` is also `FnMut` and `FnOnce`. Use `move` to force ownership into the closure (needed for threads).
```rust
fn apply<F: Fn(i32) -> i32>(f: F, x: i32) -> i32 { f(x) }
let k = 10;
apply(|x| x + k, 5);
let mut count = 0;
let mut inc = || count += 1;   // FnMut
inc(); inc();
```
Return closures with `impl Fn(i32) -> i32` or `Box<dyn Fn(i32) -> i32>`.

### Q48. Collect into different types
`collect()` is generic over the target, so you must give a type.
```rust
let v: Vec<i32> = (1..4).collect();
let s: String = vec!["a", "b"].concat();
let m: HashMap<_, _> = vec![("a", 1), ("b", 2)].into_iter().collect();
let r: Result<Vec<i32>, _> = "1,2,x".split(',').map(str::parse::<i32>).collect(); // Err on first bad item
```

### Q49. Sorting
```rust
let mut v = vec![3, 1, 2];
v.sort();                          // stable
v.sort_unstable();                 // faster, not stable
v.sort_by(|a, b| b.cmp(a));        // descending
let mut f = vec![2.5, 1.0];
f.sort_by(|a, b| a.partial_cmp(b).unwrap());  // floats are not Ord
people.sort_by_key(|p| p.age);
```

### Q50. `Ord` vs `PartialOrd`; why are floats not `Ord`?
`f32` and `f64` have `NaN`, which is not equal to itself and is not comparable. So floats implement only `PartialOrd` and `PartialEq`. That is also why they cannot be `HashMap` keys or used directly in `BTreeMap`. Use `total_cmp` or the `ordered-float` crate.

### Q51. Trait objects and `dyn Trait` *(Must-know)*
Dynamic dispatch through a vtable.
```rust
trait Shape { fn area(&self) -> f64; }
struct Sq(f64);
impl Shape for Sq { fn area(&self) -> f64 { self.0 * self.0 } }

let shapes: Vec<Box<dyn Shape>> = vec![Box::new(Sq(2.0))];
for s in &shapes { println!("{}", s.area()); }
```
Requires the trait to be **object safe** (no generic methods, no `Self` return by value, etc.).

### Q52. Static vs dynamic dispatch
- **Static** (`impl Trait` / `<T: Trait>`): monomorphized, inlined, fastest, bigger binary.
- **Dynamic** (`dyn Trait`): one vtable lookup per call, smaller binary, allows heterogeneous collections.

### Q53. `impl Trait` in argument and return position
```rust
fn print_all(items: impl IntoIterator<Item = impl std::fmt::Display>) {
    for i in items { println!("{i}"); }
}
fn evens() -> impl Iterator<Item = u32> { (0..).step_by(2) }
```
Return-position `impl Trait` hides one concrete type (you cannot return two different types from branches).

### Q54. Associated types vs generics on traits
Use an **associated type** when there is one natural choice per implementor (`Iterator::Item`). Use a **generic parameter** when one type can implement the trait many ways (`From<T>`, `Add<Rhs>`).

### Q55. Operator overloading
```rust
use std::ops::Add;
#[derive(Debug, Clone, Copy)]
struct V(i32, i32);
impl Add for V { type Output = V; fn add(self, o: V) -> V { V(self.0 + o.0, self.1 + o.1) } }
```

### Q56. `From`, `Into`, `TryFrom`, `AsRef`
- Implement `From<A> for B` and you get `Into<B> for A` free.
- `TryFrom` is for conversions that can fail.
- `AsRef<str>` lets a function accept `String`, `&str`, and more.
```rust
fn open<P: AsRef<std::path::Path>>(p: P) { let _ = p.as_ref(); }
let n: u8 = u8::try_from(300_i32).unwrap_or(u8::MAX);
```

### Q57. `Default` and the builder pattern
```rust
#[derive(Default, Debug)]
struct Config { port: u16, host: String, debug: bool }
let c = Config { port: 8080, ..Default::default() };
```
For many optional fields, write a builder with chained methods that return `Self`.

### Q58. Integer overflow behavior
Debug builds **panic** on overflow. Release builds wrap (two's complement) by default. Be explicit:
```rust
let a: u8 = 250;
a.wrapping_add(10);       // 4
a.checked_add(10);        // None
a.saturating_add(10);     // 255
a.overflowing_add(10);    // (4, true)
```

### Q59. Casting with `as`
`as` can truncate silently (`300_i32 as u8` is `44`) and saturates float-to-int. Prefer `From`/`TryFrom` when you want safety.

### Q60. Threads basics
```rust
use std::thread;
let handle = thread::spawn(|| { println!("in thread"); 42 });
let result = handle.join().unwrap();   // 42
```
Use `move` closures to give the thread ownership of captured data.

### Q61. Message passing with channels
```rust
use std::sync::mpsc;
let (tx, rx) = mpsc::channel();
let tx2 = tx.clone();
std::thread::spawn(move || tx.send("a").unwrap());
std::thread::spawn(move || tx2.send("b").unwrap());
for msg in rx.iter().take(2) { println!("{msg}"); }
```
mpsc means multi-producer, single-consumer. The receiver ends when all senders are dropped.

### Q62. Shared state with `Arc<Mutex<T>>`
```rust
use std::sync::{Arc, Mutex};
let counter = Arc::new(Mutex::new(0));
let hs: Vec<_> = (0..4).map(|_| {
    let c = Arc::clone(&counter);
    std::thread::spawn(move || { *c.lock().unwrap() += 1; })
}).collect();
for h in hs { h.join().unwrap(); }
assert_eq!(*counter.lock().unwrap(), 4);
```
The lock guard unlocks when dropped.

### Q63. `Send` and `Sync` *(Must-know)*
Marker traits that make "fearless concurrency" work.
- `T: Send`: ownership of `T` can be moved to another thread.
- `T: Sync`: `&T` can be shared between threads (`T` is `Sync` if `&T` is `Send`).
`Rc` is neither. `RefCell` is `Send` but not `Sync`. `Arc<T>` is `Send` + `Sync` only if `T` is. Raw pointers are neither. The compiler derives these automatically.

### Q64. Mutex poisoning
If a thread panics while holding a `Mutex` guard, the mutex is marked **poisoned**. `lock()` returns `Err(PoisonError)`. You can recover the data with `.into_inner()` or just `unwrap()` to propagate the panic. `parking_lot::Mutex` does not poison.

### Q65. Slices of `Vec` and ownership in function calls
Pass `&[T]` instead of `&Vec<T>`, and `&str` instead of `&String`. Clippy warns about `&Vec<T>` (`ptr_arg`). Take ownership (`Vec<T>`) only if you need to store or consume the data.

### Q66. Common Clippy lints you should know
`needless_clone`, `ptr_arg`, `redundant_clone`, `collapsible_if`, `manual_map`, `unwrap_used` (opt-in). Run `cargo clippy -- -D warnings` in CI.

### Q67. Documentation comments
`///` documents the next item, `//!` documents the enclosing module or crate. Code blocks inside docs are compiled and run as **doc tests**.
```rust
/// Adds two numbers.
///
/// ```
/// assert_eq!(mycrate::add(1, 2), 3);
/// ```
pub fn add(a: i32, b: i32) -> i32 { a + b }
```

### Q68. Editions
Editions (2015, 2018, 2021, 2024) allow small breaking changes without splitting the ecosystem. Crates of different editions link together. Migrate with `cargo fix --edition`.

### Q69. Features in Cargo
Optional, additive compile-time flags.
```toml
[features]
default = ["json"]
json = ["dep:serde_json"]
```
Features must be **additive**: enabling one must never remove behavior, because Cargo unifies features across the dependency graph.

### Q70. Common beginner compile errors and meaning
- `borrow of moved value`: you used a value after moving it. Borrow or clone.
- `cannot borrow as mutable because also borrowed as immutable`: overlapping borrows.
- `missing lifetime specifier`: the compiler cannot infer which input a returned reference borrows from.
- `the trait bound ... is not satisfied`: add the missing bound or derive.
- `... does not live long enough`: a reference outlives its owner.

---

# 🟡 Part 3: Mid (3–5 years)

### Q71. Async/await in Rust: how does it work? *(Must-know)*
`async fn` returns a `Future`, a state machine that does nothing until polled. An **executor/runtime** (Tokio, async-std, smol) polls futures. When a future cannot progress (waiting for I/O) it returns `Poll::Pending` and registers a `Waker`. The runtime polls it again after the waker fires. There is no built-in runtime in `std`.
```rust
#[tokio::main]
async fn main() {
    let body = fetch("https://example.com").await;
}
async fn fetch(url: &str) -> String { /* ... */ String::new() }
```
Futures are **lazy**: calling `fetch(...)` without `.await` or spawning does nothing.

### Q72. `tokio::spawn`, `join!` and `select!`
```rust
let h = tokio::spawn(async { 1 + 1 });        // runs concurrently, needs 'static + Send
let n = h.await.unwrap();

let (a, b) = tokio::join!(task_a(), task_b());   // run both, wait for both

tokio::select! {                                 // first to finish wins, others dropped
    r = task_a() => println!("a {r:?}"),
    _ = tokio::time::sleep(std::time::Duration::from_secs(1)) => println!("timeout"),
}
```
Dropping a future cancels it at its next `.await` point.

### Q73. Blocking inside async code
Blocking calls (heavy CPU, `std::thread::sleep`, sync file or DB calls) block a runtime worker thread and stall other tasks. Use `tokio::task::spawn_blocking` or a dedicated thread pool/rayon for CPU-heavy or blocking work, and use `tokio::time::sleep` instead of `thread::sleep`.

### Q74. Why must futures be `Send` for `tokio::spawn`?
The multi-thread runtime can move a task between worker threads at any `.await`. Anything held across an `.await` (including a `MutexGuard` from `std::sync`, or an `Rc`) must be `Send`. A common fix is to drop the guard before awaiting, or use `tokio::sync::Mutex` when the lock must be held across an await.

### Q75. `std::sync::Mutex` vs `tokio::sync::Mutex`
Use `std::sync::Mutex` for short critical sections that never `.await` while locked (faster). Use `tokio::sync::Mutex` only when you must hold the lock across `.await`. Holding a `std` guard across `.await` can deadlock or make the future `!Send`.

### Q76. `Pin` and why it exists
Async state machines can contain **self-references** (a reference to a local variable stored in the same struct). Moving such a value in memory would invalidate the pointer. `Pin<P>` guarantees the pointee will not move (unless it is `Unpin`). Most types are `Unpin`. You meet `Pin` when you write `Future` manually or store `Pin<Box<dyn Future>>`.

### Q77. Writing a manual `Future`
```rust
use std::{future::Future, pin::Pin, task::{Context, Poll}};

struct Ready(Option<u32>);
impl Future for Ready {
    type Output = u32;
    fn poll(mut self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<u32> {
        Poll::Ready(self.0.take().unwrap())
    }
}
```
If you return `Pending`, you must arrange for `cx.waker().wake()` to be called later, or the task will hang.

### Q78. Async channels and sync primitives (Tokio)
`mpsc` (bounded and unbounded), `oneshot` (single value reply), `broadcast` (many receivers, all get each message), `watch` (latest value), `Semaphore`, `Notify`, `RwLock`. **Prefer bounded channels** to get backpressure.
```rust
let (tx, mut rx) = tokio::sync::mpsc::channel::<String>(100);
tokio::spawn(async move { tx.send("hi".into()).await.unwrap(); });
while let Some(m) = rx.recv().await { println!("{m}"); }
```

### Q79. Graceful shutdown in async services
Use `tokio::signal::ctrl_c()` or a `CancellationToken` (from `tokio-util`) shared across tasks. Axum offers `with_graceful_shutdown`. On shutdown: stop accepting work, let in-flight requests finish within a timeout, flush logs, close pools.

### Q80. Generics: monomorphization, `dyn`, and code bloat
Each concrete type creates a new copy. For large generic functions called with many types, split out a non-generic inner function to reduce compile time and binary size.
```rust
pub fn read<P: AsRef<std::path::Path>>(p: P) -> std::io::Result<String> {
    fn inner(p: &std::path::Path) -> std::io::Result<String> { std::fs::read_to_string(p) }
    inner(p.as_ref())
}
```

### Q81. Trait bounds, `where`, supertraits, blanket impls
```rust
trait Named { fn name(&self) -> String; }
trait Greeter: Named {                          // supertrait
    fn greet(&self) -> String { format!("Hello {}", self.name()) }
}
// blanket impl: every T that is Display is also Named
impl<T: std::fmt::Display> Named for T { fn name(&self) -> String { self.to_string() } }
```
The **orphan rule**: you can implement a trait for a type only if the trait or the type is local to your crate. This avoids conflicting impls. Work around it with the newtype pattern.

### Q82. Newtype pattern
```rust
struct Meters(f64);
struct Seconds(f64);
// type safety: cannot mix them up. Also lets you impl foreign traits for foreign types.
struct Wrapper(Vec<String>);
impl std::fmt::Display for Wrapper { /* ... */ }
```
Zero runtime cost.

### Q83. Const generics
```rust
struct Matrix<const R: usize, const C: usize>([[f64; C]; R]);
fn sum<const N: usize>(a: [i32; N]) -> i32 { a.iter().sum() }
```

### Q84. Generic Associated Types (GATs, 1.65)
Associated types that can have their own generic parameters or lifetimes. The classic use is a **lending iterator** (items borrow from the iterator itself).
```rust
trait Lending {
    type Item<'a> where Self: 'a;
    fn next<'a>(&'a mut self) -> Option<Self::Item<'a>>;
}
```

### Q85. Higher-ranked trait bounds (HRTB) `for<'a>`
"For every lifetime `'a`." Needed when a closure accepts references of any lifetime.
```rust
fn call<F>(f: F) where F: for<'a> Fn(&'a str) -> &'a str {
    println!("{}", f("hello"));
}
```
You rarely write it. The compiler infers it for plain `Fn(&str) -> &str`.

### Q86. Variance and subtyping (short answer)
Lifetimes have subtyping: `&'long T` can be used where `&'short T` is expected. `&T` is covariant in `T`, `&mut T` is **invariant** in `T` (otherwise you could write a short-lived value into a long-lived slot), and `fn(T)` is contravariant in `T`. `PhantomData` is used to tell the compiler how a type uses its generics.

### Q87. `PhantomData`
Zero-sized marker to claim ownership or lifetime usage of a type parameter that does not appear in any field.
```rust
use std::marker::PhantomData;
struct Id<T> { raw: u64, _t: PhantomData<T> }   // Id<User> != Id<Order>
```

### Q88. Typestate pattern
Encode state in the type so invalid operations do not compile.
```rust
struct Open; struct Closed;
struct Door<S> { _s: PhantomData<S> }
impl Door<Closed> { fn open(self) -> Door<Open> { Door { _s: PhantomData } } }
impl Door<Open>   { fn close(self) -> Door<Closed> { Door { _s: PhantomData } } }
```

### Q89. Smart pointers: `Deref` and `Drop`
- `Deref` lets `*x` and method calls pass through the wrapper (deref coercion: `&String` → `&str`, `&Box<T>` → `&T`).
- `Drop` runs cleanup code when a value goes out of scope (RAII for files, locks, sockets). You cannot call `.drop()` directly. Use `std::mem::drop(x)`.
Drop order: locals in **reverse declaration order**, struct fields in **declaration order**.

### Q90. `Cow<'a, T>` (clone-on-write)
Holds either borrowed or owned data and clones only when mutation is needed.
```rust
use std::borrow::Cow;
fn normalize(s: &str) -> Cow<str> {
    if s.contains(' ') { Cow::Owned(s.replace(' ', "_")) } else { Cow::Borrowed(s) }
}
```

### Q91. `mem::take`, `mem::replace`, `mem::swap`
Move a value out of a `&mut` place by leaving something valid behind.
```rust
let mut name = String::from("Ritesh");
let old = std::mem::take(&mut name);        // name is now ""
let prev = std::mem::replace(&mut name, "Kumar".into());
```
These solve "cannot move out of borrowed content".

### Q92. `Option<Box<T>>` linked list pitfalls
Use `as_ref()`, `as_mut()`, and `take()` to work with `Option<Box<Node>>` through references.
```rust
struct Node { v: i32, next: Option<Box<Node>> }
fn push_front(head: &mut Option<Box<Node>>, v: i32) {
    let old = head.take();
    *head = Some(Box::new(Node { v, next: old }));
}
```

### Q93. Slice patterns and advanced matching
```rust
match slice {
    [] => println!("empty"),
    [x] => println!("one {x}"),
    [first, .., last] => println!("{first}..{last}"),
}
match n { 1 | 2 => "small", 3..=9 => "mid", x if x < 0 => "neg", _ => "big" }
```
Use `ref` / `ref mut` or match ergonomics (default binding modes) to avoid moving out.

### Q94. Iterator performance: zero-cost abstractions
Iterator chains compile to the same machine code as hand-written loops (and often vectorize). Avoid collecting into temporary `Vec`s in the middle of a chain. Use `.iter().copied()`, `.windows(n)`, `.chunks(n)`, `.zip()`, `.rev()`, `.flat_map()`, `.fold()`.

### Q95. `impl Trait for Vec<T>` vs extension traits
You cannot add inherent methods to foreign types. Define an **extension trait** and implement it for the foreign type.
```rust
trait StrExt { fn is_blank(&self) -> bool; }
impl StrExt for str { fn is_blank(&self) -> bool { self.trim().is_empty() } }
```

### Q96. Serde basics
```rust
use serde::{Serialize, Deserialize};
#[derive(Serialize, Deserialize, Debug)]
struct User {
    name: String,
    #[serde(rename = "emailAddress")] email: String,
    #[serde(default)] active: bool,
    #[serde(skip_serializing_if = "Option::is_none")] nick: Option<String>,
}
let u: User = serde_json::from_str(r#"{"name":"Ritesh Kumar","emailAddress":"r@x.com"}"#)?;
let json = serde_json::to_string_pretty(&u)?;
```
Serde is format-agnostic: the same derive works for JSON, TOML, YAML, bincode, and more.

### Q97. Building an HTTP API with Axum
```rust
use axum::{routing::get, Router, Json, extract::{Path, State}};
use std::sync::Arc;

#[derive(Clone)] struct AppState { db: Arc<Db> }

async fn user(Path(id): Path<u32>, State(s): State<AppState>) -> Json<User> {
    Json(s.db.find(id).await)
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/users/:id", get(user)).with_state(AppState { db: Arc::new(Db) });
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
```
Other frameworks: Actix Web, Rocket, Warp, Poem. Middleware in Axum uses `tower` layers.

### Q98. Database access: SQLx, Diesel, SeaORM
- **SQLx**: async, raw SQL, compile-time checked queries with the `query!` macro (needs a DB or offline data).
- **Diesel**: sync, type-safe query DSL, strong compile-time guarantees.
- **SeaORM**: async ORM on top of SQLx.
```rust
let row = sqlx::query_as::<_, User>("SELECT id, name FROM users WHERE id = $1")
    .bind(id).fetch_one(&pool).await?;
```
Always use a **connection pool** and parameterized queries.

### Q99. Logging and tracing
`log` is a facade. `tracing` adds **structured, span-based** diagnostics and is the standard for async code.
```rust
use tracing::{info, instrument};
#[instrument(skip(db))]
async fn get_user(db: &Db, id: u32) { info!(id, "loading user"); }
tracing_subscriber::fmt().with_env_filter("info").init();
```
Pair with OpenTelemetry for distributed tracing.

### Q100. Configuration and environment
Use `std::env::var`, `dotenvy`, `config`, or `figment`. Parse into a typed struct with Serde at startup and fail fast on missing values. Never log secrets.

### Q101. CLI apps with `clap`
```rust
use clap::Parser;
#[derive(Parser)]
struct Args {
    #[arg(short, long)] name: String,
    #[arg(short, long, default_value_t = 1)] count: u8,
}
let args = Args::parse();
```

### Q102. Testing in depth
- Unit tests next to code (`#[cfg(test)]`), integration tests in `tests/`, doc tests.
- `#[tokio::test]` for async tests.
- Property-based testing with `proptest` or `quickcheck`.
- Mocking with `mockall`, or better, depend on traits and write small fakes.
- Snapshot testing with `insta`. Benchmarks with `criterion`.
- Coverage with `cargo llvm-cov`. Fuzzing with `cargo fuzz`.

### Q103. Workspaces and project layout
```
my-app/
├─ Cargo.toml          # [workspace] members = ["crates/*"]
├─ crates/
│  ├─ core/            # domain logic (lib)
│  ├─ api/             # HTTP layer (bin)
│  └─ cli/             # CLI (bin)
```
Shared dependency versions with `[workspace.dependencies]`. A single `target/` dir speeds up builds.

### Q104. Common dependency hygiene
`cargo update`, `cargo tree -d` (duplicates), `cargo audit` (RUSTSEC advisories), `cargo deny` (licenses, bans, advisories), `cargo outdated`, `cargo machete`/`udeps` (unused deps). Pin MSRV (`rust-version`) in `Cargo.toml`.

### Q105. Cross compilation
```bash
rustup target add x86_64-unknown-linux-musl
cargo build --release --target x86_64-unknown-linux-musl   # static binary
```
`cross` and `cargo zigbuild` help with linkers. musl gives static binaries but can be slower with the default allocator (consider `mimalloc`/`jemalloc`).

### Q106. Release profile tuning
```toml
[profile.release]
opt-level = 3
lto = "fat"          # link-time optimization
codegen-units = 1    # better optimization, slower build
panic = "abort"      # smaller binary, no unwinding
strip = true
```

### Q107. `Result` in `main` and exit codes
```rust
fn main() -> Result<(), Box<dyn std::error::Error>> {
    run()?;
    Ok(())
}
```
Returning `Err` prints the `Debug` form and exits with code 1. Use `std::process::ExitCode` for custom codes.

### Q108. Shadowed bounds: `?Sized`
Generic parameters are `Sized` by default. Use `T: ?Sized` to accept `str`, `[T]` or `dyn Trait`.
```rust
fn show<T: ?Sized + std::fmt::Debug>(x: &T) { println!("{x:?}"); }
show("hello");        // T = str
```

### Q109. Dynamically sized types and fat pointers
`&[T]`, `&str` and `&dyn Trait` are **fat pointers**: pointer + extra metadata (length or vtable). They are 2 words wide.
```rust
assert_eq!(std::mem::size_of::<&u8>(), 8);
assert_eq!(std::mem::size_of::<&[u8]>(), 16);   // on 64-bit
```

### Q110. Niche optimization
`Option<&T>`, `Option<Box<T>>`, `Option<NonZeroU32>` have the **same size** as the inner type because `None` uses an invalid bit pattern (null). Enums use niches in other fields too.

---

# 🟠 Part 4: Senior (5–7 years)

### Q111. What is `unsafe` Rust? *(Must-know)*
`unsafe` lets you do five things the compiler cannot verify:
1. Dereference a raw pointer.
2. Call an `unsafe` function (including FFI).
3. Access or modify a `static mut`.
4. Implement an `unsafe` trait (`Send`, `Sync`).
5. Access fields of a `union`.
It does **not** turn off the borrow checker. The contract: you promise the invariants hold. Keep `unsafe` blocks tiny, wrap them in a safe API, and document with `// SAFETY:` comments.
```rust
let x = 5;
let p = &x as *const i32;
let v = unsafe { *p };   // SAFETY: p points to a live, aligned i32
```

### Q112. Undefined behavior in Rust
Examples: data races, dangling or misaligned deref, invalid values (`bool` that is not 0/1, null `&T`), violating aliasing rules (two live `&mut` to the same data), reading uninitialized memory, breaking `Pin` guarantees. Use **Miri** (`cargo +nightly miri test`) to detect many of these, plus sanitizers and `loom` for concurrency.

### Q113. FFI: calling C from Rust and Rust from C
```rust
extern "C" { fn abs(x: i32) -> i32; }
let n = unsafe { abs(-3) };

#[no_mangle]
pub extern "C" fn add(a: i32, b: i32) -> i32 { a + b }

#[repr(C)] struct Point { x: f64, y: f64 }     // stable C layout
```
Never let a panic unwind across an FFI boundary (use `catch_unwind` or `extern "C-unwind"`). Tools: `bindgen` (C → Rust), `cbindgen` (Rust → C), `cxx`, `PyO3` (Python), `napi-rs` (Node), `wasm-bindgen` (JS/WASM).

### Q114. Memory layout and `repr`
Default `repr(Rust)` layout is **unspecified**; the compiler may reorder fields to reduce padding. Use `#[repr(C)]` for C-compatible layout, `#[repr(transparent)]` for a newtype with identical ABI, `#[repr(u8)]` for fieldless enum size, and `#[repr(packed)]` / `#[repr(align(N))]` for packing and alignment (taking references to packed fields is UB).

### Q115. Atomics and memory ordering *(Must-know)*
```rust
use std::sync::atomic::{AtomicUsize, Ordering};
static COUNTER: AtomicUsize = AtomicUsize::new(0);
COUNTER.fetch_add(1, Ordering::Relaxed);
```
- `Relaxed`: atomicity only, no ordering. Fine for counters.
- `Acquire` / `Release`: a release store "publishes" earlier writes to a thread that acquires the same location.
- `AcqRel`: for read-modify-write.
- `SeqCst`: single global order. Safest, slightly slower. Use it when unsure.
Prefer higher-level tools (`Mutex`, channels) unless you have measured a need.

### Q116. Lock-free and `crossbeam`
`crossbeam` provides scoped threads, `channel` (faster mpmc), `SegQueue`, epoch-based reclamation (`crossbeam-epoch`) and `CachePadded` to avoid false sharing. **Scoped threads** let threads borrow local data:
```rust
let mut data = vec![1, 2, 3];
std::thread::scope(|s| {
    s.spawn(|| println!("{:?}", data));        // borrows, no 'static needed
});
data.push(4);                                   // OK after scope
```
`std::thread::scope` is in the standard library since 1.63.

### Q117. Data parallelism with Rayon
```rust
use rayon::prelude::*;
let sum: u64 = (0..1_000_000u64).into_par_iter().map(|x| x * x).sum();
v.par_sort();
```
Work-stealing thread pool. Just change `iter()` to `par_iter()`. The borrow checker still guarantees no data races. Use for CPU-bound work, not for I/O.

### Q118. Procedural vs declarative macros *(Must-know)*
- **Declarative** (`macro_rules!`): pattern-matching on token trees.
- **Procedural**: Rust functions that transform token streams. Three kinds: derive (`#[derive(MyTrait)]`), attribute (`#[route(GET, "/")]`), function-like (`sql!(...)`). They live in a `proc-macro = true` crate and usually use `syn` and `quote`.
```rust
macro_rules! square {
    ($x:expr) => { $x * $x };
}
macro_rules! hashmap {
    ($($k:expr => $v:expr),* $(,)?) => {{
        let mut m = ::std::collections::HashMap::new();
        $( m.insert($k, $v); )*
        m
    }};
}
```
Macros are **hygienic** for local variables. Trade-offs: powerful, but harder to debug and slower to compile. Use `cargo expand` to see output.

### Q119. Error handling design for large systems
Libraries: a typed enum per crate with `thiserror`, preserve the `source()` chain, do not stringify. Applications: `anyhow`/`eyre` with context at boundaries. Map errors to HTTP status codes in one place (e.g. an `IntoResponse` impl). Distinguish **retryable** and **fatal** errors. Never swallow errors with `let _ =` unless intentional.

### Q120. Designing public APIs (API guidelines)
- Accept the most general input (`impl AsRef<str>`, `impl Into<String>`, `&[T]`), return concrete types.
- Implement common traits (`Debug`, `Clone`, `Default`, `PartialEq`, `Display`, `Error`).
- Use `#[non_exhaustive]` on public enums and structs to allow later growth.
- Use newtypes and builders. Mark important results `#[must_use]`.
- Follow semver; check with `cargo semver-checks`.
- Seal traits you do not want others to implement.

### Q121. The sealed trait pattern
```rust
mod private { pub trait Sealed {} }
pub trait Backend: private::Sealed { fn run(&self); }
impl private::Sealed for Local {}
impl Backend for Local { fn run(&self) {} }
```
External crates can use `Backend` but cannot implement it.

### Q122. Performance profiling and optimization workflow
1. Measure first (`cargo bench` with Criterion, `hyperfine` for CLIs).
2. Profile: `perf`, `flamegraph` (`cargo flamegraph`), `samply`, `heaptrack`, `dhat`, `tokio-console` for async.
3. Typical wins: avoid allocations (reuse buffers, `with_capacity`, `SmallVec`), avoid needless `clone`, use `&str`/`Cow`, better data layout (struct of arrays), `FxHash`/`ahash` for hashing, release profile with LTO, `target-cpu=native`, PGO.
4. Re-measure. Do not guess.

### Q123. Allocators
Default is the system allocator. Swap with `#[global_allocator]` for `mimalloc` or `jemalloc` (often a big win for multi-threaded servers, and avoids slow musl malloc). Arena allocators (`bumpalo`) give fast bulk allocation and free. Custom allocators for collections are still partly unstable.

### Q124. Cache-friendly design
Prefer `Vec<T>` over linked structures, contiguous memory, small types, and indices instead of pointers (arena + `usize` ids). Avoid false sharing with `CachePadded`. Use `Vec<u8>` / `bytes::Bytes` (cheap clone via ref-counting) for network buffers.

### Q125. Compile time management
Strategies: `cargo check` while coding, split into crates in a workspace, avoid heavy generics and proc macros in hot crates, trim features (`default-features = false`), `sccache`, the `mold`/`lld` linker, `cargo build --timings`, `cargo bloat`, `opt-level = 1` for dev dependencies.
```toml
[profile.dev.package."*"]
opt-level = 2
```

### Q126. Async deep dive: cancellation safety
Because dropping a future cancels it at an `.await`, work between awaits may be lost. `select!` branches that are not chosen are **dropped**. A future is **cancellation safe** if dropping it at any await loses no data. For example `mpsc::Receiver::recv` is cancel safe, but a `read_exact` into a partly filled buffer is not. Document it and use the cancel-safe variants in loops with `select!`.

### Q127. Async traits and dyn futures
Since 1.75 you can write `async fn` in traits for **static dispatch**. For `dyn Trait` you still need boxed futures: use the `async-trait` crate, or return `Pin<Box<dyn Future<Output = T> + Send + '_>>`.
```rust
trait Store { async fn get(&self, k: &str) -> Option<String>; }   // fine with generics
```
Note: `Send` bounds on the returned future are not expressible yet without workarounds (`trait_variant` crate).

### Q128. Streams
`Stream` is the async version of `Iterator` (`futures::Stream`, `tokio_stream`).
```rust
use futures::StreamExt;
let mut s = tokio_stream::iter(1..=3).map(|x| x * 2);
while let Some(v) = s.next().await { println!("{v}"); }
```
Use `buffer_unordered(n)` for bounded concurrency over many futures.

### Q129. Backpressure and bounded concurrency
```rust
let sem = Arc::new(tokio::sync::Semaphore::new(10));
for job in jobs {
    let permit = sem.clone().acquire_owned().await.unwrap();
    tokio::spawn(async move { run(job).await; drop(permit); });
}
```
Unbounded channels and unbounded spawns are how services run out of memory.

### Q130. Timeouts, retries, circuit breakers
`tokio::time::timeout(dur, fut).await` returns `Err(Elapsed)`. Combine with `tower` layers (`Timeout`, `RateLimit`, `ConcurrencyLimit`, `Retry`) and `backoff`/`tokio-retry` with jitter. Only retry **idempotent** operations.

### Q131. Interior mutability and `UnsafeCell`
`UnsafeCell<T>` is the only legal way to get `&mut T` from `&T`. `Cell`, `RefCell`, `Mutex`, atomics, `OnceCell` are all built on it. Without it, the compiler assumes data behind `&T` never changes.

### Q132. `OnceCell`, `OnceLock`, `LazyLock`, `lazy_static`
```rust
use std::sync::{OnceLock, LazyLock};
static CONFIG: OnceLock<Config> = OnceLock::new();
fn config() -> &'static Config { CONFIG.get_or_init(Config::load) }
static RE: LazyLock<regex::Regex> = LazyLock::new(|| regex::Regex::new(r"\d+").unwrap());  // 1.80
```
Prefer these over `lazy_static!` and `once_cell` crates on modern Rust. Avoid global mutable state when you can; pass dependencies explicitly.

### Q133. Dependency injection in Rust
No framework needed. Use traits + generics or `Arc<dyn Trait>` in app state, built in `main`. Generics give static dispatch and easy testing; trait objects reduce monomorphization and simplify type signatures.

### Q134. Observability for production
Structured logs (`tracing`), metrics (`metrics` crate with Prometheus exporter, or OpenTelemetry), distributed traces (`tracing-opentelemetry`), health and readiness endpoints, panic hooks that log with context (`std::panic::set_hook`), and `tokio-console` for runtime inspection.

### Q135. Security practices
Memory safety removes a large class of CVEs, but not logic bugs. Run `cargo audit` and `cargo deny`; minimize and review `unsafe`; review build scripts and proc macros in dependencies (they run code at build time); use `rustls` or `native-tls`; constant-time comparison (`subtle`) for secrets; zero secrets with `zeroize`; validate all input; enable `overflow-checks` in release for critical code; use `cargo vet` or `cargo crev` for supply-chain review.

### Q136. WebAssembly with Rust
```bash
rustup target add wasm32-unknown-unknown
wasm-pack build --target web
```
`wasm-bindgen` generates JS glue. Great for compute-heavy browser code, plugins and edge runtimes (WASI, Cloudflare Workers). Frontend frameworks: Yew, Leptos, Dioxus. Watch the size (`opt-level = "s"`, `wasm-opt`).

### Q137. Embedded and `no_std`
`#![no_std]` removes the standard library (keeps `core`; `alloc` is optional). Used for microcontrollers (`embedded-hal`, Embassy async runtime, RTIC) and kernels. No heap by default, so use `heapless` collections. A panic handler must be provided.

### Q138. Testing concurrent code
`loom` explores thread interleavings for small models, Miri finds UB, ThreadSanitizer (nightly) finds data races in unsafe code, and `tokio::time::pause()` makes time-based async tests deterministic.

### Q139. Rust vs C++ vs Go: comparison *(Must-know)*
| Aspect | Rust | C++ | Go |
|---|---|---|---|
| Memory | Ownership, no GC | Manual / RAII | GC |
| Safety | Compile-time guarantees | Programmer's duty | Memory-safe, data races possible |
| Speed | Near C | Near C | Fast, GC pauses |
| Learning curve | Steep | Steep | Gentle |
| Concurrency | Compile-checked, async | Threads, coroutines | Goroutines |
| Binary | Small to medium, static | Varies | Static, larger |
| Build time | Slow | Slow | Very fast |
Pick Rust when correctness, latency predictability, or footprint matter. Pick Go for fast delivery of network services.

### Q140. When NOT to use Rust
Quick prototypes, small scripts, UI-heavy apps with mature ecosystems elsewhere, teams without time to learn it, or projects where GC pauses are acceptable and speed of development dominates. Be honest about the learning cost and slower compile times.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q141. How would you introduce Rust into an existing team or codebase?
1. Start small: a CLI, a performance-critical library, or a sidecar, not a rewrite.
2. Use FFI/PyO3/napi-rs to replace hot paths inside existing services.
3. Train the team: pair programming, code review checklists, shared "Rust style guide" with Clippy rules.
4. Set CI gates: `fmt`, `clippy -D warnings`, `test`, `audit`, `deny`.
5. Measure the benefit (latency, memory, incidents) and report it.
Avoid a big-bang rewrite. It rarely finishes.

### Q142. Rewrite decision framework
Rewrite a component when: there is a proven performance or safety problem, the component has a clear boundary, tests exist to pin behavior, and the team can maintain it. Use the strangler pattern: route traffic gradually, compare outputs (shadow traffic), keep rollback.

### Q143. Designing a large Rust service architecture
Layered or hexagonal: `domain` crate (pure logic, no I/O), `application` (use cases, traits for ports), `infra` (DB, HTTP clients, queues), `api` (Axum handlers, DTOs). Dependencies point inward. Domain tests are fast and need no runtime. Use workspaces to enforce boundaries at the compiler level.

### Q144. Monolith vs microservices in Rust
Rust's compile times and strong module system make a **modular monolith** attractive: one deployable, enforced crate boundaries, easy to split later. Split when scaling, ownership, or release cadence demands it. Use gRPC (`tonic`) or REST with shared schema crates.

### Q145. Choosing between sync, async and threads
- CPU-bound: threads/Rayon.
- Many concurrent I/O waits (thousands of sockets): async.
- Few connections, simple logic: blocking threads are simpler and fine.
Do not use async just because it is popular. It adds complexity (cancellation, `Send` bounds, colored functions).

### Q146. Error and failure strategy at scale
Define a single error taxonomy: client errors (4xx), transient errors (retry), bugs (panic and alert). Use error codes and `source()` chains for diagnostics. Capture a backtrace on unexpected errors (`RUST_BACKTRACE`, `anyhow` backtrace). Alert on panic rate. Set `panic = "abort"` for services if a supervisor restarts them, but note it skips `Drop` cleanup.

### Q147. Versioning, MSRV, and release management
State the MSRV and test it in CI. Follow semver; use `cargo semver-checks`, changelogs, `cargo release`. Use `#[deprecated]` before removing. Publish internal crates to a private registry (Cargo alternate registries, Artifactory, Kellnr) and pin with a lockfile.

### Q148. Supply-chain and licensing governance
`cargo deny` for license allow-lists and banned crates, `cargo vet`/`crev` for audited dependencies, vendoring (`cargo vendor`) for air-gapped builds, reproducible builds with a pinned toolchain (`rust-toolchain.toml`) and `--locked`.
```toml
# rust-toolchain.toml
[toolchain]
channel = "1.84.0"
components = ["rustfmt", "clippy"]
```

### Q149. CI/CD pipeline for Rust
```yaml
- run: cargo fmt --check
- run: cargo clippy --all-targets --all-features -- -D warnings
- run: cargo test --all-features --locked
- run: cargo audit
- run: cargo deny check
```
Cache `~/.cargo` and `target` (`Swatinem/rust-cache`). Build release binaries per target, multi-stage Docker builds (`cargo-chef` for dependency layer caching), distroless or scratch final image.

### Q150. Docker and deployment
```dockerfile
FROM rust:1.84 AS build
WORKDIR /app
COPY . .
RUN cargo build --release --locked

FROM gcr.io/distroless/cc-debian12
COPY --from=build /app/target/release/app /app
ENTRYPOINT ["/app"]
```
Small images, non-root user, health checks, resource limits, graceful shutdown on SIGTERM.

### Q151. Mentoring juniors on the borrow checker
Teach the model, not the tricks: "who owns this, who borrows it, for how long?" Suggest: prefer owned data first and optimize later, use indices instead of references in graphs, clone deliberately in non-hot paths, read compiler errors fully (they are good), and avoid `Rc<RefCell<>>` everywhere (it hides design problems). Review for `clone()` abuse and `unwrap()` in production paths.

### Q152. Estimating Rust work
Add time for: learning curve, design of ownership boundaries, compile/CI times, and ecosystem gaps (some libraries are less mature than in Java or Python). Reduce risk with a spike and early performance tests.

### Q153. Evaluating a crate before adopting it
Check: maintenance (last release, issue response), downloads, number of maintainers, `unsafe` usage (`cargo geiger`), transitive deps, license, docs, MSRV, semver history, and test coverage. Prefer widely used crates for core concerns (`serde`, `tokio`, `tracing`, `clap`, `reqwest`).

### Q154. Technical debt in Rust codebases
Common debt: `unwrap()` everywhere, overuse of `clone()` and `Arc<Mutex<>>`, giant `lib.rs`, stringly-typed errors, feature-flag explosion, and missing docs. Address with lint rules (`clippy::unwrap_used`), refactors guided by types, and architecture reviews.

### Q155. How do you decide between `dyn Trait` and generics in a public API?
Generics: performance, zero-cost, but infects type signatures and grows compile time. `dyn`: simple signatures, plugin-style runtime choice, smaller binaries, an extra indirection. Often use generics internally and expose `dyn` at stable boundaries.

### Q156. Memory safety bug reality check
Rust prevents memory-safety bugs in safe code. It does not prevent logic errors, deadlocks, memory leaks (`Rc` cycles, `mem::forget`, `Box::leak` are safe), panics, integer overflow in release, or bugs inside `unsafe` and in C dependencies. Reviews must still cover these.

### Q157. Interview-style system design question: high-throughput ingestion service
Sketch: Axum/Tonic front, bounded `mpsc` per partition for backpressure, batch writer tasks, `Semaphore` for DB concurrency, `tokio::select!` with shutdown token, idempotency keys, a dead-letter queue, `tracing` + metrics, load tests, and `jemalloc`. Discuss failure modes: slow consumer, poison messages, retries storm, restarts.

### Q158. Incident story template (leadership round)
Describe: symptom, detection (alerts, logs), diagnosis (flamegraph, `tokio-console`, heap profile), root cause (e.g. blocking call in async handler, unbounded channel, lock held across `.await`), fix, and prevention (lint, test, runbook). Keep it factual and blameless.

---

# 💻 Part 6: Coding / Machine-Coding Tasks

### C1. Reverse a string (Unicode aware)
```rust
fn reverse(s: &str) -> String { s.chars().rev().collect() }
// Note: reverses code points, not grapheme clusters. Use `unicode-segmentation` for graphemes.
```

### C2. Check palindrome (ignore case and non-alphanumeric)
```rust
fn is_palindrome(s: &str) -> bool {
    let c: Vec<char> = s.chars().filter(|c| c.is_alphanumeric()).flat_map(|c| c.to_lowercase()).collect();
    c.iter().eq(c.iter().rev())
}
```

### C3. Fibonacci with an iterator
```rust
fn fib() -> impl Iterator<Item = u64> {
    let mut s = (0u64, 1u64);
    std::iter::from_fn(move || { let r = s.0; s = (s.1, s.0 + s.1); Some(r) })
}
let first10: Vec<u64> = fib().take(10).collect();
```

### C4. Word frequency count
```rust
use std::collections::HashMap;
fn freq(text: &str) -> HashMap<String, usize> {
    let mut m = HashMap::new();
    for w in text.split_whitespace() {
        *m.entry(w.to_lowercase()).or_insert(0) += 1;
    }
    m
}
```

### C5. Two Sum
```rust
fn two_sum(nums: &[i32], target: i32) -> Option<(usize, usize)> {
    let mut seen = std::collections::HashMap::new();
    for (i, &n) in nums.iter().enumerate() {
        if let Some(&j) = seen.get(&(target - n)) { return Some((j, i)); }
        seen.insert(n, i);
    }
    None
}
```

### C6. Binary search
```rust
fn bsearch(a: &[i32], t: i32) -> Option<usize> {
    let (mut lo, mut hi) = (0usize, a.len());
    while lo < hi {
        let mid = lo + (hi - lo) / 2;          // avoids overflow
        match a[mid].cmp(&t) {
            std::cmp::Ordering::Equal => return Some(mid),
            std::cmp::Ordering::Less => lo = mid + 1,
            std::cmp::Ordering::Greater => hi = mid,
        }
    }
    None
}
// std has a.binary_search(&t)
```

### C7. Generic stack
```rust
#[derive(Default)]
struct Stack<T> { items: Vec<T> }
impl<T> Stack<T> {
    fn new() -> Self { Self { items: Vec::new() } }
    fn push(&mut self, v: T) { self.items.push(v); }
    fn pop(&mut self) -> Option<T> { self.items.pop() }
    fn peek(&self) -> Option<&T> { self.items.last() }
    fn len(&self) -> usize { self.items.len() }
    fn is_empty(&self) -> bool { self.items.is_empty() }
}
```

### C8. Balanced brackets
```rust
fn balanced(s: &str) -> bool {
    let mut st = Vec::new();
    for c in s.chars() {
        match c {
            '(' | '[' | '{' => st.push(c),
            ')' => if st.pop() != Some('(') { return false },
            ']' => if st.pop() != Some('[') { return false },
            '}' => if st.pop() != Some('{') { return false },
            _ => {}
        }
    }
    st.is_empty()
}
```

### C9. Singly linked list: push, pop, reverse
```rust
struct Node<T> { val: T, next: Option<Box<Node<T>>> }
struct List<T> { head: Option<Box<Node<T>>> }
impl<T> List<T> {
    fn new() -> Self { List { head: None } }
    fn push(&mut self, val: T) {
        let n = Box::new(Node { val, next: self.head.take() });
        self.head = Some(n);
    }
    fn pop(&mut self) -> Option<T> {
        self.head.take().map(|n| { self.head = n.next; n.val })
    }
    fn reverse(&mut self) {
        let mut prev = None;
        let mut cur = self.head.take();
        while let Some(mut n) = cur {
            cur = n.next.take();
            n.next = prev;
            prev = Some(n);
        }
        self.head = prev;
    }
}
```
Deep lists can overflow the stack on automatic `Drop`. Implement `Drop` iteratively for long lists.

### C10. Binary tree insert and in-order traversal
```rust
#[derive(Debug)]
struct Tree { root: Option<Box<TNode>> }
#[derive(Debug)]
struct TNode { v: i32, l: Option<Box<TNode>>, r: Option<Box<TNode>> }
impl Tree {
    fn insert(&mut self, v: i32) {
        let mut cur = &mut self.root;
        while let Some(n) = cur {
            cur = if v < n.v { &mut n.l } else { &mut n.r };
        }
        *cur = Some(Box::new(TNode { v, l: None, r: None }));
    }
    fn inorder(&self) -> Vec<i32> {
        fn go(n: &Option<Box<TNode>>, out: &mut Vec<i32>) {
            if let Some(b) = n { go(&b.l, out); out.push(b.v); go(&b.r, out); }
        }
        let mut out = vec![]; go(&self.root, &mut out); out
    }
}
```

### C11. LRU cache (simple)
```rust
use std::collections::{HashMap, VecDeque};
struct Lru<K, V> { cap: usize, map: HashMap<K, V>, order: VecDeque<K> }
impl<K: std::hash::Hash + Eq + Clone, V> Lru<K, V> {
    fn new(cap: usize) -> Self { Self { cap, map: HashMap::new(), order: VecDeque::new() } }
    fn touch(&mut self, k: &K) {
        if let Some(p) = self.order.iter().position(|x| x == k) { self.order.remove(p); }
        self.order.push_back(k.clone());
    }
    fn get(&mut self, k: &K) -> Option<&V> {
        if self.map.contains_key(k) { self.touch(k); }
        self.map.get(k)
    }
    fn put(&mut self, k: K, v: V) {
        if !self.map.contains_key(&k) && self.map.len() == self.cap {
            if let Some(old) = self.order.pop_front() { self.map.remove(&old); }
        }
        self.touch(&k);
        self.map.insert(k, v);
    }
}
```
`touch` is O(n). For O(1), use a doubly linked list with indices (or the `lru` crate).

### C12. Thread-safe counter with threads
```rust
use std::sync::{Arc, atomic::{AtomicU64, Ordering}};
let c = Arc::new(AtomicU64::new(0));
let hs: Vec<_> = (0..8).map(|_| { let c = c.clone(); std::thread::spawn(move || {
    for _ in 0..1000 { c.fetch_add(1, Ordering::Relaxed); }
})}).collect();
for h in hs { h.join().unwrap(); }
assert_eq!(c.load(Ordering::SeqCst), 8000);
```

### C13. Worker pool with channels
```rust
use std::sync::{mpsc, Arc, Mutex};
use std::thread;

type Job = Box<dyn FnOnce() + Send + 'static>;
struct Pool { tx: Option<mpsc::Sender<Job>>, workers: Vec<thread::JoinHandle<()>> }
impl Pool {
    fn new(n: usize) -> Self {
        let (tx, rx) = mpsc::channel::<Job>();
        let rx = Arc::new(Mutex::new(rx));
        let workers = (0..n).map(|_| {
            let rx = Arc::clone(&rx);
            thread::spawn(move || loop {
                let job = rx.lock().unwrap().recv();
                match job { Ok(j) => j(), Err(_) => break }   // channel closed
            })
        }).collect();
        Pool { tx: Some(tx), workers }
    }
    fn run<F: FnOnce() + Send + 'static>(&self, f: F) { self.tx.as_ref().unwrap().send(Box::new(f)).unwrap(); }
}
impl Drop for Pool {
    fn drop(&mut self) {
        drop(self.tx.take());                       // close channel
        for w in self.workers.drain(..) { w.join().unwrap(); }
    }
}
```

### C14. Async: fetch many URLs with bounded concurrency
```rust
use futures::{stream, StreamExt};
async fn fetch_all(urls: Vec<String>) -> Vec<Result<String, reqwest::Error>> {
    let client = reqwest::Client::new();
    stream::iter(urls)
        .map(|u| { let c = client.clone(); async move { c.get(&u).send().await?.text().await } })
        .buffer_unordered(8)           // at most 8 in flight
        .collect()
        .await
}
```

### C15. Async: timeout and retry with backoff
```rust
use std::time::Duration;
async fn with_retry<F, Fut, T, E>(mut f: F, tries: u32) -> Result<T, E>
where F: FnMut() -> Fut, Fut: std::future::Future<Output = Result<T, E>> {
    let mut delay = Duration::from_millis(100);
    for attempt in 1..=tries {
        match tokio::time::timeout(Duration::from_secs(2), f()).await {
            Ok(Ok(v)) => return Ok(v),
            Ok(Err(e)) if attempt == tries => return Err(e),
            Err(_) if attempt == tries => panic!("timed out"),   // simplify: map to your error type
            _ => { tokio::time::sleep(delay).await; delay *= 2; }
        }
    }
    unreachable!()
}
```

### C16. Simple REST CRUD in Axum with in-memory state
```rust
use axum::{routing::{get, post}, Router, Json, extract::{Path, State}, http::StatusCode};
use std::{collections::HashMap, sync::{Arc, RwLock}};
use serde::{Serialize, Deserialize};

#[derive(Clone, Serialize, Deserialize)]
struct Todo { id: u32, title: String, done: bool }
type Db = Arc<RwLock<HashMap<u32, Todo>>>;

async fn list(State(db): State<Db>) -> Json<Vec<Todo>> {
    Json(db.read().unwrap().values().cloned().collect())
}
async fn create(State(db): State<Db>, Json(t): Json<Todo>) -> (StatusCode, Json<Todo>) {
    db.write().unwrap().insert(t.id, t.clone());
    (StatusCode::CREATED, Json(t))
}
async fn get_one(State(db): State<Db>, Path(id): Path<u32>) -> Result<Json<Todo>, StatusCode> {
    db.read().unwrap().get(&id).cloned().map(Json).ok_or(StatusCode::NOT_FOUND)
}
fn app() -> Router {
    let db: Db = Default::default();
    Router::new().route("/todos", get(list).post(create)).route("/todos/:id", get(get_one)).with_state(db)
}
```
Note the `std` `RwLock` guards are dropped before any `.await` (there is none here), so it is safe.

### C17. Parse a CSV line manually with error handling
```rust
#[derive(Debug)]
struct Row { name: String, age: u32 }
fn parse(line: &str) -> Result<Row, String> {
    let mut p = line.split(',');
    let name = p.next().ok_or("no name")?.trim().to_string();
    let age = p.next().ok_or("no age")?.trim().parse::<u32>().map_err(|e| e.to_string())?;
    Ok(Row { name, age })
}
```

### C18. Implement a trait with generics: simple event bus
```rust
use std::collections::HashMap;
type Handler = Box<dyn Fn(&str) + Send + Sync>;
#[derive(Default)]
struct Bus { subs: HashMap<String, Vec<Handler>> }
impl Bus {
    fn on(&mut self, topic: &str, h: impl Fn(&str) + Send + Sync + 'static) {
        self.subs.entry(topic.to_string()).or_default().push(Box::new(h));
    }
    fn emit(&self, topic: &str, msg: &str) {
        if let Some(hs) = self.subs.get(topic) { for h in hs { h(msg); } }
    }
}
```

### C19. Merge two sorted vectors
```rust
fn merge(a: &[i32], b: &[i32]) -> Vec<i32> {
    let (mut i, mut j) = (0, 0);
    let mut out = Vec::with_capacity(a.len() + b.len());
    while i < a.len() && j < b.len() {
        if a[i] <= b[j] { out.push(a[i]); i += 1 } else { out.push(b[j]); j += 1 }
    }
    out.extend_from_slice(&a[i..]);
    out.extend_from_slice(&b[j..]);
    out
}
```

### C20. Dijkstra with `BinaryHeap`
```rust
use std::{cmp::Reverse, collections::BinaryHeap};
fn dijkstra(adj: &Vec<Vec<(usize, u64)>>, src: usize) -> Vec<u64> {
    let mut dist = vec![u64::MAX; adj.len()];
    let mut h = BinaryHeap::new();
    dist[src] = 0; h.push(Reverse((0u64, src)));
    while let Some(Reverse((d, u))) = h.pop() {
        if d > dist[u] { continue; }
        for &(v, w) in &adj[u] {
            let nd = d + w;
            if nd < dist[v] { dist[v] = nd; h.push(Reverse((nd, v))); }
        }
    }
    dist
}
```

### C21. Rate limiter (token bucket)
```rust
use std::time::Instant;
struct Bucket { cap: f64, tokens: f64, rate: f64, last: Instant }
impl Bucket {
    fn new(cap: f64, rate: f64) -> Self { Self { cap, tokens: cap, rate, last: Instant::now() } }
    fn allow(&mut self) -> bool {
        let now = Instant::now();
        self.tokens = (self.tokens + now.duration_since(self.last).as_secs_f64() * self.rate).min(self.cap);
        self.last = now;
        if self.tokens >= 1.0 { self.tokens -= 1.0; true } else { false }
    }
}
```

### C22. Custom `Iterator` adapter
```rust
struct Pairs<I: Iterator> { it: I }
impl<I: Iterator> Iterator for Pairs<I> {
    type Item = (I::Item, I::Item);
    fn next(&mut self) -> Option<Self::Item> { Some((self.it.next()?, self.it.next()?)) }
}
trait PairsExt: Iterator + Sized { fn pairs(self) -> Pairs<Self> { Pairs { it: self } } }
impl<I: Iterator> PairsExt for I {}
// (1..=6).pairs() -> (1,2) (3,4) (5,6)
```

### C23. Macro: `maxm!`
```rust
macro_rules! maxm {
    ($x:expr) => ($x);
    ($x:expr, $($rest:expr),+) => {{ let a = $x; let b = maxm!($($rest),+); if a > b { a } else { b } }};
}
assert_eq!(maxm!(3, 9, 4), 9);
```

### C24. Graceful shutdown on Ctrl+C with Tokio
```rust
#[tokio::main]
async fn main() {
    let (tx, mut rx) = tokio::sync::watch::channel(false);
    let worker = tokio::spawn(async move {
        loop {
            tokio::select! {
                _ = rx.changed() => break,
                _ = tokio::time::sleep(std::time::Duration::from_secs(1)) => println!("working"),
            }
        }
    });
    tokio::signal::ctrl_c().await.unwrap();
    tx.send(true).unwrap();
    worker.await.unwrap();
}
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. `borrow of moved value`
```rust
let names = vec![String::from("a")];
for n in names { println!("{n}"); }
println!("{}", names.len());   // error: names moved into the loop
```
**Fix:** iterate by reference `for n in &names`, or clone before.

### D2. Cannot borrow as mutable while borrowed
```rust
let mut v = vec![1, 2, 3];
for x in &v { if *x == 2 { v.push(4); } }   // error
```
**Fix:** collect changes first, then apply; or iterate by index; or use `retain` / `extend`. Mutating a collection while iterating it is also a bug in other languages.

### D3. Returned reference to local
```rust
fn bad() -> &String { let s = String::new(); &s }   // error: missing lifetime / dangling
```
**Fix:** return the owned `String`.

### D4. Deadlock with two mutexes
Thread A locks `a` then `b`. Thread B locks `b` then `a`. **Fix:** a consistent lock order, or one lock around both, or message passing. Use `try_lock` with timeouts, or `parking_lot` deadlock detection in debug.

### D5. Lock held across `.await`
```rust
let g = state.lock().unwrap();
do_io().await;                     // error: future is not Send (std MutexGuard)
```
**Fix:** copy what you need, drop the guard (`drop(g)` or a scope block), then await. Use `tokio::sync::Mutex` only if the lock must span the await.

### D6. Async task hangs forever
Common causes: forgot `.await`, blocking call in an async worker, a channel `Sender` never dropped so `recv()` never returns `None`, or a manual `Future` returned `Pending` without waking. **Debug:** `tokio-console`, `RUST_LOG=trace`, timeouts around suspects.

### D7. Silent future never runs
```rust
async fn save() { /* ... */ }
fn main() { save(); }              // warning: unused future, nothing happens
```
**Fix:** `.await` inside a runtime, or `tokio::spawn`. The `#[must_use]` warning is your hint.

### D8. Panic: `index out of bounds` or `unwrap on None`
Read the message and the location, run with `RUST_BACKTRACE=1` (or `full`). **Fix:** use `.get()`, `?`, or handle `None` explicitly. Add the case to tests.

### D9. Memory keeps growing (leak)
Suspects: `Rc`/`Arc` cycles (use `Weak`), unbounded channels or caches, spawned tasks never finishing, `Box::leak`/`mem::forget`, large `Vec` with high capacity. **Tools:** `heaptrack`, `dhat`, `jemalloc` profiling, `tokio-console` for stuck tasks.

### D10. Stack overflow
Deep recursion (large tree, long linked list `Drop`) or huge arrays on the stack. **Fix:** iterative algorithm, explicit stack `Vec`, `Box` big arrays, `Vec` instead of `[T; N]`, or run in a thread with a bigger stack (`thread::Builder::stack_size`).

### D11. Trait bound not satisfied for a type in `spawn`
```
error: `Rc<...>` cannot be sent between threads safely
```
**Fix:** use `Arc`, or avoid sharing. The message names the offending type and the reason (`Send`).

### D12. Mismatched types in `if`/`match` arms
Arms must have the same type. A missing `;` or extra `;` changes `()` vs value. `impl Trait` returns can only be one type; use `Box<dyn Trait>` or an enum to return different types.

### D13. Slow release build or giant binary
Check `cargo bloat`, `cargo build --timings`. Reduce generics, features and proc-macro heavy deps; enable `lto`, `codegen-units = 1`, `strip`, `panic = "abort"`.

### D14. Test passes locally but fails in CI
Common: test order or shared global state (tests run in parallel by default; use `-- --test-threads=1` to confirm), time or locale assumptions, file paths, missing env vars, different feature flags (`--all-features`), floating-point differences.

### D15. Wrong HashMap iteration order assumed
Output differs run to run because the hasher is randomized. **Fix:** sort keys, use `BTreeMap`, or `IndexMap` for insertion order.

---

# 🧩 Part 8: Tricky Questions

### T1. Does `let _ = value;` drop the value immediately?
`let _ = expr;` drops a **temporary** value at the end of the statement because `_` does not bind. `let _x = expr;` keeps it until end of scope. This matters for lock guards: `let _ = mutex.lock();` releases the lock at once; `let _g = mutex.lock();` holds it.

### T2. Is `Rc` cycle a memory-safety bug?
No. Leaks are considered **safe** in Rust (`mem::forget` is a safe function). Memory safety means no use-after-free or data races, not "no leaks".

### T3. Why can two `&mut` not coexist, even in single-threaded code?
Aliasing plus mutation causes bugs even without threads (iterator invalidation, a reference seeing partly updated data). The compiler also uses the no-alias guarantee for optimization (`noalias`).

### T4. What is the size of `()`, `Option<Box<i32>>`, `[u8; 0]`?
`()` is 0 bytes. `Option<Box<i32>>` is 8 bytes on 64-bit (niche). `[u8; 0]` is 0 bytes. Zero-sized types (ZSTs) cost nothing and are used as markers.

### T5. Difference between `iter().map()` and `for` with side effects?
Iterators are lazy. `v.iter().map(|x| println!("{x}"));` prints nothing because it is never consumed (compiler warns `unused`). Use `for_each` or a `for` loop for side effects.

### T6. `String::from("a") + &String::from("b")` — why does `+` take `String` by value on the left?
`impl Add<&str> for String` consumes the left side to reuse its buffer. The right side is `&str` (deref coercion from `&String`). Use `format!` to keep both.

### T7. Can a `Drop` type be `Copy`?
No. `Copy` and `Drop` cannot be implemented together, because a bitwise copy would cause a double drop.

### T8. Why does `Vec<T>` need `T: Clone` for `vec![x; n]`?
It clones `x` for each slot. For non-`Clone` types use `std::iter::repeat_with(|| make()).take(n).collect()`.

### T9. Why does `thread::spawn` need `'static` but `thread::scope` does not?
A spawned thread can outlive the function that created it, so it cannot borrow locals. `scope` guarantees all threads are joined before it returns, so borrowing is safe.

### T10. What happens if a panic occurs in a `Drop` during unwinding?
A panic while already panicking **aborts** the process. Avoid panicking in `Drop`.

### T11. Is `unsafe` code "unchecked"?
Only the five unsafe superpowers are unchecked. Type checking, borrow checking for normal references, and bounds checks on safe indexing all still apply.

### T12. `&'a mut T` is invariant. Why does it matter?
If `&mut &'long str` could be treated as `&mut &'short str`, you could store a short-lived reference into a long-lived slot and create a dangling pointer. Invariance blocks this.

### T13. Does Rust have a garbage collector or a runtime?
No GC. There is a tiny runtime (stack setup, panic handling) but nothing like a VM. Async needs a library-provided executor.

### T14. Closures that capture by `move` — do they always `FnOnce`?
No. `move` only controls **how** variables are captured. Whether the closure is `Fn`, `FnMut` or `FnOnce` depends on what the body **does** with them.

### T15. What does `'_` mean?
The anonymous (elided) lifetime: `impl fmt::Display for Foo<'_>`, `Ref<'_, T>`. It says "some lifetime, let the compiler infer it".

### T16. `dbg!` vs `println!`
`dbg!(expr)` prints file, line, expression and value to **stderr**, and returns the value (moves it). It is removed from nothing automatically in release builds. Remove it before commit.

### T17. Why is there no `null`, no exceptions, no inheritance?
Design choices: `Option` forces handling absence; `Result` makes failure visible in types; composition and traits replace inheritance (no data inheritance, no implicit upcasting).

### T18. Two traits with the same method name on one type. How to call a specific one?
Fully qualified syntax: `<Type as Trait>::method(&value)` or `Trait::method(&value)`.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- **Rust's memory model?** Ownership, borrowing, lifetimes. No GC.
- **Default mutability?** Immutable.
- **Default integer / float?** `i32` / `f64`.
- **Copy vs Clone?** Copy is implicit and cheap; Clone is explicit and may be expensive.
- **Which type for null?** `Option<T>`.
- **`?` operator does what?** Returns early on `Err`/`None`, converting error via `From`.
- **`unwrap` risk?** Panics on `None`/`Err`.
- **Slice type?** `&[T]`; string slice `&str`.
- **Heap pointer?** `Box<T>`.
- **Shared ownership single thread / multi thread?** `Rc<T>` / `Arc<T>`.
- **Thread-safe mutation?** `Arc<Mutex<T>>`, `RwLock`, atomics.
- **What makes a type thread-safe?** `Send` and `Sync` markers.
- **Static dispatch?** Generics / `impl Trait`. **Dynamic?** `dyn Trait`.
- **Trait object requirement?** Object-safe trait.
- **Lifetime syntax?** `'a`.
- **Longest lifetime?** `'static`.
- **Package manager?** Cargo; registry crates.io.
- **Format code / lint?** `cargo fmt` / `cargo clippy`.
- **Fast type-check?** `cargo check`.
- **Tests run with?** `cargo test`.
- **Benchmarks?** Criterion (`cargo bench`).
- **Async runtime in std?** None. Use Tokio, async-std, smol.
- **Serialization crate?** Serde.
- **Web frameworks?** Axum, Actix Web, Rocket, Warp.
- **Error crates?** `thiserror` (libs), `anyhow` (apps).
- **Parallel iterators?** Rayon.
- **CLI parsing?** `clap`.
- **Wasm tool?** `wasm-pack`, `wasm-bindgen`.
- **Detect UB?** Miri.
- **`unsafe` powers count?** Five.
- **Macro kinds?** Declarative and procedural (derive, attribute, function-like).
- **`mem::swap` / `take` / `replace`?** Move values out of `&mut` safely.
- **Entry API?** `map.entry(k).or_insert(v)`.
- **Order of Drop?** Locals reverse; fields declaration order.
- **Integer overflow?** Panics in debug, wraps in release (default).
- **Strings are?** UTF-8.
- **Editions?** 2015, 2018, 2021, 2024.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about a Rust project you built.
Use STAR. Example: "I built an async REST API for a task manager with Axum, SQLx and PostgreSQL. I designed the domain layer as a separate crate, used `thiserror` for typed errors, `tracing` for logs, and added integration tests with `testcontainers`. The service handled X requests per second on a small instance, with p99 under Y ms." Replace with real numbers.

### P2. What was the hardest Rust concept for you and how did you learn it?
Be honest: ownership and lifetimes, then async `Send` errors. Explain how you learned: reading compiler errors, the Rust book, Rustlings, building small projects, and reading well-known crates. Show that you now explain it to others.

### P3. Describe a bug you fixed that Rust's type system could have prevented (or did prevent).
Example: a data race attempt rejected at compile time because `Rc` is not `Send`, so you switched to `Arc<Mutex<>>`. Or a `match` made non-exhaustive after adding an enum variant, and the compiler showed every place to update.

### P4. How do you handle performance problems?
Measure first with benchmarks and flamegraphs, find the hotspot, fix allocation or algorithm, re-measure, and add a benchmark to CI to prevent regressions.

### P5. Why Rust instead of Go, Java or Python for this project?
Tie it to requirements: latency predictability, memory footprint, safety-critical logic, one binary, or reuse in WebAssembly. Acknowledge the cost: learning curve and compile time.

### P6. How do you review Rust code?
Check: ownership clarity, needless `clone`, `unwrap`/`expect` in production paths, error context, lock scope and `.await` points, `unsafe` justification with `SAFETY` comments, public API design, tests, docs, and Clippy results.

### P7. How do you onboard a teammate to Rust?
Pair on a small real task, Rust book chapters on ownership, Rustlings exercises, a lint config in CI, and a "common compile errors" cheat sheet. Encourage owned data first, optimize later.

### P8. Tell me about a production incident.
Use the template from Q158: symptom, detection, root cause, fix, prevention, lesson. Example: unbounded channel caused memory growth under a slow consumer; fix was a bounded channel plus load shedding and an alert on queue depth.

### P9. How do you stay current with Rust?
This Week in Rust newsletter, the release blog every six weeks, RFC repository, `r/rust`, conference talks (RustConf, RustNation), and reading source of crates you use.

### P10. Where do you see Rust weaknesses?
Compile times, steep learning curve, async ecosystem complexity (colored functions, `Pin`, cancellation), smaller hiring pool, and fewer mature libraries in some domains (GUI, ML). Show balanced judgment.

---

# 📚 Part 11: Complete Coverage (Language + Standard Library + Tooling + Mixed)

## Language
- **Basics:** variables, shadowing, `const`/`static`, scalar and compound types, expressions vs statements, control flow, labels, ranges.
- **Ownership:** move, copy, clone, drop, borrowing, `&` / `&mut`, NLL, slices, lifetimes, elision, `'static`.
- **Types:** structs, tuple structs, unit structs, enums, `Option`, `Result`, type aliases, newtypes, unions, `!` (never type).
- **Patterns:** `match`, `if let`, `while let`, `let else`, guards, bindings, slice patterns, `ref`.
- **Traits and generics:** traits, default methods, supertraits, blanket impls, associated types and consts, GATs, const generics, `impl Trait`, `dyn Trait`, object safety, HRTB, `?Sized`, orphan rule, coherence.
- **Closures and iterators:** `Fn`/`FnMut`/`FnOnce`, move closures, iterator adapters and consumers, `IntoIterator`, `DoubleEndedIterator`, `ExactSizeIterator`, `Peekable`.
- **Error handling:** `Result`, `Option`, `?`, `From`, `Box<dyn Error>`, panic, `catch_unwind`.
- **Memory:** stack, heap, `Box`, `Rc`, `Arc`, `Weak`, `Cell`, `RefCell`, `Cow`, `Pin`, `ManuallyDrop`, `MaybeUninit`, layout and `repr`.
- **Concurrency:** threads, scoped threads, channels, `Mutex`, `RwLock`, `Condvar`, `Barrier`, atomics, `Send`/`Sync`, Rayon, async/await.
- **Unsafe and FFI:** raw pointers, `unsafe fn`, `unsafe trait`, `extern "C"`, `repr(C)`, `bindgen`.
- **Macros:** `macro_rules!`, derive, attribute and function-like proc macros.
- **Modules:** `mod`, `use`, `pub(crate)`, re-exports (`pub use`), prelude, paths (`crate::`, `super::`, `self::`).

## Standard library
`std::collections` (`Vec`, `VecDeque`, `HashMap`, `HashSet`, `BTreeMap`, `BTreeSet`, `BinaryHeap`, `LinkedList`), `std::fmt`, `std::io` (`Read`, `Write`, `BufReader`, `BufWriter`), `std::fs`, `std::path`, `std::env`, `std::process`, `std::time` (`Instant`, `Duration`, `SystemTime`), `std::thread`, `std::sync`, `std::net`, `std::str`, `std::string`, `std::num`, `std::ops`, `std::cmp`, `std::convert`, `std::iter`, `std::mem`, `std::ptr`, `std::any`, `std::error`, `std::hash`.

## Tooling and ecosystem
`rustup`, Cargo, `rustfmt`, Clippy, `rust-analyzer`, `cargo-expand`, `cargo-watch`, `cargo-nextest`, `cargo-audit`, `cargo-deny`, Miri, Criterion, `flamegraph`, `tokio-console`, `bindgen`, `wasm-pack`, `cross`, `cargo-chef`, `sccache`.
Popular crates: `serde`, `tokio`, `axum`, `actix-web`, `reqwest`, `hyper`, `tonic`, `sqlx`, `diesel`, `sea-orm`, `clap`, `tracing`, `anyhow`, `thiserror`, `rayon`, `crossbeam`, `regex`, `chrono`/`time`, `uuid`, `rand`, `bytes`, `itertools`, `once_cell`, `parking_lot`.

## Mixed topics
- Rust + Python: PyO3 and `maturin` for fast extensions.
- Rust + Node: `napi-rs`, Neon.
- Rust + browser: WASM with Yew/Leptos/Dioxus.
- Rust + mobile: shared core via UniFFI for Kotlin/Swift.
- Rust + data: Polars (DataFrames), Arrow, DataFusion.
- Rust + desktop: Tauri (web UI, Rust backend), egui, iced.
- Rust + games: Bevy (ECS).
- Rust + blockchain: Solana programs, Substrate.
- Rust + databases: TiKV, SurrealDB, Qdrant (vector DB) are written in Rust.

---

# 🔬 Part 12: Rust Compiler and Runtime Internals

### I1. Compilation pipeline
Source → tokens → AST → **HIR** (desugared, name resolution, type checking) → **MIR** (control-flow graph; borrow checking and many optimizations happen here) → **LLVM IR** → machine code. Monomorphization happens when going from MIR to LLVM IR. `cargo rustc -- --emit=mir,llvm-ir` lets you inspect output.

### I2. How the borrow checker works (high level)
It works on MIR using **Polonius-style / NLL** region inference: each reference has a set of points in the control-flow graph where it is live. Loans (borrows) are tracked, and an error is reported when an access conflicts with a live loan. Polonius is a more precise future algorithm.

### I3. Trait objects and vtables
A `&dyn Trait` is a fat pointer: `(data_ptr, vtable_ptr)`. The vtable holds `drop_in_place`, `size`, `align`, and method pointers. A call becomes an indirect call through the table. No inlining across it, unless devirtualized by LLVM.

### I4. Monomorphization
`fn id<T>(x: T)` called with `i32` and `String` generates `id::<i32>` and `id::<String>`. Pros: inlining and optimization per type. Cons: compile time and binary size.

### I5. Drop elaboration and drop flags
The compiler inserts `drop` calls at scope end. For values that are only conditionally moved, it keeps runtime **drop flags** so it knows whether to drop. Partial moves out of structs are tracked per field.

### I6. Async state machines
Each `async fn` becomes a generated enum (state machine) whose variants hold the locals alive across each `.await`. The future size is the max of its states, which is why very deep or large awaited futures can be big and why recursion in async needs `Box::pin`.

### I7. Panic and unwinding
By default a panic unwinds the stack running `Drop` for each frame, then the thread ends (or `join` returns `Err`). With `panic = "abort"` the process aborts immediately. `catch_unwind` can stop unwinding, mostly for FFI and thread pools. Types must be `UnwindSafe` to cross it without ceremony.

### I8. Name mangling and symbols
Rust mangles symbols (`_ZN...` legacy or v0 scheme). Use `#[no_mangle]` for stable C symbols. Rust has no stable ABI: only `extern "C"` is stable across compiler versions.

### I9. `Vec<T>` internals
`Vec` is `(ptr, cap, len)`. It grows geometrically (typically doubling), so `push` is amortized O(1). `with_capacity` avoids reallocation. `shrink_to_fit` releases extra capacity. Dropping runs element destructors, then frees the buffer.

### I10. `HashMap` internals
Since 1.36, the standard `HashMap` uses **hashbrown**, a SwissTable design: open addressing with SIMD group probing of control bytes. Default hasher: SipHash-1-3 with random keys. Swap in `ahash` / `FxHash` for speed where DoS resistance is not needed.

### I11. `String` internals
A `String` is a `Vec<u8>` guaranteed to be valid UTF-8. Constructing one from bytes validates (`String::from_utf8`) unless you use `unsafe from_utf8_unchecked`.

### I12. Atomics and the memory model
Rust uses the C++20 memory model. The compiler and CPU may reorder operations unless ordering constraints prevent it. `Mutex` lock/unlock provide acquire/release semantics.

### I13. Const evaluation
`const fn` can run at compile time (limited features; growing each release). `const` items and array lengths are evaluated by the compiler's const evaluator (CTFE). `static` initializers must be const-evaluable.

### I14. Linking and binary size
Rust statically links Rust code by default. `std` is linked statically, system libc dynamically on Linux gnu targets. Reduce size: `opt-level = "z"`, `lto`, `strip`, `panic = "abort"`, avoid `format!` heavy paths and large generic instantiations, use `cargo bloat`.

---

# 📊 Part 13: Reference Tables

### Ownership at a glance
| Operation | Effect on source | Cost |
|---|---|---|
| `let b = a;` (non-Copy) | `a` moved | pointer copy |
| `let b = a;` (Copy) | `a` still valid | bitwise copy |
| `let b = a.clone();` | `a` still valid | may allocate |
| `let b = &a;` | `a` borrowed (shared) | none |
| `let b = &mut a;` | `a` borrowed (exclusive) | none |

### Smart pointers
| Type | Owners | Threads | Mutation | Check |
|---|---|---|---|---|
| `Box<T>` | 1 | yes if `T: Send` | via owner | compile |
| `Rc<T>` | many | no | no (use `RefCell`) | compile |
| `Arc<T>` | many | yes | no (use `Mutex`) | compile |
| `RefCell<T>` | 1 | no (`!Sync`) | yes | runtime (panics) |
| `Mutex<T>` | 1 (shared via `Arc`) | yes | yes | runtime (blocks) |
| `Cell<T>` | 1 | no | yes (`Copy` get/set) | none needed |

### Collections
| Type | Order | Lookup | Insert | Use when |
|---|---|---|---|---|
| `Vec<T>` | insertion | O(1) by index | O(1) amortized push | default sequence |
| `VecDeque<T>` | insertion | O(1) | O(1) both ends | queue |
| `HashMap<K,V>` | random | O(1) avg | O(1) avg | fast key lookup |
| `BTreeMap<K,V>` | sorted | O(log n) | O(log n) | sorted, range queries |
| `HashSet<T>` | random | O(1) avg | O(1) avg | uniqueness |
| `BinaryHeap<T>` | max-heap | O(1) peek | O(log n) | priority queue |

### Closure traits
| Trait | Can call | Captured data use |
|---|---|---|
| `Fn` | many times, shared | read only |
| `FnMut` | many times, exclusive | mutate |
| `FnOnce` | once | consume |

### Error crates
| Need | Use |
|---|---|
| Library with matchable errors | `thiserror` |
| App with context | `anyhow` / `eyre` |
| Pretty reports | `miette`, `color-eyre` |

### Dispatch
| | Generics / `impl Trait` | `dyn Trait` |
|---|---|---|
| Dispatch | static | dynamic (vtable) |
| Inlining | yes | rarely |
| Binary size | larger | smaller |
| Heterogeneous collection | no | yes |

### Atomic orderings
| Ordering | Guarantee |
|---|---|
| `Relaxed` | atomicity only |
| `Acquire` (load) | later ops not moved before |
| `Release` (store) | earlier ops not moved after |
| `AcqRel` | both, for RMW |
| `SeqCst` | single total order |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
```rust
let s1 = String::from("hi");
let s2 = s1.clone();
println!("{s1} {s2}");
```
**Output:** `hi hi`. Both are valid because of the `clone`.

### O2.
```rust
let x = 5;
let x = x + 1;
{
    let x = x * 2;
    println!("{x}");
}
println!("{x}");
```
**Output:** `12` then `6`. The inner `x` shadows only inside the block.

### O3.
```rust
let v = vec![1, 2, 3];
let doubled: Vec<i32> = v.iter().map(|x| x * 2).collect();
println!("{:?} {:?}", v, doubled);
```
**Output:** `[1, 2, 3] [2, 4, 6]`. `iter()` borrows, so `v` is still usable.

### O4.
```rust
let v = vec![1, 2, 3];
let it = v.iter().map(|x| { println!("map {x}"); x + 1 });
println!("done");
```
**Output:** `done` only. The iterator is lazy and never consumed.

### O5.
```rust
struct D(&'static str);
impl Drop for D { fn drop(&mut self) { println!("drop {}", self.0); } }
fn main() {
    let _a = D("a");
    let _b = D("b");
    println!("end");
}
```
**Output:**
```
end
drop b
drop a
```
Locals drop in reverse order.

### O6.
```rust
struct D(&'static str);
impl Drop for D { fn drop(&mut self) { println!("drop {}", self.0); } }
fn main() {
    let _ = D("x");
    println!("after");
}
```
**Output:**
```
drop x
after
```
`_` does not bind, so the temporary drops immediately.

### O7.
```rust
let a: u8 = 255;
println!("{}", a.wrapping_add(1));
println!("{:?}", a.checked_add(1));
println!("{}", a.saturating_add(1));
```
**Output:** `0`, `None`, `255`.

### O8.
```rust
let s = "héllo";
println!("{} {}", s.len(), s.chars().count());
```
**Output:** `6 5`. `é` uses 2 bytes in UTF-8.

### O9.
```rust
let x: Option<i32> = Some(5);
println!("{:?}", x.map(|v| v * 2).filter(|v| *v > 20));
```
**Output:** `None`. `10` fails the filter.

### O10.
```rust
let mut v = vec![1, 2, 3];
let first = &v[0];
v.push(4);
println!("{first}");
```
**Result:** compile error. `first` is used after `v.push` mutably borrows `v`. If the `println!` line is removed, it compiles thanks to NLL.

### O11.
```rust
fn main() {
    let r;
    {
        let x = 5;
        r = &x;
    }
    println!("{r}");
}
```
**Result:** compile error: `x` does not live long enough.

### O12.
```rust
let t = (1, "a", 2.5);
let (a, b, c) = t;
println!("{a} {b} {c}");
```
**Output:** `1 a 2.5`.

### O13.
```rust
let n = 7;
let kind = match n {
    1..=5 => "low",
    6 | 7 => "mid",
    _ => "high",
};
println!("{kind}");
```
**Output:** `mid`.

### O14.
```rust
use std::rc::Rc;
let a = Rc::new(5);
let b = Rc::clone(&a);
println!("{}", Rc::strong_count(&a));
drop(b);
println!("{}", Rc::strong_count(&a));
```
**Output:** `2` then `1`.

### O15.
```rust
let words = vec!["a", "bb", "ccc"];
let total: usize = words.iter().map(|w| w.len()).sum();
println!("{total}");
```
**Output:** `6`.

### O16.
```rust
println!("{}", i32::MAX.wrapping_add(1) == i32::MIN);
```
**Output:** `true`.

### O17.
```rust
let s = String::from("abc");
let t = s;
println!("{}", s.len());
```
**Result:** compile error: borrow of moved value `s`.

### O18.
```rust
let x = if true { 1 } else { "no" };
```
**Result:** compile error: `if` and `else` have incompatible types.

### O19.
```rust
fn f() -> i32 { 5; }
```
**Result:** compile error: the function returns `()` because of the semicolon. Remove `;`.

### O20.
```rust
let mut c = 0;
let mut inc = || { c += 1; c };
println!("{} {}", inc(), inc());
```
**Output:** `1 2`.

---

# ✅ Part 15: MCQs

**1. What happens when an owner goes out of scope?**
A) Value is leaked  B) Value is dropped  C) Garbage collector runs  D) Value is copied
**Answer: B**

**2. Which allows many readers OR one writer at a time?**
A) `Rc<T>`  B) Borrowing rules (`&T` / `&mut T`)  C) `Cell`  D) `static`
**Answer: B**

**3. Which type represents the absence of a value?**
A) `null`  B) `None` in `Option<T>`  C) `void`  D) `nil`
**Answer: B**

**4. Which is NOT `Send`?**
A) `Arc<i32>`  B) `Rc<i32>`  C) `String`  D) `Vec<u8>`
**Answer: B**

**5. What does `?` do on `Err(e)`?**
A) Panics  B) Returns `Err(From::from(e))` from the function  C) Ignores  D) Logs
**Answer: B**

**6. `String` vs `&str`:**
A) both owned  B) `String` owned, `&str` borrowed  C) both borrowed  D) `&str` growable
**Answer: B**

**7. Which smart pointer allows interior mutability with runtime checks?**
A) `Box`  B) `Rc`  C) `RefCell`  D) `Arc`
**Answer: C**

**8. Default integer type?**
A) `i64`  B) `u32`  C) `i32`  D) `isize`
**Answer: C**

**9. What is `'static`?**
A) a reference that must leak  B) a lifetime that can last the whole program  C) a static method  D) a global mutex
**Answer: B**

**10. Which macro prints debug info and returns the value?**
A) `print!`  B) `dbg!`  C) `debug_assert!`  D) `trace!`
**Answer: B**

**11. Integer overflow in a default release build:**
A) panics  B) wraps  C) saturates  D) undefined behavior
**Answer: B** (not UB; it is defined as wrapping unless `overflow-checks` is on)

**12. Which command checks code without producing a binary?**
A) `cargo build`  B) `cargo check`  C) `cargo run`  D) `cargo fmt`
**Answer: B**

**13. Trait objects use:**
A) static dispatch  B) dynamic dispatch via vtable  C) macros  D) reflection
**Answer: B**

**14. Which can be a `HashMap` key?**
A) `f64`  B) `String`  C) `Vec<f64>`  D) `f32`
**Answer: B** (floats are not `Hash`/`Eq`)

**15. What does `Arc::clone(&a)` do?**
A) deep copies data  B) increments the atomic reference count  C) moves `a`  D) locks `a`
**Answer: B**

**16. Which is true about `unsafe`?**
A) disables the borrow checker  B) allows five extra operations the compiler cannot verify  C) makes code faster  D) is required for threads
**Answer: B**

**17. `Future`s in Rust are:**
A) eager  B) lazy until polled  C) run on their own thread  D) always `Send`
**Answer: B**

**18. A `MutexGuard` is released when:**
A) `unlock()` is called  B) the guard is dropped  C) the thread ends only  D) never
**Answer: B**

**19. Which derive is needed to print with `{:?}`?**
A) `Display`  B) `Debug`  C) `Clone`  D) `Default`
**Answer: B**

**20. Which crate is commonly used for typed library errors?**
A) `anyhow`  B) `thiserror`  C) `rayon`  D) `clap`
**Answer: B**

**21. Orphan rule says:**
A) all traits need a derive  B) you can impl a trait for a type only if the trait or the type is local  C) no unused structs  D) no global state
**Answer: B**

**22. `Vec::with_capacity(n)`:**
A) sets length n  B) reserves space for n elements, length 0  C) fills with zeros  D) shrinks
**Answer: B**

**23. Which is a zero-cost abstraction example?**
A) `Box<dyn Trait>` call  B) iterator chain compiled to a loop  C) `Rc` count  D) `RefCell` borrow
**Answer: B**

**24. A panic inside a spawned thread:**
A) kills the whole process by default  B) is returned as `Err` from `join()`  C) is ignored  D) restarts the thread
**Answer: B**

**25. Which pattern encodes state in types?**
A) Visitor  B) Typestate  C) Singleton  D) Observer
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

1. **Cloning to silence the borrow checker.** It hides design problems and costs performance. First try borrowing or restructuring.
2. **`unwrap()` / `expect()` in production paths.** Return `Result` and add context.
3. **Using `&String` / `&Vec<T>` parameters.** Use `&str` / `&[T]`.
4. **Holding a `std::sync::MutexGuard` across `.await`.** Drop it first.
5. **Blocking calls inside async tasks.** Use `spawn_blocking`.
6. **Unbounded channels and unbounded `spawn`.** Add bounds and a `Semaphore`.
7. **`Rc<RefCell<T>>` everywhere.** Often a sign that ownership design needs rethinking. Consider indices, arenas, or channels.
8. **Using `String` where `&str` or `Cow` is enough.** Needless allocation.
9. **Ignoring Clippy.** Run `cargo clippy -- -D warnings` in CI.
10. **Taking `String` parameters when callers may have `&str`.** Use `impl Into<String>` or `&str`.
11. **Relying on `HashMap` iteration order.** It is random.
12. **Indexing strings by byte offset.** May panic on a non-boundary. Use `.chars()` or `char_indices`.
13. **Forgetting `#[derive(Debug)]` on error types.** `?` into `main` needs `Debug`.
14. **Shared mutable global state with `static mut`.** Use `OnceLock`, atomics or `Mutex`.
15. **Writing `unsafe` for convenience.** Prove it is needed, isolate it, document `SAFETY`.
16. **Giant `Arc<Mutex<State>>` with long critical sections.** Narrow the lock scope or shard state.
17. **Ignoring cancellation safety in `select!`.** Data can be lost when a branch is dropped.
18. **Not pinning toolchain and lockfile in CI.** Builds change unexpectedly.
19. **Over-using generics where `dyn` or concrete types suffice.** Slower compiles, unreadable signatures.
20. **Not adding `Send + Sync + 'static` bounds early.** They show up as long confusing errors later.
21. **Leaving `dbg!` and `println!` in library code.** Use `tracing`.
22. **Misusing `as` for numeric casts.** Silent truncation. Use `try_from`.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You explain ownership as a **design tool** (clear owners, short borrows) rather than a fight with the compiler.
- You pick `&str`, `&[T]`, `impl AsRef`, `impl Into` in APIs by habit and know why.
- You separate **library errors** (`thiserror`, typed) from **application errors** (`anyhow`, contextual).
- You know the `Send`/`Sync` rules and can read a "future is not `Send`" error quickly, then fix it by narrowing a guard's scope.
- You never block the async runtime, and you use bounded channels, semaphores and timeouts by default.
- You know cancellation safety and when `select!` can lose data.
- You can read `unsafe` code, spot missing `SAFETY` reasoning, and use Miri and `loom` to test it.
- You profile before optimizing (flamegraph, criterion, `dhat`) and can name three allocation-reduction techniques.
- You care about compile times: workspace splitting, feature trimming, `sccache`, linker choice.
- You use the type system to make invalid states unrepresentable (enums, newtypes, typestate).
- You understand that leaks, deadlocks and logic bugs are still possible in safe Rust.
- You manage supply-chain risk (`cargo audit`, `deny`, `vet`) and pin toolchains.
- You can say honestly when Rust is the wrong tool.
- You can explain trade-offs between Rust, Go, C++ and Java with real project examples.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Ownership in 30 seconds
- One owner. Move by default. `Copy` for plain data. `clone()` is explicit.
- `&T` many readers **or** `&mut T` one writer. Borrow ends at last use (NLL).
- References cannot outlive their owner. Lifetimes describe this relationship.

### Error handling in 30 seconds
- `Option` for absence. `Result` for failure. `?` to propagate.
- Libraries: `thiserror`. Apps: `anyhow`. Avoid `unwrap` outside tests.

### Traits in 30 seconds
- Traits = shared behavior. Generics = static dispatch. `dyn Trait` = dynamic dispatch.
- Orphan rule. Object safety. Associated types vs generics. Blanket impls. Supertraits.

### Concurrency in 30 seconds
- Threads: `spawn`, `scope`, channels, `Arc<Mutex<T>>`, atomics, Rayon.
- `Send` = can move across threads. `Sync` = `&T` can be shared.
- Async: lazy futures, runtime needed (Tokio), no blocking, no guard across `.await`, bounded channels.

### Memory in 30 seconds
- Stack for fixed size, heap via `Box`/`Vec`/`String`. RAII drop.
- `Rc`/`Arc` for sharing, `Weak` to break cycles, `RefCell`/`Mutex` for interior mutability.
- Leaks are safe but bad. UB only through `unsafe` (or FFI).

### Cargo commands
`new`, `init`, `build`, `run`, `check`, `test`, `bench`, `doc`, `fmt`, `clippy`, `add`, `update`, `tree`, `audit`, `deny`, `publish`.

### Interview strategy
1. Start every answer with a one-line definition.
2. Give a tiny code example.
3. Mention the trade-off or pitfall.
4. Link to real experience ("In my project, I used ... because ...").
5. If you do not know a detail, say "verify in the official docs" and explain how you would find out.

### Final checklist before the interview
- [ ] Explain ownership, borrowing, lifetimes with an example each.
- [ ] Explain `Rc` vs `Arc`, `RefCell` vs `Mutex`, `Send` vs `Sync`.
- [ ] Explain async/await, `Pin`, cancellation, and blocking pitfalls.
- [ ] Write a generic function with trait bounds and a custom error type.
- [ ] Write a small worker pool and an Axum endpoint.
- [ ] Explain `unsafe`, FFI, and how you would test it (Miri).
- [ ] Be ready with two project stories and one incident story.

