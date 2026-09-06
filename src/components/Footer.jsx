import React from 'react';
import './Footer.css';
import logo from '../assets/ChatGPT Image Aug 11, 2026, 03_32_46 PM.png';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-brand">
          <img src={logo} alt="AREANIX Logo" className="footer-logo" />
          <p className="footer-desc">
            The ultimate competitive esports platform for BGMI, Valorant, Free Fire, and Stumble Guys athletes and Other Competetive Esports Games. Compete, win, and claim your glory.
          </p>
        </div>

        <div className="footer-links-group">
          <div className="footer-col">
            <h4>Platform</h4>
            <a href="#tournaments">Tournaments</a>
            <a href="#leaderboard">Leaderboards</a>
            <a href="#games">Games</a>
            <a href="#rules">Fair Play & Anti-Cheat</a>
          </div>

          <div className="footer-col">
            <h4>Community</h4>
            <a href="#discord">Discord Server</a>
            <a href="#teams">Find Squads</a>
            <a href="#organizers">Host Tournament</a>
            <a href="#help">Support Center</a>
          </div>

          <div className="footer-col">
            <h4>Legal</h4>
            <a href="#terms">Terms of Service</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#payouts">Refund & Payout Policy</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} AREANIX Esports Platform. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
