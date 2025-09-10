
# /python_algorithms/bayesian_network.py

import numpy as np
import pandas as pd
from pgmpy.models import BayesianNetwork
from pgmpy.estimators import MaximumLikelihoodEstimator
from pgmpy.inference import VariableElimination

def demonstrate_bayesian_network():
    """
    Demonstrates a Bayesian Network to reason about a learner's skill mastery.

    This script simulates a scenario where we want to determine the probability
    of a learner mastering a skill ('Mastery') based on several factors:
    - Difficulty of the topic ('Difficulty')
    - Time spent studying ('TimeSpent')
    - Quiz score ('QuizScore')

    The network structure is defined as:
    Difficulty -> QuizScore
    TimeSpent -> QuizScore
    QuizScore -> Mastery
    """
    print("--- Running Bayesian Network Demonstration ---")

    # 1. Sample Data Simulation
    # In a real system, this data would be collected from user interactions in Firestore.
    # We use integers to represent states: 0=Low/False, 1=Medium/True, 2=High
    data = pd.DataFrame(data={
        'Difficulty': np.random.randint(0, 3, 200),  # 0:Easy, 1:Medium, 2:Hard
        'TimeSpent': np.random.randint(0, 3, 200),   # 0:Low, 1:Medium, 2:High
        'QuizScore': np.random.randint(0, 3, 200),   # 0:Low, 1:Medium, 2:High
        'Mastery': np.random.randint(0, 2, 200)     # 0:False, 1:True
    })
    print("Sample Learner Performance Data (first 5 rows):")
    print(data.head())
    print("-" * 30)


    # 2. Define Bayesian Network Structure
    # The structure defines the causal relationships (dependencies) between variables.
    model = BayesianNetwork([
        ('Difficulty', 'QuizScore'),
        ('TimeSpent', 'QuizScore'),
        ('QuizScore', 'Mastery')
    ])
    print("Defined Network Structure:")
    print("Difficulty -> QuizScore <- TimeSpent")
    print("QuizScore -> Mastery")
    print("-" * 30)

    # 3. Parameter Learning (Training)
    # We learn the Conditional Probability Distributions (CPDs) from the data.
    model.fit(data, estimator=MaximumLikelihoodEstimator)

    # Print the learned CPD for 'Mastery' as an example
    print("Learned Conditional Probability Distribution for 'Mastery':")
    print(model.get_cpds('Mastery'))
    print("-" * 30)

    # 4. Inference
    # Create an inference engine to ask probabilistic questions.
    inference = VariableElimination(model)

    # Scenario: A learner has a HIGH quiz score. What's the probability they mastered the skill?
    print("Query 1: Probability of Mastery given a High Quiz Score")
    prob_mastery_high_score = inference.query(variables=['Mastery'], evidence={'QuizScore': 2})
    print(prob_mastery_high_score)
    print("-" * 30)

    # Scenario: A learner has a LOW quiz score on a HARD topic.
    # What's the probability of mastery?
    print("Query 2: Probability of Mastery given a Low Score on a Hard Topic")
    prob_mastery_low_score_hard = inference.query(
        variables=['Mastery'],
        evidence={'QuizScore': 0, 'Difficulty': 2}
    )
    print(prob_mastery_low_score_hard)
    print("-" * 30)
    
    # Scenario: A learner spent a LOT of time on an EASY topic.
    # What is the most likely quiz score they will get?
    print("Query 3: Most likely Quiz Score given High Time Spent on an Easy Topic")
    map_query_score = inference.map_query(
        variables=['QuizScore'],
        evidence={'TimeSpent': 2, 'Difficulty': 0}
    )
    score_map = {0: 'Low', 1: 'Medium', 2: 'High'}
    print(f"Most likely quiz score: {score_map.get(map_query_score['QuizScore'], 'Unknown')}")
    print("-" * 30)


if __name__ == "__main__":
    # Note: pgmpy is required. Install with: pip install pgmpy pandas numpy
    try:
        demonstrate_bayesian_network()
    except ImportError:
        print("Please install required libraries: pip install pgmpy pandas numpy matplotlib")
    print("\n--- Bayesian Network Demonstration Finished ---")
