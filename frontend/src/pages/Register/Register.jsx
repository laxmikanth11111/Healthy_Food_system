import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/Toast/Toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      await register({ name, email, password });
      setSuccessMsg('Account created successfully! Welcome to HealthyBite.');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error('Registration error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to register account. User may already exist.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <div className="col-md-5">
          <div className="card glass-card p-4 p-md-5 shadow border-0 animate-fade-in-up">
            <div className="text-center mb-4">
              <i className="bi bi-leaf-fill text-success fs-1"></i>
              <h2 className="fw-bold mt-2 serif-font">Create Account</h2>
              <p className="text-muted">Start your journey to organic natural eating</p>
            </div>

            {errorMsg && (
              <div className="alert alert-danger border-0 p-3 rounded" style={{ fontSize: '0.88rem' }}>
                <i className="bi bi-exclamation-triangle-fill me-2"></i> {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-medium">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><i className="bi bi-person text-success"></i></span>
                  <input
                    type="text"
                    className="form-control bg-light border-start-0"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">Email address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><i className="bi bi-envelope text-success"></i></span>
                  <input
                    type="email"
                    className="form-control bg-light border-start-0"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><i className="bi bi-lock text-success"></i></span>
                  <input
                    type="password"
                    className="form-control bg-light border-start-0"
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium">Confirm Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><i className="bi bi-shield-lock text-success"></i></span>
                  <input
                    type="password"
                    className="form-control bg-light border-start-0"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary-custom w-100 btn-rounded py-2 fw-semibold d-flex justify-content-center align-items-center"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                ) : null}
                {submitting ? 'Registering...' : 'Sign Up'}
              </button>
            </form>

            <div className="text-center mt-4">
              <span className="text-secondary" style={{ fontSize: '0.9rem' }}>Already have an account? </span>
              <Link to="/login" className="text-success fw-bold text-decoration-none" style={{ fontSize: '0.9rem' }}>
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {successMsg && <Toast message={successMsg} type="success" onClose={() => setSuccessMsg('')} />}
    </div>
  );
};

export default Register;
