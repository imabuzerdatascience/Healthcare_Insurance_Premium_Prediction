# Healthcare Insurance Premium Prediction (Regression)

## Project Overview
This project aims to predict healthcare insurance premiums using regression techniques based on customer demographic and health-related attributes. Accurate premium prediction helps insurance companies optimize pricing strategies and manage financial risk.

## Business Problem
Healthcare insurance premiums vary significantly across individuals. Traditional pricing methods may not capture complex relationships between health factors and costs. This project applies data-driven regression models to improve premium estimation.

## Dataset
- Target Variable: Insurance Premium
- Features:
  - Age
  - BMI
  - Smoking Status
  - Region
  - Number of Dependents

## Exploratory Data Analysis (EDA)
- Analyzed premium distribution
- Studied impact of smoking and age on insurance cost
- Used correlation heatmaps and pairplots to understand relationships

## Data Preprocessing
- Handled missing values
- Encoded categorical variables
- Feature scaling using StandardScaler
- Removed multicollinearity using Variance Inflation Factor (VIF)

## Model Building
- Linear Regression
- Ridge Regression
- Lasso Regression
- XGBoost
- Decsion tree

## Model Evaluation
- R² Score
- Mean Squared Error (MSE)

The final model achieved strong performance with high explanatory power.

## Key Insights
- Smoking status is the strongest predictor of insurance premiums
- Age and BMI significantly influence premium cost
- VIF-based feature selection improved model stability

## Tools & Technologies
- Python
- Pandas, NumPy
- Matplotlib, Seaborn
- Scikit-learn

## Future Enhancements
- Implement ensemble models
- Deploy as a web application
- Add more detailed health indicators

