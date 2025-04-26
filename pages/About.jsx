import React from 'react';
import {useNavigate} from 'react-router-dom';
import {GiClothes, GiElectric, GiCampingTent} from "react-icons/gi";
import {FaShopify} from "react-icons/fa";
import './About.css';

// About page component
export default function About() {
    const navigate = useNavigate();

    // Featured categories
    const categories = [{
        title: "Clothing",
        categoryKey: "clothing",
        description: "Trendy outfits for every occasion. Rent, wear, and return with ease.",
        icon: <GiClothes size={48}/>
    }, {
        title: "Electronics",
        categoryKey: "electronics",
        description: "Latest gadgets and appliances for your daily needs.",
        icon: <GiElectric size={48}/>
    }, {
        title: "Travel Gear",
        categoryKey: "travelgear",
        description: "Backpacks, tents, and more for your next adventure.",
        icon: <GiCampingTent size={48}/>
    }];

    // Navigate to items page with category param
    const handleExplore = (categoryKey) => {
        navigate(`/items?category=${categoryKey}`);
    };

    return (<main className="home">
        {/* Hero section */}
        <section className="hero">
            <div className="hero-content">
                <h1 className="hero-title"> Sajilo Rent <FaShopify size={60}/></h1>
                <p className="hero-subtitle"><i>Your Trusted Partner for Smart, Convenient
                    Renting</i></p>

                <p className="hero-tagline">Rent Smart. Save More. Live Freely – Without the
                    Burden of Ownership!</p>
            </div>
        </section>

        {/* Featured products section */}
        <section className="featured-section">
            <div className="section-header">
                <h2 className="section-title">Featured Products</h2>
                <p className="section-description">Discover our premium rental collection</p>
            </div>

            <div className="category-grid">
                {categories.map((category, index) => (<div key={index} className="category-card">
                    <div className="category-icon">{category.icon}</div>
                    <h3 className="category-title">{category.title}</h3>
                    <p className="category-description">{category.description}</p>
                    <button
                        className="explore-btn"
                        onClick={() => handleExplore(category.categoryKey)}
                    >
                        Explore Collection
                    </button>
                </div>))}
            </div>
        </section>
    </main>);
}