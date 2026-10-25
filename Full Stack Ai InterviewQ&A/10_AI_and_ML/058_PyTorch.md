# PyTorch Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **Python 3.11+, PyTorch 2.x (2.3 – 2.6 era) with `torch.compile`, torchvision 0.18+, torchaudio, CUDA 12.x**, plus notes on **PyTorch Lightning, Hugging Face Accelerate, ONNX, torch.distributed (DDP/FSDP2) and TorchServe/Triton**. APIs such as `torch.load(weights_only=...)` defaults, `torch.amp.autocast("cuda")` (replacing `torch.cuda.amp`), `torch.func`, `FSDP` vs `FSDP2 (fully_shard)`, `torch.export`, and `torch.compile` behaviour change between releases: anything marked "verify" should be checked in the official docs (pytorch.org/docs). Examples use the sample name **Ritesh Kumar** and small image / text / tabular tasks.
> This file covers tensors (dtype, device, shape, strides, views vs copies, broadcasting), autograd, `nn.Module`, layers, losses, optimisers, schedulers, `Dataset`/`DataLoader`, training and evaluation loops, saving/loading, GPU use, mixed precision, gradient accumulation and clipping, custom modules/autograd functions/hooks, `torch.compile`, distributed training (DDP, FSDP), profiling, debugging, ONNX/TorchScript export, serving, and production practices. Related topics: deep learning theory in `057_Deep-Learning.md`, classical ML in `056_Machine-Learning.md`, NumPy in `055_Pandas-and-NumPy.md`, Python in `../03_Backend/014_Python.md`, Hugging Face in `062_Hugging-Face.md`, NLP in `059_NLP.md`, vision in `060_Computer-Vision.md`, MLOps in `074_MLOps.md`, model serving in `../11_Generative_AI/073_Model-Serving-and-Inference.md`.

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

### Q1. What is PyTorch? *(Must-know)*
An open-source deep-learning framework (originally from Meta, now under the Linux Foundation) offering **tensors with GPU support**, **automatic differentiation (autograd)**, neural-network building blocks (`torch.nn`), optimisers, data utilities and a compiler (`torch.compile`). It uses **eager, define-by-run** execution, so code runs like normal Python and is easy to debug.

### Q2. What is a tensor? *(Must-know)*
An n-dimensional array (like NumPy's `ndarray`) with a **dtype**, a **device** (CPU/GPU) and optional gradient tracking (`requires_grad`).
```python
import torch
a = torch.tensor([[1., 2.], [3., 4.]])
a.shape, a.dtype, a.device        # (torch.Size([2, 2]), torch.float32, cpu)
```

### Q3. PyTorch tensor vs NumPy array
| Aspect | NumPy `ndarray` | `torch.Tensor` |
|---|---|---|
| Device | CPU only | CPU / GPU / other accelerators |
| Autograd | No | Yes |
| Default float | float64 | float32 |
| Interop | `torch.from_numpy(a)` | `t.numpy()` (CPU, shares memory) |

### Q4. Creating tensors
```python
torch.zeros(2, 3); torch.ones(2, 3); torch.arange(0, 10, 2)
torch.linspace(0, 1, 5); torch.eye(3); torch.rand(2, 2); torch.randn(2, 2)
torch.randint(0, 10, (3,)); torch.full((2, 2), 7.); torch.empty(2, 2)
torch.zeros_like(a); torch.manual_seed(42)
```

### Q5. Shape, dtype and device conversion
```python
x = x.to(torch.float16)           # dtype
x = x.to("cuda")                  # device (or .cuda(), .cpu())
x = x.to(device, dtype=torch.float32)
```
Common dtypes: `float32` (default), `float16`, `bfloat16`, `float64`, `int64` (`long`, labels/indices), `int32`, `bool`.

### Q6. Indexing and slicing
Same as NumPy: `x[0]`, `x[:, 1]`, `x[x > 0]`, `x[[0, 2]]`, `x[..., -1]`. Slices are **views**; boolean/fancy indexing makes copies.

### Q7. Reshaping: `view`, `reshape`, `permute`, `transpose`, `squeeze`, `unsqueeze` *(Must-know)*
```python
x = torch.arange(12)
x.view(3, 4)            # needs contiguous memory; returns a view
x.reshape(3, 4)         # view if possible, else copy
x.view(3, -1)           # infer one dim
y = x.view(3, 4).permute(1, 0)     # reorder dims (view, non-contiguous)
y.contiguous()          # make a contiguous copy if needed
x.unsqueeze(0)          # add a dim -> (1, 12)
x.unsqueeze(0).squeeze(0)
```

### Q8. Broadcasting
Shapes align from the right; dimensions of size 1 (or missing) expand. `(3,1) + (1,4) → (3,4)`. Incompatible sizes raise `RuntimeError`.

### Q9. Basic maths and reductions
`+ - * /` element-wise; `@` or `torch.matmul` for matrix multiply; `x.sum(dim=0)`, `.mean()`, `.max(dim=1)`, `.argmax(dim=1)`, `.std()`. `keepdim=True` preserves the reduced dimension.

### Q10. In-place operations
Methods ending in `_` modify in place (`x.add_(1)`, `x.zero_()`). They save memory but can break autograd if they overwrite values needed for the backward pass.

### Q11. What is autograd? *(Must-know)*
PyTorch's automatic differentiation engine. It records operations on tensors with `requires_grad=True` into a dynamic graph, and `loss.backward()` computes gradients via reverse-mode differentiation, storing them in `.grad`.
```python
w = torch.tensor(3.0, requires_grad=True)
y = w ** 2 + 2 * w
y.backward()
print(w.grad)       # tensor(8.)  (2w + 2)
```

### Q12. `requires_grad`, `detach()` and `torch.no_grad()` *(Must-know)*
- `requires_grad=True`: track operations for gradients.
- `x.detach()`: returns a tensor sharing data but cut from the graph.
- `with torch.no_grad():` disables graph building (inference, evaluation, manual updates). `torch.inference_mode()` is even faster.

### Q13. Why `optimizer.zero_grad()`? *(Must-know)*
Gradients **accumulate** in `.grad` across `backward()` calls. Without clearing them each step, you add gradients from previous batches. (`set_to_none=True` is the default in recent versions and slightly faster.)

### Q14. What is `nn.Module`? *(Must-know)*
The base class for all layers and models. You define layers in `__init__` and the computation in `forward`. It tracks parameters automatically (`.parameters()`, `.state_dict()`), supports `.to(device)`, `.train()`/`.eval()`.
```python
import torch.nn as nn
class Net(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(4, 8)
        self.fc2 = nn.Linear(8, 3)
    def forward(self, x):
        return self.fc2(torch.relu(self.fc1(x)))
```
Call `model(x)`, not `model.forward(x)` (so hooks run).

### Q15. Common layers
`nn.Linear`, `nn.Conv2d`, `nn.MaxPool2d`, `nn.BatchNorm2d`, `nn.LayerNorm`, `nn.Dropout`, `nn.Embedding`, `nn.LSTM`/`GRU`, `nn.TransformerEncoderLayer`, `nn.Flatten`, `nn.Sequential`.

### Q16. Activation functions
`nn.ReLU`, `nn.GELU`, `nn.SiLU`, `nn.Sigmoid`, `nn.Tanh`, `nn.LeakyReLU`, `nn.Softmax(dim=...)`. Functional versions live in `torch.nn.functional` (`F.relu`).

### Q17. Loss functions *(Must-know)*
| Task | Loss | Input |
|---|---|---|
| Regression | `nn.MSELoss`, `nn.L1Loss`, `nn.SmoothL1Loss` | Predictions, targets (float) |
| Binary | `nn.BCEWithLogitsLoss` | **Logits**, float targets |
| Multi-class | `nn.CrossEntropyLoss` | **Logits** `(N,C)`, class indices `(N,)` (long) |
| Multi-label | `nn.BCEWithLogitsLoss` | Logits `(N,C)` |
Do **not** apply softmax/sigmoid before these.

### Q18. Optimisers
`torch.optim.SGD(lr, momentum)`, `Adam`, `AdamW` (preferred with weight decay), `RMSprop`, `Adagrad`. Pass `model.parameters()`.

### Q19. The standard training loop *(Must-know)*
```python
for epoch in range(epochs):
    model.train()
    for x, y in train_loader:
        x, y = x.to(device), y.to(device)
        optimizer.zero_grad()
        loss = criterion(model(x), y)
        loss.backward()
        optimizer.step()
```
Order: zero grads → forward → loss → backward → step.

### Q20. The evaluation loop
```python
model.eval()
correct = 0
with torch.no_grad():
    for x, y in val_loader:
        pred = model(x.to(device)).argmax(1)
        correct += (pred.cpu() == y).sum().item()
```

### Q21. `Dataset` and `DataLoader` *(Must-know)*
A `Dataset` defines `__len__` and `__getitem__`; a `DataLoader` batches, shuffles and loads in parallel.
```python
from torch.utils.data import Dataset, DataLoader
class MyData(Dataset):
    def __init__(self, X, y): self.X, self.y = X, y
    def __len__(self): return len(self.X)
    def __getitem__(self, i): return self.X[i], self.y[i]
loader = DataLoader(MyData(X, y), batch_size=32, shuffle=True, num_workers=2)
```

### Q22. Using the GPU
```python
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device); x = x.to(device)
```
Model and data must be on the **same device**, or you get a device-mismatch error. Apple Silicon uses `"mps"`.

### Q23. Saving and loading models *(Must-know)*
```python
torch.save(model.state_dict(), "model.pt")
model = Net(); model.load_state_dict(torch.load("model.pt", map_location="cpu", weights_only=True))
model.eval()
```
Save the `state_dict` (portable) rather than pickling the whole model.

### Q24. `model.train()` vs `model.eval()`
`train()` enables dropout and batch-norm using batch statistics. `eval()` disables dropout and uses running statistics. It does **not** disable gradients; combine it with `no_grad`.

### Q25. Counting parameters
```python
sum(p.numel() for p in model.parameters() if p.requires_grad)
```

### Q26. `nn.Sequential`
A container that applies modules in order: `nn.Sequential(nn.Linear(4, 8), nn.ReLU(), nn.Linear(8, 3))`.

### Q27. Reproducibility basics
```python
import random, numpy as np
random.seed(0); np.random.seed(0); torch.manual_seed(0); torch.cuda.manual_seed_all(0)
```
GPU kernels can still be non-deterministic unless you set `torch.use_deterministic_algorithms(True)` (slower, may raise errors).

### Q28. `item()`, `tolist()`, `numpy()`
`t.item()` converts a one-element tensor to a Python number; `.tolist()` to lists; `.cpu().numpy()` to NumPy (must detach if it requires grad).

### Q29. Concatenating and stacking
`torch.cat([a, b], dim=0)` joins along an existing dim; `torch.stack([a, b], dim=0)` creates a new dim. `torch.split`, `torch.chunk` split tensors.

### Q30. Torchvision basics
`torchvision.datasets` (MNIST, CIFAR-10), `torchvision.transforms` (ToTensor, Normalize, Resize, augmentation), `torchvision.models` (ResNet, EfficientNet, ViT with pretrained weights).

---

# 🔵 Part 2: Junior (1–3 years)

### Q31. `view` vs `reshape` vs `contiguous` *(Must-know)*
`view` requires compatible strides (usually contiguous memory) and never copies. After `permute`/`transpose`, the tensor is non-contiguous so `.view` fails; use `.reshape` or `.contiguous().view`. `reshape` returns a view when possible, else a copy.

### Q32. How autograd graphs are built and freed
Each op creates a `grad_fn` node. After `.backward()`, the graph buffers are freed by default; calling `backward` again raises an error unless `retain_graph=True`. Leaf tensors (parameters) store `.grad`; non-leaf tensors don't unless you call `.retain_grad()`.

### Q33. Gradient accumulation
```python
accum = 4
for i, (x, y) in enumerate(loader):
    loss = criterion(model(x.to(device)), y.to(device)) / accum
    loss.backward()
    if (i + 1) % accum == 0:
        optimizer.step(); optimizer.zero_grad()
```
Emulates a larger batch when memory is limited.

### Q34. Gradient clipping
```python
torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
```
Call after `backward()` and before `step()`. With AMP's GradScaler, call `scaler.unscale_(optimizer)` first.

### Q35. Learning-rate schedulers
```python
sched = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs)
# StepLR, ExponentialLR, OneCycleLR, ReduceLROnPlateau, LambdaLR, LinearLR (warm-up), SequentialLR
```
Call `scheduler.step()` per epoch (or per batch for per-step schedulers like OneCycle), after `optimizer.step()`. `ReduceLROnPlateau.step(val_loss)` takes a metric.

### Q36. Parameter groups (different LRs)
```python
optimizer = torch.optim.AdamW([
    {"params": model.backbone.parameters(), "lr": 1e-5},
    {"params": model.head.parameters(),     "lr": 1e-3},
], weight_decay=0.01)
```

### Q37. Freezing layers (transfer learning)
```python
for p in model.backbone.parameters(): p.requires_grad = False
optimizer = torch.optim.AdamW(filter(lambda p: p.requires_grad, model.parameters()), lr=1e-3)
```
Also put frozen BatchNorm layers in `eval()` mode if you don't want their running stats to change.

### Q38. Custom `Dataset` for images
```python
from PIL import Image
class ImgData(Dataset):
    def __init__(self, paths, labels, tf): self.p, self.l, self.tf = paths, labels, tf
    def __len__(self): return len(self.p)
    def __getitem__(self, i):
        img = Image.open(self.p[i]).convert("RGB")
        return self.tf(img), self.l[i]
```
Heavy decoding in `__getitem__` runs in worker processes (`num_workers`).

### Q39. DataLoader parameters that matter *(Must-know)*
`batch_size`, `shuffle` (train only), `num_workers`, `pin_memory=True` (faster host→GPU copies), `drop_last`, `prefetch_factor`, `persistent_workers=True`, `collate_fn`, `sampler`/`batch_sampler`, `worker_init_fn` (seeding).

### Q40. Custom `collate_fn` (variable-length data)
```python
from torch.nn.utils.rnn import pad_sequence
def collate(batch):
    xs, ys = zip(*batch)
    lengths = torch.tensor([len(x) for x in xs])
    return pad_sequence(xs, batch_first=True), lengths, torch.tensor(ys)
```

### Q41. `state_dict`, checkpoints and resuming
```python
ckpt = {"epoch": e, "model": model.state_dict(), "opt": optimizer.state_dict(),
        "sched": sched.state_dict(), "scaler": scaler.state_dict()}
torch.save(ckpt, "ckpt.pt")
```
Load all of them to resume exactly; restore RNG state if bit-exact resumption matters.

### Q42. `strict=False` in `load_state_dict`
Allows missing/unexpected keys (e.g., loading a backbone into a model with a new head). Always inspect the returned `missing_keys` and `unexpected_keys`.

### Q43. Weight initialisation
```python
def init(m):
    if isinstance(m, nn.Linear):
        nn.init.kaiming_normal_(m.weight, nonlinearity="relu"); nn.init.zeros_(m.bias)
model.apply(init)
```

### Q44. Dropout and BatchNorm in `train` vs `eval`
Forgetting `model.eval()` at inference is a classic bug: predictions become noisy (dropout) and batch-statistics dependent (BN).

### Q45. `nn.Parameter` and buffers
`nn.Parameter` registers a learnable tensor. `register_buffer("name", tensor)` stores non-learnable state (BN running mean, masks) that moves with `.to(device)` and is saved in `state_dict`. A plain tensor attribute is neither moved nor saved.

### Q46. `ModuleList` and `ModuleDict`
Use `nn.ModuleList` / `nn.ModuleDict` for layers in containers; a plain Python list hides them from `.parameters()` and `.to(device)`.

### Q47. `F.cross_entropy` options
`weight` (class imbalance), `ignore_index` (padding), `label_smoothing`, `reduction` (`mean`/`sum`/`none`).

### Q48. Handling class imbalance
`CrossEntropyLoss(weight=...)`, `pos_weight` in `BCEWithLogitsLoss`, `WeightedRandomSampler`, focal loss, augmentation, and per-class metrics.

### Q49. Metrics
Use `torchmetrics` or scikit-learn: accuracy, F1, AUROC, confusion matrix. Compute on the full validation set (or accumulate correctly), not by averaging batch scores incorrectly.

### Q50. TensorBoard / experiment tracking
```python
from torch.utils.tensorboard import SummaryWriter
w = SummaryWriter("runs/exp1"); w.add_scalar("loss/train", loss.item(), step)
```
Or Weights & Biases / MLflow.

### Q51. Transfer learning with torchvision
```python
from torchvision import models
m = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
m.fc = nn.Linear(m.fc.in_features, num_classes)
tf = models.ResNet50_Weights.DEFAULT.transforms()    # matching preprocessing
```

### Q52. Image transforms and augmentation
```python
from torchvision import transforms as T
train_tf = T.Compose([T.RandomResizedCrop(224), T.RandomHorizontalFlip(), T.ColorJitter(0.2, 0.2),
                      T.ToTensor(), T.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])])
```
Validation uses deterministic resize + center crop + normalise only.

### Q53. Text models: `nn.Embedding` and padding
`nn.Embedding(vocab, dim, padding_idx=0)` keeps the padding vector at zero with no gradient. Use masks for attention and `ignore_index` for loss.

### Q54. Writing an RNN/LSTM model
```python
class TextLSTM(nn.Module):
    def __init__(self, vocab, d=128, h=256, c=2):
        super().__init__()
        self.emb = nn.Embedding(vocab, d, padding_idx=0)
        self.lstm = nn.LSTM(d, h, batch_first=True, bidirectional=True)
        self.fc = nn.Linear(2 * h, c)
    def forward(self, x):
        out, (hn, _) = self.lstm(self.emb(x))
        return self.fc(torch.cat([hn[-2], hn[-1]], dim=1))
```

### Q55. `torch.utils.data.random_split` and splits
`random_split(ds, [0.8, 0.1, 0.1], generator=torch.Generator().manual_seed(0))` gives reproducible splits. For time series or grouped data, split manually to avoid leakage.

### Q56. Mixed precision (AMP) basics *(Must-know)*
```python
scaler = torch.amp.GradScaler("cuda")
for x, y in loader:
    optimizer.zero_grad()
    with torch.autocast("cuda", dtype=torch.float16):
        loss = criterion(model(x.cuda()), y.cuda())
    scaler.scale(loss).backward()
    scaler.step(optimizer); scaler.update()
```
With `bfloat16`, no GradScaler is needed.

### Q57. Early stopping pattern
Track best validation metric; save the best checkpoint; stop after `patience` epochs without improvement. Reload the best weights before the final test evaluation.

### Q58. `torch.no_grad` vs `torch.inference_mode`
`inference_mode` is stricter and faster (tensors created inside can't be used in autograd later). Use it for pure inference; use `no_grad` when you may reuse results in training code.

### Q59. Common shape errors and how to read them
`mat1 and mat2 shapes cannot be multiplied`: wrong `in_features`. `Expected target size`, `Target 5 is out of bounds`: label range vs number of classes. Print `x.shape` at each layer, or use `torchinfo.summary`.

### Q60. `torchinfo` / model summary
`torchinfo.summary(model, input_size=(1, 3, 224, 224))` shows shapes, parameters and memory estimates.

---

# 🟡 Part 3: Mid (3–5 years)

### Q61. Autograd internals: `grad_fn`, graph, VJP *(Must-know)*
Every non-leaf tensor holds a `grad_fn` pointing to a backward node. `backward()` topologically traverses the graph and applies each node's **vector–Jacobian product**, accumulating into leaf `.grad`. It's reverse-mode AD: efficient when outputs (loss) ≪ inputs (parameters).

### Q62. Custom autograd `Function`
```python
class MyReLU(torch.autograd.Function):
    @staticmethod
    def forward(ctx, x):
        ctx.save_for_backward(x)
        return x.clamp(min=0)
    @staticmethod
    def backward(ctx, grad_out):
        (x,) = ctx.saved_tensors
        return grad_out * (x > 0)
y = MyReLU.apply(x)
```
Verify with `torch.autograd.gradcheck` (float64).

### Q63. Hooks
- **Forward hook**: `module.register_forward_hook(fn)` to capture activations.
- **Forward pre-hook** to modify inputs.
- **Backward hook**: `register_full_backward_hook` for gradients per module.
- **Tensor hook**: `tensor.register_hook(fn)` modifies/inspects gradients.
Useful for feature extraction, Grad-CAM, debugging, gradient clipping per layer. Remove hooks with the returned handle.

### Q64. Higher-order gradients
`torch.autograd.grad(y, x, create_graph=True)` enables second derivatives (Hessian-vector products, meta-learning, gradient penalties such as WGAN-GP).

### Q65. `torch.func` (functorch)
Functional transforms: `vmap` (vectorise), `grad`, `jacrev/jacfwd`, `hessian`, `functional_call`. Enables per-sample gradients and model ensembling without Python loops.

### Q66. Memory model of tensors: storage, strides, offset
A tensor is metadata (shape, strides, offset, dtype) over a **storage**. Views share storage; `x.is_contiguous()`, `x.stride()`, `x.storage_offset()`, `x.data_ptr()` reveal layout. Transpose swaps strides without copying.

### Q67. CUDA basics: asynchronous execution
CUDA kernels are queued asynchronously. Timing needs `torch.cuda.synchronize()` or CUDA events. Operations like `.item()`, `.cpu()`, `print(tensor)`, and boolean indexing force **host-device synchronisation**, stalling the pipeline.

### Q68. GPU memory management
PyTorch's caching allocator reuses memory (`nvidia-smi` shows reserved, not necessarily used). Tools: `torch.cuda.memory_allocated()`, `memory_reserved()`, `memory_summary()`, `empty_cache()` (rarely helpful), `PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True` to reduce fragmentation (verify per version).

### Q69. Reducing GPU memory
Smaller batch, mixed precision, gradient accumulation, **gradient checkpointing** (`torch.utils.checkpoint`), shorter sequences, `set_to_none=True`, avoid keeping graph references (`loss.item()`, `.detach()` for logs), 8-bit optimisers, offload, FSDP.

### Q70. Gradient checkpointing
```python
from torch.utils.checkpoint import checkpoint
def forward(self, x):
    for blk in self.blocks:
        x = checkpoint(blk, x, use_reentrant=False)
    return x
```
Recomputes activations in backward, saving memory at ~20–33% extra compute.

### Q71. Efficient attention: `scaled_dot_product_attention`
`F.scaled_dot_product_attention(q, k, v, is_causal=True)` dispatches to FlashAttention / memory-efficient / math kernels automatically. Prefer it over hand-written softmax attention.

### Q72. `torch.compile` *(Must-know)*
```python
model = torch.compile(model)               # modes: default, reduce-overhead, max-autotune
```
Uses TorchDynamo to capture graphs and TorchInductor to generate fused kernels (Triton on GPU). Benefits: speed-ups from fusion. Pitfalls: first-call compile time, **graph breaks** (data-dependent control flow, unsupported Python), recompilation on shape changes (use `dynamic=True` or mark dynamic dims), debugging complexity. Inspect with `TORCH_LOGS="graph_breaks,recompiles"`.

### Q73. TorchScript vs `torch.compile` vs `torch.export`
- **TorchScript** (`jit.script/trace`): older, serialisable graph; in maintenance mode.
- **`torch.compile`**: JIT optimisation for speed within Python.
- **`torch.export`**: ahead-of-time full-graph export (ExportedProgram) for deployment (ExecuTorch, AOT Inductor). Verify current guidance in the docs.

### Q74. DDP in practice *(Must-know)*
```python
import torch.distributed as dist
from torch.nn.parallel import DistributedDataParallel as DDP
from torch.utils.data.distributed import DistributedSampler

dist.init_process_group("nccl")
rank = dist.get_rank(); local = int(os.environ["LOCAL_RANK"])
torch.cuda.set_device(local)
model = DDP(model.cuda(local), device_ids=[local])
sampler = DistributedSampler(ds, shuffle=True)
loader = DataLoader(ds, batch_size=32, sampler=sampler)
for epoch in range(E):
    sampler.set_epoch(epoch)        # different shuffle each epoch
    ...
```
Launch: `torchrun --nproc_per_node=4 train.py`. Only rank 0 should log/save. Effective batch = per-GPU batch × world size.

### Q75. DDP gotchas
Forgetting `set_epoch`, unused parameters (`find_unused_parameters=True` slows), different control flow across ranks (hangs), saving from all ranks, BatchNorm statistics (use `SyncBatchNorm`), and non-picklable datasets.

### Q76. FSDP overview
Fully Sharded Data Parallel shards parameters, gradients and optimiser states across ranks and gathers layer weights on demand. Needed when the model/optimiser state exceeds one GPU. Configure auto-wrap policy, mixed precision, activation checkpointing, and sharded state-dict checkpointing.

### Q77. Custom loss functions
```python
class FocalLoss(nn.Module):
    def __init__(self, gamma=2.0): super().__init__(); self.g = gamma
    def forward(self, logits, y):
        ce = F.cross_entropy(logits, y, reduction="none")
        p = torch.exp(-ce)
        return ((1 - p) ** self.g * ce).mean()
```
Use tensor ops only (differentiable); avoid `.item()` or NumPy inside the forward.

### Q78. Custom optimiser step (manual update)
```python
with torch.no_grad():
    for p in model.parameters():
        p -= lr * p.grad
        p.grad = None
```

### Q79. EMA of weights
Maintain an exponential moving average of parameters for smoother evaluation: `ema = decay*ema + (1-decay)*param`. `torch.optim.swa_utils.AveragedModel` supports EMA/SWA. Use EMA weights for validation/inference.

### Q80. Data loading performance *(Must-know)*
Profile first. If GPU util is low: raise `num_workers`, `pin_memory=True`, `persistent_workers=True`, `prefetch_factor`, move augmentation to GPU (Kornia/DALI), store data in efficient formats (WebDataset, LMDB, Parquet, memory-mapped arrays), cache decoded samples, avoid per-item disk seeks.

### Q81. IterableDataset and streaming
For streams/huge data implement `__iter__`; with multiple workers you must **shard** the stream by `get_worker_info()` or you'll yield duplicates. Shuffling uses buffers.

### Q82. Samplers
`RandomSampler`, `SequentialSampler`, `WeightedRandomSampler` (imbalance), `DistributedSampler`, custom batch samplers (bucket by length to reduce padding).

### Q83. Dynamic padding and length bucketing
Group similar-length sequences to cut padding waste; pad to batch max length in `collate_fn`. Big speed-ups for NLP.

### Q84. Handling NaN/inf
`torch.isnan(x).any()`, `torch.autograd.set_detect_anomaly(True)` (slow; debugging only), check inputs, `log(0)`, division by zero, large LR, FP16 overflow. Use `torch.nan_to_num` sparingly; find the root cause.

### Q85. Profiling with `torch.profiler`
```python
from torch.profiler import profile, ProfilerActivity, schedule
with profile(activities=[ProfilerActivity.CPU, ProfilerActivity.CUDA],
             schedule=schedule(wait=1, warmup=1, active=3),
             on_trace_ready=torch.profiler.tensorboard_trace_handler("./log")) as prof:
    for step, (x, y) in enumerate(loader):
        train_step(x, y); prof.step()
```
Look for host-device syncs, small kernels, data-loading gaps, memory peaks.

### Q86. PyTorch Lightning / Accelerate
Lightning structures training (`LightningModule`, `Trainer`) and handles devices, precision, logging, checkpoints, DDP. Accelerate wraps plain loops for multi-GPU/mixed precision with minimal code. Trade-off: less boilerplate vs less visibility.

### Q87. Exporting to ONNX
```python
torch.onnx.export(model.eval(), dummy, "m.onnx", input_names=["x"], output_names=["y"],
                  dynamic_axes={"x": {0: "batch"}}, opset_version=17)
```
Validate with ONNX Runtime and compare outputs numerically. Control flow and custom ops can fail; use `torch.onnx.dynamo_export`/`export` in newer versions (verify).

### Q88. Quantisation in PyTorch
Dynamic quantisation (`quantize_dynamic` for Linear/LSTM), static PTQ with calibration, QAT. For LLMs use bitsandbytes/GPTQ/AWQ or `torchao`. Always re-measure accuracy and latency on target hardware.

### Q89. Pruning and sparsity (`torch.nn.utils.prune`)
Unstructured/structured masks; real speed-ups need structured pruning or sparse kernels. Fine-tune after pruning.

### Q90. Testing PyTorch code
Unit-test shapes, determinism with seeds, gradient flow (`all(p.grad is not None ...)`), overfit-one-batch test, `gradcheck` for custom ops, serialisation round-trip, and ONNX parity tests. Use `torch.testing.assert_close` for tolerance-aware comparisons.

---

# 🟠 Part 4: Senior (5–7 years)

### Q91. Design a clean training framework
Separate concerns: config (Hydra/YAML) → data module → model factory → trainer (loop, AMP, accumulation, checkpoint, logging, early stopping) → evaluator → callbacks. Make everything seed-able and resumable; keep model code free of I/O; write smoke tests that train 5 steps in CI.

### Q92. Resumable, fault-tolerant training
Checkpoint model, optimiser, scheduler, scaler, RNG states, data-loader position/epoch, and step counters atomically (write temp file then rename). Use `torchrun --max-restarts` / elastic training; make dataloading deterministic per epoch so a restart doesn't repeat or skip data.

### Q93. Multi-node training considerations
NCCL over InfiniBand/EFA, `MASTER_ADDR/PORT`, rendezvous (c10d/etcd), topology-aware placement, timeouts, health checks, straggler detection, shared storage vs local scratch for datasets, and hierarchical logging. Set `NCCL_DEBUG=INFO` when diagnosing hangs.

### Q94. DDP vs FSDP vs tensor/pipeline parallel
DDP for models that fit on one GPU. FSDP/ZeRO when parameters/optimiser states don't fit. Tensor parallel (Megatron-style) for huge layers with fast interconnects. Pipeline parallel for depth. Combine via `DeviceMesh` / `torch.distributed.tensor` (DTensor) and `torch.distributed.pipelining` (verify APIs).

### Q95. FSDP details
Wrap policy by transformer block; `MixedPrecision` for param/reduce/buffer dtypes; sharding strategies (`FULL_SHARD`, `SHARD_GRAD_OP`, `HYBRID_SHARD`); CPU offload; limit all-gathers with `forward_prefetch`/`backward_prefetch`; **sharded checkpointing** with `torch.distributed.checkpoint` (DCP) to avoid gathering full models on one rank.

### Q96. Performance engineering workflow
Measure (profiler, MFU, tokens/s) → fix data pipeline → enable AMP (BF16) → `torch.compile` → fuse ops / efficient attention → increase batch (accumulation) → channels-last for convnets → tune comm overlap → custom kernels (Triton) only for proven hotspots. Optimise by evidence.

### Q97. Channels-last and TF32
`model.to(memory_format=torch.channels_last)` helps convs on Tensor Cores. `torch.backends.cuda.matmul.allow_tf32 = True` / `torch.set_float32_matmul_precision("high")` accelerate FP32 matmuls on Ampere+ with slight precision loss.

### Q98. Writing custom CUDA/Triton kernels
Use when profiling shows a memory-bound or unfused hotspot. Triton lets you write GPU kernels in Python-like code; C++/CUDA extensions via `torch.utils.cpp_extension`. Provide autograd support, tests against reference ops, and fall-back paths. Prefer `torch.compile` first.

### Q99. Handling variable shapes with `torch.compile`
Avoid recompiles: bucket shapes, use `torch._dynamo.mark_dynamic`, pad to a few fixed sizes, or `dynamic=True`. Watch recompile limits and guards in logs.

### Q100. Reproducibility at scale
Seed everything per rank (`seed + rank`), deterministic data sharding, `use_deterministic_algorithms`, fixed library/CUDA versions, document non-determinism sources (atomics, reduction order, NCCL). Exact bitwise reproducibility across hardware is usually unrealistic; target statistical reproducibility.

### Q101. Production inference with PyTorch
Options: TorchServe (maintenance mode; verify), Triton Inference Server, KServe, BentoML, FastAPI + ONNX Runtime/TensorRT, vLLM/TGI for LLMs. Practices: `eval()` + `inference_mode`, warm-up, dynamic batching, fixed input validation, timeouts, GPU memory pre-allocation, health checks, versioned artefacts.

### Q102. Optimising inference latency
Quantise, fuse (`torch.compile`, TensorRT), batch dynamically, use FP16/BF16, prune/distil, cache KV (LLMs), pin memory and overlap H2D copies with CUDA streams, avoid Python overhead (CUDA graphs via `mode="reduce-overhead"`).

### Q103. CUDA graphs
Record a sequence of kernel launches and replay it with minimal CPU overhead; great for small-batch, latency-sensitive inference. Requires static shapes and memory addresses.

### Q104. Memory debugging
`torch.cuda.memory._record_memory_history()` + snapshot visualisation, `memory_summary`, look for leaked references (storing tensors with graphs in lists/loggers), growing caches, fragmentation, retained `.grad`, and long-lived hooks.

### Q105. Numerical stability in custom code
Use `log_softmax`/`logsumexp`, `BCEWithLogits`, add `eps` in divisions/logs, clamp ranges, keep reductions (softmax, layer-norm, loss) in FP32 under autocast, and test with extreme values.

### Q106. Gradient flow diagnostics
Log per-layer gradient norms/ratios of update-to-weight (~1e-3 typical), activation statistics, dead-ReLU fraction, and loss-scale behaviour. Use hooks or `torch.nn.utils.clip_grad_norm_` return value.

### Q107. Large-batch and LR scaling
Linear scaling rule + warm-up, LARS/LAMB for very large batches, and checking generalisation gap; AdamW with proper betas/epsilon for Transformers (`eps=1e-8`, beta2 0.95–0.999).

### Q108. Model parallel by hand (simple case)
Place submodules on different devices and move activations in `forward` (`x = x.to("cuda:1")`). Simple but under-utilises GPUs without pipelining micro-batches.

### Q109. Interoperability
NumPy/pandas (`torch.from_numpy`), Arrow/Parquet, DLPack (`torch.utils.dlpack`) for zero-copy with CuPy/JAX/TF, ONNX, Hugging Face (`PreTrainedModel`), TorchScript/ExecuTorch for mobile.

### Q110. Safe model loading
`torch.load` uses pickle, which can execute arbitrary code. Use `weights_only=True`, prefer **safetensors** for sharing weights, verify sources and hashes, and never load untrusted checkpoints in privileged environments.

### Q111. Dealing with huge embeddings tables
Sparse gradients (`nn.Embedding(sparse=True)` with SparseAdam), sharded embeddings (TorchRec), hashing, mixed precision tables, caching hot rows.

### Q112. Multi-task and multi-optimiser training
Separate optimisers/schedulers per component (e.g., GAN generator/discriminator), manual `zero_grad` per optimiser, careful `detach()` for adversarial updates, and loss balancing methods.

### Q113. Custom `Sampler` / curriculum learning
Control the data order by difficulty or domain mixture; make sampling state resumable; log the realised mixture.

### Q114. Validating a new model implementation
Compare layer outputs with a reference implementation on the same weights (`torch.testing.assert_close`), overfit a tiny dataset, check parameter counts, verify masks and positional logic, and run gradient checks.

### Q115. Evaluating training efficiency
Metrics: samples/s or tokens/s, step time breakdown (data, forward, backward, optimiser, comm), GPU utilisation, **MFU** (model FLOPs utilisation), memory headroom, and cost per epoch.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q116. Standardising PyTorch across teams
Provide a template repo (project layout, configs, CI, linting, type hints, tests), shared training library, pinned base Docker images (CUDA + PyTorch versions), experiment tracking conventions, code-review checklist (shapes, device handling, seeds, eval mode), and documentation of golden paths.

### Q117. Framework strategy: PyTorch vs JAX vs TensorFlow
PyTorch: ecosystem, research velocity, hiring pool, Hugging Face support. JAX: functional transforms, TPU strength, XLA, large-scale research. TensorFlow/Keras: mature serving/mobile stack. Decide by team skills, hardware, model families, deployment needs and ecosystem lock-in; Keras 3 offers multi-backend portability.

### Q118. Upgrade and dependency management
Pin PyTorch/CUDA/driver combinations, run CI matrices on upgrades, track deprecations (read release notes), keep a compatibility test suite (numerics and performance), canary upgrades on non-critical jobs, and avoid mixing pip/conda CUDA runtimes.

### Q119. Cluster and cost strategy
Scheduler choice (Kubernetes + Kueue, SLURM, Ray), spot/preemptible with elastic training, quotas, job priorities, utilisation dashboards, right-sizing GPUs (memory vs interconnect), reserved capacity for steady workloads, and chargeback.

### Q120. Training reliability engineering
Automatic restarts, health checks for GPUs/NICs, silent-data-corruption detection (loss sanity, checksum validation), checkpoint frequency vs cost, regression tests for training recipes, and post-mortems for failed runs.

### Q121. Security and supply chain
Vet pre-trained weights and datasets (licence, provenance), use safetensors, scan containers, restrict pickle loading, isolate training jobs, handle PII in data, and sign/verify model artefacts.

### Q122. Model lifecycle integration
Training → registry (MLflow) → evaluation gates → export (ONNX/TorchScript/engine) → staging → canary/shadow → production → monitoring → retraining. Keep lineage between code commit, data version, config, and artefact.

### Q123. Observability for training and serving
Training: loss/metric curves, throughput, grad norms, GPU/CPU/IO metrics, NCCL timings. Serving: latency percentiles, batch sizes, queue depth, GPU memory, error rates, input/prediction drift. Alerts with runbooks.

### Q124. Build a custom operator vs rely on libraries
Prefer existing ops/`torch.compile`/library kernels. Write custom kernels only when benchmarks justify, and own long-term maintenance: tests, CI on multiple GPU architectures, fallbacks, and documentation.

### Q125. Mentoring and review culture
Teach debugging recipes (overfit-one-batch, shape asserts, gradient checks), review for hidden syncs and memory leaks, share performance case studies, and maintain a living "PyTorch pitfalls" guide.

---

# 💻 Part 6: Hands-On Tasks & Code

### Task 1. End-to-end tabular classifier
```python
import torch, torch.nn as nn
from torch.utils.data import TensorDataset, DataLoader, random_split

X = torch.randn(2000, 10); y = (X[:, 0] + X[:, 1] > 0).long()
ds = TensorDataset(X, y)
tr, va = random_split(ds, [1600, 400], generator=torch.Generator().manual_seed(0))
tl, vl = DataLoader(tr, 64, shuffle=True), DataLoader(va, 256)

device = "cuda" if torch.cuda.is_available() else "cpu"
model = nn.Sequential(nn.Linear(10, 32), nn.ReLU(), nn.Linear(32, 2)).to(device)
opt = torch.optim.AdamW(model.parameters(), 1e-3, weight_decay=1e-2)
crit = nn.CrossEntropyLoss()

for ep in range(10):
    model.train()
    for xb, yb in tl:
        xb, yb = xb.to(device), yb.to(device)
        opt.zero_grad(); loss = crit(model(xb), yb); loss.backward(); opt.step()
    model.eval(); correct = 0
    with torch.no_grad():
        for xb, yb in vl:
            correct += (model(xb.to(device)).argmax(1).cpu() == yb).sum().item()
    print(ep, round(loss.item(), 4), correct / len(va))
```

### Task 2. Linear regression by hand with autograd
```python
w = torch.zeros(1, requires_grad=True); b = torch.zeros(1, requires_grad=True)
x = torch.linspace(0, 1, 100); y = 3 * x + 1 + 0.05 * torch.randn(100)
for _ in range(500):
    loss = ((w * x + b - y) ** 2).mean()
    loss.backward()
    with torch.no_grad():
        w -= 0.1 * w.grad; b -= 0.1 * b.grad
    w.grad.zero_(); b.grad.zero_()
```

### Task 3. CNN for CIFAR-10 style input
```python
class CNN(nn.Module):
    def __init__(self, c=10):
        super().__init__()
        def blk(i, o): return nn.Sequential(nn.Conv2d(i, o, 3, padding=1), nn.BatchNorm2d(o), nn.ReLU(), nn.MaxPool2d(2))
        self.f = nn.Sequential(blk(3, 32), blk(32, 64), blk(64, 128))
        self.h = nn.Sequential(nn.Flatten(), nn.Dropout(0.3), nn.Linear(128 * 4 * 4, c))
    def forward(self, x): return self.h(self.f(x))
```

### Task 4. Fine-tune ResNet with differential LRs and cosine schedule
```python
m = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
m.fc = nn.Linear(512, num_classes)
head = list(m.fc.parameters()); ids = {id(p) for p in head}
body = [p for p in m.parameters() if id(p) not in ids]
opt = torch.optim.AdamW([{"params": body, "lr": 1e-4}, {"params": head, "lr": 1e-3}], weight_decay=1e-2)
sched = torch.optim.lr_scheduler.OneCycleLR(opt, max_lr=[1e-4, 1e-3], total_steps=epochs * len(loader))
```

### Task 5. Complete AMP + accumulation + clipping + checkpoint step
```python
scaler = torch.amp.GradScaler("cuda"); accum = 4
for i, (x, y) in enumerate(loader):
    with torch.autocast("cuda", dtype=torch.float16):
        loss = crit(model(x.cuda(non_blocking=True)), y.cuda(non_blocking=True)) / accum
    scaler.scale(loss).backward()
    if (i + 1) % accum == 0:
        scaler.unscale_(opt)
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        scaler.step(opt); scaler.update(); opt.zero_grad(set_to_none=True); sched.step()
```

### Task 6. Feature extraction with a forward hook
```python
feats = {}
def hook(m, inp, out): feats["layer4"] = out.detach()
h = model.layer4.register_forward_hook(hook)
with torch.no_grad(): model(x)
h.remove()
```

### Task 7. Multi-head self-attention from scratch
```python
class MHA(nn.Module):
    def __init__(self, d, h):
        super().__init__(); self.h = h; self.qkv = nn.Linear(d, 3 * d); self.o = nn.Linear(d, d)
    def forward(self, x, causal=False):
        B, T, C = x.shape
        q, k, v = self.qkv(x).view(B, T, 3, self.h, C // self.h).permute(2, 0, 3, 1, 4)
        y = F.scaled_dot_product_attention(q, k, v, is_causal=causal)
        return self.o(y.transpose(1, 2).reshape(B, T, C))
```

### Task 8. DDP training script skeleton
```python
# torchrun --nproc_per_node=2 train.py
import os, torch, torch.distributed as dist
from torch.nn.parallel import DistributedDataParallel as DDP
dist.init_process_group("nccl"); local = int(os.environ["LOCAL_RANK"]); torch.cuda.set_device(local)
model = DDP(Net().cuda(local), device_ids=[local])
sampler = torch.utils.data.distributed.DistributedSampler(ds)
loader = DataLoader(ds, batch_size=64, sampler=sampler, num_workers=4, pin_memory=True)
for epoch in range(E):
    sampler.set_epoch(epoch)
    for x, y in loader: ...
    if dist.get_rank() == 0: torch.save(model.module.state_dict(), f"ckpt_{epoch}.pt")
dist.destroy_process_group()
```

### Task 9. Overfit-one-batch + gradient check utility
```python
def sanity(model, batch, crit, steps=200):
    x, y = batch; opt = torch.optim.Adam(model.parameters(), 1e-3)
    for s in range(steps):
        opt.zero_grad(); l = crit(model(x), y); l.backward(); opt.step()
    assert l.item() < 0.05, f"cannot overfit one batch: {l.item():.3f}"
    assert all(p.grad is not None for p in model.parameters() if p.requires_grad), "dead params"
```

### Task 10. Serve a model with FastAPI + `inference_mode`
```python
from fastapi import FastAPI
from pydantic import BaseModel
app = FastAPI()
model = Net(); model.load_state_dict(torch.load("model.pt", map_location="cpu", weights_only=True)); model.eval()

class Req(BaseModel): features: list[float]

@app.post("/predict")
def predict(r: Req):
    with torch.inference_mode():
        p = torch.softmax(model(torch.tensor([r.features])), dim=-1)[0]
    return {"class": int(p.argmax()), "prob": float(p.max())}
```

### Task 11. Benchmark with correct timing
```python
def bench(fn, n=50):
    for _ in range(5): fn()                      # warm-up
    torch.cuda.synchronize(); t = torch.cuda.Event(enable_timing=True); e = torch.cuda.Event(enable_timing=True)
    t.record()
    for _ in range(n): fn()
    e.record(); torch.cuda.synchronize()
    return t.elapsed_time(e) / n                 # ms per call
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. `RuntimeError: Expected all tensors to be on the same device`
Model on GPU, data on CPU (or mixed). Move both with `.to(device)`; check buffers/masks created inside `forward` use `x.device`.

### D2. `RuntimeError: CUDA out of memory`
Lower batch size, AMP, checkpointing, accumulation; remove stored graph references (`losses.append(loss)` → `loss.item()`); `torch.no_grad()` in eval; check for oversized sequences.

### D3. Loss is NaN
LR too high, bad inputs, `log(0)`, FP16 overflow, exploding gradients. Use anomaly detection once, clip gradients, check data, lower LR, use BF16.

### D4. Loss doesn't decrease
Missing `zero_grad` / `step`, optimiser created before moving model to GPU or with wrong params, labels wrong dtype/shape, softmax before `CrossEntropyLoss`, LR too low/high, model in eval mode with frozen params, data not shuffled.

### D5. `RuntimeError: Trying to backward through the graph a second time`
Reusing a graph (e.g., hidden state in RNN across batches). `detach()` hidden states between sequences, or use `retain_graph=True` only if intentional.

### D6. `one of the variables needed for gradient computation has been modified by an inplace operation`
An in-place op overwrote a value needed for backward. Replace `x += y` / `relu_` with out-of-place versions or `.clone()`.

### D7. `element 0 of tensors does not require grad`
The output isn't attached to a graph: you used `no_grad`, `.detach()`, `.item()`, converted to NumPy, or all params are frozen.

### D8. Accuracy fine in training loop but wrong in inference
Missing `model.eval()`, different normalisation, wrong class-index mapping, different tokenizer/preprocessing, BGR/RGB mixups, or loading the wrong checkpoint.

### D9. `Error(s) in loading state_dict: size mismatch / missing keys`
Architecture changed, `DataParallel`/`DDP` `module.` prefix, wrong num_classes. Strip prefix or load with `strict=False` and inspect keys.

### D10. DataLoader hangs or is slow on Windows/Notebooks
Multiprocessing requires `if __name__ == "__main__":` on Windows; use `num_workers=0` to debug; non-picklable objects in datasets; shared-memory limits in Docker (`--shm-size`).

### D11. DDP job hangs
Ranks run different code paths or numbers of batches (uneven data), missing `set_epoch`, unused parameters, mismatched collective calls, a rank crashed. Use `drop_last=True`, `TORCH_DISTRIBUTED_DEBUG=DETAIL`, `NCCL_DEBUG=INFO`, timeouts.

### D12. GPU utilisation low
Data loading, tiny batches, `.item()` per step, CPU preprocessing, Python overhead. Profile and fix the bottleneck; increase workers and batch size.

### D13. Results differ after `torch.compile`
Numerical differences from fusion, different precision, recompilation, or a real bug exposed by graph capture. Compare outputs with tolerances; bisect using `torch._dynamo.config` and `TORCH_LOGS`.

### D14. Model works on CPU but fails with MPS/other device
Unsupported ops on that backend. Set `PYTORCH_ENABLE_MPS_FALLBACK=1` (verify) or run on CPU/CUDA.

### D15. Memory grows each iteration (leak)
Accumulating tensors with graphs, hooks storing outputs, caching in Python lists, growing dynamic-shape caches. Detach and move logged values to CPU.

---

# 🧩 Part 8: Tricky Questions

### T1. `view` vs `reshape`: when does `view` fail?
On non-contiguous tensors (after `permute`/`transpose`) when the requested shape isn't compatible with the strides. `reshape` copies in that case.

### T2. Does `model.eval()` stop gradient computation?
No. It only changes layer behaviour (dropout, BN). Use `no_grad`/`inference_mode` to stop graph building.

### T3. Does `x.detach()` copy data?
No. It shares storage; in-place changes affect both. Use `.detach().clone()` for an independent copy.

### T4. Does `torch.tensor(x)` vs `torch.as_tensor(x)` vs `torch.from_numpy(x)` copy?
`torch.tensor` always copies; `as_tensor` avoids a copy when possible; `from_numpy` shares memory with the array.

### T5. Why does `loss.item()` in the loop slow training?
It forces a GPU→CPU sync each call. Log less frequently or accumulate on-device and sync occasionally.

### T6. Can you call `backward()` on a non-scalar?
Only with a `gradient` argument (the upstream vector) because gradients are defined for scalars; usually you reduce first (`.sum()`/`.mean()`).

### T7. Is `nn.CrossEntropyLoss` expecting one-hot labels?
No; class indices (long) by default. Probabilities are also allowed in recent versions (soft labels).

### T8. Why does `p.data` differ from `p.detach()`?
Both skip the graph, but `.data` bypasses autograd's version checks, so in-place edits can silently corrupt gradients. Prefer `.detach()` or `torch.no_grad()`.

### T9. Does `DataLoader(shuffle=True)` give the same order every run?
Not unless the global seed or the loader's `generator` is set. With workers, seed them with `worker_init_fn` for reproducible augmentation.

### T10. Is `DataParallel` the same as `DistributedDataParallel`?
No. DP is single-process, multi-thread, scatters the batch, replicates the model every iteration, and bottlenecks on GPU 0. DDP is multi-process, faster and the recommended approach.

### T11. Why is the first `torch.compile` step so slow?
Graph capture and kernel compilation happen on first execution (and again when shapes change). Cache artefacts and warm up before benchmarking.

### T12. Does `torch.save(model)` save the code?
It pickles the class by reference, not its source; loading requires the same module path. That's why `state_dict` is preferred.

### T13. Why `nn.ModuleList` instead of a list?
A plain list isn't registered, so its parameters won't be optimised, moved to GPU, or saved.

### T14. Is `autocast` changing the model's weights to FP16?
No; weights stay FP32. Ops cast to lower precision on the fly where safe; reductions and sensitive ops stay in FP32.

### T15. What does `requires_grad_(False)` on a BatchNorm layer do for running stats?
Nothing: running stats still update in `train()` mode. Call `.eval()` on the BN layer to freeze them.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- Tensor = array + dtype + device + autograd.
- `loss.backward()` computes grads; `optimizer.step()` updates weights.
- `zero_grad()` before backward each step.
- `model.train()` / `model.eval()` toggles dropout and BN behaviour.
- `no_grad` / `inference_mode` disable graph building.
- `CrossEntropyLoss` takes logits and class indices.
- `BCEWithLogitsLoss` for binary/multi-label logits.
- `view` needs contiguous; `reshape` is safe.
- `register_buffer` for non-learnable state.
- `ModuleList` registers sub-modules.
- `state_dict` for saving; `weights_only=True` for loading.
- `pin_memory=True` + `non_blocking=True` for fast H2D.
- `DistributedSampler.set_epoch` each epoch.
- DDP replicates; FSDP shards.
- `torch.compile` fuses ops; watch graph breaks.
- BF16 needs no GradScaler.
- `clip_grad_norm_` after backward, before step.
- `.item()` syncs GPU.
- Profile before optimising.
- Use SDPA for attention.
- Prefer safetensors for sharing weights.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about a PyTorch project you built or shipped
Cover problem and metric, data pipeline (`Dataset`/`DataLoader`), model choice (pre-trained vs scratch), training setup (AdamW, schedule, AMP), experiments and ablations, validation design, performance work (profiling, `torch.compile`, quantisation), deployment (ONNX/Triton/FastAPI), monitoring and impact. Include numbers: e.g., "Cut epoch time from 14 to 5 minutes by fixing data loading (workers, WebDataset) and BF16; accuracy 91.2% → 93.8%."

### P2. A hard-to-find PyTorch bug you fixed
Examples: forgotten `eval()`, in-place op breaking autograd, silent device-mismatch of a mask, DDP hang from uneven batches, memory leak from stored loss tensors. Explain symptoms, diagnostic steps, root cause, fix and guardrail (test or assertion).

### P3. How did you scale training to multiple GPUs?
Start with a single-GPU baseline and profile; move to DDP via `torchrun`; fix sampler/seeding; scale LR and warm-up; verify loss equivalence; evaluate scaling efficiency; use FSDP if memory-bound.

### P4. How did you move a model from research to production?
Refactor notebooks to modules, add tests, freeze preprocessing, export (ONNX/TorchScript), validate numerics, benchmark latency/throughput, add dynamic batching, canary release, monitoring and rollback.

### P5. How do you choose between PyTorch Lightning and a custom loop?
Lightning for standardisation, multi-GPU, logging and checkpointing across many projects; custom loops when you need unusual control flow (GANs, RL, research) or minimal dependencies. Document either way.

### P6. How do you keep experiments reproducible?
Seeds, pinned environments/containers, config files, tracked data versions, logged git SHA, deterministic flags where feasible, and multi-seed reporting.

### P7. How do you onboard teammates to the codebase?
README with quick start, template configs, a 5-minute smoke test, architecture diagram, coding standards, and common-pitfall guide.

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- Tensors: creation, dtype, device, shape ops, indexing, broadcasting, strides, views vs copies.
- Autograd: graphs, `backward`, `no_grad`, hooks, custom `Function`, higher-order gradients, `torch.func`.
- `torch.nn`: Module, layers, containers, losses, init, buffers/parameters.
- Optimisation: optimisers, schedulers, parameter groups, clipping, EMA/SWA.
- Data: Dataset, DataLoader, samplers, collate, iterable datasets, performance.
- Training utilities: AMP, accumulation, checkpoints, early stopping, logging.
- Performance: profiler, `torch.compile`, SDPA/Flash, CUDA graphs, channels-last, TF32.
- Distributed: DDP, FSDP, torchrun, DTensor/device mesh, elastic training.
- Deployment: ONNX, `torch.export`, quantisation, serving stacks, safe loading.
- Ecosystem: torchvision/audio/text, Lightning, Accelerate, Hugging Face, torchmetrics.
- Practices: testing, reproducibility, debugging, security, MLOps.

## Mixed topics
- AMP + gradient accumulation + clipping + schedulers (ordering).
- DDP + samplers + seeding + checkpointing.
- `torch.compile` + dynamic shapes + profiling.
- Export + quantisation + numerics validation.
- Memory: checkpointing + FSDP + 8-bit optimisers.
- Data pipeline throughput + GPU utilisation.

---

# 🔬 Part 12: Internals

### Eager mode and the dispatcher
Every op goes through the **dispatcher**, which selects a kernel by device, dtype, layout and active keys (autograd, autocast, vmap, functionalize, tracing). This layered design lets features compose.

### Autograd engine
A C++ engine runs backward on a multi-threaded queue (one thread per device). Nodes track `next_functions`; saved tensors are version-checked to detect illegal in-place modifications.

### Tensor storage and views
A `Tensor` object holds sizes, strides, offset and a pointer to `Storage`. Views share storage; a version counter on storage flags in-place mutation for autograd.

### Caching allocator
CUDA allocations are expensive, so PyTorch caches blocks by size classes and splits/merges them. Fragmentation can cause OOM despite free memory; expandable segments mitigate it.

### CUDA streams and asynchrony
Ops are enqueued on the current stream and return immediately. Synchronisation points: `.item()`, `.cpu()`, `cudaStreamSynchronize`, printing, `torch.cuda.synchronize()`. Non-blocking copies require pinned host memory.

### `torch.compile` pipeline
TorchDynamo (bytecode tracing → FX graph with guards) → AOTAutograd (joint forward/backward graph, functionalisation) → TorchInductor (fusion, scheduling, codegen to Triton/C++). Guards trigger recompilation if assumptions (shapes, dtypes, globals) change.

### DDP internals
Parameters are grouped into buckets (default 25 MB); autograd hooks mark gradients ready, triggering asynchronous all-reduce per bucket, overlapping with the remaining backward computation. Ranks must keep identical parameter order and collective call sequence.

### AMP internals
`autocast` maintains op lists: ops cast to low precision (matmul, conv), kept in FP32 (softmax, loss, norms), or promoted to the widest input type. `GradScaler` multiplies the loss by a scale factor, unscales gradients before the step, skips the step on inf/NaN and adjusts the scale dynamically.

### DataLoader multiprocessing
Worker processes fetch indices from an index queue, run `__getitem__` + `collate_fn`, and return batches through shared memory. The main process reorders them. `pin_memory` uses a thread to copy into page-locked memory.

### Serialization
`torch.save` uses a zip format with pickled metadata plus raw tensor storage files. `weights_only=True` restricts unpickling to safe types. Safetensors stores raw tensors with a JSON header and supports zero-copy memory mapping.

---

# 📊 Part 13: Reference Tables

### Tensor ops cheat table
| Task | API |
|---|---|
| Reshape | `view`, `reshape`, `flatten`, `unflatten` |
| Reorder dims | `permute`, `transpose`, `movedim` |
| Add/remove dim | `unsqueeze`, `squeeze` |
| Join | `cat`, `stack`, `hstack` |
| Split | `split`, `chunk`, `unbind` |
| Gather/scatter | `gather`, `scatter_`, `index_select`, `take_along_dim` |
| Reduction | `sum`, `mean`, `max`, `argmax`, `topk`, `cumsum` |
| Matmul | `@`, `matmul`, `bmm`, `einsum` |
| Conditional | `where`, `masked_fill`, `clamp` |

### Loss selection
| Problem | Loss | Output activation in model |
|---|---|---|
| Binary | `BCEWithLogitsLoss` | None |
| Multi-class | `CrossEntropyLoss` | None |
| Multi-label | `BCEWithLogitsLoss` | None |
| Regression | `MSELoss` / `SmoothL1Loss` | None / linear |
| Sequence labelling | `CrossEntropyLoss(ignore_index=pad)` | None |
| Embedding | `TripletMarginLoss`, custom InfoNCE | Normalised vectors |

### Device / precision matrix
| Setting | When |
|---|---|
| FP32 | Debugging, small models |
| TF32 matmul | Free speed-up on Ampere+ |
| FP16 + GradScaler | Older GPUs, memory savings |
| BF16 autocast | Preferred for training on Ampere+ |
| INT8/INT4 | Inference quantisation |

### Parallelism choice
| Situation | Use |
|---|---|
| Model fits on one GPU | DDP |
| Model/optimiser too big | FSDP / ZeRO |
| Huge layers, fast links | Tensor parallel |
| Very deep models | Pipeline parallel |
| Mixed needs | 2D/3D parallel with DeviceMesh |

### Serving options
| Tool | Strength |
|---|---|
| FastAPI + PyTorch | Simple, flexible |
| ONNX Runtime | Portable, CPU/GPU optimised |
| TensorRT | Max NVIDIA GPU performance |
| Triton | Multi-framework, dynamic batching |
| vLLM / TGI | LLM serving (paged attention, continuous batching) |
| ExecuTorch / TFLite / Core ML | Mobile / edge |

### Common errors → causes
| Error | Cause |
|---|---|
| Device mismatch | Tensors on different devices |
| Shape mismatch in `matmul` | Wrong `in_features` / dims |
| `Target out of bounds` | Labels ≥ `num_classes` or wrong dtype |
| Inplace modification | In-place op on a needed tensor |
| Backward twice | Graph freed; need `retain_graph` or `detach` |
| `CUDA out of memory` | Batch/seq too big, leaks |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
```python
x = torch.tensor([1., 2., 3.], requires_grad=True)
y = (x ** 2).sum()
y.backward()
print(x.grad)
```
**`tensor([2., 4., 6.])`**

### O2.
```python
a = torch.arange(6).reshape(2, 3)
print(a.shape, a.T.shape, a.T.is_contiguous())
```
**`torch.Size([2, 3]) torch.Size([3, 2]) False`**

### O3.
```python
a = torch.arange(4)
b = a[:2]
b[0] = 99
print(a)
```
**`tensor([99,  1,  2,  3])`** (slice is a view).

### O4.
```python
a = torch.arange(4)
b = a[[0, 1]]
b[0] = 99
print(a)
```
**`tensor([0, 1, 2, 3])`** (fancy indexing copies).

### O5.
```python
x = torch.ones(3, 1) + torch.ones(1, 4)
print(x.shape)
```
**`torch.Size([3, 4])`**

### O6.
```python
w = torch.tensor(1., requires_grad=True)
for _ in range(2):
    (w * 3).backward()
print(w.grad)
```
**`tensor(6.)`** (gradients accumulate).

### O7.
```python
x = torch.tensor([1., 2.], requires_grad=True)
with torch.no_grad():
    y = x * 2
print(y.requires_grad)
```
**`False`**

### O8.
```python
print(torch.tensor([1, 2, 3]).dtype, torch.tensor([1., 2.]).dtype)
```
**`torch.int64 torch.float32`**

### O9.
`nn.Linear(10, 5)` parameter count: `10·5 + 5` = **55**.

### O10.
`nn.Conv2d(3, 8, 3, padding=1)` on input `(1, 3, 32, 32)` gives output shape **`(1, 8, 32, 32)`**.

### O11.
```python
x = torch.arange(6.).view(2, 3)
print(x.sum(dim=1), x.sum(dim=1, keepdim=True).shape)
```
**`tensor([ 3., 12.])  torch.Size([2, 1])`**

### O12.
```python
loss = nn.CrossEntropyLoss()(torch.zeros(1, 4), torch.tensor([2]))
print(round(loss.item(), 4))
```
Uniform probabilities over 4 classes: `ln 4` = **1.3863**.

---

# ✅ Part 15: MCQs

**1. Which call clears accumulated gradients?**
A) `loss.zero()`  B) `optimizer.zero_grad()`  C) `model.reset()`  D) `torch.clear()`
**Answer: B**

**2. `CrossEntropyLoss` expects:**
A) Probabilities and one-hot labels only  B) Raw logits and class indices  C) Sigmoid outputs  D) Log-probabilities and floats
**Answer: B**

**3. Which disables dropout?**
A) `torch.no_grad()`  B) `model.eval()`  C) `detach()`  D) `requires_grad=False`
**Answer: B**

**4. A plain Python list of layers in a Module:**
A) Is registered automatically  B) Is not registered; use `ModuleList`  C) Is faster  D) Is saved twice
**Answer: B**

**5. Which creates a copy?**
A) `x[:2]`  B) `x.view(...)`  C) `x[[0, 1]]`  D) `x.T`
**Answer: C**

**6. `DistributedSampler.set_epoch` is needed to:**
A) Change GPU  B) Reshuffle differently every epoch  C) Save checkpoints  D) Enable AMP
**Answer: B**

**7. BF16 mixed precision usually does NOT need:**
A) Autocast  B) GradScaler  C) A GPU  D) A loss
**Answer: B**

**8. Why avoid `.item()` inside tight loops on GPU?**
A) It frees memory  B) It forces synchronisation  C) It breaks autograd permanently  D) It changes dtype
**Answer: B**

**9. Recommended way to save a model for later use:**
A) `pickle.dump(model)`  B) `torch.save(model.state_dict())`  C) Screenshot  D) `print(model)`
**Answer: B**

**10. `register_buffer` is used for:**
A) Learnable weights  B) Non-learnable tensors that should be saved and moved with the module  C) Optimiser state  D) Hooks
**Answer: B**

**11. Which is the best option to accelerate attention in PyTorch 2.x?**
A) Manual softmax loops  B) `F.scaled_dot_product_attention`  C) `numpy`  D) `torch.save`
**Answer: B**

**12. `torch.compile` primarily provides:**
A) Model export to a file  B) JIT graph capture and kernel fusion for speed  C) Distributed training  D) Quantisation
**Answer: B**

**13. For unavoidable `loss.backward()` twice on the same graph you need:**
A) `retain_graph=True`  B) `zero_grad`  C) `eval()`  D) `pin_memory`
**Answer: A**

**14. FSDP differs from DDP in that it:**
A) Replicates the full model  B) Shards parameters, gradients and optimiser states  C) Only works on CPU  D) Disables communication
**Answer: B**

**15. Which tool measures kernel-level performance?**
A) `torch.profiler`  B) `torch.hub`  C) `torchtext`  D) `torch.jit.save`
**Answer: A**

**16. Loading untrusted `.pt` files with default pickle is risky because:**
A) Files are large  B) Pickle can execute arbitrary code  C) CUDA fails  D) It is slow
**Answer: B**

**17. `BatchNorm` running statistics update during:**
A) `eval()` only  B) `train()` forward passes  C) `torch.save`  D) `backward()` only
**Answer: B**

**18. Best first debugging step for a model that doesn't learn:**
A) Add layers  B) Overfit one small batch  C) Use a bigger GPU  D) Remove validation
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

- Forgetting `model.eval()` and `no_grad()` at inference.
- Forgetting `optimizer.zero_grad()` or calling it after `step()` in the wrong order.
- Applying softmax/sigmoid before `CrossEntropyLoss` / `BCEWithLogitsLoss`.
- Using a plain Python list/dict for submodules.
- Creating tensors inside `forward` on the default device instead of `x.device`.
- Storing `loss` (with graph) in lists instead of `loss.item()` / `.detach()`.
- Using `.data` instead of `.detach()` or `no_grad`.
- Saving the whole model with pickle instead of `state_dict`.
- Not setting `sampler.set_epoch()` in DDP; saving checkpoints from every rank.
- Scaling LR wrongly when changing global batch size.
- Mismatch of preprocessing between training and inference.
- Benchmarking GPU code without `synchronize()` or warm-up.
- Using `num_workers=0` in production training; or too many workers causing RAM pressure.
- Loading untrusted checkpoints with default pickle.
- Comparing `torch.compile` speed without excluding compile time.
- Calling `scheduler.step()` before `optimizer.step()`.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You know exactly where gradients, devices, dtypes and shapes live, and debug with assertions and small experiments.
- You do **overfit-one-batch**, gradient-norm checks and profiler runs before blaming the model.
- You understand sync points and the data pipeline as performance factors.
- You pick DDP/FSDP, BF16, checkpointing and `torch.compile` based on measurements, not folklore.
- You write resumable, seed-aware training code with atomic checkpoints and rank-0 logging.
- You separate model code from training/IO code, add tests, and pin environments.
- You treat model files as untrusted input (`weights_only`, safetensors).
- You can export, quantise and serve models while validating numerics and latency.
- You communicate trade-offs (speed, memory, accuracy, maintenance) clearly.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Training loop template
```python
model.train()
for x, y in loader:
    x, y = x.to(dev, non_blocking=True), y.to(dev, non_blocking=True)
    opt.zero_grad(set_to_none=True)
    with torch.autocast("cuda", dtype=torch.bfloat16):
        loss = crit(model(x), y)
    loss.backward()
    torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
    opt.step(); sched.step()
```

### Eval template
```python
model.eval()
with torch.inference_mode():
    for x, y in val_loader: preds = model(x.to(dev)).argmax(1)
```

### Quick API reminders
```python
torch.manual_seed(0)                       # seed
t.to(device, dtype)                        # move/cast
model.load_state_dict(sd, strict=True)     # load
torch.save({"model": model.state_dict(), "opt": opt.state_dict()}, "ckpt.pt")
torch.compile(model)                       # speed
F.scaled_dot_product_attention(q, k, v, is_causal=True)
torchrun --nproc_per_node=N train.py       # DDP launch
```

### Debug checklist
Shapes/dtypes/devices → labels range → `train/eval` → zero_grad/step order → LR → NaN check → overfit one batch → gradient norms → profiler → compare with reference.

### Performance checklist
DataLoader (workers, pin, prefetch) → BF16 → `torch.compile` → SDPA → larger batch/accumulation → channels-last (CNN) → remove syncs → DDP/FSDP → profile again.

### Final checklist before the interview
- [ ] Explain tensors, views vs copies, broadcasting, strides, contiguity.
- [ ] Explain autograd: graph, `backward`, `no_grad`, `detach`, accumulation, hooks.
- [ ] Write `nn.Module`, `Dataset`, `DataLoader` and a complete training/eval loop from memory.
- [ ] Know loss/logit conventions, schedulers, parameter groups, clipping, AMP ordering.
- [ ] Save/load/resume checkpoints correctly and safely.
- [ ] Explain DDP vs FSDP, `torchrun`, samplers, rank-0 logging.
- [ ] Use profiler, `torch.compile`, SDPA, gradient checkpointing, mixed precision.
- [ ] Export (ONNX), quantise, serve; validate numerics and latency.
- [ ] Debug device/shape errors, NaN loss, OOM, hangs, low GPU utilisation.
- [ ] Prepare a project story: baseline, experiments, performance work, deployment, numbers.
