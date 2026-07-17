import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItems } = useCart();
  const { favorites } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top py-3">
      <div className="container">
        <Link className="navbar-brand navbar-brand-logo d-flex align-items-center fs-3" to="/">
          <i className="bi bi-leaf-fill me-2 text-success"></i>
          HealthyBite
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-2">
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 py-2 fw-medium rounded ${isActive ? 'text-success bg-success bg-opacity-10' : 'text-secondary'}`} to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 py-2 fw-medium rounded ${isActive ? 'text-success bg-success bg-opacity-10' : 'text-secondary'}`} to="/menu">
                Menu
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 py-2 fw-medium rounded ${isActive ? 'text-success bg-success bg-opacity-10' : 'text-secondary'}`} to="/recipes">
                Recipes
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 py-2 fw-medium rounded ${isActive ? 'text-success bg-success bg-opacity-10' : 'text-secondary'}`} to="/blog">
                Blog
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 py-2 fw-medium rounded ${isActive ? 'text-success bg-success bg-opacity-10' : 'text-secondary'}`} to="/calculator">
                BMI Calculator
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 py-2 fw-medium rounded ${isActive ? 'text-success bg-success bg-opacity-10' : 'text-secondary'}`} to="/about">
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 py-2 fw-medium rounded ${isActive ? 'text-success bg-success bg-opacity-10' : 'text-secondary'}`} to="/contact">
                Contact
              </NavLink>
            </li>
          </ul>
          <div className="d-flex align-items-center gap-3">
            {/* Theme Toggle */}
            <div className="theme-switch" onClick={toggleTheme}>
              <i className={`bi ${theme === 'light' ? 'bi-moon-stars-fill' : 'bi-sun-fill'}`}></i>
            </div>

            {/* Wishlist */}
            <Link className="position-relative text-success fs-5 px-2" to="/dashboard?tab=wishlist">
              <i className="bi bi-heart-fill"></i>
              {favorites.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link className="position-relative text-success fs-5 px-2" to="/cart">
              <i className="bi bi-cart-fill"></i>
              {totalCartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark" style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>
                  {totalCartCount}
                </span>
              )}
            </Link>

            {/* User Dropdown / Login */}
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-custom btn-rounded dropdown-toggle d-flex align-items-center gap-2"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle fs-5"></i>
                  <span className="d-none d-md-inline">{user?.name?.split(' ')[0]}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 p-2" aria-labelledby="userDropdown" style={{ minWidth: '200px', borderRadius: '12px' }}>
                  <li>
                    <Link className="dropdown-item rounded py-2" to="/dashboard">
                      <i className="bi bi-speedometer2 me-2"></i> Dashboard
                    </Link>
                  </li>
                  {user?.role === 'ROLE_ADMIN' && (
                    <li>
                      <Link className="dropdown-item rounded py-2 text-danger" to="/admin">
                        <i className="bi bi-shield-lock-fill me-2"></i> Admin Panel
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item rounded py-2 text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link className="btn btn-primary-custom btn-rounded" to="/login">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
