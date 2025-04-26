import React, {useEffect, useState} from 'react';
import {useParams, useNavigate, useLocation} from 'react-router-dom';
import {getAllItems} from '../data/items.jsx';
import './ItemDetail.css';

const ItemDetail = () => {
    // Get URL parameters and router hooks
    const {category, id} = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Component state
    const [item, setItem] = useState(null);
    const [redirectMsg, setRedirectMsg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch item data when component mounts or parameters change
    useEffect(() => {
        if (location.state?.redirectMsg) setRedirectMsg(location.state.redirectMsg);

        setLoading(true);
        getAllItems().then(allItems => {
            const foundItem = allItems.find(i => i.id === id && i.category === category);
            setItem(foundItem);
            setLoading(false);
        }).catch(err => {
            console.error("Error fetching items:", err);
            setError("Failed to load item details. Please try again.");
        });
    }, [category, id, location.state]);

    // Conditional rendering based on state
    if (loading) return <div className="detail-loading">Loading item details...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!item) return <div className="notfound">Item not found!</div>;

    // Handle the purchase/rental process
    const handleBuy = async () => {
        try {
            // Check Firebase initialization
            const firebase = window.firebase;
            if (!firebase) throw new Error("Firebase is not initialized");

            // Verify user is logged in
            const user = firebase.auth().currentUser;
            if (!user) {
                navigate('/signin', {state: {redirectMsg: "To purchase you must be signed in as a renter."}});
                return;
            }

            // Verify user has a profile and is a renter
            const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
            if (!userDoc.exists) {
                alert("User profile not found.");
                return;
            }
            const userData = userDoc.data();
            if (userData.role !== 'renter') {
                navigate('/signin', {state: {redirectMsg: "To purchase you must be a renter."}});
                return;
            }

            // Get vendor information
            let vendorFullName = item.vendor || 'Unknown Vendor';
            if (item.vendorId) {
                const vendorDoc = await firebase.firestore().collection('users').doc(item.vendorId).get();
                if (vendorDoc.exists) vendorFullName = vendorDoc.data().fullName || vendorFullName;
            }

            // Prepare rental data
            const rentedItemData = {
                productName: item.name,
                price: item.price,
                vendorFullName,
                renterFullName: userData.fullName || user.displayName || user.email,
                renterEmail: user.email,
                status: 'active',
                paid: false,
                itemId: item.id,
                category: item.category,
                description: item.description || "",
                userId: user.uid,
                rentedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            // Save rental to database and redirect
            await firebase.firestore().collection('rentedItems').add(rentedItemData);
            alert('Item successfully rented!');
            navigate('/DashboardRenter');
        } catch (error) {
            console.error("Error processing purchase:", error);
            alert('Failed to process rental: ' + error.message);
        }
    };

    // Render item details
    return (<div className="detail-container">
        {/* Display redirect message if present */}
        {redirectMsg && <div className="redirect-msg error">{redirectMsg}</div>}
        <button className="back" onClick={() => navigate(-1)}>← Back</button>
        <div className="blocks">
            {/* Item image section */}
            <div className="block image-block">
                {item.image ? <img src={item.image} alt={item.name}/> :
                    <div className="no-image">No photo available</div>}
            </div>
            {/* Item details section */}
            <div className="block details-block">
                <h2>{item.name}</h2>
                <p className="info">Category: <span>{item.category}</span></p>
                <p className="info">Price: <span>{item.price}</span></p>
                <p className={`info status-info ${item.status}`}>Status: <span>{item.status === 'available' ? 'Available' : 'Rented'}</span>
                </p>
                <p className="description">{item.description}</p>
                <button className="buy-button" onClick={handleBuy}
                        disabled={item.status !== 'available'}>
                    {item.status === 'available' ? 'Buy' : 'Not Available'}
                </button>
            </div>
        </div>
    </div>);
};

export default ItemDetail;
