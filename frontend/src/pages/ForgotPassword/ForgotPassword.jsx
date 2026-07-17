import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import Toast from '../../components/Toast/Toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      await authAPI.forgotPassword(email);
      setSuccessMsg('A password reset link has been dispatched to your email.');
      setEmail('');
    } catch (err) {
      console.error('Forgot password error:', err);
      setErrorMsg(err.response?.data?.message || 'Error occurred. Please verify your email.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-center" style={{ minHeight: '65vh' }}>
        <div className="col-md-5">
          <div className="card glass-card p-4 p-md-5 shadow border-0 animate-fade-in-up">
            <div className="text-center mb-4">
              <i className="bi bi-shield-lock-fill text-success fs-1"></i>
              <h2 className="fw-bold mt-2 serif-font">Recover Password</h2>
              <p className="text-muted">Enter your email to receive recovery instructions</p>
            </div>

            {errorMsg && (
              <div className="alert alert-danger border-0 p-3 rounded" style={{ fontSize: '0.88rem' }}>
                <i className="bi bi-exclamation-triangle-fill me-2"></i> {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
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

              <button
                type="submit"
                className="btn btn-primary-custom w-100 btn-rounded py-2 fw-semibold d-flex justify-content-center align-items-center"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                ) : null}
                {submitting ? 'Sending...' : 'Send Recovery Link'}
              </button>
            </form>

            <div className="text-center mt-4">
              <Link to="/login" className="text-success fw-bold text-decoration-none" style={{ fontSize: '0.9rem' }}>
                <i className="bi bi-arrow-left me-1"></i> Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {successMsg && <Toast message={successMsg} type="success" onClose={() => setSuccessMsg('')} />}
    </div>
  );
};

export default ForgotPassword;
