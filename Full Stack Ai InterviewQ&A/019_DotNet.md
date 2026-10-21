# .NET Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **.NET 8 (LTS) and .NET 9, with notes on .NET 10 (LTS)**, covering ASP.NET Core, Entity Framework Core, the generic host, configuration, security, hosting and operations. Newer-version details are marked "verify in the official docs (learn.microsoft.com)". Examples use the sample name **Ritesh Kumar**.
> The C# language itself (async, LINQ, memory, GC, records) is in file 018. This file covers the platform: web APIs, data access, middleware, DI, auth, real-time, messaging integration, deployment and production practice.

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
- [Part 11: Complete Coverage (Platform + Libraries + Tooling + Mixed)](#-part-11-complete-coverage-platform--libraries--tooling--mixed)
- [Part 12: ASP.NET Core Internals](#-part-12-aspnet-core-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is .NET?
A free, open-source, cross-platform developer platform for building web, cloud, desktop, mobile, games, IoT and AI applications. It includes the runtime (CLR), base class libraries, the SDK/CLI, and frameworks such as ASP.NET Core, EF Core, Blazor, MAUI and WPF.

### Q2. What is ASP.NET Core?
A cross-platform, high-performance framework for building web apps, REST APIs, real-time apps and microservices. It runs on Kestrel, has built-in dependency injection, configuration, logging, a middleware pipeline and first-class async support.
```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
app.MapGet("/", () => "Hello, Ritesh Kumar");
app.Run();
```

### Q3. ASP.NET Core vs ASP.NET (Framework)
ASP.NET Framework is Windows-only, tied to IIS and `System.Web`. ASP.NET Core is cross-platform, modular, much faster, and uses a lightweight pipeline. New projects should use ASP.NET Core.

### Q4. Minimal APIs vs controllers *(Must-know)*
| | Minimal APIs | Controllers (MVC / Web API) |
|---|---|---|
| Style | Lambdas / handlers mapped to routes | Classes with action methods and attributes |
| Boilerplate | Very low | More structure |
| Features | Filters, validation via filters/libraries, OpenAPI | Model binding, filters, conventions, `[ApiController]` behaviors |
| Best for | Small/medium APIs, microservices | Large apps needing conventions and rich filters |
Both run on the same pipeline and can be mixed.

### Q5. A simple controller
```csharp
[ApiController]
[Route("api/[controller]")]
public class UsersController(IUserService users) : ControllerBase
{
    [HttpGet("{id:int}")]
    public async Task<ActionResult<UserDto>> Get(int id, CancellationToken ct)
        => await users.GetAsync(id, ct) is { } u ? Ok(u) : NotFound();

    [HttpPost]
    public async Task<ActionResult<UserDto>> Create(CreateUser req, CancellationToken ct)
    {
        var u = await users.CreateAsync(req, ct);
        return CreatedAtAction(nameof(Get), new { id = u.Id }, u);
    }
}
```
`[ApiController]` adds automatic model validation (400), binding source inference and problem-details responses.

### Q6. What is the middleware pipeline? *(Must-know)*
A chain of components that handle requests and responses. Each middleware can run code before and after calling the next one, or short-circuit. Order matters.
```csharp
app.UseExceptionHandler("/error");
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
```
Custom middleware:
```csharp
app.Use(async (ctx, next) => { var sw = Stopwatch.StartNew(); await next(ctx); log.LogInformation("{Path} took {Ms} ms", ctx.Request.Path, sw.ElapsedMilliseconds); });
```

### Q7. What is Kestrel?
The default cross-platform web server for ASP.NET Core (HTTP/1.1, HTTP/2, HTTP/3). Often placed behind a reverse proxy (Nginx, YARP, IIS, Azure Front Door, a cloud load balancer) for TLS, routing and protection, though it can be edge-facing when configured securely.

### Q8. What is dependency injection in ASP.NET Core? *(Must-know)*
A built-in container. Register services, then receive them via constructors.
```csharp
builder.Services.AddSingleton<IClock, SystemClock>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddTransient<IEmailBuilder, EmailBuilder>();
```
Lifetimes: **Singleton** (one per app), **Scoped** (one per request), **Transient** (new every time). Avoid resolving services via `IServiceProvider` directly (service locator).

### Q9. Configuration system
Layered providers: `appsettings.json`, `appsettings.{Environment}.json`, environment variables, command-line args, User Secrets (development), Azure Key Vault. Later providers override earlier ones.
```csharp
var cs = builder.Configuration.GetConnectionString("Default");
builder.Services.Configure<MailOptions>(builder.Configuration.GetSection("Mail"));
```

### Q10. Environments
`ASPNETCORE_ENVIRONMENT` / `DOTNET_ENVIRONMENT` = `Development`, `Staging`, `Production`. Use `app.Environment.IsDevelopment()` to enable developer pages, Swagger, detailed errors only in development.

### Q11. Routing
Attribute routing (`[HttpGet("users/{id:int}")]`) and endpoint routing with minimal APIs (`app.MapGet`). Route constraints: `int`, `guid`, `min(1)`, `regex`. Route groups: `app.MapGroup("/api/v1")`.

### Q12. Model binding and validation
Binds from route, query, headers, body (JSON), form. Validation with Data Annotations (`[Required]`, `[Range]`, `[EmailAddress]`), FluentValidation, or `IValidatableObject`. With `[ApiController]` invalid models return 400 `ValidationProblemDetails` automatically.

### Q13. Return types and status codes
`IActionResult`, `ActionResult<T>`, `Results.Ok()`, `Results.Created()`, `Results.NotFound()`, `Results.Problem()`, `TypedResults` (typed, better for OpenAPI). Use 201 for creation, 204 for no body, 400/422 for validation, 401/403 for auth, 404, 409, 429.

### Q14. What is Entity Framework Core?
An object-relational mapper (ORM) that maps C# classes to database tables and translates LINQ to SQL. Supports SQL Server, PostgreSQL, MySQL, SQLite, Cosmos DB and more.
```csharp
public class AppDb(DbContextOptions<AppDb> o) : DbContext(o)
{
    public DbSet<User> Users => Set<User>();
}
builder.Services.AddDbContext<AppDb>(o => o.UseNpgsql(cs));
```

### Q15. EF Core basics: CRUD
```csharp
db.Users.Add(new User { Name = "Ritesh Kumar" });
await db.SaveChangesAsync(ct);
var user = await db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id, ct);
user.Name = "New";                       // tracked entity: change detected
await db.SaveChangesAsync(ct);
db.Users.Remove(user);
```

### Q16. Migrations
```bash
dotnet ef migrations add AddUsers
dotnet ef database update
dotnet ef migrations script --idempotent -o deploy.sql
```
In production prefer generated SQL scripts or a migration bundle run as a deploy step, not `Database.Migrate()` at app startup in every instance.

### Q17. Tracking vs no-tracking
Tracking queries record entities in the change tracker (needed to update them). `AsNoTracking()` is faster and lighter for read-only queries.

### Q18. Loading related data
Eager (`Include`), explicit (`Entry(x).Collection(...).LoadAsync()`), lazy (proxies, usually avoided). Prefer projections (`Select`) to fetch only needed columns.

### Q19. Appsettings and secrets
Never commit secrets. Use User Secrets locally (`dotnet user-secrets set`), environment variables or a vault (Azure Key Vault, AWS Secrets Manager) in production.

### Q20. Logging in ASP.NET Core
`ILogger<T>` with structured templates. Configure levels in `appsettings.json`. Use Serilog or OpenTelemetry for sinks and structure.

### Q21. Swagger / OpenAPI
.NET 9 includes built-in OpenAPI document generation (`AddOpenApi()` / `MapOpenApi()`); Swashbuckle or NSwag are alternatives. Use the UI only in non-production environments or protect it.

### Q22. CORS
```csharp
builder.Services.AddCors(o => o.AddPolicy("web", p => p.WithOrigins("https://app.example.com").AllowAnyHeader().AllowAnyMethod().AllowCredentials()));
app.UseCors("web");
```
Allow-list exact origins; no wildcard with credentials.

### Q23. Authentication vs authorization
Authentication identifies the user (cookie, JWT bearer, OIDC). Authorization decides access (roles, policies, claims). Order in the pipeline: `UseAuthentication()` then `UseAuthorization()`.

### Q24. JWT bearer authentication
```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(o =>
{
    o.Authority = "https://login.example.com/";
    o.Audience = "orders-api";
});
builder.Services.AddAuthorization();
app.MapGet("/me", (ClaimsPrincipal u) => u.Identity!.Name).RequireAuthorization();
```
Validate issuer, audience, lifetime and signature (configured by the authority).

### Q25. Policy-based authorization
```csharp
builder.Services.AddAuthorizationBuilder()
    .AddPolicy("AdminOnly", p => p.RequireRole("Admin"))
    .AddPolicy("CanEdit", p => p.RequireClaim("scope", "orders.write"));
[Authorize(Policy = "CanEdit")]
```
Resource-based authorization uses `IAuthorizationService` with the resource (ownership checks).

### Q26. Health checks
```csharp
builder.Services.AddHealthChecks().AddNpgSql(cs).AddRedis(redisCs);
app.MapHealthChecks("/health/live", new() { Predicate = _ => false });
app.MapHealthChecks("/health/ready");
```
Liveness (process is up) vs readiness (dependencies ready).

### Q27. Static files, `wwwroot`, and SPA hosting
`UseStaticFiles()` serves `wwwroot`. For SPAs serve build output and use fallback routing (`MapFallbackToFile("index.html")`) after API routes.

### Q28. Error handling basics
`UseExceptionHandler` + `ProblemDetails` for APIs; `IExceptionHandler` (.NET 8) for custom handling; `UseStatusCodePages`. Do not expose stack traces in production.
```csharp
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
app.UseExceptionHandler();
```

### Q29. Dotnet CLI essentials
`dotnet new webapi`, `dotnet run`, `dotnet watch`, `dotnet build`, `dotnet test`, `dotnet publish -c Release -o out`, `dotnet ef ...`, `dotnet add package`.

### Q30. Blazor in one minute
Component-based UI in C#. Modes: Static SSR, Interactive Server (SignalR), Interactive WebAssembly (runs in the browser), and Interactive Auto (.NET 8). Choose based on latency, offline needs and server load.

### Q31. SignalR
Real-time communication (WebSockets with fallbacks). Hubs push messages to clients; scale out with a backplane (Redis) or Azure SignalR Service.
```csharp
public class ChatHub : Hub { public Task Send(string user, string msg) => Clients.All.SendAsync("Receive", user, msg); }
app.MapHub<ChatHub>("/chat");
```

### Q32. gRPC
High-performance RPC over HTTP/2 with Protobuf contracts. Great for internal service-to-service calls, streaming, and strongly typed clients. Browsers need gRPC-Web.

### Q33. Background services
`BackgroundService` for long-running tasks, `IHostedService` for startup/shutdown hooks. Use queues or Hangfire/Quartz for durable jobs.

### Q34. Docker for .NET
```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish -c Release -o /app
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .
USER app
ENTRYPOINT ["dotnet", "MyApi.dll"]
```
Use the non-root `app` user (.NET 8 images), multi-stage builds, and chiseled/distroless images for smaller attack surface.

### Q35. Hosting options
Containers (Kubernetes, Azure Container Apps, ECS), Azure App Service, AWS Elastic Beanstalk/Lambda, Windows IIS, Linux with Nginx/systemd, and serverless (Azure Functions). Choose by team skills, scaling and cost.

---

# 🔵 Part 2: Junior (1–3 years)

### Q36. Request lifecycle in ASP.NET Core *(Must-know)*
Kestrel accepts the connection → creates `HttpContext` → runs the middleware pipeline (exception handling, HTTPS, static files, routing, CORS, auth, rate limiting...) → endpoint routing selects an endpoint → filters run (for MVC/minimal API filters) → model binding and validation → handler executes → result is written (content negotiation / JSON) → response flows back through middleware.

### Q37. Middleware order mistakes
Typical order: exception handler → HSTS/HTTPS redirection → static files → routing → CORS → authentication → authorization → rate limiter → custom → endpoints. Placing `UseAuthorization` before `UseRouting`, or `UseCors` after authorization, causes confusing 401/CORS errors.

### Q38. Middleware vs filters
Middleware runs for all requests in the pipeline. MVC filters (authorization, resource, action, exception, result) run around controller actions and have access to MVC context (model state, action arguments). Minimal APIs support endpoint filters (`AddEndpointFilter`).

### Q39. Dependency injection lifetimes in depth *(Must-know)*
- Singleton: must be thread-safe; cannot depend on scoped services (captive dependency).
- Scoped: per request (or per `IServiceScope`); `DbContext` is scoped.
- Transient: lightweight services.
Background services are singletons, so create scopes via `IServiceScopeFactory` when using scoped services. Enable scope validation in development (`ValidateScopes`/`ValidateOnBuild`).

### Q40. Keyed services and decoration (.NET 8)
```csharp
builder.Services.AddKeyedSingleton<IPayment, StripePayment>("stripe");
class Checkout([FromKeyedServices("stripe")] IPayment payment) { }
```
Decoration of services is done with libraries like Scrutor or manual factories.

### Q41. Options pattern: `IOptions`, `IOptionsSnapshot`, `IOptionsMonitor`
`IOptions<T>`: singleton, read once. `IOptionsSnapshot<T>`: scoped, reloaded per request. `IOptionsMonitor<T>`: singleton with change notifications. Validate at startup:
```csharp
builder.Services.AddOptions<MailOptions>().BindConfiguration("Mail").ValidateDataAnnotations().ValidateOnStart();
```

### Q42. Model validation approaches
Data annotations for simple rules, FluentValidation for complex ones, domain-level invariants in constructors, and database constraints as the last defense. Return `ValidationProblemDetails` (400) with field errors.

### Q43. Problem Details (RFC 9457)
Standard JSON error format: `type`, `title`, `status`, `detail`, `instance`. `AddProblemDetails()` and `Results.Problem()` produce it. Add `traceId` for correlation.

### Q44. EF Core `DbContext` lifetime and thread safety *(Must-know)*
`DbContext` is not thread-safe and is designed as a short-lived unit of work: scoped per request. Never share one across threads or parallel tasks (`Task.WhenAll` on the same context fails). For parallel work create separate contexts via `IDbContextFactory<T>`.

### Q45. Change tracking and `SaveChanges`
The change tracker snapshots entities and detects changes; `SaveChanges` runs a transaction and issues INSERT/UPDATE/DELETE statements. `ExecuteUpdateAsync`/`ExecuteDeleteAsync` (EF 7+) perform set-based updates without loading entities.

### Q46. N+1 and projections
```csharp
var dtos = await db.Orders.Where(o => o.UserId == id)
    .Select(o => new OrderDto(o.Id, o.Total, o.Items.Count))
    .ToListAsync(ct);                              // one SQL query, only needed columns
```
Avoid lazy loading and loops that query per item; use `Include`/`ThenInclude` or projections; `AsSplitQuery()` for large collection includes to avoid cartesian explosion.

### Q47. Concurrency control in EF Core
Optimistic concurrency tokens (`[Timestamp] byte[] RowVersion` or `[ConcurrencyCheck]`). On conflict `DbUpdateConcurrencyException` is thrown; reload and retry, merge, or return 409.

### Q48. Transactions
`SaveChanges` is transactional. For multiple operations use `await using var tx = await db.Database.BeginTransactionAsync(ct)` and `CommitAsync`. Keep transactions short; use execution strategies (retry on transient errors) with `CreateExecutionStrategy()` when explicit transactions are used.

### Q49. Raw SQL and Dapper
`FromSqlInterpolated($"...")` parameterizes values; never concatenate user input into `FromSqlRaw`. Dapper is a micro-ORM that is fast and good for complex reads or reporting alongside EF Core.

### Q50. Indexes, constraints and fluent configuration
```csharp
protected override void OnModelCreating(ModelBuilder b)
{
    b.Entity<User>(e =>
    {
        e.HasIndex(u => u.Email).IsUnique();
        e.Property(u => u.Name).HasMaxLength(100).IsRequired();
        e.HasMany(u => u.Orders).WithOne(o => o.User).HasForeignKey(o => o.UserId);
    });
}
```
Prefer configuration classes (`IEntityTypeConfiguration<T>`).

### Q51. Global query filters (soft delete, multi-tenancy)
```csharp
b.Entity<Order>().HasQueryFilter(o => !o.IsDeleted && o.TenantId == _tenant.Id);
```
Use `IgnoreQueryFilters()` when needed. Test that filters apply everywhere (including raw SQL and bulk operations).

### Q52. Pagination
Offset (`Skip/Take`) is simple but slow for deep pages; use keyset pagination (`Where(x => x.Id > lastId).OrderBy(x => x.Id).Take(n)`) for large tables. Always order deterministically.

### Q53. Caching options
`IMemoryCache` (per instance), `IDistributedCache` (Redis), response caching, **output caching** (.NET 7+), `HybridCache` (.NET 9: L1 memory + L2 distributed with stampede protection). Define expiration and invalidation; avoid caching user-specific data in shared keys.

### Q54. Rate limiting (built in since .NET 7)
```csharp
builder.Services.AddRateLimiter(o => o.AddFixedWindowLimiter("api", l => { l.PermitLimit = 100; l.Window = TimeSpan.FromMinutes(1); }));
app.UseRateLimiter();
app.MapGet("/x", () => "ok").RequireRateLimiting("api");
```
Algorithms: fixed window, sliding window, token bucket, concurrency. For multiple instances use a gateway or distributed limiter.

### Q55. API versioning
`Asp.Versioning` package: URL segment (`/v1/...`), header or query versioning. Keep old versions stable, document deprecations, and avoid breaking changes within a version.

### Q56. File uploads
`IFormFile` with size limits (`[RequestSizeLimit]`, Kestrel limits), stream to storage (Blob/S3) instead of buffering, validate content type by signature, scan for malware, and use random names.

### Q57. HttpClient integration
Use typed clients with `AddHttpClient<T>()`, resilience handlers, timeouts, and cancellation. Use `System.Net.Http.Json` for JSON.

### Q58. Testing ASP.NET Core
Unit tests for services, integration tests with `WebApplicationFactory<Program>`, Testcontainers for real databases, `HttpClient` from the factory.
```csharp
public class ApiTests(WebApplicationFactory<Program> factory) : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact] public async Task Health_ok()
    {
        var res = await factory.CreateClient().GetAsync("/health/live");
        res.EnsureSuccessStatusCode();
    }
}
```
Make `Program` visible with `public partial class Program { }` when using top-level statements.

### Q59. Source-generated logging and JSON
`[LoggerMessage]` and `JsonSerializerContext` reduce allocations and enable AOT/trimming.

### Q60. Localization and time zones
`IStringLocalizer`, `RequestLocalizationMiddleware`. APIs should return UTC and let clients format; accept culture only where needed.

### Q61. Cookies vs tokens for web apps
Server-rendered/BFF apps: secure, HttpOnly, SameSite cookies with antiforgery. SPAs/mobile: OAuth2/OIDC with PKCE, preferably via a BFF to keep tokens out of JavaScript. Avoid storing tokens in `localStorage`.

### Q62. ASP.NET Core Identity
Provides users, roles, password hashing (PBKDF2 with a high iteration count by default), lockout, 2FA, external logins. Customize `IdentityUser`, use token providers, and consider external IdPs (Entra ID, Auth0, Keycloak, Duende) for enterprise needs.

---

# 🟡 Part 3: Mid (3–5 years)

### Q63. Clean architecture / layering in ASP.NET Core *(Architecture)*
Typical projects: `Domain` (entities, value objects, domain events), `Application` (use cases, interfaces, DTOs), `Infrastructure` (EF Core, external services), `Api` (endpoints). Dependencies point inward. Vertical slice architecture is an alternative: organize code by feature with its own handler, validator and data access. Pick the simplest structure that keeps rules testable.

### Q64. CQRS and MediatR
Separate commands (writes) from queries (reads), optionally with different models. MediatR provides in-process request/handler dispatch and pipeline behaviors (validation, logging, transactions). Check current licensing terms; many teams use plain handlers or Wolverine/Mediator source generators instead.

### Q65. Result pattern vs exceptions
Use exceptions for unexpected failures. Use `Result<T>`/`ErrorOr`/`OneOf` for expected business outcomes (validation, not found, conflict) and map them to HTTP responses in one place.

### Q66. Global error handling with `IExceptionHandler`
```csharp
class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> log) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext ctx, Exception ex, CancellationToken ct)
    {
        log.LogError(ex, "Unhandled");
        ctx.Response.StatusCode = ex is NotFoundException ? 404 : 500;
        await ctx.Response.WriteAsJsonAsync(new ProblemDetails { Status = ctx.Response.StatusCode, Title = "An error occurred" }, ct);
        return true;
    }
}
```

### Q67. Minimal API organization at scale
Route groups, endpoint filters, static classes with `MapXxx` extension methods per feature, `TypedResults`, parameter binding from services, and `[AsParameters]` for argument objects.
```csharp
var users = app.MapGroup("/api/users").RequireAuthorization().WithTags("Users");
users.MapGet("/{id:int}", UserEndpoints.Get);
```

### Q68. Endpoint filters (validation example)
```csharp
group.MapPost("/", Create).AddEndpointFilter(async (ctx, next) =>
{
    var dto = ctx.Arguments.OfType<CreateUser>().First();
    var errors = Validate(dto);
    return errors.Count > 0 ? Results.ValidationProblem(errors) : await next(ctx);
});
```

### Q69. Outbox pattern in .NET
Within the same EF Core transaction, save entities and an `OutboxMessage`. A `BackgroundService` publishes pending messages to the broker and marks them processed. Consumers are idempotent (inbox table or natural idempotency). MassTransit and NServiceBus have built-in outbox support.

### Q70. Messaging with MassTransit / Azure Service Bus / RabbitMQ
Consumers, retries with exponential backoff, dead-letter queues, sagas/state machines for long-running workflows, message contracts as shared packages or schema registry, and consumer idempotency. Use correlation IDs and OpenTelemetry context propagation.

### Q71. Distributed caching and cache stampede
Use `HybridCache.GetOrCreateAsync` (single-flight per key), TTL jitter, and sensible serialization. Cache-aside pattern with explicit invalidation on writes or short TTLs.

### Q72. EF Core performance checklist *(Must-know)*
`AsNoTracking` for reads, projections, avoid N+1, indexes matching queries, `AsSplitQuery` for big includes, compiled queries for hot paths, batching (`ExecuteUpdate`, `SaveChanges` batching), avoid `Contains` with huge lists, pooling (`AddDbContextPool`), set command timeouts, and inspect generated SQL (`ToQueryString()`, logging). Measure with real data volumes.

### Q73. Handling migrations in CI/CD
Generate idempotent SQL scripts or bundles (`dotnet ef migrations bundle`), review them, run them as a pipeline step before deploying new code, use expand → migrate → contract for backward compatibility, and avoid long locks (online index creation, batched backfills).

### Q74. Multi-tenancy
Resolve tenant (host, header, claim) in middleware, store in a scoped `ITenantContext`, apply global query filters or row-level security, per-tenant rate limits and cache keys, and optionally separate schemas/databases. Test isolation explicitly.

### Q75. Authentication architecture
Use OIDC with an IdP (Entra ID, Auth0, Keycloak, Duende IdentityServer), JWT bearer validation in APIs, short access tokens, refresh token rotation, `[Authorize]` policies, and a BFF for browser clients. Never roll your own token issuance for production without strong reasons.

### Q76. Securing APIs (checklist) *(Must-know)*
HTTPS + HSTS, JWT validation, policy-based authorization with ownership checks (prevent IDOR), input validation, parameterized queries, CORS allow-list, rate limiting, request size limits, secure headers, secret management, Data Protection key storage in shared persistent store for multi-instance apps, dependency scanning, and security logging/auditing.

### Q77. Data Protection API
Used for cookie encryption, antiforgery tokens and temp data. In multi-instance deployments persist keys to a shared store (Redis/Blob/DB) with encryption at rest; otherwise users get logged out or cookies fail across instances.

### Q78. Antiforgery
Required for cookie-authenticated form posts. Minimal APIs support `AddAntiforgery` and `UseAntiforgery` (.NET 8). Not needed for pure bearer-token APIs.

### Q79. Real-time at scale (SignalR)
Use Redis backplane or Azure SignalR Service, sticky sessions if using long polling/SSE fallbacks, authentication via access tokens, group management, message size limits, and reconnect logic on clients.

### Q80. gRPC details
Define `.proto` contracts, generate clients, use deadlines/cancellation, interceptors for logging/auth, health checking, and load balancing at L7 (HTTP/2 multiplexes, so L4 balancers can pin all calls to one connection).

### Q81. OpenTelemetry in ASP.NET Core
```csharp
builder.Services.AddOpenTelemetry()
    .WithTracing(t => t.AddAspNetCoreInstrumentation().AddHttpClientInstrumentation().AddEntityFrameworkCoreInstrumentation().AddOtlpExporter())
    .WithMetrics(m => m.AddAspNetCoreInstrumentation().AddRuntimeInstrumentation().AddOtlpExporter());
```
Propagate trace context across services, add custom `ActivitySource` spans, and correlate logs with `TraceId`.

### Q82. Performance tuning for APIs
Async I/O, response compression (or at the proxy), output caching, JSON source generation, avoid large allocations, pooled `DbContext`, HTTP/2, keep-alive, connection pool sizing, reduce chatty calls, and profile with `dotnet-trace`. Check thread-pool health with `dotnet-counters`.

### Q83. Kestrel limits and hosting settings
`MaxRequestBodySize`, `MaxConcurrentConnections`, `KeepAliveTimeout`, `RequestHeadersTimeout`, HTTP/2 stream limits. Configure behind proxies using `ForwardedHeaders` middleware with trusted proxies to get the real client IP and scheme.

### Q84. Forwarded headers (proxy awareness)
```csharp
builder.Services.Configure<ForwardedHeadersOptions>(o => { o.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto; o.KnownProxies.Add(IPAddress.Parse("10.0.0.5")); });
app.UseForwardedHeaders();
```
Without it, `Request.Scheme` is `http` behind TLS-terminating proxies, breaking redirects and cookies.

### Q85. Graceful shutdown
`IHostApplicationLifetime`, `HostOptions.ShutdownTimeout`, readiness probes failing on shutdown, finishing in-flight requests, stopping hosted services via `CancellationToken`, and Kubernetes `terminationGracePeriodSeconds` greater than the shutdown timeout.

### Q86. Blazor architecture choices
Server: low payload, needs a persistent connection per user, latency-sensitive. WebAssembly: runs client-side, larger download, offline capable. Auto: starts on server, moves to WASM. Use state containers, authentication state providers, and be careful with scoped service lifetimes (per circuit in Server).

### Q87. Native AOT for web apps
`PublishAot` with minimal APIs gives fast startup and low memory. Requires source-generated JSON, no heavy reflection libraries, and AOT-compatible dependencies (EF Core support is limited: verify current state).

### Q88. .NET Aspire (cloud-native app orchestration)
An opinionated stack for building observable, distributed apps with service discovery, configuration, health checks, telemetry and a local dashboard. Useful for local development orchestration of multiple services and dependencies; verify current naming/packaging in the docs.

### Q89. Azure and cloud integration patterns
Managed identity instead of connection strings, Key Vault for secrets, Service Bus/Event Grid for messaging, Application Insights/OpenTelemetry, App Service/Container Apps/AKS for hosting, and infrastructure as code (Bicep/Terraform). Equivalent patterns exist for AWS and GCP.

### Q90. Testing strategy
Unit tests for domain/application logic, integration tests using `WebApplicationFactory` and Testcontainers, contract tests for APIs and messages, a few end-to-end tests, and load tests (k6/NBomber). Replace time and randomness with injectable abstractions.

### Q91. Code quality tooling
Roslyn analyzers, nullable reference types as errors, `.editorconfig`, `dotnet format`, SonarQube, CodeQL, architecture tests (NetArchTest/ArchUnitNET), and CI quality gates.

### Q92. Upgrades and long-term maintenance
Move LTS to LTS (6 → 8 → 10), use the Upgrade Assistant, read breaking-change lists, update packages (EF Core, Npgsql, Serilog), run full tests, canary deploy, and track support timelines for runtime and base images.


---

# 🟠 Part 4: Senior (5–7 years)

### Q93. Designing a production-grade ASP.NET Core service *(Architecture)*
Layered or vertical-slice structure, `Program.cs` composition root, options validated at startup, async I/O, DI with correct lifetimes, EF Core with disciplined queries, global error handling with `ProblemDetails`, authentication via OIDC/JWT with policy-based authorization, rate limiting, health checks, OpenTelemetry, resilience for outbound calls, caching, graceful shutdown, containerization (non-root, small images), CI/CD with migrations as a separate step, and load tests before launch.

### Q94. Thread-pool starvation in ASP.NET Core
Symptoms: rising latency, low CPU, many requests queued. Causes: sync-over-async (`.Result`, `.Wait()`), synchronous I/O, long CPU work on request threads, blocking locks. Diagnose with `dotnet-counters` (`ThreadPool Queue Length`, `ThreadPool Thread Count`) and `dotnet-dump`/stack dumps. Fix: async end to end, bounded concurrency, offload CPU work to workers or queues, and avoid blocking in filters/middleware.

### Q95. Capacity planning
Estimate with Little's Law (concurrency = throughput × latency). The database connection pool (for example Npgsql `Maximum Pool Size`) is usually the real limit; many instances multiply connections, so use PgBouncer/RDS Proxy. Measure p95/p99 latency, CPU, memory (GC), thread-pool queue, DB pool wait time, and downstream saturation.

### Q96. Resilience and fault tolerance
Timeouts everywhere, retries with exponential backoff and jitter (idempotent calls only), circuit breakers, bulkheads (concurrency limits per dependency), hedging for read calls, fallbacks, and load shedding. Use `Microsoft.Extensions.Http.Resilience` (Polly v8). Propagate cancellation and deadlines.

### Q97. Handling idempotency
Require `Idempotency-Key` for unsafe operations; store key + response hash in a table with a unique constraint; return the stored result for repeats; expire keys. In consumers use an inbox table or version checks.

### Q98. EF Core at scale: advanced techniques
Compiled queries, `DbContext` pooling, `AsNoTracking`/`AsNoTrackingWithIdentityResolution`, bulk operations with `ExecuteUpdate/Delete` or libraries (EFCore.BulkExtensions), read replicas (separate contexts/connection strings), query splitting, value converters, owned types, temporal tables, and keeping `DbContext` small per bounded context.

### Q99. EF Core vs Dapper vs raw ADO.NET
EF Core: productivity, migrations, change tracking, good for aggregates and typical CRUD. Dapper: fast, explicit SQL for reporting and hot paths. ADO.NET: maximum control. Mixing is common: EF Core for writes, Dapper for complex reads.

### Q100. Distributed transactions and consistency
Avoid 2PC/MSDTC. Use sagas (orchestration with MassTransit state machines or choreography), outbox/inbox, compensating actions, idempotency, optimistic concurrency, and clear data ownership per service.

### Q101. API gateway, YARP and BFF
YARP (Yet Another Reverse Proxy) is a configurable .NET reverse proxy for routing, load balancing, health checks, auth and transforms. A BFF (backend for frontend) holds tokens server-side for browser clients and aggregates APIs. Keep business logic out of the gateway.

### Q102. Service-to-service security
mTLS or workload identity (managed identity), JWT with audience checks and scopes, token exchange/OBO for downstream calls, network policies, secrets rotation, and per-call authorization. Do not trust internal networks implicitly.

### Q103. Observability design
Structured logs with `TraceId` and tenant/user IDs (no PII), RED metrics per endpoint, runtime metrics (GC, thread pool, exceptions), distributed traces including EF Core and HttpClient, custom business metrics, SLO dashboards and alerts, and sampling to control costs.

### Q104. Diagnosing production issues in .NET *(Must-know)*
Check health, dashboards and traces first. For CPU: `dotnet-trace`/PerfView. For memory: `dotnet-gcdump` and `dotnet-dump` (`dumpheap -stat`, `gcroot`). For hangs: `dotnet-dump analyze` (`clrstack -all`, `syncblk`). For thread-pool issues: counters. For slow SQL: query logs, `EXPLAIN`, and EF Core `ToQueryString()`. Mitigate first (scale, rollback, feature flag), then root-cause and add regression tests and alerts.

### Q105. Memory in containers
.NET respects cgroup limits: the heap hard limit defaults to 75% of the container limit. Tune with `DOTNET_GCHeapHardLimit`, `DOTNET_GCConserveMemory`, Server vs Workstation GC (`DOTNET_gcServer`). OOM kills (exit code 137) mean total process memory (heap + native + thread stacks) exceeded the limit.

### Q106. Startup performance
ReadyToRun, tiered PGO, trimming, source generators instead of reflection, lazy DI registrations, avoiding heavy work in constructors, moving migrations and warm-ups out of the critical path, and Native AOT where compatible.

### Q107. Large payloads and streaming
Stream request/response bodies (`Request.BodyReader`, `Results.Stream`), `IAsyncEnumerable<T>` for streaming JSON arrays, `System.IO.Pipelines`, and avoid `ReadAsStringAsync` on huge bodies. Configure limits to protect the server.

### Q108. Versioning and backward compatibility
API versioning via URL/header, additive changes, tolerant readers, deprecation windows, contract tests, and schema evolution rules for messages (add optional fields; never reuse IDs/names with new meaning).

### Q109. Feature flags and configuration
`Microsoft.FeatureManagement`, Azure App Configuration, LaunchDarkly/Unleash. Use flags for gradual rollouts and kill switches; clean them up to avoid permanent complexity.

### Q110. Zero-downtime deployments
Rolling/blue-green/canary deployments, readiness probes, graceful shutdown, backward-compatible database migrations (expand → migrate → contract), versioned messages, and health checks that reflect real readiness.

### Q111. Advanced hosting: Kubernetes considerations
Resource requests/limits tuned to the .NET GC, liveness vs readiness vs startup probes, horizontal pod autoscaling on custom metrics, Data Protection keys in shared storage, configuration via ConfigMaps/Secrets, and `preStop` hooks plus longer grace periods for draining.

### Q112. Common senior-level design review points
Sync-over-async, `DbContext` misuse, unbounded concurrency, missing timeouts, chatty service calls, shared mutable state in singletons, secrets in config, absent idempotency, weak authorization (IDOR), leaky abstractions (`IQueryable` out of repositories), and missing observability.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q113. ASP.NET Core vs Spring Boot vs Node (Express/NestJS) vs Go: how do you decide? *(Decision)*
| | ASP.NET Core | Spring Boot | Node (NestJS/Express) | Go |
|---|---|---|---|---|
| Performance | Excellent (top-tier benchmarks) | Very good | Good for I/O | Excellent |
| Productivity | High (tooling, Visual Studio/Rider) | High (huge ecosystem) | High | Medium |
| Ecosystem | Rich, Microsoft-backed | Largest enterprise ecosystem | Largest package count | Smaller, infra-focused |
| Hiring | Large, enterprise/Azure-heavy | Very large | Very large | Growing |
| Best fit | Enterprise APIs, Azure, Windows shops, high-performance services | Complex enterprise domains | Full-stack JS teams | Network/infra services |
Decide by team skills, cloud platform, existing assets, performance and operational requirements.

### Q114. Platform engineering for .NET
Service templates (`dotnet new` templates) with logging, tracing, health checks, auth, error handling, Dockerfile and CI; internal NuGet packages; `Directory.Build.props` standards; a golden-path pipeline with tests, scans and deployment; developer portals; and upgrade automation.

### Q115. Modular monolith vs microservices
Prefer a modular monolith first, with modules exposing contracts and owning their data, enforced by architecture tests. Split into services where independent scaling, ownership, or technology needs justify the costs of distribution (network failure, consistency, observability, versioning, operations).

### Q116. Event-driven architecture
Domain events inside a module; integration events across modules/services via a broker (Azure Service Bus, Kafka, RabbitMQ), outbox/inbox, schema versioning, consumer idempotency, retries and DLQs, replay capabilities, and consumer-lag monitoring.

### Q117. Data architecture
Database per service, OLTP vs analytics separation (CDC to a warehouse), read models/CQRS where useful, polyglot persistence where justified, migration discipline, backup/restore drills, data retention and privacy requirements (GDPR).

### Q118. Security program
Threat modeling, secure SDLC (CodeQL/SAST, dependency scanning, secret scanning), identity strategy (central IdP), least privilege with managed identities, key management and rotation, audit logging, compliance (SOC2/GDPR/PCI), pen tests, and incident response runbooks.

### Q119. Reliability engineering
SLOs and error budgets, resilience patterns, chaos and failure injection, capacity planning and load tests, multi-AZ/region design with RPO/RTO targets, on-call practices, and blameless post-mortems.

### Q120. Cost optimization
Right-size instances and containers, autoscale on meaningful signals, reduce database load with caching and indexing, choose Native AOT/smaller images for bursty workloads, tune telemetry volume and sampling, and track cost per request/tenant.

### Q121. Legacy modernization (ASP.NET Framework / WCF / WebForms)
Strangler fig with YARP routing between old and new apps, migrate shared libraries by multi-targeting, replace WCF with gRPC/CoreWCF, move to EF Core incrementally, extract modules by bounded context, and automate regression testing for safety.

### Q122. API strategy and governance
OpenAPI-first design, consistent error and pagination standards, versioning/deprecation policy, SDK generation, contract testing, an API catalog, rate-limit and quota policies, and developer documentation.

### Q123. Team practices and mentoring
Design reviews, ADRs, code-review checklists (async, DI lifetimes, EF queries, security), pairing on diagnostics (dumps/traces), internal talks, and measurable engineering metrics (DORA).

### Q124. Technical debt and roadmap
Debt register: unsupported runtimes, outdated packages, sync-over-async hot spots, god services, missing tests, slow pipelines, undocumented APIs. Reserve capacity regularly and align with the .NET support calendar and security advisories.

---

# 💻 Part 6: Coding / Machine-Coding Tasks

> Practice from memory. State validation, error handling, security, cancellation and tests.

### C1. Minimal API CRUD with EF Core and validation
```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDb>(o => o.UseNpgsql(builder.Configuration.GetConnectionString("Default")));
builder.Services.AddProblemDetails();
var app = builder.Build();
app.UseExceptionHandler(); app.UseStatusCodePages();

var users = app.MapGroup("/api/users");
users.MapGet("/", async (AppDb db, int page, int size, CancellationToken ct) =>
{
    size = Math.Clamp(size == 0 ? 20 : size, 1, 100); page = Math.Max(page, 1);
    return TypedResults.Ok(await db.Users.AsNoTracking().OrderBy(u => u.Id)
        .Skip((page - 1) * size).Take(size).Select(u => new UserDto(u.Id, u.Name, u.Email)).ToListAsync(ct));
});
users.MapGet("/{id:int}", async Task<Results<Ok<UserDto>, NotFound>> (int id, AppDb db, CancellationToken ct) =>
    await db.Users.AsNoTracking().Where(u => u.Id == id).Select(u => new UserDto(u.Id, u.Name, u.Email)).FirstOrDefaultAsync(ct)
        is { } dto ? TypedResults.Ok(dto) : TypedResults.NotFound());
users.MapPost("/", async (CreateUser req, AppDb db, CancellationToken ct) =>
{
    if (string.IsNullOrWhiteSpace(req.Name) || !req.Email.Contains('@'))
        return Results.ValidationProblem(new Dictionary<string, string[]> { ["name/email"] = ["Invalid input"] });
    if (await db.Users.AnyAsync(u => u.Email == req.Email, ct)) return Results.Conflict(new { error = "Email already exists" });
    var u = new User { Name = req.Name.Trim(), Email = req.Email.Trim() };
    db.Users.Add(u); await db.SaveChangesAsync(ct);
    return Results.Created($"/api/users/{u.Id}", new UserDto(u.Id, u.Name, u.Email));
});
app.Run();

record CreateUser(string Name, string Email);
record UserDto(int Id, string Name, string Email);
```

### C2. JWT bearer auth with policies
```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(o =>
{
    o.Authority = builder.Configuration["Auth:Authority"]; o.Audience = builder.Configuration["Auth:Audience"];
});
builder.Services.AddAuthorizationBuilder().AddPolicy("Admin", p => p.RequireRole("Admin"));
app.UseAuthentication(); app.UseAuthorization();
app.MapDelete("/api/users/{id}", (int id) => Results.NoContent()).RequireAuthorization("Admin");
```

### C3. Custom middleware: correlation ID
```csharp
public class CorrelationMiddleware(RequestDelegate next, ILogger<CorrelationMiddleware> log)
{
    public async Task InvokeAsync(HttpContext ctx)
    {
        var id = ctx.Request.Headers["X-Correlation-Id"].FirstOrDefault() ?? Guid.NewGuid().ToString("N");
        ctx.Response.Headers["X-Correlation-Id"] = id;
        using (log.BeginScope(new Dictionary<string, object> { ["CorrelationId"] = id })) await next(ctx);
    }
}
app.UseMiddleware<CorrelationMiddleware>();
```

### C4. Global exception handler
See Q66. Register with `AddExceptionHandler<GlobalExceptionHandler>()` and `app.UseExceptionHandler()`.

### C5. Typed HttpClient with resilience
```csharp
builder.Services.AddHttpClient<PaymentsClient>(c => { c.BaseAddress = new Uri("https://payments.example.com/"); c.Timeout = TimeSpan.FromSeconds(10); })
    .AddStandardResilienceHandler();
public class PaymentsClient(HttpClient http)
{
    public async Task<ChargeResult?> ChargeAsync(Charge c, CancellationToken ct)
    {
        using var res = await http.PostAsJsonAsync("charges", c, ct);
        res.EnsureSuccessStatusCode();
        return await res.Content.ReadFromJsonAsync<ChargeResult>(ct);
    }
}
```

### C6. Rate limiting by user or IP
```csharp
builder.Services.AddRateLimiter(o =>
{
    o.RejectionStatusCode = 429;
    o.AddPolicy("per-user", ctx => RateLimitPartition.GetTokenBucketLimiter(
        ctx.User.Identity?.Name ?? ctx.Connection.RemoteIpAddress?.ToString() ?? "anon",
        _ => new TokenBucketRateLimiterOptions { TokenLimit = 20, TokensPerPeriod = 10, ReplenishmentPeriod = TimeSpan.FromSeconds(1), QueueLimit = 0 }));
});
```

### C7. Background service consuming a channel
```csharp
public class EmailWorker(Channel<EmailJob> channel, IEmailSender sender, ILogger<EmailWorker> log) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stop)
    {
        await foreach (var job in channel.Reader.ReadAllAsync(stop))
        {
            try { await sender.SendAsync(job, stop); }
            catch (Exception ex) when (ex is not OperationCanceledException) { log.LogError(ex, "Email {Id} failed", job.Id); }
        }
    }
}
builder.Services.AddSingleton(Channel.CreateBounded<EmailJob>(1000));
builder.Services.AddHostedService<EmailWorker>();
```

### C8. Outbox with EF Core (sketch)
```csharp
await using var tx = await db.Database.BeginTransactionAsync(ct);
db.Orders.Add(order);
db.Outbox.Add(new OutboxMessage { Type = nameof(OrderPlaced), Payload = JsonSerializer.Serialize(new OrderPlaced(order.Id)) });
await db.SaveChangesAsync(ct); await tx.CommitAsync(ct);
// A BackgroundService polls Outbox where ProcessedAt == null, publishes, then sets ProcessedAt.
```

### C9. Integration test with `WebApplicationFactory` and Testcontainers
```csharp
public class ApiFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly PostgreSqlContainer _db = new PostgreSqlBuilder().Build();
    public async Task InitializeAsync() => await _db.StartAsync();
    public new async Task DisposeAsync() => await _db.DisposeAsync();
    protected override void ConfigureWebHost(IWebHostBuilder b) =>
        b.ConfigureServices(s => { s.RemoveAll<DbContextOptions<AppDb>>(); s.AddDbContext<AppDb>(o => o.UseNpgsql(_db.GetConnectionString())); });
}
```

### C10. Output caching and HybridCache
```csharp
builder.Services.AddOutputCache(o => o.AddPolicy("short", p => p.Expire(TimeSpan.FromSeconds(30)).SetVaryByQuery("page")));
app.UseOutputCache();
app.MapGet("/products", GetProducts).CacheOutput("short");
// HybridCache (NET 9)
var item = await cache.GetOrCreateAsync($"p:{id}", async ct => await repo.GetAsync(id, ct), cancellationToken: ct);
```

### C11. Health checks with readiness and liveness
See Q26. Tag checks (`tags: ["ready"]`) and map separate endpoints with predicates.

### C12. Dockerfile and Kubernetes probes
See Q34. Probes: `livenessProbe` on `/health/live`, `readinessProbe` on `/health/ready`, `startupProbe` for slow starts.

### C13. Audit logging with EF Core interceptor
```csharp
public class AuditInterceptor(ICurrentUser user, TimeProvider time) : SaveChangesInterceptor
{
    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData e, InterceptionResult<int> r, CancellationToken ct = default)
    {
        foreach (var entry in e.Context!.ChangeTracker.Entries<IAuditable>())
        {
            if (entry.State == EntityState.Added) entry.Entity.CreatedAt = time.GetUtcNow();
            if (entry.State is EntityState.Added or EntityState.Modified) { entry.Entity.UpdatedAt = time.GetUtcNow(); entry.Entity.UpdatedBy = user.Id; }
        }
        return base.SavingChangesAsync(e, r, ct);
    }
}
```

### C14. SignalR hub with authentication
```csharp
[Authorize]
public class NotificationsHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"user:{Context.UserIdentifier}");
        await base.OnConnectedAsync();
    }
}
```

### C15. Pagination with keyset
```csharp
var page = await db.Orders.AsNoTracking().Where(o => o.Id > after).OrderBy(o => o.Id).Take(limit + 1).ToListAsync(ct);
var next = page.Count > limit ? page[^2].Id : (int?)null;
```

### C16. Feature: file upload streaming to blob storage
```csharp
app.MapPost("/upload", async (HttpRequest req, BlobContainerClient container, CancellationToken ct) =>
{
    var blob = container.GetBlobClient(Guid.NewGuid().ToString("N"));
    await blob.UploadAsync(req.Body, cancellationToken: ct);        // streams without buffering the whole file
    return Results.Created(blob.Uri, null);
}).DisableAntiforgery();
```
Add size limits, content-type checks and authorization.

---

# 🐞 Part 7: Debugging Scenarios

### D1. 401 or 403 on every request
Check middleware order (`UseAuthentication` before `UseAuthorization`), token audience/issuer mismatch, clock skew, missing `[Authorize]` scheme, CORS preflight blocked, wrong `Authority` URL. Enable `IdentityModelEventSource.ShowPII` only in development to see validation errors.

### D2. CORS error in the browser
Policy not applied (`UseCors` missing or after the endpoint), origin not exact (scheme/port), credentials with wildcard, or preflight `OPTIONS` failing due to auth. Place `UseCors` after `UseRouting` and before auth.

### D3. `InvalidOperationException: Unable to resolve service for type ...`
Service not registered, wrong lifetime, or registered in a different container. Register it, check namespaces/interfaces, and enable `ValidateOnBuild`.

### D4. `Cannot consume scoped service from singleton`
Captive dependency. Make the consumer scoped/transient, or inject `IServiceScopeFactory` and create scopes.

### D5. `A second operation was started on this context instance`
A `DbContext` used concurrently (`Task.WhenAll` on one context, missing `await`, shared singleton). Use one context per operation (`IDbContextFactory`) and `await` every call.

### D6. EF Core query is slow
Check the SQL (`ToQueryString()`, logging), add indexes, use projections, `AsNoTracking`, fix N+1 (`Include` or projection), avoid client evaluation, and check the database plan (`EXPLAIN ANALYZE`).

### D7. `DbUpdateConcurrencyException`
Another update changed the row. Reload and retry, merge, or return 409. Use `RowVersion` tokens and keep transactions short.

### D8. Migrations fail or drift between environments
Missing migrations in source control, manual schema edits, or branch merges. Generate scripts, compare schemas, enforce migrations in CI, and never edit applied migrations.

### D9. Memory leak in a long-running API
Take `dotnet-gcdump` snapshots, compare, find retained objects: static collections, event handlers, `HttpClient` per request, unbounded caches, large strings. Add limits and monitor.

### D10. High CPU with low throughput
Profile (`dotnet-trace`): JSON serialization of big graphs, regex backtracking, LINQ in hot loops, logging at Debug level, sync locks. Optimize or cache.

### D11. Thread-pool starvation (latency spikes)
See Q94. Remove sync-over-async and long blocking calls; watch counters.

### D12. 502/504 behind a proxy
Kestrel timeouts vs proxy timeouts, large headers, wrong ports, failing health checks, or app crashes. Align idle timeouts, check logs and readiness, and configure forwarded headers.

### D13. Wrong client IP or `http` scheme behind a proxy
Forwarded headers not configured or proxy not trusted. Configure `UseForwardedHeaders` with `KnownProxies`/`KnownNetworks`.

### D14. Cookies not working after scaling out
Data Protection keys not shared across instances. Persist keys to a shared store and set an application name.

### D15. `System.Text.Json` serialization errors
Cycles (`ReferenceHandler.IgnoreCycles` or DTOs), missing converters, case sensitivity, unsupported types, trimming/AOT needing source generation.

### D16. Slow startup or readiness failures in Kubernetes
Heavy startup work, migrations at startup, DNS or dependency delays. Use startup probes, move migrations out, ReadyToRun, and lazy initialization.

### D17. Different behavior in container vs local
Time zones, ICU globalization (alpine images), file path case sensitivity, environment variables, certificates, user permissions. Reproduce in the same image and pin SDK/runtime versions.

### D18. Background service stops silently
Unhandled exception in `ExecuteAsync` (behavior is configurable via `HostOptions.BackgroundServiceExceptionBehavior`; default stops the host in .NET 6+). Catch and log exceptions inside loops; restart with care.

### D19. Scheduled job runs multiple times
Multiple instances. Use distributed locks, a single scheduler (Kubernetes CronJob), Hangfire/Quartz clustering, or idempotent jobs.

### D20. Debugging method (say this in interviews)
Reproduce → check traces/logs by correlation ID → isolate (proxy, middleware, endpoint, DB, downstream) → capture evidence (dump, trace, SQL) → fix → regression test → alert/runbook.


---

# 🧩 Part 8: Tricky Questions

### T1. Why does middleware order matter?
Each middleware wraps the next one. Authorization before authentication cannot see a user; CORS after authorization rejects preflight requests; exception handling must be first (outermost) to catch errors from everything inside it.

### T2. `app.Use` vs `app.Run` vs `app.Map`
`Use` adds middleware that can call `next`. `Run` adds terminal middleware (no `next`). `Map` branches the pipeline by path prefix.

### T3. Is `DbContext` thread-safe?
No. One context per unit of work; do not share across threads or parallel tasks. It is scoped by default for this reason.

### T4. Why not register `DbContext` as a singleton?
It would be shared by all requests, accumulate tracked entities (memory growth), and break thread safety.

### T5. `AddDbContextPool` pitfalls
Pooled contexts are reset between uses, so avoid storing request state in the context itself (tenant IDs, user IDs); inject scoped services via options instead.

### T6. Why can `Include` explode result sizes?
Joining multiple collections creates a cartesian product (rows multiply). Use `AsSplitQuery()` or projections.

### T7. Does `Where` after `ToList()` run in SQL?
No. `ToList()` executes the query and loads data; later `Where` runs in memory. Apply filters before materializing.

### T8. `IEnumerable` vs `IQueryable` with EF Core
Methods on `IQueryable` build expression trees translated to SQL. Casting to `IEnumerable` early switches to in-memory LINQ, loading everything first.

### T9. Why does `Count()` vs `Any()` matter?
`Any()` stops at the first match (`EXISTS`), while `Count() > 0` counts all rows. Prefer `Any()`.

### T10. Does `SaveChanges` need `await` for each operation?
`Add` is synchronous (tracks only); `SaveChangesAsync` hits the database. Forgetting to await it means writes may not finish before the response/scope ends.

### T11. Scoped service resolved in `Program.cs` at startup?
There is no request scope at startup; resolving scoped services from the root provider throws in development with scope validation. Create a scope explicitly (`using var scope = app.Services.CreateScope()`).

### T12. `IOptions<T>` doesn't see changed config. Why?
`IOptions<T>` reads once at first use. Use `IOptionsMonitor<T>` for live changes or `IOptionsSnapshot<T>` for per-request refresh.

### T13. Controllers: `[FromBody]` required?
With `[ApiController]`, complex types bind from the body automatically; simple types bind from route/query. You can override with `[FromQuery]`, `[FromRoute]`, `[FromHeader]`, `[FromServices]`.

### T14. Why do I get 415 Unsupported Media Type?
The request `Content-Type` isn't `application/json` for a JSON body (or the formatter is not registered).

### T15. Why does `ModelState` validation not run in minimal APIs automatically?
Minimal APIs do not include automatic data-annotation validation by default (verify the latest versions: validation support was added in newer releases). Use filters, FluentValidation, or manual checks.

### T16. 204 vs 200 with an empty body
Return `NoContent()` (204) for no body. A 200 with `null` serializes to `null` JSON or an empty body depending on the formatter.

### T17. Why `CreatedAtAction` vs `Created`?
`CreatedAtAction` generates the `Location` header from a route name/action; `Created(url, body)` takes an explicit URL.

### T18. Does `AllowAnyOrigin` work with credentials?
No. Browsers reject wildcard origins with credentials; list origins explicitly.

### T19. Does `await Task.WhenAll(...)` on EF queries run in parallel?
Only with separate contexts. One context cannot run concurrent operations.

### T20. `appsettings.Production.json` doesn't apply
`ASPNETCORE_ENVIRONMENT` must be `Production` (case matters on Linux for file names), and the file must be copied to the output directory.

### T21. Why is the first request slow?
JIT compilation, DI graph creation, EF model building, connection pool warm-up. Mitigate with ReadyToRun, warm-up requests, and startup probes.

### T22. HSTS in development?
HSTS is for production (browsers cache it); do not enable it on localhost, or you can lock developers into HTTPS on shared hostnames.

### T23. `HttpContext` in background threads
`HttpContext` is not thread-safe and must not be used after the request completes. Copy needed values before queuing background work.

### T24. Static `HttpContext.Current`?
Doesn't exist in ASP.NET Core. Inject `IHttpContextAccessor` (use sparingly) or pass values explicitly.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

| Question | Short answer |
|---|---|
| Default web server? | Kestrel |
| Entry point style? | Top-level statements in `Program.cs` |
| Builder method? | `WebApplication.CreateBuilder(args)` |
| Map GET route? | `app.MapGet("/", ...)` |
| Controller base class? | `ControllerBase` |
| Auto-validation attribute? | `[ApiController]` |
| DI lifetimes? | Singleton, Scoped, Transient |
| Per-request lifetime? | Scoped |
| Config providers? | JSON, env vars, CLI, user secrets, Key Vault |
| Typed config? | Options pattern |
| Env variable for env? | `ASPNETCORE_ENVIRONMENT` |
| ORM? | EF Core |
| Read-only query tip? | `AsNoTracking()` |
| Apply migrations command? | `dotnet ef database update` |
| Eager load related? | `Include` |
| Concurrency token? | `[Timestamp]` / `RowVersion` |
| Auth middleware order? | `UseAuthentication` → `UseAuthorization` |
| JWT scheme? | `JwtBearerDefaults.AuthenticationScheme` |
| Standard error format? | `ProblemDetails` |
| Real-time library? | SignalR |
| RPC framework? | gRPC |
| Background work? | `BackgroundService` |
| Health checks? | `AddHealthChecks` / `MapHealthChecks` |
| Rate limiting? | `AddRateLimiter` |
| Output cache? | `AddOutputCache` |
| Hybrid cache? | `HybridCache` (.NET 9) |
| Integration test host? | `WebApplicationFactory<T>` |
| Real DB in tests? | Testcontainers |
| Observability standard? | OpenTelemetry |
| Reverse proxy lib? | YARP |
| Container user? | Non-root `app` |
| AOT publish flag? | `PublishAot` |
| LTS versions? | 6, 8, 10 |
| UI framework in C#? | Blazor |
| Orchestration helper? | .NET Aspire |
| API versioning package? | `Asp.Versioning` |
| Data Protection keys? | Persist to shared store |
| CLI to publish? | `dotnet publish -c Release` |

---

# 🎤 Part 10: Project / Behavioral Questions

> Use **S**ituation, **T**ask, **A**ction, **R**esult.

### B1. Describe an API you built or scaled in .NET.
**Sample (Ritesh Kumar):** *Situation:* Our orders API had p95 latency of 1.6 s under peak load. *Task:* Reduce it below 400 ms without extra database capacity. *Action:* Traced requests with OpenTelemetry, removed an N+1 query pattern with projections, added `AsNoTracking`, introduced `HybridCache` for catalog data, and fixed sync-over-async calls that starved the thread pool. *Result:* p95 fell to 330 ms, CPU per instance dropped 35%, and we scaled to 4x traffic with the same database tier.

### B2. A production incident you handled.
Example: `DbContext` shared across parallel tasks causing intermittent errors. Describe detection (error spikes), mitigation (rollback), root cause, fix (context factory, bounded parallelism), tests and prevention (code review checklist, analyzers).

### B3. How do you ensure API quality and security?
Policy-based authorization with ownership tests, validation, rate limiting, secure headers, dependency scanning, integration tests with Testcontainers, and contract tests.

### B4. A migration you led (.NET Framework → .NET 8, monolith extraction).
Describe assessment, strangler pattern with YARP, library multi-targeting, database changes, test safety net, side-by-side rollout, and measurable results.

### B5. How do you mentor engineers on ASP.NET Core?
Teach pipeline order, DI lifetimes, EF Core tracking and query translation, async pitfalls, and debugging with dumps and traces; review PRs with a checklist.

### B6. Disagreement on architecture (microservices vs modular monolith).
Present data on team size, release cadence and operational cost; propose a modular monolith; document in an ADR; revisit with metrics.

### B7. How do you stay current?
Follow .NET blog and release notes, GitHub issues/discussions, conference talks, and experiment with preview features in side projects before adopting them.

---

# 📚 Part 11: Complete Coverage (Platform + Libraries + Tooling + Mixed)

## Platform surface
Generic host, `WebApplication`, Kestrel, middleware, routing, minimal APIs, MVC/Web API, Razor Pages, Blazor, SignalR, gRPC, Identity, authentication/authorization, Data Protection, configuration, options, logging, health checks, rate limiting, output caching, HybridCache, OpenAPI, localization, background services, hosting/deployment, Native AOT, .NET Aspire.

## Data and messaging
EF Core (migrations, tracking, queries, interceptors, concurrency, compiled models), Dapper, ADO.NET, SQL Server, PostgreSQL (Npgsql), MySQL, SQLite, Cosmos DB, MongoDB, Redis (StackExchange.Redis), Elasticsearch, Azure Service Bus, RabbitMQ, Kafka, MassTransit, NServiceBus, Hangfire, Quartz.NET.

## Tooling
Visual Studio, Rider, VS Code, `dotnet` CLI, `dotnet ef`, `dotnet watch`, `dotnet user-secrets`, `dotnet-counters`, `dotnet-trace`, `dotnet-dump`, `dotnet-gcdump`, BenchmarkDotNet, Docker, Kubernetes, Bicep/Terraform, GitHub Actions/Azure DevOps.

## Libraries
Serilog, OpenTelemetry, Polly/Resilience, FluentValidation, Mapperly/AutoMapper (check licensing), MediatR/Wolverine (check licensing), Refit, Swashbuckle/NSwag, Bogus, xUnit, NSubstitute/Moq, Testcontainers, Verify, YARP.

## Mixed topics
API design, authentication/authorization, data access and consistency, caching, messaging, resilience, observability, performance, security, testing, deployment and cloud.

---

# 🔬 Part 12: ASP.NET Core Internals

### I1. Host and startup
`WebApplication.CreateBuilder` configures defaults: configuration sources, logging, DI container, Kestrel, and environment. `builder.Build()` creates the host; `app.Run()` starts the server and hosted services and blocks until shutdown.

### I2. Kestrel and the request path
Kestrel uses the OS async I/O (epoll/IOCP) via sockets, parses HTTP (HTTP/1.1, 2, 3), builds an `HttpContext` from pooled objects, and invokes the middleware delegate chain. Pipelines (`System.IO.Pipelines`) minimize copies and allocations.

### I3. Middleware pipeline
Built as nested `RequestDelegate`s. Each middleware receives `next`. `UseRouting` matches the endpoint; later middleware (auth, CORS) can read endpoint metadata; `UseEndpoints` (implicit in .NET 6+) executes the selected endpoint.

### I4. Endpoint routing
Routes compile into a DFA-based matcher for fast lookup. Endpoints carry metadata (authorization attributes, CORS policies, rate limiting policy names) that middleware reads.

### I5. DI container
Service descriptors in an `IServiceCollection`, built into an `IServiceProvider`. Singleton instances are cached at the root; scoped instances per `IServiceScope`; transient created per resolution. Disposable services are tracked and disposed with their scope.

### I6. Model binding and formatters
Value providers (route, query, form, headers) feed model binders; JSON uses input formatters with `System.Text.Json`. Output formatters handle content negotiation (`Accept`).

### I7. Minimal API parameter binding
The compiler/runtime generates request delegates (via expression trees or source generators in AOT) that bind parameters from route, query, headers, body, services, and special types (`HttpContext`, `CancellationToken`).

### I8. EF Core pipeline
LINQ expression tree → query translation to a relational expression tree → SQL generation per provider → execution via ADO.NET → materialization into entities (with identity resolution if tracking). Compiled queries cache the translation. The model is built once per context type and cached.

### I9. Change tracker
Entries hold original values/snapshots and state (`Added`, `Modified`, `Deleted`, `Unchanged`, `Detached`). `DetectChanges` compares snapshots before `SaveChanges`. Large numbers of tracked entities slow it down, so clear the tracker or use `AsNoTracking`.

### I10. Configuration system
`ConfigurationManager` merges `IConfigurationProvider`s in order; keys are hierarchical with `:` (and `__` in environment variables). Reload tokens enable change notifications for providers that support them.

### I11. Hosted services lifecycle
Started in registration order after the server is configured (behavior with `BackgroundService` and `StartAsync` timing is configurable); stopped in reverse order on shutdown via `StopAsync` with a timeout.

---

# 📊 Part 13: Reference Tables

### Middleware order template
| Order | Middleware |
|---|---|
| 1 | Exception handler / HSTS |
| 2 | HTTPS redirection |
| 3 | Static files |
| 4 | Routing |
| 5 | CORS |
| 6 | Authentication |
| 7 | Authorization |
| 8 | Rate limiter / output cache |
| 9 | Custom middleware |
| 10 | Endpoints |

### Minimal APIs vs controllers
| Need | Choice |
|---|---|
| Small service, fast startup | Minimal APIs |
| Many filters/conventions, large team | Controllers |
| AOT and trimming | Minimal APIs (with source generation) |
| Razor views | MVC / Razor Pages |

### Caching options
| Option | Scope | Notes |
|---|---|---|
| `IMemoryCache` | Per instance | Fast, not shared |
| `IDistributedCache` | Shared (Redis) | Network latency |
| Output cache | HTTP responses | Policy-based |
| `HybridCache` | L1 + L2 | Stampede protection (.NET 9) |
| CDN | Edge | Public content |

### HTTP status guide
| Situation | Status |
|---|---|
| OK / Created / No content | 200 / 201 / 204 |
| Validation error | 400 / 422 |
| Unauthenticated / Forbidden | 401 / 403 |
| Not found / Conflict | 404 / 409 |
| Too many requests | 429 |
| Server error / unavailable | 500 / 503 |

### EF Core cheat table
| Task | API |
|---|---|
| Read-only query | `AsNoTracking()` |
| Eager load | `Include/ThenInclude` |
| Projection | `Select(x => new Dto(...))` |
| Bulk update | `ExecuteUpdateAsync` |
| Bulk delete | `ExecuteDeleteAsync` |
| Raw SQL | `FromSqlInterpolated` |
| Concurrency | `RowVersion` / `[ConcurrencyCheck]` |
| Parallel work | `IDbContextFactory<T>` |
| Inspect SQL | `ToQueryString()` |

### Hosting options
| Option | Best for |
|---|---|
| Kubernetes / AKS / EKS | Large microservice platforms |
| Azure Container Apps / ECS / Cloud Run | Managed containers |
| App Service / Elastic Beanstalk | Simple PaaS |
| Azure Functions / Lambda | Event-driven serverless |
| VM + Nginx/systemd | Full control |


---

# 🔮 Part 14: Output & Prediction Questions

### O1. Middleware order
```csharp
app.Use(async (c, n) => { Console.Write("A1 "); await n(); Console.Write("A2 "); });
app.Use(async (c, n) => { Console.Write("B1 "); await n(); Console.Write("B2 "); });
app.Run(async c => { Console.Write("END "); await c.Response.WriteAsync("ok"); });
```
**Output for one request:** `A1 B1 END B2 A2 `.

### O2. Short-circuit
```csharp
app.Use(async (c, n) => { Console.Write("X "); });             // does not call next
app.Run(async c => Console.Write("Y "));
```
**Output:** `X ` only. `Y` never runs.

### O3. DI lifetimes
```csharp
services.AddTransient<Guid>(_ => Guid.NewGuid());
services.AddScoped<IUnit, Unit>();
```
**Result:** Within one request, every resolution of `Guid` gives a new value; every resolution of `IUnit` gives the same instance.

### O4. Captive dependency
```csharp
services.AddSingleton<Report>();      // Report(AppDb db)
services.AddScoped<AppDb>();
```
**Result:** In Development with scope validation, startup/first resolution throws `Cannot consume scoped service 'AppDb' from singleton 'Report'`.

### O5. Tracking behavior
```csharp
var u = await db.Users.FirstAsync();
u.Name = "New";
// no SaveChanges call
```
**Result:** Nothing is written to the database. Changes are persisted only on `SaveChanges`.

### O6. `AsNoTracking` update
```csharp
var u = await db.Users.AsNoTracking().FirstAsync();
u.Name = "New";
await db.SaveChangesAsync();
```
**Result:** No update; the entity is not tracked. Use `db.Update(u)` or `Attach` and set state.

### O7. Deferred query
```csharp
var q = db.Users.Where(u => u.Active);
db.Users.Add(new User { Active = true });
await db.SaveChangesAsync();
var list = await q.ToListAsync();
```
**Result:** The list includes the new user (query runs at `ToListAsync`).

### O8. Route constraint
```csharp
app.MapGet("/items/{id:int}", (int id) => id);
// GET /items/abc
```
**Result:** `404 Not Found` (route does not match, because of the constraint).

### O9. Model validation in controllers
```csharp
[ApiController] ... public IActionResult Create(CreateUser dto) { ... }
// POST with Name missing and [Required] on Name
```
**Result:** `400 Bad Request` with `ValidationProblemDetails`; the action body does not run.

### O10. Options reload
```csharp
class A(IOptions<X> o) { }   // singleton
// appsettings.json edited at runtime
```
**Result:** `A` keeps seeing the old values. Use `IOptionsMonitor<X>`.

### O11. `async` handler without `await`
```csharp
app.MapGet("/a", async () => { Task.Delay(1000); return "done"; });
```
**Result:** Returns immediately (the delay is not awaited) and the compiler warns about a missing `await`/unawaited task.

### O12. HttpContext after request
```csharp
app.MapGet("/x", (HttpContext c) => { _ = Task.Run(async () => { await Task.Delay(1000); Console.WriteLine(c.Request.Path); }); return "ok"; });
```
**Result:** Unsafe: `HttpContext` may be recycled or disposed after the response completes, producing undefined behavior or exceptions. Copy values first.

### O13. CORS preflight
A browser calls `PUT /api/x` from another origin with `Content-Type: application/json`.
**Result:** The browser sends an `OPTIONS` preflight first; if the server does not allow the origin/method/headers, the actual request is never sent.

### O14. Response caching key
```csharp
app.MapGet("/p", ...).CacheOutput(p => p.Expire(TimeSpan.FromMinutes(1)));
// GET /p?page=1 then GET /p?page=2
```
**Result:** By default the query string is part of the cache key unless configured otherwise; the two requests are cached separately.

---

# ✅ Part 15: MCQs

**1.** Default web server in ASP.NET Core?
A) IIS B) Kestrel C) Apache D) Nginx

**2.** Which lifetime creates one instance per HTTP request?
A) Singleton B) Scoped C) Transient D) Static

**3.** Which attribute enables automatic model validation responses?
A) `[Authorize]` B) `[ApiController]` C) `[Route]` D) `[HttpGet]`

**4.** Correct order of auth middleware?
A) Authorization then Authentication B) Authentication then Authorization C) Either D) Neither is needed

**5.** What does `AsNoTracking()` do?
A) Disables SQL B) Skips change tracking for faster reads C) Deletes entities D) Locks rows

**6.** Which is the standard error format for HTTP APIs?
A) `ErrorDto` B) `ProblemDetails` C) XML fault D) Plain text

**7.** Which type is not thread-safe?
A) `DbContext` B) `IMemoryCache` C) `ConcurrentDictionary` D) `HttpClient` (for sending requests)

**8.** How should you run EF Core migrations in production?
A) `Migrate()` in every instance at startup B) A controlled deploy step (script/bundle) C) Manually edit tables D) Never

**9.** Which feature provides L1+L2 caching with stampede protection?
A) `IMemoryCache` B) `HybridCache` C) `ResponseCache` D) Cookies

**10.** Which method adds terminal middleware?
A) `Use` B) `Run` C) `Map` D) `UseWhen`

**11.** Which server-side technology provides real-time push over WebSockets?
A) gRPC B) SignalR C) MVC D) Razor Pages

**12.** `ForwardedHeaders` middleware is needed when:
A) Using Docker B) Running behind a reverse proxy that terminates TLS C) Using SQL Server D) Using Blazor

**13.** What is the correct way to use scoped services in a `BackgroundService`?
A) Inject them directly B) Create a scope with `IServiceScopeFactory` C) Make them static D) Use `new`

**14.** Which approach avoids the N+1 problem?
A) Lazy loading everywhere B) `Include` or projection C) Loop queries D) `Count()` before every item

**15.** What protects against concurrent updates in EF Core?
A) Optimistic concurrency tokens B) `Thread.Sleep` C) Global locks D) `AsNoTracking`

**16.** Which header should be sent for HTTPS enforcement?
A) HSTS (`Strict-Transport-Security`) B) `X-Powered-By` C) `ETag` D) `Via`

**17.** Which tool tests the full pipeline in-memory?
A) `WebApplicationFactory<T>` B) `TestServer` only C) Selenium only D) Postman only

**18.** The recommended place to store secrets in local development?
A) `appsettings.json` committed B) User Secrets C) Source code D) README

**19.** Which provides distributed tracing standard in .NET?
A) OpenTelemetry B) Log4net C) NLog only D) EventViewer

**20.** What does `UseRouting` do?
A) Selects the endpoint for the request B) Compresses responses C) Logs requests D) Encrypts cookies

**21.** What is the purpose of Data Protection keys?
A) Database encryption at rest B) Encrypting cookies/antiforgery tokens; must be shared across instances C) JWT signing for external clients D) Password hashing

**22.** `ExecuteUpdateAsync` is used for:
A) Loading entities then updating B) Set-based updates without loading entities C) Migrations D) Seeding

**23.** Which is true of `IOptionsMonitor<T>`?
A) Singleton, supports change notifications B) Scoped only C) Cannot read config D) Replaces DI

**24.** What is a typical readiness check?
A) Process is alive B) Dependencies (DB, cache) are reachable C) CPU usage D) Disk size

**25.** Which API creates a typed HTTP result in minimal APIs?
A) `TypedResults.Ok()` B) `Response.Write` C) `Console.Write` D) `Http.Ok`

**26.** Which pattern ensures messages are published reliably with DB changes?
A) Transactional outbox B) `Task.Run` C) Static event D) Global lock

**27.** Which cache is shared across instances?
A) `IMemoryCache` B) Redis `IDistributedCache` C) Static dictionary D) `ThreadLocal`

**28.** Which LTS .NET release is widely used (as of the .NET 8–10 era)?
A) .NET 7 B) .NET 8 C) .NET 9 D) .NET 5

**29.** Which attribute restricts access by policy?
A) `[Authorize(Policy = "X")]` B) `[AllowAnonymous]` C) `[Produces]` D) `[Consumes]`

**30.** Which approach is best for large file upload?
A) Buffer into memory B) Stream to storage C) Base64 in JSON D) Email attachment

**31.** What does `CreatedAtAction` set?
A) Status 200 B) Status 201 and `Location` header C) Status 204 D) Status 301

**32.** In Kubernetes, which probe decides whether to send traffic?
A) Liveness B) Readiness C) Startup D) Shutdown

**33.** Which tool captures memory snapshots in .NET?
A) `dotnet-gcdump` B) `dotnet-ef` C) `dotnet-format` D) `dotnet-new`

**34.** What does `AddStandardResilienceHandler()` provide?
A) Retries, circuit breaker, timeouts for `HttpClient` B) Caching C) Authentication D) Compression

**35.** Which is a valid reason to prefer Dapper?
A) Complex hand-tuned SQL reads B) Automatic migrations C) Change tracking D) LINQ translation

**36.** What is YARP?
A) A reverse proxy library for .NET B) A JSON library C) A test framework D) A logging provider

**37.** Which is best for time in tests?
A) `DateTime.Now` B) `TimeProvider` C) `Thread.Sleep` D) Static field

**38.** Native AOT is best suited to:
A) Large reflection-heavy apps B) Fast-start, low-memory services with AOT-compatible libraries C) Windows Forms D) All apps

**39.** The status code for rate limiting?
A) 401 B) 408 C) 429 D) 503

**40.** Which statement about gRPC is true?
A) Uses HTTP/2 and Protobuf B) Works only in browsers directly C) Is text-based JSON only D) Needs WebSockets

### Answer key
1-B, 2-B, 3-B, 4-B, 5-B, 6-B, 7-A, 8-B, 9-B, 10-B, 11-B, 12-B, 13-B, 14-B, 15-A, 16-A, 17-A, 18-B, 19-A, 20-A, 21-B, 22-B, 23-A, 24-B, 25-A, 26-A, 27-B, 28-B, 29-A, 30-B, 31-B, 32-B, 33-A, 34-A, 35-A, 36-A, 37-B, 38-B, 39-C, 40-A

---

# ⚠️ Part 16: Common Mistakes

> Each mistake has four parts: ❌ wrong code, 🤔 why it is a problem, ✅ correct code, 💬 what to say in an interview.

### Mistake 1: Sync-over-async in request paths
❌
```csharp
app.MapGet("/u/{id}", (int id, IUserService s) => s.GetAsync(id).Result);
```
🤔 Blocks a thread-pool thread per request and starves the pool under load.
✅
```csharp
app.MapGet("/u/{id}", async (int id, IUserService s, CancellationToken ct) => await s.GetAsync(id, ct));
```
💬 "Async end to end with cancellation tokens."

### Mistake 2: Sharing a `DbContext` across threads
❌
```csharp
await Task.WhenAll(db.Users.CountAsync(), db.Orders.CountAsync());
```
🤔 `DbContext` is not thread-safe: "A second operation was started on this context".
✅
```csharp
await using var a = await factory.CreateDbContextAsync(ct);
await using var b = await factory.CreateDbContextAsync(ct);
await Task.WhenAll(a.Users.CountAsync(ct), b.Orders.CountAsync(ct));
```
💬 "One context per unit of work; use a factory for parallel work."

### Mistake 3: Returning entities directly from APIs
❌
```csharp
app.MapGet("/users", (AppDb db) => db.Users.ToListAsync());
```
🤔 Leaks internal fields, loads whole tables, and couples clients to the schema.
✅
```csharp
app.MapGet("/users", (AppDb db, CancellationToken ct) => db.Users.AsNoTracking().Select(u => new UserDto(u.Id, u.Name)).Take(100).ToListAsync(ct));
```
💬 "DTO projections with paging."

### Mistake 4: Wrong middleware order
❌
```csharp
app.UseAuthorization();
app.UseAuthentication();
```
🤔 Authorization runs before the user is identified, so every request looks anonymous.
✅
```csharp
app.UseAuthentication();
app.UseAuthorization();
```
💬 "Pipeline order is behavior."

### Mistake 5: Captive dependencies
❌
```csharp
services.AddSingleton<ReportJob>();   // injects scoped DbContext
```
🤔 One `DbContext` lives forever and is shared across threads.
✅
```csharp
class ReportJob(IServiceScopeFactory f) { /* create a scope per run */ }
```
💬 "Lifetimes flow from long to short; scope validation catches mistakes."

### Mistake 6: Running migrations at startup on every instance
❌
```csharp
app.Services.CreateScope().ServiceProvider.GetRequiredService<AppDb>().Database.Migrate();
```
🤔 Races between instances, long startup, and risky schema changes during rollout.
✅
```bash
dotnet ef migrations bundle -o efbundle && ./efbundle --connection "$CONN"   # separate deploy step
```
💬 "Migrations are a controlled deployment step."

### Mistake 7: Secrets in config files
❌
```json
{ "ConnectionStrings": { "Default": "Server=prod;User=sa;Password=123" } }
```
🤔 Secrets leak through source control.
✅
```csharp
// environment variables / Key Vault / user-secrets; prefer managed identity
```
💬 "No secrets in source; managed identities where possible."

### Mistake 8: Ignoring timeouts and cancellation
❌
```csharp
await http.GetStringAsync(url);
```
🤔 Slow dependencies tie up requests; client disconnects don't stop work.
✅
```csharp
await http.GetStringAsync(url, ct);   // plus resilience handler timeouts
```
💬 "Timeouts and cancellation everywhere."

### Mistake 9: Exposing stack traces and Swagger in production
❌
```csharp
app.UseDeveloperExceptionPage(); app.UseSwagger(); app.UseSwaggerUI();
```
🤔 Leaks internals and an attack surface.
✅
```csharp
if (app.Environment.IsDevelopment()) { app.UseDeveloperExceptionPage(); app.MapOpenApi(); }
else app.UseExceptionHandler();
```
💬 "Detailed errors only in development."

### Mistake 10: `Include` everything and loading entire tables
❌
```csharp
db.Orders.Include(o => o.Items).Include(o => o.User).ToList();
```
🤔 Huge joins and memory use.
✅
```csharp
db.Orders.AsNoTracking().Where(...).Select(o => new OrderDto(o.Id, o.Total)).ToListAsync(ct);
```
💬 "Project only what the endpoint needs."

### Mistake 11: Using `HttpContext` in background work
❌
```csharp
_ = Task.Run(() => log.LogInformation(ctx.Request.Path));
```
🤔 `HttpContext` is not valid after the request ends.
✅
```csharp
var path = ctx.Request.Path.Value; await queue.EnqueueAsync(new Job(path));
```
💬 "Copy data out; don't capture `HttpContext`."

### Mistake 12: Not persisting Data Protection keys when scaling out
❌
```csharp
builder.Services.AddDataProtection();     // keys stored locally per instance
```
🤔 Cookies and antiforgery tokens fail across instances or after restarts.
✅
```csharp
builder.Services.AddDataProtection().PersistKeysToStackExchangeRedis(mux, "dp-keys").SetApplicationName("orders");
```
💬 "Share and protect Data Protection keys."

### Mistake 13: Weak authorization (IDOR)
❌
```csharp
app.MapGet("/orders/{id}", async (int id, AppDb db) => await db.Orders.FindAsync(id)).RequireAuthorization();
```
🤔 Any authenticated user can read any order by changing the ID.
✅
```csharp
await db.Orders.Where(o => o.Id == id && o.UserId == user.GetId()).FirstOrDefaultAsync(ct);
```
💬 "Authentication is not authorization: I check ownership on every resource."

### Mistake 14: Catching and swallowing exceptions in middleware/handlers
❌
```csharp
try { await next(ctx); } catch { }
```
🤔 Hides failures and returns misleading responses.
✅
```csharp
app.UseExceptionHandler();   // central handler that logs and returns ProblemDetails
```
💬 "A single global handler logs and maps errors."

### Mistake 15: Unbounded parallelism and queues
❌
```csharp
await Task.WhenAll(ids.Select(id => client.GetAsync(id)));     // 50,000 calls
```
🤔 Overloads dependencies and memory.
✅
```csharp
await Parallel.ForEachAsync(ids, new ParallelOptions { MaxDegreeOfParallelism = 16, CancellationToken = ct }, async (id, t) => await client.GetAsync(id, t));
```
💬 "Always bound concurrency."

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

### Signal table 1: Answer quality
| Topic | Weak answer | Strong answer |
|---|---|---|
| "How does the pipeline work?" | "Middleware runs in order." | "Nested delegates wrapping `next`; routing selects the endpoint, then auth/CORS read endpoint metadata; order determines behavior; exceptions bubble out to the outermost handler." |
| "DI lifetimes?" | "Singleton, scoped, transient." | "Plus captive dependency rules, scope creation for background services, scope validation, and thread-safety needs of singletons." |
| "EF Core tuning?" | "Use indexes." | "Inspect SQL, `AsNoTracking`, projections, fix N+1, split queries, compiled queries, pooling, and bulk updates with `ExecuteUpdate`." |
| "How do you secure an API?" | "JWT." | "OIDC/JWT validation, policy and ownership authorization, validation, rate limits, secrets in a vault, Data Protection keys shared, scanning and audit logs." |
| "How do you debug production?" | "Check logs." | "Traces and metrics first, then dumps/gcdump/trace for CPU, memory or hangs; check thread-pool counters; mitigate, root-cause, add tests/alerts." |

### Signal table 2: Behaviors that stand out
| Weak behavior | Strong behavior |
|---|---|
| Copies templates blindly | Chooses structure intentionally (modular monolith, vertical slices) |
| Ignores operations | Adds health checks, OpenTelemetry, graceful shutdown |
| Handles only happy paths | Tests failures: auth, validation, concurrency, timeouts |
| Overuses abstractions | Keeps layers simple and meaningful |
| Treats EF as magic | Reads generated SQL and query plans |

### Signal table 3: Phrases that show depth
- "The database pool is usually the real concurrency limit."
- "I keep migrations as a separate deploy step and make them backward compatible."
- "Every outbound call has a timeout, retries with jitter and a circuit breaker."
- "Share Data Protection keys across instances."
- "Outbox plus idempotent consumers instead of distributed transactions."
- "I measure first with traces and counters, then optimize."

### Signal table 4: Questions to ask the interviewer
- Which .NET version and hosting platform do you run in production?
- How do you manage migrations, secrets and configuration per environment?
- What is your observability stack and incident process?
- Modular monolith or microservices, and how are boundaries enforced?

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### 1. The 30-second explanation
ASP.NET Core is a fast, cross-platform web framework on Kestrel with a middleware pipeline, endpoint routing, built-in DI/config/logging, and strong integration with EF Core for data access. You build APIs with minimal APIs or controllers, secure them with JWT/OIDC and policies, and operate them with health checks, OpenTelemetry and containers.

### 2. Request flow
```
Client → LB/proxy → Kestrel → middleware (exceptions, HTTPS, static, routing, CORS, auth, rate limit)
 → endpoint (filters, model binding, validation) → service → EF Core / HttpClient → DB / downstream
 → response (ProblemDetails on errors)
```

### 3. Skeleton to memorize
```csharp
var b = WebApplication.CreateBuilder(args);
b.Services.AddDbContext<AppDb>(...); b.Services.AddProblemDetails();
b.Services.AddAuthentication().AddJwtBearer(); b.Services.AddAuthorization();
b.Services.AddHealthChecks(); b.Services.AddOpenTelemetry()...;
var app = b.Build();
app.UseExceptionHandler(); app.UseAuthentication(); app.UseAuthorization();
app.MapGroup("/api").MapEndpoints(); app.MapHealthChecks("/health/ready");
app.Run();
```

### 4. Production checklist
- [ ] Supported LTS runtime; pinned SDK; non-root slim image
- [ ] Options validated at startup; secrets in a vault/managed identity
- [ ] Global error handling with `ProblemDetails`
- [ ] AuthN/AuthZ with ownership checks; CORS allow-list; rate limiting
- [ ] Async end to end; cancellation; timeouts; resilience handlers
- [ ] EF Core: projections, `AsNoTracking`, indexes, migrations as deploy step
- [ ] Data Protection keys shared; forwarded headers configured
- [ ] Health checks (live/ready), graceful shutdown
- [ ] OpenTelemetry logs/metrics/traces; SLO alerts
- [ ] Tests: unit, `WebApplicationFactory` + Testcontainers, load
- [ ] Dependency scanning and update automation

### 5. Debug toolbox
| Symptom | Tool |
|---|---|
| High CPU | `dotnet-trace`, PerfView |
| Memory growth | `dotnet-gcdump`, `dotnet-dump` |
| Hang / starvation | `dotnet-counters`, `dotnet-dump` |
| Slow requests | OpenTelemetry traces |
| Slow SQL | EF logging, `ToQueryString()`, DB plans |

### 6. Top 15 one-liners
1. Middleware order is behavior.
2. Scoped per request; singletons must be thread-safe.
3. `DbContext` is scoped and not thread-safe.
4. `AsNoTracking` and projections for reads.
5. Async all the way; never block.
6. `ProblemDetails` for errors.
7. Authorization checks ownership, not just login.
8. Migrations are a deploy step.
9. Share Data Protection keys across instances.
10. Timeouts + retries + circuit breakers on outbound calls.
11. Outbox for reliable messaging.
12. Health checks: liveness vs readiness.
13. Configure forwarded headers behind proxies.
14. OpenTelemetry for logs, metrics, traces.
15. Move LTS to LTS.

### 7. The 60-second answer: "Why ASP.NET Core?"
"ASP.NET Core is one of the fastest mainstream web frameworks, with excellent tooling, built-in DI, configuration, logging and security, and first-class cloud-native support. Combined with EF Core and the modern C# language, it lets teams build maintainable APIs quickly. I focus on correct async usage, DI lifetimes, disciplined data access, observability and safe deployments."

### 8. Final revision order
Pipeline and routing → DI and configuration → controllers/minimal APIs and validation → EF Core (tracking, queries, migrations) → authentication and authorization → caching, rate limiting and resilience → messaging and background work → observability, deployment and debugging stories.

