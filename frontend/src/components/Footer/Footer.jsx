import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Toast from '../Toast/Toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setToastMsg(`Thank you for subscribing! Healthy tips sent to ${email}`);
    setEmail('');
  };

  return (
    <footer className="bg-dark text-light pt-5 pb-4 mt-5 border-top border-success border-3">
      <div className="container">
        <div className="row gap-y">
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="text-success mb-3 serif-font fs-4">
              <i className="bi bi-leaf-fill me-2"></i>HealthyBite
            </h5>
            <p className="text-secondary" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
              Nourishing your life with nature's finest ingredients. Our mission is to provide organic, fresh, and healthy recipes and meal plans tailored to your personal goals.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="btn btn-outline-success btn-sm rounded-circle" style={{ width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="btn btn-outline-success btn-sm rounded-circle" style={{ width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="btn btn-outline-success btn-sm rounded-circle" style={{ width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="bi bi-twitter-x"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="text-uppercase fw-bold text-success mb-3" style={{ fontSize: '0.85rem', tracking: '1px' }}>Quick Links</h6>
            <ul className="list-unstyled d-flex flex-column gap-2" style={{ fontSize: '0.9rem' }}>
              <li><Link to="/menu" className="text-secondary text-decoration-none hover-text-white">Our Menu</Link></li>
              <li><Link to="/recipes" className="text-secondary text-decoration-none hover-text-white">Healthy Recipes</Link></li>
              <li><Link to="/blog" className="text-secondary text-decoration-none hover-text-white">Health Blog</Link></li>
              <li><Link to="/calculator" className="text-secondary text-decoration-none hover-text-white">BMI Calculator</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="text-uppercase fw-bold text-success mb-3" style={{ fontSize: '0.85rem', tracking: '1px' }}>Support</h6>
            <ul className="list-unstyled d-flex flex-column gap-2" style={{ fontSize: '0.9rem' }}>
              <li><Link to="/about" className="text-secondary text-decoration-none hover-text-white">About Us</Link></li>
              <li><Link to="/contact" className="text-secondary text-decoration-none hover-text-white">Contact & FAQs</Link></li>
              <li><a href="#" className="text-secondary text-decoration-none hover-text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-secondary text-decoration-none hover-text-white">Terms of Use</a></li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-6 mb-4">
            <h6 className="text-uppercase fw-bold text-success mb-3" style={{ fontSize: '0.85rem', tracking: '1px' }}>Newsletter</h6>
            <p className="text-secondary mb-3" style={{ fontSize: '0.9rem' }}>
              Subscribe to get daily nutrition tips, natural meal recommendations, and exclusive discount coupons.
            </p>
            <form onSubmit={handleSubscribe}>
              <div className="input-group">
                <input
                  type="email"
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button className="btn btn-success" type="submit">Subscribe</button>
              </div>
            </form>
          </div>
        </div>

        <hr className="bg-secondary my-4" />

        <div className="row align-items-center">
          <div className="col-md-7 text-center text-md-start mb-3 mb-md-0">
            <span className="text-secondary" style={{ fontSize: '0.85rem' }}>
              © {new Date().getFullYear()} HealthyBite. Made with love for a healthy life. All rights reserved.
            </span>
          </div>
          <div className="col-md-5 text-center text-md-end">
            <span className="text-secondary me-3" style={{ fontSize: '0.85rem' }}><i className="bi bi-shield-fill-check text-success me-1"></i>Secure SSL Checkout</span>
            <i className="bi bi-credit-card-2-front text-secondary fs-4"></i>
          </div>
        </div>
      </div>
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}
    </footer>
  );
};

export default Footer;
