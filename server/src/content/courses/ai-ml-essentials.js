import { course, chapter, lesson, q } from '../authoring.js';

export default course({
  slug: 'ai-ml-essentials',
  title: 'AI & Machine Learning Essentials',
  category: 'AI/ML',
  level: 'Beginner → Intermediate',
  duration: '8 weeks',
  accent: 'fuchsia',
  coverKey: 'ai-ml-essentials',
  summary:
    'Learn to build, evaluate, and distrust machine learning models properly — from linear regression to gradient boosting, with scikit-learn in your hands the whole way.',
  description:
    'You train real models on real data: regression, classification, trees, ensembles, and clustering, wired together with scikit-learn pipelines. Then you learn the harder half — measuring a model honestly, catching data leakage, and knowing when the answer is "do not ship this".',
  chapters: [
    chapter(
      'What Machine Learning Actually Is',
      'The honest definition, the two families of problems, and the split that makes any of it trustworthy.',
      [
        lesson('Learning From Data, Not Rules', 12, `
Machine learning is one idea: instead of writing the rules, you write a program that **finds the rules from examples**. Everything else — every algorithm, every framework — is a way of doing that search efficiently.

### Rules versus learning

Suppose you want to flag spam. The traditional approach is explicit logic:

\`\`\`python
def is_spam(email):
    if "free money" in email.lower():
        return True
    if email.count("!") > 5:
        return True
    return False
\`\`\`

This works until a spammer writes "fr€€ mon3y". Then you add a rule. Then another. Within a year nobody can safely change the file.

The ML approach never states a rule. You collect 50,000 emails a human already labelled, hand them to an algorithm, and the algorithm fits a function that maps email → label:

\`\`\`python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline

model = make_pipeline(TfidfVectorizer(), LogisticRegression(max_iter=1000))
model.fit(emails_train, labels_train)          # learn from examples
model.predict(["Claim your free prize now"])   # array([1])
\`\`\`

You never told it that "free" matters. It measured that.

### The vocabulary, once

| Term | What it means |
|---|---|
| **Feature** | One input column. Word counts, price, age. Conventionally \`X\`. |
| **Label / target** | The thing you predict. Conventionally \`y\`. |
| **Sample** | One row — one email, one customer, one image. |
| **Model** | The fitted function, plus the parameters it learned. |
| **Training** | Adjusting parameters to reduce error on known examples. |
| **Inference** | Running the fitted model on data it has never seen. |

### What machine learning is *not*

**It is not a database query.** If the answer already exists in your data, look it up. "How many orders last month?" is SQL. "How many orders next month?" is ML. People routinely reach for a model where a \`GROUP BY\` would do — this is the single most common waste of an ML budget.

**It is not a rule engine.** If the rules are known, stable, and legally required — tax brackets, shipping thresholds — write them. A model that gets tax right 97% of the time is worse than useless.

**It is not causal.** A model that learns "customers who visit the pricing page churn less" has found a correlation. Forcing users onto the pricing page will not reduce churn. Prediction and intervention are different problems, and confusing them is how ML projects quietly fail after launch.

**It is not magic about the future.** A model can only learn patterns present in its training data. If nothing like your situation appeared during training, the output is a confident guess with no basis.

### When ML is the right call

Reach for it when all four hold:

1. The pattern exists but nobody can write it down (is this a cat? is this review angry?).
2. You have enough labelled examples — hundreds at absolute minimum, usually thousands.
3. Being wrong sometimes is acceptable and recoverable.
4. Tomorrow's data will look roughly like today's.

Break the fourth and your model decays silently. That is not a hypothetical: recommendation and fraud models degrade within weeks because the world — and in fraud, an adversary — moves. Chapter 5 covers what to do about it.
        `),
        lesson('Supervised, Unsupervised, and Which You Have', 12, `
Before choosing an algorithm, answer one question: **do you have labels?** That single fact splits machine learning into two families with different tools, different metrics, and different failure modes.

### Supervised learning: you have answers

Each training row carries the correct output. The algorithm's job is to reproduce it on rows it has not seen. Two sub-types:

**Regression** predicts a number on a continuous scale. House price, delivery time, tomorrow's demand. Error is measured in the units of the thing itself — "off by 12,000 rupees on average".

**Classification** predicts which category a row belongs to. Spam/not-spam (binary), digit 0–9 (multiclass), or a set of tags at once (multi-label). Error is measured in counts of right and wrong decisions.

\`\`\`python
# Same API, different task — this symmetry is why scikit-learn is pleasant
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier

RandomForestRegressor().fit(X, prices)     # y is continuous
RandomForestClassifier().fit(X, is_fraud)  # y is a category
\`\`\`

The line is not always obvious. "Predict the rating 1–5" can be either: regression treats 4 as closer to 5 than to 1 (usually right); classification treats all five as unrelated boxes. Choose based on whether the ordering carries meaning.

### Unsupervised learning: you have no answers

No target column. The algorithm looks for structure in \`X\` alone.

- **Clustering** — group similar rows. Customer segments, document topics. Chapter 5 builds this.
- **Dimensionality reduction** — compress many correlated features into a few. PCA for compression, t-SNE/UMAP for plotting.
- **Anomaly detection** — learn what normal looks like, flag what is not. Fraud, equipment failure, intrusion.
- **Association rules** — what gets bought together.

### The critical difference nobody warns you about

Supervised learning can be graded. You held out rows with known answers, so you can say "82% correct" and mean it.

**Unsupervised learning cannot be graded this way.** There is no ground truth to compare against. k-means will happily return five clusters from pure random noise, and they will look convincing on a scatter plot. You get internal quality scores like silhouette, and you get a domain expert saying "yes, that segment is real" — that is all. Presenting cluster output with the confidence of a validated classifier is the classic mistake in unsupervised work.

### The others, briefly

**Semi-supervised** — a few thousand labelled rows and a million unlabelled ones. Common in practice, since labelling is the expensive part.

**Self-supervised** — invent labels from the data itself (hide a word, predict it). This is how large language models are trained; the "unlabelled" internet becomes billions of supervised examples.

**Reinforcement learning** — an agent takes actions in an environment and learns from a reward signal. Games, robotics, control. Powerful and hard; it needs an environment you can simulate cheaply, which most business problems do not have.

### Matching a real question to a task

| Business question | Task | Target |
|---|---|---|
| Will this customer cancel next month? | Binary classification | \`churned\` (0/1) |
| How many units will we sell in March? | Regression | \`units\` |
| Which of our users behave alike? | Clustering | none |
| Is this transaction unusual? | Anomaly detection | none (or very few labels) |
| Which support tag applies? | Multiclass classification | \`tag\` |

Note the middle rows. When you have no label, the honest move is often to *create* one — decide what "churn" means, define the window, and label history. A month spent defining a good target beats six months of model tuning against a vague one.
        `),
        lesson('Train, Validation, Test — the Split That Makes It Real', 13, `
A model's score on the data it was trained on is meaningless. A model with enough capacity can memorise the training set entirely and score 100%, then be useless in production. The only number worth quoting comes from data the model has never touched.

### Three sets, three jobs

| Set | Typical share | Used for | Touched how often |
|---|---|---|---|
| **Train** | 60–80% | Fitting parameters | Constantly |
| **Validation** | 10–20% | Choosing hyperparameters, comparing models | Many times |
| **Test** | 10–20% | The final honest estimate | **Once** |

The validation set exists because *choosing* is also a form of fitting. Try 40 model configurations against one held-out set and pick the best, and that best score is optimistic — you have partially fitted the validation set through selection. The test set is the untouched reserve that catches this.

\`\`\`python
from sklearn.model_selection import train_test_split

# First carve off the test set and put it away
X_temp, X_test, y_temp, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Then split the remainder into train and validation
X_train, X_val, y_train, y_val = train_test_split(
    X_temp, y_temp, test_size=0.25, random_state=42, stratify=y_temp
)
# 0.25 of the remaining 80% = 20% of the original
\`\`\`

Two arguments there matter:

- \`random_state=42\` makes the split reproducible. Without it, every run gives different numbers and you cannot tell a real improvement from shuffling luck.
- \`stratify=y\` preserves the class balance in every split. With 3% positives and no stratification, a small test set can end up with almost none — and your recall figure becomes noise.

### The mistake everyone makes once

\`\`\`python
# WRONG — the scaler has now seen the test set
scaler = StandardScaler().fit(X)
X_scaled = scaler.transform(X)
X_train, X_test = train_test_split(X_scaled, ...)
\`\`\`

The scaler computed a mean and standard deviation using test rows. Information from the test set has leaked into training, and your reported score is inflated. The same applies to imputing missing values, selecting features by correlation with \`y\`, or fitting an encoder — anything that *learns* from data.

\`\`\`python
# RIGHT — split first, fit only on train
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=42)
scaler = StandardScaler().fit(X_train)   # fit on train alone
X_train_s = scaler.transform(X_train)
X_test_s = scaler.transform(X_test)      # transform only
\`\`\`

**\`fit_transform\` on train, \`transform\` on everything else.** Chapter 5 shows how \`Pipeline\` makes this structurally impossible to get wrong.

### Random splitting is wrong for time series

If rows have a time order and you will predict the future, a random split trains on Thursday to predict Wednesday. The score will be excellent and the model will fail in production. Split by date instead:

\`\`\`python
train = df[df.date <  '2025-01-01']
test  = df[df.date >= '2025-01-01']
\`\`\`

Grouped data has the same trap. If one patient contributes 40 rows, random splitting puts some of that patient in train and some in test — the model recognises the patient, not the disease. Use \`GroupShuffleSplit\` and split on the group id.

### Rules for the test set

Look at it once, at the very end, and report what you see. If the number disappoints and you go back to tune, that test set is now burned — it has become a validation set. Either accept the number or split a fresh holdout. The temptation to peek is exactly why published models so often underperform their headline figures.
        `),
      ],
      [
        q('Which problem is a poor fit for machine learning?', [
          'Predicting which customers will churn next month',
          'Computing sales tax owed on an invoice',
          'Detecting whether a photo contains a cat',
          'Estimating delivery time from route features',
        ], 1, 'Tax rules are known, stable, and must be exact — a model that is right 97% of the time is worse than the rule.'),
        q('You have 200,000 customer records and no target column, and want to find natural groupings. What kind of task is this?', [
          'Supervised regression',
          'Supervised classification',
          'Unsupervised clustering',
          'Reinforcement learning',
        ], 2, 'No labels plus a goal of finding structure in X alone is clustering, which is unsupervised.'),
        q('Why is a separate test set needed when you already have a validation set?', [
          'To double the amount of evaluation data',
          'Because repeatedly selecting models on the validation set fits it too, making its score optimistic',
          'Because validation sets cannot be stratified',
          'To speed up training',
        ], 1, 'Choosing among many candidates on one held-out set leaks information through selection; the untouched test set gives an unbiased estimate.'),
        q('Which sequence avoids leakage when scaling features?', [
          'Fit the scaler on all data, then split',
          'Split, fit the scaler on train, transform train and test',
          'Split, fit a separate scaler on train and on test',
          'Scale after training the model',
        ], 1, 'The scaler must learn its statistics from training data only; test data is transformed with those same statistics.'),
      ]
    ),
    chapter(
      'Linear Models: Regression and Classification',
      'The two workhorses you should always try first, and the overfitting problem they teach you to see.',
      [
        lesson('Linear Regression From the Ground Up', 13, `
Linear regression predicts a number as a weighted sum of the inputs:

\`\`\`
ŷ = w₁x₁ + w₂x₂ + ... + wₙxₙ + b
\`\`\`

The \`w\` values are **coefficients** (how much each feature moves the prediction) and \`b\` is the **intercept** (the prediction when every feature is zero). Training means choosing the numbers that minimise **mean squared error**, the average of the squared gaps between prediction and truth.

Squaring is a design decision with consequences: a prediction off by 10 costs 100, one off by 100 costs 10,000. Squared error is therefore dominated by outliers. That is sometimes what you want and often not.

### Fit one in five lines

\`\`\`python
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression().fit(X_train, y_train)
pred = model.predict(X_test)

print("MAE ", mean_absolute_error(y_test, pred))
print("RMSE", root_mean_squared_error(y_test, pred))
print("R2  ", r2_score(y_test, pred))
print(dict(zip(feature_names, model.coef_.round(2))))
\`\`\`

### Reading the three metrics

| Metric | Units | Reads as |
|---|---|---|
| **MAE** | same as \`y\` | Average absolute error. Robust to outliers. |
| **RMSE** | same as \`y\` | Punishes large errors harder. Always ≥ MAE. |
| **R²** | unitless | Share of variance explained. 1.0 perfect, 0.0 no better than predicting the mean, negative = worse than the mean. |

Quote MAE to stakeholders — "we are off by about 12 minutes" is a sentence people can act on. R² alone tells them nothing about whether the model is good enough for the decision at hand.

A negative R² on test data is not a bug; it means your model is genuinely worse than always guessing the average, which usually points at severe overfitting or a broken feature.

### Interpreting coefficients — carefully

A coefficient of \`3.4\` on \`bedrooms\` means: holding every other feature constant, one more bedroom adds 3.4 to the prediction. Two warnings.

**Magnitudes are not comparable across features unless the features are scaled.** A coefficient on \`square_feet\` (values in the thousands) and one on \`bathrooms\` (values 1–4) live on different scales. Standardise first if you want to rank importance:

\`\`\`python
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

model = make_pipeline(StandardScaler(), LinearRegression()).fit(X_train, y_train)
# Now coefficients are per standard deviation and comparable to each other
\`\`\`

**Correlated features scramble coefficients.** With \`square_feet\` and \`square_metres\` both present, the fit can put +900 on one and −800 on the other. Predictions stay fine; the individual numbers become nonsense. This is multicollinearity, and it is why "the model says bedrooms have a negative effect" is so often an artefact rather than an insight.

### When linear is not enough

Linear regression assumes the relationship is a straight line and that errors are roughly even across the range. Check by plotting residuals (\`y_test - pred\`) against predictions. A shapeless cloud is healthy; a curve means you need non-linearity; a widening funnel means error grows with magnitude, and a log transform of the target often fixes it.

\`\`\`python
from sklearn.preprocessing import PolynomialFeatures

model = make_pipeline(
    PolynomialFeatures(degree=2, include_bias=False),
    StandardScaler(),
    LinearRegression(),
).fit(X_train, y_train)
\`\`\`

Degree 2 adds squares and pairwise products, letting a "linear" model fit curves and interactions. Push the degree higher and it will fit the training noise perfectly — which is the whole subject of lesson three.
        `),
        lesson('Logistic Regression and the Threshold You Choose', 13, `
Despite the name, logistic regression is a **classifier**. It computes the same weighted sum as linear regression, then squashes the result into 0–1 with the sigmoid function:

\`\`\`
z = w·x + b
p = 1 / (1 + e^(−z))     # always between 0 and 1
\`\`\`

That \`p\` is an estimated probability of the positive class. Training minimises **log loss**, which punishes confident wrong answers far more than hesitant ones — predicting 0.99 for a negative row is expensive, predicting 0.55 is cheap.

### Fitting and, more importantly, predicting

\`\`\`python
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

clf = make_pipeline(
    StandardScaler(),
    LogisticRegression(max_iter=1000, class_weight="balanced"),
).fit(X_train, y_train)

labels = clf.predict(X_test)                  # hard 0/1 at threshold 0.5
probs  = clf.predict_proba(X_test)[:, 1]      # probability of class 1
\`\`\`

\`predict_proba\` returns one column per class; \`[:, 1]\` takes the positive class. **Use probabilities, not labels, wherever you can.** A ranked list of the 200 riskiest transactions is far more useful to a fraud team than an unordered pile of rows the model called "fraud".

### 0.5 is a default, not a law

\`predict\` labels anything above 0.5 as positive. Nothing about your problem says 0.5 is correct — it is simply the midpoint. The right cut depends on what each error costs:

\`\`\`python
import numpy as np

# Disease screening: missing a case is far worse than a false alarm
labels = (probs >= 0.20).astype(int)   # catch more, tolerate false positives

# Auto-blocking accounts: a false block is expensive and visible
labels = (probs >= 0.85).astype(int)   # act only when very sure
\`\`\`

Leaving the threshold at 0.5 on an imbalanced problem is one of the most common reasons a technically fine model is useless in practice. Chapter 4 shows how to pick the number from data rather than by feel.

### Reading the coefficients

Coefficients are in **log-odds**. Exponentiate to get an odds ratio, which people can actually reason about:

\`\`\`python
import numpy as np
lr = clf.named_steps["logisticregression"]
odds = np.exp(lr.coef_[0])
# odds = 1.8 for a feature → each +1 standard deviation multiplies the odds by 1.8
# odds = 0.6 → the odds drop by 40%
\`\`\`

This interpretability is why logistic regression survives in medicine, credit, and anywhere a decision must be explained to a regulator. A gradient-boosted model may beat it by two points of AUC and still lose the argument.

### Three details that bite

**Scale your features.** \`LogisticRegression\` applies L2 regularisation by default. Regularisation penalises large coefficients, so a feature measured in thousands gets penalised differently from one measured in units — the penalty becomes arbitrary. \`StandardScaler\` first, always.

**\`max_iter\` and convergence warnings.** The default 100 iterations often is not enough. A \`ConvergenceWarning\` means the optimiser stopped early and your coefficients are not the fitted ones. Raise \`max_iter\`, and check your scaling — unscaled features are usually the real cause.

**Class imbalance.** With 2% positives, the loss is minimised by predicting "negative" almost always. \`class_weight="balanced"\` reweights each class inversely to its frequency, so a positive row counts ~50× as much. It changes what the model optimises for; measure the effect rather than assuming it helps.

### Multiclass

Pass a \`y\` with more than two values and scikit-learn handles it — multinomial by default, giving a probability per class that sums to 1. \`predict_proba\` returns one column per class in \`clf.classes_\` order. Check that ordering before indexing; assuming alphabetical is a quiet, recurring bug.
        `),
        lesson('Overfitting, Bias–Variance, and Regularisation', 14, `
A model that scores 0.99 on training data and 0.62 on test data has not learned your problem. It has memorised your training set — including its noise. This is **overfitting**, and recognising it is the skill that separates people who ship models from people who publish notebooks.

### The diagnosis table

Always print both scores. The gap tells you what to do next:

| Train | Test | Diagnosis | Fix |
|---|---|---|---|
| 0.95 | 0.94 | Healthy | Ship it, or add capacity for more |
| 0.99 | 0.62 | **Overfitting** (high variance) | Regularise, simplify, more data |
| 0.61 | 0.60 | **Underfitting** (high bias) | More features, more capacity, less regularisation |
| 0.62 | 0.88 | Something is wrong | Broken split, leakage, or a test set that is too easy |

That last row is not a happy accident. Test beating train by a wide margin means your split is broken or duplicate rows landed on both sides. Investigate it; never celebrate it.

### Bias and variance

**Bias** is error from wrong assumptions — a straight line fitted to a curve. It shows up as bad scores everywhere, train included.

**Variance** is sensitivity to the particular training sample — resample the data and the model changes completely. It shows up as a big train/test gap.

More capacity (deeper trees, higher polynomial degree, more features) lowers bias and raises variance. There is a sweet spot, and you find it by measurement, not intuition.

### Regularisation: penalise complexity

Add a penalty on coefficient size to the loss. The model must now justify every large coefficient with a real reduction in error.

**Ridge (L2)** penalises the sum of squared coefficients. It shrinks everything toward zero without eliminating anything, and handles correlated features gracefully by splitting the weight between them.

**Lasso (L1)** penalises the sum of absolute values. It drives some coefficients to exactly zero, so it performs feature selection for you.

**ElasticNet** mixes both.

\`\`\`python
from sklearn.linear_model import RidgeCV, LassoCV
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
import numpy as np

alphas = np.logspace(-3, 3, 25)

ridge = make_pipeline(StandardScaler(), RidgeCV(alphas=alphas)).fit(X_train, y_train)
lasso = make_pipeline(StandardScaler(), LassoCV(alphas=alphas, max_iter=5000)).fit(X_train, y_train)

kept = (lasso.named_steps["lassocv"].coef_ != 0).sum()
print(f"Lasso kept {kept} of {X_train.shape[1]} features")
\`\`\`

\`alpha\` controls the strength. \`alpha=0\` is plain linear regression; large \`alpha\` shrinks everything toward zero and underfits. The \`CV\` variants pick it by cross-validation instead of you guessing.

### The classic mistake

**Regularisation without scaling is meaningless.** The penalty applies equally to every coefficient, but a feature measured in metres and the same feature in millimetres need coefficients 1000× apart to say the same thing — so the penalty punishes them completely differently. Any regularised model (\`Ridge\`, \`Lasso\`, \`LogisticRegression\`, SVMs) needs \`StandardScaler\` in front of it. Tree models do not, because splits are order-based and immune to units.

### Learning curves tell you what to buy

\`\`\`python
from sklearn.model_selection import learning_curve
import numpy as np

sizes, train_s, val_s = learning_curve(
    model, X, y, cv=5, train_sizes=np.linspace(0.1, 1.0, 8), scoring="r2"
)
\`\`\`

Plot the two mean curves against training size:

- **Curves converge at a low score** → underfitting. More data will not help. Get better features or a stronger model.
- **A wide gap, validation still rising** → more data *will* help.
- **A wide gap, validation flat** → regularise or simplify.

This one plot answers "should we spend three months collecting more data?" before you spend it — which makes it the highest-value chart in applied ML.
        `),
      ],
      [
        q('Test R² comes back as −0.4. What does that mean?', [
          'The code has a sign error',
          'The model performs worse than simply predicting the mean of y',
          'The model explains 40% of the variance',
          'R² cannot be negative, so the data is corrupted',
        ], 1, 'R² is 0 for a mean-predictor and negative when the model does worse than that baseline on unseen data.'),
        q('Why must features be standardised before Ridge or Lasso?', [
          'Otherwise the model cannot converge at all',
          'The penalty is applied equally to all coefficients, so differing feature scales make it arbitrary',
          'Scaling makes the model train faster',
          'Because R² requires standardised inputs',
        ], 1, 'Coefficient size depends on feature units, so an unscaled penalty punishes features for their measurement scale rather than their importance.'),
        q('A fraud model outputs probabilities. Why is the default 0.5 threshold often wrong?', [
          'Probabilities from logistic regression are never accurate',
          'The costs of a false positive and a false negative are rarely equal, and the threshold encodes that trade-off',
          'scikit-learn uses 0.5 only for regression',
          'Thresholds must always be below the class prevalence',
        ], 1, '0.5 is just the midpoint; the right cut-off depends on what each type of error actually costs you.'),
        q('Train score 0.98, test score 0.61. Which change is most likely to help?', [
          'Add more polynomial features',
          'Increase model depth or capacity',
          'Increase regularisation strength or simplify the model',
          'Remove the validation set',
        ], 2, 'A large train/test gap is high variance — the fix is to constrain the model, not give it more freedom.'),
      ]
    ),
    chapter(
      'Trees, Forests, and Boosting',
      'The models that win on tabular data, and why combining weak learners beats tuning one strong one.',
      [
        lesson('Decision Trees: Learning a Flowchart', 12, `
A decision tree is a flowchart the algorithm writes for you. Each internal node asks one yes/no question about one feature; each leaf holds a prediction.

\`\`\`
                 income <= 45000?
                 /              \\
               yes               no
          tenure <= 2?      predict: stays
           /        \\
         yes         no
    predict:      predict:
    churns        stays
\`\`\`

### How the split is chosen

At every node the algorithm tries every feature and every threshold, and keeps the split that most reduces **impurity** — how mixed the classes are in the resulting groups.

**Gini impurity** for a node with class proportions p: \`1 − Σp²\`. A node that is 100% one class scores 0 (pure); a 50/50 node scores 0.5 (worst for binary). **Entropy** measures the same idea in bits. They almost always pick the same splits; the default \`gini\` is cheaper to compute. For regression trees the criterion is variance instead.

The search is **greedy** — it takes the best split now, never backtracking to check whether a worse first split enables two great ones later. This is why a single tree is unstable: change a few rows and a different feature wins at the root, and the entire structure below changes.

### Building and reading one

\`\`\`python
from sklearn.tree import DecisionTreeClassifier, export_text

tree = DecisionTreeClassifier(
    max_depth=4,           # hard ceiling on questions asked
    min_samples_leaf=25,   # no leaf may be built from fewer than 25 rows
    random_state=42,
).fit(X_train, y_train)

print(f"train {tree.score(X_train, y_train):.3f}  test {tree.score(X_test, y_test):.3f}")
print(export_text(tree, feature_names=list(X_train.columns)))
\`\`\`

\`export_text\` prints the actual rules. This is the tree's superpower: you can hand the output to a domain expert and they will tell you immediately whether the logic is sane or whether it has latched onto something absurd.

### An unpruned tree memorises

Leave \`max_depth\` at its default of \`None\` and the tree grows until every leaf is pure — often one training row per leaf. Training accuracy: 1.00. Test accuracy: mediocre. The tree has stored your training set.

The controls that prevent it:

| Parameter | Effect | Sensible start |
|---|---|---|
| \`max_depth\` | Maximum questions from root to leaf | 3–8 |
| \`min_samples_leaf\` | Minimum rows in any leaf | 20–50 |
| \`min_samples_split\` | Minimum rows required to split a node | 2× leaf |
| \`ccp_alpha\` | Cost-complexity pruning after growth | tune from 0 |

\`min_samples_leaf\` is the most reliable of these. It directly stops the model from drawing a conclusion from three rows.

### What trees give you free

- **No scaling required.** Splits depend on order, not units, so metres and millimetres behave identically.
- **Non-linearity and interactions** come naturally — nested splits *are* interactions.
- **Mixed feature types** and monotone transforms of features change nothing.
- **Robust to outliers**, because an extreme value just falls on one side of a threshold.

### The trap in \`feature_importances_\`

\`\`\`python
import pandas as pd
pd.Series(tree.feature_importances_, index=X_train.columns).sort_values(ascending=False).head(10)
\`\`\`

This measures how much each feature reduced impurity in *this* tree. Three warnings, and this is the most misread output in applied ML:

1. **It is biased toward high-cardinality features.** A customer ID or a continuous variable offers thousands of possible split points, so it wins by sheer opportunity. If an ID column tops your importance list, it is leakage, not signal.
2. **Correlated features split the credit.** Two near-duplicate features each get half, and both look unimportant.
3. **It is not causal.** High importance means "useful for splitting", not "changing this changes the outcome".

When importance actually matters, use \`permutation_importance\` on held-out data, which measures how much the *test* score drops when a column is shuffled. It is slower and far more honest.

A single tuned tree is rarely the best model. Its value is that it is legible — and that hundreds of them together, as the next two lessons show, are formidable.
        `),
        lesson('Random Forests and the Power of Bagging', 13, `
One decision tree is unstable: it has low bias and high variance. **Bagging** exploits that. Train many trees on different random samples of the data and average their predictions — the individual errors are partly independent, so averaging cancels them out while the shared signal survives.

### Two sources of randomness

A random forest injects randomness twice, and the second one is what makes it work:

1. **Bootstrap sampling** — each tree trains on \`n\` rows drawn *with replacement* from \`n\` rows. Roughly 63% of the data appears in any given sample; the rest is that tree's "out-of-bag" data.
2. **Random feature subsets** — at every split, each tree may only consider a random subset of features (\`max_features\`, default \`sqrt(n_features)\` for classification).

Without step 2, if one feature is strongly predictive every tree splits on it first and all the trees look alike — and averaging near-identical models gains you nothing. Restricting the feature choice forces the trees to disagree, and **decorrelated errors are the entire mechanism**.

\`\`\`python
from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(
    n_estimators=500,
    max_features="sqrt",
    min_samples_leaf=2,
    oob_score=True,       # free validation from the out-of-bag rows
    n_jobs=-1,            # use every core; trees are independent
    random_state=42,
).fit(X_train, y_train)

print(f"OOB   {rf.oob_score_:.3f}")
print(f"test  {rf.score(X_test, y_test):.3f}")
\`\`\`

### Out-of-bag scoring

Each tree never saw ~37% of the rows. Predict each row using only the trees that excluded it and you get a validation estimate without holding anything out. \`oob_score_\` is usually within a point of a proper cross-validated score and costs nothing extra — genuinely useful when data is scarce.

### What to tune, and what not to

| Parameter | Guidance |
|---|---|
| \`n_estimators\` | More is never worse for accuracy, only slower. Use 300–1000 and stop thinking about it. |
| \`max_features\` | The real knob. Lower → more diverse, more regularised. Try \`sqrt\`, \`log2\`, 0.3, 0.5. |
| \`min_samples_leaf\` | 1 for classification, 3–10 for regression or noisy data. |
| \`max_depth\` | Usually leave unlimited; the ensemble handles it. |

The common misunderstanding: treating \`n_estimators\` as a regularisation parameter and lowering it to "prevent overfitting". It does not work that way. Adding trees to a bagged ensemble drives the variance down toward a floor and holds there — the curve flattens, it does not turn back up. Diversity, via \`max_features\` and leaf size, is where regularisation lives.

### Where forests shine and where they do not

**Strong:** medium tabular data, mixed types, minimal preprocessing, sane defaults, near-impossible to catastrophically overfit, parallelises perfectly.

**Weak:** cannot extrapolate beyond the range of the training target — a forest trained on houses up to 500k will never predict 800k, because every leaf is an average of training rows. Linear models extrapolate; trees do not. Also large in memory, slower at inference than a single model, and no longer legible: 500 trees is not a flowchart you can read.

### Extremely Randomised Trees

\`ExtraTreesClassifier\` goes further and picks split thresholds at random rather than searching for the best. More bias, less variance, and noticeably faster to train. On noisy data it often edges out a random forest, and it costs one word to try.

The next lesson covers the other way to combine trees — and on most tabular benchmarks, it wins.
        `),
        lesson('Gradient Boosting: Learning From Your Own Mistakes', 14, `
Bagging trains many trees in parallel and averages them. **Boosting** trains them in sequence, each one fitted to the errors the ensemble has made so far.

### The mechanism

1. Start with a constant prediction — the mean of \`y\`.
2. Compute the residuals (how wrong you are on each row).
3. Fit a small tree to predict those residuals.
4. Add a *fraction* of that tree's output to the running prediction.
5. Repeat, hundreds of times.

Each tree is deliberately weak — typically depth 3 to 6. Alone it is barely better than guessing. Chained, with each one correcting the last, they compose into the most accurate class of model on tabular data by a clear margin.

### The learning rate is the point

Step 4's "fraction" is the **learning rate** (also called shrinkage), typically 0.01–0.1. Adding only 5% of each tree's correction means no single tree can dominate, and errors get approached cautiously from many angles.

Learning rate and tree count trade off directly: halve the learning rate and you need roughly twice the trees. **Low rate plus many trees, stopped early, beats high rate plus few trees** almost every time — the extra compute buys real accuracy.

\`\`\`python
from sklearn.ensemble import HistGradientBoostingClassifier

gb = HistGradientBoostingClassifier(
    learning_rate=0.05,
    max_iter=1000,            # an upper bound, not a target
    max_leaf_nodes=31,
    early_stopping=True,      # stop when validation stops improving
    validation_fraction=0.15,
    n_iter_no_change=30,      # patience
    random_state=42,
).fit(X_train, y_train)

print(f"stopped at {gb.n_iter_} of 1000 iterations")
print(f"train {gb.score(X_train, y_train):.3f}  test {gb.score(X_test, y_test):.3f}")
\`\`\`

\`HistGradientBoosting\` bins continuous features into 256 buckets before searching for splits, which makes it dramatically faster on large data — the same trick LightGBM uses. It also handles \`NaN\` natively, learning which side of each split missing values belong on, so you can skip imputation entirely.

### Early stopping is not optional

This is the crucial difference from a random forest. **Boosting will overfit if you let it run.** Every added tree fits the current residuals harder, and eventually it is fitting noise. Validation error falls, bottoms out, then climbs. Set \`max_iter\` high, enable early stopping, and let the data choose the tree count. Fixing \`n_estimators=1000\` with no early stopping is the classic boosting mistake.

### Forest or boosting?

| | Random Forest | Gradient Boosting |
|---|---|---|
| Trees built | In parallel, independently | Sequentially, on residuals |
| Typical depth | Deep / unlimited | Shallow (3–6) |
| Overfits with more trees | No — it plateaus | **Yes** — needs early stopping |
| Tuning sensitivity | Forgiving | Rewards careful tuning |
| Usual accuracy on tabular data | Very good | Best in class |
| Good first move | Baseline in one line | The model you ship |

Practical workflow: fit a random forest first for a trustworthy baseline in thirty seconds, then spend your tuning budget on boosting.

### The libraries

\`HistGradientBoosting*\` ships with scikit-learn and is excellent. **XGBoost**, **LightGBM**, and **CatBoost** are the specialist alternatives — LightGBM for speed on wide data, CatBoost for datasets full of high-cardinality categorical columns, which it encodes internally without leaking. All three expose a scikit-learn-compatible API, so swapping one in is a one-line change.

### Reality check

Boosted trees dominate tabular problems and are largely irrelevant for images, audio, and text, where deep learning wins outright. If your data is rows and columns, start here. If it is pixels or tokens, this is not the tool — and knowing which room you are in saves months.
        `),
      ],
      [
        q('Why does a random forest restrict each split to a random subset of features?', [
          'To make training faster on wide data',
          'To force the trees to differ, since averaging near-identical trees reduces nothing',
          'Because using all features causes a numerical error',
          'To ensure every feature appears in the final model',
        ], 1, 'Variance reduction from averaging requires the errors to be at least partly independent, and decorrelation is what feature subsampling buys.'),
        q('An ID-like column tops your tree\'s feature_importances_. What is the most likely explanation?', [
          'The ID genuinely predicts the outcome',
          'Impurity importance favours high-cardinality features, and the column is leaking or spurious',
          'The tree was not deep enough',
          'Importances always sum to 1, so it is an artefact of normalisation',
        ], 1, 'Continuous or high-cardinality columns offer many split points and win by opportunity — treat an ID at the top as a leakage alarm.'),
        q('Which model overfits if you keep adding trees without early stopping?', [
          'Random forest',
          'Extra trees',
          'Gradient boosting',
          'None — more trees always help in any ensemble',
        ], 2, 'Boosting fits each new tree to the current residuals, so past the optimum it starts modelling noise; bagged ensembles plateau instead.'),
        q('A random forest is trained on house prices from 100k to 500k. What will it predict for a mansion far larger than anything in training?', [
          'A value above 500k, extrapolating the trend',
          'A value at or below roughly 500k, since every leaf is an average of training rows',
          'An error, because the input is out of range',
          'Exactly the training mean',
        ], 1, 'Tree predictions are averages of training targets in a leaf, so they cannot extrapolate beyond the observed target range.'),
      ]
    ),
    chapter(
      'Measuring a Model Honestly',
      'Why accuracy lies, which metric matches your decision, and how to tune without fooling yourself.',
      [
        lesson('The Confusion Matrix, Precision, Recall, and F1', 13, `
Here is the number that should end your trust in accuracy. A hospital screens for a disease affecting 1 in 1000 patients. This model:

\`\`\`python
def model(patient):
    return "healthy"     # always
\`\`\`

...is **99.9% accurate** and detects zero cases. Accuracy is the fraction of predictions that are correct, and when one class dominates, the majority answer wins on accuracy while being useless. Any time your positive class is under about 20% of the data, accuracy is actively misleading.

### The confusion matrix has all the information

Every other classification metric is a ratio computed from these four cells:

|  | Predicted negative | Predicted positive |
|---|---|---|
| **Actually negative** | TN — correct rejection | **FP** — false alarm |
| **Actually positive** | **FN** — miss | TP — correct hit |

\`\`\`python
from sklearn.metrics import confusion_matrix, classification_report

tn, fp, fn, tp = confusion_matrix(y_test, pred).ravel()
print(classification_report(y_test, pred, digits=3))
\`\`\`

Read the matrix before any metric. It tells you *which kind* of mistake the model makes, which is the part a stakeholder can act on.

### The three ratios

**Precision = TP / (TP + FP)** — of everything flagged positive, how much really was. Answers: *can I trust an alert?*

**Recall = TP / (TP + FN)** — of everything actually positive, how much was caught. Answers: *how much am I missing?*

**F1 = 2·(P·R)/(P+R)** — the harmonic mean. It stays low unless *both* are decent, which is why a single 0.9 cannot hide a 0.1.

### They trade against each other

Lower the decision threshold and you flag more rows: recall rises, precision falls. Raise it and the reverse happens. You cannot maximise both; you choose which error you can afford.

| Situation | Optimise | Because |
|---|---|---|
| Cancer screening | **Recall** | A missed tumour is fatal; a false alarm costs a follow-up test |
| Spam filter | **Precision** | A lost job offer in the spam folder is worse than a spam email in the inbox |
| Fraud review queue | **Precision@k** | Analysts can review 200 cases a day, so the top 200 must be good |
| Legal document discovery | **Recall** | Missing a relevant document is a sanctionable failure |

"What is our precision and recall?" is the right question. "What is our accuracy?" usually is not.

### Worked example

10,000 transactions, 100 fraudulent. The model flags 150, of which 80 are truly fraud.

- Precision = 80/150 = **0.53** — half of what analysts review is a waste of their time.
- Recall = 80/100 = **0.80** — 20 frauds got through.
- Accuracy = (9830 TN + 80 TP)/10000 = **0.991** — impressive-sounding and completely uninformative.

Those first two numbers start a real conversation with the fraud team. The third ends it prematurely.

### Multiclass averaging

\`classification_report\` prints per-class figures plus averages, and the choice of average changes the story:

- **macro** — unweighted mean over classes. Every class counts equally, so a rare class you handle badly drags it down. Usually what you want when rare classes matter.
- **weighted** — weighted by class frequency. Dominated by big classes and can hide total failure on rare ones.
- **micro** — pools all decisions; in single-label multiclass it equals accuracy.

Reporting weighted F1 on an imbalanced problem is accuracy's mistake wearing a better name. Report macro, and report the per-class rows underneath it.
        `),
        lesson('ROC-AUC, PR Curves, and Choosing the Threshold', 14, `
Precision and recall describe one threshold. Change the threshold and both change. Threshold-free metrics summarise the model across *all* of them, which is what you want when comparing models before deciding how to act.

### ROC-AUC

The ROC curve plots true positive rate (recall) against false positive rate as the threshold sweeps from 1 to 0. The area under it has an exact and useful interpretation:

> **AUC is the probability that a randomly chosen positive scores higher than a randomly chosen negative.**

So 0.5 is coin-flipping, 0.8 is decent, 0.95 is strong — and 1.0 on a real business problem almost always means leakage, not brilliance (Chapter 5).

\`\`\`python
from sklearn.metrics import roc_auc_score, average_precision_score

probs = clf.predict_proba(X_test)[:, 1]
print("ROC-AUC", roc_auc_score(y_test, probs))
print("PR-AUC ", average_precision_score(y_test, probs))
\`\`\`

Pass **probabilities**, not labels. \`roc_auc_score(y_test, clf.predict(X_test))\` is a real and common bug: it collapses the curve to a single point and reports a meaningless, deflated number.

### Where ROC-AUC misleads

False positive rate is FP / (FP + TN). With 99% negatives, TN is enormous, so even thousands of false alarms barely move the denominator. The curve stays high while the alert queue is useless.

Concretely: 10,000 rows, 100 positives. The model flags 100 true positives and 900 false positives. FPR = 900/9900 = 0.09 — the ROC looks excellent. Precision = 100/1000 = 0.10 — nine out of ten alerts are junk.

**On imbalanced data, report the precision–recall curve instead.** Its area (\`average_precision_score\`) uses precision, whose denominator is the flagged set, so false positives hurt properly. Its baseline is the positive rate itself: with 1% positives, a random model scores 0.01 PR-AUC, so 0.35 is genuinely good. ROC-AUC's baseline is always 0.5 regardless of imbalance, which is exactly what makes it flattering here.

### Choosing a threshold from data

\`\`\`python
import numpy as np
from sklearn.metrics import precision_recall_curve

precision, recall, thresholds = precision_recall_curve(y_val, val_probs)

# Option A: the best F1
f1 = 2 * precision * recall / (precision + recall + 1e-12)
best_f1_threshold = thresholds[np.argmax(f1[:-1])]

# Option B: the cheapest, using real costs
#   a missed fraud costs 500, a wasted review costs 8
costs = [((val_probs < t) & (y_val == 1)).sum() * 500
         + ((val_probs >= t) & (y_val == 0)).sum() * 8
         for t in thresholds]
best_cost_threshold = thresholds[int(np.argmin(costs))]
\`\`\`

Option B is the one that earns its keep. Once you can state the cost of each error type, the optimal threshold is arithmetic rather than opinion.

**Pick the threshold on validation data, then apply it to test.** Choosing it on the test set and reporting the resulting score is the same optimism the three-way split from Chapter 1 exists to prevent.

### Calibration

A model can rank perfectly (AUC 0.95) and still have badly wrong probabilities — saying 0.9 for groups that turn out positive 60% of the time. If the number feeds a downstream calculation (expected loss, pricing, prioritisation), ranking is not enough:

\`\`\`python
from sklearn.calibration import CalibratedClassifierCV
calibrated = CalibratedClassifierCV(base_model, method="isotonic", cv=5).fit(X_train, y_train)
\`\`\`

Logistic regression is naturally well calibrated. Boosted trees and SVMs typically are not.

### Handling imbalance itself

In rough order of what to try:

1. **Nothing.** Use a threshold-free metric and tune the threshold. Often sufficient.
2. **\`class_weight="balanced"\`** — reweight the loss. One argument, no data duplicated.
3. **Resampling / SMOTE** — synthesise minority rows. It must happen **inside** the cross-validation fold, never before the split. Oversampling first duplicates rows across train and test, and the resulting score is fiction.

Never resample the test set. It must retain the real class balance, because that is the world the model will live in.
        `),
        lesson('Cross-Validation and Hyperparameter Search', 14, `
A single train/test split gives one number, and that number has real variance. Swap \`random_state=42\` for \`random_state=7\` and your accuracy can shift by two or three points on a small dataset. Cross-validation replaces that single draw with an average.

### k-fold, and why 5 is the default

Split the data into k folds. Train on k−1, evaluate on the held-out one, rotate, average. Every row gets used for both training and evaluation, and you get a spread as well as a mean.

\`\`\`python
from sklearn.model_selection import cross_val_score, StratifiedKFold

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(pipeline, X_train, y_train, cv=cv, scoring="f1_macro", n_jobs=-1)

print(f"{scores.mean():.3f} ± {scores.std():.3f}")
\`\`\`

**Always report the standard deviation.** A model scoring 0.86 ± 0.06 is not reliably better than one at 0.84 ± 0.01 — that gap sits well inside the fold-to-fold noise, so it is a coin flip dressed as an improvement. Comparing two mean scores whose error bars overlap heavily is the most common way people convince themselves of progress that is not there.

\`StratifiedKFold\` keeps class proportions steady in every fold; use it for any classification problem. Use \`GroupKFold\` when rows repeat per subject, and \`TimeSeriesSplit\` when the data is ordered in time — it always trains on the past and tests on the future.

### The leakage that cross-validation is supposed to prevent

\`\`\`python
# WRONG — the scaler and the selector saw every fold's validation rows
X_scaled = StandardScaler().fit_transform(X)
X_sel = SelectKBest(k=20).fit_transform(X_scaled, y)
cross_val_score(model, X_sel, y, cv=5)     # optimistic, sometimes wildly
\`\`\`

Preprocessing done before \`cross_val_score\` is fitted on all the data, including each fold's validation rows. Feature selection is the worst offender — choosing the 20 features most correlated with \`y\` across the whole dataset can turn pure noise into an apparent 0.90 AUC.

The fix is structural: put every fitted step in a \`Pipeline\`, and hand the pipeline to the CV function. Now each fold refits the scaler and the selector on its own training portion only.

\`\`\`python
from sklearn.pipeline import Pipeline

pipe = Pipeline([
    ("scale", StandardScaler()),
    ("select", SelectKBest(k=20)),
    ("model", LogisticRegression(max_iter=1000)),
])
cross_val_score(pipe, X, y, cv=cv)         # honest
\`\`\`

### Searching hyperparameters

Every name you search must be a real parameter of the estimator in that step, or the search raises before it fits anything. These are boosting knobs, so swap the pipeline's model first — \`set_params\` replaces a step in place and leaves the preprocessing untouched:

\`\`\`python
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import loguniform, randint

pipe.set_params(model=HistGradientBoostingClassifier(random_state=42))

params = {
    "model__learning_rate": loguniform(1e-3, 3e-1),
    "model__max_leaf_nodes": randint(8, 64),
    "model__min_samples_leaf": randint(5, 60),
}

search = RandomizedSearchCV(
    pipe, params, n_iter=60, cv=cv,
    scoring="average_precision", n_jobs=-1, random_state=42,
).fit(X_train, y_train)

print(search.best_params_, round(search.best_score_, 3))
final = search.best_estimator_
\`\`\`

Note the \`step__parameter\` naming — that double underscore is how you address a parameter inside a pipeline step.

**Prefer randomised search over grid search.** A grid over 4 parameters with 5 values each is 625 fits, and most of them vary a parameter that does not matter. Random search spends the same budget sampling widely and finds a comparable optimum in a fraction of the time. For expensive models, \`HalvingRandomSearchCV\` prunes bad candidates early.

Set \`scoring\` deliberately. The default is accuracy for classifiers, which walks you straight back into the trap from lesson one of this chapter.

### The last honest step

\`best_score_\` is itself optimistic — you selected the maximum of 60 noisy estimates, so it is the luckiest one, not the typical one. Refit the winner and evaluate once on the test set you set aside in Chapter 1. That final number is what you report. If it comes in a little below \`best_score_\`, nothing is broken; that gap is the selection bias you just measured.
        `),
      ],
      [
        q('A model predicts the majority class every time on data with 1% positives. What does it score?', [
          'Low accuracy and low recall',
          '99% accuracy and 0% recall',
          '99% precision and 99% recall',
          'An undefined accuracy',
        ], 1, 'Always predicting the majority is right 99% of the time yet catches no positives at all, which is exactly why accuracy misleads on imbalanced data.'),
        q('A fraud model flags 1000 transactions and 100 are real fraud, catching all 100 that exist. Which is true?', [
          'Precision 0.10, recall 1.00',
          'Precision 1.00, recall 0.10',
          'Precision 0.10, recall 0.10',
          'F1 of 0.90',
        ], 0, 'Precision is TP over everything flagged (100/1000) while recall is TP over all real positives (100/100).'),
        q('Why prefer PR-AUC over ROC-AUC when positives are rare?', [
          'ROC-AUC cannot be computed on imbalanced data',
          'False positive rate has a huge true-negative denominator, so ROC stays high even when most alerts are wrong',
          'PR-AUC is always the larger number',
          'ROC-AUC requires balanced classes to be defined',
        ], 1, 'Precision\'s denominator is the flagged set, so false alarms hurt it directly, while FPR dilutes them among thousands of true negatives.'),
        q('Why must preprocessing sit inside a Pipeline passed to cross_val_score?', [
          'Pipelines run faster than separate steps',
          'Otherwise each step is fitted on all the data, including every fold\'s validation rows',
          'cross_val_score cannot accept a plain estimator',
          'It is required for n_jobs=-1 to work',
        ], 1, 'Fitting a scaler or feature selector before cross-validation leaks validation information into training and inflates the score.'),
      ]
    ),
    chapter(
      'Features, Clusters, and the Limits of Models',
      'The engineering that actually moves scores, learning without labels, and the failures no metric will show you.',
      [
        lesson('Feature Engineering and the scikit-learn Pipeline', 14, `
Swapping a random forest for gradient boosting might buy you two points. A well-constructed feature can buy fifteen. **Feature engineering is where the score is**, and it is the part that requires knowing the domain rather than the library.

### Numeric features

**Scale** for any distance- or penalty-based model — linear models, SVMs, k-means, kNN. \`StandardScaler\` for roughly bell-shaped data, \`RobustScaler\` when outliers are heavy (it uses the median and IQR). Trees need none of it.

**Log-transform skewed values.** Income, page views, prices — a handful of enormous values dominate the fit. \`np.log1p(x)\` compresses the tail and handles zeros safely.

**Build ratios and differences**, which are usually the real signal:

\`\`\`python
df["price_per_sqft"]   = df["price"] / df["sqft"]
df["credit_used_pct"]  = df["balance"] / df["credit_limit"]
df["days_since_login"] = (df["snapshot_date"] - df["last_login"]).dt.days
\`\`\`

A tree can approximate a ratio only by carving a staircase out of a two-dimensional region. Handing it the division directly saves it dozens of splits and a lot of data.

**Explode dates.** A raw timestamp is nearly useless; \`month\`, \`day_of_week\`, \`hour\`, \`is_weekend\`, and \`days_until_holiday\` are not. For cyclical values use sine/cosine encoding so that hour 23 sits next to hour 0.

### Categorical features

| Method | Use when | Watch for |
|---|---|---|
| **One-hot** | Few categories (< ~15) | Column explosion on high cardinality |
| **Ordinal** | A genuine order (small < medium < large) | Never for unordered categories in linear models |
| **Target encoding** | High cardinality (zip code, product id) | **Leakage** — must be fitted inside the CV fold |
| **Native support** | LightGBM / CatBoost / \`HistGradientBoosting\` | Nothing; prefer this when available |

Target encoding replaces a category with the mean target for that category. Computed naively over the whole dataset, each row contributes to its own encoding and the model reads the answer off the feature. It gives a spectacular validation score and collapses in production. Use \`TargetEncoder\` with internal cross-fitting, inside a pipeline.

### Missing values

Do not silently drop rows. **Missingness is often a signal** — an unfilled income field on a loan application means something. Impute and record the fact:

\`\`\`python
from sklearn.impute import SimpleImputer
imputer = SimpleImputer(strategy="median", add_indicator=True)
\`\`\`

Median over mean, because a single absurd value drags the mean.

### The pipeline that ties it together

This is the practical scikit-learn workflow. Everything fitted lives inside one object, so cross-validation and deployment cannot leak:

\`\`\`python
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.model_selection import cross_val_score

numeric = ["age", "income", "tenure_months", "price_per_sqft"]
categorical = ["region", "plan", "channel"]

numeric_pipe = Pipeline([
    ("impute", SimpleImputer(strategy="median", add_indicator=True)),
    ("scale", StandardScaler()),
])

categorical_pipe = Pipeline([
    ("impute", SimpleImputer(strategy="most_frequent")),
    ("encode", OneHotEncoder(handle_unknown="ignore", min_frequency=20)),
])

preprocess = ColumnTransformer([
    ("num", numeric_pipe, numeric),
    ("cat", categorical_pipe, categorical),
], remainder="drop")

model = Pipeline([
    ("prep", preprocess),
    ("clf", HistGradientBoostingClassifier(learning_rate=0.05, max_iter=400)),
])

scores = cross_val_score(model, X_train, y_train, cv=5, scoring="average_precision")
print(f"PR-AUC {scores.mean():.3f} ± {scores.std():.3f}")

model.fit(X_train, y_train)   # one object; joblib.dump it and serve it
\`\`\`

\`handle_unknown="ignore"\` is essential: a category that appears in production but not in training would otherwise raise at inference time, taking your service down. \`min_frequency=20\` folds rare categories into a single bucket instead of creating columns that fit noise.

Once the whole thing is one estimator, \`model.predict(new_df)\` applies every transformation exactly as it was fitted. The classic production bug — training code and serving code preprocessing slightly differently — becomes impossible, because there is only one code path.
        `),
        lesson('Clustering: Finding Structure Without Labels', 13, `
Clustering groups rows by similarity when you have no target column. It is the most seductive family of methods in ML, because it always produces an answer — including from data with no structure at all.

### k-means

Pick k. Place k centroids at random. Then repeat until nothing moves: assign each point to its nearest centroid, then move each centroid to the mean of its assigned points. It minimises **inertia**, the total squared distance from points to their centroid.

\`\`\`python
from sklearn.cluster import KMeans
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

km = make_pipeline(
    StandardScaler(),
    KMeans(n_clusters=4, n_init=10, random_state=42),
).fit(X)

labels = km.named_steps["kmeans"].labels_
\`\`\`

**Scaling is mandatory here, and the omission is the classic k-means bug.** Cluster on raw \`annual_income\` (0–200,000) and \`num_purchases\` (0–50) and income contributes roughly four thousand times more distance. Your "customer segments" are income brackets with extra steps, and purchases are invisible.

\`n_init=10\` restarts from ten different initialisations and keeps the best, because k-means converges to a local optimum that depends on where the centroids started.

### Choosing k

**Elbow method** — plot inertia against k and look for the bend. Inertia always falls as k rises (at k = n it hits zero), so you are looking for where the improvement stops being worth it. Often the bend is ambiguous.

**Silhouette score** — for each point, compare its distance to its own cluster against the nearest other cluster. Ranges −1 to 1; above 0.5 is solid structure, below 0.25 means the clusters are largely arbitrary.

\`\`\`python
from sklearn.metrics import silhouette_score

for k in range(2, 9):
    labels = KMeans(n_clusters=k, n_init=10, random_state=42).fit_predict(X_scaled)
    print(k, round(silhouette_score(X_scaled, labels), 3))
\`\`\`

**The business answer.** If marketing can run four campaigns, k = 4 — regardless of what the silhouette prefers. Unsupervised results exist to be acted on.

### What k-means assumes

It assumes clusters are roughly spherical, similar in size, and separated by distance. Give it two crescents and it will slice straight through both. Give it one dense cluster and one sparse one and it will steal points from the sparse one. Every point gets assigned, so outliers land in a cluster and drag its centroid.

### DBSCAN when shape matters

DBSCAN grows clusters from dense regions: a point with at least \`min_samples\` neighbours within \`eps\` is a core point, and connected core points form a cluster.

\`\`\`python
from sklearn.cluster import DBSCAN

db = DBSCAN(eps=0.5, min_samples=10).fit(X_scaled)
n_clusters = len(set(db.labels_)) - (1 if -1 in db.labels_ else 0)
n_noise = (db.labels_ == -1).sum()
\`\`\`

Three advantages: you do not choose k, clusters can be any shape, and points in no dense region are labelled \`-1\` — **noise**, not forced into a group. That makes DBSCAN a decent anomaly detector too. The cost is \`eps\`, which is sensitive and hard to set; plot the distance to each point's k-th nearest neighbour, sort it, and take the value at the knee. DBSCAN also struggles when different clusters have very different densities.

**HDBSCAN** removes most of the \`eps\` pain and is worth reaching for on real data.

### The honesty problem

There is no ground truth, so there is no accuracy. Silhouette measures geometry, not meaning — and it will happily score four clusters found in uniform random noise. Before believing a clustering, do all three:

1. Check stability. Re-run on a 70% subsample. If the clusters change completely, they were an artefact.
2. Profile each cluster on features you did *not* cluster on. Real segments differ on more than what you fed the algorithm.
3. Show them to someone who knows the domain. "That is our weekend bulk-buyer group" is worth more than any silhouette score.
        `),
        lesson('Bias, Leakage, and the Limits of Models', 15, `
Everything so far assumed the pipeline is sound. These are the failures no cross-validation score will reveal — the ones that make a model look excellent right up until it is deployed.

### Data leakage

Leakage is training on information that will not exist at prediction time. It is the reason for almost every 0.99 AUC in a first draft.

**Target leakage** — a feature recorded because of, or after, the outcome. A churn model with \`cancellation_reason\` populated. A diagnosis model with \`treatment_prescribed\`. A default model with \`collections_agency_assigned\`. The model learns a tautology.

*Test:* for every feature, ask "would this value be filled in, with this value, at the moment I need the prediction?" If not, drop it.

**Train/test contamination** — scaling, imputing, or selecting features before splitting (Chapter 1), or resampling before splitting (Chapter 4). Pipelines fix this structurally.

**Temporal leakage** — random-splitting time-ordered data, so the model trains on the future to predict the past.

**Group leakage** — the same patient, user, or household in both train and test. The model memorises the individual.

**Duplicate rows** — near-identical records straddling the split. Deduplicate before splitting.

The alarm to install: **a surprisingly good score is a bug report until proven otherwise.** Drop your most important feature and refit; if performance collapses to chance, that feature deserves a hard look.

### Bias

A model trained on biased data reproduces the bias, at scale, with the authority of arithmetic.

**Historical bias** — the data faithfully records a discriminatory past. A hiring model trained on ten years of decisions learns who was hired before, not who performed well.

**Sampling bias** — your training population is not your deployment population. A dermatology model trained mostly on light skin fails on dark skin.

**Label bias** — the labels themselves are proxies. "Arrested" is not "committed a crime"; "clicked" is not "found it useful".

**Proxy variables** — dropping a protected attribute does not remove it. Postcode encodes race, first name encodes gender, university encodes class. The model reconstructs what you removed.

**Feedback loops** — the model's own predictions become tomorrow's training data. Send patrols where you predicted crime, record more crime there, retrain, send more patrols.

### Measuring fairness

Slice every metric by group. Overall recall of 0.85 can be 0.93 for one group and 0.51 for another.

\`\`\`python
import numpy as np
from sklearn.metrics import confusion_matrix

# align the group column with the test rows before indexing anything
groups = df.loc[y_test.index, "group"].to_numpy()
y_true = np.asarray(y_test)
y_pred = np.asarray(pred)

for g in np.unique(groups):
    mask = groups == g
    tn, fp, fn, tp = confusion_matrix(
        y_true[mask], y_pred[mask], labels=[0, 1]
    ).ravel()
    print(g,
          "n      =", int(mask.sum()),
          "recall =", round(tp / (tp + fn), 3),
          "FPR    =", round(fp / (fp + tn), 3))
\`\`\`

Definitions conflict, and the conflict is mathematical: when base rates differ between groups, **equal false positive _and_ false negative rates cannot hold alongside equal predictive value**. Choose which error you are equalising, state it, and defend it. There is no configuration flag for fairness.

### Drift

Models decay. **Covariate shift** — the inputs change. **Concept drift** — the relationship changes. **Adversarial drift** — someone is working around you. Monitor input distributions, prediction distributions, and live performance once labels arrive. Retrain before someone reports it.

### The limits, stated plainly

- Correlation, not causation. Use causal inference or an experiment before acting on "what if we changed X".
- No extrapolation. Unprecedented events are exactly where models are least reliable and most consequential.
- Confidently wrong. A model outputs a number for every input, including nonsense.
- Aggregate accuracy hides individual harm. 95% accurate means 1 in 20 people is affected by an error.

### When not to ship

Do not deploy if the stakes are high and you cannot explain a decision to the person it affects; if the training data does not represent who will be scored; if errors are irreversible with no appeal; or if a simple, auditable rule performs nearly as well.

"We built it and chose not to deploy it" is a legitimate, professional outcome. Write down what the model does, what it learned from, where it fails, and who it was tested on — then let that document, not the AUC, decide.

### Where to go next

You have the full applied loop: framing, splitting, linear models, trees, ensembles, honest evaluation, features, clustering, and the failure modes. The branches from here are deep learning for images, audio, and text; time-series forecasting; causal inference; and MLOps — versioning, serving, and monitoring what you built.
        `),
      ],
      [
        q('A churn model reaches 0.995 AUC on its first run. What should you do first?', [
          'Deploy it, since the score is excellent',
          'Search for leakage — a feature that would not exist at prediction time',
          'Add more trees to push it to 1.0',
          'Lower the decision threshold',
        ], 1, 'A surprisingly high score is a bug report until proven otherwise; features recorded after the outcome are the usual cause.'),
        q('Why must features be scaled before k-means?', [
          'k-means cannot handle negative numbers',
          'Distance is dominated by whichever feature has the largest numeric range',
          'Inertia is undefined on unscaled data',
          'Scaling determines the value of k',
        ], 1, 'A feature ranging to 200,000 swamps one ranging to 50, so the clusters reflect that single column instead of overall similarity.'),
        q('You remove race from a model\'s features. Has bias been eliminated?', [
          'Yes, the model can no longer use it',
          'No — correlated proxies such as postcode or name can reconstruct it',
          'Yes, provided the data is also balanced',
          'Only if accuracy stays the same',
        ], 1, 'Protected attributes are encoded redundantly across other features, so dropping the column removes the audit trail, not the signal.'),
        q('What does handle_unknown="ignore" on OneHotEncoder protect against?', [
          'Missing values in numeric columns',
          'A category appearing in production that was absent from training raising an error at inference',
          'Too many one-hot columns being generated',
          'Leakage between train and test',
        ], 1, 'Without it, an unseen category raises at predict time and takes the service down; with it, the row encodes as all zeros.'),
      ]
    ),
    chapter(
      'Shipping It: Serving, Versioning, and Monitoring',
      'Getting a fitted pipeline out of the notebook, behind an API, and under watch — plus the skew that quietly ruins good models.',
      [
        lesson('Persisting a Model Nobody Can Load Wrong', 13, `
A model that lives in a notebook is a demo. Turning it into a product starts with writing it to disk in a form another process — on another machine, weeks later — can load and use *identically*.

### Save the pipeline, not the estimator

Serialise the whole \`Pipeline\` from Chapter 5, imputers and encoders included. Dumping the bare classifier forces the serving code to re-implement every transformation, and the day those two implementations drift apart is the day your predictions go quietly wrong.

\`\`\`python
import hashlib, json, platform, subprocess
from pathlib import Path
import joblib, numpy, sklearn, pandas as pd

VERSION = "churn-2026-08-20-a"        # immutable; never overwrite an old artifact
out = Path("artifacts") / VERSION
out.mkdir(parents=True, exist_ok=True)

joblib.dump(model, out / "pipeline.joblib", compress=3)   # the WHOLE pipeline

manifest = {
    "version": VERSION,
    "git_sha": subprocess.check_output(["git", "rev-parse", "HEAD"]).decode().strip(),
    "sklearn": sklearn.__version__,
    "numpy": numpy.__version__,
    "python": platform.python_version(),
    "features": list(model.feature_names_in_),   # the exact order the pipeline expects
    "threshold": 0.31,                           # chosen on validation in Chapter 4
    "train_rows": int(len(X_train)),
    "train_hash": hashlib.sha256(
        pd.util.hash_pandas_object(X_train, index=True).values.tobytes()
    ).hexdigest()[:16],
    "test_pr_auc": round(float(test_pr_auc), 4),
}
(out / "manifest.json").write_text(json.dumps(manifest, indent=2))
\`\`\`

### What a pickle actually stores

Not code. It stores object state plus the **import path** of every class, then reconstructs by importing that path at load time. Two consequences follow.

**Version mismatch is a warning, not an error.** Load an artifact built on scikit-learn 1.4 into a 1.7 environment and you get an \`InconsistentVersionWarning\`. The object may work, may behave subtly differently, or may crash on the first \`predict\`. Pin versions in the service image and check them on load:

\`\`\`python
loaded = joblib.load(out / "pipeline.joblib")
mf = json.loads((out / "manifest.json").read_text())
if mf["sklearn"] != sklearn.__version__:
    raise RuntimeError(f"artifact built on sklearn {mf['sklearn']}, running {sklearn.__version__}")
\`\`\`

**Custom classes must be importable.** Define a transformer in a notebook cell and it pickles as \`__main__.MyTransformer\`. The API process has a different \`__main__\`, so loading dies with an \`AttributeError\` that looks like a corrupt file and is not. Any custom estimator, and any function you pass to \`FunctionTransformer\`, has to live in a real module that both the training job and the service import. Lambdas cannot be pickled at all.

### The threshold is part of the model

You spent Chapter 4 choosing 0.31 from validation data. \`predict()\` will cut at 0.5 regardless — it has no idea that decision was made. Ship the threshold in the manifest and apply it explicitly at serving time. A model tuned for recall and then served at 0.5 loses most of the recall it was tuned for, and nothing in the logs will say so.

### What belongs in an artifact directory

| File | Why it exists |
|---|---|
| \`pipeline.joblib\` | The fitted transformations and model |
| \`manifest.json\` | Versions, feature order, threshold, metrics, git sha |
| \`metrics.json\` | Per-slice test results, so a regression is visible later |
| \`reference.parquet\` | A sample of training inputs, for the drift monitor in lesson three |

### Version, never overwrite

\`model.pkl\` overwritten in place is how a team ends up unable to answer "which model scored this customer in March?". Use an immutable, dated version string, keep the previous artifact loadable, and record the version alongside every prediction you log. Rollback then costs a config change instead of a retraining run.

Tools like MLflow or DVC automate exactly this bookkeeping. They are worth adopting, but adopt them for what they store — not before you know what needs storing.
        `),
        lesson('A Prediction Service That Does Not Lie', 14, `
The service has one job: apply the artifact to incoming rows *exactly* as it was fitted. Most production ML bugs are violations of that sentence.

### Load once, predict many

\`\`\`python
# app.py — run with: uvicorn app:app --workers 4
import json
from pathlib import Path
import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel, Field

ART = Path("artifacts/churn-2026-08-20-a")
MODEL = joblib.load(ART / "pipeline.joblib")            # once, at import time
MANIFEST = json.loads((ART / "manifest.json").read_text())
FEATURES = MANIFEST["features"]
THRESHOLD = MANIFEST["threshold"]

class Customer(BaseModel):
    age: int = Field(ge=18, le=120)
    income: float = Field(ge=0)
    tenure_months: int = Field(ge=0)
    region: str
    plan: str
    channel: str

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok", "model_version": MANIFEST["version"]}

@app.post("/predict")
def predict(batch: list[Customer]):
    df = pd.DataFrame([c.model_dump() for c in batch])
    df = df.reindex(columns=FEATURES)          # exact order; extras dropped, absent -> NaN
    probs = MODEL.predict_proba(df)[:, 1]      # ONE call for the whole batch
    return [
        {
            "churn_probability": round(float(p), 4),
            "decision": bool(p >= THRESHOLD),
            "model_version": MANIFEST["version"],
        }
        for p in probs
    ]
\`\`\`

\`joblib.load\` inside the handler would add hundreds of milliseconds of deserialisation to *every* request for an object that never changes. Load at startup, then warm it with one dummy \`predict\` so the first real caller does not pay for lazily imported numpy paths.

### The column-order bug

\`pd.DataFrame([payload.model_dump()])\` produces columns in whatever order the schema happened to declare them. A \`ColumnTransformer\` selects by name and survives that; a pipeline fitted on a bare numpy array does not, and will happily feed \`income\` into the slot where \`age\` was trained. There is no exception — just wrong numbers. The \`reindex(columns=FEATURES)\` line makes the ordering explicit against the manifest, which costs nothing and removes an entire class of silent failure.

### Validate at the door

Pydantic rejects an age of 400 or a missing \`plan\` with a 422 before the model ever sees it. Without that, garbage input produces a confident probability, because a model returns a number for every input (Chapter 5). Range checks in the schema are the cheapest guardrail in the whole system.

### Batch, do not loop

\`predict_proba\` on 500 rows is roughly fifty times faster than 500 single-row calls — the per-call overhead of pandas construction and pipeline dispatch dwarfs the arithmetic. Expose a list endpoint and let callers batch. For scoring a whole table nightly, skip HTTP entirely and run the pipeline over a DataFrame in one process.

### Training–serving skew

The subtler failure: \`days_since_login\` computed in the training SQL as \`snapshot_date − last_login\` in UTC, and computed in the service against local server time. Everything type-checks and the score drifts a few points. The fix is structural — one function, in one module, imported by both the training job and the service:

\`\`\`python
# features.py — imported by the training job AND the API
def days_since_login(snapshot_utc, last_login_utc):
    return (snapshot_utc - last_login_utc).days
\`\`\`

Anything computed twice will eventually be computed differently. Compute it once.

### Two rules that save incidents

**Never retrain in the request path.** Training is a batch job with its own schedule, artifacts, and review.

**Log the model version with every prediction.** When a stakeholder asks why a decision was made in March, the version string is what turns an argument into a lookup.
        `),
        lesson('Monitoring, Drift, and Deciding to Retrain', 14, `
A deployed model degrades on its own. The world moves, upstream pipelines change, and nothing raises an exception. Monitoring is how you find out before a customer does.

### Log first

Every prediction should write a row: request id, timestamp, model version, the input features as received, and the output probability. Without that log you cannot diagnose a regression, cannot join labels on later, and cannot rebuild the input distribution you are supposed to be comparing against.

### Three signals, in order of how fast they speak

1. **Input drift** — available immediately.
2. **Prediction drift** — available immediately.
3. **Live performance** — delayed until labels arrive, sometimes by weeks.

### Population Stability Index

PSI compares a live distribution against the training reference:

\`\`\`python
import numpy as np

def psi(reference, live, bins=10):
    # bin edges come from the TRAINING reference, never from the live sample
    edges = np.quantile(reference, np.linspace(0, 1, bins + 1))
    edges[0], edges[-1] = -np.inf, np.inf
    ref_pct = np.histogram(reference, bins=edges)[0] / len(reference)
    live_pct = np.histogram(live, bins=edges)[0] / len(live)
    eps = 1e-6                                   # keeps empty bins out of the log
    ref_pct, live_pct = ref_pct + eps, live_pct + eps
    return float(np.sum((live_pct - ref_pct) * np.log(live_pct / ref_pct)))
\`\`\`

| PSI | Reading |
|---|---|
| < 0.10 | Stable |
| 0.10 – 0.25 | Investigate |
| > 0.25 | Material shift — expect degraded performance |

**The classic bug: recomputing the bin edges from today's live batch.** Quantile bins taken from the live data move with the data, so the statistic loses its fixed frame of reference. The failure is silent in exactly the case you most need caught: let a feature job break and emit a single constant value, and the rebuilt edges collapse onto that value, so every live row and every reference row land in one bin and PSI reads 0.00 — the same batch scored against fixed training edges reads above 12. A truncated range does the same thing. Compute the edges once, from training, and store them next to the artifact.

### Categorical drift and the unknown-category trap

The same formula works on category frequencies. Also count the **unseen-category rate** explicitly. \`handle_unknown="ignore"\` from Chapter 5 stops unknown values from crashing the service by encoding them as all zeros — which means a supplier renaming every region code degrades predictions silently and shows up in no metric you already have.

### Prediction drift is the cheap smoke alarm

Track the mean predicted probability per hour against its training value. A feature job that starts emitting nulls usually moves that mean within an hour, long before any label arrives. It is one number, and it catches most broken-upstream incidents.

### Delayed labels and rolling backtests

A churn label matures 30 days after the prediction. Join labels back onto the prediction log as they arrive and recompute PR-AUC weekly on the cohort that just matured. That is your real performance curve; everything before it is a proxy.

### When to retrain

- **On a cadence** as a floor — monthly or quarterly, so the pipeline never rots.
- **On a trigger** — PSI above 0.25 on an important feature, or matured PR-AUC below an agreed floor.
- **On an event** — a pricing change, a new market, a competitor launch.

Retraining on a fixed schedule *and* watching triggers beats either alone.

### Deploy the new one carefully

Score both models on live traffic and serve only the old one (**shadow mode**) until the distributions agree with what you expect. Then route a small percentage (**canary**), compare on identical requests, and widen. Keep the previous artifact loadable so rollback is a config change.

### The feedback loop to design out

If analysts only label the transactions your model flagged, next month's training data contains no ground truth for what you let through — the model's own decisions have defined its next training set, and its blind spots become permanent (Chapter 5). Reserve a small random sample of unfiltered traffic for labelling. It costs review capacity and it is the only thing that keeps the label set honest.
        `),
      ],
      [
        q('A model was tuned to a 0.31 decision threshold on validation data, but the service calls predict(). What happens?', [
          'Nothing — predict() uses the threshold stored inside the fitted model',
          'The service silently cuts at 0.5, so recall collapses relative to what was measured',
          'The service raises an error because no threshold was supplied',
          'Probabilities are returned instead of labels',
        ], 1, 'predict() always cuts at 0.5, so a threshold chosen on validation must travel in the manifest and be applied explicitly.'),
        q('A drift monitor recomputes its PSI bin edges from each day\'s live batch instead of from the training reference. What breaks?', [
          'PSI becomes negative and cannot be interpreted',
          'The monitor can no longer handle numeric features',
          'A collapsed live batch — a broken job emitting one constant value — is binned onto itself and registers as no drift at all',
          'PSI requires labels, which arrive too late to compute it',
        ], 2, 'Quantile bins taken from the live data move with the distribution, so the comparison loses the fixed frame that makes a shift visible — a column that has gone constant reads 0.00.'),
        q('A pipeline containing a custom transformer defined in a notebook cell fails to load in the API process with an AttributeError. Why?', [
          'Pickle stores the class by import path, and __main__.YourTransformer does not exist in the service',
          'joblib cannot serialise custom classes at all',
          'The transformer was never fitted before being dumped',
          'compress=3 corrupts custom objects',
        ], 0, 'A pickle records where a class lives rather than its code, so custom classes must sit in a module both training and serving import.'),
        q('A fraud team labels only the transactions the model flagged, and those labels become the next training set. What is the danger?', [
          'The labels are too few to train on',
          'Flagged transactions are the hardest cases, so the model overfits them',
          'The labelling delay breaks the time-based split',
          'The model never sees ground truth for what it let through, so its own decisions define what it learns next',
        ], 3, 'Labels filtered by the model\'s own output create a feedback loop, which is why a small randomly unfiltered sample must also be labelled.'),
      ]
    ),
    chapter(
      'Debugging Models and Testing ML Code',
      'Error analysis that finds the real defect, explanations you can defend, and the tests that stop a pipeline breaking in silence.',
      [
        lesson('Error Analysis: Read the Mistakes, Not the Metric', 14, `
A single score tells you how much the model is wrong. It never tells you *what* is wrong, and that is the only thing you can act on. Error analysis is the step that turns 0.84 into a task list.

### Build an error frame

\`\`\`python
import numpy as np, pandas as pd

probs = model.predict_proba(X_test)[:, 1]
err = X_test.copy()
err["y"] = np.asarray(y_test)
err["p"] = probs
err["pred"] = (err["p"] >= THRESHOLD).astype(int)
err["correct"] = err["pred"] == err["y"]
# per-row log loss: how confidently wrong each prediction was
err["loss"] = -(err.y * np.log(err.p + 1e-9) + (1 - err.y) * np.log(1 - err.p + 1e-9))
\`\`\`

Now sort by \`loss\` descending and read the top thirty rows by hand. This is the highest-value hour in a modelling project and almost nobody spends it. You will find mislabelled rows, a parsing bug that turned "1,200" into 1, and a segment your features simply do not describe.

### Slice, do not average

\`\`\`python
def slice_report(err, col, min_n=200):
    rows = []
    for value, g in err.groupby(col):
        if len(g) < min_n:                  # tiny slices are noise, not findings
            continue
        flagged, positives = g[g.pred == 1], g[g.y == 1]
        rows.append({
            col: value,
            "n": len(g),
            "base_rate": round(g.y.mean(), 3),
            "recall": round(positives.pred.mean(), 3) if len(positives) else None,
            "precision": round(flagged.y.mean(), 3) if len(flagged) else None,
        })
    return pd.DataFrame(rows).sort_values("recall")

print(slice_report(err, "region"))
print(slice_report(err, "plan"))
\`\`\`

A real result: overall recall 0.84, but 0.41 on customers with under three months of tenure — the exact segment the retention campaign targets. The headline number was never wrong; it was averaging a working model over one population and a broken one over another. **Report the worst meaningful slice next to the overall figure**, always. The \`min_n\` guard matters: a 12-row slice at recall 0.25 is noise, and chasing it wastes a week.

### Profile the two error types separately

\`\`\`python
fp = err[(err.pred == 1) & (err.y == 0)]
fn = err[(err.pred == 0) & (err.y == 1)]
print(pd.concat([fp.mean(numeric_only=True), fn.mean(numeric_only=True)], axis=1,
                keys=["false_pos", "false_neg"]))
\`\`\`

When one feature separates false positives from false negatives cleanly, you are usually missing a variable that a human would use. When nothing separates them, the two groups are genuinely indistinguishable given your data, and no amount of tuning will help.

### Check confidence against reality

\`\`\`python
err["bucket"] = pd.cut(err.p, np.arange(0, 1.1, 0.1))
print(err.groupby("bucket", observed=True).agg(n=("y", "size"), actual=("y", "mean")))
\`\`\`

Rows predicted at 0.8–0.9 should turn out positive about 85% of the time. If they come back at 0.55, the model ranks well and is badly calibrated — the Chapter 4 problem, diagnosed in three lines.

### Decide the fix from what you saw

| What the top-loss rows show | The fix |
|---|---|
| Labels that are simply wrong | Relabel. No model choice repairs a broken target. |
| A segment with no signal in the features | A new feature, not a new algorithm |
| Rows unlike anything in training | More data for that slice, or refuse to score it |
| Confident errors on one specific value | A parsing or encoding bug — go look at the raw input |

The classic mistake is reaching for a bigger model when 40% of the top-loss rows are mislabelled. The target defines what you are fitting; fix that first and the ranking of every model you compare changes.
        `),
        lesson('Explanations You Can Defend', 14, `
Chapter 3 warned that a tree's \`feature_importances_\` is biased toward high-cardinality columns. Here is what to use instead, and what each method is actually claiming.

### Permutation importance, on held-out data

Shuffle one column in the test set, re-score, and measure how far the metric fell. No refitting, and it works on any fitted estimator including a whole pipeline.

\`\`\`python
from sklearn.inspection import permutation_importance
import pandas as pd

r = permutation_importance(
    model, X_test, y_test, n_repeats=20,
    scoring="average_precision", random_state=42, n_jobs=-1,
)
imp = pd.DataFrame({"mean": r.importances_mean, "std": r.importances_std},
                   index=X_test.columns).sort_values("mean", ascending=False)
print(imp.head(10).round(4))
\`\`\`

Read the \`std\` column, not just the mean. A feature whose mean drop is 0.004 with a standard deviation of 0.006 is indistinguishable from noise, however high it sits in the sort.

**The trap:** permutation importance answers "what does this column add *given the others*". With \`square_feet\` and \`square_metres\` both present, shuffling either leaves the survivor carrying the signal, so both score near zero and both look useless. Near-zero importance means redundant, not irrelevant. When it matters, drop the column and refit — expensive, and the only honest answer.

### Partial dependence: the shape of one effect

\`\`\`python
from sklearn.inspection import PartialDependenceDisplay

PartialDependenceDisplay.from_estimator(
    model, X_test, ["tenure_months", "income"], kind="both"
)
\`\`\`

\`kind="both"\` draws the average curve *and* the individual per-row ICE curves. If the ICE lines fan out in opposite directions, the average is hiding an interaction and quoting the PDP alone will mislead whoever reads it.

### SHAP for a single decision

SHAP attributes one prediction across its features: the contributions plus the model's base value — \`explainer.expected_value\`, the average prediction over the background data — add up to exactly this prediction. That is what you need when a person asks why *their* application was scored the way it was.

\`\`\`python
import shap

prep = model.named_steps["prep"]        # the ColumnTransformer from Chapter 5
clf  = model.named_steps["clf"]
X_t  = prep.transform(X_test)
names = prep.get_feature_names_out()    # names AFTER encoding

explainer = shap.TreeExplainer(clf)
sv = explainer.shap_values(X_t)         # shape: (n_rows, n_encoded_features)
shap.summary_plot(sv, X_t, feature_names=names)
\`\`\`

**The classic bug is that last argument.** One-hot encoding changes both the number and the order of columns, so labelling the plot with \`X_test.columns\` attaches every attribution to the wrong feature. The output looks entirely plausible, which is what makes it dangerous. Names come from \`get_feature_names_out()\` on the fitted transformer, never from the raw frame.

### What an explanation is not

SHAP explains **this model's arithmetic**, not the world. "Income contributed +0.12 to this score" is a true statement about the model. "Raising this customer's income would reduce their churn risk" is a causal claim the method does not support (Chapter 1). Correlated features also split their attribution the same way they split coefficients in Chapter 2, so a single feature's SHAP value is a statement about a model fitted on *this* feature set.

### What to hand a person

For a decision that affects someone, the useful artefact is three lines: the top contributing features with direction, expressed in their own units, and what would have to change. "Declined: 4 late payments in 12 months, credit utilisation 87%, account open 3 months. Utilisation below 30% would move this materially."

That is the reason-code requirement in regulated credit, and it is a good standard everywhere. If you cannot produce it, Chapter 5's advice applies: consider not shipping.
        `),
        lesson('Testing ML Code So It Fails Loudly', 14, `
Ordinary software fails with a stack trace. ML code fails with a slightly worse score. A feature job that starts emitting nulls, an encoder that changed column order, a label join that silently dropped 8% of rows — none of these raise. Tests are how you make them raise.

### Four kinds of test, four jobs

| Test | Asserts | Runs |
|---|---|---|
| Data validation | Schema, ranges, null rate, category set | Every training run **and** every production batch |
| Pipeline smoke test | Fits and predicts on 200 rows | Every commit |
| Behavioural test | Known invariances and directional expectations | Every commit |
| Performance floor | Metric on a frozen golden set stays above a bar | Every release |

### Data validation

\`\`\`python
# tests/test_data.py
import pandas as pd

EXPECTED = {"age": "integer", "income": "floating", "region": "string"}

def test_schema(df):
    assert set(EXPECTED) <= set(df.columns)
    for col, kind in EXPECTED.items():
        # assert the dtype *kind*, never the exact dtype string: pandas 3 stores
        # text as str where pandas 2 used object, and that is not a data defect
        assert pd.api.types.infer_dtype(df[col]) == kind, f"{col} is {df[col].dtype}"

def test_ranges(df):
    assert df["age"].between(18, 120).all()
    assert (df["income"] >= 0).all()

def test_null_rate(df):
    assert df["income"].isna().mean() < 0.05
\`\`\`

Import this same module from the ingestion job. A schema check that runs only in CI protects nothing at 3am, when the upstream table changes.

### Smoke and behavioural tests

\`\`\`python
# tests/test_pipeline.py
import pytest

def test_fits_and_predicts(tiny_df):
    pipe = build_pipeline()
    X = tiny_df.drop(columns="y")
    pipe.fit(X, tiny_df["y"])
    p = pipe.predict_proba(X)[:, 1]
    assert p.shape == (len(tiny_df),)
    assert ((p >= 0) & (p <= 1)).all()

def test_unseen_category_does_not_raise(fitted_pipe, one_row):
    row = one_row.copy()
    row.loc[:, "region"] = "atlantis"          # never seen in training
    fitted_pipe.predict_proba(row)             # must not raise — Chapter 5

def test_column_order_is_irrelevant(fitted_pipe, one_row):
    shuffled = one_row[one_row.columns[::-1]]
    assert fitted_pipe.predict_proba(shuffled)[0, 1] == pytest.approx(
        fitted_pipe.predict_proba(one_row)[0, 1]
    )

def test_longer_tenure_lowers_churn(fitted_pipe, one_row):
    low  = one_row.assign(tenure_months=1)
    high = one_row.assign(tenure_months=60)
    assert fitted_pipe.predict_proba(high)[0, 1] < fitted_pipe.predict_proba(low)[0, 1]
\`\`\`

The third test is a permanent guard against the column-order bug from Chapter 6. The fourth encodes a business expectation: if it fails, either the model learned something odd or the expectation was wrong, and both are worth an argument. When the relationship *must* hold, enforce it with \`HistGradientBoostingClassifier(monotonic_cst=...)\` rather than hoping.

### The performance floor — and the mistake in it

\`\`\`python
from sklearn.metrics import average_precision_score

def test_golden_set_floor(fitted_pipe, golden):
    X = golden.drop(columns="y")
    ap = average_precision_score(golden["y"], fitted_pipe.predict_proba(X)[:, 1])
    assert ap >= 0.62, f"PR-AUC fell to {ap:.3f}"
\`\`\`

The classic mistake is \`assert ap == 0.6431\`. A library upgrade, a different thread count, or a changed BLAS backend shifts the last decimals through floating-point summation order alone. The test goes flaky, someone deletes it, and you lose the guard entirely. **Assert a floor with real margin** — set it a few points below the current score so genuine regressions fail and noise does not.

### Reproducibility is a prerequisite

Set \`random_state\` on the split, the model, and the search — all three (Chapter 1). Pin library versions in a lockfile and record them in the manifest (Chapter 6). Freeze the golden set as a file in version control, not a query that re-runs. Without these, a failing test cannot be distinguished from a changed environment, and every failure becomes a shrug.

Run the fast tests on every commit, the floor test before every release, and the data tests everywhere data enters. That is the difference between a model you maintain and a model you eventually rewrite.
        `),
      ],
      [
        q('Overall recall is 0.84, but recall on customers with under three months of tenure is 0.41. What is the right conclusion?', [
          'Report the overall figure, since it covers far more rows',
          'The model is overfitting and needs stronger regularisation',
          'Report the worst meaningful slice next to the overall number, because the average is hiding a failure on the segment that matters',
          'Recall is the wrong metric for this problem',
        ], 2, 'Aggregate metrics average across segments, so a slice report is what tells you whether the model works where it will actually be used.'),
        q('Two near-duplicate columns both show permutation importance close to zero. What does that mean?', [
          'Each is redundant given the other, since shuffling one leaves the second carrying the signal',
          'Neither column carries any information about the target',
          'The importances were mistakenly computed on the training set',
          'Permutation importance cannot be applied to tree models',
        ], 0, 'Permutation importance measures what a column adds beyond the rest, so duplicated information conceals itself.'),
        q('You compute SHAP values on the matrix produced by a ColumnTransformer but label the plot with X_test.columns. What is wrong?', [
          'SHAP values are only valid for linear models',
          'The values must be normalised before plotting',
          'Nothing — one-hot encoding preserves the original column order',
          'Encoding changed the number and order of columns, so every attribution is attached to the wrong feature name',
        ], 3, 'Feature names have to come from get_feature_names_out() on the fitted transformer, because encoding rewrites the column layout.'),
        q('A release test asserts that PR-AUC equals 0.6431 exactly. Why is that a bad test?', [
          'PR-AUC cannot be computed reproducibly under any circumstances',
          'A library upgrade or thread-count change shifts the last decimals, so the test turns flaky and gets deleted',
          'A floor of 0.95 would be the correct assertion instead',
          'Performance tests belong in production rather than in CI',
        ], 1, 'Exact equality fails for reasons unrelated to model quality, so assert a floor with margin that only a real regression can breach.'),
      ]
    ),
  ],
  final: [
    q('Which situation is the strongest signal that machine learning is the wrong tool?', [
      'The pattern is complex and hard to write down',
      'The rules are known, fixed, and must be exactly right every time',
      'You have 50,000 labelled examples',
      'Occasional errors are recoverable',
    ], 1, 'Known, exact rules should be coded directly — a model that is right 97% of the time is worse than the rule it approximates.'),
    q('You fit StandardScaler on the whole dataset and then split into train and test. What have you done?', [
      'Improved generalisation by using all the data',
      'Leaked test information into training, inflating the reported score',
      'Nothing — scaling does not learn anything',
      'Made the split non-reproducible',
    ], 1, 'The scaler learns a mean and standard deviation, so fitting it on test rows carries their information into training.'),
    q('Why does Ridge or Lasso require standardised features?', [
      'They cannot handle negative values',
      'The penalty applies equally to all coefficients, so feature units decide how hard each is punished',
      'Standardisation makes them converge faster',
      'Because R² assumes standardised inputs',
    ], 1, 'Coefficient magnitude depends on feature scale, so an unscaled penalty regularises features by their units rather than their usefulness.'),
    q('A model scores 0.98 on train and 0.63 on test. What is happening?', [
      'Underfitting — increase model capacity',
      'Overfitting — regularise, simplify, or gather more data',
      'Data leakage from the test set',
      'The test set is too large',
    ], 1, 'A wide train/test gap is high variance, meaning the model memorised training noise instead of the underlying pattern.'),
    q('What distinguishes gradient boosting from a random forest?', [
      'Boosting trains trees in parallel on bootstrap samples',
      'Boosting trains trees sequentially on the previous ensemble\'s errors and can overfit with too many trees',
      'Forests use shallow trees while boosting uses deep ones',
      'Forests require feature scaling and boosting does not',
    ], 1, 'Sequential residual fitting is the mechanism, which is also why boosting needs early stopping while bagging plateaus.'),
    q('A model predicts the majority class on data with 2% positives. Which metric exposes this?', [
      'Accuracy',
      'Recall',
      'Number of features used',
      'Training loss',
    ], 1, 'Accuracy reads 98% while recall reads 0, because recall counts the positives the model actually caught.'),
    q('Which pair of numbers describes a model that flags 500 rows, of which 50 are among the 100 true positives?', [
      'Precision 0.10, recall 0.50',
      'Precision 0.50, recall 0.10',
      'Precision 0.10, recall 0.10',
      'Precision 0.50, recall 0.50',
    ], 0, 'Precision is 50/500 = 0.10 over everything flagged; recall is 50/100 = 0.50 over all true positives.'),
    q('ROC-AUC looks excellent but analysts say most alerts are wrong. What explains it?', [
      'The AUC was computed on training data',
      'FPR has a huge true-negative denominator, so many false alarms barely move it — PR-AUC would show the problem',
      'AUC only applies to regression',
      'The threshold is set too high',
    ], 1, 'With rare positives, false positive rate is diluted by thousands of true negatives while precision, and therefore PR-AUC, is not.'),
    q('Why wrap preprocessing and the model in a single Pipeline?', [
      'It reduces memory usage during training',
      'Each cross-validation fold refits the transformers on its own training portion, preventing leakage',
      'It is the only way to use n_jobs=-1',
      'Pipelines automatically tune hyperparameters',
    ], 1, 'A pipeline makes every fitted step fold-local, so validation rows never influence the transformations applied to them.'),
    q('A model was trained on ten years of past hiring decisions. What is the core risk?', [
      'The dataset is too old to compute metrics on',
      'It learns who was hired historically, reproducing past bias rather than predicting performance',
      'Trees cannot handle categorical job titles',
      'Ten years is always too little data',
    ], 1, 'Historical bias is faithfully recorded in the labels, so the model reproduces past discrimination at scale.'),
    q('What belongs in a model artifact alongside the pickled pipeline?', [
      'Only the trained weights, to keep the artifact small',
      'The full training dataset, so the model can be rebuilt anywhere',
      'Nothing — a pickle is self-describing',
      'A manifest holding library versions, the exact feature order, the chosen threshold, and the test metrics',
    ], 3, 'A pickle stores objects but not the context needed to load or use them correctly, so versions, feature order, and the threshold must travel with it.'),
    q('Why load the model once at service startup rather than inside the request handler?', [
      'Deserialising the pipeline costs hundreds of milliseconds, and the object never changes between requests',
      'joblib.load can only be called once per process',
      'Loading per request causes the model to retrain on the incoming row',
      'It is required for request validation to work',
    ], 0, 'Unpickling is expensive and the artifact is immutable, so it belongs in startup rather than in every request\'s latency budget.'),
    q('The highest-loss rows in your error analysis turn out to be largely mislabelled. What is the right response?', [
      'Increase model capacity so it can fit them',
      'Lower the decision threshold to catch more of them',
      'Fix the labels — no model choice compensates for a broken target',
      'Drop the loss column and re-evaluate on accuracy',
    ], 2, 'The target defines what the model is fitting, so mislabelled rows are a data defect that no amount of tuning can repair.'),
    q('A drift monitor recomputes its PSI bin edges from each day\'s live data. What breaks?', [
      'PSI becomes negative and can no longer be interpreted',
      'The comparison loses its fixed reference frame, so a live column that has collapsed to a single constant value registers as no drift',
      'The monitor stops working on numeric features',
      'PSI starts requiring labels, which arrive too late',
    ], 1, 'Bin edges must come from the training reference; taken from live data they move with the distribution and hide exactly the shifts being watched for.'),
  ],
});
