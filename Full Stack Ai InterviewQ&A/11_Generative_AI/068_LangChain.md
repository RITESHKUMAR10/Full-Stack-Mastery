# LangChain Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets the **LangChain 1.x ecosystem (late 2025 – 2026)**: `langchain` (high-level agent APIs such as `create_agent`, `init_chat_model`), `langchain-core` (Runnables, LCEL, messages, prompts, tools, output parsers), **`langgraph`** (stateful graphs, checkpointers, human-in-the-loop, streaming), provider packages (`langchain-openai`, `langchain-anthropic`, `langchain-google-genai`, `langchain-community`, …), `langchain-text-splitters`, vector-store integrations (`langchain-postgres`, `langchain-qdrant`, `langchain-chroma`, …), and **LangSmith** (tracing, datasets, evaluation, prompt hub). **The LangChain ecosystem changes very fast**: legacy chains (`LLMChain`, `ConversationChain`, `initialize_agent`, `AgentExecutor`, old `ConversationBufferMemory`) were deprecated and moved to `langchain-classic` (verify), import paths have been reorganised, and the recommended way to build agents is now `create_agent` / LangGraph. Anything marked "verify" must be checked in the current docs (python.langchain.com, langchain-ai.github.io/langgraph, docs.smith.langchain.com). Concepts (prompts, models, parsers, tools, retrievers, state machines, tracing, evaluation) are stable even when function names move. Claude sampling parameters such as `temperature` are rejected by current Claude models, so Anthropic examples omit them (see `065_OpenAI-and-Claude-API.md`). Examples use the sample name **Ritesh Kumar** and small support / documents / e-commerce style apps.
> This file covers why LangChain exists and when *not* to use it, packages and architecture, chat models and messages, prompt templates, output parsers and structured output, the Runnable interface and LCEL (`|`, `RunnableParallel`, `RunnableLambda`, `RunnablePassthrough`, branching, retries / fallbacks, batching, streaming, async), document loaders, text splitters, embeddings, vector stores and retrievers, RAG chains (basic, conversational, multi-query, parent-document, self-query, hybrid, re-ranking), tools and tool calling, agents (`create_agent`, ReAct, middleware, structured outputs), LangGraph (state, nodes, edges, conditional routing, reducers, persistence / checkpointers, memory, interrupts / human-in-the-loop, subgraphs, multi-agent patterns, streaming, durable execution), memory and chat history, caching, callbacks and tracing with LangSmith, evaluation, MCP integration, deployment (LangServe → LangGraph Platform / FastAPI), testing, security, performance / cost, migration from legacy APIs, and design decisions. Related topics: generative AI overview in `063_Generative-AI.md`, prompt engineering in `064_Prompt-Engineering.md`, LLM APIs in `065_OpenAI-and-Claude-API.md`, LLMs and RAG in `066_LLM-and-RAG.md`, vector databases in `067_Vector-Databases.md`, AI agents in `069_AI-Agents.md`, evaluation and guardrails in `072_LLM-Evaluation-and-Guardrails.md`, serving in `073_Model-Serving-and-Inference.md`, Python in `../03_Backend/014_Python.md`, FastAPI in `../03_Backend/015_FastAPI.md`, Hugging Face in `../10_AI_and_ML/062_Hugging-Face.md`.

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
- [Part 12: Internals](#-part-12-internals)
- [Part 13: Reference Tables](#-part-13-reference-tables)
- [Part 14: Output & Prediction Questions](#-part-14-output--prediction-questions)
- [Part 15: MCQs](#-part-15-mcqs)
- [Part 16: Common Mistakes](#-part-16-common-mistakes)
- [Part 17: Signals of an Experienced Developer](#-part-17-signals-that-show-you-are-really-experienced)
- [Part 18: Cheat Sheet & Last-Minute Revision](#-part-18-cheat-sheet--last-minute-revision)

---

# 🟢 Part 1: Fresher (0–1 year)

### Q1. What is LangChain? *(Must-know)*
An open-source framework (Python and JavaScript / TypeScript) for building LLM applications. It provides **standard interfaces** for chat models, embeddings, vector stores, tools and retrievers; composable building blocks (prompts, parsers, runnables); agent abstractions; and companion projects: **LangGraph** (stateful, controllable agent / workflow graphs) and **LangSmith** (observability, evaluation, prompt management).

### Q2. Why use LangChain? (and why sometimes not)
Use it for: swapping model providers behind one interface, ready-made integrations (hundreds of loaders, vector stores, tools), standard patterns (RAG, tool-calling agents), streaming / async / batch for free on runnables, and tracing with LangSmith. Skip it when: the app is a single API call or a simple loop (the raw SDK is clearer), you need minimal dependencies, or abstractions get in the way of provider-specific features. Many teams use **LangGraph + provider SDKs** for control.

### Q3. The ecosystem at a glance *(Must-know)*
| Piece | Role |
|---|---|
| `langchain-core` | Base abstractions: Runnable, messages, prompts, tools, parsers |
| `langchain` | Higher-level APIs (`create_agent`, `init_chat_model`), chains / agent helpers |
| `langchain-<provider>` | Model / embedding integrations (OpenAI, Anthropic, Google, …) |
| `langchain-community` | Community integrations |
| `langchain-text-splitters` | Text chunking utilities |
| `langgraph` | Graph-based orchestration with state, persistence, human-in-the-loop |
| LangSmith | Tracing, datasets, evaluations, prompt hub, deployment (verify) |

### Q4. Installing and first call
```bash
pip install langchain langchain-anthropic langchain-openai
export ANTHROPIC_API_KEY=...   # or OPENAI_API_KEY
```
```python
from langchain.chat_models import init_chat_model
model = init_chat_model("claude-sonnet-5-5", model_provider="anthropic")   # verify exact signature
print(model.invoke("Say hello in Hindi.").content)
```
Or directly: `from langchain_anthropic import ChatAnthropic; ChatAnthropic(model="claude-sonnet-5-5", max_tokens=2048)`.

### Q5. Chat models vs LLMs
**Chat models** take a list of messages and return a message (`AIMessage`); modern APIs are chat-based. Legacy "LLM" classes took a string and returned a string. Prefer chat models everywhere.

### Q6. Message types
`SystemMessage`, `HumanMessage`, `AIMessage` (may contain `tool_calls`), `ToolMessage` (tool result), and `RemoveMessage` / `trim_messages` helpers. Dict form also works: `{"role": "user", "content": "..."}`.
```python
from langchain_core.messages import SystemMessage, HumanMessage
model.invoke([SystemMessage("You are concise."), HumanMessage("Explain RAG in one line.")])
```

### Q7. `invoke`, `stream`, `batch` (the Runnable interface) *(Must-know)*
Every Runnable supports `.invoke(input)`, `.stream(input)`, `.batch([inputs])`, and async twins (`ainvoke`, `astream`, `abatch`), plus `astream_events` for fine-grained events. Composition preserves these capabilities automatically.

### Q8. Prompt templates
Parameterised prompts.
```python
from langchain_core.prompts import ChatPromptTemplate
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a support assistant for {company}."),
    ("human", "{question}"),
])
messages = prompt.invoke({"company": "Acme", "question": "How do I reset my password?"})
```

### Q9. LCEL: the pipe operator *(Must-know)*
**LangChain Expression Language** composes runnables with `|`:
```python
from langchain_core.output_parsers import StrOutputParser
chain = prompt | model | StrOutputParser()
print(chain.invoke({"company": "Acme", "question": "Where is my order?"}))
for chunk in chain.stream({"company": "Acme", "question": "Explain refunds"}):
    print(chunk, end="")
```
The resulting chain is itself a Runnable with invoke / stream / batch / async.

### Q10. Output parsers
Convert model output: `StrOutputParser`, `JsonOutputParser`, `PydanticOutputParser`, `CommaSeparatedListOutputParser`. For structured data prefer **`with_structured_output`** (below), which uses native tool / schema features.

### Q11. Structured output *(Must-know)*
```python
from pydantic import BaseModel, Field
class Ticket(BaseModel):
    category: str = Field(description="billing | delivery | technical | other")
    urgency: int = Field(ge=1, le=5)
    summary: str

structured = model.with_structured_output(Ticket)
result = structured.invoke("Customer says card charged twice, wants refund today!")
print(result.category, result.urgency)
```
Returns a validated Pydantic object (or dict with a JSON schema).

### Q12. Tools in LangChain
Functions the model can call. Define with `@tool`; the docstring and type hints become the schema.
```python
from langchain_core.tools import tool

@tool
def get_order_status(order_id: str) -> str:
    """Look up the status of one order by its id (format A####)."""
    return f"Order {order_id}: SHIPPED"

model_with_tools = model.bind_tools([get_order_status])
ai = model_with_tools.invoke("Where is order A1042?")
print(ai.tool_calls)       # [{'name': 'get_order_status', 'args': {'order_id': 'A1042'}, 'id': '...'}]
```

### Q13. Agents (high-level)
An agent runs a loop: model decides → calls tools → observes results → repeats until it answers. In current LangChain use **`create_agent`** (built on LangGraph):
```python
from langchain.agents import create_agent
agent = create_agent(model="claude-sonnet-5-5", tools=[get_order_status],
                     system_prompt="You are a helpful support agent.")      # verify signature
out = agent.invoke({"messages": [{"role": "user", "content": "Where is order A1042?"}]})
print(out["messages"][-1].content)
```
Older `initialize_agent` / `AgentExecutor` are legacy.

### Q14. What is RAG in LangChain terms?
Load documents → split → embed → store in a vector store → retriever → prompt + LLM. LangChain supplies each component with swappable implementations.

### Q15. Document loaders
Load data into `Document(page_content, metadata)` objects: `PyPDFLoader`, `WebBaseLoader`, `TextLoader`, `CSVLoader`, `UnstructuredLoader`, `DirectoryLoader`, plus cloud / SaaS loaders (Notion, Slack, Google Drive…).
```python
from langchain_community.document_loaders import PyPDFLoader
docs = PyPDFLoader("policy.pdf").load()
```

### Q16. Text splitters
`RecursiveCharacterTextSplitter` (default choice), `MarkdownHeaderTextSplitter`, `TokenTextSplitter`, `HTMLHeaderTextSplitter`, code splitters, semantic chunkers.
```python
from langchain_text_splitters import RecursiveCharacterTextSplitter
splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)
chunks = splitter.split_documents(docs)
```
Sizes are in characters by default (use `from_tiktoken_encoder` for tokens).

### Q17. Embeddings & vector stores
```python
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
emb = OpenAIEmbeddings(model="text-embedding-3-small")
vs = Chroma.from_documents(chunks, emb, persist_directory="./chroma")
retriever = vs.as_retriever(search_kwargs={"k": 4})
docs = retriever.invoke("How long do refunds take?")
```
Other stores: FAISS, PGVector (`langchain-postgres`), Qdrant, Pinecone, Weaviate, Milvus, OpenSearch, MongoDB Atlas.

### Q18. A minimal RAG chain
```python
from langchain_core.runnables import RunnablePassthrough
rag_prompt = ChatPromptTemplate.from_template(
    "Answer ONLY from the context. Cite nothing else. If unknown, say you don't know.\n\n"
    "Context:\n{context}\n\nQuestion: {question}")
def fmt(docs): return "\n\n".join(d.page_content for d in docs)

rag = ({"context": retriever | fmt, "question": RunnablePassthrough()} | rag_prompt | model | StrOutputParser())
print(rag.invoke("How long do refunds take?"))
```

### Q19. Chat history / memory (concept)
Models are stateless, so apps pass history. Legacy `ConversationBufferMemory` classes are deprecated; modern approaches use **LangGraph checkpointers** (persisted state per thread), message trimming / summarisation, and external stores.

### Q20. LangSmith (intro)
Hosted (or self-hosted) platform for tracing each run (prompts, inputs / outputs, latency, tokens, cost), building datasets, running evaluations, comparing prompts / models, and monitoring. Enable with environment variables (`LANGSMITH_TRACING=true`, `LANGSMITH_API_KEY`, `LANGSMITH_PROJECT`; verify names).

### Q21. LangGraph (intro) *(Must-know)*
A library for building **stateful, controllable** agent and workflow graphs: nodes (functions), edges (control flow), shared **state**, conditional routing, loops, persistence (checkpointers), human-in-the-loop interrupts and streaming. LangChain's agents run on it. Use when you need explicit control, retries, branches or long-running state.

### Q22. Minimal LangGraph
```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END

class State(TypedDict):
    question: str
    answer: str

def answer_node(state: State):
    return {"answer": model.invoke(state["question"]).content}

g = StateGraph(State)
g.add_node("answer", answer_node)
g.add_edge(START, "answer"); g.add_edge("answer", END)
app = g.compile()
print(app.invoke({"question": "What is LangGraph?"})["answer"])
```

### Q23. Callbacks
Hooks for events (LLM start / end, tool start, errors, tokens): used for logging, tracing and streaming. Pass via `config={"callbacks": [...]}`.

### Q24. Runnable config
`chain.invoke(input, config={"tags": [...], "metadata": {...}, "callbacks": [...], "max_concurrency": 5, "configurable": {...}})` flows through the whole chain.

### Q25. Batch & concurrency
`chain.batch(inputs, config={"max_concurrency": 8})` parallelises calls with a cap; `abatch` for async.

### Q26. Streaming
`chain.stream(...)` yields output chunks; `astream_events` yields typed events (model tokens, tool calls, retriever results) useful for UIs. LangGraph streams node updates, messages and custom events (`stream_mode="updates" | "messages" | "values" | "custom"`).

### Q27. Caching
`set_llm_cache(InMemoryCache())` / SQLite / Redis caches identical LLM calls (exact-match). Useful in development and for deterministic tasks; be careful with personalised or sensitive prompts.

### Q28. Environment management
Never hard-code keys; use `.env` + `python-dotenv` or a secret manager. Provider packages read `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` automatically.

### Q29. LangChain vs LlamaIndex vs raw SDK
LangChain: broad integrations, agents, LangGraph; LlamaIndex: data / indexing / retrieval focus with strong ingestion tooling; raw SDK: simplest, no abstraction overhead, direct access to provider features. They can be combined.

### Q30. Typical project structure
`app/{prompts,chains,tools,retrievers,graphs}/`, config module (models, keys), `tests/`, evaluation datasets, and a service layer (FastAPI) exposing endpoints with streaming.

---

# 🔵 Part 2: Junior (1–3 years)

### Q31. Runnable building blocks *(Must-know)*
- `RunnableLambda(fn)`: wrap any function.
- `RunnablePassthrough()`: pass input through (with `.assign(...)` to add keys).
- `RunnableParallel({...})` (or a dict): run branches concurrently, output a dict.
- `RunnableBranch` / conditional routing via a function returning a runnable.
- `.with_retry()`, `.with_fallbacks([...])`, `.with_config(...)`, `.bind(...)`.

### Q32. Example: parallel + passthrough
```python
from langchain_core.runnables import RunnableParallel, RunnablePassthrough, RunnableLambda
chain = (RunnableParallel(question=RunnablePassthrough(), context=retriever | fmt)
         | rag_prompt | model | StrOutputParser())
```

### Q33. `RunnablePassthrough.assign`
```python
chain = RunnablePassthrough.assign(context=lambda x: fmt(retriever.invoke(x["question"]))) | rag_prompt | model
```
Adds computed keys while preserving the original input.

### Q34. Retries and fallbacks
```python
robust = primary_model.with_retry(stop_after_attempt=3).with_fallbacks([backup_model])
```
`with_retry` handles transient errors; `with_fallbacks` tries alternatives (e.g., a different provider) if the primary fails. Be explicit about which exceptions trigger them.

### Q35. Routing between chains
Classify the input then dispatch:
```python
def route(info):
    return billing_chain if "billing" in info["topic"].lower() else general_chain
full = {"topic": classify_chain, "question": lambda x: x["question"]} | RunnableLambda(route)
```

### Q36. Prompt composition & partials
`prompt.partial(company="Acme")`, `MessagesPlaceholder("history")` for chat history, `FewShotChatMessagePromptTemplate` for examples, `ChatPromptTemplate.from_template`. Keep prompts in files / a registry.
```python
from langchain_core.prompts import MessagesPlaceholder
prompt = ChatPromptTemplate.from_messages([("system", "You are helpful."), MessagesPlaceholder("history"), ("human", "{input}")])
```

### Q37. Trimming and summarising history
`trim_messages(messages, max_tokens=..., token_counter=model, strategy="last")` keeps recent turns within a budget. Summarise older turns into a system message to retain facts cheaply.

### Q38. Conversational RAG (history-aware retrieval)
Rewrite the latest question into a standalone query using history, then retrieve and answer.
```python
rewrite = ChatPromptTemplate.from_messages([
    ("system", "Rewrite the last user message as a standalone search query. Return only the query."),
    MessagesPlaceholder("history"), ("human", "{input}")]) | model | StrOutputParser()
```

### Q39. Retriever types
Vector-store retriever (similarity / MMR / score-threshold), `MultiQueryRetriever` (LLM generates paraphrases), `ContextualCompressionRetriever` (compress / filter retrieved docs), `ParentDocumentRetriever` (index small, return large), `SelfQueryRetriever` (LLM builds metadata filters), `EnsembleRetriever` (BM25 + vector with RRF), `BM25Retriever`.

### Q40. Ensemble (hybrid) retriever
```python
from langchain.retrievers import EnsembleRetriever
from langchain_community.retrievers import BM25Retriever
bm25 = BM25Retriever.from_documents(chunks); bm25.k = 5
hybrid = EnsembleRetriever(retrievers=[bm25, retriever], weights=[0.4, 0.6])   # verify import path
```

### Q41. Re-ranking in LangChain
Wrap a cross-encoder / Cohere rerank / FlashRank in `ContextualCompressionRetriever` so the base retriever returns many candidates and the compressor keeps the top few.

### Q42. Citations with sources
Keep `metadata` (source, page) on chunks; format context with source IDs; ask the model to cite; return `source_documents` alongside the answer. Provider-native citation features can be used via the model integrations (verify).

### Q43. Tool calling loop (manual)
```python
from langchain_core.messages import ToolMessage
tools = {"get_order_status": get_order_status}
msgs = [("human", "Where is order A1042?")]
ai = model_with_tools.invoke(msgs)
msgs.append(ai)
for call in ai.tool_calls:
    result = tools[call["name"]].invoke(call["args"])
    msgs.append(ToolMessage(content=str(result), tool_call_id=call["id"]))
final = model_with_tools.invoke(msgs)
```

### Q44. Tool design rules
Clear names / docstrings (they are prompts), typed args (Pydantic `args_schema` for validation), small outputs, error messages the model can act on, idempotent operations, and safe defaults. Raise `ToolException` or return error strings rather than crashing.

### Q45. `create_agent` with options
```python
agent = create_agent(
    model="claude-sonnet-5-5",
    tools=[search_docs, get_order_status],
    system_prompt="Use tools when needed. Cite sources. Ask a clarifying question if an order id is missing.",
    response_format=Ticket,                       # optional structured final output (verify)
)
```
Add checkpointers for memory and middleware for guardrails (verify current options).

### Q46. Agent memory with checkpointers
```python
from langgraph.checkpoint.memory import InMemorySaver
agent = create_agent(model="claude-sonnet-5-5", tools=[...], checkpointer=InMemorySaver())
cfg = {"configurable": {"thread_id": "user-42"}}
agent.invoke({"messages": [{"role": "user", "content": "My name is Ritesh."}]}, cfg)
agent.invoke({"messages": [{"role": "user", "content": "What's my name?"}]}, cfg)
```
Use Postgres / SQLite / Redis checkpointers in production.

### Q47. LangGraph state & reducers *(Must-know)*
State is a typed dict / Pydantic model. Each key may have a **reducer** defining how updates merge (e.g., `add_messages` appends messages instead of overwriting).
```python
from typing import Annotated
from langgraph.graph.message import add_messages
class State(TypedDict):
    messages: Annotated[list, add_messages]
    docs: list
```

### Q48. Conditional edges
```python
def route(state): return "tools" if state["messages"][-1].tool_calls else END
g.add_conditional_edges("agent", route, {"tools": "tools", END: END})
g.add_edge("tools", "agent")
```
This is the classic agent loop expressed as a graph.

### Q49. Prebuilt ToolNode
`ToolNode(tools)` executes tool calls from the last AI message and returns `ToolMessage`s. `tools_condition` is a ready-made router.

### Q50. Human-in-the-loop with interrupts
Pause the graph for approval or input, persist state, resume later.
```python
from langgraph.types import interrupt, Command
def approve(state):
    decision = interrupt({"action": state["pending"], "question": "Approve refund?"})
    return {"approved": decision == "yes"}
# resume: app.invoke(Command(resume="yes"), config)
```
Requires a checkpointer and a stable `thread_id`.

### Q51. Streaming from LangGraph
`for chunk in app.stream(inputs, cfg, stream_mode="updates")`; `"messages"` yields LLM tokens; `"values"` yields full state after each step; `"custom"` emits developer events.

### Q52. LangSmith tracing setup
```bash
export LANGSMITH_TRACING=true
export LANGSMITH_API_KEY=...
export LANGSMITH_PROJECT=support-bot
```
Every runnable / graph run is traced automatically; add `tags` and `metadata` (user, version) for filtering. Redact PII per policy.

### Q53. LangSmith datasets & evaluation (intro)
Create datasets from traces or files; define evaluators (exact match, LLM-as-judge, custom Python); run `evaluate(app, data=dataset, evaluators=[...])`; compare experiments across prompts / models. See `072_LLM-Evaluation-and-Guardrails.md`.

### Q54. Prompt hub and versioning
Store prompts in a registry (LangSmith Prompt Hub or your repo), pin versions, review changes, and link to evaluation results. Avoid editing prompts in production without tests.

### Q55. FastAPI integration
```python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
app = FastAPI()
@app.post("/chat")
async def chat(body: dict):
    async def gen():
        async for chunk in chain.astream({"question": body["q"]}):
            yield f"data: {chunk}\n\n"
    return StreamingResponse(gen(), media_type="text/event-stream")
```
LangServe is in maintenance / superseded by LangGraph Platform and plain FastAPI (verify).

### Q56. Async best practices
Use `ainvoke` / `astream` in async servers; avoid blocking calls in `RunnableLambda` (use async functions); cap concurrency; propagate cancellation when clients disconnect.

### Q57. Error handling
Catch provider exceptions (rate limits, auth), use `with_retry` (exponential backoff), validate tool inputs, set timeouts and max iterations, and surface friendly errors. In LangGraph add retry policies per node (verify).

### Q58. Testing basics
Unit-test tools and parsers; use fake / stub chat models (`FakeListChatModel`, `GenericFakeChatModel`) for deterministic tests; test graph routing with canned states; run a small live evaluation set in CI with budgets.

### Q59. Token counting & cost
Use callbacks / `usage_metadata` on `AIMessage` (input / output tokens), LangSmith cost tracking, and provider counting endpoints (`count_tokens` for Claude). Log per feature.

### Q60. Common packages for RAG apps
`langchain-text-splitters`, `langchain-community` (loaders), a provider embeddings package, a vector-store package, `rank_bm25`, a re-ranker (`sentence-transformers`, Cohere), and `langsmith`.

---

# 🟡 Part 3: Mid (3–5 years)

### Q61. LCEL internals *(Must-know)*
`a | b` creates a `RunnableSequence`; dicts become `RunnableParallel`; each Runnable implements `invoke` and default implementations of `batch` / `stream` / async derived from it. Streaming works when every step supports transforming iterators (`transform`); a non-streaming step (e.g., a function expecting full input) buffers and breaks token streaming. Config (callbacks, tags) propagates automatically through child runs.

### Q62. When to use LCEL vs LangGraph vs plain Python
LCEL: linear / lightly branched pipelines (prompt → model → parser, simple RAG). LangGraph: cycles, branching, persistent state, human-in-the-loop, multi-actor workflows, long-running tasks. Plain Python: when you want clarity and full control. Don't force everything into LCEL.

### Q63. Designing state for LangGraph
Keep state minimal and typed; separate **messages**, **working data**, **control flags** and **outputs**; use reducers for lists; avoid putting large blobs (documents) in state if checkpointing every step (store IDs / references); define input / output schemas to limit what's exposed.

### Q64. Checkpointers & durable execution *(Must-know)*
A checkpointer saves state after each super-step per `thread_id`, enabling memory across turns, resuming after failures, time travel (`get_state_history`), forking, and human-in-the-loop. Production: `PostgresSaver` / `AsyncPostgresSaver`, Redis, SQLite for dev. Plan migrations when state schema changes (verify).

### Q65. Store (long-term memory) vs checkpoint (thread memory)
Checkpointer = per-thread conversation state. **Store** (`InMemoryStore`, Postgres store) = cross-thread memory (user preferences, facts) with namespaces and optional semantic search. Use both.

### Q66. Subgraphs and modularity
Compose graphs as nodes inside larger graphs (e.g., a "research" subgraph, a "writer" subgraph) with their own state schemas and mapping functions. Improves reuse, testing and ownership.

### Q67. Multi-agent patterns
- **Supervisor**: a router agent delegates to specialised agents and aggregates.
- **Swarm / handoffs**: agents transfer control directly via handoff tools.
- **Hierarchical teams**: supervisors of supervisors.
- **Parallel workers** (map-reduce with `Send`).
Prefer the simplest design that meets evaluation targets; multi-agent adds cost and failure modes.

### Q68. Map-reduce with `Send`
```python
from langgraph.types import Send
def fan_out(state):
    return [Send("summarise_doc", {"doc": d}) for d in state["docs"]]
g.add_conditional_edges("split", fan_out, ["summarise_doc"])
```
Each `Send` runs the node with its own input in parallel; reducers combine outputs.

### Q69. Middleware for agents (v1)
Hooks around model / tool calls to add summarisation of long history, human approval for specific tools, PII redaction, dynamic model / tool selection, retries, or guardrails (verify built-in middleware names). Prefer middleware to editing agent internals.

### Q70. Dynamic tool selection
With many tools, selection quality drops and prompts grow. Options: group tools by sub-agent, retrieve relevant tools via embeddings, provider tool-search features, or routing nodes that expose only relevant tools per step.

### Q71. Handling tool errors in graphs
`ToolNode(handle_tool_errors=True)` converts exceptions into `ToolMessage` errors the model can react to. Add max-iteration guards (`recursion_limit`) to avoid infinite loops.

### Q72. Recursion limits and loop safety
Set `config={"recursion_limit": 25}`; detect repeated tool calls; budget tokens and wall-time; fail gracefully with a summary of progress. Log each step for debugging.

### Q73. Structured output strategies
`with_structured_output(Schema)` uses provider-native tool / JSON-schema modes when available; for models without them it falls back to prompting + parsing. Pass `method=` options where available (verify); keep schemas simple; validate semantic constraints post-hoc.

### Q74. Provider-specific features through LangChain
Prompt caching (Anthropic `cache_control` in content blocks), thinking / reasoning settings, server tools (web search, code execution), citations, vision, PDF inputs. Access via model kwargs or content blocks; wrappers may lag provider releases — check integration docs or call the SDK directly for new features.

### Q75. Content blocks and multimodal messages
Messages can carry typed content blocks (text, image URLs / base64, files, reasoning, tool calls). LangChain v1 standardises content blocks across providers (verify). Use them for images / PDFs and for preserving provider-specific blocks (thinking) across turns.

### Q76. Reasoning / thinking models
Pass provider parameters (e.g., Claude adaptive thinking / effort, OpenAI reasoning effort) via model constructor kwargs (verify names). Preserve reasoning blocks in message history when providers require it, and don't rewrite earlier turns, which can invalidate signed blocks.

### Q77. Document processing pipelines
Loaders → cleaners → splitters (structure-aware) → metadata enrichment (title, section, acl, version) → embeddings → vector store with upserts keyed by deterministic IDs (`RecordManager` / `index()` API for dedupe and deletion sync). Use the **indexing API** to avoid duplicates and clean stale chunks.

### Q78. Indexing API (RecordManager)
`langchain.indexes.index(docs, record_manager, vector_store, cleanup="incremental", source_id_key="source")` tracks hashes so unchanged docs aren't re-embedded and removed docs are deleted. Needs a record-manager database (SQL).

### Q79. Parent-document & multi-vector retrievers
Store small chunks (or summaries / hypothetical questions) as vectors and link them to parent documents in a docstore; return parents for context. Improves precision and completeness.

### Q80. Self-query retriever
LLM converts natural language into a structured query (semantic string + metadata filter) validated against attribute definitions; good for catalogues ("red dresses under ₹2000"). Guard against invalid filters and injection.

### Q81. RAG evaluation with LangChain tooling
Build a labelled retrieval set; measure Recall@k / MRR; evaluate answers with RAGAS / LangSmith evaluators (faithfulness, relevance, correctness); store experiments; set regression thresholds in CI. See `066_LLM-and-RAG.md`.

### Q82. Guardrails integration
Input / output moderation steps as runnables, schema validation, PII redaction middleware, allow-listed tools, human approval nodes, and post-generation groundedness checks. Libraries: Guardrails AI, NeMo Guardrails, provider moderation APIs.

### Q83. Observability patterns
Tag runs with `user_id` (hashed), `tenant`, `prompt_version`, `model`, `feature`; monitor latency / tokens / cost / error rates / feedback; sample traces for review; create datasets from failures; use OpenTelemetry export if standardising observability (verify).

### Q84. Cost control in LangChain apps
Cache static prefixes (provider prompt caching), trim history, limit retriever `k`, use cheaper models for routing / rewriting / grading, cap agent iterations, batch offline jobs, and track tokens per node.

### Q85. Performance tuning
Parallelise independent steps (`RunnableParallel`), stream early, reuse clients, avoid re-embedding, tune vector search, use async I/O, and keep LangSmith overhead low in hot paths (sampling). Profile with traces.

### Q86. MCP integration
Use `langchain-mcp-adapters` to load tools from MCP servers as LangChain tools, enabling standardised access to external systems. Treat third-party servers as untrusted; scope permissions; log calls (verify package / API).

### Q87. Deployment options
Self-host FastAPI (+ Uvicorn / Gunicorn), containers on Kubernetes / serverless, **LangGraph Platform / LangSmith Deployment** (managed runs with persistence, queues, cron, streaming; verify naming), or serverless functions for short chains. Consider cold starts, concurrency, state storage and secrets.

### Q88. Streaming UI integration
SSE / WebSockets to the frontend; emit token chunks plus structured events (tool start / end, citations); use Vercel AI SDK-compatible streams or LangGraph SDK clients; handle disconnects and retries.

### Q89. Security essentials
Treat all model / tool / retrieved text as untrusted; least-privilege tools; validate args with Pydantic; sandbox code execution; avoid `eval`; protect keys; sanitise logs; prevent SSRF in web loaders; review community integrations (they run arbitrary code); pin dependencies.

### Q90. Dependency & version management
Pin `langchain*`, `langgraph`, provider packages together (lockfile); read release notes; watch deprecation warnings; isolate integration code behind your interfaces; run upgrade tests with golden evaluation sets.

---

# 🟠 Part 4: Senior (5–7 years)

### Q91. Architecting a production LangChain / LangGraph service *(Must-know)*
API gateway (auth, rate limits) → service layer (FastAPI) → orchestration (LangGraph app with checkpointer + store) → model gateway (routing, fallbacks, caching) → retrieval services (hybrid index, ACLs) → tool layer (idempotent, scoped) → guardrails → observability (LangSmith / OpenTelemetry) → evaluation harness in CI → deployment (containers, autoscaling, secrets) → cost and quality dashboards.

### Q92. Choosing abstraction depth
Layer 1: provider SDK directly. Layer 2: `langchain-core` models / tools / prompts. Layer 3: LCEL pipelines. Layer 4: LangGraph agents / workflows. Move up only when you gain concrete benefits (swap providers, tracing, persistence). Avoid hiding critical logic inside opaque prebuilt agents without tests.

### Q93. Designing for provider portability
Write prompts / schemas that are provider-neutral, use `init_chat_model` with configuration, centralise model creation, test across providers with the same evaluation set, and isolate provider-specific features behind capability flags.

### Q94. Reliability patterns
Timeouts per call, retries with jitter, fallbacks across models / providers, circuit breakers, idempotent tools, checkpoint-based resume after crashes, dead-letter queues for failed runs, and health checks. Avoid retrying non-idempotent side effects without keys.

### Q95. Evaluating agents (trajectories)
Capture traces; score final answers (correctness, groundedness), tool-call correctness (right tool / args), step efficiency, cost / latency, safety violations, and recovery from errors. Build scenario suites (happy path, ambiguous requests, tool failures, injection attempts). Use LangSmith experiments to compare versions.

### Q96. Testing LangGraph apps
Unit-test nodes as pure functions; test routing with synthetic states; use fake models with scripted tool calls; snapshot test graph structure; integration tests with in-memory checkpointers; resume / interrupt tests; property tests for reducers.

### Q97. State schema evolution & migrations
Persisted checkpoints outlive code. Version state schemas, make new fields optional with defaults, write migration code for old threads (or let them expire), and test resuming old checkpoints after deploys.

### Q98. Concurrency and scaling
Stateless workers + external checkpoint store; queue-based execution for long runs; per-tenant concurrency limits; backpressure; avoid in-process globals; shard threads by ID; monitor queue depth and run durations. Consider LangGraph Platform for managed task queues.

### Q99. Long-running and background tasks
Use checkpoints + interrupts for human steps, cron triggers for periodic runs, webhooks / queues for async completion, status endpoints, and idempotent steps. Persist artefacts externally (object storage) and keep state small.

### Q100. Context engineering in agents
Control what the model sees each step: trimmed / summarised history, retrieved memory, tool results truncation (return summaries + IDs), dynamic system prompts per state, and removal of obsolete tool outputs. Most agent failures are context problems.

### Q101. Handling large tool outputs
Return concise structured results; paginate; store large payloads outside context and pass references; summarise via a sub-call; truncate with explicit "N more results" markers.

### Q102. Prompt caching with LangChain
Place static content (system prompt, tool definitions, long docs) first and mark cache breakpoints via provider-specific blocks; keep tool order deterministic; verify cache hit tokens from `usage_metadata`. Changing early tokens invalidates later cache.

### Q103. Migration from legacy LangChain
Replace `LLMChain` with LCEL (`prompt | model | parser`); `ConversationChain` + memory with LangGraph checkpointers or message history; `initialize_agent` / `AgentExecutor` with `create_agent` / LangGraph; `RetrievalQA` with an explicit retriever chain or agent tool; update imports to `langchain_core` / provider packages; use `langchain-classic` only as a temporary bridge (verify). Add evaluation sets before migrating.

### Q104. Anti-corruption layer
Wrap framework objects behind your own interfaces (`ChatService`, `Retriever`, `ToolRegistry`) so framework upgrades only affect adapters. Keep business logic out of chain definitions.

### Q105. Security review of agentic apps
Threat model: prompt injection via documents / web / tools, tool abuse, data exfiltration, SSRF via loaders, supply-chain risk (community integrations), cross-tenant leakage via memory / caches, denial of wallet. Controls: least privilege, approvals, allow-lists, sandboxing, per-tenant namespaces, budgets, audit logs.

### Q106. Multi-tenancy in LangGraph / LangChain
Namespace stores and checkpoints by tenant / user; enforce ACL filters in retrievers server-side; separate vector collections for large tenants; tenant-scoped API keys; avoid sharing semantic caches; include tenant in trace metadata.

### Q107. Observability at scale
Sample traces (e.g., 10%) in high traffic, always trace errors and low-feedback runs, redact PII, export metrics (latency, tokens, tool error rates) to your monitoring stack, set alerts on cost per request and tool failure rate, and review top-N costly traces weekly.

### Q108. Hybrid architectures: LangChain + other frameworks
Use LlamaIndex for ingestion / indexing and LangGraph for orchestration; DSPy for prompt optimisation; Haystack pipelines for search; provider SDKs for new features. Standardise on interfaces (retriever, tool) to mix components.

### Q109. Build vs buy vs framework decision
Build thin custom orchestration for small, stable flows; adopt LangGraph for complex, stateful agent workflows; consider managed agent platforms when you want hosted execution. Evaluate team skills, debugging experience, lock-in, and long-term maintenance. Avoid abstraction for its own sake.

### Q110. Governance for agents and chains
Registry of prompts / tools / graphs with owners, versioning, evaluation gates, risk tiering, approval workflows for high-risk tools, change logs, and incident runbooks. Link production traces to code versions.

### Q111. Handling non-determinism in CI
Use fake models for logic tests; for live tests use small golden sets with tolerant assertions (schema validity, key facts); run multiple samples where needed; track metrics over time; don't fail builds on single-sample flakiness.

### Q112. Rate limits and quotas
Client-side rate limiters (`InMemoryRateLimiter` for chat models), concurrency caps (`max_concurrency`), request queues, and tenant quotas. Combine with provider retry policies and batch APIs for offline jobs.

### Q113. Data privacy in traces and logs
Mask PII before logging, restrict LangSmith project access, set retention, avoid logging full documents, use self-hosted tracing for sensitive workloads, and ensure deletion procedures.

### Q114. Debugging methodology for chains / agents
Reproduce with the failing trace's inputs; inspect each step's input / output; check prompt rendering, retrieved docs, tool args, state transitions; replay with a fixed seed / fake model; bisect by disabling components; add a regression case to the evaluation set.

### Q115. Knowing when to remove LangChain
If most code is wrappers around a single provider SDK, if debugging through abstractions slows you, if you need provider features not exposed, or dependency churn costs more than it saves — replace with direct SDK calls (keeping LangGraph if you still need graphs).

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q116. Platform strategy for agentic applications
Provide a shared internal platform: model gateway, tool registry with permissioning, retrieval services, memory stores, tracing / evaluation, guardrails, deployment templates (LangGraph apps), and golden-path SDKs. Teams build agents on this, not on ad-hoc stacks.

### Q117. Standardisation vs flexibility
Standardise interfaces (model, tool, retriever, memory), observability, evaluation and security controls; allow teams to choose frameworks inside those boundaries. Document approved patterns and exceptions.

### Q118. Versioning & release management
Version graphs, prompts, tools and state schemas together; staged rollouts (shadow → canary → ramp); feature flags; rollback plans; compatibility matrices for dependencies; changelogs with evaluation deltas.

### Q119. Cost governance
Tag spend per agent / team / tenant; budgets and alerts; max-iteration and token caps; routing to cheaper models; caching; periodic review of top costly flows; unit economics (cost per resolved task).

### Q120. Risk tiers for autonomy
Tier 0: read-only assistants. Tier 1: draft actions with human approval. Tier 2: constrained autonomous actions with rollback. Tier 3: high-impact autonomy (rare, heavily controlled). Map required controls (evaluation, approvals, audit, kill switch) to tiers.

### Q121. Skills and team structure
Platform engineers (infra, tooling), applied AI engineers (agents / RAG), evaluation engineers, domain experts, security reviewers. Provide training on LangGraph, evaluation and prompt / context engineering.

### Q122. Dependency risk management
Fast-moving open source: pin versions, mirror packages, monitor CVEs, avoid unreviewed community integrations in sensitive paths, maintain an upgrade cadence with automated evaluation, and keep an exit strategy via interfaces.

### Q123. Roadmap
Phase 1: baseline RAG / tool-calling app with tracing and evaluation. Phase 2: LangGraph workflows with checkpoints and approvals. Phase 3: shared platform (gateway, registry, memory store). Phase 4: advanced optimisation (prompt / graph optimisation, routing, automated regression and cost control).

### Q124. Measuring success
Task success rate, groundedness, human escalation rate, latency, cost per task, user satisfaction, incident count, time-to-ship new agents, and percentage of apps with tracing / evaluation.

### Q125. Communicating to executives
Position LangChain / LangGraph as accelerators with trade-offs: faster delivery and observability vs dependency churn; mitigate with interfaces, pinned versions, evaluation gates and a clear exit strategy. Focus on business outcomes and risk controls.

---

# 💻 Part 6: Hands-On Tasks & Code

### Task 1. LCEL chain with structured output and retries
```python
from pydantic import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate
from langchain_anthropic import ChatAnthropic

class Invoice(BaseModel):
    invoice_number: str
    total: float
    currency: str = Field(description="ISO-4217 code")

model = ChatAnthropic(model="claude-sonnet-5-5", max_tokens=2048)        # no temperature on current Claude models
prompt = ChatPromptTemplate.from_messages([
    ("system", "Extract invoice fields. Use only the text; never invent values."),
    ("human", "<invoice>\n{text}\n</invoice>")])
chain = prompt | model.with_structured_output(Invoice)
extract = chain.with_retry(stop_after_attempt=3)
print(extract.invoke({"text": "Invoice INV-77 total 4,520.50 INR"}))
```

### Task 2. Full RAG pipeline (load → split → embed → store → retrieve → answer)
```python
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

docs = DirectoryLoader("kb/", glob="**/*.md", loader_cls=TextLoader).load()
chunks = RecursiveCharacterTextSplitter(chunk_size=900, chunk_overlap=120).split_documents(docs)
vs = Chroma.from_documents(chunks, OpenAIEmbeddings(model="text-embedding-3-small"), persist_directory="./chroma")
retriever = vs.as_retriever(search_type="mmr", search_kwargs={"k": 5, "fetch_k": 20})

def fmt(ds): return "\n\n".join(f"[{i+1}] ({d.metadata.get('source')}) {d.page_content}" for i, d in enumerate(ds))
prompt = ChatPromptTemplate.from_template(
    "Answer using ONLY the sources. Cite like [1]. If the answer is missing say: I don't know based on the provided documents.\n\n"
    "<sources>\n{context}\n</sources>\n\nQuestion: {question}")
rag = {"context": retriever | fmt, "question": RunnablePassthrough()} | prompt | model | StrOutputParser()
print(rag.invoke("How long do refunds take?"))
```

### Task 3. History-aware conversational RAG with LangGraph checkpointer
```python
from typing import Annotated, TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import InMemorySaver

class S(TypedDict):
    messages: Annotated[list, add_messages]
    context: str

def rewrite_and_retrieve(s: S):
    q = s["messages"][-1].content
    standalone = (ChatPromptTemplate.from_messages([("system", "Rewrite as a standalone search query. Return only the query."),
                   ("human", "History:\n{h}\n\nLast message: {q}")]) | model | StrOutputParser()
                  ).invoke({"h": "\n".join(m.content for m in s["messages"][:-1][-6:]), "q": q})
    return {"context": fmt(retriever.invoke(standalone))}

def generate(s: S):
    msg = ChatPromptTemplate.from_messages([("system", "Answer ONLY from the sources; cite [n]; else say you don't know.\n<sources>\n{context}\n</sources>"),
                                           ("placeholder", "{messages}")]) | model
    return {"messages": [msg.invoke({"context": s["context"], "messages": s["messages"]})]}

g = StateGraph(S)
g.add_node("retrieve", rewrite_and_retrieve); g.add_node("generate", generate)
g.add_edge(START, "retrieve"); g.add_edge("retrieve", "generate"); g.add_edge("generate", END)
app = g.compile(checkpointer=InMemorySaver())
cfg = {"configurable": {"thread_id": "ritesh-1"}}
app.invoke({"messages": [("human", "What's the refund window?")]}, cfg)
print(app.invoke({"messages": [("human", "And for opened items?")]}, cfg)["messages"][-1].content)
```

### Task 4. Tool-calling agent graph written by hand
```python
from langgraph.prebuilt import ToolNode, tools_condition

tools = [get_order_status]
agent_model = model.bind_tools(tools)

def call_model(state):
    return {"messages": [agent_model.invoke(state["messages"])]}

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]

g = StateGraph(AgentState)
g.add_node("agent", call_model); g.add_node("tools", ToolNode(tools))
g.add_edge(START, "agent")
g.add_conditional_edges("agent", tools_condition)        # -> "tools" or END
g.add_edge("tools", "agent")
app = g.compile()
out = app.invoke({"messages": [("human", "Where is order A1042?")]}, {"recursion_limit": 12})
```

### Task 5. Human approval before a risky tool (interrupt + resume)
```python
from langgraph.types import interrupt, Command
from langgraph.checkpoint.memory import InMemorySaver

def refund_node(state):
    plan = state["refund_plan"]
    decision = interrupt({"approve_refund": plan})            # pauses and surfaces the plan
    return {"result": issue_refund(plan) if decision == "approve" else "Refund declined by reviewer"}

# ... build graph with refund_node, compile(checkpointer=InMemorySaver()) ...
cfg = {"configurable": {"thread_id": "case-9"}}
paused = app.invoke({"refund_plan": {"order": "A1042", "amount": 499}}, cfg)     # returns with __interrupt__
final = app.invoke(Command(resume="approve"), cfg)                                # continues from the checkpoint
```

### Task 6. Hybrid retrieval with re-ranking
```python
from langchain.retrievers import EnsembleRetriever, ContextualCompressionRetriever
from langchain_community.retrievers import BM25Retriever
from langchain.retrievers.document_compressors import CrossEncoderReranker
from langchain_community.cross_encoders import HuggingFaceCrossEncoder

bm25 = BM25Retriever.from_documents(chunks); bm25.k = 20
dense = vs.as_retriever(search_kwargs={"k": 20})
hybrid = EnsembleRetriever(retrievers=[bm25, dense], weights=[0.4, 0.6])
reranker = CrossEncoderReranker(model=HuggingFaceCrossEncoder(model_name="BAAI/bge-reranker-base"), top_n=5)
final_retriever = ContextualCompressionRetriever(base_compressor=reranker, base_retriever=hybrid)
```
(Import paths shift between versions; verify.)

### Task 7. Fallbacks across providers with rate limiting
```python
from langchain_core.rate_limiters import InMemoryRateLimiter
from langchain_openai import ChatOpenAI

limiter = InMemoryRateLimiter(requests_per_second=2, check_every_n_seconds=0.1, max_bucket_size=5)
primary = ChatAnthropic(model="claude-sonnet-5-5", max_tokens=2048, rate_limiter=limiter)
backup = ChatOpenAI(model="<model-id>")
llm = primary.with_retry(stop_after_attempt=2).with_fallbacks([backup])
```

### Task 8. Streaming events to a frontend (FastAPI + astream_events)
```python
import json
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
api = FastAPI()

@api.post("/ask")
async def ask(body: dict):
    async def gen():
        async for ev in rag.astream_events(body["q"], version="v2"):
            if ev["event"] == "on_chat_model_stream":
                yield f"data: {json.dumps({'token': ev['data']['chunk'].content})}\n\n"
            elif ev["event"] == "on_retriever_end":
                yield f"data: {json.dumps({'sources': [d.metadata.get('source') for d in ev['data']['output']]})}\n\n"
        yield "data: [DONE]\n\n"
    return StreamingResponse(gen(), media_type="text/event-stream")
```

### Task 9. Deterministic unit test with a fake chat model
```python
from langchain_core.language_models.fake_chat_models import GenericFakeChatModel
from langchain_core.messages import AIMessage

def test_chain_parses_label():
    fake = GenericFakeChatModel(messages=iter([AIMessage(content="billing")]))
    chain = ChatPromptTemplate.from_template("Classify: {t}") | fake | StrOutputParser()
    assert chain.invoke({"t": "charged twice"}) == "billing"
```

### Task 10. LangSmith evaluation run
```python
from langsmith import Client, evaluate
client = Client()
dataset = client.create_dataset("support-qa")
client.create_examples(dataset_id=dataset.id, examples=[
    {"inputs": {"question": "How long do refunds take?"}, "outputs": {"answer": "7 business days"}}])

def target(inputs): return {"answer": rag.invoke(inputs["question"])}
def contains_answer(run, example):
    return {"key": "contains_answer", "score": int(example.outputs["answer"].lower() in run.outputs["answer"].lower())}

evaluate(target, data="support-qa", evaluators=[contains_answer], experiment_prefix="rag-v1")
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. `ImportError` / `ModuleNotFoundError` after upgrading
Packages were reorganised (core vs community vs provider packages; legacy moved to `langchain-classic`). Check the migration guide, install the provider package, update import paths, pin compatible versions.

### D2. Deprecation warnings for `LLMChain`, `ConversationBufferMemory`, `initialize_agent`
Legacy APIs. Migrate to LCEL, LangGraph checkpointers and `create_agent`; add evaluation tests before and after.

### D3. Streaming returns the whole answer at once
A step in the chain doesn't support streaming (a plain function, non-streaming parser) or the model's `streaming` is off. Use runnables that support `transform`, avoid blocking lambdas, and test with `astream`.

### D4. Agent loops forever or hits recursion limit
Tool failures without actionable errors, ambiguous goals, no stop criteria. Improve tool descriptions / errors, set `recursion_limit`, add max-iteration guards and loop detection, and allow the agent to ask the user.

### D5. Structured output fails validation
Schema too complex, ambiguous field descriptions, or model lacks native support. Simplify the schema, add field descriptions / enums, use retries with the error fed back, and validate business rules separately.

### D6. Retriever returns nothing or irrelevant docs
Wrong embedding model (query vs index), metadata filters too strict, chunking issues, empty collection after restart (ephemeral store). Inspect `vs.similarity_search_with_score`, verify persistence, check filters and embeddings.

### D7. Duplicate documents in the vector store
Re-ingesting without deterministic IDs. Use the indexing API with a RecordManager (`cleanup="incremental"`) or custom IDs / upserts.

### D8. Memory doesn't persist between requests
Different `thread_id` each call, `InMemorySaver` lost on restart or per-process in multi-worker deployments. Use a durable checkpointer (Postgres / Redis) and stable thread IDs.

### D9. Interrupt/resume doesn't work
No checkpointer, wrong `thread_id`, or changed graph structure between pause and resume. Compile with a persistent checkpointer, reuse the same config, and avoid breaking graph changes for in-flight threads.

### D10. Tracing missing in LangSmith
Env vars not set in the running process, async tasks without context propagation, or sampling. Verify variables, pass `config` to nested calls, and use `@traceable` for custom functions.

### D11. Rate-limit errors (429) under load
No concurrency cap. Use `max_concurrency`, rate limiters, retries with backoff, request queues, and batch APIs for bulk work.

### D12. Tool arguments are wrong/hallucinated
Vague tool schema or too many similar tools. Tighten descriptions, use enums / patterns, reduce the tool set per step, add validation and helpful errors.

### D13. Prompt caching doesn't work via LangChain
Cache control blocks not passed, dynamic content early in the prefix, or provider minimum length not met. Inspect the rendered request, keep a stable prefix, and read `usage_metadata` for cache fields.

### D14. High latency in RAG chain
Sequential steps that could be parallel, large `k`, cross-encoder on many docs, slow embedding calls, cold vector DB. Parallelise (RunnableParallel), reduce candidates, cache embeddings, stream, and trace per-step timings.

### D15. Works locally, fails in production container
Missing system dependencies (PDF libs), file paths, env secrets, multiple workers each with in-memory stores, or network egress limits. Containerise dependencies, externalise state, validate config on startup.

---

# 🧩 Part 8: Tricky Questions

### T1. Is LangChain required to build LLM apps?
No. Many production apps use provider SDKs directly. LangChain adds value through integrations, standard interfaces, LangGraph orchestration and tracing, at the cost of abstraction and churn.

### T2. Is an LCEL chain the same as an agent?
No. A chain follows a fixed sequence of steps; an agent lets the model decide which tools to call and how many steps to take (a loop with control flow).

### T3. Does `with_structured_output` guarantee correct values?
It improves syntax / schema validity, not truth. Validate semantics and handle failures.

### T4. Are LangChain "memory" classes still the recommended approach?
No for new code: use LangGraph checkpointers / stores or explicit message history with trimming / summarisation.

### T5. Does `RunnableParallel` always run branches in parallel?
It runs them concurrently (threads or async tasks) but actual parallelism depends on I/O vs CPU and the executor; blocking sync calls in async code can serialise work.

### T6. Is LangGraph only for multi-agent systems?
No. It's for any workflow needing explicit state, branching, loops, persistence or human-in-the-loop, including single-agent apps.

### T7. Can I rely on `temperature=0` through LangChain for determinism?
Not reliably, and some providers (e.g., current Claude models) don't accept sampling parameters. Use structured outputs, validation and caching for stability.

### T8. Does using a checkpointer make my app scalable by itself?
It gives durable state, but scaling also needs stateless workers, a robust database, queueing and concurrency control.

### T9. Is LangSmith required?
No, but it provides tracing and evaluation conveniences. You can use OpenTelemetry-based tools (Langfuse, Phoenix) or custom logging.

### T10. Why do my community-integration tools behave differently across versions?
Community packages evolve independently and may lag provider changes. Pin versions, read changelogs, and write integration tests; consider thin custom wrappers for critical paths.

### T11. Is `AgentExecutor` removed?
Legacy and moved away from the main path in v1 (verify availability in `langchain-classic`). New code should use `create_agent` / LangGraph.

### T12. Does chaining more steps improve quality?
Not automatically; each step adds latency, cost and failure modes. Chain only when evaluation shows gains.

### T13. Can tools be called in parallel?
Models may emit multiple tool calls in one turn; `ToolNode` executes them (concurrently where supported). Ensure tools are independent and thread-safe, and return all results before the next model call.

### T14. Is storing the full conversation in graph state always fine?
No: long histories cost tokens and checkpoint storage. Trim / summarise and store large artefacts externally.

### T15. Does swapping the model provider require no prompt changes?
The interface is the same, but behaviour, tool-calling reliability, formatting and token costs differ. Re-evaluate prompts and schemas per provider.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- LangChain = interfaces + integrations; LangGraph = stateful orchestration; LangSmith = tracing/eval.
- `prompt | model | parser` is LCEL.
- Runnables: `invoke`, `stream`, `batch`, async versions.
- `with_structured_output(Pydantic)` for typed results.
- `@tool` turns functions into model-callable tools.
- `create_agent` for standard tool-calling agents.
- LangGraph: StateGraph, nodes, edges, reducers, checkpointers.
- `add_messages` reducer appends messages.
- Interrupts need a checkpointer and `thread_id`.
- Checkpointer = thread memory; Store = cross-thread memory.
- `recursion_limit` stops runaway loops.
- `RunnableParallel` for concurrent branches.
- `with_retry` + `with_fallbacks` for resilience.
- Indexing API prevents duplicate chunks.
- MMR improves diversity of retrieved docs.
- Hybrid = BM25 + vectors; re-rank with a cross-encoder.
- Pin versions; expect API churn.
- Wrap the framework behind your interfaces.
- Trace with tags/metadata; redact PII.
- Test with fake models and golden sets.
- Prefer the simplest abstraction that works.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about an app you built with LangChain/LangGraph
Use STAR: problem and metric → why this framework (integrations, graph control) → architecture (retrieval, tools, state, checkpointer, guardrails) → evaluation (golden set, trajectory metrics) → deployment (FastAPI / platform, tracing, cost controls) → results. Example: "Support agent with hybrid RAG + order-status tool in LangGraph; Postgres checkpointer; human approval for refunds; deflection +31%, p95 4.2 s; LangSmith evals caught a regression after a prompt change."

### P2. A time the framework caused a problem
Describe an upgrade breaking imports or behaviour, how you detected it (CI evaluation / tests), the fix (pins, adapters, migration), and the practice you adopted (interfaces, lockfiles, upgrade checklist).

### P3. How did you debug a misbehaving agent?
Pulled the trace, inspected prompts / tool args / state transitions, reproduced with a fake model, tightened tool schemas and context, added a regression scenario, and monitored the metric afterwards.

### P4. How did you decide between a simple chain and a graph?
Mapped requirements (branching, loops, persistence, approvals), prototyped both, compared complexity and failure handling, and chose the minimal solution meeting needs.

### P5. How did you control cost and latency?
Cached prefixes, trimmed history, parallelised retrieval, cheaper models for routing / grading, capped iterations, and tracked tokens per node in dashboards.

### P6. How did you secure the agent?
Least-privilege tools with approvals for write actions, injection defences on retrieved text, tenant-scoped retrieval and memory, sandboxed code execution, audit logs and red-team tests.

### P7. How do you onboard teammates to LangChain/LangGraph?
Starter template, coding standards (interfaces, typed state, tests), evaluation tooling, trace-driven debugging sessions, and an "upgrade playbook."

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- Core abstractions: chat models, messages, prompts, parsers, structured output, tools, Runnables, LCEL, configs, callbacks.
- Data & retrieval: loaders, splitters, embeddings, vector stores, retrievers (multi-query, parent-document, self-query, ensemble, compression), indexing API, RAG patterns.
- Agents: tool calling, `create_agent`, middleware, structured responses, ReAct concepts, tool design.
- LangGraph: state & reducers, nodes/edges, conditional routing, `Send`, subgraphs, checkpointers, stores, interrupts, streaming, durable execution, multi-agent patterns.
- Operations: LangSmith tracing & evaluation, prompt versioning, caching, retries/fallbacks, rate limiting, testing with fakes, deployment, security, cost, observability.
- Ecosystem: provider packages, MCP adapters, LangServe → platform/FastAPI, migrations from legacy APIs.

## Mixed topics
- RAG + conversational rewriting + checkpointers.
- Tool agents + approvals + audit logging.
- Provider portability + fallbacks + evaluation gates.
- Multi-tenant retrieval + store namespaces + ACLs.
- Streaming UI + events + cancellation.
- Upgrade management + interfaces + pinned dependencies.

---

# 🔬 Part 12: Internals

### Runnable protocol
Core methods: `invoke`, `ainvoke`, `batch`, `abatch`, `stream`, `astream`, `astream_events`, plus `input_schema` / `output_schema`. `RunnableSequence` calls `invoke` sequentially; `RunnableParallel` runs children concurrently and merges dict outputs. Default implementations derive `batch` from `invoke` using a thread pool and `stream` from `invoke` unless overridden (`transform`).

### Config propagation
`RunnableConfig` (callbacks, tags, metadata, `run_name`, `max_concurrency`, `recursion_limit`, `configurable`) is passed implicitly through context variables so child runs inherit tracing and settings. Breaking out of context (manual threads) loses it unless you copy context.

### Message and tool-call flow
`AIMessage.tool_calls` is a normalised list (`name`, `args`, `id`) built from provider-specific formats. `ToolMessage(tool_call_id=...)` must match IDs. Providers differ in parallel tool calls and result formats; the integration handles conversion.

### LangGraph execution model
Pregel-style bulk-synchronous steps: in each super-step, nodes whose input channels updated run in parallel; their writes are applied via reducers at the step boundary; then the next step is planned. After each step the checkpointer saves a snapshot (channel values, versions, pending writes), enabling resume, interrupts and time travel.

### Reducers and channels
State keys map to channels (`LastValue`, `BinaryOperatorAggregate`, topics). Reducers (e.g., `add_messages`, `operator.add`) define merge semantics for concurrent updates; without a reducer, concurrent writes to the same key error.

### Interrupts
`interrupt(value)` raises a special exception captured by the runtime, saves the checkpoint, and returns the value to the caller; on `Command(resume=...)` the node re-executes from its start and `interrupt` returns the resume value — so code before `interrupt` in the node must be idempotent.

### Streaming modes
`values` (full state), `updates` (per-node deltas), `messages` (LLM token chunks with metadata), `custom` (user-emitted), `debug`; combine multiple modes. Underneath, callbacks and writers push events through queues to the iterator.

### Vector store abstraction
`VectorStore` offers `add_documents`, `similarity_search(_with_score)`, `max_marginal_relevance_search`, `delete`, `as_retriever`. Implementations translate filters into backend-specific syntax; filter capabilities and score semantics (distance vs similarity) vary by store.

### Indexing API mechanics
For each document compute a hash of content + metadata; a RecordManager stores `(key, group_id, updated_at)`. Incremental cleanup deletes previous versions of changed sources and unchanged docs are skipped, keeping the vector store consistent.

### Caching layers
LLM cache keys on (prompt, model params) → response; embedding caches (`CacheBackedEmbeddings`) key on text hash; provider prompt caching is separate (server-side prefix cache). They solve different problems.

---

# 📊 Part 13: Reference Tables

### When to use what
| Need | Use |
|---|---|
| One model call | Provider SDK or `model.invoke` |
| Linear pipeline (prompt → model → parse) | LCEL |
| RAG Q&A | LCEL chain or agent with retriever tool |
| Tool-calling assistant | `create_agent` |
| Branching/loops/persistence/approvals | LangGraph |
| Long-term cross-session memory | LangGraph Store |
| Tracing/evals/prompt versions | LangSmith (or Langfuse/Phoenix) |
| Exotic provider feature | Provider SDK (or model kwargs/content blocks) |

### Legacy → modern mapping
| Legacy | Modern |
|---|---|
| `LLMChain` | `prompt | model | parser` |
| `ConversationChain` + memory | LangGraph checkpointer / message history |
| `initialize_agent`, `AgentExecutor` | `create_agent` / LangGraph |
| `RetrievalQA` | Explicit retriever + prompt chain |
| `SequentialChain` | LCEL sequence |
| `LangServe` | FastAPI / LangGraph Platform |

### Retriever menu
| Retriever | Use |
|---|---|
| Vector (similarity/MMR) | Default |
| BM25 | Keyword precision |
| Ensemble | Hybrid fusion |
| MultiQuery | Vague/paraphrased queries |
| ParentDocument/MultiVector | Small-to-big retrieval |
| SelfQuery | Metadata-filter queries |
| ContextualCompression | Re-ranking/filtering |

### Streaming modes (LangGraph)
| Mode | Emits |
|---|---|
| `values` | Full state after each step |
| `updates` | Node outputs only |
| `messages` | LLM token chunks |
| `custom` | Developer events |
| `debug` | Detailed execution info |

### Testing layers
| Layer | Tooling |
|---|---|
| Tools/parsers | Plain pytest |
| Chains | Fake chat models |
| Graph routing | Canned states |
| Persistence | In-memory/ephemeral Postgres checkpointer |
| Quality | LangSmith/RAGAS golden sets |
| Safety | Red-team suites |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
```python
chain = ChatPromptTemplate.from_template("Say {x}") | GenericFakeChatModel(messages=iter([AIMessage(content="hi")])) | StrOutputParser()
print(chain.invoke({"x": "hello"}))
```
**`hi`** (the fake model returns the scripted message).

### O2.
```python
(RunnableLambda(lambda x: x + 1) | RunnableLambda(lambda x: x * 2)).invoke(3)
```
**`8`** (`(3+1)*2`).

### O3.
```python
RunnableParallel(a=RunnableLambda(lambda x: x + 1), b=RunnableLambda(lambda x: x * 10)).invoke(2)
```
**`{'a': 3, 'b': 20}`**

### O4.
```python
RunnablePassthrough.assign(len=lambda x: len(x["text"])).invoke({"text": "hello"})
```
**`{'text': 'hello', 'len': 5}`**

### O5.
Graph state `{"messages": [A]}` with reducer `add_messages`; a node returns `{"messages": [B]}`. New state: **`{"messages": [A, B]}`** (appended). Without the reducer it would be **`[B]`** (overwritten).

### O6.
`chunk_size=800`, `chunk_overlap=100` on a 2,000-character text with the character splitter: roughly **3 chunks** (starts ≈ 0, 700, 1400), exact count depends on separators.

### O7.
Agent calls tools forever with `recursion_limit=25`: the run raises a **`GraphRecursionError`** after 25 steps (handle and return a graceful fallback).

### O8.
Calling `app.invoke(..., config={"configurable": {"thread_id": "A"}})` then with `thread_id "B"`: the second thread **does not see** the first thread's messages (separate checkpoints).

### O9.
`retriever = vs.as_retriever(search_kwargs={"k": 4})` returns **at most 4** documents (fewer if the store has fewer or filters exclude).

### O10.
`model.with_retry(stop_after_attempt=3)` on a call failing twice with a transient error and succeeding on the third: result is **returned normally** after 3 attempts total.

### O11.
`ToolMessage(tool_call_id="abc")` answering an `AIMessage` whose tool call id is `"xyz"`: provider returns an error (**mismatched tool_call_id**); IDs must match exactly.

### O12.
Interrupt node code: `print("A"); x = interrupt("approve?"); print("B")`. On the first run prints **A** then pauses; after resume it prints **A** again (node re-runs from the start) then **B**.

---

# ✅ Part 15: MCQs

**1. LCEL composes components using:**
A) `+`  B) `|` (pipe)  C) `&&`  D) `>>`
**Answer: B**

**2. Which library provides stateful graphs with checkpointers and interrupts?**
A) LangServe  B) LangGraph  C) langchain-text-splitters  D) FAISS
**Answer: B**

**3. `with_structured_output(Schema)` is used to:**
A) Stream tokens  B) Obtain typed/validated output from a model  C) Cache embeddings  D) Split text
**Answer: B**

**4. Per-conversation memory in modern LangChain is best implemented with:**
A) `ConversationBufferMemory`  B) LangGraph checkpointers keyed by `thread_id`  C) Global variables  D) Random IDs
**Answer: B**

**5. A reducer in LangGraph state defines:**
A) How tokens are counted  B) How multiple updates to a key are merged  C) Which model is used  D) How tools are named
**Answer: B**

**6. To avoid infinite agent loops you should:**
A) Increase temperature  B) Set `recursion_limit` and loop/iteration guards  C) Remove tools  D) Disable tracing
**Answer: B**

**7. `ToolNode` in LangGraph:**
A) Creates embeddings  B) Executes tool calls from the last AI message and returns ToolMessages  C) Splits documents  D) Stores memory
**Answer: B**

**8. The indexing API with a RecordManager helps to:**
A) Speed up LLM tokens  B) Avoid duplicate vectors and sync deletions  C) Stream responses  D) Rate-limit APIs
**Answer: B**

**9. `EnsembleRetriever` typically combines:**
A) Two LLMs  B) Keyword (BM25) and vector retrievers  C) Two checkpointers  D) Two prompts
**Answer: B**

**10. Interrupts in LangGraph require:**
A) A checkpointer and a thread ID  B) A GPU  C) LangServe  D) An agent executor
**Answer: A**

**11. Which is a legacy API to avoid in new code?**
A) `create_agent`  B) `initialize_agent`/`AgentExecutor`  C) `StateGraph`  D) `RunnableParallel`
**Answer: B**

**12. Streaming breaks token-by-token output when:**
A) The chain uses LCEL  B) A step buffers the full input (non-streaming function)  C) You use async  D) You add tags
**Answer: B**

**13. LangSmith is primarily for:**
A) Vector storage  B) Tracing, evaluation and prompt management  C) PDF parsing  D) GPU scheduling
**Answer: B**

**14. Which test double enables deterministic chain tests?**
A) A random sampler  B) `GenericFakeChatModel`/`FakeListChatModel`  C) A larger model  D) A retriever
**Answer: B**

**15. Cross-thread, long-term user memory in LangGraph is provided by:**
A) Checkpointer  B) Store  C) Reducer  D) ToolNode
**Answer: B**

**16. `RunnableParallel` outputs:**
A) A list of strings  B) A dict keyed by branch names  C) A single string  D) A graph
**Answer: B**

**17. Best practice for dependency management in LangChain projects:**
A) Use `latest` everywhere  B) Pin compatible versions and run evaluation tests on upgrades  C) Copy code from docs  D) Avoid lockfiles
**Answer: B**

**18. Provider-agnostic design in LangChain is limited by:**
A) Nothing; all providers behave identically  B) Differences in tool-calling reliability, formatting, features and costs that need re-evaluation  C) Python version  D) LCEL syntax
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

- Using deprecated chains / memory classes in new code; not reading migration guides.
- Over-abstracting: building LangChain pipelines for simple single-call tasks.
- Letting dependencies float (`latest`) and breaking on upgrades.
- Putting business logic inside prompts / chains with no tests; no evaluation set.
- Using `InMemorySaver` / in-process stores in multi-worker production.
- Changing `thread_id` every request and wondering why memory disappears.
- Letting agents run without iteration / token / time limits.
- Vague tool descriptions and too many overlapping tools.
- Blocking calls in async paths; breaking streaming with non-streaming steps.
- Forgetting deterministic chunk IDs / indexing API, causing duplicates.
- Passing huge documents or tool outputs through state and context.
- Ignoring security: untrusted tool / retrieved text, community integrations, SSRF in loaders.
- Logging PII to traces; no retention policy.
- Assuming provider parity: not re-testing prompts / schemas when switching models.
- Sending unsupported sampling parameters to models that reject them.
- Using LangServe-era patterns without checking current deployment recommendations.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You choose the lowest abstraction that works and can justify LCEL vs LangGraph vs plain SDK.
- You design typed, minimal graph state with reducers, checkpointing and migration plans.
- You build with evaluation first: golden sets, trajectory scoring, regression gates in CI.
- You protect against runaway loops, tool misuse and prompt injection with limits, approvals and least privilege.
- You wrap the framework behind interfaces and pin versions to survive API churn.
- You trace everything with metadata (tenant, prompt version) and manage PII in observability.
- You understand execution internals (super-steps, interrupts re-running nodes, streaming transforms).
- You make cost / latency visible per node and optimise with caching, routing and trimming.
- You can migrate legacy LangChain code safely and know when to drop the framework.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Core snippets
```python
chain = prompt | model | StrOutputParser()                         # LCEL
typed = model.with_structured_output(PydanticModel)                # structured output
model_with_tools = model.bind_tools([my_tool])                     # tool calling
agent = create_agent(model="...", tools=[...], system_prompt="...", checkpointer=saver)   # verify signature
cfg = {"configurable": {"thread_id": "user-42"}, "recursion_limit": 25}
app.invoke({"messages": [("human", "...")]}, cfg)                  # LangGraph run
```

### RAG recipe
Loader → recursive/structure-aware splitter (+metadata, deterministic IDs) → embeddings → vector store (+indexing API) → hybrid retriever (+MMR) → re-ranker → grounded prompt with citations → model → parser → trace + evaluate.

### Agent/graph checklist
Typed state + reducers • small tool set with strict schemas • `ToolNode` + routing • checkpointer (durable) • interrupts for risky actions • recursion/iteration/token limits • streaming • tracing with tags • tests with fake models.

### Production checklist
Pinned versions • interfaces around framework • secrets in vault • rate limits + retries + fallbacks • PII redaction • tenant isolation • cost dashboards • evaluation gates • rollback plan • documented runbooks.

### Final checklist before the interview
- [ ] Explain LangChain packages, LCEL, Runnable interface and when not to use LangChain.
- [ ] Build prompt → model → parser chains with structured output and retries / fallbacks.
- [ ] Implement RAG with loaders, splitters, embeddings, vector stores, hybrid retrieval and re-ranking.
- [ ] Define tools, run tool-calling loops, and use `create_agent` safely.
- [ ] Explain LangGraph state, reducers, conditional edges, checkpointers, stores, interrupts, streaming, subgraphs.
- [ ] Trace and evaluate with LangSmith (datasets, evaluators, experiments).
- [ ] Handle security, multi-tenancy, cost, latency and reliability concerns.
- [ ] Describe migration from legacy chains / memory to LCEL and LangGraph.
- [ ] Test with fake models and golden sets; manage dependency upgrades.
- [ ] Prepare a project story with architecture, metrics, a failure lesson and trade-offs.
