# WebSockets & Realtime Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets the **WebSocket protocol (RFC 6455)** and the browser **WebSocket API**, **Server-Sent Events (SSE / `EventSource`)**, **HTTP/2 and HTTP/3**, **WebTransport**, **WebRTC**, with **Node.js** libraries **`ws` 8.x**, **Socket.IO 4.x** (with `@socket.io/redis-adapter`), **uWebSockets.js**, and managed services (Ably, Pusher, PubNub, Supabase Realtime, Firebase). Browser support and library APIs evolve: anything marked "verify" should be checked in the official docs (datatracker.ietf.org, developer.mozilla.org, socket.io/docs, github.com/websockets/ws). Examples use the sample name **Ritesh Kumar**.
> This file covers realtime communication options (polling, long polling, SSE, WebSocket, WebTransport, WebRTC, MQTT), the WebSocket handshake and frame protocol, `ws` and Socket.IO (rooms, namespaces, acknowledgements, middleware, adapters), client reconnection and heartbeats, authentication and security (origin checks, CSWSH, rate limiting), horizontal scaling (sticky sessions, Redis/Kafka pub/sub), delivery guarantees and ordering, backpressure, presence, chat and collaboration design (OT/CRDT), GraphQL subscriptions, load balancers/proxies, testing, observability and production practice. Related topics: HTTP/API styles in `035_GraphQL-and-REST-APIs.md`, Redis pub/sub and streams in `031_Redis-and-Caching.md`, security in `036_Authentication-and-Security.md`, BaaS realtime in `034_Firebase-and-Supabase.md`, networking in `024_Linux-and-Networking.md`.

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
- [Part 12: Realtime Internals](#-part-12-realtime-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is "realtime" in web apps?
Delivering updates to users with very low latency, without them refreshing: chat messages, live scores, notifications, collaborative editing, dashboards, multiplayer games, trading tickers. "Realtime" in web apps usually means **soft realtime** (tens to hundreds of milliseconds), not hard realtime guarantees.

### Q2. Why can't plain HTTP do realtime well?
HTTP is **request-response**: the client must ask. The server cannot push data on its own. Workarounds (polling, long polling) are wasteful or complex. WebSocket, SSE and similar technologies keep a connection open so the server can send data whenever it wants.

### Q3. Options for realtime updates *(Must-know)*
| Technique | Direction | How it works | Best for |
|---|---|---|---|
| Short polling | Client → server | Repeated requests every N seconds | Simple, low-frequency updates |
| Long polling | Client → server | Server holds the request until data or timeout | Fallback when WebSocket is blocked |
| **SSE** | Server → client | One long-lived HTTP response with `text/event-stream` | Feeds, notifications, LLM token streaming |
| **WebSocket** | Bidirectional | Upgraded TCP connection, framed messages | Chat, games, collaboration |
| **WebTransport** | Bidirectional | QUIC/HTTP3 streams + datagrams | Low-latency media/games (emerging) |
| **WebRTC** | Peer-to-peer | UDP-based data/media channels with signaling | Video calls, P2P data |
| MQTT | Pub/sub | Lightweight broker protocol (often over WebSocket) | IoT, mobile |

### Q4. What is WebSocket? *(Must-know)*
A protocol (RFC 6455) that provides a **full-duplex, persistent, low-overhead** channel over a single TCP connection. It starts as an HTTP/1.1 request and **upgrades** to the WebSocket protocol. URL schemes: `ws://` and `wss://` (TLS). After the upgrade, either side can send **messages** (text or binary) at any time with only 2-14 bytes of framing overhead.

### Q5. The WebSocket handshake *(Must-know)*
```
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
Origin: https://app.example.com
Sec-WebSocket-Protocol: chat.v1

HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
Sec-WebSocket-Protocol: chat.v1
```
The server computes `Sec-WebSocket-Accept = base64(SHA1(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"))` to prove it understands WebSocket. Status **101** means the protocol switched.

### Q6. Browser WebSocket API
```js
const ws = new WebSocket("wss://example.com/chat");
ws.addEventListener("open", () => ws.send(JSON.stringify({ type: "hello", user: "Ritesh Kumar" })));
ws.addEventListener("message", (e) => console.log("received", JSON.parse(e.data)));
ws.addEventListener("close", (e) => console.log("closed", e.code, e.reason));
ws.addEventListener("error", (e) => console.error("ws error", e));
// ws.readyState: 0 CONNECTING, 1 OPEN, 2 CLOSING, 3 CLOSED
// ws.close(1000, "done");
```
The browser API can't set custom headers (no `Authorization`), which affects authentication design.

### Q7. A minimal Node.js server with `ws`
```js
import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (socket, req) => {
  console.log("client connected from", req.socket.remoteAddress);
  socket.on("message", (data, isBinary) => {
    const text = isBinary ? data : data.toString();
    for (const client of wss.clients) {
      if (client.readyState === client.OPEN) client.send(text, { binary: isBinary });   // broadcast
    }
  });
  socket.on("close", () => console.log("client disconnected"));
});
```

### Q8. A minimal Socket.IO chat
```js
// server
import { createServer } from "node:http";
import { Server } from "socket.io";
const httpServer = createServer();
const io = new Server(httpServer, { cors: { origin: "https://app.example.com" } });
io.on("connection", (socket) => {
  socket.on("chat:message", (msg) => io.emit("chat:message", { from: socket.id, msg }));
});
httpServer.listen(3000);
```
```js
// client
import { io } from "socket.io-client";
const socket = io("https://api.example.com");
socket.on("connect", () => socket.emit("chat:message", "Hello from Ritesh Kumar"));
socket.on("chat:message", (data) => console.log(data));
```

### Q9. WebSocket vs Socket.IO *(Must-know)*
Socket.IO is **not** a WebSocket implementation: it is a realtime **framework** with its own protocol layered on top of WebSocket (or HTTP long polling as a fallback).
| | Raw WebSocket (`ws`) | Socket.IO |
|---|---|---|
| Protocol | Standard RFC 6455 | Custom protocol over WS/long polling |
| Reconnection | Manual | Automatic (backoff) |
| Rooms / namespaces | Manual | Built in |
| Acknowledgements | Manual | Built in (callbacks / promises) |
| Fallback transport | None | Long polling then upgrade |
| Interop | Any WS client | Needs Socket.IO client |
| Overhead | Minimal | Higher (event envelope, ids) |
| Binary | Native | Supported |

### Q10. What is SSE (Server-Sent Events)?
A one-way (server → client) stream over a normal HTTP response with `Content-Type: text/event-stream`. The browser's `EventSource` auto-reconnects and sends `Last-Event-ID` so the server can resume.
```js
// server (Express)
app.get("/events", (req, res) => {
  res.set({ "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
  res.flushHeaders();
  const timer = setInterval(() => res.write(`id: ${Date.now()}\nevent: tick\ndata: ${JSON.stringify({ t: Date.now() })}\n\n`), 1000);
  req.on("close", () => clearInterval(timer));
});
```
```js
// client
const es = new EventSource("/events");
es.addEventListener("tick", (e) => console.log(JSON.parse(e.data)));
```

### Q11. SSE vs WebSocket *(Must-know)*
| | SSE | WebSocket |
|---|---|---|
| Direction | Server → client only | Bidirectional |
| Transport | Plain HTTP (works with HTTP/2 multiplexing) | Upgraded TCP |
| Auto-reconnect + resume | Built in (`Last-Event-ID`) | Manual |
| Data | Text (UTF-8) | Text + binary |
| Proxies/firewalls | Usually fine | Sometimes problematic |
| Limits | ~6 connections/origin on HTTP/1.1 | Many |
Choose SSE for one-way feeds and LLM streaming; WebSocket when the client also sends frequent messages.

### Q12. Short polling vs long polling
**Short polling**: `setInterval(fetch, 5000)`: simple but wasteful and laggy. **Long polling**: the server delays the response until new data or a timeout (~30 s), then the client immediately re-requests. Lower latency than short polling but each message costs a full HTTP round trip with headers.

### Q13. When to use which technology
- Notifications/feeds/stock tickers (one-way): **SSE**.
- Chat, multiplayer, collaboration: **WebSocket**.
- Rare updates (every minute+): **polling**.
- Video/audio calls: **WebRTC**.
- IoT devices: **MQTT**.
- Need fallbacks and rooms quickly: **Socket.IO** or a managed service.

### Q14. Common realtime use cases
Chat and messaging, live notifications, collaborative documents (Google Docs style), live dashboards and monitoring, multiplayer games, ride tracking, auctions/bidding, trading platforms, live comments/reactions, IoT telemetry, presence ("online now"), AI streaming responses.

### Q15. Message formats
JSON (human-readable, easy), MessagePack/CBOR (compact binary), Protocol Buffers (schema, smallest). Include an envelope with a `type`, optional `id`, `ts`, and `payload`:
```json
{ "type": "chat.message", "id": "01J8...", "ts": 1729760000000, "payload": { "room": "general", "text": "Hi" } }
```
Version your protocol (`type` namespaces, `v` field) to evolve safely.

### Q16. WebSocket close codes
`1000` normal closure, `1001` going away (page navigation/server shutdown), `1002` protocol error, `1003` unsupported data, `1006` abnormal closure (no close frame; network drop), `1008` policy violation (use for auth failures), `1009` message too big, `1011` server error, `1012` service restart, `1013` try again later. Application codes: `4000-4999`.

### Q17. Heartbeats: ping/pong
The protocol has control frames **ping** and **pong**. Idle connections can be dropped by proxies/NAT/load balancers (often 60 s), and dead peers aren't detected by TCP for a long time. Servers send pings periodically and terminate sockets that don't answer.
```js
function heartbeat() { this.isAlive = true; }
wss.on("connection", (ws) => { ws.isAlive = true; ws.on("pong", heartbeat); });
setInterval(() => {
  for (const ws of wss.clients) {
    if (!ws.isAlive) { ws.terminate(); continue; }
    ws.isAlive = false; ws.ping();
  }
}, 30_000);
```
Browsers can't send protocol-level pings from JS, so apps add their own application-level ping messages.

### Q18. Reconnection with exponential backoff and jitter *(Must-know)*
```js
function connect(url, onMessage) {
  let attempt = 0, ws;
  const open = () => {
    ws = new WebSocket(url);
    ws.onopen = () => { attempt = 0; };
    ws.onmessage = (e) => onMessage(JSON.parse(e.data));
    ws.onclose = () => {
      const delay = Math.min(30_000, 500 * 2 ** attempt++) * (0.5 + Math.random() / 2);   // jitter
      setTimeout(open, delay);
    };
  };
  open();
}
```
Without jitter, thousands of clients reconnect simultaneously after an outage (thundering herd). Re-subscribe to rooms and fetch missed data after reconnecting.

### Q19. Rooms and broadcasting
Group sockets to send to subsets (a chat room, a user's devices, a tenant).
```js
io.on("connection", (socket) => {
  socket.on("join", (room) => socket.join(room));
  socket.on("msg", ({ room, text }) => socket.to(room).emit("msg", { from: socket.id, text }));   // everyone in room except sender
});
io.to("room1").emit("announcement", "Server restarting");      // everyone in room1
io.except("room1").emit("x");                                  // everyone not in room1
```
With raw `ws` you maintain your own `Map<room, Set<WebSocket>>`.

### Q20. Namespaces (Socket.IO)
Separate communication channels on one connection: `io.of("/admin")`, `io.of("/chat")`. Each namespace has its own events, rooms and middleware, and clients connect with `io("/admin")`. Useful to isolate features or auth levels.

### Q21. Acknowledgements (Socket.IO)
```js
socket.emit("save", { id: 1 }, (response) => console.log(response.status));            // client
socket.on("save", async (data, cb) => { await db.save(data); cb({ status: "ok" }); });   // server
const res = await socket.timeout(5000).emitWithAck("save", { id: 1 });                   // promise style
```
Gives request/response semantics over events; always add timeouts.

### Q22. Binary data over WebSocket
Set `ws.binaryType = "arraybuffer"` (or `blob`). Send `ArrayBuffer`, `Uint8Array`, `Blob`. Use for audio chunks, images, game state, Protobuf messages. Always limit frame/message size.

### Q23. WebSocket security basics *(Must-know)*
Use **`wss://`**; validate the `Origin` header on the handshake (WebSockets are not bound by CORS!); authenticate before accepting messages; authorize each action; rate limit; validate message schemas; limit payload size; sanitize output (XSS in chat). See Part 2 for authentication patterns.

### Q24. Why doesn't CORS protect WebSockets?
The browser's same-origin policy doesn't block cross-origin WebSocket connections: any site can open `new WebSocket("wss://yourapi.com")` and the browser will attach cookies for that domain. The server must check `Origin` and use tokens/CSRF-style protection to stop **Cross-Site WebSocket Hijacking (CSWSH)**.

### Q25. Sending JSON safely
Always `try/catch` around `JSON.parse` on received data, validate with a schema (Zod/Ajv), and ignore/close on malformed messages. Never trust `type`/`room`/`userId` fields from the client without authorization checks.

### Q26. Connection lifecycle
`CONNECTING → OPEN → CLOSING → CLOSED`. Events: `open`, `message`, `error`, `close`. A `close` event always follows an `error`. Clean up timers, subscriptions and room membership on `close`.

### Q27. Browser limits
Browsers cap WebSocket connections per origin/overall (~200+ in Chrome, varies), and SSE over HTTP/1.1 limits to ~6 per origin (HTTP/2 removes this). Mobile browsers suspend background tabs/connections: design for reconnection and resync.

### Q28. WebSocket frame structure (basics)
A frame has `FIN` bit, opcode (`0x1` text, `0x2` binary, `0x8` close, `0x9` ping, `0xA` pong, `0x0` continuation), mask bit, payload length (7/16/64 bits), masking key (client → server frames are **masked**), and payload. Messages may be fragmented across frames.

### Q29. Why are client frames masked?
To prevent cache-poisoning attacks on intermediary proxies that might misinterpret WebSocket frames as HTTP. Servers must close connections with unmasked client frames; server → client frames are unmasked.

### Q30. Subprotocols
`Sec-WebSocket-Protocol` lets client and server agree on an application protocol (`graphql-transport-ws`, `mqtt`, `chat.v1`). The server selects one from the client's list; mismatch → handshake can be rejected.

### Q31. Compression: permessage-deflate
An extension compressing messages (`Sec-WebSocket-Extensions: permessage-deflate`). Saves bandwidth for text-heavy payloads but costs CPU and memory per connection (significant at 100k connections). Often disabled or tuned (`threshold`, small windows) on servers.

### Q32. WebSocket and HTTP/2
The classic WebSocket handshake needs HTTP/1.1 `Upgrade`. RFC 8441 defines WebSockets over HTTP/2 (extended CONNECT) and RFC 9220 over HTTP/3; support varies (verify in your stack/CDN). WebTransport is the modern QUIC-based alternative.

### Q33. Latency intuition
Message latency = network RTT + server processing + serialization + queuing. Keep payloads small, avoid blocking the event loop, place servers near users (regions/edge), and avoid chatty request/response patterns over the socket.

### Q34. Stateless vs stateful servers
WebSocket servers are **stateful**: each connection lives on one process. Scaling and deployments must handle connection draining, reconnection and cross-instance messaging (pub/sub). This is the key architectural difference from stateless REST APIs.

### Q35. Tools for realtime development
Browser DevTools (Network → WS frames), `wscat`, Postman WebSocket, `websocat`, Socket.IO Admin UI, `autocannon`/Artillery/k6 for load testing, Wireshark, Chrome `chrome://net-export`.
```bash
npx wscat -c wss://example.com/ws
```

### Q36. What is WebRTC (overview)?
Browser APIs for peer-to-peer audio, video and data channels using UDP (SRTP, SCTP over DTLS). Requires **signaling** (often via WebSocket) to exchange SDP offers/answers and ICE candidates, STUN to discover public addresses, and TURN to relay when P2P fails. Not a replacement for WebSocket for general app messaging.

---

# 🔵 Part 2: Junior (1–3 years)

### Q37. Authenticating WebSocket connections *(Must-know)*
The browser `WebSocket` constructor can't set an `Authorization` header. Options:
1. **Cookie-based session** (sent automatically on the handshake): validate session + `Origin` (CSWSH defence).
2. **Short-lived ticket**: client calls `POST /ws-ticket` (authenticated, returns a single-use token valid ~30 s), then connects to `wss://host/ws?ticket=abc`. The server validates and burns the ticket.
3. **First message auth**: connect, then send `{ type: "auth", token }` within a few seconds, or close with code `1008`/`4401`.
4. **Subprotocol trick**: pass the token in `Sec-WebSocket-Protocol` (works but unusual).
Avoid long-lived JWTs in query strings: they leak into logs and proxies. Socket.IO supports `auth: { token }` in the handshake.

### Q38. Ticket-based auth example
```js
// HTTP endpoint (authenticated)
app.post("/ws-ticket", requireAuth, async (req, res) => {
  const ticket = crypto.randomBytes(24).toString("base64url");
  await redis.set(`wsticket:${ticket}`, req.user.id, "EX", 30);
  res.json({ ticket });
});
// WebSocket server
const wss = new WebSocketServer({ noServer: true });
server.on("upgrade", async (req, socket, head) => {
  const url = new URL(req.url, "http://x");
  if (req.headers.origin !== "https://app.example.com") return socket.destroy();          // Origin check
  const userId = await redis.getdel(`wsticket:${url.searchParams.get("ticket")}`);         // single use
  if (!userId) { socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n"); return socket.destroy(); }
  wss.handleUpgrade(req, socket, head, (ws) => { ws.userId = userId; wss.emit("connection", ws, req); });
});
```

### Q39. Socket.IO authentication middleware
```js
io.use(async (socket, next) => {
  try {
    const user = await verifyJwt(socket.handshake.auth.token);
    socket.data.user = user;
    next();
  } catch { next(new Error("unauthorized")); }
});
io.on("connection", (socket) => socket.join(`user:${socket.data.user.id}`));   // personal room for user-targeted pushes
```
Client: `io(url, { auth: { token } })`. Re-authenticate on reconnect (tokens may have expired): use a function `auth: (cb) => cb({ token: getFreshToken() })`.

### Q40. Authorization per event
Authentication happens once; authorization must be checked **per action**. Verify the user may join a room or send to it before processing.
```js
socket.on("join", async (roomId, cb) => {
  if (!(await canAccessRoom(socket.data.user.id, roomId))) return cb?.({ error: "forbidden" });
  socket.join(`room:${roomId}`); cb?.({ ok: true });
});
```
Also re-check when membership changes (kick users from rooms: `io.in(room).socketsLeave(room)`).

### Q41. Cross-Site WebSocket Hijacking (CSWSH) *(Must-know)*
Attacker's page opens a WebSocket to your server; the browser sends the victim's cookies; if the server only checks the cookie, the attacker's script can read/send messages as the victim. Fix: **verify `Origin`**, use `SameSite` cookies, tickets/CSRF tokens in the handshake, and don't rely on ambient cookies alone.

### Q42. Rate limiting WebSocket messages
Per-connection token bucket in memory (or Redis for global per-user limits). Drop or close on abuse (`1008`).
```js
function limiter(ratePerSec, burst) {
  let tokens = burst, last = Date.now();
  return () => { const now = Date.now(); tokens = Math.min(burst, tokens + (now - last) / 1000 * ratePerSec); last = now; if (tokens < 1) return false; tokens--; return true; };
}
wss.on("connection", (ws) => {
  const allow = limiter(10, 20);
  ws.on("message", (raw) => { if (!allow()) return ws.close(1008, "rate limit"); /* handle */ });
});
```

### Q43. Message size limits and validation
`new WebSocketServer({ maxPayload: 64 * 1024 })` (ws) or `maxHttpBufferSize` (Socket.IO). Validate schemas on every message; reject unknown event types; guard against prototype pollution in JSON merges.
```js
const Msg = z.discriminatedUnion("type", [
  z.object({ type: z.literal("chat.send"), room: z.string().max(64), text: z.string().min(1).max(2000) }),
  z.object({ type: z.literal("typing"), room: z.string().max(64) }),
]);
```

### Q44. Chat app architecture (single server)
Client connects and authenticates → joins rooms → sends `chat.send` → server validates, persists to DB (message id, timestamp), broadcasts to the room → clients render; history loaded via REST (`GET /rooms/:id/messages?before=`). Persist first, then broadcast (so what users see is saved), and include server timestamps/ids for ordering.

### Q45. Typing indicators and presence basics
Typing: ephemeral events (`typing:start/stop`) throttled client-side (send at most every 2-3 s), not persisted. Presence: track connections per user (Set of socket ids); a user is online if ≥ 1 connection; set `offline` after a grace period (e.g. 10-30 s) to avoid flicker on reconnects; store in Redis with TTL refreshed by heartbeats.

### Q46. Delivery semantics: at-most-once, at-least-once, exactly-once *(Must-know)*
Plain WebSocket `send` gives **no delivery guarantee**: the message may be lost if the connection drops. For reliability add application-level IDs, acknowledgements, retries and de-duplication (**at-least-once + idempotent handling** ≈ effectively-once). Socket.IO's acks and "connection state recovery" (v4.6+) help, but you still need durable storage for important messages.

### Q47. Ensuring message ordering
Within a single TCP connection messages arrive in order. Across reconnects, devices or servers ordering can break. Use server-assigned monotonically increasing sequence numbers per room (DB sequence or Redis `INCR`), clients sort by sequence and request gaps (`since=seq`).

### Q48. Resuming after reconnect (missed messages)
Client remembers `lastSeq` / `lastEventId`; on reconnect it sends `{ type: "resume", room, since: lastSeq }`; the server replays from a durable log (DB/Redis Stream) or tells the client to refetch (`resync`). SSE does this natively with `Last-Event-ID`. Socket.IO connection state recovery buffers events for a short window.

### Q49. Broadcast vs unicast vs multicast patterns
Unicast (one socket/user room), multicast (rooms/topics), broadcast (everyone). Use user-specific rooms (`user:42`) so one user's multiple devices all receive notifications. Avoid sending to everyone when a subset is enough (bandwidth, privacy).

### Q50. Pub/Sub basics for multi-process servers
One Node process can serve only its own sockets. To deliver a message to a user connected to another instance, publish through a shared broker (Redis pub/sub, NATS, Kafka). Socket.IO's Redis adapter does this transparently:
```js
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
const pub = createClient({ url: process.env.REDIS_URL }), sub = pub.duplicate();
await Promise.all([pub.connect(), sub.connect()]);
io.adapter(createAdapter(pub, sub));
```
Now `io.to("room1").emit(...)` reaches sockets on all instances.

### Q51. Sticky sessions *(Must-know)*
Socket.IO long-polling transport sends multiple HTTP requests that must hit the **same server** that holds the session; load balancers need **sticky sessions** (cookie/IP hash). If you force `transports: ["websocket"]`, the single upgraded connection is inherently sticky and sticky sessions aren't needed (but no fallback). Raw WebSocket needs no stickiness after upgrade.

### Q52. Load balancer and proxy configuration (Nginx)
```nginx
location /ws {
  proxy_pass http://backend;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
  proxy_set_header Host $host;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_read_timeout 3600s;       # default 60s closes idle sockets
  proxy_send_timeout 3600s;
}
```
Cloud LBs (AWS ALB idle timeout 60 s default, Cloudflare ~100 s without traffic) need timeouts raised and heartbeats under the idle threshold.

### Q53. Graceful shutdown and deployments
On `SIGTERM`: stop accepting new connections, tell clients to reconnect (close code `1012`/`1001` or a `server:restarting` message with jittered delay), wait/drain, close. Rolling deploys cause reconnect waves: stagger instance restarts and use jitter so reconnects don't overload the new pods.
```js
process.on("SIGTERM", () => {
  server.close();
  for (const ws of wss.clients) ws.close(1012, "service restart");
  setTimeout(() => process.exit(0), 10_000);
});
```

### Q54. Backpressure basics *(Must-know)*
`ws.send()` queues data in memory if the client reads slowly. Check `ws.bufferedAmount` and stop/slow producing; drop low-value messages (cursor positions) or disconnect slow consumers to protect server memory.
```js
function safeSend(ws, data) {
  if (ws.readyState !== ws.OPEN) return;
  if (ws.bufferedAmount > 1_000_000) { ws.close(1013, "slow consumer"); return; }
  ws.send(data);
}
```

### Q55. Memory per connection and capacity
A Node `ws` connection costs roughly tens of KB (more with compression and buffers); 10k-100k+ concurrent connections per process is feasible with tuning (`ulimit -n`, ephemeral ports, kernel `net.core.somaxconn`, `fs.file-max`), bounded by CPU for message fan-out. uWebSockets.js handles significantly more per core. Load test to find your numbers.

### Q56. OS limits to tune for many connections
File descriptors (`ulimit -n 1048576`), `net.ipv4.ip_local_port_range` (for outbound clients/proxies), `net.core.somaxconn`, `net.ipv4.tcp_max_syn_backlog`, TCP keepalive settings, conntrack table size on NAT/LB, and memory (socket buffers).

### Q57. Choosing a payload strategy: send full state vs deltas
Full-state snapshots are simple but heavy; deltas/patches are compact but need ordering and resync logic. Common approach: initial snapshot over REST, then incremental events with sequence numbers, and a `resync` mechanism if a gap is detected.

### Q58. Error handling patterns
Wrap handlers in `try/catch` and send structured errors `{ type: "error", code, message, requestId }`. Don't crash the process on bad input; handle `error` events on sockets (`ws.on("error", ...)`); for uncaught exceptions log and restart under a supervisor.

### Q59. Typing the protocol (TypeScript)
Define shared event maps for client and server:
```ts
interface ServerToClient { "chat:message": (m: { id: string; room: string; text: string; ts: number }) => void; }
interface ClientToServer { "chat:send": (m: { room: string; text: string }, ack: (r: { ok: boolean; id?: string }) => void) => void; }
const io = new Server<ClientToServer, ServerToClient>(httpServer);
```
Socket.IO generics make event names and payloads type-safe; for raw WS use discriminated unions with Zod.

### Q60. React hook for a WebSocket
```tsx
function useSocket(url: string) {
  const [status, setStatus] = useState<"connecting" | "open" | "closed">("connecting");
  const [last, setLast] = useState<any>(null);
  const wsRef = useRef<WebSocket>();
  useEffect(() => {
    let closedByUs = false, attempt = 0, timer: any;
    const open = () => {
      const ws = (wsRef.current = new WebSocket(url));
      ws.onopen = () => { attempt = 0; setStatus("open"); };
      ws.onmessage = (e) => setLast(JSON.parse(e.data));
      ws.onclose = () => { setStatus("closed"); if (!closedByUs) timer = setTimeout(open, Math.min(10_000, 300 * 2 ** attempt++)); };
    };
    open();
    return () => { closedByUs = true; clearTimeout(timer); wsRef.current?.close(); };
  }, [url]);
  const send = useCallback((m: unknown) => wsRef.current?.readyState === 1 && wsRef.current.send(JSON.stringify(m)), []);
  return { status, last, send };
}
```
Handle React 18 StrictMode double-mount by making setup/cleanup idempotent.

### Q61. Mobile considerations
OS suspends sockets when apps background; use push notifications (FCM/APNs) for wake-ups, reconnect on foreground, handle network changes (Wi-Fi ↔ cellular) with fast failure detection, minimize battery use (batch, longer heartbeats), and persist unsent messages (outbox).

### Q62. Offline queue / outbox pattern
Client stores outgoing messages locally with client-generated IDs, marks `pending`, sends when connected, updates to `sent`/`failed` on ack. The server de-duplicates by client id. Enables optimistic UI and offline composition.

### Q63. Optimistic UI and reconciliation
Show the message immediately with a temporary id; replace with server id/timestamp on ack; roll back or mark failed on error. Reconcile by `clientId` so duplicates don't appear when the broadcast echoes back.

### Q64. GraphQL subscriptions over WebSocket
Use the `graphql-ws` protocol (subprotocol `graphql-transport-ws`); authentication through `connectionParams`; pub/sub backend for multi-instance. See `035_GraphQL-and-REST-APIs.md`.
```js
import { useServer } from "graphql-ws/lib/use/ws";
useServer({ schema, context: (ctx) => ({ user: verify(ctx.connectionParams?.token) }) }, wss);
```

### Q65. Server-side event sources
Realtime updates originate from: client messages, DB changes (change streams, CDC, triggers/`LISTEN/NOTIFY`), message queues, cron jobs, third-party webhooks. Decouple: producers publish domain events to a broker; the WebSocket tier subscribes and fans out to clients.

### Q66. PostgreSQL LISTEN/NOTIFY and change streams
`NOTIFY channel, 'payload'` wakes listeners with small payloads (8 KB limit), good for lightweight invalidation. MongoDB change streams and Supabase Realtime (logical replication) provide row-level change feeds. Send IDs and let clients refetch when payloads are big or sensitive.

### Q67. Testing WebSocket servers
```js
import WebSocket from "ws";
it("echoes messages", async () => {
  const ws = new WebSocket(`ws://localhost:${port}`);
  await new Promise((r) => ws.once("open", r));
  const reply = new Promise((r) => ws.once("message", (d) => r(d.toString())));
  ws.send("ping");
  expect(await reply).toBe("pong");
  ws.close();
});
```
Also test auth failures, oversized payloads, reconnection, and multi-client broadcasts; use Socket.IO's client in tests for event flows.

### Q68. Load testing realtime systems
Tools: k6 (`k6/ws`), Artillery (WebSocket/Socket.IO engines), `thor`, custom scripts. Measure concurrent connections, connection rate, message throughput, fan-out latency (p50/p95/p99), memory, CPU, event loop lag, reconnect storms. Test with realistic message sizes and room distributions.

### Q69. Observability
Metrics: connected sockets, connect/disconnect rates, close codes, messages in/out per second, fan-out latency, event-loop lag, `bufferedAmount`, memory, broker lag. Logs with connection id, user id (hashed), room. Tracing for cross-instance deliveries. Alerts on abnormal disconnect spikes and reconnect storms.

### Q70. Managed realtime services
Pusher Channels, Ably, PubNub, AWS AppSync/IoT Core, Azure Web PubSub/SignalR, Firebase, Supabase Realtime, Cloudflare Durable Objects/Workers. Pros: scale, global presence, SLAs, less ops; cons: cost per message/connection, lock-in, limited customization.

### Q71. ASP.NET SignalR, Phoenix Channels, Action Cable (awareness)
Other ecosystems offer integrated realtime frameworks: SignalR (.NET, transports fallback), Phoenix Channels (Elixir, massive concurrency), Rails Action Cable, Laravel Echo + Reverb. Concepts (rooms, presence, pub/sub, scaling via brokers) are the same.

### Q72. When not to use WebSockets
Infrequent updates (poll or push notifications), one-way streams (SSE is simpler), cacheable content (HTTP + CDN), serverless platforms with short function lifetimes (use managed WebSocket gateways), or when corporate proxies block upgrades (use SSE/long polling).

---

# 🟡 Part 3: Mid (3–5 years)

### Q73. Scaling WebSockets horizontally *(Must-know)*
1. Stateless app logic; connection state minimal and reconstructable.
2. L4/L7 load balancer with WebSocket support and long idle timeouts.
3. Sticky sessions only if long polling is allowed.
4. Shared pub/sub (Redis, NATS, Kafka) for cross-instance fan-out.
5. Presence and room membership in Redis with TTL.
6. Autoscale on connections and CPU/event-loop lag, not just CPU.
7. Connection draining during deploys; jittered reconnects.

### Q74. Redis adapter details and limits
Socket.IO's Redis adapter uses pub/sub channels per namespace/room; broadcasts are published to Redis and re-emitted by each node to its local sockets. Limitations: pub/sub is fire-and-forget (messages lost if a node is down), and a single Redis can become a bottleneck. Alternatives: the **Redis Streams adapter** (durable, supports connection state recovery across nodes), sharded Pub/Sub (Redis 7), NATS, Kafka. See `031_Redis-and-Caching.md`.

### Q75. Designing the fan-out path
Producer → broker topic (per room/user shard) → WebSocket gateway nodes subscribed only to the topics their connected clients need → local delivery. Avoid every node receiving every message: subscribe dynamically when the first local client joins a room and unsubscribe when the last leaves.

### Q76. Connection gateway vs application services
Split a thin **realtime gateway** (terminates WebSockets, authentication, fan-out) from business services (REST/gRPC, workers). Gateways stay simple and scale on connections; services publish events to the broker. Benefits: independent scaling, safer deploys, language flexibility.

### Q77. Presence at scale
Per-connection heartbeat updates a Redis key/sorted set (`ZADD presence:room <ts> user`), a sweeper removes stale entries; or use Redis hash with TTL per user and keyspace notifications. For large rooms (100k users) send **presence diffs** and counts, not full lists; sample or paginate lists.

### Q78. Big rooms and fan-out cost
Sending a message to N members costs O(N) writes. Strategies: batching/coalescing (send every 50-100 ms), tiered fan-out (publish to shards), server-side filtering, delta compression, CDN/edge pub/sub for read-mostly broadcast (live comments), and falling back to polling for massive audiences (live streams with millions).

### Q79. Message ordering across instances
Partition by key (room id) so that all events for a room flow through one ordered partition/stream (Kafka partition, Redis Stream per room) and are assigned sequence numbers at a single point (the "sequencer"). Consumers deliver in sequence and detect gaps.

### Q80. Idempotency and de-duplication
Client-generated message ids; server stores `(userId, clientMsgId)` unique constraint or Redis `SET NX` with TTL; on duplicate return the original ack. Required with at-least-once delivery and retries after reconnect.

### Q81. Exactly-once reality
Across network boundaries exactly-once is achieved as at-least-once delivery + idempotent processing. Transactional outbox for DB + broker consistency (write message and outbox row in one transaction; relay publishes), consumer de-dup tables.

### Q82. Persisting messages and reading history
Write-optimized stores (Cassandra/ScyllaDB, DynamoDB, PostgreSQL partitioned by room/time, MongoDB). Access patterns: latest N in a room, page back by cursor `(room_id, seq)`. Keep hot recent messages in Redis. Index by room + sequence; avoid offset pagination.

### Q83. Read receipts, delivery status and unread counts
Per-user `lastReadSeq` per room (compact), computing unread = `latestSeq - lastReadSeq`. Delivery status via acks; batch read updates (debounce). Avoid per-message-per-user rows in huge groups; use ranges.

### Q84. Notifications fallback (push + email)
If no active socket for a user (presence), send mobile push (FCM/APNs), web push, or email digest after a delay. Deduplicate: if the user comes online and sees the message, cancel pending pushes.

### Q85. Backpressure and flow control at scale
Per-connection outbound queues with caps, drop policies by message class (state vs events), coalescing (only latest cursor), priority queues, disconnecting slow clients, and client-side flow control (batch acks). Monitor `bufferedAmount` and server memory.

### Q86. Large payloads and file transfer
Don't push large files over the realtime channel. Upload via pre-signed URLs, send only metadata/URL events over WebSocket, and use chunked binary frames only for streaming use cases (audio) with size limits.

### Q87. Authentication refresh on long-lived connections
Tokens expire while sockets stay open. Options: client sends `{type:"auth.refresh", token}` periodically; server disconnects with code `4401` at token expiry (forcing reconnection with a new token); or server-side session checks. Always enforce revocation (logout-all kicks sockets via pub/sub `disconnectSockets`).
```js
io.in(`user:${userId}`).disconnectSockets(true);       // Socket.IO: kick all of a user's sockets across nodes
```

### Q88. Multi-device and multi-tab behaviour
Each tab = one connection. Use `user:{id}` rooms for cross-device sync, `BroadcastChannel`/`SharedWorker` to share one connection across tabs (reduces server load), and a leader-election pattern (Web Locks API) to avoid duplicate processing.

### Q89. Security hardening checklist
`wss://` only; origin allow-list; ticket/session auth; per-event authorization; schema validation; payload and rate limits; connection limits per IP/user; ban/kick tooling; escape/sanitize rendered content; avoid sensitive data in URLs; log security events; DoS protection at the edge (Cloudflare/AWS Shield); keep dependencies patched (`ws` CVEs). See `036_Authentication-and-Security.md`.

### Q90. Denial-of-service vectors specific to WebSockets
Connection floods (open many sockets), slowloris-style handshakes, huge frames/decompression bombs (`permessage-deflate`), message floods, subscription amplification (join thousands of rooms), expensive handlers. Mitigate with connection caps, handshake timeouts, `maxPayload`, compression limits, per-user quotas, and circuit breakers.

### Q91. Collaboration algorithms: OT vs CRDT *(Must-know)*
**Operational Transformation (OT)**: operations are transformed against concurrent ops by a central server (Google Docs historically); needs a coordinating server, complex transform functions. **CRDTs** (Yjs, Automerge, Loro): data structures that merge concurrent edits deterministically without central coordination; great for offline and peer-to-peer. Libraries: Yjs + `y-websocket` provider, Liveblocks, PartyKit.

### Q92. Yjs over WebSocket (example)
```js
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
const doc = new Y.Doc();
const provider = new WebsocketProvider("wss://collab.example.com", "room-42", doc);
const text = doc.getText("content");
text.observe(() => render(text.toString()));
text.insert(0, "Hello");      // merges conflict-free with other peers
```
Persist document updates server-side (LevelDB/Postgres) and use awareness for cursors/presence.

### Q93. Cursor/pointer broadcasting
High-frequency, loss-tolerant: throttle to 20-30 Hz, send only deltas, coalesce, drop when backlogged, use unreliable channels (WebRTC data channel/WebTransport datagrams) when possible, and render with interpolation.

### Q94. Multiplayer game networking basics
Authoritative server, client-side prediction, server reconciliation, entity interpolation, tick rates (20-60 Hz), snapshot compression, lag compensation, UDP-like transports (WebRTC DataChannel, WebTransport) for low latency; TCP head-of-line blocking hurts WebSockets for twitchy games.

### Q95. SSE at scale and HTTP/2
SSE connections are cheap and cache/proxy friendly; behind HTTP/2 many streams share one TCP connection. Beware proxy buffering (disable with `X-Accel-Buffering: no`), idle timeouts (send `:keepalive` comments every 15-30 s), compression interference, and per-user connection limits. Great for LLM token streaming.

### Q96. Streaming LLM responses
Use SSE (or fetch streaming with `ReadableStream`) to send tokens as `data:` events; support cancellation (`AbortController` / close the stream), include a final `[DONE]` event, handle reconnection by resuming from message id, and apply rate/budget limits per user.
```js
res.write(`data: ${JSON.stringify({ token })}\n\n`);
```

### Q97. WebTransport overview
API over HTTP/3 (QUIC) providing multiple independent streams (no head-of-line blocking across streams) and unreliable datagrams. Good for games/media; support is growing but not universal (Safari/proxy gaps: verify). WebSocket remains the pragmatic default.

### Q98. MQTT for IoT and mobile
Lightweight pub/sub protocol with topics, QoS 0/1/2, retained messages, last-will; brokers: Mosquitto, EMQX, HiveMQ, AWS IoT Core. MQTT over WebSocket lets browsers connect. Use for devices with constrained bandwidth and intermittent connections.

### Q99. Webhooks vs WebSockets vs SSE vs polling for integrations
Server-to-server events: **webhooks** (push, HTTP callbacks). Browser live UI: WebSocket/SSE. Third-party APIs without push: polling with ETags. Choose by consumer type and reliability needs (webhooks need retries and signatures: `035_GraphQL-and-REST-APIs.md`).

### Q100. Edge and serverless realtime
Serverless functions can't hold sockets long-term; use managed gateways (API Gateway WebSocket APIs, Azure Web PubSub, AppSync), Cloudflare Durable Objects (stateful WebSocket rooms at the edge), Ably/Pusher, or run a small stateful service on containers. Store connection ids in DynamoDB/Redis and push via management APIs.

### Q101. Cost drivers of realtime systems
Concurrent connections (memory), message volume and fan-out (CPU/bandwidth), cross-AZ/region traffic, managed service per-message pricing, persistence and presence storage, idle connections kept alive by heartbeats. Optimize with batching, compression where valuable, shorter retention, and CDN/edge for read-heavy broadcast.

### Q102. Choosing between Socket.IO, `ws`, uWebSockets.js and managed services
| Need | Choice |
|---|---|
| Fast start, rooms/acks/reconnect | Socket.IO |
| Standard protocol, minimal overhead, custom protocol | `ws` |
| Max performance per core | uWebSockets.js (or native Go/Rust/Elixir) |
| Global scale without ops | Ably/Pusher/PubNub/Web PubSub |
| Collaboration documents | Yjs/Liveblocks/PartyKit |
| DB-driven live queries | Supabase Realtime/Firebase/Convex |

---

# 🟠 Part 4: Senior (5–7 years)

### Q103. Designing a chat system (WhatsApp/Slack style) *(Must-know)*
**Requirements:** 1:1 and group chats, delivery/read status, history, media, presence, multi-device, 10M DAU.
**Architecture:**
1. **Gateway tier**: WebSocket servers (stateless apart from sockets), auth via tickets/JWT, heartbeat, rate limits.
2. **Session registry**: Redis map `userId → {gatewayId, connectionIds}` with TTL.
3. **Message service**: validates, assigns per-conversation sequence, persists (Cassandra/Scylla/Postgres by `conversation_id`), publishes to the broker.
4. **Fan-out**: broker (Kafka/NATS) → gateways → recipients; offline users get push notifications and sync on connect.
5. **Sync API**: `GET /conversations/:id/messages?afterSeq=`.
6. **Media**: pre-signed uploads, CDN delivery, thumbnails by workers.
7. **Presence/typing**: ephemeral via Redis/pub-sub, not persisted.
8. **Observability/limits**: per-user quotas, abuse detection, E2EE optional (Signal protocol) which moves trust to clients.
Trade-offs: ordering per conversation via a single sequencer; group size limits; cost of fan-out vs fetch-on-notify ("tickle then pull") for large groups.

### Q104. Designing a live dashboard / metrics feed
Producers (services, IoT) → Kafka → stream processor (Flink/ksqlDB/worker) aggregates into windows → Redis/TimescaleDB → WebSocket/SSE gateway pushes **aggregated snapshots** every 1-2 s (not raw events). Clients subscribe to topics (`dashboard:{id}`), receive an initial snapshot then deltas; throttle by client capability; degrade to polling when overloaded.

### Q105. Designing a live notifications service
Event sources publish `NotificationCreated` (user id, type, payload) → notification service stores in DB (inbox) and publishes to `user:{id}` channel → gateway pushes to online sockets; if offline → web push/mobile push/email by preference. Store read/unread, support batching (digests), idempotency keys, and per-channel rate limits. Client fetches inbox via REST on load and listens for pushes.

### Q106. Designing collaborative editing at scale
Document sharding by `docId` to a single "room owner" process (consistent hashing/Durable Objects) so updates are serialized; use CRDT/OT; persist incremental updates + periodic snapshots; handle awareness (cursors) separately; reconnect with state vector sync (Yjs `syncStep1/2`); access control per document; version history; limit document size and clients per room; migrate rooms on deploy using handoff.

### Q107. Sharding WebSocket rooms
Route all connections for a room to the same node (consistent hashing on room id at the LB or via a router service) to avoid cross-node fan-out for hot rooms. Trade-offs: hot-room imbalance, rebalancing complexity, failover handoff. Alternative: any-node connections + pub/sub per room (simple, more network traffic).

### Q108. Connection draining and zero-downtime deploys
Blue/green or rolling with `maxUnavailable` small; mark pods unready (stop new connections), send `reconnect` hints with jitter, drain over minutes, then terminate; keep `terminationGracePeriodSeconds` long enough; maintain per-node connection caps; pre-warm new nodes; protect the auth/ticket service from reconnect spikes.

### Q109. Handling reconnect storms
Causes: gateway crash, network blip, deploy, cloud LB failover. Mitigations: exponential backoff + full jitter on clients, server-sent `retryAfter` hints, rate-limit handshake per IP, queue/ticket admission control, scale gateway headroom (N+1/zone), cache auth validation, keep auth lightweight (JWT local verify), shed load with 503 + `Retry-After`, and avoid expensive resync on every reconnect (use incremental resume).

### Q110. Observability at scale for realtime
Golden signals: connected sockets, connect success rate, handshake latency, end-to-end delivery latency (publish time vs receive time with synthetic probes), message loss/duplicates, reconnect rate, close codes, backlog sizes (`bufferedAmount`, broker lag), event-loop lag, GC pauses. Run **synthetic canary clients** per region sending and receiving timestamps. SLOs: e.g. 99% of messages delivered < 500 ms.

### Q111. Event loop health in Node
Realtime servers are sensitive to blocking: JSON parsing of large payloads, synchronous crypto/compression, regexes, big loops. Monitor `perf_hooks.monitorEventLoopDelay()`, offload CPU work to worker threads/services, use streaming parsers, avoid `JSON.stringify` per recipient (serialize once, send the same buffer to all), and cluster across cores.
```js
const payload = JSON.stringify(event);                // serialize once
for (const ws of room) ws.send(payload);
```

### Q112. Fan-out optimization techniques
Serialize once, use `ws.send` with prepared frames (uWebSockets.js `publish` uses native pub/sub, avoiding per-socket loops), batch small messages, coalesce state updates, avoid per-recipient DB lookups (pre-resolve permissions at join time), compress selectively, and shard rooms across processes.

### Q113. Consistency models in realtime apps
Strong consistency (single leader per document/room) vs eventual (CRDT merge). Users tolerate brief divergence for presence/cursors but not for payments/inventory. For bids/trades, route through an authoritative service that sequences events and broadcasts the canonical result; clients treat local state as optimistic until confirmed.

### Q114. Handling multi-region
Options: single-region authoritative state with edge gateways (low connect latency, cross-region publish hop); per-region rooms with global pub/sub (Kafka MirrorMaker/NATS leafnodes); active-active with CRDTs; geo-partition users/rooms. Account for cross-region latency (50-200 ms), failover of presence, and data residency requirements.

### Q115. Security architecture for realtime APIs
Ticketed auth, origin checks, per-event authorization via a central policy service, tenant isolation in rooms/channels (namespace by tenant: `t:{tenant}:room:{id}`), signed channel names for client-subscribable topics (Pusher/Ably capability tokens), audit logs of joins/admin actions, rate limits per user and per IP, abuse reporting/ban pipeline, content moderation hooks, and encryption in transit (optionally E2EE).

### Q116. Capability tokens for pub/sub
Issue short-lived tokens specifying allowed channels and operations (`subscribe:orders:123`, `publish:chat:*`). The gateway enforces them locally without a DB lookup. Revocation via short TTL and a denylist. Used by Ably, Centrifugo, PubNub, Supabase Realtime (RLS-based).

### Q117. Testing strategy beyond unit tests
Contract tests for message schemas; integration tests with multiple clients; chaos tests (kill gateway, drop network, delay broker); soak tests for memory leaks (hours at steady load); spike tests for reconnect storms; browser E2E (Playwright with WebSocket assertions); deterministic simulation for collaboration (fuzz concurrent edits).

### Q118. Memory leaks in WebSocket servers
Common causes: listeners not removed on `close`, rooms/maps retaining dead sockets, timers per connection not cleared, unbounded message buffers, per-connection closures holding large objects, caches keyed by socket id. Use heap snapshots, `--inspect`, `process.memoryUsage()` trend alerts, and tests that connect/disconnect 100k times.

### Q119. Graceful degradation
When overloaded: reduce update frequency, drop non-essential events (typing, cursors), switch dashboards to polling, reject new connections with `503`, serve cached snapshots via REST, and prioritize critical messages. Communicate state to the user ("Reconnecting…", "Live updates paused").

### Q120. Message schema evolution
Use versioned envelopes, additive changes, tolerant readers (ignore unknown fields), feature flags, and protocol negotiation via subprotocol/`clientVersion` on connect. Maintain compatibility for old mobile clients (months-long tail). Prefer schemas (Protobuf/JSON Schema) and CI compatibility checks.

### Q121. Compression and bandwidth optimization
Deltas, field omission, short keys or binary formats (MessagePack/Protobuf), dictionary-based compression for repetitive payloads, `permessage-deflate` tuned, throttling/coalescing, avoiding redundant presence updates, and client-side batching of acks.

### Q122. Debugging production issues
Correlate by `connectionId`/`traceId`; capture close codes and reasons; compare LB logs (idle timeouts), gateway metrics and broker lag; use `tcpdump`/Wireshark for handshake issues; replay recorded traffic; feature flags to disable expensive features; per-user debug logging toggled temporarily.

### Q123. Compliance and data retention
Messages may be personal data: retention policies, deletion on request, legal hold, encryption at rest, access logs, region pinning, audit trails for admin access to conversations, and moderation tools. E2EE limits server-side features (search, moderation) and needs key management UX.

### Q124. Technical debt in realtime systems
In-memory state tied to one process, no resume logic, no schema versioning, ad-hoc event names, missing backpressure, untested reconnect paths, and hidden coupling between UI and event order. Address with protocol specs, shared typed contracts, replay tooling and chaos testing.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q125. Choosing a realtime platform strategy (build vs buy)
Consider: scale (concurrent connections, messages/s), latency SLO, global reach, features (presence, history, push), compliance, team skills, cost curve, lock-in, extensibility. Buy (Ably, Pusher, Azure Web PubSub, AppSync, Supabase/Firebase) for time-to-market and global reach; build on Socket.IO/`ws`/Centrifugo/NATS/Phoenix for control and cost at scale. Pilot with real load, compare TCO (including on-call), and keep the protocol abstraction thin to allow migration.

### Q126. Reference architecture for a multi-tenant realtime SaaS
Edge LB (TLS, DDoS, geo-routing) → regional gateway fleet (Go/Node/Elixir) → auth service (tickets/JWT, capability tokens) → broker (NATS JetStream/Kafka/Redis Streams) → services (presence, history, push) → storage (Redis hot, Postgres/Cassandra durable) → observability stack. Tenant isolation by namespaces + quotas, per-tenant rate limits, noisy-neighbour protection, usage metering for billing, and an admin API for kick/ban/audit.

### Q127. Capacity planning method
Estimate peak concurrent connections (C), messages per connection per second (m), average fan-out (f): outbound msgs/s = C × m × f (approx). Derive CPU/network per node from load tests (e.g. 50k connections and 100k msgs/s per node), add headroom (N+1 per AZ, 30-50% buffer), plan broker throughput, and model reconnect storms (all C reconnecting in 60 s). Revisit quarterly with real metrics.

### Q128. Protocol design guidelines
Define a spec: message envelope, types, error model, versioning, ordering/sequence semantics, ack/retry rules, idempotency, auth refresh, backpressure signals, limits (size/rate), close codes, heartbeat intervals, resume protocol. Provide SDKs and conformance tests. A well-specified protocol outlives any server implementation.

### Q129. Reliability engineering for realtime
SLOs for connect success, delivery latency, loss; error budgets; multi-AZ gateways; broker replication; runbooks (gateway crash, broker lag, Redis failover, reconnect storm); game days; dependency isolation (auth outage shouldn't drop existing sockets); graceful degradation modes; capacity alarms on connection counts and event-loop lag.

### Q130. Cost optimization at scale
Reduce idle cost (longer heartbeats within LB limits, connection coalescing across tabs), fan-out cost (aggregation, tiered broadcast, CDN/edge for public feeds), cross-AZ traffic (AZ-aware routing), storage (TTL for ephemeral data), compression where it pays, rightsizing (memory-optimized instances for connections), and managed-service plan negotiation.

### Q131. Evolving from polling to realtime (migration)
Introduce a realtime channel for specific features behind flags, keep polling as fallback, send lightweight invalidation events ("order 123 updated") so clients refetch via existing REST (reuses authz/caching), measure latency and load changes, then gradually move payloads onto the channel. Invalidate-and-refetch is simpler and safer than pushing full state.

### Q132. Edge-native realtime (Durable Objects, WebSocket at the edge)
Edge platforms run stateful actors near users: each room is an object with in-memory state and attached WebSockets, hibernating when idle. Pros: low latency, simple per-room consistency, minimal infra; cons: platform lock-in, per-object throughput limits, limited ecosystem. Good for collaboration rooms, games lobbies and chat rooms with bounded sizes.

### Q133. Realtime + AI agents
Streaming tokens over SSE/WebSocket, tool-call progress events, cancellable runs, resumable streams (store events with ids), multi-user shared sessions via rooms, back-pressure for slow clients, per-user concurrency and budget limits, and audit logs of agent actions. Use durable execution/workflows for long-running agent tasks with realtime status streams.

### Q134. Organizational practices
Own the protocol spec and SDKs centrally, publish SLOs, run load tests in CI/staging for every gateway release, maintain runbooks and on-call rotations, review new event types for privacy/abuse, and train teams on client resilience (reconnect, resume, idempotency). Make "realtime readiness" part of feature design reviews.

### Q135. Risk assessment
Top risks: reconnect storms taking down auth/DB, broker outages dropping fan-out, memory leaks causing cascading restarts, abuse/DoS via connection floods, privacy leaks via mis-scoped channels, silent message loss, vendor price changes, and clock/ordering bugs. Mitigate with isolation, rate limits, chaos tests, tenant-scoped channels, delivery audits and abstraction layers.

### Q136. Communicating trade-offs to stakeholders
Explain latency vs cost vs reliability: "instant everywhere" costs more than "fresh within 5 s". Offer tiers (critical features on durable realtime paths, nice-to-have features on polling/SSE), define SLOs per feature, and show data from load tests and incidents to justify investment.

---

# 💻 Part 6: Hands-On Tasks & Code

### H1. Production-minded `ws` server (auth, heartbeat, limits, rooms)
```js
import { createServer } from "node:http";
import { WebSocketServer } from "ws";
import crypto from "node:crypto";
import { z } from "zod";

const server = createServer((req, res) => { if (req.url === "/healthz") return res.end("ok"); res.statusCode = 404; res.end(); });
const wss = new WebSocketServer({ noServer: true, maxPayload: 64 * 1024, perMessageDeflate: false });
const rooms = new Map();                                       // roomId -> Set<ws>
const ALLOWED_ORIGINS = new Set(["https://app.example.com"]);

const Msg = z.discriminatedUnion("type", [
  z.object({ type: z.literal("join"), room: z.string().max(64) }),
  z.object({ type: z.literal("leave"), room: z.string().max(64) }),
  z.object({ type: z.literal("chat.send"), room: z.string().max(64), text: z.string().min(1).max(2000), clientId: z.string().max(64) }),
]);

server.on("upgrade", async (req, socket, head) => {
  try {
    if (!ALLOWED_ORIGINS.has(req.headers.origin ?? "")) throw new Error("origin");
    const ticket = new URL(req.url, "http://x").searchParams.get("ticket");
    const userId = ticket && (await redis.getdel(`wsticket:${ticket}`));
    if (!userId) throw new Error("auth");
    wss.handleUpgrade(req, socket, head, (ws) => { ws.userId = userId; wss.emit("connection", ws, req); });
  } catch { socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n"); socket.destroy(); }
});

const bucket = (rate, burst) => { let t = burst, l = Date.now(); return () => { const n = Date.now(); t = Math.min(burst, t + (n - l) / 1e3 * rate); l = n; return t >= 1 && (t--, true); }; };

wss.on("connection", (ws) => {
  ws.isAlive = true; ws.rooms = new Set(); const allow = bucket(10, 20);
  ws.on("pong", () => (ws.isAlive = true));
  ws.on("error", console.error);
  ws.on("message", async (raw) => {
    if (!allow()) return ws.close(1008, "rate limit");
    let msg; try { msg = Msg.parse(JSON.parse(raw.toString())); } catch { return ws.send(JSON.stringify({ type: "error", code: "bad_message" })); }
    if (msg.type === "join") {
      if (!(await canJoin(ws.userId, msg.room))) return ws.send(JSON.stringify({ type: "error", code: "forbidden" }));
      (rooms.get(msg.room) ?? rooms.set(msg.room, new Set()).get(msg.room)).add(ws); ws.rooms.add(msg.room);
    } else if (msg.type === "leave") { rooms.get(msg.room)?.delete(ws); ws.rooms.delete(msg.room); }
    else if (msg.type === "chat.send") {
      if (!ws.rooms.has(msg.room)) return ws.send(JSON.stringify({ type: "error", code: "not_in_room" }));
      const saved = await saveMessage({ room: msg.room, userId: ws.userId, text: msg.text, clientId: msg.clientId });   // idempotent on clientId
      const payload = JSON.stringify({ type: "chat.message", id: saved.id, seq: saved.seq, room: msg.room, from: ws.userId, text: msg.text, ts: saved.ts });
      for (const peer of rooms.get(msg.room) ?? []) if (peer.readyState === peer.OPEN && peer.bufferedAmount < 1e6) peer.send(payload);
      ws.send(JSON.stringify({ type: "ack", clientId: msg.clientId, id: saved.id }));
    }
  });
  ws.on("close", () => { for (const r of ws.rooms) rooms.get(r)?.delete(ws); });
});

const hb = setInterval(() => { for (const ws of wss.clients) { if (!ws.isAlive) { ws.terminate(); continue; } ws.isAlive = false; ws.ping(); } }, 30_000);
wss.on("close", () => clearInterval(hb));
server.listen(8080);
process.on("SIGTERM", () => { for (const ws of wss.clients) ws.close(1012, "restart"); server.close(); setTimeout(() => process.exit(0), 10_000); });
```

### H2. Socket.IO server with Redis adapter, auth, rooms and acks
```js
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

const io = new Server(httpServer, {
  cors: { origin: ["https://app.example.com"], credentials: true },
  maxHttpBufferSize: 1e5,
  pingInterval: 25_000, pingTimeout: 20_000,
  connectionStateRecovery: { maxDisconnectionDuration: 2 * 60 * 1000, skipMiddlewares: true },
});
const pub = createClient({ url: process.env.REDIS_URL }); const sub = pub.duplicate();
await Promise.all([pub.connect(), sub.connect()]);
io.adapter(createAdapter(pub, sub));

io.use(async (socket, next) => {
  try { socket.data.user = await verifyJwt(socket.handshake.auth?.token); next(); }
  catch { next(new Error("unauthorized")); }
});

io.on("connection", (socket) => {
  const { id: userId } = socket.data.user;
  socket.join(`user:${userId}`);
  socket.on("room:join", async (roomId, cb) => {
    if (!(await canJoin(userId, roomId))) return cb?.({ ok: false, error: "forbidden" });
    await socket.join(`room:${roomId}`);
    cb?.({ ok: true });
  });
  socket.on("chat:send", async ({ roomId, text, clientId }, cb) => {
    if (!socket.rooms.has(`room:${roomId}`)) return cb?.({ ok: false });
    const msg = await saveMessage({ roomId, userId, text, clientId });
    io.to(`room:${roomId}`).emit("chat:message", msg);
    cb?.({ ok: true, id: msg.id });
  });
});
```

### H3. Client: Socket.IO with typed events and token refresh
```ts
import { io, Socket } from "socket.io-client";
const socket: Socket<ServerToClient, ClientToServer> = io(import.meta.env.VITE_API_URL, {
  auth: (cb) => cb({ token: getAccessToken() }),
  transports: ["websocket"],            // skip long-polling → no sticky sessions needed
  reconnectionDelayMax: 10_000,
});
socket.on("connect_error", (err) => { if (err.message === "unauthorized") refreshTokenThenReconnect(); });
socket.on("connect", async () => {
  for (const room of joinedRooms) await socket.timeout(5000).emitWithAck("room:join", room);   // re-join after reconnect
  if (!socket.recovered) await resyncFromServer();                                             // missed events → refetch
});
```

### H4. SSE endpoint with resume and keep-alive
```js
app.get("/api/stream", requireAuth, async (req, res) => {
  res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive", "X-Accel-Buffering": "no" });
  const lastId = Number(req.get("last-event-id") || 0);
  for (const ev of await eventsSince(req.user.id, lastId)) res.write(`id: ${ev.id}\nevent: ${ev.type}\ndata: ${JSON.stringify(ev.data)}\n\n`);   // replay
  const onEvent = (ev) => res.write(`id: ${ev.id}\nevent: ${ev.type}\ndata: ${JSON.stringify(ev.data)}\n\n`);
  bus.on(`user:${req.user.id}`, onEvent);
  const ka = setInterval(() => res.write(": keepalive\n\n"), 20_000);
  req.on("close", () => { clearInterval(ka); bus.off(`user:${req.user.id}`, onEvent); });
});
```

### H5. Presence with Redis (heartbeat + TTL)
```js
const PRESENCE_TTL = 45;
async function heartbeat(userId, connId) {
  await redis.multi().zadd("presence", Date.now(), userId).hset(`conn:${userId}`, connId, Date.now()).expire(`conn:${userId}`, PRESENCE_TTL).exec();
}
async function online(userIds) {
  const cutoff = Date.now() - PRESENCE_TTL * 1000;
  const scores = await Promise.all(userIds.map((u) => redis.zscore("presence", u)));
  return userIds.filter((_, i) => scores[i] && Number(scores[i]) > cutoff);
}
setInterval(() => redis.zremrangebyscore("presence", 0, Date.now() - PRESENCE_TTL * 1000), 15_000);   // sweeper
```
Send presence **changes** (online/offline events), debounced, rather than polling a list.

### H6. Ordered messages with sequence numbers and gap detection
```js
// server: assign seq atomically per room
const seq = await redis.incr(`room:${roomId}:seq`);
await db.message.create({ data: { roomId, seq, userId, text } });
io.to(`room:${roomId}`).emit("chat:message", { roomId, seq, userId, text });

// client
let lastSeq = 0; const buffer = new Map();
socket.on("chat:message", (m) => {
  buffer.set(m.seq, m);
  while (buffer.has(lastSeq + 1)) { render(buffer.get(++lastSeq)); buffer.delete(lastSeq); }
  if (buffer.size && !gapTimer) gapTimer = setTimeout(async () => { await fetchMissing(lastSeq); gapTimer = null; }, 1500);   // request missing range
});
```

### H7. k6 WebSocket load test
```js
import ws from "k6/ws";
import { check } from "k6";
export const options = { stages: [{ duration: "1m", target: 2000 }, { duration: "3m", target: 2000 }, { duration: "30s", target: 0 }] };
export default function () {
  const res = ws.connect(`wss://staging.example.com/ws?ticket=${__ENV.TICKET}`, {}, (socket) => {
    socket.on("open", () => { socket.send(JSON.stringify({ type: "join", room: "load" })); socket.setInterval(() => socket.send(JSON.stringify({ type: "chat.send", room: "load", text: "hi", clientId: `${__VU}-${Date.now()}` })), 5000); });
    socket.on("message", (m) => { /* record latency from embedded timestamp */ });
    socket.setTimeout(() => socket.close(), 60_000);
  });
  check(res, { "101": (r) => r && r.status === 101 });
}
```

### H8. Nginx + Kubernetes config for WebSockets
```nginx
map $http_upgrade $connection_upgrade { default upgrade; '' close; }
server {
  listen 443 ssl http2;
  location /ws {
    proxy_pass http://ws_backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
    proxy_read_timeout 3600s;
  }
}
```
```yaml
# Ingress-nginx annotations
metadata:
  annotations:
    nginx.ingress.kubernetes.io/proxy-read-timeout: "3600"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "3600"
    nginx.ingress.kubernetes.io/affinity: "cookie"       # only if using long-polling fallback
spec:
  template:
    spec:
      terminationGracePeriodSeconds: 120
```

### H9. Yjs collaborative text with server persistence (outline)
```js
import { WebSocketServer } from "ws";
import { setupWSConnection, setPersistence } from "y-websocket/bin/utils";
setPersistence({
  bindState: async (docName, ydoc) => { const buf = await db.loadDoc(docName); if (buf) Y.applyUpdate(ydoc, buf); ydoc.on("update", debounce(() => db.saveDoc(docName, Y.encodeStateAsUpdate(ydoc)), 2000)); },
  writeState: async (docName, ydoc) => db.saveDoc(docName, Y.encodeStateAsUpdate(ydoc)),
});
wss.on("connection", (conn, req) => setupWSConnection(conn, req, { gc: true }));    // authorize in the upgrade handler before this
```

### H10. Jest test: two clients, broadcast and auth failure
```js
it("broadcasts to room members only", async () => {
  const [a, b, c] = await Promise.all([connect("alice"), connect("bob"), connect("carol")]);
  await join(a, "r1"); await join(b, "r1");                    // carol not in r1
  const got = waitFor(b, "chat.message"); const none = expectNoMessage(c, 300);
  a.send(JSON.stringify({ type: "chat.send", room: "r1", text: "hi", clientId: "1" }));
  expect((await got).text).toBe("hi"); await none;
});
it("rejects bad origin", async () => {
  await expect(connectWithOrigin("https://evil.com")).rejects.toThrow(/401|Unexpected server response/);
});
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. WebSocket connects locally but fails in production (`101` never returned)
Reverse proxy/CDN not forwarding `Upgrade`/`Connection` headers, HTTP/2-only front end, firewall blocking, mixed content (`ws://` from an `https://` page), TLS mismatch, wrong path or port. Test with `wscat` through each hop; check proxy config and WAF rules.

### D2. Connections drop every ~60 seconds
Idle timeout on a load balancer/proxy (ALB 60 s, Nginx `proxy_read_timeout` 60 s). Send heartbeats more often than the timeout and raise timeouts. Close code is typically `1006`.

### D3. Close code `1006` everywhere
Abnormal closure without a close frame: network drop, proxy killed the connection, server crash/OOM, or TLS error. Inspect server logs, LB logs, memory/OOM kills and client network.

### D4. Messages not reaching users on other servers
No shared pub/sub adapter (messages only emitted locally), Redis connectivity issues, different namespaces/prefix settings, rooms joined on a node that restarted. Add/verify the adapter, check subscriber connections, and test cross-node delivery.

### D5. Socket.IO "Transport unknown"/400 errors with multiple instances
Long-polling requests hit different nodes without sticky sessions. Enable stickiness or force `transports: ["websocket"]`.

### D6. Duplicate messages after reconnect
Client re-sent unacked messages and server wasn't idempotent, or the client joined a room twice / registered duplicate event handlers on reconnect (`socket.on` inside `connect`). De-dupe with client ids; register handlers once and remove them on cleanup.

### D7. Memory grows steadily
Leaked listeners/timers, rooms maps never cleaned on `close`, unbounded send queues for slow clients, per-connection caches. Heap snapshot compare, monitor `bufferedAmount`, enforce caps and cleanup in `close`/`error`.

### D8. High latency spikes under load
Event-loop blocking (big JSON, sync work), GC pauses, fan-out loops serializing per recipient, broker lag, CPU saturation. Profile with `--prof`/clinic.js, measure event-loop delay, serialize once, batch, scale out.

### D9. CORS errors with Socket.IO
Socket.IO needs its own CORS config (`new Server(http, { cors: {...} })`), credentials require explicit origins; long-polling XHR preflights fail if headers aren't allowed. Remember WebSocket upgrades aren't covered by CORS but long-polling is.

### D10. Auth works on connect but stale later
Token expired while the socket stayed open; revoked users still connected. Implement refresh/expiry disconnects and `disconnectSockets` on revocation; re-auth on reconnect.

### D11. React app opens multiple sockets
StrictMode double mount, effect dependencies re-creating the socket, creating the socket inside a component body. Use a singleton client or properly cleaned `useEffect`, and verify in the Network → WS tab.

### D12. Mobile clients appear online but are dead (half-open connections)
TCP didn't notice network loss; no heartbeats. Use server pings and client-side watchdog timeouts (no message/pong in X seconds → reconnect).

### D13. Ordering anomalies in groups
Messages published through multiple partitions/nodes without a single sequencer; clients rendering by arrival time. Assign sequence/timestamps server-side per conversation and sort/merge by it.

### D14. SSE stream buffered until the end
Proxy buffering/compression (Nginx `proxy_buffering`, gzip middleware), missing flush. Set `X-Accel-Buffering: no`, disable compression for the route, flush headers, send keepalive comments.

### D15. Reconnect storm after deploy overloads the DB
All clients reconnect and refetch immediately. Add jitter/backoff, stagger instance replacement, cache auth, make resync incremental, and rate limit handshakes.

---

# 🧩 Part 8: Tricky Questions

### T1. Is WebSocket "faster" than HTTP?
It avoids per-message HTTP overhead and connection setup, so small frequent messages are cheaper, but raw network latency is the same. For one-off requests HTTP/2 can be equally fast and benefits from caching.

### T2. Does WebSocket guarantee message delivery?
No. TCP guarantees ordered delivery while the connection lives, but messages in flight when it drops are lost. Application acks and resume logic provide reliability.

### T3. Is Socket.IO a WebSocket library?
It uses WebSocket as a transport but adds its own protocol; a plain WebSocket client can't talk to a Socket.IO server (and vice versa).

### T4. Are WebSockets subject to CORS?
No. The browser only sends an `Origin` header; the server must enforce it.

### T5. Can I send custom headers from the browser WebSocket API?
No (except via subprotocols and cookies). Use tickets, cookies or first-message auth.

### T6. Do WebSockets scale automatically behind a load balancer?
Connections are sticky by nature, but cross-node messaging, presence and deploy draining need design (pub/sub, drain, timeouts).

### T7. Does SSE work with POST?
`EventSource` only supports GET without custom headers. Use `fetch` streaming for POST/headers (libraries like `@microsoft/fetch-event-source`).

### T8. Why is `socket.on` inside `connect` a bug?
Handlers get registered again on every reconnect, causing duplicate processing. Register once outside, or remove before re-adding.

### T9. Is a WebSocket ping from the browser possible?
Not at the protocol level; browsers answer server pings automatically but can't initiate them. Use application-level heartbeats.

### T10. How many WebSockets can one server handle?
It depends on memory per connection, CPU for fan-out, OS limits and traffic: tens of thousands per Node process is common; hundreds of thousands to millions per node with specialized servers and low message rates. Always load test.

### T11. Does HTTP/2 make WebSockets obsolete?
No. HTTP/2 multiplexes request/response and server push is gone; SSE over HTTP/2 covers server→client, but bidirectional low-latency messaging still uses WebSocket (or WebTransport).

### T12. Should every event go over the socket?
No. Use REST for commands and queries needing HTTP semantics (idempotency, caching, auth middleware) and push lightweight events/invalidations via socket.

### T13. Is it safe to put JWT in the query string for WebSocket?
It leaks in logs/proxies. Prefer short-lived single-use tickets or cookies with Origin checks.

### T14. Why do connections die when a laptop sleeps?
TCP connections time out; NAT mappings expire. The client must detect and reconnect (visibility/online events, heartbeats).

### T15. Can I broadcast to all users by looping over `wss.clients` in a cluster?
Only to local clients. Cross-node broadcast needs a broker.

### T16. Is `permessage-deflate` always beneficial?
No. It increases CPU/memory and can cause latency; beneficial for large repetitive text, harmful for many small messages or binary data.

### T17. What's the difference between `emit` to a room and to a socket?
Room emits go to all members (across nodes with an adapter); socket emits go to one client. `socket.to(room)` excludes the sender; `io.to(room)` includes everyone.

### T18. Do rooms persist across reconnects?
Not by default: a new connection has a new socket id and no rooms. Re-join on connect (or use connection state recovery within its window).

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- **WebSocket RFC?** 6455.
- **Handshake status?** `101 Switching Protocols`.
- **Secure scheme?** `wss://`.
- **One-way push over HTTP?** SSE (`text/event-stream`).
- **SSE resume header?** `Last-Event-ID`.
- **Browser WS states?** CONNECTING, OPEN, CLOSING, CLOSED (0-3).
- **Normal close code?** 1000.
- **Abnormal close?** 1006.
- **Policy violation?** 1008.
- **Service restart?** 1012.
- **Keep-alive frames?** Ping/pong.
- **Protect against hijacking?** Check `Origin`, use tickets.
- **Socket.IO fallback?** HTTP long polling.
- **Scale across nodes?** Redis/NATS/Kafka adapter.
- **Sticky sessions needed when?** Long-polling transport.
- **Backpressure indicator?** `bufferedAmount`.
- **Reconnect strategy?** Exponential backoff + jitter.
- **Delivery semantic to aim for?** At-least-once + idempotency.
- **Ordering fix?** Server-side sequence numbers.
- **Presence storage?** Redis with TTL/heartbeats.
- **Collaboration algorithms?** OT, CRDT (Yjs, Automerge).
- **P2P media?** WebRTC (STUN/TURN + signaling).
- **IoT protocol?** MQTT.
- **QUIC-based alternative?** WebTransport.
- **LLM streaming?** SSE / fetch streams.
- **Managed options?** Ably, Pusher, PubNub, Web PubSub, Supabase Realtime.
- **LB timeout fix?** Raise idle timeout + heartbeats.
- **Deploy strategy?** Drain + jittered reconnect.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about a realtime feature you built.
STAR: "I built a live order-tracking and chat feature for a delivery app using Socket.IO with the Redis adapter. Auth used single-use tickets, rooms were per order, messages had server sequence numbers and client ids for idempotency, and clients resumed via `lastSeq`. We handled 40k concurrent connections on 6 pods, with p95 delivery under 180 ms, and the support chat reduced call volume by 22%."

### P2. Describe a scaling or reliability problem you solved.
"After a deploy, all clients reconnected at once and overloaded the auth service. I added jittered exponential backoff, a ticket cache, staggered rollouts with connection draining, and a handshake rate limiter. The next deploy produced no spike and error rate stayed under 0.1%."

### P3. How do you ensure messages aren't lost or duplicated?
"Client-generated ids + server idempotency, acks with timeouts and retries, durable storage before broadcast, sequence numbers per room, and resume from the last seen sequence. For notifications while offline we fall back to push."

### P4. WebSocket vs SSE decision you made?
"For a dashboard that only needed server→client updates and had to work behind strict corporate proxies, we chose SSE with `Last-Event-ID` resume. For chat with typing indicators and acks we used WebSockets."

### P5. How did you secure the realtime channel?
"Origin checks, ticket auth, per-event authorization via the same policy service as REST, tenant-prefixed channels, schema validation, payload/rate limits, and automated disconnect on token revocation."

### P6. How do you test and monitor realtime systems?
"k6 load tests in staging for every gateway release, synthetic canaries measuring end-to-end latency by region, dashboards for connections/close codes/event-loop lag, and chaos tests killing gateways and Redis."

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- **Fundamentals:** HTTP limitations, polling, long polling, SSE, WebSocket, WebTransport, WebRTC, MQTT.
- **WebSocket protocol:** handshake, frames, opcodes, masking, close codes, subprotocols, extensions, ping/pong.
- **Libraries:** browser API, `ws`, Socket.IO (rooms, namespaces, acks, middleware, adapters, recovery), uWebSockets.js, graphql-ws.
- **Reliability:** reconnection, heartbeats, acks, idempotency, ordering, resume, offline queues, backpressure.
- **Security:** wss, Origin/CSWSH, tickets/JWT, per-event authz, rate limits, validation, DoS defences.
- **Scaling:** sticky sessions, pub/sub, sharded rooms, presence, fan-out, multi-region, edge, capacity planning.
- **Design problems:** chat, notifications, dashboards, collaboration (OT/CRDT), games, live comments, LLM streaming.
- **Operations:** proxies/LBs, deploy draining, observability, load testing, chaos testing, cost.

## Mixed topics
- WebSockets + Redis (`031_Redis-and-Caching.md`): pub/sub, streams, presence, rate limits.
- WebSockets + auth (`036_Authentication-and-Security.md`): tickets, CSWSH, token expiry.
- WebSockets + APIs (`035_GraphQL-and-REST-APIs.md`): GraphQL subscriptions, REST + push invalidation.
- WebSockets + databases (`026_SQL.md`, `030_MongoDB.md`): LISTEN/NOTIFY, change streams, persistence.
- WebSockets + BaaS (`034_Firebase-and-Supabase.md`): Realtime listeners, Broadcast, Presence.
- WebSockets + search (`032_Elasticsearch.md`): live indexing/notifications.
- WebSockets + Kubernetes/Linux (`024_Linux-and-Networking.md`): LBs, ulimits, TCP tuning.
- WebSockets + frontend: React hooks, optimistic UI, state sync.

---

# 🔬 Part 12: Realtime Internals

### I1. TCP and why connections die silently
TCP keeps state at endpoints; if a peer vanishes (power loss, NAT timeout) no FIN/RST is sent. Keepalive defaults (2 hours on Linux) are too slow, so apps use heartbeats and timeouts. NAT/LB idle timers silently drop mappings.

### I2. Event loop and I/O multiplexing
Node uses libuv with `epoll`/`kqueue`/IOCP to monitor thousands of sockets in one thread. WebSocket servers are I/O-bound until fan-out and JSON serialization become CPU-bound. Blocking the loop delays all connections.

### I3. WebSocket frame parsing
Frames: `FIN|RSV|opcode`, `MASK|len`, optional extended length, masking key (client frames), payload. The server unmasks (XOR), reassembles fragmented messages, validates UTF-8 for text frames, enforces `maxPayload`, and handles control frames (ping/pong/close) interleaved.

### I4. Socket.IO protocol layers
Engine.IO (transport: polling/WebSocket, handshake, ping/pong, upgrade) + Socket.IO (packets: CONNECT, EVENT, ACK, DISCONNECT, namespaces, rooms). The adapter abstracts broadcasting across nodes; connection state recovery stores recent packets with offsets.

### I5. Redis pub/sub vs Streams for fan-out
Pub/sub: fire-and-forget, low latency, no persistence or replay. Streams: persisted log with consumer groups and replay (useful for state recovery). Sharded pub/sub (Redis 7) limits cluster-wide broadcast cost.

### I6. SSE format
Lines `field: value` separated by newlines; events end with a blank line. Fields: `data`, `event`, `id`, `retry`. Comments start with `:`. `EventSource` reconnects after `retry` ms sending `Last-Event-ID`.

### I7. WebRTC connection setup
Peers exchange SDP offer/answer via signaling; ICE gathers candidates (host, server-reflexive via STUN, relay via TURN); DTLS handshake secures the channel; media over SRTP, data over SCTP DataChannels. TURN relays when NAT traversal fails (cost!).

### I8. CRDT internals (sequence types)
Each character/element has a unique id (clientId, clock) and relationships (left/right origin); concurrent inserts are ordered deterministically using ids. Deletes use tombstones; garbage collection compacts when all peers have seen the state vector.

### I9. Backpressure in Node streams/sockets
`ws.send` writes to the socket buffer; if the kernel buffer fills, data accumulates in user space (`bufferedAmount`). Streams use `highWaterMark` and `drain` events; WebSocket libraries expose `bufferedAmount` to implement flow control.

---

# 📊 Part 13: Reference Tables

### Technology comparison
| | Polling | Long polling | SSE | WebSocket | WebTransport | WebRTC |
|---|---|---|---|---|---|---|
| Direction | C→S | C→S (held) | S→C | Both | Both | Peer↔Peer |
| Transport | HTTP | HTTP | HTTP | TCP (upgraded) | QUIC/HTTP3 | UDP |
| Latency | High | Medium | Low | Low | Very low | Very low |
| Overhead/msg | High | High | Low | Very low | Very low | Low |
| Proxy-friendly | Yes | Yes | Mostly | Mostly | Emerging | Needs STUN/TURN |
| Auto-reconnect | N/A | Manual | Built in | Manual | Manual | Manual |
| Typical use | Rare updates | Fallback | Feeds, LLM streaming | Chat, collab | Games, media | Calls, P2P |

### Close codes
| Code | Meaning |
|---|---|
| 1000 | Normal closure |
| 1001 | Going away |
| 1002 | Protocol error |
| 1003 | Unsupported data |
| 1006 | Abnormal (no close frame) |
| 1008 | Policy violation |
| 1009 | Message too big |
| 1011 | Server error |
| 1012 | Service restart |
| 1013 | Try again later |
| 4000-4999 | Application-defined |

### Delivery guarantees
| Guarantee | How | Cost |
|---|---|---|
| At-most-once | Fire and forget | Possible loss |
| At-least-once | Ack + retry | Duplicates → need idempotency |
| Exactly-once (effective) | At-least-once + dedupe/outbox | Complexity |
| Ordered | Sequence numbers/partitioning | Single sequencer per key |

### Scaling approaches
| Approach | Pros | Cons |
|---|---|---|
| Redis adapter pub/sub | Simple | Lossy, single Redis bottleneck |
| Kafka/NATS fan-out | Durable, scalable | Operational weight |
| Room-sharded routing | Efficient hot rooms | Rebalancing complexity |
| Managed service | No ops | Cost, lock-in |
| Edge actors (Durable Objects) | Low latency, simple consistency | Platform-specific |

### Library comparison
| | `ws` | Socket.IO | uWebSockets.js | Centrifugo | SignalR |
|---|---|---|---|---|---|
| Level | Protocol | Framework | High-performance server | Standalone realtime server | .NET framework |
| Rooms/acks | DIY | Yes | Pub/sub built in | Channels | Groups |
| Fallback | No | Long polling | No | SSE/HTTP stream | Long polling/SSE |
| Language | Node | Node + clients | Node (C++ core) | Go | .NET |

### Version highlights (verify)
| Item | Notes |
|---|---|
| RFC 6455 | WebSocket (2011) |
| RFC 8441 / 9220 | WebSocket over HTTP/2 / HTTP/3 |
| Socket.IO 4.6 | Connection state recovery |
| `ws` 8.x | Current stable line |
| WebTransport | Chromium/Firefox support, Safari evolving |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
```js
const ws = new WebSocket("wss://example.com");
console.log(ws.readyState);
```
**Output:** `0` (CONNECTING) immediately after construction; becomes `1` after `open`.

### O2.
```js
ws.send("hello");   // called before the 'open' event
```
**Result:** throws `InvalidStateError` (browser) because the socket isn't open; queue messages until `open`.

### O3.
```js
io.to("room1").emit("x");          // A
socket.to("room1").emit("x");      // B
socket.emit("x");                  // C
```
**Result:** A → all sockets in room1 (including the sender if it's in the room); B → all in room1 **except** the sender; C → only the sender.

### O4.
```js
wss.on("connection", (ws) => ws.on("message", (d) => console.log(typeof d, d)));
ws.send("hi");  // from a client
```
**Output (ws v8):** `object <Buffer 68 69>` — messages arrive as `Buffer`s; use `d.toString()`.

### O5.
Server code: `setInterval(() => ws.ping(), 30000)`; load balancer idle timeout = 60 s.
**Result:** connection stays alive (traffic every 30 s resets the idle timer).

### O6.
Client closes the tab abruptly (no close frame) on flaky Wi-Fi.
**Server sees:** close event with code `1006` after TCP/heartbeat timeout — not an immediate event, unless heartbeats detect it.

### O7.
```js
// two Node instances, no adapter
io.emit("news", "x");   // runs on instance A
```
**Result:** only clients connected to instance A receive it.

### O8.
```js
const es = new EventSource("/stream");
// server restarts, resends events with ids
```
**Result:** `EventSource` reconnects automatically after `retry` ms (default ~3 s) and sends `Last-Event-ID: <last id>`.

### O9.
```js
ws.bufferedAmount
```
after sending 50 MB to a slow client.
**Output:** a large number (bytes queued but not yet transmitted) — use to stop sending or drop the client.

### O10.
```js
new WebSocketServer({ maxPayload: 1024 });   // client sends 2 KB message
```
**Result:** connection closed with code `1009` (message too big).

### O11.
```js
socket.on("connect", () => socket.on("msg", handler));   // reconnects 3 times
```
**Result:** after 3 reconnects `handler` runs 4 times per message (duplicate registration).

### O12.
```http
GET /chat HTTP/1.1
Upgrade: websocket
Origin: https://evil.com
```
**Result (secure server):** handshake rejected (403/401) due to Origin allow-list; a naive server returns `101` and enables CSWSH.

---

# ✅ Part 15: MCQs

**1. What HTTP status code completes the WebSocket handshake?**
A) 200  B) 101  C) 204  D) 301
**Answer: B**

**2. Which is one-way (server → client) over HTTP?**
A) WebSocket  B) SSE  C) WebRTC  D) MQTT only
**Answer: B**

**3. WebSockets are protected from cross-site connections by:**
A) CORS  B) Nothing automatic: servers must verify Origin  C) SameSite always  D) HTTPS only
**Answer: B**

**4. Socket.IO's fallback transport is:**
A) FTP  B) HTTP long polling  C) SMTP  D) gRPC
**Answer: B**

**5. To broadcast across multiple Socket.IO servers you need:**
A) Nothing  B) A shared adapter (Redis/NATS/etc.)  C) More threads  D) HTTP/3
**Answer: B**

**6. Close code 1006 indicates:**
A) Normal close  B) Abnormal closure without a close frame  C) Policy violation  D) Server restart
**Answer: B**

**7. Best reconnection strategy:**
A) Immediate infinite retry  B) Exponential backoff with jitter  C) No retry  D) Fixed 1 ms retry
**Answer: B**

**8. Which provides ordering across reconnects?**
A) TCP  B) Server-assigned sequence numbers  C) Ping/pong  D) CORS
**Answer: B**

**9. `ws.bufferedAmount` is used for:**
A) Authentication  B) Detecting backpressure from slow clients  C) Compression  D) Counting rooms
**Answer: B**

**10. What problem do sticky sessions solve in Socket.IO?**
A) CORS  B) Long-polling requests needing the same server  C) JSON parsing  D) Compression
**Answer: B**

**11. Which browser API lets you set an `Authorization` header on a WebSocket?**
A) `new WebSocket(url, { headers })`  B) None  C) `ws.setHeader()`  D) `fetch` upgrade
**Answer: B**

**12. Which technology is best for collaborative text editing merges?**
A) Polling  B) CRDT/OT libraries (Yjs)  C) SSE  D) FTP
**Answer: B**

**13. A "tickle" notification means:**
A) Sending the full state over the socket  B) Sending a small event telling clients to refetch via REST  C) Closing connections  D) Compressing frames
**Answer: B**

**14. Why add jitter to reconnection delays?**
A) To slow users  B) To avoid thundering herds  C) To enable compression  D) To bypass CORS
**Answer: B**

**15. SSE auto-resume uses which header?**
A) `If-None-Match`  B) `Last-Event-ID`  C) `Range`  D) `Origin`
**Answer: B**

**16. WebRTC needs which for NAT traversal when P2P fails?**
A) CORS  B) TURN relay  C) JWT  D) Redis
**Answer: B**

**17. Which is a valid way to avoid leaking tokens in URLs?**
A) Put JWT in query string  B) Use single-use short-lived tickets or cookies with Origin checks  C) Log URLs  D) Use HTTP
**Answer: B**

**18. The WebSocket protocol RFC is:**
A) 2616  B) 6455  C) 7540  D) 8446
**Answer: B**

**19. Best way to deliver LLM tokens to a browser:**
A) Polling every second  B) SSE or streaming fetch  C) Email  D) FTP
**Answer: B**

**20. During deploys, to avoid reconnect storms you should:**
A) Kill all pods at once  B) Drain connections gradually and use jittered reconnects  C) Disable heartbeats  D) Use shorter timeouts
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

1. **No `Origin` validation** (CSWSH) and cookie-only auth.
2. **JWTs in query strings** that end up in logs.
3. **No heartbeats**, causing half-open connections and LB idle drops.
4. **Immediate retry loops** without backoff/jitter.
5. **Assuming delivery:** no acks, ids or idempotency.
6. **Broadcasting only locally** in multi-instance deployments.
7. **No per-event authorization**, trusting client-supplied room/user ids.
8. **No payload size/rate limits.**
9. **Ignoring backpressure** and slow consumers.
10. **Registering handlers in `connect`** (duplicates).
11. **Blocking the event loop** with heavy JSON/regex/crypto.
12. **Serializing per recipient** instead of once.
13. **Memory leaks** from rooms/listeners/timers not cleaned on close.
14. **Pushing full state** instead of deltas/invalidations.
15. **Not handling reconnect resync** (missed messages).
16. **Using WebSockets where SSE/polling suffices.**
17. **Forgetting proxy/LB timeout and upgrade configuration.**
18. **Not draining connections on deploy**; reconnect storms.
19. **Trusting presence as exact**; ignoring grace periods.
20. **No load testing or observability** (close codes, latency, lag).
21. **Putting large files/binary blobs over the realtime channel.**
22. **Storing socket state only in process memory** with no recovery plan.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You choose **WebSocket vs SSE vs polling vs WebRTC** from requirements, not habit.
- You design **reliability explicitly**: ids, acks, idempotency, sequence numbers, resume, outbox.
- You secure sockets properly: **Origin checks, tickets, per-event authz, rate/size limits**.
- You scale with **pub/sub, sharded rooms, presence and fan-out optimizations**, and plan for reconnect storms and deploys.
- You understand the **protocol and infrastructure** details: frames, close codes, proxies, idle timeouts, OS limits.
- You monitor **end-to-end latency, close codes, event-loop lag and broker lag**, with synthetic canaries.
- You handle **backpressure and graceful degradation** deliberately.
- You know **collaboration algorithms** (OT/CRDT) and their trade-offs.
- You compare **build vs buy** with TCO and lock-in awareness.
- You bring measured results from load tests and incidents.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Protocol quick facts
```
Handshake: GET + Upgrade: websocket → 101 Switching Protocols (Sec-WebSocket-Key/Accept)
Frames: text 0x1, binary 0x2, close 0x8, ping 0x9, pong 0xA; client frames masked
Codes: 1000 normal • 1001 going away • 1006 abnormal • 1008 policy • 1009 too big • 1012 restart
Browser: new WebSocket(url) → readyState 0/1/2/3; no custom headers; no manual ping
```

### Reliability checklist
Heartbeats (< LB idle timeout) • reconnect with backoff + jitter • client ids + server idempotency • acks + retries • sequence numbers + gap fill • resume (`lastSeq`/`Last-Event-ID`) • durable store before broadcast • outbox/offline queue • push fallback.

### Security checklist
`wss://` • Origin allow-list • tickets/cookies (no JWT in URLs) • per-event authz • schema validation • `maxPayload` + rate limits • connection quotas • tenant-scoped channels • disconnect on revocation/expiry • sanitize rendered content • monitor abuse.

### Scaling checklist
Stateless logic • pub/sub adapter • sticky sessions only if polling • LB/proxy timeouts raised • room sharding for hot rooms • presence in Redis with TTL • serialize once • backpressure caps • draining deploys • capacity tests (connections, msgs/s, fan-out) • observability and alerts.

### Pattern quick picks
One-way feed → SSE • Chat/collab → WebSocket (+Redis/NATS) • Rare updates → polling • Video/voice → WebRTC • IoT → MQTT • Global scale without ops → managed service • Document merge → Yjs/CRDT • DB-driven live UI → Supabase/Firebase • Notifications offline → push/email fallback.

### Interview strategy
1. Clarify scale (connections, msgs/s), latency, reliability and ordering needs.
2. Choose the transport and justify it against alternatives.
3. Describe auth, rooms/channels and message protocol (ids, acks, sequences).
4. Explain scaling (gateway tier, pub/sub, presence, sharding).
5. Cover failure modes: reconnects, deploys, slow consumers, broker loss.
6. Discuss security, observability and load testing.
7. Close with measured numbers from a real system.

### Final checklist before the interview
- [ ] Explain the handshake, frames, close codes and ping/pong.
- [ ] Compare polling, long polling, SSE, WebSocket, WebTransport and WebRTC.
- [ ] Compare `ws` vs Socket.IO and use rooms, namespaces and acks.
- [ ] Implement reconnection with backoff + jitter, heartbeats and resume.
- [ ] Authenticate sockets securely and prevent CSWSH; authorize each event.
- [ ] Design multi-node scaling with pub/sub, sticky sessions rules and presence.
- [ ] Guarantee ordering and delivery (sequence numbers, acks, idempotency).
- [ ] Handle backpressure, memory, event-loop health and deploy draining.
- [ ] Design chat, notifications and collaborative editing systems.
- [ ] Prepare a realtime project story and an incident/scale story with numbers.
