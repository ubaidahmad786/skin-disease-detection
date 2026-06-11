import os
import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import confusion_matrix, classification_report, precision_recall_curve, roc_curve, auc
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import ImageDataGenerator

def create_test_generator(test_data_path, batch_size):
    test_datagen = ImageDataGenerator(rescale=1./255)
    test_generator = test_datagen.flow_from_directory(
        test_data_path,
        target_size=(60, 60),
        batch_size=batch_size,
        class_mode='categorical',
        shuffle=False
    )
    return test_generator

if __name__ == "__main__":
    # Define paths and parameters
    path_to_test = "E:\\Projects\\Computer Vision\\DermVision\\Skin Disease Dataset\\base_dir\\train_dir"
    batch_size = 64

    # Load the trained model
    model = load_model('./Models/best_model.h5')

    # Create test generator
    test_generator = create_test_generator(path_to_test, batch_size)

    # Evaluate model
    test_loss, test_accuracy = model.evaluate(test_generator)
    print(f"Test Accuracy: {test_accuracy}")

    # Generate predictions
    y_pred_prob = model.predict(test_generator)
    y_pred = np.argmax(y_pred_prob, axis=1)
    test_labels = test_generator.classes

    # Generate confusion matrix
    cm = confusion_matrix(test_labels, y_pred)

    # Print classification report
    print("Classification Report:")
    print(classification_report(test_labels, y_pred))

    # Plot confusion matrix
    plt.figure(figsize=(8, 6))
    plt.imshow(cm, interpolation='nearest', cmap=plt.cm.Blues)
    plt.title('Confusion Matrix')
    plt.colorbar()
    tick_marks = np.arange(test_generator.num_classes)
    plt.xticks(tick_marks, range(test_generator.num_classes))
    plt.yticks(tick_marks, range(test_generator.num_classes))
    plt.xlabel('Predicted Label')
    plt.ylabel('True Label')
    plt.show()

    # Plot precision-recall curve for each class
    precision = dict()
    recall = dict()
    for i in range(test_generator.num_classes):
        precision[i], recall[i], _ = precision_recall_curve(test_labels == i, y_pred_prob[:, i])
        plt.plot(recall[i], precision[i], lw=2, label='class {}'.format(i))
    plt.xlabel("Recall")
    plt.ylabel("Precision")
    plt.legend(loc="best")
    plt.title("Precision-Recall Curve")
    plt.show()

    # Plot ROC curve for each class
    fpr = dict()
    tpr = dict()
    roc_auc = dict()
    for i in range(test_generator.num_classes):
        fpr[i], tpr[i], _ = roc_curve(test_labels == i, y_pred_prob[:, i])
        roc_auc[i] = auc(fpr[i], tpr[i])
        plt.plot(fpr[i], tpr[i], lw=2, label='class {}'.format(i))
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.legend(loc="best")
    plt.title("ROC Curve")
    plt.show()
