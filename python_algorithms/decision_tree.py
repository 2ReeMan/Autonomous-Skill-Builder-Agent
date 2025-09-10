
# /python_algorithms/decision_tree.py

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn import tree
import matplotlib.pyplot as plt

def demonstrate_decision_tree():
    """
    Demonstrates a Decision Tree Classifier to predict a learner's weak skill area.

    This script simulates a scenario where we have learner data and want to predict
    which skill they should practice next based on their performance.

    - Features: course_topic, quiz_score, time_spent_minutes
    - Target: weak_skill_area (the skill recommended for practice)
    """
    print("--- Running Decision Tree Demonstration ---")

    # 1. Sample Data Simulation
    # In a real system, this data would come from Firestore.
    data = {
        'user_id': range(1, 21),
        'course_topic': ['JS', 'Python', 'JS', 'SQL', 'Python', 'JS', 'SQL', 'Python', 'JS', 'SQL',
                         'JS', 'Python', 'JS', 'SQL', 'Python', 'JS', 'SQL', 'Python', 'JS', 'SQL'],
        'quiz_score': [65, 88, 72, 95, 81, 55, 90, 76, 80, 85, 40, 92, 78, 88, 68, 71, 98, 79, 60, 92],
        'time_spent_minutes': [30, 45, 35, 60, 50, 25, 55, 40, 42, 58, 20, 55, 48, 50, 33, 38, 65, 45, 32, 62],
        'weak_skill_area': ['Variables', 'Data Structures', 'Functions', 'Joins', 'Libraries',
                            'DOM', 'Joins', 'Functions', 'Async', 'Subqueries', 'Variables',
                            'Libraries', 'Functions', 'Joins', 'Data Structures', 'Async',
                            'Subqueries', 'Functions', 'DOM', 'Joins']
    }
    df = pd.DataFrame(data)
    print("Sample Learner Data:")
    print(df.head())
    print("-" * 30)

    # 2. Data Preprocessing
    # Convert categorical features into numerical format using LabelEncoder.
    le = LabelEncoder()
    df['course_topic_encoded'] = le.fit_transform(df['course_topic'])

    # Define features (X) and target (y)
    features = ['course_topic_encoded', 'quiz_score', 'time_spent_minutes']
    target = 'weak_skill_area'
    X = df[features]
    y = df[target]

    # 3. Train-Test Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

    # 4. Model Training
    # Initialize and train the Decision Tree Classifier.
    # `max_depth` is used to prevent overfitting.
    dt_classifier = DecisionTreeClassifier(max_depth=4, random_state=42)
    dt_classifier.fit(X_train, y_train)
    print("Decision Tree Classifier trained successfully.")
    print("-" * 30)

    # 5. Prediction and Evaluation
    # Predict on the test set and calculate accuracy.
    y_pred = dt_classifier.predict(X_test)
    accuracy = (y_pred == y_test).mean()
    print(f"Model Accuracy on Test Data: {accuracy:.2f}")
    print("-" * 30)

    # 6. Make a Prediction on New Sample Data
    # Simulate a new learner who needs a recommendation.
    # Learner data: JS course, score of 68, spent 38 minutes.
    new_learner_data = pd.DataFrame([[le.transform(['JS'])[0], 68, 38]], columns=features)
    predicted_skill = dt_classifier.predict(new_learner_data)[0]
    print("Prediction for a new learner:")
    print(f"  - Learner Profile: Topic=JS, Score=68, Time=38min")
    print(f"  - Predicted Weak Skill Area: '{predicted_skill}'")
    print("-" * 30)

    # 7. Visualization (Optional)
    # This generates a text representation of the tree.
    # For a graphical plot, graphviz needs to be installed.
    try:
        fig = plt.figure(figsize=(15,10))
        _ = tree.plot_tree(dt_classifier,
                           feature_names=features,
                           class_names=sorted(y.unique()),
                           filled=True)
        # To save the plot to a file:
        # fig.savefig("decision_tree.png")
        print("A plot of the decision tree has been generated.")
        print("If running in a graphical environment, it will be displayed.")
        # plt.show() # Uncomment to display the plot if in a suitable environment
    except Exception as e:
        print(f"Could not plot the tree. Reason: {e}")
        text_representation = tree.export_text(dt_classifier, feature_names=features)
        print("\nText representation of the tree:")
        print(text_representation)


if __name__ == "__main__":
    demonstrate_decision_tree()
    print("\n--- Decision Tree Demonstration Finished ---")
