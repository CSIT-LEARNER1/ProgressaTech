import React, {useState, useEffect} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {getAllItems} from '../data/items.jsx';
import './ItemListing.css';

const ItemListing = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [allItems, setAllItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const location = useLocation();

    // Fetch items whenever the route/pathname changes for strong UI sync
    useEffect(() => {
        console.log('[UI] Route changed:', location.pathname, 'Fetching items...');
        const fetchItems = async () => {
            try {
                setLoading(true);
                setError(null);
                const combinedItems = await getAllItems();
                setAllItems(combinedItems);
                console.log('[UI] Items loaded into state:', combinedItems.length);
            } catch (err) {
                console.error("[UI] Error fetching items:", err);
                setError("Failed to load items. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [location.pathname]);

    // Show all items when 'all' is selected, otherwise filter by category
    const filteredItems = selectedCategory === 'all'
        ? allItems
        : allItems.filter(item => item.category === selectedCategory);

    const handleFilterClick = category => {
        setSelectedCategory(prev => (prev === category ? 'all' : category));
    };

    if (loading) {
        return (
            <div className="item-grid loading-grid">
                {[...Array(6)].map((_, index) => (
                    <div key={index} className="item-card loading">
                        <div className="card-image-container loading-box"></div>
                        <div className="card-content">
                            <div className="loading-line short"></div>
                            <div className="loading-line"></div>
                            <div className="loading-line"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="item-listing-wrapper">
            <aside className="sidebar">
                <h2>Filter by Category</h2>
                <div className="sidebar-filters">
                    <span className={`filter ${selectedCategory === 'all' ? 'active' : ''}`}
                          onClick={() => handleFilterClick('all')}>All Items</span>
                    <span className={`filter ${selectedCategory === 'electronics' ? 'active' : ''}`}
                          onClick={() => handleFilterClick('electronics')}>Electronics</span>
                    <span className={`filter ${selectedCategory === 'clothing' ? 'active' : ''}`}
                          onClick={() => handleFilterClick('clothing')}>Clothing</span>
                    <span className={`filter ${selectedCategory === 'travelgear' ? 'active' : ''}`}
                          onClick={() => handleFilterClick('travelgear')}>Travel Gear</span>
                    <span className={`filter ${selectedCategory === 'books' ? 'active' : ''}`}
                          onClick={() => handleFilterClick('books')}>Books</span>
                </div>
            </aside>

            <main className="item-listing">
                <header className="listing-header">
                    <h1>
                        {selectedCategory === 'all'
                            ? 'All Items'
                            : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Items`}
                    </h1>
                </header>

                <div className="item-grid">
                    {filteredItems.length > 0 ? (
                        filteredItems.map(item => (
                            <Link
                                to={`/items/${item.category}/${item.id}`}
                                key={item.id}
                                className={`item-card ${item.status || 'unknown'}`}
                            >
                                <div className="card-image-container">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name || 'Item'}
                                             className="card-image"/>
                                    ) : (
                                        <div className="card-image placeholder">No Image</div>
                                    )}
                                </div>
                                <div className="card-content">
                                    <h3>{item.name || 'Unnamed Item'}</h3>
                                    <div className="item-row">
                                        <span className="item-label">Category:</span>
                                        <span className="item-value">{item.category || 'N/A'}</span>
                                    </div>
                                    <div className="item-row">
                                        <span className="item-label">Price:</span>
                                        <span className="item-value">{item.price || 'N/A'}</span>
                                    </div>
                                    <div className="item-row">
                                        <span className="item-label">Status:</span>
                                        <span className={`status ${item.status || 'unknown'}`}>
                                            {item.status === 'available' ? 'Available' : item.status === 'rented' ? 'Rented' : 'Unknown'}
                                        </span>
                                    </div>
                                    <div className="item-row">
                                        <span className="item-label">Vendor:</span>
                                        {/* Display vendor name with fallback to 'Unknown Vendor' */}
                                        <span className="item-value">{item.vendor || 'Unknown Vendor'}</span>
                                    </div>
                                    <p className="description">{item.description || 'No description available.'}</p>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="no-items">
                            <p>No items
                                found{selectedCategory !== 'all' ? ` in category: ${selectedCategory}` : ''}.</p>
                            {/* Log fallback in UI */}
                            {allItems.length === 0 && (
                                <div style={{color: "#d00", marginTop: 16}}>
                                    No data? Check browser console and Firestore connection.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ItemListing;
