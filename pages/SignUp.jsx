import React, { useState } from 'react';
import './SignUp.css';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    // Form state variables
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [fullName, setFullName] = useState('');
    const [age, setAge] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('renter');
    
    // Feedback state variables
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    
    // Navigation hook
    const navigate = useNavigate();

    // Handler to redirect to sign in page
    const handleSignInRedirect = () => {
        navigate('/signin');
    };

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Password match validation
        if (password !== confirmPassword) {
            setIsSuccess(false);
            setMessage("Passwords do not match.");
            return;
        }

        try {
            // Create user authentication in Firebase
            const userCredential = await window.firebase.auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Store additional user data in Firestore
            await window.firebase.firestore().collection('users').doc(user.uid).set({
                fullName,
                age,
                phone,
                role,
                email,
            });

            // Sign the user out immediately after registration
            await window.firebase.auth().signOut();
            
            // Redirect to sign-in with a success message
            navigate('/signin', { state: { redirectMsg: 'Account created! Please sign in.' } });
        } catch (error) {
            // Handle registration errors
            setIsSuccess(false);
            setMessage(error.message);
        }
    };

    return (
        <div className="signup-container">
            <form onSubmit={handleSubmit} className="signup-form">
                <h2>Create Account</h2>

                {/* Personal information fields */}
                <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="signup-input"
                    required
                />

                <input
                    type="number"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="signup-input"
                    required
                />

                <input
                    type="text"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="signup-input"
                    required
                />

                {/* User role selection */}
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="signup-input"
                    required
                >
                    <option value="renter">Renter</option>
                    <option value="vendor">Vendor</option>
                </select>

                {/* Authentication fields */}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="signup-input"
                    required
                />

                {/* Password input fields */}
                <div className="password-field-wrapper">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="signup-input"
                        required
                    />
                </div>

                <div className="password-field-wrapper">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="signup-input"
                        required
                    />
                </div>

                {/* Password visibility toggle */}
                <div className="show-password-checkbox">
                    <input
                        type="checkbox"
                        id="showPassword"
                        checked={showPassword}
                        onChange={() => setShowPassword((prev) => !prev)}
                    />
                    <label htmlFor="showPassword"> Show Password</label>
                </div>

                {/* Submit button */}
                <button type="submit" className="signup-button">Sign Up</button>

                {/* Feedback message display */}
                {message && (
                    <p className={`signup-message ${isSuccess ? 'success' : 'error'}`}>
                        {message}
                    </p>
                )}

                {/* Sign In redirect section */}
                <div className="signup-signin-redirect">
                    <span>Already have an account? </span>
                    <button
                        type="button"
                        className="signin-redirect-button"
                        onClick={handleSignInRedirect}
                    >
                        Sign In
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SignUp;
