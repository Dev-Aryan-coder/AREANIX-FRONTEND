import React from 'react';
import './Home.css';
import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import PlatformFeatures from '../components/PlatformFeatures';
import CompetitiveCategories from '../components/CompetitiveCategories';
import SupportedGames from '../components/SupportedGames';
import HowItWorks from '../components/HowItWorks';
import WhyChooseUs from '../components/WhyChooseUs';
import Footer from '../components/Footer';

const Home = ({ activePage, setActivePage, userProfile, setUserProfile }) => {
  return (
    <div className="home-page">
      <Navbar activePage={activePage} setActivePage={setActivePage} userProfile={userProfile} setUserProfile={setUserProfile} />
      <HeroBanner setActivePage={setActivePage} />
      <div className="home-content-section">
        <PlatformFeatures />
        <div className="section-divider-line" />
        <CompetitiveCategories />
        <div className="section-divider-line" />
        <SupportedGames />
        <div className="section-divider-line" />
        <HowItWorks />
        <div className="section-divider-line" />
        <WhyChooseUs />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
