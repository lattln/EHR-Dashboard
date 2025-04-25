import React from 'react';
import NavBar from './Components/NavBar';
import HeroSection from './Components/HeroSection';
import AboutSection from './Components/AboutSection';
import FeatureSection from './Components/FeatureSection';
import SignUpSection from './Components/SignUpSection';
import Footer from './Components/Footer';

const LandingPage = () => {
    return (
        <div>
            <NavBar />
            <HeroSection />
            <AboutSection />
            <FeatureSection />
            <SignUpSection />
            <Footer />
        </div>
    );
};

export default LandingPage;
