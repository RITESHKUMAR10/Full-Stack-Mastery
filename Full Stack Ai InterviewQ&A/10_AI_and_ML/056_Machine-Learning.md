# Machine Learning Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **Python 3.11+, scikit-learn 1.4 – 1.6, XGBoost 2.x, LightGBM 4.x, CatBoost 1.2, SHAP 0.4x, MLflow 2.x**. APIs such as `OneHotEncoder(sparse_output=...)` (was `sparse`), `set_output(transform="pandas")`, `HistGradientBoosting*` native categorical support, and `ColumnTransformer` behaviour change between releases: anything marked "verify" should be checked in the official docs (scikit-learn.org, xgboost.readthedocs.io). Examples use the sample name **Ritesh Kumar** and small churn / house-price / fraud style data.
> This file covers the ML problem types, the train/validation/test discipline, bias-variance, linear and logistic regression, regularisation, trees, random forests, boosting, SVM, kNN, naive Bayes, clustering, PCA and dimensionality reduction, feature engineering, imbalanced data, metrics, cross-validation, hyper-parameter tuning, pipelines, leakage, interpretability, calibration, drift, and production ML trade-offs. Related topics: statistics and maths in `054_Statistics-and-Math-for-ML.md`, pandas/NumPy in `055_Pandas-and-NumPy.md`, deep learning in `057_Deep-Learning.md`, PyTorch in `058_PyTorch.md`, NLP in `059_NLP.md`, MLOps in `074_MLOps.md`, data engineering in `075_Data-Engineering.md`, system design in `../09_System_Design/053_System-Design.md`.

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

### Q1. What is machine learning? *(Must-know)*
Machine learning is building systems that **learn patterns from data** to make predictions or decisions, instead of hand-coding rules. You give a model examples (features `X`, optionally labels `y`); it fits parameters that minimise a loss; then it generalises to new, unseen data.

### Q2. Supervised vs unsupervised vs reinforcement learning *(Must-know)*
| Type | Data | Goal | Example |
|---|---|---|---|
| Supervised | Features + labels | Predict label | Churn, price, spam |
| Unsupervised | Features only | Find structure | Customer segments, anomalies |
| Semi-supervised | Few labels + many unlabeled | Use both | Medical images |
| Self-supervised | Labels made from data itself | Learn representations | LLM pre-training |
| Reinforcement | Agent + reward | Maximise cumulative reward | Games, robotics |

### Q3. Classification vs regression
Classification predicts a **category** (spam / not spam, 10 digits). Regression predicts a **continuous number** (house price, demand). Ranking, forecasting and clustering are related but distinct problem types.

### Q4. Features, labels, samples, parameters, hyper-parameters *(Must-know)*
- **Feature**: an input column. **Label/target**: what we predict. **Sample**: one row.
- **Parameters**: learned from data (weights, tree splits).
- **Hyper-parameters**: set before training (learning rate, depth, `C`, `k`); tuned with validation.

### Q5. Train / validation / test split *(Must-know)*
- **Train**: fit the model.
- **Validation**: choose models and hyper-parameters.
- **Test**: touched **once** at the end for an unbiased estimate.
```python
from sklearn.model_selection import train_test_split
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
```
Use `stratify=y` for classification so class ratios are preserved.

### Q6. Overfitting vs underfitting *(Must-know)*
- **Overfitting**: low train error, high validation error. The model memorised noise (high variance).
- **Underfitting**: high error on both. The model is too simple (high bias).
Fixes for overfitting: more data, simpler model, regularisation, early stopping, dropout, feature selection, cross-validation. Fixes for underfitting: richer features, more complex model, less regularisation, longer training.

### Q7. Bias-variance trade-off *(Must-know)*
Expected error ≈ **bias² + variance + irreducible noise**. Bias is error from wrong assumptions (too simple). Variance is sensitivity to the training sample (too flexible). Increasing complexity lowers bias but raises variance; the goal is the sweet spot.

### Q8. What is a loss function?
A number that measures how wrong predictions are; training minimises it. Regression: MSE, MAE, Huber. Classification: log-loss (cross-entropy), hinge.

### Q9. Gradient descent *(Must-know)*
An iterative optimiser: `w ← w − η · ∂L/∂w`. `η` (learning rate) too high → diverges; too low → slow. Variants: **batch**, **stochastic (SGD)**, **mini-batch**, plus momentum, RMSProp, Adam.

### Q10. Linear regression
Models `ŷ = w·x + b`, minimising MSE. Closed form (normal equation) `w = (XᵀX)⁻¹Xᵀy` or gradient descent. Assumptions: linearity, independent errors, constant variance (homoscedasticity), roughly normal residuals, little multicollinearity.

### Q11. Logistic regression *(Must-know)*
A **classification** model: `p = σ(w·x + b)` where `σ(z)=1/(1+e^−z)`. Trained with log-loss. Output is a probability; threshold (default 0.5) gives the class. Coefficients are log-odds.

### Q12. Confusion matrix and basic metrics *(Must-know)*
| | Pred + | Pred − |
|---|---|---|
| Actual + | TP | FN |
| Actual − | FP | TN |
- Accuracy = (TP+TN)/all
- Precision = TP/(TP+FP)
- Recall (sensitivity) = TP/(TP+FN)
- F1 = 2PR/(P+R)

### Q13. Why accuracy can mislead
With 1% fraud, predicting "never fraud" gives 99% accuracy and zero value. Use precision/recall, F1, PR-AUC, ROC-AUC, cost-based metrics.

### Q14. Regression metrics
MAE (robust, same units), MSE/RMSE (penalises big errors), R² (variance explained; can be negative on test), MAPE (breaks near zero), RMSLE (relative errors).

### Q15. k-Nearest Neighbours (kNN)
Predicts from the `k` closest training points (majority vote or mean). No training, slow prediction, needs **feature scaling**, suffers in high dimensions (curse of dimensionality).

### Q16. Decision tree
Splits data with if/else rules chosen to maximise purity (Gini or entropy for classification; variance reduction for regression). Easy to interpret, handles mixed types, but **overfits** if deep.

### Q17. Random forest
An ensemble of decision trees trained on **bootstrap samples** with **random feature subsets** per split; predictions are averaged/voted. Reduces variance, robust, little tuning, gives feature importance.

### Q18. Gradient boosting (idea)
Build trees **sequentially**; each new tree fits the **residual errors** (negative gradient) of the ensemble so far. Strong on tabular data. Libraries: XGBoost, LightGBM, CatBoost, sklearn `HistGradientBoosting`.

### Q19. Naive Bayes
Applies Bayes' theorem assuming features are conditionally independent given the class. Fast, works well for text (bag-of-words), needs little data. Use Laplace smoothing for unseen words.

### Q20. Support Vector Machine (SVM)
Finds the hyperplane with the **maximum margin** between classes. Kernels (RBF, polynomial) allow non-linear boundaries. `C` trades margin width vs misclassification. Needs scaling; slow on very large data.

### Q21. K-Means clustering *(Must-know)*
Pick `k` centroids → assign each point to nearest centroid → recompute centroids → repeat until stable. Needs `k`, assumes spherical clusters of similar size, sensitive to initialisation (use `k-means++`) and scale. Choose `k` with elbow method / silhouette score.

### Q22. PCA (Principal Component Analysis) *(Must-know)*
Linear dimensionality reduction: finds orthogonal directions of **maximum variance** (eigenvectors of the covariance matrix). Keep the top components to compress data. Scale features first; components are less interpretable.

### Q23. Feature scaling
Standardisation `(x−μ)/σ` and Min-Max `(x−min)/(max−min)`. Needed for distance- and gradient-based models (kNN, SVM, logistic regression, neural nets, PCA, K-Means). Not needed for trees.

### Q24. Encoding categorical variables
- **One-hot**: nominal, low cardinality.
- **Ordinal**: ordered categories.
- **Target / frequency / hashing**: high cardinality (beware leakage with target encoding).
- Tree libraries (LightGBM, CatBoost) can use categoricals natively.

### Q25. Handling missing values
Drop (if rare), impute (mean/median/mode, kNN, iterative), add a **missing indicator**. Fit imputers on **train only**. Some models (XGBoost, LightGBM, HistGradientBoosting) handle NaN natively.

### Q26. Cross-validation *(Must-know)*
Split train data into `k` folds; train on `k−1`, validate on 1; average the scores. Gives a more stable estimate than a single split.
```python
from sklearn.model_selection import cross_val_score
cross_val_score(model, X, y, cv=5, scoring="f1")
```

### Q27. Data leakage (intro) *(Must-know)*
Information from outside the training data (future, test set, target) leaks into features, giving unrealistically good scores that collapse in production. Example: scaling on the whole dataset before splitting.

### Q28. Regularisation: L1 vs L2 *(Must-know)*
- **L2 (Ridge)** adds `λΣw²`: shrinks weights, keeps all features.
- **L1 (Lasso)** adds `λΣ|w|`: drives some weights to **exactly zero** (feature selection).
- **Elastic Net** mixes both. Larger `λ` (or smaller `C` in sklearn) means stronger regularisation.

### Q29. Parametric vs non-parametric
Parametric models have a fixed number of parameters (linear/logistic regression). Non-parametric models grow with data (kNN, trees, kernel SVM).

### Q30. A first sklearn workflow
```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

model = RandomForestClassifier(n_estimators=300, random_state=42, n_jobs=-1)
model.fit(X_tr, y_tr)
print(classification_report(y_te, model.predict(X_te)))
```

---

# 🔵 Part 2: Junior (1–3 years)

### Q31. Pipelines and `ColumnTransformer` *(Must-know)*
Chain preprocessing and the model so that the same steps run in CV and in production, and nothing leaks.
```python
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression

num = Pipeline([("imp", SimpleImputer(strategy="median")), ("sc", StandardScaler())])
cat = Pipeline([("imp", SimpleImputer(strategy="most_frequent")),
                ("oh", OneHotEncoder(handle_unknown="ignore"))])
pre = ColumnTransformer([("num", num, num_cols), ("cat", cat, cat_cols)])
clf = Pipeline([("pre", pre), ("model", LogisticRegression(max_iter=1000))])
```

### Q32. Why fit transformers on train only
`fit` learns statistics (mean, categories). Fitting on test/all data leaks information. Use `fit_transform` on train and `transform` on validation/test. Pipelines + `cross_val_score` do this per fold automatically.

### Q33. ROC curve and AUC *(Must-know)*
ROC plots **TPR vs FPR** across thresholds. AUC is the probability that a random positive scores higher than a random negative (0.5 = random, 1 = perfect). Threshold-independent, but can look optimistic with heavy imbalance.

### Q34. Precision-Recall curve and PR-AUC
Plots precision vs recall across thresholds. Prefer it for **imbalanced** data because it ignores true negatives. Baseline PR-AUC equals the positive rate.

### Q35. Choosing a threshold
Default 0.5 is arbitrary. Pick the threshold from the PR curve or a **cost matrix** (e.g., a missed fraud costs ₹5,000, a false alert ₹50). Optimise expected cost, not accuracy.

### Q36. Handling imbalanced data *(Must-know)*
1. Use proper metrics (PR-AUC, F1, recall at fixed precision).
2. `class_weight="balanced"` or sample weights.
3. Resample: random under/over-sampling, **SMOTE** (only on training folds).
4. Tune threshold.
5. Collect more minority data / use anomaly detection.
Never resample before the split.

### Q37. Stratified and group K-fold
- `StratifiedKFold`: keeps class proportions.
- `GroupKFold`: keeps all rows of one group (user, patient) in the same fold, avoiding leakage.
- `TimeSeriesSplit`: training always precedes validation.

### Q38. Hyper-parameter tuning
Grid search (exhaustive), random search (often better for same budget), Bayesian optimisation (Optuna), successive halving (`HalvingGridSearchCV`).
```python
from sklearn.model_selection import RandomizedSearchCV
search = RandomizedSearchCV(clf, {"model__C": [0.01, 0.1, 1, 10]}, n_iter=4, cv=5, scoring="f1")
search.fit(X_tr, y_tr)
```

### Q39. Feature engineering basics
Ratios, differences, log transforms for skew, date parts (hour, weekday), aggregates per user, interactions, binning, text lengths. Good features often beat fancier models.

### Q40. Feature selection
- **Filter**: correlation, mutual information, chi-square.
- **Wrapper**: RFE (recursive feature elimination).
- **Embedded**: L1, tree importance.
Do selection **inside** CV to avoid leakage.

### Q41. Multicollinearity
Highly correlated features make linear coefficients unstable. Detect with correlation matrix or **VIF** (>5–10 is a concern). Fix with dropping, PCA, or Ridge. Trees are mostly unaffected for prediction.

### Q42. Outliers
Detect with IQR, z-score, isolation forest. Options: keep (if real), cap/winsorise, transform (log), or use robust models/loss (Huber, tree-based, `RobustScaler`). Don't delete blindly; an outlier may be your fraud case.

### Q43. Entropy, Gini and information gain
Entropy `H = −Σ p log₂ p`; Gini `1 − Σ p²`. Information gain = parent impurity − weighted child impurity. Gini is cheaper; results are usually similar.

### Q44. Preventing tree overfitting
`max_depth`, `min_samples_leaf`, `min_samples_split`, `max_leaf_nodes`, `ccp_alpha` (cost-complexity pruning), or use an ensemble.

### Q45. Random forest hyper-parameters
`n_estimators` (more is safe, slower), `max_features` (sqrt for classification), `max_depth`, `min_samples_leaf`, `class_weight`. **OOB score** gives a free validation estimate (`oob_score=True`).

### Q46. Bagging vs boosting *(Must-know)*
| | Bagging | Boosting |
|---|---|---|
| Training | Parallel, independent | Sequential, corrective |
| Reduces | Variance | Bias (and some variance) |
| Base learner | Deep/low-bias trees | Shallow/weak trees |
| Overfit risk | Low | Higher; tune carefully |
| Example | Random Forest | XGBoost, LightGBM, AdaBoost |

### Q47. XGBoost vs LightGBM vs CatBoost
- **XGBoost**: robust, regularised, widely used, level-wise growth (histogram mode available).
- **LightGBM**: leaf-wise growth, very fast on big data, native categoricals, can overfit small data.
- **CatBoost**: best out-of-the-box with categoricals, ordered boosting reduces target leakage, slower training.

### Q48. Key boosting hyper-parameters
`learning_rate` (lower + more trees), `n_estimators` with **early stopping**, `max_depth`/`num_leaves`, `subsample`, `colsample_bytree`, `min_child_weight`, `reg_alpha`, `reg_lambda`.

### Q49. Early stopping
Stop adding trees/epochs when validation loss hasn't improved for `n` rounds. Use a separate validation set (not the test set).

### Q50. SVM kernels and `C`/`gamma`
RBF kernel: `gamma` high → each point has local influence (overfit); `gamma` low → smooth (underfit). `C` high → fewer margin violations (overfit); `C` low → wider margin.

### Q51. Choosing `k` in K-Means
Elbow (inertia vs k), silhouette score, gap statistic, domain knowledge, stability across seeds. Evaluate if clusters are actionable.

### Q52. Other clustering methods
- **Hierarchical**: dendrogram, no `k` upfront.
- **DBSCAN**: density-based, finds arbitrary shapes and noise, needs `eps`, `min_samples`.
- **Gaussian Mixture Models**: soft assignments, elliptical clusters.

### Q53. t-SNE and UMAP
Non-linear embeddings for **visualisation**. t-SNE preserves local structure, distances between clusters are not meaningful, non-deterministic. UMAP is faster and keeps more global structure. Don't use them as general-purpose features without care.

### Q54. Explained variance in PCA
`pca.explained_variance_ratio_`; pick components to reach e.g. 95% cumulative variance. Check a scree plot.

### Q55. Residual analysis for regression
Plot residuals vs predictions: random scatter is good; funnel shape → heteroscedasticity (try log target); curve → non-linearity (add features).

### Q56. Log-transforming the target
Helps right-skewed targets (price, income). Remember to invert predictions (`np.expm1`). Use `TransformedTargetRegressor` to do it safely. Note: back-transformed predictions estimate the median, not the mean.

### Q57. Polynomial features and interactions
`PolynomialFeatures(degree=2)` lets linear models fit curves. Use with regularisation and scaling; feature count explodes quickly.

### Q58. Ordinal vs one-hot for trees
Trees can often work with ordinal-encoded categories, but arbitrary order can hurt. One-hot with very high cardinality creates sparse, deep trees. Prefer native categorical support in LightGBM/CatBoost/HistGB.

### Q59. Target encoding safely
Replace a category with the mean target. Compute **out-of-fold** (and add smoothing) so a row's own label never influences its encoding. Otherwise, severe leakage.

### Q60. Saving and loading models
```python
import joblib
joblib.dump(clf, "churn_v3.joblib")
clf = joblib.load("churn_v3.joblib")
```
Pin library versions; pickle files are unsafe from untrusted sources. Consider ONNX for portability.

---

# 🟡 Part 3: Mid (3–5 years)

### Q61. Bias-variance in ensembles
Bagging averages high-variance models (variance ↓, bias ≈ same). Boosting adds learners to cut bias. Stacking learns how to combine diverse models. Averaging `n` independent models with variance σ² gives σ²/n; correlation between models limits the gain, hence random feature subsets.

### Q62. Stacking and blending
Train base models; produce **out-of-fold predictions**; train a meta-model on them.
```python
from sklearn.ensemble import StackingClassifier
```
Blending uses a holdout instead of OOF. Gains are small but real; cost is complexity and latency.

### Q63. Probability calibration *(Must-know)*
A model's scores are not always true probabilities (boosted trees and SVMs are often miscalibrated). Check a **reliability curve** and Brier score; fix with **Platt scaling** (sigmoid) or **isotonic regression** via `CalibratedClassifierCV`. Needed when probabilities drive decisions (pricing, risk).

### Q64. Learning curves vs validation curves
- **Learning curve**: score vs training size → shows if more data helps (large gap = variance, both low = bias).
- **Validation curve**: score vs one hyper-parameter → shows over/under-fitting zone.

### Q65. Nested cross-validation
Outer loop estimates generalisation; inner loop tunes hyper-parameters. Avoids optimistic bias from tuning and evaluating on the same folds. Costly, mainly for small data and model comparison.

### Q66. Time-series ML pitfalls
- Random splits leak the future. Use `TimeSeriesSplit` / rolling-origin.
- Build lag, rolling, calendar features using only past data.
- Beware of target leakage via smoothing windows centred on t.
- Check stationarity, seasonality, holidays; evaluate on a true future holdout.

### Q67. Leakage patterns in the wild
Future information in features; ID or timestamp proxies for the label; duplicate rows across train/test; preprocessing before split; target encoding without folds; features computed after the event (e.g., "refund_issued" for churn); group leakage (same patient in train and test).

### Q68. Detecting leakage
Suspiciously high CV score; one feature dominating importance; big gap between CV and production; permutation importance of an "impossible" feature; check feature availability **at prediction time** with the data owner.

### Q69. Feature importance methods *(Must-know)*
| Method | Pros | Cons |
|---|---|---|
| Impurity (MDI) | Free in trees | Biased to high-cardinality/continuous |
| Permutation | Model-agnostic, uses held-out data | Slow, correlated features share credit |
| SHAP | Local + global, consistent | Costly, needs care with correlation |
| Coefficients | Simple (scaled linear) | Linear models only |

### Q70. SHAP and LIME
**SHAP** assigns each feature a contribution to a prediction using Shapley values from game theory (fast `TreeExplainer` for trees). **LIME** fits a local interpretable surrogate around one prediction. Use them to debug, audit and explain, but they show model behaviour, not causality.

### Q71. Partial dependence and ICE
PDP shows the average effect of a feature on predictions; ICE shows it per sample. Misleading when features are strongly correlated; ALE plots are an alternative.

### Q72. Correlation vs causation
Predictive models exploit correlations that may not be causal or stable. For decisions about interventions (discounts, treatments) use experiments (A/B tests) or causal methods (uplift modelling, diff-in-diff, propensity scores).

### Q73. Class imbalance with boosting
Use `scale_pos_weight` (XGBoost) or `is_unbalance` / `class_weight` (LightGBM), evaluate with PR-AUC, tune thresholds, avoid heavy oversampling that distorts probabilities (then recalibrate).

### Q74. Handling high-cardinality features
Frequency encoding, target encoding (OOF), hashing trick, embeddings, grouping rare categories into "other", CatBoost native handling.

### Q75. Dimensionality reduction beyond PCA
Truncated SVD (sparse/text), Kernel PCA, LDA (supervised), autoencoders, UMAP, feature selection. Choose based on linear vs non-linear structure and whether labels are available.

### Q76. Anomaly detection
Isolation Forest, One-Class SVM, Local Outlier Factor, autoencoders, statistical control charts. Labels are rare, so evaluate with a small labelled set, precision@k, and analyst feedback. Combine with rules.

### Q77. Recommender systems basics
Collaborative filtering (user-item matrix, matrix factorisation), content-based (item features), hybrid, two-tower retrieval + ranking. Cold-start is the main issue. Metrics: precision@k, recall@k, NDCG, MAP, coverage, diversity.

### Q78. Ranking and learning-to-rank
Pointwise, pairwise (RankNet), listwise (LambdaMART). XGBoost/LightGBM support `rank:ndcg`. Evaluate with NDCG@k, not accuracy.

### Q79. Multi-class and multi-label
Multi-class: one label among many (softmax, one-vs-rest, one-vs-one). Multi-label: several labels per sample (independent sigmoids). Metrics: macro (equal class weight), micro (pooled), weighted F1.

### Q80. Optimisation: SGD, momentum, Adam
SGD with momentum smooths updates; Adam adapts per-parameter step sizes using first and second moment estimates. Learning-rate schedules and warm-up often matter more than the optimiser choice.

### Q81. Gradient boosting math (short)
At step `m`, compute pseudo-residuals `r = −∂L/∂F(x)`, fit a tree `h` to `r`, update `F ← F + η·h`. XGBoost uses second-order (Hessian) information and explicit regularisation on leaf weights and tree complexity.

### Q82. Why do trees ignore scaling and monotonic transforms?
Splits depend on the order of values, not magnitudes, so any monotonic transform of a feature leaves the tree unchanged.

### Q83. Why trees can't extrapolate
Predictions are piecewise constants from training ranges. A tree trained on prices up to ₹1 Cr predicts the last leaf value for ₹5 Cr. Use linear models, detrending, or hybrid approaches for trending targets.

### Q84. Missing data mechanisms
MCAR (random), MAR (depends on observed data), MNAR (depends on the missing value itself). MNAR makes simple imputation biased; missingness can itself be a feature.

### Q85. Reproducibility
Set seeds (`random_state`, `np.random.default_rng`), pin library versions, version data and code, log params/metrics (MLflow), store the environment (Docker/lock files). Note that multi-threaded and GPU ops may still be non-deterministic.

### Q86. Evaluation beyond a single number
Slice metrics by segment (region, device, new vs old users), check calibration, confidence intervals (bootstrap), stability across time, fairness across groups, latency and cost.

### Q87. Statistical significance of model comparisons
Use paired tests on the same folds (paired t-test with caveats, McNemar, bootstrap CIs). A 0.2% AUC gain within noise isn't a win.

### Q88. Online vs offline metrics
Offline metrics (AUC, NDCG) are proxies. Business impact needs **A/B tests** (conversion, revenue, retention). Offline gains don't always translate because of feedback loops and distribution differences.

### Q89. Concept drift vs data drift
- **Data (covariate) drift**: `P(X)` changes.
- **Label/prior drift**: `P(y)` changes.
- **Concept drift**: `P(y|X)` changes.
Monitor with PSI, KS test, feature distributions, prediction distributions, and delayed performance metrics.

### Q90. Retraining strategies
Scheduled (weekly), triggered (drift/performance drop), online/incremental (`partial_fit`). Always validate the candidate against the champion before promoting (shadow/canary).

---

# 🟠 Part 4: Senior (5–7 years)

### Q91. Frame an ML problem end to end
1. Business goal and success metric (revenue, cost, risk).
2. Is ML needed? Compare with rules / heuristic baseline.
3. Define label, prediction time, features available at that time.
4. Data availability, quality, volume, privacy.
5. Offline metric tied to business metric; thresholds and costs.
6. Baseline → iterate → error analysis.
7. Deployment mode (batch/real-time), latency, monitoring, retraining, rollback.

### Q92. Choose a model for tabular data
Start with a strong baseline (logistic/linear), then gradient boosting (usually best on tabular), compare with random forest, and consider neural nets only with huge data, embeddings, or multimodal inputs. Simpler wins if the metric difference is small.

### Q93. Cost-sensitive learning
Encode asymmetric costs via class/sample weights, custom loss, or threshold optimisation using the expected-cost curve. The decision rule: predict positive if `p · C_FN > (1 − p) · C_FP`.

### Q94. Uplift (treatment effect) modelling
Predict who will respond **because of** the intervention, not who would respond anyway. Methods: two-model, S/T/X-learners, causal forests. Needs randomised treatment data. Evaluate with Qini/uplift curves.

### Q95. Handling concept drift in production
Monitoring dashboards (PSI, KS, null rates), shadow evaluation, labelling pipeline for ground truth, windowed retraining, ensembles with recency weights, fallback models, and alerting tied to business KPIs.

### Q96. Training-serving skew *(Must-know)*
Difference between features at training and at serving (different code, stale data, time-zone, null handling). Mitigate with a **feature store**, shared transformation code, schema validation, logging served features and comparing to training stats.

### Q97. Feature store
Central store of curated features with **offline** (training, point-in-time correct) and **online** (low-latency) serving. Solves reuse, consistency and leakage via point-in-time joins. Tools: Feast, Tecton, Vertex/SageMaker feature stores.

### Q98. Point-in-time correctness
When creating training rows, join features **as they were at the prediction timestamp**, not their latest values. Otherwise, the future leaks into the past.

### Q99. Latency and cost trade-offs
Distil large models, quantise, limit tree depth, prune features, cache, batch predictions, use ONNX/TensorRT, pre-compute offline scores. Measure p95/p99, not only the mean.

### Q100. Fairness and bias
Sources: sampling bias, label bias, proxy features. Metrics: demographic parity, equal opportunity, equalised odds, calibration across groups; they can conflict. Mitigate with data fixes, constraints, reweighting, threshold adjustments, and documentation (model cards). Involve legal and domain experts.

### Q101. Explainability for regulated domains
Prefer inherently interpretable models (GLMs, GAMs, monotonic GBMs) when explanations are legally required. Provide reason codes via SHAP, document features, and keep audit trails.

### Q102. Semi-supervised and active learning
Pseudo-labelling, consistency regularisation, and active learning (label the most uncertain or diverse samples) cut labelling cost. Validate pseudo-label noise carefully.

### Q103. Weak supervision and label noise
Noisy labels hurt. Detect with confident learning (cleanlab), consensus labelling, robust losses, and label audits. Better labels often beat better models.

### Q104. Hyper-parameter optimisation at scale
Use Optuna / Ray Tune with pruning, early stopping, and warm starts; define sensible log-scale search spaces; limit trials by budget; keep a fixed validation protocol; track every run.

### Q105. Experiment tracking and model registry
MLflow/W&B: log params, metrics, artifacts, data hash, git commit. Registry stages (staging → production), approvals, lineage, rollbacks.

### Q106. Deploying ML models
- **Batch**: scheduled scoring into a table (cheap, simple).
- **Real-time**: REST/gRPC service (FastAPI, BentoML, Seldon, SageMaker).
- **Streaming**: Kafka + Flink/Spark.
- **Edge**: ONNX/TFLite.
Add input validation, versioning, timeouts, fallbacks, monitoring and canary rollout.

### Q107. Shadow, canary and A/B deployments
**Shadow**: new model scores traffic silently. **Canary**: small traffic share with auto-rollback. **A/B**: randomised comparison on business metrics. Decide success criteria before launching.

### Q108. Dealing with small data
Strong regularisation, simple models, cross-validation with repeats, domain features, data augmentation, transfer learning, Bayesian methods, and honest uncertainty estimates.

### Q109. Uncertainty estimation
Prediction intervals via quantile regression, **conformal prediction**, ensembles/bootstrap, Bayesian models, Monte-Carlo dropout. Calibrate and check coverage on held-out data.

### Q110. Monotonic constraints and domain knowledge
GBMs accept monotonic constraints (e.g., higher income → not lower credit score), improving trust and robustness at a small accuracy cost.

### Q111. Interpreting a model that performs worse in production
Check leakage, drift, skew, label delay, sample selection (model only sees approved loans), feedback loops, seasonality, and bugs in feature pipelines. Compare feature and score distributions between train and prod before touching the model.

### Q112. Selection bias and reject inference
When labels exist only for accepted cases (e.g., approved loans), the training data is biased. Mitigations: randomised exploration, reject inference methods, counterfactual evaluation (IPS), holdout experiments.

### Q113. Feedback loops
Model decisions change future data (recommendations drive clicks that train the next model). Use exploration, debiasing/IPS, randomised holdouts and monitor diversity.

### Q114. Handling very large datasets
Subsample for iteration, histogram-based GBMs, Dask/Spark ML, incremental learning (`partial_fit`), feature hashing, out-of-core training, GPU XGBoost/RAPIDS, reduce precision (float32).

### Q115. Model compression
Pruning, quantisation, knowledge distillation, smaller architectures, tree-count/depth reduction, feature reduction. Validate the metric loss and the latency gain together.

### Q116. Metrics for ranking/recommendation online
CTR, conversion, dwell time, retention, revenue per session, diversity and novelty. Beware of metrics that can be gamed (clickbait). Use guardrail metrics.

### Q117. Data contracts and validation
Great Expectations / Pandera / TFDV to enforce schemas, ranges, null rates and distribution checks before training and at serving. Fail fast on broken upstream data.

### Q118. Cold start
New users/items have no history. Use content features, popularity priors, demographics, onboarding questions, explore-exploit (bandits), and quick transition to personalised models.

### Q119. Multi-armed bandits vs A/B tests
Bandits shift traffic to better variants during the test (lower regret) but complicate inference; A/B gives clean causal estimates. Use bandits for continuous optimisation, A/B for decisions needing rigorous evidence.

### Q120. When not to use ML
Rules are clear and stable, data is scarce, errors are unacceptable and unexplainable, the baseline already meets goals, or the cost of maintenance exceeds the value.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q121. ML platform architecture
Data ingestion → validation → feature store → training pipelines (orchestrated by Airflow/Kubeflow/Dagster) → experiment tracking → registry → serving (batch/online) → monitoring → feedback/labelling → retraining. Provide self-service templates, governance and cost controls.

### Q122. Build vs buy
Buy/use managed services (SageMaker, Vertex, Azure ML, Databricks) to cut time to value for standard needs; build when you need custom control, cost efficiency at scale, data residency, or differentiation. Consider lock-in and team skills.

### Q123. Organising ML teams
Embedded data scientists in product teams + a platform team for tooling + ML engineers for productionisation. Clear ownership of models in production, on-call, SLAs, and shared standards (review, testing, documentation).

### Q124. ML technical debt
Entangled features (CACE: Changing Anything Changes Everything), undeclared consumers, data dependencies, glue code, pipeline jungles, config sprawl, dead experimental code. Mitigate with modular pipelines, tests, feature ownership and deprecation policies.

### Q125. Testing ML systems
Unit tests for transformations, schema/data tests, model tests (minimum performance, invariance, directional expectation, slice checks), integration tests for pipelines, regression tests against a golden dataset, and load tests for serving.

### Q126. Monitoring strategy
Layers: infra (latency, errors), data (schema, nulls, drift), model (score distribution, calibration), outcome (delayed labels, business KPIs), fairness. Alerts with severity, runbooks, and ownership.

### Q127. Governance and compliance
Data lineage, access control, PII minimisation, consent, retention, DPIA, model documentation (model cards), audit trails, approval gates, and regulations (GDPR, India's DPDP Act, sector rules, EU AI Act risk tiers). Verify current legal details with counsel.

### Q128. Cost management
Right-size compute, spot/preemptible instances for training, autoscale endpoints, batch where real-time isn't needed, cache predictions, track cost per prediction and per experiment, remove unused models.

### Q129. Roadmap and prioritisation
Score opportunities by business impact, feasibility (data, signal), time-to-value, risk, and reuse. Start with high-value, low-complexity wins; build platform capabilities in parallel. Keep a kill criterion for each project.

### Q130. Communicating with stakeholders
Translate metrics to money and risk, show baselines, explain trade-offs (precision vs recall) with examples, be honest about uncertainty, give timelines with milestones, and use visuals over jargon.

### Q131. Safe rollout of a high-risk model
Offline validation → shadow → human-in-the-loop → small canary with guardrails → gradual ramp with automatic rollback → post-launch review. Keep a rules-based fallback.

### Q132. Handling model failure incidents
Detect (alerts) → mitigate (roll back or fall back) → diagnose (data, code, drift) → fix → postmortem (blameless) → add tests/monitors. Maintain a model "kill switch".

### Q133. Reproducible research to production gap
Notebooks → modular code, tests, CI, containers, config-driven pipelines, same preprocessing for train/serve, code review. Define a "definition of done" for production-ready models.

### Q134. Responsible AI program
Risk assessment per use case, bias testing, explainability requirements, privacy techniques (anonymisation, differential privacy, federated learning), human oversight, incident process, and training for teams.

### Q135. Evaluating vendor / AutoML tools
Benchmark on your data with the same protocol, check leakage handling, explainability, deployment, security, cost, and exportability. AutoML is great for baselines, but not a substitute for problem framing.

---

# 💻 Part 6: Hands-On Tasks & Code

### Task 1. Full classification pipeline with CV and tuning
```python
import pandas as pd
from sklearn.model_selection import train_test_split, StratifiedKFold, RandomizedSearchCV
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.metrics import classification_report, average_precision_score

df = pd.read_csv("churn.csv")
y = df.pop("churned")
X_tr, X_te, y_tr, y_te = train_test_split(df, y, test_size=0.2, stratify=y, random_state=42)

num = X_tr.select_dtypes("number").columns
cat = X_tr.select_dtypes(exclude="number").columns
pre = ColumnTransformer([
    ("num", SimpleImputer(strategy="median"), num),
    ("cat", OneHotEncoder(handle_unknown="ignore"), cat),
])
pipe = Pipeline([("pre", pre), ("clf", HistGradientBoostingClassifier(random_state=42))])

search = RandomizedSearchCV(
    pipe,
    {"clf__learning_rate": [0.03, 0.05, 0.1], "clf__max_depth": [3, 5, None],
     "clf__l2_regularization": [0, 0.1, 1.0]},
    n_iter=10, cv=StratifiedKFold(5, shuffle=True, random_state=42),
    scoring="average_precision", n_jobs=-1, random_state=42,
)
search.fit(X_tr, y_tr)
proba = search.predict_proba(X_te)[:, 1]
print("PR-AUC:", average_precision_score(y_te, proba))
print(classification_report(y_te, proba > 0.4))
```

### Task 2. Find the best threshold for a cost matrix
```python
import numpy as np
thr = np.linspace(0.05, 0.95, 91)
cost_fn, cost_fp = 5000, 50
costs = []
for t in thr:
    pred = proba >= t
    fn = ((~pred) & (y_te == 1)).sum()
    fp = (pred & (y_te == 0)).sum()
    costs.append(fn * cost_fn + fp * cost_fp)
best = thr[int(np.argmin(costs))]
```

### Task 3. Regression with log target and residual check
```python
from sklearn.compose import TransformedTargetRegressor
from sklearn.linear_model import RidgeCV
from sklearn.metrics import mean_absolute_error
reg = TransformedTargetRegressor(RidgeCV(alphas=[0.1, 1, 10]), func=np.log1p, inverse_func=np.expm1)
reg.fit(X_tr_num, y_tr)
resid = y_te - reg.predict(X_te_num)
print(mean_absolute_error(y_te, reg.predict(X_te_num)), resid.describe())
```

### Task 4. Implement logistic regression from scratch (NumPy)
```python
import numpy as np
def sigmoid(z): return 1 / (1 + np.exp(-z))

def fit_logreg(X, y, lr=0.1, epochs=500, l2=0.0):
    n, d = X.shape
    w, b = np.zeros(d), 0.0
    for _ in range(epochs):
        p = sigmoid(X @ w + b)
        grad_w = X.T @ (p - y) / n + l2 * w
        grad_b = (p - y).mean()
        w -= lr * grad_w
        b -= lr * grad_b
    return w, b
```
Remember to standardise `X` first. Gradient of log-loss is `Xᵀ(p−y)/n`.

### Task 5. K-Means from scratch
```python
def kmeans(X, k, iters=100, seed=0):
    rng = np.random.default_rng(seed)
    C = X[rng.choice(len(X), k, replace=False)]
    for _ in range(iters):
        d = ((X[:, None, :] - C[None]) ** 2).sum(-1)
        lab = d.argmin(1)
        newC = np.array([X[lab == j].mean(0) if (lab == j).any() else C[j] for j in range(k)])
        if np.allclose(newC, C): break
        C = newC
    return lab, C
```

### Task 6. Time-series CV with lag features
```python
from sklearn.model_selection import TimeSeriesSplit
df = df.sort_values("date")
df["lag_1"] = df["sales"].shift(1)
df["roll_7"] = df["sales"].shift(1).rolling(7).mean()   # shift first: no leakage
df = df.dropna()
tscv = TimeSeriesSplit(n_splits=5)
```

### Task 7. SHAP for a tree model
```python
import shap
model = search.best_estimator_.named_steps["clf"]
Xt = search.best_estimator_.named_steps["pre"].transform(X_te)
explainer = shap.TreeExplainer(model)
sv = explainer.shap_values(Xt)
shap.summary_plot(sv, Xt)
```

### Task 8. Calibrate a classifier
```python
from sklearn.calibration import CalibratedClassifierCV, calibration_curve
cal = CalibratedClassifierCV(pipe, method="isotonic", cv=5).fit(X_tr, y_tr)
frac_pos, mean_pred = calibration_curve(y_te, cal.predict_proba(X_te)[:, 1], n_bins=10)
```

### Task 9. PCA + K-Means customer segmentation
```python
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
Z = PCA(n_components=0.95).fit_transform(StandardScaler().fit_transform(X))
for k in range(2, 9):
    lab = KMeans(k, n_init="auto", random_state=0).fit_predict(Z)
    print(k, silhouette_score(Z, lab))
```

### Task 10. Serve a model with FastAPI
```python
from fastapi import FastAPI
from pydantic import BaseModel
import joblib, pandas as pd

app = FastAPI()
model = joblib.load("churn_v3.joblib")

class Customer(BaseModel):
    tenure: int
    monthly_charges: float
    contract: str

@app.post("/predict")
def predict(c: Customer):
    p = float(model.predict_proba(pd.DataFrame([c.model_dump()]))[0, 1])
    return {"churn_probability": p, "model_version": "v3"}
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. CV AUC = 0.99 but production AUC = 0.65
Likely leakage or skew. Check features unavailable at prediction time, duplicates across splits, preprocessing before split, time order, and compare train vs serving feature distributions.

### D2. Train accuracy 100%, test 70%
Overfitting. Reduce depth, add regularisation/min leaf size, more data, early stopping, feature pruning, check duplicates in train.

### D3. Both train and test scores are poor
Underfitting or no signal. Add features, try a more flexible model, fix label quality, check data bugs (wrong joins, shifted labels), confirm a baseline beats random.

### D4. Model predicts only the majority class
Imbalance with default threshold/loss. Use class weights, PR-AUC, lower threshold, resampling inside CV, or anomaly framing.

### D5. Results change on every run
Unseeded randomness. Set `random_state`, fix split seeds, control multi-threading and library versions; report mean ± std over seeds.

### D6. Logistic regression "did not converge"
Scale features, increase `max_iter`, try a different solver, check for perfect separation or huge-magnitude features.

### D7. Linear model coefficients flip sign after adding a feature
Multicollinearity. Check VIF, remove or combine correlated features, use Ridge.

### D8. K-Means gives weird clusters
Unscaled features dominate distance; outliers pull centroids; wrong `k`; categorical data forced into Euclidean space. Scale, remove outliers, try GMM/DBSCAN, use k-prototypes for mixed data.

### D9. XGBoost validation loss rises after round 50
Overfitting. Lower the learning rate, add early stopping, reduce depth, increase `min_child_weight`, add subsampling and regularisation.

### D10. `ValueError: Found unknown categories` in production
New category not seen in training. Use `OneHotEncoder(handle_unknown="ignore")` and monitor category drift.

### D11. Accuracy dropped after a pipeline refactor
Feature order/column mismatch, different imputation, a new null encoding, library version change. Compare serialised pipeline outputs on a golden sample.

### D12. Great offline metrics, no business lift
Metric mismatch, feedback loops, selection bias, UI effects, novelty effects, or small test power. Review the A/B design and metric definitions.

### D13. Memory error when one-hot encoding
High-cardinality categories create giant matrices. Use sparse output, hashing, target/frequency encoding, or native categorical support.

### D14. SMOTE improved CV but not test
SMOTE applied before splitting (synthetic neighbours leak). Apply it only inside training folds using `imblearn.pipeline.Pipeline`.

### D15. Feature importance says ID column is the top feature
Row order or ID encodes time or the label (leak). Drop IDs; check how rows were created.

---

# 🧩 Part 8: Tricky Questions

### T1. Can AUC be high while precision is poor?
Yes, especially with heavy imbalance. AUC measures ranking over all thresholds; precision at your operating point can still be low. Check PR-AUC.

### T2. Is more data always better?
Not for high-bias models, noisy labels, or biased sampling. More data helps variance-limited models; check learning curves.

### T3. Is R² always between 0 and 1?
No. On held-out data it can be negative if the model is worse than predicting the mean.

### T4. Does Random Forest overfit by adding more trees?
No; more trees stabilise the variance. Individual deep trees overfit, but the average doesn't get worse with `n_estimators`.

### T5. Does a high-accuracy model guarantee good probabilities?
No. Ranking accuracy and calibration are separate properties.

### T6. Do trees need one-hot encoding?
Not always; many implementations handle categories natively. In scikit-learn `RandomForest` needs numeric input, but `HistGradientBoosting` can take categorical features.

### T7. Is feature scaling required for logistic regression?
Not for correctness, but it helps optimisation and makes regularisation fair across features, so effectively yes.

### T8. Is ensemble always better?
Not if models are highly correlated, or the cost/latency outweighs the gain.

### T9. Is deleting outliers good practice?
Only if they are errors. Otherwise, the outliers may be the signal (fraud) and removing them hides real cases.

### T10. Is cross-validation a replacement for a test set?
No. If you tune on CV scores, they become optimistic; keep a final untouched test set (or use nested CV).

### T11. Is higher `k` in kNN always smoother?
Higher `k` lowers variance and raises bias. Too large `k` approaches predicting the majority class.

### T12. Can PCA hurt a model?
Yes; variance is not the same as predictive signal. Low-variance directions may be the predictive ones. Evaluate with CV.

### T13. Does `class_weight="balanced"` give calibrated probabilities?
No; it shifts the probability scale. Recalibrate if you need real probabilities.

### T14. Is gradient boosting always better than deep learning for tabular data?
Often on small/medium tabular data, but not guaranteed. Neural nets shine with massive data, embeddings and multimodal inputs.

### T15. Why can adding a feature reduce performance?
Noise features raise variance, may introduce leakage-like instability, or cause drift risks. Regularise or select.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- Bias = too simple; variance = too sensitive to data.
- L1 → sparse; L2 → small weights.
- Bagging reduces variance; boosting reduces bias.
- Fit scalers on train only.
- Precision = TP/(TP+FP); recall = TP/(TP+FN).
- PR-AUC for imbalance; ROC-AUC for balanced ranking.
- K-Means needs scaling and `k`; DBSCAN needs `eps`.
- PCA = max variance directions; needs scaling.
- Trees don't need scaling and can't extrapolate.
- SVM RBF: high `gamma` or `C` → overfit.
- Logistic regression is a classifier despite the name.
- `stratify=y` preserves class ratios.
- Use `TimeSeriesSplit` for time data.
- Target encoding needs out-of-fold computation.
- SHAP explains the model, not causality.
- Calibrate when you use probabilities for decisions.
- Early stopping needs a validation set.
- Feature importance (MDI) is biased to high-cardinality features.
- Always compare with a simple baseline.
- Monitor drift: PSI, KS, score distribution.
- Training-serving skew: use shared code and a feature store.
- A/B test for real business impact.
- Never touch the test set until the end.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about an ML project you shipped
Structure (STAR): problem and metric → data and labels → baseline → features and models tried → validation design → results (numbers) → deployment and monitoring → business impact → what you'd improve. Example: "Churn model for a subscription app. Baseline logistic regression PR-AUC 0.31; LightGBM with behavioural aggregates 0.47; threshold chosen by cost; retention campaign lifted saves by 12% in an A/B test."

### P2. A time you found data leakage
Describe the symptom (too-good CV), the investigation (feature availability audit, importance analysis), the fix (point-in-time features), the metric drop (honest), and the safeguards added (leakage checks in CI, feature review).

### P3. A model that failed in production
Explain detection, root cause (drift, skew, bug), mitigation (rollback), the fix, and added monitors/tests. Show ownership and learning, not blame.

### P4. How did you decide between two models?
Same CV protocol, confidence intervals, slice analysis, latency/cost, interpretability, maintenance. Pick the simpler one unless the gain is meaningful and stable.

### P5. How do you explain a model to non-technical stakeholders?
Use business language, examples, top reasons per prediction, confusion-matrix outcomes in money terms, and clear limits of the model.

### P6. How do you handle ambiguous requirements?
Clarify the decision to be improved, define success metrics and constraints, run a quick baseline for feasibility, and agree on milestones.

### P7. How do you prioritise experiments?
Expected impact × probability of success ÷ effort. Do error analysis first; most gains come from data and features, not exotic models.

### P8. How do you mentor juniors in ML?
Teach the baseline-first mindset, review code and experiment design, pair on error analysis, and share checklists (leakage, validation, reproducibility).

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- ML basics: types of learning, features/labels, train/val/test, bias-variance, over/underfitting.
- Linear models: linear/logistic regression, regularisation, GLMs.
- Trees and ensembles: CART, random forest, boosting (XGBoost/LightGBM/CatBoost), stacking.
- Other models: kNN, SVM, naive Bayes, GMM.
- Unsupervised: K-Means, hierarchical, DBSCAN, PCA, t-SNE/UMAP, anomaly detection.
- Data prep: scaling, encoding, imputation, outliers, feature engineering and selection.
- Evaluation: metrics, CV variants, thresholds, calibration, significance.
- Tuning: grid/random/Bayesian, early stopping, nested CV.
- Pipelines: `Pipeline`, `ColumnTransformer`, leakage control.
- Interpretability: importance, SHAP, LIME, PDP.
- Production: serving, monitoring, drift, retraining, feature stores, fairness, governance.
- Special: imbalance, time series, recommenders, ranking, uplift, bandits, semi-supervised.

## Mixed topics
- Calibration + thresholds + business cost.
- Leakage + time series + point-in-time features.
- Boosting + imbalance + PR-AUC.
- PCA + clustering + scaling.
- SHAP + fairness + regulation.
- Drift + retraining + canary rollout.

---

# 🔬 Part 12: Internals

### How a decision tree chooses a split
For each feature and candidate threshold, compute the impurity decrease (Gini/entropy/variance). Pick the best; recurse on children until a stopping rule (depth, min samples, no gain). Histogram-based methods bin features into ≤255 buckets to scan fast.

### Random forest mechanics
Each tree gets a bootstrap sample (~63.2% unique rows; the rest are OOB) and considers a random subset of features at each split. Prediction = average (regression) or majority/mean probability (classification). Decorrelated trees → variance reduction.

### Gradient boosting mechanics
Start with a constant prediction. For `m = 1..M`: compute gradients (and Hessians in XGBoost) of the loss; fit a small tree; compute optimal leaf values with regularisation; add `η ×` tree to the model.

### Logistic regression optimisation
Convex log-loss; solved by L-BFGS, Newton, SAG/SAGA or liblinear. Gradient: `Xᵀ(p − y)`. With separable data and no regularisation, weights diverge.

### SVM
Solves a convex quadratic program maximising the margin; only **support vectors** matter in the final model. The kernel trick computes inner products in a high-dimensional feature space without explicitly mapping.

### K-Means objective
Minimises within-cluster sum of squares (inertia) with Lloyd's algorithm: alternates assignment and update steps; converges to a local optimum; `k-means++` seeds spread-out centroids.

### PCA via SVD
Centre `X`; compute SVD `X = UΣVᵀ`; principal directions are rows of `Vᵀ`; explained variance = `σ²/(n−1)`. Projection = `X V_k`.

### Why regularisation works
It constrains weight magnitude, reducing variance. In Bayesian terms L2 is a Gaussian prior, L1 a Laplace prior (MAP estimate).

### scikit-learn estimator API
`fit`, `predict`, `transform`, `predict_proba`, `score`; hyper-parameters are constructor args; learned attributes end with `_`. `clone` creates an unfitted copy, which is how CV and search work.

### Cross-validation mechanics
For each fold, clone the pipeline, fit on the train indices, score on validation indices, aggregate. Pipelines ensure per-fold preprocessing.

---

# 📊 Part 13: Reference Tables

### Algorithm cheat table
| Algorithm | Strengths | Weaknesses | Needs scaling? |
|---|---|---|---|
| Linear/Logistic | Fast, interpretable | Linear boundary | Yes |
| kNN | Simple, no training | Slow predict, high-dim | Yes |
| Decision tree | Interpretable | Overfits | No |
| Random forest | Robust, low tuning | Larger, less interpretable | No |
| Gradient boosting | Top tabular accuracy | Tuning, overfit risk | No |
| SVM | Good in high-dim, small data | Slow at scale | Yes |
| Naive Bayes | Fast, text | Independence assumption | No |
| K-Means | Simple clustering | Needs k, spherical | Yes |
| DBSCAN | Arbitrary shapes, noise | eps sensitivity | Yes |
| PCA | Compression, denoise | Linear, less interpretable | Yes |

### Metric choice
| Situation | Metric |
|---|---|
| Balanced classes | Accuracy, F1, ROC-AUC |
| Imbalanced | PR-AUC, recall@precision, F1, cost |
| Probabilities used | Log-loss, Brier, calibration |
| Regression, outliers matter | RMSE |
| Regression, robust | MAE, Huber |
| Ranking | NDCG@k, MAP, MRR |
| Clustering | Silhouette, Davies-Bouldin, ARI (with labels) |
| Forecasting | MAE, RMSE, sMAPE, MASE |

### Imbalance techniques
| Technique | Where | Note |
|---|---|---|
| Class weights | Model | Simple first step |
| Under-sampling | Train only | Loses data |
| SMOTE | Train folds only | Can create noise |
| Threshold tuning | Post-model | Cheap and effective |
| Focal loss | Deep models | Focus on hard cases |

### Common sklearn scalers/encoders
| Tool | Use |
|---|---|
| `StandardScaler` | Roughly Gaussian features |
| `MinMaxScaler` | Bounded range needed |
| `RobustScaler` | Outliers |
| `OneHotEncoder` | Nominal categories |
| `OrdinalEncoder` | Ordered categories / tree input |
| `TargetEncoder` | High cardinality (sklearn ≥1.3, uses internal CV) |

### Drift metrics
| Metric | Meaning |
|---|---|
| PSI | <0.1 stable, 0.1–0.25 moderate, >0.25 large shift (rule of thumb) |
| KS test | Distribution distance for continuous features |
| Chi-square | Categorical shifts |
| JS / KL divergence | Distribution difference |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
```python
from sklearn.metrics import precision_score, recall_score
y_true = [1, 1, 1, 0, 0, 0, 0, 0]
y_pred = [1, 1, 0, 1, 0, 0, 0, 0]
print(precision_score(y_true, y_pred), recall_score(y_true, y_pred))
```
TP=2, FP=1, FN=1. **Output: `0.666... 0.666...`**

### O2.
Dataset has 990 negatives, 10 positives. A model predicts all negative. Accuracy / recall?
**Accuracy 0.99, recall 0.0.**

### O3.
```python
from sklearn.metrics import accuracy_score
accuracy_score([0, 1, 1, 0], [0, 1, 0, 0])
```
**`0.75`**

### O4.
After standardising, a feature's mean and std on the training set are:
**mean ≈ 0, std ≈ 1** (on the test set they will be close but not exact).

### O5.
```python
from sklearn.preprocessing import OneHotEncoder
OneHotEncoder().fit_transform([["a"], ["b"], ["a"]]).toarray()
```
**`[[1,0],[0,1],[1,0]]`**

### O6.
F1 with precision 0.5 and recall 1.0:
`2·0.5·1/(1.5)` = **0.667**

### O7.
A 5-fold CV gives scores `[0.80, 0.82, 0.78, 0.81, 0.79]`. Mean ± std?
**0.80 ± ~0.014** (sample std ≈ 0.0158).

### O8.
Gini impurity for a node with 50% / 50% classes: `1 − (0.25+0.25)` = **0.5**. Pure node = **0**.

### O9.
Entropy for 50/50: `−(0.5·log₂0.5 ·2)` = **1 bit**.

### O10.
```python
w = 0.5; lr = 0.1; grad = 2.0
w = w - lr * grad
```
**`0.3`**

### O11.
`sigmoid(0)` = **0.5**. `sigmoid(large positive)` → **≈1**.

### O12.
kNN with k=3, neighbours' labels `[1, 0, 1]` → predicts **1** (majority).

---

# ✅ Part 15: MCQs

**1. Which technique reduces variance by averaging independent models?**
A) Boosting  B) Bagging  C) Pruning  D) PCA
**Answer: B**

**2. Which regularisation can set coefficients exactly to zero?**
A) L2  B) L1  C) Dropout only  D) None
**Answer: B**

**3. Best metric for a 0.5%-positive fraud dataset?**
A) Accuracy  B) PR-AUC  C) R²  D) MAE
**Answer: B**

**4. Fitting a scaler on the entire dataset before splitting causes:**
A) Underfitting  B) Data leakage  C) Faster training  D) Nothing
**Answer: B**

**5. Which algorithm does NOT require feature scaling?**
A) kNN  B) SVM  C) Random forest  D) Logistic regression
**Answer: C**

**6. High training score and low validation score indicates:**
A) Underfitting  B) Overfitting  C) Perfect model  D) Leakage only
**Answer: B**

**7. Boosting primarily reduces:**
A) Variance only  B) Bias (and some variance)  C) Noise in labels  D) Latency
**Answer: B**

**8. Which CV is right for time-ordered data?**
A) KFold(shuffle=True)  B) StratifiedKFold  C) TimeSeriesSplit  D) LeaveOneOut
**Answer: C**

**9. The elbow method is used to choose:**
A) Learning rate  B) Number of clusters  C) Tree depth  D) Threshold
**Answer: B**

**10. PCA picks components that maximise:**
A) Accuracy  B) Variance  C) Sparsity  D) Margin
**Answer: B**

**11. Calibration is checked with:**
A) Confusion matrix  B) Reliability curve / Brier score  C) Silhouette  D) VIF
**Answer: B**

**12. SMOTE should be applied:**
A) Before the split  B) On the test set  C) Only to training folds  D) After evaluation
**Answer: C**

**13. Which loss does logistic regression minimise?**
A) MSE  B) Hinge  C) Log-loss  D) MAE
**Answer: C**

**14. Which of these can't extrapolate beyond the training range?**
A) Linear regression  B) Decision tree  C) Ridge  D) Lasso
**Answer: B**

**15. A negative R² on test data means:**
A) A bug always  B) Worse than predicting the mean  C) Perfect fit  D) Overfit only
**Answer: B**

**16. For high-cardinality categoricals with leakage-safe handling, use:**
A) Naive target mean on all data  B) Out-of-fold smoothed target encoding  C) Label encoding the target  D) Dropping the train set
**Answer: B**

**17. Which shows how much a feature contributes to an individual prediction?**
A) MDI  B) SHAP  C) PSI  D) ROC
**Answer: B**

**18. Training-serving skew is best prevented by:**
A) Bigger models  B) Shared transformation code and feature store  C) More epochs  D) Lower learning rate
**Answer: B**

---

# ⚠️ Part 16: Common Mistakes

- Preprocessing (scaling, imputing, selecting features) before the train/test split.
- Reporting accuracy on imbalanced data.
- Tuning on the test set; no final holdout.
- Random split for time-dependent or grouped data.
- Using features that won't exist at prediction time.
- Not setting a baseline (dummy model, simple heuristic).
- Ignoring calibration when probabilities drive decisions.
- Over-trusting impurity feature importance.
- Resampling before CV.
- One-hot encoding huge cardinalities blindly.
- Forgetting to fix random seeds and log versions.
- Treating SHAP/PDP as causal.
- Comparing models on different splits.
- Deploying without monitoring, rollback or ownership.
- Optimising an offline metric disconnected from the business goal.
- Dropping missing-value information that was predictive.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You ask about the decision, cost of errors and data availability **before** picking a model.
- You start with baselines and error analysis, not hyper-parameter search.
- You treat leakage and validation design as first-class concerns, especially point-in-time correctness.
- You talk about calibration, thresholds and costs, not just AUC.
- You use pipelines, tests, versioned data and tracked experiments by default.
- You think about training-serving skew, drift, feedback loops and rollback.
- You can explain trade-offs (GBM vs linear, batch vs real-time, accuracy vs latency) in business terms.
- You quantify uncertainty and test for significance before declaring wins.
- You consider fairness, privacy and regulatory needs early.
- You tell stories with numbers: baseline → improvement → business impact.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Core formulas
```
MSE = mean((y - ŷ)²)         RMSE = √MSE        MAE = mean(|y - ŷ|)
Precision = TP/(TP+FP)       Recall = TP/(TP+FN)  F1 = 2PR/(P+R)
sigmoid(z) = 1/(1+e^-z)      logloss = -mean(y log p + (1-y) log(1-p))
Gini = 1 - Σp²               Entropy = -Σ p log2 p
Ridge: loss + λΣw²           Lasso: loss + λΣ|w|
```

### sklearn snippets
```python
Pipeline([("pre", ColumnTransformer([...])), ("model", Estimator())])
cross_val_score(pipe, X, y, cv=StratifiedKFold(5, shuffle=True, random_state=0), scoring="average_precision")
RandomizedSearchCV(pipe, params, n_iter=20, cv=5, scoring="f1", n_jobs=-1)
CalibratedClassifierCV(pipe, method="isotonic", cv=5)
```

### Workflow
Problem → metric → baseline → split correctly → pipeline → CV → tune → error analysis → calibrate/threshold → explain → deploy → monitor → retrain.

### Decision guide
- Tabular, mixed types → gradient boosting.
- Need interpretability → regularised GLM / GAM / shallow tree / monotonic GBM.
- Small data → simple models + strong CV.
- Text / images / audio → deep learning (see `057_Deep-Learning.md`).
- No labels → clustering, anomaly detection, self-supervision.
- Time series → lag features + time-aware CV.

### Final checklist before the interview
- [ ] Explain bias-variance, over/underfitting and their remedies.
- [ ] Derive/describe linear and logistic regression, L1 vs L2.
- [ ] Compare random forest, boosting, SVM, kNN and when to use each.
- [ ] Pick metrics for imbalance; draw ROC vs PR; set thresholds by cost.
- [ ] Build a leak-free sklearn pipeline with CV and tuning.
- [ ] Explain leakage, point-in-time features and training-serving skew.
- [ ] Use SHAP / permutation importance and know their limits.
- [ ] Handle imbalance, missing data, outliers, high-cardinality categories.
- [ ] Describe calibration, drift monitoring, retraining and safe rollout.
- [ ] Prepare a project story with baseline, metric gain, business impact and a failure lesson.
