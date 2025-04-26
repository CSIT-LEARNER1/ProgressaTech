import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './Admin.css';

const Admin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [error, setError] = useState('');

    // Demo admin credentials
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "password123";

    const [activeSection, setActiveSection] = useState('Listings');
    const navigate = useNavigate();

    const listings = [
        {id: 1, name: 'Lehenga', status: 'Pending'},
        {id: 2, name: 'Camera', status: 'Pending'}
    ];

    const users = [
        {id: 1, username: 'Ram Bahadur', role: 'Renter'},
        {id: 2, username: 'Pinky', role: 'Vendor'}
    ];

    const approvedListings = [];

    const members = [];

    const handleAction = (type, id, action) => {
        console.log(`${action} ${type} ${id}`);
    };

    // Handle login for admin
    const handleLogin = (e) => {
        e.preventDefault();
        if (loginUsername === ADMIN_USERNAME && loginPassword === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Invalid username or password');
        }
    };

    // not authentication case
    if (!isAuthenticated) {
        return (
            <div className="admin-login-container">
                <h2>Admin Login</h2>
                <form onSubmit={handleLogin} className="admin-login-form">
                    <div>
                        <label>
                            Username:
                            <input
                                type="text"
                                value={loginUsername}
                                onChange={e => setLoginUsername(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Password:
                            <input
                                type="password"
                                value={loginPassword}
                                onChange={e => setLoginPassword(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit">Login</button>
                </form>
            </div>
        );
    }

    // if logged in
    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <h2 id="dashboard">Dashboard</h2>
                <nav>
                    <button
                        className={activeSection === 'Listings' ? 'active' : ''}
                        onClick={() => setActiveSection('Listings')}
                    >
                        Listings
                    </button>
                    <button
                        className={activeSection === 'Users' ? 'active' : ''}
                        onClick={() => setActiveSection('Users')}
                    >
                        Users
                    </button>
                    <button className="logout-btn" onClick={() => {
                        setIsAuthenticated(false);
                        setLoginUsername('');
                        setLoginPassword('');
                        setError('');
                    }}>
                        Log Out
                    </button>
                </nav>
            </aside>

            <main className="admin-main">
                <h3>{activeSection === 'Listings' ? 'Property Listings' : 'User Management'}</h3>

                {activeSection === 'Listings' ? (
                    <div className="card-grid">
                        {listings.map(item => (
                            <div key={item.id} className="card">
                                <h4>{item.name}</h4>
                                <span className={`status ${item.status.toLowerCase()}`}>
                                    {item.status}
                                </span>
                                <div className="card-actions">
                                    <button
                                        onClick={() => handleAction('listing', item.id, 'approve')}>
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction('listing', item.id, 'reject')}>
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="card-grid">
                        {users.map(user => (
                            <div key={user.id} className="card">
                                <h4>{user.username}</h4>
                                <span className={`role ${user.role.toLowerCase()}`}>
                                    {user.role}
                                </span>
                                <div className="card-actions">
                                    <button
                                        onClick={() => handleAction('user', user.id, 'promote')}>
                                        Promote
                                    </button>
                                    <button onClick={() => handleAction('user', user.id, 'remove')}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>);
};

export default Admin;
