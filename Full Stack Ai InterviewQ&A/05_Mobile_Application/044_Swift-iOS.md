# Swift & iOS Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **Swift 5.9–6.x (Swift 6 language mode with strict concurrency)**, **Xcode 15–16+**, **iOS 17–18+**, **SwiftUI** (with the Observation framework: `@Observable`), **UIKit** (still essential), **Swift Concurrency** (async/await, actors, `Sendable`), **Combine**, **SwiftData / Core Data**, **URLSession**, **Swift Package Manager**, and testing with **XCTest, Swift Testing and XCUITest**. Apple ships new APIs every year (WWDC) and tightens privacy/App Store rules: anything marked "verify" should be checked in Apple's documentation (developer.apple.com/documentation, swift.org) for your deployment target. Examples use the sample name **Ritesh Kumar**.
> This file covers Swift language fundamentals (optionals, value vs reference types, enums, protocols, generics, closures, ARC and retain cycles, error handling, property wrappers, macros), Swift Concurrency (async/await, actors, `Sendable`, structured concurrency), iOS app lifecycle and architecture, SwiftUI and UIKit, navigation, state management (`@State`, `@Binding`, `@Observable`, `@Environment`), networking and `Codable`, persistence (SwiftData, Core Data, Keychain, UserDefaults), background work, push notifications and deep links, StoreKit, widgets and Live Activities, testing, performance with Instruments, security and privacy, accessibility and localization, build/signing/App Store release, and production practice. Related topics: Android counterpart in `043_Kotlin-Android.md`, cross-platform in `041_React-Native.md` and `042_Flutter.md`, testing in `../06_Testing/040_Testing.md`, API design in `../03_Backend/035_GraphQL-and-REST-APIs.md`, security in `../03_Backend/036_Authentication-and-Security.md`, CI/CD in `../07_DevOps_and_Cloud/047_CI-CD-and-DevOps.md`.

## 📑 Index
- [Part 1: Fresher (0–1 year)](#-part-1-fresher-01-year)
- [Part 2: Junior (1–3 years)](#-part-2-junior-13-years)
- [Part 3: Mid (3–5 years)](#-part-3-mid-35-years)
- [Part 4: Senior (5–7 years)](#-part-4-senior-57-years)
- [Part 5: Lead / Architect (7+ years)](#-part-5-lead--architect-7-years)
- [Part 6: Hands-On Tasks & Code](#-part-6-hands-on-tasks--code)
- [Part 7: Debugging Scenarios](#-part-7-debugging-scenarios)
- [Part 8: Tricky Questions](#-part-8-tricky-questions)
- [Part 9: Rapid Fire](#-part-9-rapid-fire-one-liners)
- [Part 10: Project / Behavioral](#-part-10-project--behavioral-questions)
- [Part 11: Complete Coverage (Topics + Mixed)](#-part-11-complete-coverage-topics--mixed)
- [Part 12: iOS Internals](#-part-12-ios-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is Swift? *(Must-know)*
Apple's modern, open-source, statically typed, compiled language (2014) for iOS, iPadOS, macOS, watchOS, tvOS, visionOS and server-side. Safe by design (optionals, value semantics, strong typing), fast (LLVM, native code), expressive (generics, protocols, closures, pattern matching) and interoperable with Objective-C and C/C++.

### Q2. Swift vs Objective-C
| | Swift | Objective-C |
|---|---|---|
| Safety | Optionals, type inference, value types | Nullable annotations, dynamic messaging |
| Syntax | Modern, concise | Verbose (`[obj method:arg]`) |
| Dispatch | Static/vtable/witness (fast) | Dynamic message passing |
| Concurrency | async/await, actors | GCD, blocks |
| UI frameworks | SwiftUI + UIKit | UIKit/AppKit |
Large legacy codebases mix both; Swift can call Obj-C via bridging headers and Obj-C can call Swift via `@objc`.

### Q3. Variables, constants and types
```swift
let name = "Ritesh Kumar"          // constant (immutable binding)
var age = 28                       // variable
let pi: Double = 3.14159           // explicit type
let tuple = (code: 200, text: "OK")
print(tuple.code)
```
Prefer `let`. Type inference is strong; types never implicitly convert (use `Double(intValue)`).

### Q4. Optionals *(Must-know)*
`Optional<T>` represents a value or `nil`.
```swift
var city: String? = nil
if let c = city { print(c.count) }              // optional binding
guard let c = city else { return }              // early exit; c usable after
let len = city?.count ?? 0                       // optional chaining + nil-coalescing
let forced = city!                               // force unwrap: crashes if nil (avoid)
```
Use `guard let` for preconditions, `if let` for conditional work, `??` for defaults.

### Q5. Value types vs reference types *(Must-know)*
**Structs, enums and tuples are value types** (copied on assignment, copy-on-write for collections); **classes and actors are reference types** (shared identity). Swift's standard library (Array, Dictionary, String) is built from structs, which makes state changes local and predictable.
```swift
struct Point { var x: Int }
var a = Point(x: 1); var b = a; b.x = 9      // a.x is still 1
final class Counter { var n = 0 }
let c1 = Counter(); let c2 = c1; c2.n = 5      // c1.n == 5 (same instance)
```
Prefer structs by default; use classes when you need identity, inheritance, or shared mutable state.

### Q6. Functions and closures
```swift
func greet(_ name: String, from city: String = "Delhi") -> String { "Hi \(name) from \(city)" }
let square: (Int) -> Int = { $0 * $0 }
let evens = [1, 2, 3, 4].filter { $0 % 2 == 0 }.map { $0 * 2 }      // trailing closure
func perform(_ work: @escaping () -> Void) { DispatchQueue.main.async(execute: work) }
```
`@escaping` closures outlive the function call (store/async); capture lists `[weak self]` avoid retain cycles.

### Q7. Collections
`Array`, `Set`, `Dictionary`, with functional operators (`map`, `filter`, `reduce`, `compactMap`, `flatMap`, `sorted`, `first(where:)`, `Dictionary(grouping:)`). `lazy` sequences for deferred evaluation. Collections are value types with copy-on-write.

### Q8. Control flow and pattern matching
```swift
switch response {
case .success(let user) where user.isActive: print(user.name)
case .success: print("inactive")
case .failure(let error): print(error)
}
for (index, item) in items.enumerated() { /* ... */ }
if case .some(let x) = optional { /* ... */ }
```
`switch` must be exhaustive; no implicit fall-through.

### Q9. Enums with associated values
```swift
enum NetworkResult<T> {
    case success(T)
    case failure(Error)
    case loading
}
enum Role: String, Codable, CaseIterable { case user, admin }
```
Enums model states precisely; combine with `switch` for exhaustive handling.

### Q10. Structs, classes and initializers
```swift
struct User: Codable, Equatable, Identifiable { let id: UUID; var name: String }     // memberwise init generated
final class ProfileViewModel {
    private let repo: UserRepository
    init(repo: UserRepository) { self.repo = repo }
    deinit { print("freed") }
}
```
`final` classes are faster (static dispatch) and communicate intent. Designated vs convenience initializers, `required` init for subclass requirements.

### Q11. Protocols and extensions *(Must-know)*
Protocols define capabilities; extensions add behavior and provide default implementations (**protocol-oriented programming**).
```swift
protocol Repository { func fetch(id: String) async throws -> User }
extension Repository { func fetchAll(ids: [String]) async throws -> [User] { try await withThrowingTaskGroup(of: User.self) { g in ids.forEach { id in g.addTask { try await fetch(id: id) } }; return try await g.reduce(into: []) { $0.append($1) } } } }
struct MockRepo: Repository { func fetch(id: String) async throws -> User { User(id: UUID(), name: "Test") } }
```
Use protocols for dependency injection and testing.

### Q12. Generics and associated types
```swift
func firstMatch<T: Equatable>(in list: [T], of value: T) -> T? { list.first { $0 == value } }
protocol Container { associatedtype Item; mutating func add(_ item: Item) }
func render(_ view: some View) {}          // opaque type
func make() -> any Repository { MockRepo() }   // existential
```
`some` (opaque: one concrete type, compile-time) vs `any` (existential: runtime boxed). Prefer `some`/generics for performance.

### Q13. Access control
`private`, `fileprivate`, `internal` (default), `package`, `public`, `open`. `public` can't be subclassed outside the module; `open` can. Keep types and members as restrictive as possible.

### Q14. Error handling
```swift
enum APIError: Error { case badStatus(Int), decoding(Error), offline }
func load() throws -> Data { throw APIError.offline }
do { let d = try load() } catch APIError.badStatus(let code) { print(code) } catch { print(error) }
let maybe = try? load()          // Optional result
let sure = try! load()           // crashes on error (avoid)
```
`Result<Success, Failure>` for callback APIs; `throws` with async/await is idiomatic.

### Q15. ARC and retain cycles *(Must-know)*
Automatic Reference Counting frees class instances when their strong count reaches zero. **Retain cycles** (A holds B strongly and B holds A) leak memory. Break with `weak` (optional, becomes nil) or `unowned` (non-optional, crashes if accessed after dealloc).
```swift
class VC { var onTap: (() -> Void)?
  func setup() { onTap = { [weak self] in self?.doSomething() } } }
class Parent { var child: Child? }
class Child { weak var parent: Parent? }
```
Closures capture strongly by default: use `[weak self]` for long-lived closures (timers, observers, network callbacks stored on self).

### Q16. Property wrappers and observers
```swift
var score = 0 { willSet { print("will set \(newValue)") } didSet { print("changed from \(oldValue)") } }
@propertyWrapper struct Clamped { private var value = 0; var wrappedValue: Int { get { value } set { value = min(max(newValue, 0), 100) } } }
```
SwiftUI heavily uses wrappers: `@State`, `@Binding`, `@Environment`, `@AppStorage`, `@FocusState`.

### Q17. App lifecycle (UIKit)
`AppDelegate` (process-level: launch, push registration, background events), `SceneDelegate` (per-scene UI lifecycle: `sceneWillEnterForeground`, `sceneDidEnterBackground`). App states: not running, inactive, active, background, suspended. SwiftUI apps declare `@main struct MyApp: App { var body: some Scene { WindowGroup { ContentView() } } }` and observe `scenePhase`.

### Q18. UIViewController lifecycle
`init` → `loadView` → `viewDidLoad` (once; set up) → `viewWillAppear` → `viewDidAppear` → `viewWillDisappear` → `viewDidDisappear` → `deinit`. Use `viewDidLoad` for setup, `viewWillAppear` for refresh, and avoid heavy work in `viewDidAppear`'s critical path.

### Q19. SwiftUI basics *(Must-know)*
Declarative UI: describe the view for the current state; SwiftUI re-renders when state changes.
```swift
struct CounterView: View {
    @State private var count = 0
    var body: some View {
        VStack(spacing: 12) {
            Text("Hello Ritesh Kumar").font(.title2)
            Text("Count: \(count)")
            Button("Increment") { count += 1 }.buttonStyle(.borderedProminent)
        }.padding()
    }
}
```
Views are lightweight value types; `body` is recomputed when dependencies change.

### Q20. Property wrappers in SwiftUI
| Wrapper | Meaning |
|---|---|
| `@State` | View-owned local value state |
| `@Binding` | Two-way reference to state owned elsewhere |
| `@Environment` | Read system/injected values (`colorScheme`, `dismiss`, custom keys) |
| `@Observable` (Observation, iOS 17+) | Macro making a class observable; views track only properties they read |
| `@Bindable` | Create bindings to `@Observable` model properties |
| `@StateObject` / `@ObservedObject` / `@EnvironmentObject` | Legacy `ObservableObject` approach (iOS 13+) |
| `@AppStorage` / `@SceneStorage` | UserDefaults / scene-scoped persistence |

### Q21. `@Observable` example
```swift
@Observable final class UsersModel {
    var users: [User] = []
    var isLoading = false
    func load() async { isLoading = true; defer { isLoading = false }; users = (try? await repo.users()) ?? [] }
}
struct UsersView: View {
    @State private var model = UsersModel()
    var body: some View {
        List(model.users) { Text($0.name) }.task { await model.load() }.overlay { if model.isLoading { ProgressView() } }
    }
}
```
`@State` owns the model instance; views update only when properties they read change.

### Q22. Layout in SwiftUI
Stacks (`VStack`, `HStack`, `ZStack`), `Spacer`, `Grid`, `LazyVStack`/`LazyVGrid`, `ScrollView`, `List`, `GeometryReader` (use sparingly), `Layout` protocol. Layout process: parent proposes a size, child chooses its size, parent positions it. **Modifier order matters**: `.padding().background(.red)` differs from `.background(.red).padding()`.

### Q23. Lists and identity
`List(items) { ... }` requires `Identifiable` or `id:` key paths; stable IDs preserve state and animations. Use `LazyVStack` inside `ScrollView` for custom layouts; `ForEach` needs stable identity (not indices when data can change).

### Q24. Navigation (SwiftUI)
```swift
NavigationStack(path: $router.path) {
    List(users) { user in NavigationLink(value: user) { Text(user.name) } }
        .navigationDestination(for: User.self) { UserDetail(user: $0) }
        .navigationTitle("Users")
}
```
`NavigationStack` with a path array supports programmatic and deep-link navigation; `.sheet`, `.fullScreenCover`, `.alert`, `.confirmationDialog` for modals; `TabView` for tabs.

### Q25. Basic networking with URLSession and Codable *(Must-know)*
```swift
struct User: Codable, Identifiable { let id: Int; let name: String; let createdAt: Date }
func fetchUsers() async throws -> [User] {
    var req = URLRequest(url: URL(string: "https://api.example.com/users")!)
    req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
    let (data, response) = try await URLSession.shared.data(for: req)
    guard let http = response as? HTTPURLResponse, (200..<300).contains(http.statusCode) else { throw APIError.badStatus((response as? HTTPURLResponse)?.statusCode ?? -1) }
    let decoder = JSONDecoder(); decoder.keyDecodingStrategy = .convertFromSnakeCase; decoder.dateDecodingStrategy = .iso8601
    return try decoder.decode([User].self, from: data)
}
```

### Q26. Persistence options
| Option | Use |
|---|---|
| `UserDefaults` / `@AppStorage` | Small preferences |
| **Keychain** | Secrets/tokens |
| **SwiftData** (iOS 17+) / **Core Data** | Object graph persistence |
| SQLite (GRDB, SQLite.swift) | Relational control |
| `FileManager` + `Codable` | Files/caches |
| CloudKit | Apple-ecosystem sync |
Never store tokens or passwords in `UserDefaults`.

### Q27. SwiftData basics
```swift
@Model final class Note { var title: String; var body: String; var createdAt = Date(); init(title: String, body: String) { self.title = title; self.body = body } }
@main struct App: App { var body: some Scene { WindowGroup { ContentView() }.modelContainer(for: Note.self) } }
struct ContentView: View {
    @Query(sort: \Note.createdAt, order: .reverse) private var notes: [Note]
    @Environment(\.modelContext) private var context
    var body: some View { List(notes) { Text($0.title) }.toolbar { Button("Add") { context.insert(Note(title: "New", body: "")) } } }
}
```
Built on Core Data; models are plain classes with `@Model`.

### Q28. Keychain
Store small secrets with `SecItemAdd`/`SecItemCopyMatching`; control accessibility (`kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly`), sharing via access groups, and biometric protection (`SecAccessControl`). Use a wrapper (KeychainAccess, or your own) and handle `errSecItemNotFound`/duplicate errors.

### Q29. Grand Central Dispatch (GCD) basics
```swift
DispatchQueue.global(qos: .userInitiated).async { let data = heavy(); DispatchQueue.main.async { self.label.text = data } }
```
Serial vs concurrent queues, QoS classes, `DispatchGroup`, semaphores, barriers. UI updates must be on the main thread. Modern code prefers Swift Concurrency (`async/await`, `@MainActor`).

### Q30. Swift Concurrency basics *(Must-know)*
```swift
func loadProfile() async throws -> Profile {
    async let user = api.user()          // concurrent child tasks
    async let posts = api.posts()
    return Profile(user: try await user, posts: try await posts)
}
Task { do { profile = try await loadProfile() } catch { self.error = error } }
@MainActor final class ViewModel: ObservableObject { @Published var items: [Item] = [] }
```
`async/await` makes asynchronous code linear; `Task` creates unstructured work; structured concurrency (`async let`, `TaskGroup`) ties child tasks to the parent; cancellation is cooperative (`Task.checkCancellation()`).

### Q31. Actors and `Sendable`
Actors protect their mutable state with serialized access (`await` to call from outside); `@MainActor` isolates to the main thread. `Sendable` marks types safe to pass across concurrency domains (value types of Sendable members, immutable classes, actors). Swift 6 strict concurrency turns data-race warnings into errors.
```swift
actor Cache { private var storage: [String: Data] = [:]; func get(_ k: String) -> Data? { storage[k] }; func set(_ k: String, _ v: Data) { storage[k] = v } }
```

### Q32. Combine basics
Reactive framework: publishers, operators, subscribers (`sink`, `assign`), `@Published`, `AnyCancellable` stored in a `Set<AnyCancellable>`. Used for debouncing search, combining streams and bridging legacy code. New code often prefers async/await and `AsyncSequence`/Observation.
```swift
$query.debounce(for: .milliseconds(300), scheduler: DispatchQueue.main).removeDuplicates().sink { [weak self] q in self?.search(q) }.store(in: &cancellables)
```

### Q33. UIKit basics
`UIView`/`UIViewController`, Auto Layout (constraints), `UITableView`/`UICollectionView` (diffable data sources + compositional layout), `UINavigationController`, delegation, `UIKit` + SwiftUI interop via `UIHostingController` and `UIViewRepresentable`. Many production apps remain UIKit-heavy.

### Q34. Auto Layout and Dynamic Type
Constraints define relationships (leading/trailing/top/bottom, aspect, priorities, content hugging/compression resistance); use stack views; support Dynamic Type (`UIFont.preferredFont(forTextStyle:)`, `adjustsFontForContentSizeCategory`) and safe areas. In SwiftUI, text scales automatically with `.font(.body)`.

### Q35. Permissions and Info.plist
Add usage descriptions (`NSCameraUsageDescription`, `NSLocationWhenInUseUsageDescription`, `NSPhotoLibraryUsageDescription`) and request at runtime via frameworks (AVFoundation, CoreLocation, PHPhotoLibrary, UserNotifications). Missing keys crash the app; vague descriptions cause App Review rejections. Handle `.denied`/`.restricted` gracefully.

### Q36. Xcode essentials
Project vs workspace, targets and schemes, build configurations (Debug/Release), `.xcconfig` files, Swift Package Manager dependencies, previews (`#Preview`), simulators vs real devices, Instruments, Debug Memory Graph, View Hierarchy debugger, breakpoints and LLDB (`po`, `expr`), Console logging with `os.Logger`.

---

# 🔵 Part 2: Junior (1–3 years)

### Q37. SwiftUI view identity, lifecycle and re-rendering *(Must-know)*
SwiftUI identifies views by **structural identity** (position in the view tree) or **explicit identity** (`.id()`, `ForEach` ids). State attached to an identity persists; changing identity resets state. `body` is called when dependencies change and must be fast and side-effect free; use `.task`, `.onAppear`, `.onChange` for side effects. Splitting views into small structs scopes updates.

### Q38. `@State` vs `@Binding` vs `@Observable` ownership rules
`@State` owns value data (and `@Observable` model instances with `@State` in iOS 17+). `@Binding` references state owned by a parent (`$value`). Pass models down as plain parameters (observed automatically if `@Observable`) or via `@Environment`. Don't create a model inside `body` or with `@ObservedObject` in the owning view (it would be recreated); legacy owners use `@StateObject`.

### Q39. `ObservableObject` vs Observation framework
`ObservableObject` + `@Published` publishes `objectWillChange` for any property change, invalidating every view that observes the object. `@Observable` tracks property access per view, invalidating only views that read changed properties: less over-rendering and less boilerplate. Migrate gradually (iOS 17+).

### Q40. SwiftUI side effects: `.task`, `.onAppear`, `.onChange`
`.task { }` starts async work when the view appears and cancels it on disappear (and re-runs when `.task(id:)` changes). `.onAppear` is synchronous and may run multiple times. `.onChange(of:)` reacts to state changes. Avoid network calls in `init` or `body`.

### Q41. Environment values and dependency injection
```swift
struct APIClientKey: EnvironmentKey { static let defaultValue: APIClient = .live }
extension EnvironmentValues { var api: APIClient { get { self[APIClientKey.self] } set { self[APIClientKey.self] = newValue } } }
ContentView().environment(\.api, .mock)
```
Inject services via initializers, the environment, or lightweight containers; use protocols/closures for testability. Avoid global singletons.

### Q42. Animations and transitions
Implicit: `.animation(.spring, value: state)`; explicit: `withAnimation(.easeInOut) { ... }`; transitions (`.transition(.slide)`), `matchedGeometryEffect`, `PhaseAnimator`, `KeyframeAnimator`, `Canvas`/`TimelineView` for custom drawing. Animations apply to value changes; respect `accessibilityReduceMotion`.

### Q43. Gestures and interaction
`onTapGesture`, `LongPressGesture`, `DragGesture`, `MagnifyGesture`, gesture composition (`simultaneously`, `sequenced`), `@GestureState` for transient state, `.contextMenu`, `.swipeActions`, `.refreshable`, hover effects on iPadOS/visionOS. Prefer `Button` for tappable controls (accessibility).

### Q44. Forms and input
`TextField`, `SecureField`, `Toggle`, `Picker`, `DatePicker`, `Form`, `@FocusState` for focus management, `.keyboardType`, `.textContentType` (autofill/passwords), `.submitLabel`, validation with computed properties, `.scrollDismissesKeyboard`.

### Q45. Images and media
`AsyncImage` (basic), custom image pipelines with caching (Nuke, Kingfisher, SDWebImage), `Image(systemName:)` SF Symbols, asset catalogs (`@2x/@3x`, dark appearance variants), downsampling large images (`CGImageSourceCreateThumbnailAtIndex`), `AVKit`/`AVFoundation` for video/audio.

### Q46. Core Data essentials
Stack: `NSPersistentContainer` → `viewContext` (main queue) and background contexts; `NSManagedObject` entities; fetch requests with predicates and sort descriptors; `NSFetchedResultsController`/`@FetchRequest` for UI; merge policies; lightweight migrations; perform background work with `container.performBackgroundTask`. Never access a managed object from a different queue than its context.

### Q47. Codable deep dive
Custom `CodingKeys`, `init(from:)` for nested/variant payloads, `decodeIfPresent`, property wrappers for defaults, date/key strategies, decoding polymorphic JSON with enums, error handling via `DecodingError` cases (`keyNotFound`, `typeMismatch`). Validate API contracts to avoid crashes from unexpected nulls.

### Q48. URLSession details
Configurations (`default`, `ephemeral`, `background`), timeouts (`timeoutIntervalForRequest`), caching (`URLCache`), `URLProtocol` for stubbing, authentication challenges (certificate pinning in `URLSessionDelegate`), upload/download tasks with progress, `async` APIs (`data(for:)`, `bytes(for:)` for streaming). Use `waitsForConnectivity`.

### Q49. A reusable API client
```swift
struct APIClient {
    var baseURL: URL; var session: URLSession = .shared; var tokenProvider: () async -> String?
    func send<T: Decodable>(_ endpoint: Endpoint, as type: T.Type = T.self) async throws -> T {
        var req = endpoint.urlRequest(baseURL: baseURL)
        if let token = await tokenProvider() { req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization") }
        let (data, res) = try await session.data(for: req)
        guard let http = res as? HTTPURLResponse else { throw APIError.invalidResponse }
        switch http.statusCode { case 200..<300: return try JSONDecoder.api.decode(T.self, from: data)
        case 401: throw APIError.unauthorized
        default: throw APIError.badStatus(http.statusCode) }
    }
}
```
Add retry/backoff for idempotent requests, single-flight token refresh (actor), and cancellation support.

### Q50. Token refresh with an actor
```swift
actor TokenManager {
    private var refreshTask: Task<String, Error>?
    func validToken() async throws -> String {
        if let t = cachedToken, !t.isExpired { return t.value }
        if let task = refreshTask { return try await task.value }        // coalesce concurrent refreshes
        let task = Task { try await auth.refresh() }
        refreshTask = task
        defer { refreshTask = nil }
        return try await task.value
    }
}
```

### Q51. Deep links and Universal Links *(Must-know)*
Custom URL schemes (`myapp://`) are unverified and hijackable; **Universal Links** use HTTPS URLs verified through `apple-app-site-association` hosted on your domain and the Associated Domains entitlement. Handle in SwiftUI with `.onOpenURL` / `.onContinueUserActivity`, in UIKit via `SceneDelegate`. Route through a central router and validate parameters; preserve intended destination through login.

### Q52. Push notifications (APNs) *(Must-know)*
Enable Push capability, request authorization via `UNUserNotificationCenter`, register with `UIApplication.shared.registerForRemoteNotifications()`, send the device token to your backend, which calls APNs (token-based auth with `.p8` key) directly or via FCM. Handle foreground presentation (`willPresent`), taps (`didReceive`), silent pushes (`content-available`), notification service extensions (rich media/decryption) and categories/actions.
```swift
UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { granted, _ in
    if granted { DispatchQueue.main.async { UIApplication.shared.registerForRemoteNotifications() } }
}
```

### Q53. Background execution
iOS limits background time. Options: `beginBackgroundTask` (short finish-up), **BGTaskScheduler** (`BGAppRefreshTask`, `BGProcessingTask`) for opportunistic work, **background URLSession** for uploads/downloads continuing when suspended, silent pushes, background modes (audio, location, VoIP, Bluetooth) with App Review justification. The system decides timing; design for best-effort.

### Q54. Location, camera and permissions flows
`CLLocationManager` (when-in-use vs always, accuracy, significant-change), `AVCaptureSession`/`PhotosPicker`/`PHPickerViewController` (no photo library permission needed for picker), authorization state handling, pre-permission rationale UX, and graceful degradation when denied.

### Q55. App Transport Security (ATS) and networking security
ATS requires HTTPS with modern TLS by default; exceptions are discouraged. Certificate pinning via `URLSessionDelegate` (`urlSession(_:didReceive:completionHandler:)`) with SPKI hashes and backup pins. Avoid logging sensitive data and disable verbose network logs in release.

### Q56. Keychain best practices
Use `kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly` (or stricter) for tokens, store minimal data, include `kSecAttrService`/`kSecAttrAccount`, wrap operations in a small tested abstraction, handle app reinstall behaviour (Keychain items persist across reinstall unless handled), and use biometrics via `LocalAuthentication` as a gate.

### Q57. Biometrics (Face ID / Touch ID)
`LAContext.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason:)`; requires `NSFaceIDUsageDescription`. Combine with Keychain access controls (`.biometryCurrentSet`) for protected secrets. Provide fallback to passcode where appropriate.

### Q58. Sign in with Apple and passkeys
Apps offering third-party social login must also offer Sign in with Apple (App Store guideline, with exceptions). Use `AuthenticationServices` (`ASAuthorizationAppleIDProvider`), handle credential state revocation; adopt **passkeys** (`ASAuthorizationPlatformPublicKeyCredentialProvider`) with AutoFill-assisted UI for phishing-resistant login. See `../03_Backend/036_Authentication-and-Security.md`.

### Q59. StoreKit 2 (in-app purchases)
```swift
let products = try await Product.products(for: ["pro.monthly"])
let result = try await products[0].purchase()
switch result { case .success(.verified(let tx)): await tx.finish(); case .success(.unverified): break; case .pending, .userCancelled: break; @unknown default: break }
for await update in Transaction.updates { /* handle renewals/refunds */ }
```
Verify transactions server-side (App Store Server API / notifications), handle restore (`AppStore.sync()`), subscription status, offer codes. Digital goods must use IAP.

### Q60. WidgetKit and App Intents
Widgets are SwiftUI views driven by timeline entries (`TimelineProvider`), refreshed by the system with budgets; share data with the app via App Groups. **App Intents** expose actions to Shortcuts/Siri/Spotlight/Control Center; **Live Activities** (ActivityKit) show real-time updates on the Lock Screen/Dynamic Island, updated via push.

### Q61. Accessibility *(Must-know)*
VoiceOver labels/hints/traits (`.accessibilityLabel`, `.accessibilityHint`, `.accessibilityElement(children:)`), Dynamic Type, Reduce Motion, Increase Contrast, minimum 44×44 pt hit targets, accessibility identifiers for UI tests (`.accessibilityIdentifier`), rotor and custom actions. Audit with Accessibility Inspector.

### Q62. Localization and internationalization
String Catalogs (`.xcstrings`) with plural variations, `LocalizedStringKey`, `String(localized:)`, `Locale`/`FormatStyle` (dates, numbers, currencies), right-to-left support (leading/trailing, `layoutDirection`), pseudo-localization, per-app language in Settings. Don't concatenate localized fragments.

### Q63. Dark mode and theming
Semantic colors (`Color(.systemBackground)`, asset-catalog color sets with light/dark variants), `@Environment(\.colorScheme)`, SF Symbols rendering modes, `preferredColorScheme`. Build a design system with tokens (colors, spacing, typography) and reusable components.

### Q64. Testing: XCTest and Swift Testing
```swift
import Testing
@Test func discountApplies() { #expect(Cart(items: [.init(price: 100)]).total(discount: 0.1) == 90) }
@Test(arguments: [0, 1, 5]) func nonNegative(n: Int) { #expect(n >= 0) }
```
```swift
final class VMTests: XCTestCase {
    func testLoadsUsers() async throws {
        let vm = UsersModel(repo: MockRepo(users: [User(id: 1, name: "Ritesh Kumar")]))
        await vm.load()
        XCTAssertEqual(vm.users.count, 1)
    }
}
```
Use protocol-based mocks, async tests, `XCTestExpectation` for legacy callbacks, snapshot tests (swift-snapshot-testing), and UI tests (XCUITest). See `../06_Testing/040_Testing.md`.

### Q65. XCUITest basics
```swift
let app = XCUIApplication(); app.launchArguments = ["-uiTesting"]; app.launch()
app.textFields["email"].tap(); app.textFields["email"].typeText("ritesh@example.com")
app.buttons["signIn"].tap()
XCTAssertTrue(app.staticTexts["Welcome"].waitForExistence(timeout: 5))
```
Use accessibility identifiers, launch arguments to stub networks, avoid sleeps (use `waitForExistence`), and keep UI tests few and stable.

### Q66. Swift Package Manager (SPM)
Dependencies declared in Xcode or `Package.swift`; local packages for modularization; binary targets (XCFrameworks); resolve versions with `Package.resolved`. Prefer SPM over CocoaPods/Carthage for new work; plugins and build tool plugins (SwiftLint, codegen) extend builds.

### Q67. Code signing, certificates and provisioning
Developer account → **certificates** (development/distribution), **App ID/bundle ID**, **provisioning profiles** (link app, certificate, devices/entitlements), **entitlements** (push, App Groups, Associated Domains). Automatic signing for local dev; CI uses App Store Connect API keys, Fastlane `match` or Xcode Cloud. Keep private keys secure.

### Q68. TestFlight and App Store release
Archive → upload to App Store Connect → internal testers (immediate) → external testers (beta review) → submit for review with metadata, screenshots, privacy details (nutrition labels), export compliance, age rating. Use phased release for production; expedite reviews for critical fixes.

### Q69. Privacy manifests and required reason APIs
Apps and SDKs declare data collection and use of "required reason" APIs (e.g., UserDefaults, file timestamps, system boot time) in `PrivacyInfo.xcprivacy`; third-party SDKs must include manifests/signatures. ATT (`AppTrackingTransparency`) required for cross-app tracking. Missing declarations cause App Store Connect warnings/rejections (verify current rules).

### Q70. Performance basics with Instruments
Time Profiler (CPU hot spots), Allocations/Leaks, Core Animation (offscreen rendering, blending), Energy Log, Network, SwiftUI instrument (view body updates), App Launch template, `os_signpost` for custom intervals, MetricKit for production metrics. Profile on real devices in Release configuration.

### Q71. Memory management in practice
Retain cycles in closures/delegates (use `weak` delegates), timers (`Timer.scheduledTimer` retains target), `NotificationCenter` observers (use block API with `[weak self]` and remove tokens), Combine `AnyCancellable` lifetimes, image caches (`NSCache`), and Debug Memory Graph to find leaks.

### Q72. Logging and diagnostics
`os.Logger` with privacy annotations (`\(value, privacy: .private)`), log levels, signposts, crash reports (Xcode Organizer, MetricKit, Crashlytics/Sentry with dSYM upload), `OSLogStore` for exports. Never log secrets/PII.

---

# 🟡 Part 3: Mid (3–5 years)

### Q73. Swift Concurrency in depth *(Must-know)*
Tasks run on a cooperative thread pool; `await` marks suspension points where other work may run (and state may change). Concepts: **structured concurrency** (`async let`, `TaskGroup`, `withThrowingTaskGroup`) with automatic cancellation propagation; **unstructured tasks** (`Task {}` inherits actor context/priority; `Task.detached` doesn't); **actors** serialize access; **global actors** (`@MainActor`); **`Sendable`** checking; **task-local values**. Avoid blocking threads (`DispatchSemaphore` in async code) and holding actor-isolated state across awaits assuming it's unchanged (**actor reentrancy**).

### Q74. Actor reentrancy
When an actor method awaits, other calls can interleave, so state may change between the check and the use.
```swift
actor Bank {
    var balance = 100
    func withdraw(_ amt: Int) async throws {
        guard balance >= amt else { throw BankError.insufficient }
        try await audit.log("withdraw")          // suspension: another withdraw may run here
        balance -= amt                            // balance may no longer be sufficient!
    }
}
```
Fix by re-checking after the await, doing mutation before suspension, or restructuring so state transitions are synchronous.

### Q75. `@MainActor` and main-thread safety
Annotate UI-touching types/functions with `@MainActor` (view models, `ObservableObject`s). Swift 6 enforces isolation: calling a `@MainActor` API from a nonisolated context requires `await`. Use `nonisolated` for pure helpers, `MainActor.run {}` or `await MainActor.run` sparingly, and keep heavy work off the main actor (e.g., in a custom actor or detached task).

### Q76. Strict concurrency and Swift 6 migration
Adopt incrementally: enable `-strict-concurrency=targeted` → `complete`, fix `Sendable` warnings (make models value types/`final` immutable classes, use `@unchecked Sendable` with caution and locks), annotate global state (`nonisolated(unsafe)` as escape hatch), then switch to Swift 6 language mode per module. Check third-party package readiness.

### Q77. AsyncSequence and AsyncStream
```swift
for try await line in url.lines { process(line) }
let stream = AsyncStream<Int> { continuation in
    let token = center.addObserver(forName: .tick, object: nil, queue: nil) { _ in continuation.yield(1) }
    continuation.onTermination = { _ in center.removeObserver(token) }
}
for await tick in stream { print(tick) }
```
Bridge delegate/callback APIs to async streams; support cancellation via `onTermination`.

### Q78. Bridging callbacks to async
```swift
func load() async throws -> Data {
    try await withCheckedThrowingContinuation { cont in
        legacyLoad { result in cont.resume(with: result) }      // resume exactly once
    }
}
```
Resuming zero or multiple times is a bug (checked continuations trap in debug). Prefer `withCheckedContinuation` over unsafe.

### Q79. Architecture patterns: MVC, MVVM, VIPER, TCA, Clean *(Must-know)*
| Pattern | Idea | Notes |
|---|---|---|
| MVC (Apple default) | View ↔ Controller ↔ Model | Massive View Controller risk |
| **MVVM** | ViewModel exposes state/actions; View observes | Natural fit for SwiftUI/Observation |
| VIPER | View, Interactor, Presenter, Entity, Router | Heavy, strict separation |
| **TCA** (The Composable Architecture) | Unidirectional: State, Action, Reducer, Effect | Testable, composable; dependency |
| Clean Architecture | UI → Domain (use cases) → Data | Layered, protocol boundaries |
Choose per team size and complexity; avoid over-engineering small apps.

### Q80. MVVM with dependency injection
```swift
protocol UserRepository { func users() async throws -> [User] }
@MainActor @Observable final class UsersViewModel {
    private let repo: UserRepository
    private(set) var state: LoadState<[User]> = .idle
    init(repo: UserRepository) { self.repo = repo }
    func load() async { state = .loading; do { state = .loaded(try await repo.users()) } catch { state = .failed(error.localizedDescription) } }
}
enum LoadState<T> { case idle, loading, loaded(T), failed(String) }
```
Inject real/mock repositories; keep view models free of UIKit/SwiftUI imports where possible.

### Q81. Modularization with SPM
Feature packages (`FeatureHome`, `FeatureCheckout`), core packages (`DesignSystem`, `Networking`, `Persistence`, `Analytics`), and a thin app target composing them. Benefits: build times, encapsulation, ownership, previews per module. Define protocol-based boundaries and a navigation/DI composition root; watch for dependency cycles and over-fragmentation.

### Q82. Navigation architecture (coordinators/routers)
UIKit: Coordinator pattern to decouple navigation from view controllers. SwiftUI: central `Router` (`@Observable` with a `NavigationPath`), typed destinations, deep-link parsing into routes, sheets/alerts as state. Test navigation logic without UI.

### Q83. UIKit + SwiftUI interop
`UIHostingController` (SwiftUI inside UIKit), `UIViewRepresentable`/`UIViewControllerRepresentable` (UIKit inside SwiftUI with `Coordinator` for delegates), `UIHostingConfiguration` for cells. Migrate incrementally; share design tokens; test both layers.

### Q84. UICollectionView modern stack
Compositional layout (sections, groups, items), diffable data source (`NSDiffableDataSourceSnapshot`) with stable identifiers, cell registrations, `UIHostingConfiguration`. Handle prefetching (`UICollectionViewDataSourcePrefetching`), self-sizing cells and performance (avoid heavy layouts per cell).

### Q85. Core Data/SwiftData performance & concurrency
Use background contexts for writes/imports, batch operations (`NSBatchInsertRequest`, `NSBatchDeleteRequest`), fetch limits and batch sizes, indexes, relationship prefetching, `NSFetchedResultsController` for UI, lightweight migrations, avoid passing managed objects across threads (use `NSManagedObjectID`). SwiftData: `ModelActor` for background work, `#Predicate` queries, schema versioning/migration plans (verify maturity for your iOS target).

### Q86. CloudKit and sync
`NSPersistentCloudKitContainer` mirrors Core Data to iCloud; considerations: schema deployment, conflict handling, privacy (private DB), sharing, quota. For custom backends use an outbox and idempotent sync instead.

### Q87. Offline-first on iOS
Local DB as source of truth, optimistic writes queued in an outbox with client IDs/idempotency keys, background sync via `BGTaskScheduler`/foreground triggers/silent push, connectivity via `NWPathMonitor`, conflict resolution policy, sync status UI, and testing with Network Link Conditioner.

### Q88. Image and media handling performance
Downsample large images, cache decoded images, avoid synchronous image decoding on the main thread, prefetch, use `UIImage(named:)` for assets (cached) vs `contentsOfFile` (uncached), prefer HEIC/WebP-like formats where supported, stream video with `AVPlayer`, and watch memory warnings.

### Q89. Memory graph and leak debugging
Debug Memory Graph shows live objects and reference paths; common leaks: strong delegate references, closures capturing `self` in stored handlers, Combine sinks, timers, `NotificationCenter` tokens, nested SwiftUI `@State` objects with cycles. Add `deinit` logging in debug and unit tests that verify deallocation with weak references.

### Q90. Rendering performance (UIKit/SwiftUI)
Avoid offscreen rendering (shadows without `shadowPath`, masks), reduce blending/transparency, rasterize cautiously, flatten view hierarchies, use `drawingGroup()` selectively in SwiftUI, avoid expensive `body` work and large `GeometryReader` trees, throttle updates, and check dropped frames with Instruments and `CADisplayLink`/MetricKit hitch metrics.

### Q91. SwiftUI performance practices
Small subviews, stable identities, `Equatable` views (`.equatable()`) where beneficial, `@Observable` granularity, avoid creating objects/formatters in `body`, `LazyVStack` for long content, avoid `AnyView`, minimize `GeometryReader` use, use `Self._printChanges()` in debug to see why a view updates.

### Q92. App launch performance
Measure pre-main (dyld, static initializers) and post-main (first frame). Reduce dynamic frameworks (prefer static linking or merge frameworks), defer non-critical work after first frame, lazy-initialize SDKs, avoid heavy `application(_:didFinishLaunchingWithOptions:)` work, and use the App Launch Instruments template and MetricKit launch metrics.

### Q93. App size optimization
App thinning (slicing, on-demand resources), asset catalogs with compression, remove unused assets/code, link-time optimization, dead code stripping, avoid large embedded frameworks, check Size Report from Xcode archive (App Store Connect size estimates).

### Q94. Security: data protection & Secure Enclave
File Protection classes (`.completeUnlessOpen`, `.complete`), Keychain accessibility classes, Secure Enclave keys (non-exportable P-256) for signing/attestation, biometrics-protected items, `CryptoKit` (AES-GCM, ChaChaPoly, HMAC, ECDH, SHA-2) instead of hand-rolled crypto.
```swift
import CryptoKit
let key = SymmetricKey(size: .bits256)
let sealed = try AES.GCM.seal(data, using: key)
let opened = try AES.GCM.open(sealed, using: key)
```

### Q95. App Attest and DeviceCheck
`DCAppAttestService` generates attestation keys/assertions so your backend can verify requests come from a genuine app instance on Apple hardware; `DeviceCheck` offers two per-device bits. Use with server-side verification and rate limiting; not a substitute for authorization.

### Q96. Jailbreak detection and tamper resistance
Heuristics (file paths, sandbox integrity, dynamic library checks) are bypassable; treat as risk signals, with server-side decisions. Obfuscation raises cost only. Focus on server-side authorization, certificate pinning, secure storage and short-lived tokens. Follow OWASP MASVS.

### Q97. Handling sensitive UI
Hide content in app switcher (blur on `willResignActive`/scene phase), detect screen recording (`UIScreen.isCaptured`), secure text entry for sensitive fields, clipboard expiry (`UIPasteboard.setItems(... options: [.expirationDate])`), disable keyboard caching for sensitive inputs (`autocorrectionType`, `textContentType`).

### Q98. Networking resilience
Timeouts, retries with exponential backoff + jitter for idempotent calls, `waitsForConnectivity`, reachability via `NWPathMonitor`, cancellation, request deduplication, HTTP caching (ETag), pagination, offline queues, and clear error states. Use Network Link Conditioner to test poor networks.

### Q99. WebSockets and realtime on iOS
`URLSessionWebSocketTask` (native), Starscream; handle app lifecycle (disconnect on background, reconnect on foreground), ping/pong, backoff, message ordering/resume, and push for background delivery. See `../03_Backend/037_WebSockets-and-Realtime.md`.

### Q100. Push notification extensions
Notification Service Extension (modify content before display: decrypt, download attachments; ~30 s limit), Notification Content Extension (custom UI), Time Sensitive/Critical (entitlement) levels, provisional authorization, grouping (`threadIdentifier`), badges managed with server counts. Ensure APNs payload `mutable-content: 1` for service extensions.

### Q101. App Groups, extensions and shared data
App Groups provide shared containers/UserDefaults between the app and extensions (widgets, share, notification). Use shared Keychain access groups for tokens; Core Data store in a group container; keep extension memory/time limits in mind.

### Q102. CI/CD for iOS
Xcode Cloud, GitHub Actions on macOS runners, Fastlane (`gym`, `match`, `pilot`, `deliver`), App Store Connect API keys for upload, caching SPM/DerivedData, running unit and UI tests on simulators, SwiftLint/SwiftFormat, symbol (dSYM) upload to crash tools, automated TestFlight distribution. See `../07_DevOps_and_Cloud/047_CI-CD-and-DevOps.md`.

---

# 🟠 Part 4: Senior (5–7 years)

### Q103. Designing a scalable iOS architecture *(Must-know)*
- **Modules (SPM):** `App` shell, `Core` (Networking, Persistence, DesignSystem, Analytics, FeatureFlags), `Features/*` with public interfaces.
- **State:** `@Observable` view models (or TCA reducers) per feature, immutable models, explicit loading/error states.
- **Concurrency:** async/await with actors for shared state, `@MainActor` view models, strict concurrency enabled.
- **Data:** repository layer, SwiftData/Core Data as local source of truth, URLSession-based API client with auth actor, DTO ↔ domain mappers.
- **Navigation:** typed routes + router, deep links parsed centrally.
- **Quality:** SwiftLint, unit tests (Swift Testing), snapshot/UI tests, MetricKit, CI gates.
- **Delivery:** Xcode Cloud/Fastlane, phased releases, feature flags, remote config.

### Q104. Migrating UIKit apps to SwiftUI
Strategy: new screens in SwiftUI via `UIHostingController`; wrap legacy views with representables; migrate leaf components first; unify design tokens; adopt Observation and async/await; migrate navigation last (NavigationStack with UIKit interop); keep both test layers; drop to UIKit for unsupported behaviours (complex collection layouts) until SwiftUI matures for the target iOS version.

### Q105. Deployment target strategy
Support N and N-1 (or N-2) iOS versions based on analytics; newer APIs (Observation iOS 17, SwiftData iOS 17, Swift Testing Xcode 16) require availability checks (`if #available(iOS 17, *)`) or bumping targets. Weigh features and engineering cost vs user reach.

### Q106. Handling large datasets & performance in lists
Pagination with cursors, diffable updates, background context imports, prefetching images, cell reuse, avoiding heavy per-row computation (precompute view models), SwiftUI `LazyVStack` with stable IDs, `List` row identity, and measuring with Instruments (SwiftUI + Time Profiler).

### Q107. Background sync architecture
BGAppRefresh/BGProcessing schedules, background URLSession for uploads, silent push triggers with idempotent handlers, a persistent operation queue, bounded retries, battery/network constraints, observability (log sync outcomes), and graceful degradation when iOS denies time.

### Q108. Real-time features with push + sockets
Foreground via WebSocket/SSE; background via APNs (alert or silent); Live Activities updated through push-to-update tokens; dedupe messages by IDs; resume via cursors on foreground. Budget battery and respect rate limits (Live Activity update frequency).

### Q109. Payments and subscriptions architecture
StoreKit 2 for digital goods; server validates transactions via App Store Server API/notifications v2, maintains entitlements; client listens to `Transaction.updates`; handles refunds, family sharing, grace periods, price increases consent; Apple Pay (`PassKit`) for physical goods/services; compliance with App Review guidelines.

### Q110. Privacy and compliance
Data minimization, ATT only when tracking, privacy nutrition labels accuracy, privacy manifests for SDKs, consent flows (GDPR/DPDP), data deletion (in-app account deletion required), App Review data-use disclosures, regional restrictions, encryption export compliance, and secure analytics configurations.

### Q111. Observability for iOS
Crash reporting with dSYMs (Crashlytics/Sentry/Xcode Organizer), MetricKit (launch, hang, memory, energy, disk), custom signposts, network tracing with `traceparent` propagated to the backend, structured logging via `os.Logger`, performance dashboards by app version/device, alerts on crash-free rate and hangs.

### Q112. Hangs and responsiveness
A hang is main-thread unresponsiveness (>250 ms). Find with Instruments (Hangs), Xcode Organizer (hang rate), MetricKit. Causes: synchronous I/O, JSON parsing, Core Data fetches, layout thrash, lock contention, large view creation. Fix by moving work off-main, chunking, caching, and optimizing layouts.

### Q113. Energy and thermal considerations
Reduce location accuracy/updates, batch network calls, avoid timers/polling (use push), pause animations offscreen, use efficient codecs, respect Low Power Mode (`ProcessInfo.isLowPowerModeEnabled`) and thermal state (`thermalState`). Use the Energy gauge and MetricKit energy diagnostics.

### Q114. Testing strategy at scale
Pure logic in Swift Testing/XCTest unit tests (fast), view-model tests with mocked dependencies and deterministic clocks, snapshot tests for components, a small XCUITest suite on critical flows, performance tests (`measure`), accessibility audits (`performAccessibilityAudit`), contract tests against API schemas, and test plans in Xcode for configurations. Run in parallel on CI; quarantine flaky UI tests.

### Q115. Dependency management and abstraction
Wrap third-party SDKs (analytics, ads, crash, payments) behind protocols to isolate API changes and enable testing; pin versions with SPM; review privacy manifests and binary sizes; schedule updates; prefer first-party frameworks when sufficient.

### Q116. Feature flags and experimentation
Remote flags (Firebase Remote Config, LaunchDarkly, Statsig) with safe defaults and caching; kill switches for risky features; staged rollouts alongside phased App Store release; experiment exposure logging; flag cleanup process.

### Q117. App Store release management
Release trains, release notes, phased release, expedited review process, rollback strategy (cannot roll back binaries; use server flags/hotfix builds), review risk mitigation (permission strings, IAP compliance, privacy), TestFlight external groups, crash-free gates before 100%.

### Q118. Large codebase governance
CODEOWNERS, architecture decision records, module dependency rules (tools like `swift-dependency-graph`, custom lint), design system governance, shared API clients, build time monitoring, onboarding docs, and consistent code style (SwiftLint/SwiftFormat).

### Q119. visionOS, watchOS and multiplatform
Share code via SPM with platform conditionals (`#if os(watchOS)`), SwiftUI cross-platform views, WatchConnectivity/shared storage, widgets and Live Activities, visionOS windows/volumes; plan platform-specific UX and testing; keep core logic platform-agnostic.

### Q120. Kotlin Multiplatform with iOS
Shared Kotlin modules compiled to XCFrameworks consumed from Swift; interop limits (Swift generics/enums), tools like SKIE improve APIs; coordinate threading/memory models; CI for both platforms. Alternative: shared logic in Swift (Skip, Swift on Android) is emerging (verify maturity). See `043_Kotlin-Android.md`.

### Q121. Production debugging
Symbolicate crashes with dSYMs, reproduce with release builds, use Instruments traces from beta testers (sysdiagnose), feature-flag verbose logging, analyze Organizer metrics by device/OS, bisect SDK versions, and hotfix via expedited review plus server-side mitigations.

### Q122. Team practices
Design reviews with accessibility/privacy checklists, pairing on concurrency changes, performance budgets (launch, hitch rate, memory), weekly crash triage, device lab coverage (old/new devices, small/large screens), and learning from WWDC annually (planned adoption roadmap).

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q123. Choosing the iOS technology strategy *(Must-know)*
Options: native Swift (SwiftUI/UIKit), cross-platform UI (React Native, Flutter), Kotlin Multiplatform for shared logic with native UIs, or web/PWA. Decision factors: platform-specific features (Live Activities, widgets, Apple Pay, HealthKit, ARKit), UX polish expectations, performance, team skills, time-to-market, code sharing with Android/web, hiring, long-term maintenance and platform policy changes. Apple-platform-first or platform-deep products favour native; broad-reach CRUD apps may favour cross-platform. Validate with spikes on the riskiest features. See `041_React-Native.md`, `042_Flutter.md`, `043_Kotlin-Android.md`.

### Q124. Platform engineering for iOS teams
Provide golden paths: project templates, SPM module templates, CI/CD (Xcode Cloud/Fastlane), signing automation, design system package, analytics/logging/feature-flag wrappers, performance dashboards (MetricKit), crash triage tooling, preview/demo apps per module, onboarding docs. Measure build times, test reliability and release cadence.

### Q125. Technical governance and decision records
Architecture decision records for navigation, state management, persistence, concurrency adoption; API review for core modules; deprecation policy for internal packages; security and privacy reviews for new SDKs/entitlements; accessibility acceptance criteria; and performance budgets enforced in CI.

### Q126. Managing yearly platform changes
Plan around WWDC/Xcode/iOS releases: beta testing in CI, deprecation tracking, privacy/entitlement changes, minimum Xcode requirements for App Store submissions, SDK compatibility matrices, and scheduled adoption of new APIs behind availability checks. Maintain a "platform upgrade" epic each cycle.

### Q127. Reliability and release safety at scale
Phased releases, kill switches, server-driven config, crash/hang/launch regressions gating promotion, backward-compatible APIs for old app versions (long tail), forced-update flows with minimum version checks, canary cohorts via TestFlight, and incident runbooks (revoke tokens, disable features, expedited review).

### Q128. Security & compliance programme
Threat modelling, MASVS-based reviews, pen tests, SDK vetting (privacy manifests, network behaviour), secrets management in CI (App Store Connect keys, certificates), data classification and encryption, app attest for sensitive APIs, privacy compliance (GDPR/DPDP/CCPA/COPPA), and audit trails for entitlements and releases.

### Q129. Performance as a product feature
SLOs for launch time, hitch rate, hang rate, memory, battery; baseline on oldest supported device; automated performance tests; Organizer/MetricKit monitoring; a standing performance backlog; link metrics to business outcomes (conversion, retention).

### Q130. AI features on iOS
On-device: Core ML, Create ML, Vision, Natural Language, Foundation Models framework / Apple Intelligence APIs (availability varies by OS/device: verify), MLX for research; cloud LLMs via your backend (never embed keys), streaming with `AsyncSequence`/SSE, privacy disclosures, caching and rate limits, fallbacks when on-device models are unavailable, and safety/moderation. See `../11_Generative_AI/065_OpenAI-and-Claude-API.md`.

### Q131. Accessibility & inclusion programme
Design-system components with accessibility baked in, automated audits (`performAccessibilityAudit`), manual VoiceOver/Switch Control/Voice Control testing, Dynamic Type up to accessibility sizes, Reduce Motion, localization/RTL QA, and including users with disabilities in research. Legal requirements (ADA, EAA) increasingly apply.

### Q132. Vendor/SDK risk
Every SDK affects privacy labels, size, launch time and stability. Maintain an SDK inventory, wrap behind interfaces, require privacy manifests, lazy-load, monitor crashes attributable to SDKs, and plan removal paths.

### Q133. Culture and quality
Blameless postmortems, quality metrics visible to all, dogfooding builds, device-lab days, code review checklists (retain cycles, threading/actor isolation, accessibility, privacy), internal tech talks, and learning budgets for platform evolution.

### Q134. Communicating trade-offs
Translate technical choices into business outcomes: native polish vs speed, adopting new OS APIs vs supporting older devices, SwiftUI migration pace, the cost of strict concurrency migration, and release risk vs cadence. Use prototypes, metrics, and phased roadmaps with decision gates.

---

# 💻 Part 6: Hands-On Tasks & Code

### H1. SwiftUI list with async loading, error state and pull-to-refresh
```swift
@MainActor @Observable
final class ProductsViewModel {
    enum State { case idle, loading, loaded([Product]), failed(String) }
    private(set) var state: State = .idle
    private let repo: ProductRepository
    init(repo: ProductRepository) { self.repo = repo }
    func load() async {
        if case .loading = state { return }
        state = .loading
        do { state = .loaded(try await repo.products()) } catch is CancellationError { /* ignore */ } catch { state = .failed(error.localizedDescription) }
    }
}

struct ProductsView: View {
    @State private var vm: ProductsViewModel
    init(repo: ProductRepository) { _vm = State(initialValue: ProductsViewModel(repo: repo)) }
    var body: some View {
        NavigationStack {
            Group {
                switch vm.state {
                case .idle, .loading: ProgressView().frame(maxWidth: .infinity, maxHeight: .infinity)
                case .failed(let msg): ContentUnavailableView("Couldn't load", systemImage: "wifi.slash", description: Text(msg))
                case .loaded(let items): List(items) { item in NavigationLink(value: item) { ProductRow(product: item) } }
                        .navigationDestination(for: Product.self) { ProductDetail(product: $0) }
                }
            }
            .navigationTitle("Products")
            .refreshable { await vm.load() }
        }
        .task { await vm.load() }
    }
}
```

### H2. Networking layer with auth actor, retry and Codable
```swift
actor AuthTokenStore {
    private var task: Task<String, Error>?
    private var token: String?
    func accessToken(refresh: @escaping () async throws -> String) async throws -> String {
        if let token { return token }
        if let task { return try await task.value }
        let t = Task { try await refresh() }
        task = t; defer { task = nil }
        token = try await t.value
        return token!
    }
    func invalidate() { token = nil }
}

struct HTTPClient {
    let session: URLSession; let tokens: AuthTokenStore; let refresh: () async throws -> String
    func get<T: Decodable>(_ url: URL, retries: Int = 2) async throws -> T {
        var attempt = 0
        while true {
            do {
                var req = URLRequest(url: url, timeoutInterval: 15)
                req.setValue("Bearer \(try await tokens.accessToken(refresh: refresh))", forHTTPHeaderField: "Authorization")
                let (data, res) = try await session.data(for: req)
                guard let http = res as? HTTPURLResponse else { throw APIError.invalidResponse }
                if http.statusCode == 401 { await tokens.invalidate(); throw APIError.unauthorized }
                guard (200..<300).contains(http.statusCode) else { throw APIError.badStatus(http.statusCode) }
                return try JSONDecoder.api.decode(T.self, from: data)
            } catch let e as URLError where e.code == .timedOut || e.code == .networkConnectionLost {
                guard attempt < retries else { throw e }
                attempt += 1
                try await Task.sleep(for: .milliseconds(Int(pow(2.0, Double(attempt))) * 300))     // exponential backoff
            }
        }
    }
}
```

### H3. Keychain wrapper (minimal)
```swift
enum Keychain {
    static func save(_ data: Data, account: String, service: String = Bundle.main.bundleIdentifier!) throws {
        let query: [String: Any] = [kSecClass as String: kSecClassGenericPassword, kSecAttrService as String: service, kSecAttrAccount as String: account]
        SecItemDelete(query as CFDictionary)
        var add = query
        add[kSecValueData as String] = data
        add[kSecAttrAccessible as String] = kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly
        let status = SecItemAdd(add as CFDictionary, nil)
        guard status == errSecSuccess else { throw KeychainError.status(status) }
    }
    static func load(account: String, service: String = Bundle.main.bundleIdentifier!) throws -> Data? {
        let q: [String: Any] = [kSecClass as String: kSecClassGenericPassword, kSecAttrService as String: service, kSecAttrAccount as String: account, kSecReturnData as String: true, kSecMatchLimit as String: kSecMatchLimitOne]
        var out: AnyObject?
        let status = SecItemCopyMatching(q as CFDictionary, &out)
        if status == errSecItemNotFound { return nil }
        guard status == errSecSuccess else { throw KeychainError.status(status) }
        return out as? Data
    }
}
```

### H4. Search with debounce using async tasks (cancel previous)
```swift
@MainActor @Observable
final class SearchModel {
    var query = "" { didSet { scheduleSearch() } }
    private(set) var results: [Item] = []
    private var searchTask: Task<Void, Never>?
    private let service: SearchService
    init(service: SearchService) { self.service = service }
    private func scheduleSearch() {
        searchTask?.cancel()
        let q = query.trimmingCharacters(in: .whitespaces)
        guard q.count >= 2 else { results = []; return }
        searchTask = Task {
            try? await Task.sleep(for: .milliseconds(300))
            guard !Task.isCancelled else { return }
            if let r = try? await service.search(q), !Task.isCancelled { results = r }
        }
    }
}
```

### H5. Core Data/SwiftData background import pattern
```swift
@ModelActor
actor ImportActor {
    func importUsers(_ dtos: [UserDTO]) throws {
        for dto in dtos {
            let id = dto.id
            let existing = try modelContext.fetch(FetchDescriptor<UserModel>(predicate: #Predicate { $0.id == id })).first
            if let existing { existing.name = dto.name } else { modelContext.insert(UserModel(id: dto.id, name: dto.name)) }
        }
        try modelContext.save()
    }
}
```
Run imports off the main actor and let `@Query` views update automatically.

### H6. Deep link router
```swift
enum Route: Hashable { case product(id: String), profile, orders }
struct DeepLinkParser {
    static func route(from url: URL) -> Route? {
        guard let comps = URLComponents(url: url, resolvingAgainstBaseURL: false), ["example.com", "www.example.com"].contains(comps.host ?? "") else { return nil }
        let parts = comps.path.split(separator: "/").map(String.init)
        switch parts.first {
        case "product": return parts.count > 1 ? .product(id: parts[1]) : nil
        case "profile": return .profile
        case "orders": return .orders
        default: return nil
        }
    }
}
// .onOpenURL { url in if let r = DeepLinkParser.route(from: url) { router.navigate(r) } }
```
Validate host/paths and require authentication for sensitive routes.

### H7. Unit tests with Swift Testing and a mock repository
```swift
struct MockRepo: ProductRepository { var result: Result<[Product], Error>; func products() async throws -> [Product] { try result.get() } }

@MainActor @Suite struct ProductsViewModelTests {
    @Test func loadsProducts() async {
        let vm = ProductsViewModel(repo: MockRepo(result: .success([Product(id: "1", name: "Keyboard")])))
        await vm.load()
        guard case .loaded(let items) = vm.state else { Issue.record("Expected loaded"); return }
        #expect(items.count == 1)
    }
    @Test func showsErrorOnFailure() async {
        let vm = ProductsViewModel(repo: MockRepo(result: .failure(URLError(.notConnectedToInternet))))
        await vm.load()
        if case .failed = vm.state {} else { Issue.record("Expected failed") }
    }
}
```

### H8. Fastlane lane for TestFlight
```ruby
default_platform(:ios)
platform :ios do
  desc "Build and upload to TestFlight"
  lane :beta do
    setup_ci if ENV["CI"]
    match(type: "appstore", readonly: true)
    increment_build_number(build_number: ENV["GITHUB_RUN_NUMBER"])
    build_app(scheme: "App", export_method: "app-store")
    upload_to_testflight(api_key: app_store_connect_api_key(key_id: ENV["ASC_KEY_ID"], issuer_id: ENV["ASC_ISSUER_ID"], key_content: ENV["ASC_KEY"]), skip_waiting_for_build_processing: true)
    upload_symbols_to_crashlytics
  end
end
```

### H9. WidgetKit timeline (outline)
```swift
struct Provider: TimelineProvider {
    func placeholder(in: Context) -> Entry { Entry(date: .now, balance: "—") }
    func getSnapshot(in: Context, completion: @escaping (Entry) -> Void) { completion(Entry(date: .now, balance: "₹12,400")) }
    func getTimeline(in: Context, completion: @escaping (Timeline<Entry>) -> Void) {
        Task {
            let balance = (try? await SharedStore.balance()) ?? "—"
            completion(Timeline(entries: [Entry(date: .now, balance: balance)], policy: .after(.now.addingTimeInterval(15 * 60))))
        }
    }
}
```
Share data with the app through App Groups; keep timelines light (system-budgeted).

### H10. Performance test + hang detection
```swift
func testScrollPerformance() throws {
    let app = XCUIApplication(); app.launch()
    measure(metrics: [XCTOSSignpostMetric.scrollingAndDecelerationMetric, XCTCPUMetric(), XCTMemoryMetric()]) {
        app.collectionViews.firstMatch.swipeUp(velocity: .fast)
    }
}
```
Track baselines in CI, and use MetricKit in production for hangs and launch regressions.

---

# 🐞 Part 7: Debugging Scenarios

### D1. `Fatal error: Unexpectedly found nil while unwrapping an Optional value`
Force unwrap (`!`), implicitly unwrapped optional (`IBOutlet` accessed before view load), or failed `as!` cast. Replace with `guard let`/`if let`, validate outlets/identifiers, use `try?`/`decodeIfPresent`, and enable "Exception breakpoint" in Xcode to find the line.

### D2. UI updated from a background thread
Purple runtime warning "Publishing changes from background threads is not allowed" or UIKit "Main Thread Checker". Mark view models `@MainActor`, hop with `await MainActor.run`, or ensure Combine uses `.receive(on: DispatchQueue.main)`.

### D3. Memory leak: `deinit` never called
Retain cycle through closures stored on `self`, strong delegates, timers/observers, Combine sinks. Use `[weak self]`, `weak var delegate`, invalidate timers, store `AnyCancellable`s correctly; verify with Debug Memory Graph and `deinit` prints.

### D4. SwiftUI view not updating
State not observable (plain class without `@Observable`/`ObservableObject`), mutated a copy of a value, `@ObservedObject` recreated each render, binding not passed with `$`, or using an index-based `ForEach` on changing data. Use correct ownership wrappers and stable IDs; debug with `Self._printChanges()`.

### D5. SwiftUI view re-renders too often / jank
Large `body` dependencies, `ObservableObject` publishing for every property change, expensive formatters created in `body`, `GeometryReader` loops, unstable IDs causing view recreation. Split views, adopt `@Observable`, cache formatters, profile with the SwiftUI Instrument.

### D6. Crash: `Thread 1: EXC_BAD_ACCESS`
Accessing deallocated memory (unsafe pointers, `unowned` reference after dealloc, Obj-C bridging) or stack overflow/infinite recursion. Enable Zombie Objects/Address Sanitizer, replace `unowned` with `weak`, review unsafe code.

### D7. Data race / Swift concurrency warnings after enabling strict mode
Non-`Sendable` types crossing isolation, mutable global state, captured mutable vars in `@Sendable` closures. Make models value types, isolate state in actors/`@MainActor`, use `@unchecked Sendable` only with documented synchronization, and migrate module by module. Thread Sanitizer helps find real races.

### D8. Push notifications not delivered
Missing Push capability/entitlement, wrong APNs environment (sandbox vs production), expired/invalid device token, token not sent to backend, auth key/team ID mismatch, payload errors (size > 4 KB, bad JSON), Focus/notification settings, silent push throttling. Test with APNs diagnostic tools and device logs (Console.app).

### D9. Universal Links open Safari instead of the app
AASA file not served over HTTPS at `/.well-known/apple-app-site-association` with correct content type and no redirects, wrong appID (`TEAMID.bundleid`), Associated Domains entitlement missing, link tapped within same domain from Safari address bar, or Apple CDN cache delay. Validate with `swcutil`/Apple validator and reinstall.

### D10. App rejected by App Review
Common reasons: crashes/bugs, missing demo account, broken links, unclear permission strings, IAP bypass for digital goods, missing account deletion, privacy label mismatch, Sign in with Apple missing when required, incomplete metadata. Fix, document in Review Notes, and resubmit; use Resolution Center for appeals.

### D11. Code signing errors ("No profiles for X were found")
Bundle ID mismatch, expired certificate/profile, missing device UDID in development profile, wrong team, entitlements not covered by the profile, CI keychain not unlocked. Use automatic signing locally; in CI use `match`/API keys and verify with `security find-identity`.

### D12. Core Data crash: `NSInternalInconsistencyException` / threading violations
Accessing managed objects on the wrong queue, saving conflicting contexts, model changes without migration. Use `perform`/`performAndWait`, pass `NSManagedObjectID`s, set merge policies, and provide lightweight migration.

### D13. Auto Layout conflicts ("Unable to simultaneously satisfy constraints")
Over-constrained views, missing priorities, ambiguous layouts. Read the console, add identifiers (`accessibilityIdentifier`/constraint identifiers), lower priorities, use Debug View Hierarchy "Show Constraints".

### D14. Network works in simulator but not on device
ATS blocking HTTP, local IP vs `localhost`, VPN/proxy, missing Local Network permission (iOS 14+ `NSLocalNetworkUsageDescription`), certificate trust, IPv6-only networks. Test with Network Link Conditioner and real devices.

### D15. Background task never runs
BGTaskScheduler identifier not in `Info.plist` (`BGTaskSchedulerPermittedIdentifiers`), scheduled too late/often, device conditions (Low Power Mode), or app force-quit by user. Simulate with `e -l objc -- (void)[[BGTaskScheduler sharedScheduler] _simulateLaunchForTaskWithIdentifier:@"id"]` in LLDB.

---

# 🧩 Part 8: Tricky Questions

### T1. Are Swift structs always allocated on the stack?
No. Value semantics don't dictate storage: large or escaping structs, structs captured by closures, existential boxes and array buffers can use the heap. Copy-on-write and the optimizer decide.

### T2. `weak` vs `unowned`?
`weak` is optional and becomes `nil` on dealloc (safe); `unowned` is non-optional and crashes if accessed after dealloc (use only when lifetimes are guaranteed).

### T3. Does `[weak self]` always belong in closures?
No. It's needed when the closure is stored and could create a cycle or outlive self unexpectedly. Non-escaping closures and short-lived async work don't need it, and overuse can hide logic errors by silently skipping work.

### T4. Is `Task {}` the same as `DispatchQueue.global().async`?
No. `Task` participates in structured concurrency features (priority inheritance, cancellation, actor context inheritance) and uses a cooperative pool; GCD is queue-based and unaware of suspension points.

### T5. Why can an `await` introduce bugs in actor code?
Reentrancy: state may change during suspension. Re-validate assumptions after awaits.

### T6. Is `@MainActor` the same as `DispatchQueue.main.async`?
Similar outcome (main-thread execution) but `@MainActor` is compile-time checked and integrates with async/await; it may run synchronously when already on the main actor.

### T7. `some View` vs `any View`?
`some` returns a single concrete type known to the compiler (fast, preserves identity); `any` is an existential box (runtime cost, type erasure). SwiftUI's `body` uses `some View`.

### T8. Does SwiftUI replace UIKit?
Not entirely. SwiftUI covers most UI needs on modern OS versions, but UIKit remains essential for complex custom behaviour, legacy support and some APIs.

### T9. Is `UserDefaults` safe for secrets?
No: it's unencrypted plist storage included in backups. Use Keychain.

### T10. Are app updates reviewed again if only server config changes?
No. Server-driven config/content doesn't need review, but it must not change the app's core purpose or bypass App Store rules (e.g., downloading executable code is prohibited except via interpreters allowed by guidelines).

### T11. Does Keychain data survive app deletion?
Often yes on the same device (items can persist after reinstall); remove on first launch after reinstall if required, and set accessibility classes accordingly. iCloud Keychain sync is optional per item.

### T12. Why does `viewDidLoad` run only once but `onAppear` can run multiple times?
`viewDidLoad` fires when the view is first loaded; SwiftUI's `onAppear` fires whenever the view becomes visible (navigation, tabs, scene changes). Use `.task` or state guards for one-time work.

### T13. What's the difference between `lazy` property and computed property?
`lazy var` computes once on first access and stores the value; computed properties compute every time and store nothing.

### T14. Is `Codable` slow?
It's reflection-free (synthesized code) and reasonably fast; for very large payloads consider streaming parsers, background decoding and avoiding unnecessary intermediate models.

### T15. Can you rely on `deinit` for cleanup of critical data?
No. The process may be killed without deinit; persist critical state proactively (scene phase changes) and use `deinit` only for resource cleanup.

### T16. Is iOS multitasking the same as background execution?
No. Suspended apps don't run code; background modes and BG tasks are limited, system-scheduled opportunities.

### T17. Why do SwiftUI previews sometimes break?
Preview-only dependencies, heavy init work, missing environment objects/models, or crashes in `body`. Provide lightweight preview data and avoid network/disk in previews.

### T18. Does Swift guarantee thread-safe collections?
No. Arrays/dictionaries are not thread-safe for concurrent mutation; use actors, locks (`OSAllocatedUnfairLock`) or serial queues.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- **Language?** Swift.
- **Value types?** struct, enum, tuple.
- **Reference types?** class, actor, closures.
- **Memory management?** ARC.
- **Break cycles with?** `weak` / `unowned`.
- **Optional unwrap safely?** `if let` / `guard let` / `??`.
- **UI frameworks?** SwiftUI, UIKit.
- **Local view state?** `@State`.
- **Shared parent state?** `@Binding`.
- **Observable model (iOS 17+)?** `@Observable`.
- **Concurrency primitives?** async/await, Task, actor, `@MainActor`.
- **Parallel child tasks?** `async let` / `TaskGroup`.
- **Reactive framework?** Combine.
- **Persistence?** SwiftData, Core Data, UserDefaults, Keychain.
- **Secrets storage?** Keychain.
- **Networking?** URLSession + Codable.
- **Package manager?** SPM.
- **Push service?** APNs.
- **Verified deep links?** Universal Links (AASA).
- **Background tasks?** BGTaskScheduler.
- **IAP framework?** StoreKit 2.
- **Widgets?** WidgetKit; **Live Activities?** ActivityKit.
- **Testing frameworks?** XCTest, Swift Testing, XCUITest.
- **Profiler?** Instruments.
- **Crash metrics?** MetricKit / Xcode Organizer.
- **Signing assets?** Certificates + provisioning profiles + entitlements.
- **Beta distribution?** TestFlight.
- **Privacy file?** `PrivacyInfo.xcprivacy`.
- **Tracking consent?** ATT.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about an iOS app you built.
STAR: "I built a personal-finance app in Swift: SwiftUI + Observation, SwiftData as the local source of truth, an async/await networking layer with an auth actor, Keychain for tokens, Face ID gating, WidgetKit and Live Activities, and StoreKit 2 subscriptions. We modularized with SPM, used Swift Testing and snapshot tests, and shipped via Xcode Cloud. Crash-free users reached 99.9%, cold start was 0.9 s on iPhone 12, and the App Store rating hit 4.8."

### P2. Describe a performance issue you solved.
"Scrolling a transaction list hitched on older devices. Instruments showed heavy `body` recomputation and synchronous image decoding. I split the row into small views, moved to `@Observable` for finer updates, downsampled images off the main thread, precomputed formatted strings in the view model, and added prefetching. Hitch ratio dropped from 12 ms/s to 2 ms/s."

### P3. How did you migrate to Swift concurrency?
"We adopted async/await module by module: wrapped callback APIs with continuations, introduced actors for token refresh and caches, annotated view models with `@MainActor`, enabled targeted then complete strict concurrency, and fixed Sendable issues by making models immutable. Crash reports related to threading dropped to zero."

### P4. Tell me about an App Review rejection.
"A build was rejected for vague camera permission text and a missing account deletion path. We rewrote usage strings, added in-app deletion with backend support, updated privacy labels, provided a demo account in Review Notes, and re-submitted; approval came in 24 hours. We added a pre-submission checklist to prevent repeats."

### P5. How do you secure an iOS app?
"Keychain with strict accessibility classes, ATS + certificate pinning with backup pins, App Attest verified server-side, biometric gating for sensitive actions, no secrets in the bundle, minimal permissions, privacy manifests and MASVS-based reviews."

### P6. How do you ensure quality in releases?
"Unit tests for logic, snapshot/UI tests for key flows, accessibility audits, MetricKit/Crashlytics dashboards, phased releases with crash/hang gates, feature flags and server kill switches, and blameless postmortems."

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- **Swift language:** optionals, value vs reference types, enums with associated values, protocols/extensions, generics, opaque/existential types, closures, ARC, error handling, property wrappers, macros, result builders.
- **Concurrency:** async/await, structured concurrency, actors and reentrancy, `@MainActor`, `Sendable`, AsyncSequence/AsyncStream, GCD, Combine, Swift 6 strict concurrency.
- **UI:** SwiftUI (state, Observation, layout, navigation, animations, lists, accessibility), UIKit (view controllers, Auto Layout, diffable collection views), interop.
- **Architecture:** MVC, MVVM, TCA, Clean, coordinators/routers, modularization with SPM, dependency injection.
- **Data:** URLSession/Codable, SwiftData, Core Data, Keychain, UserDefaults, CloudKit, offline-first, caching.
- **Platform features:** push (APNs), deep links (Universal Links), background tasks, widgets, Live Activities, App Intents, StoreKit 2, Sign in with Apple, passkeys, HealthKit/ARKit awareness.
- **Quality:** XCTest/Swift Testing/XCUITest, snapshot tests, Instruments, MetricKit, accessibility audits, CI/CD (Xcode Cloud, Fastlane).
- **Security and privacy:** ATS, pinning, Keychain, Secure Enclave, App Attest, privacy manifests, ATT, MASVS.
- **Release:** signing, provisioning, TestFlight, App Store review, phased releases.
- **Leadership:** technology strategy, platform engineering, governance, yearly platform upgrades.

## Mixed topics
- iOS + Android (`043_Kotlin-Android.md`): parity, KMP, push, deep links, security.
- iOS + cross-platform (`041_React-Native.md`, `042_Flutter.md`): strategy and brownfield integration.
- iOS + backend APIs (`../03_Backend/035_GraphQL-and-REST-APIs.md`): pagination, idempotency, GraphQL (Apollo iOS), auth.
- iOS + realtime (`../03_Backend/037_WebSockets-and-Realtime.md`) and push pipelines (`../03_Backend/038_Message-Queues.md`).
- iOS + Firebase/Supabase (`../03_Backend/034_Firebase-and-Supabase.md`).
- iOS + security (`../03_Backend/036_Authentication-and-Security.md`): OAuth2 PKCE, passkeys, token storage.
- iOS + testing (`../06_Testing/040_Testing.md`) and DevOps (`../07_DevOps_and_Cloud/047_CI-CD-and-DevOps.md`).
- iOS + AI (`../11_Generative_AI/065_OpenAI-and-Claude-API.md`): Core ML, on-device models, streaming UIs.

---

# 🔬 Part 12: iOS Internals

### I1. Swift compilation pipeline
Source → parse/AST → semantic analysis → SIL (Swift Intermediate Language) with ARC and generic optimizations → LLVM IR → machine code. Whole-module optimization improves cross-file inlining and specialization; generics can be specialized to avoid runtime cost.

### I2. Method dispatch
Static (direct) for structs, final classes and `private` members; vtable dispatch for class overrides; witness tables for protocol conformance; message dispatch (`objc_msgSend`) for `@objc dynamic` members. Prefer `final` and value types for speed.

### I3. ARC implementation
Retain/release operations are inserted by the compiler (not a tracing GC); strong, weak (side tables) and unowned reference counts; the optimizer removes redundant retains. Cycles require manual breaking; atomic refcounting adds some cost across threads.

### I4. App launch sequence
`exec` → dyld loads dependencies and runs initializers → runtime setup (Objective-C/Swift metadata) → `UIApplicationMain` (or SwiftUI `App` entry) → `application(_:didFinishLaunching)` → scene creation → first frame committed by Core Animation. Pre-main time grows with dynamic libraries and static initializers.

### I5. Rendering pipeline
UIKit/SwiftUI builds layer trees (Core Animation). The app process commits layer changes; the **render server** composites on the GPU and presents at display refresh (60/120 Hz ProMotion). Offscreen passes, blending and large layers add cost. SwiftUI diffs a view graph (AttributeGraph) and updates only dependent attributes.

### I6. Run loops and threads
Main thread runs the main `RunLoop` handling input, timers, and UI. GCD queues map to a thread pool managed by libdispatch; Swift concurrency uses a cooperative pool sized to cores with continuations resuming tasks.

### I7. Sandbox, code signing and entitlements
Apps run in a sandbox with a container directory; code signing ensures integrity and identity; entitlements grant capabilities (push, App Groups, keychain groups); the OS verifies signatures and provisioning at install/launch. Hardened runtime, data protection classes and Secure Enclave strengthen security.

### I8. Memory management at the OS level
iOS has no swap; jetsam terminates apps exceeding memory limits (foreground limits vary by device). Receive `didReceiveMemoryWarning`/low-memory notifications, purge caches (`NSCache` auto-evicts), and keep background footprint small.

### I9. Observation framework internals
`@Observable` macro rewrites stored properties to register access with an `ObservationRegistrar`; SwiftUI tracks which properties each `body` reads (`withObservationTracking`) and invalidates only those views when they change.

---

# 📊 Part 13: Reference Tables

### SwiftUI state tools
| Tool | Owner | Use |
|---|---|---|
| `@State` | The view | Local value state, owns `@Observable` models |
| `@Binding` | Parent | Two-way reference |
| `@Bindable` | Caller | Bindings into `@Observable` models |
| `@Environment` | System/ancestor | Injected values, `dismiss`, `scenePhase` |
| `@AppStorage` | UserDefaults | Persisted simple prefs |
| `@Query` | SwiftData | Reactive fetch |
| `@StateObject`/`@ObservedObject` | Legacy | `ObservableObject` ownership/observation |

### Concurrency tools
| Tool | Use |
|---|---|
| `async/await` | Linear async code |
| `async let` / `TaskGroup` | Structured parallelism |
| `Task` / `Task.detached` | Unstructured work |
| `actor` | Serialized mutable state |
| `@MainActor` | UI isolation |
| `AsyncStream` | Bridge callbacks/events |
| GCD | Legacy/low-level |
| Combine | Reactive pipelines |

### Persistence options
| Option | Best for | Notes |
|---|---|---|
| UserDefaults | Small prefs | Not secure |
| Keychain | Secrets | Survives reinstall (maybe) |
| SwiftData | Modern object persistence | iOS 17+ |
| Core Data | Mature object graph | Complex but powerful |
| SQLite (GRDB) | Relational control | Third-party |
| Files | Documents, caches | `FileManager` |
| CloudKit | Apple sync | iCloud account required |

### Background options
| Need | API |
|---|---|
| Finish short work | `beginBackgroundTask` |
| Opportunistic refresh | BGAppRefreshTask |
| Heavy maintenance | BGProcessingTask |
| Upload/download continuing | Background URLSession |
| Server-triggered | Silent push / VoIP / PushKit (restricted) |
| Continuous capability | Background modes (audio, location, BLE) |

### Distribution
| Channel | Audience | Notes |
|---|---|---|
| Xcode run | Developer | Dev profile |
| TestFlight internal | Team (≤100) | No review |
| TestFlight external | Testers (≤10k) | Beta review |
| App Store | Public | Full review, phased release |
| Enterprise/Ad Hoc | Limited | Strict eligibility |

### Version highlights (verify)
| Item | Notes |
|---|---|
| Swift 5.9 | Macros, parameter packs, `if`/`switch` expressions |
| Swift 6 | Complete data-race safety in language mode 6, typed throws |
| iOS 17 | Observation, SwiftData, StandBy, interactive widgets |
| iOS 18 | Controls, SwiftUI refinements, Swift Testing (Xcode 16) |
| StoreKit 2 | async/await IAP APIs, server notifications v2 |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
```swift
var a = [1, 2, 3]
var b = a
b.append(4)
print(a.count, b.count)
```
**Output:** `3 4` (arrays are value types with copy-on-write).

### O2.
```swift
class Box { var v = 1 }
let x = Box(); let y = x; y.v = 9
print(x.v)
```
**Output:** `9` (class instances share identity).

### O3.
```swift
let s: String? = nil
print(s?.count ?? -1)
```
**Output:** `-1`.

### O4.
```swift
class A { var b: B? ; deinit { print("A") } }
class B { var a: A? ; deinit { print("B") } }
var a: A? = A(); var b: B? = B()
a?.b = b; b?.a = a
a = nil; b = nil
```
**Output:** nothing printed — a retain cycle prevents deallocation. Make one reference `weak`.

### O5.
```swift
func f() async { print(1); await Task.yield(); print(2) }
Task { await f() }
print(3)
```
**Output (typical):** `3` may print before or between `1` and `2`; ordering across tasks isn't guaranteed. Only code within `f()` is ordered (`1` before `2`).

### O6.
```swift
enum Op { case add(Int, Int), neg(Int) }
switch Op.add(1, 2) { case .add(let a, let b): print(a + b); case .neg(let n): print(-n) }
```
**Output:** `3`.

### O7.
```swift
Text("Hi").padding().background(.red)
Text("Hi").background(.red).padding()
```
**Result:** first: red background covers text plus padding; second: red hugs the text, padding is transparent outside it.

### O8.
```swift
let numbers = [3, 1, 2]
print(numbers.sorted(), numbers)
```
**Output:** `[1, 2, 3] [3, 1, 2]` (`sorted()` returns a new array; `sort()` mutates a `var`).

### O9.
```swift
let result = try? JSONDecoder().decode(User.self, from: badData)
print(result == nil)
```
**Output:** `true` (errors become `nil`; you lose the reason, so log or use `do/catch` where diagnosing matters).

### O10.
```swift
@State private var items = [1, 2, 3]
ForEach(items.indices, id: \.self) { i in Text("\(items[i])") }
// then: items.remove(at: 0)
```
**Result:** potential crash/misrender because index-based identity changes while views read stale indices; use stable `id`s.

### O11.
```swift
func double(_ x: Int?) -> Int { x! * 2 }
double(nil)
```
**Result:** runtime crash: "Unexpectedly found nil while unwrapping an Optional value".

### O12.
```swift
var count = 0
let inc = { count += 1 }
inc(); inc()
print(count)
```
**Output:** `2` (closures capture variables by reference).

---

# ✅ Part 15: MCQs

**1. Swift structs are:**
A) Reference types  B) Value types  C) Always heap allocated  D) Immutable
**Answer: B**

**2. To break a retain cycle you typically use:**
A) `strong`  B) `weak` or `unowned`  C) `lazy`  D) `inout`
**Answer: B**

**3. Which marks UI code to run on the main thread in Swift concurrency?**
A) `@Sendable`  B) `@MainActor`  C) `@escaping`  D) `@objc`
**Answer: B**

**4. In SwiftUI, local view-owned state uses:**
A) `@Binding`  B) `@State`  C) `@Environment`  D) `@Published`
**Answer: B**

**5. Where should authentication tokens be stored?**
A) UserDefaults  B) Keychain  C) Plist in bundle  D) Documents folder
**Answer: B**

**6. Universal Links require:**
A) Custom URL scheme only  B) AASA file on your domain + Associated Domains entitlement  C) No setup  D) A QR code
**Answer: B**

**7. Which API schedules opportunistic background refresh?**
A) `Timer`  B) BGTaskScheduler  C) `sleep`  D) `NotificationCenter`
**Answer: B**

**8. `guard let` is mainly used to:**
A) Force unwrap  B) Exit early when a precondition fails  C) Create loops  D) Declare constants
**Answer: B**

**9. Actors provide:**
A) Parallel unrestricted access  B) Serialized access to mutable state  C) Network calls  D) UI layouts
**Answer: B**

**10. Which tool profiles CPU hot spots?**
A) Instruments Time Profiler  B) Simulator  C) Storyboard  D) TestFlight
**Answer: A**

**11. `some View` means:**
A) Any type at runtime  B) One concrete opaque type chosen by the implementation  C) Optional view  D) Deprecated
**Answer: B**

**12. The App Store requires a privacy manifest for:**
A) Required reason APIs / SDK data usage declarations  B) Only games  C) Only enterprise apps  D) Nothing
**Answer: A**

**13. `@Observable` (Observation) improves over `ObservableObject` by:**
A) Using more memory  B) Tracking property-level reads for finer updates  C) Removing state  D) Requiring Combine
**Answer: B**

**14. Which provisioning asset lists allowed devices for development?**
A) Entitlements  B) Provisioning profile  C) Storyboard  D) Asset catalog
**Answer: B**

**15. Which is true about `UserDefaults`?**
A) Encrypted by default  B) Suitable for secrets  C) Suitable for small non-sensitive preferences  D) Shared across all apps
**Answer: C**

**16. StoreKit 2 transactions should be:**
A) Trusted only on device  B) Verified (and ideally server-validated) then finished  C) Ignored  D) Stored in UserDefaults only
**Answer: B**

**17. A hang is:**
A) A crash  B) Main thread unresponsive for a noticeable period  C) A network error  D) A build failure
**Answer: B**

**18. TestFlight external testing requires:**
A) No review  B) Beta App Review  C) Enterprise account  D) Jailbreak
**Answer: B**

**19. Which keeps child tasks tied to a parent scope?**
A) `Task.detached`  B) Structured concurrency (`async let`, TaskGroup)  C) `DispatchQueue.global`  D) `Thread`
**Answer: B**

**20. App Attest helps your backend verify:**
A) UI colors  B) Requests come from a genuine app instance  C) Device battery  D) App Store rating
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

1. **Force unwrapping** (`!`) and `try!` in production code.
2. **Retain cycles** from strong delegates/closures/timers/observers.
3. **UI work off the main thread** or missing `@MainActor` isolation.
4. **Ignoring actor reentrancy** assumptions after `await`.
5. **Doing I/O or JSON parsing on the main thread.**
6. **Creating objects/formatters inside SwiftUI `body`.**
7. **Index-based `ForEach` with mutable data** (unstable identity).
8. **Storing tokens in `UserDefaults`**; logging secrets/PII.
9. **Massive view controllers / view models** with mixed responsibilities.
10. **Ignoring accessibility** (labels, Dynamic Type, hit targets).
11. **Skipping Instruments profiling** on real devices in Release.
12. **Missing/vague permission strings** and privacy declarations.
13. **Not handling denied permissions** and offline states.
14. **Overusing `@unchecked Sendable`/`nonisolated(unsafe)`** to silence concurrency warnings.
15. **Passing Core Data objects across threads.**
16. **Hard-coding secrets or API keys in the app bundle.**
17. **Not testing on older devices/iOS versions** within the support window.
18. **Heavy work in `application(_:didFinishLaunching)`** slowing launch.
19. **Using custom URL schemes for sensitive deep links** instead of Universal Links.
20. **No dSYM upload/symbolication** for crash reports.
21. **Delaying Xcode/SDK upgrades** until forced by App Store requirements.
22. **No phased release or monitoring** for production rollouts.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You explain **value vs reference semantics, ARC and retain cycles** and diagnose leaks with the Memory Graph.
- You use **Swift Concurrency correctly**: structured tasks, actors with reentrancy awareness, `@MainActor`, `Sendable`, cancellation.
- You build **SwiftUI apps with proper ownership** (`@State`/`@Observable`), stable identities, and efficient updates; you also know UIKit deeply.
- You design **modular, testable architectures** (SPM modules, protocol boundaries, DI) and choose patterns pragmatically.
- You handle **offline-first, sync, caching, background constraints** realistically for iOS.
- You secure apps with **Keychain, ATS/pinning, App Attest, privacy manifests**, and follow App Review policies.
- You profile with **Instruments/MetricKit**, fix hangs/hitches/launch time, and set performance budgets.
- You automate **testing and release** (Swift Testing, XCUITest, snapshot tests, Xcode Cloud/Fastlane, phased releases).
- You keep up with **yearly platform changes** and plan adoption/migrations with availability checks.
- You make honest **native vs cross-platform/KMP** decisions and quantify outcomes.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Core facts
```
Swift: optionals • value types (struct/enum) vs reference (class/actor) • protocols + extensions • generics
ARC: strong/weak/unowned • [weak self] in stored closures • delegates are weak
Concurrency: async/await • async let/TaskGroup • actors (+reentrancy) • @MainActor • Sendable
SwiftUI: @State owns • @Binding shares • @Observable models • @Environment injects • modifier order matters
```

### Performance checklist
Profile Release builds on real devices (Time Profiler, Allocations, SwiftUI, Hangs, App Launch) • small SwiftUI views + stable IDs • downsample images off-main • avoid main-thread I/O • lazy lists • defer launch work • reduce dynamic frameworks • monitor MetricKit.

### Data/security checklist
Keychain for secrets (After First Unlock This Device Only) • SwiftData/Core Data with background contexts • Codable with strict error handling • ATS + pinning (backup pins) • biometrics gate • App Attest • privacy manifest & usage strings • no PII in logs.

### Release checklist
Bundle ID/entitlements • certificates & profiles (match/API keys) • archive → TestFlight → phased release • dSYM upload • privacy labels • account deletion • IAP compliance • crash/hang gates • kill switches via remote config.

### Interview strategy
1. Clarify product needs: offline, background, performance, device/OS range, security, team skills.
2. Propose architecture (modules, state, data, concurrency) and justify.
3. Show key code patterns (MVVM with `@Observable`, async API client, actor for shared state).
4. Cover lifecycle/background limits, memory/ARC, performance and security.
5. Describe testing, CI/CD, TestFlight and phased rollout, monitoring.
6. Close with a measured story (launch time, hitch rate, crash-free users).

### Final checklist before the interview
- [ ] Explain optionals, value vs reference types, protocols, generics, closures, ARC and cycles.
- [ ] Explain async/await, structured concurrency, actors/reentrancy, `@MainActor`, `Sendable`.
- [ ] Build SwiftUI screens with proper state ownership and navigation; know UIKit interop.
- [ ] Design MVVM/Clean architecture with SPM modularization and dependency injection.
- [ ] Implement networking (URLSession, Codable, token refresh actor) and persistence (SwiftData/Core Data/Keychain).
- [ ] Handle push, deep links, background tasks, permissions and App Store policies.
- [ ] Profile and optimize launch, hitches, hangs and memory with Instruments/MetricKit.
- [ ] Secure the app (Keychain, ATS/pinning, App Attest) and meet privacy requirements.
- [ ] Test (Swift Testing/XCTest/XCUITest), automate CI/CD (Xcode Cloud/Fastlane), manage releases.
- [ ] Prepare a project story, a performance story and an incident/rollback story with numbers.
