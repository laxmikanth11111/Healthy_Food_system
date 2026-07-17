import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogAPI } from '../../services/api';
import Loader from '../../components/Loader/Loader';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    blogAPI.getBlogById(id)
      .then((res) => setBlog(res.data))
      .catch((err) => console.error('Failed to load blog', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader text="Loading article…" />;
  if (!blog) {
    return (
      <div className="container py-5 text-center">
        <h4 className="fw-bold">Article not found</h4>
        <Link to="/blog" className="btn btn-primary-custom btn-rounded mt-3">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="container py-5 animate-fade-in-up" style={{ maxWidth: 820 }}>
      <Link to="/blog" className="text-success text-decoration-none mb-4 d-inline-block">
        <i className="bi bi-arrow-left me-2"></i>Back to Blog
      </Link>

      {blog.category && (
        <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1 mb-3">{blog.category}</span>
      )}
      <h1 className="fw-bold serif-font mb-3">{blog.title}</h1>
      <div className="text-muted mb-4">
        By <strong>{blog.author}</strong> · {new Date(blog.publishDate).toLocaleDateString()}
      </div>

      <img
        src={blog.imageUrl || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80'}
        alt={blog.title}
        className="w-100 rounded-4 shadow-sm object-fit-cover mb-4"
        style={{ height: 360 }}
      />

      <div style={{ whiteSpace: 'pre-line', lineHeight: 1.9, fontSize: '1.05rem' }} className="text-secondary">
        {blog.content}
      </div>
    </div>
  );
};

export default BlogDetail;