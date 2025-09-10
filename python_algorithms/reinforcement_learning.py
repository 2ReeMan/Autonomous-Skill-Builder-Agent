
# /python_algorithms/reinforcement_learning.py

import numpy as np

def demonstrate_reinforcement_learning():
    """
    Demonstrates a simple Q-Learning algorithm for adaptive difficulty adjustment.

    This script simulates an environment where an AI agent learns the optimal
    difficulty level to present to a learner to maximize their engagement.

    - States: Learner's current proficiency level (e.g., Beginner, Intermediate, Advanced).
    - Actions: Difficulty of the next question (Easy, Medium, Hard).
    - Rewards:
        - +10: Learner at 'Beginner' answers 'Easy' question correctly.
        - +5:  Learner at 'Intermediate' answers 'Medium' correctly.
        - +10: Learner at 'Advanced' answers 'Hard' correctly.
        - -5:  Mismatch (e.g., 'Beginner' gets 'Hard' question).
        - -10: Learner fails a question at their expected difficulty.
    """
    print("--- Running Reinforcement Learning (Q-Learning) Demonstration ---")

    # 1. Environment Setup
    # States: 0=Beginner, 1=Intermediate, 2=Advanced
    # Actions: 0=Easy, 1=Medium, 2=Hard
    num_states = 3
    num_actions = 3

    # Q-table: stores the expected rewards for an action in a given state
    q_table = np.zeros((num_states, num_actions))

    # R-matrix (Rewards): Defines the rewards for taking an action in a state.
    # Rows are states, columns are actions.
    r_matrix = np.array([
        [10, -5, -5],   # Rewards for a Beginner
        [-5, 10, -5],   # Rewards for an Intermediate
        [-5, -5, 10]    # Rewards for an Advanced
    ])

    # 2. Q-Learning Parameters
    learning_rate = 0.8  # (alpha) How much we accept the new Q-value.
    discount_factor = 0.95 # (gamma) Importance of future rewards.
    num_episodes = 1000  # Number of training simulations.

    print("Initial Q-Table (all zeros):")
    print(q_table)
    print("-" * 30)

    # 3. Training the Agent
    for episode in range(num_episodes):
        # Start in a random state (simulating different learners)
        state = np.random.randint(0, num_states)

        # Choose an action using an epsilon-greedy approach (exploration vs exploitation)
        # For simplicity here, we'll just pick the best known action.
        action = np.argmax(q_table[state, :])

        # Simulate getting a reward from the environment
        reward = r_matrix[state, action]

        # In a real scenario, the 'next_state' would be the learner's new proficiency
        # after answering the question. We simulate it here.
        # If the action was correct for the state, proficiency might increase.
        if reward > 0 and state < 2:
            next_state = state + 1
        else:
            next_state = state # Proficiency stays the same or might decrease

        # Q-Learning formula to update the Q-table
        q_table[state, action] = q_table[state, action] + learning_rate * \
            (reward + discount_factor * np.max(q_table[next_state, :]) - q_table[state, action])

    print("Training finished.")
    print("Final Q-Table:")
    print(q_table)
    print("-" * 30)

    # 4. Using the Trained Agent
    # Now, the agent can be used to recommend the best action (difficulty) for a given state (proficiency).
    states_map = {0: "Beginner", 1: "Intermediate", 2: "Advanced"}
    actions_map = {0: "Easy", 1: "Medium", 2: "Hard"}

    print("Using the trained agent to make recommendations:")
    for state in range(num_states):
        # The best action is the one with the highest Q-value for that state.
        best_action_index = np.argmax(q_table[state, :])
        learner_proficiency = states_map[state]
        recommended_difficulty = actions_map[best_action_index]

        print(f"  - For a '{learner_proficiency}' learner, the agent recommends a '{recommended_difficulty}' question.")

    print("-" * 30)
    print("The Q-table shows that the agent has learned the optimal policy: recommend 'Easy' for 'Beginner', 'Medium' for 'Intermediate', etc.")

if __name__ == "__main__":
    demonstrate_reinforcement_learning()
    print("\n--- Reinforcement Learning Demonstration Finished ---")
