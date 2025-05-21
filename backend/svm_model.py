import numpy as np # type: ignore
import pandas as pd # type: ignore
import matplotlib.pyplot as plt # type: ignore
from sklearn.impute import SimpleImputer # type: ignore
from sklearn.preprocessing import StandardScaler # type: ignore
from sklearn.model_selection import train_test_split # type: ignore
from sklearn.svm import SVC # type: ignore
import pickle

# Load the dataset
df = pd.read_csv('water_quality_data.xls')

# Impute missing values with the mean
imputer = SimpleImputer(strategy='mean')
df.iloc[:, :3] = imputer.fit_transform(df.iloc[:, :3])

# Ensure columns are float before scaling
df.iloc[:, :3] = df.iloc[:, :3].astype(float)

# Standardize the first 3 columns
scaler = StandardScaler()
df.iloc[:, :3] = scaler.fit_transform(df.iloc[:, :3])

# Feature and target separation
X = df.iloc[:, :3]
Y = df['Target_Class']

# Split into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size=0.2, random_state=42)

# Train the SVM model
svm = SVC(kernel='rbf', gamma=0.4, C=1.0)
svm.fit(X_train, y_train)

# Save the model using pickle
pickle.dump(svm, open('svm_model.pkl', 'wb'))
