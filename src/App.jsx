import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import About from './pages/About';
import ItemListing from './pages/ItemListing';
import ItemDetail from './pages/ItemDetail';
import Admin from './pages/Admin';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import DashboardVendor from './pages/DashboardVendor';
import DashboardRenter from './pages/DashboardRenter';
import './App.css';

function App() {
    return (
        <Router>
            <div className="app">
                <Navbar/>
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<ItemListing/>}/>
                        <Route path="/about" element={<About/>}/>
                        <Route path="/items" element={<ItemListing/>}/>
                        <Route path="/items/:category/:id" element={<ItemDetail/>}/>
                        <Route path="/admin" element={<Admin/>}/>
                        <Route path="/signup" element={<SignUp/>}/>
                        <Route path="/signin" element={<SignIn/>}/>
                        <Route path="/DashboardVendor" element={<DashboardVendor/>}/>
                        <Route path="/DashboardRenter" element={<DashboardRenter/>}/>
                        <Route path="/dashboard-renter" element={<DashboardRenter/>}/>
                    </Routes>
                </main>
                <Footer/>
            </div>
        </Router>
    );
}

export default App;
