import pandas as pd
import joblib

Model_young = joblib.load("Artifacts\model_young.joblib")
Model_rest = joblib.load("Artifacts\model_rest.joblib")
Scaler_young = joblib.load("Artifacts\scaler_young.joblib")
Scaler_rest = joblib.load("Artifacts\scaler_rest.joblib") 

