# Flutter & Dart Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **Flutter 3.2x–3.3x** and **Dart 3.x** (sound null safety, records, patterns, sealed classes, class modifiers, extension types), the **Impeller** rendering engine (default on iOS and Android), **Material 3**, **go_router**, **Riverpod 2/3**, **flutter_bloc**, **Provider**, **dio**, **freezed/json_serializable**, **drift**, **FlutterFire**, and the Flutter testing toolchain (`flutter_test`, `integration_test`, golden tests, `mocktail`). Flutter releases roughly quarterly and package APIs shift: anything marked "verify" should be checked in the official docs (docs.flutter.dev, dart.dev, pub.dev) for your exact version. Examples use the sample name **Ritesh Kumar**.
> This file covers Dart language fundamentals, Flutter's widget model (three trees, `BuildContext`, keys), layout and constraints, Material/Cupertino and theming, navigation, state management (setState, InheritedWidget, Provider, Riverpod, Bloc), async programming (Futures, Streams, isolates), networking and serialization, local storage, platform channels/FFI, animations, performance and the rendering pipeline, testing, CI/CD and releases, security, accessibility, i18n, architecture (MVVM/clean), Flutter web/desktop and production practice. Related topics: React Native in `041_React-Native.md`, native stacks in `043_Kotlin-Android.md` and `044_Swift-iOS.md`, testing in `../06_Testing/040_Testing.md`, backend APIs in `../03_Backend/035_GraphQL-and-REST-APIs.md`, security in `../03_Backend/036_Authentication-and-Security.md`, Firebase in `../03_Backend/034_Firebase-and-Supabase.md`, CI/CD in `../07_DevOps_and_Cloud/047_CI-CD-and-DevOps.md`.

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
- [Part 12: Flutter Internals](#-part-12-flutter-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is Flutter? *(Must-know)*
An open-source UI toolkit by Google for building **natively compiled apps for mobile (iOS/Android), web, desktop (Windows/macOS/Linux) and embedded** from a **single codebase**, written in **Dart**. Unlike React Native, Flutter doesn't use platform widgets: it draws every pixel itself with its own rendering engine (Skia, now **Impeller**), giving consistent UI across platforms.

### Q2. What is Dart and why does Flutter use it?
Dart is a client-optimized, statically typed, object-oriented language with sound null safety. It supports **JIT** compilation (hot reload during development) and **AOT** compilation (fast, predictable release performance), has a single-threaded event loop with **isolates** for parallelism, and features that suit declarative UI (collection `if`/`for`, spread, records, patterns).

### Q3. Flutter vs React Native vs native *(Must-know)*
| | Flutter | React Native | Native |
|---|---|---|---|
| Language | Dart | JS/TS | Swift / Kotlin |
| UI rendering | Own engine (Impeller/Skia) | Platform views | Platform toolkit |
| Look & feel | Identical everywhere (can mimic native) | Native widgets | Native |
| Performance | Near-native, no bridge | Near-native (New Architecture) | Best |
| Hot reload | Stateful hot reload | Fast Refresh | Limited |
| Ecosystem | pub.dev | npm | Platform SDKs |
| Web/desktop | Supported (varying maturity) | RN Web / limited desktop | N/A |
See `041_React-Native.md`, `043_Kotlin-Android.md`, `044_Swift-iOS.md`.

### Q4. Everything is a widget
Widgets describe part of the UI as an immutable configuration. Layout (`Row`, `Padding`, `Center`), styling (`Theme`), interaction (`GestureDetector`) and structure (`Scaffold`) are all widgets composed into a tree. Prefer composition over inheritance.

### Q5. StatelessWidget vs StatefulWidget *(Must-know)*
`StatelessWidget` has no mutable state: its UI depends only on constructor arguments and inherited data. `StatefulWidget` pairs an immutable widget with a long-lived `State` object that holds mutable data and calls `setState()` to schedule a rebuild.
```dart
class Counter extends StatefulWidget {
  const Counter({super.key});
  @override State<Counter> createState() => _CounterState();
}
class _CounterState extends State<Counter> {
  int _count = 0;
  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () => setState(() => _count++),
      child: Text('Count: $_count'),
    );
  }
}
```

### Q6. A minimal Flutter app
```dart
import 'package:flutter/material.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Demo',
      theme: ThemeData(colorSchemeSeed: Colors.indigo, useMaterial3: true),
      home: Scaffold(
        appBar: AppBar(title: const Text('Hello Ritesh Kumar')),
        body: const Center(child: Text('Welcome to Flutter')),
      ),
    );
  }
}
```

### Q7. Setup and commands
```bash
flutter doctor              # verify toolchain (SDK, Android Studio, Xcode)
flutter create my_app
cd my_app && flutter run    # pick a device; press r (hot reload), R (hot restart), q (quit)
flutter pub add dio         # add a dependency
flutter build apk --release # or appbundle / ios / web
flutter analyze && flutter test
```

### Q8. Hot reload vs hot restart vs full restart
**Hot reload** injects updated source into the running Dart VM and rebuilds the widget tree, preserving state. **Hot restart** reloads code and resets app state. A **full restart/rebuild** is needed for native code, plugin, asset or `main()`-level initialization changes.

### Q9. Project structure
`lib/` (Dart code; `main.dart` entry), `test/`, `integration_test/`, `android/`, `ios/`, `web/`, `pubspec.yaml` (dependencies, assets, fonts), `analysis_options.yaml` (lints). Organize `lib/` by feature (e.g., `features/auth/{data,domain,presentation}`) for scalability.

### Q10. pubspec.yaml essentials
```yaml
name: my_app
environment: { sdk: ">=3.4.0 <4.0.0" }
dependencies:
  flutter: { sdk: flutter }
  dio: ^5.4.0
  go_router: ^14.0.0
dev_dependencies:
  flutter_test: { sdk: flutter }
  flutter_lints: ^4.0.0
flutter:
  uses-material-design: true
  assets: [assets/images/]
  fonts:
    - family: Inter
      fonts: [{ asset: assets/fonts/Inter-Regular.ttf }]
```
Run `flutter pub get` after changes.

### Q11. Dart basics: variables and types
```dart
var name = 'Ritesh Kumar';        // inferred String
final DateTime created = DateTime.now();   // set once at runtime
const pi = 3.14159;               // compile-time constant
int? age;                         // nullable
late String token;                // initialized later (must be before use)
```
`final` = single assignment at runtime; `const` = compile-time constant (also canonicalizes instances).

### Q12. Null safety *(Must-know)*
Types are non-nullable by default; add `?` for nullable. Operators: `?.` (null-aware access), `??` (default), `??=` (assign if null), `!` (assert non-null, throws if null), `?[]`, `...?`. Flow analysis promotes nullable variables after null checks.
```dart
String? nickname;
print(nickname?.length ?? 0);
if (nickname != null) print(nickname.length);   // promoted to String
```

### Q13. Functions, named parameters, arrow syntax
```dart
int add(int a, int b) => a + b;
void greet({required String name, int age = 18}) => print('$name ($age)');
String join(String a, [String? b]) => b == null ? a : '$a $b';   // optional positional
greet(name: 'Ritesh Kumar');
```
Functions are first-class objects; closures capture variables.

### Q14. Collections and collection operators
```dart
final nums = [1, 2, 3];
final doubled = nums.map((n) => n * 2).toList();
final evens = [for (final n in nums) if (n.isEven) n];
final all = [...nums, ...doubled];
final map = {'a': 1, 'b': 2};
final set = {1, 2, 2};     // {1, 2}
```

### Q15. Classes, constructors and mixins
```dart
class User {
  final String name;
  final int age;
  const User({required this.name, this.age = 0});
  User.guest() : this(name: 'Guest');
  factory User.fromJson(Map<String, dynamic> j) => User(name: j['name'] as String, age: j['age'] as int? ?? 0);
}
mixin Loggable { void log(String m) => print('[LOG] $m'); }
class Service with Loggable {}
abstract interface class Repository { Future<User> fetch(String id); }
```

### Q16. Dart 3 features: records, patterns, sealed classes *(Must-know)*
```dart
(String, int) pair = ('Ritesh', 28);         // record
final (name, years) = pair;                  // destructuring

sealed class Result<T> {}
class Ok<T> extends Result<T> { final T value; Ok(this.value); }
class Err<T> extends Result<T> { final Object error; Err(this.error); }

String describe(Result<int> r) => switch (r) {
  Ok(:final value) when value > 10 => 'big $value',
  Ok(:final value) => 'ok $value',
  Err(:final error) => 'error $error',
};   // exhaustive: compiler checks all subtypes
```

### Q17. Async basics: Future, async/await
```dart
Future<User> fetchUser(String id) async {
  final res = await dio.get('/users/$id');
  return User.fromJson(res.data);
}
try { final u = await fetchUser('42'); } catch (e) { print(e); } finally { /* cleanup */ }
final results = await Future.wait([fetchUser('1'), fetchUser('2')]);   // parallel
```
Dart runs on a single-threaded event loop (microtask queue + event queue).

### Q18. Streams
```dart
Stream<int> counter() async* { for (var i = 0; i < 3; i++) { await Future.delayed(const Duration(seconds: 1)); yield i; } }
await for (final n in counter()) print(n);
final controller = StreamController<String>.broadcast();
controller.stream.listen(print); controller.add('hi'); await controller.close();
```
Single-subscription vs broadcast streams. Use `StreamBuilder` in UI.

### Q19. FutureBuilder and StreamBuilder
```dart
FutureBuilder<User>(
  future: _userFuture,                       // create once (initState), not in build()
  builder: (context, snap) {
    if (snap.connectionState != ConnectionState.done) return const CircularProgressIndicator();
    if (snap.hasError) return Text('Error: ${snap.error}');
    return Text(snap.data!.name);
  },
);
```
Creating the future inside `build` refetches on every rebuild.

### Q20. Layout basics: Row, Column, Stack, Expanded *(Must-know)*
```dart
Column(
  mainAxisAlignment: MainAxisAlignment.center,
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [
    const Text('Title'),
    Row(children: [const Icon(Icons.star), const SizedBox(width: 8), Expanded(child: Text('Long description...'))]),
    Stack(children: [Image.asset('a.png'), const Positioned(right: 8, top: 8, child: Icon(Icons.favorite))]),
  ],
)
```
`Expanded`/`Flexible` distribute remaining space in a flex parent. `Spacer`, `Wrap`, `Align`, `Padding`, `SizedBox`, `Container` are common helpers.

### Q21. Constraints: "Constraints go down, sizes go up, parent sets position" *(Must-know)*
A parent passes min/max constraints to a child; the child picks a size within them and reports it; the parent positions the child. Understanding this resolves most layout errors: unbounded constraints (a `ListView` inside a `Column`), overflow stripes, and widgets ignoring width.

### Q22. Common layout errors
`RenderFlex overflowed` (content larger than space → `Expanded`, `Flexible`, scroll, `Wrap`), `Vertical viewport was given unbounded height` (list inside column → wrap in `Expanded`/`SizedBox`/`shrinkWrap`), `Incorrect use of ParentDataWidget` (`Expanded` outside a Flex).

### Q23. Lists: ListView.builder
```dart
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, i) => ListTile(title: Text(items[i].name), onTap: () => open(items[i])),
)
```
Builds lazily only visible items; use `ListView.separated`, `GridView.builder`, `SliverList` (inside `CustomScrollView`) for advanced cases. Avoid `ListView(children: [...bigList])` for long lists.

### Q24. Material 3, theming and Cupertino
`ThemeData(useMaterial3: true, colorSchemeSeed: ...)`, `ColorScheme`, `TextTheme`, component themes (`ElevatedButtonThemeData`), dark mode via `darkTheme` + `themeMode`. Access with `Theme.of(context)`. Cupertino widgets (`CupertinoButton`, `CupertinoNavigationBar`) give iOS look; use `.adaptive` constructors or `Platform` checks for adaptive UI.

### Q25. Navigation basics (Navigator)
```dart
Navigator.push(context, MaterialPageRoute(builder: (_) => const DetailsPage(id: '42')));
Navigator.pop(context, result);
Navigator.pushNamed(context, '/profile', arguments: {'id': '42'});
```
For deep links, web URLs and guards use a declarative router such as **go_router**.

### Q26. go_router basics *(Must-know)*
```dart
final router = GoRouter(
  initialLocation: '/',
  redirect: (context, state) => !auth.isSignedIn && state.matchedLocation != '/login' ? '/login' : null,
  routes: [
    GoRoute(path: '/', builder: (_, __) => const HomePage()),
    GoRoute(path: '/login', builder: (_, __) => const LoginPage()),
    GoRoute(path: '/user/:id', builder: (_, s) => UserPage(id: s.pathParameters['id']!)),
    ShellRoute(builder: (_, __, child) => ScaffoldWithNav(child: child), routes: [/* tab routes */]),
  ],
);
MaterialApp.router(routerConfig: router);
// context.go('/user/42'); context.push('/user/42'); context.pop();
```

### Q27. Forms and input
`TextField`/`TextFormField` with `TextEditingController` (dispose in `dispose()`), `Form` + `GlobalKey<FormState>` + `validator`, `keyboardType`, `obscureText`, `textInputAction`, `FocusNode`. Use `flutter_form_builder` or Riverpod/Bloc for complex forms.
```dart
final _formKey = GlobalKey<FormState>();
Form(key: _formKey, child: TextFormField(validator: (v) => (v == null || !v.contains('@')) ? 'Invalid email' : null));
if (_formKey.currentState!.validate()) { /* submit */ }
```

### Q28. Gestures and interaction
`GestureDetector` (tap, double tap, long press, drag, scale), `InkWell` (ripple), `Dismissible` (swipe to dismiss), `Draggable`/`DragTarget`, `Listener` (raw pointers). Use `Semantics` for accessibility.

### Q29. Images and assets
`Image.asset`, `Image.network` (use `cached_network_image` for caching), `AssetImage`, SVG via `flutter_svg`. Declare assets in `pubspec.yaml`; provide resolution variants (`2.0x/`, `3.0x/`). Set `cacheWidth`/`cacheHeight` for large images.

### Q30. Packages and plugins
Pure-Dart **packages** vs **plugins** (Dart + platform code). Find on pub.dev (check likes, pub points, popularity, maintenance, null safety, platform support). Add with `flutter pub add`. Evaluate maintenance and license before depending on a package.

### Q31. Debugging tools
Flutter DevTools (widget inspector, performance, memory, network, logging), `debugPrint`, `flutter run --profile`, breakpoints in IDE, `flutter logs`, Dart analyzer (`flutter analyze`), `debugPaintSizeEnabled`. Performance overlay: `showPerformanceOverlay: true`.

### Q32. Build modes
**Debug** (JIT, asserts, hot reload, slow), **Profile** (AOT-ish, for performance analysis, DevTools), **Release** (AOT, optimized, tree-shaken). Never measure performance in debug mode.

### Q33. Platform-specific code
```dart
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb, defaultTargetPlatform, TargetPlatform;
if (!kIsWeb && Platform.isIOS) { /* iOS */ }
if (defaultTargetPlatform == TargetPlatform.android) { /* Android */ }
```
Prefer `defaultTargetPlatform`/`Theme.of(context).platform` for testability; `dart:io` is unavailable on web.

### Q34. Permissions and device features
Plugins: `permission_handler`, `image_picker`, `geolocator`, `camera`, `local_auth`, `connectivity_plus`, `url_launcher`, `share_plus`. Declare permissions in `AndroidManifest.xml` and `Info.plist` and handle denied/permanently denied states.

### Q35. Dart immutability and equality
Immutable data classes avoid bugs; implement `==`/`hashCode` (or use `freezed`/`equatable`/records) so widgets and state comparisons behave correctly. Use `const` constructors to enable widget reuse.

### Q36. `const` widgets and rebuilds
A `const` widget instance is canonicalized and Flutter can skip rebuilding it when the parent rebuilds. Use `const` wherever possible (lint `prefer_const_constructors`). This is a cheap, effective performance habit.

---

# 🔵 Part 2: Junior (1–3 years)

### Q37. The three trees: Widget, Element, RenderObject *(Must-know)*
- **Widget tree**: immutable, lightweight configuration objects recreated on every build.
- **Element tree**: long-lived instances linking widgets to their position in the tree; manages lifecycle and decides whether to update or replace a subtree (compares `runtimeType` and `key`).
- **RenderObject tree**: handles layout, painting and hit testing; expensive, reused across rebuilds.
Rebuilding widgets is cheap because Elements and RenderObjects are reused when types/keys match.

### Q38. `BuildContext` *(Must-know)*
A handle to a widget's location in the Element tree. Used to look up ancestors (`Theme.of(context)`, `Navigator.of(context)`, `Provider.of`). Using a `context` after an `await` can refer to an unmounted widget: check `if (!context.mounted) return;` (or `mounted` in `State`) before using it.

### Q39. Widget lifecycle (StatefulWidget)
`createState` → `initState` (once; init controllers, subscribe) → `didChangeDependencies` (inherited widgets changed) → `build` → `didUpdateWidget` (parent supplied new config) → `setState` → `deactivate` → `dispose` (cancel timers, dispose controllers, close streams). Call `super.initState()` first and `super.dispose()` last.

### Q40. Keys: when and why *(Must-know)*
Keys preserve identity of widgets/state when they move or reorder. `ValueKey`/`ObjectKey` for list items with state, `UniqueKey` to force recreation, `GlobalKey` to access state from elsewhere (use sparingly), `PageStorageKey` to preserve scroll position. Without keys, Flutter matches by position and type, causing state to attach to the wrong item after reordering.

### Q41. State management overview *(Must-know)*
| Approach | Idea | When |
|---|---|---|
| `setState` | Local widget state | Simple, ephemeral UI state |
| `InheritedWidget`/`InheritedNotifier` | Propagate data down the tree | Foundation of others |
| **Provider** | Wrapper over InheritedWidget | Small/medium apps |
| **Riverpod** | Compile-safe, testable providers, no context needed | Modern default for many teams |
| **Bloc/Cubit** | Events/states with streams, strict separation | Large apps, predictable flows |
| GetX/MobX/Redux | Alternatives | Team preference |
Distinguish **ephemeral** (UI-only) from **app state** (shared, persisted).

### Q42. Provider example
```dart
class CartModel extends ChangeNotifier {
  final List<Item> _items = [];
  List<Item> get items => List.unmodifiable(_items);
  void add(Item i) { _items.add(i); notifyListeners(); }
}
void main() => runApp(ChangeNotifierProvider(create: (_) => CartModel(), child: const MyApp()));

// read without listening (callbacks): context.read<CartModel>().add(item);
// watch and rebuild: final count = context.watch<CartModel>().items.length;
// select to limit rebuilds: context.select<CartModel, int>((c) => c.items.length);
```

### Q43. Riverpod example *(Must-know)*
```dart
final apiProvider = Provider((ref) => Dio(BaseOptions(baseUrl: 'https://api.example.com')));

final userProvider = FutureProvider.family<User, String>((ref, id) async {
  final res = await ref.watch(apiProvider).get('/users/$id');
  return User.fromJson(res.data);
});

class CounterNotifier extends Notifier<int> {
  @override int build() => 0;
  void inc() => state++;
}
final counterProvider = NotifierProvider<CounterNotifier, int>(CounterNotifier.new);

class UserPage extends ConsumerWidget {
  const UserPage({super.key, required this.id});
  final String id;
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(userProvider(id));
    return user.when(
      data: (u) => Text(u.name),
      loading: () => const CircularProgressIndicator(),
      error: (e, st) => Text('Error: $e'),
    );
  }
}
```
Wrap the app in `ProviderScope`. Providers are lazily created, cached, auto-disposed (`autoDispose`) and overridable in tests.

### Q44. Bloc/Cubit example
```dart
class CounterCubit extends Cubit<int> {
  CounterCubit() : super(0);
  void increment() => emit(state + 1);
}
BlocProvider(create: (_) => CounterCubit(), child: BlocBuilder<CounterCubit, int>(builder: (_, count) => Text('$count')));
// context.read<CounterCubit>().increment();
```
Bloc uses events → states via `on<Event>`; Cubit exposes methods that emit states. Use `BlocListener` for side effects (navigation, snackbars), `BlocSelector` to limit rebuilds, and `equatable`/`freezed` states.

### Q45. `watch` vs `read` vs `listen`
`watch` subscribes and rebuilds when the value changes (use in `build`). `read` gets the value once without subscribing (use in callbacks/event handlers). `listen` runs a side effect on change without rebuilding. Using `read` inside `build` for reactive data is a bug.

### Q46. Separating UI, state and data
Widgets render state and send intents; state holders (Notifier/Cubit/ViewModel) hold logic; repositories abstract data sources (REST, DB, cache); data sources do I/O. This enables testing business logic without UI and swapping implementations.

### Q47. Networking with dio / http
```dart
final dio = Dio(BaseOptions(baseUrl: 'https://api.example.com', connectTimeout: const Duration(seconds: 10), receiveTimeout: const Duration(seconds: 15)))
  ..interceptors.add(InterceptorsWrapper(
    onRequest: (o, h) { o.headers['Authorization'] = 'Bearer ${tokenStore.access}'; h.next(o); },
    onError: (e, h) async { if (e.response?.statusCode == 401 && await refreshToken()) { return h.resolve(await dio.fetch(e.requestOptions)); } h.next(e); },
  ));
final res = await dio.get<Map<String, dynamic>>('/users', queryParameters: {'page': 1});
```
`dio` offers interceptors, cancellation, retries (package), multipart uploads and progress; `http` is minimal.

### Q48. JSON serialization
Manual `fromJson/toJson`, `json_serializable` (codegen via `build_runner`), `freezed` (immutable unions + copyWith + JSON), or `dart_mappable`. Dart 3 patterns and records help decoding.
```dart
@freezed
class User with _$User {
  const factory User({required String id, required String name, @Default(0) int age}) = _User;
  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
}
// dart run build_runner build --delete-conflicting-outputs
```
Validate untrusted JSON; handle missing fields and type mismatches gracefully.

### Q49. Error handling patterns
`try/catch` with typed exceptions, `Result`/`Either` types (sealed classes, `fpdart`), mapping `DioException` to domain errors, global handlers: `FlutterError.onError`, `PlatformDispatcher.instance.onError`, `runZonedGuarded`, and crash reporting (Sentry/Crashlytics). Show user-friendly messages and retry options.

### Q50. Local storage options *(Must-know)*
| Option | Use for |
|---|---|
| `shared_preferences` | Small key-value settings |
| `flutter_secure_storage` | Tokens/secrets (Keychain/Keystore) |
| `sqflite` / **drift** | Relational data with typed queries (drift is type-safe SQL) |
| Hive / Isar / ObjectBox | Fast NoSQL/embedded object stores (check maintenance status) |
| File I/O (`path_provider`) | Files, caches |
Never store sensitive tokens in `shared_preferences`.

### Q51. Asynchronous UI patterns
Show loading/error/empty/data states explicitly; use `AsyncValue` (Riverpod), sealed state classes, or `FutureBuilder`/`StreamBuilder`; debounce search input; cancel stale requests; use pull-to-refresh (`RefreshIndicator`) and infinite scrolling (`ScrollController` listener or `infinite_scroll_pagination`).

### Q52. Isolates and concurrency *(Must-know)*
Dart is single-threaded per isolate; isolates don't share memory and communicate by message passing. Offload CPU-heavy work (JSON parsing of big payloads, image processing) to avoid UI jank.
```dart
final result = await Isolate.run(() => parseHugeJson(raw));    // Dart 2.19+
final data = await compute(parseHugeJson, raw);                 // Flutter helper
```
Async I/O doesn't need isolates; CPU-bound work does.

### Q53. Platform channels
Communicate with native code via `MethodChannel` (calls), `EventChannel` (streams), `BasicMessageChannel`.
```dart
const channel = MethodChannel('com.acme/battery');
final level = await channel.invokeMethod<int>('getBatteryLevel');
```
```kotlin
MethodChannel(flutterEngine.dartExecutor.binaryMessenger, "com.acme/battery").setMethodCallHandler { call, result ->
  if (call.method == "getBatteryLevel") result.success(getLevel()) else result.notImplemented()
}
```
Use **Pigeon** to generate type-safe channel code, and **FFI** (`dart:ffi`, `ffigen`) for C/C++/Rust libraries.

### Q54. Animations: implicit vs explicit *(Must-know)*
Implicit: `AnimatedContainer`, `AnimatedOpacity`, `TweenAnimationBuilder` (change a property; Flutter animates). Explicit: `AnimationController` + `Tween` + `AnimatedBuilder` (full control, requires `SingleTickerProviderStateMixin`, dispose controller). `Hero` for shared-element transitions; `AnimatedSwitcher`, `Lottie`, `rive`, `flutter_animate` for richer effects.
```dart
AnimatedContainer(duration: const Duration(milliseconds: 300), curve: Curves.easeOut, width: expanded ? 200 : 100, color: expanded ? Colors.blue : Colors.red);
```

### Q55. Custom painting
`CustomPaint` + `CustomPainter` draw on a `Canvas` (paths, shapes, gradients, shaders). Implement `shouldRepaint` carefully; use `RepaintBoundary` to isolate frequently repainting areas. Fragment shaders (`FragmentProgram`) enable GPU effects.

---

### Q56. Responsive and adaptive design
`MediaQuery.sizeOf(context)`, `LayoutBuilder` (constraints of the parent), `OrientationBuilder`, breakpoints (compact/medium/expanded), `Flexible`/`Expanded`, `AspectRatio`, `FractionallySizedBox`, adaptive navigation (bottom bar on phones, rail/drawer on tablets/desktop), `SafeArea`, text scaling (`MediaQuery.textScalerOf`). Test with multiple window sizes and foldables.

### Q57. Theming and design systems
Centralize colors, typography, spacing and component themes in `ThemeData`/`ThemeExtension`; create reusable widgets (`AppButton`, `AppCard`); use design tokens; support light/dark; avoid hard-coded colors/sizes in screens. Consider `flex_color_scheme` or a custom token layer.

### Q58. Internationalization (i18n/l10n)
Use `flutter_localizations` + `intl` with ARB files and generated `AppLocalizations`. Support plurals/gender via ICU messages, locale-aware date/number formatting (`DateFormat`, `NumberFormat`), RTL via `Directionality` and `EdgeInsetsDirectional`, and `Locale` switching. Test long strings and pseudo-locales.
```yaml
flutter: { generate: true }      # l10n.yaml: arb-dir: lib/l10n, template-arb-file: app_en.arb
```
```dart
Text(AppLocalizations.of(context)!.welcome('Ritesh Kumar'));
```

### Q59. Accessibility *(Must-know)*
`Semantics` widget (labels, hints, roles, `button: true`), `ExcludeSemantics`/`MergeSemantics`, minimum tap targets (48×48 dp), text scaling support, sufficient contrast, focus order and keyboard navigation, `tooltip` on icon buttons, screen-reader testing (TalkBack/VoiceOver), reduced-motion respect (`MediaQuery.disableAnimationsOf`). Use the accessibility guideline testers in widget tests (`meetsGuideline(textContrastGuideline)`).

### Q60. App lifecycle and background behaviour
Observe with `WidgetsBindingObserver.didChangeAppLifecycleState` (`resumed`, `inactive`, `paused`, `detached`, `hidden`). Pause timers/streams in background, refresh on resume, persist drafts. Background execution is limited: use `workmanager`, `flutter_background_service` or platform APIs for tasks, and push notifications for wake-ups.

### Q61. Push notifications (FCM)
`firebase_messaging` + `flutter_local_notifications`: request permission (iOS/Android 13+), get the FCM token, handle foreground (`onMessage`), background (`onBackgroundMessage` top-level function), opened-app (`onMessageOpenedApp`, `getInitialMessage`) and notification channels on Android. Configure APNs keys for iOS. Route taps via deep links.

### Q62. FlutterFire and Firebase basics
`flutterfire configure` generates `firebase_options.dart`; initialize with `await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform)` before `runApp`. Packages: `firebase_auth`, `cloud_firestore`, `firebase_storage`, `firebase_crashlytics`, `firebase_analytics`, `firebase_remote_config`. See `../03_Backend/034_Firebase-and-Supabase.md` for rules, security and cost considerations.

### Q63. Authentication patterns
Firebase Auth or OIDC (`flutter_appauth`, system browser with PKCE), store refresh tokens in `flutter_secure_storage`, keep access tokens in memory, refresh via interceptor, guard routes with go_router `redirect`, biometrics with `local_auth` as a local gate. See `../03_Backend/036_Authentication-and-Security.md`.

### Q64. Deep links and app links
go_router handles URL-based navigation; configure Android intent filters + `assetlinks.json` (App Links) and iOS Associated Domains + `apple-app-site-association` (Universal Links). Handle cold start and warm start; validate parameters; preserve intended destination through login.

### Q65. Flavors / environments
Separate dev/staging/prod with Android product flavors and iOS schemes/xcconfigs; per-flavor app IDs, icons, Firebase configs and API endpoints. Use `--flavor` and `--dart-define` / `--dart-define-from-file` for compile-time config (not secrets: values are embedded in the binary).
```bash
flutter run --flavor staging --dart-define=API_URL=https://staging.api.example.com
```

### Q66. Testing pyramid in Flutter *(Must-know)*
Unit tests (`flutter_test`/`test`), widget tests (`testWidgets`, `pumpWidget`, finders, `tester.tap`), golden tests (`matchesGoldenFile`), integration tests (`integration_test` on devices/emulators), plus mocks via `mocktail`/`mockito`. See `../06_Testing/040_Testing.md`.
```dart
testWidgets('increments counter', (tester) async {
  await tester.pumpWidget(const MaterialApp(home: Counter()));
  expect(find.text('Count: 0'), findsOneWidget);
  await tester.tap(find.byType(ElevatedButton));
  await tester.pump();
  expect(find.text('Count: 1'), findsOneWidget);
});
```

### Q67. Mocking and dependency injection
Constructor injection or provider overrides: `ProviderScope(overrides: [apiProvider.overrideWithValue(fakeApi)])`; `mocktail` for stubs (`when(() => repo.fetch(any())).thenAnswer((_) async => user)`); `get_it` service locator (use carefully). Design for testability: depend on abstractions, avoid singletons in widgets.

### Q68. Golden tests
Compare rendered widgets with stored images to detect visual regressions; keep fonts/platform consistent (load fonts in tests, use Alchemist/golden_toolkit), run in CI on a fixed platform, and review diffs deliberately.

### Q69. Integration/E2E testing
`integration_test` package drives the real app on device/emulator; tools: Patrol (native interactions, permissions), Maestro, Appium, Firebase Test Lab/BrowserStack for device farms. Keep suites small and stable; mock the backend or use a test environment.

### Q70. Build and release (Android/iOS)
Android: signing config with keystore, `flutter build appbundle --release`, Play Console tracks, obfuscation (`--obfuscate --split-debug-info`). iOS: Xcode signing, `flutter build ipa`, TestFlight, App Store review. CI services: Codemagic, GitHub Actions + Fastlane, Bitrise. Version via `pubspec.yaml` `version: 1.2.3+45`.

### Q71. Code-push alternatives
Flutter compiles to native AOT code; official OTA code push isn't available like JS frameworks. **Shorebird** provides Dart code push (patches) within store policy constraints (verify current terms). Otherwise release via stores; use server-driven UI/remote config for content-level changes.

### Q72. Dart style, lints and analysis
`flutter_lints`/`very_good_analysis`, `dart format`, `dart fix --apply`, strict analyzer modes (`strict-casts`, `strict-inference`, `strict-raw-types`), custom lint packages (`custom_lint`, Riverpod lint). Run analyze + format check in CI.

---

# 🟡 Part 3: Mid (3–5 years)

### Q73. Rendering pipeline: build → layout → paint → composite *(Must-know)*
Each frame: **Build** (widgets rebuilt where dirty) → **Layout** (RenderObjects compute sizes/positions via constraints) → **Paint** (records drawing commands into layers) → **Composite** (layers sent to the GPU rasterizer; **Impeller**/Skia draws pixels on the raster thread). The UI thread runs Dart (build/layout/paint); the raster thread executes GPU work. Jank arises when either exceeds ~16 ms (60 fps) or ~8 ms (120 fps).

### Q74. Impeller vs Skia
Impeller (default on iOS and modern Android) **precompiles shaders** at build time, avoiding runtime shader-compilation jank (the "first-run stutter" of Skia), with predictable performance and better GPU utilization. Skia remains for some platforms/fallbacks (web uses CanvasKit/Skwasm). Verify per-platform status for your Flutter version.

### Q75. Reducing rebuilds
Use `const` widgets, split large `build` methods into small widgets (not helper methods returning widgets, which rebuild with the parent), localize state (lowest possible `StatefulWidget`/`Consumer`), `select`/`BlocSelector` for partial subscriptions, `RepaintBoundary` for isolated repaints, avoid expensive work in `build`, and cache computed values. Profile with DevTools "Track widget rebuilds".

### Q76. Performance profiling workflow
Run in **profile mode** on a real device, open DevTools Performance (frame chart: UI vs raster threads), CPU profiler (flame chart), Memory (heap snapshots, leaks), enable "Highlight repaints", check shader compilation jank (Skia) and image decode costs. Fix the slowest frames first and re-measure.

### Q77. List and grid performance
`ListView.builder`/`SliverList` with `itemExtent` or `prototypeItem` when row heights are fixed, keys for stateful items, `AutomaticKeepAliveClientMixin` sparingly, cached images with proper `cacheWidth`, avoid heavy widgets (Opacity, ClipRRect, shadows) in large lists, paginate, and use `addAutomaticKeepAlives: false` when unneeded.

### Q78. Expensive widgets to use carefully
`Opacity` (use `FadeTransition`/`AnimatedOpacity`), `ClipRRect`/`ClipPath` with antialiasing (use `Clip.hardEdge` or pre-clipped assets), `BackdropFilter`, `saveLayer` triggers, large shadows, unbounded `Intrinsic*` widgets (O(n²) layout), `Wrap` with thousands of children. Find `saveLayer` use via DevTools.

### Q79. Image performance and memory
Resize/decode at display size (`cacheWidth/Height`, `ResizeImage`), use thumbnails from the CDN, `cached_network_image` with memory/disk caches, limit `imageCache.maximumSizeBytes`, precache critical images (`precacheImage`), and avoid keeping giant decoded bitmaps.

### Q80. Memory leaks in Flutter
Common causes: undisposed `AnimationController`, `TextEditingController`, `FocusNode`, `StreamSubscription`, `Timer`; global references to `BuildContext`; listeners not removed from `ChangeNotifier`s; closures capturing widgets. Dispose everything in `dispose`, cancel subscriptions, use `mounted` checks, and verify with DevTools memory tab and `leak_tracker`.

### Q81. Startup time optimization
Defer non-critical initialization after first frame (`WidgetsBinding.instance.addPostFrameCallback`), avoid heavy work in `main()` before `runApp`, lazy-load features (deferred imports on web), minimize plugins initialized at start, use native splash (`flutter_native_splash`), reduce asset sizes, and measure cold start with `flutter run --profile --trace-startup`.

### Q82. App size reduction
`--split-per-abi`, App Bundles, `--obfuscate --split-debug-info`, tree-shake icons (`--tree-shake-icons`, default), compress images (WebP/AVIF), remove unused packages/assets/fonts, analyze with `flutter build apk --analyze-size` (DevTools app-size tool), deferred components on Android (dynamic delivery), subset fonts.

### Q83. Clean architecture / MVVM in Flutter *(Must-know)*
Layers: **presentation** (widgets + view-model/Notifier/Bloc), **domain** (entities, use cases, repository interfaces), **data** (repository implementations, data sources, DTOs/mappers). Dependency rule: outer layers depend on inner ones. Benefits: testability, replaceable infrastructure; cost: boilerplate. Flutter's own guide recommends MVVM with Repository and Service layers (verify current guidance).

### Q84. Feature-first project structure
```
lib/
  core/ (network, errors, theme, router, utils)
  features/
    auth/{data,domain,presentation}
    products/{data,domain,presentation}
  main.dart
```
Keep features independent; expose public APIs via barrel files; enforce import rules with lints.

### Q85. Dependency injection options
Riverpod (providers as DI), `get_it` + `injectable` (service locator with codegen), constructor injection with manual composition root, Provider-based DI. Prefer explicit, testable wiring; avoid hidden global state.

### Q86. Offline-first data layer
Local database (drift/Isar/sqflite) as source of truth, repositories exposing `Stream`s, background sync with an outbox queue and idempotency keys, connectivity awareness (`connectivity_plus`), conflict resolution policies, optimistic UI. Test with airplane mode and killed-app scenarios.

### Q87. Caching strategies
HTTP caching (`dio_cache_interceptor`), in-memory caches in repositories, disk caches (drift/Hive), `cached_network_image`, stale-while-revalidate patterns with Riverpod (`keepAlive`, `invalidate`), and ETag usage. Define TTLs and invalidation rules.

### Q88. Pagination and infinite scroll
Cursor-based APIs, `ScrollController` threshold or `infinite_scroll_pagination`, prevent duplicate fetches (guard flag), handle errors with retry footers, preserve scroll on refresh, and de-duplicate by ID.

### Q89. Streams and reactive patterns
`StreamController`, `StreamBuilder`, `rxdart` (`BehaviorSubject`, `debounceTime`, `switchMap`) for search-as-you-type and combining streams; cancel subscriptions; prefer simple async patterns unless reactive composition adds clarity.

### Q90. Custom render objects and slivers
When widgets compose insufficiently: implement `RenderBox`/`RenderSliver` for custom layout; slivers (`SliverAppBar`, `SliverPersistentHeader`, `SliverGrid`) for scroll effects in `CustomScrollView`. Most apps need only slivers and `CustomPainter`.

### Q91. Platform views
Embed native views (Google Maps, WebView, ads) via `AndroidView`/`UiKitView` (hybrid composition or texture layer). Trade-offs: performance, gesture handling, z-ordering. Use well-maintained plugins and test on low-end devices.

### Q92. FFI and native code
`dart:ffi` calls C APIs synchronously with minimal overhead; generate bindings with `ffigen`; Rust via `flutter_rust_bridge`; Kotlin/Swift via Pigeon-generated channels; **native assets** (Dart hooks) simplify bundling native libs (verify availability). Use for crypto, codecs, ML inference, existing C++ libraries.

### Q93. Writing a plugin
`flutter create --template=plugin --platforms=android,ios my_plugin`: platform interface package pattern (federated plugins), Dart API + Kotlin/Swift implementations, example app, tests, documentation, and publishing to pub.dev with `dart pub publish` (versioning, changelog, license).

### Q94. Flutter web considerations
Renderers (CanvasKit/Skwasm), larger initial bundle, SEO limitations (client-rendered), URL strategy (`usePathUrlStrategy`), browser-specific behaviours (text selection, scrolling), deferred loading, PWA support, accessibility via semantics tree. Best for app-like experiences, not content sites.

### Q95. Flutter desktop considerations
Windows/macOS/Linux support: window management (`window_manager`), menus, keyboard shortcuts (`Shortcuts`/`Actions`), mouse hover/cursor, resizable layouts, platform packaging (MSIX, DMG, snap), auto-update solutions, native integrations via FFI.

### Q96. Security basics for Flutter apps
Secure storage for secrets, HTTPS only, certificate pinning (`dio` custom `SecurityContext` / `http_certificate_pinning`) with rotation plans, obfuscation (not security), avoid embedding API secrets (`--dart-define` values are extractable), root/jailbreak detection as defence-in-depth, secure deep links, and server-side authorization. Follow OWASP MASVS. See `../03_Backend/036_Authentication-and-Security.md`.

### Q97. Handling sensitive UI
Prevent screenshots on sensitive screens (`flutter_windowmanager`/`FLAG_SECURE`, iOS blur on app switcher), clear clipboard/inputs on logout, disable autofill for sensitive fields when needed, and avoid logging PII.

### Q98. Crash reporting and monitoring
`FlutterError.onError`, `PlatformDispatcher.instance.onError` and `runZonedGuarded` forward errors to Crashlytics/Sentry; upload symbols (obfuscation maps) and dSYMs; track ANRs, startup time and custom traces (Firebase Performance); log breadcrumbs; monitor release health by version.

### Q99. CI/CD for Flutter
Pipeline: `flutter pub get` → format/analyze → tests with coverage → build per platform (Android on Linux, iOS on macOS runners) → sign (secrets) → distribute (Firebase App Distribution/TestFlight/Play internal) → promote. Cache pub and Gradle. Tools: Codemagic, GitHub Actions, Bitrise, Fastlane. See `../07_DevOps_and_Cloud/047_CI-CD-and-DevOps.md`.
```yaml
- uses: subosito/flutter-action@v2
  with: { channel: stable, cache: true }
- run: flutter pub get && dart format --set-exit-if-changed . && flutter analyze && flutter test --coverage
```

### Q100. Monorepos and package modularization
Use Melos or Dart workspaces to manage multiple packages (core, design_system, features), enforce boundaries, run affected tests, and share code across apps (including web/desktop). Local path dependencies speed iteration; publish internal packages to a private registry when needed.

### Q101. Code generation tooling
`build_runner` (freezed, json_serializable, drift, riverpod_generator, retrofit), watch mode (`dart run build_runner watch`), commit generated code or generate in CI per team policy, keep builds fast with `build.yaml` scoping.

### Q102. Upgrading Flutter and dependencies
Use `flutter upgrade`/FVM to pin versions per project, read breaking-change guides, run `dart fix`, `flutter pub outdated`, upgrade incrementally by stable release, run full tests and device checks, watch plugin compatibility (Gradle/AGP/Xcode requirements), and avoid abandoned packages.

---

# 🟠 Part 4: Senior (5–7 years)

### Q103. Designing a scalable Flutter architecture *(Must-know)*
- **Modules:** `core` (networking, errors, storage, theming), `design_system`, feature packages with clear public APIs.
- **State:** Riverpod/Bloc per feature; immutable states (freezed/sealed); side effects in notifiers; one-way data flow.
- **Data:** repository pattern, remote + local data sources, DTO ↔ domain mappers, offline-first where needed, typed errors (sealed `Failure`).
- **Navigation:** go_router with typed routes, auth guards, deep-link tests.
- **Quality:** strict lints, unit/widget/golden/integration tests, architecture tests (import rules), CI gates.
- **Delivery:** flavors, signing automation, staged rollouts, monitoring dashboards.

### Q104. Offline-first sync engine design
Local DB as source of truth exposed as streams; mutations written to an outbox with client IDs and idempotency keys; sync worker pushes with exponential backoff and pulls changes using cursors/version vectors; per-entity conflict policy (server-wins, last-write-wins, field merge); tombstones for deletes; observable sync status; background sync constrained by OS (WorkManager/BGTaskScheduler). Test: kill app mid-sync, flaky network, clock skew, large backlogs.

### Q105. Real-time features in Flutter
WebSockets (`web_socket_channel`), SSE, Firebase/Supabase realtime listeners, gRPC streams; handle lifecycle (disconnect in background, resync on resume), reconnect with backoff, message ordering by sequence IDs, and battery/network usage. See `../03_Backend/037_WebSockets-and-Realtime.md`.

### Q106. Custom plugin vs platform channel vs FFI decision
Platform channel: use platform SDKs (camera, payments SDKs) with async messages. FFI: call C/C++/Rust libs synchronously with low overhead (crypto, codecs). Pigeon for type-safe channel APIs. Evaluate maintenance cost of native code in both Android and iOS before choosing; prefer existing maintained plugins.

### Q107. Performance engineering programme
Define budgets (startup, frame time p95, memory, app size), profile in profile mode on low-end devices, track jank in production (Firebase Performance, Sentry, custom frame timings via `SchedulerBinding.addTimingsCallback`), add performance tests to CI (`integration_test` with `traceAction`/`TimelineSummary`), and review regressions per release.

### Q108. Avoiding jank from heavy work
Move parsing, compression, encryption, image processing to isolates (`Isolate.run`, `compute`, long-lived isolates for pipelines); chunk work across frames (`SchedulerBinding.scheduleTask`), use `Future.microtask` sparingly, precompute data, avoid synchronous file I/O on the UI isolate, and keep `build` pure.

### Q109. Large-scale state management guidelines
One source of truth per piece of data, immutable state, derived state via selectors/computed providers, scope providers to features, avoid global mutable singletons, handle loading/error uniformly (`AsyncValue`), use `keepAlive`/`autoDispose` deliberately, write notifier unit tests, and keep UI free of business logic.

### Q110. Navigation architecture at scale
Typed routes (`go_router_builder`), nested navigation with `StatefulShellRoute` (preserve tab state), route guards via `redirect` listening to auth state (`refreshListenable`), deep link allow-lists, analytics via `NavigatorObserver`, modal flows (dialogs, bottom sheets) handled consistently, and predictive back (Android 14+) support.

### Q111. Design system and theming at scale
Tokens as `ThemeExtension`s (spacing, radii, semantic colors), component library package with golden tests, Widgetbook/Storybook-like catalog, accessibility baked into components, dark/light/high-contrast themes, density and text scaling support, and versioned releases of the design system package.

### Q112. Handling multiple platforms (mobile + web + desktop)
Shared domain/data packages; adaptive UI layer (breakpoints, input modes: touch vs mouse/keyboard); conditional imports for platform-specific code (`dart.library.io`/`dart.library.html`); platform-specific packaging/CI; feature parity matrix; automated tests per target. Accept some platform-specific UIs for better UX.

### Q113. Security architecture for Flutter apps
OIDC with PKCE, token storage in secure storage, short-lived access tokens, refresh rotation, attestation (Play Integrity/App Attest) for sensitive APIs, certificate pinning with a rotation plan, secure deep links, minimal permissions, privacy-by-design (data minimization, consent), dependency scanning (`dart pub outdated`, OSV), secrets kept server-side, and regular pen tests per MASVS.

### Q114. Payments, subscriptions and compliance
`in_app_purchase` or RevenueCat for digital goods (store rules require Apple IAP/Google Play Billing), Stripe/Razorpay SDKs for physical goods/services, server-side receipt validation and entitlement sync, restore purchases, handling pending/refunded states, and region-specific regulations (SCA/PSD2, RBI guidelines).

### Q115. Testing strategy at scale
Unit tests for domain/data logic (high volume), widget tests for components and screens (with provider overrides and fake repositories), golden tests for design-system widgets, integration tests for critical journeys on real devices, contract tests against the API (OpenAPI/Pact), performance tests, and accessibility checks. Run in parallel in CI; quarantine flaky tests. See `../06_Testing/040_Testing.md`.

### Q116. Accessibility and inclusive design programme
Semantics audits per screen, automated guideline tests, manual TalkBack/VoiceOver passes, large-text testing (up to 200%+), color-contrast checks, keyboard/switch control support on desktop/web, localized labels, and accessibility acceptance criteria in the Definition of Done.

### Q117. Release engineering
Release branches/trains, version bumping automation, changelog generation, staged rollout (Play percentage, iOS phased release), feature flags (Remote Config/LaunchDarkly), crash/ANR monitoring gates, symbol upload automation, hotfix process, and rollback options (halt rollout, flag off, expedited update, Shorebird patch where allowed).

### Q118. Observability for mobile apps
Structured logging (`logger`), Sentry/Crashlytics for crashes, Firebase Performance/custom traces for startup and key flows, API tracing headers propagated to the backend, product analytics with consent, session replay (privacy-aware), release dashboards (crash-free users, ANR, startup p95), and alerting tied to SLOs.

### Q119. Migration strategies
Add Flutter to an existing native app (add-to-app via `FlutterEngine`/`FlutterFragment`/`FlutterViewController`, engine caching/groups to share resources), or migrate from React Native/Xamarin gradually by feature, from Provider to Riverpod/Bloc via adapters, from Skia-era plugin APIs to current versions. Keep contract tests and feature flags to reduce risk.

### Q120. Add-to-app (brownfield) details
Embed Flutter screens in native apps with a pre-warmed `FlutterEngine`, communicate through Pigeon/method channels, share auth/session, manage navigation handoff, handle memory (each engine has overhead; use `FlutterEngineGroup`), and build Flutter as an AAR/XCFramework for native build systems.

### Q121. Dependency governance
Evaluate packages (maintenance, license, platform support, null safety, popularity, issue health), pin versions, wrap third-party SDKs behind interfaces, run `dart pub outdated` and security scans regularly, maintain an approved-package list, and avoid deep forks.

### Q122. Cost and team productivity
FVM for consistent SDK versions, melos scripts, build caching, code generation discipline, shared design system, fast CI (parallel jobs, caching), preview builds per PR (Firebase App Distribution, Codemagic), onboarding docs, and templates/lints to reduce review friction.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q123. Selecting Flutter for a product (decision framework) *(Must-know)*
Choose Flutter when: pixel-consistent custom UI across platforms, rapid multi-platform delivery with one team, strong animation/graphics needs, and Dart/Flutter talent is available or learnable. Be cautious when: deep platform-native UX/features dominate (widgets, Live Activities, AR), you need to share code heavily with a React web team (React Native may fit better), or the app is mostly web-content. Compare against React Native, Kotlin Multiplatform with native UI, and fully native. Run a time-boxed spike on the 3 riskiest features (performance, platform integrations, accessibility) and decide with data. See `041_React-Native.md`, `043_Kotlin-Android.md`, `044_Swift-iOS.md`.

### Q124. Governance of a multi-app Flutter ecosystem
Shared packages (design system, auth, networking, analytics) versioned and published internally; strict API contracts; automated compatibility tests across apps; coordinated Flutter SDK upgrades; platform team supporting feature teams; architecture decision records; and quality gates (lint, tests, size, performance) enforced centrally.

### Q125. Long-term maintainability
Keep upgrade cadence (Flutter stable every 1-2 releases), minimize native customizations, isolate plugins behind adapters, document platform-specific code, retire unused packages, maintain test coverage on critical flows, and track technical debt with measurable indicators (analyzer warnings, outdated dependencies, flaky tests).

### Q126. Risk management
Risks: plugin abandonment, platform policy changes, performance regressions on low-end devices, Flutter/Dart roadmap shifts, talent availability, native feature gaps. Mitigations: abstraction layers, in-house forks only as last resort, device-lab testing, contributing upstream, contingency plans (native modules), and periodic technology radar reviews.

### Q127. Multi-team delivery model
Feature squads own vertical slices (UI + state + data) within the monorepo; a platform squad owns CI/CD, build tooling, design system and core libraries; clear code ownership (CODEOWNERS); release trains; shared on-call for crash spikes; inner-source contributions with review SLAs.

### Q128. Data privacy and compliance
Consent management (GDPR/DPDP/CCPA, ATT on iOS), data minimization, encryption in transit/at rest, SDK vetting (analytics/ads), privacy manifests for iOS, data safety forms for Play, retention and deletion flows (in-app account deletion), regional hosting, audit logs, and incident response runbooks.

### Q129. Scaling app delivery for millions of users
Backward-compatible APIs for old app versions, feature flags and kill switches, staged rollouts with automatic halt on crash thresholds, CDN for media, server capacity planning for push-triggered spikes, rate limiting and retries with jitter, and per-version analytics to retire old clients (forced upgrade mechanism).

### Q130. AI and ML in Flutter apps
On-device inference (TensorFlow Lite via `tflite_flutter`, ML Kit, Core ML/ONNX through FFI/platform channels), cloud LLM APIs via your backend (never embed secrets), streaming responses (SSE/WebSocket) rendered incrementally, caching and rate limiting, safety/moderation, consent, and offline fallbacks. See `../11_Generative_AI/065_OpenAI-and-Claude-API.md`.

### Q131. Cross-platform strategy beyond Flutter
Consider Kotlin Multiplatform (shared logic, native UI), Compose Multiplatform, React Native, PWAs, and platform-native modules for differentiating features. A hybrid portfolio is common: Flutter for most UI, native modules for platform-heavy parts.

### Q132. Building engineering culture around mobile quality
Performance and crash-free targets in team OKRs, blameless postmortems for incidents, code review checklists (rebuilds, disposal, accessibility), dogfooding builds internally, beta programs, user feedback loops, and regular device-lab sessions on low-end hardware.

### Q133. Evaluating Flutter's roadmap and ecosystem health
Track Flutter/Dart release notes, GitHub activity, pub.dev package health, community adoption, platform support (Impeller, WebAssembly, desktop), and Google/community investment. Maintain exit options by keeping domain logic in pure Dart packages and wrapping UI/plugin dependencies.

### Q134. Communicating trade-offs
Present cost/benefit in business terms: faster multi-platform delivery vs platform-specific polish, hiring and training costs, plugin risk, performance guarantees, and time-to-market. Use prototypes, benchmarks and phased adoption with checkpoints.

---

# 💻 Part 6: Hands-On Tasks & Code

### H1. Riverpod + go_router + dio app skeleton
```dart
// main.dart
void main() => runApp(const ProviderScope(child: App()));

class App extends ConsumerWidget {
  const App({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);
    return MaterialApp.router(routerConfig: router, theme: ThemeData(useMaterial3: true, colorSchemeSeed: Colors.indigo));
  }
}

final authProvider = NotifierProvider<AuthNotifier, AuthState>(AuthNotifier.new);

final routerProvider = Provider<GoRouter>((ref) {
  final auth = ValueNotifier<AuthState>(ref.read(authProvider));
  ref.listen(authProvider, (_, next) => auth.value = next);
  return GoRouter(
    refreshListenable: auth,
    redirect: (ctx, state) {
      final signedIn = auth.value.isSignedIn;
      final atLogin = state.matchedLocation == '/login';
      if (!signedIn && !atLogin) return '/login';
      if (signedIn && atLogin) return '/';
      return null;
    },
    routes: [
      GoRoute(path: '/', builder: (_, __) => const HomePage()),
      GoRoute(path: '/login', builder: (_, __) => const LoginPage()),
      GoRoute(path: '/product/:id', builder: (_, s) => ProductPage(id: s.pathParameters['id']!)),
    ],
  );
});
```

### H2. Repository with remote + local cache and typed errors
```dart
sealed class Failure { const Failure(this.message); final String message; }
class NetworkFailure extends Failure { const NetworkFailure() : super('No connection'); }
class ServerFailure extends Failure { const ServerFailure(super.message); }

class ProductRepository {
  ProductRepository(this._api, this._db);
  final ProductApi _api; final AppDatabase _db;

  Stream<List<Product>> watchProducts() => _db.watchProducts();       // UI observes the DB (source of truth)

  Future<Result<void>> refresh() async {
    try {
      final dtos = await _api.fetchProducts();
      await _db.upsertAll(dtos.map((d) => d.toEntity()).toList());
      return const Ok(null);
    } on DioException catch (e) {
      return Err(e.type == DioExceptionType.connectionError ? const NetworkFailure() : ServerFailure(e.message ?? 'Server error'));
    }
  }
}
```

### H3. Optimized list screen
```dart
class ProductList extends ConsumerWidget {
  const ProductList({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final products = ref.watch(productsProvider);
    return products.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => ErrorView(message: '$e', onRetry: () => ref.invalidate(productsProvider)),
      data: (items) => RefreshIndicator(
        onRefresh: () => ref.refresh(productsProvider.future),
        child: ListView.builder(
          itemCount: items.length,
          itemExtent: 76,
          itemBuilder: (_, i) => ProductTile(key: ValueKey(items[i].id), product: items[i]),
        ),
      ),
    );
  }
}

class ProductTile extends StatelessWidget {
  const ProductTile({super.key, required this.product});
  final Product product;
  @override
  Widget build(BuildContext context) => ListTile(
    leading: CachedNetworkImage(imageUrl: product.thumb, width: 48, height: 48, memCacheWidth: 96, fit: BoxFit.cover),
    title: Text(product.name, maxLines: 1, overflow: TextOverflow.ellipsis),
    subtitle: Text('₹${product.price}'),
    onTap: () => context.push('/product/${product.id}'),
  );
}
```

### H4. Isolate for heavy JSON parsing
```dart
List<Product> _parse(String body) => (jsonDecode(body) as List).map((e) => Product.fromJson(e as Map<String, dynamic>)).toList();

Future<List<Product>> fetchProducts() async {
  final res = await dio.get<String>('/products', options: Options(responseType: ResponseType.plain));
  return Isolate.run(() => _parse(res.data!));        // keeps the UI isolate free
}
```

### H5. Platform channel with Pigeon (concept)
```dart
// pigeons/messages.dart
@HostApi()
abstract class DeviceApi { int getBatteryLevel(); }
```
```bash
dart run pigeon --input pigeons/messages.dart
```
Generates type-safe Dart, Kotlin and Swift stubs; implement `DeviceApi` natively and call it from Dart without string method names.

### H6. Secure token storage and auth interceptor
```dart
const _storage = FlutterSecureStorage(aOptions: AndroidOptions(encryptedSharedPreferences: true));
class TokenStore {
  String? _access;
  Future<void> save(String access, String refresh) async { _access = access; await _storage.write(key: 'refresh', value: refresh); }
  String? get access => _access;
  Future<String?> get refresh => _storage.read(key: 'refresh');
  Future<void> clear() async { _access = null; await _storage.delete(key: 'refresh'); }
}
class AuthInterceptor extends QueuedInterceptor {
  AuthInterceptor(this.dio, this.tokens, this.refreshCall);
  final Dio dio; final TokenStore tokens; final Future<bool> Function() refreshCall;
  @override void onRequest(RequestOptions o, RequestInterceptorHandler h) { if (tokens.access != null) o.headers['Authorization'] = 'Bearer ${tokens.access}'; h.next(o); }
  @override Future<void> onError(DioException e, ErrorInterceptorHandler h) async {
    if (e.response?.statusCode == 401 && await refreshCall()) { return h.resolve(await dio.fetch(e.requestOptions..headers['Authorization'] = 'Bearer ${tokens.access}')); }
    h.next(e);
  }
}
```
`QueuedInterceptor` serializes requests so only one refresh runs at a time.

### H7. Widget test with provider overrides and fake repository
```dart
testWidgets('shows products and handles error', (tester) async {
  await tester.pumpWidget(ProviderScope(
    overrides: [productRepositoryProvider.overrideWithValue(FakeProductRepository([Product(id: '1', name: 'Keyboard', price: 2999, thumb: '')]))],
    child: const MaterialApp(home: Scaffold(body: ProductList())),
  ));
  await tester.pumpAndSettle();
  expect(find.text('Keyboard'), findsOneWidget);
  await tester.tap(find.text('Keyboard'));
  await tester.pumpAndSettle();
  verify(() => mockRouter.push('/product/1')).called(1);
});
```

### H8. Golden test
```dart
testWidgets('AppButton golden', (tester) async {
  await tester.pumpWidget(MaterialApp(theme: appTheme, home: const Scaffold(body: Center(child: AppButton(label: 'Pay now')))));
  await expectLater(find.byType(AppButton), matchesGoldenFile('goldens/app_button.png'));
});
// flutter test --update-goldens   (regenerate intentionally)
```

### H9. GitHub Actions CI/CD for Flutter
```yaml
name: flutter-ci
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with: { channel: stable, cache: true }
      - run: flutter pub get
      - run: dart format --set-exit-if-changed .
      - run: flutter analyze
      - run: flutter test --coverage
      - run: flutter build apk --release --split-per-abi
  ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with: { channel: stable, cache: true }
      - run: flutter pub get && flutter build ios --no-codesign
```

### H10. Search with debounce (Riverpod + stream transformer)
```dart
final queryProvider = StateProvider<String>((ref) => '');
final resultsProvider = FutureProvider.autoDispose<List<Product>>((ref) async {
  final q = ref.watch(queryProvider);
  if (q.length < 2) return const [];
  await Future<void>.delayed(const Duration(milliseconds: 300));            // debounce
  if (!ref.mounted) return const [];                                         // cancelled by newer input (verify API in your Riverpod version)
  return ref.watch(productRepositoryProvider).search(q);
});
```
For cancellation use `ref.onDispose` with a `CancelToken` passed to dio.

---

# 🐞 Part 7: Debugging Scenarios

### D1. `RenderFlex overflowed by N pixels`
A `Row`/`Column` child is larger than available space. Wrap text in `Expanded`/`Flexible`, use `SingleChildScrollView`/`ListView`, `Wrap`, `FittedBox`, or reduce content. Inspect constraints in the widget inspector.

### D2. `Vertical viewport was given unbounded height`
A scrollable (`ListView`) inside a `Column` without bounded height. Wrap with `Expanded`, give a `SizedBox` height, or use `shrinkWrap: true` (careful: disables laziness) / slivers in a `CustomScrollView`.

### D3. `setState() called after dispose()` / `Looking up a deactivated widget's ancestor`
An async callback finished after the widget was removed. Check `if (!mounted) return;` before `setState` or using `context`, cancel timers/subscriptions in `dispose`, and avoid storing `BuildContext` for later.

### D4. `Bad state: No element` / `type 'Null' is not a subtype of type 'String'`
Unsafe assumptions about data (`first` on empty list, JSON missing keys, `!` on null). Use `firstOrNull`, null-aware operators, validate DTOs, and model optional fields explicitly.

### D5. UI doesn't update after state change
Mutating objects in place without notifying (`list.add` without `notifyListeners`/new state), using `read` instead of `watch`, state held in a widget that rebuilds with a new instance, missing `copyWith`/value equality so Riverpod/Bloc sees no change. Emit new immutable states.

### D6. Whole screen rebuilds too often / jank
A high-level `watch`/`context.watch` rebuilds large subtrees, unstable provider creation in `build`, `setState` at the top of the tree. Push state down, use `select`, `const` widgets, and DevTools rebuild tracking.

### D7. `MissingPluginException(No implementation found for method ...)`
Plugin not registered: needs a full rebuild (not hot reload) after adding a plugin, or running on an unsupported platform, or the native side was not compiled (iOS pods not installed). Run `flutter clean && flutter pub get && flutter run`, then `pod install` for iOS.

### D8. Android build failures (Gradle/AGP/Kotlin/JDK)
Version mismatches among Flutter, Gradle, AGP, Kotlin and JDK; plugin `minSdk` conflicts; duplicate classes; Gradle daemon/memory. Align versions per `flutter doctor -v` and plugin requirements, update Gradle wrapper, set `minSdkVersion`, and clean caches (`./gradlew clean`).

### D9. iOS build/signing failures
CocoaPods out of sync (`pod repo update`, `pod install` in `ios/`), architecture issues on Apple Silicon, wrong deployment target, missing signing team/provisioning, entitlements for push/associated domains. Clean derived data and re-run `flutter build ios`.

### D10. Hot reload doesn't reflect changes
Changes in `main()`, static/global initializers, enums, native code, assets or `initState`-time values require hot restart/rebuild. If hot reload errors persist, run `flutter clean`.

### D11. Images not loading / out-of-memory with images
Missing asset declaration in `pubspec.yaml`, wrong path, CORS on web, cleartext HTTP blocked on Android/iOS, huge images decoded at full size. Add assets, use HTTPS, set `cacheWidth/Height`, and use cached network images.

### D12. Keyboard overflow / resizing issues
`Scaffold(resizeToAvoidBottomInset)` behaviour with nested scaffolds, content not scrollable, bottom sheets not accounting for `viewInsets`. Wrap forms in scroll views, use `MediaQuery.viewInsetsOf(context)` and `Padding` accordingly.

### D13. Push notifications not received
Missing APNs key/entitlements, Android 13 permission not requested, notification channel absent, background handler not top-level/annotated (`@pragma('vm:entry-point')`), data-only vs notification messages, battery optimizations, wrong Firebase config for flavor. Test with FCM diagnostics and device logs.

### D14. Deep links open the app but not the right route
Intent filter/associated domains misconfigured, `assetlinks.json`/AASA not served correctly (content type, no redirects), go_router redirect swallowing the link, cold start handling missing. Test with `adb shell am start -a android.intent.action.VIEW -d <url>` and `xcrun simctl openurl`.

### D15. Release build behaves differently from debug
Obfuscation/tree shaking, missing ProGuard rules for plugins, `kReleaseMode` conditional code, asserts disabled, performance differences hiding race conditions, different flavors/configs. Test release/profile builds early and symbolicate crashes using saved symbol files.

---

# 🧩 Part 8: Tricky Questions

### T1. Does Flutter use native widgets?
No. Flutter draws its own widgets with its rendering engine; Material/Cupertino widgets imitate platform looks. Platform views embed real native views when needed.

### T2. Is `setState` bad?
No. It's appropriate for local, ephemeral state. Problems arise when shared or complex state is managed with it, causing prop drilling and large rebuilds.

### T3. Why does `FutureBuilder` refetch repeatedly?
The `future` was created inside `build`, so each rebuild creates a new Future. Create it in `initState` or use a state-management solution/provider.

### T4. `const` vs `final`?
`final` is assigned once at runtime; `const` is a compile-time constant (and `const` constructors create canonicalized immutable instances, enabling widget rebuild skipping).

### T5. Is Dart multi-threaded?
Each isolate is single-threaded with its own memory; concurrency is through isolates and asynchronous I/O. There are no shared-memory threads (except via FFI/native).

### T6. Are `async` functions run in a different thread?
No. `async/await` is cooperative scheduling on the same isolate's event loop; heavy CPU work still blocks the UI unless moved to another isolate.

### T7. Why can a widget's state persist or reset unexpectedly in a list?
Elements are matched by type and key; without proper keys, reordering reuses state on the wrong item. Provide `ValueKey`s.

### T8. Does hot reload run `initState` again?
No. Hot reload preserves State objects; `initState` runs only for newly created states. Changes depending on `initState` need hot restart.

### T9. Is `Container` expensive?
It's a convenience widget composing several others. Use specific widgets (`SizedBox`, `Padding`, `DecoratedBox`, `ColoredBox`) when you need only one behaviour to reduce overhead and clarify intent.

### T10. Can Flutter apps be reverse engineered?
AOT-compiled Dart is harder to read than JS but still extractable (strings, assets, symbols). Obfuscation raises effort only; never embed secrets.

### T11. Why prefer `ListView.builder` over `ListView(children: ...)`?
The builder creates children lazily as they scroll into view; the children variant builds all widgets up front.

### T12. What's the difference between `Navigator 1.0` and `Router`/go_router?
Navigator 1.0 is imperative push/pop; Router (Navigator 2.0) is declarative, supports URLs/deep links and browser history; go_router wraps it with a simpler API.

### T13. Is `BuildContext` safe to use after `await`?
Only if the widget is still mounted: check `context.mounted`. Linting (`use_build_context_synchronously`) flags risky usage.

### T14. Are Riverpod providers global variables?
They're global declarations but state lives in a `ProviderContainer`/`ProviderScope`, so it's scoped, overridable and testable, unlike mutable global singletons.

### T15. Why is my app slow only in debug mode?
Debug mode uses JIT, assertions and extra checks. Evaluate performance in profile/release builds on real devices.

### T16. Does Flutter web replace websites?
Flutter web suits app-like experiences (dashboards, tools) but has limitations for SEO, initial load size and text-heavy content; use standard web stacks for content sites.

### T17. Is it safe to store API keys with `--dart-define`?
No. Values are compiled into the binary and extractable. Keep secrets on a backend and use scoped, revocable client credentials.

### T18. Why do tests need `pumpAndSettle` or `pump`?
Widget tests run in a fake async environment; `pump` advances a frame, `pumpAndSettle` waits until animations/microtasks finish (can hang with infinite animations).

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- **Language?** Dart.
- **Rendering engine?** Impeller (Skia legacy).
- **Everything is a?** Widget.
- **State holder in stateful widgets?** `State` object.
- **Trigger rebuild?** `setState` / notifier change.
- **Lazy list?** `ListView.builder`.
- **Layout rule?** Constraints down, sizes up, parent positions.
- **Null safety operator for default?** `??`.
- **Compile-time constant?** `const`.
- **Dart 3 additions?** Records, patterns, sealed classes.
- **Parallelism?** Isolates.
- **Async types?** Future, Stream.
- **Routing package?** go_router.
- **State management modern picks?** Riverpod, Bloc.
- **HTTP client?** dio / http.
- **Code generation?** build_runner.
- **Local DB?** drift / sqflite / Isar.
- **Secure storage?** flutter_secure_storage.
- **Native communication?** MethodChannel, Pigeon, FFI.
- **Testing types?** Unit, widget, golden, integration.
- **Profiling tool?** Flutter DevTools (profile mode).
- **Version manager?** FVM.
- **CI services?** Codemagic, GitHub Actions, Bitrise.
- **OTA for Dart?** Shorebird (third party).
- **Keys help with?** Preserving state/identity in lists.
- **Hero?** Shared element transition.
- **Theme access?** `Theme.of(context)`.
- **Lifecycle observer?** `WidgetsBindingObserver`.
- **Build commands?** `flutter build apk|appbundle|ipa|web`.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about a Flutter app you built.
STAR: "I built a fintech companion app with Flutter: Riverpod for state, go_router with auth guards, drift for offline data, dio with token-refresh interceptors, Firebase Crashlytics/Analytics, and a custom design system with golden tests. We shipped Android, iOS and web from one codebase; crash-free users were 99.8%, cold start 1.6 s on mid-range Android, and feature delivery time dropped about 35% versus separate native teams."

### P2. Describe a performance issue you fixed.
"Scrolling a product grid dropped to 35 fps on low-end phones. DevTools showed expensive image decoding and rebuilds of the whole grid on every cart change. I added `cacheWidth` and CDN thumbnails, `const`/keyed tiles, narrowed Riverpod subscriptions with `select`, and replaced `Opacity` with `FadeTransition`. Frame times fell below 12 ms p95 and memory dropped 30%."

### P3. How did you handle state management at scale?
"We standardized on Riverpod with feature-scoped notifiers, immutable freezed states, repositories behind providers for easy overriding in tests, and AsyncValue for loading/error handling. This cut bug rates in async flows and made UI tests deterministic."

### P4. How do you decide between Flutter and native?
"I evaluate platform-specific requirements, team skills, UI uniqueness and time-to-market. Flutter fits when we need consistent custom UI across platforms and fast iteration; for heavy platform integration (widgets, AR, system extensions) I use native modules or choose native."

### P5. Describe a release or production incident.
"A bad deploy caused a crash on Android 8 due to a plugin requiring a newer API. We halted the staged rollout at 5%, used Remote Config to disable the feature, shipped a hotfix with a guarded code path and added an Android 8 emulator to CI plus a pre-release device matrix."

### P6. How do you ensure code quality?
"Strict lints, formatting and analysis in CI, unit/widget/golden/integration tests, code reviews with a checklist (disposal, rebuilds, accessibility), architecture rules, dependency review, and release gates on crash/ANR metrics."

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- **Dart:** null safety, classes/mixins, collections, async/await, streams, isolates, records, patterns, sealed classes, extension types, generics, lints.
- **Flutter basics:** widgets, Stateless/Stateful, lifecycle, `BuildContext`, keys, three trees, hot reload/restart, build modes.
- **UI:** layout and constraints, Material 3/Cupertino, theming, slivers, forms, gestures, animations, custom painting, responsive/adaptive design, accessibility, i18n.
- **State management:** setState, InheritedWidget, Provider, Riverpod, Bloc/Cubit, architecture (MVVM/clean), dependency injection.
- **Data:** networking (dio), serialization (freezed/json_serializable), storage (shared_preferences, secure storage, drift/sqflite, Isar/Hive), caching, offline-first.
- **Platform:** platform channels, Pigeon, FFI, plugins, platform views, permissions, push notifications, deep links, background work.
- **Quality:** unit/widget/golden/integration tests, mocking, CI/CD, flavors, release signing, crash reporting, performance profiling.
- **Platforms:** Android, iOS, web, desktop, add-to-app.
- **Leadership:** technology selection, governance, upgrade strategy, release engineering, team models.

## Mixed topics
- Flutter + React Native (`041_React-Native.md`) and native stacks (`043_Kotlin-Android.md`, `044_Swift-iOS.md`).
- Flutter + backend APIs (`../03_Backend/035_GraphQL-and-REST-APIs.md`): pagination, idempotency, GraphQL clients (`graphql_flutter`, `ferry`).
- Flutter + realtime (`../03_Backend/037_WebSockets-and-Realtime.md`) and queues/push pipelines (`../03_Backend/038_Message-Queues.md`).
- Flutter + Firebase/Supabase (`../03_Backend/034_Firebase-and-Supabase.md`): auth, Firestore, storage, rules.
- Flutter + security (`../03_Backend/036_Authentication-and-Security.md`): OIDC PKCE, pinning, secure storage.
- Flutter + testing (`../06_Testing/040_Testing.md`) and DevOps (`../07_DevOps_and_Cloud/047_CI-CD-and-DevOps.md`).
- Flutter + AI (`../11_Generative_AI/065_OpenAI-and-Claude-API.md`): chat UIs, on-device ML.

---

# 🔬 Part 12: Flutter Internals

### I1. Flutter architecture layers
**Framework (Dart)**: widgets, rendering, animation, gestures, foundation. **Engine (C++)**: Dart runtime, Impeller/Skia, text layout (libtxt/HarfBuzz), platform channels, accessibility. **Embedder (platform-specific)**: creates the surface, event loop, input and lifecycle integration for Android/iOS/web/desktop.

### I2. Dart VM modes
**JIT** (debug): incremental compilation enabling hot reload. **AOT** (profile/release): ahead-of-time compiled machine code, fast startup, no JIT. **Dart-to-JS/Wasm** for web (dart2js, dart2wasm). Tree shaking removes unused code in release.

### I3. Event loop and microtasks
Each isolate has a **microtask queue** (run first, until empty) and an **event queue** (I/O, timers, user input). `Future(() {})` schedules on the event queue; `scheduleMicrotask` on the microtask queue; `await` continues in a microtask when the awaited future completes.

### I4. Frame scheduling
`SchedulerBinding` handles vsync callbacks: `beginFrame` (animation tickers, transient callbacks), `drawFrame` (build → layout → compositing bits → paint → semantics), then post-frame callbacks. `setState` marks an element dirty and schedules a frame.

### I5. Element reconciliation
When a widget rebuilds, the parent Element's `updateChild` compares old and new widgets with `Widget.canUpdate` (same `runtimeType` and `key`). If true, the Element updates in place (cheap); otherwise it unmounts and creates a new Element/RenderObject subtree (expensive, state lost).

### I6. Layout protocol (RenderBox)
`performLayout` receives `BoxConstraints`, lays out children with derived constraints, sets `size`, and positions children via `parentData`. Relayout boundaries limit propagation; intrinsic size queries are O(n) per call and can cascade, so avoid `IntrinsicHeight/Width` in long lists.

### I7. Painting and layers
RenderObjects paint into `PaintingContext` creating layers (`OffsetLayer`, `ClipLayer`, `OpacityLayer`). `RepaintBoundary` creates a separate layer so repaints don't cascade. Compositing sends the layer tree to the engine's rasterizer.

### I8. Impeller internals (conceptual)
A rendering runtime using Metal/Vulkan (and OpenGL fallback) with a fixed set of precompiled shaders at engine build time; avoids runtime shader compilation stalls; uses tessellation and entity passes; supports advanced blending and text rendering consistently across platforms.

### I9. Platform channel mechanics
Messages are serialized with `StandardMessageCodec` (binary), dispatched on the platform thread, with replies returned asynchronously. Channels are named, and calls cross the Dart–native boundary, so keep payloads small. FFI avoids serialization by calling C symbols directly.

---

# 📊 Part 13: Reference Tables

### State management comparison
| | Provider | Riverpod | Bloc | setState | GetX |
|---|---|---|---|---|---|
| Learning curve | Low | Medium | Medium-high | Lowest | Low |
| Compile-time safety | Medium | High | High | N/A | Low |
| Testability | Good | Excellent | Excellent | Hard for shared state | Mixed |
| Boilerplate | Low | Low-medium | Higher | Minimal | Low |
| Best for | Small/medium apps | Most modern apps | Large, event-driven apps | Local UI state | Rapid prototypes |

### Build modes
| Mode | Compilation | Use |
|---|---|---|
| Debug | JIT | Development, hot reload |
| Profile | AOT + profiling hooks | Performance analysis |
| Release | AOT, optimized | Production |

### Storage options
| Option | Type | Secure | Best for |
|---|---|---|---|
| shared_preferences | Key-value | No | Settings |
| flutter_secure_storage | Key-value | Yes | Tokens |
| sqflite / drift | SQL | With SQLCipher | Relational/offline |
| Isar / Hive / ObjectBox | NoSQL objects | Optional encryption | Fast local objects |
| Files | Binary/text | No | Media, caches |

### Navigation options
| | Navigator 1.0 | go_router | auto_route | beamer |
|---|---|---|---|---|
| Style | Imperative | Declarative (URL) | Codegen typed | Declarative |
| Deep links | Manual | Built in | Built in | Built in |
| Guards | Manual | `redirect` | Guards | Guards |
| Maintained by | Flutter | Flutter team | Community | Community |

### Animation choices
| Need | Use |
|---|---|
| Simple property change | Implicit (`AnimatedContainer`, etc.) |
| Custom timeline | `AnimationController` + `Tween` |
| Page/shared element | `Hero`, `PageRouteBuilder` |
| Designer assets | Lottie, Rive |
| Custom drawing | `CustomPainter`, shaders |

### Version highlights (verify)
| Item | Notes |
|---|---|
| Dart 3.0 | Sound null safety only, records, patterns, class modifiers |
| Flutter 3.10+ | Impeller on iOS default, Material 3 default (3.16) |
| Impeller on Android | Default in recent stable releases (Vulkan, GLES fallback) |
| Wasm for web | Skwasm/dart2wasm available (stable in later releases) |
| Dart macros | Experimental/paused (verify status before relying) |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
```dart
void main() {
  print(1);
  Future(() => print(2));
  scheduleMicrotask(() => print(3));
  print(4);
}
```
**Output:** `1 4 3 2` (sync code first, then microtask, then event-queue future).

### O2.
```dart
String? s;
print(s?.length ?? -1);
print(s!.length);
```
**Output:** `-1`, then a runtime `Null check operator used on a null value` error.

### O3.
```dart
final a = const [1, 2];
final b = const [1, 2];
print(identical(a, b));
```
**Output:** `true` (const instances are canonicalized).

### O4.
```dart
int count = 0;
setState(() => count++);
setState(() => count++);
```
**Result:** `count` becomes 2 after both updates (mutation inside the closure each time); a rebuild occurs once the frame runs.

### O5.
`FutureBuilder(future: fetch(), ...)` inside `build`.
**Result:** `fetch()` is called on every rebuild, causing repeated network calls and flickering.

### O6.
```dart
Row(children: [Text('A very long text ...'), Icon(Icons.star)])
```
**Result:** overflow warning/stripes if text exceeds available width; wrap text in `Expanded`/`Flexible`.

### O7.
```dart
List<int> xs = [1, 2, 3];
final ys = xs..add(4);
print(xs.length);
```
**Output:** `4` (cascade returns the same list; `ys` and `xs` reference the same object).

### O8.
```dart
switch (value) { case int i when i > 10: print('big'); case int(): print('int'); default: print('other'); }
```
**Result (Dart 3):** pattern matching with guard; no fall-through; prints `big` for 11, `int` for 5.

### O9.
Reordering a list of stateful tiles without keys.
**Result:** state (like checkbox or text) stays with the position, not the item, so values appear swapped; add `ValueKey(item.id)`.

### O10.
Calling `Navigator.of(context)` after `await` in an unmounted widget.
**Result:** error "Looking up a deactivated widget's ancestor is unsafe"; guard with `if (!context.mounted) return;`.

### O11.
`ListView(children: List.generate(10000, (i) => Tile(i)))`.
**Result:** all 10,000 widgets are built up front (slow start, high memory); use `ListView.builder`.

### O12.
```dart
await Future.wait([a(), b()]); // a takes 2s, b takes 3s
```
**Result:** completes in ~3 s (parallel), not 5 s; if one throws, `Future.wait` fails fast unless `eagerError: false`.

---

# ✅ Part 15: MCQs

**1. Flutter apps are written in:**
A) Kotlin  B) Dart  C) JavaScript  D) Swift
**Answer: B**

**2. Which widget holds mutable state?**
A) StatelessWidget  B) StatefulWidget (via its State)  C) Container  D) Text
**Answer: B**

**3. Hot reload preserves:**
A) Nothing  B) App state  C) Only assets  D) Native code changes
**Answer: B**

**4. Which creates lazily built scrollable lists?**
A) Column  B) ListView.builder  C) Row  D) Stack
**Answer: B**

**5. The rule of Flutter layout is:**
A) Sizes go down, constraints go up  B) Constraints go down, sizes go up  C) Parents ignore children  D) Everything is absolute
**Answer: B**

**6. `const` constructors help with:**
A) Network calls  B) Skipping unnecessary rebuilds / canonicalization  C) Encryption  D) Routing
**Answer: B**

**7. Which runs CPU-heavy work off the UI thread?**
A) `Future.delayed`  B) `Isolate.run` / `compute`  C) `setState`  D) `await`
**Answer: B**

**8. Which package is the officially maintained declarative router?**
A) go_router  B) get_it  C) dio  D) freezed
**Answer: A**

**9. `context.read` should be used:**
A) Inside `build` for reactive values  B) In callbacks/event handlers  C) Never  D) Only in tests
**Answer: B**

**10. Impeller's main benefit:**
A) Smaller APKs only  B) Predictable performance by precompiled shaders  C) Web rendering  D) Dart compilation
**Answer: B**

**11. Where to store refresh tokens?**
A) shared_preferences  B) flutter_secure_storage  C) Plain files  D) Widget state
**Answer: B**

**12. Which test type compares images of widgets?**
A) Unit  B) Golden  C) Integration  D) Load
**Answer: B**

**13. `Key`s are important for:**
A) Styling  B) Preserving state/identity when widgets move  C) Networking  D) Encryption
**Answer: B**

**14. What does `?.` do in Dart?**
A) Throws if null  B) Null-aware member access  C) Casts type  D) Defines optional parameter
**Answer: B**

**15. Which tool profiles Flutter apps?**
A) Flutter DevTools  B) Postman  C) ESLint  D) Webpack
**Answer: A**

**16. Platform channels communicate between:**
A) Dart and native platform code  B) Two Dart isolates only  C) Flutter and Firebase only  D) Widgets and Elements
**Answer: A**

**17. Which command creates a release Android App Bundle?**
A) `flutter build apk --debug`  B) `flutter build appbundle`  C) `flutter run`  D) `flutter pub get`
**Answer: B**

**18. A `sealed class` in Dart 3 enables:**
A) Mutable fields  B) Exhaustive switch checks  C) Multiple inheritance  D) Dynamic typing
**Answer: B**

**19. Riverpod `ref.watch` is used to:**
A) Read once without listening  B) Subscribe and rebuild on change  C) Dispose providers  D) Navigate
**Answer: B**

**20. Best way to avoid using a stale `BuildContext` after `await`:**
A) Ignore it  B) Check `context.mounted` / `mounted`  C) Store context globally  D) Use `Future.delayed`
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

1. **Creating Futures/Streams inside `build`** (refetching on each rebuild).
2. **Not disposing controllers, focus nodes, timers and subscriptions.**
3. **Using `context` after `await` without `mounted` checks.**
4. **Huge `build` methods and missing `const`** causing unnecessary rebuilds.
5. **Business logic inside widgets** (hard to test).
6. **`ListView(children: bigList)` instead of builder constructors.**
7. **Missing keys on reorderable/stateful list items.**
8. **Blocking the UI isolate with heavy parsing/crypto.**
9. **Storing tokens in `shared_preferences`** or embedding secrets via `--dart-define`.
10. **Using `watch`/`select` too broadly** (rebuild storms) or `read` for reactive data.
11. **Mutating state objects in place** without emitting new state.
12. **Ignoring loading/error/empty states.**
13. **Overusing `GlobalKey` and singletons.**
14. **Profiling in debug mode.**
15. **Skipping platform-specific testing (Android versions, iOS devices).**
16. **Heavy use of `Opacity`/`ClipRRect`/`saveLayer` in lists.**
17. **Not handling text scaling and accessibility semantics.**
18. **Unmaintained or low-quality packages** without evaluation.
19. **No flavors/environments**, leading to prod/dev config mix-ups.
20. **No crash reporting/symbol upload for obfuscated builds.**
21. **Delaying Flutter/dependency upgrades** until they become risky migrations.
22. **Testing only happy paths** (no network failure, permission denial, offline).

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You explain the **three trees, constraints model and rendering pipeline**, and use them to diagnose layout/perf issues.
- You pick and apply **state management** deliberately (Riverpod/Bloc) with immutable states, selectors and testable notifiers.
- You structure apps with **clean boundaries** (feature modules, repositories, DTO mappers) and dependency injection.
- You profile in **profile mode on low-end devices**, fix jank (rebuilds, images, isolates, saveLayer) and set performance budgets.
- You handle **offline-first, sync, caching and error modelling** (sealed failures) professionally.
- You integrate **platform code** safely (Pigeon, FFI, plugins) and know when native is the right tool.
- You secure apps (secure storage, PKCE, pinning trade-offs, no embedded secrets) and respect store policies and privacy rules.
- You automate **testing and release** (unit/widget/golden/integration, CI/CD, flavors, staged rollouts, crash gates).
- You make **honest cross-platform trade-offs** (Flutter vs React Native vs native) and plan upgrades.
- You bring measured outcomes (frame times, crash-free rate, startup, delivery speed).

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Core facts
```
Dart: sound null safety • async/await • isolates • records/patterns/sealed (Dart 3)
Flutter: everything is a widget • Widget (config) → Element (instance) → RenderObject (layout/paint)
Layout: constraints go down, sizes go up, parent positions • Row/Column/Stack/Expanded/Flexible
Build modes: debug (JIT) • profile (perf) • release (AOT) • hot reload keeps state, hot restart resets it
```

### Performance checklist
`const` everywhere • small widgets • keys for list items • `ListView.builder`/slivers • cacheWidth/Height + cached images • avoid `Opacity`/`saveLayer` in lists • isolates for CPU work • `select`/selectors • dispose resources • profile mode on real devices.

### State/data checklist
Riverpod/Bloc with immutable states • repository pattern • DTO ↔ domain mappers • dio interceptors (auth, retry) • drift/Isar for offline • secure storage for tokens • typed failures (sealed) • AsyncValue loading/error/empty.

### Release checklist
Flavors + app IDs • signing (keystore/certs) • `flutter build appbundle|ipa` • obfuscation + symbol upload • staged rollout • crash/ANR monitoring • Remote Config kill switches • store privacy forms.

### Testing checklist
Unit (domain/data) • widget (provider overrides) • golden (design system) • integration (critical journeys) • accessibility guidelines • CI with analyze/format/test/coverage.

### Interview strategy
1. Clarify platforms, UX uniqueness, offline needs, team skills and timelines.
2. Justify Flutter vs alternatives and outline architecture (state, navigation, data).
3. Show key code patterns (state holder, repository, async UI states).
4. Address performance, offline, security and accessibility.
5. Describe testing, CI/CD and release strategy.
6. Share a measured story (frame times, crash-free rate, delivery speed).

### Final checklist before the interview
- [ ] Explain Dart null safety, async (Future/Stream), isolates and Dart 3 features.
- [ ] Explain widget/element/render trees, keys, `BuildContext` and lifecycle.
- [ ] Solve layout problems with the constraints model; build responsive layouts.
- [ ] Compare state management options and implement with Riverpod or Bloc.
- [ ] Build a data layer (dio, serialization, drift/secure storage, offline-first).
- [ ] Use go_router with auth guards and deep links.
- [ ] Profile and fix performance issues (rebuilds, images, isolates).
- [ ] Integrate native code (platform channels/Pigeon/FFI) when needed.
- [ ] Write unit, widget, golden and integration tests; set up CI/CD and releases.
- [ ] Prepare a project story, a performance story and an incident/rollback story with numbers.
