from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# ─── Auth Schemas ───────────────────────────────────────────────
class UserCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    full_name: str
    email: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


# ─── Prediction Schemas ────────────────────────────────────────
class PredictionInput(BaseModel):
    age: int = Field(..., ge=18, le=100, description="Age of the person")
    number_of_dependants: int = Field(..., ge=0, le=20, description="Number of dependants")
    income_lakhs: int = Field(..., ge=0, le=200, description="Annual income in Lakhs")
    genetical_risk: int = Field(..., ge=0, le=5, description="Genetical risk score (0-5)")
    insurance_plan: str = Field(..., description="Bronze / Silver / Gold")
    employment_status: str = Field(..., description="Salaried / Self-Employed / Freelancer")
    gender: str = Field(..., description="Male / Female")
    marital_status: str = Field(..., description="Married / Unmarried")
    bmi_category: str = Field(..., description="Normal / Obesity / Overweight / Underweight")
    smoking_status: str = Field(..., description="No Smoking / Regular / Occasional")
    region: str = Field(..., description="Northwest / Southeast / Northeast / Southwest")
    medical_history: str = Field(..., description="E.g. 'No Disease', 'Diabetes', 'Diabetes & Heart disease'")


class PredictionOutput(BaseModel):
    predicted_premium: float
