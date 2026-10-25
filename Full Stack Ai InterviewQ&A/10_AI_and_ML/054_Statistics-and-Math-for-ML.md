# Statistics & Math for Machine Learning Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide covers the maths and statistics that machine learning interviews ask about in 2025–2026: descriptive statistics, probability, distributions, Bayes' theorem, estimation (MLE/MAP), hypothesis testing and A/B testing, confidence intervals, regression, bias-variance, linear algebra (vectors, matrices, eigen/SVD, PCA), calculus and optimisation (gradients, backpropagation, SGD/Adam), information theory (entropy, cross-entropy, KL), and the maths behind evaluation metrics and modern deep learning. Code examples use **Python 3.11+, NumPy 1.26+/2.x, SciPy 1.11+, pandas 2.x, statsmodels 0.14 and scikit-learn 1.4+**. Formulas are written in plain text so they render everywhere. Examples use the sample name **Ritesh Kumar**.
> This file covers data types and summary statistics, probability rules, random variables, common distributions, expectation and variance, law of large numbers and central limit theorem, sampling, estimation, hypothesis tests (z, t, chi-square, ANOVA, non-parametric), p-values, power, multiple testing, A/B testing, correlation vs causation, linear and logistic regression theory, regularisation, bias-variance, linear algebra, calculus, optimisation, information theory, Bayesian thinking, time series basics, and metric maths. Related topics: Pandas/NumPy in `055_Pandas-and-NumPy.md`, machine learning in `056_Machine-Learning.md`, deep learning in `057_Deep-Learning.md`, PyTorch in `058_PyTorch.md`, NLP in `059_NLP.md`, reinforcement learning in `061_Reinforcement-Learning.md`, MLOps in `074_MLOps.md`, Python in `../03_Backend/014_Python.md`, SQL in `../04_Database/026_SQL.md`, DSA in `../08_CS_Fundamentals/022_Data-Structures-and-Algorithms.md`.

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

### Q1. Why do we need statistics and maths in machine learning? *(Must-know)*
ML models learn patterns from data. Statistics tells us how to describe data, measure uncertainty and test whether a result is real or luck. Linear algebra stores and transforms data (vectors, matrices). Calculus lets models learn (gradients). Probability lets models handle uncertainty. Without them you can run a library but cannot debug or explain it.

### Q2. Population vs sample *(Must-know)*
Population is the whole group you care about (all customers). Sample is the part you actually measure. We use sample statistics (mean x̄) to estimate population parameters (mean μ). A sample must be random and representative, or the estimate is biased.

### Q3. Types of data
- **Numerical:** continuous (height) or discrete (number of orders).
- **Categorical:** nominal (city, no order) or ordinal (low/medium/high, has order).
Type decides which statistic, plot and model you can use.

### Q4. Mean, median and mode *(Must-know)*
Mean = sum / count (sensitive to outliers). Median = middle value (robust). Mode = most frequent value. For skewed data like salary, median describes the typical value better. Right-skewed: mean > median. Left-skewed: mean < median.

### Q5. Variance and standard deviation *(Must-know)*
Variance = average squared distance from the mean. Population: σ² = Σ(x − μ)² / N. Sample: s² = Σ(x − x̄)² / (n − 1). Standard deviation = √variance, in the same unit as the data.

### Q6. Why divide by n − 1 (Bessel's correction)?
The sample mean is closer to the sample points than the true mean is, so dividing by n underestimates the variance. Using n − 1 makes the sample variance an **unbiased** estimator. One degree of freedom is "used" to estimate the mean.

### Q7. Range, quartiles and IQR
Range = max − min. Q1 (25th percentile), Q2 (median), Q3 (75th percentile). IQR = Q3 − Q1. A common outlier rule: below Q1 − 1.5·IQR or above Q3 + 1.5·IQR (box-plot whiskers).

### Q8. Percentiles
The p-th percentile is the value below which p% of the data fall. p95 latency means 95% of requests are faster. Use `np.percentile(data, 95)`.

### Q9. Skewness and kurtosis
Skewness measures asymmetry (0 = symmetric). Kurtosis measures tail heaviness; excess kurtosis 0 is normal-like, positive means heavy tails (more outliers).

### Q10. Outliers: how to detect and handle
Detect with IQR rule, z-score (|z| > 3), box plots, isolation forest. Handle by checking if it is an error, capping (winsorizing), transforming (log), using robust methods (median, Huber loss), or keeping it if it is real and important (fraud).

### Q11. Basic probability *(Must-know)*
P(A) = favourable outcomes / total outcomes (equally likely). 0 ≤ P ≤ 1; P(not A) = 1 − P(A). Example: probability of a 6 on a fair die = 1/6.

### Q12. Addition and multiplication rules
- P(A or B) = P(A) + P(B) − P(A and B).
- P(A and B) = P(A) · P(B | A). If independent: P(A) · P(B).
Example: two heads in two fair flips = 0.5 × 0.5 = 0.25.

### Q13. Independent vs mutually exclusive events
Independent: one event does not change the other's probability. Mutually exclusive: they cannot happen together (P(A and B) = 0). Mutually exclusive events with non-zero probability are **dependent**, not independent.

### Q14. Conditional probability
P(A | B) = P(A and B) / P(B): the probability of A given that B happened. Example: P(spam | contains "free").

### Q15. Bayes' theorem *(Must-know)*
P(A | B) = P(B | A) · P(A) / P(B).
Example: a disease affects 1% of people. A test has 99% sensitivity and 95% specificity (5% false positive). If you test positive: P(D|+) = (0.99 × 0.01) / (0.99 × 0.01 + 0.05 × 0.99) ≈ 0.0099 / 0.0594 ≈ **16.7%**. The low base rate dominates.

### Q16. Prior, likelihood, posterior
Prior = belief before data. Likelihood = how probable the data is under a hypothesis. Posterior ∝ likelihood × prior. Basis of Naive Bayes and Bayesian inference.

### Q17. Random variable, PMF, PDF, CDF
A random variable maps outcomes to numbers. Discrete: **PMF** gives P(X = x). Continuous: **PDF** gives density (probability is area under the curve; P(X = exact value) = 0). **CDF** F(x) = P(X ≤ x), valid for both.

### Q18. Expected value
E[X] = Σ x · P(x) (discrete) or ∫ x f(x) dx (continuous). It is the long-run average. Linear: E[aX + b] = a·E[X] + b, and E[X + Y] = E[X] + E[Y] always.

### Q19. Variance of a random variable
Var(X) = E[X²] − (E[X])². Var(aX + b) = a² Var(X). For independent X, Y: Var(X + Y) = Var(X) + Var(Y).

### Q20. Normal (Gaussian) distribution *(Must-know)*
Bell curve defined by mean μ and standard deviation σ. Empirical rule: ~68% within 1σ, ~95% within 2σ, ~99.7% within 3σ. **Standard normal** has μ = 0, σ = 1. Z-score: z = (x − μ) / σ.

### Q21. Bernoulli and binomial
Bernoulli: one trial, success probability p. Binomial(n, p): number of successes in n independent trials. Mean = np, variance = np(1 − p).

### Q22. Poisson distribution
Counts of events in a fixed interval at average rate λ (support tickets per hour). Mean = variance = λ.

### Q23. Uniform and exponential
Uniform: all values in [a, b] equally likely. Exponential(λ): waiting time between Poisson events; mean 1/λ; memoryless.

### Q24. Law of large numbers
As sample size grows, the sample mean converges to the true mean. This is why more data gives more stable estimates.

### Q25. Central limit theorem (CLT) *(Must-know)*
The distribution of the sample mean approaches a normal distribution as n grows (roughly n ≥ 30 as a rule of thumb), with mean μ and standard deviation σ/√n, **whatever the shape of the original data** (finite variance). It is the reason many tests and confidence intervals work.

### Q26. Standard error
SE of the mean = s / √n. It measures how much the sample mean varies between samples. Quadrupling n halves the SE.

### Q27. Correlation
Pearson's r measures **linear** relation, from −1 to +1. Spearman's ρ uses ranks (monotonic, robust to outliers). Correlation 0 does not mean independence (e.g., y = x² over symmetric x).

### Q28. Correlation vs causation *(Must-know)*
Two variables may move together because of a confounder or chance. Only randomized experiments (A/B tests) or careful causal methods support causal claims. Example: ice-cream sales and drowning both rise in summer.

### Q29. Covariance
Cov(X, Y) = E[(X − μx)(Y − μy)]. Positive: move together. Scale-dependent; correlation = covariance / (σx σy) is the scaled version.

### Q30. Basic vectors and matrices in ML
A data row is a vector; a dataset is a matrix X (n samples × d features). Predictions are often a matrix–vector product: ŷ = Xw + b. This is why GPUs (matrix hardware) matter.

---

# 🔵 Part 2: Junior (1–3 years)

### Q31. Confidence intervals *(Must-know)*
A 95% CI for the mean: x̄ ± t* · s/√n. Correct meaning: if we repeated the sampling many times, 95% of such intervals would contain the true mean. It is **not** "95% probability the true mean is in this particular interval" (a frequentist subtlety).

### Q32. Hypothesis testing steps *(Must-know)*
1. State H0 (null: no effect) and H1 (alternative). 2. Choose significance level α (usually 0.05). 3. Compute a test statistic. 4. Get the p-value. 5. If p < α, reject H0; else fail to reject. State the effect size and practical meaning too.

### Q33. What is a p-value? *(Must-know)*
The probability of seeing data at least as extreme as ours **if H0 is true**. It is not the probability that H0 is true, and not the probability of a mistake. A small p-value says the data are unlikely under H0.

### Q34. Type I and Type II errors; power
Type I (false positive): reject a true H0; rate = α. Type II (false negative): fail to reject a false H0; rate = β. **Power = 1 − β** (probability of detecting a real effect). More data, bigger effects and higher α raise power.

### Q35. One-tailed vs two-tailed tests
Two-tailed checks for any difference; one-tailed checks a specific direction and has more power in that direction. Decide before looking at data.

### Q36. z-test vs t-test
z-test: population σ known or n large. t-test: σ unknown, uses sample s, heavier tails (degrees of freedom n − 1). Types: one-sample, two-sample (independent), paired.

### Q37. Two-sample t-test in Python
```python
from scipy import stats
a = [12.1, 11.8, 13.0, 12.6, 12.2]
b = [13.1, 12.9, 13.8, 13.5, 13.0]
t, p = stats.ttest_ind(a, b, equal_var=False)   # Welch's t-test (safer)
```
Welch's version does not assume equal variances.

### Q38. Chi-square test
Tests association between two categorical variables (contingency table) or goodness of fit. Statistic = Σ (O − E)² / E. Needs expected counts ≥ 5 in most cells.
```python
chi2, p, dof, exp = stats.chi2_contingency([[30, 20], [25, 45]])
```

### Q39. ANOVA
Compares means of 3+ groups. F = between-group variance / within-group variance. A significant F says at least one mean differs; follow with post-hoc tests (Tukey). Assumes normality, equal variances, independence.

### Q40. Non-parametric tests
When assumptions fail: Mann–Whitney U (instead of two-sample t), Wilcoxon signed-rank (paired), Kruskal–Wallis (instead of ANOVA), Spearman correlation. They use ranks, not raw values.

### Q41. Multiple testing problem
Running many tests inflates false positives (20 tests at α = 0.05 → ~64% chance of at least one false positive). Fix with **Bonferroni** (α/m) or **Benjamini–Hochberg** (controls false discovery rate).

### Q42. A/B testing basics *(Must-know)*
Randomly split users into control (A) and treatment (B), measure a metric (conversion), and test the difference. Decide in advance: metric, minimum detectable effect, sample size, duration, α, power. Do not stop early when you see p < 0.05 ("peeking").

### Q43. Sample size for a proportion test (rough)
n per group ≈ 16 · p(1 − p) / δ² for 80% power and α = 0.05 (two-sided), where δ is the absolute difference to detect. Example: p = 0.10, δ = 0.01 → n ≈ 16 × 0.09 / 0.0001 = 14,400 per group.

### Q44. Linear regression *(Must-know)*
Model y = w₀ + w₁x₁ + … + ε. Fit by minimising the sum of squared errors (OLS). Closed form: w = (XᵀX)⁻¹ Xᵀ y. Assumptions: linearity, independent errors, constant variance (homoscedasticity), roughly normal errors, no strong multicollinearity.

### Q45. R² and adjusted R²
R² = 1 − SS_res / SS_tot: share of variance explained. It never decreases when you add features; **adjusted R²** penalises useless features. A high R² does not prove causation or a good model on new data.

### Q46. Interpreting regression coefficients
w₁ = expected change in y for a one-unit increase in x₁ **holding other features fixed**. Check p-values/confidence intervals, scale, and multicollinearity (VIF > 5–10 is a warning).

### Q47. Logistic regression
Models P(y = 1) = σ(wᵀx + b), where σ(z) = 1 / (1 + e^(−z)). Uses log-odds: log(p / (1 − p)) = wᵀx + b. Trained by maximum likelihood (minimising log loss). Coefficient e^w is an odds ratio.

### Q48. Residuals and diagnostics
Plot residuals vs fitted (look for patterns = non-linearity, funnel = heteroscedasticity), Q–Q plot (normality), leverage and Cook's distance (influential points), Durbin–Watson (autocorrelation).

### Q49. Overfitting and underfitting
Underfit: model too simple (high bias), poor on train and test. Overfit: model too complex (high variance), great on train, poor on test. Use validation, regularisation, more data, simpler model, early stopping.

### Q50. Bias–variance trade-off *(Must-know)*
Expected test error = bias² + variance + irreducible noise. Simple models: high bias, low variance. Complex models: low bias, high variance. Aim for the sweet spot, using cross-validation to find it.

### Q51. Train/validation/test split and cross-validation
Train fits, validation tunes, test is touched once at the end. **k-fold CV** rotates the validation fold for stable estimates. Use stratified folds for imbalanced classes and time-based splits for time series. Avoid data leakage (fit scalers only on train).

### Q52. Regularisation (L1 and L2)
Adds a penalty to the loss. **L2 (Ridge)**: λΣw² shrinks weights smoothly. **L1 (Lasso)**: λΣ|w| drives some weights exactly to 0 (feature selection). Elastic Net mixes both. Bayesian view: L2 = Gaussian prior, L1 = Laplace prior.

### Q53. Scaling and normalisation
Standardisation: z = (x − μ)/σ. Min–max: (x − min)/(max − min). Needed for distance-based and gradient-based models (KNN, SVM, neural nets, regularised regression). Tree models do not need it.

### Q54. Handling missing data
Types: MCAR, MAR, MNAR. Options: drop rows (if few and random), mean/median/mode imputation, model-based imputation (KNN, MICE), missing-indicator feature. Imputing before splitting leaks information.

### Q55. Vectors: dot product and norms
Dot product a·b = Σ aᵢbᵢ = |a||b|cosθ. L2 norm = √Σx², L1 norm = Σ|x|. Cosine similarity = a·b / (|a||b|), used for text and embeddings.

### Q56. Matrix multiplication and transpose
(AB)ᵢⱼ = Σ AᵢₖBₖⱼ; needs inner dimensions to match (m×n)(n×p) = (m×p). Not commutative; (AB)ᵀ = BᵀAᵀ. Inverse exists only for square, full-rank (non-singular) matrices.

### Q57. Derivative and gradient *(Must-know)*
Derivative = slope of a function. Gradient ∇f is the vector of partial derivatives; it points toward steepest increase. Gradient descent moves the opposite way: w ← w − η∇L(w), where η is the learning rate.

### Q58. Gradient descent variants
Batch (all data, stable, slow), stochastic (one sample, noisy), mini-batch (common, e.g., 32–512). Learning rate too high: diverges; too low: slow. Use schedules and optimizers (Adam).

### Q59. Chain rule
d/dx f(g(x)) = f'(g(x)) · g'(x). Backpropagation applies the chain rule layer by layer to get gradients of the loss with respect to every weight.

### Q60. Loss functions: MSE, MAE, cross-entropy
MSE = mean (y − ŷ)² (penalises big errors, sensitive to outliers). MAE = mean |y − ŷ| (robust). Binary cross-entropy = −[y log p + (1 − y) log(1 − p)]. Classification uses cross-entropy because it is the negative log-likelihood.

---

# 🟡 Part 3: Mid (3–5 years)

### Q61. Maximum likelihood estimation (MLE) *(Must-know)*
Choose parameters θ that make the observed data most probable: θ̂ = argmax Π p(xᵢ | θ) = argmax Σ log p(xᵢ | θ). For Gaussian noise, MLE equals least squares. For Bernoulli outputs, MLE equals minimising log loss.

### Q62. MAP estimation and the Bayesian view
MAP: θ̂ = argmax p(θ | data) ∝ likelihood × prior. A Gaussian prior on weights gives L2 regularisation. Full Bayesian inference keeps the whole posterior (uncertainty), not just a point. Tools: PyMC, Stan, NumPyro.

### Q63. Conjugate priors, Beta–Binomial example
Prior Beta(α, β) on conversion rate; after k successes in n trials the posterior is Beta(α + k, β + n − k). Easy to update online; used in Bayesian A/B testing and Thompson sampling.

### Q64. Frequentist vs Bayesian
Frequentist: parameters are fixed, probability = long-run frequency, uses p-values and CIs. Bayesian: parameters have distributions, probability = degree of belief, gives credible intervals and direct statements like P(B > A) = 0.93. Both are valid; choose by problem and audience.

### Q65. Bootstrap
Resample the data with replacement many times, compute the statistic each time, and use the spread to estimate standard errors and confidence intervals without assuming a distribution.
```python
import numpy as np
rng = np.random.default_rng(42)
boot = [rng.choice(data, len(data), replace=True).mean() for _ in range(5000)]
ci = np.percentile(boot, [2.5, 97.5])
```

### Q66. Permutation tests
Shuffle group labels to build the null distribution of the statistic and compute a p-value. Few assumptions; good for odd metrics.

### Q67. Effect size
p-values depend on sample size; effect size says "how big". Cohen's d = (mean₁ − mean₂)/pooled SD (0.2 small, 0.5 medium, 0.8 large). Report effect size with CI and business impact.

### Q68. Regression diagnostics for production models
Check calibration, residual patterns by segment, leakage, drift, and stability over time. Compare to a simple baseline. Interpretability tools: coefficients, partial dependence, SHAP.

### Q69. Multicollinearity
Highly correlated features make coefficients unstable (large standard errors) though predictions may stay fine. Detect with VIF or the correlation matrix; fix by dropping/combining features, PCA, or regularisation (Ridge).

### Q70. Eigenvalues and eigenvectors *(Must-know)*
For a square matrix A, vector v with Av = λv: A only stretches v by λ. Eigenvectors of a covariance matrix are the principal directions of variance; eigenvalues give the variance along them.

### Q71. PCA: how it works *(Must-know)*
1. Centre (and usually scale) the data. 2. Compute the covariance matrix (or use SVD). 3. Find eigenvectors sorted by eigenvalue. 4. Project data onto the top k components. Explained variance ratio = λᵢ / Σλ. Use for compression, visualisation, de-noising and removing collinearity. Components are linear and less interpretable.
```python
from sklearn.decomposition import PCA
pca = PCA(n_components=0.95).fit(X_scaled)   # keep 95% variance
```

### Q72. Singular value decomposition (SVD)
X = U Σ Vᵀ. Columns of V are principal directions; singular values relate to eigenvalues by λ = σ²/(n−1). Used in PCA, recommender systems (matrix factorisation), LSA, pseudo-inverse and low-rank approximation.

### Q73. Rank, determinant, invertibility
Rank = number of independent rows/columns. Determinant 0 means singular (not invertible). In regression a singular XᵀX (perfectly collinear features) has no unique solution; use pseudo-inverse or regularisation.

### Q74. Orthogonality and projections
Orthogonal vectors have zero dot product. OLS predictions are the projection of y onto the column space of X; residuals are orthogonal to the columns of X.

### Q75. Partial derivatives and the Jacobian/Hessian
Gradient: first derivatives (direction of change). Jacobian: matrix of first derivatives of a vector function. Hessian: matrix of second derivatives (curvature). Positive-definite Hessian means a local minimum. Newton's method uses the Hessian; deep learning rarely does (too expensive).

### Q76. Convex vs non-convex optimisation
Convex loss (linear/logistic regression, SVM): one global minimum, gradient descent finds it. Non-convex (neural nets): many local minima and saddle points; in practice SGD with good initialisation finds good solutions.

### Q77. Optimisers: SGD, momentum, RMSProp, Adam
Momentum accumulates velocity to smooth noisy gradients. RMSProp scales by a running average of squared gradients. **Adam** combines both with bias correction; defaults lr = 1e-3, β1 = 0.9, β2 = 0.999. **AdamW** decouples weight decay (preferred for transformers).

### Q78. Learning-rate schedules and warm-up
Step decay, cosine annealing, linear warm-up then decay (common for transformers), one-cycle. Large learning rates early speed up training; smaller later improve convergence.

### Q79. Vanishing and exploding gradients
Gradients multiplied across many layers shrink (sigmoid/tanh) or blow up. Fixes: ReLU-type activations, good initialisation (He/Xavier), normalisation (BatchNorm/LayerNorm), residual connections, gradient clipping, gated cells (LSTM/GRU).

### Q80. Entropy, cross-entropy and KL divergence *(Must-know)*
Entropy H(p) = −Σ p log p: average uncertainty. Cross-entropy H(p, q) = −Σ p log q: cost of encoding data from p using q. KL(p‖q) = H(p, q) − H(p) ≥ 0, not symmetric. Minimising cross-entropy = minimising KL to the true distribution = maximum likelihood.

### Q81. Softmax and numerical stability
softmax(z)ᵢ = e^(zᵢ) / Σ e^(zⱼ). Subtract max(z) before exponentiating to avoid overflow. Combine with log (log-softmax) and use the log-sum-exp trick.
```python
def softmax(z):
    z = z - np.max(z)
    e = np.exp(z)
    return e / e.sum()
```

### Q82. Information gain and Gini impurity
Decision trees pick splits that reduce impurity. Entropy-based information gain = H(parent) − weighted H(children). Gini = 1 − Σ pᵢ². Both measure class mixing; results are usually similar.

### Q83. Metrics maths: precision, recall, F1, ROC-AUC
Precision = TP/(TP+FP). Recall = TP/(TP+FN). F1 = 2PR/(P+R) (harmonic mean). ROC-AUC = probability that a random positive scores higher than a random negative. With severe class imbalance, **PR-AUC** is more informative than ROC-AUC. Choose thresholds by business cost.

### Q84. Calibration
A calibrated model's predicted 0.8 should be correct ~80% of the time. Check with reliability diagrams and Brier score; fix with Platt scaling or isotonic regression. Important when probabilities drive decisions.

---

# 🟠 Part 4: Senior (5–7 years)

### Q85. Design an A/B testing framework *(Must-know)*
- **Randomization:** hash user id + experiment salt for stable assignment; check sample ratio mismatch (SRM) with chi-square.
- **Metrics:** one primary, a few secondary, and guardrails (latency, errors, revenue). Pre-register them.
- **Power and duration:** compute sample size from baseline and MDE; run full weekly cycles.
- **Analysis:** t-test/z-test or bootstrap; variance reduction with **CUPED**; correct for multiple metrics.
- **Peeking:** use sequential tests (mSPRT, alpha-spending) if you must look early.
- **Interference:** network effects and marketplaces need cluster or switchback designs.
- **Decision:** consider effect size, cost, risk and long-term effects, not only p < 0.05.

### Q86. CUPED and variance reduction
Adjust the metric with a pre-experiment covariate: Y' = Y − θ(X − mean(X)), θ = Cov(X, Y)/Var(X). Reduces variance (often 20–50%), so you need fewer samples or can detect smaller effects.

### Q87. Sequential testing and the peeking problem
Checking a fixed-horizon test repeatedly inflates Type I error well above 5%. Use group-sequential designs, always-valid p-values, or Bayesian decision rules with loss thresholds.

### Q88. Causal inference basics
Randomization removes confounding. When you cannot randomize: matching, propensity scores, inverse probability weighting, difference-in-differences, instrumental variables, regression discontinuity, synthetic control. Draw a causal graph (DAG) to choose adjustment variables; do not "control for everything" (colliders create bias).

### Q89. Simpson's paradox
A trend present in each group reverses when groups are combined (e.g., a treatment looks better in each hospital but worse overall because of different patient mix). Always check segments and the data-generating process.

### Q90. Survivorship, selection and look-ahead bias
Survivorship: only seeing survivors (successful companies). Selection: non-random sample. Look-ahead: using future information in features (time leakage). All inflate offline metrics and fail in production.

### Q91. Data leakage detection
Suspiciously high scores, features that are proxies for the label, preprocessing on full data, duplicates across splits, time-based leakage. Use pipelines, group/time-aware splits and feature importance sanity checks.

### Q92. Class imbalance
Accuracy misleads (99% negative baseline). Use PR-AUC, recall at fixed precision, cost-sensitive loss, resampling (SMOTE with care, only on train), class weights, threshold tuning, anomaly detection framing. Keep the test set at the natural prevalence.

### Q93. Regularisation geometry and Bayesian link
L1 constraint region is a diamond (corners on axes → sparse weights); L2 is a circle (small, dense weights). Ridge posterior mean is MAP under N(0, σ²) prior. Early stopping, dropout and data augmentation also regularise.

### Q94. Generalisation theory (intuition)
VC dimension and Rademacher complexity bound generalisation by model capacity vs data. Modern deep nets overfit-but-generalise ("double descent"): test error can fall again beyond the interpolation threshold. Interview answer: capacity, implicit regularisation of SGD, and data quantity all matter.

### Q95. Time series statistics
Stationarity (constant mean/variance/autocovariance), ACF/PACF, differencing, seasonality, ARIMA/SARIMA, exponential smoothing, Prophet, and ML with lag features. Use time-based splits (walk-forward validation); never shuffle. Check with ADF test.

### Q96. Distribution shift and drift
Covariate shift (P(x) changes), label shift (P(y) changes), concept drift (P(y|x) changes). Detect with PSI, KS test, KL/JS divergence, classifier two-sample tests; monitor model metrics and retrain. See `074_MLOps.md`.

### Q97. Kolmogorov–Smirnov, PSI and divergence measures
KS test: max distance between two CDFs. PSI = Σ (a − e) · ln(a/e) over bins (rules of thumb: <0.1 stable, 0.1–0.25 moderate, >0.25 large shift). JS divergence is a symmetric, bounded version of KL.

### Q98. Matrix calculus for backprop
For a layer z = Wx + b: ∂L/∂W = (∂L/∂z) xᵀ, ∂L/∂x = Wᵀ (∂L/∂z), ∂L/∂b = ∂L/∂z. For softmax + cross-entropy the gradient simplifies to ŷ − y. Shapes must match; check with autograd gradient checks.

### Q99. Numerical issues in ML
Overflow/underflow in exp/log (use log-sum-exp), catastrophic cancellation, float16 range (use bf16 or loss scaling), ill-conditioned matrices (condition number), division by zero (epsilon), non-deterministic GPU reductions. Prefer stable library functions.

### Q100. Choosing the right statistical test (decision flow)
Categorical vs categorical → chi-square/Fisher. Two means → t-test (Welch) or Mann–Whitney if not normal. Paired → paired t/Wilcoxon. 3+ means → ANOVA/Kruskal. Proportions → z-test for proportions. Association of two numeric → Pearson/Spearman. Always check assumptions, sample size and whether a bootstrap is simpler.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q101. How do you build statistical rigor into an ML organization? *(Must-know)*
Standards for experiment design, a shared experimentation platform (assignment, metrics, SRM checks, CUPED), review of analyses, pre-registration of hypotheses, offline-online metric alignment, holdout groups for long-term effects, model validation checklists (leakage, calibration, fairness, drift), and education for PMs and engineers.

### Q102. Offline metrics vs online outcomes
Offline AUC gains often do not translate to business wins. Create a metric hierarchy (model metric → product metric → business metric), validate correlations historically, use interleaving or small online tests, and be ready to say "no ship" when the online result disagrees.

### Q103. Decision-making under uncertainty
Use expected value with costs of errors, decision thresholds from cost matrices, confidence/credible intervals, risk appetite, reversible vs irreversible decisions, and value of information (is more data worth the delay?). Communicate ranges, not just point estimates.

### Q104. Fairness and statistical parity
Metrics: demographic parity, equalized odds, equal opportunity, calibration within groups; they can conflict (impossibility results). Choose by context and law, measure by segment, and document trade-offs. Monitor after launch.

### Q105. Uncertainty quantification
Prediction intervals, conformal prediction (distribution-free coverage), Bayesian neural nets, ensembles, MC dropout, calibration. Required in medicine, finance and any automated decision with cost of error.

### Q106. Statistical thinking about LLMs and evaluation
Evaluation sets are samples: report confidence intervals, use paired tests/bootstrap across prompts, control for prompt variation and randomness (seeds/temperature), avoid test-set contamination, and watch Goodhart's law (optimising a metric breaks it). See `../11_Generative_AI/`.

### Q107. Experimentation at scale and ethics
Guard against harm (guardrail metrics, ramp-up, kill switches), informed consent where required, privacy (differential privacy basics: add calibrated noise, privacy budget ε), and interference between experiments (layering, mutual exclusion).

### Q108. Reproducibility
Fix seeds, record data versions, code commit, environment and hyperparameters; report variance over multiple seeds; use confidence intervals for model comparisons; keep an experiment tracker (MLflow, W&B). Differences smaller than seed noise are not real.

### Q109. Mentoring: explaining stats simply
Use frequencies ("out of 1000 people…"), visualisations, simulation, and analogies; correct myths (p-value meaning); give a checklist for analyses. Teach engineers to ask "what is the baseline, the uncertainty and the decision?".

### Q110. Communicating results to leadership
Lead with the decision and impact range: "The new ranker lifts conversion by 1.8% (95% CI 0.9–2.7%), worth ~₹4–11 crore a year; risk is low; we recommend a staged rollout with a 5% holdout." State assumptions, limits and next steps.

---

# 💻 Part 6: Hands-On Tasks & Code

### H1. Descriptive statistics with NumPy and pandas
```python
import numpy as np, pandas as pd
rng = np.random.default_rng(42)
s = pd.Series(rng.lognormal(mean=10, sigma=0.6, size=1000), name="salary")
print(s.describe())
print("skew:", s.skew(), "kurtosis:", s.kurt())
q1, q3 = s.quantile([0.25, 0.75])
iqr = q3 - q1
outliers = s[(s < q1 - 1.5 * iqr) | (s > q3 + 1.5 * iqr)]
print(len(outliers), "outliers; mean", s.mean(), "median", s.median())
```
Right-skewed data: mean is above the median.

### H2. Bayes' theorem calculator
```python
def posterior(prior, sensitivity, specificity):
    fp_rate = 1 - specificity
    num = sensitivity * prior
    return num / (num + fp_rate * (1 - prior))

print(posterior(0.01, 0.99, 0.95))   # ~0.1667
```

### H3. Central limit theorem simulation
```python
import numpy as np
rng = np.random.default_rng(0)
pop = rng.exponential(scale=2.0, size=100_000)          # skewed population
means = [rng.choice(pop, 50).mean() for _ in range(5000)]
print(np.mean(means), np.std(means), pop.std() / np.sqrt(50))   # std ≈ σ/√n
```
Plotting `means` gives a near-normal bell shape.

### H4. Hypothesis tests with SciPy
```python
from scipy import stats
import numpy as np
control = np.random.default_rng(1).normal(100, 15, 200)
variant = np.random.default_rng(2).normal(104, 15, 200)

t, p = stats.ttest_ind(variant, control, equal_var=False)
u, p_mw = stats.mannwhitneyu(variant, control)
d = (variant.mean() - control.mean()) / np.sqrt((variant.var(ddof=1) + control.var(ddof=1)) / 2)
print(f"t={t:.2f} p={p:.4f}  MWU p={p_mw:.4f}  Cohen d={d:.2f}")
```

### H5. A/B test for conversion rates (z-test) and sample size
```python
from statsmodels.stats.proportion import proportions_ztest
from statsmodels.stats.power import NormalIndPower
from statsmodels.stats.proportion import proportion_effectsize

z, p = proportions_ztest([520, 590], [5000, 5000])      # conversions, visitors
print("z", z, "p", p)

es = proportion_effectsize(0.10, 0.11)
n = NormalIndPower().solve_power(es, power=0.8, alpha=0.05, alternative="two-sided")
print("sample size per group ≈", int(n))
```

### H6. Bootstrap confidence interval
```python
import numpy as np
def boot_ci(x, stat=np.mean, n=5000, alpha=0.05, seed=0):
    rng = np.random.default_rng(seed)
    stats_ = [stat(rng.choice(x, len(x), replace=True)) for _ in range(n)]
    return np.percentile(stats_, [100 * alpha / 2, 100 * (1 - alpha / 2)])
print(boot_ci(np.random.default_rng(3).exponential(2, 300), stat=np.median))
```

### H7. Linear regression from scratch (normal equation and gradient descent)
```python
import numpy as np
rng = np.random.default_rng(0)
X = rng.normal(size=(200, 3)); w_true = np.array([2.0, -1.0, 0.5])
y = X @ w_true + 3 + rng.normal(0, 0.3, 200)

Xb = np.c_[np.ones(len(X)), X]                       # add bias column
w_ne = np.linalg.solve(Xb.T @ Xb, Xb.T @ y)          # normal equation (solve, not inv)

w = np.zeros(Xb.shape[1]); lr = 0.05
for _ in range(2000):
    grad = (2 / len(y)) * Xb.T @ (Xb @ w - y)        # gradient of MSE
    w -= lr * grad
print(w_ne.round(2), w.round(2))
```

### H8. Logistic regression with gradient descent
```python
def sigmoid(z): return 1 / (1 + np.exp(-z))
def fit_logreg(X, y, lr=0.1, steps=3000, l2=0.0):
    w = np.zeros(X.shape[1])
    for _ in range(steps):
        p = sigmoid(X @ w)
        grad = X.T @ (p - y) / len(y) + l2 * w
        w -= lr * grad
    return w
```
The gradient `Xᵀ(p − y)/n` comes from the log loss; compare with `sklearn.linear_model.LogisticRegression`.

### H9. PCA via SVD
```python
import numpy as np
X = np.random.default_rng(5).normal(size=(500, 5)) @ np.random.default_rng(6).normal(size=(5, 5))
Xc = X - X.mean(axis=0)
U, S, Vt = np.linalg.svd(Xc, full_matrices=False)
explained = (S**2) / (S**2).sum()
Z = Xc @ Vt[:2].T                       # project to 2 components
print(explained.round(3))
```

### H10. Entropy, cross-entropy and KL divergence
```python
import numpy as np
def entropy(p):        p = np.asarray(p); return -np.sum(p * np.log2(p + 1e-12))
def cross_entropy(p, q): return -np.sum(np.asarray(p) * np.log2(np.asarray(q) + 1e-12))
def kl(p, q):          return cross_entropy(p, q) - entropy(p)

p = [0.5, 0.5]; q = [0.9, 0.1]
print(entropy(p), cross_entropy(p, q), kl(p, q))   # 1.0, ~1.74, ~0.74 bits
```

### H11. Metrics from a confusion matrix
```python
TP, FP, FN, TN = 80, 20, 40, 860
precision = TP / (TP + FP)            # 0.80
recall    = TP / (TP + FN)            # 0.667
f1        = 2 * precision * recall / (precision + recall)   # 0.727
accuracy  = (TP + TN) / (TP + FP + FN + TN)                 # 0.94
```
Accuracy looks high because most samples are negative; precision/recall tell the real story.

---

# 🐞 Part 7: Debugging Scenarios

### D1. Model has 99% accuracy but is useless
Class imbalance (99% negatives) or leakage. Check the baseline "always predict majority", confusion matrix, PR-AUC, and whether any feature leaks the label.

### D2. Very low p-value but tiny effect
Huge sample sizes make trivial differences significant. Report effect size and CI; ask whether the effect matters for the business.

### D3. A/B test result flips when you rerun the analysis
Peeking, stopping early, many metrics (multiple testing), novelty effects, SRM, or outliers. Re-check assignment balance, pre-registered metric, and run full cycles.

### D4. Training loss becomes NaN
Learning rate too high, exp/log overflow, division by zero, bad data (inf/NaN), unstable loss. Lower LR, clip gradients, use stable softmax/log-sum-exp, check inputs.

### D5. Training loss decreases but validation loss rises
Overfitting. Add regularisation (L2, dropout), more data/augmentation, early stopping, simpler model, or check for train/validation distribution mismatch.

### D6. Regression coefficients flip sign when adding a feature
Multicollinearity or confounding. Check VIF and correlations; consider dropping/combining features or using Ridge. Do not interpret coefficients causally.

### D7. Standard errors are huge
Collinearity, small n, or variance in features too low. Collect more variation, remove redundant features, or regularise.

### D8. PCA components look random
Features not scaled, categorical encodings mixing scales, or little linear structure. Standardise, check the explained variance curve, consider non-linear methods (UMAP, autoencoders) for visualisation only.

### D9. Confidence interval is surprisingly narrow or wide
Narrow: huge n or underestimated variance (ignoring clustering/duplicates). Wide: small n or high variance. Use cluster-robust SE for correlated samples (many events per user).

### D10. Predicted probabilities are too confident
Model uncalibrated (overfit nets, boosted trees). Check reliability curve, apply temperature scaling/Platt/isotonic on a held-out calibration set.

### D11. Metric differs between offline and production
Distribution shift, leakage in offline data, different preprocessing, delayed labels, feedback loops. Compare feature distributions (PSI/KS), shadow deploy, and log online features for replay.

### D12. Gradient descent oscillates or crawls
LR too high (oscillation/divergence) or too low (crawl); badly scaled features (elongated loss valley). Scale features, tune LR, use momentum/Adam, schedules.

### D13. Normality test fails, but data looks fine
With large n, tests detect tiny deviations. Use Q–Q plots and rely on CLT; choose robust/non-parametric methods where needed.

### D14. Significant results across many metrics
Multiple comparisons. Pre-specify one primary metric, apply FDR correction, and treat others as exploratory.

### D15. Covariance matrix is singular
More features than samples, duplicate/linearly dependent columns. Remove redundant features, add regularisation (shrinkage), use pseudo-inverse or PCA.

---

# 🧩 Part 8: Tricky Questions

### T1. Does a p-value of 0.03 mean there is a 97% chance the effect is real?
No. It means that if H0 were true, data this extreme would happen 3% of the time. It says nothing directly about the probability of H0.

### T2. Does "fail to reject H0" prove H0?
No. It means the evidence is insufficient (maybe low power).

### T3. Does a 95% CI contain the true value with 95% probability?
For the procedure over repeated sampling, yes. For one computed interval, the true value either is or is not inside. (A Bayesian credible interval does give the direct probability statement.)

### T4. Are uncorrelated variables independent?
No. Zero correlation means no linear relation; non-linear dependence can remain (y = x²). Independent implies uncorrelated, not the reverse (except jointly normal).

### T5. Is the mean always the best summary?
No. For skewed data or outliers the median is more representative.

### T6. Does more data always fix a bad model?
Not high bias (underfitting) or biased sampling. More data helps variance, not wrong assumptions.

### T7. Is R² = 0.95 a good model?
Not necessarily. It could be overfit, include leakage, or be inflated by trending time series. Check on held-out data.

### T8. Does normalising data change the distribution shape?
Standardisation and min-max keep the shape (linear transform). Log or power transforms change it.

### T9. Is accuracy appropriate for imbalanced data?
No. Use precision, recall, F1, PR-AUC, and cost-based thresholds.

### T10. Is gradient descent guaranteed to find the global minimum?
Only for convex problems (with suitable learning rate). In deep nets it finds good, not guaranteed global, minima.

### T11. Are L1 and L2 regularisation equivalent?
No. L1 gives sparse solutions and feature selection; L2 shrinks all weights smoothly. Elastic Net combines them.

### T12. Does PCA select the most important features for prediction?
No. PCA maximises variance, not relevance to the label; a low-variance direction can be the most predictive.

### T13. Is the sample variance with n − 1 unbiased for the standard deviation?
It is unbiased for variance, but the square root (sample SD) is slightly biased low. Fine in practice.

### T14. Does a larger sample size reduce bias?
It reduces random error (variance), not systematic bias from a non-representative sample.

### T15. Is correlation transitive?
No. A correlates with B and B with C does not guarantee A correlates with C strongly.

### T16. Is the median of medians the overall median?
No. Combine raw data or use weighted/streaming quantile sketches.

### T17. Is cross-entropy symmetric?
No. H(p, q) ≠ H(q, p), and KL divergence is also not symmetric.

### T18. Does the Central Limit Theorem say data become normal with more samples?
No. The distribution of the sample mean becomes normal; the data's own distribution does not change.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- **Center measure for skewed data?** Median.
- **Sample variance denominator?** n − 1.
- **Normal 68-95-99.7?** 1σ, 2σ, 3σ.
- **z-score?** (x − μ)/σ.
- **Standard error?** s/√n.
- **CLT?** Sample mean → normal as n grows.
- **Bayes?** P(A|B) = P(B|A)P(A)/P(B).
- **Binomial mean/var?** np / np(1−p).
- **Poisson mean=var?** λ.
- **Type I error?** False positive (α).
- **Type II error?** False negative (β).
- **Power?** 1 − β.
- **Multiple tests fix?** Bonferroni, Benjamini–Hochberg.
- **Categorical association test?** Chi-square.
- **3+ group means?** ANOVA.
- **Not normal data test?** Mann–Whitney, Kruskal–Wallis.
- **OLS solution?** (XᵀX)⁻¹Xᵀy.
- **Logistic output?** Sigmoid probability.
- **L1 effect?** Sparsity.
- **L2 effect?** Shrinkage.
- **Bias–variance?** Underfit vs overfit.
- **PCA uses?** Eigenvectors of covariance / SVD.
- **Gradient step?** w ← w − η∇L.
- **Backprop rule?** Chain rule.
- **MLE for Gaussian noise?** Least squares.
- **Cross-entropy = ?** NLL for classification.
- **KL ≥ ?** 0.
- **Imbalanced metric?** PR-AUC, F1.
- **Variance reduction in A/B?** CUPED.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about an experiment you designed and analysed.
STAR: "We tested a new checkout flow. I defined conversion as the primary metric and latency as a guardrail, computed a sample size of 38k per arm for a 0.8-point lift, checked sample ratio, applied CUPED (variance down 28%), and analysed after two full weeks. Lift was 1.1 points (95% CI 0.5–1.7), so we rolled out gradually with a 5% holdout."

### P2. A time statistics saved a bad launch.
"A recommender showed +3% click-through offline. I noticed the validation split leaked future clicks. After a time-based split the gain was 0.2% within noise. We held the launch and fixed the feature pipeline."

### P3. How did you explain p-values to a non-technical manager?
"I used a coin: if it lands heads 9 of 10 times, we doubt it's fair, but we can't say how likely it's fair. The p-value tells how surprising the data is if nothing is going on, so we also check effect size and cost."

### P4. Describe a data quality issue you found with statistics.
"A drift monitor (PSI > 0.3) flagged a feature. Investigation showed a mobile app update changed units from km to miles. We fixed the pipeline, added unit tests and a distribution check in CI."

### P5. How do you choose between a simple and a complex model?
"I start with a strong baseline (linear/GBM), compare with cross-validated confidence intervals, check calibration and latency, and choose the simplest model whose gain is statistically and practically meaningful."

### P6. How do you handle a stakeholder who wants to peek?
"I explain peeking inflates false positives, offer a sequential testing design with a spending plan, and set a dashboard that shows precision and expected duration instead of p-values."

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- **Descriptive statistics:** mean, median, mode, variance, SD, IQR, percentiles, skewness, kurtosis, outliers.
- **Probability:** rules, conditional probability, independence, Bayes, random variables, PMF/PDF/CDF, expectation, variance, covariance.
- **Distributions:** Bernoulli, binomial, Poisson, uniform, exponential, normal, t, chi-square, F, beta, gamma, multinomial.
- **Inference:** sampling, LLN, CLT, standard error, confidence intervals, bootstrap, MLE, MAP, Bayesian updating.
- **Testing:** z/t/chi-square/ANOVA, non-parametric tests, p-values, power, effect size, multiple testing, A/B tests, sequential tests, CUPED.
- **Modelling maths:** linear/logistic regression, assumptions, regularisation, bias–variance, cross-validation, calibration, metrics.
- **Linear algebra:** vectors, matrices, dot/cosine, rank, eigen, SVD, PCA, projections.
- **Calculus and optimisation:** derivatives, gradients, chain rule, Jacobian/Hessian, convexity, SGD/Adam, schedules, vanishing gradients.
- **Information theory:** entropy, cross-entropy, KL, mutual information, information gain.
- **Advanced:** causal inference, time series, drift detection, fairness, uncertainty, privacy, reproducibility.

## Mixed topics
- Stats + data tools (`055_Pandas-and-NumPy.md`): computing statistics, vectorisation, simulation.
- Stats + ML (`056_Machine-Learning.md`): regression, trees, evaluation, feature engineering.
- Stats + DL (`057_Deep-Learning.md`, `058_PyTorch.md`): loss, gradients, optimisers, normalisation.
- Stats + NLP/CV/RL (`059_NLP.md`, `060_Computer-Vision.md`, `061_Reinforcement-Learning.md`): probability models, softmax, expectation.
- Stats + MLOps/data (`074_MLOps.md`, `075_Data-Engineering.md`): drift, monitoring, data quality.
- Stats + SQL (`../04_Database/026_SQL.md`): aggregations, window functions for metrics.
- Stats + system design (`../09_System_Design/053_System-Design.md`): probabilistic data structures, experimentation platforms.

---

# 🔬 Part 12: Internals

### I1. Why OLS has a closed form
Minimise L(w) = |y − Xw|². Setting ∇L = −2Xᵀ(y − Xw) = 0 gives the normal equations XᵀXw = Xᵀy. Solving via QR or SVD is more stable than inverting XᵀX; cost is O(nd² + d³). For huge data use gradient methods.

### I2. Derivation of logistic regression gradient
Likelihood Π pᵢ^yᵢ (1 − pᵢ)^(1−yᵢ); negative log-likelihood L = −Σ[yᵢ log pᵢ + (1 − yᵢ) log(1 − pᵢ)] with pᵢ = σ(wᵀxᵢ). Using σ' = σ(1 − σ) gives ∇L = Xᵀ(p − y). Convex, so gradient descent or Newton (IRLS) converge.

### I3. Backpropagation as the chain rule on a graph
The forward pass stores intermediate values; the backward pass multiplies local Jacobians from the loss back to inputs (reverse-mode automatic differentiation). Cost of the backward pass is about 2× the forward pass. See `058_PyTorch.md`.

### I4. Adam update
m ← β1 m + (1 − β1) g; v ← β2 v + (1 − β2) g²; m̂ = m/(1 − β1ᵗ); v̂ = v/(1 − β2ᵗ); w ← w − η m̂ / (√v̂ + ε). Per-parameter adaptive step sizes; bias correction fixes early-step underestimates.

### I5. Why the CLT works (intuition)
Sums of many small independent contributions smooth out; the characteristic function of the standardised sum converges to that of a normal. Heavy-tailed data (infinite variance) breaks the theorem.

### I6. PCA and covariance eigen-decomposition
Maximising variance of projection uᵀΣu subject to |u| = 1 gives Σu = λu (Lagrange multipliers). The top eigenvector is the first principal component; subsequent ones are orthogonal.

### I7. Bias–variance decomposition
For squared loss: E[(y − f̂(x))²] = (E[f̂(x)] − f(x))² + Var(f̂(x)) + σ². Averaging many models (bagging) reduces variance; boosting reduces bias. The decomposition is clean only for squared error.

### I8. Why cross-entropy is used with softmax
With one-hot labels the log-likelihood of the correct class is log softmax. Gradient with respect to logits is ŷ − y: large when wrong, small when right, avoiding the slow learning that MSE with sigmoid/softmax shows.

### I9. Floating point and ML
float32 has about 7 decimal digits; float16 has a small range (overflow at ~65k); bfloat16 keeps float32's range with less precision. Mixed-precision training keeps master weights in float32 and uses loss scaling for float16.

---

# 📊 Part 13: Reference Tables

### Common distributions
| Distribution | Type | Parameters | Mean | Variance | Example |
|---|---|---|---|---|---|
| Bernoulli | Discrete | p | p | p(1−p) | One click |
| Binomial | Discrete | n, p | np | np(1−p) | Clicks in n views |
| Poisson | Discrete | λ | λ | λ | Tickets per hour |
| Uniform | Continuous | a, b | (a+b)/2 | (b−a)²/12 | Random number |
| Exponential | Continuous | λ | 1/λ | 1/λ² | Time between events |
| Normal | Continuous | μ, σ² | μ | σ² | Measurement error |
| Beta | Continuous [0,1] | α, β | α/(α+β) | — | Conversion rate prior |

### Which test?
| Data | Parametric | Non-parametric |
|---|---|---|
| 1 sample vs value | one-sample t | Wilcoxon signed-rank |
| 2 independent groups | Welch t-test | Mann–Whitney U |
| 2 paired groups | paired t | Wilcoxon signed-rank |
| 3+ groups | ANOVA | Kruskal–Wallis |
| 2 categorical | chi-square | Fisher's exact |
| 2 numeric association | Pearson | Spearman |
| Proportions | z-test | Exact binomial |

### z critical values (two-sided)
| Confidence | α | z |
|---|---|---|
| 90% | 0.10 | 1.645 |
| 95% | 0.05 | 1.960 |
| 99% | 0.01 | 2.576 |

### Loss functions
| Task | Loss | Notes |
|---|---|---|
| Regression | MSE / MAE / Huber | Huber is robust |
| Binary classification | Binary cross-entropy | Sigmoid output |
| Multi-class | Categorical cross-entropy | Softmax output |
| Ranking | Pairwise / listwise | LambdaRank etc. |
| Distribution matching | KL divergence | VAEs, distillation |

### Regularisers
| Method | Effect | Notes |
|---|---|---|
| L2 / weight decay | Small weights | Gaussian prior |
| L1 | Sparse weights | Feature selection |
| Dropout | Random unit removal | Neural nets |
| Early stopping | Stop when val loss rises | Cheap, effective |
| Data augmentation | More variety | Images, text |

### Version/feature notes (verify)
| Item | Notes |
|---|---|
| NumPy 2.x | Some API and dtype behaviour changes; check release notes |
| `np.random.default_rng` | Preferred over legacy `np.random.seed` |
| scikit-learn 1.4+ | Pandas output via `set_output`, missing-value support in trees |
| statsmodels power functions | `NormalIndPower`, `TTestIndPower` for sample size |
| SciPy stats | `stats.bootstrap`, `stats.permutation_test` available |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
`np.var([2, 4, 6])` and `np.var([2, 4, 6], ddof=1)`.
**Result:** 2.667 (population, divides by 3) and 4.0 (sample, divides by 2).

### O2.
Data: `[1, 2, 3, 4, 100]`. Mean and median?
**Result:** mean 22, median 3. The outlier pulls the mean.

### O3.
Fair coin, 10 flips. Probability of exactly 5 heads?
**Result:** C(10,5)/2¹⁰ = 252/1024 ≈ 0.246.

### O4.
`z = (85 − 70) / 10`.
**Result:** z = 1.5; about 93.3% of a normal population is below this value.

### O5.
Test positive with 99% sensitivity, 95% specificity, prevalence 1%.
**Result:** probability of disease about 16.7%.

### O6.
95% CI for mean: n = 100, s = 20, x̄ = 50.
**Result:** SE = 2; CI ≈ 50 ± 1.96 × 2 = (46.1, 53.9).

### O7.
20 independent tests at α = 0.05, no true effects.
**Result:** P(at least one false positive) = 1 − 0.95²⁰ ≈ 64%.

### O8.
`a = [1, 2]`, `b = [3, 4]`; `np.dot(a, b)`.
**Result:** 1×3 + 2×4 = 11.

### O9.
Gradient descent on f(w) = w², start at w = 3, η = 0.1, one step.
**Result:** gradient = 2w = 6; w = 3 − 0.1 × 6 = 2.4.

### O10.
Entropy of a fair coin and of a coin with P(heads) = 1.
**Result:** 1 bit and 0 bits.

### O11.
Softmax of `[1, 1, 1]`.
**Result:** `[1/3, 1/3, 1/3]`.

### O12.
Precision 0.8, recall 0.5.
**Result:** F1 = 2 × 0.8 × 0.5 / 1.3 ≈ 0.615.

---

# ✅ Part 15: MCQs

**1. Best center measure for skewed income data:**
A) Mean  B) Median  C) Range  D) Variance
**Answer: B**

**2. Sample variance divides by:**
A) n  B) n − 1  C) n + 1  D) 2n
**Answer: B**

**3. The CLT says the sampling distribution of the mean is approximately:**
A) Uniform  B) Normal  C) Exponential  D) Poisson
**Answer: B**

**4. A Type I error is:**
A) Missing a real effect  B) Rejecting a true null hypothesis  C) Wrong sample size  D) Wrong test
**Answer: B**

**5. Power equals:**
A) α  B) 1 − α  C) 1 − β  D) β
**Answer: C**

**6. Which penalty gives sparse weights?**
A) L2  B) L1  C) Dropout  D) Batch norm
**Answer: B**

**7. Bayes' theorem relates:**
A) P(A|B) and P(B|A)  B) Mean and median  C) Rank and trace  D) Bias and variance
**Answer: A**

**8. Overfitting shows as:**
A) High train and test error  B) Low train error, high test error  C) High train, low test  D) Equal errors
**Answer: B**

**9. The first principal component is the direction of:**
A) Minimum variance  B) Maximum variance  C) Mean  D) Median
**Answer: B**

**10. KL divergence is:**
A) Symmetric  B) Non-negative and not symmetric  C) Always 1  D) Negative
**Answer: B**

**11. Which test compares means of 3 groups?**
A) t-test  B) ANOVA  C) Chi-square  D) Z-test for proportions
**Answer: B**

**12. For imbalanced classes the best summary is usually:**
A) Accuracy  B) PR-AUC / F1  C) Mean  D) R²
**Answer: B**

**13. Gradient descent updates weights by:**
A) w + η∇L  B) w − η∇L  C) w × ∇L  D) w / η
**Answer: B**

**14. Benjamini–Hochberg controls:**
A) Type II error  B) False discovery rate  C) Variance  D) Bias
**Answer: B**

**15. Pearson correlation measures:**
A) Any dependence  B) Linear association  C) Causation  D) Rank only
**Answer: B**

**16. Which distribution models counts of rare events per interval?**
A) Normal  B) Poisson  C) Uniform  D) Beta
**Answer: B**

**17. The standard error of the mean:**
A) s/√n  B) s·n  C) s²  D) n/s
**Answer: A**

**18. With softmax + cross-entropy, the gradient wrt logits is:**
A) y − ŷ squared  B) ŷ − y  C) ŷ · y  D) log ŷ
**Answer: B**

**19. Peeking at A/B test results repeatedly causes:**
A) Lower variance  B) Inflated false positives  C) Higher power always  D) No effect
**Answer: B**

**20. Singular (non-invertible) XᵀX usually means:**
A) Perfect multicollinearity  B) Perfect fit always  C) Too much data  D) Normal errors
**Answer: A**

---

# ⚠️ Part 16: Common Mistakes

1. **Misreading p-values** as the probability that H0 is true.
2. **Treating "not significant" as "no effect".**
3. **Ignoring effect size** and practical significance.
4. **Peeking** and stopping A/B tests early.
5. **Running many tests** without correction.
6. **Using accuracy on imbalanced data.**
7. **Data leakage** from scaling/imputing before the split or using future data.
8. **Correlation treated as causation.**
9. **Averaging percentiles** or ratios incorrectly.
10. **Using the mean on skewed data** or ignoring outliers.
11. **Not checking assumptions** (normality, independence, equal variance).
12. **Ignoring non-independence** (many rows per user) in tests and CIs.
13. **Random splits for time series.**
14. **Evaluating on the training set** or reusing the test set for tuning.
15. **Forgetting to scale features** for regularised or distance-based models.
16. **Inverting matrices** instead of solving linear systems.
17. **Unstable exp/log** (no log-sum-exp) causing NaN.
18. **Interpreting PCA components** as importance for the label.
19. **Trusting uncalibrated probabilities.**
20. **Reporting single-run results** without variance across seeds.
21. **Overfitting through repeated experiments** on the same validation data.
22. **Forgetting base rates** (Bayes) when interpreting alerts and tests.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You explain **p-values, CIs and power** correctly and always add **effect size**.
- You design experiments with **SRM checks, CUPED, guardrails and sequential rules**.
- You connect **MLE, cross-entropy, KL and regularisation** into one story.
- You derive gradients and know **why** optimisers and normalisation work.
- You use **linear algebra** (SVD, PCA, projections) fluently and avoid unstable numerics.
- You detect **leakage, drift, Simpson's paradox and selection bias**.
- You pick **metrics by business cost**, check calibration and uncertainty.
- You use **bootstrap and permutation tests** when assumptions fail.
- You communicate **ranges and decisions**, not just point estimates.
- You back claims with numbers from real projects.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### Core formulas
```
Mean = Σx/n • Var (sample) = Σ(x−x̄)²/(n−1) • SE = s/√n • z = (x−μ)/σ
Bayes: P(A|B) = P(B|A)P(A)/P(B) • Binomial: mean np, var np(1−p)
CI (95%) ≈ x̄ ± 1.96·SE (large n) • Power = 1 − β • Bonferroni: α/m
OLS: w = (XᵀX)⁻¹Xᵀy • Logistic: p = 1/(1+e^−z), ∇L = Xᵀ(p−y)/n
GD: w ← w − η∇L • Entropy H = −Σp log p • KL(p‖q) = Σp log(p/q)
F1 = 2PR/(P+R) • Cosine = a·b/(|a||b|) • PCA: eigenvectors of covariance
```

### Hypothesis test checklist
H0/H1 • α and power • test choice and assumptions • sample size • p-value + effect size + CI • multiple testing correction • business decision.

### Model-evaluation checklist
Right split (stratified/time-based) • no leakage • baseline • metric fits cost • cross-validation with CI • calibration • error analysis by segment • drift monitoring.

### Interview strategy
1. Restate the question in plain words.
2. Give intuition, then the formula, then a tiny example.
3. State assumptions and where they break.
4. Connect to ML practice (loss, regularisation, evaluation).
5. Mention pitfalls (leakage, peeking, imbalance).
6. Close with how you would verify with data or simulation.

### Final checklist before the interview
- [ ] Explain mean/median/variance, distributions, CLT and standard error.
- [ ] Apply Bayes' theorem with base rates.
- [ ] Explain p-value, CI, power, Type I/II errors, effect size, multiple testing.
- [ ] Design an A/B test (sample size, SRM, CUPED, guardrails, no peeking).
- [ ] Derive OLS, logistic gradient, MLE vs MAP, regularisation as priors.
- [ ] Explain bias–variance, cross-validation, calibration and imbalanced metrics.
- [ ] Explain eigen/SVD/PCA and cosine similarity.
- [ ] Explain gradient descent, chain rule, Adam, vanishing gradients.
- [ ] Explain entropy, cross-entropy and KL, and why softmax + CE is used.
- [ ] Prepare an experiment story, a leakage/drift story and a communication story with numbers.
