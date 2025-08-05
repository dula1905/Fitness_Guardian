import pandas as pd
import joblib

# Load the saved model from file
loaded_model = joblib.load('../Fitness_Guardian/pushups/models/final_pushup_model_tune.pkl')

# Load the test data from a CSV file
test_data = pd.read_csv('../Fitness_Guardian/pushups/datasets/pushup_test_dataset_tune.csv')

# Separate features (joint angles) from the test data
X_test = test_data.drop(columns=['correct_form'])

# Make predictions using the loaded model
predictions = loaded_model.predict(X_test)

# Add the predictions to the test data DataFrame
test_data['predicted_correct_form'] = predictions

# Cross-check predictions with actual outputs
correct_predictions = (test_data['correct_form'] == test_data['predicted_correct_form']).sum()
total_samples = len(test_data)

# Calculate accuracy
accuracy = correct_predictions / total_samples
print("Accuracy on test data:", accuracy*100, "%")
