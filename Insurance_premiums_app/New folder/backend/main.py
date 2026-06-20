from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from database import engine, get_db, Base
from models import User
from schemas import UserCreate, UserOut, Token, PredictionInput, PredictionOutput
from auth import hash_password, verify_password, create_access_token, get_current_user

from prediction_helper import predict

# ─── Create Tables ──────────────────────────────────────────────
Base.metadata.create_all(bind=engine)

# ─── App ────────────────────────────────────────────────────────
app = FastAPI(
    title="Health Insurance Premium Predictor",
    description="Predict health insurance premiums using ML models with JWT authentication",
    version="1.0.0",
)

# ─── CORS ───────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ═══════════════════════════════════════════════════════════════
#  AUTH ENDPOINTS
# ═══════════════════════════════════════════════════════════════

@app.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    new_user = User(
        full_name=user.full_name,
        email=user.email,
        hashed_password=hash_password(user.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Authenticate and return a JWT token."""
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/me", response_model=UserOut)
def read_current_user(current_user: User = Depends(get_current_user)):
    """Return the currently authenticated user."""
    return current_user


# ═══════════════════════════════════════════════════════════════
#  PREDICTION ENDPOINT
# ═══════════════════════════════════════════════════════════════

@app.post("/predict", response_model=PredictionOutput)
def predict_premium(
    data: PredictionInput,
    current_user: User = Depends(get_current_user),
):
    """Predict health insurance premium (protected route)."""
    input_dict = {
        "Age": data.age,
        "Number of Dependants": data.number_of_dependants,
        "Income in Lakhs": data.income_lakhs,
        "Genetical Risk": data.genetical_risk,
        "Insurance Plan": data.insurance_plan,
        "Employment Status": data.employment_status,
        "Gender": data.gender,
        "Marital Status": data.marital_status,
        "BMI Category": data.bmi_category,
        "Smoking Status": data.smoking_status,
        "Region": data.region,
        "Medical History": data.medical_history,
    }
    predicted = predict(input_dict)
    return {"predicted_premium": predicted}


# ─── Health Check ───────────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "Health Insurance Premium Predictor API is running 🚀"}
