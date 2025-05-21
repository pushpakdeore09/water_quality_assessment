# app/firebase.py
import pyrebase

firebase_config = {
    "apiKey": "AIzaSyCUg_atHRlvyRFKfPFN5L_h_9xS_17XdOk",
    "authDomain": "water-assessment-293c6.firebaseapp.com",
    "databaseURL": "https://water-assessment-293c6-default-rtdb.firebaseio.com/",
    "storageBucket": "water-assessment-293c6.firebasestorage.app"
}

firebase = pyrebase.initialize_app(firebase_config)
db = firebase.database()
