import os
import pandas as pd
import joblib

# ─── Load Models & Scalers ─────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

model_young = joblib.load(os.path.join(MODELS_DIR, "model_young.joblib"))
model_rest = joblib.load(os.path.join(MODELS_DIR, "model_rest.joblib"))
scaler_young = joblib.load(os.path.join(MODELS_DIR, "scaler_young.joblib"))
scaler_rest = joblib.load(os.path.join(MODELS_DIR, "scaler_rest.joblib"))


def calculate_normalized_risk(medical_history: str) -> float:
    """Calculate normalised risk score from medical history string."""
    risk_scores = {
        "diabetes": 6,
        "heart disease": 8,
        "high blood pressure": 6,
        "thyroid": 5,
        "no disease": 0,
        "none": 0,
    }
    diseases = medical_history.lower().split(" & ")
    total_risk_score = sum(risk_scores.get(d.strip(), 0) for d in diseases)

    max_score = 14  # heart disease (8) + diabetes/high bp (6)
    normalized_risk_score = total_risk_score / max_score
    return normalized_risk_score


def preprocess_input(input_dict: dict) -> pd.DataFrame:
    """Convert raw input dict into model-ready DataFrame."""
    expected_columns = [
        "age", "number_of_dependants", "income_lakhs", "insurance_plan",
        "genetical_risk", "normalized_risk_score",
        "gender_Male", "region_Northwest", "region_Southeast", "region_Southwest",
        "marital_status_Unmarried",
        "bmi_category_Obesity", "bmi_category_Overweight", "bmi_category_Underweight",
        "smoking_status_Occasional", "smoking_status_Regular",
        "employment_status_Salaried", "employment_status_Self-Employed",
    ]

    insurance_plan_encoding = {"Bronze": 1, "Silver": 2, "Gold": 3}
    df = pd.DataFrame(0, columns=expected_columns, index=[0])

    for key, value in input_dict.items():
        if key == "Gender" and value == "Male":
            df["gender_Male"] = 1
        elif key == "Region":
            col = f"region_{value}"
            if col in df.columns:
                df[col] = 1
        elif key == "Marital Status" and value == "Unmarried":
            df["marital_status_Unmarried"] = 1
        elif key == "BMI Category":
            col = f"bmi_category_{value}"
            if col in df.columns:
                df[col] = 1
        elif key == "Smoking Status":
            col = f"smoking_status_{value}"
            if col in df.columns:
                df[col] = 1
        elif key == "Employment Status":
            col = f"employment_status_{value}"
            if col in df.columns:
                df[col] = 1
        elif key == "Insurance Plan":
            df["insurance_plan"] = insurance_plan_encoding.get(value, 1)
        elif key == "Age":
            df["age"] = value
        elif key == "Number of Dependants":
            df["number_of_dependants"] = value
        elif key == "Income in Lakhs":
            df["income_lakhs"] = value
        elif key == "Genetical Risk":
            df["genetical_risk"] = value

    df["normalized_risk_score"] = calculate_normalized_risk(input_dict.get("Medical History", "No Disease"))
    df = handle_scaling(input_dict["Age"], df)
    return df


def handle_scaling(age: int, df: pd.DataFrame) -> pd.DataFrame:
    """Apply the correct scaler based on age."""
    scaler_object = scaler_young if age <= 25 else scaler_rest

    columns_to_scale = scaler_object["columns_to_scale"]
    scaler = scaler_object["scaler"]

    # The scaler expects an 'income_level' column — add it temporarily
    df["income_level"] = None
    df[columns_to_scale] = scaler.transform(df[columns_to_scale])
    df.drop("income_level", axis="columns", inplace=True)

    return df


def predict(input_dict: dict) -> float:
    """Run prediction and return the estimated premium."""
    input_df = preprocess_input(input_dict)

    if input_dict["Age"] <= 25:
        prediction = model_young.predict(input_df)
    else:
        prediction = model_rest.predict(input_df)

    return round(float(prediction[0]), 2)
