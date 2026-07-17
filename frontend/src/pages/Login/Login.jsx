import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/Toast/Toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      await login({ email, password });
      setSuccessMsg('Logged in successfully! Welcome back.');
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1500);
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg(err.response?.data?.message || 'Invalid email or password.');
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
              <h2 className="fw-bold mt-2 serif-font">Welcome Back</h2>
              <p className="text-muted">Sign in to track your nutrition goals</p>
            </div>

            {errorMsg && (
              <div className="alert alert-danger border-0 p-3 rounded" style={{ fontSize: '0.88rem' }}>
                <i className="bi bi-exclamation-triangle-fill me-2"></i> {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-medium">Email address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><i className="bi bi-envelope text-success"></i></span>
                  <input
                    type="email"
                    className="form-control bg-light border-start-0"
                    placeholder="name@healthybite.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between">
                  <label className="form-label fw-medium">Password</label>
                  <Link to="/forgot-password" className="text-success text-decoration-none" style={{ fontSize: '0.88rem' }}>
                    Forgot password?
                  </Link>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><i className="bi bi-lock text-success"></i></span>
                  <input
                    type="password"
                    className="form-control bg-light border-start-0"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                {submitting ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>

            <div className="text-center mt-4">
              <span className="text-secondary" style={{ fontSize: '0.9rem' }}>New to HealthyBite? </span>
              <Link to="/register" className="text-success fw-bold text-decoration-none" style={{ fontSize: '0.9rem' }}>
                Create an Account
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {successMsg && <Toast message={successMsg} type="success" onClose={() => setSuccessMsg('')} />}
    </div>
  );
};

export default Login;
