import os
import pandas as pd
import librosa
import glob
import numpy as np
from sklearn.preprocessing import LabelEncoder
import resampy
from keras.models import model_from_json
from flask import Flask, jsonify

lb = LabelEncoder()
json_file = open("model.json", "r")
loaded_model_json = json_file.read()
json_file.close()
loaded_model = model_from_json(loaded_model_json)
# load weights into new model
loaded_model.load_weights("Emotion_Voice_Detection_Model.h5")
print("Loaded model from disk")

# # evaluate loaded model on test data
# loaded_model.compile(loss='categorical_crossentropy', optimizer=opt, metrics=['accuracy'])
app = Flask(__name__)


mood_dict = {
    0 : "female_angry",
    1 : "female_calm",
    2 : "female_fearful",
    3 : "female_happy",
    4 : "female_sad",
    5 : "male_angry",
    6 : "male_calm",
    7 : "male_fearful",
    8 : "male_happy",
    9 : "male_sad"
}

@app.route("/audio_analysis/<filename>", methods=["GET"])
def analyse_audio_file(filename):
    data, sampling_rate = librosa.load(filename)

    X, sample_rate = librosa.load(filename, res_type='kaiser_fast',duration=2.5,sr=22050*2,offset=0.5)
    sample_rate = np.array(sample_rate)
    mfccs = np.mean(librosa.feature.mfcc(y=X, sr=sample_rate, n_mfcc=13),axis=0)
    featurelive = mfccs
    livedf2 = featurelive
    livedf2= pd.DataFrame(data=livedf2)
    livedf2 = livedf2.stack().to_frame().T
    twodim= np.expand_dims(livedf2, axis=2)
    livepreds = loaded_model.predict(twodim,
                            batch_size=32,
                            verbose=1)
    livepreds1 = livepreds.argmax(axis=1)

    # Return the response as JSON
    return jsonify({"response": mood_dict[livepreds1]})


if __name__ == "__main__":
    app.run(debug=True)
