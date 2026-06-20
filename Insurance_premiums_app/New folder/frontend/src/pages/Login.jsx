import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, getCurrentUser } from '../api';

const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            setError('Please fill in all fields');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await loginUser(form);
            localStorage.setItem('token', res.data.access_token);
            // Fetch user info
            const userRes = await getCurrentUser();
            localStorage.setItem('user', JSON.stringify(userRes.data));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative">
            <div className="bg-orbs" />

            <div className="auth-card w-full max-w-md p-8 fade-in relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}>
                        🏥
                    </div>
                    <h1 className="text-2xl font-bold mb-1"
                        style={{ backgroundImage: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Welcome Back
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                        Sign in to predict insurance premiums
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 px-4 py-3 rounded-lg text-sm fade-in"
                        style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}>
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#c7d2fe' }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="input-field"
                            autoComplete="email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#c7d2fe' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="input-field"
                            autoComplete="current-password"
                        />
                    </div>

                    <button type="submit" className="btn-primary mt-2" disabled={loading}>
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="spinner" /> Signing in...
                            </span>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center mt-6 text-sm" style={{ color: '#94a3b8' }}>
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold hover:underline" style={{ color: '#818cf8' }}>
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
