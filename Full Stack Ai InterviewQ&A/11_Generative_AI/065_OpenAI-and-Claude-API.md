# OpenAI & Claude API Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets the **OpenAI Python SDK 1.x / 2.x** (Responses API first, Chat Completions still supported) and the **Anthropic Python SDK (`anthropic`)** with the **Claude Messages API**, as of **late 2025 – late 2026**. Claude model IDs used here: `claude-opus-5-5`, `claude-sonnet-5-5`, `claude-haiku-5-5`, `claude-fable-5-1` (prices cached 2026-10-06: Opus 5.5 $4 / $20, Sonnet 5.5 $2 / $10, Haiku 5.5 $0.10 / $0.50, Fable 5.1 $10 / $50 per 1M input / output tokens). **OpenAI model names, prices, rate limits, deprecation dates and some parameters change often, so OpenAI examples use `<model-id>` placeholders**: check the provider docs (platform.openai.com/docs, platform.claude.com/docs) before shipping. Anything marked "verify" is especially time-sensitive. Important Claude changes to remember: **`temperature` / `top_p` / `top_k` are rejected on current Claude models and on API version `2026-10-21`**, **assistant prefill is removed**, **`thinking: {"type": "adaptive"}` replaces `budget_tokens`**, and **forced `tool_choice` (`any` / `tool`) returns a 400 on some models** (details below). Examples use the sample name **Ritesh Kumar** and small support / invoice / e-commerce style tasks.
> This file covers how LLM HTTP APIs work (stateless chat, tokens, streaming, errors, rate limits), authentication and key safety, the OpenAI APIs (Responses, Chat Completions, structured outputs, function calling, built-in tools, reasoning models, embeddings, moderation, images, audio, realtime, batch, files, fine-tuning), the Claude APIs (Messages, system prompts, content blocks, vision / PDFs, extended / adaptive thinking and effort, tool use, structured outputs, streaming, prompt caching, token counting, batches, Files API, citations, server tools, compaction, MCP connector, Managed Agents, platform clients for Bedrock / Vertex / Foundry), comparing the two, multi-provider abstraction and gateways, reliability (retries, timeouts, idempotency, fallbacks), cost and latency optimisation, security and privacy, observability, evaluation, testing, and production architecture. Related topics: generative AI overview in `063_Generative-AI.md`, prompt engineering in `064_Prompt-Engineering.md`, LLMs and RAG in `066_LLM-and-RAG.md`, vector databases in `067_Vector-Databases.md`, LangChain in `068_LangChain.md`, AI agents in `069_AI-Agents.md`, fine-tuning in `070_Fine-Tuning-LoRA-QLoRA.md`, multimodal AI in `071_Multimodal-AI.md`, evaluation and guardrails in `072_LLM-Evaluation-and-Guardrails.md`, serving in `073_Model-Serving-and-Inference.md`, AI safety in `076_AI-Safety-and-Responsible-AI.md`, REST APIs in `../03_Backend/035_GraphQL-and-REST-APIs.md`, Python in `../03_Backend/014_Python.md`, FastAPI in `../03_Backend/015_FastAPI.md`, authentication in `../03_Backend/036_Authentication-and-Security.md`, WebSockets in `../03_Backend/037_WebSockets-and-Realtime.md`, message queues in `../03_Backend/038_Message-Queues.md`.

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

### Q1. What is an LLM API? *(Must-know)*
A hosted HTTPS endpoint where you send a request (model name, messages/prompt, options) and receive generated output (text, tool calls, structured data, embeddings, images, audio). You don't run the model; the provider does. You pay per token (or per image / second of audio) and are subject to rate limits.

### Q2. OpenAI vs Anthropic (Claude): the big picture
| | OpenAI | Anthropic (Claude) |
|---|---|---|
| Main text API | **Responses API** (newer) and **Chat Completions** | **Messages API** |
| Env var for key | `OPENAI_API_KEY` | `ANTHROPIC_API_KEY` |
| Python package | `openai` | `anthropic` |
| System instructions | `instructions` (Responses) or `developer`/`system` message | top-level `system` parameter |
| Tools | function calling + built-in tools | tool use (client tools) + server tools |
| Reasoning control | `reasoning.effort` on reasoning models | `thinking` (adaptive) + `output_config.effort` |
| Embeddings | Yes (`text-embedding-3-*`) | **No first-party embeddings** (use a vector provider such as Voyage or open models) |
| Image generation | Yes | No (Claude reads images; it doesn't generate them) |
| Audio (STT / TTS) | Yes | No first-party audio models |

### Q3. Statelessness *(Must-know)*
Both chat APIs are **stateless**: the model remembers nothing between calls. To continue a conversation you resend the history (system + all prior user / assistant messages), or use a provider feature that stores it (OpenAI Responses `previous_response_id`). Longer histories mean more input tokens and cost.

### Q4. Tokens and billing
Models read and write tokens (≈ ¾ of an English word). Billing = input tokens × input price + output tokens × output price (output is typically several times more expensive). Reasoning / thinking tokens are billed as output tokens. Cached input tokens are discounted.

### Q5. Context window and `max_tokens`
The context window is the total tokens (input + output) the model can handle. `max_tokens` (Claude: **required**) / `max_output_tokens` (OpenAI Responses) caps output length. If the cap is hit, output is truncated (`stop_reason: "max_tokens"` on Claude; `incomplete` status with a reason on OpenAI).

### Q6. API keys and authentication *(Must-know)*
Keys are secrets sent in headers (OpenAI: `Authorization: Bearer sk-...`; Anthropic: `x-api-key` plus `anthropic-version`). Rules: never commit keys or ship them in frontend code, load from environment/secret manager, use separate keys per environment/service, rotate on leak, restrict by workspace/project, and monitor usage.
```python
# SDKs read the key from the environment automatically
import anthropic, openai
claude = anthropic.Anthropic()      # ANTHROPIC_API_KEY (or an `ant auth login` profile)
oa = openai.OpenAI()                # OPENAI_API_KEY
```

### Q7. A minimal Claude call *(Must-know)*
```python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-5-5",
    max_tokens=16000,
    system="You are a concise support assistant.",
    messages=[{"role": "user", "content": "How do I reset my password?"}],
)
for block in response.content:           # a list of content blocks
    if block.type == "text":
        print(block.text)
```

### Q8. A minimal OpenAI call (Responses API)
```python
from openai import OpenAI
client = OpenAI()

resp = client.responses.create(
    model="<model-id>",
    instructions="You are a concise support assistant.",
    input="How do I reset my password?",
)
print(resp.output_text)
```

### Q9. A minimal OpenAI call (Chat Completions)
```python
resp = client.chat.completions.create(
    model="<model-id>",
    messages=[{"role": "system", "content": "You are a concise support assistant."},
              {"role": "user", "content": "How do I reset my password?"}],
)
print(resp.choices[0].message.content)
```
Chat Completions remains widely used and supported; new features often land first in Responses (verify).

### Q10. Roles in messages
`system` / `developer` (instructions), `user` (requests), `assistant` (model replies), and `tool` / tool-result messages. Claude's first message must be `user`; consecutive same-role messages are merged. Claude also allows mid-conversation `{"role": "system"}` messages on supporting models (they preserve the cached prefix).

### Q11. Content blocks (Claude)
`response.content` is a **list of typed blocks**: `text`, `thinking`, `tool_use`, `server_tool_use`, web-search / code-execution result blocks, etc. Always check `block.type` before reading `.text`; never assume `content[0]` is text.

### Q12. Stop reasons (Claude) *(Must-know)*
`end_turn` (finished), `max_tokens` (truncated: raise the cap or stream), `stop_sequence`, `tool_use` (run the tool and continue), `pause_turn` (server-tool turn paused: resume), `refusal` (safety decline: check `stop_details`). Check `stop_reason` before trusting `content`.

### Q13. Streaming (why and how)
Streaming returns tokens as they're generated, so users see output immediately and long requests avoid HTTP timeouts. Use it for chat UIs and for any request with large `max_tokens`.
```python
with client.messages.stream(model="claude-opus-5-5", max_tokens=64000,
                            messages=[{"role": "user", "content": "Write a long report"}]) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
    final = stream.get_final_message()       # the complete Message when you need it
```
```python
# OpenAI Responses streaming
with client.responses.stream(model="<model-id>", input="Write a long report") as stream:
    for event in stream:
        if event.type == "response.output_text.delta":
            print(event.delta, end="", flush=True)
```

### Q14. Common HTTP errors
| Code | Meaning | Retry? |
|---|---|---|
| 400 | Invalid request (bad params, removed parameters, schema errors) | No |
| 401 | Bad / missing key | No |
| 403 | Not allowed | No |
| 404 | Unknown model / endpoint (a model your org can't use also looks like 404) | No |
| 413 | Request too large | No |
| 429 | Rate limited | Yes (respect `retry-after`) |
| 500 / 529 (Claude overloaded) / 503 | Provider-side problem | Yes (backoff) |

### Q15. Typed exceptions (don't string-match)
Both SDKs raise specific classes: `RateLimitError`, `AuthenticationError`, `BadRequestError`, `NotFoundError`, `APIConnectionError`, `APIStatusError`, etc. Catch most-specific first.
```python
import anthropic
try:
    client.messages.create(...)
except anthropic.RateLimitError as e:
    wait = int(e.response.headers.get("retry-after", "30"))
except anthropic.BadRequestError as e:
    log.error("bad request: %s", e.message)         # fix the request; don't retry
except anthropic.APIStatusError as e:
    log.error("status %s", e.status_code)
except anthropic.APIConnectionError:
    ...                                              # network problem; retry
```

### Q16. SDK retries and timeouts
Both SDKs auto-retry connection errors, 408/409/429 and ≥500 with exponential backoff (default 2 retries). Set `timeout` and `max_retries` on the client or per call (`client.with_options(timeout=20, max_retries=4)`). Timeouts are retried too, so wall-clock can reach `timeout × (retries + 1)`.

### Q17. Request IDs
Responses carry a request ID (Claude: `response._request_id` / `request-id` header; OpenAI: `x-request-id`). Log it with every call so providers can debug failures.

### Q18. Temperature and sampling: what changed
Older APIs expose `temperature`, `top_p`, `top_k`. **Current Claude models reject them (400)**, and on Claude API version `2026-10-21` every model does: steer style via prompts and, for depth, `effort`. OpenAI reasoning models also restrict sampling parameters (verify per model). Write code that doesn't depend on them.

### Q19. System prompt vs user prompt
System / developer instructions set persistent behaviour (role, rules, format); user messages carry the request. Models weight system instructions more, but **neither is a security boundary**: untrusted text can still steer the model.

### Q20. Vision (images) with both APIs
```python
import base64
img = base64.standard_b64encode(open("receipt.png", "rb").read()).decode()
response = client.messages.create(
    model="claude-opus-5-5", max_tokens=16000,
    messages=[{"role": "user", "content": [
        {"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": img}},
        {"type": "text", "text": "Extract merchant, date and total as JSON."}]}],
)
```
OpenAI Responses uses `{"type": "input_image", "image_url": "data:image/png;base64,..."}` items inside `input`.

### Q21. PDFs and documents
Claude accepts PDFs as `document` blocks (base64, URL or Files API `file_id`) placed before the question; optional `citations: {enabled: true}` returns cited passages. OpenAI accepts files via `input_file` items or Files API (verify limits: size, pages).

### Q22. Embeddings
OpenAI offers `text-embedding-3-small/large` (with a `dimensions` option). **Anthropic doesn't provide embeddings**; use Voyage AI, Cohere, open models (BGE, E5, GTE) or OpenAI embeddings, and keep the same model for indexing and querying.
```python
vec = oa.embeddings.create(model="text-embedding-3-small", input=["refund policy"]).data[0].embedding
```

### Q23. Moderation
OpenAI has a moderation endpoint for classifying harmful content; with Claude you typically use prompt-based classifiers, a small model, or third-party / platform safety filters. Always moderate user-generated input and model output in public-facing apps.

### Q24. Rate limits (RPM, TPM, TPD)
Limits on requests per minute, tokens per minute and sometimes tokens per day, tied to your usage tier. Handle 429 with backoff, queue requests, batch non-urgent work, cache, and request limit increases for production.

### Q25. Choosing a model (basic heuristics)
Frontier models for hard reasoning / coding / agents; mid-tier for most production workloads; small models for classification, routing and high volume. Start with the most capable model to find what's possible, then measure a cheaper model on your evaluation set. Never downgrade without measuring.

### Q26. Cost estimation
```python
def cost(in_tok, out_tok, p_in, p_out):  # prices per 1M tokens
    return (in_tok * p_in + out_tok * p_out) / 1_000_000
print(cost(2_000, 400, 4.00, 20.00))     # Claude Opus 5.5 example: $0.016 per request
```

### Q27. Counting tokens before you send
Claude: `client.messages.count_tokens(model=..., messages=..., system=...)`. OpenAI: use the provider's tokenizer library (`tiktoken`) or usage fields in responses. Don't use one vendor's tokenizer to estimate the other's: tokenizers differ (Claude's newer models use more tokens per text than older ones: re-baseline).

### Q28. Prompt caching (intro)
Providers reuse the processed prefix of repeated prompts at a discount. Claude: mark with `cache_control` (or top-level auto-caching); OpenAI: automatic for long repeated prefixes (verify thresholds). Put **static content first**, dynamic content last.

### Q29. Structured output (intro)
Instead of begging for JSON in the prompt, use schema-constrained outputs: Claude `output_config.format` (JSON Schema) or `messages.parse()` with Pydantic; OpenAI Structured Outputs (`text.format` json_schema / `responses.parse`). They guarantee syntax, not truth, so still validate values.

### Q30. Hello-world checklist
Key in env → pick model → set `max_tokens` → send messages → check `stop_reason` / status → log request ID and usage → handle errors → stream if long → never expose the key.

---

# 🔵 Part 2: Junior (1–3 years)

### Q31. Anatomy of the Claude Messages request
Required: `model`, `max_tokens`, `messages`. Common optional: `system` (string or blocks), `tools`, `tool_choice`, `thinking`, `output_config` (`effort`, `format`), `stream`, `metadata`, `stop_sequences`, `cache_control`. Response: `id`, `model`, `content[]`, `stop_reason`, `usage` (`input_tokens`, `output_tokens`, cache fields).

### Q32. Anatomy of an OpenAI Responses request
`model`, `input` (string or list of items), `instructions`, `tools`, `tool_choice`, `text.format` (structured outputs), `reasoning` (effort / summary on reasoning models), `max_output_tokens`, `previous_response_id`, `store`, `stream`, `metadata`. Response has `output` items (messages, reasoning, function calls, tool results), `output_text` helper, `usage`, `status`.

### Q33. Multi-turn conversation management
```python
class Chat:
    def __init__(self, client, model, system):
        self.c, self.model, self.system, self.msgs = client, model, system, []
    def send(self, text):
        self.msgs.append({"role": "user", "content": text})
        r = self.c.messages.create(model=self.model, max_tokens=16000, system=self.system, messages=self.msgs)
        self.msgs.append({"role": "assistant", "content": r.content})   # keep ALL blocks, not just text
        return next((b.text for b in r.content if b.type == "text"), "")
```
Append `response.content` (not only text) so tool-use, thinking and compaction blocks stay intact.

### Q34. Tool use / function calling: the loop *(Must-know)*
1. Send `tools` (name, description, JSON Schema).
2. Model returns a tool call (`tool_use` on Claude; `function_call` item on OpenAI) with arguments.
3. **Your code** executes the function.
4. Send the result back (`tool_result` / `function_call_output`) and call again.
5. Repeat until the model produces a final answer.
The model never executes anything itself (for client tools).

### Q35. Claude tool definition and loop
```python
tools = [{
    "name": "get_order_status",
    "description": "Look up the status of ONE order by id (format A####). Use only after the user gives an id.",
    "input_schema": {"type": "object",
                     "properties": {"order_id": {"type": "string", "pattern": "^A[0-9]{4}$"}},
                     "required": ["order_id"], "additionalProperties": False},
    "strict": True,
}]
messages = [{"role": "user", "content": "Where is order A1042?"}]
while True:
    r = client.messages.create(model="claude-opus-5-5", max_tokens=16000, tools=tools, messages=messages)
    if r.stop_reason != "tool_use":
        break
    messages.append({"role": "assistant", "content": r.content})
    results = [{"type": "tool_result", "tool_use_id": b.id, "content": run_tool(b.name, b.input)}
               for b in r.content if b.type == "tool_use"]
    messages.append({"role": "user", "content": results})      # ALL results in ONE user message
```

### Q36. OpenAI function calling (Responses)
```python
tools = [{"type": "function", "name": "get_order_status",
          "description": "Look up an order by id.",
          "parameters": {"type": "object", "properties": {"order_id": {"type": "string"}},
                         "required": ["order_id"], "additionalProperties": False},
          "strict": True}]
resp = oa.responses.create(model="<model-id>", input=[{"role": "user", "content": "Where is order A1042?"}], tools=tools)
for item in resp.output:
    if item.type == "function_call":
        result = run_tool(item.name, json.loads(item.arguments))
        followup_input.append({"type": "function_call_output", "call_id": item.call_id, "output": json.dumps(result)})
```
(Append the model's output items plus the outputs to `input`, then call again.)

### Q37. Parallel tool calls
A single assistant turn may contain several tool calls. Execute them (concurrently if safe) and return **all** results together: Claude: all `tool_result` blocks in a single user message; OpenAI: one `function_call_output` per `call_id`. Splitting Claude results across messages teaches the model to stop calling tools in parallel.

### Q38. Tool errors
Return the error as a result so the model can recover: Claude `{"type": "tool_result", "tool_use_id": ..., "content": "Error: order not found", "is_error": True}`; OpenAI: put the error text in `output`. Never silently drop a call.

### Q39. `tool_choice`
Claude: `auto` (default), `any`, `tool` (force a specific tool), `none`. **On Claude Opus 5.5, Sonnet 5.5, Fable 5.1 and Mythos 5.1, forced `any` / `tool` returns 400**: use `auto` plus an explicit prompt instruction, `strict: true` for schema-valid arguments, or structured outputs. OpenAI: `auto`, `required`, `none`, or a specific function.

### Q40. Strict tool schemas
Set `strict: true` (Claude: top-level on the tool; OpenAI: on the function) with `additionalProperties: false` and all fields in `required` so arguments always match the schema. Validation errors vanish, but semantic checks (authorisation, ranges, existence) are still your job.

### Q41. Tool Runner (Claude SDK helper)
```python
from anthropic import beta_tool

@beta_tool
def get_weather(location: str, unit: str = "celsius") -> str:
    """Get current weather for a location.

    Args:
        location: City and state, e.g., San Francisco, CA.
        unit: "celsius" or "fahrenheit".
    """
    return f"72°F and sunny in {location}"

runner = client.beta.messages.tool_runner(
    model="claude-opus-5-5", max_tokens=16000, tools=[get_weather],
    messages=[{"role": "user", "content": "Weather in Paris?"}],
)
for message in runner:        # the SDK runs the loop and feeds results back
    print(message)
```
Beta helper: no built-in tools; you host the functions. Not the same as the Claude Agent SDK (a separate product with built-in file/bash tools).

### Q42. Structured outputs with Pydantic (Claude)
```python
from pydantic import BaseModel
class Invoice(BaseModel):
    invoice_number: str
    total: float
    currency: str

r = client.messages.parse(
    model="claude-opus-5-5", max_tokens=16000,
    messages=[{"role": "user", "content": "Extract: Invoice INV-77, total 4,520.50 INR."}],
    output_format=Invoice,
)
inv = r.parsed_output          # validated Invoice instance
```
Raw form: `output_config={"format": {"type": "json_schema", "schema": {...}}}` and `json.loads` the text block. (The older top-level `output_format` on `create()` is deprecated in favour of `output_config`.)

### Q43. Structured outputs (OpenAI)
```python
r = oa.responses.parse(model="<model-id>", input="Extract: Invoice INV-77, total 4,520.50 INR.", text_format=Invoice)
inv = r.output_parsed
```
Or `text={"format": {"type": "json_schema", "name": "invoice", "schema": {...}, "strict": True}}`. Refusals surface as a separate refusal item you must handle.

### Q44. Extended / adaptive thinking (Claude) *(Must-know)*
Use `thinking={"type": "adaptive"}`: Claude decides when and how much to think. Depth is steered by `output_config={"effort": "low|medium|high|xhigh|max"}`. `budget_tokens` is removed (400) on current models. Notes: on **Opus 5.5 and Fable 5.1 thinking is always on** (don't send `disabled`; effort default on Opus 5.5 is `medium`); thinking text is **omitted by default**: set `display: "summarized"` if you need to show it. Thinking tokens are billed as output.
```python
r = client.messages.create(model="claude-opus-5-5", max_tokens=16000,
    thinking={"type": "adaptive", "display": "summarized"},
    output_config={"effort": "high"},
    messages=[{"role": "user", "content": "Plan a 3-step migration from MySQL to Postgres."}])
```

### Q45. Reasoning models (OpenAI)
Reasoning-focused models think before answering; control with `reasoning={"effort": "low|medium|high"}` (and optional summary). Reasoning tokens are billed as output but not returned raw. Prompts should be goal-oriented and concise; avoid forcing step-by-step chains (verify per model).

### Q46. Prompt caching with Claude
```python
r = client.messages.create(
    model="claude-opus-5-5", max_tokens=16000,
    cache_control={"type": "ephemeral"},                    # auto-cache the last cacheable block
    system=LARGE_POLICY_DOCUMENT,
    messages=[{"role": "user", "content": "Can I return an opened item?"}],
)
print(r.usage.cache_creation_input_tokens, r.usage.cache_read_input_tokens, r.usage.input_tokens)
```
Cache reads cost a fraction of normal input (≈0.1×); writes cost ≈1.25× (5-min TTL default; `"ttl": "1h"` option). Verify cache hits via `cache_read_input_tokens`. Any change early in the prefix invalidates everything after it.

### Q47. What silently breaks caching
Timestamps / UUIDs in the system prompt, unsorted JSON in tool definitions, changing the tool list, re-ordering examples, editing earlier messages. Keep the prefix byte-identical; put volatile data after the last breakpoint.

### Q48. Batch APIs (50% cheaper, async)
Both providers offer batch endpoints for non-urgent work (results within hours, ~50% discount). Claude: `client.messages.batches.create(requests=[{custom_id, params}])` → poll `processing_status == "ended"` → iterate results (**any order**, key by `custom_id`). OpenAI: upload a JSONL file, create a batch (24h window), download the output file.

### Q49. Files API
Upload a file once, reference it by `file_id` in many requests (documents, images, code-execution inputs). Claude: `client.files.upload(...)`; OpenAI: `client.files.create(file=..., purpose=...)`. Saves bandwidth and tokens-in-transit; mind retention and privacy.

### Q50. Citations
Claude: set `citations: {enabled: true}` on `document` blocks; responses include `citations` with `cited_text` and location (page / char / block). Not compatible with `output_config.format`. OpenAI file search returns annotations with file citations. Use them to build verifiable answers.

### Q51. Web search & built-in server tools
Claude server tools (`web_search_20260209`, `web_fetch_20260209`, `code_execution_20260521`, tool search) run on Anthropic's infrastructure: declare in `tools`, results return as blocks in the same response; handle `pause_turn` by continuing. OpenAI built-ins in Responses: web search, file search, code interpreter, computer use, image generation, remote MCP (verify availability per model). Tool errors can come back as HTTP 200 with an error object.

### Q52. MCP connector (Claude)
Connect to remote MCP servers directly from the API: `mcp_servers=[{"type": "url", "url": ..., "name": "docs"}]` **and** `tools=[{"type": "mcp_toolset", "mcp_server_name": "docs"}]` (beta `mcp-client-2025-11-20`). Both halves are required. Treat third-party MCP servers as untrusted code/data sources.

### Q53. Vision limits and tips
Resize large images, keep text legible (crop small regions), pass multiple images in order with labels, ask for structured output with evidence ("quote the text you read"), and verify numbers. Images cost tokens proportional to size.

### Q54. Audio and realtime (OpenAI)
Speech-to-text (Whisper / newer transcription models), text-to-speech, and the **Realtime API** (WebSocket / WebRTC) for low-latency speech-to-speech agents with barge-in. Claude doesn't offer first-party audio: pair it with an ASR / TTS provider (STT → Claude → TTS).

### Q55. Image generation (OpenAI)
Image endpoints / the Responses image-generation tool create and edit images from prompts. Claude cannot generate images (it can analyse them). Mind content policy, watermarking / provenance and licensing.

### Q56. Fine-tuning availability
OpenAI supports fine-tuning for selected models (supervised, preference, and reinforcement-style options; verify the current list). Anthropic's first-party fine-tuning availability is limited (verify; some options through Amazon Bedrock). For open models use LoRA (see `070_Fine-Tuning-LoRA-QLoRA.md`). Prefer prompting, RAG and caching first.

### Q57. Model discovery
Claude: `client.models.list()` / `client.models.retrieve(id)` returns `max_input_tokens` (context window), `max_tokens` (output cap) and `capabilities`: don't hard-code assumptions. OpenAI: `client.models.list()`. Pin exact IDs; never append date suffixes to Claude IDs (use `claude-opus-5-5` as-is).

### Q58. Metadata and user identifiers
Pass an opaque user ID (`metadata.user_id` on Claude; `user` / `safety_identifier` style fields on OpenAI: verify) to help providers detect abuse per end-user without exposing PII. Never send raw emails or names as identifiers.

### Q59. Logging what matters
Per call: timestamp, request ID, model + version, prompt template version, token usage, latency, stop reason / status, cost, tool calls, error type, end-user (hashed). Redact PII; control retention.

### Q60. Local development tips
Use a `.env` file loaded by `python-dotenv` (never committed), a thin wrapper around the SDK (central retries, logging, model names), recorded fixtures for tests, and small `max_tokens` while experimenting.

---

# 🟡 Part 3: Mid (3–5 years)

### Q61. Reliability pattern: timeouts, retries, backoff with jitter
The SDK handles basic retries; add application-level policy for: overall deadline per user request, retry only retryable errors (429, 5xx, 529, connection), exponential backoff with jitter, honour `retry-after`, cap attempts, and surface a graceful fallback. Never retry 400s blindly.

### Q62. Idempotency and duplicate side effects
Retrying a request that triggered tool side effects (send email, charge card) can duplicate them. Make tools idempotent (idempotency keys, upserts), separate "decide" from "act", and require confirmation for risky actions.

### Q63. Fallbacks and multi-provider resilience
Options: retry same model → smaller / alternate model → alternate provider → cached / rule-based answer. Keep prompts portable, normalise outputs, and test fallbacks regularly. Claude Fable 5.1 / Opus 5.5 / Sonnet 5.5 support a server-side **`fallbacks`** parameter for safety-classifier refusals (beta header required; Claude API only; use client middleware on other platforms: verify the current form in docs).

### Q64. Refusals (`stop_reason: "refusal"`)
Safety classifiers can decline a request with HTTP 200. Always check `stop_reason` before reading `content`; inspect `stop_details.category` (e.g. `cyber`, `bio`, `reasoning_extraction`); decide whether to retry on a fallback model, rephrase, or show a safe message. Don't try to evade safeguards.

### Q65. Streaming in web apps
Server-Sent Events (SSE) from your backend to the browser; the backend streams tokens from the provider and forwards them. Handle client disconnects (cancel the upstream request), proxies that buffer, partial JSON in tool-argument streams (accumulate and validate), and heartbeat comments to keep connections alive.
```python
# FastAPI SSE sketch
from fastapi.responses import StreamingResponse
@app.post("/chat")
def chat(q: Query):
    def gen():
        with client.messages.stream(model="claude-opus-5-5", max_tokens=4096,
                                    messages=[{"role": "user", "content": q.text}]) as s:
            for t in s.text_stream:
                yield f"data: {json.dumps({'t': t})}\n\n"
    return StreamingResponse(gen(), media_type="text/event-stream")
```

### Q66. Streaming with tools
Tool inputs arrive as partial JSON deltas. For Claude, set `eager_input_streaming: true` on client tools in streaming requests so large inputs stream progressively; the client must validate the final parsed input against the schema before running it (tolerant parsers can return truncated input). Check `max_tokens` / refusal stop reasons before executing tools.

### Q67. Agent loops: limits and safety
Cap iterations / tokens / wall time, log each step, require approval for write actions, sandbox code execution, scope credentials per tool, detect loops (same tool + args repeated), and return actionable error messages. See `069_AI-Agents.md`.

### Q68. Context management for long conversations
Strategies: truncate oldest turns, summarise history, keep pinned facts, retrieve relevant memories, and (Claude, beta) **server-side compaction** (`betas=["compact-2026-01-12"]` with `context_management.edits=[{"type": "compact_20260112"}]`: append the full `response.content` so compaction blocks persist). Also context editing (clear old tool results) with `clear_tool_uses_20250919`.

### Q69. Prompt caching strategy at scale
Design a stable prefix: system prompt → tool definitions (fixed order) → large reference documents → conversation. Use 1-hour TTL for infrequent-but-repeated prefixes, pre-warm caches, track hit rate (`cache_read_input_tokens`), and avoid per-request variability in the prefix. Caches are model-scoped (switching models forfeits them).

### Q70. Model routing and cascades
Route by difficulty / type / sensitivity: small model for classification and extraction, mid-tier for general tasks, frontier for hard reasoning. Escalate on low confidence or validation failure. Measure cost **per successful task**, not per call. Keep per-route evaluation sets.

### Q71. Effort tuning (Claude)
`effort` trades thoroughness vs spend: `low` for chat / classification / subagents, `medium` default on some models, `high` for coding / agentic work, `xhigh` / `max` only when measured gains justify cost. Often a frontier model at low effort beats a cascade for simplicity and cache reuse. Tune per route with real data.

### Q72. Handling long outputs
Stream, set generous `max_tokens` (Claude supports up to 128K on current models, streaming required for large values), generate in sections with an outline, validate completeness, and handle `max_tokens` stops by continuing from where it ended (with a "continue" user message; prefill is not available).

### Q73. Prefill is gone: alternatives
Assistant-prefill to force a format returns 400 on current Claude models. Use structured outputs (`output_config.format`), explicit instructions ("Return only JSON"), XML tags, or `strict` tools. For OpenAI use `text.format` schemas.

### Q74. Deterministic behaviour expectations
No API guarantees identical outputs. Reduce variance with clear prompts, structured outputs, closed label sets, validation and caching of results; don't rely on `temperature=0` (and sampling controls are unavailable on current Claude models).

### Q75. Rate-limit engineering
Client-side token bucket (RPM + TPM), request queue with priorities, concurrency limits per tenant, adaptive backoff using `retry-after` and rate-limit headers, separate keys / workspaces per workload, batch API for bulk, and capacity forecasting. Fast mode and priority tiers exist for some models (verify availability and pricing).

### Q76. Multi-tenant SaaS considerations
Tenant isolation in prompts, retrieval and caches; per-tenant quotas and cost attribution; data-residency (Claude `inference_geo` parameter on supported models; OpenAI data-residency options: verify); abuse detection; per-tenant model allow-lists; avoid cross-tenant leakage via shared caches or memory.

### Q77. Observability
Trace each LLM call as a span (OpenTelemetry): prompt version, model, tokens, latency, cost, tool calls, errors, user / tenant. Use Langfuse, LangSmith, Helicone, Phoenix, or the SDKs' OpenTelemetry instrumentation. Sample outputs for evaluation; redact PII.

### Q78. Evaluation integration
Run an offline golden set on every prompt / model / SDK change; add LLM-as-judge with calibration; track format validity, task accuracy, groundedness, latency, cost; canary new models behind flags; compare providers on **your** tasks, not leaderboards. See `072_LLM-Evaluation-and-Guardrails.md`.

### Q79. Testing LLM code
Unit-test deterministic parts (prompt rendering, parsers, tool functions); mock the SDK for logic tests; use recorded responses (VCR-style) for regression; run a small live smoke test in CI with budget limits; contract-test tool schemas.

### Q80. Provider abstraction layer
A thin internal interface (`generate(messages, tools, schema, options) -> Result`) that normalises roles, tool calls, usage, errors and streaming events across Claude / OpenAI / open models (or use LiteLLM / gateways). Don't over-abstract: provider-specific features (caching, thinking, server tools) should be reachable via typed options.

### Q81. LLM gateways
Central proxy providing auth, per-team keys and budgets, routing / fallbacks, caching, rate limiting, logging / guardrails and provider swaps (LiteLLM, Portkey, Cloudflare AI Gateway, cloud-native gateways). Adds a hop and a critical dependency: design for HA.

### Q82. Claude on AWS Bedrock, Google Vertex AI, Microsoft Foundry
Same models through cloud providers for enterprise procurement, IAM and data residency. Use the dedicated client classes (e.g., `AnthropicBedrockMantle(aws_region=...)`, `AnthropicVertex(project_id=..., region=...)`, `AnthropicFoundry(...)`), not the first-party client with a URL override. Model IDs and feature availability (beta features, server tools, batches, Files API) differ per platform: check the availability matrix before designing.

### Q83. OpenAI on Azure
Azure OpenAI Service offers OpenAI models with Azure networking / compliance and deployment names instead of raw model IDs; API versions and feature timing can lag the OpenAI platform (verify). Use the `AzureOpenAI` client.

### Q84. Token and cost governance
Budgets per team / feature, hard `max_tokens` caps, per-user quotas, alerts on spend anomalies, dashboards for tokens per feature, and review of top costly prompts. Watch retries, agent loops and long contexts as hidden multipliers.

### Q85. Latency engineering
Breakdown: network, queueing, prefill (grows with prompt length), decode (tokens × per-token time), tool round-trips. Optimise: stream, shorten prompts, cache prefixes, smaller / faster model for simple steps, parallelise independent calls, reduce output length, speculative / fast modes where offered, and co-locate with provider regions.

### Q86. Handling PII and compliance
Minimise and redact PII before sending, understand provider retention / training policies, use zero-data-retention options where available (some Claude models require 30-day retention: ZDR orgs get 400s: verify), encrypt logs, restrict access, implement deletion workflows, and review legal duties (GDPR, DPDP).

### Q87. Securing LLM applications
Treat all model input / output as untrusted: separate instructions from data, least-privilege tools, scoped credentials, output validation / escaping before rendering or executing, allow-lists for URLs and commands, rate limits, secrets in vaults, red-teaming, and OWASP LLM Top 10 mapping.

### Q88. Prompt injection via tool results and retrieval
Indirect injection arrives in web pages, emails, PDFs and tool outputs. Mitigate: delimiters + "data not instructions", quarantined extraction step with constrained output, confirmation gates for sensitive actions, domain allow-lists, and monitoring. No prompt-only fix is complete.

### Q89. Webhooks, async jobs and queues
For long tasks use background workers (Celery / queues), store job state, push updates via SSE / WebSocket / webhooks, make workers idempotent, and use Batches for bulk. Don't hold HTTP requests open for minutes.

### Q90. Versioning and deprecations
Pin model IDs; track provider deprecation schedules; run migration tests (prompts, schemas, parameters such as removed sampling controls); keep a compatibility layer for removed params; read migration guides when upgrading SDKs or API versions (e.g., Anthropic SDK 0.x → 1.x, API version `2026-10-21`).

---

# 🟠 Part 4: Senior (5–7 years)

### Q91. Designing a production LLM service *(Must-know)*
Client → API gateway (auth, quotas) → orchestrator (prompt assembly, retrieval, routing) → provider adapters (Claude / OpenAI / open) → validators (schema, guardrails) → response streaming → logging / tracing / evaluation sampling → cost accounting. Add caches (exact + semantic), queues for async work, feature flags for model rollout, and runbooks for provider outages.

### Q92. Comparing providers on your workload
Build a golden set (real queries + edge cases), run identical tasks across candidate models with provider-appropriate prompts, grade with rubrics + calibrated judges + human review, and compare quality, latency (p50 / p95), cost per task, tool-use reliability, structured-output validity, refusal rate and operational factors (limits, regions, support). Re-run quarterly.

### Q93. Managed Agents vs API tool loops (Claude)
Messages API + tool runner/manual loop: you host the loop and tool execution (maximum control). **Managed Agents (beta)**: Anthropic runs the agent loop and hosts a per-session container (bash, files, code execution), with persisted, versioned agent configs, SSE event streams, Skills / MCP, scheduled deployments and outcomes. Choose managed when you want hosted workspace and long-running sessions; otherwise API + tools. The **Claude Agent SDK** is a separate library (Claude Code harness, you host it).

### Q94. OpenAI Agents SDK / Responses-based agents
OpenAI's Agents SDK provides agent, handoff, guardrail and tracing abstractions on top of Responses (verify current state). Compare with LangGraph / custom loops; evaluate tracing, handoffs, state persistence and lock-in.

### Q95. Cost optimisation playbook
Order of levers: (1) free wins: prompt caching, trimming input tokens, concise outputs, batching offline work, removing loop waste; (2) model choice and effort per route measured on evals; (3) architecture: retrieval instead of long prompts, cascades, semantic caching, distillation. Judge by cost per completed task and keep quality gates.

### Q96. Semantic caching and its risks
Cache answers keyed by embedding similarity; high threshold (e.g. ≥0.92), per-tenant and per-permission scope, TTLs, invalidation on content updates, and never cache personalised or sensitive responses. Evaluate false-hit rate.

### Q97. Large-document and batch pipelines
Chunk, parallelise with bounded concurrency, use Batches for cost, store intermediate outputs (idempotent job IDs), validate each item, dead-letter failures, sample for QA, track per-item cost, and make the pipeline resumable.

### Q98. Handling provider incidents
Health checks and circuit breakers per provider / model, automatic failover with prompt variants, degraded modes (search-only, cached FAQ), status-page monitoring, communication templates, and post-incident review. Keep warm credentials and quotas on the backup provider.

### Q99. Data governance with third-party LLMs
Data classification determines what may leave your boundary; contracts (DPA, retention, training opt-out); private connectivity (PrivateLink / VPC endpoints) for cloud-hosted Claude / OpenAI; regional processing; audit logging of prompts / outputs; and a policy for employees' use of consumer tools.

### Q100. Response schema design
Keep schemas small and flat, use enums for closed sets, add descriptions to fields, mark optional fields nullable, avoid unsupported JSON Schema features (check provider docs for limits), include an `unknown` escape hatch, and version schemas.

### Q101. Tool design as API design
Names and descriptions are prompts. Prefer few, well-scoped tools with typed parameters, helpful errors, pagination and limits; avoid exposing raw SQL / shell when a narrower tool works; return concise structured results (token budget!); add dry-run modes and audit logs. Use tool search / deferred loading when you have many tools.

### Q102. Parallel and programmatic tool use
Run independent tool calls concurrently. Claude supports programmatic tool calling (model writes code in the code-execution sandbox that calls your tools) for complex orchestrations (opt-in via `allowed_callers`; incompatible with `strict` and forced `tool_choice`). Use when many calls / data reduction would otherwise bloat context.

### Q103. Memory and personalization
Claude's memory tool (`memory_20250818`, client-implemented storage) and Managed Agents memory stores let agents persist notes; for custom apps, store user facts in your DB with consent, retrieve selectively, allow correction / deletion, and prevent cross-user leakage.

### Q104. Multimodal pipelines
Preprocess (resize / crop / OCR fallback), provide labelled images, request evidence-bearing structured output, validate with business rules, and keep humans in the loop for low confidence. Combine OCR + vision models for scans; check cost per page.

### Q105. Evaluating agents
Score trajectories (tool choice, argument quality, step count, recovery), final outcomes, cost, latency and safety violations; use sandboxed environments and replayable traces; run adversarial scenarios (prompt injection, tool failures). See `069_AI-Agents.md`.

### Q106. Thinking blocks and multi-turn correctness (Claude)
Thinking blocks must be passed back **unchanged** in later turns and are bound to the model and conversation (preserved thinking). Editing earlier history (changing system prompt, tools, earlier messages) can invalidate blocks and, for new accounts on some models, return a 400. Keep harnesses **append-only**; use mid-conversation system messages and server-side compaction instead of rewriting history; if needed strip the offending blocks and retry once.

### Q107. API version management
Anthropic uses the `anthropic-version` header (SDKs set sensible defaults); version `2026-10-21` removes `temperature` / `top_p` / `top_k` entirely and adds validation changes. Upgrade SDKs deliberately, remove deprecated params first (changes work on the old version too), test, then switch. OpenAI versions via SDK / dated endpoints (verify).

### Q108. Region and latency strategy
Use provider regions / geo options to reduce latency and meet residency; multi-region deployments for resilience; measure from your servers; avoid cross-continent round-trips for chat UX; account for capacity differences by region.

### Q109. Contract and procurement concerns
Pricing models (usage vs committed), SLAs, rate-limit guarantees (priority tiers), support, security attestations (SOC 2, ISO 27001), indemnification, data processing terms, model deprecation notice periods. Negotiate commitments only after load tests and cost modelling.

### Q110. Building developer experience around LLM APIs
Typed wrappers, prompt registries, local mocks, CLI tools for running evals, templates for new features, documentation of limits and cost, and linters that catch removed params / hard-coded keys. Fast feedback loops matter more than clever abstractions.

### Q111. Handling non-English and Indic use cases
Test tokenisation cost and quality per language; evaluate code-mixed input (Hinglish); choose models with strong multilingual performance; keep prompts in English with explicit output-language instructions if that tests better; use native reviewers; consider speech pipelines for voice.

### Q112. Failure taxonomy
Provider errors (429 / 5xx), validation errors (400), semantic failures (hallucination, wrong tool), safety stops (refusal), format failures, truncation (`max_tokens`), tool failures, timeouts, and downstream failures. Track each category with alerts and playbooks.

### Q113. Safe prompt and config rollout
Treat prompts like code: PR review, evals in CI, staged rollout (shadow → canary → ramp), kill switch, versioned in a registry, linked to model version. Roll back quickly on quality or cost regression.

### Q114. Legal and ethical review
Document intended use, risks, human oversight, disclosure to users, content provenance, IP considerations, and acceptable use policies of providers. High-stakes domains need additional controls and sometimes regulatory approval.

### Q115. Knowing when not to call an LLM
Deterministic logic, simple lookups, exact calculations, very high-volume trivial tasks, or strict latency / privacy constraints may be better served by code, search, small models or classical ML. LLMs add cost, latency and variance.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q116. Enterprise LLM platform strategy
Central platform team provides: model gateway (multi-provider, policy enforcement), prompt and tool registries, retrieval services with ACLs, evaluation platform, observability, cost allocation, security / compliance controls, and golden-path SDKs. Product teams build on these; exceptions go through review.

### Q117. Multi-provider strategy
Use at least two providers or one provider plus an open-weight fallback for resilience and bargaining power; maintain portable prompts, schemas and evaluation suites; isolate provider-specific features behind adapters; route by capability / cost / data sensitivity. Revisit as models and prices change rapidly.

### Q118. Governance and risk tiers
Tier use cases (internal drafting, customer-facing, decision support, autonomous actions). Higher tiers require red-team results, bias testing, human oversight, audit logging, stricter model / provider restrictions and legal sign-off. Automate controls in CI / CD and the gateway.

### Q119. FinOps for LLMs
Tag spend by product / team; unit economics (cost per resolved ticket, per document); budgets and alerts; negotiated commitments; optimisation backlog (caching, routing, prompt trimming); periodic model re-evaluation as cheaper / better models appear; avoid over-provisioned reasoning effort.

### Q120. Reference architecture for agentic systems
Orchestrator with state store, tool gateway with permission tiers and approvals, sandboxed execution, memory / retrieval services, evaluation and replay, tracing, rate and budget governors, human-in-the-loop UI, and incident controls (kill switches, rollback). Prefer simple workflows over autonomous agents until evaluation proves value.

### Q121. Security architecture
Zero-trust for model output; identity propagation (the agent acts as the user, with the user's permissions); secrets isolation; egress controls; signed / reviewed third-party tools (MCP servers); data-loss prevention on prompts and outputs; continuous red-teaming; supply-chain controls for SDKs and dependencies.

### Q122. Roadmap and change management
Phase adoption: pilot → platform → scale. Train developers on API fundamentals (stateless chats, tokens, caching, tools, evals), publish internal playbooks, run office hours, track adoption and quality metrics, and plan for model / API migration waves (breaking changes happen: e.g., removed sampling parameters, thinking changes).

### Q123. Vendor risk and exit strategy
Assess financial / operational stability, deprecation policy, data portability (prompts, evals, fine-tunes), and replacement cost. Keep evaluation suites and abstractions that make switching a weeks-not-quarters effort.

### Q124. Sustainability
Measure energy / carbon per request where data exists; reduce tokens, cache, use smaller models, schedule batch jobs, avoid unnecessary re-generation, and report with cost.

### Q125. Communicating with executives
Frame LLM APIs as variable-cost, fast-evolving dependencies: show unit economics, quality evidence, risk controls, resilience plan and roadmap. Be explicit about uncertainty (model changes, regulation) and the staged investment approach.

---

# 💻 Part 6: Hands-On Tasks & Code

### Task 1. Robust Claude wrapper with typed error handling, logging and usage tracking
```python
import time, random, logging, anthropic

log = logging.getLogger("llm")
client = anthropic.Anthropic(max_retries=2, timeout=60.0)

def ask(messages, system=None, model="claude-opus-5-5", max_tokens=16000, attempts=4, **kw):
    for i in range(attempts):
        try:
            r = client.messages.create(model=model, max_tokens=max_tokens, system=system, messages=messages, **kw)
            log.info("req=%s model=%s in=%s out=%s stop=%s", r._request_id, r.model,
                     r.usage.input_tokens, r.usage.output_tokens, r.stop_reason)
            if r.stop_reason == "refusal":
                raise RuntimeError(f"refused: {getattr(r.stop_details, 'category', None)}")
            if r.stop_reason == "max_tokens":
                log.warning("truncated output")
            return r
        except (anthropic.RateLimitError, anthropic.APIConnectionError) as e:
            delay = min(2 ** i + random.random(), 30)
            log.warning("retryable %s; sleeping %.1fs", type(e).__name__, delay); time.sleep(delay)
        except anthropic.APIStatusError as e:
            if e.status_code >= 500: time.sleep(2 ** i); continue
            raise                                          # 4xx: fix the request
    raise RuntimeError("exhausted retries")
```

### Task 2. Structured extraction (Claude) with Pydantic parse
```python
from pydantic import BaseModel, Field
from typing import Optional

class Invoice(BaseModel):
    invoice_number: str
    date: str = Field(description="ISO-8601 date")
    total: float
    currency: str = Field(description="ISO-4217 code")
    vendor: Optional[str] = None

def extract_invoice(text: str) -> Invoice:
    r = client.messages.parse(
        model="claude-opus-5-5", max_tokens=16000,
        system="Extract invoice fields. Use null for unknown optional fields; never invent values.",
        messages=[{"role": "user", "content": f"<invoice>\n{text}\n</invoice>"}],
        output_format=Invoice,
    )
    return r.parsed_output
```

### Task 3. Same extraction with OpenAI Structured Outputs
```python
from openai import OpenAI
oa = OpenAI()
r = oa.responses.parse(
    model="<model-id>",
    instructions="Extract invoice fields. Use null for unknown optional fields; never invent values.",
    input=f"<invoice>\n{text}\n</invoice>",
    text_format=Invoice,
)
invoice = r.output_parsed
```

### Task 4. Tool-calling loop with iteration cap and parallel results (Claude)
```python
import json

def run_agent(user_text, tools, registry, max_steps=8):
    messages = [{"role": "user", "content": user_text}]
    for step in range(max_steps):
        r = client.messages.create(model="claude-opus-5-5", max_tokens=16000, tools=tools, messages=messages)
        if r.stop_reason == "end_turn":
            return next((b.text for b in r.content if b.type == "text"), "")
        if r.stop_reason == "pause_turn":                       # server tool paused: resume the turn
            messages.append({"role": "assistant", "content": r.content}); continue
        if r.stop_reason != "tool_use":
            raise RuntimeError(f"unexpected stop_reason {r.stop_reason}")
        messages.append({"role": "assistant", "content": r.content})
        results = []
        for b in (x for x in r.content if x.type == "tool_use"):
            try:
                out, err = json.dumps(registry[b.name](**b.input)), False
            except Exception as e:
                out, err = f"Error: {e}", True
            results.append({"type": "tool_result", "tool_use_id": b.id, "content": out, "is_error": err})
        messages.append({"role": "user", "content": results})
    return "Stopped: step limit reached."
```

### Task 5. Prompt caching with a large reference document and hit verification
```python
POLICY = open("returns_policy.md").read()          # large, stable text

def answer(q: str):
    r = client.messages.create(
        model="claude-opus-5-5", max_tokens=4096,
        system=[{"type": "text", "text": POLICY, "cache_control": {"type": "ephemeral", "ttl": "1h"}}],
        messages=[{"role": "user", "content": q}],
    )
    u = r.usage
    print(f"cache_write={u.cache_creation_input_tokens} cache_read={u.cache_read_input_tokens} fresh_in={u.input_tokens}")
    return r
answer("Can I return a used item?"); answer("How long do refunds take?")   # second call should show cache_read > 0
```

### Task 6. Message Batches for bulk classification
```python
from anthropic.types.message_create_params import MessageCreateParamsNonStreaming
from anthropic.types.messages.batch_create_params import Request
import time

reqs = [Request(custom_id=f"t{i}", params=MessageCreateParamsNonStreaming(
            model="claude-haiku-5-5", max_tokens=64,
            messages=[{"role": "user", "content": f"Label as billing/delivery/technical/other. Return only the label.\n\n{t}"}]))
        for i, t in enumerate(tickets)]
batch = client.messages.batches.create(requests=reqs)
while client.messages.batches.retrieve(batch.id).processing_status != "ended":
    time.sleep(30)
labels = {}
for res in client.messages.batches.results(batch.id):          # any order: key by custom_id
    if res.result.type == "succeeded":
        labels[res.custom_id] = next(b.text for b in res.result.message.content if b.type == "text").strip()
```

### Task 7. Streaming endpoint with cancellation (FastAPI + SSE)
```python
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
import json
app = FastAPI()

@app.post("/stream")
async def stream_chat(req: Request, body: dict):
    async def gen():
        async with async_client.messages.stream(model="claude-opus-5-5", max_tokens=8000,
                messages=[{"role": "user", "content": body["q"]}]) as s:
            async for text in s.text_stream:
                if await req.is_disconnected():              # stop paying for abandoned requests
                    break
                yield f"data: {json.dumps({'t': text})}\n\n"
        yield "data: [DONE]\n\n"
    return StreamingResponse(gen(), media_type="text/event-stream")
```
(`async_client = anthropic.AsyncAnthropic()`.)

### Task 8. Vision + PDF question answering with citations (Claude)
```python
import base64
pdf = base64.standard_b64encode(open("contract.pdf", "rb").read()).decode()
r = client.messages.create(
    model="claude-opus-5-5", max_tokens=16000,
    messages=[{"role": "user", "content": [
        {"type": "document", "source": {"type": "base64", "media_type": "application/pdf", "data": pdf},
         "citations": {"enabled": True}},
        {"type": "text", "text": "What is the termination notice period? Cite the clause."}]}],
)
for b in r.content:
    if b.type == "text":
        print(b.text, [c.cited_text for c in (b.citations or [])])
```

### Task 9. Embeddings + cosine search (OpenAI embeddings with a Claude answer step)
```python
import numpy as np
def embed(texts):
    out = oa.embeddings.create(model="text-embedding-3-small", input=texts)
    v = np.array([d.embedding for d in out.data], dtype="float32")
    return v / np.linalg.norm(v, axis=1, keepdims=True)

docs = ["Refunds are processed in 7 days.", "Reset password under Settings > Security.", "We ship across India."]
D = embed(docs)
def rag(q, k=2):
    ctx = [docs[i] for i in np.argsort(-(D @ embed([q]).T).ravel())[:k]]
    prompt = "Answer ONLY from the context; otherwise say you don't know.\n\n" + "\n".join(f"- {c}" for c in ctx) + f"\n\nQuestion: {q}"
    r = client.messages.create(model="claude-sonnet-5-5", max_tokens=1024, messages=[{"role": "user", "content": prompt}])
    return next(b.text for b in r.content if b.type == "text")
```

### Task 10. Provider-agnostic interface with two adapters
```python
from dataclasses import dataclass
from typing import Protocol

@dataclass
class LLMResult:
    text: str; input_tokens: int; output_tokens: int; request_id: str | None

class LLM(Protocol):
    def generate(self, system: str, user: str, max_tokens: int = 2048) -> LLMResult: ...

class ClaudeLLM:
    def __init__(self, model="claude-sonnet-5-5"): self.m, self.c = model, anthropic.Anthropic()
    def generate(self, system, user, max_tokens=2048):
        r = self.c.messages.create(model=self.m, max_tokens=max_tokens, system=system, messages=[{"role": "user", "content": user}])
        return LLMResult(next(b.text for b in r.content if b.type == "text"), r.usage.input_tokens, r.usage.output_tokens, r._request_id)

class OpenAILLM:
    def __init__(self, model="<model-id>"): self.m, self.c = model, OpenAI()
    def generate(self, system, user, max_tokens=2048):
        r = self.c.responses.create(model=self.m, instructions=system, input=user, max_output_tokens=max_tokens)
        return LLMResult(r.output_text, r.usage.input_tokens, r.usage.output_tokens, getattr(r, "id", None))
```

### Task 11. Pre-flight token and cost estimate (Claude)
```python
def estimate(messages, system, price_in_per_m=4.00):
    n = client.messages.count_tokens(model="claude-opus-5-5", messages=messages, system=system).input_tokens
    return n, n * price_in_per_m / 1_000_000
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. `400 invalid_request_error: temperature is not supported` (Claude)
Sampling parameters were removed on current Claude models and API version `2026-10-21`. Delete `temperature` / `top_p` / `top_k`; steer with prompt wording and `output_config.effort`.

### D2. `400` about `thinking.type.disabled` / `budget_tokens`
Thinking can't be disabled on Opus 5.5 / Fable 5.1 and `budget_tokens` is removed on current models. Omit `thinking` (or use `{"type": "adaptive"}`) and lower `effort` for cheaper, faster replies.

### D3. `400 tool_choice: type "tool" and "any" are not supported`
Forced tool use is rejected on some models. Use `{"type": "auto"}`, name the tool in the instruction, add `strict: true`, or use structured outputs when the forced call only existed to get JSON.

### D4. `400` when ending `messages` with an assistant turn (prefill)
Prefill is removed on current Claude models. Use structured outputs or explicit instructions; end `messages` with a user turn.

### D5. Output cut off mid-sentence
`stop_reason: "max_tokens"` (Claude) or an incomplete status (OpenAI). Raise the cap (stream for large values), request concise output, or continue in a follow-up turn.

### D6. Intermittent `429` errors
Rate limits (RPM / TPM). Add client-side throttling, queue, backoff honouring `retry-after`, batch bulk jobs, spread across workspaces / keys per workload, and request higher limits.

### D7. JSON parsing fails sometimes
Model emitted commentary or markdown fences. Use structured outputs / strict tools, validate with Pydantic, retry with the validation error fed back, and never `eval` model output.

### D8. Tool results ignored or model stops calling tools in parallel
Results split across several user messages, or poor tool descriptions. Send all `tool_result` blocks in one user message; improve names / descriptions; ensure IDs match the `tool_use` blocks.

### D9. Cache hit rate is zero
Prefix not stable (timestamps, UUIDs, unsorted JSON, changing tools), prefix below the minimum cacheable length, or model switching. Audit prefix bytes, move volatile content last, and check `cache_read_input_tokens`.

### D10. Latency spikes
Large prompts (prefill), long outputs, sequential tool calls, cold caches, high effort. Stream, cache, parallelise, shorten, lower effort or use a smaller model for simple steps.

### D11. Costs jumped after a deploy
Longer prompts (new retrieval settings), retries, agent loops, wrong model, disabled caching, higher effort. Compare token metrics by prompt version; add budgets and anomaly alerts.

### D12. `401` / `403` errors in production only
Missing environment variable, wrong workspace key, expired credentials, or both `ANTHROPIC_API_KEY` and `ANTHROPIC_AUTH_TOKEN` set (both headers sent). Check secret injection and the credential source.

### D13. `404 not_found_error` for a valid-looking model
Typo (`claude-sonnet-4.6` vs `-4-6`), retired model, or a model not available to your organisation / platform. Use exact IDs; list models with `client.models.list()`.

### D14. Stream disconnects behind a proxy
Proxy buffering or idle timeouts. Disable buffering for SSE, send heartbeats, use sticky connections, and handle reconnects gracefully.

### D15. Answers differ between Claude and OpenAI for the same prompt
Different training, instruction-following styles and formatting defaults. Tune prompts per provider on your evaluation set; use structured outputs to normalise formats; don't assume portability.

---

# 🧩 Part 8: Tricky Questions

### T1. Are LLM API calls stateful?
No. Every call is independent; you resend context (or use an explicit server-side feature such as OpenAI's stored responses).

### T2. Does `temperature=0` give deterministic outputs?
Not guaranteed (hardware, batching, model updates), and on current Claude models you can't send it at all.

### T3. Is the system prompt secret and secure?
No. It can be extracted or overridden; don't put secrets or authorisation logic in it.

### T4. Does Claude offer an embeddings endpoint?
No first-party embeddings; use Voyage, OpenAI, Cohere or open-source embedding models.

### T5. Are output tokens and input tokens priced the same?
No; output tokens usually cost several times more. Thinking / reasoning tokens are billed as output.

### T6. Can I trust `stop_reason == "end_turn"` to mean the answer is correct?
No. It only means the model chose to stop. Validate content, check refusal / truncation, and verify claims.

### T7. Does streaming reduce total cost?
No; it improves perceived latency and avoids timeouts. Cost depends on tokens.

### T8. Is the Tool Runner the same as the Claude Agent SDK?
No. Tool Runner is an API-SDK helper that loops over **your** tools. The Agent SDK is a separate library with built-in tools (files, bash, search) and the Claude Code harness. Neither is managed hosting; Managed Agents is.

### T9. Does `strict: true` make tool calls always happen?
No. It guarantees arguments match the schema **if** a call happens. Whether a tool is called depends on the model and prompt (`auto`).

### T10. If a request returns HTTP 200, did it succeed?
Not necessarily: a Claude response can have `stop_reason: "refusal"` or `max_tokens`; server-tool errors can be embedded in 200 responses; OpenAI responses can be `incomplete` or contain refusals.

### T11. Is retrying always safe?
Not when tool calls cause side effects. Use idempotency keys and approval gates.

### T12. Are cache reads free?
No; they're discounted (about 10% of base input on Claude), and cache writes cost extra (about 1.25× for the 5-minute TTL). Savings come from reuse.

### T13. Can I mix `output_config.format` with citations?
Not on Claude: citations are incompatible with structured output formatting (400).

### T14. Is switching between models mid-conversation free?
No. Caches are model-scoped and thinking blocks may not transfer. Plan model changes at conversation boundaries when possible.

### T15. Are "open" parameters universal across providers?
No. Parameter names, support and semantics differ (`max_tokens` vs `max_output_tokens`, effort controls, sampling controls). Abstract carefully and test.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- APIs are stateless: resend history.
- Claude: `client.messages.create(model, max_tokens, messages)`.
- OpenAI: `client.responses.create(model, input, instructions)`.
- Claude `max_tokens` is required.
- `response.content` is a list of blocks.
- Check `stop_reason`: `end_turn`, `max_tokens`, `tool_use`, `pause_turn`, `refusal`.
- Tool results: all in one user message.
- `strict: true` → schema-valid args.
- Structured outputs: `output_config.format` / `messages.parse`; OpenAI `text.format`.
- Adaptive thinking + `effort`; no `budget_tokens`.
- No sampling params on current Claude models.
- No assistant prefill on current Claude models.
- Stream long outputs; get final message helper.
- Cache: static prefix first; verify `cache_read_input_tokens`.
- Batch = async, ~50% cheaper.
- 429/5xx/529 retry with backoff; 400 don't.
- Log request IDs and usage.
- No Claude embeddings; no Claude image generation.
- Keys in env/secret manager, never in the client.
- Pin model IDs; run evals on upgrades.
- Cost per completed task beats cost per call.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about an application you built on an LLM API
Use STAR: problem and metric → provider/model choice (with evaluation evidence) → architecture (prompt assembly, tools, retrieval, schemas, streaming) → reliability (retries, fallbacks, idempotency) → cost/latency work (caching, routing, batching) → monitoring and evaluation → impact. Example: "Invoice extraction service: Claude with strict JSON schema + validation rules; field accuracy 71% → 95%; prompt caching and Haiku routing cut cost 52%; weekly regression suite caught a model-update drift."

### P2. A production incident involving an LLM provider
Describe detection (error-rate / latency alerts), mitigation (circuit breaker, fallback model/provider, cached answers), root cause (rate limits / provider outage / removed parameter after an upgrade), fix and prevention (health checks, tests, migration checklist).

### P3. How did you choose between OpenAI and Claude (or others)?
Built a golden set; ran both providers with tuned prompts; compared quality, tool reliability, structured-output validity, refusals, latency, cost per task and operational constraints (regions, compliance); chose primary + fallback; set a re-evaluation cadence.

### P4. How did you control cost?
Measured tokens per feature; applied caching, trimmed prompts, routed simple tasks to small models, batched offline work, capped outputs and loops; reported cost per successful task and saved X%.

### P5. How did you secure the integration?
Secrets management, backend-only calls, least-privilege tools, injection defences, output validation, PII redaction, rate limits per user, audit logs, red-team tests.

### P6. How do you handle breaking changes in provider APIs?
Pin versions, subscribe to changelogs, keep a compatibility layer, run evaluation and contract tests in CI, migrate behind flags, and document the migration (e.g., removed sampling parameters and prefill).

### P7. How do you onboard teammates to LLM APIs?
Starter repo with wrapper, logging, tests and evals; docs for tokens / caching / streaming / error handling; code-review checklist; cost dashboard; sandbox budget.

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- Fundamentals: stateless chat, tokens, context windows, pricing, rate limits, auth, key management.
- OpenAI: Responses vs Chat Completions, structured outputs, function calling, built-in tools, reasoning models, embeddings, moderation, images, audio, realtime, batch, files, fine-tuning, Agents SDK.
- Claude: Messages API, content blocks, stop reasons, system prompts, vision / PDFs / Files API / citations, adaptive thinking and effort, tool use (strict, runner, parallel, programmatic), structured outputs, streaming, prompt caching, token counting, batches, server tools, compaction / context editing, MCP connector, memory tool, Managed Agents, platform clients (Bedrock / Vertex / Foundry).
- Reliability: retries, timeouts, idempotency, fallbacks, circuit breakers, refusals, queues, SSE streaming.
- Cost & performance: caching, batching, routing, effort tuning, latency breakdown, token governance.
- Security & compliance: secrets, injection defences, PII, retention, regional processing, OWASP LLM Top 10.
- Operations: observability, evaluation, testing, versioning / deprecations, gateways, multi-provider abstraction.

## Mixed topics
- Tool loops + parallel results + idempotency + approval gates.
- Structured outputs + validation + retries + cost control.
- Prompt caching + stable prefixes + model scoping.
- Streaming + proxies + cancellation + SSE.
- Provider fallback + prompt portability + evaluation.
- API version / parameter removals + migration testing.

---

# 🔬 Part 12: Internals

### What a Messages request looks like on the wire
`POST /v1/messages` with headers `x-api-key`, `anthropic-version`, `content-type: application/json` (plus `anthropic-beta` for beta features). Body: `model`, `max_tokens`, `messages`, optional `system`, `tools`, `thinking`, `output_config`, etc. Response JSON includes `content[]`, `stop_reason`, `usage`. With `stream: true` the server sends SSE events: `message_start`, `content_block_start`, `content_block_delta`, `content_block_stop`, `message_delta`, `message_stop`.

### Streaming events and tool inputs
Text arrives as `text_delta`; tool inputs as `input_json_delta` fragments that must be concatenated and parsed after `content_block_stop`; thinking as `thinking_delta`. The SDK's `stream.get_final_message()` assembles the full message.

### OpenAI Responses object model
A response contains an ordered list of **output items** (message, reasoning, function_call, built-in tool calls). Input items mirror this (including `function_call_output`). `previous_response_id` links stored state server-side; `store=False` avoids retention (verify defaults).

### How tool calling works inside the model
Tool schemas are rendered into the prompt; the model is trained to emit structured tool-call tokens; the runtime parses them into `tool_use` / `function_call` objects. With `strict`, constrained decoding forces valid JSON for the schema. Descriptions are prompt text that materially affects selection.

### Prompt caching mechanics
Providers hash the token prefix (in order: tools → system → messages) and store processed key/value state. A later request with an identical prefix skips recomputation; any earlier-token difference invalidates the rest. Minimum lengths and TTLs apply (Claude: 5 minutes default, 1 hour optional).

### Adaptive thinking
The model decides per request whether to produce reasoning tokens and how many, guided by `effort`. Reasoning is billed as output; the raw chain of thought isn't exposed, only summaries (if `display: "summarized"`) or empty text (default omitted). Thinking blocks are signed and bound to the model / conversation.

### Rate limiting
Token-bucket style limits per organisation / workspace / model class; response headers expose limits and remaining quota; 429 includes `retry-after`. Cached input tokens may count differently toward TPM (verify).

### Batches
Requests are queued and processed asynchronously with spare capacity at a discount; each item succeeds / errors independently; results are retrievable for a limited time and are unordered.

### Structured output enforcement
Schemas are compiled into grammars / constraints applied during decoding, so only tokens valid under the schema are sampled. Complex or recursive schemas may be restricted (check docs), and constrained decoding can't guarantee semantic correctness.

### SDK internals
Typed Pydantic models for requests and responses; `with_raw_response` for headers; auto-pagination for list endpoints; retry logic with exponential backoff and jitter; HTTP backend `httpx2` in Anthropic SDK 1.x (use `DefaultHttpxClient` for custom proxies).

---

# 📊 Part 13: Reference Tables

### Claude models (cached 2026-10-06; verify)
| Model | ID | Context | Input / Output $ per 1M |
|---|---|---|---|
| Fable 5.1 | `claude-fable-5-1` | 1M | 10 / 50 |
| Opus 5.5 | `claude-opus-5-5` | 1M | 4 / 20 |
| Sonnet 5.5 | `claude-sonnet-5-5` | 1M | 2 / 10 |
| Haiku 5.5 | `claude-haiku-5-5` | 1M | 0.10 / 0.50 (higher beyond 100K prompt) |

### Claude vs OpenAI parameter mapping
| Concept | Claude | OpenAI (Responses) |
|---|---|---|
| Output cap | `max_tokens` (required) | `max_output_tokens` |
| System instructions | `system` | `instructions` / developer message |
| Reasoning depth | `thinking` adaptive + `output_config.effort` | `reasoning.effort` |
| Structured output | `output_config.format` / `messages.parse` | `text.format` / `responses.parse` |
| Tool definition | `{name, description, input_schema, strict}` | `{type: "function", name, parameters, strict}` |
| Tool call item | `tool_use` block | `function_call` item |
| Tool result | `tool_result` block (user message) | `function_call_output` item |
| Streaming | `messages.stream` / `stream=True` | `responses.stream` / `stream=True` |
| Batch | `messages.batches` | `batches` (JSONL file) |
| Token counting | `messages.count_tokens` | `tiktoken` / usage fields |
| Stored state | Client-managed (or Managed Agents) | `previous_response_id`, `store` |

### Stop reasons (Claude) → action
| `stop_reason` | Action |
|---|---|
| `end_turn` | Use the answer |
| `max_tokens` | Raise cap / stream / continue |
| `tool_use` | Execute tools, send results |
| `pause_turn` | Resume the turn |
| `stop_sequence` | Handle custom stop |
| `refusal` | Show safe message / fallback; inspect `stop_details` |

### Error handling matrix
| Error | Retry? | Typical fix |
|---|---|---|
| 400 | No | Fix request (removed params, schema, history) |
| 401/403 | No | Credentials / permissions |
| 404 | No | Model ID / availability |
| 413 | No | Shrink input |
| 429 | Yes | Backoff, queue, limits |
| 5xx / 529 | Yes | Backoff, fallback |
| Connection / timeout | Yes | Retry, check network |

### Cost levers
| Lever | Typical effect |
|---|---|
| Prompt caching | Large cut on repeated input |
| Batch API | ~50% off async work |
| Model routing | Big cut on easy tasks |
| Lower effort | Fewer thinking tokens |
| Shorter prompts / outputs | Linear savings |
| Retrieval over long context | Fewer input tokens |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
Request with 3,000 input tokens and 500 output tokens on Claude Opus 5.5 ($4 / $20 per 1M):
`3000×4/1e6 + 500×20/1e6` = 0.012 + 0.010 = **$0.022**.

### O2.
With the same prompt, 2,500 of the 3,000 input tokens read from cache at 10% of base price: input cost = `500×4/1e6 + 2500×0.4/1e6` = 0.002 + 0.001 = **$0.003** (vs $0.012), so total ≈ **$0.013**.

### O3.
```python
r = client.messages.create(model="claude-opus-5-5", max_tokens=5, messages=[{"role": "user", "content": "Write a poem"}])
print(r.stop_reason)
```
Almost certainly **`max_tokens`** (output truncated).

### O4.
```python
client.messages.create(model="claude-opus-5-5", max_tokens=100, temperature=0.2, messages=[...])
```
**400 invalid_request_error** on current Claude models (sampling parameters removed).

### O5.
```python
client.messages.create(model="claude-opus-5-5", max_tokens=100,
    messages=[{"role": "user", "content": "Hi"}, {"role": "assistant", "content": "{"}])
```
**400** (assistant prefill removed on current models).

### O6.
Claude returns two `tool_use` blocks (ids `tu_1`, `tu_2`). Correct follow-up: **one user message containing two `tool_result` blocks** with `tool_use_id` `tu_1` and `tu_2`.

### O7.
Retry policy with base delay 1 s, factor 2, three retries (no jitter): waits **1 s, 2 s, 4 s** (total 7 s) before giving up.

### O8.
Batch results arrive in order `t3, t1, t2`. To map them correctly you must use **`custom_id`**, not position.

### O9.
`response.usage` shows `cache_creation_input_tokens=4000, cache_read_input_tokens=0` on call 1 and `cache_creation_input_tokens=0, cache_read_input_tokens=4000` on call 2 → caching **works** (write then read).

### O10.
A Pydantic `parse()` call receives a response whose JSON violates your validators. Expected outcome: a **validation error** raised in your code (handle with retry-with-feedback), because schema syntax ≠ business validity.

### O11.
Request with `thinking={"type": "disabled"}` on `claude-opus-5-5`: **400** ("thinking.type.disabled is not supported for this model"); omit `thinking` and use lower `effort`.

### O12.
`tool_choice={"type": "any"}` on `claude-opus-5-5`: **400** (forced tool use unsupported on this model); use `auto` + prompt instruction + `strict: true`.

---

# ✅ Part 15: MCQs

**1. Which statement about chat APIs is correct?**
A) The server remembers prior turns automatically  B) You must resend the conversation context each call (unless using a stored-state feature)  C) History is free  D) Context windows are unlimited
**Answer: B**

**2. In the Claude Messages API, which parameter is required?**
A) `temperature`  B) `max_tokens`  C) `top_p`  D) `stream`
**Answer: B**

**3. Where should tool results go in Claude when the model made several parallel calls?**
A) Separate user messages for each  B) One user message containing all `tool_result` blocks  C) System message  D) Assistant message
**Answer: B**

**4. What does `strict: true` on a tool guarantee?**
A) The tool is always called  B) Arguments conform to the JSON Schema if a call is made  C) Lower cost  D) Faster responses
**Answer: B**

**5. Which is true for current Claude models?**
A) `temperature` is required  B) Sampling parameters like `temperature` are rejected  C) Assistant prefill is encouraged  D) `budget_tokens` is required
**Answer: B**

**6. How do you verify prompt-cache hits on Claude?**
A) `usage.cache_read_input_tokens` > 0  B) Response latency only  C) `stop_reason`  D) Model name
**Answer: A**

**7. Which provider offers first-party embeddings?**
A) Anthropic Claude API  B) OpenAI  C) Both identically  D) Neither
**Answer: B**

**8. A 429 error should be handled by:**
A) Immediately retrying in a tight loop  B) Backing off (respecting `retry-after`) and queuing  C) Ignoring  D) Switching to temperature 0
**Answer: B**

**9. `stop_reason == "refusal"` means:**
A) Network failure  B) The model/safety system declined the request (HTTP 200)  C) Token limit hit  D) Tool finished
**Answer: B**

**10. The best way to get machine-readable output from Claude is:**
A) Ask nicely in plain text  B) Structured outputs (`output_config.format` / `messages.parse`) plus validation  C) Assistant prefill  D) High temperature
**Answer: B**

**11. Message Batches results are:**
A) Always in input order  B) Unordered, matched via `custom_id`  C) Synchronous  D) Free
**Answer: B**

**12. Which is a good reason to stream?**
A) It reduces token cost  B) Better perceived latency and avoiding timeouts on long outputs  C) It disables retries  D) It removes the need for `max_tokens`
**Answer: B**

**13. Which of these is NOT a security best practice?**
A) Keeping API keys in environment variables  B) Calling the provider directly from browser JavaScript with your secret key  C) Rotating leaked keys  D) Scoping tool permissions
**Answer: B**

**14. The Claude Agent SDK is:**
A) The same as Tool Runner  B) A separate library bundling the Claude Code harness and built-in tools  C) A managed hosting service  D) A model
**Answer: B**

**15. Compaction in Claude requires you to:**
A) Append only the text of responses  B) Append the full `response.content` including compaction blocks  C) Disable caching  D) Use temperature 0
**Answer: B**

**16. Which is the right way to reduce cost for a bulk, non-urgent classification job?**
A) Real-time calls with high effort  B) Batch API with a small model  C) Longer prompts  D) Disabling retries
**Answer: B**

**17. Model IDs should be:**
A) Guessed with date suffixes  B) Pinned exactly as documented and validated via the Models API  C) Always aliases to "latest"  D) Stored in frontend code
**Answer: B**

**18. A 400 error after upgrading models most likely indicates:**
A) Transient outage  B) A request using parameters the new model/API version no longer accepts  C) Rate limiting  D) Billing error
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

- Exposing API keys in frontend code or Git; no rotation or per-environment keys.
- Assuming `content[0]` is text; not checking `stop_reason` / refusal / truncation.
- Sending sampling parameters (`temperature`, `top_p`, `top_k`) or `budget_tokens` to current Claude models.
- Using assistant prefill or forced `tool_choice` where unsupported.
- Splitting parallel tool results across multiple user messages.
- Dropping non-text blocks (thinking, tool_use, compaction) when storing history.
- Retrying non-retryable errors, or retrying side-effecting tools without idempotency.
- Hard-coding model names without a configuration / abstraction layer or migration tests.
- Ignoring prompt-cache hygiene (volatile content early in the prompt).
- Not streaming long outputs; not handling client disconnects (paying for abandoned requests).
- Treating schema-valid output as correct; no business-rule validation.
- Building a custom string-matching error handler instead of typed exceptions.
- Using one provider's tokenizer to estimate the other's tokens.
- No cost / usage dashboards; no budgets or per-user quotas.
- Putting secrets or authorisation logic in system prompts.
- Skipping evaluation sets when changing prompts, models or SDK versions.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You know the wire-level shapes (messages, content blocks, tool calls, SSE events) and the differences between providers.
- You build thin, typed wrappers with retries, timeouts, logging, request IDs and cost tracking.
- You handle every stop reason, refusal and truncation path explicitly.
- You design tools as APIs (strict schemas, idempotent, least privilege, helpful errors).
- You use caching, batching, routing and effort tuning with measurements.
- You understand versioning and deprecations (removed params, API versions) and run migration tests.
- You secure keys, data and tool access; you treat model I/O as untrusted.
- You keep provider-specific features reachable but isolate them behind adapters.
- You evaluate on your own tasks and communicate unit economics.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Claude minimal patterns
```python
client = anthropic.Anthropic()                                   # ANTHROPIC_API_KEY
r = client.messages.create(model="claude-opus-5-5", max_tokens=16000,
        system="...", messages=[{"role": "user", "content": "..."}])
text = next(b.text for b in r.content if b.type == "text")
# stream:   with client.messages.stream(...) as s: for t in s.text_stream: ...; s.get_final_message()
# tools:    tools=[{"name","description","input_schema","strict":True}] -> loop on stop_reason == "tool_use"
# thinking: thinking={"type":"adaptive"}, output_config={"effort":"high"}
# JSON:     client.messages.parse(..., output_format=PydanticModel)
# cache:    cache_control={"type":"ephemeral"}  -> check usage.cache_read_input_tokens
```

### OpenAI minimal patterns
```python
oa = OpenAI()                                                    # OPENAI_API_KEY
r = oa.responses.create(model="<model-id>", instructions="...", input="...")
r.output_text
# tools: tools=[{"type":"function","name","parameters","strict":True}] -> function_call / function_call_output
# JSON:  oa.responses.parse(..., text_format=PydanticModel)
# reasoning: reasoning={"effort":"medium"}
```

### Reliability checklist
Timeouts • typed exceptions • retry 429/5xx/connection with jitter • never retry 400 • idempotent tools • stop-reason handling • fallback model/provider • request-ID logging • budget caps.

### Cost checklist
Cache static prefix • batch bulk work • route by difficulty • lower effort where quality holds • cap outputs • trim retrieval • monitor tokens per feature • measure cost per successful task.

### Security checklist
Backend-only keys • secret manager • least-privilege tools • injection defences • output escaping/validation • PII redaction • retention settings • per-user rate limits • audit logs • regular red-teaming.

### Final checklist before the interview
- [ ] Explain stateless chat APIs, tokens, context, pricing and rate limits.
- [ ] Write Claude and OpenAI calls, streaming, and typed error handling from memory.
- [ ] Implement the tool-use loop (parallel calls, errors, iteration caps) for both providers.
- [ ] Use structured outputs correctly and validate semantics.
- [ ] Explain adaptive thinking/effort, removed parameters (sampling, prefill, budget_tokens, forced tool_choice) and why upgrades break code.
- [ ] Apply prompt caching, batching, routing and token budgeting with numbers.
- [ ] Design for reliability: retries, idempotency, fallbacks, circuit breakers, refusals.
- [ ] Discuss security/privacy: keys, injection, PII, retention, regional processing.
- [ ] Compare OpenAI vs Claude features honestly (embeddings, images, audio, agents, platforms).
- [ ] Prepare a project story with provider evaluation, cost/latency wins and an incident lesson.
