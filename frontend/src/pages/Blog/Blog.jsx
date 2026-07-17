import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../../services/api';
import Loader from '../../components/Loader/Loader';

const CATEGORIES = ['All', 'Health Tips', 'Natural Foods', 'Fitness', 'Nutrition'];

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const request = category === 'All' ? blogAPI.getBlogs() : blogAPI.getBlogsByCategory(category);
    request
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error('Failed to load blogs', err))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="container py-5 animate-fade-in-up">
      <div className="text-center mb-5">
        <h2 className="fw-bold serif-font display-5 text-success mb-2">Health &amp; Nutrition Blog</h2>
        <p className="text-secondary">Tips, guides and stories on eating well and living naturally.</p>
      </div>

      <div className="d-flex justify-content-center gap-2 mb-5 flex-wrap">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`btn btn-sm rounded-pill px-3 ${category === c ? 'btn-primary-custom' : 'btn-outline-custom'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader text="Loading articles…" />
      ) : blogs.length === 0 ? (
        <div className="text-center py-5 text-secondary">
          <i className="bi bi-newspaper display-4 mb-3 opacity-25 d-block"></i>
          No articles in this category yet.
        </div>
      ) : (
        <div className="row g-4">
          {blogs.map((blog) => (
            <div key={blog.id} className="col-sm-6 col-lg-4">
              <div className="card glass-card h-100 overflow-hidden border-0 shadow-sm">
                <div style={{ height: 180, overflow: 'hidden' }}>
                  <img
                    src={blog.imageUrl || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80'}
                    alt={blog.title}
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
                <div className="card-body p-4 d-flex flex-column">
                  {blog.category && (
                    <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1 mb-2 align-self-start">
                      {blog.category}
                    </span>
                  )}
                  <h5 className="fw-bold mb-2">{blog.title}</h5>
                  <p className="text-secondary mb-3" style={{ fontSize: '0.88rem' }}>
                    {blog.content?.slice(0, 100)}{blog.content?.length > 100 ? '…' : ''}
                  </p>
                  <div className="mt-auto d-flex justify-content-between align-items-center pt-3 border-top">
                    <small className="text-muted">{blog.author} · {new Date(blog.publishDate).toLocaleDateString()}</small>
                    <Link to={`/blog/${blog.id}`} className="btn btn-sm btn-outline-custom rounded-pill">Read</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;