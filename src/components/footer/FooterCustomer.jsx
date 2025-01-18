// FooterCustomer.jsx
import React from 'react';
import './FooterCustomer.css';

const FooterCustomer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-column">
                <h3>Vaccine Care support</h3>
                <p>Consultation: <span className="phone-number">0325 643 914</span></p>
                <p>Contact: <span className="phone-number">0325 643 914</span></p>
            </div>

            <div className="footer-column">
                <h3>Our company</h3>
                <a href="/introduction">Introduction</a>
                <a href="/hire">Hire</a>
            </div>

          

            {/* <div className="footer-column">
                <h3>Our collaborators</h3>
                <div className="collaborators-logos">
                    <a href="https://cellphones.com.vn/" target="_blank" rel="noopener noreferrer">
                        <img src={CellPhoneS} alt="CellPhoneS" />
                    </a>
                    <a href="https://www.thegioididong.com/" target="_blank" rel="noopener noreferrer">
                        <img src={Amazon} alt="Amazon" />
                    </a>
                    <a href="https://www.amazon.com/" target="_blank" rel="noopener noreferrer">
                        <img src={TGDD} alt="TheGioiDiDong" />
                    </a>
                </div>
            </div> */}
        </footer>
    );
};

export default FooterCustomer;
