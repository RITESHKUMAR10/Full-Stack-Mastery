# Pandas & NumPy Interview Q&A: Complete Guide (Fresher → 7+ Years)

> **Version note:** This guide targets **Python 3.11+, NumPy 1.26 / 2.x, and pandas 2.1 – 2.3 with notes on pandas 3.0** (Copy-on-Write on by default, a dedicated string dtype, removal of long-deprecated APIs). It also touches **PyArrow-backed dtypes, Polars, Dask, DuckDB** and scikit-learn interop. Behaviour around `inplace`, chained assignment, `SettingWithCopyWarning`, default dtypes and deprecated functions (`append`, `swaplevel` defaults, `applymap` → `DataFrame.map`) changes between versions: anything marked "verify" should be checked in the official release notes (numpy.org, pandas.pydata.org). Examples use the sample name **Ritesh Kumar** and small sales/orders data.
> This file covers NumPy arrays (dtype, shape, strides, views vs copies, broadcasting, vectorisation, indexing, linear algebra, random), pandas Series/DataFrame, indexing (`loc`/`iloc`/boolean), missing data, `groupby`, merge/join/concat, reshaping (`pivot`, `melt`, `stack`), time series, string and categorical data, apply vs vectorised code, performance and memory tuning, I/O, method chaining, testing, and scaling beyond memory. Related topics: Statistics for ML in `054_Statistics-and-Math-for-ML.md`, machine learning in `056_Machine-Learning.md`, Python language in `../03_Backend/014_Python.md`, SQL in `../04_Database/026_SQL.md`, Data engineering in `075_Data-Engineering.md`, MLOps in `074_MLOps.md`, DSA in `../08_CS_Fundamentals/022_Data-Structures-and-Algorithms.md`.

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

### Q1. What is NumPy and why is it fast? *(Must-know)*
NumPy provides the `ndarray`: a fixed-type, contiguous block of memory with fast C/Fortran loops behind it. It is faster than Python lists because values are stored compactly without per-item Python objects, operations are **vectorised** (one call processes the whole array), and it uses optimised BLAS/LAPACK for linear algebra.

### Q2. What is pandas?
A library for tabular data built on NumPy. Two main types: **Series** (1-D labelled array) and **DataFrame** (2-D table with labelled rows and columns). Strong at loading, cleaning, joining, grouping and summarising data.

### Q3. Python list vs NumPy array *(Must-know)*
| Aspect | list | ndarray |
|---|---|---|
| Types | Mixed | One dtype |
| Memory | Pointers to objects | Contiguous values |
| Math | `[1,2]+[3]` concatenates | `a + b` is element-wise |
| Speed | Slow loops | Vectorised, fast |
| Dimensions | Nested lists | Native n-D |

### Q4. Creating arrays
```python
import numpy as np
a = np.array([1, 2, 3])
z = np.zeros((2, 3)); o = np.ones(4); r = np.arange(0, 10, 2)
l = np.linspace(0, 1, 5); e = np.eye(3)
rng = np.random.default_rng(42); x = rng.normal(size=(3, 3))
```

### Q5. Shape, ndim, size, dtype
`a.shape` (rows, cols), `a.ndim` (number of axes), `a.size` (total elements), `a.dtype` (element type, e.g., `int64`, `float64`). `a.itemsize` is bytes per element; `a.nbytes` total.

### Q6. Indexing and slicing
```python
a = np.arange(12).reshape(3, 4)
a[1, 2]        # element
a[:, 1]        # column 1
a[::2, ::2]    # every second row/col
a[a > 5]       # boolean mask -> 1-D array
```
Slices return **views** (no copy); boolean and fancy indexing return **copies**.

### Q7. Reshape, flatten, transpose
`a.reshape(2, 6)`, `a.reshape(-1, 3)` (infer one dimension), `a.ravel()` (view when possible), `a.flatten()` (always a copy), `a.T` (transpose view).

### Q8. Broadcasting *(Must-know)*
Rule: compare shapes from the right; dimensions are compatible if equal or one is 1 (or missing). The size-1 dimension is stretched virtually without copying.
```python
a = np.ones((3, 4)); b = np.arange(4)       # (3,4) + (4,)  -> (3,4)
col = np.arange(3).reshape(3, 1)            # (3,1) + (1,4) -> (3,4)
```
Incompatible shapes raise `ValueError: operands could not be broadcast together`.

### Q9. Vectorisation
Replace Python loops with array expressions.
```python
# slow
out = [x * 2 + 1 for x in data]
# fast
out = data * 2 + 1
```
Typically 10–100× faster for large arrays.

### Q10. Aggregations and axis
`a.sum()`, `a.mean(axis=0)` (down rows → one value per column), `a.max(axis=1)` (across columns → one per row), `np.std`, `np.argmax`, `np.cumsum`. Remember: **axis is the dimension that disappears**.

### Q11. Universal functions (ufuncs)
Element-wise functions with broadcasting: `np.sqrt`, `np.exp`, `np.log`, `np.add`, `np.maximum`. They support `out=`, `where=` and methods like `.reduce`, `.accumulate`.

### Q12. Matrix operations
`a @ b` or `np.matmul` (matrix product), `a * b` (element-wise), `np.dot`, `a.T`, `np.linalg.inv`, `np.linalg.solve(A, b)` (preferred over inv), `np.linalg.eig`, `np.linalg.svd`.

### Q13. Random numbers
Use the new Generator API: `rng = np.random.default_rng(seed)`; `rng.integers`, `rng.normal`, `rng.choice`, `rng.shuffle`. The legacy `np.random.seed` global state still works but is discouraged.

### Q14. Creating a Series and DataFrame *(Must-know)*
```python
import pandas as pd
s = pd.Series([10, 20, 30], index=["a", "b", "c"])
df = pd.DataFrame({
    "name": ["Ritesh Kumar", "Asha", "Vikram"],
    "city": ["Pune", "Delhi", "Pune"],
    "amount": [250.0, 480.5, 120.0],
})
```

### Q15. Loading and saving data
```python
df = pd.read_csv("orders.csv", parse_dates=["order_date"])
df.to_csv("out.csv", index=False)
df.to_parquet("out.parquet")      # needs pyarrow or fastparquet
pd.read_excel("a.xlsx"); pd.read_json("a.json"); pd.read_sql(query, conn)
```

### Q16. First look at data
`df.head()`, `df.tail()`, `df.shape`, `df.info()` (dtypes, non-null counts, memory), `df.describe()` (numeric summary), `df.dtypes`, `df.columns`, `df["city"].value_counts()`, `df.isna().sum()`.

### Q17. Selecting columns and rows
`df["amount"]` → Series. `df[["name", "amount"]]` → DataFrame. `df.loc[row_labels, col_labels]` is label based; `df.iloc[row_pos, col_pos]` is position based. `df.loc[df.amount > 200, "name"]` filters rows.

### Q18. `loc` vs `iloc` *(Must-know)*
`loc` uses labels and includes the end label in slices (`df.loc[0:2]` gives rows 0,1,2). `iloc` uses integer positions and excludes the end (`df.iloc[0:2]` gives 2 rows).

### Q19. Boolean filtering
```python
df[(df.city == "Pune") & (df.amount > 100)]      # use & | ~ with parentheses
df[df.city.isin(["Pune", "Delhi"])]
df.query("city == 'Pune' and amount > 100")
```
`and`/`or` do not work on Series; use `&`/`|`.

### Q20. Adding and dropping columns
```python
df["amount_with_tax"] = df["amount"] * 1.18
df = df.assign(is_big=lambda d: d.amount > 300)
df = df.drop(columns=["is_big"])
df = df.rename(columns={"amount": "total"})
```

### Q21. Handling missing values *(Must-know)*
Missing values appear as `NaN` (float), `None`, `pd.NA`, or `NaT` (datetime). Tools: `isna()`, `notna()`, `dropna(subset=[...])`, `fillna(value)`, `ffill()`, `bfill()`, `interpolate()`. Decide per column whether to drop, fill or flag.

### Q22. Sorting
`df.sort_values(["city", "amount"], ascending=[True, False])`, `df.sort_index()`, `df.nlargest(5, "amount")`, `df.nsmallest(...)`.

### Q23. Duplicates
`df.duplicated(subset=["order_id"])`, `df.drop_duplicates(subset=["order_id"], keep="first")`.

### Q24. Changing types
`df["amount"].astype("float32")`, `pd.to_numeric(s, errors="coerce")` (bad values → NaN), `pd.to_datetime(s, errors="coerce")`, `s.astype("category")`.

### Q25. Basic groupby *(Must-know)*
```python
df.groupby("city")["amount"].sum()
df.groupby("city").agg(total=("amount", "sum"), orders=("amount", "size"), avg=("amount", "mean"))
```
Split → apply → combine. Named aggregation (`name=(column, func)`) gives clean output.

### Q26. Merge (join) basics *(Must-know)*
```python
pd.merge(orders, customers, on="customer_id", how="left")
```
`how` can be `inner`, `left`, `right`, `outer`, `cross`. Use `left_on`/`right_on` for different column names and `validate="m:1"` to catch duplicate keys.

### Q27. Concat
`pd.concat([df1, df2], axis=0, ignore_index=True)` stacks rows; `axis=1` aligns columns by index. Collect many frames in a list and concat once, not in a loop.

### Q28. Apply, map and vectorised operations
`Series.map(dict_or_func)` for element-wise mapping; `DataFrame.apply(func, axis=1)` for row-wise (slow); `DataFrame.map` (pandas 2.1+) replaces `applymap`. Prefer vectorised operations or `np.where`.

### Q29. String methods
```python
df["name"].str.lower().str.strip()
df["name"].str.contains("kumar", case=False, na=False)
df["email"].str.extract(r"@(.+)$")
```
The `.str` accessor works on string columns.

### Q30. Dates and times basics
```python
df["order_date"] = pd.to_datetime(df["order_date"])
df["month"] = df["order_date"].dt.to_period("M")
df["dow"] = df["order_date"].dt.day_name()
```
Use the `.dt` accessor for datetime columns.

---

# 🔵 Part 2: Junior (1–3 years)

### Q31. Views vs copies in NumPy *(Must-know)*
Basic slicing and `reshape` (when possible) create **views** sharing memory; changing a view changes the original. Fancy/boolean indexing and `.copy()` create copies. Check with `np.shares_memory(a, b)` or `b.base is a`.
```python
a = np.arange(5); v = a[1:4]; v[0] = 99      # a[1] is now 99
c = a[[1, 2]]; c[0] = 0                      # a unchanged
```

### Q32. Fancy indexing and boolean masks
```python
a[[0, 2, 4]]              # pick positions
a[np.array([True, False, True, False, True])]
np.where(a > 2, a, 0)     # conditional value
np.where(a > 2)           # indices where True
```

### Q33. dtypes and overflow
Integer arrays wrap on overflow silently (`np.int8(127) + 1` → -128 with a warning for scalars). Mixed int/float operations upcast. Choose dtypes deliberately (`float32` for ML, `int32` for IDs when safe). NumPy 2 changed some promotion rules (NEP 50): Python scalars no longer upcast arrays (verify).

### Q34. `np.where`, `np.select`, `np.clip`
```python
np.where(df.amount > 300, "high", "low")
np.select([df.amount > 300, df.amount > 100], ["high", "mid"], default="low")
np.clip(a, 0, 1)
```

### Q35. Sorting and searching in NumPy
`np.sort`, `np.argsort` (indices that sort), `np.searchsorted` (binary search), `np.unique(return_counts=True)`, `np.argmax`, `np.partition`/`np.argpartition` (top-k without full sort).

### Q36. Stacking and splitting
`np.concatenate`, `np.vstack`, `np.hstack`, `np.stack` (new axis), `np.split`, `np.array_split`. Use `np.newaxis` (`None`) to add axes: `a[:, None]`.

### Q37. Linear algebra in NumPy
```python
A = np.array([[3., 1.], [1., 2.]]); b = np.array([9., 8.])
x = np.linalg.solve(A, b)                  # solves Ax = b
w, v = np.linalg.eigh(A)                   # symmetric eigen decomposition
U, S, Vt = np.linalg.svd(A)
np.linalg.norm(b); np.linalg.matrix_rank(A)
```
See `054_Statistics-and-Math-for-ML.md`.

### Q38. `einsum` basics
Concise tensor operations: `np.einsum("ij,jk->ik", A, B)` (matmul), `np.einsum("ij->ji", A)` (transpose), `np.einsum("ii", A)` (trace), `np.einsum("bi,bi->b", X, Y)` (row-wise dot). Good for batched maths.

### Q39. `SettingWithCopyWarning` and chained assignment *(Must-know)*
`df[df.a > 1]["b"] = 0` may modify a temporary copy and not `df`. Use a single `loc`: `df.loc[df.a > 1, "b"] = 0`. With **Copy-on-Write** (default in pandas 3.0, opt-in in 2.x via `pd.options.mode.copy_on_write = True`), a derived object never changes its parent, and chained assignment simply does not work (so use `loc`).

### Q40. `inplace=True` myth
`inplace` rarely saves memory and does not make code faster; it prevents method chaining and is being discouraged. Prefer `df = df.dropna()`.

### Q41. `groupby` with `transform`, `apply` and `filter`
- `agg`: reduces each group to a value.
- `transform`: returns same-length result (e.g., group mean per row).
- `filter`: keeps or drops whole groups.
- `apply`: flexible but slower.
```python
df["city_avg"] = df.groupby("city")["amount"].transform("mean")
big_cities = df.groupby("city").filter(lambda g: len(g) >= 3)
df["rank"] = df.groupby("city")["amount"].rank(method="dense", ascending=False)
```

### Q42. Multiple aggregations and `agg` with dicts
```python
df.groupby(["city", "segment"]).agg(
    revenue=("amount", "sum"),
    median_amt=("amount", "median"),
    users=("user_id", "nunique"),
).reset_index()
```
`observed=True` for categorical group keys avoids unwanted empty groups.

### Q43. Merge types and pitfalls
Many-to-many merges multiply rows. Check key uniqueness (`df.key.is_unique`), use `validate="1:1" | "m:1"`, `indicator=True` to see which side matched, and handle suffixes (`suffixes=("_l", "_r")`). Merging on keys with different dtypes (int vs str) gives empty results or errors.

### Q44. `join` vs `merge`
`df1.join(df2)` joins on the index by default (convenient), `merge` is column-based and more explicit. Both return a new DataFrame.

### Q45. Pivot, pivot_table, melt *(Must-know)*
```python
wide = df.pivot_table(index="city", columns="month", values="amount", aggfunc="sum", fill_value=0)
long = wide.reset_index().melt(id_vars="city", var_name="month", value_name="amount")
```
`pivot` needs unique index/column pairs; `pivot_table` aggregates duplicates. `melt` converts wide → long.

### Q46. `stack`, `unstack` and MultiIndex
`unstack()` moves an index level into columns; `stack()` does the reverse. `df.loc[("Pune", "2025-01")]` selects with a MultiIndex; `xs`, `swaplevel`, `reset_index`, `sort_index` are common. Keep MultiIndex only when it helps.

### Q47. Index alignment *(Must-know)*
Operations align on index labels, not position. `s1 + s2` with different indexes gives NaN for non-matching labels. Use `.values`/`reset_index(drop=True)` when you intend positional alignment.

### Q48. Handling missing data in depth
`NaN` is a float, so an int column with a missing value becomes float. Use nullable dtypes (`Int64`, `Float64`, `boolean`, `string`) with `pd.NA`, or `convert_dtypes()`. `NaN != NaN`; use `isna()`. Aggregations skip NaN by default (`skipna=True`).

### Q49. Time series: resample, rolling, shift
```python
ts = df.set_index("order_date").sort_index()
ts["amount"].resample("W").sum()               # weekly totals
ts["amount"].rolling("7D").mean()              # 7-day moving average
ts["prev"] = ts["amount"].shift(1)             # lag
ts["pct"] = ts["amount"].pct_change()
```
Always sort by time; use `rolling(window, min_periods=...)`, `expanding()`, `ewm()`.

### Q50. Time zones and date offsets
`tz_localize("UTC")`, `tz_convert("Asia/Kolkata")`; naive and aware datetimes cannot be compared. Use `pd.offsets.MonthEnd()`, `pd.date_range("2025-01-01", periods=12, freq="MS")`. Store timestamps in UTC.

### Q51. Categorical dtype
`df["city"] = df["city"].astype("category")` saves memory for low-cardinality strings and speeds `groupby`. Supports ordered categories (`CategoricalDtype(["low","mid","high"], ordered=True)`). Watch `observed=` in groupby and unseen categories when concatenating.

### Q52. String cleaning pipeline
```python
df["name"] = (df["name"].str.strip().str.title()
                          .str.replace(r"\s+", " ", regex=True))
df[["first", "last"]] = df["name"].str.split(" ", n=1, expand=True)
```
Vectorised `.str` methods beat Python loops; use `na=False` in `contains`.

### Q53. Reading big CSV files
Use `usecols`, `dtype`, `parse_dates`, `nrows`, `chunksize` (iterator), `engine="pyarrow"`, and convert to Parquet for repeated use.
```python
total = 0
for chunk in pd.read_csv("big.csv", chunksize=500_000, usecols=["amount"]):
    total += chunk["amount"].sum()
```

### Q54. Memory usage and optimisation
`df.info(memory_usage="deep")`, `df.memory_usage(deep=True)`. Downcast numerics (`pd.to_numeric(..., downcast="integer")`), use `category` for repeated strings, nullable/Arrow string dtypes, drop unused columns, and read only needed columns.

### Q55. `apply` vs vectorised vs `np.where` vs `map` (speed)
Fastest to slowest roughly: vectorised column maths → `np.where/np.select` → `Series.map` with dict → `str` methods → `apply(axis=1)` row loop → Python `for` with `iterrows`. Avoid `iterrows`; use `itertuples` if a loop is truly necessary.

### Q56. Sampling and shuffling
`df.sample(frac=0.2, random_state=42)`, `df.sample(n=100, weights="w")`; stratified split with `groupby(...).sample(...)` or scikit-learn `train_test_split(..., stratify=y)`.

### Q57. Binning data
`pd.cut(s, bins=[0, 100, 300, np.inf], labels=["low","mid","high"])` for fixed edges; `pd.qcut(s, q=4)` for quantile bins.

### Q58. Correlation and covariance
`df.corr(numeric_only=True)`, `df["a"].corr(df["b"], method="spearman")`, `df.cov()`. Correlation does not imply causation. See `054_Statistics-and-Math-for-ML.md`.

### Q59. Describe, quantile and outliers
```python
q1, q3 = df.amount.quantile([.25, .75]); iqr = q3 - q1
mask = df.amount.between(q1 - 1.5*iqr, q3 + 1.5*iqr)
clean = df[mask]
```

### Q60. Export and interoperability
`df.to_numpy()` for NumPy arrays (scikit-learn expects arrays/DataFrames), `pd.DataFrame(arr, columns=...)`, `df.to_dict("records")`, `df.to_sql(name, con, if_exists="append", index=False)`.

---

# 🟡 Part 3: Mid (3–5 years)

### Q61. NumPy memory layout, strides and contiguity *(Must-know)*
An array is a buffer plus `shape`, `strides` (bytes to step per axis) and `dtype`. C-order (row-major) is the default; Fortran order is column-major. Transpose changes strides without copying, which can make an array non-contiguous and slow for some operations. `np.ascontiguousarray(a)` forces a contiguous copy.
```python
a = np.arange(12, dtype=np.int64).reshape(3, 4)
a.strides        # (32, 8)
a.T.strides      # (8, 32)  -> view, not contiguous
```

### Q62. Broadcasting patterns for ML
Standardise columns: `(X - X.mean(axis=0)) / X.std(axis=0)`. Pairwise distances without loops:
```python
d2 = ((A[:, None, :] - B[None, :, :]) ** 2).sum(-1)     # (n, m)
```
Watch memory: the intermediate is (n, m, d). For large data use `scipy.spatial.distance.cdist` or the matmul identity.

### Q63. Avoiding Python loops: patterns
Cumulative logic with `cumsum`, group-wise with `groupby.transform`, conditional with `np.select`, lookups with `merge`/`map`, window ops with `rolling`, and previous/next row with `shift`. When no vectorisation exists, use Numba, Cython, or move to SQL/Polars.

### Q64. Numerical stability tricks
Subtract the max in softmax; use `np.log1p`/`np.expm1` for small values; `np.logaddexp`; avoid subtracting nearly equal numbers; prefer `solve` over `inv`; use `float64` for accumulations; `np.isclose` instead of `==`. See `054_Statistics-and-Math-for-ML.md`.

### Q65. Structured arrays and record arrays
Arrays with named fields and different types: `np.dtype([("id","i4"),("score","f8")])`. Mostly replaced by pandas/Arrow but useful for binary formats and C interop.

### Q66. Masked arrays and NaN-aware functions
`np.nanmean`, `np.nansum`, `np.nanpercentile` ignore NaN. `np.ma.masked_invalid(a)` keeps a mask. pandas skips NaN by default; NumPy does not (`np.mean` with NaN returns NaN).

### Q67. Memory-mapped and out-of-core arrays
`np.memmap("big.dat", dtype="float32", mode="r", shape=(n, d))` lets you index a file as an array without loading all of it. Also `np.load(..., mmap_mode="r")`. Beyond that use Dask arrays, Zarr or HDF5.

### Q68. GroupBy internals and performance
`groupby` factorises keys into integer codes, sorts (unless `sort=False`), then applies cython-optimised aggregations for built-in functions (`sum`, `mean`, `size`, `nunique`). Custom Python functions in `apply` are much slower. Use `sort=False`, `observed=True`, categoricals and built-in aggregations.

### Q69. Window functions in pandas (like SQL)
```python
df["running_total"] = df.groupby("customer_id")["amount"].cumsum()
df["rank_in_city"] = df.groupby("city")["amount"].rank(ascending=False, method="first")
df["prev_amt"] = df.groupby("customer_id")["amount"].shift(1)
df["roll3"] = df.groupby("customer_id")["amount"].transform(lambda s: s.rolling(3, min_periods=1).mean())
```
Compare with SQL window functions in `../04_Database/026_SQL.md`.

### Q70. Top-N per group
```python
top2 = (df.sort_values("amount", ascending=False)
          .groupby("city").head(2))
# or: df.groupby("city", group_keys=False).apply(lambda g: g.nlargest(2, "amount"))
```
`head` after sorting is faster than `apply`.

### Q71. Deduplicate keeping latest, and "upsert" logic
```python
latest = (df.sort_values("updated_at")
            .drop_duplicates("customer_id", keep="last"))
merged = old.set_index("id").combine_first(new.set_index("id")).reset_index()
```

### Q72. Efficient joins
Set sorted indexes for repeated joins, reduce columns before joining, use categorical keys, ensure matching dtypes, and use `merge_asof` for nearest-time joins (as-of join):
```python
pd.merge_asof(trades.sort_values("time"), quotes.sort_values("time"),
              on="time", by="symbol", direction="backward")
```

### Q73. Anti-join, semi-join and set operations
```python
anti = a.merge(b[["id"]], on="id", how="left", indicator=True).query("_merge == 'left_only'")
semi = a[a.id.isin(b.id)]
```

### Q74. Reshaping: wide ↔ long with multiple value columns
`pd.wide_to_long`, `melt` with multiple `value_vars`, `pivot` with a list for `values`, `explode` for list columns, `json_normalize` for nested JSON.
```python
df.assign(tag=df.tags.str.split(",")).explode("tag")
pd.json_normalize(records, sep="_")
```

### Q75. Pipelines and method chaining *(Must-know)*
```python
clean = (raw
    .rename(columns=str.lower)
    .assign(order_date=lambda d: pd.to_datetime(d.order_date, errors="coerce"),
            amount=lambda d: pd.to_numeric(d.amount, errors="coerce"))
    .dropna(subset=["order_date", "amount"])
    .query("amount > 0")
    .pipe(add_features)
    .reset_index(drop=True))
```
Chains are readable, avoid intermediate variables, and fit CoW semantics. Use `.pipe` for custom functions.

### Q76. Nullable and Arrow dtypes
`Int64`, `Float64`, `boolean`, `string[pyarrow]`, `ArrowDtype`. Benefits: real missing values for ints, lower memory for strings, faster string ops and zero-copy interop with Arrow/Parquet. Create with `convert_dtypes(dtype_backend="pyarrow")` or `read_csv(..., dtype_backend="pyarrow")`.

### Q77. Parquet vs CSV vs Feather
CSV: text, slow, no schema. Parquet: columnar, compressed, typed, supports column pruning and predicate pushdown; best for analytics. Feather/Arrow IPC: fast local interchange. Use Parquet with partitioning for large datasets.

### Q78. Testing data code
Unit-test transformations with small frames and `pandas.testing.assert_frame_equal`; validate data with Pandera or Great Expectations (types, ranges, uniqueness, null rates); property-based tests with Hypothesis.
```python
from pandas.testing import assert_frame_equal
assert_frame_equal(clean(raw_sample), expected, check_dtype=False)
```

### Q79. Logging and data quality checks
Check row counts before/after joins, null rates, key uniqueness, value ranges, and schema drift. Fail loudly (`assert`/validation errors) rather than producing silently wrong numbers.

### Q80. Parallelism and the GIL
NumPy releases the GIL in many C loops, and BLAS may use multiple threads (control with `OMP_NUM_THREADS`). pandas is mostly single-threaded. Use `multiprocessing`, Dask, Ray, Modin or Polars for parallel processing; avoid pickling huge frames between processes.

### Q81. Numba and Cython for hot loops
`@numba.njit` compiles numeric Python loops to machine code; works with NumPy arrays and scalars, not general pandas objects. Use it when vectorisation is awkward (path-dependent loops, custom rolling windows).

### Q82. Polars, DuckDB and when to switch
Polars: Rust, lazy engine, multi-threaded, expression API, strict types. DuckDB: in-process SQL on Parquet/CSV/pandas frames, great for joins/aggregations beyond memory. Switch when pandas runs out of memory or time; keep pandas for ecosystem integration (scikit-learn, plotting).

### Q83. Plotting basics
`df.plot()` (matplotlib), seaborn (statistical plots), plotly (interactive). Know histograms, box plots, scatter plots, line charts, heatmaps of correlations. Aggregate before plotting millions of points.

### Q84. Reproducibility
Seed random generators, pin library versions (`requirements.txt`/lock file), avoid relying on unsorted `groupby` or set ordering, record data versions, and avoid hidden global options (`pd.set_option`) in library code.

---

# 🟠 Part 4: Senior (5–7 years)

### Q85. Design a pandas-based ETL job that must be reliable *(Must-know)*
- **Ingest:** read with explicit `dtype`, `usecols`, `parse_dates`; validate schema first (Pandera).
- **Transform:** pure functions in a method chain; no in-place mutation; deterministic sorting.
- **Quality:** assertions on keys, null thresholds, row-count reconciliation vs source; quarantine bad rows to a separate file.
- **Idempotency:** write by partition (date) to Parquet using temp path + atomic rename so reruns replace, not duplicate.
- **Scale:** chunk or switch to Polars/DuckDB/Spark when data exceeds RAM.
- **Observability:** log counts, timings, schema hash; alert on anomalies.
- **Testing:** golden-file tests on small samples; property-based tests on edge cases.

### Q86. Copy-on-Write explained *(Must-know)*
With CoW, any DataFrame/Series derived from another behaves like a copy: modifying it never modifies the parent, but data is copied lazily only when needed. Benefits: predictable semantics, fewer defensive `.copy()` calls, better performance. Consequences: chained assignment (`df["a"][0] = 1`) and views-as-aliases no longer update the original. It is the default in pandas 3.0 and opt-in in 2.x.

### Q87. Profiling pandas code
`%timeit`, `%prun`/`cProfile`, `line_profiler`, `memory_profiler`/`tracemalloc`, `df.info(memory_usage="deep")`. Measure first: typical hotspots are `apply(axis=1)`, repeated concat in loops, object-dtype string operations, and unnecessary copies.

### Q88. Handling data larger than memory
1. Select only needed columns/rows at read time. 2. Process in chunks with incremental aggregation. 3. Use Parquet + partition pruning. 4. Use DuckDB/Polars lazy mode for out-of-core. 5. Use Dask/Spark/Ray for clusters. 6. Sample for exploration, full data for production. Know the memory formula: rows × Σ(dtype size) plus overhead (object strings are expensive).

### Q89. Group-wise computations that are hard to vectorise
Options: `groupby.transform` with built-ins, `numba`-compiled group functions, sorting + `np.add.reduceat`, `cumcount` tricks, or moving the logic into SQL window functions or Polars expressions. Avoid per-group Python loops over thousands of groups with large frames.

### Q90. Feature engineering patterns for ML
Aggregations per entity (`groupby().agg`), lag/rolling features with time-aware splits, target encoding with out-of-fold computation (avoid leakage), ratio and interaction features, cyclical encoding of time (`sin/cos`), frequency encoding, binning, and one-hot via `pd.get_dummies` or scikit-learn `ColumnTransformer`. Fit transformers only on training data. See `056_Machine-Learning.md`.

### Q91. Avoiding leakage in time-based features
Compute features using only data available **before** the prediction time: `shift(1)` before rolling; use `closed="left"` in rolling windows; split by time; for entity-level aggregates, build features as-of the cutoff date.
```python
df["avg_prev_7d"] = (df.sort_values("ts").groupby("user")["amt"]
                       .transform(lambda s: s.shift(1).rolling(7, min_periods=1).mean()))
```

### Q92. Numerical precision and money
Binary floats cannot represent decimals like 0.1 exactly. For currency store integer minor units (paise/cents) or use `decimal.Decimal` (object dtype, slow). Round only at presentation. Compare with tolerances.

### Q93. Join explosions and data quality at scale
Diagnose with `len(left)`, `len(result)`, key uniqueness, `merge(..., validate=...)`, and group counts by key. Build a "join contract": declared cardinality, tests, and monitoring of row counts after each join.

### Q94. Sparse data
`scipy.sparse` (CSR/CSC/COO) for mostly-zero matrices (text features, one-hot). pandas has `SparseDtype`. Know that operations such as dense conversion explode memory; use sparse-aware estimators.

### Q95. Pandas on Spark / Dask / Modin: trade-offs
Dask DataFrame: partitions + lazy graph, pandas-like API, good for medium clusters. Spark (pandas API on Spark): robust at huge scale, JVM overhead. Modin: drop-in parallel pandas. API coverage is partial, so some operations differ or are slow (global sorts, shuffles). Choose by data size, infra and team skills.

### Q96. Working with JSON, nested and semi-structured data
`json_normalize`, `explode`, `.str.get`, `pd.read_json(lines=True)`, parse once into typed columns, store as Parquet with struct/list types (Arrow). Avoid keeping Python dict/list objects in columns for large data.

### Q97. Dataframe contracts with Pandera / schemas
```python
import pandera as pa
schema = pa.DataFrameSchema({
    "order_id": pa.Column(int, unique=True),
    "amount":   pa.Column(float, pa.Check.ge(0)),
    "city":     pa.Column(str, pa.Check.isin(["Pune", "Delhi", "Mumbai"])),
})
schema.validate(df)
```
Schemas document and enforce expectations at pipeline boundaries.

### Q98. NumPy in production ML: batching, dtypes and GPUs
Use `float32` for models, preallocate arrays, avoid growing arrays in loops, keep data contiguous, use `np.save`/Arrow for fast IO, and convert to tensors with zero-copy (`torch.from_numpy`) when possible. See `058_PyTorch.md`.

### Q99. Common anti-patterns in code review
`for` loops over rows, `iterrows`, `apply(axis=1)` for simple math, chained indexing, reading the same file repeatedly, `append` in a loop, hidden global state, magic column names scattered everywhere, no schema checks, `inplace=True` everywhere, and silent `errors="ignore"`.

### Q100. Building a reusable data-prep library
Keep pure functions with typed inputs/outputs, column-name constants/enums, schema validation, docstrings with examples, unit tests, performance benchmarks, versioned releases, and a thin CLI/job layer. Separate "feature definitions" from "execution engine" so you can run on pandas, Polars or Spark.

---

# 🔴 Part 5: Lead / Architect (7+ years)

### Q101. How do you choose the data processing stack for a team? *(Must-know)*
Inputs: data size (MB/GB/TB), latency (batch vs streaming), team skills, existing infrastructure, cost, ecosystem integration. Typical guide: <10 GB → pandas/Polars on one machine; 10 GB–1 TB → Polars/DuckDB/Dask on a big node or small cluster; TB+ or shared lakehouse → Spark/BigQuery/Snowflake. Standardise on Parquet/Arrow as the interchange format to avoid lock-in.

### Q102. Data quality strategy
Contracts at boundaries, automated tests (schema, ranges, uniqueness, freshness), lineage, anomaly monitoring, quarantine and replay, ownership of datasets, and SLAs. Treat data bugs like production incidents with postmortems.

### Q103. Notebook to production
Move logic into tested modules, parameterise jobs, use orchestrators (Airflow, Prefect, Dagster), version data and code, containerise, add logging and alerts, and review notebooks like code. Keep notebooks for exploration and communication. See `075_Data-Engineering.md` and `074_MLOps.md`.

### Q104. Governance, privacy and PII
Classify columns, hash/tokenise identifiers, minimise retention, restrict access, mask in non-prod, log access, and ensure transformations do not re-identify individuals. Never print or commit raw PII in notebooks.

### Q105. Cost and performance management
Measure cost per job, right-size machines, use columnar formats and pruning, cache intermediate results, avoid recomputation, and schedule heavy jobs off-peak. Replace slow pandas steps with SQL/engine pushdown when data already lives in a warehouse.

### Q106. Upgrade strategy for pandas/NumPy major versions
Pin versions, run the test suite with warnings as errors on the new version (`-W error::FutureWarning`), fix deprecations incrementally (enable CoW early), read release notes, canary on a subset of jobs, and plan binary-compatibility checks for compiled dependencies (NumPy 2 ABI).

### Q107. Standards for team code
Style guide (naming, chaining, no `inplace`), type hints/Pandera schemas, shared utility library, code review checklist (vectorised? dtypes? joins validated? leakage?), performance budget, and templates for notebooks and jobs.

### Q108. Evaluating Polars/DuckDB adoption
Pilot on a slow pipeline, compare runtime, memory, code clarity and correctness against pandas; check library ecosystem needs (scikit-learn, plotting), training cost, and long-term maintenance. Adopt incrementally with Arrow interchange.

### Q109. Mentoring analysts and engineers
Teach thinking in columns not rows, how to read `info()`, to verify joins, to profile before optimising, and to write small tests. Provide examples of good vs bad pandas and a "slow code clinic".

### Q110. Communicating data work to leadership
Report outcomes: "Replaced 6-hour pandas job with a Parquet + DuckDB pipeline (14 minutes), cut cloud spend 70%, added data quality checks that caught three upstream schema changes before they hit dashboards." Mention risks and maintenance plan.

---

# 💻 Part 6: Hands-On Tasks & Code

### H1. Sample data used in the examples
```python
import numpy as np, pandas as pd
rng = np.random.default_rng(42)
n = 1000
orders = pd.DataFrame({
    "order_id": np.arange(1, n + 1),
    "customer_id": rng.integers(1, 201, n),
    "city": rng.choice(["Pune", "Delhi", "Mumbai", "Bengaluru"], n),
    "amount": rng.gamma(2.0, 150.0, n).round(2),
    "order_date": pd.to_datetime("2025-01-01") + pd.to_timedelta(rng.integers(0, 365, n), unit="D"),
})
customers = pd.DataFrame({
    "customer_id": np.arange(1, 201),
    "name": ["Ritesh Kumar"] + [f"Customer {i}" for i in range(2, 201)],
    "segment": rng.choice(["retail", "pro"], 200),
})
```

### H2. Cleaning pipeline with validation
```python
def clean(raw: pd.DataFrame) -> pd.DataFrame:
    out = (raw
        .assign(amount=lambda d: pd.to_numeric(d["amount"], errors="coerce"),
                order_date=lambda d: pd.to_datetime(d["order_date"], errors="coerce"))
        .dropna(subset=["amount", "order_date"])
        .query("amount > 0")
        .drop_duplicates("order_id")
        .astype({"city": "category"}))
    assert out["order_id"].is_unique
    return out.reset_index(drop=True)
```

### H3. Monthly revenue, top customers, and city share
```python
orders = clean(orders)
monthly = (orders.set_index("order_date")["amount"]
                 .resample("MS").agg(["sum", "count", "mean"]))
top = (orders.groupby("customer_id")["amount"].sum()
             .nlargest(5).rename("revenue").reset_index())
share = orders.groupby("city", observed=True)["amount"].sum()
share = (share / share.sum()).round(3).sort_values(ascending=False)
```

### H4. Safe merge with validation and diagnostics
```python
res = orders.merge(customers, on="customer_id", how="left",
                   validate="m:1", indicator=True)
print(res["_merge"].value_counts())          # check unmatched keys
assert len(res) == len(orders)               # no row explosion
res = res.drop(columns="_merge")
```

### H5. Group-wise features: running total, rank, lag, rolling mean
```python
o = orders.sort_values(["customer_id", "order_date"]).copy()
g = o.groupby("customer_id")["amount"]
o["cum_spend"] = g.cumsum()
o["order_no"] = g.cumcount() + 1
o["prev_amt"] = g.shift(1)
o["avg_prev3"] = g.transform(lambda s: s.shift(1).rolling(3, min_periods=1).mean())
o["rank_in_city"] = o.groupby("city", observed=True)["amount"].rank(ascending=False, method="dense")
```

### H6. Cohort retention table
```python
o["cohort"] = o.groupby("customer_id")["order_date"].transform("min").dt.to_period("M")
o["period"] = o["order_date"].dt.to_period("M")
o["age"] = (o["period"] - o["cohort"]).apply(lambda x: x.n)
cohort = (o.groupby(["cohort", "age"])["customer_id"].nunique()
            .unstack(fill_value=0))
retention = cohort.div(cohort[0], axis=0).round(2)
```

### H7. Vectorised vs loop speed comparison
```python
import time
x = rng.normal(size=1_000_000)

t = time.perf_counter(); slow = [v * 2 + 1 for v in x]; a = time.perf_counter() - t
t = time.perf_counter(); fast = x * 2 + 1;               b = time.perf_counter() - t
print(f"loop {a:.3f}s vs vectorised {b:.4f}s")
```

### H8. Pairwise distance with broadcasting, and a check
```python
A = rng.normal(size=(500, 8)); B = rng.normal(size=(300, 8))
d_broadcast = np.sqrt(((A[:, None, :] - B[None, :, :]) ** 2).sum(-1))
from scipy.spatial.distance import cdist
assert np.allclose(d_broadcast, cdist(A, B))
```

### H9. Reduce memory of a large frame
```python
def shrink(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    for c in df.select_dtypes("integer"):
        df[c] = pd.to_numeric(df[c], downcast="integer")
    for c in df.select_dtypes("float"):
        df[c] = pd.to_numeric(df[c], downcast="float")
    for c in df.select_dtypes("object"):
        if df[c].nunique() / len(df) < 0.5:
            df[c] = df[c].astype("category")
    return df

before = orders.memory_usage(deep=True).sum()
after = shrink(orders).memory_usage(deep=True).sum()
print(before, after)
```

### H10. Chunked aggregation of a huge CSV
```python
from collections import defaultdict
totals = defaultdict(float)
for chunk in pd.read_csv("orders_big.csv", usecols=["city", "amount"],
                         dtype={"city": "category", "amount": "float32"},
                         chunksize=1_000_000):
    for city, v in chunk.groupby("city", observed=True)["amount"].sum().items():
        totals[city] += v
```

### H11. As-of join and rolling time window
```python
trades = pd.DataFrame({"time": pd.to_datetime(["2025-01-01 10:00:01", "2025-01-01 10:00:05"]), "px": [100, 101]})
quotes = pd.DataFrame({"time": pd.to_datetime(["2025-01-01 10:00:00", "2025-01-01 10:00:04"]), "bid": [99.5, 100.5]})
pd.merge_asof(trades, quotes, on="time")
```

---

# 🐞 Part 7: Debugging Scenarios

### D1. `SettingWithCopyWarning` or assignment does not stick
Chained indexing (`df[mask]["col"] = x`). Use `df.loc[mask, "col"] = x`. Enable CoW (`pd.options.mode.copy_on_write = True`) to get consistent behaviour; call `.copy()` when you intentionally need a separate frame.

### D2. `ValueError: operands could not be broadcast together`
Shapes are incompatible. Print `a.shape`, `b.shape`; add axes (`a[:, None]`), reshape, or transpose. Remember broadcasting aligns from the right.

### D3. `KeyError` on a column that is clearly there
Trailing spaces or case in column names, MultiIndex columns, or the column is the index. Inspect `df.columns.tolist()`, `repr` of names, clean with `df.columns = df.columns.str.strip().str.lower()`.

### D4. Merge returns more rows than expected
Duplicate keys on one side (many-to-many). Check `df.key.duplicated().sum()`, use `validate="m:1"`, deduplicate the lookup table, or aggregate first.

### D5. Merge returns zero matches
Dtype mismatch (`int` vs `str`), whitespace/case differences, different formats of dates, or NaN keys. Cast to the same dtype, `str.strip()`, normalise values and compare `set(left.key) & set(right.key)`.

### D6. Integers turned into floats
A missing value (NaN) forces float64. Use nullable `Int64`, fill missing before casting, or keep as float intentionally.

### D7. `ValueError: The truth value of a Series is ambiguous`
Used `and`/`or`/`if series`. Use `&`, `|`, `~` with parentheses, or `.any()`/`.all()`/`.empty` as intended.

### D8. Dates not parsed or parsed wrongly
Mixed formats or day/month ambiguity. Use `pd.to_datetime(s, format="%d-%m-%Y", errors="coerce")`, `dayfirst=True`, check `NaT` count, and standardise time zones.

### D9. Code is very slow
Look for `apply(axis=1)`, `iterrows`, loops that concat, object strings, repeated merges. Profile, then vectorise, use categoricals, pre-allocate and push work into built-in groupby/merge operations.

### D10. `MemoryError` or kernel crash
Data too large or hidden copies. Load fewer columns, set dtypes, use chunks, Parquet, `category`, delete unused frames (`del df; gc.collect()`), or switch to DuckDB/Polars/Dask.

### D11. Different results between runs
Unseeded randomness, unsorted groupby, ties in sorting or `idxmax`, multithreaded float reductions, or set ordering. Seed RNGs, sort explicitly with stable keys, and compare with tolerances.

### D12. `groupby` result has unexpected index or missing groups
`as_index=True` default puts keys in the index (`reset_index()` or `as_index=False`); NaN keys are dropped unless `dropna=False`; categorical keys show empty groups unless `observed=True`.

### D13. Rolling or shift introduces leakage
Windows include the current row. Use `shift(1)` before rolling or `closed="left"`; split by time; verify with a manual check on a small example.

### D14. Percentages or means look wrong after concatenation
Index duplicates or misaligned columns after `concat`. Use `ignore_index=True`, check column order/dtypes, and `sort=False`; for index alignment use explicit `reset_index`.

### D15. NumPy array changed unexpectedly
A view was modified (slice, `ravel`, `reshape`). Use `.copy()` where independence is required, and check `np.shares_memory`.

---

# 🧩 Part 8: Tricky Questions

### T1. Does `a[1:3]` create a copy?
No, it is a view. Changing it changes `a`.

### T2. Does `a[[1, 2]]` create a view?
No. Fancy indexing returns a copy.

### T3. Is `inplace=True` faster?
Usually not. It often copies internally and blocks chaining.

### T4. Is `df.loc[a:b]` end-inclusive?
Yes for labels. `iloc` slices exclude the end.

### T5. Is `NaN == NaN`?
No, it is `False`. Use `isna()`/`np.isnan`.

### T6. Is `np.mean` ignoring NaN?
No; it returns NaN. `Series.mean()` skips NaN by default; use `np.nanmean` for arrays.

### T7. Is `apply` always vectorised?
No. It runs a Python function per row/column/element and is slow compared with real vectorisation.

### T8. Does `merge` keep row order?
For `how="left"` the left order is kept; for others do not rely on it. Sort explicitly.

### T9. Does `drop_duplicates` keep the latest by default?
No, it keeps the first (`keep="first"`). Sort first or use `keep="last"`.

### T10. Does `groupby().count()` equal `.size()`?
No. `count` excludes NaN per column; `size` counts rows in the group.

### T11. Does `df.copy()` deep-copy Python objects inside cells?
It copies the data buffers, but objects inside object-dtype cells (lists/dicts) are still shared references (a `deep=True` copy does not recursively copy them).

### T12. Is `float` arithmetic exact in pandas?
No. `0.1 + 0.2 != 0.3` exactly; use `np.isclose` or integers/decimals for money.

### T13. Is `np.arange(0, 1, 0.1)` guaranteed to have 10 elements?
Usually, but floating step can create off-by-one at the end; use `np.linspace` when you need an exact count.

### T14. Does `axis=0` mean "rows"?
It means operate along the rows, down the column, giving one value per column. Think "the axis that gets collapsed".

### T15. Is a pandas `object` column always strings?
No; it may hold mixed Python objects. Use `string`/`category` dtypes for clarity.

### T16. Is `df["a"] = value` on a slice safe?
Not if the slice is a copy (older pandas); use `loc` on the original or `.copy()` explicitly.

### T17. Is Parquet always smaller and faster than CSV?
Almost always for analytics (columnar, compressed, typed), but tiny files or write-once-read-once text tasks may not benefit.

### T18. Is `reset_index()` in-place?
No. It returns a new frame unless `inplace=True`.

---

# ⚡ Part 9: Rapid Fire (One-Liners)

- **Core NumPy type?** `ndarray`.
- **Core pandas types?** Series, DataFrame.
- **Element-wise multiply?** `a * b`; matrix `a @ b`.
- **Add axis?** `a[:, None]` / `np.newaxis`.
- **Infer a dimension?** `reshape(-1, k)`.
- **View or copy for slices?** View.
- **Fancy index?** Copy.
- **Label vs position?** `loc` vs `iloc`.
- **Filter rows?** Boolean mask / `query`.
- **Row-wise condition?** `np.where`, `np.select`.
- **Group summary?** `groupby().agg()`.
- **Group result same shape?** `transform`.
- **Join tables?** `merge`.
- **Stack frames?** `concat`.
- **Wide → long?** `melt`.
- **Long → wide?** `pivot_table`.
- **Missing check?** `isna()`.
- **Fill forward?** `ffill()`.
- **Type convert?** `astype`, `to_numeric`, `to_datetime`.
- **Time resample?** `resample("W")`.
- **Lag feature?** `shift(1)`.
- **Moving average?** `rolling(7).mean()`.
- **Memory saver for strings?** `category`.
- **Fast file format?** Parquet.
- **Avoid?** `iterrows`, `apply(axis=1)`, chained assignment.
- **Solve linear system?** `np.linalg.solve`.
- **Random generator?** `np.random.default_rng`.
- **Out-of-core options?** chunks, DuckDB, Polars, Dask.

---

# 🎤 Part 10: Project / Behavioral Questions

### P1. Tell me about a data pipeline you built with pandas.
STAR: "I built a daily sales pipeline reading 30 CSVs from vendors. I added schema validation, typed reads, deduplication, and a left-join to a product master with `validate='m:1'`. Output was partitioned Parquet. Runtime fell from 45 to 6 minutes, and join checks caught two vendor format changes before they reached finance."

### P2. A performance problem you fixed.
"A feature job used `apply(axis=1)` over 8 million rows. I rewrote it with vectorised columns, `np.select` and a category dtype, then moved the heavy join into DuckDB. The job went from 3 hours to 9 minutes with identical results (verified with `assert_frame_equal`)."

### P3. A data bug you found.
"Revenue was inflated 12%. A many-to-many merge on a non-unique product key duplicated rows. I added `validate` checks, deduplicated the dimension table, and put row-count reconciliation tests in CI."

### P4. How do you handle messy data?
"Profile first (`info`, `describe`, null rates, value counts), define rules with the data owner, apply them in a documented pipeline, quarantine unfixable rows, and track data quality metrics over time."

### P5. Pandas vs SQL vs Spark?
"SQL when data already sits in a warehouse and logic is set-based; pandas/Polars for single-node exploration, feature engineering and ML glue; Spark or warehouse engines when data exceeds a node or needs shared governance."

### P6. How do you ensure results are correct?
"Small hand-checked fixtures, invariants (totals match source, keys unique, no unexpected nulls), property tests, comparison against the old system during migration, and code review with a checklist."

---

# 📚 Part 11: Complete Coverage (Topics + Mixed)

## Topics
- **NumPy core:** ndarray, dtype, shape, strides, views/copies, indexing, broadcasting, ufuncs, aggregations, linear algebra, random Generator, einsum, memmap, masked arrays, structured arrays.
- **pandas core:** Series, DataFrame, Index/MultiIndex, `loc`/`iloc`, boolean filtering, assignment, dtypes, missing data, duplicates, sorting.
- **Transformations:** `groupby` (agg, transform, filter, apply), window functions, merge/join/concat, merge_asof, pivot/melt/stack/unstack/explode, binning, string and datetime accessors, categorical data.
- **Time series:** parsing, time zones, resample, rolling/expanding/ewm, shift, period vs timestamp.
- **I/O:** CSV, Excel, JSON, SQL, Parquet, Feather, chunking, compression.
- **Performance:** vectorisation, dtypes, memory optimisation, categoricals, Arrow, Numba, profiling.
- **Scale:** Dask, Polars, DuckDB, Spark, Modin, Zarr/HDF5.
- **Quality and engineering:** method chaining, Copy-on-Write, testing, Pandera/Great Expectations, reproducibility, pipelines.
- **ML tie-ins:** feature engineering, leakage, scikit-learn interop, NumPy → tensors.

## Mixed topics
- Pandas/NumPy + statistics (`054_Statistics-and-Math-for-ML.md`): descriptive stats, tests, simulation.
- Pandas/NumPy + ML (`056_Machine-Learning.md`): preprocessing, pipelines, evaluation.
- Pandas/NumPy + deep learning (`057_Deep-Learning.md`, `058_PyTorch.md`): arrays → tensors, batching.
- Pandas/NumPy + NLP/CV (`059_NLP.md`, `060_Computer-Vision.md`): text frames, image arrays.
- Pandas + SQL (`../04_Database/026_SQL.md`, `028_PostgreSQL.md`): joins, windows, `read_sql`.
- Pandas + data engineering/MLOps (`075_Data-Engineering.md`, `074_MLOps.md`): ETL, orchestration, monitoring.
- Pandas + Python (`../03_Backend/014_Python.md`): generators, typing, packaging.
- Pandas + APIs (`../03_Backend/015_FastAPI.md`): serving results as JSON.

---

# 🔬 Part 12: Internals

### I1. ndarray structure
An `ndarray` object holds a pointer to a data buffer, `dtype`, `shape`, `strides`, flags (C/F contiguous, writeable, owndata) and a `base` reference if it is a view. Indexing computes the byte offset as `Σ index[i] × strides[i]`.

### I2. Why ufuncs are fast
Ufuncs are compiled C loops that iterate over memory using strides, with SIMD optimisations, avoiding Python overhead per element. Broadcasting uses zero strides for stretched axes (no memory copy).

### I3. BLAS/LAPACK
Matrix multiplication and decompositions call optimised libraries (OpenBLAS, MKL, Accelerate) that use blocked algorithms and multi-threading. Performance depends on contiguous memory and dtype (`float32/float64`); integer matmul is much slower.

### I4. pandas Block Manager
A DataFrame stores columns grouped by dtype in 2-D "blocks" (NumPy arrays) plus axes indexes. Operations on single columns can be cheap; operations mixing many dtypes may copy. Arrow-backed dtypes store columns as Arrow arrays instead.

### I5. Index structures
Indexes are immutable arrays with optional hash tables for fast lookup (`get_loc`), sorted checks enabling binary search, and special types (DatetimeIndex, PeriodIndex, MultiIndex with levels and codes). Monotonic indexes enable fast slicing.

### I6. GroupBy mechanics
Key columns are factorised to integer group codes, group boundaries are computed (often via sorting or hashing), and aggregation kernels (Cython) run over each group's data. `transform` broadcasts group results back to the original positions.

### I7. Merge algorithms
Hash join on factorised keys (build a hash table from one side, probe with the other), with sort-merge used for `merge_asof` and ordered joins. Result row order and memory depend on join type and key uniqueness.

### I8. Copy-on-Write
Objects track references to shared data; when a write is attempted on shared data, pandas copies just before the write ("lazy copy"). This replaces the heuristic "view vs copy" logic that caused `SettingWithCopyWarning`.

### I9. Floating-point behaviour
IEEE 754 doubles have 53 bits of precision (about 15–16 decimal digits). Summation order matters; NumPy uses pairwise summation to reduce error; `np.float32` accumulates more error. Use `math.fsum` or higher precision when needed.

---

# 📊 Part 13: Reference Tables

### NumPy vs pandas
| Aspect | NumPy | pandas |
|---|---|---|
| Data | Homogeneous n-D array | Heterogeneous table |
| Labels | None (positions) | Row/column labels |
| Missing values | NaN (float only) | NaN/NA, nullable dtypes |
| Best for | Numeric computing, ML arrays | Cleaning, joins, grouping, time series |
| Speed | Highest for numeric | Overhead from labels/alignment |

### Common dtypes
| dtype | Bytes | Use |
|---|---|---|
| `int8/16/32/64` | 1/2/4/8 | Counts, IDs |
| `float32/64` | 4/8 | ML / general numeric |
| `bool` | 1 | Masks |
| `datetime64[ns]` | 8 | Timestamps |
| `category` | codes + categories | Low-cardinality strings |
| `string[pyarrow]` | variable | Text, lower memory |
| `Int64` (nullable) | 8 + mask | Integers with missing values |

### Join types
| `how` | Keeps |
|---|---|
| inner | Keys in both |
| left | All left rows |
| right | All right rows |
| outer | All rows from both |
| cross | Cartesian product |

### Performance ladder (typical)
| Approach | Relative speed |
|---|---|
| Vectorised column maths | Fastest |
| `np.where` / `np.select` | Very fast |
| Built-in groupby aggregation | Fast |
| `Series.map` with dict | Fast |
| `.str` methods (object) | Medium |
| `apply(axis=1)` | Slow |
| `iterrows` / Python loop | Slowest |

### Version/feature notes (verify)
| Item | Notes |
|---|---|
| pandas 3.0 | Copy-on-Write default, new `str` dtype, removed deprecated APIs |
| `DataFrame.applymap` | Deprecated in favour of `DataFrame.map` (2.1+) |
| `DataFrame.append` | Removed in pandas 2.0; use `concat` |
| NumPy 2.0 | Cleaned namespace, NEP 50 promotion rules, ABI changes |
| `np.random.seed` | Legacy; prefer `default_rng` |
| `dtype_backend="pyarrow"` | Available in many read functions (2.0+) |
| `groupby(..., observed=)` | Default changes for categoricals; set explicitly |

---

# 🔮 Part 14: Output & Prediction Questions

### O1.
```python
a = np.arange(6).reshape(2, 3)
print(a.sum(axis=0))
```
**Result:** `[3 5 7]` (column sums).

### O2.
```python
a = np.arange(5); b = a[1:4]; b[0] = 99; print(a)
```
**Result:** `[ 0 99  2  3  4]` (slice is a view).

### O3.
```python
np.array([1, 2, 3]) + np.array([[10], [20]])
```
**Result:** `[[11 12 13], [21 22 23]]` (broadcast to shape (2,3)).

### O4.
```python
s = pd.Series([1, 2, 3], index=[0, 1, 2])
s.loc[0:1].tolist(), s.iloc[0:1].tolist()
```
**Result:** `[1, 2]` and `[1]`.

### O5.
```python
pd.Series([1, np.nan, 3]).mean()
```
**Result:** `2.0` (NaN skipped).

### O6.
```python
np.mean([1, np.nan, 3])
```
**Result:** `nan`.

### O7.
```python
df = pd.DataFrame({"g": ["a","a","b"], "v": [1, 2, 3]})
df.groupby("g")["v"].transform("sum").tolist()
```
**Result:** `[3, 3, 3]`.

### O8.
```python
pd.Series([1, 2]) + pd.Series([10, 20], index=[1, 2])
```
**Result:** index 0 → NaN, 1 → 12, 2 → NaN (alignment on labels).

### O9.
```python
a = pd.DataFrame({"k": [1, 1], "x": [1, 2]})
b = pd.DataFrame({"k": [1, 1], "y": [5, 6]})
len(a.merge(b, on="k"))
```
**Result:** `4` (many-to-many).

### O10.
```python
pd.Series([1, 2, None]).dtype
```
**Result:** `float64` (None becomes NaN).

### O11.
```python
np.arange(10).reshape(-1, 5).shape
```
**Result:** `(2, 5)`.

### O12.
```python
df = pd.DataFrame({"a": [1, 2, 3]})
df[df.a > 1]["a"] = 0
df.a.tolist()
```
**Result:** `[1, 2, 3]` in classic pandas (chained assignment on a temporary copy) and also unchanged with Copy-on-Write; use `df.loc[df.a > 1, "a"] = 0`.

---

# ✅ Part 15: MCQs

**1. NumPy arrays are faster than lists mainly because of:**
A) Smaller names  B) Contiguous typed memory and vectorised C loops  C) Using GPU always  D) Automatic caching
**Answer: B**

**2. `df.loc[0:2]` returns:**
A) 2 rows  B) 3 rows (end-inclusive)  C) 1 row  D) Error
**Answer: B**

**3. Which creates a copy?**
A) `a[1:3]`  B) `a[[1, 2]]`  C) `a.T`  D) `a.reshape(...)` (contiguous)
**Answer: B**

**4. Best way to apply a condition with two outcomes vectorised:**
A) `for` loop  B) `np.where`  C) `iterrows`  D) `eval` string
**Answer: B**

**5. `groupby().transform("mean")` returns:**
A) One row per group  B) Same length as input  C) A dict  D) A scalar
**Answer: B**

**6. To validate merge cardinality use:**
A) `validate="m:1"`  B) `sort=True`  C) `copy=False`  D) `suffixes`
**Answer: A**

**7. Missing value in an int column makes it:**
A) String  B) float64 (unless nullable Int64)  C) bool  D) Error always
**Answer: B**

**8. `axis=0` in `df.sum(axis=0)` sums:**
A) Across columns for each row  B) Down rows for each column  C) The whole frame  D) Index only
**Answer: B**

**9. Best file format for large analytical data:**
A) CSV  B) Parquet  C) TXT  D) Pickle for sharing
**Answer: B**

**10. Which is the slowest approach for row-wise logic?**
A) Vectorised ops  B) `np.select`  C) `iterrows`  D) `map` with dict
**Answer: C**

**11. Broadcasting rule compares shapes starting from:**
A) The left  B) The right  C) The middle  D) The largest axis
**Answer: B**

**12. `pd.concat` in a loop is bad because:**
A) It cannot work  B) It copies data repeatedly (quadratic cost)  C) It sorts data  D) It drops index
**Answer: B**

**13. The recommended RNG API in NumPy:**
A) `np.random.seed`  B) `default_rng`  C) `random.random`  D) `os.urandom`
**Answer: B**

**14. Category dtype is good for:**
A) Unique ids  B) Low-cardinality repeated strings  C) Floats  D) Booleans
**Answer: B**

**15. Which solves Ax = b stably?**
A) `np.linalg.inv(A) @ b`  B) `np.linalg.solve(A, b)`  C) `A / b`  D) `A.dot(b)`
**Answer: B**

**16. Copy-on-Write ensures:**
A) Views always update parents  B) Derived objects never modify their parent  C) No memory is used  D) Faster CSV reads only
**Answer: B**

**17. `merge_asof` is used for:**
A) Exact joins only  B) Nearest-key (e.g., time) joins  C) Cross joins  D) Deleting rows
**Answer: B**

**18. `df.duplicated()` by default marks:**
A) First occurrence as duplicate  B) Later occurrences as duplicates  C) All occurrences  D) None
**Answer: B**

**19. Which avoids leakage for a lag-based rolling mean?**
A) Include current row  B) `shift(1)` before rolling  C) Shuffle rows  D) Fill NaN with future values
**Answer: B**

**20. Lazy, multi-threaded, Rust-based dataframe library:**
A) Polars  B) Matplotlib  C) Seaborn  D) NLTK
**Answer: A**

---

# ⚠️ Part 16: Common Mistakes

1. **Python loops** (`iterrows`, row-wise `apply`) instead of vectorised code.
2. **Chained assignment** and ignoring `SettingWithCopyWarning`.
3. **Using `and`/`or`** instead of `&`/`|` on Series.
4. **Merging without checking key uniqueness**, causing row explosions.
5. **Dtype mismatches in join keys** (int vs string).
6. **Not setting dtypes** when reading big files (everything becomes object/float64).
7. **Growing a DataFrame inside a loop** with `concat`.
8. **Using `inplace=True`** thinking it is faster.
9. **Confusing `loc` and `iloc` slicing rules.**
10. **Ignoring NaN semantics** (`NaN != NaN`, skipna differences between NumPy and pandas).
11. **Using `inv()`** instead of `solve()`.
12. **Modifying views by accident** in NumPy.
13. **Floating-point equality** (`==`) and floats for money.
14. **Leaking future data** with rolling windows and group statistics.
15. **Fitting scalers/encoders on full data** before the split.
16. **Unsorted time data** before `rolling`, `shift`, `resample`.
17. **Naive datetimes mixed with timezone-aware ones.**
18. **Not using `observed=True`** with categorical group keys.
19. **Relying on row order** after `merge` or `groupby` without sorting.
20. **Loading entire huge CSVs** instead of columns/chunks/Parquet.
21. **Unseeded randomness** and non-reproducible results.
22. **No data validation** between pipeline steps.

---

# 🏆 Part 17: Signals That Show You Are Really Experienced

- You think in **columns and arrays**, not rows, and know when vectorisation is impossible.
- You explain **views vs copies, broadcasting and strides**, and **Copy-on-Write**.
- You write **method-chained, testable pipelines** with explicit dtypes and schemas.
- You **validate joins** (cardinality, row counts) and understand alignment.
- You build **leak-free time-aware features** with `shift`, `closed`, and as-of joins.
- You **profile before optimising** and pick the right tool (pandas, Polars, DuckDB, Dask, Spark).
- You manage **memory** with dtypes, categoricals, Arrow and Parquet.
- You handle **missing data and time zones** deliberately.
- You ensure **reproducibility** (seeds, pinned versions, deterministic ordering).
- You show measured results: runtime, memory and cost improvements.

---

# 🧾 Part 18: Cheat Sheet & Last-Minute Revision

### NumPy quick list
```python
a.shape, a.dtype, a.reshape(-1, k), a[:, None], a.T, a.copy()
a.sum(axis=0), a.mean(axis=1), np.where(c, x, y), np.select(conds, vals, default)
a @ b, np.linalg.solve(A, b), np.einsum("ij,jk->ik", A, B)
rng = np.random.default_rng(42); rng.normal(size=(n, d))
```

### pandas quick list
```python
df.info(); df.describe(); df.isna().sum(); df.dtypes
df.loc[mask, "col"] = v; df.query("a > 1 and b == 'x'")
df.groupby("k").agg(total=("v", "sum")); df.groupby("k")["v"].transform("mean")
a.merge(b, on="k", how="left", validate="m:1"); pd.concat([a, b], ignore_index=True)
df.pivot_table(index=..., columns=..., values=..., aggfunc="sum"); df.melt(id_vars=...)
s.rolling(7).mean(); s.shift(1); df.set_index("t").resample("W").sum()
```

### Performance checklist
Select columns early • set dtypes • category for repeated strings • vectorise • avoid `apply(axis=1)` • one concat at the end • Parquet • chunk or switch engine when large • profile.

### Correctness checklist
Key uniqueness • `validate` on merges • row-count reconciliation • null rates • dtype checks • sorted time order • no leakage • seeds fixed • tests on small fixtures.

### Interview strategy
1. Clarify data size, types and the desired output.
2. Inspect with `info/describe/isna`.
3. Write clear, vectorised, chained code.
4. Check shapes, joins and edge cases (NaN, duplicates, empty groups).
5. Discuss performance and scale options.
6. Mention tests, reproducibility and data quality.

### Final checklist before the interview
- [ ] Explain ndarray memory, views vs copies, broadcasting and `axis`.
- [ ] Use `loc/iloc`, boolean masks, `query`, `assign`, `np.where/select`.
- [ ] Do `groupby` (agg/transform/filter), window features, ranks, lags.
- [ ] Merge safely (types, cardinality, validate), concat, pivot/melt.
- [ ] Clean missing data, dates, strings and categories.
- [ ] Handle time series: resample, rolling, shift, time zones, as-of joins.
- [ ] Optimise memory and speed; know Parquet, Arrow, Polars, DuckDB, Dask.
- [ ] Know Copy-on-Write and the common pandas 2.x → 3.0 changes.
- [ ] Avoid leakage in feature engineering; write tests and validations.
- [ ] Prepare a pipeline story, a performance story and a data-bug story with numbers.
