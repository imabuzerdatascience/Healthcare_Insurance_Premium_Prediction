import { useState } from 'react';
import Navbar from '../components/Navbar';
import { predictPremium } from '../api';

const INITIAL_FORM = {
    age: 30,
    number_of_dependants: 0,
    income_lakhs: 10,
    genetical_risk: 0,
    insurance_plan: 'Bronze',
    employment_status: 'Salaried',
    gender: 'Male',
    marital_status: 'Married',
    bmi_category: 'Normal',
    smoking_status: 'No Smoking',
    region: 'Northwest',
    medical_history: 'No Disease',
};

const OPTIONS = {
    gender: ['Male', 'Female'],
    marital_status: ['Married', 'Unmarried'],
    bmi_category: ['Normal', 'Obesity', 'Overweight', 'Underweight'],
    smoking_status: ['No Smoking', 'Regular', 'Occasional'],
    employment_status: ['Salaried', 'Self-Employed', 'Freelancer'],
    region: ['Northwest', 'Southeast', 'Northeast', 'Southwest'],
    insurance_plan: ['Bronze', 'Silver', 'Gold'],
    medical_history: [
        'No Disease', 'Diabetes', 'High blood pressure',
        'Diabetes & High blood pressure', 'Thyroid', 'Heart disease',
        'High blood pressure & Heart disease', 'Diabetes & Thyroid',
        'Diabetes & Heart disease',
    ],
};

const FIELD_META = [
    { key: 'age', label: '🎂 Age', type: 'number', min: 18, max: 100 },
    { key: 'number_of_dependants', label: '👨‍👩‍👧 Dependants', type: 'number', min: 0, max: 20 },
    { key: 'income_lakhs', label: '💰 Income (Lakhs)', type: 'number', min: 0, max: 200 },
    { key: 'genetical_risk', label: '🧬 Genetical Risk', type: 'number', min: 0, max: 5 },
    { key: 'insurance_plan', label: '📄 Insurance Plan', type: 'select' },
    { key: 'employment_status', label: '💼 Employment', type: 'select' },
    { key: 'gender', label: '⚧ Gender', type: 'select' },
    { key: 'marital_status', label: '💍 Marital Status', type: 'select' },
    { key: 'bmi_category', label: '⚖️ BMI Category', type: 'select' },
    { key: 'smoking_status', label: '🚭 Smoking Status', type: 'select' },
    { key: 'region', label: '🌍 Region', type: 'select' },
    { key: 'medical_history', label: '🏥 Medical History', type: 'select' },
];

const Dashboard = () => {
    const [form, setForm] = useState(INITIAL_FORM);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: ['age', 'number_of_dependants', 'income_lakhs', 'genetical_risk'].includes(name)
                ? Number(value)
                : value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.age < 18 || form.age > 100) {
            setError('Age must be between 18 and 100');
            return;
        }
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const res = await predictPremium(form);
            setResult(res.data.predicted_premium);
        } catch (err) {
            setError(err.response?.data?.detail || 'Prediction failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setForm(INITIAL_FORM);
        setResult(null);
        setError('');
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 px-4 py-8 relative">
                <div className="bg-orbs" />
                <div className="max-w-5xl mx-auto relative z-10">

                    {/* Page Title */}
                    <div className="text-center mb-8 fade-in">
                        <h1 className="text-3xl sm:text-4xl font-bold mb-2"
                            style={{ backgroundImage: 'linear-gradient(135deg, #e0e7ff, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Premium Prediction
                        </h1>
                        <p style={{ color: '#94a3b8' }}>
                            Fill in your details below and get an AI-predicted insurance premium instantly
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="glass-card p-6 sm:p-8 fade-in">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {FIELD_META.map(({ key, label, type, min, max }) => (
                                    <div key={key}>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#c7d2fe' }}>
                                            {label}
                                        </label>
                                        {type === 'number' ? (
                                            <input
                                                type="number"
                                                name={key}
                                                value={form[key]}
                                                onChange={handleChange}
                                                min={min}
                                                max={max}
                                                className="input-field"
                                            />
                                        ) : (
                                            <select
                                                name={key}
                                                value={form[key]}
                                                onChange={handleChange}
                                                className="input-field"
                                            >
                                                {OPTIONS[key].map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="mt-5 px-4 py-3 rounded-lg text-sm fade-in"
                                    style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}>
                                    {error}
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="flex gap-3 mt-6">
                                <button type="submit" className="btn-primary flex-1" disabled={loading}>
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="spinner" /> Predicting...
                                        </span>
                                    ) : (
                                        '🔮 Predict Premium'
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer"
                                    style={{
                                        background: 'rgba(100, 116, 139, 0.15)',
                                        border: '1px solid rgba(100, 116, 139, 0.25)',
                                        color: '#94a3b8',
                                    }}
                                    onMouseEnter={(e) => { e.target.style.background = 'rgba(100, 116, 139, 0.25)'; }}
                                    onMouseLeave={(e) => { e.target.style.background = 'rgba(100, 116, 139, 0.15)'; }}
                                >
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* ═══ Result Card ═══ */}
                    {result !== null && (
                        <div className="mt-8 glass-card p-8 text-center result-glow fade-in"
                            style={{ borderColor: 'rgba(16, 185, 129, 0.25)' }}>
                            <div className="mb-2" style={{ color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                Estimated Annual Premium
                            </div>
                            <div className="text-5xl sm:text-6xl font-extrabold mb-3"
                                style={{ backgroundImage: 'linear-gradient(135deg, #10b981, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                ₹{result.toLocaleString('en-IN')}
                            </div>
                            <p style={{ color: '#64748b', fontSize: '0.8rem' }}>
                                Based on the {form.age <= 25 ? 'Young' : 'General'} population ML model
                            </p>

                            {/* Quick Summary */}
                            <div className="flex flex-wrap justify-center gap-3 mt-5">
                                {[
                                    { label: 'Age', value: form.age },
                                    { label: 'Plan', value: form.insurance_plan },
                                    { label: 'Smoking', value: form.smoking_status },
                                    { label: 'BMI', value: form.bmi_category },
                                    { label: 'Region', value: form.region },
                                ].map(({ label, value }) => (
                                    <span key={label} className="px-3 py-1 rounded-full text-xs"
                                        style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.15)', color: '#a5b4fc' }}>
                                        {label}: <strong>{value}</strong>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

export default Dashboard;
