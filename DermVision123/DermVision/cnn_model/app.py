from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import numpy as np
# Maan lijiye aapne predict_with_model ko update kiya hai confidence dene ke liye
from my_predictor import predict_with_model 

app = Flask(__name__)

def is_skin(image_path, threshold=0.01):
    img = cv2.imread(image_path)
    if img is None:
        return False
    
    # Convert image to YCrCb (better for skin detection)
    img_ycrcb = cv2.cvtColor(img, cv2.COLOR_BGR2YCrCb)
    
    # Skin bounds ko broad kar diya gaya hai (taaki red/dark lesions bhi cover ho jaayein)
    lower = np.array([0, 80, 50], dtype=np.uint8)
    upper = np.array([255, 180, 140], dtype=np.uint8)
    
    # Create mask
    skin_mask = cv2.inRange(img_ycrcb, lower, upper)
    
    # Calculate percentage of skin
    skin_ratio = cv2.countNonZero(skin_mask) / (img.shape[0] * img.shape[1])
    print(f"Skin pixel ratio: {skin_ratio:.2f}")
    
    return skin_ratio >= threshold
CORS(app)

@app.route('/')
def index():
    return "DermVision AI Backend is Running"

@app.route('/process_image', methods=['POST'])
def process_image():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image part in the request"}), 400
            
        image_file = request.files['image']
        img_path = 'predict.jpg'
        image_file.save(img_path)
        
        # 0. OpenCV Skin Detection Check First
        if not is_skin(img_path, threshold=0.08):
            print("Rejected by OpenCV: Not enough skin pixels detected.")
            return jsonify({
                "message": "Unknown", 
                "error": "Image not recognized as a valid skin area. Please upload a clearer photo."
            }), 200

        # 1. Prediction aur Confidence dono lein
        # Aapko my_predictor.py mein badlav karna hoga taaki wo (class, confidence) return kare
        prediction, confidence = predict_with_model(img_path)
        
        print(f"Prediction: {prediction}, Confidence: {confidence:.2f}")

        # 2. Threshold Logic Fallback (Agar confidence 90% se kam hai to error dein)
        THRESHOLD = 0.70 
        
        if confidence < THRESHOLD:
            print("Rejected by ML Model: Low confidence.")
            return jsonify({
                "message": "Unknown", 
                "error": "Model confidence is too low. Please upload a clearer photo."
            }), 200

        return jsonify({
            "message": int(prediction),
            "confidence": float(confidence)
        })

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)