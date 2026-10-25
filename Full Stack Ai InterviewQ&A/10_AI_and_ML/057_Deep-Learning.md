# Deep Learning Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **Python 3.11+, PyTorch 2.x (with `torch.compile`), TensorFlow/Keras 3 (multi-backend), Hugging Face Transformers 4.x, and CUDA 12.x**. Defaults such as AdamW settings, mixed-precision APIs (`torch.autocast`, `torch.amp`), attention kernels (FlashAttention, `scaled_dot_product_attention`) and library names change between releases: anything marked "verify" should be checked in the official docs (pytorch.org, keras.io, huggingface.co/docs). Examples use the sample name **Ritesh Kumar** and small image / text / tabular tasks.
> This file covers neurons and perceptrons, activation functions, forward/backward propagation, loss functions, optimisers, initialisation, normalisation, regularisation, CNNs, RNN/LSTM/GRU, attention and Transformers, autoencoders, GANs, diffusion, transfer learning, training stability, mixed precision, distributed training, model compression, deployment and debugging. Related topics: classical ML in `056_Machine-Learning.md`, PyTorch in `058_PyTorch.md`, NLP in `059_NLP.md`, computer vision in `060_Computer-Vision.md`, reinforcement learning in `061_Reinforcement-Learning.md`, Hugging Face in `062_Hugging-Face.md`, maths in `054_Statistics-and-Math-for-ML.md`, MLOps in `074_MLOps.md`, serving in `../11_Generative_AI/073_Model-Serving-and-Inference.md`.

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

### Q1. What is deep learning? *(Must-know)*
Deep learning is a branch of machine learning that uses **neural networks with many layers** to learn hierarchical representations directly from raw data (pixels, text, audio). It replaces manual feature engineering with learned features and shines when data and compute are plentiful.

### Q2. Deep learning vs machine learning
| Aspect | Classic ML | Deep learning |
|---|---|---|
| Features | Hand-crafted | Learned automatically |
| Data needed | Small–medium | Large |
| Best on | Tabular data | Images, text, audio, video |
| Compute | CPU is fine | GPU/TPU usually |
| Interpretability | Often higher | Lower |

### Q3. What is an artificial neuron? *(Must-know)*
Computes `y = f(w·x + b)`: a weighted sum of inputs plus a bias, passed through a non-linear **activation function** `f`. Weights and bias are learned.

### Q4. Perceptron and MLP
A perceptron is a single neuron with a step activation (linear classifier). A **Multi-Layer Perceptron (MLP)** stacks fully connected layers (input → hidden → output) and can approximate non-linear functions.

### Q5. Why do we need activation functions? *(Must-know)*
Without non-linearity, stacked linear layers collapse into one linear layer. Activations give the network the power to model complex, non-linear relationships.

### Q6. Common activation functions *(Must-know)*
| Function | Formula | Notes |
|---|---|---|
| Sigmoid | 1/(1+e^−x) | Output (0,1); saturates; vanishing gradient |
| Tanh | (e^x−e^−x)/(e^x+e^−x) | Zero-centred; still saturates |
| ReLU | max(0,x) | Default for hidden layers; dying ReLU risk |
| Leaky ReLU | max(0.01x,x) | Fixes dead neurons |
| GELU | x·Φ(x) | Used in Transformers |
| SiLU/Swish | x·σ(x) | Smooth, popular in modern nets |
| Softmax | e^xi/Σe^xj | Multi-class probabilities |

### Q7. Forward propagation
Input flows layer by layer: `h1 = f(W1x + b1)`, `h2 = f(W2h1 + b2)`, … producing the output and then the loss.

### Q8. Backpropagation *(Must-know)*
Applies the **chain rule** to compute the gradient of the loss with respect to every weight, moving from output to input and reusing intermediate results. The optimiser then updates weights using those gradients.

### Q9. Loss functions *(Must-know)*
- Regression: MSE, MAE, Huber.
- Binary classification: binary cross-entropy (BCE).
- Multi-class: categorical cross-entropy (softmax + NLL).
- Others: hinge, KL divergence, contrastive/triplet, CTC (sequence alignment).

### Q10. Gradient descent, SGD, mini-batch
Batch GD uses all data per step (slow), SGD uses one sample (noisy), **mini-batch** uses 32–512 samples (standard: fast and stable). Update: `w ← w − η∇L`.

### Q11. Learning rate
The step size. Too high → loss oscillates/diverges; too low → slow or stuck. It's usually the most important hyper-parameter. Use schedules (cosine, step, warm-up) and the LR range test.

### Q12. Epoch, batch, iteration
- **Epoch**: one full pass through the dataset.
- **Batch size**: samples per update.
- **Iteration**: one update step. Iterations per epoch = dataset size / batch size.

### Q13. Common optimisers
SGD (+momentum), RMSProp, **Adam** (momentum + adaptive step), **AdamW** (Adam with decoupled weight decay: the default for Transformers).

### Q14. Overfitting in neural networks
Training loss keeps falling while validation loss rises. Fixes: more data, augmentation, dropout, weight decay, early stopping, smaller model, batch norm.

### Q15. Dropout
During training, randomly zero a fraction `p` of activations so the net can't rely on any single neuron (ensemble-like effect). Disabled at inference (`model.eval()`); inverted dropout rescales by `1/(1−p)` during training.

### Q16. Weight initialisation
Bad init causes vanishing/exploding signals. **Xavier/Glorot** for tanh/sigmoid; **He/Kaiming** for ReLU. Never initialise all weights to the same value (symmetry problem).

### Q17. Vanishing and exploding gradients *(Must-know)*
Gradients shrink (sigmoid/tanh, deep nets) or blow up as they multiply through layers. Fixes: ReLU-family activations, good init, batch/layer norm, residual connections, gradient clipping, LSTM/GRU gates.

### Q18. Batch normalisation
Normalises layer inputs per mini-batch (`(x−μ)/σ`), then scales/shifts with learnable `γ, β`. Speeds up training, allows higher learning rates, mildly regularises. Uses running statistics at inference.

### Q19. What is a CNN? *(Must-know)*
A Convolutional Neural Network uses **convolution filters** that slide over the input, sharing weights across positions. This exploits spatial locality, uses far fewer parameters than dense layers, and gives translation-equivariance. Typical blocks: Conv → Norm → ReLU → Pool.

### Q20. Convolution, stride, padding, pooling
- Filter (kernel) size, e.g., 3×3; **stride** = step; **padding** keeps size ("same") or none ("valid").
- Output size: `⌊(N + 2P − K)/S⌋ + 1`.
- **Pooling** (max/average) downsamples and adds small translation invariance.

### Q21. What is an RNN?
A Recurrent Neural Network processes sequences step by step, carrying a **hidden state**: `h_t = f(W x_t + U h_{t−1})`. Suited to text/time series but struggles with long dependencies (vanishing gradients) and can't parallelise over time.

### Q22. LSTM and GRU
**LSTM** adds a cell state with input, forget and output gates to keep long-term information. **GRU** is a simpler two-gate variant with fewer parameters. Both mitigate vanishing gradients.

### Q23. Transformers (intro) *(Must-know)*
An architecture built on **self-attention**, with no recurrence. Every token attends to every other token, enabling parallel training and long-range dependencies. It powers BERT, GPT, ViT and modern LLMs.

### Q24. Attention in one line
`Attention(Q,K,V) = softmax(QKᵀ/√d_k)·V`: each token forms a weighted average of values, with weights from query-key similarity.

### Q25. Autoencoder
Encoder compresses input to a bottleneck (latent code); decoder reconstructs it. Used for dimensionality reduction, denoising, anomaly detection (high reconstruction error).

### Q26. GAN (Generative Adversarial Network)
A **generator** creates fake samples and a **discriminator** tells real from fake; they train adversarially. Can produce sharp images but training is unstable (mode collapse).

### Q27. Transfer learning *(Must-know)*
Start from a model pre-trained on a large dataset (ImageNet, web text) and **fine-tune** on your small dataset. Freeze early layers, train the head first, then unfreeze gradually with a small learning rate.

### Q28. Data augmentation
Create variations of training data: flips, crops, colour jitter, rotation, Mixup/CutMix for images; back-translation, token masking for text; SpecAugment for audio. Regularises and improves robustness.

### Q29. Hardware: CPU vs GPU vs TPU
GPUs have thousands of cores for parallel matrix multiplies, so they are ideal for training. TPUs are Google's matrix accelerators. CPUs suit small models and light inference.

### Q30. A minimal PyTorch training loop
```python
model.train()
for x, y in loader:
    x, y = x.to(device), y.to(device)
    optimizer.zero_grad()
    loss = criterion(model(x), y)
    loss.backward()
    optimizer.step()
```

---

# 🔵 Part 2: Junior (1–3 years)

### Q31. Softmax + cross-entropy and numerical stability *(Must-know)*
`softmax(z)_i = e^{z_i}/Σe^{z_j}`. Use `logits` with `CrossEntropyLoss` (PyTorch applies log-softmax internally using the log-sum-exp trick). Do not apply softmax before it. Binary: `BCEWithLogitsLoss`.

### Q32. Train / eval modes
`model.train()` enables dropout and batch-norm batch statistics; `model.eval()` uses running stats and disables dropout. Combine with `torch.no_grad()` / `torch.inference_mode()` for inference.

### Q33. Batch size effects
Large batch: faster per epoch on GPU, smoother gradients, may generalise worse and need a larger learning rate (linear scaling + warm-up). Small batch: noisier, regularising, but slower. Use gradient accumulation to emulate larger batches.

### Q34. Learning-rate schedules
Step decay, exponential, cosine annealing, one-cycle, ReduceLROnPlateau, and **warm-up** (start tiny, ramp up; crucial for Transformers and large batches).

### Q35. SGD with momentum vs Adam
Momentum accumulates a velocity to smooth noisy gradients. Adam keeps running averages of the gradient (`m`) and squared gradient (`v`) to scale steps per parameter. Adam converges fast with little tuning; SGD+momentum often generalises slightly better in vision with a good schedule.

### Q36. Weight decay vs L2 regularisation
With plain SGD they are equivalent. With Adam they are not; **AdamW** decouples weight decay from the adaptive update, which works better. Don't decay biases and norm parameters (common practice).

### Q37. Early stopping and checkpoints
Stop when validation metric stops improving for `patience` epochs; keep the best checkpoint (model + optimiser + scheduler state + epoch) so you can resume.

### Q38. Layer normalisation vs batch normalisation *(Must-know)*
BatchNorm normalises across the batch (depends on batch size; awkward for sequences/small batches). LayerNorm normalises across features per sample (independent of batch), so it is standard in Transformers/RNNs. Others: GroupNorm (small batches), RMSNorm (LLMs).

### Q39. Residual connections (ResNet)
`y = F(x) + x`. The skip path lets gradients flow directly, enabling very deep networks (50–1000 layers) and making optimisation easier because layers learn residuals.

### Q40. Famous CNN architectures
LeNet → AlexNet (ReLU, dropout, GPUs) → VGG (3×3 stacks) → GoogLeNet/Inception (multi-scale) → ResNet (skip) → DenseNet → MobileNet/EfficientNet (efficiency; depthwise separable convs) → ConvNeXt, Vision Transformer.

### Q41. Receptive field
The input region influencing one output unit. Grows with depth, kernel size, stride, dilation. Needed to ensure the network "sees" enough context for the task.

### Q42. 1×1 convolution
Mixes channels at each pixel; used to reduce/expand channels (bottlenecks), add non-linearity cheaply, and implement per-pixel linear layers.

### Q43. Depthwise separable convolution
Splits a conv into depthwise (per-channel spatial) + pointwise (1×1 channel mixing), cutting parameters and FLOPs by ~8–9× for 3×3 kernels (MobileNet).

### Q44. Transposed convolution (deconvolution)
Upsamples feature maps (segmentation, generators). Can cause checkerboard artefacts; alternatives are interpolation + conv or pixel shuffle.

### Q45. Object detection vs segmentation vs classification
Classification: one label per image. Detection: boxes + labels (YOLO, Faster R-CNN, DETR). Semantic segmentation: label per pixel (U-Net). Instance segmentation: separate object masks (Mask R-CNN). See `060_Computer-Vision.md`.

### Q46. Sequence tasks and RNN variants
Many-to-one (sentiment), one-to-many (captioning), many-to-many aligned (tagging) and seq2seq (translation). Bidirectional RNNs see past and future context.

### Q47. Seq2seq with attention
The decoder looks back at all encoder states instead of a single fixed vector, removing the bottleneck. This led directly to the Transformer.

### Q48. Word embeddings
Dense vectors where similar words are close (Word2Vec, GloVe, FastText). Contextual embeddings (BERT) give different vectors per usage. An `nn.Embedding` is a trainable lookup table.

### Q49. Padding and masking
Batch sequences by padding to the same length and pass a mask so padding doesn't affect attention or loss. Use `pack_padded_sequence` for RNNs, `ignore_index` in loss.

### Q50. Tokenisation basics
Subword tokenisers (BPE, WordPiece, SentencePiece/Unigram) balance vocabulary size and out-of-vocabulary handling. The tokenizer must match the pre-trained model.

### Q51. Pre-training and fine-tuning approaches
Feature extraction (frozen backbone), full fine-tuning, partial fine-tuning (unfreeze top layers), and parameter-efficient fine-tuning (LoRA, adapters). Use lower LR for the backbone than the head (discriminative LRs).

### Q52. Label smoothing, Mixup, CutMix
Label smoothing softens targets (e.g., 0.9/0.1), improving calibration and reducing over-confidence. Mixup blends images and labels; CutMix pastes patches. All regularise.

### Q53. Evaluation metrics in DL
Classification: accuracy, F1, AUC. Detection: mAP@IoU. Segmentation: IoU/Dice. NLP: BLEU, ROUGE, perplexity, exact match. Generation: human eval, LLM-as-judge, FID for images.

### Q54. Handling class imbalance in DL
Weighted loss, focal loss, balanced sampling, augmentation of rare classes, threshold tuning, and per-class metrics.

### Q55. Gradient clipping
Cap gradient norm (`clip_grad_norm_(params, 1.0)`) to prevent exploding gradients, common in RNNs and Transformers.

### Q56. Reproducibility in DL
Seed Python/NumPy/torch/CUDA, set `torch.backends.cudnn.deterministic=True` (slower), fix data-loader worker seeds. Some CUDA ops are non-deterministic; report variance over seeds.

### Q57. Monitoring training
Log train/val loss and metrics per epoch, learning rate, gradient norm, weight norms, GPU utilisation, sample predictions; use TensorBoard or Weights & Biases.

### Q58. DataLoader performance
`num_workers>0`, `pin_memory=True`, prefetching, caching decoded data, efficient formats (WebDataset/Parquet/LMDB). A starved GPU (low utilisation) usually means an I/O or preprocessing bottleneck.

### Q59. Saving and loading models
Save `state_dict` (weights) rather than the whole pickled model; keep architecture code versioned.
```python
torch.save(model.state_dict(), "model.pt")
model.load_state_dict(torch.load("model.pt", map_location="cpu", weights_only=True))
```

### Q60. Keras vs PyTorch
PyTorch: dynamic graphs, Pythonic, dominant in research and increasingly in production. Keras 3: high-level API over multiple backends (JAX, TensorFlow, PyTorch). TensorFlow: strong deployment tooling (TF Serving, TFLite). Pick by team, ecosystem and deployment target.

---

# 🟡 Part 3: Mid (3–5 years)

### Q61. Multi-head self-attention in detail *(Must-know)*
Project inputs into Q, K, V using learned matrices; split into `h` heads; compute `softmax(QKᵀ/√d_k)V` per head; concatenate and project. Scaling by `√d_k` keeps dot products from saturating softmax. Heads let the model attend to different relations. Complexity is O(n²·d) in sequence length `n`.

### Q62. Positional information
Attention is permutation-invariant, so positions must be injected: sinusoidal, learned absolute, relative bias (T5), **RoPE** (rotary, widely used in LLMs), ALiBi. Position scheme affects length extrapolation.

### Q63. Encoder-only, decoder-only, encoder-decoder
- Encoder-only (BERT): bidirectional, understanding tasks.
- Decoder-only (GPT, Llama): causal mask, autoregressive generation.
- Encoder-decoder (T5, BART): seq2seq (translation, summarisation).

### Q64. Causal mask
An upper-triangular mask that prevents a token from attending to future tokens, so training matches left-to-right generation.

### Q65. Transformer block layout
`x → LayerNorm → Attention → +residual → LayerNorm → FFN (expand ×4, GELU/SwiGLU, project) → +residual`. Pre-norm is more stable for deep models than post-norm.

### Q66. Why Transformers beat RNNs
Parallelism across sequence positions during training, direct long-range paths (O(1) path length), better scaling with data/compute. Cost: quadratic attention memory/compute.

### Q67. KV cache
During autoregressive decoding, cache each layer's keys and values for past tokens so each new token only computes its own Q, K, V. Cuts per-token cost from O(n²) to O(n) but consumes memory, which grows with context length, layers and batch.

### Q68. FlashAttention and efficient attention
FlashAttention computes exact attention in tiles in on-chip SRAM, avoiding materialising the n×n matrix: lower memory, much faster. Other approaches: sparse/sliding-window attention, linear attention, multi-query/grouped-query attention (smaller KV cache).

### Q69. Vision Transformer (ViT)
Split an image into patches (e.g., 16×16), linearly embed them, add position embeddings and a class token, then run a Transformer encoder. Needs lots of data or strong pre-training; CNN inductive biases help on small data.

### Q70. BERT vs GPT objectives
BERT: masked language modelling (+ next-sentence prediction in the original). GPT: next-token prediction. T5: span corruption / text-to-text.

### Q71. Fine-tuning pitfalls
Catastrophic forgetting, too-high LR, tiny dataset overfit, tokenizer mismatch, leakage between train and test, and unfrozen batch-norm statistics with tiny batches. Use small LR (1e-5 – 5e-5 for Transformers), warm-up, early stopping.

### Q72. Parameter-efficient fine-tuning (PEFT)
**LoRA** freezes weights and learns low-rank updates `ΔW = BA` (rank r ≪ d); **QLoRA** adds 4-bit quantised base weights; adapters/prefix-tuning add small trainable modules. Tiny checkpoints, lower memory. See `../11_Generative_AI/070_Fine-Tuning-LoRA-QLoRA.md`.

### Q73. Mixed-precision training *(Must-know)*
Compute in FP16/BF16, keep master weights in FP32, use **loss scaling** with FP16 to avoid underflow. BF16 has FP32's range so it usually needs no scaling. Gives ~2× speed and half the activation memory.
```python
scaler = torch.amp.GradScaler()
with torch.autocast("cuda", dtype=torch.float16):
    loss = criterion(model(x), y)
scaler.scale(loss).backward(); scaler.step(opt); scaler.update()
```

### Q74. Gradient accumulation
Run several micro-batches, sum their gradients, then step once. Emulates a larger batch when memory is limited. Divide the loss by the number of accumulation steps.

### Q75. Gradient checkpointing (activation recomputation)
Don't store all activations; recompute them in the backward pass. Trades ~30% extra compute for large memory savings, enabling bigger models or batches.

### Q76. Distributed training strategies *(Must-know)*
- **Data parallel (DDP)**: replicate the model, split batches, all-reduce gradients.
- **Sharded (FSDP / ZeRO)**: shard parameters, gradients and optimiser state across GPUs.
- **Tensor parallel**: split matrices within layers.
- **Pipeline parallel**: split layers into stages.
Real systems combine them (3D parallelism). Communication (NVLink, InfiniBand) is the bottleneck.

### Q77. DDP vs DataParallel
`DistributedDataParallel` uses one process per GPU, overlaps gradient communication with backward, and scales across nodes; `nn.DataParallel` is single-process, slower and deprecated in practice.

### Q78. `torch.compile`
Captures the model graph and generates fused kernels (TorchInductor), often giving 1.3–2× speed-ups. Watch for graph breaks, dynamic shapes and compile time. Verify behaviour per version.

### Q79. Learning-rate finder and batch-size scaling
Run a short sweep from tiny to large LR and choose a value just before loss blows up. When scaling batch size by `k`, scale LR by roughly `k` (or `√k`) and add warm-up.

### Q80. Loss spikes and instability in large-model training
Causes: bad batches, too-high LR, FP16 overflow, Adam epsilon issues, data corruption. Mitigations: lower LR, warm-up, gradient clipping, BF16, skipping bad batches, restarting from an earlier checkpoint, z-loss/QK-norm.

### Q81. Autoencoder variants
Denoising, sparse, contractive, **VAE** (latent is a distribution; loss = reconstruction + KL divergence to a prior; sampling via the reparameterisation trick `z = μ + σ·ε`).

### Q82. GAN training problems and fixes
Mode collapse, vanishing gradients, oscillation. Fixes: WGAN/WGAN-GP, spectral norm, two-timescale updates, label smoothing, progressive growing, StyleGAN tricks. Evaluate with FID / IS / precision-recall.

### Q83. Diffusion models *(Must-know)*
Forward process gradually adds Gaussian noise to data; a network (U-Net or Transformer/DiT) learns to **predict the noise** (or the clean sample / velocity); sampling reverses the process step by step. Strengths: quality, diversity, stable training. Costs: many steps (mitigated by DDIM, distillation, latent diffusion, consistency models).

### Q84. Latent diffusion (Stable Diffusion)
Run diffusion in a compressed latent space from a VAE rather than pixel space (much cheaper), conditioned on text embeddings (CLIP/T5) via cross-attention. Classifier-free guidance trades diversity for prompt adherence.

### Q85. Contrastive learning (SimCLR, CLIP)
Pull embeddings of positive pairs (two views of an image, image-caption) together and push negatives apart with InfoNCE loss. Produces strong general representations without labels or with weak text supervision.

### Q86. Self-supervised learning
Create supervision from data itself: masked token/patch prediction (BERT, MAE), next-token prediction (GPT), contrastive objectives (SimCLR, DINO). Enables pre-training on unlabeled data at scale.

### Q87. Knowledge distillation
Train a small student to mimic a large teacher's soft probabilities (temperature-scaled) and/or hidden states. Gives most of the accuracy with far lower latency.

### Q88. Quantisation
Reduce weights/activations from FP32 to FP16/INT8/INT4. Post-training quantisation (PTQ) is quick; quantisation-aware training (QAT) is more accurate. LLM methods: GPTQ, AWQ, bitsandbytes NF4. Always re-evaluate accuracy.

### Q89. Pruning and sparsity
Remove unimportant weights (unstructured) or whole channels/heads (structured). Structured pruning gives real speed-ups on standard hardware; unstructured needs sparse kernels.

### Q90. Export and deployment formats
TorchScript, **ONNX**, TensorRT, OpenVINO, TFLite, Core ML. Use dynamic axes, validate numerics against the original, and benchmark on target hardware.

---

# 🟠 Part 4: Senior (5–7 years)

### Q91. Scaling laws
Loss falls predictably as a power law with model size, data and compute. Chinchilla showed many models were under-trained: for a compute budget, scale parameters and tokens together (~20 tokens per parameter as a rough guide). Modern practice also over-trains smaller models for cheaper inference.

### Q92. Mixture of Experts (MoE)
Replace the FFN with many expert FFNs and a router that activates top-k per token. Total parameters grow while compute per token stays similar. Challenges: load balancing, communication, training instability, memory for all experts.

### Q93. Alignment-era training pipeline (LLMs)
Pre-training → supervised fine-tuning (instructions) → preference optimisation (RLHF with PPO, or DPO/IPO/KTO) → safety tuning and evaluation. See `../11_Generative_AI/066_LLM-and-RAG.md` and `072_LLM-Evaluation-and-Guardrails.md`.

### Q94. Designing a training pipeline for a new vision product
Define metric and data (labelling guidelines, QA), baseline with a pre-trained backbone, augmentation strategy, class imbalance handling, error analysis loops, active learning, edge-vs-cloud constraints, quantisation, test sets per scenario/slice, drift monitoring.

### Q95. Debugging a network that doesn't learn *(Must-know)*
1. Overfit a **tiny batch** (should reach ~0 loss); if not, there's a bug.
2. Check data/labels alignment and preprocessing; visualise samples.
3. Verify loss and output shapes, `eval/train` modes, `zero_grad` placement.
4. Inspect gradient norms, activations, dead ReLUs, NaNs.
5. Lower LR, simplify model, remove regularisation, then add complexity back.
6. Compare with a trusted reference implementation.

### Q96. Initialisation and normalisation at depth
Scale residual branches (e.g., init last layer to ~0, "ReZero", layer-scale), pre-norm, and careful LR warm-up make 100+ layer networks trainable. μP / parameter-scaling rules help transfer hyper-parameters across widths.

### Q97. Optimiser state and memory
Adam stores 2 extra FP32 values per parameter (plus master weights). For a 7B model: weights (BF16) ≈ 14 GB, grads ≈ 14 GB, Adam states ≈ 56 GB, plus activations. This motivates ZeRO/FSDP, 8-bit optimisers, LoRA and offloading.

### Q98. Estimating GPU memory and FLOPs
Params × bytes per param + gradients + optimiser states + activations (∝ batch × sequence × layers). Training FLOPs ≈ **6 × parameters × tokens**. Use this for rough budgeting and utilisation (MFU) targets.

### Q99. Inference optimisation for LLMs
KV cache, continuous batching, paged attention (vLLM), speculative decoding, quantisation, tensor parallelism, prefix caching, FlashAttention, shorter prompts, and routing smaller models for easy queries. See `../11_Generative_AI/073_Model-Serving-and-Inference.md`.

### Q100. Throughput vs latency trade-offs
Large batches maximise GPU throughput but increase per-request latency. Use dynamic/continuous batching with latency SLOs, separate prefill and decode, autoscale, and measure p50/p95/p99.

### Q101. Evaluating generative models
Automated metrics (FID, CLIP score, perplexity) are weak proxies. Combine held-out benchmarks, human preference tests, LLM-as-judge with calibration, red-teaming, and task-specific success metrics. Beware benchmark contamination.

### Q102. Handling noisy labels at scale
Robust losses, label smoothing, co-teaching, confident learning, re-labelling the most suspicious samples, and consensus annotation. Data quality work often yields the biggest gains.

### Q103. Domain shift and robustness
Train/test distribution mismatch (lighting, device, region). Mitigate with diverse data, augmentation, domain adaptation, test-time adaptation, ensemble/uncertainty estimation, and out-of-distribution detection.

### Q104. Uncertainty in deep nets
Softmax confidence is poorly calibrated. Use temperature scaling, deep ensembles, MC dropout, Bayesian last layers, conformal prediction, and OOD detectors.

### Q105. Adversarial examples
Tiny perturbations (FGSM, PGD) fool models. Defences: adversarial training, input preprocessing, certified methods, monitoring. For LLMs, analogues are prompt injection and jailbreaks.

### Q106. Interpretability for deep nets
Saliency maps, Grad-CAM, integrated gradients, attention visualisation (with caution), probing classifiers, SHAP for tabular nets, mechanistic interpretability. Treat explanations as hypotheses and sanity-check them.

### Q107. Reproducibility and experiment management
Config files (Hydra), versioned datasets (DVC/lakeFS), seeds, containers, tracked metrics (W&B/MLflow), deterministic data order where possible, unit tests for model components, and CI smoke-training runs.

### Q108. Cost-aware training
Spot instances with checkpoint-resume, mixed precision, smaller proxies for hyper-parameter search, early pruning of bad runs (Hyperband/ASHA), data deduplication/curation, curriculum learning, and tracking cost per experiment.

### Q109. Data pipeline at scale
Sharded tar/Parquet datasets, streaming loaders, deterministic shuffling across epochs and workers, on-the-fly augmentation on GPU (DALI, Kornia), dedup and filtering, data versioning, and monitoring for corrupt samples.

### Q110. Multi-task and multi-modal learning
Shared backbones with task heads, loss balancing (uncertainty weighting, GradNorm), gradient conflict (PCGrad). Multi-modal models align encoders (CLIP-style) or fuse via cross-attention / projector layers into an LLM. See `../11_Generative_AI/071_Multimodal-AI.md`.

### Q111. Continual learning
Avoiding catastrophic forgetting with replay buffers, regularisation (EWC), parameter isolation, and adapters. In practice, periodic retraining plus evaluation on old tasks is the most common solution.

### Q112. Graph neural networks (GNN)
Message passing aggregates neighbour information (GCN, GraphSAGE, GAT). Used for recommendations, fraud, molecules, knowledge graphs. Issues: over-smoothing, scalability (sampling), heterogeneous graphs.

### Q113. Time-series deep learning
LSTM/GRU, temporal CNNs, Transformers (Informer, PatchTST), N-BEATS, DeepAR. Strong baselines (seasonal naive, gradient boosting) often win on small data; always compare.

### Q114. Tabular deep learning
MLPs with embeddings, TabNet, FT-Transformer, and tabular foundation models can compete but usually don't beat well-tuned gradient boosting on small/medium data. Useful for multimodal inputs or huge datasets.

### Q115. Test-time compute and reasoning models
Spending more inference compute (chain-of-thought, sampling + voting, search, verifiers) can raise accuracy on hard tasks. Trade-off: latency and cost; evaluate benefit per query type.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q116. Choosing between building, fine-tuning or using an API
- **API**: fastest, no infra, pay per token, data-governance risk.
- **Fine-tune open model**: control, privacy, domain adaptation, needs MLOps.
- **Train from scratch**: only with unique data, scale and budget.
Decide by data sensitivity, volume, latency/cost at scale, quality gap, team skills, and exit strategy.

### Q117. Deep-learning platform design
Data lake + versioning → labelling & quality tools → feature/embedding stores → orchestrated training (Kubeflow/Ray/SLURM) → experiment tracking → model registry → evaluation harness → serving (Triton/vLLM/KServe) → monitoring and feedback → governance. Offer golden-path templates for teams.

### Q118. GPU cluster management
Scheduling (Kubernetes + queues, SLURM), quotas and fair share, preemption, checkpointing, multi-tenancy, observability (utilisation, MFU, memory, XID errors), failure handling (node health checks, auto-restart), and cost allocation.

### Q119. Evaluation strategy for production DL
Layered: unit tests for components, offline benchmarks with slices, shadow traffic, human review, A/B tests, guardrail metrics, regression suites with golden examples, and continuous evaluation as data shifts.

### Q120. Risk, safety and governance
Model cards and datasheets, bias and robustness testing, privacy (PII scrubbing, differential privacy, membership-inference risk), copyright/licence checks on data and weights, red-teaming, human oversight and incident response. Align with regulations (verify current rules such as the EU AI Act, India's DPDP Act).

### Q121. Staffing and process
Research vs applied vs platform roles; "research → prototype → productionise" handoffs with shared codebases; design reviews; reproducibility standards; and measuring success by product impact rather than paper metrics.

### Q122. When deep learning is the wrong choice
Small tabular data, strong need for explainability, hard latency/energy limits, or when rules/classical ML already meet the target. Total cost of ownership (data, labelling, infra, monitoring) can outweigh gains.

### Q123. Hardware and cost decisions
Choose GPU type by memory (large models), bandwidth, interconnect, and price per useful FLOP; consider cloud vs on-prem vs reserved capacity; use inference-specific accelerators or CPUs/NPUs where adequate; benchmark real workloads, not spec sheets.

### Q124. Long-term model lifecycle
Versioned training recipes and data, scheduled evaluation, drift detection, retraining triggers, deprecation of old models, rollback plans, and documentation so that systems survive team turnover.

### Q125. Communicating risk and uncertainty to leadership
Present expected benefit with ranges, baselines, failure modes and mitigations, staged milestones with kill criteria, and cost curves (training, inference, labelling) rather than a single optimistic number.

---

# 💻 Part 6: Hands-On Tasks & Code

### Task 1. MLP classifier in PyTorch
```python
import torch, torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset

device = "cuda" if torch.cuda.is_available() else "cpu"
model = nn.Sequential(nn.Linear(20, 64), nn.ReLU(), nn.Dropout(0.2),
                      nn.Linear(64, 32), nn.ReLU(), nn.Linear(32, 3)).to(device)
opt = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-2)
crit = nn.CrossEntropyLoss()
loader = DataLoader(TensorDataset(X_train, y_train), batch_size=64, shuffle=True)

for epoch in range(20):
    model.train()
    for xb, yb in loader:
        xb, yb = xb.to(device), yb.to(device)
        opt.zero_grad()
        loss = crit(model(xb), yb)
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        opt.step()
    model.eval()
    with torch.no_grad():
        val_acc = (model(X_val.to(device)).argmax(1).cpu() == y_val).float().mean()
    print(epoch, loss.item(), val_acc.item())
```

### Task 2. Small CNN for 28×28 images
```python
class Net(nn.Module):
    def __init__(self):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(1, 32, 3, padding=1), nn.BatchNorm2d(32), nn.ReLU(), nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 3, padding=1), nn.BatchNorm2d(64), nn.ReLU(), nn.MaxPool2d(2),
        )
        self.head = nn.Sequential(nn.Flatten(), nn.Linear(64 * 7 * 7, 128), nn.ReLU(),
                                  nn.Dropout(0.3), nn.Linear(128, 10))
    def forward(self, x): return self.head(self.features(x))
```

### Task 3. Transfer learning with ResNet
```python
from torchvision import models
m = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
for p in m.parameters(): p.requires_grad = False
m.fc = nn.Linear(m.fc.in_features, num_classes)         # new head is trainable
opt = torch.optim.AdamW(m.fc.parameters(), lr=1e-3)
# later: unfreeze layer4 with a smaller LR via parameter groups
```

### Task 4. Scaled dot-product attention from scratch
```python
import math
def attention(q, k, v, mask=None):
    scores = q @ k.transpose(-2, -1) / math.sqrt(q.size(-1))
    if mask is not None:
        scores = scores.masked_fill(mask == 0, float("-inf"))
    return torch.softmax(scores, dim=-1) @ v
```

### Task 5. Causal self-attention module
```python
class CausalSelfAttention(nn.Module):
    def __init__(self, d, h):
        super().__init__()
        self.h, self.qkv, self.proj = h, nn.Linear(d, 3 * d), nn.Linear(d, d)
    def forward(self, x):
        B, T, C = x.shape
        q, k, v = self.qkv(x).chunk(3, dim=-1)
        q, k, v = [t.view(B, T, self.h, C // self.h).transpose(1, 2) for t in (q, k, v)]
        y = torch.nn.functional.scaled_dot_product_attention(q, k, v, is_causal=True)
        return self.proj(y.transpose(1, 2).reshape(B, T, C))
```

### Task 6. Learning-rate schedule with warm-up
```python
from torch.optim.lr_scheduler import LambdaLR
import math
def lr_lambda(step, warmup=500, total=10_000):
    if step < warmup: return step / warmup
    p = (step - warmup) / (total - warmup)
    return 0.5 * (1 + math.cos(math.pi * p))
sched = LambdaLR(opt, lr_lambda)     # call sched.step() after opt.step()
```

### Task 7. Mixed precision + gradient accumulation
```python
accum = 4
for i, (x, y) in enumerate(loader):
    with torch.autocast("cuda", dtype=torch.bfloat16):
        loss = crit(model(x.cuda()), y.cuda()) / accum
    loss.backward()
    if (i + 1) % accum == 0:
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        opt.step(); opt.zero_grad(set_to_none=True)
```

### Task 8. Overfit-one-batch sanity test
```python
xb, yb = next(iter(loader))
for step in range(300):
    opt.zero_grad(); loss = crit(model(xb), yb); loss.backward(); opt.step()
    if step % 50 == 0: print(step, loss.item())     # should approach ~0
```

### Task 9. Simple autoencoder for anomaly detection
```python
ae = nn.Sequential(nn.Linear(30, 16), nn.ReLU(), nn.Linear(16, 4), nn.ReLU(),
                   nn.Linear(4, 16), nn.ReLU(), nn.Linear(16, 30))
# train on normal data only; flag samples with high reconstruction error
err = ((ae(x) - x) ** 2).mean(1)
anomalies = err > err.quantile(0.99)
```

### Task 10. Export to ONNX and verify
```python
model.eval()
dummy = torch.randn(1, 3, 224, 224)
torch.onnx.export(model, dummy, "model.onnx", input_names=["x"], output_names=["logits"],
                  dynamic_axes={"x": {0: "batch"}, "logits": {0: "batch"}}, opset_version=17)
import onnxruntime as ort, numpy as np
sess = ort.InferenceSession("model.onnx")
out = sess.run(None, {"x": dummy.numpy()})[0]
np.testing.assert_allclose(out, model(dummy).detach().numpy(), rtol=1e-3, atol=1e-4)
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. Loss is NaN
Check learning rate (too high), bad data (NaN/inf), division by zero, `log(0)`, FP16 overflow, exploding gradients. Use `torch.autograd.set_detect_anomaly(True)`, gradient clipping, lower LR, BF16, and validate inputs.

### D2. Loss doesn't decrease
Overfit one batch; verify labels, shuffling, LR, `zero_grad`, optimiser params include all layers, correct loss (logits vs probabilities), and that weights actually change.

### D3. Training accuracy high, validation poor
Overfitting or leakage mismatch. Add augmentation, dropout, weight decay, early stopping, more data; check that validation preprocessing matches training.

### D4. Validation better than training
Dropout/augmentation active during training only, validation set easier, or training metrics averaged over the epoch while the model improves. Usually not a bug.

### D5. Good validation, poor production accuracy
Preprocessing mismatch (resize, normalisation, colour order RGB/BGR), `model.eval()` forgotten, domain shift, different tokenizer or data distribution.

### D6. Predictions identical for all inputs
Dead ReLUs, collapsed training, extreme LR, label imbalance, or normalisation bug. Inspect activations, lower LR, use Leaky ReLU/GELU, rebalance.

### D7. CUDA out of memory
Lower batch size, mixed precision, gradient checkpointing, accumulation, smaller sequence length, free cached tensors (don't accumulate `loss` without `.item()`), use `no_grad` for eval, FSDP/ZeRO.

### D8. GPU utilisation is low
Data-loading bottleneck, small batches, CPU preprocessing, frequent host-device syncs (`.item()` in loops), small kernels. Use more workers, prefetch, larger batch, `torch.compile`.

### D9. Multi-GPU run slower than single GPU
Communication overhead, small per-GPU batch, slow interconnect, imbalanced data, syncing every step. Increase batch, overlap communication, use DDP/NCCL, check topology.

### D10. BatchNorm behaves oddly at inference
Forgot `eval()`, tiny batches giving poor running stats, or mismatched momentum. Use GroupNorm/LayerNorm or freeze BN during fine-tuning.

### D11. Fine-tuned model forgets prior abilities
LR too high or too long. Use lower LR, LoRA/adapters, mix in original-task data (replay), early stopping.

### D12. Transformer generates repetitive text
Greedy decoding or low temperature. Use sampling (top-p/top-k), repetition penalty, appropriate temperature, check training data for duplicates.

### D13. Results differ between runs
Unseeded randomness, non-deterministic CUDA kernels, data order. Fix seeds, record versions, average over multiple seeds.

### D14. ONNX output differs from PyTorch
Different preprocessing, unsupported op fallback, dynamic shape issues, FP16 precision. Compare layer by layer, tolerate small numerical differences, test on real samples.

### D15. Model works on GPU but fails on CPU/edge
Unsupported ops, quantisation errors, memory limits, different pre/post-processing. Test early on target hardware and use calibration data for INT8.

---

# 🧩 Part 8: Tricky Questions

### T1. Why not use sigmoid in hidden layers?
It saturates (gradients ≈ 0) and isn't zero-centred, causing vanishing gradients and slow learning. ReLU-family or GELU are better.

### T2. Is dropout applied at inference?
No. `model.eval()` disables it; inverted dropout already rescaled activations during training.

### T3. Does batch norm remove the need for regularisation?
No. It gives mild regularisation, but you may still need weight decay, augmentation and dropout.

### T4. Why divide by √d_k in attention?
Dot products grow with dimension, pushing softmax into saturated regions with tiny gradients. Scaling keeps variance ~1.

### T5. Can a deeper network always do better?
No. Depth increases capacity but also optimisation difficulty and overfitting. Residuals and normalisation help; more data matters.

### T6. Does a larger batch always speed up training?
Per epoch yes on GPUs up to a point, but convergence per epoch may worsen without LR scaling; wall-clock to accuracy is the real measure.

### T7. Is Adam always better than SGD?
No. Adam is easier to tune and faster early, but SGD with momentum and good schedules can generalise better on some vision tasks.

### T8. Why is `softmax` before `CrossEntropyLoss` a bug in PyTorch?
`CrossEntropyLoss` expects raw logits and applies log-softmax internally; double softmax squashes gradients and hurts learning.

### T9. Are attention weights an explanation?
Not reliably. They show where information flowed in one layer/head, not necessarily causal importance.

### T10. Does bigger model mean better?
Only with enough data/compute and proper training (scaling laws). Otherwise it overfits and costs more to serve.

### T11. Why can't RNNs be fully parallelised?
Each step depends on the previous hidden state, so computation across time is sequential.

### T12. Why use BF16 over FP16?
BF16 keeps FP32's exponent range, so no loss scaling is needed and overflow is rarer, with reduced mantissa precision.

### T13. Is a 99% accurate model on ImageNet-like test data safe to deploy?
Not necessarily. Test distributions, slices, robustness, calibration and failure costs matter more than aggregate accuracy.

### T14. Why does the Transformer FFN dominate parameters?
It expands to ~4× the model dimension, so it holds roughly two-thirds of each block's parameters.

### T15. Do CNNs have translation invariance or equivariance?
Convolution is translation-**equivariant** (shifting input shifts the feature map); pooling and global aggregation add approximate invariance.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- Neuron: `f(w·x + b)`.
- ReLU = `max(0, x)`; GELU in Transformers.
- Backprop = chain rule.
- He init for ReLU, Xavier for tanh.
- Adam = momentum + adaptive LR; AdamW decouples weight decay.
- BatchNorm: batch statistics; LayerNorm: per-sample, used in Transformers.
- Dropout off in eval.
- ResNet: `y = F(x) + x`.
- LSTM gates: input, forget, output.
- Attention: `softmax(QKᵀ/√d)V`.
- Causal mask for decoder-only models.
- KV cache speeds up generation.
- LoRA: low-rank updates to frozen weights.
- BF16 > FP16 for stability.
- Gradient accumulation = larger effective batch.
- Gradient checkpointing = memory for compute.
- DDP replicates; FSDP shards.
- Training FLOPs ≈ 6·N·D.
- Overfit one batch to debug.
- Use logits with `CrossEntropyLoss`.
- Save `state_dict`, not the pickled model.
- FID evaluates image generators.
- Warm-up stabilises large-LR training.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about a deep-learning project you shipped
Cover problem and metric, data collection/labelling, baseline (pre-trained model), experiments (augmentation, architecture, loss), validation design, optimisation for latency, deployment, monitoring, and business impact with numbers. Example: "Defect detection on a production line: ResNet-50 fine-tune with augmentations, recall 0.82 → 0.94 after hard-negative mining; INT8 TensorRT gave 18 ms/image on an edge GPU."

### P2. A training run that failed and how you fixed it
Describe the symptom (NaN loss, divergence, OOM), diagnostic steps (tiny-batch overfit, gradient norms, data check), root cause (LR/warm-up, bad samples, FP16), the fix, and prevention (alerts, sanity-check tests).

### P3. How did you choose an architecture?
Start from a strong pre-trained baseline, compare 2–3 candidates on the same split, factor latency/size/licensing, run ablations, and pick the simplest that meets requirements.

### P4. How did you reduce training or inference cost?
Mixed precision, smaller proxy experiments, early stopping of poor runs, distillation, quantisation, batching, caching, and spot instances; show cost and quality before/after.

### P5. How do you handle limited labelled data?
Transfer learning, augmentation, self-supervised pre-training, active learning, weak supervision, synthetic data, and careful cross-validation.

### P6. How do you work with research and engineering teams?
Shared repos and configs, reproducible baselines, code review, experiment tracking, clear handoff criteria (latency, accuracy, tests), and joint ownership of production metrics.

### P7. How do you communicate model limits?
Show failure examples, slice metrics, confidence behaviour, and recommended human-in-the-loop steps; avoid overselling.

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- Foundations: neurons, MLPs, activations, losses, backprop, optimisers, initialisation.
- Regularisation: dropout, weight decay, augmentation, early stopping, normalisation.
- Architectures: CNNs, RNN/LSTM/GRU, attention, Transformers, autoencoders/VAEs, GANs, diffusion, GNNs.
- Training at scale: mixed precision, accumulation, checkpointing, DDP/FSDP/ZeRO, `torch.compile`.
- Transfer learning, PEFT, distillation, quantisation, pruning.
- Self-supervised and contrastive learning, multimodal models, MoE.
- Deployment: ONNX, TensorRT, serving, batching, KV cache.
- Reliability: debugging, robustness, calibration, uncertainty, interpretability, safety.

## Mixed topics
- Transformers + KV cache + quantisation for LLM serving.
- Transfer learning + augmentation + class imbalance.
- Mixed precision + gradient accumulation + clipping.
- Distillation + quantisation + edge deployment.
- Diffusion + guidance + latent spaces.
- Evaluation + drift + governance.

---

# 🔬 Part 12: Internals

### Autograd (reverse-mode differentiation)
Operations on tensors with `requires_grad=True` build a dynamic computation graph. `loss.backward()` walks the graph in reverse, applying each node's vector-Jacobian product and accumulating gradients in `.grad`. Graph buffers are freed after backward unless `retain_graph=True`.

### Why gradients accumulate in PyTorch
`.grad` is added to, not overwritten, which enables gradient accumulation but requires `zero_grad()` each step.

### Backprop through a linear layer
For `y = Wx + b` with upstream gradient `g = ∂L/∂y`: `∂L/∂W = g xᵀ`, `∂L/∂b = g`, `∂L/∂x = Wᵀ g`.

### Adam update
`m = β1·m + (1−β1)g`, `v = β2·v + (1−β2)g²`, bias-corrected `m̂, v̂`, then `w ← w − η·m̂/(√v̂ + ε)`. AdamW adds `−η·λ·w` separately.

### Batch-norm math
`x̂ = (x − μ_B)/√(σ²_B + ε)`, `y = γx̂ + β`. Running mean/variance (EMA) are used at inference. In fine-tuning with small batches, freezing BN stats is common.

### Attention complexity
Time and memory O(n²·d) for sequence length `n`; FlashAttention keeps time O(n²·d) but reduces memory traffic and peak memory to O(n).

### Transformer parameter count (approx.)
Per layer ≈ `12·d²` (4d² attention + 8d² FFN) → total ≈ `12·L·d²` plus embeddings.

### CUDA execution basics
Kernels are launched asynchronously on streams; `.item()` / `.cpu()` force synchronisation. Memory is cached by the allocator (use `torch.cuda.memory_summary`). Tensor Cores accelerate FP16/BF16/TF32 matmuls when shapes align (multiples of 8/16).

### DDP gradient synchronisation
Parameters are grouped into buckets; as gradients become ready during backward, all-reduce runs asynchronously, overlapping with computation. Every rank must run the same ops, or the job hangs.

### Quantisation scheme
`q = round(x/scale) + zero_point`, clamped to int range; scales per tensor or per channel; calibration data sets the ranges for activations.

---

# 📊 Part 13: Reference Tables

### Architecture selection
| Data / task | Typical choice |
|---|---|
| Images (classification) | ResNet/EfficientNet/ConvNeXt, ViT with pre-training |
| Detection / segmentation | YOLO, Faster/Mask R-CNN, DETR, U-Net, SAM |
| Text understanding | BERT-family encoders |
| Text generation | Decoder-only LLMs |
| Translation / summarisation | Encoder-decoder (T5, BART) or LLM |
| Time series | GBM baseline, TCN, LSTM, PatchTST |
| Tabular | GBM first; MLP/FT-Transformer for special cases |
| Graphs | GCN/GAT/GraphSAGE |
| Image generation | Latent diffusion, DiT |
| Anomaly detection | Autoencoder, isolation-based, contrastive |

### Loss vs task
| Task | Output layer | Loss |
|---|---|---|
| Binary classification | 1 logit | `BCEWithLogitsLoss` |
| Multi-class | K logits | `CrossEntropyLoss` |
| Multi-label | K logits | `BCEWithLogitsLoss` |
| Regression | 1 linear | MSE / Huber / MAE |
| Embedding learning | Vector | Contrastive / triplet / InfoNCE |
| Sequence alignment | Per-frame logits | CTC |

### Precision formats
| Format | Bits | Range | Use |
|---|---|---|---|
| FP32 | 32 | Wide | Default/master weights |
| TF32 | 19 (internal) | FP32 range | Ampere+ matmuls |
| FP16 | 16 | Narrow (needs scaling) | Mixed precision |
| BF16 | 16 | FP32 range | Preferred training format |
| FP8 | 8 | Narrow | Newer GPUs, specialised |
| INT8/INT4 | 8/4 | Integer | Inference quantisation |

### Parallelism
| Type | Splits | Pros | Cons |
|---|---|---|---|
| Data (DDP) | Batch | Simple | Model must fit one GPU |
| FSDP/ZeRO | Params/grads/optimiser | Big models | More communication |
| Tensor | Within layers | Large layers | Needs fast interconnect |
| Pipeline | Layers | Deep models | Pipeline bubbles |
| Expert | MoE experts | Capacity | Routing/load balance |

### Normalisation
| Type | Normalises over | Used in |
|---|---|---|
| BatchNorm | Batch (+spatial) | CNNs |
| LayerNorm | Features | Transformers, RNNs |
| GroupNorm | Channel groups | Small-batch vision |
| RMSNorm | Features (no mean) | Modern LLMs |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
Input 32×32, conv 3×3, stride 1, padding 1. Output size?
`(32 + 2 − 3)/1 + 1` = **32×32**.

### O2.
Input 28×28, conv 5×5, stride 1, no padding, then 2×2 max-pool (stride 2).
Conv: 24; pool: **12×12**.

### O3.
Parameters of `nn.Linear(100, 50)`?
`100·50 + 50` = **5050**.

### O4.
Parameters of `nn.Conv2d(3, 16, kernel_size=3)`?
`3·3·3·16 + 16` = **448**.

### O5.
```python
import torch
x = torch.tensor([-1., 0., 2.])
print(torch.relu(x))
```
**`tensor([0., 0., 2.])`**

### O6.
```python
w = torch.tensor(2.0, requires_grad=True)
y = w ** 2
y.backward()
print(w.grad)
```
**`tensor(4.)`**

### O7.
Calling `loss.backward()` twice without `zero_grad()`: gradients are **summed** (and the second call errors unless `retain_graph=True`).

### O8.
```python
torch.softmax(torch.tensor([0., 0.]), dim=0)
```
**`tensor([0.5000, 0.5000])`**

### O9.
Dropout `p=0.5` in `eval()` mode on input `[1,1,1,1]`: output **`[1,1,1,1]`** (unchanged).

### O10.
A batch of 10,000 samples, batch size 250: iterations per epoch = **40**.

### O11.
Self-attention with `n=1024` tokens: attention matrix size per head = **1024×1024 ≈ 1M entries**; doubling `n` quadruples it.

### O12.
7B parameters in BF16 occupy about **14 GB** (2 bytes each) for weights only.

---

# ✅ Part 15: MCQs

**1. Which activation is standard in Transformer FFNs?**
A) Sigmoid  B) GELU/SwiGLU  C) Step  D) Softmax
**Answer: B**

**2. Which technique lets very deep networks train by providing a gradient shortcut?**
A) Dropout  B) Residual connections  C) Pooling  D) Softmax
**Answer: B**

**3. LayerNorm is preferred in Transformers because it:**
A) Depends on batch size  B) Normalises per sample across features  C) Needs GPUs  D) Removes attention
**Answer: B**

**4. Which loss should be used with raw logits for multi-class classification in PyTorch?**
A) `MSELoss`  B) `NLLLoss` after softmax  C) `CrossEntropyLoss`  D) `L1Loss`
**Answer: C**

**5. KV cache primarily speeds up:**
A) Training  B) Autoregressive decoding  C) Data loading  D) Tokenisation
**Answer: B**

**6. LoRA trains:**
A) All weights  B) Low-rank adapter matrices on frozen weights  C) Only the tokenizer  D) Only the optimiser
**Answer: B**

**7. Gradient clipping helps with:**
A) Vanishing gradients only  B) Exploding gradients  C) Underfitting  D) Class imbalance
**Answer: B**

**8. Best first step when a new model won't learn:**
A) Use a bigger GPU  B) Overfit a single small batch  C) Add dropout  D) Train longer
**Answer: B**

**9. Which parallelism shards optimiser states across GPUs?**
A) DataParallel  B) ZeRO/FSDP  C) Pooling  D) Pipeline only
**Answer: B**

**10. Which format is usually preferred for stable large-model training?**
A) FP16 without scaling  B) BF16  C) INT4  D) FP64
**Answer: B**

**11. Diffusion models are trained to:**
A) Classify images  B) Predict added noise (or clean data/velocity)  C) Cluster data  D) Compress tokens
**Answer: B**

**12. Which is NOT a way to reduce overfitting?**
A) Dropout  B) Data augmentation  C) Early stopping  D) Increasing model size with the same data and no regularisation
**Answer: D**

**13. Training FLOPs for a Transformer are roughly:**
A) 2·N  B) 6·N·D  C) N/D  D) D²
**Answer: B**

**14. Convolution layers are:**
A) Translation-equivariant  B) Rotation-invariant by default  C) Permutation-invariant  D) Non-linear by themselves
**Answer: A**

**15. Which optimiser decouples weight decay from the adaptive update?**
A) SGD  B) Adam  C) AdamW  D) RMSProp
**Answer: C**

**16. Which technique trades compute for memory?**
A) Gradient checkpointing  B) Larger batch  C) Pretraining  D) Mixup
**Answer: A**

---

# ⚠️ Part 16: Common Mistakes

- Applying softmax before `CrossEntropyLoss`.
- Forgetting `model.eval()` / `torch.no_grad()` at inference.
- Forgetting `optimizer.zero_grad()`.
- Different preprocessing (resize, normalisation, channel order) between training and serving.
- Data leakage: augmenting before the split, near-duplicates across splits.
- Too-high learning rate with no warm-up or clipping.
- Tuning on the test set.
- Accumulating the loss tensor (not `.item()`) and leaking graph memory.
- Evaluating only aggregate accuracy, with no slices or calibration.
- Fine-tuning everything at a large LR and destroying pre-trained features.
- Ignoring data-loader bottlenecks while blaming the GPU.
- Not saving optimiser/scheduler state, so runs can't resume.
- Using only a single seed to claim improvements.
- Quantising or exporting without re-validating accuracy.
- Choosing a huge model when a small one meets the SLA.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You debug systematically (tiny-batch overfit, gradient/activation stats, data visualisation) before changing architectures.
- You reason about memory and FLOPs (parameters, optimiser state, activations, 6·N·D) to plan training.
- You pick tools by constraints: DDP vs FSDP, BF16 vs FP16, LoRA vs full fine-tune.
- You treat data quality, evaluation design and slices as seriously as model design.
- You ensure train/serve parity, export validation, and monitoring from day one.
- You know the attention/KV-cache/serving costs and the levers to cut them.
- You compare against strong simple baselines (GBM, pre-trained models) honestly.
- You communicate uncertainty, failure modes and costs to stakeholders.
- You make runs reproducible, resumable and cost-aware.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Core formulas
```
neuron: y = f(Wx + b)           softmax_i = e^zi / Σ e^zj
CE = -Σ y log p                 BCE = -[y log p + (1-y) log(1-p)]
conv out = ⌊(N + 2P - K)/S⌋ + 1
attention = softmax(QKᵀ/√d_k) V
Adam: w -= lr * m̂ / (√v̂ + ε)   AdamW adds -lr*λ*w
train FLOPs ≈ 6 * params * tokens
```

### Training recipe (default)
AdamW (lr 1e-4–1e-3, wd 0.01–0.1) • warm-up + cosine decay • BF16 autocast • gradient clipping 1.0 • batch size as large as fits (+accumulation) • augmentation • early stopping + best-checkpoint • log everything.

### Debug checklist
Data/labels OK? → overfit one batch → loss/logits correct → train/eval modes → LR → gradient norms → NaN checks → compare with a reference → scale up gradually.

### Deployment checklist
`eval()` mode • identical preprocessing • export (ONNX/TorchScript) and numerics check • quantise and re-evaluate • batch/latency benchmark on target hardware • monitoring and rollback.

### Final checklist before the interview
- [ ] Explain forward/backward propagation, activations, losses, optimisers.
- [ ] Explain vanishing/exploding gradients and their fixes.
- [ ] Compare BatchNorm, LayerNorm; dropout, weight decay; Adam vs AdamW.
- [ ] Describe CNN, RNN/LSTM, and the Transformer with attention maths.
- [ ] Explain transfer learning, LoRA, distillation and quantisation.
- [ ] Describe mixed precision, accumulation, checkpointing, DDP/FSDP.
- [ ] Explain GAN, VAE and diffusion at a high level.
- [ ] Debug NaN loss, non-learning models, OOM and low GPU utilisation.
- [ ] Discuss serving: KV cache, batching, ONNX/TensorRT, latency vs throughput.
- [ ] Prepare a project story with baseline, experiments, numbers and lessons.
