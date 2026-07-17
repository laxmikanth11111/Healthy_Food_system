import React from 'react';

const About = () => (
  <div className="container py-5 animate-fade-in-up" style={{ maxWidth: 860 }}>
    <div className="text-center mb-5">
      <h2 className="fw-bold serif-font display-5 text-success mb-3">About HealthyBite</h2>
      <p className="text-secondary fs-5">
        We believe eating well shouldn't be complicated. HealthyBite brings together natural
        meals, honest nutrition data, and recipes you can actually cook &mdash; all in one place.
      </p>
    </div>

    <div className="row g-4 mb-5">
      <div className="col-md-4">
        <div className="card glass-card p-4 border-0 shadow-sm h-100 text-center">
          <i className="bi bi-leaf-fill text-success display-5 mb-3"></i>
          <h5 className="fw-bold mb-2">Natural first</h5>
          <p className="text-secondary mb-0" style={{ fontSize: '0.9rem' }}>
            Every dish on our menu lists real ingredients and full macros &mdash; no guesswork.
          </p>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card glass-card p-4 border-0 shadow-sm h-100 text-center">
          <i className="bi bi-clipboard-data text-success display-5 mb-3"></i>
          <h5 className="fw-bold mb-2">Built on data</h5>
          <p className="text-secondary mb-0" style={{ fontSize: '0.9rem' }}>
            Our BMI and calorie calculators use standard clinical formulas, not guesses.
          </p>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card glass-card p-4 border-0 shadow-sm h-100 text-center">
          <i className="bi bi-people-fill text-success display-5 mb-3"></i>
          <h5 className="fw-bold mb-2">For everyone</h5>
          <p className="text-secondary mb-0" style={{ fontSize: '0.9rem' }}>
            Whether it's weight loss, muscle gain, or just eating cleaner, we've got a plan.
          </p>
        </div>
      </div>
    </div>

    <div className="card glass-card p-5 border-0 shadow-sm text-center">
      <h4 className="fw-bold mb-2">Our mission</h4>
      <p className="text-secondary mb-0">
        To make healthy eating the easy choice &mdash; not the expensive or confusing one.
      </p>
    </div>
  </div>
);

export default About;