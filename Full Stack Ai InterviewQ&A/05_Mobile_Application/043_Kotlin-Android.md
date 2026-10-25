# Kotlin & Android Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **Kotlin 2.0–2.2 (K2 compiler)**, **Android 14–16 (API 34–36)**, **Android Gradle Plugin 8.x**, **Jetpack Compose (BOM 2024–2025) with Material 3**, **Jetpack libraries** (ViewModel, Navigation, Room, DataStore, WorkManager, Paging 3, Hilt), **Kotlin Coroutines/Flow**, **Retrofit/OkHttp**, **kotlinx.serialization**, and testing tools (JUnit 4/5, MockK, Turbine, Compose UI tests, Espresso, Robolectric, Macrobenchmark). Android and Jetpack change frequently (new permission rules, foreground-service types, edge-to-edge defaults, predictive back): anything marked "verify" should be checked in the official docs (developer.android.com, kotlinlang.org) for your target API level. Examples use the sample name **Ritesh Kumar**.
> This file covers Kotlin language essentials (null safety, data/sealed classes, extension and scope functions, coroutines, Flow), Android fundamentals (components, manifest, lifecycle, intents, resources, permissions), UI with Jetpack Compose and the legacy View system, architecture (MVVM/MVI, Clean, UDF, ViewModel, repository), dependency injection (Hilt/Koin), networking and persistence (Retrofit, Room, DataStore), background work (WorkManager, foreground services), navigation, testing, performance (baseline profiles, R8, leak detection), security (Keystore, network security config, Play Integrity), build and release (Gradle Kotlin DSL, flavors, AAB, Play Console), Kotlin Multiplatform and production practice. Related topics: iOS counterpart in `044_Swift-iOS.md`, cross-platform in `041_React-Native.md` and `042_Flutter.md`, testing in `../06_Testing/040_Testing.md`, API design in `../03_Backend/035_GraphQL-and-REST-APIs.md`, security in `../03_Backend/036_Authentication-and-Security.md`, CI/CD in `../07_DevOps_and_Cloud/047_CI-CD-and-DevOps.md`.

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
- [Part 12: Android Internals](#-part-12-android-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is Android? *(Must-know)*
An open-source, Linux-kernel-based mobile operating system led by Google. Layers: **Linux kernel** → **HAL** → **native libraries + Android Runtime (ART)** → **Java/Kotlin framework APIs** → **apps**. Apps run in sandboxed processes with their own Linux user ID, communicating via Binder IPC.

### Q2. Why Kotlin for Android?
Google's preferred language since 2019 ("Kotlin-first"). Concise, null-safe, interoperable with Java, supports coroutines for async, extension functions, data/sealed classes, and powers Jetpack Compose. Fewer crashes (null safety) and less boilerplate than Java.

### Q3. Kotlin vs Java quick comparison
| | Kotlin | Java |
|---|---|---|
| Null safety | In type system (`String?`) | Optional annotations |
| Boilerplate | Data classes, properties, defaults | Getters/setters, builders |
| Async | Coroutines/Flow | Callbacks, RxJava, executors |
| Extensions | Yes | No (static utils) |
| Checked exceptions | No | Yes |
| Interop | 100% with Java | N/A |

### Q4. Kotlin basics: val, var, types
```kotlin
val name = "Ritesh Kumar"        // read-only reference (like final)
var age = 28                     // mutable
val city: String? = null         // nullable
const val BASE_URL = "https://api.example.com"   // compile-time constant (top-level/object)
lateinit var adapter: UserAdapter                // initialized later (non-null, non-primitive)
val heavy by lazy { computeExpensive() }         // lazy, thread-safe by default
```

### Q5. Null safety *(Must-know)*
```kotlin
val len = city?.length ?: 0          // safe call + Elvis
city?.let { println(it.uppercase()) }
val forced = city!!.length           // throws NPE if null (avoid)
if (city != null) println(city.length)    // smart cast
```
Platform types (`String!`) from Java may be null: annotate or treat defensively.

### Q6. Functions and lambdas
```kotlin
fun add(a: Int, b: Int = 0): Int = a + b
fun greet(name: String, vararg tags: String) { /* ... */ }
val square: (Int) -> Int = { it * it }
list.filter { it % 2 == 0 }.map { it * 2 }.sumOf { it }
fun <T> List<T>.second(): T = this[1]                // extension function
```
Trailing lambda syntax, named arguments, default values, higher-order functions.

### Q7. Classes: data, sealed, object, enum *(Must-know)*
```kotlin
data class User(val id: String, val name: String, val age: Int = 0)    // equals, hashCode, toString, copy, componentN
val older = user.copy(age = user.age + 1)

sealed interface UiState<out T> {
    data object Loading : UiState<Nothing>
    data class Success<T>(val data: T) : UiState<T>
    data class Error(val message: String) : UiState<Nothing>
}
object Analytics { fun log(e: String) { /* singleton */ } }
enum class Role { USER, ADMIN }
```
`when` over a sealed type is exhaustive (compiler-checked).

### Q8. `when`, ranges and destructuring
```kotlin
val label = when (code) { 200, 201 -> "OK"; in 400..499 -> "Client error"; else -> "Other" }
val (id, name) = user                // destructuring from data class
for (i in 0 until 5 step 2) println(i)
```

### Q9. Scope functions: let, run, with, apply, also *(Must-know)*
| Function | Receiver | Returns | Typical use |
|---|---|---|---|
| `let` | `it` | lambda result | null checks, transform |
| `run` | `this` | lambda result | compute with receiver |
| `with` | `this` | lambda result | operate on an object |
| `apply` | `this` | the object | configure/initialize |
| `also` | `it` | the object | side effects (logging) |

### Q10. Collections
`List`/`Set`/`Map` are read-only views; `MutableList` etc. are mutable. Operators: `map`, `filter`, `groupBy`, `associateBy`, `flatMap`, `fold`, `zip`, `partition`, `sortedBy`, `distinctBy`. Use `Sequence` (`asSequence()`) for lazy pipelines on large data.

### Q11. Properties, delegation and companion objects
```kotlin
class Profile(private val repo: Repo) {
    var nickname: String = ""
        set(value) { field = value.trim() }
    val displayName: String get() = nickname.ifBlank { "Guest" }
    companion object { const val TAG = "Profile"; fun create() = Profile(Repo()) }
}
val text by remember { mutableStateOf("") }       // property delegation (Compose)
```

### Q12. Coroutines basics *(Must-know)*
Lightweight, structured concurrency for asynchronous code. A `suspend` function can pause without blocking a thread.
```kotlin
suspend fun loadUser(id: String): User = withContext(Dispatchers.IO) { api.getUser(id) }

viewModelScope.launch {
    try { val user = loadUser("42"); _state.value = UiState.Success(user) }
    catch (e: IOException) { _state.value = UiState.Error(e.message ?: "Network error") }
}
val (a, b) = coroutineScope { awaitAll(async { f1() }, async { f2() }) }       // parallel
```
Dispatchers: `Main` (UI), `IO` (blocking I/O), `Default` (CPU), `Unconfined`. Scopes tie lifetime to components (`viewModelScope`, `lifecycleScope`).

### Q13. Structured concurrency and cancellation
Child coroutines are cancelled when the parent scope cancels; failures propagate up (use `supervisorScope`/`SupervisorJob` to isolate siblings). Cancellation is cooperative: suspend functions check it; long CPU loops need `ensureActive()`. Never swallow `CancellationException`.

### Q14. Flow basics *(Must-know)*
Cold asynchronous streams of values.
```kotlin
fun ticker(): Flow<Int> = flow { var i = 0; while (true) { emit(i++); delay(1000) } }
ticker().map { it * 2 }.filter { it % 4 == 0 }.collect { println(it) }

private val _state = MutableStateFlow(UiState.Loading)         // hot, holds latest value
val state: StateFlow<UiState> = _state.asStateFlow()
val events = MutableSharedFlow<Event>()                         // hot, no initial value
```
`StateFlow` for UI state, `SharedFlow` for one-off events, `stateIn`/`shareIn` to convert cold flows. Collect lifecycle-aware: `repeatOnLifecycle(STARTED)` or `collectAsStateWithLifecycle()`.

### Q15. Android app components *(Must-know)*
- **Activity**: a single screen with UI.
- **Service**: background work without UI (foreground services show a notification).
- **BroadcastReceiver**: reacts to system/app broadcasts.
- **ContentProvider**: shares structured data across apps.
All declared in `AndroidManifest.xml` and started via **Intents**.

### Q16. AndroidManifest.xml essentials
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
  <uses-permission android:name="android.permission.INTERNET" />
  <application android:name=".App" android:label="@string/app_name" android:theme="@style/Theme.App"
               android:networkSecurityConfig="@xml/network_security_config" android:allowBackup="false">
    <activity android:name=".MainActivity" android:exported="true">
      <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
      </intent-filter>
    </activity>
  </application>
</manifest>
```
Since Android 12, components with intent filters must declare `android:exported` explicitly.

### Q17. Activity lifecycle *(Must-know)*
`onCreate` → `onStart` → `onResume` (interactive) → `onPause` → `onStop` → `onDestroy`; `onRestart` when returning from stopped. Configuration changes (rotation, dark mode, locale) recreate the Activity by default: persist UI state in `ViewModel`/`rememberSaveable`/`SavedStateHandle`. Process death can occur in the background: restore essential state.

### Q18. Fragment lifecycle (View system)
A Fragment has its own lifecycle plus a **view lifecycle** (`onCreateView` → `onViewCreated` → `onDestroyView`). Use `viewLifecycleOwner` for observing LiveData/Flow to avoid leaks. Compose with Navigation largely removes the need for Fragments in new apps.

### Q19. Intents: explicit vs implicit
Explicit names the target component; implicit declares an action and the system finds handlers (share, view URL, dial).
```kotlin
startActivity(Intent(this, DetailActivity::class.java).putExtra("id", "42"))
startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://example.com")))
```
Use `ActivityResultContracts` (`registerForActivityResult`) instead of `startActivityForResult`. Use `PendingIntent` with `FLAG_IMMUTABLE` (required on Android 12+ unless mutability is needed).

### Q20. Resources and configuration
`res/` holds layouts, drawables, strings, colors, dimens, styles, and qualifiers for locale (`values-hi`), density, night mode (`values-night`), size (`sw600dp`), orientation. Access via `R.string.app_name`. Never hard-code user-facing strings.

### Q21. Jetpack Compose basics *(Must-know)*
Declarative UI toolkit in Kotlin: UI is a function of state.
```kotlin
@Composable
fun Counter() {
    var count by rememberSaveable { mutableIntStateOf(0) }
    Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text("Hello Ritesh Kumar", style = MaterialTheme.typography.titleLarge)
        Text("Count: $count")
        Button(onClick = { count++ }) { Text("Increment") }
    }
}
```
State changes trigger **recomposition** of the composables that read that state.

### Q22. State in Compose: remember, rememberSaveable, state hoisting *(Must-know)*
`remember` keeps a value across recompositions (lost on configuration change); `rememberSaveable` survives recreation (Bundle-serializable); **state hoisting** moves state up so composables are stateless and reusable: pass `value` and `onValueChange`.
```kotlin
@Composable
fun NameField(name: String, onNameChange: (String) -> Unit) =
    OutlinedTextField(value = name, onValueChange = onNameChange, label = { Text("Name") })
```
Keep screen state in a `ViewModel`, expose `StateFlow`, and collect with `collectAsStateWithLifecycle()`.

### Q23. Layouts and modifiers
`Column`, `Row`, `Box`, `LazyColumn`, `LazyRow`, `LazyVerticalGrid`, `ConstraintLayout`, `Scaffold`, `Surface`. **Modifier order matters**: `Modifier.padding(16.dp).background(Color.Red)` differs from `background(...).padding(...)`. Common modifiers: `fillMaxWidth()`, `weight(1f)`, `clickable`, `size`, `clip`, `semantics`.

### Q24. Lazy lists
```kotlin
LazyColumn(contentPadding = PaddingValues(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
    items(users, key = { it.id }) { user -> UserRow(user, onClick = { onOpen(user.id) }) }
}
```
Provide stable `key`s, avoid heavy work in item lambdas, and use `contentType` for mixed lists. Never nest a scrollable `LazyColumn` inside another vertical scroller without bounded height.

### Q25. Material 3 and theming
```kotlin
@Composable
fun AppTheme(darkTheme: Boolean = isSystemInDarkTheme(), content: @Composable () -> Unit) {
    val colors = if (Build.VERSION.SDK_INT >= 31) { if (darkTheme) dynamicDarkColorScheme(LocalContext.current) else dynamicLightColorScheme(LocalContext.current) }
                 else if (darkTheme) DarkColors else LightColors
    MaterialTheme(colorScheme = colors, typography = AppTypography, content = content)
}
```
Dynamic color (Android 12+), typography scale, shapes, `MaterialTheme.colorScheme.primary` tokens.

### Q26. Navigation in Compose
```kotlin
val nav = rememberNavController()
NavHost(nav, startDestination = "home") {
    composable("home") { HomeScreen(onOpen = { id -> nav.navigate("detail/$id") }) }
    composable("detail/{id}", arguments = listOf(navArgument("id") { type = NavType.StringType })) { entry ->
        DetailScreen(id = entry.arguments?.getString("id")!!)
    }
}
```
Newer Navigation versions support type-safe routes with `@Serializable` classes (verify version). Pass ids, not big objects; deep links via `navDeepLink`.

### Q27. ViewModel *(Must-know)*
Holds UI-related state, survives configuration changes, scoped to a screen/NavGraph, and is cleared when the owner is permanently gone.
```kotlin
@HiltViewModel
class UsersViewModel @Inject constructor(private val repo: UserRepository, private val saved: SavedStateHandle) : ViewModel() {
    private val _state = MutableStateFlow<UiState<List<User>>>(UiState.Loading)
    val state = _state.asStateFlow()
    init { refresh() }
    fun refresh() = viewModelScope.launch {
        _state.value = runCatching { repo.users() }.fold({ UiState.Success(it) }, { UiState.Error(it.message ?: "Error") })
    }
}
```
Don't hold Activity/Context/View references in a ViewModel.

### Q28. Architecture: MVVM and unidirectional data flow
UI observes immutable state from the ViewModel and sends events/intents up; the ViewModel calls use cases/repositories and emits new state. Layers: UI → (domain optional) → data (repositories, data sources). MVI formalizes `State`, `Intent`/`Event`, and `Effect`. Google's guide recommends UDF with a data layer as the source of truth.

### Q29. Dependency injection basics: Hilt
```kotlin
@HiltAndroidApp class App : Application()
@AndroidEntryPoint class MainActivity : ComponentActivity()

@Module @InstallIn(SingletonComponent::class)
object NetworkModule {
    @Provides @Singleton fun okHttp(): OkHttpClient = OkHttpClient.Builder().connectTimeout(15, TimeUnit.SECONDS).build()
    @Provides @Singleton fun retrofit(client: OkHttpClient): Retrofit = Retrofit.Builder().baseUrl(BASE_URL).client(client)
        .addConverterFactory(Json.asConverterFactory("application/json".toMediaType())).build()
}
```
Alternatives: Koin (service locator DSL, runtime), Dagger (Hilt's base), manual DI.

### Q30. Retrofit + kotlinx.serialization
```kotlin
@Serializable data class UserDto(val id: String, val name: String)
interface UserApi {
    @GET("users") suspend fun users(@Query("page") page: Int): List<UserDto>
    @POST("users") suspend fun create(@Body body: CreateUserRequest): UserDto
}
```
Retrofit supports `suspend` functions. Add OkHttp interceptors for auth/logging (never log tokens in production), timeouts, retries and caching.

### Q31. Room database *(Must-know)*
```kotlin
@Entity(tableName = "users") data class UserEntity(@PrimaryKey val id: String, val name: String, @ColumnInfo(index = true) val email: String)
@Dao interface UserDao {
    @Query("SELECT * FROM users ORDER BY name") fun observeAll(): Flow<List<UserEntity>>
    @Upsert suspend fun upsert(users: List<UserEntity>)
    @Query("DELETE FROM users") suspend fun clear()
}
@Database(entities = [UserEntity::class], version = 2, exportSchema = true)
abstract class AppDb : RoomDatabase() { abstract fun userDao(): UserDao }
```
Compile-time SQL verification, `Flow` observation, migrations (`Migration(1, 2)` or auto-migrations), type converters. Never run queries on the main thread.

### Q32. DataStore vs SharedPreferences
DataStore (Preferences or Proto) is asynchronous, transactional and `Flow`-based; replaces SharedPreferences, which blocks on I/O and lacks type safety guarantees. Use Proto DataStore for typed settings; use encrypted storage/Keystore for secrets.

### Q33. Coil / image loading
```kotlin
AsyncImage(model = ImageRequest.Builder(ctx).data(url).crossfade(true).size(Size.ORIGINAL).build(), contentDescription = "Avatar", modifier = Modifier.size(48.dp).clip(CircleShape))
```
Coil (Kotlin-first) or Glide handle caching, downsampling, lifecycle awareness. Always provide `contentDescription` (or `null` for decorative images).

### Q34. Permissions
Declare in the manifest and request at runtime for dangerous permissions with `ActivityResultContracts.RequestPermission`. Handle rationale and permanently denied states. Newer rules: notifications (Android 13+ `POST_NOTIFICATIONS`), photo picker instead of broad storage access, approximate vs precise location, background location separately.

### Q35. Notifications
Create a **notification channel** (Android 8+), build with `NotificationCompat`, request `POST_NOTIFICATIONS` on 13+, use `PendingIntent.FLAG_IMMUTABLE`, set deep links, group/summary notifications. Push via FCM; handle data messages in `FirebaseMessagingService` and show notifications yourself when needed.

### Q36. Logging, debugging and tools
Logcat (`Log.d(TAG, ...)`, Timber), Android Studio debugger, Layout Inspector, Compose tooling (previews, recomposition counts), Profiler (CPU/memory/network/energy), App Inspection (database inspector), `adb` (`adb logcat`, `adb shell`, `adb install`), StrictMode in debug builds.

---

# 🔵 Part 2: Junior (1–3 years)

### Q37. Recomposition in depth *(Must-know)*
Compose re-executes composables whose read state changed. Composables must be **idempotent and side-effect free**, may run in any order, in parallel or be skipped. The compiler marks composables **skippable** when all parameters are stable and unchanged. Reading state as low as possible (e.g., inside a lambda `Modifier.offset { ... }`) limits the recomposition scope.

### Q38. Stability: stable vs unstable types
A type is **stable** if its observable state changes notify Compose (or it is immutable). Unstable parameters (plain `List`, classes with `var` and no annotation) prevent skipping. Fixes: immutable data classes with `val`, `@Immutable`/`@Stable`, `kotlinx.collections.immutable` (`ImmutableList`), or enabling **strong skipping mode** (default in newer Kotlin/Compose compiler; verify your version). Inspect with the Compose compiler reports.

### Q39. Side effects in Compose *(Must-know)*
| API | Purpose |
|---|---|
| `LaunchedEffect(key)` | Run suspend work tied to composition; restarts when key changes |
| `DisposableEffect(key)` | Setup + cleanup (listeners, observers) |
| `SideEffect` | Publish Compose state to non-Compose code after every successful recomposition |
| `rememberCoroutineScope` | Launch coroutines from event handlers |
| `produceState` | Convert non-Compose state into State |
| `rememberUpdatedState` | Capture latest value in long-lived effects |
```kotlin
LaunchedEffect(userId) { viewModel.load(userId) }
DisposableEffect(lifecycleOwner) { val obs = LifecycleEventObserver { _, e -> /* ... */ }; lifecycleOwner.lifecycle.addObserver(obs); onDispose { lifecycleOwner.lifecycle.removeObserver(obs) } }
```

### Q40. derivedStateOf and remember keys
`derivedStateOf` avoids recomposition when derived values change less often than inputs (e.g., `showFab = listState.firstVisibleItemIndex > 0`). `remember(key1, key2) { ... }` recomputes when keys change. Don't over-use: only for expensive or frequently changing sources.

### Q41. Compose performance practices
Provide `key`s in lazy lists, defer state reads (lambda-based modifiers), use `remember` for expensive objects, avoid allocating lambdas capturing unstable values in hot paths, use `Modifier.drawBehind`/`graphicsLayer` for animation-frame work, enable baseline profiles, and measure in release builds. Debug with Layout Inspector recomposition counts.

### Q42. Interoperability: Compose and Views
`ComposeView` embeds Compose in XML/Fragments; `AndroidView` embeds Views (MapView, WebView, ads) in Compose. Migrate incrementally screen by screen; share theme via Material theme adapters.

### Q43. Animations in Compose
`animate*AsState` (simple), `updateTransition`, `AnimatedVisibility`, `AnimatedContent`, `Animatable` (coroutine-driven), `infiniteTransition`, shared element transitions (`SharedTransitionLayout`, verify version), gesture-driven with `Modifier.draggable`/`pointerInput`.

### Q44. Accessibility in Compose and Views *(Must-know)*
`Modifier.semantics { contentDescription = "..." ; role = Role.Button }`, minimum touch target 48dp, `mergeDescendants`, heading semantics, support TalkBack, font scaling (use `sp`), contrast, focus order, `clearAndSetSemantics` for custom components. Test with Accessibility Scanner and Compose `assertHasClickAction` checks.

### Q45. Text, fonts and localization
Use `stringResource(R.string.x)`, plurals (`pluralStringResource`), `String.format` placeholders, per-app language settings (Android 13+ `LocaleManager` / AppCompat `setApplicationLocales`), RTL support (`start/end` instead of `left/right`), and ICU formatting via `java.text`/`android.icu`.

### Q46. WorkManager *(Must-know)*
Guaranteed, constraint-aware deferrable background work that survives app/process restarts.
```kotlin
class SyncWorker(ctx: Context, params: WorkerParameters) : CoroutineWorker(ctx, params) {
    override suspend fun doWork(): Result = try { repo.sync(); Result.success() } catch (e: IOException) { Result.retry() }
}
val request = PeriodicWorkRequestBuilder<SyncWorker>(6, TimeUnit.HOURS)
    .setConstraints(Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).setRequiresBatteryNotLow(true).build())
    .setBackoffCriteria(BackoffPolicy.EXPONENTIAL, 30, TimeUnit.SECONDS).build()
WorkManager.getInstance(ctx).enqueueUniquePeriodicWork("sync", ExistingPeriodicWorkPolicy.KEEP, request)
```
Not for exact-time tasks (use `AlarmManager`) or immediate user-visible work (foreground service / expedited work).

### Q47. Services and foreground services
Foreground services show an ongoing notification and require a declared **foreground service type** (Android 14+) with matching permissions. Use for user-visible long-running tasks (music, navigation, uploads). Background services are restricted since Android 8. Prefer WorkManager for deferrable work.

### Q48. Background execution limits & battery
Doze, App Standby buckets, background start restrictions, exact alarm permission (`SCHEDULE_EXACT_ALARM`), OEM battery optimizations. Design for opportunistic sync, use FCM high-priority messages sparingly, and avoid wake locks. Test with `adb shell dumpsys deviceidle`.

### Q49. Broadcast receivers
Manifest-registered receivers for most implicit broadcasts are blocked; use context-registered receivers (`registerReceiver`, with `RECEIVER_NOT_EXPORTED`/`EXPORTED` flags on Android 13+) and unregister in the matching lifecycle callback. Use `LocalBroadcastManager` replacements (Flow/SharedFlow).

### Q50. Content providers and the Storage Access Framework
Content providers share data via URIs with permissions; FileProvider shares files safely. For user files use the Storage Access Framework (`ACTION_OPEN_DOCUMENT`) and Photo Picker; scoped storage limits broad file access. Avoid `MANAGE_EXTERNAL_STORAGE` unless justified.

### Q51. Networking details
OkHttp: connection pooling, HTTP/2, interceptors (application vs network), caching (`Cache`), certificate pinning (`CertificatePinner`), authenticators for 401 refresh. Retrofit converters: Moshi, kotlinx.serialization, Gson. Handle `HttpException`, `IOException`, timeouts; map to domain errors. Use `NetworkCallback` (ConnectivityManager) for connectivity.

### Q52. Token refresh pattern
```kotlin
class TokenAuthenticator(private val tokens: TokenStore, private val authApi: Lazy<AuthApi>) : Authenticator {
    override fun authenticate(route: Route?, response: Response): Request? {
        if (response.priorResponse != null) return null                       // avoid infinite loops
        return synchronized(this) {
            val newToken = runBlocking { authApi.value.refresh(tokens.refresh()).accessToken }
            tokens.saveAccess(newToken)
            response.request.newBuilder().header("Authorization", "Bearer $newToken").build()
        }
    }
}
```
Serialize refreshes so concurrent 401s trigger one refresh.

### Q53. Paging 3
Load paged data from network and/or database with `PagingSource`/`RemoteMediator`, expose `Flow<PagingData<T>>` (`cachedIn(viewModelScope)`), display with `collectAsLazyPagingItems()` in Compose, handle `LoadState` for loading/error/retry footers.

### Q54. Repository pattern & single source of truth
Repositories hide data sources; the **local database is the source of truth** and the UI observes it; network refreshes update the DB (offline-first). Map DTO → entity → domain model; expose `Flow` for reads and `suspend` for writes.

### Q55. Error handling with coroutines/Flow
`try/catch` inside coroutines, `runCatching` (rethrow `CancellationException`), `catch {}` operator in Flows, `CoroutineExceptionHandler` for top-level `launch`, sealed `Result`/`Resource` types, retry with `retryWhen`/exponential backoff. `async` exceptions surface at `await`.

### Q56. Flow operators you should know
`map`, `filter`, `distinctUntilChanged`, `debounce`, `flatMapLatest` (search-as-you-type), `combine`, `zip`, `onEach`, `catch`, `onStart`, `flowOn` (upstream dispatcher), `buffer`, `conflate`, `stateIn(scope, WhileSubscribed(5_000), initial)`.
```kotlin
val results = query.debounce(300).distinctUntilChanged().flatMapLatest { q -> repo.search(q) }
    .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
```

### Q57. Unit testing basics
JUnit + MockK, coroutines test (`runTest`, `StandardTestDispatcher`, `MainDispatcherRule`), Turbine for Flow assertions.
```kotlin
@Test fun `emits success`() = runTest {
    coEvery { repo.users() } returns listOf(User("1", "Ritesh Kumar"))
    val vm = UsersViewModel(repo)
    vm.state.test { assertEquals(UiState.Loading, awaitItem()); assertTrue(awaitItem() is UiState.Success); cancelAndIgnoreRemainingEvents() }
}
```
See `../06_Testing/040_Testing.md`.

### Q58. UI testing
Compose: `createComposeRule()`, `onNodeWithText("Sign in").performClick()`, `assertIsDisplayed()`, semantics-based. Views: Espresso (`onView(withId(...)).perform(click())`) with idling resources. Screenshot tests (Paparazzi, Roborazzi, Compose Preview Screenshot Testing). Robolectric for JVM-based Android tests.

### Q59. Instrumented tests and test environments
Run on emulators/devices (Gradle managed devices, Firebase Test Lab). Use fake DI modules (`@TestInstallIn`), in-memory Room, MockWebServer for HTTP, test orchestrator to isolate tests, and disable animations on test devices.

### Q60. Gradle Kotlin DSL and version catalogs
```kotlin
// libs.versions.toml
[versions] kotlin = "2.0.21"; compose-bom = "2024.10.00"
[libraries] androidx-compose-bom = { module = "androidx.compose:compose-bom", version.ref = "compose-bom" }
// build.gradle.kts
dependencies { implementation(platform(libs.androidx.compose.bom)); implementation("androidx.compose.material3:material3") }
```
Centralize versions, use convention plugins for multi-module builds, enable configuration cache and build cache, KSP instead of KAPT where possible.

### Q61. Build variants and flavors
`buildTypes` (debug/release), `productFlavors` (free/paid, dev/staging/prod) → build variants. Separate applicationId suffixes, resources, API URLs (`buildConfigField`), signing configs. Store secrets outside source control (local.properties, CI secrets).

### Q62. R8, ProGuard and minification
Release builds shrink/obfuscate/optimize with R8 (`isMinifyEnabled = true`, `isShrinkResources = true`). Keep rules for reflection-based libraries (`-keep class ...`), serialization models and JNI. Upload `mapping.txt` to Play/Crashlytics for deobfuscation. Test the release build thoroughly.

### Q63. Signing and Play App Signing
Upload key signs your AAB; Google manages the app signing key. Keep keystores/credentials secure and backed up (upload key reset is possible, but cumbersome). CI signs via secrets. Debug and release keys differ; Firebase/Google Sign-In need SHA-1/SHA-256 fingerprints of each.

### Q64. Publishing to Google Play
Create the app, complete store listing, content rating, Data safety form, target audience, privacy policy; upload AAB to internal → closed → open → production tracks; staged rollout; pre-launch reports; policy compliance (permissions, background location, foreground service declarations). Target the required API level annually.

### Q65. App startup and splash screen
Android 12+ SplashScreen API (`installSplashScreen()`); cold/warm/hot starts; measure with `reportFullyDrawn()`, Macrobenchmark. Avoid heavy work in `Application.onCreate`; use App Startup library or lazy initialization and background threads.

### Q66. Memory management and leaks
Common leaks: static references to Activity/Context, long-lived listeners, inner classes/lambdas capturing Activity, unclosed resources, Fragment view bindings not nulled in `onDestroyView`, coroutines in wrong scopes. Use LeakCanary, Android Profiler heap dumps, `WeakReference` sparingly, application context for singletons.

### Q67. Threading model
Main thread handles UI and input (ANR after ~5 s input dispatch timeout). Do I/O and CPU work off the main thread with coroutines (`Dispatchers.IO/Default`). `StrictMode` flags disk/network on main thread in debug. Avoid `runBlocking` on main.

### Q68. Handler, Looper and message queue
Each Looper thread processes a `MessageQueue`; `Handler` posts runnables/messages; the main thread has a Looper. Coroutines' `Dispatchers.Main` posts to it. Understanding this explains frame scheduling (Choreographer), ANRs and `postDelayed` semantics.

### Q69. Binder IPC and AIDL (concept)
Binder is Android's IPC mechanism; system services (ActivityManager, etc.) are accessed through Binder proxies. AIDL defines interfaces for bound services across processes. Parcelable/serialization costs and transaction size limits (~1 MB) matter (`TransactionTooLargeException`).

### Q70. Deep links and App Links
Intent filters for URLs; verified **App Links** (`android:autoVerify="true"` + `assetlinks.json`) open your app without a chooser. Handle `onNewIntent`/Navigation deep links, validate parameters, and preserve intended destination through login.

### Q71. Multi-window, foldables and large screens
Support resizing (`resizeableActivity`), `WindowSizeClass` for adaptive layouts, `NavigationSuiteScaffold`/list-detail layouts (`ListDetailPaneScaffold`), orientation and posture changes via `WindowManager` library, and test with the resizable emulator. Large-screen quality is part of Play recommendations.

### Q72. Edge-to-edge, predictive back and system bars
Android 15 enforces edge-to-edge for apps targeting API 35: handle `WindowInsets` (`Modifier.windowInsetsPadding`, `Scaffold` insets). Predictive back: opt in via manifest and use `BackHandler`/`PredictiveBackHandler` correctly (verify requirements per API level).

---

# 🟡 Part 3: Mid (3–5 years)

### Q73. Coroutine internals: continuations and state machines *(Must-know)*
The compiler transforms each `suspend` function into a state machine that takes an extra `Continuation` parameter. At each suspension point the function returns `COROUTINE_SUSPENDED` and later resumes via `continuation.resumeWith(result)`. This is why coroutines are cheap (no thread per coroutine) and why suspend calls from Java need wrappers.

### Q74. Dispatchers and thread pools
`Dispatchers.Default` (CPU-bound, cores-sized pool), `IO` (elastic pool up to 64 threads by default, shared with Default), `Main` (UI looper), `Main.immediate` (executes immediately if already on main), `limitedParallelism(n)` for bounded concurrency. Avoid `GlobalScope`; inject dispatchers for testability.

### Q75. Coroutine exception handling nuances
`launch` propagates uncaught exceptions to the parent (and `CoroutineExceptionHandler` at root); `async` stores exceptions until `await`. In a normal `Job` hierarchy one child failure cancels siblings; `SupervisorJob`/`supervisorScope` isolates failures. `try/catch` around `launch` does not catch exceptions inside the child.

### Q76. Flow: cold vs hot, backpressure, buffering
Cold flows run per collector; `StateFlow`/`SharedFlow` are hot. Backpressure: producers suspend by default (rendezvous); `buffer(capacity)` decouples, `conflate()` keeps the latest, `collectLatest` cancels slower work. `callbackFlow` bridges callback APIs (always `awaitClose { unregister() }`).

### Q77. StateFlow vs SharedFlow vs LiveData
| | StateFlow | SharedFlow | LiveData |
|---|---|---|---|
| Initial value | Required | Optional (replay config) | Optional |
| Conflation/equality | Distinct, latest only | Configurable | Latest |
| Lifecycle awareness | Via `repeatOnLifecycle` | Same | Built in |
| Use | UI state | Events/broadcasts | Legacy/View interop |
One-off UI events: prefer modelling as state consumed once, or `Channel` with care; avoid `SharedFlow(replay=0)` losing events when no collector.

### Q78. Modularization strategies
Multi-module by layer (`app`, `core:data`, `core:ui`, `domain`) and by feature (`feature:home`, `feature:checkout`). Benefits: build parallelism, ownership, encapsulation, dynamic delivery. Use API/impl module splits, convention plugins, and dependency rules (feature modules depend on core, not each other; navigate via interfaces/routes).

### Q79. Clean Architecture on Android
Presentation (Compose + ViewModel) → Domain (use cases, entities, repository interfaces; pure Kotlin) → Data (repository impls, Room, Retrofit, mappers). Dependency rule: inner layers know nothing of outer. Use cases are justified when they encapsulate reusable business rules; avoid empty pass-through layers.

### Q80. MVI and state reducers
Single immutable `UiState`, `UiEvent`/`Intent` from the UI, reducer function producing new state, one-time effects via channel. Pros: predictable, testable, time-travel debugging; cons: boilerplate. Libraries: Orbit MVI, Molecule (Compose-powered presenters), Circuit.

### Q81. Hilt scopes and advanced DI
Components: `SingletonComponent`, `ActivityRetainedComponent` (survives config changes), `ViewModelComponent`, `ActivityComponent`, `FragmentComponent`. Qualifiers (`@Named`, custom), multibindings, assisted injection (`@AssistedInject` for runtime params), entry points for non-Android classes, test replacements (`@TestInstallIn`, `@UninstallModules`). Keep graphs shallow and prefer constructor injection.

### Q82. Kotlin generics and variance
`out T` (covariant: producer) and `in T` (contravariant: consumer); use-site variance with projections (`List<out Number>`). `reified` type params with `inline` functions preserve type info (`inline fun <reified T> Gson.fromJson(s: String) = fromJson(s, T::class.java)`). Star projections for unknown types.

### Q83. Inline, noinline, crossinline
`inline` copies the function body and lambda arguments to call sites, eliminating lambda allocations (used by `let`, `map`, `use`). `noinline` keeps a lambda as an object; `crossinline` forbids non-local returns in lambdas used in another context. Use inline for small higher-order functions; avoid for large bodies.

### Q84. Kotlin delegation and DSLs
Class delegation (`class Foo(impl: Bar) : Bar by impl`), property delegates (`by lazy`, `observable`, `map`), type-safe builders with receiver lambdas (`html { body { } }`, Gradle KTS, Compose). `@DslMarker` prevents accidental outer-scope access.

### Q85. Kotlin interop with Java
`@JvmStatic`, `@JvmOverloads`, `@JvmField`, `@Throws`, nullability annotations, SAM conversions, platform types. `suspend` functions need `kotlinx-coroutines-jdk8` or Flow bridges for Java callers. Companion object access from Java via `Companion`.

### Q86. Kotlin Multiplatform (KMP) overview *(Must-know)*
Share business logic (networking via Ktor, serialization, SQLDelight, coroutines) across Android, iOS, desktop and web while keeping native UIs (or Compose Multiplatform for shared UI). `expect`/`actual` declarations bridge platform differences. Google officially supports KMP for shared logic on Android (Jetpack libs like Room, DataStore have KMP versions). Interop with Swift via generated frameworks (SKIE helps). See `044_Swift-iOS.md`.

### Q87. Dependency on Google Play Services & alternatives
FCM, Maps, Location (Fused), Auth, Play Integrity depend on GMS; consider Huawei (HMS) or non-GMS devices in some markets with abstraction layers. Check device capability before using services (`GoogleApiAvailability`).

### Q88. Security: Keystore and encrypted storage
Android Keystore generates/stores keys in hardware (TEE/StrongBox) so keys are non-exportable; encrypt data with AES-GCM using Keystore keys; Jetpack Security (`EncryptedSharedPreferences`/`EncryptedFile` are deprecated in recent releases: verify and prefer Keystore + DataStore with custom crypto or Tink). Never hard-code keys; use `BiometricPrompt` with `CryptoObject` for auth-bound keys.

### Q89. Network security
HTTPS by default (cleartext blocked from API 28), `network_security_config.xml` for pins and debug overrides, certificate pinning with a rotation strategy, TLS 1.2+, avoid trusting user CAs in release, validate hostname, secure WebView settings, and avoid logging sensitive data.

### Q90. App security checklist (OWASP MASVS)
Secure storage, no secrets in the APK (decompilation is trivial), obfuscation as deterrent, root/emulator/tamper signals via Play Integrity API (server-verified), secure IPC (`exported=false`, permission-protected components, validated intents), FLAG_SECURE on sensitive screens, safe deep link handling, dependency scanning, signed releases, and server-side authorization.

### Q91. Play Integrity API
Attestation of device integrity, app integrity and licensing; request a token, send to your backend, verify via Google's API, then decide (allow, step-up, block). Use nonces to prevent replay; don't rely solely on client-side checks.

### Q92. Authentication on Android
Credential Manager API (passkeys, passwords, federated Google Sign-In) replaces legacy flows; OAuth2/OIDC via AppAuth with Custom Tabs and PKCE; biometrics via `BiometricPrompt`; token storage in encrypted storage; session management with refresh rotation. See `../03_Backend/036_Authentication-and-Security.md`.

### Q93. Performance: startup, jank, memory, battery
Targets: cold start < 2 s, frame time < 16 ms (8 ms at 120 Hz), few ANRs (< 0.47% user-perceived per Play vitals thresholds), low battery drain. Tools: Perfetto/System Trace, Android Profiler, Macrobenchmark, Jetpack Metrics, StrictMode, Play Console vitals, Firebase Performance.

### Q94. Baseline Profiles and startup optimization
Baseline Profiles ship pre-compiled hot paths so ART can AOT-compile critical code at install, improving startup and scroll performance (~15-30%). Generate with Macrobenchmark `BaselineProfileRule`, include in release builds; combine with Startup Profiles, App Startup library, lazy init, and R8 full mode.

### Q95. Jank and rendering
Choreographer frames; `RenderThread` for hardware drawing. Avoid heavy work in `onDraw`/composition, nested layouts, overdraw, unnecessary alpha layers; in Compose avoid unstable params and large recompositions. Use Frame metrics (`JankStats`) and GPU rendering profile.

### Q96. ANR analysis
ANR triggers: input dispatch timeout (5 s), broadcast receiver (10 s foreground), service start (20 s). Read `traces.txt`/Play vitals ANR clusters, find main-thread blocking (I/O, locks, `runBlocking`, binder calls). Move work off main thread, use async APIs, reduce lock contention.

### Q97. Network efficiency & battery
Batch requests, use HTTP/2 and caching, compress payloads, prefer push to polling, WorkManager constraints, avoid wake locks, use Doze-friendly APIs, monitor with Battery Historian/Android Studio Energy Profiler.

### Q98. Offline-first and sync
Room as source of truth, `RemoteMediator`/sync workers, WorkManager for retries with backoff, conflict resolution strategies, idempotent writes with client IDs, network callbacks for connectivity, optimistic UI. Test airplane mode and process death.

### Q99. Handling process death & state restoration
The system can kill your process in the background; `ViewModel` state is lost, `SavedStateHandle`/`rememberSaveable` and persisted data survive. Test with "Don't keep activities" and `adb shell am kill <package>`. Restore navigation, form drafts, scroll positions where valuable.

### Q100. Testing strategy at scale
Pyramid: many JVM unit tests (ViewModels, use cases, mappers), Robolectric for Android-dependent logic, Compose UI tests for components and screens, screenshot tests for regression, few instrumented E2E flows on Firebase Test Lab, macrobenchmarks for performance. Test doubles via DI, fake repositories, deterministic dispatchers/time.

### Q101. CI/CD for Android
GitHub Actions/Bitrise/Jenkins: Gradle caching, lint/ktlint/detekt, unit tests, instrumented tests on emulators (Gradle Managed Devices/Firebase Test Lab), build AAB, sign with secrets, upload to Play (Gradle Play Publisher/Fastlane supply), staged rollouts, Crashlytics mapping upload. See `../07_DevOps_and_Cloud/047_CI-CD-and-DevOps.md`.

### Q102. Static analysis & code quality
Android Lint, detekt, ktlint/spotless, Compose lint checks, dependency analysis plugin, SonarQube, API compatibility validators for libraries. Enforce in CI; keep baselines for legacy warnings and reduce over time.

---

# 🟠 Part 4: Senior (5–7 years)

### Q103. Designing a scalable Android app architecture *(Must-know)*
- **Modules:** `app` shell; `core` (design system, network, database, common); `feature:*` modules with `api`/`impl`; shared `domain` where valuable.
- **State:** ViewModels exposing immutable `StateFlow<UiState>`; events as state or effects; Molecule/Circuit if needed.
- **Data:** repositories with Room as source of truth, Retrofit/Ktor remote, WorkManager sync, mappers per layer, typed errors.
- **DI:** Hilt with clear scopes; test modules.
- **Navigation:** Navigation Compose with typed routes and deep links; feature entry points via interfaces.
- **Quality:** convention plugins, lint/detekt, unit + UI + screenshot + benchmark tests, baseline profiles, CI gates.
- **Delivery:** flavors, staged rollouts, feature flags, Crashlytics/Play vitals monitoring.

### Q104. Migrating a View-based app to Compose
Incremental: add Compose to new screens, wrap with `ComposeView` in Fragments, migrate leaf components first (`AndroidView` for complex legacy views), unify theming (MDC theme adapter), adopt ViewModels with StateFlow, migrate navigation last (Navigation Compose with Fragment interop), add UI tests and previews, and measure performance (baseline profiles).

### Q105. Offline-first architecture details
Local DB (Room) authoritative; `Flow`-based reads; mutations queued in an outbox table with states (PENDING, SYNCING, FAILED), synced by WorkManager with exponential backoff and idempotency keys; conflict resolution by version/updatedAt or server arbitration; sync status UI; delta sync with cursors; background constraints and battery awareness. Test with simulated network failures and process kills.

### Q106. Handling large media and file uploads
Presigned URLs with direct-to-storage uploads, resumable/multipart (tus), foreground service or WorkManager long-running expedited work, compression (images via `Compressor`, video via MediaCodec/Transformer), progress reporting, retry/resume, handling scoped storage and permissions, and cleanup of temp files.

### Q107. Real-time features
WebSockets (OkHttp), SSE, gRPC streams, Firebase/Supabase realtime; respect lifecycle (connect on STARTED, disconnect in background), reconnect with backoff, message ordering/ids, push for background; consider battery impact. See `../03_Backend/037_WebSockets-and-Realtime.md`.

### Q108. Maps, location and geofencing
Fused Location Provider (priority, intervals), permission tiers (foreground vs background), geofencing API, battery trade-offs, Maps Compose, clustering, offline tiles, Play policy for background location. Provide clear in-app rationale and settings entry points.

### Q109. Camera, media and ML on device
CameraX (preview, capture, analysis), Media3/ExoPlayer for playback (DRM, adaptive streaming, caching), ML Kit / TensorFlow Lite / MediaPipe / Gemini Nano (AICore, verify availability) for on-device ML, hardware acceleration, memory/thermal considerations.

### Q110. In-app purchases & subscriptions
Google Play Billing Library: query products, launch billing flow, acknowledge/consume purchases, handle pending/deferred states, server-side verification with the Play Developer API, real-time developer notifications (RTDN), entitlements, grace period/account hold, restore on new devices. Use RevenueCat for abstraction if appropriate.

### Q111. Widgets, shortcuts and app surfaces
App Widgets with Jetpack Glance (Compose-style), App Shortcuts, Quick Settings tiles, notifications with actions, Live updates, Wear OS/Auto/TV companions, Android 14+ lock screen & Health Connect integrations. Each surface has lifecycle and battery constraints.

### Q112. Observability for Android apps
Crashlytics/Sentry (symbolication with mapping files), Play Console vitals (crash/ANR rates, startup, rendering), Firebase Performance/custom traces, OpenTelemetry for backend correlation (`traceparent` headers), structured logging (Timber with release tree), analytics with consent, feature-flag exposure logs, and release health dashboards with alerts.

### Q113. Release management
Trunk-based or release branches, version codes automation, changelog generation, internal → closed → open → production tracks, staged rollouts (e.g., 1% → 10% → 50% → 100%) gated on crash-free/ANR metrics, remote config kill switches, hotfix procedures, and Play in-app updates API (flexible/immediate) for upgrades.

### Q114. Handling API level fragmentation
`minSdk`/`targetSdk`/`compileSdk` decisions (usage data vs maintenance cost), `Build.VERSION.SDK_INT` checks, AndroidX compat libraries, desugaring (Java 8+ APIs on older devices), lint `NewApi`, behaviour change testing per target SDK, annual targetSdk upgrades to meet Play requirements.

### Q115. Dependency management and upgrades
Version catalogs, Renovate/Dependabot, BOMs (Compose, Firebase, OkHttp), regular upgrade cadence, reading release notes, running dependency-analysis to prune unused deps, avoiding abandoned libraries, and gradual migrations (KAPT → KSP, LiveData → Flow, Accompanist → official APIs).

### Q116. Build performance
Gradle configuration cache, build cache (remote), parallel execution, KSP, non-transitive R classes, avoiding annotation processors in all modules, modularization with API/impl, Build Scan analysis, incremental compilation, and CI remote caching. Faster builds directly improve developer throughput.

### Q117. Accessibility & inclusive design programme
Design-system components with semantics defaults, automated checks (Accessibility Test Framework, Compose semantic assertions), manual TalkBack/Switch Access testing, font scale up to 200%, color contrast, touch targets, captions for media, localization/RTL QA, accessibility acceptance criteria in DoD.

### Q118. Internationalization at scale
String externalization, plural rules, gender-neutral phrasing, translation tooling (Crowdin/Lokalise), pseudo-locales (`en-XA`, `ar-XB`), locale-aware formatting, per-app language preference, RTL layout mirroring, dynamic feature language splits, and in-app locale switching tests.

### Q119. Privacy & compliance
Data safety form accuracy, runtime permission minimization, Privacy Sandbox/Ads ID policies, consent (GDPR/DPDP), data deletion flows (in-app account deletion required by Play), encryption at rest/in transit, SDK audits (analytics/ads), children's policies (Families), logging PII avoidance.

### Q120. Migrating to Kotlin Multiplatform
Start by sharing pure logic (models, validation, networking via Ktor, serialization), then data (SQLDelight/Room KMP), then possibly UI (Compose Multiplatform). Establish module boundaries, expect/actual abstractions, CI for both platforms, iOS team onboarding, Swift interop (SKIE), and gradual rollout behind feature flags.

### Q121. Handling large codebases and ownership
CODEOWNERS per module, architecture tests (Konsist, ArchUnit-style) to enforce layering, ADRs, shared design system team, feature flags to decouple deploy/release, release trains, and tooling for module creation (templates).

### Q122. Debugging production issues
Reproduce from Crashlytics breadcrumbs/device info, enable verbose logs for affected users via remote flags, analyze ANR traces, use Perfetto traces from user-opted debug builds, bisect releases, check OEM/OS-specific patterns, hotfix via staged rollout with kill switches.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q123. Choosing a mobile strategy: native Android vs cross-platform *(Must-know)*
Evaluate: platform-specific UX needs (widgets, camera pipelines, background work, Auto/Wear), performance, team skills, time-to-market, code sharing with iOS/web, hiring, maintenance cost, ecosystem risk. Options: pure native (Kotlin + Swift), **KMP with native UIs** (share logic), Compose Multiplatform, Flutter, React Native. Typical guidance: native Compose for Android-first or platform-deep products; KMP when two native teams want shared domain/data; cross-platform UI frameworks when UI parity and speed matter more than platform polish. Run spikes on the riskiest features before committing. See `041_React-Native.md`, `042_Flutter.md`, `044_Swift-iOS.md`.

### Q124. Platform engineering for Android teams
Build "paved roads": convention plugins, project templates, shared CI workflows, design system library, feature flag/analytics/logging SDK wrappers, baseline profile pipeline, release automation, dependency update bots, performance dashboards, and developer docs. Measure developer productivity (build times, PR cycle time, flaky test rate).

### Q125. Technical governance
Architecture decision records, module dependency rules enforced by tests, API review for core modules, deprecation policies, security reviews for SDKs and permissions, performance budgets, and a shared definition of done including accessibility, localization and instrumentation.

### Q126. Managing technical debt and large migrations
Plan migrations (View → Compose, RxJava → Flow, KAPT → KSP, Gson → kotlinx.serialization, single-module → multi-module) with measurable milestones, coexistence layers, linters that block new legacy usage, scheduled "migration capacity," and dashboards of remaining usage. Avoid big-bang rewrites.

### Q127. Scaling releases for millions of users
Staged rollouts with auto-halt on crash/ANR thresholds, kill switches, backend backward compatibility for old app versions, forced-update mechanisms (Play in-app updates + server min-version), capacity planning for push storms, phased feature exposure, canary cohorts (internal testers, beta channel), and post-release health reviews.

### Q128. Data privacy, security and compliance programme
Threat modelling per feature, MASVS-aligned controls, periodic pen tests, SDK inventory and risk review, data minimization and retention, regional compliance (GDPR/DPDP/COPPA), Play policy tracking, secrets management in CI, incident response for mobile (revoke keys, kill switches, forced updates).

### Q129. Performance as a product feature
Define SLOs (startup p95, jank %, ANR/crash rates, battery), baseline on low-end devices, automate Macrobenchmarks in CI, enforce regression gates, keep a performance backlog, and tie improvements to business metrics (conversion, retention). Use Play vitals and field metrics, not just lab tests.

### Q130. AI features on Android
On-device models (Gemini Nano via AICore, ML Kit GenAI, TensorFlow Lite/LiteRT, MediaPipe) for privacy and latency; cloud LLMs through your backend (never embed API keys), streaming UI with Flow, caching, rate limits, safety filters, consent and clear opt-outs, fallback when device unsupported, and cost monitoring. See `../11_Generative_AI/065_OpenAI-and-Claude-API.md`.

### Q131. Multi-form-factor strategy
Adaptive layouts with window size classes, Navigation suite scaffolds, drag-and-drop, keyboard/mouse support, foldable postures, Wear OS/Auto/TV targets with shared domain modules, and Play large-screen quality checks. Build once with adaptive components rather than separate apps.

### Q132. Vendor & SDK risk management
Wrap third-party SDKs (analytics, ads, payments) behind interfaces; monitor SDK size/permissions/network behaviour; keep fallback paths; review privacy implications; pin versions; plan for removal. SDK-induced crashes/ANRs are common sources of vitals regressions.

### Q133. Building engineering culture around quality
Blameless postmortems, quality metrics visible to all, dogfooding builds, device lab sessions on low-end devices, code review checklists (lifecycle, threading, accessibility), performance and security champions, and learning programmes (Kotlin/Compose/coroutines workshops).

### Q134. Communicating trade-offs
Translate technical decisions into business outcomes: native polish vs speed, KMP savings vs coordination cost, upgrade effort vs Play policy deadlines, performance investment vs feature work. Use prototypes, benchmarks, and phased roadmaps with decision gates.

---

# 💻 Part 6: Hands-On Tasks & Code

### H1. Compose screen with ViewModel, StateFlow and sealed UI state
```kotlin
sealed interface UsersUiState {
    data object Loading : UsersUiState
    data class Content(val users: List<User>) : UsersUiState
    data class Error(val message: String) : UsersUiState
}

@HiltViewModel
class UsersViewModel @Inject constructor(private val repo: UserRepository) : ViewModel() {
    val state: StateFlow<UsersUiState> = repo.observeUsers()
        .map<List<User>, UsersUiState> { UsersUiState.Content(it) }
        .onStart { emit(UsersUiState.Loading) }
        .catch { emit(UsersUiState.Error(it.message ?: "Something went wrong")) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), UsersUiState.Loading)
    fun refresh() = viewModelScope.launch { repo.refresh() }
}

@Composable
fun UsersScreen(viewModel: UsersViewModel = hiltViewModel(), onOpen: (String) -> Unit) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    when (val s = state) {
        UsersUiState.Loading -> CircularProgressIndicator()
        is UsersUiState.Error -> ErrorView(s.message, onRetry = viewModel::refresh)
        is UsersUiState.Content -> LazyColumn {
            items(s.users, key = { it.id }) { u -> ListItem(headlineContent = { Text(u.name) }, modifier = Modifier.clickable { onOpen(u.id) }) }
        }
    }
}
```

### H2. Repository: Room as source of truth + Retrofit refresh
```kotlin
class UserRepository @Inject constructor(private val api: UserApi, private val dao: UserDao, @IoDispatcher private val io: CoroutineDispatcher) {
    fun observeUsers(): Flow<List<User>> = dao.observeAll().map { list -> list.map(UserEntity::toDomain) }

    suspend fun refresh() = withContext(io) {
        val remote = api.users(page = 1)
        dao.upsert(remote.map(UserDto::toEntity))
    }
}
```
Handle `IOException`/`HttpException` at the ViewModel or with a `Result` wrapper; keep mapping functions pure.

### H3. Hilt network module with auth interceptor and token authenticator
```kotlin
@Module @InstallIn(SingletonComponent::class)
object NetworkModule {
    @Provides @Singleton
    fun okHttp(tokens: TokenStore, authenticator: TokenAuthenticator): OkHttpClient = OkHttpClient.Builder()
        .addInterceptor { chain -> chain.proceed(chain.request().newBuilder().header("Authorization", "Bearer ${tokens.access()}").build()) }
        .authenticator(authenticator)
        .connectTimeout(15, TimeUnit.SECONDS).readTimeout(20, TimeUnit.SECONDS)
        .apply { if (BuildConfig.DEBUG) addInterceptor(HttpLoggingInterceptor().apply { level = HttpLoggingInterceptor.Level.BASIC }) }
        .build()

    @Provides @Singleton
    fun userApi(client: OkHttpClient, json: Json): UserApi = Retrofit.Builder().baseUrl(BuildConfig.API_URL).client(client)
        .addConverterFactory(json.asConverterFactory("application/json".toMediaType())).build().create(UserApi::class.java)
}
```

### H4. Search-as-you-type with debounce and flatMapLatest
```kotlin
class SearchViewModel @Inject constructor(repo: SearchRepository) : ViewModel() {
    private val query = MutableStateFlow("")
    fun onQueryChange(q: String) { query.value = q }
    val results: StateFlow<List<Result>> = query.debounce(300).map { it.trim() }.distinctUntilChanged()
        .flatMapLatest { q -> if (q.length < 2) flowOf(emptyList()) else repo.search(q).catch { emit(emptyList()) } }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
}
```

### H5. WorkManager sync with Hilt
```kotlin
@HiltWorker
class SyncWorker @AssistedInject constructor(@Assisted ctx: Context, @Assisted params: WorkerParameters, private val repo: UserRepository) : CoroutineWorker(ctx, params) {
    override suspend fun doWork(): Result = try { repo.refresh(); Result.success() }
        catch (e: IOException) { if (runAttemptCount < 5) Result.retry() else Result.failure() }
}
```
Configure `Configuration.Provider` with `HiltWorkerFactory` in the Application class.

### H6. Compose UI test
```kotlin
@get:Rule val compose = createAndroidComposeRule<MainActivity>()
@Test fun login_showsError_onInvalidEmail() {
    compose.onNodeWithText("Email").performTextInput("not-an-email")
    compose.onNodeWithText("Sign in").performClick()
    compose.onNodeWithText("Enter a valid email").assertIsDisplayed()
}
```

### H7. Macrobenchmark + baseline profile generation
```kotlin
@RunWith(AndroidJUnit4::class)
class StartupBenchmark {
    @get:Rule val rule = MacrobenchmarkRule()
    @Test fun startup() = rule.measureRepeated(packageName = "com.acme.app", metrics = listOf(StartupTimingMetric()), iterations = 10,
        startupMode = StartupMode.COLD, compilationMode = CompilationMode.None()) { pressHome(); startActivityAndWait() }
}
class BaselineProfileGenerator {
    @get:Rule val rule = BaselineProfileRule()
    @Test fun generate() = rule.collect("com.acme.app") { pressHome(); startActivityAndWait(); /* scroll key lists */ }
}
```

### H8. Network security config (debug override + pinning)
```xml
<network-security-config>
  <base-config cleartextTrafficPermitted="false"><trust-anchors><certificates src="system"/></trust-anchors></base-config>
  <domain-config>
    <domain includeSubdomains="true">api.example.com</domain>
    <pin-set expiration="2026-12-31">
      <pin digest="SHA-256">AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=</pin>
      <pin digest="SHA-256">BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB=</pin>  <!-- backup pin -->
    </pin-set>
  </domain-config>
  <debug-overrides><trust-anchors><certificates src="user"/></trust-anchors></debug-overrides>
</network-security-config>
```
Always include a backup pin and expiration; rotate carefully to avoid locking out users.

### H9. Secure token storage with Keystore-backed AES-GCM
```kotlin
class SecretStore(private val ctx: Context) {
    private val alias = "token_key"
    private fun key(): SecretKey {
        val ks = KeyStore.getInstance("AndroidKeyStore").apply { load(null) }
        (ks.getKey(alias, null) as? SecretKey)?.let { return it }
        return KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore").apply {
            init(KeyGenParameterSpec.Builder(alias, KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT)
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM).setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE).setKeySize(256).build())
        }.generateKey()
    }
    fun encrypt(plain: ByteArray): ByteArray { val c = Cipher.getInstance("AES/GCM/NoPadding").apply { init(Cipher.ENCRYPT_MODE, key()) }; return c.iv + c.doFinal(plain) }
    fun decrypt(data: ByteArray): ByteArray { val c = Cipher.getInstance("AES/GCM/NoPadding").apply { init(Cipher.DECRYPT_MODE, key(), GCMParameterSpec(128, data.copyOfRange(0, 12))) }; return c.doFinal(data, 12, data.size - 12) }
}
```
Persist ciphertext in DataStore; consider Tink for higher-level APIs.

### H10. GitHub Actions: Android CI
```yaml
name: android-ci
on: [pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: 17 }
      - uses: gradle/actions/setup-gradle@v4
      - run: ./gradlew ktlintCheck detekt lintDebug testDebugUnitTest assembleDebug
      - uses: actions/upload-artifact@v4
        if: always()
        with: { name: reports, path: "**/build/reports/**" }
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. `NetworkOnMainThreadException`
Network call on the main thread. Move to a coroutine with `Dispatchers.IO` (Retrofit suspend functions handle this), use `viewModelScope.launch`, and enable StrictMode in debug to catch similar violations early.

### D2. `IllegalStateException: Can not perform this action after onSaveInstanceState`
Fragment transaction committed after state was saved. Use `commitAllowingStateLoss` only if safe, prefer `lifecycleScope.launchWhenStarted`/`repeatOnLifecycle`, or navigate via Navigation component with lifecycle awareness.

### D3. Crash on rotation / state lost
UI state stored in the Activity/Composable without saving. Move state to `ViewModel`, use `rememberSaveable`/`SavedStateHandle`, ensure serializable/`Parcelable` types, and test with the "Don't keep activities" developer option.

### D4. Memory leak after screen closed
Leaked Activity via static field, singleton holding Context, unremoved listener, or coroutine in `GlobalScope`. Detect with LeakCanary, read the reference chain, switch to application context, lifecycle-aware scopes, and `DisposableEffect` cleanup.

### D5. Compose screen recomposes constantly / janky
Unstable parameters, state read too high in the tree, lambdas capturing changing values, `LazyColumn` items without keys, heavy work in composition. Use Layout Inspector recomposition counts, compiler reports, `derivedStateOf`, stable models and deferred reads.

### D6. `java.lang.IllegalStateException: ViewModelStore should be set before setGraph` / missing Hilt injection
Missing `@AndroidEntryPoint`/`@HiltAndroidApp`, wrong scope, or calling `hiltViewModel()` outside a NavHost entry. Verify annotations, Gradle plugins (Hilt + KSP/KAPT), and entry point class setup.

### D7. `UninitializedPropertyAccessException: lateinit property has not been initialized`
Accessing `lateinit` before assignment (lifecycle ordering, DI timing). Use nullable types with safe calls, `by lazy`, or ensure initialization in the correct callback (`onViewCreated`, `init`).

### D8. R8 release crash: `ClassNotFoundException` / `NoSuchMethodError` / serialization fails
Missing keep rules for reflection (Gson/Moshi adapters, JNI, enums used by reflection), or R8 removed code. Add `-keep` rules or `@Keep`, use codegen serializers (kotlinx.serialization/Moshi codegen), test the release variant, deobfuscate stack traces with `mapping.txt`.

### D9. ANR: `Input dispatching timed out`
Main thread blocked by I/O, DB, locks, `runBlocking`, long `onReceive`, or heavy `Application.onCreate`. Read `traces.txt`, find the blocked main thread stack, move work off-main, use async APIs, reduce initialization.

### D10. Push notifications missing
Missing `POST_NOTIFICATIONS` permission on Android 13+, notification channel not created or muted, FCM token not registered/refreshed, Doze/OEM battery restrictions, data-only messages not handled in background, wrong `google-services.json` per flavor. Test with FCM tools and `adb shell dumpsys notification`.

### D11. WorkManager job doesn't run
Constraints unmet (network/charging/battery), periodic minimum interval (15 min), unique work policy `KEEP` ignoring updates, app force-stopped, OEM battery optimization, wrong worker factory (Hilt) causing failure. Inspect `WorkInfo`, `adb shell dumpsys jobscheduler`, and logs.

### D12. Room: `Cannot access database on the main thread` / migration crash
Synchronous DAO calls on main (use suspend/Flow) or schema change without migration (`IllegalStateException: Room cannot verify the data integrity`). Provide `Migration`s/auto-migrations, export schemas, test migrations (`MigrationTestHelper`), avoid destructive fallback in production.

### D13. Retrofit/Moshi/Serialization parsing exceptions
Backend changed field types/nullability, missing default values, polymorphism not configured. Make DTO fields nullable with defaults, use `ignoreUnknownKeys`, validate with contract tests, log (non-PII) response shapes in debug.

### D14. Deep link opens browser instead of app
App Links not verified (`assetlinks.json` host/SHA mismatch, `autoVerify` missing), intent filter incomplete (`BROWSABLE` category), link not HTTPS. Check `adb shell pm get-app-links <pkg>` and Play App Signing fingerprints.

### D15. `Compose: Reading a state that was created after the snapshot was taken` / state writes during composition
Writing state inside composition or from background threads without proper APIs. Move writes to event handlers/effects, use `Snapshot` APIs correctly, and keep composition side-effect free.

---

# 🧩 Part 8: Tricky Questions

### T1. Is Kotlin `val` immutable?
`val` is a read-only reference; the referenced object may be mutable (`val list = mutableListOf()`). Use immutable collections/data classes for true immutability.

### T2. Does `launch` block the thread?
No. It starts a coroutine concurrently and returns a `Job` immediately; a `suspend` call suspends the coroutine, not the thread. `runBlocking` blocks the thread.

### T3. Does `withContext(Dispatchers.IO)` create a new thread each time?
No. It switches execution to a pooled thread; coroutines are not threads. Dispatchers reuse thread pools.

### T4. Why does `viewModelScope` survive rotation but `lifecycleScope` doesn't?
`viewModelScope` is tied to the ViewModel (retained across config changes); `lifecycleScope` is tied to the Activity/Fragment lifecycle (destroyed on recreation).

### T5. Is `StateFlow` always up to date for UI?
It holds the latest value and conflates rapid updates; it's equal-value distinct. Collectors only see the latest state, not every intermediate emission.

### T6. Why shouldn't ViewModels reference Context/View?
They outlive Activities across config changes; holding them leaks. Use `Application` via `AndroidViewModel` only if necessary (prefer injecting dependencies).

### T7. `remember` vs `rememberSaveable` vs ViewModel?
`remember` survives recomposition only; `rememberSaveable` survives config change/process death for small serializable UI state; ViewModel survives config change (not process death) and holds screen-level state and business logic.

### T8. Is Compose slower than Views?
Not inherently; well-written Compose with baseline profiles performs comparably. Poor stability/recomposition management or debug builds cause slowness.

### T9. Does Android guarantee `onDestroy` is called?
No. The process may be killed without `onDestroy`. Persist critical data earlier (`onPause`/`onStop`, ViewModel `SavedStateHandle`, database writes).

### T10. Is `GlobalScope` ever OK?
Rarely (truly app-lifetime tasks); prefer an injected application-scoped `CoroutineScope` with a `SupervisorJob` for structured lifecycle and testability.

### T11. Why can `Toast`/UI calls crash from background threads?
UI must be touched only on the main thread; use `withContext(Dispatchers.Main)` or `Handler(Looper.getMainLooper())`.

### T12. `apply` vs `also` vs `let`?
`apply`: `this` receiver, returns the object (configuration). `also`: `it`, returns the object (side effects). `let`: `it`, returns lambda result (transform/null-check).

### T13. Is `lateinit` safe?
Throws if accessed before init; it's a promise. Use for DI/test/lifecycle-bound fields; use nullable or `lazy` otherwise.

### T14. Why does `Modifier` order matter in Compose?
Modifiers wrap the layout node in order: `padding(16.dp).background(Color.Red)` pads then paints inside; reversed paints the padding area too.

### T15. Is exact alarm scheduling free to use?
No. Android 12+ requires `SCHEDULE_EXACT_ALARM`/`USE_EXACT_ALARM` (policy restricted); prefer WorkManager or inexact alarms unless user-facing exact timing is required.

### T16. Do Intents carry unlimited data?
No. Binder transaction limit (~1 MB shared across the process) → `TransactionTooLargeException`; pass IDs, not large objects/bitmaps.

### T17. Can `ViewModel` survive process death?
No. Use `SavedStateHandle`/persisted storage for state that must survive.

### T18. Why do apps still need ProGuard/R8 keep rules with Kotlin?
Reflection-based libraries, JNI and dynamic class loading can break when classes/members are removed or renamed; keep rules or codegen alternatives are required.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- **Preferred language?** Kotlin.
- **UI toolkit?** Jetpack Compose.
- **Architecture?** MVVM/UDF (+ Clean).
- **State holder?** ViewModel + StateFlow.
- **Async?** Coroutines + Flow.
- **DI?** Hilt (or Koin).
- **Networking?** Retrofit + OkHttp.
- **Database?** Room.
- **Key-value?** DataStore.
- **Background work?** WorkManager.
- **Navigation?** Navigation Compose.
- **Image loading?** Coil / Glide.
- **Lifecycle-aware collect?** `collectAsStateWithLifecycle`.
- **Build system?** Gradle (Kotlin DSL) + version catalogs.
- **Shrinker?** R8.
- **Publish format?** AAB.
- **Testing libs?** JUnit, MockK, Turbine, Compose tests, Espresso.
- **Perf tools?** Perfetto, Profiler, Macrobenchmark.
- **Startup boost?** Baseline Profiles.
- **Leak detection?** LeakCanary.
- **Secure keys?** Android Keystore.
- **Integrity check?** Play Integrity API.
- **Sign-in?** Credential Manager / passkeys.
- **Push?** FCM.
- **Cross-platform sharing?** Kotlin Multiplatform.
- **Foreground service requirement?** Declared type + notification.
- **ANR threshold?** ~5 s input dispatch.
- **Edge-to-edge?** Enforced for targetSdk 35.
- **Config change survivor?** ViewModel.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about an Android app you built.
STAR: "I led the rebuild of a banking app from Java/XML to Kotlin + Compose: multi-module architecture, Hilt, Room as source of truth, WorkManager sync, Play Integrity and Credential Manager (passkeys). We added baseline profiles and Macrobenchmark gates. Cold start improved from 3.4 s to 1.7 s, crash-free users reached 99.8%, and feature delivery time dropped about 30%."

### P2. Describe a performance or ANR problem you solved.
"Play vitals showed 1.2% ANRs from `Application.onCreate` initializing SDKs synchronously. I moved non-critical SDKs to App Startup with lazy init, offloaded disk reads to coroutines, and cut main-thread work by 600 ms. ANR rate fell to 0.2% and startup p95 improved 40%."

### P3. How do you design for offline-first?
"Room is the source of truth with Flow reads; writes go to an outbox with idempotency keys synced by WorkManager with exponential backoff; conflicts resolved by server version; UI shows sync state. We tested airplane mode, process death and flaky networks via instrumented tests."

### P4. Tell me about a migration you led.
"Migrated 120 screens from XML/Fragments to Compose incrementally: ComposeView interop, a shared Material 3 theme, UI tests per screen, lint rules blocking new XML layouts, and a dashboard tracking progress. Over 9 months we shipped weekly with no regressions."

### P5. How do you ensure app security?
"Keystore-backed encryption, no secrets in the APK, certificate pinning with backup pins, Play Integrity verified server-side, minimal permissions, secure deep links, R8 obfuscation as a deterrent, SDK audits and OWASP MASVS-based reviews."

### P6. How do you handle a bad release?
"Halt the staged rollout, disable the feature via remote config, ship a hotfix after repro with Crashlytics data, add regression tests and a vitals gate to the release checklist, and write a blameless postmortem."

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- **Kotlin:** null safety, data/sealed/enum/object, extension and scope functions, collections, generics and variance, inline/reified, delegation, DSLs, interop with Java.
- **Concurrency:** coroutines (suspend, dispatchers, structured concurrency, cancellation, exceptions), Flow/StateFlow/SharedFlow, channels, testing with `runTest`/Turbine.
- **Android fundamentals:** components, manifest, lifecycle, intents, resources, permissions, services, broadcast receivers, content providers, notifications.
- **UI:** Jetpack Compose (state, recomposition, stability, side effects, lazy lists, animations, theming, accessibility), Views/Fragments interop, adaptive layouts, edge-to-edge, predictive back.
- **Architecture:** MVVM/MVI/UDF, Clean Architecture, repository pattern, offline-first, modularization, DI (Hilt/Koin).
- **Data:** Retrofit/OkHttp, serialization, Room, DataStore, Paging 3, caching and sync.
- **Background and platform:** WorkManager, foreground services, Doze/standby, FCM, location, camera, media, billing.
- **Quality:** unit/UI/screenshot tests, Macrobenchmark, baseline profiles, R8, LeakCanary, Android Lint/detekt, CI/CD.
- **Security and privacy:** Keystore, network security, Play Integrity, MASVS, permissions and data safety.
- **Leadership:** KMP strategy, platform engineering, release management, technical governance.

## Mixed topics
- Android + iOS (`044_Swift-iOS.md`): shared design, KMP, push, deep links, security parity.
- Android + cross-platform (`041_React-Native.md`, `042_Flutter.md`): technology selection and brownfield integration.
- Android + backend APIs (`../03_Backend/035_GraphQL-and-REST-APIs.md`): pagination, idempotency, auth, error handling.
- Android + realtime (`../03_Backend/037_WebSockets-and-Realtime.md`) and queues/push (`../03_Backend/038_Message-Queues.md`).
- Android + Firebase/Supabase (`../03_Backend/034_Firebase-and-Supabase.md`): Auth, Firestore, FCM, Crashlytics.
- Android + security (`../03_Backend/036_Authentication-and-Security.md`): OAuth2 PKCE, passkeys, token storage.
- Android + testing (`../06_Testing/040_Testing.md`) and DevOps (`../07_DevOps_and_Cloud/047_CI-CD-and-DevOps.md`).
- Android + AI (`../11_Generative_AI/065_OpenAI-and-Claude-API.md`): on-device models, streaming chat UIs.

---

# 🔬 Part 12: Android Internals

### I1. Android runtime: ART, DEX and AOT/JIT
Kotlin/Java compile to bytecode, then D8/R8 convert to DEX. ART uses a hybrid of interpretation, JIT, and profile-guided AOT (compiled at idle based on profiles; baseline/cloud profiles speed this up). Installed APKs/AABs ship DEX, resources and native libs per ABI.

### I2. Zygote and process creation
Zygote preloads framework classes/resources and forks app processes quickly (copy-on-write). `ActivityManagerService` starts processes on demand, binds the application, creates `Application`, then the component. Process priority (foreground, visible, service, cached) determines kill order under memory pressure.

### I3. Activity launch sequence
Launcher process → `startActivity` → ATMS/AMS (system_server) → resolves intent → starts/forks app process if needed → `ActivityThread.main` → `Application.onCreate` → `Activity.onCreate/onStart/onResume` → first frame via ViewRootImpl/Choreographer. Cold start cost sits in process creation, class loading and initial layout/composition.

### I4. Rendering pipeline
Main thread: input, animation, measure/layout/draw (records display lists / Compose records draw instructions) → RenderThread: executes GPU commands (Skia/Vulkan) → SurfaceFlinger composites layers → display. Vsync/Choreographer paces frames; missing deadlines causes jank.

### I5. Compose runtime internals
The Compose compiler plugin transforms `@Composable` functions to carry a `Composer` and change bits; the runtime records a **slot table** of groups and remembered values; state reads are tracked via the **snapshot system** so only invalidated scopes recompose. Phases: composition → layout → drawing; state reads in later phases avoid earlier ones.

### I6. Lifecycle libraries
`LifecycleOwner`/`LifecycleObserver`, `Lifecycle.State` (INITIALIZED, CREATED, STARTED, RESUMED, DESTROYED); `repeatOnLifecycle` restarts coroutines when the state is at least the target; `ViewModelStore` retained across config changes via `NonConfigurationInstances`.

### I7. Binder and system services
Binder kernel driver enables synchronous/oneway IPC with transaction buffers (limited size), reference counting and death notifications. Managers (`ActivityManager`, `PackageManager`) wrap Binder proxies to system_server services.

### I8. Storage and security model
Each app has a UID and private data directory; SELinux enforces mandatory access control; scoped storage restricts shared storage; file-based encryption (FBE) encrypts per-user data; Keystore uses TEE/StrongBox; runtime permissions are granted per app.

### I9. Memory management: LMKD
The Low Memory Killer Daemon kills processes by `oom_adj` priority based on memory pressure (PSI). Keep background footprint small; handle `onTrimMemory`; avoid large bitmaps; use `largeHeap` sparingly.

---

# 📊 Part 13: Reference Tables

### Lifecycle quick map
| Callback | Visible | Interactive | Typical work |
|---|---|---|---|
| onCreate | No | No | Init UI, DI, restore state |
| onStart | Yes | No | Register observers |
| onResume | Yes | Yes | Start camera/sensors |
| onPause | Partially | No | Pause animations/commit light state |
| onStop | No | No | Release heavy resources, save data |
| onDestroy | No | No | Final cleanup (not guaranteed) |

### State holders in Compose
| API | Survives recomposition | Survives config change | Survives process death |
|---|---|---|---|
| `remember` | Yes | No | No |
| `rememberSaveable` | Yes | Yes | Yes (Bundle types) |
| ViewModel | Yes | Yes | No |
| `SavedStateHandle` | Yes | Yes | Yes |
| Room/DataStore | Yes | Yes | Yes |

### Dispatchers
| Dispatcher | Use | Notes |
|---|---|---|
| Main | UI updates | `Main.immediate` avoids redispatch |
| IO | Disk/network/DB | Elastic pool (64 threads default) |
| Default | CPU-bound | Core-count pool |
| Unconfined | Special cases | Avoid in app code |

### Background work options
| Need | API |
|---|---|
| Deferrable, guaranteed | WorkManager |
| Immediate long task visible to user | Foreground service |
| Exact time (user-facing) | AlarmManager (exact alarms) |
| Short async work in UI scope | Coroutines |
| Server-triggered | FCM |

### Storage options
| Option | Use |
|---|---|
| DataStore | Settings/small typed data |
| Room | Relational/offline data |
| Files (internal) | Private files/caches |
| MediaStore/SAF/Photo Picker | Shared media/documents |
| Keystore + encrypted blobs | Secrets |

### Version highlights (verify)
| Item | Notes |
|---|---|
| Kotlin 2.0 | K2 compiler stable, Compose compiler in Kotlin repo |
| Android 13 | Notification permission, photo picker, per-app language |
| Android 14 | Foreground service types required, partial photo access |
| Android 15 | Edge-to-edge enforced for target SDK 35, 16 KB page size support begins |
| Android 16 | Adaptive/large-screen behaviour changes; verify docs for details |
| Credential Manager | Replaces legacy sign-in APIs (passkeys) |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
```kotlin
val a: String? = null
println(a?.length ?: -1)
println(a!!.length)
```
**Output:** `-1`, then `NullPointerException` at `a!!`.

### O2.
```kotlin
data class P(val x: Int)
println(P(1) == P(1))
println(P(1) === P(1))
```
**Output:** `true` (structural equality) and `false` (different references).

### O3.
```kotlin
val list = listOf(1, 2, 3)
(list as MutableList<Int>).add(4)
```
**Result:** may throw `UnsupportedOperationException` (read-only `listOf` returns an immutable-backed list); don't downcast read-only collections.

### O4.
```kotlin
runBlocking {
    launch { delay(100); println("A") }
    println("B")
}
```
**Output:** `B` then `A` (launch is concurrent; main continues first).

### O5.
```kotlin
val job = launch { try { delay(1000) } catch (e: Exception) { println("caught") } }
job.cancel()
```
**Result:** prints `caught` (CancellationException is an Exception), but you should rethrow it; swallowing breaks structured cancellation.

### O6.
```kotlin
flow { emit(1); emit(2) }.collect { println(it) }
flow { emit(1); emit(2) }.collect { println(it) }
```
**Output:** `1 2 1 2` (cold flow re-executes for each collector).

### O7.
```kotlin
val state = MutableStateFlow(0)
state.value = 1; state.value = 1
```
**Result:** collectors receive `0` then `1` once; equal consecutive values are not re-emitted.

### O8.
```kotlin
Box(Modifier.padding(16.dp).background(Color.Red).size(50.dp))
```
**Result:** the box size is constrained by padding order; modifiers apply outside-in, so the red background covers the area inside padding.

### O9.
Rotating the device with state held in a plain `var` inside an Activity.
**Result:** state resets because the Activity is recreated; use ViewModel/`rememberSaveable`.

### O10.
```kotlin
Handler(Looper.getMainLooper()).post { Thread.sleep(6000) }
```
**Result:** main thread blocked → possible ANR (UI frozen, "App isn't responding" dialog).

### O11.
Registering `FLAG_MUTABLE`-less `PendingIntent` on Android 12+ without `FLAG_IMMUTABLE`/`FLAG_MUTABLE`.
**Result:** `IllegalArgumentException`: targeting S+ requires specifying mutability flag.

### O12.
Release build with R8 removes a class used only via reflection.
**Result:** `ClassNotFoundException` at runtime; add a keep rule.

---

# ✅ Part 15: MCQs

**1. Which component shows a single screen UI?**
A) Service  B) Activity  C) BroadcastReceiver  D) ContentProvider
**Answer: B**

**2. `ViewModel` survives:**
A) Process death  B) Configuration changes  C) Device reboot  D) App uninstall
**Answer: B**

**3. `val` in Kotlin means:**
A) Compile-time constant  B) Read-only reference  C) Mutable variable  D) Lateinit
**Answer: B**

**4. Which dispatcher is for CPU-intensive work?**
A) Main  B) IO  C) Default  D) Unconfined
**Answer: C**

**5. Which holds the latest value and is hot?**
A) `flow {}`  B) `StateFlow`  C) `Sequence`  D) `List`
**Answer: B**

**6. In Compose, state changes cause:**
A) Activity recreation  B) Recomposition of readers  C) App restart  D) Gradle build
**Answer: B**

**7. Recommended persistence for relational offline data:**
A) SharedPreferences  B) Room  C) Intent extras  D) Log files
**Answer: B**

**8. Guaranteed background work with constraints:**
A) Thread  B) WorkManager  C) AsyncTask  D) Handler
**Answer: B**

**9. Which API replaces `startActivityForResult`?**
A) Activity Result API  B) `onActivityResult` only  C) Broadcasts  D) AIDL
**Answer: A**

**10. What does R8 do?**
A) Runs tests  B) Shrinks, optimizes and obfuscates code  C) Builds UI  D) Signs apps
**Answer: B**

**11. Baseline Profiles improve:**
A) Network speed  B) Startup and runtime performance via AOT-compiled hot paths  C) Battery only  D) APK signing
**Answer: B**

**12. Which stores keys in secure hardware?**
A) SharedPreferences  B) Android Keystore  C) Cache directory  D) SQLite
**Answer: B**

**13. `lifecycleScope` is tied to:**
A) Application  B) The Activity/Fragment lifecycle  C) ViewModel  D) Process
**Answer: B**

**14. Which flag is required for most `PendingIntent`s on Android 12+?**
A) FLAG_ONE_SHOT  B) FLAG_IMMUTABLE (or MUTABLE explicitly)  C) FLAG_NO_CREATE  D) None
**Answer: B**

**15. Best way to avoid leaking an Activity in a singleton:**
A) Store Activity reference  B) Use application context / avoid holding views  C) Use static Views  D) Disable GC
**Answer: B**

**16. Kotlin sealed classes help with:**
A) Exhaustive `when` checks  B) Faster networking  C) UI theming  D) Gradle caching
**Answer: A**

**17. Which tool detects memory leaks in debug builds?**
A) LeakCanary  B) Retrofit  C) Room  D) Hilt
**Answer: A**

**18. `collectAsStateWithLifecycle` ensures:**
A) Collection only while lifecycle is at least STARTED  B) Collection forever  C) Collection on IO  D) No state updates
**Answer: A**

**19. Which Android version enforces foreground service types?**
A) 10  B) 12  C) 14  D) 8
**Answer: C**

**20. Kotlin Multiplatform is used to:**
A) Share business logic across platforms  B) Replace Gradle  C) Compile Swift  D) Remove the need for UI
**Answer: A**

---

# ⚠️ Part 16: Common Mistakes

1. **Doing I/O on the main thread** (ANRs, `NetworkOnMainThreadException`).
2. **Leaking Contexts/Activities** via singletons, static fields, listeners.
3. **Using `GlobalScope`** or unstructured coroutines.
4. **Swallowing `CancellationException`.**
5. **Collecting Flows without lifecycle awareness** (battery/CPU waste, crashes).
6. **Holding UI state in Activities/Composables** instead of ViewModel/saveable state.
7. **Unstable Compose parameters** and reading state too high (excess recomposition).
8. **Missing keys in `LazyColumn`.**
9. **No R8 keep rules testing** for release builds.
10. **Storing secrets/tokens in SharedPreferences or the APK.**
11. **Ignoring process death and configuration changes.**
12. **Requesting permissions without rationale/handling denial.**
13. **Passing large objects via Intents/Bundles.**
14. **Using exact alarms or foreground services unnecessarily.**
15. **Skipping migrations** or using destructive fallback in production Room DBs.
16. **Not verifying App Links/Play signing fingerprints.**
17. **Logging PII or tokens**; leaving verbose logs in release.
18. **Ignoring accessibility** (content descriptions, touch targets, font scaling).
19. **Blocking startup with SDK init in `Application.onCreate`.**
20. **Not testing on low-end devices and different API levels.**
21. **Delaying targetSdk and dependency upgrades** until Play policy deadlines.
22. **No staged rollouts or crash/ANR monitoring.**

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You reason about **lifecycles, process death and configuration changes** and design state accordingly.
- You use **coroutines/Flow** idiomatically (structured concurrency, lifecycle-aware collection, correct dispatchers, testing).
- You build **Compose UIs with stable, hoisted state** and diagnose recomposition problems with tooling.
- You design **layered, modular architectures** with Room as source of truth and clear boundaries.
- You measure and improve **startup, jank, memory, battery and ANRs** (Perfetto, Macrobenchmark, baseline profiles, Play vitals).
- You apply **security best practices** (Keystore, pinning with rotation, Play Integrity, MASVS) and respect privacy policies.
- You ship safely: **staged rollouts, feature flags, crash gates, deobfuscated crash reports**.
- You handle **fragmentation** (API levels, OEM behaviour, large screens) and target-SDK changes proactively.
- You make pragmatic **KMP/cross-platform** decisions and communicate trade-offs.
- You bring concrete numbers and incident stories.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Core facts
```
Kotlin: null safety • data/sealed classes • extension & scope functions • coroutines/Flow
Android: Activity/Service/Receiver/Provider • manifest • lifecycle • Intents • permissions
Compose: UI = f(state) • remember/rememberSaveable • state hoisting • recomposition • effects
Architecture: UI → ViewModel (StateFlow) → Repository → Room/Retrofit • Hilt DI
```

### Performance checklist
Keys in lazy lists • stable models • defer state reads • avoid main-thread work • baseline profiles + R8 • Macrobenchmark • LeakCanary • image downsampling (Coil) • WorkManager constraints • monitor Play vitals.

### Data/state checklist
Room as source of truth • Flow reads, suspend writes • DataStore for settings • typed errors • idempotent sync with outbox • process-death restoration via SavedStateHandle • Paging 3 for large lists.

### Security checklist
No secrets in APK • Keystore-backed encryption • HTTPS + pinning (backup pins) • Play Integrity verified server-side • minimal permissions • `exported=false` by default • FLAG_SECURE for sensitive screens • MASVS review.

### Release checklist
Version code/name • signing via Play App Signing • AAB • R8 mapping upload • internal → closed → open → production • staged rollout • crash/ANR gates • remote kill switches • Data safety form.

### Interview strategy
1. Clarify product needs: offline, performance, device range, security, team skills.
2. Propose architecture (modules, state, data, DI) and justify.
3. Show key code patterns (ViewModel + StateFlow + Compose, repository, WorkManager).
4. Address lifecycle/process death, performance and security risks.
5. Describe testing, CI/CD, rollout and monitoring.
6. Close with a measured story (startup, ANR rate, crash-free users).

### Final checklist before the interview
- [ ] Explain Kotlin null safety, data/sealed classes, scope functions and generics/variance basics.
- [ ] Explain coroutines (structured concurrency, dispatchers, cancellation) and Flow vs StateFlow vs SharedFlow.
- [ ] Describe Activity/Fragment lifecycles, config changes and process death handling.
- [ ] Build Compose screens with hoisted state, effects and lazy lists; explain recomposition and stability.
- [ ] Design MVVM/UDF architecture with Hilt, Room, Retrofit, WorkManager and offline-first sync.
- [ ] Optimize startup/jank/ANRs with Perfetto, Macrobenchmark and baseline profiles.
- [ ] Secure the app (Keystore, pinning, Play Integrity, secure components) and follow Play policies.
- [ ] Test across layers (unit, Compose UI, screenshot, benchmark) and automate CI/CD with staged rollouts.
- [ ] Discuss KMP/cross-platform trade-offs and modularization.
- [ ] Prepare a project story, a performance story and an incident/rollback story with numbers.
