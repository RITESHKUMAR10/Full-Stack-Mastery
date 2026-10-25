# React Native Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **React Native 0.74–0.79+ (New Architecture default since 0.76)**, **React 18/19**, **Hermes** engine, **Expo SDK 51–53** (Expo Router v3/v4, EAS Build/Submit/Update, Expo Modules API), **React Navigation 6/7**, **TypeScript 5**, and common libraries (**Reanimated 3**, **Gesture Handler 2**, **FlashList**, **MMKV**, **TanStack Query**, **Zustand/Redux Toolkit**). React Native moves fast: Old Architecture (the asynchronous bridge) is legacy; Fabric, TurboModules, JSI and Codegen are the standard. Anything marked "verify" should be checked in the official docs (reactnative.dev, docs.expo.dev) for your exact version. Examples use the sample name **Ritesh Kumar**.
> This file covers React Native fundamentals (components, styling with Flexbox, platform differences), architecture (JSI, Fabric, TurboModules, Hermes, Codegen, the old bridge), Expo vs bare workflow, navigation, state management and data fetching, lists and performance, animations and gestures, native modules and permissions, storage and offline-first, push notifications and deep links, testing (Jest, RNTL, Detox, Maestro), build/release (EAS, Fastlane, OTA updates), security, accessibility, debugging and production practice. Related topics: React in `../02_Frontend/008_React.md`, TypeScript in `../02_Frontend/006_TypeScript.md`, the Flutter alternative in `042_Flutter.md`, native stacks in `043_Kotlin-Android.md` and `044_Swift-iOS.md`, testing in `../06_Testing/040_Testing.md`, security in `../03_Backend/036_Authentication-and-Security.md`, CI/CD in `../07_DevOps_and_Cloud/047_CI-CD-and-DevOps.md`.

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
- [Part 12: React Native Internals](#-part-12-react-native-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is React Native? *(Must-know)*
An open-source framework by Meta for building **native iOS and Android apps with JavaScript/TypeScript and React**. Your JS code describes the UI with React components; React Native renders them as **real native views** (`UIView` on iOS, `android.view.View` on Android), not a WebView. "Learn once, write anywhere": share most logic and a large part of the UI between platforms while still accessing native APIs.

### Q2. React Native vs React (web)
Same React model (components, props, state, hooks, JSX), different primitives. Web uses DOM elements (`div`, `span`, `img`); React Native uses `View`, `Text`, `Image`, `ScrollView`, etc. Styling is JS objects (no CSS files, no cascade), layout is Flexbox only, navigation is not URL-based by default, and there is no `window`/`document`. See `../02_Frontend/008_React.md`.

### Q3. React Native vs native vs hybrid vs Flutter *(Must-know)*
| | Native (Swift/Kotlin) | React Native | Flutter | Hybrid WebView (Cordova/Ionic) |
|---|---|---|---|---|
| Language | Swift / Kotlin | JS/TS | Dart | JS + HTML/CSS |
| UI | Platform widgets | Platform widgets via React | Own renderer (Skia/Impeller) | Web in WebView |
| Performance | Best | Near-native for most apps | Near-native | Lowest |
| Code sharing | None | High (+ web via RN Web) | High | Very high |
| Native API access | Full | Via native modules | Via platform channels | Via plugins |
| Hiring pool | Platform specialists | Large JS/React pool | Smaller Dart pool | Web devs |
See `042_Flutter.md`, `043_Kotlin-Android.md`, `044_Swift-iOS.md`.

### Q4. Expo vs bare React Native *(Must-know)*
**Expo** is a framework and toolchain on top of React Native: file-based routing (Expo Router), a large SDK of native modules (camera, notifications, secure store), **EAS** cloud builds and OTA updates, config plugins, and a great dev experience. Since RN 0.75+ the official docs recommend starting with a framework like Expo. **Bare** (React Native CLI) gives direct control of `android/` and `ios/` projects. Modern Expo supports custom native code through **development builds** and config plugins, so "Expo vs bare" is no longer "limited vs full".

### Q5. Create and run an app
```bash
npx create-expo-app@latest MyApp
cd MyApp
npx expo start              # press i (iOS simulator), a (Android emulator), or scan QR with Expo Go
```
```bash
# bare CLI (community)
npx @react-native-community/cli init MyApp
npx react-native run-android      # or run-ios
```
Requirements: Node LTS, Android Studio (SDK, emulator), Xcode (macOS only) for iOS builds.

### Q6. Core components
`View` (container), `Text` (all text must be inside), `Image`, `ScrollView`, `FlatList`/`SectionList` (virtualized lists), `TextInput`, `Pressable`/`TouchableOpacity`, `Button`, `Switch`, `ActivityIndicator`, `Modal`, `SafeAreaView` (use `react-native-safe-area-context`), `KeyboardAvoidingView`, `StatusBar`, `Platform`, `Dimensions`.

### Q7. A basic component
```tsx
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello Ritesh Kumar</Text>
      <Text>Count: {count}</Text>
      <Pressable style={styles.button} onPress={() => setCount((c) => c + 1)}>
        <Text style={styles.buttonText}>Increment</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  title: { fontSize: 22, fontWeight: "600" },
  button: { backgroundColor: "#4f46e5", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  buttonText: { color: "white", fontWeight: "600" },
});
```

### Q8. Styling and Flexbox basics *(Must-know)*
Styles are JavaScript objects (`StyleSheet.create`). Layout uses Flexbox with **`flexDirection: "column"` by default** (web default is row). Key props: `flex`, `flexDirection`, `justifyContent` (main axis), `alignItems` (cross axis), `alignSelf`, `flexWrap`, `gap`, `padding`/`margin`, `position: "absolute"`. Units are density-independent pixels (dp), numbers without `px`. No cascading, no `em/rem`, no media queries (use `useWindowDimensions`).

### Q9. `StyleSheet.create` vs inline styles
`StyleSheet.create` validates styles in development and groups them; in modern RN the runtime performance difference is small, but it keeps code organized and typed. Avoid creating new style objects on every render for hot paths (or memoize).

### Q10. Platform-specific code
```tsx
import { Platform } from "react-native";
const shadow = Platform.select({ ios: { shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 6 }, android: { elevation: 4 } });
if (Platform.OS === "ios") { /* iOS only */ }
```
File extensions: `Component.ios.tsx` / `Component.android.tsx` / `Component.native.tsx` / `Component.web.tsx` are resolved by the bundler (Metro).

### Q11. Props, state and hooks
Same as React: props are read-only inputs, state is local data, hooks (`useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`, `useContext`, `useReducer`) manage logic. Custom hooks encapsulate reusable behaviour (e.g., `useDebounce`, `useNetworkStatus`).

### Q12. Handling user input
`TextInput` with controlled state (`value`, `onChangeText`), `keyboardType`, `secureTextEntry`, `autoCapitalize`, `returnKeyType`, `onSubmitEditing`.
```tsx
<TextInput value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" placeholder="Email" />
```
Use `KeyboardAvoidingView` (`behavior="padding"` on iOS) so the keyboard doesn't hide inputs.

### Q13. Touchables: `Pressable` vs `TouchableOpacity` vs `Button`
`Pressable` is the modern, flexible primitive (press states via `({ pressed }) => ...`, hit slop, long press). `TouchableOpacity`/`TouchableHighlight` are older wrappers. `Button` is a minimal platform-styled button (limited customization).

### Q14. Lists: FlatList basics *(Must-know)*
```tsx
<FlatList
  data={users}
  keyExtractor={(u) => u.id}
  renderItem={({ item }) => <UserRow user={item} />}
  ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: "#eee" }} />}
  onEndReached={loadMore}
  onEndReachedThreshold={0.5}
  refreshing={refreshing}
  onRefresh={refresh}
  ListEmptyComponent={<Text>No users</Text>}
/>
```
`FlatList` virtualizes: renders only items near the viewport. Never use `ScrollView` + `map` for long lists. Provide stable `keyExtractor`.

### Q15. ScrollView vs FlatList
`ScrollView` renders all children at once (fine for short, fixed content). `FlatList` renders lazily and recycles windows: use for long or dynamic lists. Nesting a `FlatList` inside a vertical `ScrollView` breaks virtualization; use `ListHeaderComponent`/`ListFooterComponent` instead.

### Q16. Images
```tsx
<Image source={{ uri: "https://example.com/a.jpg" }} style={{ width: 100, height: 100 }} resizeMode="cover" />
<Image source={require("./assets/logo.png")} />
```
Remote images need explicit width/height. Use `expo-image` (caching, placeholders, blurhash) or FastImage for better performance. Provide `accessibilityLabel`.

### Q17. Navigation overview *(Must-know)*
Mobile navigation is a stack/tab/drawer of screens with transitions. Two main options: **React Navigation** (JS-defined navigators, huge ecosystem) and **Expo Router** (file-based routing on top of React Navigation). Common navigators: stack (push/pop), bottom tabs, drawer, modal presentation, nested navigators.

### Q18. React Navigation basics
```tsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

type RootStackParamList = { Home: undefined; Profile: { userId: string } };
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
// navigation.navigate("Profile", { userId: "42" });  route.params.userId
```
Use `native-stack` for native transitions and performance.

### Q19. Expo Router basics
File-based routes in `app/`: `app/index.tsx` (/), `app/profile/[id].tsx` (dynamic), `app/(tabs)/_layout.tsx` (tab group), `app/_layout.tsx` (root layout). Navigate with `<Link href="/profile/42" />` or `router.push("/profile/42")`; read params with `useLocalSearchParams()`. Supports typed routes, deep linking automatically, API routes (server) and static rendering for web.

### Q20. Fetching data
```tsx
useEffect(() => {
  const controller = new AbortController();
  fetch("https://api.example.com/users", { signal: controller.signal })
    .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
    .then(setUsers).catch((e) => e.name !== "AbortError" && setError(e));
  return () => controller.abort();
}, []);
```
Prefer **TanStack Query** for caching, retries, refetch on focus/reconnect, pagination and optimistic updates. `fetch` is built in; Axios is optional.

### Q21. State management options
Local state (`useState`/`useReducer`), Context (low-frequency global values), **Zustand** (small, fast), **Redux Toolkit** (structured, devtools, large apps), **Jotai/Recoil** (atomic), **TanStack Query** (server state). Separate **server state** (remote data, cache) from **client state** (UI, form drafts).

### Q22. Storage options *(Must-know)*
| Storage | Use for | Notes |
|---|---|---|
| AsyncStorage | Small non-sensitive key-value | Async, unencrypted, ~6 MB Android default limit |
| MMKV | Fast key-value, sync API | Great default for settings/cache |
| SecureStore / Keychain / Keystore | Tokens, secrets | Hardware-backed encryption |
| SQLite (expo-sqlite, op-sqlite), WatermelonDB, Realm | Structured/offline data | Queries, relations, sync |
| File system (expo-file-system) | Files, downloads | |
Never store access/refresh tokens in plain AsyncStorage.

### Q23. Permissions
Declare in native config (`Info.plist` usage descriptions, `AndroidManifest.xml`) and request at runtime (`expo-camera`, `expo-location`, `react-native-permissions`). Handle `granted`, `denied`, `blocked/never_ask_again` (link to settings). Explain why before asking (pre-permission prompt).

### Q24. Debugging basics
React Native DevTools (Chrome DevTools-based, replaces Flipper/remote debugging), `console.log` in Metro, LogBox, React DevTools profiler, Reactotron, Xcode/Android Studio for native logs (`adb logcat`), network inspection, breakpoints. Shake device/`m`/`j` in Metro CLI to open dev menu.

### Q25. Metro bundler and Fast Refresh
Metro bundles JS, supports Fast Refresh (preserves state on edits), asset handling, platform extensions and tree-shaking improvements. Reset cache with `npx expo start -c` / `--reset-cache` when module resolution seems stale.

### Q26. Hermes
The default JS engine: **ahead-of-time bytecode compilation**, faster startup, lower memory, smaller app size. Supports modern JS features; check `global.HermesInternal`. Replaces JavaScriptCore for most apps.

### Q27. Environment variables and config
Expo: `EXPO_PUBLIC_*` variables are inlined into the client bundle (public!); `app.config.ts` for dynamic config and EAS secrets for build-time values. Never embed secrets in the app: anything shipped can be extracted. Keep API keys server-side behind your backend. See `../03_Backend/036_Authentication-and-Security.md`.

### Q28. TypeScript in React Native
Enabled by default in templates. Type props, navigation params (`RootStackParamList`), API responses (Zod to validate at runtime), and hooks. See `../02_Frontend/006_TypeScript.md`.

### Q29. Common project structure
```
app/ (Expo Router) or src/screens, src/navigation
src/components, src/hooks, src/services (api), src/store, src/utils
src/theme (colors, spacing, typography)
assets/ (images, fonts)
app.config.ts, eas.json, babel.config.js, metro.config.js
```
Feature-based folders scale better than type-based ones for large apps.

### Q30. Fonts and assets
Expo: `useFonts` from `expo-font` or config plugin; bare: link fonts in native projects. Keep image sizes small, provide @2x/@3x variants or use `expo-image`. Use SVG via `react-native-svg`.

### Q31. Dark mode and theming
`useColorScheme()` returns `light | dark`; build a theme context with tokens (colors, spacing, typography); respect system settings; test contrast. Libraries: Restyle, Unistyles, NativeWind (Tailwind for RN), Tamagui.

### Q32. Safe areas and notches
Use `SafeAreaProvider` + `useSafeAreaInsets()` (react-native-safe-area-context) to pad content around notches, status bars and home indicators. Avoid hard-coded top paddings. Edge-to-edge is default on Android 15+/newer RN templates (verify).

### Q33. Keyboard handling
`KeyboardAvoidingView`, `keyboardShouldPersistTaps="handled"` on scroll views, `react-native-keyboard-controller` for smooth, cross-platform behaviour, dismiss on tap outside (`Keyboard.dismiss()`), and focus management between inputs.

### Q34. Handling forms
React Hook Form (uncontrolled-friendly, performant) + Zod resolver; controlled `TextInput` via `Controller`. Show inline errors, disable submit while pending, handle keyboard submit and accessibility labels.

### Q35. Networking states and errors
Handle loading, error, empty and offline states explicitly; use `@react-native-community/netinfo` for connectivity; timeouts and retries; user-friendly error messages; skeleton loaders. Never assume the network is available.

### Q36. App lifecycle
`AppState` (`active`, `background`, `inactive`) to pause work or refresh data on resume; navigation focus events (`useFocusEffect`) for screen-level effects; handle low-memory and background kills (state may be lost; persist critical drafts).

---

# 🔵 Part 2: Junior (1–3 years)

### Q37. How React Native works: old architecture (bridge) *(Must-know)*
Three threads: **JS thread** (React, business logic), **UI/main thread** (native views), and **shadow thread** (Yoga layout). The JS and native sides communicated through an **asynchronous, batched, JSON-serialized bridge**. Drawbacks: serialization overhead, async-only calls, startup cost (all native modules initialized eagerly), jank with large payloads or fast gestures. This is the legacy design.

### Q38. The New Architecture: JSI, Fabric, TurboModules, Codegen *(Must-know)*
| Piece | What it does |
|---|---|
| **JSI** (JavaScript Interface) | C++ layer letting JS hold direct references to native (host) objects/functions: synchronous calls, no JSON bridge |
| **Fabric** | New renderer: synchronous layout, concurrent React features (Suspense, transitions), shared C++ shadow tree, better view flattening |
| **TurboModules** | Lazily-loaded native modules with typed JSI bindings (faster startup) |
| **Codegen** | Generates C++/native glue from typed specs (TypeScript/Flow) to guarantee type-safe JS↔native interfaces |
| **Bridgeless mode** | Removes the legacy bridge entirely |
New Architecture is the default from RN 0.76; most popular libraries support it (verify any critical dependency).

### Q39. Expo workflows: Expo Go, development builds, prebuild
**Expo Go** is a sandbox app with a fixed set of native modules (quick demos). A **development build** (`expo-dev-client`) is your own app binary containing your native dependencies plus dev tools: the standard for real projects. **Continuous Native Generation (CNG)**: `npx expo prebuild` generates `android/` and `ios/` from `app.json`/config plugins, so native folders can stay out of git.

### Q40. EAS (Expo Application Services)
`eas build` (cloud iOS/Android builds with managed credentials), `eas submit` (App Store/Play Store upload), `eas update` (OTA JS updates), CI/workflow integrations. Config in `eas.json` with build profiles (`development`, `preview`, `production`).
```json
{ "build": { "development": { "developmentClient": true, "distribution": "internal" },
             "preview": { "distribution": "internal" },
             "production": { "autoIncrement": true } },
  "submit": { "production": {} } }
```

### Q41. Config plugins
Functions that modify native projects during prebuild (add permissions, entitlements, Gradle/Podfile changes, URL schemes) without manual native edits. Libraries ship plugins; you can write custom ones. This keeps native configuration declarative and upgrade-friendly.

### Q42. Navigation patterns: auth flow and deep links *(Must-know)*
Auth flow: render different navigators based on auth state (`isSignedIn ? <AppStack/> : <AuthStack/>`) so back navigation can't reach protected screens. Nested navigators: tabs containing stacks. Deep links map URLs to screens.
```tsx
const linking = { prefixes: ["myapp://", "https://app.example.com"], config: { screens: { Profile: "user/:userId", Home: "" } } };
<NavigationContainer linking={linking} fallback={<Splash />}>
```
For universal/app links host `apple-app-site-association` and `assetlinks.json`.

### Q43. Navigation lifecycle: focus vs mount
Screens in a stack stay mounted when you navigate forward, so `useEffect` doesn't re-run on return. Use `useFocusEffect` (or `navigation.addListener("focus")`) to refresh data when a screen becomes visible, and clean up on blur.
```tsx
useFocusEffect(useCallback(() => { refetch(); return () => cancelPolling(); }, []));
```

### Q44. Passing data between screens
Route params for small serializable values (ids, filters), not whole objects or functions. Fetch details on the destination screen by id (or from a shared cache like TanStack Query). For results back to a previous screen, use shared state/params with `navigation.navigate({ name, params, merge: true })`.

### Q45. TanStack Query in React Native
```tsx
const { data, isPending, error, refetch } = useQuery({ queryKey: ["user", id], queryFn: () => api.getUser(id), staleTime: 60_000 });
const mutation = useMutation({ mutationFn: api.updateUser, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user", id] }) });
```
Hook it to RN: `focusManager` with `AppState`, `onlineManager` with NetInfo, and persist the cache with MMKV/AsyncStorage for offline-first experiences.

### Q46. Redux Toolkit and Zustand examples
```ts
// Zustand
import { create } from "zustand";
export const useCart = create<{ items: Item[]; add: (i: Item) => void }>((set) => ({
  items: [], add: (i) => set((s) => ({ items: [...s.items, i] })),
}));
```
```ts
// Redux Toolkit slice
const cartSlice = createSlice({ name: "cart", initialState: { items: [] as Item[] }, reducers: { added: (s, a: PayloadAction<Item>) => { s.items.push(a.payload); } } });
```
Select narrowly (`useCart((s) => s.items.length)`) to avoid unnecessary re-renders.

### Q47. FlatList performance props *(Must-know)*
`keyExtractor` (stable ids), `getItemLayout` (fixed-height rows for instant scroll offsets), `initialNumToRender`, `maxToRenderPerBatch`, `windowSize`, `removeClippedSubviews`, memoized `renderItem` and row components (`React.memo`), avoid inline anonymous functions/objects in `renderItem`, avoid heavy work in rows. For very large/complex lists use **FlashList** (cell recycling) with `estimatedItemSize`.

### Q48. FlashList vs FlatList
FlashList (Shopify) recycles views like native `RecyclerView`/`UITableView`, giving smoother scrolling and lower memory for big lists. Requires `estimatedItemSize` (v1) and careful handling of item state (recycling reuses components: avoid local state tied to item identity or use keys properly).

### Q49. Memoization in RN
`React.memo` for pure components, `useCallback` for handler stability when passed to memoized children, `useMemo` for expensive derived data. Profile first; unnecessary memoization adds complexity. The React Compiler (opt-in in recent Expo/RN templates) can auto-memoize (verify setup).

### Q50. Animated API basics
```tsx
const opacity = useRef(new Animated.Value(0)).current;
useEffect(() => { Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start(); }, []);
return <Animated.View style={{ opacity }} />;
```
`useNativeDriver: true` runs animations on the UI thread (works for transform/opacity, not layout props like width/height).

### Q51. Reanimated 3 (worklets) *(Must-know)*
Runs animation logic as **worklets** on the UI thread via JSI, enabling 60/120 fps even when the JS thread is busy.
```tsx
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
const x = useSharedValue(0);
const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
<Pressable onPress={() => (x.value = withSpring(x.value + 50))}><Animated.View style={[box, style]} /></Pressable>
```
Shared values update without re-rendering; `runOnJS` calls back into JS.

### Q52. Gesture Handler
`react-native-gesture-handler` provides native-driven gestures (pan, pinch, tap, long press) that don't suffer from the JS thread. Combine with Reanimated for swipe-to-delete, bottom sheets, drag-and-drop. Wrap the app in `GestureHandlerRootView`.

### Q53. Layout animations and transitions
Reanimated `entering`/`exiting`/`layout` props (`FadeIn`, `LinearTransition`), `LayoutAnimation` (built-in, simple), shared element transitions (experimental in libraries). Respect reduced-motion accessibility settings (`AccessibilityInfo.isReduceMotionEnabled`).

### Q54. Handling images, caching and lists of media
Use `expo-image` (disk/memory caching, placeholders/blurhash, transitions), request correctly sized images (CDN resizing), lazy load, avoid decoding huge bitmaps. Prefetch images for the next screen where beneficial.

### Q55. Native modules: why and how
When JS lacks a capability (Bluetooth, custom SDKs, performance-critical code), write native code (Swift/Kotlin/C++) and expose it. Options: **Expo Modules API** (Swift/Kotlin with a concise DSL, recommended), **TurboModules** (typed spec + Codegen), legacy bridge modules. Use existing libraries first.

### Q56. Writing a simple Expo module (concept)
```swift
// ios/MyModule.swift
public class MyModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MyModule")
    Function("hello") { (name: String) -> String in "Hello \(name)" }
    AsyncFunction("compute") { (n: Int) -> Int in n * 2 }
  }
}
```
```ts
import { requireNativeModule } from "expo-modules-core";
const MyModule = requireNativeModule("MyModule");
MyModule.hello("Ritesh Kumar");
```
Kotlin has an equivalent DSL. Types are marshalled automatically.

### Q57. Native UI components (Fabric components)
Expose platform views (maps, video players) to JS as components, with props and events defined by Codegen specs (`codegenNativeComponent`). Use `requireNativeComponent`/Expo Modules `View` for simpler cases. Be mindful of view recycling and layout in Fabric.

### Q58. Linking native libraries and autolinking
Autolinking (CLI/Expo) discovers native dependencies from `package.json` and links them into Android Gradle and iOS CocoaPods. After installing a native library, rebuild the app (`npx expo run:ios`, `eas build`); JS-only changes can use Fast Refresh. Expo Go can't run arbitrary native libraries; use a dev build.

### Q59. Push notifications overview *(Must-know)*
Providers: **APNs** (iOS) and **FCM** (Android) via Expo Notifications, `react-native-firebase`, OneSignal, etc. Flow: request permission → obtain device push token → send token to backend → backend sends via provider → app handles foreground/background/tap events and deep links. Handle token refresh, topic subscription, channels (Android 8+), and notification categories/actions. See `../03_Backend/038_Message-Queues.md` for backend delivery pipelines.
```ts
import * as Notifications from "expo-notifications";
const { status } = await Notifications.requestPermissionsAsync();
const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: false, shouldSetBadge: false }) });
```

### Q60. Local notifications and background tasks
Schedule local notifications (reminders), background fetch/tasks (`expo-background-task`/`expo-task-manager`) with OS-controlled limits (not guaranteed timing), headless JS on Android, silent pushes for data sync. iOS heavily restricts background execution; design for opportunistic sync.

---

### Q61. Authentication flow in a mobile app *(Must-know)*
Use OAuth2/OIDC **Authorization Code + PKCE** via the system browser (`expo-auth-session`, `react-native-app-auth`) or your backend's login endpoints. Store the access token in memory and the refresh token in secure storage (Keychain/Keystore via `expo-secure-store`). Refresh tokens on 401 with a single in-flight refresh promise; sign out clears storage and caches. Never embed client secrets in the app. See `../03_Backend/036_Authentication-and-Security.md`.
```ts
let refreshing: Promise<string> | null = null;
async function authFetch(url: string, init: RequestInit = {}) {
  let res = await fetch(url, { ...init, headers: { ...init.headers, Authorization: `Bearer ${accessToken}` } });
  if (res.status === 401) {
    refreshing ??= refreshAccessToken().finally(() => (refreshing = null));
    accessToken = await refreshing;
    res = await fetch(url, { ...init, headers: { ...init.headers, Authorization: `Bearer ${accessToken}` } });
  }
  return res;
}
```

### Q62. Biometrics
`expo-local-authentication` / `react-native-biometrics`: Face ID/Touch ID/Android Biometric prompt to unlock the app or protect sensitive actions. Use biometrics as a local gate over secure storage, not as a replacement for server authentication.

### Q63. Offline-first basics
Cache reads (TanStack Query persistence, SQLite), queue writes locally (outbox) and sync when online with idempotency keys, detect connectivity (NetInfo), show sync state, resolve conflicts (last-write-wins or merge). Local-first tools: WatermelonDB, PowerSync, Realm/Atlas Device Sync (deprecated; verify), SQLite + custom sync.

### Q64. Error boundaries and crash reporting
Use an `ErrorBoundary` component (class or `react-error-boundary`) to show fallback UI for render errors; JS exceptions in handlers need try/catch; native crashes need Crashlytics/Sentry. Upload sourcemaps and dSYM/mapping files for readable stack traces. Add breadcrumbs and user/session context.

### Q65. Logging and analytics
Structured logs with levels, strip verbose logs in production, analytics via Firebase, Amplitude, PostHog or Segment with consent (GDPR/ATT on iOS). Don't log PII or tokens. Track funnel events and performance metrics.

### Q66. Internationalization (i18n) and RTL
`i18next`/`react-i18next` or `expo-localization` with ICU message formats, pluralization, date/number formatting via `Intl` (Hermes supports Intl on modern versions), RTL layouts with `I18nManager` and logical style props (`marginStart`/`End`). Test long strings and dynamic type.

### Q67. Accessibility *(Must-know)*
Props: `accessible`, `accessibilityLabel`, `accessibilityHint`, `accessibilityRole`, `accessibilityState`, `importantForAccessibility`. Support screen readers (VoiceOver, TalkBack), dynamic font scaling, sufficient touch targets (44×44 pt iOS, 48×48 dp Android), contrast, reduced motion, focus order. Test with the real screen readers and automated linters.

### Q68. Handling device differences
Screen sizes/densities (`useWindowDimensions`, `PixelRatio`), orientation, notches, foldables, tablets, Android fragmentation (OEM behaviours, battery optimizations), iOS versions. Use responsive layouts (flex, percentages, breakpoints by width), avoid fixed pixel positioning.

### Q69. Testing basics: unit and component *(Must-know)*
Jest (preset `jest-expo`/`react-native`), React Native Testing Library (RNTL).
```tsx
import { render, screen, fireEvent } from "@testing-library/react-native";
test("increments", () => {
  render(<Counter />);
  fireEvent.press(screen.getByText("Increment"));
  expect(screen.getByText("Count: 1")).toBeTruthy();
});
```
Mock native modules (`jest.mock("expo-secure-store")`), use `jest.useFakeTimers()` with animations, and test navigation with `NavigationContainer` wrappers. See `../06_Testing/040_Testing.md`.

### Q70. E2E testing: Detox vs Maestro vs Appium
**Detox** (gray-box, synchronizes with the app, fast, RN-focused), **Maestro** (YAML flows, very easy, cross-platform), **Appium** (black-box, WebDriver, broad language support). Run on emulators/simulators or device clouds (BrowserStack, Sauce Labs, EAS workflows).
```yaml
# maestro flow
appId: com.acme.myapp
---
- launchApp
- tapOn: "Email"
- inputText: "ritesh@example.com"
- tapOn: "Sign in"
- assertVisible: "Welcome"
```

### Q71. Build types and signing
Android: debug vs release, **AAB** for Play Store, keystore (upload key + Play App Signing). iOS: certificates, provisioning profiles, bundle ID, TestFlight. EAS manages credentials; bare apps use Fastlane `match`. Never lose the Android upload key policy: enroll in Play App Signing.

### Q72. Versioning and releases
`version` (user-visible) and `buildNumber`/`versionCode` (monotonic). Semantic versions, release channels (internal → beta → production), staged rollouts (Play Console percentage rollout, iOS phased release), release notes and rollbacks (OTA rollback or hotfix build).

---

# 🟡 Part 3: Mid (3–5 years)

### Q73. Performance model: JS thread vs UI thread *(Must-know)*
Two main budgets: the **JS thread** (React renders, state updates, business logic) and the **UI thread** (native drawing/gestures). Jank occurs when either misses the 16.7 ms frame (60 fps) / 8.3 ms (120 fps). Symptoms: dropped frames while scrolling (UI thread or heavy rendering), laggy taps (JS thread blocked). Move animations to the UI thread (Reanimated), reduce re-renders, offload heavy work.

### Q74. Profiling tools
React DevTools Profiler (renders), React Native DevTools performance panel, Hermes sampling profiler (flame charts), Xcode Instruments (Time Profiler, Allocations, Core Animation), Android Studio Profiler/Perfetto/systrace, `PerfMonitor` overlay, Flashlight (Android performance scoring), Sentry/Datadog RUM for production metrics.

### Q75. Startup time optimization
Use Hermes bytecode, inline requires (`inlineRequires: true` in Metro), lazy load screens (React.lazy-like `getComponent`), defer non-critical initialization (analytics, large libs), reduce JS bundle size, avoid heavy synchronous work in the root component, optimize splash screen handling (`expo-splash-screen`), prefer TurboModules lazy loading, keep native dependencies lean.

### Q76. Bundle size reduction
Analyze with `npx react-native-bundle-visualizer`/Expo Atlas, remove unused libraries, avoid importing entire utility libraries (lodash-es per-function imports), compress images/fonts, enable ProGuard/R8 (Android) and bitcode-less thin builds, split by ABI (Android), use dynamic features/on-demand assets, check duplicated dependencies.

### Q77. Reducing re-renders
Co-locate state, split components, `React.memo`, stable props (`useCallback`/`useMemo`), selectors for global stores, avoid context for high-frequency updates (use Zustand/Jotai selectors), avoid anonymous inline objects in props of memoized children, key lists correctly. Verify with the Profiler ("why did this render").

### Q78. Handling heavy computation
Move to native modules/JSI C++ (e.g., `react-native-quick-crypto`), worklets on the UI thread for animation math, `InteractionManager.runAfterInteractions` to defer work after transitions, chunk big loops with `requestIdleCallback`-like scheduling, paginate/stream data, use web workers alternatives (`react-native-worklets-core`), or compute on the server.

### Q79. Memory management
Avoid leaks: unsubscribe listeners/timers/AppState subscriptions in effect cleanup, cancel in-flight requests, release large images, avoid holding big arrays in global state, use image caching policies, profile with Instruments/Android Profiler, handle low-memory warnings. Retain cycles occur in native modules, not JS.

### Q80. Large lists at scale
FlashList with accurate `estimatedItemSize`, stable keys, memoized rows with minimal props, avoid nested lists, image thumbnails, pagination with `onEndReached` plus prefetch, windowing tuning, sticky headers via native props, skeleton placeholders. Measure with Flashlight/Perfetto.

### Q81. Gesture-heavy UI design
Keep gestures on the UI thread (Gesture Handler + Reanimated worklets), avoid `setState` per frame, use shared values and derived values, `useAnimatedScrollHandler` for scroll-linked effects, and test on low-end Android devices.

### Q82. Navigation performance
Use `native-stack`, avoid heavy screens in tab bars mounting eagerly (`lazy: true`), unmount inactive tabs when memory-bound (`unmountOnBlur` / freeze with `react-native-screens`' `freezeOnBlur`), keep screen components light, preload data on press-in or with navigation prefetching.

### Q83. State architecture for large apps
Layered: UI components → hooks/view-models → domain services → data layer (API clients, local DB) with repository interfaces. Server state in TanStack Query; client state in Zustand/Redux; navigation state separate; derived state via selectors. Avoid prop drilling and global mutable singletons.

### Q84. Modular architecture and monorepos
Workspaces (pnpm/yarn) with packages: `app`, `ui` (design system), `features/*`, `api-client`, `config`. Tools: Nx, Turborepo, Expo monorepo support. Share code with web (React Native Web, Solito), enforce boundaries with ESLint rules, and build only affected packages in CI.

### Q85. Design systems
Tokens (color/spacing/typography), primitives (Box, Text, Button), themes, variants, accessibility defaults, Storybook for RN, visual tests. Libraries: Tamagui, Unistyles, NativeWind, Restyle, React Native Paper, gluestack. Keep one source of truth between design (Figma tokens) and code.

### Q86. React Native Web and code sharing
`react-native-web` maps RN components to DOM; Expo Router supports web output; Solito shares navigation between Next.js and RN. Share business logic, API clients, validation (Zod), state; keep platform-specific UI where UX differs. Beware bundle size and web-specific accessibility/SEO needs.

### Q87. Secure storage and data protection
Keychain/Keystore for secrets, encrypt local DBs (SQLCipher, Realm encryption, MMKV encryption key in Keystore), avoid logging PII, disable screenshots/screen recording on sensitive screens (`FLAG_SECURE`, iOS secure text/blur on app switcher), clear sensitive data on logout, and respect data retention rules.

### Q88. Network security
HTTPS only (ATS on iOS, network security config on Android), **certificate pinning** with careful rotation plans (`react-native-ssl-public-key-pinning`), token handling, request signing for sensitive APIs, rate limiting server-side, and never trusting the client (all authorization on the server).

### Q89. Mobile app security checklist (OWASP MASVS)
Secure storage, authentication/session management, network communication, platform interaction (deep links, intents, WebViews), code quality, resilience (root/jailbreak detection as defence in depth), no secrets in the bundle, obfuscation (Hermes bytecode is not encryption), dependency scanning, secure build pipeline. Test with MobSF, Frida awareness, and pen tests.

### Q90. Deep link and intent security
Validate and sanitize deep link parameters, require authentication for sensitive routes, prefer verified App Links/Universal Links over custom schemes (hijackable), avoid executing actions directly from links without confirmation, and handle malformed URLs gracefully.

### Q91. WebView usage
`react-native-webview`: restrict origins (`originWhitelist`), disable JS if not needed, sanitize injected JS, avoid exposing native bridges to untrusted content, handle file access/permissions carefully, cookie sharing considerations, and provide error/offline states. Prefer native screens for core flows.

### Q92. OTA updates (EAS Update / CodePush) *(Must-know)*
Over-the-air updates deliver new JS bundles and assets without store review, within platform policies (no significant behavior changes that violate store rules). Concepts: runtime version/fingerprint compatibility between native binary and JS bundle, channels/branches, staged rollout, rollback, signing updates. Native changes require a new store build. CodePush (App Center) was retired; alternatives include EAS Update and self-hosted solutions (verify current status).
```bash
eas update --branch production --message "Fix cart crash"
```

### Q93. CI/CD for mobile
Pipeline: lint/typecheck → unit tests → build (EAS Build or Fastlane on macOS runners) → run Detox/Maestro on emulators → distribute to testers (internal tracks, TestFlight) → manual approval → store submission → OTA for JS hotfixes. Cache dependencies/Pods/Gradle; manage signing secrets securely. See `../07_DevOps_and_Cloud/047_CI-CD-and-DevOps.md`.

### Q94. Fastlane essentials
Automates build, signing (`match`), screenshots, beta distribution and store uploads (`gym`, `pilot`, `deliver`, `supply`). Used in bare projects or alongside EAS where finer control is needed.

### Q95. Feature flags and remote config
Roll out features gradually and kill-switch risky changes without store releases: Firebase Remote Config, LaunchDarkly, Statsig, GrowthBook, PostHog. Cache flags locally, define safe defaults when offline, and clean up stale flags.

### Q96. Monitoring in production
Crash-free sessions/users, ANR rate (Android), JS error rate, app start time, screen render time, API error rates, network latency, battery/memory metrics, release health by version. Tools: Sentry, Firebase Crashlytics/Performance, Datadog RUM, Bugsnag, Embrace. Alert on regressions after releases.

### Q97. Handling app upgrades and migrations
Local database/schema migrations, versioned persisted state (`version` + `migrate` in persisted stores), forced-update mechanism (minimum supported version from remote config), backward-compatible API versions for old app builds still in the wild.

### Q98. App Store / Play Store policies awareness
Privacy manifests and nutrition labels (iOS), data safety form (Play), permission justifications, background location rules, in-app purchase requirements (Apple IAP/Google Play Billing for digital goods), account deletion in-app, content rating, minimum target SDK levels, review guidelines about OTA updates and minimum functionality.

### Q99. In-app purchases
Use RevenueCat or `react-native-iap`/StoreKit/Billing Library: products, subscriptions, receipts validated server-side, restore purchases, entitlements, grace periods, webhooks to sync backend, test with sandbox accounts. Never trust client-side purchase state alone.

### Q100. Maps, location and background location
`react-native-maps`/Mapbox, `expo-location` with foreground vs background permissions, battery trade-offs (accuracy levels, distance filters), geofencing, platform restrictions and policy justifications for background access.

### Q101. Media: camera, audio, video
`expo-camera`/`react-native-vision-camera` (frame processors), `expo-av`/`expo-video` and `expo-audio`, uploading via presigned URLs with resumable/multipart strategies, compression (images/video) before upload, background uploads (`expo-file-system` upload tasks), handling interruptions and permissions.

### Q102. Bluetooth/IoT basics
`react-native-ble-plx`: scanning, connecting, characteristics read/write/notify, permissions (Android 12+ BLUETOOTH_SCAN/CONNECT; iOS usage descriptions), background modes, reconnection and error handling. Test with real devices; simulators lack BLE.

---

# 🟠 Part 4: Senior (5–7 years)

### Q103. Migrating to the New Architecture *(Must-know)*
Steps: upgrade to a recent RN/Expo SDK, audit native dependencies for New Architecture support (React Native Directory, `npx expo-doctor`), enable `newArchEnabled`, fix libraries relying on the old bridge (use interop layers temporarily), migrate custom native modules to TurboModules/Expo Modules (typed specs + Codegen), test thoroughly on both platforms (gestures, animations, text input, lists), measure startup/render performance, roll out via staged release. Keep a rollback plan for the native binary.

### Q104. Designing a scalable React Native app architecture
- **Structure:** feature modules (screens, hooks, services, tests) behind public APIs; shared `ui`, `api`, `utils` packages.
- **Data:** TanStack Query for server cache, SQLite/MMKV for persistence, repository layer abstracting API vs cache.
- **State:** Zustand/Redux for client state; navigation typed and centralized.
- **Cross-cutting:** error boundaries, logging, analytics, feature flags, auth/session manager, i18n, theming, accessibility defaults.
- **Quality:** ESLint boundaries, strict TypeScript, unit + component + E2E tests, Storybook, CI with preview builds.
- **Delivery:** EAS builds/updates, staged rollouts, monitoring dashboards.

### Q105. Offline-first sync architecture
Local database as the source of truth for UI; a sync engine pushes an **outbox** of mutations (with client-generated IDs and idempotency keys) and pulls server changes using cursors/versions; conflict resolution policy per entity (LWW, field-level merge, CRDT for collaborative data); retry with backoff; background sync with OS constraints; observable sync status. Test with airplane mode, flaky networks, clock skew and app kills mid-sync.

### Q106. Authentication architecture for mobile
OIDC Authorization Code + PKCE through the system browser, short-lived access token in memory, refresh token rotation in secure storage with reuse detection on the server, device binding/attestation (App Attest, Play Integrity) for sensitive APIs, step-up auth with biometrics, centralized session manager handling 401s and logout-all, and secure account recovery. Avoid embedded WebView logins.

### Q107. Designing a push notification system
Backend stores device tokens per user/device with platform and app version; notifications flow through a queue to FCM/APNs workers with retries and token cleanup on `Unregistered` errors; user preferences/quiet hours; deep link payloads validated on tap; delivery receipts/analytics; rate limits and batching; idempotent sends. Client handles permission prompts contextually and channel configuration (Android).

### Q108. Real-time features in mobile
WebSockets/SSE (with app lifecycle handling: disconnect in background, resync on foreground), push for background wake-ups, polling fallback, Firebase/Supabase realtime SDKs. Handle reconnection with backoff, message ordering/ids, battery usage and network switches. See `../03_Backend/037_WebSockets-and-Realtime.md`.

### Q109. Performance budgets and monitoring
Define budgets: cold start < 2 s on mid-range Android, TTI per screen, scroll jank < 1% slow frames, JS bundle size, memory ceiling, crash-free rate > 99.5%. Enforce in CI (bundle size check, Flashlight/Maestro performance flows), monitor in production (Sentry/Firebase/RUM), and gate releases on regressions.

### Q110. Debugging native crashes
Symbolicate with dSYM (iOS) and mapping files/NDK symbols (Android); read crash logs from Xcode Organizer/Play Console; reproduce with release builds (Hermes + minification); inspect native stack for JSI/TurboModule errors; check threading violations (UI work off main thread), null pointers in modules, OOM kills; bisect dependency upgrades.

### Q111. Handling Android fragmentation and OEM quirks
Aggressive battery optimizations (Xiaomi, Huawei, Samsung) kill background work; test on low-end devices; scoped storage, notification permissions (Android 13+), exact alarm restrictions, foreground service types (Android 14), edge-to-edge changes (Android 15). Maintain a device test matrix based on analytics and use a device cloud.

### Q112. Handling iOS specifics
App Transport Security, privacy manifests, ATT (tracking consent), background modes, push entitlements, Universal Links, keychain sharing, Dynamic Island/Live Activities (native modules/widgets), TestFlight processes, phased releases, App Review compliance. Build on macOS CI runners or EAS.

### Q113. Native widgets, extensions and app clips
Home-screen widgets, share extensions, notification service extensions, Live Activities are native (SwiftUI/Jetpack Glance) targets; integrate with RN via shared storage (App Groups/shared prefs), deep links and config plugins (`@bacons/apple-targets` for Expo, verify). Keep shared logic in native-friendly formats.

### Q114. Monorepo with web and mobile
Share design tokens, validation schemas, API clients and business logic; separate UI where interaction models differ; use Metro monorepo config (watchFolders, resolver) or Expo's built-in monorepo support; avoid duplicate React instances; version dependencies consistently; test both platforms in CI.

### Q115. Dependency management and upgrade strategy
Use Expo SDK upgrades (`npx expo install --fix`) or the React Native Upgrade Helper for bare apps; upgrade regularly (each SDK/RN release) to avoid large jumps; pin versions, review changelogs and native changes, run `expo-doctor`, upgrade in a branch with full regression, and avoid abandoned libraries (check maintenance, New Architecture support).

### Q116. Evaluating third-party libraries
Check maintenance activity, issues, New Architecture/Expo compatibility, TypeScript types, bundle and native footprint, license, security history, community adoption, and test in a spike on real devices. Prefer well-maintained libraries (Software Mansion, Shopify, Expo, Meta) and wrap them behind your own interface to ease replacement.

### Q117. Handling large teams and ownership
CODEOWNERS per feature, architectural decision records, shared design system team, platform/infra team for builds and CI, contract tests with the backend (OpenAPI codegen), strict PR checks (lint, types, tests, bundle size), release trains with branch cut and hotfix flows.

### Q118. Observability for mobile
Release health, breadcrumbs, network request tracing (propagate `traceparent` to backend), session replay (privacy-safe), custom performance spans (cold start, screen transitions), feature-flag exposure logging, device/OS segmentation, and alerting tied to SLOs. Respect privacy and consent.

### Q119. Internationalization at scale
Translation management (Phrase, Lokalise), ICU messages, extraction pipelines, pseudo-localization tests, locale-aware formatting, RTL review, dynamic content from backend, fallback chains, over-the-air string updates where permitted, and QA for text expansion.

### Q120. Accessibility programme
Design tokens for contrast and sizes, accessibility linting in CI, screen reader test scripts, dynamic type testing, reduced motion support, accessible custom components (roles/states), audit before major releases, and tracking user feedback. Legal frameworks (EAA/ADA) increasingly require compliance.

### Q121. Cost and build optimization
EAS build credits vs self-hosted macOS runners, caching (Gradle, CocoaPods, node_modules), incremental builds, building only on relevant changes, using OTA for JS-only fixes, ABI splits for smaller APKs, and sharing preview builds via internal distribution to reduce QA overhead.

### Q122. Security testing & threat modelling for mobile
STRIDE per feature (auth, payments, offline storage), static analysis (MobSF, Semgrep), dynamic testing with proxies (Burp, mitmproxy with pinning bypass in test builds), dependency scanning, secrets scanning, tamper detection, jailbreak/root signals as risk inputs (server decides), and periodic pen tests aligned with OWASP MASVS levels.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q123. Choosing a mobile technology strategy *(Must-know)*
Compare React Native, Flutter, native (Swift/Kotlin), Kotlin Multiplatform and PWAs against: team skills, time-to-market, performance needs (graphics, AR, heavy background work), platform-specific UX requirements, hiring market, code sharing with web, long-term maintenance, vendor/ecosystem risk, and existing codebases. Typical guidance: React Native/Expo for product apps with a React/TypeScript team and web overlap; native for platform-deep or graphics-intensive apps; Flutter for pixel-consistent custom UI with Dart expertise. Pilot the riskiest features before committing. See `042_Flutter.md`, `043_Kotlin-Android.md`, `044_Swift-iOS.md`.

### Q124. Brownfield: adding React Native to an existing native app
Integrate RN screens/modules incrementally (React Native as a library via `ReactNativeHost`/`RCTRootView` or Expo brownfield tooling), define bridge contracts for navigation and data between native and RN, share auth/session, manage dependency versions and build times, and migrate feature by feature. Plan for dual ownership between native and RN teams.

### Q125. Release management & risk control
Release trains, feature flags, staged rollouts (1% → 5% → 25% → 100%), automated smoke tests on release candidates, OTA for safe JS fixes only, kill switches, rollback strategies (halt rollout, flag off, revert OTA, expedited store build), crash-rate gates, and a post-release review with metrics.

### Q126. Performance engineering programme
Establish baselines per device tier, automated performance tests in CI, flame-chart review for top screens, budgets with alerts, quarterly "performance weeks," library audits, and architecture guardrails (no heavy work on JS thread, list standards, image policies). Tie performance to business KPIs (conversion, retention).

### Q127. Platform team and developer experience
Provide templates (create-app with CI, lint, testing, observability), shared libraries (auth, networking, design system), preview builds per PR, dev client distribution, docs and onboarding, fast local builds (prebuilt binaries, build caching), and support channels. Measure developer productivity (build times, PR cycle time).

### Q128. Governance of native code in RN apps
Limit native modules to necessity; require reviews by native experts; define patterns (Expo Modules API), testing for native code (XCTest/JUnit/Espresso), CI builds on each PR, documentation, and ownership. Wrap third-party SDKs behind facades to isolate upgrades.

### Q129. Compliance, privacy and data governance
Data inventory, consent management (ATT, GDPR/CCPA, DPDP), minimization, encryption, retention/deletion workflows, SDK vetting (analytics/ads), privacy manifests and store disclosures, regional data residency, auditability, and incident response for mobile-specific leaks.

### Q130. Cross-platform design and UX consistency
Respect platform conventions (navigation patterns, haptics, system fonts, back gestures) while sharing a design system; implement platform-adaptive components; run usability tests on both platforms; avoid forcing identical UI where it feels foreign.

### Q131. Long-term maintainability and upgrade debt
Schedule regular upgrade windows, track dependency health dashboards, prefer Expo-supported modules to reduce native upgrade pain, keep native customizations in config plugins/modules instead of editing generated folders, document patches (`patch-package`), and sunset abandoned libraries.

### Q132. Scaling to millions of users
Backend rate limiting and caching for mobile traffic spikes (push-triggered storms), CDN for media, pagination and delta sync, backward-compatible APIs for old app versions, graceful degradation, observability with release segmentation, capacity planning for notification fan-out, and load tests simulating mobile retry behaviour.

### Q133. AI features in mobile apps
On-device models (Core ML, TensorFlow Lite, ONNX Runtime, ExecuTorch) for privacy/latency; cloud LLM APIs via your backend (never embed keys), streaming responses (SSE), caching and rate limiting, offline fallbacks, moderation/safety, cost controls, and clear user consent. See `../11_Generative_AI/065_OpenAI-and-Claude-API.md`.

### Q134. Communicating trade-offs to stakeholders
Explain cost/benefit in business terms: shared code vs platform polish, OTA speed vs store compliance, native investment for differentiating features, risk of dependency churn. Use prototypes, metrics (crash-free, startup, conversion) and phased roadmaps with decision checkpoints.

---

# 💻 Part 6: Hands-On Tasks & Code

### H1. Typed navigation + auth flow with Expo Router
```tsx
// app/_layout.tsx
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useAuth, AuthProvider } from "@/auth";

function Guard() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  useEffect(() => {
    if (loading) return;
    const inAuth = segments[0] === "(auth)";
    if (!user && !inAuth) router.replace("/(auth)/login");
    if (user && inAuth) router.replace("/(tabs)");
  }, [user, loading, segments]);
  return <Slot />;
}
export default function Root() { return <AuthProvider><Guard /></AuthProvider>; }
```

### H2. Data layer with TanStack Query, MMKV persistence and online/focus managers
```tsx
import { QueryClient, focusManager, onlineManager } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import NetInfo from "@react-native-community/netinfo";
import { AppState } from "react-native";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();
const persister = createSyncStoragePersister({ storage: { getItem: (k) => storage.getString(k) ?? null, setItem: (k, v) => storage.set(k, v), removeItem: (k) => storage.delete(k) } });
const queryClient = new QueryClient({ defaultOptions: { queries: { gcTime: 24 * 3600_000, staleTime: 30_000, retry: 2 } } });

onlineManager.setEventListener((setOnline) => NetInfo.addEventListener((s) => setOnline(!!s.isConnected)));
AppState.addEventListener("change", (s) => focusManager.setFocused(s === "active"));

export const Providers = ({ children }) => (
  <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>{children}</PersistQueryClientProvider>
);
```

### H3. Optimized list with FlashList and memoized row
```tsx
import { FlashList } from "@shopify/flash-list";
const Row = React.memo(function Row({ item, onPress }: { item: Product; onPress: (id: string) => void }) {
  return (
    <Pressable onPress={() => onPress(item.id)} style={styles.row} accessibilityRole="button" accessibilityLabel={`${item.name}, ${item.price} rupees`}>
      <Image source={{ uri: item.thumb }} style={styles.thumb} />
      <View style={{ flex: 1 }}><Text numberOfLines={1}>{item.name}</Text><Text>₹{item.price}</Text></View>
    </Pressable>
  );
});
export function ProductList({ products }: { products: Product[] }) {
  const open = useCallback((id: string) => router.push(`/product/${id}`), []);
  return <FlashList data={products} renderItem={({ item }) => <Row item={item} onPress={open} />} estimatedItemSize={72} keyExtractor={(p) => p.id} onEndReachedThreshold={0.5} />;
}
```

### H4. Reanimated swipe-to-dismiss card
```tsx
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from "react-native-reanimated";

export function SwipeCard({ onDismiss, children }) {
  const x = useSharedValue(0);
  const pan = Gesture.Pan()
    .onUpdate((e) => { x.value = e.translationX; })
    .onEnd((e) => {
      if (Math.abs(e.translationX) > 120) { x.value = withTiming(Math.sign(e.translationX) * 500, { duration: 200 }, () => runOnJS(onDismiss)()); }
      else x.value = withTiming(0);
    });
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }, { rotate: `${x.value / 20}deg` }] }));
  return <GestureDetector gesture={pan}><Animated.View style={style}>{children}</Animated.View></GestureDetector>;
}
```

### H5. Secure token storage and refresh
```ts
import * as SecureStore from "expo-secure-store";
const KEY = "refresh_token";
export const saveRefresh = (t: string) => SecureStore.setItemAsync(KEY, t, { keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY });
export const loadRefresh = () => SecureStore.getItemAsync(KEY);
export const clearRefresh = () => SecureStore.deleteItemAsync(KEY);
```
Access tokens stay in memory; on app start, use the refresh token to obtain a new access token, then render the app.

### H6. Push notification registration
```ts
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";

export async function registerForPush() {
  if (!Device.isDevice) return null;
  if (Platform.OS === "android") await Notifications.setNotificationChannelAsync("default", { name: "Default", importance: Notifications.AndroidImportance.HIGH });
  let { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") ({ status } = await Notifications.requestPermissionsAsync());
  if (status !== "granted") return null;
  const token = (await Notifications.getExpoPushTokenAsync({ projectId: Constants.expoConfig?.extra?.eas?.projectId })).data;
  await api.post("/devices", { token, platform: Platform.OS });
  return token;
}
```

### H7. Component test with RNTL and mocked navigation
```tsx
jest.mock("expo-router", () => ({ useRouter: () => ({ push: mockPush }) }));
test("navigates to product on press", async () => {
  render(<ProductList products={[{ id: "1", name: "Keyboard", price: 2999, thumb: "x" }]} />);
  fireEvent.press(await screen.findByLabelText(/keyboard/i));
  expect(mockPush).toHaveBeenCalledWith("/product/1");
});
```

### H8. EAS workflow: build, test and OTA
```yaml
# .github/workflows/mobile.yml
name: mobile
on: { push: { branches: [main] } }
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci && npm run lint && npx tsc --noEmit && npm test -- --ci
  update:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: expo/expo-github-action@v8
        with: { eas-version: latest, token: "${{ secrets.EXPO_TOKEN }}" }
      - run: npm ci && eas update --branch production --message "${{ github.sha }}" --non-interactive
```

### H9. Offline outbox (simplified)
```ts
type Mutation = { id: string; type: "ADD_NOTE"; payload: any; createdAt: number };
const outbox = createMMKVQueue<Mutation>("outbox");

export async function addNote(note: Note) {
  db.notes.insert({ ...note, pending: true });                       // optimistic local write
  outbox.push({ id: crypto.randomUUID(), type: "ADD_NOTE", payload: note, createdAt: Date.now() });
  flushOutbox();
}
export async function flushOutbox() {
  if (!(await NetInfo.fetch()).isConnected) return;
  for (const m of outbox.peekAll()) {
    try { await api.post("/notes", m.payload, { headers: { "Idempotency-Key": m.id } }); db.notes.update(m.payload.id, { pending: false }); outbox.remove(m.id); }
    catch (e) { if (isPermanent(e)) { outbox.remove(m.id); markFailed(m); } else break; }     // stop on transient errors, retry later
  }
}
```

### H10. Flashlight / performance guard in CI (concept)
```bash
npx flashlight test --bundleId com.acme.myapp --testCommand "maestro test flows/scroll_list.yaml" --resultsFilePath results.json --iterationCount 10
node scripts/assert-perf.js results.json --minScore 70 --maxStartupMs 2500
```
Fail the pipeline when startup or scroll performance regresses vs the baseline.

---

# 🐞 Part 7: Debugging Scenarios

### D1. Red screen: `Invariant Violation: "main" has not been registered` / app won't start
Entry file wrong (`index.js` not calling `registerRootComponent`/`AppRegistry.registerComponent`), mismatched app name, Metro serving a stale bundle, or a native/JS version mismatch. Clear caches (`npx expo start -c`), check `package.json` `main`, rebuild the native app after native dependency changes.

### D2. `Unable to resolve module` / Metro errors
Missing dependency, wrong import path/case, monorepo not configured (watchFolders/resolver), duplicate React copies, or stale cache. Reinstall, reset Metro cache, check `metro.config.js`, and ensure a single `react`/`react-native` version.

### D3. `Text strings must be rendered within a <Text> component`
A raw string/number (often `{cond && "text"}` or `0 &&` expressions) placed directly in a `View`. Wrap in `Text` or convert falsy values (`cond ? <X/> : null`, `!!count && ...`).

### D4. App crashes only in release builds
Hermes/minification differences, missing ProGuard rules (Android), console statements in hot paths, native module not linked in release variant, environment variables absent, JS exceptions swallowed in dev. Reproduce with a release build locally, check logs (`adb logcat`, Xcode console), upload sourcemaps.

### D5. Keyboard covers inputs / layout jumps
Missing `KeyboardAvoidingView`/wrong `behavior` per platform, `softwareKeyboardLayoutMode` (Android) misconfigured, scroll container not adjusting. Use `react-native-keyboard-controller`, `keyboardShouldPersistTaps`, and test on both platforms with various keyboards.

### D6. FlatList janky or blank rows while scrolling fast
Heavy row rendering, unstable keys, inline functions, large images, nested lists, too-large `windowSize`. Memoize rows, use FlashList, size images, set `getItemLayout`, reduce work in `renderItem`, profile the JS thread.

### D7. Animation stutters
Using JS-driven animations for layout props, state updates per frame, JS thread busy, missing `useNativeDriver`/worklets, heavy shadows/blur on Android. Move to Reanimated shared values, reduce overdraw, avoid layout-affecting props in animation loops.

### D8. Push notifications not arriving
Missing permission, wrong token/environment (sandbox vs production APNs), FCM config (`google-services.json`/`GoogleService-Info.plist`) missing, notification channels not created on Android 8+, battery optimization killing background delivery, invalid/rotated tokens, Expo Go limitations. Verify with provider tools (FCM diagnostics, APNs feedback) and device logs.

### D9. Deep links open the app but wrong screen
Linking config mismatch, auth gate redirecting away and losing the target, cold start vs warm start handling, URL scheme collisions, missing `assetlinks.json`/AASA association. Log initial URL (`Linking.getInitialURL`), store pending deep link, and replay after login.

### D10. Android build fails (Gradle, SDK, Java versions)
Mismatched JDK/Gradle/AGP versions, missing SDK platforms/NDK, duplicate classes, memory limits (`org.gradle.jvmargs`), stale caches. Use the JDK version required by the RN version, run `./gradlew clean`, check `npx expo-doctor`, and read the first error in the Gradle log.

### D11. iOS build fails (Pods, signing)
`pod install` errors (CocoaPods/Ruby versions, architecture issues on Apple Silicon), signing/provisioning mismatches, missing capabilities/entitlements, minimum iOS deployment target conflicts, Xcode version incompatibility. Clean derived data, `pod repo update`, verify team/bundle ID, check config plugins output.

### D12. `Network request failed` on device only
Using `localhost` (device can't reach host machine; use LAN IP/emulator alias `10.0.2.2`), cleartext HTTP blocked (Android `usesCleartextTraffic`, iOS ATS), invalid/self-signed certificates, VPN/proxy, CORS irrelevant (native), or backend not reachable on the network. Prefer HTTPS with valid certs.

### D13. State/UI not updating
Mutating state directly, stale closures in effects/callbacks, memoized components with unstable props, missing keys, context value changing every render, async race conditions. Use functional updates, dependency arrays and the Profiler.

### D14. Memory warnings / app killed in background
Large images in memory, leaked listeners/timers, huge lists, unbounded caches. Profile with Instruments/Android Profiler, clear caches on memory warning, downscale images, paginate, release resources on unmount.

### D15. OTA update didn't apply or crashed users
Runtime version mismatch between binary and update, update targeted wrong channel/branch, update contains code requiring new native modules, cached old update. Use fingerprint-based runtime versions, test updates on a preview channel, staged rollout and rollback quickly (`eas update:rollback` equivalents).

---

# 🧩 Part 8: Tricky Questions

### T1. Does React Native render with WebViews?
No. It creates real native views; JS orchestrates them via React. Only specific components (like `react-native-webview`) use a WebView.

### T2. Is React Native "write once, run anywhere"?
Not exactly. Most logic is shared, but platform differences (permissions, navigation patterns, notch/safe areas, background behaviour, native APIs) require platform-aware code and testing.

### T3. Is the bridge still used?
In the New Architecture (default since 0.76) the legacy asynchronous bridge is replaced by JSI, Fabric and TurboModules; bridgeless mode removes it entirely. Legacy libraries may use interop layers temporarily.

### T4. Does Hermes JIT compile JavaScript?
Hermes primarily uses ahead-of-time bytecode compilation and an interpreter (no JIT), optimizing for startup and memory over peak throughput. V8/JSC with JIT may be faster for long CPU-bound loops but cost more startup/memory.

### T5. Why can an animation be smooth in dev but janky in production (or vice versa)?
Dev mode adds overhead (warnings, slower JS), while production uses Hermes bytecode and minification. Low-end devices expose bottlenecks; always profile release builds on real hardware.

### T6. Is `AsyncStorage` secure?
No. It is unencrypted app-sandbox storage; rooted/jailbroken devices or backups can expose it. Use Keychain/Keystore-backed storage for secrets.

### T7. Can I use any npm package in React Native?
Only JS-only packages that don't depend on Node/DOM APIs. Packages needing native code require compatible native modules; Node core modules (`fs`, `crypto`) need polyfills or RN equivalents.

### T8. Is `useEffect` cleanup optional in mobile?
No. Unmounted screens still hold subscriptions (AppState, listeners, timers, sockets); failing to clean up causes leaks, duplicated handlers and background battery drain.

### T9. What happens to a screen when you navigate forward in a stack?
It stays mounted underneath (state preserved). `useEffect` doesn't re-run on return; use focus events for refresh logic.

### T10. Why do shadows look different on Android and iOS?
iOS uses `shadow*` props; Android uses `elevation` (Material). Cross-platform shadows need platform-specific styles or libraries; `boxShadow` support is improving in the New Architecture (verify version).

### T11. Does `FlatList` virtualization guarantee performance?
Not automatically; heavy row components, inline functions and large images still cause jank. Optimize rows or use FlashList.

### T12. Are OTA updates allowed to change app behavior arbitrarily?
Stores restrict updates that alter the app's primary purpose or bypass review; JS bug fixes and content updates are typically acceptable. Follow Apple/Google guidelines.

### T13. Do I need a Mac to build iOS apps?
For local builds yes (Xcode). EAS Build provides cloud macOS builders so you can build iOS without owning a Mac (you still need an Apple Developer account).

### T14. Can Expo apps use native libraries?
Yes via development builds and config plugins; Expo Go is the limited sandbox. Many "Expo vs bare" limitations no longer apply.

### T15. Why is `Dimensions.get("window")` risky?
It's a snapshot that may be stale on rotation/split-screen/foldables; use `useWindowDimensions()` for reactive values.

### T16. Is it OK to put API keys in `EXPO_PUBLIC_` variables?
Only for public identifiers (e.g., Google Maps client keys with restrictions). Secrets must stay on the backend because the bundle is readable.

### T17. Does React Native support SSR?
Not for native; Expo Router can render web output (static/SSR) for the web target only.

### T18. Why might `console.log` slow down an app?
In debug it serializes through the debugger; in production heavy logging in hot paths costs CPU. Strip logs in release or use a logger with levels.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- **Language?** JavaScript/TypeScript with React.
- **Renders to?** Real native views.
- **Default JS engine?** Hermes.
- **Architecture default (0.76+)?** New Architecture (JSI, Fabric, TurboModules).
- **Layout engine?** Yoga (Flexbox).
- **Default flexDirection?** `column`.
- **List component?** FlatList / FlashList.
- **Navigation libs?** React Navigation, Expo Router.
- **Animations?** Animated API, Reanimated (UI thread).
- **Gestures?** react-native-gesture-handler.
- **Fast key-value storage?** MMKV.
- **Secure storage?** SecureStore / Keychain / Keystore.
- **Server state?** TanStack Query.
- **Client state?** Zustand / Redux Toolkit.
- **Push providers?** APNs, FCM.
- **OTA updates?** EAS Update.
- **Cloud builds?** EAS Build.
- **Unit testing?** Jest + RNTL.
- **E2E tools?** Detox, Maestro, Appium.
- **Debugger?** React Native DevTools.
- **Native module system?** TurboModules / Expo Modules API.
- **Platform file ext?** `.ios.tsx`, `.android.tsx`.
- **Bundler?** Metro.
- **Android release format?** AAB.
- **iOS distribution?** TestFlight / App Store.
- **Crash reporting?** Sentry, Crashlytics.
- **Web target?** React Native Web / Expo Router.
- **Styling lib with Tailwind?** NativeWind.
- **Deep link types?** Custom scheme, Universal/App Links.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about a React Native app you built.
STAR: "I built a delivery-tracking app with Expo and TypeScript: Expo Router, TanStack Query with MMKV persistence for offline reads, WebSocket live tracking, Reanimated map overlays, push notifications via FCM/APNs, and Sentry. EAS Build and Update shipped weekly releases. We reached 4.7 stars, crash-free sessions of 99.7%, and cold start under 1.8 s on mid-range Android."

### P2. Describe a performance problem you solved.
"A product list janked on low-end Android because rows loaded full-size images and re-rendered on every cart update. I switched to FlashList with memoized rows, `expo-image` with CDN-resized thumbnails, moved cart updates behind selectors, and measured with Flashlight. Scroll performance score improved from 38 to 82 and memory dropped 35%."

### P3. How did you handle a bad release?
"A JS bug crashed checkout for 3% of users. We halted the staged rollout, flagged the feature off via remote config, shipped an EAS Update fix to the production channel after a preview-channel verification, and added a crash-rate gate plus a regression test. Time to mitigation was 25 minutes."

### P4. How do you decide between Expo and bare?
"I default to Expo with development builds and config plugins. I only go bare for unusual native build requirements or brownfield integration, and even then I keep native changes in config plugins or Expo Modules to preserve upgradeability."

### P5. How do you handle offline requirements?
"Local SQLite as source of truth, an outbox with idempotency keys, background sync respecting OS limits, conflict policies per entity, and visible sync status. We tested airplane mode and mid-sync kills in Maestro flows."

### P6. How do you keep a React Native codebase maintainable?
"Feature modules with clear boundaries, strict TypeScript and lint rules, a shared design system, contract-tested API clients, regular SDK upgrades, dependency health reviews, and CI with unit, component and E2E tests."

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- **Fundamentals:** React Native model, core components, Flexbox styling, platform differences, hooks and state, TypeScript.
- **Tooling:** Expo (Go, dev builds, prebuild, config plugins, EAS), bare CLI, Metro, Hermes, React Native DevTools.
- **Architecture:** old bridge vs New Architecture (JSI, Fabric, TurboModules, Codegen), threads, native modules, Expo Modules API.
- **Navigation:** React Navigation, Expo Router, deep links, auth flows, nested navigators.
- **Data and state:** TanStack Query, Zustand/Redux, forms, storage (MMKV, SQLite, SecureStore), offline-first, sync.
- **UI and performance:** FlatList/FlashList, memoization, images, Reanimated, Gesture Handler, profiling, startup/bundle optimization.
- **Platform features:** permissions, push notifications, background tasks, camera/location/BLE, biometrics, in-app purchases.
- **Quality and delivery:** testing (Jest, RNTL, Detox, Maestro), CI/CD, EAS Build/Submit/Update, Fastlane, store policies, monitoring.
- **Security and compliance:** secure storage, certificate pinning, OWASP MASVS, privacy, deep link security.
- **Leadership:** technology selection, brownfield, release management, platform teams, upgrade governance.

## Mixed topics
- React Native + React (`../02_Frontend/008_React.md`) and TypeScript (`../02_Frontend/006_TypeScript.md`).
- React Native + backend APIs (`../03_Backend/035_GraphQL-and-REST-APIs.md`): auth, pagination, idempotency, GraphQL clients.
- React Native + realtime (`../03_Backend/037_WebSockets-and-Realtime.md`): sockets, lifecycle handling.
- React Native + BaaS (`../03_Backend/034_Firebase-and-Supabase.md`): Firebase/Supabase SDKs, auth, storage.
- React Native + security (`../03_Backend/036_Authentication-and-Security.md`): OAuth2 PKCE, token storage.
- React Native + testing (`../06_Testing/040_Testing.md`) and DevOps (`../07_DevOps_and_Cloud/047_CI-CD-and-DevOps.md`).
- React Native + AI (`../11_Generative_AI/065_OpenAI-and-Claude-API.md`): streaming chat UIs, on-device models.

---

# 🔬 Part 12: React Native Internals

### I1. Startup sequence (New Architecture)
Native app launches → initializes the React Native host/runtime → loads Hermes and the JS bundle (bytecode) → runs the entry point (`AppRegistry.registerComponent`) → React renders the tree → Fabric commits the shadow tree and mounts native views → TurboModules load lazily when first required.

### I2. Render pipeline (Fabric)
Phases: **Render** (React reconciles into a React Element Tree and creates shadow nodes in C++), **Commit** (layout via Yoga computed, tree promoted), **Mount** (diff applied to native views on the UI thread). Synchronous layout access and concurrent features (transitions, Suspense) are enabled by sharing the C++ core across platforms.

### I3. JSI host objects and functions
JSI exposes C++ objects/functions to the JS runtime; JS calls them synchronously with typed values and can hold references without serialization. TurboModules and libraries like Reanimated, MMKV and VisionCamera frame processors use JSI for speed.

### I4. Codegen
At build time, Codegen reads typed specs (`NativeMyModule.ts`) and generates C++ interface headers and native glue (Obj-C++/Java/Kotlin) so the JS and native signatures match, replacing runtime reflection and JSON marshalling.

### I5. Yoga layout
A cross-platform C++ Flexbox implementation computing frames for shadow nodes. It differs from web CSS in defaults (column direction, `flexShrink: 0`, `position: relative`) and lacks features like floats/grid (limited support evolving).

### I6. Metro internals
Resolves modules from the entry, transforms with Babel (JSX/TS), applies platform-extension resolution, bundles into a single JS file (or serves incremental HMR updates), generates source maps, and supports asset hashing and inline requires. Expo's Metro config adds monorepo and web support.

### I7. Hermes details
Compiles JS to bytecode at build time (`hermesc`), memory-maps bytecode for fast startup, uses a generational garbage collector (Hades), supports Intl, Proxy, and debugging over CDP. No JIT; optimized for mobile constraints.

### I8. Threading model in the New Architecture
JS thread runs React; UI thread mounts views and handles input; background threads for layout/native modules. Reanimated worklets run on the UI runtime, allowing JS-free animation updates. Heavy native module work should be off the UI thread.

### I9. How Expo prebuild/CNG works
`app.json` + config plugins define native settings; `expo prebuild` templates native projects and applies plugin mods (Info.plist, AndroidManifest, Gradle, Podfile) deterministically; `eas build` runs prebuild in the cloud if native folders are absent.

---

# 📊 Part 13: Reference Tables

### React Native vs Flutter vs Native
| | React Native | Flutter | Native |
|---|---|---|---|
| Language | TypeScript/JS | Dart | Swift / Kotlin |
| Rendering | Platform views via Fabric | Own engine (Impeller) | Platform UI toolkit |
| Hot reload | Fast Refresh | Hot reload | Previews/Instant Run (varies) |
| Ecosystem | npm, huge | pub.dev, growing | Platform SDKs |
| Web sharing | React Native Web | Flutter Web | None |
| Native access | Modules (TurboModules/Expo) | Platform channels/FFI | Direct |

### Storage options
| Option | Sync/Async | Secure | Best for |
|---|---|---|---|
| AsyncStorage | Async | No | Small settings |
| MMKV | Sync | Optional encryption | Fast cache/settings |
| SecureStore/Keychain | Async | Yes | Tokens/secrets |
| SQLite/WatermelonDB | Async | With SQLCipher | Relational/offline |
| File system | Async | No | Files/media |

### Navigation choices
| | React Navigation | Expo Router |
|---|---|---|
| Routing | Config in code | File-based |
| Deep linking | Manual config | Automatic |
| Typed routes | Params lists | Generated types |
| Web support | Possible | Built in |

### Animation tools
| Tool | Thread | Use |
|---|---|---|
| Animated (native driver) | UI for transform/opacity | Simple animations |
| Reanimated 3 | UI (worklets) | Complex/gesture-driven |
| LayoutAnimation | Native | Quick layout transitions |
| Lottie | Native player | Designer-provided animations |
| Skia (`@shopify/react-native-skia`) | GPU | Custom drawing/shaders |

### Release channels
| Channel | Audience | Tool |
|---|---|---|
| Development | Developers | Dev client |
| Preview/internal | QA/stakeholders | EAS internal distribution, TestFlight |
| Beta | Subset of users | TestFlight external, Play closed/open testing |
| Production | Everyone | Store release + staged rollout + EAS Update |

### Version highlights (verify)
| Item | Notes |
|---|---|
| RN 0.68–0.72 | New Architecture opt-in, Hermes default |
| RN 0.74–0.75 | Bridgeless mode, New Architecture maturing |
| RN 0.76 | New Architecture enabled by default |
| Expo SDK 52–53 | New Arch default, Expo Router v4, React 19 support |
| React Native DevTools | Replaced Flipper as default debugger |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
```tsx
<View><Text>Hi</Text><Text>There</Text></View>
```
**Output:** two lines stacked vertically (default `flexDirection: "column"`), unlike the web where inline elements may flow horizontally.

### O2.
```tsx
<View>{count && <Text>Items</Text>}</View>   // count = 0
```
**Result:** renders `0` as a raw string inside `View` → error "Text strings must be rendered within a <Text> component". Use `count > 0 && ...`.

### O3.
```tsx
const [n, setN] = useState(0);
const inc = () => { setN(n + 1); setN(n + 1); };
```
**Result:** after one press `n` is 1 (both updates use the same stale `n`); use `setN(v => v + 1)` for 2.

### O4.
```tsx
useEffect(() => { const id = setInterval(tick, 1000); }, []);   // no cleanup
```
**Result:** interval keeps running after unmount (leak, duplicate timers after remounts); return `() => clearInterval(id)`.

### O5.
```tsx
Platform.select({ ios: "A", android: "B" })
```
**Output:** `"A"` on iOS, `"B"` on Android, `undefined` on web unless `default`/`web` provided.

### O6.
`FlatList` renders 10,000 rows with `ScrollView`-like behaviour due to nesting inside a vertical `ScrollView`.
**Result:** virtualization disabled; all rows render, causing slow start and high memory. Use `ListHeaderComponent` for extra content.

### O7.
```ts
await AsyncStorage.setItem("count", 5);
```
**Result:** warning/error: values must be strings; use `String(5)` or JSON.stringify.

### O8.
Animated opacity with `useNativeDriver: true` and animating `width`.
**Result:** error "Style property 'width' is not supported by native animated module"; use Reanimated layout animations or JS driver for layout props.

### O9.
```ts
const { width } = Dimensions.get("window");   // module scope
```
**Result:** stale after rotation or window resize (e.g., foldables); use `useWindowDimensions`.

### O10.
Navigating `Home → Details → Home` with `navigate("Home")` in a stack.
**Result:** `navigate` returns to the existing `Home` screen in the stack (pops back) instead of pushing a duplicate; use `push("Home")` to add another.

### O11.
`console.log` inside a worklet without `runOnJS` (Reanimated 3).
**Result:** worklets run on the UI runtime where `console.log` is supported (prints) but accessing JS-thread objects/functions requires `runOnJS`.

### O12.
Release build crashes with `undefined is not an object` while debug works.
**Result:** commonly minification/Hermes/optimization differences or missing native config; reproduce in release mode and symbolicate the stack.

---

# ✅ Part 15: MCQs

**1. React Native renders UI using:**
A) WebView  B) Real native views  C) Canvas only  D) Flash
**Answer: B**

**2. Default JS engine for React Native:**
A) V8  B) JavaScriptCore always  C) Hermes  D) SpiderMonkey
**Answer: C**

**3. JSI stands for:**
A) JavaScript Interface  B) JSON Serialization Interface  C) Java Service Integration  D) JS Inspector
**Answer: A**

**4. The default `flexDirection` in React Native is:**
A) row  B) column  C) row-reverse  D) none
**Answer: B**

**5. Which list component recycles cells for better performance?**
A) ScrollView  B) FlatList  C) FlashList  D) View
**Answer: C**

**6. Where should refresh tokens be stored?**
A) AsyncStorage  B) SecureStore / Keychain / Keystore  C) Redux state only  D) A global variable
**Answer: B**

**7. Reanimated worklets run on:**
A) The JS thread only  B) The UI thread  C) A server  D) The network thread
**Answer: B**

**8. EAS Update delivers:**
A) New native binaries without review  B) Over-the-air JS/asset updates  C) Only iOS builds  D) Database migrations
**Answer: B**

**9. Which navigation approach is file-based?**
A) React Navigation stack  B) Expo Router  C) Redux  D) Linking only
**Answer: B**

**10. Hook to refetch data when a screen regains focus:**
A) useEffect with []  B) useFocusEffect  C) useMemo  D) useLayoutEffect
**Answer: B**

**11. TurboModules are:**
A) CSS modules  B) Lazily loaded native modules using JSI  C) Redux plugins  D) Metro plugins
**Answer: B**

**12. What does Codegen produce?**
A) Test cases  B) Native glue code from typed specs  C) App icons  D) Translations
**Answer: B**

**13. Which E2E tool uses simple YAML flows?**
A) Detox  B) Maestro  C) Jest  D) Selenium
**Answer: B**

**14. Why avoid nesting FlatList in ScrollView (same direction)?**
A) It crashes always  B) It disables virtualization  C) It breaks navigation  D) It disables gestures
**Answer: B**

**15. To run native libraries not in Expo Go you use:**
A) Web build  B) Development build (dev client)  C) Snack  D) Emulator only
**Answer: B**

**16. A safe place for secrets (API keys with write access) is:**
A) `EXPO_PUBLIC_` variables  B) The backend  C) AsyncStorage  D) Source code
**Answer: B**

**17. Android release artifact for Google Play:**
A) APK only  B) AAB  C) IPA  D) ZIP
**Answer: B**

**18. Which tool shows JS flame charts for Hermes?**
A) Hermes sampling profiler / React Native DevTools  B) Postman  C) ESLint  D) Prettier
**Answer: A**

**19. Deep link verification on Android/iOS respectively uses:**
A) assetlinks.json / apple-app-site-association  B) robots.txt / sitemap.xml  C) manifest.json / favicon  D) CORS headers
**Answer: A**

**20. `useWindowDimensions` vs `Dimensions.get`:**
A) Identical  B) Hook updates on changes; `Dimensions.get` is a snapshot  C) Hook is slower always  D) Only works on iOS
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

1. **Using `ScrollView` + `map` for long lists** instead of FlatList/FlashList.
2. **Raw strings/numbers outside `<Text>`** (`0 &&` bug).
3. **Storing tokens in AsyncStorage** or shipping secrets in the bundle.
4. **No effect cleanup** (timers, listeners, sockets).
5. **Heavy work on the JS thread** (large JSON parsing, loops) blocking interactions.
6. **Inline functions/objects in list rows** and no memoization.
7. **Animating layout props with JS driver** or per-frame `setState`.
8. **Ignoring safe areas and keyboard behaviour.**
9. **Not testing on low-end Android and release builds.**
10. **Using `Dimensions.get` for responsive layouts.**
11. **Adopting unmaintained native libraries** without New Architecture support.
12. **Skipping permission rationale and denied/blocked handling.**
13. **No error boundaries or crash reporting with sourcemaps.**
14. **Mixing server state into Redux manually** instead of using a query cache.
15. **Not handling offline/slow network states.**
16. **OTA updates incompatible with the installed native runtime.**
17. **Hard-coding API URLs or using `localhost` on devices.**
18. **Ignoring accessibility labels/roles and dynamic type.**
19. **Large unoptimized images and fonts.**
20. **Postponing dependency/SDK upgrades** until they become huge migrations.
21. **Editing generated `android/`/`ios/` folders by hand** (lost on prebuild) instead of config plugins.
22. **No staged rollout/monitoring** for releases.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You explain the **New Architecture** (JSI, Fabric, TurboModules, Codegen) and what it changed in practice.
- You profile **JS vs UI thread** bottlenecks and fix them with the right tools (Reanimated, FlashList, memoization, native modules).
- You design **offline-first** data flows with idempotent sync and clear conflict policies.
- You secure apps properly: **secure storage, PKCE auth, pinning trade-offs, no embedded secrets, MASVS awareness**.
- You manage **releases** with EAS, staged rollouts, OTA constraints, feature flags and crash-rate gates.
- You make **pragmatic technology choices** (Expo vs bare, RN vs Flutter vs native) with data and spikes.
- You maintain **upgradability**: config plugins, Expo Modules, dependency health reviews, regular SDK upgrades.
- You care about **accessibility, i18n and platform conventions**, not just visual parity.
- You monitor **production health** (crash-free users, startup, ANR, release segmentation) and act on it.
- You can write or review **native modules** when needed and know when not to.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Core facts
```
RN renders real native views • JS (Hermes) + native via JSI • Fabric renderer • TurboModules • Codegen
Layout: Flexbox (column default) • styles = JS objects • no CSS cascade • dp units
Expo: dev builds + config plugins + EAS (Build/Submit/Update) • Metro bundler • Fast Refresh
```

### Performance checklist
FlashList/FlatList with memoized rows • stable keys • small/cached images (expo-image) • Reanimated worklets • avoid JS-thread blocking • narrow state selectors • inline requires/lazy screens • profile release builds on low-end Android • track bundle size & startup in CI.

### Data/State checklist
TanStack Query for server state • Zustand/Redux for client state • MMKV/SQLite for persistence • SecureStore for tokens • outbox + idempotency for offline writes • NetInfo + AppState integration • typed API clients/Zod validation.

### Release checklist
Version/build numbers • signing & credentials (EAS) • preview build QA • TestFlight/Play internal track • staged rollout • crash/ANR monitoring • OTA only for compatible JS changes • rollback plan • store policy/privacy forms.

### Security checklist
No secrets in bundle • PKCE + system browser auth • refresh tokens in secure storage • HTTPS/ATS • consider pinning with rotation plan • sanitize deep links • disable screenshots on sensitive screens • dependency scanning • server-side authorization.

### Interview strategy
1. Clarify product needs: platforms, offline, performance, native features, team skills.
2. Choose Expo/bare/native approach and justify.
3. Sketch architecture: navigation, data layer, state, auth, notifications.
4. Address performance, offline and security risks.
5. Describe testing, CI/CD, OTA/release strategy and monitoring.
6. Share a concrete story with metrics (startup time, crash-free rate, FPS).

### Final checklist before the interview
- [ ] Explain how RN works (old bridge vs New Architecture) and Hermes.
- [ ] Build screens with core components, Flexbox, FlatList/FlashList and navigation (Expo Router/React Navigation).
- [ ] Manage server/client state (TanStack Query, Zustand/Redux) and persistence (MMKV, SQLite, SecureStore).
- [ ] Implement auth with PKCE, token refresh and secure storage.
- [ ] Handle permissions, push notifications, deep links and background limits.
- [ ] Optimize performance (profiling, memoization, Reanimated, images, startup).
- [ ] Test with Jest/RNTL and E2E (Detox/Maestro); set up CI/CD with EAS.
- [ ] Describe OTA updates, staged rollouts and store policy considerations.
- [ ] Discuss security (MASVS), accessibility, i18n and monitoring.
- [ ] Prepare a project story, a performance story and an incident/rollback story with numbers.
