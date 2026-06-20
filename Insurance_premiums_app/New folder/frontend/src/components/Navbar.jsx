import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="w-full px-6 py-4 flex items-center justify-between"
            style={{
                background: 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
            }}>
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}>
                    🏥
                </div>
                <span className="text-lg font-bold bg-clip-text text-transparent"
                    style={{ backgroundImage: 'linear-gradient(135deg, #818cf8, #06b6d4)' }}>
                    HealthPredict AI
                </span>
            </div>

            {/* User section */}
            <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg"
                    style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)', color: 'white' }}>
                        {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-sm font-medium" style={{ color: '#c7d2fe' }}>
                        {user.full_name || 'User'}
                    </span>
                </div>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer"
                    style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#fca5a5',
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                        e.target.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                        e.target.style.borderColor = 'rgba(239, 68, 68, 0.2)';
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
