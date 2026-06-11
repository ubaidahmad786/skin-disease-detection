import os
import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import confusion_matrix, classification_report, precision_recall_curve, roc_curve, auc
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.preprocessing.image import ImageDataGenerator

def create_generators(batch_size, train_data_path, val_data_path, test_data_path):
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True
    )

    val_datagen = ImageDataGenerator(rescale=1./255)
    test_datagen = ImageDataGenerator(rescale=1./255)

    train_generator = train_datagen.flow_from_directory(
        train_data_path,
        target_size=(60, 60),
        batch_size=batch_size,
        class_mode='categorical'
    )

    val_generator = val_datagen.flow_from_directory(
        val_data_path,
        target_size=(60, 60),
        batch_size=batch_size,
        class_mode='categorical'
    )

    test_generator = test_datagen.flow_from_directory(
        test_data_path,
        target_size=(60, 60),
        batch_size=batch_size,
        class_mode='categorical',
        shuffle=False
    )

    return train_generator, val_generator, test_generator

def derm_Vision(num_classes):
    model = Sequential([
        Conv2D(32, (3, 3), activation='relu', input_shape=(60, 60, 3)),
        MaxPooling2D((2, 2)),
        Conv2D(64, (3, 3), activation='relu'),
        MaxPooling2D((2, 2)),
        Conv2D(128, (3, 3), activation='relu'),
        MaxPooling2D((2, 2)),
        Flatten(),
        Dense(256, activation='relu'),
        Dropout(0.5),
        Dense(num_classes, activation='softmax')
    ])
    return model

if __name__ == "__main__":
    # Define paths and parameters
    path_to_train = "E:\\Projects\Computer Vision\\DermVision\\Skin Disease Dataset\\base_dir\\train_dir"
    path_to_val = "E:\\Projects\\Computer Vision\\DermVision\\Skin Disease Dataset\\base_dir\\val_dir"
    path_to_test = "E:\\Projects\\Computer Vision\\DermVision\\Skin Disease Dataset\\base_dir\\val_dir"
    batch_size = 64
    epochs = 50

    # Create data generators
    train_generator, val_generator, test_generator = create_generators(batch_size, path_to_train, path_to_val, path_to_test)

    # Define model
    model = derm_Vision(num_classes=train_generator.num_classes)
    
    # Compile model
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

    # Define callbacks
    checkpoint = ModelCheckpoint(filepath='./Models/best_model.h5', monitor='val_accuracy', save_best_only=True, verbose=1)
    early_stopping = EarlyStopping(monitor='val_accuracy', patience=10, verbose=1)
    reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=5, min_lr=0.0001, verbose=1)

    # Train model
    history = model.fit(
        train_generator,
        epochs=epochs,
        batch_size=batch_size,
        validation_data=val_generator,
        callbacks=[checkpoint, early_stopping, reduce_lr]
    )

    # Plot training and validation accuracy
    plt.plot(history.history['accuracy'], label='Training Accuracy')
    plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.legend()
    plt.title('Training and Validation Accuracy')
    plt.show()

    # Plot training and validation loss
    plt.plot(history.history['loss'], label='Training Loss')
    plt.plot(history.history['val_loss'], label='Validation Loss')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    plt.title('Training and Validation Loss')
    plt.show()

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
    tick_marks = np.arange(train_generator.num_classes)
    plt.xticks(tick_marks, range(train_generator.num_classes))
    plt.yticks(tick_marks, range(train_generator.num_classes))
    plt.xlabel('Predicted Label')
    plt.ylabel('True Label')
    plt.show()

    # Plot precision-recall curve
    precision = dict()
    recall = dict()
    for i in range(train_generator.num_classes):
        precision[i], recall[i], _ = precision_recall_curve(test_labels[:, i], y_pred_prob[:, i])
        plt.plot(recall[i], precision[i], lw=2, label='class {}'.format(i))
    plt.xlabel("Recall")
    plt.ylabel("Precision")
    plt.legend(loc="best")
    plt.title("Precision-Recall Curve")
    plt.show()

    # Plot ROC curve
    fpr = dict()
    tpr = dict()
    roc_auc = dict()
    for i in range(train_generator.num_classes):
        fpr[i], tpr[i], _ = roc_curve(test_labels[:, i], y_pred_prob[:, i])
        roc_auc[i] = auc(fpr[i], tpr[i])
        plt.plot(fpr[i], tpr[i], lw=2, label='class {}'.format(i))
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.legend(loc="best")
    plt.title("ROC Curve")
    plt.show()
