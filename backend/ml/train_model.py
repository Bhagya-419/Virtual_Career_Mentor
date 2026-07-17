import pandas as pd
import joblib

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.feature_extraction.text import TfidfVectorizer

from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.metrics import (
    classification_report,
    confusion_matrix
)
from sklearn.model_selection import cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC

# Load Dataset
df = pd.read_csv("candidate_job_role_dataset.csv")

df["experience_level"] = (
    df["experience_level"]
    .astype(str)
    .str.strip()
    .str.replace(",", "")
)

X = df[
    [
        "skills",
        "qualification",
        "experience_level"
    ]
]

y = df["job_role"]
# Train Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
)

# Preprocessor
preprocessor = ColumnTransformer(

    transformers=[

        (
            "skills",
            TfidfVectorizer(),
            "skills"
        ),

        (
            "cat",
            OneHotEncoder(
                handle_unknown="ignore"
            ),
            [
                "qualification",
                "experience_level"
            ]
        )
    ]
)

models = {

    "Decision Tree":
    DecisionTreeClassifier(
        random_state=42
    ),

    "Random Forest":
    RandomForestClassifier(
        n_estimators=200,
        random_state=42
    ),

    "Logistic Regression":
    LogisticRegression(
        max_iter=5000
    ),
    "Linear SVM":
    LinearSVC(
        random_state=42
    )
}

best_model = None
best_accuracy = 0
best_name = ""

for name, classifier in models.items():

    pipeline = Pipeline([

        (
            "preprocessor",
            preprocessor
        ),

        (
            "classifier",
            classifier
        )

    ])

    pipeline.fit(
        X_train,
        y_train
    )
    train_predictions = pipeline.predict(X_train)
    train_accuracy = accuracy_score(
        y_train,
        train_predictions
    )
    print(
        f"{name} Training Accuracy: "
        f"{train_accuracy * 100:.2f}%"
    )
    predictions = pipeline.predict(
        X_test
    )
    print(
    classification_report(
        y_test,
        predictions
    )
)
    accuracy = accuracy_score(
        y_test,
        predictions
    )

    print(
        f"{name} Accuracy: "
        f"{accuracy * 100:.2f}%"
    )

    if accuracy > best_accuracy:

        best_accuracy = accuracy
        best_model = pipeline
        best_name = name

joblib.dump(
    best_model,
    "model.pkl"
)

print("\nBest Model:", best_name)
print(
    "Best Accuracy:",
    round(best_accuracy * 100, 2),
    "%"
)
print(
    confusion_matrix(
        y_test,
        predictions
    )
)
scores = cross_val_score(
    pipeline,
    X,
    y,
    cv=5
)

print(
    "Cross Validation Accuracy:",
    scores.mean()
)
print(
    "\nSaved best model as model.pkl"
)