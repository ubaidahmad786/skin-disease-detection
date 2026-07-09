import os
import glob
from sklearn.model_selection import train_test_split
import shutil
import csv
from tensorflow.keras.preprocessing.image import ImageDataGenerator

def create_generators(batch_size, train_data_path, val_data_path, test_data_path):

    preprocessor = ImageDataGenerator(
        rescale = 1/255.
    )

    train_generator = preprocessor.flow_from_directory(
        train_data_path,
        class_mode = 'categorical',
        target_size = (60,60),
        color_mode = 'rgb',
        shuffle = True,
        batch_size = batch_size
    )

    val_generator = preprocessor.flow_from_directory(
        val_data_path,
        class_mode = 'categorical',
        target_size = (60,60),
        color_mode = 'rgb',
        shuffle = False,
        batch_size = batch_size
    )

    test_generator = preprocessor.flow_from_directory(
        test_data_path,
        class_mode = 'categorical',
        target_size = (60,60),
        color_mode = 'rgb',
        shuffle = False,
        batch_size = batch_size
    )

    return train_generator, val_generator, test_generator
