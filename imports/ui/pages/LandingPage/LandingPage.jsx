import React from 'react';
import NavBar from './Components/NavBar';
import HeroSection from './Components/HeroSection';
import AboutSection from './Components/AboutSection';
import FeatureSection from './Components/FeatureSection';
import SignUpSection from './Components/SignUpSection';
import Footer from './Components/Footer';
import UseCaseSection from './Components/UseCaseSection';

const LandingPage = () => {
    return (
        <div>
            <NavBar />
            <HeroSection />
            <AboutSection />
            <UseCaseSection />
            <FeatureSection />
            <SignUpSection />
            <Footer />
        </div>
    );
};

export default LandingPage;
