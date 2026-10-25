# Model Serving & Inference Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets the **2025–2026 model-serving landscape**: LLM engines (**vLLM, SGLang, Hugging Face TGI, TensorRT-LLM, NVIDIA Dynamo, llama.cpp, Ollama, LMDeploy, MLC-LLM**), general serving frameworks (**NVIDIA Triton Inference Server, TorchServe, KServe, Ray Serve, BentoML, Seldon, FastAPI, ONNX Runtime, OpenVINO**), techniques (**continuous batching, PagedAttention, FlashAttention, prefix caching, speculative decoding, quantization (INT8 / FP8 / INT4 / AWQ / GPTQ / GGUF), tensor / pipeline / expert parallelism, chunked prefill, prefill–decode disaggregation, multi-LoRA serving**), hardware (**NVIDIA A100 / H100 / H200 / B200 / L4 / L40S, AMD MI300-class, Google TPU, AWS Inferentia / Trainium, Apple Silicon**), platforms (**Kubernetes, KEDA, Karpenter, AWS SageMaker / Bedrock, Google Vertex AI, Azure ML, Modal, Together, Fireworks, Baseten**), and metrics (**TTFT, TPOT / ITL, throughput, goodput, p95/p99 latency, GPU utilisation, cost per million tokens**). **Engine flags, supported hardware, default settings and prices change quickly**: anything marked "verify" should be checked in current docs. The concepts (memory-bound decoding, KV cache, batching, quantization trade-offs, parallelism, autoscaling, SLOs, cost per token) are stable. Claude examples avoid `temperature` / `top_p` / `top_k` and assistant prefill because current Claude models reject them (see `065_OpenAI-and-Claude-API.md`). Examples use the sample name **Ritesh Kumar** and small support / HR / e-commerce style applications.
> This file covers what inference is and how it differs from training, batch vs online vs streaming serving, REST / gRPC / SSE APIs, model formats (PyTorch, ONNX, TorchScript, safetensors, GGUF, TensorRT engines), serving frameworks, GPU vs CPU choices, **LLM-specific inference** (prefill vs decode, KV cache, memory maths, continuous batching, PagedAttention, FlashAttention, prefix caching, speculative decoding, chunked prefill, disaggregation), quantization and compression (distillation, pruning), parallelism (tensor / pipeline / data / expert), latency and throughput metrics, autoscaling and capacity planning, Kubernetes deployment, model registries and versioning, canary / shadow / A/B rollouts, observability, cost optimisation (routing, caching, spot, self-host vs API), security, reliability (timeouts, retries, backpressure, fallbacks), edge and on-device inference, and operating models. Related topics: generative AI overview in `063_Generative-AI.md`, LLM APIs in `065_OpenAI-and-Claude-API.md`, LLMs and RAG in `066_LLM-and-RAG.md`, vector databases in `067_Vector-Databases.md`, fine-tuning in `070_Fine-Tuning-LoRA-QLoRA.md`, multimodal AI in `071_Multimodal-AI.md`, evaluation in `072_LLM-Evaluation-and-Guardrails.md`, AI safety in `076_AI-Safety-and-Responsible-AI.md`, MLOps in `../10_AI_and_ML/074_MLOps.md`, PyTorch in `../10_AI_and_ML/058_PyTorch.md`, deep learning in `../10_AI_and_ML/057_Deep-Learning.md`, monitoring in `../07_DevOps_and_Cloud/052_Monitoring-and-Observability.md`, system design in `../09_System_Design/053_System-Design.md`.

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

### Q1. What is model serving? *(Must-know)*
Model serving means making a trained model available so other systems can send inputs and get predictions back, usually over an API. It includes loading the model, pre/post-processing, running inference, scaling, monitoring and updating the model safely.

### Q2. Training vs inference
Training learns weights from data (forward + backward pass, optimizer state, huge compute, runs for hours to months). Inference only runs the forward pass with fixed weights. It needs far less memory per request, but it runs all day, so **latency, throughput and cost per request** matter most.

### Q3. Batch vs online vs streaming inference *(Must-know)*
- **Batch (offline):** score many records on a schedule (nightly churn scores). Optimise throughput and cost.
- **Online (real-time):** one request, one fast response (fraud check, chatbot). Optimise latency.
- **Streaming:** results arrive piece by piece (LLM tokens over SSE) or from event streams (Kafka). Optimise time to first token and smooth delivery.

### Q4. Latency vs throughput
Latency is time for one request. Throughput is requests (or tokens) per second for the whole system. Batching raises throughput but can raise latency. You usually pick a latency target (SLO) and then maximise throughput under it.

### Q5. What is a model endpoint?
A network address (REST/gRPC) that accepts input and returns output. Behind it sit a load balancer, replicas of the model server and the loaded model.

### Q6. Common ways to expose a model
Plain FastAPI/Flask wrapper (simple), dedicated servers (Triton, TorchServe, vLLM, TGI), managed platforms (SageMaker, Vertex AI, Bedrock) and serverless GPU platforms (Modal, Replicate).

### Q7. REST vs gRPC for inference
REST/JSON is easy to debug and works everywhere. gRPC uses Protobuf and HTTP/2: smaller payloads, streaming, lower overhead. Good for internal high-volume services. LLM APIs mostly use REST + Server-Sent Events.

### Q8. What is Server-Sent Events (SSE) streaming? *(Must-know)*
A one-way HTTP stream where the server pushes `data:` events. LLM servers send each token (or chunk) as it is produced, so users see text immediately instead of waiting for the full answer. Perceived latency drops a lot.

### Q9. Common model file formats
- **PyTorch `.pt/.bin`:** pickle-based, can run code on load (unsafe from unknown sources).
- **safetensors:** safe, fast, memory-mappable tensors. Standard for Hugging Face.
- **ONNX:** framework-neutral graph for ONNX Runtime and others.
- **TorchScript / `torch.export`:** serialised PyTorch graphs.
- **TensorRT engine:** GPU-specific optimised binary.
- **GGUF:** quantized format for llama.cpp / Ollama.

### Q10. What is ONNX? 
Open Neural Network Exchange: a common graph format. You export from PyTorch/TensorFlow and run with ONNX Runtime, TensorRT, OpenVINO etc. It often gives faster, portable CPU/GPU inference for classic models (CNNs, BERT-style encoders).

### Q11. CPU vs GPU inference
CPUs are fine for small models, tree models, low traffic and cheap batch jobs. GPUs win for large neural networks because of massive parallel matrix maths and high memory bandwidth. LLMs of useful size basically need GPUs (or Apple Silicon / strong CPUs for small quantized models).

### Q12. Why is the first request slow? (cold start)
Model weights must load into memory, CUDA contexts and kernels initialise, JIT/compile caches warm up, and containers pull images. Fix with warm-up requests, readiness probes, keeping minimum replicas, and fast weight loading (safetensors, local NVMe cache).

### Q13. Model warm-up
Run a few dummy requests at startup (with realistic shapes) before marking the pod ready. It triggers kernel compilation and memory allocation so real users do not pay for it.

### Q14. What is a readiness vs liveness probe?
Liveness: "is the process alive? restart if not". Readiness: "is it ready for traffic?" For model servers, readiness should wait until the model is loaded and warmed up.

### Q15. Why containerise a model server?
Docker pins Python, CUDA, driver-compatible libraries and the model version, so the same image runs in dev and prod. Use NVIDIA Container Toolkit for GPU access.

### Q16. What is a model registry?
A store of model versions with metadata (metrics, data version, owner, stage: staging/production). Examples: MLflow Registry, SageMaker Model Registry, Hugging Face Hub, W&B Registry. Serving pulls a specific version, never "latest" blindly.

### Q17. What is pre-processing and post-processing in serving?
Pre: tokenisation, image resize/normalise, feature lookup. Post: decode tokens, thresholding, NMS, JSON formatting. Training/serving mismatch here is a classic bug (training-serving skew).

### Q18. A minimal FastAPI model server
```python
from fastapi import FastAPI
from pydantic import BaseModel
import torch

app = FastAPI()
model = torch.jit.load("model.pt").eval()          # load ONCE at startup

class Req(BaseModel):
    features: list[float]

@app.post("/predict")
def predict(r: Req):
    with torch.inference_mode():                    # no autograd bookkeeping
        x = torch.tensor([r.features])
        return {"score": model(x).item()}
```

### Q19. `torch.no_grad()` vs `torch.inference_mode()`
Both skip gradient tracking. `inference_mode` is stricter and slightly faster (also skips version counters), but tensors created inside cannot be used later for autograd. Use it for serving.

### Q20. `model.eval()`
Switches layers like dropout and batch-norm to inference behaviour. Forgetting it gives random, inconsistent predictions.

### Q21. What is a token and why does it matter for serving?
LLMs process tokens (sub-word pieces). Cost, latency and memory scale with tokens: input (prefill) and output (decode). Capacity is planned in tokens per second, not requests per second.

### Q22. Prefill vs decode (intro) *(Must-know)*
**Prefill:** process the whole prompt in parallel (compute-bound), produces the first token. **Decode:** generate output one token at a time (memory-bandwidth-bound), each step reads all weights and the KV cache. Prefill sets time to first token; decode sets streaming speed.

### Q23. What is the KV cache? *(Must-know)*
During generation, attention needs Keys and Values of all earlier tokens. Instead of recomputing them each step, we store them (KV cache). It makes decode fast but uses lots of GPU memory that grows with context length × batch size.

### Q24. Why do LLMs need so much GPU memory?
Weights (e.g. 8B params × 2 bytes in FP16 ≈ 16 GB) + KV cache + activations + runtime overhead. Larger batch and longer context mean a bigger KV cache.

### Q25. Rule of thumb for weight memory
`memory ≈ parameters × bytes per parameter`. FP16/BF16 = 2 bytes, INT8/FP8 = 1 byte, INT4 = 0.5 byte. A 70B model: ~140 GB (FP16), ~70 GB (INT8), ~35 GB (INT4), plus KV cache.

### Q26. What is quantization (intro)? *(Must-know)*
Storing weights (and sometimes activations/KV cache) in fewer bits. It cuts memory and often speeds up inference (less data to move), with a small accuracy loss if done well.

### Q27. What is batching and why does it help?
Process several requests in one forward pass. GPUs are under-used by a single request, so batching shares the cost of reading weights across many requests and raises throughput a lot.

### Q28. Static vs dynamic vs continuous batching
Static: fixed batch size, wait to fill. Dynamic: collect requests for a few ms then run together. **Continuous (in-flight) batching:** for LLMs, new requests join the running batch at every token step and finished ones leave, so GPUs stay busy.

### Q29. What are TTFT and TPOT? *(Must-know)*
**TTFT** (time to first token): from request to first output token. **TPOT / ITL** (time per output token / inter-token latency): gap between later tokens. Total latency ≈ TTFT + TPOT × (output tokens − 1).

### Q30. Name popular open LLM serving engines
vLLM, SGLang, Hugging Face TGI, TensorRT-LLM, llama.cpp/Ollama (local), LMDeploy. vLLM is the common default for GPU servers; Ollama for local development.

---

# 🔵 Part 2: Junior (1–3 years)

### Q31. How does vLLM work at a high level? *(Must-know)*
vLLM combines **continuous batching** with **PagedAttention**, which stores the KV cache in fixed-size blocks, like OS virtual memory pages, to avoid fragmentation. It exposes an OpenAI-compatible HTTP server, supports prefix caching, quantization, tensor parallelism and LoRA adapters.

### Q32. What is PagedAttention? *(Must-know)*
KV cache for each sequence is split into blocks that need not be contiguous. A block table maps logical positions to physical blocks. Result: almost no wasted memory, easy sharing of common prefixes, and larger effective batch sizes → higher throughput.

### Q33. What is FlashAttention?
An exact attention algorithm that tiles the computation so it stays in fast on-chip SRAM and avoids writing the full N×N attention matrix to slow HBM. Same results, much less memory traffic, faster for long sequences.

### Q34. Running vLLM
```bash
vllm serve meta-llama/Llama-3.1-8B-Instruct \
  --max-model-len 8192 \
  --gpu-memory-utilization 0.90 \
  --enable-prefix-caching
# OpenAI-compatible: POST http://localhost:8000/v1/chat/completions
```
(Flag names change between versions: verify.)

### Q35. Calling an OpenAI-compatible endpoint
```python
from openai import OpenAI
client = OpenAI(base_url="http://localhost:8000/v1", api_key="not-needed")
stream = client.chat.completions.create(
    model="meta-llama/Llama-3.1-8B-Instruct",
    messages=[{"role": "user", "content": "Hi, I am Ritesh Kumar. Summarise my order status."}],
    stream=True,
)
for chunk in stream:
    print(chunk.choices[0].delta.content or "", end="")
```
This lets app code switch between hosted and self-hosted models by changing the base URL.

### Q36. `max_model_len` and `gpu_memory_utilization`
`max_model_len` caps context (prompt + output) so KV cache size is bounded. `gpu_memory_utilization` is the fraction of GPU memory the engine may take; the rest of that fraction after weights becomes KV cache blocks. Too high → OOM during spikes; too low → small batches.

### Q37. What is `max_num_seqs` / `max_num_batched_tokens`?
Limits on concurrent sequences and tokens processed per step. They trade throughput vs latency and protect memory. Tune with load tests.

### Q38. Triton Inference Server
NVIDIA's multi-framework server (PyTorch, TensorFlow, ONNX, TensorRT, Python). Features: dynamic batching, model ensembles, concurrent model instances, HTTP/gRPC, metrics. Uses a model repository folder with `config.pbtxt`.

### Q39. Triton dynamic batching config
```
# config.pbtxt
name: "sentiment"
backend: "onnxruntime"
max_batch_size: 32
dynamic_batching {
  preferred_batch_size: [8, 16]
  max_queue_delay_microseconds: 5000
}
instance_group [{ kind: KIND_GPU, count: 2 }]
```
Waits up to 5 ms to build a batch. Higher delay → bigger batches, higher latency.

### Q40. TorchServe, BentoML, Ray Serve, KServe: when?
- **TorchServe:** PyTorch model archives (maintenance mode in recent years: verify).
- **BentoML:** Python-first packaging with adaptive batching and easy containers.
- **Ray Serve:** programmable, multi-model pipelines, autoscaling across a Ray cluster.
- **KServe:** Kubernetes-native `InferenceService` CRD with scale-to-zero and canaries.

### Q41. What is TensorRT / TensorRT-LLM?
TensorRT compiles a model into an optimised GPU engine (kernel fusion, precision calibration). TensorRT-LLM adds LLM features (paged KV cache, in-flight batching, FP8/INT4, multi-GPU). Fastest on NVIDIA GPUs but build steps are heavier and hardware-specific.

### Q42. What is llama.cpp and GGUF?
A C/C++ engine that runs quantized LLMs on CPUs, Apple Silicon and consumer GPUs. GGUF is its file format with quantization types like Q4_K_M, Q5_K_M, Q8_0. Great for local, offline and edge use; not a high-concurrency datacentre server.

### Q43. Ollama
A local runtime wrapping llama.cpp with a simple CLI/API (`ollama run llama3`). Good for developer machines, prototypes and privacy-sensitive demos.

### Q44. Hugging Face TGI
Text Generation Inference: Rust/Python server with continuous batching, tensor parallelism, quantization and streaming. Similar role to vLLM; check licence and maintenance status for your version.

### Q45. Quantization types you should know *(Must-know)*
- **Post-training quantization (PTQ):** quantize after training with a small calibration set.
- **QAT:** train with quantization simulated; best accuracy, costs training.
- **Weight-only (W4A16, AWQ, GPTQ):** weights int4, activations FP16; saves memory and bandwidth.
- **Weight + activation (W8A8, FP8):** uses faster low-precision tensor cores.
- **KV-cache quantization (FP8/INT8):** saves context memory.

### Q46. AWQ vs GPTQ
Both are INT4 weight-only PTQ. GPTQ minimises layer-wise error using second-order information. AWQ protects the most "salient" weight channels based on activation statistics. Both are well supported in vLLM; AWQ is often slightly more robust, results vary by model.

### Q47. FP8 vs INT8
FP8 (E4M3/E5M2) keeps a floating range, so it handles outliers better and is natively accelerated on H100/Ada/Blackwell GPUs. INT8 needs careful scaling but works on older GPUs.

### Q48. Does quantization hurt quality?
INT8/FP8 usually has negligible loss. INT4 is small but measurable, more on reasoning, code and long-context tasks and on smaller models. Always run your own eval set (see `072_LLM-Evaluation-and-Guardrails.md`) before and after.

### Q49. Distillation vs quantization vs pruning
Distillation trains a small student from a large teacher (new model). Quantization lowers numeric precision (same model). Pruning removes weights/heads/layers (sparsity; hardware support limited). They can be combined.

### Q50. Temperature, top-p, max tokens at serving time
Sampling parameters shape output randomness; `max_tokens` bounds cost and latency. Always set `max_tokens`. (Hosted Claude models reject some sampling params: check the API docs.)

### Q51. What is a stop sequence / EOS?
A token or string that ends generation. Missing stop handling causes runaway generation and wasted GPU time.

### Q52. Structured output / guided decoding
Servers can constrain tokens to a JSON schema or grammar (vLLM with xgrammar/outlines-style backends, llama.cpp grammars). It guarantees syntactically valid output without retries, with small overhead.

### Q53. Autoscaling basics
Add or remove replicas based on load. CPU % is a poor signal for GPU model servers. Better: request queue length, concurrent requests per replica, tokens/s, GPU utilisation or KV-cache usage.

### Q54. Horizontal vs vertical scaling
Horizontal: more replicas (needs a load balancer and stateless servers). Vertical: bigger GPU or more GPUs per replica (needed when a model does not fit on one GPU).

### Q55. What is tensor parallelism? *(Must-know)*
Splits each layer's weight matrices across GPUs; every layer needs an all-reduce, so it needs fast interconnect (NVLink). Used when a model is too big for one GPU or to cut latency. `--tensor-parallel-size 4` in vLLM.

### Q56. Pipeline parallelism
Splits layers into stages across GPUs/nodes; micro-batches flow through the pipeline. Less communication than tensor parallelism, good across nodes, but adds pipeline bubbles and latency.

### Q57. Data parallelism (replicas)
Multiple full copies of the model, each serving different requests. Scales throughput linearly; does not help if one copy does not fit.

### Q58. Expert parallelism (MoE)
Mixture-of-Experts models place different experts on different GPUs. Only a few experts are active per token, so compute per token is low, but all expert weights still need memory.

### Q59. Rate limiting and quotas
Protect the GPU service: per-user and per-key limits on requests and tokens per minute, return `429` with `Retry-After`. Prevents one tenant from starving others.

### Q60. Basic metrics to expose
Request count, error rate, p50/p95/p99 latency, TTFT, TPOT, tokens in/out per second, queue depth, GPU utilisation and memory, KV-cache usage, batch size. Export to Prometheus, visualise in Grafana.

---

# 🟡 Part 3: Mid (3–5 years)

### Q61. Why is LLM decode memory-bandwidth-bound? *(Must-know)*
Each decode step multiplies one token's vector by every weight matrix, so the GPU reads all weights from HBM for very little maths (low arithmetic intensity). Upper bound for one stream: `tokens/s ≈ memory bandwidth ÷ bytes of weights`. H100 (~3.35 TB/s) with a 16 GB model ≈ ~200 tokens/s single-stream theoretical max. Batching amortises the weight read across sequences.

### Q62. Estimating KV-cache size *(Must-know)*
`KV bytes per token = 2 × layers × kv_heads × head_dim × bytes`. Llama-3-8B (32 layers, 8 KV heads, head_dim 128, FP16): `2×32×8×128×2 = 131,072 B` ≈ **128 KiB per token**. An 8K-token sequence ≈ 1 GiB. 32 concurrent such sequences ≈ 32 GiB.

### Q63. MHA vs MQA vs GQA
Multi-head attention keeps one K/V per head (big cache). Multi-query shares one K/V across heads (tiny cache, some quality loss). **Grouped-query attention** shares K/V across groups: a good middle ground used by most modern models. Fewer KV heads → bigger batches possible.

### Q64. Prefix caching / prompt caching
If many requests start with the same tokens (system prompt, RAG instructions, few-shot examples), the engine reuses the computed KV blocks and skips prefill for that part. Lowers TTFT and cost. Design prompts with **stable prefix first, variable part last**. Hosted APIs offer similar prompt caching (see `065_OpenAI-and-Claude-API.md`).

### Q65. Chunked prefill
Split a long prompt's prefill into chunks mixed with decode steps in the same batch. Prevents one huge prompt from stalling everyone else's token stream (reduces decode latency spikes) at slight cost to that prompt's TTFT.

### Q66. Prefill–decode disaggregation
Run prefill and decode on separate GPU pools: prefill nodes are compute-heavy, decode nodes bandwidth/memory-heavy. KV cache is transferred between them. Lets you tune each independently and meet TTFT and TPOT SLOs at the same time. Added complexity: network transfer, routing. (Used in NVIDIA Dynamo, vLLM, SGLang experiments: verify.)

### Q67. Speculative decoding *(Must-know)*
A small **draft model** (or heads such as Medusa/EAGLE, or n-gram lookup) proposes several tokens; the large model verifies them in one parallel pass and accepts the matching prefix. Output distribution stays the same, but latency drops 1.5–3× when the draft is often right. Helps most at low batch sizes; less at high load where GPUs are already busy.

### Q68. Why does speculative decoding preserve quality?
The verification step uses rejection sampling so accepted tokens follow exactly the target model's distribution. A bad draft only reduces speedup, not correctness.

### Q69. Continuous batching in detail
Scheduler runs per iteration. It admits waiting requests if KV blocks are free, runs one step for all running sequences, removes finished ones and frees blocks. If memory is short, it can **preempt** (swap to CPU or recompute) lower-priority sequences.

### Q70. KV-cache preemption
When KV blocks run out, engines either swap blocks to CPU memory or drop and recompute later. Heavy preemption signals under-provisioned memory: users see latency spikes. Fix with smaller `max_model_len`, KV quantization, more GPUs or lower concurrency.

### Q71. Throughput vs goodput
Throughput counts all tokens/s. **Goodput** counts only requests that met their SLO (e.g. TTFT < 500 ms and TPOT < 50 ms). A system pushed to max throughput can have terrible goodput.

### Q72. How to size GPUs for an LLM service *(Must-know)*
1. Weight memory (params × bytes) + overhead (~10–20%).
2. KV memory = concurrent sequences × avg context × bytes/token.
3. Fit on N GPUs with tensor parallelism if needed.
4. Estimate tokens/s per replica from a load test (not from specs).
5. Replicas = peak tokens/s ÷ per-replica tokens/s at SLO, plus headroom (30–50%).
6. Compute cost per million tokens and compare with API pricing.

### Q73. Load testing an inference server
Use realistic prompt/output length distributions and concurrency ramps (k6, Locust, `vllm bench`, `genai-perf`, `llmperf`). Record TTFT, TPOT, throughput, errors and GPU metrics at each concurrency. Find the "knee" where latency rises sharply; set the autoscaling target below it.

### Q74. Why average prompt length is a trap
Latency and memory are dominated by the long tail. Test with p50 and p99 lengths, and set limits on max input tokens at the gateway.

### Q75. Multi-LoRA serving
Serve one base model with many small LoRA adapters (per customer/task). Engines (vLLM, LoRAX, TensorRT-LLM) load adapters on demand and batch requests for different adapters together. Much cheaper than one full model per tenant. See `070_Fine-Tuning-LoRA-QLoRA.md`.

### Q76. Merged vs unmerged LoRA at serve time
Merged: fold adapter into base weights, zero overhead, but one model per adapter. Unmerged: small runtime overhead, but can hot-swap many adapters on one base.

### Q77. Embedding model serving
Encoders are compute-bound and small; batch aggressively, use ONNX/TensorRT or specialised servers (TEI: Text Embeddings Inference, Infinity), cache embeddings of repeated texts, and normalise vectors consistently with indexing (see `067_Vector-Databases.md`).

### Q78. Serving rerankers and classifiers
Cross-encoders score (query, doc) pairs: cost grows with candidates × length. Limit candidates (top 50), truncate documents, batch pairs and consider distilled rerankers.

### Q79. Serving vision and multimodal models
Image preprocessing can dominate CPU; images become many tokens (cost and KV size). Resize/tile images sensibly, cap image counts per request and cache vision-encoder outputs when images repeat (see `071_Multimodal-AI.md`).

### Q80. Dynamic batching for non-LLM models
Server holds requests up to `max_queue_delay`, pads to a common shape, runs one batch. Sort or bucket by length to reduce padding waste.

### Q81. Padding and bucketing
Padding short inputs to the longest in batch wastes compute. Bucket by length, use packed/ragged batches or engines that avoid padding (FlashAttention varlen).

### Q82. torch.compile and CUDA graphs
`torch.compile` fuses ops and removes Python overhead. CUDA graphs record a kernel sequence and replay it with tiny launch cost; very effective for decode steps with fixed shapes. Engines use them but they need warm-up and fixed batch-size buckets.

### Q83. Mixed precision: FP32, TF32, FP16, BF16
Serve in BF16/FP16 (half memory, tensor cores). BF16 has FP32's range, so fewer overflow problems. Never serve LLMs in FP32 unless debugging.

### Q84. Handling long context
Memory grows linearly (KV) and prefill compute grows quadratically with length. Options: GQA models, KV quantization, sliding-window attention, chunked prefill, prefix caching, context compression or RAG instead of stuffing everything.

### Q85. Timeouts, retries and idempotency
Set client timeouts (connect, first-byte, total), retry only safe/idempotent calls with exponential backoff and jitter, and cap retries to avoid retry storms. Streaming requests need a "resume or restart" policy.

### Q86. Backpressure and load shedding
When queues grow, reject early with `429/503` rather than letting requests wait until they time out (wasting GPU on abandoned work). Detect client disconnects and **cancel generation** to free KV cache.

### Q87. Queueing: sync vs async inference
Sync: caller waits (chat). Async: submit job, poll or get a webhook (long video/batch). Use queues (SQS, Kafka, Redis, Celery) to smooth bursts and decouple clients from GPU capacity.

### Q88. Batch inference jobs for LLMs
For offline work (classify 5M tickets) use batch APIs or engines in offline mode (`LLM.generate` in vLLM, Ray Data), sort by length, saturate GPUs, use spot instances and checkpoint progress. Cost can be 50% or less vs online endpoints.

### Q89. Gateway layer for LLM traffic
An API gateway/LLM proxy (LiteLLM, Envoy AI Gateway, Kong, custom) gives auth, quotas, routing, retries, fallbacks across providers, caching, logging and cost tracking in one place.

### Q90. Semantic cache vs exact cache
Exact cache: hash of the full prompt, safe, low hit rate. Semantic cache: reuse answers for similar queries using embeddings, higher hit rate but risk of wrong answers; only for low-risk FAQs with a strict similarity threshold and expiry.

---

# 🟠 Part 4: Senior (5–7 years)

### Q91. Design an LLM serving platform for a company *(Must-know)*
Gateway (auth, quotas, routing) → router (model choice by task/cost) → serving pools (vLLM/TensorRT-LLM replicas per model, autoscaled on queue/KV usage) → shared prefix cache / LoRA registry → model registry + CI evals → observability (traces, TTFT/TPOT, cost per tenant) → fallbacks to hosted APIs. Add multi-region, secrets, audit logs and kill switches.

### Q92. Self-host vs API: how to decide *(Must-know)*
Self-host when: steady high volume, data cannot leave your boundary, need custom/fine-tuned models, strict latency, or cost per token beats API. Use API when: spiky/low volume, need best frontier quality, small team, fast time to market. Compare **total cost** (GPUs, idle time, engineers, on-call) not just GPU-hour vs token price.

### Q93. Break-even maths for self-hosting
`cost per 1M tokens = (GPU $/hour ÷ (tokens/s × 3600 × utilisation)) × 1,000,000`. Example: $4/h GPU, 2,500 tokens/s, 50% utilisation → `4 ÷ (2500×3600×0.5) × 1e6 ≈ $0.89` per 1M tokens. Low utilisation destroys the economics, so measure real utilisation.

### Q94. GPU utilisation can lie
`nvidia-smi` utilisation shows "a kernel was running", not that the GPU is efficiently used. Track achieved tokens/s, SM occupancy, memory bandwidth use (DCGM), batch size and goodput.

### Q95. Choosing the GPU
- **L4 / T4 / A10:** cheap, small models, embeddings, vision.
- **L40S / A100 40–80 GB:** 7–34B models, balanced.
- **H100 / H200:** high throughput, FP8, large models; H200 has more memory (141 GB) and bandwidth.
- **B200-class:** newer, FP4 support (verify availability).
- **AMD MI300-class, TPU, Inferentia:** alternatives with ecosystem trade-offs.
Memory capacity and bandwidth often matter more than raw FLOPs for decode.

### Q96. Interconnect matters
NVLink/NVSwitch (hundreds of GB/s) makes tensor parallelism efficient inside a node. PCIe-only multi-GPU servers suffer on TP; use pipeline parallelism or smaller models. Across nodes use InfiniBand/RoCE.

### Q97. Multi-node serving
Needed for very large models (≥ 400B dense or big MoEs). Combine TP inside node, PP or EP across nodes. Fault tolerance is harder: one failed GPU takes down the whole replica. Prefer fewer, bigger nodes if possible.

### Q98. MoE serving challenges
All experts must be resident; routing imbalance causes hot experts; all-to-all communication is costly. Use expert parallelism, load-balancing, and large batches. Per-token compute is small but memory footprint is big.

### Q99. Kubernetes for GPU inference *(Must-know)*
Use the NVIDIA device plugin/GPU Operator, resource requests `nvidia.com/gpu: 1`, node pools with taints/tolerations for GPU nodes, topology-aware scheduling for multi-GPU pods, PodDisruptionBudgets, and readiness probes tied to model load. Share GPUs with MIG (A100/H100) or time-slicing for small models.

### Q100. Example Deployment snippet
```yaml
apiVersion: apps/v1
kind: Deployment
metadata: { name: llm-8b }
spec:
  replicas: 2
  selector: { matchLabels: { app: llm-8b } }
  template:
    metadata: { labels: { app: llm-8b } }
    spec:
      tolerations: [{ key: nvidia.com/gpu, operator: Exists }]
      containers:
      - name: vllm
        image: vllm/vllm-openai:<pinned-tag>
        args: ["--model", "/models/llama-3.1-8b", "--max-model-len", "8192"]
        resources: { limits: { nvidia.com/gpu: 1, memory: 48Gi } }
        readinessProbe: { httpGet: { path: /health, port: 8000 }, initialDelaySeconds: 120 }
        volumeMounts: [{ name: models, mountPath: /models }]
      volumes: [{ name: models, persistentVolumeClaim: { claimName: model-cache } }]
```

### Q101. Autoscaling LLM replicas: KEDA/HPA with custom metrics
Scale on `num_requests_waiting`, running requests per replica or KV-cache usage from Prometheus. Scale-up is slow (GPU node provisioning + model load, often 3–10 min), so keep warm capacity, use predictive/scheduled scaling and over-provision for spikes.

### Q102. Reducing model load time
Store weights on fast local NVMe or a shared cache, use safetensors with memory mapping, pre-pull images, bake small models into images, use model streaming loaders (e.g. run:ai streamer, tensorizer) and snapshot/restore techniques.

### Q103. Scale-to-zero trade-offs
Saves money for rarely used models but cold start of minutes breaks interactive use. Use for internal/batch workloads; keep min replicas ≥ 1 for user-facing paths.

### Q104. Canary, shadow, A/B for models *(Must-know)*
- **Shadow:** send copy of traffic to the new model, discard output; compare offline. Zero user risk.
- **Canary:** route 1–5% of real traffic, watch errors, latency and quality signals, ramp up.
- **A/B:** split users to compare business metrics with statistics.
Always keep instant rollback (route weights, previous version warm).

### Q105. Versioning everything
Model weights + tokenizer + chat template + engine version + CUDA/driver + serving config + prompt version. A tokenizer or chat-template mismatch silently degrades quality. Record all in the registry and in every trace.

### Q106. Observability for inference
Traces per request (queue time, prefill, decode, tool calls), token counts, cost, model version, cache-hit flag. Use OpenTelemetry (GenAI semantic conventions), Prometheus/Grafana, Langfuse/LangSmith/Phoenix. Redact PII (see `072_LLM-Evaluation-and-Guardrails.md`).

### Q107. Production quality monitoring
Latency alone is not enough. Sample outputs for LLM-judge/human review, track refusal rate, format-validity rate, thumbs-down, embedding drift of inputs, and canary eval suites after every model/engine/driver change.

### Q108. Data drift vs concept drift vs model drift
Data drift: input distribution changes. Concept drift: relationship between inputs and correct output changes. Model drift (staleness): performance decays over time. Monitor inputs, predictions and (delayed) labels. See `../10_AI_and_ML/074_MLOps.md`.

### Q109. Security of model servers *(Must-know)*
Authenticate and authorise every call, TLS everywhere, per-tenant quotas, input size limits, isolate tenants (separate pools for sensitive data), do not log secrets/PII, scan images, never load untrusted pickle files, restrict egress, patch engines (inference servers have had RCE CVEs: verify advisories). Protect against model extraction through rate limits and monitoring.

### Q110. Pickle risk
`torch.load` on untrusted files can execute arbitrary code. Use safetensors, `weights_only=True`, and verify checksums/signatures of downloaded models.

### Q111. Multi-tenancy and noisy neighbours
Separate queues, per-tenant concurrency and token limits, priority classes (interactive over batch), and sometimes dedicated replicas for large customers. Fair scheduling inside the engine is limited, so enforce fairness at the gateway.

### Q112. Priority scheduling and SLO tiers
Interactive chat gets low TTFT and a reserved capacity; batch jobs fill leftovers and can be preempted. Use separate deployments or engine-level priority if supported.

### Q113. Fallback and multi-provider strategy
Primary self-hosted → secondary hosted API → degraded smaller model. Gateway handles health checks and circuit breakers. Keep prompts portable and re-run evals for each fallback, since behaviour differs.

### Q114. Circuit breaker
Stop sending traffic to a failing backend after N errors/timeouts, probe periodically, and re-close when healthy. Prevents cascading failure and wasted retries.

### Q115. Continuous improvement loop for serving
Measure (tokens/s, goodput, cost) → profile (queueing vs prefill vs decode vs network) → change one thing (quantization, batch limits, caching, GPU type) → re-test → roll out gradually → record result in a runbook.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q116. Inference platform strategy
Decide what to standardise: one gateway, one or two engines, a model catalogue with approved models, shared eval gates, cost attribution per team, golden paths (templates) for deploying a model in a day. Avoid every team running its own GPU cluster.

### Q117. Capacity planning and reservations
Mix reserved/committed GPUs for baseline, on-demand for peaks and spot for batch. Forecast in tokens/s per model; track utilisation; negotiate cloud commitments only after 2–3 months of stable measurements.

### Q118. FinOps for AI inference
Tag cost by team/feature/model; report cost per request, per successful task and per 1M tokens; set budgets and alerts; route simple tasks to small models; cache; shorten prompts; use batch discounts; kill idle endpoints.

### Q119. Model routing / cascades
A router sends easy queries to a cheap model and hard ones to a strong one (or escalates when confidence is low). Gains 30–70% cost reduction when the easy share is large. Needs a good router (rules, classifier, or small LLM) and evals that include the routing error cost.

### Q120. Build vs buy for the serving stack
Buy (managed endpoints, Bedrock/Vertex/Together/Fireworks) for speed and low ops; build on vLLM/Triton/KServe for control, data residency and cost at scale. Hybrid is common: managed for frontier models, self-hosted for fine-tuned and sensitive workloads.

### Q121. Reliability engineering: SLOs and error budgets
Define SLIs (availability, TTFT p95, TPOT p95, error rate, quality pass rate), SLOs (99.9%, p95 TTFT < 800 ms) and error budgets that gate risky launches. Add runbooks for GPU failures, OOM storms, provider outages and quality regressions.

### Q122. Disaster recovery and multi-region
Replicate model artefacts and configs across regions, test failover, keep capacity headroom or a hosted-API fallback, and decide which data may cross regions (residency rules).

### Q123. Governance and compliance for model serving
Model cards, approved-model lists, audit logs of who called what, data retention limits, PII controls, vendor/DPA reviews, change management for model swaps, and evidence for regulators (EU AI Act, ISO 42001). See `076_AI-Safety-and-Responsible-AI.md`.

### Q124. Sustainability and energy
Inference dominates lifetime energy of deployed models. Quantization, right-sizing, batching, caching, efficient hardware and region choice (cleaner grids) reduce both cost and emissions. Track energy or GPU-hours per 1M tokens.

### Q125. Roadmap for a team adopting LLM serving
1. Start with hosted APIs behind a gateway. 2. Add evals, tracing and cost tracking. 3. Self-host one open model for a clear case (privacy/cost). 4. Add autoscaling, canaries, fallbacks. 5. Optimise (quantization, prefix cache, speculative decoding). 6. Platformise (catalogue, golden paths, FinOps). Measure value at each step.

---

# 💻 Part 6: Hands-On Tasks & Code

### H1. Export a PyTorch model to ONNX and serve with ONNX Runtime
```python
import torch, onnxruntime as ort, numpy as np

model = MyClassifier().eval()
dummy = torch.randn(1, 128)
torch.onnx.export(
    model, dummy, "clf.onnx",
    input_names=["x"], output_names=["logits"],
    dynamic_axes={"x": {0: "batch"}, "logits": {0: "batch"}},
    opset_version=17,
)

sess = ort.InferenceSession("clf.onnx", providers=["CUDAExecutionProvider", "CPUExecutionProvider"])
out = sess.run(None, {"x": np.random.randn(8, 128).astype("float32")})[0]
```
Check numerical parity against PyTorch (`np.allclose(..., atol=1e-4)`).

### H2. FastAPI with request micro-batching
```python
import asyncio, torch
from fastapi import FastAPI

app = FastAPI()
queue: asyncio.Queue = asyncio.Queue()
MAX_BATCH, MAX_WAIT = 16, 0.005

async def batcher():
    while True:
        item = await queue.get()
        batch = [item]
        deadline = asyncio.get_event_loop().time() + MAX_WAIT
        while len(batch) < MAX_BATCH:
            timeout = deadline - asyncio.get_event_loop().time()
            if timeout <= 0:
                break
            try:
                batch.append(await asyncio.wait_for(queue.get(), timeout))
            except asyncio.TimeoutError:
                break
        x = torch.stack([b[0] for b in batch])
        with torch.inference_mode():
            y = model(x)
        for (_, fut), out in zip(batch, y):
            fut.set_result(out.tolist())

@app.on_event("startup")
async def start():
    asyncio.create_task(batcher())

@app.post("/predict")
async def predict(features: list[float]):
    fut = asyncio.get_event_loop().create_future()
    await queue.put((torch.tensor(features), fut))
    return {"out": await fut}
```
Shows how dynamic batching trades up to 5 ms latency for throughput.

### H3. Stream tokens over SSE with FastAPI
```python
from fastapi.responses import StreamingResponse

@app.post("/chat")
async def chat(prompt: str):
    async def gen():
        async for tok in engine.generate(prompt):          # your engine's async iterator
            yield f"data: {tok}\n\n"
        yield "data: [DONE]\n\n"
    return StreamingResponse(gen(), media_type="text/event-stream")
```
Also handle client disconnect (`await request.is_disconnected()`) to cancel generation.

### H4. Offline batch inference with vLLM
```python
from vllm import LLM, SamplingParams
llm = LLM(model="Qwen/Qwen2.5-7B-Instruct", max_model_len=4096)
params = SamplingParams(max_tokens=64)
prompts = [f"Classify ticket: {t}" for t in tickets]
outs = llm.generate(prompts, params)       # engine batches internally
labels = [o.outputs[0].text.strip() for o in outs]
```

### H5. Measure TTFT and TPOT from a client
```python
import time
from openai import OpenAI
client = OpenAI(base_url="http://localhost:8000/v1", api_key="x")

t0 = time.perf_counter(); first = None; n = 0
for ch in client.chat.completions.create(model=M, stream=True, max_tokens=200,
        messages=[{"role": "user", "content": "Explain KV cache."}]):
    if ch.choices[0].delta.content:
        n += 1
        if first is None: first = time.perf_counter()
end = time.perf_counter()
print("TTFT ms:", (first - t0) * 1000)
print("TPOT ms:", (end - first) * 1000 / max(n - 1, 1))
```

### H6. Quantize with AutoAWQ (sketch)
```python
from awq import AutoAWQForCausalLM
from transformers import AutoTokenizer
path, out = "meta-llama/Llama-3.1-8B-Instruct", "llama3.1-8b-awq"
model = AutoAWQForCausalLM.from_pretrained(path)
tok = AutoTokenizer.from_pretrained(path)
model.quantize(tok, quant_config={"zero_point": True, "q_group_size": 128, "w_bit": 4, "version": "GEMM"})
model.save_quantized(out); tok.save_pretrained(out)
# then: vllm serve ./llama3.1-8b-awq --quantization awq
```
Evaluate on your golden set before shipping. (Library APIs change: verify.)

### H7. Prometheus alert rules for an inference service
```yaml
groups:
- name: llm
  rules:
  - alert: HighTTFT
    expr: histogram_quantile(0.95, sum(rate(ttft_seconds_bucket[5m])) by (le)) > 1
    for: 10m
    labels: { severity: page }
  - alert: QueueBacklog
    expr: avg(num_requests_waiting) > 20
    for: 5m
    labels: { severity: warn }
```

### H8. Simple k6 load test
```javascript
import http from "k6/http";
export const options = { stages: [{ duration: "2m", target: 50 }, { duration: "5m", target: 50 }] };
export default function () {
  http.post("http://llm/v1/chat/completions",
    JSON.stringify({ model: "m", max_tokens: 128, messages: [{ role: "user", content: "Hello from Ritesh Kumar" }] }),
    { headers: { "Content-Type": "application/json" } });
}
```

### H9. Canary routing with weights (Istio-style)
```yaml
http:
- route:
  - destination: { host: llm-v1 }
    weight: 95
  - destination: { host: llm-v2 }
    weight: 5
```
Roll forward only if error rate, latency and quality canary are within thresholds.

### H10. Retry with backoff and jitter
```python
import random, time
def call_with_retry(fn, tries=4, base=0.5):
    for i in range(tries):
        try:
            return fn()
        except (TimeoutError, ConnectionError):
            if i == tries - 1: raise
            time.sleep(base * 2**i + random.random() * 0.2)
```

### H11. GPU memory estimator
```python
def estimate_gb(params_b, weight_bytes, layers, kv_heads, head_dim, ctx, seqs, kv_bytes=2, overhead=1.15):
    weights = params_b * 1e9 * weight_bytes
    kv = 2 * layers * kv_heads * head_dim * kv_bytes * ctx * seqs
    return (weights + kv) * overhead / 1e9

print(estimate_gb(8, 2, 32, 8, 128, 8192, 16))   # ≈ 38 GB: fits one 48 GB GPU
```

### H12. Docker Compose for local vLLM + gateway
```yaml
services:
  vllm:
    image: vllm/vllm-openai:<pinned-tag>
    command: ["--model", "Qwen/Qwen2.5-7B-Instruct", "--max-model-len", "8192"]
    deploy: { resources: { reservations: { devices: [{ capabilities: [gpu] }] } } }
    ports: ["8000:8000"]
  gateway:
    image: ghcr.io/berriai/litellm:<pinned-tag>
    ports: ["4000:4000"]
```

### H13. Practical task list
1. Serve a small model with FastAPI, measure p95 under 50 concurrent users.
2. Add micro-batching and compare throughput.
3. Serve an LLM with vLLM; record TTFT/TPOT vs concurrency.
4. Quantize to INT4 and compare quality (eval set) and throughput.
5. Turn on prefix caching and measure TTFT on shared-prefix prompts.
6. Deploy on Kubernetes with readiness probe and HPA on queue length.
7. Add canary routing and a rollback.

---

# 🐞 Part 7: Debugging Scenarios

### D1. CUDA out of memory at startup
Weights + KV reservation exceed memory. Lower `max_model_len`, `gpu_memory_utilization`, use quantization or more GPUs (tensor parallel). Check other processes using the GPU.

### D2. OOM only under load
KV cache and activation spikes. Cap `max_num_seqs`, `max_num_batched_tokens` and input length; leave memory headroom (0.85–0.90); enable KV quantization.

### D3. Latency fine at low load, terrible at high load
Queueing. Compute is saturated; check queue depth. Scale out, enable better batching, shorten outputs, or shed load. Use goodput, not just throughput.

### D4. High TTFT, normal TPOT
Prefill problem: very long prompts, no prefix caching, or prefill contention. Enable prefix caching and chunked prefill, trim prompts, separate prefill capacity.

### D5. Normal TTFT, slow streaming (high TPOT)
Decode saturated: batch too large, memory bandwidth bound, or CPU-side bottleneck (tokenizer, detokenizer, Python GIL). Reduce concurrency per GPU, quantize, enable speculative decoding, check CPU limits.

### D6. GPU utilisation low but latency high
CPU bottleneck, slow pre/post-processing, network or disk loading, small batch sizes, or synchronous code blocking the event loop. Profile end to end.

### D7. Pods restart in a loop
Liveness probe killing a pod that is still loading the model. Use a startup probe or long `initialDelaySeconds`; check OOMKilled (CPU RAM) vs CUDA OOM.

### D8. Output quality drops after quantization
Calibration data not representative, aggressive bits, or sensitive layers. Try higher bits (INT8/FP8), different method (AWQ vs GPTQ), calibrate on domain data, keep some layers in higher precision, and re-evaluate.

### D9. Garbled or odd outputs after model update
Wrong chat template, tokenizer mismatch, missing special tokens, or wrong dtype. Compare tokenised prompts with the reference implementation; pin the template.

### D10. Same prompt gives different answers across replicas
Different versions, quantization, drivers, or sampling settings; plus GPU non-determinism in batched floating-point reductions. Pin versions; accept small nondeterminism or use deterministic modes at a speed cost.

### D11. 429/503 storms and retry amplification
Clients retry immediately and multiply load. Add exponential backoff with jitter, retry budgets, `Retry-After`, circuit breakers and server-side load shedding.

### D12. Streaming stops mid-answer behind a proxy
Proxy/load balancer buffering or idle timeout. Disable response buffering (`X-Accel-Buffering: no`), raise timeouts, send periodic keep-alive comments.

### D13. Cost suddenly doubled
Longer prompts (new feature), higher output lengths, cache hit rate drop (prompt prefix changed), autoscaler not scaling down, or retries. Look at tokens per request and cache metrics by version.

### D14. Scale-up too slow
Image pull, node provisioning and model load take minutes. Pre-pull images, keep warm pool, scale on leading indicators (queue growth), use scheduled scaling for known peaks.

### D15. Multi-GPU run hangs
NCCL init/communication problems: wrong interconnect settings, firewall, mismatched ranks, or one GPU unhealthy. Check NCCL logs (`NCCL_DEBUG=INFO`), topology (`nvidia-smi topo -m`), shared memory size (`--shm-size`) in containers.

### D16. Training-serving skew in a classic model
Different preprocessing code, feature definitions or missing values at serve time. Share one preprocessing library/feature store, log serving features and compare distributions with training.

---

# 🧩 Part 8: Tricky Questions

### T1. Does a bigger batch always improve performance?
No. Throughput rises, but latency and KV memory also rise, and past a point you hit compute limits or preemption. Tune to the SLO.

### T2. Is GPU utilisation of 100% good?
Not necessarily. It may mean saturation (queueing) or an inefficient kernel mix. Look at goodput and latency percentiles.

### T3. Is INT4 always better because it is smaller?
No. It saves memory and often speeds up decode, but may lose quality, and some hardware has no fast INT4 kernels. FP8/INT8 may be the better balance.

### T4. Does speculative decoding change outputs?
With correct verification the distribution is unchanged. It trades extra compute for lower latency and helps least when the GPU is already saturated.

### T5. Can I serve a 70B model on one 24 GB GPU?
Not in memory-fit terms (70B at INT4 ≈ 35 GB). You would need CPU offload (very slow), multiple GPUs, or a smaller model.

### T6. Is it cheaper to self-host than to use an API?
Only at sustained high utilisation and with ops cost included. Many teams find APIs cheaper at low or spiky volume.

### T7. Why not just increase `max_tokens` to be safe?
It raises worst-case latency, KV memory and cost, and lets runaway outputs hog the GPU. Set limits per use case.

### T8. Does temperature 0 give deterministic results?
Not guaranteed: batch composition, floating-point order and kernel choices can change results. Hosted Claude models also reject sampling parameters.

### T9. Is streaming faster?
Total time is about the same (slightly more overhead), but perceived latency is far better because TTFT is what users feel.

### T10. Is more GPUs per replica always faster?
No. Tensor-parallel communication adds overhead; going from 4 to 8 GPUs may give less than 2× speedup and hurt cost efficiency. Often two 4-GPU replicas beat one 8-GPU replica for throughput.

### T11. Does prefix caching help every workload?
Only when requests share a long identical prefix. Putting user-specific text (name, timestamp) at the start of the prompt destroys cache hits.

### T12. Should the autoscaler use CPU utilisation?
No for GPU model servers; CPU is mostly idle. Use queue depth, concurrency or token throughput.

### T13. Can I mix training and inference on the same GPUs?
Possible in small setups, but contention hurts latency. Keep production inference isolated or strictly prioritised.

### T14. Is ONNX always faster than PyTorch?
Not always. Gains are common for CNN/encoder models; for LLMs, specialised engines (vLLM, TensorRT-LLM) usually beat ONNX paths. Benchmark.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- Inference = forward pass only; cost lives in serving.
- Prefill is compute-bound; decode is memory-bound.
- KV cache per token = 2 × layers × kv_heads × head_dim × bytes.
- Weights ≈ params × bytes per param.
- Continuous batching keeps GPUs full.
- PagedAttention removes KV fragmentation.
- FlashAttention = exact attention, less memory traffic.
- Prefix caching: stable prefix first.
- Speculative decoding: draft then verify; same output distribution.
- TTFT = prefill + queueing; TPOT = decode speed.
- Goodput beats raw throughput.
- Always set `max_tokens` and `max_model_len`.
- Cancel generation when the client disconnects.
- Autoscale on queue depth, not CPU.
- Warm up before readiness.
- safetensors over pickle.
- Pin model, tokenizer, template and engine versions.
- Shadow → canary → full rollout, with instant rollback.
- Quantize, then re-run your evals.
- Retries need backoff, jitter and budgets.
- Tag cost by tenant and feature.
- Utilisation decides self-host economics.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about a model you put into production
Use STAR: business need and SLO → model choice and why → serving stack (engine, hardware, gateway) → performance work (batching, quantization, caching) → rollout (shadow/canary) → monitoring and outcome. Example: "Support assistant on an 8B model: moved from HF `generate` to vLLM, got 6× throughput; AWQ INT4 + prefix caching cut GPU count from 6 to 2; p95 TTFT 2.1 s → 0.6 s; eval pass rate stayed within 1 point."

### P2. A production incident you handled
Describe symptoms (latency spike, OOM, bad outputs), detection (alerts, traces), diagnosis (queue vs prefill vs decode), mitigation (shed load, roll back, scale), root cause and the permanent fix (new alert, limit, regression test).

### P3. How did you cut inference cost?
Measure first (tokens per request, utilisation), then: shorter prompts, caching, model routing, quantization, right-sized GPUs, batch jobs on spot, scale-to-zero for non-critical paths. Report dollars per 1M tokens before/after.

### P4. How did you decide between API and self-hosting?
Showed a cost model with real traffic, data residency needs, quality comparison on a private eval set, and ops capacity; chose hybrid with a gateway and fallback.

### P5. How did you roll out a model change safely?
Offline evals → shadow traffic → 5% canary with guardrail metrics → gradual ramp → rollback tested. Gate on both quality and operational metrics.

### P6. A trade-off between latency and quality
Chose a smaller or quantized model for the interactive path and a larger model for async deep analysis; communicated the numbers and let product pick the point on the curve.

### P7. How do you keep up with fast-moving inference tooling?
Maintain a benchmark harness with our own prompts, re-run it on new engine/model releases, read release notes, and keep abstractions (OpenAI-compatible API, gateway) so swapping is cheap.

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- Serving basics: batch / online / streaming, REST / gRPC / SSE, model formats, containers, registries, warm-up, probes.
- Classic ML/DL serving: ONNX, TensorRT, Triton, TorchServe, BentoML, dynamic batching, preprocessing parity.
- LLM inference: tokens, prefill/decode, KV cache, GQA, continuous batching, PagedAttention, FlashAttention, prefix caching, chunked prefill, speculative decoding, disaggregation, structured decoding.
- Compression: quantization (PTQ/QAT, AWQ, GPTQ, FP8, INT4, KV quant), distillation, pruning.
- Parallelism and hardware: tensor / pipeline / data / expert parallelism, NVLink, GPU selection, MIG, CPUs, edge.
- Platform: gateway, routing, autoscaling, Kubernetes, canary/shadow/A-B, versioning, multi-LoRA, caching.
- Operations: observability, SLOs, load testing, incident response, security, multi-tenancy, DR.
- Economics: cost per token, utilisation, self-host vs API, FinOps, sustainability.

## Mixed topics
- Quantization + evals + canary rollout.
- Prefix caching + prompt design + cost.
- Autoscaling + cold start + queue-based metrics.
- Gateway + fallbacks + circuit breakers + provider differences.
- Multi-LoRA + tenant isolation + governance.
- RAG latency budget: embedding + retrieval + rerank + LLM TTFT (see `066_LLM-and-RAG.md`).
- Agents + long contexts + KV memory + tool latency (see `069_AI-Agents.md`).

---

# 🔬 Part 12: Internals

### Anatomy of one LLM request
1. Gateway authenticates, rate-limits, picks a model.
2. Engine tokenises, checks prefix cache, queues the request.
3. Scheduler admits it when KV blocks are free.
4. **Prefill:** all prompt tokens go through the model in parallel; K/V stored in blocks; first token sampled.
5. **Decode loop:** each iteration the new token is embedded, attends to cached K/V, produces next-token logits, sampling picks a token, which is streamed.
6. Stop on EOS/stop string/max tokens; blocks are freed (or kept for prefix cache).

### Why decode is bandwidth-bound
Arithmetic intensity ≈ FLOPs per byte moved. A matrix–vector product does ~2 FLOPs per weight byte read (FP16: 1 FLOP/byte), far below the GPU's compute-to-bandwidth ratio (hundreds of FLOPs/byte). Batching turns it into matrix–matrix products, raising intensity until compute becomes the limit.

### Roofline view
Performance = min(peak compute, bandwidth × arithmetic intensity). Prefill sits near the compute roof; small-batch decode sits on the bandwidth slope. This explains why quantization (fewer bytes) speeds decode almost linearly while barely helping compute-bound prefill (unless low-precision tensor cores are used).

### PagedAttention memory layout
KV cache is divided into blocks of e.g. 16 tokens. Each sequence keeps a block table. The attention kernel gathers K/V via the table. Copy-on-write lets parallel samples or beam search share prompt blocks. Internal fragmentation is limited to the last block.

### How quantization works
Map float `w` to integer `q = round(w / s + z)` with scale `s` (and zero-point `z`), per tensor, channel or group (e.g. 128 weights share a scale). Dequantize on the fly in the kernel. Group-wise scales preserve accuracy at 4-bit. Outlier activations are the main difficulty for W8A8 (SmoothQuant moves the difficulty to weights).

### Speculative decoding acceptance
With draft probability `q(x)` and target `p(x)`, accept draft token with probability `min(1, p(x)/q(x))`; on rejection, resample from the normalised `max(0, p − q)`. Expected tokens per target pass ≈ `(1 − α^(k+1)) / (1 − α)` where α is the acceptance rate and k the draft length.

### Continuous batching scheduler loop
```
while True:
    admit_waiting_requests_if_blocks_available()
    batch = running_sequences (+ prefill chunks)
    logits = model.forward(batch)
    for seq in batch: seq.append(sample(logits[seq]))
    free_finished_sequences()
```
Iteration-level scheduling is the key difference from request-level batching.

### Tensor-parallel layer split
For an MLP: first linear split by columns, second by rows, so only one all-reduce is needed after the second. For attention: split heads across GPUs; all-reduce after the output projection. Two all-reduces per transformer block.

### CUDA graph capture
Capturing a decode step removes per-kernel launch latency (tens of microseconds each, thousands per step). Engines capture graphs for several batch-size buckets and pad requests to the nearest bucket.

---

# 📊 Part 13: Reference Tables

### Serving frameworks
| Tool | Best for | Notes |
|---|---|---|
| FastAPI | Small models, prototypes | You build batching, metrics yourself |
| Triton | Multi-framework, high throughput | Dynamic batching, ensembles, gRPC |
| TorchServe | PyTorch archives | Check maintenance status |
| BentoML | Python-first packaging | Adaptive batching, easy deploy |
| Ray Serve | Pipelines, multi-model | Autoscaling on Ray |
| KServe | Kubernetes standard | Canary, scale-to-zero |
| vLLM | General LLM serving | PagedAttention, OpenAI API |
| SGLang | LLM + structured/agentic programs | RadixAttention prefix reuse |
| TensorRT-LLM | Max speed on NVIDIA | Engine build step |
| TGI | HF ecosystem | Check licence/status |
| llama.cpp / Ollama | Local, edge | GGUF, CPU/Metal |

### Precision and memory (per parameter)
| Format | Bytes | Typical use |
|---|---|---|
| FP32 | 4 | Training/debug |
| BF16 / FP16 | 2 | Default serving |
| FP8 / INT8 | 1 | High-throughput serving |
| INT4 (AWQ/GPTQ/Q4) | 0.5 | Memory-limited, edge |

### Approx. weight memory
| Model | FP16 | INT8/FP8 | INT4 |
|---|---|---|---|
| 7–8B | ~15 GB | ~8 GB | ~4–5 GB |
| 13B | ~26 GB | ~13 GB | ~7 GB |
| 34B | ~68 GB | ~34 GB | ~18 GB |
| 70B | ~140 GB | ~70 GB | ~35–40 GB |

### Metrics glossary
| Metric | Meaning |
|---|---|
| TTFT | Time to first token |
| TPOT / ITL | Time per output token / inter-token latency |
| E2E latency | TTFT + TPOT × (n−1) |
| Throughput | Tokens/s or requests/s overall |
| Goodput | Throughput meeting SLO |
| Queue time | Waiting before scheduling |
| KV usage | % of KV blocks in use |
| Cost / 1M tokens | GPU $/h ÷ tokens/h × 1e6 |

### Parallelism
| Type | Splits | Needs | Good for |
|---|---|---|---|
| Data | Requests across replicas | Load balancer | Throughput |
| Tensor | Weights inside layers | NVLink | Big models, lower latency |
| Pipeline | Layers across stages | Micro-batches | Multi-node |
| Expert | MoE experts | All-to-all | MoE models |

### Rollout strategies
| Strategy | User risk | Learns about |
|---|---|---|
| Shadow | None | Quality/perf offline |
| Canary | Low | Real errors, latency |
| A/B | Moderate | Business impact |
| Blue/green | Low (instant switch) | Fast rollback |

### Latency problems → fixes
| Symptom | Likely cause | Fix |
|---|---|---|
| High TTFT | Long prompt, no cache, queue | Prefix cache, chunked prefill, scale out |
| High TPOT | Large batch, bandwidth bound | Quantize, spec decoding, fewer seqs/GPU |
| Spiky p99 | Preemption, long outputs | More KV memory, limit tokens |
| Timeouts | Overload | Load shedding, autoscale |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
Llama-style 8B model in BF16: `8e9 × 2 B` = **16 GB** of weights. In INT4: `8e9 × 0.5 B` = **4 GB**.

### O2.
KV cache per token with 32 layers, 8 KV heads, head_dim 128, FP16: `2×32×8×128×2` = **131,072 bytes** (128 KiB). For 4,096 tokens: 512 MiB per sequence.

### O3.
80 layers, 8 KV heads, head_dim 128, FP16 (70B-class): `2×80×8×128×2` = **327,680 B** ≈ 320 KiB per token. 100 sequences × 4K tokens ≈ **128 GB** of KV cache.

### O4.
Bandwidth bound: 3.35 TB/s ÷ 16 GB weights ≈ **~209 tokens/s** upper bound for a single stream at batch 1. At INT4 (4 GB) the bound is ~840 tokens/s (real numbers are lower).

### O5.
TTFT 400 ms, TPOT 30 ms, 201 output tokens: E2E ≈ `0.4 + 0.03 × 200` = **6.4 s**.

### O6.
$3.00/h GPU, 1,500 tokens/s at full load, 40% utilisation: effective tokens/h = `1500×3600×0.4` = 2.16M → **$1.39 per 1M tokens**. At 80% utilisation → **$0.69**.

### O7.
Speculative decoding with acceptance rate α = 0.7 and k = 4: expected tokens per target pass = `(1−0.7⁵)/(1−0.7)` = `(1−0.168)/0.3` ≈ **2.77**.

### O8.
Three replicas each handle 20 req/s at SLO. Peak is 130 req/s, headroom 30% → need `130×1.3/20` = 8.45 → **9 replicas**.

### O9.
Prefix cache: system prompt 1,500 tokens, user part 100 tokens. With a cache hit, prefill processes only **100** tokens (≈ 94% less prefill work). If a timestamp is placed first in the prompt, the hit rate becomes **0**.

### O10.
Dynamic batch config: `max_queue_delay = 5 ms`, request arrives alone. It waits up to **5 ms** for others, then runs alone. Added latency ≤ 5 ms, so under light traffic, batching costs little.

### O11.
Retry storm: 1,000 clients, 3 immediate retries each, server returns 503. Load becomes up to **4,000** requests in a short window. Exponential backoff with jitter spreads it out.

### O12.
GPU cost: 4 GPUs × $2.5/h × 24 h × 30 days = **$7,200 per month** before storage, network and engineers.

---

# ✅ Part 15: MCQs

**1. Which phase of LLM inference is mainly memory-bandwidth-bound?**
A) Prefill  B) Decode  C) Tokenisation  D) Model download
**Answer: B**

**2. KV cache stores:**
A) Gradients  B) Keys and Values of previous tokens  C) Optimizer state  D) Training data
**Answer: B**

**3. PagedAttention mainly reduces:**
A) Network latency  B) KV-cache memory fragmentation and waste  C) Disk size  D) Training time
**Answer: B**

**4. Continuous batching means:**
A) Fixed batch size  B) Requests join and leave the batch at every token step  C) Only offline jobs  D) Using CPUs
**Answer: B**

**5. Best autoscaling signal for GPU LLM servers:**
A) CPU %  B) Queue depth / concurrent requests / KV usage  C) Disk usage  D) Pod age
**Answer: B**

**6. TTFT measures:**
A) Total tokens  B) Time to first output token  C) GPU temperature  D) Training time
**Answer: B**

**7. Which file format avoids arbitrary code execution on load?**
A) Pickle `.pt`  B) safetensors  C) Any zip  D) Python script
**Answer: B**

**8. A 13B model in FP16 needs roughly how much memory for weights?**
A) 6.5 GB  B) 13 GB  C) 26 GB  D) 52 GB
**Answer: C**

**9. Speculative decoding:**
A) Changes the output distribution  B) Uses a draft to propose tokens and the target to verify them  C) Needs no extra model or heads  D) Always slower
**Answer: B**

**10. Tensor parallelism requires:**
A) Fast GPU interconnect such as NVLink for best results  B) No communication  C) Only CPUs  D) One GPU only
**Answer: A**

**11. Prefix caching helps most when:**
A) Every prompt is unique from the first token  B) Many requests share a long identical prefix  C) Output is long  D) Using temperature 0
**Answer: B**

**12. Goodput is:**
A) Raw tokens/s  B) Throughput that meets the SLO  C) GPU clock speed  D) Cost per hour
**Answer: B**

**13. A readiness probe for a model server should pass when:**
A) The container starts  B) The model is loaded and warmed up  C) The image is pulled  D) Never
**Answer: B**

**14. Shadow deployment means:**
A) Users see the new model  B) Traffic is copied to the new model and outputs are discarded  C) Rolling back  D) Turning off monitoring
**Answer: B**

**15. INT4 weight-only quantization mainly saves:**
A) Network round trips  B) Memory and memory bandwidth  C) Tokenizer time  D) Disk latency only
**Answer: B**

**16. Which is true about retries?**
A) Retry instantly forever  B) Use exponential backoff, jitter and a retry budget  C) Never set timeouts  D) Retries reduce load
**Answer: B**

**17. GQA (grouped-query attention) helps serving because:**
A) It adds parameters  B) It reduces KV-cache size  C) It removes attention  D) It increases precision
**Answer: B**

**18. When a client disconnects mid-stream, the server should:**
A) Continue generating  B) Cancel generation and free KV blocks  C) Restart the model  D) Ignore it
**Answer: B**

**19. Multi-LoRA serving lets you:**
A) Serve many adapters on one base model  B) Train faster  C) Remove the base model  D) Avoid GPUs
**Answer: A**

**20. Self-hosting is most cost-effective when:**
A) Traffic is rare and spiky  B) Utilisation is high and steady  C) You have no ops staff  D) You want the newest frontier model
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

- Benchmarking with one short prompt and concluding "it is fast".
- Sizing GPUs from weight size only and forgetting the KV cache.
- Using CPU utilisation to autoscale GPU servers.
- No `max_tokens` / `max_model_len` limits; runaway requests hog capacity.
- Not cancelling generation after client disconnects.
- Marking pods ready before the model is loaded and warmed.
- Putting dynamic text (user name, date) at the start of the prompt and killing the prefix cache.
- Shipping a quantized model without re-running quality evals.
- Loading untrusted pickle checkpoints.
- Using `latest` tags for engines, models or tokenizers.
- Forgetting chat template or tokenizer parity after a model swap.
- Immediate retries without backoff, causing retry storms.
- Ignoring p95/p99 and measuring only averages.
- Running `model.train()` mode or leaving gradients on in serving code.
- Loading the model inside the request handler.
- Letting one tenant starve others (no per-tenant quotas).
- Logging raw prompts with PII.
- Choosing self-hosting for cost without measuring utilisation and ops effort.
- No rollback plan or canary for model changes.
- Scale-to-zero on user-facing paths with multi-minute cold starts.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You explain prefill vs decode and why decode is memory-bound, then use it to justify batching and quantization.
- You size capacity with numbers: weights, KV per token, tokens/s from load tests, headroom.
- You talk in TTFT, TPOT, p95/p99 and goodput, not just "latency".
- You tune with a load generator using realistic length distributions.
- You treat quantization, engine upgrades and driver changes like model changes: eval first, canary after.
- You design prompts for cache hits and set hard limits on input/output tokens.
- You put gateway, quotas, fallbacks and circuit breakers in front of GPU pools.
- You autoscale on queue and KV signals and plan for slow cold starts.
- You compute cost per 1M tokens and per successful task, and know the break-even for self-hosting.
- You secure the stack: safetensors, authN/Z, tenant isolation, patched engines.
- You keep runbooks, SLOs and incident learnings turned into alerts and regression tests.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Request path
```
client → gateway (auth, quota, route) → engine queue → scheduler
 → prefill (compute-bound, builds KV) → decode loop (bandwidth-bound, 1 token/step)
 → stream tokens (SSE) → stop → free KV → metrics/traces
```

### Optimisation ladder (do in this order)
1. Right engine (vLLM/TensorRT-LLM) + continuous batching.
2. Right precision (BF16 → FP8/INT8 → INT4 if evals pass).
3. Prefix caching + prompt layout; limit tokens.
4. Right GPU and parallelism (TP inside node, replicas for scale).
5. Speculative decoding for low-latency use cases.
6. Routing small models for easy tasks; cache; batch offline work.
7. Autoscale on queue/KV, keep warm capacity.

### Formulas
```
weights_bytes   = params × bytes_per_param
kv_per_token    = 2 × layers × kv_heads × head_dim × bytes
decode_max_tps  ≈ memory_bandwidth ÷ weight_bytes   (batch 1)
e2e_latency     = TTFT + TPOT × (out_tokens − 1)
cost_per_1M     = gpu_$_per_hour ÷ (tokens_per_s × 3600 × utilisation) × 1e6
replicas        = peak_load × (1 + headroom) ÷ load_per_replica
spec_tokens     = (1 − α^(k+1)) / (1 − α)
```

### Pre-launch checklist
- [ ] Model, tokenizer, chat template, engine and driver versions pinned.
- [ ] Evals pass (including after quantization) on a private golden set.
- [ ] Load tested with real length distributions; SLOs defined (TTFT, TPOT, error rate).
- [ ] Readiness/liveness/startup probes; warm-up on start.
- [ ] Limits: max input/output tokens, per-tenant quotas, timeouts, load shedding.
- [ ] Autoscaling on queue/KV; warm pool; scale-up time measured.
- [ ] Observability: metrics, traces, cost per tenant; PII redaction.
- [ ] Security: authN/Z, TLS, safetensors, patched images, egress limits.
- [ ] Rollout: shadow → canary → ramp; rollback tested; fallback provider/model ready.
- [ ] Runbooks and on-call for OOM, latency, GPU failure and quality regressions.

### Final checklist before the interview
- [ ] Explain batch/online/streaming serving and REST/gRPC/SSE.
- [ ] Explain prefill vs decode, KV cache maths, GQA and PagedAttention.
- [ ] Explain continuous batching, prefix caching, chunked prefill and speculative decoding.
- [ ] Compare quantization methods and what to measure after quantizing.
- [ ] Choose GPUs and parallelism strategies; estimate memory and cost per token.
- [ ] Describe Kubernetes deployment, autoscaling signals and cold-start mitigation.
- [ ] Describe canary/shadow rollouts, versioning, observability and SLOs.
- [ ] Argue self-host vs API with numbers; describe routing, caching and fallbacks.
- [ ] Prepare a project story with before/after latency, throughput and cost.
