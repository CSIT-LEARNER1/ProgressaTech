import React, {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {FaHome} from "react-icons/fa";
import {RxActivityLog} from "react-icons/rx";
import {IoPersonOutline} from "react-icons/io5";
import './Navbar.css';

// Navbar component
const Navbar = () => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const navigate = useNavigate();

    // Toggle dropdown menu
    const toggleDropdown = () => setDropdownVisible(!isDropdownVisible);

    useEffect(() => {
        // Listen for sign-in state changes via Firebase auth
        const unsubscribe = window.firebase.auth().onAuthStateChanged(async (u) => {
            setUser(u);
            if (u) {
                // Lookup role in Firestore for this user
                const userDoc = await window.firebase.firestore().collection('users').doc(u.uid).get();
                setRole(userDoc.data().role);
            } else {
                setRole(null);
            }
        });
        return () => {
            if (typeof unsubscribe === "function") unsubscribe();
        };
    }, []);

    // Sign out
    const handleSignOut = async () => {
        await window.firebase.auth().signOut();
        setUser(null);
        setRole(null);
        setDropdownVisible(false);
        navigate('/'); // Redirect to home after sign out
    };

    return (
        <nav className="navbar">
            <ul className="navbar__links">
                <li className="navbar__item">
                    <Link to="/"><FaHome size={30}/></Link>
                </li>
                <li className="navbar__item">
                    <Link to="/about"> <RxActivityLog size={25}/> </Link>
                </li>
                <li className="navbar__item">
                    <div className="navbar__profile" onClick={toggleDropdown}>
                        <IoPersonOutline size={30}
                                         style={{alignItems: 'center', justifyContent: 'center'}}/>
                        <span style={{marginLeft: '7px'}}></span>
                        {isDropdownVisible && (
                            <ul className="dropdown">
                                {/* Sign in/Sign up links if not logged in */}
                                {!user && (
                                    <>
                                        <li className="dropdown__item">
                                            <Link to="/signin"
                                                  onClick={() => setDropdownVisible(false)}>Sign
                                                In</Link>
                                        </li>
                                        <li className="dropdown__item">
                                            <Link to="/signup"
                                                  onClick={() => setDropdownVisible(false)}>Sign
                                                Up</Link>
                                        </li>
                                    </>
                                )}
                                {/* Dashboard links based on role if logged in */}
                                {user && (
                                    <>
                                        <li className="dropdown__item"
                                            style={{
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: '8px 16px'
                                            }}>
                                            {role === 'renter' ? "Renter In" : role === 'vendor' ? "Vendor In" : "Logged in"}
                                        </li>
                                        {role === 'renter' && (
                                            <li className="dropdown__item"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginLeft: '20px'
                                                }}>
                                                <Link to="/DashboardRenter"
                                                      onClick={() => setDropdownVisible(false)}>
                                                    DashboardR
                                                </Link>
                                            </li>
                                        )}
                                        {role === 'vendor' && (
                                            <li className="dropdown__item"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginLeft: '20px'
                                                }}>
                                                <Link to="/DashboardVendor"
                                                      onClick={() => setDropdownVisible(false)}>
                                                    DashboardV
                                                </Link>
                                            </li>
                                        )}
                                        <li className="dropdown__item"
                                            style={{padding: '8px 16px'}}>
                                            <button
                                                onClick={handleSignOut}
                                                style={{
                                                    cursor: 'pointer',
                                                    background: 'none',
                                                    border: 'none',
                                                    width: '100%',
                                                    textAlign: 'center',
                                                    color: 'white'
                                                }}
                                            >
                                                Sign Out
                                            </button>
                                        </li>
                                    </>
                                )}
                            </ul>
                        )}
                    </div>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;