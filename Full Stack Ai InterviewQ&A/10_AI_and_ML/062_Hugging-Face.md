# Hugging Face Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **Python 3.11+, `transformers` 4.4x – 4.5x, `datasets` 2.x / 3.x, `tokenizers` 0.19+, `accelerate` 0.3x / 1.x, `peft` 0.1x, `trl` 0.1x, `diffusers` 0.3x, `huggingface_hub` 0.2x, `safetensors`, `evaluate`, `optimum`, `sentence-transformers` 3.x, and PyTorch 2.x**. Hugging Face libraries move fast: argument names (`eval_strategy` replaced `evaluation_strategy`, `processing_class` is replacing `tokenizer` in `Trainer`, `torch_dtype` → `dtype` in newer releases), default behaviours, Inference Providers / Endpoints products and Hub policies change often. Anything marked "verify" should be checked in the official docs (huggingface.co/docs). Examples use the sample name **Ritesh Kumar** and small support-ticket / review / product-image style data.
> This file covers the Hugging Face ecosystem: the Hub (models, datasets, Spaces, model cards, gated models, licences, revisions), `transformers` (pipelines, Auto classes, configs, tokenizers, `generate`, chat templates, attention implementations), `datasets` (loading, streaming, map/filter, Arrow, memory mapping), `tokenizers`, the `Trainer` API and custom loops, `accelerate`, mixed precision and distributed training (DDP / FSDP / DeepSpeed), PEFT (LoRA / QLoRA), `bitsandbytes` quantisation, TRL (SFT / DPO / PPO / GRPO), `evaluate`, `diffusers`, `sentence-transformers`, Optimum / ONNX / TensorRT-LLM / vLLM / TGI serving, Spaces with Gradio / Streamlit, Inference Endpoints and Providers, safety (safetensors, `trust_remote_code`, gated access, tokens), licensing, and production practice. Related topics: deep learning in `057_Deep-Learning.md`, PyTorch in `058_PyTorch.md`, NLP in `059_NLP.md`, computer vision in `060_Computer-Vision.md`, LLM fine-tuning in `../11_Generative_AI/070_Fine-Tuning-LoRA-QLoRA.md`, LLMs and RAG in `../11_Generative_AI/066_LLM-and-RAG.md`, vector databases in `../11_Generative_AI/067_Vector-Databases.md`, model serving in `../11_Generative_AI/073_Model-Serving-and-Inference.md`, LLM evaluation in `../11_Generative_AI/072_LLM-Evaluation-and-Guardrails.md`, MLOps in `074_MLOps.md`, Python in `../03_Backend/014_Python.md`, Docker in `../07_DevOps_and_Cloud/045_Docker.md`.

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

### Q1. What is Hugging Face? *(Must-know)*
Hugging Face is a company and open-source ecosystem for machine learning. Its pieces: the **Hub** (hosting for models, datasets and demo apps), libraries (`transformers`, `datasets`, `tokenizers`, `accelerate`, `peft`, `trl`, `diffusers`, `evaluate`, `optimum`), and hosted services (Inference Providers / Endpoints, Spaces). It made pre-trained Transformer models easy to download, fine-tune and share.

### Q2. What is the Hugging Face Hub? *(Must-know)*
A Git-based platform (using Git LFS / Xet storage) where you publish and discover **models**, **datasets** and **Spaces**. Each repo has versioned files, a README (model/dataset card), metadata (tags, licence, language, library), discussions and pull requests. IDs look like `org/name`, e.g., `bert-base-uncased` or `meta-llama/...` (gated).

### Q3. What is the `transformers` library?
A library of state-of-the-art pre-trained models (text, vision, audio, multimodal) with a unified API across PyTorch (primary), TensorFlow and JAX (legacy support varies). It provides model classes, tokenizers/processors, the `pipeline` API, `Trainer`, `generate()` and integration with the Hub.

### Q4. The `pipeline` API *(Must-know)*
The highest-level interface: preprocessing + model + post-processing in one call.
```python
from transformers import pipeline
clf = pipeline("sentiment-analysis")
clf("Delivery was late but support was helpful.")
# [{'label': 'POSITIVE', 'score': 0.9...}]
```
Common tasks: `text-classification`, `token-classification` (NER), `question-answering`, `summarization`, `translation`, `text-generation`, `fill-mask`, `zero-shot-classification`, `feature-extraction`, `automatic-speech-recognition`, `image-classification`, `object-detection`, `visual-question-answering`.

### Q5. Choosing a model in a pipeline
```python
pipe = pipeline("text-classification", model="distilbert-base-uncased-finetuned-sst-2-english", device=0)
```
Always pin a specific model (and a `revision`) in production instead of relying on the task default.

### Q6. Auto classes *(Must-know)*
`AutoTokenizer`, `AutoModel`, `AutoModelForSequenceClassification`, `AutoModelForCausalLM`, `AutoModelForTokenClassification`, `AutoConfig`, `AutoProcessor`, `AutoImageProcessor`. They read `config.json` and instantiate the correct architecture from a checkpoint name.
```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification
tok = AutoTokenizer.from_pretrained("bert-base-uncased")
model = AutoModelForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=3)
```

### Q7. What does `from_pretrained` do?
Downloads (or reads from cache) the config, weights and tokenizer files from the Hub or a local folder, builds the model, and loads weights. Caching location: `~/.cache/huggingface` (controlled by `HF_HOME`). Offline mode: `HF_HUB_OFFLINE=1`.

### Q8. Tokenizer basics
Converts text to token IDs and back.
```python
enc = tok("Ritesh Kumar loves NLP", return_tensors="pt", padding=True, truncation=True, max_length=32)
enc.keys()      # input_ids, attention_mask (and token_type_ids for BERT)
tok.decode(enc["input_ids"][0])
```
The tokenizer must match the model checkpoint.

### Q9. `input_ids` and `attention_mask`
`input_ids` are token indices; `attention_mask` is 1 for real tokens and 0 for padding so attention ignores padding.

### Q10. Running inference with a model
```python
import torch
model.eval()
with torch.no_grad():
    out = model(**enc)
probs = torch.softmax(out.logits, dim=-1)
```
Models return `ModelOutput` objects with `.logits`, `.loss` (if labels are given), `.hidden_states` (if requested).

### Q11. The `datasets` library *(Must-know)*
Loads, processes and shares datasets efficiently using **Apache Arrow** (memory-mapped, so large data doesn't have to fit in RAM).
```python
from datasets import load_dataset
ds = load_dataset("imdb")             # DatasetDict with train/test
ds["train"][0]
```

### Q12. `map`, `filter`, `select`, `train_test_split`
```python
ds = ds.map(lambda b: tok(b["text"], truncation=True), batched=True)
ds = ds.filter(lambda x: len(x["text"]) > 20)
small = ds["train"].shuffle(seed=42).select(range(1000))
split = ds["train"].train_test_split(test_size=0.1, seed=42)
```
`batched=True` makes `map` far faster. Results are cached on disk (fingerprints).

### Q13. Load your own data
```python
load_dataset("csv", data_files={"train": "train.csv", "test": "test.csv"})
load_dataset("json", data_files="data.jsonl")
load_dataset("parquet", data_files="data/*.parquet")
```

### Q14. Model cards and dataset cards
README files documenting intended use, training data, evaluation, limitations, biases, licence and how to use the model. Essential for responsible reuse; always read them before using a model.

### Q15. Licences on the Hub
Models/datasets carry licences (Apache-2.0, MIT, CC-BY, OpenRAIL, Llama community licence, non-commercial licences). **Check commercial-use rights and restrictions** before shipping. Gated models require accepting terms and an access token.

### Q16. Access tokens and login
Create a token at huggingface.co/settings/tokens (read or write, or fine-grained). Authenticate with `huggingface-cli login` / `hf auth login` or set `HF_TOKEN`. Never commit tokens; use secrets.

### Q17. Uploading a model to the Hub
```python
model.push_to_hub("ritesh/ticket-classifier")
tok.push_to_hub("ritesh/ticket-classifier")
# or: from huggingface_hub import HfApi; HfApi().upload_folder(folder_path="out", repo_id="ritesh/ticket-classifier")
```

### Q18. What is a Space?
A hosted app (Gradio, Streamlit, Docker or static) on the Hub for demos, typically with `app.py` and `requirements.txt`. Can run on CPU or upgraded GPU hardware.
```python
import gradio as gr
demo = gr.Interface(fn=lambda t: clf(t)[0], inputs="text", outputs="json")
demo.launch()
```

### Q19. Fine-tuning vs feature extraction
Feature extraction freezes the pre-trained model and uses its embeddings. Fine-tuning updates weights (fully or partially, or with PEFT) on task data, usually giving better accuracy.

### Q20. The `Trainer` API *(Must-know)*
A high-level training loop handling batching, mixed precision, gradient accumulation, distributed training, evaluation, logging and checkpointing.
```python
from transformers import TrainingArguments, Trainer
args = TrainingArguments(output_dir="out", learning_rate=2e-5, per_device_train_batch_size=16,
                         num_train_epochs=3, eval_strategy="epoch", save_strategy="epoch",
                         load_best_model_at_end=True, weight_decay=0.01, fp16=True)
trainer = Trainer(model=model, args=args, train_dataset=train_ds, eval_dataset=val_ds,
                  processing_class=tok, compute_metrics=compute_metrics)
trainer.train()
```
(Older versions use `tokenizer=tok`; verify the argument name for your version.)

### Q21. `compute_metrics`
```python
import numpy as np, evaluate
f1 = evaluate.load("f1")
def compute_metrics(p):
    preds = np.argmax(p.predictions, axis=-1)
    return f1.compute(predictions=preds, references=p.label_ids, average="macro")
```

### Q22. Data collators
`DataCollatorWithPadding` pads each batch dynamically to its longest sequence (efficient). `DataCollatorForLanguageModeling` masks tokens for MLM; `DataCollatorForSeq2Seq`, `DataCollatorForTokenClassification` handle labels.

### Q23. Generating text with `generate`
```python
from transformers import AutoModelForCausalLM, AutoTokenizer
tok = AutoTokenizer.from_pretrained("gpt2"); lm = AutoModelForCausalLM.from_pretrained("gpt2")
ids = tok("Once upon a time", return_tensors="pt")
out = lm.generate(**ids, max_new_tokens=40, do_sample=True, temperature=0.8, top_p=0.9)
print(tok.decode(out[0], skip_special_tokens=True))
```

### Q24. Important generation parameters
`max_new_tokens`, `do_sample`, `temperature`, `top_k`, `top_p`, `num_beams`, `repetition_penalty`, `no_repeat_ngram_size`, `eos_token_id`, `pad_token_id`, `num_return_sequences`, `stop_strings`.

### Q25. BERT vs GPT vs T5 in `transformers`
BERT-family → `AutoModelForSequenceClassification / TokenClassification / QuestionAnswering` (encoders). GPT/Llama-family → `AutoModelForCausalLM` (decoders). T5/BART → `AutoModelForSeq2SeqLM` (encoder-decoder).

### Q26. Moving to GPU
```python
device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device); enc = {k: v.to(device) for k, v in enc.items()}
```
Or `pipeline(..., device=0)` or `device_map="auto"` for big models.

### Q27. Zero-shot classification
```python
zs = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
zs("My card was charged twice", candidate_labels=["billing", "delivery", "login"])
```
Uses an NLI model: each label becomes a hypothesis. Handy for prototyping, slower than a fine-tuned classifier.

### Q28. Sentence embeddings
```python
from sentence_transformers import SentenceTransformer
m = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
emb = m.encode(["refund policy", "how to get money back"], normalize_embeddings=True)
```

### Q29. Saving and loading locally
```python
model.save_pretrained("./my_model"); tok.save_pretrained("./my_model")
model = AutoModelForSequenceClassification.from_pretrained("./my_model")
```
Saves `config.json`, `model.safetensors` and tokenizer files.

### Q30. Why `safetensors`?
A safe, fast tensor serialisation format: unlike pickle (`.bin`), it cannot execute arbitrary code when loading, supports memory mapping and lazy loading. It is the default for new checkpoints.

---

# 🔵 Part 2: Junior (1–3 years)

### Q31. Tokenisation in `transformers`: fast vs slow tokenizers
"Fast" tokenizers are backed by the Rust `tokenizers` library (parallel, offsets mapping, `word_ids()`); "slow" ones are Python. Fast tokenizers enable alignment of labels for NER and are the default.

### Q32. Aligning labels for token classification *(Must-know)*
```python
def tokenize_and_align(batch):
    enc = tok(batch["tokens"], is_split_into_words=True, truncation=True)
    labels = []
    for i, tags in enumerate(batch["ner_tags"]):
        prev, lab = None, []
        for w in enc.word_ids(batch_index=i):
            lab.append(-100 if w is None or w == prev else tags[w])
            prev = w
        labels.append(lab)
    enc["labels"] = labels
    return enc
```
`-100` is ignored by the loss (special tokens and non-first subwords).

### Q33. Dynamic padding and length grouping
Use `DataCollatorWithPadding` and `group_by_length=True` in `TrainingArguments` to reduce padding waste. Don't pad everything to `max_length` unless required (e.g., static shapes for compile/TPU).

### Q34. Truncation of long documents
Models have max positions (BERT 512). Options: truncate, **sliding window** with `return_overflowing_tokens=True, stride=128`, hierarchical aggregation, or long-context models.

### Q35. Fine-tuning hyper-parameters (encoder classification)
LR 2e-5–5e-5, batch size 16–32, 2–4 epochs, warm-up 6–10%, weight decay 0.01, `max_length` per data, evaluate each epoch, early stopping with `EarlyStoppingCallback`, multiple seeds for stability.

### Q36. Class imbalance with `Trainer`
Override `compute_loss` to use weighted `CrossEntropyLoss`:
```python
class WTrainer(Trainer):
    def compute_loss(self, model, inputs, return_outputs=False, **kw):
        labels = inputs.pop("labels"); out = model(**inputs)
        loss = torch.nn.functional.cross_entropy(out.logits, labels, weight=weights.to(out.logits.device))
        return (loss, out) if return_outputs else loss
```

### Q37. Evaluating with `evaluate`
`evaluate.load("accuracy" | "f1" | "rouge" | "bleu" | "seqeval" | "squad" | "bertscore")`. Metrics run on CPU after predictions are gathered; for generation use `predict_with_generate=True` with `Seq2SeqTrainer`.

### Q38. Seq2Seq fine-tuning (summarisation/translation)
```python
from transformers import AutoModelForSeq2SeqLM, Seq2SeqTrainer, Seq2SeqTrainingArguments, DataCollatorForSeq2Seq
model = AutoModelForSeq2SeqLM.from_pretrained("t5-small")
args = Seq2SeqTrainingArguments("out", predict_with_generate=True, learning_rate=3e-4, num_train_epochs=3)
```
Tokenise inputs and targets (`text_target=`), pad labels with `-100`, add task prefixes for T5 (`summarize: `).

### Q39. Question answering (extractive)
`AutoModelForQuestionAnswering` predicts start/end logits over context tokens. Handle long contexts with overflow windows and map predicted spans back using `offset_mapping`. Metrics: Exact Match and F1.

### Q40. Chat templates *(Must-know)*
Chat models expect a specific prompt format. `tok.apply_chat_template` formats messages correctly.
```python
msgs = [{"role": "system", "content": "You are a helpful support bot."},
        {"role": "user", "content": "How do I reset my password?"}]
ids = tok.apply_chat_template(msgs, add_generation_prompt=True, return_tensors="pt")
out = lm.generate(ids.to(lm.device), max_new_tokens=200)
```
Using the wrong template silently degrades quality.

### Q41. Loading big models: `device_map`, dtype, low memory
```python
lm = AutoModelForCausalLM.from_pretrained("mistralai/Mistral-7B-Instruct-v0.3",
        torch_dtype=torch.bfloat16, device_map="auto", low_cpu_mem_usage=True)
```
`device_map="auto"` (via Accelerate) shards layers across GPUs/CPU. Use `bfloat16` on Ampere+ GPUs.

### Q42. Quantised loading with bitsandbytes
```python
from transformers import BitsAndBytesConfig
bnb = BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_quant_type="nf4",
                         bnb_4bit_compute_dtype=torch.bfloat16, bnb_4bit_use_double_quant=True)
lm = AutoModelForCausalLM.from_pretrained(name, quantization_config=bnb, device_map="auto")
```
4-bit NF4 cuts memory ~4× vs FP16, enabling QLoRA fine-tuning on consumer GPUs. Other options: GPTQ, AWQ, GGUF (llama.cpp), HQQ, torchao (verify support per model).

### Q43. LoRA with PEFT *(Must-know)*
```python
from peft import LoraConfig, get_peft_model, TaskType
cfg = LoraConfig(r=16, lora_alpha=32, lora_dropout=0.05, bias="none",
                 target_modules=["q_proj", "k_proj", "v_proj", "o_proj"], task_type=TaskType.CAUSAL_LM)
model = get_peft_model(lm, cfg)
model.print_trainable_parameters()      # typically < 1% trainable
model.save_pretrained("adapter")         # saves only adapter weights (MBs)
```
Merge for deployment: `model.merge_and_unload()`.

### Q44. QLoRA recipe
4-bit quantised base model + LoRA adapters in higher precision + paged optimisers; call `prepare_model_for_kbit_training`, enable gradient checkpointing, use `bf16`, LR ~1e-4–2e-4, small batch with accumulation.

### Q45. TRL `SFTTrainer`
```python
from trl import SFTTrainer, SFTConfig
trainer = SFTTrainer(model=lm, train_dataset=ds, peft_config=cfg,
                     args=SFTConfig(output_dir="sft", per_device_train_batch_size=2, gradient_accumulation_steps=8,
                                    learning_rate=2e-4, num_train_epochs=2, bf16=True, max_length=2048,
                                    gradient_checkpointing=True))
trainer.train()
```
Supports chat-format `messages` datasets, packing and completion-only loss (verify argument names per version).

### Q46. Preference tuning with TRL (DPO)
Dataset columns `prompt`, `chosen`, `rejected`; `DPOTrainer(model, ref_model=None or reference, args=DPOConfig(beta=0.1), train_dataset=...)`. With PEFT the reference model is the adapter-disabled base (saves memory).

### Q47. Streaming datasets
```python
ds = load_dataset("allenai/c4", "en", split="train", streaming=True)
for ex in ds.take(3): print(ex["text"][:80])
```
No full download; returns an `IterableDataset` (no random access; shuffle uses a buffer).

### Q48. Arrow, memory mapping and caching
`datasets` stores data as Arrow files on disk, memory-mapped, giving fast access and low RAM. `map` results are cached by function fingerprint; use `load_from_cache_file=False` or `new_fingerprint` when caches go stale. `num_proc` parallelises `map`.

### Q49. Saving datasets
`ds.save_to_disk("path")` / `load_from_disk`, `ds.to_parquet`, or `ds.push_to_hub("user/name")`. Prefer Parquet for sharing.

### Q50. Hub caching and offline use
Set `HF_HOME`, `TRANSFORMERS_OFFLINE=1` / `HF_HUB_OFFLINE=1`, pre-download with `snapshot_download`, and bake models into Docker images or mount a shared cache volume.

### Q51. `huggingface_hub` essentials
```python
from huggingface_hub import hf_hub_download, snapshot_download, HfApi, login
hf_hub_download("bert-base-uncased", "config.json", revision="main")
snapshot_download("sentence-transformers/all-MiniLM-L6-v2", local_dir="models/minilm")
HfApi().list_models(filter="text-classification", sort="downloads", limit=5)
```

### Q52. Pinning revisions for reproducibility
Use `revision="<commit_sha>"` in `from_pretrained`/`load_dataset` so a repo update cannot silently change your behaviour. Tags and branches can move; commit SHAs are immutable.

### Q53. `trust_remote_code`
Allows executing custom modeling code shipped in the model repo. Powerful but a **security risk**; only enable for reviewed repos and pin the revision. Prefer natively supported architectures.

### Q54. Gradient accumulation, checkpointing and mixed precision in `TrainingArguments`
`gradient_accumulation_steps`, `gradient_checkpointing=True`, `bf16=True` / `fp16=True`, `tf32=True`, `optim="adamw_torch_fused"`, `torch_compile=True`, `dataloader_num_workers`, `max_grad_norm`.

### Q55. Logging and tracking
`report_to="wandb" | "tensorboard" | "mlflow" | "none"`, `logging_steps`, `run_name`. Save the config, seed and library versions for each run.

### Q56. Reproducibility
`set_seed(42)` from `transformers`, `seed`/`data_seed` in `TrainingArguments`, pinned library and revision versions, deterministic data splits, and awareness of non-deterministic CUDA ops.

### Q57. Resuming training
`trainer.train(resume_from_checkpoint=True)` restores model, optimiser, scheduler, RNG and trainer state from the latest checkpoint in `output_dir`.

### Q58. Vision with `transformers`
```python
from transformers import AutoImageProcessor, AutoModelForImageClassification
proc = AutoImageProcessor.from_pretrained("google/vit-base-patch16-224")
model = AutoModelForImageClassification.from_pretrained("google/vit-base-patch16-224")
inputs = proc(images=pil_image, return_tensors="pt")
pred = model(**inputs).logits.argmax(-1)
```
Use the model's own image processor for resize/normalisation.

### Q59. Audio with `transformers`
```python
asr = pipeline("automatic-speech-recognition", model="openai/whisper-small", chunk_length_s=30)
asr("meeting.wav", return_timestamps=True)
```
Whisper handles multilingual ASR/translation; use `chunk_length_s` for long audio.

### Q60. Text-to-image with `diffusers`
```python
from diffusers import AutoPipelineForText2Image
pipe = AutoPipelineForText2Image.from_pretrained("stabilityai/sdxl-turbo", torch_dtype=torch.float16).to("cuda")
image = pipe("a clean product photo of a steel water bottle", num_inference_steps=4, guidance_scale=0.0).images[0]
```
Check licence and acceptable-use terms for each model.

---

# 🟡 Part 3: Mid (3–5 years)

### Q61. Model internals: `config`, `PreTrainedModel`, heads
A config (`config.json`) defines architecture hyper-parameters. Base models (`AutoModel`) output hidden states; task heads (classification, LM head) sit on top. `from_pretrained` with a different head size prints "newly initialized" warnings, which is expected for new heads.

### Q62. Attention implementations
`attn_implementation="sdpa" | "flash_attention_2" | "eager"` (plus newer options). SDPA uses PyTorch's fused kernels; FlashAttention-2 needs compatible GPUs/dtypes and installation. Choose for speed/memory; eager helps when you need attention weights.

### Q63. KV cache and generation internals
`generate` caches past key/values (`use_cache=True`) so each new token costs one forward pass over one position. Cache classes (dynamic, static, quantised, sliding-window) matter for memory and `torch.compile`. Long contexts make the cache dominate memory.

### Q64. Batched generation pitfalls
Decoder-only models need **left padding** for batched generation (`tok.padding_side="left"`) and a defined `pad_token` (often set to `eos_token`). Right padding corrupts generation.

### Q65. Streaming generation
`TextStreamer` / `TextIteratorStreamer` yield tokens as generated, for chat UIs. In servers prefer TGI/vLLM streaming.

### Q66. Constrained and structured generation
JSON schema/grammar-constrained decoding via libraries (Outlines, lm-format-enforcer, TGI/vLLM guided decoding, `transformers` logits processors). Combine with validation and retries for reliable structured output.

### Q67. Custom `LogitsProcessor` / `StoppingCriteria`
Modify scores before sampling (ban tokens, enforce formats) or stop on custom conditions.
```python
from transformers import LogitsProcessor, LogitsProcessorList
class Ban(LogitsProcessor):
    def __init__(self, ids): self.ids = ids
    def __call__(self, input_ids, scores): scores[:, self.ids] = -float("inf"); return scores
lm.generate(**ids, logits_processor=LogitsProcessorList([Ban([tok.eos_token_id])]))
```

### Q68. Accelerate *(Must-know)*
A thin wrapper that lets the same PyTorch loop run on CPU, single/multi-GPU, TPU, with mixed precision, DDP, FSDP or DeepSpeed.
```python
from accelerate import Accelerator
acc = Accelerator(mixed_precision="bf16", gradient_accumulation_steps=4)
model, opt, loader = acc.prepare(model, opt, loader)
for batch in loader:
    with acc.accumulate(model):
        loss = model(**batch).loss
        acc.backward(loss); opt.step(); opt.zero_grad()
```
Configure with `accelerate config`, launch with `accelerate launch train.py`. `Trainer` uses Accelerate under the hood.

### Q69. Distributed training choices
DDP for models that fit one GPU; **FSDP** or **DeepSpeed ZeRO-2/3** for larger models (shard optimiser/gradients/parameters); CPU/NVMe offload for extreme memory limits; tensor/pipeline parallel for the largest. Configure through `TrainingArguments(fsdp=..., deepspeed=...)` or Accelerate plugins.

### Q70. Memory budgeting for fine-tuning
Weights + gradients + optimiser states + activations. Full fine-tune of a 7B model with AdamW ≈ 14 GB (BF16 weights) + 14 GB grads + ~56 GB optimiser states + activations → needs sharding. LoRA/QLoRA reduces trainable parameters and optimiser state drastically; gradient checkpointing and smaller sequence/batch reduce activations.

### Q71. Merging and serving LoRA adapters
Options: merge into base weights (`merge_and_unload`) for the simplest serving; or keep adapters separate and hot-swap (vLLM LoRA support, TGI, `peft` multi-adapter) to serve many fine-tunes on one base model. Quantised bases may need special merge handling; test outputs after merging.

### Q72. Evaluating fine-tuned LLMs
Held-out task data with exact-match/F1 where possible, LLM-as-judge with calibration, regression suites for general abilities (catastrophic forgetting), safety checks, `lm-evaluation-harness` for standard benchmarks, and human review of samples. Compare against prompting/RAG baselines.

### Q73. SFT data formatting pitfalls
Wrong chat template, training on the prompt tokens (should mask the loss to assistant tokens), missing EOS, inconsistent system prompts, duplicate data, leakage into evaluation, and truncation cutting responses.

### Q74. Packing and sequence length
Packing concatenates short examples into full-length sequences (higher throughput) but needs correct attention masking/position resets (flash-attn varlen) to prevent cross-example attention. Verify support in your TRL version.

### Q75. Sentence-Transformers fine-tuning
Train bi-encoders with `MultipleNegativesRankingLoss` (in-batch negatives), `CoSENTLoss`, triplet loss, using `SentenceTransformerTrainer`. Hard-negative mining boosts retrieval quality. Evaluate with `InformationRetrievalEvaluator` (nDCG, Recall@k).

### Q76. Re-rankers/cross-encoders
`CrossEncoder` models score (query, passage) pairs. Use after first-stage retrieval to re-rank the top 20–100 candidates. Trade accuracy for latency.

### Q77. Embedding model selection (MTEB)
Use the MTEB leaderboard as a starting point (verify current leaders) but evaluate on your own queries; consider dimension, max length, multilingual support, licence, prefixes (`query:`/`passage:`), and inference cost.

### Q78. Text Generation Inference (TGI) and vLLM
Production LLM servers: continuous batching, paged attention (vLLM), tensor parallelism, streaming, quantisation, LoRA serving, OpenAI-compatible APIs. Prefer them over raw `generate()` in a Flask app for throughput.

### Q79. Optimum and ONNX Runtime
`optimum` exports Transformers to ONNX / OpenVINO / TensorRT / Intel / AWS Inferentia, with graph optimisation and quantisation.
```python
from optimum.onnxruntime import ORTModelForSequenceClassification
m = ORTModelForSequenceClassification.from_pretrained("distilbert-base-uncased-finetuned-sst-2-english", export=True)
```
Validate numerics and latency against the PyTorch model.

### Q80. Inference Providers / Endpoints (hosted)
Serverless inference via providers behind a unified API (`huggingface_hub.InferenceClient`), and dedicated **Inference Endpoints** for managed GPU deployments with autoscaling. Check pricing, data policy and rate limits; verify current product names and features.
```python
from huggingface_hub import InferenceClient
client = InferenceClient(model="meta-llama/Llama-3.1-8B-Instruct", token=HF_TOKEN)
client.chat_completion([{"role": "user", "content": "Hello"}], max_tokens=100)
```

### Q81. Gradio / Streamlit Spaces for demos
Gradio gives fast ML UIs (`Interface`, `Blocks`, chat components) and automatic API endpoints. Spaces secrets store tokens; `requirements.txt` pins deps; ZeroGPU/GPU hardware tiers exist (verify availability).

### Q82. Model licensing and compliance
Check weights licence, training-data restrictions, acceptable-use policy, attribution requirements and downstream obligations; document in your model card. Some "open" models restrict commercial use or large-scale deployment.

### Q83. Dataset licensing, PII and consent
Read dataset cards for licence, collection method and known issues. Scan for PII, remove sensitive content, honour opt-outs, and record provenance. Scraped web data may carry copyright and privacy risk.

### Q84. Tokenizer customisation
Train a new tokenizer with `tokenizers` (BPE/Unigram/WordPiece) or `tokenizer.train_new_from_iterator` for domain/language coverage. Adding tokens requires `model.resize_token_embeddings(len(tok))` and fine-tuning the new embeddings.

### Q85. Adding special tokens safely
`tok.add_special_tokens({"additional_special_tokens": ["<TICKET>"]})` then resize embeddings; initialise new embeddings sensibly (mean of existing) and ensure train and inference use the same tokenizer files.

### Q86. Continued pre-training (domain adaptation)
Further pre-train on domain text (MLM or causal LM) with a lower LR, mixing in general data to limit forgetting. Evaluate on domain tasks. Often beats fine-tuning alone when labelled data is scarce.

### Q87. Knowledge distillation with HF
Train a small student on teacher logits or generated outputs (DistilBERT, TinyBERT, MiniLM-style). Use a custom `Trainer.compute_loss` combining soft-target KL (temperature) and hard-label loss.

### Q88. Pruning and compilation
`torch.compile(model)` can speed up inference/training; static KV cache + compile accelerate generation in recent versions. Test for graph breaks, recompilation and accuracy; verify per-model support.

### Q89. Multi-GPU inference for large models
`device_map="auto"` for naive pipeline sharding (simple, low utilisation); tensor parallelism via vLLM/TGI/DeepSpeed-Inference for throughput. Watch interconnect bandwidth and per-GPU memory for KV cache.

### Q90. Testing HF-based code
Use tiny random models (`hf-internal-testing/tiny-random-*`) in unit tests, fixed seeds, golden outputs with tolerances, mocked Hub access (offline mode), and pinned revisions in CI to avoid network flakiness.

---

# 🟠 Part 4: Senior (5–7 years)

### Q91. End-to-end project design using the HF stack
Data (Hub/`datasets`, versioned) → baseline (pipeline/zero-shot or TF-IDF) → fine-tune (Trainer / TRL + PEFT) → evaluate (`evaluate`, harness, human review) → push to private Hub repo with model card → export/optimise (Optimum / quantised weights) → serve (TGI/vLLM/Endpoints/own FastAPI) → monitor and retrain. Keep every artefact (data revision, code SHA, config, adapters) linked.

### Q92. Choosing between API, hosted open model and self-hosting
APIs: fastest, strongest generalists, data-governance and cost concerns. HF Inference Providers/Endpoints: open models with managed ops. Self-host (vLLM/TGI on your GPUs/K8s): best control/cost at steady high volume, requires ops skills. Decide on privacy, latency, volume, quality gap, and team capacity.

### Q93. Private Hub, organisations and governance
Use organisation repos with roles, private repos, fine-grained tokens, SSO (Enterprise Hub), audit logs, resource groups, and gated access for sensitive models. Mirror critical models to internal registries for availability and supply-chain control.

### Q94. Supply-chain security for models
Prefer `safetensors`; avoid unpickling untrusted `.bin/.pt`; scan repos (Hub malware/pickle scanning is helpful but not sufficient); pin commit SHAs; review `trust_remote_code`; verify hashes; sandbox loading; restrict network egress for inference containers; keep an allow-list of approved models.

### Q95. Reproducible training pipelines
Config-driven (YAML/Hydra), versioned datasets (`revision=`/DVC), seeds, containers with pinned `torch/transformers/peft/trl` versions, deterministic data ordering, tracked runs (W&B/MLflow), automatic evaluation on a fixed suite, and artefact registration to the Hub with metadata.

### Q96. Scaling fine-tuning to multiple nodes
`accelerate launch` / `torchrun`, FSDP or DeepSpeed ZeRO-3 configs, fast interconnects (NCCL over InfiniBand/EFA), shared dataset storage with sharded streaming, checkpointing to shared storage (sharded checkpoints), failure recovery, and throughput tracking (tokens/sec, MFU).

### Q97. Efficient long-sequence training
FlashAttention, gradient checkpointing, packing with proper masking, context-parallel/sequence-parallel techniques, RoPE scaling (YaRN, linear, NTK) with evaluation on long tasks, and careful batch sizing. Validate that long-context fine-tuning doesn't degrade short-context quality.

### Q98. Instruction-tuning data strategy
Quality over quantity: diverse tasks, consistent formats, deduplicated, safety-reviewed, and balanced with general data; include refusal/edge cases and tool-use formats if needed; generate synthetic data with strong models but filter and verify; hold out a clean evaluation set.

### Q99. Preference-optimisation pipeline with TRL
SFT → collect preference pairs (human or AI-assisted with auditing) → DPO/IPO/KTO/ORPO (or PPO/GRPO with reward functions) → evaluate for helpfulness, safety, verbosity bias, and regression → iterate. Monitor reward margins, KL to reference and sample quality, not only loss.

### Q100. GRPO / RL with verifiable rewards in TRL
Define reward functions (unit-test pass, exact-match math, format checks), sample groups of completions per prompt, optimise with group-relative advantages. Use vLLM generation for speed; watch for reward hacking, format collapse and length inflation; keep a held-out evaluation. Verify current TRL API.

### Q101. Production serving architecture for an LLM
Gateway (auth, rate limits, quotas) → router (model selection, A/B) → inference servers (vLLM/TGI, autoscaled GPU pool, warm replicas) → cache (prompt/prefix, semantic) → guardrails (input/output moderation, PII, schema validation) → observability (latency, tokens/sec, queue depth, cost per request, quality sampling) → fallback providers.

### Q102. Latency and throughput optimisation
Quantisation (AWQ/GPTQ/FP8), continuous batching, paged KV cache, prefix caching, speculative decoding (draft model / Medusa / EAGLE), tensor parallelism, shorter prompts, streaming, request routing by length, and right-sizing GPU type. Measure TTFT (time to first token), inter-token latency and throughput under realistic load.

### Q103. GPU memory planning for inference
Weights (params × bytes) + KV cache (`2 × layers × kv_heads × head_dim × seq × batch × bytes`) + activations/overhead. GQA/MQA models shrink the cache; quantising the KV cache (FP8/INT8) helps; set `max_model_len` and `gpu_memory_utilization` deliberately.

### Q104. Multi-tenant adapter serving
One quantised base plus many LoRA adapters per customer/task loaded on demand (vLLM LoRA, LoRAX, TGI multi-LoRA). Manage adapter registry, versioning, isolation, eviction policy, and per-tenant evaluation.

### Q105. Monitoring and evaluation of deployed HF models
Log prompts/outputs (with PII controls), track latency/errors/cost, sample outputs for human or LLM-judge review, monitor input distribution and embedding drift, run canary evaluations on a golden set after every model/config change, and maintain rollback.

### Q106. Handling model deprecations and Hub changes
Mirror and pin models; test upgrades of `transformers` in CI with a compatibility suite (numerics + generation + tokenizer parity); track release notes for deprecated arguments; abstract model loading behind an internal interface.

### Q107. Cost control
Use smaller/distilled or quantised models, route easy requests to cheap models, cache, batch offline workloads, spot instances for training, scale-to-zero for rarely used endpoints, and track cost per token/request/feature.

### Q108. Multimodal models in `transformers`
Processors combine tokenizer + image/audio processors (`AutoProcessor`). Vision-language models (LLaVA, Qwen-VL, PaliGemma, Idefics) take images and text; handle image resolution, number of image tokens (affects context/cost), and batching. See `../11_Generative_AI/071_Multimodal-AI.md`.

### Q109. Diffusers in production
Use fp16/bf16, `torch.compile`, attention slicing/xformers/SDPA, CPU offload for small GPUs, safety checker/policy filters, seed control, LoRA for style/subject, schedulers (DPM++/Euler/LCM) to cut steps, and queue-based serving with batching. Check licences (some models are non-commercial).

### Q110. Evaluating embeddings and RAG built on HF
Create a labelled query set; measure Recall@k, MRR, nDCG for retrieval; faithfulness and answer relevance for generation; compare embedding models, chunking, hybrid search and re-rankers; run ablations and track results per release.

### Q111. Safety and content filtering
Use moderation models (Llama Guard-style classifiers, toxicity classifiers), prompt hardening, output schema validation, refusal behaviours, rate limiting and abuse monitoring. Red-team before launch. See `../11_Generative_AI/072_LLM-Evaluation-and-Guardrails.md`.

### Q112. Privacy and data residency
Self-host or use private endpoints for sensitive data; avoid logging raw PII; encrypt at rest/in transit; configure retention; check provider data-use policies; consider region-specific deployment. Verify compliance obligations (GDPR, DPDP Act) with counsel.

### Q113. Contributing to open source (HF ecosystem)
Add a model to `transformers` (modular modeling files, tests, docs), publish datasets with cards, improve docs/examples, fix bugs. Follow contribution guides; tests across frameworks, style (`ruff`), and reproducible examples.

### Q114. Benchmarks and leaderboards: use with care
Leaderboards (Open LLM Leaderboard, MTEB, Chatbot Arena-style) are signals, not decisions: contamination, overfitting to benchmarks, and mismatched tasks are risks. Evaluate on your own data and constraints.

### Q115. Migration strategy between models
Abstract prompts and templates per model, keep golden evaluation sets, compare quality/latency/cost, A/B or shadow test, update tokenizers and chat templates together, and plan staged rollout with rollback.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q116. Platform strategy around Hugging Face
Standardise on the Hub (private org) as model/dataset registry, `transformers`/`peft`/`trl` as training stack, Accelerate/DeepSpeed/FSDP for scale, vLLM/TGI for serving, and an evaluation harness for gates. Provide golden-path templates (training repo, inference service, CI) and guardrails (approved model list, licence checks, security scans).

### Q117. Build vs buy vs open weights
Decide per use case: closed APIs for frontier quality and speed; open weights via HF for control, privacy, customisation and cost at scale; small specialised models for high-volume narrow tasks. Maintain a model-agnostic interface and routing layer to avoid lock-in and to adapt as models evolve.

### Q118. Governance and licensing process
Intake workflow for new models/datasets: licence review, security scan, evaluation on internal benchmarks, risk classification, approval, registration in an internal catalogue with model cards, and periodic re-review. Track provenance and obligations (attribution, use restrictions).

### Q119. Reliability engineering for ML services
SLOs for latency, availability and quality; load testing with realistic prompts; autoscaling policies based on queue depth/tokens; graceful degradation (smaller model, cached answers); multi-region failover; incident runbooks; capacity planning for GPUs.

### Q120. Team enablement and standards
Shared libraries, templates, example repos, review checklists (chat templates, padding side, seeds, licence, security), internal training, office hours, and a "known pitfalls" document. Measure adoption and reduce duplicated infrastructure.

### Q121. Cost governance
Per-team GPU budgets and quotas, chargeback dashboards, utilisation targets, preemptible training, model/size selection reviews, and sunset policies for unused endpoints and checkpoints.

### Q122. Responsible AI program
Model/data cards as deliverables, bias and safety evaluations, red-teaming, human oversight for high-impact use, transparency to users, incident reporting, and alignment with regulation (EU AI Act risk tiers, sector rules, DPDP). Verify current legal requirements.

### Q123. Long-term maintenance
Track upstream library releases and deprecations, keep reproducible environments (lockfiles, containers), retrain on schedule or drift triggers, archive artefacts with lineage, and document decisions so systems survive team turnover.

### Q124. Strategy for open-source community engagement
Contribute fixes upstream rather than forking, publish internal-safe artefacts (datasets, adapters, evals) where permitted, engage in Hub discussions, and monitor ecosystem changes (new architectures, quantisation formats, serving engines) to plan adoption.

### Q125. Communicating trade-offs to leadership
Frame choices in cost, risk, time-to-market and quality: e.g., "Self-hosted 8B model with LoRA reaches 94% of API quality at 20% of cost at our volume, with ownership of data; needs two engineers for ops." Provide pilot results, evaluation evidence and exit options.

---

# 💻 Part 6: Hands-On Tasks & Code

### Task 1. Quick inference with several pipelines
```python
from transformers import pipeline
sent = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
ner = pipeline("token-classification", model="dslim/bert-base-NER", aggregation_strategy="simple")
summ = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
print(sent("Great product, slow delivery"))
print(ner("Ritesh Kumar works at Infosys in Pune"))
print(summ(long_text, max_length=80, min_length=30, do_sample=False))
```

### Task 2. Fine-tune a text classifier end to end
```python
import numpy as np, evaluate
from datasets import load_dataset
from transformers import (AutoTokenizer, AutoModelForSequenceClassification, TrainingArguments,
                          Trainer, DataCollatorWithPadding, EarlyStoppingCallback)

name = "distilbert-base-uncased"
ds = load_dataset("ag_news")
tok = AutoTokenizer.from_pretrained(name)
ds = ds.map(lambda b: tok(b["text"], truncation=True, max_length=128), batched=True)
split = ds["train"].train_test_split(test_size=0.1, seed=42)
model = AutoModelForSequenceClassification.from_pretrained(name, num_labels=4)
f1 = evaluate.load("f1")
def metrics(p): return f1.compute(predictions=np.argmax(p.predictions, -1), references=p.label_ids, average="macro")

args = TrainingArguments("out", learning_rate=3e-5, per_device_train_batch_size=32, per_device_eval_batch_size=64,
                         num_train_epochs=3, eval_strategy="epoch", save_strategy="epoch", load_best_model_at_end=True,
                         metric_for_best_model="f1", warmup_ratio=0.06, weight_decay=0.01, bf16=True, report_to="none")
trainer = Trainer(model=model, args=args, train_dataset=split["train"], eval_dataset=split["test"],
                  processing_class=tok, data_collator=DataCollatorWithPadding(tok), compute_metrics=metrics,
                  callbacks=[EarlyStoppingCallback(early_stopping_patience=1)])
trainer.train(); print(trainer.evaluate(ds["test"]))
trainer.push_to_hub()      # optional
```

### Task 3. NER fine-tuning with label alignment
```python
from datasets import load_dataset
from transformers import AutoModelForTokenClassification, DataCollatorForTokenClassification
ds = load_dataset("conll2003"); labels = ds["train"].features["ner_tags"].feature.names
tok = AutoTokenizer.from_pretrained("bert-base-cased")
def align(b):
    enc = tok(b["tokens"], is_split_into_words=True, truncation=True)
    all_labels = []
    for k, tags in enumerate(b["ner_tags"]):
        prev, lab = None, []
        for w in enc.word_ids(batch_index=k):
            lab.append(-100 if w is None or w == prev else tags[w])
            prev = w
        all_labels.append(lab)
    enc["labels"] = all_labels
    return enc
tokenized = ds.map(align, batched=True)
model = AutoModelForTokenClassification.from_pretrained("bert-base-cased", num_labels=len(labels))
collator = DataCollatorForTokenClassification(tok)
# evaluate with seqeval (entity-level F1)
```

### Task 4. QLoRA SFT on an instruction dataset
```python
import torch
from datasets import load_dataset
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import LoraConfig
from trl import SFTTrainer, SFTConfig

name = "meta-llama/Llama-3.2-1B-Instruct"       # gated: accept terms + HF_TOKEN
bnb = BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_quant_type="nf4", bnb_4bit_compute_dtype=torch.bfloat16)
tok = AutoTokenizer.from_pretrained(name); tok.pad_token = tok.pad_token or tok.eos_token
lm = AutoModelForCausalLM.from_pretrained(name, quantization_config=bnb, device_map="auto")
ds = load_dataset("json", data_files="support_chat.jsonl", split="train")   # {"messages": [...]}
cfg = LoraConfig(r=16, lora_alpha=32, lora_dropout=0.05, target_modules="all-linear", task_type="CAUSAL_LM")
args = SFTConfig(output_dir="sft-support", per_device_train_batch_size=2, gradient_accumulation_steps=8,
                 learning_rate=2e-4, num_train_epochs=2, bf16=True, gradient_checkpointing=True,
                 logging_steps=10, save_strategy="epoch", max_length=1536)
SFTTrainer(model=lm, args=args, train_dataset=ds, peft_config=cfg, processing_class=tok).train()
```

### Task 5. Merge adapter and push
```python
from peft import PeftModel
base = AutoModelForCausalLM.from_pretrained(name, torch_dtype=torch.bfloat16, device_map="auto")
merged = PeftModel.from_pretrained(base, "sft-support/checkpoint-final").merge_and_unload()
merged.save_pretrained("support-merged", safe_serialization=True); tok.save_pretrained("support-merged")
merged.push_to_hub("ritesh/support-llama-1b", private=True)
```

### Task 6. Chat inference with a template and streaming
```python
from transformers import TextStreamer
msgs = [{"role": "user", "content": "Summarise our refund policy in 3 bullets."}]
ids = tok.apply_chat_template(msgs, add_generation_prompt=True, return_tensors="pt").to(lm.device)
lm.generate(ids, max_new_tokens=200, do_sample=True, temperature=0.3, top_p=0.9,
            streamer=TextStreamer(tok, skip_prompt=True))
```

### Task 7. Semantic search with embeddings + FAISS
```python
import faiss, numpy as np
from sentence_transformers import SentenceTransformer
m = SentenceTransformer("BAAI/bge-small-en-v1.5")
docs = ["Reset password via settings", "Refund within 7 days", "Track orders in the app"]
E = m.encode(docs, normalize_embeddings=True).astype("float32")
index = faiss.IndexFlatIP(E.shape[1]); index.add(E)
q = m.encode(["how do I get my money back?"], normalize_embeddings=True).astype("float32")
D, I = index.search(q, 2); print([docs[i] for i in I[0]], D[0])
```

### Task 8. Streaming a huge dataset and training on the fly
```python
ds = load_dataset("HuggingFaceFW/fineweb", name="sample-10BT", split="train", streaming=True)
ds = ds.map(lambda b: tok(b["text"], truncation=True, max_length=512), batched=True).shuffle(buffer_size=10_000, seed=0)
# Trainer requires max_steps with IterableDataset
```

### Task 9. Accelerate custom training loop
```python
from accelerate import Accelerator
from torch.utils.data import DataLoader
acc = Accelerator(mixed_precision="bf16")
loader = DataLoader(tokenized, batch_size=16, shuffle=True, collate_fn=collator)
opt = torch.optim.AdamW(model.parameters(), lr=2e-5)
model, opt, loader = acc.prepare(model, opt, loader)
for epoch in range(3):
    for batch in loader:
        loss = model(**batch).loss
        acc.backward(loss); acc.clip_grad_norm_(model.parameters(), 1.0)
        opt.step(); opt.zero_grad()
    acc.print(f"epoch {epoch} loss {loss.item():.4f}")
acc.wait_for_everyone(); acc.unwrap_model(model).save_pretrained("out")
```

### Task 10. Gradio chatbot Space
```python
import gradio as gr
def respond(message, history):
    msgs = [{"role": r, "content": c} for h in history for r, c in (("user", h[0]), ("assistant", h[1]))]
    msgs.append({"role": "user", "content": message})
    ids = tok.apply_chat_template(msgs, add_generation_prompt=True, return_tensors="pt").to(lm.device)
    out = lm.generate(ids, max_new_tokens=256, do_sample=True, temperature=0.5)
    return tok.decode(out[0][ids.shape[-1]:], skip_special_tokens=True)
gr.ChatInterface(respond).launch()
```

### Task 11. Serve with vLLM (OpenAI-compatible)
```bash
pip install vllm
vllm serve ritesh/support-llama-1b --dtype bfloat16 --max-model-len 4096 --gpu-memory-utilization 0.9
# client:
# curl http://localhost:8000/v1/chat/completions -H "Content-Type: application/json" \
#   -d '{"model":"ritesh/support-llama-1b","messages":[{"role":"user","content":"Hi"}]}'
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. `OSError: ... is not a local folder and is not a valid model identifier` / 401 / 403
Typo in repo ID, private/gated repo without token or without accepting terms, or an expired token. Run `huggingface-cli whoami`, set `HF_TOKEN`, accept the licence on the model page.

### D2. "Some weights ... were not initialized from the model checkpoint"
Expected when adding a new task head (classification layer). It's a problem only if the base weights themselves are missing (wrong class or checkpoint).

### D3. CUDA out of memory during fine-tuning
Reduce batch size/sequence length, enable `gradient_checkpointing`, use `bf16`, gradient accumulation, 8-bit/4-bit + LoRA, `paged_adamw_8bit`, FSDP/ZeRO. Remove stored tensors in custom `compute_metrics`.

### D4. Garbage or repetitive generation from a chat model
Wrong/absent chat template, wrong stop tokens, extreme sampling settings, or `pad_token`/EOS misconfiguration. Use `apply_chat_template`, set `eos_token_id`, `temperature` ~0.2–0.8, `top_p`.

### D5. Batched generation returns weird outputs
Right padding with a decoder-only model. Set `tok.padding_side = "left"` and `pad_token`; pass `attention_mask`.

### D6. `ValueError: Asking to pad but the tokenizer does not have a padding token`
Set `tok.pad_token = tok.eos_token` (and `model.config.pad_token_id`) for GPT-style models, or add a dedicated pad token and resize embeddings.

### D7. Loss is NaN during mixed precision
FP16 overflow, too-high LR, bad data. Use `bf16`, lower LR, gradient clipping (`max_grad_norm`), check labels and tokenisation, verify no empty sequences.

### D8. `Trainer` evaluation yields very low metrics but training loss looks fine
Label mapping mismatch (`id2label`), wrong `compute_metrics` shape handling, evaluating logits vs labels incorrectly, or leakage in the split. Inspect a few predictions manually.

### D9. `datasets.map` is slow or re-runs every time
Not using `batched=True`/`num_proc`, non-deterministic functions breaking fingerprints, or changing closures. Use pure functions, `cache_file_name`, or fix hashing.

### D10. `load_dataset` fails on a script-based dataset
Newer `datasets` versions restrict loading arbitrary dataset scripts; use Parquet/standard formats or `trust_remote_code` only for reviewed datasets (verify current policy).

### D11. Model works locally but fails in Docker/offline environment
Model not cached, no network egress, token missing. Pre-download with `snapshot_download`, bake into the image or mount a cache, set `HF_HUB_OFFLINE=1`, pass secrets securely.

### D12. LoRA adapter loads but outputs are unchanged
Adapter not applied (wrong base, wrong `target_modules`, not set to eval/active adapter), or merge applied to a different dtype. Check `model.active_adapters`, trainable parameter count and compare outputs with/without adapter.

### D13. After merging a QLoRA adapter, quality drops
Merging into a quantised base introduces rounding error. Merge into the FP16/BF16 base weights instead of the 4-bit model, then optionally re-quantise; evaluate before/after.

### D14. Inference slower than expected
Running on CPU, FP32, `eager` attention, no KV cache, no batching, Python loop per request. Use GPU + bf16/fp16, SDPA/FlashAttention, `torch.compile`, vLLM/TGI, batch requests.

### D15. Tokenizer mismatch between training and serving
Different files/versions, special tokens added only on one side, or chat template changed. Save the tokenizer with the model, pin revisions, test tokenisation parity on a golden set.

---

# 🧩 Part 8: Tricky Questions

### T1. Does `model.eval()` stop gradient computation?
No. It switches dropout/BN behaviour. Use `torch.no_grad()`/`inference_mode()` to avoid building graphs.

### T2. Why do I get different results with the same `pipeline` call after upgrading?
Default model, tokenizer, generation config or post-processing may change between versions. Pin model revision and library versions.

### T3. Is `from_pretrained(name)` always reproducible?
Not if the repo changes; use a commit SHA `revision`. Also remote code and default dtype/config can vary.

### T4. Is fine-tuning with LoRA always worse than full fine-tuning?
Often close for many tasks, especially with higher rank on all linear layers, but full fine-tuning can win on large distribution shifts or heavy knowledge injection. Evaluate on your task.

### T5. Can I fine-tune a gated model and share it freely?
Not necessarily. Derivative models usually inherit licence/gating obligations. Read the licence.

### T6. Why does `generate` ignore my `max_length`?
`max_length` counts prompt + generated tokens; prefer `max_new_tokens`. Also generation config in the repo may set defaults.

### T7. Does `padding=True` pad to the model's max length?
No. It pads to the longest in the batch. `padding="max_length"` pads to `max_length`.

### T8. Why does perplexity differ across implementations?
Tokenisation, stride/sliding-window evaluation, context length, special-token handling and dtype differences change results.

### T9. Is `safetensors` encrypted?
No; it's a safe, non-executable format, not encryption. Protect private weights with access control.

### T10. Can `trust_remote_code=True` be safe?
Only if you audit the code and pin the revision; it executes arbitrary Python from the repo.

### T11. Why can the same model yield different outputs on different GPUs?
Non-deterministic kernels, different attention implementations, dtype/fusion differences, and sampling randomness. Set seeds, use greedy decoding for tests, accept small numeric tolerances.

### T12. Does a larger `num_beams` always improve quality?
No. Beam search favours generic/repetitive outputs for open-ended generation and increases latency; it helps translation/summarisation more than chat.

### T13. Why does `Trainer` ignore my custom columns?
It drops columns not accepted by the model's `forward` (`remove_unused_columns=True`). Set it to `False` for custom collators/losses that need extra fields.

### T14. Is the Open LLM leaderboard score enough to pick a model?
No; benchmark contamination, task mismatch and prompt-format sensitivity limit its usefulness. Evaluate on your own tasks.

### T15. Can I use `datasets` for data that doesn't fit on disk?
Yes with streaming from remote storage (S3/HF Hub/WebDataset), but you lose random access and caching.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- Hub = Git-based registry for models, datasets, Spaces.
- `pipeline` = preprocess + model + postprocess.
- `AutoTokenizer` + `AutoModelFor...` load by name.
- Tokenizer and model must match.
- `attention_mask` ignores padding.
- Use `-100` to ignore labels in loss.
- `datasets` is Arrow-based and memory-mapped.
- `map(batched=True)` for speed.
- `Trainer` = loop + eval + checkpoints + DDP.
- `safetensors` over pickle.
- Pin `revision` to a commit SHA.
- `apply_chat_template` for chat models.
- Decoder-only batching needs left padding.
- LoRA trains small adapters; QLoRA adds 4-bit base.
- `merge_and_unload` for simple serving.
- TRL: SFT, DPO, PPO, GRPO.
- Accelerate runs one loop anywhere.
- vLLM/TGI for production LLM serving.
- `trust_remote_code` = executes repo code.
- Read licences and model cards.
- Evaluate on your own data, not just leaderboards.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about a project where you used Hugging Face
Use STAR: business need and metric → baseline (zero-shot/TF-IDF) → data prep with `datasets` → model choice and fine-tuning (Trainer or TRL + LoRA) → evaluation (macro-F1/faithfulness, error analysis) → packaging (model card, Hub private repo) → deployment (ONNX/vLLM/Endpoints) → monitoring → impact. Example: "Fine-tuned DeBERTa-v3 for ticket routing: macro-F1 0.71 → 0.86; exported to ONNX int8, p95 latency 18 ms; cut manual triage by 40%."

### P2. A time a model behaved differently in production
Describe the mismatch (tokenizer/chat template/revision change, dtype, truncation), how you found it (golden-set diff), the fix (pinning, parity tests) and prevention (CI checks).

### P3. How did you choose between fine-tuning, RAG and prompting?
Compared options on a labelled evaluation set for quality, latency, cost and maintenance; used RAG for changing knowledge, LoRA for style/format consistency, and prompting for quick prototypes.

### P4. How did you handle licences and compliance for models/datasets?
Reviewed cards and licences, recorded them in an internal catalogue, avoided restricted models for commercial features, kept attribution, and scanned data for PII.

### P5. How did you optimise inference cost?
Distilled/quantised models, switched to vLLM with continuous batching, cached responses, routed easy queries to small models, and tracked cost per request.

### P6. How do you keep experiments reproducible?
Seeds, pinned versions and dataset revisions, config files, tracked runs, containers, and versioned artefacts linked on the Hub.

### P7. How do you onboard teammates to the HF stack?
A template repo with training/evaluation/serving examples, documented pitfalls (padding side, chat templates, tokens), shared caches, and a review checklist.

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- Hub: repos, revisions, cards, licences, gated models, tokens, organisations, private repos.
- `transformers`: pipelines, Auto classes, configs, tokenizers/processors, generation, chat templates, attention backends.
- `datasets`: loading, streaming, Arrow, map/filter, caching, Parquet, pushing to Hub.
- Training: `Trainer`, collators, metrics, callbacks, mixed precision, checkpointing, resuming.
- Scaling: Accelerate, DDP, FSDP, DeepSpeed, gradient checkpointing, memory budgeting.
- Efficient fine-tuning: PEFT (LoRA/QLoRA/adapters), bitsandbytes, quantisation formats.
- Alignment: TRL SFT/DPO/PPO/GRPO, reward models, preference data.
- Embeddings & retrieval: sentence-transformers, cross-encoders, MTEB, FAISS integration.
- Multimodal & generative: vision, audio, VLMs, `diffusers`.
- Serving: Optimum/ONNX, TGI, vLLM, Inference Endpoints/Providers, Spaces (Gradio/Streamlit).
- Safety & governance: safetensors, remote code, licences, PII, supply chain, monitoring.

## Mixed topics
- Chat templates + SFT masking + evaluation.
- QLoRA + merging + serving adapters.
- Tokenizer changes + embedding resize + continued pre-training.
- Hub revisions + CI + reproducibility.
- vLLM/TGI + quantisation + KV cache planning.
- Licences + governance + private registry.

---

# 🔬 Part 12: Internals

### `from_pretrained` flow
Resolve repo/local path → download/cached files (`config.json`, `model.safetensors` or sharded index, tokenizer files, `generation_config.json`) → instantiate model from config on the meta device (if low-memory) → load weights (with dtype/device placement, quantisation hooks) → tie weights and report missing/unexpected keys.

### Sharded checkpoints
Large models are split into `model-0000x-of-0000N.safetensors` with an index JSON mapping parameter names to shards, so loading can stream shard by shard and place parameters directly on devices.

### Tokenizers library pipeline
Normalizer → pre-tokenizer → model (BPE/WordPiece/Unigram) → post-processor (special tokens) → decoder. Rust implementation enables parallel batching and offset mappings.

### `generate()` loop
Prepare inputs → loop: forward pass (with KV cache) → logits processors (temperature, top-k/p, penalties) → sample/argmax/beam update → stopping criteria → append token. Generation configs merge repo defaults, model config and call arguments.

### Trainer internals
Builds dataloaders, optimiser/scheduler, wraps with Accelerate for distributed/mixed precision, runs a training loop with gradient accumulation, calls `compute_loss`, evaluates via `evaluation_loop`, handles callbacks, checkpoint saving and resume.

### Datasets Arrow storage
Columnar files memory-mapped from disk; slicing reads only the needed pages. `map` writes new Arrow files and caches by fingerprint (hash of function + parameters + previous fingerprint).

### LoRA math
`W' = W + (α/r)·B·A` with `A ∈ R^{r×k}` (init Gaussian) and `B ∈ R^{d×r}` (init zeros) so training starts at the base model. Only `A, B` receive gradients; merging computes `W + (α/r)BA`.

### bitsandbytes 4-bit (NF4)
Weights are blockwise-quantised to 4-bit NormalFloat codes with per-block scales (optionally double-quantised); during forward they're dequantised to the compute dtype on the fly. Gradients flow to LoRA parameters, not the frozen quantised weights.

### Accelerate `prepare`
Wraps model (DDP/FSDP/DeepSpeed), optimiser, scheduler and dataloaders (sharding by process), handling device placement and mixed precision context.

### Hub storage
Git repos with large files in LFS/Xet (content-addressed chunk storage); `huggingface_hub` caches files by commit hash under `models--org--name/snapshots/<sha>/` with symlinks to blobs, so revisions are deduplicated.

---

# 📊 Part 13: Reference Tables

### Task → class / pipeline
| Task | Auto class | Pipeline name |
|---|---|---|
| Text classification | `AutoModelForSequenceClassification` | `text-classification` |
| NER | `AutoModelForTokenClassification` | `token-classification` |
| Extractive QA | `AutoModelForQuestionAnswering` | `question-answering` |
| Text generation | `AutoModelForCausalLM` | `text-generation` |
| Summarisation/translation | `AutoModelForSeq2SeqLM` | `summarization` / `translation` |
| Masked LM | `AutoModelForMaskedLM` | `fill-mask` |
| Embeddings | `AutoModel` / sentence-transformers | `feature-extraction` |
| Image classification | `AutoModelForImageClassification` | `image-classification` |
| Object detection | `AutoModelForObjectDetection` | `object-detection` |
| Speech recognition | `AutoModelForSpeechSeq2Seq` | `automatic-speech-recognition` |
| VLM | `AutoModelForVision2Seq` / `AutoModelForImageTextToText` | `image-text-to-text` |

### Fine-tuning method choice
| Situation | Method |
|---|---|
| Small encoder, plenty of labels | Full fine-tune |
| Large LLM, limited GPU | LoRA / QLoRA |
| Many tenants/tasks | LoRA adapters on shared base |
| Behaviour alignment | SFT then DPO/KTO |
| Verifiable tasks (math/code) | GRPO / RL with verifiable rewards |
| Fresh knowledge | RAG, not fine-tuning |
| Domain vocabulary shift | Continued pre-training + fine-tune |

### Serving options
| Option | Best for |
|---|---|
| `pipeline` / `generate` in FastAPI | Prototypes, low traffic |
| ONNX Runtime / Optimum | Encoders, CPU/edge, low latency |
| vLLM | High-throughput LLMs, LoRA, OpenAI API |
| TGI | HF-native LLM serving, streaming |
| Inference Endpoints/Providers | Managed hosting |
| llama.cpp / GGUF | Local/CPU/edge LLMs |
| TensorRT-LLM | Max NVIDIA performance |

### Precision & quantisation
| Format | Notes |
|---|---|
| FP32 | Baseline, rarely for large models |
| BF16 | Preferred training/inference on modern GPUs |
| FP16 | Needs loss scaling for training |
| INT8 (bnb/ORT) | ~2× memory saving, mild loss |
| NF4 / GPTQ / AWQ (4-bit) | ~4× saving; QLoRA / inference |
| GGUF Q4/Q5 | CPU/local inference |
| FP8 | Newer GPUs, high throughput |

### Key environment variables
| Variable | Purpose |
|---|---|
| `HF_HOME` | Cache root |
| `HF_TOKEN` | Auth token |
| `HF_HUB_OFFLINE` / `TRANSFORMERS_OFFLINE` | Offline mode |
| `HF_HUB_ENABLE_HF_TRANSFER` | Faster downloads (hf_transfer) |
| `TOKENIZERS_PARALLELISM` | Silence fork warnings (`false`) |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
```python
tok = AutoTokenizer.from_pretrained("bert-base-uncased")
print(tok.tokenize("unaffordable"))
```
Likely **`['un', '##a', '##ff', '##ord', '##able']`** (WordPiece pieces with `##`; exact split depends on the vocab). Point: rare words are split into subwords.

### O2.
```python
enc = tok("hello world", return_tensors="pt")
print(enc["input_ids"].shape)
```
BERT adds `[CLS]` and `[SEP]`: tokens = 4 → **`torch.Size([1, 4])`**.

### O3.
```python
tok(["hi", "a much longer sentence here"], padding=True, return_tensors="pt")["attention_mask"]
```
The shorter sequence gets trailing zeros in its mask (right padding for BERT-style models).

### O4.
LoRA with `r=8`, target a `4096×4096` linear layer: trainable params per layer = `8·4096 + 4096·8` = **65,536** vs 16,777,216 frozen (~0.39%).

### O5.
7B parameters loaded in BF16 need about **14 GB** for weights (2 bytes each); in 4-bit about **3.5–4 GB** (plus overhead).

### O6.
```python
ds = Dataset.from_dict({"x": [1, 2, 3]})
print(ds.map(lambda b: {"y": [v * 2 for v in b["x"]]}, batched=True)["y"])
```
**`[2, 4, 6]`**

### O7.
`DataCollatorWithPadding` on a batch with lengths 5, 9, 7 pads all to length **9** (not the model's max).

### O8.
Effective batch size with `per_device_train_batch_size=8`, `gradient_accumulation_steps=4`, 2 GPUs = `8·4·2` = **64**.

### O9.
`TrainingArguments(num_train_epochs=3)` on 10,000 samples with effective batch 100: steps per epoch = 100; total = **300** optimiser steps.

### O10.
`generate(..., max_new_tokens=50)` on a 30-token prompt returns a sequence of at most **80 tokens** (30 + 50) for decoder-only models (including the prompt).

### O11.
```python
model.save_pretrained("m")
```
Creates (typically) **`config.json`, `model.safetensors`** (and `generation_config.json` for generative models); the tokenizer needs its own `save_pretrained`.

### O12.
KV cache memory for a model with 32 layers, 8 KV heads, head_dim 128, FP16, sequence 4096, batch 1:
`2 · 32 · 8 · 128 · 4096 · 2 bytes` = 536,870,912 bytes = **0.5 GiB**.

---

# ✅ Part 15: MCQs

**1. Which file format is safe from arbitrary code execution when loading weights?**
A) `.pkl`  B) `.bin` (pickle)  C) `.safetensors`  D) `.py`
**Answer: C**

**2. Which class loads the right tokenizer for a checkpoint automatically?**
A) `BertTokenizer`  B) `AutoTokenizer`  C) `TokenizerFactory`  D) `PreTrainedModel`
**Answer: B**

**3. For batched generation with a decoder-only model you should use:**
A) Right padding  B) Left padding  C) No padding  D) Random padding
**Answer: B**

**4. In token classification, labels for special tokens and non-first subwords are set to:**
A) 0  B) -1  C) -100  D) 100
**Answer: C**

**5. QLoRA combines:**
A) 8-bit full fine-tuning  B) 4-bit quantised base model with LoRA adapters  C) Pruning with distillation  D) RLHF with DPO
**Answer: B**

**6. Which library provides SFT, DPO and PPO/GRPO trainers?**
A) `evaluate`  B) `trl`  C) `tokenizers`  D) `gradio`
**Answer: B**

**7. Best way to make `from_pretrained` reproducible over time:**
A) Use `main`  B) Pin `revision` to a commit SHA  C) Set a seed  D) Use `device_map`
**Answer: B**

**8. `load_dataset(..., streaming=True)` returns:**
A) A `Dataset` in RAM  B) An `IterableDataset` without random access  C) A pandas DataFrame  D) A DataLoader
**Answer: B**

**9. What does `trust_remote_code=True` do?**
A) Verifies signatures  B) Executes custom Python code from the model repo  C) Enables caching  D) Encrypts weights
**Answer: B**

**10. Which serving engine is known for paged attention and continuous batching?**
A) Gradio  B) vLLM  C) Streamlit  D) Optimum-NLP
**Answer: B**

**11. `merge_and_unload()` in PEFT:**
A) Deletes the base model  B) Merges adapter weights into the base and removes adapter layers  C) Uploads to Hub  D) Quantises the model
**Answer: B**

**12. Which is appropriate for adding fresh, frequently changing knowledge?**
A) Full fine-tuning daily  B) RAG  C) Lower learning rate  D) Bigger tokenizer
**Answer: B**

**13. `max_length` vs `max_new_tokens` in `generate`:**
A) Identical  B) `max_length` includes the prompt; `max_new_tokens` counts only generated tokens  C) `max_new_tokens` includes the prompt  D) Both ignore the prompt
**Answer: B**

**14. Which package runs the same PyTorch loop on CPU, multi-GPU or TPU with minimal changes?**
A) `accelerate`  B) `evaluate`  C) `tokenizers`  D) `diffusers`
**Answer: A**

**15. `DataCollatorWithPadding` pads to:**
A) Model max length always  B) Longest sequence in the batch  C) 512 tokens  D) Shortest sequence
**Answer: B**

**16. Which should you read before using a model commercially?**
A) Leaderboard rank  B) Licence and model card  C) Download count  D) Number of likes
**Answer: B**

**17. The `-100` label is ignored by:**
A) The optimiser  B) PyTorch cross-entropy's default `ignore_index`  C) The tokenizer  D) The scheduler
**Answer: B**

**18. For many fine-tuned variants served from one base model, a good approach is:**
A) Full copies of each model  B) LoRA adapters hot-swapped on a shared base  C) Retrain per request  D) Use FP64
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

- Using a tokenizer that does not match the model checkpoint.
- Wrong or missing chat template when prompting instruction/chat models.
- Right padding for batched decoder-only generation; missing `pad_token`.
- Training on prompt tokens when only responses should be learned (no loss masking).
- Not pinning `revision`, `transformers` or `peft/trl` versions.
- Loading untrusted pickle checkpoints or enabling `trust_remote_code` blindly.
- Ignoring licences, gated terms and dataset provenance.
- Leaking tokens into repos, notebooks or logs.
- Evaluating with accuracy on imbalanced data or token-level accuracy for NER.
- Forgetting `model.eval()` / `no_grad` at inference.
- Merging LoRA into a quantised base and not re-evaluating.
- Padding everything to `max_length` and wasting compute.
- Using `map` without `batched=True` / caching awareness.
- Choosing models from leaderboards without testing on your own data.
- Serving via a naive Flask loop instead of a batching-capable server for LLMs.
- No tokenizer/model parity tests between training and serving.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You pin revisions, versions and tokenizers, and test parity between training and serving.
- You understand chat templates, padding side, special tokens and label masking.
- You can budget memory (weights, KV cache, optimiser states) and choose LoRA/QLoRA/FSDP accordingly.
- You evaluate on your own held-out data and compare against prompting/RAG/classical baselines.
- You treat licences, PII, `trust_remote_code` and pickle files as security and compliance concerns.
- You choose serving stacks (vLLM/TGI/ONNX/Endpoints) from latency, throughput and cost data.
- You know when fine-tuning, RAG or prompting is appropriate.
- You automate: CI with tiny models, regression suites, model cards, and Hub release processes.
- You monitor deployed models and have rollback plans.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Load / run
```python
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
tok = AutoTokenizer.from_pretrained(name, revision=sha)
lm = AutoModelForCausalLM.from_pretrained(name, revision=sha, torch_dtype="bfloat16", device_map="auto")
ids = tok.apply_chat_template(msgs, add_generation_prompt=True, return_tensors="pt").to(lm.device)
out = lm.generate(ids, max_new_tokens=256, temperature=0.3, top_p=0.9, do_sample=True)
```

### Fine-tune (encoder)
`AutoModelForSequenceClassification` → tokenise with `map(batched=True)` → `DataCollatorWithPadding` → `Trainer` (LR 2e-5–5e-5, 2–4 epochs, warm-up, eval each epoch, best model at end) → `compute_metrics` (macro-F1) → push to Hub with a model card.

### Fine-tune (LLM)
Chat-format data → correct template + loss on assistant tokens → 4-bit base (QLoRA) + LoRA (`r` 16, all-linear) → `SFTTrainer` (bf16, grad checkpointing, accumulation) → evaluate vs baseline → optional DPO → merge into BF16 base → serve with vLLM/TGI.

### Debug checklist
Auth/licence/token → tokenizer-model match → chat template → padding side/pad token → dtype/device → label alignment (`-100`) → memory (batch, length, checkpointing) → versions/revisions → compare with a golden example.

### Production checklist
Pinned revisions • safetensors • licence recorded • evaluation gate • batching-capable server • quantisation validated • monitoring (latency, tokens, quality sampling) • rollback • secrets managed • PII controls.

### Final checklist before the interview
- [ ] Explain Hub, pipelines, Auto classes, tokenizers and datasets (Arrow, streaming, map).
- [ ] Fine-tune a classifier/NER model with `Trainer`; handle label alignment and metrics.
- [ ] Explain chat templates, `generate` parameters, padding side and KV cache.
- [ ] Describe LoRA/QLoRA, bitsandbytes, merging and adapter serving.
- [ ] Know TRL (SFT/DPO/PPO/GRPO) at a conceptual and practical level.
- [ ] Use Accelerate/DeepSpeed/FSDP; estimate memory for training and inference.
- [ ] Export/serve models (Optimum/ONNX, vLLM, TGI, Endpoints) and optimise latency/cost.
- [ ] Handle safety: safetensors, `trust_remote_code`, licences, tokens, PII.
- [ ] Evaluate models properly (own data, regression suites, LLM-as-judge caveats).
- [ ] Prepare a project story with baseline, fine-tuning choices, numbers and deployment lessons.
