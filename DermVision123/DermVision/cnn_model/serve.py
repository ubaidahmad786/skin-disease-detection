from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from deep_learning_models import derm_Vision

app = Flask(__name__)

# Load your trained model
model = tf.keras.models.load_model('./Models')

def predict_image(image):
    image = tf.image.resize(image, (60, 60))
    image = tf.cast(image, tf.float32) / 255.0
    image = np.expand_dims(image, axis=0)
    predictions = model.predict(image)
    predicted_class = np.argmax(predictions, axis=1)
    return predicted_class[0].item()

@app.route('/process_image', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']
    image = tf.image.decode_image(file.read(), channels=3)
    prediction = predict_image(image)
    return jsonify({'message': str(prediction)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
