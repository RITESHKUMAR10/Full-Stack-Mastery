# FastAPI Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **FastAPI 0.115+ with Pydantic v2, Starlette, Python 3.11/3.12+** and SQLAlchemy 2.0. Features that changed recently (lifespan events, `Annotated` dependencies, `fastapi dev` CLI, Pydantic v2 APIs) are called out. Verify exact versions in the official docs (fastapi.tiangolo.com). Sample name in examples: **Ritesh Kumar**.
> Python language fundamentals (asyncio, GIL, typing) are in file 014. This file focuses on FastAPI itself: routing, validation, dependency injection, auth, databases, async behavior, testing, deployment and performance.

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
- [Part 11: Complete Coverage (Features + Ecosystem + Mixed)](#-part-11-complete-coverage-features--ecosystem--mixed)
- [Part 12: FastAPI Internals](#-part-12-fastapi-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is FastAPI?
A modern, high-performance Python web framework for building APIs. It is built on **Starlette** (ASGI toolkit) and **Pydantic** (data validation). It uses Python type hints to validate input, serialize output and auto-generate interactive documentation (OpenAPI + Swagger UI + ReDoc).
```python
from fastapi import FastAPI
app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello, Ritesh Kumar"}
```

### Q2. Why is it called "fast"?
Two meanings: **fast to run** (ASGI, async support, Pydantic v2 with a Rust core, performance comparable to Node/Go frameworks for I/O-bound work) and **fast to code** (less boilerplate, automatic validation and docs, fewer bugs thanks to types and editor support).

### Q3. How do you install and run it?
```bash
pip install "fastapi[standard]"        # includes uvicorn, httpx, etc.
fastapi dev main.py                    # dev server with auto-reload (newer CLI)
uvicorn main:app --reload              # classic way
```
Docs are served at `/docs` (Swagger UI) and `/redoc`; the schema is at `/openapi.json`.

### Q4. What is ASGI and how does it differ from WSGI?
WSGI is the old synchronous interface (Flask/Django classic) with one request per worker thread/process at a time. ASGI is the async successor: supports async handlers, WebSockets, long-lived connections and HTTP/2-friendly designs. FastAPI runs on ASGI servers such as Uvicorn, Hypercorn, Daphne.

### Q5. What are path operations and decorators?
A path operation is a function bound to a path and HTTP method with a decorator: `@app.get`, `@app.post`, `@app.put`, `@app.patch`, `@app.delete`.

### Q6. Path parameters
```python
@app.get("/users/{user_id}")
def get_user(user_id: int):          # automatically converted and validated
    return {"id": user_id}
```
`/users/abc` returns a `422` validation error automatically.

### Q7. Query parameters
```python
@app.get("/items")
def list_items(skip: int = 0, limit: int = 10, q: str | None = None):
    return {"skip": skip, "limit": limit, "q": q}
```
Function parameters that are not in the path are query parameters. A default makes them optional.

### Q8. Request body with Pydantic models
```python
from pydantic import BaseModel, EmailStr

class UserIn(BaseModel):
    name: str
    email: EmailStr
    age: int | None = None

@app.post("/users", status_code=201)
def create_user(user: UserIn):
    return user
```
FastAPI reads JSON, validates it, and gives you a typed object.

### Q9. Response models
```python
class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr

@app.post("/users", response_model=UserOut, status_code=201)
def create_user(user: UserIn):
    return {"id": 1, **user.model_dump(), "password": "hidden"}   # password is filtered out
```
`response_model` filters, validates and documents the output (never leak fields like passwords).

### Q10. Automatic documentation
FastAPI generates an OpenAPI 3 schema from your code. Swagger UI (`/docs`) lets you try endpoints; ReDoc (`/redoc`) is a reading-friendly view. You can disable them in production: `FastAPI(docs_url=None, redoc_url=None)`.

### Q11. What is Pydantic?
A data validation library using type hints. It parses input (coercing types in lax mode), validates constraints, and serializes output. Pydantic v2 is written in Rust (pydantic-core) and is much faster than v1.

### Q12. `def` vs `async def` endpoints *(Must-know)*
Use `async def` when the function awaits async libraries. Use plain `def` for blocking/sync code: FastAPI runs `def` endpoints in a **thread pool** so they do not block the event loop. Never call blocking code (like `requests.get` or a sync DB driver) inside `async def`, because it freezes the whole server.

### Q13. HTTP status codes in FastAPI
```python
from fastapi import status, HTTPException
@app.get("/users/{id}")
def get(id: int):
    if id not in db:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return db[id]
```
Set success codes with `status_code=201` on the decorator.

### Q14. Validation errors (422)
When input is invalid, FastAPI returns `422 Unprocessable Entity` with a JSON body listing each error (`loc`, `msg`, `type`). You can customize the handler.

### Q15. Field validation with `Query`, `Path`, `Body`
```python
from typing import Annotated
from fastapi import Query, Path

@app.get("/items/{item_id}")
def read(
    item_id: Annotated[int, Path(ge=1)],
    q: Annotated[str | None, Query(min_length=3, max_length=50)] = None,
): ...
```

### Q16. Pydantic field constraints
```python
from pydantic import BaseModel, Field
class Product(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    price: float = Field(gt=0)
    tags: list[str] = []
```

### Q17. Headers and cookies
```python
from fastapi import Header, Cookie
@app.get("/me")
def me(user_agent: Annotated[str | None, Header()] = None, session: Annotated[str | None, Cookie()] = None): ...
```
Underscores in names convert to hyphens for headers (`user_agent` → `user-agent`).

### Q18. Form data and file uploads
```python
from fastapi import Form, File, UploadFile
@app.post("/login")
def login(username: Annotated[str, Form()], password: Annotated[str, Form()]): ...

@app.post("/upload")
async def upload(file: UploadFile):
    content = await file.read()
    return {"name": file.filename, "size": len(content)}
```
Needs `python-multipart` installed. `UploadFile` spools large files to disk instead of keeping them in memory.

### Q19. What is dependency injection in FastAPI? *(Must-know)*
Functions declared with `Depends()` are called by FastAPI before your endpoint, and their results are passed in. Use it for DB sessions, auth, pagination, settings, shared logic.
```python
def pagination(skip: int = 0, limit: int = 20):
    return {"skip": skip, "limit": min(limit, 100)}

@app.get("/items")
def items(p: Annotated[dict, Depends(pagination)]):
    return p
```

### Q20. What is a router (`APIRouter`)?
Groups related endpoints into modules.
```python
# routers/users.py
from fastapi import APIRouter
router = APIRouter(prefix="/users", tags=["users"])
@router.get("/")
def list_users(): ...
# main.py
app.include_router(router)
```

### Q21. How do you handle CORS?
```python
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(CORSMiddleware, allow_origins=["https://app.example.com"],
                   allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
```
Never use `allow_origins=["*"]` with credentials.

### Q22. What are background tasks?
```python
from fastapi import BackgroundTasks
def send_email(to: str): ...
@app.post("/signup")
def signup(email: str, tasks: BackgroundTasks):
    tasks.add_task(send_email, email)
    return {"status": "queued"}
```
Runs after the response is sent, in the same process. For heavy or critical work use a real queue (Celery, Arq, Dramatiq).

### Q23. How do you read the raw `Request`?
```python
from fastapi import Request
@app.get("/info")
async def info(request: Request):
    return {"client": request.client.host, "path": request.url.path}
```

### Q24. What are the HTTP methods and their use?
`GET` read, `POST` create/action, `PUT` replace, `PATCH` partial update, `DELETE` remove, `HEAD`/`OPTIONS` metadata. GET/PUT/DELETE should be idempotent.

### Q25. How do you return different response types?
`JSONResponse`, `HTMLResponse`, `PlainTextResponse`, `RedirectResponse`, `FileResponse`, `StreamingResponse`, `ORJSONResponse`-style faster JSON (verify availability).
```python
from fastapi.responses import RedirectResponse
@app.get("/old")
def old(): return RedirectResponse("/new", status_code=308)
```

### Q26. How do you serve static files and templates?
`app.mount("/static", StaticFiles(directory="static"), name="static")` and Jinja2 via `Jinja2Templates`. For API-only services skip both.

### Q27. What is the difference between `PUT` and `PATCH` implementation in FastAPI?
For `PATCH`, use a model with all optional fields and `model_dump(exclude_unset=True)` to apply only what the client sent.
```python
class UserPatch(BaseModel):
    name: str | None = None
    age: int | None = None
patch = body.model_dump(exclude_unset=True)
```

### Q28. How do you run the app in production?
Use a process manager: `uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4`, or Gunicorn with Uvicorn workers (`-k uvicorn.workers.UvicornWorker`), or one process per container scaled by Kubernetes. Put Nginx/ALB in front and disable `--reload`.

### Q29. What are environment settings and secrets?
Use `pydantic-settings`:
```python
from pydantic_settings import BaseSettings, SettingsConfigDict
class Settings(BaseSettings):
    database_url: str
    secret_key: str
    model_config = SettingsConfigDict(env_file=".env")
settings = Settings()
```
Never commit `.env` files.

### Q30. How do you test a FastAPI app?
```python
from fastapi.testclient import TestClient
client = TestClient(app)
def test_root():
    r = client.get("/")
    assert r.status_code == 200
    assert r.json() == {"message": "Hello, Ritesh Kumar"}
```
Use `pytest`; for async tests use `httpx.AsyncClient` with `ASGITransport`.

### Q31. What is the difference between FastAPI, Flask and Django?
| | FastAPI | Flask | Django |
|---|---|---|---|
| Style | API-first, async-ready, type-driven | Minimal micro-framework | Full-stack "batteries included" |
| Validation | Built-in (Pydantic) | Add-ons | Forms/serializers (DRF) |
| Docs | Automatic OpenAPI | Add-ons | Add-ons |
| ORM/Admin | Bring your own | Bring your own | Built in |
| Best for | APIs, ML services, microservices | Small apps, flexibility | Full products with admin |

### Q32. What is Uvicorn?
A lightning-fast ASGI server (built on `uvloop` and `httptools` when installed). It runs your FastAPI app; it is not a framework.

### Q33. What is `response_model_exclude_unset` / `exclude_none`?
Options to omit fields that were not set or are `None` from the response, producing smaller payloads.

### Q34. How do you add metadata to docs?
```python
app = FastAPI(title="Orders API", version="1.0.0", description="Order service", contact={"name": "Ritesh Kumar"})
@app.get("/x", summary="Short", description="Long text", tags=["items"], response_description="OK")
```
Use docstrings and `examples` in Pydantic models to improve docs.

### Q35. What does `Optional[str] = None` mean?
The parameter is optional and may be `None`. In modern Python write `str | None = None`. Note: a type that allows `None` is not automatically optional in Pydantic v2; you still need a default to make it not required.

---

# 🔵 Part 2: Junior (1–3 years)

### Q36. How does `Depends` work, and what can be cached? *(Must-know)*
FastAPI builds a dependency graph from the signature of your endpoint. Each dependency is called once per request (results are **cached per request** by default), even if used in several places. `Depends(dep, use_cache=False)` disables caching. Dependencies can themselves have dependencies (sub-dependencies).

### Q37. Dependencies with `yield` (resource cleanup) *(Must-know)*
```python
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/users")
def users(db: Annotated[Session, Depends(get_db)]): ...
```
Code after `yield` runs after the response is sent (cleanup). In newer versions exit code timing relative to the response changed; verify the behavior in the docs for your version.

### Q38. Reusable `Annotated` dependencies
```python
DbDep = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]

@app.get("/me")
def me(user: CurrentUser): return user
```
Cleaner than repeating `Depends(...)` in every signature.

### Q39. Global, router-level and decorator-level dependencies
```python
app = FastAPI(dependencies=[Depends(verify_api_key)])           # every route
router = APIRouter(dependencies=[Depends(require_admin)])        # every route in the router
@app.get("/x", dependencies=[Depends(rate_limit)])               # this route; result not used
```

### Q40. Class-based dependencies
```python
class Pagination:
    def __init__(self, skip: int = 0, limit: int = 20):
        self.skip, self.limit = skip, min(limit, 100)
@app.get("/items")
def items(p: Annotated[Pagination, Depends()]): ...
```

### Q41. Overriding dependencies in tests *(Must-know)*
```python
app.dependency_overrides[get_db] = lambda: fake_db
app.dependency_overrides[get_current_user] = lambda: User(id=1, name="Ritesh Kumar")
# cleanup
app.dependency_overrides.clear()
```
This is the main reason to use DI: swap DB, auth and external clients without monkeypatching.

### Q42. OAuth2 password flow with JWT *(Must-know)*
```python
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import jwt   # PyJWT
oauth2 = OAuth2PasswordBearer(tokenUrl="token")

@app.post("/token")
def login(form: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user = authenticate(form.username, form.password)
    if not user: raise HTTPException(401, "Incorrect username or password", headers={"WWW-Authenticate": "Bearer"})
    token = jwt.encode({"sub": str(user.id), "exp": datetime.now(timezone.utc) + timedelta(minutes=15)}, SECRET, algorithm="HS256")
    return {"access_token": token, "token_type": "bearer"}

def get_current_user(token: Annotated[str, Depends(oauth2)]):
    try:
        payload = jwt.decode(token, SECRET, algorithms=["HS256"])
    except jwt.PyJWTError:
        raise HTTPException(401, "Invalid token", headers={"WWW-Authenticate": "Bearer"})
    return load_user(payload["sub"])
```
Hash passwords with Argon2 or bcrypt (`pwdlib`, `passlib` is older and less maintained: verify current docs). Always pass `algorithms=[...]` when decoding.

### Q43. API key and HTTP Basic auth
`APIKeyHeader(name="X-API-Key")`, `HTTPBasic()`, `HTTPBearer()` from `fastapi.security`. They also integrate with the "Authorize" button in Swagger UI. Compare secrets with `secrets.compare_digest`.

### Q44. Authorization (roles and permissions)
```python
def require_role(*roles):
    def checker(user: CurrentUser):
        if user.role not in roles:
            raise HTTPException(403, "Forbidden")
        return user
    return checker

@app.delete("/users/{id}", dependencies=[Depends(require_role("admin"))])
```
Also check resource ownership in the service layer (avoid IDOR).

### Q45. SQLAlchemy 2.0 with FastAPI (sync)
```python
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker, DeclarativeBase, Mapped, mapped_column, Session

engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(engine, expire_on_commit=False)

class Base(DeclarativeBase): pass
class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(unique=True, index=True)

@app.get("/users/{id}")
def get_user(id: int, db: DbDep):
    user = db.get(User, id)
    if not user: raise HTTPException(404)
    return user
```
Use `response_model` with `model_config = ConfigDict(from_attributes=True)` to serialize ORM objects.

### Q46. Async SQLAlchemy
```python
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
engine = create_async_engine("postgresql+asyncpg://...")
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def get_db():
    async with SessionLocal() as session:
        yield session

@app.get("/users")
async def users(db: Annotated[AsyncSession, Depends(get_db)]):
    return (await db.scalars(select(User).limit(50))).all()
```
Avoid lazy loading in async code (use `selectinload`/`joinedload`).

### Q47. Migrations with Alembic
`alembic init`, `alembic revision --autogenerate -m "add users"`, `alembic upgrade head`. Review autogenerated migrations, keep them backward compatible for zero-downtime deploys, and run them as a deploy step (not at app startup in every replica).

### Q48. Pydantic v2 key changes from v1 *(Must-know)*
| v1 | v2 |
|---|---|
| `.dict()` | `.model_dump()` |
| `.json()` | `.model_dump_json()` |
| `parse_obj()` | `model_validate()` |
| `class Config:` | `model_config = ConfigDict(...)` |
| `@validator` | `@field_validator` |
| `@root_validator` | `@model_validator` |
| `orm_mode = True` | `from_attributes=True` |
| `regex=` | `pattern=` |
| `BaseSettings` in pydantic | moved to `pydantic-settings` |

### Q49. Custom validators
```python
from pydantic import BaseModel, field_validator, model_validator

class SignUp(BaseModel):
    password: str
    confirm: str

    @field_validator("password")
    @classmethod
    def strong(cls, v: str) -> str:
        if len(v) < 8: raise ValueError("password too short")
        return v

    @model_validator(mode="after")
    def match(self):
        if self.password != self.confirm: raise ValueError("passwords do not match")
        return self
```

### Q50. Input vs output schemas (never expose the DB model)
Separate `UserCreate` (has password), `UserUpdate` (all optional), `UserRead` (no password, has id), and the ORM `User`. Reusing one model for everything leaks fields or allows mass assignment.

### Q51. Error handling with custom exception handlers
```python
class AppError(Exception):
    def __init__(self, status: int, message: str): self.status, self.message = status, message

@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError):
    return JSONResponse(status_code=exc.status, content={"error": exc.message})
```
Override `RequestValidationError` to reshape 422 responses; always return a consistent error format.

### Q52. Middleware
```python
import time
@app.middleware("http")
async def timing(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    response.headers["X-Process-Time"] = f"{time.perf_counter() - start:.4f}"
    return response
```
`@app.middleware("http")` is easy but can interfere with background tasks and streaming; for high-performance cases write pure ASGI middleware.

### Q53. Lifespan events (startup/shutdown) *(Must-know)*
```python
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.http = httpx.AsyncClient(timeout=5)      # startup
    yield
    await app.state.http.aclose()                      # shutdown

app = FastAPI(lifespan=lifespan)
```
`@app.on_event("startup")` is deprecated; use `lifespan`.

### Q54. Pagination
```python
@app.get("/posts", response_model=list[PostRead])
def posts(db: DbDep, skip: int = Query(0, ge=0), limit: int = Query(20, ge=1, le=100)):
    return db.scalars(select(Post).order_by(Post.id).offset(skip).limit(limit)).all()
```
Use keyset (cursor) pagination for large tables.

### Q55. Response status and headers
```python
from fastapi import Response
@app.post("/items", status_code=201)
def create(item: Item, response: Response):
    response.headers["Location"] = f"/items/{item.id}"
    return item
```

### Q56. Tags, prefixes, versioning
```python
app.include_router(users_v1.router, prefix="/api/v1")
app.include_router(users_v2.router, prefix="/api/v2")
```
Sub-applications can be mounted: `app.mount("/v2", v2_app)`.

### Q57. Streaming responses
```python
from fastapi.responses import StreamingResponse
def gen():
    for i in range(1000):
        yield f"line {i}\n"
@app.get("/stream")
def stream(): return StreamingResponse(gen(), media_type="text/plain")
```
Use for large files, CSV exports and LLM token streaming (SSE).

### Q58. Server-Sent Events and WebSockets
```python
from fastapi import WebSocket, WebSocketDisconnect
@app.websocket("/ws")
async def ws(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            msg = await websocket.receive_text()
            await websocket.send_text(f"echo: {msg}")
    except WebSocketDisconnect:
        pass
```
Authenticate during connection (token in query/header/cookie), and use Redis pub/sub to broadcast across processes.

### Q59. Logging
Configure `logging` (or `structlog`) once in `lifespan`. Add a request ID middleware (via `contextvars`) and log JSON in production. Uvicorn has its own access logs: configure or disable to avoid duplicates.

### Q60. `httpx` in endpoints
Create **one** `AsyncClient` in lifespan and reuse it; creating a client per request wastes connections. Always set timeouts.

### Q61. Common deployment patterns
Docker image with uv or pip, non-root user, `uvicorn` or Gunicorn workers, health endpoints, reverse proxy (`--proxy-headers`, `--forwarded-allow-ips`), Kubernetes with readiness/liveness probes.

### Q62. Health checks
`/healthz` (process alive, no dependencies) and `/readyz` (DB reachable). Keep them cheap and unauthenticated.

---

# 🟡 Part 3: Mid (3–5 years)

### Q63. How does FastAPI handle concurrency internally? *(Must-know)*
`async def` endpoints run directly on the event loop; `def` endpoints are run in a thread pool (AnyIO, default 40 threads). Dependencies follow the same rule individually. So blocking calls in `async def` stall everything, while many slow `def` endpoints can exhaust the thread pool. Choose per endpoint based on the libraries you use. CPU-bound work should go to a process pool or a worker queue.

### Q64. Tuning the threadpool
```python
import anyio
@asynccontextmanager
async def lifespan(app):
    anyio.to_thread.current_default_thread_limiter().total_tokens = 100
    yield
```
Increase only if threads wait on I/O; more threads raise memory and contention.

### Q65. Running blocking code from async endpoints
```python
import asyncio
from fastapi.concurrency import run_in_threadpool

@app.get("/report")
async def report():
    return await run_in_threadpool(build_report)       # or asyncio.to_thread(build_report)
```

### Q66. Project structure for a bigger app *(Architecture)*
```
app/
  main.py               # app factory, lifespan, router includes
  core/config.py        # settings
  core/security.py
  api/deps.py           # shared dependencies
  api/routes/users.py   # routers (thin)
  schemas/user.py       # Pydantic models
  models/user.py        # ORM models
  services/user.py      # business logic
  repositories/user.py  # DB access
  tests/
alembic/
```
Routers stay thin; services contain business rules; repositories hide SQL.

### Q67. Application factory pattern
```python
def create_app() -> FastAPI:
    app = FastAPI(lifespan=lifespan)
    app.include_router(api_router, prefix="/api")
    register_exception_handlers(app)
    return app
app = create_app()
```
Makes testing and configuration easier.

### Q68. Settings management with caching
```python
from functools import lru_cache
@lru_cache
def get_settings() -> Settings: return Settings()
SettingsDep = Annotated[Settings, Depends(get_settings)]
```
Override `get_settings` in tests via `dependency_overrides`.

### Q69. Password hashing
Use Argon2 or bcrypt. Never store plain or fast-hashed passwords. Return the same error for unknown user and wrong password. Rate limit login attempts.
```python
from pwdlib import PasswordHash
ph = PasswordHash.recommended()
hashed = ph.hash("secret"); ph.verify("secret", hashed)
```
(Verify the current recommended library in the FastAPI docs.)

### Q70. Refresh tokens and logout
Short-lived access token (about 15 minutes) plus a refresh token (stored hashed in DB or Redis, rotated on every use, delivered in an httpOnly cookie). Logout deletes the refresh token. Detect reuse of an old refresh token and revoke the family.

### Q71. OAuth2/OIDC with external providers
Use `authlib` or a provider SDK (Auth0, Keycloak, Cognito, Google). Validate JWTs using the provider's JWKS (check `iss`, `aud`, `exp`, signature). Avoid writing your own identity provider.

### Q72. Rate limiting
Libraries: `slowapi`, `fastapi-limiter` (Redis). Use a shared store for multiple workers, key by user/API key, return `429` with `Retry-After`. Often handled at the gateway (Nginx, Kong, Cloudflare).

### Q73. Caching
HTTP caching headers/ETags, Redis for computed results (`aiocache`, `fastapi-cache2`), in-process `TTLCache` for small hot data, and CDN for public GETs. Define invalidation (TTL, event-based). Never cache user-specific data in shared keys.

### Q74. Background jobs at scale
`BackgroundTasks` is for small post-response work. For reliable jobs use Celery, Arq (async, Redis), Dramatiq or cloud queues. Enqueue IDs, make jobs idempotent, add retries with backoff and a dead-letter queue, and report status via a job-status endpoint.

### Q75. File uploads at scale
Stream to object storage using pre-signed URLs so large files bypass your API. If you accept uploads directly: limit size (Nginx `client_max_body_size` + app checks), validate type by content, scan for malware, and store with random names.

### Q76. Request validation edge cases
Use `Annotated` types for reuse, `Literal` and `Enum` for allowed values, `Field(default_factory=...)` for mutable defaults, `StrictInt` etc. for strict mode, and `model_config = ConfigDict(extra="forbid")` to reject unknown fields.

### Q77. Pydantic performance tips
Use v2, avoid unnecessary re-validation (`model_construct` only for trusted data), prefer `TypeAdapter` for validating lists, avoid huge nested models in hot paths, and consider `orjson`-based responses for large payloads (check current FastAPI recommendations since defaults improved).

### Q78. Dependency injection for services
```python
def get_user_service(db: DbDep) -> UserService:
    return UserService(UserRepository(db))
UserServiceDep = Annotated[UserService, Depends(get_user_service)]

@router.post("/", response_model=UserRead, status_code=201)
def create(body: UserCreate, svc: UserServiceDep): return svc.create(body)
```

### Q79. Testing patterns *(Must-know)*
- Unit-test services with fakes.
- Integration tests with `TestClient` and a real test DB (Testcontainers/Docker), rolling back each test.
- Override dependencies for auth and external services.
- Async tests: `pytest-asyncio` or `anyio` plus `httpx.AsyncClient(transport=ASGITransport(app=app))`.
- Test error paths (401, 403, 404, 422), not only happy paths.

### Q80. Testing lifespan events
`with TestClient(app) as client:` runs lifespan startup and shutdown; plain `TestClient(app)` without the context manager does not.

### Q81. OpenAPI customization
Customize `operation_id` (cleaner generated clients), tags metadata, examples, security schemes, and the schema itself via `app.openapi()`. Generate typed clients with `openapi-generator` or `openapi-typescript`.

### Q82. Generics and reusable response envelopes
```python
from typing import Generic, TypeVar
from pydantic import BaseModel
T = TypeVar("T")
class Page(BaseModel, Generic[T]):
    items: list[T]
    total: int
    page: int
@app.get("/users", response_model=Page[UserRead])
```

### Q83. Handling multiple response models
```python
@app.get("/items/{id}", responses={404: {"model": ErrorOut}, 403: {"model": ErrorOut}})
```
Documents error responses in OpenAPI so generated clients know them.

### Q84. Trusted hosts, HTTPS and proxy headers
Use `TrustedHostMiddleware`, terminate TLS at the proxy, run Uvicorn with `--proxy-headers --forwarded-allow-ips` set to your proxy only, and redirect HTTP to HTTPS at the edge.

### Q85. Security checklist for FastAPI *(Must-know)*
Validate everything (Pydantic), `extra="forbid"` where appropriate, response models to avoid leaking fields, parameterized queries/ORM, Argon2/bcrypt, JWT verification with fixed algorithms, short token lifetimes, strict CORS, rate limiting, request size limits, secure headers at the proxy, disabled docs in production if private, dependency scanning, secrets from a manager.

### Q86. Handling datetime and timezones
Accept ISO 8601, store UTC, use aware datetimes (`datetime.now(timezone.utc)`), and let Pydantic serialize to ISO strings. Convert at the edge (client or presentation layer).

### Q87. Enums and Literal types
```python
from enum import Enum
class Status(str, Enum):
    active = "active"; blocked = "blocked"
@app.get("/users")
def users(status: Status = Status.active): ...
```
The docs show a dropdown and invalid values return 422.

### Q88. Sub-applications and mounting
`app.mount("/admin", admin_app)` mounts a separate ASGI app (including Flask via `WSGIMiddleware`). Each sub-app has its own docs and middleware.

### Q89. Idempotency for POST
Accept an `Idempotency-Key` header, store the key and response (Redis/DB), return the stored result on retry. Essential for payments and unreliable networks.

### Q90. Observability
Prometheus metrics (`prometheus-fastapi-instrumentator`), OpenTelemetry tracing (`opentelemetry-instrumentation-fastapi`), structured logs with request IDs, Sentry for errors. Label metrics by route template, not raw URL.

### Q91. Serving ML models with FastAPI
Load the model once at startup (lifespan), keep it in `app.state`, validate input with Pydantic, run CPU/GPU inference off the event loop (thread/process pool or dedicated inference server), batch requests when possible, expose health and version endpoints, and stream tokens for LLMs. For heavy production inference consider Triton, vLLM or BentoML behind the API. (See files 073 and 066.)

### Q92. Streaming LLM output (SSE)
```python
from fastapi.responses import StreamingResponse
async def token_stream(prompt: str):
    async for token in llm.astream(prompt):
        yield f"data: {token}\n\n"
@app.post("/chat")
async def chat(req: ChatIn):
    return StreamingResponse(token_stream(req.prompt), media_type="text/event-stream")
```
Disable proxy buffering (`X-Accel-Buffering: no`) and handle client disconnects.


---

# 🟠 Part 4: Senior (5–7 years)

### Q93. How do you design a production-grade FastAPI service? *(Architecture)*
Layered structure (routers → services → repositories), settings via `pydantic-settings`, dependency injection for everything external, lifespan-managed resources (DB engine, HTTP client, Redis), structured logging with request IDs, metrics and tracing, consistent error format, health probes, Alembic migrations as a deploy step, tests at several levels, a slim non-root Docker image, graceful shutdown, and CI with linting, type checks and security scans.

### Q94. Sync or async: how do you decide per service? *(Decision)*
Use `async def` end to end when the stack is async (asyncpg/async SQLAlchemy, httpx, Redis asyncio) and the service is dominated by many concurrent I/O waits. Use `def` endpoints with sync drivers for simpler CRUD services and CPU-light work; FastAPI's thread pool handles concurrency. Do not mix: an `async def` with a sync DB driver blocks the loop; a `def` endpoint that uses `asyncio.run` inside is a smell.

### Q95. Database connection pooling and sizing
Total connections = `workers × (pool_size + max_overflow)` must stay below the database `max_connections`. Use `pool_pre_ping=True`, `pool_recycle`, and a pooler like PgBouncer for many workers/pods. Keep sessions short-lived (one per request), avoid holding a connection while calling external APIs, and set statement timeouts.

### Q96. Transactions and the unit of work
Handle commit/rollback in one place (a dependency or service), not scattered in repositories.
```python
async def get_session():
    async with SessionLocal() as s:
        try:
            yield s
            await s.commit()
        except Exception:
            await s.rollback()
            raise
```
Be careful: commits after the response starts (dependency exit timing) can hide errors from the client; many teams commit explicitly in the service layer instead.

### Q97. Avoiding N+1 queries
Use `selectinload` (separate IN query, good for collections) or `joinedload` (JOIN, good for single objects), project only needed columns, and log SQL in tests to catch regressions. For async, lazy loading raises errors, which forces explicit loading.

### Q98. Handling high concurrency safely
Limit concurrent outbound calls with `asyncio.Semaphore`, use timeouts (`asyncio.timeout`, `httpx.Timeout`), apply backpressure (bounded queues), shed load when overloaded (return `503` early), and size workers to cores. Avoid unbounded `asyncio.gather` over huge lists.

### Q99. Timeouts and cancellation
Uvicorn does not enforce request timeouts by default. Add them: gateway/proxy timeouts, per-call client timeouts, `asyncio.timeout()` around handler work, and handle client disconnects (`await request.is_disconnected()`, or catch `asyncio.CancelledError` and clean up).

### Q100. Pure ASGI middleware vs `BaseHTTPMiddleware`
`@app.middleware("http")` wraps `BaseHTTPMiddleware`, which adds overhead, can break streaming/background task behavior in edge cases and contextvars propagation. For logging, request IDs and auth hooks on hot paths, write pure ASGI middleware:
```python
class RequestIdMiddleware:
    def __init__(self, app): self.app = app
    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            rid = dict(scope["headers"]).get(b"x-request-id", uuid4().hex.encode())
            request_id_ctx.set(rid.decode())
        await self.app(scope, receive, send)
```

### Q101. Request context with `contextvars`
Store request ID, user and tenant in `ContextVar`s set by middleware/dependencies so loggers and repositories can read them without passing parameters. Works across `await` boundaries and thread-pool calls made through AnyIO.

### Q102. Multi-tenancy
Resolve the tenant (subdomain, header, JWT claim) in a dependency, pass tenant ID into services, scope every query (or use PostgreSQL row-level security with `SET app.tenant`), per-tenant rate limits and cache keys, and test cross-tenant isolation explicitly.

### Q103. Reliable messaging: outbox and idempotent consumers
Write business data and an outbox row in one transaction; a worker publishes outbox rows to Kafka/RabbitMQ/SQS. Consumers dedupe by message ID and are idempotent. This avoids "saved but event lost" and "event sent but transaction rolled back".

### Q104. Event-driven pieces with FastAPI
Publish events from services, consume with separate worker processes (FastStream, Celery, Arq, custom consumers). Keep the web process free of long-running consumers unless you manage their lifecycle in `lifespan`.

### Q105. Performance tuning checklist
Profile first (py-spy, cProfile, OpenTelemetry traces). Remove blocking calls, reuse clients, add indexes, cache, paginate, select only needed columns, return smaller payloads, stream large responses, use `uvloop`/`httptools` (installed with `uvicorn[standard]`), tune workers, and consider `ORJSONResponse` or Pydantic's JSON serialization for large responses. Measure p95/p99, not averages.

### Q106. Gunicorn vs Uvicorn workers vs single process per pod
Gunicorn + `UvicornWorker` gives process supervision on VMs. In Kubernetes prefer one Uvicorn process per container (or a few) and scale pods, since the orchestrator already restarts and scales. Use `--limit-max-requests` with jitter only to mitigate known leaks, and configure `--timeout-graceful-shutdown`.

### Q107. Graceful shutdown
Uvicorn handles `SIGTERM`: stops accepting connections, waits for in-flight requests (up to the graceful timeout), then runs lifespan shutdown. Flip readiness to false first so the load balancer drains traffic, and make sure background tasks and consumers finish or checkpoint.

### Q108. Zero-downtime deployments and migrations
Rolling or blue/green deploys with readiness probes. Migrations follow expand → migrate → contract: add columns/tables first, deploy code that works with both schemas, backfill, then remove old structures later. Never run destructive migrations in the same release as the code that depends on them.

### Q109. API versioning and compatibility
Prefix routers (`/api/v1`). Add fields without breaking clients; do not change types or remove fields within a version. Deprecate with `deprecated=True`, sunset headers, and clear changelogs. Use contract tests on the OpenAPI schema (`schemathesis`, `oasdiff`).

### Q110. Property-based and contract testing
`schemathesis` generates requests from your OpenAPI schema to find crashes and schema violations. Add `hypothesis` for business rules. Consumer-driven contract tests (Pact) protect shared APIs.

### Q111. Security in depth
Threat model; strict input/output schemas; `extra="forbid"`; authorization checks in services (IDOR); secrets in a manager; short-lived tokens and rotation; CSRF protection if using cookies; SSRF protection when fetching user-provided URLs (allow-lists, block internal IP ranges); limit upload size; audit logs; dependency and image scanning; WAF and rate limits at the edge.

### Q112. Debugging production incidents
Check dashboards (latency, errors, saturation: event loop lag, thread pool, DB pool wait), recent deploys, logs/traces by request ID, then use `py-spy dump` on a live process for hangs. Typical causes: blocking call in `async def`, DB pool exhaustion, missing timeouts, slow queries, memory growth from unbounded caches, and proxy timeouts. Mitigate (rollback, scale, feature flag) before deep analysis.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q113. FastAPI vs Django/DRF vs Flask vs Node frameworks: how do you decide? *(Decision)*
| | FastAPI | Django + DRF | Flask | NestJS/Express |
|---|---|---|---|---|
| Best for | Typed async APIs, ML services, microservices | Full products with admin, auth, ORM | Small services, custom stacks | JS/TS teams, full-stack JS |
| Productivity | High for APIs | Very high for CRUD apps | Medium | High |
| Validation/docs | Built-in | DRF serializers/add-ons | Add-ons | Add-ons/pipes |
| Async story | Native | Improving | Limited | Native |
| Ecosystem | Python data/AI strengths | Mature | Mature | Huge npm |
Decide by team skills, need for built-in admin/ORM, async needs, data/ML integration, and long-term maintainability. FastAPI is a strong default when the team is Python-first and builds APIs next to ML or data code.

### Q114. Platform "golden path" for FastAPI services
A cookiecutter/template with settings, logging, tracing, metrics, health checks, auth dependency, error format, Dockerfile, CI (ruff, mypy, pytest, security scans), Alembic setup, and sample tests. Shared internal libraries for auth, HTTP clients, pagination and observability. Version them and publish to a private index.

### Q115. Modular monolith vs microservices with FastAPI
Start with a modular monolith (clear module boundaries, one deployable, shared DB with strict ownership by module). Split services where scaling, team autonomy or tech needs demand it (for example a GPU inference service separate from the CRUD API). Use import linting to enforce module boundaries.

### Q116. API governance and contracts
OpenAPI is the contract. Lint specs (Spectral), diff schemas in CI to block breaking changes, publish generated SDKs, maintain a deprecation policy and changelog, and provide sandbox environments. Treat error formats and pagination as platform standards.

### Q117. Reliability and SLOs
Define SLIs/SLOs (availability, p95 latency, error rate), error budgets, alerting on symptoms, runbooks, on-call, chaos/failure testing, load tests (Locust, k6), capacity planning, and blameless post-mortems.

### Q118. Cost and capacity management
Right-size pods, autoscale on latency/queue depth/CPU, cache aggressively, move heavy work to queues, use spot capacity for batch jobs, compress and paginate responses, track cost per request, and for ML services optimize batching and hardware utilization.

### Q119. Data and ML integration architecture
Separate the **serving** concerns (FastAPI: validation, auth, orchestration) from **inference** concerns (model servers, GPUs). Use async queues for long inference, caching for repeated prompts/results, feature stores for consistent features, and model registries for versions. Add monitoring for latency, throughput, drift and cost.

### Q120. Security program
Secure SDLC with SAST/DAST/SCA, secret scanning, dependency update automation, pen tests, least privilege (IAM, DB roles), audit trails, data protection (encryption in transit and at rest, PII handling), and compliance requirements (GDPR, SOC2).

### Q121. Migration strategies
Flask/Django views → FastAPI via strangler pattern behind a gateway, Pydantic v1 → v2 (use `bump-pydantic`, run tests, migrate module by module), sync → async per endpoint, monolith → services by bounded context. Keep tests as the safety net and measure before/after.

### Q122. Team practices and mentoring
Code review checklist (schemas, auth, error handling, transactions, timeouts, tests), pair on async pitfalls, shared lint/type configs, architectural decision records, and internal workshops on dependency injection and database performance.

### Q123. Observability strategy
Unified logging format with request IDs, RED metrics per route template, USE metrics for resources (event loop lag, thread pool saturation, DB pool), distributed traces across services, SLO dashboards and alerts, and telemetry cost control (sampling).

### Q124. Technical debt and roadmap
Track outdated Python/FastAPI/Pydantic versions, blocking calls in async code, missing tests, inconsistent error formats, large routers with business logic, and slow CI. Reserve capacity each sprint and review the roadmap quarterly (framework releases, security advisories, Python support lifecycle).

---

# 💻 Part 6: Coding / Machine-Coding Tasks

> Practice from memory. Mention validation, auth, errors, tests and performance.

### C1. CRUD API with SQLAlchemy 2.0 (sync) and Pydantic v2
```python
from typing import Annotated
from fastapi import FastAPI, Depends, HTTPException, Query
from pydantic import BaseModel, ConfigDict, EmailStr
from sqlalchemy import create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker, Session

engine = create_engine("sqlite:///./app.db", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(engine, expire_on_commit=False)

class Base(DeclarativeBase): pass
class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    email: Mapped[str] = mapped_column(unique=True)
Base.metadata.create_all(engine)

class UserCreate(BaseModel):
    name: str
    email: EmailStr
class UserRead(UserCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int

def get_db():
    with SessionLocal() as db:
        yield db
DbDep = Annotated[Session, Depends(get_db)]

app = FastAPI()

@app.post("/users", response_model=UserRead, status_code=201)
def create(body: UserCreate, db: DbDep):
    if db.scalar(select(User).where(User.email == body.email)):
        raise HTTPException(409, "Email already exists")
    user = User(**body.model_dump())
    db.add(user); db.commit(); db.refresh(user)
    return user

@app.get("/users", response_model=list[UserRead])
def list_users(db: DbDep, skip: int = Query(0, ge=0), limit: int = Query(20, ge=1, le=100)):
    return db.scalars(select(User).order_by(User.id).offset(skip).limit(limit)).all()

@app.get("/users/{user_id}", response_model=UserRead)
def get_user(user_id: int, db: DbDep):
    user = db.get(User, user_id)
    if not user: raise HTTPException(404, "User not found")
    return user

@app.delete("/users/{user_id}", status_code=204)
def delete(user_id: int, db: DbDep):
    user = db.get(User, user_id)
    if not user: raise HTTPException(404, "User not found")
    db.delete(user); db.commit()
```

### C2. JWT authentication module
See Q42. Add `get_current_active_user`, role checks (Q44), and tests that override the dependency.

### C3. Request ID and timing pure ASGI middleware
See Q100. Return `X-Request-ID` in responses and include it in log records via a logging filter reading the context variable.

### C4. Global exception handlers with a consistent format
```python
from fastapi.exceptions import RequestValidationError
@app.exception_handler(RequestValidationError)
async def validation_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(status_code=422, content={"error": "validation_error",
        "details": [{"field": ".".join(map(str, e["loc"][1:])), "message": e["msg"]} for e in exc.errors()]})

@app.exception_handler(Exception)
async def unhandled(request: Request, exc: Exception):
    log.exception("unhandled")
    return JSONResponse(status_code=500, content={"error": "internal_error"})
```

### C5. Lifespan with shared HTTP client and DB engine
See Q53; use `app.state` and a dependency `def get_http(request: Request): return request.app.state.http`.

### C6. Paginated generic response
See Q82. Return `Page[UserRead](items=..., total=..., page=...)`.

### C7. File upload with size and type validation
```python
ALLOWED = {"image/png", "image/jpeg"}
MAX = 2 * 1024 * 1024
@app.post("/avatar")
async def avatar(file: UploadFile):
    if file.content_type not in ALLOWED:
        raise HTTPException(415, "Only PNG or JPEG")
    data = await file.read(MAX + 1)
    if len(data) > MAX:
        raise HTTPException(413, "File too large")
    return {"name": file.filename, "size": len(data)}
```
Also verify magic bytes and store under a random name.

### C8. Rate limiter dependency (Redis, fixed window)
```python
async def rate_limit(request: Request, redis: RedisDep, limit: int = 60):
    key = f"rl:{request.client.host}:{int(time.time() // 60)}"
    n = await redis.incr(key)
    if n == 1: await redis.expire(key, 60)
    if n > limit: raise HTTPException(429, "Too many requests", headers={"Retry-After": "60"})
```

### C9. Background email with failure handling
```python
async def send_welcome(email: str):
    try: await mailer.send(email)
    except Exception: log.exception("email failed")
@app.post("/signup", status_code=201)
async def signup(body: SignUp, tasks: BackgroundTasks):
    user = await create_user(body)
    tasks.add_task(send_welcome, user.email)
    return user
```
For guaranteed delivery use a queue with retries.

### C10. WebSocket chat with a connection manager
```python
class Manager:
    def __init__(self): self.active: set[WebSocket] = set()
    async def connect(self, ws): await ws.accept(); self.active.add(ws)
    def disconnect(self, ws): self.active.discard(ws)
    async def broadcast(self, msg: str):
        for ws in list(self.active):
            try: await ws.send_text(msg)
            except Exception: self.disconnect(ws)
manager = Manager()

@app.websocket("/ws/{room}")
async def chat(ws: WebSocket, room: str):
    await manager.connect(ws)
    try:
        while True: await manager.broadcast(await ws.receive_text())
    except WebSocketDisconnect:
        manager.disconnect(ws)
```
In-memory managers work for one process only; use Redis pub/sub for several.

### C11. Streaming a large CSV export
```python
import csv, io
def rows():
    buf = io.StringIO(); w = csv.writer(buf)
    for r in db_iterator():
        w.writerow(r); yield buf.getvalue(); buf.seek(0); buf.truncate(0)
@app.get("/export.csv")
def export():
    return StreamingResponse(rows(), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=export.csv"})
```

### C12. Testing with dependency overrides and a test DB
```python
@pytest.fixture
def client(db_session):
    app.dependency_overrides[get_db] = lambda: db_session
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

def test_create_user(client):
    r = client.post("/users", json={"name": "Ritesh Kumar", "email": "r@example.com"})
    assert r.status_code == 201 and r.json()["email"] == "r@example.com"
    assert client.post("/users", json={"name": "X", "email": "r@example.com"}).status_code == 409
```

### C13. Async test with httpx
```python
import pytest, httpx
@pytest.mark.anyio
async def test_root():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as c:
        assert (await c.get("/")).status_code == 200
```

### C14. Health and readiness endpoints
```python
@app.get("/healthz")
def healthz(): return {"status": "ok"}
@app.get("/readyz")
async def readyz(db: AsyncDbDep):
    await db.execute(text("SELECT 1"))
    return {"status": "ready"}
```

### C15. ML model endpoint loaded once
```python
@asynccontextmanager
async def lifespan(app):
    app.state.model = joblib.load("model.pkl")
    yield
class Features(BaseModel):
    values: list[float] = Field(min_length=4, max_length=4)
@app.post("/predict")
async def predict(f: Features, request: Request):
    model = request.app.state.model
    y = await run_in_threadpool(model.predict, [f.values])
    return {"prediction": float(y[0])}
```

### C16. API key authentication
```python
from fastapi.security import APIKeyHeader
api_key = APIKeyHeader(name="X-API-Key", auto_error=False)
def verify_key(key: Annotated[str | None, Depends(api_key)]):
    if not key or not secrets.compare_digest(key, settings.api_key):
        raise HTTPException(401, "Invalid API key")
```

### C17. Dockerfile
```dockerfile
FROM python:3.12-slim
ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1
WORKDIR /app
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev
COPY app ./app
RUN useradd -m app && chown -R app /app
USER app
EXPOSE 8000
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers"]
```

### C18. Idempotency-Key dependency (outline)
```python
async def idempotency(request: Request, redis: RedisDep, key: Annotated[str | None, Header(alias="Idempotency-Key")] = None):
    if key:
        cached = await redis.get(f"idem:{key}")
        if cached: raise CachedResponse(json.loads(cached))     # handler returns stored response
```
Production versions lock the key while the first request is processing.

### C19. Dependency-based pagination with cursor
```python
@app.get("/events")
def events(db: DbDep, after: int = 0, limit: int = Query(50, le=200)):
    rows = db.scalars(select(Event).where(Event.id > after).order_by(Event.id).limit(limit)).all()
    return {"items": rows, "next": rows[-1].id if len(rows) == limit else None}
```

### C20. Alembic setup and first migration
```bash
alembic init migrations
# set sqlalchemy.url / target_metadata = Base.metadata in env.py
alembic revision --autogenerate -m "create users"
alembic upgrade head
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. `422 Unprocessable Entity` and you don't know why
Read the `detail` list: `loc` shows where (body, query, path, header), `msg` explains. Common causes: wrong JSON shape, missing `Content-Type: application/json`, sending a body to an endpoint declaring query params, or a model field type mismatch.

### D2. Endpoint is very slow under load but CPU is low
A blocking call inside `async def` (sync DB driver, `requests`, `time.sleep`) is stalling the event loop. Switch to async libraries, use `def` endpoints, or `run_in_threadpool`. Check event loop lag.

### D3. Requests hang when many are in flight
Thread pool exhausted (many slow `def` endpoints) or DB pool exhausted (`QueuePool limit reached`). Increase limits carefully, add timeouts, fix slow queries, and ensure sessions are closed.

### D4. `sqlalchemy.exc.TimeoutError: QueuePool limit of size 5 overflow 10 reached`
Connections not returned: sessions never closed, long transactions, or too much concurrency. Use dependencies with `yield`, keep transactions short, size the pool correctly, and use PgBouncer.

### D5. `DetachedInstanceError` / `MissingGreenlet`
Accessing lazy-loaded attributes after the session closed or in async code. Use eager loading (`selectinload`), `expire_on_commit=False`, and convert to Pydantic models inside the session scope.

### D6. Response contains password hash or internal fields
No `response_model`. Always declare output schemas; return ORM objects only through a read model.

### D7. `ValidationError` raised when returning data (`ResponseValidationError`)
The returned object does not match the `response_model` (missing fields, wrong types, ORM object without `from_attributes=True`). Fix the data or the schema.

### D8. CORS errors in the browser
Middleware order or origin mismatch: CORS must allow the exact origin; with credentials you cannot use `*`. Errors thrown before CORS middleware responds can lack headers. Add `CORSMiddleware` and test preflight (`OPTIONS`).

### D9. Dependency with `yield` cleanup runs late or raises after response
Exit code after `yield` runs after the response is sent; exceptions there cannot change the response. Do commits/rollbacks deliberately in services if the client needs to know about failures.

### D10. Background task not running or failing silently
Exceptions in background tasks are only logged. Wrap with try/except and logging; for reliability use a queue. In tests, background tasks run with `TestClient` after the response.

### D11. Swagger "Authorize" fails
`tokenUrl` wrong, form field names must be `username` and `password` (OAuth2PasswordRequestForm), `python-multipart` missing, or wrong scheme in the response (`token_type: "bearer"`).

### D12. Pydantic v1/v2 confusion errors (`.dict()` deprecated, `orm_mode` not recognized)
Check installed versions. Use `model_dump`, `from_attributes`, `field_validator`. Run `bump-pydantic` for migration.

### D13. `RuntimeError: Event loop is closed` / `attached to a different loop` in tests
Async engine or client created at import time in a different loop than the test's. Create resources in fixtures/lifespan, use a single event loop configuration (`anyio_backend` fixture), and dispose engines at teardown.

### D14. Docs page blank or shows wrong server URL behind a proxy
Set `root_path` (or `--root-path`) and forward headers (`--proxy-headers`). Verify the proxy passes `X-Forwarded-Prefix` if using path-based routing.

### D15. File upload fails with 422 or `python-multipart` error
Missing `python-multipart`, wrong field name, or mixing JSON body with `File`/`Form` (multipart cannot carry a JSON body model; use `Form` fields or send JSON as a string field and parse it).

### D16. Memory growth in a long-running service
Unbounded caches or global lists, `lru_cache` holding large objects, loading models per request, large response buffering, or leaked tasks. Use `tracemalloc`, bound caches, and load models once.

### D17. Duplicate log lines or missing logs
Multiple logging handlers (Uvicorn and your config both), or loggers not propagating. Configure logging in one place, disable duplicate handlers, and set levels per logger.

### D18. WebSocket disconnects silently behind a load balancer
Idle timeouts at the proxy. Send periodic ping/pong, raise proxy timeouts, and handle reconnects on the client.

### D19. Startup failures in Kubernetes (`CrashLoopBackOff`)
Missing env vars (settings validation error), DB not ready (add retries or init container), migrations not applied, or port mismatch. Check pod logs and readiness probe config.

### D20. Wrong client IP or http scheme in logs/redirects
Missing proxy header configuration. Run Uvicorn with `--proxy-headers --forwarded-allow-ips="<proxy ip>"` and make sure the proxy sets `X-Forwarded-*` headers.

### D21. Tests pass individually but fail together
Shared database state, leftover `dependency_overrides`, global caches, or unclosed sessions. Use transactional fixtures, clear overrides, and random test ordering.

### D22. Debugging method (say this in interviews)
Reproduce with a minimal request → read the error and traceback → check logs/traces by request ID → isolate (validation, dependency, DB, external call, event loop) → hypothesis → fix → regression test → alert/runbook.


---

# 🧩 Part 8: Tricky Questions

### T1. Why does FastAPI run `def` endpoints in a thread pool?
So blocking sync code does not freeze the event loop. Each `def` call is dispatched to a worker thread (AnyIO default limit 40). `async def` endpoints run directly on the loop and must never block.

### T2. Can I use `await` inside a `def` endpoint?
No, `await` is only valid in `async def`. Make the endpoint `async def`, or call sync code from `async def` via `run_in_threadpool`.

### T3. What does the order of path operations mean?
FastAPI matches in declaration order. `/users/me` must be declared before `/users/{user_id}`, otherwise `me` is parsed as an id (and fails validation for `int`).

### T4. Why do I get 422 when I send a body to a GET endpoint?
GET endpoints do not read bodies by convention; any function parameter that is a Pydantic model is a body, which GET handlers should avoid. Use query parameters instead.

### T5. Single body parameter: embedded or not?
With one Pydantic model parameter the body is the model itself. With several body parameters (or `Body(embed=True)`) the JSON must nest each under its parameter name.

### T6. What decides if a parameter is path, query or body?
Name appears in the path → path. Scalar type (int, str, bool) → query. Pydantic model (or `Body()`) → body. Use `Query`, `Header`, `Cookie`, `Form`, `File` markers to override.

### T7. `Optional[int]` vs default values in Pydantic v2
`x: int | None` is **required** but may be `None`. `x: int | None = None` is optional. This differs from v1 where `Optional` implied a default of `None`.

### T8. Why does `response_model` filter fields?
It validates and serializes the returned data through the model, dropping fields not declared. That is both a feature (hide secrets) and a source of surprises (missing fields in the response).

### T9. Do dependencies run for each place they are used?
No, they are cached per request by default: the same dependency function with the same arguments runs once. Disable with `use_cache=False`.

### T10. Do `dependencies=[...]` in the decorator pass values to the function?
No. They run for side effects (auth checks, rate limits) and their return values are discarded.

### T11. Is `BackgroundTasks` a queue?
No. It runs functions in the same process after the response. If the process crashes or restarts, tasks are lost. Not for critical or long-running jobs.

### T12. `@app.on_event("startup")` vs `lifespan`
`on_event` is deprecated. `lifespan` is an async context manager that handles both startup and shutdown in one place and lets you share state cleanly.

### T13. Why is `Depends` object created per request but my client is reused?
Dependencies are called per request. Long-lived resources (HTTP clients, engines, models) belong in `lifespan` and are accessed via `app.state`; the dependency only returns the existing object.

### T14. Does `TestClient` run lifespan?
Only when used as a context manager (`with TestClient(app) as c:`).

### T15. Pydantic coerces types by default
`"5"` becomes `5` for `int` in lax mode, and `"true"` becomes `True`. Use strict types (`StrictInt`, `strict=True`) when coercion is undesirable.

### T16. `extra` fields in request bodies
Pydantic ignores unknown fields by default. Set `extra="forbid"` to reject them, which catches typos and some mass-assignment attempts.

### T17. Why does returning an ORM object sometimes fail?
Without `from_attributes=True` Pydantic expects dicts/models. Add the config or convert explicitly.

### T18. Mutable defaults in models
Pydantic copies defaults safely per instance, but use `Field(default_factory=list)` to be explicit and avoid confusion.

### T19. `status_code` and 204
For `204 No Content`, return nothing (`Response(status_code=204)` or `status_code=204` with `None`). Returning a body with 204 violates the HTTP spec.

### T20. Why can docs show `422` on every endpoint?
FastAPI adds the standard validation error response automatically to the OpenAPI schema.

### T21. `async def` + CPU-bound work
An `async def` with heavy CPU work blocks the event loop just like blocking I/O. Offload to a process pool or worker.

### T22. Multiple workers and in-memory state
Each worker process has its own memory. In-memory caches, WebSocket connection sets and rate limit counters are per worker. Use Redis or another shared store.

### T23. `--reload` in production
Never. It watches files and restarts workers; it is for development only.

### T24. Why do generated client names look ugly?
OpenAPI `operationId` defaults to function name + path. Customize with `generate_unique_id_function` for cleaner SDK method names.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

| Question | Short answer |
|---|---|
| Built on which libraries? | Starlette + Pydantic |
| Server to run it? | Uvicorn (ASGI) |
| Docs URL? | `/docs` (Swagger), `/redoc` |
| OpenAPI schema URL? | `/openapi.json` |
| Dev command? | `fastapi dev main.py` |
| Validate body? | Pydantic `BaseModel` |
| Filter output? | `response_model` |
| Group routes? | `APIRouter` |
| Dependency injection? | `Depends()` |
| Startup/shutdown? | `lifespan` |
| Background work after response? | `BackgroundTasks` |
| Heavy jobs? | Celery / Arq / Dramatiq |
| Handle auth? | `OAuth2PasswordBearer`, JWT |
| Test client? | `TestClient` / `httpx.AsyncClient` |
| Override deps in tests? | `app.dependency_overrides` |
| Raise HTTP error? | `HTTPException` |
| Custom error handler? | `@app.exception_handler` |
| Add CORS? | `CORSMiddleware` |
| File upload? | `UploadFile` + `python-multipart` |
| Form data? | `Form()` |
| Stream data? | `StreamingResponse` |
| WebSocket? | `@app.websocket` |
| Settings? | `pydantic-settings` |
| ORM commonly used? | SQLAlchemy 2.0 |
| Migrations? | Alembic |
| Async DB driver for Postgres? | `asyncpg` / `psycopg` async |
| Path parameter? | `{id}` in route + function arg |
| Query parameter? | Function arg not in path |
| Constrain values? | `Field`, `Query`, `Path` |
| Disable docs? | `docs_url=None, redoc_url=None` |
| Pydantic v2 dump? | `model_dump()` |
| Pydantic v2 validate? | `model_validate()` |
| Partial update? | `model_dump(exclude_unset=True)` |
| Behind proxy? | `--proxy-headers`, `root_path` |
| Scale in Kubernetes? | One process per pod, more pods |
| Blocking code in async? | Never; use threadpool |
| 422 means? | Validation error |

---

# 🎤 Part 10: Project / Behavioral Questions

> Use **S**ituation, **T**ask, **A**ction, **R**esult.

### B1. Tell me about an API you built or scaled with FastAPI.
**Sample (Ritesh Kumar):** *Situation:* An ML scoring API had p95 latency of 1.4 s at 100 requests/s. *Task:* Reach 500 requests/s under 300 ms. *Action:* Loaded the model once in `lifespan`, moved inference to a thread pool, replaced a sync HTTP client with a shared `httpx.AsyncClient` with timeouts, added Redis caching for repeated inputs, and tuned the DB pool. *Result:* p95 fell to 210 ms and throughput increased 5x on the same hardware.

### B2. A production incident you handled.
Example: the service froze because a sync DB call sat inside `async def`. Describe detection (event loop lag alert), mitigation (scale out, rollback), root cause, fix (switch to async driver), tests, alerts and post-mortem.

### B3. How did you improve reliability or developer experience?
Introduced a service template (settings, logging, auth, health checks, CI), dependency overrides for tests, OpenAPI-based contract checks, and typed generated clients. Share metrics such as reduced bug rate or faster onboarding.

### B4. How do you keep an API secure?
Schema validation, response models, authorization checks in services, short-lived tokens, rate limits, secret management, dependency scanning and regular reviews. Share a real vulnerability you found and fixed.

### B5. How do you review FastAPI PRs?
Check input/output schemas, auth on every route, `def` vs `async def` correctness, transaction handling, timeouts, error format, tests (including negative paths), and migrations safety.

### B6. Experience with migrations (Pydantic v1→v2, Flask→FastAPI, sync→async).
Describe slicing, tooling (`bump-pydantic`), tests as a safety net, canary rollout and measured results.

### B7. How do you mentor juniors?
Teach the sync/async model, dependency injection and testing with overrides; review for leaking ORM models and missing validation; provide a checklist for new endpoints.

---

# 📚 Part 11: Complete Coverage (Features + Ecosystem + Mixed)

## FastAPI feature surface
Path/query/header/cookie/form/file parameters, request bodies, Pydantic models, response models, status codes, `HTTPException`, exception handlers, dependencies (sub-dependencies, `yield`, global/router-level), security utilities (OAuth2, API key, HTTP Basic/Bearer), middleware, CORS, GZip, TrustedHost, HTTPS redirect, background tasks, lifespan, routers, sub-applications, static files, templates, WebSockets, streaming/SSE, custom responses, OpenAPI customization, testing, `fastapi` CLI.

## Ecosystem
- **Core:** Starlette, Pydantic v2, Uvicorn, Gunicorn, AnyIO, uvloop, httptools.
- **Databases:** SQLAlchemy 2.0, SQLModel, Alembic, asyncpg, psycopg, Tortoise ORM, Beanie/Motor (MongoDB), Redis (redis-py asyncio).
- **Auth:** PyJWT / python-jose (verify maintenance), Authlib, pwdlib / passlib, fastapi-users.
- **Queues/jobs:** Celery, Arq, Dramatiq, FastStream, RQ.
- **Testing:** pytest, httpx, pytest-asyncio / anyio, Testcontainers, schemathesis, faker, factory-boy.
- **Quality:** ruff, mypy/pyright, pre-commit, bandit.
- **Observability:** OpenTelemetry, prometheus-fastapi-instrumentator, structlog, Sentry.
- **Rate limit/cache:** slowapi, fastapi-limiter, fastapi-cache2.
- **Deploy:** Docker, Kubernetes, AWS ECS/Lambda (Mangum), Cloud Run, Fly.io, Nginx/Traefik.
- **AI:** LangChain/LlamaIndex backends, vLLM/Triton behind FastAPI, streaming endpoints.

## Mixed topics
REST design, authentication/authorization, database design, caching, async concurrency, security, testing strategy, deployment, observability, and ML serving.

---

# 🔬 Part 12: FastAPI Internals

### I1. Request flow
Client → ASGI server (Uvicorn) → middleware stack (Starlette) → router matching → dependency resolution → parameter parsing and validation (Pydantic) → endpoint call → response serialization via `response_model` → response middleware → client.

### I2. How FastAPI uses type hints
At import time, `inspect.signature` and type hints are read to build a **dependant** tree: each parameter becomes a path/query/header/cookie/body/dependency field. Pydantic builds validators and an OpenAPI schema from the same information, so docs and validation never drift.

### I3. How `Depends` is resolved
`solve_dependencies` walks the dependant tree depth-first, calls each callable (async directly, sync in the thread pool), caches results by `(callable, scopes)` for the request, collects errors, and passes values into the endpoint. `yield` dependencies are wrapped in async context managers managed by an `AsyncExitStack`.

### I4. Serialization
After the endpoint returns, FastAPI validates the result against `response_model` (if any) and encodes it (`jsonable_encoder` in older paths, Pydantic serialization in newer ones) into JSON. Returning a `Response` object directly bypasses this.

### I5. Starlette roots
Routing, middleware, requests, responses, WebSockets, static files, background tasks and test client all come from Starlette. FastAPI adds the type-driven validation, dependency system and OpenAPI generation.

### I6. ASGI interface
An ASGI app is `async def app(scope, receive, send)`. `scope` describes the connection, `receive` yields incoming events (request body chunks, websocket messages), `send` emits response events. Middleware wraps this callable.

### I7. Pydantic v2 core
Model schemas compile into a validator tree executed by Rust (`pydantic-core`), which is why validation is much faster. Models support strict/lax modes, custom validators, serializers and JSON Schema generation.

### I8. Thread pool and AnyIO
Sync endpoints and dependencies run via `anyio.to_thread.run_sync` using a capacity limiter (40 tokens by default). Context variables are copied into the thread.

### I9. OpenAPI generation
`app.openapi()` walks routes, collects models and parameters, builds JSON Schema components, and caches the result. Docs UIs fetch `/openapi.json` and render it.

---

# 📊 Part 13: Reference Tables

### Parameter sources
| Source | Declaration | Example |
|---|---|---|
| Path | `{id}` in route | `/users/{id}` |
| Query | scalar arg or `Query()` | `?page=2` |
| Body | Pydantic model or `Body()` | JSON payload |
| Header | `Header()` | `X-Token` |
| Cookie | `Cookie()` | `session` |
| Form | `Form()` | login form |
| File | `UploadFile` / `File()` | uploads |

### HTTP status guide
| Situation | Status |
|---|---|
| Success | 200 |
| Created | 201 |
| Accepted (async work) | 202 |
| No content | 204 |
| Bad request | 400 |
| Not authenticated | 401 |
| Forbidden | 403 |
| Not found | 404 |
| Conflict | 409 |
| Validation error | 422 |
| Too many requests | 429 |
| Server error | 500 |
| Unavailable | 503 |

### Sync vs async endpoint
| Code | Use `def` | Use `async def` |
|---|---|---|
| Sync DB driver / `requests` | Yes | No |
| Async DB driver / `httpx` / Redis asyncio | No | Yes |
| CPU-heavy | Offload to processes | Offload to processes |
| Quick pure functions | Either | Either |

### Pydantic v1 vs v2 names
| Task | v2 |
|---|---|
| To dict | `model_dump()` |
| To JSON | `model_dump_json()` |
| From dict | `model_validate()` |
| Field validator | `@field_validator` |
| Model validator | `@model_validator` |
| Config | `model_config = ConfigDict(...)` |
| ORM mode | `from_attributes=True` |
| Settings | `pydantic-settings` |

### Deployment options
| Option | Notes |
|---|---|
| Uvicorn (single) | Simple; one process per container |
| Gunicorn + UvicornWorker | Process supervision on VMs |
| Kubernetes | Scale pods; readiness/liveness probes |
| AWS Lambda (Mangum) | Serverless; cold starts, connection management |
| Cloud Run / ECS / Fly.io | Managed containers |


---

# 🔮 Part 14: Output & Prediction Questions

### O1. Route order
```python
@app.get("/users/{user_id}")
def by_id(user_id: int): return {"id": user_id}
@app.get("/users/me")
def me(): return {"me": True}
```
**`GET /users/me`:** `422` validation error (`me` is not an int). Declare `/users/me` first.

### O2. Optional vs required in Pydantic v2
```python
class M(BaseModel):
    a: int | None
    b: int | None = None
M(b=1)
```
**Result:** `ValidationError` for `a` (required, may be `None`). `M(a=None)` works.

### O3. Query param types
```python
@app.get("/items")
def items(limit: int = 10): return {"limit": limit}
# GET /items?limit=abc
```
**Result:** `422` with `type: int_parsing` for `query.limit`.

### O4. Response model filtering
```python
class In(BaseModel): name: str; password: str
class Out(BaseModel): name: str
@app.post("/u", response_model=Out)
def f(u: In): return u
```
**Result:** Response contains only `{"name": ...}`; `password` is dropped.

### O5. Dependency caching
```python
calls = 0
def dep():
    global calls; calls += 1; return calls
@app.get("/x")
def x(a: int = Depends(dep), b: int = Depends(dep)): return [a, b]
```
**Output:** `[1, 1]` for the first request. The dependency runs once per request (cached).

### O6. `use_cache=False`
```python
def x(a: int = Depends(dep), b: int = Depends(dep, use_cache=False)): return [a, b]
```
**Output:** `[1, 2]` for the first request.

### O7. `exclude_unset`
```python
class P(BaseModel): name: str | None = None; age: int | None = None
P(name="Ritesh Kumar").model_dump(exclude_unset=True)
```
**Output:** `{'name': 'Ritesh Kumar'}`.

### O8. Coercion
```python
class M(BaseModel): n: int
M(n="5").n
```
**Output:** `5` (lax mode coerces). With `strict=True` it raises.

### O9. Mutable state across workers
```python
counter = 0
@app.get("/hit")
def hit():
    global counter; counter += 1; return counter
```
**Result:** With 4 workers each process has its own counter; users see values that jump around and are not thread-safe.

### O10. Blocking in async
```python
@app.get("/slow")
async def slow(): time.sleep(5); return "ok"
@app.get("/fast")
async def fast(): return "ok"
```
**Result:** While `/slow` runs, `/fast` also waits (the event loop is blocked). With `def slow()` it would run in a thread and `/fast` stays responsive.

### O11. Status code on `HTTPException`
```python
raise HTTPException(status_code=404, detail="x")
```
**Response:** `404` with body `{"detail": "x"}`.

### O12. Lifespan order
```python
@asynccontextmanager
async def lifespan(app):
    print("start"); yield; print("stop")
```
**Output:** `start` when the app starts, `stop` when it shuts down.

### O13. `extra="forbid"`
```python
class M(BaseModel):
    model_config = ConfigDict(extra="forbid")
    a: int
M(a=1, b=2)
```
**Result:** `ValidationError` (`extra_forbidden`).

### O14. Router prefix
```python
router = APIRouter(prefix="/users")
@router.get("/{id}")
def get(id: int): ...
app.include_router(router, prefix="/api")
```
**Path:** `/api/users/{id}`.

---

# ✅ Part 15: MCQs

**1.** FastAPI is built on top of:
A) Flask and Marshmallow B) Starlette and Pydantic C) Django and DRF D) Tornado and attrs

**2.** Default interactive docs path?
A) `/swagger` B) `/docs` C) `/api-docs` D) `/help`

**3.** Which server runs FastAPI apps?
A) Gunicorn only B) Uvicorn (ASGI) C) Apache mod_wsgi only D) Nginx alone

**4.** A plain `def` endpoint runs:
A) On the event loop B) In a thread pool C) In a new process D) Never

**5.** Which validates request bodies?
A) `dataclasses` only B) Pydantic models C) `json` module D) Jinja2

**6.** What status code is returned for validation errors by default?
A) 400 B) 404 C) 422 D) 500

**7.** Which feature injects shared logic like DB sessions?
A) Middleware B) `Depends` C) Routers D) Mounts

**8.** How do you run code at startup and shutdown (modern way)?
A) `@app.on_event` B) `lifespan` context manager C) `atexit` D) `__init__`

**9.** Which Pydantic v2 method converts a model to a dict?
A) `.dict()` B) `.model_dump()` C) `.to_dict()` D) `.json_dict()`

**10.** How do you override a dependency in tests?
A) `app.override()` B) `app.dependency_overrides[dep] = fake` C) `monkey.dep` D) Not possible

**11.** Which is used for file uploads?
A) `File` / `UploadFile` with python-multipart B) `Body` only C) `Header` D) `Cookie`

**12.** Which prevents leaking password fields in responses?
A) `response_model` B) `status_code` C) `tags` D) `summary`

**13.** Which response class streams data?
A) `JSONResponse` B) `StreamingResponse` C) `HTMLResponse` D) `RedirectResponse`

**14.** Best way for a heavy reliable job after a request?
A) `BackgroundTasks` only B) A task queue (Celery/Arq) C) `time.sleep` D) Global thread

**15.** What does `OAuth2PasswordBearer(tokenUrl="token")` do?
A) Hashes passwords B) Extracts a bearer token from the `Authorization` header and documents the flow C) Issues tokens automatically D) Encrypts requests

**16.** Which is wrong inside `async def`?
A) `await httpx.get` (async client) B) `requests.get(url)` C) `await asyncio.sleep(1)` D) `await db.execute`

**17.** To run with auto-reload in development:
A) `uvicorn main:app --reload` B) `python main.py --debug` C) `fastapi prod` D) `gunicorn --reload` only

**18.** Where is the OpenAPI JSON served?
A) `/schema` B) `/openapi.json` C) `/swagger.json` D) `/api.json`

**19.** Pydantic v2 equivalent of `orm_mode = True`:
A) `from_attributes=True` B) `orm=True` C) `attributes=True` D) `read_orm=True`

**20.** What does `Annotated[int, Path(ge=1)]` do?
A) Casts to string B) Adds a validation constraint to the path parameter C) Makes it optional D) Marks it deprecated

**21.** Multiple Uvicorn workers share memory?
A) Yes B) No, each process has separate memory C) Only on Windows D) Only with Redis

**22.** Which middleware handles cross-origin requests?
A) `GZipMiddleware` B) `CORSMiddleware` C) `TrustedHostMiddleware` D) `HTTPSRedirectMiddleware`

**23.** Which header should a 401 response include for bearer auth?
A) `Retry-After` B) `WWW-Authenticate: Bearer` C) `Location` D) `ETag`

**24.** How do you partially update a model with only sent fields?
A) `model_dump()` B) `model_dump(exclude_unset=True)` C) `copy()` D) `json()`

**25.** Which tool performs DB migrations with SQLAlchemy?
A) Alembic B) pytest C) uvicorn D) Celery

**26.** What is the safest way to store passwords?
A) MD5 B) SHA-256 C) Argon2/bcrypt D) Base64

**27.** Which setting makes Uvicorn trust proxy headers?
A) `--proxy-headers` B) `--debug` C) `--ssl` D) `--workers`

**28.** Why create one `httpx.AsyncClient` in lifespan?
A) To reuse connections and reduce overhead B) It is required by FastAPI C) To avoid timeouts D) To disable TLS

**29.** Which returns a 201 on creation?
A) `@app.post("/x", status_code=201)` B) `@app.post("/x", code=201)` C) `@app.created` D) `return 201`

**30.** What is `Depends` caching scope?
A) Global forever B) Per request C) Per user session D) None

### Answer key
1-B, 2-B, 3-B, 4-B, 5-B, 6-C, 7-B, 8-B, 9-B, 10-B, 11-A, 12-A, 13-B, 14-B, 15-B, 16-B, 17-A, 18-B, 19-A, 20-B, 21-B, 22-B, 23-B, 24-B, 25-A, 26-C, 27-A, 28-A, 29-A, 30-B

---

# ⚠️ Part 16: Common Mistakes

> Each mistake has four parts: ❌ wrong code, 🤔 why it is a problem, ✅ correct code, 💬 what to say in an interview.

### Mistake 1: Blocking calls inside `async def`
❌
```python
@app.get("/data")
async def data():
    r = requests.get("https://api.example.com")     # blocks the loop
    return r.json()
```
🤔 While this waits, the whole server cannot handle other requests.
✅
```python
@app.get("/data")
async def data(client: HttpDep):
    r = await client.get("https://api.example.com")
    return r.json()
```
💬 "In async endpoints I only use async libraries; blocking code goes in `def` endpoints or a thread pool."

### Mistake 2: Returning ORM models or dicts without a `response_model`
❌
```python
@app.get("/users/{id}")
def get(id: int, db: DbDep):
    return db.get(User, id)           # includes password_hash
```
🤔 It leaks internal fields and ties the API to the database schema.
✅
```python
@app.get("/users/{id}", response_model=UserRead)
def get(id: int, db: DbDep): ...
```
💬 "Separate input, output and DB models; always declare a response model."

### Mistake 3: Creating DB sessions or HTTP clients per call without cleanup
❌
```python
@app.get("/x")
def x():
    db = SessionLocal()
    return db.query(User).all()       # never closed
```
🤔 Connections leak and the pool is exhausted under load.
✅
```python
def get_db():
    with SessionLocal() as db:
        yield db
```
💬 "Dependencies with `yield` guarantee cleanup."

### Mistake 4: Using `BackgroundTasks` for critical jobs
❌
```python
tasks.add_task(charge_customer, order_id)
```
🤔 A crash or restart loses the task; there are no retries.
✅
```python
await queue.enqueue("charge_customer", order_id)       # Celery/Arq with retries
```
💬 "Background tasks are for small best-effort work; reliable work belongs in a queue."

### Mistake 5: Plain-text passwords or fast hashes
❌
```python
user.password = body.password
```
🤔 A database leak exposes every password.
✅
```python
user.password_hash = ph.hash(body.password)
```
💬 "Argon2 or bcrypt, never plain or fast hashes."

### Mistake 6: Not pinning JWT algorithms
❌
```python
jwt.decode(token, SECRET)
```
🤔 Algorithm confusion attacks and ambiguous behavior.
✅
```python
jwt.decode(token, SECRET, algorithms=["HS256"])
```
💬 "I always specify allowed algorithms and validate `exp`, `iss`, `aud`."

### Mistake 7: One shared model for create, update and read
❌
```python
class User(BaseModel):
    id: int | None = None
    email: str
    password: str
```
🤔 Clients can set `id` or see `password`.
✅
```python
class UserCreate(BaseModel): email: EmailStr; password: str
class UserRead(BaseModel): id: int; email: EmailStr
```
💬 "Different schemas for different purposes."

### Mistake 8: In-memory state with multiple workers
❌
```python
sessions = {}
```
🤔 Each worker has its own copy; users get random results.
✅
```python
await redis.set(f"session:{token}", data, ex=3600)
```
💬 "Shared state lives in Redis or the database."

### Mistake 9: No timeouts on external calls
❌
```python
await client.get(url)       # default timeouts may be too generous or missing in other clients
```
🤔 Slow dependencies pile up requests.
✅
```python
client = httpx.AsyncClient(timeout=httpx.Timeout(5.0, connect=2.0))
```
💬 "Every outbound call has explicit timeouts and a retry policy."

### Mistake 10: Running migrations or `create_all` on every startup in production
❌
```python
Base.metadata.create_all(engine)       # in main.py for all replicas
```
🤔 Race conditions between replicas and no migration history.
✅
```bash
alembic upgrade head       # as a deploy step
```
💬 "Schema changes go through versioned migrations, run once per deploy."

### Mistake 11: Catching everything and hiding errors
❌
```python
try: ...
except Exception: return {"ok": False}
```
🤔 Failures become invisible and clients get 200.
✅
```python
except SomeKnownError as e:
    raise HTTPException(409, str(e)) from e
```
💬 "Handle known errors explicitly, let unknown ones reach the global handler and logs."

### Mistake 12: `allow_origins=["*"]` with credentials, or docs exposed publicly by accident
❌
```python
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True)
```
🤔 Insecure and rejected by browsers.
✅
```python
app.add_middleware(CORSMiddleware, allow_origins=["https://app.example.com"], allow_credentials=True)
```
💬 "I allow-list exact origins."

### Mistake 13: Loading ML models inside the request handler
❌
```python
@app.post("/predict")
def predict(x: Features):
    model = joblib.load("model.pkl")
```
🤔 Every request pays the load cost and uses extra memory.
✅
```python
# in lifespan: app.state.model = joblib.load("model.pkl")
```
💬 "Load heavy resources once at startup."

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

### Signal table 1: Answer quality
| Topic | Weak answer | Strong answer |
|---|---|---|
| "Why FastAPI?" | "It is fast." | "Type-driven validation and docs from one source of truth, async support, dependency injection, and Pydantic v2 performance; trade-offs: you assemble ORM/admin/auth yourself." |
| "async vs def?" | "Async is faster." | "`async def` runs on the loop and must not block; `def` runs in a thread pool; I choose by library support and workload and offload CPU work." |
| "How do you test?" | "With TestClient." | "Unit tests for services, integration tests with a real DB, dependency overrides for auth/external services, and negative-path coverage; contract tests from OpenAPI." |
| "How do you secure it?" | "Use JWT." | "Schemas with `extra=forbid`, response models, hashed passwords, pinned JWT algorithms, short tokens, authorization in services, rate limits, secrets in a manager." |
| "How do you scale?" | "More workers." | "Stateless pods, shared Redis, DB pool sizing, queues for heavy work, timeouts, caching, and metrics like loop lag and pool wait." |

### Signal table 2: Behaviors that stand out
| Weak behavior | Strong behavior |
|---|---|
| Puts logic in route functions | Thin routers, service and repository layers |
| Ignores DB pool math | Calculates workers × pool size against DB limits |
| Reuses one model everywhere | Separate create/update/read schemas |
| Adds features blindly | Knows the sync/async cost of each library |
| Tests only success | Tests auth, validation and failures |

### Signal table 3: Phrases that show depth
- "Dependencies are cached per request and overridable in tests."
- "Lifespan owns long-lived resources; dependencies only hand them out."
- "Blocking the loop is the most common FastAPI production bug."
- "Pydantic v2 distinguishes required-nullable from optional."
- "Reliable work goes to a queue with idempotent, retryable tasks."
- "I size the DB pool across all workers and pods."

### Signal table 4: Questions to ask the interviewer
- Is the stack async end to end or mixed?
- How are migrations, background jobs and secrets handled?
- What are your SLOs and observability tools?
- How do you version and document APIs?

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### 1. The 30-second explanation
FastAPI is an ASGI framework on Starlette that uses Python type hints and Pydantic to validate requests, serialize responses and generate OpenAPI docs automatically. It has built-in dependency injection, supports async and sync endpoints, and is a strong choice for APIs and ML services.

### 2. Skeleton to memorize
```python
@asynccontextmanager
async def lifespan(app): ...      # create engine/clients/models; yield; cleanup
app = FastAPI(lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=[...])
app.include_router(users.router, prefix="/api/v1")
# router: response_model, status_code, Depends(auth), Annotated types
```

### 3. Request lifecycle
```
Client → proxy → Uvicorn → middleware → router → dependencies (auth, db)
 → validation (path/query/body) → endpoint → response_model → JSON → client
```

### 4. Production checklist
- [ ] Settings via pydantic-settings; secrets from a manager
- [ ] Input and output schemas, `extra="forbid"` where useful
- [ ] Auth dependency on every protected route; authorization in services
- [ ] Async/sync used correctly; no blocking in `async def`
- [ ] DB pool sized across workers; PgBouncer if needed
- [ ] Timeouts, retries, circuit breakers on outbound calls
- [ ] Alembic migrations as a deploy step
- [ ] Structured logs, request IDs, metrics, tracing
- [ ] Health/readiness endpoints; graceful shutdown
- [ ] Rate limits and CORS allow-list
- [ ] Tests: unit, integration, contract; CI with ruff, mypy, security scans
- [ ] Slim non-root Docker image; `--proxy-headers` behind proxies

### 5. Top 15 one-liners
1. Type hints drive validation, docs and editor support.
2. `response_model` protects your output.
3. `Depends` is cached per request and overridable.
4. `lifespan` replaces startup/shutdown events.
5. `def` → thread pool; `async def` → event loop.
6. Never block the loop.
7. 422 is a validation error.
8. Declare `/users/me` before `/users/{id}`.
9. `exclude_unset=True` for PATCH.
10. BackgroundTasks are best-effort; use queues for reliability.
11. Multiple workers do not share memory.
12. Argon2/bcrypt for passwords; pin JWT algorithms.
13. Reuse one HTTP client and one engine.
14. Alembic migrations, not `create_all`, in production.
15. Measure p95 and loop lag before tuning.

### 6. The 60-second answer: "Why FastAPI?"
"FastAPI gives me type-safe request validation, automatic OpenAPI docs, async support and a clean dependency injection system with very little boilerplate. It's ideal for APIs and ML-serving backends. I pair it with SQLAlchemy 2.0, Alembic, Redis and a task queue, and I'm careful about the sync/async boundary, timeouts, and observability in production."

### 7. Final revision order
Routing and validation → Pydantic models → dependency injection → auth and security → database and transactions → sync/async concurrency → testing → deployment and observability → debugging stories.

