# 🏥 Health Insurance Premium Prediction — Full-Stack Web Application

A production-ready application that predicts health insurance premiums using ML models, with FastAPI backend, React frontend, MySQL database, and JWT authentication.

---

## 📁 Project Structure

```
├── backend/
│   ├── main.py               # FastAPI app (endpoints)
│   ├── database.py            # SQLAlchemy + MySQL
│   ├── models.py              # User ORM model
│   ├── schemas.py             # Pydantic schemas
│   ├── auth.py                # JWT + bcrypt auth
│   ├── prediction_helper.py   # ML model loading & prediction
│   ├── requirements.txt
│   ├── .env / .env.example
│   └── models/                # ML model files
│       ├── model_rest.joblib
│       ├── model_young.joblib
│       ├── scaler_rest.joblib
│       └── scaler_young.joblib
│
└── frontend/                  # React + Vite + Tailwind CSS
    └── src/
        ├── pages/             # Login, Register, Dashboard
        ├── components/        # Navbar, ProtectedRoute
        ├── api.js             # Axios + JWT interceptor
        ├── App.jsx            # Router setup
        └── main.jsx           # Entry point
```

---

## 🛠️ Prerequisites

- **Python 3.9+**
- **Node.js 18+** and **npm**
- **MySQL 8.0+** (or MariaDB)

---

## 🗄️ Step 1 — MySQL Database Setup

Open MySQL CLI or workbench and run:

```sql
CREATE DATABASE health_insurance_db;
```

> The `users` table is auto-created by SQLAlchemy when the backend starts.

---

## ⚙️ Step 2 — Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy from .env.example and update)
copy .env.example .env
```

Edit **`.env`** with your MySQL credentials:

```env
DATABASE_URL=mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/health_insurance_db
SECRET_KEY=your-super-secret-key-change-me-in-production
```

Start the backend:

```bash
uvicorn main:app --reload --port 8000
```

✅ Visit [http://localhost:8000](http://localhost:8000) — should show `{"message":"Health Insurance Premium Predictor API is running 🚀"}`

✅ API Docs at [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🎨 Step 3 — Frontend Setup

```bash
cd frontend

# Install dependencies (already done if you cloned this repo)
npm install

# Start dev server
npm run dev
```

✅ Visit [http://localhost:5173](http://localhost:5173)

---

## 🧪 Step 4 — Test the Application

### Using the UI

1. **Register** — go to `/register`, create an account
2. **Login** — go to `/login`, sign in → JWT token stored automatically
3. **Dashboard** — fill in all 12 fields and click **"Predict Premium"**
4. **Result** — see the predicted premium in Indian Rupees

### Using curl (API Testing)

```bash
# 1. Register
curl -X POST http://localhost:8000/register ^
  -H "Content-Type: application/json" ^
  -d "{\"full_name\":\"Test User\",\"email\":\"test@test.com\",\"password\":\"test123\"}"

# 2. Login (get JWT token)
curl -X POST http://localhost:8000/login ^
  -d "username=test@test.com&password=test123"

# 3. Predict (replace <TOKEN> with the access_token from step 2)
curl -X POST http://localhost:8000/predict ^
  -H "Authorization: Bearer <TOKEN>" ^
  -H "Content-Type: application/json" ^
  -d "{\"age\":30,\"number_of_dependants\":2,\"income_lakhs\":10,\"genetical_risk\":3,\"insurance_plan\":\"Gold\",\"employment_status\":\"Salaried\",\"gender\":\"Male\",\"marital_status\":\"Married\",\"bmi_category\":\"Normal\",\"smoking_status\":\"No Smoking\",\"region\":\"Northwest\",\"medical_history\":\"No Disease\"}"
```

Expected response:
```json
{
  "predicted_premium": 24567.89
}
```

---

## 🤖 How ML Integration Works

### Model Selection (Age-Based)

| Age       | Model            | Scaler            |
|-----------|------------------|-------------------|
| ≤ 25      | `model_young`    | `scaler_young`    |
| > 25      | `model_rest`     | `scaler_rest`     |

### Input Features (12 fields → 18 one-hot encoded features)

```
age, number_of_dependants, income_lakhs, insurance_plan, genetical_risk,
normalized_risk_score (calculated from medical_history),
gender_Male, region_Northwest, region_Southeast, region_Southwest,
marital_status_Unmarried, bmi_category_Obesity, bmi_category_Overweight,
bmi_category_Underweight, smoking_status_Occasional, smoking_status_Regular,
employment_status_Salaried, employment_status_Self-Employed
```

### Pipeline

1. User submits 12 raw fields via the form
2. `preprocess_input()` converts them into an 18-column DataFrame
3. `calculate_normalized_risk()` computes risk from medical history
4. `handle_scaling()` applies the age-appropriate scaler
5. The correct model (`young` or `rest`) predicts the premium
6. Result returned as JSON

---

## 🔐 Security Features

| Feature             | Implementation                     |
|---------------------|-------------------------------------|
| Password hashing    | bcrypt via Passlib                  |
| JWT authentication  | python-jose, 60-min expiry          |
| Protected routes    | Backend: FastAPI `Depends()` · Frontend: `ProtectedRoute` component |
| CORS                | Restricted to localhost origins     |
| Environment vars    | `.env` for secrets                  |

---

## 📝 License

MIT — built for educational and portfolio purposes.
