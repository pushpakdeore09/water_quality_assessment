from flask import Blueprint, jsonify, request # type: ignore
from .firebase import db
import numpy as np # type: ignore
import pickle
import pandas as pd # type: ignore
from sklearn.preprocessing import StandardScaler # type: ignore

scaler = StandardScaler()

main = Blueprint('main', __name__)
model = pickle.load(open('svm_model.pkl', 'rb'))

@main.route("/test-firebase", methods=["GET"])
def connect_firebase():
    try:
        result = db.child("Sensors").get()  
        if result.each():
            return jsonify({"message": "Connection successful!", "data": result.val()}), 200
        else:
            return jsonify({"message": "No data found in the sensors node."}), 404
    except Exception as e:
        return jsonify({"message": f"Failed to connect to Firebase: {str(e)}"}), 500



@main.route("/predict", methods=["POST"])
def predict_result():
    try:
        data = request.get_json()
        print("data:", data)
        
        if not data:
            return jsonify({"error": "No data provided!"}), 400
        
        ph = float(data.get('ph'))
        tds = float(data.get('tds'))
        turbidity = float(data.get('turbidity'))

        if ph is None or tds is None or turbidity is None:
            return jsonify({"error": "Missing required fields"}), 400
        
        input_data = pd.DataFrame([[ph, turbidity, tds]], 
                                columns=['pH', 'Turbidity', 'Total Dissolved Solids'])
        
        
        
        prediction = model.predict(input_data)
        
        prediction_result = prediction.tolist()
        return jsonify({"message": prediction_result}), 200
        
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    
