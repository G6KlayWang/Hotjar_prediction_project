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

    if data is None:
        return jsonify({"error": "No data received"}), 400
    
    # Convert JSON data to DataFrame
    df = pd.DataFrame(data)
    
    # Remove the last row of the DataFrame
    df = df.iloc[:-1]
    
    # Make predictions with the SVM model
    predictions = Util.get_prediction_flask(df)
    
    # Add predictions to the original dataframe
    df['Predictions'] = predictions
    df['Number ID'] = df.reset_index().index
    
    result_df = df[['Number ID', 'Predictions', 'Recording URL']]
    
    # Convert DataFrame to list of dictionaries
    result = result_df.to_dict(orient='records')
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
