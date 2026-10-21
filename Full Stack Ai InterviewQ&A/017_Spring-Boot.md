# Spring Boot Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **Spring Boot 3.x (3.2 to 3.5) on Spring Framework 6.x, Java 17/21, Jakarta EE namespaces (`jakarta.*`)**. Spring Boot 4 / Spring Framework 7 introduce further changes (verify exact details in the official docs at spring.io before the interview). Code uses the sample name **Ritesh Kumar**.
> Core Java (collections, concurrency, JVM) is in file 016. This file covers Spring Core, Boot auto-configuration, MVC/WebFlux, data access, security, testing, observability, microservice patterns and production practice.

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
- [Part 11: Complete Coverage (Modules + Annotations + Ecosystem + Mixed)](#-part-11-complete-coverage-modules--annotations--ecosystem--mixed)
- [Part 12: Spring Internals](#-part-12-spring-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is Spring Boot?
An opinionated layer on top of the Spring Framework that makes it fast to build production-ready applications. It provides **auto-configuration**, **starter dependencies**, an **embedded server** (Tomcat by default), externalized configuration, and production features (Actuator). You run it as a plain `java -jar`.
```java
@SpringBootApplication
public class App {
    public static void main(String[] args) { SpringApplication.run(App.class, args); }
}
```

### Q2. Spring vs Spring Boot
| | Spring Framework | Spring Boot |
|---|---|---|
| Purpose | Core container (DI), MVC, data, AOP, etc. | Quick setup and conventions on top of Spring |
| Configuration | Manual (XML/Java config) | Auto-configuration + properties |
| Server | External (deploy WAR) | Embedded (run JAR) |
| Dependencies | You pick and align versions | Starters + managed versions (BOM) |

### Q3. What does `@SpringBootApplication` do?
It combines three annotations: `@SpringBootConfiguration` (a `@Configuration` class), `@EnableAutoConfiguration` (turns on auto-configuration), and `@ComponentScan` (scans the package of the class and its sub-packages for components).

### Q4. What are starters?
Curated dependency descriptors, for example `spring-boot-starter-web` (MVC + Tomcat + Jackson), `-data-jpa`, `-security`, `-validation`, `-actuator`, `-test`. They bring compatible transitive dependencies so you do not manage versions yourself.

### Q5. What is Dependency Injection (DI) and Inversion of Control (IoC)? *(Must-know)*
IoC: the container creates and wires objects instead of your code calling `new`. DI is the technique: dependencies are provided (injected) from outside. Benefits: loose coupling, testability, and configurability.

### Q6. What is a Spring bean?
An object managed by the Spring IoC container (created, wired, and its lifecycle handled by Spring). Declared via stereotype annotations (`@Component`, `@Service`, `@Repository`, `@Controller`) or `@Bean` methods in `@Configuration` classes.

### Q7. Stereotype annotations
`@Component` (generic), `@Service` (business logic), `@Repository` (data access, adds exception translation), `@Controller` / `@RestController` (web layer). They are mostly semantic markers; `@Repository` and `@Controller` have extra behavior.

### Q8. Types of dependency injection *(Must-know)*
- **Constructor injection** (recommended): immutable dependencies, easy tests, fails fast.
- **Setter injection:** for optional dependencies.
- **Field injection** (`@Autowired` on fields): discouraged (hard to test, hides dependencies).
```java
@Service
public class UserService {
    private final UserRepository repo;
    public UserService(UserRepository repo) { this.repo = repo; }   // single constructor: @Autowired optional
}
```

### Q9. What is `@Autowired`, and how does Spring resolve beans?
It requests injection. Spring resolves by **type** first; if several candidates exist, uses `@Primary`, `@Qualifier("name")`, or the parameter name as a fallback. If none exist (and required) startup fails with `NoSuchBeanDefinitionException`.

### Q10. `@RestController` vs `@Controller`
`@RestController` = `@Controller` + `@ResponseBody`: return values are written to the HTTP response body (JSON), not resolved as view names.

### Q11. Basic REST controller
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService service;
    public UserController(UserService service) { this.service = service; }

    @GetMapping("/{id}")
    public UserDto get(@PathVariable Long id) { return service.get(id); }

    @GetMapping
    public List<UserDto> list(@RequestParam(defaultValue = "0") int page) { return service.list(page); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserDto create(@Valid @RequestBody CreateUserRequest req) { return service.create(req); }
}
```

### Q12. Request mapping annotations
`@RequestMapping`, `@GetMapping`, `@PostMapping`, `@PutMapping`, `@PatchMapping`, `@DeleteMapping`. Parameters: `@PathVariable`, `@RequestParam`, `@RequestBody`, `@RequestHeader`, `@CookieValue`, `@ModelAttribute`.

### Q13. How do you configure a Spring Boot app?
`application.properties` or `application.yml` in `src/main/resources`, environment variables, command-line args, profile-specific files (`application-prod.yml`).
```yaml
server:
  port: 8080
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/app
    username: app
    password: ${DB_PASSWORD}
```

### Q14. Property binding: `@Value` vs `@ConfigurationProperties`
`@Value("${app.name}")` injects single values. `@ConfigurationProperties(prefix = "app")` binds a group to a typed class (validation, relaxed binding, IDE metadata) and is preferred.
```java
@ConfigurationProperties(prefix = "app.mail")
public record MailProperties(@NotBlank String host, int port) {}
```
Enable with `@ConfigurationPropertiesScan` or `@EnableConfigurationProperties`.

### Q15. Spring profiles
Activate environment-specific configuration: `spring.profiles.active=prod` (or env `SPRING_PROFILES_ACTIVE`). Use `@Profile("dev")` on beans/config and `application-{profile}.yml` files. Do not store secrets in profile files.

### Q16. Property source precedence (simplified)
Command-line args > Java system properties > OS environment variables > profile-specific files > `application.yml` > defaults. Environment variables override files, which is how containers are configured.

### Q17. What is the embedded server and how do you change it?
Boot embeds Tomcat by default. Exclude `spring-boot-starter-tomcat` and add `-jetty` or `-undertow` to switch. Configure with `server.*` properties (port, SSL, compression, `server.tomcat.threads.max`).

### Q18. What is Spring Boot Actuator?
Production endpoints: `/actuator/health`, `/info`, `/metrics`, `/prometheus` (with Micrometer), `/env`, `/loggers`, `/threaddump`, `/heapdump`. Expose only what you need and secure them.
```yaml
management:
  endpoints.web.exposure.include: health,info,prometheus
  endpoint.health.probes.enabled: true
```

### Q19. What is Spring Data JPA?
An abstraction over JPA/Hibernate that generates repository implementations from interfaces.
```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByAgeGreaterThanOrderByNameAsc(int age);
    @Query("select u from User u where u.city = :city")
    List<User> inCity(@Param("city") String city);
}
```

### Q20. What is an entity?
```java
@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String email;
    private String name;
    protected User() {}                        // JPA needs a no-arg constructor
}
```

### Q21. What is validation in Spring?
Bean Validation (Jakarta Validation, Hibernate Validator): `@NotNull`, `@NotBlank`, `@Email`, `@Size`, `@Min`, `@Max`, `@Pattern`. Trigger with `@Valid`/`@Validated` on request bodies/parameters. Errors become `MethodArgumentNotValidException` (400).
```java
public record CreateUserRequest(@NotBlank String name, @Email String email, @Min(18) int age) {}
```

### Q22. Exception handling in controllers
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(NotFoundException.class)
    public ProblemDetail notFound(NotFoundException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
    }
}
```
`ProblemDetail` follows RFC 9457 (RFC 7807) and is built into Spring 6.

### Q23. What is a DTO and why use it?
A Data Transfer Object separates API models from persistence entities. It prevents leaking internal fields, avoids lazy-loading and serialization issues, and lets the API evolve independently of the schema. Use records and mappers (MapStruct).

### Q24. HTTP status codes in Spring
`ResponseEntity.ok(body)`, `ResponseEntity.created(uri).body(x)`, `ResponseEntity.noContent().build()`, `@ResponseStatus`. Use 201 for creation, 204 for no body, 400/422 validation, 401/403 security, 404 not found, 409 conflict.

### Q25. What is Maven's `pom.xml` / Gradle's `build.gradle` in Boot?
Declares the parent (`spring-boot-starter-parent`) or BOM for version management, dependencies, and the Boot plugin that builds an executable fat JAR (`mvn package`, `./gradlew bootJar`).

### Q26. How do you run a Boot app?
`./mvnw spring-boot:run`, `./gradlew bootRun`, or `java -jar target/app.jar`. DevTools gives automatic restarts in development (do not ship it).

### Q27. What is logging in Boot?
SLF4J API with Logback by default. Set levels in properties: `logging.level.root=INFO`, `logging.level.com.example=DEBUG`. Use `private static final Logger log = LoggerFactory.getLogger(X.class)` or Lombok's `@Slf4j`.

### Q28. What is `CommandLineRunner` / `ApplicationRunner`?
Beans that run after the context starts, useful for seeding or one-off tasks. Keep them idempotent; prefer proper migrations (Flyway) for schema.

### Q29. Bean scopes *(Must-know)*
`singleton` (default, one per container), `prototype` (new each injection), `request`, `session`, `application`, `websocket` (web scopes). A singleton is shared across threads, so it must be stateless or thread-safe.

### Q30. What is a `@Configuration` class and `@Bean`?
```java
@Configuration
public class AppConfig {
    @Bean
    public RestClient restClient(RestClient.Builder builder) {
        return builder.baseUrl("https://api.example.com").build();
    }
}
```
Use it for third-party classes you cannot annotate.

### Q31. Auto-configuration in one sentence
Boot looks at the classpath and existing beans and conditionally registers sensible default beans (for example DataSource when a JDBC driver is present), backing off when you define your own.

### Q32. What is Swagger/OpenAPI support?
`springdoc-openapi-starter-webmvc-ui` generates OpenAPI docs and Swagger UI from your controllers. Annotate with `@Operation`, `@Schema` to enrich.

### Q33. What is `application.properties` vs `application.yml`?
Same capabilities; YAML is hierarchical and readable, properties are flat. YAML does not support `@PropertySource` loading.

### Q34. What are REST best practices in Spring Boot?
Plural nouns for resources, proper HTTP verbs and status codes, validation, consistent error format, pagination, versioning, idempotent PUT/DELETE, DTOs, no business logic in controllers.

### Q35. What is the difference between `@RequestParam` and `@PathVariable`?
`@PathVariable` binds a segment of the URL path (`/users/{id}`); `@RequestParam` binds query/form parameters (`?page=2`).

---

# 🔵 Part 2: Junior (1–3 years)

### Q36. How does auto-configuration work internally? *(Must-know)*
Boot reads `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` (Boot 2.7+/3) from jars on the classpath and loads those `@AutoConfiguration` classes. Each is guarded by conditions: `@ConditionalOnClass`, `@ConditionalOnMissingBean`, `@ConditionalOnProperty`, `@ConditionalOnBean`, `@ConditionalOnWebApplication`. User-defined beans win because of `@ConditionalOnMissingBean`. Debug with `--debug` or `/actuator/conditions`.

### Q37. Bean lifecycle
Instantiate → populate dependencies → `Aware` callbacks → `BeanPostProcessor.before` → `@PostConstruct` / `InitializingBean.afterPropertiesSet` / init-method → `BeanPostProcessor.after` (proxies are created here) → ready → on shutdown `@PreDestroy` / `DisposableBean`.

### Q38. `@Component` vs `@Bean`
`@Component` (class-level, auto-detected by scanning) vs `@Bean` (method-level in `@Configuration`, explicit creation, good for third-party types or conditional/complex construction).

### Q39. `@Primary` and `@Qualifier`
When two beans implement the same interface, mark one `@Primary` as the default, or select with `@Qualifier("fast")` at the injection point. Injecting `List<Handler>` or `Map<String, Handler>` gets all implementations.

### Q40. Circular dependencies
Constructor injection cycles fail (`BeanCurrentlyInCreationException`); Boot 2.6+ forbids cycles by default. Fix by redesign (extract a third service, use events), or `@Lazy` as a last resort. Cycles signal a design problem.

### Q41. `@Transactional` *(Must-know)*
```java
@Service
public class OrderService {
    @Transactional
    public void place(Order o) { orderRepo.save(o); stockRepo.decrease(o); }   // both succeed or both roll back
}
```
Implemented with AOP proxies. Defaults: rolls back on unchecked exceptions (`RuntimeException`, `Error`), **not** on checked exceptions (use `rollbackFor`). Put it on service methods, not controllers or repositories.

### Q42. Transaction propagation and isolation
Propagation: `REQUIRED` (default, join or create), `REQUIRES_NEW` (suspend and start new), `SUPPORTS`, `MANDATORY`, `NOT_SUPPORTED`, `NEVER`, `NESTED`. Isolation: `READ_COMMITTED`, `REPEATABLE_READ`, `SERIALIZABLE`. `readOnly = true` hints optimizations and flush behavior.

### Q43. Why does `@Transactional` not work sometimes? *(Must-know)*
- **Self-invocation:** calling a `@Transactional` method from another method in the same class bypasses the proxy.
- Method is `private`/`final`/`static` (proxy cannot intercept).
- Bean not managed by Spring (`new Service()`).
- Checked exception without `rollbackFor`.
- Exception caught inside and swallowed.
- Wrong `@Transactional` import (`jakarta.transaction` vs Spring's; both work in Boot, but know the differences).
- Async/different thread: transaction is thread-bound.

### Q44. Spring Data JPA derived queries and projections
Method names (`findByEmailAndActiveTrue`), `@Query` (JPQL or native), `Pageable`/`Sort`, projections (interfaces or records) to fetch only needed columns, `Specification` for dynamic filters.
```java
Page<UserSummary> findByCity(String city, Pageable pageable);
```

### Q45. Pagination
```java
@GetMapping
public Page<UserDto> list(@PageableDefault(size = 20) Pageable pageable) {
    return repo.findAll(pageable).map(mapper::toDto);
}
```
Cap page size, return a stable sort, and for large tables use keyset (seek) pagination.

### Q46. Entity relationships
`@OneToMany`, `@ManyToOne`, `@OneToOne`, `@ManyToMany`. The owning side holds the foreign key (`@JoinColumn`); the inverse side uses `mappedBy`. `@ManyToOne` is the most common and efficient. Avoid bidirectional `@ManyToMany`; use an explicit join entity.

### Q47. Lazy vs eager loading; the N+1 problem *(Must-know)*
Collections are lazy by default; accessing them outside a session causes `LazyInitializationException`. N+1: one query loads N parents, then N queries load children. Fix with `join fetch`, `@EntityGraph`, batch fetching (`hibernate.default_batch_fetch_size`), or DTO projections.
```java
@Query("select o from Order o join fetch o.items where o.userId = :id")
List<Order> withItems(Long id);
```

### Q48. Entity `equals`/`hashCode`, Lombok pitfalls
Do not use `@Data` on entities (generates `equals/hashCode/toString` over all fields, triggering lazy loading and cycles). Base equality on a stable business key or the ID carefully. Avoid `toString` on associations.

### Q49. Database migrations (Flyway/Liquibase)
Version-controlled SQL migrations (`V1__init.sql`) applied at deploy. Set `spring.jpa.hibernate.ddl-auto=validate` (or `none`) in production, never `update`/`create`. Keep migrations backward compatible for rolling deploys.

### Q50. Connection pooling (HikariCP)
Default pool in Boot. Key settings: `maximum-pool-size` (small, often 10–20), `connection-timeout`, `max-lifetime` (shorter than DB/proxy timeouts), `leak-detection-threshold`. Size to the database's capacity across all instances.

### Q51. Spring MVC request flow *(Must-know)*
Request → `DispatcherServlet` → `HandlerMapping` finds the controller method → `HandlerAdapter` invokes it (argument resolvers bind parameters, `HttpMessageConverter` reads the body) → return value handled (`HttpMessageConverter` writes JSON, or view resolver) → response. Filters run before the servlet; interceptors wrap handler execution; `@ControllerAdvice` handles exceptions.

### Q52. Filter vs Interceptor vs AOP
| | Filter (Servlet) | `HandlerInterceptor` | AOP aspect |
|---|---|---|---|
| Level | Servlet container, all requests | Spring MVC handler | Any Spring bean method |
| Use | Security, CORS, logging, request wrapping | Pre/post handling, auth checks | Cross-cutting: transactions, caching, metrics |

### Q53. Spring AOP basics
Aspects, join points, pointcuts, advice (`@Before`, `@After`, `@Around`, `@AfterReturning`, `@AfterThrowing`). Implemented with proxies (JDK dynamic proxy for interfaces, CGLIB for classes). Same self-invocation limitation as `@Transactional`.
```java
@Aspect @Component
class TimingAspect {
    @Around("@annotation(Timed)")
    Object time(ProceedingJoinPoint pjp) throws Throwable {
        long t = System.nanoTime();
        try { return pjp.proceed(); } finally { log.info("{} took {} ms", pjp.getSignature(), (System.nanoTime() - t) / 1_000_000); }
    }
}
```

### Q54. Caching abstraction
```java
@EnableCaching
@Cacheable(value = "users", key = "#id")
public User get(Long id) { ... }
@CacheEvict(value = "users", key = "#id")
public void update(Long id, ...) { ... }
```
Use Caffeine (local) or Redis (shared). Define TTLs and eviction; remember proxy rules and serialization of cached values.

### Q55. Async and scheduling
`@EnableAsync` + `@Async` runs methods on a task executor (configure a bounded pool!). `@EnableScheduling` + `@Scheduled(cron = "...")`. In clustered setups use a lock (ShedLock) so a job runs once.

### Q56. RestClient, WebClient and RestTemplate
`RestClient` (Spring 6.1+, synchronous fluent API) is the modern replacement for `RestTemplate` (maintenance mode). `WebClient` (reactive, also usable blocking). Always set timeouts.
```java
User u = restClient.get().uri("/users/{id}", id).retrieve().body(User.class);
```
Declarative HTTP interfaces (`@HttpExchange`) generate clients from interfaces.

### Q57. Spring Security basics *(Must-know)*
Add `spring-boot-starter-security` and everything is secured by default (basic auth, generated password). Customize with a `SecurityFilterChain` bean (Spring Security 6 lambda DSL):
```java
@Bean
SecurityFilterChain security(HttpSecurity http) throws Exception {
    return http
        .csrf(csrf -> csrf.disable())                          // only for stateless token APIs
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(a -> a
            .requestMatchers("/actuator/health", "/api/auth/**").permitAll()
            .requestMatchers(HttpMethod.DELETE, "/api/**").hasRole("ADMIN")
            .anyRequest().authenticated())
        .oauth2ResourceServer(o -> o.jwt(Customizer.withDefaults()))
        .build();
}
```
`WebSecurityConfigurerAdapter` is removed.

### Q58. Authentication vs authorization; password encoding
Authentication = who you are; authorization = what you may do. Hash passwords with `PasswordEncoder` (`BCryptPasswordEncoder`, `Argon2PasswordEncoder`, or `DelegatingPasswordEncoder`). Never store plain text.

### Q59. Method security
```java
@EnableMethodSecurity
@PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
public void delete(Long userId) { ... }
```

### Q60. JWT in Spring Security
Use the resource server support (`oauth2ResourceServer().jwt()`) with a trusted issuer/JWKS URI; validate `iss`, `aud`, `exp`. For issuing tokens use an authorization server (Keycloak, Auth0, Spring Authorization Server) rather than hand-rolled code. Keep tokens short-lived; refresh tokens rotated.

### Q61. Testing in Spring Boot *(Must-know)*
- Unit tests: plain JUnit + Mockito (no Spring).
- `@WebMvcTest(UserController.class)`: controller slice with `MockMvc`; mock services via `@MockitoBean` (Boot 3.4+; earlier `@MockBean`).
- `@DataJpaTest`: JPA slice with in-memory or Testcontainers DB.
- `@SpringBootTest`: full context (`webEnvironment = RANDOM_PORT` with `TestRestTemplate`/`WebTestClient`).
- Testcontainers with `@ServiceConnection` (Boot 3.1+) for real PostgreSQL/Kafka/Redis.
```java
@WebMvcTest(UserController.class)
class UserControllerTest {
    @Autowired MockMvc mvc;
    @MockitoBean UserService service;
    @Test void getsUser() throws Exception {
        when(service.get(1L)).thenReturn(new UserDto(1L, "Ritesh Kumar"));
        mvc.perform(get("/api/users/1")).andExpect(status().isOk()).andExpect(jsonPath("$.name").value("Ritesh Kumar"));
    }
}
```

### Q62. Docker and deployment basics
Build layered images with Buildpacks (`./mvnw spring-boot:build-image`) or Jib, or a Dockerfile using layered jars. Set `JAVA_TOOL_OPTIONS`/`-XX:MaxRAMPercentage`, use health probes (`/actuator/health/liveness`, `/readiness`), graceful shutdown (`server.shutdown=graceful`), and run as non-root.

---

# 🟡 Part 3: Mid (3–5 years)

### Q63. How does the IoC container work? `BeanFactory` vs `ApplicationContext` *(Must-know)*
`BeanFactory` is the basic container (lazy bean creation). `ApplicationContext` adds eager singleton creation, events, internationalization, resource loading, environment/profiles, and AOP integration. In Boot you use `ApplicationContext` (`AnnotationConfigServletWebServerApplicationContext`). Bean definitions are registered first, then `BeanFactoryPostProcessor`s modify definitions, then beans are instantiated and `BeanPostProcessor`s wrap them.

### Q64. How are proxies created and why do they matter? *(Must-know)*
Features like `@Transactional`, `@Async`, `@Cacheable`, `@PreAuthorize` rely on `BeanPostProcessor`s that wrap beans in proxies (JDK for interfaces, CGLIB subclass by default in Boot). Consequences: self-invocation bypasses advice, `final` classes/methods cannot be proxied, `private` methods are not advised, and injecting the concrete class vs the interface matters only when `proxyTargetClass` is false.

### Q65. Conditional configuration and writing your own starter
Create `my-spring-boot-autoconfigure` with a `@AutoConfiguration` class guarded by conditions, register it in `META-INF/spring/...AutoConfiguration.imports`, expose `@ConfigurationProperties`, and provide a thin `my-spring-boot-starter` pom that depends on it. Use `@ConditionalOnMissingBean` so applications can override.

### Q66. Application events
```java
applicationEventPublisher.publishEvent(new OrderPlaced(orderId));
@EventListener void on(OrderPlaced e) { ... }
@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT) void after(OrderPlaced e) { ... }
```
Synchronous by default; `@Async` makes listeners async. `@TransactionalEventListener` avoids sending side effects before the commit succeeds. For reliability across restarts use a transactional outbox.

### Q67. Spring MVC internals: argument resolvers, converters, validation
`HandlerMethodArgumentResolver` binds parameters; `HttpMessageConverter` (Jackson) maps JSON; `Converter`/`Formatter` convert strings; `Validator` runs Bean Validation. Customize via `WebMvcConfigurer` (CORS, interceptors, resolvers). Don't use `@EnableWebMvc` in Boot (it disables Boot's MVC defaults).

### Q68. CORS and CSRF in Spring
CORS: configure via `CorsConfigurationSource` in the security chain (not only `@CrossOrigin`), allow exact origins. CSRF: protects cookie/session-based apps; can be disabled for stateless APIs using bearer tokens in headers. Do not disable CSRF for browser form/session apps.

### Q69. Global error handling and `ProblemDetail`
Enable `spring.mvc.problemdetails.enabled=true` for standard RFC 9457 responses for built-in exceptions, extend `ResponseEntityExceptionHandler` for custom mapping, and add fields like `errorCode`, `traceId`. Keep internal messages out of 5xx responses.

### Q70. JPA and Hibernate internals *(Must-know)*
Persistence context (first-level cache) per transaction; entity states: transient, managed, detached, removed; dirty checking flushes changes at commit (or before queries in `FlushMode.AUTO`); `save` on a managed entity is redundant. `EntityManager.find` hits the cache first. Second-level cache is optional.

### Q71. Common JPA performance problems
N+1 queries, `EAGER` fetching defaults on `@ManyToOne`/`@OneToOne`, loading entire entities when a projection suffices, huge `IN` lists, missing indexes, open-session-in-view hiding lazy loads in controllers (`spring.jpa.open-in-view=false` recommended), `IDENTITY` ids disabling JDBC batching, and large unpaginated result sets.

### Q72. Batching and bulk operations
Set `hibernate.jdbc.batch_size`, use `SEQUENCE` generators (with allocation size) for insert batching, flush/clear in chunks, use `@Modifying` queries or `JdbcTemplate`/`saveAll` for bulk updates. Be aware that bulk JPQL updates bypass the persistence context.

### Q73. Optimistic and pessimistic locking
Optimistic: `@Version` column; conflicting updates throw `OptimisticLockingFailureException` (retry or return 409). Pessimistic: `@Lock(LockModeType.PESSIMISTIC_WRITE)` issues `SELECT ... FOR UPDATE`. Prefer optimistic for web workloads; use pessimistic for hot rows with short transactions.

### Q74. Transactions in depth: pitfalls
Keep transactions short; never call remote services inside; understand `REQUIRES_NEW` (separate connection, can deadlock with the outer one); `readOnly` for queries; avoid `@Transactional` on the controller; handle `UnexpectedRollbackException` when an inner participating method marks rollback-only; remember transactions are thread-bound (not in `@Async`, parallel streams or virtual-thread hops that switch context).

### Q75. Spring Data beyond JPA
Spring Data MongoDB, Redis, JDBC (simple aggregate-oriented), R2DBC (reactive), Elasticsearch, Neo4j. Spring Data JDBC avoids lazy loading and session complexity and suits DDD aggregates.

### Q76. Messaging with Kafka and RabbitMQ
Spring for Apache Kafka (`KafkaTemplate`, `@KafkaListener`) and Spring AMQP. Configure serializers, consumer groups, retries with backoff, dead-letter topics (`DefaultErrorHandler` + `DeadLetterPublishingRecoverer`), idempotent consumers, and batch listeners. Use the transactional outbox for DB + message consistency.

### Q77. Spring Cloud essentials
Config Server, service discovery (Eureka/Consul/Kubernetes-native), Spring Cloud Gateway, OpenFeign/HTTP interfaces, Resilience4j, Spring Cloud Stream, Sleuth replaced by Micrometer Tracing. In Kubernetes many teams use ConfigMaps/Secrets and the platform's service discovery instead.

### Q78. Resilience4j with Spring
```java
@CircuitBreaker(name = "inventory", fallbackMethod = "fallback")
@Retry(name = "inventory")
@TimeLimiter(name = "inventory")
public CompletableFuture<Stock> stock(String sku) { ... }
```
Configure thresholds, wait durations and backoff in YAML; retry only idempotent calls; monitor metrics.

### Q79. Observability: Micrometer, tracing, logging
Micrometer for metrics (`/actuator/prometheus`), Micrometer Tracing + OpenTelemetry for traces, `traceId`/`spanId` in logs (MDC), `@Observed` for custom spans. Use RED metrics and JVM/Hikari/Tomcat metrics; avoid high-cardinality tags.

### Q80. Virtual threads in Spring Boot 3.2+
`spring.threads.virtual.enabled=true` runs Tomcat request handling and `@Async`/scheduling on virtual threads (Java 21). Benefits: simple blocking code scales to many concurrent requests. Caveats: size DB pools and downstream limits (the DB becomes the bottleneck), watch pinning with `synchronized` + blocking, avoid ThreadLocal-heavy designs.

### Q81. WebFlux vs MVC
WebFlux is reactive (Netty, `Mono`/`Flux`, backpressure) for streaming and very high concurrency with non-blocking drivers end to end. MVC is simpler, has richer blocking ecosystem support (JPA), and with virtual threads covers most use cases. Don't mix blocking calls inside reactive chains.

### Q82. Securing REST APIs end to end
HTTPS, validated input, method security, short-lived JWTs via a resource server, least-privilege roles/scopes, rate limiting at the gateway, CORS allow-list, secure headers, secrets in Vault/Secrets Manager, dependency scanning, audit logging, and tests for authorization (including IDOR).

### Q83. OAuth2/OIDC with Spring
Resource server (validate bearer JWTs), OAuth2 client (login with Google/Keycloak), and authorization server. Use the Authorization Code flow with PKCE for public clients; never the implicit or password flow. Map claims to authorities with a `JwtAuthenticationConverter`.

### Q84. Testing strategy and speed
Test pyramid: many fast unit tests, focused slice tests, fewer integration tests with Testcontainers, a few end-to-end. Reuse containers (singleton pattern), avoid unnecessary `@DirtiesContext`, and keep the Spring context cache effective (same configuration across tests).

### Q85. Profiles, configuration and secrets in production
Externalize configuration through environment variables/ConfigMaps, secrets via Vault, Kubernetes Secrets, or cloud secret managers (Spring Cloud Vault/AWS). Never bake secrets into images. Use `@ConfigurationProperties` with validation so misconfiguration fails at startup.

### Q86. Graceful shutdown and lifecycle in Kubernetes
`server.shutdown=graceful` and `spring.lifecycle.timeout-per-shutdown-phase=30s`; readiness probes flip to `OUT_OF_SERVICE` on shutdown; set `preStop` sleep so the load balancer drains; ensure consumers and schedulers stop cleanly.

### Q87. Native images and AOT
Spring Boot 3 supports GraalVM native images via AOT processing (`./mvnw -Pnative native:compile`): faster startup and lower memory, but longer builds, reflection hints, and some library limits. Consider CRaC or AppCDS as alternatives. Verify library compatibility.

### Q88. API versioning and documentation
URI (`/api/v1`), header or media-type versioning; Spring Framework 7 adds first-class API versioning support (verify). Document with OpenAPI (springdoc), publish a changelog, deprecate gradually, and run contract tests (Spring Cloud Contract, Pact).

### Q89. File upload and download
`MultipartFile` with size limits (`spring.servlet.multipart.max-file-size`), stream to object storage (S3) rather than holding in memory, validate content type, and return files via `ResponseEntity<Resource>` or `StreamingResponseBody`.

### Q90. Internationalization and formatting
`MessageSource`, `LocaleResolver`, `messages_xx.properties`, validation messages. For APIs prefer error codes and let clients localize.

### Q91. Scheduling in clusters
`@Scheduled` runs on every instance. Use ShedLock, Quartz (clustered JDBC store), Kubernetes CronJobs, or a queue-based scheduler so jobs run once. Make jobs idempotent and observable.

### Q92. Common code quality practices
Constructor injection, thin controllers, service layer with business rules, repositories only for data, DTO mapping, ArchUnit tests for layering, static analysis (SpotBugs/Sonar), formatter (Spotless), and meaningful logging without PII.


---

# 🟠 Part 4: Senior (5–7 years)

### Q93. Designing a production-grade Spring Boot service *(Architecture)*
Layered or hexagonal structure (controller → service → repository, domain free of framework annotations where practical), typed `@ConfigurationProperties`, DTOs and mappers, global error handling with `ProblemDetail`, Flyway migrations, Hikari pool tuning, security via a resource server, observability (Micrometer + OpenTelemetry), resilience (timeouts, retries, circuit breakers), graceful shutdown, health probes, layered container images, CI/CD with tests and scans, and load tests before launch.

### Q94. Startup time and memory optimization
Remove unused starters, lazy initialization (`spring.main.lazy-initialization=true`, with caveats: errors appear later), AppCDS / Spring AOT cache, CRaC, native images for fast-start workloads, avoid classpath scanning of huge packages, tune JVM flags (`-XX:TieredStopAtLevel=1` for short-lived tasks), and measure with startup actuator (`/actuator/startup`).

### Q95. Thread model and capacity planning
Tomcat default max threads 200 (platform threads) with a queue (`accept-count`). Each in-flight request holds a thread and often a DB connection: the DB pool (for example 20) becomes the real concurrency limit, so more Tomcat threads do not help. With virtual threads, requests are cheap but downstream limits (DB, HTTP calls) still require bulkheads (semaphores) and timeouts. Plan with Little's Law: concurrency = throughput × latency.

### Q96. Transaction boundaries and long-running workflows
Keep database transactions short. For multi-step business flows spanning services use sagas (orchestration or choreography), compensations, and idempotency keys. Don't hold a transaction while waiting on HTTP, messaging acknowledgments or user input.

### Q97. Transactional outbox in Spring
Within one local transaction write the business row and an `outbox` row. A poller or CDC (Debezium) publishes outbox rows to Kafka and marks them sent. Consumers dedupe by event ID. This avoids dual-write inconsistencies without distributed transactions.

### Q98. Idempotent APIs and consumers
Require an `Idempotency-Key` header for unsafe operations, store key + response (unique constraint), return the stored result on repeats. For Kafka consumers, store processed message IDs or make updates naturally idempotent (upserts, version checks).

### Q99. Caching strategy
Local Caffeine for small hot data, Redis for shared caches, cache-aside pattern, TTL + jitter to avoid thundering herd, request coalescing for expensive loads, careful invalidation (event-based), and no caching of user-specific data in shared keys. Monitor hit rate and eviction.

### Q100. Rate limiting and protection
At the edge/gateway (Spring Cloud Gateway with Redis rate limiter, Envoy, Nginx, Cloudflare), and in the app with Bucket4j for specific operations. Return `429` with `Retry-After`. Add request size limits and timeouts.

### Q101. Multi-tenancy
Resolve the tenant (subdomain/header/JWT claim) in a filter and store in a request-scoped holder or `ScopedValue`/MDC; strategies: shared schema with `tenant_id` and Hibernate filters/row-level security, schema per tenant, or database per tenant (Hibernate `MultiTenantConnectionProvider`). Test isolation explicitly.

### Q102. Hibernate performance tuning checklist
`open-in-view=false`, fetch plans via entity graphs/DTO projections, `default_batch_fetch_size`, JDBC batching with sequences, second-level cache for read-mostly reference data, statement logging in tests to assert query counts (datasource-proxy), proper indexes, avoiding `findAll()` on large tables, and `@Transactional(readOnly = true)` for queries.

### Q103. Handling large data and streaming
Stream results with `Stream<Entity>` inside a read-only transaction (close the stream), use `ScrollableResults`/keyset pagination, `JdbcTemplate` row callbacks for exports, write responses with `StreamingResponseBody`, and run heavy exports as async jobs delivering a file link.

### Q104. Spring Batch
Chunk-oriented processing (read → process → write) with job repository, restartability, skip/retry policies, partitioning, and scheduling via CronJobs or orchestrators. Use for ETL and large periodic jobs rather than request threads.

### Q105. Event-driven architecture with Spring
Spring Cloud Stream or Spring Kafka, schema registry (Avro/Protobuf), consumer groups, partition keys for ordering, retry topics and DLQs, exactly-once semantics only where needed (Kafka transactions + idempotent writes), consumer lag monitoring, and backpressure through bounded concurrency.

### Q106. Securing microservices
mTLS or service mesh for service-to-service, JWT propagation with audience checks, token exchange for downstream calls, scope/role-based method security, secret rotation, network policies, input validation at every boundary, and centralized audit logs. Zero trust: authenticate and authorize every call.

### Q107. API gateway and BFF
Spring Cloud Gateway: routing, filters (auth, rate limit, retries, circuit breakers), request logging, CORS, header transforms. A BFF aggregates calls for a UI. Keep business rules in services, not in the gateway.

### Q108. Database access without JPA when needed
`JdbcClient` (Spring 6.1), `JdbcTemplate`, jOOQ, or MyBatis for complex reporting queries and bulk operations where JPA's abstraction is costly. Mixing is fine: JPA for aggregates, SQL for reports.

### Q109. Contract and integration testing across services
Consumer-driven contracts (Pact, Spring Cloud Contract), WireMock for HTTP stubs, Testcontainers for infrastructure, and a small number of end-to-end tests in a staging environment. Version APIs and test backward compatibility.

### Q110. Zero-downtime deployments and migrations
Rolling or blue/green with readiness probes, graceful shutdown, backward-compatible schema changes (expand → migrate → contract), feature flags, and versioned message schemas. Don't run destructive migrations together with the code that needs them.

### Q111. Diagnosing production problems in Spring apps *(Must-know)*
Check `/actuator/health`, metrics (latency, error rate, Hikari pending threads, Tomcat busy threads, GC), logs by trace ID, thread dumps (`/actuator/threaddump`, `jcmd`), heap dumps for leaks, `/actuator/conditions` and `/actuator/configprops` for configuration issues, SQL logs with query counts for N+1, and JFR for CPU/allocation hotspots. Mitigate first (scale, rollback, feature flag) and then root-cause.

### Q112. Upgrading Spring Boot versions
Move one minor/major at a time, read migration guides, use the `spring-boot-properties-migrator`, OpenRewrite recipes, and update dependencies (Hibernate, Spring Security, Jackson). Boot 2 → 3 requires Java 17+ and the `javax.*` → `jakarta.*` namespace change. Run the full test suite and canary-deploy.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q113. Spring Boot vs Quarkus vs Micronaut vs Node vs .NET: how do you decide? *(Decision)*
| | Spring Boot | Quarkus / Micronaut | Node.js (NestJS/Express) | .NET |
|---|---|---|---|---|
| Strengths | Huge ecosystem, talent pool, mature libraries | Fast startup, low memory, native-first | JS everywhere, fast iteration | Great tooling, performance |
| Weaknesses | Heavier startup/memory (improving: AOT, CRaC) | Smaller ecosystem and community | CPU-bound limits, typing discipline | Different ecosystem and hosting profile |
| Best fit | Enterprise services, complex domains | Serverless/Kubernetes with tight footprints | BFFs, real-time APIs | Microsoft-centric orgs |
Choose by team skills, existing platform, ecosystem needs, startup/memory constraints and operational maturity.

### Q114. Modular monolith vs microservices *(Decision)*
Start with a modular monolith (Spring Modulith can verify module boundaries and publish events between modules). Split into microservices only when independent scaling, team ownership or release cadence justify the distributed-systems cost (network failures, data consistency, observability, versioning, operations).

### Q115. Domain-driven design with Spring
Bounded contexts as modules/services, aggregates as consistency boundaries (Spring Data JDBC fits well), domain events via `ApplicationEventPublisher`, anti-corruption layers for legacy systems, and domain code free of web/persistence annotations where practical.

### Q116. Platform engineering and golden path
Starter templates (parent POM/BOM, shared autoconfigured starters for logging/security/observability), standard Docker/Helm, CI/CD pipelines, internal libraries with semantic versions, ADRs, and developer portals. Automate upgrades with Renovate/OpenRewrite.

### Q117. Consistency in distributed systems
Avoid 2PC. Use sagas with compensations, outbox + CDC, idempotency, optimistic concurrency and well-defined ownership of data. Document consistency guarantees per use case (strong vs eventual).

### Q118. Reliability engineering
SLOs and error budgets, alert on symptoms, runbooks, chaos testing, load testing in CI, capacity planning, graceful degradation (fallbacks, feature flags), multi-AZ deployments, backups and restore drills, and blameless post-mortems.

### Q119. Security program
Threat modeling, SAST/DAST/SCA, SBOM, secrets management, least privilege, patching SLAs (Spring4Shell and Log4Shell-style incident plans), penetration testing, audit logging, compliance (GDPR, PCI, SOC2), and security champions in teams.

### Q120. Cost and performance governance
Right-size pods and JVM heap, tune pool sizes, autoscale on latency/queue depth, native image or CRaC for bursty workloads, caching, efficient serialization, and track cost per request/tenant.

### Q121. API governance
OpenAPI-first design, Spectral linting, breaking-change detection (oasdiff), versioning and deprecation policy, standard error format (ProblemDetail), pagination and filtering standards, SDK generation, and developer docs.

### Q122. Migration strategies
Strangler pattern for legacy systems; Java 8/Boot 2 → Java 21/Boot 3 via automated recipes; monolith extraction by bounded context with anti-corruption layers; database migration with dual writes/CDC; always keep a rollback path and measure outcomes.

### Q123. Hiring and mentoring (Spring depth)
Interview for: DI/IoC understanding, proxies and transactions, JPA behavior (N+1, lazy loading, flush), security fundamentals, testing slices, and production debugging. Mentor on constructor injection, thin controllers, transaction scoping and observability habits.

### Q124. Technical debt and roadmap
Debt register: unsupported Boot/Java versions, circular dependencies, fat services, missing tests, field injection, N+1 hot spots, ad-hoc config, noisy logs. Reserve capacity each sprint and align with the Spring support calendar (OSS support windows are limited: verify on spring.io).

---

# 💻 Part 6: Coding / Machine-Coding Tasks

> Practice from memory. State validation, transactions, security and tests.

### C1. CRUD REST API with validation and pagination
```java
public record CreateUserRequest(@NotBlank String name, @Email @NotBlank String email) {}
public record UserDto(Long id, String name, String email) {}

@Entity @Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private String name;
    @Column(nullable = false, unique = true) private String email;
    protected User() {}
    public User(String name, String email) { this.name = name; this.email = email; }
    // getters
}

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
}

@Service
public class UserService {
    private final UserRepository repo;
    public UserService(UserRepository repo) { this.repo = repo; }

    @Transactional
    public UserDto create(CreateUserRequest r) {
        if (repo.existsByEmail(r.email())) throw new ConflictException("Email already exists");
        User u = repo.save(new User(r.name(), r.email()));
        return new UserDto(u.getId(), u.getName(), u.getEmail());
    }
    @Transactional(readOnly = true)
    public Page<UserDto> list(Pageable p) {
        return repo.findAll(p).map(u -> new UserDto(u.getId(), u.getName(), u.getEmail()));
    }
    @Transactional(readOnly = true)
    public UserDto get(Long id) {
        return repo.findById(id).map(u -> new UserDto(u.getId(), u.getName(), u.getEmail()))
            .orElseThrow(() -> new NotFoundException("User " + id + " not found"));
    }
}

@RestController @RequestMapping("/api/users")
public class UserController {
    private final UserService service;
    public UserController(UserService service) { this.service = service; }

    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public UserDto create(@Valid @RequestBody CreateUserRequest r) { return service.create(r); }
    @GetMapping("/{id}") public UserDto get(@PathVariable Long id) { return service.get(id); }
    @GetMapping public Page<UserDto> list(@PageableDefault(size = 20) Pageable p) { return service.list(p); }
}
```

### C2. Global exception handler
```java
@RestControllerAdvice
class ApiExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler(NotFoundException.class)
    ProblemDetail notFound(NotFoundException e) { return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage()); }
    @ExceptionHandler(ConflictException.class)
    ProblemDetail conflict(ConflictException e) { return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, e.getMessage()); }
    @ExceptionHandler(Exception.class)
    ProblemDetail unexpected(Exception e) {
        log.error("Unhandled", e);
        return ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error");
    }
}
```

### C3. Stateless JWT resource server security
```java
@Configuration @EnableMethodSecurity
class SecurityConfig {
    @Bean
    SecurityFilterChain chain(HttpSecurity http) throws Exception {
        return http.csrf(c -> c.disable())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(a -> a.requestMatchers("/actuator/health/**").permitAll().anyRequest().authenticated())
            .oauth2ResourceServer(o -> o.jwt(Customizer.withDefaults()))
            .build();
    }
}
// application.yml: spring.security.oauth2.resourceserver.jwt.issuer-uri: https://auth.example.com/
```

### C4. `@ConfigurationProperties` with validation
```java
@Validated
@ConfigurationProperties(prefix = "app.payments")
public record PaymentsProperties(@NotBlank String baseUrl, @DefaultValue("3s") Duration timeout, @Min(1) int maxRetries) {}
```

### C5. RestClient with timeouts and error handling
```java
@Bean
RestClient paymentsClient(RestClient.Builder b, PaymentsProperties p) {
    var factory = new JdkClientHttpRequestFactory(HttpClient.newBuilder().connectTimeout(p.timeout()).build());
    factory.setReadTimeout(p.timeout());
    return b.baseUrl(p.baseUrl()).requestFactory(factory)
        .defaultStatusHandler(HttpStatusCode::is5xxServerError, (req, res) -> { throw new UpstreamException(res.getStatusCode()); })
        .build();
}
```

### C6. Caching with Caffeine
```java
@Configuration @EnableCaching
class CacheConfig {
    @Bean CacheManager cacheManager() {
        var m = new CaffeineCacheManager("users");
        m.setCaffeine(Caffeine.newBuilder().maximumSize(10_000).expireAfterWrite(Duration.ofMinutes(5)));
        return m;
    }
}
```

### C7. Retry and circuit breaker with Resilience4j
```java
@Service
class InventoryClient {
    @CircuitBreaker(name = "inventory", fallbackMethod = "fallback")
    @Retry(name = "inventory")
    public Stock stock(String sku) { return client.get().uri("/stock/{sku}", sku).retrieve().body(Stock.class); }
    Stock fallback(String sku, Throwable t) { return Stock.unknown(sku); }
}
```

### C8. Kafka producer and consumer with DLT
```java
@Service class Publisher {
    private final KafkaTemplate<String, OrderPlaced> kafka;
    void publish(OrderPlaced e) { kafka.send("orders", e.orderId(), e); }
}
@Component class Consumer {
    @KafkaListener(topics = "orders", groupId = "billing")
    void on(OrderPlaced e) { billing.handle(e); }              // must be idempotent
}
@Bean DefaultErrorHandler errorHandler(KafkaTemplate<Object, Object> t) {
    return new DefaultErrorHandler(new DeadLetterPublishingRecoverer(t), new FixedBackOff(1000L, 3));
}
```

### C9. Transactional outbox (sketch)
```java
@Transactional
public void placeOrder(Order o) {
    orderRepo.save(o);
    outboxRepo.save(new OutboxEvent("OrderPlaced", o.getId(), toJson(o)));      // same transaction
}
@Scheduled(fixedDelay = 1000)
@SchedulerLock(name = "outbox")
void publishPending() { outboxRepo.findPending(100).forEach(e -> { kafka.send(...).join(); e.markSent(); }); }
```

### C10. Slice test with MockMvc
See Q61. Add a validation test: `mvc.perform(post("/api/users").contentType(APPLICATION_JSON).content("{}")).andExpect(status().isBadRequest())`.

### C11. Repository test with Testcontainers
```java
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class UserRepositoryTest {
    @Container @ServiceConnection static PostgreSQLContainer<?> pg = new PostgreSQLContainer<>("postgres:16");
    @Autowired UserRepository repo;
    @Test void findsByEmail() {
        repo.save(new User("Ritesh Kumar", "r@example.com"));
        assertThat(repo.existsByEmail("r@example.com")).isTrue();
    }
}
```

### C12. Full integration test
```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ApiIT {
    @Autowired TestRestTemplate rest;
    @Test void health() { assertThat(rest.getForEntity("/actuator/health", String.class).getStatusCode().is2xxSuccessful()).isTrue(); }
}
```

### C13. Custom validator
```java
@Target(FIELD) @Retention(RUNTIME) @Constraint(validatedBy = StrongPasswordValidator.class)
public @interface StrongPassword { String message() default "weak password"; Class<?>[] groups() default {}; Class<? extends Payload>[] payload() default {}; }
class StrongPasswordValidator implements ConstraintValidator<StrongPassword, String> {
    public boolean isValid(String v, ConstraintValidatorContext c) { return v != null && v.length() >= 12 && v.matches(".*\\d.*"); }
}
```

### C14. Request logging filter with correlation ID (MDC)
```java
@Component
class CorrelationFilter extends OncePerRequestFilter {
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws IOException, ServletException {
        String id = Optional.ofNullable(req.getHeader("X-Request-Id")).orElse(UUID.randomUUID().toString());
        MDC.put("requestId", id); res.setHeader("X-Request-Id", id);
        try { chain.doFilter(req, res); } finally { MDC.clear(); }
    }
}
```

### C15. Async with a bounded executor
```java
@Bean(name = "ioExecutor")
Executor ioExecutor() {
    var e = new ThreadPoolTaskExecutor();
    e.setCorePoolSize(8); e.setMaxPoolSize(16); e.setQueueCapacity(200);
    e.setThreadNamePrefix("io-"); e.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
    return e;
}
@Async("ioExecutor") public CompletableFuture<Report> build() { ... }
```

### C16. Flyway migration example
```sql
-- V2__add_orders.sql
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  total_cents BIGINT NOT NULL CHECK (total_cents >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_orders_user ON orders(user_id);
```

### C17. Dockerfile (layered)
```dockerfile
FROM eclipse-temurin:21-jre AS runtime
WORKDIR /app
RUN useradd -r app
COPY target/app.jar app.jar
USER app
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75"
ENTRYPOINT ["java", "-jar", "app.jar"]
```
Or `./mvnw spring-boot:build-image`.

### C18. Custom actuator health indicator
```java
@Component
class PaymentsHealth implements HealthIndicator {
    public Health health() { return ping() ? Health.up().build() : Health.down().withDetail("reason", "timeout").build(); }
}
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. `NoSuchBeanDefinitionException` / `UnsatisfiedDependencyException`
No bean of that type: missing annotation, class outside the component scan package, missing starter, conditional config not matched, or profile not active. Check packages relative to the `@SpringBootApplication` class, `/actuator/conditions`, and `--debug` output.

### D2. `NoUniqueBeanDefinitionException`
Several beans of the same type. Use `@Primary`, `@Qualifier`, or inject a collection.

### D3. `BeanCurrentlyInCreationException` (circular dependency)
Refactor to break the cycle (extract a collaborator, use events); avoid `@Lazy` hacks as a long-term solution.

### D4. App fails to start: `Failed to configure a DataSource`
No JDBC URL/driver configured, wrong profile, missing env variables, or excluded auto-configuration. Provide `spring.datasource.*` or exclude `DataSourceAutoConfiguration` if the app has no DB.

### D5. `Port 8080 was already in use`
Another process uses the port. Change `server.port`, use `0` in tests, stop the old process.

### D6. `LazyInitializationException`
Lazy collection accessed outside a transaction. Fetch what you need in the service (join fetch, entity graph, DTO projection) and keep `open-in-view` disabled.

### D7. `@Transactional` has no effect
Self-invocation, non-public method, non-Spring-managed object, swallowed exception, checked exception without `rollbackFor`. Verify the proxy (`AopUtils.isAopProxy`) and enable `logging.level.org.springframework.transaction=TRACE`.

### D8. N+1 queries / slow endpoints
Enable SQL logging with a query counter (datasource-proxy / Hibernate statistics), fix with join fetch, entity graphs, batch fetching or projections.

### D9. `HikariPool-1 - Connection is not available, request timed out`
Pool exhausted: slow queries, long transactions, leaks, or too much concurrency. Enable `leak-detection-threshold`, look at thread dumps for threads waiting on connections, add timeouts, reduce transaction scope.

### D10. `HttpMessageNotReadableException` (400)
Malformed JSON, wrong types or missing body. Check `Content-Type`, DTO fields, and Jackson settings; return a clear error via the exception handler.

### D11. `HttpMediaTypeNotSupportedException` (415) / `HttpRequestMethodNotSupportedException` (405)
Wrong `Content-Type` or HTTP method for the mapping. Check `consumes`/`produces` and client headers.

### D12. 403 Forbidden on POST/PUT (CSRF) or 401 everywhere after adding Security
Default security protects everything; POST without a CSRF token fails for session apps. For stateless APIs disable CSRF and configure authentication properly; for browsers keep CSRF with tokens.

### D13. CORS errors in the browser
Configure CORS in the Spring Security chain (`http.cors(Customizer.withDefaults())` plus a `CorsConfigurationSource` bean); filters can reject the preflight before MVC sees it. Allow exact origins/methods/headers.

### D14. `OutOfMemoryError` / container OOMKilled
Heap dump, find the dominator (caches, large result sets, session data). Set `MaxRAMPercentage`, cap thread pools and caches, and stream big results.

### D15. Property not picked up
Wrong prefix or relaxed binding mismatch, profile-specific file not loaded, env var naming (`MY_APP_NAME` for `my.app.name`), missing `@ConfigurationPropertiesScan`. Inspect `/actuator/configprops` and `/actuator/env`.

### D16. Different behavior between environments
Profiles, env vars, database differences (H2 vs PostgreSQL SQL dialect), time zones, JDK versions, and feature flags. Test against the same DB engine with Testcontainers.

### D17. Slow startup in Kubernetes (probe failures, restarts)
Increase startup probe allowances, use `/actuator/health/liveness` and `/readiness` correctly, reduce startup work (migrations as separate jobs, lazy init), and give enough CPU (JIT warm-up and class loading need CPU).

### D18. Scheduled job runs twice
Multiple instances. Use ShedLock/Quartz cluster mode or a single CronJob; make the job idempotent.

### D19. Message consumed repeatedly / poison messages
Consumer throws and gets retried forever. Configure a bounded retry with backoff and a dead-letter topic; make handlers idempotent; log message keys.

### D20. Memory growth from `@Async` or unbounded queues
Default executors can queue without bound. Define bounded executors with a rejection policy and monitor queue depth.

### D21. JSON serialization problems
Infinite recursion with bidirectional entities (`@JsonIgnore` or, better, DTOs), `LazyInitializationException` during serialization (return DTOs), date format issues (`jackson.serialization.write-dates-as-timestamps=false`, `JavaTimeModule` is auto-registered in Boot).

### D22. Debugging method (say this in interviews)
Read the root cause in the stack trace ("Caused by" at the bottom), check configuration and conditions, reproduce in a slice test, inspect SQL and metrics, take thread/heap dumps when needed, fix, add a regression test, and add monitoring.


---

# 🧩 Part 8: Tricky Questions

### T1. Why does `@Transactional` on a method called from the same class not start a transaction?
Spring applies transactions through a proxy. A call from within the same object (`this.method()`) bypasses the proxy, so no advice runs. Move the method to another bean, inject a self reference carefully, or use `TransactionTemplate`.

### T2. Does `@Transactional` roll back on checked exceptions?
No, by default only on `RuntimeException` and `Error`. Use `@Transactional(rollbackFor = Exception.class)` if you want rollback on checked exceptions.

### T3. Is a Spring singleton bean thread-safe?
No. Singleton only means one instance per container. Thread safety depends on your code: keep beans stateless or protect mutable state.

### T4. Singleton scope vs the Singleton pattern
Spring singleton is one instance per `ApplicationContext` (and per bean name), not per JVM or classloader. Two contexts can have two instances.

### T5. Why inject a prototype bean into a singleton and always get the same instance?
Injection happens once at singleton creation. Use `ObjectProvider<T>`, `@Lookup`, or a scoped proxy (`proxyMode`) to get fresh instances.

### T6. Constructor injection with multiple constructors
Spring needs `@Autowired` on one constructor if there is more than one. With a single constructor, `@Autowired` is optional.

### T7. `@Component` on a class outside the main package
It is not scanned because `@ComponentScan` defaults to the package of the main class. Move it, or set `scanBasePackages`.

### T8. `@Configuration` vs `@Component` with `@Bean` methods
In `@Configuration` (full mode) CGLIB proxies ensure that calling one `@Bean` method from another returns the same singleton. In `@Component` (lite mode) it creates a new object each call. Use `@Configuration` (or `proxyBeanMethods = false` when methods do not call each other).

### T9. `spring.jpa.hibernate.ddl-auto=update` in production
Dangerous: unpredictable schema changes without review and rollback. Use migrations (Flyway/Liquibase) and `validate`.

### T10. `save()` on a managed entity: is it needed?
No; dirty checking flushes changes at commit. `save` is needed for new entities (or detached ones to merge). Calling `save` repeatedly is harmless but misleading.

### T11. `findById` vs `getReferenceById`
`findById` hits the database and returns `Optional`. `getReferenceById` returns a lazy proxy without a query; accessing it outside a session throws `LazyInitializationException` and missing rows fail later.

### T12. `@Transactional(readOnly = true)` means what exactly?
It is a hint: Hibernate skips dirty checking flushes and some drivers/DBs can optimize. It does not prevent writes at the database level in all setups. Use it for query methods.

### T13. Why can `@Async` fail silently?
Exceptions in void async methods go to an `AsyncUncaughtExceptionHandler`, not the caller. Return `CompletableFuture` and handle errors, and remember the self-invocation limitation.

### T14. Does `@Scheduled` run concurrently with itself?
By default the scheduler has a single thread, so runs queue behind each other; `fixedRate` can pile up. Configure a pool, use `fixedDelay`, and add locks for multi-instance setups.

### T15. Why do `@PostConstruct` methods run before the proxy exists?
`@PostConstruct` runs during initialization before post-processors create the proxy, so calling transactional methods of `this` inside it has no transaction. Use `ApplicationReadyEvent` or `SmartInitializingSingleton` for work needing full proxies.

### T16. `@Value` vs `@ConfigurationProperties`
`@Value` supports SpEL but is not type-safe in bulk and has no relaxed binding for complex structures. `@ConfigurationProperties` binds hierarchies, validates, and documents properties.

### T17. Why prefer constructor injection over field injection?
Immutability, no reflection needed in tests, explicit dependencies, fail-fast on missing beans, and easy detection of too many dependencies (a design smell).

### T18. What does `@SpringBootTest` load?
The full application context (all beans), unless limited by `classes` or slices. It is slow; prefer slices (`@WebMvcTest`, `@DataJpaTest`) for focused tests.

### T19. `@MockBean` and context caching
Each distinct combination of mocks creates a new Spring context, slowing the suite. Group tests with the same configuration or use plain Mockito where Spring is not needed.

### T20. Does disabling CSRF make an API insecure?
Not for stateless APIs authenticated via a bearer token in the `Authorization` header (browsers don't attach it automatically). It is risky for cookie/session authentication.

### T21. `permitAll()` on a path but still getting 401/403?
Path matchers may not match (ordering, context path, trailing slashes), the filter chain applies to a different pattern, or CSRF blocks non-GET requests. Check `requestMatchers` order: first match wins.

### T22. Why is `open-in-view` enabled by default and why disable it?
It keeps the persistence session open during view rendering so lazy loads work in controllers, but it hides N+1 problems and holds DB connections longer. Disable it and fetch deliberately.

### T23. `ResponseEntity` vs `@ResponseStatus`
`ResponseEntity` controls status, headers and body dynamically per request; `@ResponseStatus` fixes a status declaratively.

### T24. Same bean type, different configurations
Define multiple `@Bean`s with `@Qualifier` names (for example two `RestClient`s), or use `@ConfigurationProperties` per client.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

| Question | Short answer |
|---|---|
| Main annotation? | `@SpringBootApplication` |
| Default server? | Tomcat |
| Default logging? | Logback via SLF4J |
| Default connection pool? | HikariCP |
| Default scope? | Singleton |
| Recommended injection? | Constructor |
| REST controller annotation? | `@RestController` |
| Read path variable? | `@PathVariable` |
| Read query param? | `@RequestParam` |
| Read JSON body? | `@RequestBody` |
| Validate input? | `@Valid` + Bean Validation |
| Global error handling? | `@RestControllerAdvice` |
| Standard error format? | `ProblemDetail` (RFC 9457) |
| Config file? | `application.yml` |
| Typed config? | `@ConfigurationProperties` |
| Environment-specific config? | Profiles |
| Production endpoints? | Actuator |
| Metrics library? | Micrometer |
| Data access abstraction? | Spring Data JPA |
| Transaction annotation? | `@Transactional` |
| Rollback default? | Unchecked exceptions |
| Cache annotation? | `@Cacheable` |
| Async annotation? | `@Async` |
| Schedule annotation? | `@Scheduled` |
| HTTP client (modern)? | `RestClient` |
| Reactive client? | `WebClient` |
| Security config bean? | `SecurityFilterChain` |
| Password encoder? | BCrypt / Argon2 |
| JWT validation? | `oauth2ResourceServer().jwt()` |
| Web slice test? | `@WebMvcTest` |
| JPA slice test? | `@DataJpaTest` |
| Full test? | `@SpringBootTest` |
| Real DB in tests? | Testcontainers |
| DB migration tool? | Flyway / Liquibase |
| Build image? | `spring-boot:build-image` |
| Native compile? | GraalVM + AOT |
| Virtual threads flag? | `spring.threads.virtual.enabled=true` |
| Breaking Boot 3 change? | Java 17+, `jakarta.*` |
| Resilience library? | Resilience4j |
| Messaging? | Spring Kafka / AMQP |

---

# 🎤 Part 10: Project / Behavioral Questions

> Use **S**ituation, **T**ask, **A**ction, **R**esult.

### B1. Describe a service you built or scaled with Spring Boot.
**Sample (Ritesh Kumar):** *Situation:* Our checkout API had p95 of 1.8 s during sales. *Task:* Get under 400 ms without more database capacity. *Action:* Found N+1 queries via query counting, switched read endpoints to DTO projections, added Caffeine/Redis caching, fixed the Hikari pool size and moved email sending to Kafka via an outbox. *Result:* p95 fell to 320 ms, database CPU dropped 45%, and the system handled Black Friday traffic with no incidents.

### B2. A production incident you handled.
Connection pool exhaustion caused by a long transaction around a remote call: detection (alerts on pending threads), mitigation (restart, scale down traffic), root cause, fix (move call outside transaction, timeouts), prevention (tests, alerts, runbook).

### B3. How do you ensure quality across a Spring team?
Constructor injection, slice tests plus Testcontainers, ArchUnit layering tests, static analysis, PR checklists (transaction scope, N+1, security), and a service template.

### B4. A migration you led (Boot 2 → 3, monolith extraction).
Describe steps (Java 17 upgrade, OpenRewrite, `jakarta` namespace, dependency alignment), risk control (canary, feature flags), and measurable outcomes (startup time, memory, security posture).

### B5. How do you handle security concerns?
Threat modeling, resource server with short-lived JWTs, method security, input validation, dependency scanning, secret management, and authorization tests including IDOR cases.

### B6. How do you mentor juniors on Spring?
Explain the container, proxies and transactions with real bugs, review for thin controllers and constructor injection, and pair on debugging with actuator, SQL logs and thread dumps.

### B7. Disagreement on microservices vs monolith.
Present data on team size, release cadence and operational cost; propose a modular monolith first; document the decision (ADR); revisit with metrics.

---

# 📚 Part 11: Complete Coverage (Modules + Annotations + Ecosystem + Mixed)

## Spring modules
Core (IoC, AOP, SpEL), Beans, Context, Web MVC, WebFlux, Data Access (JDBC, ORM, Transactions), Test, Messaging, Security, Boot, Data, Cloud, Batch, Integration, Modulith, Authorization Server, Vault, Session, HATEOAS, Kafka, AMQP.

## Annotation cheat list
- **Core:** `@Component`, `@Service`, `@Repository`, `@Controller`, `@RestController`, `@Configuration`, `@Bean`, `@Autowired`, `@Qualifier`, `@Primary`, `@Scope`, `@Lazy`, `@Profile`, `@Value`, `@PostConstruct`, `@PreDestroy`, `@Conditional*`.
- **Web:** `@RequestMapping`, `@GetMapping`, `@PostMapping`, `@PathVariable`, `@RequestParam`, `@RequestBody`, `@ResponseStatus`, `@ExceptionHandler`, `@ControllerAdvice`, `@CrossOrigin`.
- **Data:** `@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@Column`, `@OneToMany`, `@ManyToOne`, `@JoinColumn`, `@Version`, `@Query`, `@Modifying`, `@EntityGraph`, `@Transactional`.
- **Validation:** `@Valid`, `@Validated`, `@NotNull`, `@NotBlank`, `@Size`, `@Email`, `@Pattern`, `@Min`, `@Max`.
- **Operations:** `@Cacheable`, `@CacheEvict`, `@Async`, `@Scheduled`, `@EventListener`, `@TransactionalEventListener`, `@Retryable`.
- **Security:** `@EnableMethodSecurity`, `@PreAuthorize`, `@PostAuthorize`, `@Secured`.
- **Testing:** `@SpringBootTest`, `@WebMvcTest`, `@DataJpaTest`, `@MockitoBean`/`@MockBean`, `@TestConfiguration`, `@DynamicPropertySource`, `@ServiceConnection`, `@ActiveProfiles`.

## Ecosystem
Hibernate, Jackson, Lombok, MapStruct, Flyway, Liquibase, HikariCP, Caffeine, Redis (Lettuce), Kafka, RabbitMQ, Resilience4j, Micrometer, OpenTelemetry, Testcontainers, WireMock, springdoc-openapi, Keycloak, Vault, Docker/Buildpacks/Jib, Kubernetes, Gradle/Maven.

## Mixed topics
REST design, security, persistence and transactions, caching, messaging, resilience, observability, testing, containerization, native images, scaling and migrations.

---

# 🔬 Part 12: Spring Internals

### I1. Startup sequence of `SpringApplication.run`
Create `SpringApplication` → determine web application type → load `ApplicationContextInitializer`s and listeners → prepare `Environment` (property sources, profiles) → create `ApplicationContext` → load bean definitions (component scan, auto-configuration imports) → `refresh()` (post-process bean factory, instantiate singletons, start web server) → run `CommandLineRunner`s → publish `ApplicationReadyEvent`.

### I2. `refresh()` highlights
`invokeBeanFactoryPostProcessors` (including `ConfigurationClassPostProcessor`, which processes `@Configuration`, `@ComponentScan`, `@Import`, `@Bean`) → `registerBeanPostProcessors` → `onRefresh` (creates the embedded web server) → `finishBeanFactoryInitialization` (instantiate non-lazy singletons) → `finishRefresh` (publish `ContextRefreshedEvent`, start lifecycle beans).

### I3. Bean creation and the three-level cache
Singletons are created through `doCreateBean`; Spring keeps singleton objects, early-reference factories and fully created singletons in cache maps to resolve some setter/field circular dependencies. Boot disables circular references by default because they hide design issues.

### I4. Auto-configuration ordering
`@AutoConfiguration(before/after = ...)` controls order; conditions are evaluated at registration time so user beans (registered first) cause `@ConditionalOnMissingBean` back-off.

### I5. Proxies: JDK vs CGLIB
JDK proxies implement interfaces; CGLIB subclasses the target class. Boot defaults to CGLIB (`spring.aop.proxy-target-class=true`). The proxy delegates to interceptors (transaction, cache, security) then calls the real target.

### I6. DispatcherServlet internals
`doDispatch`: find handler (`RequestMappingHandlerMapping`), build handler execution chain with interceptors, find `HandlerAdapter`, run interceptor `preHandle`, invoke handler (argument resolution, return value handling), `postHandle`, resolve exceptions via `HandlerExceptionResolver`s (including `@ExceptionHandler`), `afterCompletion`.

### I7. Hibernate flush and dirty checking
At flush time Hibernate compares entity snapshots with current state, generates SQL in a defined order (inserts, updates, deletes), and executes it. Flush occurs before commit, before queries that could be affected (AUTO mode), or on explicit `flush()`.

### I8. Transaction management
`PlatformTransactionManager` (JPA, JDBC), `TransactionInterceptor` opens/joins a transaction, binds resources (connection/EntityManager) to the thread via `TransactionSynchronizationManager`, commits or rolls back based on the outcome and rules.

### I9. Spring Security filter chain
A `DelegatingFilterProxy` / `FilterChainProxy` selects a `SecurityFilterChain` and runs ordered filters: `SecurityContextHolderFilter`, CSRF, logout, authentication filters (bearer token, form, basic), `ExceptionTranslationFilter`, `AuthorizationFilter`. The `SecurityContext` is thread-local (propagated carefully to async/virtual threads).

### I10. Environment abstraction
`Environment` aggregates `PropertySources` with precedence; `@Value`/binder read from it; profiles gate bean registration.

### I11. AOT processing
At build time Spring generates bean definitions as code and reflection/proxy hints for native images, removing runtime classpath scanning and some reflection to speed up startup (and enable GraalVM).

---

# 📊 Part 13: Reference Tables

### Stereotype annotations
| Annotation | Layer | Extra behavior |
|---|---|---|
| `@Component` | Any | None |
| `@Service` | Business | None (semantic) |
| `@Repository` | Data | Persistence exception translation |
| `@Controller` | Web (views) | Handler mapping |
| `@RestController` | Web (REST) | `@ResponseBody` on all methods |

### Test annotations
| Need | Annotation |
|---|---|
| Controller + MVC only | `@WebMvcTest` |
| JPA repositories only | `@DataJpaTest` |
| JSON serialization only | `@JsonTest` |
| REST client only | `@RestClientTest` |
| Entire app | `@SpringBootTest` |
| Real infrastructure | Testcontainers + `@ServiceConnection` |

### HTTP status guide
| Situation | Status |
|---|---|
| OK | 200 |
| Created | 201 |
| Accepted | 202 |
| No content | 204 |
| Bad request / validation | 400 / 422 |
| Unauthorized | 401 |
| Forbidden | 403 |
| Not found | 404 |
| Conflict | 409 |
| Too many requests | 429 |
| Server error | 500 |
| Unavailable | 503 |

### Propagation quick table
| Propagation | Behavior |
|---|---|
| `REQUIRED` | Join existing or create new |
| `REQUIRES_NEW` | Always new; suspends current |
| `SUPPORTS` | Join if exists, else non-transactional |
| `MANDATORY` | Must exist or throw |
| `NOT_SUPPORTED` | Run without a transaction |
| `NEVER` | Throw if a transaction exists |
| `NESTED` | Savepoint inside current |

### Important Actuator endpoints
| Endpoint | Purpose |
|---|---|
| `/actuator/health` | Health and probes |
| `/actuator/metrics` | Micrometer metrics |
| `/actuator/prometheus` | Prometheus scrape |
| `/actuator/loggers` | Change log levels at runtime |
| `/actuator/threaddump` | Thread dump |
| `/actuator/conditions` | Auto-config report |
| `/actuator/configprops` | Bound properties |
| `/actuator/env` | Property sources (secure this!) |


---

# 🔮 Part 14: Output & Prediction Questions

### O1. Self-invocation and `@Transactional`
```java
@Service
class A {
    public void outer() { inner(); }
    @Transactional public void inner() { /* writes */ }
}
```
**Result:** Calling `outer()` from another bean runs `inner()` **without** a transaction (the call is not through the proxy).

### O2. Rollback rules
```java
@Transactional
public void save() throws IOException { repo.save(x); throw new IOException("fail"); }
```
**Result:** The transaction **commits** (checked exceptions do not trigger rollback by default).

### O3. Singleton and state
```java
@Service class Counter { private int n; int next() { return ++n; } }
```
**Result:** One shared instance across all requests; concurrent requests race on `n`. The values are not per user.

### O4. Prototype in singleton
```java
@Component @Scope("prototype") class P {}
@Service class S { @Autowired P p; }
```
**Result:** `S` gets one `P` instance at creation; it never changes. Use `ObjectProvider<P>`.

### O5. Bean ambiguity
```java
interface Notifier {}
@Service class Email implements Notifier {}
@Service class Sms implements Notifier {}
@Service class Alerts { Alerts(Notifier n) {} }
```
**Result:** Startup fails with `NoUniqueBeanDefinitionException` unless `@Primary`/`@Qualifier` is used (or the parameter name matches a bean name).

### O6. Profile activation
```java
@Bean @Profile("dev") DataSource h2() {...}
@Bean @Profile("!dev") DataSource pg() {...}
```
**Result:** With `spring.profiles.active=prod`, the `pg` bean is created; with `dev` the `h2` bean.

### O7. Property precedence
`application.yml`: `server.port=8080`; environment: `SERVER_PORT=9090`.
**Result:** The app starts on `9090` (environment variables override files).

### O8. Validation
```java
record R(@NotBlank String name) {}
@PostMapping void create(@Valid @RequestBody R r) {}
// POST {"name": ""}
```
**Result:** `400 Bad Request` (`MethodArgumentNotValidException`).

### O9. `Optional` from repository
```java
repo.findById(99L).orElseThrow(() -> new NotFoundException("x"));
```
**Result:** Throws `NotFoundException`, which the `@RestControllerAdvice` maps to `404`.

### O10. Lazy loading outside a transaction
```java
User u = repo.findById(1L).get();
u.getOrders().size();   // outside @Transactional with open-in-view=false
```
**Result:** `LazyInitializationException`.

### O11. Cache behavior
```java
@Cacheable("users") User get(Long id) {...}
get(1L); get(1L);
```
**Result:** The method body runs once; the second call returns the cached value (if called through the proxy).

### O12. `@Async` void method
```java
@Async void send() { throw new RuntimeException("x"); }
```
**Result:** The caller does not see the exception; it goes to the `AsyncUncaughtExceptionHandler`.

### O13. Security default
Add `spring-boot-starter-security` with no config and call `GET /api/users`.
**Result:** `401 Unauthorized` (everything requires authentication; a generated password is logged for basic auth).

### O14. Filter order
Filters A (order 1) and B (order 2) both wrap the chain.
**Result:** Request goes A → B → servlet; the response goes back B → A.

---

# ✅ Part 15: MCQs

**1.** Which annotation enables auto-configuration, component scanning and configuration?
A) `@EnableWebMvc` B) `@SpringBootApplication` C) `@ComponentScan` only D) `@Configuration` only

**2.** Default embedded server?
A) Jetty B) Tomcat C) Undertow D) Netty

**3.** Preferred dependency injection style?
A) Field B) Constructor C) Setter always D) `new`

**4.** Default bean scope?
A) Prototype B) Singleton C) Request D) Session

**5.** `@RestController` equals:
A) `@Controller` + `@ResponseBody` B) `@Service` + `@Controller` C) `@Component` only D) `@Repository`

**6.** By default `@Transactional` rolls back on:
A) All exceptions B) Unchecked exceptions and errors C) Checked exceptions only D) Never

**7.** Which fixes N+1 queries?
A) `join fetch` / entity graph B) More threads C) `@Async` D) `ddl-auto=update`

**8.** Which tool provides database migrations?
A) Flyway B) Maven C) Lombok D) Jackson

**9.** What does `@ConfigurationProperties` do?
A) Reads one value B) Binds a group of properties to a typed object C) Defines routes D) Starts the server

**10.** Which is the modern synchronous HTTP client in Spring 6.1+?
A) `RestTemplate` only B) `RestClient` C) `HttpURLConnection` D) `FeignClient` only

**11.** Which annotation tests only the web layer?
A) `@DataJpaTest` B) `@WebMvcTest` C) `@SpringBootTest` D) `@JsonTest`

**12.** Which actuator endpoint is used for Prometheus scraping?
A) `/actuator/info` B) `/actuator/prometheus` C) `/actuator/env` D) `/actuator/beans`

**13.** Boot 3 requires at least:
A) Java 8 B) Java 11 C) Java 17 D) Java 21

**14.** Which namespace does Boot 3 use for Servlet and JPA APIs?
A) `javax.*` B) `jakarta.*` C) `spring.*` D) `java.*`

**15.** Which annotation chooses a default among multiple beans?
A) `@Primary` B) `@Lazy` C) `@Order` D) `@Value`

**16.** Where should `@Transactional` generally go?
A) Controllers B) Service methods C) Entities D) Repositories only

**17.** How do you externalize config for containers best?
A) Edit the jar B) Environment variables / ConfigMaps C) Hard-code D) Reflection

**18.** Which of these is a security risk?
A) `ddl-auto=validate` B) Exposing all actuator endpoints publicly C) Using BCrypt D) JWT with short expiry

**19.** Which approach avoids `LazyInitializationException` in controllers?
A) Return entities B) Return DTOs built in the transactional service C) Use `open-in-view` D) Use `@Lazy`

**20.** Which pattern ensures a DB write and an event publish stay consistent?
A) Two-phase commit always B) Transactional outbox C) Ignore failures D) Thread sleep

**21.** `@Cacheable` does not work when:
A) Called through the proxy B) Self-invoked within the same class C) Used on public methods D) Cache is configured

**22.** What is `ProblemDetail`?
A) Logging format B) Standard error response (RFC 9457) C) Test annotation D) Validation group

**23.** What does `spring.threads.virtual.enabled=true` do?
A) Enables reactive mode B) Runs request handling on virtual threads (Java 21) C) Disables threads D) Enables native image

**24.** Which is not a stereotype annotation?
A) `@Service` B) `@Repository` C) `@Bean` D) `@Component`

**25.** Which scope creates a new instance per HTTP request?
A) singleton B) prototype C) request D) application

**26.** Which annotation triggers validation of a request body?
A) `@Valid` B) `@Autowired` C) `@Qualifier` D) `@Cacheable`

**27.** Which DB setting is recommended in production for Hibernate?
A) `create-drop` B) `update` C) `validate` or `none` D) `create`

**28.** Which is a correct way to run background jobs once in a cluster?
A) `@Scheduled` on all nodes B) ShedLock / Quartz cluster / CronJob C) `Thread.sleep` D) Multiple scheduled annotations

**29.** Which tool builds an OCI image without a Dockerfile?
A) `spring-boot:build-image` (Buildpacks) B) `mvn clean` C) `jshell` D) `jlink` only

**30.** `@WebMvcTest` loads:
A) All beans B) Controllers and MVC infrastructure only C) Only repositories D) Nothing

**31.** Which breaks `@Transactional` proxy advice?
A) Public methods B) `final` or `private` methods C) Interfaces D) Using services

**32.** Which header usually carries a JWT?
A) `Authorization: Bearer ...` B) `X-Token` always C) `Cookie` only D) `Accept`

**33.** Which is a recommended health probe split in Kubernetes?
A) One generic endpoint B) Liveness and readiness probes C) No probes D) Only TCP

**34.** `@MockBean` was replaced by what in Boot 3.4+?
A) `@SpyBean` B) `@MockitoBean` C) `@FakeBean` D) `@TestBean`

**35.** Which dependency gives declarative circuit breakers?
A) Resilience4j B) Lombok C) Flyway D) Jackson

**36.** Primary key generation that disables JDBC batch inserts in Hibernate:
A) `SEQUENCE` B) `IDENTITY` C) `TABLE` D) UUID assigned

**37.** Which statement about WebFlux is true?
A) Requires blocking JDBC B) Uses non-blocking reactive streams C) Replaces Tomcat only D) Is always faster

**38.** Which is best for fast startup and low memory (when compatible)?
A) Larger heap B) GraalVM native image / CRaC C) More threads D) Disable GC

**39.** Which provides distributed tracing in Boot 3?
A) Sleuth B) Micrometer Tracing C) Log4j D) JUnit

**40.** Which is the safest approach to secrets?
A) Commit `application.yml` with passwords B) Secret managers / environment injection C) Base64 in code D) Public config repo

### Answer key
1-B, 2-B, 3-B, 4-B, 5-A, 6-B, 7-A, 8-A, 9-B, 10-B, 11-B, 12-B, 13-C, 14-B, 15-A, 16-B, 17-B, 18-B, 19-B, 20-B, 21-B, 22-B, 23-B, 24-C, 25-C, 26-A, 27-C, 28-B, 29-A, 30-B, 31-B, 32-A, 33-B, 34-B, 35-A, 36-B, 37-B, 38-B, 39-B, 40-B

---

# ⚠️ Part 16: Common Mistakes

> Each mistake has four parts: ❌ wrong code, 🤔 why it is a problem, ✅ correct code, 💬 what to say in an interview.

### Mistake 1: Field injection everywhere
❌
```java
@Service class OrderService { @Autowired private Repo repo; @Autowired private Mailer mailer; }
```
🤔 Hard to test without Spring, hides dependencies, allows partially constructed objects.
✅
```java
@Service class OrderService {
    private final Repo repo; private final Mailer mailer;
    OrderService(Repo repo, Mailer mailer) { this.repo = repo; this.mailer = mailer; }
}
```
💬 "Constructor injection makes dependencies explicit and objects immutable."

### Mistake 2: `@Transactional` on private methods or self-invocation
❌
```java
public void process() { save(); }
@Transactional private void save() { ... }
```
🤔 Proxies cannot intercept private methods or internal calls, so no transaction exists.
✅
```java
@Service class Saver { @Transactional public void save() { ... } }     // call it from another bean
```
💬 "Transactions are proxy-based; the call has to cross the bean boundary."

### Mistake 3: Returning entities from controllers
❌
```java
@GetMapping("/{id}") User get(@PathVariable Long id) { return repo.findById(id).get(); }
```
🤔 Leaks internal fields, triggers lazy loading and serialization loops, and couples API to schema.
✅
```java
@GetMapping("/{id}") UserDto get(@PathVariable Long id) { return service.get(id); }
```
💬 "I expose DTOs, never entities."

### Mistake 4: N+1 queries
❌
```java
orders.forEach(o -> log.info("{}", o.getItems().size()));    // one query per order
```
🤔 Each lazy collection triggers its own query; latency explodes with data size.
✅
```java
@Query("select o from Order o join fetch o.items") List<Order> withItems();
```
💬 "I check generated SQL and fix with fetch joins, entity graphs or projections."

### Mistake 5: `ddl-auto=update` in production
❌
```yaml
spring.jpa.hibernate.ddl-auto: update
```
🤔 Uncontrolled schema changes with no review or rollback.
✅
```yaml
spring.jpa.hibernate.ddl-auto: validate     # schema managed by Flyway
```
💬 "Schema changes are versioned migrations."

### Mistake 6: Long transactions with remote calls
❌
```java
@Transactional void checkout() { repo.save(o); paymentClient.charge(o); }
```
🤔 Holds a DB connection during a slow call; the pool starves under load.
✅
```java
void checkout() { var order = tx.execute(s -> repo.save(o)); paymentClient.charge(order); }
```
💬 "Keep transactions small and local; coordinate remote calls with sagas or outbox."

### Mistake 7: Swallowing exceptions or catching generic `Exception`
❌
```java
try { service.run(); } catch (Exception e) { log.error("failed"); }
```
🤔 Hides the cause and may mark transactions inconsistent.
✅
```java
catch (PaymentException e) { throw new CheckoutFailedException("payment failed", e); }
```
💬 "Handle specific errors, keep the cause, and let a global handler map to HTTP."

### Mistake 8: Disabling CSRF/security without understanding
❌
```java
http.csrf(c -> c.disable()).authorizeHttpRequests(a -> a.anyRequest().permitAll());
```
🤔 Leaves the API open.
✅
```java
http.authorizeHttpRequests(a -> a.requestMatchers("/public/**").permitAll().anyRequest().authenticated())
    .oauth2ResourceServer(o -> o.jwt(Customizer.withDefaults()));
```
💬 "Secure by default; open only what's necessary; CSRF off only for stateless token APIs."

### Mistake 9: Exposing all actuator endpoints
❌
```yaml
management.endpoints.web.exposure.include: "*"
```
🤔 `/env`, `/heapdump` and `/threaddump` can leak secrets and internals.
✅
```yaml
management.endpoints.web.exposure.include: health,info,prometheus
```
💬 "Expose only what's needed and secure the rest on a management port."

### Mistake 10: Unbounded `@Async` and caches
❌
```java
@Async void sendEmail() {...}       // default executor, unbounded queue
@Cacheable("all") List<X> all() {...}   // no size/TTL
```
🤔 Memory growth and lost backpressure.
✅
```java
@Async("ioExecutor") void sendEmail() {...}     // bounded pool + rejection policy
// Caffeine: maximumSize + expireAfterWrite
```
💬 "Everything is bounded: pools, queues, caches."

### Mistake 11: `@Data` on JPA entities
❌
```java
@Data @Entity class Order { @OneToMany List<Item> items; }
```
🤔 Generated `equals/hashCode/toString` touch lazy relations and create cycles.
✅
```java
@Getter @Setter @Entity class Order { /* explicit equals/hashCode on id */ }
```
💬 "I avoid `@Data` on entities and write equality deliberately."

### Mistake 12: Hard-coded config and secrets
❌
```java
String url = "jdbc:postgresql://prod-db/app"; String password = "admin123";
```
🤔 Environment-specific, insecure, requires rebuilds.
✅
```yaml
spring.datasource.url: ${DB_URL}
spring.datasource.password: ${DB_PASSWORD}
```
💬 "Configuration is externalized; secrets come from a secret manager."

### Mistake 13: Using H2 in tests but PostgreSQL in production
❌
```java
@DataJpaTest   // default embedded H2
```
🤔 SQL dialect and behavior differences hide bugs.
✅
```java
@Testcontainers + @ServiceConnection PostgreSQLContainer
```
💬 "Test against the real database engine with Testcontainers."

### Mistake 14: No timeouts on HTTP clients and DB calls
❌
```java
RestClient.create().get().uri(url).retrieve().body(X.class);
```
🤔 A slow dependency ties up threads and connections.
✅
```java
// configure connect/read timeouts on the request factory, plus retries with backoff and a circuit breaker
```
💬 "Every remote call has timeouts and a resilience policy."

### Mistake 15: Too many responsibilities in controllers
❌
```java
@PostMapping void create(...) { /* validation, pricing, DB, email, logging */ }
```
🤔 Hard to test and reuse.
✅
```java
@PostMapping UserDto create(@Valid @RequestBody CreateUserRequest r) { return service.create(r); }
```
💬 "Controllers translate HTTP; services hold business logic."

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

### Signal table 1: Answer quality
| Topic | Weak answer | Strong answer |
|---|---|---|
| "What is auto-configuration?" | "Spring configures things automatically." | "Conditional configuration classes loaded from the imports file; guarded by `@ConditionalOnClass/MissingBean`; user beans back it off; debug with the conditions report." |
| "Why did `@Transactional` not work?" | "I don't know." | "Self-invocation or a non-public/final method bypasses the proxy; checked exceptions don't roll back; the object may not be a bean." |
| "How do you fix slow endpoints?" | "Add caching." | "Measure first: SQL count, pool wait, traces; fix N+1 with fetch joins/projections; then caching, indexes, timeouts." |
| "How do you secure APIs?" | "Spring Security." | "Resource server with short-lived JWTs, method security, ownership checks, validation, secret management and tests for IDOR." |
| "Microservices?" | "Always better." | "Start modular monolith; split for independent scaling/teams; handle consistency with outbox and sagas." |

### Signal table 2: Behaviors that stand out
| Weak behavior | Strong behavior |
|---|---|
| Uses annotations as magic | Knows proxies, lifecycle and conditions behind them |
| Trusts `ddl-auto` and defaults | Uses migrations and tunes pools, timeouts and logging |
| Tests only with `@SpringBootTest` | Uses slices plus Testcontainers |
| Ignores operations | Adds actuator, metrics, tracing, graceful shutdown |
| Returns entities | Designs DTOs and versioned APIs |

### Signal table 3: Phrases that show depth
- "Transactions are proxy-based, so the call must cross a bean boundary."
- "The DB pool, not Tomcat threads, is usually the real concurrency limit."
- "I disable open-in-view and fetch deliberately."
- "Outbox plus idempotent consumers instead of distributed transactions."
- "Test against the real database with Testcontainers."
- "Expose only the actuator endpoints I need, on a separate port."

### Signal table 4: Questions to ask the interviewer
- Which Boot/Java versions do you run, and how do you upgrade?
- How do you handle migrations, secrets and configuration per environment?
- What does your observability stack look like?
- Monolith or microservices, and how are boundaries enforced?

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### 1. The 30-second explanation
Spring Boot is an opinionated layer over Spring: starters bring dependencies, auto-configuration registers sensible beans conditionally, an embedded server runs the app, and Actuator provides production features. Spring's core is the IoC container that builds and wires beans, adding cross-cutting behavior (transactions, caching, security) through proxies.

### 2. Request flow
```
Client → Filters (security, CORS) → DispatcherServlet → HandlerMapping → Interceptors
 → Controller (args bound + validated) → Service (@Transactional) → Repository → DB
 → HttpMessageConverter (JSON) → Response   (errors → @RestControllerAdvice)
```

### 3. Production checklist
- [ ] Supported Boot/Java versions; dependency scanning
- [ ] Constructor injection; thin controllers; DTOs
- [ ] `@ConfigurationProperties` with validation; secrets externalized
- [ ] Flyway migrations; `ddl-auto=validate`; `open-in-view=false`
- [ ] Hikari pool sized; transactions short; N+1 checked
- [ ] Timeouts, retries, circuit breakers on remote calls
- [ ] Security: resource server, method security, CORS allow-list
- [ ] Actuator limited; health probes; graceful shutdown
- [ ] Metrics, traces, structured logs with correlation IDs
- [ ] Tests: unit, slice, Testcontainers, a few end-to-end
- [ ] Layered/Buildpack image, non-root, `MaxRAMPercentage`

### 4. Debug toolbox
| Symptom | Tool |
|---|---|
| Bean wiring issue | Startup stack trace, `--debug`, `/actuator/conditions` |
| Slow endpoint | SQL count, Hikari metrics, traces |
| Thread/pool exhaustion | `/actuator/threaddump`, `jcmd Thread.print` |
| Memory growth | Heap dump + MAT |
| Config not applied | `/actuator/env`, `/actuator/configprops` |

### 5. Top 15 one-liners
1. Constructor injection, always.
2. Singleton beans must be stateless/thread-safe.
3. `@Transactional` works through proxies only.
4. Rollback by default on unchecked exceptions.
5. DTOs at the API boundary.
6. Disable open-in-view; fetch deliberately.
7. Migrations, not `ddl-auto=update`.
8. The DB pool is the real concurrency limit.
9. Timeouts on every remote call.
10. Outbox instead of dual writes.
11. Slice tests + Testcontainers.
12. Stateless APIs use bearer tokens, not sessions.
13. Expose few actuator endpoints.
14. Externalize config; secrets in a manager.
15. Measure before optimizing.

### 6. The 60-second answer: "Why Spring Boot?"
"Spring Boot gives me a mature, battle-tested ecosystem with fast setup: auto-configuration, embedded servers, Spring Data, Security and first-class observability. Its dependency injection and AOP support make code testable and cross-cutting concerns clean. With virtual threads, AOT and native options, it keeps getting leaner, and I pair it with solid practices: migrations, timeouts, outbox, and Testcontainers."

### 7. Final revision order
IoC/DI and bean lifecycle → auto-configuration → MVC and validation → data access, JPA and transactions → security → testing → resilience, messaging and observability → deployment and debugging stories.

