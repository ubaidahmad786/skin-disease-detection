# Skin Disease Detection System using Deep Learning

An end-to-end medical AI application that combines a cross-platform mobile frontend with a production-ready Deep Learning backend to classify skin lesions into multiple diagnostic categories.

## 📱 Project Architecture
* **Frontend App:** A React Native mobile application built with the Expo framework, featuring user authentication, image capture, and intuitive results screens.
* **Backend API:** A Flask-based REST API that receives images, processes them, and serves predictions from an integrated computer vision pipeline.

## 🚀 Deep Learning Features
* **Dataset Utilization:** Trained and validated using the **HAM10000** dataset (Human Against Machine), containing 10,015 dermatoscopic images.
* **Model Architecture:** Implemented a multi-layer **Convolutional Neural Network (CNN)** optimized for extracting fine lesion textures and structural edge features.
* **Image Preprocessing:** Handled image resizing, normalization, and data augmentation techniques to balance highly skewed class distributions.
* **Performance Evaluation:** Validated using multi-class Confusion Matrices and detailed Classification Reports tracking Precision, Recall, and F1-Scores.

## 🛠️ Tech Stack
* **Mobile Frontend:** React Native, Expo, JavaScript, Firebase Authentication
* **AI Backend & API:** Python, Flask, TensorFlow, Keras, OpenCV
* **Data & Analytics:** NumPy, Pandas, Matplotlib, Seaborn

## 🔧 How to Run Local Environment
1. **Start Backend Server:** Navigate to your backend environment and run:
   ```bash
   python cnn_model/app.py
