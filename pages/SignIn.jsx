// SignIn.jsx
// SignIn.jsx - Component for user authentication
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';

const SignIn = () => {
    // State variables for form inputs and UI feedback
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    // Handle form submission and authentication
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Authenticate user with Firebase
            const userCredential = await window.firebase
                .auth()
                .signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Fetch user role from Firestore database
            const userDoc = await window.firebase
                .firestore()
                .collection('users')
                .doc(user.uid)
                .get();
            const { role } = userDoc.data();

            // Update UI with success message
            setIsSuccess(true);
            setMessage('Sign In Successful!');

            // Redirect user based on their role
            if (role === 'renter') {
                navigate('/DashboardRenter');
            } else {
                navigate('/DashboardVendor');
            }
        } catch (error) {
            // Handle authentication errors
            setIsSuccess(false);
            setMessage(error.message);
        }
    };

    return (
        <div className="signin-container">
            {/* Sign in form */}
            <form onSubmit={handleSubmit} className="signin-form">
                <h2>Sign In</h2>

                {/* Email input field */}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="signin-input"
                    required
                />

                {/* Password input with show/hide toggle */}
                <div className="password-field-wrapper" style={{ position: 'relative' }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="signin-input"
                        required
                        autoComplete="current-password"
                    />
                    {/* Toggle button for password visibility */}
                    <button
                        type="button"
                        className="eye-toggle-btn"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword(prev => !prev)}
                        tabIndex={0}
                        style={{
                            position: 'absolute',
                            right: 10,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0
                        }}
                    >
                        {showPassword ? (
                            // Eye Open SVG
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
                                <path stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"/>
                                <circle cx="12" cy="12" r="3" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        ) : (
                            // Eye Closed SVG
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
                                <path stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.77 21.77 0 0 1 5.06-6.06M9.53 9.53A3.001 3.001 0 0 0 12 15a3 3 0 0 0 2.47-5.47"/>
                                <path stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M1 1l22 22"/>
                            </svg>
                        )}
                    </button>
                </div>

                {/* Submit button */}
                <button type="submit" className="signin-button">
                    Sign In
                </button>

                {/* Success/Error message display */}
                {message && (
                    <p className={`signin-message ${isSuccess ? 'success' : 'error'}`}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
};

export default SignIn;
