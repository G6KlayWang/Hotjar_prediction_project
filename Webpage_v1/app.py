from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import joblib
import Util

app = Flask(__name__)
CORS(app)  # This is to handle Cross-Origin Resource Sharing (CORS) issues.

@app.route('/predict', methods=['POST'])
def predict():
    # Get the JSON data sent to the Flask server
    data = request.get_json()
    
    # Convert JSON data to DataFrame
    df = pd.DataFrame(data)
    print(df)
    
    # Remove the last row of the DataFrame
    df = df.iloc[:-1]
    
    # Make predictions with the SVM model
    predictions = Util.get_prediction_flask(df)
    
    # Convert predictions to a list and send it back as JSON
    return jsonify(predictions.tolist())

if __name__ == '__main__':
    app.run(debug=True, port=5000)
