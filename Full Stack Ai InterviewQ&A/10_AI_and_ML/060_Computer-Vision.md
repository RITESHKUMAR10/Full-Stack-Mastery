# Computer Vision Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **Python 3.11+, OpenCV 4.x, Pillow 10+, PyTorch 2.x + torchvision 0.18+, timm 1.x, Albumentations 1.4+, Ultralytics YOLO (v8 / 11), Hugging Face Transformers, ONNX Runtime, TensorRT**, with notes on foundation models (CLIP, SAM / SAM 2, DINOv2, vision-language models, diffusion). Model names, benchmark leaders and library APIs change quickly: anything marked "verify" should be checked in the official docs (docs.opencv.org, pytorch.org/vision, docs.ultralytics.com, huggingface.co/docs). Examples use the sample name **Ritesh Kumar** and small retail / document / defect-inspection style images.
> This file covers image basics (pixels, channels, colour spaces), classical image processing (filters, edges, morphology, thresholding, contours, features such as SIFT/ORB), geometry and camera models, CNN fundamentals and architectures (LeNet → ResNet → EfficientNet → ConvNeXt), Vision Transformers, transfer learning, augmentation, image classification, object detection (R-CNN family, YOLO, SSD, DETR), segmentation (semantic / instance / panoptic, U-Net, Mask R-CNN, SAM), keypoints and pose, tracking, OCR and document AI, face recognition, video, 3D vision, generative vision (GAN, diffusion), self-supervised and multimodal models, evaluation metrics (IoU, mAP, Dice), data labelling, deployment (ONNX, TensorRT, edge), monitoring, and responsible use. Related topics: deep learning in `057_Deep-Learning.md`, PyTorch in `058_PyTorch.md`, machine learning in `056_Machine-Learning.md`, NumPy in `055_Pandas-and-NumPy.md`, NLP in `059_NLP.md`, Hugging Face in `062_Hugging-Face.md`, multimodal AI in `../11_Generative_AI/071_Multimodal-AI.md`, MLOps in `074_MLOps.md`, serving in `../11_Generative_AI/073_Model-Serving-and-Inference.md`, Docker in `../07_DevOps_and_Cloud/045_Docker.md`.

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

### Q1. What is computer vision? *(Must-know)*
Computer vision (CV) is the field of enabling machines to **extract meaning from images and video**: recognising objects, locating them, segmenting regions, reading text, tracking motion, estimating depth or pose. It combines image processing, geometry, machine learning and, today, mostly deep learning.

### Q2. What is a digital image? *(Must-know)*
A grid of **pixels**. A grayscale image is a 2-D array `H×W` (0–255 for 8-bit). A colour image has channels: `H×W×3` (RGB). In NumPy/OpenCV the shape is `(H, W, C)`; in PyTorch tensors it is `(C, H, W)` (and `(N, C, H, W)` for batches).

### Q3. RGB vs BGR gotcha *(Must-know)*
OpenCV loads images as **BGR**, while Pillow, matplotlib and most deep-learning models expect **RGB**. Forgetting to convert silently hurts accuracy.
```python
import cv2
img = cv2.imread("a.jpg")                    # BGR, uint8
rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
```

### Q4. Common colour spaces
| Space | Use |
|---|---|
| RGB/BGR | Display, model input |
| Grayscale | Edges, classical algorithms, OCR preprocessing |
| HSV/HSL | Colour-based segmentation (hue is lighting-robust) |
| LAB | Perceptual colour difference, CLAHE contrast |
| YCrCb | Skin detection, JPEG compression |

### Q5. Image resolution, bit depth, aspect ratio
Resolution = width × height. Bit depth = bits per channel (8, 16). Aspect ratio = W/H; resizing without preserving it distorts objects (use letterboxing / padding for detectors).

### Q6. Image classification vs detection vs segmentation *(Must-know)*
| Task | Output |
|---|---|
| Classification | One label for the whole image |
| Detection | Boxes + class + score per object |
| Semantic segmentation | Class per pixel |
| Instance segmentation | Separate mask per object instance |
| Panoptic segmentation | Semantic + instance together |
| Keypoint / pose | Landmark coordinates |

### Q7. Basic OpenCV operations
```python
img = cv2.imread("a.jpg")
h, w = img.shape[:2]
small = cv2.resize(img, (w // 2, h // 2), interpolation=cv2.INTER_AREA)
crop = img[50:200, 100:300]
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
cv2.imwrite("out.png", gray)
```
Use `INTER_AREA` for shrinking and `INTER_LINEAR`/`INTER_CUBIC` for enlarging.

### Q8. Image filtering (blur and sharpen)
Convolution with a kernel. Box/Gaussian blur reduce noise; median blur removes salt-and-pepper noise; unsharp masking sharpens.
```python
blur = cv2.GaussianBlur(img, (5, 5), 0)
med = cv2.medianBlur(img, 5)
```

### Q9. Edge detection (Sobel, Canny)
Edges are strong intensity gradients. **Canny**: Gaussian blur → gradient → non-maximum suppression → double threshold → hysteresis.
```python
edges = cv2.Canny(gray, 100, 200)
```

### Q10. Thresholding
Convert grayscale to binary. Global (`cv2.threshold`), **Otsu** (automatic threshold from histogram), **adaptive** (local threshold; good for uneven lighting, documents).

### Q11. Morphological operations
Erosion (shrinks white regions), dilation (grows), opening (erode→dilate: removes specks), closing (dilate→erode: fills holes), gradient, top-hat. Used to clean binary masks.

### Q12. Contours
Boundaries of connected regions: `cv2.findContours`, then `contourArea`, `boundingRect`, `approxPolyDP`. Classic pipeline: threshold → clean → contours → filter by area/shape.

### Q13. Histogram and histogram equalisation
A histogram counts pixel intensities. Equalisation spreads them to improve contrast; **CLAHE** does it locally with a clip limit to avoid noise amplification.

### Q14. Image features: corners, SIFT, ORB
Corners (Harris, Shi-Tomasi) are stable points; SIFT/SURF-style descriptors are scale/rotation invariant; **ORB** is fast and free. Used for stitching, matching, tracking and SLAM before deep learning.

### Q15. What is a CNN? *(Must-know)*
A neural network using **convolutions**: small learnable filters slide over the image sharing weights, producing feature maps. Early layers learn edges/textures; deeper layers learn parts and objects. Benefits: far fewer parameters than dense layers, spatial locality, translation equivariance.

### Q16. Convolution parameters
Kernel size, **stride**, **padding**, dilation, groups, channels. Output size = `⌊(N + 2P − K)/S⌋ + 1`. Parameters of a conv layer = `K·K·C_in·C_out + C_out`.

### Q17. Pooling
Max or average pooling downsamples (e.g., 2×2, stride 2), reducing computation and giving small translation invariance. Global average pooling replaces large dense layers at the end of modern CNNs.

### Q18. Famous CNNs in one line each
LeNet (digits) → AlexNet (ReLU, GPUs, 2012) → VGG (stacked 3×3) → GoogLeNet/Inception (multi-scale) → **ResNet** (skip connections) → DenseNet → MobileNet (depthwise separable) → EfficientNet (compound scaling) → ConvNeXt (modernised CNN).

### Q19. Why ResNet works
Skip connections `y = F(x) + x` give gradients a shortcut path, solving the degradation problem and letting networks reach 50–1000 layers.

### Q20. Transfer learning *(Must-know)*
Start from a model pre-trained on ImageNet/larger data, replace the head, and fine-tune. Freeze early layers, train the head first, then unfreeze gradually with a lower LR. Works well with small datasets.
```python
from torchvision import models
m = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
m.fc = nn.Linear(m.fc.in_features, num_classes)
```

### Q21. Data augmentation
Random crop, flip, rotation, colour jitter, blur, cutout, Mixup/CutMix, RandAugment. Augment **only the training set**, keep label-preserving transforms (don't flip digits or text), and for detection/segmentation transform boxes/masks together.

### Q22. Normalisation of inputs
Scale to [0,1] and normalise with the mean/std used in pre-training (ImageNet: mean `[0.485, 0.456, 0.406]`, std `[0.229, 0.224, 0.225]`). A mismatch between training and inference preprocessing is a classic bug.

### Q23. Overfitting in image models
Train accuracy ≫ validation accuracy. Fixes: more data, stronger augmentation, regularisation (dropout, weight decay), smaller model, transfer learning, early stopping.

### Q24. Evaluation metrics for classification
Accuracy, precision, recall, F1, top-k accuracy, confusion matrix, ROC-AUC. For imbalanced data prefer per-class metrics.

### Q25. IoU (Intersection over Union) *(Must-know)*
`IoU = area(A ∩ B) / area(A ∪ B)`. Used to match predicted vs ground-truth boxes/masks. Typical match thresholds: 0.5 (PASCAL), 0.5:0.95 (COCO).

### Q26. What is object detection? *(Must-know)*
Finding objects in an image and predicting a bounding box, class and confidence for each. Families: two-stage (R-CNN → Fast → Faster R-CNN), one-stage (YOLO, SSD, RetinaNet), and Transformer-based (DETR, RT-DETR).

### Q27. Non-Max Suppression (NMS)
Detectors produce many overlapping boxes. NMS keeps the highest-score box and removes others with IoU above a threshold with it (per class). Variants: Soft-NMS, DIoU-NMS; NMS-free designs exist (DETR, YOLOv10).

### Q28. Anchor boxes
Predefined box shapes/scales placed at each location; the network predicts offsets and class scores. Anchor-free detectors (FCOS, CenterNet, YOLOv8+) predict directly from points, simplifying tuning.

### Q29. YOLO in brief
"You Only Look Once": a single-pass detector predicting boxes and classes on a grid at multiple scales. Very fast, good for real-time; modern versions are anchor-free with decoupled heads.
```python
from ultralytics import YOLO
model = YOLO("yolov8n.pt")
res = model("street.jpg", conf=0.25)
```

### Q30. mAP (mean Average Precision) *(Must-know)*
For each class: rank detections by confidence, compute precision-recall curve, and take the area under it (AP) at an IoU threshold. mAP is the mean over classes (and over IoU thresholds 0.5:0.95 for COCO mAP).

---

# 🔵 Part 2: Junior (1–3 years)

### Q31. Semantic vs instance segmentation *(Must-know)*
Semantic: every pixel gets a class (all "person" pixels share a label). Instance: separate masks for each object (person #1, #2). Panoptic: both for "things" and "stuff".

### Q32. U-Net
Encoder–decoder with **skip connections** that concatenate encoder features into the decoder, preserving spatial detail. Excellent for medical and small-dataset segmentation. Loss: cross-entropy + Dice.

### Q33. Segmentation metrics
Pixel accuracy (misleading with imbalance), **mIoU**, **Dice/F1**, boundary F-score. Dice = `2|A∩B| / (|A|+|B|)`.

### Q34. Dice loss and class imbalance
Foreground pixels are often a tiny fraction. Use Dice, Focal, Tversky or weighted cross-entropy (often combined) so the model doesn't predict all background.

### Q35. Mask R-CNN
Faster R-CNN plus a mask branch: backbone + FPN → RPN proposals → RoIAlign → heads for class, box and mask. RoIAlign (bilinear sampling) fixes the misalignment of RoIPool.

### Q36. Feature Pyramid Network (FPN)
Builds multi-scale feature maps via a top-down path with lateral connections so small objects use high-resolution features and large objects use semantic deep features.

### Q37. One-stage vs two-stage detectors
| | Two-stage (Faster R-CNN) | One-stage (YOLO/SSD/RetinaNet) |
|---|---|---|
| Speed | Slower | Faster, real-time |
| Accuracy | Historically higher, esp. small objects | Now comparable |
| Pipeline | Proposals → refine | Direct dense prediction |
| Class imbalance | Handled by sampling | Focal loss / assignment strategies |

### Q38. Focal loss
`FL = −α(1−p_t)^γ log(p_t)` down-weights easy examples so the many easy background anchors don't dominate (RetinaNet).

### Q39. Box regression losses
Smooth L1, IoU, GIoU, DIoU, **CIoU** (adds overlap, centre distance and aspect ratio), improving convergence over plain L1/L2.

### Q40. Handling small objects
Higher input resolution, FPN / multi-scale heads, tiling (SAHI), less aggressive downsampling, tailored anchors/assignments, augmentation (copy-paste, mosaic) and good labels.

### Q41. Data labelling formats
YOLO (txt: class cx cy w h, normalised), COCO (JSON: images, annotations, categories; boxes `x,y,w,h` in pixels), Pascal VOC (XML: xmin,ymin,xmax,ymax). Check coordinate conventions when converting.

### Q42. Labelling tools and QA
CVAT, Label Studio, Roboflow, V7. Define class guidelines, handle occlusion/truncation rules, double-label a subset, measure agreement (IoU between annotators), and audit errors with model-assisted review.

### Q43. Train/val/test splits for images
Split by **scene/video/patient/site**, not by frame, to avoid near-duplicate leakage. Keep class distribution and difficult conditions represented in the test set.

### Q44. Image classification training recipe
Pre-trained backbone, label smoothing, AdamW or SGD+momentum, cosine schedule with warm-up, RandAugment/Mixup, BF16/AMP, EMA weights, test-time augmentation optional.

### Q45. Learning-rate tips for fine-tuning
Use smaller LR for the backbone than the head (e.g., 1e-5 vs 1e-3), freeze BN statistics for tiny batches, and unfreeze progressively.

### Q46. Class imbalance in vision
Weighted loss, focal loss, balanced sampling, targeted augmentation, synthetic data, and threshold tuning per class. Evaluate with per-class AP/recall.

### Q47. Optical character recognition (OCR) basics
Pipeline: detect text regions (DBNet, EAST) → recognise text (CRNN + CTC, Transformer-based TrOCR) → post-process (language models, dictionaries). Tools: Tesseract, EasyOCR, PaddleOCR, cloud OCR APIs.

### Q48. Document preprocessing for OCR
Deskew, denoise, binarise (adaptive threshold), remove borders/shadows, upscale low-DPI scans (≥300 DPI), correct perspective. Good preprocessing often matters more than the OCR engine.

### Q49. Face detection vs recognition vs verification
Detection: find faces. Recognition (identification): who is it among N? Verification: are these two faces the same person? Embeddings from ArcFace/FaceNet with cosine distance enable both. Needs strong privacy/consent/bias governance.

### Q50. Image similarity and retrieval
Compute embeddings (ResNet/CLIP/DINOv2) and search with cosine similarity or a vector index (FAISS). Add re-ranking and metadata filters for production search.

### Q51. Image hashing and duplicates
Perceptual hashes (pHash, dHash) detect near-duplicates cheaply; embeddings detect semantic duplicates. Deduplicate before splitting data.

### Q52. Optical flow and motion
Dense optical flow (Farneback, RAFT) estimates per-pixel motion between frames; used for tracking, stabilisation, action recognition.

### Q53. Object tracking
Tracking-by-detection: detector per frame + association via Kalman filter and Hungarian matching (SORT), appearance embeddings (DeepSORT), ByteTrack (uses low-score boxes). Metrics: MOTA, IDF1, HOTA.

### Q54. Pose estimation
Predict keypoints (joints). Top-down (detect person then keypoints: HRNet, ViTPose) vs bottom-up (OpenPose, groups keypoints). Applications: fitness, sports, ergonomics, AR.

### Q55. Video basics
A video is a sequence of frames with temporal redundancy. Models: 3D CNNs (I3D), two-stream, video Transformers (TimeSformer, VideoMAE). Practical systems sample frames, use clip-level features and temporal smoothing.

### Q56. Camera basics
Pinhole model: `x = K[R|t]X`. Intrinsics `K` (focal length, principal point), extrinsics `[R|t]`, distortion coefficients. Calibration with a chessboard (`cv2.calibrateCamera`) removes lens distortion.

### Q57. Homography and image stitching
A 3×3 matrix mapping points between two planes (`cv2.findHomography` with RANSAC). Panorama pipeline: detect features → match → RANSAC homography → warp → blend.

### Q58. RANSAC
Random Sample Consensus: repeatedly fit a model to a minimal random subset, count inliers, keep the best. Robust to outliers in matching, homography and plane fitting.

### Q59. Model input size and aspect ratio
Models are trained at fixed sizes (e.g., 224, 640). Use letterbox padding for detectors and the same resize/crop policy as training. Larger inputs help small objects but increase latency quadratically.

### Q60. Visualisation and debugging
Always visualise inputs after preprocessing/augmentation, overlay predictions/ground truth, view worst-loss samples, confusion matrices, and Grad-CAM to see where the model looks.

---

# 🟡 Part 3: Mid (3–5 years)

### Q61. Vision Transformer (ViT) *(Must-know)*
Split an image into patches (16×16), linearly embed, add position embeddings and a class token, then run a Transformer encoder. Strong with large-scale pre-training; lacks CNN inductive bias, so small-data training needs augmentation/distillation. Variants: DeiT, Swin (shifted windows, hierarchical), MaxViT, EVA.

### Q62. CNN vs ViT: when to use which
CNNs: efficient, strong with small/medium data, good on edge hardware, easier to tune. ViTs: better scaling with data/compute, strong transfer and multimodal integration. Hybrid designs and modern ConvNeXt narrow the gap. Choose by data size, latency and hardware.

### Q63. Self-supervised learning for vision
Learn representations without labels: contrastive (SimCLR, MoCo), self-distillation (BYOL, DINO/DINOv2), masked image modelling (MAE, BEiT). Excellent for domains with plentiful unlabelled images (medical, industrial).

### Q64. CLIP and zero-shot recognition *(Must-know)*
Trains an image encoder and text encoder with a contrastive loss on image–caption pairs. Zero-shot classification: embed prompts like "a photo of a {class}" and pick the highest cosine similarity. Used for search, filtering, labelling and as a vision backbone for multimodal LLMs.

### Q65. Segment Anything (SAM / SAM 2)
A promptable segmentation foundation model: points, boxes or masks as prompts produce masks. Great for fast labelling and zero-shot segmentation; SAM 2 extends to video. Needs domain checks for fine structures and specialised imagery.

### Q66. Detection Transformers (DETR, RT-DETR)
Treat detection as set prediction: object queries attend to image features, Hungarian matching assigns predictions to ground truth, so no NMS or anchors. Original DETR converges slowly; Deformable DETR, DINO-DETR and RT-DETR fix speed/quality.

### Q67. Label assignment strategies
How detectors decide which predictions are positives: IoU thresholds (Faster R-CNN), ATSS, SimOTA / TAL (YOLOX/YOLOv8, dynamic top-k by cost), Hungarian matching (DETR). Assignment quality strongly affects accuracy.

### Q68. Anchor-free detection (FCOS, CenterNet)
Predict object centres/distances per location, simplifying hyper-parameters. Heatmap-based centre detection avoids NMS in some designs.

### Q69. Test-time augmentation and ensembling
Predict on flips/scales and merge (average logits, WBF for boxes). Gains +0.5–2% mAP/accuracy at higher latency; use for offline or high-stakes inference.

### Q70. Multi-scale training and inference
Randomly vary input sizes during training to improve robustness; at inference use a single scale for speed or multi-scale for accuracy.

### Q71. Handling domain shift
Lighting, camera model, geography, season, weather. Mitigate with diverse data collection, strong augmentation, domain adaptation / style transfer, test-time adaptation, per-site calibration, and monitoring.

### Q72. Synthetic data for vision
Simulated renders (Unity/Unreal/Blender/Isaac Sim), diffusion-generated images, copy-paste augmentation. Improves rare cases; close the sim-to-real gap with domain randomisation and real-data fine-tuning; validate on real test sets only.

### Q73. Active learning and data-centric workflow
Train → find failures (low-confidence, disagreement, drift) → label the most informative samples → retrain. Often beats architecture tinkering. Track data versions and per-slice metrics.

### Q74. Label noise in detection/segmentation
Missing boxes, loose boxes, inconsistent classes. Detect with model-vs-label disagreement review, consensus labelling, and cleaning tools (FiftyOne, cleanlab). Better labels often yield bigger gains than bigger models.

### Q75. Evaluation beyond mAP
Per-class AP, small/medium/large AP, PR curves at your operating threshold, recall at fixed precision, false positives per image, confusion between classes, latency, and cost of errors. Report slice metrics (lighting, camera, region).

### Q76. Calibrating thresholds
Choose confidence and NMS thresholds per class on a validation set using PR curves and business costs (miss vs false alarm). Re-tune after model or data changes.

### Q77. Grad-CAM and explanation
Grad-CAM weights the last conv feature maps by gradients of a class score to show salient regions. Good for debugging spurious cues (watermarks, backgrounds); not proof of causal reasoning.

### Q78. Shortcut learning
Models exploit background, watermark, scanner type or text overlay correlated with labels. Detect with Grad-CAM, counterfactual tests, group-wise evaluation; mitigate with balanced data, masking, augmentation, and invariance training.

### Q79. Robustness and corruptions
Test with noise, blur, JPEG, brightness, weather (ImageNet-C style). Improve with augmentation (AugMix), larger pre-training, adversarial training and ensembling.

### Q80. Adversarial examples in vision
Small perturbations or physical patches fool models. Defences: adversarial training, input preprocessing, ensembles, detection of anomalies; for safety-critical systems add redundancy (multi-sensor, rules).

### Q81. Depth estimation
Stereo (disparity), monocular deep models (MiDaS, Depth Anything), LiDAR / ToF sensors. Monocular depth is relative unless calibrated; used in robotics, AR and autonomous driving.

### Q82. 3D vision basics
Point clouds (PointNet, PointNet++), voxels, meshes, multi-view geometry, NeRF and 3D Gaussian Splatting for novel view synthesis, SLAM for mapping and localisation.

### Q83. Image generation overview
GANs (fast sampling, unstable training), VAEs (blurry but stable latent space), **diffusion models** (state of the art quality; iterative denoising), latent diffusion (Stable Diffusion) with text conditioning and ControlNet/LoRA customisation. Evaluate with FID, CLIP score and human preference.

### Q84. Image-to-image tasks
Super-resolution (ESRGAN, SwinIR), denoising, inpainting, style transfer, colourisation, deblurring. Metrics: PSNR/SSIM (pixel fidelity), LPIPS (perceptual), human studies.

### Q85. Medical imaging considerations
DICOM handling, windowing (HU), 3D volumes, strong class imbalance, patient-level splits, calibration, explainability, regulatory approval (FDA/CE/CDSCO), and clinician-in-the-loop validation.

### Q86. Document AI
OCR + layout understanding (LayoutLMv3, Donut, Pix2Struct, vision-language models) to extract key-value pairs, tables and structure from invoices, IDs, forms. Validate with field-level accuracy and business rules (checksum, regex).

### Q87. Video understanding in production
Frame sampling strategies, decoding cost (use GPU decode / NVDEC), temporal smoothing, event logic (zones, dwell time), tracker re-identification, and streaming pipelines (DeepStream, GStreamer, RTSP).

### Q88. Vision-language models (VLMs)
Image encoder + projector + LLM (LLaVA, Qwen-VL, PaliGemma, GPT-4-class, Claude vision models): image captioning, VQA, OCR-free document reading, UI understanding. Strengths: flexibility. Risks: hallucination, spatial/counting errors, cost and latency. See `../11_Generative_AI/071_Multimodal-AI.md`.

### Q89. When to use a VLM vs a classic detector
Classic fine-tuned detectors/classifiers: high-volume, low-latency, narrow tasks with stable accuracy. VLMs: open-vocabulary, low-volume, complex reasoning, rapid prototyping, or labelling assistance. Hybrids: VLM for auto-labelling → distil into a small model.

### Q90. Open-vocabulary detection
Grounding DINO, OWL-ViT, YOLO-World detect objects from text prompts without class-specific training; good for bootstrapping labels. Verify accuracy per domain before deployment.

---

# 🟠 Part 4: Senior (5–7 years)

### Q91. Designing an end-to-end vision system *(Must-know)*
Requirements (what decision, error costs, latency, hardware, privacy) → data collection plan covering conditions → labelling guidelines & QA → baseline (pre-trained model) → experiments with slice-based evaluation → optimisation (quantise, TensorRT) → edge/cloud deployment → monitoring with drift detection and human review → retraining loop. Define acceptance tests on real-world data before launch.

### Q92. Defect-inspection design example
Fixed camera & lighting (the biggest win), calibrated images, anomaly detection (PatchCore, autoencoders) when defects are rare + supervised detector for known defects, high-res tiling, operator feedback UI, PLC integration, false-reject cost analysis, and nightly retraining on corrected labels.

### Q93. Retail/people-counting design example
Detector + tracker, zone/line crossing logic, ID switches handling, privacy (blur faces, edge processing, no raw video storage), camera placement/calibration, accuracy validated against manual counts per store, and drift alerts.

### Q94. Edge deployment constraints
Memory, power, thermals, INT8 support, camera ISP, model update mechanism. Choose efficient backbones (MobileNet, EfficientNet-Lite, YOLO-n/s), quantise with calibration data, use TensorRT / OpenVINO / TFLite / CoreML / NPUs, benchmark on device, and handle offline operation.

### Q95. Quantisation for vision
PTQ with a representative calibration set; QAT if accuracy drops. Detection heads and depthwise convs are sensitive; keep sensitive layers in FP16, compare per-class AP before/after, and test on real device kernels.

### Q96. TensorRT / ONNX workflow
Export to ONNX (opset, dynamic axes) → validate numerics → build TensorRT engine (FP16/INT8, optimisation profiles, workspace) → integrate NMS/pre/post-processing on GPU → benchmark latency/throughput; engines are tied to GPU architecture and TensorRT version.

### Q97. Latency budgeting
Break down camera capture, decode, resize, preprocess, inference, NMS, tracking, post-processing, network. Optimise the biggest slice first; use pinned memory, GPU preprocessing (DALI/NVJPEG/CV-CUDA), batching, async pipelines and zero-copy buffers.

### Q98. Throughput scaling for many cameras
Batch frames across streams, share GPU inference servers (Triton), frame skipping/adaptive FPS, motion-triggered inference, hardware decoders, and tiered models (cheap filter → heavy verification).

### Q99. Monitoring CV in production
Track input stats (brightness, blur, resolution, camera health), prediction distribution, confidence histograms, class frequency, embedding drift, tracker stability, latency, GPU health, and human-audited sample accuracy. Automatically capture low-confidence/novel samples for labelling.

### Q100. Data versioning and reproducibility
Dataset versions with hashes (DVC / lakeFS / FiftyOne), fixed splits by scene, recorded augmentation configs and seeds, model cards with data provenance, and experiment tracking (MLflow / W&B).

### Q101. Handling privacy and compliance
Faces/plates are PII. Options: on-device processing, blurring, short retention, consent and signage, access control, DPIA, data minimisation. Verify regulations (GDPR, India's DPDP Act, local CCTV laws) with counsel.

### Q102. Bias and fairness in vision
Skin-tone and demographic performance gaps (face recognition, pose, medical imaging), geographic bias in datasets. Measure disaggregated metrics, collect representative data, set deployment guardrails, and avoid high-stakes use without evaluation and human oversight.

### Q103. Robust training for varied environments
Collect across times/weather/devices, use heavy photometric & geometric augmentation, domain randomisation, test on held-out sites, and use per-site calibration/fine-tuning where feasible.

### Q104. Anomaly detection in images
Unsupervised: autoencoders (reconstruction error), memory-bank methods (PatchCore, PaDiM), flow-based, student-teacher. Pros: only normal data needed. Cons: threshold selection, false alarms with natural variation; add localisation maps for operators.

### Q105. Few-shot and zero-shot strategies
Prototype networks, CLIP/DINOv2 embeddings + kNN/linear probe, SAM for masks, VLM-assisted labelling, then fine-tune a small model once enough data accrues.

### Q106. Distillation for vision
Teach a small student with soft labels/features from a large teacher or foundation model (including pseudo-labels from SAM/VLMs on unlabelled data). Gains: speed with near-teacher accuracy; validate on hard slices.

### Q107. Multi-task and multi-camera fusion
Shared backbone with task-specific heads (detection + segmentation + depth) saves compute; fusion across cameras/LiDAR (BEV models like BEVFormer) for driving/robotics. Needs careful loss balancing and calibration.

### Q108. Autonomous driving perception overview
Sensors (camera, LiDAR, radar), 2D/3D detection, lane/drivable-area segmentation, tracking and prediction, BEV representation, occupancy networks, simulation-based testing, and safety cases (ISO 26262 / SOTIF). Safety-critical redundancy is essential.

### Q109. 3D reconstruction pipelines
Structure-from-Motion (COLMAP) → multi-view stereo → mesh/NeRF/Gaussian Splatting. Issues: texture-less regions, reflective surfaces, scale ambiguity, pose accuracy.

### Q110. Testing CV systems
Unit tests for pre/post-processing (box decoding, NMS), golden-image regression tests, deterministic seeds, parity tests across export formats, scenario suites (night, rain, occlusion), stress tests for streams, and threshold regression tests.

### Q111. Common failure analysis workflow
Collect errors → cluster by cause (lighting, occlusion, small size, label error, domain gap) using embeddings → quantify each bucket's impact → fix with data, labels, augmentation, model or rules → verify on the bucketed test set.

### Q112. Handling long-tail classes
Sample re-balancing, class-balanced losses, copy-paste augmentation, synthetic data, hierarchical labels, open-vocabulary models for rare categories, human review for unknowns.

### Q113. Tiling large images (satellite, pathology, PCB)
Tile with overlap, run inference per tile, merge boxes/masks (NMS or stitching), handle objects crossing tile borders, and train at the same scale as inference. SAHI automates sliced inference.

### Q114. Rotated and oriented objects
Use oriented bounding boxes (OBB) for aerial images/text (angle regression, KLD/GWD losses), or segmentation masks. Standard axis-aligned boxes waste area and hurt NMS in dense scenes.

### Q115. Choosing between model sizes
Plot accuracy vs latency vs memory on target hardware, not on a workstation GPU. Start with the smallest model meeting requirements; use bigger models offline for labelling or hard cases.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q116. Vision platform architecture
Data ingestion (cameras, uploads) → storage & catalog with versions → labelling & QA tooling → training pipelines (distributed, tracked) → evaluation harness with slices → model registry → export/optimisation → deployment (edge fleet + cloud) → monitoring & active-learning loop → governance. Provide reusable components (preprocessing, post-processing, tracking, metrics) across products.

### Q117. Build vs buy (cloud vision APIs vs custom)
APIs (Rekognition, Vision AI, Azure AI Vision, OCR/Document AI): fast to ship, good for generic tasks, ongoing per-call cost, limited customisation and data-governance concerns. Custom models: control, lower unit cost at volume, domain accuracy, edge/offline operation; require MLOps. Hybrid is common: APIs for prototypes and long-tail tasks.

### Q118. Edge fleet management
OTA model/app updates with staged rollout and rollback, device health telemetry, remote debugging, secure boot and signed artefacts, A/B on devices, bandwidth-aware sample upload, and hardware lifecycle planning.

### Q119. Cost optimisation
Right-size models, run motion-triggered or cascaded inference, quantise, share GPUs across streams, use spot instances for training, avoid storing raw video indefinitely, and track cost per camera-hour/image.

### Q120. Governance of high-risk vision AI
Risk classification (surveillance, biometrics, medical, safety), impact assessments, consent/notice, retention and access policies, audit logs, human oversight, bias testing, documentation (model cards, datasheets), and red-teaming. Follow regional rules (EU AI Act, local biometric laws) and verify with legal counsel.

### Q121. Establishing a data flywheel
Instrument products to capture failures and edge cases (with consent), auto-triage, route to labelling, retrain on a schedule, gate releases on regression suites, and publish metrics. The data engine is the moat more than the architecture.

### Q122. Evaluation strategy and acceptance criteria
Define scenarios and slices with business owners; fix pass/fail thresholds (e.g., recall ≥ 98% at ≤ 1 FP/hour); evaluate on blind real-world sets from new sites; require shadow-mode trials before autonomy; revisit after each release.

### Q123. Technology choices and roadmap
Standardise on a primary framework (PyTorch), a deployment stack (ONNX/TensorRT/OpenVINO), annotation tooling and tracking. Evaluate foundation models (SAM, DINOv2, VLMs) as accelerators for labelling and zero-shot features, while keeping small specialised models for production efficiency.

### Q124. Team structure and skills
CV researchers/applied scientists, ML engineers (training/optimisation), data/labelling operations, embedded/edge engineers, platform/MLOps, product and domain experts. Rotate on-call for model health; maintain an evaluation guild for shared standards.

### Q125. Communicating risk and expectations
Show examples of failure modes, per-slice metrics, uncertainty, and operational safeguards. Distinguish demo accuracy from production accuracy; set staged milestones (pilot → limited → scale) with explicit exit criteria.

---

# 💻 Part 6: Hands-On Tasks & Code

### Task 1. Classic pipeline: find and count objects with OpenCV
```python
import cv2
img = cv2.imread("coins.jpg")
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
blur = cv2.GaussianBlur(gray, (7, 7), 0)
_, th = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
th = cv2.morphologyEx(th, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)), iterations=2)
cnts, _ = cv2.findContours(th, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
cnts = [c for c in cnts if cv2.contourArea(c) > 200]
print("objects:", len(cnts))
cv2.drawContours(img, cnts, -1, (0, 255, 0), 2)
```

### Task 2. Fine-tune a classifier (PyTorch + torchvision)
```python
import torch, torch.nn as nn
from torchvision import datasets, models, transforms as T
from torch.utils.data import DataLoader

norm = T.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
tr_tf = T.Compose([T.RandomResizedCrop(224), T.RandomHorizontalFlip(), T.ColorJitter(0.2, 0.2, 0.2), T.ToTensor(), norm])
va_tf = T.Compose([T.Resize(256), T.CenterCrop(224), T.ToTensor(), norm])
tr = DataLoader(datasets.ImageFolder("data/train", tr_tf), batch_size=32, shuffle=True, num_workers=4, pin_memory=True)
va = DataLoader(datasets.ImageFolder("data/val", va_tf), batch_size=64, num_workers=4)

m = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
m.fc = nn.Linear(m.fc.in_features, len(tr.dataset.classes))
dev = "cuda" if torch.cuda.is_available() else "cpu"; m.to(dev)
head = list(m.fc.parameters()); hid = {id(p) for p in head}
body = [p for p in m.parameters() if id(p) not in hid]
opt = torch.optim.AdamW([{"params": body, "lr": 1e-4}, {"params": head, "lr": 1e-3}], weight_decay=1e-2)
crit = nn.CrossEntropyLoss(label_smoothing=0.1)
for ep in range(10):
    m.train()
    for x, y in tr:
        x, y = x.to(dev), y.to(dev)
        opt.zero_grad(); crit(m(x), y).backward(); opt.step()
    m.eval(); ok = n = 0
    with torch.no_grad():
        for x, y in va:
            ok += (m(x.to(dev)).argmax(1).cpu() == y).sum().item(); n += len(y)
    print(ep, ok / n)
```

### Task 3. Train and run YOLO
```python
from ultralytics import YOLO
model = YOLO("yolov8s.pt")
model.train(data="dataset.yaml", epochs=50, imgsz=640, batch=16, patience=15, augment=True)
metrics = model.val()                       # mAP50, mAP50-95, per-class
results = model.predict("test.jpg", conf=0.3, iou=0.5)
model.export(format="onnx", dynamic=True)   # or format="engine" for TensorRT
```
`dataset.yaml` lists `train:`, `val:`, `names:`.

### Task 4. IoU and NMS from scratch
```python
import numpy as np
def iou(a, b):
    x1, y1 = max(a[0], b[0]), max(a[1], b[1])
    x2, y2 = min(a[2], b[2]), min(a[3], b[3])
    inter = max(0, x2 - x1) * max(0, y2 - y1)
    ua = (a[2]-a[0])*(a[3]-a[1]) + (b[2]-b[0])*(b[3]-b[1]) - inter
    return inter / ua if ua > 0 else 0.0

def nms(boxes, scores, thr=0.5):
    order = np.argsort(scores)[::-1]; keep = []
    while len(order):
        i = order[0]; keep.append(i)
        order = np.array([j for j in order[1:] if iou(boxes[i], boxes[j]) < thr])
    return keep
```

### Task 5. Dice loss for segmentation
```python
def dice_loss(logits, target, eps=1e-6):
    p = torch.sigmoid(logits)
    inter = (p * target).sum((1, 2, 3))
    return 1 - ((2 * inter + eps) / (p.sum((1, 2, 3)) + target.sum((1, 2, 3)) + eps)).mean()
loss = dice_loss(out, mask) + nn.functional.binary_cross_entropy_with_logits(out, mask)
```

### Task 6. Minimal U-Net block
```python
class Down(nn.Module):
    def __init__(self, i, o):
        super().__init__()
        self.b = nn.Sequential(nn.MaxPool2d(2), nn.Conv2d(i, o, 3, padding=1), nn.BatchNorm2d(o), nn.ReLU(True),
                               nn.Conv2d(o, o, 3, padding=1), nn.BatchNorm2d(o), nn.ReLU(True))
    def forward(self, x): return self.b(x)

class Up(nn.Module):
    def __init__(self, i, o):
        super().__init__()
        self.up = nn.ConvTranspose2d(i, i // 2, 2, stride=2)
        self.c = nn.Sequential(nn.Conv2d(i, o, 3, padding=1), nn.BatchNorm2d(o), nn.ReLU(True))
    def forward(self, x, skip):
        x = self.up(x)
        return self.c(torch.cat([skip, x], dim=1))
```

### Task 7. Zero-shot classification with CLIP
```python
from transformers import CLIPModel, CLIPProcessor
from PIL import Image
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32"); proc = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
labels = ["a photo of a scratch defect", "a photo of a clean surface"]
inputs = proc(text=labels, images=Image.open("part.jpg"), return_tensors="pt", padding=True)
probs = model(**inputs).logits_per_image.softmax(dim=1)
```

### Task 8. Image similarity search with FAISS
```python
import faiss, numpy as np
emb = np.load("embeddings.npy").astype("float32"); faiss.normalize_L2(emb)
index = faiss.IndexFlatIP(emb.shape[1]); index.add(emb)
q = emb[:1]; D, I = index.search(q, 5)       # top-5 cosine neighbours
```

### Task 9. Video loop with tracking (Ultralytics)
```python
from ultralytics import YOLO
model = YOLO("yolov8n.pt")
for r in model.track(source="video.mp4", stream=True, tracker="bytetrack.yaml", conf=0.3):
    ids = r.boxes.id.int().tolist() if r.boxes.id is not None else []
    print(len(ids), "tracked objects")
```

### Task 10. ONNX export and parity check
```python
m.eval(); dummy = torch.randn(1, 3, 224, 224).to(dev)
torch.onnx.export(m, dummy, "cls.onnx", input_names=["x"], output_names=["logits"],
                  dynamic_axes={"x": {0: "batch"}}, opset_version=17)
import onnxruntime as ort, numpy as np
sess = ort.InferenceSession("cls.onnx", providers=["CUDAExecutionProvider", "CPUExecutionProvider"])
out = sess.run(None, {"x": dummy.cpu().numpy()})[0]
np.testing.assert_allclose(out, m(dummy).detach().cpu().numpy(), rtol=1e-3, atol=1e-4)
```

### Task 11. Albumentations pipeline for detection
```python
import albumentations as A
tf = A.Compose([A.RandomBrightnessContrast(p=0.5), A.HorizontalFlip(p=0.5),
                A.ShiftScaleRotate(shift_limit=0.05, scale_limit=0.1, rotate_limit=10, p=0.5),
                A.GaussNoise(p=0.2)],
               bbox_params=A.BboxParams(format="yolo", label_fields=["labels"], min_visibility=0.3))
out = tf(image=img, bboxes=boxes, labels=labels)
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. Great validation accuracy, terrible real-world accuracy
Leakage via near-duplicate frames in train/val, controlled lab images vs wild images, different camera/lighting, preprocessing mismatch. Re-split by scene, test on fresh field data, compare input statistics.

### D2. Model predictions look random after deployment
BGR/RGB swap, missing normalisation, wrong resize/crop, channel order `HWC` vs `CHW`, `eval()` not set. Run the same image through training and serving preprocessing and diff the tensors.

### D3. Detector misses small objects
Input resolution too low, stride too large, anchors/assignments mismatch, aggressive augmentation shrinking objects. Increase `imgsz`, use tiling/SAHI, add small-object data, check label sizes.

### D4. Many duplicate boxes
NMS threshold too high or disabled, class-agnostic issues, export without NMS. Tune IoU threshold, use class-aware NMS or WBF where suitable.

### D5. High mAP@0.5 but low mAP@0.5:0.95
Localisation is loose: label quality, box loss, low resolution, annotation inconsistency. Improve labels, use CIoU/DFL, higher resolution, longer training.

### D6. Segmentation outputs all background
Severe class imbalance. Use Dice/Focal loss, weighted CE, oversample positive tiles, check mask values (0/255 vs 0/1) and resizing with nearest-neighbour for masks.

### D7. Masks misaligned with images
Resized images but not masks (or used bilinear on masks), wrong transpose, off-by-one in coordinate conversion, EXIF rotation ignored. Apply identical geometric transforms and fix EXIF orientation.

### D8. Boxes are shifted or scaled wrongly after letterboxing
Forgot to undo padding/scale when mapping predictions back to original coordinates. Keep the scale and pad values and invert them.

### D9. Training loss NaN
LR too high, bad boxes (zero width/height), corrupt images, FP16 overflow. Validate labels, clip boxes, lower LR, use BF16/AMP safely.

### D10. GPU underutilised during training
JPEG decoding/augmentation bottleneck on CPU. Increase workers, cache resized images, use GPU augmentations (DALI/Kornia), smaller image formats, faster storage.

### D11. TensorRT/ONNX model gives different results
Preprocessing differences, unsupported ops fallback, precision (FP16/INT8) loss, NMS implemented differently. Compare layer outputs, evaluate mAP on the exported model, recalibrate INT8.

### D12. Tracker switches IDs
Occlusions, low detection recall, similar appearance, low FPS. Tune association thresholds, add re-ID embeddings, use ByteTrack, increase frame rate, improve detector recall.

### D13. OCR fails on phone-captured documents
Perspective distortion, blur, low contrast, shadows. Detect document corners → perspective warp, deblur/denoise, CLAHE, adaptive threshold, higher DPI, and try a stronger OCR model.

### D14. Face recognition false matches
Threshold too lax, poor alignment, low-quality faces, demographic bias. Align faces, filter by quality, calibrate thresholds per population, use stronger embeddings, require human review for high-stakes decisions.

### D15. Model works on day, fails at night
Insufficient night data, camera IR mode switching, motion blur. Collect night data, use photometric augmentation, add IR-specific training, or separate models/thresholds per mode.

---

# 🧩 Part 8: Tricky Questions

### T1. Why is accuracy a bad metric for detection/segmentation?
Backgrounds dominate; predicting nothing can yield high pixel accuracy. Use mAP, mIoU, Dice, and recall/precision at the operating point.

### T2. Does a bigger input size always improve accuracy?
Not always. It helps small objects but increases compute quadratically, and models trained at another scale may degrade. Match train/test scale and benchmark latency.

### T3. Are CNNs translation invariant?
Convolutions are translation-**equivariant**; pooling and global aggregation add approximate invariance. Strided ops and padding can break exact invariance (aliasing).

### T4. Why use mask resizing with nearest-neighbour?
Interpolation creates invalid in-between class IDs (e.g., 1.5). Nearest keeps discrete labels.

### T5. Is a higher confidence threshold always safer?
It reduces false positives but increases misses. The right threshold depends on error costs and should be tuned per class on validation data.

### T6. Can data augmentation hurt?
Yes, if transforms change the label (flipping "left/right", "6/9", text), distort geometry used by the task, or create unrealistic images. Choose label-preserving, domain-realistic transforms.

### T7. Is Grad-CAM proof the model "understands" the object?
No; it highlights influential regions, which can still be spurious (background, watermark).

### T8. Why do detectors struggle with crowded scenes?
Heavy occlusion and NMS suppression of valid overlapping boxes. Use Soft-NMS, crowd-aware losses, set-prediction (DETR) or better assignment strategies.

### T9. Does ImageNet pre-training always help?
Usually, but domain gap (medical, satellite, microscopy) can reduce benefits; domain-specific or self-supervised pre-training may help more.

### T10. Why can two annotators' boxes differ and who is right?
Ambiguous guidelines (tight vs loose, occluded parts). Define rules and measure annotator IoU agreement; inconsistent labels cap achievable mAP.

### T11. Why does FID not tell the full story?
It measures distribution similarity using Inception features and is sensitive to sample size and domain; it doesn't capture prompt faithfulness or human preference. Combine with CLIP score and human evaluation.

### T12. Why does JPEG compression matter?
Training on pristine images but serving compressed frames (or the reverse) creates a domain gap. Include compression augmentation and use consistent codecs.

### T13. Is video always better analysed frame-by-frame?
Per-frame is simple and strong with smoothing/tracking, but temporal models capture motion cues (actions). Choose based on whether the task depends on motion.

### T14. Why might a model perform worse after "adding more data"?
New data may be noisy, mislabelled, distribution-shifted or duplicated. Quality and coverage matter more than raw quantity.

### T15. Are foundation models (SAM/CLIP) replacements for training?
They accelerate labelling and give strong zero-shot features, but production tasks with strict accuracy, latency and cost still typically need a fine-tuned or distilled model.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- Image = array of pixels; OpenCV = BGR, PyTorch = CHW.
- IoU = intersection / union.
- mAP = mean over classes (and IoU thresholds) of AP.
- NMS removes overlapping duplicates.
- Otsu picks a threshold automatically.
- Adaptive threshold for uneven lighting.
- CLAHE = local contrast equalisation.
- ResNet skip: `y = F(x) + x`.
- FPN handles multi-scale objects.
- Focal loss tackles easy-negative dominance.
- U-Net = encoder-decoder + skip connections.
- Dice = `2|A∩B|/(|A|+|B|)`.
- YOLO = fast one-stage detector.
- DETR = set prediction, no NMS.
- CLIP = zero-shot via image–text contrast.
- SAM = promptable segmentation.
- Split by scene/video, never by frame.
- Match training and inference preprocessing exactly.
- Letterbox, then un-letterbox predictions.
- Quantise with calibration data and re-measure mAP.
- Camera, lighting and data beat fancy models.
- Monitor input quality, not only predictions.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about a computer-vision project you shipped
Use STAR: business problem and acceptance criteria → data (sources, size, conditions) and labelling QA → baseline (pre-trained YOLO/ResNet) → improvements (resolution, augmentation, hard-negative mining) → evaluation (mAP, recall at fixed FP rate, slices) → deployment (TensorRT, edge device, latency) → monitoring → impact. Example: "PCB defect detection: baseline mAP50 0.71 → 0.92 after fixing lighting, relabelling 8% of boxes and tiling at 1280 px; INT8 TensorRT hit 22 ms/board; escapes dropped 63%."

### P2. A time the model failed in production
Describe the situation (new camera, seasonal lighting), detection (drift dashboards/operator reports), mitigation (fallback to manual review), root cause, data/labelling fix, retraining, and the monitoring you added.

### P3. How do you improve a model when accuracy plateaus?
Error analysis by bucket (small, occluded, night, class confusion, label errors), then fix data/labels first, then augmentation, resolution, architecture or loss. Quantify the expected gain per bucket before investing.

### P4. How do you manage labelling quality and cost?
Guidelines with visual examples, pilot rounds, inter-annotator IoU, consensus on hard samples, model-assisted pre-labelling (SAM/detector) with human review, active learning for selection, and sampling audits.

### P5. How did you optimise for edge hardware?
Profiled latency per stage, picked an efficient backbone, quantised with calibration, moved pre/post-processing to GPU/NPU, batched or skipped frames, and validated accuracy on-device.

### P6. How do you handle privacy in vision projects?
Minimise collected data, process on-device, blur or discard faces/plates, short retention, access controls, consent/signage, and legal review.

### P7. How do you communicate model limits to operations teams?
Share confusion examples, define confidence/escalation workflows, provide dashboards, and schedule periodic accuracy audits and retraining.

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- Image fundamentals: pixels, channels, colour spaces, formats, resolution, EXIF.
- Classical CV: filtering, edges, thresholding, morphology, contours, histograms, features (Harris, SIFT, ORB), homography, RANSAC, camera calibration.
- CNNs and Transformers: convolution, pooling, ResNet/EfficientNet/ConvNeXt, ViT/Swin, transfer learning, augmentation.
- Detection: R-CNN family, YOLO, SSD, RetinaNet, DETR, NMS, anchors, assignment, losses, mAP.
- Segmentation: semantic, instance, panoptic, U-Net, Mask R-CNN, SAM, Dice/IoU.
- Other tasks: keypoints/pose, tracking, optical flow, OCR/document AI, face recognition, depth, 3D, video.
- Generative vision: GAN, VAE, diffusion, super-resolution, inpainting; metrics (FID, LPIPS).
- Foundation models: CLIP, DINOv2, SAM, VLMs, open-vocabulary detection.
- Data and labelling: formats, tools, quality, splits, active learning, synthetic data.
- Deployment: ONNX, TensorRT, OpenVINO, TFLite, edge, streaming, monitoring, drift.
- Responsible CV: privacy, bias, safety, regulation.

## Mixed topics
- Detection + tracking + business logic (zones, dwell time).
- Segmentation + SAM-assisted labelling + distillation.
- OCR + layout + key-value extraction + validation rules.
- Quantisation + TensorRT + latency budgeting.
- Domain shift + monitoring + active learning flywheel.
- VLM prototype → classic detector in production.

---

# 🔬 Part 12: Internals

### Convolution as matrix multiplication
Frameworks use `im2col` (unfold patches into columns) so convolution becomes a GEMM, accelerated by cuDNN/Tensor Cores; Winograd and FFT variants cut multiplications for specific kernel sizes.

### Receptive field growth
Each layer expands the receptive field by `(k−1)·(product of previous strides)`. Dilated convolutions expand it without downsampling. Effective receptive field is smaller than theoretical and Gaussian-shaped.

### Anatomy of a detector (modern YOLO-style)
Backbone (feature extraction) → neck (FPN/PAN multi-scale fusion) → head (decoupled classification & box regression, possibly DFL distribution for box edges) → label assignment (TAL/SimOTA) → NMS (or NMS-free one-to-one head) at inference.

### Box encodings
Predictions are offsets relative to anchors/points (`dx, dy, dw, dh` in log-space) or distances to box edges (`l, t, r, b`). Decoding converts to image coordinates and clips to image bounds.

### RoIAlign vs RoIPool
RoIPool quantises coordinates (loses alignment); RoIAlign uses bilinear interpolation at sampled points, essential for precise masks.

### ViT attention cost
Tokens = (H/P)(W/P). Attention cost is O(n²); doubling resolution quadruples tokens and ~16× attention cost. Swin restricts attention to local windows; hierarchical designs reduce cost.

### How diffusion samples images
Start from Gaussian noise; at each step a network predicts noise (or velocity) conditioned on timestep/text; a scheduler (DDIM, DPM-Solver) computes the next less-noisy latent; the VAE decoder converts the final latent to pixels. Classifier-free guidance mixes conditional and unconditional predictions.

### Camera model
Projection `s·[u v 1]ᵀ = K [R|t] [X Y Z 1]ᵀ`, with radial/tangential distortion applied before pixel mapping. Calibration estimates `K` and distortion from known patterns; undistortion is required for metric measurement.

### Video decoding
Compressed streams use I/P/B frames; random access is expensive (decode from last keyframe). GPU decoders (NVDEC) and frame skipping reduce cost; timestamps (PTS) must be handled for sync.

### COCO mAP computation
For each class and IoU threshold: sort detections by score, match greedily to unmatched GT with IoU ≥ threshold, compute precision/recall, interpolate the precision envelope (101-point), average over classes and thresholds 0.50:0.05:0.95; also report area-based APs (S/M/L) and AR.

---

# 📊 Part 13: Reference Tables

### Task → typical model
| Task | Starting point |
|---|---|
| Classification | ResNet / EfficientNet / ConvNeXt / ViT (pre-trained) |
| Detection (real-time) | YOLOv8/11, RT-DETR |
| Detection (accuracy) | Faster R-CNN + FPN, DINO-DETR, large YOLO |
| Semantic segmentation | U-Net, DeepLabV3+, SegFormer |
| Instance segmentation | Mask R-CNN, YOLO-seg, Mask2Former |
| Interactive/zero-shot segmentation | SAM / SAM 2 |
| Pose | HRNet, ViTPose, YOLO-pose |
| OCR | PaddleOCR, TrOCR, Tesseract, cloud OCR |
| Image retrieval | CLIP / DINOv2 embeddings + FAISS |
| Anomaly detection | PatchCore, PaDiM, autoencoders |
| Depth | Depth Anything, MiDaS, stereo/LiDAR |
| Generation | Latent diffusion (SDXL/Flux-class), DiT |

### Metrics
| Task | Metrics |
|---|---|
| Classification | Accuracy, F1, top-k, AUC |
| Detection | mAP@0.5, mAP@0.5:0.95, AR, PR curves |
| Segmentation | mIoU, Dice, boundary F |
| Tracking | MOTA, IDF1, HOTA |
| OCR | CER, WER, field accuracy |
| Super-resolution | PSNR, SSIM, LPIPS |
| Generation | FID, CLIP score, human preference |
| Face verification | TAR@FAR, EER |

### Loss functions
| Loss | Use |
|---|---|
| Cross-entropy / label smoothing | Classification |
| Focal | Class imbalance in dense detectors |
| GIoU / DIoU / CIoU | Box regression |
| Dice / Tversky | Segmentation overlap |
| Triplet / ArcFace / InfoNCE | Embedding learning |
| L1 / SSIM / perceptual | Image restoration |

### Annotation formats
| Format | Box representation |
|---|---|
| YOLO | `class cx cy w h` (normalised 0–1) |
| COCO | `[x, y, w, h]` pixels (top-left origin) |
| Pascal VOC | `xmin ymin xmax ymax` pixels |
| Mask formats | Polygons, RLE, PNG indexed masks |

### Deployment targets
| Target | Tools |
|---|---|
| NVIDIA GPU / Jetson | TensorRT, DeepStream, Triton |
| Intel CPU/iGPU/VPU | OpenVINO |
| Mobile | TFLite, Core ML, ExecuTorch, NNAPI |
| Browser | ONNX Runtime Web, TensorFlow.js |
| Cloud generic | ONNX Runtime, TorchServe/KServe, serverless GPU |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
Input 224×224, conv 7×7, stride 2, padding 3. Output size?
`(224 + 6 − 7)/2 + 1` = `112.5 → 112` → **112×112**.

### O2.
Parameters of `Conv2d(3, 64, kernel_size=7)` with bias?
`7·7·3·64 + 64` = **9472**.

### O3.
Two boxes `A=[0,0,10,10]`, `B=[5,5,15,15]`. IoU?
Intersection = 5×5 = 25; union = 100 + 100 − 25 = 175 → **0.143**.

### O4.
Detections: 10 predictions, 6 correct (TP), the ground truth has 8 objects. Precision / recall?
**0.6 / 0.75**.

### O5.
Dice for prediction mask with 40 pixels, ground truth 50 pixels, overlap 30:
`2·30 / (40+50)` = **0.667**. IoU = 30/(40+50−30) = **0.5**.

### O6.
```python
import numpy as np
img = np.zeros((480, 640, 3), dtype=np.uint8)
print(img.shape, img.dtype)
```
**`(480, 640, 3) uint8`** (height 480, width 640).

### O7.
```python
import cv2, numpy as np
a = np.array([[250]], dtype=np.uint8)
print(cv2.add(a, 10)[0, 0], (a + 10)[0, 0])
```
`cv2.add` saturates → **255**; NumPy wraps around → **4**.

### O8.
Tensor shapes: batch of 8 RGB 224×224 images in PyTorch is **`(8, 3, 224, 224)`**; in OpenCV/NumPy one image is **`(224, 224, 3)`**.

### O9.
Global average pooling on a feature map `(N, 2048, 7, 7)` outputs **`(N, 2048, 1, 1)`** (flatten → `(N, 2048)`).

### O10.
YOLO label line `2 0.5 0.5 0.2 0.4` on a 640×480 image: class 2, centre (320, 240), width 128, height 192 pixels → corners **(256, 144) to (384, 336)**.

### O11.
ViT with 224×224 input and 16×16 patches: tokens = (224/16)² = **196** (+1 class token = 197).

### O12.
Mixed precision INT8 quantisation reduces weight storage versus FP32 by **4×** (32 → 8 bits).

---

# ✅ Part 15: MCQs

**1. OpenCV loads colour images in which order by default?**
A) RGB  B) BGR  C) HSV  D) LAB
**Answer: B**

**2. Which metric is standard for object detection?**
A) Accuracy  B) mAP  C) BLEU  D) Perplexity
**Answer: B**

**3. NMS is used to:**
A) Resize images  B) Remove duplicate overlapping detections  C) Normalise colours  D) Augment data
**Answer: B**

**4. U-Net skip connections:**
A) Reduce parameters  B) Preserve spatial detail by passing encoder features to the decoder  C) Replace the loss  D) Remove the need for upsampling
**Answer: B**

**5. Which technique is best for uneven lighting in document thresholding?**
A) Global threshold  B) Adaptive threshold  C) Median of image  D) Inversion
**Answer: B**

**6. Focal loss is mainly designed to handle:**
A) Overfitting  B) Extreme class imbalance between easy and hard examples  C) Colour shifts  D) Label noise only
**Answer: B**

**7. CLIP is trained with:**
A) Pixel reconstruction  B) Contrastive image–text learning  C) Bounding-box regression  D) Optical flow
**Answer: B**

**8. For masks, resizing should use:**
A) Bilinear  B) Bicubic  C) Nearest-neighbour  D) Gaussian blur
**Answer: C**

**9. DETR differs from YOLO by:**
A) Using anchors  B) Predicting a set with Hungarian matching and no NMS  C) Not using a backbone  D) Being a segmentation model
**Answer: B**

**10. Best way to split video frames for training/validation:**
A) Random frames  B) By video/scene  C) Alternate frames  D) By file size
**Answer: B**

**11. IoU of two identical boxes is:**
A) 0  B) 0.5  C) 1  D) Undefined
**Answer: C**

**12. Which pooling gives the final vector in ResNet?**
A) Max pooling  B) Global average pooling  C) No pooling  D) Median pooling
**Answer: B**

**13. SAM is best described as:**
A) A text generator  B) A promptable segmentation foundation model  C) An OCR engine  D) A tracker
**Answer: B**

**14. Which is a risk of INT8 quantisation without calibration?**
A) Larger model size  B) Accuracy drop  C) Slower training  D) More parameters
**Answer: B**

**15. Homography estimation is made robust to outliers using:**
A) Dropout  B) RANSAC  C) Batch norm  D) NMS
**Answer: B**

**16. Which colour space is commonly used for colour-based segmentation due to lighting robustness?**
A) RGB  B) HSV  C) BGR  D) Grayscale
**Answer: B**

**17. COCO mAP averages AP over IoU thresholds:**
A) 0.5 only  B) 0.5 to 0.95  C) 0.1 to 0.5  D) 0.95 only
**Answer: B**

**18. FID measures:**
A) Detection accuracy  B) Similarity between generated and real image distributions  C) OCR error  D) Tracking identity switches
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

- BGR/RGB confusion and wrong channel order (`HWC` vs `CHW`).
- Different preprocessing in training vs serving (resize, normalisation, crop).
- Random frame-level splits that leak near-duplicates.
- Validating only on clean lab data; no field data from new sites.
- Evaluating with accuracy instead of mAP/mIoU/recall at the operating point.
- Forgetting to un-letterbox predictions or mis-handling EXIF rotation.
- Resizing masks with interpolation; augmenting images but not boxes/masks.
- Ignoring label quality (loose boxes, inconsistent classes).
- Using horizontal flip on orientation-sensitive tasks.
- Setting one global confidence threshold for all classes.
- Quantising or exporting without re-checking mAP on the exported model.
- Benchmarking on a workstation GPU instead of target hardware.
- Neglecting camera, lighting and lens setup in favour of model tuning.
- Skipping privacy, consent and bias evaluation for face/person analytics.
- No monitoring of input quality (blur, brightness, camera outages).
- Trusting zero-shot foundation models without domain validation.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You start by understanding the capture setup (camera, lighting, resolution) and the decision cost, not just the model.
- You split data by scene/site, and validate on genuinely new conditions.
- You run bucketed error analysis and fix data/labels before changing architectures.
- You choose metrics at the operating point (recall at fixed FP rate) and tune per-class thresholds.
- You can explain detector internals (assignment, NMS, losses) and debug coordinate/scale issues.
- You optimise end-to-end latency (decode → preprocess → infer → post-process), not only model FLOPs.
- You validate exports and quantisation numerically and by task metrics.
- You build feedback loops: monitoring, sample capture, labelling, retraining.
- You use foundation models (SAM, CLIP, VLMs) smartly for labelling and prototyping, then distil.
- You treat privacy, bias and safety as design requirements.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Core formulas
```
IoU = |A∩B| / |A∪B|              Dice = 2|A∩B| / (|A|+|B|)
conv out = ⌊(N + 2P − K)/S⌋ + 1  conv params = K·K·Cin·Cout + Cout
Precision = TP/(TP+FP)           Recall = TP/(TP+FN)
Focal = −α(1−p)^γ log p          ViT tokens = (H/P)·(W/P)
```

### Pipelines
- **Classification**: pre-trained backbone → new head → augment → AdamW + cosine → evaluate per class.
- **Detection**: labelled boxes (check format) → YOLO/RT-DETR → tune conf/IoU → mAP + PR at operating point.
- **Segmentation**: U-Net/SegFormer → CE + Dice → mIoU/Dice → post-process masks.
- **Production**: export (ONNX) → optimise (TensorRT/OpenVINO) → GPU pre/post-processing → monitor.

### Debug checklist
Visualise inputs & labels after augmentation → channel order/normalisation → coordinate formats & letterbox → overfit a small batch → per-class metrics → worst-loss samples → Grad-CAM → compare exported vs original outputs.

### Deployment checklist
Latency on target hardware • calibration data for INT8 • NMS/thresholds validated • input-quality monitors • low-confidence sample capture • rollback plan • privacy controls.

### Final checklist before the interview
- [ ] Explain image representations, colour spaces and the BGR/RGB, HWC/CHW pitfalls.
- [ ] Perform classic ops: filtering, Canny, Otsu/adaptive threshold, morphology, contours.
- [ ] Explain CNN components, ResNet, FPN, ViT, transfer learning, augmentation.
- [ ] Compare detectors (Faster R-CNN, YOLO, DETR); explain anchors, NMS, IoU, mAP, losses.
- [ ] Explain segmentation types, U-Net, Dice/IoU, SAM, class imbalance handling.
- [ ] Discuss OCR/document AI, tracking, pose, video, depth/3D at a practical level.
- [ ] Explain CLIP, self-supervised models, VLMs and when to use them.
- [ ] Describe labelling QA, data splits, active learning and domain shift.
- [ ] Deploy and optimise: ONNX, TensorRT, quantisation, latency budgeting, monitoring.
- [ ] Prepare a project story with baseline, error analysis, numbers and lessons learned.
