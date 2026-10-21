# C# Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **C# 12 and 13 on .NET 8 (LTS) and .NET 9**, and mentions **C# 14 / .NET 10 (LTS)** features as "verify in the official docs (learn.microsoft.com)". Examples use the sample name **Ritesh Kumar**.
> ASP.NET Core, Entity Framework Core, the .NET runtime and hosting topics are in file 019. This file covers the C# language, base class library, memory model, async, LINQ, concurrency, performance and production practice.

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
- [Part 11: Complete Coverage (Language + BCL + Tooling + Mixed)](#-part-11-complete-coverage-language--bcl--tooling--mixed)
- [Part 12: CLR Internals](#-part-12-clr-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is C#?
A modern, statically typed, object-oriented (and multi-paradigm) language from Microsoft that compiles to **Intermediate Language (IL)**, which the **Common Language Runtime (CLR)** JIT-compiles to machine code. It is used for web APIs, desktop, cloud, games (Unity), mobile (MAUI) and tooling.
```csharp
Console.WriteLine("Hello, Ritesh Kumar");     // top-level statements (C# 9+)
```

### Q2. .NET vs .NET Framework vs .NET Core
| | What it is |
|---|---|
| **.NET Framework** | Old Windows-only runtime (up to 4.8), maintenance mode |
| **.NET Core** | Cross-platform rewrite (1.0–3.1) |
| **.NET (5+)** | Unified modern platform: .NET 6, 7, 8 (LTS), 9, 10 (LTS) |
| **.NET Standard** | API contract for sharing libraries (mostly legacy; target modern .NET) |

### Q3. CLR, CTS, CLS, IL, JIT
- **CLR:** runtime that manages execution, memory (GC), type safety, exceptions.
- **IL:** CPU-independent bytecode produced by the compiler (Roslyn).
- **JIT:** compiles IL to machine code at runtime (tiered compilation); AOT options (ReadyToRun, Native AOT).
- **CTS:** common type system. **CLS:** subset of features for cross-language compatibility.

### Q4. Value types vs reference types *(Must-know)*
| | Value types | Reference types |
|---|---|---|
| Examples | `int`, `bool`, `double`, `struct`, `enum`, `DateTime` | `class`, `string`, arrays, `delegate`, `interface` |
| Stored | Inline (stack, or inside the containing object/array) | Heap, variable holds a reference |
| Copy | Copies the value | Copies the reference |
| Null | Not nullable (use `int?`) | Nullable (`null`) |

### Q5. Built-in types
`byte`, `sbyte`, `short`, `ushort`, `int`, `uint`, `long`, `ulong`, `float`, `double`, `decimal` (128-bit decimal for money), `char`, `bool`, `string`, `object`, `nint`/`nuint`. `decimal` avoids binary floating-point errors for money.

### Q6. `string` is immutable
Operations create new strings. Use `StringBuilder` for loops. Strings support interpolation, raw string literals and `$"..."`.
```csharp
var name = "Ritesh Kumar";
var msg = $"Hello, {name}! Length = {name.Length}";
var json = """{ "name": "Ritesh Kumar" }""";      // raw string literal (C# 11)
```
Compare with `string.Equals(a, b, StringComparison.OrdinalIgnoreCase)`; avoid culture-sensitive comparisons for identifiers.

### Q7. `var`, `const`, `readonly`, `static`
- `var`: compiler-inferred type (still static typing).
- `const`: compile-time constant (embedded in callers).
- `readonly`: assigned once at declaration or in a constructor (runtime constant).
- `static`: belongs to the type.

### Q8. Classes, objects, constructors
```csharp
public class User
{
    public string Name { get; }
    public int Age { get; set; }
    public User(string name, int age) { Name = name; Age = age; }
}
var u = new User("Ritesh Kumar", 30);
User u2 = new("Ritesh Kumar", 30);        // target-typed new
```

### Q9. Primary constructors (C# 12)
```csharp
public class OrderService(IOrderRepository repo, ILogger<OrderService> log)
{
    public Task<Order?> Get(int id) => repo.FindAsync(id);
}
```
Parameters are captured as fields when used. For records, primary constructors create properties automatically; for classes they do not.

### Q10. The four OOP pillars
Encapsulation (access modifiers, properties), inheritance (`:`), polymorphism (virtual/override, interfaces, overloading), abstraction (abstract classes, interfaces).

### Q11. Access modifiers
`public`, `private`, `protected`, `internal` (same assembly), `protected internal`, `private protected`, `file` (C# 11, file-scoped types). Default for class members is `private`, for types `internal`.

### Q12. Properties and auto-properties
```csharp
public string Email { get; init; }                  // set only during initialization
public int Age { get; private set; }
public required string Name { get; init; }          // C# 11: must be set by the caller
```
Properties expose data through accessors, allowing validation without breaking callers.

### Q13. Inheritance, `virtual`, `override`, `sealed`, `abstract`
```csharp
public abstract class Shape { public abstract double Area(); public virtual string Describe() => "shape"; }
public sealed class Circle(double r) : Shape { public override double Area() => Math.PI * r * r; }
```
`new` hides a member (avoid); `base` calls the parent.

### Q14. Interfaces and default interface methods
```csharp
public interface INotifier { Task SendAsync(string to, string msg); string Channel => "default"; }
```
Interfaces define contracts; a class can implement many. Prefer interfaces for dependency boundaries.

### Q15. Abstract class vs interface
Abstract class: shared state and partial implementation, single inheritance. Interface: capability contract, multiple implementation, default members possible. Prefer interfaces + composition; use abstract classes for shared base behavior.

### Q16. Method overloading, optional and named parameters
```csharp
void Log(string msg, LogLevel level = LogLevel.Info) { }
Log("hi", level: LogLevel.Error);
```
Overloads differ by parameter types/count (not by return type). `params` accepts a variable number of arguments.

### Q17. `ref`, `out`, `in`
`ref`: pass by reference (must be initialized). `out`: callee must assign (`int.TryParse(s, out var n)`). `in`: read-only reference (avoids copying large structs).

### Q18. Exceptions
```csharp
try { var n = int.Parse(text); }
catch (FormatException ex) when (text.Length > 0) { log.LogWarning(ex, "bad number"); }
catch (Exception ex) { throw; }              // preserves stack trace
finally { Cleanup(); }
```
Use `throw;` (not `throw ex;`) to preserve the stack. Prefer `TryParse` patterns for expected failures; exceptions are slow when thrown frequently.

### Q19. `using` and `IDisposable`
```csharp
using var stream = File.OpenRead("a.txt");           // disposed at end of scope (C# 8)
await using var conn = new SqlConnection(cs);        // IAsyncDisposable
```
Implement `IDisposable` for types owning unmanaged resources or other disposables.

### Q20. Arrays, `List<T>`, `Dictionary<K,V>`, `HashSet<T>`
```csharp
int[] a = [1, 2, 3];                      // collection expressions (C# 12)
List<string> names = ["a", "b"];
var map = new Dictionary<string, int> { ["a"] = 1 };
if (map.TryGetValue("a", out var v)) { }
```

### Q21. Generic collections vs non-generic
Generic (`List<T>`) are type-safe and avoid boxing; non-generic (`ArrayList`, `Hashtable`) are legacy. Always use generics.

### Q22. `foreach`, `for`, `while`, `switch`
```csharp
string size = n switch { < 10 => "small", < 100 => "medium", _ => "large" };   // switch expression
```

### Q23. Nullable types and null handling
`int?` (`Nullable<int>`), null-conditional `?.`, null-coalescing `??`, `??=`, null-forgiving `!` (suppress warning; use sparingly).
```csharp
string? name = user?.Name ?? "unknown";
```

### Q24. Nullable reference types (NRT) *(Must-know)*
Enabled with `<Nullable>enable</Nullable>`. The compiler tracks whether references may be null (`string` vs `string?`) and warns on risky dereferences. Treat warnings as errors in new code. It is compile-time analysis only; runtime nulls can still occur at boundaries (JSON, DB, reflection).

### Q25. Enums and flags
```csharp
[Flags] enum Permissions { None = 0, Read = 1, Write = 2, Admin = 4 }
var p = Permissions.Read | Permissions.Write;
bool canWrite = p.HasFlag(Permissions.Write);
```

### Q26. Structs vs classes
Structs are value types (small, immutable ideally, copied on assignment). Use for small data (<~16 bytes) like points. Classes for identity and larger state. `readonly struct` and `record struct` help.

### Q27. Records *(Must-know)*
```csharp
public record Person(string Name, int Age);                 // reference type, value equality, immutable by default
public record struct Point(int X, int Y);                   // value type record
var p2 = p1 with { Age = 31 };                              // non-destructive mutation
```
Records give value-based `Equals`, `GetHashCode`, `ToString`, deconstruction.

### Q28. Tuples and deconstruction
```csharp
(string name, int age) = ("Ritesh Kumar", 30);
(int min, int max) MinMax(int[] a) => (a.Min(), a.Max());
```

### Q29. Pattern matching
```csharp
if (obj is string { Length: > 3 } s) { }
var r = shape switch { Circle c => c.Area(), Rectangle { W: var w, H: var h } => w * h, _ => throw new ArgumentException() };
if (list is [var first, .., var last]) { }                  // list patterns (C# 11)
```

### Q30. Delegates, `Func`, `Action`, `Predicate`
```csharp
Func<int, int> square = x => x * x;
Action<string> print = Console.WriteLine;
Predicate<int> even = x => x % 2 == 0;
```
A delegate is a type-safe reference to a method. Lambdas create delegates or expression trees.

### Q31. Events
```csharp
public event EventHandler<OrderEventArgs>? OrderPlaced;
protected void OnOrderPlaced(OrderEventArgs e) => OrderPlaced?.Invoke(this, e);
```
Events expose only subscription (`+=`/`-=`) to outsiders. Unsubscribe to avoid memory leaks.

### Q32. LINQ basics *(Must-know)*
```csharp
var adults = users.Where(u => u.Age >= 18).OrderBy(u => u.Name).Select(u => u.Name).ToList();
var byCity = users.GroupBy(u => u.City).ToDictionary(g => g.Key, g => g.Count());
```
LINQ queries are **deferred** until enumerated (`ToList`, `foreach`, `Count`). `IEnumerable<T>` runs in memory; `IQueryable<T>` is translated to SQL by providers like EF Core.

### Q33. Namespaces and `using`
File-scoped namespaces (`namespace MyApp.Services;`), global usings (`global using System.Linq;`), implicit usings (SDK-provided).

### Q34. Common `object` methods
`ToString`, `Equals`, `GetHashCode`, `GetType`, `MemberwiseClone`. Override `Equals` and `GetHashCode` together.

### Q35. NuGet and the CLI
```bash
dotnet new console -n App
dotnet add package Serilog
dotnet build
dotnet run
dotnet test
dotnet publish -c Release
```
NuGet is the package manager; `.csproj` (SDK-style) defines target framework and dependencies.

---

# 🔵 Part 2: Junior (1–3 years)

### Q36. Boxing and unboxing *(Must-know)*
Boxing converts a value type to `object` (allocates on the heap); unboxing casts back. Both cost allocations and CPU. Avoid via generics (`List<int>`), avoiding `object` parameters, and careful use of interfaces on structs (`IComparable` call on a struct can box).

### Q37. `==` vs `Equals` vs `ReferenceEquals`
`==` is overloadable (for strings it compares values). `Equals` compares by value if overridden. `ReferenceEquals` compares identity. For records, `==` and `Equals` compare members.

### Q38. Implementing `Equals` and `GetHashCode`
```csharp
public sealed class Money : IEquatable<Money>
{
    public decimal Amount { get; } public string Currency { get; }
    public Money(decimal a, string c) { Amount = a; Currency = c; }
    public bool Equals(Money? o) => o is not null && Amount == o.Amount && Currency == o.Currency;
    public override bool Equals(object? o) => Equals(o as Money);
    public override int GetHashCode() => HashCode.Combine(Amount, Currency);
}
```
Prefer a `record` which generates all this.

### Q39. `IEnumerable`, `IEnumerator`, `yield`
```csharp
static IEnumerable<int> Evens(int max) { for (int i = 0; i <= max; i += 2) yield return i; }
```
`yield` builds a lazy state machine. Don't enumerate a lazy sequence multiple times if it is expensive or has side effects (materialize with `ToList`).

### Q40. `IEnumerable<T>` vs `ICollection<T>` vs `IList<T>` vs `IReadOnlyList<T>`
`IEnumerable`: forward-only iteration. `ICollection`: count + add/remove. `IList`: index access. `IReadOnly*`: read-only views for return types and parameters. Accept the least specific type you need; return the most useful.

### Q41. LINQ deferred vs immediate execution
`Where/Select/OrderBy` are deferred; `ToList/ToArray/Count/First/Sum/Any` execute immediately. Modifying the source after creating the query changes results. Multiple enumeration can run the query (and DB calls) repeatedly.

### Q42. Common LINQ methods
`Where`, `Select`, `SelectMany`, `OrderBy/ThenBy`, `GroupBy`, `Join`, `Distinct`, `Skip/Take`, `Any/All`, `First/FirstOrDefault/Single`, `Aggregate`, `Zip`, `Chunk`, `DistinctBy`, `MinBy/MaxBy`, `CountBy`/`AggregateBy` (newer .NET versions: verify).
`First` throws if empty; `FirstOrDefault` returns default; `Single` throws if not exactly one.

### Q43. Extension methods
```csharp
public static class StringExtensions { public static string Truncate(this string s, int n) => s.Length <= n ? s : s[..n]; }
"Ritesh Kumar".Truncate(6);
```
Static methods in static classes that appear as instance methods. Extension members/properties are expanding in C# 14 (verify).

### Q44. Generics with constraints
```csharp
public class Repository<T> where T : class, IEntity, new()
{
    public T Create() => new T();
}
static T Max<T>(T a, T b) where T : IComparable<T> => a.CompareTo(b) >= 0 ? a : b;
```
Constraints: `class`, `struct`, `new()`, base type, interface, `notnull`, `unmanaged`. .NET generics are reified (type info preserved at runtime), unlike Java erasure.

### Q45. Covariance and contravariance
`IEnumerable<out T>` is covariant (`IEnumerable<string>` can be used as `IEnumerable<object>`); `Action<in T>` is contravariant. Applies to interfaces/delegates with reference types.

### Q46. Async/await basics *(Must-know)*
```csharp
public async Task<User?> GetUserAsync(int id, CancellationToken ct)
{
    var res = await http.GetAsync($"/users/{id}", ct);
    res.EnsureSuccessStatusCode();
    return await res.Content.ReadFromJsonAsync<User>(cancellationToken: ct);
}
```
`await` frees the thread while waiting for I/O; the rest of the method continues as a continuation. `async` does not create a thread. Return `Task`/`Task<T>` (or `ValueTask`); avoid `async void` except for event handlers.

### Q47. Async best practices
- Async all the way: don't block with `.Result`/`.Wait()` (deadlocks in sync-context apps, thread starvation in servers).
- Pass `CancellationToken` through.
- Use `Task.WhenAll` for parallel I/O.
- `ConfigureAwait(false)` in library code (not needed in ASP.NET Core app code).
- Suffix async methods with `Async`.
```csharp
var tasks = new[] { GetAAsync(), GetBAsync() };
await Task.WhenAll(tasks);
```

### Q48. `Task` vs `ValueTask`
`ValueTask<T>` avoids allocation when a result is often available synchronously. Constraints: await it once, don't block on it, don't await multiple times. Default to `Task`; use `ValueTask` in hot paths after measuring.

### Q49. `Task.Run` and CPU-bound work
`Task.Run` offloads CPU-bound work to the thread pool (useful in UI apps). In ASP.NET Core, wrapping I/O in `Task.Run` is pointless and harmful; wrapping CPU work only moves it between thread-pool threads.

### Q50. Exception handling in async code
Exceptions are captured in the `Task` and rethrown on `await`. With `Task.WhenAll`, `await` throws the first exception; inspect `task.Exception.InnerExceptions` for all. Unobserved task exceptions are ignored in modern .NET (but still bugs).

### Q51. Cancellation
```csharp
using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
cts.CancelAfter(TimeSpan.FromSeconds(5));
await DoWorkAsync(cts.Token);
```
Cooperative: methods check `token.ThrowIfCancellationRequested()` or pass the token to APIs. Catch `OperationCanceledException` at the boundary.

### Q52. Threads, ThreadPool, Tasks
Threads are expensive OS resources. The ThreadPool reuses worker threads and grows based on demand. `Task` is the abstraction for asynchronous work. Prefer Tasks/async over raw `Thread`.

### Q53. `lock`, `Monitor`, `SemaphoreSlim`, `Interlocked`
```csharp
private readonly object _gate = new();
lock (_gate) { count++; }
Interlocked.Increment(ref counter);
await sem.WaitAsync(); try { ... } finally { sem.Release(); }
```
Don't `await` inside `lock` (not allowed); use `SemaphoreSlim`. In .NET 9 a dedicated `System.Threading.Lock` type is recommended over `object` (verify).

### Q54. Concurrent collections
`ConcurrentDictionary<K,V>` (`GetOrAdd`, `AddOrUpdate`; factory delegates may run more than once), `ConcurrentQueue`, `ConcurrentBag`, `BlockingCollection`, `Channel<T>` (async producer/consumer; preferred). 

### Q55. `Channel<T>` producer/consumer
```csharp
var ch = Channel.CreateBounded<int>(100);
_ = Task.Run(async () => { for (int i = 0; i < 1000; i++) await ch.Writer.WriteAsync(i); ch.Writer.Complete(); });
await foreach (var item in ch.Reader.ReadAllAsync()) Process(item);
```
Bounded channels give backpressure.

### Q56. Dependency injection basics (generic host)
```csharp
services.AddSingleton<IClock, SystemClock>();
services.AddScoped<IOrderService, OrderService>();
services.AddTransient<IValidator, Validator>();
```
Lifetimes: **Singleton** (one per app), **Scoped** (one per scope/request), **Transient** (new each time). A singleton must not depend on a scoped service (captive dependency). Details in file 019.

### Q57. Configuration and options pattern
```csharp
builder.Services.Configure<MailOptions>(builder.Configuration.GetSection("Mail"));
class Mailer(IOptions<MailOptions> o) { }
```
Sources: `appsettings.json`, environment variables, user secrets, Key Vault. Validate options at startup (`ValidateDataAnnotations().ValidateOnStart()`).

### Q58. Logging
`ILogger<T>` with structured logging (message templates): `log.LogInformation("User {UserId} logged in", id)`. Use `LoggerMessage` source generators in hot paths. Providers: Serilog, NLog, OpenTelemetry.

### Q59. File and stream I/O
```csharp
await File.WriteAllTextAsync("a.txt", text);
await using var fs = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read, 4096, useAsync: true);
using var reader = new StreamReader(fs);
while (await reader.ReadLineAsync() is { } line) { }
```

### Q60. JSON with `System.Text.Json`
```csharp
var json = JsonSerializer.Serialize(user, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
var u = JsonSerializer.Deserialize<User>(json);
```
Fast and built in; source generators for AOT/perf. Newtonsoft.Json remains for legacy features.

### Q61. Testing
xUnit (most common), NUnit, MSTest; mocking with Moq/NSubstitute; FluentAssertions (check license changes in newer versions: verify), Testcontainers for infrastructure; `WebApplicationFactory` for ASP.NET integration tests.
```csharp
[Theory]
[InlineData(2, 3, 5)]
public void Adds(int a, int b, int expected) => Assert.Equal(expected, a + b);
```

### Q62. Reflection and attributes
Reflection inspects types at runtime (`typeof(T).GetProperties()`); attributes add metadata (`[Obsolete]`, `[Required]`, custom). Reflection is slow and AOT-unfriendly; prefer source generators when possible.

---

# 🟡 Part 3: Mid (3–5 years)

### Q63. How the .NET GC works *(Must-know)*
Generational, compacting, mark-and-sweep style collector with generations **0, 1, 2** plus the **Large Object Heap (LOH)** for objects ≥ 85,000 bytes (collected with gen 2). Most objects die young. Modes: Workstation vs Server GC (server uses one heap/thread per core, higher throughput), concurrent/background GC for gen 2. `GC.Collect()` is almost never appropriate. Allocation rate drives GC cost.

### Q64. `IDisposable` pattern and finalizers
Use `using` for deterministic cleanup. Implement the dispose pattern only when owning unmanaged resources directly; prefer `SafeHandle`. Finalizers (`~T`) run non-deterministically on a finalizer thread and delay collection; avoid unless wrapping native handles.
```csharp
public void Dispose() { Dispose(true); GC.SuppressFinalize(this); }
protected virtual void Dispose(bool disposing) { if (disposing) { /* free managed */ } /* free unmanaged */ }
```

### Q65. Memory leaks in managed code
Events never unsubscribed, static caches/collections, long-lived closures, `Timer` callbacks, `HttpClient` created per request (socket exhaustion), undisposed resources, thread-statics in pools, large object fragmentation. Diagnose with `dotnet-counters`, `dotnet-gcdump`, `dotnet-dump`, Visual Studio/dotMemory/PerfView.

### Q66. `Span<T>`, `Memory<T>` and `stackalloc`
Allocation-free slicing over arrays, strings, or stack memory.
```csharp
ReadOnlySpan<char> s = "2026-10-21".AsSpan();
int year = int.Parse(s[..4]);
Span<byte> buffer = stackalloc byte[256];
```
`Span<T>` is a `ref struct` (stack-only: cannot be a field in a class, used across `await`, or boxed). Use `Memory<T>` when you need to cross async boundaries.

### Q67. `ArrayPool<T>`, object pooling, and reducing allocations
```csharp
var arr = ArrayPool<byte>.Shared.Rent(4096);
try { /* use */ } finally { ArrayPool<byte>.Shared.Return(arr); }
```
Also: avoid LINQ in hot paths, use `StringBuilder`/`string.Create`, `static` lambdas, struct enumerators, `ValueTask`, `FrozenDictionary` for read-only lookups (.NET 8).

### Q68. Benchmarking with BenchmarkDotNet
Handles warm-up, JIT tiers, statistical analysis, and memory diagnostics (`[MemoryDiagnoser]`). Never trust `Stopwatch` loops for micro-optimizations.

### Q69. Struct design: `readonly struct`, `ref struct`, `record struct`
Make structs immutable (`readonly struct`) to avoid defensive copies. Pass large structs by `in`. Avoid mutable structs in collections (copy semantics bite).

### Q70. Delegates, closures and captured variables
Lambdas capture variables by reference, creating closure objects (allocations). In loops, `foreach` variables are per-iteration (since C# 5) but `for` loop variables are shared:
```csharp
var fs = new List<Action>();
for (int i = 0; i < 3; i++) fs.Add(() => Console.Write(i));   // prints 333
```
Use `static` lambdas to prevent accidental capture.

### Q71. Expression trees and `IQueryable`
Lambdas assigned to `Expression<Func<T,bool>>` are data (trees) that providers translate (EF Core to SQL). Calling arbitrary .NET methods inside may fail or force client evaluation. Be careful returning `IQueryable` from repositories (leaks persistence concerns).

### Q72. Async streams (`IAsyncEnumerable<T>`)
```csharp
public async IAsyncEnumerable<Order> StreamOrders([EnumeratorCancellation] CancellationToken ct = default)
{
    await foreach (var o in db.Orders.AsAsyncEnumerable().WithCancellation(ct)) yield return o;
}
```
Good for streaming large results without buffering.

### Q73. `async` internals and state machines
The compiler rewrites `async` methods into state machines (struct for optimization). `await` registers a continuation; context capture depends on `SynchronizationContext`. ASP.NET Core has no sync context (no deadlocks from `.Result` in the classic sense, but thread-pool starvation can still occur).

### Q74. Thread-pool starvation
Blocking calls (`.Result`, `.Wait()`, sync I/O) inside request threads consume pool threads; the pool injects new threads slowly (hill-climbing), so latency spikes under load. Fix by going async end to end, limiting concurrency, and watching `ThreadPool.PendingWorkItemCount` / counters.

### Q75. `Parallel` and PLINQ
`Parallel.ForEachAsync(items, new ParallelOptions { MaxDegreeOfParallelism = 8 }, async (x, ct) => ...)` for bounded async parallelism. `Parallel.For`/PLINQ for CPU-bound data parallelism; not for I/O. Ensure thread safety of shared state.

### Q76. SOLID and design patterns in C#
SRP, OCP, LSP, ISP, DIP; patterns: Factory, Builder, Strategy (delegates/DI), Decorator (DI decoration), Observer (events), Mediator (MediatR), Repository/Unit of Work (be wary of redundant wrappers over EF Core), Options, Specification.

### Q77. Source generators and Roslyn analyzers
Generate code at compile time (System.Text.Json, regex `[GeneratedRegex]`, `LoggerMessage`, DI/mapping libraries like Mapperly). Analyzers enforce rules (`.editorconfig`, `TreatWarningsAsErrors`). Benefits: no runtime reflection, AOT-friendly.

### Q78. Regular expressions
```csharp
[GeneratedRegex(@"^\d{3}-\d{4}$", RegexOptions.Compiled)]
private static partial Regex PhoneRegex();
```
Use timeouts for untrusted input (`matchTimeout`) to avoid ReDoS; prefer source-generated regex.

### Q79. Date and time handling
Use `DateTimeOffset` for instants with offsets, `TimeProvider` (.NET 8) for testable time, store UTC, convert for display with `TimeZoneInfo`. Avoid `DateTime.Now` in business logic; `DateOnly`/`TimeOnly` for dates/times alone.

### Q80. Numeric precision
`decimal` for money; `double` for scientific; never compare floating-point values with `==`; `checked` contexts for overflow detection (`checked { int x = int.MaxValue + 1; }` throws).

### Q81. Strings and culture
`ToUpper()` is culture-sensitive; use `ToUpperInvariant()` for identifiers, `StringComparison.Ordinal` for keys. Beware of the Turkish-I problem. Use `CultureInfo.InvariantCulture` for serialization.

### Q82. Interop and unsafe code
P/Invoke (`[DllImport]`, `[LibraryImport]` source generated), `unsafe` pointers, `fixed`, `Marshal`. Use only when needed; validate lengths; prefer `Span<T>`.

### Q83. HttpClient usage *(Must-know)*
Creating `new HttpClient()` per request exhausts sockets; sharing a singleton ignores DNS changes. Use `IHttpClientFactory` (typed/named clients) with resilience handlers (Polly / `Microsoft.Extensions.Http.Resilience`), timeouts, and cancellation.
```csharp
builder.Services.AddHttpClient<GitHubClient>(c => c.BaseAddress = new Uri("https://api.github.com/"))
    .AddStandardResilienceHandler();
```

### Q84. Resilience with Polly
Retry with jitter, circuit breaker, timeout, bulkhead, hedging, fallback. Retry only idempotent operations and set overall timeouts. .NET 8 provides `Microsoft.Extensions.Resilience` built on Polly v8.

### Q85. Error handling strategy
Exceptions for unexpected failures; result types (`Result<T>`/OneOf/ErrorOr) or `TryXxx` for expected business failures; global exception handling middleware (`IExceptionHandler`, `ProblemDetails`); never swallow exceptions; log once with context.

### Q86. Immutability and defensive copying
`init` properties, records, `ImmutableArray<T>`, `IReadOnlyList<T>`, `FrozenSet`. Immutable data simplifies concurrency. Note `IReadOnlyList<T>` is a view, not a guarantee against changes to the underlying list.

### Q87. Security basics in C#
Parameterized queries (EF Core does this; with ADO.NET use `SqlParameter`), validate input, avoid `BinaryFormatter` (removed/unsafe), use ASP.NET Core Data Protection, hashing with `PasswordHasher`/Argon2/bcrypt, `RandomNumberGenerator` for tokens, secret management (User Secrets, Key Vault), and dependency scanning (`dotnet list package --vulnerable`).

### Q88. Cryptography
Use `System.Security.Cryptography`: `SHA256`, `HMACSHA256`, `Aes` (use `AesGcm`), `RSA`/`ECDsa`, `RandomNumberGenerator`. Never roll your own crypto; use unique nonces; compare secrets with `CryptographicOperations.FixedTimeEquals`.

### Q89. Code organization
Solution with projects (Domain, Application, Infrastructure, Api, Tests), central package management (`Directory.Packages.props`), `Directory.Build.props` for shared settings, analyzers, and `.editorconfig`.

### Q90. Unit testing patterns
Arrange-Act-Assert, test doubles (mocks/stubs/fakes), `TimeProvider` fakes, deterministic tests, `[Theory]` data-driven tests, avoiding over-mocking, snapshot testing (Verify) for complex outputs.

### Q91. C# 12 and 13 features to know
Primary constructors (all types), collection expressions `[1, 2, 3]` with spread `..`, `ref readonly` parameters, default lambda parameters, alias any type, `params` collections and `field`-style improvements in newer versions (verify exact versions), `Lock` type (.NET 9).

### Q92. Tooling
`dotnet` CLI, Visual Studio, Rider, VS Code (C# Dev Kit), `dotnet format`, analyzers, `dotnet-trace`, `dotnet-counters`, `dotnet-dump`, `dotnet-gcdump`, PerfView, BenchmarkDotNet, SonarQube, dependabot/Renovate.


---

# 🟠 Part 4: Senior (5–7 years)

### Q93. Designing a high-throughput .NET service *(Architecture)*
Async I/O end to end, bounded concurrency (semaphores, channels), `HttpClientFactory` with resilience, connection pooling and sized DB pools, caching (`IMemoryCache`, `HybridCache` in .NET 9, Redis), batching, pagination, compression, minimal allocations in hot paths, structured logging and OpenTelemetry, health checks, graceful shutdown, and load testing (k6, NBomber). Profile first; fix the slowest dependency before micro-optimizing C#.

### Q94. Performance engineering process
Define SLOs → measure (traces, `dotnet-counters`, PerfView, BenchmarkDotNet) → find the bottleneck (CPU, allocations, GC, locks, I/O) → fix the biggest item → re-measure. Typical wins: remove sync-over-async, avoid N+1 queries, cache, reduce allocations (spans, pooling), choose better data structures, and tune GC mode.

### Q95. GC tuning
Server GC for throughput on multi-core servers, Workstation for desktop/small containers; `GCHeapCount`, `GCHeapAffinitizeMask`, `GCConserveMemory`, `DOTNET_gcServer`; in containers heap limits follow cgroup limits (`GCHeapHardLimit`). Watch gen 2 collections, LOH allocations (avoid large temporary arrays; use pooling), pause times, and allocation rate. Use `GC.GetGCMemoryInfo()` and counters for monitoring.

### Q96. Diagnosing production issues *(Must-know)*
| Symptom | Tool |
|---|---|
| High CPU | `dotnet-trace` (sampling), PerfView, `dotnet-counters` |
| Memory growth | `dotnet-gcdump`, `dotnet-dump` + `dumpheap -stat`, dotMemory |
| Hang/deadlock | `dotnet-dump` with `clrstack`, `syncblk`; thread stack dumps |
| Slow requests | Distributed traces (OpenTelemetry), Application Insights |
| Thread-pool starvation | `ThreadPool` counters, `dotnet-stack`, look for blocked threads |
| Exceptions | Structured logs, first-chance exception counters |

### Q97. Lock-free and low-lock patterns
`Interlocked`, `Volatile`, `ConcurrentDictionary`, immutable snapshots swapped atomically (`Interlocked.Exchange`), `ReaderWriterLockSlim` (rarely worth it), `SemaphoreSlim`, `Channel<T>`. Prefer message passing/immutability over shared locks.

### Q98. Memory model and `volatile`
.NET guarantees visibility via locks, `Volatile.Read/Write`, `Interlocked`, and the `volatile` keyword (acquire/release semantics). Without them, the JIT/CPU may reorder reads/writes. Double-checked locking requires `volatile` or `Lazy<T>`/`LazyInitializer`.

### Q99. `Lazy<T>` and initialization patterns
`Lazy<T>` with `LazyThreadSafetyMode.ExecutionAndPublication` ensures one initialization. For async init use `Lazy<Task<T>>` or hosted services that initialize at startup.

### Q100. ASP.NET Core thread model and sync-over-async
Requests run on thread-pool threads. Blocking those threads reduces capacity and causes starvation under load. Use async APIs for DB/HTTP/file I/O; keep CPU-heavy work off request threads (background services, queues).

### Q101. Background processing
`IHostedService` / `BackgroundService` for in-process work, queues (Azure Service Bus, RabbitMQ, SQS, Kafka) for durable work, Hangfire/Quartz.NET for scheduled jobs, and the outbox pattern for reliable messaging. Make jobs idempotent with retries and dead-letter handling.

### Q102. Distributed data consistency
Avoid distributed transactions; use sagas (MassTransit/NServiceBus), outbox/inbox, idempotent consumers, optimistic concurrency (`rowversion` tokens), and well-defined data ownership. Document consistency (strong vs eventual) per use case.

### Q103. Domain modeling in C#
Entities with identity, value objects as `record`s/`readonly record struct`, aggregates guarding invariants, domain events, strongly typed IDs (`readonly record struct OrderId(Guid Value)`), and avoiding anemic models when rules are rich. Keep domain code free of framework dependencies where practical.

### Q104. API design guidelines for libraries
Accept the least specific parameter types, return the most useful, use `CancellationToken` as the last optional parameter, avoid exposing mutable collections, follow naming conventions, mark APIs `[Obsolete]` with guidance, document with XML comments, keep binary compatibility in mind (don't change signatures; add overloads), and use semantic versioning.

### Q105. Native AOT and trimming
Native AOT compiles to a self-contained native binary: fast startup, small memory, no JIT. Limits: no runtime code generation, restricted reflection (use source generators), not all libraries are compatible. Suitable for serverless, CLIs, containers with tight startup. ReadyToRun and trimming are intermediate options.

### Q106. Observability
Logs (Serilog/`ILogger` with structured properties and correlation IDs), metrics (`System.Diagnostics.Metrics`, `dotnet-counters`, Prometheus exporter), traces (`ActivitySource`, OpenTelemetry), health checks (`/health/live`, `/health/ready`), dashboards and SLO alerts. Avoid high-cardinality metric tags.

### Q107. Security hardening
Authentication/authorization via policies, anti-forgery for cookie apps, strict CORS, rate limiting middleware, input validation, secure headers, secret stores, least-privilege identities (managed identity), dependency auditing (`dotnet list package --vulnerable`), SAST (CodeQL), and container hardening (non-root, distroless/chiseled images).

### Q108. Multi-targeting and compatibility
Target `net8.0;net9.0` for libraries (avoid `netstandard` unless you need old frameworks). Use `#if` sparingly; polyfills via packages; test across targets in CI. Be careful with binary breaking changes.

### Q109. Upgrading .NET versions
Move LTS to LTS (6 → 8 → 10). Use the .NET Upgrade Assistant, read breaking-change docs, update packages, enable analyzers, run the full test suite, load test, and canary-deploy. Track support dates on dotnet.microsoft.com (STS releases are shorter lived).

### Q110. Monorepo and dependency management
Central Package Management, `Directory.Build.props/targets`, `global.json` to pin the SDK, lock files (`RestorePackagesWithLockFile`), private feeds, consistent analyzers, and CI caching.

### Q111. Handling large data
Stream with `IAsyncEnumerable<T>`, `Utf8JsonReader`/`JsonSerializer.DeserializeAsyncEnumerable`, `System.IO.Pipelines`, batch DB operations (`ExecuteUpdate`, `SqlBulkCopy`), pagination, and memory-mapped files. Avoid materializing millions of rows.

### Q112. Common anti-patterns in senior reviews
`async void`, `.Result`/`.Wait()`, `new HttpClient()` per call, swallowed exceptions, service locator, static mutable state, captive dependencies, `IQueryable` leaking out of repositories, catching `Exception` broadly, `DateTime.Now`, string concatenation of SQL, and fire-and-forget tasks without error handling.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q113. C#/.NET vs Java vs Node vs Go: how do you decide? *(Decision)*
| | C# / .NET | Java | Node.js | Go |
|---|---|---|---|---|
| Strengths | Excellent tooling, modern language, strong performance, great Azure/Windows integration, Unity | Huge enterprise ecosystem, mature JVM | JS everywhere, fast iteration | Simplicity, fast startup, concurrency |
| Weaknesses | Smaller OSS ecosystem than Java in some areas | Verbose (improving) | CPU-bound one thread | Less expressive, fewer enterprise libs |
| Fit | Enterprise APIs, Azure, games, desktop, cloud services | Large enterprise systems | BFFs, real-time | Infrastructure, network services |
Decide by team skills, ecosystem, cloud platform, performance targets, hiring and long-term support.

### Q114. Platform standards for .NET teams
Standard SDK/LTS version, `Directory.Build.props`, analyzers and `.editorconfig`, service template (logging, health checks, auth, OpenTelemetry), shared NuGet libraries on a private feed, CI/CD pipeline, container base images, security scanning, and an upgrade cadence.

### Q115. Modular monolith vs microservices in .NET
Start with a modular monolith (separate projects/modules with explicit public APIs, enforced by architecture tests such as NetArchTest or ArchUnitNET). Split when scaling, team autonomy, or release cadence demand it. Account for network failures, consistency, observability and operational overhead.

### Q116. Clean architecture, vertical slices, and when to use which
Clean/onion layering separates domain, application, infrastructure, and presentation. Vertical slice architecture groups code by feature (request → handler → data access), reducing cross-layer ceremony. Pick the simplest structure that keeps rules testable; avoid copying templates without need. MediatR (check licensing in newer versions: verify) is optional, not required.

### Q117. API governance
OpenAPI contracts, consistent errors (`ProblemDetails`), pagination/filtering standards, versioning (`Asp.Versioning`), breaking-change detection in CI, consumer-driven contract tests, SDK generation, and deprecation policies.

### Q118. Reliability and SLOs
Define SLIs/SLOs, error budgets, alert on symptoms, runbooks, chaos and load testing, graceful degradation, multi-region or multi-AZ design, backup/restore drills, and blameless post-mortems.

### Q119. Cost and capacity management
Right-size instances/containers, autoscale on meaningful metrics, optimize hot paths and queries, cache, choose Native AOT or smaller images for bursty workloads, and track cost per request or tenant.

### Q120. Security program
Threat modeling, SAST/DAST/SCA (CodeQL, Dependabot), secret scanning, managed identities, least privilege, audit logging, penetration tests, compliance (GDPR, SOC2, PCI), and a patch SLA for runtime and dependency CVEs.

### Q121. Legacy modernization (.NET Framework → modern .NET)
Strangler pattern; assess dependencies with the Upgrade Assistant and portability analyzer; move libraries to multi-target `net48;net8.0`, then apps; replace WCF with gRPC/CoreWCF, Web Forms with Blazor/MVC; migrate to EF Core incrementally; keep tests as the safety net; deploy side by side.

### Q122. Hiring and mentoring (C# depth)
Interview for: value vs reference semantics, async/await mental model and pitfalls, LINQ deferred execution, memory/GC awareness, DI lifetimes, testing habits, and debugging skills (dumps, traces). Mentor through reviews on async correctness, disposal, nullability and API design.

### Q123. Technical debt and roadmap
Debt register: unsupported frameworks, sync-over-async, missing nullable annotations, god classes, flaky tests, outdated packages, unclear module boundaries. Reserve capacity each sprint; track .NET support timelines and security advisories.

### Q124. Build vs buy and third-party risk
Evaluate libraries on maintenance, license changes (several popular .NET libraries changed licenses; verify current terms), security history, community, and replacement cost. Wrap risky dependencies behind small interfaces and keep upgrade paths open.

---

# 💻 Part 6: Coding / Machine-Coding Tasks

> Practice from memory. State complexity, thread-safety, cancellation and tests.

### C1. Reverse a string and palindrome check
```csharp
static bool IsPalindrome(string s)
{
    int i = 0, j = s.Length - 1;
    while (i < j)
    {
        while (i < j && !char.IsLetterOrDigit(s[i])) i++;
        while (i < j && !char.IsLetterOrDigit(s[j])) j--;
        if (char.ToLowerInvariant(s[i++]) != char.ToLowerInvariant(s[j--])) return false;
    }
    return true;
}
```

### C2. Two sum with a dictionary
```csharp
static (int, int)? TwoSum(int[] nums, int target)
{
    var seen = new Dictionary<int, int>();
    for (int i = 0; i < nums.Length; i++)
    {
        if (seen.TryGetValue(target - nums[i], out var j)) return (j, i);
        seen[nums[i]] = i;
    }
    return null;
}
```

### C3. Word frequency with LINQ
```csharp
var freq = text.ToLowerInvariant().Split(' ', StringSplitOptions.RemoveEmptyEntries)
    .GroupBy(w => w).ToDictionary(g => g.Key, g => g.Count())
    .OrderByDescending(kv => kv.Value).Take(3);
```

### C4. Group anagrams
```csharp
var groups = words.GroupBy(w => new string(w.OrderBy(c => c).ToArray())).Select(g => g.ToList()).ToList();
```

### C5. Thread-safe counter and cache
```csharp
public sealed class Counter { private long _n; public long Increment() => Interlocked.Increment(ref _n); }

var cache = new ConcurrentDictionary<string, Lazy<Task<User>>>();
Task<User> GetUser(string id) => cache.GetOrAdd(id, k => new Lazy<Task<User>>(() => LoadAsync(k))).Value;
```
`Lazy<Task<T>>` ensures the factory runs once per key.

### C6. LRU cache
```csharp
public class LruCache<K, V> where K : notnull
{
    private readonly int _cap; private readonly Dictionary<K, LinkedListNode<(K, V)>> _map = new();
    private readonly LinkedList<(K, V)> _list = new();
    public LruCache(int cap) => _cap = cap;
    public bool TryGet(K key, out V value)
    {
        if (_map.TryGetValue(key, out var node)) { _list.Remove(node); _list.AddFirst(node); value = node.Value.Item2; return true; }
        value = default!; return false;
    }
    public void Put(K key, V value)
    {
        if (_map.TryGetValue(key, out var n)) { _list.Remove(n); _map.Remove(key); }
        else if (_map.Count >= _cap) { var last = _list.Last!; _map.Remove(last.Value.Item1); _list.RemoveLast(); }
        _map[key] = _list.AddFirst((key, value));
    }
}
```
Not thread-safe; wrap with a lock or use `MemoryCache`.

### C7. Bounded parallel async calls
```csharp
var results = new ConcurrentBag<Result>();
await Parallel.ForEachAsync(urls, new ParallelOptions { MaxDegreeOfParallelism = 8, CancellationToken = ct },
    async (url, token) => results.Add(await client.GetFromJsonAsync<Result>(url, token)));
```

### C8. Retry with exponential backoff and jitter
```csharp
static async Task<T> RetryAsync<T>(Func<CancellationToken, Task<T>> action, int retries, CancellationToken ct)
{
    for (int attempt = 0; ; attempt++)
    {
        try { return await action(ct); }
        catch (Exception) when (attempt < retries && !ct.IsCancellationRequested)
        {
            var delay = TimeSpan.FromMilliseconds(200 * Math.Pow(2, attempt) * (0.5 + Random.Shared.NextDouble()));
            await Task.Delay(delay, ct);
        }
    }
}
```

### C9. Producer/consumer with `Channel<T>`
See Q55. Add multiple consumers: `await Task.WhenAll(Enumerable.Range(0, 4).Select(_ => Consume(reader, ct)))`.

### C10. Background service with graceful stop
```csharp
public class Worker(ILogger<Worker> log) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stop)
    {
        using var timer = new PeriodicTimer(TimeSpan.FromSeconds(30));
        while (await timer.WaitForNextTickAsync(stop))
        {
            try { await DoWorkAsync(stop); }
            catch (Exception ex) when (ex is not OperationCanceledException) { log.LogError(ex, "work failed"); }
        }
    }
}
```

### C11. Rate limiter (token bucket)
```csharp
public sealed class TokenBucket(int capacity, double perSecond)
{
    private double _tokens = capacity; private long _last = Stopwatch.GetTimestamp(); private readonly object _gate = new();
    public bool TryAcquire()
    {
        lock (_gate)
        {
            var now = Stopwatch.GetTimestamp();
            _tokens = Math.Min(capacity, _tokens + Stopwatch.GetElapsedTime(_last, now).TotalSeconds * perSecond); _last = now;
            if (_tokens < 1) return false; _tokens -= 1; return true;
        }
    }
}
```
In ASP.NET Core use the built-in rate limiting middleware.

### C12. Binary search
```csharp
static int Search(int[] a, int x)
{
    int lo = 0, hi = a.Length - 1;
    while (lo <= hi)
    {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == x) return mid;
        if (a[mid] < x) lo = mid + 1; else hi = mid - 1;
    }
    return -1;
}
```

### C13. Merge intervals
```csharp
static List<(int s, int e)> Merge(IEnumerable<(int s, int e)> input)
{
    var res = new List<(int s, int e)>();
    foreach (var cur in input.OrderBy(i => i.s))
    {
        if (res.Count > 0 && cur.s <= res[^1].e) res[^1] = (res[^1].s, Math.Max(res[^1].e, cur.e));
        else res.Add(cur);
    }
    return res;
}
```

### C14. Reverse a linked list
```csharp
static Node? Reverse(Node? head)
{
    Node? prev = null;
    while (head is not null) { var next = head.Next; head.Next = prev; prev = head; head = next; }
    return prev;
}
```

### C15. Balanced brackets
```csharp
static bool Balanced(string s)
{
    var st = new Stack<char>();
    foreach (var c in s)
    {
        if ("([{".Contains(c)) st.Push(c);
        else if (")]}".Contains(c))
        {
            if (st.Count == 0) return false;
            var o = st.Pop();
            if (!((o == '(' && c == ')') || (o == '[' && c == ']') || (o == '{' && c == '}'))) return false;
        }
    }
    return st.Count == 0;
}
```

### C16. Dispose pattern for a wrapper over an unmanaged handle
```csharp
public sealed class NativeFile : IDisposable
{
    private readonly SafeFileHandle _h;
    public NativeFile(string path) => _h = File.OpenHandle(path);
    public void Dispose() => _h.Dispose();
}
```
`SafeHandle` makes a finalizer unnecessary in your own class.

### C17. Record with validation and `with`
```csharp
public record Email
{
    public string Value { get; }
    public Email(string value) => Value = value.Contains('@') ? value : throw new ArgumentException("invalid email", nameof(value));
}
```

### C18. Minimal API endpoint with validation (preview of 019)
```csharp
app.MapPost("/users", async (CreateUser dto, AppDb db, CancellationToken ct) =>
{
    var user = new User { Name = dto.Name, Email = dto.Email };
    db.Users.Add(user); await db.SaveChangesAsync(ct);
    return Results.Created($"/users/{user.Id}", user);
});
record CreateUser([Required] string Name, [EmailAddress] string Email);
```

### C19. xUnit test with a fake clock
```csharp
[Fact]
public void ExpiresAfterTtl()
{
    var time = new FakeTimeProvider();
    var cache = new TtlCache<string>(TimeSpan.FromMinutes(1), time);
    cache.Set("k", "v");
    time.Advance(TimeSpan.FromMinutes(2));
    Assert.False(cache.TryGet("k", out _));
}
```
`FakeTimeProvider` comes from `Microsoft.Extensions.TimeProvider.Testing`.

### C20. Read a large file in a streaming way
```csharp
await foreach (var line in File.ReadLinesAsync("big.log", ct))
    if (line.Contains("ERROR")) count++;
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. `NullReferenceException`
Find the null expression (stack trace line, debugger). Enable nullable reference types, validate arguments (`ArgumentNullException.ThrowIfNull`), use `?.` and `??` deliberately, and avoid returning `null` collections.

### D2. Deadlock when calling `.Result` / `.Wait()` on async code
In sync-context apps (WinForms/WPF/legacy ASP.NET) the continuation needs the UI/request context that is blocked. Fix by using `await` all the way; in libraries use `ConfigureAwait(false)`.

### D3. Thread-pool starvation (slow responses, low CPU)
Blocking calls in request threads. Capture counters (`ThreadPool Queue Length`, `Thread Count`), stack dumps showing many threads in `Wait`, then make code async, limit concurrency, and avoid sync-over-async.

### D4. `InvalidOperationException: Collection was modified`
Mutating a collection during enumeration. Iterate over a copy (`ToList()`), use `RemoveAll`, or concurrent collections.

### D5. Memory growth / `OutOfMemoryException`
Take a `dotnet-gcdump`, compare snapshots, find retained objects (event handlers, static caches, `HttpClient` per request, large strings). Also check LOH fragmentation and container memory limits.

### D6. `ObjectDisposedException`
Using an object after disposal (for example a `DbContext` captured in a background task after the request scope ended, or a `HttpClient`/stream closed). Create a new scope for background work (`IServiceScopeFactory`).

### D7. Captive dependency (singleton using scoped service)
Singleton holds a scoped instance forever, causing stale state or errors. DI scope validation (`ValidateScopes`, on in Development) catches it. Inject `IServiceScopeFactory` and resolve inside a scope.

### D8. `HttpClient` socket exhaustion / DNS issues
`new HttpClient()` per call exhausts sockets (`TIME_WAIT`); a static client ignores DNS changes. Use `IHttpClientFactory` or `SocketsHttpHandler` with `PooledConnectionLifetime`.

### D9. Wrong date/time results
`DateTime.Now` vs UTC, `DateTimeKind.Unspecified`, culture-specific parsing. Use `DateTimeOffset`/UTC, `TimeProvider`, `CultureInfo.InvariantCulture`.

### D10. LINQ query runs multiple times or at the wrong time
Deferred execution: enumerating twice repeats work (and DB calls). Materialize with `ToList()` when you need a snapshot; watch closures capturing changing variables.

### D11. EF Core client evaluation or slow queries (details in 019)
Calling non-translatable methods in `Where` throws or forces in-memory filtering; add indexes, use `AsNoTracking`, projections, `Include` carefully, and log SQL.

### D12. `async void` crashes the process
Exceptions in `async void` methods are raised on the synchronization context/thread pool and can crash the app. Use `async Task` except for event handlers, and wrap handlers in try/catch.

### D13. Race conditions with shared state
Intermittent wrong values. Look for non-atomic updates on shared fields, `Dictionary` used concurrently, lazy initialization races. Fix with locks, `Interlocked`, `ConcurrentDictionary`, or immutability.

### D14. `StackOverflowException`
Uncatchable and kills the process. Usually infinite recursion (property getter calling itself, cyclic `ToString`/serialization). Fix the base case or use iteration.

### D15. JSON serialization problems
Cycles (`ReferenceHandler.IgnoreCycles` or fix the model), case differences, missing converters for custom types, `required`/nullability mismatches, trimming/AOT needing source generation.

### D16. Culture-related bugs (decimal separators, sorting)
Use invariant culture for persistence/serialization and `StringComparison.Ordinal`/`OrdinalIgnoreCase` for identifiers. Set globalization invariant mode in containers deliberately (`InvariantGlobalization`).

### D17. Works on dev, fails in container
Case-sensitive file paths, missing ICU libs (alpine), time zones, environment variables, certificates, user permissions, or different SDK versions. Pin versions (`global.json`) and test in the same image.

### D18. Slow startup
Heavy static initialization, reflection-based scanning, large DI graphs, synchronous DB migrations at startup. Use ReadyToRun/tiered PGO, source generators, lazy services, and move migrations to a separate job.

### D19. `TaskCanceledException` / timeouts
Distinguish a caller's cancellation from an `HttpClient` timeout (`ex.InnerException is TimeoutException`). Set explicit timeouts and handle both paths.

### D20. Unobserved exceptions in fire-and-forget tasks
`_ = DoAsync();` loses errors. Use a safe wrapper that logs, or hand work to a `BackgroundService`/queue.

### D21. Debugging method (say this in interviews)
Reproduce → capture evidence (logs, traces, dump, counters) → form a hypothesis → verify with a minimal test → fix the root cause → add regression test and monitoring.


---

# 🧩 Part 8: Tricky Questions

### T1. Does `async` create a new thread?
No. `async` makes the compiler build a state machine. The method runs synchronously until the first `await` that is not already complete; then it returns to the caller, and the continuation runs later (often on a thread-pool thread). I/O-bound awaits use no thread while waiting.

### T2. Does `await` block the thread?
No, it releases the thread. `.Result` and `.Wait()` block the thread.

### T3. `Task.Run` in ASP.NET Core to "make it async"?
It does not help I/O work and moves CPU work to another pool thread, adding overhead. Use real async APIs.

### T4. `string` is a reference type but behaves like a value type. Why?
It is immutable and overloads `==` to compare content, so it feels like a value. Operations return new strings.

### T5. `string.Empty` vs `""` vs `null`
`""` and `string.Empty` are the same empty string (interned). `null` means no string. Use `string.IsNullOrEmpty` / `IsNullOrWhiteSpace`.

### T6. `const` vs `static readonly`
`const` values are inlined into callers at compile time (changing a `const` in a library requires recompiling dependents). `static readonly` is evaluated at runtime and can be reference types. Use `const` only for true constants.

### T7. `struct` copy semantics trap
```csharp
var list = new List<Point> { new(1, 2) };
list[0].X = 5;        // compile error for mutable struct in list: modifies a copy
```
Mutable structs cause confusing bugs. Prefer immutable structs.

### T8. `foreach` modifying the iteration variable
Not allowed. The collection must not be modified during enumeration either (`InvalidOperationException`).

### T9. Why can `lock(this)` or `lock(typeof(T))` be dangerous?
Any code can lock the same object, causing deadlocks. Lock a private readonly object.

### T10. `ConcurrentDictionary.GetOrAdd` calls the factory twice?
Possibly. The factory may run multiple times under contention, but only one result is stored. Use `Lazy<T>` values if the factory must run once.

### T11. Why is `DateTime` comparison tricky?
`DateTime` has a `Kind` (Utc, Local, Unspecified), and comparisons ignore it. Use `DateTimeOffset` or ensure UTC.

### T12. `float`/`double` equality
`0.1 + 0.2 == 0.3` is false. Use `decimal` for money or tolerance comparisons (`Math.Abs(a - b) < eps`).

### T13. `int.MaxValue + 1`
In an unchecked context it wraps to `int.MinValue` silently; constant expressions fail at compile time. Use `checked` when overflow matters.

### T14. `is` vs `as` vs cast
`as` returns `null` on failure (reference/nullable types only), a cast throws `InvalidCastException`, `is` with a pattern (`obj is Foo f`) tests and binds in one step.

### T15. `new` vs `override` on a method
`override` replaces the virtual implementation (polymorphic). `new` hides it, so the called method depends on the reference's compile-time type.

### T16. Static constructors and initialization order
Static field initializers run in textual order before the static constructor; a static constructor runs once, before the first use of the type. Exceptions in it produce `TypeInitializationException`, and the type becomes unusable.

### T17. Are `IEnumerable<T>` queries safe to enumerate twice?
Only if the source is stable and enumeration is cheap. Otherwise you re-run the query and any side effects.

### T18. `Equals` and `GetHashCode` for mutable keys
Changing a key's hashed fields after insertion into a `Dictionary`/`HashSet` makes it unfindable. Use immutable keys or records.

### T19. `async` method returning `Task` with no `await`
It compiles (warning CS1998) and runs synchronously, wrapping the result in a completed task. Remove `async` and return `Task.CompletedTask`/`Task.FromResult`.

### T20. `Task.WhenAll` exception behavior
`await Task.WhenAll(...)` throws only the first exception; others are in `task.Exception.InnerExceptions` on the aggregate task. Keep the combined task reference if you need all errors.

### T21. `ConfigureAwait(false)` in ASP.NET Core
Not needed for app code (no sync context), but harmless; libraries should still use it for consumers on UI frameworks.

### T22. Why do records compare by value but classes by reference?
Records synthesize `Equals/GetHashCode/==` over their properties. Plain classes inherit reference equality unless overridden. Note: record equality is shallow, so collection properties still compare by reference.

### T23. Does `using var` dispose at the end of the method?
At the end of the enclosing scope (block), in reverse order of declaration.

### T24. `ref` locals and returns
You can return references to storage (`ref int Get(ref int[] arr)`), enabling zero-copy access, but the referenced memory must outlive the call (compiler checks this).

### T25. Property vs field serialization
Serializers usually use public properties; public fields are ignored unless `IncludeFields` is set in `System.Text.Json`.

### T26. `nameof` and `typeof`
`nameof(x)` gives the identifier string at compile time (refactor-safe); `typeof(T)` returns a `Type` object.

### T27. `readonly` and mutable objects
`readonly List<int> list` prevents reassigning the field, not mutating the list.

### T28. `default` for different types
`default(int)` is 0, `default(string)` is `null`, `default(DateTime)` is `0001-01-01`, structs get all fields zeroed. For generics `default(T)` depends on `T`.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

| Question | Short answer |
|---|---|
| Language creator? | Anders Hejlsberg (Microsoft) |
| Compiles to? | IL, then JIT/AOT machine code |
| Runtime? | CLR (.NET) |
| Package manager? | NuGet |
| Project file? | `.csproj` (SDK-style) |
| Immutable text type? | `string` |
| Fast string building? | `StringBuilder` |
| Money type? | `decimal` |
| Nullable value type? | `int?` |
| Null-coalescing? | `??` |
| Null-conditional? | `?.` |
| Data carrier type? | `record` |
| Value-type record? | `record struct` |
| Pattern matching expression? | `switch` expression / `is` patterns |
| Lazy sequence? | `yield return` / LINQ |
| Delegate types? | `Func`, `Action`, `Predicate` |
| Async return types? | `Task`, `Task<T>`, `ValueTask<T>` |
| Cancellation type? | `CancellationToken` |
| Producer/consumer? | `Channel<T>` |
| Atomic increment? | `Interlocked.Increment` |
| Mutual exclusion? | `lock` |
| Async lock? | `SemaphoreSlim` |
| Concurrent map? | `ConcurrentDictionary` |
| Allocation-free slice? | `Span<T>` |
| Pooled arrays? | `ArrayPool<T>.Shared` |
| Resource cleanup? | `using` / `IDisposable` |
| HTTP client best practice? | `IHttpClientFactory` |
| Logging abstraction? | `ILogger<T>` |
| DI lifetimes? | Singleton, Scoped, Transient |
| Test framework? | xUnit / NUnit / MSTest |
| Benchmark tool? | BenchmarkDotNet |
| GC generations? | 0, 1, 2 (+ LOH) |
| LOH threshold? | 85,000 bytes |
| Production diagnostics? | `dotnet-counters`, `-trace`, `-dump`, `-gcdump` |
| LTS releases? | .NET 6, 8, 10 (even numbers) |
| Top-level statements since? | C# 9 |
| Primary constructors for classes? | C# 12 |
| Collection expressions? | C# 12 (`[1, 2, 3]`) |
| Raw string literals? | C# 11 (`"""`) |
| Required members? | C# 11 (`required`) |

---

# 🎤 Part 10: Project / Behavioral Questions

> Use **S**ituation, **T**ask, **A**ction, **R**esult. Prepare real numbers.

### B1. Describe a performance problem you solved in .NET.
**Sample (Ritesh Kumar):** *Situation:* Our reporting API took 6 s per request and CPU spiked during peak hours. *Task:* Reduce latency below 800 ms. *Action:* Profiled with `dotnet-trace` and found sync-over-async calls and an N+1 query pattern; converted to async end to end, added `AsNoTracking` projections, cached reference data, and limited concurrency. *Result:* p95 dropped to 620 ms, thread-pool queue length fell to near zero, and we cut instance count by 30%.

### B2. A production incident you handled.
Memory leak from event handlers never unsubscribed: detection (memory alert), mitigation (restart, scale), diagnosis (`dotnet-gcdump` diff), fix (weak events/unsubscribe), tests, alerts, runbook.

### B3. How do you ensure code quality?
Nullable reference types as errors, analyzers, code reviews with a checklist (async, disposal, nullability), unit and integration tests (Testcontainers), CI gates, dependency scanning, and architecture tests.

### B4. A migration you led (.NET Framework → .NET 8, monolith split).
Describe assessment, strangler approach, multi-targeting libraries, side-by-side deployment, test coverage, and measured outcomes (cost, performance, deploy frequency).

### B5. Disagreement about a design.
Present benchmarks and trade-offs, run a spike, write an ADR, and commit to the outcome.

### B6. How do you mentor juniors in C#?
Explain async/await with real bugs, teach LINQ deferred execution, pair on debugging with dumps/traces, and review for disposal, nullability and exception handling.

### B7. How do you stay updated?
Release notes for .NET and C#, the .NET blog, GitHub discussions/proposals (csharplang), conference talks, and small experiments.

---

# 📚 Part 11: Complete Coverage (Language + BCL + Tooling + Mixed)

## Language features
Types (value/reference, nullable), classes, structs, records, enums, interfaces (default members), generics and constraints, delegates and events, lambdas, LINQ, pattern matching, tuples, local functions, extension methods, indexers, operators, partial classes/methods, attributes, async/await, iterators, `ref` features, `Span<T>`, source generators, nullable reference types, primary constructors, collection expressions, raw strings.

## Base class library
`System`, `System.Collections.Generic`, `System.Linq`, `System.Text`, `System.Text.Json`, `System.Text.RegularExpressions`, `System.IO` (+ `Pipelines`), `System.Net.Http`, `System.Threading` (+ `Tasks`, `Channels`), `System.Diagnostics` (+ `Metrics`, `Activity`), `System.Reflection`, `System.Security.Cryptography`, `System.Globalization`, `System.Buffers`, `System.Collections.Concurrent`, `System.Collections.Immutable`, `System.Collections.Frozen`.

## Tooling and ecosystem
- **SDK/CLI:** `dotnet`, MSBuild, NuGet, `global.json`, Central Package Management.
- **IDEs:** Visual Studio, Rider, VS Code.
- **Testing:** xUnit, NUnit, MSTest, Moq/NSubstitute, Testcontainers, Verify, Bogus, BenchmarkDotNet.
- **Frameworks:** ASP.NET Core, Blazor, MAUI, WPF/WinForms, gRPC, SignalR, Orleans, Azure Functions, Worker Services.
- **Data:** EF Core, Dapper, ADO.NET, Npgsql, MongoDB driver, StackExchange.Redis.
- **Messaging:** MassTransit, NServiceBus, Azure Service Bus, RabbitMQ, Kafka (Confluent).
- **Resilience/observability:** Polly, OpenTelemetry, Serilog, Application Insights, Prometheus.
- **Quality/security:** Roslyn analyzers, SonarQube, CodeQL, dotnet list package --vulnerable.

## Mixed topics
OOP and SOLID, async and concurrency, memory and GC, performance, API design, testing, security, cloud deployment, and migration strategies.

---

# 🔬 Part 12: CLR Internals

### I1. Compilation pipeline
C# source → Roslyn → IL + metadata in an assembly (.dll/.exe) → at run time the JIT compiles IL methods on first call (tier-0 quick, then re-JIT hot methods at tier-1 with dynamic PGO) → machine code. ReadyToRun precompiles for startup; Native AOT compiles everything ahead of time.

### I2. Assemblies, metadata, and loading
An assembly contains IL, metadata (types, members), and a manifest. `AssemblyLoadContext` loads assemblies and enables plugin isolation and unloading.

### I3. Type system
Object header (sync block index, method table pointer) precedes fields; value types have no header unless boxed. Virtual calls use method tables; interface calls use virtual stub dispatch with caching. Generics over value types create specialized code per type; reference types share code.

### I4. GC internals
Allocation uses a bump pointer in gen 0 allocation contexts (very fast). Collections mark live objects from roots (stack, statics, handles, finalization queue), then compact or sweep, promoting survivors. Card tables track older-to-younger references. Background GC runs gen 2 concurrently. Pinned objects (`fixed`, interop) can fragment the heap.

### I5. Finalization
Objects with finalizers are registered in the finalization queue; when unreachable they move to the f-reachable queue and the finalizer thread runs `~T`, keeping them alive an extra GC cycle (promotion). `GC.SuppressFinalize` removes the cost after disposal.

### I6. async state machine
The compiler generates a struct/class implementing `IAsyncStateMachine` with fields for locals and a state number. Each `await` stores state, registers a continuation on the awaiter, and returns. `AsyncTaskMethodBuilder` creates the `Task`. Completed awaits take a fast path without allocating continuations.

### I7. ThreadPool
Work-stealing queues per thread and a global queue; hill-climbing algorithm adjusts thread counts; I/O completion handled by the OS (IOCP on Windows, epoll on Linux) and then dispatched to pool threads.

### I8. Exceptions
Two-pass structured exception handling: first pass finds a handler (filters `when` run here), second pass unwinds and runs `finally`. Throwing is expensive (stack trace capture), so avoid exceptions for control flow.

### I9. Span and ref structs
`ref struct` types live only on the stack, enforced by the compiler (cannot be boxed, captured by lambdas, or used across `await`). `Span<T>` is a pointer + length pair into array, stack or native memory.

### I10. Tiered compilation and PGO
Tier-0 code is fast to produce but slower; hot methods get recompiled at tier-1 with profile data (dynamic PGO, on by default in recent versions) enabling guarded devirtualization and better inlining.

---

# 📊 Part 13: Reference Tables

### Collections guide
| Need | Use |
|---|---|
| Ordered, indexed | `List<T>` |
| Fast key lookup | `Dictionary<K,V>` |
| Unique items | `HashSet<T>` |
| Sorted | `SortedDictionary` / `SortedSet` |
| FIFO / LIFO | `Queue<T>` / `Stack<T>` |
| Priority | `PriorityQueue<TElement,TPriority>` |
| Thread-safe map | `ConcurrentDictionary` |
| Async queue | `Channel<T>` |
| Read-only fast lookup | `FrozenDictionary` / `FrozenSet` |
| Immutable snapshot | `ImmutableArray<T>` |

### Async return types
| Type | Use |
|---|---|
| `Task` | Async method without a value |
| `Task<T>` | Async with a value |
| `ValueTask<T>` | Hot path, often synchronous completion |
| `IAsyncEnumerable<T>` | Async streaming |
| `void` | Event handlers only |

### Synchronization primitives
| Primitive | Use |
|---|---|
| `lock` / `Lock` | Short critical sections (sync) |
| `SemaphoreSlim` | Async-compatible limits |
| `Interlocked` | Atomic counters |
| `ReaderWriterLockSlim` | Many readers, rare writers (sync) |
| `Channel<T>` | Message passing |
| `Lazy<T>` | One-time initialization |

### DI lifetimes
| Lifetime | Instances | Typical use |
|---|---|---|
| Singleton | One per app | Stateless services, caches, clients |
| Scoped | One per scope/request | DbContext, unit of work |
| Transient | New each resolve | Lightweight stateless helpers |

### .NET release cadence (verify on dotnet.microsoft.com)
| Release | Notes |
|---|---|
| .NET 6 | LTS (out of support) |
| .NET 8 | LTS (current widely used) |
| .NET 9 | STS (shorter support) |
| .NET 10 | LTS (check release status/date) |


---

# 🔮 Part 14: Output & Prediction Questions

### O1. Closure in a `for` loop
```csharp
var actions = new List<Action>();
for (int i = 0; i < 3; i++) actions.Add(() => Console.Write(i));
foreach (var a in actions) a();
```
**Output:** `333`. The lambda captures the single loop variable. With `foreach (var x in ...)` each iteration has its own variable.

### O2. `foreach` capture
```csharp
var actions = new List<Action>();
foreach (var i in new[] { 0, 1, 2 }) actions.Add(() => Console.Write(i));
foreach (var a in actions) a();
```
**Output:** `012`.

### O3. String immutability
```csharp
string s = "abc";
s.ToUpper();
Console.WriteLine(s);
```
**Output:** `abc`. `ToUpper` returns a new string.

### O4. Reference vs value semantics
```csharp
class C { public int V; } struct S { public int V; }
var c1 = new C { V = 1 }; var c2 = c1; c2.V = 2;
var s1 = new S { V = 1 }; var s2 = s1; s2.V = 2;
Console.WriteLine($"{c1.V} {s1.V}");
```
**Output:** `2 1`.

### O5. Deferred execution
```csharp
var list = new List<int> { 1, 2, 3 };
var q = list.Where(x => x > 1);
list.Add(4);
Console.WriteLine(string.Join(",", q));
```
**Output:** `2,3,4`. The query runs at enumeration time.

### O6. Async ordering
```csharp
async Task Main()
{
    Console.Write("A");
    var t = Work();
    Console.Write("B");
    await t;
    Console.Write("D");
}
async Task Work() { Console.Write("1"); await Task.Delay(10); Console.Write("C"); }
```
**Output:** `A1BCD`. `Work` runs synchronously until its first incomplete `await`.

### O7. `finally` and return
```csharp
static int F() { try { return 1; } finally { Console.Write("F"); } }
Console.Write(F());
```
**Output:** `F1`.

### O8. Integer division and casting
```csharp
Console.WriteLine(7 / 2 + " " + 7 / 2.0 + " " + (double)7 / 2 + " " + -7 % 3);
```
**Output:** `3 3.5 3.5 -1`.

### O9. Floating point
```csharp
Console.WriteLine(0.1 + 0.2 == 0.3);
Console.WriteLine(0.1m + 0.2m == 0.3m);
```
**Output:** `False` then `True`.

### O10. Boxing identity
```csharp
object a = 5, b = 5;
Console.WriteLine(a == b);
Console.WriteLine(a.Equals(b));
```
**Output:** `False` (different boxes, reference comparison) then `True`.

### O11. String interning
```csharp
string a = "hi", b = "hi", c = new string("hi".ToCharArray());
Console.WriteLine($"{(object)a == b} {(object)a == c} {a == c}");
```
**Output:** `True False True`.

### O12. Nullable arithmetic
```csharp
int? a = null;
Console.WriteLine((a + 1) ?? -1);
```
**Output:** `-1` (arithmetic with null gives null).

### O13. Record equality
```csharp
record P(int X, int Y);
Console.WriteLine(new P(1, 2) == new P(1, 2));
Console.WriteLine(new P(1, 2));
```
**Output:** `True` then `P { X = 1, Y = 2 }`.

### O14. Property setter and `init`
```csharp
class U { public string Name { get; init; } = ""; }
var u = new U { Name = "Ritesh Kumar" };
u.Name = "x";   // compile error
```
**Result:** Compile error CS8852: `init`-only properties can only be assigned during initialization.

### O15. Switch expression
```csharp
int n = 15;
var r = n switch { < 10 => "S", < 100 => "M", _ => "L" };
Console.WriteLine(r);
```
**Output:** `M`.

### O16. `Task.WhenAll` exceptions
```csharp
var t1 = Task.FromException(new InvalidOperationException("a"));
var t2 = Task.FromException(new ArgumentException("b"));
try { await Task.WhenAll(t1, t2); } catch (Exception e) { Console.WriteLine(e.GetType().Name); }
```
**Output:** `InvalidOperationException` (the first). Both are available on the `Task.WhenAll` task's `Exception.InnerExceptions`.

### O17. Static constructor order
```csharp
class A { public static int X = Init("X"); static A() => Console.Write("ctor "); static int Init(string s) { Console.Write(s + " "); return 1; } }
_ = A.X;
```
**Output:** `X ctor `.

### O18. Overload resolution
```csharp
static void M(object o) => Console.Write("obj ");
static void M(string s) => Console.Write("str ");
M(null);
M((object)"x");
```
**Output:** `str obj `.

### O19. `with` expression
```csharp
var p1 = new Person("Ritesh Kumar", 30);
var p2 = p1 with { Age = 31 };
Console.WriteLine($"{p1.Age} {p2.Age} {ReferenceEquals(p1, p2)}");
```
**Output:** `30 31 False`.

### O20. Checked arithmetic
```csharp
int x = int.MaxValue;
Console.WriteLine(unchecked(x + 1));
try { Console.WriteLine(checked(x + 1)); } catch (OverflowException) { Console.WriteLine("overflow"); }
```
**Output:** `-2147483648` then `overflow`.

---

# ✅ Part 15: MCQs

**1.** C# code is first compiled to:
A) Machine code B) IL C) Assembly language D) JavaScript

**2.** Which is a value type?
A) `string` B) `class` C) `struct` D) `delegate`

**3.** Which type is best for money?
A) `float` B) `double` C) `decimal` D) `int` always

**4.** What does `async` do?
A) Creates a new thread B) Enables `await` and compiler state machine C) Makes code parallel D) Disables exceptions

**5.** Which return type is appropriate for event handlers only?
A) `Task` B) `void` C) `ValueTask` D) `Task<T>`

**6.** Which keyword prevents inheritance?
A) `static` B) `sealed` C) `abstract` D) `readonly`

**7.** What does `??` do?
A) Null-conditional access B) Null-coalescing C) Logical OR D) Ternary

**8.** LINQ `Where` is:
A) Immediate B) Deferred C) Parallel D) Blocking

**9.** Which statement disposes automatically?
A) `try` B) `using` C) `lock` D) `fixed`

**10.** `record` types provide by default:
A) Mutable fields B) Value-based equality C) Multiple inheritance D) Unsafe code

**11.** `Span<T>` can be stored in:
A) Class fields B) Local variables of `ref struct` context C) Async method locals across `await` D) Boxed object

**12.** Which should be used for async mutual exclusion?
A) `lock` B) `SemaphoreSlim` C) `Monitor.Enter` D) `Thread.Sleep`

**13.** What is the LOH threshold?
A) 8,500 bytes B) 85,000 bytes C) 850,000 bytes D) 1 MB

**14.** Which DI lifetime creates one instance per HTTP request?
A) Singleton B) Scoped C) Transient D) Static

**15.** `HttpClient` should be:
A) Created per request B) Obtained via `IHttpClientFactory` or reused with proper handler settings C) Disposed immediately each time D) Static with no timeouts

**16.** Which releases are LTS?
A) .NET 7 B) .NET 8 C) .NET 9 D) .NET 5

**17.** `Task.WhenAll` is used to:
A) Run tasks sequentially B) Await multiple tasks concurrently C) Cancel tasks D) Create threads

**18.** What does `ConfigureAwait(false)` do?
A) Runs on a new thread B) Does not capture the synchronization context C) Cancels the task D) Makes it synchronous

**19.** Which is a good approach to avoid `NullReferenceException` at compile time?
A) Nullable reference types B) `try/catch` everywhere C) `dynamic` D) `goto`

**20.** `init` accessors allow setting a property:
A) Anytime B) Only during object initialization C) Only in static constructors D) Never

**21.** `IEnumerable<T>` vs `IQueryable<T>`: which translates to SQL?
A) `IEnumerable<T>` B) `IQueryable<T>` C) Both D) Neither

**22.** Which pattern solves async producer/consumer?
A) `Channel<T>` B) `Thread.Abort` C) `lock(this)` D) `Task.Run` loop

**23.** Which exception type is thrown when accessing a disposed object?
A) `ObjectDisposedException` B) `NullReferenceException` C) `IOException` D) `FormatException`

**24.** Boxing occurs when:
A) A value type is converted to `object` B) A class is created C) A string is concatenated D) A task completes

**25.** What does `yield return` create?
A) A thread B) A lazy iterator state machine C) A lock D) A delegate

**26.** Which is preferable for time in tests?
A) `DateTime.Now` B) `TimeProvider` C) `Thread.Sleep` D) Static clock field

**27.** What is thread-pool starvation caused by?
A) Too much async B) Blocking threads (sync over async) C) Small objects D) Records

**28.** `ValueTask<T>` should be:
A) Awaited multiple times B) Awaited once C) Always preferred over `Task` D) Used for `void`

**29.** Which attribute marks flags enums?
A) `[Flags]` B) `[Bits]` C) `[Mask]` D) `[Enum]`

**30.** Which tool captures a managed heap dump summary?
A) `dotnet-gcdump` B) `dotnet-watch` C) `dotnet-format` D) `dotnet-new`

**31.** What does `static` lambda prevent?
A) Compilation B) Capturing outer variables C) Async D) Recursion

**32.** Which collection is thread-safe for concurrent adds/updates?
A) `List<T>` B) `Dictionary<K,V>` C) `ConcurrentDictionary<K,V>` D) `Stack<T>`

**33.** Source generators help by:
A) Slowing builds B) Generating code at compile time, avoiding reflection C) Running at runtime only D) Replacing the GC

**34.** Preferred way to compare strings for identifiers:
A) `==` with culture B) `StringComparison.Ordinal`/`OrdinalIgnoreCase` C) `ToLower()` D) `Contains`

**35.** Which feature is C# 12?
A) Top-level statements B) Primary constructors for classes C) Records D) `async` streams

**36.** Which is true about `struct` equality default?
A) Reference equality B) Value-based via reflection (slow) unless overridden C) Not allowed D) Always by hash

**37.** `GC.Collect()` in production code is:
A) Recommended regularly B) Almost never appropriate C) Required for disposal D) Needed after every request

**38.** Which pattern avoids dual-write inconsistency?
A) Transactional outbox B) Static caches C) Thread.Sleep D) Global locks

**39.** `Parallel.ForEachAsync` is for:
A) CPU only B) Bounded concurrent async work C) UI threads D) Replacing `Task`

**40.** What does `dotnet publish -c Release` produce?
A) Debug build B) Release build output ready to deploy C) Package for NuGet D) Test report

### Answer key
1-B, 2-C, 3-C, 4-B, 5-B, 6-B, 7-B, 8-B, 9-B, 10-B, 11-B, 12-B, 13-B, 14-B, 15-B, 16-B, 17-B, 18-B, 19-A, 20-B, 21-B, 22-A, 23-A, 24-A, 25-B, 26-B, 27-B, 28-B, 29-A, 30-A, 31-B, 32-C, 33-B, 34-B, 35-B, 36-B, 37-B, 38-A, 39-B, 40-B

---

# ⚠️ Part 16: Common Mistakes

> Each mistake has four parts: ❌ wrong code, 🤔 why it is a problem, ✅ correct code, 💬 what to say in an interview.

### Mistake 1: Blocking on async code
❌
```csharp
var user = GetUserAsync(id).Result;
```
🤔 Blocks a thread, can deadlock in sync-context apps, and starves the thread pool under load.
✅
```csharp
var user = await GetUserAsync(id);
```
💬 "Async all the way; I never block on tasks."

### Mistake 2: `async void`
❌
```csharp
public async void Save() { await repo.SaveAsync(); }
```
🤔 Callers cannot await it and exceptions crash the process.
✅
```csharp
public async Task SaveAsync() { await repo.SaveAsync(); }
```
💬 "`async void` is for event handlers only."

### Mistake 3: New `HttpClient` per request
❌
```csharp
using var client = new HttpClient();
```
🤔 Exhausts sockets under load.
✅
```csharp
builder.Services.AddHttpClient<ApiClient>().AddStandardResilienceHandler();
```
💬 "`IHttpClientFactory` handles pooling, DNS refresh and resilience."

### Mistake 4: Swallowing exceptions or `throw ex;`
❌
```csharp
catch (Exception ex) { throw ex; }
```
🤔 `throw ex;` resets the stack trace.
✅
```csharp
catch (Exception) { log.LogError("failed"); throw; }
```
💬 "Use `throw;` to preserve the stack; catch specific exceptions."

### Mistake 5: Not disposing resources
❌
```csharp
var conn = new SqlConnection(cs); conn.Open();
```
🤔 Connections leak.
✅
```csharp
await using var conn = new SqlConnection(cs); await conn.OpenAsync(ct);
```
💬 "`using` guarantees disposal, even on exceptions."

### Mistake 6: Enumerating a query multiple times
❌
```csharp
var q = db.Users.Where(u => u.Active);
if (q.Any()) foreach (var u in q) { }
```
🤔 Runs two database queries.
✅
```csharp
var users = await db.Users.Where(u => u.Active).ToListAsync(ct);
if (users.Count > 0) foreach (var u in users) { }
```
💬 "I materialize once when I need a snapshot."

### Mistake 7: Ignoring `CancellationToken`
❌
```csharp
public async Task<Data> GetAsync() => await http.GetFromJsonAsync<Data>(url);
```
🤔 Work continues after the client disconnects; shutdown is slow.
✅
```csharp
public Task<Data?> GetAsync(CancellationToken ct) => http.GetFromJsonAsync<Data>(url, ct);
```
💬 "Cancellation flows through every async call."

### Mistake 8: Comparing strings culture-sensitively
❌
```csharp
if (a.ToLower() == b.ToLower()) { }
```
🤔 Allocates and breaks in some cultures (Turkish I).
✅
```csharp
if (string.Equals(a, b, StringComparison.OrdinalIgnoreCase)) { }
```
💬 "Ordinal comparisons for identifiers and keys."

### Mistake 9: `DateTime.Now` and local times in storage
❌
```csharp
entity.CreatedAt = DateTime.Now;
```
🤔 Time zone and DST bugs; untestable.
✅
```csharp
entity.CreatedAt = timeProvider.GetUtcNow();
```
💬 "Store UTC and inject `TimeProvider`."

### Mistake 10: Mutable shared state without synchronization
❌
```csharp
static int _count; void Hit() => _count++;
```
🤔 Lost updates under concurrency.
✅
```csharp
static int _count; void Hit() => Interlocked.Increment(ref _count);
```
💬 "Prefer immutability, then `Interlocked`, concurrent collections, or locks."

### Mistake 11: Captive dependencies
❌
```csharp
services.AddSingleton<ReportService>();   // depends on scoped DbContext
```
🤔 The singleton keeps one `DbContext` forever, which is not thread-safe.
✅
```csharp
class ReportService(IServiceScopeFactory f) { /* create a scope per operation */ }
```
💬 "Lifetimes must flow from long to short; I enable scope validation."

### Mistake 12: Using `dynamic`/reflection when generics suffice
❌
```csharp
dynamic x = GetThing(); x.DoIt();
```
🤔 Loses compile-time safety and speed.
✅
```csharp
IThing x = GetThing(); x.DoIt();
```
💬 "I use static typing, generics and interfaces."

### Mistake 13: String concatenation in loops
❌
```csharp
string s = ""; foreach (var p in parts) s += p;
```
🤔 O(n²) allocations.
✅
```csharp
var sb = new StringBuilder(); foreach (var p in parts) sb.Append(p);  // or string.Join
```
💬 "`StringBuilder` or `string.Join`."

### Mistake 14: Returning `IQueryable` from repositories everywhere
❌
```csharp
public IQueryable<User> Users() => db.Users;
```
🤔 Leaks persistence concerns, causes surprising queries and lifetime errors.
✅
```csharp
public Task<IReadOnlyList<UserDto>> GetActiveAsync(CancellationToken ct) => ...;
```
💬 "Expose intent-revealing methods that return materialized results."

### Mistake 15: Fire-and-forget without error handling
❌
```csharp
_ = SendEmailAsync(user);
```
🤔 Exceptions vanish and the work can be cut off during shutdown.
✅
```csharp
await queue.EnqueueAsync(new SendEmail(user.Id));   // processed by a BackgroundService
```
💬 "Background work goes through a queue or hosted service."

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

### Signal table 1: Answer quality
| Topic | Weak answer | Strong answer |
|---|---|---|
| "How does async/await work?" | "It runs on another thread." | "The compiler builds a state machine; `await` releases the thread and schedules a continuation when the awaited operation completes; I/O waits use no thread." |
| "Class vs struct?" | "Struct is faster." | "Structs are value types with copy semantics, good for small immutable data; large or mutable structs cause copying and bugs; I measure before choosing." |
| "How do you find a memory leak?" | "Restart the app." | "Capture gcdumps over time, diff retained objects, check event handlers, static caches and HttpClient usage, then fix and add monitoring." |
| "What's deferred execution?" | "LINQ is lazy." | "Queries run at enumeration; multiple enumeration repeats work; materialize when I need a stable snapshot; IQueryable translates to SQL." |
| "How do you scale a .NET API?" | "Add servers." | "Async I/O, stateless services, caching, bounded concurrency, DB tuning, observability, and measured autoscaling." |

### Signal table 2: Behaviors that stand out
| Weak behavior | Strong behavior |
|---|---|
| Uses `.Result` and `Task.Run` freely | Understands thread-pool starvation and uses real async |
| Treats exceptions as flow control | Uses `TryXxx`/result types for expected failures |
| Ignores nullability warnings | Treats nullable warnings as errors |
| Guesses at performance | Uses BenchmarkDotNet and traces |
| Hard-codes dependencies | Uses DI with correct lifetimes and tests |

### Signal table 3: Phrases that show depth
- "`async` is about not blocking threads, not about creating them."
- "Allocation rate drives GC cost, so I look at allocations before tuning the GC."
- "I use `IHttpClientFactory` with a resilience handler and timeouts."
- "Lifetimes must flow from long-lived to short-lived services."
- "Immutable records for data, behavior in services or aggregates."
- "Multi-target libraries; move LTS to LTS."

### Signal table 4: Questions to ask the interviewer
- Which .NET version and hosting model do you run (containers, App Service, Kubernetes)?
- How do you handle observability and incident response?
- How do you manage dependency updates and license risk?
- What are your testing and release practices?

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### 1. The 30-second explanation
C# is a modern, statically typed language on .NET: Roslyn compiles to IL, the CLR JIT-compiles it, and a generational GC manages memory. It has first-class async/await, LINQ, generics with reified types, pattern matching, records, and strong tooling. It runs cross-platform and powers web APIs, cloud services, desktop and games.

### 2. Mental models
- Value types copy; reference types share.
- `await` releases the thread; blocking calls hold it.
- LINQ is lazy until enumerated.
- `IDisposable` + `using` for deterministic cleanup; GC for memory.
- DI lifetimes flow long → short.

### 3. Async cheat table
| Do | Don't |
|---|---|
| `await` everything, pass `CancellationToken` | `.Result`, `.Wait()` |
| `Task.WhenAll` for parallel I/O | `Task.Run` around I/O |
| `async Task` | `async void` (except events) |
| `ValueTask` after measuring | Await a `ValueTask` twice |
| Bound concurrency (`SemaphoreSlim`, `Parallel.ForEachAsync`) | Unbounded `Task.WhenAll` over thousands |

### 4. Production checklist
- [ ] Supported LTS SDK pinned in `global.json`
- [ ] Nullable reference types enabled; analyzers; warnings as errors
- [ ] `IHttpClientFactory` with resilience and timeouts
- [ ] Async end to end; cancellation tokens
- [ ] Structured logging, metrics, traces (OpenTelemetry)
- [ ] Options validated at startup; secrets in a vault
- [ ] Health checks and graceful shutdown
- [ ] Parameterized data access; no `BinaryFormatter`
- [ ] Tests: unit, integration (Testcontainers), load
- [ ] Dependency scanning and update automation

### 5. Debug toolbox
| Symptom | Tool |
|---|---|
| High CPU | `dotnet-trace`, PerfView |
| Memory growth | `dotnet-gcdump`, `dotnet-dump`, dotMemory |
| Hang | `dotnet-dump` + `clrstack` |
| Slow requests | OpenTelemetry traces |
| Thread-pool issues | `dotnet-counters` |

### 6. Top 20 one-liners to memorize
1. `async` ≠ new thread.
2. Never block on tasks.
3. `async void` only for event handlers.
4. `using` everything disposable.
5. Strings are immutable; use `StringBuilder` in loops.
6. `decimal` for money.
7. Records for value-like data.
8. Enable nullable reference types.
9. LINQ is deferred.
10. `IHttpClientFactory`, not `new HttpClient()`.
11. `TimeProvider` and UTC.
12. `ConfigureAwait(false)` in libraries.
13. Singleton must not capture scoped services.
14. `throw;` not `throw ex;`.
15. Ordinal string comparison for keys.
16. `Span<T>` for allocation-free slicing.
17. Measure with BenchmarkDotNet and traces.
18. Channels for async producer/consumer.
19. Don't call `GC.Collect()`.
20. Move LTS to LTS and automate upgrades.

### 7. The 60-second answer: "Why C#/.NET?"
"C# is a productive, strongly typed language with excellent tooling, great async support, and a fast, cross-platform runtime. Modern features like records, pattern matching and nullable reference types reduce bugs, while the .NET ecosystem (ASP.NET Core, EF Core, Azure integration) is mature and well supported. I focus on async correctness, DI lifetimes, observability and measured performance."

### 8. Final revision order
Types and memory (value vs reference, GC) → OOP and records → LINQ and collections → async and concurrency → exceptions and disposal → performance (spans, allocations) → DI/configuration/logging → testing, security and debugging stories.

