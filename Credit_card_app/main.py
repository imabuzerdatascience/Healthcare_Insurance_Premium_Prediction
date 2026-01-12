import streamlit as st

# =========================
# Page Config
# =========================
st.set_page_config(
    page_title="Insurance Premium Prediction",
    page_icon="💰",
    layout="wide"
)

# =========================
# Title
# =========================
st.markdown(
    """
    <h1 style='text-align: center; color: #2E86C1;'>
        💰 Insurance Premium Prediction
    </h1>
    <p style='text-align: center; font-size: 18px;'>
        Enter your personal, health, and income details to predict your premium
    </p>
    """,
    unsafe_allow_html=True
)

st.divider()

# =========================
# Row 1: Basic Info
# =========================
col1, col2, col3 = st.columns(3)

with col1:
    gender = st.selectbox("👤 Gender", ['Male', 'Female'])

with col2:
    region = st.selectbox(
        "🌍 Region",
        ['Northwest', 'Southeast', 'Northeast', 'Southwest']
    )

with col3:
    marital_status = st.selectbox("💍 Marital Status", ['Unmarried', 'Married'])

# =========================
# Row 2: Personal Details
# =========================
st.subheader("🧍 Personal Details")

col4, col5, col6 = st.columns(3)

with col4:
    genetical_risk = st.selectbox(
        "🧬 Genetical Risk",
        ['Low', 'Medium', 'High']
    )

with col5:
    age = st.slider(
        "🎂 Age",
        min_value=18,
        max_value=100,
        value=30
    )

with col6:
    dependents = st.number_input(
        "👨‍👩‍👧 Number of Dependents",
        min_value=0,
        max_value=10,
        value=0,
        step=1
    )

# =========================
# Row 3: Health Info
# =========================
st.subheader("🩺 Health Information")

col7, col8, col9 = st.columns(3)

with col7:
    bmi_category = st.selectbox(
        "⚖️ BMI Category",
        ['Normal', 'Underweight', 'Overweight', 'Obesity']
    )

with col8:
    smoking_status = st.selectbox(
        "🚬 Smoking Status",
        [
            'No Smoking',
            'Does Not Smoke',
            'Not Smoking',
            'Occasional',
            'Regular',
            'Smoking=0'
        ]
    )

with col9:
    medical_history = st.selectbox(
        "🏥 Medical History",
        [
            'No Disease',
            'Diabetes',
            'High blood pressure',
            'Thyroid',
            'Heart disease',
            'Diabetes & High blood pressure',
            'Diabetes & Thyroid',
            'Diabetes & Heart disease',
            'High blood pressure & Heart disease'
        ]
    )

# =========================
# Row 4: Work & Income
# =========================
st.subheader("💼 Employment & Income")

col10, col11, col12 = st.columns(3)

with col10:
    employment_status = st.selectbox(
        "🧑‍💻 Employment Status",
        ['Salaried', 'Self-Employed', 'Freelancer']
    )

with col11:
    income_level = st.selectbox(
        "💵 Income Level",
        ['<10L', '10L - 25L', '25L - 40L', '> 40L']
    )

with col12:
    insurance_plan = st.selectbox(
        "📄 Insurance Plan",
        ['Bronze', 'Silver', 'Gold']
    )

# =========================
# Predict Button
# =========================
st.divider()

if st.button("🔮 Predict Premium"):
    pass 
   
