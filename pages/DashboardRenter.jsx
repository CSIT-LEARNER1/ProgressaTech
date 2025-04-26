import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './DashboardRenter.css';

const DashboardRenter = () => {
    // Keep track of the active menu item
    const [activeMenu, setActiveMenu] = useState('overview');

    // Keep track of the rented items
    const [rentedItems, setRentedItems] = useState([]);

    // Keep track of whether we're loading or not
    const [loading, setLoading] = useState(true);

    // Keep track of the user's email
    const [userEmail, setUserEmail] = useState(null);

    // Keep track of any errors
    const [error, setError] = useState(null);

    // Set up a listener for when the user signs in or out
    useEffect(() => {
        const unsubscribe = window.firebase.auth().onAuthStateChanged((user) => {
            setUserEmail(user ? user.email : null);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Fetch the rented items when the user signs in
    useEffect(() => {
        const fetchRentedItems = async () => {
            setLoading(true);
            try {
                const querySnapshot = await window.firebase.firestore().collection("rentedItems").get();
                const items = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.renterEmail === userEmail) {
                        items.push({id: doc.id, ...data});
                    }
                });
                setRentedItems(items);
            } catch (error) {
                setError(error);
            }
            setLoading(false);
        };
        if (userEmail) fetchRentedItems();
    }, [userEmail]);

    // Handle logging out
    const handleLogout = async () => {
        await window.firebase.auth().signOut();
        navigate('/signin');
    };

    // If the user isn't signed in, redirect them to the sign in page
    if (!userEmail && !loading) {
        return (<div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded shadow text-center">
                    <h2 className="text-xl font-bold mb-4">Please Sign In</h2>
                    <p className="text-gray-600">You must be signed in to view your rented
                        items.</p>
                </div>
            </div>);
    }

    return (<div className="dashboard-container">
            <aside className="sidebar">
                <h2 className="sidebar-title"
                    style={{color: 'white', fontSize: '2.3rem'}}>Dashboard</h2>
                <nav className="sidebar-nav">
                    <button
                        className={`sidebar-btn ${activeMenu === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveMenu('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={`sidebar-btn ${activeMenu === 'items' ? 'active' : ''}`}
                        onClick={() => setActiveMenu('items')}
                    >
                        Items
                    </button>
                    <button className="sidebar-btn" onClick={handleLogout}>
                        Sign Out
                    </button>
                </nav>
            </aside>

            <main className="main-content">
                <header className="dashboard-header">
                    <h1 className="dashboard-title">
                        {userEmail ? userEmail.split('@')[0] : 'Renter'}
                    </h1>
                    <p className="dashboard-subtitle">Manage your rented items</p>
                </header>

                {activeMenu === 'overview' && (<section className="overview-section">
                        <div className="stat-card">
                            <h3 className="stat-title">Total Rented Items</h3>
                            <p className="stat-value">{rentedItems.length}</p>
                        </div>
                        <div className="stat-card">
                            <h3 className="stat-title">Active Rentals</h3>
                            <p className="stat-value">
                                {rentedItems.filter(item => item.status === 'active').length}
                            </p>
                        </div>
                        <div className="stat-card">
                            <h3 className="stat-title">Total Spent</h3>
                            <p className="stat-value">
                                Rs. {rentedItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0).toFixed(2)}
                            </p>
                        </div>
                    </section>)}

                {activeMenu === 'items' && (<section className="items-section">
                        <h2 className="section-title">Rented Items</h2>
                        {loading ? (<div
                                className="loading">Loading...</div>) : rentedItems.length === 0 ? (
                            <div className="no-items-msg">No rented items found.</div>) : (
                            <div className="items-grid">
                                {rentedItems.map((item) => (
                                    <div key={item.id} className="item-card">
                                        <h3 className="item-name">{item.productName || item.name || ""}</h3>
                                        <div className="item-detail">
                                            <span className="item-label">Category:</span>
                                            <span
                                                className="item-value">{item.category || ""}</span>
                                        </div>
                                        <div className="item-detail">
                                            <span className="item-label">Price:</span>
                                            <span
                                                className="item-value">Rs. {item.price || ""}</span>
                                        </div>
                                        <div className="item-detail">
                                            <span className="item-label">Rented At:</span>
                                            <span className="item-value">
                        {item.rentedAt && item.rentedAt.toDate ? item.rentedAt.toDate().toLocaleString() : item.rentedAt || ""}
                      </span>
                                        </div>
                                        <div className="item-detail">
                                            <span className="item-label">Status:</span>
                                            <span
                                                className={`item-status ${item.status === 'active' ? 'active' : 'inactive'}`}>
                        {item.status || ""}
                      </span>
                                        </div>
                                    </div>))}
                            </div>)}
                        {error && (<div className="error-message">
                                <strong>Error:</strong> {error.message}
                            </div>)}
                    </section>)}
            </main>
        </div>);
};

export default DashboardRenter;