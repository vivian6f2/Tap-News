# -*- coding: utf-8 -*-
import news_cnn_model
import numpy as np
import os
import pandas as pd
import pickle
import re
import shutil
import tensorflow as tf
import nltk
from nltk import PorterStemmer

from sklearn import metrics

# the Naive Bayes model
from sklearn.naive_bayes import MultinomialNB
# function to split the data for cross-validation
from sklearn.model_selection import train_test_split
# function for transforming documents into counts
from sklearn.feature_extraction.text import CountVectorizer
# function for encoding categories
from sklearn.preprocessing import LabelEncoder

learn = tf.contrib.learn

REMOVE_PREVIOUS_MODEL = True

MODEL_OUTPUT_DIR = '../model/'
MODEL_OUTPUT_FOLDER = '../model/my_dumped_classifier.pkl'
MODEL_FEATURE_FOLDER = '../model/my_dumped_feature.pkl'
DATA_SET_FILE = '../training_data/labeled_news.csv'
VARS_FILE = '../model/vars'
VOCAB_PROCESSOR_SAVE_FILE = '../model/vocab_procesor_save_file'
MAX_DOCUMENT_LENGTH = 100
N_CLASSES = 17

# Training parms
STEPS = 200

def normalize_text(s):
    s = str(s)
    s = s.lower()
    
    # remove punctuation that is not word-internal (e.g., hyphens, apostrophes)
    s = re.sub('\s\W',' ',s)
    s = re.sub('\W\s',' ',s)
    
    # make sure we didn't introduce any double spaces
    s = re.sub('\s+',' ',s)
    s = unicode(s,errors='ignore')

    # word stemming 
    s = [PorterStemmer().stem_word(word) for word in s.split(" ")]
    s = " ".join(s)

    return s

def main(unused_argv):
    if REMOVE_PREVIOUS_MODEL:
        # Remove old model
        shutil.rmtree(MODEL_OUTPUT_DIR)
        os.mkdir(MODEL_OUTPUT_DIR)

    '''
    # Prepare training and testing data
    df = pd.read_csv(DATA_SET_FILE, header=None)
    train_df = df[0:400]
    test_df = df.drop(train_df.index)

    # x - news title, y - class
    x_train = train_df[1]
    y_train = train_df[0]
    x_test = test_df[1]
    y_test = test_df[0]
    '''
    ### brian 07/11/2017
    news = pd.read_csv("../training_data/labeled_news_title2.csv")
    
    news['TITLE'] = news['TITLE'].apply(nltk.word_tokenize)

    news['DESCRIPTION'] = news['DESCRIPTION'].apply(nltk.word_tokenize)

    news['DESCRIPTION'] = news['DESCRIPTION'] + news['TITLE']

    news['TEXT'] = [normalize_text(s) for s in news['DESCRIPTION']]

    # pull the data into vectors
    vectorizer = CountVectorizer()
    x = vectorizer.fit_transform(news['TEXT'])

    encoder = LabelEncoder()
    y = encoder.fit_transform(news['CATEGORY'])

    # split into train and test sets
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2)

    nb = MultinomialNB()
    nb.fit(x_train, y_train)

    with open(MODEL_OUTPUT_FOLDER, 'wb') as f:
        pickle.dump(nb, f)
        print "save NB model"
    with open(MODEL_FEATURE_FOLDER, 'wb') as f1:
        pickle.dump(vectorizer.vocabulary_, f1)
        print "save Vocabulary feature"
    print "nb score: ", nb.score(x_test, y_test)
    
    #loaded_model = pickle.load(open(MODEL_OUTPUT_FOLDER, 'rb'))
    #print "load model score ",loaded_model.score(x_test, y_test)
        
    ###
    # Process vocabulary
    vocab_processor = learn.preprocessing.VocabularyProcessor(MAX_DOCUMENT_LENGTH)
    #x_train = np.array(list(vocab_processor.fit_transform(x_train)))
    #x_test = np.array(list(vocab_processor.transform(x_test)))


    n_words = len(vocab_processor.vocabulary_)
    print('Total words: %d' % n_words)

    # Saving n_words and vocab_processor:
    with open(VARS_FILE, 'w') as f:
        pickle.dump(n_words, f)

    vocab_processor.save(VOCAB_PROCESSOR_SAVE_FILE)
    '''
    # Build model
    classifier = learn.Estimator(
        model_fn=news_cnn_model.generate_cnn_model(N_CLASSES, n_words),
        model_dir=MODEL_OUTPUT_DIR)

    # Train and predict
    classifier.fit(x_train, y_train, steps=STEPS)

    # Evaluate model
    y_predicted = [
        p['class'] for p in classifier.predict(x_test, as_iterable=True)
    ]

    score = metrics.accuracy_score(y_test, y_predicted)
    print('Accuracy: {0:f}'.format(score))
    '''
   


if __name__ == '__main__':
    tf.app.run(main=main)


