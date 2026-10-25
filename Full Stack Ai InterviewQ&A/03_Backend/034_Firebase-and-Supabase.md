# Firebase & Supabase Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets the **Firebase JS SDK v10/v11 (modular API)**, **Firebase Admin SDK**, **Cloud Functions for Firebase (2nd gen)**, **Cloud Firestore**, **Firebase Authentication (with Identity Platform)**, and **Supabase** (`@supabase/supabase-js` v2, PostgreSQL 15/17, GoTrue Auth, PostgREST, Realtime, Storage, Edge Functions on Deno, Supavisor, `pgvector`). Both platforms ship features quickly (for example Firebase Data Connect and App Hosting; Supabase Queues, Cron and Branching), and limits/pricing change: anything marked "verify" should be checked in the official docs (firebase.google.com/docs, supabase.com/docs) for your plan and region. Examples use the sample name **Ritesh Kumar**.
> This file covers Backend-as-a-Service (BaaS) concepts, Firebase (Auth, Firestore, Realtime Database, Cloud Storage, Cloud Functions, Hosting, FCM, Remote Config, App Check, Security Rules, Emulator Suite), Supabase (Postgres, Auth, Row Level Security, auto-generated REST/GraphQL, Realtime, Storage, Edge Functions, migrations, pgvector), data modelling for NoSQL vs SQL, security, cost and scaling, testing, migration between them and production practice. SQL fundamentals refer to `026_SQL.md` and `028_PostgreSQL.md`; MongoDB modelling refers to `030_MongoDB.md`; ORMs refer to `033_Prisma-and-ORMs.md`.

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
- [Part 12: Platform Internals](#-part-12-platform-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is a Backend-as-a-Service (BaaS)? *(Must-know)*
A managed platform that provides common backend building blocks (authentication, database, file storage, serverless functions, push notifications, hosting, realtime sync) behind SDKs and APIs, so a team can ship apps without building and operating servers. Examples: **Firebase**, **Supabase**, AWS Amplify, Appwrite, PocketBase, Parse. Trade-offs: speed and low ops versus vendor lock-in, less control and usage-based pricing.

### Q2. What is Firebase?
Google's app-development platform (acquired 2014). Core products: **Authentication**, **Cloud Firestore** and **Realtime Database** (NoSQL), **Cloud Storage**, **Cloud Functions**, **Hosting / App Hosting**, **Cloud Messaging (FCM)**, **Remote Config**, **Analytics**, **Crashlytics**, **App Check**, **Performance Monitoring**, **Test Lab**, and **Data Connect** (Cloud SQL for PostgreSQL with GraphQL).

### Q3. What is Supabase?
An open-source Firebase alternative built on **PostgreSQL**. Every project is a dedicated Postgres database plus: **Auth** (GoTrue), auto-generated **REST** (PostgREST) and **GraphQL** (pg_graphql) APIs, **Realtime** (WebSocket changes/broadcast/presence), **Storage** (S3-compatible), **Edge Functions** (Deno), **Vector** (pgvector), **Cron/Queues** and a dashboard/CLI. Can be self-hosted.

### Q4. Firebase vs Supabase at a glance *(Must-know)*
| | Firebase | Supabase |
|---|---|---|
| Database | Firestore / Realtime DB (NoSQL, proprietary) | PostgreSQL (relational, open) |
| Queries | Limited (no joins, restricted filters) | Full SQL, joins, views, functions |
| Auth | Firebase Auth (very mature, many providers) | GoTrue (email, OAuth, magic link, phone, SSO) |
| Authorization | Security Rules | Row Level Security (SQL policies) |
| Realtime | Built into listeners (Firestore/RTDB) | Postgres changes / Broadcast / Presence |
| Functions | Cloud Functions (Node/Python) | Edge Functions (Deno/TypeScript) + DB functions |
| Open source / self-host | No (proprietary) | Yes |
| Lock-in | High | Lower (standard Postgres) |
| Offline sync (mobile) | Excellent, built-in | Not built in (use local-first tools) |
| Pricing model | Pay per read/write/delete (Firestore) | Mostly per project/compute + usage |

### Q5. Set up a Firebase project (web)
```bash
npm i firebase
npm i -g firebase-tools
firebase login
firebase init          # Hosting, Firestore, Functions, Emulators
```
```ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const app = initializeApp({ apiKey: "...", authDomain: "...", projectId: "...", appId: "..." });
export const auth = getAuth(app);
export const db = getFirestore(app);
```
The web config (including `apiKey`) is **not a secret**; it identifies the project. Security comes from Security Rules, App Check and Auth.

### Q6. Set up a Supabase project
```bash
npm i @supabase/supabase-js
npx supabase init && npx supabase start     # local stack in Docker
```
```ts
import { createClient } from "@supabase/supabase-js";
export const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
```
The **anon (publishable) key** is public and relies on **RLS** to protect data. The **service_role (secret) key** bypasses RLS and must never reach the browser or mobile apps.

### Q7. What is Cloud Firestore?
A serverless, scalable **document database**: data lives in **collections** of **documents** (JSON-like, up to 1 MiB each) that can contain **subcollections**. It supports realtime listeners, offline persistence, automatic indexing, ACID transactions and strong consistency for reads/writes.
```
users (collection)
  └─ uid123 (document) { name: "Ritesh Kumar", city: "Delhi" }
        └─ orders (subcollection)
              └─ order1 (document) { total: 499 }
```

### Q8. Firestore CRUD (modular SDK) *(Must-know)*
```ts
import { collection, doc, addDoc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, limit, serverTimestamp } from "firebase/firestore";

const ref = await addDoc(collection(db, "users"), { name: "Ritesh Kumar", createdAt: serverTimestamp() });   // auto id
await setDoc(doc(db, "users", "uid123"), { name: "Ritesh Kumar", city: "Delhi" }, { merge: true });
const snap = await getDoc(doc(db, "users", "uid123"));
if (snap.exists()) console.log(snap.data());
await updateDoc(doc(db, "users", "uid123"), { city: "Mumbai" });
await deleteDoc(doc(db, "users", "uid123"));

const q = query(collection(db, "users"), where("city", "==", "Delhi"), orderBy("createdAt", "desc"), limit(10));
const docs = await getDocs(q);
```
`setDoc` replaces unless `{ merge: true }`; `updateDoc` fails if the document doesn't exist.

### Q9. Realtime listeners in Firestore
```ts
import { onSnapshot } from "firebase/firestore";
const unsubscribe = onSnapshot(query(collection(db, "messages"), orderBy("createdAt")), (snap) => {
  snap.docChanges().forEach((c) => console.log(c.type, c.doc.id, c.doc.data()));
});
// call unsubscribe() on unmount to stop billing reads/leaks
```
Listeners push changes over a persistent connection and serve cached data first (local writes appear immediately via latency compensation).

### Q10. What is Firebase Authentication?
A managed identity service: email/password, phone (SMS), Google/Apple/Facebook/GitHub etc., anonymous, custom tokens, SAML/OIDC (with Identity Platform), multi-factor auth. Issues **ID tokens** (JWT, 1 hour) and refresh tokens; SDKs refresh automatically.
```ts
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
await createUserWithEmailAndPassword(auth, "ritesh@example.com", "S3curePass!");
await signInWithPopup(auth, new GoogleAuthProvider());
onAuthStateChanged(auth, (user) => console.log(user?.uid));
await signOut(auth);
```

### Q11. Supabase Auth basics
```ts
await supabase.auth.signUp({ email: "ritesh@example.com", password: "S3curePass!" });
await supabase.auth.signInWithPassword({ email, password });
await supabase.auth.signInWithOAuth({ provider: "github" });
await supabase.auth.signInWithOtp({ email });                 // magic link / OTP
const { data: { session } } = await supabase.auth.getSession();
supabase.auth.onAuthStateChange((event, session) => console.log(event));
await supabase.auth.signOut();
```
Users live in the `auth.users` table (managed by Supabase); the session carries a JWT (default 1 hour) plus a refresh token.

### Q12. Supabase CRUD with the JS client *(Must-know)*
```ts
const { data, error } = await supabase.from("todos").insert({ title: "Learn RLS", user_id: user.id }).select().single();
const { data: rows } = await supabase.from("todos").select("id, title, profiles(name)").eq("done", false).order("created_at", { ascending: false }).range(0, 9);
await supabase.from("todos").update({ done: true }).eq("id", 1);
await supabase.from("todos").delete().eq("id", 1);
await supabase.from("todos").upsert({ id: 1, title: "x" });
const { data: r } = await supabase.rpc("get_stats", { uid: user.id });   // call a Postgres function
```
Always check `error`; the client does not throw by default.

### Q13. What is Row Level Security (RLS)? *(Must-know)*
A PostgreSQL feature that restricts which rows a role can see or modify via **policies**. In Supabase, tables exposed through the API **must** have RLS enabled; the `anon`/`authenticated` roles then only access rows that policies allow.
```sql
alter table public.todos enable row level security;

create policy "owners read" on public.todos for select to authenticated using (auth.uid() = user_id);
create policy "owners write" on public.todos for insert to authenticated with check (auth.uid() = user_id);
create policy "owners update" on public.todos for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owners delete" on public.todos for delete to authenticated using (auth.uid() = user_id);
```
`USING` filters existing rows; `WITH CHECK` validates new/updated rows. With RLS enabled and **no** policies, access is denied.

### Q14. What are Firebase Security Rules? *(Must-know)*
A declarative language evaluated on Google's servers for each client request to Firestore, Realtime Database and Cloud Storage. They are the **only** protection for client-side access.
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /posts/{postId} {
      allow read: if resource.data.published == true || request.auth.uid == resource.data.authorId;
      allow create: if request.auth != null && request.resource.data.authorId == request.auth.uid
                    && request.resource.data.title is string && request.resource.data.title.size() < 200;
    }
  }
}
```
Never ship `allow read, write: if true;` (test mode) to production. Rules are not filters: a query must be provably constrained to documents it may access.

### Q15. Firebase Cloud Storage and Supabase Storage
```ts
// Firebase
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
const r = ref(storage, `avatars/${uid}.png`);
await uploadBytes(r, file);
const url = await getDownloadURL(r);

// Supabase
await supabase.storage.from("avatars").upload(`${user.id}/avatar.png`, file, { upsert: true });
const { data } = supabase.storage.from("avatars").getPublicUrl(`${user.id}/avatar.png`);
const { data: signed } = await supabase.storage.from("private").createSignedUrl("doc.pdf", 60);
```
Both secure files with rules/policies (Storage Rules vs RLS policies on `storage.objects`). Use signed URLs for private files.

### Q16. Cloud Functions for Firebase (basic)
```ts
// functions/src/index.ts (2nd gen)
import { onRequest, onCall } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

export const hello = onRequest((req, res) => { res.json({ msg: "Hello Ritesh Kumar" }); });
export const addNumbers = onCall((req) => ({ sum: req.data.a + req.data.b }));
export const onOrder = onDocumentCreated("orders/{id}", async (event) => { /* send email */ });
```
Triggers: HTTPS, callable, Firestore, Auth, Storage, Pub/Sub, Scheduler, Realtime DB. Deploy with `firebase deploy --only functions`.

### Q17. Supabase Edge Functions (basic)
```ts
// supabase/functions/hello/index.ts (Deno)
import { serve } from "https://deno.land/std/http/server.ts";
serve(async (req) => {
  const { name } = await req.json();
  return new Response(JSON.stringify({ message: `Hello ${name}` }), { headers: { "Content-Type": "application/json" } });
});
```
```bash
supabase functions serve hello
supabase functions deploy hello
```
Run at the edge on Deno; call from the client with `supabase.functions.invoke("hello", { body: { name: "Ritesh Kumar" } })`.

### Q18. Firebase Hosting
Global CDN hosting for static sites and SPAs with free SSL, rewrites (to Functions/Cloud Run), redirects, headers, preview channels (`firebase hosting:channel:deploy`) and rollbacks. **App Hosting** (for Next.js/Angular SSR) deploys from GitHub via Cloud Build/Cloud Run.

### Q19. Firebase Cloud Messaging (FCM)
Free push notification service for Android, iOS and web. Messages: **notification** (displayed by system) and **data** (handled by app). Send from the Admin SDK or Console to device tokens, topics or conditions. Handle token refresh and permission prompts; on iOS configure APNs keys.

### Q20. Realtime Database vs Firestore *(Must-know)*
| | Realtime Database | Cloud Firestore |
|---|---|---|
| Model | One large JSON tree | Collections of documents |
| Queries | Limited, one sort/filter at a time | Richer, composite indexes, multiple filters |
| Scaling | Vertical-ish; shard across DB instances | Automatic, multi-region |
| Pricing | Bandwidth/storage-based | Per read/write/delete + storage |
| Offline | Yes | Yes |
| Latency | Very low | Low |
Firebase recommends Firestore for most new apps; RTDB suits very high-frequency presence/state-sync with simple data.

### Q21. What is the Firebase Admin SDK?
A privileged server-side SDK (Node, Python, Java, Go, .NET) that runs with a service account and **bypasses Security Rules**. Use it in trusted environments (Cloud Functions, your server) to verify ID tokens, manage users, set custom claims, read/write data and send FCM.
```ts
import admin from "firebase-admin";
admin.initializeApp();
const decoded = await admin.auth().verifyIdToken(idToken);
await admin.auth().setCustomUserClaims(decoded.uid, { role: "admin" });
```

### Q22. Custom claims (Firebase) and `app_metadata` (Supabase)
Role information embedded in the ID token/JWT used in rules/policies: Firebase **custom claims** (`request.auth.token.role`), Supabase `raw_app_meta_data` (not user-editable) exposed in the JWT (`auth.jwt() ->> 'role'` / `app_metadata`). Store roles in tokens only if you can tolerate delay until refresh; otherwise look up a roles table. Never trust `user_metadata` for authorization (users can edit it).

### Q23. Environment: anon key vs service role (Supabase) *(Must-know)*
| Key | Where | RLS |
|---|---|---|
| anon / publishable | Browser/mobile | Enforced |
| service_role / secret | Server only (Edge Functions, backend) | **Bypassed** |
Leaking `service_role` gives full database access. Use it only server-side, store in secrets, and prefer calling functions with the user's JWT whenever possible.

### Q24. Local development: emulators and local stack
Firebase **Emulator Suite** (`firebase emulators:start`) runs Auth, Firestore, RTDB, Functions, Storage, Pub/Sub and Hosting locally with a UI (port 4000). Supabase **CLI** (`supabase start`) runs Postgres, Auth, Storage, Realtime, Studio and Edge runtime in Docker. Use them for development, testing rules/policies and CI.

### Q25. Firestore data types
String, number (int64/double), boolean, map, array, null, timestamp, geopoint, reference, bytes, vector (for vector search). Documents max 1 MiB; field-name and nesting limits apply (verify). Use `serverTimestamp()` instead of client clocks.

### Q26. Indexes in Firestore
Single-field indexes are automatic. Queries combining filters/sorts on multiple fields need **composite indexes**; the SDK error includes a console link to create it. Index definitions live in `firestore.indexes.json`. Each indexed field increases write cost and storage; exempt large or unqueried fields.

### Q27. Firestore query limitations
No joins, no `OR` across different fields (supported in newer SDKs with `or()` and `in`), no full-text search, no `!=` on multiple fields, inequality filters have constraints (historically one field; relaxed in newer versions), no substring search, no aggregation beyond `count()`, `sum()`, `average()`. Solutions: denormalize, Algolia/Typesense/Elasticsearch for search, BigQuery export for analytics.

### Q28. Denormalization in Firestore
Because there are no joins, duplicate data you read together (author name inside posts). Keep copies updated with Cloud Functions or batched writes; accept eventual consistency for non-critical copies. Think "model by the screen/query" first.

### Q29. Supabase Postgres basics for developers
Use the SQL editor, migrations and standard Postgres features: foreign keys, constraints, indexes, views, functions, triggers, extensions (`pgvector`, `pg_cron`, `pg_trgm`, `postgis`). Tables in the `public` schema are exposed via the API when RLS policies allow. Create profile rows with a trigger on `auth.users`:
```sql
create table public.profiles (id uuid primary key references auth.users on delete cascade, full_name text);
create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin insert into public.profiles (id, full_name) values (new.id, new.raw_user_meta_data->>'full_name'); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
```

### Q30. Realtime in Supabase
```ts
const channel = supabase.channel("room1")
  .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: "room_id=eq.1" }, (payload) => console.log(payload.new))
  .subscribe();
// Broadcast (ephemeral messages) and Presence (who's online) share the same channel API
await supabase.removeChannel(channel);
```
Enable the table in the `supabase_realtime` publication. Postgres Changes respects RLS but is limited in throughput at scale: use **Broadcast** (and database triggers with `realtime.broadcast_changes`) for high fan-out.

### Q31. Pricing basics
Firebase: **Spark** (free) and **Blaze** (pay-as-you-go; required for Cloud Functions/outbound networking). Firestore bills per document read/write/delete, storage and egress. Supabase: Free, Pro (per org with included compute credits), Team, Enterprise; billed by compute size, database/storage size, egress, MAUs and add-ons. Always check current pricing pages (verify).

### Q32. When to choose Firebase
Mobile-first apps needing offline sync, rapid prototyping, realtime collaboration, push notifications, tight Google Cloud integration, and teams comfortable with NoSQL modelling.

### Q33. When to choose Supabase
Relational data, SQL expertise, complex queries/reports, open-source/self-hosting needs, avoiding lock-in, AI/vector search with pgvector, and apps where Postgres features (RLS, extensions, triggers) simplify the backend.

### Q34. Client-side vs server-side access
Client SDKs talk directly to the data layer, secured by rules/RLS (no custom backend needed). Server code (Admin SDK, service role) is for privileged work: payments, webhooks, scheduled jobs, third-party APIs, validations too complex for rules. A good architecture uses both.

### Q35. What is a JWT and how do both services use it?
A signed JSON Web Token carrying claims (`sub`, `exp`, role, custom claims). Firebase ID tokens are verified by Google-signed keys (`verifyIdToken`); Supabase JWTs are signed with the project JWT secret/keys and read inside Postgres through `auth.uid()` / `auth.jwt()`. Always verify tokens server-side; never decode-only for authorization.

### Q36. Testing basics
Firebase: `@firebase/rules-unit-testing` against the emulator to test rules; Functions with `firebase-functions-test`. Supabase: **pgTAP** (`supabase test db`) for RLS policies and SQL; integration tests against `supabase start`. Always test both allowed and denied cases.

---

# 🔵 Part 2: Junior (1–3 years)

### Q37. Firestore transactions and batched writes *(Must-know)*
```ts
import { runTransaction, writeBatch, increment } from "firebase/firestore";

// Transaction: reads then writes, retried automatically on contention
await runTransaction(db, async (tx) => {
  const ref = doc(db, "products", "p1");
  const snap = await tx.get(ref);
  if (snap.data()!.stock < 1) throw new Error("Out of stock");
  tx.update(ref, { stock: snap.data()!.stock - 1 });
});

// Batch: up to 500 writes, atomic, no reads
const batch = writeBatch(db);
batch.set(doc(db, "a", "1"), { x: 1 });
batch.update(doc(db, "b", "2"), { views: increment(1) });
await batch.commit();
```
Client transactions use optimistic concurrency and need the device online; Admin SDK transactions use pessimistic locking. Prefer `increment()` for counters.

### Q38. Pagination in Firestore
```ts
import { startAfter } from "firebase/firestore";
let q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(20));
const first = await getDocs(q);
const last = first.docs.at(-1);
q = query(collection(db, "posts"), orderBy("createdAt", "desc"), startAfter(last), limit(20));   // cursor
```
Use cursors (`startAfter`/`startAt` with a snapshot or values), not offsets. `offset()` exists in the Admin SDK but still bills for skipped documents.

### Q39. Firestore counters and hot documents
A single document can sustain about **1 write per second sustained** (soft limit; bursts higher). For high-frequency counters use **distributed counters** (sharded subdocuments summed on read), Realtime Database/`increment`, or aggregate via Functions. Avoid sequential IDs/monotonic field values indexed at high write rates (hotspotting): use auto IDs.

### Q40. Firestore aggregation queries
```ts
import { getCountFromServer, getAggregateFromServer, sum, average } from "firebase/firestore";
const c = await getCountFromServer(query(collection(db, "orders"), where("status", "==", "paid")));
console.log(c.data().count);
```
Cheaper than reading all docs (billed per index entries scanned, roughly 1 read per 1,000 entries). Use for totals, not complex analytics.

### Q41. Offline persistence (Firestore)
Mobile SDKs enable offline caching by default; the web SDK needs `initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) })`. Writes queue locally and sync later; listeners fire first from cache (`snapshot.metadata.fromCache`, `hasPendingWrites`). Conflicts resolve last-write-wins per field; design for idempotent merges.

### Q42. Subcollections vs top-level collections vs arrays *(Must-know)*
| Choice | Use when | Notes |
|---|---|---|
| Subcollection | Unbounded child items per parent (messages in a chat) | Not fetched with parent; can query across with `collectionGroup()` |
| Top-level collection | Items queried independently or shared across parents | Store parent id field |
| Array/map field | Small bounded lists (tags ≤ ~100) | `array-contains`, 1 MiB doc limit |
| Embedded map | Fixed small objects | Read together with parent |

### Q43. Collection group queries
```ts
const q = query(collectionGroup(db, "comments"), where("authorId", "==", uid));
```
Query all subcollections with the same ID across the database; requires a collection-group index and rules `match /{path=**}/comments/{id}`.

### Q44. Security Rules deep dive: functions and validation
```
function isSignedIn() { return request.auth != null; }
function isOwner(uid) { return isSignedIn() && request.auth.uid == uid; }
function isAdmin() { return isSignedIn() && request.auth.token.admin == true; }
function validPost() {
  let d = request.resource.data;
  return d.keys().hasOnly(['title','body','authorId','createdAt']) && d.title is string && d.title.size() <= 120
      && d.authorId == request.auth.uid && d.createdAt == request.time;
}
match /posts/{id} {
  allow read: if true;
  allow create: if validPost();
  allow update: if isOwner(resource.data.authorId) && request.resource.data.authorId == resource.data.authorId;
  allow delete: if isOwner(resource.data.authorId) || isAdmin();
}
```
Rules cost reads when using `get()`/`exists()` (limit 10 per request single-doc, 20 for multi-doc). Use `hasOnly`/`hasAll` to block mass-assignment of fields such as `role`.

### Q45. Rules are not filters
A query like `getDocs(collection(db,"posts"))` fails entirely if rules would deny any matched doc. Apply the same constraints in the query (`where("published","==",true)`) so Firestore can prove access. This surprises many beginners.

### Q46. Firebase Auth: tokens, sessions and server verification
Client gets an **ID token** (1 h) automatically refreshed. For server APIs send it as `Authorization: Bearer <idToken>` and verify with Admin SDK. For SSR/cookies use **session cookies** (`createSessionCookie`, up to 14 days) to avoid exposing tokens to JS. Revocation: `revokeRefreshTokens(uid)` plus `verifyIdToken(token, true)` to check revocation.

### Q47. Email verification, password reset, re-authentication
Firebase: `sendEmailVerification`, `sendPasswordResetEmail`, `reauthenticateWithCredential` before sensitive actions (change email/password, delete account). Supabase: `resetPasswordForEmail`, email confirmation toggles, `updateUser`, secure password change (`reauthentication` nonce in newer configs). Customize email templates and redirect URLs; allowlist redirect URLs.

### Q48. OAuth flows and redirect URLs
Configure providers (Google, GitHub, Apple) with client IDs/secrets in the dashboard; add authorized domains (Firebase) or redirect URLs (Supabase **Site URL** + **Redirect URLs**). Misconfigured redirect URLs cause "redirect_uri_mismatch" and open-redirect risks. For mobile use deep links; for SSR use PKCE flow (`@supabase/ssr`).

### Q49. Supabase SSR auth (Next.js)
Use `@supabase/ssr` with cookie-based sessions: create a server client per request reading/writing cookies, refresh the session in middleware, and call `supabase.auth.getUser()` (verifies with the Auth server) instead of trusting `getSession()` on the server.

### Q50. RLS policy patterns *(Must-know)*
```sql
-- Public read, owner write
create policy "public read" on posts for select using (true);
create policy "owner write" on posts for all to authenticated using (auth.uid() = author_id) with check (auth.uid() = author_id);

-- Team membership
create policy "team members" on projects for select to authenticated
using (exists (select 1 from team_members m where m.team_id = projects.team_id and m.user_id = (select auth.uid())));

-- Role from JWT app_metadata
create policy "admins" on posts for delete to authenticated using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
```
Wrap `auth.uid()` as `(select auth.uid())` so Postgres caches it per statement instead of per row (big performance gain). Index columns used in policies (`author_id`, `team_id`).

### Q51. RLS pitfalls
1. Forgetting to enable RLS on a table in `public` (exposed to anyone with the anon key).
2. Views bypass RLS by default (use `security_invoker = true` in Postgres 15+).
3. `security definer` functions run as owner: set `search_path` and validate inputs.
4. Missing `WITH CHECK` allows updating rows to values outside policy.
5. `UPDATE` requires a matching `SELECT` policy to see rows.
6. Policies on joined tables can make queries slow; keep policy subqueries indexed and simple.

### Q52. PostgREST and the auto-generated API
Supabase exposes tables/views/functions as REST: `GET /rest/v1/todos?select=id,title&done=eq.false&order=created_at.desc`. The JWT's `role` claim switches the Postgres role (`anon`, `authenticated`, `service_role`) via `SET ROLE`, so RLS applies. Filters: `eq`, `neq`, `gt`, `lt`, `like`, `ilike`, `in`, `is`, `cs` (contains), `fts`. Embedding: `select=*,author:profiles(name)` uses foreign keys for joins.

### Q53. Database functions (RPC) and triggers
```sql
create function public.add_comment(p_post bigint, p_text text) returns comments language plpgsql as $$
declare c comments;
begin
  insert into comments (post_id, user_id, body) values (p_post, auth.uid(), p_text) returning * into c;
  update posts set comment_count = comment_count + 1 where id = p_post;
  return c;
end $$;
```
```ts
await supabase.rpc("add_comment", { p_post: 1, p_text: "Nice" });
```
RPC runs multiple statements atomically in one round trip: the Supabase answer to "transactions" since the JS client has no multi-statement transaction.

### Q54. Transactions on each platform
Firebase: Firestore transactions and batches (see above). Supabase: no client-side transactions over REST; use Postgres functions (RPC), Edge Functions with a direct Postgres connection (`postgres.js`/Drizzle/Prisma), or `pg_net`-free patterns. Pick the DB function approach for atomic multi-step operations.

### Q55. Migrations (Supabase)
```bash
supabase migration new add_todos
# write SQL in supabase/migrations/<timestamp>_add_todos.sql
supabase db reset                 # rebuild local DB from migrations + seed.sql
supabase db diff -f my_change     # generate a migration from local schema changes
supabase link --project-ref <ref>
supabase db push                  # apply migrations to the remote project
supabase gen types typescript --local > database.types.ts
```
Keep schema in git; avoid editing production via the dashboard (drift). Use branching/preview environments for PRs (verify availability).

### Q56. TypeScript types
Supabase: generate `Database` types and pass to `createClient<Database>()` for typed queries. Firebase: use `withConverter()` (`FirestoreDataConverter<T>`) for typed documents, or Zod validation at read boundaries.

### Q57. Indexes and query performance (Supabase)
Standard Postgres: B-tree on filter/sort/FK columns, partial indexes, GIN for JSONB/arrays/FTS, `pg_trgm` for fuzzy search, `EXPLAIN ANALYZE`, `pg_stat_statements`. The Dashboard has **Index Advisor** and **Query Performance** reports. Index FK columns and RLS policy columns.

### Q58. Full-text and vector search
Postgres FTS: `to_tsvector`/`websearch_to_tsquery` with GIN index, exposed through `.textSearch()`. Vector: `create extension vector;` store embeddings in `vector(1536)` columns, query with `<=>` (cosine) and an `hnsw` index; wrap similarity search in an RPC function with metadata filters. Firestore supports vector fields with KNN queries; for full-text use Algolia/Typesense/Elasticsearch.

### Q59. Cloud Functions triggers and idempotency
Event triggers (Firestore, Storage, Pub/Sub) are **at-least-once**: the same event can run twice. Make handlers idempotent (check state, use event IDs/`create()` instead of `set`, transactional markers). Set retries only for idempotent functions; configure timeouts, memory, concurrency and `minInstances` to reduce cold starts.

### Q60. Callable functions vs HTTP functions
`onCall` automatically handles CORS, parses auth context (`request.auth`), App Check tokens and errors (`HttpsError`). `onRequest` is a raw Express-like endpoint (you verify tokens, handle CORS and methods). Prefer callable for client-triggered logic; HTTP for webhooks and public APIs.

### Q61. Scheduled functions and cron
Firebase: `onSchedule("every day 02:00", ...)` (Cloud Scheduler). Supabase: `pg_cron` for SQL jobs and Edge Functions invoked via `pg_net` or scheduled triggers. Make jobs idempotent and monitor failures.

### Q62. Webhooks (Stripe, GitHub)
Receive in a Cloud Function (HTTP) or Supabase Edge Function. Verify the signature using the raw body (`stripe.webhooks.constructEvent`), respond quickly, store the event id for idempotency, process asynchronously. Never trust payloads without verification.

### Q63. Storage security
Firebase Storage Rules (`allow read: if request.auth != null; allow write: if request.auth.uid == userId && request.resource.size < 5*1024*1024 && request.resource.contentType.matches('image/.*')`). Supabase Storage uses RLS policies on `storage.objects` and bucket settings (public vs private, file size/MIME limits). Resize/scan uploads server-side (Extensions/Functions).

### Q64. Firebase Extensions
Pre-packaged solutions (Resize Images, Trigger Email, Stripe payments, Algolia search, BigQuery export) installed with configuration; they deploy Functions and resources into your project. Review permissions and costs.

### Q65. App Check (Firebase)
Attests that requests come from your genuine app (Play Integrity, DeviceCheck/App Attest, reCAPTCHA Enterprise/v3). Enforce on Firestore, Storage, Functions to reduce abuse/bots. It's complementary to Auth and rules, not a replacement. Supabase equivalents: CAPTCHA on auth, rate limits, and network restrictions.

### Q66. Rate limiting and abuse protection
Firebase: App Check, rules-based constraints, per-user quotas via Functions, reCAPTCHA. Supabase: built-in Auth rate limits (configurable), CAPTCHA (hCaptcha/Turnstile), Edge Function rate limiting with Redis/Upstash, and Postgres-side checks. Add budget alerts to catch runaway usage.

### Q67. Remote Config and feature flags
Firebase **Remote Config** delivers parameters/conditions (percent rollouts, A/B tests) fetched by clients with caching intervals. Supabase has no built-in equivalent: use a `feature_flags` table (with RLS) plus Realtime, or a flag service (LaunchDarkly, PostHog).

### Q68. Analytics and observability
Firebase: Analytics, Crashlytics, Performance Monitoring, Cloud Logging for Functions, Cloud Monitoring alerts. Supabase: Logs Explorer (API, Postgres, Auth, Edge, Realtime logs), Reports, `pg_stat_statements`, log drains to Datadog/others, Advisors (security/performance).

### Q69. Data export, backups and recovery
Firestore: scheduled managed exports to Cloud Storage, **PITR** (point-in-time recovery, up to 7 days) and backups/restore (verify availability). Supabase: daily backups on paid plans, **PITR** add-on, `pg_dump`/logical backups; restore tests matter. Both: keep infrastructure as code (rules, indexes, migrations).

### Q70. Multi-environment strategy
Separate projects for dev/staging/prod (Firebase aliases: `firebase use --add`; Supabase project refs and branches). Use environment-specific config via CI secrets, emulators locally, and promote via CI (`firebase deploy --only firestore:rules,functions`, `supabase db push`). Never share prod credentials with dev.

### Q71. Firestore vs MongoDB vs DynamoDB
Firestore: serverless, realtime listeners, rules-based client access, strong consistency, per-operation pricing. MongoDB: richer queries/aggregation, self-managed or Atlas, no built-in client authorization (`030_MongoDB.md`). DynamoDB: key-value/wide-column with single-digit ms at huge scale, query by keys/indexes only, IAM-based access, no realtime client sync.

### Q72. Supabase vs raw Postgres vs Neon/RDS
Supabase adds Auth, RLS-driven API, Storage, Realtime and Edge Functions on top of Postgres. Raw Postgres/RDS/Neon give the database only (you build the API/auth). Choose Supabase to move fast with an integrated stack; choose bare Postgres when you need full control or a custom backend (`028_PostgreSQL.md`, `033_Prisma-and-ORMs.md`).

### Q73. Using Prisma/Drizzle with Supabase
Connect via the pooled connection string (Supavisor; transaction mode, port 6543, `?pgbouncer=true` for Prisma) for serverless and the direct/session connection for migrations. Server-side ORM queries run as the DB role you connect with (often `postgres`), **bypassing RLS** unless you set the role/JWT claims per request. Decide whether authorization lives in RLS or in your server code.

### Q74. Common beginner project: Todo app (both stacks)
Firebase: Auth + Firestore (`users/{uid}/todos`) + rules `request.auth.uid == userId`. Supabase: Auth + `todos` table with `user_id default auth.uid()` + RLS "own rows". Add realtime subscription, optimistic UI, and deployment to Hosting/Vercel.

### Q75. Handling errors from each SDK
Firebase errors have codes (`auth/user-not-found`, `permission-denied`, `unavailable`, `resource-exhausted`). Supabase returns `{ data, error }` with PostgREST/Auth error codes (`PGRST116` no rows for `.single()`, `23505` unique violation, `42501` RLS denied / insufficient privilege). Map them to user-friendly messages and retry only transient errors.

---

# 🟡 Part 3: Mid (3–5 years)

### Q76. Firestore data modelling for scale *(Must-know)*
Model by queries: one document per entity with fields you filter/sort on; subcollections for unbounded children; duplicate read-hot fields; use collection groups for cross-parent queries; keep documents small; avoid arrays that grow unbounded; avoid very hot documents; plan composite indexes. Example chat: `rooms/{roomId}/messages/{msgId}` with `createdAt` and `senderId`; `users/{uid}/rooms/{roomId}` as a per-user room index with the last message preview (denormalized).

### Q77. Fan-out on write vs fan-out on read (feeds)
Social feed options: **fan-out on read** (query posts from followed users; heavy for many follows, limited by `in` max 30 values), or **fan-out on write** (Cloud Function writes a copy of each post into every follower's `feed` subcollection; fast reads, expensive writes and storage). Celebrities use hybrid: fan-out for normal users, read-time merge for large accounts.

### Q78. Firestore pricing optimization
Costs = document reads + writes + deletes + storage + egress (+ index storage). Reduce reads: use `limit`, cursors, caching, listeners with `where` constraints rather than whole collections, `getCountFromServer` instead of reading, bundle static data (`Firestore bundles`) on CDN, avoid per-component listeners duplicating reads, cache in memory/IndexedDB. Reduce writes: batch, merge fields, avoid unnecessary timestamp updates. Set budget alerts.

### Q79. Realtime listeners at scale
Each active listener re-bills reads for changed documents and consumes connection quota (1M concurrent connections per database, with listeners per client limits). Detach listeners on unmount, scope queries narrowly, use `onSnapshot` with `includeMetadataChanges: false`, and prefer Realtime Database or Pub/Sub for very high-frequency ephemeral state (cursors, presence).

### Q80. Presence (online status)
Firebase RTDB `.info/connected` + `onDisconnect().set(...)` writes offline status reliably when the connection drops; mirror into Firestore with a Function. Supabase: Realtime **Presence** `channel.track({ user })` with automatic cleanup on disconnect.

### Q81. Supabase connection architecture
Clients usually use the REST/Realtime APIs (HTTP/WebSocket), not direct Postgres connections. For server code: **direct connection** (IPv6/IPv4 add-on; long-lived servers), **Supavisor session mode** (port 5432, IPv4 compatible), **Supavisor transaction mode** (port 6543, serverless; no session features, prepared statements issues). Watch `max_connections` and pool sizes; use pooled strings in serverless.

### Q82. Postgres roles in Supabase
`anon` (unauthenticated), `authenticated` (logged in), `service_role` (bypass RLS), `postgres` (admin), `supabase_auth_admin`, `authenticator` (PostgREST connects as this and switches role per request using JWT claims). Grants (`GRANT SELECT ON ...`) are needed in addition to RLS; policies filter rows, grants control table-level access.

### Q83. Auth hooks, custom claims and roles in Supabase
Use a **Custom Access Token Hook** (Postgres function or HTTP hook) to add claims (role, tenant) to the JWT at issuance; read with `auth.jwt()`. Alternatively keep a `user_roles` table and check it in policies via a `security definer` helper function (fast with indexes). Remember token claims only update on refresh.

### Q84. Multi-tenant SaaS on Supabase
Add `tenant_id` to every table, a `memberships(user_id, tenant_id, role)` table, and RLS policies like `tenant_id in (select tenant_id from memberships where user_id = (select auth.uid()))`. Put tenant in the JWT via hook for faster policies, index `(tenant_id, ...)` columns, use composite FKs to prevent cross-tenant references, and test with two tenants in pgTAP. Alternative: schema-per-tenant (more isolation, complex migrations).

### Q85. Multi-tenant on Firebase
Firebase Auth multi-tenancy (Identity Platform) provides tenant-scoped user pools; in Firestore use `tenants/{tenantId}/...` paths or a `tenantId` field with rules checking `request.auth.token.tenantId == tenantId` (set via custom claims). Keep tenant boundaries in paths for simpler, safer rules.

### Q86. Admin roles and custom claims workflow (Firebase)
Server sets claims with Admin SDK (`setCustomUserClaims`); client calls `getIdToken(true)` to refresh; rules read `request.auth.token.role`. Claims limited to 1000 bytes; don't store big data; invalidate by revoking tokens when permissions change.

### Q87. Edge Functions deep dive (Supabase)
Deno runtime with Web-standard APIs, deployed globally, `Deno.env.get()` secrets (`supabase secrets set`), import npm packages via `npm:` specifiers, request timeouts and CPU limits (verify), CORS handling for browser calls, JWT verification enabled by default (`verify_jwt`). Use the user's JWT with `createClient(url, anonKey, { global: { headers: { Authorization } } })` to respect RLS, or service role for privileged work.
```ts
Deno.serve(async (req) => {
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: req.headers.get("Authorization")! } } });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  return Response.json({ id: user.id });
});
```

### Q88. Cloud Functions (2nd gen) performance
2nd gen runs on Cloud Run: concurrency per instance (up to 1000), larger memory/CPU, longer timeouts (up to 60 min for HTTP), `minInstances` for warm starts, global scope reuse of clients, lazy initialization, regional placement near the database. Avoid heavy imports in cold paths; split functions by dependency.

### Q89. Cold starts and mitigation
Both platforms may have cold starts: keep functions small, set `minInstances` (Firebase, costs money), use lighter runtimes (Edge Functions start fast), initialize SDK clients once outside handlers, and avoid chaining synchronous calls during startup.

### Q90. Background processing and queues
Firebase: Cloud Tasks (`enqueue` task queues), Pub/Sub triggers, Eventarc. Supabase: **Queues** (`pgmq`), `pg_cron`, database webhooks (via `pg_net`) to Edge Functions, or an external queue (BullMQ with Redis, see `031_Redis-and-Caching.md`). Use idempotency keys and DLQs.

### Q91. Realtime scaling limits (Supabase)
Postgres Changes are processed by a single logical replication consumer per publication and check RLS per subscriber, which limits throughput. Recommended for scale: **Broadcast** with `realtime.send`/`broadcast_changes` triggers, private channels with RLS on `realtime.messages`, and keeping payloads small. Monitor Realtime reports and connection quotas by plan.

### Q92. Storage at scale
Use CDN-friendly paths, resumable uploads (TUS in Supabase, resumable in Firebase), image transformations (Supabase Image Transformation, Firebase Resize Extension), lifecycle rules (Cloud Storage buckets), signed upload URLs for direct-to-storage uploads, and virus scanning pipelines. Keep metadata (owner, status) in the database.

### Q93. Data consistency patterns in Firestore
Use transactions for read-modify-write invariants, batched writes for multi-document atomic updates (500 limit), Functions for eventual consistency of denormalized copies, `serverTimestamp()`, `increment()`, and optimistic UI with reconciliation. Cross-collection invariants (unique usernames) via a `usernames/{name}` document created in a transaction.

### Q94. Unique constraints in Firestore vs Postgres
Firestore has no unique indexes: enforce uniqueness by using the unique value as the document ID (or reserving it in a lookup document inside a transaction) and rules that prevent overwrites. Postgres: `UNIQUE` constraints and `ON CONFLICT`; handle `23505`.

### Q95. Soft delete and archival
Firestore: `deletedAt` field + query filter, TTL policies (`deleteAt` timestamp field with Firestore TTL) for auto-expiry, BigQuery export for history. Supabase/Postgres: `deleted_at` + RLS filter or views, `pg_cron` archive jobs, partitioning for old data.

### Q96. Data import/export and BigQuery
Firestore → BigQuery via the "Stream Firestore to BigQuery" extension or exports; Supabase → analytics via logical replication, foreign data wrappers, ETL (Airbyte), or `pg_dump`. Use BigQuery/warehouse for analytics instead of heavy production queries.

### Q97. Searching: patterns for each platform
Firestore: external search (Algolia/Typesense/Meilisearch/Elasticsearch, see `032_Elasticsearch.md`) fed by Functions; vector search for semantic. Supabase: Postgres FTS, `pg_trgm`, `pgvector`; for rich relevance an external engine remains an option.

### Q98. Running Supabase locally and in CI
`supabase start` for the local stack; in CI run `supabase db reset`, execute pgTAP tests, regenerate types and diff to catch drift (`supabase db diff --linked`). For Firebase use `firebase emulators:exec "npm test"` which starts emulators, runs tests, then stops them.

### Q99. Testing Security Rules and RLS *(Must-know)*
```ts
// Firebase rules unit test
import { initializeTestEnvironment, assertSucceeds, assertFails } from "@firebase/rules-unit-testing";
const env = await initializeTestEnvironment({ projectId: "demo", firestore: { rules: fs.readFileSync("firestore.rules", "utf8") } });
const alice = env.authenticatedContext("alice").firestore();
await assertSucceeds(setDoc(doc(alice, "users/alice"), { name: "Alice" }));
await assertFails(setDoc(doc(alice, "users/bob"), { name: "Hacked" }));
```
```sql
-- Supabase pgTAP
begin; select plan(2);
set local role authenticated; set local request.jwt.claims to '{"sub":"11111111-1111-1111-1111-111111111111"}';
select is((select count(*) from todos where user_id <> '11111111-1111-1111-1111-111111111111'), 0::bigint, 'cannot see others');
select throws_ok($$insert into todos(user_id,title) values ('22222222-2222-2222-2222-222222222222','x')$$, '42501');
select * from finish(); rollback;
```

### Q100. CI/CD pipelines
Firebase: GitHub Actions with `FirebaseExtended/action-hosting-deploy` for preview channels; `firebase deploy --only firestore:rules,firestore:indexes,functions` using a service account/Workload Identity. Supabase: GitHub integration runs migrations on branches, or `supabase db push` with an access token; run tests and type generation first. Keep secrets in CI, never in the repo.

### Q101. Secrets and configuration
Firebase Functions: `defineSecret()` + Secret Manager (`firebase functions:secrets:set`), `defineString` params. Supabase: `supabase secrets set` for Edge Functions, Vault extension for DB-stored secrets. Never expose service account JSON/service role keys in client bundles or repos.

### Q102. Rate and quota limits to know
Firestore: 1 MiB per document, 500 writes per batch, ~1 sustained write/s per document, 10 MiB request size, index entry limits, 40,000 index entries per write (verify numbers). Supabase: payload limits, REST max rows (default 1000, configurable), connection limits per compute tier, Realtime message/connection quotas, Edge Function limits (CPU/memory/time), Auth email rate limits (low defaults unless custom SMTP).

### Q103. Custom SMTP and email deliverability
Supabase Auth's default email service is rate-limited and for testing; configure custom SMTP (SES, Resend, Postmark) for production. Firebase email templates send from `noreply@<project>.firebaseapp.com` by default; customize domain and use Trigger Email extension for transactional mail.

### Q104. Migrating Firebase Auth users to Supabase (or vice versa)
Export users (`firebase auth:export`) including password hashes (scrypt); Supabase supports importing with compatible hashing or a gradual migration on first login (verify the hash with the Firebase scheme and re-hash). Preserve UIDs in a mapping column, migrate OAuth identities, and redirect sessions. Plan for MFA/phone users separately.

### Q105. Migrating Firestore to Postgres
Map collections to tables (normalize denormalized copies), export via Admin SDK scripts or BigQuery, transform references into foreign keys, backfill with batched inserts (`COPY`), run dual-write or CDC during cutover, replace listeners with Realtime/polling, port Security Rules to RLS, and test on production-sized data. Treat it as a re-architecture, not a copy.

---

# 🟠 Part 4: Senior (5–7 years)

### Q106. Choosing between Firebase and Supabase for a product (decision framework) *(Must-know)*
1. **Data shape:** highly relational/reporting-heavy → Supabase; document/hierarchical with simple queries → Firestore.
2. **Client sync:** offline-first mobile with automatic conflict handling → Firebase.
3. **Team skills:** SQL-fluent → Supabase; NoSQL/Google Cloud → Firebase.
4. **Lock-in and compliance:** need open source/self-hosting/data portability → Supabase.
5. **Cost model:** read-heavy apps may be expensive per-read on Firestore; Supabase costs more predictable by compute.
6. **Ecosystem:** push (FCM), Crashlytics, Remote Config, App Check → Firebase; pgvector, SQL tooling, ORMs → Supabase.
Often the answer is a hybrid: Firebase for Auth/FCM/Analytics with Postgres for core data.

### Q107. Security architecture review for BaaS apps
Threat model the client as hostile. Enforce authorization in rules/RLS (default deny), validate shape and ownership, use server-only keys, restrict CORS/redirect URLs, enable App Check/CAPTCHA, protect admin paths with custom claims, audit logs, rotate keys, lock down Storage buckets, avoid exposing internal tables in `public`, test rules in CI and run Supabase **Security Advisor** / Firebase rules analysis.

### Q108. Designing authorization models
Patterns: owner-based; role-based (claims or tables); team/organization membership; attribute-based (ABAC) using row attributes; relationship-based (ReBAC; Zanzibar-like in Postgres via closure tables). Keep policy logic in helper functions (`security definer` with fixed `search_path`) for reuse and speed; keep the hot path indexed.

### Q109. RLS performance engineering
Use `(select auth.uid())`, index policy columns, avoid per-row function calls and correlated subqueries on large tables, use `security definer` helper functions for membership checks (they bypass RLS on the lookup table and can be inlined/cached), add `TO authenticated` role scoping to skip evaluation for `anon`, test with `EXPLAIN (ANALYZE)` under `set role authenticated` and JWT claims. Materialize permission sets for heavy ACL models.

### Q110. Handling large datasets in Supabase
Partition big tables (time/tenant), BRIN indexes for append-only data, archive cold data, read replicas (paid), keep REST payloads small with pagination (`range()`), use RPC for aggregates, `COPY` for bulk loads via direct connection, `pg_cron` for maintenance, monitor bloat/vacuum. See `028_PostgreSQL.md`.

### Q111. Handling large collections in Firestore
Cursors everywhere; no unbounded `getDocs`; shard hot documents; use collection group indexes sparingly; TTL policies for expiring data; scheduled exports; partition by time in IDs only if writes aren't monotonic hotspots (prefix with hash); denormalized aggregates updated by Functions; BigQuery for analytics.

### Q112. Cost control playbook
Firestore: reduce reads (caching/bundles/limits), avoid listeners on large lists, use `count()` aggregations, remove unused indexes, TTL old data, set budget alerts and App Check to stop abuse. Functions: right-size memory, avoid retry storms, use concurrency. Supabase: right-size compute, optimize egress (CDN for Storage), watch Realtime and Edge Function usage, index to reduce CPU, remove unused extensions/replicas. Review the bill monthly with per-feature attribution.

### Q113. Disaster recovery and business continuity
Define RPO/RTO. Firestore: PITR + scheduled exports to another region/project; multi-region databases for HA (SLA differences). Supabase: PITR add-on, cross-region read replicas, regular logical dumps stored off-platform, tested restores, infrastructure in code. Document runbooks (accidental delete, bad migration, leaked key rotation).

### Q114. Handling vendor lock-in
Firebase: isolate SDK usage behind repository/service interfaces, keep data model documented, export regularly, avoid deep coupling to rules/functions logic that can't be ported; consider Data Connect (Postgres) for portability. Supabase: mostly standard Postgres, but Auth, Realtime, Storage and Edge APIs are Supabase-specific; self-hosting is an exit path. Abstract auth providers behind OIDC where possible.

### Q115. Observability and incident response
Centralize logs (Cloud Logging, Supabase log drains), traces (OpenTelemetry in functions), error tracking (Sentry, Crashlytics), metrics/alerts on error rate, latency, quota usage, cost, auth failures. Create runbooks for rules misconfiguration, connection exhaustion, runaway listeners and abuse spikes.

### Q116. Realtime collaboration design
Options: Firestore listeners (document-level), RTDB for cursors/presence, Supabase Broadcast/Presence, CRDT libraries (Yjs, Automerge) syncing via Storage/Realtime, or dedicated services (Liveblocks, PartyKit). For text editing use CRDT/OT; for lists use fractional indexing; throttle high-frequency events; persist periodic snapshots.

### Q117. AI features on each platform
Supabase: embeddings in pgvector, hybrid search RPC with filters (RLS applied), Edge Functions calling LLM APIs, `pg_cron` for batch embedding jobs, rate limiting and usage tables. Firebase: Vertex AI in Firebase / Genkit, Firestore vector search, Functions for orchestration, App Check to protect AI endpoints. Guard prompts, cap tokens per user, log usage, and never expose model API keys to clients.

### Q118. Payments and subscriptions architecture
Use Stripe Checkout/Billing; webhooks (signature-verified) update an `subscriptions` table/collection; entitlements read from the server-owned record (not client-writable); sync with Auth custom claims or RLS joins; handle retries/idempotency and out-of-order events; reconcile periodically. Firebase has the Stripe extension; Supabase offers the Stripe wrapper/webhook patterns.

### Q119. Notifications architecture
FCM tokens stored per user/device (`users/{uid}/devices/{token}`), cleanup on `registration-token-not-registered` errors, topics for broadcast, per-user preferences, batching, quiet hours, deep links. For Supabase use FCM/APNs via Edge Functions or third-party (OneSignal, Knock, Novu), triggered by database webhooks/queues.

### Q120. Migration and schema evolution strategies
Firestore: schemaless, but versioned documents (`schemaVersion`), lazy migration on read, background migration Functions, rules tolerant of old shapes. Supabase: migrations in git, expand/contract, `NOT VALID` constraints, concurrent indexes, branches for preview, type regeneration in CI, and RLS tests part of every migration.

### Q121. Compliance (GDPR, SOC 2, HIPAA)
Know data residency (Firebase/GCP regions; Supabase regions), DPAs, subprocessors, encryption at rest and in transit, access logs, deletion workflows (delete user docs, Storage files, backups retention), HIPAA BAA availability (verify per vendor/plan), PII minimization, and secure admin access (SSO/MFA, least-privilege IAM).

### Q122. Anti-patterns that cause outages or bills
Test-mode rules in production, listeners on whole collections, unbounded queries, hot documents, per-keystroke writes, exposing service role, running admin scripts that loop through all documents without batching, Realtime Postgres Changes on very hot tables, direct connections from serverless exhausting Postgres, RLS without indexes.

### Q123. API design on top of BaaS
Decide between direct client access (fast to build) and a BFF/API layer (Cloud Functions/Edge Functions/Next.js route handlers) for complex validation, rate limiting, aggregation and third-party calls. Use RPCs/callable functions as stable contracts; version them; document with OpenAPI (PostgREST generates a spec).

### Q124. GraphQL options
Supabase: `pg_graphql` extension exposes a GraphQL API respecting RLS (`/graphql/v1`). Firebase: **Data Connect** provides GraphQL over Cloud SQL (PostgreSQL) with typed SDKs; Firestore has no native GraphQL (use Apollo + Functions). Choose based on need for typed queries and caching.

### Q125. Performance budgeting for BaaS apps
Track time-to-first-data, number of round trips per screen, listener counts, payload sizes, cache hit rates. Techniques: parallel fetches, prefetch, local cache (TanStack Query/SWR), bundles, pagination, edge caching for public data, avoiding waterfall requests (use embedded selects in PostgREST).

### Q126. Edge cases in Auth
Account linking (same email via different providers: Firebase `fetchSignInMethodsForEmail` deprecations and linking flows; Supabase identity linking), email enumeration protection, password policy, MFA enrollment/recovery codes, anonymous-to-permanent upgrades, session revocation, device limits, account deletion (cascade data), and bot protection.

### Q127. Event-driven architecture
Firestore triggers → Functions → Pub/Sub; Supabase DB triggers → `pg_net`/webhooks/queues → Edge Functions. Use the **transactional outbox** (insert event rows in the same transaction as business data) to avoid lost events, idempotent consumers, ordering keys, and dead-letter handling.

### Q128. Governance and platform standards
Naming conventions, ownership of rules/policies, mandatory tests, PR checklists (RLS enabled? indexes? backwards compatible?), cost and quota dashboards, secrets policy, environment promotion process, and a documented exit/migration plan.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q129. Architecting a greenfield product on a BaaS
Start with domain and access patterns; pick the primary datastore (Postgres vs Firestore); decide authz model (RLS/rules) and identity provider; define client/BFF boundaries; plan environments (dev/stage/prod, preview per PR); design for observability and cost; define the exit strategy; and schedule security review before launch. Prototype the riskiest 20% (realtime scale, offline, search) first.

### Q130. Scaling beyond BaaS limits
Triggers: need for complex background processing, high-throughput realtime, custom networking, strict compliance, or cost at scale. Strategy: strangler pattern: keep Auth and core data, move heavy components to services (Cloud Run/Kubernetes, queues, dedicated search, Redis); put an API gateway/BFF in front; migrate data stores last. Don't rewrite everything because one component hurts.

### Q131. Multi-region and latency strategy
Firestore multi-region or regional location choice (immutable after creation); keep Functions in the same region as the database; CDN for assets. Supabase: choose region near users, use read replicas for global reads, edge caching for public data, and accept single-primary write latency. For global write needs consider distributed SQL or regional data partitioning.

### Q132. Build vs buy vs self-host (Supabase)
Managed: fastest, includes backups/monitoring; self-hosted (Docker/Kubernetes): control, data residency, cost at scale, but you operate Postgres HA, upgrades, Realtime, Storage, Auth. Hybrid: managed Postgres (RDS/Neon) + selected Supabase components. Evaluate SRE capacity honestly.

### Q133. Risk register for BaaS reliance
Vendor outage (regional), pricing changes, deprecations (Dynamic Links shutdown, Realtime Database limits, API changes), data egress costs, feature gaps, security misconfigurations, noisy-neighbour limits. Mitigate with abstraction layers, backups, multi-region where available, monitoring of vendor status, and contractual SLAs for enterprise plans.

### Q134. Data platform integration
Operational store (Firestore/Postgres) → CDC/export → warehouse (BigQuery/Snowflake) → BI. Define data contracts, PII handling and retention. For Supabase, logical replication or ELT tools; for Firebase, BigQuery extension. Keep analytics off the primary to protect latency and cost.

### Q135. Team workflows
Local-first development with emulators/local stack, branch previews, schema-as-code, mandatory rules/RLS tests, code ownership for security-critical files, feature flags, staged rollouts (Remote Config/percentage flags), and post-incident reviews feeding checklists.

### Q136. Security programme
Periodic rules/policy audits (automated: Supabase Advisors, custom linters, rules coverage), secrets rotation, penetration testing focused on BaaS misconfigurations (open collections, public buckets, over-privileged functions), bug bounty, dependency scanning, and least-privilege IAM for service accounts.

### Q137. Cost governance at scale
Tag resources per feature/team, track per-request cost, set budget alerts and automated kill switches for runaway functions, review top queries by reads (Firestore usage) or by total time (`pg_stat_statements`), negotiate committed-use discounts/enterprise plans, and forecast with growth scenarios.

### Q138. Evaluating alternatives
Firebase: Appwrite, AWS Amplify (AppSync/DynamoDB), Convex (reactive TypeScript backend), PocketBase (single binary). Supabase: Neon + custom auth, Nhost (Hasura + Postgres), Hasura, Directus, plain Postgres + NestJS/Express. Evaluate on data model, lock-in, realtime, DX, pricing, compliance and community health.

### Q139. Migration execution playbook (any BaaS to another)
Inventory data/features → define target architecture → build compatibility layer → dual-write or CDC → backfill and verify (counts/checksums/sample reads) → shadow reads → gradual cutover by cohort/feature flag → rollback plan → decommission after a bake period → post-migration cost/perf review.

### Q140. Responsible data and AI governance
Document data use, retention and consent; minimize PII in embeddings; enforce tenant isolation in vector search; log model calls and access; review prompts/outputs for leakage; apply per-user quotas; and ensure deletion requests propagate to derived data (embeddings, caches, exports).

---

# 💻 Part 6: Hands-On Tasks & Code

### H1. Firestore rules for a multi-user notes app
```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    function signedIn() { return request.auth != null; }
    function isOwner(uid) { return signedIn() && request.auth.uid == uid; }

    match /users/{uid} {
      allow read, update: if isOwner(uid) && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role']);
      allow create: if isOwner(uid) && request.resource.data.role == 'user';
    }
    match /users/{uid}/notes/{noteId} {
      allow read, delete: if isOwner(uid);
      allow create, update: if isOwner(uid)
        && request.resource.data.keys().hasOnly(['title','body','updatedAt'])
        && request.resource.data.title is string && request.resource.data.title.size() between 1 and 120
        && request.resource.data.updatedAt == request.time;
    }
    match /{document=**} { allow read, write: if false; }   // default deny
  }
}
```

### H2. Supabase schema with RLS for a notes app
```sql
create table public.notes (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  body text,
  created_at timestamptz not null default now()
);
create index on public.notes (user_id, created_at desc);
alter table public.notes enable row level security;

create policy "select own" on public.notes for select to authenticated using ((select auth.uid()) = user_id);
create policy "insert own" on public.notes for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "update own" on public.notes for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "delete own" on public.notes for delete to authenticated using ((select auth.uid()) = user_id);
```

### H3. React hook: realtime Firestore list with cleanup
```tsx
function useNotes(uid: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  useEffect(() => {
    const q = query(collection(db, "users", uid, "notes"), orderBy("updatedAt", "desc"), limit(50));
    return onSnapshot(q, (snap) => setNotes(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Note, "id">) }))),
      (err) => console.error("listener error", err.code));
  }, [uid]);
  return notes;
}
```
Returning the unsubscribe function prevents leaked listeners and extra billed reads.

### H4. React hook: Supabase realtime with initial fetch
```tsx
function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  useEffect(() => {
    let active = true;
    supabase.from("notes").select("*").order("created_at", { ascending: false }).limit(50)
      .then(({ data }) => active && setNotes(data ?? []));
    const ch = supabase.channel("notes")
      .on("postgres_changes", { event: "*", schema: "public", table: "notes" }, (p) => {
        setNotes((cur) => p.eventType === "INSERT" ? [p.new as Note, ...cur]
          : p.eventType === "DELETE" ? cur.filter((n) => n.id !== (p.old as Note).id)
          : cur.map((n) => (n.id === (p.new as Note).id ? (p.new as Note) : n)));
      }).subscribe();
    return () => { active = false; supabase.removeChannel(ch); };
  }, []);
  return notes;
}
```

### H5. Firebase callable function with validation and App Check
```ts
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { z } from "zod";
const Input = z.object({ productId: z.string().min(1), qty: z.number().int().min(1).max(10) });

export const placeOrder = onCall({ enforceAppCheck: true, region: "asia-south1" }, async (req) => {
  if (!req.auth) throw new HttpsError("unauthenticated", "Sign in first");
  const { productId, qty } = Input.parse(req.data);
  return db.runTransaction(async (tx) => {
    const pref = db.doc(`products/${productId}`);
    const p = await tx.get(pref);
    if (!p.exists || p.data()!.stock < qty) throw new HttpsError("failed-precondition", "Out of stock");
    tx.update(pref, { stock: p.data()!.stock - qty });
    const oref = db.collection("orders").doc();
    tx.set(oref, { uid: req.auth!.uid, productId, qty, createdAt: FieldValue.serverTimestamp() });
    return { orderId: oref.id };
  });
});
```

### H6. Supabase RPC for an atomic stock decrement
```sql
create function public.place_order(p_product bigint, p_qty int) returns bigint
language plpgsql security invoker as $$
declare v_order bigint;
begin
  update products set stock = stock - p_qty where id = p_product and stock >= p_qty;
  if not found then raise exception 'out_of_stock' using errcode = 'P0001'; end if;
  insert into orders(user_id, product_id, qty) values (auth.uid(), p_product, p_qty) returning id into v_order;
  return v_order;
end $$;
```
Both statements commit or roll back together. Pair with RLS policies that allow the needed updates (or use `security definer` carefully with `set search_path = ''`).

### H7. Stripe webhook in a Supabase Edge Function
```ts
import Stripe from "npm:stripe@16";
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!);
Deno.serve(async (req) => {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();                                 // raw body for signature check
  let event: Stripe.Event;
  try { event = await stripe.webhooks.constructEventAsync(body, sig, Deno.env.get("STRIPE_WEBHOOK_SECRET")!); }
  catch { return new Response("bad signature", { status: 400 }); }

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { error } = await admin.from("stripe_events").insert({ id: event.id, type: event.type });   // unique id = idempotency
  if (error?.code === "23505") return new Response("duplicate", { status: 200 });
  // handle event.type ...
  return new Response("ok");
});
```
Deploy with `--no-verify-jwt` for webhooks (Stripe doesn't send a Supabase JWT) because signature verification is your auth.

### H8. Firestore distributed counter
```ts
const NUM_SHARDS = 10;
async function incrementViews(postId: string) {
  const shard = Math.floor(Math.random() * NUM_SHARDS);
  await setDoc(doc(db, "posts", postId, "views", String(shard)), { count: increment(1) }, { merge: true });
}
async function getViews(postId: string) {
  const snap = await getDocs(collection(db, "posts", postId, "views"));
  return snap.docs.reduce((n, d) => n + d.data().count, 0);
}
```
Spreads writes across documents to exceed the per-document write rate.

### H9. Vector search in Supabase (RAG building block)
```sql
create extension if not exists vector;
create table docs (id bigserial primary key, tenant_id uuid not null, content text, embedding vector(1536));
create index on docs using hnsw (embedding vector_cosine_ops);
alter table docs enable row level security;
create policy "tenant read" on docs for select to authenticated
  using (tenant_id = ((select auth.jwt()) -> 'app_metadata' ->> 'tenant_id')::uuid);

create function match_docs(query_embedding vector(1536), match_count int default 5)
returns table (id bigint, content text, similarity float) language sql stable as $$
  select id, content, 1 - (embedding <=> query_embedding) as similarity
  from docs order by embedding <=> query_embedding limit match_count; $$;
```
```ts
const { data } = await supabase.rpc("match_docs", { query_embedding: vec, match_count: 5 });   // RLS applied
```

### H10. Emulator-based CI script
```json
// package.json
"scripts": { "test:rules": "firebase emulators:exec --only firestore \"vitest run rules\"" }
```
```bash
supabase start && supabase db reset && supabase test db && supabase stop
```

### H11. Firebase Auth server verification in Express
```ts
import admin from "firebase-admin";
admin.initializeApp();
export async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401).json({ error: "Missing token" });
  try { req.user = await admin.auth().verifyIdToken(token, true); next(); }
  catch { res.status(401).json({ error: "Invalid token" }); }
}
```

### H12. Next.js + Supabase SSR middleware (session refresh)
```ts
// middleware.ts
import { createServerClient } from "@supabase/ssr";
export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll: () => req.cookies.getAll(),
               setAll: (list) => { list.forEach(({ name, value, options }) => res.cookies.set(name, value, options)); } },
  });
  const { data: { user } } = await supabase.auth.getUser();       // validates with the Auth server
  if (!user && req.nextUrl.pathname.startsWith("/app")) return NextResponse.redirect(new URL("/login", req.url));
  return res;
}
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. `FirebaseError: Missing or insufficient permissions`
Rules denied the request. Check the authenticated user, the exact path, request data shape and the query constraints (rules aren't filters). Use the Rules Playground and emulator logs; add `where` clauses matching rule conditions.

### D2. `The query requires an index`
Create the composite index from the link in the error or add it to `firestore.indexes.json`. Index builds take time on large collections; deploy indexes before releasing the query.

### D3. Supabase returns `[]` / empty results unexpectedly
RLS is enabled with no matching `SELECT` policy, user is `anon` instead of `authenticated` (session missing/expired), filters wrong. Test in SQL: `set role authenticated; set request.jwt.claims ...`. RLS returns empty sets, not errors, for reads.

### D4. `new row violates row-level security policy for table` (42501)
`WITH CHECK` failed on insert/update: e.g. `user_id` not set to `auth.uid()`. Use column default `auth.uid()` or send the right id; make sure the user is authenticated.

### D5. Insert works but `.select()` returns null
After `insert(...).select()` PostgREST needs a `SELECT` policy to return the new row. Add select policy or drop `.select()`.

### D6. `PGRST116: JSON object requested, multiple (or no) rows returned`
`.single()` got 0 or >1 rows. Use `.maybeSingle()` for optional rows and ensure unique filters.

### D7. Realtime events not arriving (Supabase)
Table not added to the `supabase_realtime` publication, RLS blocks the subscriber's SELECT, filter syntax wrong, channel not `subscribe()`d, `replica identity` missing for UPDATE/DELETE old values (`alter table ... replica identity full`), or quota reached.

### D8. Cloud Function runs twice or loops
At-least-once delivery or the function writes to the document that triggers it (infinite loop). Make handlers idempotent, guard with state checks, use conditional writes, and separate trigger/output collections.

### D9. Function timeouts or `Cold start` latency spikes
Heavy imports, large dependencies, slow external calls, no `minInstances`. Optimize bundle, lazy-load, raise timeout/memory appropriately, use concurrency, call dependencies in parallel.

### D10. `auth/popup-closed-by-user` / OAuth redirect errors
Popup blocked or closed, domain not in authorized domains, wrong redirect URI in the provider console. Use redirect flow on mobile, add domains, verify client IDs. In Supabase check Site URL / Redirect URLs list.

### D11. Session lost after refresh in Next.js SSR
Cookies not persisted via middleware, `getSession()` used on the server instead of `getUser()`, or cookies set with wrong domain/secure flags. Follow `@supabase/ssr` setup; ensure middleware runs and matcher includes routes.

### D12. Supabase `too many connections` / `remaining connection slots reserved`
Serverless functions opening direct connections. Use Supavisor transaction mode (port 6543), reduce pool size per function, close idle connections, and upgrade compute only after fixing usage.

### D13. Firestore bill spike
Listener on a huge collection, infinite loop, missing `limit`, aggregated stats fetched by reading all docs, bots without App Check. Check Usage tab and Cloud Monitoring per method; add limits, caching, App Check, budget alerts.

### D14. Storage upload fails with 403/`new row violates row-level security` (Supabase) or `storage/unauthorized` (Firebase)
Policy/rule doesn't allow the path or content type, user not signed in, bucket private. Match policy to path convention (`<uid>/file`), use `upsert` policies correctly (needs both insert and update), check file size limits.

### D15. Edge Function returns 401 or CORS errors
`verify_jwt` rejecting missing/invalid Authorization header, or missing CORS headers/`OPTIONS` handler. Return `Access-Control-Allow-*` headers and handle preflight; pass `Authorization` from the client (`functions.invoke` does automatically).

---

# 🧩 Part 8: Tricky Questions

### T1. Is the Firebase `apiKey` a secret?
No. It identifies the project for client SDKs. Protection comes from Security Rules, Auth and App Check. Restrict API key usage (HTTP referrers, API restrictions) as defence in depth.

### T2. Is the Supabase anon key a secret?
No, it's meant to be public, but it's only safe if **RLS** is enabled with correct policies. The **service_role** key is secret.

### T3. Do Firestore Security Rules filter query results?
No. A query is allowed only if rules permit **every** possible result; otherwise it errors.

### T4. Does RLS apply when I use the service role or a server-side ORM connecting as `postgres`?
No. Those roles bypass RLS (service_role has `BYPASSRLS`; `postgres` is superuser-like). Enforce authorization in code or set role/claims per request.

### T5. Are Firestore transactions the same on client and server?
No. Client SDK uses optimistic concurrency (retries on conflicting writes, needs connectivity); Admin SDK uses pessimistic locks. Both must keep reads before writes.

### T6. Is Firestore "strongly consistent"?
Yes for document reads and queries (including indexes) within a database; offline clients see local latency-compensated data that may later be reconciled.

### T7. Does `onSnapshot` cost a read per update?
Each document added/changed in the result set triggers a billed read to the listener; the initial result set costs reads for every document returned. Detached listeners incur none; reconnecting after >30 minutes offline re-reads.

### T8. Can Firestore do `LIKE '%term%'`?
No. Only range prefix tricks (`>= term`, `<= term+''`). Use a search service.

### T9. Does Supabase "delete user" remove their data?
Deleting from `auth.users` cascades only where FKs declare `on delete cascade`. Storage objects and other external data aren't removed automatically.

### T10. What does `auth.uid()` return for `anon`?
`null`. Policies like `auth.uid() = user_id` evaluate to null (not true), denying access.

### T11. Are views protected by RLS?
Views run with the view owner's privileges by default and can bypass RLS; use `security_invoker = true` (Postgres 15+) or avoid exposing such views.

### T12. Why can a Cloud Function deploy fail with Spark plan?
Cloud Functions (and outbound network calls) require the Blaze plan.

### T13. Is Realtime Database cheaper than Firestore?
Depends: RTDB bills bandwidth/storage (cheap for small, high-frequency data), Firestore bills operations (cheap for sparse access). Workload decides.

### T14. Does Supabase support offline-first like Firestore?
Not built in. Use local-first tools (PowerSync, ElectricSQL, WatermelonDB, RxDB with replication) alongside Supabase.

### T15. What's the difference between `signInWithPassword` success and an active session when email confirmation is required?
With confirmations enabled, `signUp` returns a user but no session until the email is verified; handling that state in the UI is required.

### T16. Can I use Firebase Auth with Supabase RLS?
Yes via third-party auth integration (Supabase accepts Firebase JWTs configured as a trusted provider; verify setup) so `auth.jwt()` claims derive from Firebase tokens.

### T17. Do Firebase custom claims update instantly?
No. They apply on the next ID token refresh (up to an hour) unless the client force-refreshes (`getIdToken(true)`).

### T18. Is free tier enough for production?
Rarely. Free projects have quotas, may pause (Supabase free projects pause after inactivity), and lack backups/SLAs. Plan paid tiers.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- **Firebase DB types?** Firestore, Realtime Database.
- **Supabase DB?** PostgreSQL.
- **Client authorization in Firebase?** Security Rules.
- **Client authorization in Supabase?** Row Level Security.
- **Secret Supabase key?** `service_role`.
- **Public Supabase key?** anon/publishable.
- **Firebase admin access?** Admin SDK (bypasses rules).
- **Firestore doc limit?** 1 MiB.
- **Firestore batch limit?** 500 writes.
- **Firestore joins?** None: denormalize.
- **Push notifications?** FCM.
- **Local emulation?** Firebase Emulator Suite / `supabase start`.
- **Serverless code?** Cloud Functions / Edge Functions.
- **Supabase function runtime?** Deno.
- **Pooled connections?** Supavisor (port 6543 transaction mode).
- **Type generation?** `supabase gen types typescript`.
- **Vector search?** pgvector (Supabase), Firestore vector fields.
- **Offline support?** Firebase yes; Supabase via add-ons.
- **Realtime presence?** RTDB `onDisconnect`, Supabase Presence.
- **Custom roles?** Custom claims / `app_metadata`.
- **Rate-abuse protection?** App Check, CAPTCHA.
- **Firebase plans?** Spark (free), Blaze (pay-as-you-go).
- **Counter hot spot fix?** Distributed counters.
- **Pagination?** Cursors.
- **Search?** External engine / Postgres FTS.
- **Backups?** Firestore export/PITR; Supabase backups/PITR.
- **Preview deploys?** Hosting channels / Supabase branches.
- **Never in client?** Service account / service_role key.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about an app you built on Firebase or Supabase.
STAR: "I built a team task manager with Supabase: Postgres schema with organizations, memberships and tasks; RLS policies keyed on membership; Edge Functions for invitations and Stripe webhooks; Realtime Broadcast for live updates. pgTAP tests covered every policy. We shipped in 5 weeks with a 2-person team and handled 20k MAU on a Pro plan."

### P2. Describe a security problem you found and fixed.
"We found a collection readable by any signed-in user because a test rule had survived into production. I wrote rules unit tests with the emulator, added default-deny, validated field shapes, moved admin actions to callable functions with custom-claim checks, and added the tests to CI so the rule set can't regress."

### P3. How did you control costs?
"Firestore reads spiked after a UI change added listeners to large lists. I added `limit`, cursors, memoized listeners, replaced counters with `count()` aggregations, and enabled App Check. Reads dropped 70% and the bill was back within budget alerts."

### P4. Why did you choose Supabase over Firebase (or vice versa)?
"Our data was relational with reporting needs, and the team knew SQL; RLS gave us a single authorization layer, and Postgres kept exit options open. For a separate mobile-first chat app with offline needs we chose Firebase."

### P5. Describe a migration you led.
"Moved auth users and Firestore data to Postgres: mapped collections to tables, exported with scripts, migrated password hashes with gradual re-hash on login, dual-wrote for two weeks, compared counts/checksums, then cut over by cohort behind a flag. Zero data loss and p95 latency improved 30%."

### P6. How do you test authorization?
"Every rule/policy has allowed and denied tests: Firebase rules unit tests with the emulator and Supabase pgTAP running as `anon` and `authenticated` with crafted JWT claims. CI blocks merges if tests fail."

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- **BaaS fundamentals:** managed backend, client SDK model, trade-offs, lock-in.
- **Firebase:** Auth, Firestore, RTDB, Storage, Functions, Hosting/App Hosting, FCM, Remote Config, App Check, Analytics/Crashlytics, Emulators, Extensions, Data Connect.
- **Supabase:** Postgres, Auth, RLS, PostgREST, GraphQL, Realtime, Storage, Edge Functions, Vault, pgvector, cron/queues, CLI, branching.
- **Security:** Rules vs RLS, JWT, custom claims, service accounts, key handling, CORS, redirect URLs, abuse protection.
- **Data modelling:** NoSQL denormalization vs relational design, indexes, hot spots, counters, pagination.
- **Operations:** emulators, CI/CD, environments, backups, monitoring, cost control, quotas.
- **Advanced:** multi-tenancy, event-driven design, migrations, vector/AI, payments, offline-first.

## Mixed topics
- With React/Next.js: auth state, SSR cookies, listeners, caching.
- With Node/Express: Admin SDK token verification, service-role usage.
- With Prisma/Drizzle: pooled connections, RLS bypass (`033_Prisma-and-ORMs.md`).
- With Redis: rate limiting/caching in front of BaaS (`031_Redis-and-Caching.md`).
- With Elasticsearch/Algolia: search sync (`032_Elasticsearch.md`).
- With MongoDB: document-modelling comparison (`030_MongoDB.md`).
- With Stripe/Razorpay: webhooks, entitlements.
- With AI: embeddings, RAG, rate limits and cost caps.

---

# 🔬 Part 12: Platform Internals

### I1. Firestore architecture
Built on Google's Spanner-based storage with synchronous replication; documents stored sorted by key; every field is indexed in single-field indexes (sorted index entries) enabling range scans; composite indexes serve multi-field queries; queries scale with result size, not collection size.

### I2. Firestore listeners protocol
Clients open a persistent stream (WebChannel/gRPC), register targets (queries), and receive change events plus resume tokens so reconnects replay only missed changes if within the retention window (~30 minutes).

### I3. Security Rules evaluation
Rules are compiled and evaluated server-side per request/operation on the target resource with `request` and `resource` context; they may perform bounded `get()/exists()` lookups (billed) and cannot be used for filtering or loops.

### I4. Firebase Auth tokens
ID token: RS256 JWT with `iss`, `aud` (project id), `sub` (uid), `auth_time`, `firebase.sign_in_provider`, custom claims. Refresh tokens are long-lived and exchanged at the Secure Token service. `verifyIdToken` validates signature (Google public keys, cached) and claims.

### I5. Supabase request path
Client → API gateway (Kong) → PostgREST → Postgres. PostgREST validates the JWT, runs `SET LOCAL ROLE` to `anon`/`authenticated` and sets `request.jwt.claims` (GUCs), then executes the generated SQL so RLS reads claims via `auth.uid()`/`auth.jwt()`.

### I6. Supabase Auth (GoTrue)
A Go service managing users in `auth.users`, identities, sessions, refresh tokens, MFA factors; issues JWTs signed with the project secret (or asymmetric keys on newer setups); email/SMS via SMTP/providers; hooks for custom logic.

### I7. Realtime service
Elixir/Phoenix application: subscribes to Postgres logical replication (WAL) for Postgres Changes, authorizes with RLS, and fans out via channels; Broadcast and Presence use in-memory pub/sub and CRDTs across the cluster.

### I8. Storage service
Metadata in Postgres (`storage.objects`, `storage.buckets`) with RLS; file bytes in S3-compatible object storage; image transformations via an imgproxy-like service; resumable uploads via TUS.

### I9. Cloud Functions 2nd gen
Backed by Cloud Run and Eventarc: containers autoscaled by request concurrency, triggered by CloudEvents; at-least-once semantics for events; scale-to-zero unless `minInstances` is set.

### I10. Supavisor
A multi-tenant Postgres connection pooler (Elixir) supporting session and transaction modes, scaling client connections far beyond Postgres' `max_connections`.

---

# 📊 Part 13: Reference Tables

### Firebase product map
| Need | Product |
|---|---|
| Identity | Authentication / Identity Platform |
| Document DB | Cloud Firestore |
| Low-latency JSON tree | Realtime Database |
| Files | Cloud Storage |
| Server logic | Cloud Functions, Cloud Run |
| Hosting | Hosting, App Hosting |
| Push | Cloud Messaging |
| Config/flags | Remote Config |
| Abuse protection | App Check |
| Monitoring | Analytics, Crashlytics, Performance |
| SQL | Data Connect (Cloud SQL) |

### Supabase product map
| Need | Product |
|---|---|
| Database | Postgres (+ extensions) |
| Identity | Auth (GoTrue) |
| API | PostgREST, pg_graphql |
| Live updates | Realtime (Changes, Broadcast, Presence) |
| Files | Storage |
| Server logic | Edge Functions, DB functions, Queues, Cron |
| Secrets | Vault, function secrets |
| AI | pgvector, Edge Functions |
| Ops | Logs, Advisors, Branching, CLI |

### Authorization comparison
| | Firebase Rules | Supabase RLS |
|---|---|---|
| Language | Custom rules DSL | SQL policies |
| Scope | Per path/operation | Per table/row/command |
| Filtering | No (all-or-nothing) | Yes (rows filtered) |
| Cross-document checks | `get()/exists()` (billed, limited) | Joins/subqueries |
| Testing | Emulator + rules-unit-testing | pgTAP / SQL |
| Bypass | Admin SDK | service_role / superuser |

### Data model comparison
| | Firestore | Postgres (Supabase) |
|---|---|---|
| Joins | No | Yes |
| Transactions | Yes (limits) | Full ACID |
| Schema | Flexible | Enforced |
| Indexing | Automatic + composite | Manual |
| Aggregations | count/sum/avg | Full SQL |
| Unique constraints | Manual patterns | Native |
| Offline sync | Native | Add-on |

### Common limits (verify current values)
| Item | Value |
|---|---|
| Firestore document size | 1 MiB |
| Firestore batch/transaction writes | 500 |
| Firestore sustained writes per document | ~1/s |
| Firebase ID token lifetime | 1 hour |
| Supabase JWT default expiry | 1 hour |
| PostgREST max rows (default) | 1000 |
| Custom claims size | 1000 bytes |

### Version/feature highlights (verify)
| Item | Notes |
|---|---|
| Firebase JS SDK v9+ | Modular tree-shakable API |
| Functions 2nd gen | Cloud Run based, concurrency, longer timeouts |
| Firestore aggregations | `count`, `sum`, `average` |
| Firestore vector search | KNN on vector fields |
| Supabase `@supabase/ssr` | Cookie-based SSR auth |
| Supabase Queues/Cron | `pgmq`, `pg_cron` |
| Firebase Data Connect | PostgreSQL via GraphQL |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
```ts
await setDoc(doc(db, "users", "u1"), { a: 1 });
await setDoc(doc(db, "users", "u1"), { b: 2 });
console.log((await getDoc(doc(db, "users", "u1"))).data());
```
**Output:** `{ b: 2 }` (second `setDoc` replaces the document; use `{ merge: true }` to keep `a`).

### O2.
```ts
await updateDoc(doc(db, "users", "missing"), { a: 1 });
```
**Result:** rejects with `not-found` — `updateDoc` requires an existing document.

### O3.
```ts
const { data, error } = await supabase.from("notes").select("*").eq("id", 999).single();
```
**Output:** `data: null`, `error.code: "PGRST116"` (no rows for `.single()`); `.maybeSingle()` returns `data: null, error: null`.

### O4.
RLS enabled on `notes` with only a `SELECT` policy for `authenticated`.
```ts
await supabase.from("notes").insert({ title: "x" });
```
**Result:** error `42501` "new row violates row-level security policy" (no `INSERT` policy).

### O5.
Anonymous visitor runs `supabase.from("notes").select("*")` on a table with a policy `using (auth.uid() = user_id)` for `to authenticated`.
**Output:** `data: []` with no error (no policy applies to `anon`, so zero rows).

### O6.
```ts
const q = query(collection(db, "posts"), where("views", ">", 10), orderBy("createdAt"));
```
**Result:** error: inequality filter field must be first in `orderBy` for older rules / requires an appropriate composite index (`views` + `createdAt`); the SDK error links to index creation. (Newer Firestore versions relax some inequality limits; the index is still required.)

### O7.
```ts
const batch = writeBatch(db);
batch.set(doc(db, "a", "1"), { x: 1 });
batch.update(doc(db, "a", "missing"), { y: 2 });
await batch.commit();
```
**Result:** commit rejects (`not-found`); **neither** write is applied (atomic).

### O8.
Counter doc `stats/s1 { n: 0 }`; 100 clients concurrently run `updateDoc(ref, { n: increment(1) })`.
**Output:** `n` ends at 100 (server-side atomic increment), subject to the ~1 write/s sustained limit causing contention errors if too frequent.

### O9.
```ts
const { data } = await supabase.from("todos").insert({ title: "a" }).select();
```
**Output:** array with the inserted row (`[{ id, title, ... }]`) if a SELECT policy allows; otherwise `[]`/error depending on policies.

### O10.
```ts
onAuthStateChanged(auth, (u) => console.log(u?.uid ?? "signed out"));
await signOut(auth);
```
**Output:** logs the uid first (if signed in), then `signed out` after `signOut`.

### O11.
```sql
select auth.uid();     -- run in SQL editor as postgres role
```
**Output:** `null` (no JWT claims in the session); simulate with `set local request.jwt.claims = '{"sub":"<uuid>"}'`.

### O12.
```ts
const snap = await getDocs(collection(db, "users"));   // rules: allow read only if resource.data.public == true
```
**Result:** `permission-denied` if some documents aren't public — the query must include `where("public","==",true)`.

---

# ✅ Part 15: MCQs

**1. Which key must never be shipped to a browser?**
A) Firebase web `apiKey`  B) Supabase anon key  C) Supabase `service_role` key  D) Firebase `projectId`
**Answer: C**

**2. Row Level Security belongs to:**
A) Firestore  B) PostgreSQL / Supabase  C) Realtime Database only  D) FCM
**Answer: B**

**3. Firestore queries that violate rules:**
A) Return only allowed docs  B) Fail entirely  C) Return empty arrays  D) Log warnings
**Answer: B**

**4. Which Supabase function runtime is used for Edge Functions?**
A) Node.js  B) Deno  C) Python  D) Go only
**Answer: B**

**5. Firestore max document size:**
A) 64 KB  B) 1 MiB  C) 16 MB  D) Unlimited
**Answer: B**

**6. To avoid hot-document writes for counters use:**
A) One document  B) Distributed counters (shards)  C) Offsets  D) Arrays
**Answer: B**

**7. Which SDK bypasses Security Rules?**
A) Web SDK  B) Admin SDK  C) Android SDK  D) Emulator UI
**Answer: B**

**8. `auth.uid()` in Supabase returns:**
A) The role name  B) The authenticated user's UUID (or null)  C) The IP address  D) The project ref
**Answer: B**

**9. Supavisor transaction mode is best for:**
A) Long-lived servers using prepared statements  B) Serverless/short-lived clients  C) Migrations  D) Replication
**Answer: B**

**10. Firebase Cloud Functions require which plan?**
A) Spark  B) Blaze  C) Any  D) Enterprise only
**Answer: B**

**11. Firestore pagination should use:**
A) Large offsets  B) Cursors (`startAfter`)  C) Random reads  D) Full scans
**Answer: B**

**12. Custom claims in Firebase take effect:**
A) Instantly  B) After the ID token refreshes  C) Only after redeploy  D) Never
**Answer: B**

**13. A Postgres view in Supabase may bypass RLS unless:**
A) It's materialized  B) `security_invoker = true`  C) It's in `private`  D) It's unlogged
**Answer: B**

**14. Which provides offline sync out of the box?**
A) Firestore mobile/web SDKs  B) PostgREST  C) pgvector  D) Supavisor
**Answer: A**

**15. `PGRST116` indicates:**
A) Unique violation  B) `.single()` found 0 or multiple rows  C) Auth failure  D) Timeout
**Answer: B**

**16. Best way to implement atomic multi-statement logic on Supabase from a client:**
A) Multiple REST calls  B) A Postgres function called via `rpc`  C) Local storage  D) Realtime channel
**Answer: B**

**17. App Check helps protect against:**
A) SQL injection  B) Requests from non-genuine apps/bots  C) Slow queries  D) Index bloat
**Answer: B**

**18. For Firestore unique usernames you should:**
A) Add a unique index  B) Use the username as a document ID in a transaction  C) Use arrays  D) Skip checks
**Answer: B**

**19. Which is NOT supported natively by Firestore?**
A) Realtime listeners  B) Joins  C) Transactions  D) Aggregation count
**Answer: B**

**20. Supabase Postgres Changes scale best for high fan-out when replaced by:**
A) Polling  B) Broadcast  C) Larger JWTs  D) More indexes
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

1. **Leaving Firestore in test mode** (`allow read, write: if true`) in production.
2. **Not enabling RLS** on exposed Postgres tables.
3. **Shipping the Supabase service_role key or service account JSON** in client code.
4. **Assuming rules filter results** (queries must match rule constraints).
5. **Trusting `user_metadata`** for authorization.
6. **Unbounded `getDocs`/listeners on large collections** (cost and performance).
7. **Hot documents/counters** without sharding.
8. **Skipping composite indexes** until production.
9. **No idempotency** in event-triggered functions.
10. **Using `getSession()` on the server** as proof of identity.
11. **Policies without indexes** or using `auth.uid()` unwrapped per row.
12. **Exposing views/functions that bypass RLS** (`security definer` without safe `search_path`).
13. **Not handling `error`** from Supabase client responses.
14. **Running ORMs as `postgres` and assuming RLS applies.**
15. **Direct DB connections from serverless** without pooling.
16. **No budget alerts or App Check** (billing surprises/abuse).
17. **Editing prod schema in the dashboard** (drift) instead of migrations.
18. **No tests for rules/policies.**
19. **Forgetting redirect URL / authorized domain configuration.**
20. **Relying on free tier/auto-pausing projects** for production.
21. **Deep vendor coupling** without an exit/abstraction plan.
22. **Storing large blobs or unbounded arrays in documents.**

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You treat the **client as untrusted** and make Rules/RLS default-deny, tested in CI.
- You choose Firestore vs Postgres from **access patterns and consistency needs**, and can model both well.
- You understand **cost drivers** (reads, listeners, egress, compute) and design to reduce them.
- You know **token/claim lifecycles** and server-side verification rather than trusting the client.
- You handle **idempotency, retries and at-least-once** semantics in functions and webhooks.
- You manage **connections** (Supavisor/pgbouncer) and RLS performance (`select auth.uid()`, indexes).
- You use **emulators/local stack, migrations and CI** instead of console edits.
- You plan **backups, PITR, multi-env promotion and exit strategy**.
- You integrate **search, payments, AI and analytics** cleanly around the BaaS.
- You compare options honestly (Firebase, Supabase, Amplify, Convex, custom backend) and say when not to use a BaaS.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Commands
```bash
firebase login | init | emulators:start | deploy --only firestore:rules,functions,hosting
firebase use --add            firebase functions:secrets:set NAME
supabase init | start | stop | status
supabase migration new <name> supabase db reset | push | diff -f <name>
supabase gen types typescript --local > database.types.ts
supabase functions serve | deploy <name>      supabase secrets set KEY=value
```

### Security checklist
Default deny • validate shape/ownership • no test-mode rules • RLS on every exposed table with `USING` + `WITH CHECK` • service keys server-only • App Check/CAPTCHA • redirect URLs allow-listed • roles in claims/`app_metadata` (not `user_metadata`) • tests for allowed/denied cases.

### Performance and cost checklist
Cursors and `limit` • narrow listeners and unsubscribe • composite indexes • distributed counters • `count()` aggregations • RLS policy indexes and `(select auth.uid())` • pooled connections • CDN for Storage • budget alerts.

### Pattern quick picks
Atomic multi-step (Supabase) → RPC function • Atomic multi-doc (Firestore) → transaction/batch • Live UI → listeners / Broadcast • Presence → RTDB `onDisconnect` / Presence • Webhooks → verified signature + idempotency table • Search → external engine / FTS / pgvector • Multi-tenant → `tenant_id` + membership policies • Admin → custom claims + server-side checks.

### Interview strategy
1. Clarify data shape, scale, offline/realtime needs, team skills, compliance.
2. Choose the platform and justify with trade-offs (not preference).
3. Show the auth + authorization model (rules/RLS) with one concrete example.
4. Discuss data modelling, indexes, pagination and cost controls.
5. Cover testing, CI/CD, environments, observability and backups.
6. Close with a measured outcome and an exit/migration plan.

### Final checklist before the interview
- [ ] Explain BaaS, Firebase vs Supabase, and when to pick each.
- [ ] Write Firestore CRUD, listeners, transactions, batches; explain limits and indexes.
- [ ] Write Postgres schema + RLS policies; explain `USING` vs `WITH CHECK` and bypass roles.
- [ ] Explain Security Rules pitfalls (not filters, default deny, field validation).
- [ ] Explain auth tokens/claims, server verification and SSR cookie flows.
- [ ] Design counters, pagination, feeds and multi-tenancy on each platform.
- [ ] Use Functions/Edge Functions safely: idempotency, secrets, webhooks, CORS.
- [ ] Control cost and abuse (App Check, limits, caching, budgets).
- [ ] Describe migrations, testing (emulator, pgTAP) and CI/CD.
- [ ] Prepare a project story, a security story and a cost/performance story with numbers.
