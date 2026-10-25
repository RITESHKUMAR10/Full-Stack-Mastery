# Fine-Tuning, LoRA & QLoRA Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets the **2025–2026 LLM fine-tuning stack**: PyTorch 2.x, Hugging Face **Transformers 4.4x+, PEFT 0.1x, TRL 0.1x+ (SFTTrainer, DPOTrainer, GRPOTrainer, KTO, ORPO), Accelerate, bitsandbytes (4-bit NF4 / 8-bit), Datasets**, plus **Unsloth, Axolotl, LLaMA-Factory, torchtune, DeepSpeed (ZeRO), FSDP / FSDP2, FlashAttention, Liger kernels, vLLM / SGLang for serving adapters**, and hosted fine-tuning offered by providers (OpenAI fine-tuning, cloud platforms such as Bedrock / Vertex / Azure; availability for any given Claude model is limited and changes: verify). **Library APIs (argument names such as `max_seq_length` vs `max_length`, `processing_class` vs `tokenizer`, `torch_dtype` vs `dtype`), default hyper-parameters, supported models and provider offerings change often**: anything marked "verify" should be checked in current docs. The concepts (data quality, chat templates, loss masking, parameter-efficient methods, quantisation, evaluation, forgetting, alignment objectives, memory maths) are stable. Examples use the sample name **Ritesh Kumar** and small support / invoice / HR style datasets.
> This file covers when (and when not) to fine-tune, the decision between prompting / RAG / fine-tuning, types of fine-tuning (full, continued pre-training, SFT / instruction tuning, preference optimisation: RLHF, DPO, IPO, KTO, ORPO, SimPO; RL with verifiable rewards: PPO, GRPO; distillation), data preparation (formats, chat templates, loss masking, quality, deduplication, synthetic data, decontamination), parameter-efficient fine-tuning (LoRA, rank / alpha / dropout / target modules, rsLoRA, DoRA, LoRA+, adapters, prefix / prompt tuning, IA3, VeRA, LoftQ), quantisation (INT8, NF4, double quantisation, paged optimisers), QLoRA, memory and compute estimation, training recipes and hyper-parameters (learning rate, epochs, batch size, warm-up, scheduler, packing, gradient checkpointing, mixed precision), distributed training (DDP, FSDP, DeepSpeed), evaluation (task metrics, regression suites, LLM-as-judge, catastrophic forgetting), merging and serving adapters (merge_and_unload, multi-LoRA, vLLM), model merging (TIES, DARE, SLERP), embedding / re-ranker / vision fine-tuning, fine-tuning via APIs, safety and alignment concerns, MLOps (tracking, reproducibility, registries), cost analysis, and common pitfalls. Related topics: generative AI overview in `063_Generative-AI.md`, prompt engineering in `064_Prompt-Engineering.md`, LLM APIs in `065_OpenAI-and-Claude-API.md`, LLMs and RAG in `066_LLM-and-RAG.md`, vector databases in `067_Vector-Databases.md`, AI agents in `069_AI-Agents.md`, evaluation and guardrails in `072_LLM-Evaluation-and-Guardrails.md`, serving in `073_Model-Serving-and-Inference.md`, AI safety in `076_AI-Safety-and-Responsible-AI.md`, deep learning in `../10_AI_and_ML/057_Deep-Learning.md`, PyTorch in `../10_AI_and_ML/058_PyTorch.md`, Hugging Face in `../10_AI_and_ML/062_Hugging-Face.md`, MLOps in `../10_AI_and_ML/074_MLOps.md`, reinforcement learning in `../10_AI_and_ML/061_Reinforcement-Learning.md`.

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

### Q1. What is fine-tuning? *(Must-know)*
Continuing the training of a pre-trained model on a smaller, task-specific dataset so it adapts its **behaviour** (style, format, domain language, task skill). The pre-trained weights are the starting point; training updates all or a subset of them.

### Q2. Pre-training vs fine-tuning
Pre-training learns general language from trillions of tokens (extremely expensive). Fine-tuning uses thousands to millions of examples (affordable) to specialise the model. You almost never pre-train from scratch.

### Q3. Prompting vs RAG vs fine-tuning *(Must-know)*
| Need | Best approach |
|---|---|
| Quick prototype, general tasks | Prompting (few-shot) |
| Fresh / private / changing **knowledge** | **RAG** |
| Consistent **style, format, tone, tool-use behaviour** | **Fine-tuning** |
| Shorter prompts / lower latency / cheaper small model | Fine-tuning (distilled) |
| Narrow classification / extraction at huge volume | Fine-tune a small model |
Rule: **RAG for what the model should know; fine-tuning for how it should behave.**

### Q4. When fine-tuning is a good idea
Stable task with labelled examples; prompt is long and fragile; need consistent structured output; need a small, cheap, fast model; domain jargon or language the base model handles poorly; on-premise/private deployment; behaviour (tone, policy) that prompts can't reliably enforce.

### Q5. When fine-tuning is a bad idea
To add fast-changing facts (use RAG); with tiny/noisy data; before trying strong prompting + evaluation; when you can't measure quality; when the base model already solves the task well; when you can't maintain retraining as base models change.

### Q6. Types of fine-tuning
Full fine-tuning (all weights), parameter-efficient fine-tuning (LoRA, adapters…), continued pre-training (domain text, no labels), supervised fine-tuning / instruction tuning (prompt → response), preference tuning (DPO etc.), RL-based tuning (PPO / GRPO), distillation (teacher → student).

### Q7. Supervised fine-tuning (SFT)
Train on (instruction, ideal response) pairs with next-token cross-entropy, usually computing loss **only on the response tokens**. Teaches the model to follow a format and behaviour.

### Q8. What is LoRA? *(Must-know)*
**Low-Rank Adaptation**: freeze the pretrained weight `W` and learn a small update `ΔW = B·A` where `A ∈ R^{r×k}`, `B ∈ R^{d×r}` and rank `r ≪ min(d, k)`. Output = `Wx + (α/r)·BAx`. Only `A` and `B` are trained (often <1% of parameters), so memory and storage are tiny and adapters are swappable.

### Q9. What is QLoRA? *(Must-know)*
LoRA on top of a **4-bit quantised** base model (NF4 with double quantisation and paged optimisers). Base weights stay frozen in 4-bit; LoRA adapters train in BF16/FP16. Lets you fine-tune 7B–70B models on a single consumer/prosumer GPU with small quality loss.

### Q10. Why LoRA works (intuition)
Task-specific weight updates have low intrinsic rank, so a low-rank decomposition captures most of the needed change with far fewer parameters.

### Q11. Key LoRA hyper-parameters
`r` (rank: 8–64 typical), `lora_alpha` (scaling, often `2r` or `r`), `lora_dropout` (0–0.1), `target_modules` (which layers: attention `q,k,v,o` and often MLP `gate,up,down` or "all-linear"), `bias`, `task_type`.

### Q12. Minimal LoRA config
```python
from peft import LoraConfig, get_peft_model
cfg = LoraConfig(r=16, lora_alpha=32, lora_dropout=0.05, bias="none",
                 target_modules="all-linear", task_type="CAUSAL_LM")
model = get_peft_model(base_model, cfg)
model.print_trainable_parameters()      # e.g. trainable params: 41,943,040 || all params: 8,072,204,288 || 0.52%
```

### Q13. Minimal QLoRA loading
```python
import torch
from transformers import AutoModelForCausalLM, BitsAndBytesConfig
bnb = BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_quant_type="nf4",
                         bnb_4bit_compute_dtype=torch.bfloat16, bnb_4bit_use_double_quant=True)
model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3.1-8B-Instruct",
                                             quantization_config=bnb, device_map="auto")
```

### Q14. Dataset format for chat SFT
```json
{"messages": [
  {"role": "system", "content": "You are a concise support assistant for Acme."},
  {"role": "user", "content": "Where is my order A1042?"},
  {"role": "assistant", "content": "Order A1042 shipped yesterday and arrives in 2 days."}]}
```
One JSON object per line (JSONL).

### Q15. Chat templates *(Must-know)*
Each instruct model expects a specific token format for roles. Use `tokenizer.apply_chat_template(messages, ...)` for **both training and inference**. A mismatched template silently degrades quality.

### Q16. Loss masking
Compute loss only on assistant tokens (not the system/user prompt) so the model learns to *respond*, not to *repeat prompts*. TRL supports `assistant_only_loss` / completion-only collators (verify per version).

### Q17. Epochs and learning rate (starting points)
LoRA/QLoRA: LR ≈ 1e-4 – 2e-4, 1–3 epochs. Full fine-tuning: LR ≈ 1e-5 – 2e-5 (lower for large models). Too many epochs overfit; watch validation loss and task metrics.

### Q18. Overfitting & catastrophic forgetting
Overfitting: memorises the training set, poor generalisation. **Catastrophic forgetting**: loses general abilities after narrow training. Mitigate with smaller LR/rank, fewer epochs, mixing in general data, LoRA, regularisation, and regression evaluation.

### Q19. Data quality over quantity
Hundreds to a few thousand high-quality, diverse, consistent examples often beat tens of thousands of noisy ones. Label errors, inconsistent style and duplicates hurt directly.

### Q20. Train/validation/test split
Hold out validation (tuning/early stopping) and a **locked test set** (final report). Split by source/user/document to avoid leakage; deduplicate before splitting.

### Q21. Evaluating a fine-tuned model
Task metrics (exact match, F1, accuracy), format validity, human/LLM-judge preference vs the base + prompt baseline, and regression tests on general abilities and safety. Always compare against a **strong prompted baseline**.

### Q22. What is an adapter?
A small set of trained weights (LoRA matrices) saved separately from the base model (tens–hundreds of MB). You load the base model plus the adapter, or merge them.

### Q23. Merging an adapter
`model = model.merge_and_unload()` folds `ΔW` into base weights for simple deployment (no extra latency). Merge into a **BF16/FP16** base (not the 4-bit one) for best quality, then evaluate.

### Q24. Hardware needs (rule of thumb)
QLoRA 7–8B: ~12–24 GB VRAM; QLoRA 13B: ~24 GB; QLoRA 70B: ~48–80 GB; full fine-tune 7B with AdamW: ~100+ GB (needs sharding). Activations depend on sequence length and batch size.

### Q25. Tools for beginners
Hugging Face TRL + PEFT, Unsloth (fast/low-memory), Axolotl and LLaMA-Factory (config-driven), torchtune, provider fine-tuning APIs (upload JSONL, pick model, get a tuned model ID).

### Q26. Hosted fine-tuning (concept)
Provider APIs let you upload training data and receive a custom model hosted by the provider. Pros: no GPU ops. Cons: limited control, provider lock-in, data-governance review, only certain models supported (check each provider's current list).

### Q27. Distillation
Train a small "student" on outputs (and sometimes logits) of a larger "teacher" for a narrow task. Produces cheaper, faster models; check provider terms about using model outputs for training.

### Q28. Synthetic data
Generate training examples with a stronger model, then filter/verify and mix with real data. Risks: errors, low diversity, style collapse, licence restrictions, evaluation leakage.

### Q29. Safety after fine-tuning
Fine-tuning can weaken safety behaviours. Include refusal/safety examples, run safety evaluations, and keep guardrails at runtime.

### Q30. Cost sketch
QLoRA on a single GPU: dataset of 5k examples × 800 tokens ≈ 4M tokens/epoch; a few hours on a 24 GB GPU for 7–8B. Costs are mostly compute time plus **data curation and evaluation effort**.

---

# 🔵 Part 2: Junior (1–3 years)

### Q31. LoRA math in detail *(Must-know)*
For a frozen weight `W₀ ∈ R^{d×k}`, LoRA learns `ΔW = (α/r)·B A` with `B` initialised to **zeros** and `A` to small random values, so training starts at the base model's behaviour. Trainable parameters per adapted matrix = `r(d + k)` instead of `dk`. At inference `W = W₀ + ΔW` can be merged.

### Q32. Choosing rank `r`
Small tasks (format/style): 8–16. Complex/domain-shift tasks: 32–128. Higher rank adds capacity and memory and can overfit; tune with validation. Rank matters less than data quality in most cases.

### Q33. `lora_alpha` and scaling
Scaling factor = `α/r` (or `α/√r` with rsLoRA). Many recipes set `α = 2r` or `α = r`. If you change `r`, adjust `α` (or use rsLoRA) so the effective update magnitude stays reasonable; LR and `α` interact.

### Q34. Target modules
Attention only (`q_proj, v_proj`) is the original LoRA recipe; adding `k, o` and MLP layers (`gate_proj, up_proj, down_proj`) usually improves quality ("all-linear"). Names differ by architecture; inspect `model.named_modules()`.

### Q35. LoRA dropout
Regularises adapters (0.05–0.1 typical). Often 0 for large datasets; useful on small ones.

### Q36. NF4 quantisation (QLoRA) *(Must-know)*
**4-bit NormalFloat**: quantisation levels placed at quantiles of a normal distribution, optimal for normally distributed weights. Weights are quantised per block (e.g., 64 values) with a scale; **double quantisation** quantises the scales too; weights are de-quantised to BF16 on the fly for matmuls. Gradients flow through to LoRA parameters only.

### Q37. Paged optimisers
Optimiser states can spike memory; paged optimisers (e.g., `paged_adamw_8bit/32bit`) use unified memory to page states between GPU and CPU to avoid OOM during spikes.

### Q38. SFTTrainer example (TRL)
```python
from trl import SFTTrainer, SFTConfig
args = SFTConfig(output_dir="out", per_device_train_batch_size=2, gradient_accumulation_steps=8,
                 learning_rate=2e-4, num_train_epochs=2, lr_scheduler_type="cosine", warmup_ratio=0.03,
                 bf16=True, gradient_checkpointing=True, logging_steps=10, save_strategy="epoch",
                 eval_strategy="epoch", max_length=2048, packing=False, report_to="none")
trainer = SFTTrainer(model=model, args=args, train_dataset=train_ds, eval_dataset=val_ds,
                     peft_config=cfg, processing_class=tokenizer)      # verify argument names for your version
trainer.train()
trainer.save_model("out/adapter")
```

### Q39. Effective batch size
`per_device_batch × gradient_accumulation × num_GPUs`. Typical effective batch 16–64 sequences for SFT. Larger batches need higher LR and warm-up.

### Q40. Gradient checkpointing
Recompute activations during backward instead of storing them: saves memory (often 30–60%) for ~20–30% more compute. Essential for long sequences on limited GPUs.

### Q41. Sequence length & packing
Training memory scales with sequence length. **Packing** concatenates short examples into full-length sequences for efficiency; ensure correct attention masking/position reset to prevent cross-example attention (varlen/flash-attn support; verify).

### Q42. Mixed precision (BF16 vs FP16)
BF16 (same exponent range as FP32) is preferred on Ampere+ GPUs: no loss scaling needed. FP16 needs a GradScaler. Keep LoRA weights in FP32/BF16 as supported.

### Q43. Learning-rate schedulers
Cosine or linear decay with warm-up (3–10% of steps). Constant LR with warm-up also used for short runs. Monitor loss spikes; lower LR if unstable.

### Q44. Early stopping/checkpoint selection
Choose checkpoints by validation **task metrics**, not only loss (loss can keep improving while generations degrade). Save per-epoch checkpoints and evaluate.

### Q45. Dataset preparation workflow
Collect → clean (PII, duplicates, malformed) → normalise formatting → apply chat template → split → inspect samples manually → compute token length stats → filter outliers → version the dataset.

### Q46. Deduplication & decontamination
Remove exact and near-duplicate examples (MinHash/embeddings), and remove any overlap with evaluation sets/benchmarks to avoid inflated scores.

### Q47. Balancing data
Cover the full distribution of real inputs (edge cases, short/long, languages, refusals). Over-represented patterns dominate behaviour. Add negative/"I don't know" examples if abstention is desired.

### Q48. Instruction vs completion data
Instruction/chat data (roles) for assistants; raw text for continued pre-training; prompt–completion pairs for classification/extraction. Pick the format your inference path will use.

### Q49. Multi-turn data
Include full conversations; compute loss on assistant turns (all or last only per design); ensure the template matches inference; handle tool calls as structured messages if the model supports them.

### Q50. Tool-use fine-tuning
Train on conversations containing tool-call messages and tool results in the model's native format so it learns when and how to call tools and how to use results. Validate argument JSON.

### Q51. Structured-output fine-tuning
Train on (input → strict JSON) examples; evaluate schema validity and field accuracy; combine with constrained decoding at inference for guaranteed syntax.

### Q52. Embeddings fine-tuning (brief)
Fine-tune bi-encoders with contrastive loss on (query, positive, hard negatives) for domain retrieval; often a bigger win than fine-tuning the generator for RAG. See `066_LLM-and-RAG.md`.

### Q53. Vision-language fine-tuning (brief)
LoRA on the language backbone (and optionally projector/vision tower) with image–text pairs; watch image resolution/token counts and memory; use model-specific processors.

### Q54. Reward models (brief)
Train a classifier/regressor on preference pairs (Bradley–Terry loss) to score responses; used in RLHF/best-of-N. Quality depends on label consistency.

### Q55. DPO in one minute *(Must-know)*
**Direct Preference Optimisation** trains directly on (prompt, chosen, rejected) triples with a loss that increases the policy's log-prob margin for chosen vs rejected relative to a reference model: `−log σ(β[(logπ(y_w)−logπ_ref(y_w)) − (logπ(y_l)−logπ_ref(y_l))])`. No reward model or RL loop; `β` (≈0.1) controls deviation from the reference.

### Q56. Other preference methods
IPO (less overfit-prone), KTO (works with binary good/bad labels), ORPO (no reference model; combines SFT and odds-ratio preference), SimPO (length-normalised, reference-free), RLAIF (AI-generated preferences). Choice depends on data type and stability.

### Q57. SFT before DPO
Usually run SFT first so the policy matches the data distribution, then preference-tune with the SFT model as the reference. Skipping SFT can destabilise preference learning.

### Q58. Reasoning/RL fine-tuning (GRPO)
Group Relative Policy Optimisation samples several completions per prompt and uses group-normalised rewards as advantages (no value network). With **verifiable rewards** (unit tests, exact answers) it trains reasoning behaviours. Watch reward hacking, length inflation and format collapse. See `../10_AI_and_ML/061_Reinforcement-Learning.md`.

### Q59. Saving and loading adapters
```python
model.save_pretrained("adapter")                            # adapter weights + config only
from peft import PeftModel
base = AutoModelForCausalLM.from_pretrained(name, torch_dtype=torch.bfloat16, device_map="auto")
model = PeftModel.from_pretrained(base, "adapter")
```

### Q60. Pushing to the Hub safely
Use private repos for proprietary adapters; include a model card (data, hyper-parameters, evaluation, limitations, licence of base model); respect base-model licences (some restrict derivatives/commercial use).

---

# 🟡 Part 3: Mid (3–5 years)

### Q61. Memory accounting for full fine-tuning vs LoRA *(Must-know)*
Full FT with AdamW (mixed precision): weights (BF16) 2 B/param + master FP32 copy 4 B + grads 2–4 B + Adam m and v 8 B ≈ **16–18 B/param** (+ activations). A 7B model ≈ 112–126 GB. LoRA: base weights frozen (2 B/param BF16 or ~0.5 B/param NF4) + tiny adapter params/grads/optimiser states + activations. QLoRA 7B ≈ ~4–5 GB weights + activations (several GB) → fits 12–24 GB.

### Q62. Activation memory
Scales with `batch × seq_len × layers × hidden` (and attention if not using FlashAttention). Reduce with gradient checkpointing, smaller micro-batches (+accumulation), shorter sequences, FlashAttention, and sequence packing.

### Q63. FlashAttention & kernels
Memory-efficient exact attention (tiled, IO-aware) cuts memory and speeds training; fused kernels (Liger, Unsloth) reduce overhead (RMSNorm, RoPE, cross-entropy). Enable via `attn_implementation="flash_attention_2"/"sdpa"` (verify compatibility).

### Q64. Distributed fine-tuning: DDP vs FSDP vs DeepSpeed
DDP replicates the model (fits-on-one-GPU case). **FSDP / ZeRO-3** shard parameters, gradients and optimiser states across GPUs (needed for full FT of large models). QLoRA + FSDP is possible (supported in TRL/PEFT/Accelerate; verify config). Use `accelerate launch` with a config.

### Q65. DeepSpeed ZeRO stages
ZeRO-1 shards optimiser states; ZeRO-2 adds gradients; ZeRO-3 adds parameters; offload to CPU/NVMe trades speed for memory. Pick the lowest stage that fits.

### Q66. Multi-GPU LoRA tips
Use per-device batch sizing, gradient accumulation to hit the effective batch, `ddp_find_unused_parameters=False` when possible, save adapters only on rank 0, and keep the base weights identical across ranks.

### Q67. LoRA variants *(Must-know)*
- **rsLoRA**: scales by `α/√r` to stabilise higher ranks.
- **DoRA**: decomposes weights into magnitude and direction; often better quality at same rank.
- **LoRA+**: different learning rates for `A` and `B`.
- **LoftQ / QA-LoRA**: quantisation-aware initialisation.
- **VeRA / IA³ / (IA)^3**: even fewer parameters (shared random matrices / learned scaling vectors).
Variants help at the margin; data/hyper-parameters matter more.

### Q68. Prefix tuning, prompt tuning, P-tuning
Learn virtual token embeddings (soft prompts) or per-layer prefix key/values while freezing the model. Very parameter-efficient but generally weaker than LoRA for generative LLMs and consume context length.

### Q69. Adapters (bottleneck)
Insert small trainable MLP modules between layers (Houlsby/Pfeiffer). Adds inference latency (unless merged conceptually) vs LoRA which can be merged with no overhead.

### Q70. Continued pre-training (domain adaptation)
Train on large unlabelled domain text (legal, medical, code, language) with the causal LM objective, then SFT. Needs more data/compute; mix in general text (replay) to limit forgetting; consider LoRA with high rank or full FT of selected layers; expand tokenizer only when necessary.

### Q71. Tokenizer changes & vocabulary extension
Adding tokens requires resizing embeddings (`resize_token_embeddings`) and training the new embeddings (and often `lm_head`); in PEFT use `modules_to_save=["embed_tokens", "lm_head"]`. Prefer reusing existing tokens/special tokens when possible.

### Q72. `modules_to_save`
Keeps selected full modules trainable alongside LoRA (e.g., classification head, embeddings). They're saved with the adapter, increasing its size.

### Q73. Classification/token-classification with LoRA
Use `AutoModelForSequenceClassification` with LoRA (`task_type="SEQ_CLS"`), train the head via `modules_to_save`. For small encoders, full fine-tuning is often simpler and better.

### Q74. Hyper-parameter search strategy
Fix data and eval first; sweep LR (1e-4, 2e-4, 5e-5), rank (8/16/64), epochs (1–3), and target modules on a small subset; use early pruning (Optuna/W&B sweeps); pick by held-out task metric and regression suite; confirm on the full run with multiple seeds if feasible.

### Q75. Data scaling & learning curves
Train on 10%, 25%, 50%, 100% of data and plot validation metric. Flat curves → data quality/capacity issue; steep → collect more data. Informs labelling budget.

### Q76. Loss vs generation quality
Lower loss ≠ better outputs. Evaluate generations (greedy/seeded where possible) on held-out prompts; check format adherence, factuality and safety. Use sample reviews every checkpoint.

### Q77. Evaluating forgetting/regression
Maintain a general-ability suite (reasoning, instruction following, multilingual, coding, safety) and compare base vs tuned. Quantify drops; mitigate with data mixing, lower rank/LR, adapter scaling at inference (reduce adapter weight), or model merging.

### Q78. Adapter scaling at inference
Scale the adapter's contribution (`scale < 1`) to interpolate between base and tuned behaviour — a cheap knob to trade specialisation vs generality (supported in PEFT/vLLM variants; verify).

### Q79. Merging multiple LoRAs/models
Linear/weighted averaging, **TIES** (trim, elect sign, merge), **DARE** (drop and rescale), **SLERP**, task arithmetic; tools like mergekit. Useful to combine skills without retraining; evaluate carefully since interference occurs.

### Q80. Serving adapters
Options: merge into base for simplest serving; or keep adapters separate and serve many with **multi-LoRA** (vLLM LoRA, LoRAX, TGI) sharing one base model in memory with per-request adapter selection. Mind adapter rank/size limits, batching efficiency, and cold-load latency.

### Q81. Quantised serving of fine-tuned models
After merging, quantise (AWQ/GPTQ/GGUF/FP8) and re-evaluate; quantisation-aware choices (calibration data in-domain) matter. For QLoRA-trained adapters, merging into a de-quantised base then re-quantising is typical.

### Q82. Hosted fine-tuning APIs (OpenAI-style) workflow
Prepare JSONL (chat format), validate, upload, create a job with base model + hyper-parameters (epochs, LR multiplier, batch size), monitor loss/metrics, evaluate the resulting model ID, deploy behind your gateway. Track cost per training token and inference premium.

### Q83. Provider-specific notes (Claude)
First-party fine-tuning availability for Claude models is limited and changes; some options exist via cloud platforms for particular models (verify current offerings). For many Claude use cases the recommended levers are prompting, structured outputs, prompt caching, retrieval and tool use, with fine-tuning evaluated only when those fall short.

### Q84. Data governance for fine-tuning
Consent and licensing of training data, PII removal, retention, access control, auditability of dataset versions, and deletion procedures (models can memorise training data). Document in a data card.

### Q85. Memorisation & privacy risks
Fine-tuned models can regurgitate training examples (secrets, PII). Mitigate by deduplication, PII scrubbing, lower epochs/rank, canary tests for extraction, and differential-privacy methods where required.

### Q86. Alignment tax and safety evaluation
Narrow tuning can erode refusal behaviours or introduce biases. Run red-team and safety suites pre/post; include safety data in the mix; keep runtime moderation. Document residual risks.

### Q87. Reproducibility
Fix seeds, log library versions, dataset hash, hyper-parameters, hardware; use deterministic data order where possible; track experiments (W&B/MLflow); store adapters with metadata linking to data and code commit.

### Q88. Experiment tracking & registry
Log loss curves, learning rate, grad norm, eval metrics, sample generations; register adapters with versions and promotion stages; link to evaluation reports and model cards. See `../10_AI_and_ML/074_MLOps.md`.

### Q89. CI for fine-tuning pipelines
Smoke-train on a tiny model/subset in CI, validate data schema/templating, run evaluation scripts, check artefact integrity, and gate promotion on regression thresholds.

### Q90. Typical failure modes
Wrong chat template, loss on prompt tokens, too-high LR (divergence), too many epochs (overfit), duplicated/contaminated data, truncated responses (max length too small), padding side/EOS issues, merging errors, train/serve template mismatch.

---

# 🟠 Part 4: Senior (5–7 years)

### Q91. Decision framework: prompt vs RAG vs fine-tune vs distill *(Must-know)*
1) Build an evaluation set. 2) Baseline with the best prompt (+ structured outputs, caching). 3) Add retrieval if knowledge is the gap. 4) Fine-tune only if behaviour/format/latency/cost gaps remain and you have quality data. 5) Distill to smaller models for volume. 6) Re-evaluate on each base-model upgrade. Quantify gain per added complexity.

### Q92. Business case for fine-tuning
Compare total cost: (data curation + training + evaluation + hosting + maintenance + re-training on model changes) vs savings (shorter prompts, cheaper/smaller model, higher accuracy, lower latency). Include risk (drift, security). Many cases don't pay off; some (high-volume narrow tasks) pay off massively.

### Q93. Data engineering for SFT at scale
Source mixing with ratios, quality classifiers/filters, dedupe (MinHash LSH), language ID, PII scrubbing, format normalisation, difficulty/length bucketing, curriculum ordering, shard formats (Parquet/WebDataset/JSONL), deterministic sampling with seeds, dataset versioning (DVC/lakeFS).

### Q94. Synthetic data pipelines (robust)
Seed prompts/personas → generate with strong model(s) → automatic validation (schema, unit tests, retrieval grounding) → LLM/judge + heuristic filtering → human spot checks → dedupe/diversity enforcement → mix with real data → evaluate on real held-out data. Beware of self-reinforcing errors and licence terms.

### Q95. Rejection sampling / best-of-N fine-tuning
Sample N responses per prompt, score with verifiers/reward models, keep the best, fine-tune on them (RFT/expert iteration). Good for tasks with verifiable correctness (code, math, structured output); monitor diversity collapse.

### Q96. Preference data collection
Pairwise comparisons from humans or AI judges with clear rubrics; on-policy samples from the current model; balance length; avoid position bias; measure inter-annotator agreement; include hard negatives and refusals. Data quality dominates algorithm choice.

### Q97. DPO pitfalls & remedies
Likelihood displacement (both chosen/rejected probabilities fall), length exploitation, over-optimisation. Remedies: SFT term (RPO/ORPO-style), lower `β`/LR, early stopping, length normalisation (SimPO), on-policy data, regularisation via reference mixing, evaluation on held-out preferences and capability suites.

### Q98. RLHF pipeline engineering
SFT → reward model → PPO/GRPO with KL penalty → evaluation → red-team. Infrastructure: generation engine (vLLM) + trainer (FSDP/DeepSpeed), reward service, KL controller, rollout buffers. Costly and finicky; consider DPO/GRPO with verifiable rewards first.

### Q99. Reward hacking & over-optimisation
Policies exploit reward-model weaknesses (verbosity, sycophancy). Use KL penalties, reward ensembles, early stopping on gold metrics, length controls, periodic reward-model refresh, and human audits.

### Q100. Training stability toolkit
Gradient clipping (1.0), warm-up, BF16, lower LR, loss-spike skipping, deterministic data order for reproducing spikes, monitoring gradient norms and LR, checking for bad batches, and resume from last-good checkpoint.

### Q101. Throughput engineering
Use packing, FlashAttention, fused kernels, `torch.compile` (verify), larger micro-batches with checkpointing trade-offs, NVMe-backed data loading, sorted-by-length batching, and tune `num_workers`. Measure tokens/sec and MFU; fix data loader stalls first.

### Q102. Long-context fine-tuning
Extend context via RoPE scaling (YaRN/NTK), train on long examples with sequence/context parallelism or FlashAttention + checkpointing, mix short and long data, and evaluate "needle" and real long-document tasks to ensure short-context quality doesn't regress.

### Q103. Multilingual/Indic fine-tuning
Check tokenizer fertility (tokens/word) for the language; consider continued pre-training on target-language text, balanced multilingual SFT, transliteration/code-mixed data (Hinglish), native-speaker evaluation, and per-language metrics. Watch for English regression.

### Q104. Domain-specific fine-tuning (legal/medical/finance)
Curate authoritative corpora with expert review, include refusal/uncertainty behaviour, evaluate with expert-written rubrics and safety checks, add retrieval for facts, ensure compliance/regulatory review, and keep human oversight.

### Q105. Code models fine-tuning
Use repo-level context, fill-in-the-middle (FIM) formatting, unit-test-based rejection sampling, license-aware data, execution sandboxes for verification, and evaluate with test pass rates (pass@k).

### Q106. Agentic/tool-use fine-tuning
Collect trajectories (including failures and recoveries), format tool calls precisely, train with loss on assistant actions, include negative examples (when not to call tools), evaluate on simulated environments (task success, tool accuracy), and keep guardrails at runtime. See `069_AI-Agents.md`.

### Q107. Continual updates & model refresh strategy
Base models improve quickly. Maintain training data/recipes as reusable assets; automate re-training on new bases; compare against the new base + prompting; sunset fine-tunes that no longer beat baselines.

### Q108. Adapter lifecycle management
Registry with metadata (base model hash, data version, metrics, owner), semantic versioning, compatibility checks, canary rollout, rollback, deprecation policy, and per-tenant adapters with access control.

### Q109. Multi-tenant personalisation with LoRA
Per-customer adapters on a shared base: isolate data, enforce tenant routing, cap adapter count/size, cold-load strategies (LRU caches), per-tenant evaluation, and privacy (no cross-tenant training data mixing).

### Q110. Security of fine-tuning pipelines
Protect training data (encryption, access control), scan datasets for secrets/PII, verify third-party datasets and base weights (safetensors, hashes), isolate training jobs, and guard against **data poisoning/backdoors** (trigger phrases) via provenance, anomaly detection and red-team tests.

### Q111. Backdoor/poisoning risks
Malicious examples can implant triggers causing harmful outputs. Controls: trusted data sources, dataset audits, outlier detection, canary prompts, and evaluation for conditional behaviours.

### Q112. Evaluating generative quality at scale
Mix automatic metrics (exact match/F1/execution), calibrated LLM judges with rubrics, pairwise preference vs baseline, and human review; ensure statistical power (confidence intervals), multiple seeds for generation, and slice analysis (language, topic, length).

### Q113. Cost optimisation in training
Use QLoRA/LoRA, spot/preemptible instances with checkpoint-resume, right-sized GPUs, shorter sequences, data pruning (remove redundant examples), early stopping, and small-scale ablations before full runs. Track cost per experiment.

### Q114. Governance & documentation
Model cards (intended use, data, training, evaluation, limitations), data cards, risk assessments, approval workflows, audit logs, licence compliance (base model + datasets), incident response for harmful outputs.

### Q115. When to stop fine-tuning and use something else
If gains are marginal vs prompting, maintenance burden outweighs benefits, evaluation is unclear, base models improve past your tuned model, or the problem is actually knowledge (use RAG) or logic (use code/tools).

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q116. Fine-tuning platform architecture
Data lake + versioned datasets → data quality/PII pipelines → experiment orchestration (Kubernetes/Slurm, queueing, GPU scheduling) → standardised training recipes (TRL/Axolotl/torchtune) → tracking & registry → automated evaluation (task + regression + safety) → deployment (merge/multi-LoRA serving) → monitoring & feedback → governance. Provide self-service templates for teams.

### Q117. Build vs buy (training stack)
Hosted fine-tuning (fast start, limited control), managed ML platforms (SageMaker/Vertex/Azure ML/Databricks), or self-managed GPU clusters (max control, ops cost). Decide by data sensitivity, scale, model choice, team skills and exit strategy; keep datasets/recipes portable.

### Q118. Model portfolio strategy
Frontier API for hard/rare tasks; mid-size open model + LoRA for domain tasks; small distilled models for high-volume narrow tasks; routing layer to choose. Re-evaluate quarterly as models and prices change.

### Q119. Compute planning
Estimate tokens × epochs × parameters (≈ `6·N·D` FLOPs for full FT; much less trainable compute for LoRA but forward/backward still traverse the base), GPU hours, queue times, and budgets; reserve capacity for evaluation and re-training bursts.

### Q120. Governance & risk tiers
Tier use cases by impact; require stronger controls (data review, bias/safety testing, human oversight, audit) for high-risk applications; maintain an inventory of fine-tuned models/adapters with owners and data lineage; define retirement processes.

### Q121. IP, licensing and compliance
Check base-model licences (commercial use, derivative restrictions, naming/attribution), dataset licences, provider terms on output usage for training, data residency, and regulatory requirements (EU AI Act GPAI obligations, DPDP). Involve legal early; keep records. Verify current terms.

### Q122. Org & skills
Data engineers/curators, applied ML engineers, evaluation specialists, infra/MLOps, domain experts for labelling, security/privacy partners. Invest in evaluation and data tooling more than in exotic algorithms.

### Q123. Measuring ROI
Task success lift, human edit rate, latency/cost per request vs baseline, deflection/automation rate, risk incidents, plus total cost of ownership; run A/B or staged rollouts; stop projects failing to beat baselines.

### Q124. Long-term resilience
Abstract model and training interfaces, keep reproducible pipelines, maintain evaluation suites as durable assets, plan upgrades to new base models, avoid vendor-specific lock-in in data formats, and keep fallback paths (prompted frontier model).

### Q125. Communicating with executives
Frame fine-tuning as a targeted investment with measurable gains and recurring costs: show baseline vs tuned metrics, cost curves, risks (forgetting, safety, maintenance), and decision gates. Prefer evidence from pilots over narratives.

---

# 💻 Part 6: Hands-On Tasks & Code

### Task 1. Prepare chat-format data with the model's template and check token lengths
```python
import json, numpy as np
from datasets import load_dataset
from transformers import AutoTokenizer

tok = AutoTokenizer.from_pretrained("meta-llama/Llama-3.1-8B-Instruct")
ds = load_dataset("json", data_files="support_chat.jsonl", split="train")

def render(ex):
    text = tok.apply_chat_template(ex["messages"], tokenize=False, add_generation_prompt=False)
    return {"text": text, "n_tokens": len(tok(text).input_ids)}
ds = ds.map(render)
lens = np.array(ds["n_tokens"])
print("p50/p95/max tokens:", np.percentile(lens, [50, 95]), lens.max())
ds = ds.filter(lambda e: e["n_tokens"] <= 2048)                     # drop outliers rather than truncating answers
split = ds.train_test_split(test_size=0.05, seed=42)
```

### Task 2. QLoRA SFT with TRL (assistant-only loss)
```python
import torch
from transformers import AutoModelForCausalLM, BitsAndBytesConfig
from peft import LoraConfig
from trl import SFTTrainer, SFTConfig

name = "meta-llama/Llama-3.1-8B-Instruct"
bnb = BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_quant_type="nf4",
                         bnb_4bit_compute_dtype=torch.bfloat16, bnb_4bit_use_double_quant=True)
model = AutoModelForCausalLM.from_pretrained(name, quantization_config=bnb, device_map="auto",
                                             attn_implementation="sdpa")
tok.pad_token = tok.pad_token or tok.eos_token

lora = LoraConfig(r=16, lora_alpha=32, lora_dropout=0.05, target_modules="all-linear",
                  bias="none", task_type="CAUSAL_LM")
args = SFTConfig(output_dir="sft-support", per_device_train_batch_size=2, gradient_accumulation_steps=8,
                 learning_rate=2e-4, num_train_epochs=2, lr_scheduler_type="cosine", warmup_ratio=0.03,
                 bf16=True, gradient_checkpointing=True, optim="paged_adamw_8bit", max_length=2048,
                 assistant_only_loss=True,                      # loss on assistant tokens (verify support/arg name)
                 logging_steps=10, eval_strategy="steps", eval_steps=100, save_steps=100, report_to="none")
trainer = SFTTrainer(model=model, args=args, train_dataset=split["train"], eval_dataset=split["test"],
                     peft_config=lora, processing_class=tok)
trainer.train(); trainer.save_model("sft-support/final")
```

### Task 3. Evaluate: base+prompt vs tuned on a held-out set (exact-match / schema validity)
```python
import json
def generate(model, tok, messages, max_new_tokens=256):
    ids = tok.apply_chat_template(messages, add_generation_prompt=True, return_tensors="pt").to(model.device)
    out = model.generate(ids, max_new_tokens=max_new_tokens, do_sample=False)
    return tok.decode(out[0][ids.shape[-1]:], skip_special_tokens=True)

def score(model, tok, rows):
    ok = valid = 0
    for r in rows:
        pred = generate(model, tok, r["messages"][:-1])
        try:
            obj = json.loads(pred); valid += 1
            ok += int(obj == json.loads(r["messages"][-1]["content"]))
        except json.JSONDecodeError:
            pass
    return {"json_valid": valid / len(rows), "exact_match": ok / len(rows)}
print("base:", score(base_model, tok, test_rows)); print("tuned:", score(tuned_model, tok, test_rows))
```

### Task 4. Merge adapter into BF16 base and save
```python
from peft import PeftModel
base = AutoModelForCausalLM.from_pretrained(name, torch_dtype=torch.bfloat16, device_map="auto")
merged = PeftModel.from_pretrained(base, "sft-support/final").merge_and_unload()
merged.save_pretrained("support-merged", safe_serialization=True); tok.save_pretrained("support-merged")
```

### Task 5. DPO on preference pairs (after SFT)
```python
from trl import DPOTrainer, DPOConfig
# dataset columns: prompt, chosen, rejected  (chat format supported; verify version)
args = DPOConfig(output_dir="dpo-support", beta=0.1, learning_rate=5e-6, per_device_train_batch_size=2,
                 gradient_accumulation_steps=8, num_train_epochs=1, bf16=True, gradient_checkpointing=True,
                 max_length=2048, logging_steps=10, report_to="none")
trainer = DPOTrainer(model=sft_model, ref_model=None, args=args, train_dataset=pref_ds, processing_class=tok,
                     peft_config=lora)          # with PEFT, ref model = adapter-disabled base
trainer.train()
```

### Task 6. GRPO with a verifiable reward (sketch)
```python
from trl import GRPOTrainer, GRPOConfig
import re, json

def reward_valid_json(completions, **kw):
    out = []
    for c in completions:
        text = c[0]["content"] if isinstance(c, list) else c
        try: json.loads(text); out.append(1.0)
        except Exception: out.append(0.0)
    return out

def reward_correct(completions, answers, **kw):
    return [1.0 if str(a) in (c[0]["content"] if isinstance(c, list) else c) else 0.0 for c, a in zip(completions, answers)]

cfg = GRPOConfig(output_dir="grpo-out", learning_rate=1e-6, num_generations=8, max_completion_length=512,
                 per_device_train_batch_size=8, bf16=True, logging_steps=5, report_to="none")
GRPOTrainer(model=name, reward_funcs=[reward_valid_json, reward_correct], args=cfg, train_dataset=math_ds,
            peft_config=lora).train()        # verify arguments/versions
```

### Task 7. Memory estimator
```python
def estimate_gb(params_b, method="qlora", seq=2048, micro_bs=1, layers=32, hidden=4096):
    P = params_b * 1e9
    if method == "full":      weights = P * (2 + 4) ; grads = P * 2 ; optim = P * 8      # bf16 + fp32 master, grads, Adam
    elif method == "lora":    weights = P * 2 ; grads = 0.01 * P * 2 ; optim = 0.01 * P * 8
    elif method == "qlora":   weights = P * 0.55 ; grads = 0.01 * P * 2 ; optim = 0.01 * P * 8
    act = micro_bs * seq * layers * hidden * 2 * 12 / 3      # rough, with gradient checkpointing (~1/3)
    return round((weights + grads + optim + act) / 1e9, 1)
for m in ("full", "lora", "qlora"): print(m, estimate_gb(8, m), "GB (very rough)")
```

### Task 8. Inspect LoRA target modules and trainable parameters
```python
import re
names = {re.sub(r"\.\d+\.", ".N.", n) for n, m in base_model.named_modules() if m.__class__.__name__ == "Linear" or "Linear" in m.__class__.__name__}
print(sorted(names)[:20])                              # decide target_modules from real module names
peft_model = get_peft_model(base_model, cfg); peft_model.print_trainable_parameters()
```

### Task 9. Multi-LoRA serving with vLLM
```bash
vllm serve meta-llama/Llama-3.1-8B-Instruct --enable-lora \
  --lora-modules support=/adapters/support hr=/adapters/hr --max-loras 4 --max-lora-rank 64
# client: OpenAI-compatible API; choose adapter with model="support" or model="hr"
```

### Task 10. Regression suite for forgetting and safety
```python
SUITES = {"general_qa": general_qa, "instruction_following": ifeval_like, "safety_refusals": refusal_prompts, "domain": domain_test}
def compare(base, tuned):
    rep = {}
    for name, suite in SUITES.items():
        b, t = suite.run(base), suite.run(tuned)
        rep[name] = {"base": b, "tuned": t, "delta": t - b}
    bad = {k: v for k, v in rep.items() if k != "domain" and v["delta"] < -0.03}        # >3pt drop outside the target domain
    assert not bad, f"regressions: {bad}"
    return rep
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. Model outputs garbage or ignores instructions after SFT
Wrong chat template/special tokens, EOS missing, loss on prompt tokens, LR too high. Re-render data with `apply_chat_template`, verify EOS in labels, enable assistant-only loss, lower LR, inspect a few tokenised examples.

### D2. Loss goes to ~0 quickly; outputs memorise
Tiny/duplicated dataset or too many epochs/high rank. Deduplicate, add data, reduce epochs/rank/LR, add dropout, evaluate on held-out set.

### D3. Loss is NaN or spikes
LR too high, FP16 overflow, bad examples (empty/huge). Use BF16, clip gradients, lower LR, filter data, check for inf/NaN in inputs.

### D4. CUDA out-of-memory
Reduce micro-batch/sequence length, enable gradient checkpointing, 4-bit base, paged optimiser, FlashAttention, offload, or shard (FSDP/ZeRO). Check for accidental float32 loading.

### D5. Training is extremely slow
No packing/dynamic padding, tiny micro-batches, CPU data bottleneck, no fused kernels. Increase micro-batch with checkpointing, pack sequences, use sdpa/flash attention, more dataloader workers, profile tokens/sec.

### D6. Tuned model repeats itself or never stops
Missing EOS tokens in training data or padding side mistakes. Ensure each assistant turn ends with EOS in the template, set `pad_token`, and use correct generation config.

### D7. Tuned model worse than base + good prompt
Data quality/format mismatch, over-training, or the task needed knowledge (RAG). Review data, compare checkpoints earlier in training, evaluate on proper metrics, consider prompt/RAG instead.

### D8. Great validation loss, poor real-world quality
Validation set unrepresentative or leaked; metric mismatch. Build a realistic eval set from production queries, add edge cases, measure generations, collect human feedback.

### D9. Merge produces degraded outputs
Merged into the 4-bit/quantised base, dtype mismatch, wrong base revision. Merge into BF16/FP16 base of the exact same revision, evaluate merged vs adapter-loaded outputs.

### D10. Adapter loads but behaves like base
Adapter not active, wrong `adapter_name`, target modules mismatched, or scaling set to zero. Verify `model.active_adapters`, trainable params >0 during training, compare logits with/without adapter.

### D11. Forgetting of general abilities/safety
Narrow data, high LR/rank, too many epochs. Mix in general/safety data, lower LR/rank, early stop, scale adapter down, run regression suites.

### D12. DPO makes answers longer or weird
Length bias in preferences, likelihood displacement. Control length in data, use SimPO/length normalisation, lower β/LR, add SFT loss term, evaluate with held-out preferences and capability checks.

### D13. Multi-GPU run hangs or gives different results
Mismatched ranks, uneven batches, non-deterministic data order, missing `accelerate` config. Use consistent configs, `drop_last`, set seeds, check NCCL logs, test on 1 GPU first.

### D14. Tokenizer/vocab mismatch errors
Added tokens without resizing embeddings, or using a different tokenizer at inference. Save tokenizer with the adapter/model, resize embeddings, include `embed_tokens`/`lm_head` in `modules_to_save` when adding tokens.

### D15. JSON/structured outputs still invalid after tuning
Insufficient examples of edge cases or decoding randomness. Add more varied examples, use constrained decoding/structured outputs at inference, validate and retry.

---

# 🧩 Part 8: Tricky Questions

### T1. Can fine-tuning teach a model new facts reliably?
Not reliably; it can memorise some facts but generalises poorly and is hard to update. Use RAG for knowledge.

### T2. Is LoRA always worse than full fine-tuning?
No. For many tasks LoRA with sufficient rank on all linear layers is close; full FT can win for large domain shifts or heavy continued pre-training.

### T3. Does lower training loss mean a better model?
Not necessarily; generation quality and task metrics matter. Loss can improve while behaviour degrades (overfit, forgetting).

### T4. Should I always merge the adapter?
Merge for simplest/fastest serving of one adapter; keep separate for multi-tenant/multi-task serving or to retain flexibility (scaling, swapping).

### T5. Does QLoRA training happen in 4-bit?
The base weights are stored in 4-bit and de-quantised to BF16 for compute; adapters train in higher precision. Gradients flow to adapters.

### T6. Is more data always better?
No. Noisy or redundant data can hurt. Quality, diversity and consistency matter more than raw count.

### T7. Is DPO better than RLHF?
It's simpler and more stable, often competitive, but not strictly better; RL with verifiable rewards can surpass it on reasoning tasks. Choose by data and objective.

### T8. Can I fine-tune a model on outputs from another provider's model?
Check provider terms of service; some prohibit using outputs to train competing models. Also consider licence and quality implications.

### T9. Will fine-tuning reduce hallucinations?
It can reduce format/style errors and teach abstention behaviours, but factual hallucination mostly requires grounding (RAG) and verification.

### T10. Does a larger LoRA rank always help?
No; returns diminish and overfitting/memory increase. Tune on validation, prefer data improvements first.

### T11. Is fine-tuning one-time work?
No. Base models, requirements and data evolve; budget for periodic retraining and evaluation.

### T12. If an adapter is only 100 MB, is it safe to share?
It may still leak training-data patterns and embed licensed base-model constraints. Apply the same governance as for the dataset and base weights.

### T13. Are instruct models better starting points than base models?
Usually yes for SFT on chat tasks (they already follow templates/safety); base models suit continued pre-training or when you need full control of behaviour. Test both.

### T14. Can I use different chat templates in training and inference if the content is the same?
No; the model learns the exact token patterns. Mismatches degrade performance.

### T15. Why can fine-tuned models break after a library upgrade?
Changes to defaults (templates, tokenisation, attention implementations, quantisation kernels) can alter behaviour. Pin versions and re-run evaluations on upgrades.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- RAG for knowledge; fine-tuning for behaviour.
- LoRA: `ΔW = (α/r)·B·A`, B starts at zero.
- QLoRA = 4-bit NF4 base + LoRA adapters.
- Typical LoRA: r 16, α 32, all-linear, LR 2e-4, 1–3 epochs.
- Full FT LR ≈ 1e-5.
- Use the model's chat template for train and inference.
- Mask loss to assistant tokens.
- Data quality > data quantity.
- Held-out locked test set; deduplicate first.
- Compare against a strong prompted baseline.
- DPO: SFT first, β≈0.1, low LR.
- GRPO needs verifiable rewards.
- Merge into BF16 base, not 4-bit.
- Multi-LoRA serving shares one base model.
- Gradient checkpointing trades compute for memory.
- Packing needs correct masking.
- Watch forgetting and safety regression.
- Pin versions; log dataset hash.
- Fine-tuned models may memorise training data.
- Retrain when base models change.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about a fine-tuning project
Use STAR: business problem and metric → baseline (prompted frontier model) → why fine-tune (format consistency, latency, cost) → data (sources, cleaning, size, quality checks) → training setup (QLoRA, hyper-parameters, hardware) → evaluation (task metrics, regression, safety, human review) → deployment (merged/multi-LoRA, vLLM) → results. Example: "Invoice-extraction tuned Llama-8B with QLoRA on 6k verified examples: JSON validity 82% → 99.6%, field F1 0.81 → 0.94, p95 latency 2.4 s → 0.6 s, cost per 1k docs −78% vs the frontier API baseline."

### P2. A fine-tune that didn't work
Explain the hypothesis, data and results, the diagnosis (template mismatch, noisy labels, knowledge problem), what you changed (RAG, prompt, data cleaning), and the lesson (evaluate baselines first).

### P3. How did you ensure data quality?
Guidelines, dedupe, PII scrubbing, inter-annotator agreement, manual review of samples, automated validators, and versioned datasets with provenance.

### P4. How did you avoid regressions?
Maintained general and safety suites, compared base vs tuned, limited LR/epochs, mixed in replay data, and gated deployment on thresholds.

### P5. How did you manage cost?
Used QLoRA on one GPU, small ablations before full runs, spot instances with checkpoints, and measured savings from smaller/faster inference.

### P6. How did you handle governance/security?
Data classification and consent, access control, encrypted storage, licence review of base model and datasets, model cards, red-team tests, and audit logs.

### P7. How do you decide between prompting and fine-tuning in a team debate?
Run a time-boxed bake-off on a shared evaluation set with fixed budgets, compare quality, latency, cost and maintenance, and decide with data.

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- Decision framework: prompting vs RAG vs fine-tuning vs distillation.
- Methods: full FT, continued pre-training, SFT, LoRA / QLoRA / variants (rsLoRA, DoRA, LoRA+, LoftQ), adapters, prompt/prefix tuning, IA³, model merging.
- Alignment & RL: reward models, RLHF, DPO / IPO / KTO / ORPO / SimPO, rejection sampling, GRPO / verifiable rewards.
- Data: formats, chat templates, loss masking, quality, dedupe, decontamination, synthetic data, balancing, multi-turn, tool-use data.
- Systems: quantisation (NF4, INT8), memory maths, gradient checkpointing, packing, FlashAttention, DDP / FSDP / DeepSpeed, throughput tuning.
- Evaluation: task metrics, regression & safety suites, LLM-as-judge, forgetting, statistical rigor.
- Deployment: merging, multi-LoRA serving, quantised serving, hosted fine-tuning APIs, adapter lifecycle.
- Governance: licences, privacy, memorisation, poisoning/backdoors, documentation, ROI, maintenance.

## Mixed topics
- QLoRA + packing + checkpointing + paged optimisers.
- SFT → DPO pipeline + evaluation + safety.
- Multi-tenant LoRA + registry + access control.
- Synthetic data + verification + decontamination.
- Tokenizer changes + embedding training + modules_to_save.
- Base-model upgrades + regression gates + retraining automation.

---

# 🔬 Part 12: Internals

### LoRA forward/backward
`h = W₀x + (α/r)·B(Ax)`. Gradients only for `A`, `B` (and any `modules_to_save`). Backward still propagates through frozen `W₀` to earlier layers, so activation memory is similar to full FT (hence gradient checkpointing matters). Initialising `B=0` makes `ΔW=0` at step 0.

### Why scaling `α/r`
Keeps the update magnitude roughly independent of rank when changing `r`. With larger ranks the sum of `r` rank-1 terms has larger variance; rsLoRA uses `α/√r` to prevent gradient collapse at high ranks.

### NF4 quantisation
Weights normalised per block by absmax, mapped to 16 levels placed at normal-distribution quantiles (information-theoretically optimal for N(0,1) weights), stored as 4-bit codes; block scales stored in FP8/FP16 and optionally quantised again (double quant) saving ~0.4 bits/param. Dequantised on the fly inside the matmul kernel.

### Cross-entropy with label masking
Labels set to `-100` for masked tokens (prompt, padding) are ignored by `CrossEntropyLoss(ignore_index=-100)`. Loss = mean over unmasked tokens (or sum normalised by tokens depending on trainer settings); note differences when packing/accumulating across variable lengths.

### DPO derivation sketch
RLHF objective `max E[r(x,y)] − β KL(π‖π_ref)` has optimal policy `π*(y|x) ∝ π_ref(y|x)·exp(r(x,y)/β)`. Solving for `r` and substituting into the Bradley–Terry preference model yields a loss depending only on log-prob ratios of chosen and rejected responses under π and π_ref.

### GRPO advantage
For prompt `x` sample `G` completions with rewards `r_i`; advantage `A_i = (r_i − mean(r)) / std(r)`; policy update uses a clipped PPO-style objective with KL regularisation, no value network needed.

### FSDP sharding
Each rank holds a shard of parameters/gradients/optimiser states; forward all-gathers a layer's parameters, computes, frees them; backward reduce-scatters gradients. Overlapping communication with compute and wrapping at transformer-block granularity are key to efficiency.

### Packing & attention masks
Concatenate examples into one sequence of length L; use block-diagonal attention (varlen FlashAttention with cumulative sequence lengths) and reset position IDs so tokens attend only within their original example. Without this, cross-contamination degrades learning.

### Adapter merging arithmetic
`W_merged = W₀ + (α/r)·B A` per adapted matrix. Merging multiple adapters adds deltas (possibly with weights); interference occurs when deltas overlap in subspace, motivating TIES/DARE preprocessing.

### Memory timeline in training
Peak memory at the end of forward (activations stored), during backward (gradients + recompute buffers), and during optimiser step (states). Tools: `torch.cuda.memory_summary`, memory snapshots; optimisations target the peak phase.

---

# 📊 Part 13: Reference Tables

### Approach selection
| Goal | Prompting | RAG | LoRA/SFT | Preference tuning | Full FT/CPT |
|---|---|---|---|---|---|
| Add fresh facts | ✗ | ✅ | ✗ | ✗ | ✗ (CPT partially) |
| Consistent format/tone | ✅ (few-shot) | ✗ | ✅ | ✅ | ✅ |
| Lower latency/cost | ✗ | ✗ | ✅ (smaller model) | ✗ | ✅ |
| Safety/preference alignment | partial | ✗ | partial | ✅ | ✅ |
| New language/domain skill | limited | partial | ✅ | ✗ | ✅ (CPT) |

### Typical hyper-parameters
| Setting | LoRA/QLoRA SFT | Full FT SFT | DPO | GRPO |
|---|---|---|---|---|
| Learning rate | 1e-4 – 2e-4 | 1e-5 – 2e-5 | 5e-7 – 5e-6 | 1e-6 – 5e-6 |
| Epochs | 1–3 | 1–3 | 1 | n/a (steps) |
| Eff. batch | 16–64 | 32–128 | 16–64 | model/gen-dependent |
| Warm-up | 3–10% | 3–10% | 3–10% | small |
| β | – | – | 0.05–0.5 | KL coeff small |

### Memory rules of thumb (7–8B model)
| Method | Approx GPU memory |
|---|---|
| Inference BF16 | ~16 GB |
| Inference 4-bit | ~5–6 GB |
| QLoRA fine-tune | ~12–24 GB |
| LoRA (BF16 base) | ~24–40 GB |
| Full FT (AdamW) | ~120+ GB (sharded) |

### PEFT method comparison
| Method | Trainable % | Inference overhead | Quality |
|---|---|---|---|
| LoRA | 0.1–2% | None if merged | High |
| QLoRA | 0.1–2% | None if merged/dequantised | High (slight loss) |
| DoRA | ~LoRA | Small | Slightly higher |
| Adapters | 1–5% | Extra layers | Good |
| Prompt/prefix tuning | <0.1% | Context cost | Lower for LLMs |
| IA³/VeRA | <0.1% | None | Task-dependent |

### Preference methods
| Method | Needs | Notes |
|---|---|---|
| RLHF-PPO | Reward model + RL infra | Powerful, complex |
| DPO | Pairs | Simple, stable |
| IPO | Pairs | Less overfit |
| KTO | Binary labels | Cheap data |
| ORPO | Pairs | No reference model |
| SimPO | Pairs | Length-normalised, reference-free |
| GRPO | Verifiable reward | Reasoning/code/math |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
LoRA on a `4096×4096` weight with `r=16`: trainable params = `16×4096 + 4096×16` = **131,072** (vs 16,777,216 frozen → **0.78%**).

### O2.
LoRA on 32 layers × 4 attention projections (`q,k,v,o`), each `4096×4096`, `r=16`: `32×4×131,072` = **16,777,216** trainable params (~16.8M).

### O3.
7B parameters in BF16 = **14 GB** weights; in 4-bit ≈ **3.5–4 GB**.

### O4.
Full fine-tune with AdamW mixed precision at ~16 bytes/param for 7B: `7e9 × 16` = **112 GB** (before activations).

### O5.
Effective batch size: micro-batch 2, grad accumulation 8, 2 GPUs = `2×8×2` = **32**.

### O6.
Dataset 12,000 examples, effective batch 32, 3 epochs → steps/epoch = 375 → total **1,125 optimiser steps**.

### O7.
LoRA scaling `α/r` with `r=16, α=32` = **2.0**; with rsLoRA `α/√r` = `32/4` = **8.0**.

### O8.
DPO with `β=0.1`: log-ratio margin (chosen − rejected) = 2.0 → logit = 0.2 → loss = `−log σ(0.2)` ≈ **0.598**.

### O9.
Tokens per epoch: 5,000 examples × 800 tokens = **4,000,000 tokens**; with 2 epochs, 8M tokens processed. At 3,000 tokens/s throughput ≈ **44 minutes**.

### O10.
GRPO group rewards `[1, 0, 0, 1]`: mean 0.5, std 0.5 → advantages `[+1, −1, −1, +1]`.

### O11.
Merging two adapters with deltas `ΔW₁`, `ΔW₂` using weights 0.7/0.3: `W = W₀ + 0.7ΔW₁ + 0.3ΔW₂`.

### O12.
Packing 3 examples of 500, 700 and 800 tokens into a 2,048-token sequence uses **2,000 tokens** (97.7% utilisation) and needs block-diagonal masking.

---

# ✅ Part 15: MCQs

**1. Which is best for adding frequently changing company facts to an LLM app?**
A) Fine-tuning weekly  B) RAG  C) Larger LoRA rank  D) Lower learning rate
**Answer: B**

**2. In LoRA, `B` is initialised to:**
A) Random normal  B) Zeros  C) Ones  D) Identity
**Answer: B**

**3. QLoRA keeps the base model weights in:**
A) FP32  B) 4-bit NF4 (frozen)  C) INT2  D) Pruned form
**Answer: B**

**4. Loss masking in SFT means:**
A) Ignoring the dataset  B) Computing loss only on assistant (response) tokens  C) Masking attention  D) Dropping layers
**Answer: B**

**5. Which should you use to format chat data for a given model?**
A) A generic template  B) The model's own `apply_chat_template`  C) Plain text  D) JSON only
**Answer: B**

**6. DPO needs:**
A) A reward model and PPO loop  B) Preference pairs (chosen/rejected) and a reference model  C) Only unlabeled text  D) A vector DB
**Answer: B**

**7. Best place to merge a QLoRA adapter for deployment quality:**
A) Into the 4-bit model  B) Into a BF16/FP16 copy of the base  C) Into a random model  D) Don't merge ever
**Answer: B**

**8. Catastrophic forgetting is mitigated by:**
A) Higher learning rate  B) Mixing general data, lower LR/rank, fewer epochs, regression tests  C) Removing validation  D) Larger batch only
**Answer: B**

**9. Gradient checkpointing:**
A) Increases memory and speed  B) Saves memory at the cost of extra compute  C) Removes gradients  D) Quantises weights
**Answer: B**

**10. Which is NOT a PEFT method?**
A) LoRA  B) Prefix tuning  C) IA³  D) Full-parameter AdamW fine-tuning
**Answer: D**

**11. GRPO is especially suited to:**
A) Tasks with verifiable rewards (math/code)  B) Image classification  C) Embedding training  D) OCR
**Answer: A**

**12. Multi-LoRA serving allows:**
A) Many adapters sharing one base model in memory  B) Training faster  C) Removing quantisation  D) Skipping evaluation
**Answer: A**

**13. A suitable LR for LoRA SFT is typically:**
A) 1e-9  B) 1e-4 to 2e-4  C) 1.0  D) 10
**Answer: B**

**14. Which data practice avoids inflated eval scores?**
A) Training on the test set  B) Deduplication and decontamination against evaluation sets  C) Using larger models  D) Shuffling only
**Answer: B**

**15. Adding new special tokens requires:**
A) Nothing  B) Resizing embeddings and training them (e.g., `modules_to_save`)  C) Lower LR  D) A smaller batch
**Answer: B**

**16. The packing technique requires:**
A) Random order  B) Correct attention masking/position resets to prevent cross-example attention  C) Smaller vocab  D) FP8
**Answer: B**

**17. Which statement about fine-tuning and hallucination is true?**
A) It eliminates hallucination  B) It can teach format/abstention but doesn't ground facts; use RAG/verification  C) It guarantees truth  D) It removes the need for evaluation
**Answer: B**

**18. Before fine-tuning you should first:**
A) Buy GPUs  B) Build an evaluation set and a strong prompted/RAG baseline  C) Increase rank  D) Publish the adapter
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

- Fine-tuning to add facts instead of using RAG.
- Skipping an evaluation set and a strong prompted baseline.
- Using a different chat template at training vs inference; missing EOS tokens.
- Training loss on prompt tokens; ignoring padding/EOS handling.
- Noisy, duplicated or contaminated data; evaluating on training-like examples.
- Over-training (too many epochs/high rank) and judging by loss only.
- Merging into a 4-bit model or the wrong base revision.
- Ignoring catastrophic forgetting and safety regressions.
- Forgetting to resize embeddings / save `modules_to_save` after adding tokens.
- Using FP16 without scaling on large models or unstable LR.
- Not pinning library versions or logging dataset hashes and configs.
- Treating adapters as non-sensitive artefacts (leakage, licence terms).
- Ignoring base-model licences and provider terms on training with model outputs.
- Choosing complex RL pipelines before trying SFT + DPO + better data.
- No plan for retraining when the base model changes.
- Deploying without measuring latency/cost benefits versus the baseline.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You start with evaluation and baselines, and justify fine-tuning with measured gaps.
- You treat data as the main lever: curation, dedupe, decontamination, diversity, versioning.
- You understand the mechanics (LoRA scaling, NF4, loss masking, packing, memory maths) and debug from first principles.
- You choose among SFT, DPO/KTO/ORPO, GRPO and distillation based on data and objectives.
- You evaluate beyond loss: task metrics, regression, safety, forgetting, and statistical significance.
- You design for operations: adapter registries, multi-LoRA serving, rollback, refresh on new bases.
- You manage risk: licences, privacy/memorisation, poisoning, governance documentation.
- You quantify ROI and know when to stop fine-tuning and use RAG, prompting or tools.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Decision flow
```
Eval set → best prompt (+structured output, caching) → still failing?
  knowledge gap → RAG
  behaviour/format/latency/cost gap → SFT (LoRA/QLoRA) → (optional) DPO/KTO → distill for volume
Always: regression + safety suites, versioned data, pinned libs
```

### Default QLoRA recipe
NF4 + double quant + BF16 compute • LoRA r=16 α=32 dropout 0.05 all-linear • LR 2e-4 cosine, warm-up 3% • eff. batch 16–32 • 1–3 epochs • grad checkpointing • paged AdamW 8-bit • assistant-only loss • max length per data p95 • eval each N steps with task metrics.

### Formulas
```
LoRA: h = W₀x + (α/r)·B·A·x     params = r(d+k)
Full FT memory ≈ 16–18 B/param (+activations)     QLoRA weights ≈ 0.5–0.6 B/param
DPO: −log σ(β[(log π_w − log π_ref,w) − (log π_l − log π_ref,l)])
GRPO advantage: (r_i − mean)/std
```

### Pre-flight checklist
Template + EOS correct • loss masking on • train/val/test deduped • token-length stats • license/PII reviewed • seeds & versions logged • baseline results recorded • regression suites ready • safety evals ready.

### Deployment checklist
Merge into BF16 (or multi-LoRA) • re-evaluate merged model • quantise + re-evaluate • latency/cost benchmark vs baseline • canary rollout + rollback • model/data cards • monitoring + retraining plan.

### Final checklist before the interview
- [ ] Explain prompting vs RAG vs fine-tuning vs distillation with a decision framework.
- [ ] Derive LoRA, explain rank/α/targets and QLoRA (NF4, double quant, paged optimisers).
- [ ] Prepare chat data correctly (templates, EOS, loss masking, dedupe, splits).
- [ ] Run SFT with TRL/PEFT, tune hyper-parameters, estimate memory/compute.
- [ ] Explain DPO/KTO/ORPO/RLHF/GRPO and their data requirements and pitfalls.
- [ ] Evaluate properly: baselines, task metrics, regression, safety, forgetting.
- [ ] Merge/serve adapters (merge_and_unload, multi-LoRA, quantised serving).
- [ ] Handle distributed training (DDP/FSDP/DeepSpeed) and throughput tuning.
- [ ] Cover governance: licences, privacy/memorisation, poisoning, documentation.
- [ ] Prepare a project story with baseline, data, results, costs and lessons learned.
