import React from 'react';
import './PublicPages.css';
import './AboutusPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="container">
        <section className="about-header">
          <h1>About Us</h1>
          <p className="subtitle">Learn more about our company and mission</p>
        </section>
        
        <section className="about-content">
        <div className="about-section">
            <h2>Our vision</h2>
            <p>
            We aim to empower legal professionals with technology to enhance productivity and client satisfaction. 


            </p>
          </div>
          <div className="about-section">
            <h2>Our Mission</h2>
            <p>
            We strive to revolutionize legal case management by offering a seamless and efficient platform tailored for Sri Lankan law chambers. 

            </p>
          </div>
          
          <div className="about-section">
            <h2>Our Team</h2>
            <div className="team-grid">
              <div className="team-member">
                <div className="member-photo"></div>
                <h3>Prashadi Krishnamoorthy</h3>
                <p>CEO & Founder</p>
              </div>
              <div className="team-member">
                <div className="member-photo"></div>
                <h3>Prabashan Krishnamoorthy</h3>
                <p>CTO</p>
              </div>
              
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;