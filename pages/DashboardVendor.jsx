import React, {useState} from 'react';
import './DashboardVendor.css';
import {useNavigate} from 'react-router-dom';

const DashboardVendor = () => {
    // Input values
    const [form, setForm] = useState({
        productId: '',
        productName: '',
        category: '',
        price: '',
        status: 'available',
        description: ''
    });

    // Error messages
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Handle input changes
    const handleInputChange = (e) => {
        const {name, value, type} = e.target;
        let newValue = value;
        if (name === 'price') {
            newValue = type === 'number' ? Number(value) : value;
        }
        setForm((prev) => ({
            ...prev, [name]: newValue,
        }));
    };

    // Validate inputs
    const validateInputs = () => {
        const idPattern = /^[a-zA-Z0-9-_]+$/;
        if (!idPattern.test(form.productId)) return 'Invalid Product ID.';
        if (form.productName.trim().length < 2) return 'Product Name too short.';
        if (form.category.trim().length < 2) return 'Category too short.';
        const priceValue = Number(form.price);
        if (isNaN(priceValue) || priceValue <= 0) return 'Please enter a valid positive price.';
        if (form.description.trim().length < 5) return 'Description too short.';
        return null;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateInputs();
        if (validationError) {
            setMessage(validationError);
            return;
        }

        try {
            // Get the current user
            const user = window.firebase.auth().currentUser;

            if (!user) {
                setMessage('You must be signed in to add products.');
                return;
            }

            // Fetch vendor's full name from Firestore users collection
            const userDocRef = window.firebase.firestore().collection('users').doc(user.uid);
            const userDoc = await userDocRef.get();
            let vendorFullName = '';
            if (userDoc.exists && userDoc.data().fullName) {
                vendorFullName = userDoc.data().fullName;
            } else {
                vendorFullName = user.displayName || user.email || 'Unknown Vendor';
            }

            // Save product information to Firestore
            await window.firebase.firestore().collection('products').add({
                id: form.productId.trim(),
                name: form.productName.trim(),
                category: form.category.trim(),
                price: Number(form.price),
                status: form.status,
                vendorId: user.uid,
                vendor: vendorFullName,
                description: form.description.trim(),
                createdAt: window.firebase.firestore.FieldValue.serverTimestamp(),
            });

            setForm({
                productId: '',
                productName: '',
                category: '',
                price: '',
                status: 'available',
                description: ''
            });
            setMessage('Product added successfully!');
        } catch (error) {
            if (error.code === 'permission-denied') {
                setMessage('You do not have permission to add products.');
            } else if (error.code === 'unavailable') {
                setMessage('Service is currently unavailable. Please try again later.');
            } else if (error.code === 'auth/network-request-failed') {
                setMessage('Network error. Please check your connection.');
            } else {
                setMessage('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (<div className="dashboard-vendor-container">
            <h2>Vendor Dashboard</h2>
            <form onSubmit={handleSubmit} className="vendor-form">
                <input
                    type="text"
                    name="productId"
                    placeholder="Product ID"
                    value={form.productId}
                    onChange={handleInputChange}
                    className="vendor-input"
                    required
                />
                <input
                    type="text"
                    name="productName"
                    placeholder="Product Name"
                    value={form.productName}
                    onChange={handleInputChange}
                    className="vendor-input"
                    required
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={form.category}
                    onChange={handleInputChange}
                    className="vendor-input"
                    required
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={form.price}
                    onChange={handleInputChange}
                    className="vendor-input"
                    required
                    min="0"
                />
                <select
                    name="status"
                    value={form.status}
                    onChange={handleInputChange}
                    className="vendor-input"
                    required
                >
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                </select>
                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleInputChange}
                    className="vendor-input"
                    required
                    minLength={5}
                    rows={3}
                />
                <button type="submit" className="vendor-button">Add Product</button>
            </form>

            {message && <p className="message">{message}</p>}
        </div>);
};

export default DashboardVendor;