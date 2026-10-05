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
        `,
        [
          q('Your team wants to know how many orders were placed last month. Why is a model the wrong tool for that question?', [
            'The dataset is too small to train on',
            'Order counts are continuous, and regression only handles categories',
            'The answer is already recorded in the data — that is a query, not a prediction',
            'Machine learning cannot work with date columns',
          ], 2, 'ML estimates values you do not have; a fact already sitting in your tables should be looked up with a GROUP BY.'),
          q('A churn model learns that customers who visit the pricing page churn less. What may you legitimately do with that?', [
            'Redirect users to the pricing page in order to reduce churn',
            'Use it to predict who will churn, but not to conclude that visiting the page causes retention',
            'Report the visit as the cause of retention, since the model relies on it',
            'Nothing — correlated features must be removed before training',
          ], 1, 'A model captures association, which supports prediction but says nothing about what happens if you intervene.'),
          q('Which of the four conditions for reaching for ML, when broken, makes a deployed model decay silently?', [
            'The pattern is too complex for anyone to write down by hand',
            'You have thousands of labelled examples',
            'Being wrong occasionally is recoverable',
            'Tomorrow\'s data will look roughly like today\'s',
          ], 3, 'A model can only reproduce patterns present in its training data, so a shifting world degrades it without raising any error.'),
        ]
      ),
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
        `,
        [
          q('You must predict a product rating from 1 to 5, and a prediction of 4 should count as closer to 5 than to 1. Which framing fits?', [
            'Regression, because it keeps the target on a scale where distance means something',
            'Multiclass classification, because there are exactly five possible outcomes',
            'Clustering, because ratings form natural groups',
            'Anomaly detection, because 1 and 5 are the extremes',
          ], 0, 'Regression preserves the ordering and the distance between values, which classification discards by treating the five ratings as unrelated boxes.'),
          q('Why can a clustering result not be reported with the same confidence as a classifier\'s accuracy?', [
            'Clustering algorithms are slower, so their results are less stable',
            'Silhouette scores are only defined for two clusters',
            'There is no ground truth to grade against, and the algorithm returns groups even from pure noise',
            'Unsupervised methods cannot be run on held-out data',
          ], 2, 'Without labels there is nothing to compare predictions against, so internal scores plus domain review are the only evidence available.'),
          q('Hiding a word in a sentence and training a model to predict it is an example of which setup?', [
            'Semi-supervised learning',
            'Self-supervised learning',
            'Reinforcement learning',
            'Association rule mining',
          ], 1, 'The labels are invented from the data itself, which is what turns unlabelled text into billions of supervised examples.'),
        ]
      ),
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
        `,
        [
          q('What does stratify=y change about a split, and when does it matter most?', [
            'It shuffles the rows so the split is genuinely random',
            'It guarantees the same split on every run',
            'It keeps the class proportions steady in each split, which matters most when positives are rare',
            'It removes duplicate rows before splitting',
          ], 2, 'Without stratification a small test set drawn from 3% positives can contain almost none, which turns the reported recall into noise.'),
          q('Your rows are ordered in time and the model will predict the future. What is wrong with a random 80/20 split?', [
            'It trains on later rows to predict earlier ones, so the score flatters a model that will fail in production',
            'Random splitting cannot be made reproducible on time-ordered data',
            'It always produces a test set that is too small',
            'Nothing, as long as random_state is set',
          ], 0, 'A random split lets the model learn from the future, which is information it will never have at prediction time.'),
          q('The test score disappoints, so you tune the model and evaluate on that same test set again. What is now true?', [
            'Nothing — a test set can be reused as often as you like',
            'The test score becomes pessimistic rather than optimistic',
            'The split has to be re-stratified before the next run',
            'That test set has become a validation set, and its score is no longer an unbiased estimate',
          ], 3, 'Tuning against a set makes it part of model selection, so an honest final number now requires a fresh holdout.'),
        ]
      ),
        lesson('Baselines: The Score You Have to Beat', 12, `
A score means nothing on its own. Accuracy of 0.84 is excellent on a balanced ten-class problem and embarrassing on a binary one where 86% of the rows are negative. **Fit something trivial first and write its score down.** Every later number is a comparison against it, and teams that skip this step routinely spend months improving a model that never beat the rule it was built to replace.

### The trivial baseline

scikit-learn ships one, so there is no excuse for working without it:

\`\`\`python
from sklearn.dummy import DummyClassifier, DummyRegressor
from sklearn.metrics import average_precision_score, mean_absolute_error

dummy = DummyClassifier(strategy="prior").fit(X_train, y_train)
base_ap = average_precision_score(y_test, dummy.predict_proba(X_test)[:, 1])

dummy_r = DummyRegressor(strategy="median").fit(X_train, y_train)
base_mae = mean_absolute_error(y_test, dummy_r.predict(X_test))

print(f"baseline PR-AUC {base_ap:.3f}   baseline MAE {base_mae:,.0f}")
\`\`\`

| Strategy | Predicts | Use for |
|---|---|---|
| \`most_frequent\` | The majority class | Accuracy and F1 comparisons |
| \`prior\` | The class prevalence as a probability | Probability metrics like PR-AUC |
| \`stratified\` | Random draws matching class frequencies | A noisier, weaker floor |
| \`mean\` / \`median\` | One constant number | Regression |

Score the dummy through the same split, the same metric, and the same pipeline as the real model. A baseline measured on different rows is not a baseline.

### The baseline that decides the project

A dummy proves your model beats noise. It does not prove the model is worth building. The bar that matters is **whatever runs today** — usually a hand-written rule someone in operations maintains. Encode it as a function and score it on the same test set:

\`\`\`python
from sklearn.metrics import precision_score, recall_score

def current_rule(df):
    return ((df["days_since_login"] > 30) & (df["plan"] == "basic")).astype(int)

pred = current_rule(X_test)
print(precision_score(y_test, pred), recall_score(y_test, pred))
\`\`\`

Now the comparison is honest:

| Candidate | Precision | Recall | Cost to run |
|---|---|---|---|
| Dummy (prior) | 0.07 | 0.07 | none |
| The ops rule | 0.31 | 0.44 | one SQL view |
| Gradient boosting | 0.38 | 0.51 | training job, artifact store, API, monitoring |

Seven points of precision may well justify that stack. It may not. Either way it is a decision, and it can only be made once the middle row exists.

### Baselines with the right shape

For a time series a constant is the wrong shape. Use **naive persistence** — tomorrow equals today — or **seasonal naive**, the same weekday last week:

\`\`\`python
df["naive"]    = df["demand"].shift(1)
df["seasonal"] = df["demand"].shift(7)
print((df["demand"] - df["seasonal"]).abs().mean())   # MAE to beat
\`\`\`

Forecasting models that fail to beat seasonal naive are common and are rarely reported as such. For text, the analogue is TF-IDF plus logistic regression before any transformer; for images, a small model before a large one.

### Four ways people get this wrong

**Comparing across splits.** A cross-validated model score against a baseline's test score is not a comparison. Same rows, same folds, same metric.

**Beating a strawman.** An untuned baseline is not a baseline. A logistic regression on unscaled features is a broken model, not a floor. Give the simple option a fair attempt — sometimes it wins, which is the most valuable result you can get in week one.

**Ignoring the ceiling.** If two expert annotators agree on only 88% of labels, a model at 0.90 is already inside the noise, and further gains are fitting disagreement. Measure inter-annotator agreement on a few hundred rows before promising 0.95.

**Ignoring the cost.** Two points of AUC bought with a retraining pipeline, an on-call rota, and a monitoring stack is a trade. Write both sides down.

### One line, kept forever

\`\`\`python
print(f"model {ap:.3f}   rule {rule_ap:.3f}   dummy {base_ap:.3f}")
\`\`\`

Three numbers on one line end more unproductive arguments than any chart.
        `,
        [
          q('A binary classifier reaches 0.86 accuracy. What single fact do you need before judging it?', [
            'How many features it used',
            'The score of a trivial baseline on the same split and metric, such as always predicting the majority class',
            'Whether a random_state was set during training',
            'The training accuracy',
          ], 1, 'A score is only interpretable against a floor, and the majority-class rate is the cheapest floor available.'),
          q('Why encode the operations team\'s existing hand-written rule as a function and score it?', [
            'To use its output as an extra feature in the model',
            'Because rules are generally more accurate than models on tabular data',
            'To decide whether the rule needs stratification',
            'Because the model has to beat the process it replaces, not just a coin flip',
          ], 3, 'The dummy shows you beat noise; the running rule is the bar that decides whether the project is worth its infrastructure.'),
          q('Two expert annotators agree on only 88% of the labels. What does that imply for a model scoring 0.90?', [
            'The model is undertrained and should run for more iterations',
            'The labels should be discarded entirely',
            'The model is already at the noise floor of the labels, so further gains are largely fitting annotator disagreement',
            'Accuracy is an invalid metric on human-annotated data',
          ], 2, 'A model cannot be more consistent than its labels, so scores near the agreement rate mean the remaining error is label noise.'),
        ]
      ),
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
        `,
        [
          q('Your model reports MAE 12 and RMSE 41. What does the gap between them tell you?', [
            'A bug, because RMSE can never exceed MAE',
            'A small number of large errors dominates, because squaring punishes big misses far harder',
            'The target needs to be standardised before fitting',
            'The model underfits evenly across the whole range',
          ], 1, 'RMSE and MAE only diverge when a few big residuals are inflating the squared term.'),
          q('A model contains both square_feet and square_metres, and their coefficients come out as +900 and −800. What is happening?', [
            'One of the two columns has been mislabelled in the data',
            'The model is underfitting and needs polynomial terms',
            'The target should be log-transformed',
            'Multicollinearity — the fit splits weight arbitrarily between near-duplicate features, so predictions stay fine but the individual numbers are meaningless',
          ], 3, 'Correlated features can trade enormous offsetting coefficients without changing the fitted predictions at all.'),
          q('Residuals plotted against predictions form a widening funnel. What is the usual first fix?', [
            'Log-transform the target, because the error is growing with the magnitude of y',
            'Collect more training rows',
            'Report R² instead of MAE',
            'Remove the intercept from the model',
          ], 0, 'A funnel means error scales with the size of the target, which a log transform compresses back to a roughly even spread.'),
        ]
      ),
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
        `,
        [
          q('What does predict_proba(X_test)[:, 1] give you for a binary classifier?', [
            'The predicted 0/1 label for each row',
            'The raw log-odds for each row',
            'The estimated probability of the positive class for each row',
            'The coefficient attached to the second feature',
          ], 2, 'predict_proba returns one column per class, so column 1 is the probability of the positive class.'),
          q('LogisticRegression raises a ConvergenceWarning. What are the two things to change?', [
            'Raise max_iter, and scale the features — unscaled inputs are usually the underlying cause',
            'Lower max_iter and remove the intercept',
            'Remove class_weight and switch to a solver without regularisation',
            'Nothing — the warning is cosmetic and the coefficients are final',
          ], 0, 'The warning means the optimiser stopped early, and badly scaled features are the most common reason it could not finish in time.'),
          q('A coefficient exponentiates to an odds ratio of 0.6 on standardised features. How do you read it?', [
            'The predicted probability of the positive class falls to 0.6',
            'A one standard deviation increase in that feature multiplies the odds of the positive class by 0.6, a 40% drop',
            'The feature explains 60% of the variance in the target',
            'The feature adds 0.6 to the predicted probability',
          ], 1, 'Exponentiating a log-odds coefficient gives a multiplier on the odds, not on the probability.'),
        ]
      ),
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
        `,
        [
          q('Train score 0.62, test score 0.88. What is the correct response?', [
            'Celebrate — the model generalises unusually well',
            'Add regularisation until the gap closes',
            'Increase capacity, since the training score is the weaker one',
            'Investigate the split — duplicate rows, leakage, or a too-easy test set explain a test score beating train by a wide margin',
          ], 3, 'Test data is harder than training data by construction, so the reverse pattern points at a broken split rather than a strong model.'),
          q('What does Lasso do that Ridge does not?', [
            'Drives some coefficients to exactly zero, so it performs feature selection',
            'Handles correlated features gracefully by splitting weight between them',
            'Removes the need to standardise the features',
            'Guarantees a lower test error',
          ], 0, 'The L1 penalty has a corner at zero, so coefficients are eliminated outright rather than merely shrunk.'),
          q('A learning curve shows the train and validation curves converging at a low score. What should you spend money on?', [
            'More training rows, which will lift both curves',
            'Stronger regularisation to close the remaining gap',
            'Better features or a stronger model — the curves have already met, so more data will not help',
            'A larger validation set',
          ], 2, 'Converged curves at a poor score are underfitting, which means the model or the features are the limit, not the sample size.'),
        ]
      ),
        lesson('Gradient Descent and the Solver Underneath', 13, `
\`LinearRegression\` has a closed-form answer: \`w = (XᵀX)⁻¹Xᵀy\`. One matrix inversion and it is done. Logistic regression has no such formula — the sigmoid makes the equations unsolvable analytically — so it is fitted by **iterative optimisation**. That is what \`max_iter\` counts, and knowing what happens inside explains most of the warnings scikit-learn shows you.

### Gradient descent in ten lines

The loss is a surface over the coefficients. The gradient points uphill. So step downhill, repeatedly:

\`\`\`python
import numpy as np

def fit_mse(X, y, lr=0.1, epochs=500):
    X = np.c_[np.ones(len(X)), X]           # intercept column
    w = np.zeros(X.shape[1])
    n = len(y)
    for _ in range(epochs):
        error = X @ w - y                   # shape (n,)
        grad = (2 / n) * X.T @ error        # d(MSE)/dw
        w -= lr * grad
    return w
\`\`\`

Three lines of arithmetic in the loop, and that is genuinely the whole algorithm. Every deep learning framework is this plus automatic differentiation and hardware.

### The learning rate has exactly two failure modes

| \`lr\` | Behaviour |
|---|---|
| Too small | Converges, but needs ten times the epochs |
| About right | Loss falls smoothly, then flattens |
| Too large | Overshoots the minimum; loss rises, then \`inf\`, then \`nan\` |

Weights that become \`nan\` after a handful of iterations are almost always the learning rate, not the data. Print the loss every 50 epochs, and if it is not falling monotonically, halve \`lr\` before changing anything else.

### Why scaling is not optional

With \`income\` in the tens of thousands beside \`bedrooms\` in single digits, the loss surface is a long narrow valley rather than a bowl. The gradient points across the valley instead of along it, so the steps zigzag — and a rate small enough to stay stable in the steep direction crawls in the shallow one.

That is the real cause of most \`ConvergenceWarning\` messages from \`LogisticRegression\`. Not a hard problem: unscaled inputs. Standardise and the warning usually disappears without touching \`max_iter\` at all.

### Batch, stochastic, mini-batch

**Batch** gradient descent uses every row for each step — stable, slow. **Stochastic** uses one row: noisy steps, far more of them, and it never quite settles. **Mini-batch** (32–512 rows) is the practical middle, and what every serious implementation uses.

Stochastic wins outright when the data does not fit in memory:

\`\`\`python
import numpy as np
import pandas as pd
from sklearn.linear_model import SGDClassifier

clf = SGDClassifier(loss="log_loss", penalty="l2", alpha=1e-4,
                    learning_rate="optimal", random_state=42)

classes = np.array([0, 1])
for chunk in pd.read_csv("events.csv", chunksize=100_000):
    Xc = scaler.transform(chunk[features])          # scaler fitted earlier on a sample
    clf.partial_fit(Xc, chunk["y"], classes=classes)
\`\`\`

\`partial_fit\` updates the existing weights instead of starting over, so forty million rows pass through eight gigabytes of RAM. The \`classes\` argument is required because the first chunk may not contain every label; omit it and the first call raises.

### Convexity, and why linear models are boring in a good way

Squared error and log loss are **convex** — one bowl, one minimum. Any optimiser that keeps heading downhill arrives at the same answer, which is why two runs of \`LogisticRegression\` produce identical coefficients and why the solution itself needs no \`random_state\`. Neural networks are not convex: initialisation changes where you land. That single difference explains much of why linear models are easier to reproduce, audit, and defend.

### The solvers you will actually choose

| Solver | Use when |
|---|---|
| \`lbfgs\` | The default. Quasi-Newton, uses curvature, few iterations |
| \`saga\` | Large datasets, or you need L1 / elasticnet penalties |
| \`liblinear\` | Small binary problems |
| \`newton-cholesky\` | Many rows, few features |

\`tol\` decides when to stop: the optimiser halts once the improvement drops below it. Loosening \`tol\` to \`1e-3\` is often a better answer to a slow fit than raising \`max_iter\` to 10,000 and waiting.
        `,
        [
          q('Your hand-written gradient descent produces weights of nan after a few iterations. What do you change first?', [
            'Run more epochs so it has time to settle',
            'Add an intercept column to X',
            'Lower the learning rate — the steps are overshooting and the loss is diverging',
            'Switch the loss from squared error to absolute error',
          ], 2, 'Divergence to inf and then nan is the signature of a step size too large for the curvature of the loss surface.'),
          q('Why does unscaled data make gradient descent converge slowly?', [
            'The gradient of an unscaled feature is always zero',
            'Features on very different scales stretch the loss surface into a narrow valley, so the steps zigzag across it instead of running along it',
            'The intercept cannot be fitted on unscaled data',
            'scikit-learn refuses to iterate on unscaled input',
          ], 1, 'An elongated loss surface forces a step size that is safe in the steep direction and far too small in the shallow one.'),
          q('You have forty million rows that will not fit in memory. How do you fit a logistic regression?', [
            'LinearRegression with the normal equation, which never loads all rows at once',
            'RidgeCV, which streams the data internally',
            'Fit on a random 1% and accept the lost signal as unavoidable',
            'SGDClassifier with partial_fit, feeding mini-batches and passing the class list on the first call',
          ], 3, 'partial_fit updates the existing weights per chunk, and classes must be supplied because the first chunk may not contain every label.'),
        ]
      ),
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
        `,
        [
          q('A node holds 50 rows split evenly between two classes. What is its Gini impurity?', [
            '0.0',
            '0.5',
            '1.0',
            'Undefined without knowing the feature values',
          ], 1, 'Gini is 1 − Σp², so 1 − (0.5² + 0.5²) = 0.5, the worst possible value for a binary node.'),
          q('Why can changing a handful of training rows restructure an entire decision tree?', [
            'Because gini and entropy disagree on most candidate splits',
            'Because trees require scaling and small changes alter the scale',
            'Because impurity is recomputed at prediction time',
            'Because the split search is greedy — a different winner at the root changes every branch beneath it',
          ], 3, 'The algorithm never backtracks, so the root split it happens to pick determines the whole structure below it.'),
          q('Which parameter most directly stops a tree from drawing a conclusion from three rows?', [
            'min_samples_leaf',
            'criterion',
            'random_state',
            'max_features',
          ], 0, 'min_samples_leaf sets a floor on how many rows any leaf may be built from, which is exactly that guarantee.'),
        ]
      ),
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
        `,
        [
          q('You cut n_estimators from 500 to 50 to reduce overfitting. What actually happens?', [
            'The forest regularises correctly and the test score improves',
            'Training fails, because 50 trees is below the working minimum',
            'You add variance back — a bagged ensemble plateaus with more trees rather than overfitting, so diversity controls are the real regularisers',
            'The out-of-bag estimate becomes exact',
          ], 2, 'Averaging more trees drives variance toward a floor and holds there, so removing trees only makes the estimate noisier.'),
          q('What makes the out-of-bag score usable as a validation estimate?', [
            'Every tree is scored on the full training set',
            'Bootstrap sampling leaves roughly 37% of rows out of each tree, so each row can be scored by the trees that never saw it',
            'The forest automatically holds back a stratified 20% of the data',
            'Out-of-bag rows are drawn from the test set',
          ], 1, 'Sampling with replacement excludes about a third of rows per tree, which gives a genuine held-out prediction for free.'),
          q('How does ExtraTreesClassifier differ from a random forest?', [
            'It trains its trees sequentially on the previous trees\' residuals',
            'It considers every feature at every split',
            'It prunes each tree with cost-complexity pruning after growth',
            'It picks split thresholds at random instead of searching for the best one, adding bias, cutting variance, and training faster',
          ], 3, 'Random thresholds remove the split search entirely, which is what buys the extra speed and the extra decorrelation.'),
        ]
      ),
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
        `,
        [
          q('You halve the learning rate from 0.1 to 0.05. What else has to change?', [
            'Nothing — the tree count is independent of the learning rate',
            'Roughly double the number of trees, since each one now contributes half as much correction',
            'Halve the number of trees, to keep the total contribution constant',
            'Increase the tree depth to compensate',
          ], 1, 'Learning rate and tree count trade off directly, because the ensemble needs the same total correction either way.'),
          q('You set max_iter=1000 with early stopping disabled, and the validation score peaked around iteration 240. What did you ship?', [
            'A model that spent 760 iterations fitting residual noise, scoring worse than the one early stopping would have kept',
            'The same model, since later trees contribute nothing once the loss stops falling',
            'An underfit model, because 1000 iterations is the minimum for boosting',
            'An identical model that simply took longer to train',
          ], 0, 'Boosting keeps fitting the current residuals harder, so past the optimum every added tree models noise and validation error climbs.'),
          q('Why does HistGradientBoosting train so much faster than a classic implementation on large data?', [
            'It builds its trees in parallel rather than sequentially',
            'It defaults to far fewer trees',
            'It bins continuous features into 256 buckets, so each split search scans buckets instead of every distinct value',
            'It silently drops rows containing missing values',
          ], 2, 'Histogram binning collapses the number of candidate split points from the row count to a fixed 256.'),
        ]
      ),
        lesson('Stacking: Combining Models That Fail Differently', 13, `
Bagging averages copies of one model. Boosting chains one model type. **Stacking** combines *different* model families by training a second-level model to decide how much to trust each of them on each row.

### The mechanism, and the one rule

Every level-0 model produces a prediction for every training row. Those predictions become the features of a level-1 **meta-model**, which learns the combination.

The rule that makes it work: the level-0 predictions on training data must be **out-of-fold**. Split the training set into k folds, fit each base model on k−1 of them, predict the held-out fold, and rotate. Feed in-sample predictions instead and the meta-model sees every base model at its most flattering — so it assigns the most weight to whichever model overfits hardest, which is precisely the one to trust least. That single mistake is why hand-rolled stacking so often scores below its own best base model.

scikit-learn does the folding for you:

\`\`\`python
from sklearn.ensemble import (StackingClassifier, RandomForestClassifier,
                              HistGradientBoostingClassifier)
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

base = [
    ("gb", HistGradientBoostingClassifier(learning_rate=0.05, max_iter=400,
                                          random_state=42)),
    ("rf", RandomForestClassifier(n_estimators=500, n_jobs=-1, random_state=42)),
    ("lr", make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))),
]

stack = StackingClassifier(
    estimators=base,
    final_estimator=LogisticRegression(max_iter=1000),
    stack_method="predict_proba",      # feed probabilities, not hard labels
    cv=StratifiedKFold(5, shuffle=True, random_state=42),
    passthrough=False,
    n_jobs=-1,
).fit(X_train, y_train)
\`\`\`

At prediction time each base model — now refitted on the full training set — scores the row, and the meta-model combines those numbers.

### Check for diversity before you bother

Stacking pays only when the base models get *different rows* wrong. Measure that in four lines:

\`\`\`python
import pandas as pd

p = pd.DataFrame({
    name: est.fit(X_train, y_train).predict_proba(X_test)[:, 1]
    for name, est in base
})
print(p.corr().round(2))
\`\`\`

Pairwise correlations above roughly 0.95 mean the models agree nearly everywhere and the ensemble will gain almost nothing. Three variants of gradient boosting are not diversity; a boosted tree, a linear model, and a nearest-neighbours model are.

### Keep the meta-model small

The meta-model has only k features (or k × n_classes) and no more effective rows than your training set. A logistic regression, or a ridge for regression, is almost always the right choice. A boosted tree stacked on top of three boosted trees overfits the fold predictions and adds latency for nothing.

\`passthrough=True\` hands the original features to the meta-model alongside the base predictions. It occasionally helps when one segment is better served by a particular base model, and it makes overfitting easier. Measure it rather than assuming.

### Voting, the cheaper cousin

\`\`\`python
from sklearn.ensemble import VotingClassifier

vote = VotingClassifier(base, voting="soft", weights=[3, 2, 1], n_jobs=-1)
\`\`\`

Soft voting averages the probabilities using weights you choose: no meta-model, no folds, no out-of-fold rule to get wrong, and it captures most of the benefit when the base models are of comparable quality. Try it first. **Hard voting** — a majority of predicted labels — throws away the probabilities and is usually the weaker of the two.

### What it costs

Stacking multiplies training time by the number of base models times the number of folds, multiplies inference latency by the number of base models, and turns your explanation story from "here is a SHAP plot" into "here are three SHAP plots and a combiner". In a competition that trade is free. In production, 0.004 of PR-AUC rarely survives an on-call engineer asking why the service now takes 90 ms per row.

Fit it once to see where the ceiling is. Ship it only when the gap justifies the machinery.
        `,
        [
          q('Why must the meta-model be trained on out-of-fold predictions from the base models?', [
            'Because base models cannot predict on rows they were fitted on',
            'Because out-of-fold predictions are cheaper to compute',
            'In-sample predictions are unrealistically good, so the meta-model learns to trust whichever base model overfits hardest',
            'Because the meta-model needs exactly as many rows as each base model saw',
          ], 2, 'Only held-out predictions show the meta-model how each base model behaves on data it has not seen, which is the situation at inference.'),
          q('Your base models\' test probabilities correlate with each other at 0.97. What should you expect from stacking them?', [
            'Almost no gain — stacking pays off when the base models fail on different rows',
            'A large gain, because strong agreement means a strong signal',
            'The meta-model will fail to converge',
            'Better calibration but worse ranking',
          ], 0, 'A combiner can only exploit disagreement, so near-identical base models leave it nothing to learn.'),
          q('What does passthrough=True add to a StackingClassifier?', [
            'It forwards the base models\' hyperparameters to the meta-model',
            'It gives the meta-model the original features alongside the base predictions',
            'It skips cross-validation when generating the meta-features',
            'It passes the training labels to the base models a second time',
          ], 1, 'The meta-model then sees both the raw columns and the base predictions, which can help but also makes overfitting easier.'),
        ]
      ),
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
        `,
        [
          q('Which metric should a spam filter be tuned for, and why?', [
            'Recall, because a spam email reaching the inbox is the costly error',
            'Precision, because a real message lost to the spam folder costs far more than a spam message that gets through',
            'Accuracy, because both classes appear at similar rates',
            'False positive rate, because it ignores true positives entirely',
          ], 1, 'The expensive mistake is a false positive — a legitimate mail filed as spam — and precision is the ratio that measures it.'),
          q('Precision is 0.9 and recall is 0.1. Why does F1 come out near 0.18 rather than near 0.5?', [
            'Because F1 is the arithmetic mean of the two numbers',
            'Because F1 always equals the smaller of the two exactly',
            'Because F1 is undefined when recall falls below 0.5',
            'Because F1 is the harmonic mean, which is dragged down by whichever of the two is weaker',
          ], 3, 'The harmonic mean 2·(0.9·0.1)/(1.0) = 0.18, which is why a single strong number cannot hide a weak one.'),
          q('You report weighted-average F1 on a problem where the rare class is the one that matters. What is the risk?', [
            'It is dominated by the frequent classes, so total failure on the rare class barely moves it',
            'Weighted F1 cannot be computed for more than two classes',
            'It equals accuracy in every case',
            'It over-weights the rare class and exaggerates the problem',
          ], 0, 'Weighting by class frequency reproduces accuracy\'s blind spot under a more respectable name; macro averaging is what exposes the rare class.'),
        ]
      ),
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
        `,
        [
          q('What exactly does an AUC of 0.82 mean?', [
            '82% of the model\'s predictions are correct',
            '82% of the positives are caught at the default threshold',
            'A randomly chosen positive scores higher than a randomly chosen negative 82% of the time',
            '82% of the area beneath the precision–recall curve is filled',
          ], 2, 'ROC-AUC is exactly the probability that a random positive outranks a random negative, which is why it is threshold-free.'),
          q('roc_auc_score(y_test, clf.predict(X_test)) returns a suspiciously low number. What is wrong?', [
            'It was passed hard labels instead of probabilities, collapsing the curve to a single point',
            'AUC requires balanced classes before it can be computed',
            'The test set is too small for AUC to be meaningful',
            'predict returns strings, which cannot be ranked',
          ], 0, 'AUC needs a continuous score to sweep the threshold across; 0/1 labels leave it with one point and a deflated area.'),
          q('A model has AUC 0.95, but rows it scores at 0.9 turn out positive only 60% of the time. What is the problem?', [
            'Poor ranking; retrain with class_weight="balanced"',
            'Leakage; drop the strongest feature and refit',
            'The threshold is too low and should be raised to 0.9',
            'Poor calibration — the ranking is fine, so wrap the model in CalibratedClassifierCV if the probability itself feeds a downstream calculation',
          ], 3, 'Ranking quality and probability accuracy are separate properties, and only calibration fixes the second.'),
        ]
      ),
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
        `,
        [
          q('Model A scores 0.86 ± 0.06 across five folds and model B scores 0.84 ± 0.01. What is the honest conclusion?', [
            'A is better, since its mean is higher',
            'The difference sits inside the fold-to-fold noise, so the two are not distinguishable on this evidence',
            'B is better, since its standard deviation is lower',
            'The comparison is invalid unless both used the same random_state',
          ], 1, 'A two-point gap between means whose error bars overlap heavily is a coin flip dressed as an improvement.'),
          q('Why prefer RandomizedSearchCV over an exhaustive grid on the same budget?', [
            'It is guaranteed to locate the global optimum',
            'It removes the need for cross-validation',
            'A grid spends most of its fits varying parameters that do not matter, while random sampling covers the important ranges for the same cost',
            'It prevents leakage automatically',
          ], 2, 'Grid search wastes its budget on unimportant axes; random sampling explores each axis widely and finds a comparable optimum far sooner.'),
          q('best_score_ from a 60-candidate search is 0.71 and the final test score is 0.68. What does that mean?', [
            'Nothing is broken — best_score_ is the maximum of 60 noisy estimates, so it is optimistically biased',
            'The search overfit the training data and must be rerun with fewer candidates',
            'The test set is too small and should be enlarged',
            'The scoring parameter was configured incorrectly',
          ], 0, 'Taking the maximum over many noisy estimates picks the luckiest one, so a modest drop on the untouched test set is expected.'),
        ]
      ),
        lesson('Error Bars: Is Model B Actually Better?', 14, `
Model A scores 0.61 PR-AUC on the test set and model B scores 0.64. Ship B? Not yet. A test score is one draw from a distribution, and with 2,000 rows and 180 positives, three points is comfortably inside the noise.

### Bootstrap the test set

Resample the test rows with replacement, recompute the metric, repeat a couple of thousand times, and read the percentiles. It assumes nothing about the metric and works for anything you can compute:

\`\`\`python
import numpy as np
from sklearn.metrics import average_precision_score

rng = np.random.default_rng(42)
y = np.asarray(y_test)
idx = np.arange(len(y))

def boot_ci(y, p, n=2000):
    vals = []
    for _ in range(n):
        s = rng.choice(idx, size=len(idx), replace=True)
        if y[s].sum() == 0:            # a resample with no positives has no AP
            continue
        vals.append(average_precision_score(y[s], p[s]))
    lo, hi = np.percentile(vals, [2.5, 97.5])
    return float(np.mean(vals)), float(lo), float(hi)

m, lo, hi = boot_ci(y, probs_b)
print(f"PR-AUC {m:.3f}  95% CI [{lo:.3f}, {hi:.3f}]")
\`\`\`

A realistic result is \`0.640 [0.571, 0.706]\`. That interval is the honest report. Quoting 0.6403 to four decimals out of a spread thirteen points wide is false precision, and reviewers notice.

**The width is governed by the minority class, not the row count.** Three thousand rows with 40 positives gives an interval about as wide as 400 rows with 40 positives. If you need a tighter estimate you need more positives; a bigger test set only helps because it contains more of them.

### Compare paired, never separately

The tempting next step is to bootstrap A and B independently and check whether the two intervals overlap. Do not. Overlapping intervals do not imply no difference, and the comparison throws away the fact that both models were scored on the *same rows*. Resample once per iteration, score both models on that resample, and take the difference:

\`\`\`python
def boot_gain(y, pa, pb, n=2000):
    diffs = []
    for _ in range(n):
        s = rng.choice(idx, size=len(idx), replace=True)
        if y[s].sum() == 0:
            continue
        diffs.append(average_precision_score(y[s], pb[s])
                     - average_precision_score(y[s], pa[s]))
    d = np.array(diffs)
    lo, hi = np.percentile(d, [2.5, 97.5])
    return d.mean(), lo, hi, (d > 0).mean()

gain, lo, hi, wins = boot_gain(y, probs_a, probs_b)
print(f"gain {gain:+.4f}  CI [{lo:+.4f}, {hi:+.4f}]  B wins {wins:.0%} of resamples")
\`\`\`

Pairing cancels the difficulty of the particular sample — a resample full of hard rows hurts both models equally — so the interval on the *difference* is far tighter than either model's own. It is routine for two intervals to overlap heavily while the paired interval on the gain sits entirely above zero. **If the interval on the difference crosses zero, you have not demonstrated an improvement.**

### McNemar, for hard decisions

When you are comparing final labels rather than scores, use the paired disagreement counts:

\`\`\`python
from statsmodels.stats.contingency_tables import mcnemar

a_ok = (pred_a == y)
b_ok = (pred_b == y)
table = [[( a_ok &  b_ok).sum(), ( a_ok & ~b_ok).sum()],
         [(~a_ok &  b_ok).sum(), (~a_ok & ~b_ok).sum()]]
print(mcnemar(table, exact=False, correction=True))
\`\`\`

Only the two off-diagonal cells carry information: rows A got right and B did not, against the reverse. Rows both models handle identically say nothing about which is better, which is why a raw accuracy difference always looks more impressive than the evidence supports.

### Two habits worth keeping

**Report the interval, not just the point.** "0.64 (95% CI 0.57–0.71), baseline 0.09" is a sentence a reviewer can trust.

**Count your comparisons.** Test twenty variants against the same test set and one clears the bar by luck alone. Select on validation, confirm the winner once on test, and state how many candidates you tried.
        `,
        [
          q('Why bootstrap the difference between two models on the same resampled rows rather than comparing their separate confidence intervals?', [
            'Because separate intervals cannot be computed for PR-AUC',
            'Because the difference is always smaller than either interval',
            'Because bootstrapping twice doubles the runtime for no benefit',
            'Because both models see the same rows, so pairing cancels the shared difficulty of each sample and gives a much tighter interval',
          ], 3, 'Paired resampling removes the variation caused by which rows were drawn, leaving only the variation that distinguishes the models.'),
          q('Your test set has 3,000 rows and 40 positives. What mainly limits the precision of the recall estimate?', [
            'The 3,000 total rows',
            'The 40 positives — the minority count governs the width of the interval',
            'The number of features in the model',
            'The number of cross-validation folds used during tuning',
          ], 1, 'Recall is computed over positives alone, so the interval narrows only when the positive count grows.'),
          q('In McNemar\'s test comparing two classifiers, which counts carry the information?', [
            'The rows both models classify correctly',
            'The rows both models classify incorrectly',
            'The rows where the two models disagree',
            'The total number of test rows',
          ], 2, 'Agreement, right or wrong, is uninformative about which model is better; only the off-diagonal disagreements distinguish them.'),
        ]
      ),
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
        `,
        [
          q('Why hand a tree model price_per_sqft instead of letting it learn the ratio from price and sqft?', [
            'A tree can only approximate a ratio with a staircase of axis-aligned splits, so the division saves it dozens of splits and a lot of data',
            'Trees cannot use two numeric features in the same branch',
            'Division is not differentiable, so the model would fail to converge',
            'It removes the need to scale the two source columns',
          ], 0, 'A ratio is a diagonal boundary in two dimensions, which axis-aligned splits can only approximate step by step.'),
          q('Target encoding computed over the whole dataset before splitting produces a spectacular validation score that collapses in production. Why?', [
            'Production data contains more distinct categories',
            'Target encoding requires the features to be scaled first',
            'The encoder cannot handle categories it has not seen',
            'Each row contributed to its own encoded value, so the feature carried the answer — and that signal does not exist at prediction time',
          ], 3, 'Fitting the encoding on rows that include the row being encoded leaks the target directly into the feature.'),
          q('What does min_frequency=20 on OneHotEncoder do, and why does it help?', [
            'It drops any row whose category appears fewer than 20 times',
            'It folds rare categories into a single bucket, so the model is not given columns built from a handful of rows',
            'It requires every category to appear at least 20 times in the test set',
            'It caps the encoder at 20 output columns in total',
          ], 1, 'Columns representing three or four rows fit noise, so grouping the rare tail into one indicator is both smaller and more honest.'),
        ]
      ),
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
        `,
        [
          q('What does n_init=10 protect a KMeans fit against?', [
            'Overfitting to the training rows',
            'Unscaled features dominating the distance calculation',
            'Converging to a poor local optimum that depends on where the centroids happened to start',
            'Choosing the wrong number of clusters',
          ], 2, 'k-means only reaches a local optimum, so restarting from several initialisations and keeping the best is the standard defence.'),
          q('Which points does DBSCAN label -1?', [
            'Points in no sufficiently dense region — noise, rather than being forced into a cluster',
            'The centroid of the first cluster it finds',
            'Points that are equidistant from two clusters',
            'Points removed for having a missing value',
          ], 0, 'Refusing to assign sparse points is exactly what makes DBSCAN robust to outliers and usable as an anomaly detector.'),
          q('A four-cluster solution scores 0.55 on silhouette. What has that established?', [
            'That the four segments are real and can be reported as validated',
            'That k=4 is the optimal number of clusters for this data',
            'That the clustering is stable under resampling',
            'Only that the geometry separates well — meaning still needs stability checks, profiling on unused features, and domain review',
          ], 3, 'Silhouette measures separation in the space you clustered on, and it will happily score structure found in pure noise.'),
        ]
      ),
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
        `,
        [
          q('Which of these features is the clearest case of target leakage in a churn model?', [
            'tenure_months',
            'cancellation_reason',
            'region',
            'monthly_spend',
          ], 1, 'A cancellation reason only exists once the customer has cancelled, so it could never be populated at prediction time.'),
          q('Why can equal false positive and false negative rates across groups fail to coexist with equal predictive value?', [
            'Because scikit-learn does not implement all three definitions',
            'Because each metric is computed on a different test set',
            'Because when the base rates differ between groups the three conditions are mathematically incompatible, so you must choose which to equalise',
            'Because false negative rate is undefined for small groups',
          ], 2, 'The conflict is arithmetic rather than a tooling gap, which is why fairness is a stated choice you have to defend.'),
          q('Patrols are sent where crime was predicted, and the arrests they generate become the next training set. What is this called?', [
            'A feedback loop, in which the model\'s own predictions shape the data it learns from next',
            'Covariate shift',
            'Target leakage',
            'Sampling bias confined to the test set',
          ], 0, 'The model manufactures the evidence that confirms it, so its blind spots become permanent rather than being corrected.'),
        ]
      ),
        lesson('PCA: Fewer Dimensions, and What It Costs', 13, `
Two hundred correlated sensor columns usually describe about eight things. **PCA** finds those eight. It rotates the feature space onto new orthogonal axes ordered by how much variance each captures, and lets you keep only the first few.

### Fitting it

\`\`\`python
import numpy as np
from sklearn.decomposition import PCA
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

pipe = make_pipeline(
    StandardScaler(),
    PCA(n_components=0.95, random_state=42),    # keep 95% of the variance
).fit(X_train)

pca = pipe.named_steps["pca"]
print(f"{pca.n_components_} components from {X_train.shape[1]} columns")
print(np.cumsum(pca.explained_variance_ratio_).round(3)[:10])
\`\`\`

\`n_components\` accepts an integer (keep exactly this many), a float between 0 and 1 (keep enough for this share of variance), or \`"mle"\`. Prefer the float: it states an intent instead of a guess.

### Scaling is mandatory, for the k-means reason

PCA maximises variance, and variance is measured in the units of each column. Leave \`annual_income\` (variance in the billions) beside \`num_purchases\` (variance around 40) and the first component simply *is* income, rotated by nothing. Every other feature vanishes into components you then discard. \`StandardScaler\` in front, always — and inside the pipeline, so each cross-validation fold refits it on its own rows.

### Reading the components

A component is a weighted mixture of the original features, and the weights live in \`components_\`:

\`\`\`python
import pandas as pd

loadings = pd.DataFrame(pca.components_[:3].T, index=X_train.columns,
                        columns=["PC1", "PC2", "PC3"])
print(loadings["PC1"].abs().sort_values(ascending=False).head(5).round(2))
\`\`\`

You can usually name PC1 — "overall spend level", "sensor drift" — and almost never PC4. That is the trade: you gain compactness and lose the ability to say "the decision turned on credit utilisation". For anything that needs a reason code, that loss is disqualifying.

### The part nobody warns you about

**PCA never looks at \`y\`.** It ranks directions by variance, and the direction that separates your classes may carry very little of it. Discarding "only 5% of the variance" can discard exactly the 5% that mattered. So measure, do not assume:

\`\`\`python
from sklearn.model_selection import cross_val_score

print(cross_val_score(full_pipe, X_train, y_train, cv=5,
                      scoring="average_precision").mean())
print(cross_val_score(pca_pipe,  X_train, y_train, cv=5,
                      scoring="average_precision").mean())
\`\`\`

Two numbers settle it. If PCA costs you score, it costs you score; nothing says it has to help. When you want a supervised projection, \`LinearDiscriminantAnalysis\` reduces dimensions using the labels, and plain feature selection keeps original columns with their names intact.

### When it earns its place

| Situation | Verdict |
|---|---|
| Hundreds of correlated numeric columns — spectra, sensors, pixels | Yes |
| Speeding up a distance-based model: kNN, k-means, SVM | Yes |
| Decorrelating inputs before a linear model | Often |
| Thirty mixed-type tabular columns | Rarely worth it |
| In front of a tree ensemble | **No** — trees handle correlated features fine, and rotating the axes destroys the axis-aligned splits they depend on |
| Any decision a human must have explained | No |

### t-SNE and UMAP are for looking, not modelling

They produce beautiful two-dimensional plots and are routinely over-read. In a t-SNE plot, **the distance between clusters and the size of each blob carry no meaning** — only local neighbourhoods are preserved, and the layout shifts with the \`perplexity\` setting. Never feed the coordinates into a model, and note that \`TSNE\` has no \`transform\` method at all: there is no way to project new rows into an existing plot. Fit it, look at it, form a hypothesis, then test that hypothesis with something you can actually validate.
        `,
        [
          q('Why must features be standardised before PCA?', [
            'Because PCA cannot handle negative values',
            'PCA maximises variance, so the column with the largest numeric range becomes the first component regardless of how useful it is',
            'Because explained_variance_ratio_ must sum to exactly 1',
            'Because the components have to come out orthogonal',
          ], 1, 'Variance is expressed in each column\'s own units, so an unscaled wide-ranging feature dominates the rotation.'),
          q('PCA keeps 95% of the variance, but your classifier gets worse. What is the most likely explanation?', [
            'n_components was set too high',
            'PCA also needs to be fitted on the test set',
            'The components were never rotated after extraction',
            'PCA is unsupervised — it ranks directions by variance, not usefulness for y, so a low-variance direction that separated the classes was thrown away',
          ], 3, 'Variance and class separation are unrelated quantities, so the discarded 5% can be precisely the part that carried the signal.'),
          q('You produce a t-SNE plot with four well-separated blobs. What may you conclude from the distances between them?', [
            'Nothing — t-SNE preserves local neighbourhoods, so between-cluster distances and blob sizes are not meaningful',
            'The clusters are proportionally that far apart in the original space',
            'The largest blob corresponds to the most common class',
            'The coordinates can be used as features for a downstream classifier',
          ], 0, 't-SNE optimises local neighbourhood structure only, and its global layout also changes with the perplexity setting.'),
        ]
      ),
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
        `,
        [
          q('Why serialise the whole Pipeline rather than just the fitted classifier?', [
            'A bare classifier cannot be pickled on its own',
            'Pipelines compress better on disk',
            'Otherwise the serving code must re-implement every transformation, and the day the two implementations drift apart the predictions go quietly wrong',
            'Because a bare classifier loses its random_state',
          ], 2, 'Shipping the transformations with the model leaves exactly one code path from raw input to prediction.'),
          q('You load an artifact built on scikit-learn 1.4 into a 1.7 environment. What does scikit-learn do?', [
            'Refuses to load it and raises an error',
            'Emits an InconsistentVersionWarning and loads an object that may work, may behave differently, or may crash on the first predict',
            'Silently migrates the object to the new version',
            'Loads it only if the pipeline contains no custom transformers',
          ], 1, 'The mismatch is a warning rather than an error, which is why the service should compare the manifest against the running version itself.'),
          q('Why is a single model.pkl, overwritten on every training run, a problem?', [
            'Pickle files cannot be safely overwritten in place',
            'joblib requires a unique filename per estimator type',
            'Repeated writes eventually corrupt the compression',
            'You can no longer answer which model scored a given customer in March, and rollback becomes a retraining run instead of a config change',
          ], 3, 'Immutable dated versions are what make prediction logs auditable and rollbacks cheap.'),
        ]
      ),
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
        `,
        [
          q('Why does reindex(columns=FEATURES) belong in the predict handler?', [
            'It pins the column set and order against the manifest, so a payload whose keys arrive in a different order cannot feed one value into another column\'s slot',
            'It converts the payload to the dtypes the model expects',
            'It is required for predict_proba to return two columns',
            'It removes rows containing nulls before scoring',
          ], 0, 'A misordered frame produces no exception at all — just wrong numbers — so the ordering has to be asserted explicitly.'),
          q('Why expose a list endpoint instead of letting callers make 500 single-row requests?', [
            'FastAPI limits how many concurrent requests a worker may handle',
            'predict_proba cannot score a single row',
            'One predict_proba call over 500 rows is roughly fifty times faster, because per-call frame construction and pipeline dispatch dwarf the arithmetic',
            'The manifest stores a fixed batch size that must be respected',
          ], 2, 'The fixed overhead per call, not the model itself, dominates the cost of scoring one row at a time.'),
          q('days_since_login is computed in the training SQL in UTC and in the service against local server time. What is the failure mode?', [
            'The service raises a timezone error on the first request',
            'Training–serving skew: nothing errors, and the live score simply drifts a few points below what was measured',
            'The pipeline drops the column as unseen',
            'Pydantic rejects the request with a 422',
          ], 1, 'Anything computed twice will eventually be computed differently, and the resulting damage is silent — which is why the calculation belongs in one shared module.'),
        ]
      ),
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
        `,
        [
          q('A feature reports PSI of 0.31 against the training reference. How do you read that?', [
            'Stable — anything below 0.5 is normal variation',
            'The feature has been dropped from the payload entirely',
            'A material shift: expect degraded performance and go and look at the upstream source',
            'The model was retrained too recently for the statistic to be valid',
          ], 2, 'Above 0.25 the live distribution no longer resembles what the model was fitted on, which reliably precedes a drop in performance.'),
          q('Which signal moves first when an upstream feature job starts emitting nulls?', [
            'Prediction drift — the mean predicted probability shifts within the hour, long before any label matures',
            'Live PR-AUC, because labels are produced at prediction time',
            'The unseen-category rate, which applies only to numeric columns',
            'None of them — nulls raise an exception in the service',
          ], 0, 'Prediction drift is one number available immediately, whereas performance waits on labels that may take weeks.'),
          q('Why track the unseen-category rate as a metric of its own?', [
            'Because OneHotEncoder raises on unknown categories and the count explains the errors',
            'Because PSI cannot be computed on categorical features',
            'Because unseen categories are almost always a sign of fraud',
            'Because handle_unknown="ignore" encodes them as all zeros, so a supplier renaming every region code degrades predictions without moving any metric you already have',
          ], 3, 'The setting that stops unknown values from crashing the service is exactly what makes their arrival invisible.'),
        ]
      ),
        lesson('Packaging the Service: Pinned Images and the Threads Bug', 13, `
The artifact from lesson one is only reproducible if the environment around it is. That means an image built from an exact lockfile — and, the part that catches nearly everyone, explicit control over how many threads the numeric libraries start.

### Pin exactly, not loosely

A pickle reconstructs by importing the classes it names, against whatever version happens to be installed. \`scikit-learn>=1.4\` therefore means "this image may load your artifact differently next Tuesday". Compile a lockfile and install from that alone:

\`\`\`bash
pip install pip-tools
pip-compile --generate-hashes -o requirements.lock requirements.in
\`\`\`

Keep training-only packages — matplotlib, shap, jupyter — out of the serving lockfile. They add hundreds of megabytes and a much wider vulnerability surface to a container that never draws a plot.

### A serving image

\`\`\`dockerfile
FROM python:3.12-slim AS build
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY requirements.lock .
RUN pip install --no-cache-dir --require-hashes -r requirements.lock

FROM python:3.12-slim
COPY --from=build /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH" \\
    OMP_NUM_THREADS=1 \\
    OPENBLAS_NUM_THREADS=1 \\
    MKL_NUM_THREADS=1 \\
    PYTHONUNBUFFERED=1 \\
    MODEL_VERSION=churn-2026-08-20-a
WORKDIR /app
COPY app.py features.py ./
COPY artifacts/ ./artifacts/
RUN useradd --create-home svc && chown -R svc /app
USER svc
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=3s CMD \\
    python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
\`\`\`

The build stage keeps compilers out of the runtime image. \`MODEL_VERSION\` as an environment variable is what makes a rollback a redeploy of the same image with a different value.

### The threads bug

NumPy, SciPy, and scikit-learn sit on BLAS and OpenMP, which by default start **one thread per visible core**. Run four uvicorn workers on an eight-core box and you get four processes opening eight threads each: 32 threads for 8 cores. Throughput does not improve — it gets worse, because the cores spend their time context-switching, and tail latency roughly doubles under exactly the load you cared about.

For a serving process the answer is one thread per worker, with parallelism coming from processes:

| Setting | Serving | Nightly batch scoring |
|---|---|---|
| \`OMP_NUM_THREADS\` | 1 | number of cores |
| Web workers | cores, or cores + 1 | 1 |
| \`n_jobs\` on the estimator | 1 | −1 |

A \`RandomForestClassifier\` pickled with \`n_jobs=-1\` carries that setting into the service and recreates the same storm. Call \`model.set_params(n_jobs=1)\` after loading, or dump it with \`n_jobs=1\` in the first place.

**The subtle part:** these variables are read when the threading libraries are first imported. Setting \`os.environ["OMP_NUM_THREADS"] = "1"\` at the top of \`app.py\`, below \`import numpy\`, does nothing whatsoever — and it looks like it should work. Put them in the image, the compose file, or the pod spec, never in application code.

### Size the container from measurement

Each worker holds its own copy of the pipeline, and a 500-tree forest can run to several hundred megabytes. Four workers is four copies, plus per-request frame allocations. Measure before choosing a limit:

\`\`\`python
import resource
print(resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 1e6, "MB")
\`\`\`

Set the memory limit above workers × peak RSS with headroom. Too tight and the OOM killer restarts a worker mid-request under load, which surfaces as intermittent 502s that no application log explains.

### Before you call it done

- \`/health\` returns the model version, so a deploy is verifiable from outside the container.
- The image is tagged with the git sha, never \`latest\`.
- One warm-up \`predict\` runs at startup, so the first real caller does not pay for lazy imports.
- The artifact is baked into the image or pulled once at startup — never fetched per request.
        `,
        [
          q('Four uvicorn workers run on an eight-core box, each with the default BLAS thread count. What happens under load?', [
            'Throughput scales linearly with the number of workers',
            'Roughly 32 threads contend for 8 cores, so the CPU saturates on context switching and tail latency gets worse',
            'The workers automatically share a single thread pool',
            'The container runs out of memory before threading matters',
          ], 1, 'Each process opens one thread per visible core, so oversubscription multiplies with the worker count instead of adding throughput.'),
          q('You set os.environ["OMP_NUM_THREADS"] = "1" at the top of app.py, just after importing numpy, and nothing changes. Why?', [
            'The variable name is wrong for scikit-learn',
            'It has to be set to "0" to disable threading',
            'uvicorn overrides the environment separately for each worker',
            'The threading libraries read the variable when they are first imported, so it must be set before the import — in the image or the process environment',
          ], 3, 'By the time numpy has been imported the thread pool already exists, so a later assignment has nothing left to influence.'),
          q('Why pin dependencies to an exact lockfile rather than scikit-learn>=1.4?', [
            'A pickled pipeline reconstructs against whatever version is installed, so a floating dependency can change or break the artifact between two builds of the same image',
            'Because pip installs faster from pinned versions',
            'Because scikit-learn does not support version ranges',
            'Because the lockfile is required by the HEALTHCHECK instruction',
          ], 0, 'The artifact stores object state and import paths, not code, so the installed library version is part of the model\'s behaviour.'),
        ]
      ),
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
        `,
        [
          q('What does sorting the error frame by per-row log loss surface that a confusion matrix cannot?', [
            'The overall precision and recall of the model',
            'Which hyperparameter to tune next',
            'The rows the model got confidently wrong — where mislabelled data and parsing bugs live',
            'The calibration curve across probability buckets',
          ], 2, 'Log loss weights a mistake by how sure the model was, so the top of that sort is where the data itself is usually broken.'),
          q('Why does slice_report skip groups with fewer than 200 rows?', [
            'Because pandas groupby cannot aggregate groups that small',
            'A recall of 0.25 measured on twelve rows is noise, and chasing it wastes a week',
            'Because small slices are always the result of leakage',
            'Because precision is mathematically undefined below 200 rows',
          ], 1, 'Tiny slices produce dramatic-looking metrics that are pure sampling variation, not findings.'),
          q('Rows the model scored between 0.8 and 0.9 turn out positive 55% of the time. What is the diagnosis?', [
            'The model is overfitting and needs stronger regularisation',
            'The decision threshold should be moved to 0.55',
            'The test set is too small to bucket at all',
            'The model is poorly calibrated — its ranking may be perfectly good, but the probabilities do not mean what they say',
          ], 3, 'Bucketing predictions against observed rates is a calibration check, and it is independent of how well the model ranks.'),
        ]
      ),
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
        `,
        [
          q('A feature shows a permutation importance mean of 0.004 with a standard deviation of 0.006. How do you read it?', [
            'Indistinguishable from noise, wherever it happens to sit in the sorted table',
            'A strong effect, since the mean drop is positive',
            'Evidence that the importances were computed on training data',
            'A signal that the feature should be dropped from the model',
          ], 0, 'When the spread across repeats is larger than the mean drop, the measured effect is not separable from random variation.'),
          q('ICE curves for one feature fan out in opposite directions while the average partial dependence line stays flat. What does that mean?', [
            'The feature has no effect on the prediction at all',
            'The model needs recalibration before the plot is valid',
            'The effect depends on other features — an interaction that averaging hides',
            'The partial dependence was computed on too few rows',
          ], 2, 'A flat average over rows that move in opposite directions is the classic signature of an interaction.'),
          q('Which statement can you actually defend from "income contributed +0.12 to this SHAP explanation"?', [
            'Raising this customer\'s income by one unit would reduce their risk by 0.12',
            'Given this feature set and this fitted model, income pushed this particular prediction up by 0.12',
            'Income is the most important feature in the dataset',
            'Income accounts for 12% of the outcome',
          ], 1, 'SHAP decomposes the model\'s arithmetic for one row, which is a statement about the model rather than about the world.'),
        ]
      ),
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
        `,
        [
          q('Why assert the dtype kind through infer_dtype rather than comparing the exact dtype string?', [
            'Because infer_dtype is faster on wide frames',
            'Because exact dtypes cannot be compared with ==',
            'Because dtype strings are not stable across machines',
            'Because a pandas upgrade can store text as str where it used to be object, and that is a library change rather than a data defect',
          ], 3, 'Asserting the kind lets the test fail on real schema drift while ignoring representation changes that harm nothing.'),
          q('What does the test that shuffles a row\'s column order actually guard against?', [
            'The production bug where a payload arriving with its keys in a different order feeds values into the wrong columns',
            'Overfitting to the order of rows in the training set',
            'Leakage between the train and test splits',
            'Unseen categories crashing the encoder at inference',
          ], 0, 'It is a permanent regression test for the column-order failure, which produces wrong numbers rather than an exception.'),
          q('Your schema check runs only in the CI test suite. What does it fail to protect?', [
            'Nothing — CI runs on every commit, which covers it',
            'The 3am production batch, where the upstream table changes with no test watching — the same module has to be imported by the ingestion job',
            'The unit tests, which cannot import pandas',
            'The golden set, which is regenerated nightly',
          ], 1, 'Data defects arrive with data, not with commits, so validation has to run wherever data enters the system.'),
        ]
      ),
        lesson('When the Model Will Not Learn: A Triage', 13, `
Error analysis assumes the model works and you are improving it. This is the other case: the score sits at the baseline, or the loss will not fall, and nothing has raised an exception. Work the checks in order — the cheap ones eliminate the common causes first.

### 1. Can it overfit fifty rows?

The single most informative test in modelling:

\`\`\`python
from sklearn.base import clone

tiny_X, tiny_y = X_train.iloc[:50], y_train.iloc[:50]
m = clone(pipeline).fit(tiny_X, tiny_y)
print(m.score(tiny_X, tiny_y))        # should be at or very near 1.0
\`\`\`

A model with any real capacity **must** be able to memorise fifty rows. If it cannot, the problem is not tuning, data volume, or feature engineering — it is a wiring bug: labels misaligned with rows, a transformer emitting constants, the target quietly dropped, or a metric pointing the wrong way. Stop and find it. Running a hyperparameter search at this stage can burn a week for nothing.

### 2. Is \`y\` still lined up with \`X\`?

The classic silent defect. A \`reset_index\`, a \`sort_values\`, or a filter applied to one and not the other breaks the correspondence, and nothing complains:

\`\`\`python
assert len(X) == len(y)
assert (X.index == y.index).all()          # pandas objects
print(y.value_counts(normalize=True))      # is the prevalence what you expect?
\`\`\`

Shuffling the target deliberately is the confirming test. Fit on \`y.sample(frac=1, random_state=0).to_numpy()\` and the score should collapse to the baseline. If it does not, your pipeline is scoring something other than what you think — usually an index-aligned join that reordered a column behind your back.

### 3. Do the features survive the pipeline?

\`\`\`python
import numpy as np

Xt = np.asarray(pipeline[:-1].fit_transform(X_train, y_train))   # dense output
print(Xt.shape)
print(np.isnan(Xt).mean().round(3), np.abs(Xt).max())
print((Xt.std(axis=0) == 0).sum(), "constant columns")
\`\`\`

Three things to catch here: a \`ColumnTransformer\` with \`remainder="drop"\` and a typo in a column name, so half your features never arrive; an imputer producing all-NaN output because a column was empty in this fold; and constant columns, which contribute nothing and usually mean an upstream filter emptied a category.

### 4. Is the target what you believe it is?

Print the class balance, or the distribution for regression. A target that is 0.02% positive needs a different framing, not a different model. A heavy-tailed regression target may need a log transform before anything fits. And a "churn" label built from a 7-day window while the features describe a 90-day one is simply not learnable — no algorithm will tell you so.

### 5. Is the metric pointing the right way?

\`make_scorer(mean_absolute_error)\` without \`greater_is_better=False\` makes the search *maximise* error, and it will faithfully hand back the worst model it found:

\`\`\`python
from sklearn.metrics import make_scorer, mean_absolute_error

mae = make_scorer(mean_absolute_error, greater_is_better=False)   # note the flag
\`\`\`

The symptom is distinctive: the "best" parameters are the most extreme values in your grid, and the reported score is negative or otherwise implausible.

### 6. Only now, capacity and signal

If all five checks pass and the score still sits at the baseline, one of two things is true. Either the model is too constrained — increase depth, lower regularisation, add interactions, and watch the *train* score move — or **the features genuinely do not contain the answer**. A train score that also refuses to rise is the second case, and no algorithm change fixes it. That is the point at which the work is finding a new data source, and it is a legitimate finding to report rather than a failure to conceal.

### The order is the method

Every one of these is faster than a hyperparameter search, and each rules out a cause that a search would never reveal. Run them top to bottom before tuning anything, and keep checks 1 and 2 as permanent tests — the previous lesson's pattern — so that a future refactor cannot reintroduce them in silence.
        `,
        [
          q('Your pipeline cannot reach near-perfect training accuracy on fifty rows. What does that tell you?', [
            'The model needs more training data before it can fit anything',
            'There is a wiring bug — misaligned labels, dropped columns, or a metric pointing the wrong way — and tuning will not fix it',
            'The learning rate is set too low',
            'Fifty rows are unrepresentative, so the test says nothing',
          ], 1, 'Any model with real capacity can memorise fifty rows, so a failure here is mechanical rather than statistical.'),
          q('You shuffle y, refit, and the score stays high. What does that indicate?', [
            'The model is robust to label noise, which is a good sign',
            'The shuffle was accidentally applied to the test set instead',
            'The features are strong enough to overcome the noise',
            'The pipeline is not scoring what you think it is — the target and the rows are no longer aligned',
          ], 3, 'A shuffled target destroys all real signal, so a surviving score means the evaluation is reading something other than the intended labels.'),
          q('A randomised search reports that the best parameters are the most extreme values in every range, with an implausible score. What do you check first?', [
            'The scorer direction — make_scorer on an error metric without greater_is_better=False makes the search maximise error',
            'The number of cross-validation folds',
            'Whether the estimator supports n_jobs=-1',
            'The size of the held-out test set',
          ], 0, 'A sign-flipped scorer turns the search into a hunt for the worst model, and extreme winning parameters are its signature.'),
        ]
      ),
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
      chapter(
      'Time Series: Backtesting, Lags, and Regime Change',
      'What changes once rows arrive in an order, from the backtest that replaces cross-validation to the features you are actually allowed to compute at prediction time.',
      [
      lesson('Walk-Forward Backtesting and the Gap You Must Leave', 13, `
A demand model scored 0.91 R² under \`KFold(n_splits=5, shuffle=True)\`. It shipped on a Monday and was 40% out by Wednesday. Nothing threw. The evaluation had simply trained on August and tested on July, and a model that has already seen next month can interpolate this month without learning anything at all.

Once rows carry a timestamp, every fold has to train on the past and score the future. That one rule invalidates most of how you split data in Chapter 4.

### Expanding windows with TimeSeriesSplit

\`\`\`python
import pandas as pd
from sklearn.model_selection import TimeSeriesSplit
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.metrics import mean_absolute_error

df = pd.read_csv("sales_daily.csv", parse_dates=["date"]).sort_values("date")
X, y = df.drop(columns=["date", "units"]), df["units"]

cv = TimeSeriesSplit(n_splits=6, test_size=28, gap=14)
for k, (tr, te) in enumerate(cv.split(X)):
    m = HistGradientBoostingRegressor(random_state=42).fit(X.iloc[tr], y.iloc[tr])
    mae = mean_absolute_error(y.iloc[te], m.predict(X.iloc[te]))
    print(k, df.date.iloc[te[0]].date(), round(mae, 2))
\`\`\`

Each fold trains on everything before a cut, scores the 28 days after it, then moves the cut forward. Six folds, six honest numbers, each one a rehearsal of the deployment you are about to do.

Sorting matters more than it looks. \`TimeSeriesSplit\` splits on row position, not on the timestamp, so an unsorted frame produces folds that look chronological and are not.

### The gap is not optional

\`gap=14\` holds fourteen rows back between the end of training and the start of the test window. People delete it because it costs data. Here is what it buys.

Say the label is "units sold over the next 14 days". The label for the row dated 3 March is only fully known on 17 March. Train right up to 3 March, test from 4 March, and your late February training rows carry labels built from the very days the test fold is scoring. The overlap is small, the leak is real, and the backtest reads two or three points high through every round of tuning you then do.

The gap has to cover the whole delay:

| Source of overlap | What it adds |
|---|---|
| Label window (units over the next 14 days) | 14 days |
| Label maturation (returns settle after 30 days) | 30 days |
| Feature availability lag | 0, that belongs in the feature definition |

Take the longest label span and set the gap there. In finance the same idea is called an embargo.

### Sliding versus expanding

\`max_train_size\` turns the expanding window into a sliding one:

\`\`\`python
cv = TimeSeriesSplit(n_splits=6, test_size=28, gap=14, max_train_size=730)
\`\`\`

Two years of history, dropping the oldest day as each new one arrives. Which is right is an empirical question, and topic four measures it rather than guessing.

### Read the folds, never just the mean

The average of six fold scores hides the thing you most need to see. Print them:

\`\`\`text
0 2024-03-04   6.11
1 2024-04-01   6.40
2 2024-04-29   5.98
3 2024-05-27   6.22
4 2024-06-24  11.87
5 2024-07-22   6.05
\`\`\`

Fold 4 is not noise. Something happened in late June, and the mean of 7.10 makes it invisible. Time ordered folds are not exchangeable the way stratified folds are, so the standard deviation you learned to quote in Chapter 4 does not carry the same meaning here. Read the sequence, in order, and go and find out what fold 4 lived through.

### The final test set is the most recent block

Cut the last 8 to 12 weeks off before you start, tune on walk-forward folds inside what remains, and score that block exactly once. A randomly sampled test set on ordered data is not a test set. It is a more expensive training set.
      `,
        [
          q('Your label is units sold over the next 14 days and you set gap=0 in TimeSeriesSplit. What is the consequence?', [
            'Nothing, because TimeSeriesSplit already trains only on rows earlier than the test fold',
            'The final training rows carry labels built from days inside the test window, so every fold reads high',
            'The folds come out unequal in size, which makes the mean score unstable',
            'The model trains on fewer rows than it should, so the backtest reads low',
          ], 1, 'A label that spans 14 forward days is not knowable until those days have happened, so training rows near the cut are built from the same period the test fold is scoring.'),
          q('Five walk-forward folds sit near 6.1 MAE and the fourth returns 11.87. What is the right response?', [
            'Report the mean of 7.10, since a single fold is a small sample',
            'Drop the outlier fold and rerun the hyperparameter search on the other five',
            'Go and find what happened in that window, because time ordered folds are not exchangeable',
            'Raise n_splits until the spread between the folds disappears',
          ], 2, 'Each fold covers a specific period rather than a random sample, so a single bad fold is evidence about a real event rather than sampling noise to be averaged away.'),
          q('You hand a frame that was never sorted by date to TimeSeriesSplit. What goes wrong?', [
            'It raises a ValueError complaining that the timestamps are not monotonic',
            'It sorts the frame internally first, so the folds are unaffected',
            'Only the gap parameter misbehaves, while the folds stay chronological',
            'It splits on row position, so folds that look chronological mix future rows into training',
          ], 3, 'TimeSeriesSplit knows nothing about your date column and simply cuts the index in order, so ordering the frame yourself is what makes the split honest.'),
        ]
      ),
      lesson('Lag, Rolling, and Point-in-Time Correct Features', 14, `
A churn model backtested at 0.94 ROC-AUC and came back at 0.61 in its first live month. One column did it: \`account_status\`, read from a warehouse table that is updated in place. Every historical row said \`cancelled\` for customers who had since cancelled, including the ones who were perfectly healthy on the date being scored. The backtest was reading the answer off a feature.

Point-in-time correctness is one question asked of every column. On the date this row is scored, would this exact value have been knowable? Get it wrong and no split, gap or metric saves you.

### Shift before you roll

\`\`\`python
df = df.sort_values(["store_id", "date"])
g = df.groupby("store_id", group_keys=False)["units"]

df["units_lag_1"]  = g.shift(1)
df["units_ma_7"]   = g.shift(1).rolling(7, min_periods=7).mean()
df["units_std_28"] = g.shift(1).rolling(28, min_periods=20).std()
\`\`\`

The broken version drops one call:

\`\`\`python
df["units_ma_7"] = g.rolling(7).mean().values   # includes today
\`\`\`

A seven day mean that contains today's units leaks the target straight into a feature built to predict today's units. The symptom is an implausibly good score plus a permutation importance chart where the rolling mean towers over everything else. \`center=True\` is the same bug with a wider blast radius, because it reaches three days into the future.

\`min_periods\` matters at the start of every group. Leave it at 1 and a store's first day gets a "seven day mean" computed from a single observation, which the model happily learns to trust.

### Group before you shift

\`shift(1)\` on a frame sorted by date but not grouped by store pulls the previous store's last row into the next store's first row. It is silent, it corrupts one row per group, and across 4,000 stores that is 4,000 rows of nonsense sitting in your training set.

### Availability, not just ordering

A value existing yesterday does not mean you had it. Scoring runs at 06:00, the point of sale feed lands at 09:00.

| Feature | Arrives | Usable at 06:00 on day D |
|---|---|---|
| units sold on D minus 1 | 09:00 on D | No, use D minus 2 |
| shelf price in effect on D | set D minus 7 | Yes |
| competitor price scrape | 04:00 daily | Yes |
| returns against D minus 1 | settles D plus 30 | No |

Write that table for your own columns before you write the SQL. It is the difference between a backtest and a fantasy.

### As-of joins for anything that changes

For attributes with a history, join the version that was current on the row's own date:

\`\`\`python
prices = prices.sort_values("effective_from")
df = pd.merge_asof(
    df.sort_values("date"), prices,
    left_on="date", right_on="effective_from",
    by="store_id", direction="backward",
)
\`\`\`

\`direction="backward"\` is the whole point. Take the most recent price that took effect at or before this date, never one that starts tomorrow. A plain \`merge\` on \`store_id\` cheerfully attaches today's price to a row from eighteen months ago.

### The test that catches the whole class

\`\`\`python
def rebuild_as_of(cutoff):
    feats = build_features(raw[raw.date <= cutoff])
    return feats[feats.date == cutoff].reset_index(drop=True)

pd.testing.assert_frame_equal(
    rebuild_as_of("2024-05-14"),
    stored_features.query("date == '2024-05-14'").reset_index(drop=True),
    check_like=True,
)
\`\`\`

Rebuild one past day's features using only rows up to that day, then compare against what your pipeline actually stored. Any column that depends on the future will differ, and the diff names it for you. Run it on three dates in CI, the pattern from Chapter 7, and this entire family of bug stops being possible.
      `,
        [
          q('A feature is built as df.groupby(\'store_id\')[\'units\'].rolling(7).mean() and used to predict units on the same day. What is the effect?', [
            'The window includes today\'s units, so the target leaks straight into the feature',
            'The first six rows of each store become null and are dropped from training',
            'The rolling window silently reaches back into the previous store\'s rows',
            'Nothing, because an average over seven values cannot reveal any one of them',
          ], 0, 'Without a shift, the window\'s last observation is the very value being predicted, so the feature carries the answer and the backtest score becomes meaningless.'),
          q('Why does merge_asof need direction=\'backward\' when joining a price history onto dated rows?', [
            'Backward joins are faster once both frames are sorted by the join key',
            'It takes the price in effect at or before the row\'s date, never one that starts later',
            'It is the only direction that supports the by argument for grouping by store',
            'It fills any missing price with the group average rather than leaving a null',
          ], 1, 'A backward as-of join picks the most recent version that had already taken effect, which is exactly the point-in-time value the row would have been scored with.'),
          q('Which check catches a feature read from a warehouse column that is overwritten in place?', [
            'A PSI monitor comparing the live feature distribution against training',
            'Widening the gap between the training and test portions of every fold',
            'Rebuilding one past day\'s features from rows up to that day and diffing against what was stored',
            'Adding min_periods to every rolling window in the feature job',
          ], 2, 'An overwritten column matches today\'s truth rather than that day\'s truth, so a rebuild restricted to rows up to the cutoff produces a different value and the diff names the offending column.'),
        ]
      ),
      lesson('Forecast Horizons: Recursive, Direct, and the Baseline That Wins', 13, `
Across 40 stores, a tuned gradient boosting forecaster beat a seasonal naive rule on 13 of them. The team had spent six weeks on it. Nobody ran the baseline first, and the baseline was "units on the same weekday last week".

Purchase orders are placed on Monday and arrive fourteen days later, so the horizon is 14, not 1. A model evaluated one step ahead and then deployed fourteen steps ahead is a different model measured on a different problem, and it always looks better in the notebook than on the ledger.

### Fix the horizon to the decision

Write the horizon down before touching the data. How far ahead must the number be, and how often is the decision taken? Lead time 14 days, reordering weekly, means you need days 14 through 20 from every Monday. That is a seven day window at horizons 14 to 20.

### Recursive: cheap, and it drifts

Train one model at horizon 1 and feed its own output back as the newest lag:

\`\`\`python
hist = list(y_train[-28:])
preds = []
for step in range(14):
    x = make_features(hist)      # lag_1, lag_7, rolling means
    p = model.predict([x])[0]
    preds.append(p)
    hist.append(p)               # the prediction becomes an input
\`\`\`

Two problems, and only the first is famous. Errors compound, so a 3% miss at step one is an input at step two. The subtler one is distribution shift inside your own model: at training time \`lag_1\` was always a measured value, but by step five it is a prediction of a prediction, smoother and less variable than anything seen during fitting. That is why recursive forecasts flatten toward the mean as the horizon grows.

### Direct: one model per horizon

Shift the target instead and fit a separate estimator per step:

\`\`\`python
models = {}
for h in range(14, 21):
    yh = df.groupby("store_id")["units"].shift(-h)   # target h days ahead
    ok = yh.notna()
    models[h] = HistGradientBoostingRegressor(random_state=42).fit(X[ok], yh[ok])
\`\`\`

No compounding, and each model learns the relationship at its own distance. Day 20 genuinely is harder than day 14, and a direct model is permitted to say so.

| | Recursive | Direct |
|---|---|---|
| Artifacts to maintain | 1 | one per horizon |
| Error accumulation | Yes | No |
| Known future covariates | Awkward | Natural |
| Best for | short horizons, tight budgets | horizons tied to a decision |

Start direct at the horizon that matters, and add the rest only if somebody needs the curve.

### The baseline that wins more often than anyone expects

\`\`\`python
season, h = 7, 14
lag = h + (-h % season)          # smallest multiple of 7 at or beyond h, so 14
df["naive"] = df.groupby("store_id")["units"].shift(lag)

def mase(y_true, y_pred, y_naive):
    return mean_absolute_error(y_true, y_pred) / mean_absolute_error(y_true, y_naive)
\`\`\`

MASE below 1 means you beat the baseline. Above 1 means six weeks of work made things worse, and the honest move is to ship the naive rule and go and find better data.

Report MASE per series, not pooled. A pooled MAE is dominated by the highest volume stores, so a model that wins on aggregate can be losing on 60% of the individual series you actually place orders for.

### Intermittent demand breaks the loss function

A spare part that sells on 40 days out of 365 defeats MAE-driven training outright. The constant forecast that minimises absolute error is close to zero, so the model predicts near zero forever, MAE looks superb, and every stockout is invisible to your metric. Score those series on the quantity that matters, such as fill rate or the pinball loss at the service level you promise, and let the metric follow the decision rather than the other way round.
      `,
        [
          q('A recursive forecast is accurate at step 1 but flattens toward the series mean by step 10. What explains the flattening beyond compounding error?', [
            'Later steps feed the model predicted lags, which are smoother than the measured lags it was fitted on',
            'The estimator was regularised too heavily, which shrinks every prediction toward the mean',
            'The seasonal component was subtracted from the target before the model was fitted',
            'The horizon is longer than the rolling windows used to build the input features',
          ], 0, 'Predictions of predictions have far less variance than real observations, so by step 10 the model is extrapolating from inputs unlike anything in its training distribution.'),
          q('What do you give up by fitting a separate direct model for each of horizons 14 through 20?', [
            'The ability to use known future covariates such as a planned promotion date',
            'Any protection against errors compounding as the horizon grows longer',
            'The option of scoring the forecasts against a seasonal naive baseline',
            'Seven artifacts to train and version, with no guarantee the seven predictions agree',
          ], 3, 'Direct forecasting removes error accumulation but multiplies the number of models you must fit, monitor and version, and nothing ties their outputs into a coherent curve.'),
          q('Your model\'s pooled MAE beats the seasonal naive baseline, yet stores keep running out of stock. What should you check first?', [
            'Whether the naive baseline was computed on training rows instead of test rows',
            'Per-series MASE, since a pooled error is dominated by the highest volume stores',
            'Whether the horizon was set to 1 rather than the 14 day purchase lead time',
            'Whether the rolling features were shifted before their means were taken',
          ], 1, 'Pooling weights each store by its volume, so a win on a handful of large stores can hide losses on the many small ones that generate the stockouts.'),
        ]
      ),
      lesson('Non-Stationarity: Recency Weighting and Rolling Retrains', 14, `
A delivery ETA model held 4.2 minutes MAE for eleven months. In June the fulfilment centre moved eight miles north. MAE hit 11.6 minutes on the Monday and stayed there for five weeks, because retraining was quarterly and nobody had wired a trigger. The model was not wrong about the world it had learned. The world moved.

### Two different failures wearing one name

**Covariate shift**: P(X) moves, the mapping holds. More orders from a new postcode, but distance still predicts time the way it always did. A model with decent coverage of that region survives it.

**Concept drift**: P(y given X) moves. The same distance now takes twice as long. Nothing about the input distribution has to change for this to happen, which means every input drift monitor from Chapter 6 can read green while the model quietly stops working. Matured performance, not PSI, is the signal that decides a retrain.

### Recency weighting instead of deletion

Weight training rows by age rather than throwing the old ones away:

\`\`\`python
import numpy as np

age_days = (df["date"].max() - df["date"]).dt.days.to_numpy()
half_life = 90
w = 0.5 ** (age_days / half_life)

model.fit(X_train, y_train, sample_weight=w[train_idx])
\`\`\`

A 90 day half life leaves a row from a year ago at about 6% of yesterday's weight while still keeping the seasonal pattern it carries. Half life is a hyperparameter, and the only way to set it is the walk-forward backtest from topic one:

| Half life | Walk-forward MAE | Note |
|---|---|---|
| none, uniform | 6.41 | adapts slowest |
| 180 days | 6.02 | |
| 90 days | 5.88 | best here |
| 30 days | 6.55 | never saw last December |

Notice the shape. It is a U, not a slope. Aggressive forgetting wins on a stable series and loses badly on a seasonal one, because a 30 day effective window has no December in it at all.

One trap worth naming: weight the training rows, then score the backtest unweighted on the most recent window. Put the same weights into the evaluation and you have tuned the exam to agree with the candidate.

### Sliding or expanding, decided by measurement

Same experiment, different axis. Run \`max_train_size\` at 365, 730 and unlimited across identical folds. Long windows win on slow moving problems, short windows win after a structural break, and the answer changes whenever the business does. Rerun it every rebuild.

### How stale is too stale

Freeze one model and score it at increasing distance from its training cut:

\`\`\`text
days since training    1     7    30    60    90
walk-forward MAE      5.8   5.9   6.3   7.1   8.6
\`\`\`

That curve is the retraining argument in numbers a finance team will accept. If the error becomes unacceptable by day 30, retrain fortnightly. If it is still flat at 90 days, monthly retraining is burning compute for nothing.

### Triggers, and the one that backfires

Use cadence as a floor, a trigger on matured performance, and an event trigger for changes you already know about: the depot move, a price rise, a new market. Then design around two failure modes.

An automatic retrain that fires on a bad week trains on the incident. A two day outage that produced impossible delivery times becomes signal, and the next model treats catastrophe as normal. Gate every automatic retrain behind the data validation run from Chapter 7, and carry an explicit anomaly flag column so the model can condition on the event instead of averaging it in.

The second is subtler. A model retrained on data its own decisions produced learns its own blind spots. If a slow ETA gets the order cancelled before dispatch, that row never produces a label, and next month's training set will tell you the model is more accurate than it is.
      `,
        [
          q('Delivery times double after a depot move while every input feature keeps the same distribution. What does that say about your drift monitors?', [
            'Input drift monitors cannot see it, because P(y given X) moved while P(X) did not',
            'PSI will cross 0.25 on the distance feature within a day of the move',
            'The monitors are broken, since genuine drift always shows in the inputs first',
            'Prediction drift catches it, because the mean predicted ETA shifts immediately',
          ], 0, 'Concept drift changes the relationship between features and target without touching the feature distribution, so only matured performance reveals it.'),
          q('A half life sweep gives 6.41 MAE with uniform weights, 5.88 at 90 days and 6.55 at 30 days. What does the 30 day result tell you?', [
            'The sweep used too few folds to separate the three settings reliably',
            'Recency weighting is harmful here and uniform weights should be restored',
            'Forgetting too fast costs you the seasonal pattern the older rows carried',
            'The 30 day model needs a larger max_train_size to compensate for the decay',
          ], 2, 'The curve is U shaped because a short effective window adapts quickly but contains no example of last year\'s seasonal peaks.'),
          q('A retrain fires automatically whenever weekly MAE crosses a threshold, and a two day outage produced impossible delivery times. What happens?', [
            'The trigger is suppressed, because outage rows fail the schema check by default',
            'The retrain shortens the effective half life and recovers faster than a scheduled one',
            'The new model scores worse on the backtest, so the trigger declines to promote it',
            'The retrain fits on the incident, so the outage becomes signal in the next model',
          ], 3, 'A performance trigger fires precisely when the recent data is most contaminated, which is why an automatic retrain needs a validation gate and an anomaly flag in front of it.'),
        ]
      ),
      ],
      [
      q('A model predicts whether an account churns within the next 30 days, and the walk-forward split uses gap=0. What is the consequence?', [
        'The last 30 days of training carry labels formed inside the test window, inflating every fold',
        'Each test fold loses 30 rows, which makes the mean fold score unstable',
        'The model cannot use lag features, because those require a gap to be defined',
        'Only the first fold is affected, since later folds have more training history',
      ], 0, 'The gap has to be at least as long as the label window, otherwise the rows nearest the cut were labelled using the same days the fold is being scored on.'),
      q('Which number tells you whether six weeks of forecasting work is worth shipping on a weekly seasonal series?', [
        'The R² of the fitted model on the most recent walk-forward fold',
        'MASE per series against a seasonal naive forecast at the same horizon',
        'The pooled MAE across every series compared with the previous model',
        'The gap between the training MAE and the walk-forward MAE',
      ], 1, 'Skill relative to the naive rule at the horizon you actually deploy is the only comparison that answers whether the model earned its complexity.'),
      q('Purchase orders arrive 14 days after they are placed. Which setup matches that decision?', [
        'A one step model, evaluated one step ahead and rolled forward at serving time',
        'A recursive model iterated 14 times, since it needs only a single artifact',
        'A direct model trained on the target shifted 14 days ahead of the features',
        'A one step model retrained daily so the horizon never exceeds a single day',
      ], 2, 'Shifting the target to the horizon the decision needs means the model is fitted and measured on the same problem it will be deployed against.'),
      q('Which feature definition is safe to use when predicting units sold on day D?', [
        'A seven day centred rolling mean of units, computed over the whole series',
        'The account status column exactly as it currently stands in the warehouse',
        'Yesterday\'s units, joined from a feed that lands three hours after scoring runs',
        'A seven day mean of units taken after shifting the series by one day per store',
      ], 3, 'Shifting within each group before the rolling window means every value in the average was already observed and already delivered by the time the row is scored.'),
      ]
    ),
    chapter(
      'Scaling It: Memory, Latency, and Cost',
      'Making a working model survive real volume, from data that will not fit in RAM to the price of a thousand predictions.',
      [
      lesson('Data That Will Not Fit: Dtypes, Sparse Matrices, and Chunks', 13, `
A 2.1 GB CSV of card transactions killed a 16 GB laptop. \`pd.read_csv\` reached about 70% and the kernel died. The file is 2.1 GB and the machine has 16 GB, so this looks unfair. It is not mysterious, it is arithmetic: pandas stores every bare integer as \`int64\`, every decimal as \`float64\`, and every string as a Python object pointer plus the string itself, then needs headroom while it builds the frame. Six times the file size is a normal multiplier.

### Measure before you shrink

\`\`\`python
import pandas as pd
df = pd.read_csv("transactions_2026.csv", nrows=200_000)
print((df.memory_usage(deep=True) / 1e6).sort_values(ascending=False))
\`\`\`

\`\`\`text
device_id            17.1
merchant_category    16.4
amount                1.6
ts                    1.6
zip                   1.6
is_fraud              1.6
\`\`\`

\`deep=True\` is the whole point. Without it, object columns report 8 bytes per row, the strings look free, and you go off optimising the float column that was never the problem.

### Dtypes, the cheapest win available

| Column | Default | Better | Bytes per row |
|---|---|---|---|
| \`amount\` | float64 | float32 | 8 to 4 |
| \`zip\` | int64 | int32 | 8 to 4 |
| \`is_fraud\` | int64 | int8 | 8 to 1 |
| \`merchant_category\`, 312 distinct | object | category | ~82 to 4 |

\`\`\`python
dtypes = {"amount": "float32", "zip": "int32",
          "is_fraud": "int8", "merchant_category": "category"}
df = pd.read_csv("transactions_2026.csv", dtype=dtypes,
                 usecols=list(dtypes) + ["ts"])
\`\`\`

The same 4.8M rows land at 1.1 GB instead of 13.9 GB. Note that \`usecols\` did as much work as \`dtype\` there. You almost never need all 60 columns.

One float32 caveat: it carries about 7 significant decimal digits. A price of 41.99 is safe. A running lifetime total that climbs past 10,000,000 is not, and it fails silently by rounding away the pence.

### Sparse, when dense is not merely large

One-hot encode a 12,000 value \`zip\` column across 4.8M rows and the dense float64 matrix wants 4.8e6 x 12000 x 8 bytes, which is 460 GB. Stored as CSR with one nonzero per row it is about 58 MB. Sparse here is not a tuning choice, it is the difference between running and not running.

\`\`\`python
from sklearn.preprocessing import OneHotEncoder
enc = OneHotEncoder(handle_unknown="infrequent_if_exist", sparse_output=True)
X = enc.fit_transform(df[["zip", "merchant_category"]])
print(X.shape, X.nnz)   # (4800000, 12312) 9600000
\`\`\`

Then the trap. One step that cannot take sparse input densifies everything behind it. \`StandardScaler()\` at least fails loudly, because centring means subtracting a mean from all those zeros and it raises rather than try. The quiet killer is an estimator that calls \`check_array\` without \`accept_sparse\`, converts your matrix on the spot, and asks the allocator for 460 GB. \`HistGradientBoostingClassifier\` does exactly that.

Sparse safe scaling is \`MaxAbsScaler\`, or \`StandardScaler(with_mean=False)\`. Sparse safe estimators include \`SGDClassifier\`, \`LogisticRegression(solver="saga")\`, \`LinearSVC\`, and LightGBM.

### Chunks, when even the shrunk frame will not fit

Stop trying to hold it.

\`\`\`python
from sklearn.linear_model import SGDClassifier
clf = SGDClassifier(loss="log_loss")
for chunk in pd.read_csv("transactions_2026.csv", chunksize=250_000, dtype=dtypes):
    Xc = enc.transform(chunk[["zip", "merchant_category"]])
    clf.partial_fit(Xc, chunk["is_fraud"], classes=[0, 1])
\`\`\`

Two details do the damage when you get them wrong. \`classes=\` must be supplied on the first \`partial_fit\` call, and forgetting it raises immediately. Worse is fitting the encoder inside the loop: every chunk then gets its own column layout, column 4,102 means a different zip in every batch, and the model trains happily on noise. Fit the encoder once on the distinct values, then only ever \`transform\`.

Convert to Parquet once and most of this evaporates: dtypes are stored in the file, columns are pruned at read time, and the 2.1 GB CSV becomes roughly 380 MB.

\`\`\`python
df.to_parquet("transactions_2026.parquet", compression="zstd")
pd.read_parquet("transactions_2026.parquet", columns=["amount", "zip", "is_fraud"])
\`\`\`
      `,
        [
          q('You one-hot encode a 12,000 value zip column into a sparse matrix, then feed it to a HistGradientBoostingClassifier in the same pipeline. What happens?', [
            'The classifier raises a clear error telling you sparse input is unsupported',
            'The pipeline runs normally because scikit-learn keeps the matrix sparse throughout',
            'The estimator converts the matrix to dense and asks the allocator for hundreds of gigabytes',
            'The zip column is silently dropped and training continues on the rest',
          ], 2, 'That estimator requires dense input, so it densifies whatever it is given, and 4.8M rows by 12,000 columns of float64 is roughly 460 GB rather than the 58 MB the sparse form occupied.'),
          q('A chunked partial_fit loop calls enc.fit_transform on the categorical columns inside the loop instead of transform. Training completes and the model scores badly. Why?', [
            'Each chunk gets its own column layout, so the same column index means a different category in every batch',
            'fit_transform resets the classifier weights on every call to partial_fit',
            'The encoder cannot be reused across calls, so the last chunk overwrites the others',
            'partial_fit requires a dense array and fit_transform returns a sparse one',
          ], 0, 'Fitting the encoder per chunk lets each batch define its own categories and widths, so the feature at a given index changes meaning between batches and the model learns from inconsistent inputs.'),
          q('You call df.memory_usage() without deep=True on a frame with two string columns and conclude memory is not the issue. What did the reading miss?', [
            'It reports compressed sizes rather than the in-memory footprint',
            'It excludes the index, which holds most of the frame\'s memory',
            'It counts only columns currently loaded rather than the whole frame',
            'Object columns report the pointer size per row, not the strings those pointers reference',
          ], 3, 'Without deep=True an object column reports 8 bytes per row for the pointer, hiding the actual Python string objects that usually dominate the frame.'),
        ]
      ),
      lesson('Where the Training Hours Actually Go', 13, `
The grid search had been running for nine hours and the progress log said 22%. Nobody had done the multiplication before starting it. Four values of \`max_depth\`, three of \`learning_rate\`, four of \`min_samples_leaf\`, six of \`max_features\` is 288 candidates. Five folds each. One fit takes 51 seconds.

\`\`\`text
288 x 5 x 51 s = 73,440 s = 20.4 hours, plus the final refit
\`\`\`

Thirty seconds of measurement would have shown that.

### Time one fit first, always

\`\`\`python
import time
t = time.perf_counter()
pipe.fit(X_train, y_train)
print(f"{time.perf_counter() - t:.1f}s")
\`\`\`

That number times candidates times folds is your search. If the answer is a weekend, redesign the search rather than starting it and hoping.

### Where the seconds actually go

| Model | Dominant cost | Grows with |
|---|---|---|
| \`LogisticRegression(saga)\` | solver iterations to convergence | conditioning of the matrix, badly if unscaled |
| \`RandomForest\` | building independent trees | \`n_estimators\` x n log n |
| \`HistGradientBoosting\` | binning once, then histogram sums | \`max_bins\` x n_features, nearly flat in rows |
| \`TfidfVectorizer\` | tokenising every document | n_documents, once per fit |

The first row surprises people. An unscaled logistic regression that takes 90 seconds often takes 4 seconds after a \`StandardScaler\`, because saga's iteration count depends on how badly conditioned the features are, not just their size. Scaling is a speed fix as much as an accuracy one.

### Do not refit what did not change

If your search only varies \`clf__C\`, the vectorizer is being rebuilt 1,440 times to produce the identical matrix. Cache it:

\`\`\`python
from sklearn.pipeline import Pipeline
pipe = Pipeline([("tfidf", TfidfVectorizer()), ("clf", LogisticRegression())],
                memory="/var/tmp/sk_cache")
\`\`\`

Transformer steps whose parameters and input are unchanged are loaded from disk. On the search above that alone took 20.4 hours down to 3.1, with byte identical results.

### Search smarter rather than longer

Random search beats grid search on the same budget because most hyperparameters barely matter, and a grid spends most of its points re-testing the ones that do not. Successive halving goes further: start every candidate on a slice of the rows, keep the best third, triple the rows, repeat.

\`\`\`python
from sklearn.experimental import enable_halving_search_cv  # noqa: F401
from sklearn.model_selection import HalvingRandomSearchCV
search = HalvingRandomSearchCV(pipe, param_dist, factor=3, resource="n_samples",
                               min_resources=20_000, cv=5, n_jobs=4, random_state=0)
\`\`\`

| Strategy | Wall clock | Best CV AUC |
|---|---|---|
| Full grid, 288 candidates | 20.4 h | 0.871 |
| Random, 60 draws | 4.3 h | 0.869 |
| Halving random, 120 draws | 1.2 h | 0.870 |

Nineteen extra hours bought 0.002 AUC, which sits inside the fold to fold noise you learned to measure in chapter 4. That is not a better model, that is a rounding error with an electricity bill.

### Stop putting the tree count in the grid

Boosting carries its own validation curve. Ask it once:

\`\`\`python
HistGradientBoostingClassifier(max_iter=2000, early_stopping=True,
                               validation_fraction=0.1, n_iter_no_change=25)
\`\`\`

A single fit finds the right number of iterations and stops. Putting \`max_iter\` in the grid with five values multiplies the entire search by five to discover something the model would have told you for free.

### The nested \`n_jobs\` trap

\`n_jobs=-1\` on the search and \`n_jobs=-1\` on a random forest is not eight parallel workers. It is eight processes each opening eight threads on an eight core box, and the search finishes slower than it would at \`n_jobs=1\`. Parallelise at one level only, and pick the coarse one: \`n_jobs\` on the search, \`n_jobs=1\` on the estimator. Folds are big, even units of work, so they schedule better than tree building does.

### Search on a subsample

Plot validation score against training size. If it is flat between 400k and 1.6M rows, run the search on 400k and refit only the winner on everything. That is a 4x discount on every candidate for no measurable loss.
      `,
        [
          q('A search varies only clf__C over a pipeline whose first step is a TfidfVectorizer. Adding memory="/var/tmp/sk_cache" to the Pipeline cuts it from 20.4 hours to 3.1. Why are the results unchanged?', [
            'Caching subsamples the training data, which happens not to alter the ranking here',
            'The vectorizer\'s parameters and input never change, so the cached transform is the identical matrix it would have recomputed',
            'The cache stores fitted classifiers, so only the slowest candidates are actually refitted',
            'The cache reuses fold splits, which removes the random variation between candidates',
          ], 1, 'Pipeline caching keys on the step\'s parameters and its input, so an unchanged transformer is loaded from disk rather than refitted, producing byte identical output.'),
          q('You set n_jobs=-1 on both GridSearchCV and the RandomForestClassifier inside it, on an eight core machine. Compared with n_jobs=1 everywhere, the search gets slower. What is going on?', [
            'The search cannot pickle a forest that has n_jobs set, so it falls back to serial fitting',
            'Setting n_jobs twice makes scikit-learn disable parallelism entirely as a safety measure',
            'Memory pressure from duplicated training data forces the machine to swap',
            'Eight search processes each open eight worker threads, so 64 workers contend for 8 cores',
          ], 3, 'Parallelism at two nested levels multiplies rather than adds, so the cores spend their time context switching instead of fitting, which is why you parallelise on the coarse level only.'),
          q('Your grid includes five values of max_iter for a HistGradientBoostingClassifier that already has early_stopping=True. What is wrong with that?', [
            'It multiplies the whole search fivefold to find an iteration count a single fit would report for free',
            'early_stopping is ignored whenever max_iter appears in a search grid',
            'The five candidates will all return the same score, so the search cannot rank them',
            'max_iter cannot be tuned by cross-validation because it changes the validation split',
          ], 0, 'Early stopping already walks the validation curve inside one fit and halts at the right iteration, so searching over the cap pays five times the cost for information the model hands you after one run.'),
        ]
      ),
      lesson('Latency Budgets: Batching, Caching, and Compiled Models', 13, `
The service had a 150 ms budget. Mean response time was 38 ms, so the dashboard was green, and the checkout team was still filing tickets. The p99 was 940 ms. A mean hides the requests that make people give up, and the requests that make people give up are the only ones anybody complains about.

### Budget the whole path, not the model

Trace one request end to end before you touch anything.

| Stage | p50 ms | p99 ms |
|---|---|---|
| TLS and routing | 3 | 9 |
| Feature fetch, 8 sequential key lookups | 22 | 780 |
| Building the one row DataFrame | 7 | 31 |
| \`model.predict_proba\` | 4 | 6 |
| JSON serialise | 2 | 4 |

The model is 4 ms. Eight sequential round trips to the feature store are everything. Replace them with one batched multi key read and p99 on that stage falls to about 95 ms, because you now wait for the slowest of eight in parallel instead of the sum of eight in series. No model change, tail cut by 80%.

### The per call overhead nobody budgets for

\`\`\`python
X = pd.DataFrame([payload], columns=COLUMNS)   # 1.4 ms
model.predict_proba(X)                         # 0.9 ms
\`\`\`

Constructing the frame costs more than the prediction. Per row overhead is roughly fixed, which is why batching pays so well:

| Batch size | Total ms | ms per row |
|---|---|---|
| 1 | 2.3 | 2.30 |
| 16 | 4.1 | 0.26 |
| 256 | 21.0 | 0.08 |

Micro-batching collects arrivals for a short window, then predicts once:

\`\`\`python
async def collect(queue, max_rows=32, window_s=0.005):
    batch = [await queue.get()]
    deadline = time.monotonic() + window_s
    while len(batch) < max_rows and time.monotonic() < deadline:
        try:
            batch.append(queue.get_nowait())
        except asyncio.QueueEmpty:
            await asyncio.sleep(0.0005)
    return batch
\`\`\`

Here is the part that catches people: batching improves throughput and the mean, and it makes the tail worse if the window is wide, because the first arrival in every window waits the whole window before anything happens. Set the window from the latency you have left over, not from the batch size you would like.

### Cache the right thing, with the right key

Cache the assembled feature vector when features move slowly, or the prediction itself when the same entity is scored repeatedly.

\`\`\`python
key = f"{MODEL_VERSION}:{hashlib.blake2b(canonical, digest_size=16).hexdigest()}"
\`\`\`

Drop \`MODEL_VERSION\` from that key and every deploy is followed by a TTL length window where the new model is live, healthy, and serving the previous model's cached answers. Nothing in your dashboards shows it. Version in the key means a deploy invalidates itself for free.

### Compiled models

Export the fitted pipeline to ONNX and run it without Python in the loop:

\`\`\`python
from skl2onnx import to_onnx
onx = to_onnx(model, X_train[:1].astype(np.float32),
              options={id(model): {"zipmap": False}})
\`\`\`

A 400 tree forest went from 4.1 ms to 0.6 ms, and the serving container no longer needs scikit-learn installed at all.

The catch is numeric. ONNX runs float32 where scikit-learn computed in float64. Probabilities shift in the fourth decimal, which is nothing, except for rows sitting within 0.0005 of your decision threshold, where the label flips. Validate by counting label disagreements on a held out set at your actual operating threshold. Mean absolute error on the probabilities will look perfect and tell you nothing about the rows that changed sides.

### Trim the tail on purpose

Give the feature fetch a hard timeout, say 60 ms, and on timeout serve a defaults vector with a degraded flag, or fall back to the baseline rule from chapter 1. A fast approximate answer inside the budget beats a correct answer at 3 seconds that the caller abandoned two seconds ago.

Then log the fallback rate. If 4% of requests are answered by the fallback, your p99 looks fine and your model is not actually serving one request in twenty five.
      `,
        [
          q('A trace shows p50 of 38 ms and p99 of 940 ms, with eight sequential feature store lookups accounting for 780 ms at p99. Replacing them with one batched multi key read helps most because:', [
            'Batched reads are billed at a lower rate, so the store prioritises them',
            'Fewer keys are fetched overall, so less data crosses the network',
            'You wait for the slowest of eight in parallel rather than the sum of eight in series',
            'The batched call is cached by the client, so repeat requests skip the store',
          ], 2, 'Sequential round trips add their tails together, so one slow lookup in eight compounds, while a single parallel batch is bounded by the slowest member instead of the total.'),
          q('Your prediction cache key is a hash of the feature vector with no model version in it. What symptom does this produce?', [
            'Cache hit rate collapses after every deploy, so latency spikes for the TTL window',
            'For one TTL after each deploy the new model is live and healthy while serving the previous model\'s answers',
            'Two different feature vectors eventually collide and return each other\'s predictions',
            'The cache grows without bound because entries are never invalidated by a deploy',
          ], 1, 'Without the version in the key the cached entries survive the deploy, so requests are answered from the old model while every dashboard reports the new one as serving.'),
          q('You export a scikit-learn model to ONNX. Mean absolute error on held out probabilities is 3e-7, so you ship it, and the daily flag count changes. What should you have checked?', [
            'That the ONNX graph preserves the original feature column order',
            'That onnxruntime and scikit-learn report the same model version string',
            'That the exported file loads without the zipmap option enabled',
            'Label disagreements at your operating threshold, since float32 flips rows sitting near the cut',
          ], 3, 'ONNX computes in float32 while scikit-learn used float64, and the tiny probability shift only matters for rows within a fraction of the threshold, which an averaged probability error hides completely.'),
        ]
      ),
      lesson('The Unit Economics of a Prediction', 13, `
Ask a team what one prediction costs and most cannot answer. Ask them what one prediction is worth and they answer instantly, usually with a number from the business case. That asymmetry is how a churn service ends up costing $46,000 a year to produce scores a merchandiser reads once each morning.

### Work out the cost per thousand

Start with compute, which is the easy part.

\`\`\`text
c6i.2xlarge on demand      $0.34 / hour
sustained 220 req/s at 45% CPU  =  792,000 req / hour
compute cost               $0.34 / 792 thousand  =  $0.00043 per 1,000
\`\`\`

Then write down the rest of the bill. Real numbers from a fraud service at 4.2M predictions a day, roughly 126M a month:

| Line | Monthly |
|---|---|
| Serving compute, 3 instances running 24/7 for peak | $734 |
| Feature store reads, 8 entity lookups per request | $2,410 |
| Feature writes and storage | $460 |
| Nightly retrain, 2.5 h on an r6i.4xlarge | $76 |
| Prediction and feature logging to object storage | $180 |
| Total | $3,860 |

That is $0.031 per 1,000 predictions, and compute is 19% of it. This is the number that surprises people every time: the model is almost never the bill. Reading features is.

### Which lever is actually cheapest

Two changes were tried on that service.

| Change | Monthly saving | Cost in AUC |
|---|---|---|
| 800 trees down to 250 | $110 | 0.001 |
| Drop 27 features, removing 3 of the 8 entity lookups | $904 | 0.004 |

Feature count is the lever, because every feature you keep is a read on every request, a write on every update, and a column in every log. Shrinking the model touches one line of the bill. Shrinking the feature list touches four.

### Idle capacity is most of what you pay for

Traffic runs about 14 hours a day with a 6x peak to trough ratio, so provisioning for peak around the clock means paying for roughly 3.4x the compute you consume. Autoscale on requests per second with a warm floor of one instance, and keep the floor high enough that a scale up event never lands during the morning ramp.

### The question that closes most real-time services

Does anything consume the prediction within seconds of the request that produced it?

| | Real time service | Nightly batch |
|---|---|---|
| Monthly cost | $3,860 | $41 |
| Freshness | milliseconds | up to 24 hours |
| Request-time features | available | impossible |
| New entity, no row yet | scored | missing until tomorrow |

Scoring all 4.2M rows in one 38 minute job on a single r6i.4xlarge is $0.64 a night. Batch only works when the entity set is bounded and no feature depends on the request itself, so a basket in progress or the device typing right now rules it out immediately. A churn score in a dashboard does not.

### Compare cost against value per decision, not against zero

A cost figure alone cannot tell you whether to cut it. Put it next to the expected value of the decision it buys. At the fraud model's operating threshold of 0.31, precision is 0.22, a caught fraud saves about $61, and a manual review costs $4.

\`\`\`text
EV per flagged case = 0.22 x 61 - 4 = $9.42
3,100 flags/day     = $29,200/day of value
cost                = $127/day
\`\`\`

At a 230 to 1 ratio, optimising the bill is the wrong project. The right move is to lower the threshold until the expected value of the marginal flag approaches zero, which spends more and earns more. Invert the arithmetic for a recommender where one prediction is worth $0.0006: at $0.00003 you are fine, at $0.0009 you are paying for the privilege of serving.

### What the spreadsheet leaves out

The on-call rotation. Retrain reruns after a failed job. Cross-zone egress on every feature read. And the development GPU nobody shut down, because an idle g5.xlarge quietly bills about $730 a month to sit there.
      `,
        [
          q('A fraud service bills $3,860 a month, of which serving compute is $734 and feature store reads are $2,410. Which change cuts the bill hardest?', [
            'Dropping features so that three of the eight per-request entity lookups disappear',
            'Reducing the forest from 800 trees to 250 to shorten every prediction',
            'Moving the nightly retrain onto a smaller and cheaper instance type',
            'Compressing the prediction logs written to object storage each day',
          ], 0, 'Features are read on every request, written on every update, and logged on every prediction, so removing them touches several lines of the bill while a smaller model only touches compute, which is 19% of the total.'),
          q('Your team wants to replace a real-time scoring service with a nightly batch job to save money. Which requirement makes that impossible?', [
            'The score has to be reproducible eighteen months later for an audit',
            'The entity set runs to several million rows and grows every week',
            'One feature is the contents of the basket the shopper is filling right now',
            'Downstream consumers read the scores from a dashboard each morning',
          ], 2, 'A precomputed score can only use features that exist before the request, so anything derived from the request itself cannot be batched no matter how cheap the batch job is.'),
          q('At threshold 0.31 precision is 0.22, a caught fraud saves $61, a review costs $4, and serving costs $127 a day against $29,200 of value. What does that ratio argue for?', [
            'Raising the threshold, because low precision means most flags waste review capacity',
            'Lowering the threshold until the marginal flag\'s expected value approaches zero',
            'Holding the threshold and cutting infrastructure spend as the next priority',
            'Retraining more often, since the ratio shows the model is losing precision',
          ], 1, 'Each flag returns about $9.42 against a trivial serving cost, so there is room to accept less certain cases until the expected value of the next flag stops being positive.'),
        ]
      ),
      ],
      [
      q('A pipeline one-hot encodes a high cardinality column, then applies StandardScaler with its defaults. Training fails immediately. What is the fix that keeps the matrix sparse?', [
        'Cast the encoded matrix to float32 before scaling',
        'Move the scaler ahead of the encoder in the pipeline',
        'Fit the scaler on a subsample and transform the full matrix',
        'Use MaxAbsScaler, or StandardScaler with with_mean=False',
      ], 3, 'Centring requires subtracting a mean from every cell including the zeros, which would densify the matrix, so scikit-learn refuses and you scale by magnitude instead.'),
      q('A full grid takes 20.4 hours and scores 0.871 CV AUC, while halving random search takes 1.2 hours and scores 0.870. Which reading is correct?', [
        'The difference is inside fold to fold noise, so the extra 19 hours bought nothing',
        'The grid found a genuinely better model, so the cost is justified for production',
        'The halving search underfit because it evaluated candidates on fewer rows',
        'The two searches explored different spaces, so the scores are not comparable',
      ], 0, 'A 0.001 AUC gap is smaller than the variation you would see just by reshuffling the folds, so treating it as a real improvement is reading noise as signal.'),
      q('You add micro-batching with a 40 ms collection window to a service with a 150 ms budget. Throughput doubles and the p99 gets worse. Why?', [
        'Larger batches force the model to allocate more memory per prediction',
        'The first arrival in each window waits the full window before anything is predicted',
        'Queued requests are retried by the client, which adds load to the same window',
        'Batched predictions bypass the cache, so more requests reach the model',
      ], 1, 'A collection window is pure added delay for whoever arrives at the start of it, so the window has to be sized from the latency you have spare rather than from the batch size you want.'),
      q('Two teams report their model costs. Team A says $0.031 per 1,000 predictions, Team B says $0.004. What can you conclude?', [
        'Team B\'s model is more efficient and should be the template for team A',
        'Team A is over-provisioned, since serving compute dominates any prediction bill',
        'Nothing, until you know what one prediction is worth to each business',
        'Team B must be excluding feature store reads from its figure',
      ], 2, 'Cost only becomes a decision when it sits next to the expected value of the decision it buys, so a cheaper prediction that returns less per call can be the worse deal.'),
      ]
    ),
    chapter(
      'Neural Networks, Embeddings, and Pretrained Models',
      'Where a network genuinely beats a boosted tree, and how to borrow representations somebody else spent millions of dollars learning.',
      [
      lesson('From Logistic Regression to a Multilayer Network', 13, `
On a 42 column churn table with 90,000 rows, a three layer network reached 0.812 ROC-AUC after two days of tuning. LightGBM reached 0.841 in nine minutes on defaults. That result is not embarrassing, it is the normal one: on tabular data, gradient boosting usually wins. Networks earn their keep where the raw input is text, audio, images or a sequence, and where the useful features have to be learned rather than typed.

### A network is logistic regression, stacked

Chapter 2's logistic regression computes one thing: \`sigmoid(w . x + b)\`. A multilayer network computes that same thing several times, feeding each result into the next layer.

\`\`\`python
import numpy as np

def relu(z): return np.maximum(0, z)
def sigmoid(z): return 1 / (1 + np.exp(-z))

x  = np.array([0.4, -1.2, 0.9])          # three scaled features
W1 = np.array([[0.5, -0.3, 0.2],
               [-0.7, 0.1, 0.8]])        # hidden layer, 2 units
b1 = np.array([0.1, -0.05])
W2 = np.array([1.4, -0.9])               # output layer
b2 = 0.2

h = relu(W1 @ x + b1)                    # [0.71, 0.0]
p = sigmoid(W2 @ h + b2)                 # 0.766
\`\`\`

The second hidden unit returned 0.0, so it is switched off for this row. A different row switches on a different set. That is the whole trick: the network carves the input space into regions and fits a different linear response inside each one.

### Remove the nonlinearity and the depth evaporates

Delete \`relu\` and the two layers collapse into one, because \`W2 (W1 x)\` is just \`(W2 W1) x\`. A product of matrices is a matrix. A ten layer linear network has exactly the representational power of logistic regression and ten times the parameters to fit. The activation function is not a detail, it is the only reason depth buys anything.

### Count the parameters before you train

\`\`\`python
import torch.nn as nn

net = nn.Sequential(
    nn.Linear(42, 128), nn.ReLU(), nn.Dropout(0.3),
    nn.Linear(128, 64), nn.ReLU(),
    nn.Linear(64, 1),
)
print(sum(p.numel() for p in net.parameters()))   # 13761
\`\`\`

13,761 parameters fitted on 90,000 rows is reasonable. The same architecture on 900 rows memorises the training set by epoch six and never generalises. A rough guide for tabular work: keep the parameter count under about a tenth of your row count unless you are regularising hard.

### Scaling stops being optional

Trees split on order and ignore units, so the pipeline in Chapter 5 could get away without a scaler in front of a forest. A network cannot. Feed it \`annual_income\` in the hundreds of thousands beside \`tenure_months\` in the tens, and the first layer's pre-activations run to five figures. \`sigmoid(40000)\` is 1.0, its gradient is 0.0, and that unit never updates again for the rest of training. Put \`StandardScaler\` in front, inside the pipeline, every time.

### Where each family actually wins

| Input | Reach for |
|---|---|
| 40 numeric and categorical columns | Gradient boosting |
| Free text, images, audio, video | A network, almost always pretrained |
| Sequences where order carries meaning | A network |
| Under 5,000 rows, tabular | Boosting or a regularised linear model |
| Features nobody can hand engineer | A network |

The honest summary: if you can name your features and there are fewer than a few hundred of them, boosting is the strong default. Reach for a network when the features are pixels, tokens or waveform samples, and there are far too many of them for anybody to name.
      `,
        [
          q('You replace every ReLU in a five layer network with the identity function and retrain. What can the model now represent?', [
            'Only what one linear model can, since stacked matrix products are a matrix',
            'The same set of functions, but it now takes five times as long to train',
            'More than before, because gradients are no longer clipped at zero',
            'Curved decision boundaries, provided each boundary stays monotone',
          ], 0, 'Without a nonlinearity between them, the layers multiply out into a single matrix, so a deep linear network has exactly the capacity of logistic regression.'),
          q('A network trains on unscaled data where one column runs up to 300,000. Why do the units fed by that column stop learning?', [
            'The optimiser rejects any input outside the range minus one to one',
            'Large pre-activations saturate the activation, so the gradient arriving at that weight is near zero',
            'Dropout removes the high magnitude column from every training batch',
            'The loss becomes mathematically undefined once an input exceeds ten thousand',
          ], 1, 'A huge pre-activation pushes a sigmoid or tanh flat, and a flat region has almost no slope, so backpropagation delivers essentially no update to that weight.'),
          q('You have 900 labelled rows and 38 tabular features. Which first model is the sounder choice, and why?', [
            'A four layer network trained for 200 epochs over all 900 rows',
            'A network with 256 unit hidden layers plus fairly heavy dropout',
            'Gradient boosting, since a network that size would memorise 900 rows',
            'A linear model with no regularisation, keeping all 38 features',
          ], 2, 'Tabular data of that size gives boosting a clear edge, and a network with more parameters than a fraction of the row count will fit the training set rather than the pattern.'),
        ]
      ),
      lesson('Training a Network Without Wasting a Week', 13, `
Forty epochs in, your training loss is sitting at 0.693 and has not moved since epoch three. That number is \`log(2)\`. The network is predicting 0.5 for every row and has learned nothing at all. Before you touch the architecture, fix the learning rate: it is wrong far more often than the layer count is.

### The loop, with the two lines everyone forgets

\`\`\`python
import torch
from torch import nn

model = nn.Sequential(nn.Linear(42, 128), nn.ReLU(), nn.Dropout(0.3), nn.Linear(128, 1))
loss_fn = nn.BCEWithLogitsLoss()
opt = torch.optim.AdamW(model.parameters(), lr=3e-4, weight_decay=1e-2)

for epoch in range(200):
    model.train()                  # dropout on
    for xb, yb in train_loader:
        opt.zero_grad()            # without this, gradients accumulate across batches
        loss = loss_fn(model(xb).squeeze(1), yb)
        loss.backward()
        opt.step()

    model.eval()                   # dropout off
    with torch.no_grad():
        val = sum(loss_fn(model(xb).squeeze(1), yb).item() for xb, yb in val_loader)
\`\`\`

Drop \`opt.zero_grad()\` and each batch's gradient is added to the previous one, so the effective step grows without bound and the loss thrashes. Drop \`model.eval()\` and dropout stays active through validation, so validation loss reads higher than training loss on a model that is not overfitting at all. People spend days regularising a problem they do not have.

### Find the learning rate first

Sweep it on a log scale, five epochs each, and read the pattern rather than the final digit.

| lr | val loss at epoch 5 | reading |
|---|---|---|
| 1e-1 | nan | diverged, weights blew up |
| 1e-2 | 0.68 | bouncing, never settles |
| 1e-3 | 0.44 | working |
| 3e-4 | 0.41 | best here |
| 1e-5 | 0.66 | right direction, far too slow |

Three orders of magnitude of learning rate moves the answer more than any architecture choice you will make that week. Tune it first, then batch size, then width and depth, then everything else.

### Stop at the right epoch, and keep those weights

\`\`\`python
best, wait, patience = float("inf"), 0, 10
if val < best - 1e-4:
    best, wait = val, 0
    torch.save(model.state_dict(), "best.pt")
else:
    wait += 1
    if wait >= patience:
        model.load_state_dict(torch.load("best.pt"))   # restore, do not skip this
        break
\`\`\`

Restoring matters. Early stopping that leaves you holding the weights from the last and worse epoch is a bug teams ship for months without noticing, because the training log still shows the good number.

### Read the two curves together

| Train loss | Val loss | Diagnosis |
|---|---|---|
| Falling | Falling | Keep going |
| Falling | Flat then rising | Overfitting: more dropout, more weight decay, fewer epochs |
| Flat near log(2) | Flat | Learning rate too low, or labels never reach the loss |
| Falling to near zero fast | Rising early | Model far too large for the data |
| Erratic between batches | Noisy | Batch too small, or \`zero_grad\` missing |

### Do not chase the third decimal

Two runs of the same script with different seeds land 0.005 to 0.01 apart on AUC. The rule from Chapter 4 applies unchanged: if the gap between two configurations is smaller than the gap between two seeds of one configuration, you have measured noise. Run three seeds, compare the means, and only then declare a winner.
      `,
        [
          q('A training script never calls model.eval() before computing validation loss. What does that do to the curves?', [
            'Validation loss reads too low, because dropout averages the predictions',
            'Training loss reads too high, because gradients keep accumulating',
            'Neither curve changes, since dropout only affects the backward pass',
            'Validation loss reads too high, because dropout is still zeroing units',
          ], 3, 'Dropout stays active in train mode, so validation is scored on a randomly crippled network and looks worse than training, which reads as overfitting that is not there.'),
          q('Training and validation loss both sit flat at 0.693 for thirty epochs. What should you change first?', [
            'The learning rate, since the network is not moving at all',
            'The dropout rate, since the network is clearly overfitting',
            'The batch size, since the gradients are too noisy to converge',
            'The number of hidden layers, since capacity is the binding limit',
          ], 0, 'A loss pinned at log(2) means the model outputs 0.5 for everything and has not learned, and a learning rate too low to move the weights is by far the most common cause.'),
          q('Early stopping fires after ten epochs without improvement, but the model you evaluate scores worse than epoch 22 did. What went wrong?', [
            'Patience was set too low for the learning rate in use',
            'The best weights were never restored, so you kept the final epoch',
            'Validation loss was computed with dropout still switched on',
            'The optimiser state was saved in place of the model state dict',
          ], 1, 'Stopping halts training at a worse epoch than the best one, so unless the saved checkpoint is loaded back you are shipping the weights that triggered the stop.'),
        ]
      ),
      lesson('Embeddings: Text and High-Cardinality Categories as Vectors', 13, `
A retail team one-hot encoded \`product_id\`. The column held 184,000 distinct values, the encoder produced 184,000 sparse columns, and about 60% of them appeared fewer than five times in training. The model learned almost nothing about those products, and could not represent a new one at all. An embedding table fixes this by giving every id a short dense vector that is learned alongside the rest of the weights.

### An embedding is a lookup table with gradients

\`\`\`python
import torch
import torch.nn as nn

emb = nn.Embedding(num_embeddings=184_001, embedding_dim=32)   # index 0 = unknown
vec = emb(torch.tensor([17, 4021, 0]))                         # shape (3, 32)
\`\`\`

184,001 by 32 is 5.9M parameters, which sounds worse than 184,000 sparse columns until you see what changed. Each row now touches 32 numbers instead of one indicator. Products that behave alike drift toward each other during training, because the same gradient pushes their vectors the same way, so a rare id borrows signal from its neighbours. And index 0 is reserved, so an id you have never seen maps to the unknown vector instead of raising at serve time.

A workable starting width:

\`\`\`python
dim = min(600, round(1.6 * cardinality ** 0.56))
# 50 categories -> 15
# 5,000         -> 189
# 184,000       -> 600
\`\`\`

Then tune it down. Wider is not better: an embedding with more room than the column has signal is just more parameters to overfit.

### Text: borrow a vector space instead of learning one

You rarely need to train text embeddings yourself. A sentence encoder trained on billions of sentences already places related sentences near each other.

\`\`\`python
from sentence_transformers import SentenceTransformer
from sklearn.linear_model import LogisticRegression

enc = SentenceTransformer("all-MiniLM-L6-v2")            # 384 dimensions
X = enc.encode(tickets_train, batch_size=64, normalize_embeddings=True)
clf = LogisticRegression(max_iter=2000).fit(X, categories_train)
\`\`\`

That is 384 dense features instead of a 40,000 column TF-IDF matrix, and it already knows that "cannot log in" and "stuck in a password reset loop" belong together despite sharing no words. On ticket routing this pattern regularly beats TF-IDF by five to eight points of macro F1, and it trains in seconds, because the expensive half is frozen.

### Cosine similarity measures topic, not agreement

Here is the part that catches people. Encode these pairs and look at the numbers.

| Sentence A | Sentence B | Cosine |
|---|---|---|
| The battery lasts all day | The battery dies by lunchtime | 0.78 |
| The battery lasts all day | Shipping was quick | 0.21 |

The first pair scores high because both sentences are about battery life, despite meaning opposite things. Sentence embeddings encode what a sentence is about far more strongly than whether it is positive or negative. Feed them to a classifier that learns the distinction. Never use raw cosine similarity as a sentiment score, or as a test of whether two statements agree.

### Pin the encoder like a dependency

A vector only means something inside the space that produced it. Swap \`all-MiniLM-L6-v2\` for a newer encoder of the same width and every stored vector becomes noise relative to the fresh ones. Nothing raises: the shapes match, the code runs, accuracy sags a few points and nobody connects it to the upgrade. Store the encoder name and version next to the vectors, and treat changing it as a full retrain of everything downstream.
      `,
        [
          q('Why does reserving index 0 of an embedding table for an unknown category matter once the model is serving traffic?', [
            'It keeps the embedding matrix aligned to a power of two',
            'It lets the model skip any row whose category is missing',
            'A product id absent from training maps to a defined vector rather than failing',
            'It stops the encoder allocating a separate vector to every rare category',
          ], 2, 'New ids appear constantly in production, and a reserved unknown row gives them a valid vector instead of an index error that takes the prediction service down.'),
          q('Two support tickets score 0.79 cosine similarity in a sentence embedding space. What does that number actually support?', [
            'That the two tickets carry the same sentiment about the product',
            'That one ticket is a paraphrase of the other with high confidence',
            'That both tickets fall into the same class in a trained router',
            'That the two tickets are about the same subject, not that they agree',
          ], 3, 'Sentence encoders capture topic far more strongly than polarity, so two sentences making opposite claims about the same thing sit close together in the space.'),
          q('Your team swaps in a newer sentence encoder of the same 384 dimensions but keeps the stored vectors and the trained classifier. What happens?', [
            'The classifier raises a shape error on its very first prediction',
            'Nothing changes, because both encoders embed the same sentences',
            'Accuracy sags quietly, because the vectors now live in a different space',
            'The encoder refuses to load without a matching tokeniser file present',
          ], 2, 'Embedding spaces are not comparable across models, so old and new vectors mean different things while the shapes still line up and no error is raised.'),
        ]
      ),
      lesson('Transfer Learning, Fine-Tuning, and When to Just Call an API', 13, `
900 photographs of welds, 140 of them defective. A ResNet-18 trained from random weights reached 63% accuracy and refused to climb. The same architecture with ImageNet weights, backbone frozen, a fresh two layer head on top, reached 91% in four minutes. Nothing about the data changed. What changed is that 11 million of the parameters already knew what an edge, a texture and a shadow look like.

### Three levels, in increasing cost

**Frozen features.** Run the pretrained model once, keep the vector it produces before the final layer, and train an ordinary classifier on top. The backbone never updates, so its output can be cached.

\`\`\`python
import numpy as np, torch, torchvision as tv

backbone = tv.models.resnet18(weights="IMAGENET1K_V1")
backbone.fc = torch.nn.Identity()          # emit the 512-d feature vector
backbone.eval()

with torch.no_grad():
    feats = torch.cat([backbone(xb) for xb, _ in loader]).numpy()
np.save("welds_resnet18_feats.npy", feats)   # 900 by 512, extracted once
\`\`\`

With that file on disk, every head experiment runs in seconds instead of minutes, because the expensive half never changes. **Partial fine-tuning** unfreezes the last block only. **Full fine-tuning** unfreezes everything, and is worth it only with thousands of labelled examples.

### The learning rate that destroys what you borrowed

\`\`\`python
opt = torch.optim.AdamW([
    {"params": head.parameters(),            "lr": 3e-4},
    {"params": backbone.layer4.parameters(), "lr": 1e-5},
])
\`\`\`

One shared rate of 3e-4 across both groups is the classic mistake. At thirty times too large for pretrained weights, the first few batches overwrite features that cost millions of dollars of compute to learn, and by epoch two you are training from scratch with a worse starting point than random. The symptom is accuracy that climbs for one epoch, collapses, then crawls back to below the frozen baseline. Backbone rates 10x to 100x under the head rate are the usual fix.

### Match the preprocessing exactly

A pretrained model expects the pixel statistics it was trained on. Hand ImageNet weights raw 0 to 255 pixels instead of normalised values and nothing raises. You just lose several points of accuracy and never learn why.

\`\`\`python
tfm = tv.transforms.Compose([
    tv.transforms.Resize(232), tv.transforms.CenterCrop(224),
    tv.transforms.ToTensor(),
    tv.transforms.Normalize(mean=[0.485, 0.456, 0.406],
                            std=[0.229, 0.224, 0.225]),
])
\`\`\`

The same rule holds for text: the tokeniser ships with the checkpoint, and substituting another one produces perfectly valid tensors and nonsense predictions.

### Fine-tune, or just call somebody's API

| Question | Leans hosted API | Leans your own model |
|---|---|---|
| Requests per day | A few thousand | Millions |
| Labelled examples | None yet | Thousands, task specific |
| Latency budget | 500ms is fine | Under 50ms |
| Data sensitivity | Nothing restricted leaves | Regulated or contractual limits |
| Task | Common: summarise, classify, extract | Narrow and specific to you |

The arithmetic settles most cases. At 300 calls a day a hosted endpoint costs a few dollars a month and no engineer at all. At 6 million calls a day that same endpoint costs more than the team, and a small fine-tuned model on your own hardware wins on price and on latency together. Start hosted, measure real volume for a month, and move only when the numbers say to.

Two things are not arithmetic: check the licence on any pretrained weights you ship, and check what your contract permits before customer records leave your network.
      `,
        [
          q('You fine-tune backbone and head with one learning rate of 3e-4. Accuracy jumps, collapses, then settles below the frozen baseline. Why?', [
            'The head is too small to hold the features the backbone produces',
            'That rate is far too large for pretrained weights, so early batches overwrite them',
            'Freezing then unfreezing inside one run corrupts the optimiser state',
            'Dropout inside the backbone was left enabled through the fine-tuning pass',
          ], 1, 'Pretrained weights are already near a good solution, so a rate sized for random initialisation walks them straight off it before the head has learned anything useful.'),
          q('Why cache a frozen backbone\'s output vectors to a .npy file before you start training the head?', [
            'It halves the memory the backbone needs during its forward pass',
            'It lets the head see freshly augmented copies of each image',
            'It is required before an sklearn classifier will accept the features',
            'The expensive half never changes, so head experiments run in seconds',
          ], 3, 'A frozen backbone produces identical vectors every epoch, so computing them once turns each new head experiment into a cheap fit on a small matrix.'),
          q('A vision model is served raw 0 to 255 pixel values instead of the ImageNet normalisation it was trained with. What do you observe?', [
            'Accuracy drops several points with no error raised anywhere',
            'A shape mismatch error on the very first forward pass',
            'Predictions that come out identical for every input image',
            'A warning from the transform pipeline about the pixel range',
          ], 0, 'The tensor shape is still valid, so the model happily processes out of distribution inputs and simply predicts worse, which is why this bug survives review.'),
        ]
      ),
      ],
      [
      q('A team swaps LightGBM for a three layer network on a 40 column tabular dataset and the score drops. What is the fair reading?', [
        'The network would need at least ten hidden layers to compete',
        'Boosting is the strong default on tabular data, and nothing here forces a network',
        'The dataset must contain leakage that only tree models can exploit',
        'Neural networks require every categorical column to be one-hot encoded',
      ], 1, 'Networks earn their advantage on raw text, images and sequences, so on a few dozen named columns a well tuned boosting model is usually the harder baseline to beat.'),
      q('Which change most reliably rescues a network whose training loss is stuck flat at log(2)?', [
        'Sweeping the learning rate across three orders of magnitude',
        'Adding two more hidden layers of the same width',
        'Raising dropout from 0.3 to 0.6 to cut variance',
        'Switching the optimiser from AdamW to plain SGD',
      ], 0, 'A frozen loss means the weights are barely moving, and learning rate is the knob that controls that directly, which is why it is tuned before architecture.'),
      q('A high cardinality store_id column is replaced by a 32 dimensional embedding. What is the main gain over one-hot encoding?', [
        'The model trains without needing any scaling of the numeric columns',
        'Every category is guaranteed at least one hundred rows of training data',
        'Similar stores end up with nearby vectors, so rare ids borrow signal',
        'The parameter count across the whole model drops by roughly half',
      ], 2, 'One-hot gives each id an isolated column with no relationship to any other, while an embedding places related ids close together so sparse ones inherit useful structure.'),
      q('Your product handles 400 classification requests a day and you have no labelled data yet. What is the sensible first move?', [
        'Collect 50,000 labels, then fine-tune a small model on your own GPU',
        'Train a network from random weights on whatever data exists today',
        'Build a TF-IDF and logistic regression baseline, skipping pretrained models',
        'Call a hosted API, measure real volume, and revisit when cost justifies it',
      ], 3, 'At that volume a hosted endpoint costs a few dollars a month and needs no labels, so it buys you the traffic and the examples that would justify building your own.'),
      ]
    ),
    chapter(
      'Proving It Helped: Experiments and Causal Impact',
      'Closing the gap between a metric that improved offline and a business that measurably got better because of it.',
      [
      lesson('The Offline Metric Improved and Nothing Happened', 13, `
Six weeks after the new churn model shipped, PR-AUC had gone from 0.61 to 0.68 and the retention team had saved exactly as many customers as the quarter before. Nobody made a mistake. The offline number was real. It just never reached the thing that pays for the project.

### The impact chain

A prediction does not produce revenue. It produces a number that travels down a chain, and every link can absorb the gain before it arrives.

| Link | What happens | Where the gain leaks |
|---|---|---|
| Score | The model ranks 400,000 accounts by P(churn) | Better ordering everywhere, including depths nobody reads |
| Cut | Ops call the top 5,000 this month | Only the top 1.25% of the list exists |
| Action | An agent offers a 15% discount | Plenty of people ignore the call |
| Outcome | The account renews or lapses | Some would have renewed with no call at all |

AUC integrates over every threshold, including thresholds you will never operate at. Two models can be near identical in the top 1.25% and differ a lot in the middle, where almost all the rows live, and AUC reports that as a large improvement.

### Score at the operating point instead

\`\`\`python
import numpy as np

def precision_at_k(y_true, scores, k):
    top = np.argsort(scores)[::-1][:k]
    return float(np.asarray(y_true)[top].mean())

for k in (1_000, 5_000, 20_000):
    print(k,
          round(precision_at_k(y_test, probs_old, k), 3),
          round(precision_at_k(y_test, probs_new, k), 3))
\`\`\`

What that project actually printed:

\`\`\`text
1000   0.412  0.419
5000   0.331  0.338
20000  0.244  0.291
\`\`\`

The whole seven point AUC gain sits around k = 20,000, a depth the team has no staff to reach. At the real cut, precision moved 0.7 points: 35 extra correct targets out of 5,000 calls. At a 20% save rate and 240 dollars of annual margin per save, that is roughly 1,700 dollars a year. The model got better. The business did not.

### Three more places it vanishes

**The action does nothing.** A correct prediction on an account no offer could have saved is a wasted call. Ranking by risk finds the people most likely to leave, not the people your intervention can keep, and those are different sets. That gap is large enough to get its own topic later.

**The labels came from the old policy.** You only observe whether a call worked on accounts the old rules chose to call. Score a new model on that log and you measure it on a population the previous model selected, which quietly flatters whichever candidate most resembles the incumbent.

**Nobody changed the workflow.** The score lands on a dashboard and agents keep working the queue in the order they always did. Adoption is a real term in the chain, and it is often zero.

### Write the decision down before you train

Four lines in the ticket, agreed with the team that will act:

\`\`\`text
who acts:      retention team, 22 agents
on how many:   5,000 accounts per month, hard capacity
what action:   phone call plus 15% discount for 12 months
what moves:    90 day retained revenue, against a 5% randomised holdback
\`\`\`

Every line constrains the model. Capacity pins the metric to precision at 5,000, so tuning for AUC is already off target. The action defines what "correct" even means, because a correct flag on an unsaveable account buys nothing. The holdback is the only line on that list that will ever let you prove the number, and it costs nothing to ask for before launch and is impossible to retrofit after.

A team that writes those four lines first builds a smaller, sharper project. A team that writes them after six weeks of modelling gets 0.68 PR-AUC and an awkward meeting.
      `,
        [
          q('Your new model lifts PR-AUC from 0.61 to 0.68, but precision in the top 5,000 rows barely moves. What is the most likely explanation?', [
            'The new model is overfitted to the training folds',
            'PR-AUC cannot be compared across two different models',
            'The gain sits deeper in the ranking than the capacity cut reaches',
            'The test set holds too few positives to measure precision',
          ], 2, 'AUC style metrics average over every threshold, so a model can improve a lot in the middle of the ranking while being unchanged in the thin slice ops actually works.'),
          q('Why does scoring a new model on outcomes logged under the old policy give a misleading estimate?', [
            'You only see results for the rows the old policy chose to act on',
            'Logged rows are older, so every feature has drifted since then',
            'The old policy used a different random seed for its data splits',
            'Historical rows always carry a higher missing value rate',
          ], 0, 'The log is a sample selected by the previous model, so the evaluation population favours whichever candidate most resembles the incumbent.'),
          q('A retention model reliably flags accounts that are certain to leave and cannot be persuaded to stay. What does that cost you?', [
            'Nothing, because precision is scored against actual churn',
            'AUC falls, since those rows are ranked far too high',
            'Recall on the persuadable segment drops automatically',
            'Calls spent where no offer can help, so impact is zero',
          ], 3, 'Those predictions are correct and therefore score well, but the action attached to them changes no outcome, so the capacity is consumed for no return.'),
        ]
      ),
      lesson('Running an A/B Test on a Model', 13, `
The test ran four days, showed a 6% lift in checkout conversion at p = 0.03, and shipped. Three weeks later the metric was flat. The experiment was not unlucky. It was misread on three separate counts, and each mistake is common enough to have its own name.

### Randomise the user, not the request

\`\`\`python
import hashlib

def arm(user_id, experiment="reranker_v3", arms=2):
    h = hashlib.sha256(f"{experiment}:{user_id}".encode()).hexdigest()
    return int(h[:8], 16) % arms
\`\`\`

Salting with the experiment name matters: hash the user id alone and whoever landed in treatment last time is glued to treatment forever, so every test inherits the last one's bias. Bucketing per request instead of per user is worse still. One person sees both experiences, the arms stop being independent populations, and for a ranking model the product becomes visibly incoherent between page loads.

### Size it before you run it, not after

For a proportion, a serviceable approximation for 80% power at the 5% level is \`n = 16 p (1 - p) / delta^2\` per arm.

\`\`\`python
p, rel = 0.042, 0.05          # 4.2% baseline, detect a 5% relative lift
delta = p * rel               # 0.0021 absolute
print(round(16 * p * (1 - p) / delta ** 2))   # 145981
\`\`\`

Roughly 146,000 users per arm. At 12,000 sessions a day that is 25 days, not four. An underpowered test that reaches significance has almost always found noise, and worse, the effect it reports is inflated: the only way a small sample crosses the line is by drawing an extreme estimate.

### Analyse who was actually exposed

The reranker fires on 30% of sessions. Measure across everyone and the true effect is diluted by that factor, and since required sample scales with one over delta squared, you now need about eleven times the traffic.

Broken:

\`\`\`sql
SELECT arm, AVG(converted) FROM sessions GROUP BY arm;
\`\`\`

Fixed:

\`\`\`sql
SELECT arm, AVG(converted) FROM sessions WHERE model_eligible GROUP BY arm;
\`\`\`

\`model_eligible\` has to be computed identically in both arms, which means the control path must still evaluate eligibility even though it never calls the model. Skip that and you filter treatment by a condition control was never tested against, which is a worse bias than the dilution you were fixing.

### Check the split before you read the result

\`\`\`python
from scipy.stats import chisquare
print(chisquare([100_412, 98_873]))   # statistic 11.9, pvalue 0.0006
\`\`\`

A 50/50 assignment that lands 1.5% apart on 199,000 users is not chance. That is a sample ratio mismatch, and in this case the cause was the treatment service timing out under load and falling back to control, which silently removed the slowest sessions from treatment and moved the conversion rate on its own. An SRM invalidates the experiment. Do not adjust for it, find the bug.

### Stop peeking

| Looks at the data | Chance of a false positive |
|---|---|
| 1 | 5% |
| 5 | about 14% |
| 14 daily checks | about 26% |

Every look is another opportunity to cross the line, so a fixed 0.05 threshold checked daily for two weeks is really running at one in four. Either fix the horizon in advance and read it once, or use a sequential method (alpha spending, always valid confidence sequences) chosen before the first user is bucketed.

### One primary metric, several guardrails

Declare one metric that decides the call, then a list that can only veto: p99 latency, error rate, unsubscribe rate, support contacts, revenue per session. Without that split, a team with fourteen metrics finds something significant in nearly every test, and the ship decision becomes whichever number came out best.
      `,
        [
          q('Your reranker fires on only 30% of sessions, but the analysis compares conversion across all sessions. What is the consequence?', [
            'The estimate is biased upward by the untriggered sessions',
            'The effect is diluted, so you need roughly eleven times the traffic',
            'Randomisation breaks and the experiment must be discarded',
            'Guardrail metrics stop being comparable between the arms',
          ], 1, 'Untriggered sessions contribute zero effect, shrinking the measured difference by the trigger rate, and required sample size scales with one over the effect squared.'),
          q('A 50/50 split lands 100,412 users in treatment and 98,873 in control. Why investigate before reading the result?', [
            'An imbalance of 1.5% makes a two sample t-test invalid',
            'The arms must be exactly equal for randomisation to be valid',
            'Unequal arms prove the sample size calculation was wrong',
            'That gap is far past chance, so users were dropped non randomly',
          ], 3, 'A sample ratio mismatch means some mechanism moved users between arms, and whatever did that usually shifted the outcome metric as well.'),
          q('Why does checking the p-value every morning and stopping at the first significant reading inflate false positives?', [
            'Each look is another chance to cross the line, so the real alpha climbs well past 0.05',
            'Daily aggregation introduces autocorrelation into the metric',
            'The variance estimate stays biased low until the test ends',
            'Early traffic always favours treatment through novelty effects',
          ], 0, 'The 5% guarantee applies to a single test at a fixed horizon, so repeated looks multiply the opportunities to cross the threshold by chance alone.'),
        ]
      ),
      lesson('Prediction Is Not Intervention: Uplift and Treatment Effects', 13, `
The retention campaign test came back with a result nobody wanted to present. Overall the offer worked: 3.9% churn in treatment against 4.6% in control. But split by predicted risk, the top decile, the accounts the model was proudest of, churned 11.2% when contacted and 9.8% when left alone. Contacting the best targets made things worse.

### Four kinds of customer, one score

| Type | Leaves if untreated | Leaves if treated | Worth an offer |
|---|---|---|---|
| Persuadable | Yes | No | Yes, this is the entire budget |
| Sure thing | No | No | No, you paid for nothing |
| Lost cause | Yes | Yes | No, you paid to lose them anyway |
| Sleeping dog | No | Yes | No, the offer caused the churn |

A churn model ranks by P(churn). It cannot separate a persuadable from a lost cause or a sleeping dog, because all three carry high risk. The quantity the budget actually wants is a difference:

\`\`\`text
uplift(x) = P(churn | no offer, x) - P(churn | offer, x)
\`\`\`

Positive means the offer helps. Negative means the reminder that their subscription exists is worth more to them than 15% off, and you just triggered a cancellation.

### Two models, one subtraction

\`\`\`python
from sklearn.ensemble import HistGradientBoostingClassifier

# pilot: t = 1 offered, t = 0 randomly held back
m_t = HistGradientBoostingClassifier(max_iter=300).fit(X[t == 1], y[t == 1])
m_c = HistGradientBoostingClassifier(max_iter=300).fit(X[t == 0], y[t == 0])

uplift = m_c.predict_proba(X_new)[:, 1] - m_t.predict_proba(X_new)[:, 1]
\`\`\`

That is a T-learner, and its requirement is strict: both arms must come from a randomised campaign. Fit it on the log of a targeted campaign and the two models are trained on populations the old rules chose, so the difference between them is mostly selection rather than effect.

### Why uplift is harder than it looks

You are subtracting two noisy estimates, so the variance roughly adds while the signal shrinks. Churn might be 4% and the uplift 0.8 points, a signal an order of magnitude smaller than the thing the ordinary model predicts. Expect to need several times the data.

Worse, there is no per row error. You never observe both outcomes for the same person, so nothing plays the role log loss plays for a classifier, and the usual validation curve does not exist.

### Evaluate with a Qini curve

Sort held out randomised rows by predicted uplift, walk down the ranking, and at each depth compare the arms among the rows seen so far.

\`\`\`python
import numpy as np

def qini_points(y, t, score, steps=20):
    order = np.argsort(score)[::-1]
    y, t = np.asarray(y)[order], np.asarray(t)[order]
    pts = []
    for k in np.linspace(len(y) / steps, len(y), steps).astype(int):
        yk, tk = y[:k], t[:k]
        n1, n0 = tk.sum(), (1 - tk).sum()
        if n1 == 0 or n0 == 0:
            continue
        pts.append((k, yk[tk == 1].sum() - yk[tk == 0].sum() * n1 / n0))
    return pts
\`\`\`

Random targeting traces a straight line. The area between your curve and that line is the Qini coefficient, and it is the number to quote instead of AUC.

### What the switch was worth

| Targeting rule | Net saves per 10,000 offers |
|---|---|
| Everyone in the base | 70 |
| Top decile by predicted churn | 20 |
| Top decile by predicted uplift | 310 |

Read the middle row twice. Risk ranking did worse than blanket targeting, because it concentrated the whole budget on lost causes and sleeping dogs. That is the counter intuitive part of this and the reason a well built churn model can lose money.

Uplift is not always worth the trouble. If the action is free, harmless and cannot annoy anyone, treat everybody. It earns its cost when the action is expensive, capacity limited, or capable of backfiring.
      `,
        [
          q('A retention offer aimed at the highest predicted churn decile produces more churn than sending nothing. What explains it best?', [
            'The churn model is badly calibrated at high probabilities',
            'The campaign budget was spread across too many accounts',
            'Churn labels for that decile were recorded after the call',
            'Sleeping dogs: the contact reminded them to cancel',
          ], 3, 'Some customers only churn when the offer reminds them the subscription exists, and risk ranking cannot distinguish them from customers the offer would save.'),
          q('Why can you not compute a per row error for an uplift model the way you compute log loss for a classifier?', [
            'Uplift models emit a score rather than a probability',
            'You never observe both the treated and untreated outcome for one person',
            'Uplift is only ever defined across deciles, never per row',
            'The treatment indicator is unavailable at prediction time',
          ], 1, 'Each person is observed in exactly one arm, so the individual treatment effect is never in the data and evaluation has to be done in aggregate.'),
          q('What does a T-learner require in its training data that an ordinary churn model does not?', [
            'A much larger set of features describing the offer',
            'Calibrated probabilities across the treated rows only',
            'Rows from both arms of a randomised campaign',
            'A time index so the treatment order can be recovered',
          ], 2, 'The two component models must be fitted on comparable populations, and only randomised assignment guarantees that their difference reflects the offer rather than the old targeting rules.'),
        ]
      ),
      lesson('Estimating Impact When You Cannot Randomise', 13, `
Legal will not let you withhold the fraud model from a random 5% of customers. The rollout went to 100% over one weekend. Chargebacks then dropped 22% month over month and the deck said the model did it. The same month, payments tightened the 3D Secure rules, and Q1 is the seasonal low anyway. Three explanations, one number, no way to tell them apart.

### The cheapest fix is a rollout order

You rarely get randomisation, but you almost always get to choose who goes first. Ship to one region, hold the rest a month, and difference the two changes.

| Region | Chargeback rate before | After | Change |
|---|---|---|---|
| DE (model live) | 1.42% | 1.05% | -0.37 pts |
| FR and IT (not yet live) | 1.38% | 1.19% | -0.19 pts |
| Difference in differences | | | **-0.18 pts** |

The naive before and after claims 0.37 points. Half of that was the season and the 3D Secure change, which hit both groups. The control region supplies the thing you can never observe directly: what would have happened anyway.

### Fit it, and cluster the standard errors

\`\`\`python
import statsmodels.formula.api as smf

m = smf.ols("chargeback_rate ~ treated * post", data=panel).fit(
    cov_type="cluster", cov_kwds={"groups": panel["region"]}
)
print(m.params["treated:post"], m.bse["treated:post"])
\`\`\`

The interaction term is the estimate. The \`cov_type\` argument is not decoration. Orders inside a region move together (same promotions, same fraud rings, same public holidays), so treating three million orders as three million independent observations can shrink the standard error by a factor of five, and then every quasi experiment you ever run comes back significant. Cluster at the level randomisation would have happened at.

### Parallel trends is an assumption, so go test it

Difference in differences only works if the two groups were tracking each other before the change. Plot the pre period. Then run a placebo: pretend the launch happened eight weeks earlier and fit the same regression using pre period data only.

\`\`\`python
pre = panel[panel.week < launch_week]
placebo = smf.ols("chargeback_rate ~ treated * fake_post", data=pre).fit()
\`\`\`

A clearly non zero placebo effect means the regions were already diverging, and your headline estimate is measuring that divergence.

### Regression discontinuity at your own threshold

If the model auto declines at score 0.62, compare orders scoring 0.60 to 0.62 against 0.62 to 0.64. Those two groups are nearly identical in underlying risk and one was declined, so the difference is close to a randomised comparison for free. Two conditions: the rule must be enforced with no manual overrides near the line, and the score must not be gameable by the applicant. The estimate is local, valid at the boundary, and says nothing about the effect at 0.95.

### What to reach for, in order

| Method | Needs | Strength of evidence |
|---|---|---|
| Randomised holdback | Permission to withhold | Strongest |
| Staggered rollout, DiD | A rollout order you control | Strong if trends match |
| Switchback | A marketplace with interference | Good, noisy |
| Regression discontinuity | A hard threshold, enforced | Local to the cut |
| Synthetic control | Many untreated units, long history | Assumption heavy |
| Before and after | Nothing at all | Not evidence |

The decision that settles whether you can ever prove impact is made before launch, by whoever picks the rollout order. Ask for a 5% holdback in the launch plan. If the answer is no, ask for the rollout order, and take the region list.
      `,
        [
          q('Chargebacks fell 22% in the month the fraud model launched. Why is that not the model\'s effect?', [
            'Everything else that changed that month is inside the same number',
            'One month is never long enough to compute a chargeback rate',
            'Chargebacks post with a lag, so the sign comes out reversed',
            'The metric belongs per customer rather than per order',
          ], 0, 'A before and after comparison attributes seasonality, rule changes and every other simultaneous shift to the launch, because nothing in the design separates them.'),
          q('In a difference in differences estimate, what does the untreated control region actually supply?', [
            'A second sample that halves the variance of the estimate',
            'A check that the treated region\'s data was recorded correctly',
            'The change that would have happened anyway, so you can subtract it',
            'A baseline rate used to normalise the treated region\'s scale',
          ], 2, 'The control group stands in for the counterfactual trend, so subtracting its change removes seasonality and any other shift common to both groups.'),
          q('Why fit the difference in differences regression with standard errors clustered by region?', [
            'Because the interaction coefficient is otherwise biased toward zero',
            'Orders inside a region move together, so unclustered errors are far too small',
            'Because clustering is mandatory whenever the outcome is a rate',
            'It corrects for the different order volumes in each region',
          ], 1, 'Correlated observations carry much less information than independent ones, so ignoring the correlation understates uncertainty and makes almost any estimate look significant.'),
        ]
      ),
      ],
      [
      q('A model improves AUC, but the retention team can only work 5,000 accounts a month. Which comparison should decide whether to ship?', [
        'AUC on the full test set, reported with a bootstrap interval',
        'Log loss across the held out rows from the last quarter',
        'Recall averaged over every threshold between 0 and 1',
        'Precision in the top 5,000 rows, the cut ops will really use',
      ], 3, 'The only predictions that ever become actions are the ones above the capacity cut, so the metric has to be computed at that operating point.'),
      q('What separates a randomised A/B test from every other method covered here?', [
        'Random assignment makes the arms comparable by construction',
        'It measures the outcome after the change rather than before it',
        'It uses a far larger sample than an observational comparison',
        'It reports a p-value alongside the point estimate it produces',
      ], 0, 'Randomisation balances both known and unknown differences between the groups, which is exactly the assumption every quasi experimental method has to argue for instead.'),
      q('Which situation genuinely calls for an uplift model rather than a churn model?', [
        'Predictions have to be served inside a 40ms latency budget',
        'The churn labels only arrive three months after prediction',
        'A fixed budget of offers, and you want incremental saves',
        'The positive class covers under 2% of all customer rows',
      ], 2, 'A limited number of expensive actions should go to customers whose behaviour the action changes, which is a different ranking from customers most likely to churn.'),
      q('The model is live in Germany but not yet in France or Italy. What is the most defensible way to estimate its impact?', [
        'Compare German chargebacks before and after the launch date',
        'Difference Germany\'s change against the change in France and Italy',
        'Retrain on post launch data and compare the offline metrics',
        'Ask German customers whether they noticed anything change',
      ], 1, 'The untreated countries absorb seasonality and any company wide change, so the difference of the two changes isolates what the rollout added.'),
      ]
    ),
    chapter(
      'Governance, Lineage, and a Portfolio of Models',
      'The obligations that arrive once decisions are automated, and what it takes to run many models for years instead of one for a quarter.',
      [
      lesson('Model Cards, Intended Use, and the Sign-Off', 13, `
A credit-risk model built to flag likely defaulters for manual review was picked up eight months later by the marketing team, who used the same score to decide who got a loyalty offer. Same artifact, same endpoint, a completely different population and a completely different cost of being wrong. Nobody broke a rule. Nobody had ever written one down.

### The card is a contract, not paperwork

A model card is a short document that ships inside the artifact directory and answers three questions: what this model is for, what it is not for, and how well it works on whom. It extends the \`manifest.json\` from Chapter 6. The manifest pins the mechanics, versions, feature order, threshold. The card states the obligations.

\`\`\`yaml
# artifacts/churn-2026-08-20-a/card.yaml
model: churn-risk
version: churn-2026-08-20-a
owner: priya.nandakumar@example.com        # a person, not a team alias
reviewed_by: sam.oyelaran@example.com
review_due: 2027-02-20

intended_use: >
  Rank active subscribers by 90-day churn probability so the retention team
  can prioritise roughly 2,000 outreach calls per week.

out_of_scope:
  - Setting prices or discount amounts
  - Scoring trial users (fitted only on customers past 30 days tenure)
  - Any decision applied to a customer with no human in the loop

training_data:
  window: 2024-07-01 to 2026-06-30
  excluded: enterprise accounts, whose contracts renew annually
  rows: 412338

performance:
  pr_auc: 0.641
  baseline_pr_auc: 0.207
  worst_slice: {name: tenure_under_3m, n: 9104, recall: 0.41}
\`\`\`

### The negative half is the half that works

Everyone fills in \`intended_use\`. Almost nobody fills in \`out_of_scope\`, and that is the section that would have stopped the marketing team. Write it as concrete prohibitions tied to something true about the training data. "Fitted only on customers past 30 days tenure" is checkable by anyone. "Use responsibly" is not.

The second most valuable line is the worst slice. A card that reports one headline number invites exactly the failure from Chapter 7: the average is fine, one segment is broken, and the reader has no way to see it.

### The mismatch nobody catches

The most common defect in a card is a performance section measured on the population the model was **fitted** on rather than the population it will **score**. This churn model was fitted on subscribers past 30 days. The service calling it scores everyone from signup onward. That PR-AUC of 0.641 is honest, reproducible, and irrelevant for about a third of live traffic.

So the reviewer compares three populations and refuses if any two disagree: the one in \`training_data\`, the one the calling service actually sends, and the one the metrics were computed on.

### Generate what you can, block on what you cannot

Cards rot because they are written by hand once and never again. Emit the mechanical fields from the training run itself, and fail the publish when the human fields are empty:

\`\`\`python
REQUIRED_PROSE = ["intended_use", "out_of_scope", "owner", "reviewed_by"]

def publish(card: dict) -> None:
    missing = [k for k in REQUIRED_PROSE if not card.get(k)]
    if missing:
        raise RuntimeError(f"card incomplete, refusing to publish: {missing}")
    if card["performance"]["worst_slice"]["recall"] < 0.35:
        raise RuntimeError("worst slice under floor, needs named sign-off")
    write_artifact(card)
\`\`\`

A default string would be worse than a blank. It reads like a real constraint while constraining nothing, and the next reader believes it.

### What a sign-off actually is

Not approval of the mathematics. The reviewer checks four things, none of which require opening the model code.

| Check | What failing looks like |
|---|---|
| Does the score feed a decision the card names? | Scoped to triage, used to set prices |
| Is the worst slice acceptable for that decision? | Recall 0.41 on the segment being targeted |
| Does it beat the boring baseline by enough to justify running it? | 0.64 against a 0.61 rule that costs nothing |
| Who is on the hook, and when is this looked at again? | Owner is a mailing list, review date blank |

Name a person. Put a date on it. Store the card beside the artifact so the two can never drift apart.
      `,
        [
          q('A model card lists intended_use, the training window and a PR-AUC, but leaves out_of_scope empty. What does that actually cost you?', [
            'The artifact directory will fail its checksum on load',
            'The reported PR-AUC becomes statistically invalid',
            'Nothing stops another team reusing the score for a decision it was never evaluated on',
            'The model can no longer be rolled back to an earlier version',
          ], 2, 'The prohibitions are the section that governs reuse, so an empty out_of_scope leaves the marketing team free to point a triage model at a pricing decision.'),
          q('The churn model was fitted only on subscribers past 30 days tenure, but the calling service scores everyone from signup. Why is the card\'s PR-AUC of 0.641 misleading?', [
            'It was measured on a narrower population than the one being scored',
            'PR-AUC is undefined whenever the base rate differs between fitting and serving',
            'The figure has to be recomputed every time the decision threshold moves',
            'Tenure was almost certainly the strongest feature in the fitted model',
          ], 0, 'A metric is only a claim about the population it was computed on, so scoring a wider population means part of live traffic has no evidence behind it at all.'),
          q('Why should publish() refuse to write the card when out_of_scope is blank, instead of inserting a sensible default string?', [
            'A default value would break the YAML parser the registry uses',
            'Blank prose fields make the manifest and the card disagree on versions',
            'Promotion to production requires every field populated for schema reasons',
            'A generated default reads like a real constraint while constraining nothing',
          ], 3, 'A plausible looking placeholder is worse than an obvious gap, because the next reader trusts it and stops asking the question.'),
        ]
      ),
      lesson('Reproducing a Decision From Eighteen Months Ago', 14, `
A customer emails to ask why their application was declined on 3 March 2025. You still have the artifact. You do not have the row it scored. The features came from a warehouse view that reads a dimension table updated in place, and that customer's plan, tenure and bureau score have all moved since. You can produce a number today. You cannot produce *that* number.

### Two reproductions, two sets of requirements

People conflate these, then build the machinery for one and get asked for the other.

| | Reproduce the decision | Reproduce the training |
|---|---|---|
| Question it answers | Why did this person get this outcome? | Why does this model behave this way? |
| Needs | The exact scored vector plus the artifact version | Snapshotted source tables, code sha, seeds |
| Asked by | Customers, appeals, regulators | Auditors, your own team after a regression |
| Frequency | Weekly, forever | Rarely, but it takes days when it lands |

### Log the vector you scored, not the payload you received

The single highest-value line of governance code is the one that writes down what the model actually saw:

\`\`\`python
record = {
    "decision_id": "d-8f31c0",
    "scored_at": "2025-03-03T09:14:22Z",
    "model_version": MANIFEST["version"],      # from Chapter 6's manifest
    "features": df.iloc[0].to_dict(),          # AFTER reindex, BEFORE the pipeline
    "probability": 0.3412,
    "threshold": MANIFEST["threshold"],
    "decision": False,
    "policy_overrides": [],
}
decision_log.append(record)                    # append-only, partitioned by date
\`\`\`

Logging only the raw HTTP payload is the trap. The payload had a customer id; the enrichment step called a bureau API that returned 640 that morning and returns 703 today. You have preserved the question and lost the answer. Store the feature dict as scored, and store it before the pipeline transforms it, so a human can read it.

### The storage cost is not the reason people skip this

Forty-eight numeric features plus identifiers is roughly 500 bytes a row. Twenty million decisions a year is about 10 GB raw, closer to 2 GB as Parquet with dictionary encoding and zstd. Call it a few dollars a year of object storage against one hour of a lawyer's time. The reason teams skip it is that nobody asks for it in year one, and by the time somebody does the window has closed.

### Point in time, not "the current table"

Training reproduction fails for a different reason: your query is not a snapshot. Consider a label built from \`customers.churned_flag\`, a column overwritten as accounts close. Re-run the identical SQL in 2026 and rows that were negative in 2024 are now positive. The code is unchanged, the data is unchanged in the sense that nobody deleted anything, and the model you rebuild is a different model.

The fix is immutable partitions or a table format with time travel, plus a snapshot identifier recorded in the manifest:

\`\`\`python
manifest["data_snapshot"] = {
    "table": "warehouse.subscriptions",
    "iceberg_snapshot_id": 7291043118654,   # or a dated partition path
    "row_count": 412338,
}
\`\`\`

### Replay is a test you run every week

Do not assume the chain works. Prove it on a schedule by picking random rows out of last month's decision log and re-scoring them with the version they name:

\`\`\`python
def replay(record, tol=1e-6):
    pipe = load_artifact(record["model_version"])      # never the current one
    x = pd.DataFrame([record["features"]])[pipe.feature_names_in_]
    p = float(pipe.predict_proba(x)[:, 1][0])
    assert abs(p - record["probability"]) < tol, (record["decision_id"], p)
\`\`\`

Loading the *current* model instead of the recorded version is the mistake that makes a replay harness worthless, because it passes right up until the moment it matters. And use a tolerance rather than equality: a different BLAS build or thread count changes the summation order and shifts the last few decimals, exactly as with the performance floor in Chapter 7.

Retention has to outlive the service. When the endpoint is switched off, the artifacts and the decision log stay for as long as the decisions can be challenged, which is usually years longer than anyone plans for.
      `,
        [
          q('Your service logs the raw request payload for every decision. Eighteen months later you cannot reproduce a specific score. What went wrong?', [
            'The payload log rotated out before the retention window was extended',
            'The enrichment step now returns different values, so the features scored that day are gone',
            'The artifact for that version was overwritten by a later training run',
            'The pipeline recomputes its imputation statistics on every load',
          ], 1, 'Only the scored feature vector is fixed forever, because anything derived from a live upstream source can change between the decision and the challenge.'),
          q('You re-run the exact training SQL from 2024 and get a model with different coefficients, with no code change. What is the most likely cause?', [
            'The random_state was never fixed on the train and test split',
            'Library versions moved on, changing the numerical solver used',
            'The holdout window has grown as new rows kept arriving',
            'The label column is updated in place, so historic rows read differently now',
          ], 3, 'A mutable dimension column silently rewrites history, which is why training reproduction needs a snapshot identifier rather than a query against current tables.'),
          q('A weekly replay job loads the current production model to re-score sampled rows from the decision log. Why is that harness worthless?', [
            'It proves only that the current model is self-consistent with itself',
            'Sampling from a log cannot cover enough rows to be meaningful',
            'Re-scoring old rows counts as reusing test data and inflates the metric',
            'Probabilities cannot be compared across different feature orderings',
          ], 0, 'Replay has to load the artifact named in the record\'s model_version, because the whole point is proving the older decision can still be regenerated.'),
        ]
      ),
      lesson('Regulated Decisions: Explanations, Appeals, and Recurring Audits', 14, `
"Your application was declined because the model returned 0.34" is not a reason. In consumer credit under Regulation B, and in a growing pile of similar rules elsewhere, a declined applicant is owed the specific principal factors that drove the outcome, in language they can act on. Chapter 7 gave you SHAP values. Those are an explanation for you, not for them.

### From attributions to reasons

Two things stand between a SHAP vector and a notice you can send. The values sit on the encoded matrix, so \`region_NORTH\` and \`plan_BASIC\` are separate columns that mean nothing to a customer. And a signed float is not a sentence.

\`\`\`python
SOURCE = {"region_NORTH": "region", "plan_BASIC": "plan",
          "months_since_last_payment": "payment_recency"}
REASONS = {
    "payment_recency": "Recent payment history is shorter than we require",
    "utilisation": "Balance is high relative to your available credit",
    "plan": "The account type on file is not eligible for this limit",
}

def adverse_reasons(shap_row, top_k=4):
    by_source = {}
    for col, val in shap_row.items():                 # aggregate one-hot back
        by_source[SOURCE.get(col, col)] = by_source.get(SOURCE.get(col, col), 0) + val
    pushed_down = sorted(by_source.items(), key=lambda kv: kv[1])[:top_k]
    return [REASONS[src] for src, _ in pushed_down if src in REASONS]
\`\`\`

Aggregating before ranking is not cosmetic. Split across six one-hot columns, a genuinely dominant \`region\` effect can rank below a mediocre single numeric feature, and the applicant gets the wrong reason.

### Explain the decision that was made

The subtle failure: generating reasons from the model in production today for a decision made in March by version \`limit-2025-01-11-b\`. The explanation is internally consistent and factually wrong about that person. Read \`model_version\` from the decision log, load that artifact, and explain with it. Everything in the previous topic exists so this is possible.

### An appeal is a labelled example

Every regulated system needs a human override path. Most teams build it and then throw away what it produces.

Log every override with the reviewer's stated reason and treat the file as data. Two things fall out immediately. It is training signal, a small set of hard cases with expert labels. And it is your earliest failure detector: if reviewers overturn 4% of decisions nationally but 31% in one region, you have a broken model with a human patch stretched over it, and no offline metric will ever say so.

### Audits recur, because populations move

A fairness check at launch is a snapshot of a moving thing. Recompute on a schedule, on live decisions, sliced by the groups your obligation names.

| Metric | What it compares | When it is the right one |
|---|---|---|
| Selection rate ratio | Approval rate per group over the highest group | Rules phrased as disparate impact |
| Equal opportunity gap | True positive rate per group, among those who qualify | Missing qualified people is the harm |
| Calibration by group | Predicted probability against observed rate per group | The score is handed to a human to weigh |

You cannot flatten all three at once when base rates differ between groups. That is a proved impossibility, not an engineering gap. Pick the one your legal obligation actually names, write down why in the model card, and monitor it.

### The counter-intuitive part

Dropping the protected attribute from the feature set does not remove the disparity. The model reconstructs it from postcode, device, employer, purchase mix, whatever correlates. What dropping it does remove is your ability to measure the disparity.

So you need the attribute retained in the audit store even though it must never enter the pipeline:

\`\`\`python
X = frame.drop(columns=["ethnicity", "gender"])   # never a feature
audit = frame[["decision_id", "ethnicity", "gender"]]   # restricted table
\`\`\`

Separate storage, separate access, joined only inside the scheduled audit job. Blindness is not fairness. It is fairness you have chosen not to look at.
      `,
        [
          q('Why aggregate SHAP contributions back to their source column before picking the top four adverse action reasons?', [
            'One-hot columns produce SHAP values on a different scale to numeric ones',
            'Aggregation is required for the contributions to sum to the model output',
            'Ranking on raw values would always favour the encoded categorical columns',
            'A real effect split across six one-hot columns can rank below a weaker numeric feature',
          ], 3, 'Splitting one real effect across several encoded columns dilutes each of them, and the ranking that produces the notice is done on those diluted values.'),
          q('An appeals queue overturns 4% of decisions nationally but 31% in one region. What does that tell you?', [
            'The reviewers in that region are applying the policy inconsistently',
            'The model fails on that segment and human overrides are masking it, which no offline metric would have surfaced',
            'The decision threshold is set too high across the whole population',
            'The region column should be removed from the feature set before retraining',
          ], 1, 'Override rate is a live per-segment error signal, and a rate that far above baseline means the model is wrong there and people are quietly compensating.'),
          q('A team drops ethnicity from the feature set and stops storing it entirely. What is the effect on fairness?', [
            'Disparity is removed, since the model can no longer condition on the attribute',
            'Disparity is unchanged, and calibration by group becomes the only usable audit',
            'Disparity persists through correlated features, and it can no longer be measured at all',
            'Disparity persists, but the selection rate ratio still detects it without the attribute',
          ], 2, 'Postcode, device and purchase mix reconstruct the attribute for the model, while discarding it destroys the join every fairness metric needs.'),
        ]
      ),
      lesson('The Portfolio: Registry, Retraining Pipelines, and Decommissioning', 13, `
Four engineers, twenty-three models in production, and when someone finally instrumented the caller id on every request, two of those models turned out to be scoring traffic from a service that had been replaced eight months earlier. They were retrained monthly. They were monitored. Nothing consumed them.

### The registry is a table before it is a platform

You do not need MLflow on day one. You need one row per model version that anyone can query:

| Column | Example | Why it earns its place |
|---|---|---|
| \`name\`, \`version\` | churn-risk, churn-2026-08-20-a | Ties to the artifact and the decision log |
| \`stage\` | production, shadow, archived | Exactly one production row per name |
| \`owner\`, \`review_due\` | priya.n@, 2027-02-20 | An unowned model is an outage waiting |
| \`artifact_uri\`, \`card_uri\` | s3://models/... | Chapter 6's manifest and this chapter's card |
| \`calls_7d\` | 0 | Finds the two dead models above |
| \`consumers\` | billing-api, crm-sync | You cannot decommission what you cannot trace |

The \`calls_7d\` column is the one that surprises people. Volume is the cheapest signal you have and almost nobody records it against the registry row.

### Promotion is a gate, not a button

A version moves through stages and each transition runs the same checks automatically. No exceptions for urgent releases, because urgent releases are where the damage comes from.

\`\`\`python
def promote(candidate, incumbent, holdout):
    checks = {
        "schema": schema_matches(candidate, holdout),
        "floor": pr_auc(candidate, holdout) >= 0.62,            # Chapter 7's floor
        "slices": min_slice_recall(candidate, holdout) >= 0.35,
        "latency": p99_ms(candidate) <= 40,
        "beats_incumbent": pr_auc(candidate, holdout)
                           > pr_auc(incumbent, holdout) + 0.008,
    }
    failed = [k for k, ok in checks.items() if not ok]
    if failed:
        raise PromotionBlocked(failed)
    registry.set_stage(candidate, "shadow")
\`\`\`

Note \`+ 0.008\`. Beating the incumbent by 0.001 on one holdout window is noise, and promoting on noise means you churn models forever while quality goes nowhere. The margin is the point.

### Retrain on a trigger, not on a calendar

Nightly retraining sounds diligent and is usually the least safe thing in the system: every night you ship a model nobody evaluated. Retraining is a candidate generator, never a deployment.

Trigger it on evidence. Drift crossing the PSI threshold from Chapter 6. Measured performance decay once the labels finally land. A known upstream change, a new pricing tier, a merged acquisition. Then send the candidate through the identical gate, shadow it against the champion on the same live rows, and promote only if it wins by the margin.

### Decommissioning is the neglected half

Killing a model is real engineering work with an order to it:

1. Instrument callers. Log a caller id on every request for two weeks.
2. Announce, with a date, to the names in \`consumers\`.
3. Return a deprecation header while still serving, and count who ignores it.
4. Serve a 410 for a fortnight, so the failure is loud and reversible.
5. Set the registry stage to \`archived\` and turn the endpoint off.
6. Keep the artifact, card and decision log for the retention period.

Step 6 is the one people get wrong. The endpoint dies; the obligation from the earlier topics does not. Somebody can still challenge a decision that model made, and deleting the artifact means you cannot answer.

### The number that actually constrains you

Not accuracy. Models per engineer that can be safely maintained. Each live model costs a retraining slot, a monitor with a human who reads it, a recurring audit, a card review and a share of on-call. Roughly three to five per engineer is where teams stop coping, and it does not scale with cleverness.

So retiring a model is a legitimate quarterly deliverable, not an admission of failure. The healthiest portfolio review ends with fewer models than it started with.
      `,
        [
          q('Which registry column would have revealed that two production models were scoring a service replaced eight months earlier?', [
            'calls_7d, because zero request volume shows nothing consumes a model',
            'review_due, because an overdue review means the model is unmaintained',
            'artifact_uri, because a stale path points at an archived bucket',
            'stage, because a decommissioned service leaves its models in shadow',
          ], 0, 'Recorded call volume answers the question directly, whereas review dates and stages only say what somebody intended rather than what is happening.'),
          q('Why does the promotion gate require the candidate to beat the incumbent by 0.008 rather than by any positive amount?', [
            'Smaller differences cannot be represented reliably in floating point',
            'The margin compensates for the candidate having seen fewer training rows',
            'A win of 0.001 on one holdout window is noise, so promoting on it churns models without improving anything',
            'PR-AUC is only comparable between models when the gap exceeds one percent',
          ], 2, 'Without a margin the gate promotes sampling variation, which produces constant deployment activity and no measurable quality gain.'),
          q('A team retrains and auto-deploys every night so the model always reflects fresh data. What is the risk they have taken on?', [
            'Nightly fits overfit recent rows and lose their earlier history',
            'Every night ships a model that has passed no gate, so a bad upstream day becomes a bad production model',
            'Frequent retraining invalidates the decision log, since versions change too fast',
            'Drift monitors cannot establish a reference window under daily retraining',
          ], 1, 'Retraining only generates a candidate, and skipping the promotion checks means an upstream data defect reaches production the same night it appears.'),
        ]
      ),
      ],
      [
      q('Which pair of records is the minimum needed to answer why a specific customer was declined last year?', [
        'The training dataset and the notebook that produced the model',
        'The drift monitor history and the current model card',
        'The A/B test results and the artifact directory',
        'The logged feature vector with its model_version, and the artifact that version names',
      ], 3, 'Reproducing one decision needs the exact inputs scored plus the exact artifact that scored them, and neither training data nor monitors can substitute.'),
      q('An audit asks for evidence that a model still works for the segment it targets. Which artifact answers that fastest?', [
        'The card\'s worst slice figure, kept current by the training job that emits it',
        'The pickled pipeline, which encodes what the model learned',
        'The unit test suite, which asserts the pipeline\'s behaviour',
        'The registry row, which records the owner and review date',
      ], 0, 'A per-slice metric published with the artifact is the direct evidence, whereas the pipeline, the tests and the registry describe mechanics and ownership instead.'),
      q('A model\'s endpoint is switched off and its registry stage set to archived. Why keep the artifact and decision log afterwards?', [
        'Because the retraining pipeline needs the old artifact as a baseline',
        'Because decisions it already made can still be challenged long after the service dies',
        'Because the drift monitor\'s reference window is stored inside the artifact',
        'Because archived versions are needed to reproduce the A/B test that promoted them',
      ], 1, 'The obligation attaches to the decisions rather than to the running service, so retention is measured in years past the shutdown date.'),
      q('A four person team runs twenty-three production models and quality is slipping everywhere. What does that most likely indicate?', [
        'The models need consolidating into a single multi-task model',
        'The retraining cadence is too slow for the number of models',
        'The portfolio exceeds what the team can monitor, audit and review',
        'The registry is missing the ownership and review columns',
      ], 2, 'Every live model consumes a monitor, an audit, a review and a share of on-call, so a portfolio past that capacity degrades no matter how good each model is.'),
      ]
    ),
  ],
  final: [
    q('Which situation is the strongest signal that machine learning is the wrong tool?', [
      'The pattern is complex and hard to write down as explicit rules for a developer',
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
      'They cannot handle negative values, so every column must be rescaled to a positive range first',
      'The penalty treats all coefficients alike, so feature units set how hard each is hit',
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
      'Boosting trains trees in parallel on bootstrap samples and averages their votes at the end',
      'Boosting fits trees one after another on the ensemble\'s errors, and can overfit',
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
      'ROC-AUC is computed from the predicted labels rather than the scores, so it stays high however many alerts are wrong',
      'A huge true-negative base keeps FPR tiny despite many false alarms; PR-AUC would expose it',
      'AUC only applies to regression',
      'The threshold is set too high',
    ], 1, 'With rare positives, false positive rate is diluted by thousands of true negatives while precision, and therefore PR-AUC, is not.'),
    q('Why wrap preprocessing and the model in a single Pipeline?', [
      'It reduces memory usage during training, because intermediate arrays are freed after each step',
      'Each cross-validation fold refits the transformers on its own training portion only',
      'It is the only way to use n_jobs=-1',
      'Pipelines automatically tune hyperparameters',
    ], 1, 'A pipeline makes every fitted step fold-local, so validation rows never influence the transformations applied to them.'),
    q('A model was trained on ten years of past hiring decisions. What is the core risk?', [
      'The dataset is too old to compute metrics on, since job requirements have changed since',
      'It learns who was hired before, copying past bias rather than predicting performance',
      'Trees cannot handle categorical job titles',
      'Ten years is always too little data',
    ], 1, 'Historical bias is faithfully recorded in the labels, so the model reproduces past discrimination at scale.'),
    q('What belongs in a model artifact alongside the pickled pipeline?', [
      'Only the trained weights, to keep the artifact small',
      'The full training dataset, so that the model can be rebuilt on any machine that needs it',
      'Nothing — a pickle is self-describing',
      'A manifest with library versions, feature order, the chosen threshold and test metrics',
    ], 3, 'A pickle stores objects but not the context needed to load or use them correctly, so versions, feature order, and the threshold must travel with it.'),
    q('Why load the model once at service startup rather than inside the request handler?', [
      'Deserialising costs hundreds of milliseconds and the object never changes',
      'joblib.load can only be called once per process',
      'Loading per request causes the model to retrain on the incoming row each time',
      'It is required for request validation to work',
    ], 0, 'Unpickling is expensive and the artifact is immutable, so it belongs in startup rather than in every request\'s latency budget.'),
    q('The highest-loss rows in your error analysis turn out to be largely mislabelled. What is the right response?', [
      'Increase model capacity so it can fit them',
      'Lower the decision threshold to catch more of them, since they are the costliest errors',
      'Fix the labels — no model choice compensates for a broken target',
      'Drop the loss column and re-evaluate on accuracy',
    ], 2, 'The target defines what the model is fitting, so mislabelled rows are a data defect that no amount of tuning can repair.'),
    q('A drift monitor recomputes its PSI bin edges from each day\'s live data. What breaks?', [
      'PSI becomes negative and can no longer be interpreted, so alerts fire on every feature every day, however stable',
      'The reference is no longer fixed, so a column that collapses to a constant registers as no drift',
      'The monitor stops working on numeric features',
      'PSI starts requiring labels, which arrive too late',
    ], 1, 'Bin edges must come from the training reference; taken from live data they move with the distribution and hide exactly the shifts being watched for.'),
    q('A daily demand model builds its seven day mean with `g.rolling(7).mean()` and no `shift(1)`, and the backtest uses `TimeSeriesSplit(test_size=28, gap=14)`. Why does the gap fail to rescue the evaluation?', [
      'Fourteen rows is too short a gap once the rolling window is seven days wide',
      'The gap protects only the first fold, since later folds train on more history',
      'The window holds the row\'s own target, so the feature leaks inside every fold',
      'Rolling reorders the rows, so the folds stop being chronological after fold one',
    ], 2, 'A gap removes the overlap between mature training labels and the test window, but a feature that already contains the day it is meant to predict leaks within each fold on its own, so no choice of split, gap or metric can undo it.'),
    q('A fitted pipeline is exported to ONNX and the mean absolute difference between its probabilities and scikit-learn\'s is 3e-5 on a holdout, so the team ships it. Why is that check inadequate?', [
      'Rows sitting within a fraction of the threshold can flip label, which a mean hides',
      'ONNX computes in float64 while scikit-learn trained in float32, so drift will grow',
      'The export reorders the input columns, so the two runtimes score different features',
      'The difference should be measured on the training rows rather than on a holdout set',
    ], 0, 'ONNX runs the pipeline in float32 where scikit-learn used float64, and although the average probability shift is negligible, any row within about 0.0005 of the operating threshold changes side, so the check that matters is counting label disagreements at that threshold.'),
    q('You unfreeze a pretrained backbone and fine-tune it together with a fresh head at one shared learning rate of 3e-4. Accuracy climbs for one epoch, collapses, then settles below the frozen-backbone baseline. What went wrong?', [
      'Dropout was left active during evaluation, so the validation figures read too low',
      'The head is too small to make use of the 512 dimensional vector the backbone emits',
      'The backbone stayed in eval mode, so its parameters never received a gradient at all',
      'That rate is far too large for pretrained weights, so early batches overwrite them',
    ], 3, 'A rate tuned for a randomly initialised head is roughly thirty times too large for weights that already encode edges and textures, so the first few batches destroy the borrowed representation and you end up training from a starting point worse than random.'),
    q('In a randomised retention pilot, treating everybody yields 70 net saves per 10,000 offers while targeting the top decile by predicted churn yields only 20. What best explains that gap?', [
      'The churn model is badly calibrated, so its top decile is not really the riskiest',
      'High risk pools lost causes and sleeping dogs, whom the offer cannot save or repels',
      'One decile is too small a treated group for the net saves figure to be measured well',
      'The offer works best on the accounts that were least likely to churn in the first place',
    ], 1, 'P(churn) cannot separate a persuadable from a lost cause or a sleeping dog because all three carry high risk, so ranking on risk spends the whole budget on accounts the offer cannot keep or actively pushes into cancelling.'),
    q('A reranker fires on only 30% of sessions. To avoid diluting the effect, the analyst restricts the read-out to eligible sessions, but eligibility is computed only inside the treatment path. What is the consequence?', [
      'It is safe, because control sessions never reach the model and cannot be eligible',
      'It costs the test some statistical power but leaves the measured lift unbiased',
      'One arm is now filtered by a condition the other arm was never evaluated against',
      'It surfaces as a sample ratio mismatch, so the chi-square check will catch it first',
    ], 2, 'Filtering to the exposed population is the right fix for dilution only when eligibility is computed identically in both arms, so a control path that never evaluates it leaves you comparing a selected slice of treatment against a whole population, which is a worse bias than the dilution being corrected.'),
    q('A team drops ethnicity and gender from the feature set and purges them from every downstream store, then reports the model as fair by construction. What actually follows?', [
      'Correlated columns rebuild the attribute, and now no audit can measure the gap',
      'Selection rate, equal opportunity and calibration can all be satisfied together now',
      'The disparity goes away, since nothing in the pipeline can condition on those columns',
      'Only calibration by group is affected, and the other two measures stay unchanged',
    ], 0, 'A model reconstructs a dropped attribute from postcode, device, employer and purchase mix, so the disparity survives while the deletion removes the only column an audit could have sliced on, which is why the attribute belongs in a restricted audit store rather than nowhere at all.'),
    q('A hospital dataset holds several visits per patient, and a random row-level split puts some of a patient\'s visits in training and others in test. What is the likely effect on the test score?', [
      'It is pessimistic, because each patient\'s history is split across two sets',
      'It is optimistic, because the model can recognise patients it already saw',
      'It is unaffected, because every visit is a separate row with its own label',
      'It is unbiased but noisier, so a larger test set would fix the problem',
    ], 1, 'Visits from one patient share traits, so the model scores well by recognising the person rather than generalising; a group-aware split such as GroupKFold keeps each patient on one side.'),
    q('A delivery-time regressor reports an MAE of 6.2 minutes. Predicting the training median for every order gives an MAE of 6.5 minutes. What is the fair reading?', [
      'The model barely beats a constant guess, so its features add little so far',
      'The model is strong, since 6.2 minutes is a small error for a delivery estimate',
      'The comparison is invalid, because a median is not a real model',
      'The model must be overfitting, because it sits so close to the baseline',
    ], 0, 'A baseline gives the score its meaning: improving on a single constant by 0.3 minutes shows the model has captured very little signal yet.'),
    q('A Ridge regression scores R² 0.93 on training data and 0.58 on validation. Which change to its alpha parameter should you try first?', [
      'Decrease alpha, so the fit follows the training data more closely',
      'Leave alpha alone, since it only controls how fast the solver converges',
      'Set alpha to a negative value to reverse the penalty on large weights',
      'Increase alpha, so the coefficients are shrunk harder toward zero',
    ], 3, 'A large train/validation gap signals high variance, and a larger alpha penalises coefficient size more strongly, trading a little bias for less variance.'),
    q('House price plotted against floor area bends upward, and a linear regression underpredicts both the smallest and the largest homes. What is the most direct fix that keeps a linear model?', [
      'Add Lasso regularisation to shrink the area coefficient',
      'Standardise floor area so the slope is easier for the solver to estimate',
      'Add a squared area term, for example with PolynomialFeatures',
      'Drop the intercept so the fitted line passes through zero',
    ], 2, 'A straight line cannot follow a curve, and adding squared terms lets a linear model fit the bend while staying linear in its coefficients.'),
    q('A fraud model\'s decision threshold is lowered from 0.5 to 0.2. What typically happens?', [
      'Precision rises and recall falls, because fewer rows are flagged',
      'Both rise, because the model becomes more sensitive to fraud',
      'Recall rises and precision falls, because more rows are flagged',
      'Neither changes, because the predicted probabilities are the same',
    ], 2, 'A lower threshold flags everything it flagged before plus more, so recall can only hold or rise, while the extra flags are usually less likely to be fraud, pulling precision down.'),
    q('A colleague standardises every feature before fitting a random forest and expects a clear accuracy gain. What should you expect?', [
      'Essentially no change, since splits depend only on the order of values',
      'A large gain, since trees can then compare every feature on one shared scale',
      'A clear drop, since scaling destroys the thresholds trees rely on',
      'A gain only for the features that contain extreme outliers',
    ], 0, 'Each split is a threshold on a single feature, and rescaling keeps the ordering of values, so exactly the same partitions remain available.'),
    q('A candidate split sends rows into two child nodes that each have exactly the same class mix as the parent node. How much does it reduce Gini impurity?', [
      'By half, because the rows are divided into two groups',
      'It depends on how many of the rows each child node receives',
      'Not at all, because neither child is purer than the parent',
      'Fully, because two nodes are always purer than one',
    ], 2, 'With unchanged class proportions each child has the parent\'s impurity, so the weighted average equals the parent\'s and the reduction is zero.'),
    q('A paired bootstrap of the test set gives a 95% interval of −0.01 to +0.06 for model B\'s PR-AUC minus model A\'s. What is the honest conclusion?', [
      'B is better, because most of the interval lies above zero',
      'A is better, because the interval reaches below zero',
      'The bootstrap failed, because an interval for a difference cannot cross zero',
      'The data do not establish that B beats A, since the interval includes zero',
    ], 3, 'An interval that contains zero means no improvement is consistent with the data, so the apparent gain may be noise.'),
    q('With plain KFold on data where 2% of rows are positive, one fold ends up with 3 positives and another with 31. Which change fixes that?', [
      'Use TimeSeriesSplit so each fold follows the original row order',
      'Use StratifiedKFold to keep the positive share equal per fold',
      'Raise the number of folds to 20 so that each fold is smaller',
      'Use GroupKFold and pass the label column as the group',
    ], 1, 'StratifiedKFold preserves class proportions in every fold, which keeps per-fold metrics comparable when positives are rare.'),
    q('You tune a fraud classifier with GridSearchCV and leave scoring at its default. Positives are 1% of rows. What is the risk?', [
      'It ranks candidates by ROC-AUC, which ignores the rare positive class entirely',
      'It ranks candidates by accuracy, favouring ones that rarely flag fraud',
      'It scores on the training folds, so every candidate looks perfect',
      'It stops early and never evaluates most of the parameter grid',
    ], 1, 'With no scoring set, the search uses the classifier\'s own score method, which is accuracy, so it rewards majority-class behaviour; pass a metric such as average_precision instead.'),
    q('Customer data forms two interlocking crescent shapes. What will k-means with k=2 most likely do?', [
      'Separate the two crescents cleanly along their curves',
      'Refuse to fit, because the clusters are not spherical',
      'Label every point as noise and return no clusters',
      'Cut straight across both crescents, mixing points from each',
    ], 3, 'k-means assigns each point to its nearest centroid, so it can only carve roughly spherical regions; a density method such as DBSCAN can follow curved shapes.'),
    q('PCA reduces 200 correlated sensor columns to 8 components that keep 95% of the variance. What do you give up?', [
      'The ability to train supervised models on the reduced data',
      'All information about the target, which PCA strips out',
      'Direct interpretability, since each component blends many sensors',
      'Nothing, because keeping 95% of the variance means nothing useful is lost',
    ], 2, 'Each principal component is a weighted mix of the original columns, so a model built on them can no longer be explained in terms of individual sensors.'),
    q('You encode an unordered city column as 0, 1, 2, … and feed it to a linear regression. What goes wrong?', [
      'The model treats the codes as a scale with order and equal spacing',
      'Nothing, since linear models read integer codes as categories',
      'The fit fails, because linear models reject integer columns',
      'The column is ignored, because codes carry no variance',
    ], 0, 'One coefficient multiplies the code, forcing city 4 to have four times city 1\'s effect; one-hot encoding gives each city its own coefficient.'),
    q('After a retrain, complaints about bad decisions spike, but the prediction log has no model version column. What can you no longer do reliably?', [
      'Measure drift in the input features against the training reference',
      'Load the newly trained artifact into the prediction service',
      'Measure the p99 latency of the prediction endpoint',
      'Tell which predictions came from the old model or the new one',
    ], 3, 'Without a version on every logged prediction you cannot split outcomes by model, so you cannot confirm the retrain caused the change or compare the two models.'),
    q('Loan default labels arrive about twelve months after each decision. What can you monitor in the meantime to catch trouble early?', [
      'Live precision and recall, recomputed every day from that day\'s decisions',
      'The training loss curve saved from the most recent fit',
      'Input feature and score distributions against the training reference',
      'Nothing useful, until the first batch of labels arrives',
    ], 2, 'Drift in inputs or predicted scores is visible immediately and serves as the early warning, while performance metrics need labels and lag by a year.'),
    q('A RandomForestClassifier trained with n_jobs=-1 is loaded into a service that runs four worker processes on a four-core machine. What should you do?', [
      'Keep n_jobs=-1 so that every single request can use all four cores at once',
      'Set n_jobs=1 on the loaded model and let the workers supply parallelism',
      'Raise the worker count to sixteen to match the forest\'s threads',
      'Retrain the forest with fewer trees so it starts fewer threads',
    ], 1, 'Each worker would otherwise start a thread per core for every prediction, oversubscribing the CPU and hurting tail latency; serving gets its parallelism from processes.'),
    q('Permutation importance computed on the training set ranks a column of pure random noise fairly high. What is the most likely reason?', [
      'Permutation importance always inflates the importance of numeric columns',
      'The noise column must genuinely predict the target in the population',
      'The model memorised noise in the training rows, which held-out data exposes',
      'Too few permutation repeats were run, and running more would remove the effect',
    ], 2, 'An overfit model uses noise to fit training rows, so shuffling it hurts the training score; on held-out data the memorised pattern does not recur and the importance drops to about zero.'),
    q('A nightly training job joins labels onto features, and a key mismatch silently drops 8% of the rows. Which automated test would catch it?', [
      'Assert that the model\'s accuracy on the test set stays above 0.5 every night',
      'Assert that the row count after the join equals the feature table\'s count',
      'Assert that the training script exits with a status code of zero',
      'Assert that every feature column has a floating point dtype',
    ], 1, 'Dropped rows raise no error and barely move the score, so an explicit row count check is what turns the silent loss into a failing test.'),
    q('You forecast daily demand seven days ahead, and one feature holds units sold on the day before the target date. What is wrong?', [
      'It is not known at forecast time, so usable lags start at seven days',
      'Nothing, since the previous day\'s sales are always available',
      'It is only a problem if the series has no weekly pattern',
      'It leaks only when rows are shuffled before the split',
    ], 0, 'Forecasting day D+7 from day D, the day before the target is D+6, which has not happened yet; only lags of seven days or more exist at prediction time.'),
    q('A demand feature is built with `rolling(7, center=True).mean()`. Why is it unsafe for forecasting?', [
      'A centred window skips the first seven rows of every series',
      'The centred window includes later days, so it uses future values',
      'A centred window raises an error unless min_periods is set',
      'A 7-day mean is safe, since it smooths out any single day',
    ], 1, 'With center=True the window for day D spans about D−3 to D+3, so the feature contains future demand and inflates the backtest.'),
    q('GridSearchCV tries 5 learning rates, 4 depths and 3 leaf sizes with cv=5 and refit=True. How many model fits does it run in total?', [
      '301',
      '60',
      '300',
      '65',
    ], 0, '5 × 4 × 3 = 60 candidates, each fitted once per fold, gives 300 fits, and refit=True adds one final fit of the best candidate on all the data.'),
    q('A 50-million-row frame has a string column with only 12 distinct values. Converting it to the category dtype cuts its memory sharply. Why?', [
      'The category dtype compresses the strings with gzip while they sit in memory',
      'Pandas drops duplicate rows when it converts a column to category',
      'Each row stores a small integer code, and the 12 strings are stored once',
      'Category columns stay on disk and are loaded only when accessed',
    ], 2, 'A categorical column holds one compact integer code per row plus a single table of distinct values, instead of a Python string object per row.'),
    q('You need StandardScaler statistics for a 40 GB file that will not fit in memory. Which approach gives correct scaling?', [
      'Fit a fresh scaler on each chunk and transform that chunk with its own scaler',
      'Fit the scaler on the last chunk, since it holds the most recent rows',
      'Skip scaling, because chunked reading standardises columns itself',
      'Call partial_fit on every chunk, then transform the chunks in a second pass',
    ], 3, 'partial_fit accumulates the running mean and variance across all chunks, matching a full fit, whereas per-chunk scalers put every chunk on a different scale.'),
    q('You have 900 labelled photos of welds and need a defect classifier. Which approach is most likely to work first?', [
      'Start from ImageNet-pretrained weights, freeze the backbone, train a new head',
      'Train the same network from random weights for many more epochs',
      'Flatten the pixels and fit a linear regression on the raw values',
      'Cluster the photos with k-means and hand-label each of the resulting clusters',
    ], 0, 'Pretrained features already encode edges, textures and shapes, so the small labelled set only has to train the head; 900 images are far too few to learn those features from scratch.'),
    q('You have 3,000 labelled support tickets and want a topic classifier quickly. Which is a strong, cheap first model?', [
      'Train a transformer language model from scratch on just the 3,000 tickets',
      'Fit logistic regression on pretrained sentence embeddings of each ticket',
      'One-hot encode each full ticket text as a single category value',
      'Run k-means on the ticket lengths and name the resulting clusters',
    ], 1, 'Pretrained sentence embeddings carry meaning learned from huge corpora, so a simple linear classifier on top works well with a few thousand labels.'),
    q('An experiment randomises exposure to a new ranking model per request rather than per user. What is the main problem?', [
      'Per-request assignment halves the traffic available to each arm',
      'One person sees both versions, so the arms stop being independent groups',
      'Per-request assignment makes a sample ratio check impossible to run',
      'Predictions cannot be cached once assignment changes per request',
    ], 1, 'Randomising by request mixes both experiences within each user, contaminating both arms and making the product inconsistent between page loads; hash the user id instead.'),
    q('An uplift model estimates P(churn | no offer) − P(churn | offer) = −0.04 for a customer. What should the retention team do?', [
      'Skip the offer, since it is estimated to raise this customer\'s churn',
      'Send the offer, since any nonzero uplift means the customer is at risk',
      'Send the offer, since a negative uplift marks a persuadable customer',
      'Double the offer value, since the current offer is clearly too weak',
    ], 0, 'Uplift is the reduction in churn caused by the offer, so a negative value marks a sleeping dog whose churn goes up when contacted.'),
    q('A fraud model launches in the north region while the south waits a month, and you estimate its effect with difference in differences. Which assumption must hold?', [
      'Without the model, both regions\' chargeback rates would have moved in parallel',
      'Both regions must have had exactly the same chargeback rate before the launch',
      'The south must process far more transactions than the north does',
      'Customers must have been randomly assigned to live in each region',
    ], 0, 'Difference in differences uses the untreated region\'s change as the counterfactual, so it needs parallel trends rather than equal levels; check the pre-period and run a placebo.'),
    q('Under Regulation B, what is a declined consumer credit applicant owed?', [
      'The model\'s raw score and the threshold it was compared against',
      'A copy of the model card with its validation metrics and training window',
      'The full vector of SHAP values computed for their application',
      'The specific principal factors behind the decision, in plain language',
    ], 3, 'The applicant is owed specific reasons they can act on, such as high balances relative to limits; a score or a raw attribution vector is not a reason.'),
    q('To handle appeals, a team logs only customer_id and the score, planning to re-read features from the warehouse later. Why does this fail a year on?', [
      'Warehouse queries are too slow to run for a single customer',
      'The score alone is enough, so the features are never needed',
      'Customer ids are reassigned each year, so the join breaks',
      'Tables updated in place no longer hold the values that were scored',
    ], 3, 'Dimension tables overwritten in place return today\'s values, not the ones the model saw, so the decision cannot be reproduced; log the exact feature vector and model version at decision time.'),
  ],
});
