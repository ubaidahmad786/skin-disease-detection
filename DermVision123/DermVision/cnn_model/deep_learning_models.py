import tensorflow
from tensorflow.keras.layers import Conv2D, Input, MaxPool2D, Dense, BatchNormalization, GlobalAvgPool2D, Flatten
from tensorflow.keras import Model



def derm_Vision(nbr_classes):

    my_input = Input(shape=(60,60,3))

    x = Conv2D(32,(3,3),activation='relu')(my_input)
    x = MaxPool2D()(x)
    x = BatchNormalization()(x)

    x = Conv2D(64,(3,3),activation='relu')(my_input)
    x = MaxPool2D()(x)
    x = BatchNormalization()(x)

    x = Conv2D(128,(3,3),activation='relu')(my_input)
    x = MaxPool2D()(x)
    x = BatchNormalization()(x)

    # x = Flatten()(x)
    x = GlobalAvgPool2D()(x)
    x = Dense(128, activation='relu')(x)
    x = Dense(nbr_classes, activation = 'softmax')(x)

    return Model(inputs= my_input, outputs=x)





