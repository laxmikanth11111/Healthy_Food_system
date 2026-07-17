import React, { useState } from 'react';
import { contactAPI } from '../../services/api';
import Toast from '../../components/Toast/Toast';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await contactAPI.send(form);
      setToastType('success');
      setToastMsg(res.data.message || 'Message sent!');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setToastType('error');
      setToastMsg(err.response?.data?.message || 'Could not send your message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container py-5 animate-fade-in-up" style={{ maxWidth: 700 }}>
      <div className="text-center mb-5">
        <h2 className="fw-bold serif-font display-5 text-success mb-2">Get in Touch</h2>
        <p className="text-secondary">Questions, feedback, or partnership ideas &mdash; we'd love to hear from you.</p>
      </div>

      <div className="card glass-card p-4 p-md-5 border-0 shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-medium">Your name</label>
              <input type="text" className="form-control bg-light border-0 py-2" required value={form.name} onChange={handleChange('name')} />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-medium">Email</label>
              <input type="email" className="form-control bg-light border-0 py-2" required value={form.email} onChange={handleChange('email')} />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label fw-medium">Subject</label>
            <input type="text" className="form-control bg-light border-0 py-2" required value={form.subject} onChange={handleChange('subject')} />
          </div>
          <div className="mb-4">
            <label className="form-label fw-medium">Message</label>
            <textarea className="form-control bg-light border-0 py-2" rows="5" required value={form.message} onChange={handleChange('message')} />
          </div>
          <button type="submit" className="btn btn-primary-custom w-100 btn-rounded py-3 fw-semibold" disabled={sending}>
            {sending ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
            {sending ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </div>

      {toastMsg && <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />}
    </div>
  );
};

export default Contact;