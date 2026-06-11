import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2' # Suppress TF warnings

import tensorflow as tf
import numpy as np

# Load the model once at startup to save memory and time
# Check karein ki path sahi hai, aapke folder ke hisaab se './best_model.h5' bhi ho sakta hai
# my_predictor.py mein line 6 change karein
print("Loading TensorFlow model... Please wait, this might take a few seconds.")
MODEL = tf.keras.models.load_model('./Models/best_model.h5')
print("Model loaded successfully!")

def predict_with_model(image_path):
    # 1. Read the image file
    image = tf.io.read_file(image_path)
    
    # 2. Use decode_image to automatically handle JPG, PNG, etc.
    image = tf.image.decode_image(image, channels=3)
    
    # 3. Preprocess the image
    image = tf.image.convert_image_dtype(image, dtype=tf.float32)
    image = tf.image.resize(image, [60,60]) 
    image = tf.expand_dims(image, axis=0) 

    # 4. Run prediction
    predictions = MODEL.predict(image) 
    
    # 5. Get the Result Index and the Confidence Score
    result_index = np.argmax(predictions) 
    confidence = np.max(predictions) # Ye batayega ki model kitna % sure hai
    
    # Ab dono cheezein return karein
    return result_index, confidence


if __name__ == "__main__":
    # Testing ke liye
    img_path = "predict.jpg"
    
    # Function call ab do values return karega
    prediction, confidence = predict_with_model(img_path)

    print(f"Prediction Class: {prediction}")
    print(f"Confidence Score: {confidence:.2f}")